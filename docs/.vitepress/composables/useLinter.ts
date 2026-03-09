import { ref, watch, type Ref } from 'vue'
import type { LintDiagnostic, LintResult, LintRule } from '../types/linter'

/**
 * Built-in lint rules for JavaScript / TypeScript playground code.
 * Each rule scans source text and returns diagnostics.
 */
const builtinRules: LintRule[] = [
  /* ── no-var ─────────────────────────────────────────── */
  {
    id: 'no-var',
    severity: 'warning',
    description: 'Disallow var declarations — use let or const',
    check(_code, lines) {
      const diags: LintDiagnostic[] = []
      const re = /\bvar\s+(\w+)/g
      for (let i = 0; i < lines.length; i++) {
        let m: RegExpExecArray | null
        re.lastIndex = 0
        while ((m = re.exec(lines[i])) !== null) {
          const varName = m[1]
          diags.push({
            ruleId: 'no-var',
            message: `Unexpected var, use let or const instead`,
            severity: 'warning',
            line: i + 1,
            column: m.index + 1,
            endColumn: m.index + m[0].length + 1,
            fix: {
              description: `Replace var with let`,
              replacement: `let ${varName}`,
              rangeStart: lines.slice(0, i).join('\n').length + (i > 0 ? 1 : 0) + m.index,
              rangeEnd: lines.slice(0, i).join('\n').length + (i > 0 ? 1 : 0) + m.index + m[0].length,
            },
          })
        }
      }
      return diags
    },
  },

  /* ── no-debugger ────────────────────────────────────── */
  {
    id: 'no-debugger',
    severity: 'error',
    description: 'Disallow debugger statements',
    check(_code, lines) {
      const diags: LintDiagnostic[] = []
      for (let i = 0; i < lines.length; i++) {
        const idx = lines[i].indexOf('debugger')
        if (idx !== -1 && /\bdebugger\b/.test(lines[i])) {
          diags.push({
            ruleId: 'no-debugger',
            message: 'Unexpected debugger statement',
            severity: 'error',
            line: i + 1,
            column: idx + 1,
            endColumn: idx + 9,
            fix: {
              description: 'Remove debugger statement',
              replacement: '',
              rangeStart: lines.slice(0, i).join('\n').length + (i > 0 ? 1 : 0) + idx,
              rangeEnd: lines.slice(0, i).join('\n').length + (i > 0 ? 1 : 0) + idx + 8,
            },
          })
        }
      }
      return diags
    },
  },

  /* ── no-alert ───────────────────────────────────────── */
  {
    id: 'no-alert',
    severity: 'warning',
    description: 'Disallow alert, confirm, and prompt',
    check(_code, lines) {
      const diags: LintDiagnostic[] = []
      const re = /\b(alert|confirm|prompt)\s*\(/g
      for (let i = 0; i < lines.length; i++) {
        let m: RegExpExecArray | null
        re.lastIndex = 0
        while ((m = re.exec(lines[i])) !== null) {
          diags.push({
            ruleId: 'no-alert',
            message: `Unexpected ${m[1]}() call`,
            severity: 'warning',
            line: i + 1,
            column: m.index + 1,
            endColumn: m.index + m[1].length + 1,
          })
        }
      }
      return diags
    },
  },

  /* ── no-console-error ───────────────────────────────── */
  {
    id: 'no-console-error',
    severity: 'info',
    description: 'Flag console.error calls for review',
    check(_code, lines) {
      const diags: LintDiagnostic[] = []
      const re = /\bconsole\.error\s*\(/g
      for (let i = 0; i < lines.length; i++) {
        let m: RegExpExecArray | null
        re.lastIndex = 0
        while ((m = re.exec(lines[i])) !== null) {
          diags.push({
            ruleId: 'no-console-error',
            message: 'console.error() — consider using console.warn() or proper error handling',
            severity: 'info',
            line: i + 1,
            column: m.index + 1,
            endColumn: m.index + 14,
          })
        }
      }
      return diags
    },
  },

  /* ── no-empty-function ──────────────────────────────── */
  {
    id: 'no-empty-function',
    severity: 'warning',
    description: 'Disallow empty function bodies',
    check(code) {
      const diags: LintDiagnostic[] = []
      const re = /function\s+\w*\s*\([^)]*\)\s*\{\s*\}/g
      const lines = code.split('\n')
      let m: RegExpExecArray | null
      while ((m = re.exec(code)) !== null) {
        const before = code.slice(0, m.index)
        const lineNum = before.split('\n').length
        const lastNewline = before.lastIndexOf('\n')
        const col = m.index - (lastNewline === -1 ? 0 : lastNewline + 1)
        diags.push({
          ruleId: 'no-empty-function',
          message: 'Empty function body — add implementation or a comment',
          severity: 'warning',
          line: lineNum,
          column: col + 1,
          endLine: lineNum,
          endColumn: col + m[0].length + 1,
        })
      }
      return diags
    },
  },

  /* ── eqeqeq ────────────────────────────────────────── */
  {
    id: 'eqeqeq',
    severity: 'warning',
    description: 'Require === and !== instead of == and !=',
    check(_code, lines) {
      const diags: LintDiagnostic[] = []
      // Match == or != but not === or !==
      const re = /(?<!=)(==|!=)(?!=)/g
      for (let i = 0; i < lines.length; i++) {
        let m: RegExpExecArray | null
        re.lastIndex = 0
        while ((m = re.exec(lines[i])) !== null) {
          const op = m[1]
          const strict = op === '==' ? '===' : '!=='
          const offset = lines.slice(0, i).join('\n').length + (i > 0 ? 1 : 0) + m.index
          diags.push({
            ruleId: 'eqeqeq',
            message: `Expected '${strict}' but found '${op}'`,
            severity: 'warning',
            line: i + 1,
            column: m.index + 1,
            endColumn: m.index + op.length + 1,
            fix: {
              description: `Replace '${op}' with '${strict}'`,
              replacement: strict,
              rangeStart: offset,
              rangeEnd: offset + op.length,
            },
          })
        }
      }
      return diags
    },
  },

  /* ── no-unreachable ─────────────────────────────────── */
  {
    id: 'no-unreachable',
    severity: 'error',
    description: 'Flag code after return/throw/break/continue statements',
    check(_code, lines) {
      const diags: LintDiagnostic[] = []
      const terminatorRe = /^\s*(return|throw|break|continue)\b/
      for (let i = 0; i < lines.length - 1; i++) {
        if (terminatorRe.test(lines[i])) {
          const nextLine = lines[i + 1]
          if (nextLine.trim() && !nextLine.trim().startsWith('}') && !nextLine.trim().startsWith('//')) {
            diags.push({
              ruleId: 'no-unreachable',
              message: 'Unreachable code detected',
              severity: 'error',
              line: i + 2,
              column: 1,
              endColumn: nextLine.length + 1,
            })
          }
        }
      }
      return diags
    },
  },

  /* ── no-constant-condition ──────────────────────────── */
  {
    id: 'no-constant-condition',
    severity: 'warning',
    description: 'Disallow constant conditions in if/while/for',
    check(_code, lines) {
      const diags: LintDiagnostic[] = []
      const re = /\b(if|while)\s*\(\s*(true|false|0|1|null|undefined)\s*\)/g
      for (let i = 0; i < lines.length; i++) {
        let m: RegExpExecArray | null
        re.lastIndex = 0
        while ((m = re.exec(lines[i])) !== null) {
          diags.push({
            ruleId: 'no-constant-condition',
            message: `Unexpected constant condition in ${m[1]}()`,
            severity: 'warning',
            line: i + 1,
            column: m.index + 1,
            endColumn: m.index + m[0].length + 1,
          })
        }
      }
      return diags
    },
  },
]

function runRules(code: string, rules: LintRule[]): LintResult {
  const lines = code.split('\n')
  const diagnostics: LintDiagnostic[] = []

  for (const rule of rules) {
    const found = rule.check(code, lines)
    diagnostics.push(...found)
  }

  diagnostics.sort((a, b) => a.line - b.line || a.column - b.column)

  return {
    diagnostics,
    errorCount: diagnostics.filter(d => d.severity === 'error').length,
    warningCount: diagnostics.filter(d => d.severity === 'warning').length,
    infoCount: diagnostics.filter(d => d.severity === 'info').length,
  }
}

/**
 * Composable for real-time lint validation with debounce.
 *
 * @param code - Reactive ref containing the source code to lint
 * @param options - Configuration options
 * @returns Reactive lint result, status, and control functions
 */
export function useLinter(
  code: Ref<string>,
  options: {
    /** Debounce delay in ms (default 300) */
    debounceMs?: number
    /** Enable/disable linting (default true) */
    enabled?: boolean
    /** Additional custom rules */
    customRules?: LintRule[]
  } = {},
) {
  const {
    debounceMs = 300,
    enabled: initialEnabled = true,
    customRules = [],
  } = options

  const result = ref<LintResult>({
    diagnostics: [],
    errorCount: 0,
    warningCount: 0,
    infoCount: 0,
  })
  const isLinting = ref(false)
  const enabled = ref(initialEnabled)

  const allRules = [...builtinRules, ...customRules]
  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  function lint() {
    if (!enabled.value) return
    isLinting.value = true
    result.value = runRules(code.value, allRules)
    isLinting.value = false
  }

  function debouncedLint() {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(lint, debounceMs)
  }

  /** Apply a fix to the source code */
  function applyFix(diagnostic: LintDiagnostic): string | null {
    if (!diagnostic.fix) return null
    const { rangeStart, rangeEnd, replacement } = diagnostic.fix
    const current = code.value
    return current.slice(0, rangeStart) + replacement + current.slice(rangeEnd)
  }

  /** Get diagnostics for a specific line (1-based) */
  function getDiagnosticsForLine(line: number): LintDiagnostic[] {
    return result.value.diagnostics.filter(d => d.line === line)
  }

  /** Toggle linting on/off */
  function setEnabled(value: boolean) {
    enabled.value = value
    if (value) {
      lint()
    } else {
      result.value = { diagnostics: [], errorCount: 0, warningCount: 0, infoCount: 0 }
    }
  }

  // Watch for code changes and re-lint with debounce
  watch(code, debouncedLint, { immediate: true })

  return {
    result,
    isLinting,
    enabled,
    lint,
    applyFix,
    getDiagnosticsForLine,
    setEnabled,
  }
}
