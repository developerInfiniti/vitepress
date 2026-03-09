/**
 * Playground Service — manages code execution via Web Workers.
 *
 * Provides:
 * - Isolated code execution in a Web Worker (code-executor)
 * - Async/await and Promise support
 * - Streaming console output (real-time log delivery)
 * - Timeout handling with worker termination
 * - Security checks before execution
 * - Execution result management
 */

import { ref, shallowRef } from 'vue'
import type {
  ExecutionResult,
  ExecutionStatus,
  OutputEntry,
  PlaygroundConfig,
} from '../types/playground'
import { DEFAULT_PLAYGROUND_CONFIG } from '../types/playground'
import { checkCodeSecurity } from '../utils/playground-security'

let idCounter = 0

function generateId(): string {
  return `exec-${++idCounter}-${Date.now()}`
}

/** Response shape from the code-executor worker */
interface ExecutorResponse {
  type: 'output' | 'result' | 'error'
  id: string
  data: OutputEntry | ExecutionResult
}

/**
 * Create a playground service instance.
 * Each instance manages its own worker lifecycle and execution state.
 * Uses the code-executor worker for async-capable sandboxed execution.
 */
export function usePlaygroundService(configOverrides: Partial<PlaygroundConfig> = {}) {
  const config: PlaygroundConfig = { ...DEFAULT_PLAYGROUND_CONFIG, ...configOverrides }

  const status = ref<ExecutionStatus>('idle')
  const result = shallowRef<ExecutionResult | null>(null)
  const output = ref<OutputEntry[]>([])
  const isRunning = ref(false)

  let worker: Worker | null = null
  let currentExecutionId: string | null = null
  let timeoutHandle: ReturnType<typeof setTimeout> | null = null

  /** Initialize the code-executor Web Worker (lazy, created on first execution) */
  function ensureWorker(): Worker {
    if (!worker) {
      worker = new Worker(
        new URL('../workers/code-executor.worker.ts', import.meta.url),
        { type: 'module' }
      )
    }
    return worker
  }

  /** Clean up timeout and reset execution tracking */
  function cleanupExecution() {
    if (timeoutHandle) {
      clearTimeout(timeoutHandle)
      timeoutHandle = null
    }
    currentExecutionId = null
    isRunning.value = false
  }

  /** Terminate the worker and clean up all state */
  function dispose() {
    cleanupExecution()
    if (worker) {
      worker.terminate()
      worker = null
    }
    status.value = 'idle'
    result.value = null
    output.value = []
  }

  /**
   * Execute code in the sandbox.
   * Supports async/await and Promises. Console output is streamed in real-time
   * to the `output` ref for immediate UI updates.
   */
  function execute(code: string): Promise<ExecutionResult> {
    // Security check
    const securityCheck = checkCodeSecurity(code)
    if (!securityCheck.safe) {
      const securityResult: ExecutionResult = {
        status: 'error',
        output: [],
        error: {
          message: `Security violation: ${securityCheck.violations.join('; ')}`,
        },
        duration: 0,
      }
      result.value = securityResult
      status.value = 'error'
      return Promise.resolve(securityResult)
    }

    // Abort any running execution
    if (isRunning.value) {
      abort()
    }

    const executionId = generateId()
    currentExecutionId = executionId
    status.value = 'running'
    isRunning.value = true
    result.value = null
    output.value = []

    return new Promise<ExecutionResult>((resolve) => {
      const w = ensureWorker()

      // Set up timeout
      timeoutHandle = setTimeout(() => {
        if (currentExecutionId === executionId) {
          const timeoutResult: ExecutionResult = {
            status: 'timeout',
            output: [...output.value],
            error: {
              message: `Execution timed out after ${config.timeout}ms`,
            },
            duration: config.timeout,
          }
          result.value = timeoutResult
          status.value = 'error'
          cleanupExecution()

          // Terminate and recreate worker on timeout
          w.terminate()
          worker = null

          resolve(timeoutResult)
        }
      }, config.timeout)

      // Listen for messages from the executor worker
      w.onmessage = (event: MessageEvent<ExecutorResponse>) => {
        const response = event.data

        if (response.id !== executionId) return

        switch (response.type) {
          // Streaming console output — update UI in real-time
          case 'output': {
            const entry = response.data as OutputEntry
            if (output.value.length < config.maxOutputEntries) {
              output.value = [...output.value, entry]
            }
            break
          }

          // Final execution result
          case 'result': {
            const execResult = response.data as ExecutionResult
            // Merge streamed output into result if result has empty output
            if (execResult.output.length === 0 && output.value.length > 0) {
              execResult.output = [...output.value]
            }
            result.value = execResult
            status.value = execResult.status === 'error' ? 'error' : 'success'
            cleanupExecution()
            resolve(execResult)
            break
          }

          // Worker-level error
          case 'error': {
            const errorResult: ExecutionResult = {
              status: 'error',
              output: [...output.value],
              error: response.data as ExecutionResult['error'],
              duration: 0,
            }
            result.value = errorResult
            status.value = 'error'
            cleanupExecution()
            resolve(errorResult)
            break
          }
        }
      }

      w.onerror = (error) => {
        if (currentExecutionId !== executionId) return

        const errorResult: ExecutionResult = {
          status: 'error',
          output: [...output.value],
          error: {
            message: error.message || 'Worker execution failed',
          },
          duration: 0,
        }
        result.value = errorResult
        status.value = 'error'
        cleanupExecution()

        // Recreate worker on error
        w.terminate()
        worker = null

        resolve(errorResult)
      }

      // Send code to the executor worker
      w.postMessage({
        type: 'execute',
        id: executionId,
        code,
        config,
      })
    })
  }

  /** Abort the current execution */
  function abort() {
    if (!isRunning.value) return

    // Try graceful abort first
    if (worker && currentExecutionId) {
      worker.postMessage({ type: 'abort', id: currentExecutionId })
    }

    cleanupExecution()
    status.value = 'idle'

    // Terminate and recreate worker to ensure code stops
    if (worker) {
      worker.terminate()
      worker = null
    }
  }

  /** Reset to initial state */
  function reset() {
    abort()
    result.value = null
    output.value = []
    status.value = 'idle'
  }

  return {
    // State
    status,
    result,
    output,
    isRunning,

    // Actions
    execute,
    abort,
    reset,
    dispose,
  }
}
