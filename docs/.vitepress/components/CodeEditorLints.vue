<script setup lang="ts">
import { computed } from 'vue'
import type { LintDiagnostic, LintResult } from '../types/linter'
import './shared-demo-styles.css'

const props = defineProps<{
  result: LintResult
  enabled: boolean
}>()

const emit = defineEmits<{
  (e: 'apply-fix', diagnostic: LintDiagnostic): void
  (e: 'toggle-enabled', value: boolean): void
  (e: 'go-to-line', line: number, column: number): void
}>()

const sortedDiagnostics = computed(() => {
  return [...props.result.diagnostics].sort((a, b) => {
    const severityOrder = { error: 0, warning: 1, info: 2 }
    return severityOrder[a.severity] - severityOrder[b.severity] || a.line - b.line
  })
})

const severityIcon: Record<string, string> = {
  error: '\u2716',
  warning: '\u26A0',
  info: '\u2139',
}

function handleApplyFix(diag: LintDiagnostic) {
  emit('apply-fix', diag)
}

function handleGoToLine(diag: LintDiagnostic) {
  emit('go-to-line', diag.line, diag.column)
}
</script>

<template>
  <div class="lints-panel">
    <!-- Header with toggle and counts -->
    <div class="lints-header">
      <div class="lints-title">
        <span class="lints-icon">&#x1F50D;</span>
        <span>Lint</span>
        <label class="lints-toggle">
          <input
            type="checkbox"
            :checked="enabled"
            @change="emit('toggle-enabled', ($event.target as HTMLInputElement).checked)"
          />
          <span class="toggle-label">{{ enabled ? 'ON' : 'OFF' }}</span>
        </label>
      </div>
      <div v-if="enabled" class="lints-summary">
        <span v-if="result.errorCount" class="lint-count lint-count--error">
          {{ severityIcon.error }} {{ result.errorCount }}
        </span>
        <span v-if="result.warningCount" class="lint-count lint-count--warning">
          {{ severityIcon.warning }} {{ result.warningCount }}
        </span>
        <span v-if="result.infoCount" class="lint-count lint-count--info">
          {{ severityIcon.info }} {{ result.infoCount }}
        </span>
        <span
          v-if="!result.errorCount && !result.warningCount && !result.infoCount"
          class="lint-count lint-count--ok"
        >
          &#x2714; No issues
        </span>
      </div>
    </div>

    <!-- Diagnostics list -->
    <div v-if="enabled && sortedDiagnostics.length" class="lints-list">
      <div
        v-for="(diag, idx) in sortedDiagnostics"
        :key="idx"
        :class="['lint-item', `lint-item--${diag.severity}`]"
        @click="handleGoToLine(diag)"
      >
        <span class="lint-severity">{{ severityIcon[diag.severity] }}</span>
        <span class="lint-location">{{ diag.line }}:{{ diag.column }}</span>
        <span class="lint-message">{{ diag.message }}</span>
        <span class="lint-rule">({{ diag.ruleId }})</span>
        <button
          v-if="diag.fix"
          class="lint-fix-btn"
          :title="diag.fix.description"
          @click.stop="handleApplyFix(diag)"
        >
          Fix
        </button>
      </div>
    </div>

    <div v-else-if="enabled" class="lints-empty">
      No lint issues found.
    </div>
  </div>
</template>

<style scoped>
.lints-panel {
  border: 1px solid var(--vp-c-divider, #e2e2e3);
  border-radius: 8px;
  background: var(--vp-c-bg-soft, #f9f9f9);
  overflow: hidden;
  font-size: 0.85em;
}

.lints-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: var(--vp-c-bg-alt, #f1f1f1);
  border-bottom: 1px solid var(--vp-c-divider, #e2e2e3);
}

.lints-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.lints-icon {
  font-size: 1em;
}

.lints-toggle {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  font-weight: normal;
  font-size: 0.85em;
}

.lints-toggle input {
  cursor: pointer;
}

.toggle-label {
  color: var(--vp-c-text-2, #666);
}

.lints-summary {
  display: flex;
  gap: 12px;
}

.lint-count {
  font-weight: 600;
  font-size: 0.9em;
}

.lint-count--error {
  color: var(--vp-c-danger-1, #e53e3e);
}

.lint-count--warning {
  color: var(--vp-c-warning-1, #dd6b20);
}

.lint-count--info {
  color: var(--vp-c-brand-1, #3eaf7c);
}

.lint-count--ok {
  color: var(--vp-c-brand-1, #3eaf7c);
}

.lints-list {
  max-height: 200px;
  overflow-y: auto;
}

.lint-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  cursor: pointer;
  transition: background 0.15s;
  border-bottom: 1px solid var(--vp-c-divider, #e2e2e3);
}

.lint-item:last-child {
  border-bottom: none;
}

.lint-item:hover {
  background: var(--vp-c-bg-elv, #fff);
}

.lint-item--error {
  border-left: 3px solid var(--vp-c-danger-1, #e53e3e);
}

.lint-item--warning {
  border-left: 3px solid var(--vp-c-warning-1, #dd6b20);
}

.lint-item--info {
  border-left: 3px solid var(--vp-c-brand-1, #3eaf7c);
}

.lint-severity {
  flex-shrink: 0;
  width: 16px;
  text-align: center;
}

.lint-item--error .lint-severity {
  color: var(--vp-c-danger-1, #e53e3e);
}

.lint-item--warning .lint-severity {
  color: var(--vp-c-warning-1, #dd6b20);
}

.lint-item--info .lint-severity {
  color: var(--vp-c-brand-1, #3eaf7c);
}

.lint-location {
  flex-shrink: 0;
  min-width: 40px;
  color: var(--vp-c-text-3, #999);
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.9em;
}

.lint-message {
  flex: 1;
  color: var(--vp-c-text-1, #333);
}

.lint-rule {
  flex-shrink: 0;
  color: var(--vp-c-text-3, #999);
  font-size: 0.85em;
}

.lint-fix-btn {
  flex-shrink: 0;
  padding: 2px 8px;
  border: 1px solid var(--vp-c-brand-1, #3eaf7c);
  border-radius: 4px;
  background: transparent;
  color: var(--vp-c-brand-1, #3eaf7c);
  cursor: pointer;
  font-size: 0.85em;
  font-weight: 600;
  transition: all 0.15s;
}

.lint-fix-btn:hover {
  background: var(--vp-c-brand-1, #3eaf7c);
  color: #fff;
}

.lints-empty {
  padding: 12px;
  text-align: center;
  color: var(--vp-c-text-3, #999);
  font-style: italic;
}
</style>
