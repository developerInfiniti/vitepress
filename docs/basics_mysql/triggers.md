# Триггеры в MySQL

## Что такое триггеры?

[Скачать PDF](./triggers.pdf)

Триггер в MySQL — это специальная хранимая процедура, которая автоматически выполняется при возникновении определенного события в таблице базы данных. Триггеры могут выполняться до или после операций INSERT, UPDATE или DELETE.

## Зачем нужны триггеры?

- **Автоматизация действий**: триггеры позволяют автоматически выполнять действия при изменении данных.
- **Обеспечение целостности данных**: триггеры могут проверять и корректировать данные перед их сохранением.
- **Аудит изменений**: триггеры могут записывать информацию об изменениях в отдельную таблицу аудита.
- **Каскадное обновление**: триггеры могут автоматически обновлять связанные таблицы.

## Синтаксис создания триггера

```sql
CREATE TRIGGER trigger_name
{BEFORE | AFTER} {INSERT | UPDATE | DELETE}
ON table_name
FOR EACH ROW
[trigger_body]
```

### Параметры триггера

- **trigger_name**: имя триггера, должно быть уникальным в пределах базы данных.
- **BEFORE | AFTER**: определяет, когда триггер будет выполняться — до или после события.
- **INSERT | UPDATE | DELETE**: тип события, которое активирует триггер.
- **table_name**: имя таблицы, к которой привязан триггер.
- **FOR EACH ROW**: указывает, что триггер выполняется для каждой строки, затронутой событием.
- **trigger_body**: SQL-операторы, которые выполняются при срабатывании триггера.

## Типы триггеров

### BEFORE триггеры

Выполняются до выполнения операции. Могут использоваться для проверки и модификации данных перед их сохранением.

```sql
CREATE TRIGGER before_insert_users
BEFORE INSERT ON users
FOR EACH ROW
BEGIN
    -- Преобразование email в нижний регистр
    SET NEW.email = LOWER(NEW.email);
    
    -- Установка даты создания
    SET NEW.created_at = NOW();
END;
```

### AFTER триггеры

Выполняются после выполнения операции. Могут использоваться для обновления других таблиц или записи информации об изменениях.

```sql
CREATE TRIGGER after_insert_orders
AFTER INSERT ON orders
FOR EACH ROW
BEGIN
    -- Обновление статистики пользователя
    UPDATE user_stats
    SET order_count = order_count + 1,
        total_spent = total_spent + NEW.total_amount
    WHERE user_id = NEW.user_id;
    
    -- Запись в журнал аудита
    INSERT INTO audit_log (action, table_name, record_id, user_id, action_time)
    VALUES ('INSERT', 'orders', NEW.id, NEW.user_id, NOW());
END;
```

## Специальные переменные в триггерах

### NEW и OLD

В триггерах можно использовать специальные переменные NEW и OLD для доступа к значениям полей до и после изменения:

- **NEW**: содержит новые значения строки для операций INSERT и UPDATE.
- **OLD**: содержит старые значения строки для операций UPDATE и DELETE.

```sql
CREATE TRIGGER before_update_products
BEFORE UPDATE ON products
FOR EACH ROW
BEGIN
    -- Запись изменения цены в журнал
    IF NEW.price != OLD.price THEN
        INSERT INTO price_changes (product_id, old_price, new_price, change_date)
        VALUES (OLD.id, OLD.price, NEW.price, NOW());
    END IF;
END;
```

## Примеры использования триггеров

### Проверка данных перед вставкой

```sql
CREATE TRIGGER check_age_before_insert
BEFORE INSERT ON users
FOR EACH ROW
BEGIN
    IF NEW.age < 18 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Пользователь должен быть старше 18 лет';
    END IF;
END;
```

### Каскадное удаление

```sql
CREATE TRIGGER cascade_delete_user_orders
AFTER DELETE ON users
FOR EACH ROW
BEGIN
    DELETE FROM orders WHERE user_id = OLD.id;
END;
```

### Аудит изменений

```sql
CREATE TRIGGER audit_products_update
AFTER UPDATE ON products
FOR EACH ROW
BEGIN
    INSERT INTO product_audit (product_id, field_name, old_value, new_value, change_date)
    SELECT OLD.id, column_name, OLD.column_value, NEW.column_value, NOW()
    FROM (
        SELECT 'name' AS column_name, OLD.name AS old_value, NEW.name AS new_value
        UNION ALL
        SELECT 'price', OLD.price, NEW.price
        UNION ALL
        SELECT 'description', OLD.description, NEW.description
    ) AS changes
    WHERE old_value != new_value OR (old_value IS NULL AND new_value IS NOT NULL) OR (old_value IS NOT NULL AND new_value IS NULL);
END;
```

### Автоматическое обновление временных меток

```sql
CREATE TRIGGER update_timestamp
BEFORE UPDATE ON table_name
FOR EACH ROW
BEGIN
    SET NEW.updated_at = NOW();
END;
```

## Управление триггерами

### Просмотр триггеров

```sql
-- Просмотр всех триггеров в базе данных
SHOW TRIGGERS;

-- Просмотр триггеров для конкретной таблицы
SHOW TRIGGERS LIKE 'table_name';

-- Просмотр триггеров через information_schema
SELECT * FROM information_schema.TRIGGERS WHERE TRIGGER_SCHEMA = 'database_name';
```

### Удаление триггера

```sql
DROP TRIGGER trigger_name;
```

Или с проверкой существования:

```sql
DROP TRIGGER IF EXISTS trigger_name;
```

## Ограничения триггеров

- Триггер не может вызывать хранимые процедуры, которые возвращают результаты клиенту.
- Триггер не может начинать или завершать транзакции (COMMIT, ROLLBACK и т.д.).
- Триггер не может возвращать результаты клиенту.
- Триггеры могут вызывать проблемы с производительностью при большом количестве операций.

## Лучшие практики использования триггеров

- **Используйте триггеры с осторожностью**: триггеры могут усложнить отладку и понимание логики приложения.
- **Документируйте триггеры**: хорошо документируйте назначение и логику работы каждого триггера.
- **Избегайте сложной логики в триггерах**: сложная логика может негативно сказаться на производительности.
- **Учитывайте порядок выполнения триггеров**: если у таблицы есть несколько триггеров одного типа, учитывайте порядок их выполнения.
- **Тестируйте триггеры**: тщательно тестируйте триггеры, особенно в сценариях с большим объемом данных.

## Заключение

Триггеры в MySQL являются мощным инструментом для автоматизации действий и обеспечения целостности данных. Однако, их следует использовать с осторожностью, учитывая возможное влияние на производительность и сложность отладки. Правильно спроектированные и реализованные триггеры могут значительно упростить работу с базой данных и повысить надежность приложения.