---
description: "TypeScript шпаргалка: типы, интерфейсы, generics, utility types — краткий справочник для разработчиков"
---

# Шпаргалка по TypeScript

Краткий справочник по основным возможностям TypeScript -- от базовых типов до продвинутых паттернов.

## Установка и запуск

```bash
# Установка
npm install -g typescript

# Компиляция файла
tsc app.ts

# Запуск с конфигурацией
tsc --project tsconfig.json

# Инициализация tsconfig.json
tsc --init

# Режим наблюдения
tsc --watch
```

## Базовые типы

```typescript
// Примитивы
let isDone: boolean = false;
let age: number = 25;
let name: string = "Alice";
let big: bigint = 100n;
let sym: symbol = Symbol("id");

// Специальные типы
let anything: any = 42;          // отключает проверку типов
let notKnown: unknown = "hello"; // безопасная альтернатива any
let nothing: void = undefined;   // отсутствие значения (для функций)
let impossible: never;           // тип, который не может существовать

// null и undefined
let u: undefined = undefined;
let n: null = null;
let nullable: string | null = null;
```

## Массивы и кортежи

```typescript
// Массивы
let numbers: number[] = [1, 2, 3];
let strings: Array<string> = ["a", "b", "c"];
let mixed: (string | number)[] = ["hello", 42];

// Кортежи (фиксированная длина и типы)
let pair: [string, number] = ["age", 25];
let rgb: [number, number, number] = [255, 128, 0];

// Именованные кортежи
type Point2D = [x: number, y: number];

// Кортежи с rest-элементами
type StringAndNumbers = [string, ...number[]];
let data: StringAndNumbers = ["sum", 1, 2, 3];

// Readonly кортеж
type ReadonlyPair = readonly [string, number];
```

## Объектные типы

```typescript
// Inline объектный тип
let user: { name: string; age: number; email?: string } = {
  name: "Bob",
  age: 30,
};

// Index signature
let dict: { [key: string]: number } = {
  apples: 5,
  oranges: 3,
};

// Readonly свойства
let config: { readonly host: string; readonly port: number } = {
  host: "localhost",
  port: 3000,
};
```

## Интерфейсы

```typescript
// Базовый интерфейс
interface User {
  id: number;
  name: string;
  email?: string;           // опциональное свойство
  readonly createdAt: Date; // только для чтения
}

// Наследование
interface Admin extends User {
  role: "admin" | "superadmin";
  permissions: string[];
}

// Множественное наследование
interface Auditable {
  updatedAt: Date;
  updatedBy: string;
}

interface AuditableAdmin extends Admin, Auditable {}

// Интерфейс функции
interface SearchFunc {
  (query: string, limit?: number): Promise<User[]>;
}

// Интерфейс с index signature
interface StringMap {
  [key: string]: string;
}

// Declaration merging (объединение деклараций)
interface Window {
  myCustomProp: string;
}
interface Window {
  anotherProp: number;
}
// Window теперь имеет оба свойства
```

## Type Aliases

```typescript
// Псевдоним для примитива
type ID = string | number;

// Псевдоним для объекта
type Point = {
  x: number;
  y: number;
};

// Объединение (Union)
type Status = "pending" | "active" | "disabled";
type Result = Success | Error;

// Пересечение (Intersection)
type Employee = Person & { company: string };

// Литеральные типы
type Direction = "up" | "down" | "left" | "right";
type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;

// Template Literal Types
type EventName = `on${Capitalize<string>}`;
type CSSUnit = `${number}${"px" | "em" | "rem" | "%"}`;
```

### Interface vs Type

| Критерий | `interface` | `type` |
|---|---|---|
| Объединение (union) | нет | `type A = B \| C` |
| Пересечение | `extends` | `&` |
| Declaration merging | да | нет |
| Примитивы, кортежи | нет | да |
| `implements` в классах | да | да (с ограничениями) |

## Функции

```typescript
// Типизация параметров и возвращаемого значения
function add(a: number, b: number): number {
  return a + b;
}

// Стрелочная функция
const multiply = (a: number, b: number): number => a * b;

// Опциональные параметры
function greet(name: string, greeting?: string): string {
  return `${greeting ?? "Hello"}, ${name}!`;
}

// Значения по умолчанию
function createUser(name: string, role: string = "user"): User {
  return { id: Date.now(), name, role };
}

// Rest-параметры
function sum(...numbers: number[]): number {
  return numbers.reduce((a, b) => a + b, 0);
}

// Перегрузка функций
function format(value: string): string;
function format(value: number): string;
function format(value: string | number): string {
  return String(value);
}

// Типизация this
function getArea(this: { width: number; height: number }): number {
  return this.width * this.height;
}

// void vs never
function log(msg: string): void {    // может вернуть undefined
  console.log(msg);
}
function throwError(msg: string): never {  // никогда не завершается
  throw new Error(msg);
}
```

## Классы

```typescript
class Animal {
  // Модификаторы доступа
  public name: string;
  protected sound: string;
  private _id: number;
  readonly species: string;

  // Статическое свойство
  static count: number = 0;

  constructor(name: string, sound: string, species: string) {
    this.name = name;
    this.sound = sound;
    this._id = ++Animal.count;
    this.species = species;
  }

  // Краткая форма через конструктор
  // constructor(public name: string, protected sound: string) {}

  // Геттер и сеттер
  get id(): number {
    return this._id;
  }

  // Метод
  speak(): string {
    return `${this.name} says ${this.sound}`;
  }

  // Статический метод
  static getCount(): number {
    return Animal.count;
  }
}

// Наследование
class Dog extends Animal {
  constructor(name: string) {
    super(name, "Woof", "Canis lupus");
  }

  fetch(item: string): string {
    return `${this.name} fetches ${item}`;
  }
}

// Абстрактный класс
abstract class Shape {
  abstract area(): number;
  abstract perimeter(): number;

  describe(): string {
    return `Area: ${this.area()}, Perimeter: ${this.perimeter()}`;
  }
}

class Circle extends Shape {
  constructor(private radius: number) {
    super();
  }
  area(): number {
    return Math.PI * this.radius ** 2;
  }
  perimeter(): number {
    return 2 * Math.PI * this.radius;
  }
}

// Реализация интерфейса
interface Serializable {
  serialize(): string;
}

class Product implements Serializable {
  constructor(public name: string, public price: number) {}

  serialize(): string {
    return JSON.stringify({ name: this.name, price: this.price });
  }
}
```

## Enums

```typescript
// Числовой enum
enum Direction {
  Up,     // 0
  Down,   // 1
  Left,   // 2
  Right,  // 3
}

// Строковый enum
enum Color {
  Red = "#FF0000",
  Green = "#00FF00",
  Blue = "#0000FF",
}

// Гетерогенный enum (не рекомендуется)
enum Mixed {
  No = 0,
  Yes = "YES",
}

// const enum (инлайнится при компиляции)
const enum HttpStatus {
  OK = 200,
  NotFound = 404,
  ServerError = 500,
}

// Альтернатива enum -- объект as const
const ROLES = {
  Admin: "admin",
  User: "user",
  Guest: "guest",
} as const;

type Role = (typeof ROLES)[keyof typeof ROLES];
// "admin" | "user" | "guest"
```

## Generics (Дженерики)

```typescript
// Функция с дженериком
function identity<T>(arg: T): T {
  return arg;
}

const str = identity<string>("hello");
const num = identity(42); // тип выводится автоматически

// Несколько параметров типа
function pair<K, V>(key: K, value: V): [K, V] {
  return [key, value];
}

// Ограничение дженерика (extends)
function getLength<T extends { length: number }>(arg: T): number {
  return arg.length;
}

getLength("hello");    // OK
getLength([1, 2, 3]);  // OK
// getLength(42);       // Ошибка: number не имеет свойства length

// Дженерик-интерфейс
interface Repository<T> {
  findById(id: string): T | null;
  findAll(): T[];
  save(entity: T): void;
  delete(id: string): void;
}

// Дженерик-класс
class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }
  pop(): T | undefined {
    return this.items.pop();
  }
  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }
}

// Дженерик с значением по умолчанию
interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  message: string;
}

// keyof с дженериком
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```

## Type Guards (Сужение типов)

```typescript
// typeof
function printValue(val: string | number) {
  if (typeof val === "string") {
    console.log(val.toUpperCase()); // val -- string
  } else {
    console.log(val.toFixed(2));    // val -- number
  }
}

// instanceof
function handleError(err: Error | string) {
  if (err instanceof Error) {
    console.log(err.message); // err -- Error
  } else {
    console.log(err);         // err -- string
  }
}

// in
interface Fish { swim(): void }
interface Bird { fly(): void }

function move(animal: Fish | Bird) {
  if ("swim" in animal) {
    animal.swim(); // animal -- Fish
  } else {
    animal.fly();  // animal -- Bird
  }
}

// Пользовательский type guard
function isString(val: unknown): val is string {
  return typeof val === "string";
}

if (isString(value)) {
  console.log(value.toUpperCase()); // value -- string
}

// Discriminated Union (размеченное объединение)
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; side: number }
  | { kind: "rectangle"; width: number; height: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.side ** 2;
    case "rectangle":
      return shape.width * shape.height;
  }
}

// Exhaustive check с never
function assertNever(x: never): never {
  throw new Error(`Unexpected: ${x}`);
}
```

## Type Assertions

```typescript
// as синтаксис
let value: unknown = "hello";
let len: number = (value as string).length;

// Угловые скобки (не работает в JSX)
let len2: number = (<string>value).length;

// const assertion (иммутабельное значение)
let point = { x: 10, y: 20 } as const;
// тип: { readonly x: 10; readonly y: 20 }

let colors = ["red", "green", "blue"] as const;
// тип: readonly ["red", "green", "blue"]

// satisfies (TS 5.0+) -- проверка типа без потери точности
type Colors = Record<string, string | number[]>;

const palette = {
  red: "#FF0000",
  green: [0, 255, 0],
} satisfies Colors;

palette.red.toUpperCase();    // OK -- тип сохранился как string
palette.green.map((c) => c);  // OK -- тип сохранился как number[]

// Non-null assertion
function getElement(id: string): HTMLElement {
  return document.getElementById(id)!; // утверждаем, что не null
}
```

## Utility Types (Вспомогательные типы)

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

// Partial<T> -- все свойства опциональные
type UpdateUser = Partial<User>;
// { id?: number; name?: string; email?: string; age?: number }

// Required<T> -- все свойства обязательные
type FullUser = Required<Partial<User>>;

// Readonly<T> -- все свойства readonly
type FrozenUser = Readonly<User>;

// Pick<T, K> -- выбрать определенные свойства
type UserPreview = Pick<User, "id" | "name">;
// { id: number; name: string }

// Omit<T, K> -- исключить определенные свойства
type UserWithoutEmail = Omit<User, "email">;
// { id: number; name: string; age: number }

// Record<K, T> -- создать тип с ключами K и значениями T
type UserRoles = Record<"admin" | "user" | "guest", User[]>;

// Exclude<T, U> -- исключить из объединения
type WithoutString = Exclude<string | number | boolean, string>;
// number | boolean

// Extract<T, U> -- извлечь из объединения
type OnlyString = Extract<string | number | boolean, string>;
// string

// NonNullable<T> -- исключить null и undefined
type Defined = NonNullable<string | null | undefined>;
// string

// ReturnType<T> -- тип возвращаемого значения функции
type FnReturn = ReturnType<() => Promise<User>>;
// Promise<User>

// Parameters<T> -- типы параметров функции
type FnParams = Parameters<(a: string, b: number) => void>;
// [string, number]

// InstanceType<T> -- тип экземпляра класса
type DateInstance = InstanceType<typeof Date>;
// Date

// Awaited<T> -- развернуть Promise
type ResolvedUser = Awaited<Promise<Promise<User>>>;
// User

// ConstructorParameters<T>
type DateArgs = ConstructorParameters<typeof Date>;
```

## Mapped Types (Связанные типы)

```typescript
// Базовый mapped type
type Stringify<T> = {
  [K in keyof T]: string;
};

// С модификаторами
type ReadonlyPartial<T> = {
  readonly [K in keyof T]?: T[K];
};

// Удаление модификаторов
type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
};

type Concrete<T> = {
  [K in keyof T]-?: T[K];
};

// Key remapping (as)
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type UserGetters = Getters<User>;
// { getId: () => number; getName: () => string; ... }

// Фильтрация ключей
type OnlyStrings<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K];
};
```

## Conditional Types (Условные типы)

```typescript
// Базовый условный тип
type IsString<T> = T extends string ? true : false;

type A = IsString<string>;  // true
type B = IsString<number>;  // false

// Distributive conditional type
type ToArray<T> = T extends any ? T[] : never;
type Arr = ToArray<string | number>; // string[] | number[]

// infer -- извлечение типа
type UnpackPromise<T> = T extends Promise<infer U> ? U : T;
type Unpacked = UnpackPromise<Promise<string>>; // string

type ArrayElement<T> = T extends (infer E)[] ? E : T;
type Elem = ArrayElement<number[]>; // number

// Извлечение типа возвращаемого значения
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

// Рекурсивные условные типы
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};
```

## Модули

```typescript
// Именованный экспорт
export const PI = 3.14;
export function sum(a: number, b: number): number {
  return a + b;
}
export interface Config {
  debug: boolean;
}

// Экспорт по умолчанию
export default class Logger {
  log(msg: string): void {
    console.log(msg);
  }
}

// Именованный импорт
import { PI, sum, type Config } from "./math";

// Импорт по умолчанию
import Logger from "./logger";

// Переименование
import { sum as add } from "./math";

// Импорт всего модуля
import * as MathUtils from "./math";

// Реэкспорт
export { sum } from "./math";
export { default as Logger } from "./logger";

// Динамический импорт
const module = await import("./heavy-module");

// Импорт только типов
import type { Config } from "./math";
```

## Декораторы (экспериментальные)

```typescript
// Декоратор класса
function Sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

@Sealed
class Greeter {
  greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }
}

// Декоратор метода
function Log(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const original = descriptor.value;
  descriptor.value = function (...args: any[]) {
    console.log(`Calling ${propertyKey} with`, args);
    return original.apply(this, args);
  };
}

class Calculator {
  @Log
  add(a: number, b: number): number {
    return a + b;
  }
}

// Декоратор свойства
function Required(target: any, propertyKey: string) {
  // логика валидации
}
```

## Namespaces

```typescript
namespace Validation {
  export interface Validator {
    validate(value: string): boolean;
  }

  export class EmailValidator implements Validator {
    validate(value: string): boolean {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }
  }

  export class PhoneValidator implements Validator {
    validate(value: string): boolean {
      return /^\+?\d{10,15}$/.test(value);
    }
  }
}

// Использование
const emailValidator = new Validation.EmailValidator();
emailValidator.validate("test@example.com"); // true
```

## Комментарии для компилятора

```typescript
// @ts-nocheck    -- отключить проверку всего файла
// @ts-check      -- включить проверку файла (в JS)
// @ts-ignore     -- игнорировать следующую строку
// @ts-expect-error -- ожидать ошибку на следующей строке (предпочтительнее @ts-ignore)
```

## Операторы

```typescript
// Nullish coalescing (??)
const value = input ?? "default"; // только null/undefined

// Optional chaining (?.)
const len = str?.length;
const result = obj?.method?.();
const item = arr?.[0];

// Non-null assertion (!)
const el = document.getElementById("app")!;

// Logical assignment
x &&= 5;   // x = x && 5
x ||= 5;   // x = x || 5
x ??= 5;   // x = x ?? 5

// keyof
type UserKeys = keyof User; // "id" | "name" | "email" | "age"

// typeof (в контексте типов)
const config = { port: 3000, host: "localhost" };
type ConfigType = typeof config;
// { port: number; host: string }

// Indexed access types
type UserName = User["name"]; // string
type UserField = User[keyof User]; // string | number
```

## Полезные паттерны

```typescript
// Строгая типизация объекта событий
type EventMap = {
  click: { x: number; y: number };
  focus: { target: HTMLElement };
  submit: { data: FormData };
};

function on<K extends keyof EventMap>(
  event: K,
  handler: (payload: EventMap[K]) => void
) {
  // ...
}

on("click", (payload) => {
  console.log(payload.x, payload.y); // типы автоматически выведены
});

// Builder паттерн с дженериками
class QueryBuilder<T> {
  private conditions: string[] = [];

  where(condition: string): this {
    this.conditions.push(condition);
    return this;
  }

  build(): string {
    return this.conditions.join(" AND ");
  }
}

// Брендированные типы (Branded Types)
type USD = number & { __brand: "USD" };
type EUR = number & { __brand: "EUR" };

function usd(amount: number): USD {
  return amount as USD;
}

const price: USD = usd(100);
// const invalid: EUR = price; // Ошибка

// Exhaustive switch
function handleStatus(status: "ok" | "error" | "loading"): string {
  switch (status) {
    case "ok":
      return "Success";
    case "error":
      return "Failed";
    case "loading":
      return "Loading...";
    default:
      const _exhaustive: never = status;
      return _exhaustive;
  }
}
```

## Конфигурация tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Ключевые опции strict

| Опция | Описание |
|---|---|
| `strictNullChecks` | null и undefined -- отдельные типы |
| `strictFunctionTypes` | строгая проверка типов функций |
| `strictPropertyInitialization` | свойства класса должны быть инициализированы |
| `noImplicitAny` | запрет неявного any |
| `noImplicitThis` | запрет неявного this |
| `alwaysStrict` | "use strict" во всех файлах |
