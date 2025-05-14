# Модуль `@nuxtjs/firebase` в Nuxt

Модуль `@nuxtjs/firebase` упрощает интеграцию Firebase сервисов (таких как Authentication, Firestore, Realtime Database, Storage, Functions и др.) в ваши Nuxt 3 приложения. Он предоставляет удобный способ инициализации Firebase и доступа к его SDK из любой части вашего приложения.

**Важно:** Этот модуль является сторонним и не поддерживается непосредственно командой Nuxt или Google. Однако он широко используется и поддерживается сообществом.

## Установка

Для начала установите модуль `@nuxtjs/firebase`:

```bash
npm install --save @nuxtjs/firebase
# или
yarn add @nuxtjs/firebase
```

Затем добавьте `@nuxtjs/firebase` в секцию `modules` вашего файла `nuxt.config.ts` (или `nuxt.config.js`):

```typescript
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/firebase',
  ],
  firebase: {
    // Настройки модуля (см. ниже)
    config: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
      // measurementId: process.env.FIREBASE_MEASUREMENT_ID // Optional
    },
    services: {
      auth: true, // Включить Firebase Authentication
      firestore: true, // Включить Cloud Firestore
      realtimeDatabase: true, // Включить Realtime Database
      storage: true, // Включить Firebase Storage
      functions: true, // Включить Cloud Functions
      messaging: true, // Включить Firebase Cloud Messaging
      analytics: true, // Включить Google Analytics for Firebase
      performance: true, // Включить Firebase Performance Monitoring
      remoteConfig: true, // Включить Firebase Remote Config
    },
    // emulatorPort: 9099, // Порт для эмулятора Authentication (пример)
    // emulatorHost: 'localhost', // Хост для эмуляторов
    // ... другие настройки
  },
  // ... другие настройки
});
```

## Настройка (`nuxt.config.ts`)

В секции `firebase` вашего `nuxt.config.ts` вы настраиваете модуль.

**Основные опции:**

* **`config` (обязательно)**: Объект с конфигурацией вашего Firebase проекта. Эти значения обычно берутся из настроек вашего Firebase проекта (консоль Firebase -> Настройки проекта -> Ваши приложения). Рекомендуется хранить эти значения в переменных окружения (`.env`).
* **`services` (обязательно)**: Объект, определяющий, какие Firebase сервисы вы хотите использовать в своем приложении. Установите значение в `true` для включения сервиса.
* **`emulatorPort` / `emulatorHost`**: Позволяют подключаться к локальным эмуляторам Firebase для разработки. Укажите порт и хост для каждого эмулируемого сервиса (например, `emulatorPort: { auth: 9099, firestore: 8080 }`).
* **`onFirebaseHosting`**: Булево значение, указывающее, развернуто ли ваше приложение на Firebase Hosting. Может использоваться для оптимизаций.
* **`useAuthEmulator` / `useFirestoreEmulator` / ...**: Отдельные булевы флаги для принудительного использования эмуляторов для конкретных сервисов.

## Использование Firebase Services

После настройки модуля вы можете получить доступ к Firebase SDK и его сервисам через инжектированный объект `$firebaseApp` и `$firebaseAuth`, `$firestore`, `$database`, `$storage`, `$functions`, `$messaging`, `$analytics`, `$performance`, `$remoteConfig`.

**Пример использования Firebase Authentication:**

```vue
<template>
  <div>
    <p v-if="user">Logged in as: {{ user.email }}</p>
    <p v-else>Not logged in.</p>
    <button @click="signInWithGoogle">Sign In with Google</button>
    <button @click="signOut">Sign Out</button>
  </div>
</template>

<script setup>
import { useFirebaseApp } from '#imports';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';
import { ref, onMounted } from 'vue';

const firebaseApp = useFirebaseApp();
const auth = getAuth(firebaseApp);
const provider = new GoogleAuthProvider();
const user = ref(null);

onMounted(() => {
  onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser;
  });
});

async function signInWithGoogle() {
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error('Error signing in with Google', error);
  }
}

async function signOut() {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out', error);
  }
}
</script>
```

**Пример использования Cloud Firestore:**

```vue
<template>
  <div>
    <h1>Users</h1>
    <ul>
      <li v-for="user in users" :key="user.id">{{ user.name }}</li>
    </ul>
  </div>
</template>

<script setup>
import { useFirebaseApp } from '#imports';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { ref, onMounted } from 'vue';

const firebaseApp = useFirebaseApp();
const db = getFirestore(firebaseApp);
const users = ref([]);

onMounted(async () => {
  const querySnapshot = await getDocs(collection(db, 'users'));
  querySnapshot.forEach((doc) => {
    users.value.push({ id: doc.id, ...doc.data() });
  });
});
</script>
```

Аналогичным образом вы можете использовать другие сервисы Firebase, импортируя необходимые функции из соответствующих пакетов Firebase SDK (`firebase/firestore`, `firebase/database`, `firebase/storage`, `firebase/functions`, etc.) и получая доступ к инстанциям сервисов через `$firebaseApp`.

## Плагины

Модуль `@nuxtjs/firebase` автоматически регистрирует плагин, который инициализирует Firebase и предоставляет инжектированные объекты. Вы можете расширять этот плагин или создавать свои собственные плагины для дальнейшей интеграции с Firebase.

## Server-Side Rendering (SSR)

При использовании SSR с Firebase необходимо учитывать, что некоторые Firebase SDK могут вести себя по-разному на сервере и на клиенте (например, из-за отсутствия доступа к API браузера на сервере). Модуль `@nuxtjs/firebase` старается обеспечить корректную инициализацию Firebase как на сервере, так и на клиенте.

Для работы с Firebase на сервере (например, в Nuxt API-маршрутах или middleware), вы также можете использовать `$firebaseApp` и его сервисы.

## Безопасность

При работе с Firebase ключи API являются общедоступными. Правила безопасности Firebase (например, Security Rules для Firestore и Realtime Database) являются критически важными для защиты ваших данных. Настройте эти правила в консоли Firebase.

Для серверных операций, требующих административных привилегий, используйте Firebase Admin SDK на вашем собственном бэкенде (не в Nuxt frontend).

## Эмуляторы Firebase

Для локальной разработки рекомендуется использовать Firebase Emulators. Модуль `@nuxtjs/firebase` предоставляет опции (`emulatorPort`, `emulatorHost`, `use*Emulator`) для подключения к запущенным эмуляторам, что позволяет разрабатывать и тестировать ваше приложение без взаимодействия с production или staging базами данных Firebase.

## Заключение

Модуль `@nuxtjs/firebase` значительно упрощает интеграцию Firebase в ваши Nuxt 3 приложения, предоставляя удобный доступ к Firebase SDK и его сервисам. Следуя инструкциям по настройке и используя инжектированные объекты, вы можете быстро начать использовать возможности Firebase для аутентификации, хранения данных, облачных функций и многого другого в своем Nuxt проекте. Не забывайте о правилах безопасности Firebase для защиты ваших данных.