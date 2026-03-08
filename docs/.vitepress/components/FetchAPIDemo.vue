<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLog } from '../composables/useLog'
import './shared-demo-styles.css'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'
type RequestState = 'idle' | 'loading' | 'success' | 'error'

interface HeaderEntry {
  key: string
  value: string
}

const BASE_URL = 'https://jsonplaceholder.typicode.com'

const state = ref<RequestState>('idle')
const method = ref<HttpMethod>('GET')
const urlPath = ref('/posts/1')
const requestBody = ref('{\n  "title": "Hello",\n  "body": "World",\n  "userId": 1\n}')
const headers = ref<HeaderEntry[]>([
  { key: 'Content-Type', value: 'application/json' }
])
const responseData = ref<string | null>(null)
const responseStatus = ref<number | null>(null)
const responseTime = ref<number | null>(null)
const activeTab = ref<'request' | 'presets'>('request')
const timeoutMs = ref(10000)

const { logEntries, addLog, clearLogs } = useLog(50)

let abortController: AbortController | null = null

const fullUrl = computed(() => BASE_URL + urlPath.value)

const showBody = computed(() => method.value === 'POST' || method.value === 'PUT')

const presets = [
  { label: 'GET /posts/1', method: 'GET' as HttpMethod, path: '/posts/1', body: '' },
  { label: 'GET /posts (список)', method: 'GET' as HttpMethod, path: '/posts?_limit=3', body: '' },
  { label: 'GET /users/1', method: 'GET' as HttpMethod, path: '/users/1', body: '' },
  { label: 'POST /posts', method: 'POST' as HttpMethod, path: '/posts', body: '{\n  "title": "Новый пост",\n  "body": "Содержание поста",\n  "userId": 1\n}' },
  { label: 'PUT /posts/1', method: 'PUT' as HttpMethod, path: '/posts/1', body: '{\n  "id": 1,\n  "title": "Обновлённый пост",\n  "body": "Новое содержание",\n  "userId": 1\n}' },
  { label: 'DELETE /posts/1', method: 'DELETE' as HttpMethod, path: '/posts/1', body: '' },
  { label: 'GET /404 (ошибка)', method: 'GET' as HttpMethod, path: '/posts/99999', body: '' },
]

function applyPreset(preset: typeof presets[number]) {
  method.value = preset.method
  urlPath.value = preset.path
  requestBody.value = preset.body
  addLog(`Preset: ${preset.label}`, 'info')
}

function addHeader() {
  headers.value.push({ key: '', value: '' })
}

function removeHeader(index: number) {
  headers.value.splice(index, 1)
}

async function sendRequest() {
  if (state.value === 'loading') return

  state.value = 'loading'
  responseData.value = null
  responseStatus.value = null
  responseTime.value = null
  abortController = new AbortController()

  addLog('--- Новый запрос ---', 'info')
  addLog(`fetch("${fullUrl.value}", {`, 'info')
  addLog(`  method: "${method.value}",`, 'info')

  const fetchHeaders: Record<string, string> = {}
  for (const h of headers.value) {
    if (h.key.trim()) {
      fetchHeaders[h.key.trim()] = h.value.trim()
      addLog(`  headers: { "${h.key}": "${h.value}" }`, 'info')
    }
  }

  const options: RequestInit = {
    method: method.value,
    headers: fetchHeaders,
    signal: abortController.signal,
  }

  if (showBody.value && requestBody.value.trim()) {
    options.body = requestBody.value
    addLog(`  body: ${requestBody.value.substring(0, 60)}...`, 'info')
  }

  addLog('})', 'info')

  const startTime = performance.now()

  try {
    const timeoutId = setTimeout(() => {
      if (abortController) abortController.abort()
    }, timeoutMs.value)

    addLog('// Отправка запроса...', 'pending')
    const response = await fetch(fullUrl.value, options)
    clearTimeout(timeoutId)

    const elapsed = Math.round(performance.now() - startTime)
    responseTime.value = elapsed
    responseStatus.value = response.status

    addLog(`// Статус: ${response.status} ${response.statusText}`, response.ok ? 'success' : 'error')
    addLog(`// Время: ${elapsed}ms`, 'info')

    const text = await response.text()
    let formatted: string
    try {
      const json = JSON.parse(text)
      formatted = JSON.stringify(json, null, 2)
    } catch {
      formatted = text
    }

    responseData.value = formatted
    state.value = response.ok ? 'success' : 'error'

    if (response.ok) {
      addLog('// Данные получены успешно', 'success')
    } else {
      addLog(`// HTTP ошибка: ${response.status}`, 'error')
    }
  } catch (err) {
    const elapsed = Math.round(performance.now() - startTime)
    responseTime.value = elapsed

    const message = err instanceof Error ? err.message : String(err)
    if (message.includes('abort')) {
      addLog('// Запрос отменён', 'error')
      responseData.value = 'Запрос отменён пользователем или по таймауту'
    } else {
      addLog(`// Ошибка: ${message}`, 'error')
      responseData.value = message
    }
    state.value = 'error'
  } finally {
    abortController = null
  }
}

function cancelRequest() {
  if (abortController) {
    addLog('// Отмена запроса...', 'error')
    abortController.abort()
  }
}

function resetDemo() {
  if (abortController) abortController.abort()
  state.value = 'idle'
  responseData.value = null
  responseStatus.value = null
  responseTime.value = null
  method.value = 'GET'
  urlPath.value = '/posts/1'
  requestBody.value = '{\n  "title": "Hello",\n  "body": "World",\n  "userId": 1\n}'
  headers.value = [{ key: 'Content-Type', value: 'application/json' }]
  clearLogs()
  addLog('// Демо сброшено', 'info')
}

const stateLabels: Record<RequestState, string> = {
  idle: 'Ожидание',
  loading: 'Загрузка...',
  success: 'Успех',
  error: 'Ошибка',
}

const methodColors: Record<HttpMethod, string> = {
  GET: '#27ae60',
  POST: '#3498db',
  PUT: '#f39c12',
  DELETE: '#e74c3c',
}
</script>

<template>
  <div class="demo-wrapper">
    <div class="demo-header">
      <h3>Fetch API — Интерактивная демонстрация</h3>
      <span
        class="demo-state-badge"
        :class="`demo-state-${state === 'loading' ? 'pending' : state === 'success' ? 'fulfilled' : state === 'error' ? 'rejected' : 'idle'}`"
      >
        {{ stateLabels[state] }}
      </span>
    </div>

    <p class="demo-description">
      Отправляйте HTTP-запросы к JSONPlaceholder API. Выберите метод, укажите URL, добавьте заголовки и тело запроса.
    </p>

    <div class="demo-tabs">
      <button
        class="demo-tab-btn"
        :class="{ active: activeTab === 'request' }"
        @click="activeTab = 'request'"
      >
        Запрос
      </button>
      <button
        class="demo-tab-btn"
        :class="{ active: activeTab === 'presets' }"
        @click="activeTab = 'presets'"
      >
        Готовые примеры
      </button>
    </div>

    <div v-if="activeTab === 'presets'" class="presets-grid">
      <button
        v-for="preset in presets"
        :key="preset.label"
        class="preset-card"
        @click="applyPreset(preset); activeTab = 'request'"
      >
        <span class="preset-method" :style="{ color: methodColors[preset.method] }">
          {{ preset.method }}
        </span>
        <span class="preset-path">{{ preset.path }}</span>
      </button>
    </div>

    <div v-if="activeTab === 'request'" class="demo-body">
      <div class="demo-controls">
        <div class="demo-control-group">
          <strong>Метод и URL:</strong>
          <div class="url-row">
            <select v-model="method" class="method-select" :style="{ borderColor: methodColors[method] }">
              <option v-for="m in (['GET', 'POST', 'PUT', 'DELETE'] as HttpMethod[])" :key="m" :value="m">
                {{ m }}
              </option>
            </select>
            <div class="url-input-wrapper">
              <span class="url-base">{{ BASE_URL }}</span>
              <input
                v-model="urlPath"
                class="demo-text-input url-path-input"
                placeholder="/posts/1"
              />
            </div>
          </div>
        </div>

        <div class="demo-control-group">
          <div class="headers-header">
            <strong>Заголовки:</strong>
            <button class="demo-btn demo-btn-small demo-btn-plus" @click="addHeader">+ Добавить</button>
          </div>
          <div v-for="(header, index) in headers" :key="index" class="header-row">
            <input
              v-model="header.key"
              class="demo-text-input header-key"
              placeholder="Ключ"
            />
            <input
              v-model="header.value"
              class="demo-text-input header-value"
              placeholder="Значение"
            />
            <button class="demo-btn demo-btn-small demo-btn-minus" @click="removeHeader(index)">x</button>
          </div>
        </div>

        <div v-if="showBody" class="demo-control-group">
          <strong>Тело запроса (JSON):</strong>
          <textarea
            v-model="requestBody"
            class="request-body-input"
            rows="5"
            placeholder='{ "key": "value" }'
          ></textarea>
        </div>

        <div class="demo-btn-row">
          <button
            class="demo-btn demo-btn-create"
            :disabled="state === 'loading'"
            @click="sendRequest"
          >
            Отправить
          </button>
          <button
            class="demo-btn demo-btn-stop"
            :disabled="state !== 'loading'"
            @click="cancelRequest"
          >
            Отмена
          </button>
          <button class="demo-btn demo-btn-reset" @click="resetDemo">
            Сброс
          </button>
        </div>

        <div v-if="responseStatus !== null" class="response-meta">
          <span class="meta-item">
            Статус: <strong :class="responseStatus < 400 ? 'text-success' : 'text-error'">{{ responseStatus }}</strong>
          </span>
          <span v-if="responseTime !== null" class="meta-item">
            Время: <strong>{{ responseTime }}ms</strong>
          </span>
        </div>

        <div v-if="responseData !== null" class="response-block">
          <strong>Ответ:</strong>
          <pre class="response-body">{{ responseData }}</pre>
        </div>
      </div>

      <div class="demo-logs">
        <div class="demo-logs-header">
          <strong>Логи:</strong>
          <button class="demo-btn demo-btn-small" @click="clearLogs">Очистить</button>
        </div>
        <div class="demo-logs-container">
          <div
            v-for="(entry, index) in logEntries"
            :key="index"
            class="demo-log-entry"
            :class="`demo-log-${entry.type}`"
          >
            [{{ entry.time }}] {{ entry.message }}
          </div>
          <div v-if="logEntries.length === 0" class="demo-log-empty">
            Логи пусты. Отправьте запрос для начала.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.url-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.method-select {
  padding: 6px 10px;
  border: 2px solid var(--vp-c-divider, #e2e2e3);
  border-radius: 6px;
  font-size: 0.9em;
  font-weight: 700;
  background: var(--vp-c-bg, white);
  cursor: pointer;
  min-width: 90px;
}

.url-input-wrapper {
  display: flex;
  align-items: center;
  flex: 1;
  border: 1px solid var(--vp-c-divider, #e2e2e3);
  border-radius: 4px;
  overflow: hidden;
  background: var(--vp-c-bg, white);
}

.url-base {
  padding: 6px 8px;
  background: var(--vp-c-bg-soft, #f9f9f9);
  color: var(--vp-c-text-2, #666);
  font-size: 0.8em;
  white-space: nowrap;
  border-right: 1px solid var(--vp-c-divider, #e2e2e3);
}

.url-path-input {
  border: none !important;
  border-radius: 0 !important;
  flex: 1;
}

.headers-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-row {
  display: flex;
  gap: 6px;
  align-items: center;
}

.header-key {
  width: 35% !important;
}

.header-value {
  flex: 1;
}

.request-body-input {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid var(--vp-c-divider, #e2e2e3);
  border-radius: 6px;
  font-family: 'Courier New', monospace;
  font-size: 0.85em;
  resize: vertical;
  background: var(--vp-c-bg, white);
  color: var(--vp-c-text-1, #333);
}

.response-meta {
  display: flex;
  gap: 16px;
  padding: 8px 12px;
  background: var(--vp-c-bg, white);
  border-radius: 6px;
  font-size: 0.9em;
}

.meta-item {
  color: var(--vp-c-text-2, #666);
}

.text-success { color: #27ae60; }
.text-error { color: #e74c3c; }

.response-block {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.response-body {
  background: #1e1e1e;
  color: #d4d4d4;
  border-radius: 8px;
  padding: 12px;
  max-height: 250px;
  overflow: auto;
  font-family: 'Courier New', monospace;
  font-size: 0.8em;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
  margin: 0;
}

.presets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 8px;
  margin-bottom: 16px;
}

.preset-card {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border: 1px solid var(--vp-c-divider, #e2e2e3);
  border-radius: 8px;
  background: var(--vp-c-bg, white);
  cursor: pointer;
  transition: border-color 0.2s, transform 0.15s;
  font-size: 0.9em;
}

.preset-card:hover {
  border-color: var(--vp-c-brand-1, #3eaf7c);
  transform: translateY(-1px);
}

.preset-method {
  font-weight: 700;
  font-size: 0.85em;
  min-width: 50px;
}

.preset-path {
  color: var(--vp-c-text-2, #666);
  font-family: 'Courier New', monospace;
  font-size: 0.85em;
}

@media (max-width: 640px) {
  .url-row {
    flex-direction: column;
  }

  .method-select {
    width: 100%;
  }

  .url-input-wrapper {
    width: 100%;
  }

  .header-row {
    flex-wrap: wrap;
  }

  .header-key {
    width: 100% !important;
  }

  .presets-grid {
    grid-template-columns: 1fr;
  }
}
</style>
