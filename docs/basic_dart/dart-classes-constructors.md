# Классы и конструкторы

## Поля и конструктор

```dart
class User {
  final String id;
  String name;

  User(this.id, this.name);
}
```

## Именованные параметры и `required`

```dart
class User {
  final String id;
  final String name;

  const User({required this.id, required this.name});
}
```

## Именованные конструкторы

```dart
class User {
  final String id;
  final String name;

  const User({required this.id, required this.name});

  const User.guest()
      : id = 'guest',
        name = 'Guest';
}
```

## Инициализатор (initializer list)

```dart
class Rectangle {
  final int width;
  final int height;
  final int area;

  Rectangle(this.width, this.height) : area = width * height;
}
```

## `factory` конструктор

```dart
class Point {
  final int x;
  final int y;

  const Point(this.x, this.y);

  factory Point.origin() => const Point(0, 0);
}
```

## Getters и setters

```dart
class Counter {
  int _value = 0;

  int get value => _value;

  set value(int next) {
    if (next < 0) {
      throw Exception('value must be >= 0');
    }
    _value = next;
  }
}
```

## `static` поля и методы

```dart
class MathX {
  static const int ten = 10;
  static int doubleIt(int x) => x * 2;
}
```

## `toString`

```dart
class User {
  final String id;
  final String name;

  const User({required this.id, required this.name});

  @override
  String toString() => 'User(id: $id, name: $name)';
}
```
