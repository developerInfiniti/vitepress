<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import CodeEditor from './CodeEditor.vue'
import CodeOutput from './CodeOutput.vue'
import { usePlaygroundService } from '../services/playground-service'
import type { PlaygroundLanguage } from '../types/playground'
import './shared-demo-styles.css'

interface CodePlaygroundProps {
  /** Initial code to display */
  initialCode?: string
  /** Programming language */
  language?: PlaygroundLanguage
  /** Title shown in the header */
  title?: string
  /** Editor height */
  editorHeight?: string
  /** Show/hide the output panel */
  showOutput?: boolean
  /** Execution timeout in ms */
  timeout?: number
}

const props = withDefaults(defineProps<CodePlaygroundProps>(), {
  initialCode: '// Write your code here\nconsole.log("Hello, World!")',
  language: 'javascript',
  title: 'Code Playground',
  editorHeight: '250px',
  showOutput: true,
  timeout: 5000,
})

const code = ref(props.initialCode)
const editorRef = ref<InstanceType<typeof CodeEditor> | null>(null)

const { status, result, execute, abort, reset, dispose } = usePlaygroundService({
  timeout: props.timeout,
})

async function handleRun(sourceCode: string) {
  code.value = sourceCode
  await execute(sourceCode)
}

function handleReset() {
  reset()
  code.value = props.initialCode
  editorRef.value?.setCode(props.initialCode)
}

function handleAbort() {
  abort()
}

function handleClear() {
  reset()
}

function handleGoToLine(line: number, column: number) {
  // CodeEditor uses Monaco — could use revealLineInCenter
  // For now, this serves as an event passthrough
}

onUnmounted(() => {
  dispose()
})
</script>

<template>
  <div class="playground-wrapper">
    <!-- Header -->
    <div class="playground-header">
      <h3 class="playground-title">{{ title }}</h3>
      <div class="playground-actions">
        <button
          v-if="status === 'running'"
          class="action-btn action-btn--stop"
          @click="handleAbort"
        >
          Stop
        </button>
        <button
          class="action-btn action-btn--reset"
          @click="handleReset"
          :disabled="status === 'running'"
        >
          Reset
        </button>
        <button
          class="action-btn action-btn--run"
          @click="handleRun(code)"
          :disabled="status === 'running'"
        >
          {{ status === 'running' ? 'Running...' : 'Run' }}
        </button>
      </div>
    </div>

    <!-- Editor -->
    <CodeEditor
      ref="editorRef"
      v-model="code"
      :language="language"
      :height="editorHeight"
      @run="handleRun"
    />

    <!-- Output -->
    <div v-if="showOutput" class="playground-output">
      <CodeOutput
        :result="result"
        :status="status"
        @go-to-line="handleGoToLine"
        @clear="handleClear"
      />
    </div>
  </div>
</template>

<style scoped>
.playground-wrapper {
  border: 2px solid var(--vp-c-brand-1, #3eaf7c);
  border-radius: 12px;
  overflow: hidden;
  margin: 20px 0;
  background: var(--vp-c-bg, #fff);
}

.playground-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  background: var(--vp-c-bg-soft, #f9f9f9);
  border-bottom: 1px solid var(--vp-c-divider, #e2e2e3);
}

.playground-title {
  margin: 0;
  font-size: 1em;
  color: var(--vp-c-text-1, #333);
}

.playground-actions {
  display: flex;
  gap: 6px;
}

.action-btn {
  padding: 4px 14px;
  border: 1px solid var(--vp-c-divider, #e2e2e3);
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85em;
  font-weight: 600;
  transition: all 0.15s;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-btn--run {
  background: var(--vp-c-brand-1, #3eaf7c);
  color: #fff;
  border-color: var(--vp-c-brand-1, #3eaf7c);
}

.action-btn--run:hover:not(:disabled) {
  opacity: 0.85;
}

.action-btn--stop {
  background: var(--vp-c-danger-1, #e53e3e);
  color: #fff;
  border-color: var(--vp-c-danger-1, #e53e3e);
}

.action-btn--stop:hover {
  opacity: 0.85;
}

.action-btn--reset {
  background: transparent;
  color: var(--vp-c-text-2, #666);
}

.action-btn--reset:hover:not(:disabled) {
  background: var(--vp-c-bg-alt, #f1f1f1);
}

.playground-output {
  border-top: 1px solid var(--vp-c-divider, #e2e2e3);
}

@media (max-width: 640px) {
  .playground-header {
    flex-direction: column;
    gap: 8px;
    align-items: stretch;
  }

  .playground-actions {
    justify-content: flex-end;
  }
}
</style>
