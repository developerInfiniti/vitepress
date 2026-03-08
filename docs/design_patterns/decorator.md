---
description: "Паттерн Decorator: динамическое добавление функциональности объектам — структурный паттерн с примерами"
---

# Decorator (Декоратор)

## Описание

Паттерн **Decorator** позволяет динамически добавлять новую функциональность к объектам, помещая их в специальные объекты-обёртки (декораторы).

## Проблема

Вам нужно добавить новую функциональность к существующему классу, но:
- Вы не можете изменять существующий класс (закрыт для модификации)
- Используется наследование, которое создаёт взрывное увеличение подклассов
- Нужна возможность комбинировать функциональность

## Решение

Вместо наследования используйте композицию - оборачивайте объект другим объектом, который добавляет новое поведение.

## Реализация

### Базовый пример

```javascript
// Базовый класс
class Coffee {
  cost() {
    return 5;
  }

  description() {
    return 'Простой кофе';
  }
}

// Декоратор - абстрактный класс
class CoffeeDecorator {
  constructor(coffee) {
    this.coffee = coffee;
  }

  cost() {
    return this.coffee.cost();
  }

  description() {
    return this.coffee.description();
  }
}

// Конкретные декораторы
class MilkDecorator extends CoffeeDecorator {
  cost() {
    return this.coffee.cost() + 1;
  }

  description() {
    return this.coffee.description() + ', молоко';
  }
}

class SugarDecorator extends CoffeeDecorator {
  cost() {
    return this.coffee.cost() + 0.5;
  }

  description() {
    return this.coffee.description() + ', сахар';
  }
}

class WhippedCreamDecorator extends CoffeeDecorator {
  cost() {
    return this.coffee.cost() + 2;
  }

  description() {
    return this.coffee.description() + ', взбитые сливки';
  }
}

// Использование
let coffee = new Coffee();
console.log(`${coffee.description()}: $${coffee.cost()}`);
// Простой кофе: $5

coffee = new MilkDecorator(coffee);
console.log(`${coffee.description()}: $${coffee.cost()}`);
// Простой кофе, молоко: $6

coffee = new SugarDecorator(coffee);
console.log(`${coffee.description()}: $${coffee.cost()}`);
// Простой кофе, молоко, сахар: $6.5

coffee = new WhippedCreamDecorator(coffee);
console.log(`${coffee.description()}: $${coffee.cost()}`);
// Простой кофе, молоко, сахар, взбитые сливки: $8.5
```

### Декоратор для функций

```javascript
// Исходная функция
function greet(name) {
  return `Hello, ${name}!`;
}

// Декоратор логирования
function loggingDecorator(fn) {
  return function(...args) {
    console.log(`Calling ${fn.name} with arguments: ${args}`);
    const result = fn(...args);
    console.log(`Result: ${result}`);
    return result;
  };
}

// Декоратор для замера времени
function timingDecorator(fn) {
  return function(...args) {
    const start = Date.now();
    const result = fn(...args);
    const end = Date.now();
    console.log(`Execution time: ${end - start}ms`);
    return result;
  };
}

// Применение декораторов
let decoratedGreet = loggingDecorator(greet);
decoratedGreet = timingDecorator(decoratedGreet);

decoratedGreet('John');
// Calling greet with arguments: John
// Hello, John!
// Execution time: 0ms
// Result: Hello, John!
```

### Декоратор с проверкой прав доступа

```javascript
class DataService {
  getData() {
    return { data: 'confidential information' };
  }
}

class PermissionDecorator {
  constructor(service, requiredRole) {
    this.service = service;
    this.requiredRole = requiredRole;
  }

  getData(user) {
    if (this.hasPermission(user)) {
      return this.service.getData();
    } else {
      throw new Error('Access denied');
    }
  }

  hasPermission(user) {
    return user.role === this.requiredRole;
  }
}

class CacheDecorator {
  constructor(service) {
    this.service = service;
    this.cache = null;
  }

  getData(user) {
    if (this.cache) {
      console.log('Returning cached data');
      return this.cache;
    }

    console.log('Fetching fresh data');
    this.cache = this.service.getData(user);
    return this.cache;
  }
}

// Использование
const dataService = new DataService();
const protectedService = new PermissionDecorator(dataService, 'admin');
const cachedService = new CacheDecorator(protectedService);

const adminUser = { role: 'admin' };
const regularUser = { role: 'user' };

cachedService.getData(adminUser);
// Fetching fresh data

cachedService.getData(adminUser);
// Returning cached data

cachedService.getData(regularUser);
// Error: Access denied
```

## Примеры в реальной жизни

### 1. Redux middleware

```javascript
// Redux декораторы (middleware) для функций диспетчера
const store = createStore(rootReducer);

// Middleware логирования
const logger = store => next => action => {
  console.log('Dispatching:', action);
  const result = next(action);
  console.log('New state:', store.getState());
  return result;
};

// Middleware для работы с асинхронностью
const thunk = store => next => action => {
  if (typeof action === 'function') {
    return action(store.dispatch, store.getState);
  }
  return next(action);
};

// Применение
const enhancedStore = applyMiddleware(logger, thunk)(createStore)(rootReducer);
```

### 2. Декораторы для класса

```javascript
// Декоратор для логирования вызовов метода
function logMethod(target, propertyName, descriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = function(...args) {
    console.log(`Calling ${propertyName} with:`, args);
    return originalMethod.apply(this, args);
  };

  return descriptor;
}

class Calculator {
  @logMethod
  add(a, b) {
    return a + b;
  }
}

const calc = new Calculator();
calc.add(5, 3);
// Calling add with: [5, 3]
// 8
```

### 3. Декоратор для компонентов React

```javascript
// Высший компонент порядка (HOC) - тип декоратора
function withLogging(Component) {
  return (props) => {
    useEffect(() => {
      console.log(`Component ${Component.name} mounted`);
      return () => console.log(`Component ${Component.name} unmounted`);
    }, []);

    return <Component {...props} />;
  };
}

function withTheme(Component) {
  return (props) => {
    const [theme, setTheme] = useState('light');

    return <Component {...props} theme={theme} setTheme={setTheme} />;
  };
}

// Применение
const MyComponent = ({ theme, setTheme }) => (
  <div className={theme}>
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Toggle theme
    </button>
  </div>
);

export default withLogging(withTheme(MyComponent));
```

## Преимущества

- ✅ Добавляет функциональность динамически во время выполнения
- ✅ Избегает взрывного увеличения подклассов
- ✅ Позволяет комбинировать функциональность гибко
- ✅ Соответствует принципу Single Responsibility

## Недостатки

- ❌ Может привести к большому количеству маленьких объектов
- ❌ Порядок применения декораторов важен
- ❌ Сложнее в отладке (много слоёв)

## Когда использовать

- Нужно добавить функциональность к объекту без изменения его класса
- Невозможно использовать наследство (класс помечен как final)
- Нужна гибкая комбинация функциональности
- Функциональность может быть применена в разных комбинациях

## Сравнение с другими паттернами

| Паттерн | Цель | Различие |
|---------|------|----------|
| **Decorator** | Добавляет функциональность динамически | Использует композицию |
| **Inheritance** | Добавляет функциональность через подклассы | Статическое расширение |
| **Strategy** | Меняет алгоритм | Выбирает алгоритм из вариантов |
| **Adapter** | Делает интерфейсы совместимыми | Преобразует интерфейсы |
