---
title: Методы объектов в JavaScript
description: Основные методы работы с объектами в JavaScript
---

# Методы объектов в JavaScript

## 1. Object.keys(obj)
Возвращает массив ключей объекта.
```javascript
const user = { name: "Иван", age: 30 };
console.log(Object.keys(user)); // ["name", "age"]
```

## 2. Object.values(obj)
Возвращает массив значений объекта.
```javascript
console.log(Object.values(user)); // ["Иван", 30]
```

## 3. Object.entries(obj)
Возвращает массив пар [ключ, значение].
```javascript
console.log(Object.entries(user)); // [["name", "Иван"], ["age", 30]]
```

## 4. Object.assign(target, ...sources)
Копирует свойства из одного или нескольких объектов в целевой объект.
```javascript
const target = { a: 1 };
const source = { b: 2 };
Object.assign(target, source);
console.log(target); // { a: 1, b: 2 }
```

## 5. Object.freeze(obj)
Запрещает изменение свойств объекта.
```javascript
const obj = { name: "Анна" };
Object.freeze(obj);
obj.name = "Олег"; // Ошибка в строгом режиме
console.log(obj.name); // "Анна"
```

## 6. Object.seal(obj)
Запрещает добавление и удаление свойств, но позволяет изменять существующие.
```javascript
const obj2 = { age: 25 };
Object.seal(obj2);
obj2.age = 30; // Разрешено
obj2.city = "Москва"; // Не добавится
console.log(obj2); // { age: 30 }
```

## 7. Object.hasOwnProperty(key)
Проверяет, есть ли у объекта собственное (не унаследованное) свойство.
```javascript
console.log(user.hasOwnProperty("name")); // true
console.log(user.hasOwnProperty("toString")); // false
```

## 8. Object.getOwnPropertyDescriptors(obj)
Возвращает полное описание свойств объекта (включая флаги).
```javascript
console.log(Object.getOwnPropertyDescriptors(user));
```

## 9. Object.create(proto, propertiesObject)
Создает новый объект с указанным прототипом.
```javascript
const animal = { type: "млекопитающее" };
const dog = Object.create(animal);
console.log(dog.type); // "млекопитающее"
```

## 10. structuredClone(obj)
Глубоко клонирует объект.
```javascript
const original = { name: "Игорь", details: { age: 35 } };
const copy = structuredClone(original);
copy.details.age = 40;
console.log(original.details.age); // 35
```

