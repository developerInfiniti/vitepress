<script setup lang="ts">
import type { ProjectItem } from '../../data/resume/types'

defineProps<{
  title: string
  projects: ProjectItem[]
}>()
</script>

<template>
  <section class="resume-section">
    <h2 class="resume-section-title">{{ title }}</h2>
    <div class="projects-grid">
      <div v-for="project in projects" :key="project.name" class="project-card">
        <h3 class="project-name">{{ project.name }}</h3>
        <p class="project-description">{{ project.description }}</p>
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

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.project-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 16px;
  background: var(--vp-c-bg-soft);
  transition: border-color 0.2s;
}

.project-card:hover {
  border-color: var(--vp-c-brand-1);
}

.project-name {
  font-size: 1.05em;
  margin: 0 0 8px;
  color: var(--vp-c-text-1);
}

.project-description {
  font-size: 0.9em;
  color: var(--vp-c-text-2);
  margin: 0 0 12px;
  line-height: 1.5;
}

.project-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.stack-tag {
  display: inline-block;
  padding: 2px 10px;
  font-size: 0.8em;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
}

.project-links {
  display: flex;
  gap: 12px;
}

.project-link {
  font-size: 0.85em;
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
</style>
