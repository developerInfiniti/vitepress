---
description: "CSS Grid: области, линии, шаблоны, auto-fit — создание сложных двумерных макетов веб-страниц"
---

# CSS Grid Layout

## Введение

CSS Grid Layout - это мощный инструмент для создания двухмерных макетов в CSS. Он позволяет располагать элементы по строкам и столбцам, обеспечивая гибкость и контроль над структурой страницы.

## Основные понятия

*   **Grid Container**: Родительский элемент, к которому применено `display: grid` или `display: inline-grid`.
*   **Grid Item**: Непосредственные дочерние элементы Grid Container.
*   **Grid Line**: Горизонтальные и вертикальные линии, образующие структуру сетки.
*   **Grid Track**: Пространство между двумя соседними Grid Lines (строка или столбец).
*   **Grid Cell**: Наименьшая единица сетки, ограниченная четырьмя Grid Lines.
*   **Grid Area**: Прямоугольная область, состоящая из одной или нескольких Grid Cells.

## Создание Grid Container

Чтобы создать Grid Container, необходимо установить свойство `display` в значение `grid` или `inline-grid` для родительского элемента.

```css
.container {
  display: grid; /* или inline-grid */
}
```

## Определение структуры сетки

Структура сетки определяется с помощью свойств `grid-template-columns` и `grid-template-rows`.

```css
.container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr; /* Три столбца одинаковой ширины */
  grid-template-rows: auto auto; /* Две строки, высота определяется автоматически */
}
```

## Размещение элементов

Элементы размещаются в сетке с помощью свойств `grid-column-start`, `grid-column-end`, `grid-row-start` и `grid-row-end`, или сокращенной записи `grid-area`.

```css
.item {
  grid-column-start: 1;
  grid-column-end: 3;
  grid-row-start: 2;
  grid-row-end: 3;
  /* Или */
  grid-area: 2 / 1 / 3 / 3; /* row-start / column-start / row-end / column-end */
}
```

## Дополнительные свойства

*   `grid-gap`: Определяет расстояние между Grid Items.
*   `justify-items`: Выравнивание Grid Items по горизонтали внутри Grid Cell.
*   `align-items`: Выравнивание Grid Items по вертикали внутри Grid Cell.
*   `justify-content`: Выравнивание Grid Tracks по горизонтали внутри Grid Container.
*   `align-content`: Выравнивание Grid Tracks по вертикали внутри Grid Container.

## Примеры

### Простой пример сетки

```html
<div class="container">
  <div class="item">1</div>
  <div class="item">2</div>
  <div class="item">3</div>
  <div class="item">4</div>
</div>
```

```css
.container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 10px;
}

.item {
  padding: 20px;
  background-color: #eee;
  border: 1px solid #ccc;
  text-align: center;
}
```

## Заключение

CSS Grid Layout предоставляет мощные инструменты для создания сложных и адаптивных макетов. Изучение и практика с Grid помогут вам создавать современные веб-страницы с легкостью.
```