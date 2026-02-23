---
title: Пользовательские директивы во Vue 3
description: Руководство по созданию и использованию пользовательских директив в Vue 3
---

# Пользовательские директивы во Vue 3

## 1. Что такое директивы?

Директивы — это специальные атрибуты с префиксом `v-`, которые применяют реактивное поведение к DOM-элементам. Vue 3 позволяет создавать собственные директивы для повторного использования логики работы с DOM.

## 2. Хуки директивы

```typescript
const myDirective = {
  // Вызывается до привязки атрибутов элемента
  created(el, binding, vnode) {},

  // Вызывается перед монтированием элемента в DOM
  beforeMount(el, binding, vnode) {},

  // Вызывается после монтирования элемента в DOM
  mounted(el, binding, vnode) {},

  // Вызывается перед обновлением родительского компонента
  beforeUpdate(el, binding, vnode, prevVnode) {},

  // Вызывается после обновления родительского компонента
  updated(el, binding, vnode, prevVnode) {},

  // Вызывается перед размонтированием элемента
  beforeUnmount(el, binding, vnode) {},

  // Вызывается после размонтирования элемента
  unmounted(el, binding, vnode) {},
};
```

## 3. Аргумент binding

```typescript
interface DirectiveBinding {
  value: any;        // Значение, переданное в директиву (v-my="value")
  oldValue: any;     // Предыдущее значение (только в updated)
  arg: string;       // Аргумент директивы (v-my:arg)
  modifiers: object; // Модификаторы (v-my.mod1.mod2)
  instance: object;  // Экземпляр компонента
  dir: object;       // Объект определения директивы
}
```

## 4. Регистрация директив

### Локальная регистрация (script setup)
```vue
<script setup>
// Любая переменная с префиксом v — автоматически директива
const vFocus = {
  mounted: (el: HTMLElement) => el.focus(),
};
</script>

<template>
  <input v-focus />
</template>
```

### Глобальная регистрация
```typescript
// main.ts
import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);

app.directive('focus', {
  mounted(el: HTMLElement) {
    el.focus();
  },
});

app.mount('#app');
```

## 5. Практические примеры

### v-click-outside — клик за пределами элемента
```typescript
// directives/clickOutside.ts
import { DirectiveBinding } from 'vue';

export const vClickOutside = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    el._clickOutside = (event: MouseEvent) => {
      if (!el.contains(event.target as Node)) {
        binding.value(event);
      }
    };
    document.addEventListener('click', el._clickOutside);
  },
  unmounted(el: HTMLElement) {
    document.removeEventListener('click', el._clickOutside);
  },
};
```

```vue
<script setup>
import { ref } from 'vue';
import { vClickOutside } from './directives/clickOutside';

const isOpen = ref(false);

function close() {
  isOpen.value = false;
}
</script>

<template>
  <div v-click-outside="close" v-if="isOpen" class="dropdown">
    Выпадающее меню
  </div>
</template>
```

### v-tooltip — тултип
```typescript
// directives/tooltip.ts
export const vTooltip = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const tooltip = document.createElement('div');
    tooltip.className = 'v-tooltip';
    tooltip.textContent = binding.value;
    tooltip.style.cssText = `
      position: absolute;
      background: #333;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      display: none;
      z-index: 9999;
    `;
    document.body.appendChild(tooltip);

    el.addEventListener('mouseenter', () => {
      const rect = el.getBoundingClientRect();
      tooltip.style.top = `${rect.top - 30}px`;
      tooltip.style.left = `${rect.left + rect.width / 2}px`;
      tooltip.style.transform = 'translateX(-50%)';
      tooltip.style.display = 'block';
    });

    el.addEventListener('mouseleave', () => {
      tooltip.style.display = 'none';
    });

    el._tooltip = tooltip;
  },
  updated(el: HTMLElement, binding: DirectiveBinding) {
    if (el._tooltip) {
      el._tooltip.textContent = binding.value;
    }
  },
  unmounted(el: HTMLElement) {
    if (el._tooltip) {
      document.body.removeChild(el._tooltip);
    }
  },
};
```

```vue
<template>
  <button v-tooltip="'Нажмите для сохранения'">Сохранить</button>
</template>
```

### v-permission — отображение по правам доступа
```typescript
// directives/permission.ts
export const vPermission = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const userPermissions: string[] = getUserPermissions();
    const required = binding.value;

    if (Array.isArray(required)) {
      const hasPermission = required.some((p) =>
        userPermissions.includes(p)
      );
      if (!hasPermission) {
        el.parentNode?.removeChild(el);
      }
    }
  },
};
```

```vue
<template>
  <button v-permission="['admin', 'editor']">Удалить</button>
</template>
```

### v-debounce — задержка ввода
```typescript
// directives/debounce.ts
export const vDebounce = {
  mounted(el: HTMLInputElement, binding: DirectiveBinding) {
    let timeout: ReturnType<typeof setTimeout>;
    const delay = binding.arg ? parseInt(binding.arg) : 300;

    el.addEventListener('input', () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        binding.value(el.value);
      }, delay);
    });
  },
};
```

```vue
<template>
  <!-- Задержка 500мс -->
  <input v-debounce:500="handleSearch" placeholder="Поиск..." />
</template>
```

### v-lazy — ленивая загрузка изображений
```typescript
// directives/lazy.ts
export const vLazy = {
  mounted(el: HTMLImageElement, binding: DirectiveBinding) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.src = binding.value;
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1 }
    );

    el.src = 'placeholder.png';
    observer.observe(el);

    el._observer = observer;
  },
  unmounted(el: HTMLImageElement) {
    el._observer?.disconnect();
  },
};
```

```vue
<template>
  <img v-lazy="'/images/photo.jpg'" alt="Фото" />
</template>
```

## 6. Сокращённая запись

Если нужна логика только при `mounted` и `updated`, можно использовать функцию:

```typescript
app.directive('color', (el, binding) => {
  el.style.color = binding.value;
});
```

```vue
<template>
  <p v-color="'red'">Красный текст</p>
</template>
```

## 7. Модификаторы

```typescript
const vFormat = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    let text = binding.value;

    if (binding.modifiers.uppercase) {
      text = text.toUpperCase();
    }
    if (binding.modifiers.trim) {
      text = text.trim();
    }
    if (binding.modifiers.bold) {
      el.style.fontWeight = 'bold';
    }

    el.textContent = text;
  },
};
```

```vue
<template>
  <p v-format.uppercase.bold="'привет мир'"><!-- ПРИВЕТ МИР --></p>
</template>
```
