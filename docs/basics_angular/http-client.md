# HttpClient в Angular

## Настройка HttpClient

### С NgModules

```typescript
// app.module.ts
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    HttpClientModule,  // Импортируем один раз в корневом модуле
  ],
})
export class AppModule {}
```

### Standalone (Angular 15+)

```typescript
// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
  ]
});
```

## Базовые HTTP-запросы

### GET — получение данных

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = 'https://api.example.com';

  // Простой GET
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  // GET с параметрами
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`);
  }
}
```

### POST — создание ресурса

```typescript
createUser(user: Omit<User, 'id'>): Observable<User> {
  return this.http.post<User>(`${this.apiUrl}/users`, user);
}

// С кастомными заголовками
createUserWithHeaders(user: Omit<User, 'id'>): Observable<User> {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer my-token',
  });
  return this.http.post<User>(`${this.apiUrl}/users`, user, { headers });
}
```

### PUT — полное обновление

```typescript
updateUser(id: number, user: User): Observable<User> {
  return this.http.put<User>(`${this.apiUrl}/users/${id}`, user);
}
```

### PATCH — частичное обновление

```typescript
patchUser(id: number, changes: Partial<User>): Observable<User> {
  return this.http.patch<User>(`${this.apiUrl}/users/${id}`, changes);
}
```

### DELETE — удаление

```typescript
deleteUser(id: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/users/${id}`);
}
```

## Параметры запроса (HttpParams)

```typescript
import { HttpParams } from '@angular/common/http';

// Способ 1: через конструктор
searchUsers(query: string, page: number, limit: number): Observable<User[]> {
  const params = new HttpParams()
    .set('q', query)
    .set('page', page.toString())
    .set('limit', limit.toString());

  return this.http.get<User[]>(`${this.apiUrl}/users`, { params });
  // GET /users?q=Анна&page=1&limit=10
}

// Способ 2: через объект
searchUsers2(query: string, page: number): Observable<User[]> {
  return this.http.get<User[]>(`${this.apiUrl}/users`, {
    params: { q: query, page: page.toString() }
  });
}

// Множественные значения одного параметра
filterByRoles(roles: string[]): Observable<User[]> {
  let params = new HttpParams();
  roles.forEach(role => {
    params = params.append('role', role);  // append, не set!
  });
  // GET /users?role=admin&role=editor
  return this.http.get<User[]>(`${this.apiUrl}/users`, { params });
}
```

## Заголовки (HttpHeaders)

```typescript
import { HttpHeaders } from '@angular/common/http';

// Создание заголовков
const headers = new HttpHeaders()
  .set('Content-Type', 'application/json')
  .set('Accept-Language', 'ru')
  .set('X-Custom-Header', 'value');

// Использование
this.http.get<User[]>(url, { headers });

// Через объект
this.http.get<User[]>(url, {
  headers: {
    'Authorization': 'Bearer token123',
    'Accept': 'application/json',
  }
});
```

## Получение полного ответа

По умолчанию HttpClient возвращает только тело ответа. Для доступа к заголовкам и статусу:

```typescript
import { HttpResponse } from '@angular/common/http';

// observe: 'response' — полный HttpResponse
getWithFullResponse(): Observable<HttpResponse<User[]>> {
  return this.http.get<User[]>(`${this.apiUrl}/users`, {
    observe: 'response'
  });
}

// Использование
this.userService.getWithFullResponse().subscribe(response => {
  console.log('Status:', response.status);          // 200
  console.log('Headers:', response.headers);         // HttpHeaders
  console.log('Body:', response.body);               // User[]
  console.log('Total:', response.headers.get('X-Total-Count'));
});
```

### Отслеживание прогресса загрузки

```typescript
import { HttpEventType, HttpEvent } from '@angular/common/http';

uploadFile(file: File): Observable<HttpEvent<any>> {
  const formData = new FormData();
  formData.append('file', file);

  return this.http.post(`${this.apiUrl}/upload`, formData, {
    reportProgress: true,
    observe: 'events',
  });
}

// Использование
this.uploadService.uploadFile(file).subscribe(event => {
  switch (event.type) {
    case HttpEventType.UploadProgress:
      if (event.total) {
        const percent = Math.round(100 * event.loaded / event.total);
        console.log(`Загрузка: ${percent}%`);
      }
      break;
    case HttpEventType.Response:
      console.log('Загрузка завершена', event.body);
      break;
  }
});
```

## Получение текста или Blob

```typescript
// Текстовый ответ
getAsText(): Observable<string> {
  return this.http.get(`${this.apiUrl}/config`, {
    responseType: 'text'
  });
}

// Скачивание файла (Blob)
downloadFile(filename: string): Observable<Blob> {
  return this.http.get(`${this.apiUrl}/files/${filename}`, {
    responseType: 'blob'
  });
}

// Использование для скачивания
this.downloadFile('report.pdf').subscribe(blob => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'report.pdf';
  a.click();
  window.URL.revokeObjectURL(url);
});
```

## Interceptors (перехватчики)

Interceptors позволяют перехватывать и модифицировать HTTP-запросы и ответы.

### Class-based Interceptor

```typescript
// interceptors/auth.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpRequest, HttpHandler, HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('auth_token');

    if (token) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(cloned);
    }

    return next.handle(req);
  }
}
```

Регистрация:

```typescript
// app.module.ts
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,   // Важно! Позволяет несколько interceptors
    },
  ]
})
export class AppModule {}
```

### Functional Interceptor (Angular 15+)

```typescript
// interceptors/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('auth_token');

  if (token) {
    const cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(cloned);
  }

  return next(req);
};
```

Регистрация:

```typescript
// main.ts
bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor, loggingInterceptor])
    ),
  ]
});
```

### Interceptor для логирования

```typescript
export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const started = Date.now();
  console.log(`→ ${req.method} ${req.url}`);

  return next(req).pipe(
    tap({
      next: (event) => {
        if (event instanceof HttpResponse) {
          const elapsed = Date.now() - started;
          console.log(`← ${req.method} ${req.url} [${event.status}] ${elapsed}ms`);
        }
      },
      error: (error) => {
        const elapsed = Date.now() - started;
        console.error(`✗ ${req.method} ${req.url} [${error.status}] ${elapsed}ms`);
      }
    })
  );
};
```

### Interceptor для обработки ошибок

```typescript
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      switch (error.status) {
        case 401:
          // Не авторизован — перенаправляем на логин
          localStorage.removeItem('auth_token');
          router.navigate(['/login']);
          break;
        case 403:
          router.navigate(['/forbidden']);
          break;
        case 404:
          router.navigate(['/not-found']);
          break;
        case 500:
          console.error('Ошибка сервера:', error.message);
          break;
      }
      return throwError(() => error);
    })
  );
};
```

### Interceptor для retry

```typescript
import { HttpInterceptorFn } from '@angular/common/http';
import { retry, timer } from 'rxjs';

export const retryInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    retry({
      count: 3,
      delay: (error, retryCount) => {
        // Не повторяем клиентские ошибки (4xx)
        if (error.status >= 400 && error.status < 500) {
          throw error;
        }
        // Экспоненциальная задержка: 1с, 2с, 4с
        return timer(Math.pow(2, retryCount - 1) * 1000);
      }
    })
  );
};
```

### Порядок выполнения interceptors

Interceptors выполняются в порядке регистрации для запроса и в обратном порядке для ответа:

```
Запрос:  Auth → Logging → Error → Retry → Сервер
Ответ:   Сервер → Retry → Error → Logging → Auth
```

## Обработка ошибок

### В сервисе

```typescript
import { catchError, throwError, retry } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`).pipe(
      retry(2),  // Повторить 2 раза перед ошибкой
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let message: string;

    if (error.status === 0) {
      // Сетевая ошибка или CORS
      message = 'Нет соединения с сервером';
    } else {
      // Ошибка от сервера
      message = `Ошибка ${error.status}: ${error.error?.message || error.statusText}`;
    }

    console.error(message);
    return throwError(() => new Error(message));
  }
}
```

### В компоненте

```typescript
@Component({
  selector: 'app-user-list',
  template: `
    <div *ngIf="loading" class="spinner">Загрузка...</div>
    <div *ngIf="error" class="error">{{ error }}</div>
    <ul *ngIf="users.length > 0">
      <li *ngFor="let user of users">{{ user.name }}</li>
    </ul>
  `
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  loading = false;
  error = '';

  private userService = inject(UserService);

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = '';

    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: (err: Error) => {
        this.error = err.message;
        this.loading = false;
      },
    });
  }
}
```

## CRUD-сервис (полный пример)

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError, map } from 'rxjs';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
}

@Injectable({ providedIn: 'root' })
export class CrudService<T extends { id: number }> {
  protected http = inject(HttpClient);

  constructor(protected baseUrl: string) {}

  getAll(query?: QueryParams): Observable<PaginatedResponse<T>> {
    let params = new HttpParams();
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined) {
          params = params.set(key, String(value));
        }
      });
    }

    return this.http.get<PaginatedResponse<T>>(this.baseUrl, { params }).pipe(
      catchError(this.handleError)
    );
  }

  getById(id: number): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  create(item: Omit<T, 'id'>): Observable<T> {
    return this.http.post<T>(this.baseUrl, item).pipe(
      catchError(this.handleError)
    );
  }

  update(id: number, item: Partial<T>): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}/${id}`, item).pipe(
      catchError(this.handleError)
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('HTTP Error:', error);
    return throwError(() => error);
  }
}
```

Использование:

```typescript
@Injectable({ providedIn: 'root' })
export class UserService extends CrudService<User> {
  constructor() {
    super('https://api.example.com/users');
  }

  // Дополнительные методы
  getUsersByRole(role: string): Observable<User[]> {
    return this.getAll({ search: role }).pipe(
      map(response => response.data)
    );
  }
}
```
