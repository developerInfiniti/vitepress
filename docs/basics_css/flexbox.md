---
description: "CSS Flexbox: контейнер, элементы, выравнивание, порядок — построение гибких одномерных макетов страниц"
---

<script setup>
import { useLazyComponent } from '../.vitepress/composables/useLazyComponent'
const CSSPlayground = useLazyComponent(() => import('../.vitepress/components/CSSPlayground.vue'))
</script>

# Flexbox

<CSSPlayground />

Flexbox - это модуль CSS, который предоставляет эффективный способ для выравнивания, распределения пространства между элементами в контейнере, даже когда их размер неизвестен или динамический.

## Основные понятия

*   **Flex Container**: Родительский элемент, который использует flexbox. Устанавливается с помощью `display: flex` или `display: inline-flex`.
*   **Flex Items**: Дочерние элементы внутри flex container.

## Свойства Flex Container

*   `flex-direction`: Определяет направление flex items в контейнере. Возможные значения: `row` (по умолчанию), `column`, `row-reverse`, `column-reverse`.
*   `flex-wrap`: Определяет, должны ли flex items переноситься на новую строку, если они не помещаются в контейнере. Возможные значения: `nowrap` (по умолчанию), `wrap`, `wrap-reverse`.
*   `justify-content`: Определяет выравнивание flex items вдоль главной оси. Возможные значения: `flex-start`, `flex-end`, `center`, `space-between`, `space-around`, `space-evenly`.
*   `align-items`: Определяет выравнивание flex items вдоль поперечной оси. Возможные значения: `stretch` (по умолчанию), `flex-start`, `flex-end`, `center`, `baseline`.
*   `align-content`: Определяет выравнивание строк flex items, когда есть несколько строк. Работает аналогично `justify-content`, но для строк. Возможные значения: `stretch` (по умолчанию), `flex-start`, `flex-end`, `center`, `space-between`, `space-around`.

## Свойства Flex Items

*   `flex-grow`: Определяет, насколько flex item должен увеличиваться относительно других flex items в контейнере.
*   `flex-shrink`: Определяет, насколько flex item должен сжиматься относительно других flex items в контейнере.
*   `flex-basis`: Определяет начальный размер flex item перед распределением оставшегося пространства.
*   `flex`: Сокращенная запись для `flex-grow`, `flex-shrink` и `flex-basis`.
*   `align-self`: Позволяет переопределить выравнивание, установленное в `align-items` для конкретного flex item.

## Примеры

```css
.container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.item {
  flex-grow: 1;
}