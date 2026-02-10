# Архітектура застосунків Flutter

Правильна архітектура забезпечує масштабованість, тестованість та підтримуваність застосунку. Розглянемо популярні архітектурні патерни для Flutter.

## Clean Architecture

Clean Architecture розділяє код на шари з чіткими залежностями.

### Структура проєкту

```
lib/
├── core/
│   ├── error/
│   │   ├── exceptions.dart
│   │   └── failures.dart
│   ├── usecases/
│   │   └── usecase.dart
│   └── utils/
│       └── constants.dart
├── features/
│   └── user/
│       ├── data/
│       │   ├── datasources/
│       │   │   ├── user_local_datasource.dart
│       │   │   └── user_remote_datasource.dart
│       │   ├── models/
│       │   │   └── user_model.dart
│       │   └── repositories/
│       │       └── user_repository_impl.dart
│       ├── domain/
│       │   ├── entities/
│       │   │   └── user.dart
│       │   ├── repositories/
│       │   │   └── user_repository.dart
│       │   └── usecases/
│       │       ├── get_user.dart
│       │       └── update_user.dart
│       └── presentation/
│           ├── bloc/
│           │   ├── user_bloc.dart
│           │   ├── user_event.dart
│           │   └── user_state.dart
│           ├── pages/
│           │   └── user_page.dart
│           └── widgets/
│               └── user_card.dart
└── injection_container.dart
```

### Domain Layer

```dart
// Сутність (Entity)
class User {
  final String id;
  final String name;
  final String email;

  const User({
    required this.id,
    required this.name,
    required this.email,
  });
}

// Абстрактний репозиторій
abstract class UserRepository {
  Future<Either<Failure, User>> getUser(String id);
  Future<Either<Failure, void>> updateUser(User user);
  Future<Either<Failure, List<User>>> getAllUsers();
}

// UseCase
abstract class UseCase<Type, Params> {
  Future<Either<Failure, Type>> call(Params params);
}

class GetUser implements UseCase<User, GetUserParams> {
  final UserRepository repository;

  GetUser(this.repository);

  @override
  Future<Either<Failure, User>> call(GetUserParams params) {
    return repository.getUser(params.id);
  }
}

class GetUserParams {
  final String id;

  GetUserParams({required this.id});
}
```

### Data Layer

```dart
// Модель даних
class UserModel extends User {
  const UserModel({
    required String id,
    required String name,
    required String email,
  }) : super(id: id, name: name, email: email);

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'],
      name: json['name'],
      email: json['email'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
    };
  }
}

// Remote Data Source
abstract class UserRemoteDataSource {
  Future<UserModel> getUser(String id);
  Future<void> updateUser(UserModel user);
}

class UserRemoteDataSourceImpl implements UserRemoteDataSource {
  final http.Client client;

  UserRemoteDataSourceImpl({required this.client});

  @override
  Future<UserModel> getUser(String id) async {
    final response = await client.get(
      Uri.parse('$baseUrl/users/$id'),
    );

    if (response.statusCode == 200) {
      return UserModel.fromJson(json.decode(response.body));
    } else {
      throw ServerException();
    }
  }

  @override
  Future<void> updateUser(UserModel user) async {
    final response = await client.put(
      Uri.parse('$baseUrl/users/${user.id}'),
      body: json.encode(user.toJson()),
    );

    if (response.statusCode != 200) {
      throw ServerException();
    }
  }
}

// Repository Implementation
class UserRepositoryImpl implements UserRepository {
  final UserRemoteDataSource remoteDataSource;
  final UserLocalDataSource localDataSource;
  final NetworkInfo networkInfo;

  UserRepositoryImpl({
    required this.remoteDataSource,
    required this.localDataSource,
    required this.networkInfo,
  });

  @override
  Future<Either<Failure, User>> getUser(String id) async {
    if (await networkInfo.isConnected) {
      try {
        final user = await remoteDataSource.getUser(id);
        await localDataSource.cacheUser(user);
        return Right(user);
      } on ServerException {
        return Left(ServerFailure());
      }
    } else {
      try {
        final user = await localDataSource.getCachedUser(id);
        return Right(user);
      } on CacheException {
        return Left(CacheFailure());
      }
    }
  }
}
```

### Presentation Layer (BLoC)

```dart
// Events
abstract class UserEvent {}

class GetUserEvent extends UserEvent {
  final String id;
  GetUserEvent(this.id);
}

class UpdateUserEvent extends UserEvent {
  final User user;
  UpdateUserEvent(this.user);
}

// States
abstract class UserState {}

class UserInitial extends UserState {}

class UserLoading extends UserState {}

class UserLoaded extends UserState {
  final User user;
  UserLoaded(this.user);
}

class UserError extends UserState {
  final String message;
  UserError(this.message);
}

// BLoC
class UserBloc extends Bloc<UserEvent, UserState> {
  final GetUser getUser;
  final UpdateUser updateUser;

  UserBloc({
    required this.getUser,
    required this.updateUser,
  }) : super(UserInitial()) {
    on<GetUserEvent>(_onGetUser);
    on<UpdateUserEvent>(_onUpdateUser);
  }

  Future<void> _onGetUser(
    GetUserEvent event,
    Emitter<UserState> emit,
  ) async {
    emit(UserLoading());

    final result = await getUser(GetUserParams(id: event.id));

    result.fold(
      (failure) => emit(UserError(_mapFailureToMessage(failure))),
      (user) => emit(UserLoaded(user)),
    );
  }

  String _mapFailureToMessage(Failure failure) {
    switch (failure.runtimeType) {
      case ServerFailure:
        return 'Помилка сервера';
      case CacheFailure:
        return 'Помилка кешу';
      default:
        return 'Невідома помилка';
    }
  }
}
```

## MVVM (Model-View-ViewModel)

### Структура

```
lib/
├── models/
│   └── user.dart
├── services/
│   └── user_service.dart
├── viewmodels/
│   └── user_viewmodel.dart
└── views/
    └── user_view.dart
```

### Реалізація

```dart
// Model
class User {
  final String id;
  final String name;
  final String email;

  User({required this.id, required this.name, required this.email});

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      name: json['name'],
      email: json['email'],
    );
  }
}

// Service
class UserService {
  final http.Client _client;

  UserService(this._client);

  Future<User> getUser(String id) async {
    final response = await _client.get(Uri.parse('$baseUrl/users/$id'));
    return User.fromJson(json.decode(response.body));
  }

  Future<List<User>> getUsers() async {
    final response = await _client.get(Uri.parse('$baseUrl/users'));
    final List data = json.decode(response.body);
    return data.map((json) => User.fromJson(json)).toList();
  }
}

// ViewModel
class UserViewModel extends ChangeNotifier {
  final UserService _userService;

  User? _user;
  List<User> _users = [];
  bool _isLoading = false;
  String? _error;

  User? get user => _user;
  List<User> get users => _users;
  bool get isLoading => _isLoading;
  String? get error => _error;

  UserViewModel(this._userService);

  Future<void> loadUser(String id) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _user = await _userService.getUser(id);
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> loadUsers() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _users = await _userService.getUsers();
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}

// View
class UserView extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => UserViewModel(context.read<UserService>())..loadUsers(),
      child: Consumer<UserViewModel>(
        builder: (context, viewModel, child) {
          if (viewModel.isLoading) {
            return Center(child: CircularProgressIndicator());
          }

          if (viewModel.error != null) {
            return Center(child: Text('Помилка: ${viewModel.error}'));
          }

          return ListView.builder(
            itemCount: viewModel.users.length,
            itemBuilder: (context, index) {
              final user = viewModel.users[index];
              return ListTile(
                title: Text(user.name),
                subtitle: Text(user.email),
              );
            },
          );
        },
      ),
    );
  }
}
```

## Repository Pattern

```dart
// Абстрактний репозиторій
abstract class Repository<T> {
  Future<List<T>> getAll();
  Future<T?> getById(String id);
  Future<void> create(T item);
  Future<void> update(T item);
  Future<void> delete(String id);
}

// Реалізація
class UserRepository implements Repository<User> {
  final ApiClient _apiClient;
  final LocalStorage _localStorage;

  UserRepository(this._apiClient, this._localStorage);

  @override
  Future<List<User>> getAll() async {
    try {
      final users = await _apiClient.getUsers();
      await _localStorage.saveUsers(users);
      return users;
    } catch (e) {
      // Повернути кешовані дані при помилці
      return _localStorage.getUsers();
    }
  }

  @override
  Future<User?> getById(String id) async {
    try {
      return await _apiClient.getUser(id);
    } catch (e) {
      return _localStorage.getUser(id);
    }
  }

  @override
  Future<void> create(User user) async {
    await _apiClient.createUser(user);
    await _localStorage.saveUser(user);
  }

  @override
  Future<void> update(User user) async {
    await _apiClient.updateUser(user);
    await _localStorage.saveUser(user);
  }

  @override
  Future<void> delete(String id) async {
    await _apiClient.deleteUser(id);
    await _localStorage.deleteUser(id);
  }
}
```

## Dependency Injection

### get_it

```dart
import 'package:get_it/get_it.dart';

final sl = GetIt.instance;

Future<void> init() async {
  // BLoCs
  sl.registerFactory(
    () => UserBloc(getUser: sl(), updateUser: sl()),
  );

  // Use cases
  sl.registerLazySingleton(() => GetUser(sl()));
  sl.registerLazySingleton(() => UpdateUser(sl()));

  // Repository
  sl.registerLazySingleton<UserRepository>(
    () => UserRepositoryImpl(
      remoteDataSource: sl(),
      localDataSource: sl(),
      networkInfo: sl(),
    ),
  );

  // Data sources
  sl.registerLazySingleton<UserRemoteDataSource>(
    () => UserRemoteDataSourceImpl(client: sl()),
  );
  sl.registerLazySingleton<UserLocalDataSource>(
    () => UserLocalDataSourceImpl(sharedPreferences: sl()),
  );

  // External
  final sharedPreferences = await SharedPreferences.getInstance();
  sl.registerLazySingleton(() => sharedPreferences);
  sl.registerLazySingleton(() => http.Client());
  sl.registerLazySingleton<NetworkInfo>(() => NetworkInfoImpl(sl()));
}

// Використання
void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await init();
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: BlocProvider(
        create: (_) => sl<UserBloc>(),
        child: UserPage(),
      ),
    );
  }
}
```

### injectable

```dart
import 'package:injectable/injectable.dart';
import 'package:get_it/get_it.dart';

final getIt = GetIt.instance;

@InjectableInit()
void configureDependencies() => getIt.init();

// Анотації
@injectable
class UserService {
  final ApiClient _client;

  UserService(this._client);
}

@lazySingleton
class ApiClient {
  final http.Client _httpClient;

  ApiClient(this._httpClient);
}

@module
abstract class RegisterModule {
  @lazySingleton
  http.Client get httpClient => http.Client();

  @preResolve
  Future<SharedPreferences> get prefs => SharedPreferences.getInstance();
}
```

## State Management Patterns

### BLoC Pattern

```dart
// Події
sealed class CounterEvent {}

class IncrementEvent extends CounterEvent {}
class DecrementEvent extends CounterEvent {}
class ResetEvent extends CounterEvent {}

// Стан
class CounterState {
  final int count;
  final bool isLoading;

  const CounterState({
    this.count = 0,
    this.isLoading = false,
  });

  CounterState copyWith({int? count, bool? isLoading}) {
    return CounterState(
      count: count ?? this.count,
      isLoading: isLoading ?? this.isLoading,
    );
  }
}

// BLoC
class CounterBloc extends Bloc<CounterEvent, CounterState> {
  CounterBloc() : super(const CounterState()) {
    on<IncrementEvent>((event, emit) {
      emit(state.copyWith(count: state.count + 1));
    });

    on<DecrementEvent>((event, emit) {
      emit(state.copyWith(count: state.count - 1));
    });

    on<ResetEvent>((event, emit) {
      emit(const CounterState());
    });
  }
}
```

### Cubit Pattern

```dart
class CounterCubit extends Cubit<int> {
  CounterCubit() : super(0);

  void increment() => emit(state + 1);
  void decrement() => emit(state - 1);
  void reset() => emit(0);
}

// Використання
BlocBuilder<CounterCubit, int>(
  builder: (context, count) {
    return Text('$count');
  },
)
```

## Error Handling

```dart
// Базовий клас помилки
abstract class Failure {
  final String message;
  const Failure(this.message);
}

class ServerFailure extends Failure {
  const ServerFailure([String message = 'Помилка сервера']) : super(message);
}

class CacheFailure extends Failure {
  const CacheFailure([String message = 'Помилка кешу']) : super(message);
}

class NetworkFailure extends Failure {
  const NetworkFailure([String message = 'Немає з\'єднання']) : super(message);
}

// Either для обробки результатів
import 'package:dartz/dartz.dart';

Future<Either<Failure, User>> getUser(String id) async {
  try {
    final user = await remoteDataSource.getUser(id);
    return Right(user);
  } on ServerException {
    return Left(ServerFailure());
  } on NetworkException {
    return Left(NetworkFailure());
  }
}

// Обробка в UI
result.fold(
  (failure) => showError(failure.message),
  (user) => showUser(user),
);
```

## Testing Architecture

```dart
// Mock repository
class MockUserRepository extends Mock implements UserRepository {}

// Unit test для UseCase
void main() {
  late GetUser usecase;
  late MockUserRepository mockRepository;

  setUp(() {
    mockRepository = MockUserRepository();
    usecase = GetUser(mockRepository);
  });

  final tUser = User(id: '1', name: 'Test', email: 'test@test.com');

  test('should get user from repository', () async {
    // arrange
    when(() => mockRepository.getUser(any()))
        .thenAnswer((_) async => Right(tUser));

    // act
    final result = await usecase(GetUserParams(id: '1'));

    // assert
    expect(result, Right(tUser));
    verify(() => mockRepository.getUser('1'));
  });
}

// Widget test з BLoC
void main() {
  late UserBloc bloc;

  setUp(() {
    bloc = MockUserBloc();
  });

  testWidgets('shows user when loaded', (tester) async {
    when(() => bloc.state).thenReturn(UserLoaded(tUser));

    await tester.pumpWidget(
      BlocProvider.value(
        value: bloc,
        child: MaterialApp(home: UserPage()),
      ),
    );

    expect(find.text('Test'), findsOneWidget);
  });
}
```

## Найкращі практики

1. **Розділяйте шари** — Domain не повинен залежати від Data чи Presentation.

2. **Використовуйте Dependency Injection** — для тестованості та гнучкості.

3. **Обробляйте помилки явно** — використовуйте Either або sealed classes.

4. **Пишіть тести** — для кожного шару окремо.

5. **Документуйте архітектурні рішення** — для команди.

## Висновок

Правильна архітектура — це інвестиція в майбутнє проєкту. Clean Architecture, MVVM та інші патерни допомагають створювати масштабовані та підтримувані застосунки. Вибір архітектури залежить від розміру проєкту та вимог команди.
