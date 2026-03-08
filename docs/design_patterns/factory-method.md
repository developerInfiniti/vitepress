---
description: "Паттерн Factory Method: создание объектов через метод-фабрику — порождающий паттерн с примерами JS"
---

# Factory Method паттерн

**Factory Method** (Фабричный метод) — это порождающий паттерн, который определяет интерфейс для создания объектов, но предоставляет подклассам решение о том, какой класс инстанцировать.

---

## Проблема

```javascript
// ❌ Без паттерна — много условий для создания разных типов
class UIComponent {
  create(type) {
    if (type === 'button') {
      return new Button();
    } else if (type === 'input') {
      return new Input();
    } else if (type === 'select') {
      return new Select();
    }
    // Что если добавить новый тип? Изменять эту функцию!
  }
}
```

### Проблемы такого подхода:

1. **Слабая масштабируемость** — нужно изменять функцию при добавлении типов
2. **Смешивание ответственности** — функция знает о всех типах
3. **Сложность тестирования** — много условных ветвей
4. **Нарушение Open/Closed** — открыта для изменения, закрыта для расширения

---

## Решение

### Базовый пример

```javascript
// Интерфейс (абстрактный класс или просто соглашение)
class Shape {
  draw() {
    throw new Error('Must implement draw()');
  }
}

// Конкретные реализации
class Circle extends Shape {
  draw() {
    console.log('Drawing circle');
  }
}

class Rectangle extends Shape {
  draw() {
    console.log('Drawing rectangle');
  }
}

class Triangle extends Shape {
  draw() {
    console.log('Drawing triangle');
  }
}

// ✅ Factory Method
class ShapeFactory {
  static createShape(type) {
    switch (type) {
      case 'circle':
        return new Circle();
      case 'rectangle':
        return new Rectangle();
      case 'triangle':
        return new Triangle();
      default:
        throw new Error(`Unknown shape type: ${type}`);
    }
  }
}

// Использование
const circle = ShapeFactory.createShape('circle');
circle.draw(); // Drawing circle

const rect = ShapeFactory.createShape('rectangle');
rect.draw(); // Drawing rectangle
```

---

## Практические примеры

### Пример 1: Транспортная логистика

```javascript
// Интерфейс
class Transport {
  deliver(cargo) {
    throw new Error('Must implement deliver()');
  }
}

// Конкретные типы транспорта
class Truck extends Transport {
  deliver(cargo) {
    console.log(`Грузовик доставляет ${cargo} по суше`);
  }
}

class Ship extends Transport {
  deliver(cargo) {
    console.log(`Корабль доставляет ${cargo} по морю`);
  }
}

class Airplane extends Transport {
  deliver(cargo) {
    console.log(`Самолет доставляет ${cargo} по воздуху`);
  }
}

// Factory
class LogisticsCompany {
  static createTransport(type) {
    if (type === 'truck') {
      return new Truck();
    } else if (type === 'ship') {
      return new Ship();
    } else if (type === 'airplane') {
      return new Airplane();
    }
    throw new Error('Unknown transport type');
  }

  static planDelivery(cargo, transportType) {
    const transport = LogisticsCompany.createTransport(transportType);
    transport.deliver(cargo);
  }
}

// Использование
LogisticsCompany.planDelivery('Посылка', 'truck');
LogisticsCompany.planDelivery('Контейнер', 'ship');
LogisticsCompany.planDelivery('Письмо', 'airplane');
```

### Пример 2: Разные типы уведомлений

```javascript
// Интерфейс уведомления
class Notification {
  send(message, recipient) {
    throw new Error('Must implement send()');
  }
}

// Разные каналы
class EmailNotification extends Notification {
  send(message, recipient) {
    console.log(`Email отправлено на ${recipient}: "${message}"`);
  }
}

class SMSNotification extends Notification {
  send(message, recipient) {
    console.log(`SMS отправлено на ${recipient}: "${message}"`);
  }
}

class PushNotification extends Notification {
  send(message, recipient) {
    console.log(`Push отправлен ${recipient}: "${message}"`);
  }
}

// Factory
class NotificationFactory {
  static createNotification(channel) {
    switch (channel) {
      case 'email':
        return new EmailNotification();
      case 'sms':
        return new SMSNotification();
      case 'push':
        return new PushNotification();
      default:
        throw new Error('Unknown channel');
    }
  }
}

// Использование
function notifyUser(userId, message, channel) {
  const notification = NotificationFactory.createNotification(channel);
  notification.send(message, userId);
}

notifyUser('user@example.com', 'Привет!', 'email');
notifyUser('+79998887766', 'Привет!', 'sms');
notifyUser('user_id_123', 'Привет!', 'push');
```

### Пример 3: Стратегия обработки платежей

```javascript
// Интерфейс платежа
class PaymentProcessor {
  process(amount) {
    throw new Error('Must implement process()');
  }
}

// Способы оплаты
class CreditCardProcessor extends PaymentProcessor {
  process(amount) {
    console.log(`💳 Обработка платежа по карте: $${amount}`);
    return { success: true, method: 'card' };
  }
}

class PayPalProcessor extends PaymentProcessor {
  process(amount) {
    console.log(`🅿️ Обработка платежа PayPal: $${amount}`);
    return { success: true, method: 'paypal' };
  }
}

class CryptoProcessor extends PaymentProcessor {
  process(amount) {
    console.log(`₿ Обработка платежа крипто: $${amount}`);
    return { success: true, method: 'crypto' };
  }
}

// Factory
class PaymentFactory {
  static createProcessor(method) {
    const processors = {
      'card': () => new CreditCardProcessor(),
      'paypal': () => new PayPalProcessor(),
      'crypto': () => new CryptoProcessor()
    };

    const processorFactory = processors[method];
    if (!processorFactory) {
      throw new Error(`Unknown payment method: ${method}`);
    }

    return processorFactory();
  }
}

// Использование
function checkout(amount, paymentMethod) {
  const processor = PaymentFactory.createProcessor(paymentMethod);
  return processor.process(amount);
}

checkout(100, 'card');   // Обработка карта
checkout(100, 'paypal'); // Обработка PayPal
checkout(100, 'crypto'); // Обработка крипто
```

---

## Factory с объектом конфигурации

Более гибкий способ:

```javascript
class DatabaseConnection {
  constructor(config) {
    this.host = config.host;
    this.port = config.port;
    this.type = config.type;
  }

  connect() {
    console.log(`Connecting to ${this.type} at ${this.host}:${this.port}`);
  }
}

class DatabaseFactory {
  static createConnection(type) {
    const configs = {
      'mysql': {
        type: 'MySQL',
        host: 'localhost',
        port: 3306
      },
      'postgres': {
        type: 'PostgreSQL',
        host: 'localhost',
        port: 5432
      },
      'mongo': {
        type: 'MongoDB',
        host: 'localhost',
        port: 27017
      }
    };

    const config = configs[type];
    if (!config) {
      throw new Error(`Unknown database type: ${type}`);
    }

    return new DatabaseConnection(config);
  }
}

// Использование
const mysql = DatabaseFactory.createConnection('mysql');
mysql.connect(); // Connecting to MySQL at localhost:3306

const postgres = DatabaseFactory.createConnection('postgres');
postgres.connect(); // Connecting to PostgreSQL at localhost:5432
```

---

## Factory в React

```javascript
// Button.jsx
function Button({ variant, ...props }) {
  const getButtonComponent = (variant) => {
    const components = {
      'primary': PrimaryButton,
      'secondary': SecondaryButton,
      'danger': DangerButton,
      'outline': OutlineButton
    };

    const Component = components[variant] || PrimaryButton;
    return Component;
  };

  const ButtonComponent = getButtonComponent(variant);
  return <ButtonComponent {...props} />;
}

// Использование
<Button variant="primary">Save</Button>
<Button variant="danger">Delete</Button>
<Button variant="outline">Cancel</Button>
```

---

## Параметризированная Factory

```javascript
class ButtonFactory {
  static buttons = {
    'primary': {
      styles: { background: 'blue', color: 'white' },
      create: (text) => ({ type: 'button', style: this.buttons.primary.styles, text })
    },
    'secondary': {
      styles: { background: 'gray', color: 'black' },
      create: (text) => ({ type: 'button', style: this.buttons.secondary.styles, text })
    }
  };

  static register(name, config) {
    this.buttons[name] = config;
  }

  static create(variant, text) {
    const button = this.buttons[variant];
    if (!button) {
      throw new Error(`Unknown button variant: ${variant}`);
    }
    return button.create(text);
  }
}

// Добавление нового типа без изменения класса!
ButtonFactory.register('custom', {
  styles: { background: 'red', color: 'white' },
  create: (text) => ({ type: 'button', style: this.styles, text })
});

const btn = ButtonFactory.create('custom', 'Click me');
```

---

## ✅ Когда использовать Factory Method

### ✅ Хорошие случаи:

- **Разные типы объектов** — разные реализации одного интерфейса
- **Экономия памяти** — кэширование часто используемых объектов
- **Конфигурация** — выбор типа зависит от конфига
- **Расширение** — легко добавлять новые типы
- **Тестирование** — легко создавать mock'и
- **Сложное создание** — инициализация с параметрами

### ❌ Когда не нужен:

- **Простой тип** — одна реализация
- **Редкое создание** — не критично
- **Простое наследование** — достаточно обычного new

---

## Best Practices

```javascript
// ✅ ХОРОШО: Ясная фабрика
class DatabaseFactory {
  static create(type) {
    // логика создания
  }
}

// ✅ ХОРОШО: Параметризированная фабрика
ButtonFactory.register('custom', { /* ... */ });

// ✅ ХОРОШО: Фабрика с кэшем
class ProcessorFactory {
  static processors = {};

  static get(type) {
    if (!this.processors[type]) {
      this.processors[type] = this.create(type);
    }
    return this.processors[type];
  }
}

// ❌ ПЛОХО: Слишком много условий
static create(type) {
  if (type === 'a') { /* 20 строк */ }
  if (type === 'b') { /* 20 строк */ }
  if (type === 'c') { /* 20 строк */ }
  // ...
}
```

---

## Сравнение с другими паттернами

| Паттерн | Когда | Сложность |
|--------|-------|-----------|
| Factory Method | Много типов одного типа | ⭐⭐ |
| Abstract Factory | Семейства объектов | ⭐⭐⭐ |
| Builder | Сложное создание | ⭐⭐⭐ |
| Prototype | Дорогое копирование | ⭐⭐ |

---

## Резюме

| Аспект | Описание |
|--------|---------|
| **Цель** | Создание объектов без указания конкретных классов |
| **Проблема** | Жесткая привязка к конкретным типам |
| **Решение** | Метод в фабрике для создания |
| **Плюсы** | Гибкость, расширяемость, тестируемость |
| **Минусы** | Больше кода, может быть избыточно |
| **Когда** | Разные типы, конфигурация, расширение |

---

## Следующие шаги

1. Изучите **[Observer](/design_patterns/observer)** — работа с событиями
2. Исследуйте **Abstract Factory** — семейства объектов
3. Применяйте в своих проектах!
