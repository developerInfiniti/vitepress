---
title: Масиви в JavaScript
description: Основні концепції та методи роботи з масивами
---

# Керівництво по масивам в JavaScript

## 1. Створення масивів

### Літеральна нотація
```javascript
const fruits = ["яблуко", "банан", "апельсин"];
```

### Конструктор Array
```javascript
const numbers = new Array(1, 2, 3, 4, 5);
```

## 2. Основні методи

### Додавання та видалення елементів
```javascript
const arr = ["один"];

// Додавання в кінець
arr.push("два");              // ["один", "два"]

// Додавання на початок
arr.unshift("нуль");         // ["нуль", "один", "два"]

// Видалення з кінця
const last = arr.pop();      // ["нуль", "один"]

// Видалення з початку
const first = arr.shift();   // ["один"]
```

### Пошук елементів
```javascript
const numbers = [1, 2, 3, 4, 5];

// indexOf - пошук індексу елемента
console.log(numbers.indexOf(3));    // 2

// includes - перевірка наявності елемента
console.log(numbers.includes(6));   // false

// find - пошук елемента за умовою
const found = numbers.find(num => num > 3);  // 4
```

### Перетворення масивів
```javascript
const numbers = [1, 2, 3, 4, 5];

// map - створення нового масиву зі зміненими елементами
const doubled = numbers.map(num => num * 2);  // [2, 4, 6, 8, 10]

// filter - фільтрація елементів
const evenNumbers = numbers.filter(num => num % 2 === 0);  // [2, 4]

// reduce - зведення масиву до одного значення
const sum = numbers.reduce((acc, curr) => acc + curr, 0);  // 15
```

## 3. Сортування та обробка

### Сортування масиву
```javascript
const fruits = ["яблуко", "банан", "апельсин"];

// Просте сортування
fruits.sort();  // ["апельсин", "банан", "яблуко"]

// Сортування з функцією порівняння
const numbers = [10, 5, 8, 1, 3];
numbers.sort((a, b) => a - b);  // [1, 3, 5, 8, 10]
```

### Об'єднання та розділення
```javascript
// Об'єднання масивів
const arr1 = [1, 2];
const arr2 = [3, 4];
const combined = arr1.concat(arr2);  // [1, 2, 3, 4]

// Розділення масиву
const numbers = [1, 2, 3, 4, 5];
const slice = numbers.slice(1, 3);  // [2, 3]
```