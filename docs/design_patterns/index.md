# Паттерны проектирования

Паттерны проектирования — это решения типичных проблем в проектировании ПО. Это не готовый код, а общее описание подхода к решению проблемы.

## 📚 Структура раздела

### Категории паттернов

#### 🏗️ Порождающие паттерны (Creational)
Решают проблемы создания объектов.

1. **[Singleton](/design_patterns/singleton)** — один объект на всё приложение
2. **[Factory Method](/design_patterns/factory-method)** — создание объектов через фабрику
3. **[Abstract Factory](/design_patterns/abstract-factory)** — семейства взаимосвязанных объектов
4. **[Builder](/design_patterns/builder)** — пошаговое создание сложных объектов
5. **[Prototype](/design_patterns/prototype)** — создание копий объектов

#### 🔗 Структурные паттерны (Structural)
Решают проблемы композиции объектов.

6. **[Adapter](/design_patterns/adapter)** — адаптация несовместимых интерфейсов
7. **Bridge** — отделение абстракции от реализации (скоро)
8. **Composite** — древовидные структуры (скоро)
9. **[Decorator](/design_patterns/decorator)** — добавление функциональности без наследования
10. **[Facade](/design_patterns/facade)** — единый интерфейс для подсистемы
11. **Flyweight** — экономия памяти через переиспользование (скоро)
12. **Proxy** — подмена объекта плацебо (скоро)

#### 🎯 Поведенческие паттерны (Behavioral)
Решают проблемы коммуникации между объектами.

13. **[Observer](/design_patterns/observer)** — оповещение о событиях
14. **[Strategy](/design_patterns/strategy)** — выбор алгоритма в runtime
15. **State** — смена поведения в зависимости от состояния (скоро)
16. **Template Method** — скелет алгоритма в базовом классе (скоро)
17. **Visitor** — операции над элементами структуры (скоро)
18. **Iterator** — последовательный доступ к элементам (скоро)
19. **[Command](/design_patterns/command)** — инкапсуляция запроса как объекта
20. **Mediator** — централизованный контроль взаимодействия (скоро)
21. **Memento** — сохранение и восстановление состояния (скоро)
22. **Chain of Responsibility** — передача запроса по цепи (скоро)

#### 🎪 Архитектурные паттерны
Используются на уровне всего приложения.

23. **[MVC](/design_patterns/mvc)** — Model-View-Controller
24. **[MVVM](/design_patterns/mvvm)** — Model-View-ViewModel
25. **[MVP](/design_patterns/mvp)** — Model-View-Presenter

---

## 🎯 Что такое паттерны?

Паттерны проектирования — это не алгоритмы, а подходы к организации кода.

### ✅ Преимущества использования паттернов:

- **Переиспользование** — проверенные решения
- **Коммуникация** — единый язык для разработчиков
- **Масштабируемость** — построение сложных систем
- **Поддерживаемость** — понятный код
- **Гибкость** — легче добавлять функциональность

### ❌ Когда НЕ использовать:

- Простые скрипты без сложной логики
- Изучение основ программирования
- Очень срочные дедлайны (по началу медленнее)

---

## 🚀 Быстрый старт

### Паттерн Singleton в JavaScript

```javascript
// Старый способ (с проблемами)
let instance = null;

function createDatabase() {
  if (instance === null) {
    instance = new Database();
  }
  return instance;
}

// Современный способ (с классом)
class Database {
  static #instance = null;

  static getInstance() {
    if (Database.#instance === null) {
      Database.#instance = new Database();
    }
    return Database.#instance;
  }

  connect() {
    console.log('Connected to database');
  }
}

// Использование
const db1 = Database.getInstance();
const db2 = Database.getInstance();

console.log(db1 === db2); // true - один и тот же объект!
```

---

## 🎓 Как читать раздел

### Для начинающих:

1. Начните с **[Singleton](/design_patterns/singleton)** — самый простой паттерн
2. Затем **[Factory Method](/design_patterns/factory-method)**
3. Потом **[Observer](/design_patterns/observer)** и **[Strategy](/design_patterns/strategy)**
4. Постепенно изучайте остальные

### Для опытных:

Можете прыгать по интересующим вас паттернам. Рекомендуем чередовать порождающие, структурные и поведенческие.

---

## 💡 Когда какой паттерн использовать?

### Нужен контроль над созданием объектов?
→ **Factory, Builder, Singleton**

### Нужна гибкость в выборе алгоритма?
→ **Strategy, State, Template Method**

### Нужно оповещать об событиях?
→ **Observer, Mediator**

### Нужна древовидная структура?
→ **Composite, Visitor**

### Нужна оптимизация памяти?
→ **Flyweight, Proxy**

---

## 📊 Сравнительная таблица

| Паттерн | Назначение | Сложность | Когда использовать |
|---------|-----------|----------|--------------------|
| Singleton | Один объект глобально | ⭐ | Логирование, конфиг, БД |
| Factory | Создание объектов | ⭐⭐ | Много типов объектов |
| Observer | Оповещение о событиях | ⭐⭐ | UI события, подписки |
| Strategy | Выбор алгоритма | ⭐⭐ | Разные способы обработки |
| Decorator | Добавление функций | ⭐⭐⭐ | Модульное расширение |
| Proxy | Контроль доступа | ⭐⭐ | Lazy loading, логирование |

---

## 🔗 Связи между паттернами

```
Creational (создание)
├── Singleton → используется с Factory
├── Factory → может использовать Builder
└── Builder → альтернатива Factory

Structural (структура)
├── Decorator ↔ Strategy (оба модифицируют поведение)
├── Proxy ↔ Decorator (похожи, но разные цели)
└── Adapter ↔ Bridge (оба связывают интерфейсы)

Behavioral (поведение)
├── Observer → хорошо с Mediator
├── State ↔ Strategy (выбирают из вариантов)
├── Command → может использовать Memento (отмена)
└── Chain of Responsibility → часто в обработчиках
```

---

## 📚 Дополнительные ресурсы

### Книги
- "Design Patterns: Elements of Reusable Object-Oriented Software" (Gang of Four)
- "Head First Design Patterns"
- "JavaScript Design Patterns" (Addy Osmani)

### Сайты
- [Refactoring Guru](https://refactoring.guru/design-patterns)
- [SourceMaking](https://sourcemaking.com/design_patterns)
- [JavaScript.info](https://javascript.info/)

---

## 🎯 Цели этого раздела

После прочтения вы:
- ✅ Узнаете 20+ проверенных паттернов
- ✅ Поймёте, когда их использовать
- ✅ Напишете чистый и масштабируемый код
- ✅ Сможете общаться с опытными разработчиками
- ✅ Будете готовы к технических интервью

---

**Начните с раздела "[Singleton](/design_patterns/singleton)" для введения в паттерны!**
