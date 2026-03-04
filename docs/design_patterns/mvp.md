# MVP паттерн

**MVP** (Model-View-Presenter) — это архитектурный паттерн, в котором Presenter выступает посредником между Model и View, полностью контролируя логику представления.

---

## Проблема

```javascript
// ❌ В MVC Controller часто становится "толстым" и знает слишком много
class UserController {
  updateProfile(data) {
    // Валидация
    if (!data.name) throw new Error('Name required');
    if (!data.email.includes('@')) throw new Error('Invalid email');

    // Бизнес-логика
    const user = this.model.update(data);

    // Логика отображения — Controller знает о DOM!
    document.getElementById('name').textContent = user.name;
    document.getElementById('avatar').src = user.avatar || 'default.png';
    document.getElementById('status').className = user.isActive ? 'green' : 'red';
    document.getElementById('lastLogin').textContent = this.formatDate(user.lastLogin);
  }
}
```

### Проблемы:

1. **Controller знает о View** — привязан к DOM
2. **Сложно тестировать** — нужен реальный DOM для тестов
3. **Нет чёткого интерфейса** — View может быть чем угодно
4. **Толстый Controller** — логика представления и бизнес-логика смешаны

---

## Структура MVP

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│    Model    │◄───►│  Presenter   │◄───►│    View     │
│  (данные)   │     │  (логика)    │     │  (UI)       │
└─────────────┘     └──────────────┘     └─────────────┘
                          │
                    Presenter ПОЛНОСТЬЮ
                    контролирует View
                    через интерфейс
```

Ключевое отличие от MVC:
- **View** пассивна и не знает о Model
- **Presenter** общается с View через интерфейс (контракт)
- **View** только отображает и передаёт события Presenter

---

## Решение

### Базовый пример: Форма регистрации

```javascript
// ========== MODEL ==========
class UserModel {
  constructor() {
    this.users = [];
  }

  register(name, email, password) {
    if (this.users.some(u => u.email === email)) {
      throw new Error('Email уже зарегистрирован');
    }

    const user = {
      id: Date.now(),
      name,
      email,
      password,
      createdAt: new Date()
    };

    this.users.push(user);
    return user;
  }

  findByEmail(email) {
    return this.users.find(u => u.email === email);
  }
}

// ========== VIEW INTERFACE (контракт) ==========
// View должен реализовать эти методы:
// - getName(): string
// - getEmail(): string
// - getPassword(): string
// - showSuccess(message: string)
// - showError(field: string, message: string)
// - clearErrors()
// - setLoading(loading: boolean)
// - onSubmit(handler: Function)

// ========== VIEW ==========
class RegisterView {
  constructor() {
    this.render();
  }

  render() {
    document.getElementById('app').innerHTML = `
      <form id="registerForm">
        <h2>Регистрация</h2>
        <div>
          <input id="name" placeholder="Имя" />
          <span id="nameError" class="error"></span>
        </div>
        <div>
          <input id="email" type="email" placeholder="Email" />
          <span id="emailError" class="error"></span>
        </div>
        <div>
          <input id="password" type="password" placeholder="Пароль" />
          <span id="passwordError" class="error"></span>
        </div>
        <button id="submitBtn" type="submit">Зарегистрироваться</button>
        <p id="message"></p>
      </form>
    `;
  }

  // Получение данных из View
  getName() {
    return document.getElementById('name').value.trim();
  }

  getEmail() {
    return document.getElementById('email').value.trim();
  }

  getPassword() {
    return document.getElementById('password').value;
  }

  // Отображение результатов
  showSuccess(message) {
    document.getElementById('message').textContent = message;
    document.getElementById('message').className = 'success';
  }

  showError(field, message) {
    document.getElementById(`${field}Error`).textContent = message;
  }

  clearErrors() {
    document.querySelectorAll('.error').forEach(el => {
      el.textContent = '';
    });
    document.getElementById('message').textContent = '';
  }

  setLoading(loading) {
    const btn = document.getElementById('submitBtn');
    btn.disabled = loading;
    btn.textContent = loading ? 'Загрузка...' : 'Зарегистрироваться';
  }

  // Привязка событий
  onSubmit(handler) {
    document.getElementById('registerForm').addEventListener('submit', (e) => {
      e.preventDefault();
      handler();
    });
  }
}

// ========== PRESENTER ==========
class RegisterPresenter {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    // Привязка событий View к обработчикам Presenter
    this.view.onSubmit(() => this.handleSubmit());
  }

  handleSubmit() {
    this.view.clearErrors();

    const name = this.view.getName();
    const email = this.view.getEmail();
    const password = this.view.getPassword();

    // Валидация (логика в Presenter)
    let hasErrors = false;

    if (!name) {
      this.view.showError('name', 'Имя обязательно');
      hasErrors = true;
    }

    if (!email || !email.includes('@')) {
      this.view.showError('email', 'Введите корректный email');
      hasErrors = true;
    }

    if (!password || password.length < 6) {
      this.view.showError('password', 'Минимум 6 символов');
      hasErrors = true;
    }

    if (hasErrors) return;

    // Работа с Model
    this.view.setLoading(true);

    try {
      const user = this.model.register(name, email, password);
      this.view.showSuccess(`Пользователь ${user.name} зарегистрирован!`);
    } catch (error) {
      this.view.showError('email', error.message);
    } finally {
      this.view.setLoading(false);
    }
  }
}

// ========== ИНИЦИАЛИЗАЦИЯ ==========
const model = new UserModel();
const view = new RegisterView();
const presenter = new RegisterPresenter(model, view);
```

---

## Практические примеры

### Пример 1: Список контактов

```javascript
// MODEL
class ContactModel {
  constructor() {
    this.contacts = [];
  }

  add(contact) {
    this.contacts.push({ id: Date.now(), ...contact });
    return this.contacts;
  }

  remove(id) {
    this.contacts = this.contacts.filter(c => c.id !== id);
    return this.contacts;
  }

  search(query) {
    return this.contacts.filter(c =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.email.toLowerCase().includes(query.toLowerCase())
    );
  }

  getAll() {
    return [...this.contacts];
  }
}

// VIEW (пассивная — только отображение)
class ContactListView {
  constructor(container) {
    this.container = container;
  }

  renderList(contacts) {
    this.container.innerHTML = `
      <input id="searchInput" placeholder="Поиск..." />
      <ul>
        ${contacts.map(c => `
          <li>
            <strong>${c.name}</strong> — ${c.email}
            <button data-id="${c.id}" class="delete-btn">Удалить</button>
          </li>
        `).join('')}
      </ul>
      <p>Всего: ${contacts.length}</p>
    `;
  }

  showEmpty() {
    this.container.innerHTML = '<p>Контактов не найдено</p>';
  }

  onSearch(handler) {
    this.container.addEventListener('input', (e) => {
      if (e.target.id === 'searchInput') {
        handler(e.target.value);
      }
    });
  }

  onDelete(handler) {
    this.container.addEventListener('click', (e) => {
      if (e.target.classList.contains('delete-btn')) {
        handler(Number(e.target.dataset.id));
      }
    });
  }
}

// PRESENTER (вся логика здесь)
class ContactListPresenter {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view.onSearch((query) => this.handleSearch(query));
    this.view.onDelete((id) => this.handleDelete(id));

    this.refreshView();
  }

  refreshView() {
    const contacts = this.model.getAll();
    if (contacts.length === 0) {
      this.view.showEmpty();
    } else {
      this.view.renderList(contacts);
    }
  }

  handleSearch(query) {
    if (!query) {
      this.view.renderList(this.model.getAll());
      return;
    }

    const results = this.model.search(query);
    if (results.length === 0) {
      this.view.showEmpty();
    } else {
      this.view.renderList(results);
    }
  }

  handleDelete(id) {
    this.model.remove(id);
    this.refreshView();
  }

  addContact(name, email) {
    this.model.add({ name, email });
    this.refreshView();
  }
}
```

### Пример 2: MVP с тестированием

```javascript
// Главное преимущество MVP — лёгкость тестирования

// Mock View для тестов (не нужен DOM!)
class MockRegisterView {
  constructor() {
    this.submitHandler = null;
    this.errors = {};
    this.successMessage = '';
    this.loading = false;

    // Предустановленные данные
    this._name = '';
    this._email = '';
    this._password = '';
  }

  // Имитация ввода
  setInputs(name, email, password) {
    this._name = name;
    this._email = email;
    this._password = password;
  }

  getName() { return this._name; }
  getEmail() { return this._email; }
  getPassword() { return this._password; }

  showSuccess(message) { this.successMessage = message; }
  showError(field, message) { this.errors[field] = message; }
  clearErrors() { this.errors = {}; this.successMessage = ''; }
  setLoading(loading) { this.loading = loading; }

  onSubmit(handler) { this.submitHandler = handler; }

  // Имитация клика по кнопке
  simulateSubmit() { this.submitHandler(); }
}

// Тесты
function testRegistration() {
  const model = new UserModel();
  const view = new MockRegisterView();
  const presenter = new RegisterPresenter(model, view);

  // Тест 1: Успешная регистрация
  view.setInputs('Иван', 'ivan@mail.ru', '123456');
  view.simulateSubmit();
  console.assert(view.successMessage.includes('Иван'), 'Should show success');
  console.assert(Object.keys(view.errors).length === 0, 'No errors');

  // Тест 2: Пустое имя
  view.setInputs('', 'test@mail.ru', '123456');
  view.simulateSubmit();
  console.assert(view.errors.name === 'Имя обязательно', 'Name error shown');

  // Тест 3: Невалидный email
  view.setInputs('Тест', 'invalid', '123456');
  view.simulateSubmit();
  console.assert(view.errors.email !== undefined, 'Email error shown');

  // Тест 4: Короткий пароль
  view.setInputs('Тест', 'test@mail.ru', '123');
  view.simulateSubmit();
  console.assert(view.errors.password !== undefined, 'Password error shown');

  // Тест 5: Дублирующийся email
  view.setInputs('Другой', 'ivan@mail.ru', '123456');
  view.simulateSubmit();
  console.assert(view.errors.email === 'Email уже зарегистрирован', 'Duplicate error');

  console.log('All tests passed!');
}

testRegistration();
```

---

## Сравнение MVC, MVP и MVVM

| Аспект | MVC | MVP | MVVM |
|--------|-----|-----|------|
| **Посредник** | Controller | Presenter | ViewModel |
| **View знает о** | Controller | Presenter (интерфейс) | ViewModel (binding) |
| **Обновление View** | Controller или напрямую | Presenter через интерфейс | Автоматически (binding) |
| **Тестируемость** | Средняя | Высокая (mock View) | Высокая (без DOM) |
| **Связанность** | Средняя | Низкая (интерфейсы) | Низкая (реактивность) |
| **Где используется** | Серверные приложения | Android, тестируемый UI | Vue, Angular, WPF |
| **View** | Может быть активной | Полностью пассивная | Декларативная |

```
MVC:
  User → View → Controller → Model → View
  (View может обращаться к Model напрямую)

MVP:
  User → View → Presenter → Model
                Presenter → View
  (View НЕ знает о Model)

MVVM:
  User → View ↔ ViewModel ↔ Model
  (Двусторонний binding)
```

---

## Поток данных в MVP

```
Пользователь взаимодействует с View
        │
        ▼
   ┌──────────┐
   │   View   │ ── вызывает метод ──►  ┌──────────────┐
   │ (passive)│                         │  Presenter   │
   └──────────┘                         └──────┬───────┘
        ▲                                      │
        │                               работает с Model
        │                                      │
        │                                      ▼
        │                               ┌──────────┐
        │                               │  Model   │
        │                               └──────┬───┘
        │                                      │
        │                               возвращает данные
        │                                      │
        │                                      ▼
        │                               ┌──────────────┐
        └── обновляется через ──────────│  Presenter   │
            интерфейс                   └──────────────┘
```

---

## Примеры в реальной жизни

| Платформа / Фреймворк | Применение |
|------------------------|------------|
| **Android** | Классический паттерн для Activity/Fragment |
| **GWT** | Google Web Toolkit |
| **WinForms** | .NET десктопные приложения |
| **Vaadin** | Java веб-фреймворк |
| **Тестирование** | Любой проект, где важна тестируемость UI-логики |

---

## Когда использовать

### Хорошие случаи:

- **Тестируемость** — нужно тестировать UI-логику без DOM
- **Пассивная View** — View не содержит логики, только отображение
- **Чёткое разделение** — строгий контракт между Presenter и View
- **Мобильная разработка** — Android MVP-архитектура
- **Легаси-код** — постепенное выделение логики из "толстых" View

### Когда не нужен:

- **Простой UI** — избыточная абстракция
- **Реактивные фреймворки** — Vue/Angular уже реализуют MVVM
- **Серверные приложения** — достаточно MVC

---

## Резюме

| Аспект | Описание |
|--------|---------|
| **Цель** | Полный контроль Presenter над логикой представления |
| **Проблема** | Controller в MVC знает о View, сложно тестировать |
| **Решение** | Пассивная View + Presenter с интерфейсом |
| **Плюсы** | Тестируемость, чёткое разделение, замена View |
| **Минусы** | Больше кода, Presenter может разрастаться |
| **Когда** | Тестируемый UI, мобильные приложения, чёткие контракты |

---

## Следующие шаги

1. Изучите **[MVC](/design_patterns/mvc)** — классический паттерн
2. Изучите **[MVVM](/design_patterns/mvvm)** — реактивный подход
3. Выберите подходящий архитектурный паттерн для вашего проекта
