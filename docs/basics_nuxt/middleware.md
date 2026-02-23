# Middleware в Nuxt.js

[Скачать PDF](./middleware.pdf)

## Что такое Middleware?

Middleware (промежуточное ПО) в Nuxt.js — это функции, которые выполняются перед рендерингом страницы или группы страниц. Они позволяют выполнять код на сервере или клиенте перед тем, как страница будет отображена пользователю.

## Типы Middleware

### Анонимный Middleware

Определяется непосредственно в компоненте страницы:

```vue
<script>
export default {
  middleware({ store, redirect }) {
    // Код middleware
    if (!store.state.authenticated) {
      return redirect('/login')
    }
  }
}
</script>
```

### Именованный Middleware

Создается в директории `middleware/` и автоматически загружается Nuxt:

```js
// middleware/auth.js
export default function ({ store, redirect }) {
  // Если пользователь не аутентифицирован
  if (!store.state.authenticated) {
    return redirect('/login')
  }
}
```

Использование в компоненте:

```vue
<script>
export default {
  middleware: 'auth'
}
</script>
```

### Глобальный Middleware

Выполняется для каждого маршрута. Определяется в `nuxt.config.js`:

```js
// nuxt.config.js
export default {
  router: {
    middleware: ['stats', 'auth']
  }
}
```

## Middleware в Nuxt 3

В Nuxt 3 синтаксис немного изменился и появились новые возможности:

```ts
// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const { $auth } = useNuxtApp()
  
  // Если пользователь не аутентифицирован и пытается получить доступ к защищенной странице
  if (!$auth.isAuthenticated && to.meta.requiresAuth) {
    return navigateTo('/login')
  }
})
```

## Порядок выполнения Middleware

1. Глобальные middleware из `nuxt.config.js`
2. Middleware макета (layout)
3. Middleware страницы

## Практические примеры

### Проверка аутентификации

```js
// middleware/auth.js
export default function ({ store, redirect, route }) {
  // Если пользователь не аутентифицирован и пытается получить доступ к защищенной странице
  const isAuthenticated = store.state.auth.authenticated
  const requiresAuth = route.meta.some(meta => meta.requiresAuth)
  
  if (!isAuthenticated && requiresAuth) {
    return redirect('/login')
  }
}
```

### Проверка роли пользователя

```js
// middleware/admin.js
export default function ({ store, redirect, route }) {
  // Если пользователь не админ и пытается получить доступ к админ-панели
  const isAdmin = store.state.auth.user && store.state.auth.user.role === 'admin'
  
  if (!isAdmin) {
    return redirect('/')
  }
}
```

### Отслеживание посещений

```js
// middleware/stats.js
export default function ({ route, $axios }) {
  // Отправка информации о посещении страницы на сервер аналитики
  $axios.post('/api/stats', {
    path: route.path,
    timestamp: new Date().toISOString()
  })
}
```

## Заключение

Middleware в Nuxt.js — это мощный инструмент для выполнения кода перед рендерингом страниц. Он позволяет реализовать такие функции, как аутентификация, авторизация, отслеживание и многое другое. Правильное использование middleware может значительно упростить разработку и улучшить структуру вашего приложения.