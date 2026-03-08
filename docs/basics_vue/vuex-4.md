---
description: "Vuex 4: интеграция с Vue 3, Composition API, TypeScript — обновлённый store для Vue 3 приложений"
---

# Основы Vue.js: Vuex 4

**Vuex 4** — это библиотека управления состоянием для Vue.js 3. Она представляет собой эволюцию Vuex 3, адаптированную для работы с новыми возможностями Vue 3, включая Composition API, и предлагает улучшения в производительности и типизации.

## Основные изменения и улучшения в Vuex 4

* **Полная совместимость с Vue 3:** Vuex 4 разработан специально для Vue 3 и использует новые хуки и API Composition API.
* **Улучшенная производительность:** Оптимизации в ядре библиотеки способствуют лучшей производительности, особенно в больших приложениях.
* **Улучшенная типизация (TypeScript):** Vuex 4 полностью написан на TypeScript, что обеспечивает отличную поддержку статической типизации и улучшает опыт разработки.
* **Более простой синтаксис для модулей:** Улучшена организация и регистрация модулей, особенно при использовании Composition API.
* **Поддержка Composition API:** Vuex 4 предоставляет новые способы взаимодействия с хранилищем, которые легко интегрируются с Composition API.

## Установка Vuex 4

Для установки Vuex 4 в вашем Vue 3 проекте используйте npm или yarn:

```bash
npm install vuex@next
# или
yarn add vuex@next
```

Затем вам нужно импортировать и использовать Vuex в вашем основном файле JavaScript (`main.js` или `main.ts`):

```javascript
// main.js (или main.ts)
import { createApp } from 'vue';
import App from './App.vue';
import store from './store'; // Предполагается, что вы создали файл store/index.js (или store/index.ts)

const app = createApp(App);
app.use(store);
app.mount('#app');
```

## Создание хранилища (Store) в Vuex 4

Создание хранилища в Vuex 4 стало более явным с использованием функции `createStore`.

```javascript
// store/index.js (или store/index.ts)
import { createStore } from 'vuex';

export default createStore({
  state: {
    count: 0,
    message: 'Hello Vuex 4!',
  },
  getters: {
    doubleCount: (state) => state.count * 2,
    getMessage: (state) => state.message,
  },
  mutations: {
    increment(state) {
      state.count++;
    },
    decrement(state) {
      state.count--;
    },
    updateMessage(state, newMessage) {
      state.message = newMessage;
    },
  },
  actions: {
    incrementAsync({ commit }) {
      setTimeout(() => {
        commit('increment');
      }, 1000);
    },
    updateMessageAsync({ commit }, newMessage) {
      return new Promise((resolve) => {
        setTimeout(() => {
          commit('updateMessage', newMessage);
          resolve();
        }, 2000);
      });
    },
  },
  modules: {
    // Ваши модули будут здесь
  },
});
```

Структура хранилища (state, getters, mutations, actions, modules) осталась концептуально прежней, но теперь она оборачивается в функцию `createStore`.

## Использование хранилища в компонентах с Composition API

Vuex 4 предлагает более удобные способы доступа к хранилищу при использовании Composition API через хуки `useStore`, `mapState`, `mapGetters`, `mapMutations` и `mapActions` из модуля `vuex`.

### Доступ к хранилищу с помощью `useStore`

Хук `useStore()` предоставляет доступ к экземпляру хранилища внутри setup-функции компонента.

```javascript
import { useStore } from 'vuex';
import { computed } from 'vue';
import { defineComponent } from 'vue';

export default defineComponent({
  setup() {
    const store = useStore();

    const count = computed(() => store.state.count);
    const message = computed(() => store.state.message);
    const doubleCount = computed(() => store.getters.doubleCount);
    const getMessage = computed(() => store.getters.getMessage);

    const increment = () => {
      store.commit('increment');
    };

    const decrement = () => {
      store.commit('decrement');
    };

    const updateTheMessage = (newMessage) => {
      store.commit('updateMessage', newMessage);
    };

    const incrementAsync = () => {
      store.dispatch('incrementAsync');
    };

    const updateTheMessageAsync = (newMessage) => {
      store.dispatch('updateMessageAsync', newMessage);
    };

    return {
      count,
      message,
      doubleCount,
      getMessage,
      increment,
      decrement,
      updateTheMessage,
      incrementAsync,
      updateTheMessageAsync,
    };
  },
});
```

### Вспомогательные функции `mapState`, `mapGetters`, `mapMutations`, `mapActions`

В Vuex 4 эти вспомогательные функции также доступны и работают аналогично Vuex 3, но теперь они лучше интегрированы с Composition API. Их нужно импортировать из `vuex` и использовать внутри `computed` и `methods` (или непосредственно в `setup` с `...`).

```javascript
import { mapState, mapGetters, mapMutations, mapActions, useStore } from 'vuex';
import { computed, defineComponent } from 'vue';

export default defineComponent({
  setup() {
    const store = useStore();

    return {
      ...mapState(['count', 'message']),
      ...mapGetters(['doubleCount', 'getMessage']),
      increment: () => store.commit('increment'),
      decrement: () => store.commit('decrement'),
      updateMessage: (newMessage) => store.commit('updateMessage', newMessage),
      incrementAsync: () => store.dispatch('incrementAsync'),
      updateMessageAsync: (newMessage) => store.dispatch('updateMessageAsync', newMessage),
    };
  },
});
```

Обратите внимание, что при использовании Composition API часто удобнее использовать `useStore` напрямую, особенно если вам требуется более сложная логика взаимодействия с хранилищем. `map...` helpers остаются полезными для более декларативного связывания.

## Модули в Vuex 4

Работа с модулями в Vuex 4 стала немного проще, особенно при использовании Composition API.

```javascript
// store/modules/user.js (или store/modules/user.ts)
import { Module } from 'vuex';

interface UserState {
  profile: any | null;
}

const user: Module<UserState, any> = {
  namespaced: true,
  state: () => ({
    profile: null,
  }),
  getters: {
    userName: (state) => state.profile ? state.profile.name : '',
  },
  mutations: {
    setUserProfile(state, profile) {
      state.profile = profile;
    },
  },
  actions: {
    async fetchUserProfile({ commit }, userId) {
      const response = await fetch(`/api/users/${userId}`);
      const data = await response.json();
      commit('setUserProfile', data);
    },
  },
};

export default user;

// store/index.js (или store/index.ts)
import { createStore } from 'vuex';
import user from './modules/user';

export default createStore({
  modules: {
    user,
  },
});
```

Для доступа к модульным состояниям, геттерам, мутациям и действиям с использованием `useStore` в компонентах:

```javascript
import { useStore } from 'vuex';
import { computed, defineComponent } from 'vue';

export default defineComponent({
  setup() {
    const store = useStore();

    const userProfile = computed(() => store.state.user.profile);
    const userName = computed(() => store.getters['user/userName']);

    const setUser = (profile) => {
      store.commit('user/setUserProfile', profile);
    };

    const fetchUser = (id) => {
      store.dispatch('user/fetchUserProfile', id);
    };

    return { userProfile, userName, setUser, fetchUser };
  },
});
```

При использовании `map...` helpers для модулей с пространством имен необходимо указать имя модуля в качестве первого аргумента:

```javascript
import { mapState, mapGetters, mapMutations, mapActions, useStore } from 'vuex';
import { computed, defineComponent } from 'vue';

export default defineComponent({
  setup() {
    const store = useStore();

    return {
      ...mapState('user', ['profile']),
      ...mapGetters('user', ['userName']),
      setUserProfile: (profile) => store.commit('user/setUserProfile', profile),
      fetchUserProfile: (id) => store.dispatch('user/fetchUserProfile', id),
    };
  },
});
```

## Типизация в Vuex 4 (TypeScript)

Vuex 4, будучи написанным на TypeScript, обеспечивает отличную поддержку типизации. Вы можете определять интерфейсы для состояния, геттеров, мутаций и действий, что значительно улучшает безопасность и удобство разработки, особенно в больших проектах.

```typescript
// store/index.ts
import { createStore, Store } from 'vuex';
import { UserState } from './modules/user';
import user from './modules/user';

export interface RootState {
  count: number;
  message: string;
  user: UserState;
}

export default createStore<RootState>({
  state: {
    count: 0,
    message: 'Hello Vuex 4 with TypeScript!',
    user: {} as UserState, // Инициализация состояния модуля
  },
  getters: {
    doubleCount: (state) => state.count * 2,
    getMessage: (state) => state.message,
  },
  mutations: {
    increment(state) {
      state.count++;
    },
    updateMessage(state, newMessage: string) {
      state.message = newMessage;
    },
  },
  actions: {
    incrementAsync({ commit }) {
      setTimeout(() => {
        commit('increment');
      }, 1000);
    },
  },
  modules: {
    user,
  },
});

// Типизация для использования store в компонентах
import { InjectionKey } from 'vue';
export const key: InjectionKey<Store<RootState>> = Symbol();
```

В компонентах вы можете использовать `useStore` с указанием типа:

```typescript
import { useStore } from 'vuex';
import { RootState, key } from '@/store';
import { computed, defineComponent } from 'vue';

export default defineComponent({
  setup() {
    const store = useStore(key);

    const count = computed(() => store.state.count);
    const message = computed(() => store.state.message);

    return { count, message };
  },
});
```

## Заключение

Vuex 4 является мощным инструментом для управления состоянием в Vue 3 приложениях, предлагая улучшенную производительность, лучшую поддержку TypeScript и более удобную интеграцию с Composition API. Независимо от того, используете ли вы Options API или Composition API, Vuex 4 предоставляет структурированный и предсказуемый способ управления общим состоянием вашего приложения, что особенно важно для больших и сложных проектов. Переход на Vuex 4 рекомендуется для всех новых Vue 3 приложений.
