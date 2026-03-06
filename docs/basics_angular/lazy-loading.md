---
title: Lazy Loading в Angular
description: Ленивая загрузка модулей, PreloadAllModules и пользовательские стратегии предзагрузки
---

# Lazy Loading модулей

Lazy loading (ленивая загрузка) позволяет загружать модули только тогда, когда пользователь переходит на соответствующий маршрут. Это уменьшает начальный размер бандла и ускоряет первую загрузку приложения.

## 1. Базовая настройка

### С NgModule

```typescript
// app-routing.module.ts
const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'shop',
    loadChildren: () => import('./shop/shop.module').then(m => m.ShopModule)
  }
];
```

```typescript
// admin/admin-routing.module.ts
const routes: Routes = [
  { path: '', component: AdminDashboardComponent },
  { path: 'users', component: UsersComponent },
  { path: 'settings', component: SettingsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],  // forChild, не forRoot!
  exports: [RouterModule]
})
export class AdminRoutingModule {}
```

```typescript
// admin/admin.module.ts
@NgModule({
  declarations: [AdminDashboardComponent, UsersComponent, SettingsComponent],
  imports: [CommonModule, AdminRoutingModule]
})
export class AdminModule {}
```

### Со Standalone Components (Angular 14+)

```typescript
// app.routes.ts
const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile.component').then(c => c.ProfileComponent)
  }
];
```

```typescript
// admin/admin.routes.ts
export const ADMIN_ROUTES: Routes = [
  { path: '', component: AdminDashboardComponent },
  { path: 'users', component: UsersComponent },
  { path: 'settings', component: SettingsComponent }
];
```

### loadComponent — ленивая загрузка одного компонента

```typescript
const routes: Routes = [
  {
    path: 'about',
    loadComponent: () => import('./about/about.component').then(c => c.AboutComponent)
  }
];
```

## 2. Как это работает

```
Начальная загрузка:
┌──────────────┐
│  main.js     │  ← содержит AppModule, HomeComponent
│  (200 KB)    │
└──────────────┘

При переходе на /admin:
┌──────────────┐
│  admin.js    │  ← загружается отдельным чанком
│  (80 KB)     │
└──────────────┘

При переходе на /shop:
┌──────────────┐
│  shop.js     │  ← загружается отдельным чанком
│  (120 KB)    │
└──────────────┘
```

Без lazy loading: `main.js = 400 KB` (всё сразу).
С lazy loading: `main.js = 200 KB` + чанки по мере необходимости.

## 3. Preloading Strategies

По умолчанию lazy-модули загружаются только при навигации. Стратегии предзагрузки позволяют загрузить их заранее в фоне.

### PreloadAllModules

Загружает **все** lazy-модули сразу после загрузки приложения:

```typescript
import { PreloadAllModules } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules
    })
  ]
})
export class AppRoutingModule {}
```

Или с `provideRouter`:

```typescript
import { provideRouter, withPreloading, PreloadAllModules } from '@angular/router';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, withPreloading(PreloadAllModules))
  ]
});
```

### NoPreloading (по умолчанию)

```typescript
import { NoPreloading } from '@angular/router';

RouterModule.forRoot(routes, {
  preloadingStrategy: NoPreloading
})
```

### Пользовательская стратегия

Загружаем только маршруты с `data: { preload: true }`:

```typescript
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SelectivePreloadStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    return route.data?.['preload'] ? load() : of(null);
  }
}
```

```typescript
const routes: Routes = [
  {
    path: 'shop',
    loadChildren: () => import('./shop/shop.module').then(m => m.ShopModule),
    data: { preload: true }   // будет предзагружен
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
    // НЕ будет предзагружен
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: SelectivePreloadStrategy
    })
  ]
})
export class AppRoutingModule {}
```

### Стратегия с задержкой

Загружаем lazy-модули через N секунд после старта приложения:

```typescript
@Injectable({ providedIn: 'root' })
export class DelayedPreloadStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    const delay = route.data?.['preloadDelay'] || 3000;
    return timer(delay).pipe(switchMap(() => load()));
  }
}
```

```typescript
const routes: Routes = [
  {
    path: 'reports',
    loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule),
    data: { preloadDelay: 5000 }  // предзагрузка через 5 секунд
  }
];
```

### Стратегия на основе сети

```typescript
@Injectable({ providedIn: 'root' })
export class NetworkAwarePreloadStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    const conn = (navigator as any).connection;

    // Предзагружаем только на быстром соединении
    if (conn) {
      const dominated = conn.saveData || conn.effectiveType === '2g';
      if (dominated) return of(null);
    }

    return route.data?.['preload'] ? load() : of(null);
  }
}
```

## 4. Lazy Loading с Guards

```typescript
const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canActivate: [authGuard],
    canMatch: [isAdminMatch]
  }
];
```

Guard проверяется **до** загрузки модуля. Если guard возвращает `false`, модуль не загружается.

## 5. Проверка lazy loading

### В DevTools

Откройте вкладку Network в Chrome DevTools и при навигации наблюдайте загрузку новых JS-чанков.

### В Angular CLI

```bash
# Посмотреть размеры бандлов
ng build --stats-json

# Или при сборке
ng build
# Initial chunk files (выводится в консоль):
#   main.js       200 kB
#   polyfills.js   35 kB
# Lazy chunk files:
#   admin.js       80 kB
#   shop.js       120 kB
```

### Source Map Explorer

```bash
npm install -g source-map-explorer
ng build --source-map
source-map-explorer dist/app/main.js
```

## 6. Best Practices

| Практика | Описание |
|----------|---------|
| Lazy load по фичам | Каждый feature module — отдельный lazy chunk |
| `forChild()` | Всегда используйте в дочерних модулях (не `forRoot()`) |
| `PreloadAllModules` | Для небольших приложений (до 5-7 модулей) |
| Selective preload | Для крупных приложений с множеством модулей |
| Guards до загрузки | `canMatch`/`canActivate` проверяются до скачивания чанка |
| `loadComponent` | Для отдельных страниц без модуля (standalone) |
| Shared Module | Общие компоненты выносите в SharedModule, не дублируйте |

## Сравнение стратегий предзагрузки

| Стратегия | Когда загружает | Подходит для |
|-----------|----------------|--------------|
| `NoPreloading` | При навигации | Большие приложения, медленные сети |
| `PreloadAllModules` | Сразу после старта | Небольшие приложения |
| Selective | По флагу `preload` | Средние приложения |
| Delayed | Через N секунд | Некритичные модули |
| Network-aware | По скорости сети | Адаптивные приложения |
