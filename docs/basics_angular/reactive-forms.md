---
title: Reactive Forms в Angular
description: Реактивные формы Angular — FormControl, FormGroup, FormArray, FormBuilder
---

# Reactive Forms

Реактивные формы в Angular создаются программно в классе компонента. Они дают полный контроль над состоянием формы, валидацией и обработкой данных.

## Подключение

```typescript
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [ReactiveFormsModule]
})
export class AppModule {}
```

## 1. FormControl

`FormControl` — базовый элемент, представляющий одно поле ввода.

```typescript
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-name',
  template: `
    <input [formControl]="name">
    <p>Значение: {{ name.value }}</p>
    <p>Валидно: {{ name.valid }}</p>
  `
})
export class NameComponent {
  name = new FormControl('начальное значение');

  ngOnInit() {
    // Программное изменение значения
    this.name.setValue('Новое значение');

    // Подписка на изменения
    this.name.valueChanges.subscribe(value => {
      console.log('Изменение:', value);
    });
  }
}
```

### Методы FormControl

| Метод | Описание |
|-------|---------|
| `setValue(value)` | Устанавливает значение |
| `patchValue(value)` | Устанавливает значение (без строгой проверки) |
| `reset()` | Сбрасывает значение и состояние |
| `disable()` / `enable()` | Отключает / включает поле |
| `markAsTouched()` | Помечает как «тронутое» |
| `markAsDirty()` | Помечает как «изменённое» |

### Свойства FormControl

| Свойство | Тип | Описание |
|----------|-----|---------|
| `value` | `any` | Текущее значение |
| `valid` | `boolean` | Все валидаторы прошли |
| `invalid` | `boolean` | Есть ошибки валидации |
| `pristine` | `boolean` | Значение не менялось |
| `dirty` | `boolean` | Значение изменено |
| `touched` | `boolean` | Поле получало фокус |
| `untouched` | `boolean` | Поле не получало фокус |
| `errors` | `object \| null` | Объект ошибок валидации |
| `status` | `string` | `'VALID'`, `'INVALID'`, `'PENDING'`, `'DISABLED'` |

## 2. FormGroup

`FormGroup` объединяет несколько `FormControl` в одну группу.

```typescript
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  template: `
    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
      <div>
        <label>Email:</label>
        <input formControlName="email" type="email">
        <span *ngIf="loginForm.get('email')?.errors?.['required']">
          Email обязателен
        </span>
      </div>

      <div>
        <label>Пароль:</label>
        <input formControlName="password" type="password">
      </div>

      <label>
        <input formControlName="rememberMe" type="checkbox">
        Запомнить меня
      </label>

      <button type="submit" [disabled]="loginForm.invalid">Войти</button>
    </form>

    <pre>{{ loginForm.value | json }}</pre>
  `
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    rememberMe: new FormControl(false)
  });

  onSubmit() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      // { email: '...', password: '...', rememberMe: true/false }
    }
  }
}
```

### Вложенные группы

```typescript
@Component({
  selector: 'app-profile',
  template: `
    <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
      <input formControlName="firstName">
      <input formControlName="lastName">

      <div formGroupName="address">
        <input formControlName="city">
        <input formControlName="street">
        <input formControlName="zip">
      </div>

      <button type="submit">Сохранить</button>
    </form>
  `
})
export class ProfileComponent {
  profileForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    address: new FormGroup({
      city: new FormControl(''),
      street: new FormControl(''),
      zip: new FormControl('')
    })
  });

  onSubmit() {
    console.log(this.profileForm.value);
    // { firstName: '', lastName: '', address: { city: '', street: '', zip: '' } }
  }
}
```

## 3. FormArray

`FormArray` — динамический массив контролов.

```typescript
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-skills',
  template: `
    <form [formGroup]="profileForm">
      <label>Имя:</label>
      <input formControlName="name">

      <h3>Навыки:</h3>
      <div formArrayName="skills">
        <div *ngFor="let skill of skills.controls; let i = index">
          <input [formControlName]="i">
          <button (click)="removeSkill(i)">Удалить</button>
        </div>
      </div>

      <button (click)="addSkill()">Добавить навык</button>
    </form>
  `
})
export class SkillsComponent {
  profileForm = new FormGroup({
    name: new FormControl(''),
    skills: new FormArray([
      new FormControl('Angular'),
      new FormControl('TypeScript')
    ])
  });

  get skills() {
    return this.profileForm.get('skills') as FormArray;
  }

  addSkill() {
    this.skills.push(new FormControl(''));
  }

  removeSkill(index: number) {
    this.skills.removeAt(index);
  }
}
```

### FormArray с FormGroup

```typescript
@Component({
  selector: 'app-contacts',
  template: `
    <form [formGroup]="form">
      <div formArrayName="contacts">
        <div *ngFor="let contact of contacts.controls; let i = index"
             [formGroupName]="i">
          <input formControlName="type" placeholder="Тип">
          <input formControlName="value" placeholder="Значение">
          <button (click)="removeContact(i)">X</button>
        </div>
      </div>
      <button (click)="addContact()">Добавить контакт</button>
    </form>
  `
})
export class ContactsComponent {
  form = new FormGroup({
    contacts: new FormArray<FormGroup>([])
  });

  get contacts() {
    return this.form.get('contacts') as FormArray;
  }

  addContact() {
    this.contacts.push(new FormGroup({
      type: new FormControl('email'),
      value: new FormControl('')
    }));
  }

  removeContact(index: number) {
    this.contacts.removeAt(index);
  }
}
```

## 4. FormBuilder

`FormBuilder` — сервис для сокращённого создания форм.

```typescript
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  template: `
    <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
      <input formControlName="name" placeholder="Имя">
      <input formControlName="email" placeholder="Email">
      <input formControlName="password" type="password" placeholder="Пароль">

      <div formGroupName="address">
        <input formControlName="city" placeholder="Город">
        <input formControlName="zip" placeholder="Индекс">
      </div>

      <div formArrayName="phones">
        <div *ngFor="let phone of phones.controls; let i = index">
          <input [formControlName]="i" placeholder="Телефон">
        </div>
      </div>
      <button type="button" (click)="addPhone()">Добавить телефон</button>

      <button type="submit" [disabled]="registerForm.invalid">
        Зарегистрироваться
      </button>
    </form>
  `
})
export class RegisterComponent {
  registerForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    address: this.fb.group({
      city: [''],
      zip: ['']
    }),
    phones: this.fb.array([''])
  });

  constructor(private fb: FormBuilder) {}

  get phones() {
    return this.registerForm.get('phones') as FormArray;
  }

  addPhone() {
    this.phones.push(this.fb.control(''));
  }

  onSubmit() {
    console.log(this.registerForm.value);
  }
}
```

## 5. setValue vs patchValue

```typescript
// setValue — требует ВСЕ поля
this.profileForm.setValue({
  firstName: 'Иван',
  lastName: 'Петров',
  address: { city: 'Москва', street: 'Тверская', zip: '101000' }
});

// patchValue — обновляет только указанные поля
this.profileForm.patchValue({
  firstName: 'Иван'
  // остальные поля не изменятся
});
```

## 6. Подписка на изменения

```typescript
// Подписка на значение всей формы
this.loginForm.valueChanges.subscribe(value => {
  console.log('Форма:', value);
});

// Подписка на статус формы
this.loginForm.statusChanges.subscribe(status => {
  console.log('Статус:', status); // 'VALID' | 'INVALID' | 'PENDING'
});

// Подписка на конкретное поле
this.loginForm.get('email')?.valueChanges.subscribe(value => {
  console.log('Email:', value);
});
```

## Сравнение подходов

| Критерий | FormControl/FormGroup | FormBuilder |
|----------|----------------------|-------------|
| Синтаксис | Явный, verbose | Краткий |
| Читаемость | Понятнее для простых форм | Лучше для сложных форм |
| Гибкость | Одинаковая | Одинаковая |
| Рекомендация | Маленькие формы | Средние и большие формы |
