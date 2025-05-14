# SCSS List Functions

SCSS предоставляет ряд встроенных функций для работы со списками (lists). Списки представляют собой упорядоченные наборы значений, разделенных пробелами или запятыми. Функции для работы со списками позволяют получать доступ к элементам, объединять списки, добавлять и удалять элементы, а также выполнять другие операции.

## Создание списков

Списки в SCSS могут быть созданы несколькими способами:

* **Разделение пробелами:** `$my-list: item1 item2 item3;`
* **Разделение запятыми:** `$another-list: value-a, value-b, value-c;`
* **Смешанное разделение:** `$mixed-list: one, two three four;` (SCSS интерпретирует это как `one, two, three, four`)

## Основные функции для работы со списками

### `nth()`

Возвращает элемент списка по указанному индексу. Индексы в SCSS начинаются с 1.

**Синтаксис:**

```scss
nth($list, $n)
```

* `$list`: Исходный список.
* `$n`: Индекс элемента, который нужно получить.

**Пример:**

```scss
$colors: red green blue;
$first-color: nth($colors, 1);   // Результат: red
$second-color: nth($colors, 2);  // Результат: green
$third-color: nth($colors, 3);   // Результат: blue
```

### `list-separator()`

Возвращает разделитель списка (`space` или `comma`).

**Синтаксис:**

```scss
list-separator($list)
```

* `$list`: Исходный список.

**Пример:**

```scss
$spaced-list: item1 item2 item3;
$comma-list: value-a, value-b, value-c;

$spaced-separator: list-separator($spaced-list); // Результат: space
$comma-separator: list-separator($comma-list); // Результат: comma
```

### `length()`

Возвращает количество элементов в списке.

**Синтаксис:**

```scss
length($list)
```

* `$list`: Исходный список.

**Пример:**

```scss
$sizes: small medium large xlarge;
$number-of-sizes: length($sizes); // Результат: 4
```

### `append()`

Добавляет одно или несколько значений в конец списка и возвращает новый список.

**Синтаксис:**

```scss
append($list, $val1, [$val2], ...)
```

* `$list`: Исходный список.
* `$val1`, `$val2`, ...: Значения, которые нужно добавить.

**Пример:**

```scss
$base-list: a b c;
$extended-list: append($base-list, d, e); // Результат: a b c d e
$single-append: append($base-list, f);    // Результат: a b c f

$comma-list: 1, 2, 3;
$append-comma: append($comma-list, 4);   // Результат: 1, 2, 3 4 (обратите внимание на разделитель)
$append-comma-force: append($comma-list, 4, comma); // Результат: 1, 2, 3, 4 (можно явно указать разделитель)
```

### `join()`

Объединяет два списка в один новый список. Можно указать разделитель для результирующего списка.

**Синтаксис:**

```scss
join($list1, $list2, [$separator])
```

* `$list1`: Первый список.
* `$list2`: Второй список.
* `$separator`: Необязательный разделитель для результирующего списка (`space` или `comma`). Если не указан, используется разделитель первого списка.

**Пример:**

```scss
$list1: 1 2;
$list2: 3 4;
$joined-list: join($list1, $list2);         // Результат: 1 2 3 4
$joined-comma: join($list1, $list2, comma); // Результат: 1, 2, 3, 4

$comma-list1: a, b;
$spaced-list2: c d;
$joined-mixed: join($comma-list1, $spaced-list2);       // Результат: a, b c d
$joined-mixed-comma: join($comma-list1, $spaced-list2, comma); // Результат: a, b, c, d
```

### `zip()`

Объединяет несколько списков в один многомерный список, где элементы с одинаковыми индексами из исходных списков объединяются в подсписки.

**Синтаксис:**

```scss
zip($list1, $list2, ...)
```

* `$list1`, `$list2`, ...: Списки для объединения.

**Пример:**

```scss
$names: John Jane Doe;
$ages: 30 25 40;
$cities: NewYork London Paris;

$zipped: zip($names, $ages, $cities);
// Результат: ("John" 30 "NewYork"), ("Jane" 25 "London"), ("Doe" 40 "Paris")
```

### `index()`

Возвращает индекс первого вхождения значения в списке. Если значение не найдено, возвращает `false`.

**Синтаксис:**

```scss
index($list, $value)
```

* `$list`: Исходный список.
* `$value`: Значение, индекс которого нужно найти.

**Пример:**

```scss
$fruits: apple banana orange grape;
$index-banana: index($fruits, banana); // Результат: 2
$index-kiwi: index($fruits, kiwi);   // Результат: false
```

### `set-nth()`

Заменяет элемент в списке по указанному индексу на новое значение и возвращает новый список.

**Синтаксис:**

```scss
set-nth($list, $n, $value)
```

* `$list`: Исходный список.
* `$n`: Индекс элемента, который нужно заменить.
* `$value`: Новое значение.

**Пример:**

```scss
$numbers: 1 2 3;
$updated-numbers: set-nth($numbers, 2, 10); // Результат: 1 10 3
```

### `slice()`

Извлекает подсписок из списка, начиная с указанного начального индекса и заканчивая конечным индексом.

**Синтаксис:**

```scss
slice($list, $start-at, [$end-at])
```

* `$list`: Исходный список.
* `$start-at`: Индекс начала подсписка.
* `$end-at`: Необязательный индекс конца подсписка. Если не указан, извлекаются элементы до конца списка.

**Пример:**

```scss
$items: a b c d e f;
$sublist1: slice($items, 2, 4);   // Результат: b c d
$sublist2: slice($items, 3);      // Результат: c d e f
$sublist3: slice($items, -3);     // Результат: d e f
$sublist4: slice($items, 1, -2);  // Результат: a b c d
```

## Использование списков в циклах (`@each`)

Списки часто используются вместе с директивой `@each` для итерации по их элементам.

**Синтаксис:**

```scss
@each $item in $list {
  // Стили, применяемые для каждого элемента $item
}
```

**Пример:**

```scss
$colors: red green blue yellow;

@each $color in $colors {
  .text-#{$color} {
    color: $color;
  }
}
```

Этот код создаст классы `.text-red`, `.text-green`, `.text-blue` и `.text-yellow` с соответствующими цветами текста.

## Заключение

Функции для работы со списками в SCSS предоставляют мощные инструменты для организации и манипулирования наборами значений. Они позволяют создавать более динамичные и гибкие стили, особенно при работе с повторяющимися элементами или наборами конфигураций.