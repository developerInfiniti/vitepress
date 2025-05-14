# Работа с HTTP в Node.js (модуль `http`)

Модуль `http` в Node.js предоставляет инструменты для создания и взаимодействия с HTTP-серверами и клиентами. Он является низкоуровневым API, но предоставляет всю необходимую функциональность для обработки HTTP-запросов и ответов.

## Создание HTTP-сервера

Для создания HTTP-сервера используется метод `http.createServer()`, который возвращает объект `http.Server`. Этот сервер слушает входящие HTTP-запросы на указанном порту и хосте.

```javascript
const http = require('node:http');

const hostname = '127.0.0.1'; // localhost
const port = 3000;

const server = http.createServer((req, res) => {
  // req (http.IncomingMessage): Объект, представляющий входящий HTTP-запрос
  // res (http.ServerResponse): Объект, используемый для отправки HTTP-ответа

  console.log('Получен запрос:', req.method, req.url);
  console.log('Заголовки запроса:', req.headers);

  res.statusCode = 200; // Устанавливаем код состояния ответа (OK)
  res.setHeader('Content-Type', 'text/plain'); // Устанавливаем заголовок Content-Type
  res.end('Привет, мир!\n'); // Отправляем тело ответа и завершаем соединение
});

server.listen(port, hostname, () => {
  console.log(`Сервер запущен на http://${hostname}:${port}/`);
});
```

**Основные компоненты:**

* **`http.createServer(requestListener)`:** Создает новый экземпляр `http.Server`. Аргумент `requestListener` — это функция, которая вызывается при каждом входящем HTTP-запросе. Она принимает два аргумента: объект запроса (`req`) и объект ответа (`res`).
* **`server.listen(port[, hostname][, backlog][, callback])`:** Начинает прослушивание входящих соединений на указанном порту и хосте.
    * `port`: Порт, на котором будет слушать сервер (например, 3000).
    * `hostname` (необязательно): Хост, на котором будет слушать сервер (по умолчанию `'0.0.0.0'`, что означает прослушивание на всех доступных сетевых интерфейсах). `'127.0.0.1'` (localhost) слушает только локальные запросы.
    * `backlog` (необязательно): Максимальное количество ожидающих соединений в очереди.
    * `callback` (необязательно): Функция, которая вызывается после того, как сервер начал прослушивание.

### Объект запроса (`http.IncomingMessage`)

Объект `req`, передаваемый в `requestListener`, является экземпляром `http.IncomingMessage`. Он содержит информацию о входящем HTTP-запросе, такую как:

* **`req.method`:** HTTP-метод запроса (`GET`, `POST`, `PUT`, `DELETE` и др.).
* **`req.url`:** Запрашиваемый URL (путь и строка запроса).
* **`req.headers`:** Объект, содержащий заголовки запроса.
* **`req.httpVersion`:** Версия HTTP, используемая клиентом (например, `'1.1'`, `'2.0'`).
* **События:** `req` является потоком (`stream.Readable`) и излучает события, такие как `'data'` (при получении тела запроса) и `'end'` (после получения всего тела запроса).

**Пример обработки тела запроса (например, для `POST` или `PUT` запросов):**

```javascript
const serverWithBody = http.createServer((req, res) => {
  if (req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      console.log('Тело запроса:', body);
      try {
        const parsedBody = JSON.parse(body);
        console.log('Распарсенное тело запроса:', parsedBody);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Данные успешно получены' }));
      } catch (error) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Ошибка разбора тела запроса\n');
      }
    });
  } else {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Привет, это не POST запрос!\n');
  }
});

serverWithBody.listen(port, hostname, () => {
  console.log(`Сервер с обработкой тела запущен на http://${hostname}:${port}/`);
});
```

### Объект ответа (`http.ServerResponse`)

Объект `res`, передаваемый в `requestListener`, является экземпляром `http.ServerResponse`. Он используется для отправки HTTP-ответа клиенту.

* **`res.statusCode`:** Устанавливает код состояния HTTP-ответа (например, `200` для OK, `404` для Not Found, `500` для Internal Server Error).
* **`res.setHeader(name, value)`:** Устанавливает заголовок ответа. Можно вызывать несколько раз для установки разных заголовков.
* **`res.writeHead(statusCode[, statusMessage][, headers])`:** Устанавливает код состояния и заголовки ответа за один вызов.
* **`res.write(chunk[, encoding][, callback])`:** Отправляет часть тела ответа. Может вызываться несколько раз для потоковой передачи данных.
* **`res.end([data][, encoding][, callback])`:** Завершает отправку ответа. Может опционально отправить последнюю часть тела ответа. После вызова `res.end()` дальнейшие вызовы `res.write()` или `res.end()` приведут к ошибке.

**Пример отправки различных типов контента:**

```javascript
const serverWithContentType = http.createServer((req, res) => {
  if (req.url === '/html') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end('<h1>Привет, это HTML!</h1>');
  } else if (req.url === '/json') {
    const data = { message: 'Привет, это JSON!' };
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
  } else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Страница не найдена\n');
  }
});

serverWithContentType.listen(port, hostname, () => {
  console.log(`Сервер с разными типами контента запущен на http://${hostname}:${port}/`);
});
```

## Создание HTTP-клиента (выполнение HTTP-запросов)

Модуль `http` также позволяет вашему Node.js приложению выступать в роли HTTP-клиента для отправки запросов к другим серверам. Для этого используются функции `http.request()` или `http.get()`.

### `http.request(options[, callback])`

Метод `http.request()` используется для создания запроса. Он возвращает объект `http.ClientRequest`, который используется для отправки запроса.

```javascript
const options = {
  hostname: 'example.com',
  port: 80,
  path: '/data',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log('Код состояния:', res.statusCode);
  console.log('Заголовки:', res.headers);

  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('Тело ответа:', data);
  });
});

req.on('error', (error) => {
  console.error('Произошла ошибка запроса:', error);
});

req.end(); // Завершаем отправку запроса (даже если нет тела)
```

* **`options`:** Объект, содержащий параметры запроса:
    * `hostname`: Хост сервера.
    * `port`: Порт сервера (по умолчанию 80 для HTTP).
    * `path`: Путь запроса.
    * `method`: HTTP-метод (`GET`, `POST` и др.).
    * `headers`: Объект с заголовками запроса.
    * `auth`: Учетные данные для базовой аутентификации (`'user:password'`).
    * И другие опции.
* **`callback`:** Функция, которая вызывается с объектом `http.IncomingMessage` (`res`) после получения ответа.

### `http.get(options[, callback])`

Метод `http.get()` является сокращением для `http.request()` с методом `GET`.

```javascript
http.get('[http://example.com/data](http://example.com/data)', (res) => {
  console.log('Код состояния:', res.statusCode);
  console.log('Заголовки:', res.headers);

  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('Тело ответа:', data);
  });
}).on('error', (error) => {
  console.error('Произошла ошибка запроса:', error);
});
```

### Отправка данных в запросе (например, `POST` или `PUT`)

Для отправки данных с запросами `POST` или `PUT`, необходимо записать данные в объект `req` (экземпляр `http.ClientRequest`).

```javascript
const postData = JSON.stringify({
  userId: 123,
  title: 'Новая запись'
});

const postOptions = {
  hostname: 'jsonplaceholder.typicode.com',
  port: 443, // HTTPS
  path: '/posts',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const postReq = https.request(postOptions, (res) => { // Используем https для https://
  console.log('Код состояния:', res.statusCode);
  console.log('Заголовки:', res.headers);

  let responseBody = '';
  res.on('data', (chunk) => {
    responseBody += chunk;
  });
  res.on('end', () => {
    console.log('Тело ответа:', responseBody);
  });
});

postReq.on('error', (error) => {
  console.error('Произошла ошибка POST-запроса:', error);
});

postReq.write(postData); // Отправляем данные тела запроса
postReq.end();
```

**Важно:** Для выполнения HTTPS-запросов необходимо использовать модуль `https` (который работает аналогично `http`, но для безопасных соединений).

## Лучшие практики

* **Обработка ошибок:** Всегда обрабатывайте ошибки как на сервере (в `requestListener`), так и на клиенте (событие `'error'` на объектах запроса и ответа).
* **Управление заголовками:** Правильно устанавливайте заголовки `Content-Type` для указания типа отправляемых данных.
* **Обработка тела запроса и ответа:** Асинхронно читайте данные из потоков (`'data'` и `'end'`).
* **Использование фреймворков:** Для более сложных веб-приложений и API рассмотрите использование фреймворков, таких как Express.js или NestJS, которые упрощают многие аспекты работы с HTTP.
* **Безопасность:** При работе с HTTP-серверами уделяйте внимание вопросам безопасности, таким как защита от распространенных веб-уязвимостей.

Модуль `http` является основой для сетевого взаимодействия в Node.js. Понимание его возможностей позволяет создавать как простые веб-серверы, так и HTTP-клиенты для взаимодействия с внешними API. Для более удобной разработки веб-приложений часто используются более высокоуровневые фреймворки, построенные на основе этого модуля.