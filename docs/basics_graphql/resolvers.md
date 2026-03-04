# GraphQL Resolvers (Резолверы)

## Что такое Resolver?

Resolver — это функция, которая возвращает данные для поля в GraphQL схеме. Это "реализация" того, как получить данные.

```
Schema (ЧТО) → Resolver (КАК)
```

## Синтаксис базового резолвера

```typescript
const resolvers = {
  Query: {
    user: (parent, args, context, info) => {
      return {
        id: '1',
        name: 'John Doe'
      };
    }
  }
};
```

## Параметры резолвера

```typescript
function resolver(parent, args, context, info) {
  // parent - результат резолвера родительского поля
  // args - аргументы переданные в запросе
  // context - объект с общей информацией (token, БД и т.д)
  // info - информация о запросе
}
```

### Пример с параметрами

```typescript
const resolvers = {
  Query: {
    user: (parent, args, context, info) => {
      // parent = undefined (это Query - корневой тип)
      // args = { id: '123' }
      // context = { db, userId, token }
      // info = { fieldName: 'user', ... }

      return context.db.users.find(u => u.id === args.id);
    }
  }
};
```

## Резолверы для вложенных полей

```typescript
const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    posts: [Post!]!
  }

  type Post {
    id: ID!
    title: String!
    author: User!
  }
`;

const resolvers = {
  Query: {
    user: (_, { id }, { db }) => {
      return db.users.find(u => u.id === id);
    }
  },
  User: {
    posts: (parent, args, { db }) => {
      // parent - это объект User
      return db.posts.filter(p => p.authorId === parent.id);
    }
  },
  Post: {
    author: (parent, args, { db }) => {
      // parent - это объект Post
      return db.users.find(u => u.id === parent.authorId);
    }
  }
};
```

## Асинхронные резолверы

```typescript
const resolvers = {
  Query: {
    user: async (_, { id }, { db }) => {
      return await db.users.findById(id);
    }
  },
  User: {
    posts: async (parent, _, { db }) => {
      return await db.posts.find({ authorId: parent.id });
    }
  }
};
```

## Обработка ошибок

```typescript
const resolvers = {
  Mutation: {
    createUser: async (_, { input }, { db }) => {
      try {
        // Валидация
        if (!input.email.includes('@')) {
          throw new Error('Invalid email');
        }

        // Создание
        const user = await db.users.create(input);
        return user;
      } catch (error) {
        throw new Error(`Failed to create user: ${error.message}`);
      }
    }
  }
};
```

## Context в резолверах

```typescript
// Создание сервера с context
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // Получаем token из headers
    const token = req.headers.authorization?.split('Bearer ')[1];

    return {
      db: database,
      userId: getUserIdFromToken(token),
      token
    };
  }
});
```

Использование context:

```typescript
const resolvers = {
  Mutation: {
    createPost: async (_, { input }, context) => {
      if (!context.userId) {
        throw new Error('Not authenticated');
      }

      return context.db.posts.create({
        ...input,
        authorId: context.userId
      });
    }
  }
};
```

## Default резолверы

GraphQL автоматически создает резолверы для полей:

```typescript
// Если у вас нет явного резолвера для User.name,
// GraphQL автоматически вернет parent.name

const user = { id: '1', name: 'John' };
// GraphQL сделает: (parent) => parent.name === 'John'
```

## Резолверы с трансформацией

```typescript
const resolvers = {
  User: {
    fullName: (parent) => {
      return `${parent.firstName} ${parent.lastName}`;
    },
    age: (parent) => {
      const birthDate = new Date(parent.birthDate);
      return Math.floor((Date.now() - birthDate) / 31536000000);
    }
  }
};
```

## Batch резолверы

### Проблема: N+1

```typescript
// Плохо - запрос для каждого поста
const resolvers = {
  User: {
    posts: (parent, _, { db }) => {
      // Для каждого пользователя - отдельный запрос!
      return db.posts.find({ authorId: parent.id });
    }
  }
};
```

### Решение: DataLoader

```typescript
import DataLoader from 'dataloader';

const postsByUserIdLoader = new DataLoader(async (userIds) => {
  const posts = await db.posts.find({
    authorId: { $in: userIds }
  });

  return userIds.map(userId =>
    posts.filter(p => p.authorId === userId)
  );
});

const resolvers = {
  User: {
    posts: (parent, _, context) => {
      return context.postsByUserIdLoader.load(parent.id);
    }
  }
};
```

## Middleware резолверы

```typescript
// Middleware для логирования
const loggingMiddleware = (fn) => async (...args) => {
  console.log(`Resolver called with args:`, args[1]);
  const result = await fn(...args);
  console.log(`Resolver returned:`, result);
  return result;
};

const resolvers = {
  Query: {
    user: loggingMiddleware(async (_, { id }, { db }) => {
      return await db.users.findById(id);
    })
  }
};
```

## Резолверы с проверкой доступа

```typescript
const requireAuth = (fn) => async (...args) => {
  const context = args[2];
  if (!context.userId) {
    throw new Error('Not authenticated');
  }
  return fn(...args);
};

const requireRole = (role) => (fn) => async (...args) => {
  const context = args[2];
  const user = await context.db.users.findById(context.userId);
  if (user.role !== role) {
    throw new Error(`Required role: ${role}`);
  }
  return fn(...args);
};

const resolvers = {
  Mutation: {
    deleteUser: requireAuth(
      requireRole('ADMIN')(async (_, { id }, { db }) => {
        return await db.users.deleteById(id);
      })
    )
  }
};
```

## Лучшие практики

✅ **Делайте:**
1. Используйте context для БД и authentication
2. Обрабатывайте ошибки с понятными сообщениями
3. Используйте DataLoader для батчинга
4. Кешируйте результаты где возможно
5. Логируйте важные операции

❌ **Не делайте:**
1. ❌ Не блокируйте операции
2. ❌ Не делайте N+1 запросы
3. ❌ Не забывайте проверки доступа
4. ❌ Не доверяйте пользовательским данным

## Дальше

Изучите [Apollo Server](/basics_graphql/apollo-server) для создания полноценного сервера.
