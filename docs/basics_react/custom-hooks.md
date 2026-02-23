# Пользовательские хуки (Custom Hooks)

## Введение

Пользовательские хуки — это функции JavaScript, имя которых начинается с `use`, и которые могут вызывать другие хуки. Они позволяют извлекать логику компонентов в переиспользуемые функции.

Custom Hooks — это механизм повторного использования логики с состоянием между компонентами, без добавления дополнительных компонентов в дерево.

## Правила создания

1. Имя функции должно начинаться с `use` (например, `useLocalStorage`)
2. Хук может вызывать другие хуки
3. Хук подчиняется тем же правилам, что и встроенные хуки (нельзя вызывать условно или в циклах)

## Базовый пример: useToggle

```jsx
import { useState, useCallback } from 'react';

function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue(prev => !prev);
  }, []);

  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  return { value, toggle, setTrue, setFalse };
}

// Использование
function Modal() {
  const { value: isOpen, toggle, setFalse: close } = useToggle(false);

  return (
    <div>
      <button onClick={toggle}>Открыть модалку</button>
      {isOpen && (
        <div className="modal">
          <p>Контент модалки</p>
          <button onClick={close}>Закрыть</button>
        </div>
      )}
    </div>
  );
}
```

## useLocalStorage

Хук для синхронизации состояния с localStorage.

```jsx
import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

// Использование
function Settings() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const [language, setLanguage] = useLocalStorage('language', 'ru');

  return (
    <div>
      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        <option value="light">Светлая</option>
        <option value="dark">Тёмная</option>
      </select>
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="ru">Русский</option>
        <option value="en">English</option>
      </select>
    </div>
  );
}
```

## useFetch

Хук для загрузки данных с обработкой состояний загрузки и ошибок.

```jsx
import { useState, useEffect } from 'react';

function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();

    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(url, { signal: abortController.signal });
        if (!response.ok) {
          throw new Error(`HTTP ошибка: ${response.status}`);
        }
        const json = await response.json();
        setData(json);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    return () => abortController.abort();
  }, [url]);

  return { data, loading, error };
}

// Использование
function UserProfile({ userId }) {
  const { data: user, loading, error } = useFetch(`/api/users/${userId}`);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка: {error}</p>;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}
```

## useDebounce

Хук для отложенного обновления значения.

```jsx
import { useState, useEffect } from 'react';

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// Использование
function SearchInput() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  const { data: results } = useFetch(
    debouncedQuery ? `/api/search?q=${debouncedQuery}` : null
  );

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Поиск..."
      />
      <ul>
        {results?.map(item => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

## useWindowSize

Хук для отслеживания размеров окна.

```jsx
import { useState, useEffect } from 'react';

function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}

// Использование
function ResponsiveLayout() {
  const { width } = useWindowSize();

  return (
    <div>
      {width > 768 ? (
        <DesktopLayout />
      ) : (
        <MobileLayout />
      )}
      <p>Ширина окна: {width}px</p>
    </div>
  );
}
```

## useClickOutside

Хук для обнаружения кликов за пределами элемента.

```jsx
import { useEffect, useRef } from 'react';

function useClickOutside(handler) {
  const ref = useRef();

  useEffect(() => {
    function handleClick(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        handler();
      }
    }

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [handler]);

  return ref;
}

// Использование
import { useState } from 'react';

function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useClickOutside(() => setIsOpen(false));

  return (
    <div ref={ref}>
      <button onClick={() => setIsOpen(!isOpen)}>Меню</button>
      {isOpen && (
        <ul className="dropdown">
          <li>Пункт 1</li>
          <li>Пункт 2</li>
          <li>Пункт 3</li>
        </ul>
      )}
    </div>
  );
}
```

## usePrevious

Хук для хранения предыдущего значения.

```jsx
import { useRef, useEffect } from 'react';

function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

// Использование
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);

  return (
    <div>
      <p>Текущее: {count}, Предыдущее: {prevCount}</p>
      <button onClick={() => setCount(c => c + 1)}>+1</button>
    </div>
  );
}
```

## Лучшие практики

1. **Начинайте имя с `use`** — это соглашение позволяет React проверять правила хуков.

2. **Один хук — одна ответственность** — не смешивайте несвязанную логику в одном хуке.

3. **Возвращайте понятный интерфейс** — объект с именованными полями или массив `[value, setter]` по аналогии с `useState`.

4. **Обрабатывайте очистку** — если хук подписывается на события или таймеры, возвращайте функцию очистки в `useEffect`.

5. **Используйте AbortController** — для отмены сетевых запросов при размонтировании компонента.

6. **Тестируйте отдельно** — custom hooks можно тестировать с помощью `@testing-library/react-hooks`.
