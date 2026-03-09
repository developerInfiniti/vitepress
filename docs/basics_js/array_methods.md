---
title: Методи масивів у JavaScript
description: Основні методи роботи з масивами та їх короткий опис
---

# Посібник з методів масивів у JavaScript

[Скачать PDF](/basics_js/array_methods.pdf)

## 1. Додавання та видалення елементів

::: details
### push()
Додає один або декілька елементів у кінець масиву.
```javascript
const arr = [1, 2];
arr.push(3, 4); // [1, 2, 3, 4]
```

### pop()
Видаляє останній елемент масиву та повертає його.
```javascript
const arr = [1, 2, 3];
arr.pop(); // 3
console.log(arr); // [1, 2]
```

### shift()
Видаляє перший елемент масиву та повертає його.
```javascript
const arr = [1, 2, 3];
arr.shift(); // 1
console.log(arr); // [2, 3]
```

### unshift()
Додає один або декілька елементів на початок масиву.
```javascript
const arr = [2, 3];
arr.unshift(0, 1); // [0, 1, 2, 3]
```
:::


## 2. Обхід масиву

::: details
### forEach()
Виконує вказану функцію для кожного елемента масиву.
```javascript
const arr = [1, 2, 3];
arr.forEach(num => console.log(num * 2)); // 2, 4, 6
```
:::

## 3. Трансформація масиву

::: details
### map()
Створює новий масив, застосовуючи функцію до кожного елемента.
```javascript
const arr = [1, 2, 3];
const doubled = arr.map(num => num * 2); // [2, 4, 6]
```

### filter()
Створює новий масив, що містить лише елементи, які відповідають умові.
```javascript
const arr = [1, 2, 3, 4];
const even = arr.filter(num => num % 2 === 0); // [2, 4]
```

### reduce()
Застосовує функцію до елементів масиву, зводячи його до одного значення.
```javascript
const arr = [1, 2, 3, 4];
const sum = arr.reduce((acc, num) => acc + num, 0); // 10
```

### structuredClone()
Глибоке клонування масиву або об'єкта.
```javascript
const original = [{ a: 1 }, { b: 2 }];
const clone = structuredClone(original);
clone[0].a = 42;
console.log(original[0].a); // 1
console.log(clone[0].a); // 42
```

Глибоке клонування масиву або об'єкта.
:::

## 4. Пошук елементів
::: details
### find()
Повертає перший елемент, що задовольняє умову.
```javascript
const arr = [1, 2, 3, 4];
const found = arr.find(num => num > 2); // 3
```

### findIndex()
Повертає індекс першого елемента, що задовольняє умову.
```javascript
const arr = [1, 2, 3, 4];
const index = arr.findIndex(num => num > 2); // 2
```

### includes()
Перевіряє, чи містить масив певне значення.
```javascript
const arr = [1, 2, 3];
console.log(arr.includes(2)); // true
```

:::

## 5. Зміна структури масиву
::: details
### slice()
Створює новий масив, що містить частину вихідного масиву.
```javascript
const arr = [1, 2, 3, 4];
const newArr = arr.slice(1, 3); // [2, 3]
```

### splice()
Видаляє, замінює або додає елементи в масив.
```javascript
const arr = [1, 2, 3, 4];
arr.splice(1, 2, "a", "b"); // [1, "a", "b", 4]
```

### concat()
Об'єднує два або більше масивів в один.
```javascript
const arr1 = [1, 2];
const arr2 = [3, 4];
const combined = arr1.concat(arr2); // [1, 2, 3, 4]
```
:::

## 6. Перетворення масиву в рядок
::: details
### join()
Об'єднує елементи масиву в рядок через вказаний роздільник.
```javascript
const arr = ["a", "b", "c"];
const str = arr.join("-"); // "a-b-c"
```

### toString()
Перетворює масив у рядок (еквівалент `join(",")`).
```javascript
const arr = [1, 2, 3];
console.log(arr.toString()); // "1,2,3"
```

:::

---
Ця справочник допоможе швидко згадати основні методи роботи з масивами!

