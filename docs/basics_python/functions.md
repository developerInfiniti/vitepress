---
title: Функции Python
description: Определение и использование функций в Python
---

# Функции Python

## Определение функции

```python
def greet(name):
    """Приветствие пользователя."""
    return f"Привет, {name}!"

result = greet("Мир")
print(result)  # "Привет, Мир!"
```

## Аргументы функций

### Позиционные и именованные аргументы

```python
def create_user(name, age, city="Москва"):
    return {"name": name, "age": age, "city": city}

# Позиционные
user1 = create_user("Иван", 25)

# Именованные
user2 = create_user(name="Анна", age=30, city="Киев")
```

### *args и **kwargs

```python
def sum_all(*args):
    """Принимает любое количество позиционных аргументов."""
    return sum(args)

print(sum_all(1, 2, 3))  # 6

def print_info(**kwargs):
    """Принимает любое количество именованных аргументов."""
    for key, value in kwargs.items():
        print(f"{key}: {value}")

print_info(name="Иван", age=30, city="Москва")
```

### Только позиционные и только именованные

```python
# / — до него только позиционные
# * — после него только именованные
def func(pos_only, /, normal, *, kw_only):
    print(pos_only, normal, kw_only)

func(1, 2, kw_only=3)       # OK
# func(pos_only=1, ...)      # TypeError
# func(1, 2, 3)              # TypeError
```

## Лямбда-функции

```python
square = lambda x: x ** 2
print(square(5))  # 25

# Часто используется с функциями высшего порядка
numbers = [3, 1, 4, 1, 5, 9]
sorted_nums = sorted(numbers, key=lambda x: -x)
# [9, 5, 4, 3, 1, 1]
```

## Функции высшего порядка

```python
numbers = [1, 2, 3, 4, 5]

# map — применить функцию к каждому элементу
squares = list(map(lambda x: x ** 2, numbers))
# [1, 4, 9, 16, 25]

# filter — отфильтровать элементы
evens = list(filter(lambda x: x % 2 == 0, numbers))
# [2, 4]

# reduce — свернуть в одно значение
from functools import reduce
total = reduce(lambda a, b: a + b, numbers)
# 15
```

## Декораторы

```python
import time

def timer(func):
    """Декоратор для замера времени выполнения."""
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        elapsed = time.time() - start
        print(f"{func.__name__} выполнена за {elapsed:.4f} сек")
        return result
    return wrapper

@timer
def slow_function():
    time.sleep(1)

slow_function()
# slow_function выполнена за 1.00xx сек
```

### Декоратор с параметрами

```python
def repeat(n):
    """Декоратор, повторяющий вызов функции n раз."""
    def decorator(func):
        def wrapper(*args, **kwargs):
            for _ in range(n):
                result = func(*args, **kwargs)
            return result
        return wrapper
    return decorator

@repeat(3)
def say_hello():
    print("Привет!")

say_hello()
# Привет!
# Привет!
# Привет!
```

## Генераторы

```python
def fibonacci(n):
    """Генератор чисел Фибоначчи."""
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b

for num in fibonacci(10):
    print(num, end=" ")
# 0 1 1 2 3 5 8 13 21 34

# Генераторное выражение
squares = (x ** 2 for x in range(10))
print(list(squares))  # [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]
```

## Рекурсия

```python
def factorial(n):
    """Рекурсивное вычисление факториала."""
    if n <= 1:
        return 1
    return n * factorial(n - 1)

print(factorial(5))  # 120
```

## Замыкания

```python
def make_counter():
    count = 0
    def counter():
        nonlocal count
        count += 1
        return count
    return counter

c = make_counter()
print(c())  # 1
print(c())  # 2
print(c())  # 3
```
