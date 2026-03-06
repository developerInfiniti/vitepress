# Сервисы Angular

## Что такое сервис

Сервис — это класс с определённой функциональностью, который не привязан к конкретному компоненту. Сервисы используются для:

- Бизнес-логики
- Работы с данными (HTTP-запросы)
- Общего состояния между компонентами
- Утилитарных функций
- Логирования

## Создание сервиса

### Через Angular CLI

```bash
ng generate service services/user
# или сокращённо
ng g s services/user
```

### Вручную

```typescript
// services/user.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'   // Доступен во всём приложении как singleton
})
export class UserService {
  private users: User[] = [];

  getUsers(): User[] {
    return this.users;
  }

  addUser(user: User): void {
    this.users.push(user);
  }
}

interface User {
  id: number;
  name: string;
  email: string;
}
```

## Декоратор @Injectable

`@Injectable` помечает класс как доступный для DI-системы Angular:

```typescript
@Injectable({
  providedIn: 'root'   // Tree-shakable singleton
})
export class LoggerService {
  log(message: string): void {
    console.log(`[LOG] ${new Date().toISOString()}: ${message}`);
  }

  error(message: string): void {
    console.error(`[ERROR] ${new Date().toISOString()}: ${message}`);
  }

  warn(message: string): void {
    console.warn(`[WARN] ${new Date().toISOString()}: ${message}`);
  }
}
```

### Варианты providedIn

| Значение | Область видимости |
|---|---|
| `'root'` | Singleton для всего приложения (рекомендуется) |
| `'platform'` | Общий для всех Angular-приложений на странице |
| `'any'` | Уникальный экземпляр для каждого lazy-loaded модуля |
| `SomeModule` | Привязан к конкретному модулю |

## Использование сервиса в компоненте

### Внедрение через конструктор

```typescript
import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-list',
  template: `
    <h2>Пользователи</h2>
    <ul>
      <li *ngFor="let user of users">
        {{ user.name }} — {{ user.email }}
      </li>
    </ul>
    <p *ngIf="users.length === 0">Список пуст</p>
  `
})
export class UserListComponent implements OnInit {
  users: User[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.users = this.userService.getUsers();
  }
}
```

### Внедрение через inject() (Angular 14+)

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-list',
  template: `...`
})
export class UserListComponent implements OnInit {
  private userService = inject(UserService);
  users: User[] = [];

  ngOnInit(): void {
    this.users = this.userService.getUsers();
  }
}
```

## Сервис с HTTP-запросами

```typescript
// services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

export interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'https://api.example.com';

  constructor(private http: HttpClient) {}

  // GET — получить всех пользователей
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`).pipe(
      catchError(this.handleError)
    );
  }

  // GET — получить одного пользователя
  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // POST — создать пользователя
  createUser(user: Omit<User, 'id'>): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/users`, user).pipe(
      catchError(this.handleError)
    );
  }

  // PUT — обновить пользователя
  updateUser(id: number, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/users/${id}`, user).pipe(
      catchError(this.handleError)
    );
  }

  // DELETE — удалить пользователя
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/users/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // GET с параметрами
  searchUsers(query: string, page: number = 1): Observable<User[]> {
    const params = new HttpParams()
      .set('q', query)
      .set('page', page.toString());

    return this.http.get<User[]>(`${this.baseUrl}/users/search`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('API Error:', error);
    return throwError(() => new Error(error.message || 'Ошибка сервера'));
  }
}
```

### Использование HTTP-сервиса в компоненте

```typescript
@Component({
  selector: 'app-user-list',
  template: `
    <div *ngIf="loading">Загрузка...</div>
    <div *ngIf="error" class="error">{{ error }}</div>
    <ul *ngIf="!loading && !error">
      <li *ngFor="let user of users">{{ user.name }}</li>
    </ul>
  `
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  loading = false;
  error = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loading = true;
    this.apiService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }
}
```

## Сервис для обмена данными между компонентами

```typescript
// services/notification.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

export interface Notification {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  // BehaviorSubject хранит последнее значение
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  // Subject для одноразовых событий
  private clearEvent = new Subject<void>();
  clearEvent$ = this.clearEvent.asObservable();

  add(type: Notification['type'], message: string): void {
    const current = this.notificationsSubject.value;
    this.notificationsSubject.next([...current, { type, message }]);
  }

  success(message: string): void {
    this.add('success', message);
  }

  error(message: string): void {
    this.add('error', message);
  }

  remove(index: number): void {
    const current = this.notificationsSubject.value;
    current.splice(index, 1);
    this.notificationsSubject.next([...current]);
  }

  clearAll(): void {
    this.notificationsSubject.next([]);
    this.clearEvent.next();
  }
}
```

### Компонент уведомлений

```typescript
@Component({
  selector: 'app-notifications',
  template: `
    <div class="notifications">
      <div
        *ngFor="let n of notifications$ | async; let i = index"
        [class]="'notification ' + n.type"
        (click)="dismiss(i)"
      >
        {{ n.message }}
      </div>
    </div>
  `
})
export class NotificationsComponent {
  notifications$ = inject(NotificationService).notifications$;
  private notificationService = inject(NotificationService);

  dismiss(index: number): void {
    this.notificationService.remove(index);
  }
}
```

### Использование в любом компоненте

```typescript
@Component({ selector: 'app-user-form' })
export class UserFormComponent {
  private notificationService = inject(NotificationService);
  private apiService = inject(ApiService);

  saveUser(user: User): void {
    this.apiService.createUser(user).subscribe({
      next: () => this.notificationService.success('Пользователь создан!'),
      error: (err) => this.notificationService.error(err.message),
    });
  }
}
```

## Сервис аутентификации

```typescript
// services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

interface AuthResponse {
  token: string;
  user: { id: number; name: string; email: string };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<AuthResponse['user'] | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  private tokenKey = 'auth_token';

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    // Восстановление сессии при загрузке
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      this.loadCurrentUser();
    }
  }

  get isAuthenticated(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  get token(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/auth/login', { email, password }).pipe(
      tap(response => {
        localStorage.setItem(this.tokenKey, response.token);
        this.currentUserSubject.next(response.user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  private loadCurrentUser(): void {
    this.http.get<AuthResponse['user']>('/api/auth/me').subscribe({
      next: (user) => this.currentUserSubject.next(user),
      error: () => this.logout(),
    });
  }
}
```

## Сервис с кешированием

```typescript
@Injectable({
  providedIn: 'root'
})
export class CachedDataService {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private cacheDuration = 5 * 60 * 1000; // 5 минут

  constructor(private http: HttpClient) {}

  get<T>(url: string): Observable<T> {
    const cached = this.cache.get(url);

    if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
      return of(cached.data as T);
    }

    return this.http.get<T>(url).pipe(
      tap(data => {
        this.cache.set(url, { data, timestamp: Date.now() });
      })
    );
  }

  invalidate(url: string): void {
    this.cache.delete(url);
  }

  invalidateAll(): void {
    this.cache.clear();
  }
}
```

## Тестирование сервисов

```typescript
// services/user.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService, User } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService],
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Проверяем, что нет незавершённых запросов
  });

  it('should fetch users', () => {
    const mockUsers: User[] = [
      { id: 1, name: 'Анна', email: 'anna@test.com' },
    ];

    service.getUsers().subscribe(users => {
      expect(users.length).toBe(1);
      expect(users[0].name).toBe('Анна');
    });

    const req = httpMock.expectOne('https://api.example.com/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('should create a user', () => {
    const newUser = { name: 'Борис', email: 'boris@test.com' };
    const createdUser: User = { id: 2, ...newUser };

    service.createUser(newUser).subscribe(user => {
      expect(user.id).toBe(2);
      expect(user.name).toBe('Борис');
    });

    const req = httpMock.expectOne('https://api.example.com/users');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newUser);
    req.flush(createdUser);
  });
});
```
