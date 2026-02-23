# useMemo и useCallback в React

## Введение

`useMemo` и `useCallback` — это хуки React для оптимизации производительности. Они позволяют избежать лишних вычислений и повторных рендеров, мемоизируя значения и функции.

## useMemo

`useMemo` мемоизирует результат вычисления. Функция пересчитывается только когда изменяются зависимости.

### Синтаксис

```jsx
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

### Пример: фильтрация списка

```jsx
import React, { useState, useMemo } from 'react';

function UserList({ users }) {
  const [filter, setFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  // Без useMemo фильтрация выполняется при каждом рендере
  const filteredUsers = useMemo(() => {
    console.log('Фильтрация пользователей...');
    let result = users.filter(user =>
      user.name.toLowerCase().includes(filter.toLowerCase())
    );
    result.sort((a, b) =>
      sortOrder === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );
    return result;
  }, [users, filter, sortOrder]);

  return (
    <div>
      <input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Поиск..."
      />
      <button onClick={() => setSortOrder(s => s === 'asc' ? 'desc' : 'asc')}>
        Сортировка: {sortOrder}
      </button>
      <ul>
        {filteredUsers.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Пример: тяжёлые вычисления

```jsx
import React, { useState, useMemo } from 'react';

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

function FibCalculator() {
  const [num, setNum] = useState(10);
  const [theme, setTheme] = useState('light');

  // Без useMemo: пересчитывается при смене темы тоже
  const result = useMemo(() => {
    console.log('Вычисление Фибоначчи...');
    return fibonacci(num);
  }, [num]);

  return (
    <div style={{ background: theme === 'light' ? '#fff' : '#333', color: theme === 'light' ? '#000' : '#fff' }}>
      <input
        type="number"
        value={num}
        onChange={(e) => setNum(parseInt(e.target.value) || 0)}
      />
      <p>Фибоначчи({num}) = {result}</p>
      <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
        Сменить тему
      </button>
    </div>
  );
}
```

## useCallback

`useCallback` мемоизирует саму функцию. Возвращает ту же ссылку на функцию, пока зависимости не изменились.

### Синтаксис

```jsx
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

### Пример: предотвращение лишних рендеров дочерних компонентов

```jsx
import React, { useState, useCallback, memo } from 'react';

// Дочерний компонент обёрнут в React.memo
const TodoItem = memo(({ todo, onToggle, onDelete }) => {
  console.log('Рендер TodoItem:', todo.text);
  return (
    <li>
      <span
        style={{ textDecoration: todo.done ? 'line-through' : 'none' }}
        onClick={() => onToggle(todo.id)}
      >
        {todo.text}
      </span>
      <button onClick={() => onDelete(todo.id)}>Удалить</button>
    </li>
  );
});

function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Изучить React', done: false },
    { id: 2, text: 'Написать код', done: false },
  ]);
  const [input, setInput] = useState('');

  // Без useCallback — новая ссылка при каждом рендере,
  // и React.memo не работает
  const handleToggle = useCallback((id) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  }, []);

  const handleDelete = useCallback((id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []);

  const handleAdd = () => {
    if (input.trim()) {
      setTodos(prev => [...prev, { id: Date.now(), text: input, done: false }]);
      setInput('');
    }
  };

  return (
    <div>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={handleAdd}>Добавить</button>
      <ul>
        {todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        ))}
      </ul>
    </div>
  );
}
```

### Пример: передача в useEffect

```jsx
import React, { useState, useCallback, useEffect } from 'react';

function SearchResults({ query }) {
  const [results, setResults] = useState([]);

  const fetchResults = useCallback(async () => {
    if (!query) return;
    const response = await fetch(`/api/search?q=${query}`);
    const data = await response.json();
    setResults(data);
  }, [query]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  return (
    <ul>
      {results.map(item => (
        <li key={item.id}>{item.title}</li>
      ))}
    </ul>
  );
}
```

## Сравнение useMemo и useCallback

| Критерий | useMemo | useCallback |
|---|---|---|
| Что мемоизирует | Результат вычисления | Ссылку на функцию |
| Возвращает | Значение | Функцию |
| Когда использовать | Тяжёлые вычисления | Передача колбэков дочерним компонентам |
| Связь | `useMemo(() => fn, deps)` === `useCallback(fn, deps)` | — |

## Когда НЕ нужно использовать

Мемоизация не бесплатна — она потребляет память и добавляет сложность. Не используйте, если:

1. **Вычисление простое** — мемоизация может быть дороже самого вычисления
2. **Зависимости меняются при каждом рендере** — мемоизация бесполезна
3. **Нет дочерних компонентов с `React.memo`** — `useCallback` не даст эффекта
4. **Преждевременная оптимизация** — сначала измерьте, потом оптимизируйте

```jsx
// Не нужно — простое вычисление
const fullName = useMemo(() => `${firstName} ${lastName}`, [firstName, lastName]);

// Лучше просто:
const fullName = `${firstName} ${lastName}`;
```

## Лучшие практики

1. **Профилируйте перед оптимизацией** — используйте React DevTools Profiler для выявления узких мест.

2. **Используйте `useCallback` вместе с `React.memo`** — без `React.memo` на дочернем компоненте `useCallback` не предотвратит повторный рендер.

3. **Указывайте корректные зависимости** — пропуск зависимости приведёт к устаревшим данным.

4. **`useMemo` для тяжёлых вычислений** — фильтрация, сортировка, парсинг больших данных.

5. **`useCallback` для стабильных ссылок** — при передаче функций в дочерние компоненты или в массив зависимостей `useEffect`.
