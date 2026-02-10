# Dart: вопросы на собеседовании (Core)

## Что такое `var`, `final`, `const`?

- `var` выводит тип из значения и дальше тип фиксируется
- `final` присваивается один раз во время выполнения
- `const` — compile-time константа

```dart
var a = 1;
final now = DateTime.now();
const pi = 3.1415926;
```

## Что такое null safety?

В Dart значения по умолчанию non-nullable. Nullable тип обозначается через `?`.

```dart
String? maybeName;
final name = maybeName ?? 'Guest';
```

## Для чего нужны `?.`, `??`, `??=`, `!`?

```dart
String? s;
final len = s?.length;
final value = s ?? 'default';
int? count;
count ??= 0;
final sure = s!;
```

- `?.` безопасный доступ
- `??` значение по умолчанию
- `??=` присваивание по умолчанию
- `!` утверждение, что значение не `null`

## `dynamic` vs `Object` vs `Object?`

```dart
dynamic a = 1;
a = 'text';

Object b = 1;
b = 'text';

Object? c = null;
c = 1;
```

- `dynamic` отключает проверку типов при обращениях
- `Object` общий базовый тип для значений (кроме `null`)
- `Object?` включает `null`

## `==` и `identical`

- `==` можно перегружать (обычно для value-объектов)
- `identical(a, b)` проверяет, один ли это объект в памяти

```dart
final a = [1, 2];
final b = [1, 2];

final eq = a == b;
final same = identical(a, b);
```

## Как сделать value equality?

Переопределить `==` и `hashCode`.

```dart
class Point {
  final int x;
  final int y;

  const Point(this.x, this.y);

  @override
  bool operator ==(Object other) {
    return other is Point && other.x == x && other.y == y;
  }

  @override
  int get hashCode => Object.hash(x, y);
}
```

## `late` и когда он нужен?

`late` полезен, когда инициализация откладывается, но вы гарантируете присваивание до первого чтения.

```dart
late final String token;

void init(String value) {
  token = value;
}
```

## `is` и `as`

```dart
Object value = 'hello';

if (value is String) {
  print(value.length);
}

final s = value as String;
```

- `is` проверяет тип и делает умное приведение внутри блока
- `as` делает явное приведение (бросает исключение, если тип не подходит)

## `List`, `Set`, `Map`: где что использовать?

- `List` — упорядоченная коллекция с доступом по индексу
- `Set` — уникальные значения
- `Map` — ключ → значение

```dart
final list = <int>[1, 2, 3];
final set = <int>{1, 2, 2};
final map = <String, int>{'a': 1};
```

## Каскадные вызовы `..`

```dart
final buffer = StringBuffer()
  ..write('a')
  ..write('b')
  ..write('c');
```

## Что такое extension и когда удобно?

Добавляет методы/геттеры к существующему типу без наследования.

```dart
extension StringX on String {
  bool get isBlank => trim().isEmpty;
}
```

## Что такое record (Dart 3)?

Быстрый способ вернуть несколько значений без создания класса.

```dart
({int id, String name}) user() => (id: 1, name: 'Ada');

final u = user();
final id = u.id;
```

## Как работает `dart pub`?

- `pubspec.yaml` описывает зависимости
- `dart pub get` устанавливает зависимости
- `dart pub add <pkg>` добавляет зависимость

```bash
dart pub add http
dart pub add --dev test
dart pub get
```
