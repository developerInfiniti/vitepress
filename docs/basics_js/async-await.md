---
description: "Async/await в JavaScript: асинхронные функции, обработка ошибок, параллельное выполнение — руководство"
---

# Async/Await

**Async/Await** — это синтаксический сахар над промисами, который позволяет писать асинхронный код в синхронном стиле. Появился в ES2017 (ES8).

## Основы синтаксиса

### async функция

Ключевое слово `async` перед функцией означает, что функция **всегда возвращает промис**:

```js
async function fetchUser() {
  return 'Иван' // автоматически оборачивается в Promise.resolve('Иван')
}

fetchUser().then(console.log) // "Иван"
```

### await

Ключевое слово `await` заставляет JavaScript **ждать** завершения промиса:

```js
async function loadData() {
  const response = await fetch('/api/users')
  const data = await response.json()
  console.log(data) // данные уже доступны
}
```

> `await` можно использовать **только внутри async-функции** (или на верхнем уровне ES-модуля).

## Обработка ошибок: try/catch/finally

```js
async function fetchUser(id) {
  try {
    const response = await fetch(`/api/users/${id}`)

    if (!response.ok) {
      throw new Error(`HTTP ошибка: ${response.status}`)
    }

    const user = await response.json()
    console.log('Пользователь:', user)
    return user
  } catch (error) {
    console.error('Ошибка загрузки:', error.message)
    throw error // пробрасываем ошибку дальше
  } finally {
    console.log('Запрос завершён (успешно или с ошибкой)')
  }
}
```

## Последовательное vs параллельное выполнение

### Последовательное выполнение

Каждый `await` ждёт завершения предыдущего:

```js
async function sequential() {
  const user = await fetchUser(1)       // ~1 сек
  const posts = await fetchPosts(1)     // ~1 сек
  const comments = await fetchComments() // ~1 сек
  // Итого: ~3 секунды
}
```

### Параллельное выполнение с Promise.all

```js
async function parallel() {
  const [user, posts, comments] = await Promise.all([
    fetchUser(1),
    fetchPosts(1),
    fetchComments()
  ])
  // Итого: ~1 секунда (все запросы одновременно)
}
```

### Promise.allSettled — все результаты, даже при ошибках

```js
async function loadAll() {
  const results = await Promise.allSettled([
    fetchUser(1),
    fetchPosts(999), // может упасть
    fetchComments()
  ])

  results.forEach((result, i) => {
    if (result.status === 'fulfilled') {
      console.log(`Запрос ${i}: ${result.value}`)
    } else {
      console.error(`Запрос ${i} не удался: ${result.reason}`)
    }
  })
}
```

## Отмена асинхронных операций

Используйте `AbortController` для отмены запросов:

```js
const controller = new AbortController()

async function fetchWithCancel() {
  try {
    const response = await fetch('/api/data', {
      signal: controller.signal
    })
    return await response.json()
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Запрос отменён')
    } else {
      throw error
    }
  }
}

// Отмена через 5 секунд
setTimeout(() => controller.abort(), 5000)
```

## Таймауты

```js
async function fetchWithTimeout(url, ms) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), ms)

  try {
    const response = await fetch(url, { signal: controller.signal })
    return await response.json()
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error(`Запрос превысил таймаут ${ms}ms`)
    }
    throw error
  } finally {
    clearTimeout(timeout)
  }
}
```

## Async/Await в циклах

### for...of — последовательно

```js
async function processItems(items) {
  for (const item of items) {
    await processItem(item) // один за другим
  }
}
```

### map + Promise.all — параллельно

```js
async function processItems(items) {
  await Promise.all(
    items.map(item => processItem(item))
  )
}
```

::: warning Осторожно с forEach
`forEach` не ждёт `await` внутри колбэка. Используйте `for...of` для последовательного выполнения.

```js
// НЕПРАВИЛЬНО — forEach не ждёт async
items.forEach(async (item) => {
  await processItem(item) // выполнится параллельно, а не последовательно!
})
```
:::

## Интерактивная демонстрация

Попробуйте различные сценарии async/await в действии:

<script setup>
import AsyncAwaitDemo from '../.vitepress/components/AsyncAwaitDemo.vue'
import CodePlayground from '../.vitepress/components/CodePlayground.vue'
import Quiz from '../.vitepress/components/Quiz.vue'
import asyncQuiz from '../.vitepress/data/quiz/async-await.json'

const asyncCode = `// Попробуйте async/await
async function fetchData() {
  console.log('Начало загрузки...');

  // Имитация задержки
  const result = await new Promise(resolve => {
    setTimeout(() => resolve('Данные получены!'), 1000);
  });

  console.log(result);
  return result;
}

// Параллельное выполнение
async function parallel() {
  const [a, b] = await Promise.all([
    new Promise(r => setTimeout(() => r('A'), 500)),
    new Promise(r => setTimeout(() => r('B'), 300)),
  ]);
  console.log('Параллельно:', a, b);
}

fetchData().then(() => parallel());`
</script>

<AsyncAwaitDemo />

## Сравнение: Промисы vs Async/Await

| Промисы | Async/Await |
|---------|-------------|
| `.then().catch().finally()` | `try/catch/finally` |
| Цепочки вызовов | Линейный код |
| Сложно читать при вложенности | Читается как синхронный код |
| `Promise.all()` для параллельности | `await Promise.all()` |

```js
// Промисы
function loadUser(id) {
  return fetch(`/api/users/${id}`)
    .then(res => res.json())
    .then(user => fetch(`/api/posts/${user.id}`))
    .then(res => res.json())
    .catch(err => console.error(err))
}

// Async/Await — тот же код, но читабельнее
async function loadUser(id) {
  try {
    const res = await fetch(`/api/users/${id}`)
    const user = await res.json()
    const postsRes = await fetch(`/api/posts/${user.id}`)
    return await postsRes.json()
  } catch (err) {
    console.error(err)
  }
}
```

## Частые ошибки

### 1. Забыли await

```js
async function bad() {
  const data = fetch('/api/data') // Promise, а не данные!
  console.log(data) // Promise { <pending> }
}

async function good() {
  const data = await fetch('/api/data')
  console.log(data) // Response object
}
```

### 2. Лишнее await для не-промисов

```js
// Не нужно — обычная функция
const result = await Math.max(1, 2, 3) // работает, но бессмысленно
```

### 3. Не обработали ошибку

```js
// Необработанный reject приведёт к UnhandledPromiseRejection
async function risky() {
  const data = await fetchData() // если упадёт — ошибка не поймана
}

// Всегда оборачивайте в try/catch или обрабатывайте .catch() у вызывающего кода
```

## Интерактивная песочница

Попробуйте async/await в действии:

<CodePlayground
  title="Async/Await Playground"
  :initial-code="asyncCode"
  language="javascript"
  editor-height="350px"
/>

## Тест: Async/Await

<Quiz :data="asyncQuiz" />
