---
description: "Platform channels во Flutter: MethodChannel, EventChannel — интеграция нативного кода iOS и Android"
---

# Platform Channels у Flutter

Platform Channels — це механізм для зв'язку між Dart-кодом Flutter та нативним кодом платформи (Android/iOS). Вони дозволяють викликати платформо-специфічні API, яких немає у Flutter.

## Типи каналів

### MethodChannel

`MethodChannel` — найпоширеніший тип каналу. Використовується для виклику методів на нативній стороні та отримання результатів.

```dart
import 'package:flutter/services.dart';

class BatteryService {
  static const platform = MethodChannel('com.example.app/battery');

  /// Отримати рівень заряду батареї
  Future<int> getBatteryLevel() async {
    try {
      final int result = await platform.invokeMethod('getBatteryLevel');
      return result;
    } on PlatformException catch (e) {
      throw Exception('Помилка отримання рівня батареї: ${e.message}');
    }
  }
}
```

#### Нативна сторона — Android (Kotlin)

```kotlin
class MainActivity : FlutterActivity() {
    private val CHANNEL = "com.example.app/battery"

    override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
        super.configureFlutterEngine(flutterEngine)

        MethodChannel(flutterEngine.dartExecutor.binaryMessenger, CHANNEL)
            .setMethodCallHandler { call, result ->
                if (call.method == "getBatteryLevel") {
                    val batteryLevel = getBatteryLevel()
                    if (batteryLevel != -1) {
                        result.success(batteryLevel)
                    } else {
                        result.error("UNAVAILABLE", "Battery level not available", null)
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
```

#### Нативна сторона — iOS (Swift)

```swift
@UIApplicationMain
@objc class AppDelegate: FlutterAppDelegate {
    override func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
    ) -> Bool {
        let controller = window?.rootViewController as! FlutterViewController
        let batteryChannel = FlutterMethodChannel(
            name: "com.example.app/battery",
            binaryMessenger: controller.binaryMessenger
        )

        batteryChannel.setMethodCallHandler { (call, result) in
            if call.method == "getBatteryLevel" {
                let device = UIDevice.current
                device.isBatteryMonitoringEnabled = true
                let batteryLevel = Int(device.batteryLevel * 100)
                result(batteryLevel)
            } else {
                result(FlutterMethodNotImplemented)
            }
        }

        return super.application(application, didFinishLaunchingWithOptions: launchOptions)
    }
}
```

### EventChannel

`EventChannel` використовується для передачі потоку подій з нативної сторони у Dart. Ідеально підходить для підписки на безперервні оновлення.

```dart
class SensorService {
  static const eventChannel = EventChannel('com.example.app/accelerometer');

  /// Потік даних акселерометра
  Stream<Map<String, double>> get accelerometerStream {
    return eventChannel.receiveBroadcastStream().map((event) {
      final data = Map<String, dynamic>.from(event);
      return {
        'x': (data['x'] as num).toDouble(),
        'y': (data['y'] as num).toDouble(),
        'z': (data['z'] as num).toDouble(),
      };
    });
  }
}

// Використання у віджеті
class AccelerometerWidget extends StatelessWidget {
  final sensorService = SensorService();

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<Map<String, double>>(
      stream: sensorService.accelerometerStream,
      builder: (context, snapshot) {
        if (snapshot.hasData) {
          final data = snapshot.data!;
          return Text('X: ${data['x']}, Y: ${data['y']}, Z: ${data['z']}');
        }
        return const CircularProgressIndicator();
      },
    );
  }
}
```

### BasicMessageChannel

`BasicMessageChannel` використовується для обміну простими повідомленнями з кодеком серіалізації.

```dart
class MessageService {
  static const channel = BasicMessageChannel<String>(
    'com.example.app/messages',
    StringCodec(),
  );

  /// Надіслати повідомлення та отримати відповідь
  Future<String?> sendMessage(String message) async {
    final reply = await channel.send(message);
    return reply;
  }

  /// Слухати вхідні повідомлення
  void listen() {
    channel.setMessageHandler((message) async {
      print('Отримано повідомлення: $message');
      return 'Дякую за повідомлення!';
    });
  }
}
```

## Передача складних типів даних

### Кодеки повідомлень

Flutter підтримує різні кодеки для серіалізації даних:

```dart
// StandardMessageCodec — підтримує: null, bool, int, double, String,
// Uint8List, Int32List, Int64List, Float64List, List, Map

class UserService {
  static const platform = MethodChannel('com.example.app/users');

  /// Передача та отримання Map
  Future<Map<String, dynamic>> getUserInfo(int userId) async {
    final result = await platform.invokeMethod('getUserInfo', {
      'userId': userId,
    });
    return Map<String, dynamic>.from(result);
  }

  /// Передача списку
  Future<List<String>> getPermissions() async {
    final result = await platform.invokeMethod('getPermissions');
    return List<String>.from(result);
  }
}
```

## Pigeon — типобезпечна генерація коду

Pigeon — офіційний інструмент від Flutter для генерації типобезпечного коду Platform Channels.

```dart
// pigeons/messages.dart
import 'package:pigeon/pigeon.dart';

class UserInfo {
  String? name;
  int? age;
  String? email;
}

@HostApi()
abstract class UserApi {
  UserInfo getUserById(int id);
  List<UserInfo> getAllUsers();
  void deleteUser(int id);
}

@FlutterApi()
abstract class UserEventsApi {
  void onUserUpdated(UserInfo user);
}
```

Запуск генерації:

```bash
dart run pigeon \
  --input pigeons/messages.dart \
  --dart_out lib/src/generated/messages.g.dart \
  --kotlin_out android/app/src/main/kotlin/Messages.g.kt \
  --swift_out ios/Runner/Messages.g.swift
```

Використання згенерованого коду:

```dart
class UserRepository {
  final UserApi _api = UserApi();

  Future<UserInfo> getUser(int id) async {
    return await _api.getUserById(id);
  }

  Future<List<UserInfo>> getAllUsers() async {
    return await _api.getAllUsers();
  }
}
```

## Обробка помилок

```dart
class PlatformService {
  static const platform = MethodChannel('com.example.app/service');

  Future<String> callNativeMethod() async {
    try {
      final result = await platform.invokeMethod<String>('someMethod');
      return result ?? 'No result';
    } on PlatformException catch (e) {
      // Помилка на нативній стороні
      print('PlatformException: ${e.code} - ${e.message}');
      rethrow;
    } on MissingPluginException {
      // Метод не реалізовано на нативній стороні
      print('Метод не знайдено на поточній платформі');
      return 'Not supported';
    } catch (e) {
      print('Невідома помилка: $e');
      rethrow;
    }
  }
}
```

## Тестування Platform Channels

```dart
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter/services.dart';

void main() {
  const channel = MethodChannel('com.example.app/battery');

  TestWidgetsFlutterBinding.ensureInitialized();

  setUp(() {
    TestDefaultBinaryMessengerBinding.instance.defaultBinaryMessenger
        .setMockMethodCallHandler(channel, (MethodCall methodCall) async {
      if (methodCall.method == 'getBatteryLevel') {
        return 42;
      }
      return null;
    });
  });

  tearDown(() {
    TestDefaultBinaryMessengerBinding.instance.defaultBinaryMessenger
        .setMockMethodCallHandler(channel, null);
  });

  test('getBatteryLevel returns correct value', () async {
    final service = BatteryService();
    expect(await service.getBatteryLevel(), 42);
  });
}
```

## Найкращі практики

- **Називання каналів**: Використовуйте зворотний DNS (`com.example.app/feature`) для унікальності
- **Обробка помилок**: Завжди обробляйте `PlatformException` та `MissingPluginException`
- **Типобезпека**: Використовуйте Pigeon для складних API
- **Ізоляція**: Виносьте роботу з каналами в окремі сервіси
- **Тестування**: Мокайте канали у unit-тестах
- **Документація**: Документуйте API та типи даних, які передаються між платформами
