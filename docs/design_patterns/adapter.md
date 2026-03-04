# Adapter (Адаптер)

## Описание

Паттерн **Adapter** преобразует интерфейс класса в другой интерфейс, ожидаемый клиентами. Адаптер позволяет классам с несовместимыми интерфейсами работать вместе.

## Проблема

Вы хотите использовать существующий класс, но его интерфейс не соответствует тому, что вам нужно. Или у вас есть несколько классов с похожей функциональностью, но разными интерфейсами.

## Решение

Создайте адаптер, который преобразует интерфейс одного класса в интерфейс другого.

## Реализация

### Adapter (Class Pattern)

```javascript
// Существующий класс с несовместимым интерфейсом
class OldPaymentSystem {
  processPayment(amount, cardNumber) {
    console.log(`Processing ${amount} from card ${cardNumber}`);
    return true;
  }
}

// Целевой интерфейс, который нужен нам
class NewPaymentGateway {
  pay(userId, amount) {
    // Этот интерфейс несовместим с OldPaymentSystem
  }
}

// Адаптер
class PaymentAdapter extends NewPaymentGateway {
  constructor(oldSystem, userCardMap) {
    super();
    this.oldSystem = oldSystem;
    this.userCardMap = userCardMap;
  }

  pay(userId, amount) {
    const cardNumber = this.userCardMap[userId];
    if (!cardNumber) {
      throw new Error(`No card found for user ${userId}`);
    }
    return this.oldSystem.processPayment(amount, cardNumber);
  }
}

// Использование
const oldPayment = new OldPaymentSystem();
const cardMap = {
  user1: '4532-1234-5678-9010',
  user2: '5425-2222-3333-4444'
};

const adapter = new PaymentAdapter(oldPayment, cardMap);
adapter.pay('user1', 100); // Processing 100 from card 4532-1234-5678-9010
```

### Adapter (Object Pattern)

```javascript
// Внешняя библиотека API
class XMLDataProvider {
  fetchData() {
    return '<user><name>John</name><age>30</age></user>';
  }
}

// Наше приложение ожидает JSON
class ApplicationClient {
  constructor(dataProvider) {
    this.dataProvider = dataProvider;
  }

  processData() {
    const data = this.dataProvider.getData();
    console.log(`Processing data:`, data);
  }
}

// Адаптер для преобразования XML в JSON
class XMLtoJSONAdapter {
  constructor(xmlProvider) {
    this.xmlProvider = xmlProvider;
  }

  getData() {
    const xml = this.xmlProvider.fetchData();
    // Простое преобразование XML в JSON
    const json = {
      user: {
        name: 'John',
        age: 30
      }
    };
    return json;
  }
}

// Использование
const xmlProvider = new XMLDataProvider();
const adapter = new XMLtoJSONAdapter(xmlProvider);
const app = new ApplicationClient(adapter);
app.processData();
// Processing data: { user: { name: 'John', age: 30 } }
```

## Примеры в реальной жизни

### 1. jQuery Adapter для DOM API

```javascript
// jQuery адаптирует разные браузерные API под единый интерфейс
const jQueryElement = jQuery('#myElement');

// jQuery предоставляет единый интерфейс независимо от браузера
jQueryElement.addClass('active');
jQueryElement.on('click', function() {
  console.log('Clicked!');
});
```

### 2. Работа с разными HTTP клиентами

```javascript
// Разные библиотеки имеют разные интерфейсы
class FetchAdapter {
  constructor(url) {
    this.url = url;
  }

  request() {
    return fetch(this.url).then(r => r.json());
  }
}

class AxiosAdapter {
  constructor(url) {
    this.url = url;
  }

  request() {
    return axios.get(this.url).then(r => r.data);
  }
}

// Сервис использует единый интерфейс
class ApiService {
  constructor(adapter) {
    this.adapter = adapter;
  }

  async getData() {
    return this.adapter.request();
  }
}
```

### 3. Адаптер для database драйверов

```javascript
class MySQLDriver {
  query(sql) {
    // MySQL специфичная реализация
    console.log(`MySQL: ${sql}`);
  }
}

class PostgreSQLDriver {
  execute(sql) {
    // PostgreSQL специфичная реализация
    console.log(`PostgreSQL: ${sql}`);
  }
}

// Единый интерфейс
class DatabaseAdapter {
  constructor(driver) {
    this.driver = driver;
  }

  query(sql) {
    if (this.driver instanceof MySQLDriver) {
      return this.driver.query(sql);
    } else if (this.driver instanceof PostgreSQLDriver) {
      return this.driver.execute(sql);
    }
  }
}

// Использование
const mysql = new MySQLDriver();
const adapter = new DatabaseAdapter(mysql);
adapter.query('SELECT * FROM users');
```

## Преимущества

- ✅ Разделение кода, который преобразует интерфейсы, от основной логики
- ✅ Позволяет использовать несовместимые интерфейсы вместе
- ✅ Открыт для расширения (Open/Closed Principle)
- ✅ Улучшает переиспользуемость кода

## Недостатки

- ❌ Код может стать сложнее из-за введения новых классов
- ❌ Может снизить производительность, если адаптация требует много операций

## Когда использовать

- Нужно использовать класс с несовместимым интерфейсом
- Хотите создать повторно используемый класс, который совместим с несвязанными классами
- Нужно использовать несколько подклассов, но было бы непрактично адаптировать интерфейс каждого
- Работаете с интеграцией сторонних библиотек

## Сравнение с другими паттернами

| Паттерн | Цель | Различие |
|---------|------|----------|
| **Adapter** | Делает несовместимые интерфейсы совместимыми | Работает с существующими классами |
| **Bridge** | Отделяет абстракцию от реализации | Проектируется с целью разделения |
| **Facade** | Предоставляет упрощённый интерфейс | Предоставляет новый интерфейс, не меняя существующий |
| **Decorator** | Добавляет функциональность | Добавляет поведение, а не преобразует интерфейс |
