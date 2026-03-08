---
description: "CSS анимации: @keyframes, animation свойства, timing functions — создание плавных анимаций на чистом CSS"
---

# CSS Animations (Анимации)

[Скачать PDF](./animations.pdf)

## Введение
CSS Animations позволяют создавать сложные анимации без использования JavaScript. В отличие от переходов (transitions), анимации могут содержать несколько ключевых кадров и автоматически запускаться при загрузке страницы.

## Ключевые кадры (@keyframes)

Ключевые кадры определяют состояния анимации в разные моменты времени.

```css
@keyframes slide-in {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}
```

Можно использовать ключевые слова `from` и `to` вместо процентов:

```css
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
```

## Свойства анимации

### animation-name
Указывает имя @keyframes анимации, которую нужно применить к элементу.

```css
.element {
  animation-name: slide-in;
}
```

### animation-duration
Задает продолжительность одного цикла анимации.

```css
.element {
  animation-duration: 1s;
}
```

### animation-timing-function
Определяет, как анимация прогрессирует в течение одного цикла.

```css
.element {
  animation-timing-function: ease-in-out;
}
```

Доступные значения: `linear`, `ease`, `ease-in`, `ease-out`, `ease-in-out`, `cubic-bezier()`, `steps()`.

### animation-delay
Задержка перед началом анимации.

```css
.element {
  animation-delay: 0.5s;
}
```

### animation-iteration-count
Количество повторений анимации.

```css
.element {
  animation-iteration-count: 3; /* конкретное число */
}

.infinite-animation {
  animation-iteration-count: infinite; /* бесконечное повторение */
}
```

### animation-direction
Направление воспроизведения анимации.

```css
.element {
  animation-direction: normal; /* по умолчанию */
}
```

Доступные значения:
- `normal`: Анимация воспроизводится вперед каждый цикл
- `reverse`: Анимация воспроизводится в обратном направлении
- `alternate`: Анимация меняет направление в каждом цикле
- `alternate-reverse`: Как alternate, но начинает с обратного направления

### animation-fill-mode
Определяет, какие стили применяются до и после выполнения анимации.

```css
.element {
  animation-fill-mode: forwards;
}
```

Доступные значения:
- `none`: Элемент возвращается к исходным стилям после анимации
- `forwards`: Элемент сохраняет стили последнего ключевого кадра
- `backwards`: Элемент применяет стили первого ключевого кадра во время задержки
- `both`: Комбинация forwards и backwards

### animation-play-state
Управляет воспроизведением анимации.

```css
.element {
  animation-play-state: running; /* по умолчанию */
}

.element.paused {
  animation-play-state: paused;
}
```

### Сокращенная запись animation

```css
.element {
  animation: name duration timing-function delay iteration-count direction fill-mode play-state;
}
```

Пример:
```css
.element {
  animation: slide-in 1s ease-out 0.5s 2 alternate forwards;
}
```

## Множественные анимации

К одному элементу можно применить несколько анимаций одновременно, перечислив их через запятую:

```css
@keyframes slide-in {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.element {
  animation:
    slide-in 0.5s ease-out,
    fade-in 0.8s ease-in;
}
```

## Функции синхронизации подробно

### cubic-bezier()

Позволяет задать кастомную кривую анимации с помощью четырёх контрольных точек:

```css
.element {
  /* Быстрый старт с замедлением */
  animation-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1.0);
}

.elastic {
  /* Эффект "упругости" — значения > 1 создают перелёт */
  animation-timing-function: cubic-bezier(0.68, -0.55, 0.27, 1.55);
}
```

Популярные значения cubic-bezier:
- `cubic-bezier(0.4, 0, 0.2, 1)` — Material Design standard
- `cubic-bezier(0, 0, 0.2, 1)` — Material Design decelerate
- `cubic-bezier(0.4, 0, 1, 1)` — Material Design accelerate
- `cubic-bezier(0.68, -0.55, 0.27, 1.55)` — эффект упругости (back)

### steps()

Создаёт пошаговую анимацию вместо плавной. Полезно для спрайтовых анимаций и печатающего текста:

```css
/* Спрайтовая анимация персонажа (8 кадров) */
@keyframes walk {
  from { background-position: 0 0; }
  to { background-position: -640px 0; }
}

.character {
  width: 80px;
  height: 100px;
  background: url('sprite.png');
  animation: walk 0.8s steps(8) infinite;
}
```

```css
/* Эффект печатной машинки */
@keyframes typing {
  from { width: 0; }
  to { width: 20ch; }
}

@keyframes blink-caret {
  50% { border-color: transparent; }
}

.typewriter {
  font-family: monospace;
  overflow: hidden;
  white-space: nowrap;
  border-right: 3px solid #333;
  width: 20ch;
  animation:
    typing 3s steps(20) forwards,
    blink-caret 0.75s step-end infinite;
}
```

## Примеры анимаций

### Пульсация

```css
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.pulse-element {
  animation: pulse 2s infinite ease-in-out;
}
```

### Вращение

```css
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.spinner {
  animation: rotate 1.5s linear infinite;
}
```

### Появление с эффектом отскока

```css
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  60% {
    transform: scale(1.1);
  }
  80% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
}

.bounce-element {
  animation: bounce-in 1s cubic-bezier(0.215, 0.610, 0.355, 1.000);
}
```

### Скелетон-загрузка (Skeleton Loader)

```css
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.skeleton {
  background: linear-gradient(
    90deg,
    #e0e0e0 25%,
    #f0f0f0 50%,
    #e0e0e0 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: 4px;
}
```

### Плавающий элемент (Float)

```css
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

.floating {
  animation: float 3s ease-in-out infinite;
}
```

### Появление элементов при прокрутке (Fade In Up)

```css
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-up {
  animation: fade-in-up 0.6s ease-out forwards;
}
```

### Тряска (Shake) — для ошибок в формах

```css
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}

.error-shake {
  animation: shake 0.5s ease-in-out;
}
```

### Градиентный фон

```css
@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.gradient-bg {
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: gradient-shift 8s ease infinite;
}
```

### Уведомление (Notification Bell)

```css
@keyframes ring {
  0% { transform: rotate(0); }
  10% { transform: rotate(15deg); }
  20% { transform: rotate(-15deg); }
  30% { transform: rotate(10deg); }
  40% { transform: rotate(-10deg); }
  50% { transform: rotate(5deg); }
  60% { transform: rotate(-5deg); }
  70% { transform: rotate(0); }
  100% { transform: rotate(0); }
}

.notification-bell {
  animation: ring 1.5s ease-in-out;
  transform-origin: top center;
}
```

## Каскадные анимации (Staggered)

Создание эффекта поочерёдного появления элементов с помощью `animation-delay`:

```css
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.staggered-list li {
  opacity: 0;
  animation: fade-in-up 0.5s ease-out forwards;
}

.staggered-list li:nth-child(1) { animation-delay: 0.1s; }
.staggered-list li:nth-child(2) { animation-delay: 0.2s; }
.staggered-list li:nth-child(3) { animation-delay: 0.3s; }
.staggered-list li:nth-child(4) { animation-delay: 0.4s; }
.staggered-list li:nth-child(5) { animation-delay: 0.5s; }
```

Для динамического количества элементов можно использовать CSS custom properties:

```css
.staggered-list li {
  opacity: 0;
  animation: fade-in-up 0.5s ease-out forwards;
  animation-delay: calc(var(--i) * 0.1s);
}
```

```html
<ul class="staggered-list">
  <li style="--i: 0">Элемент 1</li>
  <li style="--i: 1">Элемент 2</li>
  <li style="--i: 2">Элемент 3</li>
</ul>
```

## Анимации для интерфейсных элементов

### Модальное окно

```css
@keyframes modal-open {
  from {
    opacity: 0;
    transform: scale(0.8) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes overlay-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-overlay {
  animation: overlay-fade 0.3s ease-out;
}

.modal {
  animation: modal-open 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

### Кнопка загрузки (Spinner Button)

```css
@keyframes spin {
  to { transform: rotate(360deg); }
}

.btn-loading::after {
  content: '';
  width: 16px;
  height: 16px;
  border: 2px solid #fff;
  border-top-color: transparent;
  border-radius: 50%;
  display: inline-block;
  margin-left: 8px;
  animation: spin 0.6s linear infinite;
}
```

### Прогресс-бар

```css
@keyframes progress-fill {
  from { width: 0; }
  to { width: var(--progress, 100%); }
}

@keyframes progress-stripes {
  from { background-position: 1rem 0; }
  to { background-position: 0 0; }
}

.progress-bar {
  height: 8px;
  background: #4caf50;
  border-radius: 4px;
  animation: progress-fill 1s ease-out forwards;
  background-image: linear-gradient(
    45deg,
    rgba(255,255,255,0.15) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255,255,255,0.15) 50%,
    rgba(255,255,255,0.15) 75%,
    transparent 75%
  );
  background-size: 1rem 1rem;
  animation:
    progress-fill 1s ease-out forwards,
    progress-stripes 0.5s linear infinite;
}
```

## Анимации и JavaScript

### Управление анимациями через JS

```css
@keyframes slide-in {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

.animated {
  animation: slide-in 0.5s ease-out;
}
```

```javascript
// Добавление анимации
element.classList.add('animated');

// Перезапуск анимации
element.classList.remove('animated');
// Используем requestAnimationFrame для перезапуска
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    element.classList.add('animated');
  });
});

// Слушатель завершения анимации
element.addEventListener('animationend', (e) => {
  console.log(`Анимация ${e.animationName} завершена`);
  element.classList.remove('animated');
});

// Слушатель начала анимации
element.addEventListener('animationstart', (e) => {
  console.log(`Анимация ${e.animationName} началась`);
});

// Слушатель повторения цикла
element.addEventListener('animationiteration', (e) => {
  console.log(`Новый цикл анимации ${e.animationName}`);
});
```

### Web Animations API

```javascript
// Более гибкая альтернатива CSS-анимациям
const animation = element.animate([
  { transform: 'translateX(-100%)', opacity: 0 },
  { transform: 'translateX(0)', opacity: 1 }
], {
  duration: 500,
  easing: 'ease-out',
  fill: 'forwards'
});

// Управление
animation.pause();
animation.play();
animation.reverse();
animation.cancel();

// Промис завершения
animation.finished.then(() => {
  console.log('Анимация завершена');
});
```

## Производительность анимаций

### Свойства, безопасные для анимации

Для плавной работы (60 fps) анимируйте только свойства, обрабатываемые на этапе **композиции**:

| Свойство | Производительность | Рекомендация |
|----------|-------------------|--------------|
| `transform` | Отлично | Используйте для перемещения, масштабирования, вращения |
| `opacity` | Отлично | Используйте для появления/исчезновения |
| `filter` | Хорошо | Осторожно на мобильных |
| `width`, `height` | Плохо | Замените на `transform: scale()` |
| `top`, `left` | Плохо | Замените на `transform: translate()` |
| `margin`, `padding` | Плохо | Избегайте анимации |
| `box-shadow` | Плохо | Используйте псевдоэлемент с `opacity` |

### Оптимизация с will-change

```css
.will-animate {
  will-change: transform, opacity;
}

/* Убирайте will-change после завершения анимации */
.will-animate.done {
  will-change: auto;
}
```

### Аппаратное ускорение

```css
.gpu-accelerated {
  transform: translateZ(0); /* Принудительно использует GPU */
  backface-visibility: hidden; /* Предотвращает мерцание */
}
```

## Практические советы

1. Используйте анимации умеренно, чтобы не отвлекать пользователей.
2. Для лучшей производительности анимируйте только свойства `transform` и `opacity`.
3. Добавляйте поддержку отключения анимаций для пользователей с вестибулярными расстройствами:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

4. Для сложных анимаций рассмотрите использование JavaScript-библиотек, таких как GSAP или Anime.js.
5. Используйте инструменты разработчика в браузере для отладки и оптимизации анимаций.
6. Используйте `will-change` осторожно — только когда анимация действительно будет запущена.
7. Избегайте анимации свойств, вызывающих reflow (`width`, `height`, `margin`, `top`, `left`).
8. Для каскадных анимаций используйте `animation-delay` с CSS custom properties вместо жёстко прописанных значений.
9. Всегда добавляйте `animation-fill-mode: forwards`, если элемент должен сохранить финальное состояние.
10. Тестируйте анимации на мобильных устройствах — они более чувствительны к производительности.
11. Используйте `animation-composition` для управления комбинированием нескольких анимаций на одном свойстве (`replace`, `add`, `accumulate`).