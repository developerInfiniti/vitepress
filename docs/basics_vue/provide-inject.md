---
title: Provide / Inject во Vue 3
description: Руководство по использованию Provide и Inject для передачи данных через дерево компонентов
---

# Provide / Inject во Vue 3

## 1. Что такое Provide / Inject?

Provide и Inject — механизм внедрения зависимостей в Vue 3, позволяющий передавать данные от родительского компонента к любому вложенному потомку, минуя промежуточные компоненты (без prop drilling).

## 2. Базовое использование

### Provide в родительском компоненте
```vue
<script setup>
import { provide, ref } from 'vue';

const theme = ref('dark');

provide('theme', theme);
</script>

<template>
  <div>
    <ChildComponent />
  </div>
</template>
```

### Inject в дочернем компоненте
```vue
<script setup>
import { inject } from 'vue';

const theme = inject('theme');
</script>

<template>
  <div :class="theme">
    Текущая тема: {{ theme }}
  </div>
</template>
```

## 3. Значения по умолчанию

```vue
<script setup>
import { inject } from 'vue';

// Если 'theme' не предоставлен, используется 'light'
const theme = inject('theme', 'light');

// Фабричная функция для значений по умолчанию
const config = inject('config', () => ({
  color: 'blue',
  fontSize: 14,
}));
</script>
```

## 4. Типизация с TypeScript

### Использование InjectionKey
```typescript
// keys.ts
import { InjectionKey, Ref } from 'vue';

export const themeKey: InjectionKey<Ref<string>> = Symbol('theme');

export interface UserContext {
  name: string;
  role: string;
  logout: () => void;
}

export const userKey: InjectionKey<UserContext> = Symbol('user');
```

### Provide с типизацией
```vue
<script setup lang="ts">
import { provide, ref } from 'vue';
import { themeKey, userKey } from './keys';

const theme = ref('dark');
provide(themeKey, theme);

provide(userKey, {
  name: 'Иван',
  role: 'admin',
  logout: () => console.log('Выход'),
});
</script>
```

### Inject с типизацией
```vue
<script setup lang="ts">
import { inject } from 'vue';
import { themeKey, userKey } from './keys';

// TypeScript знает тип: Ref<string> | undefined
const theme = inject(themeKey);

// С обязательным значением
const user = inject(userKey);
if (user) {
  console.log(user.name); // типизировано
}
</script>
```

## 5. Реактивный Provide / Inject

### Передача реактивных данных
```vue
<!-- Родительский компонент -->
<script setup>
import { provide, ref, readonly } from 'vue';

const count = ref(0);

function increment() {
  count.value++;
}

// readonly предотвращает изменение данных потомками
provide('count', readonly(count));
provide('increment', increment);
</script>
```

```vue
<!-- Дочерний компонент -->
<script setup>
import { inject } from 'vue';

const count = inject('count');
const increment = inject('increment');
</script>

<template>
  <div>
    <p>Счёт: {{ count }}</p>
    <button @click="increment">+1</button>
  </div>
</template>
```

## 6. Provide на уровне приложения

```typescript
// main.ts
import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);

// Доступно во всех компонентах приложения
app.provide('appVersion', '1.0.0');
app.provide('apiUrl', 'https://api.example.com');

app.mount('#app');
```

## 7. Паттерн: Composable с Provide / Inject

### Создание контекста
```typescript
// composables/useTheme.ts
import { provide, inject, ref, readonly, InjectionKey, Ref } from 'vue';

interface ThemeContext {
  theme: Readonly<Ref<string>>;
  toggleTheme: () => void;
}

const ThemeKey: InjectionKey<ThemeContext> = Symbol('ThemeContext');

export function provideTheme() {
  const theme = ref('light');

  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light';
  }

  const context: ThemeContext = {
    theme: readonly(theme),
    toggleTheme,
  };

  provide(ThemeKey, context);
  return context;
}

export function useTheme(): ThemeContext {
  const context = inject(ThemeKey);
  if (!context) {
    throw new Error('useTheme() вызван без provideTheme()');
  }
  return context;
}
```

### Использование
```vue
<!-- App.vue -->
<script setup>
import { provideTheme } from './composables/useTheme';

provideTheme();
</script>

<!-- Любой вложенный компонент -->
<script setup>
import { useTheme } from './composables/useTheme';

const { theme, toggleTheme } = useTheme();
</script>

<template>
  <button @click="toggleTheme">
    Тема: {{ theme }}
  </button>
</template>
```

## 8. Сравнение с другими подходами

| Подход | Когда использовать |
|---|---|
| Props | Прямая передача данных родитель → потомок |
| Events | Обратная связь потомок → родитель |
| Provide/Inject | Передача данных через несколько уровней |
| Pinia | Глобальное состояние приложения |
| Composables | Переиспользуемая логика |
