# Pattern matching (Dart 3)

## `switch` expression

```dart
String classify(Object value) {
  return switch (value) {
    int _ => 'int',
    String _ => 'string',
    bool _ => 'bool',
    _ => 'other',
  };
}
```

## Деструктуризация records

```dart
({int id, String name}) user() => (id: 1, name: 'Ada');

void main() {
  final (:id, :name) = user();
  print('$id $name');
}
```

## List pattern

```dart
String head(List<int> xs) {
  return switch (xs) {
    [final first, ...] => 'first=$first',
    [] => 'empty',
  };
}
```

## Map pattern

```dart
String readUser(Map<String, Object?> json) {
  return switch (json) {
    {'id': final int id, 'name': final String name} => '$id:$name',
    _ => 'invalid',
  };
}
```

## Guards (`when`)

```dart
String sign(int n) {
  return switch (n) {
    final x when x > 0 => 'positive',
    0 => 'zero',
    _ => 'negative',
  };
}
```

## Когда это полезно

- парсинг JSON без цепочек `if` и кастов
- исчерпывающая обработка вариантов (особенно вместе с `sealed`)
- удобная обработка списков/records
