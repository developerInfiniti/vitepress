---
title: ng-template и ngTemplateOutlet
description: Использование ng-template, ng-container и ngTemplateOutlet в Angular
---

# ng-template и ngTemplateOutlet

## 1. ng-template

`<ng-template>` — это элемент Angular, который определяет шаблон, но **не рендерится** сам по себе. Он используется как «заготовка», которую можно вставить в нужное место.

```html
<!-- Этот шаблон НЕ отобразится автоматически -->
<ng-template>
  <p>Этот текст не виден по умолчанию</p>
</ng-template>
```

### Использование с директивами

```html
<!-- *ngIf под капотом использует ng-template -->
<div *ngIf="isVisible">Видимый контент</div>

<!-- Эквивалентная развёрнутая запись -->
<ng-template [ngIf]="isVisible">
  <div>Видимый контент</div>
</ng-template>
```

### ng-template с else

```html
<div *ngIf="user; else noUser">
  <p>Привет, {{ user.name }}!</p>
</div>

<ng-template #noUser>
  <p>Пожалуйста, войдите в систему</p>
</ng-template>
```

### ng-template с then/else

```html
<div *ngIf="isLoggedIn; then loggedIn; else loggedOut"></div>

<ng-template #loggedIn>
  <p>Добро пожаловать!</p>
</ng-template>

<ng-template #loggedOut>
  <p>Войдите в систему</p>
</ng-template>
```

## 2. ng-container

`<ng-container>` — логический контейнер, который **не создаёт DOM-элемент**. Полезен когда нужно применить директиву без добавления лишнего HTML.

```html
<!-- Без ng-container — лишний div -->
<div *ngIf="isVisible">
  <span *ngFor="let item of items">{{ item }}</span>
</div>

<!-- С ng-container — чистый DOM -->
<ng-container *ngIf="isVisible">
  <span *ngFor="let item of items">{{ item }}</span>
</ng-container>
```

### Комбинирование директив

Angular не позволяет две структурные директивы на одном элементе. `ng-container` решает эту проблему:

```html
<!-- ОШИБКА: нельзя *ngIf и *ngFor на одном элементе -->
<!-- <li *ngIf="show" *ngFor="let item of items">{{ item }}</li> -->

<!-- Правильно -->
<ng-container *ngIf="show">
  <li *ngFor="let item of items">{{ item }}</li>
</ng-container>
```

## 3. ngTemplateOutlet

`*ngTemplateOutlet` позволяет вставить `ng-template` в указанное место и передать ему контекст.

### Базовое использование

```html
<ng-template #greetTemplate>
  <p>Привет из шаблона!</p>
</ng-template>

<!-- Вставляем шаблон здесь -->
<ng-container *ngTemplateOutlet="greetTemplate"></ng-container>

<!-- Можно вставить несколько раз -->
<ng-container *ngTemplateOutlet="greetTemplate"></ng-container>
```

### Передача контекста

```html
<ng-template #userCard let-name="name" let-role="role">
  <div class="card">
    <h3>{{ name }}</h3>
    <p>Роль: {{ role }}</p>
  </div>
</ng-template>

<ng-container *ngTemplateOutlet="userCard; context: { name: 'Иван', role: 'Админ' }">
</ng-container>

<ng-container *ngTemplateOutlet="userCard; context: { name: 'Мария', role: 'Разработчик' }">
</ng-container>
```

### Переменная `$implicit`

`$implicit` — значение по умолчанию, доступное через `let-переменная` без указания ключа:

```html
<ng-template #itemTemplate let-item>
  <li>{{ item }}</li>
</ng-template>

<ul>
  <ng-container *ngFor="let fruit of fruits">
    <ng-container *ngTemplateOutlet="itemTemplate; context: { $implicit: fruit }">
    </ng-container>
  </ng-container>
</ul>
```

```typescript
@Component({ /* ... */ })
export class FruitListComponent {
  fruits = ['Яблоко', 'Банан', 'Вишня'];
}
```

## 4. Динамический выбор шаблона

```typescript
@Component({
  selector: 'app-dynamic',
  template: `
    <ng-template #adminTemplate>
      <div class="admin-panel">
        <h2>Панель администратора</h2>
        <button>Управление пользователями</button>
      </div>
    </ng-template>

    <ng-template #userTemplate>
      <div class="user-panel">
        <h2>Личный кабинет</h2>
        <p>Добро пожаловать!</p>
      </div>
    </ng-template>

    <ng-container *ngTemplateOutlet="isAdmin ? adminTemplate : userTemplate">
    </ng-container>
  `
})
export class DynamicComponent {
  isAdmin = false;
}
```

## 5. Передача шаблона в дочерний компонент

### Родительский компонент

```html
<app-list [items]="products" [itemTemplate]="productTpl">
  <ng-template #productTpl let-product>
    <div class="product">
      <strong>{{ product.name }}</strong>
      <span>{{ product.price }} руб.</span>
    </div>
  </ng-template>
</app-list>
```

### Дочерний компонент

```typescript
@Component({
  selector: 'app-list',
  template: `
    <div *ngFor="let item of items">
      <ng-container
        *ngTemplateOutlet="itemTemplate; context: { $implicit: item }">
      </ng-container>
    </div>
  `
})
export class ListComponent {
  @Input() items: any[] = [];
  @Input() itemTemplate!: TemplateRef<any>;
}
```

## Сводная таблица

| Элемент | Назначение | Создаёт DOM? |
|---------|-----------|:------------:|
| `ng-template` | Определяет шаблон-заготовку | Нет |
| `ng-container` | Логический контейнер для директив | Нет |
| `*ngTemplateOutlet` | Вставляет ng-template в DOM | Нет (вставляет содержимое) |
| `let-var` | Получает переменную из контекста | — |
| `$implicit` | Значение по умолчанию в контексте | — |
