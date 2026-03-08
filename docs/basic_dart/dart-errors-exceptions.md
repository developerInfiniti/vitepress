---
description: "Обработка ошибок и исключений в Dart: try-catch-finally, custom exceptions, Error vs Exception"
---

# Ошибки и исключения

## `Exception` vs `Error`

- `Exception` обычно используют для ожидаемых ошибок (валидация, сеть, бизнес-правила)
- `Error` чаще про программные ошибки (нарушение инвариантов), как часть логики приложения обычно не используется

```dart
void validateAge(int age) {
  if (age < 0) {
    throw Exception('Age must be >= 0');
  }
}
```

## `throw`, `rethrow`

```dart
void parse(String input) {
  try {
    final x = int.parse(input);
    print(x);
  } catch (e) {
    throw Exception('Invalid number: $input');
  }
}
```

`rethrow` сохраняет исходный стек вызовов.

```dart
Future<void> run() async {
  try {
    await Future<void>.error(Exception('fail'));
  } catch (e) {
    rethrow;
  }
}
```

## `try / catch / finally`

```dart
Future<void> load() async {
  try {
    await Future<void>.delayed(const Duration(milliseconds: 10));
  } catch (e) {
    print('error: $e');
  } finally {
    print('cleanup');
  }
}
```

## Свои типы исключений

```dart
class ValidationException implements Exception {
  final String message;
  const ValidationException(this.message);

  @override
  String toString() => 'ValidationException: $message';
}

void validateEmail(String email) {
  if (!email.contains('@')) {
    throw const ValidationException('Email is invalid');
  }
}
```

## `on` для фильтра по типу

```dart
void run() {
  try {
    throw const FormatException('bad');
  } on FormatException catch (e) {
    print(e.message);
  } catch (e) {
    print(e);
  }
}
```

## `Future` ошибки и unhandled exceptions

Ошибки из `Future` попадают в `catch` только если вы:

- `await` этот `Future`
- или вызвали `.catchError(...)`

```dart
Future<void> bad() async {
  throw Exception('boom');
}

Future<void> main() async {
  try {
    await bad();
  } catch (e) {
    print(e);
  }
}
```
