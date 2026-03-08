# Performance Report - VitePress Documentation

**Дата**: 2026-03-08
**Автор**: zoy (optimizer)
**Проект**: Шпаргалки по IT (VitePress v2.0.0-alpha.16)

---

## 1. Текущие метрики

| Метрика | Значение |
|---|---|
| Общий размер build (`dist/`) | **235 MB** |
| Размер assets (`dist/assets/`) | **74 MB** |
| JS файлов в build | **1004** |
| JS файлов > 100KB | **126** |
| CSS файл (один) | **101 KB** (`style.CRH86ZOQ.css`) |
| Markdown исходников | **499 файлов** |
| Markdown > 50KB | **~40 файлов** (6 MB total) |
| Изображения (source) | **~56 файлов** (9.5 MB) |
| Vue компоненты | **4** |
| Время сборки (target) | **~228s** (target: <150s) |
| Node memory limit | **8192 MB** (`--max-old-space-size=8192`) |

### Крупнейшие JS бандлы (build output)

| Файл | Размер |
|---|---|
| `other_react-questions.md.*.js` | **1.1 MB** |
| `other_snippets-js.md.*.js` | **760 KB** |
| `other_snippets-js2.md.*.js` | **348 KB** |
| `basics_angular_unit-testing.md.*.js` | **202 KB** |
| `basics_angular_http-client.md.*.js` | **149 KB** |
| `basics_angular_operators.md.*.js` | **149 KB** |
| `basics_css_animations.md.*.js` | **147 KB** |

### Крупнейшие Markdown источники

| Файл | Размер |
|---|---|
| `other/js-data-structures.md` | **401 KB** |
| `guide/nextjs.md` | **378 KB** |
| `guide/rust.md` | **355 KB** |
| `guide/shorelark.md` | **331 KB** |
| `other/react-questions.md` | **298 KB** |

---

## 2. Найденные проблемы

### 2.1 CRITICAL: Глобальная регистрация LifecycleDemo

**Файл**: `docs/.vitepress/theme/index.ts`

```ts
// ТЕКУЩИЙ КОД - компонент в bundle каждой страницы
import LifecycleDemo from '../components/LifecycleDemo.vue'
export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('LifecycleDemo', LifecycleDemo)
  }
} satisfies Theme
```

**Проблема**: LifecycleDemo (406 строк, включая CSS) загружается глобально через `app.component()`, хотя используется только на одной странице — `basics_vue/vue_lifecycle_component.md`. Это увеличивает размер общего бандла темы.

**Решение**: Перевести на локальный импорт в markdown-файле (как уже сделано с PromiseDemo, AsyncAwaitDemo, GeneratorsDemo).

**Шаги**:
1. Убрать из `docs/.vitepress/theme/index.ts`:
   ```ts
   import DefaultTheme from 'vitepress/theme'
   import type { Theme } from 'vitepress'

   export default {
     extends: DefaultTheme,
   } satisfies Theme
   ```
2. Добавить в `docs/basics_vue/vue_lifecycle_component.md`:
   ```md
   <script setup>
   import LifecycleDemo from '../.vitepress/components/LifecycleDemo.vue'
   </script>
   ```

**Ожидаемый эффект**: Уменьшение общего бандла темы на ~30KB+.

---

### 2.2 MEDIUM: Дублирование CSS между компонентами (~600 строк)

**Файлы**: Все 4 компонента в `docs/.vitepress/components/`

Все компоненты содержат практически идентичные scoped CSS-блоки:

| CSS класс | PromiseDemo | AsyncAwaitDemo | GeneratorsDemo | LifecycleDemo |
|---|---|---|---|---|
| `.demo-header` | YES | YES | YES | YES |
| `.demo-description` | YES | YES | YES | YES |
| `.demo-body` (grid) | YES | YES | YES | YES |
| `.btn`, `.btn-row` | YES | YES | YES | YES |
| `.btn-reset`, `.btn-small` | YES | YES | YES | YES |
| `.logs-section` | YES | YES | YES | YES |
| `.logs-container` | YES | YES | YES | YES |
| `.log-entry` | YES | YES | YES | YES |
| `@keyframes pulse` | YES | YES | YES | YES |
| `.result-display` | YES | YES | -- | -- |

**Решение A** (рекомендуемое): Создать файл общих стилей `docs/.vitepress/components/shared-demo.css` и импортировать в каждый компонент:

```css
/* shared-demo.css */
.demo-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 8px; }
.demo-header h3 { margin: 0; }
.demo-description { margin: 0 0 16px 0; color: var(--vp-c-text-2, #666); font-size: 0.9em; line-height: 1.5; }
.demo-body { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
/* ... и т.д. */
```

**Решение B**: Создать базовый layout-компонент `DemoLayout.vue` с общей разметкой и слотами.

**Ожидаемый эффект**: Уменьшение дублирования на ~600 строк CSS, упрощение поддержки.

---

### 2.3 MEDIUM: Дублирование логики addLog (composable)

**Файлы**: Все 4 компонента

Идентичный код повторяется в каждом компоненте:

```ts
interface LogEntry {
  time: string
  message: string
  type: LogType
}

const logEntries = ref<LogEntry[]>([])

function addLog(message: string, type: LogType = 'info') {
  const time = new Date().toLocaleTimeString()
  logEntries.value.push({ time, message, type })
  if (logEntries.value.length > 30) {
    logEntries.value = logEntries.value.slice(-30)
  }
}

function clearLogs() {
  logEntries.value = []
}
```

**Решение**: Создать composable `docs/.vitepress/composables/useLogEntries.ts`:

```ts
import { ref } from 'vue'

export interface LogEntry {
  time: string
  message: string
  type: string
}

export function useLogEntries(maxEntries = 30) {
  const logEntries = ref<LogEntry[]>([])

  function addLog(message: string, type: string = 'info') {
    const time = new Date().toLocaleTimeString()
    logEntries.value.push({ time, message, type })
    if (logEntries.value.length > maxEntries) {
      logEntries.value = logEntries.value.slice(-maxEntries)
    }
  }

  function clearLogs() {
    logEntries.value = []
  }

  return { logEntries, addLog, clearLogs }
}
```

**Ожидаемый эффект**: Уменьшение дублирования на ~80 строк TS, единая точка изменений.

---

### 2.4 LOW: Неиспользуемые npm-зависимости

**Файл**: `package.json`

| Зависимость | Статус | Обоснование |
|---|---|---|
| `tailwindcss` (^4.1.4) | **НЕ ИСПОЛЬЗУЕТСЯ** | Нет tailwind.config.*, нет postcss.config.*, нет @tailwind/@apply в source |
| `autoprefixer` (^10.4.21) | **НЕ ИСПОЛЬЗУЕТСЯ** | Нет postcss.config.* |
| `postcss` (^8.5.3) | **НЕ ИСПОЛЬЗУЕТСЯ** | Нет postcss.config.* |
| `@docsearch/js` (^3.9.0) | **НЕ ИСПОЛЬЗУЕТСЯ** | Search provider = 'local', не algolia |

**Решение**: Удалить неиспользуемые зависимости:

```bash
npm uninstall tailwindcss autoprefixer postcss @docsearch/js
```

**Ожидаемый эффект**: Уменьшение `node_modules/` на ~50MB, ускорение `npm install`.

---

### 2.5 LOW: Неиспользуемый импорт reactive

**Файл**: `docs/.vitepress/components/PromiseDemo.vue`, строка 2

```ts
import { ref, reactive } from 'vue'  // `reactive` не используется
```

**Решение**: Убрать `reactive` из импорта.

**Ожидаемый эффект**: Минимальный, tree-shaking должен убрать, но чище код.

---

### 2.6 INFO: Огромные markdown-файлы (>200KB)

Несколько markdown-файлов значительно увеличивают время сборки:

- `other/js-data-structures.md` — 401 KB
- `guide/nextjs.md` — 378 KB
- `guide/rust.md` — 355 KB
- `guide/shorelark.md` — 331 KB
- `other/react-questions.md` — 298 KB (build: 1.1 MB JS)

**Рекомендация**: Рассмотреть разделение самых крупных файлов на несколько страниц. Файл `react-questions.md` генерирует JS бандл в 1.1 MB, что замедляет загрузку этой страницы.

---

### 2.7 INFO: Конфигурация sidebar (~800 строк)

**Файл**: `docs/.vitepress/config.mts`

Sidebar занимает ~800 строк в одном файле. Можно вынести в отдельный файл для улучшения maintainability:

```ts
// docs/.vitepress/sidebar.ts
export const sidebar = [ ... ]

// docs/.vitepress/config.mts
import { sidebar } from './sidebar'
```

Это не влияет на runtime-производительность, но упрощает поддержку.

---

## 3. План реализации

| Приоритет | Задача | Ответственный | Эффект |
|---|---|---|---|
| P0 | Локальная регистрация LifecycleDemo | team-lead / bob | -30KB bundle theme |
| P1 | Создать composable useLogEntries | bob / carol | -80 строк дубликатов |
| P1 | Вынести общие CSS стили | bob / carol | -600 строк дубликатов |
| P2 | Удалить неиспользуемые npm-зависимости | zoy | -50MB node_modules |
| P2 | Убрать unused import reactive | zoy | Чище код |
| P3 | Разделить крупные markdown-файлы | - | Быстрее загрузка страниц |
| P3 | Вынести sidebar в отдельный файл | - | Maintainability |

---

## 4. Выводы

Проект в целом имеет нормальную архитектуру для 499 markdown-статей. VitePress корректно выполняет code-splitting. Основные quick-wins:

1. **Глобальная регистрация компонентов** — единственная реальная проблема, влияющая на каждую страницу
2. **Неиспользуемые зависимости** — лишний ballast в node_modules, не влияют на production build
3. **Дублирование кода в компонентах** — влияет на maintainability, не на конечного пользователя (scoped CSS)
4. **Огромные markdown-файлы** — влияют на время загрузки конкретных страниц (до 1.1 MB JS)

Для достижения target build time <150s необходимо:
- Обновить VitePress до стабильной версии (alpha может иметь неоптимизированную сборку)
- Рассмотреть `build.chunkSizeWarningLimit` и ручное chunk splitting для крупнейших страниц
- Оптимизировать изображения (9.5 MB source -> можно сжать до ~3-5 MB с WebP)
