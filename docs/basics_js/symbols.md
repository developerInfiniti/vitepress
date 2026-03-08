---
title: Symbols в JavaScript
description: Symbol — уникальный примитив, Symbol.for, well-known символы, практическое использование
---

<script setup>
import SymbolsDemo from '../.vitepress/components/SymbolsDemo.vue'
</script>

# Symbols (Символы)

## Интерактивная демонстрация

<SymbolsDemo />

**Symbol** — примитивный тип данных, введённый в ES6. Каждый символ **уникален** и может использоваться как ключ свойства объекта.

## Создание символов

```js
const sym1 = Symbol()
const sym2 = Symbol()
console.log(sym1 === sym2) // false — всегда уникальны

// С описанием (для отладки)
const id = Symbol('id')
console.log(id.toString())    // "Symbol(id)"
console.log(id.description)   // "id"
```

::: warning Важно
`Symbol` — не конструктор. Вызов `new Symbol()` выбросит `TypeError`.
:::

## Символы как ключи объектов

Символы не конфликтуют со строковыми ключами:

```js
const id = Symbol('id')

const user = {
  name: 'Иван',
  [id]: 123
}

console.log(user[id])   // 123
console.log(user.name)  // "Иван"

// Символьные свойства не видны в обычных перечислениях
console.log(Object.keys(user))           // ["name"]
console.log(JSON.stringify(user))        // {"name":"Иван"}
console.log(Object.getOwnPropertySymbols(user)) // [Symbol(id)]
```

## Symbol.for() — глобальный реестр

`Symbol.for(key)` создаёт символ в **глобальном реестре** или возвращает существующий:

```js
const s1 = Symbol.for('app.id')
const s2 = Symbol.for('app.id')
console.log(s1 === s2) // true — один и тот же символ

// Symbol.keyFor — получить ключ из реестра
console.log(Symbol.keyFor(s1)) // "app.id"

// Обычные символы не в реестре
const local = Symbol('local')
console.log(Symbol.keyFor(local)) // undefined
```

### Когда использовать Symbol.for()

- Для межмодульного обмена символами
- Для плагинов и библиотек, которые должны использовать общие ключи
- Когда нужен singleton-символ по строковому идентификатору

## Well-Known Symbols (Встроенные символы)

JavaScript определяет набор встроенных символов, которые управляют поведением объектов.

### Symbol.iterator

Определяет итератор для объекта. Используется в `for...of`, spread, деструктуризации:

```js
const range = {
  from: 1,
  to: 3,
  [Symbol.iterator]() {
    let current = this.from
    const last = this.to
    return {
      next() {
        return current <= last
          ? { value: current++, done: false }
          : { value: undefined, done: true }
      }
    }
  }
}

console.log([...range]) // [1, 2, 3]
```

### Symbol.hasInstance

Настраивает поведение `instanceof`:

```js
class Even {
  static [Symbol.hasInstance](num) {
    return typeof num === 'number' && num % 2 === 0
  }
}

console.log(2 instanceof Even)  // true
console.log(3 instanceof Even)  // false
```

### Symbol.toPrimitive

Определяет преобразование объекта в примитив:

```js
const money = {
  amount: 100,
  currency: 'USD',

  [Symbol.toPrimitive](hint) {
    if (hint === 'number') return this.amount
    if (hint === 'string') return `${this.amount} ${this.currency}`
    return this.amount // default
  }
}

console.log(+money)        // 100 (hint: "number")
console.log(`${money}`)   // "100 USD" (hint: "string")
console.log(money + 50)   // 150 (hint: "default")
```

### Symbol.toStringTag

Настраивает результат `Object.prototype.toString`:

```js
class MyClass {
  get [Symbol.toStringTag]() {
    return 'MyClass'
  }
}

const obj = new MyClass()
console.log(Object.prototype.toString.call(obj)) // "[object MyClass]"
```

### Symbol.species

Определяет конструктор для производных объектов:

```js
class MyArray extends Array {
  static get [Symbol.species]() {
    return Array // map/filter вернут обычный Array
  }
}

const arr = new MyArray(1, 2, 3)
const mapped = arr.map(x => x * 2)
console.log(mapped instanceof MyArray) // false
console.log(mapped instanceof Array)   // true
```

### Symbol.asyncIterator

Определяет асинхронный итератор для `for await...of`:

```js
const asyncData = {
  [Symbol.asyncIterator]() {
    let i = 0
    return {
      async next() {
        await new Promise(r => setTimeout(r, 100))
        return i < 3
          ? { value: i++, done: false }
          : { value: undefined, done: true }
      }
    }
  }
}

for await (const val of asyncData) {
  console.log(val) // 0, 1, 2
}
```

## Таблица Well-Known Symbols

| Символ | Назначение | Пример использования |
|--------|-----------|---------------------|
| `Symbol.iterator` | Итератор для `for...of` | Пользовательские коллекции |
| `Symbol.asyncIterator` | Асинхронный итератор | Потоковые данные |
| `Symbol.hasInstance` | Настройка `instanceof` | Проверка типов |
| `Symbol.toPrimitive` | Преобразование в примитив | Денежные объекты |
| `Symbol.toStringTag` | Тег для `toString` | Отладка |
| `Symbol.species` | Конструктор для производных | Расширение Array/Map |
| `Symbol.isConcatSpreadable` | Разворачивание в `concat` | Массивоподобные объекты |
| `Symbol.match` | Паттерн для `String.match` | Пользовательские регулярки |
| `Symbol.replace` | Логика для `String.replace` | Пользовательские замены |
| `Symbol.search` | Логика для `String.search` | Пользовательский поиск |
| `Symbol.split` | Логика для `String.split` | Пользовательское разделение |

## Практические примеры

### Приватные свойства (до #private)

```js
const _balance = Symbol('balance')

class BankAccount {
  constructor(initial) {
    this[_balance] = initial
  }

  deposit(amount) {
    this[_balance] += amount
  }

  get balance() {
    return this[_balance]
  }
}

const account = new BankAccount(100)
account.deposit(50)
console.log(account.balance)         // 150
console.log(account[_balance])       // 150 (доступно, если есть символ)
console.log(Object.keys(account))    // [] (не виден)
```

### Метаданные и расширения

```js
const meta = Symbol.for('metadata')

function addMeta(obj, data) {
  obj[meta] = data
  return obj
}

const user = addMeta({ name: 'Иван' }, {
  createdAt: Date.now(),
  version: 1
})

console.log(user.name)     // "Иван"
console.log(user[meta])    // { createdAt: ..., version: 1 }
console.log(JSON.stringify(user)) // {"name":"Иван"} — мета не попадёт
```

### Enum-подобные константы

```js
const Color = Object.freeze({
  RED: Symbol('RED'),
  GREEN: Symbol('GREEN'),
  BLUE: Symbol('BLUE')
})

function paint(color) {
  switch (color) {
    case Color.RED:   return '#ff0000'
    case Color.GREEN: return '#00ff00'
    case Color.BLUE:  return '#0000ff'
    default: throw new Error('Неизвестный цвет')
  }
}

paint(Color.RED)     // "#ff0000"
paint('RED')         // Error — строка !== Symbol
```

## Символы и сериализация

Символьные свойства **игнорируются** при:

- `JSON.stringify()`
- `Object.keys()`
- `for...in`
- `Object.assign()` (копирует символы!)

```js
const sym = Symbol('key')
const obj = { a: 1, [sym]: 2 }

JSON.stringify(obj)                    // '{"a":1}'
Object.keys(obj)                       // ["a"]
Object.getOwnPropertySymbols(obj)      // [Symbol(key)]
Reflect.ownKeys(obj)                   // ["a", Symbol(key)]

// Object.assign копирует символы
const copy = Object.assign({}, obj)
console.log(copy[sym]) // 2
```

## Когда использовать

**Используйте символы для:**
- Уникальных ключей, не конфликтующих со строками
- Реализации протоколов (`Symbol.iterator`, `Symbol.toPrimitive`)
- Метаданных, скрытых от обычного перечисления
- Enum-паттернов с гарантией уникальности

**Не используйте символы:**
- Для настоящей приватности (используйте `#private`)
- Когда строковые ключи достаточны
- Для данных, которые нужно сериализовать в JSON
