# Функции MySQL

## Введение в функции MySQL

[Скачать PDF](./functions.pdf)

Функции в MySQL позволяют выполнять вычисления, манипулировать данными и форматировать результаты запросов. MySQL предоставляет множество встроенных функций, которые можно использовать в SQL-запросах.

## Строковые функции

### CONCAT

Объединяет две или более строки.

```sql
SELECT CONCAT('Hello', ' ', 'World') AS greeting;
-- Результат: Hello World
```

### LENGTH

Возвращает длину строки в байтах.

```sql
SELECT LENGTH('Hello') AS length;
-- Результат: 5
```

### CHAR_LENGTH

Возвращает длину строки в символах.

```sql
SELECT CHAR_LENGTH('Привет') AS length;
-- Результат: 6
```

### SUBSTRING

Извлекает подстроку из строки.

```sql
SELECT SUBSTRING('Hello World', 7, 5) AS substring;
-- Результат: World
```

### REPLACE

Заменяет все вхождения подстроки в строке.

```sql
SELECT REPLACE('Hello World', 'World', 'MySQL') AS replaced;
-- Результат: Hello MySQL
```

### UPPER и LOWER

Преобразуют строку в верхний или нижний регистр.

```sql
SELECT UPPER('hello') AS upper_case, LOWER('WORLD') AS lower_case;
-- Результат: HELLO, world
```

### TRIM

Удаляет пробелы или другие символы с начала и конца строки.

```sql
SELECT TRIM('  Hello  ') AS trimmed;
-- Результат: Hello
```

## Числовые функции

### ABS

Возвращает абсолютное значение числа.

```sql
SELECT ABS(-10) AS absolute;
-- Результат: 10
```

### ROUND

Округляет число до указанного количества десятичных знаков.

```sql
SELECT ROUND(3.14159, 2) AS rounded;
-- Результат: 3.14
```

### CEILING и FLOOR

Округляют число до ближайшего большего или меньшего целого числа.

```sql
SELECT CEILING(3.14) AS ceiling, FLOOR(3.14) AS floor;
-- Результат: 4, 3
```

### POWER

Возводит число в указанную степень.

```sql
SELECT POWER(2, 3) AS power;
-- Результат: 8
```

### SQRT

Вычисляет квадратный корень числа.

```sql
SELECT SQRT(16) AS square_root;
-- Результат: 4
```

### RAND

Генерирует случайное число в диапазоне от 0 до 1.

```sql
SELECT RAND() AS random;
-- Результат: случайное число между 0 и 1
```

## Функции даты и времени

### NOW

Возвращает текущую дату и время.

```sql
SELECT NOW() AS current_datetime;
-- Результат: 2023-05-15 14:30:45
```

### CURDATE и CURTIME

Возвращают текущую дату или время.

```sql
SELECT CURDATE() AS current_date, CURTIME() AS current_time;
-- Результат: 2023-05-15, 14:30:45
```

### DATE_FORMAT

Форматирует дату в соответствии с указанным форматом.

```sql
SELECT DATE_FORMAT(NOW(), '%d.%m.%Y %H:%i:%s') AS formatted_date;
-- Результат: 15.05.2023 14:30:45
```

### DATE_ADD и DATE_SUB

Добавляют или вычитают интервал из даты.

```sql
SELECT DATE_ADD(NOW(), INTERVAL 1 DAY) AS tomorrow;
-- Результат: дата и время на 1 день вперед

SELECT DATE_SUB(NOW(), INTERVAL 1 MONTH) AS last_month;
-- Результат: дата и время на 1 месяц назад
```

### DATEDIFF

Вычисляет разницу в днях между двумя датами.

```sql
SELECT DATEDIFF('2023-05-15', '2023-05-01') AS days_difference;
-- Результат: 14
```

### EXTRACT

Извлекает часть даты или времени.

```sql
SELECT EXTRACT(YEAR FROM NOW()) AS year, EXTRACT(MONTH FROM NOW()) AS month;
-- Результат: 2023, 5
```

## Агрегатные функции

### COUNT

Подсчитывает количество строк или значений.

```sql
SELECT COUNT(*) AS total_rows FROM users;
-- Результат: количество строк в таблице users
```

### SUM

Вычисляет сумму значений.

```sql
SELECT SUM(price) AS total_price FROM products;
-- Результат: сумма всех цен в таблице products
```

### AVG

Вычисляет среднее значение.

```sql
SELECT AVG(age) AS average_age FROM users;
-- Результат: среднее значение возраста в таблице users
```

### MIN и MAX

Находят минимальное или максимальное значение.

```sql
SELECT MIN(price) AS min_price, MAX(price) AS max_price FROM products;
-- Результат: минимальная и максимальная цена в таблице products
```

### GROUP_CONCAT

Объединяет значения из группы строк в одну строку.

```sql
SELECT category_id, GROUP_CONCAT(name) AS product_names FROM products GROUP BY category_id;
-- Результат: список имен продуктов для каждой категории
```

## Условные функции

### IF

Возвращает одно значение, если условие истинно, и другое значение, если условие ложно.

```sql
SELECT name, IF(price > 100, 'Дорогой', 'Дешевый') AS price_category FROM products;
-- Результат: имя продукта и его категория цены
```

### IFNULL

Возвращает первое значение, если оно не NULL, иначе возвращает второе значение.

```sql
SELECT IFNULL(phone, 'Не указан') AS contact FROM users;
-- Результат: номер телефона или 'Не указан', если телефон NULL
```

### CASE

Выполняет условную логику с несколькими условиями.

```sql
SELECT name,
       CASE
           WHEN price < 50 THEN 'Бюджетный'
           WHEN price BETWEEN 50 AND 100 THEN 'Средний'
           ELSE 'Премиум'
       END AS category
FROM products;
-- Результат: имя продукта и его ценовая категория
```

## Функции шифрования и хеширования

### MD5

Вычисляет MD5-хеш строки.

```sql
SELECT MD5('password') AS md5_hash;
-- Результат: MD5-хеш строки 'password'
```

### SHA1 и SHA2

Вычисляют SHA-1 или SHA-2 хеш строки.

```sql
SELECT SHA1('password') AS sha1_hash;
-- Результат: SHA-1 хеш строки 'password'

SELECT SHA2('password', 256) AS sha256_hash;
-- Результат: SHA-256 хеш строки 'password'
```

### ENCRYPT

Шифрует строку (доступно не на всех платформах).

```sql
SELECT ENCRYPT('text', 'salt') AS encrypted;
-- Результат: зашифрованная строка
```

## Заключение

Это лишь небольшая часть функций, доступных в MySQL. Использование функций может значительно упростить работу с данными и повысить эффективность запросов. Для получения более подробной информации о функциях MySQL рекомендуется обратиться к официальной документации.