# CSS Units (Единицы измерения CSS)

[Завантажити PDF](./css-units.pdf)

## Введение
Единицы измерения в CSS определяют размеры элементов, отступы, шрифты и другие свойства. Правильный выбор единиц измерения критически важен для создания адаптивных и доступных веб-сайтов.

## Абсолютные единицы

Абсолютные единицы имеют фиксированный размер и не зависят от других факторов.

### px (пиксели)
Наиболее распространенная абсолютная единица измерения в веб-разработке.

```css
.element {
  width: 200px;
  border: 1px solid black;
}
```

### pt (пункты)
Традиционно используются в печатных материалах. 1pt = 1/72 дюйма.

```css
@media print {
  body {
    font-size: 12pt;
  }
}
```

### in (дюймы)
Равен 96px на экране.

```css
.page {
  margin: 0.5in; /* Для печати */
}
```

### cm (сантиметры)
1in = 2.54cm

```css
.element {
  margin: 1cm; /* Для печати */
}
```

### mm (миллиметры)
1cm = 10mm

```css
.element {
  border-width: 2mm; /* Для печати */
}
```

### pc (пики)
1pc = 12pt

```css
.element {
  margin: 1pc; /* Редко используется */
}
```

## Относительные единицы

Относительные единицы изменяют свой размер в зависимости от других факторов, что делает их идеальными для адаптивного дизайна.

### em
Относительно размера шрифта родительского элемента.

```css
.parent {
  font-size: 16px;
}

.child {
  font-size: 1.5em; /* 24px (16px * 1.5) */
  padding: 1em; /* 24px (относительно собственного размера шрифта) */
}

.grandchild {
  font-size: 1.5em; /* 36px (24px * 1.5) */
}
```

### rem
Относительно размера шрифта корневого элемента (обычно `<html>`).

```css
html {
  font-size: 16px;
}

.element {
  font-size: 1.5rem; /* 24px (16px * 1.5) */
  margin: 2rem; /* 32px (16px * 2) */
}

.nested {
  font-size: 1.5rem; /* Всё ещё 24px, не зависит от родителя */
}
```

### %
Относительно размера родительского элемента.

```css
.parent {
  width: 400px;
}

.child {
  width: 50%; /* 200px (400px * 0.5) */
  margin: 5%; /* 20px (400px * 0.05) */
}
```

### vw
Относительно 1% ширины области просмотра (viewport).

```css
.hero {
  height: 100vw; /* Высота равна ширине экрана */
  font-size: 5vw; /* Размер шрифта - 5% от ширины экрана */
}
```

### vh
Относительно 1% высоты области просмотра.

```css
.fullscreen {
  height: 100vh; /* Высота на весь экран */
}

.half-screen {
  height: 50vh; /* Половина высоты экрана */
}
```

### vmin
Относительно 1% от меньшего измерения области просмотра (ширины или высоты).

```css
.square {
  width: 50vmin;
  height: 50vmin; /* Всегда будет квадратом, 50% от меньшей стороны экрана */
}
```

### vmax
Относительно 1% от большего измерения области просмотра (ширины или высоты).

```css
.element {
  font-size: 5vmax; /* 5% от большей стороны экрана */
}
```

### ex
Относительно высоты символа "x" текущего шрифта.

```css
.element {
  margin-top: 2ex;
}
```

### ch
Относительно ширины символа "0" текущего шрифта.

```css
.narrow-paragraph {
  width: 60ch; /* Оптимальная ширина для чтения текста */
}
```

## Безразмерные единицы

### Числа
Используются для свойств, которые не требуют единиц измерения.

```css
.element {
  line-height: 1.5; /* Безразмерное значение */
  opacity: 0.8;
  z-index: 10;
}
```

## Углы

### deg (градусы)

```css
.rotated {
  transform: rotate(45deg);
}
```

### rad (радианы)

```css
.rotated {
  transform: rotate(1rad); /* примерно 57.3 градуса */
}
```

### grad (градиенты)

```css
.rotated {
  transform: rotate(50grad); /* 45 градусов */
}
```

### turn (обороты)

```css
.rotated {
  transform: rotate(0.25turn); /* 90 градусов */
}
```

## Время

### s (секунды)

```css
.element {
  transition: all 0.5s ease;
}
```

### ms (миллисекунды)

```css
.element {
  animation-duration: 500ms;
}
```

## Разрешение

### dpi (точек на дюйм)

```css
@media (min-resolution: 300dpi) {
  /* Стили для устройств с высоким разрешением */
}
```

### dpcm (точек на сантиметр)

```css
@media (min-resolution: 118dpcm) {
  /* Стили для устройств с высоким разрешением */
}
```

### dppx (точек на пиксель)

```css
@media (min-resolution: 2dppx) {
  /* Стили для устройств с высоким разрешением (Retina и т.п.) */
}
```

## Практические рекомендации

### Для типографики

```css
html {
  font-size: 16px; /* Базовый размер шрифта */
}

body {
  font-size: 1rem;
  line-height: 1.5;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

p {
  max-width: 70ch; /* Оптимальная длина строки для чтения */
  margin-bottom: 1.5rem;
}
```

### Для адаптивного дизайна

```css
.container {
  width: 100%;
  max-width: 1200px;
  padding: 0 5%;
  margin: 0 auto;
}

.responsive-font {
  font-size: clamp(1rem, 2.5vw, 2rem);
}

.hero-image {
  height: 50vh;
  min-height: 300px;
}
```

### Выбор правильных единиц

- **rem** для размеров шрифтов (для согласованности и доступности)
- **em** для отступов, связанных с текстом (padding, margin)
- **%** для ширины контейнеров и колонок
- **px** для границ, теней и мелких деталей
- **vh/vw** для элементов, которые должны масштабироваться относительно размера экрана
- **ch** для ширины текстовых блоков

### Пример комплексного использования

```css
:root {
  --base-font-size: 16px;
  --spacing-unit: 0.5rem;
}

html {
  font-size: var(--base-font-size);
}

body {
  font-size: 1rem;
  line-height: 1.5;
}

.container {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  padding: calc(var(--spacing-unit) * 2);
}

.hero {
  height: 80vh;
  padding: 5vh 5vw;
}

.card {
  width: 100%;
  border-radius: 0.25rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.card__title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.card__content {
  font-size: 1rem;
  max-width: 65ch;
}

@media (min-width: 768px) {
  .card {
    width: calc(50% - 1rem);
  }
}
```