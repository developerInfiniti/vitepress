import { ref, watch, type Ref } from 'vue'
import type {
  TsDiagnostic,
  TsDiagnosticSeverity,
  TypeCheckResult,
  CompletionItem,
  CompletionKind,
  HoverInfo,
} from '../types/typechecker'

/**
 * Minimal in-browser TypeScript type checker using the TypeScript compiler API.
 *
 * Uses ts.createLanguageService() with a cached ScriptSnapshot host
 * for fast incremental diagnostics, autocomplete, and hover info.
 *
 * TypeScript must be loaded in the browser (via CDN or bundled).
 * Falls back gracefully if `window.ts` is not available.
 */

// TypeScript compiler API type shims (loaded at runtime via CDN)
interface TsApi {
  createLanguageService(host: any, registry?: any): any
  createDocumentRegistry(): any
  ScriptSnapshot: { fromString(text: string): any }
  ScriptTarget: { Latest: number }
  ModuleKind: { ESNext: number }
  JsxEmit: { None: number }
  DiagnosticCategory: {
    Error: number
    Warning: number
    Suggestion: number
    Message: number
  }
  ScriptKind: { TS: number; JS: number }
  flattenDiagnosticMessageText(msg: any, newLine: string): string
  displayPartsToString(parts: any[]): string
}

/** Detect if TypeScript API is available globally */
function getTs(): TsApi | null {
  if (typeof window !== 'undefined' && (window as any).ts) {
    return (window as any).ts as TsApi
  }
  return null
}

const VIRTUAL_FILE = 'playground.ts'

/** Map TS DiagnosticCategory to our severity */
function mapSeverity(category: number, ts: TsApi): TsDiagnosticSeverity {
  switch (category) {
    case ts.DiagnosticCategory.Error: return 'error'
    case ts.DiagnosticCategory.Warning: return 'warning'
    case ts.DiagnosticCategory.Suggestion: return 'suggestion'
    default: return 'message'
  }
}

/** Map TS ScriptElementKind string to CompletionKind */
function mapCompletionKind(kind: string): CompletionKind {
  const mapping: Record<string, CompletionKind> = {
    'function': 'function',
    'method': 'method',
    'property': 'property',
    'var': 'variable',
    'let': 'variable',
    'const': 'constant',
    'local var': 'variable',
    'parameter': 'variable',
    'class': 'class',
    'interface': 'interface',
    'type': 'type',
    'enum': 'enum',
    'module': 'module',
    'keyword': 'keyword',
  }
  return mapping[kind] ?? 'unknown'
}

/** Create a LanguageService host with cached script snapshots */
function createServiceHost(ts: TsApi, getCode: () => string) {
  let version = 0
  let currentSnapshot: any = null
  let lastCode = ''

  const compilerOptions = {
    target: ts.ScriptTarget.Latest,
    module: ts.ModuleKind.ESNext,
    jsx: ts.JsxEmit.None,
    strict: true,
    noEmit: true,
    allowJs: true,
    checkJs: false,
    esModuleInterop: true,
    moduleResolution: 2, // NodeJs
    lib: ['lib.es2022.d.ts', 'lib.dom.d.ts'],
  }

  function getSnapshot() {
    const code = getCode()
    if (code !== lastCode) {
      lastCode = code
      version++
      currentSnapshot = ts.ScriptSnapshot.fromString(code)
    }
    return currentSnapshot
  }

  return {
    getScriptFileNames: () => [VIRTUAL_FILE],
    getScriptVersion: () => String(version),
    getScriptSnapshot: (fileName: string) => {
      if (fileName === VIRTUAL_FILE) return getSnapshot()
      return undefined
    },
    getCurrentDirectory: () => '/',
    getCompilationSettings: () => compilerOptions,
    getDefaultLibFileName: () => 'lib.d.ts',
    fileExists: (fileName: string) => fileName === VIRTUAL_FILE,
    readFile: () => undefined,
    readDirectory: () => [],
    directoryExists: () => true,
    getDirectories: () => [],
  }
}

/** Convert character offset to line/column (1-based) */
function offsetToLineCol(code: string, offset: number): { line: number; column: number } {
  const lines = code.slice(0, offset).split('\n')
  return {
    line: lines.length,
    column: (lines[lines.length - 1]?.length ?? 0) + 1,
  }
}

/**
 * Composable for TypeScript type checking, autocomplete, and hover info.
 *
 * @param code - Reactive ref containing TypeScript source code
 * @param options - Configuration options
 */
export function useTypeChecker(
  code: Ref<string>,
  options: {
    /** Debounce delay in ms (default 300) */
    debounceMs?: number
    /** Enable/disable type checking (default true) */
    enabled?: boolean
  } = {},
) {
  const { debounceMs = 300, enabled: initialEnabled = true } = options

  const result = ref<TypeCheckResult>({
    diagnostics: [],
    errorCount: 0,
    warningCount: 0,
  })
  const isChecking = ref(false)
  const enabled = ref(initialEnabled)
  const isAvailable = ref(false)

  let languageService: any = null
  let debounceTimer: ReturnType<typeof setTimeout> | null = null
  const ts = getTs()

  // Initialize language service if TS is available
  if (ts) {
    isAvailable.value = true
    const host = createServiceHost(ts, () => code.value)
    const registry = ts.createDocumentRegistry()
    languageService = ts.createLanguageService(host, registry)
  }

  /** Run type checking and update diagnostics */
  function check() {
    if (!enabled.value || !languageService || !ts) return

    isChecking.value = true

    try {
      const semanticDiags = languageService.getSemanticDiagnostics(VIRTUAL_FILE) ?? []
      const syntacticDiags = languageService.getSyntacticDiagnostics(VIRTUAL_FILE) ?? []
      const allDiags = [...syntacticDiags, ...semanticDiags]

      const diagnostics: TsDiagnostic[] = allDiags.map((d: any) => {
        const start = d.start ?? 0
        const { line, column } = offsetToLineCol(code.value, start)
        const length = d.length ?? 0
        const endPos = offsetToLineCol(code.value, start + length)

        return {
          code: d.code,
          message: ts.flattenDiagnosticMessageText(d.messageText, '\n'),
          severity: mapSeverity(d.category, ts),
          line,
          column,
          endLine: endPos.line,
          endColumn: endPos.column,
          length,
        }
      })

      diagnostics.sort((a, b) => a.line - b.line || a.column - b.column)

      result.value = {
        diagnostics,
        errorCount: diagnostics.filter(d => d.severity === 'error').length,
        warningCount: diagnostics.filter(d => d.severity === 'warning').length,
      }
    } catch {
      // Silently handle TS service errors
    } finally {
      isChecking.value = false
    }
  }

  function debouncedCheck() {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(check, debounceMs)
  }

  /**
   * Get autocomplete suggestions at a given character offset (0-based).
   */
  function getCompletions(offset: number): CompletionItem[] {
    if (!languageService || !ts) return []

    try {
      const completions = languageService.getCompletionsAtPosition(VIRTUAL_FILE, offset, {})
      if (!completions?.entries) return []

      return completions.entries
        .slice(0, 50) // Limit results
        .map((entry: any, idx: number) => ({
          name: entry.name,
          kind: mapCompletionKind(entry.kind),
          sortPriority: entry.sortText ? parseInt(entry.sortText, 10) : idx,
          type: undefined,
          documentation: undefined,
        }))
    } catch {
      return []
    }
  }

  /**
   * Get detailed info for a completion item (type + docs).
   */
  function getCompletionDetails(name: string, offset: number): CompletionItem | null {
    if (!languageService || !ts) return null

    try {
      const details = languageService.getCompletionEntryDetails(
        VIRTUAL_FILE, offset, name, undefined, undefined, undefined, undefined
      )
      if (!details) return null

      return {
        name: details.name,
        kind: mapCompletionKind(details.kind),
        type: details.displayParts
          ? ts.displayPartsToString(details.displayParts)
          : undefined,
        documentation: details.documentation
          ? ts.displayPartsToString(details.documentation)
          : undefined,
        sortPriority: 0,
      }
    } catch {
      return null
    }
  }

  /**
   * Get hover/tooltip info at a given character offset (0-based).
   */
  function getHoverInfo(offset: number): HoverInfo | null {
    if (!languageService || !ts) return null

    try {
      const info = languageService.getQuickInfoAtPosition(VIRTUAL_FILE, offset)
      if (!info) return null

      const { line, column } = offsetToLineCol(code.value, info.textSpan.start)

      return {
        type: info.displayParts
          ? ts.displayPartsToString(info.displayParts)
          : '',
        documentation: info.documentation
          ? ts.displayPartsToString(info.documentation)
          : undefined,
        line,
        column,
        length: info.textSpan.length,
      }
    } catch {
      return null
    }
  }

  /** Get diagnostics for a specific line (1-based) */
  function getDiagnosticsForLine(line: number): TsDiagnostic[] {
    return result.value.diagnostics.filter(d => d.line === line)
  }

  /** Toggle type checking on/off */
  function setEnabled(value: boolean) {
    enabled.value = value
    if (value) {
      check()
    } else {
      result.value = { diagnostics: [], errorCount: 0, warningCount: 0 }
    }
  }

  // Watch for code changes and re-check with debounce
  watch(code, debouncedCheck, { immediate: true })

  return {
    // State
    result,
    isChecking,
    enabled,
    isAvailable,

    // Actions
    check,
    getCompletions,
    getCompletionDetails,
    getHoverInfo,
    getDiagnosticsForLine,
    setEnabled,
  }
}
