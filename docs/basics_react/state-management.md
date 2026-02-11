# Управление состоянием в React

[Скачать PDF](./state-management.pdf)

## Введение в управление состоянием

Управление состоянием — это одна из ключевых концепций в React-приложениях. Состояние представляет собой данные, которые могут изменяться со временем и влиять на поведение и отображение компонентов.

## Локальное состояние компонента

### useState

Хук `useState` — самый простой способ добавить локальное состояние в функциональный компонент.

```jsx
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Счетчик: {count}</p>
      <button onClick={() => setCount(count + 1)}>Увеличить</button>
    </div>
  );
}
```

### Состояние в классовых компонентах

В классовых компонентах состояние инициализируется в конструкторе и обновляется с помощью метода `setState()`.

```jsx
import React, { Component } from 'react';

class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  render() {
    return (
      <div>
        <p>Счетчик: {this.state.count}</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Увеличить
        </button>
      </div>
    );
  }
}
```

## Подъем состояния (Lifting State Up)

Когда несколько компонентов должны отражать одни и те же изменяющиеся данные, рекомендуется поднимать общее состояние до ближайшего общего предка.

```jsx
function TemperatureInput(props) {
  return (
    <fieldset>
      <legend>Введите температуру в {props.scale}:</legend>
      <input
        value={props.temperature}
        onChange={(e) => props.onTemperatureChange(e.target.value)} />
    </fieldset>
  );
}

function Calculator() {
  const [temperature, setTemperature] = useState('');
  const [scale, setScale] = useState('c');

  function handleCelsiusChange(temperature) {
    setScale('c');
    setTemperature(temperature);
  }

  function handleFahrenheitChange(temperature) {
    setScale('f');
    setTemperature(temperature);
  }

  const celsius = scale === 'f' ? tryConvert(temperature, toCelsius) : temperature;
  const fahrenheit = scale === 'c' ? tryConvert(temperature, toFahrenheit) : temperature;

  return (
    <div>
      <TemperatureInput
        scale="c"
        temperature={celsius}
        onTemperatureChange={handleCelsiusChange} />
      <TemperatureInput
        scale="f"
        temperature={fahrenheit}
        onTemperatureChange={handleFahrenheitChange} />
    </div>
  );
}
```

## Управление состоянием с помощью useReducer

Хук `useReducer` предоставляет альтернативу `useState` для управления сложным состоянием с множеством подзначений или когда следующее состояние зависит от предыдущего.

```jsx
import React, { useReducer } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <div>
      <p>Счетчик: {state.count}</p>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
    </div>
  );
}
```

## Контекст (Context API)

Контекст предоставляет способ передачи данных через дерево компонентов без необходимости передавать props вручную на каждом уровне.

```jsx
import React, { createContext, useContext, useState } from 'react';

// Создаем контекст
const ThemeContext = createContext();

function App() {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Toolbar />
      <Content />
    </ThemeContext.Provider>
  );
}

function Toolbar() {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <div>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Переключить тему
      </button>
    </div>
  );
}

function Content() {
  const { theme } = useContext(ThemeContext);

  return (
    <div className={theme === 'light' ? 'light-theme' : 'dark-theme'}>
      Содержимое с темой: {theme}
    </div>
  );
}
```

## Внешние библиотеки управления состоянием

### Redux

Redux — популярная библиотека для управления состоянием в JavaScript-приложениях. Она предлагает предсказуемый контейнер состояния с четкими ограничениями на то, как и когда обновления могут происходить.

Основные принципы Redux:
1. Единственный источник истины: состояние всего приложения хранится в дереве объектов внутри одного хранилища (store).
2. Состояние только для чтения: единственный способ изменить состояние — отправить действие (action).
3. Изменения производятся с помощью чистых функций: редьюсеры (reducers) — это чистые функции, которые принимают предыдущее состояние и действие, и возвращают новое состояние.

```jsx
import { createStore } from 'redux';

// Редьюсер
function counterReducer(state = { count: 0 }, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    default:
      return state;
  }
}

// Создание хранилища
const store = createStore(counterReducer);

// Подписка на изменения
store.subscribe(() => console.log(store.getState()));

// Отправка действий
store.dispatch({ type: 'INCREMENT' }); // { count: 1 }
store.dispatch({ type: 'INCREMENT' }); // { count: 2 }
store.dispatch({ type: 'DECREMENT' }); // { count: 1 }
```

### MobX

MobX — это библиотека, которая делает управление состоянием простым и масштабируемым, применяя принципы реактивного программирования.

```jsx
import React from 'react';
import { makeAutoObservable } from 'mobx';
import { observer } from 'mobx-react';

// Хранилище состояния
class CounterStore {
  count = 0;

  constructor() {
    makeAutoObservable(this);
  }

  increment() {
    this.count++;
  }

  decrement() {
    this.count--;
  }
}

const counterStore = new CounterStore();

// Компонент-наблюдатель
const Counter = observer(() => {
  return (
    <div>
      <p>Счетчик: {counterStore.count}</p>
      <button onClick={() => counterStore.decrement()}>-</button>
      <button onClick={() => counterStore.increment()}>+</button>
    </div>
  );
});
```

### Recoil

Recoil — это библиотека управления состоянием для React, разработанная Facebook, которая обеспечивает направленный граф отношений между состояниями.

```jsx
import React from 'react';
import { atom, useRecoilState, RecoilRoot } from 'recoil';

// Определение атома (единицы состояния)
const countState = atom({
  key: 'countState',
  default: 0,
});

function Counter() {
  const [count, setCount] = useRecoilState(countState);

  return (
    <div>
      <p>Счетчик: {count}</p>
      <button onClick={() => setCount(count - 1)}>-</button>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
}

function App() {
  return (
    <RecoilRoot>
      <Counter />
    </RecoilRoot>
  );
}
```

## Серверное состояние (Server State) и кеширование данных

Во многих приложениях самая сложная часть — это не UI-состояние (открыт ли модал, выбран ли таб), а данные, которые приходят с сервера: загрузка, кеширование, повторные запросы, обновления, отмена запросов, синхронизация между вкладками и т.д. Это часто называют *server state*.

Практическое правило:
- **UI-состояние** храните в `useState` / `useReducer` / Context.
- **Серверные данные** удобнее держать в специализированных решениях для запросов и кеша (например, TanStack Query / SWR), а не в Redux “вручную”.

### TanStack Query (React Query): базовая идея

```jsx
import { useQuery } from '@tanstack/react-query'

function Users() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await fetch('/api/users')
      if (!res.ok) throw new Error('Request failed')
      return res.json()
    }
  })

  if (isLoading) return 'Loading...'
  if (error) return 'Error'

  return (
    <div>
      <button onClick={() => refetch()}>Refresh</button>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
```

Что это дает:
- кеш на уровне приложения (и часто между экранами);
- автоматические состояния `loading / error / success`;
- инвалидация кеша после мутаций и повторные запросы по правилам;
- дедупликация одинаковых запросов и “умный” рефетч.

### Когда нужен Redux / Zustand, а когда — Query-кеш

- **Redux / Zustand** хороши, когда у вас много *клиентского* состояния и бизнес-логики на стороне фронтенда (например, сложные формы, конфигураторы, офлайн-редактирование, глобальные UI-настройки).
- **Query-кеш** хорош для “источника истины на сервере”: списки, карточки, профили, справочники — все, что приходит по API и должно быть согласовано.

## Заключение

Выбор подхода к управлению состоянием зависит от размера и сложности вашего приложения:

- Для небольших приложений или компонентов с изолированным состоянием, `useState` и `useReducer` обычно достаточно.
- Для средних приложений с общим состоянием между несколькими компонентами, Context API может быть хорошим решением.
- Для крупных приложений со сложной логикой состояния, внешние библиотеки, такие как Redux, MobX или Recoil, могут предложить более структурированный и масштабируемый подход.

Важно помнить, что не существует универсального решения, и часто лучшим подходом является комбинация различных техник управления состоянием в зависимости от конкретных потребностей вашего приложения.
