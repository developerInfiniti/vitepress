---
title: Web Storage в JavaScript
description: Полное руководство по localStorage, sessionStorage и IndexedDB — хранение данных в браузере, безопасность и практические примеры
---

# Web Storage в JavaScript

## 1. Обзор — localStorage vs sessionStorage vs IndexedDB

| Свойство | localStorage | sessionStorage | IndexedDB |
|----------|-------------|----------------|-----------|
| Объём | ~5-10 MB | ~5-10 MB | Сотни MB+ |
| Время жизни | Без ограничения | До закрытия вкладки | Без ограничения |
| Доступность | Все вкладки домена | Только текущая вкладка | Все вкладки домена |
| API | Синхронный | Синхронный | Асинхронный |
| Тип данных | Только строки | Только строки | Любые (включая Blob, File) |
| Индексы | Нет | Нет | Да |
| Транзакции | Нет | Нет | Да |

### Когда что использовать

```javascript
// localStorage — пользовательские настройки, темы, токены
// Данные, которые нужны после перезапуска браузера
localStorage.setItem('theme', 'dark');

// sessionStorage — одноразовые данные сессии
// Данные формы, состояние страницы, временные фильтры
sessionStorage.setItem('formStep', '2');

// IndexedDB — большие объёмы данных, файлы, офлайн-кеш
// Кеш API-ответов, локальные базы, файловые хранилища
```

## 2. localStorage

### Основные методы

```javascript
// Запись
localStorage.setItem('username', 'Иван');
localStorage.setItem('age', '25');

// Чтение
const username = localStorage.getItem('username');  // 'Иван'
const missing = localStorage.getItem('nonexist');   // null

// Удаление одного ключа
localStorage.removeItem('age');

// Очистка всего хранилища
localStorage.clear();

// Количество ключей
localStorage.length;  // число

// Получение ключа по индексу
localStorage.key(0);  // имя первого ключа
```

### Работа с объектами и массивами

```javascript
// localStorage хранит ТОЛЬКО строки
// Объекты нужно сериализовать

// Запись объекта
const user = { name: 'Иван', age: 25, roles: ['admin', 'user'] };
localStorage.setItem('user', JSON.stringify(user));

// Чтение объекта
const stored = JSON.parse(localStorage.getItem('user'));
console.log(stored.name);  // 'Иван'

// Безопасное чтение
function getFromStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

const settings = getFromStorage('settings', { theme: 'light' });
```

### Перебор всех данных

```javascript
// Через цикл
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  const value = localStorage.getItem(key);
  console.log(`${key}: ${value}`);
}

// Через Object.keys
const keys = Object.keys(localStorage);
keys.forEach(key => {
  console.log(`${key}: ${localStorage.getItem(key)}`);
});
```

### Событие storage

```javascript
// Срабатывает в ДРУГИХ вкладках того же домена
// НЕ срабатывает в текущей вкладке
window.addEventListener('storage', (event) => {
  console.log('Ключ:', event.key);
  console.log('Старое значение:', event.oldValue);
  console.log('Новое значение:', event.newValue);
  console.log('URL:', event.url);
  console.log('Хранилище:', event.storageArea);

  // event.key === null означает clear()
});
```

## 3. sessionStorage

### Отличия от localStorage

```javascript
// sessionStorage работает так же, как localStorage
// НО данные живут только в рамках текущей вкладки

sessionStorage.setItem('step', '3');
sessionStorage.getItem('step');      // '3'
sessionStorage.removeItem('step');
sessionStorage.clear();

// Особенности:
// - Новая вкладка = новое хранилище
// - Дубликат вкладки (Ctrl+Shift+K) — копирует данные
// - Закрытие вкладки — данные удаляются
// - Перезагрузка страницы — данные СОХРАНЯЮТСЯ
```

### Практическое использование

```javascript
// Сохранение данных формы при навигации
function saveFormState(formId) {
  const form = document.getElementById(formId);
  const data = new FormData(form);
  const formState = {};

  for (const [key, value] of data.entries()) {
    formState[key] = value;
  }

  sessionStorage.setItem(`form_${formId}`, JSON.stringify(formState));
}

// Восстановление при возврате на страницу
function restoreFormState(formId) {
  const saved = sessionStorage.getItem(`form_${formId}`);
  if (!saved) return;

  const formState = JSON.parse(saved);
  const form = document.getElementById(formId);

  for (const [key, value] of Object.entries(formState)) {
    const field = form.querySelector(`[name="${key}"]`);
    if (field) field.value = value;
  }
}
```

## 4. Безопасность

### Уязвимости и риски

```javascript
// НЕ храните в localStorage:
// - Пароли
// - Данные кредитных карт
// - JWT access tokens (спорно, но лучше httpOnly cookie)
// - Персональные данные (ПДн)

// Причины:
// 1. XSS — любой скрипт на странице имеет полный доступ
// 2. Нет шифрования — данные видны в DevTools
// 3. Нет expiration — данные живут вечно
```

### Защита данных

```javascript
// Обфускация (НЕ шифрование, но затрудняет чтение)
function encodeValue(value) {
  return btoa(encodeURIComponent(JSON.stringify(value)));
}

function decodeValue(encoded) {
  try {
    return JSON.parse(decodeURIComponent(atob(encoded)));
  } catch {
    return null;
  }
}

localStorage.setItem('data', encodeValue({ token: 'secret' }));
const data = decodeValue(localStorage.getItem('data'));
```

### Проверка доступности

```javascript
function isStorageAvailable(type) {
  try {
    const storage = window[type];
    const testKey = '__storage_test__';
    storage.setItem(testKey, '1');
    storage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

if (isStorageAvailable('localStorage')) {
  // Безопасно использовать
} else {
  // Fallback — cookies или in-memory
}
```

### Квота и обработка переполнения

```javascript
function safeSetItem(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      console.warn('Хранилище переполнено');
      // Стратегии:
      // 1. Удалить старые данные
      // 2. Сжать данные
      // 3. Использовать IndexedDB
      return false;
    }
    throw error;
  }
}
```

## 5. Практические примеры

### Менеджер тем (Dark/Light mode)

```javascript
class ThemeManager {
  static KEY = 'app_theme';

  static get() {
    return localStorage.getItem(ThemeManager.KEY) || 'light';
  }

  static set(theme) {
    localStorage.setItem(ThemeManager.KEY, theme);
    document.documentElement.setAttribute('data-theme', theme);
  }

  static toggle() {
    const current = ThemeManager.get();
    ThemeManager.set(current === 'light' ? 'dark' : 'light');
  }

  static init() {
    // Приоритет: сохранённая → системная
    const saved = ThemeManager.get();
    const system = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';

    ThemeManager.set(saved || system);
  }
}

ThemeManager.init();
```

### Кеширование API-ответов

```javascript
class ApiCache {
  static get(key, maxAge = 5 * 60 * 1000) {
    const cached = localStorage.getItem(`cache_${key}`);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);

    // Проверяем срок годности
    if (Date.now() - timestamp > maxAge) {
      localStorage.removeItem(`cache_${key}`);
      return null;
    }

    return data;
  }

  static set(key, data) {
    const entry = { data, timestamp: Date.now() };
    safeSetItem(`cache_${key}`, JSON.stringify(entry));
  }
}

// Использование
async function getUsers() {
  const cached = ApiCache.get('users');
  if (cached) return cached;

  const response = await fetch('/api/users');
  const users = await response.json();

  ApiCache.set('users', users);
  return users;
}
```

### Корзина покупок

```javascript
class Cart {
  static KEY = 'shopping_cart';

  static getItems() {
    return JSON.parse(localStorage.getItem(Cart.KEY) || '[]');
  }

  static addItem(product) {
    const items = Cart.getItems();
    const existing = items.find(item => item.id === product.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      items.push({ ...product, quantity: 1 });
    }

    localStorage.setItem(Cart.KEY, JSON.stringify(items));
  }

  static removeItem(productId) {
    const items = Cart.getItems().filter(item => item.id !== productId);
    localStorage.setItem(Cart.KEY, JSON.stringify(items));
  }

  static getTotal() {
    return Cart.getItems().reduce(
      (sum, item) => sum + item.price * item.quantity, 0
    );
  }

  static clear() {
    localStorage.removeItem(Cart.KEY);
  }
}
```

### Хранение с TTL (время жизни)

```javascript
class StorageWithTTL {
  static set(key, value, ttlMs) {
    const entry = {
      value,
      expires: Date.now() + ttlMs,
    };
    localStorage.setItem(key, JSON.stringify(entry));
  }

  static get(key) {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    const entry = JSON.parse(raw);
    if (Date.now() > entry.expires) {
      localStorage.removeItem(key);
      return null;
    }

    return entry.value;
  }
}

// Хранить 1 час
StorageWithTTL.set('token', 'abc123', 60 * 60 * 1000);

// Через час вернёт null
StorageWithTTL.get('token');
```

## 6. Ограничения

### Размер хранилища

```javascript
// Проверка использованного объёма
function getStorageSize() {
  let total = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);
    total += key.length + value.length;
  }
  // Размер в KB (UTF-16 = 2 байта на символ)
  return (total * 2) / 1024;
}

console.log(`Использовано: ${getStorageSize().toFixed(2)} KB`);
```

### Основные ограничения

- **Только строки** — объекты требуют JSON.stringify/parse
- **Синхронный API** — блокирует основной поток при больших данных
- **~5-10 MB** — лимит зависит от браузера
- **Нет индексов/запросов** — только key-value
- **Не работает в Web Workers** — доступен только из основного потока
- **Приватный режим** — может быть ограничен или отключён
- **Общий для домена** — конфликты между приложениями на одном домене

### Когда перейти на IndexedDB

```javascript
// Используйте IndexedDB когда:
// - Данные > 5 MB
// - Нужны индексы и поиск
// - Нужно хранить бинарные данные (Blob, File)
// - Нужны транзакции
// - Работа из Web Worker

// Базовый пример IndexedDB
const request = indexedDB.open('myDB', 1);

request.onupgradeneeded = (event) => {
  const db = event.target.result;
  const store = db.createObjectStore('users', { keyPath: 'id' });
  store.createIndex('name', 'name', { unique: false });
};

request.onsuccess = (event) => {
  const db = event.target.result;

  // Запись
  const tx = db.transaction('users', 'readwrite');
  tx.objectStore('users').add({ id: 1, name: 'Иван', age: 25 });

  // Чтение
  const readTx = db.transaction('users', 'readonly');
  const getRequest = readTx.objectStore('users').get(1);
  getRequest.onsuccess = () => console.log(getRequest.result);
};
```

## Справочник

```javascript
// localStorage
localStorage.setItem('key', 'value');       // Записать
localStorage.getItem('key');                // Прочитать
localStorage.removeItem('key');             // Удалить
localStorage.clear();                       // Очистить всё
localStorage.length;                        // Количество ключей

// sessionStorage — те же методы
sessionStorage.setItem('key', 'value');

// Объекты
localStorage.setItem('obj', JSON.stringify(data));
JSON.parse(localStorage.getItem('obj'));

// Событие изменений (другие вкладки)
window.addEventListener('storage', handler);
```
