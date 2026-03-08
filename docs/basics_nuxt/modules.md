---
description: "Модули Nuxt.js: установка, конфигурация, создание своих модулей — расширение функциональности"
---

# Модули Nuxt

## Что такое модули Nuxt?

[Скачать PDF](./modules.pdf)

Модули Nuxt — это расширения, которые можно интегрировать в приложение Nuxt для добавления новых функций и возможностей. Они представляют собой функции, которые последовательно вызываются при запуске Nuxt, позволяя настраивать практически любой аспект фреймворка.

## Преимущества использования модулей

- **Повторное использование кода**: Модули позволяют использовать общий код в разных проектах
- **Расширение функциональности**: Добавление новых возможностей без необходимости писать код с нуля
- **Интеграция с внешними сервисами**: Упрощение подключения к API и сторонним сервисам
- **Оптимизация**: Улучшение производительности и SEO
- **Стандартизация**: Следование лучшим практикам разработки

## Популярные модули Nuxt

### @nuxt/content

Модуль для работы с контентом, позволяющий использовать файлы Markdown, JSON, YAML и CSV как базу данных для вашего сайта.

```bash
npm install @nuxt/content
```

```js
// nuxt.config.js
export default {
  modules: ['@nuxt/content']
}
```

### @nuxtjs/axios

Интеграция Axios для выполнения HTTP-запросов.

```bash
npm install @nuxtjs/axios
```

```js
// nuxt.config.js
export default {
  modules: ['@nuxtjs/axios'],
  axios: {
    baseURL: 'https://api.example.com'
  }
}
```

### @nuxtjs/pwa

Добавляет поддержку Progressive Web App (PWA) в ваше приложение.

```bash
npm install @nuxtjs/pwa
```

```js
// nuxt.config.js
export default {
  modules: ['@nuxtjs/pwa'],
  pwa: {
    manifest: {
      name: 'My Nuxt App',
      lang: 'ru'
    }
  }
}
```

### @nuxtjs/auth-next

Модуль для управления аутентификацией в приложении.

```bash
npm install @nuxtjs/auth-next
```

```js
// nuxt.config.js
export default {
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth-next'
  ],
  auth: {
    strategies: {
      local: {
        token: {
          property: 'token',
          required: true,
          type: 'Bearer'
        },
        user: {
          property: 'user'
        },
        endpoints: {
          login: { url: '/api/auth/login', method: 'post' },
          logout: { url: '/api/auth/logout', method: 'post' },
          user: { url: '/api/auth/user', method: 'get' }
        }
      }
    }
  }
}
```

## Создание собственного модуля

```js
// modules/my-module.js
export default function (moduleOptions) {
  // Получение объединенных опций из nuxt.config.js и модуля
  const options = {
    ...this.options.myModule,
    ...moduleOptions
  }

  // Добавление плагина
  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
    options
  })

  // Регистрация хуков
  this.nuxt.hook('ready', async nuxt => {
    console.log('Nuxt готов!')
  })
}

// ОБЯЗАТЕЛЬНО: если публикуете модуль как npm-пакет
module.exports.meta = require('./package.json')
```

## Использование модулей в Nuxt 3

В Nuxt 3 синтаксис немного изменился:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ]
})
```

## Заключение

Модули Nuxt значительно расширяют возможности фреймворка и позволяют быстро интегрировать сложную функциональность в ваше приложение. Они являются ключевой частью экосистемы Nuxt и делают разработку более эффективной и приятной.