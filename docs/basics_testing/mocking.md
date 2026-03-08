---
description: "Мокирование в тестах: моки, стабы, шпионы, фейки — изоляция зависимостей для надёжного тестирования"
---

# Mocking (Мокирование) в Jest и Vitest

## Что такое Mocking?

Mocking — это замена реального объекта/функции на подделку для изоляции при тестировании.

## Jest Mocks

### jest.fn() - Mock функция

```typescript
const mockFn = jest.fn();

// Вызываем функцию
mockFn('hello', 123);
mockFn({ id: 1 });

// Проверяем вызовы
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledTimes(2);
expect(mockFn).toHaveBeenCalledWith('hello', 123);
expect(mockFn).toHaveBeenNthCalledWith(1, 'hello', 123);

// Проверяем возвращаемые значения
expect(mockFn).toHaveReturnedTimes(2);
expect(mockFn.mock.results).toHaveLength(2);
```

### Контроль возвращаемого значения

```typescript
const mockFn = jest.fn();

// Возвращать одно значение
mockFn.mockReturnValue('default');
expect(mockFn()).toBe('default');
expect(mockFn()).toBe('default');

// Возвращать разные значения при разных вызовах
mockFn
  .mockReturnValueOnce('first')
  .mockReturnValueOnce('second')
  .mockReturnValue('default');

expect(mockFn()).toBe('first');
expect(mockFn()).toBe('second');
expect(mockFn()).toBe('default');
```

### Mock с реализацией

```typescript
const mockFn = jest.fn((x) => x * 2);

expect(mockFn(5)).toBe(10);
expect(mockFn).toHaveBeenCalledWith(5);

// Переписать реализацию
mockFn.mockImplementation((x) => x + 10);
expect(mockFn(5)).toBe(15);
```

### Mock Promise

```typescript
const mockFn = jest.fn();

// Успешное разрешение
mockFn.mockResolvedValue({ id: 1, name: 'John' });

// Отклонение
mockFn.mockRejectedValue(new Error('API Error'));

// Разные результаты
mockFn
  .mockResolvedValueOnce({ id: 1 })
  .mockRejectedValueOnce(new Error('Error'))
  .mockResolvedValue({ id: 2 });
```

## jest.mock() - Mock модуль

### Полное мокирование модуля

```typescript
// api.ts
export const fetchUser = async (id: number) => {
  const res = await fetch(`/api/users/${id}`);
  return res.json();
};

export const fetchPosts = async (userId: number) => {
  const res = await fetch(`/api/users/${userId}/posts`);
  return res.json();
};

// service.test.ts
jest.mock('./api');

import { fetchUser, fetchPosts } from './api';

test('uses mocked API', async () => {
  (fetchUser as jest.Mock).mockResolvedValue({ id: 1, name: 'John' });
  (fetchPosts as jest.Mock).mockResolvedValue([{ id: 1, title: 'Post 1' }]);

  const user = await fetchUser(1);
  const posts = await fetchPosts(1);

  expect(user.name).toBe('John');
  expect(posts[0].title).toBe('Post 1');
});
```

### Частичное мокирование (Manual Mock)

```typescript
jest.mock('./api', () => ({
  ...jest.requireActual('./api'),
  fetchUser: jest.fn()
}));
```

## jest.spyOn() - Spy (Шпионаж)

### Шпионить за методом объекта

```typescript
const obj = {
  getValue: () => 42
};

const spy = jest.spyOn(obj, 'getValue');
const result = obj.getValue();

expect(spy).toHaveBeenCalled();
expect(result).toBe(42);
expect(spy).toHaveBeenCalledTimes(1);

spy.mockReturnValue(100);
expect(obj.getValue()).toBe(100);

spy.mockRestore(); // Восстановить оригинальную функцию
```

### Шпионить за консолью

```typescript
const consoleSpy = jest.spyOn(console, 'log');

console.log('Hello');

expect(consoleSpy).toHaveBeenCalledWith('Hello');

consoleSpy.mockRestore();
```

## jest.clearAllMocks() - Очистка

```typescript
describe('Mock Clearing', () => {
  const mockFn = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks(); // Очистить все mocks
  });

  test('first test', () => {
    mockFn('data');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('second test', () => {
    // mockFn был очищен в beforeEach
    expect(mockFn).not.toHaveBeenCalled();
    mockFn('new data');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});
```

## Практические примеры

### Mock HTTP запроса

```typescript
global.fetch = jest.fn();

beforeEach(() => {
  (global.fetch as jest.Mock).mockClear();
});

test('fetches user', async () => {
  (global.fetch as jest.Mock).mockResolvedValue({
    json: async () => ({ id: 1, name: 'John' })
  });

  const response = await fetch('/api/user/1');
  const user = await response.json();

  expect(fetch).toHaveBeenCalledWith('/api/user/1');
  expect(user.name).toBe('John');
});
```

### Mock localStorage

```typescript
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};

global.localStorage = localStorageMock as any;

test('saves token', () => {
  const token = 'abc123';
  localStorage.setItem('token', token);

  expect(localStorage.setItem).toHaveBeenCalledWith('token', token);
});
```

### Mock Date

```typescript
test('checks current date', () => {
  const mockDate = new Date('2024-01-01');
  jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);

  expect(new Date()).toEqual(mockDate);
});
```

### Mock класса

```typescript
class Database {
  connect() { /* ... */ }
  query(sql: string) { /* ... */ }
}

const mockDb = {
  connect: jest.fn(),
  query: jest.fn().mockReturnValue([{ id: 1 }])
};

function getUserFromDb(db: Database, id: number) {
  return db.query(`SELECT * FROM users WHERE id = ${id}`);
}

test('queries database', () => {
  const result = getUserFromDb(mockDb as any, 1);
  expect(mockDb.query).toHaveBeenCalled();
  expect(result[0].id).toBe(1);
});
```

## Vitest Mocks

В Vitest используется `vi` вместо `jest`:

```typescript
import { vi, test, expect } from 'vitest';

const mockFn = vi.fn();
vi.mock('./api');
const spy = vi.spyOn(obj, 'method');
vi.clearAllMocks();
```

## Лучшие практики

✅ **Делайте:**
1. Mock только то, что нужно
2. Восстанавливайте мокированные функции
3. Проверяйте вызовы и аргументы
4. Используйте descriptive имена для mock функций
5. Очищайте моки между тестами

❌ **Не делайте:**
1. ❌ Не мокируйте весь модуль если можно методы
2. ❌ Не забывайте про mockRestore()
3. ❌ Не создавайте слишком сложные моки
4. ❌ Не тестируйте мок функции, тестируйте их использование

## Дальше

Изучите [Best Practices](/basics_testing/best-practices) для полной картины.
