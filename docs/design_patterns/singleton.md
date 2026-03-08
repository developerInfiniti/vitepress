---
description: "Паттерн Singleton: единственный экземпляр класса с глобальным доступом — порождающий паттерн с примерами"
---

# Singleton паттерн

Паттерн **Singleton** гарантирует, что класс имеет одну единственный экземпляр и предоставляет глобальную точку доступа к этому экземпляру.

---

## Проблема

```javascript
// Без Singleton — можно создать много объектов
class Database {
  constructor() {
    this.connection = null;
    this.connect();
  }

  connect() {
    console.log('Connecting to database...');
    this.connection = Math.random(); // уникальное соединение
  }
}

const db1 = new Database(); // новое соединение
const db2 = new Database(); // ещё новое!
const db3 = new Database(); // и ещё!

console.log(db1.connection === db2.connection); // false
// Проблема: 3 разных подключения вместо одного!
```

---

## Решение с Singleton

### Классический способ

```javascript
class Database {
  static instance = null;

  constructor() {
    if (Database.instance !== null) {
      return Database.instance;
    }
    this.connection = null;
    this.connect();
    Database.instance = this;
  }

  connect() {
    console.log('Connecting to database...');
    this.connection = Math.random();
  }
}

const db1 = new Database();
const db2 = new Database();
const db3 = new Database();

console.log(db1.connection === db2.connection); // true ✅
console.log(db1 === db2 && db2 === db3);      // true ✅
```

### Современный способ (с private полями)

```javascript
class Database {
  static #instance = null;

  constructor() {
    if (Database.#instance) {
      return Database.#instance;
    }
    this.connection = null;
    this.connect();
    Database.#instance = this;
  }

  static getInstance() {
    if (Database.#instance === null) {
      Database.#instance = new Database();
    }
    return Database.#instance;
  }

  connect() {
    console.log('Connecting to database...');
    this.connection = Math.random();
  }
}

// Использование через getInstance (безопаснее)
const db1 = Database.getInstance();
const db2 = Database.getInstance();

console.log(db1 === db2); // true ✅
```

---

## Практические примеры

### Пример 1: Логирование

```javascript
class Logger {
  static #instance = null;
  #logs = [];

  static getInstance() {
    if (!Logger.#instance) {
      Logger.#instance = new Logger();
    }
    return Logger.#instance;
  }

  log(message) {
    const timestamp = new Date().toISOString();
    this.#logs.push(`[${timestamp}] ${message}`);
    console.log(message);
  }

  getLogs() {
    return [...this.#logs]; // копия для безопасности
  }
}

// Использование в разных файлах
// file1.js
Logger.getInstance().log('Приложение запущено');

// file2.js
Logger.getInstance().log('Пользователь залогинился');

// file3.js
const allLogs = Logger.getInstance().getLogs();
console.log(allLogs); // все логи из разных файлов!
```

### Пример 2: Конфигурация приложения

```javascript
class Config {
  static #instance = null;
  #config = {};

  static getInstance() {
    if (!Config.#instance) {
      Config.#instance = new Config();
    }
    return Config.#instance;
  }

  load(configObj) {
    this.#config = { ...configObj };
  }

  get(key) {
    return this.#config[key];
  }

  set(key, value) {
    this.#config[key] = value;
  }
}

// Инициализация при старте
Config.getInstance().load({
  apiUrl: 'https://api.example.com',
  timeout: 5000,
  debug: false
});

// Использование везде
class APIClient {
  async fetch(endpoint) {
    const baseUrl = Config.getInstance().get('apiUrl');
    const timeout = Config.getInstance().get('timeout');
    // ...
  }
}
```

### Пример 3: Очередь событий

```javascript
class EventBus {
  static #instance = null;
  #listeners = {};

  static getInstance() {
    if (!EventBus.#instance) {
      EventBus.#instance = new EventBus();
    }
    return EventBus.#instance;
  }

  on(event, callback) {
    if (!this.#listeners[event]) {
      this.#listeners[event] = [];
    }
    this.#listeners[event].push(callback);
  }

  emit(event, data) {
    if (this.#listeners[event]) {
      this.#listeners[event].forEach(callback => {
        callback(data);
      });
    }
  }

  off(event, callback) {
    if (this.#listeners[event]) {
      this.#listeners[event] = this.#listeners[event].filter(
        cb => cb !== callback
      );
    }
  }
}

// Использование
const bus = EventBus.getInstance();

bus.on('user:login', (user) => {
  console.log(`${user.name} вошел`);
});

bus.on('user:login', (user) => {
  Logger.getInstance().log(`Login: ${user.name}`);
});

// Где-то в коде
bus.emit('user:login', { name: 'John' });
// Выведет обе callback!
```

---

## Lazy Initialization (Ленивая инициализация)

Инстанс создается только при первом обращении:

```javascript
class HeavyResource {
  static #instance = null;

  static getInstance() {
    if (HeavyResource.#instance === null) {
      console.log('Создаю тяжелый ресурс...');
      HeavyResource.#instance = new HeavyResource();
    }
    return HeavyResource.#instance;
  }

  constructor() {
    // Долгая инициализация
    this.data = Array(1000000).fill('data');
    console.log('Ресурс инициализирован');
  }
}

// Ресурс создается только сейчас!
const resource = HeavyResource.getInstance();
```

---

## Singleton в React

### Context API (современный способ)

```javascript
// createDatabaseContext.js
import { createContext, useContext } from 'react';

const DatabaseContext = createContext(null);

class Database {
  static #instance = null;

  static getInstance() {
    if (!Database.#instance) {
      Database.#instance = new Database();
    }
    return Database.#instance;
  }

  async fetchUser(id) {
    // запрос к БД
    return { id, name: 'John' };
  }
}

export function DatabaseProvider({ children }) {
  const db = Database.getInstance();
  return (
    <DatabaseContext.Provider value={db}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  const db = useContext(DatabaseContext);
  if (!db) {
    throw new Error('Must be used within DatabaseProvider');
  }
  return db;
}

// Использование в компоненте
function UserProfile() {
  const db = useDatabase();
  const [user, setUser] = useState(null);

  useEffect(() => {
    db.fetchUser(1).then(setUser);
  }, [db]);

  return <div>{user?.name}</div>;
}
```

---

## ✅ Когда использовать Singleton

### ✅ Хорошие случаи:

- **Логирование** — один логгер для всего приложения
- **Конфигурация** — единая конфигурация везде
- **База данных** — одно подключение
- **Кэш** — один кэш для приложения
- **Очередь событий** — один event bus
- **Пул соединений** — управление ресурсами
- **Правах доступа** — управление правами глобально

### ❌ Плохие случаи:

- **Юнит тестирование** — сложно мокировать
- **Параллелизм** — может быть race condition
- **Глобальное состояние** — сложно отследить
- **Простые объекты** — может быть избыточно

---

## Проблемы и решения

### Проблема: Сложность тестирования

```javascript
// ❌ Плохо: сложно мокировать Singleton
test('APIClient использует правильный URL', () => {
  const client = new APIClient(); // использует Singleton Config
  // Как мокировать Config?
});

// ✅ Хорошо: передать зависимость
class APIClient {
  constructor(config) {
    this.config = config;
  }
}

test('APIClient использует правильный URL', () => {
  const mockConfig = { apiUrl: 'http://test' };
  const client = new APIClient(mockConfig);
  // Легко мокировать!
});
```

### Проблема: Race condition в многопоточности

```javascript
// ❌ Не безопасно в многопоточности (редко в JS)
// ✅ Для JS обычно безопасно (single-threaded)

// Если нужна потокобезопасность (в других языках):
class ThreadSafeSingleton {
  static #instance = null;
  static #lock = new Mutex();

  static async getInstance() {
    await ThreadSafeSingleton.#lock.lock();
    try {
      if (!ThreadSafeSingleton.#instance) {
        ThreadSafeSingleton.#instance = new ThreadSafeSingleton();
      }
    } finally {
      ThreadSafeSingleton.#lock.unlock();
    }
    return ThreadSafeSingleton.#instance;
  }
}
```

---

## Best Practices

### ✅ Рекомендации

```javascript
// ХОРОШО: Использовать getInstance()
class Database {
  static #instance = null;

  static getInstance() {
    if (!Database.#instance) {
      Database.#instance = new Database();
    }
    return Database.#instance;
  }
}

const db = Database.getInstance();

// ХОРОШО: Кэшировать результат если нужно
const db = Database.getInstance();
db.query('SELECT * FROM users');
db.query('SELECT * FROM products');
// одно подключение для обоих запросов

// ХОРОШО: Скрывать приватные детали
class Singleton {
  static #instance = null;
  #privateData = 'secret';

  static getInstance() { /* ... */ }
}
```

### ❌ Что избегать

```javascript
// ПЛОХО: Создавать через new каждый раз
const db1 = new Database();
const db2 = new Database(); // новый экземпляр!

// ПЛОХО: Забывать про getInstance()
class BadSingleton {
  static instance = new BadSingleton(); // инициализируется всегда
}

// ПЛОХО: Нарушать Singleton в тестах
// Без возможности сбросить состояние
```

---

## Альтернативы Singleton

### 1. Module Pattern (модули в JS)

```javascript
const database = (() => {
  let instance = null;

  return {
    connect() {
      if (!instance) {
        instance = { connection: 'connected' };
      }
      return instance;
    }
  };
})();

database.connect();
database.connect(); // один и тот же объект
```

### 2. Dependency Injection (внедрение зависимостей)

```javascript
// Вместо глобального Singleton
class App {
  constructor(database, logger) {
    this.db = database;
    this.logger = logger;
  }
}

const db = new Database();
const app = new App(db, logger);
// Тестировать легче!
```

---

## Резюме

| Аспект | Описание |
|--------|---------|
| **Цель** | Один экземпляр класса на все приложение |
| **Проблема** | Множественное создание дорогих объектов |
| **Решение** | Контролировать создание через static метод |
| **Плюсы** | Глобальная точка доступа, экономия памяти |
| **Минусы** | Сложно тестировать, глобальное состояние |
| **Когда** | БД, логирование, конфиг, event bus |

---

## Следующие шаги

1. Изучите **[Factory Method](/design_patterns/factory-method)** — создание семейств объектов
2. Исследуйте **[Observer](/design_patterns/observer)** — работа с событиями
3. Применяйте в своих проектах!
