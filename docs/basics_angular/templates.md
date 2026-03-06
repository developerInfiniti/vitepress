---
title: Шаблоны Angular
description: Основы шаблонов Angular — интерполяция, привязки свойств и событий, двусторонняя привязка
---

# Шаблоны и привязки в Angular (Templates & Binding)

Angular использует HTML-шаблоны с расширенным синтаксисом для связывания данных компонента с DOM.

## 1. Интерполяция `{{ }}`

Интерполяция позволяет вставлять значения выражений в текст шаблона.

```html
<h1>{{ title }}</h1>
<p>Сумма: {{ 2 + 3 }}</p>
<span>Привет, {{ user.name.toUpperCase() }}!</span>
```

```typescript
@Component({
  selector: 'app-greeting',
  template: `
    <h1>{{ title }}</h1>
    <p>Сегодня: {{ currentDate }}</p>
    <p>Длина имени: {{ name.length }}</p>
  `
})
export class GreetingComponent {
  title = 'Добро пожаловать';
  name = 'Angular';
  currentDate = new Date().toLocaleDateString();
}
```

### Что можно использовать в интерполяции

| Можно | Нельзя |
|-------|--------|
| Свойства компонента | Присваивание (`=`, `+=`) |
| Вызовы методов | `new`, `typeof`, `instanceof` |
| Математические операции | Цепочки выражений (`;`) |
| Тернарный оператор | Инкремент/декремент (`++`, `--`) |
| Пайпы (`\| pipe`) | Побочные эффекты |

## 2. Property Binding `[property]`

Привязка свойств связывает свойство DOM-элемента или директивы с выражением компонента.

```html
<!-- Привязка атрибута -->
<img [src]="imageUrl" [alt]="imageAlt">

<!-- Привязка свойства disabled -->
<button [disabled]="isLoading">Отправить</button>

<!-- Привязка CSS-класса -->
<div [class.active]="isActive">Элемент</div>

<!-- Привязка стиля -->
<p [style.color]="textColor">Цветной текст</p>
<div [style.width.px]="boxWidth">Блок</div>
```

```typescript
@Component({
  selector: 'app-profile',
  template: `
    <img [src]="avatarUrl" [alt]="userName">
    <button [disabled]="!isFormValid">Сохранить</button>
    <div [class.highlight]="isSelected" [style.fontSize.px]="fontSize">
      {{ userName }}
    </div>
  `
})
export class ProfileComponent {
  avatarUrl = '/assets/avatar.png';
  userName = 'Иван';
  isFormValid = false;
  isSelected = true;
  fontSize = 16;
}
```

### Интерполяция vs Property Binding

```html
<!-- Эти записи эквивалентны для строковых значений -->
<img src="{{ imageUrl }}">
<img [src]="imageUrl">

<!-- Для НЕ строковых значений используйте property binding -->
<button [disabled]="isDisabled">OK</button>  <!-- Правильно -->
<button disabled="{{ isDisabled }}">OK</button>  <!-- Неправильно! -->
```

## 3. Event Binding `(event)`

Привязка событий позволяет реагировать на действия пользователя.

```html
<!-- Клик -->
<button (click)="onClick()">Нажми</button>

<!-- Событие ввода -->
<input (input)="onInput($event)">

<!-- Нажатие клавиши -->
<input (keyup.enter)="onSubmit()">

<!-- Событие мыши -->
<div (mouseenter)="onHover()" (mouseleave)="onLeave()">
  Наведи курсор
</div>
```

```typescript
@Component({
  selector: 'app-counter',
  template: `
    <p>Счётчик: {{ count }}</p>
    <button (click)="increment()">+1</button>
    <button (click)="decrement()">-1</button>
    <input (input)="onInput($event)" [value]="message">
    <p>{{ message }}</p>
  `
})
export class CounterComponent {
  count = 0;
  message = '';

  increment() {
    this.count++;
  }

  decrement() {
    this.count--;
  }

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.message = input.value;
  }
}
```

### Объект `$event`

`$event` передаёт оригинальное событие DOM в обработчик:

```html
<input (keyup)="onKey($event)">
```

```typescript
onKey(event: KeyboardEvent) {
  console.log('Нажата клавиша:', event.key);
}
```

### Фильтры клавиш

```html
<input (keyup.enter)="onEnter()">
<input (keydown.escape)="onEscape()">
<input (keyup.shift.alt.t)="onShortcut()">
```

## 4. Two-way Binding `[(ngModel)]`

Двусторонняя привязка синхронизирует данные между компонентом и шаблоном в обе стороны.

### Подключение FormsModule

```typescript
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [FormsModule]
})
export class AppModule {}
```

### Использование

```html
<input [(ngModel)]="name">
<p>Привет, {{ name }}!</p>
```

```typescript
@Component({
  selector: 'app-form',
  template: `
    <div>
      <label>Имя:</label>
      <input [(ngModel)]="user.name">

      <label>Email:</label>
      <input [(ngModel)]="user.email" type="email">

      <label>Роль:</label>
      <select [(ngModel)]="user.role">
        <option value="admin">Админ</option>
        <option value="user">Пользователь</option>
        <option value="guest">Гость</option>
      </select>

      <label>
        <input type="checkbox" [(ngModel)]="user.active">
        Активен
      </label>

      <pre>{{ user | json }}</pre>
    </div>
  `
})
export class FormComponent {
  user = {
    name: '',
    email: '',
    role: 'user',
    active: true
  };
}
```

### Как работает `[(ngModel)]` под капотом

`[(ngModel)]` — это синтаксический сахар, который объединяет property binding и event binding:

```html
<!-- Сокращённая запись -->
<input [(ngModel)]="name">

<!-- Полная запись (эквивалент) -->
<input [ngModel]="name" (ngModelChange)="name = $event">
```

### Двусторонняя привязка в своих компонентах

```typescript
@Component({
  selector: 'app-sizer',
  template: `
    <button (click)="decrease()">-</button>
    <span>{{ size }}</span>
    <button (click)="increase()">+</button>
  `
})
export class SizerComponent {
  @Input() size = 14;
  @Output() sizeChange = new EventEmitter<number>();

  decrease() {
    this.size--;
    this.sizeChange.emit(this.size);
  }

  increase() {
    this.size++;
    this.sizeChange.emit(this.size);
  }
}
```

```html
<!-- Использование с двусторонней привязкой -->
<app-sizer [(size)]="fontSize"></app-sizer>
<p [style.fontSize.px]="fontSize">Текст с изменяемым размером</p>
```

## 5. Template Variables `#ref`

Шаблонные переменные дают доступ к DOM-элементу или экземпляру директивы/компонента прямо в шаблоне.

```html
<!-- Ссылка на DOM-элемент -->
<input #nameInput type="text">
<button (click)="greet(nameInput.value)">Привет</button>

<!-- Ссылка на компонент -->
<app-timer #timer></app-timer>
<button (click)="timer.start()">Старт</button>
<button (click)="timer.stop()">Стоп</button>
```

```typescript
@Component({
  selector: 'app-search',
  template: `
    <input #searchBox
           (keyup.enter)="search(searchBox.value)"
           placeholder="Поиск...">
    <button (click)="search(searchBox.value)">Найти</button>
    <button (click)="searchBox.focus()">Фокус</button>
  `
})
export class SearchComponent {
  search(query: string) {
    console.log('Поиск:', query);
  }
}
```

### ViewChild для доступа из компонента

```typescript
@Component({
  selector: 'app-example',
  template: `<input #myInput type="text">`
})
export class ExampleComponent implements AfterViewInit {
  @ViewChild('myInput') inputRef!: ElementRef;

  ngAfterViewInit() {
    this.inputRef.nativeElement.focus();
  }
}
```

## Сводная таблица синтаксиса

| Тип | Синтаксис | Направление данных |
|-----|-----------|-------------------|
| Интерполяция | `{{ expression }}` | Компонент → DOM |
| Property binding | `[property]="expression"` | Компонент → DOM |
| Event binding | `(event)="handler()"` | DOM → Компонент |
| Two-way binding | `[(ngModel)]="property"` | Компонент ↔ DOM |
| Template variable | `#ref` | Доступ в шаблоне |
