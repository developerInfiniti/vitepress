# Модули в Node.js

Система модулей в Node.js — это механизм для организации и обмена кодом между различными частями приложения или между различными проектами. Модули позволяют разбивать большую кодовую базу на более мелкие, управляемые и повторно используемые файлы.

В Node.js существует два основных типа модулей:

1.  **Встроенные модули (Core Modules):** Это модули, которые поставляются вместе с Node.js и предоставляют доступ к системным функциям и API (например, работа с файловой системой, сетью, потоками и т.д.).
2.  **Внешние модули (External Modules):** Это сторонние библиотеки и пакеты, которые устанавливаются из npm (Node Package Manager) и используются для расширения функциональности Node.js приложений.

До недавнего времени (до появления стандарта ES Modules в JavaScript) в Node.js использовалась система модулей **CommonJS**. Однако Node.js также начал поддерживать **ES Modules** (ECMAScript Modules), стандартный формат модулей JavaScript, начиная с ECMAScript 2015.

## CommonJS (традиционная система модулей Node.js)

CommonJS — это синхронная система модулей, которая исторически использовалась в Node.js.

### Импорт модулей (`require`)

Для использования модуля (встроенного или внешнего) в CommonJS используется функция `require()`. Эта функция принимает путь к файлу модуля или имя пакета npm и возвращает объект `exports` этого модуля.

**Пример импорта встроенного модуля `fs` (работа с файловой системой):**

```javascript
const fs = require('node:fs'); // Рекомендуется использовать префикс 'node:' для встроенных модулей в современных версиях Node.js
```

```javascript
const fs = require('fs'); // Также работает для встроенных модулей
```

**Пример импорта внешнего модуля (предполагается, что установлен пакет `lodash`):**

```javascript
const _ = require('lodash');
```

### Экспорт модулей (`module.exports` и `exports`)

Для того чтобы сделать функции, объекты или значения доступными из вашего модуля, вы должны экспортировать их. В CommonJS это делается с помощью объекта `module.exports` или объекта `exports` (который изначально ссылается на `module.exports`).

**Способ 1: Присваивание значения `module.exports` (экспорт одного значения или объекта):**

```javascript
// my_module.js
const PI = 3.14159;

function calculateCircleArea(radius) {
  return PI * radius * radius;
}

module.exports = {
  PI: PI,
  calculateArea: calculateCircleArea
};
```

Или можно экспортировать непосредственно функцию:

```javascript
// my_module.js
module.exports = function greet(name) {
  return `Привет, ${name}!`;
};
```

**Способ 2: Добавление свойств к объекту `exports` (экспорт нескольких значений):**

```javascript
// my_module.js
exports.PI = 3.14159;

exports.calculateCircleArea = function(radius) {
  return exports.PI * radius * radius;
};

exports.greet = function(name) {
  return `Привет, ${name}!`;
};
```

**Важно:** Если вы присваиваете новое значение непосредственно `module.exports`, ссылка `exports` теряется, и ваш модуль будет экспортировать только то, что вы присвоили `module.exports`. Поэтому, если вы хотите экспортировать несколько именованных элементов, лучше использовать `exports.propertyName = value;` или присвоить объект с этими свойствами `module.exports`.

### Разрешение путей к модулям

Когда вы используете `require()`, Node.js пытается разрешить путь к модулю в следующем порядке:

1.  **Встроенные модули:** Сначала Node.js проверяет, является ли запрошенный идентификатор именем одного из встроенных модулей.
2.  **Относительные пути:** Если идентификатор начинается с `./` или `../`, Node.js интерпретирует его как относительный путь к файлу или каталогу модуля.
3.  **Абсолютные пути:** Если идентификатор начинается с `/`, Node.js интерпретирует его как абсолютный путь к файлу модуля.
4.  **`node_modules`:** Если идентификатор не является ни одним из вышеперечисленных, Node.js начинает поиск в каталоге `node_modules`:
    * Сначала в текущем каталоге проекта.
    * Затем в каталогах `node_modules` во всех родительских каталогах, поднимаясь вверх по дереву файловой системы, пока не достигнет корня или не найдет модуль.

При поиске в `node_modules` Node.js ищет каталог с именем запрошенного пакета, а затем ищет в этом каталоге файл `index.js` или файл, указанный в поле `main` файла `package.json` этого пакета.

## ES Modules (современная система модулей JavaScript)

ES Modules — это стандартизированная система модулей JavaScript, введенная в ECMAScript 2015. Node.js начал поддерживать ES Modules относительно недавно, и для их использования требуется определенная настройка.

### Импорт модулей (`import`)

Для импорта модулей в ES Modules используется ключевое слово `import`.

**Пример импорта по умолчанию:**

```javascript
// my_module.js
export default function greet(name) {
  return `Привет, ${name}!`;
}

// main.js
import greet from './my_module.js';
console.log(greet('мир'));
```

**Пример именованного импорта:**

```javascript
// my_module.js
export const PI = 3.14159;

export function calculateCircleArea(radius) {
  return PI * radius * radius;
}

// main.js
import { PI, calculateCircleArea } from './my_module.js';
console.log(PI);
console.log(calculateCircleArea(5));
```

**Импорт всего модуля в объект:**

```javascript
// my_module.js
export const PI = 3.14159;

export function calculateCircleArea(radius) {
  return PI * radius * radius;
}

// main.js
import * as myModule from './my_module.js';
console.log(myModule.PI);
console.log(myModule.calculateCircleArea(5));
```

### Экспорт модулей (`export` и `export default`)

Для экспорта значений в ES Modules используются ключевые слова `export` (для именованных экспортов) и `export default` (для экспорта по умолчанию).

**Именованные экспорты:**

```javascript
// my_module.js
export const MY_CONSTANT = 123;

export function myFunction() {
  console.log('Функция из модуля');
}

class MyClass {
  constructor(value) {
    this.value = value;
  }
}
export { MyClass };
```

**Экспорт по умолчанию (один экспорт на модуль):**

```javascript
// my_module.js
export default function greet(name) {
  return `Привет, ${name}!`;
}
```

### Настройка для использования ES Modules в Node.js

Чтобы Node.js интерпретировал файл как ES Module, необходимо выполнить одно из следующих условий:

1.  Файл должен иметь расширение `.mjs` (например, `my_module.mjs`).
2.  Ближайший родительский каталог должен содержать файл `package.json` с полем `"type": "module"`.

Если ни одно из этих условий не выполнено, Node.js будет интерпретировать файл как CommonJS модуль.

### Импорт CommonJS модулей из ES Modules

ES Modules могут импортировать CommonJS модули. При этом экспорты CommonJS модуля представляются как экспорт по умолчанию ES Module.

```javascript
// my_cjs_module.js (CommonJS)
module.exports = {
  value: 42,
  message: 'Привет из CommonJS!'
};

// my_esm_module.mjs (ES Module)
import cjsModule from './my_cjs_module.js';
console.log(cjsModule.value); // 42
console.log(cjsModule.message); // Привет из CommonJS!
```

### Импорт ES Modules из CommonJS модулей

Импорт ES Modules из CommonJS модулей является более сложным и не рекомендуется. Лучшим подходом является переход на использование ES Modules во всем проекте. Если это невозможно, можно использовать динамический импорт (`import()`), который возвращает промис.

```javascript
// my_cjs_module.js (CommonJS)
async function loadEsmModule() {
  try {
    const esmModule = await import('./my_esm_module.mjs');
    console.log(esmModule.myExport);
  } catch (err) {
    console.error('Ошибка при импорте ES Module:', err);
  }
}

loadEsmModule();
```

## Лучшие практики

* **Будьте последовательны:** Выберите одну систему модулей (CommonJS или ES Modules) и придерживайтесь ее в своем проекте. Для новых проектов рекомендуется использовать ES Modules из-за их стандартизации и современных возможностей.
* **Используйте осмысленные имена модулей и экспортов:** Это делает ваш код более понятным и поддерживаемым.
* **Разбивайте код на небольшие, логически связанные модули:** Это улучшает организацию кода и повторное использование.
* **Избегайте циклических зависимостей:** Циклические зависимости могут привести к непредсказуемому поведению и проблемам с разрешением модулей.

Понимание системы модулей в Node.js является ключевым для написания структурированного и поддерживаемого кода. Выбор между CommonJS и ES Modules зависит от требований проекта и личных предпочтений, но ES Modules становятся все более распространенными в современной разработке на JavaScript.