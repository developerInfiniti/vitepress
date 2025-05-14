# Вложенность в SCSS

## Что такое вложенность?

Вложенность (nesting) - одна из самых полезных функций SCSS, которая позволяет вкладывать селекторы CSS друг в друга, отражая иерархию HTML и делая код более читаемым и организованным.

## Базовый синтаксис

Вместо того чтобы повторять родительский селектор для каждого дочернего элемента, вы можете вложить дочерние селекторы внутрь родительского:

```scss
// SCSS с вложенностью
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
    color: white;
  }
}

// Скомпилированный CSS
nav {
  background-color: #333;
}

nav ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

nav li {
  display: inline-block;
}

nav a {
  display: block;
  padding: 6px 12px;
  text-decoration: none;
  color: white;
}
```

## Родительский селектор &

Символ `&` ссылается на родительский селектор. Это особенно полезно для:

1. **Псевдоклассов и псевдоэлементов**
2. **Модификаторов класса**
3. **Создания селекторов с префиксом родителя**

```scss
.button {
  background-color: blue;
  color: white;
  
  // Псевдоклассы
  &:hover {
    background-color: darkblue;
  }
  
  &:active {
    transform: translateY(1px);
  }
  
  // Модификаторы класса
  &.large {
    padding: 20px 30px;
    font-size: 18px;
  }
  
  &.small {
    padding: 5px 10px;
    font-size: 12px;
  }
  
  // Селекторы с префиксом
  &-primary {
    background-color: blue;
  }
  
  &-secondary {
    background-color: gray;
  }
  
  // Родительские селекторы
  .dark-theme & {
    background-color: #222;
    color: #eee;
  }
}
```

Скомпилированный CSS:

```css
.button {
  background-color: blue;
  color: white;
}

.button:hover {
  background-color: darkblue;
}

.button:active {
  transform: translateY(1px);
}

.button.large {
  padding: 20px 30px;
  font-size: 18px;
}

.button.small {
  padding: 5px 10px;
  font-size: 12px;
}

.button-primary {
  background-color: blue;
}

.button-secondary {
  background-color: gray;
}

.dark-theme .button {
  background-color: #222;
  color: #eee;
}
```

## Вложенность свойств

SCSS также позволяет вкладывать свойства CSS, которые имеют общий префикс:

```scss
.element {
  font: {
    family: 'Roboto', sans-serif;
    size: 16px;
    weight: 400;
    style: normal;
  }
  
  margin: {
    top: 10px;
    right: 20px;
    bottom: 10px;
    left: 20px;
  }
  
  border: 1px solid black {
    radius: 5px;
    left: {
      width: 2px;
      color: red;
    }
  }
}
```

Скомпилированный CSS:

```css
.element {
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  font-weight: 400;
  font-style: normal;
  
  margin-top: 10px;
  margin-right: 20px;
  margin-bottom: 10px;
  margin-left: 20px;
  
  border: 1px solid black;
  border-radius: 5px;
  border-left-width: 2px;
  border-left-color: red;
}
```

## Ограничения и проблемы вложенности

### Проблема чрезмерной вложенности

Хотя вложенность делает код более организованным, чрезмерная вложенность может привести к:

1. **Специфичным селекторам**, которые трудно переопределить
2. **Большому CSS-файлу** после компиляции
3. **Трудностям в поддержке** очень глубоко вложенного кода

```scss
// Пример чрезмерной вложенности - не рекомендуется
.header {
  .navigation {
    .list {
      .item {
        a {
          &:hover {
            color: red;
          }
        }
      }
    }
  }
}

// Компилируется в очень специфичный селектор:
// .header .navigation .list .item a:hover {
//   color: red;
// }
```

### Рекомендации по вложенности

1. **Ограничьте уровень вложенности** до 3-4 уровней
2. **Используйте BEM или другие методологии** для уменьшения необходимости в глубокой вложенности
3. **Разделяйте компоненты** на отдельные блоки стилей

## Примеры использования вложенности

### Пример с медиа-запросами

Вложенность особенно полезна для медиа-запросов:

```scss
.card {
  width: 100%;
  padding: 20px;
  
  @media (min-width: 768px) {
    width: 50%;
    padding: 30px;
  }
  
  @media (min-width: 1200px) {
    width: 33.333%;
    padding: 40px;
  }
  
  .card-title {
    font-size: 18px;
    
    @media (min-width: 768px) {
      font-size: 20px;
    }
  }
}
```

### Пример с BEM методологией

Вложенность хорошо работает с методологией BEM (Block, Element, Modifier):

```scss
.block {
  // Стили блока
  
  &__element {
    // Стили элемента
    
    &--modifier {
      // Стили модификатора элемента
    }
  }
  
  &--modifier {
    // Стили модификатора блока
  }
}
```

Пример с реальным компонентом:

```scss
.card {
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  &__header {
    padding: 15px;
    border-bottom: 1px solid #eee;
  }
  
  &__title {
    margin: 0;
    font-size: 18px;
    
    &--large {
      font-size: 24px;
    }
  }
  
  &__body {
    padding: 15px;
  }
  
  &__footer {
    padding: 15px;
    border-top: 1px solid #eee;
  }
  
  &--featured {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    
    .card__header {
      background-color: #f8f9fa;
    }
  }
}
```

## Заключение

Вложенность - одна из самых мощных функций SCSS, которая значительно улучшает организацию и читаемость кода. Она позволяет писать CSS в структуре, которая больше соответствует структуре HTML, делая код более интуитивно понятным и легким в поддержке. Однако важно использовать вложенность с умом, избегая чрезмерной вложенности, которая может привести к проблемам с поддержкой и производительностью.