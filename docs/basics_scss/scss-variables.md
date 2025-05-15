# Переменные в SCSS

[Завантажити PDF](./scss-variables.pdf)

## Что такое переменные в SCSS?

Переменные в SCSS позволяют хранить информацию, которую вы хотите использовать повторно в таблице стилей. Вы можете хранить такие значения как цвета, размеры шрифтов или любые другие значения CSS, которые вы хотите использовать многократно.

## Синтаксис

Переменные в SCSS начинаются с символа доллара `$`, за которым следует имя переменной:

```scss
$variable-name: value;
```

## Примеры использования

### Основные переменные

```scss
$primary-color: #3498db;
$secondary-color: #2ecc71;
$font-stack: 'Helvetica', Arial, sans-serif;
$base-font-size: 16px;
$spacing-unit: 10px;

body {
  font-family: $font-stack;
  font-size: $base-font-size;
  color: $primary-color;
  margin: $spacing-unit * 2;
}

.button {
  background-color: $secondary-color;
  padding: $spacing-unit $spacing-unit * 2;
}
```

## Область видимости переменных

Переменные в SCSS имеют область видимости. Переменные, объявленные на верхнем уровне файла, доступны глобально. Переменные, объявленные внутри селекторов, доступны только внутри этого селектора.

```scss
$global-color: #333; // глобальная переменная

.container {
  $local-padding: 20px; // локальная переменная
  padding: $local-padding;
  color: $global-color;
}

.other-container {
  // $local-padding не доступна здесь
  color: $global-color; // доступна глобальная переменная
}
```

## Переопределение переменных

Переменные в SCSS можно переопределять:

```scss
$color: #333;

.first-section {
  color: $color; // #333
}

$color: #666;

.second-section {
  color: $color; // #666
}
```

## Локальное переопределение с !default

Флаг `!default` позволяет установить значение переменной только если она не определена или имеет значение `null`:

```scss
$primary-color: #3498db !default;

// Если $primary-color уже определена, это объявление будет проигнорировано
// Если $primary-color не определена, ей будет присвоено значение #3498db
```

Это особенно полезно при создании библиотек или фреймворков, где вы хотите предоставить значения по умолчанию, но позволить пользователям переопределять их.

## Интерполяция переменных

Переменные можно использовать внутри селекторов и имен свойств с помощью интерполяции `#{$variable}`:

```scss
$property: color;
$direction: top;
$selector: "info";

.alert-#{$selector} {
  #{$property}: blue;
  margin-#{$direction}: 20px;
}

// Компилируется в:
// .alert-info {
//   color: blue;
//   margin-top: 20px;
// }
```

## Переменные и математические операции

С переменными можно выполнять математические операции:

```scss
$base-size: 16px;
$line-height: 1.5;

body {
  font-size: $base-size;
  line-height: $line-height;
  margin-bottom: $base-size * 2;
  padding: $base-size / 2;
}
```

## Типы данных в переменных

Переменные SCSS могут хранить различные типы данных:

```scss
// Числа (с единицами измерения или без)
$font-size: 16px;
$line-height: 1.5;

// Строки (с кавычками или без)
$font-family: "Helvetica", Arial, sans-serif;
$theme: dark;

// Цвета
$primary: #3498db;
$secondary: rgba(46, 204, 113, 0.8);

// Булевы значения
$is-important: true;

// Null
$border: null;

// Списки (разделенные пробелами или запятыми)
$padding: 10px 15px 20px 25px;
$font-stack: "Helvetica", Arial, sans-serif;

// Карты (пары ключ-значение)
$breakpoints: (
  small: 576px,
  medium: 768px,
  large: 992px,
  xlarge: 1200px
);
```

## Лучшие практики использования переменных

1. **Организация переменных**
   - Храните все глобальные переменные в отдельном файле (например, `_variables.scss`)
   - Группируйте связанные переменные с помощью комментариев или префиксов

2. **Именование переменных**
   - Используйте описательные имена, которые объясняют назначение переменной
   - Следуйте единому стилю именования (например, kebab-case: `$primary-color`)

3. **Создание системы переменных**
   - Создавайте иерархию переменных (базовые → производные)
   - Используйте карты для организации связанных значений

## Пример организации переменных

```scss
// _variables.scss

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

$line-height-base: 1.5;
$line-height-heading: 1.2;

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

// Контейнеры
$container-max-widths: (
  sm: 540px,
  md: 720px,
  lg: 960px,
  xl: 1140px
);

// Z-индексы
$z-index-dropdown: 1000;
$z-index-sticky: 1020;
$z-index-fixed: 1030;
$z-index-modal-backdrop: 1040;
$z-index-modal: 1050;
$z-index-popover: 1060;
$z-index-tooltip: 1070;
```

## Заключение

Переменные - одна из самых мощных функций SCSS, которая позволяет создавать более поддерживаемые и гибкие таблицы стилей. Они особенно полезны для создания согласованных тем, управления цветовыми схемами и упрощения обновлений дизайна. Правильное использование переменных может значительно улучшить организацию вашего CSS и сделать его более масштабируемым.