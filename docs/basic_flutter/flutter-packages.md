# Пакети та плагіни у Flutter

Flutter має багату екосистему пакетів та плагінів, які розширюють функціональність застосунків. Пакети доступні на pub.dev — офіційному репозиторії Dart.

## Управління пакетами

### pubspec.yaml

Файл `pubspec.yaml` містить конфігурацію проєкту та список залежностей.

```yaml
name: my_app
description: Мій Flutter застосунок
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter

  # Стандартні пакети
  http: ^1.1.0
  provider: ^6.0.0
  shared_preferences: ^2.2.0

  # Пакет з git
  my_package:
    git:
      url: https://github.com/user/my_package.git
      ref: main

  # Локальний пакет
  local_package:
    path: ../local_package

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0
  mockito: ^5.4.0
  build_runner: ^2.4.0

flutter:
  uses-material-design: true
  assets:
    - assets/images/
    - assets/fonts/
  fonts:
    - family: CustomFont
      fonts:
        - asset: assets/fonts/CustomFont-Regular.ttf
```

### Команди для роботи з пакетами

```bash
# Встановлення залежностей
flutter pub get

# Оновлення залежностей
flutter pub upgrade

# Перевірка застарілих пакетів
flutter pub outdated

# Додавання пакета
flutter pub add http

# Видалення пакета
flutter pub remove http

# Очищення кешу
flutter pub cache clean
```

## Codegen: генерація коду (Freezed, json_serializable, build_runner)

У Flutter/Dart дуже популярний підхід, коли “рутинний” код генерується автоматично: `fromJson/toJson`, `copyWith`, `==/hashCode`, sealed-класи, іммутабельні моделі.

### build_runner

Зазвичай генерація запускається через `build_runner`:

```bash
flutter pub run build_runner build

# або у watch-режимі
flutter pub run build_runner watch

# якщо є конфлікти/старі згенеровані файли
flutter pub run build_runner build --delete-conflicting-outputs
```

### json_serializable

Підхід: описуємо модель та анотації, генератор створює `.g.dart`.

```yaml
dependencies:
  json_annotation: ^4.9.0

dev_dependencies:
  build_runner: ^2.4.0
  json_serializable: ^6.8.0
```

### Freezed

Freezed корисний для іммутабельних моделей та станів (особливо у BLoC/StateNotifier): зручний `copyWith`, union types, pattern matching.

```yaml
dependencies:
  freezed_annotation: ^2.4.0

dev_dependencies:
  build_runner: ^2.4.0
  freezed: ^2.5.0
```

## Популярні пакети

### HTTP запити

#### http

```dart
import 'package:http/http.dart' as http;
import 'dart:convert';

class ApiService {
  final String baseUrl = 'https://api.example.com';

  Future<List<User>> getUsers() async {
    final response = await http.get(Uri.parse('$baseUrl/users'));

    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      return data.map((json) => User.fromJson(json)).toList();
    } else {
      throw Exception('Помилка завантаження');
    }
  }

  Future<User> createUser(User user) async {
    final response = await http.post(
      Uri.parse('$baseUrl/users'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(user.toJson()),
    );

    if (response.statusCode == 201) {
      return User.fromJson(jsonDecode(response.body));
    } else {
      throw Exception('Помилка створення');
    }
  }
}
```

#### dio

```dart
import 'package:dio/dio.dart';

class DioApiService {
  final Dio _dio = Dio(BaseOptions(
    baseUrl: 'https://api.example.com',
    connectTimeout: Duration(seconds: 5),
    receiveTimeout: Duration(seconds: 3),
  ));

  DioApiService() {
    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) {
        options.headers['Authorization'] = 'Bearer $token';
        return handler.next(options);
      },
      onResponse: (response, handler) {
        return handler.next(response);
      },
      onError: (error, handler) {
        print('Помилка: ${error.message}');
        return handler.next(error);
      },
    ));
  }

  Future<List<User>> getUsers() async {
    try {
      final response = await _dio.get('/users');
      return (response.data as List)
          .map((json) => User.fromJson(json))
          .toList();
    } on DioException catch (e) {
      throw Exception('Помилка: ${e.message}');
    }
  }

  Future<void> uploadFile(File file) async {
    final formData = FormData.fromMap({
      'file': await MultipartFile.fromFile(file.path),
    });

    await _dio.post('/upload', data: formData);
  }
}
```

### Стан застосунку

#### provider

```dart
import 'package:provider/provider.dart';

// Модель стану
class CounterProvider extends ChangeNotifier {
  int _count = 0;

  int get count => _count;

  void increment() {
    _count++;
    notifyListeners();
  }

  void decrement() {
    _count--;
    notifyListeners();
  }
}

// Налаштування
void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => CounterProvider()),
        ChangeNotifierProvider(create: (_) => UserProvider()),
      ],
      child: MyApp(),
    ),
  );
}

// Використання
class CounterScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Consumer<CounterProvider>(
      builder: (context, counter, child) {
        return Text('Лічильник: ${counter.count}');
      },
    );
  }
}

// Або з context
class AnotherWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final counter = context.watch<CounterProvider>();

    return ElevatedButton(
      onPressed: () => context.read<CounterProvider>().increment(),
      child: Text('Збільшити: ${counter.count}'),
    );
  }
}
```

#### riverpod

```dart
import 'package:flutter_riverpod/flutter_riverpod.dart';

// Провайдери
final counterProvider = StateNotifierProvider<CounterNotifier, int>((ref) {
  return CounterNotifier();
});

class CounterNotifier extends StateNotifier<int> {
  CounterNotifier() : super(0);

  void increment() => state++;
  void decrement() => state--;
}

// Провайдер з залежностями
final userProvider = FutureProvider<User>((ref) async {
  final apiService = ref.watch(apiServiceProvider);
  return apiService.getUser();
});

// Налаштування
void main() {
  runApp(
    ProviderScope(child: MyApp()),
  );
}

// Використання
class CounterWidget extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final count = ref.watch(counterProvider);

    return Column(
      children: [
        Text('Лічильник: $count'),
        ElevatedButton(
          onPressed: () => ref.read(counterProvider.notifier).increment(),
          child: Text('Збільшити'),
        ),
      ],
    );
  }
}
```

### Локальне сховище

#### shared_preferences

```dart
import 'package:shared_preferences/shared_preferences.dart';

class PreferencesService {
  static const String _keyTheme = 'theme_mode';
  static const String _keyUser = 'user_data';

  Future<void> setThemeMode(String mode) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_keyTheme, mode);
  }

  Future<String?> getThemeMode() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_keyTheme);
  }

  Future<void> saveUser(User user) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_keyUser, jsonEncode(user.toJson()));
  }

  Future<User?> getUser() async {
    final prefs = await SharedPreferences.getInstance();
    final data = prefs.getString(_keyUser);
    if (data != null) {
      return User.fromJson(jsonDecode(data));
    }
    return null;
  }

  Future<void> clearAll() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
  }
}
```

#### hive

```dart
import 'package:hive_flutter/hive_flutter.dart';

// Модель
@HiveType(typeId: 0)
class User extends HiveObject {
  @HiveField(0)
  String name;

  @HiveField(1)
  String email;

  @HiveField(2)
  int age;

  User({required this.name, required this.email, required this.age});
}

// Ініціалізація
Future<void> main() async {
  await Hive.initFlutter();
  Hive.registerAdapter(UserAdapter());
  await Hive.openBox<User>('users');

  runApp(MyApp());
}

// Використання
class UserRepository {
  final Box<User> _box = Hive.box<User>('users');

  List<User> getAll() => _box.values.toList();

  User? get(String key) => _box.get(key);

  Future<void> add(User user) async {
    await _box.add(user);
  }

  Future<void> put(String key, User user) async {
    await _box.put(key, user);
  }

  Future<void> delete(String key) async {
    await _box.delete(key);
  }

  // Реактивне оновлення
  ValueListenable<Box<User>> get listenable => _box.listenable();
}

// Віджет з реактивним оновленням
class UserListWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<Box<User>>(
      valueListenable: Hive.box<User>('users').listenable(),
      builder: (context, box, _) {
        final users = box.values.toList();
        return ListView.builder(
          itemCount: users.length,
          itemBuilder: (context, index) {
            return ListTile(title: Text(users[index].name));
          },
        );
      },
    );
  }
}
```

### Навігація

#### go_router

```dart
import 'package:go_router/go_router.dart';

final router = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => HomeScreen(),
    ),
    GoRoute(
      path: '/user/:id',
      builder: (context, state) {
        final id = state.pathParameters['id']!;
        return UserScreen(userId: id);
      },
    ),
    GoRoute(
      path: '/settings',
      builder: (context, state) => SettingsScreen(),
      routes: [
        GoRoute(
          path: 'profile',
          builder: (context, state) => ProfileSettingsScreen(),
        ),
      ],
    ),
  ],
  errorBuilder: (context, state) => ErrorScreen(),
  redirect: (context, state) {
    final isLoggedIn = authService.isLoggedIn;
    final isLoginRoute = state.matchedLocation == '/login';

    if (!isLoggedIn && !isLoginRoute) {
      return '/login';
    }
    if (isLoggedIn && isLoginRoute) {
      return '/';
    }
    return null;
  },
);

// Використання
void main() {
  runApp(
    MaterialApp.router(
      routerConfig: router,
    ),
  );
}

// Навігація
context.go('/user/123');
context.push('/settings');
context.pop();
```

### Зображення

#### cached_network_image

```dart
import 'package:cached_network_image/cached_network_image.dart';

CachedNetworkImage(
  imageUrl: 'https://example.com/image.jpg',
  placeholder: (context, url) => CircularProgressIndicator(),
  errorWidget: (context, url, error) => Icon(Icons.error),
  fit: BoxFit.cover,
  width: 200,
  height: 200,
)

// Кешування з налаштуваннями
CachedNetworkImage(
  imageUrl: imageUrl,
  cacheManager: CacheManager(
    Config(
      'customCacheKey',
      stalePeriod: Duration(days: 7),
      maxNrOfCacheObjects: 100,
    ),
  ),
)
```

### Іконки

#### flutter_svg

```dart
import 'package:flutter_svg/flutter_svg.dart';

// З активів
SvgPicture.asset(
  'assets/icons/icon.svg',
  width: 24,
  height: 24,
  colorFilter: ColorFilter.mode(Colors.blue, BlendMode.srcIn),
)

// З мережі
SvgPicture.network(
  'https://example.com/icon.svg',
  placeholderBuilder: (context) => CircularProgressIndicator(),
)

// З рядка
SvgPicture.string(
  '<svg>...</svg>',
)
```

### Анімації

#### flutter_animate

```dart
import 'package:flutter_animate/flutter_animate.dart';

Text('Привіт!')
    .animate()
    .fadeIn(duration: 500.ms)
    .slide()
    .then()
    .shake()

// Каскадні анімації
Column(
  children: [
    Text('Перший'),
    Text('Другий'),
    Text('Третій'),
  ],
)
    .animate(interval: 100.ms)
    .fadeIn()
    .slideX()

// Повторювані анімації
Icon(Icons.favorite)
    .animate(onPlay: (controller) => controller.repeat())
    .scale(duration: 1.s)
```

### Форми

#### flutter_form_builder

```dart
import 'package:flutter_form_builder/flutter_form_builder.dart';
import 'package:form_builder_validators/form_builder_validators.dart';

class MyForm extends StatelessWidget {
  final _formKey = GlobalKey<FormBuilderState>();

  @override
  Widget build(BuildContext context) {
    return FormBuilder(
      key: _formKey,
      child: Column(
        children: [
          FormBuilderTextField(
            name: 'email',
            decoration: InputDecoration(labelText: 'Email'),
            validator: FormBuilderValidators.compose([
              FormBuilderValidators.required(),
              FormBuilderValidators.email(),
            ]),
          ),
          FormBuilderDropdown<String>(
            name: 'country',
            decoration: InputDecoration(labelText: 'Країна'),
            items: ['Україна', 'Польща', 'Німеччина']
                .map((country) => DropdownMenuItem(
                      value: country,
                      child: Text(country),
                    ))
                .toList(),
            validator: FormBuilderValidators.required(),
          ),
          FormBuilderDateTimePicker(
            name: 'date',
            decoration: InputDecoration(labelText: 'Дата'),
            inputType: InputType.date,
          ),
          FormBuilderCheckbox(
            name: 'agree',
            title: Text('Я погоджуюсь'),
            validator: FormBuilderValidators.equal(true),
          ),
          ElevatedButton(
            onPressed: () {
              if (_formKey.currentState?.saveAndValidate() ?? false) {
                final data = _formKey.currentState!.value;
                print(data);
              }
            },
            child: Text('Надіслати'),
          ),
        ],
      ),
    );
  }
}
```

### Інтернаціоналізація

#### intl та flutter_localizations

```dart
// pubspec.yaml
dependencies:
  flutter_localizations:
    sdk: flutter
  intl: ^0.18.0

// lib/l10n/app_uk.arb
{
  "@@locale": "uk",
  "appTitle": "Мій застосунок",
  "greeting": "Привіт, {name}!",
  "@greeting": {
    "placeholders": {
      "name": {}
    }
  },
  "itemCount": "{count, plural, =0{Немає елементів} =1{1 елемент} other{{count} елементів}}",
  "@itemCount": {
    "placeholders": {
      "count": {}
    }
  }
}

// main.dart
MaterialApp(
  localizationsDelegates: [
    AppLocalizations.delegate,
    GlobalMaterialLocalizations.delegate,
    GlobalWidgetsLocalizations.delegate,
  ],
  supportedLocales: [
    Locale('uk'),
    Locale('en'),
  ],
  home: MyHomePage(),
)

// Використання
Text(AppLocalizations.of(context)!.appTitle)
Text(AppLocalizations.of(context)!.greeting('Іван'))
Text(AppLocalizations.of(context)!.itemCount(5))
```

## Створення власного пакета

### Структура пакета

```
my_package/
├── lib/
│   ├── my_package.dart
│   └── src/
│       ├── my_widget.dart
│       └── my_service.dart
├── test/
│   └── my_package_test.dart
├── example/
│   └── lib/
│       └── main.dart
├── pubspec.yaml
├── README.md
├── CHANGELOG.md
└── LICENSE
```

### pubspec.yaml пакета

```yaml
name: my_package
description: Опис мого пакета
version: 1.0.0
homepage: https://github.com/user/my_package

environment:
  sdk: '>=3.0.0 <4.0.0'
  flutter: '>=3.0.0'

dependencies:
  flutter:
    sdk: flutter

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0
```

### Публікація

```bash
# Перевірка перед публікацією
flutter pub publish --dry-run

# Публікація
flutter pub publish
```

## Найкращі практики

1. **Перевіряйте сумісність** — дивіться на підтримувані версії Flutter/Dart.

2. **Використовуйте перевірені пакети** — з високим рейтингом та активною підтримкою.

3. **Фіксуйте версії** — використовуйте конкретні версії або діапазони.

4. **Регулярно оновлюйте** — перевіряйте `flutter pub outdated`.

5. **Читайте документацію** — кожен пакет має власні особливості.

## Висновок

Екосистема пакетів Flutter постійно розвивається. Правильний вибір та використання пакетів може значно прискорити розробку та покращити якість застосунку. Завжди перевіряйте надійність пакета перед його використанням у продакшн-проєктах.
