<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { useLog } from '../composables/useLog'
import './shared-demo-styles.css'

type Algorithm = 'bubble' | 'quick' | 'merge' | 'selection' | 'insertion'
type SortState = 'idle' | 'running' | 'paused' | 'done'

interface Bar {
  value: number
  color: string
}

const DEFAULT_COLOR = '#3498db'
const COMPARE_COLOR = '#f39c12'
const SWAP_COLOR = '#e74c3c'
const SORTED_COLOR = '#27ae60'
const PIVOT_COLOR = '#9b59b6'

const algorithm = ref<Algorithm>('bubble')
const arraySize = ref(30)
const speedMs = ref(50)
const state = ref<SortState>('idle')
const bars = ref<Bar[]>([])
const comparisons = ref(0)
const swaps = ref(0)
const elapsedMs = ref(0)

const { logEntries, addLog, clearLogs } = useLog(30)

let animationTimer: ReturnType<typeof setTimeout> | null = null
let startTime = 0
let stopRequested = false
let pauseResolve: (() => void) | null = null

const algorithmLabels: Record<Algorithm, string> = {
  bubble: 'Bubble Sort',
  selection: 'Selection Sort',
  insertion: 'Insertion Sort',
  quick: 'Quick Sort',
  merge: 'Merge Sort',
}

const algorithmComplexity: Record<Algorithm, string> = {
  bubble: 'O(n^2)',
  selection: 'O(n^2)',
  insertion: 'O(n^2)',
  quick: 'O(n log n)',
  merge: 'O(n log n)',
}

const maxBarValue = computed(() => Math.max(...bars.value.map(b => b.value), 1))

function generateArray() {
  stopRequested = true
  if (animationTimer) clearTimeout(animationTimer)
  state.value = 'idle'
  comparisons.value = 0
  swaps.value = 0
  elapsedMs.value = 0

  const arr: Bar[] = []
  for (let i = 0; i < arraySize.value; i++) {
    arr.push({ value: Math.floor(Math.random() * 200) + 10, color: DEFAULT_COLOR })
  }
  bars.value = arr
  addLog(`Создан массив из ${arraySize.value} элементов`, 'info')
}

function delay(): Promise<void> {
  return new Promise(resolve => {
    if (state.value === 'paused') {
      pauseResolve = resolve
      return
    }
    animationTimer = setTimeout(resolve, speedMs.value)
  })
}

function checkStop(): boolean {
  return stopRequested
}

function setColor(index: number, color: string) {
  if (bars.value[index]) bars.value[index].color = color
}

function resetColors() {
  for (const bar of bars.value) {
    bar.color = DEFAULT_COLOR
  }
}

function markAllSorted() {
  for (const bar of bars.value) {
    bar.color = SORTED_COLOR
  }
}

async function bubbleSort() {
  const arr = bars.value
  const n = arr.length
  for (let i = 0; i < n - 1; i++) {
    let swapped = false
    for (let j = 0; j < n - i - 1; j++) {
      if (checkStop()) return
      setColor(j, COMPARE_COLOR)
      setColor(j + 1, COMPARE_COLOR)
      comparisons.value++
      await delay()
      if (checkStop()) return

      if (arr[j].value > arr[j + 1].value) {
        ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
        swaps.value++
        setColor(j, SWAP_COLOR)
        setColor(j + 1, SWAP_COLOR)
        await delay()
        if (checkStop()) return
        swapped = true
      }
      setColor(j, DEFAULT_COLOR)
      setColor(j + 1, DEFAULT_COLOR)
    }
    setColor(n - i - 1, SORTED_COLOR)
    if (!swapped) break
  }
  setColor(0, SORTED_COLOR)
}

async function selectionSort() {
  const arr = bars.value
  const n = arr.length
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i
    setColor(i, PIVOT_COLOR)
    for (let j = i + 1; j < n; j++) {
      if (checkStop()) return
      setColor(j, COMPARE_COLOR)
      comparisons.value++
      await delay()
      if (checkStop()) return

      if (arr[j].value < arr[minIdx].value) {
        if (minIdx !== i) setColor(minIdx, DEFAULT_COLOR)
        minIdx = j
        setColor(minIdx, SWAP_COLOR)
      } else {
        setColor(j, DEFAULT_COLOR)
      }
    }
    if (minIdx !== i) {
      ;[arr[i], arr[minIdx]] = [arr[minIdx], arr[i]]
      swaps.value++
      setColor(minIdx, DEFAULT_COLOR)
    }
    setColor(i, SORTED_COLOR)
    await delay()
    if (checkStop()) return
  }
  setColor(bars.value.length - 1, SORTED_COLOR)
}

async function insertionSort() {
  const arr = bars.value
  const n = arr.length
  setColor(0, SORTED_COLOR)
  for (let i = 1; i < n; i++) {
    if (checkStop()) return
    const key = arr[i]
    setColor(i, PIVOT_COLOR)
    await delay()
    if (checkStop()) return

    let j = i - 1
    while (j >= 0 && arr[j].value > key.value) {
      if (checkStop()) return
      comparisons.value++
      setColor(j, COMPARE_COLOR)
      arr[j + 1] = arr[j]
      swaps.value++
      await delay()
      if (checkStop()) return
      setColor(j + 1, DEFAULT_COLOR)
      setColor(j, DEFAULT_COLOR)
      j--
    }
    if (j >= 0) comparisons.value++
    arr[j + 1] = key
    for (let k = 0; k <= i; k++) {
      setColor(k, SORTED_COLOR)
    }
    await delay()
    if (checkStop()) return
  }
}

async function quickSort(left = 0, right = bars.value.length - 1) {
  if (left >= right) {
    if (left === right) setColor(left, SORTED_COLOR)
    return
  }
  if (checkStop()) return

  const pivotIdx = await partition(left, right)
  if (checkStop()) return
  setColor(pivotIdx, SORTED_COLOR)

  await quickSort(left, pivotIdx - 1)
  if (checkStop()) return
  await quickSort(pivotIdx + 1, right)
}

async function partition(left: number, right: number): Promise<number> {
  const arr = bars.value
  const pivotValue = arr[right].value
  setColor(right, PIVOT_COLOR)
  let i = left - 1

  for (let j = left; j < right; j++) {
    if (checkStop()) return left
    setColor(j, COMPARE_COLOR)
    comparisons.value++
    await delay()
    if (checkStop()) return left

    if (arr[j].value <= pivotValue) {
      i++
      if (i !== j) {
        ;[arr[i], arr[j]] = [arr[j], arr[i]]
        swaps.value++
        setColor(i, SWAP_COLOR)
        await delay()
        if (checkStop()) return left
      }
      setColor(i, DEFAULT_COLOR)
    }
    setColor(j, DEFAULT_COLOR)
  }

  ;[arr[i + 1], arr[right]] = [arr[right], arr[i + 1]]
  swaps.value++
  setColor(right, DEFAULT_COLOR)
  return i + 1
}

async function mergeSort(left = 0, right = bars.value.length - 1) {
  if (left >= right) {
    if (left === right && state.value !== 'idle') setColor(left, SORTED_COLOR)
    return
  }
  if (checkStop()) return

  const mid = Math.floor((left + right) / 2)
  await mergeSort(left, mid)
  if (checkStop()) return
  await mergeSort(mid + 1, right)
  if (checkStop()) return
  await merge(left, mid, right)
}

async function merge(left: number, mid: number, right: number) {
  const arr = bars.value
  const leftArr = arr.slice(left, mid + 1)
  const rightArr = arr.slice(mid + 1, right + 1)
  let i = 0, j = 0, k = left

  while (i < leftArr.length && j < rightArr.length) {
    if (checkStop()) return
    comparisons.value++
    setColor(k, COMPARE_COLOR)
    await delay()
    if (checkStop()) return

    if (leftArr[i].value <= rightArr[j].value) {
      arr[k] = { ...leftArr[i], color: SORTED_COLOR }
      i++
    } else {
      arr[k] = { ...rightArr[j], color: SORTED_COLOR }
      j++
      swaps.value++
    }
    k++
  }

  while (i < leftArr.length) {
    if (checkStop()) return
    arr[k] = { ...leftArr[i], color: SORTED_COLOR }
    i++
    k++
    await delay()
    if (checkStop()) return
  }

  while (j < rightArr.length) {
    if (checkStop()) return
    arr[k] = { ...rightArr[j], color: SORTED_COLOR }
    j++
    k++
    await delay()
    if (checkStop()) return
  }
}

async function startSort() {
  if (state.value === 'running') return

  if (state.value === 'paused') {
    state.value = 'running'
    if (pauseResolve) {
      const resolve = pauseResolve
      pauseResolve = null
      resolve()
    }
    return
  }

  if (bars.value.length === 0) generateArray()

  resetColors()
  comparisons.value = 0
  swaps.value = 0
  stopRequested = false
  state.value = 'running'
  startTime = performance.now()

  addLog(`Запуск ${algorithmLabels[algorithm.value]}...`, 'info')

  const timer = setInterval(() => {
    if (state.value === 'running') {
      elapsedMs.value = Math.round(performance.now() - startTime)
    }
  }, 100)

  try {
    switch (algorithm.value) {
      case 'bubble': await bubbleSort(); break
      case 'selection': await selectionSort(); break
      case 'insertion': await insertionSort(); break
      case 'quick': await quickSort(); break
      case 'merge': await mergeSort(); break
    }

    if (!stopRequested) {
      markAllSorted()
      state.value = 'done'
      elapsedMs.value = Math.round(performance.now() - startTime)
      addLog(`Готово! Сравнений: ${comparisons.value}, Обменов: ${swaps.value}, Время: ${elapsedMs.value}ms`, 'success')
    }
  } catch {
    state.value = 'idle'
  } finally {
    clearInterval(timer)
  }
}

function pauseSort() {
  if (state.value === 'running') {
    state.value = 'paused'
    addLog('Пауза', 'pending')
  }
}

function stopSort() {
  stopRequested = true
  if (animationTimer) clearTimeout(animationTimer)
  if (pauseResolve) {
    const resolve = pauseResolve
    pauseResolve = null
    resolve()
  }
  state.value = 'idle'
  resetColors()
  addLog('Остановлено', 'error')
}

function resetAll() {
  stopSort()
  bars.value = []
  comparisons.value = 0
  swaps.value = 0
  elapsedMs.value = 0
  clearLogs()
  addLog('Демо сброшено', 'info')
}

const stateLabels: Record<SortState, string> = {
  idle: 'Ожидание',
  running: 'Сортировка...',
  paused: 'Пауза',
  done: 'Готово',
}

onUnmounted(() => {
  stopRequested = true
  if (animationTimer) clearTimeout(animationTimer)
})

generateArray()
</script>

<template>
  <div class="demo-wrapper">
    <div class="demo-header">
      <h3>Algorithm Visualizer — Визуализация сортировок</h3>
      <span
        class="demo-state-badge"
        :class="`demo-state-${state === 'running' ? 'pending' : state === 'done' ? 'fulfilled' : state === 'paused' ? 'rejected' : 'idle'}`"
      >
        {{ stateLabels[state] }}
      </span>
    </div>

    <p class="demo-description">
      Наблюдайте за работой алгоритмов сортировки в реальном времени. Выберите алгоритм, настройте размер массива и скорость.
    </p>

    <div class="controls-row">
      <div class="demo-control-group">
        <strong>Алгоритм:</strong>
        <select v-model="algorithm" class="algo-select" :disabled="state === 'running' || state === 'paused'">
          <option v-for="(label, key) in algorithmLabels" :key="key" :value="key">
            {{ label }} — {{ algorithmComplexity[key as Algorithm] }}
          </option>
        </select>
      </div>

      <div class="demo-control-group">
        <strong>Размер: {{ arraySize }}</strong>
        <input
          type="range"
          v-model.number="arraySize"
          min="5"
          max="100"
          :disabled="state === 'running' || state === 'paused'"
          class="range-input"
          @change="generateArray"
        />
      </div>

      <div class="demo-control-group">
        <strong>Скорость: {{ speedMs }}ms</strong>
        <input
          type="range"
          v-model.number="speedMs"
          min="1"
          max="200"
          class="range-input"
        />
      </div>
    </div>

    <div class="demo-btn-row">
      <button
        class="demo-btn demo-btn-create"
        :disabled="state === 'running'"
        @click="startSort"
      >
        {{ state === 'paused' ? 'Продолжить' : 'Старт' }}
      </button>
      <button
        class="demo-btn demo-btn-forin"
        :disabled="state !== 'running'"
        @click="pauseSort"
      >
        Пауза
      </button>
      <button
        class="demo-btn demo-btn-stop"
        :disabled="state === 'idle' && bars.length === 0"
        @click="stopSort"
      >
        Стоп
      </button>
      <button
        class="demo-btn demo-btn-next"
        :disabled="state === 'running' || state === 'paused'"
        @click="generateArray"
      >
        Новый массив
      </button>
      <button class="demo-btn demo-btn-reset" @click="resetAll">
        Сброс
      </button>
    </div>

    <div class="viz-container">
      <div class="bars-container">
        <div
          v-for="(bar, index) in bars"
          :key="index"
          class="bar"
          :style="{
            height: `${(bar.value / maxBarValue) * 100}%`,
            width: `${Math.max(100 / bars.length - 0.5, 1)}%`,
            backgroundColor: bar.color,
          }"
        ></div>
      </div>
    </div>

    <div class="stats-row">
      <span class="stat-item">Сравнений: <strong>{{ comparisons }}</strong></span>
      <span class="stat-item">Обменов: <strong>{{ swaps }}</strong></span>
      <span class="stat-item">Время: <strong>{{ elapsedMs }}ms</strong></span>
      <span class="stat-item">Сложность: <strong>{{ algorithmComplexity[algorithm] }}</strong></span>
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
          Логи пусты. Нажмите «Старт» для начала.
        </div>
      </div>
    </div>

    <div class="legend">
      <span class="legend-item"><span class="legend-color" style="background: #3498db"></span> Элемент</span>
      <span class="legend-item"><span class="legend-color" style="background: #f39c12"></span> Сравнение</span>
      <span class="legend-item"><span class="legend-color" style="background: #e74c3c"></span> Обмен</span>
      <span class="legend-item"><span class="legend-color" style="background: #9b59b6"></span> Опорный</span>
      <span class="legend-item"><span class="legend-color" style="background: #27ae60"></span> Отсортирован</span>
    </div>
  </div>
</template>

<style scoped>
.controls-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 16px;
  align-items: flex-end;
}

.controls-row .demo-control-group {
  flex: 1;
  min-width: 150px;
}

.algo-select {
  width: 100%;
  padding: 6px 10px;
  border: 1px solid var(--vp-c-divider, #e2e2e3);
  border-radius: 6px;
  font-size: 0.9em;
  background: var(--vp-c-bg, white);
  cursor: pointer;
}

.range-input {
  width: 100%;
  cursor: pointer;
}

.viz-container {
  margin: 16px 0;
  padding: 12px;
  background: var(--vp-c-bg, white);
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider, #e2e2e3);
}

.bars-container {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 1px;
  height: 250px;
  width: 100%;
}

.bar {
  border-radius: 2px 2px 0 0;
  transition: height 0.05s ease, background-color 0.1s ease;
  min-width: 2px;
}

.stats-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  padding: 8px 12px;
  background: var(--vp-c-bg, white);
  border-radius: 6px;
  margin-bottom: 16px;
  font-size: 0.9em;
}

.stat-item {
  color: var(--vp-c-text-2, #666);
}

.legend {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 12px;
  font-size: 0.85em;
  color: var(--vp-c-text-2, #666);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.legend-color {
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 3px;
}

@media (max-width: 640px) {
  .controls-row {
    flex-direction: column;
  }

  .bars-container {
    height: 180px;
  }

  .stats-row {
    flex-direction: column;
    gap: 4px;
  }
}
</style>
