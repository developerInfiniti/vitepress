# Firebase у Flutter

Firebase — це платформа від Google, яка надає різноманітні сервіси для мобільних та веб-застосунків: аутентифікацію, бази даних, хмарні функції, аналітику тощо.

## Налаштування Firebase

### Встановлення FlutterFire CLI

```bash
# Встановлення CLI
dart pub global activate flutterfire_cli

# Конфігурація проєкту
flutterfire configure
```

### Залежності

```yaml
# pubspec.yaml
dependencies:
  firebase_core: ^2.24.0
  firebase_auth: ^4.15.0
  cloud_firestore: ^4.13.0
  firebase_storage: ^11.5.0
  firebase_messaging: ^14.7.0
  firebase_analytics: ^10.7.0
```

### Ініціалізація

```dart
import 'package:firebase_core/firebase_core.dart';
import 'firebase_options.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );

  runApp(MyApp());
}
```

## Firebase Authentication

### Реєстрація та вхід

```dart
import 'package:firebase_auth/firebase_auth.dart';

class AuthService {
  final FirebaseAuth _auth = FirebaseAuth.instance;

  // Поточний користувач
  User? get currentUser => _auth.currentUser;

  // Потік змін аутентифікації
  Stream<User?> get authStateChanges => _auth.authStateChanges();

  // Реєстрація з email/password
  Future<UserCredential> signUpWithEmail({
    required String email,
    required String password,
  }) async {
    try {
      return await _auth.createUserWithEmailAndPassword(
        email: email,
        password: password,
      );
    } on FirebaseAuthException catch (e) {
      throw _handleAuthException(e);
    }
  }

  // Вхід з email/password
  Future<UserCredential> signInWithEmail({
    required String email,
    required String password,
  }) async {
    try {
      return await _auth.signInWithEmailAndPassword(
        email: email,
        password: password,
      );
    } on FirebaseAuthException catch (e) {
      throw _handleAuthException(e);
    }
  }

  // Вихід
  Future<void> signOut() async {
    await _auth.signOut();
  }

  // Скидання паролю
  Future<void> resetPassword(String email) async {
    await _auth.sendPasswordResetEmail(email: email);
  }

  // Обробка помилок
  String _handleAuthException(FirebaseAuthException e) {
    switch (e.code) {
      case 'email-already-in-use':
        return 'Цей email вже використовується';
      case 'invalid-email':
        return 'Невірний формат email';
      case 'weak-password':
        return 'Пароль занадто слабкий';
      case 'user-not-found':
        return 'Користувача не знайдено';
      case 'wrong-password':
        return 'Невірний пароль';
      default:
        return 'Помилка аутентифікації: ${e.message}';
    }
  }
}
```

### Вхід через Google

```dart
import 'package:google_sign_in/google_sign_in.dart';

Future<UserCredential?> signInWithGoogle() async {
  try {
    // Запуск процесу входу через Google
    final GoogleSignInAccount? googleUser = await GoogleSignIn().signIn();

    if (googleUser == null) return null;

    // Отримання деталей аутентифікації
    final GoogleSignInAuthentication googleAuth =
        await googleUser.authentication;

    // Створення credentials
    final credential = GoogleAuthProvider.credential(
      accessToken: googleAuth.accessToken,
      idToken: googleAuth.idToken,
    );

    // Вхід у Firebase
    return await FirebaseAuth.instance.signInWithCredential(credential);
  } catch (e) {
    print('Помилка входу через Google: $e');
    return null;
  }
}
```

### Віджет перевірки аутентифікації

```dart
class AuthWrapper extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return StreamBuilder<User?>(
      stream: FirebaseAuth.instance.authStateChanges(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return LoadingScreen();
        }

        if (snapshot.hasData) {
          return HomeScreen();
        }

        return LoginScreen();
      },
    );
  }
}
```

## Cloud Firestore

### Базові операції

```dart
import 'package:cloud_firestore/cloud_firestore.dart';

class FirestoreService {
  final FirebaseFirestore _db = FirebaseFirestore.instance;

  // Додавання документа
  Future<DocumentReference> addUser(Map<String, dynamic> userData) async {
    return await _db.collection('users').add({
      ...userData,
      'createdAt': FieldValue.serverTimestamp(),
    });
  }

  // Додавання з власним ID
  Future<void> setUser(String id, Map<String, dynamic> userData) async {
    await _db.collection('users').doc(id).set(userData);
  }

  // Оновлення документа
  Future<void> updateUser(String id, Map<String, dynamic> data) async {
    await _db.collection('users').doc(id).update(data);
  }

  // Видалення документа
  Future<void> deleteUser(String id) async {
    await _db.collection('users').doc(id).delete();
  }

  // Отримання одного документа
  Future<DocumentSnapshot> getUser(String id) async {
    return await _db.collection('users').doc(id).get();
  }

  // Отримання всіх документів
  Future<QuerySnapshot> getAllUsers() async {
    return await _db.collection('users').get();
  }
}
```

### Запити

```dart
class UserQueries {
  final FirebaseFirestore _db = FirebaseFirestore.instance;

  // Фільтрація
  Future<List<User>> getUsersByAge(int minAge) async {
    final snapshot = await _db
        .collection('users')
        .where('age', isGreaterThanOrEqualTo: minAge)
        .get();

    return snapshot.docs.map((doc) => User.fromFirestore(doc)).toList();
  }

  // Складні запити
  Future<List<User>> getActiveAdminUsers() async {
    final snapshot = await _db
        .collection('users')
        .where('isActive', isEqualTo: true)
        .where('role', isEqualTo: 'admin')
        .orderBy('createdAt', descending: true)
        .limit(10)
        .get();

    return snapshot.docs.map((doc) => User.fromFirestore(doc)).toList();
  }

  // Пагінація
  Future<List<User>> getUsersPage(DocumentSnapshot? lastDoc) async {
    Query query = _db
        .collection('users')
        .orderBy('createdAt')
        .limit(20);

    if (lastDoc != null) {
      query = query.startAfterDocument(lastDoc);
    }

    final snapshot = await query.get();
    return snapshot.docs.map((doc) => User.fromFirestore(doc)).toList();
  }

  // Пошук за масивом
  Future<List<Post>> getPostsByTags(List<String> tags) async {
    final snapshot = await _db
        .collection('posts')
        .where('tags', arrayContainsAny: tags)
        .get();

    return snapshot.docs.map((doc) => Post.fromFirestore(doc)).toList();
  }
}
```

### Реальний час (Realtime)

```dart
class RealtimeService {
  final FirebaseFirestore _db = FirebaseFirestore.instance;

  // Потік одного документа
  Stream<User?> userStream(String userId) {
    return _db
        .collection('users')
        .doc(userId)
        .snapshots()
        .map((doc) => doc.exists ? User.fromFirestore(doc) : null);
  }

  // Потік колекції
  Stream<List<Message>> messagesStream(String chatId) {
    return _db
        .collection('chats')
        .doc(chatId)
        .collection('messages')
        .orderBy('timestamp', descending: true)
        .limit(50)
        .snapshots()
        .map((snapshot) =>
            snapshot.docs.map((doc) => Message.fromFirestore(doc)).toList());
  }
}

// Використання з StreamBuilder
class ChatScreen extends StatelessWidget {
  final String chatId;

  const ChatScreen({required this.chatId});

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<List<Message>>(
      stream: RealtimeService().messagesStream(chatId),
      builder: (context, snapshot) {
        if (snapshot.hasError) {
          return Text('Помилка: ${snapshot.error}');
        }

        if (!snapshot.hasData) {
          return CircularProgressIndicator();
        }

        final messages = snapshot.data!;
        return ListView.builder(
          reverse: true,
          itemCount: messages.length,
          itemBuilder: (context, index) {
            return MessageTile(message: messages[index]);
          },
        );
      },
    );
  }
}
```

### Транзакції та пакетні операції

```dart
class TransactionService {
  final FirebaseFirestore _db = FirebaseFirestore.instance;

  // Транзакція
  Future<void> transferMoney({
    required String fromUserId,
    required String toUserId,
    required double amount,
  }) async {
    await _db.runTransaction((transaction) async {
      // Читання документів
      final fromDoc = await transaction.get(
        _db.collection('accounts').doc(fromUserId),
      );
      final toDoc = await transaction.get(
        _db.collection('accounts').doc(toUserId),
      );

      final fromBalance = fromDoc.get('balance') as double;
      final toBalance = toDoc.get('balance') as double;

      if (fromBalance < amount) {
        throw Exception('Недостатньо коштів');
      }

      // Оновлення документів
      transaction.update(fromDoc.reference, {
        'balance': fromBalance - amount,
      });
      transaction.update(toDoc.reference, {
        'balance': toBalance + amount,
      });
    });
  }

  // Пакетна операція
  Future<void> updateMultipleUsers(List<User> users) async {
    final batch = _db.batch();

    for (final user in users) {
      final docRef = _db.collection('users').doc(user.id);
      batch.update(docRef, user.toMap());
    }

    await batch.commit();
  }
}
```

### Модель даних

```dart
class User {
  final String id;
  final String name;
  final String email;
  final int age;
  final DateTime createdAt;

  User({
    required this.id,
    required this.name,
    required this.email,
    required this.age,
    required this.createdAt,
  });

  factory User.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return User(
      id: doc.id,
      name: data['name'] ?? '',
      email: data['email'] ?? '',
      age: data['age'] ?? 0,
      createdAt: (data['createdAt'] as Timestamp?)?.toDate() ?? DateTime.now(),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'name': name,
      'email': email,
      'age': age,
      'createdAt': Timestamp.fromDate(createdAt),
    };
  }
}
```

## Firebase Storage

### Завантаження файлів

```dart
import 'package:firebase_storage/firebase_storage.dart';
import 'dart:io';

class StorageService {
  final FirebaseStorage _storage = FirebaseStorage.instance;

  // Завантаження файлу
  Future<String> uploadFile(File file, String path) async {
    final ref = _storage.ref().child(path);

    final uploadTask = ref.putFile(
      file,
      SettableMetadata(contentType: 'image/jpeg'),
    );

    // Відстеження прогресу
    uploadTask.snapshotEvents.listen((TaskSnapshot snapshot) {
      final progress = snapshot.bytesTransferred / snapshot.totalBytes;
      print('Прогрес: ${(progress * 100).toStringAsFixed(2)}%');
    });

    await uploadTask;
    return await ref.getDownloadURL();
  }

  // Завантаження зображення профілю
  Future<String> uploadProfileImage(String userId, File imageFile) async {
    final path = 'users/$userId/profile.jpg';
    return await uploadFile(imageFile, path);
  }

  // Видалення файлу
  Future<void> deleteFile(String path) async {
    await _storage.ref().child(path).delete();
  }

  // Отримання URL
  Future<String> getDownloadUrl(String path) async {
    return await _storage.ref().child(path).getDownloadURL();
  }
}
```

### Віджет завантаження з прогресом

```dart
class ImageUploadWidget extends StatefulWidget {
  @override
  _ImageUploadWidgetState createState() => _ImageUploadWidgetState();
}

class _ImageUploadWidgetState extends State<ImageUploadWidget> {
  double _uploadProgress = 0;
  bool _isUploading = false;

  Future<void> _uploadImage() async {
    final picker = ImagePicker();
    final pickedFile = await picker.pickImage(source: ImageSource.gallery);

    if (pickedFile == null) return;

    setState(() {
      _isUploading = true;
      _uploadProgress = 0;
    });

    final file = File(pickedFile.path);
    final ref = FirebaseStorage.instance
        .ref()
        .child('uploads/${DateTime.now().millisecondsSinceEpoch}.jpg');

    final uploadTask = ref.putFile(file);

    uploadTask.snapshotEvents.listen((snapshot) {
      setState(() {
        _uploadProgress = snapshot.bytesTransferred / snapshot.totalBytes;
      });
    });

    await uploadTask;

    setState(() {
      _isUploading = false;
    });

    final url = await ref.getDownloadURL();
    print('Файл завантажено: $url');
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        if (_isUploading)
          LinearProgressIndicator(value: _uploadProgress)
        else
          ElevatedButton(
            onPressed: _uploadImage,
            child: Text('Скачать зображення'),
          ),
      ],
    );
  }
}
```

## Firebase Cloud Messaging (FCM)

### Налаштування push-сповіщень

```dart
import 'package:firebase_messaging/firebase_messaging.dart';

class NotificationService {
  final FirebaseMessaging _messaging = FirebaseMessaging.instance;

  Future<void> initialize() async {
    // Запит дозволу
    final settings = await _messaging.requestPermission(
      alert: true,
      badge: true,
      sound: true,
    );

    if (settings.authorizationStatus == AuthorizationStatus.authorized) {
      print('Дозвіл на сповіщення отримано');
    }

    // Отримання токена
    final token = await _messaging.getToken();
    print('FCM Token: $token');

    // Обробка повідомлень
    _setupMessageHandlers();
  }

  void _setupMessageHandlers() {
    // Повідомлення при відкритому застосунку
    FirebaseMessaging.onMessage.listen((RemoteMessage message) {
      print('Отримано повідомлення: ${message.notification?.title}');
      _showLocalNotification(message);
    });

    // Повідомлення при натисканні
    FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) {
      print('Відкрито з повідомлення: ${message.data}');
      _handleMessageTap(message);
    });
  }

  void _showLocalNotification(RemoteMessage message) {
    // Показ локального сповіщення
  }

  void _handleMessageTap(RemoteMessage message) {
    // Навігація на основі даних повідомлення
    final route = message.data['route'];
    if (route != null) {
      // Перехід на екран
    }
  }
}

// Обробка фонових повідомлень
@pragma('vm:entry-point')
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  await Firebase.initializeApp();
  print('Фонове повідомлення: ${message.messageId}');
}

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();

  FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);

  runApp(MyApp());
}
```

## Firebase Analytics

```dart
import 'package:firebase_analytics/firebase_analytics.dart';

class AnalyticsService {
  final FirebaseAnalytics _analytics = FirebaseAnalytics.instance;

  // Логування події
  Future<void> logEvent({
    required String name,
    Map<String, dynamic>? parameters,
  }) async {
    await _analytics.logEvent(
      name: name,
      parameters: parameters,
    );
  }

  // Логування покупки
  Future<void> logPurchase({
    required String itemId,
    required String itemName,
    required double price,
  }) async {
    await _analytics.logPurchase(
      currency: 'UAH',
      value: price,
      items: [
        AnalyticsEventItem(
          itemId: itemId,
          itemName: itemName,
          price: price,
        ),
      ],
    );
  }

  // Логування перегляду екрану
  Future<void> logScreenView(String screenName) async {
    await _analytics.logScreenView(screenName: screenName);
  }

  // Встановлення властивостей користувача
  Future<void> setUserProperties({
    required String userId,
    String? userType,
  }) async {
    await _analytics.setUserId(id: userId);
    if (userType != null) {
      await _analytics.setUserProperty(name: 'user_type', value: userType);
    }
  }
}

// Навігаційний observer для автоматичного логування
class AnalyticsObserver extends NavigatorObserver {
  final FirebaseAnalytics analytics = FirebaseAnalytics.instance;

  @override
  void didPush(Route route, Route? previousRoute) {
    super.didPush(route, previousRoute);
    if (route.settings.name != null) {
      analytics.logScreenView(screenName: route.settings.name);
    }
  }
}

// Використання
MaterialApp(
  navigatorObservers: [AnalyticsObserver()],
  home: HomeScreen(),
)
```

## Найкращі практики

1. **Використовуйте правила безпеки** — завжди налаштовуйте Firestore Security Rules.

2. **Оптимізуйте запити** — використовуйте індекси та обмежуйте кількість документів.

3. **Кешуйте дані** — увімкніть офлайн-підтримку Firestore.

4. **Обробляйте помилки** — завжди використовуйте try/catch.

5. **Слідкуйте за квотами** — моніторте використання Firebase Console.

## Висновок

Firebase надає повний набір інструментів для створення сучасних мобільних застосунків. Правильне використання Firebase у Flutter дозволяє швидко реалізувати аутентифікацію, роботу з даними, push-сповіщення та аналітику без необхідності створення власного бекенду.
