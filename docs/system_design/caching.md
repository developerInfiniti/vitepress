# Кеширование

## Что такое кеширование?

Кеширование — это хранение копий часто запрашиваемых данных в быстром хранилище для уменьшения времени ответа и снижения нагрузки на основную базу данных.

```
Без кеша:                          С кешем:

Клиент → Сервер → БД (100ms)      Клиент → Сервер → Кеш (1ms) ✓
                                                    ↓ miss?
                                               БД (100ms)
```

::: tip Принцип локальности
Кеширование работает благодаря принципу **Парето (80/20)**: примерно 20% данных обслуживают 80% запросов. Кешируя эти 20%, мы значительно ускоряем систему.
:::

## Уровни кеширования

```
┌──────────────────────────────────────────────────┐
│                  КЛИЕНТ                          │
│  ┌──────────────────────────────────────┐        │
│  │ Браузерный кеш (HTTP Cache)          │ ~1ms   │
│  │ LocalStorage, SessionStorage         │        │
│  └──────────────────────────────────────┘        │
└──────────────────────────────────────────────────┘
                     │
┌──────────────────────────────────────────────────┐
│  CDN Cache (Edge Cache)                  ~20ms   │
│  Кешированная статика на edge-серверах            │
└──────────────────────────────────────────────────┘
                     │
┌──────────────────────────────────────────────────┐
│  Load Balancer / Reverse Proxy Cache     ~5ms    │
│  Nginx, Varnish                                  │
└──────────────────────────────────────────────────┘
                     │
┌──────────────────────────────────────────────────┐
│  Application Cache (In-Memory)           ~1ms    │
│  Redis, Memcached                                │
└──────────────────────────────────────────────────┘
                     │
┌──────────────────────────────────────────────────┐
│  Database Cache (Query Cache)            ~10ms   │
│  Внутренний кеш БД, материализованные вью        │
└──────────────────────────────────────────────────┘
                     │
┌──────────────────────────────────────────────────┐
│  Disk / OS Cache                         ~0.1ms  │
│  Page cache операционной системы                  │
└──────────────────────────────────────────────────┘
```

## Стратегии кеширования

### 1. Cache-Aside (Lazy Loading)

Приложение само управляет кешем. Самая распространённая стратегия.

```
ЧТЕНИЕ:
                     ┌───────┐
           ┌────1───►│ Cache │
           │         └───┬───┘
      ┌────┴────┐    2. miss│     ┌──────┐
      │   App   │◄───────────────►│  DB  │
      └────┬────┘    3. read      └──────┘
           │         4. write to cache
           └────────►┌───────┐
                     │ Cache │
                     └───────┘

1. Приложение проверяет кеш
2. Cache miss → читаем из БД
3. Записываем результат в кеш
4. Возвращаем данные клиенту
```

```javascript
async function getUser(userId) {
  // 1. Проверяем кеш
  let user = await cache.get(`user:${userId}`);

  if (user) {
    return user; // Cache hit
  }

  // 2. Cache miss — читаем из БД
  user = await db.query('SELECT * FROM users WHERE id = ?', [userId]);

  // 3. Записываем в кеш с TTL
  await cache.set(`user:${userId}`, user, { ttl: 3600 });

  return user;
}
```

**Плюсы:** только нужные данные в кеше, устойчивость к сбоям кеша.
**Минусы:** первый запрос всегда медленный (cold start), данные могут устареть.

### 2. Read-Through

Кеш сам читает из БД при cache miss. Приложение работает только с кешем.

```
      ┌─────────┐     ┌───────┐     ┌──────┐
      │   App   │────►│ Cache │────►│  DB  │
      └─────────┘     └───────┘     └──────┘
                      (сам читает
                       при miss)
```

**Плюсы:** упрощённый код приложения.
**Минусы:** первый запрос медленный, нужна поддержка от кеш-провайдера.

### 3. Write-Through

Каждая запись идёт через кеш в БД. Кеш всегда актуален.

```
ЗАПИСЬ:
      ┌─────────┐  1. write  ┌───────┐  2. write  ┌──────┐
      │   App   │───────────►│ Cache │────────────►│  DB  │
      └─────────┘            └───────┘             └──────┘
                         (синхронная запись в оба)
```

```javascript
async function updateUser(userId, data) {
  // Запись идёт через кеш
  await cache.set(`user:${userId}`, data);
  await db.query('UPDATE users SET ? WHERE id = ?', [data, userId]);
}
```

**Плюсы:** кеш всегда актуален, нет проблемы stale data.
**Минусы:** повышенная latency записи (два шага), кешируются и редкие данные.

### 4. Write-Behind (Write-Back)

Запись сначала в кеш, затем асинхронно в БД.

```
ЗАПИСЬ:
      ┌─────────┐  1. write  ┌───────┐
      │   App   │───────────►│ Cache │  (быстро возвращает OK)
      └─────────┘            └───┬───┘
                                 │ 2. async write (позже)
                                 ▼
                             ┌──────┐
                             │  DB  │
                             └──────┘
```

**Плюсы:** очень быстрая запись, batch-оптимизация.
**Минусы:** риск потери данных при сбое кеша, сложная реализация.

### 5. Write-Around

Запись идёт напрямую в БД, минуя кеш.

```
ЗАПИСЬ:                         ЧТЕНИЕ:
App ──────────► DB              App ──► Cache ──► DB
(минуя кеш)                         (cache-aside)
```

**Плюсы:** кеш не засоряется редкими данными.
**Минусы:** cache miss после записи.

### Сравнительная таблица стратегий

| Стратегия | Latency чтения | Latency записи | Консистентность | Сложность |
|-----------|---------------|----------------|-----------------|-----------|
| Cache-Aside | Низкая (после прогрева) | Обычная | Eventual | Низкая |
| Read-Through | Низкая (после прогрева) | Обычная | Eventual | Средняя |
| Write-Through | Низкая | Выше | Сильная | Средняя |
| Write-Behind | Низкая | Очень низкая | Eventual | Высокая |
| Write-Around | Обычная | Обычная | Eventual | Низкая |

## Инвалидация кеша

::: warning Известная цитата
> «В информатике есть только две сложные проблемы: инвалидация кеша и именование вещей.» — Фил Карлтон
:::

### Подходы к инвалидации

#### 1. TTL (Time-To-Live)
Данные автоматически удаляются по истечении времени.

```javascript
// Данные профиля — кешируем на 1 час
await cache.set('user:123', userData, { ttl: 3600 });

// Курсы валют — кешируем на 5 минут
await cache.set('exchange_rates', rates, { ttl: 300 });

// Конфигурация — кешируем на 24 часа
await cache.set('app_config', config, { ttl: 86400 });
```

#### 2. Активная инвалидация (Event-Based)
Удаляем кеш при изменении данных.

```javascript
async function updateUser(userId, data) {
  await db.query('UPDATE users SET ? WHERE id = ?', [data, userId]);
  // Активно удаляем кеш
  await cache.del(`user:${userId}`);
  await cache.del(`user_profile:${userId}`);
}
```

#### 3. Версионирование
Добавляем версию к ключу кеша.

```javascript
const version = await cache.get('users_version'); // v5
const cacheKey = `users:${userId}:v${version}`;

// При обновлении — увеличиваем версию
await cache.incr('users_version'); // v6
// Старые ключи с v5 станут "невидимыми"
```

## Проблемы кеширования

### Cache Stampede (Thundering Herd)

Когда TTL истекает и тысячи запросов одновременно идут в БД.

```
TTL истёк!
                    ┌───────┐
  Запрос 1 ────────►│       │
  Запрос 2 ────────►│  БД   │  ← Все идут в БД одновременно!
  Запрос 3 ────────►│       │     БД перегружена!
  ...               │       │
  Запрос 1000 ─────►│       │
                    └───────┘
```

**Решения:**

```javascript
// 1. Mutex Lock — только один запрос обновляет кеш
async function getWithLock(key) {
  let data = await cache.get(key);
  if (data) return data;

  const lock = await cache.set(`lock:${key}`, 1, { nx: true, ttl: 10 });
  if (lock) {
    data = await db.query(/* ... */);
    await cache.set(key, data, { ttl: 3600 });
    await cache.del(`lock:${key}`);
  } else {
    // Ждём, пока другой запрос обновит кеш
    await sleep(50);
    return getWithLock(key);
  }
  return data;
}

// 2. Stale-While-Revalidate — возвращаем старые данные, обновляя в фоне
// 3. Jitter — добавляем случайное время к TTL
const ttl = 3600 + Math.random() * 600; // 3600-4200 секунд
```

### Cache Penetration

Запросы к данным, которых нет ни в кеше, ни в БД. Каждый запрос проходит через кеш в БД.

```
Запрос user_id=-1 → Cache miss → DB miss → ничего не кешируется
                                           → повтор...
```

**Решения:**
```javascript
// 1. Кешировать "пустой результат"
const data = await db.query(/* ... */);
if (!data) {
  await cache.set(key, 'NULL', { ttl: 300 }); // кешируем пустоту
}

// 2. Bloom Filter — быстрая проверка существования
if (!bloomFilter.mightContain(userId)) {
  return null; // точно не существует
}
```

### Cache Avalanche

Массовое истечение TTL для множества ключей одновременно.

**Решения:**
- Разные TTL для разных ключей (jitter)
- Прогрев кеша перед пиковыми нагрузками
- Резервный кеш (multi-layer caching)

## Redis vs Memcached

| Характеристика | Redis | Memcached |
|---------------|-------|-----------|
| Структуры данных | Strings, Lists, Sets, Hashes, Sorted Sets | Только strings |
| Персистентность | Да (RDB, AOF) | Нет |
| Репликация | Да (Master-Slave) | Нет |
| Кластеризация | Redis Cluster | Client-side sharding |
| Lua-скрипты | Да | Нет |
| Pub/Sub | Да | Нет |
| Размер значения | До 512 MB | До 1 MB |
| Многопоточность | Однопоточный (I/O threads с v6) | Многопоточный |

::: tip Когда что выбирать
- **Redis** — для большинства случаев (богаче функционал, персистентность)
- **Memcached** — когда нужен только простой key-value кеш с максимальной производительностью на multicore
:::

## Паттерны использования Redis

```javascript
// 1. Сессии пользователей
await redis.setex(`session:${sessionId}`, 86400, JSON.stringify(userData));

// 2. Rate Limiting (скользящее окно)
async function isRateLimited(userId, limit, windowSec) {
  const key = `rate:${userId}`;
  const now = Date.now();

  await redis.zremrangebyscore(key, 0, now - windowSec * 1000);
  const count = await redis.zcard(key);

  if (count >= limit) return true;

  await redis.zadd(key, now, `${now}`);
  await redis.expire(key, windowSec);
  return false;
}

// 3. Лидерборд (Sorted Set)
await redis.zadd('leaderboard', score, playerId);
const top10 = await redis.zrevrange('leaderboard', 0, 9, 'WITHSCORES');

// 4. Очередь задач (List)
await redis.lpush('tasks', JSON.stringify(task)); // producer
const task = await redis.brpop('tasks', 0);       // consumer

// 5. Pub/Sub
redis.publish('notifications', JSON.stringify(event));
redis.subscribe('notifications', (message) => { /* handle */ });
```

## HTTP-кеширование

```
Заголовки HTTP-кеша:

Cache-Control: max-age=3600          ← кешировать 1 час
Cache-Control: no-cache              ← проверять свежесть
Cache-Control: no-store              ← не кешировать вообще
Cache-Control: public, max-age=86400 ← CDN и браузер могут кешировать

ETag: "abc123"                       ← версия ресурса
If-None-Match: "abc123"              ← условный запрос
                                        304 Not Modified (кеш валиден)

Last-Modified: Wed, 01 Jan 2025      ← дата изменения
If-Modified-Since: Wed, 01 Jan 2025  ← условный запрос
```

## Вопросы для собеседования

1. Объясните разницу между Cache-Aside и Write-Through.
2. Что такое Cache Stampede и как его предотвратить?
3. Когда вы бы использовали Redis, а когда Memcached?
4. Как бы вы реализовали инвалидацию кеша в распределённой системе?
5. Объясните, как работает HTTP-кеширование (ETag, Cache-Control).
6. Что такое Cache Penetration и как от него защититься?
7. Какие структуры данных Redis вы знаете и для чего они используются?
