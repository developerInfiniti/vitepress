# Задачи на собеседовании

## Введение

На технических собеседованиях регулярно проверяют умение решать алгоритмические задачи. Здесь собраны самые популярные задачи с разбором подходов, оптимальных решений и оценкой сложности.

> Главное на собеседовании — не просто дать ответ, а показать ход мышления: как вы анализируете задачу, выбираете подход и оптимизируете решение.

## Работа с массивами

### Two Sum (Два числа с заданной суммой)

**Задача:** Найти два числа в массиве, сумма которых равна заданному значению `target`. Вернуть их индексы.

**Наивный подход — O(n²):**

```javascript
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
```

**Оптимальный подход — O(n) с HashMap:**

```javascript
function twoSum(nums, target) {
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

// twoSum([2, 7, 11, 15], 9) → [0, 1]
```

**Ключевая идея:** Используем хеш-таблицу для хранения уже просмотренных элементов, чтобы за O(1) проверить, есть ли нужное дополнение.

---

### Максимальная подмассивная сумма (Kadane's Algorithm)

**Задача:** Найти непрерывный подмассив с максимальной суммой.

```javascript
function maxSubarraySum(nums) {
  let maxSum = nums[0];
  let currentSum = nums[0];

  for (let i = 1; i < nums.length; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }

  return maxSum;
}

// maxSubarraySum([-2, 1, -3, 4, -1, 2, 1, -5, 4]) → 6 (подмассив [4, -1, 2, 1])
```

**Сложность:** O(n) по времени, O(1) по памяти.

---

### Удаление дубликатов из отсортированного массива

**Задача:** Удалить дубликаты на месте (in-place), вернуть длину уникальной части.

```javascript
function removeDuplicates(nums) {
  if (nums.length === 0) return 0;

  let writeIndex = 1;
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] !== nums[i - 1]) {
      nums[writeIndex] = nums[i];
      writeIndex++;
    }
  }

  return writeIndex;
}

// removeDuplicates([1, 1, 2, 3, 3]) → 3, массив: [1, 2, 3, ...]
```

**Паттерн:** Two Pointers (два указателя) — один для чтения, другой для записи.

---

## Работа со строками

### Проверка палиндрома

**Задача:** Определить, является ли строка палиндромом (читается одинаково в обоих направлениях), игнорируя регистр и не-буквенные символы.

```javascript
function isPalindrome(s) {
  const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  let left = 0;
  let right = cleaned.length - 1;

  while (left < right) {
    if (cleaned[left] !== cleaned[right]) {
      return false;
    }
    left++;
    right--;
  }

  return true;
}

// isPalindrome("A man, a plan, a canal: Panama") → true
```

**Сложность:** O(n) по времени, O(n) по памяти (из-за `cleaned`).

---

### Анаграммы

**Задача:** Проверить, являются ли две строки анаграммами (содержат одинаковые символы).

```javascript
function isAnagram(s, t) {
  if (s.length !== t.length) return false;

  const charCount = {};

  for (const char of s) {
    charCount[char] = (charCount[char] || 0) + 1;
  }

  for (const char of t) {
    if (!charCount[char]) return false;
    charCount[char]--;
  }

  return true;
}

// isAnagram("anagram", "nagaram") → true
// isAnagram("rat", "car") → false
```

**Сложность:** O(n) по времени, O(k) по памяти (k — количество уникальных символов).

---

### Самая длинная подстрока без повторений

**Задача:** Найти длину самой длинной подстроки без повторяющихся символов.

```javascript
function lengthOfLongestSubstring(s) {
  const charIndex = new Map();
  let maxLength = 0;
  let start = 0;

  for (let end = 0; end < s.length; end++) {
    if (charIndex.has(s[end]) && charIndex.get(s[end]) >= start) {
      start = charIndex.get(s[end]) + 1;
    }
    charIndex.set(s[end], end);
    maxLength = Math.max(maxLength, end - start + 1);
  }

  return maxLength;
}

// lengthOfLongestSubstring("abcabcbb") → 3 ("abc")
// lengthOfLongestSubstring("pwwkew") → 3 ("wke")
```

**Паттерн:** Sliding Window (скользящее окно).

---

## Связные списки

### Разворот связного списка

**Задача:** Развернуть односвязный список.

```javascript
class ListNode {
  constructor(val = 0, next = null) {
    this.val = val;
    this.next = next;
  }
}

function reverseList(head) {
  let prev = null;
  let current = head;

  while (current !== null) {
    const next = current.next;
    current.next = prev;
    prev = current;
    current = next;
  }

  return prev;
}

// 1 → 2 → 3 → 4 → null  =>  4 → 3 → 2 → 1 → null
```

**Сложность:** O(n) по времени, O(1) по памяти.

---

### Обнаружение цикла (Floyd's Algorithm)

**Задача:** Определить, содержит ли связный список цикл.

```javascript
function hasCycle(head) {
  let slow = head;
  let fast = head;

  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;

    if (slow === fast) {
      return true;
    }
  }

  return false;
}
```

**Паттерн:** Fast & Slow Pointers (черепаха и заяц). Быстрый указатель двигается в 2 раза быстрее — если есть цикл, они встретятся.

---

## Деревья

### Обход бинарного дерева (BFS и DFS)

```javascript
class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

// DFS — обход в глубину (in-order)
function inorderTraversal(root) {
  const result = [];

  function dfs(node) {
    if (node === null) return;
    dfs(node.left);
    result.push(node.val);
    dfs(node.right);
  }

  dfs(root);
  return result;
}

// BFS — обход в ширину (по уровням)
function levelOrder(root) {
  if (!root) return [];
  const result = [];
  const queue = [root];

  while (queue.length > 0) {
    const levelSize = queue.length;
    const level = [];

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    result.push(level);
  }

  return result;
}
```

---

### Максимальная глубина дерева

```javascript
function maxDepth(root) {
  if (root === null) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}
```

**Сложность:** O(n) по времени, O(h) по памяти (h — высота дерева).

---

### Проверка сбалансированности дерева

**Задача:** Определить, является ли бинарное дерево сбалансированным (разница высот поддеревьев каждого узла не более 1).

```javascript
function isBalanced(root) {
  function getHeight(node) {
    if (node === null) return 0;

    const leftHeight = getHeight(node.left);
    if (leftHeight === -1) return -1;

    const rightHeight = getHeight(node.right);
    if (rightHeight === -1) return -1;

    if (Math.abs(leftHeight - rightHeight) > 1) return -1;

    return 1 + Math.max(leftHeight, rightHeight);
  }

  return getHeight(root) !== -1;
}
```

---

## Классические задачи

### FizzBuzz

**Задача:** Вывести числа от 1 до n, заменяя кратные 3 на "Fizz", кратные 5 на "Buzz", кратные обоим — на "FizzBuzz".

```javascript
function fizzBuzz(n) {
  const result = [];
  for (let i = 1; i <= n; i++) {
    if (i % 15 === 0) result.push('FizzBuzz');
    else if (i % 3 === 0) result.push('Fizz');
    else if (i % 5 === 0) result.push('Buzz');
    else result.push(String(i));
  }
  return result;
}
```

---

### Скобочная последовательность

**Задача:** Проверить, является ли строка с скобками валидной.

```javascript
function isValid(s) {
  const stack = [];
  const pairs = { '(': ')', '[': ']', '{': '}' };

  for (const char of s) {
    if (pairs[char]) {
      stack.push(pairs[char]);
    } else {
      if (stack.pop() !== char) return false;
    }
  }

  return stack.length === 0;
}

// isValid("({[]})") → true
// isValid("([)]") → false
```

**Паттерн:** Stack (стек) — идеально подходит для задач на вложенность.

---

### Поиск отсутствующего числа

**Задача:** В массиве [0, n] отсутствует одно число. Найти его.

```javascript
function missingNumber(nums) {
  const n = nums.length;
  const expectedSum = (n * (n + 1)) / 2;
  const actualSum = nums.reduce((sum, num) => sum + num, 0);
  return expectedSum - actualSum;
}

// missingNumber([3, 0, 1]) → 2
```

**Сложность:** O(n) по времени, O(1) по памяти.

**Альтернативный подход через XOR:**

```javascript
function missingNumberXOR(nums) {
  let result = nums.length;
  for (let i = 0; i < nums.length; i++) {
    result ^= i ^ nums[i];
  }
  return result;
}
```

---

## Паттерны решений на собеседованиях

### Основные паттерны

| Паттерн | Когда использовать | Примеры задач |
|---------|-------------------|---------------|
| **Two Pointers** | Отсортированный массив, пары элементов | Two Sum (sorted), Remove Duplicates |
| **Sliding Window** | Подстроки, подмассивы фиксированной/переменной длины | Longest Substring, Max Sum Subarray |
| **HashMap/Set** | Подсчёт, поиск дубликатов, частотный анализ | Two Sum, Anagram, Group Anagrams |
| **Stack** | Вложенность, скобки, монотонные задачи | Valid Parentheses, Next Greater Element |
| **BFS/DFS** | Деревья, графы, матрицы | Tree Traversal, Number of Islands |
| **Binary Search** | Отсортированные данные, поиск границ | Search in Rotated Array |
| **Dynamic Programming** | Оптимизация, подзадачи с перекрытием | Fibonacci, Climbing Stairs, Knapsack |
| **Backtracking** | Перебор комбинаций, перестановки | Permutations, N-Queens |

### Как подходить к задаче на собеседовании

1. **Поймите задачу** — переформулируйте своими словами, задайте уточняющие вопросы
2. **Разберите примеры** — пройдитесь по 2-3 примерам вручную
3. **Определите паттерн** — какой подход подходит для данной задачи
4. **Начните с наивного решения** — покажите brute force подход
5. **Оптимизируйте** — объясните, как можно улучшить решение
6. **Напишите код** — чистый, читаемый код
7. **Протестируйте** — проверьте на edge cases (пустой вход, один элемент, отрицательные числа)

### Edge Cases, которые нужно проверять

- Пустой массив / строка
- Один элемент
- Отрицательные числа
- Дубликаты
- Очень большие значения (overflow)
- `null` / `undefined`

---

## Задачи для самостоятельной практики

| Уровень | Задача | Паттерн |
|---------|--------|---------|
| Easy | Merge Two Sorted Lists | Two Pointers |
| Easy | Best Time to Buy and Sell Stock | Sliding Window |
| Easy | Climbing Stairs | Dynamic Programming |
| Medium | 3Sum | Two Pointers + Sort |
| Medium | Container With Most Water | Two Pointers |
| Medium | Number of Islands | BFS/DFS |
| Medium | Coin Change | Dynamic Programming |
| Hard | Merge K Sorted Lists | Heap / Divide & Conquer |
| Hard | Trapping Rain Water | Stack / Two Pointers |
| Hard | Word Search II | Trie + Backtracking |

> Рекомендуемые платформы для практики: [LeetCode](https://leetcode.com), [HackerRank](https://hackerrank.com), [CodeWars](https://codewars.com).
