# Memento паттерн

**Memento** (Снимок) — это поведенческий паттерн, который позволяет сохранять и восстанавливать предыдущее состояние объекта без раскрытия деталей его реализации.

---

## Проблема

```javascript
// ❌ Без паттерна — нарушение инкапсуляции для undo
class TextEditor {
  constructor() {
    this.content = '';
    this.cursorPosition = 0;
    this.fontSize = 14;
  }

  type(text) {
    this.content += text;
    this.cursorPosition = this.content.length;
  }
}

// Чтобы реализовать Undo, нужно:
// 1. Знать ВСЕ внутренние поля (content, cursorPosition, fontSize)
// 2. Вручную сохранять их
// 3. Вручную восстанавливать
const editor = new TextEditor();
const backup = {
  content: editor.content,
  cursorPosition: editor.cursorPosition,
  fontSize: editor.fontSize
};
// Если добавится новое поле — код сломается!
```

### Проблемы:

1. **Нарушение инкапсуляции** — внешний код знает о внутренней структуре
2. **Хрупкость** — добавление поля требует изменения кода сохранения
3. **Сложность** — история изменений разбросана по коду
4. **Ответственность** — кто отвечает за сохранение? За восстановление?

---

## Решение

### Визуализация паттерна

```
┌──────────────┐    creates     ┌────────────┐
│  Originator  │ ─────────────▶ │  Memento   │
│ (TextEditor) │                │ (Snapshot)  │
│              │ ◀───────────── │            │
│ + save()     │    restores    │ - state    │
│ + restore()  │                └────────────┘
└──────────────┘                      │
                                      │ stores
                               ┌──────┴──────┐
                               │  Caretaker   │
                               │  (History)   │
                               │              │
                               │ + undo()     │
                               │ + redo()     │
                               └──────────────┘
```

### Базовый пример

```javascript
// Memento — хранит снимок состояния
class EditorMemento {
  constructor(content, cursorPosition, fontSize) {
    this.content = content;
    this.cursorPosition = cursorPosition;
    this.fontSize = fontSize;
    this.timestamp = new Date();
  }
}

// Originator — создаёт и восстанавливает снимки
class TextEditor {
  constructor() {
    this.content = '';
    this.cursorPosition = 0;
    this.fontSize = 14;
  }

  type(text) {
    this.content += text;
    this.cursorPosition = this.content.length;
  }

  setFontSize(size) {
    this.fontSize = size;
  }

  deleteLast(count = 1) {
    this.content = this.content.slice(0, -count);
    this.cursorPosition = this.content.length;
  }

  // Создать снимок
  save() {
    return new EditorMemento(
      this.content,
      this.cursorPosition,
      this.fontSize
    );
  }

  // Восстановить из снимка
  restore(memento) {
    this.content = memento.content;
    this.cursorPosition = memento.cursorPosition;
    this.fontSize = memento.fontSize;
  }

  toString() {
    return `"${this.content}" (cursor: ${this.cursorPosition}, font: ${this.fontSize})`;
  }
}

// Caretaker — управляет историей снимков
class History {
  constructor(editor) {
    this.editor = editor;
    this.undoStack = [];
    this.redoStack = [];
  }

  execute(action) {
    // Сохраняем состояние перед действием
    this.undoStack.push(this.editor.save());
    this.redoStack = []; // Очищаем redo при новом действии
    action();
  }

  undo() {
    if (this.undoStack.length === 0) {
      console.log('Нечего отменять');
      return;
    }
    // Сохраняем текущее состояние для redo
    this.redoStack.push(this.editor.save());
    // Восстанавливаем предыдущее
    const memento = this.undoStack.pop();
    this.editor.restore(memento);
  }

  redo() {
    if (this.redoStack.length === 0) {
      console.log('Нечего повторять');
      return;
    }
    this.undoStack.push(this.editor.save());
    const memento = this.redoStack.pop();
    this.editor.restore(memento);
  }
}

// Использование
const editor = new TextEditor();
const history = new History(editor);

history.execute(() => editor.type('Hello'));
console.log(editor.toString()); // "Hello" (cursor: 5, font: 14)

history.execute(() => editor.type(' World'));
console.log(editor.toString()); // "Hello World" (cursor: 11, font: 14)

history.execute(() => editor.setFontSize(18));
console.log(editor.toString()); // "Hello World" (cursor: 11, font: 18)

history.undo();
console.log(editor.toString()); // "Hello World" (cursor: 11, font: 14)

history.undo();
console.log(editor.toString()); // "Hello" (cursor: 5, font: 14)

history.redo();
console.log(editor.toString()); // "Hello World" (cursor: 11, font: 14)
```

---

## Практические примеры

### Пример 1: Состояние формы

```javascript
class FormMemento {
  constructor(data) {
    this.data = JSON.parse(JSON.stringify(data)); // Глубокое копирование
    this.timestamp = Date.now();
  }
}

class Form {
  constructor(fields) {
    this.data = {};
    fields.forEach(field => this.data[field] = '');
  }

  setField(name, value) {
    this.data[name] = value;
  }

  getField(name) {
    return this.data[name];
  }

  save() {
    return new FormMemento(this.data);
  }

  restore(memento) {
    this.data = JSON.parse(JSON.stringify(memento.data));
  }

  toString() {
    return JSON.stringify(this.data);
  }
}

class FormHistory {
  constructor(form) {
    this.form = form;
    this.snapshots = [form.save()]; // Начальное состояние
    this.currentIndex = 0;
  }

  saveState() {
    // Удаляем будущие состояния
    this.snapshots = this.snapshots.slice(0, this.currentIndex + 1);
    this.snapshots.push(this.form.save());
    this.currentIndex++;
  }

  undo() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.form.restore(this.snapshots[this.currentIndex]);
    }
  }

  redo() {
    if (this.currentIndex < this.snapshots.length - 1) {
      this.currentIndex++;
      this.form.restore(this.snapshots[this.currentIndex]);
    }
  }

  canUndo() { return this.currentIndex > 0; }
  canRedo() { return this.currentIndex < this.snapshots.length - 1; }
}

// Использование
const form = new Form(['name', 'email', 'phone']);
const formHistory = new FormHistory(form);

form.setField('name', 'Alice');
formHistory.saveState();

form.setField('email', 'alice@mail.com');
formHistory.saveState();

form.setField('phone', '+7-999-123-45-67');
formHistory.saveState();

console.log(form.toString());
// {"name":"Alice","email":"alice@mail.com","phone":"+7-999-123-45-67"}

formHistory.undo();
console.log(form.toString());
// {"name":"Alice","email":"alice@mail.com","phone":""}

formHistory.undo();
console.log(form.toString());
// {"name":"Alice","email":"","phone":""}

formHistory.redo();
console.log(form.toString());
// {"name":"Alice","email":"alice@mail.com","phone":""}
```

### Пример 2: Графический редактор (Canvas)

```javascript
class CanvasMemento {
  constructor(shapes) {
    this.shapes = shapes.map(s => ({ ...s }));
  }
}

class Canvas {
  constructor() {
    this.shapes = [];
  }

  addShape(type, x, y, color = 'black') {
    this.shapes.push({ type, x, y, color, id: Date.now() });
  }

  moveShape(index, newX, newY) {
    if (this.shapes[index]) {
      this.shapes[index].x = newX;
      this.shapes[index].y = newY;
    }
  }

  removeLastShape() {
    this.shapes.pop();
  }

  save() {
    return new CanvasMemento(this.shapes);
  }

  restore(memento) {
    this.shapes = memento.shapes.map(s => ({ ...s }));
  }

  render() {
    if (this.shapes.length === 0) {
      console.log('[Canvas] Пусто');
      return;
    }
    this.shapes.forEach(s => {
      console.log(`  ${s.type} at (${s.x}, ${s.y}) [${s.color}]`);
    });
  }
}

class CanvasHistory {
  constructor(canvas, maxSnapshots = 50) {
    this.canvas = canvas;
    this.maxSnapshots = maxSnapshots;
    this.undoStack = [];
    this.redoStack = [];
  }

  do(action) {
    this.undoStack.push(this.canvas.save());
    if (this.undoStack.length > this.maxSnapshots) {
      this.undoStack.shift(); // Ограничиваем историю
    }
    this.redoStack = [];
    action();
  }

  undo() {
    if (this.undoStack.length === 0) return false;
    this.redoStack.push(this.canvas.save());
    this.canvas.restore(this.undoStack.pop());
    return true;
  }

  redo() {
    if (this.redoStack.length === 0) return false;
    this.undoStack.push(this.canvas.save());
    this.canvas.restore(this.redoStack.pop());
    return true;
  }
}

// Использование
const canvas = new Canvas();
const canvasHistory = new CanvasHistory(canvas);

canvasHistory.do(() => canvas.addShape('circle', 10, 20, 'red'));
canvasHistory.do(() => canvas.addShape('rect', 30, 40, 'blue'));
canvasHistory.do(() => canvas.moveShape(0, 50, 60));

console.log('Текущее состояние:');
canvas.render();
// circle at (50, 60) [red]
// rect at (30, 40) [blue]

canvasHistory.undo(); // Отмена перемещения
console.log('После undo:');
canvas.render();
// circle at (10, 20) [red]
// rect at (30, 40) [blue]

canvasHistory.undo(); // Отмена добавления rect
console.log('После второго undo:');
canvas.render();
// circle at (10, 20) [red]
```

### Пример 3: Конфигурация приложения

```javascript
class ConfigMemento {
  constructor(settings) {
    this.settings = JSON.parse(JSON.stringify(settings));
    this.label = '';
  }

  setLabel(label) {
    this.label = label;
    return this;
  }
}

class AppConfig {
  constructor() {
    this.settings = {
      theme: 'light',
      language: 'ru',
      fontSize: 14,
      notifications: true,
      sidebar: { visible: true, width: 250 }
    };
  }

  set(key, value) {
    const keys = key.split('.');
    let obj = this.settings;
    for (let i = 0; i < keys.length - 1; i++) {
      obj = obj[keys[i]];
    }
    obj[keys[keys.length - 1]] = value;
  }

  get(key) {
    return key.split('.').reduce((obj, k) => obj[k], this.settings);
  }

  save() {
    return new ConfigMemento(this.settings);
  }

  restore(memento) {
    this.settings = JSON.parse(JSON.stringify(memento.settings));
  }
}

class ConfigManager {
  constructor(config) {
    this.config = config;
    this.bookmarks = new Map(); // Именованные снимки
    this.autoSaves = [];
  }

  // Сохранить именованный снимок
  bookmark(name) {
    const memento = this.config.save();
    memento.setLabel(name);
    this.bookmarks.set(name, memento);
    console.log(`Снимок "${name}" сохранён`);
  }

  // Восстановить из именованного снимка
  loadBookmark(name) {
    const memento = this.bookmarks.get(name);
    if (memento) {
      this.config.restore(memento);
      console.log(`Снимок "${name}" восстановлен`);
    } else {
      console.log(`Снимок "${name}" не найден`);
    }
  }

  listBookmarks() {
    return [...this.bookmarks.keys()];
  }
}

// Использование
const config = new AppConfig();
const manager = new ConfigManager(config);

// Сохраняем начальную конфигурацию
manager.bookmark('default');

// Настраиваем тёмную тему
config.set('theme', 'dark');
config.set('fontSize', 16);
config.set('sidebar.width', 300);
manager.bookmark('dark-theme');

// Настраиваем минимальный режим
config.set('sidebar.visible', false);
config.set('notifications', false);
manager.bookmark('minimal');

console.log('Текущие:', config.get('theme'), config.get('sidebar.visible'));
// dark, false

// Вернуться к начальным настройкам
manager.loadBookmark('default');
console.log('После восстановления:', config.get('theme'), config.get('sidebar.visible'));
// light, true

// Переключиться на тёмную тему
manager.loadBookmark('dark-theme');
console.log('Тёмная тема:', config.get('theme'), config.get('fontSize'));
// dark, 16
```

---

## Примеры из реальной жизни

| Библиотека / Инструмент | Где используется |
|--------------------------|------------------|
| **Ctrl+Z / Cmd+Z** | Undo во всех текстовых редакторах |
| **Git** | Коммиты — снимки состояния репозитория |
| **Redux DevTools** | Time-travel debugging — перемотка состояния |
| **Photoshop** | History panel — история действий |
| **Браузер** | history.back() / history.forward() |
| **Базы данных** | Транзакции с rollback |

---

## Когда использовать Memento

### Хорошие случаи:

- **Undo/Redo** — отмена и повтор действий
- **Снимки** — сохранение контрольных точек
- **Транзакции** — откат при ошибке
- **Инкапсуляция** — нужно сохранить состояние без раскрытия деталей

### Когда не нужен:

- **Большое состояние** — снимки занимают много памяти
- **Частые изменения** — слишком много снимков
- **Нет undo** — если отмена не нужна, паттерн избыточен

---

## Сравнение с другими паттернами

| Аспект | Memento | Command |
|--------|---------|---------|
| **Что хранит** | Полное состояние объекта | Действие (операцию) |
| **Undo** | Восстанавливает состояние целиком | Выполняет обратную операцию |
| **Память** | Больше (полные снимки) | Меньше (только действия) |
| **Сложность** | Проще реализовать | Нужна обратная операция |

| Аспект | Memento | Prototype |
|--------|---------|-----------|
| **Цель** | Сохранение/восстановление состояния | Клонирование объектов |
| **Время** | Снимок в определённый момент | Копия текущего состояния |

---

## Резюме

| Аспект | Описание |
|--------|---------|
| **Цель** | Сохранять и восстанавливать состояние объекта |
| **Проблема** | Реализация undo/redo без нарушения инкапсуляции |
| **Решение** | Объект сам создаёт снимок своего состояния |
| **Плюсы** | Инкапсуляция, простой undo/redo, контрольные точки |
| **Минусы** | Расход памяти на снимки |
| **Когда** | Undo/Redo, транзакции, контрольные точки |
