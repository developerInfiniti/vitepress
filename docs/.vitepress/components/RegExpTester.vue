<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useLog } from '../composables/useLog'
import './shared-demo-styles.css'

interface MatchResult {
  match: string
  index: number
  groups: string[]
}

const pattern = ref('\\b\\w+@\\w+\\.\\w+\\b')
const testString = ref('Напишите на user@example.com или admin@site.org для связи.')
const flags = ref({ g: true, i: false, m: false, s: false, u: false })
const activeTab = ref<'tester' | 'gallery'>('tester')

const { logEntries, addLog, clearLogs } = useLog(30)

const flagString = computed(() => {
  return Object.entries(flags.value)
    .filter(([, v]) => v)
    .map(([k]) => k)
    .join('')
})

const regexError = ref<string | null>(null)

const matches = computed<MatchResult[]>(() => {
  regexError.value = null
  if (!pattern.value) return []

  try {
    const regex = new RegExp(pattern.value, flagString.value)
    const results: MatchResult[] = []

    if (flags.value.g) {
      let match: RegExpExecArray | null
      let safety = 0
      while ((match = regex.exec(testString.value)) !== null && safety < 1000) {
        results.push({
          match: match[0],
          index: match.index,
          groups: match.slice(1),
        })
        if (match[0].length === 0) regex.lastIndex++
        safety++
      }
    } else {
      const match = regex.exec(testString.value)
      if (match) {
        results.push({
          match: match[0],
          index: match.index,
          groups: match.slice(1),
        })
      }
    }

    return results
  } catch (e) {
    regexError.value = e instanceof Error ? e.message : String(e)
    return []
  }
})

const highlightedText = computed(() => {
  if (!pattern.value || matches.value.length === 0 || regexError.value) {
    return escapeHtml(testString.value)
  }

  try {
    const regex = new RegExp(pattern.value, flagString.value.includes('g') ? flagString.value : flagString.value + 'g')
    return testString.value.replace(regex, (match) => {
      return `<mark class="match-highlight">${escapeHtml(match)}</mark>`
    })
  } catch {
    return escapeHtml(testString.value)
  }
})

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

const syntaxHints: Record<string, string> = {
  '.': 'Любой символ (кроме \\n)',
  '\\d': 'Цифра [0-9]',
  '\\w': 'Слово [a-zA-Z0-9_]',
  '\\s': 'Пробельный символ',
  '\\b': 'Граница слова',
  '^': 'Начало строки',
  '$': 'Конец строки',
  '*': '0 или более',
  '+': '1 или более',
  '?': '0 или 1',
  '{n,m}': 'от n до m раз',
  '(...)': 'Группа захвата',
  '[...]': 'Класс символов',
  '|': 'Альтернатива (ИЛИ)',
  '(?=...)': 'Позитивный lookahead',
  '(?!...)': 'Негативный lookahead',
}

const gallery = [
  { label: 'Email', pattern: '\\b[\\w.-]+@[\\w.-]+\\.\\w{2,}\\b', test: 'user@example.com, test@site.org, bad@', flags: 'gi' },
  { label: 'Телефон (UA/RU)', pattern: '\\+?[78]?[\\s-]?\\(?\\d{3}\\)?[\\s-]?\\d{3}[\\s-]?\\d{2}[\\s-]?\\d{2}', test: '+7 (999) 123-45-67, +380501234567, 89001234567', flags: 'g' },
  { label: 'URL', pattern: 'https?://[\\w.-]+(?:/[\\w./?%&=-]*)?', test: 'Сайт https://example.com/path?q=1 и http://test.org', flags: 'gi' },
  { label: 'IPv4', pattern: '\\b(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\b', test: 'Серверы: 192.168.1.1, 10.0.0.255, 999.999.999.999', flags: 'g' },
  { label: 'HEX цвет', pattern: '#(?:[0-9a-fA-F]{3}){1,2}\\b', test: 'Цвета: #fff, #3498db, #E74C3C, #zzzzzz', flags: 'g' },
  { label: 'Дата DD.MM.YYYY', pattern: '\\b(0[1-9]|[12]\\d|3[01])\\.(0[1-9]|1[0-2])\\.(\\d{4})\\b', test: 'Даты: 25.12.2025, 01.01.2000, 99.99.9999', flags: 'g' },
  { label: 'HTML тег', pattern: '<([a-z][a-z0-9]*)\\b[^>]*>(.*?)</\\1>', test: '<div class="test">content</div> <span>text</span>', flags: 'gi' },
  { label: 'Кириллица', pattern: '[а-яёА-ЯЁ]+', test: 'Hello Мир! Привет World! Тест123', flags: 'g' },
]

function applyGallery(item: typeof gallery[number]) {
  pattern.value = item.pattern
  testString.value = item.test
  flags.value = { g: false, i: false, m: false, s: false, u: false }
  for (const f of item.flags) {
    if (f in flags.value) (flags.value as Record<string, boolean>)[f] = true
  }
  activeTab.value = 'tester'
  addLog(`Шаблон: ${item.label}`, 'info')
}

watch([pattern, testString, flagString], () => {
  if (pattern.value && !regexError.value) {
    addLog(`/${pattern.value}/${flagString.value} — ${matches.value.length} совпадений`, matches.value.length > 0 ? 'success' : 'pending')
  }
}, { immediate: false })

const flagDescriptions: Record<string, string> = {
  g: 'global — все совпадения',
  i: 'ignoreCase — без учёта регистра',
  m: 'multiline — ^ и $ для каждой строки',
  s: 'dotAll — точка включает \\n',
  u: 'unicode — поддержка Unicode',
}
</script>

<template>
  <div class="demo-wrapper">
    <div class="demo-header">
      <h3>RegExp Tester — Тестер регулярных выражений</h3>
      <span
        class="demo-state-badge"
        :class="regexError ? 'demo-state-rejected' : matches.length > 0 ? 'demo-state-fulfilled' : 'demo-state-idle'"
      >
        {{ regexError ? 'Ошибка' : `${matches.length} совпадений` }}
      </span>
    </div>

    <p class="demo-description">
      Вводите регулярное выражение и тестовую строку — результаты обновляются в реальном времени с подсветкой совпадений.
    </p>

    <div class="demo-tabs">
      <button
        class="demo-tab-btn"
        :class="{ active: activeTab === 'tester' }"
        @click="activeTab = 'tester'"
      >
        Тестер
      </button>
      <button
        class="demo-tab-btn"
        :class="{ active: activeTab === 'gallery' }"
        @click="activeTab = 'gallery'"
      >
        Галерея паттернов
      </button>
    </div>

    <div v-if="activeTab === 'gallery'" class="gallery-grid">
      <button
        v-for="item in gallery"
        :key="item.label"
        class="gallery-card"
        @click="applyGallery(item)"
      >
        <span class="gallery-label">{{ item.label }}</span>
        <code class="gallery-pattern">{{ item.pattern.substring(0, 35) }}{{ item.pattern.length > 35 ? '...' : '' }}</code>
      </button>
    </div>

    <div v-if="activeTab === 'tester'" class="tester-layout">
      <div class="demo-control-group">
        <strong>Паттерн:</strong>
        <div class="pattern-row">
          <span class="pattern-delim">/</span>
          <input
            v-model="pattern"
            class="demo-text-input pattern-input"
            placeholder="Введите регулярное выражение..."
          />
          <span class="pattern-delim">/{{ flagString }}</span>
        </div>
        <div v-if="regexError" class="demo-result demo-result-error" style="margin-top: 6px;">
          {{ regexError }}
        </div>
      </div>

      <div class="demo-control-group">
        <strong>Флаги:</strong>
        <div class="flags-row">
          <label
            v-for="(val, key) in flags"
            :key="key"
            class="flag-label"
            :class="{ active: val }"
            :title="flagDescriptions[key]"
          >
            <input type="checkbox" v-model="flags[key]" />
            <span class="flag-letter">{{ key }}</span>
            <span class="flag-desc">{{ flagDescriptions[key] }}</span>
          </label>
        </div>
      </div>

      <div class="demo-control-group">
        <strong>Тестовая строка:</strong>
        <textarea
          v-model="testString"
          class="test-textarea"
          rows="3"
          placeholder="Введите текст для проверки..."
        ></textarea>
      </div>

      <div class="demo-control-group">
        <strong>Результат с подсветкой:</strong>
        <div class="highlight-box" v-html="highlightedText"></div>
      </div>

      <div v-if="matches.length > 0" class="demo-control-group">
        <strong>Таблица совпадений ({{ matches.length }}):</strong>
        <div class="matches-table-wrapper">
          <table class="matches-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Совпадение</th>
                <th>Позиция</th>
                <th>Группы</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(m, i) in matches" :key="i">
                <td>{{ i + 1 }}</td>
                <td><code>{{ m.match }}</code></td>
                <td>{{ m.index }}</td>
                <td>{{ m.groups.length > 0 ? m.groups.join(', ') : '—' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="demo-control-group">
        <strong>Справочник синтаксиса:</strong>
        <div class="syntax-grid">
          <div v-for="(desc, token) in syntaxHints" :key="token" class="syntax-item">
            <code class="syntax-token">{{ token }}</code>
            <span class="syntax-desc">{{ desc }}</span>
          </div>
        </div>
      </div>

      <div class="demo-logs">
        <div class="demo-logs-header">
          <strong>Логи:</strong>
          <button class="demo-btn demo-btn-small" @click="clearLogs">Очистить</button>
        </div>
        <div class="demo-logs-container" style="max-height: 150px;">
          <div
            v-for="(entry, index) in logEntries"
            :key="index"
            class="demo-log-entry"
            :class="`demo-log-${entry.type}`"
          >
            [{{ entry.time }}] {{ entry.message }}
          </div>
          <div v-if="logEntries.length === 0" class="demo-log-empty">
            Логи пусты.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tester-layout {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.pattern-row {
  display: flex;
  align-items: center;
  gap: 4px;
  background: var(--vp-c-bg, white);
  border: 1px solid var(--vp-c-divider, #e2e2e3);
  border-radius: 6px;
  padding: 4px 8px;
}

.pattern-delim {
  color: #e74c3c;
  font-family: 'Courier New', monospace;
  font-weight: 700;
  font-size: 1.1em;
}

.pattern-input {
  border: none !important;
  flex: 1;
  font-family: 'Courier New', monospace;
  font-size: 0.95em;
}

.flags-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.flag-label {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85em;
  background: var(--vp-c-bg, white);
  border: 1px solid var(--vp-c-divider, #e2e2e3);
  transition: border-color 0.2s;
}

.flag-label.active {
  border-color: var(--vp-c-brand-1, #3eaf7c);
  background: rgba(62, 175, 124, 0.05);
}

.flag-label input {
  margin: 0;
}

.flag-letter {
  font-family: 'Courier New', monospace;
  font-weight: 700;
  color: #e74c3c;
}

.flag-desc {
  color: var(--vp-c-text-2, #666);
}

.test-textarea {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid var(--vp-c-divider, #e2e2e3);
  border-radius: 6px;
  font-size: 0.9em;
  resize: vertical;
  background: var(--vp-c-bg, white);
  color: var(--vp-c-text-1, #333);
  line-height: 1.6;
}

.highlight-box {
  padding: 12px;
  background: var(--vp-c-bg, white);
  border: 1px solid var(--vp-c-divider, #e2e2e3);
  border-radius: 8px;
  font-size: 0.95em;
  line-height: 1.8;
  word-break: break-word;
  white-space: pre-wrap;
}

:deep(.match-highlight) {
  background: rgba(52, 152, 219, 0.25);
  border: 1px solid #3498db;
  border-radius: 3px;
  padding: 1px 2px;
  color: #2c3e50;
}

.matches-table-wrapper {
  overflow-x: auto;
}

.matches-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85em;
}

.matches-table th,
.matches-table td {
  padding: 6px 10px;
  border: 1px solid var(--vp-c-divider, #e2e2e3);
  text-align: left;
}

.matches-table th {
  background: var(--vp-c-bg-soft, #f9f9f9);
  font-weight: 600;
}

.matches-table code {
  color: #e74c3c;
  font-size: 0.95em;
}

.syntax-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 6px;
}

.syntax-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  background: var(--vp-c-bg, white);
  border-radius: 4px;
  font-size: 0.85em;
}

.syntax-token {
  font-family: 'Courier New', monospace;
  color: #e74c3c;
  font-weight: 600;
  min-width: 50px;
}

.syntax-desc {
  color: var(--vp-c-text-2, #666);
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 8px;
  margin-bottom: 16px;
}

.gallery-card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 14px;
  border: 1px solid var(--vp-c-divider, #e2e2e3);
  border-radius: 8px;
  background: var(--vp-c-bg, white);
  cursor: pointer;
  transition: border-color 0.2s, transform 0.15s;
  text-align: left;
}

.gallery-card:hover {
  border-color: var(--vp-c-brand-1, #3eaf7c);
  transform: translateY(-1px);
}

.gallery-label {
  font-weight: 600;
  font-size: 0.9em;
}

.gallery-pattern {
  font-size: 0.8em;
  color: #e74c3c;
  word-break: break-all;
}

@media (max-width: 640px) {
  .flags-row {
    flex-direction: column;
  }

  .flag-desc {
    display: none;
  }

  .syntax-grid {
    grid-template-columns: 1fr;
  }

  .gallery-grid {
    grid-template-columns: 1fr;
  }
}
</style>
