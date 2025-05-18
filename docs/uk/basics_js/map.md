---
title: Map в JavaScript
description: Подробное руководство по работе с Map в JavaScript
---

# Map в JavaScript

## 1. Создание Map

### Базовое создание
```javascript
// Пустой Map
const map = new Map();

// Map с начальными значениями
const map2 = new Map([
  ['key1', 'value1'],
  ['key2', 'value2']
]);
```

## 2. Основные методы

### Добавление и получение элементов
```javascript
const userMap = new Map();

// Добавление элементов
userMap.set('name', 'John');
userMap.set('age', 30);

// Получение значений
console.log(userMap.get('name')); // 'John'
console.log(userMap.get('age')); // 30

// Проверка наличия ключа
console.log(userMap.has('name')); // true
console.log(userMap.has('email')); // false
```

### Удаление элементов
```javascript
// Удаление по ключу
userMap.delete('age');

// Очистка всего Map
userMap.clear();
```

## 3. Итерация по Map

### Различные способы перебора
```javascript
const fruits = new Map([
  ['apple', 5],
  ['banana', 3],
  ['orange', 2]
]);

// Перебор ключей
for (const key of fruits.keys()) {
  console.log(key); // 'apple', 'banana', 'orange'
}

// Перебор значений
for (const value of fruits.values()) {
  console.log(value); // 5, 3, 2
}

// Перебор пар ключ-значение
for (const [key, value] of fruits.entries()) {
  console.log(`${key}: ${value}`);
}

// Использование forEach
fruits.forEach((value, key) => {
  console.log(`${key}: ${value}`);
});
```

## 4. Преимущества Map

### Любые типы ключей
```javascript
const objectMap = new Map();

// Объекты как ключи
const user = { id: 1 };
const settings = { id: 2 };

objectMap.set(user, { name: 'John' });
objectMap.set(settings, { theme: 'dark' });

console.log(objectMap.get(user)); // { name: 'John' }
```

### Размер и производительность
```javascript
const map = new Map([
  ['a', 1],
  ['b', 2]
]);

// Получение размера
console.log(map.size); // 2

// Быстрый доступ к элементам
console.log(map.get('a')); // 1
```

## 5. Преобразования

### Map в массив и обратно
```javascript
const map = new Map([
  ['name', 'John'],
  ['age', 30]
]);

// Map в массив
const array = Array.from(map); // [['name', 'John'], ['age', 30]]
const keys = Array.from(map.keys()); // ['name', 'age']
const values = Array.from(map.values()); // ['John', 30]

// Массив в Map
const pairs = [['name', 'Jane'], ['age', 25]];
const newMap = new Map(pairs);
```

### Map в объект и обратно
```javascript
const map = new Map([
  ['name', 'John'],
  ['age', 30]
]);

// Map в объект
const obj = Object.fromEntries(map); // { name: 'John', age: 30 }

// Объект в Map
const object = { name: 'Jane', age: 25 };
const mapFromObj = new Map(Object.entries(object));
```

## 6. Практические примеры

### Кэширование данных
```javascript
const cache = new Map();

function getData(key) {
  if (cache.has(key)) {
    return cache.get(key);
  }
  
  // Имитация получения данных
  const data = `Data for ${key}`;
  cache.set(key, data);
  return data;
}
```

### Подсчёт частоты элементов
```javascript
const words = ['apple', 'banana', 'apple', 'orange', 'banana', 'apple'];
const frequency = new Map();

words.forEach(word => {
  frequency.set(word, (frequency.get(word) || 0) + 1);
});

console.log(frequency);
// Map(3) { 'apple' => 3, 'banana' => 2, 'orange' => 1 }
```