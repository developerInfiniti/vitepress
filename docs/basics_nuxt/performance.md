# Производительность в Nuxt.js

## Введение

Производительность веб-приложения напрямую влияет на пользовательский опыт и конверсию. Nuxt.js предоставляет множество инструментов и техник для оптимизации производительности вашего приложения. В этом разделе мы рассмотрим основные стратегии и методы повышения производительности Nuxt.js приложений.

## Режимы рендеринга и их влияние на производительность

### Серверный рендеринг (SSR)

Преимущества для производительности:
- Быстрая первоначальная загрузка страницы
- Лучший опыт для пользователей с медленным интернетом
- Улучшенный SEO

```js
// nuxt.config.js
export default {
  ssr: true
}
```

### Статическая генерация (SSG)

Преимущества для производительности:
- Максимально быстрая загрузка страниц
- Снижение нагрузки на сервер
- Возможность размещения на CDN

```js
// nuxt.config.js
export default {
  ssr: true,
  target: 'static'
}
```

## Оптимизация сборки

### Минификация и сжатие

```js
// nuxt.config.js
export default {
  build: {
    // Оптимизация CSS
    optimizeCSS: true,
    extractCSS: true,
    
    // Минификация HTML
    html: {
      minify: {
        collapseBooleanAttributes: true,
        decodeEntities: true,
        minifyCSS: true,
        minifyJS: true,
        processConditionalComments: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
        trimCustomFragments: true,
        useShortDoctype: true
      }
    },
    
    // Оптимизация изображений
    optimizeImages: true
  }
}
```

### Разделение кода (Code Splitting)

Nuxt.js автоматически разделяет код на чанки для оптимальной загрузки:

```js
// nuxt.config.js
export default {
  build: {
    splitChunks: {
      layouts: true,
      pages: true,
      commons: true
    }
  }
}
```

## Ленивая загрузка (Lazy Loading)

### Компоненты

```vue
<template>
  <div>
    <LazyMyHeavyComponent v-if="showComponent" />
  </div>
</template>
```

### Изображения

```vue
<template>
  <div>
    <img loading="lazy" src="/large-image.jpg" alt="Большое изображение">
  </div>
</template>
```

### Страницы

```js
// router.scrollBehavior.js
export default function (to, from, savedPosition) {
  // Добавляем поддержку prefetch для страниц в видимой области
  return new Promise((resolve) => {
    this.app.$nextTick(() => {
      resolve(savedPosition || { x: 0, y: 0 })
    })
  })
}
```

## Кэширование

### Кэширование компонентов

```vue
<template>
  <div>
    <KeepAlive>
      <component :is="currentComponent" />
    </KeepAlive>
  </div>
</template>
```

### Кэширование API-запросов

```js
// plugins/axios.js
export default function ({ $axios, app }) {
  const cache = new Map()
  
  $axios.onRequest(config => {
    const cacheKey = `${config.url}|${JSON.stringify(config.params || {})}`
    
    if (config.method === 'get' && cache.has(cacheKey)) {
      return Promise.resolve(cache.get(cacheKey))
    }
    
    return config
  })
  
  $axios.onResponse(response => {
    const config = response.config
    const cacheKey = `${config.url}|${JSON.stringify(config.params || {})}`
    
    if (config.method === 'get') {
      cache.set(cacheKey, response)
    }
    
    return response
  })
}
```

## Оптимизация изображений

### Использование @nuxt/image

```bash
npm install @nuxt/image
```

```js
// nuxt.config.js
export default {
  modules: ['@nuxt/image'],
  image: {
    provider: 'cloudinary',
    cloudinary: {
      baseURL: 'https://res.cloudinary.com/your-account/image/upload/'
    }
  }
}
```

```vue
<template>
  <div>
    <nuxt-img
      src="/my-image.jpg"
      width="300"
      height="200"
      format="webp"
      loading="lazy"
      alt="Оптимизированное изображение"
    />
  </div>
</template>
```

## Мониторинг производительности

### Lighthouse

Используйте Google Lighthouse для анализа производительности вашего приложения:

```bash
npm install -g lighthouse
lighthouse https://your-nuxt-app.com --view
```

### Web Vitals

Отслеживайте Core Web Vitals с помощью модуля @nuxtjs/web-vitals:

```bash
npm install @nuxtjs/web-vitals
```

```js
// nuxt.config.js
export default {
  modules: ['@nuxtjs/web-vitals'],
  webVitals: {
    // Отправка метрик в Google Analytics
    googleAnalytics: {
      id: 'UA-XXXXXXXXX-X'
    }
  }
}
```

## Советы по оптимизации производительности

1. **Используйте правильный режим рендеринга**: Выбирайте между SSR, SSG и SPA в зависимости от требований проекта
2. **Оптимизируйте размер бандла**: Используйте анализатор бандла для выявления больших зависимостей
3. **Применяйте ленивую загрузку**: Загружайте компоненты и ресурсы только когда они нужны
4. **Оптимизируйте изображения**: Используйте современные форматы (WebP) и правильные размеры
5. **Внедряйте кэширование**: Кэшируйте компоненты и API-запросы
6. **Используйте CDN**: Размещайте статические ресурсы на CDN для быстрой доставки
7. **Мониторьте производительность**: Регулярно проверяйте метрики производительности

## Заключение

Производительность является ключевым фактором успеха веб-приложения. Nuxt.js предоставляет множество инструментов и техник для оптимизации производительности, от выбора режима рендеринга до оптимизации сборки и ленивой загрузки. Следуя рекомендациям из этого раздела, вы сможете создать быстрое и отзывчивое Nuxt.js приложение, которое обеспечит отличный пользовательский опыт.