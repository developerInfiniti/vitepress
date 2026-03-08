<script setup lang="ts">
import { ref } from 'vue'
import { useLog } from '../composables/useLog'
import './shared-demo-styles.css'

type TabId = 'basics' | 'registry' | 'wellknown' | 'practical'

const activeTab = ref<TabId>('basics')
const { logEntries, addLog, clearLogs } = useLog(40)

// --- Basics: Создание и уникальность ---

const symbolDesc = ref('mySymbol')
let symbolCounter = 0

function createSymbols() {
  symbolCounter++
  const desc = symbolDesc.value || 'без описания'
  addLog(`const sym1 = Symbol("${desc}")`, 'info')
  addLog(`const sym2 = Symbol("${desc}")`, 'info')
  addLog(`sym1 === sym2 => false  // всегда уникальны!`, 'value')
  addLog(`typeof sym1 => "symbol"`, 'value')
  addLog(`sym1.description => "${desc}"`, 'value')
  addLog(`sym1.toString() => "Symbol(${desc})"`, 'value')
}

function symbolAsKey() {
  const desc = symbolDesc.value || 'id'
  addLog(`const ${desc} = Symbol("${desc}")`, 'info')
  addLog(`const obj = { [${desc}]: 42, name: "test" }`, 'info')
  addLog(`obj[${desc}] => 42`, 'value')
  addLog(`Object.keys(obj) => ["name"]  // Symbol не виден!`, 'value')
  addLog(`Object.getOwnPropertySymbols(obj) => [Symbol(${desc})]`, 'value')
  addLog(`JSON.stringify(obj) => '{"name":"test"}'  // Symbol пропущен`, 'done')
}

function symbolInForIn() {
  addLog(`const sym = Symbol("hidden")`, 'info')
  addLog(`const obj = { [sym]: "secret", visible: "yes" }`, 'info')
  addLog(`for (let key in obj) { ... }`, 'info')
  addLog(`  key: "visible"  // Symbol не итерируется в for...in`, 'value')
  addLog(`Reflect.ownKeys(obj) => ["visible", Symbol(hidden)]`, 'value')
}

// --- Registry: Symbol.for ---

function symbolForDemo() {
  addLog(`const s1 = Symbol.for("shared")`, 'info')
  addLog(`const s2 = Symbol.for("shared")`, 'info')
  addLog(`s1 === s2 => true  // одинаковый ключ = один символ`, 'value')
  addLog('', 'info')
  addLog(`const s3 = Symbol("shared")  // обычный Symbol`, 'info')
  addLog(`s1 === s3 => false  // Symbol.for и Symbol — разные!`, 'error')
}

function symbolKeyForDemo() {
  addLog(`const sym = Symbol.for("app.config")`, 'info')
  addLog(`Symbol.keyFor(sym) => "app.config"`, 'value')
  addLog('', 'info')
  addLog(`const local = Symbol("local")`, 'info')
  addLog(`Symbol.keyFor(local) => undefined  // не в реестре`, 'done')
}

function globalRegistryDemo() {
  addLog('--- Глобальный реестр Symbol ---', 'info')
  addLog(`// Файл module-a.js`, 'info')
  addLog(`const DB_KEY = Symbol.for("app.database")`, 'value')
  addLog('', 'info')
  addLog(`// Файл module-b.js (другой модуль)`, 'info')
  addLog(`const DB_KEY = Symbol.for("app.database")`, 'value')
  addLog('', 'info')
  addLog(`// Оба модуля получают один и тот же символ!`, 'done')
  addLog(`// Полезно для межмодульных "скрытых" ключей`, 'done')
}

// --- Well-known symbols ---

function symbolIteratorDemo() {
  addLog(`Symbol.iterator — делает объект итерируемым`, 'info')
  addLog('', 'info')
  addLog(`const range = {`, 'info')
  addLog(`  from: 1, to: 3,`, 'info')
  addLog(`  [Symbol.iterator]() { ... }`, 'info')
  addLog(`}`, 'info')

  const range = {
    from: 1,
    to: 3,
    [Symbol.iterator]() {
      let current = this.from
      const last = this.to
      return {
        next() {
          return current <= last
            ? { value: current++, done: false }
            : { value: undefined, done: true }
        }
      }
    }
  }

  addLog(`for (const n of range) { ... }`, 'info')
  for (const n of range) {
    addLog(`  => ${n}`, 'value')
  }
  addLog(`[...range] => [1, 2, 3]`, 'done')
}

function symbolToPrimitiveDemo() {
  addLog(`Symbol.toPrimitive — управляет преобразованием типов`, 'info')
  addLog('', 'info')
  addLog(`const money = {`, 'info')
  addLog(`  amount: 100, currency: "USD",`, 'info')
  addLog(`  [Symbol.toPrimitive](hint) { ... }`, 'info')
  addLog(`}`, 'info')
  addLog('', 'info')
  addLog(`hint: "number"  => money + 0 => 100`, 'value')
  addLog(`hint: "string"  => \`\${money}\` => "100 USD"`, 'value')
  addLog(`hint: "default" => money + "" => "100 USD"`, 'value')
}

function symbolHasInstanceDemo() {
  addLog(`Symbol.hasInstance — настройка instanceof`, 'info')
  addLog('', 'info')
  addLog(`class MyArray {`, 'info')
  addLog(`  static [Symbol.hasInstance](instance) {`, 'info')
  addLog(`    return Array.isArray(instance)`, 'info')
  addLog(`  }`, 'info')
  addLog(`}`, 'info')
  addLog('', 'info')
  addLog(`[] instanceof MyArray => true`, 'value')
  addLog(`"hello" instanceof MyArray => false`, 'value')
}

function symbolSpeciesDemo() {
  addLog(`Symbol.species — контроль типа при наследовании`, 'info')
  addLog('', 'info')
  addLog(`class PowerArray extends Array {`, 'info')
  addLog(`  static get [Symbol.species]() {`, 'info')
  addLog(`    return Array  // map/filter вернут Array, не PowerArray`, 'info')
  addLog(`  }`, 'info')
  addLog(`}`, 'info')
  addLog('', 'info')
  addLog(`const arr = new PowerArray(1, 2, 3)`, 'value')
  addLog(`arr.filter(x => x > 1) instanceof PowerArray => false`, 'value')
  addLog(`arr.filter(x => x > 1) instanceof Array => true`, 'done')
}

// --- Practical examples ---

function privatePropsDemo() {
  addLog('--- Symbol как приватные свойства ---', 'info')
  addLog(`const _password = Symbol("password")`, 'info')
  addLog(`const _validate = Symbol("validate")`, 'info')
  addLog('', 'info')
  addLog(`class User {`, 'info')
  addLog(`  constructor(name, password) {`, 'info')
  addLog(`    this.name = name`, 'info')
  addLog(`    this[_password] = password  // "скрытое" свойство`, 'info')
  addLog(`  }`, 'info')
  addLog(`}`, 'info')
  addLog('', 'info')
  addLog(`const user = new User("John", "secret123")`, 'value')
  addLog(`Object.keys(user) => ["name"]  // пароль не виден`, 'value')
  addLog(`user[_password] => "secret123"  // доступ по символу`, 'done')
}

function pluginSystemDemo() {
  addLog('--- Symbol для системы плагинов ---', 'info')
  addLog(`const HOOKS = {`, 'info')
  addLog(`  init: Symbol.for("plugin.init"),`, 'info')
  addLog(`  destroy: Symbol.for("plugin.destroy"),`, 'info')
  addLog(`}`, 'info')
  addLog('', 'info')
  addLog(`// Плагин A`, 'info')
  addLog(`const pluginA = {`, 'info')
  addLog(`  [HOOKS.init]() { console.log("A init") },`, 'info')
  addLog(`  [HOOKS.destroy]() { console.log("A destroy") },`, 'info')
  addLog(`}`, 'info')
  addLog('', 'info')
  addLog(`// Хуки не пересекаются с обычными свойствами`, 'value')
  addLog(`// Глобальный реестр гарантирует единый ключ`, 'done')
}

function metadataDemo() {
  addLog('--- Symbol для метаданных ---', 'info')
  addLog(`const metadata = Symbol("metadata")`, 'info')
  addLog('', 'info')
  addLog(`function trackable(obj, source) {`, 'info')
  addLog(`  obj[metadata] = {`, 'info')
  addLog(`    createdAt: Date.now(),`, 'info')
  addLog(`    source`, 'info')
  addLog(`  }`, 'info')
  addLog(`  return obj`, 'info')
  addLog(`}`, 'info')
  addLog('', 'info')
  addLog(`const data = trackable({ id: 1 }, "API")`, 'value')
  addLog(`JSON.stringify(data) => '{"id":1}'  // метаданные скрыты`, 'value')
  addLog(`data[metadata].source => "API"  // но доступны`, 'done')
}

const tabs: { id: TabId; label: string }[] = [
  { id: 'basics', label: 'Основы' },
  { id: 'registry', label: 'Symbol.for' },
  { id: 'wellknown', label: 'Well-known' },
  { id: 'practical', label: 'Практика' },
]
</script>

<template>
  <div class="demo-wrapper">
    <div class="demo-header">
      <h3>Symbols - Интерактивная демонстрация</h3>
    </div>

    <p class="demo-description">
      Изучайте символы: создавайте, используйте как ключи, работайте с глобальным реестром и well-known символами.
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
        <!-- Основы -->
        <div v-if="activeTab === 'basics'" class="demo-tab-content">
          <div class="demo-control-group">
            <label class="demo-input-label">
              Описание символа:
              <input v-model="symbolDesc" type="text" class="demo-text-input" placeholder="mySymbol" />
            </label>
            <div class="demo-btn-row">
              <button class="demo-btn demo-btn-create" @click="createSymbols" data-testid="create-symbols">
                Создать Symbol
              </button>
              <button class="demo-btn demo-btn-key" @click="symbolAsKey" data-testid="symbol-as-key">
                Symbol как ключ
              </button>
              <button class="demo-btn demo-btn-forin" @click="symbolInForIn" data-testid="symbol-for-in">
                for...in
              </button>
            </div>
          </div>
        </div>

        <!-- Symbol.for -->
        <div v-if="activeTab === 'registry'" class="demo-tab-content">
          <div class="demo-control-group">
            <div class="demo-btn-row">
              <button class="demo-btn demo-btn-create" @click="symbolForDemo" data-testid="symbol-for">
                Symbol.for()
              </button>
              <button class="demo-btn demo-btn-key" @click="symbolKeyForDemo" data-testid="symbol-keyfor">
                Symbol.keyFor()
              </button>
              <button class="demo-btn demo-btn-all" @click="globalRegistryDemo" data-testid="global-registry">
                Глобальный реестр
              </button>
            </div>
          </div>
        </div>

        <!-- Well-known -->
        <div v-if="activeTab === 'wellknown'" class="demo-tab-content">
          <div class="demo-control-group">
            <div class="demo-btn-row">
              <button class="demo-btn demo-btn-create" @click="symbolIteratorDemo" data-testid="symbol-iterator">
                Symbol.iterator
              </button>
              <button class="demo-btn demo-btn-key" @click="symbolToPrimitiveDemo" data-testid="symbol-toprimitive">
                Symbol.toPrimitive
              </button>
            </div>
            <div class="demo-btn-row">
              <button class="demo-btn demo-btn-all" @click="symbolHasInstanceDemo" data-testid="symbol-hasinstance">
                Symbol.hasInstance
              </button>
              <button class="demo-btn demo-btn-forin" @click="symbolSpeciesDemo" data-testid="symbol-species">
                Symbol.species
              </button>
            </div>
          </div>
        </div>

        <!-- Практика -->
        <div v-if="activeTab === 'practical'" class="demo-tab-content">
          <div class="demo-control-group">
            <div class="demo-btn-row">
              <button class="demo-btn demo-btn-create" @click="privatePropsDemo" data-testid="private-props">
                Приватные свойства
              </button>
              <button class="demo-btn demo-btn-key" @click="pluginSystemDemo" data-testid="plugin-system">
                Система плагинов
              </button>
              <button class="demo-btn demo-btn-all" @click="metadataDemo" data-testid="metadata">
                Метаданные
              </button>
            </div>
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
            Логи пусты. Нажмите кнопку для примера.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
