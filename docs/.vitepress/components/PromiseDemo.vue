<script setup lang="ts">
import { ref } from 'vue'
import { useLog } from '../composables/useLog'
import './shared-demo-styles.css'

type PromiseState = 'idle' | 'pending' | 'fulfilled' | 'rejected'

const state = ref<PromiseState>('idle')
const result = ref<string | null>(null)
const { logEntries, addLog, clearLogs } = useLog()

let currentResolve: ((value: string) => void) | null = null
let currentReject: ((reason: string) => void) | null = null

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

const stateLabels: Record<PromiseState, string> = {
  idle: 'Не создан',
  pending: 'Pending',
  fulfilled: 'Fulfilled',
  rejected: 'Rejected',
}
</script>

<template>
  <div class="demo-wrapper">
    <div class="demo-header">
      <h3>Promise - Интерактивная демонстрация</h3>
      <span class="demo-state-badge" :class="`demo-state-${state}`">
        {{ stateLabels[state] }}
      </span>
    </div>

    <p class="demo-description">
      Создайте Promise и управляйте его состоянием вручную или автоматически. Наблюдайте за переходами состояний и вызовами обработчиков.
    </p>

    <div class="demo-body">
      <div class="demo-controls">
        <div class="demo-control-group">
          <strong>Ручное управление:</strong>
          <div class="demo-btn-row">
            <button
              class="demo-btn demo-btn-create"
              :disabled="state === 'pending'"
              @click="startPromise"
              data-testid="create-promise"
            >
              Создать Promise
            </button>
            <button
              class="demo-btn demo-btn-resolve"
              :disabled="state !== 'pending'"
              @click="resolvePromise"
              data-testid="resolve"
            >
              Resolve
            </button>
            <button
              class="demo-btn demo-btn-reject"
              :disabled="state !== 'pending'"
              @click="rejectPromise"
              data-testid="reject"
            >
              Reject
            </button>
          </div>
        </div>

        <div class="demo-control-group">
          <strong>Автоматический сценарий (с таймером):</strong>
          <div class="demo-btn-row">
            <button
              class="demo-btn demo-btn-auto-resolve"
              :disabled="state !== 'idle'"
              @click="autoResolve"
              data-testid="auto-resolve"
            >
              Auto Resolve (2 сек)
            </button>
            <button
              class="demo-btn demo-btn-auto-reject"
              :disabled="state !== 'idle'"
              @click="autoReject"
              data-testid="auto-reject"
            >
              Auto Reject (2 сек)
            </button>
          </div>
        </div>

        <div class="demo-control-group">
          <div class="demo-btn-row">
            <button
              class="demo-btn demo-btn-reset"
              @click="resetDemo"
              data-testid="reset"
            >
              Сброс
            </button>
          </div>
        </div>

        <div v-if="result !== null" class="demo-result" :class="state === 'fulfilled' ? 'demo-result-success' : 'demo-result-error'">
          <strong>Результат:</strong> {{ result }}
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
            Логи пусты. Создайте Promise для начала.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
