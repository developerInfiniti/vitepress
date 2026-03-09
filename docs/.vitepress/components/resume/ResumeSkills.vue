<script setup lang="ts">
import type { SkillGroup } from '../../data/resume/types'

defineProps<{
  title: string
  groups: SkillGroup[]
}>()
</script>

<template>
  <section class="resume-section">
    <h2 class="resume-section-title">{{ title }}</h2>
    <div class="skills-grid">
      <div v-for="group in groups" :key="group.category" class="skill-group">
        <h3 class="skill-category">{{ group.category }}</h3>
        <div class="skill-list">
          <div v-for="skill in group.skills" :key="skill.name" class="skill-item">
            <div class="skill-info">
              <span class="skill-name">{{ skill.name }}</span>
              <span class="skill-level">{{ skill.level }}%</span>
            </div>
            <div class="skill-bar">
              <div
                class="skill-bar-fill"
                :style="{ width: skill.level + '%' }"
              />
            </div>
          </div>
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

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.skill-category {
  font-size: 1em;
  color: var(--vp-c-brand-1);
  margin: 0 0 12px;
}

.skill-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.skill-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  font-size: 0.9em;
}

.skill-name {
  color: var(--vp-c-text-1);
}

.skill-level {
  color: var(--vp-c-text-3);
  font-size: 0.85em;
}

.skill-bar {
  height: 6px;
  background: var(--vp-c-bg-soft);
  border-radius: 3px;
  overflow: hidden;
}

.skill-bar-fill {
  height: 100%;
  background: var(--vp-c-brand-1);
  border-radius: 3px;
  transition: width 0.6s ease;
  print-color-adjust: exact;
  -webkit-print-color-adjust: exact;
}

@media (max-width: 640px) {
  .skills-grid {
    grid-template-columns: 1fr;
  }
}
</style>
