---
title: Регулярные выражения в JavaScript
description: Полное руководство по RegExp — синтаксис, флаги, методы, классы символов, квантификаторы, группы и практические примеры
---

<script setup>
import RegExpTester from '../.vitepress/components/RegExpTester.vue'
</script>

# Регулярные выражения (RegExp) в JavaScript

<RegExpTester />

## 1. Основы — синтаксис и создание

### Два способа создания

```javascript
// 1. Литерал регулярного выражения (компилируется при загрузке скрипта)
const regex1 = /hello/;

// 2. Конструктор RegExp (компилируется в runtime)
const regex2 = new RegExp('hello');

// Конструктор полезен для динамических паттернов
const searchTerm = 'world';
const regex3 = new RegExp(searchTerm, 'gi');
```

### Экранирование спецсимволов

```javascript
// Спецсимволы: . * + ? ^ $ { } [ ] ( ) | \ /
// Их нужно экранировать обратным слэшем

const priceRegex = /\$\d+\.\d{2}/;      // $19.99
const pathRegex = /\/users\/\d+/;         // /users/123

// В конструкторе нужно двойное экранирование
const regex = new RegExp('\\d+\\.\\d{2}');
```

## 2. Флаги

| Флаг | Название | Описание |
|------|----------|----------|
| `g` | global | Поиск всех совпадений, а не только первого |
| `i` | ignoreCase | Регистронезависимый поиск |
| `m` | multiline | `^` и `$` работают для каждой строки |
| `s` | dotAll | `.` соответствует также символу новой строки `\n` |
| `u` | unicode | Полная поддержка Unicode |
| `y` | sticky | Поиск начинается строго с позиции `lastIndex` |

### Примеры использования флагов

```javascript
// g — глобальный поиск
'banana'.match(/a/g);          // ['a', 'a', 'a']
'banana'.match(/a/);           // ['a'] (только первое)

// i — игнорирование регистра
/hello/i.test('Hello World');  // true

// m — многострочный режим
const text = `строка 1
строка 2
строка 3`;
text.match(/^строка/gm);      // ['строка', 'строка', 'строка']
text.match(/^строка/g);       // ['строка'] (только начало всего текста)

// s — dotAll (точка совпадает с \n)
/hello.world/s.test('hello\nworld');  // true
/hello.world/.test('hello\nworld');   // false

// u — Unicode
/\u{1F600}/u.test('😀');      // true
/😀/u.test('😀');              // true

// y — sticky (поиск с конкретной позиции)
const sticky = /\d+/y;
sticky.lastIndex = 4;
sticky.exec('abc 123');        // ['123']
```

## 3. Методы

### Методы RegExp

```javascript
const regex = /\d+/g;
const str = 'Цена: 100 руб, скидка: 20%';

// test() — проверка наличия совпадения (boolean)
/\d+/.test(str);               // true
/xyz/.test(str);               // false

// exec() — детальная информация о совпадении
const result = /(\d+)/.exec(str);
result[0];     // '100'  — полное совпадение
result[1];     // '100'  — первая группа
result.index;  // 6      — позиция совпадения
result.input;  // исходная строка

// exec() с флагом g — итерация по совпадениям
const re = /\d+/g;
let match;
while ((match = re.exec(str)) !== null) {
  console.log(`Найдено: ${match[0]} на позиции ${match.index}`);
}
// Найдено: 100 на позиции 6
// Найдено: 20 на позиции 25
```

### Методы String

```javascript
const str = 'Привет, мир! Привет, JavaScript!';

// match() — массив совпадений
str.match(/Привет/g);          // ['Привет', 'Привет']

// match() без флага g — как exec()
str.match(/(\w+), (\w+)!/);
// ['Привет, мир!', 'Привет', 'мир', index: 0, ...]

// matchAll() — итератор всех совпадений (требует флаг g)
const matches = [...str.matchAll(/Привет/g)];
// [{0: 'Привет', index: 0}, {0: 'Привет', index: 13}]

// replace() — замена первого совпадения
'foo bar foo'.replace(/foo/, 'baz');     // 'baz bar foo'

// replace() с флагом g — замена всех
'foo bar foo'.replace(/foo/g, 'baz');    // 'baz bar baz'

// replace() с функцией обратного вызова
'100 200 300'.replace(/\d+/g, (match) => {
  return Number(match) * 2;
});  // '200 400 600'

// replaceAll() — замена всех (ES2021)
'foo bar foo'.replaceAll('foo', 'baz');  // 'baz bar baz'

// search() — позиция первого совпадения (или -1)
'Hello World'.search(/world/i);          // 6

// split() — разбиение строки по паттерну
'one, two;  three'.split(/[,;]\s*/);     // ['one', 'two', 'three']
'camelCaseText'.split(/(?=[A-Z])/);      // ['camel', 'Case', 'Text']
```

## 4. Классы символов (Character Classes)

```javascript
// \d — цифра [0-9]
'abc123'.match(/\d+/g);       // ['123']

// \D — НЕ цифра [^0-9]
'abc123'.match(/\D+/g);       // ['abc']

// \w — буква, цифра или _ [a-zA-Z0-9_]
'hello_world!'.match(/\w+/g); // ['hello_world']

// \W — НЕ слово [^a-zA-Z0-9_]
'hello world!'.match(/\W+/g); // [' ', '!']

// \s — пробельный символ (пробел, таб, перенос строки)
'hello world'.match(/\s/g);   // [' ']

// \S — НЕ пробельный
'hello world'.match(/\S+/g);  // ['hello', 'world']

// . — любой символ кроме \n (с флагом s — включая \n)
'abc'.match(/./g);            // ['a', 'b', 'c']
```

### Наборы и диапазоны

```javascript
// [abc] — один из символов a, b или c
'cat bat rat'.match(/[cbr]at/g);    // ['cat', 'bat', 'rat']

// [a-z] — диапазон от a до z
'Hello123'.match(/[a-z]+/gi);      // ['Hello']

// [^abc] — любой символ КРОМЕ a, b, c
'hello'.match(/[^aeiou]+/g);       // ['h', 'll']

// Комбинирование диапазонов
/[a-zA-Z0-9_]/;                    // эквивалент \w
/[а-яА-ЯёЁ]/;                     // русские буквы
```

## 5. Квантификаторы (Quantifiers)

```javascript
// * — 0 или более
'aaa'.match(/a*/);             // ['aaa']
'bbb'.match(/a*/);             // [''] (0 совпадений — валидно)

// + — 1 или более
'aaa'.match(/a+/);             // ['aaa']
'bbb'.match(/a+/);             // null

// ? — 0 или 1
'color colour'.match(/colou?r/g);   // ['color', 'colour']

// {n} — ровно n раз
'12345'.match(/\d{3}/);        // ['123']

// {n,} — n или более раз
'12345'.match(/\d{3,}/);       // ['12345']

// {n,m} — от n до m раз
'12345'.match(/\d{2,4}/);      // ['1234']
```

### Жадный vs ленивый режим

```javascript
const html = '<b>жирный</b> и <i>курсив</i>';

// Жадный (по умолчанию) — захватывает максимум
html.match(/<.+>/);            // ['<b>жирный</b> и <i>курсив</i>']

// Ленивый (добавляем ?) — захватывает минимум
html.match(/<.+?>/g);          // ['<b>', '</b>', '<i>', '</i>']

// Ленивые варианты квантификаторов
// *?  +?  ??  {n,m}?
```

## 6. Группы и захват (Groups & Capturing)

### Захватывающие группы

```javascript
// Круглые скобки создают захватывающую группу
const dateRegex = /(\d{4})-(\d{2})-(\d{2})/;
const match = dateRegex.exec('2024-01-15');

match[0];  // '2024-01-15' — полное совпадение
match[1];  // '2024'       — год
match[2];  // '01'         — месяц
match[3];  // '15'         — день
```

### Именованные группы

```javascript
// (?<name>...) — именованная группа
const regex = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
const result = regex.exec('2024-01-15');

result.groups.year;   // '2024'
result.groups.month;  // '01'
result.groups.day;    // '15'

// Деструктуризация
const { groups: { year, month, day } } = regex.exec('2024-01-15');
```

### Обратные ссылки

```javascript
// \1, \2 — ссылка на предыдущую группу
const duplicateWords = /\b(\w+)\s+\1\b/gi;
'Это это дубликат дубликат'.match(duplicateWords);
// ['Это это', 'дубликат дубликат']

// Именованные обратные ссылки \k<name>
/(?<quote>['"])\w+\k<quote>/.test('"hello"');  // true
/(?<quote>['"])\w+\k<quote>/.test('"hello\''); // false
```

### Незахватывающие группы

```javascript
// (?:...) — группировка без захвата
const regex = /(?:https?|ftp):\/\//;
'https://example.com'.match(regex);
// ['https://'] — нет отдельной группы для протокола

// Полезно для альтернатив без лишних групп
/(?:Mr|Mrs|Ms)\.\s(\w+)/.exec('Mr. Smith');
// ['Mr. Smith', 'Smith'] — захвачена только фамилия
```

### Альтернация (OR)

```javascript
// | — оператор "или"
/cat|dog/.test('I have a cat');     // true
/cat|dog/.test('I have a dog');     // true

// Внутри группы
/(red|green|blue) car/.exec('blue car');
// ['blue car', 'blue']
```

## 7. Assertions (Утверждения)

### Якоря

```javascript
// ^ — начало строки (или строки в multiline)
/^Hello/.test('Hello World');      // true
/^Hello/.test('Say Hello');        // false

// $ — конец строки
/World$/.test('Hello World');      // true
/World$/.test('World Hello');      // false

// \b — граница слова
/\bcat\b/.test('cat');             // true
/\bcat\b/.test('category');        // false
/\bcat\b/.test('a cat here');      // true

// \B — НЕ граница слова
/\Bcat\B/.test('concatenate');     // true
/\Bcat\B/.test('cat');             // false
```

### Lookahead и Lookbehind

```javascript
// (?=...) — Positive Lookahead (за ним следует)
/\d+(?= руб)/.exec('Цена 100 руб');       // ['100']
/\d+(?= руб)/.exec('Цена 100 долл');      // null

// (?!...) — Negative Lookahead (за ним НЕ следует)
/\d+(?! руб)/.exec('100 долл');            // ['100']

// (?<=...) — Positive Lookbehind (перед ним стоит)
/(?<=\$)\d+/.exec('Цена $100');            // ['100']

// (?<!...) — Negative Lookbehind (перед ним НЕ стоит)
/(?<!\$)\d+/.exec('100 шт');               // ['100']
```

```javascript
// Практический пример: пароль с lookahead
const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
strongPassword.test('Passw0rd!');   // true
strongPassword.test('password');    // false
strongPassword.test('12345678');    // false
```

## 8. Практические примеры

### Валидация email

```javascript
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

emailRegex.test('user@example.com');     // true
emailRegex.test('user.name+tag@mail.co'); // true
emailRegex.test('invalid@');              // false
emailRegex.test('@no-local.com');         // false
```

### Валидация телефона

```javascript
// Формат: +7 (999) 123-45-67 или 89991234567
const phoneRegex = /^(\+7|8)\s?\(?\d{3}\)?\s?\d{3}[-\s]?\d{2}[-\s]?\d{2}$/;

phoneRegex.test('+7 (999) 123-45-67');   // true
phoneRegex.test('89991234567');           // true
phoneRegex.test('+7 999 123 45 67');     // true
```

### Извлечение данных из URL

```javascript
const urlRegex = /^(?<protocol>https?):\/\/(?<host>[^/:]+)(?::(?<port>\d+))?(?<path>\/[^?#]*)?(?:\?(?<query>[^#]*))?(?:#(?<hash>.*))?$/;

const url = 'https://example.com:8080/path/page?key=value#section';
const { groups } = urlRegex.exec(url);

groups.protocol;  // 'https'
groups.host;      // 'example.com'
groups.port;      // '8080'
groups.path;      // '/path/page'
groups.query;     // 'key=value'
groups.hash;      // 'section'
```

### Работа с HTML-тегами

```javascript
// Извлечение содержимого тегов
const htmlContent = '<h1>Заголовок</h1><p>Текст</p>';
const tagRegex = /<(\w+)>(.*?)<\/\1>/g;

let match;
while ((match = tagRegex.exec(htmlContent)) !== null) {
  console.log(`Тег: ${match[1]}, Содержимое: ${match[2]}`);
}
// Тег: h1, Содержимое: Заголовок
// Тег: p, Содержимое: Текст

// Удаление HTML-тегов
'<b>жирный</b> текст'.replace(/<[^>]+>/g, '');
// 'жирный текст'
```

### Форматирование чисел

```javascript
// Добавление разделителей тысяч
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

formatNumber(1234567);    // '1 234 567'
formatNumber(1000000.50); // '1 000 000.50'
```

### Замена с использованием групп

```javascript
// Переформатирование даты: DD.MM.YYYY → YYYY-MM-DD
'15.01.2024'.replace(
  /(\d{2})\.(\d{2})\.(\d{4})/,
  '$3-$2-$1'
);  // '2024-01-15'

// Маскирование данных
'4111222233334444'.replace(
  /(\d{4})\d{8}(\d{4})/,
  '$1****$2'
);  // '4111****4444'

// CamelCase → kebab-case
'backgroundColor'.replace(
  /([a-z])([A-Z])/g,
  '$1-$2'
).toLowerCase();  // 'background-color'
```

### Удаление дубликатов слов

```javascript
function removeDuplicateWords(str) {
  return str.replace(/\b(\w+)(\s+\1)+\b/gi, '$1');
}

removeDuplicateWords('это это тест тест тест');
// 'это тест'
```

### Проверка сложности пароля

```javascript
function checkPasswordStrength(password) {
  const checks = {
    length:    password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    digit:     /\d/.test(password),
    special:   /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password),
  };

  const score = Object.values(checks).filter(Boolean).length;
  const levels = ['очень слабый', 'слабый', 'средний', 'хороший', 'сильный', 'отличный'];

  return { score, level: levels[score], checks };
}

checkPasswordStrength('MyP@ss1!');
// { score: 5, level: 'отличный', checks: {...} }
```

## Шпаргалка

| Синтаксис | Описание |
|-----------|----------|
| `.` | Любой символ (кроме `\n`) |
| `\d` / `\D` | Цифра / не цифра |
| `\w` / `\W` | Слово / не слово |
| `\s` / `\S` | Пробел / не пробел |
| `\b` / `\B` | Граница слова / не граница |
| `[abc]` | Один из символов |
| `[^abc]` | Любой кроме указанных |
| `[a-z]` | Диапазон символов |
| `*` / `+` / `?` | 0+, 1+, 0 или 1 |
| `{n}` / `{n,m}` | Ровно n / от n до m |
| `^` / `$` | Начало / конец строки |
| `(...)` | Захватывающая группа |
| `(?:...)` | Незахватывающая группа |
| `(?=...)` / `(?!...)` | Lookahead / Negative Lookahead |
| `(?<=...)` / `(?<!...)` | Lookbehind / Negative Lookbehind |
| `\|` | Альтернация (ИЛИ) |
