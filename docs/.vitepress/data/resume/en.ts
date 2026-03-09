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
  summary: 'Full-Stack developer with 88+ public projects on GitHub. Specializing in Vue.js, TypeScript, and modern web technologies. Experienced in building interactive UI components, AI tools, documentation, and cross-platform solutions.',

  experience: [
    {
      company: 'IT Company',
      position: 'Senior Frontend Developer',
      period: '2023 — Present',
      location: 'Remote',
      description: 'Development and maintenance of a large-scale web application on Vue 3 with TypeScript.',
      achievements: [
        'Designed component architecture with Composition API and composables',
        'Implemented a VitePress-based documentation system with interactive demos',
        'Optimized build time by 12% through dependency analysis',
        'Wrote 36+ unit tests for critical components',
        'Developed AI tools for team collaboration (Claude Agent Teams UI)',
      ],
      stack: ['Vue 3', 'TypeScript', 'VitePress', 'Vitest', 'Pinia', 'Go'],
    },
    {
      company: 'Web Studio',
      position: 'Frontend Developer',
      period: '2021 — 2023',
      location: 'Ukraine',
      description: 'Development of client-side applications for e-commerce and corporate clients.',
      achievements: [
        'Built 10+ landing pages and SPAs with Vue.js',
        'Integrated REST API and GraphQL endpoints',
        'Set up CI/CD pipelines with automated deployment',
      ],
      stack: ['Vue 2/3', 'Nuxt', 'SCSS', 'REST API', 'Docker'],
    },
    {
      company: 'Freelance',
      position: 'Web Developer',
      period: '2019 — 2021',
      description: 'Freelance website and web application development for small businesses.',
      achievements: [
        'Delivered 20+ projects of varying complexity',
        'Worked with PHP/Laravel on the backend',
        'Mastered the Vue.js ecosystem from scratch',
      ],
      stack: ['JavaScript', 'Vue.js', 'PHP', 'Laravel', 'MySQL'],
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
        { name: 'Vue.js / Nuxt', level: 90 },
        { name: 'TypeScript', level: 85 },
        { name: 'JavaScript (ES6+)', level: 90 },
        { name: 'HTML5 / CSS3 / SCSS', level: 90 },
        { name: 'React (basic)', level: 50 },
      ],
    },
    {
      category: 'Tools',
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
        { name: 'Go', level: 55 },
        { name: 'PHP / Laravel', level: 60 },
        { name: 'MySQL / PostgreSQL', level: 65 },
        { name: 'REST API / GraphQL', level: 75 },
      ],
    },
  ],

  projects: [
    {
      name: 'IT Reference (VitePress)',
      description: 'IT technology reference documentation with interactive components, dark theme, and SEO optimization.',
      stack: ['VitePress', 'Vue 3', 'TypeScript', 'CSS'],
      links: [
        { label: 'GitHub', url: 'https://github.com/AlexeyZelenko/vitepress' },
        { label: 'Demo', url: 'https://alexeyzelenko.github.io/vitepress/' },
      ],
    },
    {
      name: 'Claude Agent Teams UI',
      description: 'Web interface for managing AI agent teams with task tracking, kanban board, and process monitoring.',
      stack: ['TypeScript', 'Vue 3', 'WebSocket'],
      links: [
        { label: 'GitHub', url: 'https://github.com/AlexeyZelenko/claude_agent_teams_ui' },
      ],
    },
    {
      name: 'Claude Notifications (Go)',
      description: 'Cross-platform notification system for Claude Code with sound support, popups, and task monitoring.',
      stack: ['Go', 'Cross-platform', 'System Notifications'],
      links: [
        { label: 'GitHub', url: 'https://github.com/AlexeyZelenko/claude-notifications-go' },
      ],
    },
    {
      name: 'Nova Poshta Tracker',
      description: 'Package tracker for Nova Poshta with real-time delivery status monitoring.',
      stack: ['TypeScript', 'Vue 3', 'REST API'],
      links: [
        { label: 'GitHub', url: 'https://github.com/AlexeyZelenko/nova_poshta_tracker' },
      ],
    },
    {
      name: 'Art Studio',
      description: 'Web application for an art studio with gallery, booking, and content management.',
      stack: ['TypeScript', 'Vue 3', 'Firebase'],
      links: [
        { label: 'GitHub', url: 'https://github.com/AlexeyZelenko/art_studio' },
      ],
    },
  ],

  languages: [
    { language: 'Ukrainian', level: 'Native' },
    { language: 'Russian', level: 'Fluent' },
    { language: 'English', level: 'B2 (Upper-Intermediate)' },
  ],
}

export default data
