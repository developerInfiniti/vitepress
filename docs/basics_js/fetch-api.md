---
title: Fetch API в JavaScript
description: Полное руководство по Fetch API — запросы, ответы, обработка ошибок, AbortController, CORS, загрузка файлов
---

<script setup>
import { useLazyComponent } from '../.vitepress/composables/useLazyComponent'
const FetchAPIDemo = useLazyComponent(() => import('../.vitepress/components/FetchAPIDemo.vue'))
</script>

# Fetch API в JavaScript

<FetchAPIDemo />

## 1. Основы — синтаксис и работа с Promise

### Что такое Fetch API

Fetch API — современный интерфейс для выполнения HTTP-запросов, основанный на промисах. Пришёл на замену `XMLHttpRequest`.

```javascript
// Базовый синтаксис
fetch(url)
fetch(url, options)

// Простейший GET-запрос
fetch('https://jsonplaceholder.typicode.com/posts/1')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Ошибка:', error));
```

### Fetch возвращает Promise

```javascript
// fetch() возвращает Promise<Response>
const promise = fetch('https://jsonplaceholder.typicode.com/posts/1');

// Promise разрешается, когда сервер отвечает заголовками
// НЕ дожидаясь загрузки тела ответа
promise.then(response => {
  console.log(response.status);    // 200
  console.log(response.ok);        // true (статус 200-299)
  console.log(response.headers);   // Headers объект

  // Тело ответа читается отдельным промисом
  return response.json();          // Promise<any>
});
```

### Использование async/await

```javascript
async function getPost(id) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${id}`
  );

  if (!response.ok) {
    throw new Error(`HTTP ошибка: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

// Использование
const post = await getPost(1);
console.log(post.title);
```

## 2. Request Options

### Структура объекта настроек

```javascript
fetch(url, {
  method: 'POST',              // GET, POST, PUT, PATCH, DELETE, HEAD
  headers: {                   // Заголовки запроса
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token123'
  },
  body: JSON.stringify(data),  // Тело запроса
  mode: 'cors',               // cors, no-cors, same-origin
  credentials: 'same-origin', // omit, same-origin, include
  cache: 'default',           // default, no-store, reload, no-cache, force-cache
  redirect: 'follow',         // follow, manual, error
  signal: controller.signal,  // AbortSignal для отмены
});
```

### GET-запрос с параметрами

```javascript
// Через URLSearchParams
const params = new URLSearchParams({
  userId: 1,
  _limit: 5,
});

const response = await fetch(
  `https://jsonplaceholder.typicode.com/posts?${params}`
);
const posts = await response.json();
// GET /posts?userId=1&_limit=5
```

### POST-запрос

```javascript
async function createPost(title, body) {
  const response = await fetch(
    'https://jsonplaceholder.typicode.com/posts',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({
        title,
        body,
        userId: 1,
      }),
    }
  );

  const data = await response.json();
  return data;
}

const newPost = await createPost('Заголовок', 'Содержание поста');
console.log(newPost.id); // 101
```

### PUT и PATCH

```javascript
// PUT — полная замена ресурса
async function updatePost(id, post) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${id}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post),
    }
  );
  return response.json();
}

// PATCH — частичное обновление
async function patchPost(id, fields) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${id}`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fields),
    }
  );
  return response.json();
}

await patchPost(1, { title: 'Новый заголовок' });
```

### DELETE

```javascript
async function deletePost(id) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${id}`,
    { method: 'DELETE' }
  );

  if (response.ok) {
    console.log(`Пост ${id} удалён`);
  }
}
```

## 3. Response — обработка ответа

### Свойства Response

```javascript
const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');

// Метаданные
response.status;       // 200
response.statusText;   // 'OK'
response.ok;           // true (200-299)
response.url;          // полный URL
response.type;         // 'basic', 'cors', 'opaque'
response.redirected;   // false
```

### Чтение тела ответа

```javascript
// Каждый метод можно вызвать ТОЛЬКО ОДИН раз — тело потребляется

// JSON
const data = await response.json();

// Текст
const text = await response.text();

// Blob (файлы, изображения)
const blob = await response.blob();
const imageUrl = URL.createObjectURL(blob);

// ArrayBuffer (бинарные данные)
const buffer = await response.arrayBuffer();

// FormData
const formData = await response.formData();
```

### Чтение заголовков ответа

```javascript
const response = await fetch('https://jsonplaceholder.typicode.com/posts');

// Получение заголовка
response.headers.get('Content-Type');     // 'application/json; charset=utf-8'
response.headers.has('Content-Type');     // true

// Перебор всех заголовков
for (const [key, value] of response.headers) {
  console.log(`${key}: ${value}`);
}
```

### Клонирование ответа

```javascript
// Если нужно прочитать тело дважды — клонируйте
const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');

const clone = response.clone();

const text = await response.text();   // Читаем как текст
const json = await clone.json();      // Читаем клон как JSON
```

## 4. Обработка ошибок

### Важно: fetch НЕ выбрасывает ошибку при HTTP-ошибках

```javascript
// fetch отклоняет Promise ТОЛЬКО при сетевой ошибке
// Статусы 4xx и 5xx НЕ вызывают reject!

// НЕПРАВИЛЬНО — catch не сработает при 404
fetch('/api/data')
  .then(res => res.json())
  .catch(err => console.log('Ошибка?')); // НЕТ при 404!

// ПРАВИЛЬНО — проверяем response.ok
async function fetchData(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}
```

### Комплексная обработка ошибок

```javascript
async function safeFetch(url, options = {}) {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      // Пытаемся прочитать тело ошибки
      const errorBody = await response.text();
      let errorMessage;

      try {
        const errorJson = JSON.parse(errorBody);
        errorMessage = errorJson.message || errorBody;
      } catch {
        errorMessage = errorBody;
      }

      throw new Error(
        `HTTP ${response.status}: ${errorMessage}`
      );
    }

    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Запрос отменён');
    } else if (error.name === 'TypeError') {
      console.error('Сетевая ошибка или CORS:', error.message);
    } else {
      console.error('Ошибка запроса:', error.message);
    }
    throw error;
  }
}
```

### Повторные попытки (Retry)

```javascript
async function fetchWithRetry(url, options = {}, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);

      if (!response.ok && response.status >= 500) {
        throw new Error(`Server error: ${response.status}`);
      }

      return response;
    } catch (error) {
      if (i === retries - 1) throw error;

      console.log(`Попытка ${i + 1} неудачна. Повтор через ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2; // Экспоненциальная задержка
    }
  }
}
```

### Таймаут запроса

```javascript
async function fetchWithTimeout(url, options = {}, timeout = 5000) {
  const controller = new AbortController();

  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

// Использование
try {
  const response = await fetchWithTimeout('/api/slow', {}, 3000);
} catch (error) {
  if (error.name === 'AbortError') {
    console.log('Таймаут: сервер не ответил за 3 секунды');
  }
}
```

## 5. AbortController — отмена запросов

### Основы отмены

```javascript
const controller = new AbortController();
const signal = controller.signal;

// Передаём signal в fetch
fetch('https://jsonplaceholder.typicode.com/posts', { signal })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => {
    if (error.name === 'AbortError') {
      console.log('Запрос был отменён');
    }
  });

// Отменяем запрос
controller.abort();
```

### Отмена нескольких запросов

```javascript
const controller = new AbortController();

// Один signal для нескольких запросов
const requests = [
  fetch('/api/users', { signal: controller.signal }),
  fetch('/api/posts', { signal: controller.signal }),
  fetch('/api/comments', { signal: controller.signal }),
];

// Отменить ВСЕ запросы разом
controller.abort();

try {
  const responses = await Promise.all(requests);
} catch (error) {
  if (error.name === 'AbortError') {
    console.log('Все запросы отменены');
  }
}
```

### Отмена в компоненте (React/Vue пример)

```javascript
// Отмена при размонтировании компонента
function useApi(url) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch(url, { signal: controller.signal })
      .then(res => res.json())
      .then(setData)
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error(err);
        }
      });

    // Cleanup — отмена при размонтировании
    return () => controller.abort();
  }, [url]);

  return data;
}
```

### AbortSignal.timeout() (современный API)

```javascript
// Встроенный таймаут (ES2024)
const response = await fetch('/api/data', {
  signal: AbortSignal.timeout(5000), // 5 секунд
});

// Комбинирование сигналов
const controller = new AbortController();
const timeoutSignal = AbortSignal.timeout(5000);

const response = await fetch('/api/data', {
  signal: AbortSignal.any([controller.signal, timeoutSignal]),
});
```

## 6. CORS и credentials

### Режимы запроса (mode)

```javascript
// 'cors' — (по умолчанию) кросс-доменный запрос с CORS
fetch('https://api.example.com/data', { mode: 'cors' });

// 'same-origin' — только к тому же домену
fetch('/api/data', { mode: 'same-origin' });

// 'no-cors' — кросс-доменный без CORS (ограниченный ответ)
fetch('https://api.example.com/data', { mode: 'no-cors' });
// response.type будет 'opaque' — нельзя прочитать тело
```

### Отправка cookies (credentials)

```javascript
// 'same-origin' — (по умолчанию) cookies только для того же домена
fetch('/api/data', { credentials: 'same-origin' });

// 'include' — отправлять cookies для любых запросов
fetch('https://api.example.com/data', {
  credentials: 'include',
});

// 'omit' — никогда не отправлять cookies
fetch('/api/data', { credentials: 'omit' });
```

### Типичные CORS-заголовки на сервере

```
Access-Control-Allow-Origin: https://mysite.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 86400
```

### Preflight-запрос

```javascript
// Браузер автоматически отправляет OPTIONS (preflight) когда:
// - Метод не GET/POST/HEAD
// - Есть кастомные заголовки
// - Content-Type отличается от form-data/text/urlencoded

// Этот запрос вызовет preflight:
fetch('https://api.example.com/data', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'X-Custom-Header': 'value',
  },
  body: JSON.stringify({ key: 'value' }),
});
// Браузер сначала: OPTIONS /data → проверяет CORS-заголовки
// Потом: PUT /data → основной запрос
```

## 7. Загрузка файлов (FormData)

### Отправка файлов

```javascript
// Из input[type="file"]
const fileInput = document.querySelector('#fileInput');

async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('description', 'Мой файл');

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
    // НЕ устанавливайте Content-Type — браузер добавит boundary
  });

  return response.json();
}

fileInput.addEventListener('change', () => {
  uploadFile(fileInput.files[0]);
});
```

### Загрузка нескольких файлов

```javascript
async function uploadMultiple(files) {
  const formData = new FormData();

  for (const file of files) {
    formData.append('files', file, file.name);
  }

  const response = await fetch('/api/upload-multiple', {
    method: 'POST',
    body: formData,
  });

  return response.json();
}
```

### Отслеживание прогресса загрузки

```javascript
// Fetch API не поддерживает progress напрямую
// Используем ReadableStream для скачивания:

async function downloadWithProgress(url, onProgress) {
  const response = await fetch(url);
  const contentLength = response.headers.get('Content-Length');
  const total = parseInt(contentLength, 10);

  const reader = response.body.getReader();
  let received = 0;
  const chunks = [];

  while (true) {
    const { done, value } = await reader.read();

    if (done) break;

    chunks.push(value);
    received += value.length;

    onProgress({
      loaded: received,
      total,
      percent: Math.round((received / total) * 100),
    });
  }

  const blob = new Blob(chunks);
  return blob;
}

// Использование
const blob = await downloadWithProgress('/api/file', (progress) => {
  console.log(`Загружено: ${progress.percent}%`);
});
```

### Скачивание файлов

```javascript
async function downloadFile(url, filename) {
  const response = await fetch(url);
  const blob = await response.blob();

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();

  URL.revokeObjectURL(link.href);
}

downloadFile('/api/report.pdf', 'отчёт.pdf');
```

## 8. Fetch vs XMLHttpRequest

| Возможность | Fetch API | XMLHttpRequest |
|-------------|-----------|----------------|
| Синтаксис | Promise-based | Callback-based |
| Простота | Простой, современный | Многословный |
| Стриминг | ReadableStream | Нет |
| Отмена запроса | AbortController | xhr.abort() |
| Прогресс загрузки | Ограничен (только скачивание) | onprogress (оба направления) |
| Cookies | credentials: 'include' | withCredentials: true |
| Таймаут | Через AbortController | xhr.timeout |
| Совместимость | Современные браузеры | Все браузеры |
| Service Workers | Поддерживается | Не поддерживается |

### Пример XMLHttpRequest vs Fetch

```javascript
// XMLHttpRequest — старый подход
function getDataXHR(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.response);
      } else {
        reject(new Error(`HTTP ${xhr.status}`));
      }
    };

    xhr.onerror = () => reject(new Error('Сетевая ошибка'));
    xhr.send();
  });
}

// Fetch — современный подход
async function getDataFetch(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
}
```

### Когда XMLHttpRequest всё ещё полезен

```javascript
// Прогресс загрузки на сервер (upload progress)
function uploadWithProgress(url, file, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    });

    xhr.onload = () => resolve(JSON.parse(xhr.responseText));
    xhr.onerror = () => reject(new Error('Upload failed'));

    const formData = new FormData();
    formData.append('file', file);
    xhr.send(formData);
  });
}
```

## Справочник

```javascript
// GET
const data = await fetch('/api/data').then(r => r.json());

// POST JSON
await fetch('/api/data', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ key: 'value' }),
});

// С обработкой ошибок
const res = await fetch(url);
if (!res.ok) throw new Error(`HTTP ${res.status}`);

// С таймаутом
await fetch(url, { signal: AbortSignal.timeout(5000) });

// С отменой
const ctrl = new AbortController();
fetch(url, { signal: ctrl.signal });
ctrl.abort();

// Загрузка файла
const fd = new FormData();
fd.append('file', fileInput.files[0]);
await fetch('/upload', { method: 'POST', body: fd });
```
