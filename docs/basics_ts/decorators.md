# Основы TypeScript: Декораторы (Decorators)

**Декораторы** — это функции, которые могут быть применены к объявлениям классов, методов, свойств или параметров. Они предоставляют синтаксически элегантный способ модифицировать или расширять поведение этих объявлений. Декораторы используют префикс `@` с последующим выражением, которое должно вычисляться в функцию, которая будет вызвана во время выполнения с информацией об объявлении, к которому применяется декоратор.

**Важно:** Поддержка декораторов должна быть явно включена в конфигурации компилятора TypeScript (`tsconfig.json`) путем установки флага `experimentalDecorators` в `true`.

```json
{
  "compilerOptions": {
    // ... другие настройки
    "experimentalDecorators": true
  }
}
```

## Типы декораторов

Существует четыре основных типа декораторов:

1.  **Декораторы классов (Class Decorators)**
2.  **Декораторы методов (Method Decorators)**
3.  **Декораторы аксессоров (Accessor Decorators)**
4.  **Декораторы свойств (Property Decorators)**
5.  **Декораторы параметров (Parameter Decorators)**

### 1. Декораторы классов (Class Decorators)

Декоратор класса применяется к конструктору класса. Он может использоваться для наблюдения, модификации или замены определения класса. Декоратор класса принимает один аргумент:

* **`constructor`:** Конструктор класса.

Если декоратор класса возвращает значение, оно заменяет определение класса.

```typescript
function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

@sealed
class Greeter {
  greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }
  greet() {
    return "Hello, " + this.greeting;
  }
}

// Попытка добавить свойство после применения декоратора (в режиме strict может вызвать ошибку)
// Greeter.prototype.farewell = function() { console.log("Goodbye!"); };

let greeter = new Greeter("world");
console.log(greeter.greet());
```

В этом примере декоратор `@sealed` делает конструктор и прототип класса `Greeter` "запечатанными", предотвращая добавление новых свойств или методов после создания класса.

### 2. Декораторы методов (Method Decorators)

Декоратор метода применяется к методу класса. Он может использоваться для наблюдения, модификации или замены определения метода. Декоратор метода принимает три аргумента:

* **`target`:** Прототип класса (для статических методов — конструктор класса).
* **`propertyKey`:** Имя метода.
* **`descriptor`:** Дескриптор свойства для метода (объект с свойствами `value`, `writable`, `enumerable`, `configurable`).

Если декоратор метода возвращает значение, оно используется как дескриптор свойства для метода.

```typescript
function enumerable(value: boolean) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.enumerable = value;
  };
}

class Point {
  constructor(private x: number, private y: number) {}

  @enumerable(false)
  getX() {
    return this.x;
  }

  @enumerable(true)
  getY() {
    return this.y;
  }
}

let point = new Point(10, 20);
for (let key in point) {
  console.log(key); // Выведет 'getY', но не 'getX' из-за декоратора
}
```

Декоратор `@enumerable` используется для установки свойства `enumerable` дескриптора метода. В примере метод `getX` не будет перечисляться при итерации по свойствам объекта `point`, а `getY` будет.

### 3. Декораторы аксессоров (Accessor Decorators)

Декоратор аксессора применяется к геттеру или сеттеру класса. Он может использоваться для наблюдения, модификации или замены определения аксессора. Декоратор аксессора принимает три аргумента, аналогичные декоратору метода:

* **`target`:** Прототип класса (для статических аксессоров — конструктор класса).
* **`propertyKey`:** Имя аксессора.
* **`descriptor`:** Дескриптор свойства для аксессора (объект с свойствами `get` и/или `set`, `enumerable`, `configurable`).

Если декоратор аксессора возвращает значение, оно используется как дескриптор свойства для аксессора.

```typescript
function logAccessor(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalGet = descriptor.get;
  if (originalGet) {
    descriptor.get = function () {
      console.log(`Getting value of ${propertyKey}`);
      return originalGet.call(this);
    };
  }
}

class Employee {
  private _fullName: string;
  constructor(name: string) {
    this._fullName = name;
  }

  @logAccessor
  get fullName(): string {
    return this._fullName;
  }

  set fullName(newName: string) {
    this._fullName = newName;
  }
}

let employee = new Employee("John Doe");
console.log(employee.fullName); // Выведет "Getting value of fullName" и затем "John Doe"
employee.fullName = "Jane Smith";
console.log(employee.fullName); // Выведет "Getting value of fullName" и затем "Jane Smith"
```

Декоратор `@logAccessor` добавляет логирование при обращении к геттеру `fullName`.

### 4. Декораторы свойств (Property Decorators)

Декоратор свойства применяется к свойству класса. Он может использоваться для наблюдения и, возможно, модификации определения свойства. Декоратор свойства принимает два аргумента:

* **`target`:** Прототип класса (для статических свойств — конструктор класса).
* **`propertyKey`:** Имя свойства.

Декоратор свойства не возвращает значение напрямую, но может использовать `Object.defineProperty` для изменения свойства на прототипе.

```typescript
function logProperty(target: any, propertyKey: string) {
  let value = target[propertyKey];

  const getter = function () {
    console.log(`Get: ${propertyKey} => ${value}`);
    return value;
  };

  const setter = function (newVal: any) {
    console.log(`Set: ${propertyKey} => ${newVal}`);
    value = newVal;
  };

  Object.defineProperty(target, propertyKey, {
    get: getter,
    set: setter,
    enumerable: true,
    configurable: true,
  });
}

class Person {
  @logProperty
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

let person = new Person("Alice");
console.log(person.name); // Выведет "Get: name => Alice" и затем "Alice"
person.name = "Bob"; // Выведет "Set: name => Bob"
console.log(person.name); // Выведет "Get: name => Bob" и затем "Bob"
```

Декоратор `@logProperty` добавляет геттер и сеттер к свойству `name`, которые логируют операции получения и установки значения.

### 5. Декораторы параметров (Parameter Decorators)

Декоратор параметра применяется к параметру функции (метода или конструктора). Он может использоваться для наблюдения за объявлением параметра. Декоратор параметра принимает три аргумента:

* **`target`:** Прототип класса (для статических методов/конструктора — конструктор класса).
* **`methodName`:** Имя метода (для конструктора — `undefined`).
* **`parameterIndex`:** Индекс параметра в списке параметров функции.

Декораторы параметров обычно используются для хранения метаданных о параметрах.

```typescript
import 'reflect-metadata';

function parameterInfo(target: any, methodName: string | symbol, paramIndex: number) {
  const existingParameters: number[] = Reflect.getMetadata("parameters", target, methodName) || [];
  existingParameters.push(paramIndex);
  Reflect.defineMetadata("parameters", existingParameters, target, methodName);
}

class Example {
  print(@parameterInfo message: string, @parameterInfo index: number) {
    // ...
  }
}

const metadata = Reflect.getMetadata("parameters", Example.prototype, "print");
console.log(metadata); // Выведет [ 0, 1 ]
```

В этом примере декоратор `@parameterInfo` использует библиотеку `reflect-metadata` (которая должна быть установлена и импортирована) для хранения информации об индексах параметров метода `print`.

## Фабрики декораторов (Decorator Factories)

Фабрика декораторов — это функция, которая возвращает декоратор. Они используются, когда вам нужно передать аргументы в ваш декоратор.

```typescript
function reportableClass(isReportable: boolean) {
  return function(constructor: Function) {
    if (isReportable) {
      console.log(`Class ${constructor.name} is reportable.`);
    }
  };
}

@reportableClass(true)
class Report {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}

@reportableClass(false)
class Unreportable {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}

// Выведет "Class Report is reportable."
```

`reportableClass` — это фабрика декораторов, которая принимает булевый аргумент и возвращает декоратор класса.

## Композиция декораторов (Decorator Composition)

К одному объявлению можно применить несколько декораторов. Они применяются сверху вниз, а их выполнение происходит снизу вверх.

```typescript
function first() {
  console.log("first(): factory");
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log("first(): called");
  };
}

function second() {
  console.log("second(): factory");
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log("second(): called");
  };
}

class ExampleClass {
  @first()
  @second()
  method() {
    console.log("method(): called");
  }
}

// Вывод:
// "first(): factory"
// "second(): factory"
// "second(): called"
// "first(): called"

let example = new ExampleClass();
example.method();
// Вывод:
// "method(): called"
```

## Заключение

Декораторы в TypeScript предоставляют мощный и элегантный способ метапрограммирования, позволяя добавлять или изменять поведение классов и их членов декларативным способом. Они могут быть полезны для реализации таких задач, как логирование, валидация, внедрение зависимостей, управление состоянием и многое другое, делая код более чистым и поддерживаемым. Однако важно помнить, что это экспериментальная возможность JavaScript, и их поведение может меняться в будущих стандартах. Использование `reflect-metadata` в сочетании с декораторами открывает еще больше возможностей для интроспекции и метаданных.