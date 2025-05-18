---
title: Промисы и асинхронность
description: Работа с асинхронным кодом в JavaScript
---

# Асинхронное программирование в JavaScript

## 1. Промисы (Promises)

### Создание промиса
```javascript
const promise = new Promise((resolve, reject) => {
  // Асинхронная операция
  setTimeout(() => {
    const random = Math.random();
    if (random > 0.5) {
      resolve("Успех!");
    } else {
      reject("Ошибка!");
    }
  }, 1000);
});
```

### Обработка промисов
```javascript
promise
  .then(result => {
    console.log(result);
  })
  .catch(error => {
    console.error(error);
  })
  .finally(() => {
    console.log("Завершено");
  });
```

## 2. Async/Await

### Асинхронные функции
```javascript
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Ошибка при получении данных:', error);
  }
}
```

### Параллельное выполнение
```javascript
async function fetchMultipleData() {
  const results = await Promise.all([
    fetch('https://api.example.com/users'),
    fetch('https://api.example.com/posts'),
    fetch('https://api.example.com/comments')
  ]);
  
  const data = await Promise.all(results.map(r => r.json()));
  return data;
}
```

## 3. Обработка ошибок

### Try-Catch с async/await
```javascript
async function handleErrors() {
  try {
    const data = await fetchData();
    console.log(data);
  } catch (error) {
    console.error('Произошла ошибка:', error);
  }
}
```

### Цепочка промисов
```javascript
fetchUser(1)
  .then(user => fetchUserPosts(user.id))
  .then(posts => fetchPostComments(posts[0].id))
  .catch(error => {
    console.error('Ошибка в цепочке:', error);
  });
```