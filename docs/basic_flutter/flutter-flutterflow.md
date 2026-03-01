# FlutterFlow

FlutterFlow — это визуальная платформа для разработки приложений на Flutter, которая позволяет создавать полноценные мобильные и веб-приложения без глубоких знаний программирования (low-code/no-code). При этом FlutterFlow генерирует чистый Dart/Flutter код, который можно экспортировать и модифицировать.

## Основные концепции

### Что такое FlutterFlow?

FlutterFlow — это облачная IDE (интегрированная среда разработки) с визуальным drag-and-drop интерфейсом, которая:

* Строится поверх Flutter и Dart
* Позволяет создавать приложения визуально без написания кода
* Генерирует чистый Flutter/Dart код
* Поддерживает экспорт кода для дальнейшей разработки
* Интегрируется с Firebase, Supabase, REST API и другими бэкендами

```
FlutterFlow → генерирует → Flutter/Dart код → компилируется → нативное приложение
```

### Преимущества FlutterFlow

| Преимущество | Описание |
|---|---|
| Быстрая разработка | Прототипирование и MVP за считанные дни |
| Визуальный конструктор | Drag-and-drop для построения UI |
| Чистый код | Генерирует читаемый Flutter/Dart код |
| Firebase интеграция | Встроенная поддержка Firebase |
| Реальное время | Предварительный просмотр изменений в реальном времени |
| Командная работа | Совместная работа в облаке |
| Экспорт кода | Полный экспорт Flutter проекта |

### Недостатки и ограничения

* **Ограниченная кастомизация** — сложная логика может потребовать Custom Code
* **Зависимость от платформы** — без интернета работать невозможно
* **Стоимость** — платные планы для серьёзных проектов
* **Ограничения виджетов** — не все Flutter-виджеты доступны визуально
* **Производительность** — сгенерированный код может быть менее оптимизированным, чем написанный вручную

## Архитектура FlutterFlow проекта

### Структура проекта

```
my_flutterflow_app/
├── lib/
│   ├── main.dart                    # Точка входа
│   ├── app_state.dart               # Глобальное состояние приложения
│   ├── flutter_flow/
│   │   ├── flutter_flow_theme.dart   # Тема оформления
│   │   ├── flutter_flow_util.dart    # Утилиты
│   │   ├── flutter_flow_widgets.dart # Кастомные виджеты FF
│   │   └── nav/                      # Навигация
│   ├── pages/                        # Страницы приложения
│   ├── components/                   # Переиспользуемые компоненты
│   ├── backend/
│   │   ├── firebase/                 # Firebase конфигурация
│   │   ├── api_requests/             # API запросы
│   │   └── schema/                   # Схемы данных
│   └── auth/                         # Аутентификация
├── assets/                           # Изображения, шрифты
└── pubspec.yaml                      # Зависимости
```

### Страницы (Pages)

Страницы — это основные экраны приложения. Каждая страница в FlutterFlow автоматически генерирует отдельный файл:

```dart
class HomePageWidget extends StatefulWidget {
  const HomePageWidget({Key? key}) : super(key: key);

  @override
  _HomePageWidgetState createState() => _HomePageWidgetState();
}

class _HomePageWidgetState extends State<HomePageWidget> {
  final scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: scaffoldKey,
      backgroundColor: FlutterFlowTheme.of(context).primaryBackground,
      appBar: AppBar(
        title: Text('Home Page'),
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Содержимое страницы
          ],
        ),
      ),
    );
  }
}
```

### Компоненты (Components)

Компоненты — это переиспользуемые части UI, аналог Custom Widgets во Flutter:

```dart
class CustomButtonWidget extends StatefulWidget {
  const CustomButtonWidget({
    Key? key,
    required this.buttonText,
    this.onPressed,
  }) : super(key: key);

  final String buttonText;
  final Future<dynamic> Function()? onPressed;

  @override
  _CustomButtonWidgetState createState() => _CustomButtonWidgetState();
}

class _CustomButtonWidgetState extends State<CustomButtonWidget> {
  @override
  Widget build(BuildContext context) {
    return FFButtonWidget(
      onPressed: () async {
        await widget.onPressed?.call();
      },
      text: widget.buttonText,
      options: FFButtonOptions(
        height: 40,
        color: FlutterFlowTheme.of(context).primaryColor,
        textStyle: FlutterFlowTheme.of(context).subtitle2,
        borderRadius: BorderRadius.circular(8),
      ),
    );
  }
}
```

## State Management в FlutterFlow

### App State (Глобальное состояние)

FlutterFlow предоставляет встроенный механизм управления глобальным состоянием:

```dart
class FFAppState extends ChangeNotifier {
  static FFAppState _instance = FFAppState._internal();
  factory FFAppState() => _instance;
  FFAppState._internal();

  // Переменные состояния
  String _userName = '';
  String get userName => _userName;
  set userName(String value) {
    _userName = value;
    notifyListeners();
  }

  List<String> _cartItems = [];
  List<String> get cartItems => _cartItems;
  void addToCart(String item) {
    _cartItems.add(item);
    notifyListeners();
  }

  // Персистентное состояние (сохраняется между сессиями)
  bool _isDarkMode = false;
  bool get isDarkMode => _isDarkMode;
  set isDarkMode(bool value) {
    _isDarkMode = value;
    // Сохраняется в SharedPreferences
    notifyListeners();
  }
}
```

### Page State (Локальное состояние)

Локальное состояние страницы хранится в State-классе виджета:

```dart
class _MyPageWidgetState extends State<MyPageWidget> {
  // Локальные переменные состояния
  bool _isLoading = false;
  String _searchQuery = '';
  List<dynamic> _results = [];

  // Контроллеры форм
  final _textController = TextEditingController();

  @override
  void dispose() {
    _textController.dispose();
    super.dispose();
  }
}
```

### Component State

Компоненты могут иметь своё внутреннее состояние и принимать параметры от родительских виджетов.

## Интеграция с Firebase

### Firestore Database

FlutterFlow имеет глубокую интеграцию с Firebase Firestore:

```dart
// Чтение коллекции
final querySnapshot = await FirebaseFirestore.instance
    .collection('users')
    .where('isActive', isEqualTo: true)
    .orderBy('createdAt', descending: true)
    .limit(10)
    .get();

// Запись документа
await FirebaseFirestore.instance.collection('users').add({
  'name': userName,
  'email': userEmail,
  'createdAt': FieldValue.serverTimestamp(),
});

// Обновление документа
await FirebaseFirestore.instance
    .collection('users')
    .doc(userId)
    .update({'name': newName});

// Удаление документа
await FirebaseFirestore.instance
    .collection('users')
    .doc(userId)
    .delete();
```

### Firebase Authentication

FlutterFlow поддерживает различные методы аутентификации:

```dart
// Email/Password
final userCredential = await FirebaseAuth.instance
    .createUserWithEmailAndPassword(
      email: email,
      password: password,
    );

// Google Sign-In
final googleUser = await GoogleSignIn().signIn();
final googleAuth = await googleUser?.authentication;
final credential = GoogleAuthProvider.credential(
  accessToken: googleAuth?.accessToken,
  idToken: googleAuth?.idToken,
);
await FirebaseAuth.instance.signInWithCredential(credential);

// Проверка авторизации
if (FirebaseAuth.instance.currentUser != null) {
  // Пользователь авторизован
}
```

### Firebase Storage

```dart
// Загрузка файла
final ref = FirebaseStorage.instance
    .ref()
    .child('uploads/${DateTime.now().millisecondsSinceEpoch}.jpg');
await ref.putFile(File(filePath));
final downloadUrl = await ref.getDownloadURL();
```

## API Calls

### REST API интеграция

FlutterFlow позволяет интегрировать любые REST API:

```dart
class ApiCallResponse {
  final int statusCode;
  final Map<String, dynamic>? jsonBody;

  ApiCallResponse({required this.statusCode, this.jsonBody});

  bool get succeeded => statusCode >= 200 && statusCode < 300;
}

// GET запрос
Future<ApiCallResponse> getUsers() async {
  final response = await http.get(
    Uri.parse('https://api.example.com/users'),
    headers: {
      'Authorization': 'Bearer $token',
      'Content-Type': 'application/json',
    },
  );
  return ApiCallResponse(
    statusCode: response.statusCode,
    jsonBody: jsonDecode(response.body),
  );
}

// POST запрос
Future<ApiCallResponse> createUser(String name, String email) async {
  final response = await http.post(
    Uri.parse('https://api.example.com/users'),
    headers: {'Content-Type': 'application/json'},
    body: jsonEncode({'name': name, 'email': email}),
  );
  return ApiCallResponse(
    statusCode: response.statusCode,
    jsonBody: jsonDecode(response.body),
  );
}
```

### Supabase интеграция

FlutterFlow также поддерживает Supabase как альтернативу Firebase:

```dart
// Инициализация
final supabase = Supabase.instance.client;

// Чтение данных
final data = await supabase
    .from('users')
    .select()
    .eq('is_active', true)
    .order('created_at', ascending: false)
    .limit(10);

// Запись данных
await supabase.from('users').insert({
  'name': userName,
  'email': userEmail,
});
```

## Навигация в FlutterFlow

### GoRouter (FlutterFlow Navigation 2.0)

FlutterFlow использует GoRouter для навигации:

```dart
// Определение маршрутов
GoRouter router = GoRouter(
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => HomePageWidget(),
    ),
    GoRoute(
      path: '/profile/:userId',
      builder: (context, state) => ProfilePageWidget(
        userId: state.pathParameters['userId']!,
      ),
    ),
    GoRoute(
      path: '/settings',
      builder: (context, state) => SettingsPageWidget(),
    ),
  ],
);

// Переход между страницами
context.pushNamed('ProfilePage', pathParameters: {'userId': '123'});

// Передача параметров
context.pushNamed(
  'DetailsPage',
  queryParameters: {'tab': 'reviews'},
  extra: myDataObject,
);

// Возврат назад
context.pop();
```

## Custom Code

### Custom Functions

FlutterFlow позволяет писать собственные функции на Dart:

```dart
// Custom Function
String formatPrice(double price, String currency) {
  final formatter = NumberFormat.currency(
    symbol: currency,
    decimalDigits: 2,
  );
  return formatter.format(price);
}

// Custom Function с асинхронностью
Future<List<Map<String, dynamic>>> fetchFilteredData(
  String category,
  int limit,
) async {
  final response = await http.get(
    Uri.parse('https://api.example.com/items?category=$category&limit=$limit'),
  );
  if (response.statusCode == 200) {
    return List<Map<String, dynamic>>.from(jsonDecode(response.body));
  }
  return [];
}
```

### Custom Widgets

Можно создавать полностью кастомные виджеты:

```dart
class CustomChartWidget extends StatefulWidget {
  const CustomChartWidget({
    Key? key,
    this.width,
    this.height,
    required this.data,
    this.chartColor,
  }) : super(key: key);

  final double? width;
  final double? height;
  final List<double> data;
  final Color? chartColor;

  @override
  _CustomChartWidgetState createState() => _CustomChartWidgetState();
}

class _CustomChartWidgetState extends State<CustomChartWidget> {
  @override
  Widget build(BuildContext context) {
    return Container(
      width: widget.width,
      height: widget.height,
      child: CustomPaint(
        painter: ChartPainter(
          data: widget.data,
          color: widget.chartColor ?? Colors.blue,
        ),
      ),
    );
  }
}
```

### Custom Actions

Custom Actions — это логика, которая выполняется при определённых событиях:

```dart
Future<void> customAction(BuildContext context) async {
  // Показать диалог подтверждения
  final confirmed = await showDialog<bool>(
    context: context,
    builder: (context) => AlertDialog(
      title: Text('Подтверждение'),
      content: Text('Вы уверены?'),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context, false),
          child: Text('Отмена'),
        ),
        TextButton(
          onPressed: () => Navigator.pop(context, true),
          child: Text('Да'),
        ),
      ],
    ),
  );

  if (confirmed == true) {
    // Выполнить действие
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Действие выполнено!')),
    );
  }
}
```

## Темы и стилизация

### FlutterFlow Theme System

```dart
// Использование темы
Text(
  'Hello World',
  style: FlutterFlowTheme.of(context).headlineMedium.override(
    fontFamily: 'Outfit',
    color: FlutterFlowTheme.of(context).primaryText,
    fontSize: 24,
    fontWeight: FontWeight.bold,
  ),
);

// Цвета темы
FlutterFlowTheme.of(context).primary;           // Основной цвет
FlutterFlowTheme.of(context).secondary;          // Вторичный цвет
FlutterFlowTheme.of(context).primaryBackground;  // Фон
FlutterFlowTheme.of(context).primaryText;        // Текст
FlutterFlowTheme.of(context).error;              // Ошибка

// Переключение тем (Light/Dark)
setDarkModeSetting(context, ThemeMode.dark);
setDarkModeSetting(context, ThemeMode.light);
setDarkModeSetting(context, ThemeMode.system);
```

## Анимации

### Встроенные анимации FlutterFlow

FlutterFlow предоставляет готовые анимации, которые можно применить к любому виджету:

```dart
// Fade In анимация
animationsMap['containerOnPageLoadAnimation'] = AnimationInfo(
  trigger: AnimationTrigger.onPageLoad,
  effects: [
    FadeEffect(
      curve: Curves.easeInOut,
      delay: 0.ms,
      duration: 600.ms,
      begin: 0.0,
      end: 1.0,
    ),
    MoveEffect(
      curve: Curves.easeInOut,
      delay: 0.ms,
      duration: 600.ms,
      begin: Offset(0.0, 50.0),
      end: Offset(0.0, 0.0),
    ),
  ],
);
```

## Лучшие практики разработки

### Организация кода и структура проекта

1. **Разделение ответственности** — разделяйте страницы, компоненты и бизнес-логику
2. **Переиспользование компонентов** — создавайте компоненты для часто повторяющихся UI-элементов
3. **App State для глобальных данных** — используйте для пользовательской информации, настроек приложения
4. **Page State для локальных данных** — управляйте состоянием отдельной страницы локально
5. **Именование** — используйте понятные и консистентные имена для переменных, функций и компонентов

### Производительность

1. **Ленивая загрузка** — загружайте данные по мере необходимости, а не все сразу
2. **Пагинация** — используйте пагинацию для больших наборов данных вместо загрузки всего
3. **Кэширование** — кэшируйте изображения и часто используемые данные
4. **Избегайте лишних перестроек** — правильно используйте методы setState и ChangeNotifier
5. **Оптимизируйте изображения** — используйте правильные размеры и форматы

### Безопасность

1. **Firestore Rules** — настраивайте правила безопасности для защиты данных
2. **Валидация на клиенте и сервере** — всегда валидируйте данные на обе стороны
3. **Хранение токенов** — никогда не сохраняйте чувствительные данные в App State (используйте secure storage)
4. **API ключи** — не включайте API ключи в код, используйте переменные окружения
5. **Аутентификация** — используйте встроенные методы Firebase Auth

## Типичные ошибки и решение проблем

### Проблемы с состоянием и перестройками виджетов

**Проблема:** Виджет не обновляется при изменении App State
- **Решение:** Убедитесь, что используется `Consumer` или `ValueListenableBuilder` для слушания изменений
- **Решение:** Проверьте, что вы вызываете `notifyListeners()` после изменения данных

**Проблема:** Бесконечные перестройки виджета
- **Решение:** Избегайте создания новых объектов в методе build()
- **Решение:** Используйте ключи для виджетов в списках

### Проблемы с Firebase

**Проблема:** "Permission denied" при доступе к Firestore
- **Решение:** Проверьте Firestore Rules и убедитесь, что они разрешают нужные операции
- **Решение:** Проверьте, что пользователь правильно аутентифицирован

**Проблема:** Медленная загрузка данных
- **Решение:** Используйте пагинацию и ограничивайте количество документов (limit)
- **Решение:** Добавьте индексы в Firestore
- **Решение:** Кэшируйте часто используемые данные

### Проблемы с навигацией

**Проблема:** Deep links не работают
- **Решение:** Проверьте конфигурацию маршрутов в goRouter
- **Решение:** Убедитесь, что платформа (iOS/Android/Web) поддерживает deep links

**Проблема:** Нежелательное поведение Back Button
- **Решение:** Используйте `context.canPop()` для проверки, можно ли вернуться
- **Решение:** Переопределите поведение в `WillPopScope` или используйте `onBackPressed`

### Проблемы при экспорте и локальной разработке

**Проблема:** "Package not found" после экспорта кода
- **Решение:** Запустите `flutter pub get` в папке проекта
- **Решение:** Проверьте версии зависимостей в pubspec.yaml

**Проблема:** Сгенерированный код отличается в локальной разработке
- **Решение:** Убедитесь, что используете ту же версию Flutter и pub пакетов
- **Решение:** Вычищайте кэш с помощью `flutter clean`

## Тестирование и деплой

### Тестирование

* **Test Mode** — тестирование непосредственно в FlutterFlow
* **Run Mode** — запуск приложения в браузере
* **Download Code** — локальный запуск и тестирование

### Деплой

FlutterFlow поддерживает деплой на:

| Платформа | Способ |
|---|---|
| App Store (iOS) | Через Xcode или FlutterFlow |
| Google Play (Android) | Через FlutterFlow или вручную |
| Web | Автоматический деплой через FlutterFlow |
| Firebase Hosting | Встроенная интеграция |

### Экспорт кода

```bash
# После экспорта из FlutterFlow
cd my_flutterflow_app

# Установка зависимостей
flutter pub get

# Запуск приложения
flutter run

# Сборка APK
flutter build apk --release

# Сборка iOS
flutter build ios --release
```

## Вопросы для собеседования

### Базовые вопросы

**1. Что такое FlutterFlow и для чего он используется?**

FlutterFlow — это визуальная low-code/no-code платформа для разработки приложений на Flutter. Она позволяет создавать мобильные и веб-приложения с drag-and-drop интерфейсом, генерируя при этом чистый Flutter/Dart код.

**2. Какие преимущества FlutterFlow перед классической Flutter-разработкой?**

* Значительно быстрее прототипирование и создание MVP
* Не нужны глубокие знания Dart для базовых приложений
* Встроенная интеграция с Firebase и другими сервисами
* Визуальный конструктор UI
* Командная работа в реальном времени

**3. Какие ограничения у FlutterFlow?**

* Сложная бизнес-логика требует Custom Code
* Зависимость от интернет-соединения
* Ограниченный набор визуально доступных виджетов
* Сгенерированный код может быть менее оптимизированным
* Платная лицензия для коммерческих проектов

**4. Можно ли экспортировать код из FlutterFlow?**

Да, FlutterFlow позволяет полный экспорт Flutter/Dart кода. Экспортированный код можно открыть в любой IDE (VS Code, Android Studio) и модифицировать. Также поддерживается интеграция с GitHub.

**5. Какую архитектуру использует FlutterFlow?**

FlutterFlow генерирует код, организованный по принципу разделения на страницы (pages), компоненты (components), бэкенд-логику (backend) и состояние приложения (app state). Каждая страница — это отдельный StatefulWidget.

### Средний уровень

**6. Как работает State Management в FlutterFlow?**

FlutterFlow использует три уровня состояния:
* **App State** — глобальное состояние (ChangeNotifier), доступное с любой страницы
* **Page State** — локальное состояние отдельной страницы
* **Component State** — внутреннее состояние компонента

App State построен на паттерне Singleton с ChangeNotifier и может сохранять данные между сессиями через SharedPreferences.

**7. Как интегрировать Firebase в FlutterFlow?**

FlutterFlow имеет встроенную интеграцию с Firebase:
* Подключение Firebase проекта через настройки
* Автоматическая генерация схем для Firestore коллекций
* Визуальная настройка правил безопасности
* Поддержка Authentication (Email, Google, Apple, Phone)
* Cloud Functions интеграция
* Firebase Storage для файлов

**8. Что такое Custom Functions и Custom Actions в FlutterFlow?**

* **Custom Functions** — чистые функции на Dart, которые принимают параметры и возвращают значения. Не имеют доступа к BuildContext.
* **Custom Actions** — функции с доступом к BuildContext, которые могут взаимодействовать с UI (показывать диалоги, навигация и т.д.). Используются как обработчики событий.
* **Custom Widgets** — полностью кастомные Flutter-виджеты.

**9. Как работает навигация в FlutterFlow?**

FlutterFlow использует GoRouter для навигации. Маршруты определяются через интерфейс FlutterFlow. Поддерживается:
* Навигация между страницами с параметрами
* Вложенная навигация (nested navigation)
* Bottom Navigation и Drawer
* Deep linking
* Redirect rules для защищённых страниц

**10. Как FlutterFlow работает с API?**

FlutterFlow имеет встроенный API Manager, который позволяет:
* Определять API вызовы (GET, POST, PUT, DELETE)
* Настраивать заголовки и тело запроса
* Парсить JSON-ответы через JSON Path
* Использовать переменные для динамических параметров
* Тестировать API прямо в интерфейсе

### Продвинутые вопросы

**11. Когда стоит использовать FlutterFlow, а когда чистый Flutter?**

FlutterFlow подходит для:
* MVP и прототипов
* CRUD-приложений с Firebase
* Простых бизнес-приложений
* Быстрых итераций

Чистый Flutter лучше для:
* Сложной бизнес-логики
* Кастомных анимаций и UI
* Высоконагруженных приложений
* Проектов с уникальными требованиями

**12. Как работает система тем в FlutterFlow?**

FlutterFlow использует собственную систему тем (FlutterFlowTheme), которая:
* Поддерживает Light/Dark темы
* Централизует цвета, шрифты и стили
* Использует метод `override()` для кастомизации
* Сохраняет настройки темы в App State

**13. Какие подходы к оптимизации производительности существуют в FlutterFlow?**

* Использование Lazy Loading для списков
* Пагинация данных из Firestore
* Оптимизация изображений (кэширование, сжатие)
* Минимизация количества перестроек виджетов
* Правильное использование App State vs Page State
* Избегание чрезмерного количества Custom Actions

**14. Как настроить CI/CD для FlutterFlow проекта?**

* Интеграция с GitHub для автоматического пуша кода
* Использование GitHub Actions или Codemagic для сборки
* FlutterFlow CLI для автоматизации
* Автоматический деплой на Firebase Hosting для веб-версии

**15. Как FlutterFlow обрабатывает Responsive Design?**

* Responsive Visibility — показывать/скрывать виджеты в зависимости от размера экрана
* Responsive Values — разные значения параметров для разных брейкпоинтов
* Wrap виджеты — автоматический перенос элементов
* MediaQuery для определения размера экрана в Custom Code

**16. Как работает хранение изображений и медиафайлов в FlutterFlow?**

FlutterFlow поддерживает несколько способов работы с медиа:
* **Local Assets** — изображения и файлы, загруженные в проект
* **Firebase Storage** — облачное хранилище для пользовательских файлов
* **Network Images** — загрузка изображений по URL
* **File Picker** — позволяет пользователю выбрать файл с устройства

Для оптимальной производительности рекомендуется кэшировать изображения и сжимать их перед загрузкой.

**17. Что такое FFRoute и как использовать параметры маршрутов?**

FFRoute — это вспомогательный класс FlutterFlow для работы с маршрутами. Параметры передаются несколькими способами:
* **Path параметры:** `/profile/:userId` — передаются в пути маршрута
* **Query параметры:** `?tab=reviews&sort=asc` — передаются как query string
* **Extra параметры:** можно передавать сложные объекты через extra

Пример: `context.pushNamed('ProfilePage', pathParameters: {'userId': '123'}, queryParameters: {'tab': 'posts'})`

**18. Как FlutterFlow работает с формами и валидацией?**

FlutterFlow предоставляет встроенные инструменты для работы с формами:
* **TextFields с валидацией** — встроенная проверка email, номера телефона и т.д.
* **Custom validation** — собственные функции проверки
* **Error messages** — отображение сообщений об ошибках
* **Form state** — отслеживание заполненности и корректности формы

Валидация должна быть как на клиентской стороне, так и на сервере (Firebase).

**19. Какие есть альтернативы FlutterFlow и когда их использовать?**

| Платформа | Когда использовать |
|---|---|
| FlutterFlow | MVP, simple CRUD, Firebase apps, быстрая разработка |
| Native Flutter | Сложная логика, кастомная UI, высокая производительность |
| React Native | Кроссплатформа (iOS/Android), JavaScript разработчики |
| Xcode/Android Studio | Максимальная производительность, native функции |
| Ionic/Capacitor | Web skills, гибридные приложения |

**20. Как организовать команду разработки в FlutterFlow?**

* **Совместная работа** — несколько разработчиков могут работать в одном проекте одновременно
* **Версионирование** — сохраняйте версии приложения в FlutterFlow
* **Code Export** — для более сложных проектов экспортируйте код и используйте Git
* **CI/CD интеграция** — настройте автоматическую сборку и деплой
* **Документирование** — документируйте структуру проекта и Custom Code для команды
