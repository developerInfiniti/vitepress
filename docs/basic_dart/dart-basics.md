---
description: "Основы языка Dart: переменные, типы данных, операторы, условия, циклы — быстрый старт для начинающих разработчиков"
---

# Основы Dart

## Инструменты

- SDK: `dart`
- Пакеты: `dart pub`
- Анализатор: `dart analyze`

## Создание проекта

```bash
dart create my_app
cd my_app
dart run
```

## Точка входа

```dart
void main() {
  print('Hello, Dart');
}
```

## Переменные

```dart
var message = 'Hi';
final createdAt = DateTime.now();
const pi = 3.1415926;

int count = 0;
double price = 9.99;
bool isOk = true;
String title = 'Dart';
```

## Управляющие конструкции

```dart
final n = 5;

if (n > 0) {
  print('positive');
} else {
  print('not positive');
}

for (var i = 0; i < 3; i++) {
  print(i);
}

for (final x in [1, 2, 3]) {
  print(x);
}

switch (n) {
  case 0:
    print('zero');
    break;
  default:
    print('non-zero');
}
```

## Импорты

```dart
import 'dart:convert';
import 'dart:io';
```

## Форматирование и анализ

```bash
dart format .
dart analyze
```
