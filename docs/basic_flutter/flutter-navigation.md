# Навігація у Flutter: Переходи між екранами

Навігація є ключовою частиною будь-якого багатоекранного застосунку. Flutter надає потужну систему для керування переходами між різними екранами (маршрутами) вашого застосунку.

## Основні поняття

* **Маршрут (Route):** Абстракція для "екрана" або "сторінки" у вашому застосунку. У Flutter маршрути представлені віджетами.
* **Навігатор (Navigator):** Віджет, який керує стеком маршрутів застосунку. Він надає методи для додавання (`push`) та видалення (`pop`) маршрутів зі стеку.
* **Стек навігації (Navigation Stack):** Концептуальний стек, у якому зберігаються відкриті маршрути. Верхній маршрут у стеку є видимим на екрані.

## Базова навігація

Найпростіший спосіб навігації між екранами у Flutter — використовувати `Navigator`.

### Перехід на новий екран (`Navigator.push`)

Метод `Navigator.push()` додає новий маршрут на вершину стеку навігації, відображаючи таким чином новий екран. Зазвичай використовується разом з `MaterialPageRoute` (для Material Design) або `CupertinoPageRoute` (для iOS-стилю) для визначення анімації переходу.

```dart
import 'package:flutter/material.dart';

class FirstScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Перший екран'),
      ),
      body: Center(
        child: ElevatedButton(
          child: Text('Перейти на другий екран'),
          onPressed: () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => SecondScreen()),
            );
          },
        ),
      ),
    );
  }
}

class SecondScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Другий екран'),
      ),
      body: Center(
        child: Text('Це другий екран!'),
      ),
    );
  }
}
```

У цьому прикладі при натисканні кнопки на `FirstScreen` на стек навігації додається `SecondScreen`, і він стає видимим.

### Повернення на попередній екран (`Navigator.pop`)

Метод `Navigator.pop()` видаляє поточний верхній маршрут зі стеку навігації, повертаючись таким чином до попереднього екрану.

```dart
import 'package:flutter/material.dart';

class SecondScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Другий екран'),
      ),
      body: Center(
        child: ElevatedButton(
          child: Text('Повернутися на перший екран'),
          onPressed: () {
            Navigator.pop(context);
          },
        ),
      ),
    );
  }
}
```

При натисканні кнопки на `SecondScreen` він видаляється зі стеку, і `FirstScreen` знову стає видимим.

## Передача даних між екранами

Часто виникає потреба передавати дані з одного екрана на інший. Це можна зробити, передаючи аргументи в конструктор наступного екрана.

```dart
class SecondScreen extends StatelessWidget {
  final String message;

  SecondScreen({required this.message});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Другий екран'),
      ),
      body: Center(
        child: Text('Отримане повідомлення: $message'),
      ),
    );
  }
}

// Перехід з FirstScreen на SecondScreen з передачею даних
Navigator.push(
  context,
  MaterialPageRoute(builder: (context) => SecondScreen(message: 'Привіт з першого екрану!')),
);
```

## Повернення даних з екрана

Іноді вам потрібно отримати результат з екрана, на який ви перейшли (наприклад, дані, введені користувачем). Метод `Navigator.push()` повертає `Future`, який завершується значенням, переданим у `Navigator.pop()` на наступному екрані.

```dart
class FirstScreen extends StatelessWidget {
  Future<String?> _navigateToSecondScreen(BuildContext context) async {
    final result = await Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => SecondScreen()),
    );
    return result as String?;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Перший екран'),
      ),
      body: Center(
        child: ElevatedButton(
          child: Text('Перейти на другий екран та отримати результат'),
          onPressed: () async {
            final message = await _navigateToSecondScreen(context);
            if (message != null) {
              ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Отримано: $message')));
            }
          },
        ),
      ),
    );
  }
}

class SecondScreen extends StatelessWidget {
  final TextEditingController _controller = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Другий екран'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: <Widget>[
            TextField(
              controller: _controller,
              decoration: InputDecoration(labelText: 'Введіть повідомлення'),
            ),
            SizedBox(height: 20),
            ElevatedButton(
              child: Text('Повернути повідомлення'),
              onPressed: () {
                Navigator.pop(context, _controller.text);
              },
            ),
          ],
        ),
      ),
    );
  }
}
```

У цьому прикладі `SecondScreen` повертає текст, введений у `TextField`, за допомогою `Navigator.pop(context, _controller.text)`. `FirstScreen` отримує цей результат через `await` на `Navigator.push()`.

## Іменовані маршрути (Named Routes)

Для складніших застосунків зручно використовувати іменовані маршрути. Це дозволяє визначати маршрути за їхніми іменами у `MaterialApp` (або `CupertinoApp`) і переходити до них за цим іменем.

```dart
void main() {
  runApp(MaterialApp(
    title: 'Іменовані маршрути',
    initialRoute: '/', // Початковий маршрут
    routes: {
      '/': (context) => FirstScreen(),
      '/second': (context) => SecondScreen(message: ModalRoute.of(context)?.settings.arguments as String? ?? ''),
      '/third': (context) => ThirdScreen(),
    },
  ));
}

class FirstScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Перший екран'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            ElevatedButton(
              child: Text('Перейти на другий екран з даними'),
              onPressed: () {
                Navigator.pushNamed(context, '/second', arguments: 'Дані з першого екрану');
              },
            ),
            SizedBox(height: 20),
            ElevatedButton(
              child: Text('Перейти на третій екран'),
              onPressed: () {
                Navigator.pushNamed(context, '/third');
              },
            ),
          ],
        ),
      ),
    );
  }
}

class SecondScreen extends StatelessWidget {
  final String message;

  SecondScreen({required this.message});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Другий екран'),
      ),
      body: Center(
        child: Text('Отримані аргументи: $message'),
      ),
    );
  }
}

class ThirdScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Третій екран'),
      ),
      body: Center(
        child: ElevatedButton(
          child: Text('Повернутися на головний екран'),
          onPressed: () {
            Navigator.pop(context);
          },
        ),
      ),
    );
  }
}
```

* `initialRoute`: Визначає маршрут, який відображається першим при запуску застосунку.
* `routes`: Мапа, де ключами є імена маршрутів (рядки), а значеннями — функції-білдери, які повертають відповідні віджети екранів.
* `Navigator.pushNamed(context, '/second', arguments: '...')`: Переходить до іменованого маршруту `/second` і передає дані через `arguments`.
* `ModalRoute.of(context)?.settings.arguments`: Отримує аргументи, передані при переході до маршруту.

### Генерація маршрутів (`onGenerateRoute`)

Для більш складних сценаріїв, наприклад, коли вам потрібно динамічно генерувати маршрути на основі певних умов або переданих аргументів, можна використовувати `onGenerateRoute` у `MaterialApp`.

```dart
MaterialApp(
  title: 'Генерація маршрутів',
  initialRoute: '/',
  routes: {
    '/': (context) => FirstScreen(),
  },
  onGenerateRoute: (settings) {
    if (settings.name == '/second') {
      final String message = settings.arguments as String? ?? '';
      return MaterialPageRoute(builder: (context) => SecondScreen(message: message));
    }
    return null; // Якщо маршрут не знайдено
  },
);
```

`onGenerateRoute` викликається, коли `Navigator.pushNamed` отримує невідоме ім'я маршруту. Він приймає `RouteSettings` (що містить ім'я маршруту та аргументи) і повинен повернути `Route` (наприклад, `MaterialPageRoute`).

## Заміна маршруту (`Navigator.pushReplacement`)

Метод `Navigator.pushReplacement()` замінює поточний верхній маршрут у стеку на новий. Це корисно, наприклад, після успішної авторизації, коли ви не хочете, щоб користувач міг повернутися на екран входу за допомогою кнопки "Назад".

```dart
Navigator.pushReplacement(
  context,
  MaterialPageRoute(builder: (context) => HomeScreen()),
);
```

## Видалення всіх маршрутів до певного (`Navigator.pushAndRemoveUntil`)

Метод `Navigator.pushAndRemoveUntil()` додає новий маршрут і видаляє всі існуючі маршрути до тих пір, поки не буде знайдено маршрут, для якого передана функція-предикат повертає `true`. Це часто використовується для навігації до головного екрана після виходу з облікового запису.

```dart
Navigator.pushAndRemoveUntil(
  context,
  MaterialPageRoute(builder: (context) => HomeScreen()),
  (route) => false, // Видалити всі маршрути
);

// Залишити лише перший маршрут у стеку
Navigator.pushAndRemoveUntil(
  context,
  MaterialPageRoute(builder: (context) => HomeScreen()),
  (route) => route.isFirst,
);
```

## Керування навігацією без контексту

У деяких випадках (наприклад, у колбеках або сервісних класах) у вас може не бути прямого доступу до `BuildContext`. Для керування навігацією без контексту можна використовувати `GlobalKey` для `NavigatorState`.

```dart
final GlobalKey<NavigatorState> navigatorKey = GlobalKey<NavigatorState>();

void main() {
  runApp(MaterialApp(
    navigatorKey: navigatorKey, // Призначення GlobalKey до Navigator
    title: 'Навігація без контексту',
    home: FirstScreen(),
  ));
}

void navigateToSecondScreen() {
  navigatorKey.currentState?.push(
    MaterialPageRoute(builder: (context) => SecondScreen(message: 'Навігація без контексту!')),
  );
}
```

## Сторонні бібліотеки для навігації

Для більш складних сценаріїв навігації існують сторонні бібліотеки, які пропонують розширені можливості, такі як:

* **GoRouter:** Декларативна маршрутизація з підтримкою веб-посилань, перенаправлень та іншого.
* **Fluro:** Потужна система маршрутизації з підтримкою параметрів маршрутів, регуляризації та анімацій.
* **GetX:** Фреймворк, який включає в себе просту та потужну систему навігації.

Вибір бібліотеки залежить від потреб вашого проєкту.

Розуміння основних концепцій навігації у Flutter та вміння використовувати `Navigator` є важливим для створення багатоекранних застосунків. Експериментуйте з різними методами навігації, щоб вибрати найбільш підходящий для вашого випадку.