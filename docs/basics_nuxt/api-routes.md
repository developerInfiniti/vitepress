# API Маршруты в Nuxt

Nuxt позволяет легко создавать API-маршруты непосредственно в вашем приложении, используя каталог `server/api`. Эти маршруты обрабатываются на серверной стороне и могут использоваться для обработки данных, взаимодействия с базами данных, внешними API и выполнения другой серверной логики.

## Структура каталога `server/api`

Все файлы JavaScript, TypeScript или обработчики API (например, `*.js`, `*.ts`) помещенные в каталог `server/api` автоматически становятся API-маршрутами. Структура подкаталогов в `server/api` определяет структуру URL-маршрутов.

**Пример:**

```
server/
└── api/
    ├── hello.js
    └── users/
        ├── [id].js
        └── index.js
```

В этом примере будут созданы следующие API-маршруты:

* `/api/hello` (обработчик определен в `server/api/hello.js`)
* `/api/users` (обработчик определен в `server/api/users/index.js`)
* `/api/users/:id` (обработчик определен в `server/api/users/[id].js`)

## Создание API-маршрута

API-маршруты в Nuxt представляют собой асинхронные функции, которые принимают два аргумента: `event` и `context`.

* **`event`**: Объект, содержащий информацию о входящем запросе, такую как заголовки, тело запроса, параметры запроса и маршрута.
* **`context`**: Объект, содержащий контекст выполнения, включая `$app` (экземпляр NuxtApp) и другие полезные свойства.

Функция должна возвращать данные, которые будут преобразованы в JSON и отправлены обратно клиенту.

**Пример (`server/api/hello.js`):**

```javascript
export default defineEventHandler(async (event) => {
  return {
    message: 'Привет от Nuxt API!',
    timestamp: Date.now()
  };
});
```

При обращении к `/api/hello` вы получите JSON-ответ:

```json
{
  "message": "Привет от Nuxt API!",
  "timestamp": 1678886400000
}
```

## Обработка параметров запроса

### Query-параметры

Query-параметры доступны через `event.node.req.url` или с помощью утилиты `getQuery(event)`.

**Пример (`server/api/hello.js`):**

```javascript
import { getQuery } from 'h3';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const name = query.name || 'Гость';

  return {
    message: `Привет, ${name}!`,
    timestamp: Date.now()
  };
});
```

При обращении к `/api/hello?name=Иван` вы получите:

```json
{
  "message": "Привет, Иван!",
  "timestamp": 1678886400000
}
```

### Параметры маршрута

Для динамических сегментов маршрута (например, `[id].js`), параметры доступны через `event.context.params`.

**Пример (`server/api/users/[id].js`):**

```javascript
export default defineEventHandler(async (event) => {
  const userId = event.context.params.id;

  // Здесь можно выполнить поиск пользователя по ID в базе данных
  const user = { id: userId, name: `Пользователь ${userId}` };

  return { user };
});
```

При обращении к `/api/users/123` вы получите:

```json
{
  "user": {
    "id": "123",
    "name": "Пользователь 123"
  }
}
```

## Обработка тела запроса

Для обработки данных, отправленных клиентом (например, через `POST`, `PUT`, `PATCH`), можно использовать утилиту `readBody(event)`.

**Пример (`server/api/users/index.js` - обработка POST-запроса):**

```javascript
import { readBody } from 'h3';

export default defineEventHandler(async (event) => {
  if (event.node.req.method === 'POST') {
    const body = await readBody(event);
    // Здесь можно сохранить нового пользователя в базу данных
    const newUser = { ...body, id: Date.now() };
    return { newUser, message: 'Пользователь успешно создан' };
  } else {
    return { message: 'Только POST-запросы разрешены для создания пользователей' };
  }
});
```

При отправке POST-запроса с телом (например, `{"name": "Новый Пользователь"}`) на `/api/users` вы получите:

```json
{
  "newUser": {
    "name": "Новый Пользователь",
    "id": 1678887000000
  },
  "message": "Пользователь успешно создан"
}
```

## HTTP Методы

По умолчанию API-маршруты обрабатывают все HTTP-методы (`GET`, `POST`, `PUT`, `DELETE` и т.д.). Вы можете явно обрабатывать определенные методы, проверяя `event.node.req.method`.

**Пример (`server/api/users/[id].js` - обработка GET и DELETE):**

```javascript
export default defineEventHandler(async (event) => {
  const userId = event.context.params.id;

  if (event.node.req.method === 'GET') {
    // Получить информацию о пользователе
    const user = { id: userId, name: `Пользователь ${userId}` };
    return { user };
  } else if (event.node.req.method === 'DELETE') {
    // Удалить пользователя
    return { message: `Пользователь с ID ${userId} удален` };
  } else {
    throw createError({ statusCode: 405, statusMessage: 'Метод не разрешен' });
  }
});
```

## Обработка ошибок

Для отправки ответов об ошибках рекомендуется использовать функцию `createError(options)`.

**Пример (`server/api/users/[id].js` - обработка ошибки, если пользователь не найден):**

```javascript
import { createError } from 'h3';

export default defineEventHandler(async (event) => {
  const userId = event.context.params.id;

  // Попытка найти пользователя в базе данных
  const user = null; // Предположим, пользователь не найден

  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: `Пользователь с ID ${userId} не найден`
    });
  }

  return { user };
});
```

При запросе несуществующего пользователя вы получите ответ с кодом 404 и сообщением об ошибке.

## Использование `$app` Context

Объект `context` предоставляет доступ к `$app`, который является экземпляром NuxtApp. Это позволяет вам использовать плагины и другие ресурсы Nuxt внутри ваших API-маршрутов.

**Пример (использование `$app.$config` для доступа к конфигурации):**

```javascript
export default defineEventHandler(async (event) => {
  const apiKey = event.context.$app.$config.apiSecretKey;
  return { apiKey };
});
```

## Middleware для API-маршрутов

Nuxt позволяет определять middleware, которые выполняются до обработки ваших API-маршрутов. Это полезно для выполнения таких задач, как аутентификация, валидация или логирование. Middleware для API-маршрутов помещаются в каталог `server/middleware`.

## Взаимодействие с API-маршрутами на клиенте

На клиентской стороне вашего Nuxt приложения вы можете взаимодействовать с созданными API-маршрутами, используя `$fetch` или другие HTTP-клиенты (например, `axios`).

**Пример (получение данных из API-маршрута на странице Vue):**

```vue
<template>
  <div>
    <h1>Сообщение от API:</h1>
    <p>{{ message }}</p>
  </div>
</template>

<script setup>
const { data: apiResponse } = await $fetch('/api/hello');
const message = apiResponse.message;
</script>
```

## Заключение

API-маршруты в Nuxt предоставляют простой и удобный способ создания серверной части вашего приложения непосредственно в том же проекте, что и ваш фронтенд. Благодаря автоматической обработке маршрутизации и доступу к контексту Nuxt, вы можете быстро разрабатывать бэкенд-функциональность для вашего Nuxt приложения.