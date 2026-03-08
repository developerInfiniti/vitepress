---
description: "Playwright селекторы: CSS, text, role, data-testid — надёжный поиск элементов на странице"
---

# Селекторы и навигация в Playwright

Один из самых важных аспектов тестирования — найти нужный элемент на странице. Playwright предоставляет несколько способов это сделать.

---

## Типы селекторов

### 1. CSS селекторы

Самый универсальный способ:

```javascript
// По ID
await page.click('#submit-button');

// По классу
await page.click('.btn-primary');

// По типу
await page.click('button');

// По атрибуту
await page.click('[name="username"]');
await page.click('[data-testid="login-form"]');

// Комбинирование
await page.click('form.login input[type="email"]');

// Псевдоклассы
await page.click('button:first-of-type');
await page.click('input:nth-child(2)');
```

### 2. XPath селекторы

Мощнее CSS, но более сложные:

```javascript
// По тексту
await page.click('//button[text()="Submit"]');

// По частичному тексту
await page.click('//button[contains(text(), "Sub")]');

// По родителю
await page.click('//div[@class="form"]//button');

// Несколько условий
await page.click('//input[@type="email" and @required]');
```

### 3. Playwright Locator API (Рекомендуется!)

Современный и надежный способ:

```javascript
// По роли (ARIA)
page.getByRole('button', { name: /submit/i });
page.getByRole('textbox', { name: 'Email' });

// По тексту
page.getByText('Login');

// По label
page.getByLabel('Email');

// По placeholder
page.getByPlaceholder('Enter your email');

// По data-testid
page.getByTestId('login-button');
```

---

## Locator API — Лучший выбор

### Почему Locator API?

```javascript
// ❌ Плохо: Хрупкие селекторы
await page.click('div.container > form > div:nth-child(2) > input');

// ✅ Хорошо: Семантичные селекторы
await page.getByLabel('Email').fill('test@example.com');
```

### Основные методы

```javascript
// По ARIA роли (РЕКОМЕНДУЕТСЯ!)
page.getByRole('button')
page.getByRole('textbox')
page.getByRole('link')
page.getByRole('navigation')

// По видимому тексту
page.getByText('Click me')

// По label
page.getByLabel('Password')

// По placeholder
page.getByPlaceholder('john@example.com')

// По data-testid (для тестирования)
page.getByTestId('submit-button')

// По title атрибуту
page.getByTitle('Help')
```

### Цепочка селекторов

```javascript
// Найти форму, потом кнопку в ней
page.locator('form').getByRole('button', { name: 'Submit' });

// Найти список, потом элементы в нем
page.locator('ul').locator('li');
```

---

## Практические примеры

### Пример 1: Форма входа

```html
<form id="login-form">
  <input type="email" placeholder="Email" />
  <input type="password" placeholder="Password" />
  <button type="submit">Login</button>
</form>
```

```javascript
// Заполнить форму
await page.getByPlaceholder('Email').fill('user@example.com');
await page.getByPlaceholder('Password').fill('password123');
await page.getByRole('button', { name: 'Login' }).click();
```

### Пример 2: Таблица

```html
<table>
  <tr>
    <td>John</td>
    <td>Doe</td>
  </tr>
  <tr>
    <td>Jane</td>
    <td>Smith</td>
  </tr>
</table>
```

```javascript
// Найти элемент в таблице
const row = page.locator('table >> text=John');

// Или с фильтром
const jane = page.locator('tr').filter({ has: page.getByText('Jane') });
```

### Пример 3: Динамический контент

```javascript
// Найти элемент содержащий текст
page.getByText('Welcome, Alice!');

// С регулярным выражением
page.getByText(/Welcome, \w+!/);

// С partial match
page.getByText('Welcome');
```

---

## Фильтры и комбинирование

### Filter (Фильтрация)

```javascript
// Найти все кнопки, потом фильтровать по видимости
page.locator('button').filter({ hasText: 'Submit' });

// Фильтр по наличию подэлемента
page.locator('tr').filter({ has: page.getByRole('checkbox') });

// Фильтр по видимости
page.locator('button').filter({ visible: true });
```

### And/Or (Комбинирование)

```javascript
// Несколько условий (AND)
page.locator('form').locator('button');

// Выбрать конкретный
page.locator('button').nth(0);
page.locator('button').first();
page.locator('button').last();
```

---

## Отладка селекторов

### Inspector (Инспектор)

```bash
npx playwright codegen
```

Откроет браузер с инспектором. Кликните на элемент — Playwright покажет подходящий селектор.

### Debug режим

```bash
npx playwright test --debug
```

Откроет инспектор рядом с браузером:
- Пауза выполнения
- Пошаговое выполнение
- Просмотр селекторов

### Проверка селектора

```javascript
// Проверить, существует ли элемент
const isVisible = await page.getByRole('button', { name: 'Submit' }).isVisible();
console.log(isVisible); // true/false

// Получить количество совпадений
const count = await page.locator('button').count();

// Получить текст элемента
const text = await page.locator('button').first().textContent();
```

---

## Практические советы

### ✅ Лучшие практики

```javascript
// ХОРОШО: Использовать getByRole
await page.getByRole('button', { name: /submit/i }).click();

// ХОРОШО: Использовать data-testid для сложных элементов
await page.getByTestId('delete-user-button').click();

// ХОРОШО: Использовать getByLabel для форм
await page.getByLabel('Email').fill('test@example.com');

// ХОРОШО: Цепочки вместо вложения
await page.locator('form').getByRole('button').click();
```

### ❌ Что избегать

```javascript
// ПЛОХО: Магические числа
await page.locator('button').nth(2).click();

// ПЛОХО: Полные пути
await page.click('div > div > form > div > button');

// ПЛОХО: Зависимость от классов стилей
await page.click('.container-xyz > .btn-style-v2');

// ПЛОХО: Индексные селекторы
await page.locator('input')[0].fill('text');
```

---

## Регулярные выражения

```javascript
// Case-insensitive поиск
page.getByRole('button', { name: /submit/i });

// Частичное совпадение
page.getByText(/Welcome/);

// Начало строки
page.getByText(/^Submit/);

// Конец строки
page.getByText(/Submit$/);
```

---

## Навигация между страницами

### Переход по URL

```javascript
// Простой переход
await page.goto('https://example.com');

// С опциями ожидания
await page.goto('https://example.com', { waitUntil: 'networkidle' });

// Опции:
// - 'load': загрузка основного ресурса
// - 'domcontentloaded': DOM готов
// - 'networkidle': нет сетевой активности
```

### Навигация назад/вперед

```javascript
// Назад
await page.goBack();

// Вперед
await page.goForward();

// Перезагрузка
await page.reload();
```

### Ссылки

```javascript
// Клик по ссылке
await page.getByRole('link', { name: 'Home' }).click();

// Ожидание навигации
await Promise.all([
  page.waitForNavigation(),
  page.getByRole('link', { name: 'Next Page' }).click()
]);
```

---

## Ожидание элементов

Playwright имеет встроенное ожидание, но иногда нужно явно:

```javascript
// Ждать, пока элемент появится
await page.locator('button').waitFor();

// Ждать видимости
await page.locator('button').waitFor({ state: 'visible' });

// Ждать скрытия
await page.locator('.spinner').waitFor({ state: 'hidden' });

// Ждать удаления из DOM
await page.locator('.popup').waitFor({ state: 'attached' });

// Ждать элемента с таймаутом
await page.locator('button').waitFor({ timeout: 5000 });
```

---

## Следующие шаги

1. Изучите **[Действия](/basics_playwright/actions)** для взаимодействия с элементами
2. Освойте **[Assertions](/basics_playwright/assertions)** для проверок
3. Применяйте **[Best Practices](/basics_playwright/best-practices)** в своих тестах
