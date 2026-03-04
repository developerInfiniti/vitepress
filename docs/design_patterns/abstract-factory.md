# Abstract Factory паттерн

**Abstract Factory** (Абстрактная фабрика) — это порождающий паттерн, который предоставляет интерфейс для создания семейств взаимосвязанных объектов без указания их конкретных классов.

---

## Проблема

```javascript
// ❌ Без паттерна — жёсткая привязка к конкретным классам
function createUI(theme) {
  let button, input, checkbox;

  if (theme === 'dark') {
    button = new DarkButton();
    input = new DarkInput();
    checkbox = new DarkCheckbox();
  } else if (theme === 'light') {
    button = new LightButton();
    input = new LightInput();
    checkbox = new LightCheckbox();
  }
  // Что если добавить новую тему? Менять весь код!

  return { button, input, checkbox };
}
```

### Проблемы такого подхода:

1. **Жёсткая связанность** — клиент знает о всех конкретных классах
2. **Нарушение Open/Closed** — добавление новой темы требует изменения существующего кода
3. **Несогласованность** — можно случайно смешать элементы разных тем
4. **Сложность поддержки** — дублирование логики создания

---

## Решение

### Базовый пример

```javascript
// Абстрактная фабрика (интерфейс)
class UIFactory {
  createButton() {
    throw new Error('Must implement createButton()');
  }
  createInput() {
    throw new Error('Must implement createInput()');
  }
  createCheckbox() {
    throw new Error('Must implement createCheckbox()');
  }
}

// Конкретная фабрика: Тёмная тема
class DarkUIFactory extends UIFactory {
  createButton() {
    return new DarkButton();
  }
  createInput() {
    return new DarkInput();
  }
  createCheckbox() {
    return new DarkCheckbox();
  }
}

// Конкретная фабрика: Светлая тема
class LightUIFactory extends UIFactory {
  createButton() {
    return new LightButton();
  }
  createInput() {
    return new LightInput();
  }
  createCheckbox() {
    return new LightCheckbox();
  }
}

// Конкретные продукты
class DarkButton {
  render() {
    return '<button class="btn-dark">Click</button>';
  }
}

class LightButton {
  render() {
    return '<button class="btn-light">Click</button>';
  }
}

class DarkInput {
  render() {
    return '<input class="input-dark" />';
  }
}

class LightInput {
  render() {
    return '<input class="input-light" />';
  }
}

class DarkCheckbox {
  render() {
    return '<input type="checkbox" class="check-dark" />';
  }
}

class LightCheckbox {
  render() {
    return '<input type="checkbox" class="check-light" />';
  }
}

// ✅ Клиентский код — работает через абстракцию
function buildUI(factory) {
  const button = factory.createButton();
  const input = factory.createInput();
  const checkbox = factory.createCheckbox();

  console.log(button.render());
  console.log(input.render());
  console.log(checkbox.render());
}

// Использование
const darkFactory = new DarkUIFactory();
buildUI(darkFactory);

const lightFactory = new LightUIFactory();
buildUI(lightFactory);
```

---

## Практические примеры

### Пример 1: Кроссплатформенные элементы

```javascript
// Абстрактные продукты
class Button {
  click() { throw new Error('Must implement click()'); }
}

class Dialog {
  open() { throw new Error('Must implement open()'); }
}

class Menu {
  show() { throw new Error('Must implement show()'); }
}

// Windows реализация
class WindowsButton extends Button {
  click() { console.log('[Windows] Button clicked'); }
}

class WindowsDialog extends Dialog {
  open() { console.log('[Windows] Dialog opened'); }
}

class WindowsMenu extends Menu {
  show() { console.log('[Windows] Menu displayed'); }
}

// macOS реализация
class MacButton extends Button {
  click() { console.log('[macOS] Button clicked'); }
}

class MacDialog extends Dialog {
  open() { console.log('[macOS] Dialog opened'); }
}

class MacMenu extends Menu {
  show() { console.log('[macOS] Menu displayed'); }
}

// Фабрики
class WindowsFactory {
  createButton() { return new WindowsButton(); }
  createDialog() { return new WindowsDialog(); }
  createMenu() { return new WindowsMenu(); }
}

class MacFactory {
  createButton() { return new MacButton(); }
  createDialog() { return new MacDialog(); }
  createMenu() { return new MacMenu(); }
}

// Клиентский код
function createApp(factory) {
  const button = factory.createButton();
  const dialog = factory.createDialog();
  const menu = factory.createMenu();

  button.click();
  dialog.open();
  menu.show();
}

// Выбор фабрики на основе платформы
const platform = 'mac'; // или 'windows'
const factory = platform === 'mac' ? new MacFactory() : new WindowsFactory();
createApp(factory);
```

### Пример 2: Базы данных (ORM-подобная абстракция)

```javascript
// Абстрактные продукты
class Connection {
  connect() { throw new Error('Must implement'); }
}

class QueryBuilder {
  select(table) { throw new Error('Must implement'); }
}

class Migration {
  run(sql) { throw new Error('Must implement'); }
}

// MySQL реализация
class MySQLConnection extends Connection {
  connect() {
    console.log('Connecting to MySQL on port 3306...');
    return { status: 'connected', db: 'mysql' };
  }
}

class MySQLQueryBuilder extends QueryBuilder {
  select(table) {
    return `SELECT * FROM \`${table}\``;
  }
}

class MySQLMigration extends Migration {
  run(sql) {
    console.log(`[MySQL] Running migration: ${sql}`);
  }
}

// PostgreSQL реализация
class PostgresConnection extends Connection {
  connect() {
    console.log('Connecting to PostgreSQL on port 5432...');
    return { status: 'connected', db: 'postgres' };
  }
}

class PostgresQueryBuilder extends QueryBuilder {
  select(table) {
    return `SELECT * FROM "${table}"`;
  }
}

class PostgresMigration extends Migration {
  run(sql) {
    console.log(`[Postgres] Running migration: ${sql}`);
  }
}

// Фабрики
class MySQLFactory {
  createConnection() { return new MySQLConnection(); }
  createQueryBuilder() { return new MySQLQueryBuilder(); }
  createMigration() { return new MySQLMigration(); }
}

class PostgresFactory {
  createConnection() { return new PostgresConnection(); }
  createQueryBuilder() { return new PostgresQueryBuilder(); }
  createMigration() { return new PostgresMigration(); }
}

// Использование
function initDatabase(factory) {
  const connection = factory.createConnection();
  const qb = factory.createQueryBuilder();
  const migration = factory.createMigration();

  connection.connect();
  console.log(qb.select('users'));
  migration.run('CREATE TABLE users (id INT PRIMARY KEY)');
}

initDatabase(new MySQLFactory());
// Connecting to MySQL on port 3306...
// SELECT * FROM `users`
// [MySQL] Running migration: CREATE TABLE users (id INT PRIMARY KEY)
```

### Пример 3: Реестр фабрик

```javascript
class FactoryRegistry {
  static factories = {};

  static register(name, factory) {
    this.factories[name] = factory;
  }

  static getFactory(name) {
    const factory = this.factories[name];
    if (!factory) {
      throw new Error(`Factory "${name}" not registered`);
    }
    return factory;
  }
}

// Регистрация фабрик
FactoryRegistry.register('dark', new DarkUIFactory());
FactoryRegistry.register('light', new LightUIFactory());

// Использование — выбор фабрики по конфигурации
const theme = 'dark';
const uiFactory = FactoryRegistry.getFactory(theme);
buildUI(uiFactory);
```

---

## Примеры в реальной жизни

| Библиотека / Фреймворк | Применение |
|-------------------------|------------|
| **React** | `createElement()` — создание элементов для разных рендереров (DOM, Native) |
| **Angular** | `ComponentFactoryResolver` — динамическое создание компонентов |
| **Knex.js** | Поддержка разных БД через единый API (MySQL, PostgreSQL, SQLite) |
| **Material UI** | Темизация — разные наборы компонентов для разных тем |
| **Electron** | Кроссплатформенный UI для Windows, macOS, Linux |

---

## Сравнение с Factory Method

| Аспект | Factory Method | Abstract Factory |
|--------|---------------|-----------------|
| **Создание** | Один тип объектов | Семейства связанных объектов |
| **Количество фабрик** | Одна фабрика | Множество фабрик |
| **Согласованность** | Не гарантирует | Гарантирует совместимость продуктов |
| **Масштаб** | Небольшие системы | Сложные системы с разными платформами |
| **Сложность** | Низкая | Высокая |

```javascript
// Factory Method — создаёт ОДИН тип
class ButtonFactory {
  static create(type) {
    if (type === 'primary') return new PrimaryButton();
    if (type === 'danger') return new DangerButton();
  }
}

// Abstract Factory — создаёт СЕМЕЙСТВО
class ThemeFactory {
  createButton() { /* ... */ }
  createInput() { /* ... */ }
  createDialog() { /* ... */ }
}
```

---

## Когда использовать

### Хорошие случаи:

- **Семейства объектов** — элементы должны быть совместимы друг с другом
- **Кроссплатформенность** — разная реализация для разных платформ
- **Темизация** — наборы компонентов для разных тем
- **Подключение к разным БД** — единый API для разных СУБД
- **Тестирование** — подмена реальных фабрик на mock-фабрики

### Когда не нужен:

- **Один тип объектов** — достаточно Factory Method
- **Простая система** — нет семейств взаимосвязанных объектов
- **Редко меняющиеся зависимости** — избыточная абстракция

---

## Резюме

| Аспект | Описание |
|--------|---------|
| **Цель** | Создание семейств взаимосвязанных объектов |
| **Проблема** | Жёсткая привязка к конкретным классам, несогласованность |
| **Решение** | Абстрактная фабрика с методами для каждого типа продукта |
| **Плюсы** | Согласованность, изоляция, расширяемость |
| **Минусы** | Сложность, много классов |
| **Когда** | Семейства объектов, кроссплатформенность, темизация |

---

## Следующие шаги

1. Изучите **[Builder](/design_patterns/builder)** — пошаговое создание сложных объектов
2. Изучите **[Prototype](/design_patterns/prototype)** — создание объектов через клонирование
3. Вернитесь к **[Factory Method](/design_patterns/factory-method)** для сравнения
