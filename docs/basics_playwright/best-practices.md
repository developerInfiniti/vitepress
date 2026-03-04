# Best Practices в Playwright

Как писать надежные, масштабируемые и легко поддерживаемые E2E тесты.

---

## 1. Page Object Model (POM)

POM — паттерн для организации тестов. Каждая страница имеет объект, который инкапсулирует её элементы и действия.

### Без POM (❌ Плохо)

```javascript
test('login workflow', async ({ page }) => {
  // Селекторы разбросаны везде
  await page.fill('input[type="email"]', 'user@example.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button:has-text("Login")');

  // Очень хрупко! Если измениться селектор — тесты сломаются
});
```

### С POM (✅ Хорошо)

```javascript
// pages/login.page.ts
export class LoginPage {
  constructor(private page) {}

  // Selectors
  get emailInput() {
    return this.page.getByLabel('Email');
  }

  get passwordInput() {
    return this.page.getByLabel('Password');
  }

  get loginButton() {
    return this.page.getByRole('button', { name: 'Login' });
  }

  // Actions
  async goto() {
    await this.page.goto('https://example.com/login');
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}

// test.spec.ts
test('login workflow', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('user@example.com', 'password123');

  // Чистый тест!
});
```

### Преимущества POM

| Преимущество | Описание |
|------------|----------|
| **Переиспользование** | Одна страница в нескольких тестах |
| **Легкость изменений** | Изменить селектор в одном месте |
| **Читаемость** | Тесты читаются как бизнес-логика |
| **Масштабируемость** | Большие тесты остаются управляемыми |

---

## 2. Структура проекта

```
my-tests/
├── tests/
│   ├── fixtures/
│   │   └── auth.fixture.ts        # Fixtures для логина
│   ├── pages/
│   │   ├── login.page.ts
│   │   ├── dashboard.page.ts
│   │   └── settings.page.ts
│   ├── specs/
│   │   ├── auth.spec.ts           # Тесты аутентификации
│   │   ├── dashboard.spec.ts      # Тесты дашборда
│   │   └── settings.spec.ts       # Тесты настроек
│   └── helpers/
│       ├── db.helper.ts           # Помощники БД
│       └── api.helper.ts          # API помощники
├── playwright.config.ts
└── package.json
```

---

## 3. Fixtures (Фиксчеры)

Fixtures — переиспользуемые наборы данных для тестов.

```typescript
// fixtures/auth.fixture.ts
import { test as baseTest } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

export const test = baseTest.extend({
  // Логиниться перед тестом
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('user@example.com', 'password123');

    // Использовать в тесте
    await use(page);

    // Cleanup после теста (если нужно)
  },

  // Тестовые данные
  testUser: {
    email: 'test@example.com',
    password: 'secure123',
    name: 'John Doe'
  }
});

// В тестах:
test('dashboard loads', async ({ authenticatedPage }) => {
  // Уже залогинены!
  const title = await authenticatedPage.title();
  expect(title).toContain('Dashboard');
});
```

---

## 4. Асинхронность и ожидание

### ✅ Хорошее использование async/await

```javascript
test('user registration', async ({ page }) => {
  // Правильно используем async/await
  await page.goto('https://example.com/register');
  await page.getByLabel('Email').fill('new@example.com');

  // Ждем навигации правильно
  await Promise.all([
    page.waitForNavigation(),
    page.getByRole('button', { name: 'Register' }).click()
  ]);

  // Проверяем результат
  await expect(page).toHaveURL(/success/);
});
```

### ❌ Плохое использование

```javascript
test('bad async', async ({ page }) => {
  // ПЛОХО: Забыли await
  page.goto('https://example.com');
  page.fill('input', 'text');

  // ПЛОХО: setTimeout (очень плохо!)
  await new Promise(r => setTimeout(r, 5000));

  // ПЛОХО: Не ждем навигацию
  await page.click('button');
  // Тест может упасть, потому что URL еще не изменился
});
```

---

## 5. Селекторы — best practices

### ✅ Хорошие селекторы

```javascript
// Используйте семантичные селекторы
page.getByRole('button', { name: 'Submit' });
page.getByLabel('Email');
page.getByTestId('delete-button');
page.getByPlaceholder('Search...');

// Они надежны и читаемы
```

### ❌ Плохие селекторы

```javascript
// Зависят от стилей
page.click('.container-xyz > .btn-style-v2');

// Индексные селекторы
page.locator('button').nth(2);

// XPath с явными путями
page.click('//div/div/form/button');
```

---

## 6. Обработка ошибок и retry

```javascript
// playwright.config.ts
export default defineConfig({
  // Переповтор тестов при сбое
  retries: process.env.CI ? 2 : 0,

  // Timeout для одного теста
  timeout: 30 * 1000,

  // Timeout для всего набора
  globalTimeout: 30 * 60 * 1000,
});

// Или для конкретного теста
test('flaky test', async ({ page }) => {
  // Реализовать
}, { retries: 3 });
```

---

## 7. Управление состоянием БД

### Перед тестом (Setup)

```javascript
test.beforeEach(async ({ page, context }) => {
  // Очистить тестовые данные
  await clearTestDatabase();

  // Создать нужные данные
  await createTestUser({
    email: 'test@example.com',
    name: 'John'
  });
});

test.afterEach(async () => {
  // Очистить после теста
  await clearTestDatabase();
});

test('user can edit profile', async ({ page }) => {
  // Данные уже в БД
  await page.goto('/profile');
  // ...
});
```

### Через API (Быстрее!)

```javascript
test.beforeEach(async ({ page, context }) => {
  // Создать пользователя через API (быстрее, чем UI)
  const response = await context.request.post('/api/users', {
    data: {
      email: 'test@example.com',
      password: 'pass123'
    }
  });

  const user = await response.json();
  // Использовать в тесте
});
```

---

## 8. Таймауты и ожидание

```javascript
test('handle loading', async ({ page }) => {
  await page.goto('/dashboard');

  // Спинер появляется и исчезает
  await expect(page.locator('.spinner')).toBeVisible();

  // Автоматически ждет 30 секунд
  await expect(page.locator('.spinner')).toBeHidden();

  // Или с кастомным таймаутом
  await expect(page.locator('.spinner')).toBeHidden({
    timeout: 10000
  });
});

// Для очень долгих операций
test('slow upload', async ({ page }) => {
  // 3 минуты для этого теста
}, { timeout: 3 * 60 * 1000 });
```

---

## 9. Организация тестов

```javascript
test.describe('Authentication', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('successful login', async () => {
    await loginPage.login('user@example.com', 'password123');
    // assertions
  });

  test('invalid email shows error', async () => {
    await loginPage.login('invalid-email', 'password123');
    // assertions
  });

  test.describe('Password Reset', () => {
    test('send reset email', async () => {
      // Вложенные describe для организации
    });
  });
});
```

---

## 10. Скриншоты и видео

```javascript
// playwright.config.ts
export default defineConfig({
  use: {
    // Скриншот при падении теста
    screenshot: 'only-on-failure',

    // Видео при падении
    video: 'retain-on-failure',

    // Трассировка для отладки
    trace: 'on-first-retry',
  },
});

// Или в тесте
test('manual screenshot', async ({ page }) => {
  await page.goto('/dashboard');
  await page.screenshot({ path: 'dashboard.png' });
});
```

---

## 11. Логирование и отладка

```javascript
// Простое логирование
test('debug example', async ({ page }) => {
  page.on('console', msg => console.log(msg.text()));
  page.on('pageerror', err => console.log(err));

  await page.goto('/dashboard');

  // Выведет все консоль-логи страницы
});

// Пошаговая отладка
test('step by step', async ({ page }) => {
  console.log('1. Идем на страницу');
  await page.goto('/login');

  console.log('2. Заполняем форму');
  await page.getByLabel('Email').fill('test@example.com');

  console.log('3. Отправляем');
  await page.click('button');

  console.log('4. Проверяем результат');
  expect(page.url()).toContain('/dashboard');
});
```

---

## 12. Параллельное выполнение

```javascript
// playwright.config.ts
export default defineConfig({
  workers: 4, // 4 параллельных процесса

  // Или на CI
  workers: process.env.CI ? 1 : 4,
});

// Все тесты в одном файле —параллельно
// Разные файлы — параллельно
// Разные проекты (браузеры) — параллельно

// Если нужны последовательные тесты:
test.describe.serial('sequential tests', () => {
  test('first', () => { /* ... */ });
  test('second', () => { /* ... */ });
  // Выполнятся по порядку
});
```

---

## 13. Конфигурация для разных окружений

```typescript
// playwright.config.ts
const baseURL = process.env.BASE_URL || 'http://localhost:3000';

export default defineConfig({
  use: {
    baseURL,
  },

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});

// test.spec.ts
test('home page', async ({ page }) => {
  // Автоматически использует baseURL
  await page.goto('/'); // http://localhost:3000/
});
```

---

## 14. Чеклист для production-ready тестов

- ✅ Используете Page Object Model
- ✅ Типизируете с TypeScript
- ✅ Есть fixtures для переиспользования
- ✅ Селекторы семантичны (getByRole, getByLabel)
- ✅ Нет setTimeout, только async/await
- ✅ Обрабатываете ошибки и retry
- ✅ Есть setup/teardown
- ✅ Тесты независимы друг от друга
- ✅ Хорошее имя теста
- ✅ Настроены скриншоты/видео
- ✅ Работает на CI

---

## Следующие шаги

1. Применяйте эти практики в своих тестах
2. Настройте **[CI/CD](/basics_playwright/ci-cd)** для автоматизации
3. Читайте официальную документацию для advanced техник
