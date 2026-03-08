---
description: "Паттерн MVVM: Model-View-ViewModel, data binding — архитектурный паттерн для реактивных интерфейсов"
---

# MVVM паттерн

**MVVM** (Model-View-ViewModel) — это архитектурный паттерн, который разделяет приложение на модель данных, представление и промежуточный слой ViewModel, обеспечивающий двустороннюю привязку данных (data binding).

---

## Проблема

```javascript
// ❌ В классическом MVC — Controller вручную синхронизирует Model и View
class UserController {
  updateName(newName) {
    // Обновить модель
    this.model.name = newName;

    // Вручную обновить все элементы UI, которые показывают имя
    document.getElementById('userName').textContent = newName;
    document.getElementById('userGreeting').textContent = `Привет, ${newName}!`;
    document.getElementById('profileName').value = newName;
    document.getElementById('headerName').textContent = newName;
    // Забыли обновить что-то? Баг!
  }
}
```

### Проблемы такого подхода:

1. **Ручная синхронизация** — нужно обновлять каждый элемент UI вручную
2. **Забытые обновления** — легко пропустить элемент
3. **Раздутый Controller** — логика обновления UI смешана с бизнес-логикой
4. **Сложность тестирования** — Controller зависит от DOM

---

## Структура MVVM

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│    Model    │◄───►│  ViewModel   │◄───►│    View     │
│  (данные)   │     │  (логика +   │     │  (UI)       │
│             │     │   binding)   │     │             │
└─────────────┘     └──────────────┘     └─────────────┘
                          ▲  │
                          │  ▼
                    Data Binding
                  (двусторонняя
                   привязка данных)
```

- **Model** — данные и бизнес-логика (не знает о UI)
- **View** — шаблон UI (декларативно привязан к ViewModel)
- **ViewModel** — посредник, предоставляет данные и команды для View

---

## Решение

### Базовый пример: Реактивная система

```javascript
// ========== ПРОСТАЯ РЕАКТИВНОСТЬ ==========
class Observable {
  constructor(value) {
    this._value = value;
    this._subscribers = [];
  }

  get value() {
    return this._value;
  }

  set value(newValue) {
    if (this._value !== newValue) {
      this._value = newValue;
      this._subscribers.forEach(fn => fn(newValue));
    }
  }

  subscribe(fn) {
    this._subscribers.push(fn);
    fn(this._value); // Начальное значение
    return () => {
      this._subscribers = this._subscribers.filter(s => s !== fn);
    };
  }
}

// ========== MODEL ==========
class UserModel {
  constructor(data) {
    this.name = data.name;
    this.email = data.email;
    this.age = data.age;
  }

  validate() {
    return this.name.length > 0 && this.email.includes('@');
  }
}

// ========== VIEWMODEL ==========
class UserViewModel {
  constructor() {
    // Реактивные свойства
    this.name = new Observable('');
    this.email = new Observable('');
    this.age = new Observable(0);
    this.isValid = new Observable(false);
    this.greeting = new Observable('');

    // Автоматическое обновление вычисляемых свойств
    this.name.subscribe((name) => {
      this.greeting.value = name ? `Привет, ${name}!` : '';
      this.validate();
    });

    this.email.subscribe(() => this.validate());
  }

  validate() {
    this.isValid.value =
      this.name.value.length > 0 &&
      this.email.value.includes('@');
  }

  save() {
    if (this.isValid.value) {
      const model = new UserModel({
        name: this.name.value,
        email: this.email.value,
        age: this.age.value
      });
      console.log('Сохранено:', model);
      return model;
    }
    console.log('Форма невалидна');
    return null;
  }
}

// ========== VIEW (привязка к DOM) ==========
class UserView {
  constructor(viewModel) {
    this.vm = viewModel;
    this.render();
    this.bind();
  }

  render() {
    document.getElementById('app').innerHTML = `
      <div>
        <h2 id="greeting"></h2>
        <input id="nameInput" placeholder="Имя" />
        <input id="emailInput" placeholder="Email" />
        <input id="ageInput" type="number" placeholder="Возраст" />
        <button id="saveBtn" disabled>Сохранить</button>
        <p id="status"></p>
      </div>
    `;
  }

  bind() {
    const nameInput = document.getElementById('nameInput');
    const emailInput = document.getElementById('emailInput');
    const ageInput = document.getElementById('ageInput');
    const saveBtn = document.getElementById('saveBtn');

    // View → ViewModel (пользовательский ввод)
    nameInput.addEventListener('input', (e) => {
      this.vm.name.value = e.target.value;
    });

    emailInput.addEventListener('input', (e) => {
      this.vm.email.value = e.target.value;
    });

    ageInput.addEventListener('input', (e) => {
      this.vm.age.value = Number(e.target.value);
    });

    saveBtn.addEventListener('click', () => this.vm.save());

    // ViewModel → View (автоматическое обновление UI)
    this.vm.greeting.subscribe((text) => {
      document.getElementById('greeting').textContent = text;
    });

    this.vm.isValid.subscribe((valid) => {
      saveBtn.disabled = !valid;
      document.getElementById('status').textContent =
        valid ? 'Форма валидна' : 'Заполните все поля';
    });
  }
}

// ========== ИНИЦИАЛИЗАЦИЯ ==========
const vm = new UserViewModel();
const view = new UserView(vm);
```

---

## MVVM во Vue.js

Vue.js — классический пример MVVM-фреймворка:

```javascript
// Vue 3 Composition API — идеальный MVVM

// ========== MODEL ==========
// api/userApi.js
async function fetchUser(id) {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}

async function updateUser(id, data) {
  const response = await fetch(`/api/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
}
```

```vue
<!-- VIEW — UserProfile.vue -->
<template>
  <div class="profile">
    <h2>{{ greeting }}</h2>

    <input v-model="name" placeholder="Имя" />
    <input v-model="email" placeholder="Email" />

    <p v-if="isValid" class="valid">Форма валидна</p>
    <p v-else class="invalid">Заполните все поля</p>

    <button :disabled="!isValid" @click="save">
      Сохранить
    </button>

    <p v-if="loading">Загрузка...</p>
  </div>
</template>

<script setup>
// ========== VIEWMODEL ==========
import { ref, computed } from 'vue'
import { fetchUser, updateUser } from '@/api/userApi'

const name = ref('')
const email = ref('')
const loading = ref(false)

// Вычисляемые свойства (автоматически реагируют на изменения)
const greeting = computed(() =>
  name.value ? `Привет, ${name.value}!` : ''
)

const isValid = computed(() =>
  name.value.length > 0 && email.value.includes('@')
)

// Команды
async function save() {
  if (!isValid.value) return

  loading.value = true
  await updateUser(1, {
    name: name.value,
    email: email.value
  })
  loading.value = false
}

// Загрузка начальных данных
async function loadUser() {
  loading.value = true
  const user = await fetchUser(1)
  name.value = user.name
  email.value = user.email
  loading.value = false
}

loadUser()
</script>
```

---

## MVVM в Angular

```typescript
// ========== MODEL — user.model.ts ==========
interface User {
  id: number;
  name: string;
  email: string;
}

// ========== SERVICE (часть Model) — user.service.ts ==========
@Injectable({ providedIn: 'root' })
class UserService {
  constructor(private http: HttpClient) {}

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`/api/users/${id}`);
  }

  updateUser(id: number, data: Partial<User>): Observable<User> {
    return this.http.put<User>(`/api/users/${id}`, data);
  }
}

// ========== VIEWMODEL (Component) — user.component.ts ==========
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html'
})
class UserComponent implements OnInit {
  // Реактивные данные
  name = '';
  email = '';
  loading = false;

  // Вычисляемые свойства
  get greeting(): string {
    return this.name ? `Привет, ${this.name}!` : '';
  }

  get isValid(): boolean {
    return this.name.length > 0 && this.email.includes('@');
  }

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUser();
  }

  loadUser() {
    this.loading = true;
    this.userService.getUser(1).subscribe(user => {
      this.name = user.name;
      this.email = user.email;
      this.loading = false;
    });
  }

  save() {
    if (!this.isValid) return;
    this.userService.updateUser(1, {
      name: this.name,
      email: this.email
    }).subscribe();
  }
}
```

```html
<!-- VIEW — user.component.html -->
<div class="profile">
  <h2>{{ greeting }}</h2>

  <input [(ngModel)]="name" placeholder="Имя" />
  <input [(ngModel)]="email" placeholder="Email" />

  <p *ngIf="isValid" class="valid">Форма валидна</p>
  <p *ngIf="!isValid" class="invalid">Заполните все поля</p>

  <button [disabled]="!isValid" (click)="save()">Сохранить</button>

  <p *ngIf="loading">Загрузка...</p>
</div>
```

---

## Data Binding: типы привязки данных

```
1. One-way binding (View ← ViewModel)
   Данные идут из ViewModel в View
   Vue:     {{ message }}  или  :title="message"
   Angular: {{ message }}  или  [title]="message"

2. Event binding (View → ViewModel)
   Действия пользователя передаются в ViewModel
   Vue:     @click="handleClick"
   Angular: (click)="handleClick()"

3. Two-way binding (View ↔ ViewModel)
   Синхронизация в обе стороны
   Vue:     v-model="name"
   Angular: [(ngModel)]="name"
```

---

## Сравнение MVC и MVVM

| Аспект | MVC | MVVM |
|--------|-----|------|
| **Посредник** | Controller | ViewModel |
| **Связь View-данные** | Ручная через Controller | Автоматическая через binding |
| **Обновление UI** | Controller явно обновляет View | View автоматически реагирует |
| **Тестирование** | Controller тестируется | ViewModel тестируется без DOM |
| **Сложность** | Проще для серверных приложений | Проще для реактивных UI |
| **Примеры** | Express, Rails, Django | Vue, Angular, WPF |

```javascript
// MVC: Controller вручную обновляет View
class Controller {
  updateName(name) {
    this.model.name = name;
    this.view.setName(name);       // вручную
    this.view.setGreeting(name);   // вручную
    this.view.setTitle(name);      // вручную
  }
}

// MVVM: ViewModel + binding — View обновляется автоматически
class ViewModel {
  name = ref('');
  greeting = computed(() => `Привет, ${this.name.value}!`);
  // View обновляется сам через binding
}
```

---

## Примеры в реальной жизни

| Фреймворк / Библиотека | Применение |
|-------------------------|------------|
| **Vue.js** | Полноценный MVVM с реактивностью и v-model |
| **Angular** | MVVM с двусторонним binding через ngModel |
| **Knockout.js** | Один из первых JS MVVM-фреймворков |
| **WPF / XAML** | Microsoft MVVM для десктопных приложений |
| **SwiftUI** | Apple MVVM для iOS/macOS |
| **Svelte** | Реактивность на уровне компилятора |

---

## Когда использовать

### Хорошие случаи:

- **Сложный реактивный UI** — много элементов, зависящих от данных
- **Формы** — двустороннее связывание упрощает работу
- **Дашборды** — данные автоматически отображаются при изменении
- **SPA-приложения** — Vue, Angular и подобные фреймворки

### Когда не нужен:

- **Серверный рендеринг** — нет интерактивного UI, лучше MVC
- **Простые страницы** — избыточная реактивность
- **Статический контент** — нет необходимости в data binding

---

## Резюме

| Аспект | Описание |
|--------|---------|
| **Цель** | Автоматическая синхронизация UI и данных |
| **Проблема** | Ручное обновление UI при изменении данных |
| **Решение** | ViewModel с data binding |
| **Плюсы** | Автоматическое обновление, тестируемость, декларативный UI |
| **Минусы** | Сложность отладки binding, возможные утечки памяти |
| **Когда** | Реактивный UI, формы, SPA |

---

## Следующие шаги

1. Изучите **[MVC](/design_patterns/mvc)** — классический серверный паттерн
2. Изучите **[MVP](/design_patterns/mvp)** — альтернативный подход
3. Сравните все три архитектурных паттерна
