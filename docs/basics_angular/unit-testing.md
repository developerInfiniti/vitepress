# Unit-тестирование в Angular

## Инструменты

Angular по умолчанию использует:

- **Jasmine** — фреймворк для написания тестов (describe, it, expect)
- **Karma** — test runner, запускает тесты в браузере
- **TestBed** — Angular-утилита для настройки тестового окружения

Альтернатива: **Jest** — быстрее, без браузера, совместим с Angular.

## Запуск тестов

```bash
# Запуск всех тестов
ng test

# Однократный запуск (CI)
ng test --watch=false --browsers=ChromeHeadless

# С покрытием
ng test --code-coverage

# Конкретный файл
ng test --include=**/user.service.spec.ts
```

## Структура теста (Jasmine)

```typescript
describe('Название группы тестов', () => {
  // Настройка перед каждым тестом
  beforeEach(() => {
    // setup
  });

  // Очистка после каждого теста
  afterEach(() => {
    // cleanup
  });

  it('должен делать что-то конкретное', () => {
    // Arrange (подготовка)
    const value = 2 + 2;

    // Act (действие) — часто совмещено с Arrange

    // Assert (проверка)
    expect(value).toBe(4);
  });

  it('должен выбрасывать ошибку', () => {
    expect(() => throwingFunction()).toThrow();
  });

  // Пропуск и фокусировка
  xit('пропущенный тест', () => { });     // skip
  // fit('только этот тест', () => { });   // focus (не коммитить!)
});
```

### Основные матчеры Jasmine

```typescript
expect(value).toBe(4);                    // Строгое равенство (===)
expect(value).toEqual({ a: 1 });          // Глубокое сравнение
expect(value).toBeTruthy();               // Истинное значение
expect(value).toBeFalsy();                // Ложное значение
expect(value).toBeNull();                 // null
expect(value).toBeUndefined();            // undefined
expect(value).toBeDefined();              // Не undefined
expect(value).toContain('text');          // Содержит (строка/массив)
expect(value).toBeGreaterThan(3);         // Больше
expect(value).toBeLessThan(10);           // Меньше
expect(value).toMatch(/regex/);           // Регулярное выражение
expect(value).toHaveBeenCalled();         // Spy был вызван
expect(value).toHaveBeenCalledWith(arg);  // Spy вызван с аргументом
expect(value).toHaveBeenCalledTimes(2);   // Количество вызовов
```

## TestBed

TestBed создаёт изолированный Angular-модуль для тестов:

```typescript
import { TestBed, ComponentFixture } from '@angular/core/testing';

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserComponent],       // Тестируемый компонент
      imports: [FormsModule],              // Необходимые модули
      providers: [                          // Сервисы (можно моки)
        { provide: UserService, useClass: MockUserService }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();  // Запускает ngOnInit
  });

  it('должен создать компонент', () => {
    expect(component).toBeTruthy();
  });
});
```

### TestBed для standalone компонентов

```typescript
beforeEach(async () => {
  await TestBed.configureTestingModule({
    imports: [UserComponent],  // standalone компонент в imports
    providers: [
      { provide: UserService, useValue: mockUserService }
    ],
  }).compileComponents();
});
```

### Переопределение провайдеров

```typescript
beforeEach(async () => {
  await TestBed.configureTestingModule({
    imports: [UserComponent],
  })
  .overrideComponent(UserComponent, {
    set: {
      providers: [
        { provide: UserService, useValue: mockService }
      ]
    }
  })
  .compileComponents();
});
```

## Тестирование компонентов

### Тестирование класса компонента

```typescript
describe('CounterComponent', () => {
  let component: CounterComponent;
  let fixture: ComponentFixture<CounterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CounterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('начальное значение счётчика — 0', () => {
    expect(component.count).toBe(0);
  });

  it('increment увеличивает счётчик на 1', () => {
    component.increment();
    expect(component.count).toBe(1);
  });

  it('decrement уменьшает счётчик на 1', () => {
    component.count = 5;
    component.decrement();
    expect(component.count).toBe(4);
  });

  it('reset сбрасывает счётчик', () => {
    component.count = 10;
    component.reset();
    expect(component.count).toBe(0);
  });
});
```

### Тестирование шаблона (DOM)

```typescript
describe('CounterComponent (DOM)', () => {
  let fixture: ComponentFixture<CounterComponent>;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CounterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CounterComponent);
    fixture.detectChanges();
    el = fixture.nativeElement;
  });

  it('отображает текущее значение счётчика', () => {
    const counterEl = el.querySelector('.counter-value');
    expect(counterEl?.textContent).toContain('0');
  });

  it('обновляет DOM после increment', () => {
    const button = el.querySelector('.increment-btn') as HTMLButtonElement;
    button.click();
    fixture.detectChanges();  // Обязательно! Обновляем DOM

    const counterEl = el.querySelector('.counter-value');
    expect(counterEl?.textContent).toContain('1');
  });

  it('кнопка decrement заблокирована при count=0', () => {
    const button = el.querySelector('.decrement-btn') as HTMLButtonElement;
    expect(button.disabled).toBeTrue();
  });
});
```

### DebugElement — альтернатива nativeElement

```typescript
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

it('кнопка вызывает increment()', () => {
  spyOn(component, 'increment');

  const buttonDe: DebugElement = fixture.debugElement.query(By.css('.increment-btn'));
  buttonDe.triggerEventHandler('click', null);

  expect(component.increment).toHaveBeenCalled();
});

// Поиск по директиве
const items = fixture.debugElement.queryAll(By.directive(HighlightDirective));
```

### Тестирование @Input и @Output

```typescript
// child.component.ts
@Component({
  selector: 'app-greeting',
  template: `<h1>Привет, {{ name }}!</h1>
             <button (click)="onClose()">Закрыть</button>`
})
export class GreetingComponent {
  @Input() name = '';
  @Output() close = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }
}
```

```typescript
describe('GreetingComponent', () => {
  let component: GreetingComponent;
  let fixture: ComponentFixture<GreetingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GreetingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GreetingComponent);
    component = fixture.componentInstance;
  });

  it('отображает переданное имя', () => {
    component.name = 'Анна';
    fixture.detectChanges();

    const h1 = fixture.nativeElement.querySelector('h1');
    expect(h1.textContent).toContain('Привет, Анна!');
  });

  it('эмитит close при клике на кнопку', () => {
    spyOn(component.close, 'emit');

    const button = fixture.nativeElement.querySelector('button');
    button.click();

    expect(component.close.emit).toHaveBeenCalled();
  });
});
```

### Тестирование компонента с хост-компонентом

```typescript
// Создаём обёртку для тестирования @Input/@Output в контексте
@Component({
  template: `
    <app-greeting
      [name]="testName"
      (close)="onClosed()"
    ></app-greeting>
  `
})
class TestHostComponent {
  testName = 'Борис';
  closed = false;
  onClosed(): void { this.closed = true; }
}

describe('GreetingComponent (host)', () => {
  let hostFixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GreetingComponent, TestHostComponent],
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;
    hostFixture.detectChanges();
  });

  it('рендерит имя из хоста', () => {
    const h1 = hostFixture.nativeElement.querySelector('h1');
    expect(h1.textContent).toContain('Привет, Борис!');
  });

  it('уведомляет хост при закрытии', () => {
    const button = hostFixture.nativeElement.querySelector('button');
    button.click();
    expect(hostComponent.closed).toBeTrue();
  });
});
```

## Тестирование сервисов

### Простой сервис (без зависимостей)

```typescript
describe('CalculatorService', () => {
  let service: CalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalculatorService);
  });

  it('складывает два числа', () => {
    expect(service.add(2, 3)).toBe(5);
  });

  it('делит числа', () => {
    expect(service.divide(10, 2)).toBe(5);
  });

  it('выбрасывает ошибку при делении на ноль', () => {
    expect(() => service.divide(10, 0)).toThrowError('Деление на ноль');
  });
});
```

### Сервис с HTTP (HttpClientTestingModule)

```typescript
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('UserService (HTTP)', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();  // Проверяем, что нет незавершённых запросов
  });

  it('GET /users возвращает список пользователей', () => {
    const mockUsers: User[] = [
      { id: 1, name: 'Анна', email: 'anna@test.com' },
      { id: 2, name: 'Борис', email: 'boris@test.com' },
    ];

    service.getUsers().subscribe(users => {
      expect(users.length).toBe(2);
      expect(users[0].name).toBe('Анна');
    });

    const req = httpMock.expectOne('https://api.example.com/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);  // Отвечаем моковыми данными
  });

  it('POST /users создаёт пользователя', () => {
    const newUser = { name: 'Вера', email: 'vera@test.com' };

    service.createUser(newUser).subscribe(user => {
      expect(user.id).toBeDefined();
      expect(user.name).toBe('Вера');
    });

    const req = httpMock.expectOne('https://api.example.com/users');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newUser);
    req.flush({ id: 3, ...newUser });
  });

  it('обрабатывает ошибку 404', () => {
    service.getUserById(999).subscribe({
      next: () => fail('Должна быть ошибка'),
      error: (err) => {
        expect(err.message).toContain('404');
      }
    });

    const req = httpMock.expectOne('https://api.example.com/users/999');
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });
  });

  it('отправляет правильные заголовки', () => {
    service.getProtectedData().subscribe();

    const req = httpMock.expectOne('https://api.example.com/protected');
    expect(req.request.headers.has('Authorization')).toBeTrue();
  });

  it('не делает лишних запросов', () => {
    service.getUsers().subscribe();

    httpMock.expectOne('https://api.example.com/users');
    httpMock.expectNone('https://api.example.com/other');
    // verify() в afterEach проверит, что нет незакрытых запросов
  });
});
```

### Мокирование сервисов (Spy)

```typescript
describe('UserListComponent', () => {
  let mockUserService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    // Создаём spy-объект с нужными методами
    mockUserService = jasmine.createSpyObj('UserService', [
      'getUsers', 'deleteUser'
    ]);

    // Настраиваем возвращаемые значения
    mockUserService.getUsers.and.returnValue(of([
      { id: 1, name: 'Анна', email: 'anna@test.com' },
    ]));
    mockUserService.deleteUser.and.returnValue(of(undefined));

    await TestBed.configureTestingModule({
      declarations: [UserListComponent],
      providers: [
        { provide: UserService, useValue: mockUserService }
      ],
    }).compileComponents();
  });

  it('загружает пользователей при инициализации', () => {
    const fixture = TestBed.createComponent(UserListComponent);
    fixture.detectChanges();

    expect(mockUserService.getUsers).toHaveBeenCalled();
    expect(fixture.componentInstance.users.length).toBe(1);
  });

  it('вызывает deleteUser с правильным id', () => {
    const fixture = TestBed.createComponent(UserListComponent);
    fixture.detectChanges();

    fixture.componentInstance.onDelete(1);

    expect(mockUserService.deleteUser).toHaveBeenCalledWith(1);
  });
});
```

## Асинхронное тестирование

### fakeAsync + tick

```typescript
import { fakeAsync, tick } from '@angular/core/testing';

it('обновляет данные после задержки', fakeAsync(() => {
  component.loadData();

  // Перематываем время на 1000мс
  tick(1000);
  fixture.detectChanges();

  expect(component.data).toBeDefined();
}));

it('debounce поиска', fakeAsync(() => {
  component.searchControl.setValue('Angular');

  tick(299);  // Ещё не прошло 300мс
  expect(mockService.search).not.toHaveBeenCalled();

  tick(1);    // Теперь 300мс
  expect(mockService.search).toHaveBeenCalledWith('Angular');
}));

// Перемотать все таймеры и микротаски
it('flush all', fakeAsync(() => {
  component.startPolling();
  tick(30000);  // 30 секунд
  // или: flush() — перемотать всё до конца

  expect(mockService.getData).toHaveBeenCalledTimes(3);
}));
```

### waitForAsync (бывший async)

```typescript
import { waitForAsync } from '@angular/core/testing';

it('загружает данные из API', waitForAsync(() => {
  component.loadData();

  // fixture.whenStable() ждёт завершения всех Promise
  fixture.whenStable().then(() => {
    fixture.detectChanges();
    expect(component.users.length).toBeGreaterThan(0);
  });
}));
```

### done callback

```typescript
it('Observable эмитит значение', (done: DoneFn) => {
  service.getData().subscribe(data => {
    expect(data).toBeTruthy();
    done();  // Сигнализируем о завершении
  });
});
```

## Тестирование Pipes

```typescript
// truncate.pipe.ts
@Pipe({ name: 'truncate' })
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number = 50): string {
    if (value.length <= limit) return value;
    return value.substring(0, limit) + '...';
  }
}
```

```typescript
describe('TruncatePipe', () => {
  const pipe = new TruncatePipe();

  it('возвращает строку как есть если она короче лимита', () => {
    expect(pipe.transform('Привет', 10)).toBe('Привет');
  });

  it('обрезает строку и добавляет "..."', () => {
    expect(pipe.transform('Длинная строка текста', 10)).toBe('Длинная ст...');
  });

  it('использует лимит по умолчанию 50', () => {
    const short = 'a'.repeat(50);
    const long = 'a'.repeat(51);
    expect(pipe.transform(short)).toBe(short);
    expect(pipe.transform(long)).toBe('a'.repeat(50) + '...');
  });
});
```

## Тестирование Directives

```typescript
// highlight.directive.ts
@Directive({ selector: '[appHighlight]' })
export class HighlightDirective {
  @Input() appHighlight = 'yellow';

  constructor(private el: ElementRef) {}

  @HostListener('mouseenter') onMouseEnter(): void {
    this.el.nativeElement.style.backgroundColor = this.appHighlight;
  }

  @HostListener('mouseleave') onMouseLeave(): void {
    this.el.nativeElement.style.backgroundColor = '';
  }
}
```

```typescript
@Component({
  template: `
    <p appHighlight="cyan">Текст 1</p>
    <p appHighlight>Текст 2</p>
    <p>Текст без директивы</p>
  `
})
class TestHostComponent {}

describe('HighlightDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HighlightDirective, TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('применяет цвет при наведении', () => {
    const p = fixture.debugElement.queryAll(By.directive(HighlightDirective));

    p[0].triggerEventHandler('mouseenter', null);
    expect(p[0].nativeElement.style.backgroundColor).toBe('cyan');

    p[0].triggerEventHandler('mouseleave', null);
    expect(p[0].nativeElement.style.backgroundColor).toBe('');
  });

  it('использует жёлтый цвет по умолчанию', () => {
    const p = fixture.debugElement.queryAll(By.directive(HighlightDirective));

    p[1].triggerEventHandler('mouseenter', null);
    expect(p[1].nativeElement.style.backgroundColor).toBe('yellow');
  });

  it('не применяется к элементам без директивы', () => {
    const allP = fixture.debugElement.queryAll(By.css('p'));
    const withDirective = fixture.debugElement.queryAll(By.directive(HighlightDirective));

    expect(allP.length).toBe(3);
    expect(withDirective.length).toBe(2);
  });
});
```

## Тестирование Router

```typescript
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

describe('Навигация', () => {
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: '', component: HomeComponent },
          { path: 'users', component: UserListComponent },
          { path: 'users/:id', component: UserDetailComponent },
        ]),
      ],
      declarations: [HomeComponent, UserListComponent, UserDetailComponent],
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
  });

  it('переходит на /users', fakeAsync(() => {
    router.navigate(['/users']);
    tick();
    expect(location.path()).toBe('/users');
  }));

  it('переходит на /users/:id', fakeAsync(() => {
    router.navigate(['/users', 42]);
    tick();
    expect(location.path()).toBe('/users/42');
  }));
});
```

## Тестирование форм

### Reactive Forms

```typescript
describe('LoginComponent (Reactive Forms)', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: jasmine.createSpyObj('AuthService', ['login']) }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('форма невалидна при пустых полях', () => {
    expect(component.loginForm.valid).toBeFalse();
  });

  it('email обязателен', () => {
    const email = component.loginForm.get('email');
    expect(email?.errors?.['required']).toBeTruthy();
  });

  it('email валидируется', () => {
    const email = component.loginForm.get('email');
    email?.setValue('not-an-email');
    expect(email?.errors?.['email']).toBeTruthy();

    email?.setValue('test@example.com');
    expect(email?.errors).toBeNull();
  });

  it('форма валидна с правильными данными', () => {
    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(component.loginForm.valid).toBeTrue();
  });

  it('кнопка submit заблокирована при невалидной форме', () => {
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(button.disabled).toBeTrue();
  });
});
```

## Code Coverage

```bash
# Генерация отчёта
ng test --code-coverage

# Результат в папке coverage/
# Открыть coverage/index.html в браузере
```

### Настройка порогов в `karma.conf.js`

```javascript
coverageReporter: {
  dir: require('path').join(__dirname, './coverage'),
  subdir: '.',
  reporters: [
    { type: 'html' },
    { type: 'text-summary' },
    { type: 'lcov' },
  ],
  check: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    }
  }
}
```

### Настройка в `angular.json` (для Jest)

```json
{
  "test": {
    "options": {
      "codeCoverage": true,
      "codeCoverageExclude": [
        "src/test.ts",
        "src/**/*.spec.ts",
        "src/**/*.mock.ts",
        "src/environments/**"
      ]
    }
  }
}
```
