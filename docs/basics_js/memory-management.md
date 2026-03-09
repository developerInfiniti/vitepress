---
title: Управление памятью в JavaScript
description: Полное руководство по управлению памятью — сборка мусора, утечки памяти, WeakMap/WeakSet, профилирование и оптимизация
---

# Управление памятью в JavaScript

## 1. Сборка мусора (Garbage Collection)

### Как работает память в JS

```javascript
// Жизненный цикл памяти:
// 1. Выделение — при создании переменных, объектов, функций
// 2. Использование — чтение, запись значений
// 3. Освобождение — сборщик мусора удаляет неиспользуемые данные

// Выделение памяти происходит автоматически
const num = 42;                    // Число на стеке
const str = 'Привет';             // Строка в куче
const obj = { name: 'Иван' };     // Объект в куче
const arr = [1, 2, 3];            // Массив в куче
```

### Алгоритм Mark-and-Sweep

```javascript
// Современные JS-движки используют Mark-and-Sweep:
// 1. GC начинает с "корней" (global, window, стек вызовов)
// 2. Рекурсивно помечает все достижимые объекты
// 3. Удаляет непомеченные объекты

// Объект достижим — значит, к нему есть путь от корня
let user = { name: 'Иван' };   // Достижим через user
user = null;                     // Теперь НЕ достижим → будет удалён

// Циклические ссылки — НЕ проблема для Mark-and-Sweep
let a = {};
let b = {};
a.ref = b;
b.ref = a;
a = null;
b = null;
// Оба объекта недостижимы из корня → будут удалены
```

### Поколения объектов (Generational GC)

```javascript
// V8 делит объекты по поколениям:

// Young Generation (новые объекты)
// - Маленькая область (~1-8 MB)
// - Собирается часто и быстро (Minor GC / Scavenge)
// - Большинство объектов умирают молодыми

// Old Generation (выжившие объекты)
// - Большая область
// - Собирается редко (Major GC / Mark-Compact)
// - Объекты, пережившие 2+ цикла Minor GC
```

## 2. Reference Types vs Value Types

### Примитивы (Value Types)

```javascript
// Хранятся на стеке, копируются по значению
let a = 42;
let b = a;     // Копия значения
b = 100;
console.log(a); // 42 — не изменился

// Примитивы: number, string, boolean, null, undefined, symbol, bigint
// Неизменяемые (immutable) — при "изменении" создаётся новое значение
let str = 'hello';
str = str + ' world'; // Создаётся НОВАЯ строка, старая будет удалена GC
```

### Ссылочные типы (Reference Types)

```javascript
// Хранятся в куче, переменная содержит ССЫЛКУ
let obj1 = { name: 'Иван' };
let obj2 = obj1;              // Копия ССЫЛКИ, не объекта
obj2.name = 'Пётр';
console.log(obj1.name);       // 'Пётр' — тот же объект!

// Ссылочные типы: Object, Array, Function, Map, Set, Date, RegExp...
```

### Подсчёт ссылок

```javascript
let user = { name: 'Иван' };  // Ссылка: 1
let admin = user;              // Ссылка: 2
user = null;                   // Ссылка: 1 (всё ещё жив через admin)
admin = null;                  // Ссылка: 0 → можно удалить
```

## 3. Утечки памяти — типичные причины

### 1. Забытые глобальные переменные

```javascript
// УТЕЧКА: случайная глобальная переменная
function processData() {
  // Без let/const/var — создаётся глобальная!
  result = computeHeavy();  // window.result
}

// ИСПРАВЛЕНИЕ: используйте let/const и 'use strict'
'use strict';
function processData() {
  const result = computeHeavy(); // Локальная переменная
  return result;
}
```

### 2. Забытые таймеры и интервалы

```javascript
// УТЕЧКА: интервал не очищен
function startPolling() {
  const data = fetchHeavyData();

  setInterval(() => {
    // Ссылается на data — не будет удалён
    process(data);
  }, 1000);
}

// ИСПРАВЛЕНИЕ: сохраняем ID и очищаем
function startPolling() {
  const data = fetchHeavyData();

  const intervalId = setInterval(() => {
    process(data);
  }, 1000);

  // Очистка при необходимости
  return () => clearInterval(intervalId);
}

const stopPolling = startPolling();
// Позже:
stopPolling();
```

### 3. Забытые обработчики событий

```javascript
// УТЕЧКА: обработчик не удалён
class Component {
  constructor() {
    this.data = new Array(10000).fill('x');
    this.handleResize = () => {
      console.log(this.data.length);
    };
    window.addEventListener('resize', this.handleResize);
  }

  // ИСПРАВЛЕНИЕ: удаляем обработчик при уничтожении
  destroy() {
    window.removeEventListener('resize', this.handleResize);
    this.data = null;
  }
}
```

### 4. Замыкания удерживающие большие данные

```javascript
// УТЕЧКА: замыкание хранит ссылку на массив
function createHandler() {
  const hugeArray = new Array(1000000).fill('data');

  return function() {
    // Даже если не используем hugeArray,
    // он остаётся в памяти из-за замыкания
    console.log('handler called');
  };
}

// ИСПРАВЛЕНИЕ: извлекаем только нужное
function createHandler() {
  const hugeArray = new Array(1000000).fill('data');
  const length = hugeArray.length; // Копируем нужное значение

  return function() {
    console.log(`handler called, length: ${length}`);
  };
  // hugeArray больше не удерживается
}
```

### 5. DOM-ссылки в JavaScript

```javascript
// УТЕЧКА: ссылка на удалённый DOM-элемент
const elements = {};

function setup() {
  const button = document.getElementById('myButton');
  elements.button = button; // JS хранит ссылку

  button.addEventListener('click', onClick);
}

function teardown() {
  const button = document.getElementById('myButton');
  button.remove(); // DOM удалён, но JS-ссылка жива!
}

// ИСПРАВЛЕНИЕ: обнуляем ссылки
function teardown() {
  elements.button.removeEventListener('click', onClick);
  elements.button.remove();
  elements.button = null; // Убираем JS-ссылку
}
```

### 6. Растущие коллекции

```javascript
// УТЕЧКА: массив растёт без ограничений
const logs = [];

function logEvent(event) {
  logs.push({ event, timestamp: Date.now(), data: event.data });
  // logs никогда не очищается!
}

// ИСПРАВЛЕНИЕ: ограничить размер
const MAX_LOGS = 1000;

function logEvent(event) {
  logs.push({ event, timestamp: Date.now(), data: event.data });
  if (logs.length > MAX_LOGS) {
    logs.splice(0, logs.length - MAX_LOGS); // Удаляем старые
  }
}
```

## 4. WeakMap и WeakSet

### WeakMap — слабые ссылки на ключи

```javascript
// Ключи WeakMap удерживаются СЛАБО
// Если на объект-ключ нет других ссылок — он будет удалён GC

const cache = new WeakMap();

function processUser(user) {
  if (cache.has(user)) {
    return cache.get(user);
  }

  const result = expensiveComputation(user);
  cache.set(user, result);
  return result;
}

let user = { name: 'Иван' };
processUser(user);       // Результат закеширован
user = null;             // Объект и кеш будут удалены GC
```

### Приватные данные с WeakMap

```javascript
const privateData = new WeakMap();

class Person {
  constructor(name, age) {
    privateData.set(this, { name, age });
  }

  getName() {
    return privateData.get(this).name;
  }

  getAge() {
    return privateData.get(this).age;
  }
}

let person = new Person('Иван', 25);
person.getName();  // 'Иван'
// Приватные данные недоступны извне
// При удалении person приватные данные удалятся автоматически
```

### WeakSet — слабые ссылки на значения

```javascript
// Отслеживание посещённых объектов без утечек
const visited = new WeakSet();

function processNode(node) {
  if (visited.has(node)) {
    return; // Уже обработан
  }

  visited.add(node);
  // Обработка...
}

// Когда node удаляется из DOM — WeakSet тоже его отпустит
```

### Ограничения WeakMap и WeakSet

```javascript
// Ключи WeakMap — ТОЛЬКО объекты (не примитивы)
const wm = new WeakMap();
wm.set({}, 'ok');       // ОК
// wm.set('key', 'val'); // TypeError!

// НЕ итерируемы — нет forEach, keys(), values(), size
// Это по дизайну — GC может удалить элемент в любой момент

// WeakRef — слабая ссылка на один объект (ES2021)
let obj = { data: 'large' };
const ref = new WeakRef(obj);

ref.deref();  // { data: 'large' } или undefined (если GC удалил)
```

## 5. Performance.memory API

```javascript
// Только в Chrome (с флагом --enable-precise-memory-info)
if (performance.memory) {
  console.log('Heap limit:', performance.memory.jsHeapSizeLimit);
  console.log('Total heap:', performance.memory.totalJSHeapSize);
  console.log('Used heap:', performance.memory.usedJSHeapSize);
}

// Мониторинг использования памяти
function monitorMemory(intervalMs = 5000) {
  return setInterval(() => {
    if (!performance.memory) return;

    const { usedJSHeapSize, totalJSHeapSize } = performance.memory;
    const usedMB = (usedJSHeapSize / 1048576).toFixed(2);
    const totalMB = (totalJSHeapSize / 1048576).toFixed(2);
    const percent = ((usedJSHeapSize / totalJSHeapSize) * 100).toFixed(1);

    console.log(`Память: ${usedMB}MB / ${totalMB}MB (${percent}%)`);
  }, intervalMs);
}
```

## 6. DevTools — профилирование памяти

### Memory панель в Chrome DevTools

```
1. Открыть DevTools → Memory tab

2. Heap Snapshot — мгновенный снимок кучи
   - Показывает все объекты в памяти
   - Сравнение двух снимков для поиска утечек
   - Фильтры: Summary, Comparison, Containment, Statistics

3. Allocation Timeline — запись аллокаций во времени
   - Показывает синие/серые полосы аллокаций
   - Синие = ещё в памяти, серые = удалены GC
   - Поиск объектов, которые не удаляются

4. Allocation Sampling — семплирование аллокаций
   - Низкое влияние на производительность
   - Показывает функции, аллоцирующие больше памяти
```

### Пошаговый поиск утечки

```
1. Откройте Memory → Heap Snapshot → Take Snapshot
2. Выполните действие, подозреваемое в утечке
3. Сделайте ещё один снимок
4. Выберите Comparison между снимками
5. Сортируйте по "# Delta" (новые объекты)
6. Ищите объекты, которые не должны были остаться

// Полезные фильтры:
// - "Detached" — DOM-элементы без привязки
// - "Array" — растущие массивы
// - "Closure" — замыкания удерживающие данные
```

### Performance Monitor

```
1. DevTools → More tools → Performance Monitor
2. Наблюдайте метрики в реальном времени:
   - JS heap size — размер кучи
   - DOM Nodes — количество DOM-узлов
   - JS event listeners — количество обработчиков
   - Documents — количество документов (iframes)
```

## 7. Техники оптимизации

### Пулинг объектов

```javascript
// Переиспользование объектов вместо создания новых
class ObjectPool {
  constructor(factory, reset, initialSize = 10) {
    this.factory = factory;
    this.reset = reset;
    this.pool = [];

    for (let i = 0; i < initialSize; i++) {
      this.pool.push(factory());
    }
  }

  acquire() {
    return this.pool.pop() || this.factory();
  }

  release(obj) {
    this.reset(obj);
    this.pool.push(obj);
  }
}

// Пример: пул для частиц в анимации
const particlePool = new ObjectPool(
  () => ({ x: 0, y: 0, vx: 0, vy: 0, life: 0 }),
  (p) => { p.x = 0; p.y = 0; p.vx = 0; p.vy = 0; p.life = 0; }
);

const particle = particlePool.acquire();
// Используем...
particlePool.release(particle); // Возвращаем в пул
```

### Избегайте частых аллокаций в циклах

```javascript
// ПЛОХО — создаём объект на каждой итерации
function processItems(items) {
  items.forEach(item => {
    const result = { id: item.id, value: transform(item) }; // Новый объект каждый раз
    send(result);
  });
}

// ЛУЧШЕ — переиспользуем объект
function processItems(items) {
  const result = {};
  items.forEach(item => {
    result.id = item.id;
    result.value = transform(item);
    send(result);
  });
}
```

### Освобождение ресурсов

```javascript
// Очистка при размонтировании компонента (Vue)
import { onMounted, onBeforeUnmount } from 'vue';

export default {
  setup() {
    let observer = null;
    let intervalId = null;

    onMounted(() => {
      observer = new IntersectionObserver(callback);
      observer.observe(element);

      intervalId = setInterval(poll, 5000);
    });

    onBeforeUnmount(() => {
      // Обязательная очистка!
      observer?.disconnect();
      clearInterval(intervalId);
    });
  }
};
```

### Ленивая загрузка данных

```javascript
// Вместо загрузки всех данных сразу
// Загружаем по мере необходимости

class LazyList {
  constructor(fetchFn) {
    this.fetchFn = fetchFn;
    this.items = [];
    this.page = 0;
    this.hasMore = true;
  }

  async loadMore(limit = 20) {
    if (!this.hasMore) return;

    const newItems = await this.fetchFn(this.page, limit);
    this.items.push(...newItems);
    this.page++;
    this.hasMore = newItems.length === limit;
  }
}
```

## Справочник

| Проблема | Решение |
|----------|---------|
| Глобальные переменные | `'use strict'`, `let`/`const` |
| Забытые таймеры | `clearInterval()`, `clearTimeout()` |
| Забытые обработчики | `removeEventListener()` |
| DOM-ссылки | Обнулить после `remove()` |
| Растущие коллекции | Ограничить размер |
| Кеш без лимита | `WeakMap` или TTL |
| Замыкания | Извлекать только нужные данные |
| Большие данные | `WeakRef`, ленивая загрузка |
