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
        appId: 'SPLFHSTPHL',
        apiKey: '2c961e98fdc50fd23d0eb64db6fd3e4a',
        indexName: 'YOUR_INDEX_NAME',
        placeholder: 'Поиск по документации',
        translations: {
          button: {
            buttonText: 'Поиск',
            buttonAriaLabel: 'Поиск'
          },
          modal: {
            searchBox: {
              resetButtonTitle: 'Очистить запрос',
              resetButtonAriaLabel: 'Очистить запрос',
              cancelButtonText: 'Отмена',
              cancelButtonAriaLabel: 'Отмена'
            },
            startScreen: {
              recentSearchesTitle: 'История поиска',
              noRecentSearchesText: 'Нет истории поиска',
              saveRecentSearchButtonTitle: 'Сохранить в истории поиска',
              removeRecentSearchButtonTitle: 'Удалить из истории поиска',
              favoriteSearchesTitle: 'Избранное',
              removeFavoriteSearchButtonTitle: 'Удалить из избранного'
            },
            errorScreen: {
              titleText: 'Не удалось получить результаты',
              helpText: 'Вы можете проверить подключение к сети'
            },
            footer: {
              selectText: 'выбрать',
              navigateText: 'навигация',
              closeText: 'закрыть',
              searchByText: 'Поиск от'
            },
            noResultsScreen: {
              noResultsText: 'Нет результатов по запросу',
              suggestedQueryText: 'Вы можете попробовать',
              reportMissingResultsText: 'Считаете, что по этому запросу должны быть результаты?',
              reportMissingResultsLinkText: 'Сообщить об этом'
            }
          }
        }
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
        text: 'База TS',
        collapsible: true,
        collapsed: true,
        sidebarKey: 'group2',
        items: [
          {text: 'Types', link: '/basics_ts/types'},
          {text: 'Interfaces', link: '/basics_ts/interfaces'},
          {text: 'Classes', link: '/basics_ts/classes'},
          {text: 'Generics', link: '/basics_ts/generics'},
          {text: 'Enums', link: '/basics_ts/enums'},
          {text: 'Decorators', link: '/basics_ts/decorators'},
          {text: 'Namespaces', link: '/basics_ts/namespaces'},
          {text: 'Modules', link: '/basics_ts/modules'},
          {text: 'Type Assertions', link: '/basics_ts/type_assertions'},
          {text: 'Type Guards', link: '/basics_ts/type_guards'},
          {text: 'Utility Types', link: '/basics_ts/utility_types'},
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
          {text: 'Vue Router', link: '/basics_vue/vue-router'},
          {text: 'Vuex', link: '/basics_vue/vuex'},
          {text: 'Vue CLI', link: '/basics_vue/vue-cli'},
          {text: 'Vue DevTools', link: '/basics_vue/vue-devtools'},
          {text: 'Vue Router 4', link: '/basics_vue/vue-router-4'},
          {text: 'Vuex 4', link: '/basics_vue/vuex-4'},
          {text: 'Vue 3', link: '/basics_vue/vue-3'},
          {text: 'Vue 2', link: '/basics_vue/vue-2'},
        ]
      },
      {
        text: 'База React',
        collapsible: true,
        collapsed: true,
        sidebarKey: 'group2',
        items: [
          {text: 'Components', link: '/basics_react/components'},
          {text: 'Hooks', link: '/basics_react/hooks'},
          {text: 'State Management', link: '/basics_react/state-management'},
          {text: 'Routing', link: '/basics_react/routing'},
          {text: 'Forms', link: '/basics_react/forms'},
          {text: 'Context API', link: '/basics_react/context-api'},
          {text: 'React Router', link: '/basics_react/react-router'},
          {text: 'Redux', link: '/basics_react/redux'},
          {text: 'React Testing Library', link: '/basics_react/react-testing-library'},
          {text: 'React DevTools', link: '/basics_react/react-devtools'},
        ]
      },
      {
        text: 'База CSS',
        collapsible: true,
        collapsed: true,
        sidebarKey: 'group2',
        items: [
          {text: 'Flexbox', link: '/basics_css/flexbox'},
          {text: 'Grid', link: '/basics_css/grid'},
          {text: 'Position', link: '/basics_css/position'},
          {text: 'Responsive Design', link: '/basics_css/responsive-design'},
          {text: 'Transitions', link: '/basics_css/transitions'},
          {text: 'Animations', link: '/basics_css/animations'},
          {text: 'Media Queries', link: '/basics_css/media-queries'},
          {text: 'CSS Variables', link: '/basics_css/css-variables'},
          {text: 'CSS Functions', link: '/basics_css/css-functions'},
          {text: 'CSS Units', link: '/basics_css/css-units'},
        ]
      },
      {
            text: 'База SCSS',
            collapsible: true,
            collapsed: true,
            sidebarKey: 'group2',
            items: [
              {text: 'SCSS Basics', link: '/basics_scss/scss-basics'},
              {text: 'SCSS Variables', link: '/basics_scss/scss-variables'},
              {text: 'SCSS Nesting', link: '/basics_scss/scss-nesting'},
              {text: 'SCSS Mixins', link: '/basics_scss/scss-mixins'},
              {text: 'SCSS Functions', link: '/basics_scss/scss-functions'},
              {text: 'SCSS Partials', link: '/basics_scss/scss-partials'},
              {text: 'SCSS Operators', link: '/basics_scss/scss-operators'},
              {text: 'SCSS Loops', link: '/basics_scss/scss-loops'},
              {text: 'SCSS Conditionals', link: '/basics_scss/scss-conditionals'},
              {text: 'SCSS Maps', link: '/basics_scss/scss-maps'},
              {text: 'SCSS Color Functions', link: '/basics_scss/scss-color-functions'},
              {text: 'SCSS String Functions', link: '/basics_scss/scss-string-functions'},
              {text: 'SCSS List Functions', link: '/basics_scss/scss-list-functions'},
              {text: 'SCSS Import', link: '/basics_scss/scss-import'},
              {text: 'SCSS Inheritance', link: '/basics_scss/scss-inheritance'},
              {text: 'SCSS Placeholder Selectors', link: '/basics_scss/scss-placeholder-selectors'},
              {text: 'SCSS Functions and Mixins', link: '/basics_scss/scss-functions-mixins'},
              {text: 'SCSS Debugging', link: '/basics_scss/scss-debugging'},
              {text: 'SCSS Best Practices', link: '/basics_scss/scss-best-practices'},
            ]
        },
      {
          text: 'База HTML',
          collapsible: true,
          collapsed: true,
          sidebarKey: 'group2',
          items: [
          {text: 'HTML5', link: '/basics_html/html5'},
          {text: 'HTML Attributes', link: '/basics_html/attributes'},
          {text: 'HTML Tags', link: '/basics_html/tags'},
          {text: 'HTML Forms', link: '/basics_html/forms'},
          {text: 'HTML Semantics', link: '/basics_html/semantics'},
          {text: 'HTML Accessibility', link: '/basics_html/accessibility'},
          ]
      },
      {
        text: 'База MySQL',
        collapsible: true,
        collapsed: true,
        sidebarKey: 'group2',
        items: [
          {text: 'MySQL Basics', link: '/basics_mysql/mysql-basics'},
          {text: 'MySQL Functions', link: '/basics_mysql/functions'},
          {text: 'MySQL Joins', link: '/basics_mysql/joins'},
          {text: 'MySQL Indexes', link: '/basics_mysql/indexes'},
          {text: 'MySQL Transactions', link: '/basics_mysql/transactions'},
          {text: 'MySQL Views', link: '/basics_mysql/views'},
          {text: 'MySQL Triggers', link: '/basics_mysql/triggers'},
        ]
      },
      {
        text: 'База PHP',
        collapsible: true,
        collapsed: true,
        sidebarKey: 'group2',
        items: [
          {text: 'PHP Basics', link: '/basics_php/php-basics'},
          {text: 'PHP Functions', link: '/basics_php/functions'},
          {text: 'PHP OOP', link: '/basics_php/oop'},
          {text: 'PHP PDO', link: '/basics_php/pdo'},
          {text: 'PHP MySQL', link: '/basics_php/mysql'},
          {text: 'PHP Composer', link: '/basics_php/composer'},
          {text: 'PHP Unit Testing', link: '/basics_php/unit-testing'},
        ]
      },
      {
        text: 'База MySQL',
        collapsible: true,
        collapsed: true,
        sidebarKey: 'group2',
        items: [
          {text: 'MySQL Basics', link: '/basics_mysql/mysql-basics'},
          {text: 'MySQL Functions', link: '/basics_mysql/functions'},
          {text: 'MySQL Joins', link: '/basics_mysql/joins'},
          {text: 'MySQL Indexes', link: '/basics_mysql/indexes'},
          {text: 'MySQL Transactions', link: '/basics_mysql/transactions'},
          {text: 'MySQL Views', link: '/basics_mysql/views'},
          {text: 'MySQL Triggers', link: '/basics_mysql/triggers'},
        ]
      },
      {
        text: 'База Git',
        collapsible: true,
        collapsed: true,
        sidebarKey: 'group2',
        items: [
          {text: 'Git Basics', link: '/basics_git/git-basics'},
          {text: 'Git Commands', link: '/basics_git/commands'},
          {text: 'Git Branching', link: '/basics_git/branching'},
          {text: 'Git Merging', link: '/basics_git/merging'},
          {text: 'Git Stashing', link: '/basics_git/stashing'},
          {text: 'Git Rebase', link: '/basics_git/rebase'},
          {text: 'Git Cherry-pick', link: '/basics_git/cherry-pick'},
        ]
      },
      {
        text: 'База Node.js',
        collapsible: true,
        collapsed: true,
        sidebarKey: 'group2',
        items: [
          {text: 'Node.js Basics', link: '/basics_nodejs/node-basics'},
          {text: 'Node.js Modules', link: '/basics_nodejs/modules'},
          {text: 'Node.js File System', link: '/basics_nodejs/file-system'},
          {text: 'Node.js HTTP', link: '/basics_nodejs/http'},
          {text: 'Node.js Express', link: '/basics_nodejs/express'},
          {text: 'Node.js MongoDB', link: '/basics_nodejs/mongodb'},
        ]
      },
      {
        text: 'База NUXT',
        collapsible: true,
        collapsed: true,
        sidebarKey: 'group2',
        items: [
            {text: 'Nuxt Basics', link: '/basics_nuxt/nuxt-basics'},
            {text: 'Nuxt Modules', link: '/basics_nuxt/modules'},
            {text: 'Nuxt Middleware', link: '/basics_nuxt/middleware'},
            {text: 'Nuxt Plugins', link: '/basics_nuxt/plugins'},
            {text: 'Nuxt Routing', link: '/basics_nuxt/routing'},
            {text: 'Nuxt Store', link: '/basics_nuxt/store'},
            {text: 'Nuxt Deployment', link: '/basics_nuxt/deployment'},
            {text: 'Nuxt SEO', link: '/basics_nuxt/seo'},
            {text: 'Nuxt Performance', link: '/basics_nuxt/performance'},
            {text: 'Nuxt Testing', link: '/basics_nuxt/testing'},
            {text: 'Nuxt Internationalization', link: '/basics_nuxt/internationalization'},
            {text: 'Nuxt Authentication', link: '/basics_nuxt/authentication'},
            {text: 'Nuxt Error Handling', link: '/basics_nuxt/error-handling'},
            {text: 'Nuxt Static Site Generation', link: '/basics_nuxt/static-site-generation'},
            {text: 'Nuxt Server-Side Rendering', link: '/basics_nuxt/server-side-rendering'},
            {text: 'Nuxt API Routes', link: '/basics_nuxt/api-routes'},
            {text: 'Nuxt Content Module', link: '/basics_nuxt/content-module'},
            {text: 'Nuxt Image Module', link: '/basics_nuxt/image-module'},
            {text: 'Nuxt PWA Module', link: '/basics_nuxt/pwa-module'},
            {text: 'Nuxt Sitemap Module', link: '/basics_nuxt/sitemap-module'},
            {text: 'Nuxt Auth Module', link: '/basics_nuxt/auth-module'},
            {text: 'Nuxt i18n Module', link: '/basics_nuxt/i18n-module'},
            {text: 'Nuxt Axios Module', link: '/basics_nuxt/axios-module'},
            {text: 'Nuxt Firebase Module', link: '/basics_nuxt/firebase-module'},
            {text: 'Nuxt Google Analytics Module', link: '/basics_nuxt/google-analytics-module'},
        ]
      },
      {
        text: 'База Laravel',
        collapsible: true,
        collapsed: true,
        sidebarKey: 'group3',
        items: [          
          {text: 'Commands in console', link: '/basic_laravel/commands_console'},
          {text: 'Laravel MIX', link: '/basics_vue/laravel_mix'}
        ]
      },
      {
        text: 'База Docker',
        collapsible: true,
        collapsed: true,
        sidebarKey: 'group4',
        items: [          
          {text: 'Commands in console', link: '/basic_docker/commands_console'},
          {text: 'Dockerfile', link: '/basic_docker/dockerfile'},
          {text: 'Docker Compose', link: '/basic_docker/docker_compose'},
          {text: 'Docker Networking', link: '/basic_docker/docker_networking'},
          {text: 'Docker Volumes', link: '/basic_docker/docker_volumes'},
          {text: 'Docker Images', link: '/basic_docker/docker_images'},
          {text: 'Docker Containers', link: '/basic_docker/docker_containers'},
          {text: 'Docker Registry', link: '/basic_docker/docker_registry'},
          {text: 'Docker Swarm', link: '/basic_docker/docker_swarm'},
          {text: 'Docker Kubernetes', link: '/basic_docker/docker_kubernetes'},
          {text: 'Docker Security', link: '/basic_docker/docker_security'},
          {text: 'Docker Monitoring', link: '/basic_docker/docker_monitoring'},
          {text: 'Docker Logging', link: '/basic_docker/docker_logging'},
          {text: 'Docker Backup and Restore', link: '/basic_docker/docker_backup_restore'},
          {text: 'Docker Best Practices', link: '/basic_docker/docker_best_practices'},
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