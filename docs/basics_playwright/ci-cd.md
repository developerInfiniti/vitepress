# Интеграция Playwright с CI/CD

Автоматизация запуска тестов при каждом commit. Рассмотрим популярные CI/CD платформы.

---

## GitHub Actions

### Базовая конфигурация

Создайте файл `.github/workflows/test.yml`:

```yaml
name: Playwright Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 18

      # Установить зависимости
      - name: Install dependencies
        run: npm ci

      # Установить браузеры Playwright
      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      # Запустить тесты
      - name: Run Playwright tests
        run: npm test

      # Загрузить результаты (если есть)
      - name: Upload blob report to GitHub Actions Artifacts
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: blob-report
          path: blob-report
          retention-days: 1
```

### С HTML отчетом

```yaml
- name: Run Playwright tests
  run: npm test

- name: Upload HTML report
  uses: actions/upload-artifact@v3
  if: always()
  with:
    name: playwright-report
    path: playwright-report/
    retention-days: 30
```

### С разными браузерами

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        browser: [chromium, firefox, webkit]

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18

      - run: npm ci
      - run: npx playwright install --with-deps ${{ matrix.browser }}
      - run: npm test -- --project=${{ matrix.browser }}
```

### С параллельным выполнением

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        shard: [1, 2, 3, 4]

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18

      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm test -- --shard=${{ matrix.shard }}/4

      - name: Upload blob report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: blob-report-${{ matrix.shard }}
          path: blob-report

  merge-reports:
    if: always()
    needs: [test]
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18

      - name: Download blob reports
        uses: actions/download-artifact@v3
        with:
          path: all-blob-reports
          pattern: blob-report-*

      - run: npm install -D @playwright/test
      - run: npx playwright merge-reports --reporter html ./all-blob-reports
      - run: npm test -- --reporter=html

      - name: Upload HTML report
        uses: actions/upload-artifact@v3
        with:
          name: html-report-merged
          path: playwright-report/
          retention-days: 14
```

---

## GitLab CI

### Базовая конфигурация

Создайте файл `.gitlab-ci.yml`:

```yaml
image: mcr.microsoft.com/playwright:v1.40.0-focal

stages:
  - test

test:playwright:
  stage: test
  script:
    - npm ci
    - npx playwright test
  artifacts:
    when: always
    paths:
      - playwright-report/
    reports:
      junit: junit.xml
  retry:
    max: 2
    when:
      - unknown_failure
      - api_failure
      - runner_system_failure
```

### С Docker контейнером

```yaml
image: mcr.microsoft.com/playwright:v1.40.0-focal

test:
  stage: test
  script:
    - npm ci
    - npm test -- --reporter=junit
  artifacts:
    reports:
      junit: junit.xml
    paths:
      - blob-report/
    expire_in: 30 days
  allow_failure: true
```

---

## Jenkins

### Declarative Pipeline

```groovy
pipeline {
    agent any

    stages {
        stage('Install') {
            steps {
                sh 'npm ci'
                sh 'npx playwright install --with-deps'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test'
            }
        }

        stage('Report') {
            steps {
                publishHTML([
                    reportDir: 'playwright-report',
                    reportFiles: 'index.html',
                    reportName: 'Playwright Report'
                ])
            }
        }
    }

    post {
        always {
            junit 'junit.xml'
            archiveArtifacts artifacts: 'playwright-report/**'
        }
    }
}
```

---

## Docker контейнеры

### Dockerfile

```dockerfile
FROM mcr.microsoft.com/playwright:v1.40.0-focal

WORKDIR /app

# Копировать зависимости
COPY package*.json ./
RUN npm ci

# Копировать тесты
COPY . .

# Запустить тесты
CMD ["npm", "test"]
```

### Запуск в Docker

```bash
# Собрать образ
docker build -t my-tests .

# Запустить
docker run my-tests

# Запустить с браузерами
docker run \
  --rm \
  -v $(pwd)/playwright-report:/app/playwright-report \
  my-tests
```

### Docker Compose

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=test

  tests:
    build:
      context: .
      dockerfile: Dockerfile.tests
    depends_on:
      - app
    environment:
      - BASE_URL=http://app:3000
    volumes:
      - ./playwright-report:/app/playwright-report
```

---

## Конфигурация Playwright для CI

### playwright.config.ts

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['html'],
    ['junit', { outputFile: 'junit.xml' }],
    ['github'] // Для GitHub Actions
  ],

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },

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
});
```

---

## Best Practices для CI/CD

### 1. Использовать container образы

```yaml
# GitHub Actions
runs-on: ubuntu-latest
container:
  image: mcr.microsoft.com/playwright:v1.40.0-focal
```

### 2. Кэшировать зависимости

```yaml
- uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

### 3. Параллельное выполнение

```yaml
strategy:
  matrix:
    shard: [1, 2, 3, 4]

- run: npm test -- --shard=${{ matrix.shard }}/4
```

### 4. Сохранять артефакты

```yaml
- uses: actions/upload-artifact@v3
  if: always()
  with:
    name: playwright-report
    path: playwright-report/
    retention-days: 30
```

### 5. Notifications

```yaml
- name: Send Slack notification
  if: failure()
  uses: slackapi/slack-github-action@v1
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK }}
```

---

## Переменные окружения

### Для разных сценариев

```bash
# Локально
npm test

# На staging
BASE_URL=https://staging.example.com npm test

# На production (read-only)
BASE_URL=https://example.com npm test -- --headed
```

### В CI конфиге

```yaml
# GitHub Actions
env:
  BASE_URL: ${{ secrets.BASE_URL }}
  API_KEY: ${{ secrets.API_KEY }}

steps:
  - run: npm test
```

---

## Отладка CI сбоев

### 1. Скачать артефакты

Большинство CI платформ сохраняют:
- HTML отчет
- Скриншоты
- Видео записи

### 2. Запустить локально

```bash
# Воспроизвести тот же сценарий
npm test -- --headed

# Отладить конкретный тест
npx playwright test -g "test name" --debug
```

### 3. Увеличить логирование

```typescript
// test.spec.ts
test('debug ci failure', async ({ page }) => {
  console.log('Navigation to:', page.url());

  await page.goto('/');
  console.log('Page loaded');

  // assertions
});
```

---

## Скрипты в package.json

```json
{
  "scripts": {
    "test": "playwright test",
    "test:debug": "playwright test --debug",
    "test:headed": "playwright test --headed",
    "test:chrome": "playwright test --project=chromium",
    "test:report": "playwright show-report",
    "test:ui": "playwright test --ui",
    "test:codegen": "playwright codegen"
  }
}
```

---

## Мониторинг и аналитика

### Сохранение результатов

```bash
# JSON формат
npm test -- --reporter=json --output=results.json

# JUnit для Jenkins/GitLab
npm test -- --reporter=junit

# HTML отчет
npm test -- --reporter=html
```

### Интеграция с системами мониторинга

Отправлять результаты в:
- Slack
- Datadog
- NewRelic
- Custom API

---

## Чеклист для production CI/CD

- ✅ Запуск на каждый push/PR
- ✅ Использование контейнеров
- ✅ Параллельное выполнение
- ✅ Сохранение артефактов (отчеты, видео)
- ✅ Notifications при сбое
- ✅ Кэширование зависимостей
- ✅ Правильные таймауты
- ✅ Разные браузеры
- ✅ Ретраи для нестабильных тестов
- ✅ Разные окружения (dev, staging)

---

## Дополнительные ресурсы

- [Playwright CI документация](https://playwright.dev/docs/ci)
- [GitHub Actions для Playwright](https://github.com/microsoft/playwright/tree/main/.github/workflows)
- [Docker образы Playwright](https://hub.docker.com/_/microsoft-playwright)

---

## Следующие шаги

Вы уже знаете:
- ✅ Основы Playwright
- ✅ Как писать тесты
- ✅ Best practices
- ✅ Как запустить на CI

Теперь практикуйте! 🚀
