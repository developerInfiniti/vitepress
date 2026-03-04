# GraphQL Best Practices

## Проектирование Schema

### 1. Используйте Prefix для связанных типов

```graphql
# ✅ Хорошо
type User {
  id: ID!
  name: String!
}

type UserProfile {
  user: User!
  bio: String
}

# ❌ Плохо
type User {
  id: ID!
  name: String!
  userBio: String
  userAvatar: String
}
```

### 2. Используйте Enum вместо Boolean где возможно

```graphql
# ✅ Хорошо
enum UserRole {
  ADMIN
  MODERATOR
  USER
}

type User {
  role: UserRole!
}

# ❌ Плохо
type User {
  isAdmin: Boolean!
  isModerator: Boolean!
  isUser: Boolean!
}
```

### 3. Используйте Input типы

```graphql
# ✅ Хорошо
input CreateUserInput {
  name: String!
  email: String!
}

type Mutation {
  createUser(input: CreateUserInput!): User!
}

# ❌ Плохо
type Mutation {
  createUser(
    name: String!
    email: String!
    age: Int
    avatar: String
    bio: String
  ): User!
}
```

## Резолверы

### 1. Обрабатывайте N+1 проблему

```typescript
// ❌ Плохо - N+1 запросы
const resolvers = {
  User: {
    posts: (parent) => {
      return db.posts.find({ authorId: parent.id }); // Запрос для каждого пользователя!
    }
  }
};

// ✅ Хорошо - батчинг
import DataLoader from 'dataloader';

const postLoader = new DataLoader(async (userIds) => {
  const posts = await db.posts.find({ authorId: { $in: userIds } });
  return userIds.map(id => posts.filter(p => p.authorId === id));
});

const resolvers = {
  User: {
    posts: (parent, _, { postLoader }) => {
      return postLoader.load(parent.id);
    }
  }
};
```

### 2. Валидируйте входные данные

```typescript
// ✅ Хорошо
const resolvers = {
  Mutation: {
    createUser: (_, { input }, { db }) => {
      // Валидация
      if (!input.email?.includes('@')) {
        throw new Error('Invalid email');
      }
      if (input.password?.length < 8) {
        throw new Error('Password must be at least 8 characters');
      }

      return db.users.create(input);
    }
  }
};
```

### 3. Используйте context для аутентификации

```typescript
// ✅ Хорошо
const resolvers = {
  Mutation: {
    deleteUser: (_, { id }, context) => {
      if (!context.userId) {
        throw new Error('Not authenticated');
      }
      if (context.userId !== id && context.userRole !== 'ADMIN') {
        throw new Error('Forbidden');
      }
      return db.users.deleteById(id);
    }
  }
};
```

## Производительность

### 1. Ограничивайте глубину запросов

```typescript
import { ValidationRule, ValidationContext } from 'graphql';

const depthLimit = (maxDepth = 5): ValidationRule => (context) => {
  // Реализация ограничения глубины
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  validationRules: [depthLimit(5)]
});
```

### 2. Ограничивайте размер запроса

```typescript
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: {
    didResolveOperation(context) {
      const operation = context.request.operationName;
      const complexity = getQueryComplexity(context.document);

      if (complexity > 1000) {
        throw new Error('Query too complex');
      }
    }
  }
});
```

### 3. Кешируйте результаты

```typescript
// ✅ Хорошо - с кешированием
const resolvers = {
  Query: {
    user: async (_, { id }, { db, cache }) => {
      const cacheKey = `user:${id}`;
      let user = cache.get(cacheKey);

      if (!user) {
        user = await db.users.findById(id);
        cache.set(cacheKey, user, 3600); // 1 час
      }

      return user;
    }
  }
};
```

## Безопасность

### 1. Никогда не доверяйте пользовательским данным

```typescript
// ❌ Плохо
const resolvers = {
  Mutation: {
    executeQuery: (_, { query }) => {
      return db.query(query); // SQL injection!
    }
  }
};

// ✅ Хорошо
const resolvers = {
  Mutation: {
    getUser: (_, { id }, { db }) => {
      return db.users.findById(id); // Параметризованный запрос
    }
  }
};
```

### 2. Скрывайте внутренние ошибки

```typescript
// ✅ Хорошо
const server = new ApolloServer({
  formatError: (error) => {
    if (process.env.NODE_ENV === 'production') {
      return { message: 'Internal server error' };
    }
    return error;
  }
});
```

### 3. Отключайте introspection в production

```typescript
// ✅ Хорошо
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: process.env.NODE_ENV !== 'production'
});
```

### 4. Используйте HTTPS

```javascript
// Всегда используйте HTTPS для production
// Это защищает токены аутентификации
```

## API дизайн

### 1. Версионируйте через расширение, не URL

```graphql
# ❌ Плохо - /graphql/v1, /graphql/v2
# ✅ Хорошо - одна точка входа

type Query {
  user(id: ID!): User
  # Можно добавить новые поля без破ing старых запросов
}
```

### 2. Используйте relayConnections для пагинации

```graphql
# ✅ Хорошо - стандартный паттерн
type UserConnection {
  edges: [UserEdge!]!
  pageInfo: PageInfo!
}

type UserEdge {
  node: User!
  cursor: String!
}

type PageInfo {
  hasNextPage: Boolean!
  endCursor: String
}

type Query {
  users(first: Int!, after: String): UserConnection!
}
```

### 3. Возвращайте обогащённые ошибки

```graphql
# ✅ Хорошо
type CreateUserPayload {
  user: User
  errors: [Error!]!
}

type Error {
  field: String!
  message: String!
}

type Mutation {
  createUser(input: CreateUserInput!): CreateUserPayload!
}
```

## Мониторинг и Логирование

```typescript
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: {
    requestDidStart(requestContext) {
      const startTime = Date.now();

      return {
        didResolveOperation(context) {
          console.log(`Operation: ${context.operationName}`);
        },
        didEncounterErrors(context) {
          console.error('Errors:', context.errors);
        },
        willSendResponse(context) {
          const duration = Date.now() - startTime;
          console.log(`Query took ${duration}ms`);
        }
      };
    }
  }
});
```

## Версионирование

### Паттерн для добавления новых полей

```graphql
# v1
type User {
  id: ID!
  name: String!
  email: String!
}

# v2 - добавляем новое поле (не breaking)
type User {
  id: ID!
  name: String!
  email: String!
  avatar: String  # Новое поле
}

# Если нужно удалить - используем @deprecated
type User {
  id: ID!
  name: String!
  email: String!
  avatar: String
  oldField: String @deprecated(reason: "Use newField instead")
  newField: String
}
```

## Дальше

Изучите [Interview Questions](/basics_graphql/interview-questions) для подготовки к собеседованиям.
