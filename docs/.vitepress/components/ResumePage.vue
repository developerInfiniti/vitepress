<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useResume } from '../composables/useResume'
import type { ResumeData } from '../data/resume/types'
import ResumeHeader from './resume/ResumeHeader.vue'
import ResumeSection from './resume/ResumeSection.vue'
import ResumeSkills from './resume/ResumeSkills.vue'
import ResumeTimeline from './resume/ResumeTimeline.vue'
import ResumeProjects from './resume/ResumeProjects.vue'
import './resume/print.css'

const { locale, loadResumeData, exportPDF } = useResume()
const data = ref<ResumeData | null>(null)
const loading = ref(true)

async function load() {
  loading.value = true
  data.value = await loadResumeData()
  loading.value = false
}

onMounted(load)
watch(locale, load)

const labels: Record<string, Record<string, string>> = {
  ru: { download: 'Скачать PDF', experience: 'Опыт работы', education: 'Образование', skills: 'Навыки', projects: 'Проекты', languages: 'Языки', certs: 'Сертификаты' },
  uk: { download: 'Завантажити PDF', experience: 'Досвід роботи', education: 'Освіта', skills: 'Навички', projects: 'Проєкти', languages: 'Мови', certs: 'Сертифікати' },
  en: { download: 'Download PDF', experience: 'Experience', education: 'Education', skills: 'Skills', projects: 'Projects', languages: 'Languages', certs: 'Certifications' },
}
</script>

<template>
  <div class="resume-page" v-if="data">
    <div class="resume-actions no-print">
      <button class="resume-pdf-btn" @click="exportPDF">
        {{ labels[locale].download }}
      </button>
    </div>

    <ResumeHeader :header="data.header" :summary="data.summary" />

    <ResumeTimeline
      :title="labels[locale].experience"
      :items="data.experience"
      type="experience"
    />

    <ResumeSkills
      :title="labels[locale].skills"
      :groups="data.skills"
    />

    <ResumeProjects
      :title="labels[locale].projects"
      :projects="data.projects"
    />

    <ResumeTimeline
      :title="labels[locale].education"
      :items="data.education"
      type="education"
    />

    <ResumeSection
      v-if="data.languages?.length"
      :title="labels[locale].languages"
    >
      <div class="resume-languages">
        <span v-for="lang in data.languages" :key="lang.language" class="resume-lang-badge">
          {{ lang.language }} — {{ lang.level }}
        </span>
      </div>
    </ResumeSection>

    <ResumeSection
      v-if="data.certifications?.length"
      :title="labels[locale].certs"
    >
      <ul class="resume-certs-list">
        <li v-for="cert in data.certifications" :key="cert.name">
          <a v-if="cert.link" :href="cert.link" target="_blank" rel="noopener noreferrer">{{ cert.name }}</a>
          <span v-else>{{ cert.name }}</span>
          — {{ cert.issuer }} ({{ cert.year }})
        </li>
      </ul>
    </ResumeSection>
  </div>

  <div v-else-if="loading" class="resume-loading">
    <p>Loading...</p>
  </div>
</template>

<style scoped>
.resume-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px 0;
}

.resume-actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.resume-pdf-btn {
  padding: 8px 20px;
  background: var(--vp-c-brand-1);
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 0.9em;
  cursor: pointer;
  transition: background 0.2s;
}

.resume-pdf-btn:hover {
  background: var(--vp-c-brand-2);
}

.resume-languages {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.resume-lang-badge {
  padding: 4px 14px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  font-size: 0.9em;
  color: var(--vp-c-text-1);
}

.resume-certs-list {
  padding-left: 20px;
  font-size: 0.9em;
  color: var(--vp-c-text-2);
  line-height: 1.7;
}

.resume-certs-list a {
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.resume-certs-list a:hover {
  text-decoration: underline;
}

.resume-loading {
  text-align: center;
  padding: 40px;
  color: var(--vp-c-text-3);
}

@media (max-width: 640px) {
  .resume-actions {
    position: sticky;
    bottom: 16px;
    z-index: 10;
    justify-content: center;
  }

  .resume-pdf-btn {
    width: 100%;
    padding: 12px;
  }
}
</style>
