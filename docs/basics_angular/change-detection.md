---
title: Change Detection в Angular
description: Стратегии обнаружения изменений — Default, OnPush, Signals, зоны и ручное управление
---

# Change Detection

Change Detection (CD) — механизм Angular, который отслеживает изменения данных и обновляет DOM.

## 1. Как работает Change Detection

Angular использует **Zone.js** для перехвата асинхронных операций (события DOM, setTimeout, HTTP-запросы). После каждой такой операции Angular запускает цикл CD.

```
Событие (click, HTTP response, setTimeout)
    ↓
Zone.js перехватывает
    ↓
Angular запускает Change Detection
    ↓
Проходит по дереву компонентов сверху вниз
    ↓
Сравнивает текущие значения с предыдущими
    ↓
Обновляет DOM при обнаружении изменений
```

### Стратегия Default

По умолчанию Angular проверяет **все** компоненты в дереве при каждом цикле CD:

```typescript
@Component({
  selector: 'app-user',
  template: `<p>{{ user.name }}</p>`
  // changeDetection: ChangeDetectionStrategy.Default (по умолчанию)
})
export class UserComponent {
  @Input() user!: { name: string };
}
```

## 2. OnPush Strategy

`OnPush` — компонент проверяется **только** когда:
1. Изменилась ссылка на `@Input()`
2. Произошло событие в самом компоненте или его потомках
3. Сработал `async` pipe
4. Вручную вызван `markForCheck()` или `detectChanges()`

```typescript
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card">
      <h3>{{ user.name }}</h3>
      <p>{{ user.email }}</p>
    </div>
  `
})
export class UserCardComponent {
  @Input() user!: { name: string; email: string };
}
```

### Важно: иммутабельность с OnPush

```typescript
// Родительский компонент

// НЕПРАВИЛЬНО — OnPush НЕ заметит мутацию объекта
updateName() {
  this.user.name = 'Новое имя';  // та же ссылка!
}

// ПРАВИЛЬНО — создаём новый объект (новая ссылка)
updateName() {
  this.user = { ...this.user, name: 'Новое имя' };
}
```

### Мутация массивов

```typescript
// НЕПРАВИЛЬНО
this.items.push(newItem);

// ПРАВИЛЬНО
this.items = [...this.items, newItem];
```

## 3. Ручное управление Change Detection

### ChangeDetectorRef

```typescript
import { ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-manual',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p>Счётчик: {{ counter }}</p>
    <p>Время: {{ currentTime }}</p>
  `
})
export class ManualComponent implements OnInit, OnDestroy {
  counter = 0;
  currentTime = '';
  private intervalId: any;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    // setInterval не вызовет CD с OnPush
    this.intervalId = setInterval(() => {
      this.counter++;
      this.currentTime = new Date().toLocaleTimeString();

      // Вариант 1: пометить для проверки (проверится в следующем цикле CD)
      this.cdr.markForCheck();

      // Вариант 2: запустить CD немедленно для этого компонента и потомков
      // this.cdr.detectChanges();
    }, 1000);
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }
}
```

### Методы ChangeDetectorRef

| Метод | Описание |
|-------|---------|
| `markForCheck()` | Помечает компонент и всех предков для проверки в следующем цикле |
| `detectChanges()` | Запускает CD немедленно для компонента и потомков |
| `detach()` | Отключает CD для компонента (не будет проверяться) |
| `reattach()` | Включает CD обратно |

### Detach/Reattach — полное отключение

```typescript
@Component({
  selector: 'app-static',
  template: `<p>{{ data }}</p>`
})
export class StaticComponent implements OnInit {
  data = 'Статические данные';

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    // Отключаем CD — компонент больше не проверяется
    this.cdr.detach();
  }

  // Обновляем вручную при необходимости
  updateData(newData: string) {
    this.data = newData;
    this.cdr.detectChanges();
  }
}
```

## 4. Async Pipe и OnPush

`async` pipe автоматически вызывает `markForCheck()` при получении нового значения из Observable:

```typescript
@Component({
  selector: 'app-users',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *ngIf="users$ | async as users">
      <div *ngFor="let user of users">
        {{ user.name }}
      </div>
    </div>

    <p>Время: {{ time$ | async }}</p>
  `
})
export class UsersComponent {
  users$ = this.userService.getUsers();
  time$ = interval(1000).pipe(map(() => new Date().toLocaleTimeString()));

  constructor(private userService: UserService) {}
}
```

## 5. Signals (Angular 16+)

Signals — новый реактивный примитив, который точечно уведомляет Angular об изменениях без Zone.js:

```typescript
import { signal, computed, effect } from '@angular/core';

@Component({
  selector: 'app-counter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p>Счётчик: {{ count() }}</p>
    <p>Двойной: {{ doubled() }}</p>
    <button (click)="increment()">+1</button>
  `
})
export class CounterComponent {
  count = signal(0);
  doubled = computed(() => this.count() * 2);

  constructor() {
    // Побочный эффект при изменении сигнала
    effect(() => {
      console.log('Счётчик изменился:', this.count());
    });
  }

  increment() {
    this.count.update(v => v + 1);
    // или this.count.set(this.count() + 1);
  }
}
```

### Методы Signal

| Метод | Описание |
|-------|---------|
| `signal(value)` | Создать сигнал с начальным значением |
| `set(value)` | Установить новое значение |
| `update(fn)` | Обновить на основе текущего значения |
| `computed(fn)` | Вычисляемое значение (кеширование) |
| `effect(fn)` | Побочный эффект при изменении зависимостей |

## 6. NgZone

```typescript
import { NgZone } from '@angular/core';

@Component({ /* ... */ })
export class HeavyComponent {
  constructor(private ngZone: NgZone) {}

  heavyCalculation() {
    // Выполнить вне зоны Angular (не триггерит CD)
    this.ngZone.runOutsideAngular(() => {
      // Тяжёлые вычисления, анимации, WebSocket и т.д.
      requestAnimationFrame(() => this.animate());
    });
  }

  updateUI(result: any) {
    // Вернуться в зону Angular (триггерит CD)
    this.ngZone.run(() => {
      this.data = result;
    });
  }
}
```

## Когда использовать OnPush

| Ситуация | Рекомендация |
|----------|-------------|
| Презентационные компоненты | Всегда OnPush |
| Компоненты с @Input | OnPush + иммутабельность |
| Работа с Observable | OnPush + async pipe |
| Компоненты со Signals | OnPush |
| Контейнерные компоненты | OnPush + async pipe / Signals |
| Формы с ngModel | Default (или OnPush + ручное управление) |

## Сводная таблица

| Стратегия | Когда проверяется | Производительность |
|-----------|------------------|-------------------|
| `Default` | Каждый цикл CD | Ниже |
| `OnPush` | При смене ссылки @Input, событии, async pipe | Выше |
| `Detach` | Только вручную `detectChanges()` | Максимальная |
| `Signals` | Точечно при изменении сигнала | Высокая |
