<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, onBeforeMount, onBeforeUnmount, onUpdated, watch, watchEffect } from 'vue'

// Реактивное состояние
const count = ref(0)
const step = ref(1)
const timer = ref<ReturnType<typeof setInterval> | null>(null)
const isAutoIncrement = ref(false)
const secondsAlive = ref(0)
let aliveInterval: ReturnType<typeof setInterval> | null = null

// Вычисляемое свойство
const doubleCount = computed(() => count.value * 2)

// Типы логов для надёжной классификации (без includes-хаков)
type LogType = 'lifecycle' | 'watch' | 'effect' | 'action'

interface LogEntry {
  time: string
  message: string
  type: LogType
}

const logEntries = ref<LogEntry[]>([])

// Функция для добавления лога
function addLog(message: string, type: LogType = 'action') {
  const time = new Date().toLocaleTimeString()
  logEntries.value.push({ time, message, type })
  // Ограничиваем количество логов
  if (logEntries.value.length > 50) {
    logEntries.value = logEntries.value.slice(-50)
  }
}

// Для совместимости с data-testid="logs" — текстовое представление
const logs = computed(() => logEntries.value.map(e => `[${e.time}] ${e.message}`))

// Методы компонента
function increment() {
  count.value += step.value
}

function decrement() {
  count.value -= step.value
}

function reset() {
  count.value = 0
  addLog('Счётчик сброшен')
}

function toggleAutoIncrement() {
  isAutoIncrement.value = !isAutoIncrement.value
  if (isAutoIncrement.value) {
    timer.value = setInterval(() => {
      count.value += step.value
    }, 1000)
    addLog('Автоинкремент включён')
  } else {
    if (timer.value) {
      clearInterval(timer.value)
      timer.value = null
    }
    addLog('Автоинкремент выключен')
  }
}

function clearLogs() {
  logEntries.value = []
}

// === Lifecycle Hooks ===

onBeforeMount(() => {
  addLog('onBeforeMount: компонент готовится к монтированию', 'lifecycle')
})

onMounted(() => {
  addLog('onMounted: компонент смонтирован в DOM', 'lifecycle')
  // Запускаем таймер "время жизни"
  aliveInterval = setInterval(() => {
    secondsAlive.value++
  }, 1000)
})

// Замечание #3: onUpdated логирует только первые 3 раза, затем подавляет шум
let updateCount = 0
onUpdated(() => {
  updateCount++
  if (updateCount <= 3) {
    addLog(`onUpdated: компонент обновился в DOM (${updateCount})`, 'lifecycle')
  } else if (updateCount === 4) {
    addLog('onUpdated: дальнейшие обновления подавлены (слишком частые)', 'lifecycle')
  }
})

onBeforeUnmount(() => {
  addLog('onBeforeUnmount: компонент готовится к размонтированию', 'lifecycle')
})

onUnmounted(() => {
  // Очистка всех интервалов
  if (timer.value) {
    clearInterval(timer.value)
  }
  if (aliveInterval) {
    clearInterval(aliveInterval)
  }
  // Лог уже не будет виден, но демонстрирует паттерн очистки
  console.log('onUnmounted: все ресурсы очищены')
})

// === Watchers ===

watch(count, (newVal, oldVal) => {
  addLog(`watch(count): ${oldVal} -> ${newVal}`, 'watch')
})

watch(step, (newVal) => {
  addLog(`watch(step): шаг изменён на ${newVal}`, 'watch')
})

watchEffect(() => {
  // watchEffect автоматически отслеживает зависимости
  if (count.value > 0 && count.value % 10 === 0) {
    addLog(`watchEffect: count кратен 10! (${count.value})`, 'effect')
  }
})
</script>

<template>
  <div class="lifecycle-demo">
    <div class="demo-header">
      <h3>Демо: Vue Lifecycle Hooks</h3>
      <span class="alive-badge">
        Компонент живёт: {{ secondsAlive }} сек.
      </span>
    </div>

    <div class="demo-body">
      <!-- Счётчик -->
      <div class="counter-section">
        <div class="counter-display">
          <span class="counter-value">{{ count }}</span>
          <span class="counter-double">x2 = {{ doubleCount }}</span>
        </div>

        <div class="counter-controls">
          <button class="btn btn-minus" @click="decrement" data-testid="decrement">
            - {{ step }}
          </button>
          <button class="btn btn-reset" @click="reset" data-testid="reset">
            Сброс
          </button>
          <button class="btn btn-plus" @click="increment" data-testid="increment">
            + {{ step }}
          </button>
        </div>

        <div class="step-control">
          <label>
            Шаг:
            <input
              v-model.number="step"
              type="range"
              min="1"
              max="10"
              data-testid="step-input"
            />
            <span>{{ step }}</span>
          </label>
        </div>

        <button
          class="btn"
          :class="isAutoIncrement ? 'btn-stop' : 'btn-auto'"
          @click="toggleAutoIncrement"
          data-testid="auto-toggle"
        >
          {{ isAutoIncrement ? 'Остановить авто' : 'Автоинкремент' }}
        </button>
      </div>

      <!-- Логи lifecycle -->
      <div class="logs-section">
        <div class="logs-header">
          <strong>Логи Lifecycle / Watchers:</strong>
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
            Логи пусты. Взаимодействуйте с компонентом.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lifecycle-demo {
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

.alive-badge {
  background: var(--vp-c-brand-1, #3eaf7c);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85em;
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

.counter-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.counter-display {
  text-align: center;
  padding: 16px;
  background: var(--vp-c-bg, white);
  border-radius: 8px;
}

.counter-value {
  font-size: 3em;
  font-weight: bold;
  color: var(--vp-c-brand-1, #3eaf7c);
  display: block;
}

.counter-double {
  font-size: 1.1em;
  color: var(--vp-c-text-2, #666);
}

.counter-controls {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.step-control {
  text-align: center;
}

.step-control label {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95em;
  transition: opacity 0.2s;
}

.btn:hover {
  opacity: 0.85;
}

.btn-plus {
  background: #3eaf7c;
  color: white;
}

.btn-minus {
  background: #e74c3c;
  color: white;
}

.btn-reset {
  background: #95a5a6;
  color: white;
}

.btn-auto {
  background: #3498db;
  color: white;
}

.btn-stop {
  background: #e67e22;
  color: white;
}

.btn-small {
  padding: 4px 10px;
  font-size: 0.8em;
  background: #bdc3c7;
  color: #333;
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

.log-lifecycle {
  color: #c586c0;
}

.log-watch {
  color: #4ec9b0;
}

.log-effect {
  color: #dcdcaa;
}

.log-action {
  color: #9cdcfe;
}

.log-empty {
  color: #666;
  font-style: italic;
}
</style>
