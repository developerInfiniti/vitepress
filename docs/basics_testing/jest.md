---
description: "Jest: настройка, матчеры, моки, snapshot тесты — популярный фреймворк для тестирования JavaScript"
---

# Jest - Полное руководство

## Что такое Jest?

Jest — это популярный фреймворк для тестирования JavaScript/TypeScript. Разработан Facebook. Работает с React, Node.js и другими проектами.

## Установка

```bash
npm install --save-dev jest @types/jest
```

## Конфигурация

### jest.config.js

```typescript
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts', '**/*.test.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  preset: 'ts-jest'
};
```

### package.json

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

## Написание простого теста

```typescript
// sum.ts
export function sum(a: number, b: number): number {
  return a + b;
}

// sum.test.ts
import { sum } from './sum';

describe('sum', () => {
  test('adds 2 numbers', () => {
    expect(sum(2, 3)).toBe(5);
  });

  test('handles negative numbers', () => {
    expect(sum(-1, 1)).toBe(0);
  });
});
```

## Matchers (Утверждения)

### Точные значения

```typescript
expect(2 + 2).toBe(4);                    // ===
expect({ a: 1 }).toEqual({ a: 1 });      // Глубокое сравнение
expect(true).toBeTruthy();
expect(false).toBeFalsy();
expect(null).toBeNull();
expect(undefined).toBeUndefined();
expect('text').toBeDefined();
```

### Числа

```typescript
expect(4).toBeGreaterThan(3);
expect(4).toBeGreaterThanOrEqual(4);
expect(4).toBeLessThan(5);
expect(3.14).toBeCloseTo(3.1, 1); // Примерно равно
```

### Строки и Regex

```typescript
expect('team').toMatch(/^team/);
expect('testing').toMatch('test');
expect('hello').toContain('ell');
```

### Массивы

```typescript
expect([1, 2, 3]).toContain(2);
expect([1, 2, 3]).toEqual(expect.arrayContaining([2]));
expect([]).toHaveLength(0);
```

### Объекты

```typescript
const obj = { a: 1, b: 2 };
expect(obj).toHaveProperty('a');
expect(obj).toHaveProperty('a', 1);
expect(obj).toMatchObject({ a: 1 });
```

## Mock функции

### Создание mock функции

```typescript
const mockFn = jest.fn();

mockFn('hello');
mockFn({ id: 1 });

expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledTimes(2);
expect(mockFn).toHaveBeenCalledWith('hello');
expect(mockFn).toHaveBeenNthCalledWith(1, 'hello');
expect(mockFn).toHaveReturnedWith(undefined);
```

### Mock с return value

```typescript
const mockFn = jest.fn()
  .mockReturnValue('default')
  .mockReturnValueOnce('first call')
  .mockReturnValueOnce('second call');

console.log(mockFn()); // 'first call'
console.log(mockFn()); // 'second call'
console.log(mockFn()); // 'default'
```

### Mock с реализацией

```typescript
const mockFn = jest.fn((x) => x * 2);

expect(mockFn(5)).toBe(10);
```

## Mock модулей

### Полное мокирование модуля

```typescript
// api.ts
export const fetchUser = async (id: number) => {
  const res = await fetch(`/api/users/${id}`);
  return res.json();
};

// __tests__/service.test.ts
jest.mock('../api', () => ({
  fetchUser: jest.fn()
}));

import { fetchUser } from '../api';

test('calls API', async () => {
  (fetchUser as jest.Mock).mockResolvedValue({ id: 1, name: 'John' });

  const result = await fetchUser(1);
  expect(result.name).toBe('John');
});
```

### Частичное мокирование модуля

```typescript
jest.mock('../api', () => ({
  ...jest.requireActual('../api'),
  fetchUser: jest.fn()
}));
```

## Snapshot Testing

```typescript
test('renders correctly', () => {
  const component = render(<Header title="Test" />);
  expect(component).toMatchSnapshot();
});
```

Первый запуск создает `__snapshots__/Header.test.ts.snap`:
```
exports[`renders correctly 1`] = `
<div>
  <h1>Test</h1>
</div>
`;
```

Обновить snapshots: `jest -u`

## Async тестирование

### Promise

```typescript
test('fetches data', () => {
  return fetchUser(1).then(data => {
    expect(data.name).toBe('John');
  });
});
```

### Async/Await

```typescript
test('fetches data', async () => {
  const data = await fetchUser(1);
  expect(data.name).toBe('John');
});
```

### Callback

```typescript
test('fetches data', (done) => {
  fetchUser(1, (data) => {
    expect(data.name).toBe('John');
    done();
  });
});
```

## Timers (Таймеры)

```typescript
jest.useFakeTimers();

const callback = jest.fn();
setTimeout(callback, 1000);

expect(callback).not.toHaveBeenCalled();
jest.runAllTimers();
expect(callback).toHaveBeenCalled();

jest.useRealTimers();
```

## Setup и Teardown

```typescript
describe('Database', () => {
  beforeAll(() => {
    // Один раз в начале
    db.connect();
  });

  beforeEach(() => {
    // Перед каждым тестом
    db.clear();
  });

  afterEach(() => {
    // После каждого теста
    jest.clearAllMocks();
  });

  afterAll(() => {
    // Один раз в конце
    db.disconnect();
  });

  test('saves data', () => {
    // ...
  });
});
```

## Coverage (Покрытие)

```bash
jest --coverage
```

Конфигурация порогов:

```typescript
// jest.config.js
module.exports = {
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

## Полезные опции

```bash
jest                           # Запустить все тесты
jest --watch                   # Watch mode
jest --coverage                # С покрытием
jest --updateSnapshot          # Обновить snapshots
jest --testNamePattern="add"   # Только тесты с "add"
jest --testPathPattern="api"   # Только файлы с "api"
jest --bail                    # Остановить на первой ошибке
jest --verbose                 # Подробный вывод
```

## Практический пример

```typescript
// calculator.ts
export class Calculator {
  add(a: number, b: number): number {
    return a + b;
  }

  subtract(a: number, b: number): number {
    return a - b;
  }
}

// calculator.test.ts
import { Calculator } from './calculator';

describe('Calculator', () => {
  let calculator: Calculator;

  beforeEach(() => {
    calculator = new Calculator();
  });

  describe('add', () => {
    test('adds positive numbers', () => {
      expect(calculator.add(2, 3)).toBe(5);
    });

    test('adds negative numbers', () => {
      expect(calculator.add(-1, -2)).toBe(-3);
    });

    test('handles zero', () => {
      expect(calculator.add(0, 5)).toBe(5);
    });
  });

  describe('subtract', () => {
    test('subtracts numbers correctly', () => {
      expect(calculator.subtract(5, 3)).toBe(2);
    });
  });
});
```

## Дальше

Изучите [Vitest](/basics_testing/vitest) для более быстрого фреймворка.
