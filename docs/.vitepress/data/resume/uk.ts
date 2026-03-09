import type { ResumeData } from './types'

const data: ResumeData = {
  meta: {
    locale: 'uk',
    lastUpdated: '2026-03-09',
    pdfFileName: 'Resume_Zelenko_UK.pdf',
  },
  header: {
    name: 'Олексій Зеленко',
    title: 'Full-Stack Developer',
    contacts: [
      { icon: 'email', label: 'Email', value: 'alexey@example.com', link: 'mailto:alexey@example.com' },
      { icon: 'github', label: 'GitHub', value: 'AlexeyZelenko', link: 'https://github.com/AlexeyZelenko' },
      { icon: 'linkedin', label: 'LinkedIn', value: 'alexey-zelenko', link: 'https://linkedin.com/in/alexey-zelenko' },
      { icon: 'location', label: 'Локація', value: 'США' },
    ],
  },
  summary: 'Full-Stack розробник з 5+ роками досвіду та 88+ публічними проєктами на GitHub. Спеціалізуюся на Vue.js, TypeScript, Node.js та Go. Досвід створення веб-додатків, десктоп-додатків (Electron), браузерних розширень, AI-інструментів та систем документації. Сильні сторони: швидке прототипування, архітектура компонентів, інтеграція API та кросплатформна розробка.',

  experience: [
    {
      company: 'IT Company',
      position: 'Senior Full-Stack Developer',
      period: '2023 — теперішній час',
      location: 'Віддалено',
      description: 'Розробка та підтримка веб-додатків на Vue 3 з TypeScript. Створення AI-інструментів та систем документації.',
      achievements: [
        'Створив архітектуру компонентів з Composition API та composables',
        'Розробив систему документації на VitePress з 15+ інтерактивними демо-компонентами',
        'Створив Claude Agent Teams UI — веб-інтерфейс управління AI-агентами з канбан-дошкою',
        'Розробив кросплатформну систему сповіщень на Go (claude-notifications-go)',
        'Оптимізував час збірки на 12% через аналіз залежностей та npm cleanup',
        'Написав 36+ unit-тестів для критичних компонентів',
      ],
      stack: ['Vue 3', 'TypeScript', 'VitePress', 'Go', 'Vitest', 'Pinia', 'WebSocket'],
    },
    {
      company: 'Web Studio',
      position: 'Frontend Developer',
      period: '2021 — 2023',
      location: 'Україна',
      description: 'Розробка клієнтських додатків для e-commerce, CRM-систем та корпоративних клієнтів.',
      achievements: [
        'Розробив 12+ SPA та лендінгів на Vue.js / Nuxt',
        'Створив CRM-систему на Nuxt з управлінням клієнтами та аналітикою',
        'Розробив трекер посилок Nova Poshta з REST API інтеграцією',
        'Інтегрував REST API та GraphQL ендпоінти',
        'Налаштував CI/CD пайплайни з автоматичним деплоєм на Firebase',
        'Створив Electron-додаток для вивчення англійської мови',
      ],
      stack: ['Vue 2/3', 'Nuxt', 'SCSS', 'Electron', 'Firebase', 'REST API', 'Docker'],
    },
    {
      company: 'Freelance',
      position: 'Web Developer',
      period: '2019 — 2021',
      description: 'Фріланс-розробка сайтів та веб-додатків для малого бізнесу. Створення 20+ проєктів різної складності.',
      achievements: [
        'Створив 20+ проєктів: від лендінгів до повноцінних SPA',
        'Розробив браузерне розширення для відстеження статистики CSGO FaceIT',
        'Працював з PHP/Laravel на бекенді, Express/MongoDB на Node.js',
        'Освоїв Vue.js екосистему та перейшов на TypeScript',
        'Опублікував додаток Bible Online в Google Play Store',
      ],
      stack: ['JavaScript', 'Vue.js', 'PHP', 'Laravel', 'MySQL', 'Express', 'MongoDB'],
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
      category: 'Інструменти & DevOps',
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
      name: 'IT Довідник (VitePress)',
      description: 'Комплексна документація-довідник з IT-технологій з 15+ інтерактивними Vue-компонентами, темною темою, SEO-оптимізацією та PDF-експортом резюме.',
      stack: ['VitePress', 'Vue 3', 'TypeScript', 'CSS', 'Vitest'],
      links: [
        { label: 'GitHub', url: 'https://github.com/AlexeyZelenko/vitepress' },
        { label: 'Демо', url: 'https://alexeyzelenko.github.io/vitepress/' },
      ],
    },
    {
      name: 'Claude Agent Teams UI',
      description: 'Веб-інтерфейс для управління командами AI-агентів з канбан-дошкою, відстеженням завдань, моніторингом процесів та WebSocket-оновленнями.',
      stack: ['TypeScript', 'Vue 3', 'WebSocket', 'Pinia'],
      links: [
        { label: 'GitHub', url: 'https://github.com/AlexeyZelenko/claude_agent_teams_ui' },
      ],
    },
    {
      name: 'Claude Notifications (Go)',
      description: 'Кросплатформна система сповіщень для Claude Code — звукові оповіщення, спливаючі вікна та моніторинг завдань. Написана на Go.',
      stack: ['Go', 'Cross-platform', 'System Notifications'],
      links: [
        { label: 'GitHub', url: 'https://github.com/AlexeyZelenko/claude-notifications-go' },
      ],
    },
    {
      name: 'CRM System (Nuxt)',
      description: 'CRM-система для управління клієнтами, замовленнями та аналітикою. Повнофункціональний бізнес-додаток на Nuxt.',
      stack: ['Nuxt', 'Vue 3', 'Vuex', 'Firebase'],
      links: [
        { label: 'GitHub', url: 'https://github.com/AlexeyZelenko/crm-system-nuxt' },
      ],
    },
    {
      name: 'Nova Poshta Tracker',
      description: 'Трекер посилок Нової Пошти з відстеженням статусів доставки в реальному часі через REST API.',
      stack: ['TypeScript', 'Vue 3', 'REST API'],
      links: [
        { label: 'GitHub', url: 'https://github.com/AlexeyZelenko/nova_poshta_tracker' },
      ],
    },
    {
      name: 'Art Studio',
      description: 'Веб-додаток для арт-студії — галерея робіт, відео-контент, бронювання та управління контентом.',
      stack: ['TypeScript', 'Vue 3', 'Firebase'],
      links: [
        { label: 'GitHub', url: 'https://github.com/AlexeyZelenko/art-studio' },
      ],
    },
    {
      name: 'Fitness Tracker',
      description: 'Додаток для відстеження тренувань, харчування та прогресу з візуалізацією даних.',
      stack: ['TypeScript', 'Vue 3', 'Chart.js'],
      links: [
        { label: 'GitHub', url: 'https://github.com/AlexeyZelenko/fitnes_ex' },
      ],
    },
    {
      name: 'Electron English Dictionary',
      description: 'Десктоп-додаток для вивчення англійської мови з картками, тестами та відстеженням прогресу.',
      stack: ['Electron', 'Vue.js', 'Node.js'],
      links: [
        { label: 'GitHub', url: 'https://github.com/AlexeyZelenko/electron_english' },
      ],
    },
    {
      name: 'CSGO FaceIT Tracker',
      description: 'Браузерне розширення для відстеження статистики гравців CSGO на платформі FaceIT.',
      stack: ['JavaScript', 'Chrome Extensions API', 'FaceIT API'],
      links: [
        { label: 'GitHub', url: 'https://github.com/AlexeyZelenko/browser-extension-faceit-csgo' },
      ],
    },
    {
      name: 'Aid Ukraine',
      description: 'Веб-платформа для координації гуманітарної допомоги Україні з картами та базою даних ресурсів.',
      stack: ['Vue.js', 'Firebase', 'Google Maps API'],
      links: [
        { label: 'GitHub', url: 'https://github.com/AlexeyZelenko/aid_ukraine' },
      ],
    },
    {
      name: 'Express Mongo Todos',
      description: 'REST API для управління завданнями — бекенд на Express з MongoDB, автентифікація та CRUD операції.',
      stack: ['Express', 'MongoDB', 'Node.js', 'JWT'],
      links: [
        { label: 'GitHub', url: 'https://github.com/AlexeyZelenko/express-mongo-todos' },
      ],
    },
    {
      name: 'API Connectors (BitMEX)',
      description: 'Конектори до API біржі BitMEX для торгових операцій та отримання ринкових даних.',
      stack: ['JavaScript', 'REST API', 'WebSocket'],
      links: [
        { label: 'GitHub', url: 'https://github.com/AlexeyZelenko/api-connectors' },
      ],
    },
    {
      name: 'Bible Online',
      description: 'Мобільний додаток для читання Біблії онлайн, опублікований в Google Play Store.',
      stack: ['JavaScript', 'Firebase', 'Google Play'],
      links: [
        { label: 'GitHub', url: 'https://github.com/AlexeyZelenko/Bible_online_Google' },
      ],
    },
  ],

  expertise: [
    'Розробка веб-додатків (SPA/SSR)',
    'Десктоп-додатки (Electron)',
    'Браузерні розширення (Chrome)',
    'AI-інструменти та інтеграції',
    'Системи документації (VitePress)',
    'Інтеграція REST/GraphQL/WebSocket API',
    'CRM та бізнес-системи',
    'Firebase та хмарна інфраструктура',
    'Кросплатформна розробка',
  ],

  languages: [
    { language: 'Українська', level: 'Рідна' },
    { language: 'Російська', level: 'Вільна' },
    { language: 'Англійська', level: 'B2 (Upper-Intermediate)' },
  ],
}

export default data
