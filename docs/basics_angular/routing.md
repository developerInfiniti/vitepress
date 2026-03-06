---
title: Routing в Angular
description: Маршрутизация в Angular — конфигурация маршрутов, навигация, параметры, RouterOutlet
---

# Routing в Angular

Angular Router позволяет строить одностраничные приложения (SPA) с навигацией между представлениями без перезагрузки страницы.

## 1. Подключение Router

```typescript
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: '**', component: NotFoundComponent }  // wildcard — 404
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
```

### Standalone-подход (Angular 14+)

```typescript
// app.routes.ts
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
];

// main.ts
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes)]
});
```

## 2. RouterOutlet

`<router-outlet>` — точка вставки, куда Router рендерит компонент текущего маршрута.

```html
<!-- app.component.html -->
<nav>
  <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
    Главная
  </a>
  <a routerLink="/about" routerLinkActive="active">О нас</a>
  <a routerLink="/contact" routerLinkActive="active">Контакты</a>
</nav>

<router-outlet></router-outlet>
```

### Именованные outlet

```html
<router-outlet></router-outlet>
<router-outlet name="sidebar"></router-outlet>
```

```typescript
const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: 'stats', component: StatsComponent, outlet: 'sidebar' }
    ]
  }
];
```

## 3. Навигация

### routerLink (в шаблоне)

```html
<!-- Статическая ссылка -->
<a routerLink="/products">Товары</a>

<!-- Динамическая ссылка с параметрами -->
<a [routerLink]="['/products', product.id]">{{ product.name }}</a>

<!-- С query parameters -->
<a [routerLink]="['/products']" [queryParams]="{ sort: 'price', page: 1 }">
  Товары по цене
</a>

<!-- С фрагментом -->
<a [routerLink]="['/about']" fragment="team">Наша команда</a>
<!-- Результат: /about#team -->
```

### routerLinkActive

```html
<!-- Класс 'active' добавляется когда маршрут совпадает -->
<a routerLink="/home" routerLinkActive="active">Главная</a>

<!-- Точное совпадение (без этого '/' будет active для всех маршрутов) -->
<a routerLink="/"
   routerLinkActive="active"
   [routerLinkActiveOptions]="{ exact: true }">
  Главная
</a>

<!-- Несколько CSS-классов -->
<a routerLink="/admin" routerLinkActive="active highlighted">Админ</a>
```

### router.navigate (программная навигация)

```typescript
import { Router } from '@angular/router';

@Component({ /* ... */ })
export class ProductComponent {
  constructor(private router: Router) {}

  goToProducts() {
    this.router.navigate(['/products']);
  }

  goToProduct(id: number) {
    this.router.navigate(['/products', id]);
  }

  goWithQuery() {
    this.router.navigate(['/products'], {
      queryParams: { sort: 'name', order: 'asc' },
      fragment: 'list'
    });
  }

  // Относительная навигация
  goToChild() {
    this.router.navigate(['details'], { relativeTo: this.route });
  }

  // Замена текущей записи в history (без добавления в стек)
  goReplace() {
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}
```

## 4. Route Parameters

### Параметры маршрута (path params)

```typescript
const routes: Routes = [
  { path: 'products/:id', component: ProductDetailComponent },
  { path: 'users/:userId/posts/:postId', component: PostComponent }
];
```

#### Чтение параметров

```typescript
import { ActivatedRoute } from '@angular/router';

@Component({ /* ... */ })
export class ProductDetailComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // Способ 1: snapshot (одноразовое чтение)
    const id = this.route.snapshot.paramMap.get('id');
    console.log('Product ID:', id);

    // Способ 2: Observable (реактивное — обновляется при смене параметра)
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.loadProduct(Number(id));
    });
  }

  loadProduct(id: number) {
    // загрузка продукта
  }
}
```

### Query Parameters

```typescript
// URL: /products?category=electronics&page=2

@Component({ /* ... */ })
export class ProductListComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // Snapshot
    const category = this.route.snapshot.queryParamMap.get('category');

    // Observable
    this.route.queryParamMap.subscribe(params => {
      const category = params.get('category');
      const page = Number(params.get('page')) || 1;
      this.loadProducts(category, page);
    });
  }
}
```

### Передача данных через state

```typescript
// Отправка
this.router.navigate(['/result'], {
  state: { data: { score: 95, passed: true } }
});

// Получение
const navigation = this.router.getCurrentNavigation();
const state = navigation?.extras.state as { data: any };
// Или через window.history
const state2 = history.state;
```

## 5. Route Data

Статические данные, прикреплённые к маршруту:

```typescript
const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    data: { title: 'Панель администратора', role: 'admin' }
  }
];
```

```typescript
@Component({ /* ... */ })
export class AdminComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const title = this.route.snapshot.data['title'];
    console.log(title); // 'Панель администратора'
  }
}
```

## 6. Дочерние маршруты (Children)

```typescript
const routes: Routes = [
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'users', component: UsersComponent },
      { path: 'users/:id', component: UserDetailComponent },
      { path: 'settings', component: SettingsComponent }
    ]
  }
];
```

```html
<!-- admin-layout.component.html -->
<div class="admin-layout">
  <aside>
    <nav>
      <a routerLink="dashboard" routerLinkActive="active">Дашборд</a>
      <a routerLink="users" routerLinkActive="active">Пользователи</a>
      <a routerLink="settings" routerLinkActive="active">Настройки</a>
    </nav>
  </aside>

  <main>
    <router-outlet></router-outlet>
  </main>
</div>
```

## 7. Redirects

```typescript
const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'old-page', redirectTo: '/new-page' },
  { path: '**', redirectTo: '/home' }  // или component: NotFoundComponent
];
```

### pathMatch

| Значение | Описание |
|----------|---------|
| `'full'` | URL должен полностью совпасть с `path` |
| `'prefix'` | URL начинается с `path` (по умолчанию) |

## 8. History и навигация назад

```typescript
import { Location } from '@angular/common';

@Component({ /* ... */ })
export class DetailComponent {
  constructor(private location: Location) {}

  goBack() {
    this.location.back();
  }

  goForward() {
    this.location.forward();
  }

  // Изменить URL без навигации
  replaceUrl() {
    this.location.replaceState('/new-url');
  }
}
```

## 9. Router Events

```typescript
import { Router, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';

@Component({ /* ... */ })
export class AppComponent implements OnInit {
  isLoading = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isLoading = true;
      }
      if (event instanceof NavigationEnd || event instanceof NavigationError) {
        this.isLoading = false;
      }
    });
  }
}
```

### Основные события

| Событие | Когда |
|---------|-------|
| `NavigationStart` | Начало навигации |
| `RouteConfigLoadStart` | Начало lazy loading модуля |
| `RouteConfigLoadEnd` | Модуль загружен |
| `RoutesRecognized` | Маршрут распознан |
| `GuardsCheckStart` | Начало проверки guards |
| `GuardsCheckEnd` | Guards проверены |
| `ResolveStart` | Начало resolve |
| `ResolveEnd` | Resolve завершён |
| `NavigationEnd` | Навигация завершена |
| `NavigationCancel` | Навигация отменена |
| `NavigationError` | Ошибка навигации |

## Сводная таблица

| Функция | Синтаксис |
|---------|-----------|
| Ссылка в шаблоне | `routerLink="/path"` |
| Динамическая ссылка | `[routerLink]="['/path', id]"` |
| Active класс | `routerLinkActive="class"` |
| Программная навигация | `router.navigate(['/path'])` |
| Path параметр | `:id` в пути, `paramMap.get('id')` |
| Query параметр | `queryParams`, `queryParamMap.get('key')` |
| Назад | `location.back()` |
| Точка вставки | `<router-outlet>` |
| Wildcard | `path: '**'` |
