import type { ResumeData } from './types'

const data: ResumeData = {
  meta: {
    locale: 'en',
    lastUpdated: '2026-03-09',
    pdfFileName: 'Resume_Zelenko_EN.pdf',
  },
  header: {
    name: 'Alexey Zelenko',
    title: 'Full-Stack Developer',
    contacts: [
      { icon: 'email', label: 'Email', value: 'alexey@example.com', link: 'mailto:alexey@example.com' },
      { icon: 'github', label: 'GitHub', value: 'AlexeyZelenko', link: 'https://github.com/AlexeyZelenko' },
      { icon: 'linkedin', label: 'LinkedIn', value: 'alexey-zelenko', link: 'https://linkedin.com/in/alexey-zelenko' },
      { icon: 'location', label: 'Location', value: 'USA' },
    ],
  },
  summary: 'Full-Stack developer with 5+ years of experience and 88+ public projects on GitHub. Specializing in Vue.js, TypeScript, Node.js, and Go. Experienced in building web applications, desktop apps (Electron), browser extensions, AI tools, and documentation systems. Strengths: rapid prototyping, component architecture, API integration, and cross-platform development.',

  experience: [
    {
      company: 'IT Company',
      position: 'Senior Full-Stack Developer',
      period: '2023 — Present',
      location: 'Remote',
      description: 'Development and maintenance of web applications on Vue 3 with TypeScript. Building AI tools and documentation systems.',
      achievements: [
        'Designed component architecture with Composition API and composables',
        'Built a VitePress documentation system with 15+ interactive demo components',
        'Created Claude Agent Teams UI — web interface for AI agent management with kanban board',
        'Developed a cross-platform notification system in Go (claude-notifications-go)',
        'Optimized build time by 12% through dependency analysis and npm cleanup',
        'Wrote 36+ unit tests for critical components',
      ],
      stack: ['Vue 3', 'TypeScript', 'VitePress', 'Go', 'Vitest', 'Pinia', 'WebSocket'],
    },
    {
      company: 'Web Studio',
      position: 'Frontend Developer',
      period: '2021 — 2023',
      location: 'Ukraine',
      description: 'Development of client-side applications for e-commerce, CRM systems, and corporate clients.',
      achievements: [
        'Built 12+ SPAs and landing pages with Vue.js / Nuxt',
        'Created a CRM system on Nuxt with client management and analytics',
        'Developed Nova Poshta parcel tracker with REST API integration',
        'Integrated REST API and GraphQL endpoints',
        'Set up CI/CD pipelines with automated deployment to Firebase',
        'Built an Electron desktop app for English language learning',
      ],
      stack: ['Vue 2/3', 'Nuxt', 'SCSS', 'Electron', 'Firebase', 'REST API', 'Docker'],
    },
    {
      company: 'Freelance',
      position: 'Web Developer',
      period: '2019 — 2021',
      description: 'Freelance website and web application development for small businesses. Delivered 20+ projects of varying complexity.',
      achievements: [
        'Delivered 20+ projects: from landing pages to full-scale SPAs',
        'Developed a browser extension for CSGO FaceIT player statistics tracking',
        'Worked with PHP/Laravel on backend, Express/MongoDB on Node.js',
        'Mastered the Vue.js ecosystem and transitioned to TypeScript',
        'Published Bible Online app on Google Play Store',
      ],
      stack: ['JavaScript', 'Vue.js', 'PHP', 'Laravel', 'MySQL', 'Express', 'MongoDB'],
    },
  ],

  education: [
    {
      institution: 'University',
      degree: 'Bachelor of Computer Science',
      period: '2015 — 2019',
      description: 'Specialization: Software Engineering',
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
      category: 'Tools & DevOps',
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
    // --- AI & Developer Tools ---
    {
      name: 'Claude Agent Teams UI',
      description: 'Web interface for managing AI agent teams with kanban board, task tracking, and WebSocket updates.',
      stack: ['TypeScript', 'Vue 3', 'WebSocket', 'Pinia'],
      category: 'AI',
      highlights: ['Kanban board with drag-and-drop', 'Real-time process monitoring', 'Task system with comments and reviews'],
      links: [{ label: 'GitHub', url: 'https://github.com/AlexeyZelenko/claude_agent_teams_ui' }],
    },
    {
      name: 'Claude Notifications (Go)',
      description: 'Cross-platform notification system for Claude Code — sound alerts and task monitoring.',
      stack: ['Go', 'Cross-platform', 'CLI', 'System Notifications'],
      category: 'AI',
      highlights: ['Built in Go for performance', 'Windows/macOS/Linux', 'Customizable sounds and filters'],
      links: [{ label: 'GitHub', url: 'https://github.com/AlexeyZelenko/claude-notifications-go' }],
    },
    // --- Web Applications ---
    {
      name: 'IT Reference (VitePress)',
      description: 'Comprehensive IT technology reference with 15+ interactive components, dark theme, and SEO optimization.',
      stack: ['VitePress', 'Vue 3', 'TypeScript', 'CSS', 'Vitest'],
      category: 'Web',
      highlights: ['15+ interactive demo components', 'PDF resume export', 'Multi-language (ru/uk/en)'],
      links: [
        { label: 'GitHub', url: 'https://github.com/AlexeyZelenko/vitepress' },
        { label: 'Demo', url: 'https://alexeyzelenko.github.io/vitepress/' },
      ],
    },
    {
      name: 'CRM System',
      description: 'CRM system for managing clients, orders, and analytics on Nuxt.',
      stack: ['Nuxt', 'Vue 3', 'Vuex', 'Firebase', 'SCSS'],
      category: 'Web',
      highlights: ['Dashboard with analytics', 'Client and order management', 'Firebase authentication'],
      links: [{ label: 'GitHub', url: 'https://github.com/AlexeyZelenko/crm-system-nuxt' }],
    },
    {
      name: 'Nova Poshta Tracker',
      description: 'Parcel tracker for Nova Poshta with real-time delivery status monitoring.',
      stack: ['TypeScript', 'Vue 3', 'REST API', 'Pinia'],
      category: 'Web',
      highlights: ['Nova Poshta API integration', 'Push notifications on status change', 'Shipment history'],
      links: [{ label: 'GitHub', url: 'https://github.com/AlexeyZelenko/nova_poshta_tracker' }],
    },
    {
      name: 'Art Studio',
      description: 'Web application for an art studio — gallery, video content, booking, and content management.',
      stack: ['TypeScript', 'Vue 3', 'Firebase', 'Cloud Storage'],
      category: 'Web',
      highlights: ['Gallery with filtering', 'Video content', 'Online booking'],
      links: [{ label: 'GitHub', url: 'https://github.com/AlexeyZelenko/art-studio' }],
    },
    {
      name: 'Art Studio Video',
      description: 'Extension of art studio with video gallery and content streaming.',
      stack: ['TypeScript', 'Vue 3', 'Firebase', 'Video.js'],
      category: 'Web',
      links: [{ label: 'GitHub', url: 'https://github.com/AlexeyZelenko/art_studio_video' }],
    },
    {
      name: 'Fitness Tracker',
      description: 'Application for tracking workouts, nutrition, and progress with charts and analytics.',
      stack: ['TypeScript', 'Vue 3', 'Chart.js', 'PWA'],
      category: 'Web',
      highlights: ['Progress visualization', 'Calorie calculator', 'PWA for mobile'],
      links: [{ label: 'GitHub', url: 'https://github.com/AlexeyZelenko/fitnes_ex' }],
    },
    {
      name: 'Aid Ukraine',
      description: 'Platform for coordinating humanitarian aid with maps and resource database.',
      stack: ['Vue.js', 'Firebase', 'Google Maps API', 'Firestore'],
      category: 'Web',
      highlights: ['Interactive resource map', 'Real-time updates', 'Volunteer network'],
      links: [{ label: 'GitHub', url: 'https://github.com/AlexeyZelenko/aid_ukraine' }],
    },
    {
      name: 'BV CK UA',
      description: 'Web application with UI components for an information portal.',
      stack: ['TypeScript', 'Vue 3', 'SCSS', 'Vite'],
      category: 'Web',
      links: [{ label: 'GitHub', url: 'https://github.com/AlexeyZelenko/bv_ck_ua_new' }],
    },
    {
      name: 'Content Wind',
      description: 'Theme for Nuxt Content — lightweight portfolio/blog template with Markdown content.',
      stack: ['Nuxt 3', 'Nuxt Content', 'TailwindCSS'],
      category: 'Web',
      highlights: ['Markdown-based content', 'SEO optimization', 'Minimalist design'],
      links: [{ label: 'GitHub', url: 'https://github.com/AlexeyZelenko/content-wind' }],
    },
    {
      name: 'BV Nuxt',
      description: 'Web application on Nuxt for a regional platform.',
      stack: ['Nuxt', 'Vue.js', 'Vuex', 'SCSS'],
      category: 'Web',
      links: [{ label: 'GitHub', url: 'https://github.com/AlexeyZelenko/bv-nuxt' }],
    },
    {
      name: 'Aleksandr Portfolio',
      description: 'Personal portfolio website with animations and responsive design.',
      stack: ['Vue.js', 'CSS3', 'Animations'],
      category: 'Web',
      links: [{ label: 'GitHub', url: 'https://github.com/AlexeyZelenko/aleksandr' }],
    },
    {
      name: 'CodeDZEN',
      description: 'Platform for learning programming with interactive tasks.',
      stack: ['Vue.js', 'JavaScript', 'Firebase'],
      category: 'Web',
      links: [{ label: 'GitHub', url: 'https://github.com/AlexeyZelenko/codeDZEN' }],
    },
    {
      name: 'FriendlyChat',
      description: 'Chat application on Firebase with Google authentication and real-time messaging.',
      stack: ['JavaScript', 'Firebase', 'Cloud Messaging', 'Auth'],
      category: 'Web',
      highlights: ['Google Auth', 'Firestore real-time', 'Cloud Functions'],
      links: [{ label: 'GitHub', url: 'https://github.com/AlexeyZelenko/codelab-friendlychat-web' }],
    },
    // --- Desktop ---
    {
      name: 'Electron English Dictionary',
      description: 'Desktop application for learning English with flashcards, tests, and progress tracking.',
      stack: ['Electron', 'Vue.js', 'Node.js', 'SQLite'],
      category: 'Desktop',
      highlights: ['Flashcards with spaced repetition', 'Tests and statistics', 'Offline mode'],
      links: [{ label: 'GitHub', url: 'https://github.com/AlexeyZelenko/electron_english' }],
    },
    {
      name: 'Bot BLV',
      description: 'Automated bot for data processing and task execution.',
      stack: ['JavaScript', 'Node.js', 'Automation'],
      category: 'Desktop',
      links: [{ label: 'GitHub', url: 'https://github.com/AlexeyZelenko/bot_blv' }],
    },
    // --- Browser Extensions ---
    {
      name: 'CSGO FaceIT Tracker',
      description: 'Extension for tracking CSGO player statistics on FaceIT with ratings and match history.',
      stack: ['JavaScript', 'Chrome Extensions API', 'FaceIT API'],
      category: 'Extensions',
      highlights: ['Real-time statistics', 'Rating and ELO', 'Match history'],
      links: [{ label: 'GitHub', url: 'https://github.com/AlexeyZelenko/browser-extension-faceit-csgo' }],
    },
    {
      name: 'Page Summarizer',
      description: 'Extension for summarizing web page content — extracting key points.',
      stack: ['Vue.js', 'Chrome Extensions API', 'NLP'],
      category: 'Extensions',
      highlights: ['Key phrase extraction', 'Popup interface', 'Customizable output'],
      links: [{ label: 'GitHub', url: 'https://github.com/AlexeyZelenko/Page-Summarizer' }],
    },
    {
      name: 'Tab Master',
      description: 'Extension for managing tabs — grouping, searching, and quick switching.',
      stack: ['Vue.js', 'Chrome Extensions API', 'Chrome Tabs API'],
      category: 'Extensions',
      links: [{ label: 'GitHub', url: 'https://github.com/AlexeyZelenko/tab_master' }],
    },
    // --- Backend ---
    {
      name: 'Express Mongo Todos',
      description: 'REST API for task management with Express + MongoDB and JWT authentication.',
      stack: ['Express', 'MongoDB', 'Node.js', 'JWT', 'Mongoose'],
      category: 'Backend',
      highlights: ['JWT authentication', 'CRUD operations', 'Data validation'],
      links: [{ label: 'GitHub', url: 'https://github.com/AlexeyZelenko/express-mongo-todos' }],
    },
    {
      name: 'API Connectors (BitMEX)',
      description: 'API connectors to BitMEX exchange for trading operations and market data.',
      stack: ['JavaScript', 'REST API', 'WebSocket', 'Crypto'],
      category: 'Backend',
      highlights: ['WebSocket streaming', 'Trading orders', 'Market data processing'],
      links: [{ label: 'GitHub', url: 'https://github.com/AlexeyZelenko/api-connectors' }],
    },
    // --- Mobile ---
    {
      name: 'Bible Online',
      description: 'Mobile application for reading the Bible, published on Google Play Store.',
      stack: ['JavaScript', 'Firebase', 'Google Play', 'PWA'],
      category: 'Mobile',
      highlights: ['Published on Google Play', 'Offline reading', 'Text search'],
      links: [{ label: 'GitHub', url: 'https://github.com/AlexeyZelenko/Bible_online_Google' }],
    },
  ],

  expertise: [
    'Web Application Development (SPA/SSR)',
    'Desktop Applications (Electron)',
    'Browser Extensions (Chrome)',
    'AI Tools & Integrations',
    'Documentation Systems (VitePress)',
    'REST/GraphQL/WebSocket API Integration',
    'CRM & Business Systems',
    'Firebase & Cloud Infrastructure',
    'Cross-platform Development',
  ],

  languages: [
    { language: 'Ukrainian', level: 'Native' },
    { language: 'Russian', level: 'Fluent' },
    { language: 'English', level: 'B2 (Upper-Intermediate)' },
  ],
}

export default data
