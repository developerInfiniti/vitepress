---
description: "Паттерн Strategy: взаимозаменяемые алгоритмы, инкапсуляция логики — поведенческий паттерн с примерами"
---

# Strategy паттерн

**Strategy** (Стратегия) — это поведенческий паттерн, который определяет семейство алгоритмов, инкапсулирует каждый из них и делает их взаимозаменяемыми.

---

## Проблема

```javascript
// ❌ Без паттерна — много условной логики
class PaymentProcessor {
  process(amount, method) {
    if (method === 'creditCard') {
      // Много кода для обработки кредитной карты
      console.log('Processing credit card');
      validateCard();
      chargeCard();
      // ...
    } else if (method === 'paypal') {
      // Много кода для PayPal
      console.log('Processing PayPal');
      authorizePayPal();
      transfer();
      // ...
    } else if (method === 'crypto') {
      // Много кода для криптовалюты
      console.log('Processing crypto');
      validateWallet();
      sendTransaction();
      // ...
    }
    // Что если добавить новый способ? Изменять это?!
  }
}
```

### Проблемы:

1. **Монолит** — все алгоритмы в одном месте
2. **Сложность** — много условных веток
3. **Изменение кода** — нужно менять при добавлении нового способа
4. **Нарушение SRP** — класс отвечает за логику всех способов

---

## Решение

### Базовый пример

```javascript
// Интерфейс стратегии
class PaymentStrategy {
  pay(amount) {
    throw new Error('Must implement pay method');
  }
}

// Конкретные стратегии
class CreditCardStrategy extends PaymentStrategy {
  pay(amount) {
    console.log(`💳 Charging credit card: $${amount}`);
    return { success: true, method: 'card' };
  }
}

class PayPalStrategy extends PaymentStrategy {
  pay(amount) {
    console.log(`🅿️ Charging PayPal: $${amount}`);
    return { success: true, method: 'paypal' };
  }
}

class CryptoStrategy extends PaymentStrategy {
  pay(amount) {
    console.log(`₿ Charging crypto: $${amount}`);
    return { success: true, method: 'crypto' };
  }
}

// Context (контекст) использует стратегию
class PaymentProcessor {
  constructor(strategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  process(amount) {
    return this.strategy.pay(amount);
  }
}

// Использование
const creditCard = new CreditCardStrategy();
const processor = new PaymentProcessor(creditCard);

processor.process(100);

// Менять стратегию в runtime!
const paypal = new PayPalStrategy();
processor.setStrategy(paypal);
processor.process(50);

const crypto = new CryptoStrategy();
processor.setStrategy(crypto);
processor.process(200);
```

---

## Практические примеры

### Пример 1: Сортировка данных

```javascript
// Стратегии сортировки
class SortingStrategy {
  sort(array) {
    throw new Error('Must implement sort');
  }
}

class QuickSort extends SortingStrategy {
  sort(array) {
    console.log('Sorting with QuickSort');
    return array.sort((a, b) => a - b);
  }
}

class BubbleSort extends SortingStrategy {
  sort(array) {
    console.log('Sorting with BubbleSort');
    // Реализация пузырьковой сортировки
    return array;
  }
}

class MergeSort extends SortingStrategy {
  sort(array) {
    console.log('Sorting with MergeSort');
    // Реализация сортировки слиянием
    return array;
  }
}

// Context
class Sorter {
  constructor(strategy) {
    this.strategy = strategy;
  }

  sort(array) {
    return this.strategy.sort(array);
  }
}

// Использование
const data = [64, 34, 25, 12, 22, 11, 90];

const quickSortSorter = new Sorter(new QuickSort());
quickSortSorter.sort(data);

const mergeSortSorter = new Sorter(new MergeSort());
mergeSortSorter.sort(data);
```

### Пример 2: Сжатие данных

```javascript
// Стратегии сжатия
class CompressionStrategy {
  compress(data) {
    throw new Error('Must implement compress');
  }
}

class RARCompression extends CompressionStrategy {
  compress(data) {
    console.log('Compressing with RAR');
    return { compressed: data, format: 'rar' };
  }
}

class ZIPCompression extends CompressionStrategy {
  compress(data) {
    console.log('Compressing with ZIP');
    return { compressed: data, format: 'zip' };
  }
}

class GZIPCompression extends CompressionStrategy {
  compress(data) {
    console.log('Compressing with GZIP');
    return { compressed: data, format: 'gzip' };
  }
}

// Context
class Archiver {
  constructor(strategy) {
    this.strategy = strategy;
  }

  archive(data) {
    return this.strategy.compress(data);
  }
}

// Использование
const fileData = 'Important document content...';

const zipArchiver = new Archiver(new ZIPCompression());
zipArchiver.archive(fileData);

const rarArchiver = new Archiver(new RARCompression());
rarArchiver.archive(fileData);
```

### Пример 3: Интеграция с платежами

```javascript
// Стратегии для разных регионов
class PaymentGatewayStrategy {
  validate(amount) {
    throw new Error('Must implement validate');
  }

  execute(amount) {
    throw new Error('Must implement execute');
  }
}

class StripeStrategy extends PaymentGatewayStrategy {
  validate(amount) {
    if (amount < 0.50) {
      throw new Error('Stripe minimum: $0.50');
    }
    return true;
  }

  execute(amount) {
    console.log(`[Stripe] Charging $${amount}`);
    return { transactionId: 'stripe_' + Date.now() };
  }
}

class MercadoPagoStrategy extends PaymentGatewayStrategy {
  validate(amount) {
    if (amount < 1) {
      throw new Error('MercadoPago minimum: $1');
    }
    return true;
  }

  execute(amount) {
    console.log(`[MercadoPago] Charging $${amount}`);
    return { transactionId: 'mp_' + Date.now() };
  }
}

class PaymentSystem {
  constructor(region) {
    this.strategy = this.selectStrategy(region);
  }

  selectStrategy(region) {
    switch (region) {
      case 'US':
      case 'EU':
        return new StripeStrategy();
      case 'LATAM':
        return new MercadoPagoStrategy();
      default:
        return new StripeStrategy();
    }
  }

  processPayment(amount) {
    this.strategy.validate(amount);
    return this.strategy.execute(amount);
  }
}

// Использование
const usPayment = new PaymentSystem('US');
usPayment.processPayment(100);

const latamPayment = new PaymentSystem('LATAM');
latamPayment.processPayment(100);
```

---

## Strategy vs State

Strategy и State похожи, но предназначены для разного:

```javascript
// STRATEGY: Выбирает алгоритм (явно)
class DiscountStrategy {
  calculateDiscount(price) {}
}

const strategy = new VIPDiscount();
const finalPrice = strategy.calculateDiscount(100);

// STATE: Меняет поведение при изменении состояния (неявно)
class Order {
  constructor() {
    this.state = new PendingState();
  }

  nextStep() {
    this.state = this.state.next();
  }

  process() {
    this.state.handle(this);
  }
}
```

---

## Strategy в React

```javascript
// Стратегии для рендеринга
const renderStrategies = {
  'list': (items) => <ul>{items.map(i => <li>{i}</li>)}</ul>,
  'grid': (items) => <div className="grid">{items.map(i => <div>{i}</div>)}</div>,
  'table': (items) => <table><tbody>{items.map(i => <tr><td>{i}</td></tr>)}</tbody></table>
};

function DataDisplay({ items, viewMode = 'list' }) {
  const RenderStrategy = renderStrategies[viewMode];
  return <RenderStrategy items={items} />;
}

// Использование
<DataDisplay items={[1, 2, 3]} viewMode="list" />
<DataDisplay items={[1, 2, 3]} viewMode="grid" />
<DataDisplay items={[1, 2, 3]} viewMode="table" />
```

### Сложный пример: Форматирование текста

```javascript
// Стратегии форматирования
class TextFormatterStrategy {
  format(text) {}
}

class MarkdownFormatter extends TextFormatterStrategy {
  format(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
  }
}

class HTMLFormatter extends TextFormatterStrategy {
  format(text) {
    return text;
  }
}

class PlainTextFormatter extends TextFormatterStrategy {
  format(text) {
    return text.replace(/<[^>]*>/g, '');
  }
}

// Hook для стратегии
function useTextFormatter(format = 'markdown') {
  const [text, setText] = useState('');

  const formatters = {
    markdown: new MarkdownFormatter(),
    html: new HTMLFormatter(),
    plain: new PlainTextFormatter()
  };

  const formatter = formatters[format];
  const formattedText = formatter.format(text);

  return { text, setText, formattedText };
}

function TextEditor() {
  const { text, setText, formattedText } = useTextFormatter('markdown');

  return (
    <>
      <textarea value={text} onChange={e => setText(e.target.value)} />
      <div dangerouslySetInnerHTML={{ __html: formattedText }} />
    </>
  );
}
```

---

## Стратегия с конфигурацией

```javascript
class StrategyFactory {
  static strategies = {
    'quick': {
      name: 'Быстрая доставка',
      daysNeeded: 1,
      cost: 50,
      execute: () => console.log('Express delivery')
    },
    'standard': {
      name: 'Стандартная доставка',
      daysNeeded: 5,
      cost: 10,
      execute: () => console.log('Standard delivery')
    },
    'slow': {
      name: 'Медленная доставка',
      daysNeeded: 14,
      cost: 1,
      execute: () => console.log('Slow delivery')
    }
  };

  static register(name, strategy) {
    this.strategies[name] = strategy;
  }

  static get(name) {
    return this.strategies[name];
  }
}

class Order {
  constructor() {
    this.items = [];
    this.shippingStrategy = null;
  }

  setShippingStrategy(strategyName) {
    this.shippingStrategy = StrategyFactory.get(strategyName);
  }

  checkout() {
    if (!this.shippingStrategy) {
      throw new Error('Shipping strategy not selected');
    }

    this.shippingStrategy.execute();
    return {
      items: this.items,
      shipping: this.shippingStrategy.name,
      daysUntilDelivery: this.shippingStrategy.daysNeeded,
      cost: this.shippingStrategy.cost
    };
  }
}

// Использование
const order = new Order();
order.setShippingStrategy('standard');
order.checkout();
```

---

## ✅ Когда использовать Strategy

### ✅ Хорошие случаи:

- **Несколько алгоритмов** — сортировка, сжатие, форматирование
- **Выбор в runtime** — зависит от условий
- **Сложная логика** — нужно выделить в отдельные классы
- **Тестирование** — легко тестировать отдельные стратегии
- **Избежать условных веток** — вместо if/else

### ❌ Когда не нужна:

- **Один алгоритм** — простая функция достаточно
- **Алгоритмы очень похожи** — может быть перегибом
- **Невысокая сложность** — if/else понятнее

---

## Best Practices

```javascript
// ✅ ХОРОШО: Ясные стратегии
class PaymentStrategy {
  pay(amount) { /* ... */ }
}

// ✅ ХОРОШО: Factory для создания
const strategy = StrategyFactory.get('paypal');

// ✅ ХОРОШО: Валидация перед использованием
if (!this.strategy) {
  throw new Error('Strategy not set');
}

// ❌ ПЛОХО: Стратегия с побочными эффектами
pay(amount) {
  // Не только платит, но и логирует, отправляет письмо и т.д.
}

// ❌ ПЛОХО: Стратегии с общим состоянием
class Strategy {
  static shared = 0; // Проблема!
}
```

---

## Резюме

| Аспект | Описание |
|--------|---------|
| **Цель** | Выбор алгоритма в runtime |
| **Проблема** | Много условной логики для разных алгоритмов |
| **Решение** | Инкапсулировать алгоритмы в отдельные классы |
| **Плюсы** | Гибкость, тестируемость, чистый код |
| **Минусы** | Больше классов, может быть сложнее |
| **Когда** | Множество алгоритмов, выбор в runtime |

---

## Следующие шаги

1. Изучите **Decorator** — добавление функциональности
2. Исследуйте **State** — смена поведения
3. Применяйте в своих проектах!
