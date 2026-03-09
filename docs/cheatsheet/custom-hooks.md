---
sidebar_position: 15
title: Примеры кастомных хуков React
description: Примеры кастомных хуков React
keywords: ['javascript', 'js', 'react.js', 'reactjs', 'react', 'custom hooks', 'hooks', 'cheatsheet', 'справочник', 'кастомные хуки', 'пользовательские хуки', 'хуки']
tags: ['javascript', 'js', 'react.js', 'reactjs', 'react', 'custom hooks', 'hooks', 'cheatsheet', 'справочник', 'кастомные хуки', 'пользовательские хуки', 'хуки']
---

# React Custom Hooks

## useBeforeUnload

Данный хук позволяет выполнять колбеки перед закрытием (перезагрузкой) страницы:

```js
import { useEffect } from 'react'

export default function useBeforeUnload(cb) {
  // обратите внимание: функция `cb` должна быть мемоизирована
  useEffect(() => {
    window.addEventListener('beforeunload', cb)
    return () => {
      window.removeEventListener('beforeunload', cb)
    }
  }, [cb])
}
```

## useClick

Данные хуки позволяют запускать коллбэки при клике внутри или за пределами целевого элемента:

```js
import { useEffect } from 'react'

// обратите внимание: функция `cb` должна быть мемоизирована
export const useClickInside = (ref, cb) => {
  useEffect(() => {
    const onClick = ({ target }) => {
      if (ref.current?.contains(target)) {
        cb()
      }
    }
    document.addEventListener('click', onClick)
    return () => {
      document.removeEventListener('click', onClick)
    }
  }, [cb])
}

export const useClickOutside = (ref, cb) => {
  useEffect(() => {
    const onClick = ({ target }) => {
      if (ref.current && !ref.current.contains(target)) {
        cb()
      }
    }
    document.addEventListener('click', onClick)
    return () => {
      document.removeEventListener('click', onClick)
    }
  }, [cb])
}

// пример использования
const containerStyles = {
  height: '100vh',
  display: 'flex',
  justifyContent: 'space-evenly',
  alignItems: 'center'
}

const wrapperStyles = {
  display: 'inherit',
  flexDirection: 'column',
  alignItems: 'center'
}

const boxStyles = {
  display: 'grid',
  placeItems: 'center',
  width: '100px',
  height: '100px',
  borderRadius: '4px',
  boxShadow: '0 1px 2px rgba(0,0,0,.3)',
  color: '#f0f0f0',
  userSelect: 'none'
}

const textStyles = {
  userSelect: 'none',
  color: '#3c3c3c'
}

export function App() {
  const insideRef = useRef(null)
  const outsideRef = useRef(null)
  const [insideCount, setInsideCount] = useState(0)
  const [outsideCount, setOutsideCount] = useState(0)

  const insideCb = useCallback(() => {
    setInsideCount((c) => c + 1)
  }, [])

  const outsideCb = useCallback(() => {
    setOutsideCount((c) => c + 1)
  }, [])

  useClickInside(insideRef, insideCb)

  useClickOutside(outsideRef, outsideCb)

  return (
    <div style={containerStyles}>
      <div style={wrapperStyles}>
        <div
          style={{ ...boxStyles, background: 'deepskyblue' }}
          ref={insideRef}
        >
          Inside
        </div>
        <p style={textStyles}>Count: {insideCount}</p>
      </div>
      <div style={wrapperStyles}>
        <div
          style={{ ...boxStyles, background: 'mediumseagreen' }}
          ref={outsideRef}
        >
          Outside
        </div>
        <p style={textStyles}>Count: {outsideCount}</p>
      </div>
    </div>
  )
}
```

## useEventListener

Данный хук позволяет регистрировать обработчики событий на целевом элементе:

```js
import { useEffect } from 'react'

export function useEventListener(ev, cb, el = window) {
  // обратите внимание: функция `cb` должна быть мемоизирована
  useEffect(() => {
    const handle = (e) => cb(e)
    el.addEventListener(ev, handle)
    return () => {
      el.removeEventListener(ev, handle)
    }
  }, [ev, cb, el])
}

// пример использования
export function App() {
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
      Mouse coords: {x}, {y}
    </h1>
  )
}
```

## useFetch

Хук для выполнения кешируемых `HTTP-запросов` с помощью `Fetch API`:

```js
import { useState, useRef } from 'react'

export function useFetch(url, options) {
  const [isLoading, setLoading] = useState(true)
  const [response, setResponse] = useState(null)
  const [error, setError] = useState(null)
  const cache = useRef({})

  useEffect(() => {
    async function fetchData() {
      if (cache.current[url]) {
        const data = cache.current[url]
        setResponse(data)
      } else {
        try {
          const response = await fetch(url, options)
          const json = await response.json()
          cache.current[url] = json
          setResponse(json)
        } catch (error) {
          setError(error)
        }
      }

      setLoading(false)
    }

    fetchData()
  }, [url, options])

  return { isLoading, response, error }
}
```

## useHover

Хук для обработки наведения курсора на целевой элемент:

```js
import { useState, useEffect, useRef } from 'react'

export function useHover(target, onEnter, onLeave) {
  const [isHovered, setHovered] = useState(false)

  useEffect(() => {
    const handleEnter = (e) => {
      setHovered(true)
      if (onEnter) {
        onEnter(e)
      }
    }
    const onLeave = (e) => {
      setHovered(false)
      if (onLeave) {
        onLeave(e)
      }
    }

    target.addEventListener('pointerenter', handleEnter)
    target.addEventListener('pointerleave', handleLeave)

    return () => {
      target.removeEventListener('pointerenter', handleEnter)
      target.removeEventListener('pointerleave', handleLeave)
    }
  }, [target, cb])

  return isHovered
}

// пример использования
export function App() {
  const targetRef = useRef()
  const isHovered = useHover(targetRef.current)

  return <div ref={targetRef}>{isHovered ? '😊' : '😢'}</div>
}
```

## useKeyPress

Хук для обработки нажатия клавиш клавиатуры:

```js
import { useState, useEffect } from 'react'

export function useKeyPress(target) {
  const [isPressed, setPressed] = useState(false)

  useEffect(() => {
    const handleDown = ({ key }) => {
      if (key === target) {
        setPressed(true)
      }
    }

    const handleUp = ({ key }) => {
      if (key === target) {
        setPressed(false)
      }
    }

    window.addEventListener('keydown', handleDown)
    window.addEventListener('keyup', handleUp)

    return () => {
      window.removeEventListener('keydown', handleDown)
      window.removeEventListener('keyup', handleUp)
    }
  }, [target])

  return isPressed
}

// пример использования
function App() {
  const happy = useKeyPress('h')
  const sad = useKeyPress('s')

  return (
    <>
      <div>h, s</div>
      <div>
        {happy && '😊'}
        {sad && '😢'}
      </div>
    </>
  )
}
```

## useLocalStorage

Хук для получения и записи значений в локальное хранилище:

```js
import { useState, useEffect } from 'react'

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const item = window.localStorage.getItem(key)
    return item ? JSON.parse(item) : initialValue
  })

  useEffect(() => {
    const item = JSON.stringify(value)
    window.localStorage.setItem(key, item)
    // eslint-disable-next-line
  }, [value])

  return [value, setValue]
}
```

## useDisableScroll

Хук для отключения прокрутки страницы, например, при вызове модального окна:

```js
import { useLayoutEffect } from 'react'
// другой кастомный хук, см. ниже
import { useStyle } from './useStyle'

export function useDisableScroll() {
  const [, setOverflow] = useStyle('overflow')

  useLayoutEffect(() => {
    setOverflow('hidden')

    return () => {
      setOverflow('auto')
    }
  }, [])
}
```

## useOnScreen

Хук для определения отображения элемента на экране:

```js
import { useEffect } from 'react'

export const useOnScreen = (target, options) => {
  const [isIntersecting, setIntersecting] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIntersecting(entry.isIntersecting)
      },
      options
    )
    observer.observe(target)
    return () => observer.unobserve(target)
  }, [])

  return isIntersecting
}
```

## usePortal

Хук для создания порталов:

```js
import { useRef, useEffect } from 'react'

function createRoot(id) {
  const root = document.createElement('div')
  root.setAttribute('id', id)
  return root
}

function addRoot(root) {
  document.body.insertAdjacentElement('beforeend', root)
}

export function usePortal(id) {
  const rootRef = useRef(null)

  useEffect(
    function setupElement() {
      const existingParent = document.getElementById(id)
      const parent = existingParent || createRoot(id)

      if (!existingParent) {
        addRoot(parent)
      }

      parent.appendChild(rootRef.current)

      return () => {
        rootRef.current.remove()
        if (!parent.childElementCount) {
          parent.remove()
        }
      }
    },
    [id]
  )

  function getRoot() {
    if (!rootRef.current) {
      rootRef.current = document.createElement('div')
    }
    return rootRef.current
  }

  return getRoot()
}
```

## usePrevious

Хук для сохранения значения из предыдущего рендеринга:

```js
import { useEffect, useRef } from 'react'

export const usePrevious = (val) => {
  const ref = useRef()
  useEffect(() => {
    ref.current = val
  })
  return ref.current
}
```

## useStyle

Хук для получения и изменения стилей целевого элемента:

```js
import { useState, useEffect } from 'react'

export function useStyle(prop, $ = document.body) {
  const [value, setValue] = useState(getComputedStyle($).getPropertyValue(prop))

  useEffect(() => {
    $.style.setProperty(prop, value)
  }, [value])

  return [value, setValue]
}

// пример использования
export function App() {
  // другой кастомный хук, см. ниже
  const { width, height } = useWindowSize()
  const [color, setColor] = useStyle('color')
  const [fontSize, setFontSize] = useStyle('font-size')

  // имитация медиа запросов
  useEffect(() => {
    if (width > 1024) {
      setColor('green')
      setFontSize('2em')
    } else if (width > 768) {
      setColor('blue')
      setFontSize('1.5em')
    } else {
      setColor('red')
      setFontSize('1em')
    }
  }, [width])

  return (
    <>
      <h1>
        Window size: {width}, {height}
      </h1>
      <h2>Color: {color}</h2>
      <h3>Font size: {fontSize}</h3>
    </>
  )
}
```

## useTimer

Хуки-обертки для `setTimeout()` и `setInterval()`:

```js
import { useEffect, useRef } from 'react'

export function useTimeout(cb, ms) {
  useEffect(() => {
    const id = setTimeout(cb, ms)
    return () => clearTimeout(id)
  }, [cb, ms])
}

export function useInterval(cb, ms) {
  useEffect(() => {
    const id = setInterval(cb, ms)
    return () => clearInterval(id)
  }, [cb, ms])
}
```

## useWindowSize

Хук для получение размеров области просмотра:

```js
import { useState, useEffect } from 'react'

export default function useWindowSize() {
  const [size, setSize] = useState({
    width: 0,
    height: 0,
  })

  useEffect(() => {
    function onResize() {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
    onResize()

    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return size
}

// пример использования
export default function App() {
  const { width, height } = useWindowSize()
  // другой кастомный хук
  const [color, setColor] = useStyle('color')
  const [fontSize, setFontSize] = useStyle('font-size')

  useEffect(() => {
    if (width > 1024) {
      setColor('green')
      setFontSize('2em')
    } else if (width > 768) {
      setColor('blue')
      setFontSize('1.5em')
    } else {
      setColor('red')
      setFontSize('1em')
    }
  }, [width])

  return (
    <>
      <h1>
        Window size: {width}, {height}
      </h1>
      <h2>Color: {color}</h2>
      <h3>Font size: {fontSize}</h3>
    </>
  )
}
```

## useCopyToClipboard

Хук для копирования текста в буфер обмена:

```js
import { useState, useEffect } from 'react'

export const useCopyToClipboard = (resetTime) => {
  const [copied, setCopied] = useState(false)

  const copy = async (text) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
  }

  useEffect(() => {
    if (!(resetTime && copied)) return
    const id = setTimeout(() => {
      setCopied(false)
    }, resetTime)
    return () => clearTimeout(id)
  }, [])

  return [copied, copy]
}
```

## useMutationObserver

```js
import { useState, useEffect } from 'react'
import { debounce } from 'lodash'

const DEFAULT_OPTIONS = {
  config: { attributes: true, childList: true, subtree: true },
  debounceTime: 0
}

export const useMutationObserver = (
  target,
  callback,
  options = DEFAULT_OPTIONS
) => {
  const [observer, setObserver] = useState(null)

  useEffect(() => {
    if (!callback || typeof callback !== 'function') {
      return
    }
    const { debounceTime } = options
    const observer = new MutationObserver(
      debounceTime > 0 ? debounce(callback, debounceTime) : callback
    )
    setObserver(observer)
  }, [callback, options, setObserver])

  useEffect(() => {
    if (!observer || !target) return
    const { config } = options
    try {
      observer.observe(target, config)
    } catch (e) {
      console.error(e)
    }
    return () => {
      if (observer) {
        observer.disconnect()
      }
    }
  }, [observer, target, options])
}
```

## useIntersectionObserver

Расширенная версия хука `useOnScreen`:

```ts
import { useEffect, useRef, useState } from 'react'

export default function useIntersectionObserver(
  target: HTMLElement,
  options?: IntersectionObserverInit,
) {
  const [state, setState] = useState({
    isIntersecting: false,
    ratio: 0,
    width: 0,
    height: 0,
  })

  const observerRef = useRef<IntersectionObserver>(
    new IntersectionObserver(([entry]) => {
      setState((prevState) => ({
        ...prevState,
        isIntersecting: entry.isIntersecting,
        ratio: Math.round(entry.intersectionRatio),
        width: Math.round(entry.intersectionRect.width),
        height: Math.round(entry.intersectionRect.height),
      }))
    }, options),
  )

  useEffect(() => {
    observerRef.current.observe(target)
    return () => observerRef.current.unobserve(target)
  }, [])

  const unobserve = () => {
    observerRef.current.unobserve(target)
  }

  return [state, unobserve] as const
}
```

## useScript

Хук для добавления элемента `script` в тело документа:

```js
import { useState, useEffect } from 'react'

const useScript = (src) => {
  const [status, setStatus] = useState(src ? 'loading' : 'idle')

  useEffect(() => {
    if (!src) {
      setStatus('idle')
      return
    }

    let script = document.querySelector(`script[src="${src}"]`)

    if (!script) {
      script = document.createElement('script')
      script.src = src
      script.async = true
      script.setAttribute('data-status', 'loading')
      document.body.appendChild(script)

      const setDataStatus = (event) => {
        script.setAttribute(
          'data-status',
          event.type === 'load' ? 'ready' : 'error'
        )
      }
      script.addEventListener('load', setDataStatus)
      script.addEventListener('error', setDataStatus)
    } else {
      setStatus(script.getAttribute('data-status'))
    }

    const setStateStatus = (event) => {
      setStatus(event.type === 'load' ? 'ready' : 'error')
    }

    script.addEventListener('load', setStateStatus)
    script.addEventListener('error', setStateStatus)

    return () => {
      if (script) {
        script.removeEventListener('load', setStateStatus)
        script.removeEventListener('error', setStateStatus)
      }
    }
  }, [src])

  return status
}
```

## useSSR

Хук для определения среды выполнения кода (клиент или сервер):

```js
import { useState, useEffect } from 'react'

const isDOMavailable = typeof document !== 'undefined'

const useSSR = () => {
  const [inBrowser, setInBrowser] = useState(isDOMavailable)

  useEffect(() => {
    setInBrowser(isDOMavailable)
    return () => setInBrowser(false)
  }, [])

  return {
    isBrowser: inBrowser,
    isServer: !inBrowser,
    canUseWorkers: typeof Worker !== 'undefined',
    canUseEventListeners: inBrowser && Boolean(window.addEventListener),
    canUseViewport: inBrowser && Boolean(window.screen)
  }
}
```

## useUpdateEffect

Хук, пропускающий выполнение побочного эффекта при первом рендеринге компонента:

```ts
import { useEffect, useRef } from 'react'

export default function useUpdateEffect(
  cb: React.EffectCallback,
  deps: any[] = []
) {
  const firstRender = useRef(true)

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    cb()
  }, deps)
}
```

## useDeepEffect

Хук, выполняющий побочный эффект только при изменении зависимостей-объектов и опционально пропускающий выполнение эффекта при первом рендеринге компонента:

```ts
import { useEffect, useRef } from 'react'
import usePrevious from './usePrevious'
import { equal } from '@my-js/utils'

export default function useDeepEffect(
  cb: React.EffectCallback,
  deps: any[] = [],
  runOnFirstRender = true
) {
  const prevDeps = usePrevious(deps)
  const firstRender = useRef(true)

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      if (runOnFirstRender) {
        cb()
      }
      return
    }

    if (!equal(deps, prevDeps)) {
      cb()
    }
  }, deps)
}
```
