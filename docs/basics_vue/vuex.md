---
description: "Vuex: state, mutations, actions, getters — централизованное управление состоянием Vue приложения"
---

# Основы Vue.js: Vuex

**Vuex** — это паттерн управления состоянием + библиотека для приложений Vue.js. Он служит централизованным хранилищем состояния (store) для всех компонентов в приложении, с правилами, гарантирующими, что состояние может быть изменено только предсказуемым способом. Vuex помогает справиться со сложностью управления состоянием в больших одностраничных приложениях (SPA).

## Основные концепции Vuex

Vuex состоит из пяти основных компонентов:

1.  **Состояние (State):** Единственный источник истины. Это объект, содержащий все данные уровня приложения.
2.  **Геттеры (Getters):** Вычисляемые свойства для состояния. Позволяют производным компонентам эффективно получать доступ к состоянию.
3.  **Мутации (Mutations):** Единственный способ изменения состояния. Мутации являются синхронными функциями, которые принимают состояние в качестве первого аргумента и необязательный пейлоад (payload) в качестве второго.
4.  **Действия (Actions):** Асинхронные операции, которые могут коммитить мутации. Действия принимают объект контекста (context), предоставляющий доступ к методам `commit`, `dispatch`, `state` и `getters`.
5.  **Модули (Modules):** Позволяют разбивать хранилище на более мелкие подмодули для лучшей организации.

## Установка Vuex

Для использования Vuex его необходимо установить как зависимость вашего проекта. Если вы используете Vue CLI, вы можете добавить Vuex при создании проекта или позже с помощью команды:

```bash
vue add vuex
````

Если вы настраиваете проект вручную, установите Vuex с помощью npm или yarn:

```bash
npm install vuex
# или
yarn add vuex
```

Затем вам нужно импортировать и использовать Vuex в вашем основном файле JavaScript (`main.js`):

```javascript
// main.js
import Vue from 'vue';
import App from './App.vue';
import store from './store'; // Предполагается, что вы создали файл store/index.js

Vue.config.productionTip = false;

new Vue({
  store, // Внедряем хранилище в корневой экземпляр Vue
  render: h => h(App),
}).$mount('#app');
```

## Создание хранилища (Store)

Обычно хранилище Vuex настраивается в отдельной директории (`store`) с файлом `index.js` в качестве основной точки входа.

```javascript
// store/index.js
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex); // Устанавливаем плагин Vuex

export default new Vuex.Store({
  state: {
    count: 0,
    message: 'Hello Vuex!',
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

Разберем каждый компонент хранилища:

### Состояние (State)

Объект `state` содержит данные, которые вы хотите совместно использовать между компонентами вашего приложения. В примере выше определены `count` (число) и `message` (строка).

### Геттеры (Getters)

Объект `getters` содержит функции, которые получают состояние и возвращают вычисляемые значения. Геттеры похожи на вычисляемые свойства (computed properties) Vue. Они могут зависеть от состояния и других геттеров.

* `doubleCount`: возвращает удвоенное значение `state.count`.
* `getMessage`: просто возвращает `state.message`.

### Мутации (Mutations)

Объект `mutations` содержит синхронные функции, которые непосредственно изменяют состояние. **Важно:** мутации должны быть синхронными, чтобы изменения состояния были предсказуемыми и легко отслеживаемыми.

* `increment`: увеличивает `state.count` на 1.
* `decrement`: уменьшает `state.count` на 1.
* `updateMessage`: обновляет `state.message` на переданное `newMessage`.

Мутации вызываются с помощью метода `commit` из компонентов или действий.

### Действия (Actions)

Объект `actions` содержит функции, которые могут выполнять асинхронные операции (например, вызовы API) и затем коммитить мутации для изменения состояния. Действия принимают объект `context`, который предоставляет доступ к `commit`, `dispatch` (для вызова других действий), `state` и `getters`.

* `incrementAsync`: асинхронно (через 1 секунду) коммитит мутацию `increment`.
* `updateMessageAsync`: асинхронно (через 2 секунды) коммитит мутацию `updateMessage` и возвращает Promise.

Действия вызываются с помощью метода `dispatch` из компонентов.

### Модули (Modules)

Объект `modules` позволяет разбивать большое хранилище на более мелкие модули. Каждый модуль может иметь свое собственное состояние, геттеры, мутации и действия. Модули могут быть вложенными. Это помогает организовать код и делает его более поддерживаемым в больших приложениях.

```javascript
// store/modules/user.js
const state = {
  profile: null,
};

const getters = {
  userName: (state) => state.profile ? state.profile.name : '',
};

const mutations = {
  setUserProfile(state, profile) {
    state.profile = profile;
  },
};

const actions = {
  fetchUserProfile({ commit }, userId) {
    // Асинхронный вызов API для получения профиля пользователя
    return fetch(`/api/users/${userId}`)
      .then(response => response.json())
      .then(data => {
        commit('setUserProfile', data);
      });
  },
};

export default {
  namespaced: true, // Важно для предотвращения конфликтов имен
  state,
  getters,
  mutations,
  actions,
};

// store/index.js
import Vue from 'vue';
import Vuex from 'vuex';
import user from './modules/user';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user,
  },
});
```

Если модуль имеет `namespaced: true`, доступ к его состоянию, геттерам, мутациям и действиям осуществляется с префиксом имени модуля. Например, чтобы вызвать действие `fetchUserProfile` из компонента:

```javascript
this.$store.dispatch('user/fetchUserProfile', 123);
```

## Использование хранилища в компонентах

После того как хранилище настроено и внедрено в корневой экземпляр Vue, вы можете получить доступ к состоянию, геттерам, мутациям и действиям в любом компоненте вашего приложения с помощью объекта `$store`.

### Доступ к состоянию

```vue
<template>
  <div>
    <p>Count: {{ $store.state.count }}</p>
    <p>Message: {{ $store.state.message }}</p>
    </div>
</template>

<script>
export default {
  computed: {
    count() {
      return this.$store.state.count;
    },
    message() {
      return this.$store.state.message;
    },
  },
};
</script>
```

Для удобства и реактивности часто используют вычисляемые свойства для получения состояния.

### Доступ к геттерам

```vue
<template>
  <div>
    <p>Double Count: {{ $store.getters.doubleCount }}</p>
    <p>Message: {{ $store.getters.getMessage }}</p>
    </div>
</template>

<script>
export default {
  computed: {
    doubleCount() {
      return this.$store.getters.doubleCount;
    },
    message() {
      return this.$store.getters.getMessage;
    },
  },
};
</script>
```

### Коммит мутаций

```vue
<template>
  <div>
    <button @click="incrementCounter">Increment</button>
    <button @click="decrementCounter">Decrement</button>
    <button @click="updateTheMessage">Update Message</button>
    </div>
</template>

<script>
export default {
  methods: {
    incrementCounter() {
      this.$store.commit('increment');
    },
    decrementCounter() {
      this.$store.commit('decrement');
    },
    updateTheMessage() {
      this.$store.commit('updateMessage', 'New Message from Component!');
    },
  },
};
</script>
```

Вы также можете передавать пейлоад в мутацию:

```javascript
this.$store.commit('updateMessage', this.newMessage);
```

### Вызов действий

```vue
<template>
  <div>
    <button @click="incrementCounterAsync">Increment Async</button>
    <button @click="updateTheMessageAsync">Update Message Async</button>
    </div>
</template>

<script>
export default {
  methods: {
    incrementCounterAsync() {
      this.$store.dispatch('incrementAsync');
    },
    async updateTheMessageAsync() {
      await this.$store.dispatch('updateMessageAsync', 'Async Message from Component!');
    },
  },
};
</script>
```

Действия могут быть асинхронными, поэтому при их вызове часто используют `async/await` или обрабатывают возвращаемые Promise.

## Вспомогательные функции `mapState`, `mapGetters`, `mapMutations`, `mapActions`

Для упрощения доступа к состоянию, геттерам, мутациям и действиям в компонентах Vuex предоставляет вспомогательные функции из модуля `vuex`.

```javascript
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';

export default {
  computed: {
    ...mapState(['count', 'message']),
    ...mapGetters(['doubleCount', 'getMessage']),
    // Для модулей с пространством имен:
    // ...mapState('user', ['profile']),
    // ...mapGetters('user', ['userName']),
  },
  methods: {
    ...mapMutations(['increment', 'decrement', 'updateMessage']),
    ...mapActions(['incrementAsync', 'updateMessageAsync']),
    // Для модулей с пространством имен:
    // ...mapMutations('user', ['setUserProfile']),
    // ...mapActions('user', ['fetchUserProfile']),
  },
};
```

Затем вы можете использовать состояние и геттеры как обычные вычисляемые свойства, а мутации и действия как обычные методы:

```vue
<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>Message: {{ message }}</p>
    <p>Double Count: {{ doubleCount }}</p>
    <p>Message from Getter: {{ getMessage }}</p>
    <button @click="increment">Increment</button>
    <button @click="decrement">Decrement</button>
    <button @click="updateMessage('New Message via MapMutations!')">Update Message</button>
    <button @click="incrementAsync">Increment Async</button>
    <button @click="updateMessageAsync('Async Message via MapActions!')">Update Message Async</button>
    </div>
</template>
```

## Когда использовать Vuex?

Vuex наиболее полезен в следующих ситуациях:

* Большое количество компонентов, которым необходимо совместно использовать одно и то же состояние.
* Глубоко вложенные компоненты, где передача пропсов может стать громоздкой.
* Необходимость централизованного управления состоянием для лучшей отслеживаемости и предсказуемости изменений.
* Приложения со сложной бизнес-логикой, требующей асинхронных операций для изменения состояния.

Для небольших и простых приложений управление состоянием с помощью локального состояния компонентов и передачи пропсов может быть вполне достаточным и более простым решением.

## Заключение

Vuex предоставляет мощный и структурированный способ управления состоянием в ваших Vue.js приложениях. Понимание основных концепций (состояние, геттеры, мутации, действия, модули) и правильное их использование поможет вам создавать более поддерживаемые, тестируемые и масштабируемые приложения, особенно при работе со сложным общим состоянием. Вспомогательные функции `mapState`, `mapGetters`, `mapMutations` и `mapActions` значительно упрощают взаимодействие компонентов с хранилищем.
