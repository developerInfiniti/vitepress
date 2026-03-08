import { ref } from 'vue'

export type LogType = 'info' | 'success' | 'error' | 'pending' | 'value' | 'done' | 'lifecycle' | 'watch' | 'effect' | 'action'

export interface LogEntry {
  time: string
  message: string
  type: LogType
}

export function useLog(maxEntries = 30) {
  const logEntries = ref<LogEntry[]>([])

  function addLog(message: string, type: LogType = 'info') {
    const time = new Date().toLocaleTimeString()
    logEntries.value.push({ time, message, type })
    if (logEntries.value.length > maxEntries) {
      logEntries.value = logEntries.value.slice(-maxEntries)
    }
  }

  function clearLogs() {
    logEntries.value = []
  }

  return {
    logEntries,
    addLog,
    clearLogs,
  }
}
