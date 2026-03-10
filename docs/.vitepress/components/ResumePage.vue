<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useResume } from '../composables/useResume'
import type { ResumeData } from '../data/resume/types'
import ResumeHeader from './resume/ResumeHeader.vue'
import ResumeSection from './resume/ResumeSection.vue'
import ResumeSkills from './resume/ResumeSkills.vue'
import ResumeTimeline from './resume/ResumeTimeline.vue'
import ResumeProjects from './resume/ResumeProjects.vue'
import ResumeTOC from './resume/ResumeTOC.vue'
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
  ru: { download: 'Скачать PDF', experience: 'Опыт работы', education: 'Образование', skills: 'Навыки', projects: 'Проекты', languages: 'Языки', certs: 'Сертификаты', expertise: 'Области экспертизы', profile: 'Профиль' },
  uk: { download: 'Завантажити PDF', experience: 'Досвід роботи', education: 'Освіта', skills: 'Навички', projects: 'Проєкти', languages: 'Мови', certs: 'Сертифікати', expertise: 'Області експертизи', profile: 'Профіль' },
  en: { download: 'Download PDF', experience: 'Experience', education: 'Education', skills: 'Skills', projects: 'Projects', languages: 'Languages', certs: 'Certifications', expertise: 'Areas of Expertise', profile: 'Profile' },
}

const tocItems = computed(() => {
  if (!data.value) return []
  const l = labels[locale.value] || labels.ru
  const items = [
    { id: 'resume-profile', label: l.profile },
    { id: 'resume-experience', label: l.experience },
    { id: 'resume-skills', label: l.skills },
  ]
  if (data.value.expertise?.length) {
    items.push({ id: 'resume-expertise', label: l.expertise })
  }
  items.push({ id: 'resume-projects', label: l.projects })
  items.push({ id: 'resume-education', label: l.education })
  if (data.value.languages?.length) {
    items.push({ id: 'resume-languages', label: l.languages })
  }
  if (data.value.certifications?.length) {
    items.push({ id: 'resume-certs', label: l.certs })
  }
  return items
})
</script>

<template>
  <div class="resume-page" v-if="data">
    <ResumeTOC :items="tocItems" />

    <div class="resume-actions no-print">
      <button class="resume-pdf-btn" @click="exportPDF">
        {{ labels[locale].download }}
      </button>
    </div>

    <div id="resume-profile">
      <ResumeHeader :header="data.header" :summary="data.summary" />
    </div>

    <div id="resume-experience">
      <ResumeTimeline
        :title="labels[locale].experience"
        :items="data.experience"
        type="experience"
      />
    </div>

    <div id="resume-skills">
      <ResumeSkills
        :title="labels[locale].skills"
        :groups="data.skills"
      />
    </div>

    <div id="resume-expertise" v-if="data.expertise?.length">
      <ResumeSection :title="labels[locale].expertise">
        <div class="resume-expertise">
          <span v-for="item in data.expertise" :key="item" class="resume-expertise-badge">
            {{ item }}
          </span>
        </div>
      </ResumeSection>
    </div>

    <div id="resume-projects">
      <ResumeProjects
        :title="labels[locale].projects"
        :projects="data.projects"
      />
    </div>

    <div id="resume-education">
      <ResumeTimeline
        :title="labels[locale].education"
        :items="data.education"
        type="education"
      />
    </div>

    <div id="resume-languages" v-if="data.languages?.length">
      <ResumeSection :title="labels[locale].languages">
        <div class="resume-languages">
          <span v-for="lang in data.languages" :key="lang.language" class="resume-lang-badge">
            {{ lang.language }} — {{ lang.level }}
          </span>
        </div>
      </ResumeSection>
    </div>

    <div id="resume-certs" v-if="data.certifications?.length">
      <ResumeSection :title="labels[locale].certs">
        <ul class="resume-certs-list">
          <li v-for="cert in data.certifications" :key="cert.name">
            <a v-if="cert.link" :href="cert.link" target="_blank" rel="noopener noreferrer">{{ cert.name }}</a>
            <span v-else>{{ cert.name }}</span>
            — {{ cert.issuer }} ({{ cert.year }})
          </li>
        </ul>
      </ResumeSection>
    </div>
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
  padding-right: 200px;
}

/* Reset VitePress vp-doc styles that interfere with Resume components */
.resume-page :deep(h1),
.resume-page :deep(h2),
.resume-page :deep(h3),
.resume-page :deep(h4) {
  margin: 0;
  padding: 0;
  border: none;
  letter-spacing: normal;
  line-height: 1.4;
}

.resume-page :deep(p) {
  margin: 0;
}

.resume-page :deep(ul) {
  margin: 0;
  padding-left: 0;
  list-style: none;
}

.resume-page :deep(li + li) {
  margin-top: 0;
}

.resume-page :deep(a) {
  font-weight: normal;
  text-decoration: none;
}

.resume-page :deep(a:hover) {
  text-decoration: none;
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

.resume-expertise {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.resume-expertise-badge {
  padding: 6px 14px;
  background: var(--vp-c-brand-soft);
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 16px;
  font-size: 0.85em;
  color: var(--vp-c-brand-1);
  font-weight: 500;
}

.resume-certs-list {
  padding-left: 20px;
  font-size: 0.9em;
  color: var(--vp-c-text-2);
  line-height: 1.7;
  list-style: disc;
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

@media (max-width: 1024px) {
  .resume-page {
    padding-right: 0;
  }
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
