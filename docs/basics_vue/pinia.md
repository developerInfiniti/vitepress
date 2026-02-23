---
title: Pinia — менеджер состояния Vue 3
description: Руководство по использованию Pinia для управления состоянием в Vue 3
---

# Pinia — менеджер состояния Vue 3

## 1. Что такое Pinia?

Pinia — это официальный менеджер состояния для Vue 3, пришедший на замену Vuex. Он обеспечивает типобезопасность, поддержку DevTools и модульную архитектуру.

## 2. Установка и настройка

### Установка
```bash
npm install pinia
```

### Подключение к приложению
```typescript
// main.ts
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.mount('#app');
```

## 3. Создание Store

### Options Store
```typescript
// stores/counter.ts
import { defineStore } from 'pinia';

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
    name: 'Счётчик',
  }),
  getters: {
    doubleCount: (state) => state.count * 2,
    doubleCountPlusOne(): number {
      return this.doubleCount + 1;
    },
  },
  actions: {
    increment() {
      this.count++;
    },
    async fetchCount() {
      const res = await fetch('/api/count');
      const data = await res.json();
      this.count = data.count;
    },
  },
});
```

### Setup Store (Composition API стиль)
```typescript
// stores/counter.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0);
  const name = ref('Счётчик');

  const doubleCount = computed(() => count.value * 2);

  function increment() {
    count.value++;
  }

  async function fetchCount() {
    const res = await fetch('/api/count');
    const data = await res.json();
    count.value = data.count;
  }

  return { count, name, doubleCount, increment, fetchCount };
});
```

## 4. Использование Store в компонентах

### Базовое использование
```vue
<script setup>
import { useCounterStore } from '@/stores/counter';

const counter = useCounterStore();

// Доступ к состоянию
console.log(counter.count);

// Вызов действия
counter.increment();
</script>

<template>
  <div>
    <p>Счёт: {{ counter.count }}</p>
    <p>Удвоенный: {{ counter.doubleCount }}</p>
    <button @click="counter.increment()">+1</button>
  </div>
</template>
```

### Деструктуризация с storeToRefs
```vue
<script setup>
import { storeToRefs } from 'pinia';
import { useCounterStore } from '@/stores/counter';

const counter = useCounterStore();

// storeToRefs сохраняет реактивность при деструктуризации
const { count, doubleCount } = storeToRefs(counter);

// Действия можно деструктурировать напрямую
const { increment } = counter;
</script>
```

## 5. Изменение состояния

### Прямое изменение
```typescript
const store = useCounterStore();
store.count++;
```

### Через $patch (объект)
```typescript
store.$patch({
  count: store.count + 1,
  name: 'Новое имя',
});
```

### Через $patch (функция)
```typescript
store.$patch((state) => {
  state.count++;
  state.name = 'Новое имя';
});
```

### Полная замена состояния
```typescript
store.$state = { count: 10, name: 'Сброс' };
```

## 6. Подписки

### Подписка на изменения состояния
```typescript
const store = useCounterStore();

store.$subscribe((mutation, state) => {
  console.log('Тип мутации:', mutation.type);
  console.log('Новое состояние:', state);

  // Сохранение в localStorage
  localStorage.setItem('counter', JSON.stringify(state));
});
```

### Подписка на действия
```typescript
store.$onAction(({ name, args, after, onError }) => {
  console.log(`Вызвано действие: ${name} с аргументами:`, args);

  after((result) => {
    console.log(`Действие ${name} завершено с результатом:`, result);
  });

  onError((error) => {
    console.error(`Ошибка в действии ${name}:`, error);
  });
});
```

## 7. Плагины Pinia

### Создание плагина
```typescript
import { PiniaPluginContext } from 'pinia';

function piniaLocalStoragePlugin(context: PiniaPluginContext) {
  const { store } = context;

  // Восстановление состояния из localStorage
  const savedState = localStorage.getItem(store.$id);
  if (savedState) {
    store.$patch(JSON.parse(savedState));
  }

  // Сохранение при изменении
  store.$subscribe((_, state) => {
    localStorage.setItem(store.$id, JSON.stringify(state));
  });
}

// Подключение плагина
const pinia = createPinia();
pinia.use(piniaLocalStoragePlugin);
```

## 8. Взаимодействие между Store

```typescript
// stores/user.ts
import { defineStore } from 'pinia';
import { useAuthStore } from './auth';

export const useUserStore = defineStore('user', {
  state: () => ({
    profile: null as UserProfile | null,
  }),
  actions: {
    async fetchProfile() {
      const auth = useAuthStore();
      if (!auth.isLoggedIn) return;

      const res = await fetch('/api/profile', {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      this.profile = await res.json();
    },
  },
});
```

## 9. Тестирование Store

```typescript
import { setActivePinia, createPinia } from 'pinia';
import { useCounterStore } from '@/stores/counter';
import { describe, it, expect, beforeEach } from 'vitest';

describe('Counter Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('начальное значение count = 0', () => {
    const store = useCounterStore();
    expect(store.count).toBe(0);
  });

  it('increment увеличивает count на 1', () => {
    const store = useCounterStore();
    store.increment();
    expect(store.count).toBe(1);
  });

  it('doubleCount возвращает удвоенное значение', () => {
    const store = useCounterStore();
    store.count = 5;
    expect(store.doubleCount).toBe(10);
  });
});
```
