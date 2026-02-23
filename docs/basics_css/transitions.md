# CSS Transitions (Переходы)

[Скачать PDF](./transitions.pdf)

## Введение
CSS transitions позволяют плавно изменять значения свойств элемента в течение заданного времени. Это создает эффект анимации без использования JavaScript или сложных анимационных библиотек.

## Основные свойства

### transition-property
Определяет, какие CSS-свойства будут анимированы.

```css
.element {
  transition-property: opacity, transform;
}
```

Можно использовать значение `all` для анимации всех изменяющихся свойств:

```css
.element {
  transition-property: all;
}
```

### transition-duration
Задает продолжительность перехода в секундах (s) или миллисекундах (ms).

```css
.element {
  transition-duration: 0.3s; /* или 300ms */
}
```

### transition-timing-function
Определяет скорость изменения значения свойства в течение перехода.

```css
.element {
  transition-timing-function: ease; /* значение по умолчанию */
}
```

Основные значения:
- `ease`: Медленное начало, быстрая середина, медленное окончание
- `linear`: Равномерная скорость
- `ease-in`: Медленное начало
- `ease-out`: Медленное окончание
- `ease-in-out`: Медленное начало и окончание
- `cubic-bezier(n,n,n,n)`: Пользовательская функция
- `steps(n, start|end)`: Пошаговая функция

### transition-delay
Задержка перед началом перехода.

```css
.element {
  transition-delay: 0.5s;
}
```

### Сокращенная запись transition
Объединяет все свойства перехода в одно объявление.

```css
.element {
  transition: property duration timing-function delay;
}
```

Пример:
```css
.element {
  transition: opacity 0.3s ease-in-out 0.1s, transform 0.5s ease;
}
```

## Примеры использования

### Простой переход при наведении

```css
.button {
  background-color: blue;
  color: white;
  padding: 10px 20px;
  transition: background-color 0.3s ease;
}

.button:hover {
  background-color: darkblue;
}
```

### Переход с трансформацией

```css
.card {
  transform: scale(1);
  transition: transform 0.3s ease-in-out;
}

.card:hover {
  transform: scale(1.05);
}
```

### Множественные переходы

```css
.element {
  opacity: 0.7;
  transform: translateY(0);
  background-color: #f0f0f0;
  transition: 
    opacity 0.3s ease-in-out,
    transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275),
    background-color 0.2s linear;
}

.element:hover {
  opacity: 1;
  transform: translateY(-10px);
  background-color: #e0e0e0;
}
```

## Практические советы

1. Не анимируйте свойства `width` и `height`, если возможно - используйте вместо них `transform: scale()`.
2. Для лучшей производительности анимируйте только свойства `opacity` и `transform`.
3. Используйте короткие переходы (0.2s - 0.5s) для интерфейсных элементов.
4. Не забывайте о доступности - некоторые пользователи предпочитают отключать анимации.

```css
@media (prefers-reduced-motion: reduce) {
  * {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
```

5. Для сложных анимаций лучше использовать CSS animations вместо transitions.