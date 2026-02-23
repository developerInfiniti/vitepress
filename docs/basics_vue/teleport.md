---
title: Teleport во Vue 3
description: Руководство по использованию Teleport для рендеринга DOM вне дерева компонентов
---

# Teleport во Vue 3

## 1. Что такое Teleport?

Teleport — встроенный компонент Vue 3, который позволяет "телепортировать" часть шаблона в другое место в DOM, за пределы родительского компонента. Это полезно для модальных окон, тултипов, уведомлений и других элементов, которые должны рендериться на верхнем уровне DOM.

## 2. Базовое использование

### Модальное окно
```vue
<script setup>
import { ref } from 'vue';

const isOpen = ref(false);
</script>

<template>
  <button @click="isOpen = true">Открыть модалку</button>

  <Teleport to="body">
    <div v-if="isOpen" class="modal-overlay">
      <div class="modal">
        <h2>Модальное окно</h2>
        <p>Контент модального окна</p>
        <button @click="isOpen = false">Закрыть</button>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
}
</style>
```

## 3. Атрибут `to`

Атрибут `to` принимает CSS-селектор или ссылку на DOM-элемент.

```vue
<!-- CSS-селектор -->
<Teleport to="#modals">
  <div>Телепортировано в #modals</div>
</Teleport>

<Teleport to=".notifications">
  <div>Телепортировано в .notifications</div>
</Teleport>

<Teleport to="body">
  <div>Телепортировано в body</div>
</Teleport>
```

### Динамический target
```vue
<script setup>
import { ref } from 'vue';

const target = ref('#container-a');
</script>

<template>
  <button @click="target = '#container-a'">Контейнер A</button>
  <button @click="target = '#container-b'">Контейнер B</button>

  <Teleport :to="target">
    <div>Динамический телепорт</div>
  </Teleport>

  <div id="container-a"></div>
  <div id="container-b"></div>
</template>
```

## 4. Отключение Teleport

Атрибут `disabled` позволяет условно отключать телепортацию.

```vue
<script setup>
import { ref } from 'vue';

const isMobile = ref(window.innerWidth < 768);
</script>

<template>
  <!-- На мобильных рендерится на месте, на десктопе — в body -->
  <Teleport to="body" :disabled="isMobile">
    <div class="sidebar">
      Боковая панель
    </div>
  </Teleport>
</template>
```

## 5. Несколько Teleport в один target

Несколько компонентов Teleport могут рендериться в один и тот же целевой элемент. Порядок соответствует порядку появления в коде.

```vue
<template>
  <Teleport to="#notifications">
    <div class="notification">Первое уведомление</div>
  </Teleport>

  <Teleport to="#notifications">
    <div class="notification">Второе уведомление</div>
  </Teleport>
</template>
```

Результат в DOM:
```html
<div id="notifications">
  <div class="notification">Первое уведомление</div>
  <div class="notification">Второе уведомление</div>
</div>
```

## 6. Практические примеры

### Система уведомлений (Toast)
```vue
<!-- ToastNotification.vue -->
<script setup>
defineProps<{
  message: string;
  type: 'success' | 'error' | 'warning';
}>();

const emit = defineEmits<{
  close: [];
}>();
</script>

<template>
  <Teleport to="#toast-container">
    <div :class="['toast', `toast--${type}`]">
      <span>{{ message }}</span>
      <button @click="emit('close')">×</button>
    </div>
  </Teleport>
</template>
```

### Тултип
```vue
<!-- Tooltip.vue -->
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps<{
  text: string;
}>();

const triggerRef = ref<HTMLElement | null>(null);
const isVisible = ref(false);
const position = ref({ top: 0, left: 0 });

function show() {
  if (!triggerRef.value) return;
  const rect = triggerRef.value.getBoundingClientRect();
  position.value = {
    top: rect.top - 10,
    left: rect.left + rect.width / 2,
  };
  isVisible.value = true;
}

function hide() {
  isVisible.value = false;
}
</script>

<template>
  <span ref="triggerRef" @mouseenter="show" @mouseleave="hide">
    <slot />
  </span>

  <Teleport to="body">
    <div
      v-if="isVisible"
      class="tooltip"
      :style="{
        top: position.top + 'px',
        left: position.left + 'px',
      }"
    >
      {{ text }}
    </div>
  </Teleport>
</template>
```

### Контекстное меню
```vue
<script setup>
import { ref } from 'vue';

const isVisible = ref(false);
const menuPosition = ref({ x: 0, y: 0 });

function onContextMenu(e: MouseEvent) {
  e.preventDefault();
  menuPosition.value = { x: e.clientX, y: e.clientY };
  isVisible.value = true;
}

function closeMenu() {
  isVisible.value = false;
}
</script>

<template>
  <div @contextmenu="onContextMenu" @click="closeMenu">
    Нажмите правой кнопкой мыши

    <Teleport to="body">
      <div
        v-if="isVisible"
        class="context-menu"
        :style="{ top: menuPosition.y + 'px', left: menuPosition.x + 'px' }"
      >
        <ul>
          <li @click="closeMenu">Копировать</li>
          <li @click="closeMenu">Вставить</li>
          <li @click="closeMenu">Удалить</li>
        </ul>
      </div>
    </Teleport>
  </div>
</template>
```

## 7. Подготовка HTML

Не забудьте добавить целевые контейнеры в `index.html`:

```html
<!DOCTYPE html>
<html>
<body>
  <div id="app"></div>
  <div id="modals"></div>
  <div id="notifications"></div>
  <div id="toast-container"></div>
</body>
</html>
```
