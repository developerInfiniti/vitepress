---
description: "Generics TypeScript: обобщённые типы, constraints, utility — типобезопасный переиспользуемый код"
---

# Основы TypeScript: Дженерики (Generics)

**Дженерики** (обобщенные типы) в TypeScript предоставляют способ параметризовать типы. Подобно тому, как функции принимают параметры, дженерики позволяют классам, интерфейсам и функциям принимать *типы* в качестве параметров. Это позволяет создавать компоненты, которые могут работать с различными типами данных, обеспечивая при этом типовую безопасность и предотвращая ошибки времени выполнения, связанные с неправильным использованием типов.

## Зачем нужны дженерики?

Рассмотрим пример без использования дженериков:

```typescript
function identity(arg: any): any {
  return arg;
}

let outputNumber = identity(123); // outputNumber имеет тип any
let outputString = identity("hello"); // outputString имеет тип any
```

Функция `identity` принимает аргумент типа `any` и возвращает значение типа `any`. Хотя эта функция работает, она теряет информацию о типе аргумента. Мы не знаем, какой тип был передан, и какой тип будет возвращен. Дженерики позволяют нам захватить тип, который был передан, и использовать эту информацию позже.

## Синтаксис дженериков

В TypeScript дженерики обычно обозначаются с помощью угловых скобок `<T>`, где `T` — это имя параметра типа (можно использовать любое допустимое имя, но `T` (Type), `K` (Key), `V` (Value), `E` (Element) часто используются по соглашению).

### Дженерики в функциях

```typescript
function identity<T>(arg: T): T {
  return arg;
}

let outputNumber = identity<number>(123); // T теперь number, outputNumber имеет тип number
let outputString = identity<string>("hello"); // T теперь string, outputString имеет тип string
let outputBoolean = identity<boolean>(true); // T теперь boolean, outputBoolean имеет тип boolean

// TypeScript также может выводить тип аргумента автоматически
let inferredNumber = identity(456); // inferredNumber имеет тип number
let inferredString = identity("world"); // inferredString имеет тип string
```

В этом примере `<T>` после имени функции `identity` делает `T` параметром типа. Когда мы вызываем функцию, мы можем явно указать тип аргумента (например, `identity<number>(123)`), или TypeScript может вывести его автоматически. Возвращаемый тип функции также является `T`, что гарантирует, что возвращается значение того же типа, что и был передан аргумент.

### Дженерики в интерфейсах

Дженерики также можно использовать в интерфейсах для создания обобщенных структур.

```typescript
interface Box<T> {
  contents: T;
}

let numberBox: Box<number> = { contents: 100 };
let stringBox: Box<string> = { contents: "TypeScript" };

function getContents<T>(box: Box<T>): T {
  return box.contents;
}

let numberContent = getContents(numberBox); // numberContent имеет тип number
let stringContent = getContents(stringBox); // stringContent имеет тип string
```

Здесь интерфейс `Box` является дженериком, который принимает параметр типа `T`. Свойство `contents` внутри `Box` имеет тип `T`. При создании экземпляров `Box`, мы указываем конкретный тип для `T` (например, `Box<number>` или `Box<string>`).

### Дженерики в классах

Классы также могут быть дженериками. Параметр типа указывается после имени класса.

```typescript
class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y: T) => T;

  constructor(zeroValue: T, add: (x: T, y: T) => T) {
    this.zeroValue = zeroValue;
    this.add = add;
  }
}

let numberCalculator = new GenericNumber<number>(0, (a, b) => a + b);
console.log(numberCalculator.add(10, 20)); // Выведет 30

let stringCalculator = new GenericNumber<string>("", (a, b) => a + b);
console.log(stringCalculator.add("hello ", "world")); // Выведет "hello world"
```

Класс `GenericNumber` параметризован типом `T`. Свойство `zeroValue` и тип параметров и возвращаемого значения метода `add` зависят от `T`.

## Ограничения дженериков (Generic Constraints)

Иногда вам может потребоваться ограничить типы, которые могут быть использованы с вашим дженериком. Например, вы можете захотеть написать функцию, которая работает с объектами, имеющими определенное свойство. Для этого используются ограничения дженериков с помощью ключевого слова `extends`.

```typescript
interface Lengthwise {
  length: number;
}

function logLength<T extends Lengthwise>(arg: T): void {
  console.log(arg.length);
}

logLength("hello"); // OK, string имеет свойство length
logLength([1, 2, 3]); // OK, массив имеет свойство length
// logLength(123); // Ошибка: Argument of type 'number' is not assignable to parameter of type 'Lengthwise'.
```

В этом примере дженерик `T` ограничен типом `Lengthwise`. Это означает, что `T` должен быть либо `Lengthwise`, либо типом, который расширяет `Lengthwise` (то есть имеет свойство `length` типа `number`).

Вы также можете использовать классы в качестве ограничений:

```typescript
class Animal {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}

class Dog extends Animal {
  breed: string;
  constructor(name: string, breed: string) {
    super(name);
    this.breed = breed;
  }
}

function createInstance<T extends Animal>(c: new (name: string) => T, name: string): T {
  return new c(name);
}

let animal = createInstance(Animal, "Generic Animal");
let dog = createInstance(Dog, "Buddy");
```

Здесь дженерик `T` ограничен типами, которые являются подклассами `Animal`. Функция `createInstance` принимает конструктор типа `T` и имя, и создает экземпляр этого типа.

## Использование параметров типа в ограничениях

Параметр типа может быть ограничен другим параметром типа.

```typescript
function copyFields<T extends U, U>(target: T, source: U): T {
  for (const id in source) {
    target[id] = source[id];
  }
  return target;
}

let x = { a: 1, b: 2, c: 3, d: 4 };
let y = { b: 10, d: 20 };
copyFields(x, y); // x теперь { a: 1, b: 10, c: 3, d: 20 }
```

Здесь `T` ограничен типом `U`. Это гарантирует, что `U` имеет как минимум те же свойства, что и `T`.

## Дженерики с несколькими параметрами типа

Вы можете использовать несколько параметров типа в дженериках.

```typescript
interface Pair<K, V> {
  key: K;
  value: V;
}

let pair1: Pair<string, number> = { key: "id", value: 1 };
let pair2: Pair<number, string> = { key: 101, value: "name" };
```

## Преимущества использования дженериков

* **Типовая безопасность:** Дженерики обеспечивают типовую безопасность на этапе компиляции, что помогает выявлять ошибки до выполнения кода.
* **Повторно используемый код:** Дженерики позволяют писать код, который может работать с различными типами данных без дублирования логики.
* **Лучшая производительность (потенциально):** Хотя дженерики существуют только во время компиляции и не влияют на производительность JavaScript во время выполнения, они позволяют компилятору выполнять более строгие проверки типов, что может привести к более оптимизированному коду.
* **Более выразительные типы:** Дженерики позволяют более точно описывать типы данных, особенно при работе с коллекциями и структурами данных.

## Заключение

Дженерики являются мощной и важной частью системы типов TypeScript. Они позволяют создавать гибкий и повторно используемый код, сохраняя при этом преимущества статической типизации. Понимание и эффективное использование дженериков является ключевым для написания качественного и масштабируемого кода на TypeScript.