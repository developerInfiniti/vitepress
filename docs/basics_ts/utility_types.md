---
description: "Utility Types TypeScript: Partial, Required, Pick, Omit, Record — встроенные типы для трансформации"
---

# Основы TypeScript: Utility Types (Вспомогательные типы)

**Utility Types** (вспомогательные типы) в TypeScript — это набор встроенных дженерик-типов, которые выполняют распространенные преобразования типов. Они находятся в глобальном пространстве имен и доступны без импорта. Использование Utility Types может значительно упростить манипуляции с типами и сделать ваш код более выразительным.

Вот некоторые из наиболее часто используемых Utility Types:

## `Partial<T>`

Делает все свойства типа `T` необязательными (`?`).

```typescript
interface Person {
  name: string;
  age: number;
}

const person: Person = {
  name: "Alice",
  age: 30
};

const partialPerson: Partial<Person> = {};
partialPerson.name = "Bob";
partialPerson.age = 25;

console.log(partialPerson); // Выведет { name: 'Bob', age: 25 }
```

`Partial<Person>` создает новый тип, в котором свойства `name` и `age` являются необязательными.

## `Required<T>`

Делает все свойства типа `T` обязательными (удаляет модификатор `?`).

```typescript
interface Config {
  apiUrl?: string;
  timeout?: number;
}

const defaultConfig: Required<Config> = {
  apiUrl: "[https://api.example.com](https://api.example.com)",
  timeout: 5000
};

// const incompleteConfig: Required<Config> = {}; // Ошибка: Property 'apiUrl' is missing in type '{}' but required in type 'Required<Config>'.
```

`Required<Config>` создает новый тип, в котором свойства `apiUrl` и `timeout` становятся обязательными.

## `Readonly<T>`

Делает все свойства типа `T` доступными только для чтения (`readonly`).

```typescript
interface Point {
  x: number;
  y: number;
}

const p1: Point = { x: 10, y: 20 };
p1.x = 5; // OK

const readonlyP1: Readonly<Point> = { x: 10, y: 20 };
// readonlyP1.x = 5; // Ошибка: Cannot assign to 'x' because it is a read-only property.
```

`Readonly<Point>` создает новый тип, в котором свойства `x` и `y` нельзя изменить после инициализации.

## `Record<K extends keyof any, T>`

Создает объектный тип, ключи которого являются типом `K`, а значения — типом `T`. `keyof any` представляет собой тип, который может быть ключом объекта (`string | number | symbol`).

```typescript
type Status = "success" | "error" | "pending";

const statusMessages: Record<Status, string> = {
  success: "Операция выполнена успешно",
  error: "Произошла ошибка",
  pending: "Ожидание..."
};

console.log(statusMessages.success); // Выведет "Операция выполнена успешно"
```

`Record<Status, string>` создает объект, ключами которого могут быть значения типа `Status` ("success", "error", "pending"), а значениями являются строки.

## `Pick<T, K extends keyof T>`

Создает новый тип, выбирая указаленные свойства `K` из типа `T`.

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

type UserNameAndId = Pick<User, "name" | "id">;

const userDetails: UserNameAndId = {
  id: 123,
  name: "Charlie"
  // email: "charlie@example.com" // Ошибка: Type '{ id: number; name: string; }' is not assignable to type 'UserNameAndId'.
};
```

`Pick<User, "name" | "id">` создает новый тип, который содержит только свойства `name` и `id` из типа `User`.

## `Omit<T, K extends keyof any>`

Создает новый тип, удаляя указанные свойства `K` из типа `T`.

```typescript
interface Event {
  id: number;
  name: string;
  location: string;
  date: Date;
}

type EventDetails = Omit<Event, "id" | "date">;

const eventInfo: EventDetails = {
  name: "Tech Conference",
  location: "Convention Center"
  // id: 456, // Ошибка: Type '{ name: string; location: string; }' is not assignable to type 'EventDetails'.
  // date: new Date() // Ошибка: Type '{ name: string; location: string; }' is not assignable to type 'EventDetails'.
};
```

`Omit<Event, "id" | "date">` создает новый тип, который содержит все свойства типа `Event`, кроме `id` и `date`.

## `Exclude<T, U>`

Создает новый тип, исключая из типа `T` все типы, которые могут быть присвоены типу `U`.

```typescript
type AllowedInput = string | number;
type NumericInput = number | bigint;

type StringOnlyInput = Exclude<AllowedInput, NumericInput>; // string
```

`Exclude<AllowedInput, NumericInput>` создает тип, который содержит только те типы из `AllowedInput`, которые не входят в `NumericInput` (в данном случае, `string`).

## `Extract<T, U>`

Создает новый тип, извлекая из типа `T` все типы, которые могут быть присвоены типу `U`.

```typescript
type AllowedInput = string | number | boolean;
type StringOrNumber = string | number;

type CommonInput = Extract<AllowedInput, StringOrNumber>; // string | number
```

`Extract<AllowedInput, StringOrNumber>` создает тип, который содержит только те типы, которые являются общими для `AllowedInput` и `StringOrNumber` (в данном случае, `string | number`).

## `NonNullable<T>`

Создает новый тип, исключая из типа `T` значения `null` и `undefined`.

```typescript
type MaybeString = string | null | undefined;

const definitelyString: NonNullable<MaybeString> = "hello";
// const definitelyStringNull: NonNullable<MaybeString> = null; // Ошибка: Type 'null' is not assignable to type 'NonNullable<MaybeString>'.
```

`NonNullable<MaybeString>` создает тип `string`, так как `null` и `undefined` исключены из `string | null | undefined`.

## `Parameters<T extends (...args: any) => any>`

Создает тип кортежа из типов параметров функции `T`.

```typescript
function greet(name: string, age: number): string {
  return `Hello, ${name}! You are ${age} years old.`;
}

type GreetParams = Parameters<typeof greet>; // [name: string, age: number]

const greetArgs: GreetParams = ["Alice", 30];
console.log(greet(...greetArgs)); // Выведет "Hello, Alice! You are 30 years old."
```

`Parameters<typeof greet>` создает тип кортежа, содержащий типы параметров функции `greet`.

## `ReturnType<T extends (...args: any) => any>`

Создает тип, представляющий возвращаемый тип функции `T`.

```typescript
function multiply(a: number, b: number): number {
  return a * b;
}

type MultiplyResult = ReturnType<typeof multiply>; // number

const result: MultiplyResult = multiply(5, 10);
console.log(result); // Выведет 50
```

`ReturnType<typeof multiply>` создает тип `number`, который является возвращаемым типом функции `multiply`.

## `ConstructorParameters<T extends new (...args: any) => any>`

Создает тип кортежа из типов параметров конструктора класса `T`.

```typescript
class Person {
  name: string;
  age: number;
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
}

type PersonConstructorParams = ConstructorParameters<typeof Person>; // [name: string, age: number]

const personArgs: PersonConstructorParams = ["Bob", 25];
const newPerson = new Person(...personArgs);
console.log(newPerson); // Выведет Person { name: 'Bob', age: 25 }
```

`ConstructorParameters<typeof Person>` создает тип кортежа, содержащий типы параметров конструктора класса `Person`.

## `InstanceType<T extends new (...args: any) => any>`

Создает тип экземпляра класса `T`.

```typescript
class Car {
  brand: string;
  constructor(brand: string) {
    this.brand = brand;
  }
  drive(): void {
    console.log("Driving...");
  }
}

type CarInstance = InstanceType<typeof Car>; // Car

const myCar: CarInstance = new Car("Toyota");
myCar.drive(); // Выведет "Driving..."
```

`InstanceType<typeof Car>` создает тип `Car`, который является типом экземпляра класса `Car`.

## `ThisParameterType<T>`

Извлекает тип параметра `this` для типа функции `T`. Если функция не имеет параметра `this`, результатом будет `unknown`.

```typescript
function toHex(this: Number) {
  return this.toString(16);
}

type HexFunction = typeof toHex; // (this: Number) => string
type ThisType = ThisParameterType<HexFunction>; // Number

function printHex(this: ThisType) {
  console.log(this.toString(16));
}

printHex.call(42); // Выведет "2a"
```

`ThisParameterType<typeof toHex>` извлекает тип `Number` из параметра `this` функции `toHex`.

## `OmitThisParameter<T>`

Удаляет параметр `this` из типа функции `T`.

```typescript
function toHex(this: Number) {
  return this.toString(16);
}

type BoundToHex = OmitThisParameter<typeof toHex>; // () => string

const boundToHex: BoundToHex = toHex.bind(42);
console.log(boundToHex()); // Выведет "2a"
```

`OmitThisParameter<typeof toHex>` создает новый тип функции, в котором параметр `this` удален.

## `ThisType<T>`

Этот тип не выполняет преобразование, а служит маркером для указания типа `this` в контексте объектного литерала.

```typescript
interface Counter {
  count: number;
  increment(): void;
}

const counter: Counter & ThisType<{ increment: () => void }> = {
  count: 0,
  increment() {
    this.count++; // 'this' здесь имеет тип объекта counter
    if (this.count < 5) {
      this.increment(); // Рекурсивный вызов с правильным 'this'
    }
  }
};

counter.increment();
console.log(counter.count); // Выведет 5
```

`ThisType<{ increment: () => void }>` указывает, что `this` внутри объектного литерала `counter` должен иметь свойство `increment`, которое является функцией, не принимающей аргументов и не возвращающей значения.

## Заключение

Utility Types в TypeScript предоставляют мощный и удобный способ работы с типами. Они позволяют вам выражать распространенные преобразования типов более декларативно и уменьшают необходимость написания повторяющегося кода. Использование Utility Types может сделать ваш TypeScript код более чистым, читаемым и поддерживаемым. Знание и понимание этих встроенных дженерик-типов является важным для эффективной работы с системой типов TypeScript.