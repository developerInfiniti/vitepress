---
description: "Продвинутые вопросы Flutter для собеседований: рендеринг, Isolate, platform channels — с ответами"
---

# Співбесіда Flutter: Просунуті теми

Складні питання для senior-рівня та архітекторів.

## Platform Channels

### Як працюють Platform Channels?

**Відповідь:** Platform Channels дозволяють Flutter комунікувати з нативним кодом (iOS/Android).

```dart
// Flutter сторона
class BatteryService {
  static const platform = MethodChannel('com.example/battery');

  Future<int> getBatteryLevel() async {
    try {
      final int result = await platform.invokeMethod('getBatteryLevel');
      return result;
    } on PlatformException catch (e) {
      throw Exception('Failed to get battery level: ${e.message}');
    }
  }
}

// Android (Kotlin)
class MainActivity: FlutterActivity() {
  private val CHANNEL = "com.example/battery"

  override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
    super.configureFlutterEngine(flutterEngine)

    MethodChannel(flutterEngine.dartExecutor.binaryMessenger, CHANNEL).setMethodCallHandler { call, result ->
      if (call.method == "getBatteryLevel") {
        val batteryLevel = getBatteryLevel()
        if (batteryLevel != -1) {
          result.success(batteryLevel)
        } else {
          result.error("UNAVAILABLE", "Battery level not available.", null)
        }
      } else {
        result.notImplemented()
      }
    }
  }

  private fun getBatteryLevel(): Int {
    val batteryManager = getSystemService(BATTERY_SERVICE) as BatteryManager
    return batteryManager.getIntProperty(BatteryManager.BATTERY_PROPERTY_CAPACITY)
  }
}

// iOS (Swift)
@UIApplicationMain
class AppDelegate: FlutterAppDelegate {
  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {
    let controller = window?.rootViewController as! FlutterViewController
    let batteryChannel = FlutterMethodChannel(
      name: "com.example/battery",
      binaryMessenger: controller.binaryMessenger
    )

    batteryChannel.setMethodCallHandler { (call: FlutterMethodCall, result: @escaping FlutterResult) in
      if call.method == "getBatteryLevel" {
        result(self.getBatteryLevel())
      } else {
        result(FlutterMethodNotImplemented)
      }
    }

    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }

  private func getBatteryLevel() -> Int {
    let device = UIDevice.current
    device.isBatteryMonitoringEnabled = true
    return Int(device.batteryLevel * 100)
  }
}
```

---

### Типи Platform Channels?

**Відповідь:**

```dart
// 1. MethodChannel - для виклику методів
final methodChannel = MethodChannel('com.example/method');
final result = await methodChannel.invokeMethod('methodName', arguments);

// 2. EventChannel - для потоків даних
final eventChannel = EventChannel('com.example/events');
eventChannel.receiveBroadcastStream().listen((event) {
  print('Event: $event');
});

// 3. BasicMessageChannel - для простих повідомлень
final messageChannel = BasicMessageChannel<String>(
  'com.example/messages',
  StringCodec(),
);
messageChannel.setMessageHandler((message) async {
  return 'Reply: $message';
});
```

---

## Rendering та Paint

### Як працює CustomPainter?

**Відповідь:**

```dart
class MyPainter extends CustomPainter {
  final double progress;

  MyPainter({required this.progress});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.blue
      ..strokeWidth = 4
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;

    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 2 - 10;

    // Фонове коло
    canvas.drawCircle(center, radius, paint..color = Colors.grey.shade300);

    // Прогрес
    final sweepAngle = 2 * pi * progress;
    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius),
      -pi / 2,
      sweepAngle,
      false,
      paint..color = Colors.blue,
    );
  }

  @override
  bool shouldRepaint(covariant MyPainter oldDelegate) {
    return oldDelegate.progress != progress; // Перемальовувати при зміні
  }

  @override
  bool shouldRebuildSemantics(covariant MyPainter oldDelegate) => false;
}

// Використання
CustomPaint(
  painter: MyPainter(progress: 0.7),
  size: Size(200, 200),
)
```

---

### Що таке Layer Tree?

**Відповідь:**

```
Layer Tree - це дерево графічних шарів для композиції.

Widget Tree → Element Tree → RenderObject Tree → Layer Tree

Типи шарів:
├── ContainerLayer - контейнер для інших шарів
├── OffsetLayer - зміщення
├── ClipRectLayer - відсікання прямокутником
├── ClipRRectLayer - відсікання заокругленим прямокутником
├── ClipPathLayer - відсікання шляхом
├── OpacityLayer - прозорість
├── TransformLayer - трансформації
└── PictureLayer - малювання (найчастіший)

RepaintBoundary створює новий шар для ізоляції перемальовування.
```

```dart
// Налагодження Layer Tree
debugDumpLayerTree();

// Візуалізація шарів
MaterialApp(
  checkerboardOffscreenLayers: true,
  checkerboardRasterCacheImages: true,
)
```

---

## Null Safety та Dart

### Поясніть Null Safety у Dart

**Відповідь:**

```dart
// Non-nullable за замовчуванням
String name = 'John'; // Не може бути null
// name = null; // Помилка компіляції

// Nullable тип
String? nullableName = null; // Може бути null

// Null-aware оператори
String? getName() => null;

// ?? - default value
String name1 = getName() ?? 'Default';

// ?. - safe access
int? length = getName()?.length;

// ?.. - null-aware cascade
object?..method1()..method2();

// ! - null assertion (небезпечно)
String name2 = getName()!; // Кине помилку якщо null

// late - відкладена ініціалізація
late String lateValue;
void init() {
  lateValue = 'Initialized';
}

// required - обов'язковий параметр
void greet({required String name}) {
  print('Hello, $name');
}

// Flow analysis
void process(String? value) {
  if (value == null) return;
  // Тут value вже String, не String?
  print(value.length);
}
```

---

### Що таке Extension Methods?

**Відповідь:**

```dart
// Додавання методів до існуючих типів
extension StringExtension on String {
  String capitalize() {
    if (isEmpty) return this;
    return '${this[0].toUpperCase()}${substring(1)}';
  }

  bool get isEmail {
    return RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(this);
  }
}

// Використання
print('hello'.capitalize()); // 'Hello'
print('test@email.com'.isEmail); // true

// Extension на generic типи
extension ListExtension<T> on List<T> {
  T? get firstOrNull => isEmpty ? null : first;

  List<T> separated(T separator) {
    final result = <T>[];
    for (var i = 0; i < length; i++) {
      result.add(this[i]);
      if (i < length - 1) result.add(separator);
    }
    return result;
  }
}

// Extension на Widget
extension WidgetExtension on Widget {
  Widget padding(EdgeInsets padding) => Padding(padding: padding, child: this);
  Widget center() => Center(child: this);
}

// Використання
Text('Hello')
    .padding(EdgeInsets.all(16))
    .center();
```

---

## Тестування

### Як тестувати асинхронний код?

**Відповідь:**

```dart
// 1. Простий async тест
test('fetches user', () async {
  final user = await fetchUser();
  expect(user.name, 'John');
});

// 2. FakeAsync для контролю часу
import 'package:fake_async/fake_async.dart';

test('debounce works', () {
  fakeAsync((async) {
    var callCount = 0;
    final debouncer = Debouncer(Duration(milliseconds: 300));

    debouncer.run(() => callCount++);
    debouncer.run(() => callCount++);
    debouncer.run(() => callCount++);

    async.elapse(Duration(milliseconds: 200)); // Ще не викликано
    expect(callCount, 0);

    async.elapse(Duration(milliseconds: 150)); // Тепер викликано
    expect(callCount, 1);
  });
});

// 3. Mockito для мокування
class MockUserRepository extends Mock implements UserRepository {}

test('bloc emits states', () async {
  final mockRepo = MockUserRepository();
  when(mockRepo.getUser(any)).thenAnswer((_) async => User(name: 'John'));

  final bloc = UserBloc(mockRepo);
  bloc.add(LoadUser('1'));

  await expectLater(
    bloc.stream,
    emitsInOrder([
      isA<UserLoading>(),
      isA<UserLoaded>(),
    ]),
  );
});

// 4. Widget тест з pump
testWidgets('shows loading then data', (tester) async {
  await tester.pumpWidget(MyApp());

  expect(find.byType(CircularProgressIndicator), findsOneWidget);

  await tester.pump(Duration(seconds: 2)); // Симуляція затримки
  await tester.pumpAndSettle(); // Чекати на завершення анімацій

  expect(find.text('User: John'), findsOneWidget);
});
```

---

### Як мокувати Platform Channels?

**Відповідь:**

```dart
void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  const channel = MethodChannel('com.example/battery');

  setUp(() {
    // Мокування нативного методу
    TestDefaultBinaryMessengerBinding.instance.defaultBinaryMessenger
        .setMockMethodCallHandler(channel, (MethodCall methodCall) async {
      if (methodCall.method == 'getBatteryLevel') {
        return 100;
      }
      return null;
    });
  });

  tearDown(() {
    TestDefaultBinaryMessengerBinding.instance.defaultBinaryMessenger
        .setMockMethodCallHandler(channel, null);
  });

  test('returns battery level', () async {
    final service = BatteryService();
    final level = await service.getBatteryLevel();
    expect(level, 100);
  });
}
```

---

## Flutter Web та Desktop

### Особливості Flutter Web?

**Відповідь:**

```dart
// Перевірка платформи
import 'package:flutter/foundation.dart';

if (kIsWeb) {
  // Web-специфічний код
}

// Рендерери для Web
// 1. HTML renderer - менший розмір, швидший старт
// flutter build web --web-renderer html

// 2. CanvasKit - кращий рендеринг, як mobile
// flutter build web --web-renderer canvaskit

// 3. Автоматичний вибір
// flutter build web --web-renderer auto

// SEO та маршрутизація
MaterialApp.router(
  routerConfig: GoRouter(
    routes: [...],
    // Важливо для SEO
  ),
)

// Lazy loading для web
import 'heavy_feature.dart' deferred as heavy;

Future<void> loadFeature() async {
  await heavy.loadLibrary();
  // Тепер можна використовувати heavy.MyWidget()
}

// Responsive для різних платформ
class AdaptiveWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    if (kIsWeb) {
      final width = MediaQuery.of(context).size.width;
      if (width > 1200) return DesktopLayout();
      if (width > 600) return TabletLayout();
    }
    return MobileLayout();
  }
}
```

---

### Як підтримувати кілька платформ?

**Відповідь:**

```dart
// 1. Platform-specific код
import 'dart:io';

Widget buildPlatformWidget() {
  if (Platform.isIOS) {
    return CupertinoButton(...);
  } else if (Platform.isAndroid) {
    return ElevatedButton(...);
  } else if (Platform.isWindows || Platform.isMacOS || Platform.isLinux) {
    return DesktopButton(...);
  }
  return DefaultButton(...);
}

// 2. Conditional imports
// lib/platform/platform_interface.dart
abstract class PlatformService {
  factory PlatformService() => createPlatformService();
  void doSomething();
}

// lib/platform/platform_mobile.dart
PlatformService createPlatformService() => MobilePlatformService();

// lib/platform/platform_web.dart
PlatformService createPlatformService() => WebPlatformService();

// 3. Platform channels для нативного коду
// Різні реалізації для iOS, Android, Windows, macOS, Linux

// 4. Adaptive widgets
Scaffold(
  appBar: AppBar(
    leading: Platform.isIOS
        ? CupertinoNavigationBarBackButton()
        : BackButton(),
  ),
)
```

---

## Internals

### Як працює Hot Reload?

**Відповідь:**

```
1. Зміна коду в IDE
2. Dart VM компілює змінені файли
3. Нові класи завантажуються в VM
4. Flutter framework:
   - Зберігає стан Element tree
   - Перебудовує Widget tree
   - Оновлює RenderObject tree
5. UI оновлюється зі збереженням стану

Коли Hot Reload НЕ працює:
- Зміна initState()
- Зміна global variables
- Зміна static fields
- Зміна main()
- Зміна native code

Тоді потрібен Hot Restart (втрачає стан).
```

---

### Що таке Scheduler та Binding?

**Відповідь:**

```dart
// SchedulerBinding - планування кадрів
SchedulerBinding.instance.scheduleFrameCallback((timeStamp) {
  // Виконується перед наступним кадром
});

SchedulerBinding.instance.addPostFrameCallback((_) {
  // Виконується після поточного кадру
});

// Фази кадру:
// 1. Animation callbacks (перед build)
// 2. Build phase
// 3. Layout phase
// 4. Paint phase
// 5. Post-frame callbacks

// WidgetsBinding - точка входу Flutter
class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // Доступ до binding
    final binding = WidgetsBinding.instance;

    // Життєвий цикл застосунку
    binding.addObserver(MyObserver());

    return MaterialApp(...);
  }
}

class MyObserver extends WidgetsBindingObserver {
  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    switch (state) {
      case AppLifecycleState.resumed:
        print('App resumed');
        break;
      case AppLifecycleState.paused:
        print('App paused');
        break;
      case AppLifecycleState.inactive:
        print('App inactive');
        break;
      case AppLifecycleState.detached:
        print('App detached');
        break;
    }
  }
}
```

---

## Практичні питання

### Як реалізувати infinite scroll з пагінацією?

**Відповідь:**

```dart
class InfiniteListView extends StatefulWidget {
  @override
  _InfiniteListViewState createState() => _InfiniteListViewState();
}

class _InfiniteListViewState extends State<InfiniteListView> {
  final ScrollController _controller = ScrollController();
  final List<Item> _items = [];
  int _page = 1;
  bool _isLoading = false;
  bool _hasMore = true;

  @override
  void initState() {
    super.initState();
    _loadMore();
    _controller.addListener(_onScroll);
  }

  void _onScroll() {
    if (_controller.position.pixels >= _controller.position.maxScrollExtent - 200) {
      _loadMore();
    }
  }

  Future<void> _loadMore() async {
    if (_isLoading || !_hasMore) return;

    setState(() => _isLoading = true);

    try {
      final newItems = await fetchItems(page: _page);

      setState(() {
        _items.addAll(newItems);
        _page++;
        _hasMore = newItems.isNotEmpty;
      });
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      controller: _controller,
      itemCount: _items.length + (_hasMore ? 1 : 0),
      itemBuilder: (context, index) {
        if (index == _items.length) {
          return Center(child: CircularProgressIndicator());
        }
        return ItemWidget(item: _items[index]);
      },
    );
  }
}
```

---

### Як реалізувати deep linking?

**Відповідь:**

```dart
// 1. Android - AndroidManifest.xml
<intent-filter>
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data android:scheme="https" android:host="example.com" android:pathPrefix="/product" />
</intent-filter>

// 2. iOS - Info.plist
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>myapp</string>
    </array>
  </dict>
</array>

// 3. Flutter код
final router = GoRouter(
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => HomeScreen(),
    ),
    GoRoute(
      path: '/product/:id',
      builder: (context, state) {
        final id = state.pathParameters['id']!;
        return ProductScreen(productId: id);
      },
    ),
  ],
);

MaterialApp.router(
  routerConfig: router,
)

// 4. Обробка initial link
Future<void> initDeepLinks() async {
  final initialLink = await getInitialLink();
  if (initialLink != null) {
    _handleDeepLink(initialLink);
  }

  linkStream.listen(_handleDeepLink);
}
```

---

## Швидкі відповіді

| Питання | Відповідь |
|---------|-----------|
| Що таке Impeller? | Новий графічний рушій Flutter (заміна Skia на iOS) |
| Що таке FFI? | Foreign Function Interface - виклик C коду |
| Що таке Pigeon? | Генератор type-safe Platform Channels |
| Що таке pubspec.lock? | Зафіксовані версії залежностей |
| Що таке analysis_options.yaml? | Налаштування статичного аналізу |
| Як відключити null safety? | Не рекомендується, але: `// @dart=2.9` |
| Що таке Tree Shaking? | Видалення невикористаного коду при збірці |
