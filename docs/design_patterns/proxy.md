---
description: "Паттерн Proxy: контроль доступа к объекту через заместитель — структурный паттерн с примерами JS кода"
---

# Proxy (Заместитель)

## Описание

Паттерн **Proxy** подставляет вместо реального объекта объект-заместитель, который контролирует доступ к оригиналу. Proxy перехватывает обращения к объекту и может добавлять логику до или после вызова.

## Проблема

Вам нужно контролировать доступ к объекту: отложить его создание до первого использования (lazy loading), проверять права доступа, кешировать результаты или логировать вызовы — но не хочется менять сам объект.

## Решение

Создать прокси-объект с тем же интерфейсом, что и у оригинала. Прокси получает запросы от клиента, выполняет дополнительную логику и делегирует вызов реальному объекту.

```
Без Proxy:
  Client ──────────→ RealObject

С Proxy:
  Client ──→ Proxy ──→ RealObject
                │
                ├── Проверка доступа
                ├── Кеширование
                ├── Логирование
                └── Lazy loading
```

## Виды Proxy

```
┌─────────────────┬──────────────────────────────────┐
│ Тип             │ Назначение                       │
├─────────────────┼──────────────────────────────────┤
│ Virtual Proxy   │ Отложенная загрузка (lazy init)  │
│ Protection Proxy│ Контроль доступа (права)         │
│ Logging Proxy   │ Логирование запросов             │
│ Caching Proxy   │ Кеширование результатов          │
│ Remote Proxy    │ Работа с удалённым объектом       │
└─────────────────┴──────────────────────────────────┘
```

## Реализация

### Virtual Proxy (Lazy Loading)

```javascript
// === Тяжёлый объект ===
class HeavyDatabase {
  constructor() {
    // Имитация долгого подключения
    console.log('Подключение к БД... (3 секунды)');
    this.data = this._loadAllData();
    console.log('БД загружена!');
  }

  _loadAllData() {
    return {
      users: Array.from({ length: 10000 }, (_, i) => ({ id: i, name: `User${i}` })),
      products: Array.from({ length: 5000 }, (_, i) => ({ id: i, title: `Product${i}` }))
    };
  }

  query(table, id) {
    return this.data[table]?.find(item => item.id === id);
  }
}

// === Virtual Proxy — создаёт БД только при первом запросе ===
class DatabaseProxy {
  constructor() {
    this.db = null; // Не создаём сразу!
  }

  _init() {
    if (!this.db) {
      this.db = new HeavyDatabase();
    }
  }

  query(table, id) {
    this._init(); // Lazy initialization
    return this.db.query(table, id);
  }
}

// Без прокси: БД создаётся сразу (даже если не используется)
// const db = new HeavyDatabase(); // Сразу 3 секунды!

// С прокси: БД создаётся только при первом запросе
const db = new DatabaseProxy(); // Мгновенно
console.log('Прокси создан, БД ещё не загружена');

// ... спустя время, когда реально нужны данные:
const user = db.query('users', 42); // Вот тут загрузится БД
console.log(user); // { id: 42, name: 'User42' }
```

### Protection Proxy (Контроль доступа)

```javascript
// === Реальный объект ===
class BankAccount {
  constructor(owner, balance) {
    this.owner = owner;
    this.balance = balance;
  }

  withdraw(amount) {
    if (amount > this.balance) {
      throw new Error('Недостаточно средств');
    }
    this.balance -= amount;
    return `Снято ${amount}. Остаток: ${this.balance}`;
  }

  deposit(amount) {
    this.balance += amount;
    return `Внесено ${amount}. Остаток: ${this.balance}`;
  }

  getBalance() {
    return this.balance;
  }

  transfer(to, amount) {
    this.withdraw(amount);
    to.deposit(amount);
    return `Переведено ${amount}`;
  }
}

// === Protection Proxy ===
class BankAccountProxy {
  constructor(account, currentUser) {
    this.account = account;
    this.currentUser = currentUser;
  }

  _checkAccess(operation) {
    const permissions = {
      admin: ['withdraw', 'deposit', 'getBalance', 'transfer'],
      owner: ['withdraw', 'deposit', 'getBalance', 'transfer'],
      viewer: ['getBalance'],
      guest: []
    };

    const role = this.currentUser.role;
    if (!permissions[role]?.includes(operation)) {
      throw new Error(`Доступ запрещён: роль "${role}" не может выполнить "${operation}"`);
    }
  }

  withdraw(amount) {
    this._checkAccess('withdraw');
    return this.account.withdraw(amount);
  }

  deposit(amount) {
    this._checkAccess('deposit');
    return this.account.deposit(amount);
  }

  getBalance() {
    this._checkAccess('getBalance');
    return this.account.getBalance();
  }

  transfer(to, amount) {
    this._checkAccess('transfer');
    return this.account.transfer(to, amount);
  }
}

// === ИСПОЛЬЗОВАНИЕ ===
const account = new BankAccount('Иван', 10000);

const adminProxy = new BankAccountProxy(account, { name: 'Admin', role: 'admin' });
console.log(adminProxy.withdraw(500)); // Снято 500. Остаток: 9500

const viewerProxy = new BankAccountProxy(account, { name: 'Зритель', role: 'viewer' });
console.log(viewerProxy.getBalance()); // 9500

try {
  viewerProxy.withdraw(100); // Error: Доступ запрещён
} catch (e) {
  console.log(e.message);
}
```

### Logging / Monitoring Proxy

```javascript
// === Logging Proxy ===
class APIClientProxy {
  constructor(client) {
    this.client = client;
    this.log = [];
  }

  async request(method, url, data) {
    const startTime = Date.now();
    const logEntry = {
      method,
      url,
      timestamp: new Date().toISOString(),
      data
    };

    try {
      const result = await this.client.request(method, url, data);
      logEntry.status = 'success';
      logEntry.duration = Date.now() - startTime;
      logEntry.responseSize = JSON.stringify(result).length;
      return result;
    } catch (error) {
      logEntry.status = 'error';
      logEntry.error = error.message;
      logEntry.duration = Date.now() - startTime;
      throw error;
    } finally {
      this.log.push(logEntry);
      console.log(`[${logEntry.method}] ${logEntry.url} — ${logEntry.status} (${logEntry.duration}ms)`);
    }
  }

  getStats() {
    const total = this.log.length;
    const errors = this.log.filter(l => l.status === 'error').length;
    const avgDuration = this.log.reduce((s, l) => s + l.duration, 0) / total;
    return { total, errors, avgDuration: `${avgDuration.toFixed(0)}ms` };
  }
}
```

### Caching Proxy

```javascript
// === Caching Proxy ===
class CachingProxy {
  constructor(service, ttl = 60000) {
    this.service = service;
    this.cache = new Map();
    this.ttl = ttl;
  }

  async getData(key) {
    const cached = this.cache.get(key);

    if (cached && Date.now() - cached.timestamp < this.ttl) {
      console.log(`Cache HIT: ${key}`);
      return cached.data;
    }

    console.log(`Cache MISS: ${key}`);
    const data = await this.service.getData(key);
    this.cache.set(key, { data, timestamp: Date.now() });
    return data;
  }

  invalidate(key) {
    this.cache.delete(key);
  }

  clearAll() {
    this.cache.clear();
  }
}

// === Использование ===
class UserService {
  async getData(userId) {
    console.log(`Запрос к БД для user: ${userId}`);
    return { id: userId, name: 'John', email: 'john@test.com' };
  }
}

const userService = new CachingProxy(new UserService(), 30000);

// Первый вызов — из БД
await userService.getData('user:1'); // Cache MISS → Запрос к БД

// Второй вызов — из кеша
await userService.getData('user:1'); // Cache HIT (мгновенно)

// Инвалидация после обновления
userService.invalidate('user:1');
await userService.getData('user:1'); // Cache MISS → Запрос к БД
```

## ES6 Proxy в JavaScript

JavaScript имеет встроенный объект `Proxy`, который позволяет создавать прокси нативно:

### Валидация данных

```javascript
const userValidator = {
  set(target, property, value) {
    if (property === 'age') {
      if (typeof value !== 'number' || value < 0 || value > 150) {
        throw new TypeError('Возраст должен быть числом от 0 до 150');
      }
    }
    if (property === 'email') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        throw new TypeError('Невалидный email');
      }
    }
    if (property === 'name') {
      if (typeof value !== 'string' || value.length < 2) {
        throw new TypeError('Имя должно быть строкой длиной > 1');
      }
    }
    target[property] = value;
    return true;
  }
};

const user = new Proxy({}, userValidator);
user.name = 'Иван';     // OK
user.email = 'ivan@m.ru'; // OK
user.age = 25;            // OK

try {
  user.age = -5;          // TypeError: Возраст должен быть числом от 0 до 150
} catch (e) {
  console.log(e.message);
}
```

### Реактивность (как в Vue 3)

```javascript
function reactive(target, onChange) {
  return new Proxy(target, {
    set(obj, prop, value) {
      const oldValue = obj[prop];
      obj[prop] = value;
      if (oldValue !== value) {
        onChange(prop, value, oldValue);
      }
      return true;
    },
    get(obj, prop) {
      const value = obj[prop];
      // Рекурсивная реактивность для вложенных объектов
      if (value && typeof value === 'object') {
        return reactive(value, onChange);
      }
      return value;
    }
  });
}

const state = reactive({ count: 0, user: { name: 'Иван' } }, (prop, newVal, oldVal) => {
  console.log(`${prop}: ${oldVal} → ${newVal}`);
});

state.count = 1;           // count: 0 → 1
state.count = 2;           // count: 1 → 2
state.user.name = 'Пётр';  // name: Иван → Пётр
```

### Отрицательные индексы массива (как в Python)

```javascript
function createSmartArray(...items) {
  return new Proxy(items, {
    get(target, prop) {
      const index = Number(prop);
      if (Number.isInteger(index) && index < 0) {
        return target[target.length + index]; // arr[-1] → последний элемент
      }
      return target[prop];
    }
  });
}

const arr = createSmartArray('a', 'b', 'c', 'd');
console.log(arr[-1]); // 'd'
console.log(arr[-2]); // 'c'
console.log(arr[0]);  // 'a'
```

### Логирование доступа к свойствам

```javascript
function withLogging(obj, label = 'Object') {
  return new Proxy(obj, {
    get(target, prop) {
      console.log(`[GET] ${label}.${String(prop)}`);
      return target[prop];
    },
    set(target, prop, value) {
      console.log(`[SET] ${label}.${String(prop)} = ${JSON.stringify(value)}`);
      target[prop] = value;
      return true;
    },
    deleteProperty(target, prop) {
      console.log(`[DELETE] ${label}.${String(prop)}`);
      delete target[prop];
      return true;
    }
  });
}

const config = withLogging({ host: 'localhost', port: 3000 }, 'Config');
config.host;           // [GET] Config.host
config.port = 8080;    // [SET] Config.port = 8080
delete config.host;    // [DELETE] Config.host
```

## Примеры в реальной жизни

| Пример | Тип Proxy | Описание |
|--------|-----------|----------|
| Vue 3 reactivity | ES6 Proxy | Отслеживание изменений состояния |
| ORM (Sequelize, TypeORM) | Virtual Proxy | Lazy loading связанных данных |
| Nginx | Remote Proxy | Reverse proxy к backend-серверам |
| Spring Security | Protection Proxy | Контроль доступа через аннотации |
| CDN | Caching Proxy | Кеширование статики ближе к пользователю |
| API Gateway | Logging + Protection | Rate limiting, auth, logging |

## Когда использовать

```
✓ Отложенная инициализация тяжёлых объектов (Virtual Proxy)
✓ Контроль доступа по ролям (Protection Proxy)
✓ Кеширование результатов (Caching Proxy)
✓ Логирование и мониторинг (Logging Proxy)
✓ Работа с удалёнными объектами (Remote Proxy)
✓ Валидация данных перед записью

✗ Простые объекты без необходимости контроля
✗ Когда дополнительный уровень косвенности критичен для производительности
```

## Proxy vs Decorator

```
Proxy:
  Контролирует ДОСТУП к объекту
  Сам создаёт/управляет жизненным циклом объекта
  Клиент может не знать о прокси
  Тот же интерфейс

Decorator:
  РАСШИРЯЕТ функциональность объекта
  Получает объект извне (через конструктор)
  Клиент сам оборачивает объект
  Тот же интерфейс (может добавлять методы)
```

## Преимущества и недостатки

| Преимущества | Недостатки |
|-------------|-----------|
| Контролирует доступ без изменения объекта | Увеличивает задержку (дополнительный слой) |
| Open/Closed Principle — легко добавить новое поведение | Усложняет код |
| Работает прозрачно для клиента | Ответ от прокси может отличаться от реального |
| ES6 Proxy — мощный нативный механизм | ES6 Proxy имеет ограничения (private fields) |
