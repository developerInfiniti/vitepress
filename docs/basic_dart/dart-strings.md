---
description: "Строки в Dart: интерполяция, методы обработки, RegExp, многострочные строки — работа с текстовыми данными"
---

# Строки

## Строковые литералы и интерполяция

```dart
final name = 'Ada';
final s1 = 'Hello, $name';
final s2 = '2 + 2 = ${2 + 2}';
```

## Многострочные строки

```dart
final text = '''
line 1
line 2
''';
```

## Raw строки

```dart
final path = r'C:\temp\file.txt';
```

## Полезные методы

```dart
final s = '  Dart  ';

final trimmed = s.trim();
final upper = s.toUpperCase();
final lower = s.toLowerCase();
final parts = s.split(' ');
final has = s.contains('ar');
final starts = s.startsWith(' ');
final ends = s.endsWith(' ');
```

## StringBuffer

Если нужно собирать большую строку из кусочков, `StringBuffer` обычно эффективнее, чем много конкатенаций.

```dart
final b = StringBuffer()
  ..write('Hello')
  ..write(', ')
  ..write('Dart');

final out = b.toString();
```

## RegExp

```dart
final re = RegExp(r'^\w+@\w+\.\w+$');
final ok = re.hasMatch('a@b.com');
```

```dart
final re = RegExp(r'\d+');
final input = 'id=123';
final match = re.firstMatch(input);
final value = match?.group(0);
```
