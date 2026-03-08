<script setup lang="ts">
import { ref, reactive } from 'vue'

type PromiseState = 'idle' | 'pending' | 'fulfilled' | 'rejected'

type LogType = 'info' | 'success' | 'error' | 'pending'

interface LogEntry {
  time: string
  message: string
  type: LogType
}

const state = ref<PromiseState>('idle')
const result = ref<string | null>(null)
const logEntries = ref<LogEntry[]>([])

let currentResolve: ((value: string) => void) | null = null
let currentReject: ((reason: string) => void) | null = null

function addLog(message: string, type: LogType = 'info') {
  const time = new Date().toLocaleTimeString()
  logEntries.value.push({ time, message, type })
  if (logEntries.value.length > 30) {
    logEntries.value = logEntries.value.slice(-30)
  }
}

function startPromise() {
  state.value = 'pending'
  result.value = null
  addLog('new Promise((resolve, reject) => { ... })', 'info')
  addLog('Состояние: pending - ожидание результата...', 'pending')

  const promise = new Promise<string>((resolve, reject) => {
    currentResolve = resolve
    currentReject = reject
  })

  promise
    .then((value) => {
      state.value = 'fulfilled'
      result.value = value
      addLog(`.then() вызван с результатом: "${value}"`, 'success')
      addLog('Состояние: fulfilled', 'success')
    })
    .catch((error) => {
      state.value = 'rejected'
      result.value = error
      addLog(`.catch() вызван с ошибкой: "${error}"`, 'error')
      addLog('Состояние: rejected', 'error')
    })
    .finally(() => {
      addLog('.finally() - операция завершена', 'info')
      currentResolve = null
      currentReject = null
    })
}

function resolvePromise() {
  if (currentResolve) {
    addLog('resolve("Данные загружены успешно!") вызван', 'success')
    currentResolve('Данные загружены успешно!')
  }
}

function rejectPromise() {
  if (currentReject) {
    addLog('reject("Ошибка сети!") вызван', 'error')
    currentReject('Ошибка сети!')
  }
}

function autoResolve() {
  if (state.value === 'pending' || state.value !== 'idle') return
  startPromise()
  addLog('Автоматический resolve через 2 секунды...', 'pending')
  setTimeout(() => {
    if (currentResolve) {
      addLog('setTimeout завершён - вызываем resolve()', 'success')
      currentResolve('Данные получены через 2 сек.')
    }
  }, 2000)
}

function autoReject() {
  if (state.value === 'pending' || state.value !== 'idle') return
  startPromise()
  addLog('Автоматический reject через 2 секунды...', 'pending')
  setTimeout(() => {
    if (currentReject) {
      addLog('setTimeout завершён - вызываем reject()', 'error')
      currentReject('Таймаут запроса!')
    }
  }, 2000)
}

function resetDemo() {
  state.value = 'idle'
  result.value = null
  currentResolve = null
  currentReject = null
  addLog('--- Демо сброшено ---', 'info')
}

function clearLogs() {
  logEntries.value = []
}

const stateLabels: Record<PromiseState, string> = {
  idle: 'Не создан',
  pending: 'Pending',
  fulfilled: 'Fulfilled',
  rejected: 'Rejected',
}
</script>

<template>
  <div class="promise-demo">
    <div class="demo-header">
      <h3>Promise - Интерактивная демонстрация</h3>
      <span class="state-badge" :class="`state-${state}`">
        {{ stateLabels[state] }}
      </span>
    </div>

    <p class="demo-description">
      Создайте Promise и управляйте его состоянием вручную или автоматически. Наблюдайте за переходами состояний и вызовами обработчиков.
    </p>

    <div class="demo-body">
      <div class="controls-section">
        <div class="control-group">
          <strong>Ручное управление:</strong>
          <div class="btn-row">
            <button
              class="btn btn-create"
              :disabled="state === 'pending'"
              @click="startPromise"
              data-testid="create-promise"
            >
              Создать Promise
            </button>
            <button
              class="btn btn-resolve"
              :disabled="state !== 'pending'"
              @click="resolvePromise"
              data-testid="resolve"
            >
              Resolve
            </button>
            <button
              class="btn btn-reject"
              :disabled="state !== 'pending'"
              @click="rejectPromise"
              data-testid="reject"
            >
              Reject
            </button>
          </div>
        </div>

        <div class="control-group">
          <strong>Автоматический сценарий (с таймером):</strong>
          <div class="btn-row">
            <button
              class="btn btn-auto-resolve"
              :disabled="state !== 'idle'"
              @click="autoResolve"
              data-testid="auto-resolve"
            >
              Auto Resolve (2 сек)
            </button>
            <button
              class="btn btn-auto-reject"
              :disabled="state !== 'idle'"
              @click="autoReject"
              data-testid="auto-reject"
            >
              Auto Reject (2 сек)
            </button>
          </div>
        </div>

        <div class="control-group">
          <div class="btn-row">
            <button
              class="btn btn-reset"
              @click="resetDemo"
              data-testid="reset"
            >
              Сброс
            </button>
          </div>
        </div>

        <div v-if="result !== null" class="result-display" :class="state === 'fulfilled' ? 'result-success' : 'result-error'">
          <strong>Результат:</strong> {{ result }}
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
            Логи пусты. Создайте Promise для начала.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.promise-demo {
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

.state-pending {
  background: #f39c12;
  animation: pulse 1.5s ease-in-out infinite;
}

.state-fulfilled {
  background: #27ae60;
}

.state-rejected {
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

.btn-create {
  background: #3498db;
  color: white;
}

.btn-resolve {
  background: #27ae60;
  color: white;
}

.btn-reject {
  background: #e74c3c;
  color: white;
}

.btn-auto-resolve {
  background: #2ecc71;
  color: white;
}

.btn-auto-reject {
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
