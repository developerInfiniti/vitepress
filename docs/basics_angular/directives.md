---
title: Директивы Angular
description: Структурные директивы Angular — *ngIf, *ngFor, *ngSwitch и их использование
---

# Структурные директивы Angular

Структурные директивы изменяют структуру DOM — добавляют, удаляют или заменяют элементы. Они всегда начинаются с символа `*`.

## 1. *ngIf

Условно добавляет или удаляет элемент из DOM.

```html
<p *ngIf="isVisible">Этот текст виден</p>
```

### *ngIf с else

```html
<div *ngIf="isLoggedIn; else loginBlock">
  <p>Добро пожаловать, {{ userName }}!</p>
</div>

<ng-template #loginBlock>
  <p>Пожалуйста, войдите</p>
</ng-template>
```

### *ngIf с then и else

```html
<div *ngIf="status === 'success'; then successTpl; else errorTpl"></div>

<ng-template #successTpl>
  <div class="alert-success">Операция выполнена</div>
</ng-template>

<ng-template #errorTpl>
  <div class="alert-error">Произошла ошибка</div>
</ng-template>
```

### *ngIf с сохранением значения (as)

```html
<div *ngIf="user$ | async as user">
  <h2>{{ user.name }}</h2>
  <p>{{ user.email }}</p>
</div>
```

```typescript
@Component({ /* ... */ })
export class UserComponent {
  isVisible = true;
  isLoggedIn = false;
  userName = 'Иван';
  user$ = this.userService.getUser();

  constructor(private userService: UserService) {}
}
```

## 2. *ngFor

Повторяет элемент для каждого элемента коллекции.

### Базовое использование

```html
<ul>
  <li *ngFor="let item of items">{{ item }}</li>
</ul>
```

### Доступные переменные

```html
<ul>
  <li *ngFor="let item of items; let i = index; let first = first;
              let last = last; let even = even; let odd = odd">
    <span>{{ i + 1 }}. {{ item }}</span>
    <span *ngIf="first"> (первый)</span>
    <span *ngIf="last"> (последний)</span>
    <span [class.even-row]="even"></span>
  </li>
</ul>
```

| Переменная | Тип | Описание |
|-----------|-----|---------|
| `index` | `number` | Текущий индекс (от 0) |
| `first` | `boolean` | Первый элемент |
| `last` | `boolean` | Последний элемент |
| `even` | `boolean` | Чётный индекс |
| `odd` | `boolean` | Нечётный индекс |
| `count` | `number` | Длина коллекции |

### trackBy для оптимизации

Без `trackBy` Angular пересоздаёт DOM-элементы при каждом обновлении массива. `trackBy` позволяет отслеживать элементы по уникальному ключу:

```html
<li *ngFor="let user of users; trackBy: trackByUserId">
  {{ user.name }}
</li>
```

```typescript
@Component({ /* ... */ })
export class UserListComponent {
  users = [
    { id: 1, name: 'Иван' },
    { id: 2, name: 'Мария' },
    { id: 3, name: 'Пётр' }
  ];

  trackByUserId(index: number, user: { id: number }) {
    return user.id;
  }
}
```

### Вложенные *ngFor

```html
<div *ngFor="let category of categories">
  <h3>{{ category.name }}</h3>
  <ul>
    <li *ngFor="let product of category.products">
      {{ product.name }} — {{ product.price }} руб.
    </li>
  </ul>
</div>
```

## 3. *ngSwitch

Переключает между несколькими шаблонами по значению выражения.

```html
<div [ngSwitch]="currentTab">
  <div *ngSwitchCase="'home'">
    <h2>Главная</h2>
    <p>Добро пожаловать на главную страницу</p>
  </div>

  <div *ngSwitchCase="'about'">
    <h2>О нас</h2>
    <p>Информация о компании</p>
  </div>

  <div *ngSwitchCase="'contacts'">
    <h2>Контакты</h2>
    <p>Свяжитесь с нами</p>
  </div>

  <div *ngSwitchDefault>
    <h2>Страница не найдена</h2>
  </div>
</div>
```

```typescript
@Component({ /* ... */ })
export class TabsComponent {
  currentTab = 'home';

  switchTab(tab: string) {
    this.currentTab = tab;
  }
}
```

### Несколько case с одним значением

```html
<div [ngSwitch]="role">
  <p *ngSwitchCase="'admin'">Полный доступ</p>
  <p *ngSwitchCase="'editor'">Доступ к редактированию</p>
  <p *ngSwitchCase="'viewer'">Только просмотр</p>
  <p *ngSwitchDefault>Неизвестная роль</p>
</div>
```

## 4. Атрибутные директивы

В дополнение к структурным, Angular предоставляет атрибутные директивы для изменения внешнего вида и поведения элементов.

### ngClass

```html
<!-- Объект: ключ — класс, значение — условие -->
<div [ngClass]="{ 'active': isActive, 'disabled': isDisabled }">
  Элемент
</div>

<!-- Массив классов -->
<div [ngClass]="['class1', 'class2']">Элемент</div>

<!-- Строка -->
<div [ngClass]="'first second'">Элемент</div>
```

```typescript
@Component({ /* ... */ })
export class StyledComponent {
  isActive = true;
  isDisabled = false;

  getClasses() {
    return {
      'text-bold': this.isActive,
      'text-muted': this.isDisabled,
      'bg-primary': true
    };
  }
}
```

### ngStyle

```html
<div [ngStyle]="{
  'color': textColor,
  'font-size': fontSize + 'px',
  'background-color': isHighlighted ? 'yellow' : 'transparent'
}">
  Стилизованный текст
</div>
```

```typescript
@Component({ /* ... */ })
export class StyledComponent {
  textColor = '#333';
  fontSize = 16;
  isHighlighted = false;
}
```

## 5. @if, @for, @switch (Angular 17+)

Начиная с Angular 17, доступен новый синтаксис управления потоком (control flow):

### @if

```html
@if (isLoggedIn) {
  <p>Добро пожаловать, {{ userName }}!</p>
} @else if (isRegistering) {
  <p>Регистрация...</p>
} @else {
  <p>Войдите в систему</p>
}
```

### @for

```html
@for (item of items; track item.id) {
  <li>{{ item.name }}</li>
} @empty {
  <li>Список пуст</li>
}
```

`track` — обязателен в `@for`. Это аналог `trackBy` из `*ngFor`.

### @switch

```html
@switch (status) {
  @case ('active') {
    <span class="badge-green">Активен</span>
  }
  @case ('inactive') {
    <span class="badge-gray">Неактивен</span>
  }
  @default {
    <span class="badge-red">Неизвестно</span>
  }
}
```

### Сравнение старого и нового синтаксиса

| Старый | Новый (Angular 17+) |
|--------|---------------------|
| `*ngIf="cond"` | `@if (cond) { }` |
| `*ngIf="cond; else tpl"` | `@if (cond) { } @else { }` |
| `*ngFor="let x of items; trackBy: fn"` | `@for (x of items; track x.id) { }` |
| `[ngSwitch] / *ngSwitchCase` | `@switch / @case` |
| Нет аналога | `@empty` (пустой список) |

## Сводная таблица директив

| Директива | Тип | Назначение |
|-----------|-----|-----------|
| `*ngIf` | Структурная | Условный рендеринг |
| `*ngFor` | Структурная | Итерация по коллекции |
| `*ngSwitch` | Структурная | Выбор из нескольких вариантов |
| `ngClass` | Атрибутная | Динамические CSS-классы |
| `ngStyle` | Атрибутная | Динамические стили |
| `@if/@for/@switch` | Control Flow | Новый синтаксис (Angular 17+) |
