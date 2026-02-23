---
title: Обработка исключений в Python
description: Механизм обработки ошибок и исключений в Python
---

# Обработка исключений в Python

## Базовая обработка

```python
try:
    result = 10 / 0
except ZeroDivisionError:
    print("Деление на ноль!")
```

## try / except / else / finally

```python
try:
    value = int(input("Введите число: "))
except ValueError:
    print("Это не число!")
else:
    # Выполняется, если исключения не было
    print(f"Вы ввели: {value}")
finally:
    # Выполняется всегда
    print("Завершение")
```

## Обработка нескольких исключений

```python
try:
    data = {"key": "value"}
    print(data["missing"])
except KeyError:
    print("Ключ не найден")
except TypeError:
    print("Ошибка типа")
except (ValueError, IndexError) as e:
    print(f"Ошибка: {e}")
except Exception as e:
    # Ловит все остальные исключения
    print(f"Непредвиденная ошибка: {e}")
```

## Распространённые исключения

| Исключение | Описание |
|------------|----------|
| `ValueError` | Неверное значение |
| `TypeError` | Неверный тип |
| `KeyError` | Ключ не найден в словаре |
| `IndexError` | Индекс за пределами |
| `FileNotFoundError` | Файл не найден |
| `ZeroDivisionError` | Деление на ноль |
| `AttributeError` | Атрибут не найден |
| `ImportError` | Ошибка импорта |
| `StopIteration` | Итератор исчерпан |
| `PermissionError` | Нет доступа |

## Создание собственных исключений

```python
class ValidationError(Exception):
    """Ошибка валидации данных."""

    def __init__(self, field, message):
        self.field = field
        self.message = message
        super().__init__(f"{field}: {message}")

class NotFoundError(Exception):
    """Ресурс не найден."""
    pass

# Использование
def validate_age(age):
    if not isinstance(age, int):
        raise ValidationError("age", "Должно быть целым числом")
    if age < 0 or age > 150:
        raise ValidationError("age", "Должно быть от 0 до 150")
    return age

try:
    validate_age(-5)
except ValidationError as e:
    print(f"Ошибка валидации — {e}")
    # Ошибка валидации — age: Должно быть от 0 до 150
```

## raise — генерация исключений

```python
def divide(a, b):
    if b == 0:
        raise ValueError("Делитель не может быть нулём")
    return a / b

# Повторная генерация исключения
try:
    result = divide(10, 0)
except ValueError:
    print("Обработка ошибки")
    raise  # пробросить дальше
```

## Менеджеры контекста

```python
class FileManager:
    def __init__(self, filename, mode):
        self.filename = filename
        self.mode = mode
        self.file = None

    def __enter__(self):
        self.file = open(self.filename, self.mode, encoding="utf-8")
        return self.file

    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.file:
            self.file.close()
        return False  # не подавлять исключения

with FileManager("test.txt", "w") as f:
    f.write("Привет!")
```

### contextmanager через декоратор

```python
from contextlib import contextmanager

@contextmanager
def timer(label):
    import time
    start = time.time()
    yield
    elapsed = time.time() - start
    print(f"{label}: {elapsed:.4f} сек")

with timer("Операция"):
    sum(range(1_000_000))
# Операция: 0.0xxx сек
```
