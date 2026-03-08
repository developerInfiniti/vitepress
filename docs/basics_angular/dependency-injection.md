---
description: "Dependency Injection в Angular: провайдеры, инжекторы, токены — паттерн управления зависимостями"
---

# Dependency Injection в Angular

## Что такое Dependency Injection

Dependency Injection (DI) — это паттерн проектирования, при котором класс получает свои зависимости извне, а не создаёт их сам. Angular имеет встроенную DI-систему, которая является одной из ключевых особенностей фреймворка.

### Без DI vs с DI

```typescript
// БЕЗ DI — жёсткая связанность
class UserComponent {
  private userService: UserService;

  constructor() {
    this.userService = new UserService(new HttpClient()); // Создаём сами
  }
}

// С DI — слабая связанность
@Component({ selector: 'app-user' })
class UserComponent {
  constructor(private userService: UserService) {} // Angular внедряет
}
```

## Основные понятия

### Провайдер (Provider)

Провайдер сообщает инжектору, как создать зависимость:

```typescript
@NgModule({
  providers: [
    UserService,  // Сокращённая запись
    // Полная запись:
    { provide: UserService, useClass: UserService }
  ]
})
```

### Инжектор (Injector)

Инжектор — это контейнер, который создаёт и хранит экземпляры сервисов. Angular строит дерево инжекторов:

```
Root Injector (AppModule / bootstrapApplication)
  ├── Module Injector (lazy-loaded modules)
  │     └── Component Injector
  │           └── Child Component Injector
  └── Component Injector
        └── Child Component Injector
```

### Токен (Token)

Токен — это ключ, по которому инжектор находит провайдер:

```typescript
// Класс как токен
constructor(private userService: UserService) {}

// InjectionToken как токен
const API_URL = new InjectionToken<string>('API_URL');
constructor(@Inject(API_URL) private apiUrl: string) {}
```

## Типы провайдеров

### useClass — создание экземпляра класса

```typescript
// Основное использование
{ provide: UserService, useClass: UserService }

// Подмена реализации
{ provide: UserService, useClass: MockUserService }

// Пример: подмена для тестов или разных окружений
const providers = environment.production
  ? [{ provide: LoggerService, useClass: ProductionLoggerService }]
  : [{ provide: LoggerService, useClass: ConsoleLoggerService }];
```

### useValue — предоставление готового значения

```typescript
// Конфигурация
{ provide: 'API_URL', useValue: 'https://api.example.com' }

// Объект конфигурации
const APP_CONFIG = {
  apiUrl: 'https://api.example.com',
  maxRetries: 3,
  timeout: 5000,
};
{ provide: 'APP_CONFIG', useValue: APP_CONFIG }
```

### useFactory — создание через фабричную функцию

```typescript
// Простая фабрика
{
  provide: UserService,
  useFactory: () => {
    const isPremium = checkPremiumStatus();
    return isPremium ? new PremiumUserService() : new BasicUserService();
  }
}

// Фабрика с зависимостями
{
  provide: UserService,
  useFactory: (http: HttpClient, config: AppConfig) => {
    return new UserService(http, config.apiUrl);
  },
  deps: [HttpClient, APP_CONFIG]  // Зависимости фабрики
}

// Асинхронная инициализация
{
  provide: APP_INITIALIZER,
  useFactory: (configService: ConfigService) => {
    return () => configService.loadConfig();
  },
  deps: [ConfigService],
  multi: true
}
```

### useExisting — алиас для существующего провайдера

```typescript
// Абстрактный класс как интерфейс
abstract class Logger {
  abstract log(message: string): void;
}

@Injectable({ providedIn: 'root' })
class ConsoleLogger extends Logger {
  log(message: string): void {
    console.log(message);
  }
}

// useExisting создаёт алиас, а не новый экземпляр
{
  provide: Logger,
  useExisting: ConsoleLogger
}
```

## InjectionToken

`InjectionToken` используется для не-классовых зависимостей:

```typescript
import { InjectionToken } from '@angular/core';

// Определение токенов
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');
export const MAX_RETRIES = new InjectionToken<number>('MAX_RETRIES');

export interface AppConfig {
  apiUrl: string;
  production: boolean;
  version: string;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG');
```

### Регистрация

```typescript
@NgModule({
  providers: [
    { provide: API_BASE_URL, useValue: 'https://api.example.com' },
    { provide: MAX_RETRIES, useValue: 3 },
    {
      provide: APP_CONFIG,
      useValue: {
        apiUrl: 'https://api.example.com',
        production: true,
        version: '1.0.0',
      }
    },
  ]
})
export class AppModule {}
```

### Использование

```typescript
@Injectable({ providedIn: 'root' })
export class ApiService {
  // Через конструктор с @Inject
  constructor(
    private http: HttpClient,
    @Inject(API_BASE_URL) private baseUrl: string,
    @Inject(MAX_RETRIES) private maxRetries: number,
  ) {}
}

// Или через inject()
export class ApiService {
  private baseUrl = inject(API_BASE_URL);
  private maxRetries = inject(MAX_RETRIES);
  private http = inject(HttpClient);
}
```

### InjectionToken с фабрикой по умолчанию

```typescript
export const LOCALE = new InjectionToken<string>('LOCALE', {
  providedIn: 'root',
  factory: () => 'ru-RU',   // Значение по умолчанию
});
```

## Multi-провайдеры

Позволяют регистрировать несколько значений под одним токеном:

```typescript
const HTTP_INTERCEPTORS = new InjectionToken<HttpInterceptor[]>('HTTP_INTERCEPTORS');

@NgModule({
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ]
})
export class AppModule {}
```

```typescript
// При внедрении получаем массив
constructor(@Inject(HTTP_INTERCEPTORS) private interceptors: HttpInterceptor[]) {
  console.log(interceptors.length); // 3
}
```

## Модификаторы внедрения

### @Optional() — необязательная зависимость

```typescript
@Component({ selector: 'app-widget' })
export class WidgetComponent {
  constructor(@Optional() private logger?: LoggerService) {
    // logger может быть null, если не зарегистрирован
    this.logger?.log('Widget created');
  }
}
```

### @Self() — только из своего инжектора

```typescript
@Component({
  selector: 'app-child',
  providers: [UserService]  // Регистрируем локально
})
export class ChildComponent {
  // Ищет UserService ТОЛЬКО в инжекторе этого компонента
  constructor(@Self() private userService: UserService) {}
}
```

### @SkipSelf() — пропустить свой инжектор

```typescript
@Component({
  selector: 'app-child',
  providers: [UserService]
})
export class ChildComponent {
  // Пропускает свой инжектор, ищет в родительских
  constructor(@SkipSelf() private userService: UserService) {}
}
```

### @Host() — до хост-компонента

```typescript
@Directive({ selector: '[appTooltip]' })
export class TooltipDirective {
  // Ищет до хост-компонента (включительно), но не выше
  constructor(@Host() private elementRef: ElementRef) {}
}
```

### Комбинирование модификаторов

```typescript
constructor(
  @Optional() @SkipSelf() private parentService?: ParentService
) {
  // Ищет в родительских инжекторах, не падает если не найден
}
```

## Иерархия инжекторов

### Уровни предоставления сервисов

```typescript
// 1. Корневой уровень — singleton для всего приложения
@Injectable({ providedIn: 'root' })
export class GlobalService {}

// 2. Уровень модуля
@NgModule({
  providers: [ModuleScopedService]
})
export class FeatureModule {}

// 3. Уровень компонента — новый экземпляр для каждого компонента
@Component({
  selector: 'app-user',
  providers: [UserStateService]  // Каждый <app-user> получит свой экземпляр
})
export class UserComponent {}
```

### Пример: изолированное состояние компонента

```typescript
// Сервис состояния формы
@Injectable()  // БЕЗ providedIn — регистрируется вручную
export class FormStateService {
  private data: Record<string, any> = {};

  set(key: string, value: any): void {
    this.data[key] = value;
  }

  get(key: string): any {
    return this.data[key];
  }

  reset(): void {
    this.data = {};
  }
}

// Каждый экземпляр формы получает свой FormStateService
@Component({
  selector: 'app-user-form',
  providers: [FormStateService],
  template: `...`
})
export class UserFormComponent {
  constructor(private formState: FormStateService) {}
}
```

## Функция inject() (Angular 14+)

Альтернатива конструкторному внедрению:

```typescript
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  template: `...`
})
export class DashboardComponent {
  // Вместо конструктора
  private userService = inject(UserService);
  private router = inject(Router);
  private config = inject(APP_CONFIG);

  // С Optional
  private analytics = inject(AnalyticsService, { optional: true });
}
```

### Преимущества inject()

```typescript
// Можно использовать в функциях (не только в классах)
function createAuthGuard(): CanActivateFn {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isAuthenticated) {
      return true;
    }
    return router.createUrlTree(['/login']);
  };
}

// Route guard без класса
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.isAuthenticated || router.createUrlTree(['/login']);
};
```

## Практический пример: архитектура с DI

```typescript
// Абстракция хранилища
abstract class StorageService {
  abstract get(key: string): string | null;
  abstract set(key: string, value: string): void;
  abstract remove(key: string): void;
}

// Реализация: LocalStorage
@Injectable()
class LocalStorageService extends StorageService {
  get(key: string): string | null {
    return localStorage.getItem(key);
  }
  set(key: string, value: string): void {
    localStorage.setItem(key, value);
  }
  remove(key: string): void {
    localStorage.removeItem(key);
  }
}

// Реализация: SessionStorage
@Injectable()
class SessionStorageService extends StorageService {
  get(key: string): string | null {
    return sessionStorage.getItem(key);
  }
  set(key: string, value: string): void {
    sessionStorage.setItem(key, value);
  }
  remove(key: string): void {
    sessionStorage.removeItem(key);
  }
}

// Регистрация — легко переключить реализацию
@NgModule({
  providers: [
    { provide: StorageService, useClass: LocalStorageService }
    // Для session storage:
    // { provide: StorageService, useClass: SessionStorageService }
  ]
})
export class AppModule {}

// Использование — не зависит от конкретной реализации
@Injectable({ providedIn: 'root' })
class AuthService {
  constructor(private storage: StorageService) {}

  saveToken(token: string): void {
    this.storage.set('auth_token', token);
  }

  getToken(): string | null {
    return this.storage.get('auth_token');
  }
}
```

## Резюме

| Концепция | Описание |
|---|---|
| `@Injectable()` | Помечает класс для DI |
| `providedIn: 'root'` | Singleton для всего приложения |
| `useClass` | Создание экземпляра класса |
| `useValue` | Предоставление готового значения |
| `useFactory` | Создание через фабрику |
| `useExisting` | Алиас существующего провайдера |
| `InjectionToken` | Токен для не-классовых зависимостей |
| `multi: true` | Массив значений под одним токеном |
| `@Optional()` | Зависимость необязательна |
| `@Self()` | Искать только в своём инжекторе |
| `@SkipSelf()` | Пропустить свой инжектор |
| `inject()` | Функциональное внедрение (Angular 14+) |
