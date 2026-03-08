---
description: "Type Guards TypeScript: typeof, instanceof, in, is — сужение типов для безопасного доступа к свойствам"
---

# Основы TypeScript: Type Guards (Защитники типов)

**Type guards** (защитники типов) в TypeScript — это выражения, которые позволяют сузить тип переменной в пределах блока кода. Они используются для того, чтобы сообщить компилятору TypeScript о более конкретном типе значения, чем тот, который был выведен автоматически. Type guards позволяют вам безопасно работать со значениями, которые могут иметь несколько возможных типов (например, union types), и избежать ошибок времени выполнения.

## Зачем нужны type guards?

Рассмотрим пример без использования type guards:

```typescript
function printId(id: number | string) {
  console.log(`ID is: ${id}`);
  // console.log(id.toUpperCase()); // Ошибка: Property 'toUpperCase' does not exist on type 'string | number'.
  // console.log(id.toFixed()); // Ошибка: Property 'toFixed' does not exist on type 'string | number'.
}

printId(101);
printId("202");
```

В этом примере функция `printId` принимает аргумент `id`, который может быть либо `number`, либо `string`. TypeScript не знает, какой именно тип имеет `id` внутри функции, поэтому он не позволяет вызывать методы, специфичные для `number` или `string` (например, `toUpperCase()` или `toFixed()`).

Type guards позволяют нам сузить тип `id` внутри определенных блоков кода, чтобы TypeScript мог безопасно разрешить вызовы методов.

## Типы type guards

Существует несколько способов создания type guards в TypeScript:

### 1. `typeof` type guards

Оператор `typeof` позволяет проверить тип переменной во время выполнения. TypeScript понимает эти проверки и сужает тип переменной в соответствующих блоках кода.

```typescript
function printId(id: number | string) {
  console.log(`ID is: ${id}`);
  if (typeof id === "string") {
    console.log(id.toUpperCase()); // OK, id имеет тип string внутри этого блока
  } else {
    console.log(id.toFixed()); // OK, id имеет тип number внутри этого блока
  }
}

printId(101);
printId("202");
```

TypeScript распознает следующие проверки `typeof`:

* `typeof x === "string"`
* `typeof x === "number"`
* `typeof x === "boolean"`
* `typeof x === "symbol"`
* `typeof x === "undefined"`
* `typeof x === "object"` (обратите внимание, что `typeof null` также возвращает `"object"`)
* `typeof x === "function"`

### 2. `instanceof` type guards

Оператор `instanceof` позволяет проверить, является ли значение экземпляром определенного класса.

```typescript
class Animal {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}

class Dog extends Animal {
  bark() {
    console.log("Woof!");
  }
}

class Cat extends Animal {
  meow() {
    console.log("Meow!");
  }
}

function makeSound(animal: Animal) {
  if (animal instanceof Dog) {
    animal.bark(); // OK, animal имеет тип Dog внутри этого блока
  } else if (animal instanceof Cat) {
    animal.meow(); // OK, animal имеет тип Cat внутри этого блока
  }
}

let myDog = new Dog("Buddy");
let myCat = new Cat("Whiskers");

makeSound(myDog); // Выведет "Woof!"
makeSound(myCat); // Выведет "Meow!"
```

### 3. Custom type guards

Вы можете определить свои собственные type guard функции. Функция type guard — это функция, которая:

* Принимает один параметр.
* Возвращает boolean.
* Использует аннотацию возвращаемого типа, чтобы сообщить TypeScript, что параметр имеет определенный тип, если функция возвращает `true`.

```typescript
interface Fish {
  swim(): void;
}

interface Bird {
  fly(): void;
}

function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}

function move(pet: Fish | Bird) {
  if (isFish(pet)) {
    pet.swim(); // OK, pet имеет тип Fish внутри этого блока
  } else {
    (pet as Bird).fly(); // Необходимо приведение типа, если мы не используем else if (pet is Bird)
  }
}

let myFish: Fish = { swim: () => console.log("Swimming") };
let myBird: Bird = { fly: () => console.log("Flying") };

move(myFish); // Выведет "Swimming"
move(myBird); // Выведет "Flying"
```

В этом примере `isFish` — это пользовательская функция type guard. Аннотация возвращаемого типа `pet is Fish` сообщает TypeScript, что если `isFish(pet)` возвращает `true`, то `pet` имеет тип `Fish` внутри блока `if`.

### 4. Literal type guards

Если переменная имеет union type, включающий литеральные типы (например, `string` literals, `number` literals, `boolean` literals), TypeScript может использовать эти литеральные типы как type guards.

```typescript
type Command = "run" | "stop" | "pause";

function executeCommand(command: Command) {
  if (command === "run") {
    console.log("Running...");
  } else if (command === "stop") {
    console.log("Stopping...");
  } else if (command === "pause") {
    console.log("Pausing...");
  }
}

executeCommand("run");
executeCommand("stop");
executeCommand("pause");
```

### 5. `in` operator type guards

Оператор `in` позволяет проверить, существует ли определенное свойство в объекте. TypeScript понимает эти проверки и сужает тип объекта в соответствующих блоках кода.

```typescript
interface HasName {
  name: string;
}

interface HasAge {
  age: number;
}

function printDetails(obj: HasName | HasAge) {
  if ("name" in obj) {
    console.log(`Name: ${obj.name}`); // OK, obj имеет тип HasName внутри этого блока
  }
  if ("age" in obj) {
    console.log(`Age: ${obj.age}`); // OK, obj имеет тип HasAge внутри этого блока
  }
}

let personWithName: HasName = { name: "Alice" };
let personWithAge: HasAge = { age: 30 };
let personWithNameAndAge: HasName & HasAge = { name: "Bob", age: 25 };

printDetails(personWithName);
printDetails(personWithAge);
printDetails(personWithNameAndAge);
```

### 6. Discriminated Unions

Discriminated unions (также известные как tagged unions или algebraic data types) — это мощный способ комбинирования литеральных типов, union types и type guards для создания более строгих и предсказуемых структур данных.

```typescript
interface Square {
  kind: "square"; // Discriminant
  size: number;
}

interface Circle {
  kind: "circle"; // Discriminant
  radius: number;
}

type Shape = Square | Circle;

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case "square":
      return shape.size * shape.size; // OK, shape имеет тип Square
    case "circle":
      return Math.PI * shape.radius ** 2; // OK, shape имеет тип Circle
  }
}

let mySquare: Square = { kind: "square", size: 10 };
let myCircle: Circle = { kind: "circle", radius: 5 };

console.log(getArea(mySquare)); // Выведет 100
console.log(getArea(myCircle)); // Выведет 78.53981633974483
```

В этом примере `kind` является **discriminant** (различителем). TypeScript использует значение `kind` для сужения типа `shape` внутри каждого case блока `switch`.

## Заключение

Type guards — это важный инструмент в TypeScript, который позволяет вам безопасно работать с union types и другими ситуациями, где тип переменной может быть не известен во время компиляции. Они помогают сделать ваш код более надежным и предотвратить ошибки времени выполнения. Понимание и правильное использование различных типов type guards является ключевым для эффективной работы с TypeScript.