# Dart: вопросы на собеседовании (ООП и язык)

## Class, abstract class, implements, extends: что выбирать?

- `class`: обычный класс
- `abstract class`: нельзя создать напрямую, можно описать контракт и/или базовую реализацию
- `extends`: наследование реализации
- `implements`: реализуете интерфейс, обязаны переопределить всё

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

## Mixin: зачем нужен?

Mixin добавляет поведение без наследования и без необходимости создавать отдельный объект-композицию.

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

## Конструкторы: обычный, именованный, factory, const

```dart
class User {
  final String id;
  final String name;

  const User(this.id, this.name);

  const User.guest()
      : id = 'guest',
        name = 'Guest';

  factory User.fromMap(Map<String, Object?> map) {
    final id = map['id'] as String;
    final name = map['name'] as String;
    return User(id, name);
  }
}
```

- `const` конструктор позволяет создавать compile-time константы, если поля тоже `final` и значения константные
- `factory` может вернуть кешированный объект или объект другого класса

## Иммутабельность и `copyWith`

Типичный паттерн для состояния.

```dart
class Profile {
  final String name;
  final int age;

  const Profile({required this.name, required this.age});

  Profile copyWith({String? name, int? age}) {
    return Profile(
      name: name ?? this.name,
      age: age ?? this.age,
    );
  }
}
```

## Generics: что часто спрашивают?

- зачем нужны (типобезопасность без кастов)
- как ограничивать типы

```dart
T firstOrDefault<T>(List<T> items, T fallback) {
  return items.isEmpty ? fallback : items.first;
}

class Box<T> {
  final T value;
  const Box(this.value);
}
```

## `typedef` и alias функций

```dart
typedef IntMapper = int Function(int);

int apply(int x, IntMapper mapper) => mapper(x);
```

## `sealed` / `base` / `interface` (Dart 3): что это?

Если спросят, обычно ожидают идею:

- `sealed`: все подтипы должны быть объявлены в том же файле, удобно для исчерпывающих проверок
- `base`: ограничивает наследование/реализацию за пределами пакета
- `interface`: запрещает наследование реализации, только контракт (внешне похоже на `implements`)

## Pattern matching (Dart 3): базовая идея

```dart
String classify(Object value) {
  return switch (value) {
    int _ => 'int',
    String _ => 'string',
    _ => 'other',
  };
}
```

## Исключения: когда `throw`, когда `Error`?

- `Exception` обычно для ожидаемых ошибок домена/ввода/сети
- `Error` чаще про программные ошибки (неправильные инварианты), в приложениях их обычно не используют как часть логики

```dart
Never fail(String message) {
  throw Exception(message);
}
```
