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
    {
      name: 'IT Reference (VitePress)',
      description: 'Comprehensive IT technology reference with 15+ interactive Vue components, dark theme, SEO optimization, and PDF resume export.',
      stack: ['VitePress', 'Vue 3', 'TypeScript', 'CSS', 'Vitest'],
      links: [
        { label: 'GitHub', url: 'https://github.com/AlexeyZelenko/vitepress' },
        { label: 'Demo', url: 'https://alexeyzelenko.github.io/vitepress/' },
      ],
    },
    {
      name: 'Claude Agent Teams UI',
      description: 'Web interface for managing AI agent teams with kanban board, task tracking, process monitoring, and WebSocket updates.',
      stack: ['TypeScript', 'Vue 3', 'WebSocket', 'Pinia'],
      links: [
        { label: 'GitHub', url: 'https://github.com/AlexeyZelenko/claude_agent_teams_ui' },
      ],
    },
    {
      name: 'Claude Notifications (Go)',
      description: 'Cross-platform notification system for Claude Code — sound alerts, popups, and task monitoring. Written in Go.',
      stack: ['Go', 'Cross-platform', 'System Notifications'],
      links: [
        { label: 'GitHub', url: 'https://github.com/AlexeyZelenko/claude-notifications-go' },
      ],
    },
    {
      name: 'CRM System (Nuxt)',
      description: 'CRM system for managing clients, orders, and analytics. Full-featured business application built on Nuxt.',
      stack: ['Nuxt', 'Vue 3', 'Vuex', 'Firebase'],
      links: [
        { label: 'GitHub', url: 'https://github.com/AlexeyZelenko/crm-system-nuxt' },
      ],
    },
    {
      name: 'Nova Poshta Tracker',
      description: 'Parcel tracker for Nova Poshta with real-time delivery status monitoring via REST API.',
      stack: ['TypeScript', 'Vue 3', 'REST API'],
      links: [
        { label: 'GitHub', url: 'https://github.com/AlexeyZelenko/nova_poshta_tracker' },
      ],
    },
    {
      name: 'Art Studio',
      description: 'Web application for an art studio — gallery, video content, booking, and content management.',
      stack: ['TypeScript', 'Vue 3', 'Firebase'],
      links: [
        { label: 'GitHub', url: 'https://github.com/AlexeyZelenko/art-studio' },
      ],
    },
    {
      name: 'Fitness Tracker',
      description: 'Application for tracking workouts, nutrition, and progress with data visualization.',
      stack: ['TypeScript', 'Vue 3', 'Chart.js'],
      links: [
        { label: 'GitHub', url: 'https://github.com/AlexeyZelenko/fitnes_ex' },
      ],
    },
    {
      name: 'Electron English Dictionary',
      description: 'Desktop application for learning English with flashcards, tests, and progress tracking.',
      stack: ['Electron', 'Vue.js', 'Node.js'],
      links: [
        { label: 'GitHub', url: 'https://github.com/AlexeyZelenko/electron_english' },
      ],
    },
    {
      name: 'CSGO FaceIT Tracker',
      description: 'Browser extension for tracking CSGO player statistics on the FaceIT platform.',
      stack: ['JavaScript', 'Chrome Extensions API', 'FaceIT API'],
      links: [
        { label: 'GitHub', url: 'https://github.com/AlexeyZelenko/browser-extension-faceit-csgo' },
      ],
    },
    {
      name: 'Aid Ukraine',
      description: 'Web platform for coordinating humanitarian aid to Ukraine with maps and resource database.',
      stack: ['Vue.js', 'Firebase', 'Google Maps API'],
      links: [
        { label: 'GitHub', url: 'https://github.com/AlexeyZelenko/aid_ukraine' },
      ],
    },
    {
      name: 'Express Mongo Todos',
      description: 'REST API for task management — Express backend with MongoDB, authentication, and CRUD operations.',
      stack: ['Express', 'MongoDB', 'Node.js', 'JWT'],
      links: [
        { label: 'GitHub', url: 'https://github.com/AlexeyZelenko/express-mongo-todos' },
      ],
    },
    {
      name: 'API Connectors (BitMEX)',
      description: 'API connectors for BitMEX exchange for trading operations and market data retrieval.',
      stack: ['JavaScript', 'REST API', 'WebSocket'],
      links: [
        { label: 'GitHub', url: 'https://github.com/AlexeyZelenko/api-connectors' },
      ],
    },
    {
      name: 'Bible Online',
      description: 'Mobile application for reading the Bible online, published on Google Play Store.',
      stack: ['JavaScript', 'Firebase', 'Google Play'],
      links: [
        { label: 'GitHub', url: 'https://github.com/AlexeyZelenko/Bible_online_Google' },
      ],
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
