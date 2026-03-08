---
description: "Плагины Nuxt.js: создание, регистрация, provide/inject — расширение приложения сторонними библиотеками"
---

# Плагины в Nuxt.js

## Что такое плагины в Nuxt.js?

[Скачать PDF](./plugins.pdf)

Плагины в Nuxt.js позволяют добавлять глобальную функциональность в приложение. Они выполняются перед созданием корневого экземпляра Vue и могут использоваться для регистрации компонентов, директив, миксинов, а также для интеграции внешних библиотек и сервисов.

## Когда использовать плагины?

- Для регистрации глобальных компонентов
- Для добавления методов или свойств в контекст (доступных в компонентах через `this`)
- Для интеграции внешних библиотек (например, axios, vue-notifications)
- Для выполнения кода как на стороне сервера, так и на стороне клиента

## Создание плагина

Плагины размещаются в директории `plugins/` и автоматически импортируются Nuxt.js.

```js
// plugins/my-plugin.js
export default ({ app, store }, inject) => {
  // Инъекция функции в контекст (доступна через this.$myFunction)
  inject('myFunction', () => {
    return 'Это моя функция!'
  })
}
```

## Регистрация плагина

Плагины регистрируются в файле `nuxt.config.js`:

```js
// nuxt.config.js
export default {
  plugins: [
    '~/plugins/my-plugin'
  ]
}
```

## Опции плагинов

### Выполнение только на клиенте или сервере

```js
// nuxt.config.js
export default {
  plugins: [
    { src: '~/plugins/client-only.js', mode: 'client' }, // Только на клиенте
    { src: '~/plugins/server-only.js', mode: 'server' }  // Только на сервере
  ]
}
```

### Порядок выполнения

Порядок плагинов в массиве определяет порядок их выполнения.

## Примеры плагинов

### Интеграция Vue-плагина

```js
// plugins/vue-notifications.js
import Vue from 'vue'
import VueNotifications from 'vue-notifications'

Vue.use(VueNotifications)
```

### Интеграция Axios

```js
// plugins/axios.js
export default function ({ $axios, redirect }) {
  // Перехват ошибок
  $axios.onError(error => {
    if (error.response && error.response.status === 500) {
      redirect('/error')
    }
  })
}
```

### Глобальные компоненты

```js
// plugins/global-components.js
import Vue from 'vue'
import BaseButton from '~/components/BaseButton.vue'
import BaseInput from '~/components/BaseInput.vue'

Vue.component('BaseButton', BaseButton)
Vue.component('BaseInput', BaseInput)
```

## Плагины в Nuxt 3

В Nuxt 3 синтаксис немного изменился:

```ts
// plugins/my-plugin.ts
export default defineNuxtPlugin(nuxtApp => {
  // Доступ к экземпляру приложения
  nuxtApp.provide('myFunction', () => {
    return 'Это моя функция!'
  })
})
```

Использование в компоненте:

```vue
<script setup>
const { $myFunction } = useNuxtApp()
console.log($myFunction()) // 'Это моя функция!'
</script>
```

## Заключение

Плагины в Nuxt.js — это мощный инструмент для расширения функциональности приложения. Они позволяют интегрировать внешние библиотеки, добавлять глобальные компоненты и функции, а также выполнять код на разных этапах жизненного цикла приложения.