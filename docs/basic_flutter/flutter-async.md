---
description: "Асинхронность во Flutter: Future, Stream, async/await, Isolate — обработка фоновых задач приложения"
---

# Асинхронне програмування у Flutter

Асинхронне програмування є ключовим аспектом розробки Flutter-застосунків. Dart надає потужні інструменти для роботи з асинхронними операціями: Future, async/await та Stream.

## Future та async/await

### Основи Future

`Future` представляє результат асинхронної операції, який буде доступний пізніше.

```dart
// Створення Future
Future<String> fetchUserData() {
  return Future.delayed(
    Duration(seconds: 2),
    () => 'Дані користувача',
  );
}

// Використання then
void main() {
  print('Початок');

  fetchUserData().then((data) {
    print(data);
  }).catchError((error) {
    print('Помилка: $error');
  }).whenComplete(() {
    print('Завершено');
  });

  print('Кінець');
}
// Виведе: Початок, Кінець, Дані користувача, Завершено
```

### async/await

`async/await` робить асинхронний код більш читабельним.

```dart
Future<void> loadData() async {
  try {
    print('Завантаження...');
    String data = await fetchUserData();
    print('Отримано: $data');
  } catch (e) {
    print('Помилка: $e');
  } finally {
    print('Завершено');
  }
}

// Кілька послідовних запитів
Future<void> loadMultipleData() async {
  try {
    final user = await fetchUser();
    final posts = await fetchUserPosts(user.id);
    final comments = await fetchPostComments(posts.first.id);

    print('Користувач: ${user.name}');
    print('Постів: ${posts.length}');
    print('Коментарів: ${comments.length}');
  } catch (e) {
    print('Помилка: $e');
  }
}
```

### Паралельне виконання

```dart
// Future.wait - чекає завершення всіх Future
Future<void> loadAllData() async {
  try {
    final results = await Future.wait([
      fetchUsers(),
      fetchPosts(),
      fetchComments(),
    ]);

    final users = results[0] as List<User>;
    final posts = results[1] as List<Post>;
    final comments = results[2] as List<Comment>;

    print('Завантажено: ${users.length} користувачів, ${posts.length} постів');
  } catch (e) {
    print('Помилка: $e');
  }
}

// Future.any - повертає результат першого завершеного Future
Future<String> getFirstAvailableData() async {
  return await Future.any([
    fetchFromServer1(),
    fetchFromServer2(),
    fetchFromServer3(),
  ]);
}
```

### Обробка помилок

```dart
// Обробка специфічних помилок
Future<void> handleErrors() async {
  try {
    await fetchData();
  } on SocketException {
    print('Немає з\'єднання з інтернетом');
  } on HttpException {
    print('Помилка HTTP');
  } on FormatException {
    print('Невірний формат даних');
  } catch (e) {
    print('Невідома помилка: $e');
  }
}

// Власний клас помилки
class ApiException implements Exception {
  final String message;
  final int statusCode;

  ApiException(this.message, this.statusCode);

  @override
  String toString() => 'ApiException: $message (код: $statusCode)';
}

Future<User> fetchUser() async {
  final response = await http.get(Uri.parse('https://api.example.com/user'));

  if (response.statusCode == 200) {
    return User.fromJson(jsonDecode(response.body));
  } else {
    throw ApiException('Не вдалося отримати користувача', response.statusCode);
  }
}
```

## FutureBuilder

`FutureBuilder` — віджет для побудови UI на основі результату Future.

```dart
class UserProfileScreen extends StatefulWidget {
  @override
  _UserProfileScreenState createState() => _UserProfileScreenState();
}

class _UserProfileScreenState extends State<UserProfileScreen> {
  late Future<User> _userFuture;

  @override
  void initState() {
    super.initState();
    _userFuture = fetchUser();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Профіль')),
      body: FutureBuilder<User>(
        future: _userFuture,
        builder: (context, snapshot) {
          // Стан завантаження
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          }

          // Помилка
          if (snapshot.hasError) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.error, size: 64, color: Colors.red),
                  SizedBox(height: 16),
                  Text('Помилка: ${snapshot.error}'),
                  ElevatedButton(
                    onPressed: () {
                      setState(() {
                        _userFuture = fetchUser();
                      });
                    },
                    child: Text('Спробувати ще'),
                  ),
                ],
              ),
            );
          }

          // Успішний результат
          if (snapshot.hasData) {
            final user = snapshot.data!;
            return ListView(
              padding: EdgeInsets.all(16),
              children: [
                CircleAvatar(
                  radius: 50,
                  backgroundImage: NetworkImage(user.avatarUrl),
                ),
                SizedBox(height: 16),
                Text(user.name, style: Theme.of(context).textTheme.headlineSmall),
                Text(user.email),
              ],
            );
          }

          return Center(child: Text('Немає даних'));
        },
      ),
    );
  }
}
```

## Streams

### Основи Stream

`Stream` — це послідовність асинхронних подій.

```dart
// Створення Stream
Stream<int> countStream(int max) async* {
  for (int i = 1; i <= max; i++) {
    await Future.delayed(Duration(seconds: 1));
    yield i;
  }
}

// Використання Stream
void main() async {
  await for (final count in countStream(5)) {
    print(count);
  }
  print('Готово!');
}
```

### StreamController

```dart
class CounterService {
  final _counterController = StreamController<int>.broadcast();
  int _count = 0;

  Stream<int> get counterStream => _counterController.stream;
  int get currentCount => _count;

  void increment() {
    _count++;
    _counterController.add(_count);
  }

  void decrement() {
    _count--;
    _counterController.add(_count);
  }

  void dispose() {
    _counterController.close();
  }
}

// Використання
final counterService = CounterService();

counterService.counterStream.listen(
  (count) => print('Лічильник: $count'),
  onError: (error) => print('Помилка: $error'),
  onDone: () => print('Потік закрито'),
);

counterService.increment(); // Виведе: Лічильник: 1
counterService.increment(); // Виведе: Лічильник: 2
```

### Трансформація Stream

```dart
// map - перетворення елементів
Stream<String> get formattedStream {
  return counterStream.map((count) => 'Значення: $count');
}

// where - фільтрація
Stream<int> get evenNumbersStream {
  return counterStream.where((count) => count % 2 == 0);
}

// transform - складне перетворення
final transformer = StreamTransformer<int, String>.fromHandlers(
  handleData: (data, sink) {
    if (data > 0) {
      sink.add('Позитивне: $data');
    } else {
      sink.add('Негативне: $data');
    }
  },
);

Stream<String> get transformedStream {
  return counterStream.transform(transformer);
}

// asyncMap - асинхронне перетворення
Stream<UserDetails> get userDetailsStream {
  return userIdStream.asyncMap((id) => fetchUserDetails(id));
}

// debounce (з rxdart)
Stream<String> get debouncedSearchStream {
  return searchStream
      .debounceTime(Duration(milliseconds: 300))
      .distinct();
}
```

## StreamBuilder

```dart
class ChatScreen extends StatelessWidget {
  final Stream<List<Message>> messagesStream;

  const ChatScreen({required this.messagesStream});

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<List<Message>>(
      stream: messagesStream,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return Center(child: CircularProgressIndicator());
        }

        if (snapshot.hasError) {
          return Center(child: Text('Помилка: ${snapshot.error}'));
        }

        if (!snapshot.hasData || snapshot.data!.isEmpty) {
          return Center(child: Text('Немає повідомлень'));
        }

        final messages = snapshot.data!;
        return ListView.builder(
          reverse: true,
          itemCount: messages.length,
          itemBuilder: (context, index) {
            final message = messages[index];
            return MessageBubble(message: message);
          },
        );
      },
    );
  }
}
```

## Isolates

`Isolate` дозволяє виконувати важкі обчислення у окремому потоці.

### compute()

```dart
// Функція для виконання в окремому isolate
List<int> heavyComputation(int count) {
  final result = <int>[];
  for (int i = 0; i < count; i++) {
    result.add(i * i);
  }
  return result;
}

// Використання compute
Future<void> runHeavyTask() async {
  final result = await compute(heavyComputation, 1000000);
  print('Обчислено ${result.length} елементів');
}
```

### Власний Isolate

```dart
import 'dart:isolate';

class IsolateService {
  Isolate? _isolate;
  ReceivePort? _receivePort;
  SendPort? _sendPort;

  Future<void> start() async {
    _receivePort = ReceivePort();
    _isolate = await Isolate.spawn(
      _isolateEntry,
      _receivePort!.sendPort,
    );

    _sendPort = await _receivePort!.first;
  }

  static void _isolateEntry(SendPort sendPort) {
    final receivePort = ReceivePort();
    sendPort.send(receivePort.sendPort);

    receivePort.listen((message) {
      // Обробка повідомлень
      if (message is String) {
        print('Отримано: $message');
      }
    });
  }

  void sendMessage(String message) {
    _sendPort?.send(message);
  }

  void dispose() {
    _isolate?.kill();
    _receivePort?.close();
  }
}
```

## Таймери та періодичні операції

```dart
// Одноразовий таймер
Timer(Duration(seconds: 5), () {
  print('Пройшло 5 секунд');
});

// Періодичний таймер
Timer.periodic(Duration(seconds: 1), (timer) {
  print('Тік: ${timer.tick}');

  if (timer.tick >= 10) {
    timer.cancel();
    print('Таймер зупинено');
  }
});

// Скасування таймера
class TimerExample extends StatefulWidget {
  @override
  _TimerExampleState createState() => _TimerExampleState();
}

class _TimerExampleState extends State<TimerExample> {
  Timer? _timer;
  int _seconds = 0;

  @override
  void initState() {
    super.initState();
    _startTimer();
  }

  void _startTimer() {
    _timer = Timer.periodic(Duration(seconds: 1), (timer) {
      setState(() {
        _seconds++;
      });
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Text('Секунд: $_seconds');
  }
}
```

## Практичні приклади

### Пошук з debounce

```dart
class SearchScreen extends StatefulWidget {
  @override
  _SearchScreenState createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  final _searchController = TextEditingController();
  final _searchSubject = StreamController<String>();
  List<SearchResult> _results = [];
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();

    _searchSubject.stream
        .debounceTime(Duration(milliseconds: 300))
        .distinct()
        .where((query) => query.length >= 3)
        .asyncMap((query) => _performSearch(query))
        .listen((results) {
          setState(() {
            _results = results;
            _isLoading = false;
          });
        });
  }

  Future<List<SearchResult>> _performSearch(String query) async {
    setState(() {
      _isLoading = true;
    });

    // API запит
    final response = await http.get(
      Uri.parse('https://api.example.com/search?q=$query'),
    );

    return (jsonDecode(response.body) as List)
        .map((item) => SearchResult.fromJson(item))
        .toList();
  }

  @override
  void dispose() {
    _searchController.dispose();
    _searchSubject.close();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: TextField(
          controller: _searchController,
          decoration: InputDecoration(
            hintText: 'Пошук...',
            border: InputBorder.none,
          ),
          onChanged: (query) => _searchSubject.add(query),
        ),
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : ListView.builder(
              itemCount: _results.length,
              itemBuilder: (context, index) {
                return ListTile(title: Text(_results[index].title));
              },
            ),
    );
  }
}
```

### Завантаження з retry

```dart
Future<T> fetchWithRetry<T>(
  Future<T> Function() fetchFunction, {
  int maxRetries = 3,
  Duration delay = const Duration(seconds: 1),
}) async {
  int attempts = 0;

  while (true) {
    try {
      return await fetchFunction();
    } catch (e) {
      attempts++;

      if (attempts >= maxRetries) {
        rethrow;
      }

      print('Спроба $attempts не вдалася. Повтор через ${delay.inSeconds} с...');
      await Future.delayed(delay * attempts); // Експоненціальна затримка
    }
  }
}

// Використання
Future<User> fetchUserWithRetry() async {
  return fetchWithRetry(
    () => fetchUser(),
    maxRetries: 3,
    delay: Duration(seconds: 2),
  );
}
```

### Кешування даних

```dart
class CacheService<T> {
  final Map<String, CacheEntry<T>> _cache = {};
  final Duration _cacheDuration;

  CacheService({Duration? cacheDuration})
      : _cacheDuration = cacheDuration ?? Duration(minutes: 5);

  Future<T> get(
    String key,
    Future<T> Function() fetchFunction,
  ) async {
    final entry = _cache[key];

    if (entry != null && !entry.isExpired) {
      return entry.data;
    }

    final data = await fetchFunction();
    _cache[key] = CacheEntry(data, DateTime.now().add(_cacheDuration));

    return data;
  }

  void invalidate(String key) {
    _cache.remove(key);
  }

  void clear() {
    _cache.clear();
  }
}

class CacheEntry<T> {
  final T data;
  final DateTime expiresAt;

  CacheEntry(this.data, this.expiresAt);

  bool get isExpired => DateTime.now().isAfter(expiresAt);
}

// Використання
final userCache = CacheService<User>();

Future<User> getUser(String id) async {
  return userCache.get(
    'user_$id',
    () => fetchUser(id),
  );
}
```

## Найкращі практики

1. **Завжди обробляйте помилки** — використовуйте try/catch або onError.

2. **Скасовуйте підписки** у dispose() для запобігання витоків пам'яті.

3. **Використовуйте compute()** для важких обчислень.

4. **Не створюйте Future в build()** — ініціалізуйте їх у initState().

5. **Використовуйте broadcast streams** для кількох слухачів.

6. **Використовуйте debounce** для пошуку та введення тексту.

## Висновок

Асинхронне програмування у Flutter базується на потужних можливостях Dart: Future, Stream та Isolate. Правильне використання цих інструментів дозволяє створювати швидкі та чуйні застосунки, які ефективно обробляють мережеві запити, введення користувача та фонові операції.
