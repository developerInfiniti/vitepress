/** Severity of a TypeScript diagnostic */
export type TsDiagnosticSeverity = 'error' | 'warning' | 'suggestion' | 'message'

/** A single TypeScript diagnostic (type error, warning, etc.) */
export interface TsDiagnostic {
  /** Diagnostic code (e.g. TS2322) */
  code: number
  /** Human-readable error message */
  message: string
  /** Severity level */
  severity: TsDiagnosticSeverity
  /** 1-based line number */
  line: number
  /** 1-based column number */
  column: number
  /** 1-based end line (optional) */
  endLine?: number
  /** 1-based end column (optional) */
  endColumn?: number
  /** Length of the error span in characters */
  length?: number
}

/** Result of type-checking a piece of code */
export interface TypeCheckResult {
  diagnostics: TsDiagnostic[]
  errorCount: number
  warningCount: number
}

/** A single autocomplete suggestion */
export interface CompletionItem {
  /** Display name */
  name: string
  /** Kind of symbol (function, variable, keyword, etc.) */
  kind: CompletionKind
  /** Type information string */
  type?: string
  /** Documentation/description */
  documentation?: string
  /** Sort priority (lower = higher priority) */
  sortPriority: number
}

/** Kind of completion item */
export type CompletionKind =
  | 'function'
  | 'variable'
  | 'keyword'
  | 'property'
  | 'method'
  | 'class'
  | 'interface'
  | 'type'
  | 'enum'
  | 'module'
  | 'constant'
  | 'unknown'

/** Hover/tooltip information for a position */
export interface HoverInfo {
  /** Type signature or declaration */
  type: string
  /** Documentation string */
  documentation?: string
  /** Start position (1-based line/column) */
  line: number
  column: number
  /** Span length */
  length: number
}
