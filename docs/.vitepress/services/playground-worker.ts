/**
 * Web Worker for isolated code execution.
 * This file runs inside a Web Worker context.
 *
 * Communication protocol:
 * - Receives WorkerRequest messages with code to execute
 * - Sends back WorkerResponse messages with results/output/errors
 */

import type { WorkerRequest, WorkerResponse, ExecutionResult, OutputEntry } from '../types/playground'
import { wrapCodeForExecution } from '../utils/playground-security'

/** Handle incoming messages from the main thread */
self.onmessage = (event: MessageEvent<WorkerRequest>) => {
  const { type, id, code, config } = event.data

  if (type !== 'execute') return

  const startTime = performance.now()

  try {
    const wrappedCode = wrapCodeForExecution(code)

    // Execute with indirect eval for isolated scope
    const indirectEval = eval
    const result = indirectEval(wrappedCode) as {
      output: OutputEntry[]
      error: { message: string; stack: string } | null
    }

    const duration = Math.round(performance.now() - startTime)

    if (result.error) {
      const response: WorkerResponse = {
        type: 'result',
        id,
        data: {
          status: 'error',
          output: result.output,
          error: {
            message: result.error.message,
            stack: result.error.stack,
          },
          duration,
        } satisfies ExecutionResult,
      }
      self.postMessage(response)
    } else {
      const response: WorkerResponse = {
        type: 'result',
        id,
        data: {
          status: 'success',
          output: result.output.slice(0, config.maxOutputEntries),
          error: null,
          duration,
        } satisfies ExecutionResult,
      }
      self.postMessage(response)
    }
  } catch (e: unknown) {
    const duration = Math.round(performance.now() - startTime)
    const error = e instanceof Error ? e : new Error(String(e))

    const response: WorkerResponse = {
      type: 'result',
      id,
      data: {
        status: 'error',
        output: [],
        error: {
          message: error.message,
          stack: error.stack,
        },
        duration,
      } satisfies ExecutionResult,
    }
    self.postMessage(response)
  }
}
