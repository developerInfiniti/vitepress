---
title: Структуры данных Python
description: Списки, кортежи, словари, множества в Python
---

# Структуры данных Python

## Списки (list)

Изменяемая упорядоченная коллекция элементов.

```python
# Создание
fruits = ["яблоко", "банан", "вишня"]
numbers = [1, 2, 3, 4, 5]
mixed = [1, "два", 3.0, True]

# Доступ по индексу
print(fruits[0])   # "яблоко"
print(fruits[-1])  # "вишня"

# Срезы
print(numbers[1:3])   # [2, 3]
print(numbers[:2])    # [1, 2]
print(numbers[::2])   # [1, 3, 5]
```

### Методы списков

```python
fruits = ["яблоко", "банан"]

fruits.append("вишня")         # добавить в конец
fruits.insert(0, "апельсин")   # вставить по индексу
fruits.extend(["киви", "манго"])  # расширить
fruits.remove("банан")         # удалить по значению
last = fruits.pop()            # удалить и вернуть последний
fruits.sort()                  # сортировка на месте
fruits.reverse()               # обратный порядок
count = fruits.count("яблоко") # количество вхождений
idx = fruits.index("яблоко")   # индекс элемента
```

### List comprehension

```python
squares = [x ** 2 for x in range(10)]
# [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

evens = [x for x in range(20) if x % 2 == 0]
# [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]

matrix = [[i * j for j in range(3)] for i in range(3)]
# [[0, 0, 0], [0, 1, 2], [0, 2, 4]]
```

## Кортежи (tuple)

Неизменяемая упорядоченная коллекция.

```python
# Создание
point = (10, 20)
single = (42,)  # запятая обязательна для одного элемента
colors = ("красный", "зелёный", "синий")

# Распаковка
x, y = point
print(x)  # 10

# Именованные кортежи
from collections import namedtuple

Point = namedtuple("Point", ["x", "y"])
p = Point(10, 20)
print(p.x, p.y)  # 10 20
```

## Словари (dict)

Изменяемая коллекция пар ключ-значение.

```python
# Создание
user = {
    "name": "Иван",
    "age": 30,
    "city": "Москва"
}

# Доступ
print(user["name"])          # "Иван"
print(user.get("email"))     # None (без ошибки)
print(user.get("email", "")) # "" (значение по умолчанию)
```

### Методы словарей

```python
user = {"name": "Иван", "age": 30}

user["email"] = "ivan@mail.ru"  # добавить/обновить
del user["age"]                  # удалить ключ
user.update({"city": "Москва"})  # обновить несколько

keys = user.keys()       # ключи
values = user.values()   # значения
items = user.items()     # пары (ключ, значение)
user.pop("email")        # удалить и вернуть

# Итерация
for key, value in user.items():
    print(f"{key}: {value}")
```

### Dict comprehension

```python
squares = {x: x ** 2 for x in range(5)}
# {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}

filtered = {k: v for k, v in user.items() if v is not None}
```

## Множества (set)

Неупорядоченная коллекция уникальных элементов.

```python
# Создание
colors = {"красный", "зелёный", "синий"}
numbers = set([1, 2, 2, 3, 3])  # {1, 2, 3}

# Операции
colors.add("жёлтый")
colors.remove("красный")  # KeyError если нет
colors.discard("чёрный")  # без ошибки если нет

# Операции над множествами
a = {1, 2, 3, 4}
b = {3, 4, 5, 6}

print(a | b)   # объединение: {1, 2, 3, 4, 5, 6}
print(a & b)   # пересечение: {3, 4}
print(a - b)   # разность: {1, 2}
print(a ^ b)   # симметрическая разность: {1, 2, 5, 6}
```

## Frozenset

Неизменяемое множество (можно использовать как ключ словаря).

```python
fs = frozenset([1, 2, 3])
# fs.add(4)  # AttributeError — нельзя изменить
```
