---
title: Обработка ошибок в JavaScript
description: Полное руководство по обработке ошибок — try/catch/finally, типы ошибок, пользовательские ошибки, паттерны и лучшие практики
---

# Обработка ошибок в JavaScript

## 1. try / catch / finally

### Базовый синтаксис

```javascript
try {
  // Код, который может вызвать ошибку
  const data = JSON.parse('невалидный json');
} catch (error) {
  // Обработка ошибки
  console.error('Ошибка парсинга:', error.message);
} finally {
  // Выполняется ВСЕГДА — и при ошибке, и без
  console.log('Завершено');
}
```

### Свойства объекта Error

```javascript
try {
  undefinedFunction();
} catch (error) {
  error.name;       // 'ReferenceError'
  error.message;    // 'undefinedFunction is not defined'
  error.stack;      // Стек вызовов (нестандартно, но есть во всех браузерах)
}
```

### Особенности finally

```javascript
// finally выполняется даже при return
function getData() {
  try {
    return 'данные';
  } finally {
    console.log('Cleanup'); // Выполнится!
  }
}

// finally перебивает return из try/catch
function example() {
  try {
    return 1;
  } finally {
    return 2; // Вернётся 2!
  }
}
```

### Вложенные try/catch

```javascript
try {
  try {
    throw new Error('Внутренняя ошибка');
  } catch (inner) {
    console.log('Поймана внутренняя:', inner.message);
    throw inner; // Пробрасываем дальше
  }
} catch (outer) {
  console.log('Поймана внешняя:', outer.message);
}
```

### catch без переменной (ES2019)

```javascript
try {
  JSON.parse('{invalid}');
} catch {
  // Без переменной error — если она не нужна
  console.log('Парсинг не удался');
}
```

## 2. Типы ошибок

### Встроенные типы

```javascript
// Error — базовый тип
new Error('Общая ошибка');

// SyntaxError — синтаксическая ошибка
JSON.parse('{invalid}');
// SyntaxError: Unexpected token i in JSON

// ReferenceError — обращение к несуществующей переменной
console.log(undeclaredVar);
// ReferenceError: undeclaredVar is not defined

// TypeError — операция над неподходящим типом
null.property;
// TypeError: Cannot read properties of null

const num = 42;
num();
// TypeError: num is not a function

// RangeError — значение вне допустимого диапазона
new Array(-1);
// RangeError: Invalid array length

(1.5).toFixed(200);
// RangeError: toFixed() digits argument must be between 0 and 100

// URIError — неверное использование URI-функций
decodeURIComponent('%');
// URIError: URI malformed

// EvalError — ошибка eval() (практически не встречается)
```

### Определение типа ошибки

```javascript
try {
  someRiskyOperation();
} catch (error) {
  if (error instanceof TypeError) {
    console.log('Ошибка типа:', error.message);
  } else if (error instanceof ReferenceError) {
    console.log('Ошибка ссылки:', error.message);
  } else if (error instanceof SyntaxError) {
    console.log('Синтаксическая ошибка:', error.message);
  } else {
    console.log('Неизвестная ошибка:', error);
  }
}
```

### throw — выбрасывание ошибок

```javascript
// Можно выбросить любое значение
throw new Error('Что-то пошло не так');
throw new TypeError('Ожидалась строка');
throw 'текстовая ошибка';        // Не рекомендуется
throw 42;                         // Не рекомендуется
throw { code: 404, msg: 'Not found' };

// Рекомендация: всегда бросайте объект Error
// Это обеспечивает наличие stack trace
```

## 3. Пользовательские ошибки (Custom Errors)

### Создание своих классов ошибок

```javascript
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

class NotFoundError extends Error {
  constructor(resource, id) {
    super(`${resource} с ID ${id} не найден`);
    this.name = 'NotFoundError';
    this.resource = resource;
    this.id = id;
    this.statusCode = 404;
  }
}

class AuthenticationError extends Error {
  constructor(message = 'Требуется авторизация') {
    super(message);
    this.name = 'AuthenticationError';
    this.statusCode = 401;
  }
}
```

### Использование пользовательских ошибок

```javascript
function validateUser(user) {
  if (!user.email) {
    throw new ValidationError('Email обязателен', 'email');
  }
  if (!user.email.includes('@')) {
    throw new ValidationError('Некорректный email', 'email');
  }
  if (user.age < 18) {
    throw new ValidationError('Возраст должен быть 18+', 'age');
  }
}

try {
  validateUser({ email: 'invalid', age: 15 });
} catch (error) {
  if (error instanceof ValidationError) {
    console.log(`Поле "${error.field}": ${error.message}`);
  }
}
```

### Иерархия ошибок

```javascript
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
  }
}

class ClientError extends AppError {
  constructor(message, statusCode = 400) {
    super(message, statusCode);
  }
}

class ServerError extends AppError {
  constructor(message, statusCode = 500) {
    super(message, statusCode);
  }
}

// Ловим по уровню иерархии
try {
  throw new ClientError('Неверный запрос');
} catch (error) {
  if (error instanceof ClientError) {
    // Ошибка клиента — показать пользователю
  } else if (error instanceof AppError) {
    // Ошибка приложения — логировать
  }
}
```

## 4. Паттерны обработки ошибок

### Централизованный обработчик

```javascript
class ErrorHandler {
  static handle(error) {
    // Логирование
    console.error(`[${error.name}] ${error.message}`);

    // Отправка в сервис мониторинга
    if (error instanceof ServerError) {
      ErrorHandler.reportToService(error);
    }

    // Уведомление пользователя
    if (error instanceof ClientError) {
      ErrorHandler.notifyUser(error.message);
    }
  }

  static reportToService(error) {
    // Sentry, LogRocket, etc.
    console.log('Отправка в мониторинг:', error);
  }

  static notifyUser(message) {
    // Toast, alert, UI-компонент
    console.log('Уведомление:', message);
  }
}

// Использование
try {
  await riskyOperation();
} catch (error) {
  ErrorHandler.handle(error);
}
```

### Result Pattern (без исключений)

```javascript
// Вместо throw — возвращаем результат
function parseJSON(text) {
  try {
    return { ok: true, data: JSON.parse(text) };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

const result = parseJSON('{"key": "value"}');
if (result.ok) {
  console.log(result.data);
} else {
  console.log('Ошибка:', result.error);
}
```

### Обёртка для async-функций

```javascript
// Утилита для обработки ошибок в async
async function tryCatch(promise) {
  try {
    const data = await promise;
    return [null, data];
  } catch (error) {
    return [error, null];
  }
}

// Использование
const [error, users] = await tryCatch(fetch('/api/users').then(r => r.json()));

if (error) {
  console.error('Не удалось загрузить:', error);
} else {
  console.log('Пользователи:', users);
}
```

### Обработка в Promise-цепочках

```javascript
fetchData()
  .then(processData)
  .then(saveResult)
  .catch(error => {
    // Ловит ошибку из ЛЮБОГО then выше
    console.error('Ошибка в цепочке:', error);
  })
  .finally(() => {
    // Cleanup
    hideLoader();
  });

// Обработка ошибок на каждом этапе
fetchData()
  .then(data => processData(data))
  .catch(error => {
    console.log('Ошибка обработки, используем дефолт');
    return defaultData; // Восстановление цепочки
  })
  .then(data => saveResult(data));
```

## 5. Лучшие практики (Best Practices)

### Не игнорируйте ошибки

```javascript
// ПЛОХО — пустой catch
try {
  riskyOperation();
} catch (e) {}

// ХОРОШО — хотя бы логируем
try {
  riskyOperation();
} catch (error) {
  console.error('Операция не удалась:', error);
}
```

### Ловите только то, что можете обработать

```javascript
// ПЛОХО — ловим всё
try {
  const user = getUser(id);
  const orders = getOrders(user.id);
} catch (error) {
  console.log('Что-то сломалось'); // Что именно?
}

// ХОРОШО — гранулярная обработка
let user;
try {
  user = getUser(id);
} catch (error) {
  throw new NotFoundError('User', id);
}

try {
  const orders = getOrders(user.id);
} catch (error) {
  console.log('Заказы недоступны, показываем без них');
  return { user, orders: [] };
}
```

### Используйте Error вместо строк

```javascript
// ПЛОХО
throw 'Что-то пошло не так';

// ХОРОШО — есть stack trace и name
throw new Error('Что-то пошло не так');

// ЕЩЁ ЛУЧШЕ — специфичный тип ошибки
throw new ValidationError('Email обязателен', 'email');
```

### Не используйте try/catch для управления потоком

```javascript
// ПЛОХО — исключение как условие
try {
  const value = map.get(key);
  if (value === undefined) throw new Error();
} catch {
  return defaultValue;
}

// ХОРОШО — проверка
if (map.has(key)) {
  return map.get(key);
}
return defaultValue;
```

## 6. Техники отладки (Debugging)

### Глобальные обработчики

```javascript
// Необработанные ошибки в синхронном коде
window.addEventListener('error', (event) => {
  console.error('Глобальная ошибка:', event.error);
  // Отправить в мониторинг
});

// Необработанные отклонения промисов
window.addEventListener('unhandledrejection', (event) => {
  console.error('Необработанный промис:', event.reason);
  event.preventDefault(); // Предотвратить вывод в консоль
});
```

### Полезные методы console

```javascript
// Группировка логов
console.group('Обработка запроса');
console.log('URL:', url);
console.log('Метод:', method);
console.groupEnd();

// Таблица
console.table([
  { name: 'Error1', count: 5 },
  { name: 'Error2', count: 12 },
]);

// Трассировка стека
console.trace('Откуда вызвано');

// Замер времени
console.time('операция');
await heavyOperation();
console.timeEnd('операция'); // операция: 234ms

// Условный лог
console.assert(value > 0, 'Значение должно быть положительным');
```

### Debugger и breakpoints

```javascript
function processData(data) {
  // Принудительная остановка (если DevTools открыт)
  debugger;

  return data.map(item => transform(item));
}
```

### Логирование ошибок в production

```javascript
class Logger {
  static error(error, context = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      name: error.name,
      message: error.message,
      stack: error.stack,
      ...context,
    };

    // В development — в консоль
    if (process.env.NODE_ENV === 'development') {
      console.error(logEntry);
    }

    // В production — на сервер
    navigator.sendBeacon('/api/logs', JSON.stringify(logEntry));
  }
}

// Использование
try {
  await processPayment(order);
} catch (error) {
  Logger.error(error, { orderId: order.id, userId: user.id });
}
```

## 7. Error Boundaries (React)

### Классовый компонент Error Boundary

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Обновляем состояние для показа fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Логируем ошибку
    console.error('Error Boundary caught:', error);
    console.error('Component stack:', errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div>
            <h2>Что-то пошло не так</h2>
            <button onClick={() => this.setState({ hasError: false })}>
              Попробовать снова
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
```

### Использование Error Boundary

```jsx
// Оборачиваем проблемные части UI
function App() {
  return (
    <div>
      <Header />
      <ErrorBoundary fallback={<p>Ошибка загрузки контента</p>}>
        <MainContent />
      </ErrorBoundary>
      <ErrorBoundary fallback={<p>Ошибка боковой панели</p>}>
        <Sidebar />
      </ErrorBoundary>
      <Footer />
    </div>
  );
}
```

### Ограничения Error Boundary

```javascript
// Error Boundary НЕ ловит ошибки в:
// 1. Обработчиках событий (используйте try/catch)
// 2. Асинхронном коде (setTimeout, fetch)
// 3. Серверном рендеринге (SSR)
// 4. Ошибках самого Error Boundary

// Для обработчиков событий:
function Button() {
  const handleClick = () => {
    try {
      riskyOperation();
    } catch (error) {
      // Обработка вручную
      setState({ error });
    }
  };

  return <button onClick={handleClick}>Нажми</button>;
}
```

## Справочник

| Конструкция | Описание |
|------------|----------|
| `try { } catch { }` | Перехват ошибок |
| `finally { }` | Код, выполняющийся всегда |
| `throw new Error()` | Выброс ошибки |
| `error.name` | Тип ошибки |
| `error.message` | Сообщение |
| `error.stack` | Стек вызовов |
| `instanceof` | Проверка типа ошибки |
| `class X extends Error` | Пользовательская ошибка |
| `window.onerror` | Глобальный обработчик |
| `unhandledrejection` | Необработанные промисы |
