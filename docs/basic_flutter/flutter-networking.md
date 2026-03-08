---
description: "Сетевые запросы во Flutter: http, dio, REST API, WebSocket — взаимодействие с серверами"
---

# Робота з мережею у Flutter: Отримання даних з інтернету

Більшість сучасних мобільних застосунків потребують взаємодії з мережею для отримання даних, надсилання інформації на сервер або використання API. Flutter надає кілька способів для здійснення мережевих запитів.

## Основні підходи до роботи з мережею у Flutter

Найпоширенішим способом є використання HTTP-протоколу. Flutter має вбудовані бібліотеки та сторонні пакети для спрощення цього процесу.

### 1. Вбудована бібліотека `dart:io` (низькорівнева)

Бібліотека `dart:io` надає низькорівневі API для роботи з мережею, включаючи `HttpClient`. Однак, для більшості випадків, використання більш високорівневих бібліотек є зручнішим.

```dart
import 'dart:io';
import 'dart:convert';

Future<void> fetchData() async {
  final client = HttpClient();
  try {
    final uri = Uri.parse('[https://jsonplaceholder.typicode.com/todos/1](https://jsonplaceholder.typicode.com/todos/1)');
    final request = await client.getUrl(uri);
    final response = await request.close();
    if (response.statusCode == HttpStatus.ok) {
      final responseBody = await response.transform(utf8.decoder).join();
      final jsonData = jsonDecode(responseBody);
      print(jsonData);
    } else {
      print('Помилка запиту: ${response.statusCode}');
    }
  } catch (e) {
    print('Виникла помилка: $e');
  } finally {
    client.close();
  }
}
```

Використання `dart:io` вимагає більшого обсягу коду для обробки запитів та відповідей.

### 2. Пакет `http` (високорівневий)

Пакет `http` ([https://pub.dev/packages/http](https://pub.dev/packages/http)) є популярним стороннім пакетом, який надає більш зручний та високорівневий API для здійснення HTTP-запитів.

```dart
import 'package:http/http.dart' as http;
import 'dart:convert';

Future<void> fetchData() async {
  final response = await http.get(Uri.parse('[https://jsonplaceholder.typicode.com/todos/1](https://jsonplaceholder.typicode.com/todos/1)'));

  if (response.statusCode == 200) {
    final jsonData = jsonDecode(response.body);
    print(jsonData);
  } else {
    print('Помилка запиту: ${response.statusCode}');
  }
}
```

Пакет `http` значно спрощує код для виконання GET-запитів та обробки відповідей. Він також підтримує інші HTTP-методи (POST, PUT, DELETE тощо), встановлення заголовків та роботу з тілом запиту.

**Приклад POST-запиту:**

```dart
Future<void> postData() async {
  final response = await http.post(
    Uri.parse('[https://jsonplaceholder.typicode.com/posts](https://jsonplaceholder.typicode.com/posts)'),
    headers: <String, String>{
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: jsonEncode(<String, String>{
      'title': 'Мій новий пост',
      'body': 'Вміст мого поста',
      'userId': '1',
    }),
  );

  if (response.statusCode == 201) {
    final jsonData = jsonDecode(response.body);
    print('Успішно створено: $jsonData');
  } else {
    print('Помилка POST-запиту: ${response.statusCode}');
  }
}
```

### 3. Пакет `dio` (розширений HTTP-клієнт)

Пакет `dio` ([https://pub.dev/packages/dio](https://pub.dev/packages/dio)) є ще одним популярним HTTP-клієнтом для Flutter, який надає розширені можливості, такі як:

* Перехоплювачі (Interceptors) для обробки запитів та відповідей.
* Трансформатори для обробки даних.
* Скачування файлів.
* Відправлення FormData.
* Скасування запитів.
* Тайм-аути.
* Прогрес завантаження/відправлення.

```dart
import 'package:dio/dio.dart';

Future<void> fetchDataWithDio() async {
  final dio = Dio();
  try {
    final response = await dio.get('[https://jsonplaceholder.typicode.com/todos/1](https://jsonplaceholder.typicode.com/todos/1)');
    if (response.statusCode == 200) {
      print(response.data);
    } else {
      print('Помилка запиту (Dio): ${response.statusCode}');
    }
  } catch (e) {
    print('Виникла помилка (Dio): $e');
  }
}
```

`dio` є більш потужним інструментом, особливо корисним для складних сценаріїв роботи з мережею.

## Обробка JSON

Часто мережеві API повертають дані у форматі JSON. Flutter має вбудовану бібліотеку `dart:convert` для кодування та декодування JSON.

```dart
import 'dart:convert';

void processJson(String jsonString) {
  final jsonData = jsonDecode(jsonString);
  if (jsonData is Map<String, dynamic>) {
    print('Заголовок: ${jsonData['title']}');
    print('Завершено: ${jsonData['completed']}');
  } else if (jsonData is List<dynamic>) {
    for (var item in jsonData) {
      print('ID: ${item['id']}, Заголовок: ${item['title']}');
    }
  }
}
```

Для роботи зі складними JSON-структурами може бути корисно використовувати пакети для автоматичної генерації коду на основі JSON-схем, такі як `json_serializable` та `json_annotation` ([https://pub.dev/packages/json\_serializable](https://pub.dev/packages/json_serializable)).

## Асинхронність

Мережеві запити є асинхронними операціями, оскільки вони можуть зайняти деякий час. У Flutter для роботи з асинхронним кодом використовуються ключові слова `async` та `await`, а також класи `Future`.

```dart
Future<String> fetchDataAsync() async {
  final response = await http.get(Uri.parse('[https://jsonplaceholder.typicode.com/todos/1](https://jsonplaceholder.typicode.com/todos/1)'));
  if (response.statusCode == 200) {
    final jsonData = jsonDecode(response.body);
    return jsonData['title'];
  } else {
    throw Exception('Не вдалося отримати дані');
  }
}

void main() async {
  try {
    final title = await fetchDataAsync();
    print('Заголовок: $title');
  } catch (e) {
    print('Помилка: $e');
  }
}
```

## Обробка помилок

При роботі з мережею важливо правильно обробляти можливі помилки, такі як відсутність підключення до інтернету, помилки сервера (4xx, 5xx), тайм-аути тощо. Використовуйте блоки `try-catch` для обробки винятків та перевіряйте статус коди відповідей.

```dart
Future<void> fetchDataWithErrorHandling() async {
  try {
    final response = await http.get(Uri.parse('[https://example.com/api/data](https://example.com/api/data)'));
    if (response.statusCode == 200) {
      final jsonData = jsonDecode(response.body);
      print(jsonData);
    } else if (response.statusCode >= 400 && response.statusCode < 500) {
      print('Помилка клієнта: ${response.statusCode}');
    } else if (response.statusCode >= 500) {
      print('Помилка сервера: ${response.statusCode}');
    }
  } catch (e) {
    print('Виникла помилка під час запиту: $e');
  }
}
```

## Відображення стану завантаження

Під час виконання мережевих запитів важливо інформувати користувача про стан завантаження (наприклад, відображати індикатор прогресу). Для цього можна використовувати віджети, такі як `FutureBuilder` або керувати станом завантаження вручну за допомогою `StatefulWidget`.

**Використання `FutureBuilder`:**

```dart
Future<Map<String, dynamic>> fetchDataFuture() async {
  await Future.delayed(Duration(seconds: 2)); // Імітація затримки
  final response = await http.get(Uri.parse('[https://jsonplaceholder.typicode.com/todos/1](https://jsonplaceholder.typicode.com/todos/1)'));
  if (response.statusCode == 200) {
    return jsonDecode(response.body);
  } else {
    throw Exception('Не вдалося отримати дані');
  }
}

class DataScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Отримання даних')),
      body: FutureBuilder<Map<String, dynamic>>(
        future: fetchDataFuture(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text('Помилка: ${snapshot.error}'));
          } else if (snapshot.hasData) {
            final data = snapshot.data!;
            return Center(child: Text('Заголовок: ${data['title']}'));
          } else {
            return Center(child: Text('Немає даних'));
          }
        },
      ),
    );
  }
}
```

## Висновок

Робота з мережею є важливою частиною розробки багатьох Flutter-застосунків. Вибір відповідної бібліотеки ( `http` для простих запитів, `dio` для складніших сценаріїв) та правильна обробка асинхронності, JSON та помилок є ключовими аспектами успішної інтеграції мережевих можливостей у ваш застосунок. Не забувайте також про інформування користувача про стан завантаження даних.