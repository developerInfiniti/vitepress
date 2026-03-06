---
title: Pipes в Angular
description: Встроенные и пользовательские pipes — преобразование данных в шаблонах
---

# Pipes (Каналы)

Pipes преобразуют данные прямо в шаблоне без изменения исходного значения.

```html
<p>{{ birthday | date:'fullDate' }}</p>
<!-- Результат: "понедельник, 15 апреля 2024 г." -->
```

## 1. Встроенные Pipes

### DatePipe

```html
<p>{{ today | date }}</p>                    <!-- Apr 15, 2024 -->
<p>{{ today | date:'short' }}</p>            <!-- 4/15/24, 12:00 AM -->
<p>{{ today | date:'fullDate' }}</p>         <!-- Monday, April 15, 2024 -->
<p>{{ today | date:'dd.MM.yyyy' }}</p>       <!-- 15.04.2024 -->
<p>{{ today | date:'HH:mm:ss' }}</p>         <!-- 14:30:00 -->
<p>{{ today | date:'dd MMM yyyy':'':'ru' }}</p>  <!-- 15 апр. 2024 -->
```

### CurrencyPipe

```html
<p>{{ price | currency }}</p>                <!-- $1,234.50 -->
<p>{{ price | currency:'EUR' }}</p>          <!-- €1,234.50 -->
<p>{{ price | currency:'RUB':'symbol' }}</p> <!-- ₽1,234.50 -->
<p>{{ price | currency:'RUB':'symbol':'1.0-0' }}</p>  <!-- ₽1,235 -->
```

### DecimalPipe

```html
<p>{{ 3.14159 | number }}</p>              <!-- 3.142 -->
<p>{{ 3.14159 | number:'1.0-2' }}</p>      <!-- 3.14 -->
<p>{{ 3.14159 | number:'3.1-5' }}</p>      <!-- 003.14159 -->
<p>{{ 1234567 | number }}</p>              <!-- 1,234,567 -->
```

Формат: `{минЦелых}.{минДробных}-{максДробных}`

### PercentPipe

```html
<p>{{ 0.259 | percent }}</p>             <!-- 26% -->
<p>{{ 0.259 | percent:'1.1-2' }}</p>     <!-- 25.9% -->
```

### UpperCase / LowerCase / TitleCase

```html
<p>{{ 'hello world' | uppercase }}</p>    <!-- HELLO WORLD -->
<p>{{ 'HELLO WORLD' | lowercase }}</p>    <!-- hello world -->
<p>{{ 'hello world' | titlecase }}</p>    <!-- Hello World -->
```

### SlicePipe

```html
<!-- Для строк -->
<p>{{ 'Angular' | slice:0:3 }}</p>    <!-- Ang -->

<!-- Для массивов -->
<li *ngFor="let item of items | slice:0:5">{{ item }}</li>
<!-- Первые 5 элементов -->
```

### JsonPipe

```html
<pre>{{ user | json }}</pre>
<!-- { "name": "Иван", "age": 25 } -->
```

### AsyncPipe

```html
<!-- Observable -->
<p>{{ user$ | async }}</p>

<!-- С сохранением в переменную -->
<div *ngIf="users$ | async as users">
  <p *ngFor="let user of users">{{ user.name }}</p>
</div>

<!-- Promise -->
<p>{{ dataPromise | async }}</p>
```

`async` pipe автоматически подписывается и отписывается при уничтожении компонента.

### KeyValuePipe

```html
<div *ngFor="let item of myObject | keyvalue">
  {{ item.key }}: {{ item.value }}
</div>
```

```typescript
myObject = { name: 'Иван', age: 25, role: 'admin' };
// name: Иван
// age: 25
// role: admin
```

### Таблица встроенных pipes

| Pipe | Назначение | Пример |
|------|-----------|--------|
| `date` | Форматирование даты | `{{ d \| date:'dd.MM.yyyy' }}` |
| `currency` | Форматирование валюты | `{{ p \| currency:'RUB' }}` |
| `number` | Форматирование числа | `{{ n \| number:'1.0-2' }}` |
| `percent` | Проценты | `{{ n \| percent }}` |
| `uppercase` | Верхний регистр | `{{ s \| uppercase }}` |
| `lowercase` | Нижний регистр | `{{ s \| lowercase }}` |
| `titlecase` | Заглавные буквы | `{{ s \| titlecase }}` |
| `slice` | Подстрока / часть массива | `{{ s \| slice:0:5 }}` |
| `json` | JSON строка | `{{ obj \| json }}` |
| `async` | Подписка на Observable/Promise | `{{ obs$ \| async }}` |
| `keyvalue` | Объект в массив пар | `{{ obj \| keyvalue }}` |
| `i18nPlural` | Склонение по числу | `{{ count \| i18nPlural:mapping }}` |

## 2. Цепочки Pipes

Pipes можно комбинировать:

```html
<p>{{ birthday | date:'fullDate' | uppercase }}</p>
<!-- MONDAY, APRIL 15, 2024 -->

<p>{{ longText | slice:0:100 | lowercase }}</p>
```

## 3. Custom Pipes

### Простой pipe

```typescript
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'truncate' })
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number = 50, trail: string = '...'): string {
    if (!value) return '';
    if (value.length <= limit) return value;
    return value.substring(0, limit) + trail;
  }
}
```

```html
<p>{{ longText | truncate }}</p>           <!-- 50 символов + ... -->
<p>{{ longText | truncate:20 }}</p>        <!-- 20 символов + ... -->
<p>{{ longText | truncate:30:'>>>' }}</p>  <!-- 30 символов + >>> -->
```

### Pipe фильтрации

```typescript
@Pipe({ name: 'filter' })
export class FilterPipe implements PipeTransform {
  transform(items: any[], field: string, value: string): any[] {
    if (!items || !value) return items;
    return items.filter(item =>
      item[field].toLowerCase().includes(value.toLowerCase())
    );
  }
}
```

```html
<input [(ngModel)]="searchTerm">
<li *ngFor="let user of users | filter:'name':searchTerm">
  {{ user.name }}
</li>
```

### Pipe для байтов

```typescript
@Pipe({ name: 'fileSize' })
export class FileSizePipe implements PipeTransform {
  transform(bytes: number, decimals: number = 1): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
  }
}
```

```html
<p>{{ 1536 | fileSize }}</p>         <!-- 1.5 KB -->
<p>{{ 1048576 | fileSize }}</p>      <!-- 1 MB -->
<p>{{ 1073741824 | fileSize:2 }}</p> <!-- 1.00 GB -->
```

### Pipe для относительного времени

```typescript
@Pipe({ name: 'timeAgo' })
export class TimeAgoPipe implements PipeTransform {
  transform(date: Date | string): string {
    const now = new Date();
    const past = new Date(date);
    const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (seconds < 60) return 'только что';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} мин. назад`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} ч. назад`;
    if (seconds < 2592000) return `${Math.floor(seconds / 86400)} дн. назад`;
    return past.toLocaleDateString();
  }
}
```

```html
<p>{{ comment.createdAt | timeAgo }}</p>
<!-- "5 мин. назад", "2 ч. назад", "3 дн. назад" -->
```

## 4. Pure vs Impure Pipes

### Pure Pipe (по умолчанию)

Вызывается **только** при изменении ссылки на входное значение (примитив или новый объект/массив):

```typescript
@Pipe({ name: 'filter', pure: true })  // pure: true — по умолчанию
export class FilterPipe implements PipeTransform {
  transform(items: any[], query: string): any[] {
    return items.filter(item => item.includes(query));
  }
}
```

```typescript
// Pure pipe НЕ заметит push:
this.items.push('новый');  // та же ссылка — pipe не вызовется

// Нужно создать новый массив:
this.items = [...this.items, 'новый'];  // новая ссылка — pipe вызовется
```

### Impure Pipe

Вызывается при **каждом** цикле Change Detection:

```typescript
@Pipe({ name: 'filter', pure: false })  // impure
export class FilterPipe implements PipeTransform {
  transform(items: any[], query: string): any[] {
    return items.filter(item => item.includes(query));
  }
}
```

::: warning Осторожно с impure pipes
Impure pipes вызываются очень часто и могут серьёзно снизить производительность. Используйте только когда действительно необходимо.
:::

| Характеристика | Pure | Impure |
|---------------|------|--------|
| Вызов | При смене ссылки входа | Каждый цикл CD |
| Кеширование | Angular кеширует результат | Нет кеширования |
| Производительность | Высокая | Низкая |
| Применение | Большинство случаев | Редко (фильтры мутабельных данных) |

## 5. Standalone Pipe

```typescript
@Pipe({
  name: 'highlight',
  standalone: true
})
export class HighlightPipe implements PipeTransform {
  transform(text: string, search: string): string {
    if (!search) return text;
    const regex = new RegExp(`(${search})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }
}
```

```typescript
@Component({
  standalone: true,
  imports: [HighlightPipe],
  template: `<p [innerHTML]="text | highlight:searchTerm"></p>`
})
export class SearchResultComponent {}
```

## 6. Pipe с DI (Dependency Injection)

```typescript
@Pipe({ name: 'translate' })
export class TranslatePipe implements PipeTransform {
  constructor(private translateService: TranslateService) {}

  transform(key: string): string {
    return this.translateService.get(key);
  }
}
```

```html
<h1>{{ 'WELCOME_TITLE' | translate }}</h1>
```
