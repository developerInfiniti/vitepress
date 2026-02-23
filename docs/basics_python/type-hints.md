---
title: Аннотации типов в Python
description: Типизация и проверка типов в Python
---

# Аннотации типов в Python

## Базовые аннотации

```python
# Переменные
name: str = "Python"
age: int = 30
price: float = 9.99
is_active: bool = True

# Функции
def greet(name: str) -> str:
    return f"Привет, {name}!"

def add(a: int, b: int) -> int:
    return a + b
```

## Коллекции

```python
# Python 3.9+ — встроенные типы
names: list[str] = ["Иван", "Анна"]
scores: dict[str, int] = {"Иван": 100, "Анна": 95}
coordinates: tuple[float, float] = (55.75, 37.62)
unique_ids: set[int] = {1, 2, 3}

# Python 3.8 и ниже — из typing
from typing import List, Dict, Tuple, Set

names: List[str] = ["Иван", "Анна"]
scores: Dict[str, int] = {"Иван": 100}
```

## Optional и Union

```python
from typing import Optional, Union

# Optional — может быть None
def find_user(user_id: int) -> Optional[dict]:
    if user_id == 1:
        return {"name": "Иван"}
    return None

# Union — один из нескольких типов
def process(value: Union[str, int]) -> str:
    return str(value)

# Python 3.10+ — оператор |
def process(value: str | int) -> str:
    return str(value)

def find_user(user_id: int) -> dict | None:
    ...
```

## Callable

```python
from typing import Callable

# Функция, принимающая функцию как аргумент
def apply(func: Callable[[int, int], int], a: int, b: int) -> int:
    return func(a, b)

result = apply(lambda x, y: x + y, 3, 4)  # 7
```

## TypeVar и Generic

```python
from typing import TypeVar, Generic

T = TypeVar("T")

def first(items: list[T]) -> T:
    return items[0]

# Generic класс
class Stack(Generic[T]):
    def __init__(self) -> None:
        self._items: list[T] = []

    def push(self, item: T) -> None:
        self._items.append(item)

    def pop(self) -> T:
        return self._items.pop()

stack: Stack[int] = Stack()
stack.push(1)
stack.push(2)
value = stack.pop()  # int
```

## TypedDict

```python
from typing import TypedDict

class UserDict(TypedDict):
    name: str
    age: int
    email: str

user: UserDict = {
    "name": "Иван",
    "age": 30,
    "email": "ivan@mail.ru"
}
```

## Literal

```python
from typing import Literal

def set_status(status: Literal["active", "inactive", "banned"]) -> None:
    print(f"Статус: {status}")

set_status("active")     # OK
# set_status("unknown")  # Ошибка mypy
```

## Protocol — структурная типизация

```python
from typing import Protocol

class Drawable(Protocol):
    def draw(self) -> None:
        ...

class Circle:
    def draw(self) -> None:
        print("Рисую круг")

class Square:
    def draw(self) -> None:
        print("Рисую квадрат")

def render(shape: Drawable) -> None:
    shape.draw()

render(Circle())  # OK — Circle реализует draw()
render(Square())  # OK — Square реализует draw()
```

## Проверка типов с mypy

```bash
# Установка
pip install mypy

# Проверка файла
mypy main.py

# Проверка проекта
mypy src/

# Строгий режим
mypy --strict main.py
```

```python
# mypy.ini или pyproject.toml
# [mypy]
# python_version = 3.12
# warn_return_any = True
# disallow_untyped_defs = True
```
