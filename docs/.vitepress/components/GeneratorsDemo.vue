<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { useLog } from '../composables/useLog'
import './shared-demo-styles.css'

type TabId = 'sequence' | 'fibonacci' | 'async'

const activeTab = ref<TabId>('sequence')
const { logEntries, addLog, clearLogs } = useLog(40)

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
  <div class="demo-wrapper">
    <div class="demo-header">
      <h3>Generators - Интерактивная демонстрация</h3>
    </div>

    <p class="demo-description">
      Изучайте работу генераторов пошагово: вызывайте next(), наблюдайте за yield и состоянием done.
    </p>

    <div class="demo-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="demo-tab-btn"
        :class="{ active: activeTab === tab.id }"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="demo-body">
      <div class="demo-controls">
        <!-- Простой генератор -->
        <div v-if="activeTab === 'sequence'" class="demo-tab-content">
          <div class="demo-control-group">
            <div class="demo-input-row">
              <label>
                От: <input v-model.number="seqStart" type="number" min="0" max="100" class="demo-num-input" />
              </label>
              <label>
                До: <input v-model.number="seqEnd" type="number" min="0" max="100" class="demo-num-input" />
              </label>
            </div>
            <div class="demo-btn-row">
              <button class="demo-btn demo-btn-create" @click="createSequence" data-testid="create-seq">
                Создать
              </button>
              <button class="demo-btn demo-btn-next" :disabled="!seqGen || seqDone" @click="nextSequence" data-testid="next-seq">
                next()
              </button>
              <button class="demo-btn demo-btn-all" :disabled="!seqGen || seqDone" @click="getAllSequence" data-testid="all-seq">
                Получить все
              </button>
              <button class="demo-btn demo-btn-reset" @click="resetSequence" data-testid="reset-seq">
                Сброс
              </button>
            </div>
          </div>
          <div v-if="seqValues.length" class="demo-values">
            <strong>Значения:</strong> [{{ seqValues.join(', ') }}]
            <span v-if="seqDone" class="demo-badge-done">done</span>
          </div>
        </div>

        <!-- Фибоначчи -->
        <div v-if="activeTab === 'fibonacci'" class="demo-tab-content">
          <div class="demo-control-group">
            <div class="demo-btn-row">
              <button class="demo-btn demo-btn-create" @click="createFibonacci" data-testid="create-fib">
                Создать
              </button>
              <button class="demo-btn demo-btn-next" :disabled="!fibGen" @click="nextFibonacci" data-testid="next-fib">
                next()
              </button>
              <button class="demo-btn demo-btn-all" :disabled="!fibGen" @click="nextNFibonacci(5)" data-testid="next5-fib">
                next() x5
              </button>
              <button class="demo-btn demo-btn-all" :disabled="!fibGen" @click="nextNFibonacci(10)" data-testid="next10-fib">
                next() x10
              </button>
              <button class="demo-btn demo-btn-reset" @click="resetFibonacci" data-testid="reset-fib">
                Сброс
              </button>
            </div>
          </div>
          <div v-if="fibValues.length" class="demo-values">
            <strong>Фибоначчи ({{ fibCount }}):</strong> [{{ fibValues.join(', ') }}]
          </div>
        </div>

        <!-- Асинхронный генератор -->
        <div v-if="activeTab === 'async'" class="demo-tab-content">
          <div class="demo-control-group">
            <div class="demo-input-row">
              <label>
                Задержка (мс): <input v-model.number="asyncDelay" type="range" min="200" max="2000" step="100" />
                <span>{{ asyncDelay }}мс</span>
              </label>
            </div>
            <div class="demo-btn-row">
              <button class="demo-btn demo-btn-create" :disabled="asyncRunning" @click="runAsyncGenerator" data-testid="run-async">
                Запустить
              </button>
              <button class="demo-btn demo-btn-stop" :disabled="!asyncRunning" @click="stopAsyncGenerator" data-testid="stop-async">
                Остановить
              </button>
              <button class="demo-btn demo-btn-reset" @click="resetAsync" data-testid="reset-async">
                Сброс
              </button>
            </div>
          </div>
          <div v-if="asyncValues.length" class="demo-values">
            <strong>Значения:</strong> [{{ asyncValues.join(', ') }}]
            <span v-if="!asyncRunning && asyncValues.length" class="demo-badge-done">done</span>
            <span v-if="asyncRunning" class="demo-badge-pending">загрузка...</span>
          </div>
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
            Логи пусты. Создайте генератор для начала.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
