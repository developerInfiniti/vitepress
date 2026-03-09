import { computed } from 'vue'
import { useData } from 'vitepress'
import type { ResumeData } from '../data/resume/types'

const localeModules: Record<string, () => Promise<{ default: ResumeData }>> = {
  ru: () => import('../data/resume/ru'),
  uk: () => import('../data/resume/uk'),
  en: () => import('../data/resume/en'),
}

export function useResume() {
  const { lang } = useData()

  const locale = computed<'ru' | 'uk' | 'en'>(() => {
    const l = lang.value
    if (l === 'uk') return 'uk'
    if (l === 'en') return 'en'
    return 'ru'
  })

  async function loadResumeData(): Promise<ResumeData> {
    const loader = localeModules[locale.value] || localeModules.ru
    const mod = await loader()
    return mod.default
  }

  function exportPDF() {
    document.body.classList.add('resume-printing')
    requestAnimationFrame(() => {
      window.print()
      window.addEventListener('afterprint', () => {
        document.body.classList.remove('resume-printing')
      }, { once: true })
    })
  }

  return {
    locale,
    loadResumeData,
    exportPDF,
  }
}
