# Unit Testing - Модульное тестирование

## Что такое Unit Test?

Unit test — это тест, который проверяет одну функцию, метод или компонент в изоляции от остального кода.

## Принципы написания хорошего unit теста

### 1. Один assertion на тест

```typescript
// ❌ Плохо - несколько проверок
test('user creation', () => {
  const user = createUser('John', 'john@example.com');
  expect(user.name).toBe('John');      // 1-я проверка
  expect(user.email).toBe('john@example.com'); // 2-я проверка
  expect(user.id).toBeDefined();       // 3-я проверка
});

// ✅ Хорошо - отдельные тесты
test('creates user with name', () => {
  const user = createUser('John', 'john@example.com');
  expect(user.name).toBe('John');
});

test('creates user with email', () => {
  const user = createUser('John', 'john@example.com');
  expect(user.email).toBe('john@example.com');
});

test('generates user id', () => {
  const user = createUser('John', 'john@example.com');
  expect(user.id).toBeDefined();
});
```

### 2. Тестируйте поведение, не реализацию

```typescript
// ❌ Плохо - тестируем реализацию
test('getUserById calls database', () => {
  const mockDb = jest.fn();
  getUserById(1, mockDb);
  expect(mockDb).toHaveBeenCalledWith(1); // Тестируем как работает
});

// ✅ Хорошо - тестируем поведение
test('getUserById returns correct user', async () => {
  const user = await getUserById(1);
  expect(user.name).toBe('John');        // Тестируем что работает
});
```

### 3. Используйте AAA паттерн

```typescript
test('discount calculator', () => {
  // Arrange - подготовка
  const cart = new Cart();
  cart.addItem({ price: 100 });
  cart.addItem({ price: 50 });

  // Act - выполнение
  const discount = calculateDiscount(cart.total);

  // Assert - проверка
  expect(discount).toBe(15); // 10% скидка
});
```

## Тестирование функций

### Чистые функции (Pure Functions)

```typescript
// utils.ts
export function calculateTotal(items: Array<{price: number}>): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// utils.test.ts
describe('calculateTotal', () => {
  test('sums item prices', () => {
    const items = [{ price: 10 }, { price: 20 }, { price: 30 }];
    expect(calculateTotal(items)).toBe(60);
  });

  test('returns 0 for empty array', () => {
    expect(calculateTotal([])).toBe(0);
  });

  test('handles decimal prices', () => {
    const items = [{ price: 10.5 }, { price: 20.3 }];
    expect(calculateTotal(items)).toBeCloseTo(30.8);
  });
});
```

### Функции с побочными эффектами

```typescript
// UserService.ts
export class UserService {
  constructor(private db: Database, private logger: Logger) {}

  async createUser(data: UserData): Promise<User> {
    this.logger.log('Creating user...');
    const user = await this.db.save(data);
    this.logger.log('User created');
    return user;
  }
}

// UserService.test.ts
describe('UserService', () => {
  let service: UserService;
  let mockDb: jest.Mocked<Database>;
  let mockLogger: jest.Mocked<Logger>;

  beforeEach(() => {
    mockDb = {
      save: jest.fn()
    } as any;
    mockLogger = {
      log: jest.fn()
    } as any;
    service = new UserService(mockDb, mockLogger);
  });

  test('creates user in database', async () => {
    const userData = { name: 'John', email: 'john@example.com' };
    mockDb.save.mockResolvedValue({ id: 1, ...userData });

    const user = await service.createUser(userData);

    expect(mockDb.save).toHaveBeenCalledWith(userData);
    expect(user.id).toBe(1);
  });

  test('logs creation process', async () => {
    const userData = { name: 'John', email: 'john@example.com' };
    mockDb.save.mockResolvedValue({ id: 1, ...userData });

    await service.createUser(userData);

    expect(mockLogger.log).toHaveBeenCalledWith('Creating user...');
    expect(mockLogger.log).toHaveBeenCalledWith('User created');
  });
});
```

## Тестирование классов

```typescript
// Payment.ts
export class Payment {
  constructor(private stripe: StripeAPI) {}

  async processPayment(amount: number, token: string): Promise<PaymentResult> {
    if (amount <= 0) throw new Error('Amount must be positive');
    return this.stripe.charge(amount, token);
  }
}

// Payment.test.ts
describe('Payment', () => {
  let payment: Payment;
  let mockStripe: jest.Mocked<StripeAPI>;

  beforeEach(() => {
    mockStripe = { charge: jest.fn() } as any;
    payment = new Payment(mockStripe);
  });

  test('processes valid payment', async () => {
    mockStripe.charge.mockResolvedValue({ success: true, id: 'ch_1234' });

    const result = await payment.processPayment(100, 'token_123');

    expect(result.success).toBe(true);
    expect(mockStripe.charge).toHaveBeenCalledWith(100, 'token_123');
  });

  test('throws error for negative amount', async () => {
    await expect(payment.processPayment(-10, 'token_123'))
      .rejects
      .toThrow('Amount must be positive');
  });
});
```

## Тестирование асинхронного кода

```typescript
// api.ts
export async function fetchUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}

// api.test.ts
describe('fetchUser', () => {
  test('fetches and returns user', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => ({ id: 1, name: 'John' })
    });

    const user = await fetchUser(1);

    expect(user.name).toBe('John');
  });

  test('handles fetch error', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

    await expect(fetchUser(1)).rejects.toThrow('Network error');
  });
});
```

## Edge cases (Граничные случаи)

```typescript
export function divide(a: number, b: number): number {
  return a / b;
}

describe('divide', () => {
  test('divides positive numbers', () => {
    expect(divide(10, 2)).toBe(5);
  });

  test('divides negative numbers', () => {
    expect(divide(-10, 2)).toBe(-5);
  });

  test('returns Infinity for division by zero', () => {
    expect(divide(10, 0)).toBe(Infinity);
  });

  test('handles zero dividend', () => {
    expect(divide(0, 5)).toBe(0);
  });

  test('handles decimals', () => {
    expect(divide(10, 3)).toBeCloseTo(3.333, 2);
  });
});
```

## Тестирование ошибок

```typescript
describe('Input validation', () => {
  test('throws error for invalid email', () => {
    expect(() => validateEmail('invalid'))
      .toThrow('Invalid email format');
  });

  test('catches specific error type', () => {
    expect(() => validateEmail('invalid'))
      .toThrow(ValidationError);
  });

  test('async function throws error', async () => {
    await expect(riskyOperation())
      .rejects
      .toThrow('Operation failed');
  });
});
```

## Параметризованные тесты

```typescript
describe('Math operations', () => {
  test.each([
    [2, 3, 5],
    [0, 5, 5],
    [-1, 1, 0],
    [10, -5, 5]
  ])('add(%i, %i) = %i', (a, b, expected) => {
    expect(add(a, b)).toBe(expected);
  });
});
```

## Test naming (Названия тестов)

### ❌ Плохие названия

```typescript
test('test', () => { });           // Бесполезное
test('add', () => { });            // Слишком короткое
test('add returns', () => { });    // Неполное
```

### ✅ Хорошие названия

```typescript
test('should return sum of two numbers', () => { });
test('should throw error for invalid input', () => { });
test('should return user by id', () => { });
test('should handle empty array gracefully', () => { });
```

## Лучшие практики

✅ **Делайте:**
1. Тестируйте важную логику
2. Покрывайте edge cases
3. Используйте описательные имена
4. Изолируйте тесты
5. Тестируйте ошибки
6. Пишите тесты в том же стиле

❌ **Не делайте:**
1. ❌ Не тестируйте внутренние детали
2. ❌ Не копируйте бизнес-логику в тесты
3. ❌ Не создавайте слишком сложные фикстуры
4. ❌ Не полагайтесь на порядок тестов

## Дальше

Изучите [Testing React](/basics_testing/testing-react) для компонентов React.
