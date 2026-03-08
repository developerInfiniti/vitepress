---
description: "Стратегии версионирования API: URL, заголовки, query параметры — лучшие практики и выбор подхода"
---

# Версионирование API

## Введение

Версионирование API - это процесс управления изменениями и эволюцией публичного интерфейса приложения. Когда API требуется изменение, важно обеспечить обратную совместимость для существующих клиентов.

## Зачем нужно версионирование?

- **Обратная совместимость** - существующие клиенты продолжают работать
- **Постепенное развитие** - новые версии вводятся постепенно
- **Управление версиями** - клиенты могут обновляться в свое время
- **Мониторинг** - отслеживание использования разных версий

## Стратегии версионирования

### 1. Версионирование через URL Path

Самая популярная и явная стратегия. Версия указывается в пути URL.

**Синтаксис:**
```
GET /api/v1/users
GET /api/v2/users
GET /api/v3/users
```

**Преимущества:**
- Очень явно и очевидно
- Легко кэшировать
- Легко отслеживать использование

**Недостатки:**
- Дублирование кода
- URL становятся длиннее

**Реализация:**
```javascript
const express = require('express');
const app = express();

// V1 маршруты
app.get('/api/v1/users', (req, res) => {
  res.json({
    version: 'v1',
    users: [
      { id: 1, name: 'John' }
    ]
  });
});

// V2 маршруты (с дополнительным полем email)
app.get('/api/v2/users', (req, res) => {
  res.json({
    version: 'v2',
    users: [
      { id: 1, name: 'John', email: 'john@example.com' }
    ]
  });
});

// V3 маршруты (другая структура)
app.get('/api/v3/users', (req, res) => {
  res.json({
    version: 'v3',
    data: {
      users: [
        { userId: 1, fullName: 'John Doe', emailAddress: 'john@example.com' }
      ]
    }
  });
});
```

**Организация кода:**
```
routes/
├── v1/
│   ├── users.js
│   ├── posts.js
│   └── comments.js
├── v2/
│   ├── users.js
│   ├── posts.js
│   └── comments.js
└── v3/
    ├── users.js
    ├── posts.js
    └── comments.js
```

### 2. Версионирование через Query Parameter

Версия передается как query параметр.

**Синтаксис:**
```
GET /api/users?version=1
GET /api/users?v=2
GET /api/users?api-version=3
```

**Преимущества:**
- Один URL для разных версий
- Меньше дублирования маршрутов
- Прозрачно для кэширования (учитывается в кэше)

**Недостатки:**
- Менее явно
- Может быть пропущено клиентом

**Реализация:**
```javascript
app.get('/api/users', (req, res) => {
  const version = req.query.version || req.query.v || '1';

  if (version === '1') {
    return res.json({
      users: [{ id: 1, name: 'John' }]
    });
  } else if (version === '2') {
    return res.json({
      users: [
        { id: 1, name: 'John', email: 'john@example.com' }
      ]
    });
  } else if (version === '3') {
    return res.json({
      data: {
        users: [
          { userId: 1, fullName: 'John Doe', emailAddress: 'john@example.com' }
        ]
      }
    });
  }

  res.status(400).json({ error: 'Unsupported version' });
});
```

**Использование на клиенте:**
```javascript
// V1
fetch('/api/users?v=1')

// V2
fetch('/api/users?v=2')

// V3 (без параметра - по умолчанию)
fetch('/api/users')
```

### 3. Версионирование через Header

Версия указывается в HTTP заголовке.

**Синтаксис:**
```
GET /api/users
Accept: application/vnd.myapi.v1+json

GET /api/users
API-Version: 2
```

**Преимущества:**
- Чистые URL
- Гибко
- Поддерживается REST принципами

**Недостатки:**
- Менее очевидно
- Сложнее тестировать в браузере
- Может быть сложнее кэшировать

**Реализация:**
```javascript
// Использование Accept header (MIME Type Versioning)
app.get('/api/users', (req, res) => {
  const acceptHeader = req.headers['accept'] || 'application/json';

  if (acceptHeader.includes('vnd.myapi.v1')) {
    return res.json({
      users: [{ id: 1, name: 'John' }]
    });
  } else if (acceptHeader.includes('vnd.myapi.v2')) {
    return res.json({
      users: [
        { id: 1, name: 'John', email: 'john@example.com' }
      ]
    });
  }

  // Default to latest
  res.json({
    data: {
      users: [
        { userId: 1, fullName: 'John Doe', emailAddress: 'john@example.com' }
      ]
    }
  });
});

// Использование API-Version header
app.get('/api/users', (req, res) => {
  const version = req.headers['api-version'] || '3';

  if (version === '1') {
    return res.json({ users: [{ id: 1, name: 'John' }] });
  } else if (version === '2') {
    return res.json({ users: [{ id: 1, name: 'John', email: 'john@example.com' }] });
  }

  res.json({
    data: {
      users: [{ userId: 1, fullName: 'John Doe' }]
    }
  });
});
```

**Использование на клиенте:**
```javascript
// V1
fetch('/api/users', {
  headers: {
    'Accept': 'application/vnd.myapi.v1+json'
  }
});

// V2
fetch('/api/users', {
  headers: {
    'API-Version': '2'
  }
});

// V3 (default)
fetch('/api/users');
```

## Сравнение стратегий версионирования

| Критерий | URL Path | Query Parameter | Header |
|----------|----------|-----------------|--------|
| Явность | ⭐⭐⭐ Высокая | ⭐⭐ Средняя | ⭐ Низкая |
| Кэширование | ⭐⭐⭐ Легко | ⭐⭐⭐ Легко | ⭐⭐ Сложнее |
| Чистота URL | ⭐ Низкая | ⭐⭐ Средняя | ⭐⭐⭐ Высокая |
| Простота | ⭐⭐⭐ Простая | ⭐⭐ Средняя | ⭐⭐ Средняя |
| Популярность | ⭐⭐⭐ Очень популярна | ⭐⭐ Популярна | ⭐⭐ Менее популярна |

**Рекомендация:** В большинстве случаев используйте **версионирование через URL path** - это самый явный и стандартный подход.

## Миграция между версиями

### 1. Планирование депрекирования

Определите график поддержки версий:

```javascript
// Определение версий и их статуса
const apiVersions = {
  v1: {
    status: 'deprecated',
    deprecatedAt: '2023-01-01',
    sunsetAt: '2024-01-01',
    replacement: 'v2'
  },
  v2: {
    status: 'supported',
    deprecatedAt: null,
    sunsetAt: '2025-01-01',
    replacement: 'v3'
  },
  v3: {
    status: 'current',
    deprecatedAt: null,
    sunsetAt: null
  }
};

// Middleware для информирования о депрецировании
app.use('/api/v1/*', (req, res, next) => {
  res.set('Deprecation', 'true');
  res.set('Sunset', 'Sun, 01 Jan 2024 00:00:00 GMT');
  res.set('Link', '</api/v2/users>; rel="successor-version"');
  next();
});
```

### 2. Миграция клиентов

Предоставьте инструменты и документацию для миграции:

```javascript
// Документация для миграции с v1 на v2

/*
## Изменения в v2:

1. Добавлено поле email:
   v1: { id: 1, name: 'John' }
   v2: { id: 1, name: 'John', email: 'john@example.com' }

2. Новый эндпоинт для пакетных операций:
   GET /api/v2/users/batch?ids=1,2,3

3. Изменен формат ошибок:
   v1: { error: 'Not found' }
   v2: { errors: [{ code: 'USER_NOT_FOUND', message: 'User not found' }] }
*/
```

### 3. Постепенное развертывание

Развертывайте новые версии постепенно:

```javascript
// Использование feature flags для постепенного развертывания
const isNewUserServiceEnabled = (userId) => {
  // 10% пользователей получают v2
  return userId % 10 < 1;
};

app.get('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);

  if (isNewUserServiceEnabled(userId)) {
    // Используем новую v2 логику
    return res.json({
      id: userId,
      name: 'John',
      email: 'john@example.com'
    });
  }

  // Используем старую v1 логику
  res.json({
    id: userId,
    name: 'John'
  });
});
```

## Обратная совместимость

### 1. Расширение данных (Additive Changes)

Добавляйте новые поля, не удаляя старые:

✅ **ПРАВИЛЬНО - совместимо:**
```javascript
// v1 возвращало:
{ id: 1, name: 'John' }

// v2 добавило поле:
{ id: 1, name: 'John', email: 'john@example.com' }

// Старые клиенты игнорируют email, новые его используют
```

❌ **НЕПРАВИЛЬНО - несовместимо:**
```javascript
// v1 возвращало:
{ id: 1, name: 'John' }

// v2 переименовало поле:
{ id: 1, fullName: 'John' }  // Старые клиенты потеряют имя!
```

### 2. Значения по умолчанию

Всегда предоставляйте значения по умолчанию для новых полей:

```javascript
// v2 добавило новое поле status
{
  id: 1,
  name: 'John',
  email: 'john@example.com',
  status: 'active'  // Добавляется автоматически
}
```

### 3. Поддержка старого формата

Поддерживайте оба формата, пока идет переходный период:

```javascript
app.get('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  const version = req.query.v || '2';

  const userData = {
    id: userId,
    name: 'John',
    email: 'john@example.com',
    status: 'active'
  };

  if (version === '1') {
    // Возвращаем только старые поля для v1 клиентов
    res.json({
      id: userData.id,
      name: userData.name
    });
  } else {
    // Возвращаем все данные для v2+ клиентов
    res.json(userData);
  }
});
```

## Лучшие практики версионирования

### 1. Коммуникация с клиентами

Информируйте клиентов о планах депрецирования:

```javascript
// Заголовок Deprecation указывает, что версия устарела
res.set('Deprecation', 'true');

// Заголовок Sunset указывает, когда версия будет отключена
res.set('Sunset', 'Sun, 01 Jan 2024 00:00:00 GMT');

// Link заголовок указывает на новую версию
res.set('Link', '</api/v2/users>; rel="successor-version"');

// Пример ответа:
res.json({
  status: 'deprecated',
  message: 'API v1 is deprecated. Please upgrade to v2.',
  sunsettingAt: '2024-01-01',
  migrationGuide: 'https://docs.example.com/migration/v1-to-v2'
});
```

### 2. Документация

Поддерживайте полную документацию для каждой версии:

```markdown
# API v1 Documentation
[Deprecated - Sunset date: Jan 1, 2024]

# API v2 Documentation
[Supported - Sunset date: Jan 1, 2025]

# API v3 Documentation
[Current version]
```

### 3. Мониторинг использования

Отслеживайте, какие версии используют клиенты:

```javascript
app.use('/api/v1/*', (req, res, next) => {
  // Логируем использование v1
  console.log('V1 API used:', req.method, req.path);
  next();
});

app.use('/api/v2/*', (req, res, next) => {
  // Логируем использование v2
  console.log('V2 API used:', req.method, req.path);
  next();
});
```

### 4. Версионирование БД

Версионируйте изменения БД отдельно от API:

```javascript
// Миграция БД может произойти раньше, чем релиз новой версии API
// Старые версии API работают с новой схемой БД

// Migration: добавляем поле email
ALTER TABLE users ADD COLUMN email VARCHAR(255);

// API v1 продолжает работать (игнорирует email)
// API v2 использует новое поле email
```

## Примеры реальных APIs

### GitHub API
```
GET https://api.github.com/users/octocat
X-GitHub-Api-Version: 2022-11-28
```

### Stripe API
```
GET https://api.stripe.com/v1/customers
Authorization: Bearer sk_live_...
```

### Twitter API
```
GET https://api.twitter.com/2/tweets/:id
```

## Антипаттерны версионирования

### ❌ Версионирование без поддержки

```javascript
// Плохо - релиз v2 без поддержки v1
// Все существующие клиенты ломаются
app.get('/api/users', (req, res) => {
  res.json({
    data: { users: [...] }  // Структура полностью изменена
  });
});
```

### ❌ Несогласованное версионирование

```javascript
// Плохо - смешивание стратегий версионирования
GET /api/v1/users      // URL версионирование
GET /api/posts?v=2     // Query версионирование
GET /api/comments      // Без версии
```

### ❌ Отсутствие документации

Не забывайте документировать различия между версиями.

## Заключение

Правильное версионирование API:
- Обеспечивает плавное развитие
- Дает клиентам время на обновление
- Позволяет добавлять новые функции без нарушения старых
- Упрощает поддержку и мониторинг

Выбирайте **версионирование через URL** как стандартный подход - это самый явный и понятный способ.
