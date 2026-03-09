/**
 * Code Executor Web Worker
 *
 * Provides isolated, sandboxed execution of JavaScript code with:
 * - Full async/await and Promise support
 * - Streaming console output (real-time log delivery to main thread)
 * - Configurable timeout with proper cleanup
 * - Error handling with line/column info when available
 * - Sandboxed environment (blocked network, DOM, storage APIs)
 *
 * Communication protocol:
 *   Main -> Worker:  ExecutorRequest  (execute | abort)
 *   Worker -> Main:  ExecutorResponse (output | result | error)
 */

import type {
  PlaygroundConfig,
  OutputEntry,
  ExecutionResult,
  ExecutionError,
} from '../types/playground'
import { wrapCodeForAsyncExecution } from '../utils/playground-security'

/** Request message from main thread */
interface ExecutorRequest {
  type: 'execute' | 'abort'
  id: string
  code?: string
  config?: PlaygroundConfig
}

/** Response message to main thread */
interface ExecutorResponse {
  type: 'output' | 'result' | 'error'
  id: string
  data: OutputEntry | ExecutionResult | ExecutionError
}

/** Currently running execution ID (for abort support) */
let activeExecutionId: string | null = null

/** Send a message back to the main thread */
function respond(msg: ExecutorResponse) {
  self.postMessage(msg)
}

/** Stream a single output entry to the main thread in real-time */
function streamOutput(id: string, entry: OutputEntry) {
  respond({ type: 'output', id, data: entry })
}

/** Send the final execution result */
function sendResult(id: string, result: ExecutionResult) {
  respond({ type: 'result', id, data: result })
}

/**
 * Execute user code in a sandboxed async context.
 *
 * The code is wrapped in an async IIFE with:
 * - Blocked dangerous globals (shadowed to undefined)
 * - Replaced console that streams output entries
 * - Limited setTimeout (max 3s delay, no setInterval)
 * - try/catch for error capture
 */
async function executeCode(id: string, code: string, config: PlaygroundConfig) {
  activeExecutionId = id
  const startTime = performance.now()
  const collectedOutput: OutputEntry[] = []

  // Callback for streaming console output from wrapped code
  const onOutput = (entry: OutputEntry) => {
    if (activeExecutionId !== id) return
    if (collectedOutput.length < config.maxOutputEntries) {
      collectedOutput.push(entry)
      streamOutput(id, entry)
    }
  }

  // Provide a safe setTimeout that respects sandbox limits
  const safeSetTimeout = (fn: (...args: unknown[]) => void, ms: number) => {
    const clampedMs = Math.min(Math.max(0, ms), 3000)
    return setTimeout(fn, clampedMs)
  }

  try {
    const wrappedCode = wrapCodeForAsyncExecution(code, true)

    // Build the execution function with streaming callbacks injected
    // We use Function constructor here intentionally for sandbox isolation —
    // the security layer has already validated the code and shadowed dangerous globals
    // Remove trailing }); from wrappedCode to avoid syntax error
    const fnBody = wrappedCode.endsWith('});')
      ? wrappedCode.slice(0, -2)
      : wrappedCode

    const executorFn = new Function(
      '__onOutput',
      '__setTimeout',
      `return (${fnBody})(__onOutput, __setTimeout)`
    )

    const result = await executorFn(onOutput, safeSetTimeout)
    const duration = Math.round(performance.now() - startTime)

    // Check if this execution was aborted while running
    if (activeExecutionId !== id) return

    // Default result structure if undefined
    const safeResult = result || { output: collectedOutput, error: null }

    if (safeResult.error) {
      sendResult(id, {
        status: 'error',
        output: collectedOutput,
        error: {
          message: safeResult.error.message,
          line: safeResult.error.line,
          column: safeResult.error.column,
          stack: safeResult.error.stack,
        },
        duration,
      })
    } else {
      sendResult(id, {
        status: 'success',
        output: collectedOutput,
        error: null,
        duration,
      })
    }
  } catch (e: unknown) {
    const duration = Math.round(performance.now() - startTime)

    if (activeExecutionId !== id) return

    const error = e instanceof Error ? e : new Error(String(e))

    sendResult(id, {
      status: 'error',
      output: collectedOutput,
      error: {
        message: error.message,
        stack: error.stack,
      },
      duration,
    })
  } finally {
    if (activeExecutionId === id) {
      activeExecutionId = null
    }
  }
}

/** Handle incoming messages from the main thread */
self.onmessage = (event: MessageEvent<ExecutorRequest>) => {
  const { type, id, code, config } = event.data

  switch (type) {
    case 'execute':
      if (!code || !config) return
      executeCode(id, code, config)
      break

    case 'abort':
      // Mark current execution as cancelled
      if (activeExecutionId === id || !id) {
        activeExecutionId = null
      }
      break
  }
}
