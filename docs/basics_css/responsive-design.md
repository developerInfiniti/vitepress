# Адаптивный дизайн (Responsive Design)

[Завантажити PDF](./responsive-design.pdf)

## Введение
Адаптивный дизайн - это подход к веб-дизайну, который делает веб-страницы хорошо отображаемыми на различных устройствах и размерах окон/экранов.

## Основные принципы

### 1. Гибкие сетки (Fluid Grids)
Использование относительных единиц измерения вместо фиксированных пикселей.

```css
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.column {
  width: 50%;
  float: left;
}
```

### 2. Гибкие изображения (Flexible Images)
Изображения должны масштабироваться вместе с контейнером.

```css
img {
  max-width: 100%;
  height: auto;
}
```

### 3. Медиа-запросы (Media Queries)
Применение различных стилей в зависимости от характеристик устройства.

```css
/* Стили для мобильных устройств */
@media (max-width: 767px) {
  .column {
    width: 100%;
  }
}

/* Стили для планшетов */
@media (min-width: 768px) and (max-width: 1023px) {
  .column {
    width: 50%;
  }
}

/* Стили для десктопов */
@media (min-width: 1024px) {
  .column {
    width: 33.33%;
  }
}
```

## Подходы к адаптивному дизайну

### Mobile First
Начинаем с разработки для мобильных устройств, затем расширяем для больших экранов.

```css
/* Базовые стили для мобильных */
.navigation {
  display: flex;
  flex-direction: column;
}

/* Расширяем для больших экранов */
@media (min-width: 768px) {
  .navigation {
    flex-direction: row;
  }
}
```

### Desktop First
Начинаем с разработки для десктопов, затем адаптируем для меньших экранов.

```css
/* Базовые стили для десктопов */
.navigation {
  display: flex;
  flex-direction: row;
}

/* Адаптируем для мобильных */
@media (max-width: 767px) {
  .navigation {
    flex-direction: column;
  }
}
```

## Viewport
Мета-тег viewport контролирует, как веб-страница отображается на мобильных устройствах.

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

## CSS-фреймворки для адаптивного дизайна

- **Bootstrap**: Популярный CSS-фреймворк с готовой сеткой и компонентами
- **Tailwind CSS**: Утилитарный CSS-фреймворк для быстрой разработки
- **Foundation**: Продвинутый адаптивный фреймворк

## Практические советы

1. Всегда тестируйте на реальных устройствах, а не только в эмуляторах браузера.
2. Используйте инструменты разработчика в браузере для отладки адаптивного дизайна.
3. Рассматривайте не только ширину экрана, но и высоту при необходимости.
4. Учитывайте плотность пикселей (pixel density) для изображений.
5. Оптимизируйте производительность для мобильных устройств (размер файлов, количество запросов и т.д.).

## Пример полностью адаптивного компонента

```css
.card {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.card__image {
  width: 100%;
  height: auto;
  border-radius: 0.5rem;
}

.card__content {
  padding: 1rem 0;
}

@media (min-width: 768px) {
  .card {
    flex-direction: row;
  }
  
  .card__image {
    width: 40%;
  }
  
  .card__content {
    width: 60%;
    padding: 0 0 0 1rem;
  }
}
```