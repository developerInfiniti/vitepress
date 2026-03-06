# RxJS Observables в Angular

## Что такое RxJS

RxJS (Reactive Extensions for JavaScript) — библиотека для реактивного программирования с использованием Observable. Angular тесно интегрирован с RxJS: HttpClient, Router, Forms, EventEmitter — всё возвращает Observable.

## Observable vs Promise

| Характеристика | Promise | Observable |
|---|---|---|
| Значения | Одно значение | Множество значений (поток) |
| Выполнение | Eager (сразу) | Lazy (при подписке) |
| Отмена | Нельзя отменить | Можно отменить (unsubscribe) |
| Операторы | `.then()`, `.catch()` | `pipe()` с десятками операторов |
| Многоадресность | Нет | Subject, share, shareReplay |

### Пример: Promise

```typescript
const promise = fetch('/api/users')
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));
// Выполняется сразу, нельзя отменить
```

### Пример: Observable

```typescript
import { Observable } from 'rxjs';

const users$ = this.http.get<User[]>('/api/users');
// Ничего не происходит — Observable ленивый

const subscription = users$.subscribe({
  next: (data) => console.log(data),
  error: (err) => console.error(err),
  complete: () => console.log('Завершено'),
});

// Можно отменить
subscription.unsubscribe();
```

## Создание Observable

### Через конструктор

```typescript
import { Observable } from 'rxjs';

const counter$ = new Observable<number>(subscriber => {
  let count = 0;
  const interval = setInterval(() => {
    subscriber.next(count++);
    if (count > 5) {
      subscriber.complete();  // Завершаем поток
      clearInterval(interval);
    }
  }, 1000);

  // Teardown-логика (вызывается при unsubscribe или complete)
  return () => {
    clearInterval(interval);
    console.log('Очистка ресурсов');
  };
});
```

### Через функции-создатели

```typescript
import { of, from, interval, timer, throwError, EMPTY, NEVER, fromEvent } from 'rxjs';

// of — из значений
const values$ = of(1, 2, 3);  // 1, 2, 3, complete

// from — из массива, Promise или итератора
const array$ = from([10, 20, 30]);
const promise$ = from(fetch('/api/data'));

// interval — значения через равные промежутки (мс)
const tick$ = interval(1000);  // 0, 1, 2, 3... каждую секунду

// timer — задержка перед первым значением
const delayed$ = timer(3000);          // одно значение через 3с
const periodic$ = timer(1000, 500);    // первое через 1с, затем каждые 500мс

// fromEvent — из DOM-событий
const clicks$ = fromEvent(document, 'click');
const input$ = fromEvent<InputEvent>(inputEl, 'input');

// throwError — ошибка
const error$ = throwError(() => new Error('Что-то пошло не так'));

// EMPTY — сразу complete
// NEVER — никогда не завершается и не эмитит значения
```

## Подписка (subscribe)

```typescript
// Полная форма
const sub = observable$.subscribe({
  next: (value) => console.log('Значение:', value),
  error: (err) => console.error('Ошибка:', err),
  complete: () => console.log('Поток завершён'),
});

// Сокращённая форма (только next)
const sub = observable$.subscribe(value => console.log(value));

// Отписка
sub.unsubscribe();
```

## Subject — Observable + Observer

Subject — это одновременно Observable (можно подписаться) и Observer (можно отправлять значения).

### Subject

```typescript
import { Subject } from 'rxjs';

const subject = new Subject<string>();

// Подписчик 1
subject.subscribe(value => console.log('A:', value));

subject.next('Привет');   // A: Привет

// Подписчик 2 (не получит предыдущие значения)
subject.subscribe(value => console.log('B:', value));

subject.next('Мир');      // A: Мир, B: Мир
subject.complete();
```

### BehaviorSubject — хранит текущее значение

```typescript
import { BehaviorSubject } from 'rxjs';

const state$ = new BehaviorSubject<string>('начальное значение');

// Новый подписчик сразу получает текущее значение
state$.subscribe(value => console.log('A:', value));
// A: начальное значение

state$.next('обновлено');
// A: обновлено

// Получить текущее значение синхронно
console.log(state$.value); // обновлено

state$.subscribe(value => console.log('B:', value));
// B: обновлено (сразу получает текущее)
```

### ReplaySubject — хранит N последних значений

```typescript
import { ReplaySubject } from 'rxjs';

const replay$ = new ReplaySubject<number>(3); // хранит 3 последних значения

replay$.next(1);
replay$.next(2);
replay$.next(3);
replay$.next(4);

replay$.subscribe(value => console.log(value));
// 2, 3, 4 (последние 3)
```

### AsyncSubject — только последнее значение при complete

```typescript
import { AsyncSubject } from 'rxjs';

const async$ = new AsyncSubject<string>();

async$.subscribe(value => console.log(value));

async$.next('первое');
async$.next('второе');
async$.next('последнее');
// Ничего не выведено

async$.complete();
// 'последнее' — только после complete
```

## Сравнение Subject-ов

| Тип | При подписке получает | Хранит |
|---|---|---|
| `Subject` | Ничего | Ничего |
| `BehaviorSubject` | Текущее значение | 1 (последнее) |
| `ReplaySubject(N)` | N последних значений | N значений |
| `AsyncSubject` | Последнее при complete | 1 (при complete) |

## Использование в Angular-сервисах

### Сервис состояния с BehaviorSubject

```typescript
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);

  // Публичный Observable (только чтение)
  items$: Observable<CartItem[]> = this.itemsSubject.asObservable();

  get totalItems(): number {
    return this.itemsSubject.value.reduce((sum, item) => sum + item.quantity, 0);
  }

  get totalPrice(): number {
    return this.itemsSubject.value.reduce(
      (sum, item) => sum + item.price * item.quantity, 0
    );
  }

  addItem(item: Omit<CartItem, 'quantity'>): void {
    const current = this.itemsSubject.value;
    const existing = current.find(i => i.id === item.id);

    if (existing) {
      existing.quantity++;
      this.itemsSubject.next([...current]);
    } else {
      this.itemsSubject.next([...current, { ...item, quantity: 1 }]);
    }
  }

  removeItem(id: number): void {
    const filtered = this.itemsSubject.value.filter(item => item.id !== id);
    this.itemsSubject.next(filtered);
  }

  clear(): void {
    this.itemsSubject.next([]);
  }
}
```

### Сервис событий с Subject

```typescript
@Injectable({ providedIn: 'root' })
export class EventBusService {
  private eventSubject = new Subject<{ type: string; payload?: any }>();
  events$ = this.eventSubject.asObservable();

  emit(type: string, payload?: any): void {
    this.eventSubject.next({ type, payload });
  }

  on(type: string): Observable<any> {
    return this.events$.pipe(
      filter(event => event.type === type),
      map(event => event.payload)
    );
  }
}

// Использование
this.eventBus.emit('user:login', { id: 1, name: 'Анна' });
this.eventBus.on('user:login').subscribe(user => console.log(user));
```

## AsyncPipe

AsyncPipe автоматически подписывается и отписывается:

```typescript
@Component({
  selector: 'app-user-list',
  template: `
    <ul>
      <li *ngFor="let user of users$ | async">
        {{ user.name }}
      </li>
    </ul>

    <!-- С обработкой загрузки -->
    <ng-container *ngIf="users$ | async as users; else loading">
      <ul>
        <li *ngFor="let user of users">{{ user.name }}</li>
      </ul>
    </ng-container>
    <ng-template #loading>
      <p>Загрузка...</p>
    </ng-template>
  `
})
export class UserListComponent {
  users$ = inject(UserService).getUsers();
}
```

Преимущества AsyncPipe:
- Автоматическая отписка при уничтожении компонента
- Работает с OnPush Change Detection
- Не нужно хранить подписки вручную

## Управление подписками

### Проблема утечек памяти

```typescript
// ПЛОХО — утечка памяти!
@Component({ selector: 'app-bad' })
export class BadComponent implements OnInit {
  ngOnInit(): void {
    interval(1000).subscribe(n => console.log(n));
    // Подписка никогда не отменяется
  }
}
```

### Способ 1: Ручная отписка

```typescript
@Component({ selector: 'app-manual' })
export class ManualComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();

  ngOnInit(): void {
    this.subscription.add(
      interval(1000).subscribe(n => console.log(n))
    );
    this.subscription.add(
      this.someService.data$.subscribe(data => this.data = data)
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();  // Отменяет все вложенные подписки
  }
}
```

### Способ 2: takeUntil (рекомендуется)

```typescript
import { Subject, takeUntil } from 'rxjs';

@Component({ selector: 'app-takeuntil' })
export class TakeUntilComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    interval(1000).pipe(
      takeUntil(this.destroy$)
    ).subscribe(n => console.log(n));

    this.someService.data$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(data => this.data = data);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### Способ 3: DestroyRef (Angular 16+)

```typescript
import { Component, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({ selector: 'app-modern' })
export class ModernComponent {
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    interval(1000).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(n => console.log(n));
  }
}

// Или ещё проще — в поле класса
@Component({ selector: 'app-simple' })
export class SimpleComponent {
  // takeUntilDestroyed() без аргументов работает в контексте конструктора
  data$ = inject(DataService).getData().pipe(
    takeUntilDestroyed()
  );
}
```

### Способ 4: AsyncPipe (лучший для шаблонов)

```typescript
@Component({
  template: `<div *ngFor="let item of items$ | async">{{ item.name }}</div>`
})
export class AsyncComponent {
  items$ = inject(ItemService).getItems(); // Не нужна ручная отписка
}
```

## Hot vs Cold Observable

### Cold Observable — создаёт новый источник для каждого подписчика

```typescript
// HTTP-запрос — cold observable
const users$ = this.http.get<User[]>('/api/users');

users$.subscribe(data => console.log('A:', data));  // Запрос 1
users$.subscribe(data => console.log('B:', data));  // Запрос 2 (отдельный!)
```

### Hot Observable — общий источник для всех подписчиков

```typescript
// Subject — hot observable
const clicks$ = fromEvent(document, 'click');

clicks$.subscribe(e => console.log('A:', e));
clicks$.subscribe(e => console.log('B:', e));
// Один клик — оба получают событие
```

### Превращение Cold в Hot

```typescript
import { share, shareReplay } from 'rxjs';

// share — делит подписку между подписчиками
const shared$ = this.http.get<User[]>('/api/users').pipe(
  share()  // Один запрос для всех подписчиков
);

// shareReplay — + кеширует последние N значений
const cached$ = this.http.get<Config>('/api/config').pipe(
  shareReplay(1)  // Кеширует результат, повторных запросов не будет
);
```
