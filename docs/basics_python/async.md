---
title: Асинхронное программирование в Python
description: async/await и библиотека asyncio в Python
---

# Асинхронное программирование в Python

## Что такое asyncio?

`asyncio` — стандартная библиотека Python для написания асинхронного кода с использованием синтаксиса `async`/`await`. Позволяет эффективно обрабатывать I/O-операции без многопоточности.

## Основы async/await

```python
import asyncio

async def fetch_data():
    print("Начинаю загрузку...")
    await asyncio.sleep(2)  # имитация I/O операции
    print("Данные загружены!")
    return {"data": [1, 2, 3]}

async def main():
    result = await fetch_data()
    print(result)

asyncio.run(main())
```

## Параллельное выполнение задач

### asyncio.gather

```python
import asyncio

async def fetch_user(user_id):
    await asyncio.sleep(1)
    return {"id": user_id, "name": f"User {user_id}"}

async def main():
    # Запуск нескольких корутин параллельно
    users = await asyncio.gather(
        fetch_user(1),
        fetch_user(2),
        fetch_user(3),
    )
    for user in users:
        print(user)

asyncio.run(main())
# Все 3 запроса выполнены за ~1 секунду, а не за 3
```

### asyncio.create_task

```python
async def main():
    # Создание задач для параллельного выполнения
    task1 = asyncio.create_task(fetch_user(1))
    task2 = asyncio.create_task(fetch_user(2))

    user1 = await task1
    user2 = await task2
    print(user1, user2)
```

## Таймауты

```python
async def slow_operation():
    await asyncio.sleep(10)
    return "Готово"

async def main():
    try:
        result = await asyncio.wait_for(slow_operation(), timeout=3.0)
    except asyncio.TimeoutError:
        print("Операция превысила таймаут!")

asyncio.run(main())
```

## Асинхронные итераторы

```python
class AsyncRange:
    def __init__(self, start, stop):
        self.current = start
        self.stop = stop

    def __aiter__(self):
        return self

    async def __anext__(self):
        if self.current >= self.stop:
            raise StopAsyncIteration
        await asyncio.sleep(0.1)
        value = self.current
        self.current += 1
        return value

async def main():
    async for num in AsyncRange(0, 5):
        print(num)

asyncio.run(main())
```

## Асинхронные генераторы

```python
async def async_counter(n):
    for i in range(n):
        await asyncio.sleep(0.5)
        yield i

async def main():
    async for value in async_counter(5):
        print(value)

asyncio.run(main())
```

## Асинхронные менеджеры контекста

```python
class AsyncConnection:
    async def __aenter__(self):
        print("Подключение...")
        await asyncio.sleep(0.5)
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        print("Отключение...")
        await asyncio.sleep(0.5)

    async def query(self, sql):
        await asyncio.sleep(0.3)
        return f"Результат: {sql}"

async def main():
    async with AsyncConnection() as conn:
        result = await conn.query("SELECT * FROM users")
        print(result)

asyncio.run(main())
```

## Семафоры — ограничение параллелизма

```python
async def fetch_url(semaphore, url):
    async with semaphore:
        print(f"Загрузка {url}")
        await asyncio.sleep(1)
        return f"Данные с {url}"

async def main():
    semaphore = asyncio.Semaphore(3)  # максимум 3 одновременных запроса
    urls = [f"https://example.com/{i}" for i in range(10)]

    tasks = [fetch_url(semaphore, url) for url in urls]
    results = await asyncio.gather(*tasks)
    print(f"Загружено {len(results)} страниц")

asyncio.run(main())
```

## aiohttp — асинхронные HTTP-запросы

```python
import aiohttp
import asyncio

async def fetch(session, url):
    async with session.get(url) as response:
        return await response.json()

async def main():
    async with aiohttp.ClientSession() as session:
        data = await fetch(session, "https://api.example.com/data")
        print(data)

asyncio.run(main())
```
