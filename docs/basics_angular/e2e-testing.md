---
description: "E2E тестирование Angular приложений: Protractor, Cypress, сценарии — сквозное тестирование UI"
---

# E2E-тестирование в Angular

## Обзор инструментов

| Инструмент | Статус | Особенности |
|---|---|---|
| **Protractor** | Deprecated (Angular 15) | Был дефолтным, основан на Selenium |
| **Cypress** | Популярный | Быстрый, удобный UI, работает в браузере |
| **Playwright** | Рекомендуемый | Мультибраузер, быстрый, от Microsoft |

## Cypress

### Установка

```bash
ng add @cypress/schematic
# или
npm install -D cypress
npx cypress open
```

### Конфигурация (`cypress.config.ts`)

```typescript
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
  },
});
```

### Написание тестов

```typescript
// cypress/e2e/auth.cy.ts
describe('Аутентификация', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('отображает форму входа', () => {
    cy.get('h1').should('contain', 'Вход');
    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('валидация email', () => {
    cy.get('input[name="email"]').type('invalid');
    cy.get('input[name="email"]').blur();
    cy.get('.error-message').should('contain', 'Некорректный email');
  });

  it('успешный вход', () => {
    // Мок API
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: { token: 'fake-token', user: { name: 'Анна' } },
    }).as('loginRequest');

    cy.get('input[name="email"]').type('anna@test.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginRequest');
    cy.url().should('include', '/dashboard');
    cy.get('.welcome-message').should('contain', 'Привет, Анна');
  });

  it('ошибка при неверных данных', () => {
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 401,
      body: { message: 'Неверный email или пароль' },
    }).as('loginRequest');

    cy.get('input[name="email"]').type('wrong@test.com');
    cy.get('input[name="password"]').type('wrong');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginRequest');
    cy.get('.alert-error').should('contain', 'Неверный email или пароль');
    cy.url().should('include', '/login');
  });
});
```

### CRUD-операции

```typescript
// cypress/e2e/users.cy.ts
describe('Управление пользователями', () => {
  beforeEach(() => {
    // Мок данных
    cy.intercept('GET', '/api/users', {
      fixture: 'users.json'  // cypress/fixtures/users.json
    }).as('getUsers');

    cy.visit('/users');
    cy.wait('@getUsers');
  });

  it('отображает список пользователей', () => {
    cy.get('.user-card').should('have.length', 3);
    cy.get('.user-card').first().should('contain', 'Анна');
  });

  it('поиск фильтрует список', () => {
    cy.get('input[placeholder="Поиск"]').type('Борис');
    cy.get('.user-card').should('have.length', 1);
    cy.get('.user-card').should('contain', 'Борис');
  });

  it('создание нового пользователя', () => {
    cy.intercept('POST', '/api/users', {
      statusCode: 201,
      body: { id: 4, name: 'Новый', email: 'new@test.com' },
    }).as('createUser');

    cy.get('.add-user-btn').click();
    cy.get('input[name="name"]').type('Новый');
    cy.get('input[name="email"]').type('new@test.com');
    cy.get('.save-btn').click();

    cy.wait('@createUser');
    cy.get('.notification').should('contain', 'Пользователь создан');
  });

  it('удаление пользователя', () => {
    cy.intercept('DELETE', '/api/users/1', { statusCode: 204 }).as('deleteUser');

    cy.get('.user-card').first().find('.delete-btn').click();
    cy.get('.confirm-dialog .yes-btn').click();

    cy.wait('@deleteUser');
    cy.get('.user-card').should('have.length', 2);
  });
});
```

### Custom Commands

```typescript
// cypress/support/commands.ts
declare namespace Cypress {
  interface Chainable {
    login(email: string, password: string): Chainable;
  }
}

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.intercept('POST', '/api/auth/login', {
    body: { token: 'test-token', user: { email } },
  });

  cy.visit('/login');
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('not.include', '/login');
});

// Использование
cy.login('admin@test.com', 'password');
```

## Playwright

### Установка

```bash
ng add @playwright/test
# или
npm init playwright@latest
```

### Конфигурация (`playwright.config.ts`)

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'firefox', use: { browserName: 'firefox' } },
    { name: 'webkit', use: { browserName: 'webkit' } },
  ],
  webServer: {
    command: 'ng serve',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env.CI,
  },
});
```

### Написание тестов

```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Аутентификация', () => {
  test('успешный вход', async ({ page }) => {
    // Мок API
    await page.route('**/api/auth/login', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          token: 'fake-token',
          user: { name: 'Анна' },
        }),
      });
    });

    await page.goto('/login');

    await page.fill('input[name="email"]', 'anna@test.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/dashboard/);
    await expect(page.locator('.welcome-message')).toContainText('Привет, Анна');
  });

  test('валидация формы', async ({ page }) => {
    await page.goto('/login');

    const submitBtn = page.locator('button[type="submit"]');
    await expect(submitBtn).toBeDisabled();

    await page.fill('input[name="email"]', 'invalid');
    await page.locator('input[name="email"]').blur();
    await expect(page.locator('.error-message')).toContainText('Некорректный email');
  });
});
```

### Page Object Model

```typescript
// e2e/pages/login.page.ts
import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.submitButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('.alert-error');
  }

  async goto(): Promise<void> {
    await this.page.goto('/login');
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async expectError(message: string): Promise<void> {
    await expect(this.errorMessage).toContainText(message);
  }
}
```

```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/login.page';

test.describe('Аутентификация', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('успешный вход', async ({ page }) => {
    await page.route('**/api/auth/login', (route) =>
      route.fulfill({
        status: 200,
        body: JSON.stringify({ token: 'tok', user: { name: 'Анна' } }),
      })
    );

    await loginPage.login('anna@test.com', 'password123');
    await expect(page).toHaveURL(/dashboard/);
  });

  test('ошибка входа', async ({ page }) => {
    await page.route('**/api/auth/login', (route) =>
      route.fulfill({
        status: 401,
        body: JSON.stringify({ message: 'Неверные данные' }),
      })
    );

    await loginPage.login('wrong@test.com', 'wrong');
    await loginPage.expectError('Неверные данные');
  });
});
```

### Запуск Playwright

```bash
# Запуск всех тестов
npx playwright test

# С UI-режимом
npx playwright test --ui

# Конкретный файл
npx playwright test e2e/auth.spec.ts

# Конкретный браузер
npx playwright test --project=chromium

# Отчёт
npx playwright show-report
```

## Сравнение Cypress vs Playwright

| Аспект | Cypress | Playwright |
|---|---|---|
| Браузеры | Chrome, Firefox, Edge | Chrome, Firefox, Safari, Edge |
| Язык | JavaScript/TypeScript | JavaScript/TypeScript, Python, C#, Java |
| Параллельность | Платная (Dashboard) | Встроенная бесплатная |
| API мокирование | `cy.intercept()` | `page.route()` |
| Скорость | Быстрый | Очень быстрый |
| UI для отладки | Cypress Runner | Trace Viewer, UI Mode |
| Iframe/вкладки | Ограничено | Полная поддержка |
| Auto-wait | Да | Да |
| Сообщество | Большое | Растущее |
| Лицензия | MIT (open-source) | Apache 2.0 |

## Запуск E2E в CI/CD

### GitHub Actions (Playwright)

```yaml
name: E2E Tests
on: [push, pull_request]

jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

### GitHub Actions (Cypress)

```yaml
name: E2E Tests
on: [push, pull_request]

jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: cypress-io/github-action@v6
        with:
          start: npm start
          wait-on: 'http://localhost:4200'
          browser: chrome
```
