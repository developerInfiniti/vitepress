---
description: "Паттерн State: изменение поведения объекта в зависимости от состояния — поведенческий паттерн с JS"
---

# State паттерн

**State** (Состояние) — это поведенческий паттерн, который позволяет объекту менять своё поведение в зависимости от внутреннего состояния. Объект выглядит так, будто он меняет свой класс.

---

## Проблема

```javascript
// ❌ Без паттерна — огромные switch/if-else
class Order {
  status = 'new';

  process() {
    if (this.status === 'new') {
      this.status = 'processing';
      console.log('Начинаем обработку');
    } else if (this.status === 'processing') {
      this.status = 'shipped';
      console.log('Отправляем');
    } else if (this.status === 'shipped') {
      this.status = 'delivered';
      console.log('Доставлено');
    } else if (this.status === 'delivered') {
      console.log('Уже доставлено!');
    }
  }

  cancel() {
    if (this.status === 'new' || this.status === 'processing') {
      this.status = 'cancelled';
      console.log('Заказ отменён');
    } else {
      console.log('Невозможно отменить');
    }
  }
}
```

### Проблемы:

1. **Сложность** — каждый метод содержит условную логику для всех состояний
2. **Хрупкость** — добавление нового состояния требует изменения всех методов
3. **Дублирование** — проверки статуса разбросаны по коду
4. **Нарушение OCP** — нельзя добавить состояние без модификации класса

---

## Решение

### Визуализация паттерна

```
┌─────────────┐       ┌──────────────────┐
│   Context    │──────▶│   State (интерф.) │
│ (Order)      │       │  + process()      │
│              │       │  + cancel()       │
│ state ───────┤       └──────────────────┘
└─────────────┘               ▲
                    ┌─────────┼─────────┐
                    │         │         │
              ┌─────┴──┐ ┌───┴────┐ ┌──┴───────┐
              │  New    │ │ Process│ │ Shipped  │
              │ State   │ │ State  │ │ State    │
              └────────┘ └────────┘ └──────────┘
```

### Базовый пример

```javascript
// Интерфейс состояния
class OrderState {
  constructor(order) {
    this.order = order;
  }

  process() {
    throw new Error('Метод process() не реализован');
  }

  cancel() {
    throw new Error('Метод cancel() не реализован');
  }

  getStatus() {
    throw new Error('Метод getStatus() не реализован');
  }
}

// Конкретные состояния
class NewOrderState extends OrderState {
  process() {
    console.log('Начинаем обработку заказа');
    this.order.setState(new ProcessingOrderState(this.order));
  }

  cancel() {
    console.log('Заказ отменён');
    this.order.setState(new CancelledOrderState(this.order));
  }

  getStatus() {
    return 'new';
  }
}

class ProcessingOrderState extends OrderState {
  process() {
    console.log('Заказ отправлен');
    this.order.setState(new ShippedOrderState(this.order));
  }

  cancel() {
    console.log('Заказ отменён на этапе обработки');
    this.order.setState(new CancelledOrderState(this.order));
  }

  getStatus() {
    return 'processing';
  }
}

class ShippedOrderState extends OrderState {
  process() {
    console.log('Заказ доставлен');
    this.order.setState(new DeliveredOrderState(this.order));
  }

  cancel() {
    console.log('Невозможно отменить — заказ уже отправлен');
  }

  getStatus() {
    return 'shipped';
  }
}

class DeliveredOrderState extends OrderState {
  process() {
    console.log('Заказ уже доставлен');
  }

  cancel() {
    console.log('Невозможно отменить — заказ доставлен');
  }

  getStatus() {
    return 'delivered';
  }
}

class CancelledOrderState extends OrderState {
  process() {
    console.log('Невозможно обработать — заказ отменён');
  }

  cancel() {
    console.log('Заказ уже отменён');
  }

  getStatus() {
    return 'cancelled';
  }
}

// Контекст
class Order {
  constructor() {
    this.state = new NewOrderState(this);
  }

  setState(state) {
    this.state = state;
  }

  process() {
    this.state.process();
  }

  cancel() {
    this.state.cancel();
  }

  getStatus() {
    return this.state.getStatus();
  }
}

// Использование
const order = new Order();
console.log(order.getStatus()); // 'new'

order.process(); // Начинаем обработку заказа
console.log(order.getStatus()); // 'processing'

order.process(); // Заказ отправлен
console.log(order.getStatus()); // 'shipped'

order.cancel(); // Невозможно отменить — заказ уже отправлен
order.process(); // Заказ доставлен
```

---

## Практические примеры

### Пример 1: Медиаплеер

```javascript
class PlayerState {
  constructor(player) {
    this.player = player;
  }

  play() {}
  pause() {}
  stop() {}
}

class StoppedState extends PlayerState {
  play() {
    console.log('Начинаем воспроизведение');
    this.player.setState(new PlayingState(this.player));
  }

  pause() {
    console.log('Плеер остановлен, нечего ставить на паузу');
  }

  stop() {
    console.log('Плеер уже остановлен');
  }
}

class PlayingState extends PlayerState {
  play() {
    console.log('Уже воспроизводится');
  }

  pause() {
    console.log('Ставим на паузу');
    this.player.setState(new PausedState(this.player));
  }

  stop() {
    console.log('Останавливаем воспроизведение');
    this.player.setState(new StoppedState(this.player));
  }
}

class PausedState extends PlayerState {
  play() {
    console.log('Возобновляем воспроизведение');
    this.player.setState(new PlayingState(this.player));
  }

  pause() {
    console.log('Уже на паузе');
  }

  stop() {
    console.log('Останавливаем воспроизведение');
    this.player.setState(new StoppedState(this.player));
  }
}

class MediaPlayer {
  constructor() {
    this.state = new StoppedState(this);
  }

  setState(state) {
    this.state = state;
  }

  play() { this.state.play(); }
  pause() { this.state.pause(); }
  stop() { this.state.stop(); }
}

const player = new MediaPlayer();
player.play();  // Начинаем воспроизведение
player.pause(); // Ставим на паузу
player.play();  // Возобновляем воспроизведение
player.stop();  // Останавливаем воспроизведение
```

### Пример 2: Светофор

```javascript
class TrafficLightState {
  constructor(light) {
    this.light = light;
  }

  next() {}
  getColor() {}
  getDuration() {}
}

class RedState extends TrafficLightState {
  next() {
    console.log('Красный -> Зелёный');
    this.light.setState(new GreenState(this.light));
  }

  getColor() { return 'red'; }
  getDuration() { return 5000; }
}

class GreenState extends TrafficLightState {
  next() {
    console.log('Зелёный -> Жёлтый');
    this.light.setState(new YellowState(this.light));
  }

  getColor() { return 'green'; }
  getDuration() { return 4000; }
}

class YellowState extends TrafficLightState {
  next() {
    console.log('Жёлтый -> Красный');
    this.light.setState(new RedState(this.light));
  }

  getColor() { return 'yellow'; }
  getDuration() { return 1500; }
}

class TrafficLight {
  constructor() {
    this.state = new RedState(this);
  }

  setState(state) {
    this.state = state;
  }

  next() { this.state.next(); }
  getColor() { return this.state.getColor(); }

  start() {
    const cycle = () => {
      console.log(`Текущий цвет: ${this.getColor()}`);
      setTimeout(() => {
        this.next();
        cycle();
      }, this.state.getDuration());
    };
    cycle();
  }
}

const light = new TrafficLight();
light.next(); // Красный -> Зелёный
light.next(); // Зелёный -> Жёлтый
light.next(); // Жёлтый -> Красный
```

### Пример 3: Аутентификация пользователя

```javascript
class AuthState {
  constructor(auth) {
    this.auth = auth;
  }

  login(credentials) {}
  logout() {}
  fetchData(url) {}
}

class GuestState extends AuthState {
  login(credentials) {
    console.log('Попытка входа...');
    if (credentials.email && credentials.password) {
      const user = { email: credentials.email, name: 'User' };
      this.auth.user = user;
      this.auth.setState(new AuthenticatedState(this.auth));
      console.log(`Вход выполнен: ${user.email}`);
      return true;
    }
    console.log('Неверные данные');
    return false;
  }

  logout() {
    console.log('Вы не авторизованы');
  }

  fetchData(url) {
    console.log('Доступ запрещён. Войдите в систему.');
    return null;
  }
}

class AuthenticatedState extends AuthState {
  login(credentials) {
    console.log('Вы уже авторизованы');
  }

  logout() {
    console.log(`Выход: ${this.auth.user.email}`);
    this.auth.user = null;
    this.auth.setState(new GuestState(this.auth));
  }

  fetchData(url) {
    console.log(`Загружаем данные: ${url}`);
    return { data: 'some data' };
  }
}

class AuthService {
  constructor() {
    this.user = null;
    this.state = new GuestState(this);
  }

  setState(state) {
    this.state = state;
  }

  login(credentials) { return this.state.login(credentials); }
  logout() { this.state.logout(); }
  fetchData(url) { return this.state.fetchData(url); }
}

const auth = new AuthService();
auth.fetchData('/api/data');  // Доступ запрещён
auth.login({ email: 'user@test.com', password: '123' }); // Вход выполнен
auth.fetchData('/api/data');  // Загружаем данные
auth.logout();                // Выход
```

---

## Примеры из реальной жизни

| Библиотека / Инструмент | Где используется |
|--------------------------|------------------|
| **TCP-соединение** | Состояния: LISTEN, SYN_SENT, ESTABLISHED, CLOSED |
| **React компоненты** | Состояния загрузки: idle, loading, success, error |
| **Игровые объекты** | Состояния персонажа: idle, running, jumping, attacking |
| **Promise** | Состояния: pending, fulfilled, rejected |
| **Текстовые редакторы** | Режимы: вставка, выделение, командный |

---

## Когда использовать State

### Хорошие случаи:

- **Конечные автоматы** — объект имеет набор чётко определённых состояний
- **Условная логика** — поведение зависит от текущего состояния
- **Переходы** — есть правила перехода между состояниями
- **Множество методов** — несколько методов зависят от состояния

### Когда не нужен:

- **Мало состояний** — 2-3 состояния можно обработать if/else
- **Простая логика** — паттерн добавляет много классов
- **Нет переходов** — состояние не меняется во время жизни объекта

---

## Сравнение с другими паттернами

| Аспект | State | Strategy |
|--------|-------|----------|
| **Цель** | Менять поведение при смене состояния | Выбирать алгоритм |
| **Переходы** | Состояния знают друг о друге | Стратегии независимы |
| **Кто меняет** | Состояние само решает переход | Клиент выбирает стратегию |
| **Количество** | Все состояния для одного объекта | Одна стратегия в момент времени |

---

## Резюме

| Аспект | Описание |
|--------|---------|
| **Цель** | Менять поведение объекта в зависимости от состояния |
| **Проблема** | Разбухшие условные конструкции (if/switch) |
| **Решение** | Вынести логику каждого состояния в отдельный класс |
| **Плюсы** | Чистый код, расширяемость, инкапсуляция переходов |
| **Минусы** | Много классов для простых случаев |
| **Когда** | Конечные автоматы, сложная условная логика |
