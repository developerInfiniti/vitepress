---
title: Работа с файлами в Python
description: Чтение, запись и обработка файлов в Python
---

# Работа с файлами в Python

## Открытие и закрытие файлов

```python
# Рекомендуемый способ — менеджер контекста
with open("file.txt", "r", encoding="utf-8") as f:
    content = f.read()
# Файл автоматически закрывается после выхода из блока with
```

## Режимы открытия

| Режим | Описание |
|-------|----------|
| `r` | Чтение (по умолчанию) |
| `w` | Запись (перезаписывает файл) |
| `a` | Дозапись в конец файла |
| `x` | Создание (ошибка, если файл существует) |
| `b` | Бинарный режим |
| `t` | Текстовый режим (по умолчанию) |

## Чтение файлов

```python
# Чтение всего содержимого
with open("file.txt", "r", encoding="utf-8") as f:
    content = f.read()

# Чтение по строкам
with open("file.txt", "r", encoding="utf-8") as f:
    for line in f:
        print(line.strip())

# Чтение всех строк в список
with open("file.txt", "r", encoding="utf-8") as f:
    lines = f.readlines()

# Чтение определённого количества символов
with open("file.txt", "r", encoding="utf-8") as f:
    chunk = f.read(100)  # первые 100 символов
```

## Запись в файлы

```python
# Запись строки
with open("output.txt", "w", encoding="utf-8") as f:
    f.write("Привет, мир!\n")

# Запись нескольких строк
lines = ["Строка 1\n", "Строка 2\n", "Строка 3\n"]
with open("output.txt", "w", encoding="utf-8") as f:
    f.writelines(lines)

# Дозапись
with open("log.txt", "a", encoding="utf-8") as f:
    f.write("Новая запись в лог\n")
```

## Работа с CSV

```python
import csv

# Чтение CSV
with open("data.csv", "r", encoding="utf-8") as f:
    reader = csv.reader(f)
    header = next(reader)  # заголовок
    for row in reader:
        print(row)

# Чтение как словарь
with open("data.csv", "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(row["name"], row["age"])

# Запись CSV
with open("output.csv", "w", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["name", "age", "city"])
    writer.writerow(["Иван", 30, "Москва"])
    writer.writerow(["Анна", 25, "Киев"])
```

## Работа с JSON файлами

```python
import json

# Чтение JSON
with open("config.json", "r", encoding="utf-8") as f:
    config = json.load(f)

# Запись JSON
data = {"users": [{"name": "Иван", "age": 30}]}
with open("data.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
```

## Работа с путями (pathlib)

```python
from pathlib import Path

# Проверка существования
path = Path("file.txt")
if path.exists():
    print("Файл существует")

# Создание директории
Path("new_folder/subfolder").mkdir(parents=True, exist_ok=True)

# Удаление файла
Path("temp.txt").unlink(missing_ok=True)

# Чтение / запись через pathlib
content = Path("file.txt").read_text(encoding="utf-8")
Path("output.txt").write_text("Данные", encoding="utf-8")

# Получение информации
print(path.name)      # "file.txt"
print(path.stem)      # "file"
print(path.suffix)    # ".txt"
print(path.parent)    # "."
print(path.is_file()) # True
print(path.is_dir())  # False
```

## Работа с бинарными файлами

```python
# Чтение бинарного файла
with open("image.png", "rb") as f:
    data = f.read()

# Запись бинарного файла
with open("copy.png", "wb") as f:
    f.write(data)
```
