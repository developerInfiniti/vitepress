<script setup lang="ts">
import { ref, computed } from 'vue'
import './shared-demo-styles.css'

type LayoutType = 'flexbox' | 'grid'

const layoutType = ref<LayoutType>('flexbox')
const itemCount = ref(5)
const activeTab = ref<'playground' | 'presets'>('playground')

// Flexbox properties
const flexDirection = ref('row')
const justifyContent = ref('flex-start')
const alignItems = ref('stretch')
const flexWrap = ref('nowrap')
const gap = ref(10)

// Grid properties
const gridColumns = ref('1fr 1fr 1fr')
const gridRows = ref('auto')
const gridJustifyItems = ref('stretch')
const gridAlignItems = ref('stretch')
const gridGap = ref(10)

const containerStyle = computed(() => {
  if (layoutType.value === 'flexbox') {
    return {
      display: 'flex',
      flexDirection: flexDirection.value,
      justifyContent: justifyContent.value,
      alignItems: alignItems.value,
      flexWrap: flexWrap.value,
      gap: gap.value + 'px',
    }
  }
  return {
    display: 'grid',
    gridTemplateColumns: gridColumns.value,
    gridTemplateRows: gridRows.value,
    justifyItems: gridJustifyItems.value,
    alignItems: gridAlignItems.value,
    gap: gridGap.value + 'px',
  }
})

const generatedCSS = computed(() => {
  if (layoutType.value === 'flexbox') {
    return `.container {
  display: flex;
  flex-direction: ${flexDirection.value};
  justify-content: ${justifyContent.value};
  align-items: ${alignItems.value};
  flex-wrap: ${flexWrap.value};
  gap: ${gap.value}px;
}`
  }
  return `.container {
  display: grid;
  grid-template-columns: ${gridColumns.value};
  grid-template-rows: ${gridRows.value};
  justify-items: ${gridJustifyItems.value};
  align-items: ${gridAlignItems.value};
  gap: ${gridGap.value}px;
}`
})

const boxColors = ['#3498db', '#e74c3c', '#27ae60', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22', '#2c3e50']

const items = computed(() => {
  return Array.from({ length: itemCount.value }, (_, i) => ({
    label: `${i + 1}`,
    color: boxColors[i % boxColors.length],
  }))
})

const flexDirectionOptions = ['row', 'row-reverse', 'column', 'column-reverse']
const justifyOptions = ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly']
const alignOptions = ['flex-start', 'flex-end', 'center', 'stretch', 'baseline']
const wrapOptions = ['nowrap', 'wrap', 'wrap-reverse']
const gridJustifyOptions = ['start', 'end', 'center', 'stretch']
const gridAlignOptions = ['start', 'end', 'center', 'stretch']

const presets = [
  { label: 'Flex: Центрирование', type: 'flexbox' as LayoutType, apply: () => { layoutType.value = 'flexbox'; flexDirection.value = 'row'; justifyContent.value = 'center'; alignItems.value = 'center'; flexWrap.value = 'nowrap'; gap.value = 10; itemCount.value = 1; } },
  { label: 'Flex: Навбар', type: 'flexbox' as LayoutType, apply: () => { layoutType.value = 'flexbox'; flexDirection.value = 'row'; justifyContent.value = 'space-between'; alignItems.value = 'center'; flexWrap.value = 'nowrap'; gap.value = 16; itemCount.value = 4; } },
  { label: 'Flex: Карточки', type: 'flexbox' as LayoutType, apply: () => { layoutType.value = 'flexbox'; flexDirection.value = 'row'; justifyContent.value = 'flex-start'; alignItems.value = 'stretch'; flexWrap.value = 'wrap'; gap.value = 12; itemCount.value = 6; } },
  { label: 'Flex: Колонка', type: 'flexbox' as LayoutType, apply: () => { layoutType.value = 'flexbox'; flexDirection.value = 'column'; justifyContent.value = 'flex-start'; alignItems.value = 'stretch'; flexWrap.value = 'nowrap'; gap.value = 8; itemCount.value = 4; } },
  { label: 'Grid: 3 колонки', type: 'grid' as LayoutType, apply: () => { layoutType.value = 'grid'; gridColumns.value = '1fr 1fr 1fr'; gridRows.value = 'auto'; gridGap.value = 12; gridJustifyItems.value = 'stretch'; gridAlignItems.value = 'stretch'; itemCount.value = 6; } },
  { label: 'Grid: Sidebar + Main', type: 'grid' as LayoutType, apply: () => { layoutType.value = 'grid'; gridColumns.value = '200px 1fr'; gridRows.value = 'auto'; gridGap.value = 16; gridJustifyItems.value = 'stretch'; gridAlignItems.value = 'stretch'; itemCount.value = 4; } },
  { label: 'Grid: Holy Grail', type: 'grid' as LayoutType, apply: () => { layoutType.value = 'grid'; gridColumns.value = '150px 1fr 150px'; gridRows.value = '60px 1fr 40px'; gridGap.value = 8; gridJustifyItems.value = 'stretch'; gridAlignItems.value = 'stretch'; itemCount.value = 5; } },
  { label: 'Grid: Masonry-like', type: 'grid' as LayoutType, apply: () => { layoutType.value = 'grid'; gridColumns.value = 'repeat(auto-fill, minmax(100px, 1fr))'; gridRows.value = 'auto'; gridGap.value = 10; gridJustifyItems.value = 'stretch'; gridAlignItems.value = 'stretch'; itemCount.value = 8; } },
]

function applyPreset(preset: typeof presets[number]) {
  preset.apply()
  activeTab.value = 'playground'
}

function copyCSS() {
  navigator.clipboard.writeText(generatedCSS.value).catch(() => {})
}
</script>

<template>
  <div class="demo-wrapper">
    <div class="demo-header">
      <h3>CSS Layout Playground</h3>
      <div class="layout-toggle">
        <button
          class="toggle-btn"
          :class="{ active: layoutType === 'flexbox' }"
          @click="layoutType = 'flexbox'"
        >
          Flexbox
        </button>
        <button
          class="toggle-btn"
          :class="{ active: layoutType === 'grid' }"
          @click="layoutType = 'grid'"
        >
          Grid
        </button>
      </div>
    </div>

    <p class="demo-description">
      Настраивайте CSS свойства с помощью контролов и наблюдайте за изменениями в реальном времени.
    </p>

    <div class="demo-tabs">
      <button
        class="demo-tab-btn"
        :class="{ active: activeTab === 'playground' }"
        @click="activeTab = 'playground'"
      >
        Playground
      </button>
      <button
        class="demo-tab-btn"
        :class="{ active: activeTab === 'presets' }"
        @click="activeTab = 'presets'"
      >
        Preset Layouts
      </button>
    </div>

    <div v-if="activeTab === 'presets'" class="presets-grid">
      <button
        v-for="preset in presets"
        :key="preset.label"
        class="preset-card"
        @click="applyPreset(preset)"
      >
        <span class="preset-type" :style="{ color: preset.type === 'flexbox' ? '#3498db' : '#27ae60' }">
          {{ preset.type === 'flexbox' ? 'FLEX' : 'GRID' }}
        </span>
        <span>{{ preset.label.split(': ')[1] }}</span>
      </button>
    </div>

    <div v-if="activeTab === 'playground'" class="playground-layout">
      <div class="controls-panel">
        <div class="demo-control-group">
          <strong>Элементов: {{ itemCount }}</strong>
          <input type="range" v-model.number="itemCount" min="1" max="8" class="range-input" />
        </div>

        <template v-if="layoutType === 'flexbox'">
          <div class="demo-control-group">
            <strong>flex-direction:</strong>
            <select v-model="flexDirection" class="prop-select">
              <option v-for="opt in flexDirectionOptions" :key="opt" :value="opt">{{ opt }}</option>
            </select>
          </div>
          <div class="demo-control-group">
            <strong>justify-content:</strong>
            <select v-model="justifyContent" class="prop-select">
              <option v-for="opt in justifyOptions" :key="opt" :value="opt">{{ opt }}</option>
            </select>
          </div>
          <div class="demo-control-group">
            <strong>align-items:</strong>
            <select v-model="alignItems" class="prop-select">
              <option v-for="opt in alignOptions" :key="opt" :value="opt">{{ opt }}</option>
            </select>
          </div>
          <div class="demo-control-group">
            <strong>flex-wrap:</strong>
            <select v-model="flexWrap" class="prop-select">
              <option v-for="opt in wrapOptions" :key="opt" :value="opt">{{ opt }}</option>
            </select>
          </div>
          <div class="demo-control-group">
            <strong>gap: {{ gap }}px</strong>
            <input type="range" v-model.number="gap" min="0" max="40" class="range-input" />
          </div>
        </template>

        <template v-if="layoutType === 'grid'">
          <div class="demo-control-group">
            <strong>grid-template-columns:</strong>
            <input v-model="gridColumns" class="demo-text-input" />
          </div>
          <div class="demo-control-group">
            <strong>grid-template-rows:</strong>
            <input v-model="gridRows" class="demo-text-input" />
          </div>
          <div class="demo-control-group">
            <strong>justify-items:</strong>
            <select v-model="gridJustifyItems" class="prop-select">
              <option v-for="opt in gridJustifyOptions" :key="opt" :value="opt">{{ opt }}</option>
            </select>
          </div>
          <div class="demo-control-group">
            <strong>align-items:</strong>
            <select v-model="gridAlignItems" class="prop-select">
              <option v-for="opt in gridAlignOptions" :key="opt" :value="opt">{{ opt }}</option>
            </select>
          </div>
          <div class="demo-control-group">
            <strong>gap: {{ gridGap }}px</strong>
            <input type="range" v-model.number="gridGap" min="0" max="40" class="range-input" />
          </div>
        </template>
      </div>

      <div class="preview-area">
        <strong>Результат:</strong>
        <div class="preview-container" :style="containerStyle">
          <div
            v-for="item in items"
            :key="item.label"
            class="preview-item"
            :style="{ backgroundColor: item.color }"
          >
            {{ item.label }}
          </div>
        </div>
      </div>

      <div class="code-output">
        <div class="code-header">
          <strong>Сгенерированный CSS:</strong>
          <button class="demo-btn demo-btn-small" @click="copyCSS">Копировать</button>
        </div>
        <pre class="css-code">{{ generatedCSS }}</pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
.layout-toggle {
  display: flex;
  border: 1px solid var(--vp-c-divider, #e2e2e3);
  border-radius: 6px;
  overflow: hidden;
}

.toggle-btn {
  padding: 6px 16px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 0.85em;
  font-weight: 600;
  color: var(--vp-c-text-2, #666);
  transition: background 0.2s, color 0.2s;
}

.toggle-btn.active {
  background: var(--vp-c-brand-1, #3eaf7c);
  color: white;
}

.playground-layout {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.controls-panel {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
}

.prop-select {
  width: 100%;
  padding: 6px 10px;
  border: 1px solid var(--vp-c-divider, #e2e2e3);
  border-radius: 4px;
  font-size: 0.85em;
  font-family: 'Courier New', monospace;
  background: var(--vp-c-bg, white);
}

.range-input {
  width: 100%;
  cursor: pointer;
}

.preview-area {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.preview-container {
  min-height: 200px;
  padding: 12px;
  border: 2px dashed var(--vp-c-divider, #e2e2e3);
  border-radius: 8px;
  background: var(--vp-c-bg, white);
}

.preview-item {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 50px;
  min-height: 50px;
  padding: 12px;
  border-radius: 6px;
  color: white;
  font-weight: 700;
  font-size: 1.2em;
  text-shadow: 0 1px 2px rgba(0,0,0,0.2);
}

.code-output {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.css-code {
  background: #1e1e1e;
  color: #d4d4d4;
  border-radius: 8px;
  padding: 12px;
  font-family: 'Courier New', monospace;
  font-size: 0.85em;
  line-height: 1.6;
  margin: 0;
  overflow-x: auto;
}

.presets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 8px;
  margin-bottom: 16px;
}

.preset-card {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border: 1px solid var(--vp-c-divider, #e2e2e3);
  border-radius: 8px;
  background: var(--vp-c-bg, white);
  cursor: pointer;
  transition: border-color 0.2s, transform 0.15s;
  font-size: 0.9em;
}

.preset-card:hover {
  border-color: var(--vp-c-brand-1, #3eaf7c);
  transform: translateY(-1px);
}

.preset-type {
  font-weight: 700;
  font-size: 0.8em;
  min-width: 40px;
}

@media (max-width: 640px) {
  .controls-panel {
    grid-template-columns: 1fr;
  }

  .presets-grid {
    grid-template-columns: 1fr;
  }

  .preview-container {
    min-height: 150px;
  }
}
</style>
