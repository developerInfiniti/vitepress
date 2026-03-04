# Testing Basics (Основы Тестирования)

## Что такое тестирование?

Тестирование — это процесс проверки того, что код работает правильно. Помогает находить баги, улучшать качество и предотвращать регрессии.

## Пирамида тестирования

```
        △
       /|\
      / | \
     /  |  \  E2E Tests (5-10%)
    /   |   \
   /════════╱
  /    │    \
 / Unit Tests\  Integration Tests (30-40%)
/═════════════\
      (60-70%)
```

## Типы тестов

### 1. Unit Tests (Модульные тесты)

Тестирование одной функции или компонента изолированно.

```typescript
function add(a, b) {
  return a + b;
}

// ✅ Unit test
test('add returns correct sum', () => {
  expect(add(2, 3)).toBe(5);
});
```

**Характеристики:**
- Быстрые
- Простые в написании
- Тестируют отдельные блоки кода
- Большое количество (60-70%)

### 2. Integration Tests (Интеграционные тесты)

Тестирование взаимодействия нескольких компонентов/модулей.

```typescript
test('user can login', async () => {
  const user = await createUser({ email: 'test@test.com' });
  const result = await login(user.email, 'password');
  expect(result.success).toBe(true);
});
```

**Характеристики:**
- Медленнее, чем unit тесты
- Тестируют интеграцию модулей
- Среднее количество (30-40%)

### 3. End-to-End Tests (E2E тесты)

Тестирование всей системы от начала до конца как реальный пользователь.

```typescript
test('user can complete purchase', async () => {
  await page.goto('https://shop.com');
  await page.click('text=Add to Cart');
  await page.click('text=Checkout');
  // ... много взаимодействий
  expect(await page.textContent('Order Complete')).toBeTruthy();
});
```

**Характеристики:**
- Самые медленные
- Используют браузер/Selenium/Cypress
- Малое количество (5-10%)

## Jest vs Vitest

| Аспект | Jest | Vitest |
|--------|------|--------|
| **Скорость** | ⚠️ Медленнее | ✅ Быстрее (Vite) |
| **Config** | ✅ Простая | ✅ Простая |
| **TypeScript** | ✅ Встроена | ✅ Встроена |
| **Snapshots** | ✅ Да | ✅ Да |
| **Watch mode** | ✅ Да | ✅ Да |
| **Популярность** | ✅ Очень популярен | ✅ Растет |

## Основные концепции

### describe() - группировка тестов

```typescript
describe('User Service', () => {
  describe('createUser', () => {
    test('creates user with valid data', () => {
      // ...
    });

    test('throws error with invalid data', () => {
      // ...
    });
  });

  describe('deleteUser', () => {
    test('deletes user by id', () => {
      // ...
    });
  });
});
```

### test() / it() - написание теста

```typescript
test('addition works', () => {
  expect(2 + 2).toBe(4);
});

// или
it('addition works', () => {
  expect(2 + 2).toBe(4);
});
```

### expect() - утверждения

```typescript
expect(value).toBe(5);           // ===
expect(value).toEqual(obj);      // Глубокое сравнение
expect(value).toBeTruthy();      // Правда?
expect(value).toBeFalsy();       // Ложь?
expect(value).toContain('text'); // Содержит?
expect(fn).toThrow();            // Выбрасывает ошибку?
expect(fn).toHaveBeenCalled();   // Был вызван?
```

## AAA паттерн (Arrange-Act-Assert)

```typescript
test('should calculate total price', () => {
  // Arrange - подготовка данных
  const cart = new Cart();
  cart.addItem({ name: 'Book', price: 10 });

  // Act - выполнение действия
  const total = cart.getTotal();

  // Assert - проверка результата
  expect(total).toBe(10);
});
```

## Типы утверждений (Matchers)

### Численные сравнения

```typescript
expect(4).toBeGreaterThan(3);
expect(4).toBeGreaterThanOrEqual(4);
expect(4).toBeLessThan(5);
```

### Строки

```typescript
expect('team').toMatch(/^team/);
expect('hello').toMatch('ell');
```

### Массивы

```typescript
expect([1, 2, 3]).toContain(2);
expect([1, 2, 3]).toHaveLength(3);
```

### Объекты

```typescript
expect(user).toEqual({ name: 'John', age: 30 });
expect(user).toHaveProperty('name');
```

### Функции

```typescript
const mockFn = jest.fn();
mockFn('hello');
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledWith('hello');
```

## Setup и Teardown

```typescript
describe('Database', () => {
  beforeAll(() => {
    // Запускается один раз перед всеми тестами
    db.connect();
  });

  beforeEach(() => {
    // Запускается перед каждым тестом
    db.clear();
  });

  afterEach(() => {
    // Запускается после каждого теста
    cleanup();
  });

  afterAll(() => {
    // Запускается один раз после всех тестов
    db.disconnect();
  });

  test('saves user', () => {
    // ...
  });
});
```

## Mocks и Stubs

### Mock функция

```typescript
const mockFn = jest.fn();
mockFn('arg');
expect(mockFn).toHaveBeenCalledWith('arg');
```

### Mock модуля

```typescript
jest.mock('./api', () => ({
  fetchUser: jest.fn(() => Promise.resolve({ id: 1 }))
}));
```

### Stub (замена реального значения)

```typescript
const obj = {
  method: jest.fn().mockReturnValue('mocked value')
};
expect(obj.method()).toBe('mocked value');
```

## Coverage (Покрытие кода)

```bash
npm test -- --coverage
```

Вывод:
```
File      | % Stmts | % Branch | % Funcs | % Lines
----------|---------|----------|---------|--------
All files |   95.2  |   89.5   |   100   |   95.0
```

## Лучшие практики

✅ **Делайте:**
1. Тестируйте behavior, не реализацию
2. Один assert на тест (или логически связанные)
3. Используйте описательные имена
4. Структурируйте тесты с describe()
5. Изолируйте тесты (не полагайтесь на порядок)
6. Пишите тесты перед кодом (TDD)

❌ **Не делайте:**
1. ❌ Не тестируйте детали реализации
2. ❌ Не копируйте логику в тесты
3. ❌ Не создавайте тесты для тестов
4. ❌ Не полагайтесь на timing (setTimeout)
5. ❌ Не забывайте про edge cases

## Дальше

Изучите [Jest](/basics_testing/jest) для подробного разбора框架.
