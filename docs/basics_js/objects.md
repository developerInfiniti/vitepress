---
title: Об'єкти в JavaScript
description: Детальне керівництво по роботі з об'єктами в JavaScript
---

# Справочник по об'єктам в JavaScript

[Скачать PDF](./objects.pdf)

## 1. Створення об'єктів

### Літеральна нотація
```javascript
const person = {
  name: "Іван",
  age: 30,
  job: "програміст"
};
```

### Через конструктор Object
```javascript
const person = new Object();
person.name = "Іван";
person.age = 30;
person.job = "програміст";
```

### Через конструктор-функцію
```javascript
function Person(name, age, job) {
  this.name = name;
  this.age = age;
  this.job = job;
}
const ivan = new Person("Іван", 30, "програміст");
```

### Через Object.create()
```javascript
const personProto = {
  greeting: function() {
    return `Привіт, мене звати ${this.name}`;
  }
};
const ivan = Object.create(personProto);
ivan.name = "Іван";
```

## 2. Методи об'єктів

### Додавання методів
```javascript
const person = {
  name: "Іван",
  sayHello() {
    return `Привіт, я ${this.name}!`;
  }
};
```

### Геттери та сеттери
```javascript
const person = {
  firstName: "Іван",
  lastName: "Петров",
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  },
  set fullName(value) {
    [this.firstName, this.lastName] = value.split(" ");
  }
};
```

## 3. Робота з властивостями

### Перевірка існування властивості
```javascript
const person = { name: "Іван" };

// Оператор in
console.log("name" in person); // true

// hasOwnProperty
console.log(person.hasOwnProperty("name")); // true
```

### Видалення властивостей
```javascript
const person = { name: "Іван", age: 30 };
delete person.age;
```

### Перебір властивостей
```javascript
const person = { name: "Іван", age: 30, job: "програміст" };

// for...in
for (let key in person) {
  console.log(`${key}: ${person[key]}`);
}

// Object.keys()
Object.keys(person).forEach(key => {
  console.log(`${key}: ${person[key]}`);
});
```

## Интерактивная песочница

<script setup>
import CodePlayground from '../.vitepress/components/CodePlayground.vue'
import Quiz from '../.vitepress/components/Quiz.vue'
import objectsQuiz from '../.vitepress/data/quiz/objects.json'

const objectsCode = `// Работа с объектами
const user = {
  name: 'Иван',
  age: 30,
  skills: ['JavaScript', 'Vue', 'TypeScript'],
};

// Доступ к свойствам
console.log('Имя:', user.name);
console.log('Навыки:', user.skills.join(', '));

// Object.keys / values / entries
console.log('Ключи:', Object.keys(user));
console.log('Значения:', Object.values(user));

// Деструктуризация
const { name: userName, age: userAge } = user;
console.log('Деструктуризация:', userName, userAge);

// Spread-оператор
const updated = { ...user, age: 31, city: 'Киев' };
console.log('Spread:', updated);

// Object.freeze
const frozen = Object.freeze({ x: 1 });
try {
  frozen.x = 2; // не изменится
} catch (e) {
  // ignored
}
console.log('Frozen:', frozen.x);`
</script>

<CodePlayground
  title="Объекты — Playground"
  :initial-code="objectsCode"
  language="javascript"
  editor-height="320px"
/>

## Тест: Объекты

<Quiz :data="objectsQuiz" />