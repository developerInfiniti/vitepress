<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface TocItem {
  id: string
  label: string
}

const props = defineProps<{
  items: TocItem[]
}>()

const activeId = ref('')
let observer: IntersectionObserver | null = null

function scrollTo(id: string) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          activeId.value = entry.target.id
        }
      }
    },
    { rootMargin: '-80px 0px -60% 0px', threshold: 0.1 }
  )

  for (const item of props.items) {
    const el = document.getElementById(item.id)
    if (el) observer.observe(el)
  }
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<template>
  <nav class="resume-toc no-print" role="navigation" aria-label="Resume navigation">
    <ul class="resume-toc-list">
      <li
        v-for="item in items"
        :key="item.id"
        class="resume-toc-item"
      >
        <a
          :href="`#${item.id}`"
          class="resume-toc-link"
          :class="{ active: activeId === item.id }"
          :aria-current="activeId === item.id ? 'location' : undefined"
          @click.prevent="scrollTo(item.id)"
        >
          {{ item.label }}
        </a>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.resume-toc {
  position: fixed;
  right: calc((100vw - 800px) / 2 + 20px);
  top: calc(var(--vp-nav-height) + 40px);
  width: 160px;
  z-index: 10;
}

.resume-toc-list {
  list-style: none;
  margin: 0;
  padding: 0;
  border-left: 2px solid var(--vp-c-divider);
}

.resume-toc-item {
  margin: 0;
}

.resume-toc-link {
  display: block;
  padding: 4px 0 4px 12px;
  font-size: 12px;
  line-height: 1.4;
  color: var(--vp-c-text-3);
  text-decoration: none;
  border-left: 2px solid transparent;
  margin-left: -2px;
  transition: color 0.2s, border-color 0.2s;
}

.resume-toc-link:hover {
  color: var(--vp-c-text-1);
}

.resume-toc-link.active {
  color: var(--vp-c-brand-1);
  border-left-color: var(--vp-c-brand-1);
  font-weight: 500;
}

@media (max-width: 1024px) {
  .resume-toc {
    display: none;
  }
}
</style>
