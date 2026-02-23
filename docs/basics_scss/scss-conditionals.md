# SCSS Условные Операторы (@if, @else if, @else)

[Скачать PDF](./scss-conditionals.pdf)

SCSS предоставляет мощные условные операторы, позволяющие стилизовать элементы в зависимости от определенных условий. Это делает ваш код более гибким и динамичным.

## Оператор `@if`

Оператор `@if` используется для выполнения блока стилей, только если заданное условие истинно (`true`).

**Синтаксис:**

```scss
@if <выражение> {
  // Блок стилей, который будет применен, если <выражение> истинно
}
````

**Пример:**

```scss
$theme: dark;

.button {
  padding: 10px 20px;
  border: 1px solid black;
  color: black;
  background-color: white;

  @if $theme == dark {
    color: white;
    background-color: black;
    border-color: white;
  }
}
```

В этом примере, если значение переменной `$theme` равно `dark`, то для класса `.button` будут применены темные стили (белый текст на черном фоне с белой границей).

## Оператор `@else if`

Оператор `@else if` позволяет проверить несколько условий последовательно. Блок стилей, следующий за `@else if`, будет выполнен, если предыдущее условие было ложным, а текущее истинно. Можно использовать несколько операторов `@else if`.

**Синтаксис:**

```scss
@if <выражение_1> {
  // Блок стилей, если <выражение_1> истинно
} @else if <выражение_2> {
  // Блок стилей, если <выражение_1> ложно и <выражение_2> истинно
} @else if <выражение_3> {
  // Блок стилей, если <выражение_1> и <выражение_2> ложны, а <выражение_3> истинно
}
```

**Пример:**

```scss
$status: warning;

.alert {
  padding: 15px;
  border: 1px solid gray;
  color: gray;
  background-color: lightgray;

  @if $status == success {
    color: green;
    background-color: lightgreen;
    border-color: green;
  } @else if $status == warning {
    color: orange;
    background-color: lightyellow;
    border-color: orange;
  } @else if $status == error {
    color: red;
    background-color: lightcoral;
    border-color: red;
  }
}
```

Здесь стили для класса `.alert` будут зависеть от значения переменной `$status`.

## Оператор `@else`

Оператор `@else` предоставляет блок стилей, который будет выполнен, если ни одно из предшествующих условий `@if` или `@else if` не было истинным. Оператор `@else` должен быть последним в цепочке условных операторов.

**Синтаксис:**

```scss
@if <выражение_1> {
  // Блок стилей, если <выражение_1> истинно
} @else if <выражение_2> {
  // Блок стилей, если <выражение_1> ложно и <выражение_2> истинно
} @else {
  // Блок стилей, если все предыдущие условия ложны
}
```

**Пример:**

```scss
$type: button;

.element {
  border: 1px solid black;
  padding: 10px;

  @if $type == button {
    background-color: blue;
    color: white;
  } @else if $type == link {
    text-decoration: underline;
    color: blue;
  } @else {
    background-color: lightgray;
    color: black;
  }
}
```

В этом примере, если `$type` не равно ни `button`, ни `link`, к элементу `.element` будут применены стили серого фона с черным текстом.

## Использование логических операторов

В условиях `@if` и `@else if` можно использовать логические операторы `and`, `or` и `not` для создания более сложных выражений.

**Пример:**

```scss
$theme: dark;
$important: true;

.notification {
  padding: 10px;
  border: 1px solid gray;
  color: gray;
  background-color: white;

  @if $theme == dark and $important == true {
    color: yellow;
    background-color: darkred;
    border-color: red;
    font-weight: bold;
  } @else if $theme == dark or $important == true {
    color: lightblue;
    background-color: darkslategray;
    border-color: lightslategray;
  } @else {
    // Стандартные стили
  }
}
```

## Заключение

Условные операторы в SCSS являются мощным инструментом для создания адаптивных и динамичных стилей. Они позволяют применять различные наборы стилей в зависимости от значений переменных или других условий, делая ваш CSS более организованным и легким в поддержке.
