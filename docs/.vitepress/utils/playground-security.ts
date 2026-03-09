/**
 * Security utilities for code playground.
 * Provides code sanitization and blocked API detection
 * to prevent dangerous operations in user-submitted code.
 */

/** APIs that are blocked in the playground sandbox */
const BLOCKED_GLOBALS = [
  'fetch',
  'XMLHttpRequest',
  'WebSocket',
  'EventSource',
  'importScripts',
  'eval',
  'Function',
  'localStorage',
  'sessionStorage',
  'indexedDB',
  'document',
  'window',
  'globalThis',
  'self',
  'top',
  'parent',
  'frames',
  'opener',
  'navigator',
  'location',
  'history',
] as const

/** Patterns that indicate potentially dangerous code */
const DANGEROUS_PATTERNS: ReadonlyArray<{ pattern: RegExp; reason: string }> = [
  { pattern: /import\s*\(/, reason: 'Dynamic imports are not allowed' },
  { pattern: /require\s*\(/, reason: 'require() is not allowed' },
  { pattern: /new\s+Worker\s*\(/, reason: 'Creating Workers is not allowed' },
  { pattern: /new\s+SharedWorker\s*\(/, reason: 'Creating SharedWorkers is not allowed' },
  { pattern: /new\s+ServiceWorker\s*\(/, reason: 'Creating ServiceWorkers is not allowed' },
  { pattern: /\.cookie\b/, reason: 'Accessing cookies is not allowed' },
  { pattern: /\.postMessage\s*\(/, reason: 'postMessage is not allowed' },
]

export interface SecurityCheckResult {
  safe: boolean
  violations: string[]
}

/**
 * Check code for potentially dangerous patterns.
 * Returns a list of violations found.
 */
export function checkCodeSecurity(code: string): SecurityCheckResult {
  const violations: string[] = []

  for (const { pattern, reason } of DANGEROUS_PATTERNS) {
    if (pattern.test(code)) {
      violations.push(reason)
    }
  }

  return {
    safe: violations.length === 0,
    violations,
  }
}

/**
 * Build a string that shadows blocked globals with undefined,
 * used as a preamble inside the worker execution context.
 */
export function buildSandboxPreamble(): string {
  const shadows = BLOCKED_GLOBALS
    .map(name => `${name} = undefined`)
    .join(', ')

  return `'use strict'; let ${shadows};\n`
}

/**
 * Wrap user code with sandbox preamble and console capture (sync version).
 * The wrapped code runs inside a function scope for isolation.
 */
export function wrapCodeForExecution(code: string): string {
  const preamble = buildSandboxPreamble()
  return `
(function() {
  ${preamble}
  const __output = [];
  const __console = {
    log: (...args) => __output.push({ type: 'log', content: args.map(String).join(' '), timestamp: Date.now() }),
    warn: (...args) => __output.push({ type: 'warn', content: args.map(String).join(' '), timestamp: Date.now() }),
    error: (...args) => __output.push({ type: 'error', content: args.map(String).join(' '), timestamp: Date.now() }),
    info: (...args) => __output.push({ type: 'info', content: args.map(String).join(' '), timestamp: Date.now() }),
  };
  const console = __console;

  try {
    ${code}
    return { output: __output, error: null };
  } catch (e) {
    return {
      output: __output,
      error: {
        message: e.message || String(e),
        stack: e.stack || '',
      }
    };
  }
})();
`
}

/**
 * Wrap user code for async execution with streaming console output.
 * Uses an async IIFE to support top-level await and Promise-based code.
 * Console calls are streamed via __onOutput callback for real-time display.
 */
export function wrapCodeForAsyncExecution(code: string, useStreaming: boolean): string {
  // Build sandbox preamble WITHOUT 'use strict' to avoid conflicts with user code
  // using arguments, eval, etc. in user-submitted code
  const shadows = BLOCKED_GLOBALS
    .map(name => `${name} = undefined`)
    .join(', ')
  const preamble = `let ${shadows};`

  const outputMethod = useStreaming
    ? `__onOutput(entry)`
    : `__output.push(entry)`

  return `
(async function() {
  ${preamble}
  const __output = [];
  function __emit(type, args) {
    const entry = { type, content: args.map(__serialize).join(' '), timestamp: Date.now() };
    ${outputMethod};
    __output.push(entry);
  }
  function __serialize(val) {
    if (val === undefined) return 'undefined';
    if (val === null) return 'null';
    if (typeof val === 'object') {
      try { return JSON.stringify(val, null, 2); } catch { return String(val); }
    }
    return String(val);
  }
  const console = {
    log: (...args) => __emit('log', args),
    warn: (...args) => __emit('warn', args),
    error: (...args) => __emit('error', args),
    info: (...args) => __emit('info', args),
    table: (data) => __emit('log', [typeof data === 'object' ? JSON.stringify(data, null, 2) : String(data)]),
    dir: (obj) => __emit('log', [typeof obj === 'object' ? JSON.stringify(obj, null, 2) : String(obj)]),
    time: () => {},
    timeEnd: () => {},
    clear: () => {},
  };
  const setTimeout = (fn, ms) => { return __setTimeout(fn, Math.min(ms, 3000)); };
  const setInterval = undefined;

  try {
    ${code}
    return { output: __output, error: null };
  } catch (e) {
    return {
      output: __output,
      error: {
        message: e.message || String(e),
        line: typeof e.lineNumber === 'number' ? e.lineNumber : undefined,
        column: typeof e.columnNumber === 'number' ? e.columnNumber : undefined,
        stack: e.stack || '',
      }
    };
  }
})();
`
}
