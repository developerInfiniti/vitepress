# System Design: Demo Components Architecture

**Версия:** 1.0
**Дата:** 2026-03-08
**Автор:** piter (architect)

---

## 1. Обзор

Данный документ описывает архитектуру интерактивных демо-компонентов проекта VitePress IT Documentation. Цель — установить единые паттерны, guidelines и best practices для создания, интеграции и поддержки компонентов.

### 1.1 Текущие компоненты

| Компонент | Расположение | Регистрация | Тема |
|---|---|---|---|
| LifecycleDemo | `components/LifecycleDemo.vue` | Глобальная (theme/index.ts) | Vue Lifecycle Hooks |
| PromiseDemo | `components/PromiseDemo.vue` | Локальная (script setup) | JavaScript Promises |
| AsyncAwaitDemo | `components/AsyncAwaitDemo.vue` | Локальная (script setup) | Async/Await |
| GeneratorsDemo | `components/GeneratorsDemo.vue` | Локальная (script setup) | Generators/Yield |

### 1.2 Расположение файлов

```
docs/
├── .vitepress/
│   ├── components/          # Vue демо-компоненты
│   │   ├── __tests__/       # Unit-тесты (Vitest)
│   │   ├── LifecycleDemo.vue
│   │   ├── PromiseDemo.vue
│   │   ├── AsyncAwaitDemo.vue
│   │   └── GeneratorsDemo.vue
│   ├── composables/         # (планируется) Shared composables
│   │   └── useLog.ts
│   ├── styles/              # (планируется) Shared CSS
│   │   └── shared-demo-styles.css
│   └── theme/
│       └── index.ts         # Глобальная регистрация компонентов
├── basics_js/
│   ├── promises.md          # Использует <PromiseDemo />
│   ├── async-await.md       # Использует <AsyncAwaitDemo />
│   └── generators.md        # Использует <GeneratorsDemo />
└── basics_vue/
    └── vue_lifecycle_component.md  # Использует <LifecycleDemo />
```

---

## 2. Архитектурные паттерны

### 2.1 Анатомия демо-компонента

Каждый демо-компонент следует единой структуре из трёх блоков:

```
┌─────────────────────────────────────────┐
│  Header: заголовок + state badge        │
│  Description: краткое описание          │
├────────────────────┬────────────────────┤
│  Controls Panel    │  Logs Panel        │
│  - Кнопки          │  - LogEntry[]      │
│  - Inputs          │  - Временные метки │
│  - Результаты      │  - Цветовое кодир. │
└────────────────────┴────────────────────┘
```

**Структура SFC (Single File Component):**

```vue
<script setup lang="ts">
// 1. Импорты Vue API
// 2. Определение типов (State, LogType, LogEntry)
// 3. Реактивное состояние (ref, reactive)
// 4. Функция addLog()
// 5. Бизнес-логика (основные функции демо)
// 6. Вспомогательные функции (reset, clear)
// 7. Константы (labels, configs)
</script>

<template>
  <!-- Обёртка .{name}-demo -->
  <!--   .demo-header (h3 + state-badge) -->
  <!--   .demo-description -->
  <!--   .demo-body (grid 1fr 1fr) -->
  <!--     .controls-section -->
  <!--     .logs-section -->
</template>

<style scoped>
/* Scoped CSS с VitePress переменными */
</style>
```

### 2.2 Система состояний

Каждый компонент управляет состоянием через `ref<State>()`:

```typescript
// Паттерн: конечный автомат состояний
type State = 'idle' | 'active' | 'success' | 'error'

const state = ref<State>('idle')
```

**Правила переходов:**
- `idle` — начальное состояние, все действия доступны
- `active/pending/loading` — операция выполняется, блокировка повторных запусков
- `success/fulfilled` — успешное завершение
- `error/rejected` — ошибка

State отображается пользователю через badge с цветовым кодированием:

| Состояние | Цвет | CSS-класс |
|---|---|---|
| idle | Серый `#95a5a6` | `.state-idle` |
| pending/loading | Оранжевый `#f39c12` + pulse | `.state-pending` |
| success/fulfilled | Зелёный `#27ae60` | `.state-fulfilled` |
| error/rejected | Красный `#e74c3c` | `.state-rejected` |

### 2.3 Система логирования

Все компоненты реализуют единую систему логов:

```typescript
interface LogEntry {
  time: string      // toLocaleTimeString()
  message: string   // Текст лога
  type: LogType     // Тип для цветового кодирования
}

// LogType варьируется по компонентам:
// PromiseDemo:    'info' | 'success' | 'error' | 'pending'
// AsyncAwaitDemo: 'info' | 'success' | 'error' | 'pending'
// GeneratorsDemo: 'info' | 'value' | 'done' | 'error'
// LifecycleDemo:  'lifecycle' | 'watch' | 'effect' | 'action'
```

**Рекомендация:** Объединить в composable `useLog()` с поддержкой custom типов через generics.

### 2.4 Layout система

Двухколоночная grid-сетка с responsive fallback:

```css
.demo-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

@media (max-width: 640px) {
  .demo-body {
    grid-template-columns: 1fr;
  }
}
```

---

## 3. Рекомендации по рефакторингу

### 3.1 Composable `useLog<T>()`

**Проблема:** Функции `addLog()`, `clearLogs()`, интерфейс `LogEntry` и логика лимитирования дублируются в каждом компоненте (~25 строк x 4 компонента).

**Решение:**

```typescript
// docs/.vitepress/composables/useLog.ts

export interface LogEntry<T extends string = string> {
  time: string
  message: string
  type: T
}

export function useLog<T extends string = string>(maxEntries = 30) {
  const logEntries = ref<LogEntry<T>[]>([])

  function addLog(message: string, type: T) {
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

**Использование в компоненте:**

```typescript
import { useLog } from '../composables/useLog'

type PromiseLogType = 'info' | 'success' | 'error' | 'pending'

const { logEntries, addLog, clearLogs } = useLog<PromiseLogType>(30)
```

**Влияние:** Удаление ~100 строк дублированного кода суммарно.

### 3.2 Shared CSS

**Проблема:** ~120 строк идентичных стилей в каждом компоненте (кнопки, логи, layout, badge).

**Решение:** Создать `docs/.vitepress/styles/shared-demo-styles.css`:

```css
/* Базовые стили демо-компонентов */

/* Layout */
.demo-wrapper { /* ... */ }
.demo-header { /* ... */ }
.demo-description { /* ... */ }
.demo-body { /* grid layout */ }

/* State Badges */
.state-badge { /* ... */ }

/* Buttons */
.btn { /* базовый стиль */ }
.btn-create, .btn-resolve, .btn-reject, .btn-reset { /* варианты */ }

/* Logs */
.logs-section { /* ... */ }
.logs-container { /* тёмный терминал */ }
.log-entry { /* ... */ }

/* Results */
.result-display { /* ... */ }
.result-success, .result-error { /* ... */ }
```

**Подключение:** Импорт в `theme/index.ts`:

```typescript
import '../styles/shared-demo-styles.css'
```

**Влияние:** Удаление ~480 строк дублированного CSS (120 x 4 компонента), замена на один файл ~150 строк.

### 3.3 Регистрация компонентов

**Проблема:** LifecycleDemo зарегистрирован глобально (загружается на всех страницах), остальные — локально.

**Рекомендация:** Использовать **локальную регистрацию** для всех компонентов:

```markdown
---
title: Промисы
---

<script setup>
import PromiseDemo from '../.vitepress/components/PromiseDemo.vue'
</script>

# Promises

<PromiseDemo />
```

**Обоснование:**
- Компонент загружается только на нужной странице
- Уменьшает bundle size остальных страниц (~30KB+ экономия)
- Явная зависимость — видно, какие компоненты использует страница

**Глобальную регистрацию** использовать только если компонент нужен на 3+ страницах.

---

## 4. Guidelines для новых компонентов

### 4.1 Чек-лист создания компонента

1. **Файл:** `docs/.vitepress/components/{Name}Demo.vue`
2. **TypeScript:** Обязательно `<script setup lang="ts">`
3. **Состояние:** Определить `type State` и управлять через `ref<State>()`
4. **Логи:** Использовать composable `useLog<CustomLogType>()`
5. **Layout:** Следовать двухколоночной сетке (controls + logs)
6. **Стили:** Импортировать shared CSS, добавлять только уникальные стили в scoped
7. **Responsive:** Breakpoint на 640px для мобильных
8. **Data-testid:** Добавлять на все интерактивные элементы
9. **Тесты:** Создать `__tests__/{Name}Demo.spec.ts`
10. **Интеграция:** Локальный импорт в markdown через `<script setup>`

### 4.2 Шаблон нового компонента

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useLog } from '../composables/useLog'

// 1. Типы
type DemoState = 'idle' | 'running' | 'done' | 'error'
type DemoLogType = 'info' | 'success' | 'error' | 'step'

// 2. Состояние
const state = ref<DemoState>('idle')
const { logEntries, addLog, clearLogs } = useLog<DemoLogType>(30)

// 3. Основная логика
function startDemo() {
  state.value = 'running'
  addLog('Демо запущено', 'info')
  // ... логика
}

function resetDemo() {
  state.value = 'idle'
  addLog('--- Демо сброшено ---', 'info')
}

// 4. Labels
const stateLabels: Record<DemoState, string> = {
  idle: 'Ожидание',
  running: 'Выполнение',
  done: 'Завершено',
  error: 'Ошибка',
}
</script>

<template>
  <div class="new-demo demo-wrapper">
    <div class="demo-header">
      <h3>NewFeature - Интерактивная демонстрация</h3>
      <span class="state-badge" :class="`state-${state}`">
        {{ stateLabels[state] }}
      </span>
    </div>

    <p class="demo-description">
      Описание того, что демонстрирует компонент.
    </p>

    <div class="demo-body">
      <div class="controls-section">
        <div class="control-group">
          <div class="btn-row">
            <button
              class="btn btn-create"
              :disabled="state === 'running'"
              @click="startDemo"
              data-testid="start"
            >
              Запустить
            </button>
            <button
              class="btn btn-reset"
              @click="resetDemo"
              data-testid="reset"
            >
              Сброс
            </button>
          </div>
        </div>
      </div>

      <div class="logs-section">
        <div class="logs-header">
          <strong>Логи выполнения:</strong>
          <button class="btn btn-small" @click="clearLogs" data-testid="clear-logs">
            Очистить
          </button>
        </div>
        <div class="logs-container" data-testid="logs">
          <div
            v-for="(entry, index) in logEntries"
            :key="index"
            class="log-entry"
            :class="`log-${entry.type}`"
          >
            [{{ entry.time }}] {{ entry.message }}
          </div>
          <div v-if="logEntries.length === 0" class="log-empty">
            Логи пусты. Нажмите «Запустить» для начала.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Только уникальные стили компонента */
/* Общие стили подключаются через shared-demo-styles.css */
</style>
```

### 4.3 Шаблон интеграции в Markdown

```markdown
---
title: Feature Name
description: Краткое описание раздела
---

<script setup>
import NewDemo from '../.vitepress/components/NewDemo.vue'
</script>

# Feature Name

## Интерактивная демонстрация

<NewDemo />

## Основная теория

...текст документации...
```

### 4.4 Шаблон теста

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import NewDemo from '../NewDemo.vue'

describe('NewDemo', () => {
  it('renders in idle state', () => {
    const wrapper = mount(NewDemo)
    expect(wrapper.find('[data-testid="start"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Ожидание')
  })

  it('starts demo on button click', async () => {
    const wrapper = mount(NewDemo)
    await wrapper.find('[data-testid="start"]').trigger('click')
    expect(wrapper.text()).toContain('Выполнение')
  })

  it('resets demo state', async () => {
    const wrapper = mount(NewDemo)
    await wrapper.find('[data-testid="start"]').trigger('click')
    await wrapper.find('[data-testid="reset"]').trigger('click')
    expect(wrapper.text()).toContain('Ожидание')
  })

  it('adds log entries', async () => {
    const wrapper = mount(NewDemo)
    await wrapper.find('[data-testid="start"]').trigger('click')
    const logs = wrapper.find('[data-testid="logs"]')
    expect(logs.findAll('.log-entry').length).toBeGreaterThan(0)
  })

  it('clears logs', async () => {
    const wrapper = mount(NewDemo)
    await wrapper.find('[data-testid="start"]').trigger('click')
    await wrapper.find('[data-testid="clear-logs"]').trigger('click')
    expect(wrapper.find('.log-empty').exists()).toBe(true)
  })
})
```

---

## 5. Best Practices

### 5.1 Производительность

- **Локальная регистрация** компонентов (не глобальная)
- **Лимит логов** — всегда ограничивать массив (30-40 записей)
- **onUnmounted cleanup** — очищать таймеры, AbortController, интервалы
- **Scoped CSS** — избегать глобального загрязнения стилей

### 5.2 Доступность (a11y)

- Кнопки имеют `:disabled` состояние при блокировке
- State badge использует текст, не только цвет
- Логи в контейнере с `overflow-y: auto` для скролла

### 5.3 Responsive Design

- Breakpoint: `640px` — переход с двух колонок на одну
- Кнопки обёрнуты в `flex-wrap: wrap` для переноса
- Используются относительные единицы (`em`, `%`) для шрифтов

### 5.4 VitePress интеграция

- Использовать CSS-переменные VitePress: `--vp-c-brand-1`, `--vp-c-bg-soft`, `--vp-c-text-2`, `--vp-c-divider`
- Fallback значения: `var(--vp-c-brand-1, #3eaf7c)`
- Компонент оборачивать в `margin: 20px 0` для отступов от markdown-контента
- Демо-компонент размещать в начале статьи (после заголовка H1) для вовлечения

### 5.5 Именование

| Элемент | Конвенция | Пример |
|---|---|---|
| Файл компонента | `{Feature}Demo.vue` | `IteratorsDemo.vue` |
| CSS-обёртка | `.{feature}-demo` | `.iterators-demo` |
| data-testid | kebab-case | `data-testid="create-iterator"` |
| Типы состояний | PascalCase union | `type IteratorState = 'idle' \| 'running'` |
| Composable | `use{Name}` | `useLog()` |

---

## 6. Диаграмма зависимостей (целевая)

```
docs/.vitepress/
├── composables/
│   └── useLog.ts              ← shared логика логов
├── styles/
│   └── shared-demo-styles.css ← shared CSS
├── components/
│   ├── PromiseDemo.vue        ─┐
│   ├── AsyncAwaitDemo.vue     ─┤── используют useLog + shared CSS
│   ├── GeneratorsDemo.vue     ─┤
│   ├── LifecycleDemo.vue      ─┤
│   ├── IteratorsDemo.vue      ─┤  (новый)
│   └── SymbolsDemo.vue        ─┘  (новый)
│   └── __tests__/
│       ├── LifecycleDemo.spec.ts
│       ├── PromiseDemo.spec.ts     (новый)
│       ├── AsyncAwaitDemo.spec.ts  (новый)
│       ├── IteratorsDemo.spec.ts   (новый)
│       └── SymbolsDemo.spec.ts     (новый)
└── theme/
    └── index.ts               ← импорт shared CSS (без глобальных компонентов)
```

---

## 7. Порядок рефакторинга

Рекомендуемый порядок выполнения для минимизации конфликтов:

1. **useLog composable** (bob #cdbff8c3) — создать composable, применить к существующим компонентам
2. **Shared CSS** (carol #5ba766f8) — вынести общие стили, обновить компоненты
3. **Новые компоненты** (carol #3f9c90b6, #66e6265a) — создать с использованием useLog и shared CSS
4. **Новая документация** (bob #60abf034, #ae59a488) — интегрировать компоненты в markdown
5. **Тесты** (alice #16feb62c) — покрыть тестами существующие и новые компоненты
6. **Оптимизация** (zoy #2a58d127) — применить performance рекомендации

**Зависимости:**
- Компоненты carol зависят от useLog (bob) и shared CSS (carol — может делать параллельно)
- Документация bob зависит от компонентов carol
- Тесты alice могут начаться параллельно для существующих компонентов

---

**Последнее обновление:** 2026-03-08
