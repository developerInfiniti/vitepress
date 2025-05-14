# Модуль `@nuxt/content` в Nuxt

Модуль `@nuxt/content` предоставляет мощный способ работы с файлами контента (такими как Markdown, YAML, JSON, CSV и др.) в вашем Nuxt приложении. Он позволяет вам писать контент в простых форматах и затем легко отображать его на вашем сайте, используя Vue-компоненты.

## Установка

Для начала установите модуль `@nuxt/content`:

```bash
npm install --save-dev @nuxt/content
# или
yarn add -D @nuxt/content
```

Затем добавьте `@nuxt/content` в секцию `modules` вашего файла `nuxt.config.js`:

```javascript
export default {
  modules: [
    '@nuxt/content'
  ],
  // ... другие настройки
}
```

## Структура каталога `content/`

После установки модуля в корне вашего проекта будет создан каталог `content/`. Именно здесь вы будете размещать ваши файлы контента. Структура подкаталогов внутри `content/` будет определять структуру URL-маршрутов для вашего контента (если вы используете динамические маршруты `@nuxt/content`).

**Пример структуры:**

```
content/
├── index.md
├── about.md
├── blog/
│   ├── first-post.md
│   └── second-post.md
└── authors/
    ├── john-doe.json
    └── jane-doe.yaml
```

На основе этой структуры `@nuxt/content` автоматически создаст следующие маршруты (если вы используете `<nuxt-content>` или `$content`):

* `/` (из `content/index.md`)
* `/about` (из `content/about.md`)
* `/blog/first-post` (из `content/blog/first-post.md`)
* `/blog/second-post` (из `content/blog/second-post.md`)
* `/authors/john-doe` (из `content/authors/john-doe.json`)
* `/authors/jane-doe` (из `content/authors/jane-doe.yaml`)

## Использование `<nuxt-content>`

Компонент `<nuxt-content>` используется для отображения обработанного контента внутри ваших Vue-шаблонов. Он принимает проп `document`, который является результатом запроса к вашему контенту.

**Пример отображения контента из `content/index.md` (`pages/index.vue`):**

```vue
<template>
  <div>
    <nuxt-content :document="page" />
  </div>
</template>

<script setup>
const { data: page } = await useAsyncData('index', () => queryContent('index').findOne());
</script>
```

Здесь `queryContent('index').findOne()` запрашивает файл контента `index` (без расширения) из каталога `content/` и возвращает его содержимое в объекте `page`. Компонент `<nuxt-content :document="page" />` затем отображает обработанный HTML-контент.

## Использование `$content`

Вы также можете получить доступ к контенту программно, используя инжектированный объект `$content`.

**Пример получения списка всех постов блога (`pages/blog/index.vue`):**

```vue
<template>
  <div>
    <h1>Блог</h1>
    <ul>
      <li v-for="post in posts" :key="post.slug">
        <nuxt-link :to="`/blog/${post.slug}`">{{ post.title }}</nuxt-link>
      </li>
    </ul>
  </div>
</template>

<script setup>
const { data: posts } = await useAsyncData('posts', () => queryContent('blog').find());
</script>
```

Здесь `queryContent('blog').find()` запрашивает все файлы контента, находящиеся в подкаталоге `content/blog/`, и возвращает массив объектов, каждый из которых представляет пост. Каждый пост имеет свойство `slug`, которое генерируется на основе имени файла.

## Запросы к контенту (`queryContent`)

Функция `queryContent()` является основным способом взаимодействия с вашим контентом. Она возвращает объект запроса, который позволяет вам применять различные фильтры, сортировки и выборки к вашему контенту.

**Примеры запросов:**

* **Получить один документ по пути:**
  ```javascript
  queryContent('about').findOne() // content/about.md
  queryContent('blog/first-post').findOne() // content/blog/first-post.md
  ```

* **Получить все документы в каталоге:**
  ```javascript
  queryContent('blog').find() // Все файлы в content/blog/
  ```

* **Фильтрация по свойствам (Frontmatter):**
  Предположим, ваши Markdown файлы имеют Frontmatter с полем `category`:
  ```markdown
  ---
  title: Мой первый пост
  category: новости
  ---
  Содержимое поста...
  ```

  ```javascript
  queryContent('blog').where({ category: 'новости' }).find() // Получить все посты из категории "новости"
  queryContent('blog').where({ category: { $ne: 'новости' } }).find() // Получить все посты, кроме "новости"
  queryContent('blog').where({ tags: { $contains: 'vue' } }).find() // Получить все посты, содержащие тег "vue"
  ```

* **Сортировка:**
  ```javascript
  queryContent('blog').sortBy('date', 'desc').find() // Получить все посты, отсортированные по дате (сначала новые)
  queryContent('blog').sortBy('title', 'asc').find() // Получить все посты, отсортированные по заголовку по возрастанию
  ```

* **Выборка полей:**
  ```javascript
  queryContent('blog').select(['title', 'slug', 'date']).find() // Получить только заголовок, slug и дату
  ```

* **Ограничение количества результатов:**
  ```javascript
  queryContent('blog').limit(5).find() // Получить только первые 5 постов
  ```

* **Пропуск результатов:**
  ```javascript
  queryContent('blog').skip(5).limit(5).find() // Получить следующие 5 постов (для пагинации)
  ```

## Frontmatter

Markdown и YAML файлы могут содержать Frontmatter - метаданные, заключенные между `---` в начале файла. `@nuxt/content` автоматически парсит Frontmatter и делает его доступным в объекте документа.

**Пример Markdown с Frontmatter:**

```markdown
---
title: Заголовок моего поста
date: 2023-10-27
tags: ['nuxt', 'javascript']
---

Основное содержимое поста...
```

В вашем Vue-компоненте вы сможете получить доступ к этим данным так:

```vue
<template>
  <div>
    <h1>{{ post.title }}</h1>
    <p>Опубликовано: {{ post.date }}</p>
    <ul>
      <li v-for="tag in post.tags" :key="tag">{{ tag }}</li>
    </ul>
    <nuxt-content :document="post" />
  </div>
</template>

<script setup>
const route = useRoute();
const { data: post } = await useAsyncData(`post-${route.params.slug}`, () =>
  queryContent('blog', route.params.slug).findOne()
);
</script>
```

## Компоненты для отображения контента

Модуль `@nuxt/content` предоставляет несколько полезных компонентов для отображения вашего контента:

* **`<nuxt-content :document="doc" />`:** Отображает основной обработанный контент документа.
* **`<ContentRenderer :value="doc" />`:** Более низкоуровневый компонент для рендеринга контента.
* **`<ContentRendererMarkdown :value="markdownString" />`:** Рендерит строку Markdown.
* **`<ContentRendererHtml :value="htmlString" />`:** Рендерит строку HTML.

## Конфигурация модуля

Вы можете настроить модуль `@nuxt/content` в секции `content` вашего файла `nuxt.config.js`.

**Пример конфигурации:**

```javascript
export default {
  modules: [
    '@nuxt/content'
  ],
  content: {
    // Настройки модуля
    markdown: {
      remarkPlugins: [
        'remark-emoji' // Пример плагина Remark для обработки эмодзи
      ],
      rehypePlugins: [
        'rehype-katex' // Пример плагина Rehype для обработки LaTeX
      ]
    },
    yaml: {
      // Настройки для YAML
    },
    csv: {
      // Настройки для CSV
      delimiters: {
        delimiter: ';'
      }
    },
    liveEdit: false // Отключить режим "живого редактирования" (для разработки)
  },
  // ... другие настройки
}
```

## Кастомные компоненты для рендеринга

Вы можете зарегистрировать кастомные Vue-компоненты для рендеринга определенных элементов Markdown (например, `<h2>`, `<code>`). Создайте каталог `components/content/` и поместите туда ваши компоненты (например, `components/content/H2.vue`, `components/content/CodeInline.vue`). `@nuxt/content` автоматически их подхватит.

## Режим разработки (`liveEdit`)

В режиме разработки (`liveEdit: true`), `@nuxt/content` отслеживает изменения в ваших файлах контента и автоматически обновляет страницу при их сохранении. Это значительно упрощает процесс разработки контент-ориентированных сайтов.

## Заключение

Модуль `@nuxt/content` предоставляет удобный и мощный способ интеграции контента в ваше Nuxt приложение. Благодаря простой структуре каталогов, мощным возможностям запросов и удобным компонентам, вы можете легко создавать блоги, документации, портфолио и другие контент-ориентированные сайты.