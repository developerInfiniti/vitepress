# Composite (Компоновщик)

## Описание

Паттерн **Composite** позволяет объединять объекты в древовидные структуры для представления иерархий «часть — целое». Клиенты работают с отдельными объектами и группами объектов одинаковым образом.

## Проблема

У вас есть древовидная структура данных (файловая система, организация, меню), и вам нужно выполнять операции как над отдельными элементами, так и над целыми ветками, не различая их в коде.

```
Без Composite:

if (item.type === 'file') {
  size += item.size;
} else if (item.type === 'folder') {
  for (const child of item.children) {
    if (child.type === 'file') {
      size += child.size;
    } else if (child.type === 'folder') {
      // ... рекурсия с проверками типов
    }
  }
}
// Хрупкий код с проверками типов на каждом уровне
```

## Решение

Определить общий интерфейс для листовых и составных объектов. Составной объект содержит коллекцию дочерних элементов и делегирует им операции.

```
С Composite:

            Component
           + operation()
           /           \
      Leaf              Composite
    + operation()     + operation()  → вызывает operation()
                      + add(child)     у всех children
                      + remove(child)
                      + children[]
```

## Структура

```
┌──────────────────────┐
│      Component       │ ← Общий интерфейс
│  + operation()       │
│  + getSize()         │
└──────────┬───────────┘
           │
     ┌─────┴──────┐
     │            │
┌────┴─────┐ ┌───┴──────────┐
│   Leaf   │ │  Composite   │
│          │ │              │
│ operation│ │ + children[] │
│ getSize  │ │ + add()      │
└──────────┘ │ + remove()   │
             │ + operation()│ → forEach(child => child.operation())
             │ + getSize()  │ → sum(children.map(c => c.getSize()))
             └──────────────┘
```

## Реализация

### Файловая система

```javascript
// === Общий интерфейс (Component) ===
class FileSystemItem {
  constructor(name) {
    this.name = name;
  }

  getSize() {
    throw new Error('Метод должен быть реализован');
  }

  display(indent = '') {
    throw new Error('Метод должен быть реализован');
  }

  find(name) {
    throw new Error('Метод должен быть реализован');
  }
}

// === Лист (Leaf) ===
class File extends FileSystemItem {
  constructor(name, size) {
    super(name);
    this.size = size;
  }

  getSize() {
    return this.size;
  }

  display(indent = '') {
    console.log(`${indent}📄 ${this.name} (${this.size} KB)`);
  }

  find(name) {
    return this.name.includes(name) ? [this] : [];
  }
}

// === Составной объект (Composite) ===
class Folder extends FileSystemItem {
  constructor(name) {
    super(name);
    this.children = [];
  }

  add(item) {
    this.children.push(item);
    return this; // для цепочки вызовов
  }

  remove(item) {
    this.children = this.children.filter(child => child !== item);
  }

  getSize() {
    // Рекурсивно суммирует размеры всех дочерних элементов
    return this.children.reduce((sum, child) => sum + child.getSize(), 0);
  }

  display(indent = '') {
    console.log(`${indent}📁 ${this.name} (${this.getSize()} KB)`);
    this.children.forEach(child => child.display(indent + '  '));
  }

  find(name) {
    let results = this.name.includes(name) ? [this] : [];
    this.children.forEach(child => {
      results = results.concat(child.find(name));
    });
    return results;
  }
}

// === ИСПОЛЬЗОВАНИЕ ===
const root = new Folder('project');

const src = new Folder('src');
src.add(new File('index.js', 15));
src.add(new File('app.js', 25));

const components = new Folder('components');
components.add(new File('Header.vue', 8));
components.add(new File('Footer.vue', 6));
components.add(new File('Sidebar.vue', 12));
src.add(components);

const assets = new Folder('assets');
assets.add(new File('logo.png', 120));
assets.add(new File('style.css', 10));

root.add(src);
root.add(assets);
root.add(new File('package.json', 2));
root.add(new File('README.md', 5));

root.display();
// 📁 project (203 KB)
//   📁 src (66 KB)
//     📄 index.js (15 KB)
//     📄 app.js (25 KB)
//     📁 components (26 KB)
//       📄 Header.vue (8 KB)
//       📄 Footer.vue (6 KB)
//       📄 Sidebar.vue (12 KB)
//   📁 assets (130 KB)
//     📄 logo.png (120 KB)
//     📄 style.css (10 KB)
//   📄 package.json (2 KB)
//   📄 README.md (5 KB)

console.log(`Общий размер: ${root.getSize()} KB`); // 203 KB

// Поиск работает одинаково для файлов и папок
console.log(root.find('vue'));
// [File('Header.vue'), File('Footer.vue'), File('Sidebar.vue')]
```

### DOM-подобное дерево

```javascript
class DOMNode {
  constructor(tag, attributes = {}) {
    this.tag = tag;
    this.attributes = attributes;
    this.children = [];
    this.textContent = '';
  }

  addChild(node) {
    this.children.push(node);
    return this;
  }

  setText(text) {
    this.textContent = text;
    return this;
  }

  render(indent = '') {
    const attrs = Object.entries(this.attributes)
      .map(([key, value]) => ` ${key}="${value}"`)
      .join('');

    if (this.children.length === 0 && this.textContent) {
      return `${indent}<${this.tag}${attrs}>${this.textContent}</${this.tag}>`;
    }

    let html = `${indent}<${this.tag}${attrs}>`;
    if (this.textContent) {
      html += `\n${indent}  ${this.textContent}`;
    }
    this.children.forEach(child => {
      html += `\n${child.render(indent + '  ')}`;
    });
    html += `\n${indent}</${this.tag}>`;
    return html;
  }

  // Поиск по всему дереву — работает рекурсивно
  querySelectorAll(tag) {
    let results = [];
    if (this.tag === tag) results.push(this);
    this.children.forEach(child => {
      results = results.concat(child.querySelectorAll(tag));
    });
    return results;
  }

  countNodes() {
    return 1 + this.children.reduce((sum, child) => sum + child.countNodes(), 0);
  }
}

// Построение дерева
const page = new DOMNode('div', { class: 'page' });

const header = new DOMNode('header', { class: 'header' });
header.addChild(new DOMNode('h1').setText('Мой сайт'));
header.addChild(new DOMNode('nav').addChild(
  new DOMNode('a', { href: '/' }).setText('Главная')
).addChild(
  new DOMNode('a', { href: '/about' }).setText('О нас')
));

const main = new DOMNode('main');
main.addChild(new DOMNode('p').setText('Привет, мир!'));
main.addChild(new DOMNode('p').setText('Это пример Composite.'));

page.addChild(header);
page.addChild(main);

console.log(page.render());
console.log(`Всего узлов: ${page.countNodes()}`); // 9
console.log(`Ссылки: ${page.querySelectorAll('a').length}`); // 2
```

### Система меню

```javascript
class MenuItem {
  constructor(name, price = 0) {
    this.name = name;
    this.price = price;
  }

  getPrice() {
    return this.price;
  }

  display(indent = '') {
    console.log(`${indent}${this.name} — ${this.price} ₽`);
  }
}

class MenuCategory extends MenuItem {
  constructor(name) {
    super(name, 0);
    this.items = [];
  }

  add(item) {
    this.items.push(item);
    return this;
  }

  getPrice() {
    return this.items.reduce((sum, item) => sum + item.getPrice(), 0);
  }

  display(indent = '') {
    console.log(`${indent}【${this.name}】`);
    this.items.forEach(item => item.display(indent + '  '));
  }

  count() {
    return this.items.reduce((sum, item) => {
      return sum + (item instanceof MenuCategory ? item.count() : 1);
    }, 0);
  }
}

// Использование
const menu = new MenuCategory('Ресторан "Код"');

const appetizers = new MenuCategory('Закуски');
appetizers.add(new MenuItem('Салат Цезарь', 450));
appetizers.add(new MenuItem('Брускетта', 350));

const mains = new MenuCategory('Основные блюда');
const pasta = new MenuCategory('Паста');
pasta.add(new MenuItem('Карбонара', 550));
pasta.add(new MenuItem('Болоньезе', 500));
mains.add(pasta);
mains.add(new MenuItem('Стейк', 1200));

const drinks = new MenuCategory('Напитки');
drinks.add(new MenuItem('Кола', 150));
drinks.add(new MenuItem('Сок', 200));

menu.add(appetizers);
menu.add(mains);
menu.add(drinks);

menu.display();
// 【Ресторан "Код"】
//   【Закуски】
//     Салат Цезарь — 450 ₽
//     Брускетта — 350 ₽
//   【Основные блюда】
//     【Паста】
//       Карбонара — 550 ₽
//       Болоньезе — 500 ₽
//     Стейк — 1200 ₽
//   【Напитки】
//     Кола — 150 ₽
//     Сок — 200 ₽

console.log(`Всего позиций: ${menu.count()}`); // 7
console.log(`Сумма всего меню: ${menu.getPrice()} ₽`); // 3400 ₽
```

## Примеры в реальной жизни

| Пример | Leaf | Composite |
|--------|------|-----------|
| Файловая система | File | Folder |
| DOM | TextNode | Element |
| React | `<span>text</span>` | `<div>children...</div>` |
| Организация | Сотрудник | Отдел |
| Графический редактор | Фигура | Группа фигур |
| Меню | Пункт меню | Подменю |

## Когда использовать

```
✓ Структура данных образует дерево (часть-целое)
✓ Клиент должен работать с листьями и контейнерами одинаково
✓ Нужны рекурсивные операции по всему дереву
✓ Файловые системы, меню, организационные структуры, UI

✗ Структура не является деревом
✗ Листья и контейнеры сильно отличаются по поведению
✗ Простой плоский список без вложенности
```

## Преимущества и недостатки

| Преимущества | Недостатки |
|-------------|-----------|
| Единообразная работа с деревом | Слишком общий интерфейс для разных элементов |
| Легко добавлять новые типы элементов | Сложно ограничить типы дочерних элементов |
| Рекурсивные операции естественны | Может привести к сверхобобщению |
| Упрощает клиентский код | |
