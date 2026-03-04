# Действия и взаимодействие в Playwright

После того как вы нашли элемент, нужно с ним взаимодействовать. Playwright предоставляет много методов для различных действий.

---

## Основные действия

### Click (Клик)

```javascript
// Простой клик
await page.click('button');

// Используя Locator API
await page.getByRole('button', { name: 'Submit' }).click();

// С опциями
await page.locator('button').click({
  button: 'right',  // 'left' | 'right' | 'middle'
  clickCount: 2,    // Двойной клик
  delay: 100,       // Задержка между кликами (мс)
});

// Двойной клик
await page.locator('input').dblclick();

// Клик с Ctrl (для выделения)
await page.locator('item').click({ modifiers: ['Control'] });

// Клик с Ctrl+Shift
await page.locator('item').click({ modifiers: ['Control', 'Shift'] });
```

### Fill (Заполнение формы)

```javascript
// Заполнить поле ввода
await page.locator('input[name="email"]').fill('test@example.com');

// Очистить и заполнить
await page.locator('input').clear();
await page.locator('input').fill('новый текст');

// Или оба вместе
await page.locator('input').fill('новый текст'); // auto-clears
```

### Type (Печать)

```javascript
// Печатать текст символ за символом (медленнее)
await page.locator('input').type('Hello World');

// С задержкой между символами
await page.locator('input').type('Hello World', { delay: 100 });

// Печать специальных символов
await page.keyboard.type('!@#$%');
```

### Различие между fill и type

```javascript
// fill() — быстро заполняет, запускает события input/change
await page.fill('input', 'text');

// type() — печатает символ за символом, может улавливать keydown/keyup
await page.type('input', 'text', { delay: 100 });

// Рекомендуется использовать fill() в большинстве случаев
```

---

## Работа с формами

### Select (Выбор из dropdown)

```javascript
// Выбор по значению
await page.locator('select').selectOption('blue');

// Выбор по label
await page.locator('select').selectOption({ label: 'Blue' });

// Выбор по индексу
await page.locator('select').selectOption('2');

// Выбрать несколько (для multi-select)
await page.locator('select').selectOption(['red', 'blue']);

// Получить выбранное значение
const selected = await page.locator('select').inputValue();
```

### Checkbox и Radio

```javascript
// Отметить checkbox
await page.locator('input[type="checkbox"]').check();

// Отметить конкретный checkbox
await page.locator('input#accept-terms').check();

// Снять отметку
await page.locator('input[type="checkbox"]').uncheck();

// Проверить состояние
const isChecked = await page.locator('input[type="checkbox"]').isChecked();

// Выбрать radio button
await page.locator('input[name="payment"][value="credit-card"]').check();
```

---

## Специальные действия

### Hover (Наведение)

```javascript
// Наведение мыши
await page.locator('button').hover();

// С опциями
await page.locator('button').hover({
  position: { x: 10, y: 10 }, // Позиция в элементе
});
```

### Focus (Фокус)

```javascript
// Установить фокус на элемент
await page.locator('input').focus();

// Убрать фокус (blur)
await page.locator('input').blur();
```

### Скролл

```javascript
// Скроллить страницу
await page.evaluate(() => window.scrollBy(0, 1000));

// Скроллить к элементу
await page.locator('button').scrollIntoViewIfNeeded();

// Скроллить контейнер
await page.locator('.scroll-container').evaluate(el => {
  el.scrollTop = 500;
});
```

### Drag & Drop

```javascript
// Drag and drop
await page.locator('#source').dragTo(page.locator('#target'));

// С опциями
await page.locator('#source').dragTo(page.locator('#target'), {
  sourcePosition: { x: 10, y: 10 },
  targetPosition: { x: 100, y: 100 },
});

// Полный контроль
await page.locator('#source').hover();
await page.mouse.down();
await page.locator('#target').hover();
await page.mouse.up();
```

---

## Работа с клавиатурой

### Нажатие клавиш

```javascript
// Нажать одну клавишу
await page.press('input', 'Enter');
await page.press('input', 'Escape');
await page.press('input', 'ArrowUp');

// Специальные клавиши
await page.keyboard.press('Backspace');
await page.keyboard.press('Delete');
await page.keyboard.press('Tab');
await page.keyboard.press('Shift+Tab');

// Комбинации
await page.keyboard.press('Control+A');
await page.keyboard.press('Meta+C'); // Command на Mac
```

### Полезные клавиши

| Клавиша | Описание |
|---------|---------|
| `Enter` | Отправить форму |
| `Escape` | Закрыть диалог |
| `Tab` | Следующий элемент |
| `ArrowUp/Down` | Навигация в меню |
| `Space` | Активировать button |
| `Delete` | Удалить символ |
| `Backspace` | Удалить символ слева |

---

## Работа с файлами

### Загрузка файла

```javascript
// Простая загрузка
await page.locator('input[type="file"]').setInputFiles('path/to/file.txt');

// Несколько файлов
await page.locator('input[type="file"]').setInputFiles([
  'file1.txt',
  'file2.txt'
]);

// С абсолютным путем
const path = require('path');
await page.locator('input[type="file"]').setInputFiles(
  path.join(__dirname, 'uploads', 'image.png')
);
```

---

## Работа с модальными окнами

### Dialog (Alert, Confirm, Prompt)

```javascript
// Слушать диалог
page.on('dialog', dialog => {
  console.log(dialog.type()); // 'alert', 'beforeunload', 'confirm', 'prompt'
  console.log(dialog.message());
  dialog.accept(); // Нажать OK
  dialog.dismiss(); // Нажать Cancel
});

// Или более практично
await page.on('dialog', dialog => dialog.accept());
await page.click('button'); // Вызывает alert

// Для prompt
await page.on('dialog', dialog => {
  dialog.accept('my answer');
});
```

### Popup Windows

```javascript
// Слушать новые страницы (popup)
const [popup] = await Promise.all([
  page.waitForEvent('popup'),
  page.click('a[target="_blank"]') // Открывает новое окно
]);

// Работать с popup
await popup.waitForLoadState();
console.log(popup.url());
```

---

## Ожидание после действия

### Wait for Navigation

```javascript
// Ждать навигации после клика
await Promise.all([
  page.waitForNavigation(),
  page.click('a')
]);

// Или c timeout
await page.click('a');
await page.waitForNavigation({ timeout: 5000 });
```

### Wait for Load State

```javascript
// Ждать полной загрузки
await page.goto('https://example.com');
await page.waitForLoadState('networkidle');

// Опции:
// - 'load': основной документ загружен
// - 'domcontentloaded': DOM готов
// - 'networkidle': нет сетевой активности
```

### Wait for Selector

```javascript
// Ждать элемента (устарело, используйте waitFor)
await page.waitForSelector('button#save');

// Новый способ
await page.locator('button#save').waitFor();
```

---

## Практические примеры

### Пример 1: Заполнение формы

```javascript
test('заполнить и отправить форму', async ({ page }) => {
  await page.goto('https://example.com/form');

  // Заполнить поля
  await page.getByLabel('Name').fill('John Doe');
  await page.getByLabel('Email').fill('john@example.com');
  await page.getByLabel('Message').fill('Hello world');

  // Выбрать опцию
  await page.locator('select[name="country"]').selectOption('US');

  // Отметить checkbox
  await page.getByLabel('I agree to terms').check();

  // Отправить форму
  await page.getByRole('button', { name: 'Send' }).click();

  // Проверить результат
  await expect(page.getByText('Success!')).toBeVisible();
});
```

### Пример 2: Сложное взаимодействие

```javascript
test('интерактивное тестирование', async ({ page }) => {
  await page.goto('https://example.com');

  // Наведение открывает меню
  await page.getByRole('button', { name: 'Menu' }).hover();
  await page.getByRole('menuitem', { name: 'Settings' }).click();

  // Скролл к элементу
  await page.locator('input[name="advanced"]').scrollIntoViewIfNeeded();
  await page.locator('input[name="advanced"]').check();

  // Drag and drop
  await page.locator('.source').dragTo(page.locator('.target'));

  // Клавиатура
  await page.press('input', 'Control+A');
  await page.press('input', 'Delete');
});
```

### Пример 3: Работа с файлами

```javascript
test('загрузить файл', async ({ page }) => {
  await page.goto('https://example.com/upload');

  // Загрузить файл
  await page.locator('input[type="file"]').setInputFiles('test.pdf');

  // Дождаться обработки
  await page.getByRole('button', { name: 'Upload' }).click();

  // Проверить успех
  await expect(page.getByText('File uploaded')).toBeVisible();
});
```

---

## Автоматическое ожидание в Playwright

Важное преимущество Playwright — встроенное автоматическое ожидание:

```javascript
// Автоматически ждет:
// 1. Элемент появляется в DOM
// 2. Элемент видим на экране
// 3. Элемент не покрыт другими элементами
// 4. Элемент готов к взаимодействию (не disabled)
await page.click('button');

// Это работает без явного .waitFor()!
```

---

## Производительность и best practices

### ✅ Лучшие практики

```javascript
// ХОРОШО: Использовать Locator API
await page.getByLabel('Email').fill('test@example.com');

// ХОРОШО: Цепочка методов
await page.getByRole('form').locator('input').first().fill('text');

// ХОРОШО: Комбинировать действия
await page.getByLabel('Remember me').check();
```

### ❌ Что избегать

```javascript
// ПЛОХО: Явные ожидания (обычно не нужны)
await page.waitForSelector('button');
await page.click('button');

// ПЛОХО: setTimeout (очень плохо!)
await page.click('button');
await new Promise(r => setTimeout(r, 1000));

// ПЛОХО: Несколько действий без check
await page.fill('input', 'text');
await page.click('button');
// Лучше проверить, что первое действие выполнилось
```

---

## Следующие шаги

1. Изучите **[Assertions](/basics_playwright/assertions)** для проверок результатов
2. Применяйте **[Best Practices](/basics_playwright/best-practices)** для качества кода
3. Настройте **[CI/CD](/basics_playwright/ci-cd)** для автоматизации
