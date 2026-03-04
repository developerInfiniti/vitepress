import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Шпаргалки по IT",
  description: "Just playing around",
  base: '/vitepress/',
  
  // Конфигурация для многоязычности
  locales: {
    root: {
      label: 'Русский',
      lang: 'ru',
      title: "Шпаргалки по IT",
      description: "Ваш быстрый справочник для разработчиков"
    },
    uk: {
      label: 'Українська',
      lang: 'uk',
      title: "IT Шпаргалки",
      description: "Ваш швидкий довідник для розробників"
    }
  },
  themeConfig: {
    // Конфигурация переключателя языков
    langMenuItems: [
      { text: 'Русский', link: '/' },
      { text: 'Українська', link: '/uk/' }
    ],
    
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: 'Поиск',
            buttonAriaLabel: 'Поиск по сайту'
          },
          modal: {
            displayDetails: 'Показать подробности',
            resetButtonTitle: 'Очистить',
            backButtonTitle: 'Назад',
            noResultsText: 'Ничего не найдено',
            footer: {
              selectText: 'выбрать',
              selectKeyAriaLabel: 'enter',
              navigateText: 'навигация',
              navigateUpKeyAriaLabel: 'стрелка вверх',
              navigateDownKeyAriaLabel: 'стрелка вниз',
              closeText: 'закрыть',
              closeKeyAriaLabel: 'escape'
            }
          }
        },
        locales: {
          uk: {
            translations: {
              button: {
                buttonText: 'Пошук',
                buttonAriaLabel: 'Пошук по сайту'
              },
              modal: {
                displayDetails: 'Показати деталі',
                resetButtonTitle: 'Очистити',
                backButtonTitle: 'Назад',
                noResultsText: 'Нічого не знайдено',
                footer: {
                  selectText: 'вибрати',
                  selectKeyAriaLabel: 'enter',
                  navigateText: 'навігація',
                  navigateUpKeyAriaLabel: 'стрілка вгору',
                  navigateDownKeyAriaLabel: 'стрілка вниз',
                  closeText: 'закрити',
                  closeKeyAriaLabel: 'escape'
                }
              }
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
          {text: 'Шпаргалка', link: '/basics_ts/typescript-cheatsheet'},
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
          {text: 'Вопросы и ответы', link: '/basics_ts/questions'},
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
          {text: 'Pinia', link: '/basics_vue/pinia'},
          {text: 'Provide / Inject', link: '/basics_vue/provide-inject'},
          {text: 'Teleport', link: '/basics_vue/teleport'},
          {text: 'Директивы', link: '/basics_vue/custom-directives'},
          {text: 'Transition и анимации', link: '/basics_vue/transitions'},
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
          {text: 'useReducer', link: '/basics_react/use-reducer'},
          {text: 'useMemo и useCallback', link: '/basics_react/use-memo-callback'},
          {text: 'Оптимизация производительности', link: '/basics_react/performance'},
          {text: 'Custom Hooks', link: '/basics_react/custom-hooks'},
          {text: 'Error Boundaries', link: '/basics_react/error-boundaries'},
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
          {text: 'CSS Selectors', link: '/basics_css/css-selectors'},
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
          {text: 'Основы Laravel', link: '/basic_laravel/laravel-basics'},
          {text: 'Маршрутизация', link: '/basic_laravel/laravel-routing'},
          {text: 'Контроллеры', link: '/basic_laravel/laravel-controllers'},
          {text: 'Eloquent ORM', link: '/basic_laravel/laravel-eloquent'},
          {text: 'Связи Eloquent', link: '/basic_laravel/laravel-relations'},
          {text: 'Blade шаблоны', link: '/basic_laravel/laravel-blade'},
          {text: 'Миграции и Seeders', link: '/basic_laravel/laravel-migrations'},
          {text: 'Валидация', link: '/basic_laravel/laravel-validation'},
          {text: 'Middleware', link: '/basic_laravel/laravel-middleware'},
          {text: 'Аутентификация', link: '/basic_laravel/laravel-authentication'},
          {text: 'API', link: '/basic_laravel/laravel-api'},
          {text: 'Artisan команды', link: '/basic_laravel/commands_console'},
          {text: 'Laravel MIX', link: '/basic_laravel/laravel_mix'},
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
        text: 'База Flutter',
        collapsible: true,
        collapsed: true,
        sidebarKey: 'group4',
        items: [
          {text: 'Основы', link: '/basic_flutter/flutter-basics'},
          {text: 'Виджеты', link: '/basic_flutter/flutter-widgets'},
          {text: 'Layouts', link: '/basic_flutter/flutter-layouts'},
          {text: 'Навигация', link: '/basic_flutter/flutter-navigation'},
          {text: 'Сеть', link: '/basic_flutter/flutter-networking'},
          {text: 'State Management', link: '/basic_flutter/flutter-state-management'},
          {text: 'База данных', link: '/basic_flutter/flutter-database'},
          {text: 'Тестирование', link: '/basic_flutter/flutter-testing'},
          {text: 'Анимации', link: '/basic_flutter/flutter-animations'},
          {text: 'Формы', link: '/basic_flutter/flutter-forms'},
          {text: 'Темы и стилизация', link: '/basic_flutter/flutter-themes'},
          {text: 'Асинхронность', link: '/basic_flutter/flutter-async'},
          {text: 'Пакеты и плагины', link: '/basic_flutter/flutter-packages'},
          {text: 'Firebase', link: '/basic_flutter/flutter-firebase'},
          {text: 'Локализация', link: '/basic_flutter/flutter-localization'},
          {text: 'Производительность', link: '/basic_flutter/flutter-performance'},
          {text: 'Жесты', link: '/basic_flutter/flutter-gestures'},
          {text: 'Кастомное рисование', link: '/basic_flutter/flutter-custom-painting'},
          {text: 'Адаптивный дизайн', link: '/basic_flutter/flutter-responsive'},
          {text: 'Архитектура', link: '/basic_flutter/flutter-architecture'},
          {text: 'Отладка и DevTools', link: '/basic_flutter/flutter-debugging'},
          {text: 'Публикация', link: '/basic_flutter/flutter-deployment'},
          {text: 'Доступность (a11y)', link: '/basic_flutter/flutter-accessibility'},
          {text: 'Platform Channels', link: '/basic_flutter/flutter-platform-channels'},
          {text: 'Dependency Injection', link: '/basic_flutter/flutter-dependency-injection'},
          {text: 'Streams и RxDart', link: '/basic_flutter/flutter-streams'},
          {text: 'Безопасность', link: '/basic_flutter/flutter-security'},
          {text: 'FlutterFlow', link: '/basic_flutter/flutter-flutterflow'},
          {
            text: 'Собеседование',
            collapsible: true,
            collapsed: true,
            items: [
              {text: 'Базовые вопросы', link: '/basic_flutter/flutter-interview-basics'},
              {text: 'State Management', link: '/basic_flutter/flutter-interview-state'},
              {text: 'Архитектура', link: '/basic_flutter/flutter-interview-architecture'},
              {text: 'Производительность', link: '/basic_flutter/flutter-interview-performance'},
              {text: 'Продвинутые темы', link: '/basic_flutter/flutter-interview-advanced'},
              {text: 'Практические задачи', link: '/basic_flutter/flutter-interview-practical'},
            ]
          },
        ]
      },
      {
        text: 'База Dart',
        collapsible: true,
        collapsed: true,
        sidebarKey: 'group4',
        items: [
          {text: 'Шпаргалка', link: '/cheatsheet/dart'},
          {text: 'Основы', link: '/basic_dart/dart-basics'},
          {text: 'Импорты и пакеты', link: '/basic_dart/dart-imports-packages'},
          {text: 'Типы и null safety', link: '/basic_dart/dart-types-null-safety'},
          {text: 'Операторы', link: '/basic_dart/dart-operators'},
          {text: 'Строки', link: '/basic_dart/dart-strings'},
          {text: 'Коллекции', link: '/basic_dart/dart-collections'},
          {text: 'Generics', link: '/basic_dart/dart-generics'},
          {text: 'Records', link: '/basic_dart/dart-records'},
          {text: 'Функции', link: '/basic_dart/dart-functions'},
          {text: 'Асинхронность', link: '/basic_dart/dart-async'},
          {text: 'Классы и конструкторы', link: '/basic_dart/dart-classes-constructors'},
          {text: 'ООП', link: '/basic_dart/dart-oop'},
          {text: 'Enum и sealed', link: '/basic_dart/dart-enums-sealed'},
          {text: 'DateTime', link: '/basic_dart/dart-datetime'},
          {text: 'Ошибки и исключения', link: '/basic_dart/dart-errors-exceptions'},
          {text: 'Pattern matching', link: '/basic_dart/dart-pattern-matching'},
          {text: 'IO/HTTP/JSON', link: '/basic_dart/dart-io-http-json'},
          {text: 'Тестирование', link: '/basic_dart/dart-testing'},
          {text: 'Собеседование: Core', link: '/basic_dart/dart-interview-core'},
          {text: 'Собеседование: Async', link: '/basic_dart/dart-interview-async'},
          {text: 'Собеседование: ООП', link: '/basic_dart/dart-interview-oop'},
        ]
      },
      {
        text: 'База Python',
        collapsible: true,
        collapsed: true,
        sidebarKey: 'group4',
        items: [
          {text: 'Основы', link: '/basics_python/python-basics'},
          {text: 'Структуры данных', link: '/basics_python/data-structures'},
          {text: 'Функции', link: '/basics_python/functions'},
          {text: 'ООП', link: '/basics_python/oop'},
          {text: 'Модули и пакеты', link: '/basics_python/modules'},
          {text: 'Работа с файлами', link: '/basics_python/file-handling'},
          {text: 'Исключения', link: '/basics_python/exceptions'},
          {text: 'Асинхронность', link: '/basics_python/async'},
          {text: 'Тестирование', link: '/basics_python/testing'},
          {text: 'Аннотации типов', link: '/basics_python/type-hints'},
          {text: 'Веб-фреймворки', link: '/basics_python/web-frameworks'},
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
        text: 'REST API Design',
        collapsible: true,
        collapsed: true,
        sidebarKey: 'group4',
        items: [
          {text: 'HTTP методы и коды', link: '/api_basics/http-methods'},
          {text: 'REST принципы', link: '/api_basics/rest-principles'},
          {text: 'Версионирование', link: '/api_basics/versioning'},
          {text: 'Обработка ошибок', link: '/api_basics/error-handling'},
        ]
      },
      {
        text: 'База GraphQL',
        collapsible: true,
        collapsed: true,
        sidebarKey: 'group4',
        items: [
          {text: 'Основы', link: '/basics_graphql/graphql-basics'},
          {text: 'Queries', link: '/basics_graphql/queries'},
          {text: 'Mutations', link: '/basics_graphql/mutations'},
          {text: 'Subscriptions', link: '/basics_graphql/subscriptions'},
          {text: 'Schemas', link: '/basics_graphql/schemas'},
          {text: 'Resolvers', link: '/basics_graphql/resolvers'},
          {text: 'Apollo Server', link: '/basics_graphql/apollo-server'},
          {text: 'Apollo Client', link: '/basics_graphql/apollo-client'},
          {text: 'Best Practices', link: '/basics_graphql/best-practices'},
          {text: 'Вопросы на собеседование', link: '/basics_graphql/interview-questions'},
        ]
      },
      {
        text: 'База Testing',
        collapsible: true,
        collapsed: true,
        sidebarKey: 'group4',
        items: [
          {text: 'Основы', link: '/basics_testing/testing-basics'},
          {text: 'Jest', link: '/basics_testing/jest'},
          {text: 'Vitest', link: '/basics_testing/vitest'},
          {text: 'Unit Testing', link: '/basics_testing/unit-testing'},
          {text: 'Mocking', link: '/basics_testing/mocking'},
          {text: 'Testing React', link: '/basics_testing/testing-react'},
          {text: 'Best Practices', link: '/basics_testing/best-practices'},
        ]
      },
      {
        text: 'Playwright E2E тестирование',
        collapsible: true,
        collapsed: true,
        sidebarKey: 'group4',
        items: [
          {text: 'Основы Playwright', link: '/basics_playwright/basics'},
          {text: 'Установка и конфигурация', link: '/basics_playwright/installation'},
          {text: 'Селекторы и навигация', link: '/basics_playwright/selectors'},
          {text: 'Действия и взаимодействие', link: '/basics_playwright/actions'},
          {text: 'Assertions и проверки', link: '/basics_playwright/assertions'},
          {text: 'Best Practices', link: '/basics_playwright/best-practices'},
          {text: 'CI/CD интеграция', link: '/basics_playwright/ci-cd'},
        ]
      },
      {
        text: 'Алгоритмы и структуры данных',
        collapsible: true,
        collapsed: true,
        sidebarKey: 'group4',
        items: [
          {text: 'Сложность алгоритмов (Big O)', link: '/algorithms/big-o'},
          {text: 'Структуры данных', link: '/algorithms/data-structures'},
          {text: 'Сортировка и поиск', link: '/algorithms/sorting-searching'},
          {text: 'Рекурсия и динамическое программирование', link: '/algorithms/recursion-dp'},
          {text: 'Задачи на собеседовании', link: '/algorithms/interview-problems'},
        ]
      },
      {
        text: 'Системный дизайн',
        collapsible: true,
        collapsed: true,
        sidebarKey: 'group4',
        items: [
          {text: 'Введение', link: '/system_design/'},
          {text: 'Масштабирование', link: '/system_design/scaling'},
          {text: 'Кеширование', link: '/system_design/caching'},
          {text: 'Базы данных', link: '/system_design/databases'},
          {text: 'Микросервисы', link: '/system_design/microservices'},
          {text: 'Разбор задач', link: '/system_design/case-studies'},
        ]
      },
      {
        text: 'Паттерны проектирования',
        collapsible: true,
        collapsed: true,
        sidebarKey: 'group4',
        items: [
          {text: 'Введение', link: '/design_patterns/'},
          {text: 'Singleton', link: '/design_patterns/singleton'},
          {text: 'Factory Method', link: '/design_patterns/factory-method'},
          {text: 'Observer', link: '/design_patterns/observer'},
          {text: 'Strategy', link: '/design_patterns/strategy'},
          {text: 'Adapter', link: '/design_patterns/adapter'},
          {text: 'Decorator', link: '/design_patterns/decorator'},
          {text: 'Facade', link: '/design_patterns/facade'},
          {text: 'Command', link: '/design_patterns/command'},
          {text: 'Abstract Factory', link: '/design_patterns/abstract-factory'},
          {text: 'Builder', link: '/design_patterns/builder'},
          {text: 'Prototype', link: '/design_patterns/prototype'},
          {text: 'Bridge', link: '/design_patterns/bridge'},
          {text: 'Composite', link: '/design_patterns/composite'},
          {text: 'Flyweight', link: '/design_patterns/flyweight'},
          {text: 'Proxy', link: '/design_patterns/proxy'},
          {text: 'MVC', link: '/design_patterns/mvc'},
          {text: 'MVVM', link: '/design_patterns/mvvm'},
          {text: 'MVP', link: '/design_patterns/mvp'},
          {text: 'State', link: '/design_patterns/state'},
          {text: 'Template Method', link: '/design_patterns/template-method'},
          {text: 'Visitor', link: '/design_patterns/visitor'},
          {text: 'Iterator', link: '/design_patterns/iterator'},
          {text: 'Mediator', link: '/design_patterns/mediator'},
          {text: 'Memento', link: '/design_patterns/memento'},
          {text: 'Chain of Responsibility', link: '/design_patterns/chain-of-responsibility'},
        ]
      },
      {
        text: 'Руководства',
        link: '/guide/guide'
      },
      {
        text: 'Разное',
        collapsible: true,
        collapsed: true,
        link: '/other/',
        items: [
          {text: '12 Architecture Concepts', link: '/other/architecture-concepts'},
        ]
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
