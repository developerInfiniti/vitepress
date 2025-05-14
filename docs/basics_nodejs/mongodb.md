# Работа с MongoDB в Node.js

Для взаимодействия с MongoDB из Node.js необходимо использовать официальный драйвер MongoDB Node.js. Этот драйвер предоставляет API для подключения к серверам MongoDB, выполнения операций CRUD (Create, Read, Update, Delete) и многого другого.

## Установка драйвера MongoDB Node.js

Прежде чем начать, вам необходимо установить драйвер MongoDB Node.js в ваш проект:

```bash
npm install mongodb --save
```

Флаг `--save` добавит `mongodb` в список зависимостей вашего файла `package.json`.

## Подключение к MongoDB

Первым шагом является подключение к серверу MongoDB. Для этого используется класс `MongoClient` из установленного пакета.

```javascript
const { MongoClient } = require('mongodb');

// URI подключения к вашему серверу MongoDB
const uri = 'mongodb://localhost:27017/mydatabase'; // Замените 'mydatabase' на имя вашей базы данных

async function connect() {
  const client = new MongoClient(uri);

  try {
    // Подключаемся к кластеру
    await client.connect();

    console.log('Успешно подключено к MongoDB!');

    // Здесь будет код для работы с базой данных

  } catch (error) {
    console.error('Ошибка подключения к MongoDB:', error);
  } finally {
    // Закрываем соединение после завершения
    await client.close();
    console.log('Соединение с MongoDB закрыто.');
  }
}

connect();
```

**Основные моменты:**

* Импортируем класс `MongoClient` из модуля `mongodb`.
* Определяем `uri` — строку подключения к вашему серверу MongoDB. Убедитесь, что вы указали правильный хост, порт и имя базы данных. Порт по умолчанию для MongoDB — `27017`.
* Создаем асинхронную функцию `connect` для обработки подключения.
* Создаем экземпляр `MongoClient`, передавая ему `uri`.
* Используем `await client.connect()` для установления соединения. Это асинхронная операция, поэтому используем `await`.
* В блоке `finally` обязательно закрываем соединение с помощью `await client.close()`, чтобы избежать утечек ресурсов.

## Работа с коллекциями и документами

В MongoDB данные организованы в **коллекции**, которые содержат **документы**. Документ — это набор пар "ключ-значение", похожий на объект JSON.

### Получение доступа к базе данных и коллекции

После успешного подключения вы можете получить доступ к определенной базе данных и коллекции:

```javascript
const { MongoClient } = require('mongodb');
const uri = 'mongodb://localhost:27017/mydatabase';

async function main() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('mydatabase'); // Получаем доступ к базе данных 'mydatabase'
    const usersCollection = db.collection('users'); // Получаем доступ к коллекции 'users'

    // Здесь будут операции с коллекцией 'users'

  } catch (error) {
    console.error('Ошибка:', error);
  } finally {
    await client.close();
  }
}

main();
```

### Вставка документов

Для вставки новых документов в коллекцию используются методы `insertOne()` (для вставки одного документа) и `insertMany()` (для вставки нескольких документов).

```javascript
// Вставка одного документа
const newUser = { name: 'Алиса', age: 30 };
const insertOneResult = await usersCollection.insertOne(newUser);
console.log('Результат вставки одного документа:', insertOneResult);
console.log('ID вставленного документа:', insertOneResult.insertedId);

// Вставка нескольких документов
const newUsers = [
  { name: 'Боб', age: 25 },
  { name: 'Чарли', age: 35 }
];
const insertManyResult = await usersCollection.insertMany(newUsers);
console.log('Результат вставки нескольких документов:', insertManyResult);
console.log('IDs вставленных документов:', insertManyResult.insertedIds);
```

### Чтение документов

Для чтения документов из коллекции используются методы `findOne()` (для поиска одного документа) и `find()` (для поиска нескольких документов).

```javascript
// Поиск одного документа
const queryOne = { name: 'Алиса' };
const foundUser = await usersCollection.findOne(queryOne);
console.log('Найденный пользователь:', foundUser);

// Поиск нескольких документов
const queryMany = { age: { $gte: 25 } }; // Возраст больше или равен 25
const foundUsersCursor = usersCollection.find(queryMany);
const foundUsers = await foundUsersCursor.toArray(); // Преобразуем курсор в массив документов
console.log('Найденные пользователи:', foundUsers);

// Поиск с опциями (например, сортировка)
const sortedUsersCursor = usersCollection.find({}).sort({ age: -1 }); // Сортировка по возрасту в убывающем порядке
const sortedUsers = await sortedUsersCursor.toArray();
console.log('Отсортированные пользователи:', sortedUsers);
```

### Обновление документов

Для обновления существующих документов используются методы `updateOne()` (для обновления одного документа) и `updateMany()` (для обновления нескольких документов).

```javascript
// Обновление одного документа
const updateQueryOne = { name: 'Алиса' };
const updateOperationOne = { $set: { age: 31 } }; // Оператор $set обновляет значение поля
const updateOneResult = await usersCollection.updateOne(updateQueryOne, updateOperationOne);
console.log('Результат обновления одного документа:', updateOneResult);
console.log('Количество измененных документов:', updateOneResult.modifiedCount);

// Обновление нескольких документов
const updateQueryMany = { age: { $lt: 30 } }; // Возраст меньше 30
const updateOperationMany = { $inc: { age: 1 } }; // Оператор $inc увеличивает значение поля на 1
const updateManyResult = await usersCollection.updateMany(updateQueryMany, updateOperationMany);
console.log('Результат обновления нескольких документов:', updateManyResult);
console.log('Количество измененных документов:', updateManyResult.modifiedCount);
```

### Удаление документов

Для удаления документов используются методы `deleteOne()` (для удаления одного документа) и `deleteMany()` (для удаления нескольких документов).

```javascript
// Удаление одного документа
const deleteQueryOne = { name: 'Боб' };
const deleteOneResult = await usersCollection.deleteOne(deleteQueryOne);
console.log('Результат удаления одного документа:', deleteOneResult);
console.log('Количество удаленных документов:', deleteOneResult.deletedCount);

// Удаление нескольких документов
const deleteQueryMany = { age: { $gte: 35 } };
const deleteManyResult = await usersCollection.deleteMany(deleteQueryMany);
console.log('Результат удаления нескольких документов:', deleteManyResult);
console.log('Количество удаленных документов:', deleteManyResult.deletedCount);
```

## Работа с промисами и `async/await`

Как вы могли заметить в примерах, большинство операций с MongoDB возвращают промисы. Использование `async/await` делает асинхронный код более читаемым и простым в управлении.

## Индексы

Индексы используются для повышения производительности запросов к базе данных. Рекомендуется создавать индексы для полей, которые часто используются в запросах.

```javascript
// Создание индекса по полю 'name'
const createIndexResult = await usersCollection.createIndex({ name: 1 }); // 1 означает восходящий порядок
console.log('Результат создания индекса:', createIndexResult);

// Получение списка индексов коллекции
const indexes = await usersCollection.indexes();
console.log('Индексы коллекции:', indexes);

// Удаление индекса
const dropIndexResult = await usersCollection.dropIndex('name_1'); // Имя индекса
console.log('Результат удаления индекса:', dropIndexResult);
```

## Лучшие практики

* **Обработка ошибок:** Всегда оборачивайте асинхронные операции в блоки `try...catch` для обработки возможных ошибок подключения и выполнения запросов.
* **Закрытие соединения:** Обязательно закрывайте соединение с MongoDB после завершения работы, чтобы избежать утечек ресурсов. Лучшим местом для этого является блок `finally`.
* **Использование `async/await`:** Для более чистого и читаемого асинхронного кода используйте `async/await`.
* **Правильное построение запросов:** Изучите операторы MongoDB (например, `$gt`, `$lt`, `$in`, `$and`, `$or`, `$set`, `$inc`) для эффективного поиска, обновления и удаления данных.
* **Индексирование:** Определяйте и создавайте индексы для часто используемых полей запросов для повышения производительности.
* **Безопасность:** Следуйте рекомендациям по безопасности MongoDB, таким как настройка аутентификации и авторизации.

Это лишь основы работы с MongoDB в Node.js. Драйвер MongoDB Node.js предоставляет гораздо больше возможностей для взаимодействия с базой данных, включая агрегацию, транзакции, работу с GridFS для хранения больших файлов и многое другое. Для более глубокого изучения обратитесь к официальной документации драйвера MongoDB Node.js.