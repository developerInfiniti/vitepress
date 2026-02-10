# Импорты и пакеты

## Импорты SDK

```dart
import 'dart:async';
import 'dart:convert';
import 'dart:io';
```

## Импорт пакетов

```dart
import 'package:test/test.dart';
```

## Префиксы

```dart
import 'dart:convert' as convert;

void main() {
  final s = convert.jsonEncode({'a': 1});
  print(s);
}
```

## `show` / `hide`

```dart
import 'dart:math' show Random;
import 'dart:math' hide pi;
```

## Относительные импорты внутри проекта

```dart
import '../src/user.dart';
```

## `pubspec.yaml`: базовая структура

```yaml
name: my_app
description: A sample Dart project
version: 1.0.0

environment:
  sdk: ^3.0.0

dependencies:
  http: ^1.2.0

dev_dependencies:
  lints: ^5.0.0
  test: ^1.25.0
```

## Команды `dart pub`

```bash
dart pub add http
dart pub add --dev test
dart pub get
dart pub outdated
dart pub upgrade
```

## Пакет vs библиотека vs приложение

- package: единица публикации, включает `pubspec.yaml`
- library: набор исходников, обычно экспортируется через `lib/`
- application: исполняемый код, обычно в `bin/`
