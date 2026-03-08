---
description: "Интерфейсы TypeScript: объявление, наследование, реализация — контракты типов для объектов и классов"
---

# Основы TypeScript: Интерфейсы (Interfaces)

**Интерфейсы** в TypeScript — это способ определить контракт, которому должен соответствовать объект. Они описывают структуру объекта, указывая имена свойств, их типы и (необязательно) методы. Интерфейсы являются чисто декларативной конструкцией и не существуют в скомпилированном JavaScript-коде.

## Определение интерфейсов

Интерфейсы определяются с помощью ключевого слова `interface`, за которым следует имя интерфейса и блок с описанием его членов (свойств и методов).

```typescript
interface Point {
  x: number;
  y: number;
}

function printPoint(p: Point) {
  console.log(`x: ${p.x}, y: ${p.y}`);
}

let pointObj: Point = { x: 10, y: 20 };
printPoint(pointObj);
```

В этом примере интерфейс `Point` описывает объект с двумя числовыми свойствами: `x` и `y`. Функция `printPoint` ожидает объект, который соответствует интерфейсу `Point`.

## Необязательные свойства (`?`)

Вы можете определить свойства в интерфейсе как необязательные, используя знак вопроса `?` после имени свойства.

```typescript
interface Person {
  firstName: string;
  lastName?: string; // Свойство lastName является необязательным
  age: number;
}

function greet(person: Person) {
  console.log(`Hello, ${person.firstName}`);
  if (person.lastName) {
    console.log(`Your full name is ${person.firstName} ${person.lastName}`);
  }
  console.log(`You are ${person.age} years old.`);
}

let person1: Person = { firstName: "Alice", age: 30 };
let person2: Person = { firstName: "Bob", lastName: "Smith", age: 25 };

greet(person1);
greet(person2);
```

## Свойства только для чтения (`readonly`)

Вы можете пометить свойства интерфейса как доступные только для чтения, используя ключевое слово `readonly` перед именем свойства. После присвоения значения такому свойству его нельзя будет изменить.

```typescript
interface PointReadonly {
  readonly x: number;
  readonly y: number;
}

let p1: PointReadonly = { x: 10, y: 20 };
// p1.x = 5; // Ошибка: Cannot assign to 'x' because it is a read-only property.
```

## Определение функций в интерфейсах

Интерфейсы могут описывать типы функций.

```typescript
interface StringProcessor {
  (str: string): string;
}

let toUpperCase: StringProcessor = function(s: string): string {
  return s.toUpperCase();
};

let trimString: StringProcessor = function(s: string): string {
  return s.trim();
};

console.log(toUpperCase("hello")); // Выведет "HELLO"
console.log(trimString("  world  ")); // Выведет "world"
```

Здесь интерфейс `StringProcessor` описывает функцию, которая принимает один строковый аргумент и возвращает строку.

## Индексируемые типы (Indexable Types)

Интерфейсы могут описывать структуры данных, к которым можно обращаться с помощью индекса (например, массивы или объекты, которые ведут себя как словари).

### Строковые индексы

```typescript
interface StringDictionary {
  [index: string]: string;
}

let dictionary: StringDictionary = {
  "apple": "красное фруктовое дерево",
  "banana": "желтый фрукт"
};

console.log(dictionary["apple"]); // Выведет "красное фруктовое дерево"
```

### Числовые индексы

```typescript
interface StringArray {
  [index: number]: string;
}

let myArray: StringArray = ["hello", "world"];
console.log(myArray[0]); // Выведет "hello"
```

Можно использовать оба типа индексов в одном интерфейсе, но если вы используете оба, тип, возвращаемый строковым индексом, должен быть супертипом типа, возвращаемого числовым индексом. Это связано с тем, что при использовании числа для индексации JavaScript преобразует его в строку перед обращением к свойству объекта.

```typescript
interface HybridArray {
  [index: number]: string | number;
  [key: string]: string;
}

let hybrid: HybridArray = ["value1", 2, "value3"];
hybrid["prop1"] = "string value";
hybrid[3] = "another value";
console.log(hybrid[0]); // "value1"
console.log(hybrid["prop1"]); // "string value"
```

## Расширение интерфейсов (Extending Interfaces)

Интерфейсы могут наследовать свойства и методы других интерфейсов с помощью ключевого слова `extends`. Это позволяет создавать более специализированные интерфейсы на основе более общих.

```typescript
interface Shape {
  color: string;
}

interface Square extends Shape {
  sideLength: number;
}

let square: Square = { color: "blue", sideLength: 10 };
console.log(`Color: ${square.color}, Side Length: ${square.sideLength}`);
```

Интерфейс может расширять несколько интерфейсов:

```typescript
interface Movable {
  move(): void;
}

interface Rotatable {
  rotate(): void;
}

interface Animatable extends Movable, Rotatable {
  animate(): void;
}

let animatedObject: Animatable = {
  move() { console.log("Moving..."); },
  rotate() { console.log("Rotating..."); },
  animate() { console.log("Animating..."); }
};

animatedObject.move();
animatedObject.rotate();
animatedObject.animate();
```

## Реализация интерфейсов классами (`implements`)

Классы в TypeScript могут реализовывать один или несколько интерфейсов с помощью ключевого слова `implements`. Класс, реализующий интерфейс, должен предоставить реализацию для всех свойств и методов, определенных в интерфейсе.

```typescript
interface ClockInterface {
  currentTime: Date;
  setTime(d: Date): void;
}

class Clock implements ClockInterface {
  currentTime: Date = new Date();
  setTime(d: Date) {
    this.currentTime = d;
  }
  constructor(h: number, m: number) {}
}

let clock = new Clock(12, 30);
clock.setTime(new Date());
console.log(clock.currentTime);
```

Класс может реализовывать несколько интерфейсов, перечисляя их через запятую после `implements`.

```typescript
class MyObject implements Movable, Rotatable {
  move() { console.log("MyObject is moving."); }
  rotate() { console.log("MyObject is rotating."); }
}
```

## Интерфейсы vs. Типы (`type`)

В TypeScript ключевое слово `type` также используется для создания псевдонимов типов, которые могут описывать как примитивные типы, так и более сложные структуры, включая union и intersection types.

```typescript
type PointType = {
  x: number;
  y: number;
};

type StringOrNumber = string | number;

interface PointInterface {
  x: number;
  y: number;
}
```

Основные отличия между интерфейсами и типами:

* **Расширение:** Интерфейсы могут быть объявлены несколько раз, и их объявления будут автоматически объединены (declaration merging). Типы после объявления не могут быть изменены или объединены. Интерфейсы могут расширять другие интерфейсы (`extends`), а типы могут расширять другие типы с помощью intersection types (`&`).
* **Реализация классами:** Классы могут реализовывать интерфейсы (`implements`), но не могут напрямую реализовывать типы-псевдонимы (хотя можно создать тип-псевдоним для интерфейса и реализовать его).
* **Область применения:** Типы могут описывать примитивные типы, union types, intersection types и другие структуры, которые не могут быть выражены только через интерфейсы.

В целом, интерфейсы часто используются для определения структуры объектов и контрактов, особенно при работе с классами. Типы-псевдонимы более универсальны и могут использоваться для создания псевдонимов для любых видов типов.

## Заключение

Интерфейсы являются мощной возможностью TypeScript, позволяющей определять строгие контракты для объектов, функций и классов. Они способствуют созданию более надежного, читаемого и поддерживаемого кода, обеспечивая типовую безопасность на этапе разработки. Понимание и правильное использование интерфейсов является ключевым аспектом эффективной работы с TypeScript.