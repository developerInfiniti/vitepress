# Безпека у Flutter

Безпека мобільних застосунків — критичний аспект розробки. Flutter надає інструменти та підходи для захисту даних користувачів, мережевої комунікації та самого застосунку.

## Безпечне зберігання даних

### flutter_secure_storage

Зберігання конфіденційних даних у Keychain (iOS) та Keystore (Android):

```dart
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class SecureStorageService {
  final _storage = const FlutterSecureStorage(
    aOptions: AndroidOptions(encryptedSharedPreferences: true),
    iOptions: IOSOptions(accessibility: KeychainAccessibility.first_unlock),
  );

  /// Зберегти токен
  Future<void> saveToken(String token) async {
    await _storage.write(key: 'auth_token', value: token);
  }

  /// Отримати токен
  Future<String?> getToken() async {
    return await _storage.read(key: 'auth_token');
  }

  /// Видалити токен
  Future<void> deleteToken() async {
    await _storage.delete(key: 'auth_token');
  }

  /// Очистити все сховище
  Future<void> clearAll() async {
    await _storage.deleteAll();
  }
}
```

### Шифрування даних

```dart
import 'package:encrypt/encrypt.dart';

class EncryptionService {
  late final Key _key;
  late final IV _iv;
  late final Encrypter _encrypter;

  EncryptionService(String secretKey) {
    _key = Key.fromUtf8(secretKey.padRight(32, '0').substring(0, 32));
    _iv = IV.fromLength(16);
    _encrypter = Encrypter(AES(_key));
  }

  /// Зашифрувати текст
  String encrypt(String plainText) {
    final encrypted = _encrypter.encrypt(plainText, iv: _iv);
    return encrypted.base64;
  }

  /// Розшифрувати текст
  String decrypt(String encryptedText) {
    final decrypted = _encrypter.decrypt64(encryptedText, iv: _iv);
    return decrypted;
  }
}
```

### Безпечне зберігання у SQLite

```dart
import 'package:sqflite_sqlcipher/sqflite.dart';

class SecureDatabase {
  static Database? _db;

  Future<Database> get database async {
    _db ??= await _initDb();
    return _db!;
  }

  Future<Database> _initDb() async {
    final path = await getDatabasesPath();
    return openDatabase(
      '$path/secure_app.db',
      password: 'your-secure-password', // отримати з secure storage
      version: 1,
      onCreate: (db, version) async {
        await db.execute('''
          CREATE TABLE users (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL
          )
        ''');
      },
    );
  }
}
```

## Мережева безпека

### SSL Pinning

Прив'язка до конкретного SSL-сертифіката для захисту від MITM-атак:

```dart
import 'package:dio/dio.dart';
import 'package:dio/io.dart';
import 'dart:io';

class SecureApiClient {
  late final Dio _dio;

  SecureApiClient() {
    _dio = Dio(BaseOptions(baseUrl: 'https://api.example.com'));

    // SSL Pinning
    (_dio.httpClientAdapter as IOHttpClientAdapter).createHttpClient = () {
      final client = HttpClient();
      client.badCertificateCallback = (cert, host, port) {
        // Перевірка відбитка сертифіката
        final fingerprint = cert.sha256;
        const expectedFingerprint = 'AA:BB:CC:DD:...'; // ваш відбиток
        return fingerprint.toString() == expectedFingerprint;
      };
      return client;
    };
  }
}
```

### Certificate Transparency

```dart
// Використання http_certificate_pinning
import 'package:http_certificate_pinning/http_certificate_pinning.dart';

Future<void> secureRequest() async {
  final response = await HttpCertificatePinning.check(
    serverURL: 'https://api.example.com',
    headerHttp: {},
    sha: SHA.SHA256,
    allowedSHAFingerprints: [
      'AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99',
    ],
    timeout: 50,
  );

  if (response.contains('CONNECTION_SECURE')) {
    // З'єднання безпечне
  }
}
```

### Безпечні HTTP-запити

```dart
class ApiService {
  final Dio _dio;

  ApiService(this._dio) {
    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) {
          // Додавання токена авторизації
          options.headers['Authorization'] = 'Bearer $token';
          // Заборона кешування конфіденційних даних
          options.headers['Cache-Control'] = 'no-store';
          handler.next(options);
        },
        onError: (error, handler) {
          if (error.response?.statusCode == 401) {
            // Токен протермінований — оновити або вийти
            _handleUnauthorized();
          }
          handler.next(error);
        },
      ),
    );
  }
}
```

## Аутентифікація та авторизація

### Безпечне зберігання токенів

```dart
class AuthTokenManager {
  final SecureStorageService _storage;

  AuthTokenManager(this._storage);

  Future<void> saveTokens({
    required String accessToken,
    required String refreshToken,
  }) async {
    await _storage.saveToken(accessToken);
    await _storage.write('refresh_token', refreshToken);
  }

  Future<String?> getValidToken() async {
    final token = await _storage.getToken();
    if (token == null) return null;

    // Перевірка терміну дії
    if (_isTokenExpired(token)) {
      return await _refreshToken();
    }
    return token;
  }

  bool _isTokenExpired(String token) {
    try {
      final parts = token.split('.');
      if (parts.length != 3) return true;

      final payload = json.decode(
        utf8.decode(base64Url.decode(base64Url.normalize(parts[1]))),
      );

      final exp = payload['exp'] as int;
      final now = DateTime.now().millisecondsSinceEpoch ~/ 1000;
      return now >= exp;
    } catch (_) {
      return true;
    }
  }
}
```

### Біометрична аутентифікація

```dart
import 'package:local_auth/local_auth.dart';

class BiometricService {
  final _auth = LocalAuthentication();

  /// Перевірка доступності біометрії
  Future<bool> isBiometricAvailable() async {
    final canCheck = await _auth.canCheckBiometrics;
    final isDeviceSupported = await _auth.isDeviceSupported();
    return canCheck && isDeviceSupported;
  }

  /// Отримати доступні типи біометрії
  Future<List<BiometricType>> getAvailableBiometrics() async {
    return await _auth.getAvailableBiometrics();
  }

  /// Аутентифікація
  Future<bool> authenticate() async {
    try {
      return await _auth.authenticate(
        localizedReason: 'Підтвердіть свою особу для входу',
        options: const AuthenticationOptions(
          stickyAuth: true,
          biometricOnly: false,
        ),
      );
    } catch (e) {
      return false;
    }
  }
}
```

## Захист від реверс-інжинірингу

### Обфускація коду

```bash
# Збірка з обфускацією
flutter build apk --obfuscate --split-debug-info=./debug-info/
flutter build ios --obfuscate --split-debug-info=./debug-info/
```

### Захист від відладки

```dart
import 'dart:io';

class SecurityCheck {
  /// Перевірка чи застосунок запущено у відладчику
  static bool get isDebuggerAttached {
    bool isDebug = false;
    assert(() {
      isDebug = true;
      return true;
    }());
    return isDebug;
  }

  /// Перевірка на root/jailbreak
  static Future<bool> isDeviceCompromised() async {
    if (Platform.isAndroid) {
      return await _checkAndroidRoot();
    } else if (Platform.isIOS) {
      return await _checkIOSJailbreak();
    }
    return false;
  }

  static Future<bool> _checkAndroidRoot() async {
    final paths = [
      '/system/app/Superuser.apk',
      '/sbin/su',
      '/system/bin/su',
      '/system/xbin/su',
    ];
    for (final path in paths) {
      if (await File(path).exists()) return true;
    }
    return false;
  }

  static Future<bool> _checkIOSJailbreak() async {
    final paths = [
      '/Applications/Cydia.app',
      '/Library/MobileSubstrate/MobileSubstrate.dylib',
      '/bin/bash',
      '/usr/sbin/sshd',
    ];
    for (final path in paths) {
      if (await File(path).exists()) return true;
    }
    return false;
  }
}
```

## Валідація введених даних

```dart
class InputValidator {
  /// Валідація email
  static String? validateEmail(String? value) {
    if (value == null || value.isEmpty) return 'Введіть email';
    final regex = RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');
    if (!regex.hasMatch(value)) return 'Невірний формат email';
    return null;
  }

  /// Валідація пароля
  static String? validatePassword(String? value) {
    if (value == null || value.isEmpty) return 'Введіть пароль';
    if (value.length < 8) return 'Мінімум 8 символів';
    if (!value.contains(RegExp(r'[A-Z]'))) return 'Потрібна велика літера';
    if (!value.contains(RegExp(r'[a-z]'))) return 'Потрібна мала літера';
    if (!value.contains(RegExp(r'[0-9]'))) return 'Потрібна цифра';
    if (!value.contains(RegExp(r'[!@#\$%^&*(),.?":{}|<>]'))) {
      return 'Потрібен спеціальний символ';
    }
    return null;
  }

  /// Санітизація вводу — захист від injection
  static String sanitize(String input) {
    return input
        .replaceAll(RegExp(r'<[^>]*>'), '') // видалення HTML тегів
        .replaceAll(RegExp(r'[<>"\']'), '') // видалення небезпечних символів
        .trim();
  }
}
```

## Безпечна конфігурація

### Зберігання секретів

```dart
// НЕ зберігайте секрети в коді!

// Використовуйте --dart-define для передачі секретів
// flutter run --dart-define=API_KEY=your_key

class AppConfig {
  static const apiKey = String.fromEnvironment('API_KEY');
  static const apiUrl = String.fromEnvironment(
    'API_URL',
    defaultValue: 'https://api.example.com',
  );
}
```

### ProGuard (Android)

```proguard
# android/app/proguard-rules.pro
-keep class io.flutter.app.** { *; }
-keep class io.flutter.plugin.** { *; }
-keep class io.flutter.util.** { *; }
-keep class io.flutter.view.** { *; }
-keep class io.flutter.** { *; }
-keep class io.flutter.plugins.** { *; }
-dontwarn io.flutter.embedding.**
```

## Чек-лист безпеки

- [ ] Конфіденційні дані зберігаються у `flutter_secure_storage`
- [ ] SSL Pinning налаштовано для API-запитів
- [ ] Токени оновлюються та перевіряються на термін дії
- [ ] Код обфускований у release-збірках
- [ ] Введені дані валідуються та санітизуються
- [ ] Секрети не зашиті в код (використовуються змінні середовища)
- [ ] Біометрична аутентифікація для чутливих операцій
- [ ] Логування вимкнене у release-збірках
- [ ] Перевірка на root/jailbreak для критичних застосунків
- [ ] ProGuard налаштовано для Android
- [ ] Network Security Config налаштовано
- [ ] Кешування конфіденційних даних вимкнене
