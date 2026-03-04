# GraphQL Subscriptions (Подписки)

## Что такое Subscription?

Subscription — это операция для получения обновлений в реальном времени. Использует WebSocket вместо HTTP.

```
HTTP:        Клиент → (запрос) → Сервер
WebSocket:   Клиент ↔ (bidirectional) ↔ Сервер
```

## Синтаксис базовой подписки

```graphql
subscription {
  messageAdded {
    id
    text
    user {
      name
    }
  }
}
```

## Именованная подписка

```graphql
subscription OnMessageAdded {
  messageAdded {
    id
    text
    user {
      name
    }
  }
}
```

## Подписка с аргументами

```graphql
subscription OnPostCommented($postId: ID!) {
  postCommented(postId: $postId) {
    id
    text
    author {
      name
    }
    createdAt
  }
}
```

## Определение Subscription типа

```typescript
const typeDefs = gql`
  type Subscription {
    messageAdded: Message!
    userOnline(userId: ID!): User!
    postUpdated(postId: ID!): Post!
  }

  type Message {
    id: ID!
    text: String!
    user: User!
    createdAt: String!
  }
`;
```

## Реализация Subscription на сервере

### Apollo Server с PubSub

```typescript
import { ApolloServer, gql, PubSub } from 'apollo-server';

const pubSub = new PubSub();

const resolvers = {
  Query: {
    messages: () => messages
  },
  Mutation: {
    addMessage: (_, { text, userId }) => {
      const message = {
        id: String(messages.length + 1),
        text,
        userId,
        createdAt: new Date().toISOString()
      };
      messages.push(message);

      // Отправляем подписчикам
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

const server = new ApolloServer({
  typeDefs,
  resolvers
});
```

## Использование в Apollo Client

```typescript
import { gql, useSubscription } from '@apollo/client';

const SUBSCRIPTION = gql`
  subscription OnMessageAdded {
    messageAdded {
      id
      text
      user {
        name
      }
    }
  }
`;

function ChatComponent() {
  const { data, loading, error } = useSubscription(SUBSCRIPTION);

  if (loading) return <p>Ожидание сообщений...</p>;
  if (error) return <p>Ошибка: {error.message}</p>;

  return (
    <div>
      <p>Новое сообщение: {data?.messageAdded.text}</p>
    </div>
  );
}
```

## Практические примеры

### Уведомления в реальном времени

```graphql
subscription OnNotification($userId: ID!) {
  notificationReceived(userId: $userId) {
    id
    title
    message
    type
    createdAt
  }
}
```

### Обновления статуса

```graphql
subscription OnUserStatusChanged($userId: ID!) {
  userStatusChanged(userId: $userId) {
    userId
    status
    lastSeen
  }
}
```

### Обновления данных в реальном времени

```graphql
subscription OnPostUpdated($postId: ID!) {
  postUpdated(postId: $postId) {
    id
    title
    likes
    comments {
      count
    }
  }
}
```

## Multi-user подписки (Chat)

```typescript
const resolvers = {
  Mutation: {
    sendMessage: (_, { channelId, text, userId }) => {
      const message = {
        id: `msg-${Date.now()}`,
        channelId,
        text,
        userId,
        createdAt: new Date()
      };

      pubSub.publish(`CHANNEL_${channelId}_MESSAGE`, {
        messageSent: message
      });

      return message;
    }
  },
  Subscription: {
    messageSent: {
      subscribe: (_, { channelId }) => {
        return pubSub.asyncIterator([`CHANNEL_${channelId}_MESSAGE`]);
      }
    }
  }
};
```

## Фильтрация подписок

```typescript
const resolvers = {
  Subscription: {
    userCreated: {
      subscribe: (_, { roleFilter }) => {
        return pubSub.asyncIterator(['USER_CREATED']);
      },
      resolve: (payload, _, __, info) => {
        // Фильтруем результаты
        if (info.variableValues.roleFilter) {
          if (payload.userCreated.role !== info.variableValues.roleFilter) {
            return null;
          }
        }
        return payload.userCreated;
      }
    }
  }
};
```

## Жизненный цикл Subscription

```
1. Клиент устанавливает WebSocket соединение
2. Клиент отправляет GQL_CONNECTION_INIT
3. Сервер отвечает GQL_CONNECTION_ACK
4. Клиент отправляет subscription
5. Сервер отправляет обновления
6. Клиент может отписаться (unsubscribe)
7. WebSocket соединение закрывается
```

## Обработка ошибок в Subscription

```typescript
const resolvers = {
  Subscription: {
    messageAdded: {
      subscribe: async (_, __, context) => {
        if (!context.userId) {
          throw new Error('Not authenticated');
        }
        return pubSub.asyncIterator(['MESSAGE_ADDED']);
      }
    }
  }
};
```

## Отмена подписки (Unsubscribe)

```typescript
// Apollo Client
const subscription = useSubscription(SUBSCRIPTION);

// Отписаться
subscription.unsubscribe?.();
```

## Лучшие практики

✅ **Делайте:**
- Проверяйте аутентификацию для чувствительных подписок
- Используйте фильтрацию для ограничения данных
- Закрывайте соединения после отписки
- Мониторьте количество активных соединений

❌ **Не делайте:**
- Не отправляйте большие объемы данных часто
- Не используйте для polling (используйте Query с интервалами)
- Не забывайте закрывать соединения
- Не доверяйте клиентским параметрам без валидации

## Дальше

Изучите [Schemas](/basics_graphql/schemas) для определения типов данных.
