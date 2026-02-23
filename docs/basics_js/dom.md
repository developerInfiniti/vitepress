---
title: Робота з DOM
description: Посібник з маніпуляції DOM в JavaScript
---

# Робота з DOM в JavaScript

[Скачать PDF](./dom.pdf)

## 1. Вибір елементів

### Основні методи вибору
```javascript
// Вибір за ID
const element = document.getElementById('myId');

// Вибір за класом
const elements = document.getElementsByClassName('myClass');

// Вибір за тегом
const divs = document.getElementsByTagName('div');

// Сучасні методи
const element = document.querySelector('.myClass'); // перший елемент
const elements = document.querySelectorAll('.myClass'); // всі елементи
```

## 2. Маніпуляція елементами

### Створення елементів
```javascript
// Створення нового елемента
const div = document.createElement('div');
div.className = 'myClass';
div.textContent = 'Новий елемент';

// Додавання в DOM
parentElement.appendChild(div);
```

### Зміна вмісту
```javascript
// Текстовий вміст
element.textContent = 'Новий текст';

// HTML вміст
element.innerHTML = '<span>HTML контент</span>';
```

## 3. Робота з атрибутами

### Керування атрибутами
```javascript
// Встановлення атрибута
element.setAttribute('data-id', '123');

// Отримання атрибута
const value = element.getAttribute('data-id');

// Перевірка наявності атрибута
const hasAttribute = element.hasAttribute('data-id');

// Видалення атрибута
element.removeAttribute('data-id');
```

## 4. Події

### Додавання обробників подій
```javascript
// Сучасний спосіб
element.addEventListener('click', (event) => {
  console.log('Клік!', event);
});

// Видалення обробника
const handler = (event) => console.log('Клік!');
element.addEventListener('click', handler);
element.removeEventListener('click', handler);
```

### Делегування подій
```javascript
document.getElementById('parent').addEventListener('click', (event) => {
  if (event.target.matches('.child')) {
    console.log('Клік по дочірньому елементу');
  }
});
```