<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <section class="resume-section">
    <h2 class="resume-section-title">{{ title }}</h2>
    <div class="resume-section-content">
      <slot />
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

.resume-section-content {
  padding-left: 4px;
}
</style>
