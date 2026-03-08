---
title: Vue Lifecycle Component - Интерактивная демонстрация
description: Интерактивный компонент для изучения lifecycle hooks Vue 3 с наглядными логами и примерами кода.
---

<script setup>
import LifecycleDemo from '../.vitepress/components/LifecycleDemo.vue'
</script>

# Vue Lifecycle Component

Интерактивный компонент, демонстрирующий работу lifecycle hooks, watchers и реактивности Vue 3.

## Живая демонстрация

<LifecycleDemo />

> Взаимодействуйте с компонентом и наблюдайте за логами справа. Каждое событие lifecycle и watcher записывается в реальном времени.

## Какие хуки используются

### onBeforeMount / onMounted

```js
onBeforeMount(() => {
  addLog('onBeforeMount: компонент готовится к монтированию')
})

onMounted(() => {
  addLog('onMounted: компонент смонтирован в DOM')
  // Здесь безопасно работать с DOM и запускать таймеры
  aliveInterval = setInterval(() => {
    secondsAlive.value++
  }, 1000)
})
```

`onBeforeMount` вызывается **до** вставки в DOM -- DOM ещё недоступен.
`onMounted` вызывается **после** -- здесь можно обращаться к DOM-элементам, запускать таймеры, подписываться на события.

### onUpdated

```js
onUpdated(() => {
  addLog('onUpdated: компонент обновился в DOM')
})
```

Срабатывает каждый раз, когда реактивные данные изменились и DOM перерисовался.

### onBeforeUnmount / onUnmounted

```js
onBeforeUnmount(() => {
  addLog('onBeforeUnmount: компонент готовится к размонтированию')
})

onUnmounted(() => {
  // Очистка ресурсов: таймеры, подписки, обработчики
  if (timer.value) clearInterval(timer.value)
  if (aliveInterval) clearInterval(aliveInterval)
})
```

Критически важны для **очистки ресурсов**. Без них утечки памяти неизбежны при использовании `setInterval`, `addEventListener`, WebSocket и т.д.

## Watchers в компоненте

### watch -- явное отслеживание

```js
watch(count, (newVal, oldVal) => {
  addLog(`watch(count): ${oldVal} -> ${newVal}`)
})

watch(step, (newVal) => {
  addLog(`watch(step): шаг изменён на ${newVal}`)
})
```

`watch` следит за конкретным ref или computed и вызывается только при его изменении.

### watchEffect -- автоматическое отслеживание

```js
watchEffect(() => {
  if (count.value > 0 && count.value % 10 === 0) {
    addLog(`watchEffect: count кратен 10! (${count.value})`)
  }
})
```

`watchEffect` автоматически определяет зависимости внутри функции и перезапускается при их изменении.

## Порядок вызова хуков

```
setup()                 -- выполняется первым
onBeforeMount()         -- DOM ещё не создан
onMounted()             -- DOM готов
  -- при изменении данных --
onBeforeUpdate()        -- перед обновлением DOM
onUpdated()             -- DOM обновлён
  -- при удалении компонента --
onBeforeUnmount()       -- компонент ещё в DOM
onUnmounted()           -- компонент удалён из DOM
```

## Паттерн очистки ресурсов

Компонент демонстрирует правильный паттерн работы с таймерами:

```js
// Создаём ресурс в onMounted
onMounted(() => {
  interval = setInterval(callback, 1000)
})

// Очищаем в onUnmounted
onUnmounted(() => {
  clearInterval(interval)
})
```

Это применимо к любым побочным эффектам:
- `setInterval` / `setTimeout`
- `addEventListener` / `removeEventListener`
- WebSocket соединения
- Подписки на store (Pinia, Vuex)
- AbortController для fetch-запросов

## Тестирование компонента

Тесты расположены в `docs/.vitepress/components/__tests__/LifecycleDemo.spec.ts` и покрывают:

| Тест | Что проверяет |
|------|---------------|
| Рендеринг | Начальное значение счётчика = 0 |
| Инкремент/Декремент | Кнопки изменяют значение на шаг |
| Сброс | Счётчик возвращается к 0 |
| Lifecycle логи | onBeforeMount и onMounted логируются |
| Watch логи | Изменение count записывает watch-событие |
| Очистка логов | Кнопка "Очистить" работает |
| Автоинкремент | Таймер увеличивает значение каждую секунду |
| Очистка при unmount | Интервалы очищаются при размонтировании |
| Время жизни | Секундомер корректно считает |

### Запуск тестов

```bash
npx vitest run docs/.vitepress/components/__tests__/LifecycleDemo.spec.ts
```
