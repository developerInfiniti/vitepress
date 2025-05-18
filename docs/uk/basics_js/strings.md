---
title: Строки в JavaScript
description: Подробное руководство по работе со строками
---

# Работа со строками в JavaScript

## 1. Создание строк

### Способы объявления
```javascript
// Строковые литералы
const single = 'Одинарные кавычки';
const double = "Двойные кавычки";
const backticks = `Обратные кавычки`;

// Создание через конструктор
const strObject = new String('текст');
```

### Шаблонные строки
```javascript
const name = 'Иван';
const age = 30;
const greeting = `Привет, меня зовут ${name} и мне ${age} лет`;
```

## 2. Методы строк

### Поиск и извлечение
```javascript
const str = 'JavaScript это круто';

// Поиск подстроки
str.indexOf('Script');     // 4
str.includes('это');       // true
str.startsWith('Java');    // true
str.endsWith('круто');     // true

// Извлечение подстроки
str.slice(0, 4);          // 'Java'
str.substring(4, 10);     // 'Script'
```

### Преобразование регистра
```javascript
const text = 'Привет, Мир!';

text.toLowerCase();        // 'привет, мир!'
text.toUpperCase();        // 'ПРИВЕТ, МИР!'
```

### Удаление пробелов
```javascript
const text = '   Привет   ';

text.trim();              // 'Привет'
text.trimStart();         // 'Привет   '
text.trimEnd();           // '   Привет'
```

## 3. Манипуляции со строками

### Соединение строк
```javascript
// Конкатенация
const str1 = 'Привет';
const str2 = 'мир';
const result = str1 + ' ' + str2;

// Метод concat
const result2 = str1.concat(' ', str2);

// Join для массивов
const words = ['Привет', 'мир'];
const sentence = words.join(' ');
```

### Замена подстрок
```javascript
const text = 'JavaScript это JavaScript';

// Замена первого вхождения
text.replace('JavaScript', 'JS');

// Замена всех вхождений
text.replaceAll('JavaScript', 'JS');

// Использование регулярных выражений
text.replace(/JavaScript/g, 'JS');
```

## 4. Разделение строк

### Разбиение на массив
```javascript
const text = 'яблоко,банан,апельсин';

// Разделение по запятой
const fruits = text.split(',');

// Разделение по пробелу
const sentence = 'Привет мир!';
const words = sentence.split(' ');

// Ограничение количества элементов
const limited = text.split(',', 2);
```