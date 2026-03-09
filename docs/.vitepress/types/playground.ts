/** Supported languages in the playground */
export type PlaygroundLanguage = 'javascript' | 'typescript'

/** Execution status of a playground run */
export type ExecutionStatus = 'idle' | 'running' | 'success' | 'error' | 'timeout'

/** Type of output entry produced during execution */
export type OutputType = 'log' | 'warn' | 'error' | 'info' | 'result'

/** Single output entry from code execution */
export interface OutputEntry {
  type: OutputType
  content: string
  timestamp: number
}

/** Error details from code execution */
export interface ExecutionError {
  message: string
  line?: number
  column?: number
  stack?: string
}

/** Result of a single code execution */
export interface ExecutionResult {
  status: ExecutionStatus
  output: OutputEntry[]
  error: ExecutionError | null
  duration: number
}

/** Code snippet to execute */
export interface CodeSnippet {
  id: string
  code: string
  language: PlaygroundLanguage
  title?: string
}

/** Configuration for playground execution */
export interface PlaygroundConfig {
  /** Maximum execution time in milliseconds */
  timeout: number
  /** Maximum number of output entries to keep */
  maxOutputEntries: number
  /** Whether to capture console output */
  captureConsole: boolean
}

/** Default playground configuration */
export const DEFAULT_PLAYGROUND_CONFIG: PlaygroundConfig = {
  timeout: 5000,
  maxOutputEntries: 100,
  captureConsole: true,
}

/** Message sent to the execution worker */
export interface WorkerRequest {
  type: 'execute'
  id: string
  code: string
  config: PlaygroundConfig
}

/** Message received from the execution worker */
export interface WorkerResponse {
  type: 'result' | 'output' | 'error'
  id: string
  data: ExecutionResult | OutputEntry | ExecutionError
}
