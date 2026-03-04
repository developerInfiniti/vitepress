# Observer паттерн

**Observer** (Наблюдатель) — это поведенческий паттерн, который создает механизм подписки для оповещения заинтересованных объектов об изменении состояния.

---

## Проблема

```javascript
// ❌ Без паттерна — везде нужно проверять состояние
class UserService {
  user = null;

  loginUser(credentials) {
    this.user = authenticate(credentials);
    // Кто-то из UI должен узнать об этом?
    // Кто-то должен записать в логи?
    // Кто-то должен отправить аналитику?
    // Как все это координировать?
  }
}
```

### Проблемы:

1. **Связанность** — один объект должен знать о других
2. **Сложность** — много условной логики
3. **Масштабируемость** — добавление нового слушателя требует изменения кода
4. **Нарушение SRP** — объект отвечает за логику И за уведомления

---

## Решение

### Базовый пример

```javascript
// Subject (издатель)
class EventEmitter {
  constructor() {
    this.listeners = {};
  }

  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event, callback) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(
      cb => cb !== callback
    );
  }

  emit(event, data) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(callback => {
      callback(data);
    });
  }
}

// Observer (подписчик) — просто callback
function onUserLogin(user) {
  console.log(`Пользователь ${user.name} вошел`);
}

// Использование
const emitter = new EventEmitter();
emitter.on('user:login', onUserLogin);
emitter.emit('user:login', { name: 'John', id: 1 });
// Output: Пользователь John вошел
```

---

## Практические примеры

### Пример 1: Система уведомлений

```javascript
class UserService extends EventEmitter {
  users = [];

  registerUser(userData) {
    const user = {
      id: Date.now(),
      name: userData.name,
      email: userData.email,
      createdAt: new Date()
    };

    this.users.push(user);

    // Оповещаем всех слушателей
    this.emit('user:registered', user);

    return user;
  }

  loginUser(email, password) {
    const user = this.users.find(u => u.email === email);

    if (!user || !this.verifyPassword(password)) {
      this.emit('user:login:failed', { email });
      return null;
    }

    this.emit('user:login', user);
    return user;
  }

  verifyPassword(password) {
    return password.length > 0; // упрощено
  }
}

// Observer 1: Логирование
class Logger {
  attach(userService) {
    userService.on('user:registered', (user) => {
      console.log(`[LOG] New user: ${user.name}`);
    });

    userService.on('user:login', (user) => {
      console.log(`[LOG] User logged in: ${user.email}`);
    });

    userService.on('user:login:failed', (data) => {
      console.log(`[LOG] Failed login attempt: ${data.email}`);
    });
  }
}

// Observer 2: Аналитика
class Analytics {
  attach(userService) {
    userService.on('user:registered', (user) => {
      this.track('user_registered', {
        userId: user.id,
        email: user.email
      });
    });

    userService.on('user:login', (user) => {
      this.track('user_login', { userId: user.id });
    });
  }

  track(event, data) {
    console.log(`[ANALYTICS] ${event}:`, data);
  }
}

// Observer 3: Отправка Email
class EmailService {
  attach(userService) {
    userService.on('user:registered', (user) => {
      this.sendWelcomeEmail(user.email);
    });

    userService.on('user:login:failed', (data) => {
      this.sendSecurityAlert(data.email);
    });
  }

  sendWelcomeEmail(email) {
    console.log(`[EMAIL] Welcome email sent to ${email}`);
  }

  sendSecurityAlert(email) {
    console.log(`[EMAIL] Security alert sent to ${email}`);
  }
}

// Использование
const userService = new UserService();
new Logger().attach(userService);
new Analytics().attach(userService);
new EmailService().attach(userService);

userService.registerUser({ name: 'John', email: 'john@example.com' });
// [LOG] New user: John
// [ANALYTICS] user_registered: { userId: ..., email: ... }
// [EMAIL] Welcome email sent to john@example.com

userService.loginUser('john@example.com', 'password');
// [LOG] User logged in: john@example.com
// [ANALYTICS] user_login: { userId: ... }
```

### Пример 2: Реактивность в UI

```javascript
class DataStore extends EventEmitter {
  constructor(initialData = {}) {
    super();
    this.data = initialData;
  }

  get(key) {
    return this.data[key];
  }

  set(key, value) {
    const oldValue = this.data[key];

    // Только если значение изменилось
    if (oldValue !== value) {
      this.data[key] = value;

      // Оповещаем об изменении
      this.emit('change', {
        key,
        oldValue,
        newValue: value
      });

      // Конкретные события для каждого ключа
      this.emit(`change:${key}`, value);
    }
  }
}

// Использование в компонентах
class UserProfile {
  constructor(store) {
    this.store = store;
    this.setupListeners();
  }

  setupListeners() {
    // Реагировать на изменение имени
    this.store.on('change:name', (newName) => {
      this.renderName(newName);
    });

    // Реагировать на изменение статуса
    this.store.on('change:status', (newStatus) => {
      this.renderStatus(newStatus);
    });

    // Реагировать на любое изменение
    this.store.on('change', ({ key, newValue }) => {
      console.log(`${key} changed to ${newValue}`);
    });
  }

  renderName(name) {
    console.log(`Updated name: ${name}`);
  }

  renderStatus(status) {
    console.log(`Updated status: ${status}`);
  }
}

// Использование
const store = new DataStore({ name: 'John', status: 'online' });
new UserProfile(store);

store.set('name', 'Jane'); // Updated name: Jane, name changed to Jane
store.set('status', 'offline'); // Updated status: offline, status changed to offline
```

### Пример 3: Система событий браузера (как EventTarget)

```javascript
class CustomButton extends EventEmitter {
  constructor(label) {
    super();
    this.label = label;
  }

  render() {
    const button = document.createElement('button');
    button.textContent = this.label;

    button.addEventListener('click', () => {
      this.emit('click');
      this.emit('click:complete');
    });

    return button;
  }
}

// Использование (как встроенные события)
const submitBtn = new CustomButton('Submit');

submitBtn.on('click', () => {
  console.log('Button clicked!');
  validateForm();
});

submitBtn.on('click', () => {
  console.log('Also running!');
});

submitBtn.on('click:complete', () => {
  console.log('All click handlers done');
});
```

---

## Observer в React

### useEvent Hook (или EventEmitter паттерн)

```javascript
// Create event bus for component
const eventBus = new EventEmitter();

function useEvent(event, callback) {
  useEffect(() => {
    eventBus.on(event, callback);
    return () => eventBus.off(event, callback);
  }, [event, callback]);
}

// Component 1: Издатель
function TemperatureDisplay() {
  const [temp, setTemp] = useState(20);

  const handleIncrease = () => {
    const newTemp = temp + 1;
    setTemp(newTemp);
    eventBus.emit('temperature:changed', newTemp);
  };

  return (
    <div>
      <p>Temperature: {temp}°C</p>
      <button onClick={handleIncrease}>Increase</button>
    </div>
  );
}

// Component 2: Подписчик
function TemperatureAlert() {
  const [isHot, setIsHot] = useState(false);

  useEvent('temperature:changed', (temp) => {
    setIsHot(temp > 25);
  });

  return isHot ? <p>⚠️ It's too hot!</p> : null;
}

// Component 3: Еще один подписчик
function TemperatureLog() {
  useEvent('temperature:changed', (temp) => {
    console.log(`Temperature: ${temp}°C`);
  });

  return null;
}
```

---

## Продвинутые техники

### Фильтрация слушателей

```javascript
class SmartEventEmitter extends EventEmitter {
  on(event, callback, condition = null) {
    const wrappedCallback = (data) => {
      if (!condition || condition(data)) {
        callback(data);
      }
    };
    super.on(event, wrappedCallback);
  }
}

// Использование
const emitter = new SmartEventEmitter();

emitter.on(
  'temperature:changed',
  (temp) => console.log('Too hot!'),
  (temp) => temp > 25 // Условие
);
```

### Once (слушатель один раз)

```javascript
class EventEmitterWithOnce extends EventEmitter {
  once(event, callback) {
    const wrapper = (data) => {
      callback(data);
      this.off(event, wrapper);
    };
    this.on(event, wrapper);
  }
}

// Использование
emitter.once('app:start', () => {
  console.log('App started!');
  // Это выполнится только один раз
});
```

### Приоритеты слушателей

```javascript
class PriorityEventEmitter extends EventEmitter {
  constructor() {
    super();
    this.priorities = {};
  }

  on(event, callback, priority = 0) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
      this.priorities[event] = [];
    }

    this.listeners[event].push(callback);
    this.priorities[event].push(priority);
  }

  emit(event, data) {
    if (!this.listeners[event]) return;

    // Сортировать по приоритету
    const sorted = this.listeners[event]
      .map((cb, idx) => ({ cb, priority: this.priorities[event][idx] }))
      .sort((a, b) => b.priority - a.priority);

    sorted.forEach(({ cb }) => cb(data));
  }
}
```

---

## ✅ Когда использовать Observer

### ✅ Хорошие случаи:

- **События UI** — клики, ввод, фокус
- **Системные события** — запуск, завершение, ошибка
- **Изменение данных** — обновление состояния
- **Асинхронные операции** — завершение запроса
- **Loose coupling** — слабая связанность компонентов
- **Многопоточность** — синхронизация потоков (в других языках)

### ❌ Когда не нужен:

- **Простая иерархия** — прямой вызов методов
- **Один слушатель** — может быть перегибом
- **Синхронные вызовы** — если нужен результат сразу

---

## Best Practices

```javascript
// ✅ ХОРОШО: Явные события
emitter.on('user:login', handleLogin);
emitter.on('user:logout', handleLogout);

// ✅ ХОРОШО: Группировка слушателей
class UserWatcher {
  constructor(userService) {
    userService.on('user:login', this.onLogin.bind(this));
    userService.on('user:logout', this.onLogout.bind(this));
  }
}

// ✅ ХОРОШО: Очистка слушателей
useEffect(() => {
  const handler = () => { /* ... */ };
  emitter.on('event', handler);
  return () => emitter.off('event', handler);
}, []);

// ❌ ПЛОХО: Утечка памяти
emitter.on('event', () => { /* ... */ });
// Никогда не удаляется!

// ❌ ПЛОХО: Слишком общие события
emitter.on('update', handleUpdate);
// Какой update? От кого?
```

---

## Резюме

| Аспект | Описание |
|--------|---------|
| **Цель** | Оповещение об изменениях множеству объектов |
| **Проблема** | Прямые зависимости между объектами |
| **Решение** | Подписка на события через callback'и |
| **Плюсы** | Слабая связанность, расширяемость, реактивность |
| **Минусы** | Сложнее отследить, может быть медленнее |
| **Когда** | События, реактивность, слабая связанность |

---

## Следующие шаги

1. Изучите **[Strategy](/design_patterns/strategy)** — выбор алгоритма
2. Исследуйте **Mediator** — централизованное управление
3. Применяйте в своих проектах!
