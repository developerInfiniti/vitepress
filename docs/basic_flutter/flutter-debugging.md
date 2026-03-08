---
description: "Отладка Flutter приложений: DevTools, breakpoints, layout inspector — поиск и исправление ошибок"
---

# Налагодження та DevTools у Flutter

Ефективне налагодження є ключовим для розробки якісних застосунків. Flutter надає потужні інструменти для виявлення та виправлення проблем.

## Flutter DevTools

Flutter DevTools — це набір інструментів для профілювання та налагодження.

### Запуск DevTools

```bash
# Запуск застосунку в режимі debug
flutter run

# Відкриття DevTools
# Натисніть 'd' в терміналі або перейдіть за URL з консолі

# Або встановіть глобально
dart pub global activate devtools
dart pub global run devtools
```

### Inspector (Widget Inspector)

```dart
// Відкриття Widget Inspector
// В DevTools: Widget Inspector tab

// Програмне виділення віджета
import 'package:flutter/rendering.dart';

void main() {
  debugPaintSizeEnabled = true; // Показати межі віджетів
  debugPaintBaselinesEnabled = true; // Показати базові лінії тексту
  debugPaintLayerBordersEnabled = true; // Показати межі шарів
  debugRepaintRainbowEnabled = true; // Кольорові межі при перемальовуванні

  runApp(MyApp());
}
```

### Performance Tab

```dart
// Увімкнення Performance Overlay у коді
MaterialApp(
  showPerformanceOverlay: true,
  checkerboardRasterCacheImages: true,
  checkerboardOffscreenLayers: true,
  home: MyHomePage(),
)

// Або через консоль: натисніть 'P' під час flutter run
```

### Memory Tab

```dart
// Відстеження пам'яті
import 'dart:developer' as developer;

// Створення знімку пам'яті
developer.NativeRuntime.writeHeapSnapshotToFile('snapshot.heapsnapshot');

// Примусовий збір сміття (тільки для тестування)
// Доступно тільки в debug режимі через DevTools
```

## Логування та друк

### print та debugPrint

```dart
// Простий друк
print('Просте повідомлення');

// debugPrint - обмежує довжину (для великих об'єктів)
debugPrint('Довге повідомлення...', wrapWidth: 1024);

// Друк з кольором в консолі (ANSI коди)
print('\x1B[32mЗелений текст\x1B[0m');
print('\x1B[31mЧервоний текст\x1B[0m');
print('\x1B[33mЖовтий текст\x1B[0m');
```

### logger пакет

```dart
import 'package:logger/logger.dart';

final logger = Logger(
  printer: PrettyPrinter(
    methodCount: 2, // Кількість методів у stack trace
    errorMethodCount: 8,
    lineLength: 120,
    colors: true,
    printEmojis: true,
    printTime: true,
  ),
);

// Використання
logger.d('Debug message');
logger.i('Info message');
logger.w('Warning message');
logger.e('Error message', error: exception, stackTrace: stackTrace);
logger.wtf('What a terrible failure');
```

### dart:developer

```dart
import 'dart:developer' as developer;

// Логування з тегами
developer.log(
  'Повідомлення',
  name: 'MyApp.Network',
  error: exception,
  stackTrace: stackTrace,
);

// Timeline для профілювання
developer.Timeline.startSync('MyOperation');
// ... виконання операції
developer.Timeline.finishSync();

// Або з автоматичним завершенням
developer.Timeline.timeSync('MyOperation', () {
  // ... виконання операції
});

// Debugger breakpoint у коді
developer.debugger(when: someCondition, message: 'Зупинка тут');

// Перевірка режиму debug
if (developer.debuggerAttached) {
  print('Debugger підключено');
}
```

## Assertions та Debug Mode

```dart
// Assert - працює тільки в debug режимі
void setAge(int age) {
  assert(age >= 0, 'Вік не може бути від\'ємним');
  _age = age;
}

// Перевірка debug режиму
import 'package:flutter/foundation.dart';

if (kDebugMode) {
  print('Це debug режим');
}

if (kReleaseMode) {
  print('Це release режим');
}

if (kProfileMode) {
  print('Це profile режим');
}

// Умовний код для debug
void main() {
  // Виконується тільки в debug
  assert(() {
    // Налаштування для debug
    debugPaintSizeEnabled = true;
    return true;
  }());

  runApp(MyApp());
}
```

## Error Handling

### FlutterError

```dart
void main() {
  // Глобальний обробник помилок Flutter
  FlutterError.onError = (FlutterErrorDetails details) {
    // Логування
    FlutterError.presentError(details);

    // Відправка на сервер (Crashlytics, Sentry, тощо)
    // FirebaseCrashlytics.instance.recordFlutterError(details);

    // Або своя логіка
    if (kReleaseMode) {
      // В релізі - тихо логуємо
      _sendToAnalytics(details);
    } else {
      // В debug - показуємо
      FlutterError.dumpErrorToConsole(details);
    }
  };

  runApp(MyApp());
}
```

### Zone для перехоплення помилок

```dart
void main() {
  runZonedGuarded(
    () {
      WidgetsFlutterBinding.ensureInitialized();

      FlutterError.onError = (details) {
        FlutterError.presentError(details);
        _reportError(details.exception, details.stack);
      };

      runApp(MyApp());
    },
    (error, stackTrace) {
      // Перехоплення помилок поза Flutter
      _reportError(error, stackTrace);
    },
  );
}

Future<void> _reportError(dynamic error, StackTrace? stackTrace) async {
  print('Caught error: $error');
  print('Stack trace: $stackTrace');
  // Відправити на сервер аналітики
}
```

### ErrorWidget

```dart
void main() {
  // Кастомний віджет помилки
  ErrorWidget.builder = (FlutterErrorDetails details) {
    if (kReleaseMode) {
      return Container(
        color: Colors.white,
        child: Center(
          child: Text(
            'Щось пішло не так',
            style: TextStyle(color: Colors.red),
          ),
        ),
      );
    }
    // В debug показуємо повну інформацію
    return ErrorWidget(details.exception);
  };

  runApp(MyApp());
}
```

## Breakpoints та Debugging у IDE

### VS Code

```json
// launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Flutter Debug",
      "request": "launch",
      "type": "dart",
      "flutterMode": "debug",
      "args": ["--dart-define=ENV=development"]
    },
    {
      "name": "Flutter Profile",
      "request": "launch",
      "type": "dart",
      "flutterMode": "profile"
    },
    {
      "name": "Flutter Release",
      "request": "launch",
      "type": "dart",
      "flutterMode": "release"
    }
  ]
}
```

### Conditional Breakpoints

```dart
// Встановіть breakpoint на рядку та додайте умову:
// count > 10
// user.name == 'Test'
// items.length > 5
```

## Network Debugging

### Логування HTTP запитів

```dart
import 'package:dio/dio.dart';

final dio = Dio();

// Логування всіх запитів
dio.interceptors.add(LogInterceptor(
  request: true,
  requestHeader: true,
  requestBody: true,
  responseHeader: true,
  responseBody: true,
  error: true,
  logPrint: (object) => debugPrint(object.toString()),
));

// Кастомний interceptor
dio.interceptors.add(InterceptorsWrapper(
  onRequest: (options, handler) {
    print('REQUEST[${options.method}] => PATH: ${options.path}');
    print('Headers: ${options.headers}');
    print('Data: ${options.data}');
    return handler.next(options);
  },
  onResponse: (response, handler) {
    print('RESPONSE[${response.statusCode}] => PATH: ${response.requestOptions.path}');
    print('Data: ${response.data}');
    return handler.next(response);
  },
  onError: (error, handler) {
    print('ERROR[${error.response?.statusCode}] => PATH: ${error.requestOptions.path}');
    print('Message: ${error.message}');
    return handler.next(error);
  },
));
```

## Layout Debugging

```dart
// Візуалізація layout проблем
import 'package:flutter/rendering.dart';

void main() {
  // Показати межі всіх віджетів
  debugPaintSizeEnabled = true;

  // Показати базові лінії тексту
  debugPaintBaselinesEnabled = true;

  // Показати точки торкання
  debugPaintPointersEnabled = true;

  // Перевірка overflow
  debugPaintLayerBordersEnabled = true;

  runApp(MyApp());
}

// DebugPaintSizeEnabled в окремому віджеті
class DebugContainer extends StatelessWidget {
  final Widget child;

  const DebugContainer({required this.child});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        border: Border.all(color: Colors.red, width: 1),
      ),
      child: child,
    );
  }
}
```

## Widget Rebuild Debugging

```dart
// Відстеження перебудов
class MyWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    debugPrint('MyWidget rebuild');
    return Container();
  }
}

// Глобальне логування перебудов
import 'package:flutter/rendering.dart';

void main() {
  debugPrintRebuildDirtyWidgets = true;
  runApp(MyApp());
}

// Профілювання конкретного віджета
class ProfilingWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return ProfiledWidget(
      name: 'MyExpensiveWidget',
      child: ExpensiveWidget(),
    );
  }
}

class ProfiledWidget extends StatelessWidget {
  final String name;
  final Widget child;

  const ProfiledWidget({required this.name, required this.child});

  @override
  Widget build(BuildContext context) {
    final stopwatch = Stopwatch()..start();

    final result = child;

    stopwatch.stop();
    debugPrint('$name build time: ${stopwatch.elapsedMicroseconds}μs');

    return result;
  }
}
```

## Testing та Debugging

```dart
// Widget tests з debugging
testWidgets('debug widget', (tester) async {
  await tester.pumpWidget(MyWidget());

  // Друк дерева віджетів
  debugDumpApp();

  // Друк render дерева
  debugDumpRenderTree();

  // Друк layer дерева
  debugDumpLayerTree();

  // Друк семантичного дерева
  debugDumpSemanticsTree();
});

// Тимчасовий skip тесту
testWidgets('work in progress', (tester) async {
  // TODO: implement
}, skip: true);

// Тест з timeout
testWidgets('slow test', (tester) async {
  // ...
}, timeout: Timeout(Duration(seconds: 30)));
```

## Корисні команди

```bash
# Запуск з verbose логами
flutter run -v

# Запуск в profile режимі
flutter run --profile

# Аналіз продуктивності запуску
flutter run --trace-startup

# Перевірка проблем у проєкті
flutter analyze

# Детальний аналіз
flutter analyze --verbose

# Перевірка залежностей
flutter pub outdated
flutter pub deps

# Очищення кешу
flutter clean
flutter pub cache repair
```

## Найкращі практики

1. **Використовуйте структуроване логування** — з logger пакетом та тегами.

2. **Налаштуйте глобальну обробку помилок** — для збору crash-репортів.

3. **Профілюйте в profile режимі** — debug режим повільніший.

4. **Використовуйте DevTools регулярно** — для виявлення проблем з пам'яттю та продуктивністю.

5. **Видаляйте debug код перед релізом** — особливо debugPrint та assertions.

## Висновок

Flutter надає потужний набір інструментів для налагодження — від простого print до повноцінних DevTools. Ефективне використання цих інструментів допомагає швидко виявляти та виправляти проблеми, забезпечуючи високу якість застосунку.
