# Основы TypeScript: Type Assertions (Утверждения типа)

**Type assertions** (утверждения типа) в TypeScript — это способ сказать компилятору: "Я уверен, что это значение имеет определенный тип, поэтому обработай его как значение этого типа". Они похожи на приведение типов в других языках, но не выполняют никакой проверки типа во время выполнения (runtime). Type assertions — это чисто TypeScript-конструкция, которая влияет только на этапе компиляции.

## Синтаксис type assertions

Существует два основных синтаксиса для type assertions в TypeScript:

1.  **Синтаксис "as":** Это предпочтительный и более читаемый синтаксис.

    ```typescript
    let someValue: any = "this is a string";
    let strLength: number = (someValue as string).length;
    ```

2.  **Синтаксис "угловые скобки" (`<>`):** Этот синтаксис был распространен в ранних версиях TypeScript и может быть знаком разработчикам, пришедшим из других языков. Однако он может конфликтовать с JSX, поэтому синтаксис "as" обычно рекомендуется.

    ```typescript
    let someValue: any = "this is a string";
    let strLength: number = (<string>someValue).length;
    ```

Оба синтаксиса делают одно и то же.

## Когда использовать type assertions?

Type assertions полезны в ситуациях, когда TypeScript не может самостоятельно вывести правильный тип значения, но вы знаете, какой это тип. Это часто происходит в следующих случаях:

### 1. Когда вы знаете более конкретный тип, чем вывел TypeScript

Иногда TypeScript может вывести более общий тип, чем тот, который вам на самом деле известен.

```typescript
interface Person {
  name: string;
  age: number;
}

interface Employee extends Person {
  employeeId: string;
}

function getPerson(): Person {
  // Предположим, эта функция всегда возвращает Employee
  return { name: "Alice", age: 30, employeeId: "E123" };
}

let person = getPerson();
// console.log(person.employeeId); // Ошибка: Property 'employeeId' does not exist on type 'Person'.

let employee = person as Employee;
console.log(employee.employeeId); // OK, мы утверждаем, что person является Employee
```

В этом примере функция `getPerson` объявлена как возвращающая `Person`, но мы (как разработчики) знаем, что она всегда возвращает `Employee`. Type assertion `person as Employee` позволяет нам получить доступ к свойству `employeeId`.

### 2. Когда вы работаете с данными, полученными из внешнего источника (например, API)

Данные, полученные из API или других внешних источников, часто имеют тип `any`, так как TypeScript не может статически определить их структуру. Вы можете использовать type assertions, чтобы сообщить TypeScript, как структурированы эти данные.

```typescript
interface ApiResponse {
  userId: number;
  title: string;
  completed: boolean;
}

async function fetchTodo(id: number): Promise<ApiResponse> {
  const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`);
  const data = await response.json();
  return data as ApiResponse; // Утверждаем, что полученные данные соответствуют ApiResponse
}

fetchTodo(1).then(todo => {
  console.log(todo.title);
});
```

Здесь мы утверждаем, что данные, полученные из API, соответствуют интерфейсу `ApiResponse`.

### 3. Когда вы работаете с элементами DOM

TypeScript может вывести общий тип `Element` для элементов DOM, но вы часто знаете более конкретный тип (например, `HTMLInputElement`, `HTMLImageElement`).

```typescript
const inputElement = document.getElementById('username');

// console.log(inputElement.value); // Ошибка: Property 'value' does not exist on type 'HTMLElement'.

const typedInputElement = inputElement as HTMLInputElement;
console.log(typedInputElement.value); // OK

// Альтернативный синтаксис:
const anotherInputElement = <HTMLInputElement>document.getElementById('password');
console.log(anotherInputElement.value); // OK
```

## Ограничения type assertions

Важно понимать, что type assertions не выполняют никакой проверки типа во время выполнения. Они являются лишь способом сообщить компилятору о ваших предположениях относительно типа значения. Если ваше утверждение неверно, это может привести к ошибкам во время выполнения, даже если компилятор не выдал предупреждений.

```typescript
interface Cat {
  name: string;
  meow(): void;
}

interface Dog {
  name: string;
  bark(): void;
}

let animal: any = { name: "Whiskers", meow: () => console.log("Meow!") };

let cat = animal as Cat;
cat.meow(); // OK

let dog = animal as Dog;
// dog.bark(); // Ошибка во время выполнения: animal.bark is not a function
```

В этом примере мы утверждаем, что `animal` является `Dog`, хотя на самом деле это объект, соответствующий `Cat`. Компилятор не выдает ошибку, но попытка вызвать `dog.bark()` приводит к ошибке во время выполнения.

## Правила type assertions

TypeScript позволяет выполнять type assertions только в том случае, если супертип или подтип одного типа совместим с другим. Это означает, что вы не можете произвольно преобразовывать типы, которые не имеют никакого отношения друг к другу.

```typescript
let value: string = "hello";
// let numericValue: number = value as number; // Ошибка: Conversion of type 'string' to type 'number' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.

// Чтобы принудительно выполнить такое преобразование, сначала преобразуйте к `unknown`:
let numericValue: number = (value as unknown) as number;
```

Преобразование к `unknown` (или `any`) позволяет "обойти" систему типов TypeScript, но следует использовать его с осторожностью, так как это снижает типовую безопасность.

## Non-null assertion operator (`!`)

Существует также специальный оператор утверждения не-null (`!`). Он используется для того, чтобы сообщить компилятору, что значение не является `null` или `undefined`.

```typescript
let potentiallyNull: string | null = "hello";
console.log(potentiallyNull!.length); // Утверждаем, что potentiallyNull не null

potentiallyNull = null;
// console.log(potentiallyNull!.length); // Ошибка во время выполнения: Cannot read properties of null (reading 'length')
```

Оператор `!` полезен, когда вы уверены, что значение не является `null` или `undefined`, но компилятор не может это вывести. Как и обычные type assertions, он не выполняет проверки во время выполнения.

## Заключение

Type assertions в TypeScript — это мощный инструмент, который позволяет вам контролировать, как компилятор интерпретирует типы значений. Они полезны в ситуациях, когда вы обладаете большей информацией о типе, чем может вывести TypeScript. Однако важно использовать их с осторожностью и понимать, что они не обеспечивают никакой защиты во время выполнения. Неправильное использование type assertions может привести к ошибкам в вашем приложении.