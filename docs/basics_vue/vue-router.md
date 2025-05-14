# Основы Vue.js: Vue Router

**Vue Router** — это официальный маршрутизатор для Vue.js. Он глубоко интегрирован с ядром Vue.js и делает создание одностраничных приложений (SPA) с клиентской маршрутизацией очень простым.

## Установка Vue Router

Для использования Vue Router его необходимо установить как зависимость вашего проекта. Если вы используете Vue CLI, вы можете добавить Vue Router при создании проекта или позже с помощью команды:

```bash
vue add router
````

Если вы настраиваете проект вручную, установите Vue Router с помощью npm или yarn:

```bash
npm install vue-router
# или
yarn add vue-router
```

Затем вам нужно импортировать и использовать Vue Router в вашем основном файле JavaScript (обычно `main.js`):

```javascript
// main.js
import Vue from 'vue';
import App from './App.vue';
import router from './router'; // Предполагается, что вы создали файл router/index.js

Vue.config.productionTip = false;

new Vue({
  router, // Внедряем маршрутизатор в корневой экземпляр Vue
  render: h => h(App),
}).$mount('#app');
```

## Настройка маршрутов

Обычно маршруты определяются в отдельном файле (например, `router/index.js`). В этом файле вы импортируете Vue Router и ваши компоненты, а затем создаете экземпляр маршрутизатора с определенными маршрутами.

```javascript
// router/index.js
import Vue from 'vue';
import VueRouter from 'vue-router';
import HomePage from '../components/HomePage.vue';
import AboutPage from '../components/AboutPage.vue';
import UserProfile from '../components/UserProfile.vue';

Vue.use(VueRouter); // Устанавливаем плагин Vue Router

const routes = [
  {
    path: '/', // Путь по умолчанию
    name: 'Home', // Имя маршрута (не обязательно, но полезно для именованных маршрутов)
    component: HomePage, // Компонент, который будет отображаться при переходе на этот путь
  },
  {
    path: '/about',
    name: 'About',
    component: AboutPage,
  },
  {
    path: '/user/:id', // Динамический сегмент пути (параметр)
    name: 'User',
    component: UserProfile,
  },
];

const router = new VueRouter({
  routes, // Сокращенная запись для `routes: routes`
});

export default router;
```

В этом примере мы определили три маршрута:

* `/`: Отображает компонент `HomePage`.
* `/about`: Отображает компонент `AboutPage`.
* `/user/:id`: Отображает компонент `UserProfile`. `:id` является динамическим сегментом пути, который будет доступен как параметр в компоненте `UserProfile`.

## Отображение компонентов маршрута

Для отображения компонентов, соответствующих текущему маршруту, вы используете компонент `<router-view>` в шаблоне вашего основного компонента (`App.vue` или другого родительского компонента).

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

<script>
export default {
  name: 'App',
};
</script>
```

Компонент `<router-view>` является функциональным компонентом, который отображает компонент, соответствующий текущему маршруту.

## Навигация

Vue Router предоставляет несколько способов навигации между маршрутами:

### `<router-link>`

Компонент `<router-link>` является предпочтительным способом навигации, так как он поддерживает историю браузера и работает как обычные ссылки `<a>`, но без полной перезагрузки страницы.

* **`to` (string):** Указывает путь для перехода.

* **`:to` (object):** Позволяет использовать именованные маршруты или передавать параметры.

  ```html
  <router-link to="/about">Перейти на страницу About</router-link>
  <router-link :to="{ path: '/user/456' }">Перейти к пользователю 456</router-link>
  <router-link :to="{ name: 'User', params: { id: 789 }}">Перейти к пользователю 789 (используя имя маршрута)</router-link>
  ```

### Программная навигация

Вы также можете программно переходить между маршрутами, используя методы объекта `$router`, доступного в каждом компоненте Vue, внедренном с помощью Vue Router.

* **`$router.push(location)`:** Переходит на указанный маршрут, добавляя запись в историю браузера. `location` может быть строкой пути или объектом, как и атрибут `to` у `<router-link>`.

  ```javascript
  this.$router.push('/about');
  this.$router.push({ path: '/user/101' });
  this.$router.push({ name: 'User', params: { id: 202 } });
  ```

* **`$router.replace(location)`:** Работает аналогично `$router.push()`, но заменяет текущую запись в истории браузера.

  ```javascript
  this.$router.replace('/'); // Перенаправление на главную страницу, не добавляя запись в историю
  ```

* **`$router.go(n)`:** Перемещается на `n` шагов вперед или назад в истории браузера.

  ```javascript
  this.$router.go(-1); // Назад на одну страницу
  this.$router.go(1);  // Вперед на одну страницу
  ```

* **`$router.back()`:** Эквивалентно `$router.go(-1)`.

* **`$router.forward()`:** Эквивалентно `$router.go(1)`.

## Динамические маршруты

Как вы видели в примере с `/user/:id`, Vue Router позволяет определять динамические сегменты в путях маршрутов. Значения этих сегментов доступны в компоненте через объект `$route.params`.

```vue
<template>
  <div>
    <h1>Профиль пользователя с ID: {{ userId }}</h1>
    </div>
</template>

<script>
export default {
  computed: {
    userId() {
      return this.$route.params.id;
    },
  },
};
</script>
```

При переходе на `/user/123`, значение `this.$route.params.id` в компоненте `UserProfile` будет равно `"123"`.

## Вложенные маршруты

Vue Router позволяет создавать вложенные маршруты, что полезно для приложений со сложной структурой интерфейса. Вы определяете дочерние маршруты внутри родительского маршрута в массиве `children`. Вложенные компоненты отображаются внутри `<router-view>` родительского компонента.

```javascript
// router/index.js
import UserLayout from '../components/UserLayout.vue';
import UserDetails from '../components/UserDetails.vue';
import UserPosts from '../components/UserPosts.vue';

// ... другие импорты ...

const routes = [
  // ... другие маршруты ...
  {
    path: '/user/:id',
    component: UserLayout, // Родительский компонент с <router-view>
    children: [
      {
        path: '', // Путь по умолчанию для /user/:id
        name: 'UserDetails',
        component: UserDetails,
      },
      {
        path: 'posts', // Полный путь будет /user/:id/posts
        name: 'UserPosts',
        component: UserPosts,
      },
    ],
  },
];

// ... создание и экспорт router ...
```

В шаблоне `UserLayout.vue` вам нужно разместить `<router-view>` для отображения `UserDetails` или `UserPosts`.

```html
<template>
  <div>
    <h2>Информация о пользователе</h2>
    <router-view></router-view> </div>
</template>

<script>
export default {
  // ...
};
</script>
```

Для перехода к вложенным маршрутам вы можете использовать `<router-link>` с соответствующим путем или именем:

```html
<router-link :to="{ name: 'UserDetails', params: { id: 456 }}">Детали пользователя</router-link>
<router-link :to="{ name: 'UserPosts', params: { id: 456 }}">Посты пользователя</router-link>
```

## Именованные маршруты

Именование маршрутов (с помощью свойства `name` в определении маршрута) упрощает навигацию, особенно при использовании динамических маршрутов, так как вам не нужно жестко кодировать пути.

```javascript
{
  path: '/user/:id',
  name: 'User',
  component: UserProfile,
}
```

Для перехода к именованному маршруту используйте объект в атрибуте `to` или в методах `$router.push()`/`$router.replace()`:

```html
<router-link :to="{ name: 'User', params: { id: 789 }}">Перейти к пользователю 789</router-link>

<script>
export default {
  methods: {
    goToUser(userId) {
      this.$router.push({ name: 'User', params: { id: userId } });
    },
  },
};
</script>
```

## Передача параметров в маршруты

Помимо параметров, передаваемых через URL (динамические сегменты), вы также можете передавать параметры через объект `query` (в URL как query-параметры) или `params` (в пути, как описано выше) при использовании `<router-link>` или программной навигации.

### Query-параметры

```html
<router-link :to="{ path: '/search', query: { q: 'vue', sort: 'date' } }">Поиск Vue</router-link>

<script>
export default {
  methods: {
    search(query) {
      this.$router.push({ path: '/search', query });
    },
  },
};
</script>
```

В компоненте, обрабатывающем маршрут `/search`, query-параметры доступны через `$route.query`:

```vue
<template>
  <div>
    <h1>Результаты поиска по: {{ query }}</h1>
    <p>Сортировка по: {{ sort }}</p>
    </div>
</template>

<script>
export default {
  computed: {
    query() {
      return this.$route.query.q;
    },
    sort() {
      return this.$route.query.sort;
    },
  },
};
</script>
```

### Params (в пути)

Параметры, определенные в пути (например, `/user/:id`), доступны через `$route.params`, как показано в разделе о динамических маршрутах.

## Хуки навигации

Vue Router предоставляет хуки навигации, которые позволяют перехватывать и контролировать процесс перехода между маршрутами. Существует три типа хуков:

* **Глобальные хуки:** Запускаются при каждом переходе между маршрутами.

    * `router.beforeEach((to, from, next) => { ... })`: Запускается перед каждым переходом.
    * `router.beforeResolve((to, from, next) => { ... })`: Запускается после отработки всех хуков `beforeRouteEnter` и хуков `beforeEach` и `beforeResolve` в компонентах.
    * `router.afterEach((to, from) => { ... })`: Запускается после завершения перехода.

* **Хуки для каждого маршрута:** Определяются непосредственно в определении маршрута.

    * `beforeEnter: (to, from, next) => { ... }`: Запускается перед входом в конкретный маршрут.

* **Хуки внутри компонентов:** Определяются внутри компонентов маршрута.

    * `beforeRouteEnter(to, from, next)`: Запускается перед отрисовкой компонента. Не имеет доступа к `this`, так как компонент еще не создан.
    * `beforeRouteUpdate(to, from, next)`: Запускается, когда маршрут, отображающий компонент, изменился, но сам компонент используется повторно (например, при изменении динамического параметра). Имеет доступ к `this`.
    * `beforeRouteLeave(to, from, next)`: Запускается перед тем, как пользователь покинет компонент.

Каждый хук получает аргументы `to` (целевой маршрут), `from` (текущий маршрут) и `next` (функция, которую необходимо вызвать для продолжения навигации). Вызов `next()` разрешает переход, `next(false)` отменяет его, а `next('/path')` перенаправляет на другой путь.

Пример глобального хука `beforeEach` для проверки авторизации:

```javascript
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token'); // Проверка наличия токена

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login'); // Перенаправление на страницу логина, если маршрут требует авторизации и пользователь не аутентифицирован
  } else {
    next(); // Разрешить переход
  }
});

// В определении маршрута можно добавить мета-поле:
{
  path: '/admin',
  component: AdminPage,
  meta: { requiresAuth: true },
}
```

## Режимы работы маршрутизатора

Vue Router поддерживает два режима работы истории браузера:

* **Hash Mode (по умолчанию):** Использует хеш URL (`#`) для навигации. Поддерживается всеми браузерами и не требует настройки сервера. URL выглядят примерно так: `http://example.com/#/about`.

* **History Mode:** Использует API истории браузера (`pushState`/`replaceState`) для создания "чистых" URL без хеша: `http://example.com/about`. Для работы в этом режиме требуется правильная настройка сервера для обслуживания одного и того же файла `index.html` для всех маршрутов вашего приложения, чтобы Vue Router мог корректно обрабатывать навигацию на стороне клиента.

Для включения History Mode при создании экземпляра `VueRouter`:

```javascript
const router = new VueRouter({
  mode: 'history',
  routes,
});
```

**Важно:** При использовании History Mode убедитесь, что ваш сервер настроен на обслуживание вашего приложения для всех запрошенных путей. Например, в Node.js с Express вы можете использовать middleware, который отправляет `index.html` для всех `GET *` запросов, не соответствующих статическим файлам.

## Заключение

Vue Router — мощный и гибкий инструмент для создания одностраничных приложений с навигацией на стороне клиента. Понимание основных концепций, таких как определение маршрутов, использование `<router-link>` и программная навигация, работа с динамическими маршрутами и параметрами, а также использование хуков навигации, позволит вам создавать сложные и удобные веб-приложения на Vue.js.
