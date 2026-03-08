---
title: Iterators в JavaScript
description: Итераторы, итерируемые объекты, протокол итерации, Symbol.iterator — полное руководство
---

<script setup>
import IteratorsDemo from '../.vitepress/components/IteratorsDemo.vue'
</script>

# Iterators (Итераторы)

## Интерактивная демонстрация

<IteratorsDemo />

Итератор — это объект, который определяет последовательность значений и потенциально возвращает значение при завершении. Итераторы реализуют **протокол итератора** через метод `next()`.

## Протокол итератора

Объект является итератором, если у него есть метод `next()`, который возвращает объект с двумя свойствами:

```js
{
  value: any,  // текущее значение
  done: boolean // true, если итерация завершена
}
```

### Простой итератор

```js
function createRangeIterator(start, end) {
  let current = start
  return {
    next() {
      if (current <= end) {
        return { value: current++, done: false }
      }
      return { value: undefined, done: true }
    }
  }
}

const it = createRangeIterator(1, 3)
console.log(it.next()) // { value: 1, done: false }
console.log(it.next()) // { value: 2, done: false }
console.log(it.next()) // { value: 3, done: false }
console.log(it.next()) // { value: undefined, done: true }
```

## Протокол итерируемого объекта (Iterable)

Объект является **итерируемым**, если у него есть метод `[Symbol.iterator]()`, возвращающий итератор:

```js
const range = {
  from: 1,
  to: 5,

  [Symbol.iterator]() {
    let current = this.from
    const last = this.to
    return {
      next() {
        if (current <= last) {
          return { value: current++, done: false }
        }
        return { value: undefined, done: true }
      }
    }
  }
}

for (const num of range) {
  console.log(num) // 1, 2, 3, 4, 5
}
```

## Встроенные итерируемые объекты

JavaScript имеет множество встроенных итерируемых объектов:

```js
// String
for (const char of 'Hello') {
  console.log(char) // H, e, l, l, o
}

// Array
for (const item of [10, 20, 30]) {
  console.log(item) // 10, 20, 30
}

// Map
const map = new Map([['a', 1], ['b', 2]])
for (const [key, value] of map) {
  console.log(key, value) // a 1, b 2
}

// Set
const set = new Set([1, 2, 3])
for (const value of set) {
  console.log(value) // 1, 2, 3
}
```

## Деструктуризация и spread с итераторами

Итерируемые объекты работают с spread-оператором и деструктуризацией:

```js
const range = {
  from: 1,
  to: 5,
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

// Spread в массив
const arr = [...range] // [1, 2, 3, 4, 5]

// Деструктуризация
const [first, second, ...rest] = range // 1, 2, [3, 4, 5]

// Array.from
const arr2 = Array.from(range) // [1, 2, 3, 4, 5]
```

## Бесконечные итераторы

Итераторы могут генерировать бесконечные последовательности:

```js
const naturalNumbers = {
  [Symbol.iterator]() {
    let n = 1
    return {
      next() {
        return { value: n++, done: false }
      }
    }
  }
}

// Берём только первые 5 значений
const first5 = []
for (const num of naturalNumbers) {
  first5.push(num)
  if (first5.length >= 5) break
}
console.log(first5) // [1, 2, 3, 4, 5]
```

::: warning Осторожно
Бесконечный итератор в `for...of` без `break` приведёт к зависанию. Всегда добавляйте условие выхода.
:::

## Пользовательские итерируемые классы

```js
class Fibonacci {
  constructor(limit) {
    this.limit = limit
  }

  [Symbol.iterator]() {
    let a = 0, b = 1, count = 0
    const limit = this.limit
    return {
      next() {
        if (count >= limit) {
          return { value: undefined, done: true }
        }
        count++
        const value = a
        ;[a, b] = [b, a + b]
        return { value, done: false }
      }
    }
  }
}

const fib = new Fibonacci(8)
console.log([...fib]) // [0, 1, 1, 2, 3, 5, 8, 13]

// Можно итерировать повторно
for (const num of fib) {
  console.log(num)
}
```

## Итератор с методом return()

Метод `return()` вызывается при досрочном выходе из цикла (`break`, `throw`):

```js
const resource = {
  [Symbol.iterator]() {
    let i = 0
    console.log('Ресурс открыт')
    return {
      next() {
        return i < 5
          ? { value: i++, done: false }
          : { value: undefined, done: true }
      },
      return() {
        console.log('Ресурс закрыт (очистка)')
        return { value: undefined, done: true }
      }
    }
  }
}

for (const val of resource) {
  if (val === 2) break // Вызовет return() — "Ресурс закрыт"
  console.log(val) // 0, 1
}
```

## Асинхронные итераторы

Для асинхронных данных используйте `Symbol.asyncIterator` и `for await...of`:

```js
const asyncRange = {
  from: 1,
  to: 5,

  [Symbol.asyncIterator]() {
    let current = this.from
    const last = this.to
    return {
      async next() {
        await new Promise(resolve => setTimeout(resolve, 500))
        if (current <= last) {
          return { value: current++, done: false }
        }
        return { value: undefined, done: true }
      }
    }
  }
}

;(async () => {
  for await (const num of asyncRange) {
    console.log(num) // 1, 2, 3, 4, 5 (с задержкой 500мс)
  }
})()
```

## Итераторы vs Генераторы

| Характеристика | Iterator | Generator |
|---|---|---|
| Создание | Вручную с `next()` | `function*` с `yield` |
| Синтаксис | Более подробный | Компактный |
| Состояние | Управляется вручную | Автоматическое |
| `return()` | Реализуете сами | Встроенный |
| Итерируемость | Нужен `[Symbol.iterator]` | Автоматически итерируемый |

```js
// Одна и та же логика — итератор vs генератор:

// Итератор
const rangeIterator = {
  [Symbol.iterator]() {
    let i = 1
    return {
      next() {
        return i <= 3
          ? { value: i++, done: false }
          : { value: undefined, done: true }
      }
    }
  }
}

// Генератор — проще
function* rangeGenerator() {
  yield 1
  yield 2
  yield 3
}

console.log([...rangeIterator])    // [1, 2, 3]
console.log([...rangeGenerator()]) // [1, 2, 3]
```

## Практические примеры

### Пагинация данных

```js
function createPaginator(data, pageSize) {
  return {
    [Symbol.iterator]() {
      let page = 0
      return {
        next() {
          const start = page * pageSize
          if (start >= data.length) {
            return { value: undefined, done: true }
          }
          page++
          return {
            value: data.slice(start, start + pageSize),
            done: false
          }
        }
      }
    }
  }
}

const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
for (const page of createPaginator(items, 3)) {
  console.log(page) // [1,2,3], [4,5,6], [7,8,9], [10]
}
```

### Связный список

```js
class LinkedList {
  constructor() {
    this.head = null
  }

  add(value) {
    this.head = { value, next: this.head }
  }

  [Symbol.iterator]() {
    let current = this.head
    return {
      next() {
        if (current) {
          const value = current.value
          current = current.next
          return { value, done: false }
        }
        return { value: undefined, done: true }
      }
    }
  }
}

const list = new LinkedList()
list.add(3)
list.add(2)
list.add(1)

console.log([...list]) // [1, 2, 3]
```

## Когда использовать

**Используйте итераторы для:**
- Ленивых вычислений — значения создаются по требованию
- Пользовательских структур данных с `for...of`
- Потоковой обработки больших данных
- Интеграции с spread, деструктуризацией, `Array.from`

**Используйте генераторы вместо итераторов, когда:**
- Логика простая и линейная
- Не нужен контроль над `return()`
- Хотите писать меньше кода
