# Best Practices тестирования Angular

## Общие принципы

### Структура теста: AAA (Arrange-Act-Assert)

```typescript
it('должен отфильтровать активных пользователей', () => {
  // Arrange — подготовка данных
  const users: User[] = [
    { id: 1, name: 'Анна', isActive: true },
    { id: 2, name: 'Борис', isActive: false },
    { id: 3, name: 'Вера', isActive: true },
  ];

  // Act — выполнение действия
  const result = service.filterActive(users);

  // Assert — проверка результата
  expect(result.length).toBe(2);
  expect(result.every(u => u.isActive)).toBeTrue();
});
```

### Именование тестов

```typescript
// ХОРОШО — описывает поведение
it('должен отображать ошибку при пустом email', () => { });
it('должен перенаправлять на /login при отсутствии токена', () => { });
it('должен вызывать API при нажатии кнопки "Сохранить"', () => { });

// ПЛОХО — описывает реализацию
it('тест метода validate', () => { });
it('проверка компонента', () => { });
it('работает правильно', () => { });
```

### Один assert на тест (или логически связанные)

```typescript
// ХОРОШО — один аспект
it('форма невалидна при пустом email', () => {
  const email = component.form.get('email');
  expect(email?.errors?.['required']).toBeTruthy();
});

it('форма невалидна при некорректном email', () => {
  const email = component.form.get('email');
  email?.setValue('invalid');
  expect(email?.errors?.['email']).toBeTruthy();
});

// ДОПУСТИМО — логически связанные проверки
it('создаёт пользователя с правильными данными', () => {
  const user = service.create('Анна', 'anna@test.com');
  expect(user.name).toBe('Анна');
  expect(user.email).toBe('anna@test.com');
  expect(user.id).toBeDefined();
});
```

## Организация тестов

### Структура файлов

```
src/app/
├── users/
│   ├── user-list/
│   │   ├── user-list.component.ts
│   │   ├── user-list.component.spec.ts    # Unit-тесты
│   │   └── user-list.component.html
│   ├── services/
│   │   ├── user.service.ts
│   │   └── user.service.spec.ts
│   └── pipes/
│       ├── user-filter.pipe.ts
│       └── user-filter.pipe.spec.ts
├── shared/
│   └── testing/                           # Общие утилиты для тестов
│       ├── mock-data.ts
│       ├── test-helpers.ts
│       └── mock-services.ts
e2e/
├── pages/                                 # Page Objects
│   ├── login.page.ts
│   └── users.page.ts
├── auth.spec.ts
└── users.spec.ts
```

### Фабрики тестовых данных

```typescript
// shared/testing/mock-data.ts
export function createMockUser(overrides: Partial<User> = {}): User {
  return {
    id: 1,
    name: 'Тестовый пользователь',
    email: 'test@example.com',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    ...overrides,
  };
}

export function createMockUsers(count: number): User[] {
  return Array.from({ length: count }, (_, i) =>
    createMockUser({ id: i + 1, name: `Пользователь ${i + 1}` })
  );
}

// Использование в тестах
const user = createMockUser({ name: 'Анна', isActive: false });
const users = createMockUsers(5);
```

### Переиспользуемые моки сервисов

```typescript
// shared/testing/mock-services.ts
export function createMockUserService(): jasmine.SpyObj<UserService> {
  const spy = jasmine.createSpyObj('UserService', [
    'getUsers', 'getUserById', 'createUser', 'updateUser', 'deleteUser'
  ]);

  spy.getUsers.and.returnValue(of(createMockUsers(3)));
  spy.getUserById.and.callFake((id: number) =>
    of(createMockUser({ id }))
  );
  spy.createUser.and.callFake((user: Partial<User>) =>
    of(createMockUser(user))
  );
  spy.deleteUser.and.returnValue(of(undefined));

  return spy;
}

// Использование
beforeEach(() => {
  const mockService = createMockUserService();

  TestBed.configureTestingModule({
    providers: [{ provide: UserService, useValue: mockService }]
  });
});
```

## Что тестировать

### Компоненты

```typescript
// 1. Создание и инициализация
it('создаётся', () => {
  expect(component).toBeTruthy();
});

// 2. Отображение данных
it('отображает список пользователей', () => {
  expect(el.querySelectorAll('.user-item').length).toBe(3);
});

// 3. Взаимодействие (клики, ввод)
it('открывает модальное окно при клике', () => {
  el.querySelector('.add-btn')?.click();
  fixture.detectChanges();
  expect(el.querySelector('.modal')).toBeTruthy();
});

// 4. Условный рендеринг
it('показывает спиннер при загрузке', () => {
  component.loading = true;
  fixture.detectChanges();
  expect(el.querySelector('.spinner')).toBeTruthy();
});

// 5. @Input / @Output
it('передаёт данные дочернему компоненту', () => { });
it('реагирует на события дочернего компонента', () => { });

// 6. Навигация
it('переходит на страницу деталей', () => { });
```

### Сервисы

```typescript
// 1. Публичные методы
it('возвращает отфильтрованный список', () => { });

// 2. HTTP-взаимодействие
it('отправляет GET-запрос с правильными параметрами', () => { });
it('обрабатывает ошибку 404', () => { });

// 3. Состояние (BehaviorSubject)
it('обновляет состояние при добавлении элемента', () => { });

// 4. Граничные случаи
it('возвращает пустой массив если данных нет', () => { });
```

### Что НЕ тестировать

- Приватные методы — тестируйте через публичный API
- Реализацию Angular (HttpClient, Router и т.д.)
- Сторонние библиотеки
- Тривиальный код (геттеры, простые присваивания)
- Стили и визуальное оформление (используйте визуальные тесты)

## Частые ошибки и решения

### 1. Забыли fixture.detectChanges()

```typescript
// ПЛОХО — DOM не обновлён
it('отображает имя', () => {
  component.name = 'Анна';
  // fixture.detectChanges(); ← забыли!
  expect(el.querySelector('h1')?.textContent).toContain('Анна'); // FAIL
});

// ХОРОШО
it('отображает имя', () => {
  component.name = 'Анна';
  fixture.detectChanges();
  expect(el.querySelector('h1')?.textContent).toContain('Анна');
});
```

### 2. Не мокируют зависимости

```typescript
// ПЛОХО — реальный HTTP-запрос в unit-тесте
beforeEach(() => {
  TestBed.configureTestingModule({
    imports: [HttpClientModule],  // Реальный HTTP!
    declarations: [UserListComponent],
  });
});

// ХОРОШО — мок сервиса
beforeEach(() => {
  const mockService = jasmine.createSpyObj('UserService', ['getUsers']);
  mockService.getUsers.and.returnValue(of([]));

  TestBed.configureTestingModule({
    declarations: [UserListComponent],
    providers: [{ provide: UserService, useValue: mockService }],
  });
});
```

### 3. Тестирование реализации вместо поведения

```typescript
// ПЛОХО — привязка к деталям реализации
it('вызывает приватный метод calculateTotal', () => {
  spyOn(component as any, 'calculateTotal');
  component.addItem(item);
  expect((component as any).calculateTotal).toHaveBeenCalled();
});

// ХОРОШО — проверяем результат
it('обновляет итоговую сумму при добавлении товара', () => {
  component.addItem({ name: 'Товар', price: 100 });
  expect(component.total).toBe(100);
});
```

### 4. Утечка состояния между тестами

```typescript
// ПЛОХО — общее состояние
let sharedData: User[] = [];

beforeAll(() => {
  sharedData = createMockUsers(5);  // Общий для всех тестов
});

// ХОРОШО — изолированные данные
beforeEach(() => {
  const freshData = createMockUsers(5);  // Новые данные для каждого теста
});
```

### 5. Не проверяют afterEach/verify

```typescript
// ПЛОХО — запросы могут утечь
afterEach(() => {
  // Нет httpMock.verify()!
});

// ХОРОШО
afterEach(() => {
  httpMock.verify();  // Проверяем, что все запросы обработаны
});
```

## Асинхронные тесты: выбор подхода

| Ситуация | Подход |
|---|---|
| setTimeout, setInterval, debounce | `fakeAsync` + `tick` |
| HTTP-запросы (мок) | `HttpTestingController` |
| Observable подписки | `subscribe` + `done` |
| Promise | `waitForAsync` + `whenStable` |
| DOM после async | `fixture.whenStable()` |
| Всё вместе | `fakeAsync` + `flush` |

```typescript
// fakeAsync — контролируем время
it('debounce поиска', fakeAsync(() => {
  component.searchControl.setValue('test');
  tick(300);
  expect(mockService.search).toHaveBeenCalledWith('test');
}));

// done — ждём Observable
it('получает данные', (done) => {
  service.getData().subscribe(data => {
    expect(data.length).toBe(3);
    done();
  });
  httpMock.expectOne('/api/data').flush(mockData);
});
```

## Покрытие кода: рекомендации

### Целевые метрики

| Тип кода | Покрытие |
|---|---|
| Сервисы (бизнес-логика) | 90%+ |
| Компоненты (логика) | 80%+ |
| Pipes и директивы | 90%+ |
| Guards и interceptors | 90%+ |
| Шаблоны (DOM-тесты) | 70%+ |
| Утилиты | 95%+ |

### Что покрывать в первую очередь

1. Критические бизнес-правила
2. Сложную логику (условия, трансформации)
3. Обработку ошибок
4. Граничные случаи
5. Регрессии (найденные баги — пишите тест перед исправлением)

## Чек-лист тестирования компонента

```
[ ] Компонент создаётся без ошибок
[ ] @Input данные корректно отображаются
[ ] @Output события эмитятся при действиях пользователя
[ ] Условный рендеринг (*ngIf) работает
[ ] Списки (*ngFor) рендерятся правильно
[ ] Формы валидируются
[ ] Ошибки отображаются
[ ] Состояние загрузки отображается
[ ] Навигация работает
[ ] Сервисы вызываются с правильными аргументами
```

## Чек-лист тестирования сервиса

```
[ ] Все публичные методы протестированы
[ ] HTTP-запросы: правильный URL, метод, тело, заголовки
[ ] Обработка успешных ответов
[ ] Обработка ошибок (4xx, 5xx, сетевые)
[ ] Граничные случаи (пустые данные, null, undefined)
[ ] Состояние (Subject/BehaviorSubject) обновляется правильно
[ ] Подписки не утекают (httpMock.verify)
```
