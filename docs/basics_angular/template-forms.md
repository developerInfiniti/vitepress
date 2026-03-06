---
title: Template-driven Forms в Angular
description: Формы на основе шаблонов — ngForm, ngModel, обработка отправки
---

# Template-driven Forms

Template-driven формы создаются декларативно в шаблоне с помощью директив. Angular автоматически генерирует модель формы на основе HTML.

## Подключение

```typescript
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [FormsModule]
})
export class AppModule {}
```

## 1. Базовая форма

```typescript
@Component({
  selector: 'app-login',
  template: `
    <form #loginForm="ngForm" (ngSubmit)="onSubmit(loginForm)">
      <div>
        <label>Email:</label>
        <input name="email"
               [(ngModel)]="user.email"
               required
               email
               #emailField="ngModel">
        <div *ngIf="emailField.invalid && emailField.touched">
          <small *ngIf="emailField.errors?.['required']">Email обязателен</small>
          <small *ngIf="emailField.errors?.['email']">Неверный формат email</small>
        </div>
      </div>

      <div>
        <label>Пароль:</label>
        <input name="password"
               type="password"
               [(ngModel)]="user.password"
               required
               minlength="6"
               #passwordField="ngModel">
        <div *ngIf="passwordField.invalid && passwordField.touched">
          <small *ngIf="passwordField.errors?.['required']">Пароль обязателен</small>
          <small *ngIf="passwordField.errors?.['minlength']">
            Минимум {{ passwordField.errors?.['minlength'].requiredLength }} символов
          </small>
        </div>
      </div>

      <button type="submit" [disabled]="loginForm.invalid">Войти</button>
    </form>

    <pre>Форма валидна: {{ loginForm.valid }}</pre>
    <pre>{{ loginForm.value | json }}</pre>
  `
})
export class LoginComponent {
  user = {
    email: '',
    password: ''
  };

  onSubmit(form: NgForm) {
    if (form.valid) {
      console.log('Данные формы:', form.value);
    }
  }
}
```

## 2. ngForm и ngModel

### ngForm

Angular автоматически создаёт директиву `ngForm` для каждого тега `<form>`. Она предоставляет:

```html
<form #myForm="ngForm">
  <!-- myForm.valid — форма валидна -->
  <!-- myForm.invalid — есть ошибки -->
  <!-- myForm.value — объект со всеми значениями -->
  <!-- myForm.dirty — данные менялись -->
  <!-- myForm.submitted — форма отправлена -->
</form>
```

### ngModel

Каждый элемент с `ngModel` и атрибутом `name` автоматически регистрируется в форме:

```html
<form #f="ngForm">
  <!-- Обязательно указать name -->
  <input name="firstName" [(ngModel)]="model.firstName">
  <input name="lastName" [(ngModel)]="model.lastName">

  <!-- Доступ к значениям -->
  <pre>{{ f.value | json }}</pre>
  <!-- { "firstName": "...", "lastName": "..." } -->
</form>
```

### Три режима ngModel

```html
<!-- 1. Двусторонняя привязка -->
<input [(ngModel)]="name" name="name">

<!-- 2. Одностороняя привязка (только чтение из модели) -->
<input [ngModel]="name" name="name">

<!-- 3. Без привязки (значение только в форме) -->
<input ngModel name="name">
```

## 3. Группировка полей (ngModelGroup)

```html
<form #f="ngForm" (ngSubmit)="onSubmit(f)">
  <div ngModelGroup="personalInfo" #personalGroup="ngModelGroup">
    <h3>Личная информация</h3>
    <input name="firstName" [(ngModel)]="model.firstName" required>
    <input name="lastName" [(ngModel)]="model.lastName" required>
    <p *ngIf="personalGroup.invalid">Заполните все поля</p>
  </div>

  <div ngModelGroup="address">
    <h3>Адрес</h3>
    <input name="city" [(ngModel)]="model.city">
    <input name="street" [(ngModel)]="model.street">
  </div>

  <button type="submit">Сохранить</button>
</form>

<!-- Результат f.value:
{
  personalInfo: { firstName: '', lastName: '' },
  address: { city: '', street: '' }
}
-->
```

## 4. Элементы формы

### Select

```html
<select name="role" [(ngModel)]="user.role" required>
  <option value="">-- Выберите роль --</option>
  <option *ngFor="let role of roles" [value]="role.id">
    {{ role.name }}
  </option>
</select>
```

```typescript
roles = [
  { id: 'admin', name: 'Администратор' },
  { id: 'user', name: 'Пользователь' },
  { id: 'guest', name: 'Гость' }
];
```

### Select с объектами (ngValue)

```html
<select name="city" [(ngModel)]="selectedCity">
  <option *ngFor="let city of cities" [ngValue]="city">
    {{ city.name }}
  </option>
</select>

<!-- selectedCity будет объектом { id: 1, name: 'Москва' }, а не строкой -->
```

### Checkbox

```html
<label>
  <input type="checkbox" name="agree" [(ngModel)]="user.agree" required>
  Я согласен с условиями
</label>
```

### Radio

```html
<label>
  <input type="radio" name="gender" [(ngModel)]="user.gender" value="male">
  Мужской
</label>
<label>
  <input type="radio" name="gender" [(ngModel)]="user.gender" value="female">
  Женский
</label>
```

### Textarea

```html
<textarea name="bio"
          [(ngModel)]="user.bio"
          maxlength="500"
          rows="4">
</textarea>
<small>{{ user.bio.length }}/500</small>
```

## 5. CSS-классы состояния

Angular автоматически добавляет CSS-классы к элементам формы:

| Состояние | true | false |
|-----------|------|-------|
| Посещён | `ng-touched` | `ng-untouched` |
| Изменён | `ng-dirty` | `ng-pristine` |
| Валиден | `ng-valid` | `ng-invalid` |

```css
input.ng-invalid.ng-touched {
  border: 2px solid red;
}

input.ng-valid.ng-touched {
  border: 2px solid green;
}
```

## 6. Сброс формы

```html
<form #f="ngForm" (ngSubmit)="onSubmit(f)">
  <!-- поля формы -->
  <button type="submit">Отправить</button>
  <button type="button" (click)="f.resetForm()">Сбросить</button>
</form>
```

```typescript
onSubmit(form: NgForm) {
  if (form.valid) {
    console.log(form.value);
    // Сброс формы после отправки
    form.resetForm();
  }
}
```

## Reactive Forms vs Template-driven Forms

| Критерий | Reactive Forms | Template-driven Forms |
|----------|---------------|----------------------|
| Модель формы | В классе компонента | В шаблоне |
| Импорт | `ReactiveFormsModule` | `FormsModule` |
| Привязка данных | Явная, синхронная | Неявная через `ngModel` |
| Валидация | Функции в классе | Директивы в шаблоне |
| Тестирование | Простое (без DOM) | Требует рендеринга |
| Динамические поля | Легко (`FormArray`) | Сложно |
| Сложные формы | Рекомендуется | Не рекомендуется |
| Простые формы | Избыточно | Идеально |
