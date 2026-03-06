# Операторы RxJS

## Что такое оператор

Оператор — это функция, которая принимает Observable и возвращает новый Observable. Операторы применяются через метод `pipe()`:

```typescript
import { of } from 'rxjs';
import { map, filter } from 'rxjs/operators';

of(1, 2, 3, 4, 5).pipe(
  filter(n => n % 2 === 0),   // 2, 4
  map(n => n * 10),            // 20, 40
).subscribe(value => console.log(value));
// 20, 40
```

## Операторы трансформации

### map — преобразование каждого значения

```typescript
import { map } from 'rxjs/operators';

// Преобразование данных из API
this.http.get<{ data: User[] }>('/api/users').pipe(
  map(response => response.data)           // Извлекаем массив из обёртки
);

// Маппинг объектов
this.http.get<User[]>('/api/users').pipe(
  map(users => users.map(u => ({
    ...u,
    fullName: `${u.firstName} ${u.lastName}`,
  })))
);
```

### switchMap — переключение на новый Observable

Отменяет предыдущий внутренний Observable при каждом новом значении. Идеален для поиска:

```typescript
import { switchMap, debounceTime, distinctUntilChanged } from 'rxjs/operators';

// Поиск с автодополнением
this.searchControl.valueChanges.pipe(
  debounceTime(300),           // Ждём 300мс паузы
  distinctUntilChanged(),      // Пропускаем одинаковые
  switchMap(query =>           // Отменяем предыдущий запрос
    this.http.get<User[]>(`/api/users?q=${query}`)
  )
).subscribe(users => this.users = users);
```

```
Ввод: А ---> Ан ---> Анн ---> Анна
                                ↓ (только последний запрос выполняется)
                          GET /api/users?q=Анна
```

### mergeMap (flatMap) — параллельное выполнение

Не отменяет предыдущие Observable. Все выполняются параллельно:

```typescript
import { mergeMap } from 'rxjs/operators';

// Параллельная загрузка деталей для каждого пользователя
this.http.get<number[]>('/api/user-ids').pipe(
  mergeMap(ids =>
    from(ids).pipe(
      mergeMap(id => this.http.get<User>(`/api/users/${id}`))
    )
  )
).subscribe(user => console.log(user));

// С ограничением параллельности
from(urls).pipe(
  mergeMap(url => this.http.get(url), 3)  // Максимум 3 параллельных запроса
);
```

### concatMap — последовательное выполнение

Ждёт завершения предыдущего Observable перед обработкой следующего:

```typescript
import { concatMap } from 'rxjs/operators';

// Последовательное сохранение — порядок гарантирован
from(itemsToSave).pipe(
  concatMap(item => this.http.post('/api/items', item))
).subscribe(result => console.log('Сохранено:', result));

// Цепочка зависимых запросов
this.authService.login(credentials).pipe(
  concatMap(token => this.userService.getProfile(token)),
  concatMap(profile => this.settingsService.getSettings(profile.id)),
).subscribe(settings => console.log(settings));
```

### exhaustMap — игнорирование новых пока выполняется текущий

```typescript
import { exhaustMap } from 'rxjs/operators';

// Защита от двойного клика на кнопке отправки
fromEvent(submitBtn, 'click').pipe(
  exhaustMap(() => this.http.post('/api/orders', orderData))
  // Повторные клики игнорируются пока запрос не завершится
).subscribe(result => console.log('Заказ создан'));
```

### Сравнение операторов маппинга

| Оператор | Поведение | Когда использовать |
|---|---|---|
| `switchMap` | Отменяет предыдущий | Поиск, навигация, последнее значение важно |
| `mergeMap` | Все параллельно | Независимые запросы, не важен порядок |
| `concatMap` | Все последовательно | Порядок важен, зависимые запросы |
| `exhaustMap` | Игнорирует новые | Отправка формы, защита от двойного клика |

## Операторы фильтрации

### filter — пропускает значения по условию

```typescript
import { filter } from 'rxjs/operators';

// Только чётные числа
interval(1000).pipe(
  filter(n => n % 2 === 0)
).subscribe(n => console.log(n)); // 0, 2, 4, 6...

// Только непустые значения
this.searchInput$.pipe(
  filter(query => query.length > 2)  // Минимум 3 символа
);
```

### take — взять первые N значений

```typescript
import { take } from 'rxjs/operators';

// Только первые 5 значений, затем complete
interval(1000).pipe(
  take(5)
).subscribe(n => console.log(n)); // 0, 1, 2, 3, 4

// Только первое значение (аналог Promise)
this.http.get<Config>('/api/config').pipe(
  take(1)
).subscribe(config => this.config = config);
```

### takeUntil — брать пока не сработает другой Observable

```typescript
import { takeUntil, Subject } from 'rxjs';

// Отменить подписку при уничтожении компонента
private destroy$ = new Subject<void>();

ngOnInit(): void {
  this.dataService.stream$.pipe(
    takeUntil(this.destroy$)
  ).subscribe(data => this.process(data));
}

ngOnDestroy(): void {
  this.destroy$.next();
  this.destroy$.complete();
}
```

### takeWhile — брать пока условие истинно

```typescript
import { takeWhile } from 'rxjs/operators';

// Считать пока значение меньше 10
interval(1000).pipe(
  takeWhile(n => n < 10)
).subscribe(n => console.log(n)); // 0, 1, 2, ..., 9
```

### distinctUntilChanged — пропускать дубликаты

```typescript
import { distinctUntilChanged } from 'rxjs/operators';

of(1, 1, 2, 2, 3, 1, 1).pipe(
  distinctUntilChanged()
).subscribe(n => console.log(n)); // 1, 2, 3, 1

// С кастомным сравнением
this.user$.pipe(
  distinctUntilChanged((prev, curr) => prev.id === curr.id)
);
```

### skip — пропустить первые N значений

```typescript
import { skip } from 'rxjs/operators';

// Пропустить начальное значение BehaviorSubject
this.stateService.state$.pipe(
  skip(1)  // Пропускаем начальное значение
).subscribe(state => console.log('Изменение:', state));
```

### debounceTime — задержка эмиссии

```typescript
import { debounceTime } from 'rxjs/operators';

// Ждать 300мс паузы перед эмиссией
this.searchInput$.pipe(
  debounceTime(300)
);
```

### throttleTime — ограничение частоты

```typescript
import { throttleTime } from 'rxjs/operators';

// Максимум одно значение за 1 секунду
fromEvent(window, 'scroll').pipe(
  throttleTime(1000)
).subscribe(() => this.checkScroll());
```

## Операторы комбинирования

### combineLatest — последние значения из нескольких потоков

```typescript
import { combineLatest } from 'rxjs';

// Фильтрация с несколькими критериями
const category$ = this.categoryControl.valueChanges;
const search$ = this.searchControl.valueChanges;
const sort$ = this.sortControl.valueChanges;

combineLatest([category$, search$, sort$]).pipe(
  switchMap(([category, search, sort]) =>
    this.http.get<Product[]>('/api/products', {
      params: { category, search, sort }
    })
  )
).subscribe(products => this.products = products);
```

### forkJoin — ждать завершения всех Observable

```typescript
import { forkJoin } from 'rxjs';

// Параллельные запросы, ждём все
forkJoin({
  users: this.http.get<User[]>('/api/users'),
  products: this.http.get<Product[]>('/api/products'),
  settings: this.http.get<Settings>('/api/settings'),
}).subscribe(({ users, products, settings }) => {
  this.users = users;
  this.products = products;
  this.settings = settings;
});

// С массивом
forkJoin([
  this.http.get('/api/a'),
  this.http.get('/api/b'),
]).subscribe(([a, b]) => { /* ... */ });
```

### merge — объединение потоков в один

```typescript
import { merge } from 'rxjs';

// Слияние событий из нескольких источников
const clicks$ = fromEvent(btn, 'click');
const keys$ = fromEvent(document, 'keypress');

merge(clicks$, keys$).subscribe(event => {
  console.log('Действие пользователя:', event.type);
});
```

### zip — попарное соединение значений

```typescript
import { zip } from 'rxjs';

const names$ = of('Анна', 'Борис', 'Вера');
const ages$ = of(25, 30, 28);

zip(names$, ages$).subscribe(([name, age]) => {
  console.log(`${name}: ${age}`);
});
// Анна: 25, Борис: 30, Вера: 28
```

### startWith — начальное значение

```typescript
import { startWith } from 'rxjs/operators';

this.searchControl.valueChanges.pipe(
  startWith(''),  // Начальное значение пустая строка
  debounceTime(300),
  switchMap(query => this.search(query))
);
```

### withLatestFrom — взять последнее из другого потока

```typescript
import { withLatestFrom } from 'rxjs/operators';

this.saveButton$.pipe(
  withLatestFrom(this.formData$),
  switchMap(([_, formData]) => this.http.post('/api/save', formData))
);
```

## Операторы обработки ошибок

### catchError — перехват ошибки

```typescript
import { catchError, of, EMPTY } from 'rxjs';

// Возврат значения по умолчанию
this.http.get<User[]>('/api/users').pipe(
  catchError(error => {
    console.error('Ошибка:', error);
    return of([]);  // Возвращаем пустой массив
  })
);

// Пробросить модифицированную ошибку
this.http.get('/api/data').pipe(
  catchError(error => {
    return throwError(() => new Error(`Не удалось загрузить: ${error.message}`));
  })
);

// Тихо проглотить ошибку
this.http.get('/api/optional').pipe(
  catchError(() => EMPTY)  // Просто завершить без значения
);
```

### retry и retryWhen — повтор при ошибке

```typescript
import { retry, retryWhen, delay, take } from 'rxjs';

// Простой retry
this.http.get('/api/data').pipe(
  retry(3)  // Повторить до 3 раз
);

// retry с задержкой (Angular/RxJS 7+)
this.http.get('/api/data').pipe(
  retry({
    count: 3,
    delay: 1000,  // 1 секунда между попытками
  })
);

// Экспоненциальный backoff
this.http.get('/api/data').pipe(
  retry({
    count: 3,
    delay: (error, retryCount) => timer(Math.pow(2, retryCount) * 1000)
  })
);
```

### finalize — действие при завершении

```typescript
import { finalize } from 'rxjs/operators';

this.loading = true;

this.http.get<User[]>('/api/users').pipe(
  finalize(() => {
    this.loading = false;  // Выполнится и при success, и при error
  })
).subscribe({
  next: (users) => this.users = users,
  error: (err) => this.error = err.message,
});
```

## Утилитарные операторы

### tap — побочные эффекты без изменения потока

```typescript
import { tap } from 'rxjs/operators';

this.http.get<User[]>('/api/users').pipe(
  tap(users => console.log('Получено пользователей:', users.length)),
  tap(users => this.cache.set('users', users)),
  map(users => users.filter(u => u.isActive)),
  tap(active => console.log('Активных:', active.length)),
);
```

### delay — задержка эмиссии

```typescript
import { delay } from 'rxjs/operators';

of('Готово!').pipe(
  delay(2000)  // Задержка 2 секунды
).subscribe(msg => console.log(msg));
```

### toArray — собрать все значения в массив

```typescript
import { toArray } from 'rxjs/operators';

from([1, 2, 3, 4, 5]).pipe(
  filter(n => n > 2),
  toArray()
).subscribe(arr => console.log(arr)); // [3, 4, 5]
```

### scan — аккумулятор (как reduce, но эмитит промежуточные)

```typescript
import { scan } from 'rxjs/operators';

// Счётчик кликов
fromEvent(button, 'click').pipe(
  scan(count => count + 1, 0)
).subscribe(count => console.log('Кликов:', count));
// 1, 2, 3, 4, ...

// Накопление состояния
actions$.pipe(
  scan((state, action) => {
    switch (action.type) {
      case 'ADD': return [...state, action.payload];
      case 'REMOVE': return state.filter(item => item.id !== action.payload);
      default: return state;
    }
  }, [] as Item[])
);
```

## Практические примеры

### Поиск с автодополнением

```typescript
@Component({
  selector: 'app-search',
  template: `
    <input [formControl]="searchControl" placeholder="Поиск...">
    <ul>
      <li *ngFor="let result of results$ | async">{{ result.name }}</li>
    </ul>
  `
})
export class SearchComponent {
  searchControl = new FormControl('');

  results$ = this.searchControl.valueChanges.pipe(
    debounceTime(300),                    // Ждём паузу
    distinctUntilChanged(),                // Не повторяем одинаковые
    filter(query => query!.length >= 2),   // Минимум 2 символа
    switchMap(query =>                     // Отменяем предыдущий запрос
      this.http.get<any[]>(`/api/search?q=${query}`).pipe(
        catchError(() => of([]))           // При ошибке — пустой массив
      )
    ),
  );

  constructor(private http: HttpClient) {}
}
```

### Polling (периодический опрос)

```typescript
import { timer, switchMap, retry, share } from 'rxjs';

// Опрос каждые 10 секунд
const notifications$ = timer(0, 10000).pipe(
  switchMap(() => this.http.get<Notification[]>('/api/notifications')),
  retry(3),
  share(),   // Общая подписка для всех подписчиков
);
```

### Загрузка данных страницы

```typescript
@Component({
  selector: 'app-dashboard',
  template: `
    <ng-container *ngIf="vm$ | async as vm">
      <app-stats [stats]="vm.stats"></app-stats>
      <app-user-list [users]="vm.users"></app-user-list>
      <app-activity [activities]="vm.activities"></app-activity>
    </ng-container>
  `
})
export class DashboardComponent {
  vm$ = forkJoin({
    stats: this.http.get<Stats>('/api/stats'),
    users: this.http.get<User[]>('/api/users'),
    activities: this.http.get<Activity[]>('/api/activities'),
  });

  constructor(private http: HttpClient) {}
}
```

### Кеширование с shareReplay

```typescript
@Injectable({ providedIn: 'root' })
export class ConfigService {
  private config$?: Observable<AppConfig>;

  getConfig(): Observable<AppConfig> {
    if (!this.config$) {
      this.config$ = this.http.get<AppConfig>('/api/config').pipe(
        shareReplay(1)  // Кешируем результат
      );
    }
    return this.config$;
  }

  // Сброс кеша
  refreshConfig(): void {
    this.config$ = undefined;
  }
}
```

## Шпаргалка: какой оператор выбрать

| Задача | Оператор |
|---|---|
| Преобразовать значение | `map` |
| HTTP-запрос по триггеру (отмена предыдущего) | `switchMap` |
| Параллельные запросы (все) | `mergeMap` или `forkJoin` |
| Последовательные запросы | `concatMap` |
| Защита от двойного клика | `exhaustMap` |
| Отфильтровать значения | `filter` |
| Задержка ввода | `debounceTime` |
| Ограничить скролл | `throttleTime` |
| Пропустить дубликаты | `distinctUntilChanged` |
| Обработать ошибку | `catchError` |
| Повторить при ошибке | `retry` |
| Побочный эффект (лог) | `tap` |
| Начальное значение | `startWith` |
| Взять N первых | `take` |
| Отменить при событии | `takeUntil` |
| Несколько потоков (последние) | `combineLatest` |
| Ждать все завершения | `forkJoin` |
| Слить потоки | `merge` |
| Действие при завершении | `finalize` |
