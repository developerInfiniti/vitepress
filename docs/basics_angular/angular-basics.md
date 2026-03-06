# Основы Angular

## Что такое Angular

Angular — это платформа и фреймворк для создания одностраничных клиентских приложений (SPA), разработанный командой Google. Написан на TypeScript и предоставляет полный набор инструментов для разработки, тестирования и сборки приложений.

### Angular vs AngularJS

| Характеристика | AngularJS (1.x) | Angular (2+) |
|---|---|---|
| Язык | JavaScript | TypeScript |
| Архитектура | MVC | Компонентная |
| Привязка данных | Двусторонняя (dirty checking) | Однонаправленный поток + двусторонняя |
| Модульность | Модули AngularJS | NgModules / Standalone |
| Мобильная поддержка | Нет | Да (Ionic, NativeScript) |
| CLI | Нет | Angular CLI |
| Рендеринг | Только клиентский | SSR (Angular Universal) |

## Архитектура Angular

Angular-приложение строится из нескольких ключевых блоков:

```
┌─────────────────────────────────────────┐
│              Angular App                │
│                                         │
│  ┌──────────┐  ┌──────────┐            │
│  │  Module   │  │  Module   │            │
│  │          │  │          │            │
│  │ ┌──────┐ │  │ ┌──────┐ │            │
│  │ │Comp. │ │  │ │Comp. │ │            │
│  │ └──────┘ │  │ └──────┘ │            │
│  │ ┌──────┐ │  │ ┌──────┐ │            │
│  │ │Serv. │ │  │ │Serv. │ │            │
│  │ └──────┘ │  │ └──────┘ │            │
│  └──────────┘  └──────────┘            │
│                                         │
│  ┌──────────┐  ┌──────────┐            │
│  │  Router   │  │  HttpClient│           │
│  └──────────┘  └──────────┘            │
└─────────────────────────────────────────┘
```

### Основные строительные блоки

- **Модули (NgModules)** — организуют код в функциональные блоки
- **Компоненты** — управляют частями UI (шаблон + логика + стили)
- **Шаблоны** — HTML с Angular-разметкой (директивы, привязки)
- **Сервисы** — бизнес-логика, переиспользуемая между компонентами
- **Dependency Injection** — механизм внедрения зависимостей
- **Директивы** — расширяют поведение HTML-элементов
- **Pipes** — трансформация данных в шаблонах
- **Router** — навигация между представлениями

## Установка и начало работы

### Установка Angular CLI

```bash
npm install -g @angular/cli
```

### Создание нового проекта

```bash
ng new my-app
cd my-app
ng serve
```

При создании проекта CLI задаст вопросы:
- Добавить маршрутизацию? (рекомендуется: Yes)
- Формат стилей? (CSS / SCSS / Sass / Less)

### Структура проекта

```
my-app/
├── src/
│   ├── app/
│   │   ├── app.component.ts        # Корневой компонент
│   │   ├── app.component.html      # Шаблон
│   │   ├── app.component.css       # Стили
│   │   ├── app.component.spec.ts   # Тесты
│   │   ├── app.module.ts           # Корневой модуль
│   │   └── app-routing.module.ts   # Маршрутизация
│   ├── assets/                     # Статические файлы
│   ├── environments/               # Конфигурации окружений
│   ├── index.html                  # Главная HTML-страница
│   ├── main.ts                     # Точка входа
│   └── styles.css                  # Глобальные стили
├── angular.json                    # Конфигурация Angular CLI
├── tsconfig.json                   # Конфигурация TypeScript
├── package.json                    # Зависимости
└── karma.conf.js                   # Конфигурация тестов
```

## Первое приложение: Hello World

### Корневой модуль (`app.module.ts`)

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

### Корневой компонент (`app.component.ts`)

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <h1>{{ title }}</h1>
    <p>Добро пожаловать в Angular!</p>
  `,
  styles: [`
    h1 { color: #1976d2; }
  `]
})
export class AppComponent {
  title = 'Моё первое Angular-приложение';
}
```

### Точка входа (`main.ts`)

```typescript
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
```

### Главная страница (`index.html`)

```html
<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <title>MyApp</title>
  <base href="/">
</head>
<body>
  <app-root></app-root>
</body>
</html>
```

Angular находит элемент `<app-root>` и рендерит в нём корневой компонент.

## Standalone-подход (Angular 14+)

Начиная с Angular 14 можно создавать приложения без NgModules:

```typescript
// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent);
```

```typescript
// app.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `<h1>{{ title }}</h1>`,
})
export class AppComponent {
  title = 'Standalone Angular App';
}
```

## Основные команды Angular CLI

| Команда | Описание |
|---|---|
| `ng new <name>` | Создать новый проект |
| `ng serve` | Запустить dev-сервер (по умолчанию порт 4200) |
| `ng generate component <name>` | Создать компонент |
| `ng generate service <name>` | Создать сервис |
| `ng generate module <name>` | Создать модуль |
| `ng build` | Собрать проект для продакшена |
| `ng test` | Запустить unit-тесты (Karma) |
| `ng lint` | Проверить код линтером |
| `ng add <package>` | Добавить библиотеку с настройкой |
| `ng update` | Обновить Angular и зависимости |

## Версии Angular

| Версия | Год | Ключевые нововведения |
|---|---|---|
| Angular 2 | 2016 | Полностью переписан, TypeScript, компоненты |
| Angular 4 | 2017 | Улучшенный AOT, анимации в отдельном пакете |
| Angular 6 | 2018 | Angular Elements, Tree-shakable providers |
| Angular 8 | 2019 | Differential loading, lazy loading с import() |
| Angular 9 | 2020 | Ivy renderer по умолчанию |
| Angular 12 | 2021 | Strict mode по умолчанию, Tailwind CSS |
| Angular 14 | 2022 | Standalone components, typed forms |
| Angular 16 | 2023 | Signals, SSR improvements |
| Angular 17 | 2023 | Новый синтаксис шаблонов (@if, @for), deferrable views |
| Angular 18 | 2024 | Zoneless change detection, стабильные Signals |
