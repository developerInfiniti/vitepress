# Builder паттерн

**Builder** (Строитель) — это порождающий паттерн, который позволяет создавать сложные объекты пошагово. Паттерн отделяет конструирование объекта от его представления.

---

## Проблема

```javascript
// ❌ Без паттерна — конструктор с множеством параметров
class User {
  constructor(name, age, email, phone, address, company, role, avatar, bio, isAdmin) {
    this.name = name;
    this.age = age;
    this.email = email;
    this.phone = phone;
    this.address = address;
    this.company = company;
    this.role = role;
    this.avatar = avatar;
    this.bio = bio;
    this.isAdmin = isAdmin;
  }
}

// Какой параметр что означает? Легко перепутать!
const user = new User('Иван', 30, 'ivan@mail.ru', null, null, 'Google', 'dev', null, null, false);
```

### Проблемы такого подхода:

1. **Нечитаемость** — неясно, что означает каждый параметр
2. **Хрупкость** — порядок аргументов легко перепутать
3. **Негибкость** — много `null` для необязательных параметров
4. **Сложное создание** — вся инициализация в одном месте

---

## Решение

### Базовый пример

```javascript
class UserBuilder {
  constructor(name) {
    this.user = { name };
  }

  setAge(age) {
    this.user.age = age;
    return this; // для цепочки вызовов
  }

  setEmail(email) {
    this.user.email = email;
    return this;
  }

  setPhone(phone) {
    this.user.phone = phone;
    return this;
  }

  setAddress(address) {
    this.user.address = address;
    return this;
  }

  setCompany(company) {
    this.user.company = company;
    return this;
  }

  setRole(role) {
    this.user.role = role;
    return this;
  }

  setAvatar(avatar) {
    this.user.avatar = avatar;
    return this;
  }

  setAdmin(isAdmin) {
    this.user.isAdmin = isAdmin;
    return this;
  }

  build() {
    return { ...this.user };
  }
}

// ✅ Чистый и понятный код
const user = new UserBuilder('Иван')
  .setAge(30)
  .setEmail('ivan@mail.ru')
  .setCompany('Google')
  .setRole('developer')
  .build();

console.log(user);
// { name: 'Иван', age: 30, email: 'ivan@mail.ru', company: 'Google', role: 'developer' }
```

---

## Практические примеры

### Пример 1: HTML-билдер

```javascript
class HTMLBuilder {
  constructor() {
    this.elements = [];
  }

  addHeading(text, level = 1) {
    this.elements.push(`<h${level}>${text}</h${level}>`);
    return this;
  }

  addParagraph(text) {
    this.elements.push(`<p>${text}</p>`);
    return this;
  }

  addList(items) {
    const listItems = items.map(item => `  <li>${item}</li>`).join('\n');
    this.elements.push(`<ul>\n${listItems}\n</ul>`);
    return this;
  }

  addImage(src, alt = '') {
    this.elements.push(`<img src="${src}" alt="${alt}" />`);
    return this;
  }

  addLink(text, href) {
    this.elements.push(`<a href="${href}">${text}</a>`);
    return this;
  }

  addDivider() {
    this.elements.push('<hr />');
    return this;
  }

  build() {
    return this.elements.join('\n');
  }
}

// Использование
const html = new HTMLBuilder()
  .addHeading('Привет, мир!')
  .addParagraph('Это пример использования Builder паттерна.')
  .addList(['JavaScript', 'TypeScript', 'Python'])
  .addDivider()
  .addLink('GitHub', 'https://github.com')
  .build();

console.log(html);
```

### Пример 2: Query Builder

```javascript
class QueryBuilder {
  constructor() {
    this.query = {
      select: '*',
      from: '',
      where: [],
      orderBy: '',
      limit: null,
      offset: null,
    };
  }

  select(...fields) {
    this.query.select = fields.join(', ');
    return this;
  }

  from(table) {
    this.query.from = table;
    return this;
  }

  where(condition) {
    this.query.where.push(condition);
    return this;
  }

  orderBy(field, direction = 'ASC') {
    this.query.orderBy = `${field} ${direction}`;
    return this;
  }

  limit(count) {
    this.query.limit = count;
    return this;
  }

  offset(count) {
    this.query.offset = count;
    return this;
  }

  build() {
    let sql = `SELECT ${this.query.select} FROM ${this.query.from}`;

    if (this.query.where.length > 0) {
      sql += ` WHERE ${this.query.where.join(' AND ')}`;
    }

    if (this.query.orderBy) {
      sql += ` ORDER BY ${this.query.orderBy}`;
    }

    if (this.query.limit !== null) {
      sql += ` LIMIT ${this.query.limit}`;
    }

    if (this.query.offset !== null) {
      sql += ` OFFSET ${this.query.offset}`;
    }

    return sql;
  }
}

// Использование
const query = new QueryBuilder()
  .select('id', 'name', 'email')
  .from('users')
  .where('age > 18')
  .where('status = "active"')
  .orderBy('name', 'ASC')
  .limit(10)
  .offset(20)
  .build();

console.log(query);
// SELECT id, name, email FROM users WHERE age > 18 AND status = "active" ORDER BY name ASC LIMIT 10 OFFSET 20
```

### Пример 3: Конфигурация приложения

```javascript
class AppConfigBuilder {
  constructor() {
    this.config = {
      port: 3000,
      host: 'localhost',
      env: 'development',
      cors: false,
      logging: false,
      database: null,
      cache: null,
    };
  }

  setPort(port) {
    this.config.port = port;
    return this;
  }

  setHost(host) {
    this.config.host = host;
    return this;
  }

  setEnvironment(env) {
    this.config.env = env;
    return this;
  }

  enableCors(origins = ['*']) {
    this.config.cors = { origins };
    return this;
  }

  enableLogging(level = 'info') {
    this.config.logging = { level };
    return this;
  }

  setDatabase(type, connectionString) {
    this.config.database = { type, connectionString };
    return this;
  }

  enableCache(ttl = 3600) {
    this.config.cache = { ttl };
    return this;
  }

  build() {
    if (!this.config.database) {
      throw new Error('Database configuration is required');
    }
    return Object.freeze({ ...this.config });
  }
}

// Использование
const devConfig = new AppConfigBuilder()
  .setPort(3000)
  .setEnvironment('development')
  .enableCors()
  .enableLogging('debug')
  .setDatabase('postgres', 'postgresql://localhost/mydb')
  .build();

const prodConfig = new AppConfigBuilder()
  .setPort(8080)
  .setHost('0.0.0.0')
  .setEnvironment('production')
  .enableCors(['https://myapp.com'])
  .enableLogging('error')
  .setDatabase('postgres', 'postgresql://prod-server/mydb')
  .enableCache(7200)
  .build();

console.log(devConfig);
console.log(prodConfig);
```

### Пример 4: Тестовые данные (Test Data Builder)

```javascript
class TestUserBuilder {
  constructor() {
    // Значения по умолчанию для тестов
    this.user = {
      id: Math.floor(Math.random() * 10000),
      name: 'Test User',
      email: 'test@example.com',
      role: 'user',
      isActive: true,
      createdAt: new Date(),
    };
  }

  withName(name) {
    this.user.name = name;
    return this;
  }

  withEmail(email) {
    this.user.email = email;
    return this;
  }

  asAdmin() {
    this.user.role = 'admin';
    return this;
  }

  inactive() {
    this.user.isActive = false;
    return this;
  }

  build() {
    return { ...this.user };
  }
}

// В тестах
const regularUser = new TestUserBuilder().build();
const admin = new TestUserBuilder().withName('Admin').asAdmin().build();
const inactiveUser = new TestUserBuilder().inactive().withEmail('old@mail.com').build();
```

---

## Builder vs Конструктор

```javascript
// ❌ Конструктор — когда много параметров
const config = new ServerConfig('localhost', 8080, true, false, 'info', 30, null, true);

// ✅ Builder — понятно и гибко
const config = new ServerConfigBuilder()
  .setHost('localhost')
  .setPort(8080)
  .enableCors()
  .enableLogging('info')
  .setTimeout(30)
  .build();
```

| Подход | Когда использовать |
|--------|-------------------|
| **Конструктор** | 1-3 обязательных параметра |
| **Объект опций** | 3-5 параметров, большинство необязательны |
| **Builder** | 5+ параметров, сложная логика создания, пошаговая конфигурация |

---

## Director (Директор)

Директор определяет порядок шагов строительства для типичных конфигураций:

```javascript
class PizzaBuilder {
  constructor() {
    this.pizza = { toppings: [] };
  }

  setSize(size) { this.pizza.size = size; return this; }
  setDough(dough) { this.pizza.dough = dough; return this; }
  setSauce(sauce) { this.pizza.sauce = sauce; return this; }
  addTopping(topping) { this.pizza.toppings.push(topping); return this; }
  build() { return { ...this.pizza }; }
}

// Director — знает рецепты
class PizzaDirector {
  static makeMargherita(builder) {
    return builder
      .setSize('medium')
      .setDough('thin')
      .setSauce('tomato')
      .addTopping('mozzarella')
      .addTopping('basil')
      .build();
  }

  static makePepperoni(builder) {
    return builder
      .setSize('large')
      .setDough('thick')
      .setSauce('tomato')
      .addTopping('mozzarella')
      .addTopping('pepperoni')
      .build();
  }
}

const margherita = PizzaDirector.makeMargherita(new PizzaBuilder());
const pepperoni = PizzaDirector.makePepperoni(new PizzaBuilder());
```

---

## Примеры в реальной жизни

| Библиотека / Инструмент | Применение |
|--------------------------|------------|
| **jQuery** | `$('div').addClass('active').css('color', 'red').show()` — цепочка вызовов |
| **Knex.js** | `knex('users').select('*').where('age', '>', 18).limit(10)` |
| **Sequelize** | Query builder для ORM |
| **Express** | `app.use().get().post().listen()` — конфигурация сервера |
| **Yup / Zod** | `z.string().min(3).max(50).email()` — валидация |
| **D3.js** | `d3.select().attr().style().on()` — построение визуализаций |

---

## Когда использовать

### Хорошие случаи:

- **Много параметров** — конструктор становится нечитаемым
- **Пошаговое создание** — объект создаётся поэтапно
- **Разные представления** — один процесс строительства, разные результаты
- **Неизменяемые объекты** — builder собирает, затем строит финальный объект
- **Тестирование** — удобно создавать тестовые данные с разными комбинациями

### Когда не нужен:

- **Простой объект** — 1-3 параметра, достаточно конструктора
- **Объект опций** — можно передать `{ key: value }` в конструктор
- **Нет сложной логики** — простое присваивание свойств

---

## Резюме

| Аспект | Описание |
|--------|---------|
| **Цель** | Пошаговое создание сложных объектов |
| **Проблема** | Конструкторы с множеством параметров, нечитаемый код |
| **Решение** | Отдельный объект-строитель с fluent interface |
| **Плюсы** | Читаемость, гибкость, переиспользование, иммутабельность |
| **Минусы** | Дополнительный код, может быть избыточен для простых объектов |
| **Когда** | Много параметров, пошаговая конфигурация, тестовые данные |

---

## Следующие шаги

1. Изучите **[Abstract Factory](/design_patterns/abstract-factory)** — семейства объектов
2. Изучите **[Prototype](/design_patterns/prototype)** — создание через клонирование
3. Вернитесь к **[Factory Method](/design_patterns/factory-method)** для сравнения
