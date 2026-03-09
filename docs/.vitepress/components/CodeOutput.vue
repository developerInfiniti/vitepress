<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import type { OutputEntry, ExecutionResult, ExecutionError, ExecutionStatus } from '../types/playground'

const props = withDefaults(
  defineProps<{
    /** Current execution result */
    result?: ExecutionResult | null
    /** Current execution status */
    status?: ExecutionStatus
    /** Maximum number of history entries to keep */
    maxHistory?: number
  }>(),
  {
    result: null,
    status: 'idle',
    maxHistory: 10,
  },
)

const emit = defineEmits<{
  (e: 'go-to-line', line: number, column: number): void
  (e: 'clear'): void
}>()

/** History of past execution results */
interface HistoryEntry {
  id: number
  result: ExecutionResult
  timestamp: Date
}

const history = ref<HistoryEntry[]>([])
const activeHistoryId = ref<number | null>(null)
const outputEl = ref<HTMLElement | null>(null)
let historyCounter = 0

/** The result currently displayed (active history item or live result) */
const displayResult = computed<ExecutionResult | null>(() => {
  if (activeHistoryId.value !== null) {
    const entry = history.value.find(h => h.id === activeHistoryId.value)
    return entry?.result ?? null
  }
  return props.result ?? null
})

const displayOutput = computed<OutputEntry[]>(() => displayResult.value?.output ?? [])
const displayError = computed<ExecutionError | null>(() => displayResult.value?.error ?? null)
const displayStatus = computed<ExecutionStatus>(() => {
  if (activeHistoryId.value !== null) {
    return displayResult.value?.status ?? 'idle'
  }
  return props.status
})

/** Parse stack trace string into clickable lines */
interface StackFrame {
  text: string
  line?: number
  column?: number
  isClickable: boolean
}

function parseStackTrace(stack: string): StackFrame[] {
  if (!stack) return []
  return stack.split('\n').filter(l => l.trim()).map(line => {
    // Match patterns like "at functionName (file:line:column)" or "at file:line:column"
    const match = line.match(/:(\d+):(\d+)/)
    if (match) {
      return {
        text: line.trim(),
        line: parseInt(match[1], 10),
        column: parseInt(match[2], 10),
        isClickable: true,
      }
    }
    return { text: line.trim(), isClickable: false }
  })
}

const stackFrames = computed(() => {
  if (!displayError.value?.stack) return []
  return parseStackTrace(displayError.value.stack)
})

/** Save current result to history when a new result arrives */
watch(
  () => props.result,
  (newResult) => {
    if (!newResult || newResult.status === 'idle' || newResult.status === 'running') return

    historyCounter++
    history.value.unshift({
      id: historyCounter,
      result: { ...newResult, output: [...newResult.output] },
      timestamp: new Date(),
    })

    // Trim history
    if (history.value.length > props.maxHistory) {
      history.value = history.value.slice(0, props.maxHistory)
    }

    // Reset to live view
    activeHistoryId.value = null

    nextTick(() => scrollToBottom())
  },
)

function scrollToBottom() {
  if (outputEl.value) {
    outputEl.value.scrollTop = outputEl.value.scrollHeight
  }
}

function handleStackClick(frame: StackFrame) {
  if (frame.isClickable && frame.line) {
    emit('go-to-line', frame.line, frame.column ?? 1)
  }
}

function handleErrorLineClick() {
  const err = displayError.value
  if (err?.line) {
    emit('go-to-line', err.line, err.column ?? 1)
  }
}

function selectHistory(id: number) {
  activeHistoryId.value = activeHistoryId.value === id ? null : id
}

function clearHistory() {
  history.value = []
  activeHistoryId.value = null
  emit('clear')
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString()
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(2)}s`
}

/** Color class for output entry type */
function outputClass(type: string): string {
  return `output-entry--${type}`
}

/** Prefix icon for output type */
const outputPrefix: Record<string, string> = {
  log: '\u276F',
  warn: '\u26A0',
  error: '\u2716',
  info: '\u2139',
  result: '\u2192',
}
</script>

<template>
  <div class="code-output">
    <!-- Toolbar -->
    <div class="output-toolbar">
      <div class="toolbar-left">
        <span class="toolbar-title">Output</span>
        <span
          v-if="displayStatus === 'running'"
          class="status-badge status-badge--running"
        >
          Running...
        </span>
        <span
          v-else-if="displayStatus === 'success'"
          class="status-badge status-badge--success"
        >
          &#x2714; {{ formatDuration(displayResult?.duration ?? 0) }}
        </span>
        <span
          v-else-if="displayStatus === 'error'"
          class="status-badge status-badge--error"
        >
          &#x2716; Error
        </span>
        <span
          v-else-if="displayStatus === 'timeout'"
          class="status-badge status-badge--timeout"
        >
          &#x23F1; Timeout
        </span>
      </div>
      <div class="toolbar-right">
        <button
          v-if="history.length > 0"
          class="toolbar-btn"
          title="Clear history"
          @click="clearHistory"
        >
          &#x1F5D1; Clear
        </button>
      </div>
    </div>

    <!-- History tabs -->
    <div v-if="history.length > 1" class="history-tabs">
      <button
        :class="['history-tab', { 'history-tab--active': activeHistoryId === null }]"
        @click="activeHistoryId = null"
      >
        Live
      </button>
      <button
        v-for="entry in history"
        :key="entry.id"
        :class="[
          'history-tab',
          `history-tab--${entry.result.status}`,
          { 'history-tab--active': activeHistoryId === entry.id },
        ]"
        :title="`Run #${entry.id} — ${formatTime(entry.timestamp)}`"
        @click="selectHistory(entry.id)"
      >
        #{{ entry.id }}
      </button>
    </div>

    <!-- Terminal output area -->
    <div ref="outputEl" class="output-terminal">
      <!-- Idle state -->
      <div v-if="displayStatus === 'idle' && displayOutput.length === 0" class="output-placeholder">
        Run your code to see output here...
      </div>

      <!-- Running spinner -->
      <div v-if="props.status === 'running' && activeHistoryId === null" class="output-running">
        <span class="spinner"></span>
        Executing...
      </div>

      <!-- Output entries -->
      <div
        v-for="(entry, idx) in displayOutput"
        :key="idx"
        :class="['output-entry', outputClass(entry.type)]"
      >
        <span class="output-prefix">{{ outputPrefix[entry.type] || '\u276F' }}</span>
        <span class="output-content">{{ entry.content }}</span>
      </div>

      <!-- Error block -->
      <div v-if="displayError" class="output-error-block">
        <div
          class="error-message"
          :class="{ 'error-message--clickable': displayError.line }"
          @click="handleErrorLineClick"
        >
          <span class="error-icon">&#x2716;</span>
          <span>{{ displayError.message }}</span>
          <span v-if="displayError.line" class="error-location">
            (line {{ displayError.line }}{{ displayError.column ? `:${displayError.column}` : '' }})
          </span>
        </div>

        <!-- Stack trace -->
        <div v-if="stackFrames.length" class="stack-trace">
          <div class="stack-header">Stack Trace:</div>
          <div
            v-for="(frame, idx) in stackFrames"
            :key="idx"
            :class="['stack-frame', { 'stack-frame--clickable': frame.isClickable }]"
            @click="handleStackClick(frame)"
          >
            {{ frame.text }}
          </div>
        </div>
      </div>

      <!-- Duration footer -->
      <div v-if="displayResult && displayStatus !== 'idle' && displayStatus !== 'running'" class="output-footer">
        Completed in {{ formatDuration(displayResult.duration) }}
        &mdash; {{ displayOutput.length }} output{{ displayOutput.length !== 1 ? 's' : '' }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.code-output {
  border: 1px solid var(--vp-c-divider, #e2e2e3);
  border-radius: 8px;
  overflow: hidden;
  font-family: var(--vp-font-family-mono, 'Menlo', 'Monaco', 'Consolas', monospace);
  font-size: 0.85em;
  background: #1e1e1e;
  color: #d4d4d4;
}

/* ── Toolbar ─────────────────────────────────────────── */
.output-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 12px;
  background: #2d2d2d;
  border-bottom: 1px solid #404040;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.toolbar-title {
  font-weight: 600;
  color: #ccc;
  font-family: var(--vp-font-family-base, sans-serif);
  font-size: 0.9em;
}

.toolbar-right {
  display: flex;
  gap: 8px;
}

.toolbar-btn {
  padding: 2px 8px;
  border: 1px solid #555;
  border-radius: 4px;
  background: transparent;
  color: #aaa;
  cursor: pointer;
  font-size: 0.85em;
  transition: all 0.15s;
}

.toolbar-btn:hover {
  background: #404040;
  color: #fff;
}

/* ── Status badges ───────────────────────────────────── */
.status-badge {
  font-size: 0.8em;
  padding: 1px 8px;
  border-radius: 10px;
  font-family: var(--vp-font-family-base, sans-serif);
}

.status-badge--running {
  background: #2a4a7f;
  color: #7cb3ff;
}

.status-badge--success {
  background: #1a3a2a;
  color: #4ec9b0;
}

.status-badge--error {
  background: #4a1a1a;
  color: #f48771;
}

.status-badge--timeout {
  background: #4a3a1a;
  color: #dcdcaa;
}

/* ── History tabs ────────────────────────────────────── */
.history-tabs {
  display: flex;
  gap: 2px;
  padding: 4px 8px;
  background: #252525;
  border-bottom: 1px solid #404040;
  overflow-x: auto;
}

.history-tab {
  padding: 2px 10px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: #888;
  cursor: pointer;
  font-size: 0.8em;
  font-family: var(--vp-font-family-mono, monospace);
  transition: all 0.15s;
  white-space: nowrap;
}

.history-tab:hover {
  background: #333;
  color: #ccc;
}

.history-tab--active {
  background: #404040;
  color: #fff;
}

.history-tab--success {
  border-bottom: 2px solid #4ec9b0;
}

.history-tab--error {
  border-bottom: 2px solid #f48771;
}

.history-tab--timeout {
  border-bottom: 2px solid #dcdcaa;
}

/* ── Terminal area ───────────────────────────────────── */
.output-terminal {
  padding: 10px 12px;
  max-height: 300px;
  overflow-y: auto;
  min-height: 60px;
}

.output-placeholder {
  color: #666;
  font-style: italic;
  text-align: center;
  padding: 20px 0;
  font-family: var(--vp-font-family-base, sans-serif);
}

/* ── Running state ───────────────────────────────────── */
.output-running {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #7cb3ff;
  padding: 4px 0;
}

.spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid #7cb3ff;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ── Output entries ──────────────────────────────────── */
.output-entry {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 2px 0;
  line-height: 1.5;
}

.output-prefix {
  flex-shrink: 0;
  width: 16px;
  text-align: center;
  user-select: none;
}

.output-content {
  white-space: pre-wrap;
  word-break: break-all;
}

.output-entry--log {
  color: #d4d4d4;
}

.output-entry--log .output-prefix {
  color: #569cd6;
}

.output-entry--warn {
  color: #dcdcaa;
  background: rgba(220, 220, 170, 0.06);
}

.output-entry--warn .output-prefix {
  color: #dcdcaa;
}

.output-entry--error {
  color: #f48771;
  background: rgba(244, 135, 113, 0.06);
}

.output-entry--error .output-prefix {
  color: #f48771;
}

.output-entry--info {
  color: #9cdcfe;
}

.output-entry--info .output-prefix {
  color: #9cdcfe;
}

.output-entry--result {
  color: #4ec9b0;
}

.output-entry--result .output-prefix {
  color: #4ec9b0;
}

/* ── Error block ─────────────────────────────────────── */
.output-error-block {
  margin-top: 8px;
  border: 1px solid #6e2020;
  border-radius: 4px;
  background: rgba(110, 32, 32, 0.15);
  overflow: hidden;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  color: #f48771;
  font-weight: 600;
}

.error-message--clickable {
  cursor: pointer;
  transition: background 0.15s;
}

.error-message--clickable:hover {
  background: rgba(244, 135, 113, 0.1);
}

.error-icon {
  flex-shrink: 0;
}

.error-location {
  color: #d7ba7d;
  font-weight: normal;
  font-size: 0.9em;
}

/* ── Stack trace ─────────────────────────────────────── */
.stack-trace {
  padding: 8px 12px;
  border-top: 1px solid #6e2020;
  font-size: 0.9em;
}

.stack-header {
  color: #888;
  margin-bottom: 4px;
  font-weight: 600;
}

.stack-frame {
  padding: 2px 0 2px 16px;
  color: #888;
  line-height: 1.6;
}

.stack-frame--clickable {
  color: #569cd6;
  cursor: pointer;
  text-decoration: underline;
  text-decoration-style: dotted;
}

.stack-frame--clickable:hover {
  color: #9cdcfe;
  background: rgba(86, 156, 214, 0.08);
}

/* ── Footer ──────────────────────────────────────────── */
.output-footer {
  margin-top: 8px;
  padding-top: 6px;
  border-top: 1px solid #333;
  color: #666;
  font-size: 0.85em;
  font-family: var(--vp-font-family-base, sans-serif);
}

/* ── Scrollbar ───────────────────────────────────────── */
.output-terminal::-webkit-scrollbar {
  width: 8px;
}

.output-terminal::-webkit-scrollbar-track {
  background: #1e1e1e;
}

.output-terminal::-webkit-scrollbar-thumb {
  background: #444;
  border-radius: 4px;
}

.output-terminal::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
