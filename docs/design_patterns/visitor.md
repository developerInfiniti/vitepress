# Visitor паттерн

**Visitor** (Посетитель) — это поведенческий паттерн, который позволяет добавлять новые операции к объектам без изменения их классов. Операция выносится в отдельный объект-посетитель.

---

## Проблема

```javascript
// ❌ Без паттерна — добавление операций требует изменения каждого класса
class TextNode {
  constructor(text) {
    this.text = text;
  }

  toHTML() { return `<p>${this.text}</p>`; }
  toPlainText() { return this.text; }
  countWords() { return this.text.split(' ').length; }
  // Новая операция? Нужно менять КАЖДЫЙ класс!
}

class ImageNode {
  constructor(src, alt) {
    this.src = src;
    this.alt = alt;
  }

  toHTML() { return `<img src="${this.src}" alt="${this.alt}">`; }
  toPlainText() { return `[Image: ${this.alt}]`; }
  countWords() { return 0; }
  // И тут тоже...
}
```

### Проблемы:

1. **Нарушение OCP** — каждая новая операция требует изменения всех классов
2. **Разбухание классов** — классы содержат логику, не связанную с их ответственностью
3. **Сложность сопровождения** — добавление нового типа узла требует реализации всех операций
4. **Нарушение SRP** — узлы отвечают и за данные, и за все операции над ними

---

## Решение

### Визуализация паттерна

```
┌──────────────┐      ┌─────────────────┐
│   Element    │      │    Visitor       │
│              │      │                  │
│ + accept(v)  │      │ + visitText()    │
└──────────────┘      │ + visitImage()   │
       ▲              │ + visitLink()    │
  ┌────┼────┐         └─────────────────┘
  │    │    │                 ▲
Text Image Link        ┌─────┼──────┐
                       │     │      │
                    HTML  PlainText  WordCount
                   Export  Export    Visitor
```

### Базовый пример

```javascript
// Элементы (узлы документа)
class TextNode {
  constructor(text) {
    this.text = text;
  }

  accept(visitor) {
    return visitor.visitText(this);
  }
}

class ImageNode {
  constructor(src, alt) {
    this.src = src;
    this.alt = alt;
  }

  accept(visitor) {
    return visitor.visitImage(this);
  }
}

class LinkNode {
  constructor(url, text) {
    this.url = url;
    this.text = text;
  }

  accept(visitor) {
    return visitor.visitLink(this);
  }
}

// Посетители (операции)
class HTMLExportVisitor {
  visitText(node) {
    return `<p>${node.text}</p>`;
  }

  visitImage(node) {
    return `<img src="${node.src}" alt="${node.alt}">`;
  }

  visitLink(node) {
    return `<a href="${node.url}">${node.text}</a>`;
  }
}

class PlainTextExportVisitor {
  visitText(node) {
    return node.text;
  }

  visitImage(node) {
    return `[Image: ${node.alt}]`;
  }

  visitLink(node) {
    return `${node.text} (${node.url})`;
  }
}

class WordCountVisitor {
  constructor() {
    this.count = 0;
  }

  visitText(node) {
    this.count += node.text.split(/\s+/).length;
  }

  visitImage(node) {
    // Картинки не содержат слов
  }

  visitLink(node) {
    this.count += node.text.split(/\s+/).length;
  }

  getCount() {
    return this.count;
  }
}

// Использование
const document = [
  new TextNode('Привет, мир!'),
  new ImageNode('/photo.jpg', 'Фото'),
  new LinkNode('https://example.com', 'Перейти на сайт'),
  new TextNode('Это второй параграф текста')
];

// Экспорт в HTML
const htmlVisitor = new HTMLExportVisitor();
const html = document.map(node => node.accept(htmlVisitor)).join('\n');
console.log(html);
// <p>Привет, мир!</p>
// <img src="/photo.jpg" alt="Фото">
// <a href="https://example.com">Перейти на сайт</a>
// <p>Это второй параграф текста</p>

// Подсчёт слов
const wordCounter = new WordCountVisitor();
document.forEach(node => node.accept(wordCounter));
console.log(`Слов: ${wordCounter.getCount()}`); // Слов: 8
```

---

## Практические примеры

### Пример 1: AST (абстрактное синтаксическое дерево)

```javascript
// Узлы AST
class NumberLiteral {
  constructor(value) {
    this.value = value;
  }
  accept(visitor) { return visitor.visitNumber(this); }
}

class BinaryExpression {
  constructor(left, operator, right) {
    this.left = left;
    this.operator = operator;
    this.right = right;
  }
  accept(visitor) { return visitor.visitBinary(this); }
}

class UnaryExpression {
  constructor(operator, operand) {
    this.operator = operator;
    this.operand = operand;
  }
  accept(visitor) { return visitor.visitUnary(this); }
}

// Посетитель: вычисление выражения
class EvaluatorVisitor {
  visitNumber(node) {
    return node.value;
  }

  visitBinary(node) {
    const left = node.left.accept(this);
    const right = node.right.accept(this);

    switch (node.operator) {
      case '+': return left + right;
      case '-': return left - right;
      case '*': return left * right;
      case '/': return left / right;
    }
  }

  visitUnary(node) {
    const operand = node.operand.accept(this);
    return node.operator === '-' ? -operand : operand;
  }
}

// Посетитель: вывод в строку
class PrintVisitor {
  visitNumber(node) {
    return String(node.value);
  }

  visitBinary(node) {
    const left = node.left.accept(this);
    const right = node.right.accept(this);
    return `(${left} ${node.operator} ${right})`;
  }

  visitUnary(node) {
    const operand = node.operand.accept(this);
    return `(${node.operator}${operand})`;
  }
}

// Выражение: (3 + 4) * (-2)
const ast = new BinaryExpression(
  new BinaryExpression(
    new NumberLiteral(3),
    '+',
    new NumberLiteral(4)
  ),
  '*',
  new UnaryExpression('-', new NumberLiteral(2))
);

const evaluator = new EvaluatorVisitor();
console.log(ast.accept(evaluator)); // -14

const printer = new PrintVisitor();
console.log(ast.accept(printer)); // ((3 + 4) * (-2))
```

### Пример 2: Файловая система

```javascript
class File {
  constructor(name, size) {
    this.name = name;
    this.size = size;
  }
  accept(visitor) { return visitor.visitFile(this); }
}

class Directory {
  constructor(name) {
    this.name = name;
    this.children = [];
  }

  add(child) {
    this.children.push(child);
    return this;
  }

  accept(visitor) { return visitor.visitDirectory(this); }
}

// Посетитель: подсчёт размера
class SizeCalculatorVisitor {
  visitFile(file) {
    return file.size;
  }

  visitDirectory(dir) {
    return dir.children.reduce(
      (total, child) => total + child.accept(this), 0
    );
  }
}

// Посетитель: поиск файлов по расширению
class FileSearchVisitor {
  constructor(extension) {
    this.extension = extension;
    this.found = [];
  }

  visitFile(file) {
    if (file.name.endsWith(this.extension)) {
      this.found.push(file.name);
    }
  }

  visitDirectory(dir) {
    dir.children.forEach(child => child.accept(this));
  }

  getResults() {
    return this.found;
  }
}

// Посетитель: отображение дерева
class TreePrintVisitor {
  constructor() {
    this.depth = 0;
  }

  visitFile(file) {
    const indent = '  '.repeat(this.depth);
    console.log(`${indent}${file.name} (${file.size}KB)`);
  }

  visitDirectory(dir) {
    const indent = '  '.repeat(this.depth);
    console.log(`${indent}${dir.name}/`);
    this.depth++;
    dir.children.forEach(child => child.accept(this));
    this.depth--;
  }
}

// Использование
const root = new Directory('project')
  .add(new File('index.js', 15))
  .add(new File('style.css', 8))
  .add(new Directory('src')
    .add(new File('app.js', 25))
    .add(new File('utils.js', 10))
    .add(new File('readme.md', 3))
  );

const sizeCalc = new SizeCalculatorVisitor();
console.log(`Общий размер: ${root.accept(sizeCalc)}KB`); // 61KB

const jsSearch = new FileSearchVisitor('.js');
root.accept(jsSearch);
console.log('JS файлы:', jsSearch.getResults());
// ['index.js', 'app.js', 'utils.js']

const treePrinter = new TreePrintVisitor();
root.accept(treePrinter);
// project/
//   index.js (15KB)
//   style.css (8KB)
//   src/
//     app.js (25KB)
//     utils.js (10KB)
//     readme.md (3KB)
```

### Пример 3: Валидация форм

```javascript
class StringField {
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }
  accept(visitor) { return visitor.visitString(this); }
}

class NumberField {
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }
  accept(visitor) { return visitor.visitNumber(this); }
}

class EmailField {
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }
  accept(visitor) { return visitor.visitEmail(this); }
}

// Посетитель: валидация
class ValidationVisitor {
  constructor() {
    this.errors = [];
  }

  visitString(field) {
    if (!field.value || field.value.trim() === '') {
      this.errors.push(`${field.name}: поле не может быть пустым`);
    }
  }

  visitNumber(field) {
    if (isNaN(field.value)) {
      this.errors.push(`${field.name}: должно быть числом`);
    }
  }

  visitEmail(field) {
    if (!field.value.includes('@')) {
      this.errors.push(`${field.name}: некорректный email`);
    }
  }

  isValid() {
    return this.errors.length === 0;
  }
}

// Посетитель: сериализация
class SerializerVisitor {
  constructor() {
    this.result = {};
  }

  visitString(field) {
    this.result[field.name] = String(field.value).trim();
  }

  visitNumber(field) {
    this.result[field.name] = Number(field.value);
  }

  visitEmail(field) {
    this.result[field.name] = String(field.value).toLowerCase().trim();
  }

  getData() {
    return this.result;
  }
}

// Использование
const formFields = [
  new StringField('name', 'Alice'),
  new NumberField('age', '30'),
  new EmailField('email', 'alice@example.com')
];

const validator = new ValidationVisitor();
formFields.forEach(field => field.accept(validator));
console.log('Valid:', validator.isValid()); // true

const serializer = new SerializerVisitor();
formFields.forEach(field => field.accept(serializer));
console.log(serializer.getData());
// { name: 'Alice', age: 30, email: 'alice@example.com' }
```

---

## Примеры из реальной жизни

| Библиотека / Инструмент | Где используется |
|--------------------------|------------------|
| **Babel** | Трансформация AST с помощью visitor-плагинов |
| **ESLint** | Правила реализованы как visitors для AST |
| **TypeScript Compiler** | Type checker обходит AST через visitors |
| **DOM** | TreeWalker / NodeIterator для обхода дерева |
| **PostCSS** | Плагины обрабатывают CSS AST через visitors |

---

## Когда использовать Visitor

### Хорошие случаи:

- **Много операций** — нужно часто добавлять новые операции над объектами
- **Стабильная иерархия** — классы элементов меняются редко
- **Разделение ответственности** — операции не относятся к элементам
- **AST обработка** — компиляторы, линтеры, трансформеры

### Когда не нужен:

- **Часто меняются элементы** — добавление нового типа элемента требует правки всех visitors
- **Мало операций** — проще добавить метод прямо в класс
- **Простая структура** — паттерн добавляет сложность

---

## Сравнение с другими паттернами

| Аспект | Visitor | Strategy |
|--------|---------|----------|
| **Цель** | Добавить операции к объектам | Выбирать алгоритм |
| **Механизм** | Double dispatch | Делегирование |
| **Применяется к** | Множеству типов элементов | Одному контексту |
| **Расширяемость** | Новые операции без изменения элементов | Новые алгоритмы |

| Аспект | Visitor | Iterator |
|--------|---------|----------|
| **Цель** | Операции над элементами | Обход элементов |
| **Фокус** | Что делать с элементом | Как обойти коллекцию |
| **Совместимость** | Часто используются вместе | Часто используются вместе |

---

## Резюме

| Аспект | Описание |
|--------|---------|
| **Цель** | Добавлять новые операции без изменения классов элементов |
| **Проблема** | Каждая новая операция требует изменения всех классов |
| **Решение** | Вынести операции в отдельные объекты-посетители |
| **Плюсы** | Open/Closed, SRP, накопление состояния при обходе |
| **Минусы** | Сложность при изменении иерархии элементов |
| **Когда** | AST, деревья, много разных операций над одной структурой |
