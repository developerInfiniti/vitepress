---
description: "HTTP методы GET, POST, PUT, DELETE, PATCH — назначение, различия и правильное применение в REST API"
---

# HTTP методы и статус коды ответов

## Введение

HTTP (HyperText Transfer Protocol) определяет набор методов (также называемых глаголами) для выполнения действий над ресурсами. Статус коды ответов указывают на результат обработки запроса.

## HTTP методы

### GET

Получение данных ресурса без изменения состояния сервера.

**Характеристики:**
- Безопасный (не изменяет состояние)
- Идемпотентный (повторный запрос = первый запрос)
- Кешируется
- Можно передавать параметры в query string

**Пример:**
```bash
curl -X GET https://api.example.com/users/123
```

```javascript
fetch('https://api.example.com/users/123')
  .then(response => response.json())
  .then(data => console.log(data))
```

### POST

Создание нового ресурса на сервере.

**Характеристики:**
- Не безопасный (изменяет состояние)
- Не идемпотентный (каждый запрос создает новый ресурс)
- Данные передаются в теле запроса

**Пример:**
```bash
curl -X POST https://api.example.com/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John", "email": "john@example.com"}'
```

```javascript
fetch('https://api.example.com/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'John',
    email: 'john@example.com'
  })
})
.then(response => response.json())
.then(data => console.log(data))
```

### PUT

Полное обновление существующего ресурса.

**Характеристики:**
- Не безопасный (изменяет состояние)
- Идемпотентный (повторные запросы не меняют результат)
- Заменяет весь ресурс целиком
- Требует ID ресурса в URL

**Пример:**
```bash
curl -X PUT https://api.example.com/users/123 \
  -H "Content-Type: application/json" \
  -d '{"name": "Jane", "email": "jane@example.com"}'
```

```javascript
fetch('https://api.example.com/users/123', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Jane',
    email: 'jane@example.com'
  })
})
.then(response => response.json())
```

### PATCH

Частичное обновление ресурса.

**Характеристики:**
- Не безопасный (изменяет состояние)
- Может быть идемпотентным в зависимости от реализации
- Обновляет только указанные поля
- Более гибкий, чем PUT

**Пример:**
```bash
curl -X PATCH https://api.example.com/users/123 \
  -H "Content-Type: application/json" \
  -d '{"email": "newemail@example.com"}'
```

```javascript
fetch('https://api.example.com/users/123', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'newemail@example.com'
  })
})
.then(response => response.json())
```

### DELETE

Удаление ресурса.

**Характеристики:**
- Не безопасный (изменяет состояние)
- Идемпотентный (удаление уже удаленного = успех)
- Требует ID ресурса в URL

**Пример:**
```bash
curl -X DELETE https://api.example.com/users/123
```

```javascript
fetch('https://api.example.com/users/123', {
  method: 'DELETE'
})
.then(response => response.status === 204 ? 'Удалено' : 'Ошибка')
```

### HEAD

Аналог GET, но без тела ответа.

**Характеристики:**
- Используется для проверки доступности ресурса
- Возвращает только заголовки
- Полезен для оптимизации

### OPTIONS

Получение информации о допустимых методах для ресурса.

**Характеристики:**
- Часто используется в CORS запросах
- Возвращает заголовок Allow с доступными методами

## Статус коды ответов

Статус коды состоят из 3 цифр. Первая цифра определяет класс ответа:

### 1xx - Информационные ответы (100-199)

Промежуточные ответы, обработка еще не завершена.

- **100 Continue** - продолжить отправку тела запроса
- **101 Switching Protocols** - переключение протокола

### 2xx - Успешные ответы (200-299)

Запрос успешно обработан.

#### 200 OK
Стандартный успешный ответ. Данные возвращены в теле ответа.

```javascript
// GET, POST, PUT, PATCH возвращают 200 OK
fetch('/api/users/123')
  .then(res => res.status === 200 && console.log('Успех'))
```

#### 201 Created
Ресурс успешно создан. Обычно возвращается после POST.

```javascript
// Новый ресурс создан
fetch('/api/users', { method: 'POST', ... })
  .then(res => res.status === 201 && console.log('Создано'))
```

#### 202 Accepted
Запрос принят, но еще обрабатывается.

#### 204 No Content
Запрос успешен, но нет содержимого для возврата. Часто используется после DELETE.

```javascript
// Удаление успешно
fetch('/api/users/123', { method: 'DELETE' })
  .then(res => res.status === 204 && console.log('Удалено'))
```

#### 206 Partial Content
Возвращена часть содержимого (для Range requests).

### 3xx - Перенаправления (300-399)

Требуется дополнительное действие для завершения запроса.

#### 301 Moved Permanently
Ресурс перемещен навсегда на новый URL.

#### 302 Found
Временное перенаправление на другой URL.

#### 304 Not Modified
Ресурс не изменился с момента последнего запроса. Используется с кешированием.

```javascript
// Клиент может использовать кешированную версию
fetch('/api/data', {
  headers: {
    'If-None-Match': 'previous-etag'
  }
})
.then(res => res.status === 304 && console.log('Используем кеш'))
```

#### 307 Temporary Redirect
Временное перенаправление (сохраняет метод запроса).

#### 308 Permanent Redirect
Постоянное перенаправление (сохраняет метод запроса).

### 4xx - Ошибки клиента (400-499)

Запрос неправильный или невозможно выполнить.

#### 400 Bad Request
Синтаксическая ошибка в запросе.

```javascript
// Неправильный формат JSON
fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: 'invalid json'  // Ошибка
})
.then(res => res.status === 400 && console.log('Неправильный запрос'))
```

#### 401 Unauthorized
Требуется аутентификация.

```javascript
// Отсутствует токен
fetch('/api/users/profile')
  .then(res => res.status === 401 && console.log('Нужна аутентификация'))
```

#### 403 Forbidden
Аутентификация есть, но доступ запрещен.

```javascript
// Недостаточно прав
fetch('/api/admin/users')
  .then(res => res.status === 403 && console.log('Доступ запрещен'))
```

#### 404 Not Found
Ресурс не найден.

```javascript
// Ресурс не существует
fetch('/api/users/999999')
  .then(res => res.status === 404 && console.log('Не найдено'))
```

#### 409 Conflict
Конфликт (обычно при обновлении версионированного ресурса).

```javascript
// Попытка обновить устаревшую версию
fetch('/api/items/123', {
  method: 'PUT',
  headers: { 'If-Match': 'old-etag' },
  body: JSON.stringify(data)
})
.then(res => res.status === 409 && console.log('Конфликт версий'))
```

#### 422 Unprocessable Entity
Ошибка валидации данных.

```javascript
// Email не прошел валидацию
fetch('/api/users', {
  method: 'POST',
  body: JSON.stringify({ email: 'invalid-email' })
})
.then(res => res.status === 422 && console.log('Ошибка валидации'))
```

#### 429 Too Many Requests
Превышена частота запросов (rate limiting).

```javascript
// Слишком много запросов
fetch('/api/data')
  .then(res => res.status === 429 && console.log('Ограничение по частоте'))
```

### 5xx - Ошибки сервера (500-599)

Сервер не может обработать запрос.

#### 500 Internal Server Error
Внутренняя ошибка сервера.

```javascript
// Неожиданная ошибка на сервере
fetch('/api/process')
  .then(res => res.status === 500 && console.log('Ошибка сервера'))
```

#### 501 Not Implemented
Метод не реализован.

#### 502 Bad Gateway
Неверный ответ от upstream сервера.

#### 503 Service Unavailable
Сервис недоступен (обслуживание, перегрузка).

```javascript
// Сервер на техническом обслуживании
fetch('/api/data')
  .then(res => res.status === 503 && console.log('Сервис недоступен'))
```

#### 504 Gateway Timeout
Timeout при ожидании ответа от upstream сервера.

## Таблица методов и кодов

| Метод | Действие | Успех | Основные ошибки |
|-------|----------|-------|-----------------|
| GET | Получить | 200 | 404, 401, 403 |
| POST | Создать | 201 | 400, 422, 409 |
| PUT | Обновить | 200 | 404, 400, 409 |
| PATCH | Частичное обновление | 200 | 404, 400, 422 |
| DELETE | Удалить | 204 | 404, 401, 403 |

## Лучшие практики

1. **Используйте правильные методы** - GET для чтения, POST для создания, PUT/PATCH для обновления, DELETE для удаления

2. **Выбирайте правильные коды** - 200 для успеха, 201 для создания, 204 для пустого успеха, 4xx для ошибок клиента, 5xx для ошибок сервера

3. **Обрабатывайте ошибки** - всегда проверяйте статус кода ответа

4. **Идемпотентность** - GET, PUT, DELETE должны быть идемпотентными

5. **Документируйте** - четко описывайте, какие методы и коды вернет ваш API

## Примеры обработки ответов

```javascript
async function apiRequest(url, options = {}) {
  const response = await fetch(url, options);

  // Обработка по статус кодам
  if (response.ok) {
    // 2xx
    return response.json();
  } else if (response.status === 401) {
    // Требуется вход
    redirectToLogin();
  } else if (response.status === 403) {
    // Недостаточно прав
    showError('У вас нет доступа');
  } else if (response.status === 404) {
    // Ресурс не найден
    showError('Ресурс не найден');
  } else if (response.status === 422) {
    // Ошибка валидации
    const errors = await response.json();
    showValidationErrors(errors);
  } else if (response.status >= 500) {
    // Ошибка сервера
    showError('Сервер недоступен. Попробуйте позже');
  }

  throw new Error(`HTTP ${response.status}`);
}

// Использование
try {
  const data = await apiRequest('/api/users');
  console.log(data);
} catch (error) {
  console.error(error);
}
```
