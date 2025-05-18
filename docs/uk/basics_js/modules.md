---
title: Модули в JavaScript
description: Руководство по работе с модулями в JavaScript
---

# Модули в JavaScript

## 1. Экспорт

### Именованный экспорт
```javascript
// Экспорт переменных
export const name = 'John';
export const age = 30;

// Экспорт функций
export function sayHello() {
  return `Привет, ${name}!`;
}

// Экспорт классов
export class User {
  constructor(name) {
    this.name = name;
  }
}
```

### Экспорт по умолчанию
```javascript
// Только один экспорт по умолчанию на модуль
export default class Person {
  constructor(name) {
    this.name = name;
  }
}
```

## 2. Импорт

### Именованный импорт
```javascript
// Импорт конкретных элементов
import { name, age, sayHello } from './user.js';

// Импорт с переименованием
import { name as userName } from './user.js';

// Импорт всего как объекта
import * as User from './user.js';
```

### Импорт по умолчанию
```javascript
import Person from './person.js';

// Комбинированный импорт
import Person, { name, age } from './person.js';
```

## 3. Реэкспорт

### Базовый реэкспорт
```javascript
// Реэкспорт именованных экспортов
export { name, age } from './user.js';

// Реэкспорт всего
export * from './user.js';

// Реэкспорт с переименованием
export { name as userName } from './user.js';
```

## 4. Динамический импорт

### Использование import()
```javascript
// Загрузка модуля по условию
if (condition) {
  import('./module.js')
    .then(module => {
      module.doSomething();
    })
    .catch(error => {
      console.error('Ошибка загрузки модуля:', error);
    });
}

// С async/await
async function loadModule() {
  try {
    const module = await import('./module.js');
    module.doSomething();
  } catch (error) {
    console.error('Ошибка загрузки модуля:', error);
  }
}
```