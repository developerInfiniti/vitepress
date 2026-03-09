<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ProjectItem } from '../../data/resume/types'

const props = defineProps<{
  title: string
  projects: ProjectItem[]
}>()

const activeCategory = ref<string>('all')

const categories = computed(() => {
  const cats = new Set<string>()
  props.projects.forEach(p => {
    if (p.category) cats.add(p.category)
  })
  return Array.from(cats)
})

const filteredProjects = computed(() => {
  if (activeCategory.value === 'all') return props.projects
  return props.projects.filter(p => p.category === activeCategory.value)
})
</script>

<template>
  <section class="resume-section">
    <h2 class="resume-section-title">{{ title }}</h2>

    <div v-if="categories.length > 1" class="projects-filters no-print">
      <button
        class="filter-btn"
        :class="{ active: activeCategory === 'all' }"
        @click="activeCategory = 'all'"
      >
        All ({{ projects.length }})
      </button>
      <button
        v-for="cat in categories"
        :key="cat"
        class="filter-btn"
        :class="{ active: activeCategory === cat }"
        @click="activeCategory = cat"
      >
        {{ cat }} ({{ projects.filter(p => p.category === cat).length }})
      </button>
    </div>

    <div class="projects-grid">
      <div v-for="project in filteredProjects" :key="project.name" class="project-card">
        <div class="project-header">
          <h3 class="project-name">{{ project.name }}</h3>
          <span v-if="project.category" class="project-category">{{ project.category }}</span>
        </div>
        <p class="project-description">{{ project.description }}</p>
        <ul v-if="project.highlights?.length" class="project-highlights">
          <li v-for="h in project.highlights" :key="h">{{ h }}</li>
        </ul>
        <div class="project-stack">
          <span v-for="tech in project.stack" :key="tech" class="stack-tag">{{ tech }}</span>
        </div>
        <div class="project-links">
          <a
            v-for="link in project.links"
            :key="link.url"
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer"
            class="project-link"
          >
            {{ link.label }}
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.resume-section {
  margin-bottom: 28px;
  break-inside: avoid;
}

.resume-section-title {
  font-size: 1.3em;
  color: var(--vp-c-text-1);
  margin: 0 0 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.projects-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
}

.filter-btn {
  padding: 4px 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 0.82em;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.filter-btn.active {
  background: var(--vp-c-brand-1);
  color: #fff;
  border-color: var(--vp-c-brand-1);
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 14px;
}

.project-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 14px 16px;
  background: var(--vp-c-bg-soft);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.project-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 6px;
}

.project-name {
  font-size: 1em;
  margin: 0;
  color: var(--vp-c-text-1);
}

.project-category {
  font-size: 0.72em;
  padding: 1px 8px;
  border-radius: 10px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  white-space: nowrap;
  flex-shrink: 0;
}

.project-description {
  font-size: 0.85em;
  color: var(--vp-c-text-2);
  margin: 0 0 8px;
  line-height: 1.5;
}

.project-highlights {
  margin: 0 0 8px;
  padding-left: 18px;
  font-size: 0.82em;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

.project-highlights li {
  margin-bottom: 2px;
}

.project-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 8px;
}

.stack-tag {
  display: inline-block;
  padding: 1px 8px;
  font-size: 0.75em;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
}

.project-links {
  display: flex;
  gap: 10px;
}

.project-link {
  font-size: 0.82em;
  color: var(--vp-c-brand-1);
  text-decoration: none;
  transition: color 0.2s;
}

.project-link:hover {
  color: var(--vp-c-brand-2);
  text-decoration: underline;
}

@media (max-width: 640px) {
  .projects-grid {
    grid-template-columns: 1fr;
  }
}

@media print {
  .projects-filters {
    display: none;
  }

  .projects-grid {
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .project-card {
    padding: 8px 10px;
    break-inside: avoid;
  }

  .project-highlights {
    display: none;
  }
}
</style>
