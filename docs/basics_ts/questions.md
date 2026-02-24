# Вопросы и ответы по TypeScript

Подборка популярных вопросов на собеседованиях по TypeScript с подробными ответами и примерами кода.

## 1. Основные типы

### Вопрос: В чём разница между `interface` и `type`?

```typescript
// Interface — описывает структуру объекта
interface User {
  name: string;
  age: number;
}

// Interface можно расширять (declaration merging)
interface User {
  email: string;
}

// Теперь User имеет name, age и email

// Type alias — может описывать любой тип
type ID = string | number;

type Point = {
  x: number;
  y: number;
};

// Type нельзя переопределить (declaration merging не работает)
// type ID = boolean; // Ошибка: Duplicate identifier 'ID'
```

**Пояснение**:
- `interface` поддерживает declaration merging (слияние деклараций)
- `type` может описывать union, intersection, примитивы, кортежи
- `interface` можно расширять через `extends`, `type` — через `&`
- Для объектов и классов предпочтительнее `interface`, для остального — `type`

### Вопрос: Что такое `unknown` и чем он отличается от `any`?

```typescript
// any — отключает проверку типов
let valueAny: any = 42;
valueAny.foo.bar; // Нет ошибки компиляции (но упадёт в runtime)
valueAny.toUpperCase(); // Нет ошибки

// unknown — безопасная альтернатива any
let valueUnknown: unknown = 42;
// valueUnknown.foo; // Ошибка: Object is of type 'unknown'
// valueUnknown.toUpperCase(); // Ошибка

// Нужно сузить тип перед использованием
if (typeof valueUnknown === 'string') {
  valueUnknown.toUpperCase(); // OK
}
```

**Пояснение**:
- `any` полностью отключает типизацию — можно делать что угодно
- `unknown` требует проверки типа перед использованием
- `unknown` — type-safe аналог `any`, рекомендуется использовать вместо `any`

## 2. Generics (обобщения)

### Вопрос: Реализуйте типизированную функцию `getProperty`

```typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const person = { name: 'Иван', age: 30, isAdmin: true };

const name = getProperty(person, 'name');    // тип: string
const age = getProperty(person, 'age');      // тип: number
// getProperty(person, 'email');             // Ошибка: 'email' не существует
```

**Пояснение**:
- `K extends keyof T` ограничивает ключ только существующими свойствами объекта
- `T[K]` — indexed access type, возвращает тип значения по ключу
- TypeScript автоматически выводит типы `T` и `K` из аргументов

### Вопрос: Что такое Generic Constraints и зачем они нужны?

```typescript
// Без ограничений — не знаем, есть ли свойство length
// function logLength<T>(arg: T): void {
//   console.log(arg.length); // Ошибка: Property 'length' does not exist
// }

// С ограничением
interface HasLength {
  length: number;
}

function logLength<T extends HasLength>(arg: T): void {
  console.log(arg.length); // OK
}

logLength('hello');      // 5
logLength([1, 2, 3]);    // 3
logLength({ length: 10 }); // 10
// logLength(42);         // Ошибка: number не имеет свойства length
```

**Пояснение**:
- `T extends HasLength` гарантирует, что тип имеет свойство `length`
- Это позволяет использовать generic с конкретными требованиями к типу
- Constraints делают generic-функции более предсказуемыми

## 3. Utility Types

### Вопрос: Реализуйте свой `Partial<T>` и `Required<T>`

```typescript
// Встроенный Partial делает все свойства опциональными
type MyPartial<T> = {
  [P in keyof T]?: T[P];
};

// Встроенный Required делает все свойства обязательными
type MyRequired<T> = {
  [P in keyof T]-?: T[P];
};

// Пример
interface Config {
  host: string;
  port: number;
  debug?: boolean;
}

type PartialConfig = MyPartial<Config>;
// { host?: string; port?: number; debug?: boolean; }

type RequiredConfig = MyRequired<Config>;
// { host: string; port: number; debug: boolean; }

function createConfig(overrides: MyPartial<Config>): Config {
  return {
    host: 'localhost',
    port: 3000,
    debug: false,
    ...overrides,
  };
}
```

### Вопрос: Реализуйте свой `Pick<T, K>` и `Omit<T, K>`

```typescript
// Pick — выбирает указанные свойства
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P];
};

// Omit — исключает указанные свойства
type MyOmit<T, K extends keyof T> = {
  [P in Exclude<keyof T, K>]: T[P];
};

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

type PublicUser = MyOmit<User, 'password'>;
// { id: number; name: string; email: string; }

type UserCredentials = MyPick<User, 'email' | 'password'>;
// { email: string; password: string; }
```

## 4. Type Guards (сужение типов)

### Вопрос: Какие способы сужения типов существуют в TypeScript?

```typescript
// 1. typeof
function processValue(value: string | number) {
  if (typeof value === 'string') {
    console.log(value.toUpperCase()); // string
  } else {
    console.log(value.toFixed(2)); // number
  }
}

// 2. instanceof
class Cat {
  meow() { console.log('Мяу!'); }
}

class Dog {
  bark() { console.log('Гав!'); }
}

function makeSound(animal: Cat | Dog) {
  if (animal instanceof Cat) {
    animal.meow();
  } else {
    animal.bark();
  }
}

// 3. in operator
interface Fish {
  swim: () => void;
}

interface Bird {
  fly: () => void;
}

function move(animal: Fish | Bird) {
  if ('swim' in animal) {
    animal.swim();
  } else {
    animal.fly();
  }
}

// 4. Пользовательский type guard (type predicate)
function isFish(animal: Fish | Bird): animal is Fish {
  return (animal as Fish).swim !== undefined;
}

const pet: Fish | Bird = { swim: () => console.log('Плыву') };

if (isFish(pet)) {
  pet.swim(); // TypeScript знает, что это Fish
}
```

### Вопрос: Что такое Discriminated Unions?

```typescript
// Дискриминированные объединения используют общее поле-дискриминант
interface Circle {
  kind: 'circle';
  radius: number;
}

interface Rectangle {
  kind: 'rectangle';
  width: number;
  height: number;
}

interface Triangle {
  kind: 'triangle';
  base: number;
  height: number;
}

type Shape = Circle | Rectangle | Triangle;

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2;
    case 'rectangle':
      return shape.width * shape.height;
    case 'triangle':
      return (shape.base * shape.height) / 2;
    default:
      // Exhaustive check — ошибка, если не все варианты обработаны
      const _exhaustive: never = shape;
      return _exhaustive;
  }
}
```

**Пояснение**:
- Поле `kind` — дискриминант, общее для всех типов в union
- TypeScript автоматически сужает тип в каждой ветке `switch`
- Паттерн `never` в `default` гарантирует обработку всех вариантов

## 5. Условные типы и infer

### Вопрос: Как работают условные типы?

```typescript
// Условный тип — тернарный оператор для типов
type IsString<T> = T extends string ? 'да' : 'нет';

type A = IsString<string>;   // 'да'
type B = IsString<number>;   // 'нет'
type C = IsString<'hello'>;  // 'да'

// Практический пример: извлечение типа элемента массива
type ElementType<T> = T extends (infer U)[] ? U : T;

type D = ElementType<string[]>;     // string
type E = ElementType<number[]>;     // number
type F = ElementType<boolean>;      // boolean (не массив — возвращает как есть)

// Извлечение типа возвращаемого значения функции
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function greet(name: string): string {
  return `Привет, ${name}!`;
}

type GreetReturn = MyReturnType<typeof greet>; // string
```

**Пояснение**:
- `T extends U ? X : Y` — если `T` расширяет `U`, то тип `X`, иначе `Y`
- `infer` позволяет извлечь тип из структуры
- Условные типы распределяются по union-типам (distributive conditional types)

### Вопрос: Что такое Template Literal Types?

```typescript
// Шаблонные литеральные типы
type Color = 'red' | 'green' | 'blue';
type Size = 'small' | 'medium' | 'large';

type Style = `${Size}-${Color}`;
// 'small-red' | 'small-green' | 'small-blue'
// | 'medium-red' | 'medium-green' | 'medium-blue'
// | 'large-red' | 'large-green' | 'large-blue'

// Практический пример: типизация событий
type EventName = 'click' | 'focus' | 'blur';
type EventHandler = `on${Capitalize<EventName>}`;
// 'onClick' | 'onFocus' | 'onBlur'

// Извлечение частей строки
type ExtractId<T extends string> =
  T extends `user_${infer Id}` ? Id : never;

type UserId = ExtractId<'user_123'>; // '123'
type Invalid = ExtractId<'admin_456'>; // never
```

## 6. Mapped Types

### Вопрос: Реализуйте тип, делающий все свойства readonly рекурсивно

```typescript
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object
    ? T[P] extends Function
      ? T[P]
      : DeepReadonly<T[P]>
    : T[P];
};

interface NestedConfig {
  database: {
    host: string;
    port: number;
    credentials: {
      user: string;
      password: string;
    };
  };
  features: string[];
}

type ReadonlyConfig = DeepReadonly<NestedConfig>;

const config: ReadonlyConfig = {
  database: {
    host: 'localhost',
    port: 5432,
    credentials: {
      user: 'admin',
      password: 'secret',
    },
  },
  features: ['auth', 'api'],
};

// config.database.host = 'remote'; // Ошибка: readonly
// config.database.credentials.user = 'root'; // Ошибка: readonly
```

### Вопрос: Как создать тип с динамическими ключами?

```typescript
// Record — создаёт тип с указанными ключами и значениями
type Roles = 'admin' | 'user' | 'guest';

type RolePermissions = Record<Roles, string[]>;

const permissions: RolePermissions = {
  admin: ['read', 'write', 'delete'],
  user: ['read', 'write'],
  guest: ['read'],
};

// Mapped type с преобразованием ключей (Key Remapping)
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

interface Person {
  name: string;
  age: number;
}

type PersonGetters = Getters<Person>;
// { getName: () => string; getAge: () => number; }
```

## 7. Классы и паттерны

### Вопрос: Реализуйте паттерн Singleton с TypeScript

```typescript
class Database {
  private static instance: Database;
  private connectionString: string;

  private constructor(connectionString: string) {
    this.connectionString = connectionString;
  }

  static getInstance(connectionString?: string): Database {
    if (!Database.instance) {
      Database.instance = new Database(connectionString || 'default');
    }
    return Database.instance;
  }

  query(sql: string): void {
    console.log(`[${this.connectionString}] Executing: ${sql}`);
  }
}

// const db = new Database('...'); // Ошибка: конструктор приватный
const db1 = Database.getInstance('postgres://localhost/mydb');
const db2 = Database.getInstance();

console.log(db1 === db2); // true
```

### Вопрос: Чем отличаются `abstract class` и `interface`?

```typescript
// Abstract class — может содержать реализацию
abstract class Animal {
  constructor(protected name: string) {}

  // Реализованный метод
  greet(): string {
    return `Я ${this.name}`;
  }

  // Абстрактный метод — должен быть реализован в подклассе
  abstract makeSound(): string;
}

class Cat extends Animal {
  makeSound(): string {
    return 'Мяу!';
  }
}

// Interface — только контракт, без реализации
interface Printable {
  print(): void;
}

// Класс может реализовать несколько интерфейсов
// но наследоваться только от одного абстрактного класса
class Report extends Animal implements Printable {
  makeSound(): string {
    return 'Шелест бумаги';
  }

  print(): void {
    console.log(`Отчёт: ${this.greet()}`);
  }
}
```

**Пояснение**:
- `abstract class` может содержать реализацию методов и свойства с модификаторами доступа
- `interface` описывает только контракт (форму)
- Класс наследует только один `abstract class`, но реализует множество `interface`
- `abstract class` компилируется в JavaScript-код, `interface` — стирается при компиляции

## 8. Продвинутые паттерны типов

### Вопрос: Как типизировать функцию с перегрузками?

```typescript
// Перегрузки функций
function parse(input: string): number;
function parse(input: number): string;
function parse(input: string | number): string | number {
  if (typeof input === 'string') {
    return parseInt(input, 10);
  }
  return input.toString();
}

const num = parse('42');    // тип: number
const str = parse(42);      // тип: string
// parse(true);              // Ошибка: нет подходящей перегрузки
```

### Вопрос: Что такое `satisfies` и когда его использовать?

```typescript
// satisfies проверяет тип без расширения
type Colors = Record<string, string | string[]>;

// С обычной аннотацией типа — теряем конкретный тип
const colorsTyped: Colors = {
  primary: 'red',
  secondary: ['green', 'blue'],
};
// colorsTyped.primary.toUpperCase(); // Ошибка: может быть string[]

// С satisfies — сохраняем точный тип
const colorsSatisfies = {
  primary: 'red',
  secondary: ['green', 'blue'],
} satisfies Colors;

colorsSatisfies.primary.toUpperCase();    // OK — TypeScript знает, что это string
colorsSatisfies.secondary.join(', ');     // OK — TypeScript знает, что это string[]
```

### Вопрос: Как работает `const` assertion?

```typescript
// Без as const — типы расширяются
const config1 = {
  endpoint: '/api',
  method: 'GET',
};
// тип: { endpoint: string; method: string; }

// С as const — литеральные типы + readonly
const config2 = {
  endpoint: '/api',
  method: 'GET',
} as const;
// тип: { readonly endpoint: '/api'; readonly method: 'GET'; }

// Полезно для создания enum-подобных объектов
const Direction = {
  Up: 'UP',
  Down: 'DOWN',
  Left: 'LEFT',
  Right: 'RIGHT',
} as const;

type DirectionType = typeof Direction[keyof typeof Direction];
// 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'

function move(direction: DirectionType) {
  console.log(`Движение: ${direction}`);
}

move(Direction.Up); // OK
// move('DIAGONAL'); // Ошибка
```

## Заключение

Советы для подготовки к собеседованию по TypeScript:
- Разберитесь в системе типов: `unknown` vs `any`, `never`, union/intersection
- Практикуйтесь в написании utility types с mapped types и conditional types
- Понимайте разницу между `interface` и `type`, `abstract class` и `interface`
- Изучите `infer`, template literal types и key remapping
- Умейте объяснить, как TypeScript выводит типы (type inference)
- Знайте, как работают type guards и discriminated unions

---
Удачи на собеседовании!
