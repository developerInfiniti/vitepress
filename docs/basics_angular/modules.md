---
description: "Модули Angular: NgModule, feature modules, shared modules — организация и структура приложения"
---

# Модули Angular (NgModules)

## Что такое NgModule

NgModule — это класс с декоратором `@NgModule`, который организует связанный код в функциональные блоки. Каждое Angular-приложение имеет как минимум один модуль — корневой модуль (`AppModule`).

## Декоратор @NgModule

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserService } from './services/user.service';

@NgModule({
  declarations: [        // Компоненты, директивы, pipes этого модуля
    AppComponent,
    UserListComponent,
  ],
  imports: [             // Другие модули, чья функциональность нужна
    BrowserModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [           // Сервисы, доступные во всём приложении
    UserService,
  ],
  bootstrap: [           // Корневой компонент (только в AppModule)
    AppComponent,
  ],
  exports: [             // Что доступно другим модулям при импорте этого
    UserListComponent,
  ],
})
export class AppModule {}
```

### Свойства @NgModule

| Свойство | Описание |
|---|---|
| `declarations` | Компоненты, директивы и pipes, принадлежащие этому модулю |
| `imports` | Модули, функциональность которых нужна в этом модуле |
| `exports` | Declarations, доступные в шаблонах модулей-импортёров |
| `providers` | Сервисы, создаваемые этим модулем (доступны в инжекторе) |
| `bootstrap` | Корневой компонент (только для AppModule) |

## Корневой модуль (AppModule)

Каждое Angular-приложение запускается с корневого модуля:

```typescript
// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,       // Необходим для запуска в браузере
    AppRoutingModule,    // Маршрутизация
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

```typescript
// main.ts — точка входа
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
```

## Feature-модули

Feature-модули группируют код, связанный с определённой функциональностью:

```typescript
// users/users.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UsersRoutingModule } from './users-routing.module';
import { UserListComponent } from './user-list/user-list.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserFormComponent } from './user-form/user-form.component';

@NgModule({
  declarations: [
    UserListComponent,
    UserDetailComponent,
    UserFormComponent,
  ],
  imports: [
    CommonModule,        // Вместо BrowserModule (ngIf, ngFor и т.д.)
    FormsModule,
    UsersRoutingModule,
  ],
  exports: [
    UserListComponent,   // Доступен при импорте UsersModule
  ]
})
export class UsersModule {}
```

```typescript
// app.module.ts
@NgModule({
  imports: [
    BrowserModule,
    UsersModule,         // Импортируем feature-модуль
  ],
  // ...
})
export class AppModule {}
```

## SharedModule

SharedModule содержит часто используемые компоненты, директивы и pipes:

```typescript
// shared/shared.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { HighlightDirective } from './directives/highlight.directive';
import { TruncatePipe } from './pipes/truncate.pipe';

@NgModule({
  declarations: [
    LoadingSpinnerComponent,
    ConfirmDialogComponent,
    HighlightDirective,
    TruncatePipe,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    // Реэкспорт модулей
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // Экспорт компонентов, директив, pipes
    LoadingSpinnerComponent,
    ConfirmDialogComponent,
    HighlightDirective,
    TruncatePipe,
  ]
})
export class SharedModule {}
```

Теперь другие модули могут импортировать только `SharedModule`:

```typescript
@NgModule({
  imports: [SharedModule],  // Получаем всё из SharedModule
  // ...
})
export class ProductsModule {}
```

## CoreModule

CoreModule содержит singleton-сервисы и компоненты, используемые один раз:

```typescript
// core/core.module.ts
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { AuthService } from './services/auth.service';
import { LoggerService } from './services/logger.service';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
  ],
  providers: [
    AuthService,
    LoggerService,
  ]
})
export class CoreModule {
  // Защита от повторного импорта
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule уже загружен. Импортируйте его только в AppModule.');
    }
  }
}
```

## Lazy Loading (ленивая загрузка)

Модули можно загружать по требованию при навигации:

```typescript
// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'users',
    loadChildren: () => import('./users/users.module')
      .then(m => m.UsersModule)
  },
  {
    path: 'products',
    loadChildren: () => import('./products/products.module')
      .then(m => m.ProductsModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
```

```typescript
// users/users-routing.module.ts
const routes: Routes = [
  { path: '', component: UserListComponent },
  { path: ':id', component: UserDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule {}
```

При lazy loading модуль загружается только когда пользователь переходит на маршрут `/users`.

## Standalone Components (Angular 14+)

Начиная с Angular 14, компоненты можно использовать без NgModules:

```typescript
// user-card.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [CommonModule],   // Импорты прямо в компоненте
  template: `
    <div class="card">
      <h3>{{ name }}</h3>
      <p *ngIf="email">{{ email }}</p>
    </div>
  `
})
export class UserCardComponent {
  @Input() name = '';
  @Input() email = '';
}
```

### Загрузка standalone-приложения

```typescript
// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
  ]
});
```

### Lazy loading standalone компонентов

```typescript
const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component')
      .then(c => c.DashboardComponent)
  },
];
```

## Рекомендуемая структура модулей

```
src/app/
├── core/                    # CoreModule (singleton-сервисы, layout)
│   ├── core.module.ts
│   ├── header/
│   ├── footer/
│   └── services/
├── shared/                  # SharedModule (переиспользуемое)
│   ├── shared.module.ts
│   ├── components/
│   ├── directives/
│   └── pipes/
├── features/                # Feature-модули
│   ├── users/
│   │   ├── users.module.ts
│   │   ├── users-routing.module.ts
│   │   └── components/
│   └── products/
│       ├── products.module.ts
│       └── ...
├── app.module.ts
├── app-routing.module.ts
└── app.component.ts
```

## Сравнение: NgModules vs Standalone

| Аспект | NgModules | Standalone |
|---|---|---|
| Появился | Angular 2 | Angular 14 |
| Организация | Модули группируют компоненты | Компоненты сами управляют импортами |
| Lazy loading | `loadChildren` | `loadComponent` / `loadChildren` |
| Boilerplate | Больше кода | Меньше кода |
| Рекомендация | Legacy-проекты | Новые проекты (Angular 15+) |
