<script setup lang="ts">
import { ref, onUnmounted } from 'vue'

type TabId = 'sequence' | 'fibonacci' | 'async'
type LogType = 'info' | 'value' | 'done' | 'error'

interface LogEntry {
  time: string
  message: string
  type: LogType
}

const activeTab = ref<TabId>('sequence')
const logEntries = ref<LogEntry[]>([])

function addLog(message: string, type: LogType = 'info') {
  const time = new Date().toLocaleTimeString()
  logEntries.value.push({ time, message, type })
  if (logEntries.value.length > 40) {
    logEntries.value = logEntries.value.slice(-40)
  }
}

function clearLogs() {
  logEntries.value = []
}

// --- Простой генератор последовательности ---

function* sequenceGenerator(start: number, end: number) {
  for (let i = start; i <= end; i++) {
    yield i
  }
}

let seqGen: Generator<number> | null = null
const seqStart = ref(1)
const seqEnd = ref(10)
const seqDone = ref(false)
const seqValues = ref<number[]>([])

function createSequence() {
  seqGen = sequenceGenerator(seqStart.value, seqEnd.value)
  seqDone.value = false
  seqValues.value = []
  addLog(`Генератор создан: sequence(${seqStart.value}, ${seqEnd.value})`, 'info')
}

function nextSequence() {
  if (!seqGen) return
  const result = seqGen.next()
  if (result.done) {
    seqDone.value = true
    addLog('{ value: undefined, done: true } — генератор завершён', 'done')
  } else {
    seqValues.value.push(result.value)
    addLog(`{ value: ${result.value}, done: false }`, 'value')
  }
}

function getAllSequence() {
  if (!seqGen) return
  let result = seqGen.next()
  while (!result.done) {
    seqValues.value.push(result.value)
    addLog(`{ value: ${result.value}, done: false }`, 'value')
    result = seqGen.next()
  }
  seqDone.value = true
  addLog('{ value: undefined, done: true } — генератор завершён', 'done')
}

function resetSequence() {
  seqGen = null
  seqDone.value = false
  seqValues.value = []
  addLog('--- Генератор сброшен ---', 'info')
}

// --- Генератор Фибоначчи ---

function* fibonacciGenerator() {
  let a = 0
  let b = 1
  while (true) {
    yield a
    ;[a, b] = [b, a + b]
  }
}

let fibGen: Generator<number> | null = null
const fibValues = ref<number[]>([])
const fibCount = ref(0)

function createFibonacci() {
  fibGen = fibonacciGenerator()
  fibValues.value = []
  fibCount.value = 0
  addLog('Генератор Фибоначчи создан (бесконечный)', 'info')
}

function nextFibonacci() {
  if (!fibGen) return
  const result = fibGen.next()
  fibValues.value.push(result.value)
  fibCount.value++
  addLog(`fib(${fibCount.value}): { value: ${result.value}, done: false }`, 'value')
}

function nextNFibonacci(n: number) {
  if (!fibGen) return
  for (let i = 0; i < n; i++) {
    const result = fibGen.next()
    fibValues.value.push(result.value)
    fibCount.value++
    addLog(`fib(${fibCount.value}): { value: ${result.value}, done: false }`, 'value')
  }
}

function resetFibonacci() {
  fibGen = null
  fibValues.value = []
  fibCount.value = 0
  addLog('--- Генератор Фибоначчи сброшен ---', 'info')
}

// --- Асинхронный генератор ---

let asyncRunning = ref(false)
let asyncCancelled = false
const asyncValues = ref<number[]>([])
const asyncDelay = ref(800)

async function* asyncSequenceGenerator(start: number, end: number, delay: number) {
  for (let i = start; i <= end; i++) {
    await new Promise(resolve => setTimeout(resolve, delay))
    yield i
  }
}

async function runAsyncGenerator() {
  asyncCancelled = false
  asyncRunning.value = true
  asyncValues.value = []
  addLog(`async function* sequence(1, 5) — задержка ${asyncDelay.value}мс`, 'info')

  const gen = asyncSequenceGenerator(1, 5, asyncDelay.value)

  for await (const value of gen) {
    if (asyncCancelled) {
      addLog('Асинхронный генератор остановлен', 'error')
      break
    }
    asyncValues.value.push(value)
    addLog(`await yield ${value} — получено значение`, 'value')
  }

  if (!asyncCancelled) {
    addLog('Асинхронный генератор завершён', 'done')
  }
  asyncRunning.value = false
}

function stopAsyncGenerator() {
  asyncCancelled = true
}

function resetAsync() {
  asyncCancelled = true
  asyncRunning.value = false
  asyncValues.value = []
  addLog('--- Асинхронный генератор сброшен ---', 'info')
}

onUnmounted(() => {
  asyncCancelled = true
})

const tabs: { id: TabId; label: string }[] = [
  { id: 'sequence', label: 'Последовательность' },
  { id: 'fibonacci', label: 'Фибоначчи' },
  { id: 'async', label: 'Async генератор' },
]
</script>

<template>
  <div class="generators-demo">
    <div class="demo-header">
      <h3>Generators - Интерактивная демонстрация</h3>
    </div>

    <p class="demo-description">
      Изучайте работу генераторов пошагово: вызывайте next(), наблюдайте за yield и состоянием done.
    </p>

    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="tab-btn"
        :class="{ active: activeTab === tab.id }"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="demo-body">
      <div class="controls-section">
        <!-- Простой генератор -->
        <div v-if="activeTab === 'sequence'" class="tab-content">
          <div class="control-group">
            <div class="input-row">
              <label>
                От: <input v-model.number="seqStart" type="number" min="0" max="100" class="num-input" />
              </label>
              <label>
                До: <input v-model.number="seqEnd" type="number" min="0" max="100" class="num-input" />
              </label>
            </div>
            <div class="btn-row">
              <button class="btn btn-create" @click="createSequence" data-testid="create-seq">
                Создать
              </button>
              <button class="btn btn-next" :disabled="!seqGen || seqDone" @click="nextSequence" data-testid="next-seq">
                next()
              </button>
              <button class="btn btn-all" :disabled="!seqGen || seqDone" @click="getAllSequence" data-testid="all-seq">
                Получить все
              </button>
              <button class="btn btn-reset" @click="resetSequence" data-testid="reset-seq">
                Сброс
              </button>
            </div>
          </div>
          <div v-if="seqValues.length" class="values-display">
            <strong>Значения:</strong> [{{ seqValues.join(', ') }}]
            <span v-if="seqDone" class="done-badge">done</span>
          </div>
        </div>

        <!-- Фибоначчи -->
        <div v-if="activeTab === 'fibonacci'" class="tab-content">
          <div class="control-group">
            <div class="btn-row">
              <button class="btn btn-create" @click="createFibonacci" data-testid="create-fib">
                Создать
              </button>
              <button class="btn btn-next" :disabled="!fibGen" @click="nextFibonacci" data-testid="next-fib">
                next()
              </button>
              <button class="btn btn-all" :disabled="!fibGen" @click="nextNFibonacci(5)" data-testid="next5-fib">
                next() x5
              </button>
              <button class="btn btn-all" :disabled="!fibGen" @click="nextNFibonacci(10)" data-testid="next10-fib">
                next() x10
              </button>
              <button class="btn btn-reset" @click="resetFibonacci" data-testid="reset-fib">
                Сброс
              </button>
            </div>
          </div>
          <div v-if="fibValues.length" class="values-display">
            <strong>Фибоначчи ({{ fibCount }}):</strong> [{{ fibValues.join(', ') }}]
          </div>
        </div>

        <!-- Асинхронный генератор -->
        <div v-if="activeTab === 'async'" class="tab-content">
          <div class="control-group">
            <div class="input-row">
              <label>
                Задержка (мс): <input v-model.number="asyncDelay" type="range" min="200" max="2000" step="100" />
                <span>{{ asyncDelay }}мс</span>
              </label>
            </div>
            <div class="btn-row">
              <button class="btn btn-create" :disabled="asyncRunning" @click="runAsyncGenerator" data-testid="run-async">
                Запустить
              </button>
              <button class="btn btn-stop" :disabled="!asyncRunning" @click="stopAsyncGenerator" data-testid="stop-async">
                Остановить
              </button>
              <button class="btn btn-reset" @click="resetAsync" data-testid="reset-async">
                Сброс
              </button>
            </div>
          </div>
          <div v-if="asyncValues.length" class="values-display">
            <strong>Значения:</strong> [{{ asyncValues.join(', ') }}]
            <span v-if="!asyncRunning && asyncValues.length" class="done-badge">done</span>
            <span v-if="asyncRunning" class="pending-badge">загрузка...</span>
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
            Логи пусты. Создайте генератор для начала.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.generators-demo {
  border: 2px solid var(--vp-c-brand-1, #3eaf7c);
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
  background: var(--vp-c-bg-soft, #f9f9f9);
}

.demo-header {
  margin-bottom: 16px;
}

.demo-header h3 {
  margin: 0;
}

.demo-description {
  margin: 0 0 16px 0;
  color: var(--vp-c-text-2, #666);
  font-size: 0.9em;
  line-height: 1.5;
}

.tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 16px;
  border-bottom: 2px solid var(--vp-c-divider, #e2e2e3);
  padding-bottom: 0;
}

.tab-btn {
  padding: 8px 16px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 0.9em;
  color: var(--vp-c-text-2, #666);
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  transition: color 0.2s, border-color 0.2s;
}

.tab-btn:hover {
  color: var(--vp-c-brand-1, #3eaf7c);
}

.tab-btn.active {
  color: var(--vp-c-brand-1, #3eaf7c);
  border-bottom-color: var(--vp-c-brand-1, #3eaf7c);
  font-weight: 600;
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

.tab-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-row {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.input-row label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9em;
}

.num-input {
  width: 60px;
  padding: 4px 8px;
  border: 1px solid var(--vp-c-divider, #e2e2e3);
  border-radius: 4px;
  font-size: 0.9em;
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

.btn-next {
  background: #27ae60;
  color: white;
}

.btn-all {
  background: #8e44ad;
  color: white;
}

.btn-stop {
  background: #e74c3c;
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

.values-display {
  padding: 12px;
  background: var(--vp-c-bg, white);
  border-radius: 8px;
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
  word-break: break-all;
}

.done-badge {
  display: inline-block;
  background: #27ae60;
  color: white;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.75em;
  margin-left: 8px;
  font-family: sans-serif;
}

.pending-badge {
  display: inline-block;
  background: #f39c12;
  color: white;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.75em;
  margin-left: 8px;
  font-family: sans-serif;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
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

.log-value {
  color: #4ec9b0;
}

.log-done {
  color: #dcdcaa;
}

.log-error {
  color: #f48771;
}

.log-empty {
  color: #666;
  font-style: italic;
}
</style>
