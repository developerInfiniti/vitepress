---
description: "Основы Flutter: установка, первое приложение, hot reload, структура проекта — быстрый старт разработчика"
---

# Основи Flutter

Flutter — це UI-фреймворк з відкритим вихідним кодом, розроблений Google для створення красивих, нативно скомпільованих застосунків для мобільних пристроїв (iOS та Android), вебу та десктопу з однієї кодової бази.

## Основні концепції

### Віджети (Widgets)

У Flutter все є віджетом. Віджети описують, як має виглядати та поводитися ваш UI. Вони є будівельними блоками інтерфейсу. Існує два основних типи віджетів:

* **StatelessWidget:** Віджети, стан яких не може змінюватися після їх створення. Вони корисні для відображення статичної інформації або UI-елементів, які не потребують динамічного оновлення.

    ```dart
    class MyStatelessWidget extends StatelessWidget {
      final String message;

      MyStatelessWidget({required this.message});

      @override
      Widget build(BuildContext context) {
        return Text(message);
      }
    }
    ```

* **StatefulWidget:** Віджети, стан яких може змінюватися протягом їх життєвого циклу. Вони використовуються для динамічного UI, який реагує на події або зміни даних. Stateful віджети складаються з двох класів: самого віджета та класу `State`, який містить стан віджета та логіку його оновлення.

    ```dart
    class MyStatefulWidget extends StatefulWidget {
      @override
      _MyStatefulWidgetState createState() => _MyStatefulWidgetState();
    }

    class _MyStatefulWidgetState extends State<MyStatefulWidget> {
      int _counter = 0;

      void _incrementCounter() {
        setState(() {
          _counter++;
        });
      }

      @override
      Widget build(BuildContext context) {
        return Column(
          children: <Widget>[
            Text('Лічильник: $_counter'),
            ElevatedButton(
              onPressed: _incrementCounter,
              child: Text('Збільшити'),
            ),
          ],
        );
      }
    }
    ```

    Метод `setState()` використовується для повідомлення Flutter про те, що стан віджета змінився, і UI потрібно перемалювати.

### Дерево віджетів (Widget Tree)

UI у Flutter будується як ієрархія вкладених віджетів, утворюючи дерево віджетів. Кожен віджет є вузлом цього дерева. Flutter ефективно керує цим деревом для оновлення UI при зміні стану.

### Макетування (Layout)

Flutter надає різноманітні віджети для макетування UI:

* **Row:** Розташовує дочірні віджети горизонтально.
* **Column:** Розташовує дочірні віджети вертикально.
* **Stack:** Розташовує дочірні віджети один над одним.
* **Expanded:** Змушує дочірній віджет займати доступний простір у `Row` або `Column`.
* **Flexible:** Схожий на `Expanded`, але дозволяє вказувати коефіцієнт гнучкості.
* **Center:** Центрує дочірній віджет.
* **Padding:** Додає відступи навколо дочірнього віджета.
* **Margin:** Додає відступи зовні від дочірнього віджета.
* **SizedBox:** Віджет фіксованого розміру.

### Маршрутизація (Routing)

Для навігації між різними екранами (сторінками) у Flutter використовуються маршрути.

* **Navigator:** Клас, який керує стеком маршрутів застосунку.
* **MaterialPageRoute:** Стандартний спосіб переходу між екранами з анімацією, характерною для Material Design.
* **Navigator.push():** Додає новий маршрут на вершину стеку навігації.
* **Navigator.pop():** Видаляє поточний маршрут з вершини стеку та повертається до попереднього екрану.

    ```dart
    // Перехід на новий екран
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => NewScreen()),
    );

    // Повернення з поточного екрана
    Navigator.pop(context);
    ```

### Стан (State Management)

Керування станом є однією з найважливіших тем у розробці Flutter-застосунків. Існує кілька підходів до керування станом, від простих `setState()` до більш складних рішень, таких як:

* **Provider:** Простий у використанні спосіб керування станом, заснований на патерні "наслідування віджета".
* **Riverpod:** Покращена версія Provider з більшою безпекою типів та гнучкістю.
* **Bloc/Cubit:** Архітектурний патерн для керування складним станом, заснований на подіях та станах.
* **GetX:** Потужний фреймворк, який включає керування станом, маршрутизацію, залежності та багато іншого.

Вибір підходу залежить від складності вашого застосунку. Для простих UI `setState()` або `Provider` можуть бути достатніми.

### Теми (Themes)

Flutter дозволяє налаштовувати візуальний стиль вашого застосунку за допомогою тем. Ви можете визначити кольори, типографіку, іконки та інші візуальні параметри, які будуть застосовуватися до всіх віджетів, що використовують тему.

    ```dart
    MaterialApp(
      theme: ThemeData(
        primarySwatch: Colors.blue,
        accentColor: Colors.amber,
        textTheme: TextTheme(
          headline1: TextStyle(fontSize: 72.0, fontWeight: FontWeight.bold),
          bodyText2: TextStyle(fontSize: 14.0, fontFamily: 'Roboto'),
        ),
      ),
      home: MyHomePage(),
    );
    ```

### Обробка подій (Event Handling)

Flutter надає механізми для обробки різних подій, таких як натискання кнопок, введення тексту, жести та інше. Багато віджетів мають колбеки `onPressed`, `onChanged`, `onTap` тощо, які дозволяють реагувати на ці події.

    ```dart
    ElevatedButton(
      onPressed: () {
        print('Кнопку натиснуто!');
      },
      child: Text('Натисни мене'),
    );

    GestureDetector(
      onTap: () {
        print('Віджет натиснуто!');
      },
      child: Container(
        width: 100,
        height: 100,
        color: Colors.red,
      ),
    );
    ```

### Асинхронність (Asynchronous Operations)

Для виконання операцій, які можуть зайняти деякий час (наприклад, мережеві запити, читання файлів), у Flutter використовуються асинхронні функції (`async`) та ключові слова `await`. `Future` представляє результат асинхронної операції.

    ```dart
    Future<String> fetchData() async {
      await Future.delayed(Duration(seconds: 2));
      return 'Дані отримано!';
    }

    void main() async {
      print('Початок отримання даних...');
      String data = await fetchData();
      print(data); // Виведе "Дані отримано!" через 2 секунди
    }
    ```

### Робота з мережею (Networking)

Flutter має вбудовані бібліотеки для виконання HTTP-запитів та роботи з веб-сервісами. Зазвичай використовується пакет `http`.

    ```dart
    import 'package:http/http.dart' as http;
    import 'dart:convert';

    Future<Map<String, dynamic>> fetchAlbum() async {
      final response = await http.get(Uri.parse('[https://jsonplaceholder.typicode.com/albums/1](https://jsonplaceholder.typicode.com/albums/1)'));

      if (response.statusCode == 200) {
        return jsonDecode(response.body) as Map<String, dynamic>;
      } else {
        throw Exception('Не вдалося завантажити альбом');
      }
    }

    void main() async {
      try {
        Map<String, dynamic> album = await fetchAlbum();
        print(album['title']);
      } catch (e) {
        print('Помилка: $e');
      }
    }
    ```

### Робота з JSON (JSON Handling)

Flutter надає вбудовану підтримку для кодування та декодування JSON-даних за допомогою бібліотеки `dart:convert`.

    ```dart
    import 'dart:convert';

    void main() {
      String jsonString = '{"name": "Іван", "age": 30}';
      Map<String, dynamic> userData = jsonDecode(jsonString) as Map<String, dynamic>;
      print('Ім\'я: ${userData['name']}, Вік: ${userData['age']}');

      Map<String, dynamic> user = {'name': 'Петро', 'age': 25};
      String encodedJson = jsonEncode(user);
      print(encodedJson);
    }
    ```

## Перший застосунок Flutter

Основний файл вашого Flutter-застосунку зазвичай називається `main.dart`. Точка входу в застосунок — це функція `main()`, яка викликає функцію `runApp()` з кореневим віджетом вашого застосунку.

    ```dart
    import 'package:flutter/material.dart';

    void main() {
      runApp(MyApp());
    }

    class MyApp extends StatelessWidget {
      @override
      Widget build(BuildContext context) {
        return MaterialApp(
          title: 'Мій перший застосунок',
          theme: ThemeData(
            primarySwatch: Colors.blue,
          ),
          home: MyHomePage(title: 'Головна сторінка'),
        );
      }
    }

    class MyHomePage extends StatefulWidget {
      MyHomePage({required this.title});

      final String title;

      @override
      _MyHomePageState createState() => _MyHomePageState();
    }

    class _MyHomePageState extends State<MyHomePage> {
      int _counter = 0;

      void _incrementCounter() {
        setState(() {
          _counter++;
        });
      }

      @override
      Widget build(BuildContext context) {
        return Scaffold(
          appBar: AppBar(
            title: Text(widget.title),
          ),
          body: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                Text(
                  'Ви натиснули кнопку:',
                ),
                Text(
                  '$_counter',
                  style: Theme.of(context).textTheme.headline4,
                ),
              ],
            ),
          ),
          floatingActionButton: FloatingActionButton(
            onPressed: _incrementCounter,
            tooltip: 'Збільшити',
            child: Icon(Icons.add),
          ),
        );
      }
    }
    ```

    * **MaterialApp:** Кореневий віджет для застосунків, що використовують Material Design.
    * **Scaffold:** Забезпечує базову структуру екрану (AppBar, Body, FloatingActionButton тощо).
    * **AppBar:** Панель у верхній частині екрану.
    * **Center:** Центрує дочірній віджет.
    * **Column:** Розташовує дочірні віджети вертикально.
    * **Text:** Віджет для відображення тексту.
    * **ElevatedButton:** Кнопка з підняттям.
    * **FloatingActionButton:** Плаваюча кнопка дії.
    * **Icon:** Віджет для відображення іконок.

## Висновок

Це лише базовий огляд основних концепцій Flutter. Для глибшого розуміння та вивчення фреймворку рекомендується ознайомитися з офіційною документацією Flutter ([https://flutter.dev/docs](https://flutter.dev/docs)) та практично застосовувати отримані знання у власних проєктах. Flutter пропонує багатий набір інструментів та віджетів для створення красивих та продуктивних застосунків для різних платформ.