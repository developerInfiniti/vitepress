---
title: Функции в JavaScript
description: Основы работы с функциями и их особенности
---

# Руководство по функциям в JavaScript

## 1. Объявление функций

### Функциональное выражение
```javascript
const sayHello = function(name) {
  return `Привет, ${name}!`;
};
```

### Стрелочные функции
```javascript
const add = (a, b) => a + b;

const multiply = (a, b) => {
  const result = a * b;
  return result;
};
```

### Объявление функции
```javascript
function greet(name) {
  return `Добро пожаловать, ${name}!`;
}
```

## 2. Параметры функций

### Параметры по умолчанию
```javascript
function greeting(name = "Гость") {
  return `Привет, ${name}!`;
}
```

### Rest-параметры
```javascript
function sum(...numbers) {
  return numbers.reduce((total, num) => total + num, 0);
}
```

## 3. Замыкания

### Пример замыкания
```javascript
function createCounter() {
  let count = 0;
  return function() {
    return ++count;
  };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
```

## 4. Контекст выполнения

### Методы bind, call и apply
```javascript
const person = {
  name: "Иван",
  greet: function(greeting) {
    return `${greeting}, ${this.name}!`;
  }
};

const greetFunction = person.greet.bind(person);
console.log(greetFunction("Привет")); // "Привет, Иван!"

// Использование call
console.log(person.greet.call({ name: "Мария" }, "Здравствуйте")); 

// Использование apply
console.log(person.greet.apply({ name: "Пётр" }, ["Добрый день"]));
```