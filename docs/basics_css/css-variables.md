# CSS Variables (Переменные CSS)

## Введение
CSS-переменные (также известные как пользовательские свойства или CSS custom properties) позволяют определять значения, которые можно повторно использовать в таблице стилей. Они упрощают поддержку кода, делают его более читаемым и позволяют динамически изменять стили с помощью JavaScript.

## Объявление переменных

Переменные CSS объявляются с использованием двойного дефиса (`--`) в начале имени:

```css
:root {
  --primary-color: #3498db;
  --secondary-color: #2ecc71;
  --font-size-base: 16px;
  --spacing-unit: 8px;
}
```

Обычно переменные объявляются в селекторе `:root`, чтобы они были доступны глобально, но их можно объявлять и в любом другом селекторе для локального использования.

## Использование переменных

Для использования переменной применяется функция `var()`:

```css
.button {
  background-color: var(--primary-color);
  padding: var(--spacing-unit) calc(var(--spacing-unit) * 2);
  font-size: var(--font-size-base);
}

.alert {
  background-color: var(--secondary-color);
  padding: calc(var(--spacing-unit) * 2);
}
```

## Резервные значения

Функция `var()` может принимать второй параметр, который будет использоваться как резервное значение, если переменная не определена:

```css
.element {
  color: var(--text-color, #333);
}
```

Можно также использовать каскад резервных значений:

```css
.element {
  color: var(--specific-text-color, var(--general-text-color, #333));
}
```

## Область видимости переменных

Переменные CSS подчиняются правилам каскада и наследования:

```css
:root {
  --main-color: blue;
}

.container {
  --main-color: green; /* Переопределение для .container и его потомков */
}

.box {
  color: var(--main-color); /* Будет синим или зеленым в зависимости от родителя */
}
```

## Изменение переменных с помощью JavaScript

Одно из главных преимуществ CSS-переменных — возможность изменять их значения с помощью JavaScript:

```javascript
// Получение значения переменной
getComputedStyle(document.documentElement).getPropertyValue('--primary-color');

// Установка значения переменной
document.documentElement.style.setProperty('--primary-color', '#ff0000');
```

## Медиа-запросы и переменные

Переменные можно переопределять в медиа-запросах:

```css
:root {
  --container-width: 1200px;
}

@media (max-width: 1280px) {
  :root {
    --container-width: 960px;
  }
}

@media (max-width: 768px) {
  :root {
    --container-width: 100%;
  }
}

.container {
  width: var(--container-width);
}
```

## Темы с использованием переменных

Переменные CSS идеально подходят для реализации тем оформления:

```css
:root {
  /* Светлая тема (по умолчанию) */
  --bg-color: #ffffff;
  --text-color: #333333;
  --border-color: #dddddd;
}

.dark-theme {
  --bg-color: #121212;
  --text-color: #f0f0f0;
  --border-color: #444444;
}

body {
  background-color: var(--bg-color);
  color: var(--text-color);
}

.card {
  border: 1px solid var(--border-color);
}
```

Переключение темы с помощью JavaScript:

```javascript
document.body.classList.toggle('dark-theme');
```

## Системные темы

Можно автоматически применять темную или светлую тему в зависимости от настроек системы пользователя:

```css
:root {
  --bg-color: #ffffff;
  --text-color: #333333;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg-color: #121212;
    --text-color: #f0f0f0;
  }
}
```

## Практические советы

1. Используйте осмысленные имена для переменных, отражающие их назначение, а не значение.

```css
/* Хорошо */
--primary-color: #3498db;

/* Плохо */
--blue-color: #3498db;
```

2. Организуйте переменные по категориям:

```css
:root {
  /* Цвета */
  --color-primary: #3498db;
  --color-secondary: #2ecc71;
  --color-text: #333333;
  
  /* Размеры шрифтов */
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-md: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 24px;
  
  /* Отступы */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
}
```

3. Используйте вычисления для создания системы масштабирования:

```css
:root {
  --ratio: 1.5;
  --base-size: 16px;
  
  --size-1: var(--base-size);
  --size-2: calc(var(--size-1) * var(--ratio));
  --size-3: calc(var(--size-2) * var(--ratio));
  --size-4: calc(var(--size-3) * var(--ratio));
}
```

4. Для сложных проектов рассмотрите использование препроцессоров (Sass, Less) вместе с CSS-переменными для максимальной гибкости.

5. Помните о поддержке браузерами: CSS-переменные поддерживаются всеми современными браузерами, но не поддерживаются в IE11 и более ранних версиях.