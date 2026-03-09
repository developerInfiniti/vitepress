/** Severity level of a lint diagnostic */
export type LintSeverity = 'error' | 'warning' | 'info'

/** A single lint diagnostic (error, warning, or info message) */
export interface LintDiagnostic {
  /** Rule identifier, e.g. "no-unused-vars" */
  ruleId: string
  /** Human-readable message describing the issue */
  message: string
  /** Severity level */
  severity: LintSeverity
  /** 1-based line number where the issue starts */
  line: number
  /** 1-based column number where the issue starts */
  column: number
  /** 1-based line number where the issue ends (optional) */
  endLine?: number
  /** 1-based column number where the issue ends (optional) */
  endColumn?: number
  /** Suggested fix, if available */
  fix?: LintFix
}

/** A suggested fix for a lint diagnostic */
export interface LintFix {
  /** Description of what the fix does */
  description: string
  /** The replacement text */
  replacement: string
  /** Start offset in the source code (0-based character index) */
  rangeStart: number
  /** End offset in the source code (0-based character index) */
  rangeEnd: number
}

/** Result of linting a piece of code */
export interface LintResult {
  diagnostics: LintDiagnostic[]
  /** Number of errors found */
  errorCount: number
  /** Number of warnings found */
  warningCount: number
  /** Number of info messages found */
  infoCount: number
}

/** A single lint rule definition */
export interface LintRule {
  /** Unique rule identifier */
  id: string
  /** Severity when rule is triggered */
  severity: LintSeverity
  /** Short description of the rule */
  description: string
  /** Function that checks code and returns diagnostics */
  check(code: string, lines: string[]): LintDiagnostic[]
}
