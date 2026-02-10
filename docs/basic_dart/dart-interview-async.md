# Dart: вопросы на собеседовании (Async)

Для примеров с microtask и `StreamController` нужен импорт:

```dart
import 'dart:async';
```

## В чем разница между `Future` и `Stream`?

- `Future<T>` — одно значение или ошибка в будущем
- `Stream<T>` — последовательность значений во времени (0..N), плюс завершение или ошибка

## async / await: что происходит?

`async` превращает функцию в возвращающую `Future`, а `await` приостанавливает выполнение до завершения `Future`.

```dart
Future<int> fetch() async {
  await Future.delayed(const Duration(milliseconds: 10));
  return 1;
}

Future<void> main() async {
  final x = await fetch();
  print(x);
}
```

## Как обработать ошибки в async коде?

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

## Как запустить несколько `Future` параллельно?

`Future.wait` ждет завершения всех.

```dart
Future<int> a() async => 1;
Future<int> b() async => 2;

Future<void> main() async {
  final xs = await Future.wait<int>([a(), b()]);
  final sum = xs.reduce((p, c) => p + c);
  print(sum);
}
```

## Microtask queue vs event queue (частый вопрос)

Упрощенно:

- микрозадачи выполняются раньше, чем задачи из очереди событий
- `Future.microtask` ставит задачу в microtask очередь
- `Future(...)` и `Future.delayed(...)` попадают в event очередь

```dart
Future<void> main() async {
  scheduleMicrotask(() => print('microtask'));
  Future(() => print('event'));
  print('sync');
}
```

## `Stream` и `async*`, `yield`

```dart
Stream<int> ticks() async* {
  for (var i = 0; i < 3; i++) {
    await Future.delayed(const Duration(milliseconds: 10));
    yield i;
  }
}

Future<void> main() async {
  await for (final t in ticks()) {
    print(t);
  }
}
```

## Cold vs hot stream

Часто спрашивают в контексте Flutter/Bloc, но это применимо и в чистом Dart.

- cold stream: каждый слушатель получает свою “последовательность”
- hot stream: источник общий, слушатели подписываются на общий поток событий

## Single-subscription vs broadcast

```dart
final s1 = Stream<int>.fromIterable([1, 2, 3]);
final s2 = s1.asBroadcastStream();
```

- single-subscription: один слушатель
- broadcast: несколько слушателей

## Как отменять подписку на stream?

```dart
final controller = StreamController<int>();
final sub = controller.stream.listen((v) => print(v));

Future<void> stop() async {
  await sub.cancel();
  await controller.close();
}
```

## `Isolate`: когда он нужен?

Isolate — отдельный поток выполнения со своей памятью. Используется для CPU-bound задач, чтобы не блокировать основной isolate.

Типичные примеры:

- тяжелый парсинг/сжатие/шифрование
- обработка больших массивов данных

## Что важно помнить про `await` в цикле?

`await` внутри `for` делает выполнение последовательным. Для параллельности чаще используют `Future.wait`.

```dart
Future<int> work(int x) async => x;

Future<void> sequential() async {
  final xs = <int>[];
  for (final x in [1, 2, 3]) {
    xs.add(await work(x));
  }
  print(xs);
}

Future<void> parallel() async {
  final xs = await Future.wait<int>([1, 2, 3].map(work));
  print(xs);
}
```
