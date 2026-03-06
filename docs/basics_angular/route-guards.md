---
title: Route Guards в Angular
description: Защита маршрутов — CanActivate, CanDeactivate, Resolve, CanMatch и функциональные guards
---

# Route Guards

Guards (охранники маршрутов) контролируют доступ к маршрутам: разрешают или запрещают навигацию, предзагружают данные.

## 1. CanActivate

Проверяет, может ли пользователь перейти на маршрут.

### Классический подход (интерфейс)

```typescript
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    }

    // Перенаправляем на страницу входа с сохранением URL
    this.router.navigate(['/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }
}
```

```typescript
const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard]
  }
];
```

### Функциональный подход (Angular 15+)

```typescript
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }
  });
};
```

```typescript
const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard]
  }
];
```

### Guard с проверкой ролей

```typescript
export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRole = route.data['role'] as string;
  const userRole = authService.getUserRole();

  if (userRole === requiredRole) {
    return true;
  }

  return router.createUrlTree(['/forbidden']);
};
```

```typescript
const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'admin' }
  }
];
```

### Async Guard (с Observable)

```typescript
export const authGuardAsync: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated$.pipe(
    map(isAuth => {
      if (isAuth) return true;
      return router.createUrlTree(['/login']);
    })
  );
};
```

## 2. CanActivateChild

Проверяет доступ ко **всем дочерним маршрутам** родителя. Работает как CanActivate, но применяется к children.

```typescript
export const adminChildGuard: CanActivateChildFn = (route, state) => {
  const authService = inject(AuthService);
  return authService.isAdmin();
};
```

```typescript
const routes: Routes = [
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivateChild: [adminChildGuard],
    children: [
      { path: 'users', component: UsersComponent },
      { path: 'settings', component: SettingsComponent },
      // Guard применяется ко всем дочерним маршрутам
    ]
  }
];
```

## 3. CanDeactivate

Спрашивает пользователя перед уходом со страницы (например, есть несохранённые данные).

```typescript
export interface CanComponentDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}

export const unsavedChangesGuard: CanDeactivateFn<CanComponentDeactivate> = (component) => {
  return component.canDeactivate ? component.canDeactivate() : true;
};
```

### Компонент с несохранёнными данными

```typescript
@Component({
  selector: 'app-edit-form',
  template: `
    <form [formGroup]="form">
      <input formControlName="title">
      <textarea formControlName="content"></textarea>
      <button (click)="save()">Сохранить</button>
    </form>
  `
})
export class EditFormComponent implements CanComponentDeactivate {
  form = this.fb.group({
    title: [''],
    content: ['']
  });

  saved = false;

  constructor(private fb: FormBuilder) {}

  save() {
    // Сохранение данных
    this.saved = true;
  }

  canDeactivate(): boolean {
    if (this.saved || this.form.pristine) {
      return true;
    }
    return confirm('У вас есть несохранённые изменения. Покинуть страницу?');
  }
}
```

```typescript
const routes: Routes = [
  {
    path: 'edit/:id',
    component: EditFormComponent,
    canDeactivate: [unsavedChangesGuard]
  }
];
```

## 4. Resolve

Предзагружает данные **до** перехода на маршрут. Компонент получает уже готовые данные.

### Функциональный Resolver

```typescript
import { ResolveFn } from '@angular/router';

export const productResolver: ResolveFn<Product> = (route, state) => {
  const productService = inject(ProductService);
  const id = Number(route.paramMap.get('id'));
  return productService.getById(id);
};
```

```typescript
const routes: Routes = [
  {
    path: 'products/:id',
    component: ProductDetailComponent,
    resolve: { product: productResolver }
  }
];
```

### Получение данных в компоненте

```typescript
@Component({
  selector: 'app-product-detail',
  template: `
    <h1>{{ product.name }}</h1>
    <p>{{ product.description }}</p>
    <span>{{ product.price }} руб.</span>
  `
})
export class ProductDetailComponent implements OnInit {
  product!: Product;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // Snapshot
    this.product = this.route.snapshot.data['product'];

    // Или реактивно
    this.route.data.subscribe(data => {
      this.product = data['product'];
    });
  }
}
```

### Resolver с обработкой ошибок

```typescript
export const productResolver: ResolveFn<Product | null> = (route, state) => {
  const productService = inject(ProductService);
  const router = inject(Router);
  const id = Number(route.paramMap.get('id'));

  return productService.getById(id).pipe(
    catchError(() => {
      router.navigate(['/not-found']);
      return of(null);
    })
  );
};
```

## 5. CanMatch (Angular 14.1+)

Определяет, подходит ли маршрут для текущего URL. Если `false`, Router пробует следующий маршрут.

```typescript
export const isAdminMatch: CanMatchFn = (route, segments) => {
  return inject(AuthService).isAdmin();
};
```

```typescript
const routes: Routes = [
  {
    path: 'dashboard',
    component: AdminDashboardComponent,
    canMatch: [isAdminMatch]
  },
  {
    path: 'dashboard',
    component: UserDashboardComponent  // fallback для обычных пользователей
  }
];
```

## 6. Комбинирование Guards

```typescript
const routes: Routes = [
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard],           // проверка авторизации
    canActivateChild: [roleGuard],      // проверка ролей для детей
    children: [
      {
        path: 'users/:id/edit',
        component: EditUserComponent,
        canDeactivate: [unsavedChangesGuard],  // защита от потери данных
        resolve: { user: userResolver }         // предзагрузка данных
      }
    ]
  }
];
```

## Порядок выполнения Guards

1. `CanMatch` — подходит ли маршрут
2. `CanActivate` — можно ли активировать маршрут
3. `CanActivateChild` — можно ли активировать дочерний маршрут
4. `Resolve` — загрузка данных
5. (при уходе) `CanDeactivate` — можно ли покинуть маршрут

## Сводная таблица

| Guard | Назначение | Возвращает |
|-------|-----------|------------|
| `CanActivate` | Доступ к маршруту | `boolean \| UrlTree \| Observable` |
| `CanActivateChild` | Доступ к дочерним маршрутам | `boolean \| UrlTree \| Observable` |
| `CanDeactivate` | Уход с маршрута | `boolean \| Observable` |
| `Resolve` | Предзагрузка данных | `T \| Observable<T>` |
| `CanMatch` | Выбор маршрута по условию | `boolean \| UrlTree` |
