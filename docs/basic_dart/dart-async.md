# Асинхронность: Future и Stream

## async / await и Future

```dart
Future<int> fetchCount() async {
  await Future.delayed(const Duration(milliseconds: 50));
  return 42;
}

Future<void> main() async {
  final count = await fetchCount();
  print(count);
}
```

## Обработка ошибок

```dart
Future<void> run() async {
  try {
    await Future<void>.error(Exception('fail'));
  } catch (e) {
    print(e);
  } finally {
    print('done');
  }
}
```

## Parallel await

```dart
Future<int> a() async => 1;
Future<int> b() async => 2;

Future<void> main() async {
  final results = await Future.wait<int>([a(), b()]);
  final sum = results.reduce((x, y) => x + y);
  print(sum);
}
```

## Stream и await for

```dart
Stream<int> ticks() async* {
  for (var i = 0; i < 3; i++) {
    await Future.delayed(const Duration(milliseconds: 50));
    yield i;
  }
}

Future<void> main() async {
  await for (final t in ticks()) {
    print(t);
  }
}
```

## Stream преобразования

```dart
final stream = Stream<int>.fromIterable([1, 2, 3]);
final mapped = stream.map((x) => x * 10);
```
