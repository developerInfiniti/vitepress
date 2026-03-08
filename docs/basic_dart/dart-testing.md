---
description: "Тестирование в Dart: unit тесты, group, setUp/tearDown, моки — написание надёжных тестов с примерами"
---

# Тестирование в Dart

## Юнит-тесты (package:test)

Обычно в проектах используют пакет `test`.

_Добавить_

```bash
dart pub add --dev test
```

_Запустить_

```bash
dart test
```

## Пример теста

```dart
import 'package:test/test.dart';

int add(int a, int b) => a + b;

void main() {
  test('adds numbers', () {
    expect(add(2, 2), 4);
  });
}
```

## Группы и setUp/tearDown

```dart
import 'package:test/test.dart';

void main() {
  late List<int> xs;

  setUp(() {
    xs = [];
  });

  tearDown(() {
    xs.clear();
  });

  group('list', () {
    test('starts empty', () {
      expect(xs, isEmpty);
    });

    test('can add', () {
      xs.add(1);
      expect(xs, [1]);
    });
  });
}
```

## Тесты async

```dart
import 'package:test/test.dart';

Future<int> fetch() async => 1;

void main() {
  test('async test', () async {
    final x = await fetch();
    expect(x, 1);
  });
}
```

## Matchers, которые часто используют

- `equals(x)` / просто `x`
- `isNull`, `isNotNull`
- `isA<T>()`
- `throwsA(...)`

```dart
import 'package:test/test.dart';

void main() {
  test('throws', () {
    expect(() => throw Exception('fail'), throwsA(isA<Exception>()));
  });
}
```
