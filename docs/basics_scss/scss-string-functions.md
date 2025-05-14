# SCSS String Functions

SCSS предоставляет ряд встроенных функций для работы со строками. Эти функции позволяют объединять строки, извлекать подстроки, находить длину строки и выполнять другие полезные строковые операции непосредственно в вашем SCSS коде.

## Объединение строк (`str-insert()`, `str-slice()`, `str-replace()`)

### `str-insert()`

Вставляет одну строку в другую в указанной позиции.

**Синтаксис:**

```scss
str-insert($string, $insert, $index)
```

* `$string`: Исходная строка.
* `$insert`: Строка, которую нужно вставить.
* `$index`: Позиция (индекс) для вставки. Индексы начинаются с 1. Положительные индексы отсчитываются от начала строки, отрицательные - от конца.

**Примеры:**

```scss
$text: "Hello world";
$inserted: str-insert($text, ", SCSS", 6); // Результат: "Hello, SCSS world"
$inserted_end: str-insert($text, "!", -1); // Результат: "Hello world!"
```

### `str-slice()`

Извлекает подстроку из строки, начиная с указанного индекса и заканчивая другим указанным индексом.

**Синтаксис:**

```scss
str-slice($string, $start-at, [$end-at])
```

* `$string`: Исходная строка.
* `$start-at`: Индекс начала подстроки (начиная с 1).
* `$end-at`: Необязательный индекс конца подстроки. Если не указан, извлекается подстрока до конца исходной строки. Отрицательные индексы отсчитываются от конца строки.

**Примеры:**

```scss
$text: "Hello SCSS world";
$substring1: str-slice($text, 7, 10);   // Результат: "SCS"
$substring2: str-slice($text, 1, 5);    // Результат: "Hello"
$substring3: str-slice($text, 7);       // Результат: "SCSS world"
$substring4: str-slice($text, -5);      // Результат: "world"
$substring5: str-slice($text, -5, -1);   // Результат: "worl"
```

### `str-replace()`

Заменяет первое вхождение подстроки в строке на другую подстроку.

**Синтаксис:**

```scss
str-replace($string, $find, $replace)
```

* `$string`: Исходная строка.
* `$find`: Подстрока, которую нужно найти и заменить.
* `$replace`: Подстрока, на которую нужно заменить найденную подстроку.

**Примеры:**

```scss
$text: "Hello CSS world";
$replaced: str-replace($text, "CSS", "SCSS"); // Результат: "Hello SCSS world"

$text2: "apple banana apple";
$replaced_first: str-replace($text2, "apple", "orange"); // Результат: "orange banana apple"
```

## Поиск длины строки (`str-length()`)

### `str-length()`

Возвращает количество символов в строке.

**Синтаксис:**

```scss
str-length($string)
```

**Пример:**

```scss
$text: "SCSS";
$length: str-length($text); // Результат: 4
```

## Преобразование регистра (`to-upper-case()`, `to-lower-case()`)

### `to-upper-case()`

Преобразует строку в верхний регистр.

**Синтаксис:**

```scss
to-upper-case($string)
```

**Пример:**

```scss
$text: "scss";
$upper: to-upper-case($text); // Результат: "SCSS"
```

### `to-lower-case()`

Преобразует строку в нижний регистр.

**Синтаксис:**

```scss
to-lower-case($string)
```

**Пример:**

```scss
$text: "SCSS";
$lower: to-lower-case($text); // Результат: "scss"
```

## Получение слова по индексу (`word-at()`)

### `word-at()`

Возвращает слово из строки по указанному индексу. Слова разделяются пробелами или другими разделителями, которые SCSS распознает как разделители слов.

**Синтаксис:**

```scss
word-at($string, $index)
```

* `$string`: Исходная строка.
* `$index`: Индекс слова (начиная с 1).

**Примеры:**

```scss
$text: "Hello SCSS world";
$word1: word-at($text, 1); // Результат: "Hello"
$word2: word-at($text, 2); // Результат: "SCSS"
$word3: word-at($text, 3); // Результат: "world"

$text_with_hyphens: "font-size line-height color";
$word_hyphenated: word-at($text_with_hyphens, 1); // Результат: "font-size" (считается одним словом)
```

## Проверка типа значения (`type-of()`)

Хотя `type-of()` не является строго строковой функцией, она полезна для проверки, является ли значение строкой.

**Синтаксис:**

```scss
type-of($value)
```

**Пример:**

```scss
$text: "SCSS";
$number: 123;

@if type-of($text) == "string" {
  .text-element {
    content: $text;
  }
}

@if type-of($number) != "string" {
  .number-element {
    font-size: #{$number}px;
  }
}
```

## Заключение

Строковые функции в SCSS предоставляют базовые, но полезные инструменты для манипулирования текстовыми значениями в ваших стилях. Они могут быть использованы для динамического создания контента, изменения текста и выполнения других строковых операций непосредственно в процессе компиляции CSS.