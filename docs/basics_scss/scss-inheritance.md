# SCSS Наследование (@extend)

Директива `@extend` в SCSS позволяет одному селектору наследовать стили другого селектора. Это мощный инструмент для переиспользования стилей и создания более модульного и поддерживаемого CSS.

## Базовое использование

Чтобы заставить один селектор наследовать стили другого, используйте `@extend` после имени селектора, который вы хотите наследовать.

**Синтаксис:**

```scss
.selector1 {
  // Основные стили
}

.selector2 {
  @extend .selector1;
  // Дополнительные стили для selector2
}
```

В этом примере `.selector2` унаследует все стили, определенные для `.selector1`, а затем применит свои собственные дополнительные стили.

**Пример:**

```scss
.button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: blue;
  color: white;
  font-size: 16px;
  cursor: pointer;
}

.button-primary {
  @extend .button;
  background-color: green;
}

.button-secondary {
  @extend .button;
  background-color: gray;
  color: black;
}
```

При компиляции этого SCSS в CSS вы получите:

```css
.button, .button-primary, .button-secondary {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: blue;
  color: white;
  font-size: 16px;
  cursor: pointer;
}

.button-primary {
  background-color: green;
}

.button-secondary {
  background-color: gray;
  color: black;
}
```

Обратите внимание, как SCSS сгруппировал селекторы `.button`, `.button-primary` и `.button-secondary`, которые наследуют стили `.button`.

## Наследование плейсхолдерных селекторов (%placeholder)

Плейсхолдерные селекторы - это специальный тип селекторов в SCSS, которые не компилируются непосредственно в CSS. Они предназначены для использования только с `@extend`. Имена плейсхолдерных селекторов начинаются с символа процента `%`.

Использование плейсхолдерных селекторов помогает избежать создания в CSS базовых классов, которые могут не использоваться напрямую в HTML.

**Синтаксис:**

```scss
%button-base {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  color: white;
  font-size: 16px;
  cursor: pointer;
}

.button-primary {
  @extend %button-base;
  background-color: green;
}

.button-secondary {
  @extend %button-base;
  background-color: gray;
  color: black;
}
```

Компилируется в:

```css
.button-primary, .button-secondary {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  color: white;
  font-size: 16px;
  cursor: pointer;
}

.button-primary {
  background-color: green;
}

.button-secondary {
  background-color: gray;
  color: black;
}
```

Плейсхолдер `%button-base` не был скомпилирован в отдельный класс `.button-base`.

## Цепочки наследования

Вы можете создавать цепочки наследования, где один селектор наследует другой, который, в свою очередь, наследует третий.

**Пример:**

```scss
.base {
  font-size: 14px;
  color: black;
}

.extended {
  @extend .base;
  font-weight: bold;
}

.further-extended {
  @extend .extended;
  text-decoration: underline;
}
```

Компилируется в:

```css
.base, .extended, .further-extended {
  font-size: 14px;
  color: black;
}

.extended, .further-extended {
  font-weight: bold;
}

.further-extended {
  text-decoration: underline;
}
```

## Наследование вложенных селекторов

Вы можете наследовать стили вложенных селекторов.

**Пример:**

```scss
.container {
  .title {
    font-size: 20px;
    font-weight: bold;
  }

  .subtitle {
    font-size: 16px;
    color: gray;
  }
}

.main-title {
  @extend .container .title;
  color: blue;
}
```

Компилируется в:

```css
.container .title, .main-title {
  font-size: 20px;
  font-weight: bold;
}

.container .subtitle {
  font-size: 16px;
  color: gray;
}

.main-title {
  color: blue;
}
```

## Ограничения `@extend`

* **Простое наследование:** `@extend` наследует только свойства CSS. Он не наследует JavaScript-поведение или HTML-структуру.
* **Потенциальное увеличение размера CSS:** Чрезмерное использование `@extend` может привести к созданию длинных списков селекторов, что может увеличить размер вашего CSS.
* **Сложность отслеживания:** Глубокие цепочки наследования могут затруднить понимание того, какие стили применяются к элементу.

## Когда использовать `@extend`

* **Переиспользование базовых стилей:** Когда у вас есть общие стили для нескольких похожих элементов (например, кнопки).
* **Создание вариантов компонентов:** Наследование от базового класса компонента для создания специфических вариантов.
* **Следование принципу DRY (Don't Repeat Yourself):** Избегание дублирования стилей.

## Альтернативы `@extend`

В некоторых случаях mixins могут быть более гибкой альтернативой `@extend`, особенно когда вам нужно передавать параметры или включать только определенные группы свойств.

## Заключение

Директива `@extend` в SCSS - мощный инструмент для наследования стилей между селекторами. Использование плейсхолдерных селекторов (`%`) помогает избежать создания ненужных классов в HTML. Правильное использование `@extend` может сделать ваш CSS более модульным, организованным и легким в поддержке. Однако важно помнить о его ограничениях и рассмотреть альтернативы, такие как mixins, в определенных ситуациях.