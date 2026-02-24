---
sidebar_position: 10
title: Шпаргалка по хукам React
description: Шпаргалка по хукам React
keywords: ['javascript', 'js', 'react.js', 'reactjs', 'react', 'hooks', 'cheatsheet', 'шпаргалка', 'хуки']
tags: ['javascript', 'js', 'react.js', 'reactjs', 'react', 'hooks', 'cheatsheet', 'шпаргалка', 'хуки']
---

# React Hooks

> Хуки позволяют функциональным компонентам `React` иметь состояние (state) и методы жизненного цикла (lifecycle methods) подобно классовым компонентам. Появление хуков привело к тому в настоящее время классовые компоненты в `React` почти не используются.

## useState

Хук `useState()` предназначен для управления состоянием компонента. Данная функция возвращает пару геттер/сеттер - значение начального состояния и функцию для обновления этого значения. Функцию имеет следующую сигнатуру: `const [value, setValue] = useState(defaultValue)`.

### Обновление одного состояния

```jsx
const UpdateState = () => {
  const [age, setAge] = useState(19)

  const handleClick = () => setAge(age + 1)

  return (
    <>
      <p>Мне {age} лет.</p>
      <button onClick={handleClick}>Стать старше!</button>
    </>
  )
}
```

### Обновление нескольких состояний

```jsx
const MultipleStates = () => {
  const [age, setAge] = useState(19)
  const [num, setNum] = useState(1)

  const handleAge = () => setAge(age + 1)
  const handleNum = () => setNum(num + 1)

  return (
    <>
      <p>Мне {age} лет.</p>
      <p>У меня {num} братьев и сестер.</p>
      <button onClick={handleAge}>Стать старше!</button>
      <button onClick={handleNum}>Больше братьев и сестер!</button>
    </>
  )
}
```

### Обновление объекта состояния

```jsx
const StateObject = () => {
  const [state, setState] = useState({ age: 19, num: 1 })

  const handleClick = (val) =>
    setState({
      ...state,
      [val]: state[val] + 1
    })

  const { age, num } = state
  return (
    <>
      <p>Мне {age} лет.</p>
      <p>У меня {num} братьев и сестер.</p>
      <button onClick={() => handleClick('age')}>Стать старше!</button>
      <button onClick={() => handleClick('num')}>
        Больше братьев и сестер!
      </button>
    </>
  )
}
```

### Счетчик

```jsx
const CounterState = () => {
  const [count, setCount] = useState(0)

  return (
    <>
      <p>Значение счетчика: {count}.</p>
      <button onClick={() => setCount(0)}>Сбросить</button>
      <button onClick={() => setCount((prevVal) => prevVal + 1)}>
        Увеличить (+)
      </button>
      <button onClick={() => setCount((prevVal) => prevVal - 1)}>
        Уменьшить (-)
      </button>
    </>
  )
}
```

### Более сложный пример

```jsx
const Profile = () => {
  const [profile, setProfile] = useState({
    firstName: 'Иван',
    lastName: 'Петров'
  })

  const handleChange = ({ target: { value, name } }) => {
    setProfile({ ...profile, [name]: value })
  }

  const { firstName, lastName } = profile
  return (
    <>
      <h1>Профиль</h1>
      <form>
        <input
          type='text'
          value={firstName}
          onChange={handleChange}
          name='firstName'
        /> <br />
        <input
          type='text'
          value={lastName}
          onChange={handleChange}
          name='lastName'
        />
      </form>
      <p>
        Имя: {firstName} <br />
        Фамилия: {lastName}
      </p>
    </>
  )
}
```

## useEffect

Хук `useEffect()` предназначен для запуска побочных эффектов (например, выполнение сетевого запроса или добавление обработчика событий) после монтирования и отрисовки компонента. Данная функция принимает колбек и массив зависимостей. Что касается массива зависимостей, то логика следующая:

- массив не указан: эффект запускается при каждом рендеринге
- указан пустой массив: эффект запускается только один раз
- указан массив с элементами: эффект запускается при изменении любого элемента

Очистка эффектов производится посредством возвращения значений из хука.

Функция имеет следующую сигнатуру:

```jsx
// обработчик
const handler = () => {
  console.log('Случился клик!')
}

useEffect(() => {
  // запуск эффекта
  window.addEventListener('click', handler)

  // очистка эффекта
  return () => {
    window.removeEventListener('click', handler)
  }
  // массив зависимостей
}, [handler])
```

### Базовый пример

```jsx
const BasicEffect = () => {
  const [age, setAge] = useState(19)

  const handleClick = () => setAge(age + 1)

  useEffect(() => {
    document.title = `Тебе ${age} лет!`
  })

  return (
    <>
      <p>Обратите внимание на заголовок текущей вкладки браузера.</p>
      <button onClick={handleClick}>Обновить заголовок!</button>
    </>
  )
}
```

### Очистка эффекта

```jsx
const CleanupEffect = () => {
  useEffect(() => {
    const clicked = () => console.log('Клик!')

    window.addEventListener('click', clicked)

    return () => {
      window.removeEventListener('click', clicked)
    }
  }, [])

  return (
    <>
      <p>После клика по области просмотра в консоли появится сообщение.</p>
    </>
  )
}
```

### Несколько эффектов

```jsx
const MultipleEffects = () => {
  useEffect(() => {
    const clicked = () => console.log('Клик!')

    window.addEventListener('click', clicked)

    return () => {
      window.removeEventListener('click', clicked)
    }
  }, [])

  useEffect(() => {
    console.log('Второй эффект.')
  })

  return (
    <>
      <p>Загляните в консоль.</p>
    </>
  )
}
```

### Массив зависимостей

```jsx
const DependencyEffect = () => {
  const [randomInt, setRandomInt] = useState(0)
  const [effectLogs, setEffectLogs] = useState([])
  const [count, setCount] = useState(1)

  useEffect(() => {
    setEffectLogs((prev) => [
      ...prev,
      `Вызов функции номер ${count}.`
    ])

    setCount(count + 1)
  }, [randomInt])

  return (
    <>
      <h3>{randomInt}</h3>
      <button onClick={() => setRandomInt(~~(Math.random() * 10))}>
        Получить случайное целое число!
      </button>
      <ul>
        {effectLogs.map((effect, i) => (
          <li key={i}>{' 😈 '.repeat(i) + effect}</li>
        ))}
      </ul>
    </>
  )
}
```

### Пропуск эффекта

```jsx
const SkipEffect = () => {
  const [randomInt, setRandomInt] = useState(0)
  const [effectLogs, setEffectLogs] = useState([])
  const [count, setCount] = useState(1)

  useEffect(() => {
    setEffectLogs((prev) => [
      ...prev,
      `Вызов функции номер ${count}.`
    ])

    setCount(count + 1)
  }, [])

  return (
    <>
      <h3>{randomInt}</h3>
      <button onClick={() => setRandomInt(~~(Math.random() * 10))}>
        Получить случайное целое число!
      </button>
      <ul>
        {effectLogs.map((effect, i) => (
          <li key={i}>{' 😈 '.repeat(i) + effect}</li>
        ))}
      </ul>
    </>
  )
}
```

### Более сложный пример

```jsx
const UserList = () => {
  const [users, setUsers] = useState([])
  const [count, setCount] = useState(1)
  const [url, setUrl] = useState(
    `https://jsonplaceholder.typicode.com/users?_limit=${count}`
  )

  useEffect(() => {
    async function fetchUsers() {
      const response = await fetch(url)
      const users = await response.json()
      setUsers(users)
    }
    fetchUsers()
  }, [url])

  const handleSubmit = (e) => {
    e.preventDefault()
    setUrl(`https://jsonplaceholder.typicode.com/users?_limit=${count}`)
  }

  return (
    <>
      <h1>Пользователи</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Сколько пользователей вы хотите получить?
          <input
            type='number'
            value={count}
            onChange={(e) => {
              setCount(e.target.value)
            }}
          />
          <button>Получить</button>
        </label>
      </form>
      <ul>
        {users.map(({ id, name, username, email, address: { city } }) => (
          <li key={id}>
            <span>
              <b>Имя:</b> {name}
            </span>
            <br />
            <span>
              <i>Имя пользователя:</i> {username}
            </span>
            <br />
            <span>
              <b>Адрес электронной почты:</b> {email}
            </span>
            <br />
            <span>
              <i>Город:</i> {city}
            </span>
            <br />
          </li>
        ))}
      </ul>
    </>
  )
}
```

## useLayoutEffect

Хук `useLayoutEffect()` похож на хук `useEffect()`, за исключением того, что он запускает эффект перед отрисовкой компонента. Данный хук предназначен для запуска эффектов, влияющих на внешний вид DOM, незаметно для пользователя. Эта функция имеет такую же сигнатуру, что и `useEffect()`. В подавляющем большинстве случаев для запуска побочных эффектов используется `useEffect()`.

### Базовый пример

```jsx
const LayoutEffect = () => {
  const [randomInt, setRandomInt] = useState(0)
  const [effectLogs, setEffectLogs] = useState([])
  const [count, setCount] = useState(1)

  useLayoutEffect(() => {
    setEffectLogs((prev) => [...prev, `Вызов функции номер ${count}.`])

    setCount(count + 1)
  }, [randomInt])

  return (
    <>
      <h3>{randomInt}</h3>
      <button onClick={() => setRandomInt(~~(Math.random() * 10))}>
        Получить случайное целое число!
      </button>
      <ul>
        {effectLogs.map((effect, i) => (
          <li key={i}>{' 😈 '.repeat(i) + effect}</li>
        ))}
      </ul>
    </>
  )
}
```

## useContext

Хук `useContext()` предназначен для прямой передачи пропов компонентам, находящимся на любом уровне вложенности. Он позволяет избежать так называемого "бурения пропов" (prop drilling), т.е. необходимости последовательной передачи пропов на каждом уровне вложенности.

Создание контекста:

```jsx
import { createContext } from 'react'

export const ContextName = createContext()
```

Передача значения контекста нижележащим компонентам:

```jsx
<ContextName.Provider value={initialValue}>
  <App />
</ContextName.Provider>
```

Получение значения контекста:

```jsx
import { useContext } from 'react'
import { ContextName } from './ContextName'

const contextValue = useContext(ContextName)
```

### Базовый пример

```jsx
const ChangeTheme = () => {
  const [mode, setMode] = useState('light')

  const handleClick = () => {
    setMode(mode === 'light' ? 'dark' : 'light')
  }

  const ThemeContext = createContext(mode)

  const theme = useContext(ThemeContext)

  return (
    <div
      style={{
        background: theme === 'light' ? '#eee' : '#222',
        color: theme === 'light' ? '#222' : '#eee',
        display: 'grid',
        placeItems: 'center',
        minWidth: '320px',
        minHeight: '320px',
        borderRadius: '4px'
      }}
    >
      <p>Выбранная тема: {theme}.</p>
      <button onClick={handleClick}>Поменять тему оформления</button>
    </div>
  )
}
```

### Более сложный пример

```jsx
// TodoContext.js
import { createContext, useState } from 'react'

export const TodoContext = createContext()

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([])

  return (
    <TodoContext.Provider value={[todos, setTodos]}>
      {children}
    </TodoContext.Provider>
  )
}
```

```jsx
// index.js
import React, { StrictMode, render } from 'react'

import { Form } from './Form'
import { List } from './List'

import { TodoProvider } from './TodoContext'

const root = document.getElementById('root')
render(
  <StrictMode>
    <TodoProvider>
      <Form />
      <List />
    </TodoProvider>
  </StrictMode>,
  root
)
```

```jsx
// Form.js
import { useState, useContext } from 'react'
import { TodoContext } from './TodoContext'

export const Form = () => {
  // локальное состояние
  const [text, setText] = useState('')
  // глобальное состояние
  const [todos, setTodos] = useContext(TodoContext)

  const handleChange = ({ target: { value } }) => {
    setText(value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const newTodo = {
      id: Date.now(),
      text
    }

    setTodos([...todos, newTodo])

    setText('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Текст задачи: <br />
        <input
          type='text'
          value={text}
          onChange={handleChange}
        /> <br />
        <button>Добавить</button>
      </label>
    </form>
  )
}
```

```jsx
// List.js
import { useContext } from 'react'
import { TodoContext } from './TodoContext'

export const List = () => {
  // глобальное состояние
  const [todos] = useContext(TodoContext)

  return (
    <ul>
      {todos.map(({ id, text }) => <li key={id}>{text}</li>)}
    </ul>
  )
}
```

## useReducer

Хук `useReducer()`, как и хук `useState()`, предназначен для управления состоянием. Он используется при наличии сложной логики управления состоянием или когда следующее состояние зависит от предыдущего. `useReducer()` принимает редуктор (*reducer*), обновляющий состояние на основе типа (*type*) и, опционально, полезной нагрузки (*payload*) переданной операции (*action*).

Сигнатура редуктора:

```jsx
const reducer = (state, action) => {
  switch(action.type) {
    case 'actionType':
      return newState // { value: state.value + action.payload }
    default:
      return state
  }
}
```

Использование хука:

```jsx
const [state, dispatch] = useReducer(reducer, initialState, initFn)
// dispatch({ type: 'actionType', payload: 'actionPayload' }) используется для отправки операции в редуктор (для обновления состояния)
// initFn - функция для "ленивой" установки начального состояния
```

### Базовый пример

```jsx
// начальное состояние
const initialState = { width: 30 }

// редуктор
const reducer = (state, action) => {
  switch (action) {
    case 'plus':
      return { width: Math.min(state.width + 30, 600) }
    case 'minus':
      return { width: Math.max(state.width - 30, 30) }
    default:
      throw new Error('Что происходит?')
  }
}

const BasicReducer = () => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const [color, setColor] = useState('#f0f0f0')

  useEffect(() => {
    const randomColor = `#${((Math.random() * 0xfff) << 0).toString(16)}`
    setColor(randomColor)
  }, [state])

  return (
    <>
      <div
        style={{
          margin: '0 auto',
          background: color,
          height: '100px',
          width: state.width
        }}
      ></div>
      <button onClick={() => dispatch('plus')}>
        Увеличить ширину контейнера.
      </button>
      <button onClick={() => dispatch('minus')}>
        Уменьшить ширину контейнера.
      </button>
    </>
  )
}
```

### Отложенная установка начального состояния

```jsx
const initializeState = () => ({
  width: 90
})

// обратите внимание как `initializeState()` перезаписывает начальное значение
const initialState = { width: 0 }

const reducer = (state, action) => {
  switch (action) {
    case 'plus':
      return { width: Math.min(state.width + 30, 600) }
    case 'minus':
      return { width: Math.max(state.width - 30, 30) }
    default:
      throw new Error('Что происходит?')
  }
}

const LazyState = () => {
  const [state, dispatch] = useReducer(reducer, initialState, initializeState)

  const [color, setColor] = useState('#f0f0f0')

  useEffect(() => {
    const randomColor = `#${((Math.random() * 0xfff) << 0).toString(16)}`
    setColor(randomColor)
  }, [state])

  return (
    <>
      <div
        style={{
          margin: '0 auto',
          background: color,
          height: '100px',
          width: state.width
        }}
      ></div>
      <button onClick={() => dispatch('plus')}>
        Увеличить ширину контейнера.
      </button>
      <button onClick={() => dispatch('minus')}>
        Уменьшить ширину контейнера.
      </button>
    </>
  )
}
```

### Установка нового состояния

```jsx
const NewState = () => {
  const [state, setState] = useReducer(reducer, initialState)

  const [color, setColor] = useState('#f0f0f0')

  useEffect(() => {
    const randomColor = `#${((Math.random() * 0xfff) << 0).toString(16)}`
    setColor(randomColor)
  }, [state])

  return (
    <>
      <div
        style={{
          margin: '0 auto',
          background: color,
          height: '100px',
          width: state.width
        }}
      ></div>
      <button onClick={() => setState({ width: 300 })}>
        Увеличить ширину контейнера.
      </button>
      <button onClick={() => setState({ width: 30 })}>
        Уменьшить ширину контейнера.
      </button>
    </>
  )
}
```

### useReducer + useContext

```jsx
// TodoReducer.js
export const initialState = {
  todos: [
    { id: 1, text: 'Изучить React' },
    { id: 2, text: 'Изучить Redux' },
    { id: 3, text: 'Изучить GraphQL' }
  ]
}

export const reducer = (state, action) => {
  switch (action.type) {
    case 'add':
      return {
        todos: [...state.todos, action.payload]
      }
    case 'remove':
      return {
        todos: state.todos.filter((todo) => todo.id !== action.payload)
      }
    default:
      throw new Error('Что происходит?')
  }
}
```

```jsx
// TodoContext.js
import { createContext } from 'react'

import { reducer, initialState } from './TodoReducer'

export const TodoContext = createContext()

export const TodoProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <TodoContext.Provider value={[state, dispatch]}>
      {children}
    </TodoContext.Provider>
  )
}
```

```jsx
// index.js
import React, { StrictMode, render } from 'react'

import { Form } from './Form'
import { List } from './List'

import { TodoProvider } from './TodoContext'

const root = document.getElementById('root')
render(
  <StrictMode>
    <TodoProvider>
      <Form />
      <List />
    </TodoProvider>
  </StrictMode>,
  root
)
```

```jsx
// Form.js
import { useState, useContext } from 'react'

import { TodoContext } from './TodoContext'

export const Form = () => {
  const [text, setText] = useState('')
  // замыкающая запятая (trailing comma)
  const [, dispatch] = useContext(TodoContext)

  const handleChange = ({ target: { value } }) => {
    setText(value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const newTodo = {
      id: Date.now(),
      text
    }

    dispatch({ type: 'add', payload: newTodo })

    setText('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Текст задачи: <br />
        <input type='text' value={text} onChange={handleChange} /> <br />
        <button>Добавить</button>
      </label>
    </form>
  )
}
```

```jsx
// List.js
import { useContext } from 'react'

import { TodoContext } from './TodoContext'

export const List = () => {
  const [state, dispatch] = useContext(TodoContext)

  const handleClick = (id) => {
    dispatch({ type: 'remove', payload: id })
  }

  return (
    <ul>
      {state.todos.map(({ id, text }) => (
        <li key={id}>
          <span>{text}</span>
          <button onClick={() => handleClick(id)}>Удалить</button>
        </li>
      ))}
    </ul>
  )
}
```

## useCallback

Хук `useCallback()` возвращает мемоизированную версию переданной функции обратного вызова. Данный хук принимает колбек и массив зависимостей. колбек повторно вычисляется только при изменении значений одной из зависимостей. Хук имеет следующую сигнатуру:

```jsx
useCallback(
  fn,
  [deps]
) // deps - dependencies, зависимости
```

### Базовый пример

```jsx
const BasicCallback = () => {
  const [age, setAge] = useState(19)

  const handleClick = () => { setAge(age < 100 ? age + 1 : age) }

  const getRandomColor = useCallback(
    () => `#${((Math.random() * 0xfff) << 0).toString(16)}`,
    []
  )

  return (
    <>
      <Age age={age} handleClick={handleClick} />
      <Guide getRandomColor={getRandomColor} />
    </>
  )
}

const Age = ({ age, handleClick }) => {
  return (
    <div>
      <p>Мне {age} лет.</p>
      <p>Нажми на кнопку 👇</p>
      <button onClick={handleClick}>Стать старше!</button>
    </div>
  )
}

// `React.memo()` позволяет зафиксировать состояние компонента
const Guide = memo(({ getRandomColor }) => {
  const color = getRandomColor()

  return (
    <div style={{ background: color, padding: '.4rem' }}>
      <p style={{ color: color, filter: 'invert()' }}>
        Следуй инструкциям максимально точно.
      </p>
    </div>
  )
})
```

### Зависимый колбек

```jsx
const DependencyCallback = () => {
  const [age, setAge] = useState(19)

  const handleClick = () => { setAge(age < 100 ? age + 1 : age) }

  const getRandomColor = useCallback(
    () => `#${((Math.random() * 0xfff) << 0).toString(16)}`,
    [age]
  )

  return (
    <>
      <Age age={age} handleClick={handleClick} />
      <Guide getRandomColor={getRandomColor} />
    </>
  )
}

const Age = ({ age, handleClick }) => {
  return (
    <div>
      <p>Мне {age} лет.</p>
      <p>Нажми на кнопку 👇</p>
      <button onClick={handleClick}>Стать старше!</button>
    </div>
  )
}

const Guide = memo(({ getRandomColor }) => {
  const color = getRandomColor()

  return (
    <div style={{ background: color, padding: '.4rem' }}>
      <p style={{ color: color, filter: 'invert()' }}>
        Следуй инструкциям максимально точно.
      </p>
    </div>
  )
})
```

### Более сложный пример

```jsx
// пользовательский хук для добавления обработчиков событий
const useEventListener = (ev, cb, $ = window) => {
  const cbRef = useRef()

  useEffect(() => {
    cbRef.current = cb
  }, [cb])

  useEffect(() => {
    const listener = (ev) => cbRef.current(ev)

    $.addEventListener(ev, listener)

    return () => {
      $.removeEventListener(ev, listener)
    }
  }, [ev, $])
}

const CoordsCallback = () => {
  const [coords, setCoords] = useState({ x: 0, y: 0 })

  const cb = useCallback(
    ({ clientX, clientY }) => {
      setCoords({ x: clientX, y: clientY })
    },
    [setCoords]
  )

  useEventListener('mousemove', cb)

  const { x, y } = coords

  return (
    <h1>
      Координаты курсора мыши: {x}, {y}
    </h1>
  )
}
```

## useMemo

Хук `useMemo()` является альтернативой хука `useCallback()`, но принимает любые значения, а не только функции. Данный хук имеет следующую сигнатуру:

```jsx
useMemo(() => {
  fn,
  [deps]
}) // deps - зависимости
```

### Базовый пример

```jsx
const BasicMemo = () => {
  const [age, setAge] = useState(19)

  const handleClick = () => { setAge(age < 100 ? age + 1 : age) }

  const getRandomColor = () => `#${((Math.random() * 0xfff) << 0).toString(16)}`

  const memoizedGetRandomColor = useMemo(() => getRandomColor, [])

  return (
    <>
      <Age age={age} handleClick={handleClick} />
      <Guide getRandomColor={memoizedGetRandomColor} />
    </>
  )
}

const Age = ({ age, handleClick }) => {
  return (
    <div>
      <p>Мне {age} лет.</p>
      <p>Нажми на кнопку 👇</p>
      <button onClick={handleClick}>Стать старше!</button>
    </div>
  )
}

const Guide = memo(({ getRandomColor }) => {
  const color = getRandomColor()

  return (
    <div style={{ background: color, padding: '.4rem' }}>
      <p style={{ color: color, filter: 'invert()' }}>
        Следуй инструкциям максимально точно.
      </p>
    </div>
  )
})

```

### Зависимая мемоизация

```jsx
const DependencyMemo = () => {
  const [age, setAge] = useState(19)

  const handleClick = () => { setAge(age < 100 ? age + 1 : age) }

  const getRandomColor = () => `#${((Math.random() * 0xfff) << 0).toString(16)}`

  const memoizedGetRandomColor = useMemo(() => getRandomColor, [age])

  return (
    <>
      <Age age={age} handleClick={handleClick} />
      <Guide getRandomColor={memoizedGetRandomColor} />
    </>
  )
}

const Age = ({ age, handleClick }) => {
  return (
    <div>
      <p>Мне {age} лет.</p>
      <p>Нажми на кнопку 👇</p>
      <button onClick={handleClick}>Стать старше!</button>
    </div>
  )
}

const Guide = memo(({ getRandomColor }) => {
  const color = getRandomColor()

  return (
    <div style={{ background: color, padding: '.4rem' }}>
      <p style={{ color: color, filter: 'invert()' }}>
        Следуй инструкциям максимально точно.
      </p>
    </div>
  )
})

```

### Более сложный пример

```jsx
const WordsMemo = () => {
  const [count, setCount] = useState(0)
  const [index, setIndex] = useState(0)

  const words = ['hi', 'programming', 'bye', 'real', 'world']
  const word = words[index]

  const getLetterCount = (word) => {
    let i = 0
    while (i < 1e9) i++
    return word.length
  }

  const memoized = useMemo(() => getLetterCount(word), [word])

  return (
    <div style={{ padding: '15px' }}>
      <h2>Вычисление количества букв (медленно 🐌)</h2>
      <p>
        В слове "{word}" {memoized} букв
      </p>
      <button
        onClick={() => {
          const next = index + 1 === words.length ? 0 : index + 1
          setIndex(next)
        }}
      >
        Следующее слово
      </button>

      <h2>Увеличение значения счетчика (быстро ⚡️)</h2>
      <p>Значение счетчика: {count}</p>
      <button onClick={() => setCount(count + 1)}>Увеличить</button>
    </div>
  )
}
```

## useRef

Хук `useRef()` возвращает объект, свойство `current` которого содержит ссылку на узел DOM. Данный хук также может использоваться для сохранения любого мутирующего значения.

Создание хука: `const node = useRef()`.

Добавление ссылки: `<tagName ref={node}></tagName>`.

### Получение доступа к DOM-элементу

```jsx
const DomAccess = () => {
  const textareaEl = useRef(null)

  const handleClick = () => {
    textareaEl.current.value = 'Изучай хуки внимательно! Они не так просты, как кажется'
    textareaEl.current.focus()
  }

  return (
    <>
      <button onClick={handleClick}>Получить сообщение.</button>
      <label htmlFor='message'>
        После нажатия кнопки в поле для ввода текста появится сообщение.
      </label>
      <textarea ref={textareaEl} id='message' />
    </>
  )
}
```

### Запуск и остановка таймера

```jsx
const IntervalRef = () => {
  const [time, setTime] = useState(0)
  const interval = useRef()

  useEffect(() => {
    const id = setInterval(() => {
      setTime((time) => (time = new Date().toLocaleTimeString()))
    }, 1000)

    interval.current = id

    return () => clearInterval(interval.current)
  }, [time])

  return (
    <>
      <p>Текущее время:</p>
      <time>{time}</time>
    </>
  )
}
```

### Несколько ссылок

```jsx
const StringVal = () => {
  const textareaEl = useRef(null)
  const stringVal = useRef('Изучай хуки внимательно! Они не так просты, как кажется')

  const handleClick = () => {
    textareaEl.current.value = stringVal.current
    textareaEl.current.focus()
  }

  return (
    <>
      <button onClick={handleClick}>Получить сообщение.</button>
      <label htmlFor='message'>
        После нажатия кнопки в поле для ввода текста появится сообщение.
      </label>
      <textarea ref={textareaEl} id='message' />
    </>
  )
}
```

### Более сложный пример

```jsx
const ProfileRef = () => {
  const firstNameInput = useRef(null)
  const lastNameInput = useRef(null)

  const [profile, setProfile] = useState({})

  function handleSubmit(e) {
    e.preventDefault()
    setProfile({
      firstName: firstNameInput.current.value,
      lastName: lastNameInput.current.value
    })
  }

  return (
    <>
      <h1>Профиль</h1>
      <form onSubmit={handleSubmit}>
        <input type='text' ref={firstNameInput} name='fistName' /> <br />
        <input type='text' ref={lastNameInput} name='lastName' /> <br />
        <button>Отправить</button>
        <p>
          Имя: {profile?.firstName} <br />
          Фамилия: {profile?.lastName}
        </p>
      </form>
    </>
  )
}
```

## useId

Хук `useId()` предназначен для генерации уникальных идентификаторов, которые остаются стабильными между сервером и клиентом. Это особенно полезно для атрибутов доступности (accessibility), таких как `htmlFor` и `aria-describedby`, где нужно связать элементы по `id`. Не следует использовать `useId()` для генерации ключей в списках.

### Базовый пример

```jsx
const EmailField = () => {
  const id = useId()

  return (
    <>
      <label htmlFor={id}>Email:</label>
      <input id={id} type='email' />
    </>
  )
}
```

### Несколько связанных элементов

```jsx
const SignUpForm = () => {
  const id = useId()

  return (
    <form>
      <label htmlFor={`${id}-email`}>Email:</label>
      <input id={`${id}-email`} type='email' />

      <label htmlFor={`${id}-password`}>Пароль:</label>
      <input
        id={`${id}-password`}
        type='password'
        aria-describedby={`${id}-password-hint`}
      />
      <p id={`${id}-password-hint`}>
        Пароль должен содержать не менее 8 символов.
      </p>
    </form>
  )
}
```

## useTransition

Хук `useTransition()` позволяет обновлять состояние без блокировки пользовательского интерфейса. Он возвращает флаг `isPending`, указывающий на незавершённый переход, и функцию `startTransition` для оборачивания обновлений с низким приоритетом. Это полезно для тяжёлых обновлений, которые не должны блокировать ввод пользователя.

### Базовый пример

```jsx
const TabContainer = () => {
  const [isPending, startTransition] = useTransition()
  const [tab, setTab] = useState('about')

  const selectTab = (nextTab) => {
    startTransition(() => {
      setTab(nextTab)
    })
  }

  return (
    <>
      <button onClick={() => selectTab('about')}>О нас</button>
      <button onClick={() => selectTab('posts')}>Посты</button>
      <button onClick={() => selectTab('contacts')}>Контакты</button>
      {isPending ? <p>Загрузка...</p> : <TabContent tab={tab} />}
    </>
  )
}

const TabContent = ({ tab }) => {
  switch (tab) {
    case 'about':
      return <p>Информация о нас</p>
    case 'posts':
      return <HeavyPostsList />
    case 'contacts':
      return <p>Контактная информация</p>
  }
}
```

### Индикатор загрузки

```jsx
const SearchResults = () => {
  const [isPending, startTransition] = useTransition()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  const handleChange = (e) => {
    const value = e.target.value
    setQuery(value)

    startTransition(() => {
      const filtered = heavyFilterFunction(value)
      setResults(filtered)
    })
  }

  return (
    <>
      <input
        type='text'
        value={query}
        onChange={handleChange}
        placeholder='Поиск...'
      />
      <div style={{ opacity: isPending ? 0.5 : 1 }}>
        <ul>
          {results.map((item) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      </div>
    </>
  )
}
```

## useDeferredValue

Хук `useDeferredValue()` позволяет отложить обновление части интерфейса. Он принимает значение и возвращает его «отложенную» копию, которая обновляется с задержкой. Это полезно, когда обновление одного элемента (например, поля ввода) вызывает тяжёлый перерендеринг другого элемента.

### Базовый пример

```jsx
const SearchPage = () => {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)

  return (
    <>
      <input
        type='text'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder='Введите запрос...'
      />
      <SearchResults query={deferredQuery} />
    </>
  )
}

const SearchResults = memo(({ query }) => {
  const items = filterItems(query) // тяжёлая операция

  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  )
})
```

### С индикатором устаревших данных

```jsx
const DeferredList = () => {
  const [text, setText] = useState('')
  const deferredText = useDeferredValue(text)

  const isStale = text !== deferredText

  return (
    <>
      <input
        type='text'
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div style={{ opacity: isStale ? 0.5 : 1 }}>
        <HeavyList filter={deferredText} />
      </div>
    </>
  )
}
```

## useImperativeHandle

Хук `useImperativeHandle()` позволяет настроить значение, которое передаётся родительскому компоненту при использовании `ref`. Этот хук используется совместно с `forwardRef` для того, чтобы предоставить родителю ограниченный набор методов дочернего компонента вместо полного доступа к DOM-элементу.

### Базовый пример

```jsx
const CustomInput = forwardRef((props, ref) => {
  const inputRef = useRef()

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus()
    },
    clear: () => {
      inputRef.current.value = ''
    }
  }))

  return <input ref={inputRef} {...props} />
})

const Form = () => {
  const inputRef = useRef()

  return (
    <>
      <CustomInput ref={inputRef} placeholder='Введите текст' />
      <button onClick={() => inputRef.current.focus()}>
        Фокус на поле ввода
      </button>
      <button onClick={() => inputRef.current.clear()}>
        Очистить поле
      </button>
    </>
  )
}
```

### Более сложный пример

```jsx
const VideoPlayer = forwardRef((props, ref) => {
  const videoRef = useRef()

  useImperativeHandle(ref, () => ({
    play: () => videoRef.current.play(),
    pause: () => videoRef.current.pause(),
    restart: () => {
      videoRef.current.currentTime = 0
      videoRef.current.play()
    },
    getTime: () => videoRef.current.currentTime
  }))

  return <video ref={videoRef} src={props.src} />
})

const Player = () => {
  const playerRef = useRef()

  return (
    <>
      <VideoPlayer ref={playerRef} src='/video.mp4' />
      <button onClick={() => playerRef.current.play()}>
        Воспроизвести
      </button>
      <button onClick={() => playerRef.current.pause()}>
        Пауза
      </button>
      <button onClick={() => playerRef.current.restart()}>
        Начать сначала
      </button>
    </>
  )
}
```

## useDebugValue

Хук `useDebugValue()` используется для отображения метки (label) в React DevTools рядом с пользовательским хуком. Это помогает при отладке, позволяя увидеть текущее значение кастомного хука прямо в инструментах разработчика. Данный хук не влияет на работу приложения и предназначен исключительно для разработки.

### Базовый пример

```jsx
const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  useDebugValue(isOnline ? 'В сети' : 'Не в сети')

  return isOnline
}

const StatusBar = () => {
  const isOnline = useOnlineStatus()

  return <p>{isOnline ? 'Подключено' : 'Отключено'}</p>
}
```

### Форматирование значения

```jsx
const useFormattedDate = (date) => {
  // Функция форматирования вызывается только при открытии DevTools
  useDebugValue(date, (d) => d.toLocaleDateString('ru-RU'))

  return date.toLocaleDateString('ru-RU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const DateDisplay = () => {
  const formatted = useFormattedDate(new Date())

  return <p>Сегодня: {formatted}</p>
}
```
