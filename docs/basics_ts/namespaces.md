# Основы TypeScript: Пространства имен (Namespaces)

**Пространства имен** (namespaces) в TypeScript — это способ обернуть группу связанных переменных, функций, классов, интерфейсов и других пространств имен. Они помогают организовать код и предотвратить глобальные конфликты имен, предоставляя уровень инкапсуляции.

**Важно:** Хотя пространства имен по-прежнему поддерживаются в TypeScript, современные практики разработки часто склоняются к использованию **внешних модулей** (ECMAScript modules, использующих синтаксис `import` и `export`) для организации кода, особенно в крупных проектах. Внешние модули обеспечивают лучшую модульность и совместимость со стандартами JavaScript. Тем не менее, понимание пространств имен может быть полезным при работе с существующим кодом или для организации небольших фрагментов кода.

## Определение пространств имен

Пространства имен определяются с помощью ключевого слова `namespace`, за которым следует имя пространства имен и блок с объявлениями.

```typescript
namespace Geometry {
  export interface Point {
    x: number;
    y: number;
  }

  export class Line {
    p1: Point;
    p2: Point;

    constructor(p1: Point, p2: Point) {
      this.p1 = p1;
      this.p2 = p2;
    }

    length(): number {
      return Math.sqrt((this.p2.x - this.p1.x) ** 2 + (this.p2.y - this.p1.y) ** 2);
    }
  }
}

// Использование элементов пространства имен
let startPoint: Geometry.Point = { x: 0, y: 0 };
let endPoint: Geometry.Point = { x: 10, y: 10 };
let line = new Geometry.Line(startPoint, endPoint);
console.log(line.length()); // Выведет 14.142135623730951
```

В этом примере мы определили пространство имен `Geometry`, которое содержит интерфейс `Point` и класс `Line`. Чтобы сделать эти объявления доступными вне пространства имен, мы использовали ключевое слово `export`.

## Экспорт (`export`)

По умолчанию объявления внутри пространства имен являются приватными (доступными только внутри этого пространства имен). Чтобы сделать их доступными извне, необходимо использовать ключевое слово `export` перед объявлением.

## Вложенные пространства имен

Пространства имен могут быть вложенными друг в друга для дальнейшей организации кода.

```typescript
namespace Drawing {
  export namespace Shapes {
    export interface Circle {
      radius: number;
      getArea(): number;
    }

    export class CircleImpl implements Circle {
      radius: number;
      constructor(radius: number) {
        this.radius = radius;
      }
      getArea(): number {
        return Math.PI * this.radius ** 2;
      }
    }
  }

  export function drawCircle(circle: Shapes.Circle) {
    console.log(`Drawing a circle with area: ${circle.getArea()}`);
  }
}

let myCircle = new Drawing.Shapes.CircleImpl(5);
Drawing.drawCircle(myCircle); // Выведет "Drawing a circle with area: 78.53981633974483"
```

Здесь пространство имен `Drawing` содержит вложенное пространство имен `Shapes`, которое содержит интерфейс `Circle` и класс `CircleImpl`. Функция `drawCircle` также находится в пространстве имен `Drawing` и принимает аргумент типа `Drawing.Shapes.Circle`.

## Псевдонимы (`import ... = ...`)

Если вам приходится часто использовать длинные имена из пространства имен, вы можете создать для них более короткие псевдонимы с помощью синтаксиса `import ... = ...`.

```typescript
namespace Data {
  export namespace Users {
    export interface UserProfile {
      id: number;
      name: string;
      email: string;
    }

    export function getUserById(id: number): UserProfile | undefined {
      // ... логика получения пользователя
      return { id: id, name: "Test User", email: "test@example.com" };
    }
  }
}

// Создание псевдонима
import User = Data.Users.UserProfile;
import getUser = Data.Users.getUserById;

let user: User | undefined = getUser(123);
if (user) {
  console.log(user.name); // Выведет "Test User"
}
```

## Разделение пространства имен на несколько файлов

Большие пространства имен можно разделять на несколько файлов. Для этого необходимо использовать директиву `/// <reference path="..." />` в начале каждого файла, чтобы указать компилятору зависимость от других файлов, составляющих пространство имен. Кроме того, каждое объявление, которое должно быть доступно извне, должно быть помечено как `export`.

**Пример:**

**geometry.ts:**

```typescript
namespace Geometry {
  export interface Point {
    x: number;
    y: number;
  }
}
```

**line.ts:**

```typescript
/// <reference path="geometry.ts" />
namespace Geometry {
  export class Line {
    p1: Point;
    p2: Point;

    constructor(p1: Point, p2: Point) {
      this.p1 = p1;
      this.p2 = p2;
    }

    length(): number {
      return Math.sqrt((this.p2.x - this.p1.x) ** 2 + (this.p2.y - this.p1.y) ** 2);
    }
  }
}
```

При компиляции необходимо скомпилировать все файлы вместе (например, `tsc geometry.ts line.ts`).

## Пространства имен vs. Модули (ES Modules)

Как упоминалось ранее, современные JavaScript и TypeScript рекомендуют использовать систему модулей ECMAScript (ES Modules) для организации кода. Модули используют синтаксис `import` и `export` на уровне файлов и обеспечивают более строгую изоляцию и явные зависимости.

**Основные отличия:**

* **Область видимости:** Объявления в модулях являются локальными по умолчанию. Вам нужно явно экспортировать их, чтобы сделать доступными из других модулей. В пространствах имен объявления по умолчанию являются публичными внутри пространства имен и требуют `export` для доступа извне.
* **Загрузка:** Модули загружаются на уровне файлов и поддерживают статический анализ зависимостей (tree-shaking). Пространства имен объединяются в один глобальный объект или используют ссылки на файлы.
* **Современные стандарты:** Модули являются частью стандарта ECMAScript и широко поддерживаются современными браузерами и Node.js (через `import/export` или `require/module.exports`). Пространства имен являются специфичной для TypeScript конструкцией.

**Пример использования модулей:**

**point.ts:**

```typescript
export interface Point {
  x: number;
  y: number;
}
```

**line.ts:**

```typescript
import { Point } from './point';

export class Line {
  p1: Point;
  p2: Point;

  constructor(p1: Point, p2: Point) {
    this.p1 = p1;
    this.p2 = p2;
  }

  length(): number {
    return Math.sqrt((this.p2.x - this.p1.x) ** 2 + (this.p2.y - this.p1.y) ** 2);
  }
}
```

**main.ts:**

```typescript
import { Point } from './point';
import { Line } from './line';

let startPoint: Point = { x: 0, y: 0 };
let endPoint: Point = { x: 10, y: 10 };
let line = new Line(startPoint, endPoint);
console.log(line.length());
```

Для компиляции и запуска кода с использованием модулей обычно требуется настроить сборщик модулей (например, Webpack, Parcel) или использовать возможности Node.js или современных браузеров для работы с ES Modules.

## Когда использовать пространства имен?

В современных проектах на TypeScript рекомендуется использовать ES Modules для организации кода. Пространства имен могут быть полезны в следующих ситуациях:

* **Работа с устаревшим кодом:** Если вы поддерживаете или модифицируете большой кодовую базу, которая уже использует пространства имен.
* **Небольшие утилитарные скрипты:** Для организации небольшого количества связанных функций или классов без необходимости настройки системы модулей.
* **Создание декларативных файлов (`.d.ts`):** Иногда пространства имен используются в декларативных файлах для описания структуры существующих JavaScript-библиотек, которые не используют модули.

## Заключение

Пространства имен в TypeScript предоставляют способ организации кода и избежания конфликтов имен. Они позволяют группировать связанные объявления и контролировать их видимость с помощью ключевого слова `export`. Хотя пространства имен были важной частью TypeScript, современные практики разработки все больше склоняются к использованию ES Modules для лучшей модульности и совместимости. Понимание пространств имен может быть полезным при работе с существующим кодом, но для новых проектов рекомендуется использовать систему модулей ECMAScript.