---
description: "GraphQL мутации: создание, обновление, удаление данных — изменение серверных данных через API"
---

# GraphQL Mutations (Мутации)

## Что такое Mutation?

Mutation — это операция для изменения данных. Эквивалент POST/PUT/DELETE в REST API.

## Синтаксис базовой мутации

```graphql
mutation {
  createUser(name: "John", email: "john@example.com") {
    id
    name
    email
  }
}
```

## Именованная мутация

```graphql
mutation CreateNewUser {
  createUser(name: "John", email: "john@example.com") {
    id
    name
  }
}
```

## Аргументы и Input типы

```graphql
input CreateUserInput {
  name: String!
  email: String!
  password: String!
}

type Mutation {
  createUser(input: CreateUserInput!): User!
}
```

Использование:
```graphql
mutation {
  createUser(input: {
    name: "John"
    email: "john@example.com"
    password: "secret123"
  }) {
    id
    name
    email
  }
}
```

## Переменные в мутациях

```graphql
mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    id
    name
    email
  }
}
```

Переменные:
```json
{
  "input": {
    "name": "John",
    "email": "john@example.com",
    "password": "secret123"
  }
}
```

## Частые паттерны мутаций

### Создание (Create)

```graphql
mutation {
  createPost(title: "GraphQL Guide", content: "...") {
    id
    title
    createdAt
  }
}
```

### Обновление (Update)

```graphql
mutation {
  updateUser(id: "123", name: "Jane Doe") {
    id
    name
    email
  }
}
```

### Удаление (Delete)

```graphql
mutation {
  deletePost(id: "456") {
    success
    message
  }
}
```

## Возвращаемые данные

**Всегда возвращайте изменённые данные** — клиент может их использовать для обновления UI.

```graphql
mutation {
  updateUser(id: "123", status: "active") {
    id
    name
    status
    updatedAt
  }
}
```

## Обработка ошибок

```graphql
mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    user {
      id
      name
    }
    errors {
      field
      message
    }
  }
}
```

## Пакетные мутации

```graphql
mutation BatchOperations {
  updateUser1: updateUser(id: "1", name: "User One") {
    id
    name
  }
  updateUser2: updateUser(id: "2", name: "User Two") {
    id
    name
  }
}
```

## Мутации с вложенными данными

```graphql
mutation CreatePostWithComments {
  createPost(
    title: "New Post"
    content: "Content..."
    comments: [
      { text: "Great post!" }
      { text: "Thanks for sharing" }
    ]
  ) {
    id
    title
    comments {
      id
      text
    }
  }
}
```

## Практические примеры

### Регистрация пользователя

```graphql
mutation Register($email: String!, $password: String!, $name: String!) {
  register(email: $email, password: $password, name: $name) {
    token
    user {
      id
      name
      email
    }
  }
}
```

### Обновление профиля

```graphql
mutation UpdateProfile($input: UpdateProfileInput!) {
  updateProfile(input: $input) {
    id
    name
    bio
    avatar
    updatedAt
  }
}
```

### Добавить комментарий

```graphql
mutation AddComment($postId: ID!, $text: String!) {
  addComment(postId: $postId, text: $text) {
    id
    text
    author {
      name
    }
    createdAt
  }
}
```

## Лучшие практики

### ✅ Рекомендации

1. **Используйте Input типы** — логичнее и понятнее
2. **Возвращайте изменённые данные** — для обновления UI
3. **Включите информацию об ошибках** — помощь клиентам
4. **Используйте понятные имена** — createUser вместо addUser
5. **Валидируйте на сервере** — никогда не доверяйте клиентам

### ❌ Избегайте

1. ❌ Множество аргументов вместо Input типа
2. ❌ Молчаливое игнорирование ошибок
3. ❌ Возврат только ID без данных
4. ❌ Побочные эффекты без явного обозначения

## Идемпотентность

```graphql
mutation CreateUserIdempotent($idempotencyKey: String!, $input: CreateUserInput!) {
  createUser(idempotencyKey: $idempotencyKey, input: $input) {
    user {
      id
    }
    idempotencyKey
  }
}
```

Это предотвращает дублирование при повторных запросах.

## Дальше

Изучите [Subscriptions](/basics_graphql/subscriptions) для обновлений в реальном времени.
