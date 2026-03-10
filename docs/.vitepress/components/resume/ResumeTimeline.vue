<script setup lang="ts">
import type { ExperienceItem, EducationItem } from '../../data/resume/types'

const props = defineProps<{
  title: string
  items: ExperienceItem[] | EducationItem[]
  type: 'experience' | 'education'
}>()

function isExperience(item: ExperienceItem | EducationItem): item is ExperienceItem {
  return 'company' in item
}
</script>

<template>
  <section class="resume-section">
    <h2 class="resume-section-title">{{ title }}</h2>
    <div class="timeline">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="timeline-item"
      >
        <div class="timeline-marker" />
        <div class="timeline-content">
          <template v-if="isExperience(item)">
            <div class="timeline-header">
              <h3 class="timeline-title">{{ item.position }}</h3>
              <span class="timeline-period">{{ item.period }}</span>
            </div>
            <p class="timeline-subtitle">
              {{ item.company }}
              <span v-if="item.location" class="timeline-location">{{ item.location }}</span>
            </p>
            <p class="timeline-description">{{ item.description }}</p>
            <ul v-if="item.achievements.length" class="timeline-achievements">
              <li v-for="(achievement, i) in item.achievements" :key="i">
                {{ achievement }}
              </li>
            </ul>
            <div v-if="item.stack.length" class="timeline-stack">
              <span v-for="tech in item.stack" :key="tech" class="stack-tag">{{ tech }}</span>
            </div>
          </template>

          <template v-else>
            <div class="timeline-header">
              <h3 class="timeline-title">{{ item.degree }}</h3>
              <span class="timeline-period">{{ item.period }}</span>
            </div>
            <p class="timeline-subtitle">{{ item.institution }}</p>
            <p v-if="item.description" class="timeline-description">{{ item.description }}</p>
          </template>
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

.timeline {
  position: relative;
  padding-left: 24px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 6px;
  top: 8px;
  bottom: 8px;
  width: 2px;
  background: var(--vp-c-divider);
}

.timeline-item {
  position: relative;
  padding-bottom: 24px;
}

.timeline-item:last-child {
  padding-bottom: 0;
}

.timeline-marker {
  position: absolute;
  left: -21px;
  top: 8px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  border: 2px solid var(--vp-c-bg);
  box-shadow: 0 0 0 2px var(--vp-c-brand-1);
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 4px;
}

.timeline-title {
  font-size: 1.05em;
  margin: 0;
  color: var(--vp-c-text-1);
}

.timeline-period {
  font-size: 0.85em;
  color: var(--vp-c-text-3);
  white-space: nowrap;
}

.timeline-subtitle {
  color: var(--vp-c-brand-1);
  font-size: 0.95em;
  margin: 0 0 8px;
}

.timeline-location {
  color: var(--vp-c-text-3);
  font-size: 0.85em;
}

.timeline-location::before {
  content: ' \xB7 ';
}

.timeline-description {
  color: var(--vp-c-text-2);
  font-size: 0.9em;
  margin: 0 0 8px;
  line-height: 1.5;
}

.timeline-achievements {
  margin: 0 0 10px;
  padding-left: 20px;
  font-size: 0.9em;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  list-style: disc;
}

.timeline-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.stack-tag {
  display: inline-block;
  padding: 2px 10px;
  font-size: 0.8em;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
}

@media (max-width: 640px) {
  .timeline-header {
    flex-direction: column;
    gap: 2px;
  }
}
</style>
