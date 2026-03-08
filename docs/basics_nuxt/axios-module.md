---
description: "Axios модуль Nuxt.js: HTTP запросы, интерцепторы, настройка — взаимодействие с API в приложении"
---

# Модуль `@nuxtjs/axios` в Nuxt

Модуль `@nuxtjs/axios` предоставляет простой и удобный способ использования библиотеки Axios для выполнения HTTP-запросов в ваших Nuxt приложениях. Он интегрируется с Nuxt Context и предоставляет инжектированный объект `$axios`, который можно использовать как на клиентской, так и на серверной стороне.

## Установка

Для начала установите модуль `@nuxtjs/axios`:

```bash
npm install --save @nuxtjs/axios
# или
yarn add @nuxtjs/axios
```

Затем добавьте `@nuxtjs/axios` в секцию `modules` вашего файла `nuxt.config.ts` (или `nuxt.config.js`):

```typescript
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/axios',
  ],
  axios: {
    // Настройки модуля (см. ниже)
    baseURL: '/', // Базовый URL для всех запросов (можно переопределить)
    browserBaseURL: '/', // Базовый URL для запросов на стороне клиента (если отличается от baseURL)
    headers: {
      common: {
        'Accept': 'application/json',
      },
    },
    // prefix: '/api', // Префикс для всех API-маршрутов (например, '/api/users')
    // credentials: 'omit', // Управление отправкой кук в кросс-доменных запросах ('omit', 'same-origin', 'include')
    // ... другие настройки Axios
  },
  // ... другие настройки
});
```

## Настройка (`nuxt.config.ts`)

Модуль `@nuxtjs/axios` имеет несколько опций конфигурации, которые позволяют настроить его под ваши нужды:

* **`baseURL`**: Базовый URL, который будет префиксом для всех относительных URL-адресов, если не указан абсолютный URL. Установите URL вашего API.
* **`browserBaseURL`**: Базовый URL, используемый только на стороне клиента. Это полезно, если ваш API находится на другом домене или порту, к которому браузер обращается напрямую. Если не указан, используется `baseURL`.
* **`headers`**: Объект с заголовками HTTP, которые будут отправляться по умолчанию с каждым запросом. Вы можете определить общие заголовки (`common`), заголовки для определенных методов (`get`, `post`, `put`, `delete`, `patch`).
* **`prefix`**: Префикс, который будет автоматически добавляться ко всем путям запросов, выполняемых через `$axios`. Например, если `prefix` установлен в `/api`, запрос к `/users` будет фактически отправлен на `/api/users`.
* **`credentials`**: Определяет, следует ли отправлять куки в кросс-доменных запросах. Возможные значения: `'omit'` (по умолчанию, не отправлять), `'same-origin'` (отправлять только для запросов в пределах того же домена), `'include'` (отправлять всегда).
* **`proxy`**: Устарело в Nuxt 3. Для проксирования запросов используйте встроенные возможности Nuxt DevTools или другие middleware решения.
* **Другие опции Axios**: Вы можете передавать любые другие стандартные опции конфигурации Axios непосредственно в объект `axios` в `nuxt.config.ts`.

## Использование `$axios`

После установки и настройки модуля, вы можете получить доступ к инжектированному объекту `$axios` в любом месте вашего Nuxt приложения (компоненты, composables, плагины, серверные маршруты и middleware).

**Примеры использования:**

```vue
<template>
  <div>
    <p v-if="loading">Загрузка...</p>
    <p v-else-if="error">{{ error }}</p>
    <pre v-else>{{ data }}</pre>
    <button @click="fetchData">Получить данные</button>
  </div>
</template>

<script setup>
const { $axios } = useNuxtApp();
const data = ref(null);
const loading = ref(false);
const error = ref(null);

async function fetchData() {
  loading.value = true;
  error.value = null;
  try {
    const response = await $axios.get('/api/users');
    data.value = response.data;
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
}
</script>
```

**Основные методы `$axios`:**

Объект `$axios` предоставляет все стандартные методы Axios:

* **`$get(url, config)`**: Выполняет GET-запрос.
* **`$post(url, data, config)`**: Выполняет POST-запрос с данными `data`.
* **`$put(url, data, config)`**: Выполняет PUT-запрос с данными `data`.
* **`$delete(url, config)`**: Выполняет DELETE-запрос.
* **`$patch(url, data, config)`**: Выполняет PATCH-запрос с данными `data`.
* **`$head(url, config)`**: Выполняет HEAD-запрос.
* **`$options(url, config)`**: Выполняет OPTIONS-запрос.
* **`$request(config)`**: Выполняет запрос с произвольной конфигурацией.

Каждый из этих методов возвращает Promise, который разрешается с объектом ответа Axios.

**Дополнительные удобства:**

Модуль `@nuxtjs/axios` также предоставляет некоторые удобные функции:

* **Автоматическое добавление `baseURL` и `prefix`:** Если вы настроили `baseURL` и/или `prefix`, они будут автоматически добавлены к вашим относительным URL-адресам.
* **Обработка ошибок:** Вы можете использовать стандартные блоки `try...catch` для обработки ошибок запросов.
* **Интеграция с Nuxt Context:** `$axios` доступен через `useNuxtApp()` и в контексте хуков (например, `asyncData`, `fetch`, middleware).

## Перехватчики (Interceptors)

Axios позволяет использовать перехватчики для обработки запросов и ответов до того, как они будут отправлены или обработаны. Вы можете определять перехватчики в плагинах Nuxt.

**Пример плагина для добавления токена авторизации:**

```typescript
// plugins/axios-auth.ts
import { defineNuxtPlugin, useAuth } from '#app';

export default defineNuxtPlugin((nuxtApp) => {
  const { $axios } = nuxtApp;
  const { getToken } = useAuth(); // Предполагается, что у вас есть composable для получения токена

  $axios.onRequest((config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  $axios.onResponseError((error) => {
    console.error('Axios Response Error:', error);
    // Можно выполнить дополнительную обработку ошибок (например, перенаправление на страницу авторизации)
  });
});
```

Замените `useAuth()` и `getToken()` на вашу фактическую логику управления аутентификацией.

## Использование в Server-Side Rendering (SSR)

`$axios` можно безопасно использовать как на клиентской, так и на серверной стороне. При выполнении на сервере `$axios` будет использовать `baseURL`, а на клиенте - `browserBaseURL`, если они определены.

## Заключение

Модуль `@nuxtjs/axios` значительно упрощает выполнение HTTP-запросов в ваших Nuxt приложениях, предоставляя удобный инжектированный объект `$axios` и автоматическую интеграцию с конфигурацией Nuxt. Благодаря поддержке перехватчиков и возможности использования как на клиенте, так и на сервере, он является ценным инструментом для взаимодействия с API.