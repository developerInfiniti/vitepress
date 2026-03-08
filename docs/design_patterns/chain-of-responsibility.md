---
description: "Паттерн Chain of Responsibility: цепочка обработчиков запросов — поведенческий паттерн с примерами"
---

# Chain of Responsibility паттерн

**Chain of Responsibility** (Цепочка обязанностей) — это поведенческий паттерн, который позволяет передавать запрос по цепочке обработчиков. Каждый обработчик решает, может ли он обработать запрос, и передаёт его дальше по цепочке.

---

## Проблема

```javascript
// ❌ Без паттерна — монолитная обработка с вложенными if
function processRequest(request) {
  // Аутентификация
  if (!request.token) {
    return { error: 'Нет токена' };
  }

  // Авторизация
  const user = verifyToken(request.token);
  if (!user) {
    return { error: 'Неверный токен' };
  }
  if (!user.hasPermission(request.resource)) {
    return { error: 'Нет доступа' };
  }

  // Валидация
  if (!request.body || !request.body.name) {
    return { error: 'Имя обязательно' };
  }

  // Rate limiting
  if (isRateLimited(user)) {
    return { error: 'Слишком много запросов' };
  }

  // Логирование
  logRequest(request);

  // Обработка
  return handleRequest(request);
}
// Один огромный метод с кучей ответственностей!
```

### Проблемы:

1. **Монолитность** — вся логика в одной функции
2. **Нарушение SRP** — функция отвечает за всё
3. **Негибкость** — нельзя менять порядок или набор проверок
4. **Сложность тестирования** — невозможно протестировать шаги отдельно

---

## Решение

### Визуализация паттерна

```
Request
  │
  ▼
┌──────┐    ┌──────┐    ┌──────┐    ┌──────┐
│ Auth │───▶│Authz │───▶│Valid.│───▶│ Rate │───▶ Response
│      │    │      │    │      │    │Limit │
└──────┘    └──────┘    └──────┘    └──────┘
  │           │           │           │
  ▼           ▼           ▼           ▼
 Error       Error       Error       Error
(401)       (403)       (400)       (429)
```

### Базовый пример

```javascript
class Handler {
  constructor() {
    this.next = null;
  }

  setNext(handler) {
    this.next = handler;
    return handler; // Для цепочки вызовов
  }

  handle(request) {
    if (this.next) {
      return this.next.handle(request);
    }
    return null;
  }
}

class AuthenticationHandler extends Handler {
  handle(request) {
    if (!request.token) {
      return { status: 401, error: 'Токен не предоставлен' };
    }

    // Имитация проверки токена
    request.user = { id: 1, name: 'Alice', role: 'admin' };
    console.log('[Auth] Пользователь аутентифицирован');
    return super.handle(request);
  }
}

class AuthorizationHandler extends Handler {
  constructor(requiredRole) {
    super();
    this.requiredRole = requiredRole;
  }

  handle(request) {
    if (request.user.role !== this.requiredRole) {
      return { status: 403, error: 'Недостаточно прав' };
    }
    console.log('[Authz] Доступ разрешён');
    return super.handle(request);
  }
}

class ValidationHandler extends Handler {
  constructor(rules) {
    super();
    this.rules = rules;
  }

  handle(request) {
    for (const [field, rule] of Object.entries(this.rules)) {
      if (rule.required && !request.body?.[field]) {
        return { status: 400, error: `Поле "${field}" обязательно` };
      }
    }
    console.log('[Validation] Данные корректны');
    return super.handle(request);
  }
}

class RateLimitHandler extends Handler {
  constructor(maxRequests = 100) {
    super();
    this.maxRequests = maxRequests;
    this.requests = new Map();
  }

  handle(request) {
    const userId = request.user?.id || 'anonymous';
    const count = (this.requests.get(userId) || 0) + 1;
    this.requests.set(userId, count);

    if (count > this.maxRequests) {
      return { status: 429, error: 'Слишком много запросов' };
    }
    console.log(`[RateLimit] Запрос ${count}/${this.maxRequests}`);
    return super.handle(request);
  }
}

class RequestHandler extends Handler {
  handle(request) {
    console.log('[Handler] Обработка запроса');
    return { status: 200, data: 'Успех!' };
  }
}

// Построение цепочки
const auth = new AuthenticationHandler();
const authz = new AuthorizationHandler('admin');
const validation = new ValidationHandler({ name: { required: true } });
const rateLimit = new RateLimitHandler(5);
const handler = new RequestHandler();

auth.setNext(authz).setNext(validation).setNext(rateLimit).setNext(handler);

// Использование
const result = auth.handle({
  token: 'valid-token',
  body: { name: 'Test' }
});
console.log(result);
// [Auth] Пользователь аутентифицирован
// [Authz] Доступ разрешён
// [Validation] Данные корректны
// [RateLimit] Запрос 1/5
// [Handler] Обработка запроса
// { status: 200, data: 'Успех!' }

// Запрос без токена
const result2 = auth.handle({ body: { name: 'Test' } });
console.log(result2);
// { status: 401, error: 'Токен не предоставлен' }
```

---

## Практические примеры

### Пример 1: Middleware (как в Express)

```javascript
class MiddlewareChain {
  constructor() {
    this.middlewares = [];
  }

  use(middleware) {
    this.middlewares.push(middleware);
    return this;
  }

  async execute(context) {
    let index = 0;

    const next = async () => {
      if (index < this.middlewares.length) {
        const middleware = this.middlewares[index++];
        await middleware(context, next);
      }
    };

    await next();
    return context;
  }
}

// Middleware функции
const logger = async (ctx, next) => {
  const start = Date.now();
  console.log(`--> ${ctx.method} ${ctx.path}`);
  await next();
  console.log(`<-- ${ctx.method} ${ctx.path} ${Date.now() - start}ms`);
};

const cors = async (ctx, next) => {
  ctx.headers = ctx.headers || {};
  ctx.headers['Access-Control-Allow-Origin'] = '*';
  console.log('[CORS] Заголовки добавлены');
  await next();
};

const auth = async (ctx, next) => {
  if (!ctx.token) {
    ctx.status = 401;
    ctx.body = { error: 'Unauthorized' };
    return; // НЕ вызываем next() — цепочка прерывается
  }
  ctx.user = { id: 1, name: 'Alice' };
  console.log('[Auth] OK');
  await next();
};

const handler = async (ctx, next) => {
  ctx.status = 200;
  ctx.body = { message: `Hello, ${ctx.user.name}!` };
};

// Использование
const app = new MiddlewareChain();
app.use(logger).use(cors).use(auth).use(handler);

// Успешный запрос
await app.execute({
  method: 'GET',
  path: '/api/users',
  token: 'valid'
});

// Запрос без токена
await app.execute({
  method: 'GET',
  path: '/api/users'
});
```

### Пример 2: Обработка логов по уровням

```javascript
class LogHandler {
  constructor(level) {
    this.level = level;
    this.next = null;
  }

  setNext(handler) {
    this.next = handler;
    return handler;
  }

  handle(logLevel, message) {
    if (this.canHandle(logLevel)) {
      this.write(logLevel, message);
    }
    // Передаём всегда — каждый handler решает сам
    if (this.next) {
      this.next.handle(logLevel, message);
    }
  }

  canHandle(level) {
    const levels = { debug: 0, info: 1, warn: 2, error: 3 };
    return levels[level] >= levels[this.level];
  }

  write(level, message) {
    throw new Error('write() не реализован');
  }
}

class ConsoleLogHandler extends LogHandler {
  constructor() {
    super('debug');
  }

  write(level, message) {
    console.log(`[Console][${level.toUpperCase()}] ${message}`);
  }
}

class FileLogHandler extends LogHandler {
  constructor() {
    super('info');
  }

  write(level, message) {
    console.log(`[File][${level.toUpperCase()}] ${message} -> saved to app.log`);
  }
}

class EmailLogHandler extends LogHandler {
  constructor(email) {
    super('error');
    this.email = email;
  }

  write(level, message) {
    console.log(`[Email] Отправлено на ${this.email}: ${message}`);
  }
}

class SlackLogHandler extends LogHandler {
  constructor(channel) {
    super('warn');
    this.channel = channel;
  }

  write(level, message) {
    console.log(`[Slack #${this.channel}][${level.toUpperCase()}] ${message}`);
  }
}

// Построение цепочки
const console_ = new ConsoleLogHandler();
const file = new FileLogHandler();
const slack = new SlackLogHandler('alerts');
const email = new EmailLogHandler('admin@company.com');

console_.setNext(file).setNext(slack).setNext(email);

// Использование
console_.handle('debug', 'Отладочная информация');
// [Console][DEBUG] Отладочная информация

console_.handle('info', 'Сервер запущен на порту 3000');
// [Console][INFO] ...
// [File][INFO] ... -> saved to app.log

console_.handle('warn', 'Высокая нагрузка на CPU');
// [Console][WARN] ...
// [File][WARN] ...
// [Slack #alerts][WARN] ...

console_.handle('error', 'База данных недоступна');
// [Console][ERROR] ...
// [File][ERROR] ...
// [Slack #alerts][ERROR] ...
// [Email] Отправлено на admin@company.com: ...
```

### Пример 3: Система скидок

```javascript
class DiscountHandler {
  constructor() {
    this.next = null;
  }

  setNext(handler) {
    this.next = handler;
    return handler;
  }

  handle(order) {
    if (this.next) {
      return this.next.handle(order);
    }
    return order;
  }
}

class PromoCodeDiscount extends DiscountHandler {
  constructor() {
    super();
    this.promoCodes = {
      'SAVE10': 0.10,
      'SAVE20': 0.20,
      'VIP50': 0.50
    };
  }

  handle(order) {
    if (order.promoCode && this.promoCodes[order.promoCode]) {
      const discount = this.promoCodes[order.promoCode];
      order.total *= (1 - discount);
      order.discounts.push(`Промокод ${order.promoCode}: -${discount * 100}%`);
    }
    return super.handle(order);
  }
}

class VolumeDiscount extends DiscountHandler {
  handle(order) {
    if (order.itemCount > 10) {
      order.total *= 0.95;
      order.discounts.push('Оптовая скидка: -5%');
    } else if (order.itemCount > 5) {
      order.total *= 0.97;
      order.discounts.push('Скидка за количество: -3%');
    }
    return super.handle(order);
  }
}

class LoyaltyDiscount extends DiscountHandler {
  handle(order) {
    if (order.customer.loyaltyYears >= 5) {
      order.total *= 0.90;
      order.discounts.push('Программа лояльности (5+ лет): -10%');
    } else if (order.customer.loyaltyYears >= 2) {
      order.total *= 0.95;
      order.discounts.push('Программа лояльности (2+ лет): -5%');
    }
    return super.handle(order);
  }
}

class MinPriceGuard extends DiscountHandler {
  handle(order) {
    // Гарантируем минимальную цену
    const minPrice = order.originalTotal * 0.5;
    if (order.total < minPrice) {
      order.total = minPrice;
      order.discounts.push('Максимальная скидка: 50%');
    }
    order.total = Math.round(order.total * 100) / 100;
    return super.handle(order);
  }
}

// Построение цепочки
const promo = new PromoCodeDiscount();
const volume = new VolumeDiscount();
const loyalty = new LoyaltyDiscount();
const guard = new MinPriceGuard();

promo.setNext(volume).setNext(loyalty).setNext(guard);

// Использование
const order = {
  originalTotal: 1000,
  total: 1000,
  itemCount: 12,
  promoCode: 'SAVE20',
  customer: { loyaltyYears: 6 },
  discounts: []
};

const result = promo.handle(order);
console.log(`Итого: ${result.total} руб.`);
console.log('Скидки:', result.discounts);
// Итого: 684 руб.
// Скидки: [
//   'Промокод SAVE20: -20%',
//   'Оптовая скидка: -5%',
//   'Программа лояльности (5+ лет): -10%'
// ]
```

---

## Примеры из реальной жизни

| Библиотека / Инструмент | Где используется |
|--------------------------|------------------|
| **Express.js** | Middleware — app.use() цепочка обработчиков |
| **Koa** | Middleware с async/await |
| **DOM Events** | Event bubbling — всплытие событий от ребёнка к родителю |
| **Webpack** | Loader chain — цепочка преобразований файлов |
| **Axios** | Interceptors — перехватчики запросов и ответов |
| **Redux** | Middleware: thunk -> logger -> api |

---

## Когда использовать Chain of Responsibility

### Хорошие случаи:

- **Middleware** — обработка запросов через цепочку фильтров
- **Валидация** — последовательная проверка данных
- **Логирование** — обработка логов разными обработчиками
- **Событийная модель** — передача событий по иерархии

### Когда не нужен:

- **Один обработчик** — если обработчик всегда один
- **Фиксированная логика** — если порядок и набор шагов не меняются
- **Гарантия обработки** — если запрос обязан быть обработан

---

## Сравнение с другими паттернами

| Аспект | Chain of Responsibility | Decorator |
|--------|------------------------|-----------|
| **Цель** | Передать запрос по цепочке | Добавить поведение |
| **Обработка** | Один обработчик или несколько | Все декораторы обрабатывают |
| **Прерывание** | Может прервать цепочку | Всегда передаёт дальше |

| Аспект | Chain of Responsibility | Command |
|--------|------------------------|---------|
| **Фокус** | Кто обработает запрос | Инкапсуляция запроса |
| **Количество** | Много возможных обработчиков | Один исполнитель |
| **Решение** | Обработчик решает сам | Invoker выбирает команду |

---

## Резюме

| Аспект | Описание |
|--------|---------|
| **Цель** | Передавать запрос по цепочке обработчиков |
| **Проблема** | Монолитная обработка с множеством ответственностей |
| **Решение** | Каждый обработчик решает: обработать или передать дальше |
| **Плюсы** | SRP, гибкость, динамическая настройка цепочки |
| **Минусы** | Запрос может остаться необработанным |
| **Когда** | Middleware, валидация, обработка событий |
