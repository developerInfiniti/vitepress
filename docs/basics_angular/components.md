# Компоненты Angular

## Что такое компонент

Компонент — основной строительный блок Angular-приложения. Каждый компонент состоит из:

- **Класс TypeScript** — логика и данные
- **HTML-шаблон** — представление (view)
- **Стили** — CSS/SCSS для компонента
- **Метаданные** — декоратор `@Component`

## Создание компонента

### Через Angular CLI

```bash
ng generate component user-card
# или сокращённо
ng g c user-card
```

CLI создаст 4 файла:

```
user-card/
├── user-card.component.ts       # Класс компонента
├── user-card.component.html     # Шаблон
├── user-card.component.css      # Стили
└── user-card.component.spec.ts  # Тесты
```

### Вручную

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css']
})
export class UserCardComponent {
  name = 'Алексей';
  age = 28;
}
```

## Декоратор @Component

Декоратор `@Component` принимает объект метаданных:

```typescript
@Component({
  // Обязательные
  selector: 'app-user-card',        // CSS-селектор для использования в шаблонах

  // Шаблон (один из двух)
  template: `<h1>Inline шаблон</h1>`,   // Inline-шаблон
  templateUrl: './user.component.html',   // Внешний файл шаблона

  // Стили (один из двух)
  styles: [`h1 { color: red; }`],         // Inline-стили
  styleUrls: ['./user.component.css'],    // Внешние файлы стилей

  // Дополнительные
  standalone: true,                        // Standalone компонент (Angular 14+)
  imports: [CommonModule],                 // Импорты для standalone
  changeDetection: ChangeDetectionStrategy.OnPush,  // Стратегия обнаружения изменений
  encapsulation: ViewEncapsulation.Emulated,         // Инкапсуляция стилей
  providers: [UserService],                // Провайдеры DI для компонента
})
```

### Типы селекторов

```typescript
// Селектор элемента (самый частый)
selector: 'app-user-card'
// Использование: <app-user-card></app-user-card>

// Селектор атрибута
selector: '[appHighlight]'
// Использование: <div appHighlight></div>

// Селектор класса
selector: '.app-widget'
// Использование: <div class="app-widget"></div>
```

## Шаблоны

### Интерполяция

```html
<h1>{{ title }}</h1>
<p>Сумма: {{ 2 + 3 }}</p>
<p>Имя: {{ user.name.toUpperCase() }}</p>
```

### Property binding (привязка свойств)

```html
<!-- Привязка к свойству DOM -->
<img [src]="imageUrl" [alt]="imageAlt">

<!-- Привязка к атрибуту -->
<td [attr.colspan]="columnSpan">Ячейка</td>

<!-- Привязка к классу -->
<div [class.active]="isActive">Элемент</div>

<!-- Привязка к стилю -->
<div [style.color]="textColor">Текст</div>
```

### Event binding (привязка событий)

```html
<button (click)="onClick()">Нажми</button>
<input (input)="onInput($event)">
<form (submit)="onSubmit()">...</form>
```

```typescript
export class MyComponent {
  onClick(): void {
    console.log('Кнопка нажата');
  }

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    console.log(value);
  }
}
```

### Two-way binding (двусторонняя привязка)

```html
<!-- Требует FormsModule -->
<input [(ngModel)]="username">
<p>Привет, {{ username }}!</p>
```

Это синтаксический сахар для:

```html
<input [ngModel]="username" (ngModelChange)="username = $event">
```

## Взаимодействие компонентов

### @Input() — передача данных от родителя к потомку

```typescript
// child.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-child',
  template: `<p>Привет, {{ name }}! Возраст: {{ age }}</p>`
})
export class ChildComponent {
  @Input() name: string = '';
  @Input() age: number = 0;
}
```

```html
<!-- parent.component.html -->
<app-child [name]="'Анна'" [age]="25"></app-child>
<app-child [name]="userName" [age]="userAge"></app-child>
```

#### Input с трансформацией (Angular 16+)

```typescript
import { Component, Input, numberAttribute, booleanAttribute } from '@angular/core';

@Component({ selector: 'app-item' })
export class ItemComponent {
  @Input({ required: true }) title!: string;
  @Input({ transform: numberAttribute }) count: number = 0;
  @Input({ transform: booleanAttribute }) disabled: boolean = false;
}
```

```html
<app-item title="Товар" count="5" disabled></app-item>
```

### @Output() — передача событий от потомка к родителю

```typescript
// child.component.ts
import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-child',
  template: `
    <button (click)="sendMessage()">Отправить</button>
  `
})
export class ChildComponent {
  @Output() messageEvent = new EventEmitter<string>();

  sendMessage(): void {
    this.messageEvent.emit('Привет от дочернего компонента!');
  }
}
```

```html
<!-- parent.component.html -->
<app-child (messageEvent)="receiveMessage($event)"></app-child>
<p>{{ message }}</p>
```

```typescript
// parent.component.ts
export class ParentComponent {
  message = '';

  receiveMessage(msg: string): void {
    this.message = msg;
  }
}
```

### @ViewChild() — доступ к дочернему компоненту

```typescript
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { ChildComponent } from './child.component';

@Component({
  selector: 'app-parent',
  template: `<app-child></app-child>`
})
export class ParentComponent implements AfterViewInit {
  @ViewChild(ChildComponent) child!: ChildComponent;

  ngAfterViewInit(): void {
    console.log(this.child.name); // Доступ к свойствам потомка
  }
}
```

### @ContentChild() и ng-content — проекция содержимого

```typescript
// card.component.ts
@Component({
  selector: 'app-card',
  template: `
    <div class="card">
      <div class="card-header">
        <ng-content select="[header]"></ng-content>
      </div>
      <div class="card-body">
        <ng-content></ng-content>
      </div>
      <div class="card-footer">
        <ng-content select="[footer]"></ng-content>
      </div>
    </div>
  `
})
export class CardComponent {}
```

```html
<!-- Использование -->
<app-card>
  <h2 header>Заголовок карточки</h2>
  <p>Основное содержимое карточки</p>
  <button footer>Подробнее</button>
</app-card>
```

## Жизненный цикл компонента

Angular вызывает хуки жизненного цикла в определённом порядке:

```typescript
import {
  Component, OnInit, OnChanges, DoCheck,
  AfterContentInit, AfterContentChecked,
  AfterViewInit, AfterViewChecked,
  OnDestroy, SimpleChanges, Input
} from '@angular/core';

@Component({ selector: 'app-lifecycle' })
export class LifecycleComponent implements
  OnChanges, OnInit, DoCheck,
  AfterContentInit, AfterContentChecked,
  AfterViewInit, AfterViewChecked,
  OnDestroy
{
  @Input() data: string = '';

  // 1. Вызывается при изменении @Input свойств
  ngOnChanges(changes: SimpleChanges): void {
    console.log('ngOnChanges', changes);
  }

  // 2. Вызывается один раз после первого ngOnChanges
  ngOnInit(): void {
    console.log('ngOnInit — инициализация компонента');
  }

  // 3. Вызывается при каждой проверке изменений
  ngDoCheck(): void {
    console.log('ngDoCheck');
  }

  // 4. После проекции контента (ng-content)
  ngAfterContentInit(): void {
    console.log('ngAfterContentInit');
  }

  // 5. После каждой проверки проецированного контента
  ngAfterContentChecked(): void {
    console.log('ngAfterContentChecked');
  }

  // 6. После инициализации представления компонента
  ngAfterViewInit(): void {
    console.log('ngAfterViewInit');
  }

  // 7. После каждой проверки представления
  ngAfterViewChecked(): void {
    console.log('ngAfterViewChecked');
  }

  // 8. Перед уничтожением компонента
  ngOnDestroy(): void {
    console.log('ngOnDestroy — очистка ресурсов');
  }
}
```

### Порядок вызова

```
constructor()
  → ngOnChanges()     (если есть @Input)
  → ngOnInit()
  → ngDoCheck()
  → ngAfterContentInit()
  → ngAfterContentChecked()
  → ngAfterViewInit()
  → ngAfterViewChecked()

При изменениях:
  → ngOnChanges()
  → ngDoCheck()
  → ngAfterContentChecked()
  → ngAfterViewChecked()

При уничтожении:
  → ngOnDestroy()
```

### Наиболее используемые хуки

| Хук | Когда использовать |
|---|---|
| `ngOnInit` | Инициализация данных, HTTP-запросы, подписки |
| `ngOnChanges` | Реакция на изменение входных данных (@Input) |
| `ngOnDestroy` | Отписка от Observable, очистка таймеров |
| `ngAfterViewInit` | Работа с DOM, доступ к @ViewChild |

## Инкапсуляция стилей

```typescript
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-styled',
  template: `<p>Стилизованный текст</p>`,
  styles: [`p { color: blue; }`],
  encapsulation: ViewEncapsulation.Emulated  // по умолчанию
})
export class StyledComponent {}
```

| Режим | Описание |
|---|---|
| `Emulated` | (по умолчанию) Эмуляция Shadow DOM через атрибуты |
| `ShadowDom` | Настоящий Shadow DOM браузера |
| `None` | Стили глобальные, без инкапсуляции |

## Пример: карточка пользователя

```typescript
// user-card.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';

interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  isOnline: boolean;
}

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css']
})
export class UserCardComponent {
  @Input() user!: User;
  @Output() select = new EventEmitter<User>();
  @Output() delete = new EventEmitter<number>();

  onSelect(): void {
    this.select.emit(this.user);
  }

  onDelete(): void {
    this.delete.emit(this.user.id);
  }
}
```

```html
<!-- user-card.component.html -->
<div class="card" [class.online]="user.isOnline">
  <img [src]="user.avatar" [alt]="user.name" class="avatar">
  <div class="info">
    <h3>{{ user.name }}</h3>
    <p>{{ user.email }}</p>
    <span class="status">
      {{ user.isOnline ? 'В сети' : 'Не в сети' }}
    </span>
  </div>
  <div class="actions">
    <button (click)="onSelect()">Выбрать</button>
    <button (click)="onDelete()" class="danger">Удалить</button>
  </div>
</div>
```

```css
/* user-card.component.css */
.card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  transition: box-shadow 0.2s;
}

.card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card.online {
  border-left: 4px solid #4caf50;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}

.status {
  font-size: 12px;
  color: #757575;
}

.danger {
  color: #f44336;
}
```

```html
<!-- Использование в родительском компоненте -->
<app-user-card
  *ngFor="let user of users"
  [user]="user"
  (select)="onUserSelect($event)"
  (delete)="onUserDelete($event)"
></app-user-card>
```
