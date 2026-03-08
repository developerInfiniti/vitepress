---
description: "Обработка ошибок Nuxt.js: error pages, NuxtErrorBoundary, try/catch — надёжная обработка исключений"
---

# Обработка ошибок в Nuxt.js

[Скачать PDF](./error-handling.pdf)

## Введение

Обработка ошибок является важной частью разработки надежных веб-приложений. Nuxt.js предоставляет несколько механизмов для обработки различных типов ошибок, от ошибок на стороне клиента до ошибок на стороне сервера. В этом разделе мы рассмотрим основные подходы к обработке ошибок в Nuxt.js приложениях.

## Типы ошибок в Nuxt.js

### Ошибки на стороне клиента

- Ошибки JavaScript в браузере
- Ошибки при выполнении асинхронных запросов
- Ошибки в жизненном цикле компонентов Vue

### Ошибки на стороне сервера

- Ошибки при серверном рендеринге (SSR)
- Ошибки в серверных middleware
- Ошибки в API-маршрутах

### Ошибки маршрутизации

- Страница не найдена (404)
- Доступ запрещен (403)
- Другие ошибки HTTP

## Обработка ошибок в Nuxt 2

### Страницы ошибок

Nuxt.js автоматически отображает страницу ошибки при возникновении проблем. Вы можете настроить эту страницу, создав файл `layouts/error.vue`:

```vue
<!-- layouts/error.vue -->
<template>
  <div class="error-page">
    <h1 v-if="error.statusCode === 404">Страница не найдена</h1>
    <h1 v-else>Произошла ошибка</h1>
    <p>{{ error.message }}</p>
    <NuxtLink to="/">Вернуться на главную</NuxtLink>
  </div>
</template>

<script>
export default {
  props: ['error'],
  layout: 'empty' // Можно использовать другой макет для страницы ошибки
}
</script>
```

### Обработка ошибок в asyncData и fetch

```vue
<script>
export default {
  async asyncData({ $axios, error }) {
    try {
      const posts = await $axios.$get('https://api.example.com/posts')
      return { posts }
    } catch (err) {
      error({ statusCode: 500, message: 'Не удалось загрузить данные' })
    }
  }
}
</script>
```

### Глобальная обработка ошибок

```js
// plugins/error-handler.js
export default ({ app }, inject) => {
  // Обработка ошибок на стороне клиента
  if (process.client) {
    window.onerror = function(message, source, lineno, colno, error) {
      console.error('Глобальная ошибка:', error)
      // Отправка ошибки в систему мониторинга
    }
    
    window.addEventListener('unhandledrejection', function(event) {
      console.error('Необработанное отклонение Promise:', event.reason)
      // Отправка ошибки в систему мониторинга
    })
  }
  
  // Инъекция обработчика ошибок
  inject('errorHandler', (error) => {
    console.error('Обработанная ошибка:', error)
    // Логика обработки ошибок
  })
}
```

Регистрация плагина в `nuxt.config.js`:

```js
// nuxt.config.js
export default {
  plugins: [
    '~/plugins/error-handler'
  ]
}
```

## Обработка ошибок в Nuxt 3

### Страницы ошибок

В Nuxt 3 вы можете создать файл `error.vue` в корне проекта:

```vue
<!-- error.vue -->
<template>
  <div class="error-page">
    <h1 v-if="error.statusCode === 404">Страница не найдена</h1>
    <h1 v-else>Произошла ошибка</h1>
    <p>{{ error.message }}</p>
    <button @click="handleError">Попробовать снова</button>
  </div>
</template>

<script setup>
const props = defineProps({
  error: Object
})

function handleError() {
  clearError({ redirect: '/' })
}
</script>
```

### Обработка ошибок в composables

```vue
<script setup>
const { data, error } = await useFetch('/api/posts', {
  onError: (err) => {
    // Обработка ошибки
    console.error('Ошибка при загрузке данных:', err)
  }
})

// Проверка наличия ошибки
if (error.value) {
  throw createError({
    statusCode: 500,
    statusMessage: 'Не удалось загрузить данные',
    fatal: true
  })
}
</script>
```

### Создание пользовательских ошибок

```vue
<script setup>
const route = useRoute()
const id = route.params.id

if (!id) {
  throw createError({
    statusCode: 400,
    statusMessage: 'ID не указан',
    fatal: true
  })
}

const { data } = await useFetch(`/api/posts/${id}`)

if (!data.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Пост не найден',
    fatal: true
  })
}
</script>
```

## Обработка ошибок API

### Обработка ошибок в API-маршрутах (Nuxt 2)

```js
// api/posts.js
export default async function(req, res) {
  try {
    const posts = await fetchPosts()
    res.json(posts)
  } catch (error) {
    res.status(500).json({ error: 'Не удалось получить посты' })
  }
}
```

### Обработка ошибок в API-маршрутах (Nuxt 3)

```ts
// server/api/posts.ts
export default defineEventHandler(async (event) => {
  try {
    const posts = await fetchPosts()
    return posts
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Не удалось получить посты',
      data: error
    })
  }
})
```

## Мониторинг ошибок

### Интеграция с Sentry

```bash
npm install @nuxtjs/sentry
```

```js
// nuxt.config.js (Nuxt 2)
export default {
  modules: [
    '@nuxtjs/sentry'
  ],
  sentry: {
    dsn: 'https://your-sentry-dsn.sentry.io',
    config: {
      // Дополнительные настройки
    }
  }
}
```

```ts
// nuxt.config.ts (Nuxt 3)
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/sentry'
  ],
  sentry: {
    dsn: 'https://your-sentry-dsn.sentry.io',
    // Дополнительные настройки
  }
})
```

## Советы по обработке ошибок

1. **Используйте try/catch**: Оборачивайте асинхронный код в блоки try/catch
2. **Создавайте информативные сообщения об ошибках**: Помогайте пользователям понять, что пошло не так
3. **Логируйте ошибки**: Отправляйте ошибки в систему мониторинга для анализа
4. **Обрабатывайте разные типы ошибок**: Разделяйте обработку ошибок по типам (сеть, валидация и т.д.)
5. **Предоставляйте пути восстановления**: Давайте пользователям возможность исправить ошибку или продолжить работу

## Заключение

Правильная обработка ошибок является важной частью разработки надежных Nuxt.js приложений. Nuxt предоставляет различные механизмы для обработки ошибок на стороне клиента и сервера, от пользовательских страниц ошибок до глобальных обработчиков. Используя эти инструменты и следуя лучшим практикам, вы можете создавать приложения, которые элегантно обрабатывают ошибки и предоставляют пользователям хороший опыт даже в случае проблем.