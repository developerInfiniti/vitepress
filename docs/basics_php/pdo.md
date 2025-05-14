# Основы PHP: PDO (PHP Data Objects)

PDO предоставляет абстрактный уровень доступа к данным, что означает, что вам не нужно использовать специфические функции для каждой базы данных. Вместо этого вы используете методы PDO для выполнения запросов и обработки результатов, а PDO сам взаимодействует с драйвером конкретной базы данных.

## Подключение к базе данных

Первым шагом является создание объекта PDO, который представляет соединение с базой данных. Для этого используется конструктор класса `PDO`.

```php
<?php
$host = 'localhost';
$dbname = 'mydatabase';
$user = 'myuser';
$password = 'mypassword';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$dbname;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $password, $options);
    echo "Успешно подключено к базе данных!\n";
} catch (PDOException $e) {
    die("Ошибка подключения к базе данных: " . $e->getMessage());
}
?>
```

* **`$dsn` (Data Source Name):** Строка подключения, которая содержит информацию о типе базы данных, хосте, имени базы данных и кодировке. Формат `dsn` зависит от типа базы данных (например, `pgsql:host=...`, `sqlite:...`).
* **`$options`:** Массив опций для настройки соединения PDO:
    * `PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION`: Устанавливает режим обработки ошибок. `PDO::ERRMODE_EXCEPTION` выбрасывает исключения при возникновении ошибок, что позволяет использовать блоки `try...catch` для их обработки.
    * `PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC`: Устанавливает режим выборки данных по умолчанию как ассоциативный массив (где ключами являются имена столбцов).
    * `PDO::ATTR_EMULATE_PREPARES => false`: Отключает эмуляцию подготовленных запросов (рекомендуется для безопасности и производительности).
* **`try...catch`:** Блок для обработки исключений. Если подключение не удается, будет выброшено исключение `PDOException`, которое будет перехвачено в блоке `catch`.

## Выполнение запросов

После успешного подключения вы можете выполнять SQL-запросы с помощью методов объекта `$pdo`.

### Выполнение простых запросов (`query()`)

Метод `query()` используется для выполнения простых SQL-запросов, которые не содержат пользовательских данных (например, `SELECT * FROM users`). Он возвращает объект `PDOStatement` или `false` в случае ошибки.

```php
<?php
// ... (код подключения) ...

$sql = "SELECT id, name, email FROM users";
$stmt = $pdo->query($sql);

if ($stmt) {
    while ($row = $stmt->fetch()) {
        echo "ID: " . $row['id'] . ", Имя: " . $row['name'] . ", Email: " . $row['email'] . "\n";
    }
    $stmt->closeCursor(); // Закрываем курсор
} else {
    echo "Ошибка выполнения запроса.\n";
}
?>
```

* **`$pdo->query($sql)`:** Выполняет SQL-запрос.
* **`$stmt` (PDOStatement):** Объект, представляющий результирующий набор запроса.
* **`$stmt->fetch()`:** Извлекает следующую строку из результирующего набора. По умолчанию (если не указана другая опция в `$options` или при вызове `fetch()`), возвращает ассоциативный и числовой массив. Используя `PDO::FETCH_ASSOC`, мы получаем только ассоциативный массив.
* **`$stmt->closeCursor()`:** Закрывает курсор, освобождая ресурсы соединения. Рекомендуется делать это после обработки всех строк.

### Подготовленные запросы (`prepare()` и `execute()`)

Подготовленные запросы являются важной частью безопасной работы с базами данных, особенно при обработке пользовательского ввода. Они помогают предотвратить SQL-инъекции.

```php
<?php
// ... (код подключения) ...

$sql = "SELECT id, name FROM users WHERE email = :email";
$stmt = $pdo->prepare($sql);

if ($stmt) {
    $email = 'john.doe@example.com';
    $stmt->bindParam(':email', $email); // Привязка параметра

    if ($stmt->execute()) {
        if ($row = $stmt->fetch()) {
            echo "ID: " . $row['id'] . ", Имя: " . $row['name'] . "\n";
        } else {
            echo "Пользователь с таким email не найден.\n";
        }
    } else {
        echo "Ошибка выполнения подготовленного запроса.\n";
    }
    $stmt->closeCursor();
} else {
    echo "Ошибка подготовки запроса.\n";
}
?>
```

* **`$pdo->prepare($sql)`:** Подготавливает SQL-запрос к выполнению. Запрос может содержать именованные плейсхолдеры (начинающиеся с `:`), как `:email`, или анонимные плейсхолдеры (`?`).
* **`$stmt->bindParam(':email', $email)`:** Связывает переменную `$email` с именованным плейсхолдером `:email`. Существуют также методы `bindValue()` (связывает значение) и `bindColumn()` (связывает столбец с переменной для выборки).
* **`$stmt->execute()`:** Выполняет подготовленный запрос.
* **`$stmt->fetch()`:** Извлекает результат.

Вы можете выполнять запросы с несколькими параметрами:

```php
<?php
$sql = "SELECT id, name FROM users WHERE age > :min_age AND city = :city";
$stmt = $pdo->prepare($sql);
$minAge = 25;
$city = 'New York';
$stmt->bindParam(':min_age', $minAge, PDO::PARAM_INT); // Указание типа параметра
$stmt->bindParam(':city', $city, PDO::PARAM_STR);
$stmt->execute();

while ($row = $stmt->fetch()) {
    echo "ID: " . $row['id'] . ", Имя: " . $row['name'] . "\n";
}
$stmt->closeCursor();
?>
```

## Выполнение запросов на вставку, обновление и удаление данных

Для выполнения запросов `INSERT`, `UPDATE` и `DELETE` также рекомендуется использовать подготовленные запросы.

```php
<?php
// Вставка данных
$sql = "INSERT INTO users (name, email, age) VALUES (:name, :email, :age)";
$stmt = $pdo->prepare($sql);
$name = 'Jane Doe';
$email = 'jane.doe@example.com';
$age = 28;
$stmt->bindParam(':name', $name);
$stmt->bindParam(':email', $email);
$stmt->bindParam(':age', $age, PDO::PARAM_INT);
$stmt->execute();
$lastInsertId = $pdo->lastInsertId(); // Получение ID последней вставленной записи
echo "Новая запись добавлена с ID: " . $lastInsertId . "\n";

// Обновление данных
$sql = "UPDATE users SET age = :new_age WHERE id = :id";
$stmt = $pdo->prepare($sql);
$newAge = 30;
$id = 1;
$stmt->bindParam(':new_age', $newAge, PDO::PARAM_INT);
$stmt->bindParam(':id', $id, PDO::PARAM_INT);
$stmt->execute();
$rowCount = $stmt->rowCount(); // Получение количества затронутых строк
echo "Обновлено " . $rowCount . " записей.\n";

// Удаление данных
$sql = "DELETE FROM users WHERE email = :email";
$stmt = $pdo->prepare($sql);
$emailToDelete = 'jane.doe@example.com';
$stmt->bindParam(':email', $emailToDelete);
$stmt->execute();
$rowCount = $stmt->rowCount();
echo "Удалено " . $rowCount . " записей.\n";
?>
```

* **`$pdo->lastInsertId()`:** Возвращает ID последней вставленной строки (работает не для всех баз данных).
* **`$stmt->rowCount()`:** Возвращает количество строк, затронутых последним запросом `DELETE`, `INSERT` или `UPDATE`.

## Обработка ошибок

Как было показано в примере подключения, для обработки ошибок PDO использует исключения. Установив атрибут `$options[PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]`, вы заставляете PDO выбрасывать `PDOException` при возникновении ошибок SQL. Это позволяет вам использовать блоки `try...catch` для централизованной обработки ошибок.

## Транзакции

PDO поддерживает транзакции, которые позволяют выполнять несколько SQL-запросов как одну атомарную операцию. Если один из запросов в транзакции завершается неудачно, все изменения могут быть отменены (rollback).

```php
<?php
// ... (код подключения) ...

try {
    $pdo->beginTransaction();

    // Выполнение нескольких запросов
    $stmt1 = $pdo->prepare("UPDATE accounts SET balance = balance - :amount WHERE user_id = :user_from");
    $stmt1->bindParam(':amount', $amount, PDO::PARAM_INT);
    $stmt1->bindParam(':user_from', $userFrom, PDO::PARAM_INT);
    $stmt1->execute();

    $stmt2 = $pdo->prepare("UPDATE accounts SET balance = balance + :amount WHERE user_id = :user_to");
    $stmt2->bindParam(':amount', $amount, PDO::PARAM_INT);
    $stmt2->bindParam(':user_to', $userTo, PDO::PARAM_INT);
    $stmt2->execute();

    // Если все запросы выполнены успешно, фиксируем транзакцию
    $pdo->commit();
    echo "Транзакция успешно выполнена.\n";

} catch (PDOException $e) {
    // Если произошла ошибка, откатываем транзакцию
    $pdo->rollBack();
    echo "Ошибка транзакции: " . $e->getMessage() . "\n";
}
?>
```

* **`$pdo->beginTransaction()`:** Начинает новую транзакцию.
* **`$pdo->commit()`:** Фиксирует все изменения, внесенные в рамках транзакции.
* **`$pdo->rollBack()`:** Отменяет все изменения, внесенные в рамках транзакции.

## Закрытие соединения

После завершения работы с базой данных рекомендуется закрыть соединение, присвоив объекту `$pdo` значение `null`.

```php
<?php
// ... (код работы с базой данных) ...

$pdo = null;
echo "Соединение с базой данных закрыто.\n";
?>
```

PDO является мощным и безопасным способом взаимодействия с базами данных в PHP. Использование подготовленных запросов и обработка ошибок с помощью исключений являются ключевыми аспектами при работе с PDO для создания надежных и безопасных веб-приложений.