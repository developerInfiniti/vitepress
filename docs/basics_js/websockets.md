---
title: WebSockets в JavaScript
description: Полное руководство по WebSocket — подключение, отправка и получение данных, жизненный цикл, безопасность и Socket.IO
---

# WebSockets в JavaScript

## 1. Основы — что такое WebSocket

### Отличие от HTTP

```
HTTP (полудуплекс):
  Клиент → Запрос  → Сервер
  Клиент ← Ответ   ← Сервер
  (Новое соединение для каждого запроса)

WebSocket (полный дуплекс):
  Клиент ←→ Сервер
  (Постоянное двустороннее соединение)
```

| Характеристика | HTTP | WebSocket |
|---------------|------|-----------|
| Соединение | Новое на каждый запрос | Постоянное |
| Направление | Клиент → Сервер | Двустороннее |
| Заголовки | На каждый запрос | Только при handshake |
| Latency | Высокий (новое TCP) | Низкий |
| Протокол | `http://` / `https://` | `ws://` / `wss://` |

### Когда использовать WebSocket

```javascript
// Подходит для:
// - Чаты и мессенджеры
// - Онлайн-игры
// - Биржевые котировки, трейдинг
// - Уведомления в реальном времени
// - Совместное редактирование (Google Docs)
// - IoT / мониторинг

// НЕ подходит для:
// - Обычные CRUD-операции
// - Редкие запросы
// - REST API
// - Кеширование ответов
```

## 2. Подключение (Connection)

### Создание соединения

```javascript
// Создание WebSocket-соединения
const ws = new WebSocket('ws://localhost:8080');

// С защищённым протоколом (рекомендуется)
const wss = new WebSocket('wss://api.example.com/ws');

// С указанием подпротоколов
const ws = new WebSocket('wss://api.example.com/ws', ['json', 'xml']);
```

### Обработка подключения

```javascript
const ws = new WebSocket('wss://api.example.com/ws');

// Соединение установлено
ws.addEventListener('open', (event) => {
  console.log('Подключено к серверу');
  ws.send('Привет, сервер!');
});

// Проверка состояния
// ws.readyState:
// 0 = CONNECTING  — соединение устанавливается
// 1 = OPEN        — соединение установлено
// 2 = CLOSING     — соединение закрывается
// 3 = CLOSED      — соединение закрыто

if (ws.readyState === WebSocket.OPEN) {
  ws.send('данные');
}
```

## 3. Отправка данных (Sending)

### Типы данных

```javascript
const ws = new WebSocket('wss://api.example.com/ws');

ws.addEventListener('open', () => {
  // Строка
  ws.send('Простое текстовое сообщение');

  // JSON
  ws.send(JSON.stringify({
    type: 'message',
    text: 'Привет!',
    timestamp: Date.now()
  }));

  // ArrayBuffer (бинарные данные)
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);
  view.setInt32(0, 42);
  ws.send(buffer);

  // Blob
  const blob = new Blob(['Привет'], { type: 'text/plain' });
  ws.send(blob);
});
```

### Буферизация

```javascript
// bufferedAmount — количество байт в очереди на отправку
function sendIfReady(ws, data) {
  if (ws.bufferedAmount === 0) {
    ws.send(data);
  } else {
    // Очередь не пуста — подождать
    setTimeout(() => sendIfReady(ws, data), 100);
  }
}
```

## 4. Получение данных (Receiving)

### Обработка сообщений

```javascript
const ws = new WebSocket('wss://api.example.com/ws');

ws.addEventListener('message', (event) => {
  // event.data — полученные данные
  console.log('Получено:', event.data);

  // Если сервер отправляет JSON
  try {
    const message = JSON.parse(event.data);
    handleMessage(message);
  } catch {
    console.log('Текстовое сообщение:', event.data);
  }
});

function handleMessage(msg) {
  switch (msg.type) {
    case 'chat':
      displayMessage(msg.text, msg.from);
      break;
    case 'notification':
      showNotification(msg.title, msg.body);
      break;
    case 'error':
      console.error('Ошибка сервера:', msg.message);
      break;
  }
}
```

### Бинарные данные

```javascript
// Установка типа бинарных данных
ws.binaryType = 'arraybuffer'; // По умолчанию 'blob'

ws.addEventListener('message', (event) => {
  if (event.data instanceof ArrayBuffer) {
    const view = new DataView(event.data);
    const value = view.getInt32(0);
    console.log('Число:', value);
  }
});
```

## 5. Жизненный цикл соединения

### События

```javascript
const ws = new WebSocket('wss://api.example.com/ws');

// 1. Соединение открыто
ws.addEventListener('open', () => {
  console.log('Подключено');
});

// 2. Получение сообщения
ws.addEventListener('message', (event) => {
  console.log('Данные:', event.data);
});

// 3. Ошибка
ws.addEventListener('error', (event) => {
  console.error('Ошибка WebSocket:', event);
});

// 4. Соединение закрыто
ws.addEventListener('close', (event) => {
  console.log('Закрыто:', event.code, event.reason);
  console.log('Чистое закрытие:', event.wasClean);
});
```

### Закрытие соединения

```javascript
// Корректное закрытие
ws.close();                    // Без кода
ws.close(1000, 'Завершено');   // С кодом и причиной

// Коды закрытия:
// 1000 — нормальное закрытие
// 1001 — уход со страницы
// 1002 — ошибка протокола
// 1003 — неподдерживаемый тип данных
// 1006 — аварийное закрытие (нет handshake)
// 1008 — нарушение политики
// 1011 — непредвиденная ошибка сервера
// 3000-4999 — пользовательские коды
```

### Автоматическое переподключение

```javascript
class ReconnectingWebSocket {
  constructor(url, options = {}) {
    this.url = url;
    this.maxRetries = options.maxRetries || 10;
    this.delay = options.delay || 1000;
    this.maxDelay = options.maxDelay || 30000;
    this.retries = 0;
    this.handlers = { message: [], open: [], close: [] };
    this.connect();
  }

  connect() {
    this.ws = new WebSocket(this.url);

    this.ws.addEventListener('open', () => {
      console.log('Подключено');
      this.retries = 0;
      this.handlers.open.forEach(fn => fn());
    });

    this.ws.addEventListener('message', (event) => {
      this.handlers.message.forEach(fn => fn(event));
    });

    this.ws.addEventListener('close', (event) => {
      this.handlers.close.forEach(fn => fn(event));

      if (!event.wasClean && this.retries < this.maxRetries) {
        const delay = Math.min(
          this.delay * Math.pow(2, this.retries),
          this.maxDelay
        );
        console.log(`Переподключение через ${delay}ms...`);
        setTimeout(() => {
          this.retries++;
          this.connect();
        }, delay);
      }
    });

    this.ws.addEventListener('error', () => {
      // Ошибка приведёт к close
    });
  }

  send(data) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(data);
    }
  }

  on(event, handler) {
    this.handlers[event]?.push(handler);
  }

  close() {
    this.maxRetries = 0; // Отключить переподключение
    this.ws.close(1000, 'Закрытие пользователем');
  }
}

// Использование
const ws = new ReconnectingWebSocket('wss://api.example.com/ws');
ws.on('message', (event) => console.log(event.data));
```

### Heartbeat (Ping/Pong)

```javascript
class WebSocketWithHeartbeat {
  constructor(url, interval = 30000) {
    this.url = url;
    this.interval = interval;
    this.connect();
  }

  connect() {
    this.ws = new WebSocket(this.url);

    this.ws.addEventListener('open', () => {
      this.startHeartbeat();
    });

    this.ws.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'pong') {
        this.lastPong = Date.now();
      }
    });

    this.ws.addEventListener('close', () => {
      this.stopHeartbeat();
    });
  }

  startHeartbeat() {
    this.lastPong = Date.now();

    this.pingTimer = setInterval(() => {
      if (Date.now() - this.lastPong > this.interval * 2) {
        console.log('Сервер не отвечает, переподключение...');
        this.ws.close();
        return;
      }

      this.ws.send(JSON.stringify({ type: 'ping' }));
    }, this.interval);
  }

  stopHeartbeat() {
    clearInterval(this.pingTimer);
  }
}
```

## 6. Безопасность

### WSS (WebSocket Secure)

```javascript
// Всегда используйте wss:// в production
const ws = new WebSocket('wss://api.example.com/ws');

// ws:// — НЕ зашифрован (как HTTP)
// wss:// — зашифрован TLS (как HTTPS)
```

### Аутентификация

```javascript
// Вариант 1: Токен в URL (не рекомендуется — виден в логах)
const ws = new WebSocket(`wss://api.example.com/ws?token=${token}`);

// Вариант 2: Отправка токена после подключения
const ws = new WebSocket('wss://api.example.com/ws');
ws.addEventListener('open', () => {
  ws.send(JSON.stringify({
    type: 'auth',
    token: 'your-jwt-token',
  }));
});

// Вариант 3: Cookie (если same-origin)
// Cookies отправляются автоматически при handshake
```

### Валидация данных

```javascript
// Всегда валидируйте входящие данные
ws.addEventListener('message', (event) => {
  let message;
  try {
    message = JSON.parse(event.data);
  } catch {
    console.error('Невалидный JSON');
    return;
  }

  // Проверка структуры
  if (!message.type || typeof message.type !== 'string') {
    console.error('Отсутствует тип сообщения');
    return;
  }

  // Санитизация текста (защита от XSS)
  if (message.text) {
    message.text = sanitize(message.text);
  }

  handleMessage(message);
});
```

### Rate Limiting на клиенте

```javascript
class RateLimitedWS {
  constructor(ws, maxPerSecond = 10) {
    this.ws = ws;
    this.maxPerSecond = maxPerSecond;
    this.messageCount = 0;

    setInterval(() => {
      this.messageCount = 0;
    }, 1000);
  }

  send(data) {
    if (this.messageCount >= this.maxPerSecond) {
      console.warn('Rate limit: слишком много сообщений');
      return false;
    }

    this.messageCount++;
    this.ws.send(data);
    return true;
  }
}
```

## 7. Фреймворки — Socket.IO

### Socket.IO vs WebSocket

```javascript
// Socket.IO — это НЕ просто обёртка над WebSocket
// Это отдельный протокол поверх Engine.IO:
// - Автоматическое переподключение
// - Комнаты и пространства имён
// - Fallback на long-polling
// - Подтверждения (acknowledgements)
// - Broadcast
// - Бинарные данные

// ВАЖНО: Socket.IO клиент НЕ совместим с обычным WebSocket сервером
```

### Клиент Socket.IO

```javascript
import { io } from 'socket.io-client';

const socket = io('https://api.example.com', {
  auth: { token: 'jwt-token' },
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// Подключение
socket.on('connect', () => {
  console.log('Подключено, ID:', socket.id);
});

// Отправка события
socket.emit('chat:message', {
  room: 'general',
  text: 'Привет!',
});

// Получение события
socket.on('chat:message', (data) => {
  console.log(`${data.from}: ${data.text}`);
});

// Подтверждение (acknowledgement)
socket.emit('order:create', orderData, (response) => {
  if (response.ok) {
    console.log('Заказ создан:', response.id);
  } else {
    console.error('Ошибка:', response.error);
  }
});

// Комнаты (на стороне клиента — join/leave через сервер)
socket.emit('room:join', 'room-123');
socket.emit('room:leave', 'room-123');

// Отключение
socket.on('disconnect', (reason) => {
  console.log('Отключён:', reason);
});
```

### Сервер Socket.IO (Node.js)

```javascript
import { Server } from 'socket.io';

const io = new Server(3000, {
  cors: { origin: '*' },
});

io.on('connection', (socket) => {
  console.log('Клиент подключён:', socket.id);

  // Обработка событий
  socket.on('chat:message', (data) => {
    // Отправка всем в комнате
    io.to(data.room).emit('chat:message', {
      from: socket.id,
      text: data.text,
    });
  });

  // Комнаты
  socket.on('room:join', (room) => {
    socket.join(room);
  });

  // Отключение
  socket.on('disconnect', () => {
    console.log('Клиент отключён:', socket.id);
  });
});
```

## 8. Практический пример — Чат

```javascript
class ChatClient {
  constructor(url, username) {
    this.username = username;
    this.ws = new ReconnectingWebSocket(url);
    this.onMessage = null;
    this.onUserList = null;

    this.ws.on('open', () => {
      this.send('join', { username: this.username });
    });

    this.ws.on('message', (event) => {
      const msg = JSON.parse(event.data);

      switch (msg.type) {
        case 'chat':
          this.onMessage?.(msg);
          break;
        case 'users':
          this.onUserList?.(msg.users);
          break;
        case 'system':
          this.onMessage?.({
            ...msg,
            from: 'Система',
          });
          break;
      }
    });
  }

  send(type, data) {
    this.ws.send(JSON.stringify({ type, ...data }));
  }

  sendMessage(text) {
    this.send('chat', {
      text,
      from: this.username,
      timestamp: Date.now(),
    });
  }

  disconnect() {
    this.send('leave', { username: this.username });
    this.ws.close();
  }
}

// Использование
const chat = new ChatClient('wss://chat.example.com', 'Иван');

chat.onMessage = (msg) => {
  console.log(`[${msg.from}]: ${msg.text}`);
};

chat.sendMessage('Всем привет!');
```

## Справочник

```javascript
// Создание
const ws = new WebSocket('wss://example.com/ws');

// События
ws.onopen = () => {};           // Подключено
ws.onmessage = (e) => {};      // Сообщение (e.data)
ws.onerror = (e) => {};        // Ошибка
ws.onclose = (e) => {};        // Закрыто (e.code, e.reason)

// Отправка
ws.send('текст');
ws.send(JSON.stringify(obj));
ws.send(arrayBuffer);

// Закрытие
ws.close(1000, 'причина');

// Состояние
ws.readyState; // 0=CONNECTING, 1=OPEN, 2=CLOSING, 3=CLOSED
```
