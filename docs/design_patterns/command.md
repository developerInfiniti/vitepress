# Command (Команда)

## Описание

Паттерн **Command** инкапсулирует запрос как объект, позволяя параметризовать клиентов с различными запросами, ставить запросы в очередь, регистрировать запросы и поддерживать отмену операций.

## Проблема

Вам нужно отделить объекты, которые инициируют операции, от объектов, которые эти операции выполняют. Нужны возможности:
- Отмены операций
- Ставить операции в очередь
- Логирование операций
- Отложенное выполнение

## Решение

Упаковывайте запросы в отдельные объекты команд, которые можно обрабатывать как данные.

## Реализация

### Базовый пример

```javascript
// Команда - интерфейс
class Command {
  execute() {}
  undo() {}
}

// Получатель - объект, который выполняет работу
class Light {
  constructor(name) {
    this.name = name;
    this.isOn = false;
  }

  turnOn() {
    console.log(`${this.name} light is on`);
    this.isOn = true;
  }

  turnOff() {
    console.log(`${this.name} light is off`);
    this.isOn = false;
  }
}

// Конкретные команды
class TurnOnCommand extends Command {
  constructor(light) {
    super();
    this.light = light;
  }

  execute() {
    this.light.turnOn();
  }

  undo() {
    this.light.turnOff();
  }
}

class TurnOffCommand extends Command {
  constructor(light) {
    super();
    this.light = light;
  }

  execute() {
    this.light.turnOff();
  }

  undo() {
    this.light.turnOn();
  }
}

// Инициатор - отправляет команды
class RemoteControl {
  constructor() {
    this.commands = [];
    this.history = [];
  }

  setCommand(command) {
    this.commands.push(command);
  }

  executeCommand(index) {
    const command = this.commands[index];
    if (command) {
      command.execute();
      this.history.push(command);
    }
  }

  undo() {
    const command = this.history.pop();
    if (command) {
      command.undo();
    }
  }
}

// Использование
const light = new Light('Living Room');
const onCommand = new TurnOnCommand(light);
const offCommand = new TurnOffCommand(light);

const remote = new RemoteControl();
remote.setCommand(onCommand);
remote.setCommand(offCommand);

remote.executeCommand(0); // Living Room light is on
remote.executeCommand(1); // Living Room light is off
remote.undo();            // Living Room light is on
```

### Пример: Текстовый редактор с undo/redo

```javascript
class TextDocument {
  constructor() {
    this.content = '';
  }

  insert(text) {
    this.content += text;
  }

  deleteText(length) {
    this.content = this.content.slice(0, -length);
  }

  getContent() {
    return this.content;
  }
}

class InsertCommand extends Command {
  constructor(document, text) {
    super();
    this.document = document;
    this.text = text;
  }

  execute() {
    console.log(`Inserting: "${this.text}"`);
    this.document.insert(this.text);
  }

  undo() {
    console.log(`Undoing insert: "${this.text}"`);
    this.document.deleteText(this.text.length);
  }
}

class DeleteCommand extends Command {
  constructor(document, length) {
    super();
    this.document = document;
    this.length = length;
    this.deleted = '';
  }

  execute() {
    console.log(`Deleting ${this.length} characters`);
    this.deleted = this.document.content.slice(-this.length);
    this.document.deleteText(this.length);
  }

  undo() {
    console.log(`Undoing delete: "${this.deleted}"`);
    this.document.insert(this.deleted);
  }
}

class Editor {
  constructor() {
    this.document = new TextDocument();
    this.history = [];
    this.historyIndex = -1;
  }

  execute(command) {
    command.execute();
    this.history = this.history.slice(0, this.historyIndex + 1);
    this.history.push(command);
    this.historyIndex++;
  }

  undo() {
    if (this.historyIndex >= 0) {
      this.history[this.historyIndex].undo();
      this.historyIndex--;
    }
  }

  redo() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this.history[this.historyIndex].execute();
    }
  }

  getContent() {
    return this.document.getContent();
  }
}

// Использование
const editor = new Editor();

editor.execute(new InsertCommand(editor.document, 'Hello'));
console.log(editor.getContent()); // Hello

editor.execute(new InsertCommand(editor.document, ' World'));
console.log(editor.getContent()); // Hello World

editor.execute(new DeleteCommand(editor.document, 5));
console.log(editor.getContent()); // Hello

editor.undo();
console.log(editor.getContent()); // Hello World

editor.redo();
console.log(editor.getContent()); // Hello
```

### Пример: Система задач

```javascript
class TaskQueue {
  constructor() {
    this.tasks = [];
    this.executed = [];
  }

  addTask(command) {
    this.tasks.push(command);
  }

  executeTasks() {
    while (this.tasks.length > 0) {
      const command = this.tasks.shift();
      command.execute();
      this.executed.push(command);
    }
  }

  rollback() {
    while (this.executed.length > 0) {
      const command = this.executed.pop();
      if (command.undo) {
        command.undo();
      }
    }
  }
}

class EmailCommand extends Command {
  constructor(email, subject, body) {
    super();
    this.email = email;
    this.subject = subject;
    this.body = body;
  }

  execute() {
    console.log(`Sending email to ${this.email}: "${this.subject}"`);
  }

  undo() {
    console.log(`Email to ${this.email} has been revoked`);
  }
}

class LogCommand extends Command {
  constructor(message) {
    super();
    this.message = message;
  }

  execute() {
    console.log(`[LOG] ${this.message}`);
  }
}

// Использование
const queue = new TaskQueue();

queue.addTask(new LogCommand('Starting operation'));
queue.addTask(new EmailCommand('user@example.com', 'Order Confirmation', 'Your order has been placed'));
queue.addTask(new LogCommand('Operation completed'));

queue.executeTasks();
// [LOG] Starting operation
// Sending email to user@example.com: "Order Confirmation"
// [LOG] Operation completed

queue.rollback();
// Email to user@example.com has been revoked
```

## Примеры в реальной жизни

### 1. React Form Commands

```javascript
class FormFieldCommand extends Command {
  constructor(formState, fieldName, value) {
    super();
    this.formState = formState;
    this.fieldName = fieldName;
    this.value = value;
    this.previousValue = null;
  }

  execute() {
    this.previousValue = this.formState[this.fieldName];
    this.formState[this.fieldName] = this.value;
  }

  undo() {
    this.formState[this.fieldName] = this.previousValue;
  }
}

function useFormHistory(initialState) {
  const [formState, setFormState] = useState(initialState);
  const [history, setHistory] = useState([]);

  const execute = (command) => {
    command.execute();
    setFormState({ ...command.formState });
    setHistory([...history, command]);
  };

  const undo = () => {
    if (history.length > 0) {
      const lastCommand = history[history.length - 1];
      lastCommand.undo();
      setFormState({ ...lastCommand.formState });
      setHistory(history.slice(0, -1));
    }
  };

  return { formState, execute, undo };
}
```

### 2. Git Commands (CLI)

```javascript
// Git является примером паттерна Command
class GitCommit extends Command {
  constructor(repository, message) {
    super();
    this.repository = repository;
    this.message = message;
  }

  execute() {
    console.log(`Committing: ${this.message}`);
    // Git implementation
  }

  undo() {
    console.log(`Reverting commit`);
    // Git revert implementation
  }
}

class GitPush extends Command {
  execute() {
    console.log('Pushing to remote');
  }
}
```

### 3. UI Button Handlers

```javascript
class ButtonClickCommand extends Command {
  constructor(callback) {
    super();
    this.callback = callback;
  }

  execute() {
    this.callback();
  }
}

// Использование в React
<button onClick={() => {
  const command = new ButtonClickCommand(() => {
    console.log('Button clicked');
  });
  command.execute();
}}>
  Click me
</button>
```

## Преимущества

- ✅ Отделяет объекты, инициирующие операции, от выполняющих их
- ✅ Поддерживает отмену и повтор операций
- ✅ Позволяет ставить операции в очередь
- ✅ Позволяет откладывать выполнение команд
- ✅ Позволяет логировать команды

## Недостатки

- ❌ Может привести к большому количеству классов команд
- ❌ Усложняет код за счёт введения новых классов

## Когда использовать

- Нужна отмена/повтор функциональность
- Нужно ставить операции в очередь или расписание
- Нужно выполнять операции отложенно
- Нужно логировать операции
- Нужна обработка транзакций

## Сравнение с другими паттернами

| Паттерн | Цель | Различие |
|---------|------|----------|
| **Command** | Инкапсулирует запрос как объект | Позволяет отмену и ставление в очередь |
| **Strategy** | Инкапсулирует алгоритм | Используется для выбора алгоритма |
| **Iterator** | Обходит элементы коллекции | Итерирует по элементам |
| **Memento** | Сохраняет состояние | Восстанавливает предыдущее состояние |
