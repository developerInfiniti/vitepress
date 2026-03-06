---
title: Производительность Angular
description: RxJS паттерны, утечки памяти, AOT компиляция, tree-shaking, оптимизация бандлов, анимации
---

# Производительность и оптимизация Angular

## 1. RxJS Patterns

### Управление подписками

Основная причина утечек памяти — неотписанные подписки на Observable.

#### Способ 1: takeUntilDestroyed (Angular 16+)

```typescript
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({ /* ... */ })
export class UserComponent {
  constructor() {
    this.userService.getUser()
      .pipe(takeUntilDestroyed())
      .subscribe(user => this.user = user);
  }
}
```

#### Способ 2: DestroyRef (Angular 16+)

```typescript
import { DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({ /* ... */ })
export class DataComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.dataService.getData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => this.data = data);
  }
}
```

#### Способ 3: Subject + takeUntil

```typescript
@Component({ /* ... */ })
export class OldComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.service.getData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => this.data = data);

    this.otherService.getOther()
      .pipe(takeUntil(this.destroy$))
      .subscribe(other => this.other = other);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

#### Способ 4: async pipe (автоматическая отписка)

```html
<div *ngIf="user$ | async as user">
  {{ user.name }}
</div>
```

### Когда НЕ нужно отписываться

| Observable | Отписка нужна? | Причина |
|-----------|:--------------:|---------|
| HTTP (HttpClient) | Нет | Завершается после ответа |
| `ActivatedRoute.params` | Нет | Router управляет |
| `async` pipe | Нет | Автоматически |
| `interval()`, `timer()` | Да | Бесконечные |
| `fromEvent()` | Да | Бесконечные |
| WebSocket | Да | Бесконечные |
| `valueChanges` формы | Да | Живёт пока жива форма |

### RxJS для управления состоянием

#### BehaviorSubject как простой стор

```typescript
@Injectable({ providedIn: 'root' })
export class CartService {
  private items$ = new BehaviorSubject<CartItem[]>([]);

  readonly cart$ = this.items$.asObservable();
  readonly total$ = this.items$.pipe(
    map(items => items.reduce((sum, item) => sum + item.price, 0))
  );
  readonly count$ = this.items$.pipe(
    map(items => items.length)
  );

  addItem(item: CartItem) {
    this.items$.next([...this.items$.value, item]);
  }

  removeItem(id: number) {
    this.items$.next(this.items$.value.filter(i => i.id !== id));
  }

  clear() {
    this.items$.next([]);
  }
}
```

#### switchMap для отмены предыдущих запросов

```typescript
// Поиск с автозаменой предыдущего запроса
this.searchControl.valueChanges.pipe(
  debounceTime(300),
  distinctUntilChanged(),
  switchMap(query => this.searchService.search(query)),
  takeUntilDestroyed()
).subscribe(results => this.results = results);
```

#### exhaustMap для предотвращения дублей

```typescript
// Кнопка отправки формы — игнорирует повторные клики
fromEvent(this.submitBtn.nativeElement, 'click').pipe(
  exhaustMap(() => this.formService.submit(this.form.value)),
  takeUntilDestroyed()
).subscribe(response => this.handleSuccess(response));
```

#### concatMap для последовательных запросов

```typescript
// Загрузка файлов строго по порядку
from(this.files).pipe(
  concatMap(file => this.uploadService.upload(file))
).subscribe(result => this.uploadedFiles.push(result));
```

### Обработка ошибок в RxJS

```typescript
this.dataService.getData().pipe(
  retry(3),                              // повторить 3 раза
  catchError(error => {
    console.error('Ошибка:', error);
    return of([]);                       // fallback значение
  }),
  takeUntilDestroyed()
).subscribe(data => this.data = data);
```

## 2. Memory Leaks — типичные причины

### Неотписанные подписки

```typescript
// УТЕЧКА
ngOnInit() {
  this.service.getData().subscribe(data => this.data = data);
}

// ПРАВИЛЬНО
ngOnInit() {
  this.service.getData()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(data => this.data = data);
}
```

### Незакрытые слушатели событий

```typescript
// УТЕЧКА
ngOnInit() {
  window.addEventListener('resize', this.onResize);
}

// ПРАВИЛЬНО
ngOnInit() {
  window.addEventListener('resize', this.onResize);
}
ngOnDestroy() {
  window.removeEventListener('resize', this.onResize);
}

// ИЛИ через RxJS
ngOnInit() {
  fromEvent(window, 'resize').pipe(
    debounceTime(200),
    takeUntilDestroyed(this.destroyRef)
  ).subscribe(() => this.onResize());
}
```

### Незакрытые таймеры

```typescript
// УТЕЧКА
ngOnInit() {
  setInterval(() => this.tick(), 1000);
}

// ПРАВИЛЬНО
private intervalId: any;

ngOnInit() {
  this.intervalId = setInterval(() => this.tick(), 1000);
}
ngOnDestroy() {
  clearInterval(this.intervalId);
}
```

## 3. Performance Optimization

### OnPush стратегия

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
```

### trackBy в ngFor

```html
<!-- Без trackBy — пересоздаёт все DOM-элементы -->
<li *ngFor="let item of items">{{ item.name }}</li>

<!-- С trackBy — переиспользует элементы -->
<li *ngFor="let item of items; trackBy: trackById">{{ item.name }}</li>
```

```typescript
trackById(index: number, item: { id: number }) {
  return item.id;
}
```

### Lazy loading компонентов через @defer (Angular 17+)

```html
@defer (on viewport) {
  <app-heavy-chart [data]="chartData"></app-heavy-chart>
} @placeholder {
  <div>Загрузка графика...</div>
} @loading (minimum 500ms) {
  <app-spinner></app-spinner>
} @error {
  <p>Ошибка загрузки</p>
}
```

Триггеры `@defer`:

| Триггер | Когда загружает |
|---------|----------------|
| `on idle` | Когда браузер свободен |
| `on viewport` | Когда элемент виден |
| `on interaction` | При взаимодействии (клик, фокус) |
| `on hover` | При наведении |
| `on timer(5s)` | Через 5 секунд |
| `when condition` | Когда условие true |

### Virtual Scrolling (CDK)

Для больших списков — рендерит только видимые элементы:

```typescript
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  imports: [ScrollingModule],
  template: `
    <cdk-virtual-scroll-viewport itemSize="50" style="height: 400px">
      <div *cdkVirtualFor="let item of items" class="item">
        {{ item.name }}
      </div>
    </cdk-virtual-scroll-viewport>
  `
})
export class ListComponent {
  items = Array.from({ length: 100000 }, (_, i) => ({ name: `Элемент ${i}` }));
}
```

### Чистые pipes вместо методов в шаблоне

```html
<!-- ПЛОХО — метод вызывается при каждом цикле CD -->
<p>{{ getFullName(user) }}</p>

<!-- ХОРОШО — pipe вызывается только при изменении user -->
<p>{{ user | fullName }}</p>
```

## 4. AOT Compilation

AOT (Ahead-of-Time) — компиляция шаблонов на этапе сборки, а не в браузере.

### AOT vs JIT

| Характеристика | AOT | JIT |
|---------------|-----|-----|
| Когда компилирует | При сборке (build time) | В браузере (runtime) |
| Размер бандла | Меньше (нет компилятора) | Больше (включает компилятор) |
| Скорость запуска | Быстрее | Медленнее |
| Ошибки шаблонов | На этапе сборки | В runtime |
| По умолчанию | `ng build` | `ng serve` (до Angular 9) |

С Angular 9+ AOT используется по умолчанию.

```bash
# AOT (по умолчанию)
ng build

# Явно JIT (для отладки)
ng build --configuration development
```

### Преимущества AOT

1. **Быстрее рендеринг** — шаблоны уже скомпилированы
2. **Меньше бандл** — не нужен Angular Compiler в браузере (~1 MB)
3. **Раннее обнаружение ошибок** — ошибки в шаблонах ловятся при сборке
4. **Безопасность** — шаблоны не инжектируются в runtime

## 5. Tree-shaking и Bundle Optimization

### Tree-shaking

Удаление неиспользуемого кода при сборке:

```typescript
// providedIn: 'root' — tree-shakeable
@Injectable({ providedIn: 'root' })
export class UserService {}

// Через providers в модуле — НЕ tree-shakeable
@NgModule({
  providers: [UserService]  // всегда попадёт в бандл
})
```

### Анализ бандлов

```bash
# С webpack-bundle-analyzer
npm install --save-dev webpack-bundle-analyzer
ng build --stats-json
npx webpack-bundle-analyzer dist/app/stats.json

# С source-map-explorer
ng build --source-map
npx source-map-explorer dist/app/main.js
```

### Оптимизация импортов

```typescript
// ПЛОХО — тянет весь lodash
import _ from 'lodash';
_.get(obj, 'path');

// ХОРОШО — только нужная функция
import get from 'lodash-es/get';
get(obj, 'path');
```

### Бюджеты бандлов

```json
// angular.json
{
  "budgets": [
    {
      "type": "initial",
      "maximumWarning": "500kB",
      "maximumError": "1MB"
    },
    {
      "type": "anyComponentStyle",
      "maximumWarning": "2kB",
      "maximumError": "4kB"
    }
  ]
}
```

## 6. Animations

Angular предоставляет модуль анимаций на основе Web Animations API.

### Подключение

```typescript
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [BrowserAnimationsModule]
})
export class AppModule {}
```

### Базовая анимация

```typescript
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-toggle',
  template: `
    <button (click)="toggle()">Переключить</button>
    <div [@openClose]="isOpen ? 'open' : 'closed'">
      Контент
    </div>
  `,
  animations: [
    trigger('openClose', [
      state('open', style({
        height: '200px',
        opacity: 1,
        backgroundColor: '#28a745'
      })),
      state('closed', style({
        height: '0px',
        opacity: 0,
        backgroundColor: '#dc3545'
      })),
      transition('open => closed', [animate('0.3s ease-in')]),
      transition('closed => open', [animate('0.3s ease-out')])
    ])
  ]
})
export class ToggleComponent {
  isOpen = true;

  toggle() {
    this.isOpen = !this.isOpen;
  }
}
```

### Анимация входа/выхода

```typescript
animations: [
  trigger('fadeInOut', [
    transition(':enter', [
      style({ opacity: 0, transform: 'translateY(-20px)' }),
      animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
    ]),
    transition(':leave', [
      animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(20px)' }))
    ])
  ])
]
```

```html
<div *ngIf="isVisible" @fadeInOut>
  Появляющийся контент
</div>
```

### Анимация списка

```typescript
animations: [
  trigger('listAnimation', [
    transition('* => *', [
      query(':enter', [
        style({ opacity: 0, transform: 'translateX(-30px)' }),
        stagger(100, [
          animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
        ])
      ], { optional: true }),
      query(':leave', [
        stagger(50, [
          animate('200ms ease-in', style({ opacity: 0, transform: 'translateX(30px)' }))
        ])
      ], { optional: true })
    ])
  ])
]
```

```html
<ul [@listAnimation]="items.length">
  <li *ngFor="let item of items">{{ item.name }}</li>
</ul>
```

### Основные функции анимаций

| Функция | Назначение |
|---------|-----------|
| `trigger()` | Определяет анимацию по имени |
| `state()` | Стиль для конкретного состояния |
| `style()` | CSS-стили |
| `transition()` | Переход между состояниями |
| `animate()` | Длительность и easing |
| `query()` | Выбор дочерних элементов |
| `stagger()` | Задержка между элементами |
| `group()` | Параллельные анимации |
| `sequence()` | Последовательные анимации |
| `keyframes()` | Ключевые кадры |

## Чек-лист оптимизации

- [ ] `OnPush` на всех возможных компонентах
- [ ] `trackBy` во всех `*ngFor`
- [ ] `async` pipe вместо ручных подписок
- [ ] Отписка от всех подписок (takeUntilDestroyed)
- [ ] Lazy loading модулей/компонентов
- [ ] `@defer` для тяжёлых компонентов (Angular 17+)
- [ ] Virtual scrolling для больших списков
- [ ] Pure pipes вместо методов в шаблонах
- [ ] Tree-shakeable сервисы (`providedIn: 'root'`)
- [ ] Бюджеты бандлов в angular.json
- [ ] Анализ бандлов (source-map-explorer)
- [ ] Оптимизация импортов (lodash-es вместо lodash)
