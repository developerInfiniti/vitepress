# Iterator паттерн

**Iterator** (Итератор) — это поведенческий паттерн, который предоставляет способ последовательного доступа к элементам коллекции без раскрытия её внутренней структуры.

---

## Проблема

```javascript
// ❌ Без паттерна — клиент привязан к внутренней структуре
class UserCollection {
  constructor() {
    this.users = [];
  }

  add(user) {
    this.users.push(user);
  }
}

const collection = new UserCollection();
collection.add({ name: 'Alice', age: 30 });
collection.add({ name: 'Bob', age: 25 });

// Клиент знает о внутреннем массиве
for (let i = 0; i < collection.users.length; i++) {
  console.log(collection.users[i]);
}
// Что если коллекция станет деревом или Map?
// Весь клиентский код сломается!
```

### Проблемы:

1. **Связанность** — клиент зависит от внутренней структуры коллекции
2. **Хрупкость** — смена структуры данных ломает клиентский код
3. **Нет единого интерфейса** — разные коллекции обходятся по-разному
4. **Нет контроля** — нельзя легко фильтровать или преобразовывать обход

---

## Решение

### Визуализация паттерна

```
┌─────────────────┐     ┌──────────────────┐
│   Iterable      │     │    Iterator       │
│ (Collection)    │────▶│                   │
│                 │     │ + next()          │
│ + [Symbol.      │     │ + hasNext()       │
│    iterator]()  │     │                   │
└─────────────────┘     └──────────────────┘
       ▲                        ▲
  ┌────┼────┐              ┌────┼────┐
  │         │              │         │
Array    Tree          ArrayIter  TreeIter
```

### Базовый пример

```javascript
class NumberRange {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }

  // Реализация протокола итератора
  [Symbol.iterator]() {
    let current = this.start;
    const end = this.end;

    return {
      next() {
        if (current <= end) {
          return { value: current++, done: false };
        }
        return { done: true };
      }
    };
  }
}

// Использование
const range = new NumberRange(1, 5);

// for...of работает автоматически
for (const num of range) {
  console.log(num); // 1, 2, 3, 4, 5
}

// Spread оператор тоже
console.log([...range]); // [1, 2, 3, 4, 5]

// Деструктуризация
const [first, second] = range;
console.log(first, second); // 1, 2
```

---

## Практические примеры

### Пример 1: Пагинация данных

```javascript
class PaginatedCollection {
  constructor(items, pageSize = 10) {
    this.items = items;
    this.pageSize = pageSize;
  }

  // Итератор по страницам
  pages() {
    const items = this.items;
    const pageSize = this.pageSize;
    let page = 0;

    return {
      [Symbol.iterator]() {
        return {
          next() {
            const start = page * pageSize;
            if (start < items.length) {
              const pageItems = items.slice(start, start + pageSize);
              page++;
              return {
                value: {
                  items: pageItems,
                  page: page,
                  totalPages: Math.ceil(items.length / pageSize)
                },
                done: false
              };
            }
            return { done: true };
          }
        };
      }
    };
  }

  // Итератор по элементам
  [Symbol.iterator]() {
    let index = 0;
    const items = this.items;

    return {
      next() {
        if (index < items.length) {
          return { value: items[index++], done: false };
        }
        return { done: true };
      }
    };
  }
}

// Использование
const users = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`
}));

const collection = new PaginatedCollection(users, 10);

// Итерация по страницам
for (const page of collection.pages()) {
  console.log(`Страница ${page.page} из ${page.totalPages}:`);
  console.log(page.items.map(u => u.name).join(', '));
}

// Итерация по всем элементам
for (const user of collection) {
  console.log(user.name);
}
```

### Пример 2: Обход дерева

```javascript
class TreeNode {
  constructor(value) {
    this.value = value;
    this.children = [];
  }

  add(child) {
    this.children.push(child);
    return child;
  }

  // Обход в глубину (DFS)
  [Symbol.iterator]() {
    return this.dfs();
  }

  *dfs() {
    yield this.value;
    for (const child of this.children) {
      yield* child.dfs();
    }
  }

  // Обход в ширину (BFS)
  *bfs() {
    const queue = [this];
    while (queue.length > 0) {
      const node = queue.shift();
      yield node.value;
      queue.push(...node.children);
    }
  }
}

// Использование
const root = new TreeNode('CEO');
const vp1 = root.add(new TreeNode('VP Engineering'));
const vp2 = root.add(new TreeNode('VP Sales'));
vp1.add(new TreeNode('Dev Lead'));
vp1.add(new TreeNode('QA Lead'));
vp2.add(new TreeNode('Sales Manager'));

// DFS (по умолчанию)
console.log('DFS:', [...root]);
// ['CEO', 'VP Engineering', 'Dev Lead', 'QA Lead', 'VP Sales', 'Sales Manager']

// BFS
console.log('BFS:', [...root.bfs()]);
// ['CEO', 'VP Engineering', 'VP Sales', 'Dev Lead', 'QA Lead', 'Sales Manager']

// for...of
for (const name of root) {
  console.log(name);
}
```

### Пример 3: Ленивые вычисления с генераторами

```javascript
class LazySequence {
  constructor(generator) {
    this.generator = generator;
  }

  // Фильтрация
  filter(predicate) {
    const gen = this.generator;
    return new LazySequence(function* () {
      for (const item of gen()) {
        if (predicate(item)) {
          yield item;
        }
      }
    });
  }

  // Преобразование
  map(transform) {
    const gen = this.generator;
    return new LazySequence(function* () {
      for (const item of gen()) {
        yield transform(item);
      }
    });
  }

  // Ограничение
  take(count) {
    const gen = this.generator;
    return new LazySequence(function* () {
      let i = 0;
      for (const item of gen()) {
        if (i >= count) return;
        yield item;
        i++;
      }
    });
  }

  // Сбор результатов
  toArray() {
    return [...this.generator()];
  }

  [Symbol.iterator]() {
    return this.generator();
  }

  // Статические фабрики
  static range(start, end) {
    return new LazySequence(function* () {
      for (let i = start; i <= end; i++) {
        yield i;
      }
    });
  }

  static fibonacci() {
    return new LazySequence(function* () {
      let a = 0, b = 1;
      while (true) {
        yield a;
        [a, b] = [b, a + b];
      }
    });
  }
}

// Использование
const evenSquares = LazySequence.range(1, 100)
  .filter(n => n % 2 === 0)
  .map(n => n * n)
  .take(5);

console.log(evenSquares.toArray()); // [4, 16, 36, 64, 100]

// Числа Фибоначчи меньше 100
const fibs = LazySequence.fibonacci()
  .filter(n => n < 100)
  .take(10);

console.log(fibs.toArray()); // [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]

// for...of тоже работает
for (const n of LazySequence.range(1, 5).map(n => n * 10)) {
  console.log(n); // 10, 20, 30, 40, 50
}
```

### Пример 4: Итератор для связанного списка

```javascript
class ListNode {
  constructor(value, next = null) {
    this.value = value;
    this.next = next;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.size = 0;
  }

  prepend(value) {
    this.head = new ListNode(value, this.head);
    this.size++;
  }

  *[Symbol.iterator]() {
    let current = this.head;
    while (current) {
      yield current.value;
      current = current.next;
    }
  }

  // Обратный итератор
  *reversed() {
    const values = [...this];
    for (let i = values.length - 1; i >= 0; i--) {
      yield values[i];
    }
  }
}

const list = new LinkedList();
list.prepend(3);
list.prepend(2);
list.prepend(1);

console.log([...list]);          // [1, 2, 3]
console.log([...list.reversed()]); // [3, 2, 1]

for (const val of list) {
  console.log(val); // 1, 2, 3
}
```

---

## Примеры из реальной жизни

| Библиотека / Инструмент | Где используется |
|--------------------------|------------------|
| **JavaScript** | Array, Map, Set, String — все реализуют Symbol.iterator |
| **Node.js Streams** | Readable streams реализуют async iterator |
| **DOM** | NodeList, HTMLCollection — iterable коллекции |
| **TypeScript** | for...of компилируется в вызовы итератора |
| **RxJS** | Observable — асинхронная версия итератора |

---

## Когда использовать Iterator

### Хорошие случаи:

- **Скрытие структуры** — клиенту не нужно знать, как хранятся данные
- **Несколько способов обхода** — DFS, BFS, фильтрация
- **Ленивые вычисления** — элементы вычисляются по требованию
- **Унификация** — единый интерфейс для разных коллекций

### Когда не нужен:

- **Простые массивы** — встроенный for...of уже работает
- **Одноразовый обход** — проще использовать forEach
- **Маленькие коллекции** — накладные расходы не оправданы

---

## Сравнение с другими паттернами

| Аспект | Iterator | Visitor |
|--------|----------|---------|
| **Цель** | Обход элементов | Операции над элементами |
| **Фокус** | Как обойти | Что делать |
| **Совместимость** | Часто используются вместе | Часто используются вместе |

| Аспект | Iterator | Composite |
|--------|----------|-----------|
| **Цель** | Последовательный обход | Древовидная структура |
| **Связь** | Iterator обходит Composite | Composite содержит элементы |

---

## Резюме

| Аспект | Описание |
|--------|---------|
| **Цель** | Последовательный доступ к элементам без раскрытия структуры |
| **Проблема** | Клиент привязан к внутренней реализации коллекции |
| **Решение** | Вынести логику обхода в отдельный объект-итератор |
| **Плюсы** | Инкапсуляция, единый интерфейс, ленивость, гибкость |
| **Минусы** | Избыточность для простых коллекций |
| **Когда** | Сложные структуры данных, несколько стратегий обхода |
