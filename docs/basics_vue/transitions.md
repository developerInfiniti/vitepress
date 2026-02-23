---
title: Transition и анимации во Vue 3
description: Руководство по использованию Transition и TransitionGroup для анимаций в Vue 3
---

# Transition и анимации во Vue 3

## 1. Компонент Transition

Компонент `<Transition>` применяет анимации входа и выхода к элементу или компоненту, который оборачивает.

### Базовое использование
```vue
<script setup>
import { ref } from 'vue';

const isVisible = ref(true);
</script>

<template>
  <button @click="isVisible = !isVisible">Переключить</button>

  <Transition name="fade">
    <p v-if="isVisible">Привет, мир!</p>
  </Transition>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
```

## 2. CSS-классы переходов

Vue автоматически применяет 6 CSS-классов:

| Класс | Описание |
|---|---|
| `v-enter-from` | Начальное состояние входа |
| `v-enter-active` | Активное состояние входа (применяется всё время) |
| `v-enter-to` | Конечное состояние входа |
| `v-leave-from` | Начальное состояние выхода |
| `v-leave-active` | Активное состояние выхода (применяется всё время) |
| `v-leave-to` | Конечное состояние выхода |

При использовании `name="fade"` классы будут: `fade-enter-from`, `fade-enter-active` и т.д.

## 3. Примеры анимаций

### Slide + Fade
```vue
<Transition name="slide-fade">
  <p v-if="show">Slide Fade</p>
</Transition>

<style>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
```

### Scale
```vue
<Transition name="scale">
  <div v-if="show" class="box">Scale</div>
</Transition>

<style>
.scale-enter-active,
.scale-leave-active {
  transition: all 0.3s ease;
}
.scale-enter-from,
.scale-leave-to {
  transform: scale(0);
  opacity: 0;
}
</style>
```

### CSS Animation (keyframes)
```vue
<Transition name="bounce">
  <p v-if="show">Bounce!</p>
</Transition>

<style>
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}

@keyframes bounce-in {
  0% { transform: scale(0); }
  50% { transform: scale(1.25); }
  100% { transform: scale(1); }
}
</style>
```

## 4. JavaScript-хуки

```vue
<Transition
  @before-enter="onBeforeEnter"
  @enter="onEnter"
  @after-enter="onAfterEnter"
  @enter-cancelled="onEnterCancelled"
  @before-leave="onBeforeLeave"
  @leave="onLeave"
  @after-leave="onAfterLeave"
  @leave-cancelled="onLeaveCancelled"
>
  <div v-if="show">Контент</div>
</Transition>

<script setup>
function onEnter(el: Element, done: () => void) {
  // Использование Web Animations API или GSAP
  el.animate(
    [
      { opacity: 0, transform: 'translateY(-20px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ],
    { duration: 300, easing: 'ease-out' }
  ).onfinish = done;
}

function onLeave(el: Element, done: () => void) {
  el.animate(
    [
      { opacity: 1, transform: 'translateY(0)' },
      { opacity: 0, transform: 'translateY(20px)' },
    ],
    { duration: 300, easing: 'ease-in' }
  ).onfinish = done;
}
</script>
```

## 5. Режимы переходов (mode)

```vue
<!-- out-in: сначала выход текущего, потом вход нового -->
<Transition name="fade" mode="out-in">
  <component :is="currentComponent" />
</Transition>

<!-- in-out: сначала вход нового, потом выход текущего -->
<Transition name="fade" mode="in-out">
  <component :is="currentComponent" />
</Transition>
```

### Переключение компонентов
```vue
<script setup>
import { ref, shallowRef } from 'vue';
import CompA from './CompA.vue';
import CompB from './CompB.vue';

const currentTab = shallowRef(CompA);
</script>

<template>
  <button @click="currentTab = CompA">Tab A</button>
  <button @click="currentTab = CompB">Tab B</button>

  <Transition name="fade" mode="out-in">
    <component :is="currentTab" />
  </Transition>
</template>
```

## 6. Transition при появлении (appear)

```vue
<!-- Анимация при первоначальном рендере -->
<Transition appear name="fade">
  <div>Появляется с анимацией</div>
</Transition>

<!-- Отдельные классы для appear -->
<Transition
  appear
  appear-from-class="appear-enter-from"
  appear-active-class="appear-enter-active"
  appear-to-class="appear-enter-to"
>
  <div>Своя анимация появления</div>
</Transition>
```

## 7. TransitionGroup — анимация списков

### Базовый пример
```vue
<script setup>
import { ref } from 'vue';

const items = ref([1, 2, 3, 4, 5]);
let nextId = 6;

function addItem() {
  const index = Math.floor(Math.random() * items.value.length);
  items.value.splice(index, 0, nextId++);
}

function removeItem(index: number) {
  items.value.splice(index, 1);
}
</script>

<template>
  <button @click="addItem">Добавить</button>

  <TransitionGroup name="list" tag="ul">
    <li v-for="(item, index) in items" :key="item" @click="removeItem(index)">
      {{ item }}
    </li>
  </TransitionGroup>
</template>

<style>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* Анимация перемещения остальных элементов */
.list-move {
  transition: transform 0.5s ease;
}

/* Элемент при уходе не занимает места */
.list-leave-active {
  position: absolute;
}
</style>
```

### Staggered анимация (каскадная)
```vue
<script setup>
function onBeforeEnter(el: HTMLElement) {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
}

function onEnter(el: HTMLElement, done: () => void) {
  const delay = el.dataset.index ? parseInt(el.dataset.index) * 100 : 0;

  setTimeout(() => {
    el.style.transition = 'all 0.4s ease';
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
    setTimeout(done, 400);
  }, delay);
}
</script>

<template>
  <TransitionGroup
    @before-enter="onBeforeEnter"
    @enter="onEnter"
  >
    <div
      v-for="(item, index) in items"
      :key="item.id"
      :data-index="index"
    >
      {{ item.name }}
    </div>
  </TransitionGroup>
</template>
```

## 8. Интеграция с библиотеками анимаций

### Пользовательские классы (Animate.css)
```vue
<Transition
  enter-active-class="animate__animated animate__fadeInUp"
  leave-active-class="animate__animated animate__fadeOutDown"
>
  <div v-if="show">Animate.css</div>
</Transition>
```

## 9. Переход между маршрутами

```vue
<!-- App.vue -->
<template>
  <router-view v-slot="{ Component }">
    <Transition name="page" mode="out-in">
      <component :is="Component" />
    </Transition>
  </router-view>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
```
