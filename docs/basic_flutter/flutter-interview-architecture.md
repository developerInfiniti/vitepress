---
description: "Вопросы по архитектуре Flutter для собеседований: BLoC, Clean Architecture, DI — подробные ответы"
---

# Співбесіда Flutter: Архітектура

Питання про архітектурні патерни та організацію коду.

## Архітектурні патерни

### Що таке Clean Architecture?

**Відповідь:** Clean Architecture — це підхід до організації коду, де залежності спрямовані всередину, від зовнішніх шарів до внутрішніх.

```
┌─────────────────────────────────────┐
│         Presentation Layer          │  ← UI, Widgets, BLoC
├─────────────────────────────────────┤
│           Domain Layer              │  ← Entities, UseCases
├─────────────────────────────────────┤
│            Data Layer               │  ← Repositories, DataSources
└─────────────────────────────────────┘
```

```dart
// Domain Layer (не залежить від нічого)
class User {
  final String id;
  final String name;
  User({required this.id, required this.name});
}

abstract class UserRepository {
  Future<User> getUser(String id);
}

class GetUser {
  final UserRepository repository;
  GetUser(this.repository);

  Future<User> call(String id) => repository.getUser(id);
}

// Data Layer (залежить від Domain)
class UserRepositoryImpl implements UserRepository {
  final ApiClient api;
  final LocalStorage local;

  UserRepositoryImpl(this.api, this.local);

  @override
  Future<User> getUser(String id) async {
    try {
      return await api.getUser(id);
    } catch (e) {
      return await local.getUser(id);
    }
  }
}

// Presentation Layer (залежить від Domain)
class UserBloc extends Bloc<UserEvent, UserState> {
  final GetUser getUser;

  UserBloc(this.getUser) : super(UserInitial()) {
    on<LoadUser>((event, emit) async {
      emit(UserLoading());
      try {
        final user = await getUser(event.id);
        emit(UserLoaded(user));
      } catch (e) {
        emit(UserError(e.toString()));
      }
    });
  }
}
```

**Переваги:**
- Тестованість
- Незалежність від UI та БД
- Легко замінювати компоненти

---

### Поясніть MVVM для Flutter

**Відповідь:** MVVM (Model-View-ViewModel) розділяє застосунок на три компоненти:

```
Model ←→ ViewModel ←→ View
```

```dart
// Model - дані та бізнес-логіка
class User {
  final String name;
  final String email;
  User({required this.name, required this.email});
}

class UserService {
  Future<User> fetchUser() async {
    // API виклик
    return User(name: 'John', email: 'john@example.com');
  }
}

// ViewModel - стан та логіка UI
class UserViewModel extends ChangeNotifier {
  final UserService _service;

  User? _user;
  bool _isLoading = false;
  String? _error;

  User? get user => _user;
  bool get isLoading => _isLoading;
  String? get error => _error;

  UserViewModel(this._service);

  Future<void> loadUser() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _user = await _service.fetchUser();
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}

// View - UI
class UserView extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => UserViewModel(UserService())..loadUser(),
      child: Consumer<UserViewModel>(
        builder: (context, vm, _) {
          if (vm.isLoading) return CircularProgressIndicator();
          if (vm.error != null) return Text('Error: ${vm.error}');
          if (vm.user == null) return Text('No user');

          return Text(vm.user!.name);
        },
      ),
    );
  }
}
```

---

### Що таке Repository Pattern?

**Відповідь:** Repository — це абстракція над джерелами даних, що приховує деталі отримання даних.

```dart
// Абстрактний репозиторій
abstract class UserRepository {
  Future<User> getUser(String id);
  Future<List<User>> getUsers();
  Future<void> saveUser(User user);
  Future<void> deleteUser(String id);
}

// Реалізація
class UserRepositoryImpl implements UserRepository {
  final ApiClient _api;
  final LocalDatabase _db;
  final NetworkChecker _network;

  UserRepositoryImpl(this._api, this._db, this._network);

  @override
  Future<User> getUser(String id) async {
    if (await _network.isConnected) {
      try {
        final user = await _api.getUser(id);
        await _db.cacheUser(user); // Кешуємо
        return user;
      } catch (e) {
        return await _db.getUser(id); // Fallback на кеш
      }
    } else {
      return await _db.getUser(id);
    }
  }

  @override
  Future<List<User>> getUsers() async {
    // Аналогічна логіка
  }
}

// Використання (не знає про API чи БД)
class UserBloc {
  final UserRepository _repository; // Залежність від абстракції

  Future<void> loadUser(String id) async {
    final user = await _repository.getUser(id);
    // ...
  }
}
```

---

### Що таке Dependency Injection?

**Відповідь:** DI — це патерн, де залежності передаються ззовні, а не створюються всередині класу.

```dart
// Без DI (погано)
class UserBloc {
  final _repository = UserRepositoryImpl(); // Жорстка залежність

  // Неможливо замінити для тестів
}

// З DI (добре)
class UserBloc {
  final UserRepository _repository; // Залежність від абстракції

  UserBloc(this._repository); // Передається ззовні
}

// get_it для DI
final sl = GetIt.instance;

void setupDI() {
  // Реєстрація залежностей
  sl.registerLazySingleton<ApiClient>(() => ApiClient());
  sl.registerLazySingleton<LocalDatabase>(() => LocalDatabase());

  sl.registerLazySingleton<UserRepository>(
    () => UserRepositoryImpl(sl(), sl()),
  );

  sl.registerFactory(() => UserBloc(sl()));
}

// Використання
final bloc = sl<UserBloc>();
```

---

## SOLID принципи

### Як SOLID застосовується у Flutter?

**Відповідь:**

**S — Single Responsibility (Єдина відповідальність)**
```dart
// Погано - один клас робить все
class UserManager {
  void fetchUser() { }
  void saveToDatabase() { }
  void sendEmail() { }
  void formatUserName() { }
}

// Добре - розділені відповідальності
class UserRepository { void fetchUser() { } }
class UserDatabase { void save() { } }
class EmailService { void send() { } }
class UserFormatter { String format() { } }
```

**O — Open/Closed (Відкритий/Закритий)**
```dart
// Відкритий для розширення, закритий для модифікації
abstract class PaymentMethod {
  Future<void> pay(double amount);
}

class CreditCardPayment implements PaymentMethod {
  @override
  Future<void> pay(double amount) async { }
}

class PayPalPayment implements PaymentMethod {
  @override
  Future<void> pay(double amount) async { }
}

// Додавання нового методу не змінює існуючий код
class CryptoPayment implements PaymentMethod {
  @override
  Future<void> pay(double amount) async { }
}
```

**L — Liskov Substitution (Підстановка Лісков)**
```dart
// Підкласи можна замінити батьківським класом
abstract class Bird {
  void move();
}

class Sparrow extends Bird {
  @override
  void move() => fly();
  void fly() { }
}

class Penguin extends Bird {
  @override
  void move() => walk(); // Не fly()!
  void walk() { }
}
```

**I — Interface Segregation (Розділення інтерфейсів)**
```dart
// Погано - великий інтерфейс
abstract class Worker {
  void work();
  void eat();
  void sleep();
}

// Добре - розділені інтерфейси
abstract class Workable {
  void work();
}

abstract class Eatable {
  void eat();
}

class Human implements Workable, Eatable {
  void work() { }
  void eat() { }
}

class Robot implements Workable {
  void work() { }
}
```

**D — Dependency Inversion (Інверсія залежностей)**
```dart
// Погано - залежність від конкретики
class UserBloc {
  final MySqlDatabase db = MySqlDatabase();
}

// Добре - залежність від абстракції
class UserBloc {
  final Database db; // Абстракція
  UserBloc(this.db);
}
```

---

## Структура проєкту

### Яку структуру папок ви рекомендуєте?

**Відповідь:**

**Feature-first (рекомендовано для великих проєктів):**
```
lib/
├── core/
│   ├── error/
│   ├── network/
│   ├── utils/
│   └── widgets/
├── features/
│   ├── auth/
│   │   ├── data/
│   │   │   ├── datasources/
│   │   │   ├── models/
│   │   │   └── repositories/
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   ├── repositories/
│   │   │   └── usecases/
│   │   └── presentation/
│   │       ├── bloc/
│   │       ├── pages/
│   │       └── widgets/
│   ├── home/
│   └── profile/
└── main.dart
```

**Layer-first (для малих проєктів):**
```
lib/
├── data/
│   ├── models/
│   ├── repositories/
│   └── services/
├── domain/
│   ├── entities/
│   └── usecases/
├── presentation/
│   ├── pages/
│   ├── widgets/
│   └── bloc/
└── main.dart
```

---

### Як організувати навігацію у великому проєкті?

**Відповідь:**

```dart
// 1. Централізовані маршрути
class AppRoutes {
  static const String home = '/';
  static const String login = '/login';
  static const String profile = '/profile';
  static const String settings = '/settings';
}

// 2. Router клас
class AppRouter {
  static Route<dynamic> generateRoute(RouteSettings settings) {
    switch (settings.name) {
      case AppRoutes.home:
        return MaterialPageRoute(builder: (_) => HomeScreen());
      case AppRoutes.login:
        return MaterialPageRoute(builder: (_) => LoginScreen());
      case AppRoutes.profile:
        final userId = settings.arguments as String;
        return MaterialPageRoute(
          builder: (_) => ProfileScreen(userId: userId),
        );
      default:
        return MaterialPageRoute(builder: (_) => NotFoundScreen());
    }
  }
}

// 3. Використання
MaterialApp(
  onGenerateRoute: AppRouter.generateRoute,
  initialRoute: AppRoutes.home,
)

// 4. Або go_router для декларативного підходу
final router = GoRouter(
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => HomeScreen(),
      routes: [
        GoRoute(
          path: 'profile/:id',
          builder: (context, state) {
            final id = state.pathParameters['id']!;
            return ProfileScreen(userId: id);
          },
        ),
      ],
    ),
  ],
);
```

---

## Тестування

### Як структурувати тести?

**Відповідь:**

```
test/
├── unit/                    # Unit тести
│   ├── data/
│   │   └── repositories/
│   └── domain/
│       └── usecases/
├── widget/                  # Widget тести
│   └── features/
│       └── auth/
│           └── login_screen_test.dart
├── integration/             # Інтеграційні тести
│   └── app_test.dart
└── mocks/                   # Моки
    └── mock_repositories.dart
```

```dart
// Unit test
void main() {
  group('GetUser UseCase', () {
    late GetUser useCase;
    late MockUserRepository mockRepository;

    setUp(() {
      mockRepository = MockUserRepository();
      useCase = GetUser(mockRepository);
    });

    test('should return user from repository', () async {
      // Arrange
      final user = User(id: '1', name: 'Test');
      when(mockRepository.getUser('1')).thenAnswer((_) async => user);

      // Act
      final result = await useCase('1');

      // Assert
      expect(result, user);
      verify(mockRepository.getUser('1')).called(1);
    });
  });
}

// Widget test
void main() {
  testWidgets('LoginScreen shows error on invalid input', (tester) async {
    await tester.pumpWidget(MaterialApp(home: LoginScreen()));

    await tester.tap(find.byType(ElevatedButton));
    await tester.pump();

    expect(find.text('Email is required'), findsOneWidget);
  });
}
```

---

## Практичні питання

### Як обробляти помилки в архітектурі?

**Відповідь:**

```dart
// 1. Sealed класи для результатів
sealed class Result<T> {}

class Success<T> extends Result<T> {
  final T data;
  Success(this.data);
}

class Failure<T> extends Result<T> {
  final AppException error;
  Failure(this.error);
}

// 2. Типізовані помилки
sealed class AppException implements Exception {
  final String message;
  AppException(this.message);
}

class NetworkException extends AppException {
  NetworkException([String message = 'Network error']) : super(message);
}

class ServerException extends AppException {
  final int code;
  ServerException(this.code, [String message = 'Server error']) : super(message);
}

class CacheException extends AppException {
  CacheException([String message = 'Cache error']) : super(message);
}

// 3. Використання в Repository
class UserRepositoryImpl implements UserRepository {
  @override
  Future<Result<User>> getUser(String id) async {
    try {
      final user = await _api.getUser(id);
      return Success(user);
    } on SocketException {
      return Failure(NetworkException());
    } on HttpException catch (e) {
      return Failure(ServerException(e.statusCode));
    }
  }
}

// 4. Обробка в BLoC
on<LoadUser>((event, emit) async {
  emit(UserLoading());

  final result = await _repository.getUser(event.id);

  switch (result) {
    case Success<User> s:
      emit(UserLoaded(s.data));
    case Failure<User> f:
      emit(UserError(f.error.message));
  }
});
```

---

### Як реалізувати кешування?

**Відповідь:**

```dart
class CachedUserRepository implements UserRepository {
  final UserRepository _remote;
  final CacheStorage _cache;
  final Duration _cacheDuration;

  CachedUserRepository(
    this._remote,
    this._cache, {
    this._cacheDuration = const Duration(minutes: 5),
  });

  @override
  Future<User> getUser(String id) async {
    // Спробувати з кешу
    final cached = await _cache.get<User>('user_$id');
    if (cached != null && !cached.isExpired(_cacheDuration)) {
      return cached.data;
    }

    // Отримати з мережі
    final user = await _remote.getUser(id);

    // Зберегти в кеш
    await _cache.set('user_$id', CacheEntry(user, DateTime.now()));

    return user;
  }
}

class CacheEntry<T> {
  final T data;
  final DateTime timestamp;

  CacheEntry(this.data, this.timestamp);

  bool isExpired(Duration duration) {
    return DateTime.now().difference(timestamp) > duration;
  }
}
```

---

## Швидкі відповіді

| Питання | Відповідь |
|---------|-----------|
| Що таке UseCase? | Один бізнес-сценарій (одна дія) |
| Що таке Entity? | Бізнес-об'єкт без залежностей від фреймворку |
| Що таке DTO? | Data Transfer Object - для передачі даних |
| Що таке Mapper? | Перетворює DTO в Entity і навпаки |
| Feature-first vs Layer-first? | Feature-first для великих проєктів, Layer-first для малих |
| Коли потрібна Clean Architecture? | Великі проєкти з командою, тривалою підтримкою |
