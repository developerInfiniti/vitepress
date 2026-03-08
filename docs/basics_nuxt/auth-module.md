---
description: "Auth модуль Nuxt.js: настройка, стратегии, провайдеры — готовое решение для аутентификации"
---

## Модуль `@sidebase/nuxt-auth`

Это очень рекомендуемый и гибкий модуль для Nuxt 3, который поддерживает различные провайдеры аутентификации (такие как социальные логины с OAuth 2.0, OpenID Connect, локальные стратегии с именем пользователя/паролем и многое другое). Он хорошо документирован и активно поддерживается.

**Установка:**

```bash
npm install @sidebase/nuxt-auth
# или
yarn add @sidebase/nuxt-auth
```

**Конфигурация (`nuxt.config.ts`):**

Вам потребуется настроить модуль с выбранными вами стратегиями и параметрами аутентификации. Вот базовый пример для локальной стратегии (имя пользователя/пароль):

```typescript
export default defineNuxtConfig({
  modules: [
    '@sidebase/nuxt-auth',
  ],
  auth: {
    baseURL: '/api/auth', // Базовый URL для API-эндпоинтов модуля
    provider: {
      local: {
        endpoints: {
          signIn: { path: '/login', method: 'post' },
          signOut: { path: '/logout', method: 'post' },
          signUp: { path: '/register', method: 'post' },
          getUser: { path: '/user', method: 'get' },
        },
        token: {
          signInResponseTokenPointer: '/token', // Путь к токену в ответе на вход
          type: 'Bearer',
          scheme: 'Bearer',
        },
        user: {
          dataPointer: '/user', // Путь к объекту пользователя в ответе на получение пользователя
        },
      },
    },
    session: {
      // Опции управления сессиями (например, настройки cookie)
      cookie: {
        sameSite: 'lax',
      },
    },
    globalMiddleware: true, // Защитить все маршруты по умолчанию (можно переопределить)
    // ... другие опции
  },
});
```

**Бэкенд API Эндпоинты:**

Вам потребуется создать соответствующие API-эндпоинты на вашем бэкенде (например, используя серверные маршруты Nuxt в каталоге `server/api` или отдельный бэкенд-фреймворк, такой как Express, Laravel и т. д.), которые будут обрабатывать логику аутентификации (проверку учетных данных, создание сессий и т. д.) и соответствовать путям, определенным в конфигурации `auth.provider.local.endpoints`.

**Пример серверного маршрута Nuxt (`server/api/auth/login.post.ts`):**

```typescript
import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {
  const { username, password } = await readBody(event);

  // Замените на вашу фактическую логику аутентификации (например, поиск в базе данных)
  if (username === 'test' && password === 'password') {
    const user = { id: 1, username: 'test' };
    const token = 'your-generated-token'; // Сгенерируйте JWT или токен сессии

    // Возможно, вы захотите хранить сессию на сервере (например, в базе данных)
    // и возвращать идентификатор сессии вместо полного объекта пользователя и токена напрямую.

    return { user, token };
  } else {
    throw createError({ statusCode: 401, statusMessage: 'Неверные учетные данные' });
  }
});
```

**Использование в компонентах:**

Модуль `@sidebase/nuxt-auth` предоставляет composables для доступа к состоянию и методам аутентификации:

```vue
<template>
  <div>
    <p v-if="isAuthenticated">Вы вошли как: {{ user?.username }}</p>
    <p v-else>Вы не вошли.</p>
    <button @click="signInLocal">Войти</button>
    <button @click="signOut">Выйти</button>
  </div>
</template>

<script setup>
import { useAuth } from '@sidebase/nuxt-auth';
import { ref } from 'vue';

const { signIn, signOut, user, isAuthenticated } = useAuth();
const username = ref('');
const password = ref('');

async function signInLocal() {
  await signIn('local', { username: username.value, password: password.value });
}
</script>
```

**Защита маршрутов (Middleware):**

Если в конфигурации установлено `globalMiddleware: true`, все маршруты защищены по умолчанию. Вы можете сделать определенные маршруты общедоступными, добавив `auth: false` в их `definePageMeta`:

```vue
<script setup>
definePageMeta({
  auth: false, // Эта страница будет доступна без аутентификации
});
</script>

<template>
  <div>Общедоступная страница</div>
</template>
```

Для более детального контроля вы можете использовать именованные middleware:

```typescript
// middleware/auth.ts
import { defineNuxtRouteMiddleware, useAuth } from '@sidebase/nuxt-auth';

export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated.value) {
    return navigateTo('/login');
  }
});
```

Затем примените этот middleware к определенным маршрутам:

```vue
<script setup>
definePageMeta({
  middleware: 'auth', // Применить middleware 'auth' к этой странице
});
</script>

<template>
  <div>Защищенная страница</div>
</template>
```

**Другие стратегии аутентификации:**

`@sidebase/nuxt-auth` поддерживает другие стратегии, такие как OAuth 2.0 (для социальных логинов). Вам потребуется настроить соответствующего провайдера (например, `auth.provider.github`, `auth.provider.google`) с учетными данными вашего приложения и следовать документации модуля для настройки.

**Основные моменты:**

* **Бэкенд реализация:** Вам всегда понадобится бэкенд для обработки фактической логики аутентификации (проверка учетных данных, управление сессиями и т. д.).
* **Безопасность:** Реализуйте надлежащие меры безопасности на своем бэкенде, такие как хеширование паролей, защита от распространенных веб-уязвимостей и безопасная обработка токенов.
* **Пользовательский опыт:** Разработайте понятный и удобный процесс аутентификации.

**Для других модулей аутентификации, таких как `@nuxtjs/supabase` и `@nuxtjs/firebase`, настройка и использование будут зависеть от этих платформ. Обратитесь к их соответствующей документации для получения подробных инструкций.**

Таким образом, для Nuxt 3 `@sidebase/nuxt-auth` является мощным и гибким модулем для обработки различных сценариев аутентификации. Обязательно настройте его правильно и реализуйте необходимую бэкенд-логику.