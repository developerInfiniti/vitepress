---
description: "Классы TypeScript: модификаторы доступа, abstract, implements — ООП с типизацией и наследованием"
---

# Основы TypeScript: Классы (Classes)

**Классы** в TypeScript (как и в ES6+) являются синтаксическим сахаром над прототипным наследованием JavaScript. Они предоставляют более понятный и структурированный способ создания объектов и организации кода. TypeScript расширяет возможности классов, добавляя строгую типизацию для свойств, методов и конструкторов, а также модификаторы доступа и абстрактные классы.

## Определение классов

Классы определяются с помощью ключевого слова `class`, за которым следует имя класса и блок с определением его членов (свойств и методов).

```typescript
class Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  distanceFromOrigin(a: number = 0, b: number = 0) {
    return Math.sqrt((this.x - a) ** 2 + (this.y - b) ** 2);
  }
}

let point = new Point(10, 20);
console.log(point.x); // Выведет 10
console.log(point.distanceFromOrigin()); // Выведет 22.360679774997898
```

В этом примере определен класс `Point` с двумя свойствами (`x` и `y`) типа `number`, конструктором для инициализации этих свойств и методом `distanceFromOrigin` для вычисления расстояния от начала координат (по умолчанию) или от заданной точки.

## Свойства классов

Свойства класса объявляются внутри тела класса. Им может быть явно указан тип. Если свойство не инициализируется в конструкторе, ему может быть присвоено значение по умолчанию или оно может быть объявлено как необязательное (с использованием `?`).

```typescript
class Rectangle {
  width: number;
  height: number;
  color?: string = "transparent"; // Необязательное свойство с значением по умолчанию

  constructor(width: number, height: number, color?: string) {
    this.width = width;
    this.height = height;
    if (color) {
      this.color = color;
    }
  }

  area(): number {
    return this.width * this.height;
  }
}

let rect1 = new Rectangle(5, 10);
console.log(rect1.color); // Выведет "transparent"
let rect2 = new Rectangle(5, 10, "red");
console.log(rect2.color); // Выведет "red"
```

## Конструктор (`constructor`)

Конструктор — это специальный метод для создания и инициализации объектов класса. Он вызывается при создании нового экземпляра класса с помощью оператора `new`. Конструктор может принимать параметры, которые используются для инициализации свойств объекта.

## Методы классов

Методы — это функции, определенные внутри класса, которые описывают поведение объектов класса. Они имеют доступ к свойствам объекта через ключевое слово `this`. Типы параметров и возвращаемого значения методов могут быть явно указаны.

## Модификаторы доступа (`public`, `private`, `protected`)

TypeScript предоставляет модификаторы доступа для контроля видимости членов класса (свойств и методов):

* **`public` (по умолчанию):** Доступен из любого места (внутри класса, вне класса, в дочерних классах). Если модификатор не указан, используется `public`.
* **`private`:** Доступен только внутри класса, в котором он объявлен. Недоступен извне класса или в дочерних классах.
* **`protected`:** Доступен внутри класса, в котором он объявлен, и в его дочерних классах. Недоступен извне класса.

```typescript
class Employee {
  public name: string;
  private employeeId: number;
  protected department: string;

  constructor(name: string, id: number, dept: string) {
    this.name = name;
    this.employeeId = id;
    this.department = dept;
  }

  public getDetails(): string {
    return `Name: ${this.name}, ID: ${this.employeeId}, Department: ${this.department}`;
  }

  protected getDepartment(): string {
    return this.department;
  }
}

let emp = new Employee("Alice", 123, "Development");
console.log(emp.name); // OK (public)
// console.log(emp.employeeId); // Ошибка: Property 'employeeId' is private and only accessible within class 'Employee'.
// console.log(emp.department); // Ошибка: Property 'department' is protected and only accessible within class 'Employee' and its subclasses.
console.log(emp.getDetails()); // OK (public method)

class Manager extends Employee {
  constructor(name: string, id: number, dept: string) {
    super(name, id, dept);
  }

  public getManagerDepartment(): string {
    return this.getDepartment(); // OK (protected member доступен в дочернем классе)
    // return this.employeeId; // Ошибка: Property 'employeeId' is private and only accessible within class 'Employee'.
  }
}

let manager = new Manager("Bob", 456, "Management");
console.log(manager.getManagerDepartment()); // OK
```

## Свойства только для чтения (`readonly`)

Свойства класса также могут быть объявлены как `readonly`. Такие свойства могут быть инициализированы только при объявлении или в конструкторе. После присвоения значения их нельзя изменить.

```typescript
class Person {
  readonly birthDate: Date;

  constructor(birthDate: Date) {
    this.birthDate = birthDate;
    // this.birthDate = new Date("2026-01-01"); // Ошибка: Cannot assign to 'birthDate' because it is a read-only property.
  }

  getAge(): number {
    const today = new Date();
    let age = today.getFullYear() - this.birthDate.getFullYear();
    const m = today.getMonth() - this.birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < this.birthDate.getDate())) {
      age--;
    }
    return age;
  }
}

let person = new Person(new Date("2000-05-14"));
console.log(person.birthDate);
console.log(person.getAge());
// person.birthDate = new Date("2001-01-01"); // Ошибка: Cannot assign to 'birthDate' because it is a read-only property.
```

## Наследование (`extends`)

Классы могут наследовать свойства и методы от других классов с помощью ключевого слова `extends`. Класс, который наследует, называется подклассом (или производным классом), а класс, от которого наследуют, называется суперклассом (или базовым классом).

```typescript
class Animal {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  makeSound(sound: string = "Generic animal sound") {
    console.log(`${this.name} says: ${sound}`);
  }
}

class Dog extends Animal {
  breed: string;

  constructor(name: string, breed: string) {
    super(name); // Вызов конструктора суперкласса
    this.breed = breed;
  }

  makeSound(sound: string = "Woof!") {
    super.makeSound(sound); // Вызов метода суперкласса
  }
}

let animal = new Animal("Generic Animal");
animal.makeSound(); // Выведет "Generic Animal says: Generic animal sound"

let dog = new Dog("Buddy", "Golden Retriever");
dog.makeSound(); // Выведет "Buddy says: Woof!"
dog.makeSound("Bark bark!"); // Выведет "Buddy says: Bark bark!"
console.log(dog.breed); // Выведет "Golden Retriever"
```

В подклассе можно использовать `super()` для вызова конструктора суперкласса и `super.methodName()` для вызова методов суперкласса.

## Переопределение методов (Method Overriding)

Подкласс может предоставлять собственную реализацию метода, унаследованного от суперкласса. Это называется переопределением метода.

В примере выше класс `Dog` переопределяет метод `makeSound` из класса `Animal`.

## Статические члены (`static`)

Статические свойства и методы принадлежат самому классу, а не экземплярам класса. Они вызываются непосредственно на классе без создания объекта.

```typescript
class Counter {
  static count: number = 0;

  static increment() {
    Counter.count++;
  }

  static getCount(): number {
    return Counter.count;
  }
}

console.log(Counter.count); // Выведет 0
Counter.increment();
Counter.increment();
console.log(Counter.getCount()); // Выведет 2

// let counterInstance = new Counter();
// console.log(counterInstance.count); // Ошибка: Static property 'count' only accessible on class 'Counter'.
```

## Абстрактные классы (`abstract`)

Абстрактные классы — это базовые классы, которые не могут быть инстанцированы напрямую. Они предназначены для того, чтобы быть унаследованными другими классами. Абстрактные классы могут содержать абстрактные методы (методы без реализации), которые должны быть реализованы в подклассах.

```typescript
abstract class Shape {
  abstract getArea(): number; // Абстрактный метод

  printColor(color: string): void {
    console.log(`Color of the shape is ${color}`);
  }
}

class Circle extends Shape {
  radius: number;

  constructor(radius: number) {
    super();
    this.radius = radius;
  }

  getArea(): number {
    return Math.PI * this.radius ** 2;
  }
}

// let shape = new Shape(); // Ошибка: Cannot create an instance of an abstract class.
let circle = new Circle(5);
console.log(circle.getArea()); // Выведет 78.53981633974483
circle.printColor("red"); // Выведет "Color of the shape is red"
```

В этом примере `Shape` является абстрактным классом с абстрактным методом `getArea()`. Класс `Circle` наследует от `Shape` и предоставляет реализацию для `getArea()`.

## Интерфейсы vs. Классы

Интерфейсы описывают контракт, которому должен соответствовать объект, но не предоставляют реализации. Классы предоставляют реализацию и могут быть использованы для создания объектов. Классы могут реализовывать интерфейсы (`implements`), чтобы гарантировать, что они соответствуют определенному контракту.

## Заключение

Классы в TypeScript являются мощным инструментом для структурирования объектно-ориентированного кода. Они обеспечивают инкапсуляцию данных и поведения, поддерживают наследование и полиморфизм, а также предоставляют механизмы контроля доступа и абстракции. Использование классов помогает создавать более организованный, поддерживаемый и масштабируемый код на TypeScript.