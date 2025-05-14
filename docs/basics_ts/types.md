# Основы TypeScript: Типы

TypeScript предоставляет богатую систему типов, которая включает в себя как примитивные типы, так и более сложные структуры.

## Примитивные типы (Primitive Types)

Это основные строительные блоки системы типов TypeScript:

* **`boolean`:** Логические значения (`true` или `false`).

    ```typescript
    let isDone: boolean = false;
    isDone = true;
    // isDone = 1; // Ошибка: Type '1' is not assignable to type 'boolean'.
    ```

* **`number`:** Все числовые значения в JavaScript (целые числа, числа с плавающей точкой, NaN, Infinity). TypeScript не делает различия между целыми числами и числами с плавающей точкой.

    ```typescript
    let decimal: number = 6;
    let hex: number = 0xf00d;
    let binary: number = 0b1010;
    let octal: number = 0o744;
    let big: bigint = 100n; // Большие целые числа (ES2020 и выше)
    ```

* **`string`:** Текстовые данные.

    ```typescript
    let color: string = "blue";
    color = 'red';
    let fullName: string = `Bob Bobbington`;
    let age: number = 37;
    let sentence: string = `Hello, my name is ${ fullName }. I'll be ${ age + 1 } years old next year.`;
    ```

* **`null` и `undefined`:** Эти типы представляют отсутствие значения. По умолчанию `null` и `undefined` являются подтипами всех других типов. Однако при использовании флага `--strictNullChecks`, `null` и `undefined` становятся отдельными типами, и вы не можете присвоить их переменным других типов без явного указания возможности `null` или `undefined` (через union types, например, `string | null`).

    ```typescript
    let u: undefined = undefined;
    let n: null = null;

    // При --strictNullChecks:
    let name: string = "Alice";
    // name = null; // Ошибка: Type 'null' is not assignable to type 'string'.
    let nullableName: string | null = "Bob";
    nullableName = null;
    ```

* **`symbol`:** Уникальные и неизменяемые значения (ES2015).

    ```typescript
    let sym1: symbol = Symbol();
    let sym2: symbol = Symbol("key");
    // let sym3: symbol = Symbol("key");
    // if (sym2 === sym3) { // Ошибка: Operator '===' cannot be applied to types 'symbol' and 'symbol'.
    //   // ...
    // }
    ```

* **`void`:** Отсутствие возвращаемого значения функции.

    ```typescript
    function warnUser(): void {
      console.log("This is my warning message");
    }

    let unusable: void = undefined;
    // unusable = null; // Ошибка при --strictNullChecks
    ```

* **`any`:** Отключает проверку типов. Используйте с осторожностью, так как теряется преимущество статической типизации.

    ```typescript
    let notSure: any = 4;
    notSure = "maybe a string instead";
    notSure = false;

    // Вы можете вызывать методы на переменной типа any, даже если они не существуют
    // notSure.toFixed(); // Компилятор не выдаст ошибку
    ```

* **`unknown`:** Похож на `any`, но более безопасен. Переменным типа `unknown` нельзя присваивать значения произвольных типов и нельзя вызывать их методы без предварительной проверки типа.

    ```typescript
    let notKnown: unknown = 4;
    // notKnown.toFixed(); // Ошибка: Object is of type 'unknown'.

    if (typeof notKnown === "number") {
      notKnown.toFixed(); // Теперь безопасно
    }
    ```

* **`never`:** Тип, который никогда не может иметь значения. Используется для функций, которые всегда выбрасывают исключение или никогда не завершаются.

    ```typescript
    // Функция, которая всегда выбрасывает исключение
    function error(message: string): never {
      throw new Error(message);
    }

    // Функция, которая никогда не возвращает значение (бесконечный цикл)
    function infiniteLoop(): never {
      while (true) {}
    }

    // Переменная, которой невозможно присвоить значение
    let impossible: never;
    // impossible = 123; // Ошибка: Type 'number' is not assignable to type 'never'.
    ```

## Объектные типы (Object Types)

TypeScript позволяет описывать структуру объектов.

### Object

Непримитивный тип, представляющий любое значение, не являющееся примитивом.

```typescript
let obj: object = {};
obj = { name: "Alice" };
obj = [1, 2, 3];
// obj.name; // Ошибка: Property 'name' does not exist on type 'object'.
```

### Интерфейсы (Interfaces)

Интерфейсы определяют контракт, которому должен соответствовать объект. Они описывают именованные свойства и их типы.

```typescript
interface Person {
  name: string;
  age: number;
  greet?(phrase: string): void; // Необязательное свойство (с ?)
}

let user: Person = {
  name: "Bob",
  age: 30,
  greet(phrase) {
    console.log(`${phrase} ${this.name}`);
  },
};

function printPerson(person: Person) {
  console.log(`Name: ${person.name}, Age: ${person.age}`);
  if (person.greet) {
    person.greet("Hello");
  }
}

printPerson(user);
```

### Типы объектов (Object Types / Type Aliases)

Вы можете использовать ключевое слово `type` для создания псевдонимов для типов объектов.

```typescript
type Point = {
  x: number;
  y: number;
};

let p1: Point = { x: 10, y: 20 };

function printPoint(point: Point) {
  console.log(`X: ${point.x}, Y: ${point.y}`);
}

printPoint(p1);
```

Интерфейсы и типы объектов часто используются для одной и той же цели, но имеют некоторые отличия (например, интерфейсы могут быть объявлены несколько раз и автоматически объединяются, а типы объектов — нет).

## Массивы (Arrays)

TypeScript предоставляет два способа определения типов массивов:

```typescript
let list1: number[] = [1, 2, 3];
let list2: Array<number> = [1, 2, 3]; // Generic type

let list3: (string | number)[] = ["hello", 10, "world", 1]; // Массив, содержащий строки или числа
```

## Кортежи (Tuples)

Кортежи представляют собой массивы с фиксированным количеством элементов, где тип каждого элемента известен.

```typescript
let x: [string, number];
x = ["hello", 10]; // OK
// x = [10, "hello"]; // Ошибка: Type 'number' is not assignable to type 'string' and vice versa.
// x = ["hello", 10, true]; // Ошибка: Source has 3 element(s) but target allows only 2.

let color: [number, number, number] = [255, 0, 0]; // [red, green, blue]
```

## Перечисления (Enums)

Перечисления позволяют давать более понятные имена наборам числовых констант.

```typescript
enum Color {
  Red,   // 0 (по умолчанию)
  Green, // 1
  Blue   // 2
}

let c: Color = Color.Green;
console.log(c); // Выведет 1

enum Status {
  Pending = 10,
  Approved, // 11
  Rejected = 20
}

let status: Status = Status.Approved;
console.log(status); // Выведет 11

enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT",
}

let direction: Direction = Direction.Up;
console.log(direction); // Выведет "UP"
```

## Union Types

Union types позволяют переменной или параметру функции иметь один из нескольких указанных типов. Используется оператор `|`.

```typescript
function printId(id: number | string) {
  console.log(`ID is: ${id}`);
  // Сужаем тип перед использованием специфичных методов
  if (typeof id === "string") {
    console.log(id.toUpperCase());
  } else {
    console.log(id.toFixed());
  }
}

printId(101);
printId("202");
// printId(true); // Ошибка: Argument of type 'boolean' is not assignable to parameter of type 'string | number'.
```

## Intersection Types

Intersection types позволяют объединять несколько типов в один. Результирующий тип будет иметь все свойства объединенных типов. Используется оператор `&`.

```typescript
interface Colorful {
  color: string;
}

interface Circle {
  radius: number;
}

type ColorfulCircle = Colorful & Circle;

let cc: ColorfulCircle = {
  color: "red",
  radius: 10,
};
```

## Type Aliases

Как упоминалось ранее, `type` позволяет создавать псевдонимы для любых типов, не только для объектов.

```typescript
type StringOrNumber = string | number;
type Text = string;
type PointArray = [number, number];
```

## Generic Types

Дженерики (обобщенные типы) позволяют писать код, который может работать с различными типами, сохраняя при этом типовую безопасность. Они похожи на параметры функций, но параметризуют типы.

```typescript
function identity<T>(arg: T): T {
  return arg;
}

let output1 = identity<string>("hello"); // T будет string
let output2 = identity(123);           // TypeScript выведет тип самостоятельно (number)

interface Box<T> {
  value: T;
}

let stringBox: Box<string> = { value: "world" };
let numberBox: Box<number> = { value: 42 };
```

## Type Inference

TypeScript во многих случаях может автоматически выводить тип переменной или выражения на основе присвоенного значения или контекста.

```typescript
let message = "Hello"; // TypeScript выведет, что message имеет тип string
let count = 100;       // TypeScript выведет, что count имеет тип number

function add(a: number, b: number) {
  return a + b; // TypeScript выведет, что возвращаемый тип - number
}
```

Однако явное указание типов часто рекомендуется для лучшей читаемости и предотвращения неожиданного вывода типов.

## Type Assertions

Type assertions позволяют вам сообщить компилятору TypeScript о типе значения, если вы лучше знаете его тип, чем компилятор. Используется ключевое слово `as` или угловые скобки `<>`.

```typescript
let someValue: any = "this is a string";

let strLength1: number = (someValue as string).length;
let strLength2: number = (<string>someValue).length; // Аналогичный синтаксис (менее распространен в React/JSX)
```

Используйте type assertions с осторожностью, так как они не выполняют никакой проверки типа во время выполнения.

## Заключение

Система типов TypeScript является мощным инструментом, который помогает писать более безопасный, понятный и поддерживаемый код. Понимание различных типов и способов их использования является ключевым для эффективной работы с TypeScript.