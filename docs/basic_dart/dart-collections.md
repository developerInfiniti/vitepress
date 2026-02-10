# Коллекции

## List

```dart
final list = <int>[1, 2, 3];
final copy = [...list, 4, 5];
final filtered = list.where((x) => x.isOdd).toList();
final mapped = list.map((x) => x * 10).toList();
```

## Set

```dart
final set = <String>{'a', 'b', 'a'};
set.add('c');
set.remove('b');
```

## Map

```dart
final map = <String, int>{'a': 1, 'b': 2};
map['c'] = 3;

final a = map['a'];
final d = map['d'];

final entries = map.entries.toList();
```

## If/for в литералах

```dart
final n = 3;
final list = <int>[
  1,
  2,
  if (n > 2) n,
  for (var i = 0; i < 3; i++) i * 10,
];
```

## Unmodifiable коллекции

```dart
final list = List.unmodifiable([1, 2, 3]);
final map = Map.unmodifiable({'a': 1});
final set = Set.unmodifiable({'a', 'b'});
```

## Частые методы

```dart
final xs = [1, 2, 3];

final first = xs.first;
final last = xs.last;
final hasAny = xs.isNotEmpty;

final sum = xs.reduce((a, b) => a + b);
final max = xs.fold<int>(0, (acc, x) => x > acc ? x : acc);
```
