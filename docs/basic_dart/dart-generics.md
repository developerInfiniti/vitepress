# Generics

## Обобщенные функции

```dart
T firstOrDefault<T>(List<T> items, T fallback) {
  return items.isEmpty ? fallback : items.first;
}

final a = firstOrDefault<int>([], 10);
final b = firstOrDefault<String>(['x'], 'fallback');
```

## Обобщенные классы

```dart
class Box<T> {
  final T value;
  const Box(this.value);
}

final intBox = Box<int>(1);
final strBox = Box('hello');
```

## Ограничения на тип (`extends`)

```dart
num sumAll<T extends num>(List<T> items) {
  return items.fold<num>(0, (acc, x) => acc + x);
}

final s = sumAll<int>([1, 2, 3]);
```

## Generic методы в коллекциях

```dart
final xs = <int>[1, 2, 3];
final ys = xs.map<String>((x) => 'n=$x').toList();
```

## Зачем generics на собеседовании

- меньше `as` и runtime-ошибок
- лучше автодополнение и проверка типов
- полезно для коллекций, репозиториев, DTO, утилит
