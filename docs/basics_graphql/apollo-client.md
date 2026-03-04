# Apollo Client

## Что такое Apollo Client?

Apollo Client — это JavaScript библиотека для работы с GraphQL на клиенте. Управляет состоянием данных, кешированием и синхронизацией.

## Установка

```bash
npm install @apollo/client graphql
```

## Базовая настройка

```typescript
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'http://localhost:4000/graphql',
    credentials: 'include' // для cookies
  }),
  cache: new InMemoryCache()
});
```

## React интеграция

```typescript
import { ApolloProvider } from '@apollo/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
```

## useQuery хук

```typescript
import { gql, useQuery } from '@apollo/client';

const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      email
    }
  }
`;

function UserProfile({ userId }) {
  const { data, loading, error } = useQuery(GET_USER, {
    variables: { id: userId }
  });

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка: {error.message}</p>;

  return (
    <div>
      <h1>{data.user.name}</h1>
      <p>{data.user.email}</p>
    </div>
  );
}
```

## useMutation хук

```typescript
import { gql, useMutation } from '@apollo/client';

const CREATE_USER = gql`
  mutation CreateUser($name: String!, $email: String!) {
    createUser(name: $name, email: $email) {
      id
      name
      email
    }
  }
`;

function CreateUserForm() {
  const [createUser, { loading, error }] = useMutation(CREATE_USER);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await createUser({
        variables: {
          name: 'John',
          email: 'john@example.com'
        }
      });
      console.log('User created:', data.createUser);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create User'}
      </button>
      {error && <p style={{ color: 'red' }}>{error.message}</p>}
    </form>
  );
}
```

## useSubscription хук

```typescript
import { gql, useSubscription } from '@apollo/client';

const MESSAGES_SUBSCRIPTION = gql`
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

function ChatMessages() {
  const { data, loading } = useSubscription(MESSAGES_SUBSCRIPTION);

  if (loading) return <p>Ожидание сообщений...</p>;

  return (
    <div>
      {data?.messageAdded && (
        <p>
          <strong>{data.messageAdded.user.name}:</strong> {data.messageAdded.text}
        </p>
      )}
    </div>
  );
}
```

## Кеширование

```typescript
const client = new ApolloClient({
  link: new HttpLink({ uri: 'http://localhost:4000/graphql' }),
  cache: new InMemoryCache({
    typePolicies: {
      User: {
        keyFields: ['id'], // Используем id как ключ
        fields: {
          fullName: {
            read(_, { readField }) {
              return `${readField('firstName')} ${readField('lastName')}`;
            }
          }
        }
      }
    }
  })
});
```

## Запросы из кеша

```typescript
// Использовать кеш, затем fetch
const { data } = useQuery(GET_USER, {
  fetchPolicy: 'cache-and-network'
});

// Только кеш
useQuery(GET_USER, {
  fetchPolicy: 'cache-only'
});

// Только сеть
useQuery(GET_USER, {
  fetchPolicy: 'network-only'
});

// Без кеша
useQuery(GET_USER, {
  fetchPolicy: 'no-cache'
});
```

## Refetch

```typescript
function UserProfile({ userId }) {
  const { data, refetch } = useQuery(GET_USER, {
    variables: { id: userId }
  });

  return (
    <div>
      <h1>{data?.user.name}</h1>
      <button onClick={() => refetch()}>Обновить</button>
    </div>
  );
}
```

## Обновление кеша после мутации

```typescript
const CREATE_POST = gql`
  mutation CreatePost($title: String!) {
    createPost(title: $title) {
      id
      title
    }
  }
`;

function CreatePost() {
  const [createPost] = useMutation(CREATE_POST, {
    update(cache, { data: { createPost } }) {
      const { posts } = cache.readQuery({ query: GET_POSTS });
      cache.writeQuery({
        query: GET_POSTS,
        data: {
          posts: [...posts, createPost]
        }
      });
    }
  });

  return <button onClick={() => createPost({ variables: { title: 'New' } })}>Create</button>;
}
```

## Обработка ошибок

```typescript
function LoginForm() {
  const [login, { loading, error }] = useMutation(LOGIN, {
    onError: (err) => {
      console.error('Login failed:', err.message);
    },
    onCompleted: (data) => {
      localStorage.setItem('token', data.login.token);
    }
  });

  return (
    <div>
      <button onClick={() => login()}>Login</button>
      {error && <p style={{ color: 'red' }}>{error.message}</p>}
      {loading && <p>Logging in...</p>}
    </div>
  );
}
```

## Аутентификация

```typescript
import { setContext } from '@apollo/client/link/context';

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});
```

## Мониторинг операций

```typescript
import { ApolloLink } from '@apollo/client';

const loggingLink = new ApolloLink((operation, forward) => {
  console.log('Operation:', operation.operationName);

  return forward(operation).map(response => {
    console.log('Response:', response);
    return response;
  });
});

const client = new ApolloClient({
  link: loggingLink.concat(httpLink),
  cache: new InMemoryCache()
});
```

## DevTools

```typescript
import { ApolloDevtools } from '@apollo/client/devtools';

// Включить в development
if (process.env.NODE_ENV === 'development') {
  ApolloDevtools.init(client);
}
```

## Best practices

✅ **Делайте:**
1. Используйте правильную fetchPolicy
2. Обновляйте кеш после мутаций
3. Обрабатывайте ошибки
4. Используйте DevTools для отладки
5. Типизируйте запросы (с GraphQL Code Generator)

❌ **Не делайте:**
1. ❌ Не запрашивайте все данные сразу
2. ❌ Не забывайте обновлять кеш
3. ❌ Не полагайтесь только на network-only
4. ❌ Не используйте одни и те же имена переменных

## Дальше

Изучите [Best Practices](/basics_graphql/best-practices) для оптимизации.
