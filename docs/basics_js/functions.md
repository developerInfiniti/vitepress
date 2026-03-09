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

## Интерактивная песочница

<script setup>
import CodePlayground from '../.vitepress/components/CodePlayground.vue'
import Quiz from '../.vitepress/components/Quiz.vue'
import functionsQuiz from '../.vitepress/data/quiz/functions.json'

const functionsCode = `// Типы функций
// 1. Function Declaration
function greet(name) {
  return 'Привет, ' + name + '!';
}
console.log(greet('Мир'));

// 2. Arrow Function
const double = x => x * 2;
console.log('double(5):', double(5));

// 3. Замыкание
function createCounter() {
  let count = 0;
  return () => ++count;
}
const counter = createCounter();
console.log('counter():', counter());
console.log('counter():', counter());
console.log('counter():', counter());

// 4. Rest-параметры
function sum(...nums) {
  return nums.reduce((a, b) => a + b, 0);
}
console.log('sum(1,2,3,4):', sum(1, 2, 3, 4));

// 5. IIFE
const result = (function(x) { return x * x; })(7);
console.log('IIFE(7):', result);`
</script>

<CodePlayground
  title="Функции — Playground"
  :initial-code="functionsCode"
  language="javascript"
  editor-height="320px"
/>

## Тест: Функции

<Quiz :data="functionsQuiz" />