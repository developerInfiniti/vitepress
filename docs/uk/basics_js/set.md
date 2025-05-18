---
title: Set в JavaScript
description: Подробное руководство по работе с Set в JavaScript
---

# Set в JavaScript

## 1. Создание Set

### Базовое создание
```javascript
// Пустой Set
const set = new Set();

// Set с начальными значениями
const set2 = new Set([1, 2, 3, 3, 4]); // Дубликаты автоматически удаляются
console.log(set2); // Set(4) {1, 2, 3, 4}
```

## 2. Основные методы

### Добавление и удаление элементов
```javascript
const colors = new Set();

// Добавление элементов
colors.add('red');
colors.add('blue').add('green'); // Цепочка вызовов

// Удаление элементов
colors.delete('blue'); // true

// Проверка наличия элемента
console.log(colors.has('red')); // true

// Очистка Set
colors.clear();
```

## 3. Итерация по Set

### Различные способы перебора
```javascript
const fruits = new Set(['apple', 'banana', 'orange']);

// Простой перебор
for (const fruit of fruits) {
  console.log(fruit);
}

// Использование forEach
fruits.forEach(fruit => {
  console.log(fruit);
});

// Получение значений
const values = fruits.values();
console.log(...values); // apple banana orange

// Получение ключей (идентично values для Set)
const keys = fruits.keys();

// Получение пар ключ-значение
const entries = fruits.entries();
```

## 4. Уникальные значения

### Удаление дубликатов
```javascript
const numbers = [1, 2, 2, 3, 3, 4, 5, 5];
const uniqueNumbers = [...new Set(numbers)];
console.log(uniqueNumbers); // [1, 2, 3, 4, 5]

// Удаление дубликатов строк
const strings = ['hello', 'world', 'hello', 'javascript'];
const uniqueStrings = new Set(strings);
console.log(uniqueStrings); // Set(3) {'hello', 'world', 'javascript'}
```

## 5. Операции с множествами

### Объединение, пересечение, разность
```javascript
const set1 = new Set([1, 2, 3]);
const set2 = new Set([2, 3, 4]);

// Объединение
const union = new Set([...set1, ...set2]);
console.log(union); // Set(4) {1, 2, 3, 4}

// Пересечение
const intersection = new Set(
  [...set1].filter(x => set2.has(x))
);
console.log(intersection); // Set(2) {2, 3}

// Разность
const difference = new Set(
  [...set1].filter(x => !set2.has(x))
);
console.log(difference); // Set(1) {1}
```

## 6. Практические примеры

### Фильтрация уникальных объектов
```javascript
const users = [
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' },
  { id: 1, name: 'John' } // Дубликат
];

const uniqueUsers = [...new Set(users.map(JSON.stringify))]
  .map(JSON.parse);

console.log(uniqueUsers); // [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }]
```

### Отслеживание уникальных посещений
```javascript
class PageVisits {
  constructor() {
    this.visits = new Set();
  }

  recordVisit(userId) {
    this.visits.add(userId);
  }

  getUniqueVisits() {
    return this.visits.size;
  }
}

const tracker = new PageVisits();
tracker.recordVisit('user1');
tracker.recordVisit('user2');
tracker.recordVisit('user1'); // Повторное посещение

console.log(tracker.getUniqueVisits()); // 2
```

### Проверка на уникальные символы
```javascript
function hasUniqueChars(str) {
  return new Set(str).size === str.length;
}

console.log(hasUniqueChars('hello')); // false
console.log(hasUniqueChars('world')); // true
```

## 7. WeakSet

### Особенности WeakSet
```javascript
const weakSet = new WeakSet();

let obj1 = { data: 123 };
let obj2 = { data: 456 };

// Добавление объектов
weakSet.add(obj1);
weakSet.add(obj2);

// Проверка наличия
console.log(weakSet.has(obj1)); // true

// При удалении ссылки объект будет автоматически удален из WeakSet
obj1 = null;
```

## 8. Преобразования

### Set в массив и обратно
```javascript
const set = new Set(['a', 'b', 'c']);

// Set в массив
const array = Array.from(set);
// или
const array2 = [...set];

// Массив в Set
const newSet = new Set(array);
```