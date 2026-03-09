# Архитектура резюме-страницы (Resume Page)

## 1. Обзор

Резюме-страница — многоязычная интерактивная страница с поддержкой PDF-экспорта.
Использует существующую i18n инфраструктуру VitePress (ru/uk) и добавляет en-локаль.

### Ключевые принципы
- **Данные отдельно от представления** — контент в JSON/TS файлах, компонент только рендерит
- **Переиспользование** — shared-demo-styles.css, useLog composable (при необходимости)
- **Print-first PDF** — используем `@media print` + `window.print()` вместо тяжёлых библиотек
- **Поддержка тёмной темы** — через CSS переменные VitePress (`var(--vp-c-*)`)

---

## 2. Структура файлов

```
docs/
├── resume/
│   └── index.md                    # RU резюме (root locale)
├── uk/resume/
│   └── index.md                    # UK резюме
├── en/resume/
│   └── index.md                    # EN резюме
├── .vitepress/
│   ├── components/
│   │   ├── ResumePage.vue          # Главный компонент резюме
│   │   └── resume/
│   │       ├── ResumeHeader.vue    # Фото, имя, контакты
│   │       ├── ResumeSection.vue   # Универсальная секция (опыт, навыки, и т.д.)
│   │       ├── ResumeSkills.vue    # Визуализация навыков (прогресс-бары)
│   │       ├── ResumeTimeline.vue  # Опыт работы / образование (timeline)
│   │       ├── ResumeProjects.vue  # Портфолио проектов с ссылками
│   │       └── print.css           # Стили для PDF/print
│   ├── data/
│   │   └── resume/
│   │       ├── types.ts            # TypeScript интерфейсы
│   │       ├── ru.ts               # Данные резюме — русский
│   │       ├── uk.ts               # Данные резюме — украинский
│   │       └── en.ts               # Данные резюме — английский
│   └── composables/
│       └── useResume.ts            # Composable: выбор локали, PDF экспорт
```

---

## 3. Типы данных (types.ts)

```typescript
export interface ResumeData {
  meta: ResumeMeta
  header: ResumeHeader
  summary: string
  experience: ExperienceItem[]
  education: EducationItem[]
  skills: SkillGroup[]
  projects: ProjectItem[]
  languages: LanguageItem[]
  certifications?: CertificationItem[]
}

export interface ResumeMeta {
  locale: 'ru' | 'uk' | 'en'
  lastUpdated: string
  pdfFileName: string        // e.g. "Resume_Zelenko_RU.pdf"
}

export interface ResumeHeader {
  name: string
  title: string              // "Frontend Developer"
  photo?: string             // путь к фото (опционально)
  contacts: ContactItem[]
}

export interface ContactItem {
  icon: string               // 'email' | 'phone' | 'github' | 'linkedin' | 'telegram' | 'location'
  label: string
  value: string
  link?: string              // href для кликабельных контактов
}

export interface ExperienceItem {
  company: string
  position: string
  period: string             // "2022 — настоящее время"
  location?: string
  description: string
  achievements: string[]
  stack: string[]
}

export interface EducationItem {
  institution: string
  degree: string
  period: string
  description?: string
}

export interface SkillGroup {
  category: string           // "Frontend", "Backend", "Tools"
  skills: { name: string; level: number }[]  // level: 0-100
}

export interface ProjectItem {
  name: string
  description: string
  stack: string[]
  links: { label: string; url: string }[]
  image?: string
}

export interface LanguageItem {
  language: string
  level: string              // "Native", "B2", "C1"
}

export interface CertificationItem {
  name: string
  issuer: string
  year: number
  link?: string
}
```

---

## 4. Composable: useResume.ts

```typescript
import { computed } from 'vue'
import { useData } from 'vitepress'
import type { ResumeData } from '../data/resume/types'

// Lazy-импорт данных по локали
const localeModules: Record<string, () => Promise<{ default: ResumeData }>> = {
  ru: () => import('../data/resume/ru'),
  uk: () => import('../data/resume/uk'),
  en: () => import('../data/resume/en'),
}

export function useResume() {
  const { lang } = useData()

  // Определяем текущую локаль
  const locale = computed(() => {
    const l = lang.value
    if (l === 'uk') return 'uk'
    if (l === 'en') return 'en'
    return 'ru'  // default
  })

  // Загрузка данных — async
  async function loadResumeData(): Promise<ResumeData> {
    const mod = await localeModules[locale.value]()
    return mod.default
  }

  // PDF экспорт через window.print()
  function exportPDF() {
    // Добавляем класс для print-стилей
    document.body.classList.add('resume-printing')

    // Даем браузеру время применить стили
    requestAnimationFrame(() => {
      window.print()
      // Убираем класс после печати
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
```

---

## 5. Главный компонент: ResumePage.vue

```vue
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useResume } from '../composables/useResume'
import type { ResumeData } from '../data/resume/types'
import ResumeHeader from './resume/ResumeHeader.vue'
import ResumeSection from './resume/ResumeSection.vue'
import ResumeSkills from './resume/ResumeSkills.vue'
import ResumeTimeline from './resume/ResumeTimeline.vue'
import ResumeProjects from './resume/ResumeProjects.vue'
import './resume/print.css'
import './shared-demo-styles.css'

const { locale, loadResumeData, exportPDF } = useResume()
const data = ref<ResumeData | null>(null)
const loading = ref(true)

async function load() {
  loading.value = true
  data.value = await loadResumeData()
  loading.value = false
}

onMounted(load)
watch(locale, load)

// Лейблы UI по локали
const labels = {
  ru: { download: 'Скачать PDF', experience: 'Опыт работы', education: 'Образование', skills: 'Навыки', projects: 'Проекты', languages: 'Языки', certs: 'Сертификаты' },
  uk: { download: 'Завантажити PDF', experience: 'Досвід роботи', education: 'Освіта', skills: 'Навички', projects: 'Проєкти', languages: 'Мови', certs: 'Сертифікати' },
  en: { download: 'Download PDF', experience: 'Experience', education: 'Education', skills: 'Skills', projects: 'Projects', languages: 'Languages', certs: 'Certifications' },
}
</script>

<template>
  <div class="resume-page" v-if="data">
    <div class="resume-actions no-print">
      <button class="demo-btn demo-btn-primary" @click="exportPDF">
        {{ labels[locale].download }}
      </button>
    </div>

    <ResumeHeader :header="data.header" :summary="data.summary" />

    <ResumeTimeline
      :title="labels[locale].experience"
      :items="data.experience"
      type="experience"
    />

    <ResumeSkills
      :title="labels[locale].skills"
      :groups="data.skills"
    />

    <ResumeProjects
      :title="labels[locale].projects"
      :projects="data.projects"
    />

    <ResumeTimeline
      :title="labels[locale].education"
      :items="data.education"
      type="education"
    />

    <ResumeSection
      v-if="data.languages?.length"
      :title="labels[locale].languages"
    >
      <div class="resume-languages">
        <span v-for="lang in data.languages" :key="lang.language" class="resume-lang-badge">
          {{ lang.language }} — {{ lang.level }}
        </span>
      </div>
    </ResumeSection>

    <ResumeSection
      v-if="data.certifications?.length"
      :title="labels[locale].certs"
    >
      <ul>
        <li v-for="cert in data.certifications" :key="cert.name">
          <a v-if="cert.link" :href="cert.link" target="_blank">{{ cert.name }}</a>
          <span v-else>{{ cert.name }}</span>
          — {{ cert.issuer }} ({{ cert.year }})
        </li>
      </ul>
    </ResumeSection>
  </div>

  <div v-else-if="loading" class="demo-wrapper">
    <p>Loading...</p>
  </div>
</template>
```

---

## 6. PDF экспорт — решение

### Рекомендация: `window.print()` + `@media print` (приоритетный вариант)

**Почему не html2pdf.js / puppeteer:**

| Критерий | window.print() | html2pdf.js | puppeteer |
|----------|---------------|-------------|-----------|
| Bundle size | 0 KB | ~400 KB | серверная зависимость |
| Качество | Отличное (нативный рендер) | Среднее (canvas → PDF) | Отличное |
| Поддержка CSS | Полная | Частичная | Полная |
| Зависимости | Нет | npm пакет | Node.js сервер |
| Совместимость | Все браузеры | Все браузеры | Только сервер |

**Вывод:** Для статического сайта (GitHub Pages) window.print() — оптимальный выбор. Нулевой bundle overhead, нативное качество, полная поддержка CSS.

### print.css — ключевые правила

```css
/* Скрываем элементы VitePress при печати */
@media print {
  /* Прячем навигацию, сайдбар, футер */
  .VPNav,
  .VPSidebar,
  .VPFooter,
  .VPLocalNav,
  .no-print,
  .resume-actions {
    display: none !important;
  }

  /* Контент на всю ширину */
  .VPContent .VPDoc {
    padding: 0 !important;
  }

  .VPDoc .container {
    max-width: 100% !important;
  }

  /* Резюме стили для печати */
  .resume-page {
    font-size: 11pt;
    color: #000 !important;
    background: #fff !important;
    max-width: 210mm;  /* A4 */
    margin: 0 auto;
  }

  /* Разрывы страниц */
  .resume-section {
    break-inside: avoid;
  }

  /* Ссылки — показываем URL */
  a[href^="http"]::after {
    content: " (" attr(href) ")";
    font-size: 0.8em;
    color: #666;
  }

  /* Навыки — принт-версия прогресс-баров */
  .skill-bar-fill {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}

/* При активном экспорте — body class */
body.resume-printing {
  /* Убираем всё лишнее на уровне body */
}

body.resume-printing .VPNav,
body.resume-printing .VPSidebar,
body.resume-printing .VPFooter {
  display: none !important;
}
```

---

## 7. Markdown интеграция (index.md)

```markdown
---
title: Резюме
layout: doc
aside: false
outline: false
---

<script setup>
import ResumePage from '../.vitepress/components/ResumePage.vue'
</script>

<ResumePage />
```

Для каждой локали (docs/resume/index.md, docs/uk/resume/index.md, docs/en/resume/index.md) — одинаковый markdown, компонент сам определяет язык через `useData()`.

---

## 8. Обновление config.mts

### Добавление en локали

```typescript
locales: {
  root: {
    label: 'Русский',
    lang: 'ru',
    title: "Справочник по IT",
    description: "Ваш быстрый справочник для разработчиков"
  },
  uk: {
    label: 'Українська',
    lang: 'uk',
    title: "IT Справочник",
    description: "Ваш швидкий довідник для розробників"
  },
  en: {
    label: 'English',
    lang: 'en',
    title: "IT Cheat Sheets",
    description: "Your quick reference for developers"
  }
}
```

### Добавление в навигацию

```typescript
nav: [
  // ... existing items
  { text: 'Резюме', link: '/resume/' }
]
```

---

## 9. Мобильная оптимизация

- Компонент ResumeHeader: фото + контакты в столбец на мобильных (`flex-direction: column` при `< 640px`)
- Навыки: прогресс-бары во всю ширину на мобильных
- Кнопка PDF: `position: sticky; bottom: 16px` на мобильных для удобства
- Timeline: вертикальная линия с точками — адаптивная

---

## 10. Дорожная карта реализации

### Фаза 1 — MVP (приоритет HIGH)
1. Создать `types.ts` с интерфейсами данных
2. Создать `ru.ts` с данными резюме
3. Создать `useResume.ts` composable
4. Создать `ResumePage.vue` + подкомпоненты (Header, Section, Skills, Timeline)
5. Создать `print.css`
6. Создать `docs/resume/index.md`
7. Обновить `config.mts` — навигация

### Фаза 2 — Многоязычность
8. Создать `uk.ts`, `en.ts` данные
9. Создать `docs/uk/resume/index.md`, `docs/en/resume/index.md`
10. Добавить en-локаль в `config.mts`

### Фаза 3 — Улучшения (приоритет LOW)
11. `ResumeProjects.vue` — скриншоты проектов, интерактивные теги стека
12. Анимации при скролле (Intersection Observer)
13. Альтернативный PDF (html2pdf.js) для случаев когда нужен программный экспорт без диалога печати

---

## 11. Оценка сложности

| Компонент | Сложность | Строки кода (прим.) |
|-----------|-----------|---------------------|
| types.ts | Low | ~80 |
| ru.ts / uk.ts / en.ts | Medium | ~150 каждый |
| useResume.ts | Low | ~40 |
| ResumePage.vue | Medium | ~120 |
| ResumeHeader.vue | Low | ~60 |
| ResumeSection.vue | Low | ~30 |
| ResumeSkills.vue | Medium | ~80 |
| ResumeTimeline.vue | Medium | ~90 |
| ResumeProjects.vue | Medium | ~80 |
| print.css | Medium | ~60 |
| Markdown файлы (x3) | Low | ~10 каждый |
| config.mts изменения | Low | ~20 |
| **Итого** | | **~950 строк** |

Время реализации: 3-4 задачи для команды (параллельно).
