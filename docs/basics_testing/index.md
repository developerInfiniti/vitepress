---
description: "Тестирование веб-приложений: обзор подходов, инструментов и стратегий — руководство для разработчиков"
---

# Testing - Полное руководство по тестированию

Добро пожаловать в полное руководство по тестированию JavaScript/TypeScript приложений!

## 📚 Основные разделы

### Начинающие

1. **[Testing Basics](/basics_testing/testing-basics)** — начните отсюда
   - Что такое тестирование
   - Пирамида тестирования
   - Типы тестов (Unit, Integration, E2E)
   - Jest vs Vitest сравнение
   - Основные концепции

### Фреймворки

2. **[Jest](/basics_testing/jest)** — самый популярный фреймворк
   - Установка и конфигурация
   - Matchers (утверждения)
   - Mock функции
   - Mock модули
   - Coverage

3. **[Vitest](/basics_testing/vitest)** — быстрый фреймворк на Vite
   - Установка
   - Отличия от Jest
   - UI Dashboard
   - Параллельное выполнение
   - Интеграция с IDE

### Техники тестирования

4. **[Unit Testing](/basics_testing/unit-testing)** — модульное тестирование
   - Принципы хорошего unit теста
   - Тестирование функций
   - Тестирование классов
   - Асинхронное тестирование
   - Edge cases
   - Обработка ошибок

5. **[Mocking](/basics_testing/mocking)** — мокирование в тестах
   - jest.fn() - Mock функции
   - jest.mock() - Mock модули
   - jest.spyOn() - Spy (шпионаж)
   - Контроль возвращаемых значений
   - Mock Promise
   - Практические примеры

6. **[Testing React](/basics_testing/testing-react)** — тестирование компонентов
   - React Testing Library
   - Query методы (getBy, queryBy, findBy)
   - Тестирование простых компонентов
   - Тестирование форм
   - Testing hooks
   - Best practices для React

### Продвинутые темы

7. **[Best Practices](/basics_testing/best-practices)** — лучшие практики
   - Структура тестов
   - Читаемые тесты
   - DRY принцип
   - Coverage (покрытие)
   - Performance
   - Common mistakes
   - CI/CD интеграция

## 🎯 Быстрый старт

### Jest

```bash
npm install --save-dev jest @types/jest
npx jest --init
npm test
```

```typescript
// sum.test.ts
test('adds numbers', () => {
  expect(2 + 3).toBe(5);
});
```

### Vitest

```bash
npm install --save-dev vitest
```

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true
  }
});
```

```bash
npm test
```

## 📊 Пирамида тестирования

```
        △
       /|\
      / | \
     /  |  \  E2E Tests (5-10%)
    /   |   \
   /════════╱
  /    │    \
 / Unit Tests\  Integration Tests (30-40%)
/═════════════\
      (60-70%)
```

## 🔥 Основные концепции

### Unit Test (Модульный тест)

```typescript
function add(a, b) {
  return a + b;
}

test('adds two numbers', () => {
  expect(add(2, 3)).toBe(5);
});
```

### Integration Test (Интеграционный тест)

```typescript
test('user can login', async () => {
  const user = await createUser({ email: 'test@test.com' });
  const result = await login(user.email, 'password');
  expect(result.success).toBe(true);
});
```

### E2E Test (End-to-End тест)

```typescript
test('user completes purchase', async () => {
  await page.goto('https://shop.com');
  await page.click('text=Add to Cart');
  // ... много шагов
  expect(await page.textContent('Order Complete')).toBeTruthy();
});
```

## 💡 Типичный workflow

```
1. Написать тест
   ↓
2. Запустить тест (он падает) ❌
   ↓
3. Написать код (минимум для прохождения)
   ↓
4. Запустить тест (он проходит) ✅
   ↓
5. Рефакторить код (тесты все еще проходят) ✅
   ↓
6. Повторить для каждой функции
```

## ✨ Ключевые преимущества тестирования

| Преимущество | Описание |
|-------------|---------|
| 🐛 **Баги** | Находим ошибки до production |
| ♻️ **Рефакторинг** | Безопасно меняем код |
| 📚 **Документация** | Тесты показывают как использовать код |
| 😌 **Уверенность** | Знаем что код работает |
| 🚀 **Развертывание** | Безопасно выкатываем изменения |

## 🚀 Рекомендуемый путь обучения

1. 🟢 Прочитайте [Testing Basics](/basics_testing/testing-basics)
2. 🟡 Выберите фреймворк: [Jest](/basics_testing/jest) или [Vitest](/basics_testing/vitest)
3. 🟠 Изучите [Unit Testing](/basics_testing/unit-testing)
4. 🔴 Разберитесь с [Mocking](/basics_testing/mocking)
5. 🔵 Если React: изучите [Testing React](/basics_testing/testing-react)
6. 🟣 Изучите [Best Practices](/basics_testing/best-practices)

## 📊 Jest vs Vitest сравнение

| Параметр | Jest | Vitest |
|----------|------|--------|
| **Скорость** | ⚠️ Медленнее | ✅ Быстро |
| **Setup** | ✅ Простая | ✅ Простая |
| **TypeScript** | ✅ Поддержка | ✅ Встроена |
| **Vite** | ❌ Нет | ✅ Встроена |
| **Популярность** | ✅ №1 | 📈 Растет |

**Выбирайте:**
- Jest если используете Create React App
- Vitest если используете Vite

## 🛠️ Инструменты и библиотеки

### Фреймворки
- **Jest** — всё в одном
- **Vitest** — быстро на Vite

### Утилиты для React
- **React Testing Library** — тестирование компонентов
- **Enzyme** — старая альтернатива

### E2E тестирование
- **Cypress** — популярный выбор
- **Playwright** — мощный инструмент
- **Selenium** — классический вариант

### Coverage
- **Istanbul** — встроена в Jest
- **V8** — встроена в Vitest

## 📋 Чеклист перед Production

- [ ] Все тесты проходят ✅
- [ ] Coverage выше 80% 📊
- [ ] Нет флаки тестов 🔄
- [ ] Мокирование корректно 🎭
- [ ] Performance нормальная ⚡
- [ ] CI/CD настроен 🚀

## ❓ Частые вопросы

**Q: Насколько много тестов писать?**
A: Примерно 70% unit, 20% integration, 10% E2E

**Q: Jest или Vitest?**
A: Jest для большинства, Vitest для Vite проектов

**Q: Как быстро писать тесты?**
A: Используйте фабрики для данных и помощников

**Q: Покрывать ли все 100%?**
A: Нет, 80-90% достаточно, 100% пусто

## 🤝 Помощь

Все вопросы раскрыты в разделах выше!

---

**Последнее обновление:** 2026-03-04

Удачи в написании тестов! 🎉
