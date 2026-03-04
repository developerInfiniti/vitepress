# Mediator паттерн

**Mediator** (Посредник) — это поведенческий паттерн, который определяет объект, инкапсулирующий взаимодействие между множеством объектов. Посредник устраняет прямые зависимости между компонентами, заставляя их общаться через себя.

---

## Проблема

```javascript
// ❌ Без паттерна — все компоненты знают друг о друге
class TextInput {
  constructor(submitButton, errorLabel, counter) {
    this.submitButton = submitButton;
    this.errorLabel = errorLabel;
    this.counter = counter;
  }

  onChange(value) {
    // Прямые вызовы других компонентов
    if (value.length > 0) {
      this.submitButton.enable();
      this.errorLabel.hide();
    } else {
      this.submitButton.disable();
      this.errorLabel.show('Поле не может быть пустым');
    }
    this.counter.update(value.length);
  }
}
// Каждый компонент зависит от нескольких других!
```

### Проблемы:

1. **Связанность** — компоненты напрямую зависят друг от друга
2. **Сложность** — N компонентов = N*(N-1) возможных связей
3. **Переиспользование** — нельзя использовать компонент отдельно
4. **Хрупкость** — изменение одного компонента затрагивает остальные

---

## Решение

### Визуализация паттерна

```
Без Mediator:            С Mediator:

  A ←──→ B               A     B
  ↕ ╲  ╱ ↕                ↘   ↙
  D ←──→ C               Mediator
  ↕      ↕                ↗   ↘
  E ←──→ F               E     F

  Все связаны            Общение через
  со всеми               посредника
```

### Базовый пример

```javascript
// Посредник
class FormMediator {
  constructor() {
    this.components = {};
  }

  register(name, component) {
    this.components[name] = component;
    component.setMediator(this);
  }

  notify(sender, event, data) {
    switch (event) {
      case 'input:change':
        this.handleInputChange(sender, data);
        break;
      case 'checkbox:change':
        this.handleCheckboxChange(sender, data);
        break;
      case 'submit:click':
        this.handleSubmit();
        break;
    }
  }

  handleInputChange(sender, value) {
    const { submitButton, errorLabel, counter } = this.components;

    if (value.length > 0) {
      submitButton.enable();
      errorLabel.hide();
    } else {
      submitButton.disable();
      errorLabel.show('Поле не может быть пустым');
    }
    counter.update(value.length);
  }

  handleCheckboxChange(sender, checked) {
    const { submitButton } = this.components;
    if (checked) {
      submitButton.enable();
    } else {
      submitButton.disable();
    }
  }

  handleSubmit() {
    const { textInput, errorLabel } = this.components;
    const value = textInput.getValue();

    if (value.trim() === '') {
      errorLabel.show('Заполните поле!');
    } else {
      console.log('Форма отправлена:', value);
      errorLabel.hide();
    }
  }
}

// Базовый компонент
class Component {
  constructor(name) {
    this.name = name;
    this.mediator = null;
  }

  setMediator(mediator) {
    this.mediator = mediator;
  }
}

class TextInput extends Component {
  constructor() {
    super('textInput');
    this.value = '';
  }

  change(value) {
    this.value = value;
    this.mediator.notify(this, 'input:change', value);
  }

  getValue() {
    return this.value;
  }
}

class SubmitButton extends Component {
  constructor() {
    super('submitButton');
    this.enabled = false;
  }

  enable() {
    this.enabled = true;
    console.log('[Button] Активна');
  }

  disable() {
    this.enabled = false;
    console.log('[Button] Неактивна');
  }

  click() {
    if (this.enabled) {
      this.mediator.notify(this, 'submit:click');
    }
  }
}

class ErrorLabel extends Component {
  constructor() {
    super('errorLabel');
  }

  show(message) {
    console.log(`[Error] ${message}`);
  }

  hide() {
    console.log('[Error] Скрыта');
  }
}

class CharCounter extends Component {
  constructor() {
    super('counter');
  }

  update(count) {
    console.log(`[Counter] Символов: ${count}`);
  }
}

// Использование
const mediator = new FormMediator();
const input = new TextInput();
const button = new SubmitButton();
const error = new ErrorLabel();
const counter = new CharCounter();

mediator.register('textInput', input);
mediator.register('submitButton', button);
mediator.register('errorLabel', error);
mediator.register('counter', counter);

input.change('Hello');
// [Button] Активна
// [Error] Скрыта
// [Counter] Символов: 5

button.click();
// Форма отправлена: Hello

input.change('');
// [Button] Неактивна
// [Error] Поле не может быть пустым
// [Counter] Символов: 0
```

---

## Практические примеры

### Пример 1: Чат-комната

```javascript
class ChatRoom {
  constructor(name) {
    this.name = name;
    this.users = new Map();
  }

  join(user) {
    this.users.set(user.name, user);
    user.setChatRoom(this);
    this.broadcast(`${user.name} присоединился к чату`, user);
  }

  leave(user) {
    this.users.delete(user.name);
    this.broadcast(`${user.name} покинул чат`, user);
  }

  sendMessage(message, sender, recipientName = null) {
    if (recipientName) {
      // Личное сообщение
      const recipient = this.users.get(recipientName);
      if (recipient) {
        recipient.receive(message, sender.name, true);
      }
    } else {
      // Публичное сообщение
      this.broadcast(message, sender);
    }
  }

  broadcast(message, sender) {
    for (const [name, user] of this.users) {
      if (name !== sender.name) {
        user.receive(message, sender.name, false);
      }
    }
  }
}

class User {
  constructor(name) {
    this.name = name;
    this.chatRoom = null;
  }

  setChatRoom(chatRoom) {
    this.chatRoom = chatRoom;
  }

  send(message, to = null) {
    console.log(`${this.name} отправляет: ${message}`);
    this.chatRoom.sendMessage(message, this, to);
  }

  receive(message, from, isPrivate) {
    const type = isPrivate ? '[ЛС]' : '[Общий]';
    console.log(`  ${this.name} получил ${type} от ${from}: ${message}`);
  }
}

// Использование
const room = new ChatRoom('general');
const alice = new User('Alice');
const bob = new User('Bob');
const charlie = new User('Charlie');

room.join(alice);
room.join(bob);
room.join(charlie);

alice.send('Всем привет!');
// Alice отправляет: Всем привет!
//   Bob получил [Общий] от Alice: Всем привет!
//   Charlie получил [Общий] от Alice: Всем привет!

bob.send('Привет, Alice!', 'Alice');
// Bob отправляет: Привет, Alice!
//   Alice получил [ЛС] от Bob: Привет, Alice!
```

### Пример 2: Система управления авиаперелётами

```javascript
class AirTrafficControl {
  constructor() {
    this.aircraft = new Map();
    this.runway = null; // null = свободна
  }

  register(plane) {
    this.aircraft.set(plane.id, plane);
    plane.setMediator(this);
    console.log(`[ATC] ${plane.id} зарегистрирован`);
  }

  requestLanding(plane) {
    if (this.runway === null) {
      this.runway = plane.id;
      plane.confirmLanding();
      this.broadcastExcept(
        `${plane.id} совершает посадку. Полоса занята.`,
        plane.id
      );
    } else {
      plane.holdPosition();
      console.log(`[ATC] ${plane.id}: ожидайте, полоса занята (${this.runway})`);
    }
  }

  requestTakeoff(plane) {
    if (this.runway === null || this.runway === plane.id) {
      this.runway = plane.id;
      plane.confirmTakeoff();
      setTimeout(() => {
        this.runway = null;
        this.broadcastExcept(
          `Полоса свободна после взлёта ${plane.id}`,
          plane.id
        );
      }, 100);
    } else {
      console.log(`[ATC] ${plane.id}: ожидайте взлёта`);
    }
  }

  notifyLanded(plane) {
    this.runway = null;
    this.broadcastExcept(`${plane.id} приземлился. Полоса свободна.`, plane.id);
  }

  broadcastExcept(message, excludeId) {
    for (const [id, plane] of this.aircraft) {
      if (id !== excludeId) {
        plane.receiveMessage(message);
      }
    }
  }
}

class Aircraft {
  constructor(id) {
    this.id = id;
    this.mediator = null;
  }

  setMediator(mediator) {
    this.mediator = mediator;
  }

  requestLanding() {
    console.log(`${this.id}: запрос на посадку`);
    this.mediator.requestLanding(this);
  }

  requestTakeoff() {
    console.log(`${this.id}: запрос на взлёт`);
    this.mediator.requestTakeoff(this);
  }

  confirmLanding() {
    console.log(`${this.id}: разрешение на посадку получено`);
  }

  confirmTakeoff() {
    console.log(`${this.id}: разрешение на взлёт получено`);
  }

  holdPosition() {
    console.log(`${this.id}: ожидаю`);
  }

  receiveMessage(message) {
    console.log(`  ${this.id} [radio]: ${message}`);
  }
}

// Использование
const atc = new AirTrafficControl();
const plane1 = new Aircraft('SU-100');
const plane2 = new Aircraft('AA-200');
const plane3 = new Aircraft('LH-300');

atc.register(plane1);
atc.register(plane2);
atc.register(plane3);

plane1.requestLanding();
// SU-100: запрос на посадку
// SU-100: разрешение на посадку получено
//   AA-200 [radio]: SU-100 совершает посадку. Полоса занята.
//   LH-300 [radio]: SU-100 совершает посадку. Полоса занята.

plane2.requestLanding();
// AA-200: запрос на посадку
// AA-200: ожидаю
// [ATC] AA-200: ожидайте, полоса занята (SU-100)
```

### Пример 3: Event Bus (шина событий)

```javascript
class EventBus {
  constructor() {
    this.channels = {};
  }

  subscribe(channel, handler) {
    if (!this.channels[channel]) {
      this.channels[channel] = [];
    }
    this.channels[channel].push(handler);

    // Возвращаем функцию отписки
    return () => {
      this.channels[channel] = this.channels[channel]
        .filter(h => h !== handler);
    };
  }

  publish(channel, data) {
    if (!this.channels[channel]) return;
    this.channels[channel].forEach(handler => handler(data));
  }
}

// Модули-компоненты, не знающие друг о друге
class AuthModule {
  constructor(bus) {
    this.bus = bus;
    this.user = null;
  }

  login(email, password) {
    // Имитация авторизации
    this.user = { email, name: email.split('@')[0] };
    this.bus.publish('auth:login', this.user);
  }

  logout() {
    const user = this.user;
    this.user = null;
    this.bus.publish('auth:logout', user);
  }
}

class NotificationModule {
  constructor(bus) {
    bus.subscribe('auth:login', (user) => {
      console.log(`[Notification] Добро пожаловать, ${user.name}!`);
    });

    bus.subscribe('auth:logout', (user) => {
      console.log(`[Notification] До свидания, ${user.name}!`);
    });

    bus.subscribe('cart:update', (cart) => {
      console.log(`[Notification] В корзине ${cart.count} товаров`);
    });
  }
}

class AnalyticsModule {
  constructor(bus) {
    bus.subscribe('auth:login', (user) => {
      console.log(`[Analytics] User login: ${user.email}`);
    });

    bus.subscribe('cart:update', (cart) => {
      console.log(`[Analytics] Cart updated: ${cart.count} items`);
    });
  }
}

class CartModule {
  constructor(bus) {
    this.bus = bus;
    this.items = [];

    bus.subscribe('auth:logout', () => {
      this.items = [];
      console.log('[Cart] Корзина очищена');
    });
  }

  addItem(item) {
    this.items.push(item);
    this.bus.publish('cart:update', { count: this.items.length, items: this.items });
  }
}

// Использование
const bus = new EventBus();
const auth = new AuthModule(bus);
const notifications = new NotificationModule(bus);
const analytics = new AnalyticsModule(bus);
const cart = new CartModule(bus);

auth.login('alice@mail.com', '123');
// [Notification] Добро пожаловать, alice!
// [Analytics] User login: alice@mail.com

cart.addItem({ name: 'Книга', price: 500 });
// [Notification] В корзине 1 товаров
// [Analytics] Cart updated: 1 items

auth.logout();
// [Notification] До свидания, alice!
// [Cart] Корзина очищена
```

---

## Примеры из реальной жизни

| Библиотека / Инструмент | Где используется |
|--------------------------|------------------|
| **Vue.js / React** | Управление состоянием (Vuex, Redux) — store как медиатор |
| **Express.js** | Middleware chain — app как посредник между запросом и обработчиками |
| **Socket.io** | Сервер как медиатор между клиентами |
| **MVC фреймворки** | Controller как медиатор между Model и View |
| **Node.js EventEmitter** | Центральная шина событий между модулями |

---

## Когда использовать Mediator

### Хорошие случаи:

- **Много связей** — компоненты сильно связаны друг с другом
- **Переиспользование** — компоненты должны работать в разных контекстах
- **Централизация** — логика взаимодействия в одном месте
- **Упрощение** — замена "многие-ко-многим" на "один-ко-многим"

### Когда не нужен:

- **Мало компонентов** — 2-3 компонента могут общаться напрямую
- **God Object** — медиатор может стать слишком большим
- **Простые зависимости** — если связей мало, медиатор избыточен

---

## Сравнение с другими паттернами

| Аспект | Mediator | Observer |
|--------|----------|----------|
| **Направление** | Двустороннее через посредника | Одностороннее (publisher -> subscriber) |
| **Знание** | Медиатор знает обо всех | Publisher не знает subscribers |
| **Логика** | Централизована в медиаторе | Распределена по подписчикам |
| **Когда** | Сложные взаимодействия | Простые уведомления |

| Аспект | Mediator | Facade |
|--------|----------|--------|
| **Цель** | Координация между компонентами | Упрощение интерфейса подсистемы |
| **Направление** | Двустороннее | Одностороннее (клиент -> подсистема) |
| **Компоненты** | Знают о медиаторе | Не знают о фасаде |

---

## Резюме

| Аспект | Описание |
|--------|---------|
| **Цель** | Централизовать сложные взаимодействия между объектами |
| **Проблема** | Компоненты тесно связаны друг с другом |
| **Решение** | Объект-посредник координирует общение |
| **Плюсы** | Слабая связанность, переиспользование, централизация логики |
| **Минусы** | Медиатор может стать "God Object" |
| **Когда** | Много взаимозависимых компонентов |
