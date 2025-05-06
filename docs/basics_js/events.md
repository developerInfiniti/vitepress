---
title: Події в JavaScript
description: Детальний посібник з роботи з подіями
---

# Події в JavaScript

## 1. Типи подій

### Події миші
```javascript
// Клік
element.addEventListener('click', () => {});

// Подвійний клік
element.addEventListener('dblclick', () => {});

// Наведення
element.addEventListener('mouseover', () => {});
element.addEventListener('mouseout', () => {});

// Переміщення
element.addEventListener('mousemove', (event) => {
  console.log(event.clientX, event.clientY);
});
```

### Події клавіатури
```javascript
// Натискання клавіші
document.addEventListener('keydown', (event) => {
  console.log(event.key, event.code);
});

// Відпускання клавіші
document.addEventListener('keyup', (event) => {});

// Введення тексту
input.addEventListener('input', (event) => {
  console.log(event.target.value);
});
```

## 2. Об'єкт події

### Властивості події
```javascript
element.addEventListener('click', (event) => {
  // Координати відносно вікна
  console.log(event.clientX, event.clientY);
  
  // Координати відносно документа
  console.log(event.pageX, event.pageY);
  
  // Цільовий елемент
  console.log(event.target);
  
  // Поточний елемент (де спрацював обробник)
  console.log(event.currentTarget);
});
```

## 3. Спливання та занурення

### Фази події
```javascript
// Занурення (capturing)
element.addEventListener('click', () => {}, true);

// Спливання (bubbling)
element.addEventListener('click', () => {}, false); // за замовчуванням

// Зупинка спливання
element.addEventListener('click', (event) => {
  event.stopPropagation();
});
```

## 4. Користувацькі події

### Створення та відправка подій
```javascript
// Створення події
const event = new CustomEvent('myEvent', {
  detail: { message: 'Привіт!' }
});

// Відправка події
element.dispatchEvent(event);

// Прослуховування користувацької події
element.addEventListener('myEvent', (event) => {
  console.log(event.detail.message);
});
```