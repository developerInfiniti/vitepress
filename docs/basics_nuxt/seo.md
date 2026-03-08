---
description: "SEO в Nuxt.js: мета-теги, Open Graph, sitemap, structured data — оптимизация для поисковых систем"
---

# SEO в Nuxt.js

[Скачать PDF](./seo.pdf)

## Введение в SEO для Nuxt.js

Поисковая оптимизация (SEO) является критически важной для видимости вашего веб-приложения в поисковых системах. Nuxt.js предоставляет множество инструментов и возможностей для улучшения SEO благодаря своей архитектуре с поддержкой серверного рендеринга (SSR) и статической генерации (SSG).

## Преимущества Nuxt.js для SEO

- **Серверный рендеринг (SSR)**: Поисковые роботы получают полностью отрендеренный HTML
- **Статическая генерация (SSG)**: Предварительно сгенерированные HTML-страницы для максимальной производительности
- **Автоматическая генерация мета-тегов**: Упрощенное управление метаданными
- **Управление заголовками страниц**: Простая настройка заголовков для каждой страницы
- **Генерация sitemap.xml**: Автоматическое создание карты сайта
- **Управление robots.txt**: Контроль индексации поисковыми роботами

## Базовая настройка SEO

### Глобальные мета-теги

```js
// nuxt.config.js
export default {
  head: {
    title: 'Мое Nuxt.js приложение',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { 
        hid: 'description', 
        name: 'description', 
        content: 'Описание моего Nuxt.js приложения'
      },
      {
        hid: 'keywords',
        name: 'keywords',
        content: 'nuxt, vue, javascript, seo'
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'canonical', href: 'https://example.com' }
    ]
  }
}
```

### Мета-теги для отдельных страниц

```vue
<!-- pages/about.vue -->
<template>
  <div>
    <h1>О нас</h1>
    <p>Информация о нашей компании</p>
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: 'О нас | Мое Nuxt.js приложение',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Узнайте больше о нашей компании'
        }
      ],
      link: [
        {
          rel: 'canonical',
          href: 'https://example.com/about'
        }
      ]
    }
  }
}
</script>
```

## Использование модулей для SEO

### @nuxtjs/sitemap

Модуль для автоматической генерации sitemap.xml:

```bash
npm install @nuxtjs/sitemap
```

```js
// nuxt.config.js
export default {
  modules: ['@nuxtjs/sitemap'],
  sitemap: {
    hostname: 'https://example.com',
    gzip: true,
    exclude: [
      '/admin/**'
    ],
    routes: async () => {
      // Динамическая генерация маршрутов
      const { data } = await axios.get('https://api.example.com/posts')
      return data.map(post => `/blog/${post.slug}`)
    }
  }
}
```

### @nuxtjs/robots

Модуль для создания robots.txt:

```bash
npm install @nuxtjs/robots
```

```js
// nuxt.config.js
export default {
  modules: ['@nuxtjs/robots'],
  robots: {
    UserAgent: '*',
    Disallow: ['/admin'],
    Sitemap: 'https://example.com/sitemap.xml'
  }
}
```

## SEO в Nuxt 3

В Nuxt 3 появились новые возможности для управления SEO:

### useHead composable

```vue
<script setup>
useHead({
  title: 'Моя страница',
  meta: [
    { name: 'description', content: 'Описание моей страницы' },
    { property: 'og:title', content: 'Моя страница' },
    { property: 'og:description', content: 'Описание моей страницы' },
    { property: 'og:image', content: 'https://example.com/image.jpg' }
  ],
  link: [
    { rel: 'canonical', href: 'https://example.com/my-page' }
  ]
})
</script>
```

### useSeoMeta composable

```vue
<script setup>
useSeoMeta({
  title: 'Моя страница',
  description: 'Описание моей страницы',
  ogTitle: 'Моя страница',
  ogDescription: 'Описание моей страницы',
  ogImage: 'https://example.com/image.jpg',
  twitterCard: 'summary_large_image'
})
</script>
```

## Структурированные данные (Schema.org)

Добавление структурированных данных для улучшения отображения в результатах поиска:

```vue
<script>
export default {
  head() {
    return {
      script: [
        {
          hid: 'schema-product',
          type: 'application/ld+json',
          json: {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: 'Название продукта',
            description: 'Описание продукта',
            image: 'https://example.com/image.jpg',
            offers: {
              '@type': 'Offer',
              price: '99.99',
              priceCurrency: 'RUB'
            }
          }
        }
      ]
    }
  }
}
</script>
```

## Советы по оптимизации SEO

1. **Используйте SSR или SSG**: Выбирайте серверный рендеринг или статическую генерацию для лучшей индексации
2. **Оптимизируйте скорость загрузки**: Используйте lazy-loading, оптимизируйте изображения
3. **Создавайте семантическую разметку**: Используйте правильные HTML5 теги (header, nav, main, article, section)
4. **Добавляйте атрибуты alt для изображений**: Улучшайте доступность и SEO
5. **Используйте канонические URL**: Избегайте дублирования контента
6. **Настройте 301 редиректы**: При изменении URL-структуры
7. **Мониторьте производительность**: Используйте Lighthouse и PageSpeed Insights

## Заключение

Nuxt.js предоставляет мощные инструменты для оптимизации SEO благодаря серверному рендерингу и статической генерации. Правильная настройка мета-тегов, использование специализированных модулей и следование лучшим практикам SEO позволят вашему приложению занять высокие позиции в результатах поиска.