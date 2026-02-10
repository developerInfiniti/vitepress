# ООП: классы, наследование, миксины, extensions

## Класс и конструкторы

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
```

## Именованные конструкторы и factory

```dart
class Point {
  final int x;
  final int y;

  const Point(this.x, this.y);

  factory Point.origin() => const Point(0, 0);
}
```

## Наследование

```dart
class Animal {
  final String name;

  Animal(this.name);

  void speak() {
    print('...');
  }
}

class Dog extends Animal {
  Dog(super.name);

  @override
  void speak() {
    print('woof');
  }
}
```

## Абстрактные классы и implements

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
```

## Mixins

```dart
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

## Extensions

```dart
extension StringX on String {
  bool get isBlank => trim().isEmpty;
}

final ok = '  '.isBlank;
```
