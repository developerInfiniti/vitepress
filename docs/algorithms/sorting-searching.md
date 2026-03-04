# Алгоритмы сортировки и поиска

## Почему это важно?

Сортировка и поиск — фундаментальные алгоритмы, которые лежат в основе большинства задач на собеседованиях. Понимание их работы помогает выбирать оптимальные решения и оценивать сложность.

## Алгоритмы сортировки

### Bubble Sort (Пузырьковая сортировка)

Сравнивает соседние элементы и меняет местами, если они в неправильном порядке. "Всплывание" наибольших элементов к концу массива.

```javascript
function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    // Оптимизация: если за проход не было обменов, массив отсортирован
    if (!swapped) break;
  }
  return arr;
}

console.log(bubbleSort([64, 34, 25, 12, 22, 11, 90]));
// [11, 12, 22, 25, 34, 64, 90]
```

| Случай | Сложность |
|--------|-----------|
| Лучший | O(n) — уже отсортирован |
| Средний | O(n²) |
| Худший | O(n²) |
| Память | O(1) |

### Selection Sort (Сортировка выбором)

Находит минимальный элемент и ставит его на правильную позицию.

```javascript
function selectionSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
  }
  return arr;
}
```

| Случай | Сложность |
|--------|-----------|
| Все случаи | O(n²) |
| Память | O(1) |

### Insertion Sort (Сортировка вставками)

Вставляет каждый элемент на правильное место в уже отсортированной части.

```javascript
function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}
```

| Случай | Сложность |
|--------|-----------|
| Лучший | O(n) — почти отсортирован |
| Средний | O(n²) |
| Худший | O(n²) |
| Память | O(1) |

**Когда полезен**: маленькие массивы, почти отсортированные данные.

### Merge Sort (Сортировка слиянием)

Принцип "разделяй и властвуй": делим массив пополам, сортируем каждую часть, сливаем.

```javascript
function mergeSort(arr) {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }

  return result.concat(left.slice(i)).concat(right.slice(j));
}

console.log(mergeSort([38, 27, 43, 3, 9, 82, 10]));
// [3, 9, 10, 27, 38, 43, 82]
```

| Случай | Сложность |
|--------|-----------|
| Все случаи | O(n log n) |
| Память | O(n) |

**Преимущества**: стабильная сортировка, гарантированная O(n log n).

### Quick Sort (Быстрая сортировка)

Выбираем опорный элемент (pivot), разделяем массив на элементы меньше и больше pivot.

```javascript
function quickSort(arr) {
  if (arr.length <= 1) return arr;

  const pivot = arr[arr.length - 1];
  const left = [];
  const right = [];

  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }

  return [...quickSort(left), pivot, ...quickSort(right)];
}

// In-place версия (более эффективна по памяти)
function quickSortInPlace(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pivotIndex = partition(arr, low, high);
    quickSortInPlace(arr, low, pivotIndex - 1);
    quickSortInPlace(arr, pivotIndex + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}
```

| Случай | Сложность |
|--------|-----------|
| Лучший | O(n log n) |
| Средний | O(n log n) |
| Худший | O(n²) — при плохом выборе pivot |
| Память | O(log n) — стек вызовов |

**На практике**: самая быстрая сортировка в среднем. `Array.prototype.sort()` в V8 использует TimSort (гибрид Merge Sort и Insertion Sort).

## Сравнение алгоритмов сортировки

| Алгоритм | Лучший | Средний | Худший | Память | Стабильный |
|----------|--------|---------|--------|--------|------------|
| Bubble Sort | O(n) | O(n²) | O(n²) | O(1) | Да |
| Selection Sort | O(n²) | O(n²) | O(n²) | O(1) | Нет |
| Insertion Sort | O(n) | O(n²) | O(n²) | O(1) | Да |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) | Да |
| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) | Нет |

::: info Стабильная сортировка
**Стабильная** сортировка сохраняет относительный порядок равных элементов. Это важно, когда сортируем объекты по одному полю, сохраняя порядок по другому.
:::

## Алгоритмы поиска

### Линейный поиск (Linear Search)

Последовательно проверяем каждый элемент.

```javascript
function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}

// Сложность: O(n)
```

### Бинарный поиск (Binary Search)

Работает **только на отсортированных** данных. Делит пространство поиска пополам.

```javascript
// Итеративный вариант
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

// Рекурсивный вариант
function binarySearchRecursive(arr, target, left = 0, right = arr.length - 1) {
  if (left > right) return -1;

  const mid = Math.floor((left + right) / 2);

  if (arr[mid] === target) return mid;
  if (arr[mid] < target) {
    return binarySearchRecursive(arr, target, mid + 1, right);
  }
  return binarySearchRecursive(arr, target, left, mid - 1);
}

const sorted = [1, 3, 5, 7, 9, 11, 13, 15];
console.log(binarySearch(sorted, 7));  // 3
console.log(binarySearch(sorted, 6));  // -1
```

**Сложность**: O(log n) — при каждом шаге отбрасываем половину данных.

### Вариации бинарного поиска

#### Найти первое вхождение

```javascript
function findFirst(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  let result = -1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) {
      result = mid;
      right = mid - 1; // продолжаем искать левее
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return result;
}

console.log(findFirst([1, 2, 2, 2, 3, 4], 2)); // 1
```

#### Найти позицию для вставки

```javascript
function searchInsert(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }

  return left; // позиция для вставки
}

console.log(searchInsert([1, 3, 5, 6], 5)); // 2
console.log(searchInsert([1, 3, 5, 6], 2)); // 1
console.log(searchInsert([1, 3, 5, 6], 7)); // 4
```

## Практические задачи

### Задача 1: Отсортировать массив за O(n) — Counting Sort

Когда значения ограничены диапазоном, можно сортировать за линейное время.

```javascript
function countingSort(arr, maxVal) {
  const count = new Array(maxVal + 1).fill(0);

  // Подсчитываем частоту каждого значения
  for (const num of arr) {
    count[num]++;
  }

  // Восстанавливаем отсортированный массив
  const result = [];
  for (let i = 0; i <= maxVal; i++) {
    while (count[i] > 0) {
      result.push(i);
      count[i]--;
    }
  }

  return result;
}

console.log(countingSort([4, 2, 2, 8, 3, 3, 1], 8));
// [1, 2, 2, 3, 3, 4, 8]
```

### Задача 2: Найти K-й наибольший элемент

```javascript
// Решение через Quick Select — O(n) в среднем
function findKthLargest(nums, k) {
  const target = nums.length - k;

  function quickSelect(left, right) {
    const pivot = nums[right];
    let i = left;

    for (let j = left; j < right; j++) {
      if (nums[j] <= pivot) {
        [nums[i], nums[j]] = [nums[j], nums[i]];
        i++;
      }
    }
    [nums[i], nums[right]] = [nums[right], nums[i]];

    if (i === target) return nums[i];
    if (i < target) return quickSelect(i + 1, right);
    return quickSelect(left, i - 1);
  }

  return quickSelect(0, nums.length - 1);
}

console.log(findKthLargest([3, 2, 1, 5, 6, 4], 2)); // 5
```

### Задача 3: Поиск в повёрнутом отсортированном массиве

```javascript
function searchRotated(nums, target) {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (nums[mid] === target) return mid;

    // Левая часть отсортирована
    if (nums[left] <= nums[mid]) {
      if (target >= nums[left] && target < nums[mid]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }
    // Правая часть отсортирована
    else {
      if (target > nums[mid] && target <= nums[right]) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }

  return -1;
}

console.log(searchRotated([4, 5, 6, 7, 0, 1, 2], 0)); // 4
```

## Вопросы на собеседовании

1. **Какой алгоритм сортировки самый быстрый?**
   — Зависит от данных. В среднем Quick Sort, но Merge Sort гарантирует O(n log n). Для маленьких массивов Insertion Sort может быть быстрее.

2. **Когда бинарный поиск неприменим?**
   — Когда данные не отсортированы. Сначала нужна сортировка O(n log n), что может нивелировать выгоду.

3. **Что такое стабильная сортировка и зачем она нужна?**
   — Сохраняет порядок равных элементов. Важно при многоуровневой сортировке объектов.

4. **Как работает `Array.prototype.sort()` в JavaScript?**
   — V8 использует TimSort (гибрид Merge Sort и Insertion Sort). Сложность O(n log n).

5. **Можно ли сортировать быстрее O(n log n)?**
   — Да, если данные имеют ограничения: Counting Sort O(n+k), Radix Sort O(d*(n+k)), Bucket Sort O(n+k).
