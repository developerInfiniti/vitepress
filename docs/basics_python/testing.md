---
title: Тестирование в Python
description: Модульное тестирование с unittest и pytest
---

# Тестирование в Python

## unittest — стандартная библиотека

```python
import unittest

def add(a, b):
    return a + b

class TestAdd(unittest.TestCase):
    def test_positive_numbers(self):
        self.assertEqual(add(2, 3), 5)

    def test_negative_numbers(self):
        self.assertEqual(add(-1, -1), -2)

    def test_zero(self):
        self.assertEqual(add(0, 0), 0)

if __name__ == "__main__":
    unittest.main()
```

### Методы assert

```python
class TestExamples(unittest.TestCase):
    def test_assertions(self):
        self.assertEqual(1 + 1, 2)
        self.assertNotEqual(1, 2)
        self.assertTrue(True)
        self.assertFalse(False)
        self.assertIsNone(None)
        self.assertIsNotNone("value")
        self.assertIn(3, [1, 2, 3])
        self.assertNotIn(4, [1, 2, 3])
        self.assertIsInstance("hello", str)
        self.assertAlmostEqual(3.14, 3.14159, places=1)

    def test_exception(self):
        with self.assertRaises(ZeroDivisionError):
            1 / 0
```

### setUp и tearDown

```python
class TestDatabase(unittest.TestCase):
    def setUp(self):
        """Выполняется перед каждым тестом."""
        self.db = {"users": []}

    def tearDown(self):
        """Выполняется после каждого теста."""
        self.db.clear()

    def test_add_user(self):
        self.db["users"].append("Иван")
        self.assertEqual(len(self.db["users"]), 1)

    def test_empty_db(self):
        self.assertEqual(len(self.db["users"]), 0)
```

## pytest — популярный фреймворк

### Установка

```bash
pip install pytest
```

### Базовые тесты

```python
# test_math.py
def add(a, b):
    return a + b

def test_add_positive():
    assert add(2, 3) == 5

def test_add_negative():
    assert add(-1, -1) == -2

def test_add_strings():
    assert add("hello ", "world") == "hello world"
```

```bash
# Запуск тестов
pytest
pytest test_math.py
pytest -v  # подробный вывод
```

### Параметризованные тесты

```python
import pytest

@pytest.mark.parametrize("a, b, expected", [
    (2, 3, 5),
    (-1, 1, 0),
    (0, 0, 0),
    (100, 200, 300),
])
def test_add(a, b, expected):
    assert add(a, b) == expected
```

### Фикстуры

```python
import pytest

@pytest.fixture
def sample_list():
    return [1, 2, 3, 4, 5]

@pytest.fixture
def db_connection():
    conn = create_connection()
    yield conn  # тест выполняется здесь
    conn.close()  # очистка

def test_list_length(sample_list):
    assert len(sample_list) == 5

def test_list_sum(sample_list):
    assert sum(sample_list) == 15
```

### Проверка исключений

```python
import pytest

def divide(a, b):
    if b == 0:
        raise ValueError("Делитель не может быть нулём")
    return a / b

def test_divide_by_zero():
    with pytest.raises(ValueError, match="нулём"):
        divide(10, 0)
```

### Маркеры

```python
import pytest

@pytest.mark.slow
def test_heavy_computation():
    result = sum(range(10_000_000))
    assert result > 0

@pytest.mark.skip(reason="Ещё не реализовано")
def test_future_feature():
    pass

@pytest.mark.skipif(
    condition=True,
    reason="Не поддерживается на данной платформе"
)
def test_platform_specific():
    pass
```

```bash
# Запуск только определённых маркеров
pytest -m slow
pytest -m "not slow"
```

## Mock — подмена объектов

```python
from unittest.mock import Mock, patch, MagicMock

# Простой мок
mock_api = Mock()
mock_api.get_user.return_value = {"name": "Иван"}
print(mock_api.get_user(1))  # {"name": "Иван"}

# patch — подмена модулей
def get_data():
    import requests
    response = requests.get("https://api.example.com/data")
    return response.json()

@patch("requests.get")
def test_get_data(mock_get):
    mock_get.return_value.json.return_value = {"status": "ok"}
    result = get_data()
    assert result == {"status": "ok"}
    mock_get.assert_called_once()
```

## Запуск тестов

```bash
# pytest
pytest                     # все тесты
pytest -v                  # подробный вывод
pytest -x                  # остановиться на первой ошибке
pytest --tb=short          # краткий traceback
pytest -k "test_add"       # тесты по имени
pytest --cov=mypackage     # покрытие кода (нужен pytest-cov)

# unittest
python -m unittest discover
python -m unittest test_module.TestClass.test_method
```
