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
    { name: 'Claude Agent Teams UI', description: 'Веб-інтерфейс для управління командами AI-агентів з канбан-дошкою, відстеженням завдань та WebSocket-оновленнями.', stack: ['TypeScript', 'Vue 3', 'WebSocket', 'Pinia'], category: 'AI', highlights: ['Канбан-дошка з drag-and-drop', 'Моніторинг процесів у реальному часі', 'Система завдань з коментарями та рев\'ю'], links: [{ label: 'GitHub', url: 'https://github.com/AlexeyZelenko/claude_agent_teams_ui' }] },
    { name: 'Claude Notifications (Go)', description: 'Кросплатформна система сповіщень для Claude Code — звукові оповіщення та моніторинг завдань.', stack: ['Go', 'Cross-platform', 'CLI', 'System Notifications'], category: 'AI', highlights: ['Написана на Go для продуктивності', 'Windows/macOS/Linux', 'Настроювані звуки та фільтри'], links: [{ label: 'GitHub', url: 'https://github.com/AlexeyZelenko/claude-notifications-go' }] },
    { name: 'IT Довідник (VitePress)', description: 'Документація-довідник з IT-технологій з 15+ інтерактивними компонентами, темною темою та SEO.', stack: ['VitePress', 'Vue 3', 'TypeScript', 'CSS', 'Vitest'], category: 'Web', highlights: ['15+ інтерактивних демо-компонентів', 'PDF-експорт резюме', 'Багатомовність (ru/uk/en)'], links: [{ label: 'GitHub', url: 'https://github.com/AlexeyZelenko/vitepress' }, { label: 'Демо', url: 'https://alexeyzelenko.github.io/vitepress/' }] },
    { name: 'CRM System', description: 'CRM-система для управління клієнтами, замовленнями та аналітикою на Nuxt.', stack: ['Nuxt', 'Vue 3', 'Vuex', 'Firebase', 'SCSS'], category: 'Web', highlights: ['Dashboard з аналітикою', 'Управління клієнтами та замовленнями', 'Firebase автентифікація'], links: [{ label: 'GitHub', url: 'https://github.com/AlexeyZelenko/crm-system-nuxt' }] },
    { name: 'Nova Poshta Tracker', description: 'Трекер посилок Нової Пошти з відстеженням статусів доставки в реальному часі.', stack: ['TypeScript', 'Vue 3', 'REST API', 'Pinia'], category: 'Web', highlights: ['Інтеграція з API Нової Пошти', 'Push-сповіщення про статус', 'Історія відправлень'], links: [{ label: 'GitHub', url: 'https://github.com/AlexeyZelenko/nova_poshta_tracker' }] },
    { name: 'Art Studio', description: 'Веб-додаток для арт-студії — галерея робіт, відео, бронювання та управління контентом.', stack: ['TypeScript', 'Vue 3', 'Firebase', 'Cloud Storage'], category: 'Web', highlights: ['Галерея з фільтрацією', 'Відео-контент', 'Онлайн-бронювання'], links: [{ label: 'GitHub', url: 'https://github.com/AlexeyZelenko/art-studio' }] },
    { name: 'Art Studio Video', description: 'Розширення арт-студії з відео-галереєю та стримінгом контенту.', stack: ['TypeScript', 'Vue 3', 'Firebase', 'Video.js'], category: 'Web', links: [{ label: 'GitHub', url: 'https://github.com/AlexeyZelenko/art_studio_video' }] },
    { name: 'Fitness Tracker', description: 'Додаток для відстеження тренувань, харчування та прогресу з графіками.', stack: ['TypeScript', 'Vue 3', 'Chart.js', 'PWA'], category: 'Web', highlights: ['Візуалізація прогресу', 'Калькулятор калорій', 'PWA для мобільних'], links: [{ label: 'GitHub', url: 'https://github.com/AlexeyZelenko/fitnes_ex' }] },
    { name: 'Aid Ukraine', description: 'Платформа координації гуманітарної допомоги з картами та базою даних ресурсів.', stack: ['Vue.js', 'Firebase', 'Google Maps API', 'Firestore'], category: 'Web', highlights: ['Інтерактивна карта ресурсів', 'Оновлення в реальному часі', 'Волонтерська мережа'], links: [{ label: 'GitHub', url: 'https://github.com/AlexeyZelenko/aid_ukraine' }] },
    { name: 'BV CK UA', description: 'Веб-додаток з UI-компонентами для інформаційного порталу.', stack: ['TypeScript', 'Vue 3', 'SCSS', 'Vite'], category: 'Web', links: [{ label: 'GitHub', url: 'https://github.com/AlexeyZelenko/bv_ck_ua_new' }] },
    { name: 'Content Wind', description: 'Тема для Nuxt Content — легкий портфоліо/блог шаблон з Markdown-контентом.', stack: ['Nuxt 3', 'Nuxt Content', 'TailwindCSS'], category: 'Web', highlights: ['Markdown-based контент', 'SEO-оптимізація', 'Мінімалістичний дизайн'], links: [{ label: 'GitHub', url: 'https://github.com/AlexeyZelenko/content-wind' }] },
    { name: 'BV Nuxt', description: 'Веб-додаток на Nuxt для регіональної платформи.', stack: ['Nuxt', 'Vue.js', 'Vuex', 'SCSS'], category: 'Web', links: [{ label: 'GitHub', url: 'https://github.com/AlexeyZelenko/bv-nuxt' }] },
    { name: 'Aleksandr Portfolio', description: 'Персональний портфоліо-сайт з анімаціями та адаптивним дизайном.', stack: ['Vue.js', 'CSS3', 'Animations'], category: 'Web', links: [{ label: 'GitHub', url: 'https://github.com/AlexeyZelenko/aleksandr' }] },
    { name: 'CodeDZEN', description: 'Платформа для вивчення програмування з інтерактивними завданнями.', stack: ['Vue.js', 'JavaScript', 'Firebase'], category: 'Web', links: [{ label: 'GitHub', url: 'https://github.com/AlexeyZelenko/codeDZEN' }] },
    { name: 'FriendlyChat', description: 'Чат-додаток на Firebase з авторизацією Google та обміном повідомленнями в реальному часі.', stack: ['JavaScript', 'Firebase', 'Cloud Messaging', 'Auth'], category: 'Web', highlights: ['Google Auth', 'Firestore real-time', 'Cloud Functions'], links: [{ label: 'GitHub', url: 'https://github.com/AlexeyZelenko/codelab-friendlychat-web' }] },
    { name: 'Electron English Dictionary', description: 'Десктоп-додаток для вивчення англійської мови з картками, тестами та прогресом.', stack: ['Electron', 'Vue.js', 'Node.js', 'SQLite'], category: 'Desktop', highlights: ['Флеш-картки з інтервальним повторенням', 'Тести та статистика', 'Офлайн-режим'], links: [{ label: 'GitHub', url: 'https://github.com/AlexeyZelenko/electron_english' }] },
    { name: 'Bot BLV', description: 'Автоматизований бот для обробки даних та виконання завдань.', stack: ['JavaScript', 'Node.js', 'Automation'], category: 'Desktop', links: [{ label: 'GitHub', url: 'https://github.com/AlexeyZelenko/bot_blv' }] },
    { name: 'CSGO FaceIT Tracker', description: 'Розширення для відстеження статистики гравців CSGO на FaceIT з рейтингами та історією матчів.', stack: ['JavaScript', 'Chrome Extensions API', 'FaceIT API'], category: 'Extensions', highlights: ['Статистика в реальному часі', 'Рейтинг та ELO', 'Історія матчів'], links: [{ label: 'GitHub', url: 'https://github.com/AlexeyZelenko/browser-extension-faceit-csgo' }] },
    { name: 'Page Summarizer', description: 'Розширення для сумаризації контенту веб-сторінок — виділення ключових моментів.', stack: ['Vue.js', 'Chrome Extensions API', 'NLP'], category: 'Extensions', highlights: ['Витяг ключових фраз', 'Popup-інтерфейс', 'Настроюваний вивід'], links: [{ label: 'GitHub', url: 'https://github.com/AlexeyZelenko/Page-Summarizer' }] },
    { name: 'Tab Master', description: 'Розширення для керування вкладками — групування, пошук та швидке переключення.', stack: ['Vue.js', 'Chrome Extensions API', 'Chrome Tabs API'], category: 'Extensions', links: [{ label: 'GitHub', url: 'https://github.com/AlexeyZelenko/tab_master' }] },
    { name: 'Express Mongo Todos', description: 'REST API для управління завданнями на Express + MongoDB з JWT автентифікацією.', stack: ['Express', 'MongoDB', 'Node.js', 'JWT', 'Mongoose'], category: 'Backend', highlights: ['JWT автентифікація', 'CRUD операції', 'Валідація даних'], links: [{ label: 'GitHub', url: 'https://github.com/AlexeyZelenko/express-mongo-todos' }] },
    { name: 'API Connectors (BitMEX)', description: 'Конектори до API біржі BitMEX для торгових операцій та ринкових даних.', stack: ['JavaScript', 'REST API', 'WebSocket', 'Crypto'], category: 'Backend', highlights: ['WebSocket streaming', 'Торгові ордери', 'Обробка ринкових даних'], links: [{ label: 'GitHub', url: 'https://github.com/AlexeyZelenko/api-connectors' }] },
    { name: 'Bible Online', description: 'Мобільний додаток для читання Біблії, опублікований в Google Play Store.', stack: ['JavaScript', 'Firebase', 'Google Play', 'PWA'], category: 'Mobile', highlights: ['Опубліковано в Google Play', 'Офлайн-читання', 'Пошук по тексту'], links: [{ label: 'GitHub', url: 'https://github.com/AlexeyZelenko/Bible_online_Google' }] },
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
