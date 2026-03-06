---
title: Валидация форм в Angular
description: Встроенные и пользовательские валидаторы, асинхронная валидация, динамические формы
---

# Валидация форм в Angular

## 1. Встроенные валидаторы

### В Reactive Forms

```typescript
import { Validators } from '@angular/forms';

this.form = this.fb.group({
  name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
  email: ['', [Validators.required, Validators.email]],
  age: [null, [Validators.required, Validators.min(18), Validators.max(120)]],
  website: ['', Validators.pattern(/^https?:\/\/.+/)],
});
```

### В Template-driven Forms

```html
<input name="name"
       [(ngModel)]="user.name"
       required
       minlength="2"
       maxlength="50">

<input name="email"
       [(ngModel)]="user.email"
       required
       email>

<input name="age"
       [(ngModel)]="user.age"
       required
       type="number"
       min="18"
       max="120">

<input name="website"
       [(ngModel)]="user.website"
       pattern="^https?://.+">
```

### Список встроенных валидаторов

| Валидатор | Reactive | Template | Описание |
|-----------|----------|----------|---------|
| `required` | `Validators.required` | `required` | Поле обязательно |
| `requiredTrue` | `Validators.requiredTrue` | — | Значение должно быть `true` |
| `email` | `Validators.email` | `email` | Формат email |
| `minLength` | `Validators.minLength(n)` | `minlength="n"` | Минимальная длина строки |
| `maxLength` | `Validators.maxLength(n)` | `maxlength="n"` | Максимальная длина строки |
| `min` | `Validators.min(n)` | `min="n"` | Минимальное числовое значение |
| `max` | `Validators.max(n)` | `max="n"` | Максимальное числовое значение |
| `pattern` | `Validators.pattern(regex)` | `pattern="regex"` | Соответствие регулярному выражению |

## 2. Отображение ошибок

### Reactive Forms

```typescript
@Component({
  selector: 'app-register',
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <div>
        <label>Email:</label>
        <input formControlName="email">
        <div *ngIf="form.get('email')?.invalid && form.get('email')?.touched"
             class="error">
          <small *ngIf="form.get('email')?.hasError('required')">
            Email обязателен
          </small>
          <small *ngIf="form.get('email')?.hasError('email')">
            Неверный формат email
          </small>
        </div>
      </div>

      <div>
        <label>Пароль:</label>
        <input formControlName="password" type="password">
        <div *ngIf="form.get('password')?.invalid && form.get('password')?.touched"
             class="error">
          <small *ngIf="form.get('password')?.hasError('required')">
            Пароль обязателен
          </small>
          <small *ngIf="form.get('password')?.hasError('minlength')">
            Минимум {{ form.get('password')?.getError('minlength').requiredLength }} символов
            (сейчас {{ form.get('password')?.getError('minlength').actualLength }})
          </small>
        </div>
      </div>

      <button [disabled]="form.invalid">Зарегистрироваться</button>
    </form>
  `
})
export class RegisterComponent {
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  constructor(private fb: FormBuilder) {}

  // Удобный геттер для сокращения шаблона
  get email() { return this.form.get('email'); }
  get password() { return this.form.get('password'); }

  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.value);
    } else {
      // Пометить все поля как touched для показа ошибок
      this.form.markAllAsTouched();
    }
  }
}
```

## 3. Custom Validators

### Синхронный валидатор

```typescript
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Функция-фабрика валидатора
export function forbiddenNameValidator(forbidden: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isForbidden = control.value === forbidden;
    return isForbidden ? { forbiddenName: { value: control.value } } : null;
  };
}

// Простой валидатор без параметров
export function noWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
  const hasWhitespace = (control.value || '').trim().length === 0;
  return hasWhitespace ? { whitespace: true } : null;
}
```

### Использование

```typescript
this.form = this.fb.group({
  username: ['', [Validators.required, forbiddenNameValidator('admin'), noWhitespaceValidator]],
});
```

```html
<div *ngIf="form.get('username')?.hasError('forbiddenName')">
  Имя "{{ form.get('username')?.getError('forbiddenName').value }}" запрещено
</div>
<div *ngIf="form.get('username')?.hasError('whitespace')">
  Имя не может быть пустым
</div>
```

### Валидатор-директива (для template-driven форм)

```typescript
@Directive({
  selector: '[appForbiddenName]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: ForbiddenNameDirective,
    multi: true
  }]
})
export class ForbiddenNameDirective implements Validator {
  @Input('appForbiddenName') forbiddenName = '';

  validate(control: AbstractControl): ValidationErrors | null {
    return this.forbiddenName
      ? forbiddenNameValidator(this.forbiddenName)(control)
      : null;
  }
}
```

```html
<input name="username"
       [(ngModel)]="user.name"
       appForbiddenName="admin">
```

### Cross-field валидатор (валидация группы)

```typescript
export function passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return password === confirm ? null : { passwordMismatch: true };
}
```

```typescript
this.form = this.fb.group({
  password: ['', [Validators.required, Validators.minLength(8)]],
  confirmPassword: ['', Validators.required]
}, {
  validators: passwordMatchValidator
});
```

```html
<div *ngIf="form.hasError('passwordMismatch')">
  Пароли не совпадают
</div>
```

## 4. Async Validators

Асинхронные валидаторы используются для проверок, требующих обращения к серверу (уникальность email, логина и т.д.).

```typescript
import { AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UsernameValidator {
  constructor(private userService: UserService) {}

  usernameExists(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }

      // debounce 300ms перед запросом
      return timer(300).pipe(
        switchMap(() => this.userService.checkUsername(control.value)),
        map(exists => exists ? { usernameTaken: true } : null),
        catchError(() => of(null))
      );
    };
  }
}
```

### Использование

```typescript
@Component({ /* ... */ })
export class RegisterComponent {
  form = this.fb.group({
    username: ['',
      [Validators.required, Validators.minLength(3)],  // синхронные
      [this.usernameValidator.usernameExists()]          // асинхронные
    ]
  });

  constructor(
    private fb: FormBuilder,
    private usernameValidator: UsernameValidator
  ) {}
}
```

```html
<input formControlName="username">
<div *ngIf="form.get('username')?.pending">Проверка...</div>
<div *ngIf="form.get('username')?.hasError('usernameTaken')">
  Это имя уже занято
</div>
```

### Статус `PENDING`

Пока асинхронный валидатор работает, поле имеет статус `PENDING`:

```html
<button [disabled]="form.invalid || form.pending">Отправить</button>
```

## 5. Dynamic Forms

Динамическое создание формы на основе конфигурации.

```typescript
interface FormFieldConfig {
  key: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'select' | 'checkbox';
  required?: boolean;
  options?: { value: string; label: string }[];
}

@Component({
  selector: 'app-dynamic-form',
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <div *ngFor="let field of fields">
        <label>{{ field.label }}:</label>

        <ng-container [ngSwitch]="field.type">
          <input *ngSwitchCase="'text'"
                 [formControlName]="field.key"
                 type="text">

          <input *ngSwitchCase="'email'"
                 [formControlName]="field.key"
                 type="email">

          <input *ngSwitchCase="'number'"
                 [formControlName]="field.key"
                 type="number">

          <select *ngSwitchCase="'select'" [formControlName]="field.key">
            <option value="">-- Выберите --</option>
            <option *ngFor="let opt of field.options" [value]="opt.value">
              {{ opt.label }}
            </option>
          </select>

          <label *ngSwitchCase="'checkbox'">
            <input type="checkbox" [formControlName]="field.key">
          </label>
        </ng-container>

        <div *ngIf="form.get(field.key)?.invalid && form.get(field.key)?.touched"
             class="error">
          Поле обязательно
        </div>
      </div>

      <button type="submit" [disabled]="form.invalid">Отправить</button>
    </form>
  `
})
export class DynamicFormComponent implements OnInit {
  fields: FormFieldConfig[] = [
    { key: 'name', label: 'Имя', type: 'text', required: true },
    { key: 'email', label: 'Email', type: 'email', required: true },
    { key: 'age', label: 'Возраст', type: 'number' },
    { key: 'role', label: 'Роль', type: 'select', required: true,
      options: [
        { value: 'dev', label: 'Разработчик' },
        { value: 'designer', label: 'Дизайнер' },
        { value: 'pm', label: 'Менеджер' }
      ]
    },
    { key: 'agree', label: 'Согласие', type: 'checkbox', required: true }
  ];

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    const group: Record<string, any> = {};
    for (const field of this.fields) {
      const validators = field.required ? [Validators.required] : [];
      if (field.type === 'email') validators.push(Validators.email);
      group[field.key] = ['', validators];
    }
    this.form = this.fb.group(group);
  }

  onSubmit() {
    console.log(this.form.value);
  }
}
```

## 6. Обработка отправки формы

### Полный пример с обработкой ошибок

```typescript
@Component({
  selector: 'app-contact',
  template: `
    <form [formGroup]="contactForm" (ngSubmit)="onSubmit()">
      <input formControlName="name" placeholder="Имя">
      <input formControlName="email" placeholder="Email">
      <textarea formControlName="message" placeholder="Сообщение"></textarea>

      <div *ngIf="submitError" class="error">{{ submitError }}</div>
      <div *ngIf="submitSuccess" class="success">Сообщение отправлено!</div>

      <button type="submit" [disabled]="isSubmitting">
        {{ isSubmitting ? 'Отправка...' : 'Отправить' }}
      </button>
    </form>
  `
})
export class ContactComponent {
  contactForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(10)]]
  });

  isSubmitting = false;
  submitError = '';
  submitSuccess = false;

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService
  ) {}

  onSubmit() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.submitError = '';
    this.submitSuccess = false;

    this.contactService.send(this.contactForm.value).subscribe({
      next: () => {
        this.submitSuccess = true;
        this.contactForm.reset();
        this.isSubmitting = false;
      },
      error: (err) => {
        this.submitError = 'Ошибка отправки: ' + err.message;
        this.isSubmitting = false;
      }
    });
  }
}
```

## Сводная таблица

| Тема | Reactive Forms | Template-driven |
|------|---------------|-----------------|
| Встроенные валидаторы | `Validators.required` и т.д. | `required`, `email` и т.д. |
| Custom validator | Функция `ValidatorFn` | Директива + `NG_VALIDATORS` |
| Async validator | `AsyncValidatorFn` + Observable | Директива + `NG_ASYNC_VALIDATORS` |
| Cross-field | Валидатор на `FormGroup` | `ngModelGroup` + директива |
| Ошибки | `control.hasError('key')` | `#ref.errors?.['key']` |
| Статус | `form.status` | `form.valid / invalid` |
| Dynamic forms | `FormBuilder` + конфигурация | Сложно реализовать |
