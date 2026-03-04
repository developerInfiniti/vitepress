# Установка и конфигурация Playwright

## Требования

Перед началом убедитесь, что у вас установлены:
- **Node.js** 18+ ([скачать](https://nodejs.org))
- **npm** или **yarn** (идут с Node.js)
- Любой текстовый редактор (VS Code, WebStorm и т.д.)

---

## Способ 1: Новый проект с Create Playwright

### Быстрый старт в пустой папке

```bash
npm create playwright@latest my-playwright-tests
cd my-playwright-tests
```

Это создаст полностью готовый проект с:
- ✅ Установленными зависимостями
- ✅ Примерами тестов
- ✅ Конфигурацией
- ✅ GitHub Actions workflow

---

## Способ 2: Добавление в существующий проект

### Установка пакета

```bash
npm install -D @playwright/test
```

### Инициализация конфигурации

```bash
npx playwright install
```

Это загрузит браузеры (может занять несколько минут в первый раз).

---

## Способ 3: С использованием TypeScript

### Установка TypeScript

```bash
npm install -D typescript ts-node @types/node
```

### Создание tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "lib": ["ESNext", "DOM", "DOM.Iterable"],
    "module": "commonjs",
    "moduleResolution": "node",
    "allowJs": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

---

## Структура проекта

После инициализации вы получите:

```
my-playwright-tests/
├── tests/
│   ├── example.spec.ts
│   └── example.spec.js
├── playwright.config.ts
├── package.json
├── package-lock.json
└── README.md
```

### Директория `tests/`
- Содержит ваши тестовые файлы
- По умолчанию ищет файлы `*.spec.ts` и `*.test.ts`

### `playwright.config.ts`
- Главный файл конфигурации
- Настройки браузеров, таймаутов и т.д.

---

## playwright.config.ts

### Базовая конфигурация

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Максимальное время для одного теста
  timeout: 30 * 1000,

  // Директория с тестами
  testDir: './tests',

  // Включить вывод трассировки при сбое
  trace: 'on-first-retry',

  // Настройки браузеров
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  // Веб-сервер для локальной разработки
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### Важные опции

| Опция | Описание |
|-------|---------|
| `testDir` | Где искать тесты |
| `timeout` | Таймаут для одного теста (мс) |
| `trace` | Записи трассировки для отладки |
| `projects` | Какие браузеры и конфигурации |
| `webServer` | Команда для запуска локального сервера |
| `retries` | Количество повторов при сбое |
| `workers` | Количество параллельных процессов |

---

## Запуск первого теста

### Создание теста

Создайте файл `tests/example.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test('пример теста', async ({ page }) => {
  // Переходим на сайт
  await page.goto('https://example.com');

  // Проверяем заголовок
  await expect(page).toHaveTitle(/Example/);
});
```

### Запуск

```bash
# Запустить все тесты
npm test

# Или с префиксом npx
npx playwright test

# В режиме watch (автоперезагрузка)
npm test -- --watch

# Запустить конкретный файл
npm test example.spec.ts

# Запустить конкретный тест
npm test example.spec.ts -g "пример теста"
```

---

## Использование VS Code

### Установка расширения

1. Откройте VS Code
2. Перейдите в Extensions (Ctrl+Shift+X / Cmd+Shift+X)
3. Поиск: "Playwright Test for VS Code"
4. Нажмите Install

### Возможности

- ✅ Запуск тестов прямо из редактора
- ✅ Отладка с точками останова
- ✅ Подсказки автодополнения
- ✅ Быстрый просмотр результатов

---

## Скрипты в package.json

Добавьте удобные команды:

```json
{
  "scripts": {
    "test": "playwright test",
    "test:headed": "playwright test --headed",
    "test:debug": "playwright test --debug",
    "test:ui": "playwright test --ui",
    "test:chrome": "playwright test --project=chromium",
    "test:report": "playwright show-report"
  }
}
```

---

## Загрузка браузеров

### Первый запуск

При первом `npm test` Playwright автоматически загружает браузеры:
- Chromium (~150MB)
- Firefox (~60MB)
- WebKit (~50MB)

Это может занять несколько минут.

### Явная загрузка

```bash
npx playwright install
```

### Загрузка конкретного браузера

```bash
npx playwright install chromium
npx playwright install firefox
```

---

## Проверка установки

Проверьте, что все правильно установилось:

```bash
npx playwright --version
# Output: Version 1.40.0 (or latest)

npx playwright install --with-deps
# Установит браузеры и системные зависимости
```

---

## Распространенные проблемы

### ❌ "Не найдены браузеры"

```bash
# Решение:
npx playwright install
```

### ❌ "ENOENT: no such file or directory"

Убедитесь, что вы находитесь в директории проекта:
```bash
cd my-playwright-tests
npm test
```

### ❌ "Не удается подключиться к браузеру"

```bash
# Переустановите браузеры:
npx playwright install --with-deps
```

---

## Следующие шаги

После установки:

1. Прочитайте **[Селекторы](/basics_playwright/selectors)** для поиска элементов
2. Изучите **[Действия](/basics_playwright/actions)** для взаимодействия
3. Освойте **[Assertions](/basics_playwright/assertions)** для проверок
4. Смотрите **[Best Practices](/basics_playwright/best-practices)** для качества кода

---

## Полезные команды

```bash
# Открыть UI тестера (очень полезно!)
npm test -- --ui

# Запустить в режиме отладки
npm test -- --debug

# Показать репорт с результатами
npm test -- --reporter=html

# Открыть последний репорт
npm test -- --show-report

# Запустить с видео записью
npm test -- --video=on
```
