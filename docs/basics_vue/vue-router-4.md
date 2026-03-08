---
description: "Vue Router 4: Composition API, динамические маршруты, navigation guards — маршрутизация для Vue 3"
---

# Основы Vue.js: Vue Router 4

**Vue Router 4** — это официальный маршрутизатор для Vue.js 3. Он представляет собой значительное обновление по сравнению с Vue Router 3, предлагая улучшенную производительность, более гибкую конфигурацию и новые возможности, лучше соответствующие архитектуре Vue 3.

## Основные изменения и улучшения в Vue Router 4

* **Поддержка Vue 3:** Vue Router 4 разработан специально для работы с Vue 3 и использует новые возможности Composition API.
* **Улучшенная производительность:** Переписанный движок маршрутизации обеспечивает лучшую производительность, особенно при большом количестве маршрутов.
* **Более гибкая конфигурация:** Новая система определения маршрутов стала более гибкой и выразительной.
* **Именованные представления (Named Views):** Улучшена поддержка именованных `<router-view>`, позволяющая отображать несколько компонентов на одном маршруте.
* **Композиция навигационных хуков:** Хуки навигации теперь могут возвращать Promises, что упрощает асинхронные операции.
* **Улучшенная обработка параметров:** Более строгая и предсказуемая обработка параметров маршрутов.
* **Динамическая маршрутизация:** Расширены возможности динамического добавления и удаления маршрутов.
* **Лучшая типизация (TypeScript):** Vue Router 4 полностью написан на TypeScript, что обеспечивает лучшую поддержку статической типизации.

## Установка Vue Router 4

Для установки Vue Router 4 в вашем Vue 3 проекте используйте npm или yarn:

```bash
npm install vue-router@next
# или
yarn add vue-router@next
```

Затем, как и в Vue Router 3, вам нужно импортировать и использовать Vue Router в вашем основном файле JavaScript (`main.js` или `main.ts`):

```javascript
// main.js (или main.ts)
import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Предполагается, что вы создали файл router/index.js (или router/index.ts)

const app = createApp(App);
app.use(router);
app.mount('#app');
```

## Настройка маршрутов в Vue Router 4

Конфигурация маршрутов в Vue Router 4 стала более объектно-ориентированной. Вы используете функцию `createRouter` для создания экземпляра маршрутизатора.

```javascript
// router/index.js (или router/index.ts)
import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';
import HomePage from '../components/HomePage.vue';
import AboutPage from '../components/AboutPage.vue';
import UserProfile from '../components/UserProfile.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/about',
    name: 'About',
    component: AboutPage,
  },
  {
    path: '/user/:id',
    name: 'User',
    component: UserProfile,
  },
];

const router = createRouter({
  history: createWebHistory(), // Используем HTML5 History API (требует настройки сервера)
  // history: createWebHashHistory(), // Используем режим хеша (#)
  routes,
});

export default router;
```

Основные изменения в конфигурации:

* **`createRouter`:** Функция для создания экземпляра маршрутизатора.
* **`history`:** Обязательная опция, определяющая режим истории браузера.
    * **`createWebHistory()`:** Эквивалент режима `history` в Vue Router 3. Требует настройки сервера.
    * **`createWebHashHistory()`:** Эквивалент режима `hash` в Vue Router 3. Не требует настройки сервера.
* **`routes`:** Массив объектов, определяющих маршруты. Структура объекта маршрута осталась похожей (`path`, `name`, `component`).

## Отображение компонентов маршрута

Как и в Vue Router 3, для отображения компонентов, соответствующих текущему маршруту, используется компонент `<router-view>` в шаблоне вашего основного компонента.

```html
<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link :to="{ name: 'User', params: { id: 123 }}">User 123</router-link>
    </nav>
    <router-view></router-view> </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router';
</script>
```

В Vue 3 с `<script setup>`, вам может потребоваться явно импортировать `RouterLink` и `RouterView`.

## Навигация в Vue Router 4

Способы навигации остались в основном прежними:

### `<router-link>`

Компонент `<router-link>` используется для декларативной навигации.

```html
<router-link to="/about">Перейти на страницу About</router-link>
<router-link :to="{ path: '/user/456' }">Перейти к пользователю 456</router-link>
<router-link :to="{ name: 'User', params: { id: 789 }}">Перейти к пользователю 789 (используя имя маршрута)</router-link>
```

В Vue 3 с `<script setup>`, вам может потребоваться явно импортировать `RouterLink`.

### Программная навигация

Объект `$router` по-прежнему доступен в компонентах, но теперь его методы возвращают Promises, что упрощает обработку асинхронных переходов.

```javascript
import { useRouter } from 'vue-router';
import { defineComponent } from 'vue';

export default defineComponent({
  setup() {
    const router = useRouter();

    const goToAbout = () => {
      router.push('/about');
    };

    const goToUser = (id) => {
      router.push({ name: 'User', params: { id } });
    };

    return { goToAbout, goToUser };
  },
});
```

В Vue 3 Composition API вы используете хук `useRouter()` для получения экземпляра маршрутизатора. Методы `$router` (теперь доступны через возвращаемый объект `router`) работают аналогично Vue Router 3:

* `router.push(location)`
* `router.replace(location)`
* `router.go(delta)`
* `router.back()`
* `router.forward()`

## Динамические маршруты и передача параметров

Работа с динамическими маршрутами (например, `/user/:id`) и доступ к параметрам через `$route.params` остались практически без изменений. Однако в Vue 3 Composition API `$route` теперь является реактивным объектом, полученным с помощью хука `useRoute()`.

```vue
<template>
  <div>
    <h1>Профиль пользователя с ID: {{ userId }}</h1>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();
const userId = computed(() => route.params.id);
</script>
```

## Вложенные маршруты

Вложенные маршруты настраиваются так же, как и в Vue Router 3, с использованием массива `children` в определении родительского маршрута.

```javascript
const routes = [
  {
    path: '/user/:id',
    component: () => import('../components/UserLayout.vue'),
    children: [
      {
        path: '',
        name: 'UserDetails',
        component: () => import('../components/UserDetails.vue'),
      },
      {
        path: 'posts',
        name: 'UserPosts',
        component: () => import('../components/UserPosts.vue'),
      },
    ],
  },
];
```

В шаблоне родительского компонента (`UserLayout.vue`) по-прежнему используется `<router-view>` для отображения вложенных компонентов.

## Именованные представления (Named Views)

Vue Router 4 значительно улучшил поддержку именованных представлений. Теперь вы можете определять несколько `<router-view>` с разными именами в одном компоненте и отображать разные компоненты для одного и того же маршрута.

```javascript
const routes = [
  {
    path: '/dashboard',
    components: {
      default: () => import('../components/Dashboard.vue'),
      sidebar: () => import('../components/DashboardSidebar.vue'),
      notifications: () => import('../components/NotificationPanel.vue'),
    },
  },
];
```

В шаблоне компонента, соответствующего маршруту `/dashboard`, вы можете использовать `<router-view>` с атрибутом `name`:

```html
<template>
  <div class="dashboard">
    <router-view></router-view> <router-view name="sidebar"></router-view>
    <router-view name="notifications"></router-view>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router';
</script>
```

## Хуки навигации в Vue Router 4

Глобальные, маршрутные и компонентные хуки навигации в Vue Router 4 претерпели некоторые изменения, особенно в контексте Composition API.

### Глобальные хуки

```javascript
router.beforeEach(async (to, from) => {
  // canUserAccess(to) возвращает Promise
  if (to.meta.requiresAuth && !(await canUserAccess(to))) {
    return '/login'; // Возвращение строки перенаправляет
  }
});

router.afterEach((to, from) => {
  console.log('Navigated to:', to.fullPath);
});
```

Теперь хуки `beforeEach` и `beforeResolve` могут возвращать Promise, что упрощает асинхронные операции. Возвращение строки из `beforeEach` автоматически перенаправляет на указанный путь.

### Хуки для каждого маршрута

```javascript
const routes = [
  {
    path: '/admin',
    component: () => import('../components/AdminPage.vue'),
    beforeEnter: [
      async (to, from) => {
        if (!isAuthenticated()) return '/login';
      },
    ],
  },
];
```

Хук `beforeEnter` теперь может быть массивом функций.

### Хуки внутри компонентов (Composition API)

```vue
<script setup>
import { onBeforeRouteLeave, onBeforeRouteUpdate, useRoute } from 'vue-router';
import { ref, watch } from 'vue';

const route = useRoute();
const confirmLeave = ref(false);

onBeforeRouteLeave((to, from) => {
  if (confirmLeave.value) {
    // Разрешить уход
  } else {
    // Запросить подтверждение
    const answer = window.confirm('Действительно хотите покинуть страницу?');
    confirmLeave.value = answer;
    return !answer; // Возвращение false блокирует уход
  }
});

onBeforeRouteUpdate((to, from) => {
  console.log('Route updated:', to.fullPath);
  // Можно выполнить действия при обновлении маршрута
});

watch(() => route.params.id, (newId, oldId) => {
  console.log(`User ID changed from ${oldId} to ${newId}`);
  // Загрузить новые данные пользователя
});
</script>

<template>
  <div>...</div>
</template>
```

В Composition API используются хуки `onBeforeRouteLeave` и `onBeforeRouteUpdate` для компонентных хуков навигации. `useRoute()` предоставляет доступ к объекту маршрута, который является реактивным.

## Динамическая маршрутизация

Vue Router 4 предоставляет более мощные средства для динамического добавления и удаления маршрутов во время выполнения приложения с помощью методов `router.addRoute()` и `router.removeRoute()`.

```javascript
// Добавление нового маршрута
router.addRoute({ path: '/new', component: NewComponent });

// Добавление вложенного маршрута
router.addRoute('User', { path: 'settings', component: UserSettings });

// Удаление маршрута по имени
router.removeRoute('New');
```

## Заключение

Vue Router 4 представляет собой значительное улучшение для маршрутизации в Vue.js 3. Он предлагает лучшую производительность, более гибкую конфигурацию и ряд новых возможностей, которые делают управление навигацией в сложных одностраничных приложениях еще более удобным и эффективным. Переход на Composition API также открывает новые возможности для организации логики, связанной с маршрутизацией, внутри компонентов. При разработке новых Vue 3 приложений рекомендуется использовать Vue Router 4.
