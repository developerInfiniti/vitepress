# Flyweight (Приспособленец)

## Описание

Паттерн **Flyweight** позволяет экономить память, разделяя общее состояние между множеством объектов вместо хранения одних и тех же данных в каждом объекте.

## Проблема

Вам нужно создать огромное количество похожих объектов, и каждый из них занимает значительное количество памяти. Например, в текстовом редакторе миллионы символов, у каждого есть шрифт, размер и цвет.

```
Без Flyweight — 1 000 000 символов:

Каждый символ хранит:
  char: 'A'           — 2 байта
  font: 'Arial'       — 20 байт
  size: 14             — 4 байта
  color: '#333333'     — 14 байт
  bold: false          — 1 байт
  italic: false        — 1 байт
                       ≈ 42 байта

1 000 000 × 42 байт = ~42 MB
При этом 90% символов используют одинаковый стиль!
```

## Решение

Разделить состояние объекта на:

- **Intrinsic state** (внутреннее) — общие данные, которые можно переиспользовать (шрифт, размер, цвет)
- **Extrinsic state** (внешнее) — уникальные данные, зависящие от контекста (позиция символа, сам символ)

```
С Flyweight:

Flyweight-объекты (разделяемые):
  Style1: { font: 'Arial', size: 14, color: '#333' }
  Style2: { font: 'Arial', size: 18, color: '#000', bold: true }
  Style3: { font: 'Courier', size: 12, color: '#666' }
  → 3 объекта вместо 1 000 000

Символы хранят только:
  char: 'A'            — 2 байта
  style: → ссылка      — 8 байт
  position: {x, y}     — 8 байт
                       ≈ 18 байт

1 000 000 × 18 + 3 × 40 = ~18 MB (экономия 57%)
```

## Структура

```
┌───────────────────┐
│  FlyweightFactory │
│                   │
│  + getFlyweight() │ ← Возвращает существующий или создаёт новый
│  - cache: Map     │
└─────────┬─────────┘
          │ создаёт/возвращает
          ↓
┌──────────────────┐
│    Flyweight      │ ← Хранит intrinsic state (разделяемое)
│                   │
│  - intrinsicState │
│  + operation(     │
│     extrinsicState│ ← Получает extrinsic state извне
│    )              │
└──────────────────┘
```

## Реализация

### Текстовый редактор

```javascript
// === Flyweight — разделяемый стиль текста ===
class TextStyle {
  constructor(font, size, color, bold = false, italic = false) {
    this.font = font;
    this.size = size;
    this.color = color;
    this.bold = bold;
    this.italic = italic;
  }

  apply(char, position) {
    // Применяет стиль к конкретному символу на позиции
    return {
      char,
      position,
      style: `${this.font} ${this.size}px ${this.color}${this.bold ? ' bold' : ''}${this.italic ? ' italic' : ''}`
    };
  }
}

// === Flyweight Factory ===
class TextStyleFactory {
  constructor() {
    this.styles = new Map();
  }

  getStyle(font, size, color, bold = false, italic = false) {
    const key = `${font}-${size}-${color}-${bold}-${italic}`;

    if (!this.styles.has(key)) {
      this.styles.set(key, new TextStyle(font, size, color, bold, italic));
      console.log(`Создан новый стиль: ${key}`);
    }

    return this.styles.get(key);
  }

  getCount() {
    return this.styles.size;
  }
}

// === Символ (хранит только extrinsic state + ссылку на flyweight) ===
class Character {
  constructor(char, row, col, style) {
    this.char = char;       // extrinsic
    this.row = row;         // extrinsic
    this.col = col;         // extrinsic
    this.style = style;     // ← ссылка на flyweight (intrinsic)
  }

  render() {
    return this.style.apply(this.char, { row: this.row, col: this.col });
  }
}

// === ИСПОЛЬЗОВАНИЕ ===
const factory = new TextStyleFactory();
const document = [];

// Обычный текст — все символы разделяют один стиль
const normalStyle = factory.getStyle('Arial', 14, '#333333');
const text = 'Привет, мир! Это пример паттерна Flyweight.';
for (let i = 0; i < text.length; i++) {
  document.push(new Character(text[i], 0, i, normalStyle));
}

// Заголовок — другой разделяемый стиль
const headingStyle = factory.getStyle('Arial', 24, '#000000', true);
const heading = 'Заголовок';
for (let i = 0; i < heading.length; i++) {
  document.push(new Character(heading[i], 1, i, headingStyle));
}

// Код — ещё один стиль
const codeStyle = factory.getStyle('Courier', 12, '#666666');
const code = 'const x = 42;';
for (let i = 0; i < code.length; i++) {
  document.push(new Character(code[i], 2, i, codeStyle));
}

console.log(`Символов в документе: ${document.length}`);  // 66
console.log(`Стилей создано: ${factory.getCount()}`);       // 3
// 66 символов, но всего 3 объекта стилей!
```

### Игровые объекты (деревья на карте)

```javascript
// === Flyweight — тип дерева (разделяемые данные) ===
class TreeType {
  constructor(name, color, texture) {
    this.name = name;
    this.color = color;
    this.texture = texture;   // Тяжёлый объект — текстура в памяти
  }

  draw(x, y) {
    console.log(`Рисую ${this.name} (${this.color}) на (${x}, ${y})`);
  }
}

// === Factory ===
class TreeFactory {
  constructor() {
    this.types = new Map();
  }

  getType(name, color, texture) {
    const key = `${name}-${color}`;
    if (!this.types.has(key)) {
      this.types.set(key, new TreeType(name, color, texture));
    }
    return this.types.get(key);
  }

  getTypesCount() {
    return this.types.size;
  }
}

// === Конкретное дерево (хранит только координаты + ссылку) ===
class Tree {
  constructor(x, y, type) {
    this.x = x;        // extrinsic
    this.y = y;        // extrinsic
    this.type = type;   // ← flyweight
  }

  draw() {
    this.type.draw(this.x, this.y);
  }
}

// === Лес (контекст) ===
class Forest {
  constructor() {
    this.trees = [];
    this.factory = new TreeFactory();
  }

  plantTree(x, y, name, color, texture) {
    const type = this.factory.getType(name, color, texture);
    this.trees.push(new Tree(x, y, type));
  }

  draw() {
    this.trees.forEach(tree => tree.draw());
  }

  getStats() {
    return {
      totalTrees: this.trees.length,
      uniqueTypes: this.factory.getTypesCount(),
      // Без flyweight: каждое дерево ~500KB (текстура)
      // С flyweight: каждое дерево ~16 байт + N типов × 500KB
      memorySaved: `${((this.trees.length - this.factory.getTypesCount()) * 500 / 1024).toFixed(1)} MB`
    };
  }
}

// === ИСПОЛЬЗОВАНИЕ ===
const forest = new Forest();

// Создаём 10 000 деревьев, но всего 4 типа
for (let i = 0; i < 10000; i++) {
  const x = Math.random() * 1000;
  const y = Math.random() * 1000;

  const r = Math.random();
  if (r < 0.4) {
    forest.plantTree(x, y, 'Берёза', '#90EE90', 'birch.png');
  } else if (r < 0.7) {
    forest.plantTree(x, y, 'Ель', '#006400', 'spruce.png');
  } else if (r < 0.9) {
    forest.plantTree(x, y, 'Дуб', '#228B22', 'oak.png');
  } else {
    forest.plantTree(x, y, 'Клён', '#FF4500', 'maple.png');
  }
}

console.log(forest.getStats());
// {
//   totalTrees: 10000,
//   uniqueTypes: 4,
//   memorySaved: "4998.0 MB"
// }
```

### Кеш с Flyweight

```javascript
// === Flyweight для часто запрашиваемых данных ===
class DataFlyweightFactory {
  constructor() {
    this.cache = new Map();
    this.hits = 0;
    this.misses = 0;
  }

  get(key, fetchFn) {
    if (this.cache.has(key)) {
      this.hits++;
      return this.cache.get(key);
    }

    this.misses++;
    const data = fetchFn(key);
    this.cache.set(key, Object.freeze(data)); // freeze чтобы не мутировали
    return data;
  }

  getStats() {
    return {
      cached: this.cache.size,
      hits: this.hits,
      misses: this.misses,
      hitRate: `${((this.hits / (this.hits + this.misses)) * 100).toFixed(1)}%`
    };
  }
}

// Использование
const countryCache = new DataFlyweightFactory();

function getCountryData(code) {
  // Имитация загрузки данных
  const db = {
    RU: { name: 'Россия', currency: 'RUB', timezone: 'Europe/Moscow' },
    US: { name: 'США', currency: 'USD', timezone: 'America/New_York' },
    DE: { name: 'Германия', currency: 'EUR', timezone: 'Europe/Berlin' },
  };
  return db[code];
}

// 1000 пользователей, но всего 3 страны
for (let i = 0; i < 1000; i++) {
  const code = ['RU', 'US', 'DE'][Math.floor(Math.random() * 3)];
  const country = countryCache.get(code, getCountryData);
}

console.log(countryCache.getStats());
// { cached: 3, hits: 997, misses: 3, hitRate: '99.7%' }
```

## Когда использовать

```
✓ Программа создаёт огромное количество похожих объектов
✓ Объекты содержат повторяющееся состояние, которое можно вынести
✓ Можно чётко разделить intrinsic и extrinsic state
✓ Идентичность объектов не важна (можно делиться)
✓ Экономия памяти критична (игры, редакторы, кеши)

✗ Объектов немного (оптимизация не нужна)
✗ У каждого объекта уникальное состояние
✗ Разделение состояния усложняет код без выигрыша
```

## Примеры в реальной жизни

| Пример | Intrinsic (разделяемое) | Extrinsic (уникальное) |
|--------|------------------------|----------------------|
| Текстовый редактор | Шрифт, размер, цвет | Символ, позиция |
| Игра (деревья) | Текстура, модель, цвет | Координаты x, y |
| Браузер (CSS) | Правила стилей | Элементы DOM |
| String pool (Java) | Строковое значение | Переменная-ссылка |
| Иконки ОС | Изображение иконки | Позиция на рабочем столе |

## Преимущества и недостатки

| Преимущества | Недостатки |
|-------------|-----------|
| Значительная экономия RAM | Усложняет код (разделение состояния) |
| Позволяет работать с миллионами объектов | Потеря идентичности объектов |
| Кешированные данные переиспользуются | Потокобезопасность может быть проблемой |
| | Вычисление extrinsic state может быть дорогим |

## Связь с другими паттернами

```
Flyweight + Factory Method:
  Factory создаёт и кеширует flyweight-объекты

Flyweight + Composite:
  Листовые узлы Composite можно реализовать как flyweight

Flyweight + Singleton:
  Singleton — один экземпляр класса
  Flyweight — много экземпляров, но с разделяемым состоянием
```
