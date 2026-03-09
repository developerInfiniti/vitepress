<script setup lang="ts">
import { computed } from 'vue'
import { useData, useRoute } from 'vitepress'

interface BreadcrumbItem {
  text: string
  link: string
}

const { site } = useData()
const route = useRoute()

const sectionNames: Record<string, string> = {
  basics_js: 'JavaScript',
  basics_ts: 'TypeScript',
  basics_vue: 'Vue',
  basics_react: 'React',
  basics_css: 'CSS',
  basics_scss: 'SCSS',
  basics_html: 'HTML',
  basics_angular: 'Angular',
  basics_mysql: 'MySQL',
  basics_php: 'PHP',
  basics_git: 'Git',
  basics_nodejs: 'Node.js',
  basics_nuxt: 'Nuxt',
  basics_python: 'Python',
  basics_api: 'API',
  basics_graphql: 'GraphQL',
  basics_testing: 'Testing',
  basics_playwright: 'Playwright',
  basic_laravel: 'Laravel',
  basic_docker: 'Docker',
  basic_flutter: 'Flutter',
  basic_dart: 'Dart',
  design_patterns: 'Паттерны',
  system_design: 'Системный дизайн',
  algorithms: 'Алгоритмы',
  api_basics: 'REST API',
  guide: 'Руководства',
  other: 'Разное',
  cheatsheet: 'Шпаргалки',
}

const breadcrumbs = computed<BreadcrumbItem[]>(() => {
  const path = route.path
  if (!path || path === '/' || path === site.value.base) return []

  const relativePath = path.replace(site.value.base, '').replace(/\.html$/, '').replace(/\/$/, '')
  if (!relativePath) return []

  const parts = relativePath.split('/').filter(Boolean)
  const items: BreadcrumbItem[] = [{ text: 'Главная', link: '/' }]

  let currentPath = ''
  parts.forEach((part, index) => {
    currentPath += `/${part}`
    const isLast = index === parts.length - 1
    const displayName = index === 0
      ? sectionNames[part] || formatPartName(part)
      : formatPartName(part)

    items.push({
      text: displayName,
      link: isLast ? '' : `${currentPath}`,
    })
  })

  return items
})

function formatPartName(part: string): string {
  return part
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
}
</script>

<template>
  <nav v-if="breadcrumbs.length > 1" class="breadcrumb" aria-label="Навигация">
    <ol class="breadcrumb-list">
      <li
        v-for="(item, index) in breadcrumbs"
        :key="index"
        class="breadcrumb-item"
        :class="{ 'breadcrumb-middle': index > 0 && index < breadcrumbs.length - 1 }"
      >
        <a v-if="item.link" :href="item.link" class="breadcrumb-link">
          {{ item.text }}
        </a>
        <span v-else class="breadcrumb-current">{{ item.text }}</span>
        <span v-if="index < breadcrumbs.length - 1" class="breadcrumb-separator">/</span>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.breadcrumb {
  padding: 8px 0;
  margin-bottom: 8px;
  font-size: 13px;
  line-height: 1.4;
}

.breadcrumb-list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 2px;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  gap: 2px;
}

.breadcrumb-separator {
  color: var(--vp-c-text-3);
  margin: 0 4px;
  user-select: none;
}

.breadcrumb-link {
  color: var(--vp-c-brand-1);
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumb-link:hover {
  color: var(--vp-c-brand-2);
  text-decoration: underline;
}

.breadcrumb-current {
  color: var(--vp-c-text-2);
  font-weight: 500;
}

@media (max-width: 640px) {
  .breadcrumb-middle {
    display: none;
  }

  /* Show ellipsis when middle items are hidden */
  .breadcrumb-item:first-child + .breadcrumb-middle ~ .breadcrumb-item:last-child::before {
    content: '... /';
    color: var(--vp-c-text-3);
    margin-right: 6px;
  }
}
</style>
