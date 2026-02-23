# Error Boundaries в React

## Введение

Error Boundaries (границы ошибок) — это компоненты React, которые перехватывают JavaScript-ошибки в дереве дочерних компонентов, логируют их и отображают запасной UI вместо упавшего дерева компонентов.

Error Boundaries перехватывают ошибки во время:
- Рендеринга
- Методов жизненного цикла
- Конструкторов дочерних компонентов

## Чего Error Boundaries НЕ перехватывают

- Обработчики событий (используйте `try/catch`)
- Асинхронный код (`setTimeout`, `requestAnimationFrame`)
- Серверный рендеринг (SSR)
- Ошибки, возникающие в самом Error Boundary

## Создание Error Boundary

Error Boundary — это классовый компонент, который реализует `static getDerivedStateFromError()` и/или `componentDidCatch()`.

```jsx
import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  // Обновляем состояние для отображения запасного UI
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  // Логирование ошибки
  componentDidCatch(error, errorInfo) {
    console.error('Error Boundary поймал ошибку:', error);
    console.error('Информация о компоненте:', errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', background: '#fee', border: '1px solid #f00' }}>
          <h2>Что-то пошло не так</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Попробовать снова
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## Использование

### Оборачивание компонентов

```jsx
function App() {
  return (
    <div>
      <h1>Моё приложение</h1>
      <ErrorBoundary>
        <UserProfile />
      </ErrorBoundary>
      <ErrorBoundary>
        <Dashboard />
      </ErrorBoundary>
    </div>
  );
}
```

Если `UserProfile` упадёт с ошибкой, `Dashboard` продолжит работать нормально.

### Вложенные Error Boundaries

```jsx
function App() {
  return (
    <ErrorBoundary> {/* Глобальный — ловит всё */}
      <Header />
      <ErrorBoundary> {/* Для контента */}
        <Sidebar />
        <ErrorBoundary> {/* Для виджетов */}
          <WeatherWidget />
        </ErrorBoundary>
        <MainContent />
      </ErrorBoundary>
      <Footer />
    </ErrorBoundary>
  );
}
```

## Error Boundary с кастомным fallback

```jsx
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Отправка ошибки в сервис мониторинга
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      // Используем кастомный fallback если передан
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, () => {
          this.setState({ hasError: false, error: null });
        });
      }

      return <p>Произошла ошибка</p>;
    }

    return this.props.children;
  }
}

// Использование с кастомным fallback
function App() {
  return (
    <ErrorBoundary
      fallback={(error, retry) => (
        <div>
          <h3>Ошибка загрузки виджета</h3>
          <p>{error.message}</p>
          <button onClick={retry}>Повторить</button>
        </div>
      )}
      onError={(error) => {
        // Отправка в Sentry, LogRocket и т.д.
        console.error('Отправка ошибки:', error);
      }}
    >
      <WeatherWidget />
    </ErrorBoundary>
  );
}
```

## Обработка ошибок в обработчиках событий

Error Boundaries не перехватывают ошибки в обработчиках событий. Используйте `try/catch`:

```jsx
import React, { useState } from 'react';

function DeleteButton({ onDelete }) {
  const [error, setError] = useState(null);

  const handleClick = async () => {
    try {
      await onDelete();
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) {
    return <p>Ошибка: {error}</p>;
  }

  return <button onClick={handleClick}>Удалить</button>;
}
```

## Обработка ошибок в асинхронном коде

Для перехвата асинхронных ошибок через Error Boundary можно использовать состояние:

```jsx
import React, { useState, useEffect } from 'react';

function DataLoader() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/data')
      .then(res => {
        if (!res.ok) throw new Error('Ошибка загрузки');
        return res.json();
      })
      .then(setData)
      .catch(setError);
  }, []);

  // Бросаем ошибку в рендере — Error Boundary перехватит
  if (error) {
    throw error;
  }

  if (!data) return <p>Загрузка...</p>;

  return <div>{data.title}</div>;
}
```

## react-error-boundary

Библиотека `react-error-boundary` предоставляет готовый компонент с удобным API:

```jsx
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <h2>Что-то пошло не так</h2>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Попробовать снова</button>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, info) => console.error(error, info)}
      onReset={() => {
        // Сброс состояния приложения
      }}
    >
      <MainApp />
    </ErrorBoundary>
  );
}
```

### useErrorBoundary

```jsx
import { useErrorBoundary } from 'react-error-boundary';

function UserActions() {
  const { showBoundary } = useErrorBoundary();

  const handleDelete = async () => {
    try {
      await deleteUser();
    } catch (error) {
      // Пробрасываем ошибку в Error Boundary
      showBoundary(error);
    }
  };

  return <button onClick={handleDelete}>Удалить</button>;
}
```

## Паттерны использования

### 1. Уровни Error Boundaries

```
App (глобальный Error Boundary)
├── Header
├── Content (Error Boundary уровня страницы)
│   ├── Sidebar
│   ├── Widget A (Error Boundary уровня виджета)
│   └── Widget B (Error Boundary уровня виджета)
└── Footer
```

### 2. Error Boundary + Suspense

```jsx
function App() {
  return (
    <ErrorBoundary fallback={<p>Ошибка загрузки</p>}>
      <Suspense fallback={<p>Загрузка...</p>}>
        <LazyComponent />
      </Suspense>
    </ErrorBoundary>
  );
}
```

## Лучшие практики

1. **Размещайте Error Boundaries стратегически** — оборачивайте независимые части UI, чтобы ошибка в одном виджете не ломала всю страницу.

2. **Всегда имейте глобальный Error Boundary** — как последний рубеж обороны на уровне App.

3. **Логируйте ошибки** — отправляйте ошибки в сервис мониторинга (Sentry, LogRocket) через `componentDidCatch`.

4. **Предоставляйте возможность восстановления** — кнопка «Попробовать снова» улучшает пользовательский опыт.

5. **Используйте `react-error-boundary`** — для более удобного API и поддержки функциональных компонентов.

6. **Комбинируйте с Suspense** — для обработки и ошибок загрузки, и состояния ожидания.
