# Маршрутизация в Nuxt.js

[Завантажити PDF](./routing.pdf)

## Введение в маршрутизацию Nuxt

Одной из самых мощных функций Nuxt.js является система автоматической маршрутизации. Nuxt автоматически генерирует конфигурацию Vue Router на основе структуры файлов в директории `pages/`.

## Базовая маршрутизация

### Структура директории pages

```
pages/
--| user/
-----| index.vue
-----| profile.vue
--| index.vue
```

Автоматически сгенерированные маршруты:

```js
router: {
  routes: [
    {
      name: 'index',
      path: '/',
      component: 'pages/index.vue'
    },
    {
      name: 'user',
      path: '/user',
      component: 'pages/user/index.vue'
    },
    {
      name: 'user-profile',
      path: '/user/profile',
      component: 'pages/user/profile.vue'
    }
  ]
}
```

## Динамические маршруты

### Одиночный динамический параметр

Файл: `pages/users/_id.vue`

Маршрут: `/users/:id`

```vue
<template>
  <div>
    <h1>Пользователь {{ $route.params.id }}</h1>
  </div>
</template>

<script>
export default {
  validate({ params }) {
    // Должен быть числом
    return /^\d+$/.test(params.id)
  }
}
</script>
```

### Несколько динамических параметров

Файл: `pages/categories/_category/_product.vue`

Маршрут: `/categories/:category/:product`

## Вложенные маршруты

Для создания вложенных маршрутов необходимо создать файл Vue с таким же именем, как и директория, содержащая дочерние компоненты.

```
pages/
--| users/
-----| _id.vue
-----| index.vue
--| users.vue
```

```vue
<!-- pages/users.vue -->
<template>
  <div>
    <h1>Пользователи</h1>
    <NuxtChild /> <!-- Здесь будут отображаться дочерние компоненты -->
  </div>
</template>
```

## Программная навигация

```vue
<template>
  <div>
    <button @click="goToHome">На главную</button>
    <button @click="goToUser(123)">Пользователь 123</button>
  </div>
</template>

<script>
export default {
  methods: {
    goToHome() {
      this.$router.push('/')
    },
    goToUser(id) {
      this.$router.push(`/users/${id}`)
    }
  }
}
</script>
```

## Маршрутизация в Nuxt 3

В Nuxt 3 появились новые возможности для маршрутизации:

### Использование composables

```vue
<script setup>
const router = useRouter()
const route = useRoute()

function goToHome() {
  router.push('/')
}

function goToUser(id) {
  router.push(`/users/${id}`)
}

// Получение параметров маршрута
const userId = route.params.id
</script>
```

### Именованные маршруты

```vue
<template>
  <div>
    <NuxtLink :to="{ name: 'user-profile', params: { id: 123 } }">
      Профиль пользователя
    </NuxtLink>
  </div>
</template>
```

## Middleware и Guards

### Защита маршрутов

```vue
<script>
export default {
  middleware: 'auth'
}
</script>
```

### Валидация маршрутов

```vue
<script>
export default {
  validate({ params }) {
    // Возвращает true, если параметр существует и является числом
    return params.id && Number.isInteger(+params.id)
  }
}
</script>
```

## Настройка маршрутизации

```js
// nuxt.config.js
export default {
  router: {
    base: '/app/', // Базовый путь для приложения
    extendRoutes(routes, resolve) {
      // Добавление пользовательских маршрутов
      routes.push({
        name: 'custom',
        path: '/custom-path',
        component: resolve(__dirname, 'pages/custom.vue')
      })
    },
    middleware: 'stats' // Глобальный middleware
  }
}
```

## Заключение

Маршрутизация в Nuxt.js — это мощный и гибкий инструмент, который значительно упрощает разработку сложных приложений. Автоматическая генерация маршрутов на основе структуры файлов, поддержка динамических параметров, вложенных маршрутов и middleware делают Nuxt.js идеальным выбором для создания современных веб-приложений.