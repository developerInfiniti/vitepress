<script setup lang="ts">
import { ref } from 'vue'

type OperationState = 'idle' | 'loading' | 'success' | 'error'
type Scenario = 'success' | 'error' | 'timeout'
type LogType = 'info' | 'success' | 'error' | 'pending'

interface LogEntry {
  time: string
  message: string
  type: LogType
}

const state = ref<OperationState>('idle')
const result = ref<string | null>(null)
const selectedScenario = ref<Scenario>('success')
const logEntries = ref<LogEntry[]>([])
let abortController: AbortController | null = null

function addLog(message: string, type: LogType = 'info') {
  const time = new Date().toLocaleTimeString()
  logEntries.value.push({ time, message, type })
  if (logEntries.value.length > 30) {
    logEntries.value = logEntries.value.slice(-30)
  }
}

function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms)
    if (signal) {
      signal.addEventListener('abort', () => {
        clearTimeout(timer)
        reject(new Error('Операция отменена пользователем'))
      })
    }
  })
}

async function fetchData(signal?: AbortSignal): Promise<string> {
  addLog('async function fetchData() {', 'info')
  addLog('  await delay(2000) // имитация сетевого запроса...', 'pending')
  await delay(2000, signal)

  if (selectedScenario.value === 'error') {
    throw new Error('Ошибка сети: сервер вернул 500')
  }

  return 'Данные пользователя: { id: 1, name: "Иван" }'
}

async function fetchWithTimeout(ms: number, signal?: AbortSignal): Promise<string> {
  addLog('async function fetchWithTimeout() {', 'info')
  addLog(`  // Таймаут: ${ms}ms, запрос: 2000ms`, 'info')

  const timeoutPromise = new Promise<never>((_, reject) => {
    const timer = setTimeout(() => reject(new Error(`Таймаут: операция не завершилась за ${ms}ms`)), ms)
    if (signal) {
      signal.addEventListener('abort', () => {
        clearTimeout(timer)
        reject(new Error('Операция отменена пользователем'))
      })
    }
  })

  const fetchPromise = (async () => {
    addLog('  await delay(2000) // имитация долгого запроса...', 'pending')
    await delay(2000, signal)
    return 'Данные загружены'
  })()

  return Promise.race([fetchPromise, timeoutPromise])
}

async function runOperation() {
  if (state.value === 'loading') return

  state.value = 'loading'
  result.value = null
  abortController = new AbortController()
  const signal = abortController.signal

  addLog('--- Начало операции ---', 'info')
  addLog('try {', 'info')

  try {
    let data: string

    if (selectedScenario.value === 'timeout') {
      data = await fetchWithTimeout(1000, signal)
    } else {
      data = await fetchData(signal)
    }

    addLog(`  // Результат получен`, 'success')
    addLog(`  const data = "${data}"`, 'success')
    state.value = 'success'
    result.value = data
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    addLog('} catch (error) {', 'error')
    addLog(`  // ${message}`, 'error')
    state.value = 'error'
    result.value = message
  } finally {
    addLog('} finally {', 'info')
    addLog('  // Очистка ресурсов выполнена', 'info')
    addLog('}', 'info')
    abortController = null
  }
}

function cancelOperation() {
  if (abortController) {
    addLog('// Пользователь отменил операцию', 'error')
    abortController.abort()
  }
}

function resetDemo() {
  if (abortController) {
    abortController.abort()
  }
  state.value = 'idle'
  result.value = null
  abortController = null
  addLog('--- Демо сброшено ---', 'info')
}

function clearLogs() {
  logEntries.value = []
}

const stateLabels: Record<OperationState, string> = {
  idle: 'Ожидание',
  loading: 'Loading...',
  success: 'Успех',
  error: 'Ошибка',
}

const scenarioLabels: Record<Scenario, string> = {
  success: 'Успешный запрос',
  error: 'Ошибка сервера',
  timeout: 'Таймаут запроса',
}
</script>

<template>
  <div class="async-demo">
    <div class="demo-header">
      <h3>Async/Await - Интерактивная демонстрация</h3>
      <span class="state-badge" :class="`state-${state}`">
        {{ stateLabels[state] }}
      </span>
    </div>

    <p class="demo-description">
      Выберите сценарий и запустите асинхронную операцию. Наблюдайте за выполнением async/await, обработкой ошибок через try/catch/finally и отменой операций.
    </p>

    <div class="demo-body">
      <div class="controls-section">
        <div class="control-group">
          <strong>Сценарий:</strong>
          <div class="scenario-select">
            <label
              v-for="scenario in (['success', 'error', 'timeout'] as Scenario[])"
              :key="scenario"
              class="scenario-option"
              :class="{ active: selectedScenario === scenario }"
            >
              <input
                type="radio"
                :value="scenario"
                v-model="selectedScenario"
                :disabled="state === 'loading'"
                :data-testid="`scenario-${scenario}`"
              />
              {{ scenarioLabels[scenario] }}
            </label>
          </div>
        </div>

        <div class="control-group">
          <strong>Управление:</strong>
          <div class="btn-row">
            <button
              class="btn btn-run"
              :disabled="state === 'loading'"
              @click="runOperation"
              data-testid="run-operation"
            >
              Выполнить операцию
            </button>
            <button
              class="btn btn-cancel"
              :disabled="state !== 'loading'"
              @click="cancelOperation"
              data-testid="cancel-operation"
            >
              Отмена
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

        <div v-if="state === 'loading'" class="loading-indicator">
          <div class="spinner"></div>
          <span>Выполнение async операции...</span>
        </div>

        <div
          v-if="result !== null"
          class="result-display"
          :class="state === 'success' ? 'result-success' : 'result-error'"
          data-testid="result"
        >
          <strong>{{ state === 'success' ? 'Результат:' : 'Ошибка:' }}</strong> {{ result }}
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
            Логи пусты. Выберите сценарий и нажмите «Выполнить операцию».
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.async-demo {
  border: 2px solid var(--vp-c-brand-1, #3eaf7c);
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
  background: var(--vp-c-bg-soft, #f9f9f9);
}

.demo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 8px;
}

.demo-header h3 {
  margin: 0;
}

.state-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85em;
  font-weight: 600;
  color: white;
}

.state-idle {
  background: #95a5a6;
}

.state-loading {
  background: #f39c12;
  animation: pulse 1.5s ease-in-out infinite;
}

.state-success {
  background: #27ae60;
}

.state-error {
  background: #e74c3c;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.demo-description {
  margin: 0 0 16px 0;
  color: var(--vp-c-text-2, #666);
  font-size: 0.9em;
  line-height: 1.5;
}

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

.controls-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.scenario-select {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.scenario-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9em;
  background: var(--vp-c-bg, white);
  border: 1px solid transparent;
  transition: border-color 0.2s;
}

.scenario-option.active {
  border-color: var(--vp-c-brand-1, #3eaf7c);
  background: rgba(62, 175, 124, 0.05);
}

.scenario-option input {
  margin: 0;
}

.btn-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9em;
  transition: opacity 0.2s, transform 0.15s ease;
}

.btn:hover:not(:disabled) {
  opacity: 0.85;
  transform: translateY(-1px);
}

.btn:active:not(:disabled) {
  transform: translateY(0);
}

.btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-run {
  background: #3498db;
  color: white;
}

.btn-cancel {
  background: #e67e22;
  color: white;
}

.btn-reset {
  background: #95a5a6;
  color: white;
}

.btn-small {
  padding: 4px 10px;
  font-size: 0.8em;
  background: #bdc3c7;
  color: #333;
}

.loading-indicator {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: rgba(243, 156, 18, 0.1);
  border: 1px solid #f39c12;
  border-radius: 8px;
  color: #f39c12;
  font-size: 0.9em;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(243, 156, 18, 0.3);
  border-top-color: #f39c12;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.result-display {
  padding: 12px;
  border-radius: 8px;
  font-size: 0.95em;
}

.result-success {
  background: rgba(39, 174, 96, 0.1);
  border: 1px solid #27ae60;
  color: #27ae60;
}

.result-error {
  background: rgba(231, 76, 60, 0.1);
  border: 1px solid #e74c3c;
  color: #e74c3c;
}

.logs-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.logs-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logs-container {
  background: #1e1e1e;
  color: #d4d4d4;
  border-radius: 8px;
  padding: 12px;
  max-height: 320px;
  overflow-y: auto;
  font-family: 'Courier New', monospace;
  font-size: 0.8em;
  line-height: 1.6;
}

.log-entry {
  padding: 2px 0;
  border-bottom: 1px solid #333;
}

.log-info {
  color: #9cdcfe;
}

.log-success {
  color: #4ec9b0;
}

.log-error {
  color: #f48771;
}

.log-pending {
  color: #dcdcaa;
}

.log-empty {
  color: #666;
  font-style: italic;
}
</style>
