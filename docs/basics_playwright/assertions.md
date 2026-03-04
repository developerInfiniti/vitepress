# Assertions в Playwright

Assertions (утверждения/проверки) — ключевая часть любого теста. Playwright предоставляет мощный набор встроенных matchers.

---

## Встроенные Matchers

### expect(page)

```javascript
import { expect, test } from '@playwright/test';

test('проверки страницы', async ({ page }) => {
  // Проверить URL
  expect(page).toHaveURL('https://example.com');
  expect(page.url()).toContain('example.com');

  // Проверить заголовок
  expect(page).toHaveTitle('Example Domain');
  expect(page).toHaveTitle(/Example/);

  // Проверить количество страниц (в контексте)
  expect(context.pages()).toHaveLength(1);
});
```

### expect(locator) — Видимость и состояние

```javascript
// Видимость
expect(locator('button')).toBeVisible();
expect(locator('button')).toBeHidden();

// Disabled/Enabled
expect(locator('button')).toBeEnabled();
expect(locator('button')).toBeDisabled();

// Checked/Unchecked
expect(locator('input[type="checkbox"]')).toBeChecked();
expect(locator('input[type="checkbox"]')).not.toBeChecked();

// Editable
expect(locator('input')).toBeEditable();
expect(locator('input[disabled]')).not.toBeEditable();

// Empty
expect(locator('input')).toHaveValue('');
```

### expect(locator) — Текст и содержимое

```javascript
// Точный текст
expect(locator('button')).toHaveText('Click me');

// Частичный текст (substring)
expect(locator('button')).toContainText('Click');

// С регулярным выражением
expect(locator('button')).toHaveText(/Click (me|here)/);

// Все элементы содержат текст
expect(locator('button')).toContainText(['Save', 'Cancel', 'Delete']);

// Получить текст
const text = await locator('button').textContent();
expect(text).toBe('Click me');
```

### expect(locator) — Значения и атрибуты

```javascript
// Значение input
expect(locator('input')).toHaveValue('john@example.com');

// Атрибут
expect(locator('img')).toHaveAttribute('alt', 'Description');

// CSS класс
expect(locator('button')).toHaveClass('btn btn-primary');
expect(locator('button')).toHaveClass(/primary/);

// CSS стиль
expect(locator('div')).toHaveCSS('color', 'rgb(255, 0, 0)');

// Количество
expect(locator('button')).toHaveCount(3);
```

---

## Async Matchers (Рекомендуется!)

Async matchers автоматически ждут условия и имеют встроенные таймауты:

```javascript
// ✅ ХОРОШО: Async matcher (автоматически ждет)
await expect(locator('button')).toBeVisible();
await expect(page).toHaveURL('https://example.com');

// ❌ ПЛОХО: Синхронная проверка (может быть нестабильна)
expect(await locator('button').isVisible()).toBe(true);
```

### Async matcher с ожиданием

```javascript
// Ждет 5 секунд по умолчанию
await expect(locator('button')).toBeVisible();

// Кастомный таймаут
await expect(locator('button')).toBeVisible({ timeout: 10000 });

// Ждать исчезновения
await expect(locator('.spinner')).toBeHidden({ timeout: 5000 });
```

---

## Soft Assertions

Soft assertions не останавливают тест при ошибке, а собирают все ошибки:

```javascript
test('soft assertions', async ({ page }) => {
  // Обычный assert (останавливает тест)
  expect(page.url()).toBe('https://example.com');

  // Soft assert (продолжит тест)
  expect.soft(page.url()).toBe('https://wrong.com'); // ошибка, но тест продолжает

  // Обычный assert в конце
  expect(await locator('h1').textContent()).toBe('Welcome');

  // После завершения теста — все ошибки выводятся
});
```

### Когда использовать soft assertions?

```javascript
test('проверить несколько элементов', async ({ page }) => {
  // Вместо:
  expect(element1).toBeVisible(); // Если ошибка — тест停止
  expect(element2).toBeVisible();
  expect(element3).toBeVisible();

  // Использовать soft assertions:
  expect.soft(element1).toBeVisible();
  expect.soft(element2).toBeVisible();
  expect.soft(element3).toBeVisible();
  // Все ошибки собираются и выводятся в конце
});
```

---

## Полезные Matchers

### Строки

```javascript
expect(text).toBe('exact match');
expect(text).toContain('substring');
expect(text).toMatch(/regex/);
expect(text).toHaveLength(5);
```

### Числа

```javascript
expect(count).toBe(5);
expect(count).toBeGreaterThan(3);
expect(count).toBeLessThan(10);
expect(count).toBeGreaterThanOrEqual(5);
```

### Массивы и объекты

```javascript
expect(array).toEqual([1, 2, 3]);
expect(array).toContain(2);
expect(array).toHaveLength(3);
expect(object).toEqual({ name: 'John' });
expect(object).toHaveProperty('name', 'John');
```

### Negation (Отрицание)

```javascript
expect(value).not.toBe('');
expect(element).not.toBeVisible();
expect(text).not.toContain('error');
```

---

## Пример: Комплексная проверка

```javascript
test('проверить форму входа', async ({ page }) => {
  await page.goto('https://example.com/login');

  // Проверить элементы формы
  await expect(page.getByLabel('Email')).toBeVisible();
  await expect(page.getByLabel('Password')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Login' })).toBeEnabled();

  // Заполнить форму
  await page.getByLabel('Email').fill('test@example.com');
  await page.getByLabel('Password').fill('password123');

  // Проверить значения
  await expect(page.getByLabel('Email')).toHaveValue('test@example.com');
  await expect(page.getByLabel('Password')).toHaveValue('password123');

  // Отправить форму
  await page.getByRole('button', { name: 'Login' }).click();

  // Проверить успех
  await expect(page).toHaveURL('https://example.com/dashboard');
  await expect(page.getByText('Welcome, John!')).toBeVisible();
});
```

---

## Кастомные Matchers

Для более специфичных проверок:

```javascript
test('использовать кастомный matcher', async ({ page }) => {
  // Создать кастомный фильтр
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const email = await page.locator('input[type="email"]').inputValue();
  expect(isValidEmail(email)).toBeTruthy();
});
```

---

## Практические примеры

### Пример 1: Проверить таблицу

```javascript
test('таблица содержит нужные данные', async ({ page }) => {
  const rows = page.locator('table tr');

  // Проверить количество строк
  await expect(rows).toHaveCount(4);

  // Проверить содержимое конкретной строки
  await expect(rows.locator('td').nth(0)).toContainText('John');
  await expect(rows.locator('td').nth(1)).toContainText('Doe');

  // Проверить весь текст строки
  const rowText = await rows.first().textContent();
  expect(rowText).toContain('John Doe');
});
```

### Пример 2: Проверить список

```javascript
test('проверить список товаров', async ({ page }) => {
  const items = page.locator('ul li');

  // Количество элементов
  await expect(items).toHaveCount(5);

  // Каждый элемент видим
  for (let i = 0; i < 5; i++) {
    await expect(items.nth(i)).toBeVisible();
  }

  // Содержит нужные элементы
  await expect(items).toContainText(['Product 1', 'Product 2']);
});
```

### Пример 3: Асинхронные проверки

```javascript
test('проверить загрузку данных', async ({ page }) => {
  await page.goto('https://api-example.com');

  // Спинер появляется
  await expect(page.locator('.spinner')).toBeVisible();

  // Спинер исчезает (автоматически ждет до 30 секунд)
  await expect(page.locator('.spinner')).toBeHidden();

  // Данные загружены
  await expect(page.locator('[data-testid="user-list"]')).toContainText('John');
});
```

---

## Таймауты и опции

```javascript
// Кастомный таймаут для теста
test('долгий процесс', async ({ page }) => {
  // 60 секунд для этого теста
}, { timeout: 60000 });

// Кастомный таймаут для assertion
await expect(page.locator('button')).toBeVisible({
  timeout: 10000 // 10 секунд
});
```

---

## Лучшие практики

### ✅ Что нужно делать

```javascript
// ХОРОШО: Использовать async matchers
await expect(button).toBeVisible();
await expect(button).toHaveText('Submit');

// ХОРОШО: Проверять нужные свойства
await expect(input).toHaveValue('test@example.com');

// ХОРОШО: Использовать soft assertions для множественных проверок
expect.soft(a).toBeVisible();
expect.soft(b).toBeVisible();
expect.soft(c).toBeVisible();
```

### ❌ Что избегать

```javascript
// ПЛОХО: Синхронные проверки
expect(await button.isVisible()).toBe(true);

// ПЛОХО: Неточные проверки
expect(await button.textContent()).toContain('sub');

// ПЛОХО: Множество обычных ассертов подряд
expect(a).toBeVisible();
expect(b).toBeVisible(); // Если ошибка — остальные не выполнятся
```

---

## Отладка failures

Когда assertion падает:

```javascript
test('failed assertion', async ({ page }) => {
  await expect(page.locator('button')).toHaveText('Submit');
  // Если падает, выводит:
  // - Ожидаемое значение
  // - Фактическое значение
  // - Селектор элемента
  // - Скриншот
});
```

Для отладки:
1. Запустить с `--debug`
2. Посмотреть скриншот в отчете
3. Использовать `test.only()` для одного теста

---

## Следующие шаги

1. Примените знания в **[Best Practices](/basics_playwright/best-practices)**
2. Настройте **[CI/CD](/basics_playwright/ci-cd)** для автоматизации
3. Вернитесь к **[Основам](/basics_playwright/basics)** для полного понимания
