<script setup lang="ts">
import type { ResumeHeader } from '../../data/resume/types'

defineProps<{
  header: ResumeHeader
  summary: string
}>()

const iconMap: Record<string, string> = {
  email: '\u2709',
  phone: '\u260E',
  github: '\uD83D\uDCBB',
  linkedin: '\uD83D\uDD17',
  telegram: '\u2708',
  location: '\uD83D\uDCCD',
}
</script>

<template>
  <header class="resume-header">
    <div class="resume-header-info">
      <h1 class="resume-name">{{ header.name }}</h1>
      <p class="resume-title">{{ header.title }}</p>
      <div class="resume-contacts">
        <a
          v-for="contact in header.contacts"
          :key="contact.label"
          :href="contact.link"
          :target="contact.link?.startsWith('http') ? '_blank' : undefined"
          :rel="contact.link?.startsWith('http') ? 'noopener noreferrer' : undefined"
          class="resume-contact-item"
        >
          <span class="resume-contact-icon">{{ iconMap[contact.icon] || contact.icon }}</span>
          <span class="resume-contact-value">{{ contact.value }}</span>
        </a>
      </div>
    </div>
    <p class="resume-summary">{{ summary }}</p>
  </header>
</template>

<style scoped>
.resume-header {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 2px solid var(--vp-c-divider);
}

.resume-name {
  font-size: 2em;
  margin: 0 0 4px;
  color: var(--vp-c-text-1);
}

.resume-title {
  font-size: 1.2em;
  color: var(--vp-c-brand-1);
  margin: 0 0 16px;
  font-weight: 500;
}

.resume-contacts {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 20px;
}

.resume-contact-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--vp-c-text-2);
  text-decoration: none;
  font-size: 0.9em;
  transition: color 0.2s;
}

.resume-contact-item:hover {
  color: var(--vp-c-brand-1);
}

.resume-contact-icon {
  font-size: 1.1em;
}

.resume-summary {
  margin: 20px 0 0;
  color: var(--vp-c-text-2);
  line-height: 1.7;
  font-size: 0.95em;
}

@media (max-width: 640px) {
  .resume-name {
    font-size: 1.6em;
  }

  .resume-contacts {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
