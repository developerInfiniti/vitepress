<script setup lang="ts">
import { ref } from 'vue'
import { useLog } from '../composables/useLog'
import './shared-demo-styles.css'

type OperationState = 'idle' | 'loading' | 'success' | 'error'
type Scenario = 'success' | 'error' | 'timeout'

const state = ref<OperationState>('idle')
const result = ref<string | null>(null)
const selectedScenario = ref<Scenario>('success')
const { logEntries, addLog, clearLogs } = useLog()
let abortController: AbortController | null = null

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
  <div class="demo-wrapper">
    <div class="demo-header">
      <h3>Async/Await - Интерактивная демонстрация</h3>
      <span class="demo-state-badge" :class="`demo-state-${state === 'loading' ? 'pending' : state === 'success' ? 'fulfilled' : state === 'error' ? 'rejected' : 'idle'}`">
        {{ stateLabels[state] }}
      </span>
    </div>

    <p class="demo-description">
      Выберите сценарий и запустите асинхронную операцию. Наблюдайте за выполнением async/await, обработкой ошибок через try/catch/finally и отменой операций.
    </p>

    <div class="demo-body">
      <div class="demo-controls">
        <div class="demo-control-group">
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

        <div class="demo-control-group">
          <strong>Управление:</strong>
          <div class="demo-btn-row">
            <button
              class="demo-btn demo-btn-create"
              :disabled="state === 'loading'"
              @click="runOperation"
              data-testid="run-operation"
            >
              Выполнить операцию
            </button>
            <button
              class="demo-btn demo-btn-forin"
              :disabled="state !== 'loading'"
              @click="cancelOperation"
              data-testid="cancel-operation"
            >
              Отмена
            </button>
            <button
              class="demo-btn demo-btn-reset"
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
          class="demo-result"
          :class="state === 'success' ? 'demo-result-success' : 'demo-result-error'"
          data-testid="result"
        >
          <strong>{{ state === 'success' ? 'Результат:' : 'Ошибка:' }}</strong> {{ result }}
        </div>
      </div>

      <div class="demo-logs">
        <div class="demo-logs-header">
          <strong>Логи выполнения:</strong>
          <button class="demo-btn demo-btn-small" @click="clearLogs" data-testid="clear-logs">
            Очистить
          </button>
        </div>
        <div class="demo-logs-container" data-testid="logs">
          <div
            v-for="(entry, index) in logEntries"
            :key="index"
            class="demo-log-entry"
            :class="`demo-log-${entry.type}`"
          >
            [{{ entry.time }}] {{ entry.message }}
          </div>
          <div v-if="logEntries.length === 0" class="demo-log-empty">
            Логи пусты. Выберите сценарий и нажмите «Выполнить операцию».
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
</style>
