# useReducer в React

## Введение в useReducer

`useReducer` — это хук React, который позволяет управлять сложным состоянием компонента с помощью функции-редьюсера. Он является альтернативой `useState` и особенно полезен, когда:

- Состояние имеет сложную структуру (объекты, вложенные данные)
- Следующее состояние зависит от предыдущего
- Есть множество связанных обновлений состояния

## Синтаксис

```jsx
const [state, dispatch] = useReducer(reducer, initialState);
```

- **reducer** — функция вида `(state, action) => newState`
- **initialState** — начальное значение состояния
- **state** — текущее состояние
- **dispatch** — функция для отправки действий (actions)

## Базовый пример: счётчик

```jsx
import React, { useReducer } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return { count: 0 };
    default:
      throw new Error('Неизвестное действие: ' + action.type);
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <div>
      <p>Счёт: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Сброс</button>
    </div>
  );
}
```

## Сложное состояние: форма

`useReducer` удобен для управления состоянием формы с множеством полей.

```jsx
import React, { useReducer } from 'react';

const initialState = {
  name: '',
  email: '',
  age: '',
  errors: {}
};

function formReducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        [action.field]: action.value,
        errors: { ...state.errors, [action.field]: '' }
      };
    case 'SET_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.field]: action.error }
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

function RegistrationForm() {
  const [state, dispatch] = useReducer(formReducer, initialState);

  const handleChange = (e) => {
    dispatch({
      type: 'SET_FIELD',
      field: e.target.name,
      value: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!state.name) {
      dispatch({ type: 'SET_ERROR', field: 'name', error: 'Имя обязательно' });
      return;
    }
    console.log('Отправка:', state);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        value={state.name}
        onChange={handleChange}
        placeholder="Имя"
      />
      {state.errors.name && <span>{state.errors.name}</span>}

      <input
        name="email"
        value={state.email}
        onChange={handleChange}
        placeholder="Email"
      />

      <input
        name="age"
        value={state.age}
        onChange={handleChange}
        placeholder="Возраст"
      />

      <button type="submit">Отправить</button>
      <button type="button" onClick={() => dispatch({ type: 'RESET' })}>
        Очистить
      </button>
    </form>
  );
}
```

## Ленивая инициализация

Третий аргумент `useReducer` позволяет вычислить начальное состояние лениво — полезно, когда инициализация зависит от пропсов.

```jsx
function init(initialCount) {
  return { count: initialCount };
}

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return init(action.payload);
    default:
      return state;
  }
}

function Counter({ initialCount }) {
  const [state, dispatch] = useReducer(reducer, initialCount, init);

  return (
    <div>
      <p>Счёт: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'reset', payload: initialCount })}>
        Сброс
      </button>
    </div>
  );
}
```

## useReducer + useContext

Комбинация `useReducer` и `useContext` позволяет создать глобальное управление состоянием без внешних библиотек.

```jsx
import React, { useReducer, useContext, createContext } from 'react';

const TodoContext = createContext();

const initialState = { todos: [] };

function todoReducer(state, action) {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        todos: [...state.todos, { id: Date.now(), text: action.text, done: false }]
      };
    case 'TOGGLE_TODO':
      return {
        todos: state.todos.map(todo =>
          todo.id === action.id ? { ...todo, done: !todo.done } : todo
        )
      };
    case 'DELETE_TODO':
      return {
        todos: state.todos.filter(todo => todo.id !== action.id)
      };
    default:
      return state;
  }
}

function TodoProvider({ children }) {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  return (
    <TodoContext.Provider value={{ state, dispatch }}>
      {children}
    </TodoContext.Provider>
  );
}

function TodoList() {
  const { state, dispatch } = useContext(TodoContext);

  return (
    <ul>
      {state.todos.map(todo => (
        <li key={todo.id}>
          <span
            style={{ textDecoration: todo.done ? 'line-through' : 'none' }}
            onClick={() => dispatch({ type: 'TOGGLE_TODO', id: todo.id })}
          >
            {todo.text}
          </span>
          <button onClick={() => dispatch({ type: 'DELETE_TODO', id: todo.id })}>
            Удалить
          </button>
        </li>
      ))}
    </ul>
  );
}

function App() {
  return (
    <TodoProvider>
      <TodoList />
    </TodoProvider>
  );
}
```

## useState vs useReducer

| Критерий | useState | useReducer |
|---|---|---|
| Простое состояние | Подходит | Избыточен |
| Сложная логика обновлений | Неудобен | Подходит |
| Множество связанных полей | Неудобен | Подходит |
| Зависимость от предыдущего состояния | Возможен | Предпочтителен |
| Тестирование логики | Сложнее | Проще (чистая функция) |
| Глобальное состояние (с Context) | Ограничен | Подходит |

## Лучшие практики

1. **Используйте константы для типов действий** — избегайте опечаток в строках:

```jsx
const ACTIONS = {
  INCREMENT: 'increment',
  DECREMENT: 'decrement',
  RESET: 'reset'
};
```

2. **Редьюсер должен быть чистой функцией** — без побочных эффектов, без мутации состояния.

3. **Выносите редьюсер за пределы компонента** — это улучшает читаемость и позволяет тестировать отдельно.

4. **Используйте `useReducer` вместо множества `useState`**, когда состояния связаны между собой.

5. **Комбинируйте с `useContext`** для глобального состояния вместо Redux в небольших приложениях.
