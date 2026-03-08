---
description: "Паттерн Bridge: разделение абстракции и реализации — структурный паттерн проектирования с примерами"
---

# Bridge (Мост)

## Описание

Паттерн **Bridge** разделяет абстракцию и её реализацию так, чтобы они могли изменяться независимо друг от друга. Вместо наследования используется композиция — абстракция содержит ссылку на объект реализации.

## Проблема

У вас есть класс, который должен работать на нескольких платформах или с несколькими вариантами реализации. При использовании наследования количество классов растёт экспоненциально:

```
Без Bridge (взрыв классов):

                    Shape
                  /       \
          Circle             Square
         /     \            /      \
  RedCircle  BlueCircle  RedSquare  BlueSquare

4 комбинации → 4 класса
Добавить Green? → ещё 2 класса
Добавить Triangle? → ещё 3 класса
```

## Решение

Разделить иерархию на две независимые части: **абстракцию** (что делает объект) и **реализацию** (как он это делает), связав их мостом (ссылкой).

```
С Bridge:

  Shape ────────────→ Color (interface)
  │                    │
  ├── Circle           ├── Red
  ├── Square           ├── Blue
  └── Triangle         └── Green

3 фигуры + 3 цвета = 6 классов (вместо 9)
Добавить новый цвет → +1 класс (не +3)
```

## Структура

```
┌──────────────────┐         ┌──────────────────┐
│   Abstraction    │────────→│  Implementation  │
│                  │         │   (interface)     │
│  + operation()   │         │  + execute()      │
└────────┬─────────┘         └────────┬─────────┘
         │                            │
┌────────┴─────────┐       ┌──────────┴──────────┐
│ RefinedAbstract. │       │ ConcreteImpl A      │
│                  │       │ ConcreteImpl B      │
│ + operation()    │       │                     │
│   → impl.exec() │       │ + execute()         │
└──────────────────┘       └─────────────────────┘
```

## Реализация

### Кросс-платформенные уведомления

```javascript
// === РЕАЛИЗАЦИЯ (Implementation) ===
// Определяет КАК отправляется уведомление

class EmailSender {
  send(title, message) {
    console.log(`[EMAIL] ${title}: ${message}`);
    // Отправка через SMTP
  }
}

class SMSSender {
  send(title, message) {
    console.log(`[SMS] ${title}: ${message}`);
    // Отправка через SMS-шлюз
  }
}

class PushSender {
  send(title, message) {
    console.log(`[PUSH] ${title}: ${message}`);
    // Отправка через APNs/FCM
  }
}

class TelegramSender {
  send(title, message) {
    console.log(`[TELEGRAM] ${title}: ${message}`);
    // Отправка через Telegram Bot API
  }
}

// === АБСТРАКЦИЯ (Abstraction) ===
// Определяет ЧТО отправляется

class Notification {
  constructor(sender) {
    this.sender = sender; // ← Мост к реализации
  }

  notify(title, message) {
    this.sender.send(title, message);
  }
}

class UrgentNotification extends Notification {
  notify(title, message) {
    this.sender.send(`🚨 URGENT: ${title}`, message);
    this.sender.send(`🚨 REMINDER: ${title}`, message); // Отправляем дважды
  }
}

class ScheduledNotification extends Notification {
  constructor(sender, delay) {
    super(sender);
    this.delay = delay;
  }

  notify(title, message) {
    setTimeout(() => {
      this.sender.send(title, message);
    }, this.delay);
  }
}

// === ИСПОЛЬЗОВАНИЕ ===
// Любая комбинация абстракции и реализации

const emailNotif = new Notification(new EmailSender());
emailNotif.notify('Заказ', 'Ваш заказ отправлен');
// [EMAIL] Заказ: Ваш заказ отправлен

const urgentSMS = new UrgentNotification(new SMSSender());
urgentSMS.notify('Безопасность', 'Подозрительный вход');
// [SMS] 🚨 URGENT: Безопасность: Подозрительный вход
// [SMS] 🚨 REMINDER: Безопасность: Подозрительный вход

const scheduledPush = new ScheduledNotification(new PushSender(), 5000);
scheduledPush.notify('Напоминание', 'Встреча через 15 минут');
// [PUSH] Напоминание: Встреча через 15 минут (через 5 сек)
```

### Драйверы баз данных

```javascript
// === РЕАЛИЗАЦИЯ: драйверы БД ===

class PostgresDriver {
  connect(config) {
    console.log(`Postgres: подключение к ${config.host}:${config.port}`);
    return { connected: true, type: 'postgres' };
  }

  execute(query, params) {
    console.log(`Postgres SQL: ${query}`, params);
    return []; // результат запроса
  }

  disconnect() {
    console.log('Postgres: отключение');
  }
}

class MySQLDriver {
  connect(config) {
    console.log(`MySQL: подключение к ${config.host}:${config.port}`);
    return { connected: true, type: 'mysql' };
  }

  execute(query, params) {
    console.log(`MySQL SQL: ${query}`, params);
    return [];
  }

  disconnect() {
    console.log('MySQL: отключение');
  }
}

class SQLiteDriver {
  connect(config) {
    console.log(`SQLite: открытие файла ${config.filename}`);
    return { connected: true, type: 'sqlite' };
  }

  execute(query, params) {
    console.log(`SQLite SQL: ${query}`, params);
    return [];
  }

  disconnect() {
    console.log('SQLite: закрытие файла');
  }
}

// === АБСТРАКЦИЯ: репозитории ===

class Repository {
  constructor(driver, config) {
    this.driver = driver; // ← Мост
    this.connection = this.driver.connect(config);
  }

  findAll(table) {
    return this.driver.execute(`SELECT * FROM ${table}`, []);
  }

  findById(table, id) {
    return this.driver.execute(`SELECT * FROM ${table} WHERE id = ?`, [id]);
  }

  close() {
    this.driver.disconnect();
  }
}

class CachedRepository extends Repository {
  constructor(driver, config) {
    super(driver, config);
    this.cache = new Map();
  }

  findById(table, id) {
    const key = `${table}:${id}`;
    if (this.cache.has(key)) {
      console.log(`Cache hit: ${key}`);
      return this.cache.get(key);
    }
    const result = super.findById(table, id);
    this.cache.set(key, result);
    return result;
  }
}

// === ИСПОЛЬЗОВАНИЕ ===
const pgRepo = new Repository(new PostgresDriver(), { host: 'localhost', port: 5432 });
pgRepo.findAll('users');
pgRepo.close();

const cachedMySQL = new CachedRepository(new MySQLDriver(), { host: 'db.server', port: 3306 });
cachedMySQL.findById('products', 42);
cachedMySQL.findById('products', 42); // Cache hit
cachedMySQL.close();
```

### Кросс-платформенный UI

```javascript
// === РЕАЛИЗАЦИЯ: платформы ===

class WebRenderer {
  renderButton(text, onClick) {
    return `<button onclick="${onClick}">${text}</button>`;
  }

  renderInput(placeholder) {
    return `<input placeholder="${placeholder}" />`;
  }

  renderList(items) {
    return `<ul>${items.map(i => `<li>${i}</li>`).join('')}</ul>`;
  }
}

class MobileRenderer {
  renderButton(text, onClick) {
    return { type: 'TouchableOpacity', props: { onPress: onClick }, children: text };
  }

  renderInput(placeholder) {
    return { type: 'TextInput', props: { placeholder } };
  }

  renderList(items) {
    return { type: 'FlatList', props: { data: items } };
  }
}

// === АБСТРАКЦИЯ: компоненты ===

class Form {
  constructor(renderer) {
    this.renderer = renderer; // ← Мост
  }

  render() {
    return [
      this.renderer.renderInput('Имя'),
      this.renderer.renderInput('Email'),
      this.renderer.renderButton('Отправить', 'submit()')
    ];
  }
}

// Один и тот же Form работает на Web и Mobile
const webForm = new Form(new WebRenderer());
console.log(webForm.render());
// ['<input placeholder="Имя" />', '<input placeholder="Email" />', '<button...>']

const mobileForm = new Form(new MobileRenderer());
console.log(mobileForm.render());
// [{ type: 'TextInput'... }, { type: 'TextInput'... }, { type: 'TouchableOpacity'... }]
```

## Примеры в реальной жизни

| Пример | Абстракция | Реализация |
|--------|-----------|------------|
| JDBC/ODBC | Database API | MySQL, PostgreSQL, Oracle драйверы |
| React Native | React компоненты | iOS / Android рендеринг |
| Логирование | Logger (info, warn, error) | Console, File, Cloud (CloudWatch) |
| Платёжные системы | PaymentProcessor | Stripe, PayPal, Apple Pay |
| Файловые системы | FileManager | LocalFS, S3, Google Cloud Storage |

## Bridge vs Adapter

```
Adapter:
  Работает с СУЩЕСТВУЮЩИМИ несовместимыми интерфейсами
  Применяется ПОСЛЕ создания системы (исправление)
  Оборачивает ОДИН объект

Bridge:
  Проектируется ЗАРАНЕЕ
  Разделяет абстракцию и реализацию ДО разработки
  Работает с ИЕРАРХИЯМИ классов
```

## Когда использовать

```
✓ Нужно избежать постоянной привязки абстракции к реализации
✓ И абстракция, и реализация должны расширяться через подклассы
✓ Изменения в реализации не должны затрагивать клиентский код
✓ Кросс-платформенная разработка
✓ Работа с несколькими API/драйверами

✗ Простая иерархия без необходимости независимого расширения
✗ Всего одна реализация (оверинжиниринг)
```

## Преимущества и недостатки

| Преимущества | Недостатки |
|-------------|-----------|
| Независимое развитие абстракции и реализации | Усложняет код при простых сценариях |
| Принцип Open/Closed — легко добавлять новые варианты | Требует предварительного проектирования |
| Скрывает детали реализации от клиента | Дополнительный уровень косвенности |
| Позволяет менять реализацию в runtime | |
