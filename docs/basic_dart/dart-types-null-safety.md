# Типы и null safety

## Примитивные типы

```dart
int count = 1;
double price = 9.99;
bool ok = true;
String name = 'Ada';
```

## var, dynamic, Object?

```dart
var a = 1;

dynamic b = 1;
b = 'now string';

Object? c = 1;
c = 'string';
c = null;
```

- `var` выводит тип из значения и дальше тип фиксируется
- `dynamic` отключает проверку типов при обращениях
- `Object?` позволяет хранить любое значение, включая `null`, но без “магии” `dynamic`

## Nullable типы

```dart
String? maybeName;
int? maybeAge;
```

## Операторы ?., ??, ??=, !

```dart
String? input;
final len = input?.length;

final name = input ?? 'Guest';

int? count;
count ??= 0;

String? s;
final sure = s!;
```

## Late

```dart
late final String token;

void init() {
  token = 'abc';
}
```

`late` удобно, когда значение точно будет присвоено до использования, но не в момент объявления.

## Сравнение и приведение

```dart
Object value = 'hello';

if (value is String) {
  print(value.toUpperCase());
}

final maybeString = value as String;
```

## Enum

```dart
enum Status {
  idle,
  loading,
  success,
  error,
}
```
