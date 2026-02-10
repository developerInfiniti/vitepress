# Функции

## Обычная функция и стрелочная запись

```dart
int add(int a, int b) {
  return a + b;
}

int add2(int a, int b) => a + b;
```

## Опциональные позиционные параметры

```dart
String join(String a, [String? b]) {
  return b == null ? a : '$a$b';
}
```

## Именованные параметры

```dart
String greet(String name, {String prefix = 'Hello'}) {
  return '$prefix, $name';
}
```

## Обязательные именованные параметры

```dart
class User {
  final String id;
  final String name;

  User({required this.id, required this.name});
}
```

## Функции как значения

```dart
int twice(int x) => x * 2;

final numbers = [1, 2, 3].map(twice).toList();
final numbers2 = [1, 2, 3].map((x) => x * 2).toList();
```

## Generics

```dart
T firstOrDefault<T>(List<T> items, T fallback) {
  return items.isEmpty ? fallback : items.first;
}

final x = firstOrDefault<int>([], 10);
```
