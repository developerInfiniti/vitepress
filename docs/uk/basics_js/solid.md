---
title: Принципы SOLID
description: Основные принципы объектно-ориентированного проектирования, помогающие создавать гибкие и поддерживаемые программные системы
---

# Руководство по принципам SOLID

SOLID - это аббревиатура, объединяющая пять основных принципов объектно-ориентированного программирования и проектирования. Эти принципы помогают разработчикам создавать более понятный, гибкий и легко поддерживаемый код.

## 1. Single Responsibility Principle (Принцип единственной ответственности)

Класс должен иметь только одну причину для изменения, то есть выполнять только одну задачу.

```typescript
// Плохой пример
class UserManager {
    saveUser(user) {
        // Логика сохранения пользователя
    }

    sendEmailToUser(user) {
        // Отправка email
    }
}

// Хороший пример
class UserRepository {
    saveUser(user) {
        // Логика сохранения пользователя
    }
}

class EmailService {
    sendEmail(user) {
        // Отправка email
    }
}
```

## 2. Open/Closed Principle (Принцип открытости/закрытости)

Классы должны быть открыты для расширения, но закрыты для модификации.

```typescript
// Базовый класс
abstract class Shape {
    abstract calculateArea(): number;
}

// Расширение без изменения существующего кода
class Rectangle extends Shape {
    constructor(private width: number, private height: number) {
        super();
    }

    calculateArea(): number {
        return this.width * this.height;
    }
}

class Circle extends Shape {
    constructor(private radius: number) {
        super();
    }

    calculateArea(): number {
        return Math.PI * this.radius ** 2;
    }
}
```

## 3. Liskov Substitution Principle (Принцип подстановки Лисков)

Объекты базового класса должны быть заменяемы объектами производных классов без нарушения работы программы.

```typescript
class Bird {
    fly() {
        console.log("Птица летит");
    }
}

// Правильная реализация
class Sparrow extends Bird {
    fly() {
        console.log("Воробей летит");
    }
}

// Нарушение принципа
class Penguin extends Bird {
    fly() {
        throw new Error("Пингвины не летают!");
    }
}
```

## 4. Interface Segregation Principle (Принцип разделения интерфейсов)

Клиенты не должны зависеть от интерфейсов, которые они не используют.

```typescript
// Плохой пример: монолитный интерфейс
interface Worker {
    work(): void;
    eat(): void;
    sleep(): void;
}

// Хороший пример: разделенные интерфейсы
interface Workable {
    work(): void;
}

interface Eatable {
    eat(): void;
}

interface Sleepable {
    sleep(): void;
}

class Robot implements Workable {
    work() {
        // Работа робота
    }
}
```

## 5. Dependency Inversion Principle (Принцип инверсии зависимостей)

Модули верхнего уровня не должны зависеть от модулей нижнего уровня. Оба типа модулей должны зависеть от абстракций.

```typescript
// Абстракция
interface NotificationService {
    send(message: string): void;
}

// Конкретные реализации
class EmailNotification implements NotificationService {
    send(message: string) {
        console.log(`Отправка email: ${message}`);
    }
}

class SMSNotification implements NotificationService {
    send(message: string) {
        console.log(`Отправка SMS: ${message}`);
    }
}

// Зависимость от абстракции
class NotificationManager {
    constructor(private notificationService: NotificationService) {}

    sendNotification(message: string) {
        this.notificationService.send(message);
    }
}
```

## Заключение

Принципы SOLID помогают:
- Создавать более понятный и чистый код
- Упрощать поддержку и расширение программных систем
- Уменьшать сложность программного обеспечения
- Повышать гибкость архитектуры

Применяя эти принципы, разработчики могут создавать более качественное и масштабируемое программное обеспечение.

---
Руководство поможет вам лучше понять и применять принципы SOLID в вашей разработке!