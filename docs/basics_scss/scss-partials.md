---
description: "Partial файлы SCSS: модульная структура стилей, подчёркивание — архитектура CSS проекта"
---

# Частичные файлы (Partials) в SCSS

[Скачать PDF](./scss-partials.pdf)

## Что такое частичные файлы?

Частичные файлы (partials) в SCSS - это отдельные файлы, содержащие фрагменты SCSS-кода, которые можно импортировать в другие SCSS-файлы. Они помогают разделить код на модули, что делает его более организованным, поддерживаемым и повторно используемым.

## Именование частичных файлов

Частичные файлы начинаются с символа подчеркивания (`_`), что указывает компилятору SCSS не компилировать их в отдельные CSS-файлы:

```
_variables.scss
_mixins.scss
_reset.scss
_typography.scss
```

## Импорт частичных файлов

Для импорта частичных файлов используется директива `@import`. При импорте символ подчеркивания и расширение `.scss` можно опустить:

```scss
// Импорт частичных файлов
@import 'variables';
@import 'mixins';
@import 'reset';
@import 'typography';

// Основной код
body {
  background-color: $background-color;
  font-family: $font-family;
}
```

## Организация проекта с частичными файлами

### Базовая структура

```
styles/
|-- _variables.scss    # Переменные
|-- _mixins.scss       # Миксины
|-- _functions.scss    # Функции
|-- _reset.scss        # Сброс стилей
|-- _base.scss         # Базовые стили
|-- _typography.scss   # Типографика
|-- _buttons.scss      # Стили кнопок
|-- _forms.scss        # Стили форм
|-- main.scss          # Основной файл, импортирующий все частичные файлы
```

### Пример основного файла

```scss
// main.scss

// Основы
@import 'variables';
@import 'functions';
@import 'mixins';

// Сброс и базовые стили
@import 'reset';
@import 'base';
@import 'typography';

// Компоненты
@import 'buttons';
@import 'forms';
```

## Преимущества использования частичных файлов

1. **Модульность**
   - Разделение кода на логические части
   - Легче находить и обновлять определенные стили

2. **Повторное использование**
   - Частичные файлы можно использовать в нескольких проектах
   - Создание библиотек компонентов

3. **Командная работа**
   - Разные разработчики могут работать над разными файлами
   - Меньше конфликтов при слиянии кода

4. **Производительность**
   - Легче поддерживать небольшие файлы
   - Улучшенная читаемость кода

## Продвинутая организация проекта

### Структура по методологии 7-1

Популярный подход к организации SCSS-файлов - паттерн 7-1 (7 папок, 1 файл):

```
styles/
|-- abstracts/
|   |-- _variables.scss    # Переменные
|   |-- _functions.scss    # Функции
|   |-- _mixins.scss       # Миксины
|   |-- _placeholders.scss # Плейсхолдеры
|
|-- base/
|   |-- _reset.scss        # Сброс стилей
|   |-- _typography.scss   # Типографика
|   |-- _animations.scss   # Анимации
|   |-- _utilities.scss    # Утилиты
|
|-- components/
|   |-- _buttons.scss      # Кнопки
|   |-- _carousel.scss     # Карусель
|   |-- _forms.scss        # Формы
|   |-- _modal.scss        # Модальные окна
|
|-- layout/
|   |-- _header.scss       # Шапка
|   |-- _footer.scss       # Подвал
|   |-- _navigation.scss   # Навигация
|   |-- _grid.scss         # Сетка
|
|-- pages/
|   |-- _home.scss         # Стили для главной страницы
|   |-- _about.scss        # Стили для страницы "О нас"
|   |-- _contact.scss      # Стили для страницы контактов
|
|-- themes/
|   |-- _default.scss      # Тема по умолчанию
|   |-- _dark.scss         # Темная тема
|   |-- _admin.scss        # Тема для админки
|
|-- vendors/
|   |-- _bootstrap.scss    # Bootstrap
|   |-- _jquery-ui.scss    # jQuery UI
|
|-- main.scss              # Основной файл, импортирующий все частичные файлы
```

### Пример основного файла для структуры 7-1

```scss
// main.scss

// Абстракции
@import 'abstracts/variables';
@import 'abstracts/functions';
@import 'abstracts/mixins';
@import 'abstracts/placeholders';

// Сторонние библиотеки
@import 'vendors/bootstrap';
@import 'vendors/jquery-ui';

// Базовые стили
@import 'base/reset';
@import 'base/typography';
@import 'base/animations';
@import 'base/utilities';

// Компоненты
@import 'components/buttons';
@import 'components/carousel';
@import 'components/forms';
@import 'components/modal';

// Макет
@import 'layout/header';
@import 'layout/footer';
@import 'layout/navigation';
@import 'layout/grid';

// Страницы
@import 'pages/home';
@import 'pages/about';
@import 'pages/contact';

// Темы
@import 'themes/default';
@import 'themes/dark';
```

## Лучшие практики использования частичных файлов

1. **Следуйте принципу единой ответственности**
   - Каждый частичный файл должен отвечать за одну конкретную функциональность
   - Например, `_buttons.scss` должен содержать только стили для кнопок

2. **Используйте логичную структуру импортов**
   - Импортируйте файлы в порядке зависимостей
   - Сначала переменные, функции и миксины, затем остальные стили

3. **Документируйте свои частичные файлы**
   - Добавляйте комментарии в начале каждого файла, объясняющие его назначение
   - Используйте комментарии для разделения разделов внутри файлов

4. **Избегайте слишком больших файлов**
   - Если файл становится слишком большим, разделите его на несколько меньших
   - Например, `_forms.scss` можно разделить на `_inputs.scss`, `_checkboxes.scss` и т.д.

5. **Используйте индексные файлы для папок**
   - Создавайте `_index.scss` в каждой папке для импорта всех файлов из этой папки

```scss
// abstracts/_index.scss
@import 'variables';
@import 'functions';
@import 'mixins';
@import 'placeholders';

// main.scss
@import 'abstracts/index';
@import 'vendors/index';
@import 'base/index';
// и т.д.
```

## Пример содержимого частичных файлов

### _variables.scss

```scss
// Цвета
$color-primary: #3498db;
$color-secondary: #2ecc71;
$color-danger: #e74c3c;
$color-warning: #f39c12;
$color-info: #1abc9c;

// Оттенки серого
$color-black: #000;
$color-gray-dark: #333;
$color-gray: #666;
$color-gray-light: #999;
$color-white: #fff;

// Типографика
$font-family-base: 'Roboto', Arial, sans-serif;
$font-family-heading: 'Montserrat', sans-serif;

$font-size-base: 16px;
$font-size-small: 14px;
$font-size-large: 18px;
$font-size-h1: 32px;
$font-size-h2: 28px;
$font-size-h3: 24px;

// Интервалы
$spacing-xs: 4px;
$spacing-sm: 8px;
$spacing-md: 16px;
$spacing-lg: 24px;
$spacing-xl: 32px;

// Точки останова (breakpoints)
$breakpoints: (
  xs: 0,
  sm: 576px,
  md: 768px,
  lg: 992px,
  xl: 1200px
);
```

### _mixins.scss

```scss
// Медиа-запросы
@mixin media-up($breakpoint) {
  @if map-has-key($breakpoints, $breakpoint) {
    @media (min-width: map-get($breakpoints, $breakpoint)) {
      @content;
    }
  } @else {
    @error "Неизвестная точка останова: #{$breakpoint}.";
  }
}

// Флексбокс центрирование
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

// Кнопки
@mixin button($bg-color: $color-primary, $text-color: white, $padding: $spacing-sm $spacing-md) {
  display: inline-block;
  background-color: $bg-color;
  color: $text-color;
  padding: $padding;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  text-align: center;
  
  &:hover {
    background-color: darken($bg-color, 10%);
  }
  
  &:active {
    transform: translateY(1px);
  }
}
```

### _reset.scss

```scss
// Простой сброс стилей
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
}

ul, ol {
  list-style: none;
}

a {
  text-decoration: none;
  color: inherit;
}

button, input, select, textarea {
  font-family: inherit;
  font-size: inherit;
  color: inherit;
  border: none;
  outline: none;
}

img {
  max-width: 100%;
  height: auto;
}
```

### _buttons.scss

```scss
.btn {
  @include button;
  
  &--primary {
    @include button($color-primary);
  }
  
  &--secondary {
    @include button($color-secondary);
  }
  
  &--danger {
    @include button($color-danger);
  }
  
  &--warning {
    @include button($color-warning);
  }
  
  &--info {
    @include button($color-info);
  }
  
  &--small {
    padding: $spacing-xs $spacing-sm;
    font-size: $font-size-small;
  }
  
  &--large {
    padding: $spacing-md $spacing-lg;
    font-size: $font-size-large;
  }
  
  &--block {
    display: block;
    width: 100%;
  }
}
```

## Заключение

Частичные файлы - это мощный инструмент для организации SCSS-кода, который позволяет создавать модульные, поддерживаемые и масштабируемые таблицы стилей. Правильное использование частичных файлов может значительно улучшить структуру вашего проекта, упростить командную работу и сделать код более читаемым и поддерживаемым.

Разделение кода на логические модули с помощью частичных файлов - это одна из лучших практик в SCSS, которая особенно полезна для средних и больших проектов, где организация кода играет ключевую роль в успехе проекта.