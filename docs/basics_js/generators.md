---
title: Generators в JavaScript
description: Функции-генераторы, yield, async generators — создание последовательностей значений
---

<script setup>
import GeneratorsDemo from '../.vitepress/components/GeneratorsDemo.vue'
</script>

# Generators (Генераторы)

## Интерактивная демонстрация

<GeneratorsDemo />

Генераторы позволяют создавать функции, которые могут быть приостановлены и возобновлены, возвращая последовательность значений.

## Синтаксис генератора

Генератор определяется с использованием синтаксиса `function*` и ключевого слова `yield`:

```javascript
function* generateSequence() {
  yield 1;
  yield 2;
  return 3;
}
```

Когда вы вызываете генератор, он не выполняется сразу. Вместо этого он возвращает объект генератора.

## Использование генераторов

### Итерация с for...of

```javascript
function* generateSequence() {
  yield 1;
  yield 2;
  yield 3;
}

for(let value of generateSequence()) {
  console.log(value); // 1, затем 2, затем 3
}
```

### Генерация последовательности чисел

```javascript
function* generateSequence(start, end) {
  for (let i = start; i <= end; i++) {
    yield i;
  }
}

for(let value of generateSequence(1, 5)) {
  console.log(value); // 1, 2, 3, 4, 5
}
```

### Распаковка в массив

```javascript
let range = {
  from: 1,
  to: 5,

  *[Symbol.iterator]() {
    for(let value = this.from; value <= this.to; value++) {
      yield value;
    }
  }
};

console.log([...range]); // [1, 2, 3, 4, 5]
```

## Управление генератором

### Методы объекта генератора

```javascript
function* generate() {
  yield 1;
  yield 2;
  yield 3;
}

const gen = generate();

console.log(gen.next());    // { value: 1, done: false }
console.log(gen.next());    // { value: 2, done: false }
console.log(gen.next());    // { value: 3, done: false }
console.log(gen.next());    // { value: undefined, done: true }
```

### return() в генераторе

```javascript
function* generate() {
  yield 1;
  yield 2;
  yield 3;
}

const gen = generate();

gen.next();      // { value: 1, done: false }
gen.return();    // { value: undefined, done: true }
```

## Асинхронные генераторы

### async function*

Асинхронные генераторы позволяют использовать `await` внутри `yield`:

```javascript
async function* generateSequence(start, end) {
  for (let i = start; i <= end; i++) {
    // Можно использовать await!
    await new Promise(resolve => setTimeout(resolve, 1000));
    yield i;
  }
}
```

### Итерация с for await...of

```javascript
async function* generateSequence(start, end) {
  for (let i = start; i <= end; i++) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    yield i;
  }
}

(async () => {
  let generator = generateSequence(1, 5);
  for await (let value of generator) {
    console.log(value); // 1, затем 2, затем 3, затем 4, затем 5 (с задержкой)
  }
})();
```

## Практические примеры

### Бесконечный генератор ID

```javascript
function* idGenerator() {
  let id = 1;
  while (true) {
    yield id++;
  }
}

const ids = idGenerator();
console.log(ids.next().value);  // 1
console.log(ids.next().value);  // 2
console.log(ids.next().value);  // 3
```

### Генератор фибоначчи

```javascript
function* fibonacci(n) {
  let a = 0, b = 1;
  for (let i = 0; i < n; i++) {
    yield a;
    [a, b] = [b, a + b];
  }
}

for (let num of fibonacci(7)) {
  console.log(num); // 0, 1, 1, 2, 3, 5, 8
}
```

### Генератор с фильтрацией

```javascript
function* filterGenerator(array, predicate) {
  for (let item of array) {
    if (predicate(item)) {
      yield item;
    }
  }
}

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const evens = filterGenerator(numbers, n => n % 2 === 0);

for (let num of evens) {
  console.log(num); // 2, 4, 6, 8, 10
}
```

## Генераторы vs итераторы

| Характеристика | Iterator | Generator |
|---|---|---|
| Создание | Вручную с методом `next()` | Автоматически с `function*` |
| Синтаксис | `{ next() { } }` | `function*() { yield }` |
| Код | Больше кода | Меньше кода |
| Состояние | Управляется вручную | Управляется автоматически |

## Когда использовать

✅ **Используйте генераторы для:**
- Создания последовательностей значений
- Ленивых вычислений (значения создаются по мере необходимости)
- Работы с большими наборами данных (не нужно хранить всё в памяти)
- Асинхронных операций с `async function*`

❌ **Не используйте для:**
- Синхронных операций, где нужно всё сразу
- Простых итераций (лучше использовать `for...of`)

## Источник

Документация основана на [The Modern JavaScript Tutorial](https://javascript.info)
