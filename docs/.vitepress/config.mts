import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Шпаргалки по IT",
  description: "Just playing around",
  base: '/vitepress/',
  themeConfig: {
    search: {
      provider: 'algolia',
      options: {
        appId: '...',
        apiKey: '...',
        indexName: '...'
      }
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Шпаргалки', link: '/markdown-examples' },
      { text: 'Ссылки', link: '/links' },
      { text: 'Разное', link: '/other/' },
      { text: 'Руководства', link: '/guide/guide' }
    ],

    sidebar: [
      {
        text: 'База JS',
        collapsible: true,
        collapsed: true,
        sidebarKey: 'group1',
        items: [
          {
            text: 'Массивы',
            collapsible: true,
            collapsed: true,
            items: [
              { text: 'Методы массивов', link: '/basics_js/array_methods' },
              { text: 'Массивы', link: '/basics_js/arrays' },
            ]
          },
          {
            text: 'Контекст выполнения',
            link: '/basics_js/execution-context',
          },
          {
            text: 'Объекты',
            collapsible: true,
            collapsed: true,
            items: [
              { text: 'Методы объектов', link: '/basics_js/object_methods' },
              { text: 'Объекты', link: '/basics_js/objects' },
            ]
          },
          {
            text: 'Асинхронное программирование',
            collapsible: true,
            collapsed: true,
            items: [
              { text: 'База', link: '/basics_js/async' },
              { text: 'Промисы', link: '/basics_js/promises' },
            ]
          },
          {text: 'Event Loop', link: '/basics_js/event_loop'},
          {text: 'Design patterns', link: '/basics_js/design_patterns'},
          {text: 'Design principles', link: '/basics_js/design_principles'},
          {text: 'Dom', link: '/basics_js/dom'},
          {text: 'Events', link: '/basics_js/events'},
          {text: 'Functions', link: '/basics_js/functions'},
          {text: 'Map', link: '/basics_js/map'},
          {text: 'Set', link: '/basics_js/set'},
          {text: 'Modules', link: '/basics_js/modules'},
          {text: 'Numbers', link: '/basics_js/numbers'},
          {text: 'Strings', link: '/basics_js/strings'},
          {text: 'Часто задаваемые вопросы', link: '/basics_js/questions_1'},
          {text: 'Основные принципы ООП', link: '/basics_js/solid'},
          {text: 'WCAG', link: '/basics_js/WCAG'},
        ]
      },
      {
        text: 'База Vue',
        collapsible: true,
        collapsed: true,
        sidebarKey: 'group2',
        items: [
          {text: 'Components', link: '/basics_vue/components'},
          {text: 'Composables', link: '/basics_vue/composables'},
          {text: 'Composition Api', link: '/basics_vue/composition-api'},
          {text: 'Lifecycle Hooks', link: '/basics_vue/lifecycle_hooks'},
          {text: 'Реактивность', link: '/basics_vue/reactivity'},
          {text: 'Script Setup', link: '/basics_vue/script-setup'},
          {text: 'Suspense', link: '/basics_vue/suspense'},
          {text: 'defineModel', link: '/basics_vue/defineModel'},
          {text: 'Template Refs', link: '/basics_vue/templateRefs'},
          {text: 'Watch Effect', link: '/basics_vue/watchEffect'},
          {text: 'Slots', link: '/basics_vue/slot'},
          {text: 'Вопросы по Vue - 1', link: '/basics_vue/vue_questions'},
        ]
      },
      {
            text: 'API',
            collapsible: true,
            collapsed: true,
            link: '/basics_api/index',
            items: [
              {text: 'Home', link: '/basics_api/index'},
              {
                text: 'Основи API (API Fundamentals)',
                collapsible: true,
                collapsed: true,
                items: [
                  {text: 'Що таке API', link: '/basics_api/something-api'},
                  {text: 'Типи API', link: '/basics_api/api-types'},
                  {text: 'API vs SDK', link: '/basics_api/api-vs-sdk'},
                ]
              },
              {
                text: 'Запит і відповідь API (API Request & Response)',
                collapsible: true,
                collapsed: true,
                items: [
                  {text: 'Методи', link: '/basics_api/methods'},
                  {text: 'Заголовки (Headers)', link: '/basics_api/headers'},
                  {text: 'Коди відповідей', link: '/basics_api/response-codes'},
                ]
              },
              {
                text: 'Аутентифікація та безпека (Authentication & Security)',
                link: '/basics_api/authentication-methods',
                collapsible: true,
                collapsed: true,
                items: [
                  {
                    text: 'Методи аутентифікації',
                    link: '/basics_api/methods',
                    collapsible: true,
                    collapsed: true,
                    items: [
                      {text: 'API Keys', link: '/basics_api/api-keys-description'},
                      {text: 'OAuth 2', link: '/basics_api/o-auth-2'},
                      {text: 'JWT', link: '/basics_api/jwt'},
                      {text: 'Basic Auth', link: '/basics_api/basic-auth'},
                    ]
                  },
                  {
                    text: 'Заходи безпеки',
                    link: '/basics_api/headers',
                    collapsible: true,
                    collapsed: true,
                    items: [
                      {text: 'Rate Limiting', link: '/basics_api/rate-limiting'},
                      {text: 'CORS', link: '/basics_api/cors'},
                      {text: 'HTTPS/TLS', link: '/basics_api/https-tls'}
                    ]
                  },
                ]
              },
              {
                text: 'Проєктування та розробка API (API Design and Development',
                link: '/basics_api/api-design-development',
              },
              {
                text: 'Тестування API (API Testing)',
                link: '/basics_api/testing',
                collapsible: true,
                collapsed: true,
                items: [
                  {
                    text: 'Postman',
                    link: '/basics_api/postman',
                  },
                  {
                    text: 'CURL',
                    link: '/basics_api/curl',
                  },
                  {
                    text: 'Insomnia',
                    link: '/basics_api/insomnia',
                  },
                  {
                    text: 'SoapUI',
                    link: '/basics_api/soap-ui',
                  },
                  {
                    text: 'JSON Placeholder',
                    link: '/basics_api/json-placeholder',
                  },
                  {
                    text: 'WireMock',
                    link: '/basics_api/wire-mock',
                  },
                ]
              },
              {
                text: 'Деплой та інтеграція API (API Deployment & Integration)',
                link: '/basics_api/testing',
                collapsible: true,
                collapsed: true,
                items: [
                  {
                    text: 'Використання API',
                    link: '/basics_api/consuming-apis',
                  },
                  {
                    text: 'third-party',
                    link: '/basics_api/third-party',
                  },
                  {
                    text: 'Шлюзи (Gateways)',
                    link: '/basics_api/gateways',
                  }
                ]
              },
            ]
      },
      {
        text: 'Руководства',
        link: '/guide/guide'
      },
      {
        text: 'Разное',
        link: '/other/'
      },
      {
        text: 'Ссылки',
        link: '/links/'
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/AlexeyZelenko/vitepress' }
    ]
  }
});