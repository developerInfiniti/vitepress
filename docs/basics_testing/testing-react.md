# Тестирование React компонентов

## Инструменты

### React Testing Library

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest
```

## Базовое тестирование компонента

```typescript
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

test('renders button with text', () => {
  render(<Button>Click me</Button>);
  const button = screen.getByRole('button', { name: /click me/i });
  expect(button).toBeInTheDocument();
});
```

## Query Methods (Методы поиска)

### getBy* (выбрасывает ошибку если не найдено)

```typescript
// Выбрасит ошибку, если не найдено
const button = screen.getByRole('button');
const input = screen.getByLabelText('Username');
const div = screen.getByTestId('my-div');
const text = screen.getByText('Hello');
```

### queryBy* (возвращает null если не найдено)

```typescript
// Для проверки что элемент НЕ существует
const element = screen.queryByRole('button');
expect(element).not.toBeInTheDocument();
```

### findBy* (асинхронный, для ожидания появления)

```typescript
// Ждет пока элемент появится
const element = await screen.findByRole('button');
expect(element).toBeInTheDocument();
```

## Типы компонентов

### Простой компонент

```typescript
// Button.tsx
interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

export const Button = ({ onClick, children }: ButtonProps) => (
  <button onClick={onClick}>{children}</button>
);

// Button.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

test('calls onClick when clicked', async () => {
  const mockClick = jest.fn();
  render(<Button onClick={mockClick}>Click</Button>);

  const button = screen.getByRole('button');
  await userEvent.click(button);

  expect(mockClick).toHaveBeenCalledTimes(1);
});
```

### Компонент с состоянием

```typescript
// Counter.tsx
import { useState } from 'react';

export const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};

// Counter.test.tsx
test('increments counter', async () => {
  render(<Counter />);
  const button = screen.getByRole('button');

  expect(screen.getByText('Count: 0')).toBeInTheDocument();

  await userEvent.click(button);
  expect(screen.getByText('Count: 1')).toBeInTheDocument();

  await userEvent.click(button);
  expect(screen.getByText('Count: 2')).toBeInTheDocument();
});
```

### Компонент с API запросом

```typescript
// UserProfile.tsx
import { useEffect, useState } from 'react';

interface User {
  id: number;
  name: string;
}

interface UserProfileProps {
  userId: number;
}

export const UserProfile = ({ userId }: UserProfileProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch(`/api/users/${userId}`);
      const data = await response.json();
      setUser(data);
      setLoading(false);
    };
    fetchUser();
  }, [userId]);

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>User not found</p>;

  return <h1>{user.name}</h1>;
};

// UserProfile.test.tsx
test('displays user profile', async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ id: 1, name: 'John' })
    })
  ) as jest.Mock;

  render(<UserProfile userId={1} />);

  expect(screen.getByText('Loading...')).toBeInTheDocument();

  const heading = await screen.findByRole('heading', { name: 'John' });
  expect(heading).toBeInTheDocument();
});
```

## Тестирование форм

```typescript
// LoginForm.tsx
import { useState } from 'react';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
}

export const LoginForm = ({ onSubmit }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
};

// LoginForm.test.tsx
test('submits form with email and password', async () => {
  const mockSubmit = jest.fn();
  render(<LoginForm onSubmit={mockSubmit} />);

  const emailInput = screen.getByPlaceholderText('Email') as HTMLInputElement;
  const passwordInput = screen.getByPlaceholderText('Password') as HTMLInputElement;
  const button = screen.getByRole('button', { name: 'Login' });

  await userEvent.type(emailInput, 'test@example.com');
  await userEvent.type(passwordInput, 'password123');
  await userEvent.click(button);

  expect(mockSubmit).toHaveBeenCalledWith('test@example.com', 'password123');
});
```

## Mocking компонентов

```typescript
// ParentComponent.tsx
import { ChildComponent } from './ChildComponent';

export const ParentComponent = () => {
  return (
    <div>
      <h1>Parent</h1>
      <ChildComponent />
    </div>
  );
};

// ParentComponent.test.tsx
jest.mock('./ChildComponent', () => ({
  ChildComponent: () => <div>Mocked Child</div>
}));

test('renders with mocked child', () => {
  render(<ParentComponent />);
  expect(screen.getByText('Mocked Child')).toBeInTheDocument();
});
```

## Testing hooks

```typescript
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

test('increment works', () => {
  const { result } = renderHook(() => useCounter());

  expect(result.current.count).toBe(0);

  act(() => {
    result.current.increment();
  });

  expect(result.current.count).toBe(1);
});
```

## Best Practices

### ✅ Рекомендации

1. **Используйте semantic queries** (getByRole, getByLabelText)

```typescript
// ✅ Хорошо
const button = screen.getByRole('button', { name: 'Submit' });

// ❌ Плохо
const button = screen.getByClassName('btn-submit');
```

2. **Тестируйте поведение пользователя**

```typescript
// ✅ Хорошо - пользователь кликает кнопку
await userEvent.click(button);

// ❌ Плохо -直接вызываем обработчик
onClick?.();
```

3. **Используйте userEvent вместо fireEvent**

```typescript
// ✅ Хорошо - более реалистичное взаимодействие
await userEvent.type(input, 'text');

// ⚠️ Может быть менее реалистично
fireEvent.change(input, { target: { value: 'text' } });
```

4. **Избегайте testing implementation details**

```typescript
// ❌ Плохо - тестируем деталь реализации
expect(component.state.count).toBe(1);

// ✅ Хорошо - тестируем что пользователь видит
expect(screen.getByText('Count: 1')).toBeInTheDocument();
```

## Snapshot testing

```typescript
test('renders correctly', () => {
  const { container } = render(<UserCard user={user} />);
  expect(container.firstChild).toMatchSnapshot();
});
```

Обновить: `npm test -- -u`

## Дальше

Изучите [Best Practices](/basics_testing/best-practices) для оптимизации тестов.
