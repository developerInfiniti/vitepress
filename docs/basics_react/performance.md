---
description: "Производительность React: memo, useMemo, useCallback, lazy — оптимизация рендеринга компонентов"
---

# Оптимизация производительности React

## Введение

React обеспечивает высокую производительность по умолчанию благодаря Virtual DOM, но в сложных приложениях могут возникать проблемы с лишними рендерами и загрузкой. В этой статье рассмотрим основные инструменты и паттерны оптимизации.

## React.memo

`React.memo` — это компонент высшего порядка (HOC), который мемоизирует результат рендера. Компонент перерендерится только если его пропсы изменились.

### Базовый пример

```jsx
import React, { memo } from 'react';

const UserCard = memo(function UserCard({ name, email }) {
  console.log('Рендер UserCard:', name);
  return (
    <div className="card">
      <h3>{name}</h3>
      <p>{email}</p>
    </div>
  );
});

// UserCard не перерендерится, если name и email не изменились
```

### Пользовательская функция сравнения

По умолчанию `React.memo` делает поверхностное сравнение (shallow comparison). Можно передать свою функцию сравнения:

```jsx
const UserCard = memo(
  function UserCard({ user }) {
    return (
      <div>
        <h3>{user.name}</h3>
        <p>{user.email}</p>
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Вернуть true если рендер НЕ нужен
    return prevProps.user.id === nextProps.user.id
      && prevProps.user.name === nextProps.user.name;
  }
);
```

## React.lazy и Suspense

`React.lazy` позволяет загружать компоненты динамически (code splitting). Это уменьшает размер начального бандла.

### Базовый пример

```jsx
import React, { lazy, Suspense } from 'react';

// Компонент загрузится только когда он понадобится
const HeavyChart = lazy(() => import('./HeavyChart'));
const AdminPanel = lazy(() => import('./AdminPanel'));

function App() {
  return (
    <div>
      <h1>Моё приложение</h1>
      <Suspense fallback={<div>Загрузка графика...</div>}>
        <HeavyChart />
      </Suspense>
    </div>
  );
}
```

### Lazy loading маршрутов

```jsx
import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Загрузка страницы...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

## Виртуализация списков

При рендере больших списков (сотни/тысячи элементов) используйте виртуализацию — рендерятся только видимые элементы.

```jsx
import { FixedSizeList as List } from 'react-window';

function VirtualizedList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      {items[index].name}
    </div>
  );

  return (
    <List
      height={400}
      itemCount={items.length}
      itemSize={35}
      width="100%"
    >
      {Row}
    </List>
  );
}
```

## Предотвращение лишних рендеров

### Проблема: создание объектов в JSX

```jsx
// Плохо — новый объект при каждом рендере
function App() {
  return <UserCard style={{ color: 'red' }} />;
}

// Хорошо — стабильная ссылка
const cardStyle = { color: 'red' };
function App() {
  return <UserCard style={cardStyle} />;
}
```

### Проблема: анонимные функции в JSX

```jsx
// Плохо — новая функция при каждом рендере
function TodoList({ todos }) {
  return todos.map(todo => (
    <TodoItem
      key={todo.id}
      todo={todo}
      onClick={() => handleClick(todo.id)} // новая ссылка каждый раз
    />
  ));
}

// Хорошо — обработчик внутри дочернего компонента
const TodoItem = memo(({ todo, onItemClick }) => (
  <li onClick={() => onItemClick(todo.id)}>{todo.text}</li>
));
```

## Debouncing и throttling

Для событий, которые срабатывают часто (ввод текста, скролл), используйте debounce или throttle.

```jsx
import React, { useState, useMemo } from 'react';

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function SearchInput({ onSearch }) {
  const [value, setValue] = useState('');

  const debouncedSearch = useMemo(
    () => debounce((query) => onSearch(query), 300),
    [onSearch]
  );

  const handleChange = (e) => {
    setValue(e.target.value);
    debouncedSearch(e.target.value);
  };

  return <input value={value} onChange={handleChange} placeholder="Поиск..." />;
}
```

## useTransition и useDeferredValue (React 18+)

### useTransition

Позволяет пометить обновление как «неприоритетное», чтобы UI оставался отзывчивым.

```jsx
import React, { useState, useTransition } from 'react';

function FilterableList({ items }) {
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleChange = (e) => {
    const value = e.target.value;
    // Обновление инпута — приоритетное
    setInputValue(value);

    // Фильтрация списка — неприоритетная
    startTransition(() => {
      setFilter(value);
    });
  };

  const filtered = items.filter(item =>
    item.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <input value={inputValue} onChange={handleChange} placeholder="Фильтр..." />
      {isPending && <span>Обновление...</span>}
      <ul>
        {filtered.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### useDeferredValue

Откладывает обновление значения, позволяя более приоритетным обновлениям завершиться первыми.

```jsx
import React, { useState, useDeferredValue, useMemo } from 'react';

function SearchResults({ query }) {
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;

  const results = useMemo(
    () => heavySearch(deferredQuery),
    [deferredQuery]
  );

  return (
    <div style={{ opacity: isStale ? 0.5 : 1 }}>
      {results.map(item => (
        <div key={item.id}>{item.title}</div>
      ))}
    </div>
  );
}
```

## Профилирование

### React DevTools Profiler

React DevTools включает вкладку Profiler, которая показывает:

- Какие компоненты рендерились
- Сколько времени занял рендер
- Почему компонент перерендерился

### Программный Profiler

```jsx
import React, { Profiler } from 'react';

function onRenderCallback(id, phase, actualDuration) {
  console.log(`${id} (${phase}): ${actualDuration}ms`);
}

function App() {
  return (
    <Profiler id="App" onRender={onRenderCallback}>
      <MainContent />
    </Profiler>
  );
}
```

## Чек-лист оптимизации

1. **Измерьте** — используйте React DevTools Profiler перед оптимизацией
2. **React.memo** — для компонентов, которые часто рендерятся с одинаковыми пропсами
3. **useMemo / useCallback** — для тяжёлых вычислений и стабильных ссылок
4. **React.lazy + Suspense** — для code splitting и ленивой загрузки
5. **Виртуализация** — для длинных списков (react-window, react-virtuoso)
6. **Debounce / throttle** — для частых событий (ввод, скролл)
7. **useTransition / useDeferredValue** — для неприоритетных обновлений (React 18+)
8. **Избегайте** создания объектов и функций в JSX
