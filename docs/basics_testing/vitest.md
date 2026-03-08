---
description: "Vitest: быстрый тест-раннер для Vite проектов, совместимость с Jest API — современное тестирование"
---

# Vitest - Быстрое тестирование

## Что такое Vitest?

Vitest — это фреймворк для тестирования на базе Vite. Совместим с Jest API, но работает значительно быстрее благодаря Vite.

## Установка

```bash
npm install --save-dev vitest @vitest/ui
```

## Конфигурация

### vite.config.ts

```typescript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'node'
  }
});
```

### vitest.config.ts (выделенная конфигурация)

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8'
    }
  }
});
```

## Основные отличия от Jest

| Параметр | Jest | Vitest |
|----------|------|--------|
| **Скорость** | ⚠️ Медленнее | ✅ Очень быстро |
| **Hot reload** | ❌ Нет | ✅ Да |
| **TypeScript** | ✅ Требует config | ✅ Out of the box |
| **Vite интеграция** | ❌ Нет | ✅ Встроена |
| **API совместимость** | - | ✅ Jest compatible |

## Быстрый старт

```bash
npm install --save-dev vitest
npx vitest
```

## Написание теста

```typescript
import { describe, test, expect } from 'vitest';

describe('Calculator', () => {
  test('adds numbers', () => {
    expect(1 + 1).toBe(2);
  });
});
```

## Globals (Глобальные функции)

Если включены globals, не нужно импортировать:

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    globals: true
  }
});

// теперь можно писать без импорта
describe('Math', () => {
  test('works', () => {
    expect(2 + 2).toBe(4);
  });
});
```

## Watch mode

```bash
vitest              # Watch mode по умолчанию
vitest --run        # Один раз и выход
vitest --ui         # UI интерфейс
vitest --coverage   # С покрытием
```

## Mocking в Vitest

### vi.fn()

```typescript
import { vi, describe, test, expect } from 'vitest';

const mockFn = vi.fn();
mockFn('hello');

expect(mockFn).toHaveBeenCalledWith('hello');
```

### vi.mock()

```typescript
import { vi } from 'vitest';

vi.mock('./api', () => ({
  fetchUser: vi.fn(() => Promise.resolve({ id: 1 }))
}));
```

### vi.spyOn()

```typescript
const obj = {
  greet: (name) => `Hello ${name}`
};

const spy = vi.spyOn(obj, 'greet');
obj.greet('John');

expect(spy).toHaveBeenCalledWith('John');
```

## Async тестирование

```typescript
test('async operation', async () => {
  const result = await fetchData();
  expect(result).toBeDefined();
});

// С таймаутом
test('long operation', async () => {
  const result = await longRunningTask();
  expect(result).toBe('done');
}, 10000); // 10 сек timeout
```

## Snapshots

```typescript
test('renders header', () => {
  const component = render(<Header title="Test" />);
  expect(component.html()).toMatchSnapshot();
});
```

Обновить: `vitest -u`

## Coverage (Покрытие)

```bash
vitest --coverage
```

Конфигурация:

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/'
      ]
    }
  }
});
```

## Параллельное выполнение

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    threads: true,
    maxThreads: 4,
    minThreads: 1
  }
});
```

## Matchers в Vitest

Все matcher'ы из Jest работают также в Vitest:

```typescript
expect(value).toBe(5);
expect(value).toEqual(obj);
expect(fn).toHaveBeenCalled();
expect(value).toMatch(/regex/);
```

Плюс дополнительные:

```typescript
expect(value).rejects.toThrow(); // Для Promise
expect(value).resolves.toBe(5);  // Для Promise
```

## Setup файлы

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    setupFiles: ['./vitest.setup.ts']
  }
});

// vitest.setup.ts
import { beforeAll, afterAll } from 'vitest';

beforeAll(() => {
  console.log('Тесты начались');
});

afterAll(() => {
  console.log('Тесты закончились');
});
```

## Практический пример

```typescript
// counter.ts
export class Counter {
  private count = 0;

  increment() {
    this.count++;
  }

  decrement() {
    this.count--;
  }

  get value() {
    return this.count;
  }
}

// counter.test.ts
import { describe, test, expect, beforeEach } from 'vitest';
import { Counter } from './counter';

describe('Counter', () => {
  let counter: Counter;

  beforeEach(() => {
    counter = new Counter();
  });

  test('increment works', () => {
    counter.increment();
    expect(counter.value).toBe(1);
  });

  test('decrement works', () => {
    counter.decrement();
    expect(counter.value).toBe(-1);
  });

  test('multiple operations', () => {
    counter.increment();
    counter.increment();
    counter.decrement();
    expect(counter.value).toBe(1);
  });
});
```

## UI Dashboard

```bash
npx vitest --ui
```

Откроет красивый интерфейс с результатами тестов.

## Интеграция с IDE

### VS Code

Установить расширение: **Vitest**

Будут отображаться статусы тестов прямо в редакторе.

## Лучшие практики

✅ **С Vitest:**
1. Используйте globals для удобства
2. Запускайте тесты в watch mode при разработке
3. Используйте UI для визуализации
4. Включайте coverage для контроля качества
5. Используйте параллельное выполнение

❌ **Избегайте:**
1. ❌ Не полагайтесь на порядок выполнения
2. ❌ Не используйте timing-зависимые тесты
3. ❌ Не забывайте про cleanup в afterEach

## Дальше

Изучите [Unit Testing](/basics_testing/unit-testing) для написания эффективных модульных тестов.
