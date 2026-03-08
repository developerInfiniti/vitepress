---
description: "Рекурсия и динамическое программирование — мемоизация, табуляция с примерами решений задач на JavaScript"
---

# Рекурсия и динамическое программирование

## Рекурсия

### Что такое рекурсия?

Рекурсия — это когда функция вызывает саму себя. Каждая рекурсивная функция должна иметь:
- **Base case** (базовый случай) — условие остановки
- **Recursive case** (рекурсивный случай) — вызов самой себя с изменёнными параметрами

```javascript
// Факториал: n! = n * (n-1) * ... * 1
function factorial(n) {
  if (n <= 1) return 1;        // base case
  return n * factorial(n - 1); // recursive case
}

console.log(factorial(5)); // 120
// 5 * 4 * 3 * 2 * 1 = 120
```

### Как работает стек вызовов

```
factorial(5)
  → 5 * factorial(4)
    → 4 * factorial(3)
      → 3 * factorial(2)
        → 2 * factorial(1)
          → 1 (base case)
        → 2 * 1 = 2
      → 3 * 2 = 6
    → 4 * 6 = 24
  → 5 * 24 = 120
```

Каждый вызов добавляется в стек. При глубокой рекурсии можно получить **Stack Overflow**.

### Примеры рекурсии

#### Числа Фибоначчи

```javascript
// Наивная рекурсия — O(2ⁿ) !!!
function fibNaive(n) {
  if (n <= 1) return n;
  return fibNaive(n - 1) + fibNaive(n - 2);
}

// fibNaive(5) порождает дерево вызовов:
//                fib(5)
//              /        \
//          fib(4)      fib(3)
//         /    \       /    \
//      fib(3) fib(2) fib(2) fib(1)
//      ...    ...    ...
// Многие вычисления дублируются!
```

#### Обход дерева

```javascript
function treeDepth(node) {
  if (!node) return 0; // base case
  const leftDepth = treeDepth(node.left);
  const rightDepth = treeDepth(node.right);
  return Math.max(leftDepth, rightDepth) + 1;
}
```

#### Генерация всех подмножеств

```javascript
function subsets(nums) {
  const result = [];

  function backtrack(start, current) {
    result.push([...current]);

    for (let i = start; i < nums.length; i++) {
      current.push(nums[i]);
      backtrack(i + 1, current);
      current.pop(); // откат (backtracking)
    }
  }

  backtrack(0, []);
  return result;
}

console.log(subsets([1, 2, 3]));
// [[], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3]]
```

## Динамическое программирование (DP)

### Что такое DP?

Динамическое программирование — это метод оптимизации, который разбивает задачу на перекрывающиеся подзадачи и сохраняет их результаты, чтобы не вычислять повторно.

**Два ключевых свойства задач для DP:**
1. **Оптимальная подструктура** — решение задачи строится из решений подзадач
2. **Перекрывающиеся подзадачи** — одни и те же подзадачи решаются многократно

### Два подхода

#### 1. Мемоизация (Top-Down) — сверху вниз

Рекурсия + кеширование результатов.

```javascript
// Fibonacci с мемоизацией — O(n)
function fibMemo(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;

  memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
  return memo[n];
}

console.log(fibMemo(50)); // 12586269025
// Наивная версия не сможет вычислить fib(50) за разумное время!
```

#### 2. Табуляция (Bottom-Up) — снизу вверх

Итеративно заполняем таблицу от простых случаев к сложным.

```javascript
// Fibonacci с табуляцией — O(n) время, O(n) память
function fibTab(n) {
  if (n <= 1) return n;
  const dp = [0, 1];

  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }

  return dp[n];
}

// Оптимизация памяти — O(1) память
function fibOptimal(n) {
  if (n <= 1) return n;
  let prev2 = 0, prev1 = 1;

  for (let i = 2; i <= n; i++) {
    const current = prev1 + prev2;
    prev2 = prev1;
    prev1 = current;
  }

  return prev1;
}
```

## Классические задачи DP

### 1. Climbing Stairs (Лестница)

Можно подниматься на 1 или 2 ступени. Сколько способов подняться на n ступеней?

```javascript
function climbStairs(n) {
  if (n <= 2) return n;

  let prev2 = 1; // 1 способ на 1 ступень
  let prev1 = 2; // 2 способа на 2 ступени

  for (let i = 3; i <= n; i++) {
    const current = prev1 + prev2;
    prev2 = prev1;
    prev1 = current;
  }

  return prev1;
}

console.log(climbStairs(5)); // 8
// Способы: 11111, 1112, 1121, 1211, 2111, 122, 212, 221
```

### 2. Coin Change (Размен монет)

Найти минимальное количество монет для суммы amount.

```javascript
function coinChange(coins, amount) {
  // dp[i] = минимальное кол-во монет для суммы i
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0; // 0 монет для суммы 0

  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin <= i && dp[i - coin] !== Infinity) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }

  return dp[amount] === Infinity ? -1 : dp[amount];
}

console.log(coinChange([1, 5, 10, 25], 30)); // 2 (25 + 5)
console.log(coinChange([2], 3));              // -1
```

### 3. Knapsack Problem (Задача о рюкзаке)

Максимизировать ценность предметов при ограниченной вместимости.

```javascript
function knapsack(weights, values, capacity) {
  const n = weights.length;
  // dp[i][w] = макс. ценность при первых i предметах и вместимости w
  const dp = Array.from({ length: n + 1 }, () =>
    new Array(capacity + 1).fill(0)
  );

  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      // Не берём предмет i
      dp[i][w] = dp[i - 1][w];

      // Берём предмет i (если помещается)
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(
          dp[i][w],
          dp[i - 1][w - weights[i - 1]] + values[i - 1]
        );
      }
    }
  }

  return dp[n][capacity];
}

const weights = [2, 3, 4, 5];
const values = [3, 4, 5, 6];
console.log(knapsack(weights, values, 8)); // 10 (предметы 2+3=5кг, 4+6=10)
```

### 4. Longest Common Subsequence (Наибольшая общая подпоследовательность)

```javascript
function longestCommonSubsequence(text1, text2) {
  const m = text1.length;
  const n = text2.length;
  const dp = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(0)
  );

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  return dp[m][n];
}

console.log(longestCommonSubsequence('abcde', 'ace')); // 3 ('ace')
console.log(longestCommonSubsequence('abc', 'def'));    // 0
```

### 5. Maximum Subarray (Максимальный подмассив — алгоритм Кадане)

```javascript
function maxSubArray(nums) {
  let currentMax = nums[0];
  let globalMax = nums[0];

  for (let i = 1; i < nums.length; i++) {
    // Либо начинаем новый подмассив, либо продолжаем текущий
    currentMax = Math.max(nums[i], currentMax + nums[i]);
    globalMax = Math.max(globalMax, currentMax);
  }

  return globalMax;
}

console.log(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // 6
// Подмассив [4, -1, 2, 1]
```

### 6. Longest Increasing Subsequence (Наибольшая возрастающая подпоследовательность)

```javascript
function lengthOfLIS(nums) {
  const dp = new Array(nums.length).fill(1);

  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
  }

  return Math.max(...dp);
}

console.log(lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18])); // 4
// Подпоследовательность: [2, 3, 7, 101] или [2, 5, 7, 101]
```

## Паттерны DP для собеседований

### Паттерн 1: Линейный DP (1D)

```
dp[i] зависит от dp[i-1], dp[i-2], ...
Примеры: Fibonacci, Climbing Stairs, House Robber
```

```javascript
// House Robber — нельзя грабить два соседних дома
function rob(nums) {
  if (nums.length === 0) return 0;
  if (nums.length === 1) return nums[0];

  let prev2 = 0;
  let prev1 = 0;

  for (const num of nums) {
    const current = Math.max(prev1, prev2 + num);
    prev2 = prev1;
    prev1 = current;
  }

  return prev1;
}

console.log(rob([2, 7, 9, 3, 1])); // 12 (2 + 9 + 1)
```

### Паттерн 2: Двумерный DP (2D)

```
dp[i][j] зависит от dp[i-1][j], dp[i][j-1], dp[i-1][j-1]
Примеры: LCS, Knapsack, Edit Distance
```

```javascript
// Unique Paths — количество путей в сетке из (0,0) в (m-1, n-1)
function uniquePaths(m, n) {
  const dp = Array.from({ length: m }, () => new Array(n).fill(1));

  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
    }
  }

  return dp[m - 1][n - 1];
}

console.log(uniquePaths(3, 7)); // 28
```

### Паттерн 3: Принятие решения (Decision Making)

```
На каждом шаге выбираем: взять или не взять.
dp[i] = max/min(взять i, не взять i)
```

## Подход к решению задач DP на собеседовании

### Алгоритм из 5 шагов

**1. Определить, что это DP-задача**
- Просят найти оптимум (min, max, количество способов)
- Решение строится из подзадач
- Есть перекрывающиеся подзадачи

**2. Определить состояние**
- Что описывает `dp[i]` (или `dp[i][j]`)?
- Какие параметры меняются?

**3. Найти формулу перехода (recurrence relation)**
- Как `dp[i]` связан с предыдущими значениями?

**4. Определить базовые случаи**
- `dp[0] = ?`, `dp[1] = ?`

**5. Определить порядок вычисления**
- Снизу вверх: от базовых случаев к ответу
- Сверху вниз: рекурсия с мемоизацией

### Пример применения: Word Break

```javascript
// Можно ли разбить строку на слова из словаря?
function wordBreak(s, wordDict) {
  const wordSet = new Set(wordDict);
  // dp[i] = можно ли разбить s[0..i-1] на слова
  const dp = new Array(s.length + 1).fill(false);
  dp[0] = true; // пустая строка

  for (let i = 1; i <= s.length; i++) {
    for (let j = 0; j < i; j++) {
      if (dp[j] && wordSet.has(s.slice(j, i))) {
        dp[i] = true;
        break;
      }
    }
  }

  return dp[s.length];
}

console.log(wordBreak('leetcode', ['leet', 'code'])); // true
console.log(wordBreak('catsandog', ['cats', 'dog', 'sand', 'and', 'cat'])); // false
```

## Вопросы на собеседовании

1. **Чем мемоизация отличается от табуляции?**
   — Мемоизация: сверху вниз, рекурсия + кеш, вычисляет только нужные подзадачи. Табуляция: снизу вверх, итеративно, вычисляет все подзадачи.

2. **Когда использовать DP вместо жадного алгоритма?**
   — Когда локально оптимальный выбор не гарантирует глобальный оптимум. DP перебирает все варианты, жадный — нет.

3. **Как оптимизировать память в DP?**
   — Если `dp[i]` зависит только от `dp[i-1]` и `dp[i-2]`, храним только 2 переменные вместо массива.

4. **Как понять, что задача решается через DP?**
   — Ключевые слова: "минимальное количество", "количество способов", "максимальная прибыль", "можно ли достичь".

5. **Какая сложность Fibonacci с мемоизацией vs без?**
   — Без: O(2^n). С мемоизацией: O(n). Экспоненциальное ускорение.
