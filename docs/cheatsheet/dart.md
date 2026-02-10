---
sidebar_position: 36
title: Шпаргалка по Dart
description: Шпаргалка по Dart
keywords: ['dart', 'flutter', 'cheatsheet', 'шпаргалка']
tags: ['dart', 'flutter', 'cheatsheet', 'шпаргалка']
---

# Dart

> [Dart](https://dart.dev/) — язык программирования, который используется как для серверной разработки, так и как основной язык фреймворка [Flutter](https://flutter.dev/) для кроссплатформенной разработки.

## Запуск

_Проверить версию_

```bash
dart --version
```

_Запустить файл_

```bash
dart run bin/main.dart
```

_Запустить пакет (если в проекте есть `pubspec.yaml`)_

```bash
dart run
```

## Проект и пакеты

_Создать проект_

```bash
dart create my_app
cd my_app
```

_Добавить зависимости_

```bash
dart pub add http
dart pub add --dev lints test
```

_Обновить зависимости_

```bash
dart pub get
```

## Точка входа

```dart
void main() {
  print('Hello, Dart');
}
```

## Переменные

```dart
var name = 'Ada';
final createdAt = DateTime.now();
const pi = 3.1415926;

int count = 0;
double price = 9.99;
bool isOk = true;
String title = 'Dart';

dynamic anything = 123;
anything = 'now string';
```

_Особенности_

- `final` вычисляется один раз во время выполнения
- `const` — compile-time константа
- `dynamic` отключает статическую типизацию для значения

## Null safety

```dart
String? maybeName;

String name = maybeName ?? 'Guest';

String? input;
final len = input?.length;

int? a;
a ??= 10;

String? s;
final sure = s!;
```

_Ключевые операторы_

- `T?` — nullable тип
- `?.` — безопасный доступ
- `??` — значение по умолчанию
- `??=` — присваивание по умолчанию
- `!` — утверждение, что значение не `null`

## Строки

```dart
final s = 'Dart';
final multiline = '''
line 1
line 2
''';

final interp = 'Hello, $s';
final calc = '2 + 2 = ${2 + 2}';
```

## Условия и циклы

```dart
final n = 5;

if (n > 0) {
  print('positive');
} else if (n == 0) {
  print('zero');
} else {
  print('negative');
}

switch (n) {
  case 0:
    print('zero');
    break;
  default:
    print('non-zero');
}

for (var i = 0; i < 3; i++) {
  print(i);
}

for (final x in [1, 2, 3]) {
  print(x);
}

while (count < 3) {
  count++;
}
```

## Функции

```dart
int add(int a, int b) => a + b;

String greet(String name, {String prefix = 'Hello'}) {
  return '$prefix, $name';
}

String join(String a, [String? b]) {
  return b == null ? a : '$a$b';
}
```

_Параметры_

- позиционные обязательные: `(a, b)`
- позиционные опциональные: `([b])`
- именованные (обычно для опций): `({prefix})`

## Коллекции

```dart
final list = <int>[1, 2, 3];
final set = <String>{'a', 'b'};
final map = <String, int>{'a': 1, 'b': 2};

final copy = [...list, 4, 5];
final maybeList = <int>[...list, if (n > 0) n];
final generated = <int>[for (var i = 0; i < 3; i++) i * 10];
```

## Классы

```dart
class User {
  final String id;
  String name;

  User(this.id, this.name);

  User.guest()
      : id = 'guest',
        name = 'Guest';

  String get label => '$name ($id)';
}

final u = User('1', 'Ada');
print(u.label);
```

## Наследование, интерфейсы и миксины

```dart
abstract class Storage {
  Future<void> save(String key, String value);
  Future<String?> read(String key);
}

class MemoryStorage implements Storage {
  final _data = <String, String>{};

  @override
  Future<void> save(String key, String value) async {
    _data[key] = value;
  }

  @override
  Future<String?> read(String key) async {
    return _data[key];
  }
}

mixin Logger {
  void log(String message) {
    print(message);
  }
}

class Service with Logger {
  void run() {
    log('running');
  }
}
```

## Расширения (extensions)

```dart
extension StringX on String {
  bool get isBlank => trim().isEmpty;
}

print('  '.isBlank);
```

## Асинхронность: Future

```dart
Future<int> fetchCount() async {
  await Future.delayed(const Duration(milliseconds: 50));
  return 42;
}

Future<void> main() async {
  final count = await fetchCount();
  print(count);
}
```

## Асинхронность: Stream

```dart
Stream<int> ticks() async* {
  for (var i = 0; i < 3; i++) {
    await Future.delayed(const Duration(milliseconds: 50));
    yield i;
  }
}

Future<void> main() async {
  await for (final t in ticks()) {
    print(t);
  }
}
```

## Records (Dart 3)

```dart
({int id, String name}) user() {
  return (id: 1, name: 'Ada');
}

final u = user();
print(u.id);
print(u.name);
```

## Полезные команды

```bash
dart analyze
dart format .
dart test
```
