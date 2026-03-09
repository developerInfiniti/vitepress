<script setup lang="ts">
import { computed } from 'vue'
import type { TsDiagnostic, TypeCheckResult, HoverInfo, CompletionItem } from '../types/typechecker'

const props = defineProps<{
  /** TypeScript check result with diagnostics */
  result: TypeCheckResult
  /** Whether type checking is enabled */
  enabled: boolean
  /** Whether TS compiler is available in the browser */
  isAvailable: boolean
  /** Current hover info (shown as tooltip) */
  hoverInfo?: HoverInfo | null
  /** Current autocomplete suggestions */
  completions?: CompletionItem[]
}>()

const emit = defineEmits<{
  (e: 'toggle-enabled', value: boolean): void
  (e: 'go-to-line', line: number, column: number): void
  (e: 'select-completion', item: CompletionItem): void
}>()

const sortedDiagnostics = computed(() => {
  return [...props.result.diagnostics].sort((a, b) => {
    const order = { error: 0, warning: 1, suggestion: 2, message: 3 }
    return order[a.severity] - order[b.severity] || a.line - b.line
  })
})

const severityIcon: Record<string, string> = {
  error: '\u2716',
  warning: '\u26A0',
  suggestion: '\u{1F4A1}',
  message: '\u2139',
}

const kindIcon: Record<string, string> = {
  function: '\u0192',
  method: '\u0192',
  variable: 'x',
  constant: 'C',
  property: '\u25CB',
  class: '\u25C6',
  interface: 'I',
  type: 'T',
  enum: 'E',
  module: 'M',
  keyword: 'K',
  unknown: '?',
}
</script>

<template>
  <div class="ts-panel">
    <!-- Header -->
    <div class="ts-header">
      <div class="ts-title">
        <span class="ts-logo">TS</span>
        <span>TypeScript</span>
        <label class="ts-toggle">
          <input
            type="checkbox"
            :checked="enabled"
            :disabled="!isAvailable"
            @change="emit('toggle-enabled', ($event.target as HTMLInputElement).checked)"
          />
          <span class="toggle-label">{{ enabled ? 'ON' : 'OFF' }}</span>
        </label>
      </div>
      <div v-if="!isAvailable" class="ts-unavailable">
        TypeScript not loaded
      </div>
      <div v-else-if="enabled" class="ts-summary">
        <span v-if="result.errorCount" class="ts-count ts-count--error">
          {{ severityIcon.error }} {{ result.errorCount }}
        </span>
        <span v-if="result.warningCount" class="ts-count ts-count--warning">
          {{ severityIcon.warning }} {{ result.warningCount }}
        </span>
        <span
          v-if="!result.errorCount && !result.warningCount"
          class="ts-count ts-count--ok"
        >
          &#x2714; No type errors
        </span>
      </div>
    </div>

    <!-- Hover tooltip (shown above diagnostics when active) -->
    <div v-if="hoverInfo" class="ts-hover">
      <div class="hover-type">{{ hoverInfo.type }}</div>
      <div v-if="hoverInfo.documentation" class="hover-docs">{{ hoverInfo.documentation }}</div>
    </div>

    <!-- Autocomplete list -->
    <div v-if="completions && completions.length" class="ts-completions">
      <div class="completions-header">Completions</div>
      <div
        v-for="(item, idx) in completions"
        :key="idx"
        class="completion-item"
        @click="emit('select-completion', item)"
      >
        <span :class="['completion-kind', `completion-kind--${item.kind}`]">
          {{ kindIcon[item.kind] || '?' }}
        </span>
        <span class="completion-name">{{ item.name }}</span>
        <span v-if="item.type" class="completion-type">{{ item.type }}</span>
      </div>
    </div>

    <!-- Diagnostics list -->
    <div v-if="enabled && isAvailable && sortedDiagnostics.length" class="ts-diagnostics">
      <div
        v-for="(diag, idx) in sortedDiagnostics"
        :key="idx"
        :class="['ts-diag-item', `ts-diag-item--${diag.severity}`]"
        @click="emit('go-to-line', diag.line, diag.column)"
      >
        <span class="diag-severity">{{ severityIcon[diag.severity] }}</span>
        <span class="diag-location">{{ diag.line }}:{{ diag.column }}</span>
        <span class="diag-message">{{ diag.message }}</span>
        <span class="diag-code">TS{{ diag.code }}</span>
      </div>
    </div>

    <div v-else-if="enabled && isAvailable" class="ts-empty">
      No type errors found.
    </div>
  </div>
</template>

<style scoped>
.ts-panel {
  border: 1px solid var(--vp-c-divider, #e2e2e3);
  border-radius: 8px;
  background: var(--vp-c-bg-soft, #f9f9f9);
  overflow: hidden;
  font-size: 0.85em;
}

/* ── Header ──────────────────────────────────────────── */
.ts-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: var(--vp-c-bg-alt, #f1f1f1);
  border-bottom: 1px solid var(--vp-c-divider, #e2e2e3);
}

.ts-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.ts-logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  background: #3178c6;
  color: #fff;
  border-radius: 4px;
  font-size: 0.7em;
  font-weight: 700;
}

.ts-toggle {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  font-weight: normal;
  font-size: 0.85em;
}

.ts-toggle input {
  cursor: pointer;
}

.ts-toggle input:disabled {
  cursor: not-allowed;
}

.toggle-label {
  color: var(--vp-c-text-2, #666);
}

.ts-unavailable {
  color: var(--vp-c-text-3, #999);
  font-size: 0.85em;
  font-style: italic;
}

.ts-summary {
  display: flex;
  gap: 12px;
}

.ts-count {
  font-weight: 600;
  font-size: 0.9em;
}

.ts-count--error {
  color: var(--vp-c-danger-1, #e53e3e);
}

.ts-count--warning {
  color: var(--vp-c-warning-1, #dd6b20);
}

.ts-count--ok {
  color: var(--vp-c-brand-1, #3eaf7c);
}

/* ── Hover tooltip ───────────────────────────────────── */
.ts-hover {
  padding: 8px 12px;
  background: #1e1e1e;
  border-bottom: 1px solid #404040;
  font-family: var(--vp-font-family-mono, monospace);
}

.hover-type {
  color: #9cdcfe;
  font-size: 0.9em;
  white-space: pre-wrap;
}

.hover-docs {
  margin-top: 4px;
  color: #808080;
  font-size: 0.85em;
  font-family: var(--vp-font-family-base, sans-serif);
}

/* ── Autocomplete ────────────────────────────────────── */
.ts-completions {
  max-height: 160px;
  overflow-y: auto;
  border-bottom: 1px solid var(--vp-c-divider, #e2e2e3);
}

.completions-header {
  padding: 4px 12px;
  font-size: 0.8em;
  color: var(--vp-c-text-3, #999);
  background: var(--vp-c-bg-alt, #f1f1f1);
  font-weight: 600;
}

.completion-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  cursor: pointer;
  transition: background 0.1s;
}

.completion-item:hover {
  background: var(--vp-c-bg-elv, #fff);
}

.completion-kind {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  font-size: 0.75em;
  font-weight: 700;
  background: #ddd;
  color: #555;
}

.completion-kind--function,
.completion-kind--method {
  background: #7b3db5;
  color: #fff;
}

.completion-kind--variable,
.completion-kind--constant {
  background: #3178c6;
  color: #fff;
}

.completion-kind--class {
  background: #dd6b20;
  color: #fff;
}

.completion-kind--interface,
.completion-kind--type {
  background: #2ea043;
  color: #fff;
}

.completion-kind--keyword {
  background: #888;
  color: #fff;
}

.completion-name {
  flex: 1;
  color: var(--vp-c-text-1, #333);
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.9em;
}

.completion-type {
  flex-shrink: 0;
  color: var(--vp-c-text-3, #999);
  font-size: 0.8em;
  font-family: var(--vp-font-family-mono, monospace);
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ── Diagnostics ─────────────────────────────────────── */
.ts-diagnostics {
  max-height: 200px;
  overflow-y: auto;
}

.ts-diag-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  cursor: pointer;
  transition: background 0.15s;
  border-bottom: 1px solid var(--vp-c-divider, #e2e2e3);
}

.ts-diag-item:last-child {
  border-bottom: none;
}

.ts-diag-item:hover {
  background: var(--vp-c-bg-elv, #fff);
}

.ts-diag-item--error {
  border-left: 3px solid var(--vp-c-danger-1, #e53e3e);
}

.ts-diag-item--warning {
  border-left: 3px solid var(--vp-c-warning-1, #dd6b20);
}

.ts-diag-item--suggestion {
  border-left: 3px solid #3178c6;
}

.ts-diag-item--message {
  border-left: 3px solid var(--vp-c-text-3, #999);
}

.diag-severity {
  flex-shrink: 0;
  width: 16px;
  text-align: center;
}

.ts-diag-item--error .diag-severity {
  color: var(--vp-c-danger-1, #e53e3e);
}

.ts-diag-item--warning .diag-severity {
  color: var(--vp-c-warning-1, #dd6b20);
}

.ts-diag-item--suggestion .diag-severity {
  color: #3178c6;
}

.diag-location {
  flex-shrink: 0;
  min-width: 40px;
  color: var(--vp-c-text-3, #999);
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.9em;
}

.diag-message {
  flex: 1;
  color: var(--vp-c-text-1, #333);
}

.diag-code {
  flex-shrink: 0;
  color: var(--vp-c-text-3, #999);
  font-size: 0.8em;
  font-family: var(--vp-font-family-mono, monospace);
}

.ts-empty {
  padding: 12px;
  text-align: center;
  color: var(--vp-c-text-3, #999);
  font-style: italic;
}
</style>
