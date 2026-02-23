---
title: ООП в Python
description: Объектно-ориентированное программирование в Python
---

# ООП в Python

## Классы и объекты

```python
class User:
    """Класс пользователя."""

    def __init__(self, name, age):
        self.name = name
        self.age = age

    def greet(self):
        return f"Привет, я {self.name}, мне {self.age} лет"

user = User("Иван", 30)
print(user.greet())  # "Привет, я Иван, мне 30 лет"
```

## Атрибуты класса и экземпляра

```python
class Dog:
    species = "Canis familiaris"  # атрибут класса

    def __init__(self, name, breed):
        self.name = name    # атрибут экземпляра
        self.breed = breed

dog1 = Dog("Рекс", "Овчарка")
dog2 = Dog("Бобик", "Дворняга")

print(dog1.species)  # "Canis familiaris"
print(dog2.species)  # "Canis familiaris"
```

## Наследование

```python
class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        raise NotImplementedError("Подкласс должен реализовать этот метод")

class Cat(Animal):
    def speak(self):
        return f"{self.name} говорит: Мяу!"

class Dog(Animal):
    def speak(self):
        return f"{self.name} говорит: Гав!"

cat = Cat("Мурка")
dog = Dog("Рекс")
print(cat.speak())  # "Мурка говорит: Мяу!"
print(dog.speak())  # "Рекс говорит: Гав!"
```

## Множественное наследование

```python
class Flyable:
    def fly(self):
        return "Я могу летать"

class Swimmable:
    def swim(self):
        return "Я могу плавать"

class Duck(Animal, Flyable, Swimmable):
    def speak(self):
        return f"{self.name} говорит: Кря!"

duck = Duck("Дональд")
print(duck.speak())  # "Дональд говорит: Кря!"
print(duck.fly())    # "Я могу летать"
print(duck.swim())   # "Я могу плавать"
```

## Инкапсуляция

```python
class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self._balance = balance       # protected (соглашение)
        self.__pin = "1234"           # private (name mangling)

    @property
    def balance(self):
        return self._balance

    @balance.setter
    def balance(self, value):
        if value < 0:
            raise ValueError("Баланс не может быть отрицательным")
        self._balance = value

    def deposit(self, amount):
        self._balance += amount

    def withdraw(self, amount):
        if amount > self._balance:
            raise ValueError("Недостаточно средств")
        self._balance -= amount

account = BankAccount("Иван", 1000)
account.deposit(500)
print(account.balance)  # 1500
```

## Магические методы

```python
class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __repr__(self):
        return f"Vector({self.x}, {self.y})"

    def __str__(self):
        return f"({self.x}, {self.y})"

    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)

    def __eq__(self, other):
        return self.x == other.x and self.y == other.y

    def __len__(self):
        return int((self.x ** 2 + self.y ** 2) ** 0.5)

v1 = Vector(1, 2)
v2 = Vector(3, 4)
v3 = v1 + v2
print(v3)        # (4, 6)
print(repr(v3))  # Vector(4, 6)
```

## Абстрактные классы

```python
from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self):
        pass

    @abstractmethod
    def perimeter(self):
        pass

class Rectangle(Shape):
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height

    def perimeter(self):
        return 2 * (self.width + self.height)

# shape = Shape()  # TypeError — нельзя создать экземпляр абстрактного класса
rect = Rectangle(5, 3)
print(rect.area())       # 15
print(rect.perimeter())  # 16
```

## Dataclasses

```python
from dataclasses import dataclass, field

@dataclass
class Product:
    name: str
    price: float
    quantity: int = 0
    tags: list = field(default_factory=list)

    @property
    def total_cost(self):
        return self.price * self.quantity

product = Product("Ноутбук", 50000, 3)
print(product)              # Product(name='Ноутбук', price=50000, quantity=3, tags=[])
print(product.total_cost)   # 150000
```

## Статические и классовые методы

```python
class MathUtils:
    pi = 3.14159

    @staticmethod
    def add(a, b):
        """Не требует доступа к классу или экземпляру."""
        return a + b

    @classmethod
    def circle_area(cls, radius):
        """Имеет доступ к атрибутам класса."""
        return cls.pi * radius ** 2

print(MathUtils.add(2, 3))          # 5
print(MathUtils.circle_area(10))    # 314.159
```
