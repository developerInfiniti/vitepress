import type { ResumeData } from './types'

const data: ResumeData = {
  meta: {
    locale: 'ru',
    lastUpdated: '2026-03-09',
    pdfFileName: 'Resume_Zelenko_RU.pdf',
  },
  header: {
    name: 'Алексей Зеленко',
    title: 'Frontend Developer',
    contacts: [
      { icon: 'email', label: 'Email', value: 'alexey@example.com', link: 'mailto:alexey@example.com' },
      { icon: 'github', label: 'GitHub', value: 'AlexeyZelenko', link: 'https://github.com/AlexeyZelenko' },
      { icon: 'linkedin', label: 'LinkedIn', value: 'alexey-zelenko', link: 'https://linkedin.com/in/alexey-zelenko' },
      { icon: 'location', label: 'Локация', value: 'Украина' },
    ],
  },
  summary: 'Frontend-разработчик с опытом создания современных веб-приложений на Vue.js, TypeScript и VitePress. Специализируюсь на интерактивных UI-компонентах, документации и оптимизации производительности.',

  experience: [
    {
      company: 'IT Company',
      position: 'Senior Frontend Developer',
      period: '2023 — настоящее время',
      location: 'Удалённо',
      description: 'Разработка и поддержка крупного веб-приложения на Vue 3 с TypeScript.',
      achievements: [
        'Создал архитектуру компонентов с Composition API и composables',
        'Внедрил систему документации на VitePress с интерактивными демо',
        'Оптимизировал время сборки на 12% через анализ зависимостей',
        'Написал 36+ unit-тестов для критичных компонентов',
      ],
      stack: ['Vue 3', 'TypeScript', 'VitePress', 'Vitest', 'Pinia'],
    },
    {
      company: 'Web Studio',
      position: 'Frontend Developer',
      period: '2021 — 2023',
      location: 'Украина',
      description: 'Разработка клиентских приложений для e-commerce и корпоративных клиентов.',
      achievements: [
        'Разработал 10+ лендингов и SPA на Vue.js',
        'Интегрировал REST API и GraphQL эндпоинты',
        'Настроил CI/CD пайплайны с автоматическим деплоем',
      ],
      stack: ['Vue 2/3', 'Nuxt', 'SCSS', 'REST API', 'Docker'],
    },
    {
      company: 'Freelance',
      position: 'Web Developer',
      period: '2019 — 2021',
      description: 'Фриланс-разработка сайтов и веб-приложений для малого бизнеса.',
      achievements: [
        'Создал 20+ проектов различной сложности',
        'Работал с PHP/Laravel на бэкенде',
        'Освоил Vue.js экосистему с нуля',
      ],
      stack: ['JavaScript', 'Vue.js', 'PHP', 'Laravel', 'MySQL'],
    },
  ],

  education: [
    {
      institution: 'Университет',
      degree: 'Бакалавр компьютерных наук',
      period: '2015 — 2019',
      description: 'Специализация: программная инженерия',
    },
  ],

  skills: [
    {
      category: 'Frontend',
      skills: [
        { name: 'Vue.js / Nuxt', level: 90 },
        { name: 'TypeScript', level: 85 },
        { name: 'JavaScript (ES6+)', level: 90 },
        { name: 'HTML5 / CSS3 / SCSS', level: 90 },
        { name: 'React (базовый)', level: 50 },
      ],
    },
    {
      category: 'Инструменты',
      skills: [
        { name: 'Git / GitHub', level: 85 },
        { name: 'VitePress / Vite', level: 85 },
        { name: 'Docker', level: 60 },
        { name: 'Vitest / Jest', level: 70 },
        { name: 'Figma', level: 60 },
      ],
    },
    {
      category: 'Backend',
      skills: [
        { name: 'Node.js / Express', level: 65 },
        { name: 'PHP / Laravel', level: 60 },
        { name: 'MySQL / PostgreSQL', level: 65 },
        { name: 'REST API / GraphQL', level: 75 },
      ],
    },
  ],

  projects: [
    {
      name: 'IT Справочник (VitePress)',
      description: 'Документация-справочник по IT-технологиям с интерактивными компонентами, тёмной темой и SEO-оптимизацией.',
      stack: ['VitePress', 'Vue 3', 'TypeScript', 'CSS'],
      links: [
        { label: 'GitHub', url: 'https://github.com/AlexeyZelenko/vitepress' },
        { label: 'Демо', url: 'https://alexeyzelenko.github.io/vitepress/' },
      ],
    },
    {
      name: 'E-commerce Dashboard',
      description: 'Панель управления интернет-магазином с аналитикой, графиками продаж и управлением товарами.',
      stack: ['Vue 3', 'Pinia', 'Chart.js', 'Tailwind CSS'],
      links: [
        { label: 'GitHub', url: 'https://github.com/AlexeyZelenko' },
      ],
    },
    {
      name: 'Chat Application',
      description: 'Чат-приложение в реальном времени с WebSocket, уведомлениями и поддержкой файлов.',
      stack: ['Vue 3', 'Socket.io', 'Node.js', 'MongoDB'],
      links: [
        { label: 'GitHub', url: 'https://github.com/AlexeyZelenko' },
      ],
    },
  ],

  languages: [
    { language: 'Украинский', level: 'Родной' },
    { language: 'Русский', level: 'Свободный' },
    { language: 'Английский', level: 'B2 (Upper-Intermediate)' },
  ],
}

export default data
