# Dependency Injection у Flutter

Dependency Injection (DI) — це патерн проєктування, який дозволяє передавати залежності ззовні, замість того, щоб створювати їх усередині класу. Це підвищує тестованість, гнучкість та модульність коду.

## Навіщо потрібен DI

```dart
// Без DI — жорстка залежність
class UserRepository {
  final apiClient = ApiClient(); // жорстко зв'язано

  Future<User> getUser(int id) => apiClient.fetchUser(id);
}

// З DI — залежність передається ззовні
class UserRepository {
  final ApiClient apiClient;

  UserRepository({required this.apiClient}); // гнучко

  Future<User> getUser(int id) => apiClient.fetchUser(id);
}
```

## Способи впровадження залежностей

### 1. Constructor Injection

Найпростіший та найпоширеніший спосіб:

```dart
class AuthService {
  final UserRepository userRepository;
  final TokenStorage tokenStorage;

  AuthService({
    required this.userRepository,
    required this.tokenStorage,
  });

  Future<bool> login(String email, String password) async {
    final user = await userRepository.authenticate(email, password);
    if (user != null) {
      await tokenStorage.saveToken(user.token);
      return true;
    }
    return false;
  }
}
```

### 2. InheritedWidget

Вбудований механізм Flutter для передачі залежностей вниз по дереву віджетів:

```dart
class ServiceProvider extends InheritedWidget {
  final AuthService authService;
  final UserRepository userRepository;

  const ServiceProvider({
    super.key,
    required this.authService,
    required this.userRepository,
    required super.child,
  });

  static ServiceProvider of(BuildContext context) {
    return context.dependOnInheritedWidgetOfExactType<ServiceProvider>()!;
  }

  @override
  bool updateShouldNotify(ServiceProvider oldWidget) {
    return authService != oldWidget.authService ||
        userRepository != oldWidget.userRepository;
  }
}

// Використання
class ProfileScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final userRepo = ServiceProvider.of(context).userRepository;
    return FutureBuilder<User>(
      future: userRepo.getCurrentUser(),
      builder: (context, snapshot) {
        if (snapshot.hasData) {
          return Text(snapshot.data!.name);
        }
        return const CircularProgressIndicator();
      },
    );
  }
}
```

### 3. Provider (пакет)

Найпопулярніший підхід до DI у Flutter:

```dart
// Реєстрація залежностей
class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        Provider<ApiClient>(create: (_) => ApiClient(baseUrl: 'https://api.example.com')),
        ProxyProvider<ApiClient, UserRepository>(
          update: (_, apiClient, __) => UserRepository(apiClient: apiClient),
        ),
        ProxyProvider<UserRepository, AuthService>(
          update: (_, userRepo, __) => AuthService(userRepository: userRepo),
        ),
        ChangeNotifierProxyProvider<AuthService, UserNotifier>(
          create: (_) => UserNotifier(),
          update: (_, authService, notifier) => notifier!..authService = authService,
        ),
      ],
      child: MaterialApp(home: HomeScreen()),
    );
  }
}

// Отримання залежності
class HomeScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final authService = context.read<AuthService>();
    final user = context.watch<UserNotifier>();

    return Scaffold(
      body: Text(user.currentUser?.name ?? 'Гість'),
      floatingActionButton: FloatingActionButton(
        onPressed: () => authService.logout(),
        child: const Icon(Icons.logout),
      ),
    );
  }
}
```

### 4. GetIt (Service Locator)

Потужний Service Locator, який не залежить від контексту віджетів:

```dart
import 'package:get_it/get_it.dart';

final getIt = GetIt.instance;

/// Реєстрація залежностей
void setupDependencies() {
  // Singleton — один екземпляр на весь час
  getIt.registerSingleton<ApiClient>(
    ApiClient(baseUrl: 'https://api.example.com'),
  );

  // Lazy Singleton — створюється при першому зверненні
  getIt.registerLazySingleton<DatabaseService>(
    () => DatabaseService(),
  );

  // Factory — новий екземпляр при кожному зверненні
  getIt.registerFactory<UserRepository>(
    () => UserRepository(apiClient: getIt<ApiClient>()),
  );

  // Factory з параметрами
  getIt.registerFactoryParam<OrderService, String, void>(
    (userId, _) => OrderService(userId: userId, api: getIt<ApiClient>()),
  );
}

// Використання
class ProfileViewModel {
  final userRepo = getIt<UserRepository>();
  final db = getIt<DatabaseService>();

  Future<User> loadProfile() => userRepo.getCurrentUser();
}

// Ініціалізація у main
void main() {
  setupDependencies();
  runApp(MyApp());
}
```

### 5. Injectable + GetIt (кодогенерація)

Автоматична реєстрація залежностей через анотації:

```dart
import 'package:injectable/injectable.dart';

@singleton
class ApiClient {
  final String baseUrl;

  @factoryMethod
  ApiClient(@Named('baseUrl') this.baseUrl);
}

@lazySingleton
class DatabaseService {
  Future<void> init() async {
    // ініціалізація бази даних
  }
}

@injectable
class UserRepository {
  final ApiClient apiClient;
  final DatabaseService db;

  UserRepository(this.apiClient, this.db);

  Future<User> getUser(int id) => apiClient.fetchUser(id);
}

@injectable
class AuthService {
  final UserRepository userRepository;

  AuthService(this.userRepository);
}
```

Налаштування модуля:

```dart
@InjectableInit()
void configureDependencies() => getIt.init();

@module
abstract class AppModule {
  @Named('baseUrl')
  String get baseUrl => 'https://api.example.com';
}
```

### 6. Riverpod

Сучасний підхід до DI та управління станом:

```dart
import 'package:flutter_riverpod/flutter_riverpod.dart';

// Провайдери залежностей
final apiClientProvider = Provider<ApiClient>((ref) {
  return ApiClient(baseUrl: 'https://api.example.com');
});

final userRepositoryProvider = Provider<UserRepository>((ref) {
  final apiClient = ref.watch(apiClientProvider);
  return UserRepository(apiClient: apiClient);
});

final currentUserProvider = FutureProvider<User>((ref) {
  final userRepo = ref.watch(userRepositoryProvider);
  return userRepo.getCurrentUser();
});

// Використання у віджеті
class ProfileScreen extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final userAsync = ref.watch(currentUserProvider);

    return userAsync.when(
      data: (user) => Text(user.name),
      loading: () => const CircularProgressIndicator(),
      error: (err, stack) => Text('Помилка: $err'),
    );
  }
}

// Точка входу
void main() {
  runApp(
    ProviderScope(child: MyApp()),
  );
}
```

## Scoped залежності

Залежності з обмеженим часом життя (наприклад, на екран):

```dart
// GetIt — scoped registration
void openUserSession(String userId) {
  getIt.pushNewScope(
    init: (getIt) {
      getIt.registerSingleton<UserSession>(
        UserSession(userId: userId),
      );
    },
    scopeName: 'userSession',
  );
}

void closeUserSession() {
  getIt.popScope();
}

// Riverpod — autoDispose
final userSessionProvider = Provider.autoDispose<UserSession>((ref) {
  final session = UserSession();
  ref.onDispose(() => session.close());
  return session;
});
```

## Тестування з DI

```dart
// Створення моків
class MockApiClient extends Mock implements ApiClient {}
class MockUserRepository extends Mock implements UserRepository {}

void main() {
  late MockApiClient mockApi;
  late UserRepository userRepo;

  setUp(() {
    mockApi = MockApiClient();
    userRepo = UserRepository(apiClient: mockApi);
  });

  test('getUser returns user from API', () async {
    final expectedUser = User(id: 1, name: 'John');
    when(() => mockApi.fetchUser(1)).thenAnswer((_) async => expectedUser);

    final result = await userRepo.getUser(1);
    expect(result, expectedUser);
  });
}

// Підміна залежностей у GetIt для тестів
void main() {
  setUp(() {
    getIt.reset();
    getIt.registerSingleton<ApiClient>(MockApiClient());
    getIt.registerFactory<UserRepository>(
      () => UserRepository(apiClient: getIt<ApiClient>()),
    );
  });
}
```

## Порівняння підходів

| Підхід | Переваги | Недоліки |
|---|---|---|
| Constructor Injection | Простота, типобезпека | Ручне прокидання |
| InheritedWidget | Вбудований у Flutter | Багатослівний |
| Provider | Популярний, зручний | Залежить від BuildContext |
| GetIt | Без контексту, потужний | Service Locator — неявні залежності |
| Injectable | Кодогенерація, анотації | Додатковий крок збірки |
| Riverpod | Безпечний, сучасний | Крива навчання |

## Найкращі практики

- **Залежність від абстракцій**: Залежте від інтерфейсів, а не від конкретних реалізацій
- **Єдина точка реєстрації**: Реєструйте всі залежності в одному місці
- **Уникайте циклічних залежностей**: Це ознака поганої архітектури
- **Lazy ініціалізація**: Використовуйте lazy singleton для ресурсомістких залежностей
- **Scoped залежності**: Обмежуйте час життя там, де це можливо
- **Тестованість**: DI повинен спрощувати тестування, а не ускладнювати його
