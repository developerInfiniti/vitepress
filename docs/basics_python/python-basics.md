---
title: Основы Python
description: Базовые концепции языка Python
---

# Основы Python

## Что такое Python?

Python — высокоуровневый интерпретируемый язык программирования с динамической типизацией. Используется в веб-разработке, анализе данных, машинном обучении, автоматизации и других областях.

## Установка и запуск

```bash
# Проверка версии
python --version

# Запуск скрипта
python main.py

# Интерактивный режим
python
```

## Переменные и типы данных

```python
# Числа
age = 25              # int
price = 19.99         # float
complex_num = 3 + 4j  # complex

# Строки
name = "Python"
multiline = """Многострочная
строка"""

# Логический тип
is_active = True
is_empty = False

# None
result = None
```

## Преобразование типов

```python
x = int("42")       # str -> int
y = float("3.14")   # str -> float
s = str(100)         # int -> str
b = bool(1)          # int -> bool (True)
```

## Операторы

```python
# Арифметические
a = 10 + 3   # 13
b = 10 - 3   # 7
c = 10 * 3   # 30
d = 10 / 3   # 3.3333...
e = 10 // 3  # 3 (целочисленное деление)
f = 10 % 3   # 1 (остаток)
g = 10 ** 3  # 1000 (возведение в степень)

# Сравнения
x = 5 == 5   # True
y = 5 != 3   # True
z = 5 > 3    # True

# Логические
result = True and False  # False
result = True or False   # True
result = not True        # False
```

## Управляющие конструкции

### if / elif / else

```python
score = 85

if score >= 90:
    print("Отлично")
elif score >= 70:
    print("Хорошо")
else:
    print("Нужно подтянуть")
```

### Циклы

```python
# for
for i in range(5):
    print(i)  # 0, 1, 2, 3, 4

for item in ["a", "b", "c"]:
    print(item)

# while
count = 0
while count < 3:
    print(count)
    count += 1

# break и continue
for i in range(10):
    if i == 3:
        continue  # пропустить
    if i == 7:
        break     # выйти из цикла
    print(i)
```

## Ввод и вывод

```python
# Вывод
print("Привет, мир!")
print(f"Имя: {name}, Возраст: {age}")

# Ввод
user_input = input("Введите имя: ")
```

## Импорты

```python
import os
import sys
from datetime import datetime
from collections import defaultdict
```

## Форматирование строк

```python
name = "Python"
version = 3.12

# f-строки (рекомендуется)
print(f"Язык: {name}, версия: {version}")

# format()
print("Язык: {}, версия: {}".format(name, version))

# % оператор
print("Язык: %s, версия: %.1f" % (name, version))
```
