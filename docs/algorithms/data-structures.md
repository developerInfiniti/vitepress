# Структуры данных

## Зачем знать структуры данных?

Выбор правильной структуры данных — это основа эффективного решения задач. На собеседованиях проверяют не только знание структур, но и умение выбрать подходящую для конкретной задачи.

## Массив (Array)

Упорядоченная коллекция элементов с доступом по индексу.

```javascript
const arr = [1, 2, 3, 4, 5];

// Доступ по индексу — O(1)
console.log(arr[2]); // 3

// Поиск элемента — O(n)
arr.indexOf(4); // 3

// Добавление в конец — O(1) амортизировано
arr.push(6);

// Добавление в начало — O(n), сдвиг всех элементов
arr.unshift(0);
```

**Когда использовать**: нужен быстрый доступ по индексу, данные хранятся последовательно.

## Связный список (Linked List)

Последовательность узлов, каждый содержит значение и ссылку на следующий узел.

```javascript
class ListNode {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.size = 0;
  }

  // Добавление в начало — O(1)
  prepend(value) {
    const node = new ListNode(value);
    node.next = this.head;
    this.head = node;
    this.size++;
  }

  // Добавление в конец — O(n)
  append(value) {
    const node = new ListNode(value);
    if (!this.head) {
      this.head = node;
    } else {
      let current = this.head;
      while (current.next) {
        current = current.next;
      }
      current.next = node;
    }
    this.size++;
  }

  // Удаление по значению — O(n)
  remove(value) {
    if (!this.head) return;
    if (this.head.value === value) {
      this.head = this.head.next;
      this.size--;
      return;
    }
    let current = this.head;
    while (current.next && current.next.value !== value) {
      current = current.next;
    }
    if (current.next) {
      current.next = current.next.next;
      this.size--;
    }
  }

  // Поиск — O(n)
  find(value) {
    let current = this.head;
    while (current) {
      if (current.value === value) return current;
      current = current.next;
    }
    return null;
  }

  // Разворот списка — O(n), частая задача на собеседовании!
  reverse() {
    let prev = null;
    let current = this.head;
    while (current) {
      const next = current.next;
      current.next = prev;
      prev = current;
      current = next;
    }
    this.head = prev;
  }
}
```

**Когда использовать**: частые вставки/удаления в начало, не нужен доступ по индексу.

## Стек (Stack)

Принцип LIFO (Last In, First Out) — последним вошёл, первым вышел.

```javascript
class Stack {
  constructor() {
    this.items = [];
  }

  push(item) {    // O(1)
    this.items.push(item);
  }

  pop() {         // O(1)
    return this.items.pop();
  }

  peek() {        // O(1)
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  get size() {
    return this.items.length;
  }
}
```

### Практическое применение: проверка сбалансированности скобок

```javascript
function isBalanced(str) {
  const stack = [];
  const pairs = { '(': ')', '[': ']', '{': '}' };

  for (const char of str) {
    if (pairs[char]) {
      stack.push(char);
    } else if (char === ')' || char === ']' || char === '}') {
      const last = stack.pop();
      if (pairs[last] !== char) return false;
    }
  }

  return stack.length === 0;
}

console.log(isBalanced('({[]})')); // true
console.log(isBalanced('({[)]}'));  // false
console.log(isBalanced('(('));      // false
```

**Где применяется**: вызов функций (call stack), отмена действий (undo), парсинг выражений, браузерная история.

## Очередь (Queue)

Принцип FIFO (First In, First Out) — первым вошёл, первым вышел.

```javascript
class Queue {
  constructor() {
    this.items = {};
    this.head = 0;
    this.tail = 0;
  }

  enqueue(item) {   // O(1)
    this.items[this.tail] = item;
    this.tail++;
  }

  dequeue() {       // O(1)
    if (this.isEmpty()) return undefined;
    const item = this.items[this.head];
    delete this.items[this.head];
    this.head++;
    return item;
  }

  peek() {          // O(1)
    return this.items[this.head];
  }

  isEmpty() {
    return this.tail - this.head === 0;
  }

  get size() {
    return this.tail - this.head;
  }
}
```

**Где применяется**: BFS (обход графа в ширину), обработка задач, очереди сообщений, print queue.

::: tip Почему не `Array.shift()`?
`Array.shift()` имеет сложность O(n), так как сдвигает все элементы. Реализация через объект с указателями `head`/`tail` обеспечивает O(1) для обеих операций.
:::

## Хеш-таблица (Hash Map)

Хранит пары ключ-значение с доступом за O(1) в среднем.

```javascript
// В JavaScript — это Map и обычные объекты
const map = new Map();

// Вставка — O(1) средняя
map.set('name', 'Alice');
map.set('age', 25);

// Поиск — O(1) средняя
map.get('name'); // 'Alice'

// Проверка наличия — O(1) средняя
map.has('age'); // true

// Удаление — O(1) средняя
map.delete('age');
```

### Практическое применение: подсчёт частоты символов

```javascript
function charFrequency(str) {
  const freq = new Map();
  for (const char of str) {
    freq.set(char, (freq.get(char) || 0) + 1);
  }
  return freq;
}

console.log(charFrequency('hello'));
// Map { 'h' => 1, 'e' => 1, 'l' => 2, 'o' => 1 }
```

### Map vs Object

| Критерий | Map | Object |
|----------|-----|--------|
| Ключи | Любые типы | Только строки/символы |
| Порядок | Порядок вставки | Не гарантирован (числовые ключи сортируются) |
| Размер | `map.size` | `Object.keys(obj).length` |
| Итерация | Встроенная (for...of) | Через Object.keys/entries |
| Производительность | Лучше при частых вставках/удалениях | Лучше для статических данных |

## Set (Множество)

Коллекция уникальных значений.

```javascript
const set = new Set([1, 2, 3, 3, 4]);
console.log(set); // Set { 1, 2, 3, 4 }

set.add(5);       // O(1)
set.has(3);       // O(1) — true
set.delete(2);    // O(1)
```

### Практическое применение: удаление дубликатов и пересечение

```javascript
// Удаление дубликатов — O(n)
const unique = [...new Set([1, 2, 2, 3, 3, 3])];
// [1, 2, 3]

// Пересечение двух массивов
function intersection(a, b) {
  const setA = new Set(a);
  return b.filter(item => setA.has(item));
}

console.log(intersection([1, 2, 3], [2, 3, 4])); // [2, 3]
```

## Двоичное дерево поиска (BST)

Дерево, в котором для каждого узла: левые потомки меньше, правые — больше.

```javascript
class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class BST {
  constructor() {
    this.root = null;
  }

  // Вставка — O(log n) средняя, O(n) худшая
  insert(value) {
    const node = new TreeNode(value);
    if (!this.root) {
      this.root = node;
      return;
    }
    let current = this.root;
    while (true) {
      if (value < current.value) {
        if (!current.left) { current.left = node; return; }
        current = current.left;
      } else {
        if (!current.right) { current.right = node; return; }
        current = current.right;
      }
    }
  }

  // Поиск — O(log n) средняя, O(n) худшая
  search(value) {
    let current = this.root;
    while (current) {
      if (value === current.value) return current;
      current = value < current.value ? current.left : current.right;
    }
    return null;
  }

  // Обход in-order (возвращает отсортированный массив)
  inOrder(node = this.root, result = []) {
    if (node) {
      this.inOrder(node.left, result);
      result.push(node.value);
      this.inOrder(node.right, result);
    }
    return result;
  }
}

const tree = new BST();
[8, 3, 10, 1, 6, 14].forEach(v => tree.insert(v));
console.log(tree.inOrder()); // [1, 3, 6, 8, 10, 14]
```

## Куча (Heap) / Приоритетная очередь

Min-Heap: родитель всегда меньше или равен потомкам.

```javascript
class MinHeap {
  constructor() {
    this.heap = [];
  }

  getParentIndex(i) { return Math.floor((i - 1) / 2); }
  getLeftIndex(i) { return 2 * i + 1; }
  getRightIndex(i) { return 2 * i + 2; }

  swap(i, j) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  // Вставка — O(log n)
  insert(value) {
    this.heap.push(value);
    this.bubbleUp(this.heap.length - 1);
  }

  bubbleUp(index) {
    while (index > 0) {
      const parentIndex = this.getParentIndex(index);
      if (this.heap[parentIndex] <= this.heap[index]) break;
      this.swap(parentIndex, index);
      index = parentIndex;
    }
  }

  // Извлечение минимума — O(log n)
  extractMin() {
    if (this.heap.length === 0) return null;
    const min = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.sinkDown(0);
    }
    return min;
  }

  sinkDown(index) {
    const length = this.heap.length;
    while (true) {
      let smallest = index;
      const left = this.getLeftIndex(index);
      const right = this.getRightIndex(index);

      if (left < length && this.heap[left] < this.heap[smallest]) {
        smallest = left;
      }
      if (right < length && this.heap[right] < this.heap[smallest]) {
        smallest = right;
      }
      if (smallest === index) break;
      this.swap(index, smallest);
      index = smallest;
    }
  }

  peek() {  // O(1)
    return this.heap[0];
  }
}
```

**Где применяется**: планировщики задач, алгоритм Дейкстры, нахождение K наименьших/наибольших элементов.

## Граф (Graph)

Структура из вершин (nodes) и рёбер (edges).

```javascript
class Graph {
  constructor() {
    this.adjacencyList = new Map();
  }

  addVertex(vertex) {
    if (!this.adjacencyList.has(vertex)) {
      this.adjacencyList.set(vertex, []);
    }
  }

  addEdge(v1, v2) {
    this.adjacencyList.get(v1).push(v2);
    this.adjacencyList.get(v2).push(v1); // для неориентированного графа
  }

  // BFS — обход в ширину — O(V + E)
  bfs(start) {
    const visited = new Set();
    const queue = [start];
    const result = [];
    visited.add(start);

    while (queue.length > 0) {
      const vertex = queue.shift();
      result.push(vertex);

      for (const neighbor of this.adjacencyList.get(vertex)) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }
    return result;
  }

  // DFS — обход в глубину — O(V + E)
  dfs(start) {
    const visited = new Set();
    const result = [];

    const traverse = (vertex) => {
      visited.add(vertex);
      result.push(vertex);
      for (const neighbor of this.adjacencyList.get(vertex)) {
        if (!visited.has(neighbor)) {
          traverse(neighbor);
        }
      }
    };

    traverse(start);
    return result;
  }
}

const graph = new Graph();
['A', 'B', 'C', 'D', 'E'].forEach(v => graph.addVertex(v));
graph.addEdge('A', 'B');
graph.addEdge('A', 'C');
graph.addEdge('B', 'D');
graph.addEdge('C', 'E');

console.log(graph.bfs('A')); // ['A', 'B', 'C', 'D', 'E']
console.log(graph.dfs('A')); // ['A', 'B', 'D', 'C', 'E']
```

## Сравнение: когда какую структуру выбрать

| Задача | Лучшая структура | Почему |
|--------|------------------|--------|
| Быстрый доступ по индексу | Array | O(1) доступ |
| Быстрый поиск по ключу | Map / Object | O(1) средний |
| Уникальные элементы | Set | Автоматическая дедупликация |
| LIFO (последний вошёл, первый вышел) | Stack | push/pop за O(1) |
| FIFO (первый вошёл, первый вышел) | Queue | enqueue/dequeue за O(1) |
| Отсортированные данные с поиском | BST | O(log n) поиск |
| Быстрый доступ к минимуму/максимуму | Heap | O(1) peek, O(log n) extract |
| Связи между объектами | Graph | Моделирует отношения |
| Частые вставки/удаления в начало | Linked List | O(1) вставка в начало |

## Вопросы на собеседовании

1. **Чем массив отличается от связного списка?**
   — Массив: O(1) доступ по индексу, O(n) вставка в начало. Связный список: O(n) доступ, O(1) вставка в начало.

2. **Когда использовать Map вместо Object?**
   — Когда ключи не строки, нужен порядок вставки, или частые вставки/удаления.

3. **Как реализовать очередь с O(1) операциями?**
   — Через объект с указателями head/tail, а не через Array.shift().

4. **В чём разница между BFS и DFS?**
   — BFS использует очередь и находит кратчайший путь; DFS использует стек/рекурсию и исследует вглубь.

5. **Зачем нужна куча?**
   — Для быстрого доступа к минимальному/максимальному элементу за O(1) с вставкой/удалением за O(log n).
