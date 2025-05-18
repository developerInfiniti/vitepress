---
title: Об'єкти в JavaScript
description: Детальне керівництво по роботі з об'єктами в JavaScript
---

# Шпаргалка по об'єктам в JavaScript

[Завантажити PDF](./objects.pdf)

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