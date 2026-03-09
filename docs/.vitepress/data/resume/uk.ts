import type { ResumeData } from './types'

const data: ResumeData = {
  meta: {
    locale: 'uk',
    lastUpdated: '2026-03-09',
    pdfFileName: 'Resume_Zelenko_UK.pdf',
  },
  header: {
    name: 'Олексій Зеленко',
    title: 'Frontend Developer',
    contacts: [
      { icon: 'email', label: 'Email', value: 'alexey@example.com', link: 'mailto:alexey@example.com' },
      { icon: 'github', label: 'GitHub', value: 'AlexeyZelenko', link: 'https://github.com/AlexeyZelenko' },
      { icon: 'linkedin', label: 'LinkedIn', value: 'alexey-zelenko', link: 'https://linkedin.com/in/alexey-zelenko' },
      { icon: 'location', label: 'Локація', value: 'Україна' },
    ],
  },
  summary: 'Frontend-розробник з досвідом створення сучасних веб-застосунків на Vue.js, TypeScript та VitePress. Спеціалізуюсь на інтерактивних UI-компонентах, документації та оптимізації продуктивності.',

  experience: [
    {
      company: 'IT Company',
      position: 'Senior Frontend Developer',
      period: '2023 — теперішній час',
      location: 'Віддалено',
      description: 'Розробка та підтримка великого веб-застосунку на Vue 3 з TypeScript.',
      achievements: [
        'Створив архітектуру компонентів з Composition API та composables',
        'Впровадив систему документації на VitePress з інтерактивними демо',
        'Оптимізував час збірки на 12% через аналіз залежностей',
        'Написав 36+ unit-тестів для критичних компонентів',
      ],
      stack: ['Vue 3', 'TypeScript', 'VitePress', 'Vitest', 'Pinia'],
    },
    {
      company: 'Web Studio',
      position: 'Frontend Developer',
      period: '2021 — 2023',
      location: 'Україна',
      description: 'Розробка клієнтських застосунків для e-commerce та корпоративних клієнтів.',
      achievements: [
        'Розробив 10+ лендингів та SPA на Vue.js',
        'Інтегрував REST API та GraphQL ендпоінти',
        'Налаштував CI/CD пайплайни з автоматичним деплоєм',
      ],
      stack: ['Vue 2/3', 'Nuxt', 'SCSS', 'REST API', 'Docker'],
    },
    {
      company: 'Freelance',
      position: 'Web Developer',
      period: '2019 — 2021',
      description: 'Фріланс-розробка сайтів та веб-застосунків для малого бізнесу.',
      achievements: [
        'Створив 20+ проєктів різної складності',
        'Працював з PHP/Laravel на бекенді',
        'Опанував Vue.js екосистему з нуля',
      ],
      stack: ['JavaScript', 'Vue.js', 'PHP', 'Laravel', 'MySQL'],
    },
  ],

  education: [
    {
      institution: 'Університет',
      degree: 'Бакалавр комп\'ютерних наук',
      period: '2015 — 2019',
      description: 'Спеціалізація: програмна інженерія',
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
        { name: 'React (базовий)', level: 50 },
      ],
    },
    {
      category: 'Інструменти',
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
      name: 'IT Довідник (VitePress)',
      description: 'Документація-довідник з IT-технологій з інтерактивними компонентами, темною темою та SEO-оптимізацією.',
      stack: ['VitePress', 'Vue 3', 'TypeScript', 'CSS'],
      links: [
        { label: 'GitHub', url: 'https://github.com/AlexeyZelenko/vitepress' },
        { label: 'Демо', url: 'https://alexeyzelenko.github.io/vitepress/' },
      ],
    },
    {
      name: 'E-commerce Dashboard',
      description: 'Панель керування інтернет-магазином з аналітикою, графіками продажів та управлінням товарами.',
      stack: ['Vue 3', 'Pinia', 'Chart.js', 'Tailwind CSS'],
      links: [
        { label: 'GitHub', url: 'https://github.com/AlexeyZelenko' },
      ],
    },
    {
      name: 'Chat Application',
      description: 'Чат-застосунок у реальному часі з WebSocket, сповіщеннями та підтримкою файлів.',
      stack: ['Vue 3', 'Socket.io', 'Node.js', 'MongoDB'],
      links: [
        { label: 'GitHub', url: 'https://github.com/AlexeyZelenko' },
      ],
    },
  ],

  languages: [
    { language: 'Українська', level: 'Рідна' },
    { language: 'Російська', level: 'Вільно' },
    { language: 'Англійська', level: 'B2 (Upper-Intermediate)' },
  ],
}

export default data
