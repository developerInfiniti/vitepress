# Принципы REST API дизайна

## Введение

REST (Representational State Transfer) - это архитектурный стиль для разработки сетевых приложений, предложенный Roy Fielding в 2000 году. REST API должны следовать определенным принципам для обеспечения масштабируемости, производительности и надежности.

## Основные принципы REST архитектуры

### 1. Statelessness (Отсутствие состояния)

Сервер не должен хранить информацию о состоянии клиента между запросами. Каждый запрос должен содержать всю необходимую информацию для его обработки.

**Преимущества:**
- Простота масштабирования (можно добавлять серверы)
- Улучшение надежности (отказ одного сервера не влияет на состояние)
- Улучшение производительности (нет необходимости в синхронизации состояния)

**Пример (НЕПРАВИЛЬНО - с состоянием):**
```javascript
// Сервер хранит состояние в памяти
const userSessions = {};

app.post('/login', (req, res) => {
  userSessions[req.body.userId] = { loggedIn: true };
  res.json({ sessionId: req.body.userId });
});

app.get('/profile', (req, res) => {
  // Зависит от состояния на сервере
  if (userSessions[req.body.userId]?.loggedIn) {
    res.json({ name: 'John' });
  } else {
    res.status(401).json({ error: 'Not authorized' });
  }
});
```

**Пример (ПРАВИЛЬНО - без состояния, с JWT):**
```javascript
const jwt = require('jsonwebtoken');

app.post('/login', (req, res) => {
  // Создаем токен
  const token = jwt.sign(
    { userId: req.body.userId },
    'secret-key',
    { expiresIn: '1h' }
  );
  res.json({ token });
});

app.get('/profile', (req, res) => {
  // Клиент передает токен в каждом запросе
  const token = req.headers.authorization?.split(' ')[1];

  try {
    const decoded = jwt.verify(token, 'secret-key');
    res.json({ name: 'John', userId: decoded.userId });
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
});
```

### 2. Cacheability (Кэшируемость)

Ответы должны явно указывать, кэшируются ли они или нет. Правильное использование кэширования значительно улучшает производительность.

**Cache-Control заголовки:**
```javascript
// Кэшировать на 1 час
res.set('Cache-Control', 'public, max-age=3600');

// Не кэшировать
res.set('Cache-Control', 'no-cache, no-store, must-revalidate');

// Кэшировать только на клиенте
res.set('Cache-Control', 'private, max-age=600');
```

**Пример с ETag для условного запроса:**
```javascript
const crypto = require('crypto');

app.get('/data', (req, res) => {
  const data = { content: 'important data' };
  const etag = crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');

  // Клиент может отправить If-None-Match с предыдущим ETag
  if (req.headers['if-none-match'] === etag) {
    res.status(304).end(); // Not Modified
  } else {
    res.set('ETag', etag);
    res.set('Cache-Control', 'max-age=3600');
    res.json(data);
  }
});
```

**Пример на клиенте:**
```javascript
// Первый запрос
fetch('/api/data')
  .then(res => {
    const etag = res.headers.get('etag');
    localStorage.setItem('etag', etag);
    return res.json();
  });

// Последующий запрос с проверкой
fetch('/api/data', {
  headers: {
    'If-None-Match': localStorage.getItem('etag')
  }
})
.then(res => {
  if (res.status === 304) {
    // Использовать кешированную версию
    console.log('Данные не изменились');
  } else {
    return res.json();
  }
});
```

### 3. Uniform Interface (Унифицированный интерфейс)

Предусматривает 4 компонента:

#### а) Identification of resources (Идентификация ресурсов)
Ресурсы идентифицируются через URI.

```javascript
// Правильно
GET /api/users/123          // Получить пользователя с ID 123
GET /api/users/123/posts    // Получить посты пользователя 123
GET /api/posts/456/comments // Получить комментарии к посту 456

// Неправильно
GET /api/getUser?id=123
GET /api/user/getPosts?userId=123
```

#### б) Manipulation of resources through representations (Манипуляция через представления)
Клиент манипулирует ресурсами через их представления (JSON, XML, etc).

```javascript
// POST - создание ресурса
POST /api/users
Content-Type: application/json

{
  "name": "John",
  "email": "john@example.com"
}

// PUT - полное обновление
PUT /api/users/123
Content-Type: application/json

{
  "name": "Jane",
  "email": "jane@example.com"
}

// PATCH - частичное обновление
PATCH /api/users/123
Content-Type: application/json

{
  "email": "newemail@example.com"
}

// DELETE - удаление
DELETE /api/users/123
```

#### в) Self-descriptive messages (Самоописываемые сообщения)
Каждое сообщение должно содержать всю необходимую информацию для его интерпретации.

```javascript
// Ответ сервера - полностью самоописываемый
{
  "statusCode": 201,
  "message": "User created successfully",
  "data": {
    "id": 123,
    "name": "John",
    "email": "john@example.com",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "links": {
    "self": { "href": "/api/users/123" },
    "update": { "href": "/api/users/123", "method": "PUT" },
    "delete": { "href": "/api/users/123", "method": "DELETE" }
  }
}
```

#### г) HATEOAS (Hypermedia As The Engine Of Application State)
Ответ содержит гиперссылки для дальнейших действий.

```javascript
app.get('/api/users/:id', (req, res) => {
  const user = { id: req.params.id, name: 'John' };

  res.json({
    data: user,
    links: {
      self: { href: `/api/users/${user.id}`, method: 'GET' },
      all: { href: '/api/users', method: 'GET' },
      update: { href: `/api/users/${user.id}`, method: 'PUT' },
      delete: { href: `/api/users/${user.id}`, method: 'DELETE' },
      posts: { href: `/api/users/${user.id}/posts`, method: 'GET' }
    }
  });
});
```

### 4. Separation of Concerns (Разделение ответственности)

Разделение архитектуры на слои с четкими границами ответственности:

**Архитектура REST API:**
```
┌─────────────────┐
│   Клиент        │
└────────┬────────┘
         │ HTTP запрос
┌────────▼────────────────────────┐
│   API Gateway / Load Balancer   │
└────────┬──────────────────────────┘
         │
┌────────▼──────────────────────────────────┐
│         REST API Server                   │
│  ┌──────────────────────────────────────┐ │
│  │  Routing Layer                       │ │
│  └──────────┬───────────────────────────┘ │
│             │                             │
│  ┌──────────▼──────────┐                 │
│  │  Business Logic     │                 │
│  └──────────┬──────────┘                 │
│             │                             │
│  ┌──────────▼──────────┐                 │
│  │  Data Access Layer  │                 │
│  └──────────┬──────────┘                 │
│             │                             │
└─────────────┼──────────────────────────────┘
              │
┌─────────────▼────────────┐
│   Database / Storage     │
└──────────────────────────┘
```

**Пример разделения слоев:**
```javascript
// 1. Route Layer (маршруты)
app.get('/api/users/:id', userController.getUser);

// 2. Controller Layer (обработка запросов)
const userController = {
  getUser: async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await userService.getUserById(userId);
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

// 3. Service Layer (бизнес-логика)
const userService = {
  getUserById: async (id) => {
    const user = await userRepository.findById(id);
    if (!user) throw new Error('User not found');
    return user;
  }
};

// 4. Repository Layer (доступ к данным)
const userRepository = {
  findById: async (id) => {
    return await db.users.findOne({ id });
  }
};
```

### 5. Самоописываемость (Self-Descriptive)

API должна быть понятна без дополнительной документации через сами сообщения.

**Хорошие практики:**
```javascript
// 1. Описательные имена ресурсов
GET /api/users              // Получить список пользователей
GET /api/users/123          // Получить пользователя с ID 123
POST /api/users             // Создать нового пользователя
PUT /api/users/123          // Обновить пользователя 123
DELETE /api/users/123       // Удалить пользователя 123

// 2. HTTP методы и статус коды
// GET → 200 OK
// POST (создание) → 201 Created
// PUT → 200 OK или 204 No Content
// DELETE → 204 No Content
// DELETE (не существует) → 404 Not Found

// 3. Content-Type заголовки
Content-Type: application/json
Accept: application/json

// 4. Версионирование в URL
GET /api/v1/users
GET /api/v2/users

// 5. Фильтрация и пагинация
GET /api/users?page=1&limit=10&sort=name&filter=active
```

## Лучшие практики REST API дизайна

### 1. Используйте правильные HTTP методы
```javascript
// GET - безопасный, идемпотентный
GET /api/users

// POST - создание, не идемпотентный
POST /api/users

// PUT - полное обновление, идемпотентный
PUT /api/users/123

// PATCH - частичное обновление
PATCH /api/users/123

// DELETE - удаление, идемпотентный
DELETE /api/users/123
```

### 2. Используйте правильные статус коды
```javascript
// 2xx - успех
200 OK              // Успешно
201 Created         // Создано
204 No Content      // Успешно, нет содержимого

// 3xx - перенаправление
301 Moved Permanently
304 Not Modified    // Кеш актуален

// 4xx - ошибка клиента
400 Bad Request     // Синтаксическая ошибка
401 Unauthorized    // Требуется аутентификация
403 Forbidden       // Доступ запрещен
404 Not Found       // Ресурс не найден
422 Unprocessable Entity  // Ошибка валидации

// 5xx - ошибка сервера
500 Internal Server Error
503 Service Unavailable
```

### 3. Правильная структура ответа
```javascript
// Успех
{
  "status": "success",
  "code": 200,
  "data": {
    "id": 123,
    "name": "John",
    "email": "john@example.com"
  }
}

// Ошибка
{
  "status": "error",
  "code": 422,
  "message": "Validation failed",
  "errors": {
    "email": "Invalid email format"
  }
}
```

### 4. Документируйте API
Используйте OpenAPI/Swagger для документации:
```yaml
openapi: 3.0.0
info:
  title: User API
  version: 1.0.0
paths:
  /api/users:
    get:
      summary: Get all users
      responses:
        '200':
          description: List of users
    post:
      summary: Create a user
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                name:
                  type: string
                email:
                  type: string
```

## Сравнение: REST vs GraphQL vs RPC

| Характеристика | REST | GraphQL | RPC |
|---|---|---|---|
| Over-fetching | Да | Нет | Нет |
| Under-fetching | Да | Нет | Нет |
| Простота | Высокая | Средняя | Средняя |
| Кэширование | Легко | Сложно | Сложно |
| Масштабируемость | Высокая | Высокая | Зависит |
| Обучение | Быстрое | Требует изучения | Быстрое |

## Типичные ошибки при разработке REST API

### 1. Нарушение принципа statelessness
❌ Неправильно:
```javascript
// Хранение состояния в переменной
let currentUser = null;

app.post('/login', (req, res) => {
  currentUser = req.body.userId;
});

app.get('/profile', (req, res) => {
  if (currentUser) res.json({ name: 'John' });
});
```

✅ Правильно:
```javascript
app.get('/profile', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const user = jwt.verify(token, 'secret');
  res.json({ name: 'John' });
});
```

### 2. Неправильный выбор HTTP методов
❌ Неправильно:
```javascript
GET /api/deleteUser?id=123
POST /api/getUsers
```

✅ Правильно:
```javascript
DELETE /api/users/123
GET /api/users
```

### 3. Неправильные статус коды
❌ Неправильно:
```javascript
app.get('/users/999', (req, res) => {
  res.status(200).json({ error: 'Not found' });
});
```

✅ Правильно:
```javascript
app.get('/users/999', (req, res) => {
  res.status(404).json({ error: 'User not found' });
});
```

### 4. Отсутствие версионирования
❌ Неправильно - изменить API сложнее
```javascript
GET /api/users
```

✅ Правильно - можно поддерживать несколько версий
```javascript
GET /api/v1/users
GET /api/v2/users
```

## Заключение

Следование принципам REST архитектуры обеспечивает:
- **Масштабируемость** - легче добавлять серверы
- **Надежность** - отказоустойчивость
- **Производительность** - кэширование, оптимизация
- **Простоту** - предсказуемое поведение
- **Поддерживаемость** - понятный код

REST остается самым популярным стилем для разработки веб-сервисов благодаря своей простоте и эффективности.
