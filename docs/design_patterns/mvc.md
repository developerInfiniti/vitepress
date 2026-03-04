# MVC паттерн

**MVC** (Model-View-Controller) — это архитектурный паттерн, который разделяет приложение на три компонента: модель данных, представление и контроллер, управляющий взаимодействием между ними.

---

## Проблема

```javascript
// ❌ Без паттерна — всё в одном месте
document.getElementById('addBtn').addEventListener('click', () => {
  const input = document.getElementById('taskInput');
  const text = input.value;

  // Валидация (бизнес-логика)
  if (text.trim() === '') return;

  // Сохранение (работа с данными)
  tasks.push({ text, done: false });
  localStorage.setItem('tasks', JSON.stringify(tasks));

  // Отображение (UI)
  const li = document.createElement('li');
  li.textContent = text;
  document.getElementById('taskList').appendChild(li);

  // Очистка (UI)
  input.value = '';
  updateCounter();
});
```

### Проблемы такого подхода:

1. **Смешивание ответственности** — данные, логика и UI в одном месте
2. **Сложность тестирования** — нельзя тестировать логику отдельно от UI
3. **Дублирование** — одну и ту же логику приходится повторять
4. **Сложность поддержки** — изменение UI требует изменения бизнес-логики

---

## Структура MVC

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Model     │◄────│  Controller  │────►│    View     │
│  (данные)   │     │  (логика)    │     │  (UI)       │
└──────┬──────┘     └──────────────┘     └──────┬──────┘
       │                                        │
       │         уведомляет об                  │
       └────────изменениях────────►             │
                                   обновляет UI │
                                                │
       ◄────────действия пользователя───────────┘
```

- **Model** — хранит данные и бизнес-логику
- **View** — отображает данные пользователю
- **Controller** — обрабатывает действия пользователя, обновляет Model и View

---

## Решение

### Базовый пример: Todo-приложение

```javascript
// ========== MODEL ==========
class TodoModel {
  constructor() {
    this.todos = [];
    this.listeners = [];
  }

  subscribe(listener) {
    this.listeners.push(listener);
  }

  notify() {
    this.listeners.forEach(listener => listener(this.todos));
  }

  addTodo(text) {
    this.todos.push({
      id: Date.now(),
      text,
      done: false
    });
    this.notify();
  }

  toggleTodo(id) {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      todo.done = !todo.done;
      this.notify();
    }
  }

  removeTodo(id) {
    this.todos = this.todos.filter(t => t.id !== id);
    this.notify();
  }

  getAll() {
    return [...this.todos];
  }

  getActive() {
    return this.todos.filter(t => !t.done);
  }
}

// ========== VIEW ==========
class TodoView {
  constructor() {
    this.app = document.getElementById('app');
    this.input = null;
    this.list = null;
    this.counter = null;
    this.render();
  }

  render() {
    this.app.innerHTML = `
      <h1>Todo List</h1>
      <div class="input-group">
        <input id="todoInput" type="text" placeholder="Новая задача..." />
        <button id="addBtn">Добавить</button>
      </div>
      <ul id="todoList"></ul>
      <p id="counter"></p>
    `;

    this.input = document.getElementById('todoInput');
    this.list = document.getElementById('todoList');
    this.counter = document.getElementById('counter');
  }

  displayTodos(todos) {
    this.list.innerHTML = '';
    todos.forEach(todo => {
      const li = document.createElement('li');
      li.className = todo.done ? 'done' : '';
      li.innerHTML = `
        <span class="toggle" data-id="${todo.id}">${todo.text}</span>
        <button class="delete" data-id="${todo.id}">x</button>
      `;
      this.list.appendChild(li);
    });
  }

  updateCounter(activeCount) {
    this.counter.textContent = `Осталось задач: ${activeCount}`;
  }

  getInputValue() {
    return this.input.value.trim();
  }

  clearInput() {
    this.input.value = '';
  }

  bindAddTodo(handler) {
    document.getElementById('addBtn').addEventListener('click', handler);
    this.input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handler();
    });
  }

  bindToggleTodo(handler) {
    this.list.addEventListener('click', (e) => {
      if (e.target.classList.contains('toggle')) {
        handler(Number(e.target.dataset.id));
      }
    });
  }

  bindDeleteTodo(handler) {
    this.list.addEventListener('click', (e) => {
      if (e.target.classList.contains('delete')) {
        handler(Number(e.target.dataset.id));
      }
    });
  }
}

// ========== CONTROLLER ==========
class TodoController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    // Подписка View на изменения Model
    this.model.subscribe((todos) => {
      this.view.displayTodos(todos);
      this.view.updateCounter(this.model.getActive().length);
    });

    // Привязка действий пользователя
    this.view.bindAddTodo(() => this.handleAddTodo());
    this.view.bindToggleTodo((id) => this.handleToggleTodo(id));
    this.view.bindDeleteTodo((id) => this.handleDeleteTodo(id));
  }

  handleAddTodo() {
    const text = this.view.getInputValue();
    if (text) {
      this.model.addTodo(text);
      this.view.clearInput();
    }
  }

  handleToggleTodo(id) {
    this.model.toggleTodo(id);
  }

  handleDeleteTodo(id) {
    this.model.removeTodo(id);
  }
}

// ========== ИНИЦИАЛИЗАЦИЯ ==========
const model = new TodoModel();
const view = new TodoView();
const controller = new TodoController(model, view);
```

---

## Практические примеры

### Пример 1: Корзина интернет-магазина

```javascript
// MODEL
class CartModel {
  constructor() {
    this.items = [];
    this.listeners = [];
  }

  subscribe(fn) { this.listeners.push(fn); }
  notify() { this.listeners.forEach(fn => fn()); }

  addItem(product, quantity = 1) {
    const existing = this.items.find(i => i.product.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.items.push({ product, quantity });
    }
    this.notify();
  }

  removeItem(productId) {
    this.items = this.items.filter(i => i.product.id !== productId);
    this.notify();
  }

  getTotal() {
    return this.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity, 0
    );
  }

  getItemCount() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  getItems() {
    return [...this.items];
  }
}

// VIEW
class CartView {
  constructor(container) {
    this.container = container;
  }

  render(items, total) {
    this.container.innerHTML = `
      <h2>Корзина (${items.length} товаров)</h2>
      <ul>
        ${items.map(item => `
          <li>
            ${item.product.name} x${item.quantity}
            — ${item.product.price * item.quantity} руб.
            <button data-id="${item.product.id}" class="remove">Удалить</button>
          </li>
        `).join('')}
      </ul>
      <p><strong>Итого: ${total} руб.</strong></p>
    `;
  }

  bindRemove(handler) {
    this.container.addEventListener('click', (e) => {
      if (e.target.classList.contains('remove')) {
        handler(Number(e.target.dataset.id));
      }
    });
  }
}

// CONTROLLER
class CartController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.model.subscribe(() => this.updateView());
    this.view.bindRemove((id) => this.model.removeItem(id));
  }

  updateView() {
    this.view.render(this.model.getItems(), this.model.getTotal());
  }

  addToCart(product, qty) {
    this.model.addItem(product, qty);
  }
}
```

### Пример 2: Express.js (серверный MVC)

```javascript
// MODEL — models/user.js
class UserModel {
  static users = [];

  static create(data) {
    const user = { id: Date.now(), ...data };
    this.users.push(user);
    return user;
  }

  static findAll() {
    return this.users;
  }

  static findById(id) {
    return this.users.find(u => u.id === id);
  }

  static delete(id) {
    this.users = this.users.filter(u => u.id !== id);
  }
}

// VIEW — views/userView.js
class UserView {
  static renderList(users) {
    return {
      status: 'success',
      count: users.length,
      data: users
    };
  }

  static renderOne(user) {
    return {
      status: 'success',
      data: user
    };
  }

  static renderError(message) {
    return {
      status: 'error',
      message
    };
  }
}

// CONTROLLER — controllers/userController.js
class UserController {
  static getAll(req, res) {
    const users = UserModel.findAll();
    res.json(UserView.renderList(users));
  }

  static getById(req, res) {
    const user = UserModel.findById(Number(req.params.id));
    if (!user) {
      return res.status(404).json(UserView.renderError('User not found'));
    }
    res.json(UserView.renderOne(user));
  }

  static create(req, res) {
    const user = UserModel.create(req.body);
    res.status(201).json(UserView.renderOne(user));
  }

  static delete(req, res) {
    UserModel.delete(Number(req.params.id));
    res.status(204).send();
  }
}

// ROUTES — routes/users.js
// router.get('/users', UserController.getAll);
// router.get('/users/:id', UserController.getById);
// router.post('/users', UserController.create);
// router.delete('/users/:id', UserController.delete);
```

---

## Поток данных в MVC

```
Пользователь нажимает кнопку
        │
        ▼
   ┌──────────┐
   │   View   │ ─── отправляет событие ───►  ┌──────────────┐
   └──────────┘                               │  Controller  │
                                              └──────┬───────┘
                                                     │
                                              обновляет Model
                                                     │
                                                     ▼
                                              ┌──────────┐
                                              │  Model   │
                                              └──────┬───┘
                                                     │
                                              уведомляет об изменении
                                                     │
                                                     ▼
                                              ┌──────────┐
                                              │   View   │ ─── перерисовывает UI
                                              └──────────┘
```

---

## Примеры в реальной жизни

| Фреймворк / Библиотека | Применение |
|-------------------------|------------|
| **Express.js** | Серверный MVC с роутами, контроллерами, моделями |
| **Ruby on Rails** | Классический серверный MVC |
| **Django** | MTV (Model-Template-View) — вариация MVC |
| **Spring MVC** | Java серверный MVC |
| **ASP.NET MVC** | C# серверный MVC |
| **Backbone.js** | Клиентский MVC для SPA |

---

## Когда использовать

### Хорошие случаи:

- **Серверные приложения** — чёткое разделение роутов, логики и шаблонов
- **CRUD-приложения** — стандартная структура для работы с данными
- **Командная работа** — разработчики могут работать над Model, View и Controller параллельно
- **Тестирование** — Model и Controller легко тестировать отдельно

### Когда не нужен:

- **Простые скрипты** — избыточная структура
- **Сложный реактивный UI** — лучше MVVM с data binding
- **Микросервисы** — другие архитектурные подходы

---

## Резюме

| Аспект | Описание |
|--------|---------|
| **Цель** | Разделение данных, представления и логики управления |
| **Проблема** | Смешивание ответственности, сложность тестирования |
| **Решение** | Три компонента: Model, View, Controller |
| **Плюсы** | Разделение ответственности, тестируемость, параллельная работа |
| **Минусы** | Может быть избыточным, Controller разрастается |
| **Когда** | Серверные приложения, CRUD, командная работа |

---

## Следующие шаги

1. Изучите **[MVVM](/design_patterns/mvvm)** — эволюция MVC с data binding
2. Изучите **[MVP](/design_patterns/mvp)** — альтернативный подход с Presenter
3. Сравните все три архитектурных паттерна
