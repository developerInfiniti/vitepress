import type { ResumeData } from './types'

const data: ResumeData = {
  meta: {
    locale: 'ru',
    lastUpdated: '2026-03-09',
    pdfFileName: 'Resume_Zelenko_RU.pdf',
  },
  header: {
    name: 'Алексей Зеленко',
    title: 'Full-Stack Developer',
    contacts: [
      { icon: 'email', label: 'Email', value: 'alexey@example.com', link: 'mailto:alexey@example.com' },
      { icon: 'github', label: 'GitHub', value: 'AlexeyZelenko', link: 'https://github.com/AlexeyZelenko' },
      { icon: 'linkedin', label: 'LinkedIn', value: 'alexey-zelenko', link: 'https://linkedin.com/in/alexey-zelenko' },
      { icon: 'location', label: 'Локация', value: 'США' },
    ],
  },
  summary: 'Full-Stack разработчик с 5+ годами опыта и 88+ публичными проектами на GitHub. Специализируюсь на Vue.js, TypeScript, Node.js и Go. Опыт создания веб-приложений, десктоп-приложений (Electron), браузерных расширений, AI-инструментов и систем документации. Сильные стороны: быстрое прототипирование, архитектура компонентов, интеграция API и кроссплатформенная разработка.',

  experience: [
    {
      company: 'IT Company',
      position: 'Senior Full-Stack Developer',
      period: '2023 — настоящее время',
      location: 'Удалённо',
      description: 'Разработка и поддержка веб-приложений на Vue 3 с TypeScript. Создание AI-инструментов и систем документации.',
      achievements: [
        'Создал архитектуру компонентов с Composition API и composables',
        'Разработал систему документации на VitePress с 15+ интерактивными демо-компонентами',
        'Создал Claude Agent Teams UI — веб-интерфейс управления AI-агентами с канбан-доской',
        'Разработал кроссплатформенную систему уведомлений на Go (claude-notifications-go)',
        'Оптимизировал время сборки на 12% через анализ зависимостей и npm cleanup',
        'Написал 36+ unit-тестов для критичных компонентов',
      ],
      stack: ['Vue 3', 'TypeScript', 'VitePress', 'Go', 'Vitest', 'Pinia', 'WebSocket'],
    },
    {
      company: 'Web Studio',
      position: 'Frontend Developer',
      period: '2021 — 2023',
      location: 'Украина',
      description: 'Разработка клиентских приложений для e-commerce, CRM-систем и корпоративных клиентов.',
      achievements: [
        'Разработал 12+ SPA и лендингов на Vue.js / Nuxt',
        'Создал CRM-систему на Nuxt с управлением клиентами и аналитикой',
        'Разработал трекер посылок Nova Poshta с REST API интеграцией',
        'Интегрировал REST API и GraphQL эндпоинты',
        'Настроил CI/CD пайплайны с автоматическим деплоем на Firebase',
        'Создал Electron-приложение для изучения английского языка',
      ],
      stack: ['Vue 2/3', 'Nuxt', 'SCSS', 'Electron', 'Firebase', 'REST API', 'Docker'],
    },
    {
      company: 'Freelance',
      position: 'Web Developer',
      period: '2019 — 2021',
      description: 'Фриланс-разработка сайтов и веб-приложений для малого бизнеса. Создание 20+ проектов различной сложности.',
      achievements: [
        'Создал 20+ проектов: от лендингов до полноценных SPA',
        'Разработал браузерное расширение для отслеживания статистики CSGO FaceIT',
        'Работал с PHP/Laravel на бэкенде, Express/MongoDB на Node.js',
        'Освоил Vue.js экосистему и перешёл на TypeScript',
        'Публиковал приложение Bible Online в Google Play Store',
      ],
      stack: ['JavaScript', 'Vue.js', 'PHP', 'Laravel', 'MySQL', 'Express', 'MongoDB'],
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
        { name: 'Vue.js 2/3', level: 92 },
        { name: 'Nuxt.js', level: 85 },
        { name: 'TypeScript', level: 88 },
        { name: 'JavaScript (ES6+)', level: 92 },
        { name: 'HTML5 / CSS3 / SCSS', level: 90 },
        { name: 'Tailwind CSS', level: 75 },
        { name: 'VitePress / Vite', level: 88 },
      ],
    },
    {
      category: 'Backend',
      skills: [
        { name: 'Node.js / Express', level: 70 },
        { name: 'Go', level: 55 },
        { name: 'PHP / Laravel', level: 60 },
        { name: 'MongoDB', level: 65 },
        { name: 'MySQL / PostgreSQL', level: 65 },
        { name: 'REST API / GraphQL', level: 78 },
      ],
    },
    {
      category: 'Desktop & Mobile',
      skills: [
        { name: 'Electron', level: 65 },
        { name: 'Chrome Extensions API', level: 60 },
        { name: 'Firebase / Google Cloud', level: 70 },
      ],
    },
    {
      category: 'Инструменты & DevOps',
      skills: [
        { name: 'Git / GitHub', level: 88 },
        { name: 'Docker', level: 60 },
        { name: 'CI/CD (GitHub Actions)', level: 65 },
        { name: 'Vitest / Jest', level: 72 },
        { name: 'Figma', level: 60 },
        { name: 'WebSocket', level: 70 },
      ],
    },
  ],

  projects: [
    {
      name: 'IT Справочник (VitePress)',
      description: 'Комплексная документация-справочник по IT-технологиям с 15+ интерактивными Vue-компонентами, тёмной темой, SEO-оптимизацией и PDF-экспортом резюме.',
      stack: ['VitePress', 'Vue 3', 'TypeScript', 'CSS', 'Vitest'],
      links: [
        { label: 'GitHub', url: 'https://github.com/AlexeyZelenko/vitepress' },
        { label: 'Демо', url: 'https://alexeyzelenko.github.io/vitepress/' },
      ],
    },
    {
      name: 'Claude Agent Teams UI',
      description: 'Веб-интерфейс для управления командами AI-агентов с канбан-доской, отслеживанием задач, мониторингом процессов и WebSocket-обновлениями.',
      stack: ['TypeScript', 'Vue 3', 'WebSocket', 'Pinia'],
      links: [
        { label: 'GitHub', url: 'https://github.com/AlexeyZelenko/claude_agent_teams_ui' },
      ],
    },
    {
      name: 'Claude Notifications (Go)',
      description: 'Кроссплатформенная система уведомлений для Claude Code — звуковые оповещения, всплывающие окна и мониторинг задач. Написана на Go.',
      stack: ['Go', 'Cross-platform', 'System Notifications'],
      links: [
        { label: 'GitHub', url: 'https://github.com/AlexeyZelenko/claude-notifications-go' },
      ],
    },
    {
      name: 'CRM System (Nuxt)',
      description: 'CRM-система для управления клиентами, заказами и аналитикой. Полнофункциональное бизнес-приложение на Nuxt.',
      stack: ['Nuxt', 'Vue 3', 'Vuex', 'Firebase'],
      links: [
        { label: 'GitHub', url: 'https://github.com/AlexeyZelenko/crm-system-nuxt' },
      ],
    },
    {
      name: 'Nova Poshta Tracker',
      description: 'Трекер посылок Новой Почты с отслеживанием статусов доставки в реальном времени через REST API.',
      stack: ['TypeScript', 'Vue 3', 'REST API'],
      links: [
        { label: 'GitHub', url: 'https://github.com/AlexeyZelenko/nova_poshta_tracker' },
      ],
    },
    {
      name: 'Art Studio',
      description: 'Веб-приложение для арт-студии — галерея работ, видео-контент, бронирование и управление контентом.',
      stack: ['TypeScript', 'Vue 3', 'Firebase'],
      links: [
        { label: 'GitHub', url: 'https://github.com/AlexeyZelenko/art-studio' },
      ],
    },
    {
      name: 'Fitness Tracker',
      description: 'Приложение для отслеживания тренировок, питания и прогресса с визуализацией данных.',
      stack: ['TypeScript', 'Vue 3', 'Chart.js'],
      links: [
        { label: 'GitHub', url: 'https://github.com/AlexeyZelenko/fitnes_ex' },
      ],
    },
    {
      name: 'Electron English Dictionary',
      description: 'Десктоп-приложение для изучения английского языка с карточками, тестами и отслеживанием прогресса.',
      stack: ['Electron', 'Vue.js', 'Node.js'],
      links: [
        { label: 'GitHub', url: 'https://github.com/AlexeyZelenko/electron_english' },
      ],
    },
    {
      name: 'CSGO FaceIT Tracker',
      description: 'Браузерное расширение для отслеживания статистики игроков CSGO на платформе FaceIT.',
      stack: ['JavaScript', 'Chrome Extensions API', 'FaceIT API'],
      links: [
        { label: 'GitHub', url: 'https://github.com/AlexeyZelenko/browser-extension-faceit-csgo' },
      ],
    },
    {
      name: 'Aid Ukraine',
      description: 'Веб-платформа для координации гуманитарной помощи Украине с картами и базой данных ресурсов.',
      stack: ['Vue.js', 'Firebase', 'Google Maps API'],
      links: [
        { label: 'GitHub', url: 'https://github.com/AlexeyZelenko/aid_ukraine' },
      ],
    },
    {
      name: 'Express Mongo Todos',
      description: 'REST API для управления задачами — бэкенд на Express с MongoDB, аутентификация и CRUD операции.',
      stack: ['Express', 'MongoDB', 'Node.js', 'JWT'],
      links: [
        { label: 'GitHub', url: 'https://github.com/AlexeyZelenko/express-mongo-todos' },
      ],
    },
    {
      name: 'API Connectors (BitMEX)',
      description: 'Коннекторы к API биржи BitMEX для торговых операций и получения рыночных данных.',
      stack: ['JavaScript', 'REST API', 'WebSocket'],
      links: [
        { label: 'GitHub', url: 'https://github.com/AlexeyZelenko/api-connectors' },
      ],
    },
    {
      name: 'Bible Online',
      description: 'Мобильное приложение для чтения Библии онлайн, опубликованное в Google Play Store.',
      stack: ['JavaScript', 'Firebase', 'Google Play'],
      links: [
        { label: 'GitHub', url: 'https://github.com/AlexeyZelenko/Bible_online_Google' },
      ],
    },
  ],

  expertise: [
    'Разработка веб-приложений (SPA/SSR)',
    'Десктоп-приложения (Electron)',
    'Браузерные расширения (Chrome)',
    'AI-инструменты и интеграции',
    'Системы документации (VitePress)',
    'Интеграция REST/GraphQL/WebSocket API',
    'CRM и бизнес-системы',
    'Firebase и облачная инфраструктура',
    'Кроссплатформенная разработка',
  ],

  languages: [
    { language: 'Украинский', level: 'Родной' },
    { language: 'Русский', level: 'Свободный' },
    { language: 'Английский', level: 'B2 (Upper-Intermediate)' },
  ],
}

export default data
