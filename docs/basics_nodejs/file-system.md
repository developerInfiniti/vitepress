# Работа с файловой системой в Node.js (модуль `fs`)

Модуль `fs` в Node.js предоставляет API для взаимодействия с файловой системой. Он позволяет выполнять такие операции, как чтение файлов, запись в файлы, создание и удаление каталогов, проверка существования файлов и каталогов, получение информации о файлах и многое другое.

Модуль `fs` предоставляет как **синхронные**, так и **асинхронные** версии большинства своих функций. Асинхронные функции являются **неблокирующими**, что означает, что они не будут останавливать выполнение вашего Node.js приложения во время выполнения файловой операции. Вместо этого они используют колбэки, промисы или `async/await` для обработки результатов после завершения операции.

**Важно:** Синхронные функции блокируют основной поток выполнения до завершения операции. Их следует использовать с осторожностью, особенно в серверных приложениях, так как они могут привести к зависанию приложения при выполнении длительных операций.

## Импорт модуля `fs`

Для использования функций модуля `fs` вам необходимо импортировать его:

```javascript
// CommonJS
const fs = require('node:fs'); // Рекомендуется использовать префикс 'node:'

// ES Modules (требует настройки, например, .mjs расширение или "type": "module" в package.json)
// import fs from 'node:fs';
```

## Основные операции с файлами

### Чтение файлов

#### Асинхронное чтение (`fs.readFile`)

```javascript
fs.readFile('example.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Произошла ошибка при чтении файла:', err);
    return;
  }
  console.log('Содержимое файла:', data);
});

console.log('Программа продолжает выполняться...');
```

* Первый аргумент — путь к файлу.
* Второй аргумент (необязательный) — кодировка (например, `'utf8'`, `'ascii'`). Если не указана, возвращается объект `Buffer`.
* Третий аргумент — колбэк-функция, которая принимает два аргумента: `err` (ошибка, если произошла) и `data` (содержимое файла).

#### Асинхронное чтение с промисами (`fs.promises.readFile`)

```javascript
const fs = require('node:fs').promises;

async function readFileAsync() {
  try {
    const data = await fs.readFile('example.txt', 'utf8');
    console.log('Содержимое файла (с промисами):', data);
  } catch (err) {
    console.error('Произошла ошибка при чтении файла (с промисами):', err);
  }
}

readFileAsync();
console.log('Программа продолжает выполняться (с промисами)...');
```

#### Синхронное чтение (`fs.readFileSync`)

```javascript
try {
  const data = fs.readFileSync('example.txt', 'utf8');
  console.log('Содержимое файла (синхронно):', data);
} catch (err) {
  console.error('Произошла ошибка при чтении файла (синхронно):', err);
}

console.log('Эта строка выполнится после чтения файла (синхронно).');
```

### Запись в файлы

#### Асинхронная запись (`fs.writeFile`)

```javascript
const content = 'Новое содержимое файла.';

fs.writeFile('output.txt', content, 'utf8', (err) => {
  if (err) {
    console.error('Произошла ошибка при записи в файл:', err);
    return;
  }
  console.log('Файл успешно записан.');
});

console.log('Программа продолжает выполняться после попытки записи...');
```

* Первый аргумент — путь к файлу.
* Второй аргумент — данные для записи.
* Третий аргумент (необязательный) — кодировка.
* Четвертый аргумент — колбэк-функция, которая принимает аргумент `err` (ошибка, если произошла).

#### Асинхронная запись с промисами (`fs.promises.writeFile`)

```javascript
const fs = require('node:fs').promises;
const content = 'Новое содержимое файла с промисами.';

async function writeFileAsync() {
  try {
    await fs.writeFile('output_async.txt', content, 'utf8');
    console.log('Файл успешно записан (с промисами).');
  } catch (err) {
    console.error('Произошла ошибка при записи в файл (с промисами):', err);
  }
}

writeFileAsync();
console.log('Программа продолжает выполняться после попытки записи (с промисами)...');
```

#### Синхронная запись (`fs.writeFileSync`)

```javascript
const content = 'Новое содержимое файла (синхронно).';

try {
  fs.writeFileSync('output_sync.txt', content, 'utf8');
  console.log('Файл успешно записан (синхронно).');
} catch (err) {
  console.error('Произошла ошибка при записи в файл (синхронно):', err);
}

console.log('Эта строка выполнится после записи файла (синхронно).');
```

### Добавление данных в файл

#### Асинхронное добавление (`fs.appendFile`)

```javascript
const contentToAppend = '\nДобавленная строка.';

fs.appendFile('log.txt', contentToAppend, 'utf8', (err) => {
  if (err) {
    console.error('Произошла ошибка при добавлении в файл:', err);
    return;
  }
  console.log('Данные успешно добавлены в файл.');
});
```

#### Асинхронное добавление с промисами (`fs.promises.appendFile`)

```javascript
const fs = require('node:fs').promises;
const contentToAppend = '\nДобавленная строка с промисами.';

async function appendFileAsync() {
  try {
    await fs.appendFile('log_async.txt', contentToAppend, 'utf8');
    console.log('Данные успешно добавлены в файл (с промисами).');
  } catch (err) {
    console.error('Произошла ошибка при добавлении в файл (с промисами):', err);
  }
}

appendFileAsync();
```

#### Синхронное добавление (`fs.appendFileSync`)

```javascript
const contentToAppend = '\nДобавленная строка (синхронно).';

try {
  fs.appendFileSync('log_sync.txt', contentToAppend, 'utf8');
  console.log('Данные успешно добавлены в файл (синхронно).');
} catch (err) {
  console.error('Произошла ошибка при добавлении в файл (синхронно):', err);
}
```

### Создание и удаление каталогов

#### Асинхронное создание каталога (`fs.mkdir`)

```javascript
fs.mkdir('new_directory', (err) => {
  if (err) {
    console.error('Произошла ошибка при создании каталога:', err);
    return;
  }
  console.log('Каталог успешно создан.');
});

// Рекурсивное создание вложенных каталогов
fs.mkdir('nested/directory', { recursive: true }, (err) => {
  if (err) {
    console.error('Произошла ошибка при создании вложенных каталогов:', err);
    return;
  }
  console.log('Вложенные каталоги успешно созданы.');
});
```

#### Асинхронное создание каталога с промисами (`fs.promises.mkdir`)

```javascript
const fs = require('node:fs').promises;

async function createDirectoryAsync() {
  try {
    await fs.mkdir('new_directory_async');
    console.log('Каталог успешно создан (с промисами).');
    await fs.mkdir('nested_async/directory_async', { recursive: true });
    console.log('Вложенные каталоги успешно созданы (с промисами).');
  } catch (err) {
    console.error('Произошла ошибка при создании каталога (с промисами):', err);
  }
}

createDirectoryAsync();
```

#### Синхронное создание каталога (`fs.mkdirSync`)

```javascript
try {
  fs.mkdirSync('new_directory_sync');
  console.log('Каталог успешно создан (синхронно).');
  fs.mkdirSync('nested_sync/directory_sync', { recursive: true });
  console.log('Вложенные каталоги успешно созданы (синхронно).');
} catch (err) {
  console.error('Произошла ошибка при создании каталога (синхронно):', err);
}
```

#### Асинхронное удаление каталога (`fs.rmdir`)

**Внимание:** `fs.rmdir` удаляет только пустые каталоги.

```javascript
fs.rmdir('empty_directory', (err) => {
  if (err) {
    console.error('Произошла ошибка при удалении каталога:', err);
    return;
  }
  console.log('Каталог успешно удален.');
});
```

Для удаления непустых каталогов используйте `fs.rm` с опцией `recursive: true`.

#### Асинхронное удаление каталога (рекурсивное) (`fs.rm`)

```javascript
fs.rm('non_empty_directory', { recursive: true, force: true }, (err) => {
  if (err) {
    console.error('Произошла ошибка при удалении каталога:', err);
    return;
  }
  console.log('Каталог и его содержимое успешно удалены.');
});
```

* `recursive: true` позволяет удалять непустые каталоги и их содержимое.
* `force: true` подавляет ошибки, если файл или каталог не существует.

#### Асинхронное удаление каталога с промисами (`fs.promises.rmdir`, `fs.promises.rm`)

```javascript
const fs = require('node:fs').promises;

async function removeDirectoryAsync() {
  try {
    await fs.rmdir('empty_directory_async');
    console.log('Каталог успешно удален (с промисами).');
    await fs.rm('non_empty_directory_async', { recursive: true, force: true });
    console.log('Каталог и его содержимое успешно удалены (с промисами).');
  } catch (err) {
    console.error('Произошла ошибка при удалении каталога (с промисами):', err);
  }
}

removeDirectoryAsync();
```

#### Синхронное удаление каталога (`fs.rmdirSync`, `fs.rmSync`)

```javascript
try {
  fs.rmdirSync('empty_directory_sync');
  console.log('Каталог успешно удален (синхронно).');
  fs.rmSync('non_empty_directory_sync', { recursive: true, force: true });
  console.log('Каталог и его содержимое успешно удалены (синхронно).');
} catch (err) {
  console.error('Произошла ошибка при удалении каталога (синхронно):', err);
}
```

### Проверка существования файла или каталога

#### Асинхронная проверка (`fs.exists`)

**Устаревший метод, не рекомендуется к использованию.** Вместо него используйте `fs.access` или `fs.stat`.

#### Асинхронная проверка (`fs.access`)

```javascript
fs.access('example.txt', fs.constants.F_OK, (err) => {
  if (err) {
    console.error('Файл не существует или нет доступа:', err);
    return;
  }
  console.log('Файл существует и доступен.');
});

// Проверка прав на чтение
fs.access('example.txt', fs.constants.R_OK, (err) => {
  if (err) {
    console.error('Нет прав на чтение файла:', err);
    return;
  }
  console.log('Файл доступен для чтения.');
});
```

* `fs.constants.F_OK`: Проверяет существование файла.
* `fs.constants.R_OK`: Проверяет наличие прав на чтение.
* `fs.constants.W_OK`: Проверяет наличие прав на запись.
* `fs.constants.X_OK`: Проверяет наличие прав на выполнение.

#### Асинхронная проверка с промисами (`fs.promises.access`)

```javascript
const fs = require('node:fs').promises;

async function checkAccessAsync() {
  try {
    await fs.access('example_async.txt', fs.constants.F_OK);
    console.log('Файл существует и доступен (с промисами).');
    await fs.access('example_async.txt', fs.constants.R_OK);
    console.log('Файл доступен для чтения (с промисами).');
  } catch (err) {
    console.error('Файл не существует или нет доступа (с промисами):', err);
  }
}

checkAccessAsync();
```

#### Синхронная проверка (`fs.accessSync`)

```javascript
try {
  fs.accessSync('example_sync.txt', fs.constants.F_OK);
  console.log('Файл существует и доступен (синхронно).');
  fs.accessSync('example_sync.txt', fs.constants.R_OK);
  console.log('Файл доступен для чтения (синхронно).');
} catch (err) {
  console.error('Файл не существует или нет доступа (синхронно):', err);
}
```

### Получение информации о файле или каталоге (`fs.stat`)

Функция `fs.stat` позволяет получить подробную информацию о файле или каталоге (размер, тип, права доступа, время последнего изменения и т.д.).

#### Асинхронное получение информации (`fs.stat`)

```javascript
fs.stat('example.txt', (err, stats) => {
  if (err) {
    console.error('Произошла ошибка при получении информации о файле:', err);
    return;
  }
  console.log('Информация о файле:', stats);
  console.log('Является файлом:', stats.isFile());
  console.log('Является каталогом:', stats.isDirectory());
  console.log('Размер файла:', stats.size, 'байт');
});
```

#### Асинхронное получение информации с промисами (`fs.promises.stat`)

```javascript
const fs = require('node:fs').promises;

async function getFileStatsAsync() {
  try {
    const stats = await fs.stat('example_async.txt');
    console.log('Информация о файле (с промисами):', stats);
    console.log('Является файлом (с промисами):', stats.isFile());
    console.log('Является каталогом (с промисами):', stats.isDirectory());
    console.log('Размер файла (с промисами):', stats.size, 'байт');
  } catch (err) {
    console.error('Произошла ошибка при получении информации о файле (с промисами):', err);
  }
}

getFileStatsAsync();
```

#### Синхронное получение информации (`fs.statSync`)

```javascript
try {
  const stats = fs.statSync('example_sync.txt');
  console.log('Информация о файле (синхронно):', stats);
  console.log('Является файлом (синхронно):', stats.isFile());
  console.log('Является каталогом (синхронно):', stats.isDirectory());
  console.log('Размер файла (синхронно):', stats.size, 'байт');
} catch (err) {
  console.error('Произошла ошибка при получении информации о файле (синхронно):', err);
}
```

## Чтение содержимого каталога (`fs.readdir`)

Функция `fs.readdir` позволяет получить список файлов и подкаталогов в указанном каталоге.

#### Асинхронное чтение каталога (`fs.readdir`)

```javascript
fs.readdir('.', (err, files) => {
  if (err) {
    console.error('Произошла ошибка при чтении каталога:', err);
    return;
  }
  console.log('Файлы и каталоги в текущем каталоге:', files);
});
```

#### Асинхронное чтение каталога с промисами (`fs.promises.readdir`)

```javascript
const fs = require('node:fs').promises;

async function readDirectoryAsync() {
  try {
    const files = await fs.readdir('.');
    console.log('Файлы и каталоги в текущем каталоге (с промисами):', files);
  } catch (err) {
    console.error('Произошла ошибка при чтении каталога (с промисами):', err);
  }
}

readDirectoryAsync();
```

#### Синхронное
````
````markdown
ное чтение каталога (`fs.readdirSync`)

```javascript
try {
  const files = fs.readdirSync('.');
  console.log('Файлы и каталоги в текущем каталоге (синхронно):', files);
} catch (err) {
  console.error('Произошла ошибка при чтении каталога (синхронно):', err);
}
````

## Работа с путями (модуль `path`)

Часто при работе с файловой системой необходимо манипулировать путями к файлам и каталогам. Для этого в Node.js есть встроенный модуль `path`.

```javascript
const path = require('node:path');

const filePath = '/users/john/documents/my_file.txt';

console.log('Базовое имя файла:', path.basename(filePath)); // my_file.txt
console.log('Имя файла без расширения:', path.basename(filePath, '.txt')); // my_file
console.log('Название каталога:', path.dirname(filePath)); // /users/john/documents
console.log('Расширение файла:', path.extname(filePath)); // .txt
console.log('Объединение путей:', path.join('/users', 'john', 'documents', 'my_file.txt')); // /users/john/documents/my_file.txt (или с использованием \\ на Windows)
console.log('Нормализация пути:', path.normalize('/users//john/../documents/my_file.txt')); // /users/documents/my_file.txt
console.log('Абсолютный путь:', path.resolve('example.txt')); // Полный путь к example.txt относительно текущей рабочей директории
```

## Обработка ошибок

При работе с файловой системой важно правильно обрабатывать возможные ошибки. Большинство колбэк-функций в асинхронных методах модуля `fs` имеют первый аргумент `err`, который будет содержать объект ошибки, если операция не удалась. Проверяйте этот аргумент перед обработкой данных. При использовании промисов ошибки обычно отлавливаются с помощью блоков `try...catch`.

## Выбор между синхронными и асинхронными методами

* Используйте **асинхронные** методы (`fs.readFile`, `fs.writeFile`, `fs.mkdir`, `fs.rm`, `fs.stat`, `fs.readdir` и их промис-версии) в большинстве случаев, особенно в серверных приложениях, чтобы избежать блокировки основного потока и обеспечить отзывчивость приложения.
* **Синхронные** методы (`fs.readFileSync`, `fs.writeFileSync`, `fs.mkdirSync`, `fs.rmSync`, `fs.statSync`, `fs.readdirSync`) могут быть полезны для простых скриптов, инструментов командной строки или во время инициализации приложения, когда блокировка не является критичной. Однако избегайте их использования в обработчиках запросов в веб-серверах.

Понимание и правильное использование модуля `fs` является ключевым для разработки эффективных и надежных приложений на Node.js, которым необходимо взаимодействовать с файловой системой. Не забывайте о важности асинхронных операций для обеспечения производительности вашего приложения.
