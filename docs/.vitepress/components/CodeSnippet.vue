<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import CodeOutput from './CodeOutput.vue'
import { usePlaygroundService } from '../services/playground-service'
import type { PlaygroundLanguage } from '../types/playground'

interface Props {
  /** Code to display and run */
  code: string
  /** Programming language */
  language?: PlaygroundLanguage
  /** Title for the snippet */
  title?: string
  /** Whether to show line numbers */
  lineNumbers?: boolean
  /** Auto-run code on mount */
  autoRun?: boolean
  /** Show output panel */
  showOutput?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  language: 'javascript',
  title: '',
  lineNumbers: true,
  autoRun: false,
  showOutput: true,
})

const { status, result, execute, reset, dispose } = usePlaygroundService({ timeout: 5000 })
const hasRun = ref(false)

const codeLines = computed(() => props.code.trim().split('\n'))

async function runCode() {
  hasRun.value = true
  await execute(props.code)
}

function handleClear() {
  reset()
  hasRun.value = false
}

if (props.autoRun) {
  runCode()
}

onUnmounted(() => {
  dispose()
})
</script>

<template>
  <div class="snippet-wrapper">
    <!-- Header -->
    <div v-if="title || true" class="snippet-header">
      <div class="snippet-header__left">
        <span v-if="title" class="snippet-title">{{ title }}</span>
        <span class="snippet-lang" :class="`snippet-lang--${language}`">
          {{ language === 'typescript' ? 'TypeScript' : 'JavaScript' }}
        </span>
      </div>
      <div class="snippet-header__right">
        <button
          class="snippet-btn snippet-btn--run"
          :disabled="status === 'running'"
          @click="runCode"
        >
          {{ status === 'running' ? 'Running...' : 'Run' }}
        </button>
      </div>
    </div>

    <!-- Code display (read-only) -->
    <div class="snippet-code">
      <pre class="snippet-pre"><code><template v-for="(line, i) in codeLines" :key="i"><span v-if="lineNumbers" class="snippet-line-number">{{ i + 1 }}</span><span class="snippet-line-content">{{ line }}</span>
</template></code></pre>
    </div>

    <!-- Output -->
    <div v-if="showOutput && hasRun" class="snippet-output">
      <CodeOutput
        :result="result"
        :status="status"
        @clear="handleClear"
      />
    </div>
  </div>
</template>

<style scoped>
.snippet-wrapper {
  border: 1px solid var(--vp-c-divider, #e2e2e3);
  border-radius: 8px;
  overflow: hidden;
  margin: 16px 0;
  background: var(--vp-c-bg, #fff);
}

.snippet-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 14px;
  background: var(--vp-c-bg-soft, #f9f9f9);
  border-bottom: 1px solid var(--vp-c-divider, #e2e2e3);
}

.snippet-header__left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.snippet-header__right {
  display: flex;
  gap: 6px;
}

.snippet-title {
  font-weight: 600;
  font-size: 0.9em;
  color: var(--vp-c-text-1);
}

.snippet-lang {
  padding: 1px 8px;
  border-radius: 4px;
  font-size: 0.75em;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.snippet-lang--javascript {
  background: #f7df1e;
  color: #333;
}

.snippet-lang--typescript {
  background: #3178c6;
  color: white;
}

.snippet-btn {
  padding: 4px 14px;
  border: 1px solid var(--vp-c-divider, #e2e2e3);
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.82em;
  font-weight: 600;
  transition: all 0.15s;
}

.snippet-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.snippet-btn--run {
  background: var(--vp-c-brand-1, #3eaf7c);
  color: #fff;
  border-color: var(--vp-c-brand-1, #3eaf7c);
}

.snippet-btn--run:hover:not(:disabled) {
  opacity: 0.85;
}

/* Code display */
.snippet-code {
  background: #1e1e1e;
  overflow-x: auto;
}

.snippet-pre {
  margin: 0;
  padding: 12px 0;
  font-family: var(--vp-font-family-mono, 'Menlo', 'Monaco', 'Consolas', monospace);
  font-size: 0.88em;
  line-height: 1.7;
  color: #d4d4d4;
}

.snippet-pre code {
  display: block;
}

.snippet-line-number {
  display: inline-block;
  width: 36px;
  text-align: right;
  padding-right: 12px;
  color: #636d83;
  user-select: none;
  font-size: 0.9em;
}

.snippet-line-content {
  white-space: pre;
}

/* Output */
.snippet-output {
  border-top: 1px solid var(--vp-c-divider, #e2e2e3);
}
</style>
