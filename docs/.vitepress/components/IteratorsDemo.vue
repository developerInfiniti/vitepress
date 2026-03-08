<script setup lang="ts">
import { ref } from 'vue'
import { useLog } from '../composables/useLog'
import './shared-demo-styles.css'

type TabId = 'array' | 'object' | 'custom'

const activeTab = ref<TabId>('array')
const { logEntries, addLog, clearLogs } = useLog(40)

// --- Итератор для массива ---

function createArrayIterator(arr: any[]): Iterator<any> {
  let index = 0
  return {
    next() {
      if (index < arr.length) {
        return { value: arr[index++], done: false }
      }
      return { value: undefined, done: true }
    }
  }
}

const arrayItems = ref('яблоко, банан, вишня, дыня')
let arrayIter: Iterator<any> | null = null
const arrayDone = ref(false)
const arrayValues = ref<string[]>([])

function createArrayIt() {
  const items = arrayItems.value.split(',').map(s => s.trim()).filter(Boolean)
  arrayIter = createArrayIterator(items)
  arrayDone.value = false
  arrayValues.value = []
  addLog(`Итератор создан для массива: [${items.map(i => `"${i}"`).join(', ')}]`, 'info')
  addLog('let index = 0; // внутреннее состояние', 'info')
}

function nextArrayIt() {
  if (!arrayIter) return
  const result = arrayIter.next()
  if (result.done) {
    arrayDone.value = true
    addLog('{ value: undefined, done: true } — итерация завершена', 'done')
  } else {
    arrayValues.value.push(result.value)
    addLog(`{ value: "${result.value}", done: false }`, 'value')
  }
}

function getAllArrayIt() {
  if (!arrayIter) return
  let result = arrayIter.next()
  while (!result.done) {
    arrayValues.value.push(result.value)
    addLog(`{ value: "${result.value}", done: false }`, 'value')
    result = arrayIter.next()
  }
  arrayDone.value = true
  addLog('{ value: undefined, done: true } — итерация завершена', 'done')
}

function resetArrayIt() {
  arrayIter = null
  arrayDone.value = false
  arrayValues.value = []
  addLog('--- Итератор сброшен ---', 'info')
}

// --- Итератор для объекта с Symbol.iterator ---

const rangeFrom = ref(1)
const rangeTo = ref(5)
let rangeIter: Iterator<number> | null = null
const rangeDone = ref(false)
const rangeValues = ref<number[]>([])

function createRangeObject(from: number, to: number) {
  return {
    [Symbol.iterator]() {
      let current = from
      return {
        next() {
          if (current <= to) {
            return { value: current++, done: false }
          }
          return { value: undefined as any, done: true }
        }
      }
    }
  }
}

function createRangeIt() {
  const range = createRangeObject(rangeFrom.value, rangeTo.value)
  rangeIter = range[Symbol.iterator]()
  rangeDone.value = false
  rangeValues.value = []
  addLog(`Объект Range создан: { from: ${rangeFrom.value}, to: ${rangeTo.value}, [Symbol.iterator]() {...} }`, 'info')
  addLog('Вызван range[Symbol.iterator]() — получен итератор', 'info')
}

function nextRangeIt() {
  if (!rangeIter) return
  const result = rangeIter.next()
  if (result.done) {
    rangeDone.value = true
    addLog('{ value: undefined, done: true } — диапазон пройден', 'done')
  } else {
    rangeValues.value.push(result.value)
    addLog(`{ value: ${result.value}, done: false }`, 'value')
  }
}

function getAllRangeIt() {
  if (!rangeIter) return
  let result = rangeIter.next()
  while (!result.done) {
    rangeValues.value.push(result.value)
    addLog(`{ value: ${result.value}, done: false }`, 'value')
    result = rangeIter.next()
  }
  rangeDone.value = true
  addLog('{ value: undefined, done: true } — диапазон пройден', 'done')
}

function forOfRange() {
  const range = createRangeObject(rangeFrom.value, rangeTo.value)
  rangeValues.value = []
  addLog(`for (let val of range) { ... } — автоматическая итерация`, 'info')
  for (const val of range) {
    rangeValues.value.push(val)
    addLog(`  значение: ${val}`, 'value')
  }
  rangeDone.value = true
  addLog('for...of завершён', 'done')
}

function resetRangeIt() {
  rangeIter = null
  rangeDone.value = false
  rangeValues.value = []
  addLog('--- Итератор Range сброшен ---', 'info')
}

// --- Пользовательский итератор (счётчик с шагом) ---

const customStart = ref(0)
const customStep = ref(2)
const customMax = ref(20)
let customIter: Iterator<number> | null = null
const customDone = ref(false)
const customValues = ref<number[]>([])

function createCustomIterator(start: number, step: number, max: number): Iterator<number> {
  let current = start
  return {
    next() {
      if (current <= max) {
        const value = current
        current += step
        return { value, done: false }
      }
      return { value: undefined as any, done: true }
    }
  }
}

function createCustomIt() {
  customIter = createCustomIterator(customStart.value, customStep.value, customMax.value)
  customDone.value = false
  customValues.value = []
  addLog(`Итератор создан: start=${customStart.value}, step=${customStep.value}, max=${customMax.value}`, 'info')
}

function nextCustomIt() {
  if (!customIter) return
  const result = customIter.next()
  if (result.done) {
    customDone.value = true
    addLog('{ value: undefined, done: true } — достигнут максимум', 'done')
  } else {
    customValues.value.push(result.value)
    addLog(`{ value: ${result.value}, done: false }`, 'value')
  }
}

function getAllCustomIt() {
  if (!customIter) return
  let result = customIter.next()
  while (!result.done) {
    customValues.value.push(result.value)
    addLog(`{ value: ${result.value}, done: false }`, 'value')
    result = customIter.next()
  }
  customDone.value = true
  addLog('{ value: undefined, done: true } — достигнут максимум', 'done')
}

function resetCustomIt() {
  customIter = null
  customDone.value = false
  customValues.value = []
  addLog('--- Итератор сброшен ---', 'info')
}

const tabs: { id: TabId; label: string }[] = [
  { id: 'array', label: 'Массив' },
  { id: 'object', label: 'Symbol.iterator' },
  { id: 'custom', label: 'Пользовательский' },
]
</script>

<template>
  <div class="demo-wrapper">
    <div class="demo-header">
      <h3>Iterators - Интерактивная демонстрация</h3>
    </div>

    <p class="demo-description">
      Изучайте протокол итераторов: создавайте итераторы, вызывайте next() и наблюдайте за { value, done }.
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
        <!-- Итератор массива -->
        <div v-if="activeTab === 'array'" class="demo-tab-content">
          <div class="demo-control-group">
            <label class="demo-input-label">
              Элементы (через запятую):
              <input v-model="arrayItems" type="text" class="demo-text-input" />
            </label>
            <div class="demo-btn-row">
              <button class="demo-btn demo-btn-create" @click="createArrayIt" data-testid="create-array">
                Создать итератор
              </button>
              <button class="demo-btn demo-btn-next" :disabled="!arrayIter || arrayDone" @click="nextArrayIt" data-testid="next-array">
                next()
              </button>
              <button class="demo-btn demo-btn-all" :disabled="!arrayIter || arrayDone" @click="getAllArrayIt" data-testid="all-array">
                Получить все
              </button>
              <button class="demo-btn demo-btn-reset" @click="resetArrayIt" data-testid="reset-array">
                Сброс
              </button>
            </div>
          </div>
          <div v-if="arrayValues.length" class="demo-values">
            <strong>Значения:</strong> [{{ arrayValues.map(v => `"${v}"`).join(', ') }}]
            <span v-if="arrayDone" class="demo-badge-done">done</span>
          </div>
        </div>

        <!-- Symbol.iterator -->
        <div v-if="activeTab === 'object'" class="demo-tab-content">
          <div class="demo-control-group">
            <div class="demo-input-row">
              <label>
                От: <input v-model.number="rangeFrom" type="number" min="0" max="100" class="demo-num-input" />
              </label>
              <label>
                До: <input v-model.number="rangeTo" type="number" min="0" max="100" class="demo-num-input" />
              </label>
            </div>
            <div class="demo-btn-row">
              <button class="demo-btn demo-btn-create" @click="createRangeIt" data-testid="create-range">
                Создать
              </button>
              <button class="demo-btn demo-btn-next" :disabled="!rangeIter || rangeDone" @click="nextRangeIt" data-testid="next-range">
                next()
              </button>
              <button class="demo-btn demo-btn-all" :disabled="!rangeIter || rangeDone" @click="getAllRangeIt" data-testid="all-range">
                Получить все
              </button>
              <button class="demo-btn demo-btn-forin" @click="forOfRange" data-testid="forof-range">
                for...of
              </button>
              <button class="demo-btn demo-btn-reset" @click="resetRangeIt" data-testid="reset-range">
                Сброс
              </button>
            </div>
          </div>
          <div v-if="rangeValues.length" class="demo-values">
            <strong>Значения:</strong> [{{ rangeValues.join(', ') }}]
            <span v-if="rangeDone" class="demo-badge-done">done</span>
          </div>
        </div>

        <!-- Пользовательский итератор -->
        <div v-if="activeTab === 'custom'" class="demo-tab-content">
          <div class="demo-control-group">
            <div class="demo-input-row">
              <label>
                Старт: <input v-model.number="customStart" type="number" min="0" max="100" class="demo-num-input" />
              </label>
              <label>
                Шаг: <input v-model.number="customStep" type="number" min="1" max="10" class="demo-num-input" />
              </label>
              <label>
                Макс: <input v-model.number="customMax" type="number" min="0" max="100" class="demo-num-input" />
              </label>
            </div>
            <div class="demo-btn-row">
              <button class="demo-btn demo-btn-create" @click="createCustomIt" data-testid="create-custom">
                Создать
              </button>
              <button class="demo-btn demo-btn-next" :disabled="!customIter || customDone" @click="nextCustomIt" data-testid="next-custom">
                next()
              </button>
              <button class="demo-btn demo-btn-all" :disabled="!customIter || customDone" @click="getAllCustomIt" data-testid="all-custom">
                Получить все
              </button>
              <button class="demo-btn demo-btn-reset" @click="resetCustomIt" data-testid="reset-custom">
                Сброс
              </button>
            </div>
          </div>
          <div v-if="customValues.length" class="demo-values">
            <strong>Значения:</strong> [{{ customValues.join(', ') }}]
            <span v-if="customDone" class="demo-badge-done">done</span>
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
            Логи пусты. Создайте итератор для начала.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
