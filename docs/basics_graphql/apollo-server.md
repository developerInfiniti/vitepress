---
description: "Apollo Server: настройка, резолверы, контекст, middleware — создание GraphQL сервера на Node.js"
---

# Apollo Server

## Что такое Apollo Server?

Apollo Server — это JavaScript/TypeScript сервер для GraphQL. Самое популярное решение для Node.js.

## Установка

```bash
npm install apollo-server @apollo/client graphql
```

## Создание базового сервера

```typescript
import { ApolloServer, gql } from 'apollo-server';

// Определяем типы
const typeDefs = gql`
  type Query {
    hello: String
  }
`;

// Определяем резолверы
const resolvers = {
  Query: {
    hello: () => 'Привет, мир!'
  }
};

// Создаем сервер
const server = new ApolloServer({
  typeDefs,
  resolvers
});

// Запускаем сервер
server.listen({ port: 4000 }).then(({ url }) => {
  console.log(`Сервер запущен на ${url}`);
});
```

## Полный пример с данными

```typescript
import { ApolloServer, gql } from 'apollo-server';

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Query {
    user(id: ID!): User
    users: [User!]!
  }

  type Mutation {
    createUser(name: String!, email: String!): User!
  }
`;

// Временное хранилище
const users = [
  { id: '1', name: 'John', email: 'john@example.com' },
  { id: '2', name: 'Jane', email: 'jane@example.com' }
];

const resolvers = {
  Query: {
    user: (_, { id }) => users.find(u => u.id === id),
    users: () => users
  },
  Mutation: {
    createUser: (_, { name, email }) => {
      const user = {
        id: String(users.length + 1),
        name,
        email
      };
      users.push(user);
      return user;
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.listen({ port: 4000 });
```

## Context

Context позволяет передать данные всем резолверам:

```typescript
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    // Получаем token из headers
    const token = req.headers.authorization?.split('Bearer ')[1];

    // Получаем пользователя
    const userId = token ? getUserIdFromToken(token) : null;

    return {
      userId,
      db: database,
      token
    };
  }
});
```

## Middleware

```typescript
import { ApolloServer } from 'apollo-server';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: {
    requestDidResolveOperation(requestContext) {
      console.log('Operation:', requestContext.operationName);
    },
    didEncounterErrors(requestContext) {
      console.log('Errors:', requestContext.errors);
    }
  }
});
```

## Аутентификация

```typescript
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization?.split('Bearer ')[1];

    if (!token) {
      return { userId: null };
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return { userId: decoded.id };
    } catch (error) {
      return { userId: null };
    }
  }
});
```

## Express интеграция

```typescript
import express from 'express';
import { ApolloServer } from 'apollo-server-express';

const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers
});

await server.start();

server.applyMiddleware({ app });

app.listen({ port: 4000 }, () => {
  console.log(`Server ready at http://localhost:4000${server.graphqlPath}`);
});
```

## Обработка ошибок

```typescript
const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (error) => {
    console.error('GraphQL Error:', error);

    // Не отправляем внутренние ошибки клиентам
    if (error.message.includes('internal')) {
      return new Error('Internal server error');
    }

    return error;
  }
});
```

## Валидация

```typescript
const resolvers = {
  Mutation: {
    createUser: (_, { input }, { db }) => {
      // Валидация email
      if (!input.email.includes('@')) {
        throw new Error('Invalid email format');
      }

      // Валидация длины имени
      if (input.name.length < 2) {
        throw new Error('Name must be at least 2 characters');
      }

      return db.users.create(input);
    }
  }
};
```

## CORS

```typescript
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors({
  origin: 'https://example.com',
  credentials: true
}));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  cors: {
    origin: 'https://example.com',
    credentials: true
  }
});
```

## Scaling - Сложные сценарии

### DataLoader для батчинга

```typescript
import DataLoader from 'dataloader';

const userLoader = new DataLoader(async (userIds) => {
  return await db.users.findByIds(userIds);
});

const context = {
  userLoader,
  db
};
```

### PubSub для Subscriptions

```typescript
import { PubSub } from 'apollo-server';

const pubSub = new PubSub();

const resolvers = {
  Mutation: {
    publishMessage: (_, { message }) => {
      pubSub.publish('MESSAGE', { messagePublished: message });
      return message;
    }
  },
  Subscription: {
    messagePublished: {
      subscribe: () => pubSub.asyncIterator(['MESSAGE'])
    }
  }
};
```

## Мониторинг

```typescript
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: {
    didResolveOperation(context) {
      const duration = Date.now() - context.requestContext.startTime;
      console.log(`Operation ${context.operationName} took ${duration}ms`);
    }
  }
});
```

## Конфигурация для production

```typescript
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: process.env.NODE_ENV !== 'production',
  debug: process.env.NODE_ENV !== 'production',
  context: ({ req }) => ({
    userId: extractUserFromToken(req),
    db: database
  }),
  formatError: (error) => {
    if (!process.env.NODE_ENV?.includes('development')) {
      // В production скрываем внутренние детали
      return { message: 'Internal server error' };
    }
    return error;
  }
});
```

## Дальше

Изучите [Apollo Client](/basics_graphql/apollo-client) для работы на клиенте.
