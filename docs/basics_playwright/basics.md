# Основы Playwright

## Что такое Playwright?

Playwright — это мощный фреймворк для автоматизации тестирования и скрейпинга веб-приложений, разработанный Microsoft. Он позволяет программно управлять браузерами и выполнять тесты end-to-end (E2E).

### Ключевые особенности

| Особенность | Описание |
|------------|----------|
| **Multi-browser** | Поддерживает Chromium, Firefox, WebKit |
| **Cross-platform** | Работает на Windows, macOS, Linux |
| **Multi-language** | JavaScript, Python, C#, Java |
| **Быстро** | Оптимизирован для скорости |
| **Надежно** | Встроенное ожидание (auto-waiting) |
| **Разработчик-friendly** | Отличные инструменты для отладки |

---

## Преимущества перед конкурентами

### vs Selenium
```
✅ Playwright: Встроенное ожидание элементов
❌ Selenium: Требует явных ожиданий

✅ Playwright: Поддержка всех браузеров из коробки
❌ Selenium: Требует дополнительные драйверы

✅ Playwright: Быстрее
❌ Selenium: Медленнее
```

### vs Cypress
```
✅ Playwright: Поддерживает несколько браузеров
❌ Cypress: Только Chromium, Firefox, Edge

✅ Playwright: Работает не только с браузерами
❌ Cypress: Фокус только на браузерном тестировании

✅ Playwright: Multi-language (JS, Python, C#, Java)
❌ Cypress: Только JavaScript
```

### vs Puppeteer
```
✅ Playwright: Встроенная поддержка тестирования
❌ Puppeteer: Нужны дополнительные библиотеки

✅ Playwright: Встроенные assertions
❌ Puppeteer: Требует Jest или другой фреймворк

✅ Playwright: Лучше синхронизация
❌ Puppeteer: Более сложная работа с ожиданиями
```

---

## Поддерживаемые браузеры

Playwright может управлять и тестировать три основных движка браузеров:

### 🔵 Chromium
- Основа Chrome, Edge, Opera
- Лучше всего поддерживается
- Рекомендуется для основных тестов

### 🦊 Firefox
- Независимый фреймворк
- Важен для кроссбраузерного тестирования
- Хороший выбор для проверки совместимости

### 🧩 WebKit
- Основа Safari
- Необходим для тестирования на Apple устройствах
- Помогает найти специфичные баги в Safari

---

## Первый тест

### Установка
```bash
npm init playwright@latest
# или для существующего проекта:
npm install -D @playwright/test
```

### Простой пример

```javascript
import { test, expect } from '@playwright/test';

test('открывает Google и ищет Playwright', async ({ page }) => {
  // Переходим на страницу
  await page.goto('https://google.com');

  // Находим поле поиска и заполняем его
  await page.fill('input[name="q"]', 'Playwright');

  // Нажимаем Enter
  await page.press('input[name="q"]', 'Enter');

  // Ждем результатов и проверяем
  await page.waitForLoadState('networkidle');
  expect(page.url()).toContain('q=Playwright');
});
```

### Запуск теста

```bash
npx playwright test
```

---

## Основные концепции

### Browser (Браузер)
```javascript
const browser = await chromium.launch();
const context = await browser.newContext();
const page = await context.newPage();
```

### Context (Контекст)
- Изолированная среда браузера
- Отдельные cookies и localStorage
- Полезно для параллельного тестирования

### Page (Страница)
- Представляет открытую вкладку/окно
- Основное место для взаимодействия с контентом

### Locator (Локатор)
```javascript
const button = page.locator('button#submit');
await button.click();
```

---

## Когда использовать Playwright

### ✅ Идеально подходит для:
- E2E тестирование веб-приложений
- Тестирование пользовательских сценариев
- Кроссбраузерное тестирование
- Регрессионное тестирование
- Автоматизация повторяющихся задач

### ❌ Не подходит для:
- Unit тестирование (используйте Jest/Vitest)
- Тестирование мобильных приложений (используйте Appium)
- Тестирование desktop приложений (используйте Playwright Electron)

---

## Встроенное ожидание (Auto-waiting)

Одна из главных фишек Playwright — встроенное ожидание элементов:

```javascript
// Playwright автоматически ждет:
// 1. Элемент в DOM
// 2. Элемент видим
// 3. Элемент не покрыт другими элементами
// 4. Элемент активен/готов к взаимодействию
await page.click('button#submit');
```

Это избавляет от явных ожиданий и делает тесты более надежными.

---

## Следующие шаги

1. Прочитайте раздел **[Установка](/basics_playwright/installation)** для настройки проекта
2. Изучите **[Селекторы](/basics_playwright/selectors)** для поиска элементов
3. Освойте **[Assertions](/basics_playwright/assertions)** для проверок
4. Применяйте **[Best Practices](/basics_playwright/best-practices)** в своих тестах
