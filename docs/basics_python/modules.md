---
title: Модули и пакеты Python
description: Организация кода с помощью модулей и пакетов в Python
---

# Модули и пакеты Python

## Что такое модуль?

Модуль — это файл с расширением `.py`, содержащий определения и инструкции Python.

```python
# mymodule.py
def greet(name):
    return f"Привет, {name}!"

PI = 3.14159
```

## Импорт модулей

```python
# Импорт всего модуля
import mymodule
print(mymodule.greet("Мир"))

# Импорт конкретных элементов
from mymodule import greet, PI
print(greet("Мир"))

# Импорт с псевдонимом
import mymodule as mm
print(mm.greet("Мир"))

from mymodule import greet as hello
print(hello("Мир"))
```

## Пакеты

Пакет — это каталог с файлом `__init__.py`, содержащий модули.

```
mypackage/
    __init__.py
    utils.py
    models.py
    services/
        __init__.py
        auth.py
        email.py
```

```python
# Импорт из пакета
from mypackage import utils
from mypackage.models import User
from mypackage.services.auth import login
```

### `__init__.py`

```python
# mypackage/__init__.py
from .utils import helper_function
from .models import User

__all__ = ["helper_function", "User"]
```

## Стандартная библиотека

### os — работа с ОС

```python
import os

# Текущая директория
cwd = os.getcwd()

# Список файлов
files = os.listdir(".")

# Переменные окружения
home = os.environ.get("HOME")

# Работа с путями
path = os.path.join("folder", "file.txt")
exists = os.path.exists(path)
```

### pathlib — современная работа с путями

```python
from pathlib import Path

# Текущая директория
cwd = Path.cwd()

# Создание пути
config = Path.home() / ".config" / "app.json"

# Чтение файла
content = Path("data.txt").read_text(encoding="utf-8")

# Поиск файлов
py_files = list(Path(".").glob("**/*.py"))
```

### json — работа с JSON

```python
import json

# Сериализация
data = {"name": "Иван", "age": 30}
json_str = json.dumps(data, ensure_ascii=False, indent=2)

# Десериализация
parsed = json.loads(json_str)

# Работа с файлами
with open("data.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

with open("data.json", "r", encoding="utf-8") as f:
    loaded = json.load(f)
```

### datetime — дата и время

```python
from datetime import datetime, timedelta

# Текущая дата и время
now = datetime.now()
print(now.strftime("%d.%m.%Y %H:%M"))

# Парсинг строки
dt = datetime.strptime("25.12.2024", "%d.%m.%Y")

# Арифметика дат
tomorrow = now + timedelta(days=1)
week_ago = now - timedelta(weeks=1)
```

### collections — специализированные коллекции

```python
from collections import Counter, defaultdict, deque

# Counter — подсчёт элементов
words = ["яблоко", "банан", "яблоко", "вишня", "банан", "яблоко"]
count = Counter(words)
print(count.most_common(2))  # [("яблоко", 3), ("банан", 2)]

# defaultdict — словарь с значением по умолчанию
groups = defaultdict(list)
for name, group in [("Иван", "A"), ("Анна", "B"), ("Пётр", "A")]:
    groups[group].append(name)
# {"A": ["Иван", "Пётр"], "B": ["Анна"]}

# deque — двусторонняя очередь
d = deque([1, 2, 3])
d.appendleft(0)
d.append(4)
# deque([0, 1, 2, 3, 4])
```

## Виртуальные окружения

```bash
# Создание
python -m venv venv

# Активация (Linux/macOS)
source venv/bin/activate

# Активация (Windows)
venv\Scripts\activate

# Установка пакетов
pip install requests flask

# Сохранение зависимостей
pip freeze > requirements.txt

# Установка из файла
pip install -r requirements.txt

# Деактивация
deactivate
```

## pip — менеджер пакетов

```bash
# Установка пакета
pip install requests

# Установка определённой версии
pip install requests==2.31.0

# Обновление пакета
pip install --upgrade requests

# Удаление пакета
pip uninstall requests

# Список установленных пакетов
pip list
```
