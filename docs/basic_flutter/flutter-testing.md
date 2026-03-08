---
description: "Тестирование Flutter приложений: unit, widget, integration тесты — написание надёжных тестов"
---

# Тестування у Flutter: Забезпечення якості вашого застосунку

Тестування є критично важливим аспектом розробки програмного забезпечення, оскільки воно допомагає виявити помилки, переконатися, що ваш застосунок працює належним чином, і полегшує майбутні зміни та рефакторинг. Flutter надає потужну підтримку для різних видів тестування.

## Типи тестів у Flutter

Flutter підтримує три основні типи тестів:

1.  **Юніт-тести (Unit Tests):** Перевіряють окремі функції, методи або класи. Вони є швидкими та ізольованими, не залежать від UI або файлової системи.
2.  **Віджет-тести (Widget Tests):** Перевіряють окремі віджети. Вони дозволяють перевірити, чи правильно відображається віджет, чи реагує на взаємодію та чи правильно взаємодіє з іншими віджетами.
3.  **Інтеграційні тести (Integration Tests):** Перевіряють взаємодію між різними частинами застосунку або з зовнішніми сервісами (наприклад, API, база даних). Вони є найбільш комплексними та повільними.

## Налаштування тестування

За замовчуванням Flutter проекти мають директорію `test/`, де ви розміщуєте файли з тестами. Назва файлу тесту зазвичай відповідає назві файлу, який ви тестуєте, з додаванням суфікса `_test.dart`. Наприклад, для файлу `lib/counter.dart` файл з юніт-тестами буде `test/counter_test.dart`.

Для написання та запуску тестів Flutter використовує пакет `flutter_test`, який вже включено до залежностей вашого проекту.

## Юніт-тести

Юніт-тести зосереджуються на перевірці логіки окремих компонентів.

```dart
// lib/counter.dart
class Counter {
  int _value = 0;

  int get value => _value;

  void increment() {
    _value++;
  }

  void decrement() {
    _value--;
  }
}
````

```dart
// test/counter_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:my_app/counter.dart'; // Шлях до вашого файлу

void main() {
  group('Counter', () {
    test('value starts at 0', () {
      expect(Counter().value, 0);
    });

    test('increment() increases the value', () {
      final counter = Counter();
      counter.increment();
      expect(counter.value, 1);
    });

    test('decrement() decreases the value', () {
      final counter = Counter();
      counter.decrement();
      expect(counter.value, -1);
    });
  });
}
```

* `flutter_test` імпортується для використання функцій тестування.
* `group()` використовується для логічного групування пов'язаних тестів.
* `test()` визначає окремий тест з описом.
* `expect()` використовується для перевірки очікуваного результату.

## Віджет-тести

Віджет-тести перевіряють UI-компоненти. Для цього Flutter надає `WidgetTester`, який дозволяє будувати та взаємодіяти з віджетами в тестовому середовищі.

```dart
// lib/my_button.dart
import 'package:flutter/material.dart';

class MyButton extends StatelessWidget {
  final String text;
  final VoidCallback onPressed;

  const MyButton({Key? key, required this.text, required this.onPressed}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: onPressed,
      child: Text(text),
    );
  }
}
```

```dart
// test/my_button_test.dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:my_app/my_button.dart'; // Шлях до вашого файлу

void main() {
  testWidgets('MyButton displays the correct text and calls onPressed', (WidgetTester tester) async {
    String buttonText = 'Натисни мене';
    bool wasPressed = false;

    await tester.pumpWidget(MaterialApp(
      home: MyButton(
        text: buttonText,
        onPressed: () {
          wasPressed = true;
        },
      ),
    ));

    // Перевіряємо, чи відображається текст кнопки
    expect(find.text(buttonText), findsOneWidget);

    // Симулюємо натискання на кнопку
    await tester.tap(find.byType(ElevatedButton));
    await tester.pump(); // Перебудовуємо віджети після взаємодії

    // Перевіряємо, чи був викликаний колбек onPressed
    expect(wasPressed, true);
  });
}
```

* `testWidgets()` використовується для визначення віджет-тесту, який отримує екземпляр `WidgetTester`.
* `tester.pumpWidget()` використовується для побудови віджета в тестовому середовищі. Зазвичай обертається в `MaterialApp` або інший необхідний контекст.
* `find` надає різні способи пошуку віджетів у дереві віджетів (за текстом, типом, ключем тощо).
* `tester.tap()` симулює натискання на знайдений віджет.
* `tester.pump()` запускає процес перебудови віджетів після взаємодії.

## Інтеграційні тести

Інтеграційні тести перевіряють взаємодію між кількома віджетами або з зовнішніми сервісами. Для написання інтеграційних тестів вам потрібно додати залежність `integration_test` до вашого файлу `pubspec.yaml`:

```yaml
dev_dependencies:
  flutter_test:
    sdk: flutter
  integration_test:
    sdk: flutter
```

Створіть директорію `integration_test/` у корені вашого проекту та розмістіть там файли з інтеграційними тестами (зазвичай з суфіксом `_test.dart`).

```dart
// integration_test/app_test.dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:my_app/main.dart' as app; // Шлях до вашого головного файлу

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  group('App flow', () {
    testWidgets('Tap on the increment button and verify the counter', (WidgetTester tester) async {
      app.main(); // Запускаємо наш застосунок

      await tester.pumpAndSettle(); // Чекаємо, поки всі анімації завершаться

      // Знаходимо кнопку збільшення
      final Finder incrementButton = find.byIcon(Icons.add);

      // Знаходимо текст лічильника
      final Finder counterText = find.text('0');

      // Перевіряємо, чи початкове значення лічильника 0
      expect(counterText, findsOneWidget);

      // Симулюємо кілька натискань на кнопку збільшення
      await tester.tap(incrementButton);
      await tester.pumpAndSettle();
      await tester.tap(incrementButton);
      await tester.pumpAndSettle();

      // Перевіряємо, чи значення лічильника стало 2
      expect(find.text('2'), findsOneWidget);
    });
  });
}
```

* `integration_test` імпортується.
* `IntegrationTestWidgetsFlutterBinding.ensureInitialized()` необхідно викликати перед запуском інтеграційних тестів.
* `app.main()` запускає ваш головний застосунок.
* `tester.pumpAndSettle()` чекає, поки всі анімації та асинхронні операції завершаться.

## Запуск тестів

Ви можете запустити тести за допомогою наступних команд у терміналі:

* **Запуск усіх тестів у проекті:** `flutter test`
* **Запуск тестів з конкретного файлу:** `flutter test test/counter_test.dart`
* **Запуск інтеграційних тестів:** `flutter test integration_test/app_test.dart` (або `flutter run integration_test/app_test.dart` на реальному пристрої чи емуляторі)

## Корисні функції та методи `flutter_test`

* `setUp()`: Виконується перед кожним тестом у групі або в окремому файлі. Використовується для налаштування тестового середовища.
* `tearDown()`: Виконується після кожного тесту. Використовується для очищення тестового середовища.
* `setUpAll()`: Виконується один раз перед усіма тестами в групі або файлі.
* `tearDownAll()`: Виконується один раз після всіх тестів у групі або файлі.
* `find.byKey(Key key)`: Пошук віджета за його `Key`.
* `find.byType<MyWidget>()`: Пошук віджета за його типом.
* `find.byWidgetPredicate((widget) => widget is Text && widget.data == '...');`: Пошук віджета за складною умовою.
* `tester.enterText(find.byType(TextField), 'текст')`: Введення тексту в `TextField`.
* `tester.drag(find.byType(Slider), const Offset(50.0, 0.0))`: Перетягування віджета.
* `tester.scrollUntilVisible(find.text('Елемент'), find.byType(ListView))`: Прокрутка до видимого віджета в прокручуваному контейнері.

## Mocking та Stubbing

При тестуванні часто виникає потреба ізолювати код, який ви тестуєте, від залежностей (наприклад, зовнішніх сервісів, баз даних). Для цього використовуються техніки мокування (mocking) та стабінгу (stubbing).

* **Мок-об'єкти (Mocks):** Імітують поведінку залежностей, дозволяючи вам перевіряти, як ваш код взаємодіє з цими залежностями. Для створення мок-об'єктів у Flutter часто використовується пакет `mockito`.
* **Стаб-об'єкти (Stubs):** Надають контрольовані значення для залежностей, щоб спростити тестування різних сценаріїв.

Для використання `mockito`, додайте його до `dev_dependencies`:

```yaml
dev_dependencies:
  flutter_test:
    sdk: flutter
  mockito: ^<версія>
  build_runner: ^<версія>
```

Потім ви можете створювати мок-об'єкти та налаштовувати їхню поведінку у ваших тестах.

## Code Coverage

Code coverage (покриття коду) — це метрика, яка показує, яка частина вашого коду була виконана під час запуску тестів. Flutter має вбудовану підтримку для збору інформації про покриття коду. Запустіть тести з прапором `--coverage`:

```bash
flutter test --coverage
```

Після запуску тестів у корені вашого проекту буде створено файл `coverage/lcov.info`, який містить інформацію про покриття коду. Ви можете використовувати сторонні інструменти для візуалізації цих даних.

## Висновок

Тестування є невід'ємною частиною розробки якісних Flutter-застосунків. Flutter надає потужні інструменти для написання юніт-, віджет- та інтеграційних тестів. Регулярне написання та запуск тестів допоможе вам виявляти помилки на ранніх етапах розробки, підвищити стабільність вашого застосунку та полегшити його підтримку. Не забувайте також про використання мокування та стабінгу для ізоляції тестів та аналіз покриття коду для оцінки якості вашого тестового набору.
