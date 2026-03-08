---
description: "Паттерн Template Method: скелет алгоритма с переопределяемыми шагами — поведенческий паттерн с JS"
---

# Template Method паттерн

**Template Method** (Шаблонный метод) — это поведенческий паттерн, который определяет скелет алгоритма в базовом классе, позволяя подклассам переопределять отдельные шаги без изменения общей структуры.

---

## Проблема

```javascript
// ❌ Без паттерна — дублирование алгоритма в каждом классе
class CSVReportGenerator {
  generate(data) {
    // Шаг 1: Валидация (одинаковый для всех)
    if (!data || data.length === 0) {
      throw new Error('Нет данных');
    }
    // Шаг 2: Подготовка заголовков (одинаковый)
    const headers = Object.keys(data[0]);
    // Шаг 3: Форматирование (уникальный)
    const csv = [headers.join(',')];
    data.forEach(row => {
      csv.push(headers.map(h => row[h]).join(','));
    });
    // Шаг 4: Сохранение (одинаковый)
    console.log('Отчёт сохранён');
    return csv.join('\n');
  }
}

class HTMLReportGenerator {
  generate(data) {
    // Шаг 1: Валидация (ДУБЛИРОВАНИЕ!)
    if (!data || data.length === 0) {
      throw new Error('Нет данных');
    }
    // Шаг 2: Подготовка заголовков (ДУБЛИРОВАНИЕ!)
    const headers = Object.keys(data[0]);
    // Шаг 3: Форматирование (уникальный)
    let html = '<table><tr>';
    headers.forEach(h => html += `<th>${h}</th>`);
    html += '</tr>';
    data.forEach(row => {
      html += '<tr>';
      headers.forEach(h => html += `<td>${row[h]}</td>`);
      html += '</tr>';
    });
    html += '</table>';
    // Шаг 4: Сохранение (ДУБЛИРОВАНИЕ!)
    console.log('Отчёт сохранён');
    return html;
  }
}
```

### Проблемы:

1. **Дублирование** — общие шаги повторяются в каждом классе
2. **Несогласованность** — изменение общего шага требует правки во всех классах
3. **Хрупкость** — легко забыть обновить один из классов
4. **Нарушение DRY** — один и тот же код в нескольких местах

---

## Решение

### Визуализация паттерна

```
┌───────────────────────────┐
│   AbstractClass            │
│ (ReportGenerator)          │
│                            │
│ + generate()  ◄── шаблон   │
│   ├── validate()           │
│   ├── prepareHeaders()     │
│   ├── formatData()  ◄─ абстр│
│   └── save()               │
└───────────────────────────┘
           ▲
     ┌─────┴──────┐
     │            │
┌────┴────┐  ┌───┴─────┐
│  CSV    │  │  HTML   │
│ Report  │  │ Report  │
│         │  │         │
│ format  │  │ format  │
│ Data()  │  │ Data()  │
└─────────┘  └─────────┘
```

### Базовый пример

```javascript
class ReportGenerator {
  // Шаблонный метод — определяет скелет алгоритма
  generate(data) {
    this.validate(data);
    const headers = this.prepareHeaders(data);
    const result = this.formatData(data, headers);
    this.save(result);
    return result;
  }

  // Общие шаги (конкретные методы)
  validate(data) {
    if (!data || data.length === 0) {
      throw new Error('Нет данных для отчёта');
    }
  }

  prepareHeaders(data) {
    return Object.keys(data[0]);
  }

  save(result) {
    console.log('Отчёт сохранён');
  }

  // Абстрактный метод — должен быть переопределён
  formatData(data, headers) {
    throw new Error('Метод formatData() должен быть реализован');
  }
}

class CSVReport extends ReportGenerator {
  formatData(data, headers) {
    const lines = [headers.join(',')];
    data.forEach(row => {
      lines.push(headers.map(h => row[h]).join(','));
    });
    return lines.join('\n');
  }
}

class HTMLReport extends ReportGenerator {
  formatData(data, headers) {
    let html = '<table><tr>';
    headers.forEach(h => html += `<th>${h}</th>`);
    html += '</tr>';
    data.forEach(row => {
      html += '<tr>';
      headers.forEach(h => html += `<td>${row[h]}</td>`);
      html += '</tr>';
    });
    html += '</table>';
    return html;
  }
}

class JSONReport extends ReportGenerator {
  formatData(data, headers) {
    return JSON.stringify(data, null, 2);
  }
}

// Использование
const data = [
  { name: 'Alice', age: 30, role: 'Developer' },
  { name: 'Bob', age: 25, role: 'Designer' }
];

const csv = new CSVReport();
console.log(csv.generate(data));
// name,age,role
// Alice,30,Developer
// Bob,25,Designer

const html = new HTMLReport();
console.log(html.generate(data));
// <table><tr><th>name</th>...

const json = new JSONReport();
console.log(json.generate(data));
// [{ "name": "Alice", ... }]
```

---

## Практические примеры

### Пример 1: Обработка HTTP-запросов

```javascript
class RequestHandler {
  // Шаблонный метод
  async handleRequest(req, res) {
    try {
      this.logRequest(req);
      await this.authenticate(req);
      const validData = this.validateInput(req.body);
      const result = await this.processRequest(validData);
      this.sendResponse(res, result);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  logRequest(req) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  }

  async authenticate(req) {
    // По умолчанию не требует аутентификации
  }

  validateInput(body) {
    return body; // По умолчанию пропускаем
  }

  // Абстрактный — подклассы реализуют
  async processRequest(data) {
    throw new Error('processRequest() не реализован');
  }

  sendResponse(res, result) {
    res.status(200).json({ success: true, data: result });
  }

  handleError(res, error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

class CreateUserHandler extends RequestHandler {
  async authenticate(req) {
    if (!req.headers.authorization) {
      throw new Error('Необходима авторизация');
    }
  }

  validateInput(body) {
    if (!body.email || !body.name) {
      throw new Error('Email и имя обязательны');
    }
    return { email: body.email, name: body.name };
  }

  async processRequest(data) {
    // Создание пользователя в БД
    return { id: Date.now(), ...data, createdAt: new Date() };
  }
}

class GetUsersHandler extends RequestHandler {
  async processRequest(data) {
    // Получение списка пользователей
    return [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' }
    ];
  }
}
```

### Пример 2: Сборка проекта (Build Pipeline)

```javascript
class BuildPipeline {
  // Шаблонный метод
  async build() {
    console.log('=== Начало сборки ===');
    await this.clean();
    await this.installDependencies();
    await this.lint();
    await this.compile();
    await this.test();
    await this.package();
    console.log('=== Сборка завершена ===');
  }

  async clean() {
    console.log('Очистка директории сборки...');
  }

  async installDependencies() {
    console.log('Установка зависимостей...');
  }

  // Hook — подклассы могут переопределить
  async lint() {
    // По умолчанию пропускаем
  }

  async compile() {
    throw new Error('compile() должен быть реализован');
  }

  async test() {
    throw new Error('test() должен быть реализован');
  }

  async package() {
    throw new Error('package() должен быть реализован');
  }
}

class ReactAppBuild extends BuildPipeline {
  async lint() {
    console.log('ESLint проверка...');
  }

  async compile() {
    console.log('Webpack сборка React приложения...');
  }

  async test() {
    console.log('Jest тесты...');
  }

  async package() {
    console.log('Создание Docker образа...');
  }
}

class NodeAPIBuild extends BuildPipeline {
  async compile() {
    console.log('TypeScript компиляция...');
  }

  async test() {
    console.log('Mocha тесты...');
  }

  async package() {
    console.log('Создание npm пакета...');
  }
}

// Использование
const reactBuild = new ReactAppBuild();
await reactBuild.build();
```

### Пример 3: Парсинг данных

```javascript
class DataParser {
  // Шаблонный метод
  parse(rawData) {
    const cleaned = this.cleanData(rawData);
    const parsed = this.doParse(cleaned);
    const validated = this.validate(parsed);
    return this.transform(validated);
  }

  cleanData(data) {
    return data.trim();
  }

  validate(data) {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      throw new Error('Нет данных после парсинга');
    }
    return data;
  }

  // Абстрактные методы
  doParse(data) {
    throw new Error('doParse() не реализован');
  }

  transform(data) {
    return data; // По умолчанию без преобразования
  }
}

class CSVParser extends DataParser {
  doParse(data) {
    const lines = data.split('\n');
    const headers = lines[0].split(',');
    return lines.slice(1).map(line => {
      const values = line.split(',');
      const obj = {};
      headers.forEach((h, i) => obj[h.trim()] = values[i]?.trim());
      return obj;
    });
  }

  transform(data) {
    // Приведение числовых полей
    return data.map(row => {
      const transformed = {};
      for (const [key, value] of Object.entries(row)) {
        transformed[key] = isNaN(value) ? value : Number(value);
      }
      return transformed;
    });
  }
}

class XMLParser extends DataParser {
  doParse(data) {
    // Упрощённый парсинг XML
    const items = [];
    const regex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    while ((match = regex.exec(data)) !== null) {
      const item = {};
      const fieldRegex = /<(\w+)>(.*?)<\/\1>/g;
      let fieldMatch;
      while ((fieldMatch = fieldRegex.exec(match[1])) !== null) {
        item[fieldMatch[1]] = fieldMatch[2];
      }
      items.push(item);
    }
    return items;
  }
}

// Использование
const csvParser = new CSVParser();
const result = csvParser.parse('name,age\nAlice,30\nBob,25');
console.log(result);
// [{ name: 'Alice', age: 30 }, { name: 'Bob', age: 25 }]
```

---

## Примеры из реальной жизни

| Библиотека / Инструмент | Где используется |
|--------------------------|------------------|
| **React** | Lifecycle методы: componentDidMount, shouldComponentUpdate |
| **Express/Koa** | Middleware pipeline — фиксированный порядок обработки |
| **Jest** | beforeEach, test, afterEach — шаблон тестирования |
| **Webpack** | Loader pipeline — цепочка обработки файлов |
| **Angular** | Lifecycle hooks: ngOnInit, ngOnDestroy |

---

## Когда использовать Template Method

### Хорошие случаи:

- **Общий алгоритм** — несколько классов имеют одинаковую структуру с разными деталями
- **Фреймворки** — определяете скелет, пользователи реализуют шаги
- **Предотвращение дублирования** — общая логика в базовом классе
- **Контроль расширения** — разрешаете менять только определённые шаги

### Когда не нужен:

- **Мало шагов** — если алгоритм простой, не нужно выделять шаблон
- **Нет общей структуры** — классы делают совершенно разные вещи
- **Предпочтение композиции** — Strategy может быть гибче

---

## Сравнение с другими паттернами

| Аспект | Template Method | Strategy |
|--------|----------------|----------|
| **Механизм** | Наследование | Композиция |
| **Гибкость** | Переопределяем шаги | Заменяем весь алгоритм |
| **Связанность** | Подклассы привязаны к базовому | Стратегии независимы |
| **Когда** | Общий скелет с вариациями | Полностью разные алгоритмы |

| Аспект | Template Method | Factory Method |
|--------|----------------|----------------|
| **Цель** | Определить скелет алгоритма | Создание объектов |
| **Что переопределяется** | Шаги алгоритма | Тип создаваемого объекта |
| **Сходство** | Оба используют наследование | Оба используют наследование |

---

## Резюме

| Аспект | Описание |
|--------|---------|
| **Цель** | Определить скелет алгоритма в базовом классе |
| **Проблема** | Дублирование общей логики в подклассах |
| **Решение** | Общие шаги в базовом классе, уникальные — в подклассах |
| **Плюсы** | Устранение дублирования, контроль структуры, расширяемость |
| **Минусы** | Ограничение наследованием, сложность при многих шагах |
| **Когда** | Общий алгоритм с вариативными шагами |
