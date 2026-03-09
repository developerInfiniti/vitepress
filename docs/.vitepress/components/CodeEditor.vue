<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, shallowRef, nextTick } from 'vue'
import { useData } from 'vitepress'
import type { PlaygroundLanguage } from '../types/playground'
import './shared-demo-styles.css'

interface CodeEditorProps {
  modelValue?: string
  language?: PlaygroundLanguage
  height?: string
  readOnly?: boolean
  minimap?: boolean
  lineNumbers?: boolean
  fontSize?: number
}

const props = withDefaults(defineProps<CodeEditorProps>(), {
  modelValue: '',
  language: 'javascript',
  height: '300px',
  readOnly: false,
  minimap: false,
  lineNumbers: true,
  fontSize: 14,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'run': [code: string]
  'format': []
  'editorReady': []
}>()

const { isDark } = useData()

const editorContainer = ref<HTMLDivElement | null>(null)
const editorInstance = shallowRef<any>(null)
const monacoRef = shallowRef<any>(null)
const isLoading = ref(true)
const loadError = ref<string | null>(null)
const diagnostics = ref<Array<{ message: string; severity: string; line: number }>>([])

let tsWorkerDisposables: any[] = []

const MONACO_VERSION = '0.52.2'
const MONACO_CDN = `https://cdn.jsdelivr.net/npm/monaco-editor@${MONACO_VERSION}`

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = src
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`))
    document.head.appendChild(script)
  })
}

async function loadMonaco(): Promise<any> {
  try {
    // Load AMD loader
    await loadScript(`${MONACO_CDN}/min/vs/loader.js`)

    const amdRequire = (window as any).require
    if (!amdRequire) throw new Error('AMD loader not available')

    amdRequire.config({
      paths: { vs: `${MONACO_CDN}/min/vs` },
    })

    return new Promise((resolve, reject) => {
      amdRequire(['vs/editor/editor.main'], (monaco: any) => {
        monacoRef.value = monaco
        resolve(monaco)
      }, (err: any) => {
        reject(err)
      })
    })
  } catch (e) {
    loadError.value = 'Failed to load Monaco Editor'
    throw e
  }
}

function configureTypeScript(monaco: any) {
  const tsDefaults = monaco.languages.typescript

  // JavaScript defaults
  tsDefaults.javascriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation: false,
  })

  tsDefaults.javascriptDefaults.setCompilerOptions({
    target: tsDefaults.ScriptTarget.ESNext,
    module: tsDefaults.ModuleKind.ESNext,
    allowNonTsExtensions: true,
    allowJs: true,
    checkJs: true,
    strict: false,
    noEmit: true,
    esModuleInterop: true,
    moduleResolution: tsDefaults.ModuleResolutionKind.NodeJs,
    lib: ['es2022', 'dom', 'dom.iterable'],
  })

  // TypeScript defaults
  tsDefaults.typescriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation: false,
  })

  tsDefaults.typescriptDefaults.setCompilerOptions({
    target: tsDefaults.ScriptTarget.ESNext,
    module: tsDefaults.ModuleKind.ESNext,
    allowNonTsExtensions: true,
    strict: true,
    noEmit: true,
    esModuleInterop: true,
    moduleResolution: tsDefaults.ModuleResolutionKind.NodeJs,
    jsx: tsDefaults.JsxEmit.React,
    lib: ['es2022', 'dom', 'dom.iterable'],
  })

  // Add common type definitions for better IntelliSense
  const commonTypes = `
    declare var console: {
      log(...args: any[]): void;
      error(...args: any[]): void;
      warn(...args: any[]): void;
      info(...args: any[]): void;
      table(data: any): void;
      clear(): void;
      time(label?: string): void;
      timeEnd(label?: string): void;
      group(label?: string): void;
      groupEnd(): void;
    };
    declare function setTimeout(callback: (...args: any[]) => void, ms?: number): number;
    declare function setInterval(callback: (...args: any[]) => void, ms?: number): number;
    declare function clearTimeout(id: number): void;
    declare function clearInterval(id: number): void;
    declare function fetch(input: string, init?: RequestInit): Promise<Response>;
    declare function alert(message?: string): void;
    declare function prompt(message?: string, defaultValue?: string): string | null;
  `

  tsDefaults.typescriptDefaults.addExtraLib(commonTypes, 'ts:common.d.ts')
  tsDefaults.javascriptDefaults.addExtraLib(commonTypes, 'ts:common.d.ts')
}

function setupDiagnostics(monaco: any, editor: any) {
  const updateDiagnostics = () => {
    const model = editor.getModel()
    if (!model) return

    const markers = monaco.editor.getModelMarkers({ resource: model.uri })
    diagnostics.value = markers
      .filter((m: any) => m.severity >= monaco.MarkerSeverity.Warning)
      .slice(0, 10)
      .map((m: any) => ({
        message: m.message,
        severity: m.severity === monaco.MarkerSeverity.Error ? 'error' : 'warning',
        line: m.startLineNumber,
      }))
  }

  const disposable = monaco.editor.onDidChangeMarkers(() => {
    updateDiagnostics()
  })

  tsWorkerDisposables.push(disposable)
}

async function initEditor() {
  if (!editorContainer.value) return

  try {
    const monaco = await loadMonaco()

    configureTypeScript(monaco)

    const fileExtension = props.language === 'typescript' ? 'ts' : 'js'
    const modelUri = monaco.Uri.parse(`file:///playground.${fileExtension}`)

    let model = monaco.editor.getModel(modelUri)
    if (model) {
      model.dispose()
    }
    model = monaco.editor.createModel(props.modelValue, props.language, modelUri)

    const editor = monaco.editor.create(editorContainer.value, {
      model,
      theme: isDark.value ? 'vs-dark' : 'vs',
      language: props.language,
      minimap: { enabled: props.minimap },
      lineNumbers: props.lineNumbers ? 'on' : 'off',
      fontSize: props.fontSize,
      readOnly: props.readOnly,
      automaticLayout: true,
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      tabSize: 2,
      insertSpaces: true,
      renderLineHighlight: 'line',
      cursorBlinking: 'smooth',
      smoothScrolling: true,
      padding: { top: 8, bottom: 8 },
      bracketPairColorization: { enabled: true },
      autoClosingBrackets: 'always',
      autoClosingQuotes: 'always',
      autoIndent: 'full',
      formatOnPaste: true,
      suggest: {
        showMethods: true,
        showFunctions: true,
        showConstructors: true,
        showFields: true,
        showVariables: true,
        showClasses: true,
        showStructs: true,
        showInterfaces: true,
        showModules: true,
        showProperties: true,
        showEvents: true,
        showOperators: true,
        showUnits: true,
        showValues: true,
        showConstants: true,
        showEnums: true,
        showEnumMembers: true,
        showKeywords: true,
        showWords: true,
        showColors: true,
        showFiles: true,
        showReferences: true,
        showSnippets: true,
        preview: true,
        showStatusBar: true,
      },
      quickSuggestions: {
        other: true,
        comments: false,
        strings: true,
      },
      parameterHints: { enabled: true },
      hover: { enabled: true, delay: 300 },
    })

    editorInstance.value = editor

    // Sync content changes
    const contentDisposable = editor.onDidChangeModelContent(() => {
      const value = editor.getValue()
      emit('update:modelValue', value)
    })
    tsWorkerDisposables.push(contentDisposable)

    // Format action (Shift+Alt+F)
    editor.addAction({
      id: 'format-code',
      label: 'Format Code',
      keybindings: [
        monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KeyF,
      ],
      run: () => {
        editor.getAction('editor.action.formatDocument')?.run()
        emit('format')
      },
    })

    // Run action (Ctrl+Enter)
    editor.addAction({
      id: 'run-code',
      label: 'Run Code',
      keybindings: [
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
      ],
      run: () => {
        emit('run', editor.getValue())
      },
    })

    setupDiagnostics(monaco, editor)

    isLoading.value = false
    emit('editorReady')
  } catch (e: any) {
    loadError.value = e.message || 'Failed to initialize editor'
    isLoading.value = false
  }
}

function formatCode() {
  editorInstance.value?.getAction('editor.action.formatDocument')?.run()
  emit('format')
}

function runCode() {
  const code = editorInstance.value?.getValue() || ''
  emit('run', code)
}

function getCode(): string {
  return editorInstance.value?.getValue() || ''
}

function setCode(value: string) {
  if (editorInstance.value) {
    editorInstance.value.setValue(value)
  }
}

// Watch for external value changes
watch(() => props.modelValue, (newVal) => {
  if (editorInstance.value && editorInstance.value.getValue() !== newVal) {
    editorInstance.value.setValue(newVal)
  }
})

// Watch for theme changes
watch(isDark, (dark) => {
  if (monacoRef.value) {
    monacoRef.value.editor.setTheme(dark ? 'vs-dark' : 'vs')
  }
})

// Watch for language changes
watch(() => props.language, (newLang) => {
  if (monacoRef.value && editorInstance.value) {
    const model = editorInstance.value.getModel()
    if (model) {
      monacoRef.value.editor.setModelLanguage(model, newLang)
    }
  }
})

onMounted(() => {
  nextTick(() => initEditor())
})

onUnmounted(() => {
  tsWorkerDisposables.forEach(d => d.dispose?.())
  tsWorkerDisposables = []
  editorInstance.value?.dispose()
  editorInstance.value = null
})

defineExpose({ formatCode, runCode, getCode, setCode })
</script>

<template>
  <div class="code-editor-wrapper">
    <!-- Loading state -->
    <div v-if="isLoading" class="code-editor-loading" :style="{ height: props.height }">
      <div class="loading-spinner"></div>
      <span>Loading editor...</span>
    </div>

    <!-- Error state -->
    <div v-else-if="loadError" class="code-editor-error" :style="{ height: props.height }">
      <span class="error-icon">!</span>
      <span>{{ loadError }}</span>
    </div>

    <!-- Editor container -->
    <div
      v-show="!isLoading && !loadError"
      ref="editorContainer"
      class="code-editor-container"
      :style="{ height: props.height }"
    ></div>

    <!-- Diagnostics panel -->
    <div v-if="diagnostics.length > 0" class="code-editor-diagnostics">
      <div
        v-for="(diag, i) in diagnostics"
        :key="i"
        class="diagnostic-entry"
        :class="`diagnostic-${diag.severity}`"
      >
        <span class="diagnostic-location">Ln {{ diag.line }}</span>
        <span class="diagnostic-message">{{ diag.message }}</span>
      </div>
    </div>

    <!-- Toolbar -->
    <div v-if="!isLoading && !loadError && !readOnly" class="code-editor-toolbar">
      <div class="toolbar-left">
        <span class="language-badge" :class="`lang-${props.language}`">
          {{ props.language === 'typescript' ? 'TS' : 'JS' }}
        </span>
        <span v-if="diagnostics.length > 0" class="diagnostic-count">
          {{ diagnostics.filter(d => d.severity === 'error').length }} errors,
          {{ diagnostics.filter(d => d.severity === 'warning').length }} warnings
        </span>
      </div>
      <div class="toolbar-right">
        <button class="toolbar-btn" @click="formatCode" title="Format (Shift+Alt+F)">
          Format
        </button>
        <button class="toolbar-btn toolbar-btn-run" @click="runCode" title="Run (Ctrl+Enter)">
          Run
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.code-editor-wrapper {
  border: 1px solid var(--vp-c-divider, #e2e2e3);
  border-radius: 8px;
  overflow: hidden;
  background: var(--vp-c-bg, #fff);
}

.code-editor-container {
  width: 100%;
  min-height: 150px;
}

/* Loading */
.code-editor-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: var(--vp-c-text-2, #666);
  font-size: 0.9em;
  background: #1e1e1e;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255,255,255,0.2);
  border-top-color: var(--vp-c-brand-1, #3eaf7c);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Error */
.code-editor-error {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #e74c3c;
  font-size: 0.9em;
  background: rgba(231, 76, 60, 0.05);
}

.error-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #e74c3c;
  color: white;
  font-weight: 700;
  font-size: 0.85em;
}

/* Toolbar */
.code-editor-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 12px;
  border-top: 1px solid var(--vp-c-divider, #e2e2e3);
  background: var(--vp-c-bg-soft, #f9f9f9);
  font-size: 0.82em;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.toolbar-right {
  display: flex;
  gap: 6px;
}

.language-badge {
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 700;
  font-size: 0.85em;
  letter-spacing: 0.5px;
}

.lang-javascript {
  background: #f7df1e;
  color: #333;
}

.lang-typescript {
  background: #3178c6;
  color: white;
}

.diagnostic-count {
  color: var(--vp-c-text-3, #999);
}

.toolbar-btn {
  padding: 4px 12px;
  border: 1px solid var(--vp-c-divider, #e2e2e3);
  border-radius: 4px;
  background: var(--vp-c-bg, white);
  color: var(--vp-c-text-1, #333);
  cursor: pointer;
  font-size: 0.9em;
  transition: background 0.2s, border-color 0.2s;
}

.toolbar-btn:hover {
  border-color: var(--vp-c-brand-1, #3eaf7c);
  background: var(--vp-c-bg-soft, #f9f9f9);
}

.toolbar-btn-run {
  background: var(--vp-c-brand-1, #3eaf7c);
  color: white;
  border-color: var(--vp-c-brand-1, #3eaf7c);
}

.toolbar-btn-run:hover {
  opacity: 0.85;
}

/* Diagnostics */
.code-editor-diagnostics {
  max-height: 100px;
  overflow-y: auto;
  border-top: 1px solid var(--vp-c-divider, #e2e2e3);
  background: #1e1e1e;
  padding: 4px 0;
}

.diagnostic-entry {
  display: flex;
  gap: 8px;
  padding: 2px 12px;
  font-family: 'Courier New', monospace;
  font-size: 0.78em;
  line-height: 1.5;
}

.diagnostic-error {
  color: #f48771;
}

.diagnostic-warning {
  color: #cca700;
}

.diagnostic-location {
  color: #858585;
  min-width: 45px;
  flex-shrink: 0;
}

.diagnostic-message {
  word-break: break-word;
}

@media (max-width: 640px) {
  .code-editor-toolbar {
    flex-direction: column;
    gap: 6px;
    align-items: stretch;
  }

  .toolbar-right {
    justify-content: flex-end;
  }
}
</style>
