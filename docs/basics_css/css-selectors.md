---
description: "CSS селекторы: комбинаторы, псевдоклассы, псевдоэлементы, атрибуты — точный выбор HTML элементов"
---

# CSS Selectors (Селекторы CSS)

## Введение
CSS-селекторы определяют, к каким HTML-элементам будут применяться стили. Понимание селекторов — основа работы с CSS и частый вопрос на собеседованиях.

## Базовые селекторы

### Универсальный селектор (`*`)
Выбирает все элементы на странице:

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
```

### Селектор по типу элемента
Выбирает все элементы указанного типа:

```css
p {
  line-height: 1.6;
}

h1 {
  font-size: 2rem;
}
```

### Селектор по классу (`.`)
Выбирает элементы с указанным классом:

```css
.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
}

.card.active {
  border-color: #3498db;
}
```

### Селектор по ID (`#`)
Выбирает элемент с указанным идентификатором:

```css
#header {
  position: sticky;
  top: 0;
}
```

### Селектор по атрибуту
Выбирает элементы с определённым атрибутом или его значением:

```css
/* Элементы с атрибутом disabled */
[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Точное совпадение значения */
[type="email"] {
  border-color: #3498db;
}

/* Значение начинается с */
[href^="https"] {
  color: green;
}

/* Значение заканчивается на */
[href$=".pdf"] {
  color: red;
}

/* Значение содержит подстроку */
[class*="btn"] {
  cursor: pointer;
}

/* Значение содержит слово (разделённое пробелами) */
[class~="featured"] {
  font-weight: bold;
}

/* Значение равно или начинается с (до дефиса) */
[lang|="en"] {
  quotes: "\201C" "\201D";
}
```

## Комбинаторы

### Потомок (пробел)
Выбирает все вложенные элементы на любом уровне:

```css
.nav a {
  text-decoration: none;
}
```

### Дочерний элемент (`>`)
Выбирает только прямых потомков:

```css
.menu > li {
  display: inline-block;
}
```

### Соседний элемент (`+`)
Выбирает элемент, идущий сразу после указанного:

```css
h2 + p {
  margin-top: 0;
  font-size: 1.1rem;
}
```

### Общие сиблинги (`~`)
Выбирает все элементы-сиблинги после указанного:

```css
h2 ~ p {
  color: #555;
}
```

## Псевдоклассы

### Состояния элемента

```css
a:hover {
  color: #e74c3c;
}

a:visited {
  color: #8e44ad;
}

input:focus {
  outline: 2px solid #3498db;
  outline-offset: 2px;
}

input:focus-visible {
  outline: 2px solid #3498db;
}

button:active {
  transform: scale(0.98);
}

input:disabled {
  background-color: #eee;
}

input:checked + label {
  font-weight: bold;
}
```

### Структурные псевдоклассы

```css
/* Первый и последний дочерний элемент */
li:first-child {
  border-top: none;
}

li:last-child {
  border-bottom: none;
}

/* N-й дочерний элемент */
tr:nth-child(even) {
  background-color: #f9f9f9;
}

tr:nth-child(odd) {
  background-color: #fff;
}

/* Каждый третий элемент */
li:nth-child(3n) {
  color: #e74c3c;
}

/* Первые 3 элемента */
li:nth-child(-n+3) {
  font-weight: bold;
}

/* N-й с конца */
li:nth-last-child(2) {
  font-style: italic;
}

/* Единственный дочерний элемент */
p:only-child {
  font-size: 1.2rem;
}

/* Первый/последний определённого типа */
p:first-of-type {
  font-size: 1.1rem;
}

p:last-of-type {
  margin-bottom: 0;
}

/* N-й определённого типа */
img:nth-of-type(2n) {
  float: right;
}
```

### Логические псевдоклассы

```css
/* Отрицание */
:not(.hidden) {
  display: block;
}

input:not([type="submit"]):not([type="button"]) {
  border: 1px solid #ccc;
}

/* Совпадение с любым из списка */
:is(h1, h2, h3) {
  font-family: 'Georgia', serif;
}

/* То же, но без влияния на специфичность */
:where(h1, h2, h3) {
  margin-bottom: 1rem;
}

/* Элемент, содержащий указанные потомки */
:has(> img) {
  padding: 0;
}

/* Карточка, содержащая изображение */
.card:has(img) {
  grid-template-rows: auto 1fr;
}

/* label для валидного/невалидного input */
:has(input:invalid) {
  color: red;
}
```

### Псевдоклассы форм

```css
input:required {
  border-left: 3px solid #e74c3c;
}

input:optional {
  border-left: 3px solid #95a5a6;
}

input:valid {
  border-color: #2ecc71;
}

input:invalid {
  border-color: #e74c3c;
}

input:placeholder-shown {
  font-style: italic;
}

input:in-range {
  background-color: #eafaf1;
}

input:out-of-range {
  background-color: #fdedec;
}

input:read-only {
  background-color: #f5f5f5;
}
```

## Псевдоэлементы

```css
/* Содержимое до и после элемента */
.quote::before {
  content: "\201C";
  font-size: 2rem;
  color: #3498db;
}

.quote::after {
  content: "\201D";
  font-size: 2rem;
  color: #3498db;
}

/* Первая строка и первая буква */
p::first-line {
  font-weight: bold;
}

p::first-letter {
  font-size: 2rem;
  float: left;
  margin-right: 4px;
}

/* Выделенный текст */
::selection {
  background-color: #3498db;
  color: white;
}

/* Placeholder текст в input */
::placeholder {
  color: #aaa;
  font-style: italic;
}

/* Маркер списка */
li::marker {
  color: #3498db;
  font-weight: bold;
}
```

## Специфичность

Специфичность определяет приоритет применения стилей. Она вычисляется как кортеж `(a, b, c)`:

| Уровень | Селектор | Специфичность |
|---------|----------|---------------|
| Inline-стили | `style="..."` | `(1, 0, 0)` |
| ID | `#header` | `(0, 1, 0)` |
| Класс, атрибут, псевдокласс | `.card`, `[type]`, `:hover` | `(0, 0, 1)` |
| Элемент, псевдоэлемент | `div`, `::before` | `(0, 0, 0, 1)` |
| Универсальный | `*` | `(0, 0, 0)` |

### Примеры расчёта

```css
/* (0, 0, 1) — один класс */
.card { }

/* (0, 1, 0) — один ID */
#header { }

/* (0, 1, 1) — ID + класс */
#header .nav { }

/* (0, 0, 2) — два класса */
.card.active { }

/* (0, 1, 2) — ID + элемент + класс */
#main p.intro { }
```

### Особые правила

```css
/* !important перебивает любую специфичность (избегайте) */
.element {
  color: red !important;
}

/* :is() и :not() берут специфичность самого специфичного аргумента */
:is(.card, #header) { } /* специфичность как у #header: (0, 1, 0) */

/* :where() всегда имеет нулевую специфичность */
:where(#header, .card) { } /* специфичность: (0, 0, 0) */
```

## Практические советы

1. Избегайте чрезмерной вложенности селекторов — это увеличивает специфичность и затрудняет переопределение.
2. Предпочитайте классы вместо ID для стилизации — это упрощает повторное использование.
3. Используйте `:is()` для группировки и сокращения повторяющихся селекторов.
4. Используйте `:where()`, когда не хотите увеличивать специфичность.
5. Псевдокласс `:has()` — мощный инструмент для выбора родителя по содержимому (поддерживается во всех современных браузерах).
6. Избегайте `!important` — вместо этого повышайте специфичность селектора.
7. Для сброса стилей используйте низкоспецифичные селекторы через `:where()`.
8. Помните о порядке LVHA для ссылок: `:link`, `:visited`, `:hover`, `:active`.
