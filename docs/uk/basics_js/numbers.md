---
title: Числа в JavaScript
description: Руководство по работе с числами и математическими операциями
---

# Работа с числами в JavaScript

## 1. Типы чисел

### Целые и дробные числа
```javascript
// Целые числа
const integer = 42;

// Дробные числа
const float = 42.42;

// Экспоненциальная запись
const scientific = 1e6;    // 1000000
const small = 1e-6;       // 0.000001
```

### Специальные значения
```javascript
// Бесконечность
const infinity = Infinity;
const negInfinity = -Infinity;

// Не число
const notANumber = NaN;

// Максимальное и минимальное значения
const max = Number.MAX_SAFE_INTEGER;  // 9007199254740991
const min = Number.MIN_SAFE_INTEGER;  // -9007199254740991
```

## 2. Математические операции

### Базовые операции
```javascript
const a = 10;
const b = 3;

// Арифметические операции
const sum = a + b;        // Сложение
const diff = a - b;       // Вычитание
const product = a * b;    // Умножение
const quotient = a / b;   // Деление
const remainder = a % b;  // Остаток от деления
const power = a ** b;     // Возведение в степень
```

### Округление
```javascript
const num = 3.14159;

// Методы округления
Math.round(num);    // 3 (до ближайшего целого)
Math.floor(num);    // 3 (вниз)
Math.ceil(num);     // 4 (вверх)
Math.trunc(num);    // 3 (удаление дробной части)

// Округление до определенного знака
num.toFixed(2);     // "3.14" (строка!)
```

## 3. Математические функции

### Объект Math
```javascript
// Тригонометрия
Math.sin(Math.PI / 2);    // 1
Math.cos(Math.PI);        // -1
Math.tan(Math.PI / 4);    // ~1

// Другие функции
Math.abs(-5);             // 5 (модуль числа)
Math.sqrt(16);            // 4 (квадратный корень)
Math.pow(2, 3);          // 8 (степень)

// Минимум и максимум
Math.min(2, 5, 1, 8);    // 1
Math.max(2, 5, 1, 8);    // 8
```

### Случайные числа
```javascript
// Случайное число от 0 до 1
Math.random();

// Случайное целое число в диапазоне
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Пример использования
const roll = getRandomInt(1, 6);  // Бросок кубика
```

## 4. Преобразование чисел

### Парсинг строк
```javascript
// Преобразование строки в число
parseInt('42');           // 42
parseFloat('3.14');      // 3.14

// С указанием системы счисления
parseInt('1010', 2);     // 10 (из двоичной)
parseInt('FF', 16);      // 255 (из шестнадцатеричной)

// Использование Number
Number('42');            // 42
Number('3.14');         // 3.14
Number('123abc');       // NaN
```

### Проверка чисел
```javascript
// Проверка на число
Number.isInteger(5);     // true
Number.isInteger(5.5);   // false

Number.isFinite(42);     // true
Number.isFinite(Infinity); // false

Number.isNaN(NaN);       // true
Number.isNaN('text');    // false
```