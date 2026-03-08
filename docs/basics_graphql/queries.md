---
description: "GraphQL запросы: поля, аргументы, алиасы, фрагменты — получение данных из API с гибкой выборкой"
---

# GraphQL Queries (Запросы)

## Что такое Query?

Query — это способ получения данных из GraphQL API. Это эквивалент GET запроса в REST API.

## Синтаксис базового запроса

```graphql
query {
  user {
    id
    name
    email
  }
}
```

## Именованные запросы

```graphql
query GetUser {
  user {
    id
    name
    email
  }
}
```

## Аргументы

```graphql
query {
  user(id: "123") {
    id
    name
    email
  }
}
```

### Множественные аргументы

```graphql
query {
  users(limit: 10, offset: 20) {
    id
    name
  }
}
```

## Переменные

```graphql
query GetUser($userId: ID!) {
  user(id: $userId) {
    id
    name
    email
  }
}
```

Передача переменных (JSON):
```json
{
  "userId": "123"
}
```

## Вложенные запросы

```graphql
query {
  user(id: "123") {
    id
    name
    posts {
      id
      title
      comments {
        id
        text
        author {
          name
        }
      }
    }
  }
}
```

## Фрагменты

```graphql
fragment UserFields on User {
  id
  name
  email
}

query {
  user(id: "123") {
    ...UserFields
  }
}
```

## Множественные запросы

```graphql
query GetMultiple {
  user1: user(id: "1") {
    name
  }
  user2: user(id: "2") {
    name
  }
}
```

## Директивы

### @include

```graphql
query GetUser($includeEmail: Boolean!) {
  user(id: "123") {
    name
    email @include(if: $includeEmail)
  }
}
```

### @skip

```graphql
query GetUser($skipPosts: Boolean!) {
  user(id: "123") {
    name
    posts @skip(if: $skipPosts) {
      title
    }
  }
}
```

## Интроспекция (Introspection)

Получение информации о схеме:

```graphql
query {
  __schema {
    types {
      name
      fields {
        name
        type {
          name
        }
      }
    }
  }
}
```

## Практические примеры

### Получить все данные пользователя с постами

```graphql
query GetUserWithPosts($id: ID!) {
  user(id: $id) {
    id
    name
    email
    avatar
    posts {
      id
      title
      createdAt
    }
  }
}
```

### Поиск с фильтрацией

```graphql
query SearchUsers($query: String!, $limit: Int) {
  users(search: $query, limit: $limit) {
    id
    name
    email
  }
}
```

### Пагинация

```graphql
query GetUsersPaginated($first: Int!, $after: String) {
  users(first: $first, after: $after) {
    edges {
      node {
        id
        name
      }
      cursor
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

## Оптимизация запросов

### ❌ Плохо — много запросов

```graphql
query {
  user(id: "1") { name }
  user(id: "2") { name }
  user(id: "3") { name }
}
```

### ✅ Хорошо — один запрос

```graphql
query {
  users(ids: ["1", "2", "3"]) {
    name
  }
}
```

## Ошибки в запросах

```graphql
query {
  user(id: "123") {
    invalidField  # ❌ Ошибка: поля не существует
  }
}
```

Ответ:
```json
{
  "errors": [
    {
      "message": "Cannot query field \"invalidField\" on type \"User\"",
      "locations": [
        {
          "line": 3,
          "column": 5
        }
      ]
    }
  ]
}
```

## Основные правила

1. **Запрашивайте только нужные поля** — уменьшает размер ответа
2. **Используйте переменные** — лучше для безопасности и переиспользования
3. **Используйте фрагменты** — избегайте повторения
4. **Используйте именованные запросы** — для отладки и логирования
5. **Избегайте глубокой вложенности** — проблемы с производительностью

## Дальше

Изучите [Mutations](/basics_graphql/mutations) для изменения данных.
