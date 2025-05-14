# Основы PHP: Работа с MySQL (mysqli)

`mysqli_` — это расширение PHP, разработанное для обеспечения доступа к базам данных MySQL, начиная с версии 4.1.13 и новее. Оно предлагает ряд преимуществ по сравнению с устаревшим расширением `mysql_`, включая поддержку подготовленных запросов, улучшенную безопасность и расширенные возможности.

**Важно:** Хотя `mysqli_` является улучшением по сравнению с `mysql_`, PDO по-прежнему рекомендуется для новых проектов из-за его абстрактного уровня доступа к данным, что облегчает переключение между различными СУБД.

## Подключение к серверу MySQL

Первым шагом является установление соединения с сервером MySQL с помощью функции `mysqli_connect()`.

```php
<?php
$host = 'localhost';
$user = 'myuser';
$password = 'mypassword';
$database = 'mydatabase';

$conn = mysqli_connect($host, $user, $password, $database);

// Проверка соединения
if (!$conn) {
    die("Ошибка подключения к MySQL: " . mysqli_connect_error());
}

echo "Успешно подключено к MySQL!\n";

// Не забудьте закрыть соединение в конце скрипта: mysqli_close($conn);
?>
```

* **`mysqli_connect($host, $user, $password, $database)`:** Пытается установить соединение с сервером MySQL. Возвращает объект соединения (`mysqli`) в случае успеха или `false` в случае ошибки.
* **`mysqli_connect_error()`:** Возвращает строку с описанием последней ошибки подключения, если таковая была.
* **`die()`:** Выводит сообщение и завершает выполнение текущего скрипта.
* **`mysqli_close($conn)`:** Закрывает установленное соединение с сервером MySQL. Рекомендуется закрывать соединение после завершения работы с базой данных для освобождения ресурсов.

## Выполнение SQL-запросов

После установления соединения вы можете выполнять SQL-запросы с помощью функции `mysqli_query()`.

### Выполнение простых запросов

```php
<?php
// ... (код подключения) ...

$sql = "SELECT id, name, email FROM users";
$result = mysqli_query($conn, $sql);

if ($result) {
    // Получение количества строк в результате
    $row_count = mysqli_num_rows($result);
    echo "Найдено " . $row_count . " пользователей:\n";

    // Извлечение результатов
    while ($row = mysqli_fetch_assoc($result)) {
        echo "ID: " . $row['id'] . ", Имя: " . $row['name'] . ", Email: " . $row['email'] . "\n";
    }

    // Освобождение результирующего набора
    mysqli_free_result($result);
} else {
    echo "Ошибка выполнения запроса: " . mysqli_error($conn) . "\n";
}

mysqli_close($conn);
?>
```

* **`mysqli_query($conn, $sql)`:** Выполняет SQL-запрос на сервере, используя установленное соединение `$conn`. Возвращает объект результата (`mysqli_result`) в случае успешного выполнения `SELECT`, `SHOW`, `DESCRIBE` или `EXPLAIN` запросов, `true` для других успешных запросов (`INSERT`, `UPDATE`, `DELETE`) или `false` в случае ошибки.
* **`mysqli_num_rows($result)`:** Возвращает количество строк в результирующем наборе (`mysqli_result`). Используется только для `SELECT` запросов.
* **`mysqli_fetch_assoc($result)`:** Извлекает одну строку результата в виде ассоциативного массива (где ключами являются имена столбцов). Существуют также `mysqli_fetch_row()` (числовой массив) и `mysqli_fetch_array()` (ассоциативный и числовой массив).
* **`mysqli_free_result($result)`:** Освобождает память, занятую результирующим набором. Рекомендуется делать это после обработки всех строк.
* **`mysqli_error($conn)`:** Возвращает строку с описанием последней ошибки, возникшей при выполнении MySQL-запроса для указанного соединения.

### Подготовленные запросы (`mysqli_prepare()`, `mysqli_stmt_bind_param()`, `mysqli_stmt_execute()`, `mysqli_stmt_get_result()`)

Как и в PDO, подготовленные запросы в `mysqli_` являются важным инструментом для безопасной работы с базами данных, особенно при обработке пользовательского ввода.

```php
<?php
// ... (код подключения) ...

$sql = "SELECT id, name FROM users WHERE email = ?";
$stmt = mysqli_prepare($conn, $sql);

if ($stmt) {
    $email = 'john.doe@example.com';

    // Привязка параметров к подготовленному запросу
    mysqli_stmt_bind_param($stmt, 's', $email); // 's' означает string, 'i' - integer, 'd' - double, 'b' - blob

    // Выполнение подготовленного запроса
    mysqli_stmt_execute($stmt);

    // Получение результата
    $result = mysqli_stmt_get_result($stmt);

    if ($result) {
        if ($row = mysqli_fetch_assoc($result)) {
            echo "ID: " . $row['id'] . ", Имя: " . $row['name'] . "\n";
        } else {
            echo "Пользователь с таким email не найден.\n";
        }
        mysqli_free_result($result);
    } else {
        echo "Ошибка получения результата: " . mysqli_stmt_error($stmt) . "\n";
    }

    // Закрытие подготовленного запроса
    mysqli_stmt_close($stmt);
} else {
    echo "Ошибка подготовки запроса: " . mysqli_error($conn) . "\n";
}

mysqli_close($conn);
?>
```

* **`mysqli_prepare($conn, $sql)`:** Подготавливает SQL-запрос к выполнению. Запрос может содержать анонимные плейсхолдеры (`?`). Возвращает объект подготовленного запроса (`mysqli_stmt`) в случае успеха или `false` в случае ошибки.
* **`mysqli_stmt_bind_param($stmt, $types, ...$vars)`:** Связывает переменные с плейсхолдерами в подготовленном запросе. `$types` — это строка, содержащая типы данных для каждого параметра ('s' для string, 'i' для integer, 'd' для double, 'b' для blob).
* **`mysqli_stmt_execute($stmt)`:** Выполняет подготовленный запрос. Возвращает `true` в случае успеха или `false` в случае ошибки.
* **`mysqli_stmt_get_result($stmt)`:** Получает результирующий набор из выполненного подготовленного запроса `SELECT`. Возвращает объект результата (`mysqli_result`) или `false` в случае ошибки.
* **`mysqli_stmt_error($stmt)`:** Возвращает строку с описанием последней ошибки, возникшей при работе с подготовленным запросом.
* **`mysqli_stmt_close($stmt)`:** Закрывает подготовленный запрос.

## Выполнение запросов на вставку, обновление и удаление данных с использованием подготовленных запросов

```php
<?php
// ... (код подключения) ...

// Вставка данных
$sql = "INSERT INTO users (name, email, age) VALUES (?, ?, ?)";
$stmt = mysqli_prepare($conn, $sql);
if ($stmt) {
    $name = 'Jane Doe';
    $email = 'jane.doe@example.com';
    $age = 28;
    mysqli_stmt_bind_param($stmt, 'ssi', $name, $email, $age);
    mysqli_stmt_execute($stmt);
    $affected_rows = mysqli_stmt_affected_rows($stmt);
    $last_insert_id = mysqli_insert_id($conn);
    echo "Добавлено " . $affected_rows . " записей, ID последней записи: " . $last_insert_id . "\n";
    mysqli_stmt_close($stmt);
}

// Обновление данных
$sql = "UPDATE users SET age = ? WHERE id = ?";
$stmt = mysqli_prepare($conn, $sql);
if ($stmt) {
    $new_age = 30;
    $id = 1;
    mysqli_stmt_bind_param($stmt, 'ii', $new_age, $id);
    mysqli_stmt_execute($stmt);
    $affected_rows = mysqli_stmt_affected_rows($stmt);
    echo "Обновлено " . $affected_rows . " записей.\n";
    mysqli_stmt_close($stmt);
}

// Удаление данных
$sql = "DELETE FROM users WHERE email = ?";
$stmt = mysqli_prepare($conn, $sql);
if ($stmt) {
    $email_to_delete = 'jane.doe@example.com';
    mysqli_stmt_bind_param($stmt, 's', $email_to_delete);
    mysqli_stmt_execute($stmt);
    $affected_rows = mysqli_stmt_affected_rows($stmt);
    echo "Удалено " . $affected_rows . " записей.\n";
    mysqli_stmt_close($stmt);
}

mysqli_close($conn);
?>
```

* **`mysqli_stmt_affected_rows($stmt)`:** Возвращает количество строк, затронутых последним запросом `INSERT`, `UPDATE` или `DELETE`, выполненным подготовленным запросом.
* **`mysqli_insert_id($conn)`:** Возвращает ID последней вставленной строки для указанного соединения.

## Обработка ошибок

При работе с `mysqli_`, ошибки обычно проверяются после каждой операции. Функции, такие как `mysqli_error()` и `mysqli_stmt_error()`, возвращают описание последней ошибки. Рекомендуется всегда проверять результат выполнения SQL-запросов и обрабатывать ошибки соответствующим образом.

## Транзакции

`mysqli_` также поддерживает транзакции.

```php
<?php
// ... (код подключения) ...

mysqli_begin_transaction($conn);

try {
    // Выполнение нескольких запросов
    mysqli_query($conn, "UPDATE accounts SET balance = balance - 100 WHERE user_id = 1");
    mysqli_query($conn, "UPDATE accounts SET balance = balance + 100 WHERE user_id = 2");

    // Фиксация транзакции
    mysqli_commit($conn);
    echo "Транзакция успешно выполнена.\n";

} catch (Exception $e) {
    // Откат транзакции в случае ошибки
    mysqli_rollback($conn);
    echo "Ошибка транзакции: " . mysqli_error($conn) . "\n";
}

mysqli_close($conn);
?>
```

* **`mysqli_begin_transaction($conn)`:** Начинает новую транзакцию.
* **`mysqli_commit($conn)`:** Фиксирует транзакцию.
* **`mysqli_rollback($conn)`:** Откатывает транзакцию.

## Закрытие соединения

После завершения работы с базой данных обязательно закройте соединение с помощью `mysqli_close($conn)`.

Хотя `mysqli_` предоставляет более безопасный и функциональный способ работы с MySQL по сравнению с `mysql_`, помните, что PDO предлагает еще более высокий уровень абстракции и переносимости между различными СУБД. Для новых проектов рекомендуется рассмотреть использование PDO.