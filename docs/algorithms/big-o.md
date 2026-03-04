# Сложность алгоритмов (Big O)

## Что такое Big O?

**Big O** — это математическая нотация, описывающая верхнюю границу роста времени выполнения или потребления памяти алгоритма при увеличении размера входных данных. На собеседованиях это один из первых вопросов, который задают кандидату.

> На собеседовании вас часто просят: "Какая сложность у этого решения?" — Big O даёт язык для ответа.

## Основные нотации

| Нотация | Название | Пример |
|---------|----------|--------|
| O(1) | Константная | Доступ к элементу массива по индексу |
| O(log n) | Логарифмическая | Бинарный поиск |
| O(n) | Линейная | Проход по массиву |
| O(n log n) | Линейно-логарифмическая | Merge Sort, Quick Sort (в среднем) |
| O(n²) | Квадратичная | Вложенные циклы, Bubble Sort |
| O(2ⁿ) | Экспоненциальная | Рекурсивный Fibonacci без мемоизации |
| O(n!) | Факториальная | Перебор всех перестановок |

## Временная и пространственная сложность

### Временная сложность (Time Complexity)

Сколько операций выполняет алгоритм в зависимости от размера входа.

```javascript
// O(1) — константная
function getFirst(arr) {
  return arr[0];
}

// O(n) — линейная
function findElement(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}

// O(n²) — квадратичная
function hasDuplicates(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) return true;
    }
  }
  return false;
}
```

### Пространственная сложность (Space Complexity)

Сколько дополнительной памяти потребляет алгоритм.

```javascript
// O(1) — не создаём дополнительных структур
function sum(arr) {
  let total = 0;
  for (const num of arr) {
    total += num;
  }
  return total;
}

// O(n) — создаём новый массив
function double(arr) {
  const result = [];
  for (const num of arr) {
    result.push(num * 2);
  }
  return result;
}

// O(n) — стек вызовов при рекурсии
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}
```

## Как оценивать сложность: правила

### 1. Отбрасываем константы

```javascript
// O(2n) → O(n)
function printTwice(arr) {
  for (const item of arr) console.log(item);
  for (const item of arr) console.log(item);
}
```

### 2. Отбрасываем менее значимые слагаемые

```javascript
// O(n² + n) → O(n²)
function example(arr) {
  // O(n²)
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length; j++) {
      console.log(arr[i], arr[j]);
    }
  }
  // O(n) — отбрасываем, т.к. n² доминирует
  for (const item of arr) {
    console.log(item);
  }
}
```

### 3. Разные входы — разные переменные

```javascript
// O(a * b), НЕ O(n²)
function printPairs(arrA, arrB) {
  for (const a of arrA) {
    for (const b of arrB) {
      console.log(a, b);
    }
  }
}
```

### 4. Логарифмическая сложность — деление пополам

```javascript
// O(log n) — каждую итерацию пространство поиска уменьшается вдвое
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}
```

## Таблица сложностей основных операций

### Массив (Array)

| Операция | Средняя | Худшая |
|----------|---------|--------|
| Доступ по индексу | O(1) | O(1) |
| Поиск | O(n) | O(n) |
| Вставка в конец (push) | O(1) | O(n)* |
| Вставка в начало (unshift) | O(n) | O(n) |
| Удаление из конца (pop) | O(1) | O(1) |
| Удаление из начала (shift) | O(n) | O(n) |

*при необходимости расширения внутреннего буфера

### Объект / Хеш-таблица (Object / Map)

| Операция | Средняя | Худшая |
|----------|---------|--------|
| Поиск по ключу | O(1) | O(n) |
| Вставка | O(1) | O(n) |
| Удаление | O(1) | O(n) |

### Set

| Операция | Средняя | Худшая |
|----------|---------|--------|
| has() | O(1) | O(n) |
| add() | O(1) | O(n) |
| delete() | O(1) | O(n) |

## Практический пример: оптимизация

### Задача: найти два числа, дающих в сумме target

```javascript
// Наивное решение — O(n²)
function twoSumBrute(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        return [i, j];
      }
    }
  }
  return [];
}

// Оптимальное решение — O(n) время, O(n) память
function twoSumOptimal(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}
```

**Анализ**: мы пожертвовали O(n) памяти ради ускорения с O(n²) до O(n) по времени. Это типичный компромисс (trade-off) на собеседованиях.

## Типичные вопросы на собеседовании

1. **Что такое Big O и зачем она нужна?**
   — Big O описывает верхнюю границу роста сложности алгоритма. Нужна для сравнения эффективности решений.

2. **Чем отличаются O(n) и O(n²)?**
   — O(n) растёт линейно, O(n²) — квадратично. При n = 1000 это 1000 vs 1 000 000 операций.

3. **Какая сложность у поиска в хеш-таблице?**
   — Средняя O(1), худшая O(n) при коллизиях.

4. **Можно ли алгоритм O(n²) сделать O(n)?**
   — Часто да, используя хеш-таблицы, сортировку или другие структуры данных.

5. **Что лучше: O(n log n) или O(n²)?**
   — O(n log n) значительно лучше при больших n. Например, при n = 10000: ~133000 vs 100000000 операций.

## Шпаргалка для собеседования

```
Увидел один цикл             → скорее всего O(n)
Увидел вложенный цикл        → скорее всего O(n²)
Увидел деление пополам        → скорее всего O(log n)
Увидел сортировку + цикл      → скорее всего O(n log n)
Увидел рекурсию с 2 ветками   → скорее всего O(2ⁿ)
Используешь Map/Set для поиска → вместо O(n) получаешь O(1) за lookup
```
