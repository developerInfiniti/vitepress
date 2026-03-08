---
description: "Лучшие практики тестирования: AAA паттерн, покрытие, изоляция — написание качественных тестов"
---

# Best Practices в Тестировании

## Структура тестов

### Хорошая организация файлов

```
src/
├── components/
│   ├── Button.tsx
│   ├── Button.test.tsx
│   ├── Modal.tsx
│   └── Modal.test.tsx
├── utils/
│   ├── validators.ts
│   ├── validators.test.ts
│   └── ...
└── hooks/
    ├── useCounter.ts
    └── useCounter.test.ts
```

Или альтернативный вариант:

```
src/
├── components/
│   ├── Button.tsx
│   └── Modal.tsx
└── __tests__/
    ├── Button.test.tsx
    ├── Modal.test.tsx
    └── validators.test.ts
```

## Написание читаемых тестов

### Хорошие названия

```typescript
// ❌ Плохо
test('works', () => { });
test('component', () => { });
test('should', () => { });

// ✅ Хорошо
test('renders button with correct text', () => { });
test('displays error message when email is invalid', () => { });
test('calls onSubmit with form data', () => { });
```

### Используйте describe для группировки

```typescript
describe('UserForm', () => {
  describe('validation', () => {
    test('shows error for empty email', () => { });
    test('shows error for invalid email format', () => { });
  });

  describe('submission', () => {
    test('submits valid data', () => { });
    test('disables button while submitting', () => { });
  });
});
```

### Одна логическая проверка на тест

```typescript
// ❌ Плохо - несколько проверок
test('user creation works', () => {
  const user = createUser('John', 'john@test.com');
  expect(user.name).toBe('John');
  expect(user.email).toBe('john@test.com');
  expect(user.id).toBeDefined();
  expect(user.createdAt).toBeDefined();
});

// ✅ Хорошо
describe('createUser', () => {
  test('sets user name', () => {
    const user = createUser('John', 'john@test.com');
    expect(user.name).toBe('John');
  });

  test('sets user email', () => {
    const user = createUser('John', 'john@test.com');
    expect(user.email).toBe('john@test.com');
  });

  test('generates user id', () => {
    const user = createUser('John', 'john@test.com');
    expect(user.id).toBeDefined();
  });
});
```

## DRY принцип в тестах

### Используйте beforeEach для setup

```typescript
describe('UserService', () => {
  let service: UserService;
  let mockDb: jest.Mocked<Database>;

  beforeEach(() => {
    mockDb = createMockDatabase();
    service = new UserService(mockDb);
  });

  test('creates user', async () => {
    const user = await service.create({ name: 'John' });
    expect(user.id).toBeDefined();
  });

  test('deletes user', async () => {
    const user = await service.delete(1);
    expect(user.deleted).toBe(true);
  });
});
```

### Используйте фабрики для создания тестовых данных

```typescript
// testFactories.ts
export const createUser = (overrides = {}): User => ({
  id: Math.random(),
  name: 'Test User',
  email: 'test@example.com',
  role: 'USER',
  ...overrides
});

export const createPost = (overrides = {}): Post => ({
  id: Math.random(),
  title: 'Test Post',
  content: 'Test content',
  authorId: Math.random(),
  ...overrides
});

// test.ts
test('saves user with name', () => {
  const user = createUser({ name: 'John' });
  // Используем юзера
});
```

## Тестирование ошибок

### Проверяйте ошибки явно

```typescript
// ❌ Плохо - игнорируем ошибки
test('handles invalid data', () => {
  try {
    validateUser({});
  } catch (e) {
    // Ничего не делаем
  }
});

// ✅ Хорошо
test('throws error for invalid data', () => {
  expect(() => validateUser({}))
    .toThrow('User must have name');
});

test('rejects promise for invalid input', async () => {
  await expect(fetchUser(-1))
    .rejects
    .toThrow('Invalid user ID');
});
```

## Асинхронное тестирование

### Используйте async/await

```typescript
// ❌ Плохо - можно пропустить асинхронность
test('fetches user', () => {
  fetchUser(1).then(user => {
    expect(user.name).toBe('John');
  });
});

// ✅ Хорошо
test('fetches user', async () => {
  const user = await fetchUser(1);
  expect(user.name).toBe('John');
});

// ✅ Также хорошо - ждем через findBy
test('displays user after loading', async () => {
  render(<UserProfile id={1} />);
  const name = await screen.findByText('John');
  expect(name).toBeInTheDocument();
});
```

## Coverage (Покрытие кода)

### Установите reasonable targets

```typescript
// jest.config.js
module.exports = {
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 80,    // Минимум 80%
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

### Не игнорируйте покрытие

```typescript
// ❌ Плохо - пропускаем важный код
/* istanbul ignore next */
if (isProduction) {
  // логирование
}

// ✅ Лучше - тестируем важное
test('logs in production', () => {
  process.env.NODE_ENV = 'production';
  const spy = jest.spyOn(console, 'log');
  someFunction();
  expect(spy).toHaveBeenCalled();
});
```

## Performance (Производительность)

### Параллельное выполнение

```typescript
// jest.config.js
module.exports = {
  maxWorkers: '50%'  // Используй 50% ядер
};
```

### Используйте только нужные мокирования

```typescript
// ❌ Плохо - мокируем всё
jest.mock('react');
jest.mock('lodash');
jest.mock('./api');

// ✅ Хорошо - мокируем только нужное
jest.mock('./api');
```

## Snapshot Testing

### Используйте wisely

```typescript
// ✅ Хорошо - снимок при стабильном компоненте
test('renders Card', () => {
  expect(render(<Card user={user} />)).toMatchSnapshot();
});

// ❌ Плохо - снимок часто меняется
test('renders dynamic list', () => {
  expect(render(<DynamicList items={generateRandomItems()} />))
    .toMatchSnapshot(); // Всегда будет падать
});
```

## Избегайте common mistakes

### ❌ Тестирование деталей реализации

```typescript
// Плохо - зависим от деталей
test('sets state', () => {
  const wrapper = shallow(<Counter />);
  expect(wrapper.state('count')).toBe(0);
});

// Хорошо - тестируем поведение
test('displays initial count', () => {
  render(<Counter />);
  expect(screen.getByText('Count: 0')).toBeInTheDocument();
});
```

### ❌ Timing-зависимые тесты

```typescript
// ❌ Плохо - может быть флаки
test('updates after delay', (done) => {
  // ...
  setTimeout(() => {
    expect(something).toBe(true);
    done();
  }, 100);
});

// ✅ Хорошо - используем fake timers или waitFor
test('updates after delay', async () => {
  jest.useFakeTimers();
  // ...
  jest.runAllTimers();
  expect(something).toBe(true);
});

test('updates with waitFor', async () => {
  // ...
  await waitFor(() => {
    expect(something).toBe(true);
  });
});
```

### ❌ Зависимые тесты

```typescript
// ❌ Плохо - тесты зависят друг от друга
let user;

test('creates user', () => {
  user = createUser();
  expect(user).toBeDefined();
});

test('uses created user', () => {
  // Зависит от предыдущего теста!
  expect(user.id).toBeDefined();
});

// ✅ Хорошо - независимые тесты
describe('User management', () => {
  test('creates user', () => {
    const user = createUser();
    expect(user).toBeDefined();
  });

  test('deletes user', () => {
    const user = createUser();
    const result = deleteUser(user.id);
    expect(result).toBe(true);
  });
});
```

## Чеклист для pull request

- [ ] Все новые функции имеют тесты
- [ ] Все существующие тесты проходят
- [ ] Coverage не упал ниже порога (80%+)
- [ ] Нет флаки тестов (неустойчивые)
- [ ] Мокирование корректно очищается
- [ ] Названия тестов описательные
- [ ] Нет закомментированного кода

## Лучшие практики CI/CD

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test -- --coverage
      - uses: codecov/codecov-action@v2
        with:
          files: ./coverage/lcov.info
```

## Дальше

Готовы к production-ready тестам! 🚀
