---
description: "Streams во Flutter: StreamBuilder, StreamController, broadcast — реактивное программирование"
---

# Streams та реактивне програмування у Flutter

Streams (потоки) — це послідовність асинхронних подій. Вони дозволяють обробляти дані по мірі їх надходження, що ідеально підходить для реактивного програмування у Flutter.

## Основи Streams

### Single-subscription Stream

Потік, на який можна підписатися лише один раз:

```dart
// Створення Stream через async*
Stream<int> countStream(int max) async* {
  for (int i = 1; i <= max; i++) {
    await Future.delayed(const Duration(seconds: 1));
    yield i;
  }
}

// Підписка
void main() async {
  final stream = countStream(5);

  await for (final value in stream) {
    print(value); // 1, 2, 3, 4, 5
  }
}
```

### Broadcast Stream

Потік, на який можна підписатися кілька разів:

```dart
// Створення broadcast stream
final controller = StreamController<String>.broadcast();

// Перший слухач
controller.stream.listen((data) => print('Слухач 1: $data'));

// Другий слухач
controller.stream.listen((data) => print('Слухач 2: $data'));

controller.add('Привіт'); // обидва слухачі отримають дані
controller.close();
```

## StreamController

`StreamController` дозволяє програмно додавати дані у потік:

```dart
class MessageService {
  final _controller = StreamController<String>.broadcast();

  /// Потік повідомлень
  Stream<String> get messages => _controller.stream;

  /// Додати повідомлення
  void addMessage(String message) {
    _controller.add(message);
  }

  /// Додати помилку
  void addError(String error) {
    _controller.addError(Exception(error));
  }

  /// Закрити потік
  void dispose() {
    _controller.close();
  }
}
```

## Оператори Stream

### Трансформація

```dart
final numbers = Stream.fromIterable([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

// map — перетворення кожного елемента
numbers.map((n) => n * 2); // 2, 4, 6, 8, ...

// where — фільтрація
numbers.where((n) => n.isEven); // 2, 4, 6, 8, 10

// expand — розгортання
numbers.expand((n) => [n, n * 10]); // 1, 10, 2, 20, 3, 30, ...

// asyncMap — асинхронне перетворення
numbers.asyncMap((n) async {
  await Future.delayed(Duration(milliseconds: 100));
  return 'Число: $n';
});
```

### Агрегація

```dart
final numbers = Stream.fromIterable([1, 2, 3, 4, 5]);

// reduce — згортання в одне значення
final sum = await numbers.reduce((a, b) => a + b); // 15

// fold — згортання з початковим значенням
final product = await numbers.fold<int>(1, (prev, n) => prev * n); // 120

// toList — збирання у список
final list = await numbers.toList(); // [1, 2, 3, 4, 5]

// first, last, length
final first = await numbers.first; // 1
```

### Комбінування

```dart
// take — взяти перші N елементів
numbers.take(3); // 1, 2, 3

// skip — пропустити перші N
numbers.skip(3); // 4, 5

// takeWhile — брати поки умова true
numbers.takeWhile((n) => n < 4); // 1, 2, 3

// distinct — тільки унікальні
Stream.fromIterable([1, 1, 2, 2, 3]).distinct(); // 1, 2, 3
```

## StreamBuilder у Flutter

`StreamBuilder` — це віджет, який перебудовується при надходженні нових даних у потік:

```dart
class ChatScreen extends StatefulWidget {
  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final _messageService = MessageService();

  @override
  void dispose() {
    _messageService.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: StreamBuilder<List<Message>>(
        stream: _messageService.messages,
        builder: (context, snapshot) {
          // Стан з'єднання
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          // Помилка
          if (snapshot.hasError) {
            return Center(child: Text('Помилка: ${snapshot.error}'));
          }

          // Дані
          if (snapshot.hasData) {
            final messages = snapshot.data!;
            return ListView.builder(
              itemCount: messages.length,
              itemBuilder: (context, index) {
                return ListTile(title: Text(messages[index].text));
              },
            );
          }

          return const Center(child: Text('Немає повідомлень'));
        },
      ),
    );
  }
}
```

## StreamTransformer

Створення власного трансформера потоку:

```dart
/// Трансформер для debounce
StreamTransformer<T, T> debounce<T>(Duration duration) {
  Timer? timer;
  return StreamTransformer.fromHandlers(
    handleData: (data, sink) {
      timer?.cancel();
      timer = Timer(duration, () => sink.add(data));
    },
    handleDone: (sink) {
      timer?.cancel();
      sink.close();
    },
  );
}

/// Трансформер для throttle
StreamTransformer<T, T> throttle<T>(Duration duration) {
  DateTime? lastEmit;
  return StreamTransformer.fromHandlers(
    handleData: (data, sink) {
      final now = DateTime.now();
      if (lastEmit == null || now.difference(lastEmit!) >= duration) {
        lastEmit = now;
        sink.add(data);
      }
    },
  );
}

// Використання
final searchStream = textController.stream
    .transform(debounce(const Duration(milliseconds: 300)))
    .asyncMap((query) => apiClient.search(query));
```

## RxDart — розширення для Streams

RxDart додає потужні оператори та типи потоків:

```dart
import 'package:rxdart/rxdart.dart';

class SearchBloc {
  final _searchSubject = BehaviorSubject<String>.seeded('');
  final ApiClient _api;

  SearchBloc(this._api);

  /// Вхід — пошуковий запит
  Sink<String> get searchInput => _searchSubject.sink;

  /// Вихід — результати пошуку
  late final Stream<List<SearchResult>> results = _searchSubject.stream
      .debounceTime(const Duration(milliseconds: 300))
      .distinct()
      .where((query) => query.length >= 2)
      .switchMap((query) => Stream.fromFuture(_api.search(query)))
      .onErrorReturnWith((error, _) => <SearchResult>[]);

  void dispose() {
    _searchSubject.close();
  }
}
```

### Типи Subject у RxDart

```dart
// BehaviorSubject — зберігає останнє значення
final subject = BehaviorSubject<int>.seeded(0);
subject.add(1);
subject.add(2);
subject.stream.listen(print); // Відразу отримає 2

// ReplaySubject — зберігає N останніх значень
final replay = ReplaySubject<int>(maxSize: 3);
replay.add(1);
replay.add(2);
replay.add(3);
replay.add(4);
replay.stream.listen(print); // Отримає 2, 3, 4

// PublishSubject — як звичайний broadcast
final publish = PublishSubject<int>();
publish.stream.listen(print);
publish.add(1); // Отримає 1
```

### Оператори RxDart

```dart
// combineLatest — об'єднання останніх значень
final combined = Rx.combineLatest2(
  nameStream,
  ageStream,
  (String name, int age) => '$name ($age)',
);

// merge — об'єднання потоків
final merged = Rx.merge([stream1, stream2, stream3]);

// zip — попарне об'єднання
final zipped = Rx.zip2(
  namesStream,
  scoresStream,
  (String name, int score) => '$name: $score',
);

// switchMap — перемикання на новий потік
searchQuery
    .switchMap((query) => apiClient.search(query).asStream());

// startWith — початкове значення
stream.startWith(defaultValue);

// scan — акумулятор (як reduce, але для потоків)
clickStream.scan<int>((count, _, __) => count + 1, 0);
```

## Паттерн BLoC з Streams

```dart
class CounterBloc {
  int _count = 0;
  final _countController = BehaviorSubject<int>.seeded(0);
  final _actionController = StreamController<CounterAction>();

  /// Вихід
  Stream<int> get count => _countController.stream;

  /// Вхід
  Sink<CounterAction> get action => _actionController.sink;

  CounterBloc() {
    _actionController.stream.listen(_handleAction);
  }

  void _handleAction(CounterAction action) {
    switch (action) {
      case CounterAction.increment:
        _count++;
      case CounterAction.decrement:
        _count--;
      case CounterAction.reset:
        _count = 0;
    }
    _countController.add(_count);
  }

  void dispose() {
    _countController.close();
    _actionController.close();
  }
}

enum CounterAction { increment, decrement, reset }
```

## Управління підписками

```dart
class DataScreen extends StatefulWidget {
  @override
  State<DataScreen> createState() => _DataScreenState();
}

class _DataScreenState extends State<DataScreen> {
  final List<StreamSubscription> _subscriptions = [];

  @override
  void initState() {
    super.initState();

    _subscriptions.add(
      dataService.updates.listen(
        (data) => setState(() => _data = data),
        onError: (error) => _showError(error),
        cancelOnError: false,
      ),
    );

    _subscriptions.add(
      notificationService.notifications.listen(
        (notification) => _showNotification(notification),
      ),
    );
  }

  @override
  void dispose() {
    for (final sub in _subscriptions) {
      sub.cancel();
    }
    super.dispose();
  }
}
```

## Найкращі практики

- **Завжди закривайте контролери**: У `dispose()` закривайте `StreamController` та скасовуйте підписки
- **Broadcast vs Single**: Використовуйте `.broadcast()` якщо потрібно кілька слухачів
- **Обробка помилок**: Завжди обробляйте помилки у потоках через `onError`
- **Debounce для пошуку**: Використовуйте debounce для зменшення кількості запитів
- **StreamBuilder**: Обробляйте всі стани: `waiting`, `error`, `data`
- **Уникайте витоків пам'яті**: Скасовуйте підписки при знищенні віджета
- **Типізація**: Завжди вказуйте тип даних у потоці (`Stream<int>`, а не `Stream`)
