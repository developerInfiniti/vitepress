# Основы SCSS

## Что такое SCSS?

SCSS (Sassy CSS) - это препроцессор CSS, который расширяет возможности обычного CSS. SCSS добавляет такие функции как переменные, вложенность, миксины, наследование и другие мощные инструменты, которые делают написание стилей более эффективным и поддерживаемым.

## Отличия от CSS

SCSS полностью совместим с синтаксисом CSS, но предоставляет дополнительные возможности:

- Переменные для хранения повторно используемых значений
- Вложенность селекторов для уменьшения повторений
- Миксины для повторного использования блоков стилей
- Функции для выполнения вычислений и манипуляций
- Операторы для математических операций
- Условные выражения и циклы

## Установка и компиляция

### Установка через npm

```bash
npm install -g sass
```

### Компиляция файла SCSS в CSS

```bash
sass input.scss output.css
```

### Автоматическая компиляция при изменении файла

```bash
sass --watch input.scss:output.css
```

### Компиляция директории

```bash
sass --watch app/sass:public/stylesheets
```

## Базовый синтаксис

### Комментарии

В SCSS можно использовать как однострочные, так и многострочные комментарии:

```scss
// Это однострочный комментарий, он не будет скомпилирован в CSS

/* 
  Это многострочный комментарий,
  он будет скомпилирован в CSS
*/
```

### Переменные

Переменные в SCSS начинаются с символа `$`:

```scss
$primary-color: #3498db;
$secondary-color: #2ecc71;
$font-stack: 'Helvetica', sans-serif;

body {
  font-family: $font-stack;
  color: $primary-color;
}
```

### Вложенность

SCSS позволяет вкладывать селекторы друг в друга:

```scss
nav {
  background-color: #333;
  
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  
  li {
    display: inline-block;
  }
  
  a {
    display: block;
    padding: 6px 12px;
    text-decoration: none;
    
    &:hover {
      color: white;
    }
  }
}
```

### Родительский селектор &

Символ `&` ссылается на родительский селектор:

```scss
.button {
  background-color: blue;
  
  &:hover {
    background-color: darkblue;
  }
  
  &.large {
    padding: 20px;
  }
  
  &-primary {
    background-color: green;
  }
}
```

## Преимущества использования SCSS

1. **Улучшенная организация кода** - вложенность помогает логически группировать связанные стили
2. **Повторное использование кода** - переменные и миксины уменьшают дублирование
3. **Модульность** - возможность разделить стили на отдельные файлы и импортировать их
4. **Математические операции** - выполнение вычислений непосредственно в стилях
5. **Условная логика** - применение стилей на основе условий

## Интеграция с фреймворками

SCSS легко интегрируется с популярными фреймворками и инструментами:

- **Vue.js** - через vue-cli или настройку webpack
- **React** - через create-react-app или настройку webpack
- **Angular** - встроенная поддержка SCSS
- **Webpack** - через sass-loader
- **Gulp** - через gulp-sass

## Пример простого проекта

```scss
// _variables.scss
$primary-color: #3498db;
$secondary-color: #2ecc71;
$danger-color: #e74c3c;
$text-color: #333;
$font-stack: 'Roboto', sans-serif;

// _mixins.scss
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

@mixin button($bg-color) {
  background-color: $bg-color;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: darken($bg-color, 10%);
  }
}

// main.scss
@import 'variables';
@import 'mixins';

body {
  font-family: $font-stack;
  color: $text-color;
  margin: 0;
  padding: 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}

.button {
  &-primary {
    @include button($primary-color);
  }
  
  &-secondary {
    @include button($secondary-color);
  }
  
  &-danger {
    @include button($danger-color);
  }
}

.flex-container {
  @include flex-center;
  flex-wrap: wrap;
}
```

## Заключение

SCSS - мощный инструмент, который значительно улучшает процесс написания CSS. Он позволяет писать более чистый, организованный и поддерживаемый код, экономя время разработчика и уменьшая количество повторений в стилях.