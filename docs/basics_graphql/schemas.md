# GraphQL Schemas и Типы

## Что такое Schema?

Schema — это определение всех типов, которые может возвращать ваш GraphQL API. Это как контракт между сервером и клиентом.

## Скалярные типы (Scalar Types)

```graphql
type User {
  id: ID!           # Уникальный идентификатор
  name: String!     # Строка (обязательна)
  age: Int          # Целое число (опционально)
  rating: Float     # Число с дробной частью
  isActive: Boolean # Логическое значение
  createdAt: DateTime # Пользовательский скалярный тип
}
```

### Встроенные скалярные типы

| Тип | Описание |
|-----|---------|
| `String` | Текст |
| `Int` | Целое число (-2³¹ до 2³¹-1) |
| `Float` | Число с дробной частью |
| `Boolean` | true или false |
| `ID` | Строка, используемая как идентификатор |

## Обязательность (Non-null)

```graphql
type User {
  id: ID!              # Обязательно
  name: String!        # Обязательно
  email: String        # Опционально
  age: Int!            # Обязательно (целое число)
  tags: [String!]!     # Обязательно (массив обязательных строк)
}
```

## Объектные типы (Object Types)

```graphql
type User {
  id: ID!
  name: String!
  email: String!
  posts: [Post!]!
}

type Post {
  id: ID!
  title: String!
  content: String!
  author: User!
}
```

## Интерфейсы (Interfaces)

```graphql
interface Node {
  id: ID!
  createdAt: DateTime!
}

type User implements Node {
  id: ID!
  name: String!
  createdAt: DateTime!
}

type Post implements Node {
  id: ID!
  title: String!
  createdAt: DateTime!
}
```

## Union типы

```graphql
union SearchResult = User | Post | Comment

type Query {
  search(query: String!): [SearchResult!]!
}
```

## Enum типы

```graphql
enum UserRole {
  ADMIN
  MODERATOR
  USER
}

enum PostStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

type User {
  id: ID!
  name: String!
  role: UserRole!
}

type Post {
  id: ID!
  title: String!
  status: PostStatus!
}
```

## Input типы

```graphql
input CreateUserInput {
  name: String!
  email: String!
  password: String!
}

input UpdateUserInput {
  name: String
  email: String
  age: Int
}

type Mutation {
  createUser(input: CreateUserInput!): User!
  updateUser(id: ID!, input: UpdateUserInput!): User!
}
```

## Массивы

```graphql
type User {
  name: String!           # Одна строка
  tags: [String!]         # Массив строк (может быть null)
  tags: [String!]!        # Массив строк (обязательный)
  tags: [String]!         # Массив (может содержать null)
}
```

## Практический пример schema

```graphql
# Скалярные типы
scalar DateTime

# Enum
enum UserRole {
  ADMIN
  USER
}

# Интерфейс
interface Node {
  id: ID!
}

# Типы
type User implements Node {
  id: ID!
  name: String!
  email: String!
  role: UserRole!
  posts: [Post!]!
  createdAt: DateTime!
}

type Post implements Node {
  id: ID!
  title: String!
  content: String!
  author: User!
  comments: [Comment!]!
  createdAt: DateTime!
}

type Comment implements Node {
  id: ID!
  text: String!
  author: User!
  post: Post!
  createdAt: DateTime!
}

# Input
input CreateUserInput {
  name: String!
  email: String!
}

input CreatePostInput {
  title: String!
  content: String!
}

# Root типы
type Query {
  user(id: ID!): User
  users(limit: Int, offset: Int): [User!]!
  post(id: ID!): Post
  posts(authorId: ID): [Post!]!
}

type Mutation {
  createUser(input: CreateUserInput!): User!
  updateUser(id: ID!, input: CreateUserInput!): User!
  deleteUser(id: ID!): Boolean!

  createPost(input: CreatePostInput!): Post!
  deletePost(id: ID!): Boolean!

  addComment(postId: ID!, text: String!): Comment!
}

type Subscription {
  userCreated: User!
  postCreated: Post!
}
```

## Пользовательские скалярные типы

```typescript
import { GraphQLScalarType } from 'graphql';

const DateTimeScalar = new GraphQLScalarType({
  name: 'DateTime',
  description: 'Date custom scalar type',
  serialize(value) {
    return value.getTime(); // Отправляем как timestamp
  },
  parseValue(value) {
    return new Date(value); // Получаем как timestamp
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10));
    }
    return null;
  }
});
```

## Директивы в Schema

```graphql
directive @auth(role: UserRole) on FIELD_DEFINITION
directive @deprecated(reason: String) on FIELD_DEFINITION | ENUM_VALUE

type User {
  id: ID!
  name: String!
  email: String! @auth(role: ADMIN)
  oldField: String @deprecated(reason: "Use newField instead")
  newField: String
}
```

## Лучшие практики

✅ **Рекомендации:**
1. Используйте `!` для обязательных полей
2. Используйте описательные имена типов
3. Группируйте связанные типы
4. Используйте интерфейсы для кода с повторением
5. Версионируйте schema через расширения

❌ **Избегайте:**
1. Возврат null для обязательных полей
2. Слишком вложенные типы
3. Названия типов в стиле переменных (используйте PascalCase)

## Дальше

Изучите [Resolvers](/basics_graphql/resolvers) для реализации schema.
