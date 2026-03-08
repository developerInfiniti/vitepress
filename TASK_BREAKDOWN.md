# VitePress Improvements — Структурированный список задач

## 📋 Как использовать этот документ

Каждая задача имеет:
- **ID** — уникальный идентификатор
- **Название** — краткое описание
- **Описание** — детали и требования
- **Category** — категория улучшения
- **Priority** — HIGH/MEDIUM/LOW
- **Effort** — Low/Medium/High (сложность реализации)
- **Impact** — Low/Medium/High (влияние на пользователей)
- **Status** — [ ] Не начата, [🔄] В процессе, [✅] Готова

---

## ⚡ ФАЗА 1: БЫСТРЫЕ WINS (Неделя 1-2)

### Task #1: Добавить Copy button для code blocks
- **Category**: UX Improvements
- **Priority**: HIGH
- **Effort**: Low
- **Impact**: High
- **Status**: [ ] Не начата
- **Description**:
  - Добавить кнопку копирования для всех `<code>` блоков
  - Использовать Navigator.clipboard API
  - Показать tooltip "Copied!" на 2 сек после клика
  - Использовать иконку (copy/checkmark)
  - Работать на всех страницах с кодом
- **Files to modify**:
  - `docs/.vitepress/theme/` (custom components)
  - или добавить в `shared-demo-styles.css`
- **Testing**: Проверить на разных типах code blocks

---

### Task #2: RegExp documentation
- **Category**: Missing Documentation
- **Priority**: HIGH
- **Effort**: Medium
- **Impact**: High
- **Status**: [ ] Не начата
- **Description**:
  - Создать новую статью `/docs/basics_js/regex.md`
  - Разделы:
    1. Основы — синтаксис, литерализация
    2. Флаги — g, i, m, s, u, y (описание и примеры)
    3. Методы — test(), exec(), match(), replace(), split()
    4. Character Classes — \d, \w, \s, ., [abc], [^abc]
    5. Quantifiers — *, +, ?, {n}, {n,m}
    6. Groups и Capturing — (), (?:), \1, \2
    7. Assertions — ^, $, \b, lookahead, lookbehind
    8. Практические примеры — email, URL, phone, date
  - Интерактивные примеры в каждом разделе
  - Добавить в config.mts сайдбар
- **Testing**: Проверить все примеры работают

---

### Task #3: Web Storage documentation
- **Category**: Missing Documentation
- **Priority**: HIGH
- **Effort**: Medium
- **Impact**: Medium
- **Status**: [ ] Не начата
- **Description**:
  - Создать новую статью `/docs/basics_js/web-storage.md`
  - Разделы:
    1. Обзор — localStorage vs sessionStorage vs IndexedDB
    2. localStorage — сохранение, чтение, удаление, размер
    3. sessionStorage — поведение, различия с localStorage
    4. Session Duration — когда очищается
    5. Безопасность — CORS, XSS, шифрование
    6. Практические примеры — user preferences, cart, session
    7. Ограничения — size limits (5MB), синхронность
  - Интерактивные примеры (demo component)
  - Добавить в config.mts
- **Files to modify**:
  - Создать `/docs/basics_js/web-storage.md`
  - Обновить `docs/.vitepress/config.mts`
- **Testing**: Примеры работают в браузере

---

### Task #4: Dark mode toggle
- **Category**: UX Improvements
- **Priority**: HIGH
- **Effort**: Medium
- **Impact**: High
- **Status**: [ ] Не начата
- **Description**:
  - Добавить toggle в navbar/header
  - Сохранять выбор в localStorage
  - Поддерживать system preference (prefers-color-scheme)
  - Переключение между светлой и темной темой
  - CSS переменные для темизирования
- **Implementation**:
  1. Создать composable `useTheme.ts`
  2. Добавить CSS variables в theme
  3. Добавить toggle компонент в `DefaultTheme.vue`
  4. Обновить `tailwind.config.js` если используется
- **Testing**: Проверить toggle работает, сохраняется при refresh

---

### Task #5: Fetch API Demo component
- **Category**: Interactive Components
- **Priority**: HIGH
- **Effort**: Medium
- **Impact**: High
- **Status**: [ ] Не начата
- **Description**:
  - Создать Vue компонент `FetchAPIDemo.vue`
  - Функциональность:
    1. Input field для URL
    2. Select для HTTP метода (GET, POST, PUT, DELETE)
    3. Textarea для request body (JSON)
    4. Headers таблица (добавить/удалить)
    5. Send button
    6. Визуализация response (status, headers, body)
    7. Error handling и timeout
    8. Loading state с spinner
  - Интеграция с JSONPlaceholder API для примеров
  - 3-4 preset сценария (GET, POST, error)
- **Files to create**:
  - `/docs/.vitepress/components/FetchAPIDemo.vue`
  - Документация: `/docs/basics_js/fetch-api.md`
- **Integration**: Добавить в `basics_js/async.md` или создать отдельно

---

## 📚 ФАЗА 2: ОСНОВНОЙ КОНТЕНТ (Неделя 3-4)

### Task #6: Error Handling documentation
- **Category**: Missing Documentation
- **Priority**: HIGH
- **Effort**: Medium
- **Impact**: Medium
- **Status**: [ ] Не начата
- **Description**:
  - Создать `/docs/basics_js/error-handling.md`
  - Разделы:
    1. try/catch/finally — синтаксис и поведение
    2. Error типы — Error, TypeError, ReferenceError, SyntaxError и др.
    3. Custom Errors — создание своих типов ошибок
    4. Error Handling Patterns — try-catch vs promises vs async/await
    5. Best Practices — логирование, recovery, graceful degradation
    6. Debugging — console методы, debugger, DevTools
    7. React Error Boundaries (как отдельный раздел)
  - Практические примеры для каждого типа ошибки
  - Добавить в config.mts

---

### Task #7: Web APIs documentation (part 1 - Fetch)
- **Category**: Missing Documentation
- **Priority**: HIGH
- **Effort**: High
- **Impact**: High
- **Status**: [ ] Не начата
- **Description**:
  - Уже частично покрыто в Task #5, но нужна полная документация
  - `/docs/basics_js/fetch-api.md` (если отдельно от async.md)
  - Разделы:
    1. Basics — fetch синтаксис, promise-based
    2. Request options — method, headers, body, credentials, mode, cache
    3. Response handling — response.ok, status, headers, body.json()
    4. Error handling — network errors vs HTTP errors
    5. Abort requests — AbortController
    6. CORS и credentials
    7. File uploads — FormData, multipart
    8. vs XMLHttpRequest (сравнение)
  - Примеры с настоящими APIs (JSONPlaceholder)

---

### Task #8: Memory Management documentation
- **Category**: Missing Documentation
- **Priority**: HIGH
- **Effort**: Medium
- **Impact**: Medium
- **Status**: [ ] Не начата
- **Description**:
  - Создать `/docs/basics_js/memory-management.md`
  - Разделы:
    1. Garbage Collection — как JS управляет памятью
    2. Reference types vs Value types
    3. Memory Leaks — типичные причины (closures, listeners, timers)
    4. WeakMap и WeakSet — слабые ссылки
    5. Performance.memory API — отслеживание памяти
    6. DevTools — профилирование памяти
    7. Optimization техники
  - Интерактивные примеры утечек и как их избежать

---

### Task #9: Breadcrumb navigation
- **Category**: UX Improvements
- **Priority**: MEDIUM
- **Effort**: Medium
- **Impact**: Medium
- **Status**: [ ] Не начата
- **Description**:
  - Добавить breadcrumb компонент в страницы
  - Показывать текущий путь: Home > Basics JS > Arrays > Array Methods
  - Кликабельные ссылки на предыдущие уровни
  - Responsive — скрывать промежуточные на мобильных
- **Files to modify**:
  - Создать `components/Breadcrumb.vue`
  - Обновить `DefaultTheme.vue`
  - Добавить CSS styling
- **Integration**: Использовать $page.filePath из VitePress

---

### Task #10: Table of Contents with scroll sync
- **Category**: UX Improvements
- **Priority**: MEDIUM
- **Effort**: Medium
- **Impact**: Medium
- **Status**: [ ] Не начата
- **Description**:
  - Улучшить встроенный TOC в VitePress
  - Синхронизация скролла — подсвечивать текущий раздел
  - Smooth scrolling к заголовкам
  - Отображение глубины (indent для подзаголовков)
  - Sticky позиция на боковой панели
- **Files to modify**:
  - `docs/.vitepress/theme/custom-layout.vue` или `DefaultTheme.vue`
  - CSS для styling и animations
- **Testing**: Проверить скролл синхронизацию на разных страницах

---

### Task #11: WebSockets documentation
- **Category**: Missing Documentation
- **Priority**: MEDIUM
- **Effort**: High
- **Impact**: Medium
- **Status**: [ ] Не начата
- **Description**:
  - Создать `/docs/basics_js/websockets.md`
  - Разделы:
    1. Basics — что такое WebSocket, отличие от HTTP polling
    2. Connection — new WebSocket(), события open/message/close/error
    3. Sending data — send(), data types (strings, blobs, arraybuffers)
    4. Receive data — обработка сообщений, parsing JSON
    5. Connection lifecycle — reconnection, heartbeat, graceful close
    6. Security — wss://, origin checking, token auth
    7. Frameworks — интеграция с socket.io или других библиотек
    8. Real-world example — simple chat demo
  - Интерактивный demo компонент (простой чат или примеры)

---

## 🎨 ФАЗА 3: ИНТЕРАКТИВНЫЕ КОМПОНЕНТЫ (Неделя 5-6)

### Task #12: RegExp Tester component
- **Category**: Interactive Components
- **Priority**: MEDIUM
- **Effort**: High
- **Impact**: Medium
- **Status**: [ ] Не начата
- **Description**:
  - Создать интерактивный Vue компонент `RegExpTester.vue`
  - Функциональность:
    1. Input для RegExp pattern
    2. Input для test string
    3. Checkboxes для флагов (g, i, m, s, u, y)
    4. Real-time результаты match/exec
    5. Подсветка матчей в string
    6. Таблица результатов (groups, index, input)
    7. Объяснение синтаксиса
    8. Галерея популярных паттернов (email, URL, phone)
  - Styling похоже на regex101.com
- **Files to create**:
  - `/docs/.vitepress/components/RegExpTester.vue`
  - Интеграция в `docs/basics_js/regex.md`

---

### Task #13: Performance Visualizer component
- **Category**: Interactive Components
- **Priority**: MEDIUM
- **Effort**: High
- **Impact**: Low-Medium
- **Status**: [ ] Не начата
- **Description**:
  - Визуализация алгоритмов сортировки
  - Компонент: `AlgorithmVisualizer.vue`
  - Функциональность:
    1. Select для выбора алгоритма (Bubble Sort, Quick Sort, Merge Sort)
    2. Input для размера массива
    3. Speed control (анимация скорость)
    4. Start/Pause/Reset кнопки
    5. Цветная визуализация массива (сравнения, свопы)
    6. Счетчик операций, время выполнения
    7. Сравнение разных алгоритмов
  - Canvas или CSS animations для визуализации
- **Files to create**:
  - `/docs/.vitepress/components/AlgorithmVisualizer.vue`
  - Интеграция в `docs/algorithms/sorting-searching.md`

---

### Task #14: DOM Manipulation Playground
- **Category**: Interactive Components
- **Priority**: MEDIUM
- **Effort**: High
- **Impact**: Medium
- **Status**: [ ] Не начата
- **Description**:
  - Интерактивная песочница для DOM API
  - Компонент: `DOMPlayground.vue`
  - Функциональность:
    1. HTML editor (левая панель)
    2. JavaScript editor (средняя панель)
    3. Live preview (правая панель)
    4. Run/Reset кнопки
    5. Консоль для вывода console.log
    6. Preset примеры (querySelector, addEventListener, создание элементов)
  - Безопасное выполнение (iframe sandbox)
- **Files to create**:
  - `/docs/.vitepress/components/DOMPlayground.vue`
  - Интеграция в `docs/basics_js/dom.md`

---

### Task #15: CSS Grid/Flexbox Playground
- **Category**: Interactive Components
- **Priority**: MEDIUM
- **Effort**: High
- **Impact**: Medium
- **Status**: [ ] Не начата
- **Description**:
  - Интерактивный playground для CSS Grid и Flexbox
  - Компонент: `CSSPlayground.vue`
  - Функциональность:
    1. Выбор Layout Type (Grid/Flexbox)
    2. Слайдеры для свойств:
       - justify-content, align-items
       - gap, padding
       - grid-template-columns (для Grid)
       - flex-direction, flex-wrap (для Flexbox)
    3. Live preview с цветными боксами
    4. Генерация CSS кода для копирования
    5. Preset layouts (3-column, sidebar, card grid)
  - Визуальное объяснение каждого свойства
- **Files to create**:
  - `/docs/.vitepress/components/CSSPlayground.vue`
  - Интеграция в `docs/basics_css/flexbox.md` и `docs/basics_css/grid.md`

---

## 🔍 ФАЗА 4: SEO И КАЧЕСТВО (Неделя 7-8)

### Task #16: Add OpenGraph meta tags
- **Category**: SEO Improvements
- **Priority**: MEDIUM
- **Effort**: Medium
- **Impact**: Medium
- **Status**: [ ] Не начата
- **Description**:
  - Добавить OpenGraph tags для социального sharing
  - Метатеги:
    - `og:title` — заголовок страницы
    - `og:description` — описание
    - `og:image` — preview изображение (генерировать или использовать default)
    - `og:type` — article, website
    - `og:url` — канонический URL
  - Интеграция с `config.mts` и frontmatter в .md файлах
  - Проверка в Twitter Card validator
- **Files to modify**:
  - `docs/.vitepress/config.mts`
  - Обновить layout для вставки метатегов

---

### Task #17: Add Structured Data (Schema.org)
- **Category**: SEO Improvements
- **Priority**: MEDIUM
- **Effort**: High
- **Impact**: Medium
- **Status**: [ ] Не начата
- **Description**:
  - Добавить JSON-LD structured data для Schema.org
  - Типы:
    1. WebSite schema для главной страницы
    2. BreadcrumbList для навигации
    3. Article schema для документации страниц
    4. FAQPage schema где есть Q&A разделы
  - Генерация в layout компонентах
  - Проверка в Google Rich Results Test
- **Files to modify**:
  - Создать layout компоненты с JSON-LD
  - `docs/.vitepress/theme/layouts/`

---

### Task #18: Improve meta descriptions
- **Category**: SEO Improvements
- **Priority**: MEDIUM
- **Effort**: Low-Medium
- **Impact**: Medium
- **Status**: [ ] Не начата
- **Description**:
  - Обновить meta descriptions для каждой страницы
  - Требования:
    - Уникальное описание (не generic)
    - 150-160 символов
    - Включить ключевые слова
    - Call-to-action где уместно
  - Добавить в frontmatter каждого .md файла
  - Обновить config для использования description из frontmatter
- **Files to modify**:
  - Все .md файлы в `/docs/basics_*/`
  - `docs/.vitepress/config.mts` (layout обновить)

---

### Task #19: Setup Lighthouse CI
- **Category**: Quality Assurance
- **Priority**: MEDIUM
- **Effort**: High
- **Impact**: Medium
- **Status**: [ ] Не начата
- **Description**:
  - Настроить Lighthouse CI для автоматических проверок
  - Метрики:
    1. Performance score
    2. Accessibility score
    3. Best Practices score
    4. SEO score
  - Integration с GitHub Actions (если используется)
  - Настроить пороги (thresholds)
  - Reports и tracking история
- **Files to create/modify**:
  - `.github/workflows/lighthouse.yml` (CI config)
  - `lighthouserc.json` (Lighthouse config)

---

### Task #20: Link Checker
- **Category**: Quality Assurance
- **Priority**: LOW
- **Effort**: Low
- **Impact**: Low
- **Status**: [ ] Не начата
- **Description**:
  - Добавить автоматическую проверку мертвых ссылок
  - Инструмент: broken-link-checker или linkinator
  - Проверять:
    1. Внутренние ссылки (.md файлы, компоненты)
    2. Внешние ссылки (URLs в документации)
  - CI интеграция для каждого PR
  - Отчет о найденных ошибках
- **Files to create/modify**:
  - `.github/workflows/link-check.yml`
  - `package.json` (добавить скрипт)

---

## 📊 СТАТУС ОТСЛЕЖИВАНИЯ

### Заполнять по мере выполнения:

| Task ID | Название | Статус | Assignee | % Complete | Notes |
|---------|----------|--------|----------|-----------|-------|
| #1 | Copy button | [ ] | - | 0% | - |
| #2 | RegExp docs | [ ] | - | 0% | - |
| #3 | Web Storage docs | [ ] | - | 0% | - |
| #4 | Dark mode | [ ] | - | 0% | - |
| #5 | Fetch API Demo | [ ] | - | 0% | - |
| #6 | Error Handling docs | [ ] | - | 0% | - |
| #7 | Web APIs (Fetch) | [ ] | - | 0% | - |
| #8 | Memory Management | [ ] | - | 0% | - |
| #9 | Breadcrumbs | [ ] | - | 0% | - |
| #10 | TOC with sync | [ ] | - | 0% | - |
| #11 | WebSockets docs | [ ] | - | 0% | - |
| #12 | RegExp Tester | [ ] | - | 0% | - |
| #13 | Algorithm Visualizer | [ ] | - | 0% | - |
| #14 | DOM Playground | [ ] | - | 0% | - |
| #15 | CSS Playground | [ ] | - | 0% | - |
| #16 | OpenGraph tags | [ ] | - | 0% | - |
| #17 | Structured Data | [ ] | - | 0% | - |
| #18 | Meta descriptions | [ ] | - | 0% | - |
| #19 | Lighthouse CI | [ ] | - | 0% | - |
| #20 | Link Checker | [ ] | - | 0% | - |

---

## 🎯 ИТОГО

- **Всего задач**: 20
- **Фаза 1 (Неделя 1-2)**: 5 задач (быстрые wins)
- **Фаза 2 (Неделя 3-4)**: 6 задач (основной контент)
- **Фаза 3 (Неделя 5-6)**: 5 задач (компоненты)
- **Фаза 4 (Неделя 7-8)**: 4 задач (SEO и качество)

**Ожидаемый результат**: Полностью обновленная документация с интерактивными компонентами, улучшенным UX и высоким SEO рейтингом.

---

**Документ обновлен**: 2026-03-08
**Версия**: 1.0
