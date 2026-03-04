# Prototype паттерн

**Prototype** (Прототип) — это порождающий паттерн, который позволяет создавать новые объекты путём копирования существующих, не завися от их конкретных классов.

---

## Проблема

```javascript
// ❌ Без паттерна — ручное копирование
const original = {
  name: 'Template',
  settings: {
    theme: 'dark',
    notifications: { email: true, push: false },
    permissions: ['read', 'write']
  },
  metadata: new Map([['version', '1.0']])
};

// Поверхностная копия — вложенные объекты ссылаются на оригинал!
const copy = { ...original };
copy.settings.theme = 'light'; // Изменит и оригинал!
```

### Проблемы такого подхода:

1. **Поверхностное копирование** — spread/Object.assign не копируют вложенные объекты
2. **Привязка к классу** — нужно знать конкретный класс для создания копии
3. **Скрытые зависимости** — приватные поля недоступны извне
4. **Дорогое создание** — иногда проще скопировать, чем создавать с нуля

---

## Прототипное наследование в JavaScript

JavaScript изначально построен на прототипах:

```javascript
// Прототипная цепочка
const animal = {
  type: 'animal',
  speak() {
    console.log(`${this.name} speaks`);
  }
};

// Object.create() — создание объекта с указанным прототипом
const dog = Object.create(animal);
dog.name = 'Rex';
dog.type = 'dog';

dog.speak(); // Rex speaks

// Проверка прототипной цепочки
console.log(Object.getPrototypeOf(dog) === animal); // true
console.log(dog.hasOwnProperty('speak')); // false (унаследован)
console.log(dog.hasOwnProperty('name'));  // true (собственное свойство)
```

---

## Решение

### Базовый пример с методом clone()

```javascript
class Prototype {
  clone() {
    throw new Error('Must implement clone()');
  }
}

class UserProfile extends Prototype {
  constructor(name, settings) {
    super();
    this.name = name;
    this.settings = settings;
  }

  clone() {
    // Глубокое копирование
    const clonedSettings = JSON.parse(JSON.stringify(this.settings));
    return new UserProfile(this.name, clonedSettings);
  }

  toString() {
    return `${this.name}: ${JSON.stringify(this.settings)}`;
  }
}

// Использование
const template = new UserProfile('Default', {
  theme: 'dark',
  language: 'ru',
  notifications: true
});

const user1 = template.clone();
user1.name = 'Иван';
user1.settings.theme = 'light';

const user2 = template.clone();
user2.name = 'Мария';
user2.settings.language = 'en';

console.log(template.toString());
// Default: {"theme":"dark","language":"ru","notifications":true}
console.log(user1.toString());
// Иван: {"theme":"light","language":"ru","notifications":true}
console.log(user2.toString());
// Мария: {"theme":"dark","language":"en","notifications":true}
```

---

## Deep Copy vs Shallow Copy

```javascript
const original = {
  name: 'Original',
  scores: [10, 20, 30],
  nested: { a: 1, b: { c: 2 } }
};

// 1. Shallow Copy (поверхностная)
const shallow = { ...original };
shallow.scores.push(40);
console.log(original.scores); // [10, 20, 30, 40] — изменён оригинал!

// 2. JSON Deep Copy (простая глубокая)
const jsonCopy = JSON.parse(JSON.stringify(original));
jsonCopy.scores.push(50);
console.log(original.scores); // [10, 20, 30, 40] — оригинал не изменён

// 3. structuredClone (современный способ, Node 17+, браузеры)
const structCopy = structuredClone(original);
structCopy.nested.b.c = 999;
console.log(original.nested.b.c); // 2 — оригинал не изменён
```

### Сравнение методов копирования

| Метод | Глубина | Функции | Date | Map/Set | Circular |
|-------|---------|---------|------|---------|----------|
| `{ ...obj }` | Shallow | Да | Ref | Ref | Нет |
| `Object.assign()` | Shallow | Да | Ref | Ref | Нет |
| `JSON.parse/stringify` | Deep | Нет | Строка | Нет | Нет |
| `structuredClone()` | Deep | Нет | Да | Да | Да |
| Ручной clone() | Deep | Да | Да | Да | Да |

---

## Практические примеры

### Пример 1: Реестр прототипов

```javascript
class PrototypeRegistry {
  constructor() {
    this.prototypes = {};
  }

  register(name, prototype) {
    this.prototypes[name] = prototype;
  }

  create(name, overrides = {}) {
    const prototype = this.prototypes[name];
    if (!prototype) {
      throw new Error(`Prototype "${name}" not found`);
    }

    const clone = prototype.clone();
    Object.assign(clone, overrides);
    return clone;
  }
}

class DocumentTemplate {
  constructor(title, format, styles) {
    this.title = title;
    this.format = format;
    this.styles = styles;
  }

  clone() {
    return new DocumentTemplate(
      this.title,
      this.format,
      JSON.parse(JSON.stringify(this.styles))
    );
  }
}

// Регистрация шаблонов
const registry = new PrototypeRegistry();

registry.register('report', new DocumentTemplate(
  'Отчёт',
  'A4',
  { font: 'Arial', size: 12, color: '#333' }
));

registry.register('letter', new DocumentTemplate(
  'Письмо',
  'A4',
  { font: 'Times New Roman', size: 14, color: '#000' }
));

registry.register('invoice', new DocumentTemplate(
  'Счёт',
  'A5',
  { font: 'Courier', size: 10, color: '#000' }
));

// Создание документов из шаблонов
const myReport = registry.create('report', { title: 'Квартальный отчёт Q1' });
const myLetter = registry.create('letter', { title: 'Уважаемый клиент...' });

console.log(myReport); // DocumentTemplate { title: 'Квартальный отчёт Q1', format: 'A4', ... }
```

### Пример 2: Конфигурация с наследованием

```javascript
class Config {
  constructor(data = {}) {
    this.data = data;
  }

  clone() {
    return new Config(structuredClone(this.data));
  }

  set(key, value) {
    this.data[key] = value;
    return this;
  }

  get(key) {
    return this.data[key];
  }

  extend(overrides) {
    const clone = this.clone();
    Object.assign(clone.data, overrides);
    return clone;
  }
}

// Базовая конфигурация
const baseConfig = new Config({
  apiUrl: 'https://api.example.com',
  timeout: 5000,
  retries: 3,
  logging: true,
  cache: { enabled: true, ttl: 3600 }
});

// Конфигурации для разных окружений — расширяют базовую
const devConfig = baseConfig.extend({
  apiUrl: 'http://localhost:3000',
  logging: true
});

const prodConfig = baseConfig.extend({
  apiUrl: 'https://api.prod.com',
  retries: 5,
  cache: { enabled: true, ttl: 7200 }
});

const testConfig = baseConfig.extend({
  apiUrl: 'http://localhost:4000',
  logging: false,
  cache: { enabled: false, ttl: 0 }
});

console.log(devConfig.get('apiUrl'));  // http://localhost:3000
console.log(prodConfig.get('retries')); // 5
console.log(testConfig.get('cache'));   // { enabled: false, ttl: 0 }
```

### Пример 3: Игровые объекты

```javascript
class GameObject {
  constructor(type, x, y, properties) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.properties = properties;
  }

  clone() {
    return new GameObject(
      this.type,
      this.x,
      this.y,
      structuredClone(this.properties)
    );
  }

  moveTo(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }
}

// Прототипы врагов
const goblinPrototype = new GameObject('goblin', 0, 0, {
  health: 50,
  damage: 10,
  speed: 3,
  loot: ['gold', 'potion']
});

const dragonPrototype = new GameObject('dragon', 0, 0, {
  health: 500,
  damage: 100,
  speed: 5,
  loot: ['gold', 'rare_sword', 'dragon_scale'],
  abilities: ['fire_breath', 'fly']
});

// Спавн врагов — клонирование вместо создания с нуля
function spawnEnemies() {
  const enemies = [];

  for (let i = 0; i < 10; i++) {
    const goblin = goblinPrototype.clone();
    goblin.moveTo(Math.random() * 100, Math.random() * 100);
    enemies.push(goblin);
  }

  const boss = dragonPrototype.clone();
  boss.moveTo(50, 50);
  boss.properties.health = 1000; // Усиленный босс
  enemies.push(boss);

  return enemies;
}

const enemies = spawnEnemies();
console.log(enemies.length); // 11
console.log(enemies[0].properties.health); // 50 (обычный гоблин)
console.log(enemies[10].properties.health); // 1000 (усиленный дракон)
```

---

## Надёжная функция глубокого копирования

```javascript
function deepClone(obj, seen = new WeakMap()) {
  // Примитивы и null
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Обработка циклических ссылок
  if (seen.has(obj)) {
    return seen.get(obj);
  }

  // Date
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  // Map
  if (obj instanceof Map) {
    const map = new Map();
    seen.set(obj, map);
    obj.forEach((value, key) => {
      map.set(deepClone(key, seen), deepClone(value, seen));
    });
    return map;
  }

  // Set
  if (obj instanceof Set) {
    const set = new Set();
    seen.set(obj, set);
    obj.forEach(value => {
      set.add(deepClone(value, seen));
    });
    return set;
  }

  // Array
  if (Array.isArray(obj)) {
    const arr = [];
    seen.set(obj, arr);
    obj.forEach((item, index) => {
      arr[index] = deepClone(item, seen);
    });
    return arr;
  }

  // Object
  const clone = Object.create(Object.getPrototypeOf(obj));
  seen.set(obj, clone);
  Object.keys(obj).forEach(key => {
    clone[key] = deepClone(obj[key], seen);
  });
  return clone;
}

// Использование
const original = {
  date: new Date(),
  map: new Map([['key', 'value']]),
  set: new Set([1, 2, 3]),
  nested: { deep: { value: 42 } }
};
original.self = original; // циклическая ссылка

const copy = deepClone(original);
console.log(copy.date instanceof Date); // true
console.log(copy.map.get('key')); // 'value'
console.log(copy.self === copy); // true (циклическая ссылка сохранена)
```

---

## Примеры в реальной жизни

| Библиотека / Инструмент | Применение |
|--------------------------|------------|
| **JavaScript** | `Object.create()` — создание объекта с прототипом |
| **Lodash** | `_.cloneDeep()` — глубокое копирование |
| **Immer** | Иммутабельные обновления через produce() |
| **Redux** | Копирование state при обновлении |
| **React** | `{...props}` — копирование props в компонентах |
| **structuredClone** | Нативный глубокий clone в браузерах и Node.js |
| **Git** | `git clone` — копирование репозитория |

---

## Когда использовать

### Хорошие случаи:

- **Дорогое создание** — проще скопировать, чем создать с нуля (загрузка из БД, сеть)
- **Шаблоны / пресеты** — базовые конфигурации, которые клонируются и модифицируются
- **Игровые объекты** — массовое создание похожих сущностей
- **Снимки состояния** — undo/redo через копии состояния
- **Избежание привязки к классу** — клонирование без знания конкретного типа

### Когда не нужен:

- **Простые объекты** — достаточно `{ ...obj }` или `Object.assign()`
- **Объекты без вложенности** — нет проблем с поверхностным копированием
- **Неизменяемые данные** — нет необходимости копировать

---

## Сравнение с другими порождающими паттернами

| Паттерн | Способ создания | Когда |
|---------|----------------|-------|
| **Factory Method** | Через фабрику | Разные типы одного интерфейса |
| **Abstract Factory** | Через семейство фабрик | Группы связанных объектов |
| **Builder** | Пошагово | Сложная конфигурация |
| **Prototype** | Через клонирование | Дорогое создание, шаблоны |
| **Singleton** | Единственный экземпляр | Глобальный доступ |

---

## Резюме

| Аспект | Описание |
|--------|---------|
| **Цель** | Создание объектов через клонирование существующих |
| **Проблема** | Дорогое создание, привязка к конкретным классам |
| **Решение** | Метод clone() для глубокого копирования |
| **Плюсы** | Производительность, независимость от классов, гибкость |
| **Минусы** | Сложность глубокого копирования, циклические ссылки |
| **Когда** | Шаблоны, игровые объекты, конфигурации, undo/redo |

---

## Следующие шаги

1. Изучите **[Builder](/design_patterns/builder)** — пошаговое создание
2. Изучите **[Abstract Factory](/design_patterns/abstract-factory)** — семейства объектов
3. Вернитесь к **[Singleton](/design_patterns/singleton)** для полной картины порождающих паттернов
