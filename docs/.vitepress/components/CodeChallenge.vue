<script setup lang="ts">
import { ref, computed } from 'vue'
import CodePlayground from './CodePlayground.vue'
import type { PlaygroundLanguage } from '../types/playground'
import './shared-demo-styles.css'

interface TestCase {
  /** Description of the test */
  label: string
  /** Code to run after user code to verify the solution */
  testCode: string
  /** Expected console output (trimmed) */
  expected: string
}

interface CodeChallengeProps {
  /** Challenge title */
  title?: string
  /** Challenge description / instructions */
  description?: string
  /** Starter code template */
  starterCode?: string
  /** Programming language */
  language?: PlaygroundLanguage
  /** Test cases for solution verification */
  tests?: TestCase[]
  /** Hint text (shown on demand) */
  hint?: string
  /** Difficulty level */
  difficulty?: 'easy' | 'medium' | 'hard'
  /** Editor height */
  editorHeight?: string
}

const props = withDefaults(defineProps<CodeChallengeProps>(), {
  title: 'Challenge',
  description: '',
  starterCode: '// Your solution here\n',
  language: 'javascript',
  tests: () => [],
  hint: '',
  difficulty: 'easy',
  editorHeight: '200px',
})

const showHint = ref(false)
const showSolution = ref(false)
const testResults = ref<Array<{ label: string; passed: boolean; error?: string }>>([])
const hasRun = ref(false)
const allPassed = computed(() => testResults.value.length > 0 && testResults.value.every(t => t.passed))

const difficultyLabel: Record<string, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
}

const difficultyColor: Record<string, string> = {
  easy: '#4ec9b0',
  medium: '#dcdcaa',
  hard: '#f48771',
}

function toggleHint() {
  showHint.value = !showHint.value
}

/**
 * Verify user solution by checking console output against expected values.
 * This is a simplified client-side check — real execution happens in CodePlayground.
 */
function runTests(code: string) {
  hasRun.value = true
  testResults.value = props.tests.map(test => {
    try {
      const outputs: string[] = []
      const mockConsole = {
        log: (...args: any[]) => outputs.push(args.map(String).join(' ')),
        error: (...args: any[]) => outputs.push(args.map(String).join(' ')),
        warn: (...args: any[]) => outputs.push(args.map(String).join(' ')),
        info: (...args: any[]) => outputs.push(args.map(String).join(' ')),
      }

      // Build test execution code
      const fullCode = `
        const console = arguments[0];
        ${code}
        ${test.testCode}
      `
      const fn = new Function(fullCode)
      fn(mockConsole)

      const actual = outputs.join('\n').trim()
      const passed = actual === test.expected.trim()

      return {
        label: test.label,
        passed,
        error: passed ? undefined : `Expected: "${test.expected.trim()}", Got: "${actual}"`,
      }
    } catch (e: any) {
      return {
        label: test.label,
        passed: false,
        error: e.message || 'Runtime error',
      }
    }
  })
}
</script>

<template>
  <div class="challenge-wrapper">
    <!-- Header -->
    <div class="challenge-header">
      <div class="challenge-title-row">
        <h3 class="challenge-title">{{ title }}</h3>
        <span
          class="difficulty-badge"
          :style="{ background: difficultyColor[difficulty], color: difficulty === 'easy' ? '#1a3a2a' : '#1e1e1e' }"
        >
          {{ difficultyLabel[difficulty] }}
        </span>
      </div>
      <p v-if="description" class="challenge-description">{{ description }}</p>
    </div>

    <!-- Playground -->
    <CodePlayground
      :initial-code="starterCode"
      :language="language"
      :title="''"
      :editor-height="editorHeight"
      :show-output="true"
    />

    <!-- Test section -->
    <div v-if="tests.length > 0" class="challenge-tests">
      <div class="tests-header">
        <span class="tests-title">Tests ({{ tests.length }})</span>
        <button class="tests-run-btn" @click="runTests(starterCode)">
          Run Tests
        </button>
      </div>

      <div v-if="hasRun" class="tests-results">
        <div
          v-for="(result, idx) in testResults"
          :key="idx"
          :class="['test-result', result.passed ? 'test-result--pass' : 'test-result--fail']"
        >
          <span class="test-icon">{{ result.passed ? '\u2714' : '\u2716' }}</span>
          <span class="test-label">{{ result.label }}</span>
          <span v-if="result.error" class="test-error">{{ result.error }}</span>
        </div>

        <div v-if="allPassed" class="tests-success">
          All tests passed!
        </div>
      </div>
    </div>

    <!-- Hint -->
    <div v-if="hint" class="challenge-hint-section">
      <button class="hint-toggle" @click="toggleHint">
        {{ showHint ? 'Hide Hint' : 'Show Hint' }}
      </button>
      <div v-if="showHint" class="hint-content">
        {{ hint }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.challenge-wrapper {
  border: 2px solid var(--vp-c-warning-1, #dd6b20);
  border-radius: 12px;
  overflow: hidden;
  margin: 20px 0;
  background: var(--vp-c-bg, #fff);
}

.challenge-header {
  padding: 14px 16px;
  background: var(--vp-c-bg-soft, #f9f9f9);
  border-bottom: 1px solid var(--vp-c-divider, #e2e2e3);
}

.challenge-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.challenge-title {
  margin: 0;
  font-size: 1.05em;
}

.difficulty-badge {
  padding: 2px 10px;
  border-radius: 10px;
  font-size: 0.75em;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.challenge-description {
  margin: 8px 0 0 0;
  color: var(--vp-c-text-2, #666);
  font-size: 0.9em;
  line-height: 1.5;
}

/* ── Tests ────────────────────────────────────────────── */
.challenge-tests {
  border-top: 1px solid var(--vp-c-divider, #e2e2e3);
  padding: 12px 16px;
}

.tests-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.tests-title {
  font-weight: 600;
  font-size: 0.9em;
  color: var(--vp-c-text-1, #333);
}

.tests-run-btn {
  padding: 4px 14px;
  border: 1px solid var(--vp-c-brand-1, #3eaf7c);
  border-radius: 6px;
  background: transparent;
  color: var(--vp-c-brand-1, #3eaf7c);
  cursor: pointer;
  font-size: 0.85em;
  font-weight: 600;
  transition: all 0.15s;
}

.tests-run-btn:hover {
  background: var(--vp-c-brand-1, #3eaf7c);
  color: #fff;
}

.test-result {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 4px 0;
  font-size: 0.9em;
}

.test-result--pass .test-icon {
  color: var(--vp-c-brand-1, #3eaf7c);
}

.test-result--fail .test-icon {
  color: var(--vp-c-danger-1, #e53e3e);
}

.test-label {
  font-weight: 500;
}

.test-error {
  color: var(--vp-c-danger-1, #e53e3e);
  font-size: 0.85em;
  font-family: var(--vp-font-family-mono, monospace);
}

.tests-success {
  margin-top: 8px;
  padding: 8px 12px;
  background: rgba(78, 201, 176, 0.1);
  border-radius: 6px;
  color: var(--vp-c-brand-1, #3eaf7c);
  font-weight: 600;
  text-align: center;
}

/* ── Hint ─────────────────────────────────────────────── */
.challenge-hint-section {
  border-top: 1px solid var(--vp-c-divider, #e2e2e3);
  padding: 10px 16px;
}

.hint-toggle {
  padding: 4px 12px;
  border: 1px solid var(--vp-c-divider, #e2e2e3);
  border-radius: 4px;
  background: transparent;
  color: var(--vp-c-text-2, #666);
  cursor: pointer;
  font-size: 0.85em;
  transition: all 0.15s;
}

.hint-toggle:hover {
  background: var(--vp-c-bg-alt, #f1f1f1);
}

.hint-content {
  margin-top: 8px;
  padding: 10px 14px;
  background: rgba(49, 120, 198, 0.06);
  border-radius: 6px;
  color: var(--vp-c-text-2, #666);
  font-size: 0.9em;
  line-height: 1.5;
  border-left: 3px solid #3178c6;
}
</style>
