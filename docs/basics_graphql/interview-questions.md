---
description: "Вопросы по GraphQL для собеседований: схемы, резолверы, подписки — подготовка к техническому интервью"
---

# GraphQL Вопросы на Собеседовании

## Основные вопросы

### 1. Что такое GraphQL?

**Ответ:**
GraphQL — это язык запросов и среда выполнения для API. Позволяет клиентам запрашивать ровно то количество данных, которое им нужно.

Ключевые особенности:
- Типизированная схема
- Единая точка входа
- Клиент определяет структуру ответа
- Встроенная документация

### 2. Какая разница между GraphQL и REST?

| Аспект | GraphQL | REST |
|--------|---------|------|
| Over-fetching | ❌ Нет | ✅ Часто |
| Under-fetching | ❌ Нет | ✅ Часто |
| Версионирование | ❌ Не требуется | ✅ v1, v2... |
| Кеширование | ⚠️ Сложнее | ✅ Просто |
| Обучение | ⚠️ Крутая кривая | ✅ Легче |

### 3. Объясните Query, Mutation и Subscription

**Query** — получение данных (эквивалент GET)
```graphql
query { user(id: "1") { name } }
```

**Mutation** — изменение данных (эквивалент POST/PUT/DELETE)
```graphql
mutation { createUser(name: "John") { id } }
```

**Subscription** — получение обновлений в реальном времени (WebSocket)
```graphql
subscription { userCreated { id } }
```

### 4. Что такое resolver?

Resolver — это функция, которая возвращает данные для поля в schema.

```typescript
const resolvers = {
  Query: {
    user: (parent, args, context, info) => {
      // Получаем пользователя из БД
      return db.users.findById(args.id);
    }
  }
};
```

### 5. Что такое context в GraphQL?

Context — это объект, который передается всем резолверам. Используется для:
- Аутентификации (userId, token)
- Доступа к БД
- Логирования
- Кешинга

```typescript
const context = ({ req }) => ({
  userId: extractUserIdFromToken(req),
  db: database,
  loaders: dataLoaders
});
```

## Промежуточные вопросы

### 6. Как избежать N+1 проблемы в GraphQL?

**Проблема:**
```typescript
// Для каждого пользователя делаем отдельный запрос
User: {
  posts: (parent) => db.posts.find({ authorId: parent.id })
}
```

**Решение: DataLoader**
```typescript
const postLoader = new DataLoader(async (userIds) => {
  const posts = await db.posts.find({ authorId: { $in: userIds } });
  return userIds.map(id => posts.filter(p => p.authorId === id));
});
```

### 7. Что такое Input типы и зачем они нужны?

Input типы — это типы для входных параметров мутаций.

```graphql
# ❌ Плохо
type Mutation {
  createUser(
    name: String!
    email: String!
    age: Int
    avatar: String
  ): User!
}

# ✅ Хорошо
input CreateUserInput {
  name: String!
  email: String!
  age: Int
  avatar: String
}

type Mutation {
  createUser(input: CreateUserInput!): User!
}
```

Преимущества:
- Лучшая читаемость
- Легче расширять
- Повторное использование

### 8. Как работает кеширование в Apollo Client?

Apollo Client использует InMemoryCache:
1. Нормализует данные по типам и ID
2. Хранит в памяти
3. Автоматически обновляет при мутациях

```typescript
const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      User: {
        keyFields: ['id']
      }
    }
  })
});
```

### 9. Как обновить кеш после мутации?

```typescript
const [createPost] = useMutation(CREATE_POST, {
  update(cache, { data: { createPost } }) {
    const { posts } = cache.readQuery({ query: GET_POSTS });
    cache.writeQuery({
      query: GET_POSTS,
      data: { posts: [...posts, createPost] }
    });
  }
});
```

### 10. Что такое Relay Pattern в GraphQL?

Relay Pattern — это стандартный способ организации пагинации:

```graphql
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
```

## Продвинутые вопросы

### 11. Как организовать аутентификацию в GraphQL?

```typescript
// 1. Получить token из headers
const context = ({ req }) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  const userId = verifyToken(token);
  return { userId };
};

// 2. Проверять в резолверах
const resolvers = {
  Mutation: {
    createPost: (_, { input }, context) => {
      if (!context.userId) throw new Error('Not authenticated');
      return db.posts.create({ ...input, authorId: context.userId });
    }
  }
};
```

### 12. Как обработать ошибки в GraphQL?

```typescript
// На сервере
const server = new ApolloServer({
  formatError: (error) => {
    if (process.env.NODE_ENV === 'production') {
      return { message: 'Internal server error' };
    }
    return error;
  }
});

// На клиенте
const { data, error } = useQuery(QUERY);
if (error) {
  console.log(error.graphQLErrors); // Ошибки из GraphQL
  console.log(error.networkError);  // Сетевые ошибки
}
```

### 13. Как оптимизировать GraphQL запросы?

1. **Запрашивайте только нужные поля**
2. **Используйте переменные** вместо встраивания значений
3. **Используйте фрагменты** для переиспользования
4. **Не запрашивайте глубокую вложенность** (макс 3-4 уровня)
5. **Используйте DataLoader** для батчинга

### 14. Что такое фрагменты в GraphQL?

Фрагмент — это переиспользуемый набор полей:

```graphql
fragment UserFields on User {
  id
  name
  email
}

query {
  user(id: "1") {
    ...UserFields
  }
  currentUser {
    ...UserFields
  }
}
```

### 15. Как работают Subscriptions?

1. Клиент устанавливает WebSocket соединение
2. Отправляет subscription
3. Сервер отправляет обновления в реальном времени
4. Использует PubSub для организации

```typescript
const pubSub = new PubSub();

const resolvers = {
  Mutation: {
    createMessage: (_, { text }) => {
      const message = { id: '1', text };
      pubSub.publish('MESSAGE_ADDED', { messageAdded: message });
      return message;
    }
  },
  Subscription: {
    messageAdded: {
      subscribe: () => pubSub.asyncIterator(['MESSAGE_ADDED'])
    }
  }
};
```

## Вопросы на белую доску

### Код: Реализуйте базовый resolver для получения поста с автором

```typescript
const typeDefs = gql`
  type User {
    id: ID!
    name: String!
  }

  type Post {
    id: ID!
    title: String!
    author: User!
  }

  type Query {
    post(id: ID!): Post
  }
`;

const resolvers = {
  Query: {
    post: (_, { id }, { db }) => db.posts.findById(id)
  },
  Post: {
    author: (parent, _, { db }) => db.users.findById(parent.authorId)
  }
};
```

### Код: Реализуйте мутацию создания комментария с обновлением кеша

```typescript
const CREATE_COMMENT = gql`
  mutation CreateComment($postId: ID!, $text: String!) {
    createComment(postId: $postId, text: $text) {
      id
      text
      author { name }
    }
  }
`;

const [createComment] = useMutation(CREATE_COMMENT, {
  update(cache, { data: { createComment } }) {
    const { post } = cache.readQuery({
      query: GET_POST,
      variables: { id: postId }
    });

    cache.writeQuery({
      query: GET_POST,
      variables: { id: postId },
      data: {
        post: {
          ...post,
          comments: [...post.comments, createComment]
        }
      }
    });
  }
});
```

## Практические вопросы

### 17. Что делать если resolver очень медленный?

1. **Кешируйте результаты** (Redis, память)
2. **Используйте DataLoader** для батчинга
3. **Оптимизируйте БД запросы** (индексы, select нужные поля)
4. **Используйте асинхронность** (параллельные запросы)

### 18. Как отладить GraphQL запрос?

1. **GraphiQL/Apollo Studio** — встроенный инструмент
2. **Apollo DevTools** расширение для браузера
3. **Логирование в резолверах**
4. **GraphQL Inspector** для анализа схемы

### 19. Когда NOT использовать GraphQL?

- Простые CRUD API (REST достаточно)
- Высокие требования к кешированию
- Очень высокие требования к производительности
- Малая команда, простые требования

### 20. Как масштабировать GraphQL сервер?

1. **Используйте DataLoader** для оптимизации
2. **Кешируйте результаты** (Redis)
3. **Батчируйте БД запросы**
4. **Мониторьте slow queries**
5. **Используйте mikroservices** с федерацией
6. **CDN** для статических ресурсов

## Лучшие ответы

✅ Всегда объясняйте свой выбор
✅ Упомните trade-offs
✅ Дайте практические примеры
✅ Покажите знание экосистемы
✅ Обсудите безопасность
