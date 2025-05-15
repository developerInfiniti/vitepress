# Развертывание Nuxt.js

[Завантажити PDF](./deployment.pdf)

## Введение

Развертывание (деплой) Nuxt.js приложения — это процесс публикации вашего приложения на сервере или хостинг-платформе, чтобы сделать его доступным для пользователей. В зависимости от выбранного режима рендеринга (SSR, SSG или SPA), процесс развертывания может отличаться.

## Подготовка к развертыванию

### Настройка nuxt.config.js

```js
// nuxt.config.js
export default {
  // Режим рендеринга
  ssr: true, // или false для SPA
  
  // Для статической генерации
  target: 'static', // или 'server' для SSR
  
  // Настройки сборки
  build: {
    // Оптимизация для продакшена
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
    }
  },
  
  // Переменные окружения
  publicRuntimeConfig: {
    baseURL: process.env.BASE_URL || 'https://example.com'
  },
  privateRuntimeConfig: {
    apiSecret: process.env.API_SECRET
  }
}
```

## Режимы развертывания

### Статическая генерация (SSG)

Статическая генерация создает HTML-файлы для каждого маршрута во время сборки.

```bash
# Сборка и генерация статических файлов
npm run generate

# Результат будет в директории dist/
```

### Серверный рендеринг (SSR)

Серверный рендеринг требует Node.js сервера для обработки запросов.

```bash
# Сборка для продакшена
npm run build

# Запуск сервера
npm run start
```

## Платформы для развертывания

### Vercel

Vercel — одна из лучших платформ для развертывания Nuxt.js приложений.

```bash
# Установка Vercel CLI
npm install -g vercel

# Развертывание
vercel
```

### Netlify

Netlify отлично подходит для статических сайтов (SSG).

```bash
# Установка Netlify CLI
npm install -g netlify-cli

# Развертывание
netlify deploy
```

### Heroku

Для развертывания на Heroku создайте файл `Procfile`:

```
web: npm run start
```

```bash
# Развертывание на Heroku
git push heroku main
```

### Docker

Создайте `Dockerfile`:

```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
```

## Оптимизация для продакшена

### Кэширование

```js
// nuxt.config.js
export default {
  render: {
    // Настройка кэширования
    http2: {
      push: true
    },
    static: {
      maxAge: 1000 * 60 * 60 * 24 * 7 // 7 дней
    }
  }
}
```

### Сжатие

```js
// nuxt.config.js
export default {
  render: {
    compressor: {
      level: 9 // Максимальное сжатие
    }
  }
}
```

## Непрерывная интеграция и развертывание (CI/CD)

### GitHub Actions

Создайте файл `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm ci
      - run: npm run generate
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v1.2
        with:
          publish-dir: './dist'
          production-branch: main
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## Заключение

Развертывание Nuxt.js приложения может быть простым или сложным в зависимости от ваших требований. Выбор правильной стратегии развертывания (SSG, SSR или SPA) и подходящей платформы имеет решающее значение для успеха вашего проекта. Оптимизация производительности, настройка кэширования и использование CI/CD могут значительно улучшить процесс развертывания и пользовательский опыт.