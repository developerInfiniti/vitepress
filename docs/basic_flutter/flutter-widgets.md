---
description: "Виджеты Flutter: StatelessWidget, StatefulWidget, встроенные виджеты — основы построения UI"
---

# Віджети у Flutter: Будівельні блоки UI

У Flutter все є віджетом. Віджети описують, як має виглядати та поводитися ваш інтерфейс користувача. Вони є незмінними (immutable) об'єктами, що означає, що після створення віджет не може бути змінений. Для відображення динамічного UI використовуються спеціальні віджети, такі як `StatefulWidget`, які керують своїм внутрішнім станом.

## Основні категорії віджетів

Віджети у Flutter можна поділити на кілька основних категорій:

### 1. Базові віджети (Basic Widgets)

Ці віджети є основними будівельними блоками для відображення контенту та структури.

* **Text:** Відображає текстовий контент зі стилізацією.

    ```dart
    Text(
      'Привіт, Flutter!',
      style: TextStyle(fontSize: 24.0, fontWeight: FontWeight.bold),
    )
    ```

* **Icon:** Відображає іконку з набору Material Icons або власних іконок.

    ```dart
    Icon(Icons.favorite, color: Colors.red, size: 30.0)
    ```

* **Image:** Відображає зображення з різних джерел (активи, мережа, пам'ять).

    ```dart
    // Зображення з активів
    Image.asset('assets/my_image.png');

    // Зображення з мережі
    Image.network('[https://via.placeholder.com/150](https://via.placeholder.com/150)');
    ```

### 2. Віджети макетування (Layout Widgets)

Ці віджети використовуються для організації та розміщення інших віджетів на екрані.

* **Row:** Розташовує дочірні віджети горизонтально.

    ```dart
    Row(
      mainAxisAlignment: MainAxisAlignment.spaceAround,
      children: <Widget>[
        Text('Перший'),
        Text('Другий'),
        Text('Третій'),
      ],
    )
    ```

* **Column:** Розташовує дочірні віджети вертикально.

    ```dart
    Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Text('Перший рядок'),
        Text('Другий рядок'),
        Text('Третій рядок'),
      ],
    )
    ```

* **Stack:** Розташовує дочірні віджети один над одним. Позиціонування дочірніх віджетів можна контролювати за допомогою `Positioned`.

    ```dart
    Stack(
      children: <Widget>[
        Image.asset('assets/background.png'),
        Positioned(
          bottom: 20,
          right: 20,
          child: Text('Текст на зображенні', style: TextStyle(color: Colors.white)),
        ),
      ],
    )
    ```

* **Expanded:** Змушує дочірній віджет займати доступний простір у `Row` або `Column` пропорційно до його `flex` фактора (за замовчуванням 1).

    ```dart
    Row(
      children: <Widget>[
        Expanded(child: Text('Займає більшу частину простору')),
        Text('Менше місця'),
      ],
    )
    ```

* **Flexible:** Схожий на `Expanded`, але дозволяє вказувати коефіцієнт гнучкості (`flex`) та `fit` (як віджет повинен використовувати доступний простір).

    ```dart
    Row(
      children: <Widget>[
        Flexible(flex: 2, fit: FlexFit.tight, child: Container(color: Colors.blue, height: 50)),
        Flexible(flex: 1, fit: FlexFit.loose, child: Container(color: Colors.green, height: 50)),
      ],
    )
    ```

* **Center:** Центрує свій дочірній віджет.

    ```dart
    Center(child: Text('Я в центрі!'))
    ```

* **Padding:** Додає відступи навколо свого дочірнього віджета.

    ```dart
    Padding(
      padding: EdgeInsets.all(16.0),
      child: Text('З відступами'),
    )
    ```

* **Container:** Універсальний віджет, який може містити інші віджети та застосовувати до них оформлення (розміри, колір, фон, межі тощо).

    ```dart
    Container(
      width: 200,
      height: 100,
      color: Colors.yellow,
      padding: EdgeInsets.all(8.0),
      child: Text('Контейнер'),
    )
    ```

* **SizedBox:** Віджет фіксованого розміру. Може використовуватися для створення проміжків між віджетами.

    ```dart
    Column(
      children: <Widget>[
        Text('Перший'),
        SizedBox(height: 20), // Проміжок у 20 пікселів
        Text('Другий'),
      ],
    )
    ```

### 3. Віджети керування станом (State Management Widgets)

Ці віджети використовуються для створення динамічного UI, який може змінюватися з часом.

* **StatelessWidget:** Віджет, стан якого не може змінюватися після його створення.

    ```dart
    class MyStatelessText extends StatelessWidget {
      final String text;

      MyStatelessText({required this.text});

      @override
      Widget build(BuildContext context) {
        return Text(text);
      }
    }
    ```

* **StatefulWidget:** Віджет, стан якого може змінюватися протягом його життєвого циклу. Він створює окремий об'єкт `State`, який містить стан та логіку його оновлення.

    ```dart
    class MyCounter extends StatefulWidget {
      @override
      _MyCounterState createState() => _MyCounterState();
    }

    class _MyCounterState extends State<MyCounter> {
      int _count = 0;

      void _increment() {
        setState(() {
          _count++;
        });
      }

      @override
      Widget build(BuildContext context) {
        return Column(
          children: <Widget>[
            Text('Лічильник: $_count'),
            ElevatedButton(onPressed: _increment, child: Text('Збільшити')),
          ],
        );
      }
    }
    ```

### 4. Віджети взаємодії (Interaction Widgets)

Ці віджети дозволяють користувачам взаємодіяти з UI.

* **ElevatedButton:** Кнопка з підняттям (Material Design).

    ```dart
    ElevatedButton(onPressed: () { print('Натиснуто!'); }, child: Text('Натисни мене'))
    ```

* **TextButton:** Проста текстова кнопка (Material Design).

    ```dart
    TextButton(onPressed: () { /* ... */ }, child: Text('Текстова кнопка'))
    ```

* **OutlinedButton:** Кнопка з обведенням (Material Design).

    ```dart
    OutlinedButton(onPressed: () { /* ... */ }, child: Text('Кнопка з обведенням'))
    ```

* **TextField:** Поле для введення тексту.

    ```dart
    TextField(
      onChanged: (value) { print('Введено: $value'); },
      decoration: InputDecoration(labelText: 'Введіть текст'),
    )
    ```

* **Checkbox:** Чекбокс.

    ```dart
    bool _isChecked = false;
    Checkbox(
      value: _isChecked,
      onChanged: (bool? newValue) {
        setState(() {
          _isChecked = newValue!;
        });
      },
    )
    ```

* **Radio:** Радіокнопка (для вибору одного варіанту з групи).

    ```dart
    String? _selectedValue = 'перший';
    Radio<String>(
      value: 'перший',
      groupValue: _selectedValue,
      onChanged: (String? value) {
        setState(() {
          _selectedValue = value;
        });
      },
    )
    ```

* **Slider:** Повзунок для вибору значення в діапазоні.

    ```dart
    double _currentValue = 20;
    Slider(
      value: _currentValue,
      min: 0,
      max: 100,
      divisions: 5,
      label: _currentValue.round().toString(),
      onChanged: (double value) {
        setState(() {
          _currentValue = value;
        });
      },
    )
    ```

* **GestureDetector:** Віджет для виявлення різних жестів (натискання, свайпи, довгі натискання тощо).

    ```dart
    GestureDetector(
      onTap: () { print('Натиснуто!'); },
      onDoubleTap: () { print('Подвійне натискання!'); },
      child: Container(width: 100, height: 100, color: Colors.blue),
    )
    ```

### 5. Віджети навігації (Navigation Widgets)

Ці віджети використовуються для переходу між різними екранами або частинами застосунку.

* **Navigator:** Керує стеком маршрутів. Методи `push`, `pop` тощо використовуються для навігації.
* **AppBar:** Панель у верхній частині екрану, часто використовується для заголовка та кнопок навігації.
* **BottomNavigationBar:** Панель навігації внизу екрану для перемикання між основними розділами.
* **Drawer:** Бічна панель навігації, що висувається збоку екрану.

### 6. Віджети оформлення (Material Design & Cupertino Widgets)

Flutter надає набори віджетів, що відповідають візуальним стилям різних платформ.

* **Material Design Widgets:** Віджети, що відповідають гайдлайнам Material Design від Google (наприклад, `AppBar`, `ElevatedButton`, `TextField`). Зазвичай імпортуються з `package:flutter/material.dart`.
* **Cupertino Widgets:** Віджети, що відповідають візуальному стилю iOS (наприклад, `CupertinoNavigationBar`, `CupertinoButton`, `CupertinoTextField`). Зазвичай імпортуються з `package:flutter/cupertino.dart`.

### 7. Інші корисні віджети

* **Scaffold:** Забезпечує базову структуру екрану з AppBar, Body, FloatingActionButton тощо.
* **ListView:** Відображає прокручуваний список елементів.
* **GridView:** Відображає елементи у вигляді сітки, що прокручується.
* **SingleChildScrollView:** Робить свій дочірній віджет прокручуваним, якщо він переповнює доступний простір.
* **FutureBuilder:** Будує UI на основі результату `Future`.
* **StreamBuilder:** Будує UI на основі подій `Stream`.
* **InheritedWidget:** Базовий клас для поширення даних вниз по дереву віджетів. Використовується в більш складних рішеннях керування станом.
* **MediaQuery:** Надає інформацію про медіа-запити (розмір екрана, орієнтація тощо).

## Композиція віджетів

Більшість UI у Flutter створюються шляхом комбінування різних віджетів. Ви вкладаєте одні віджети в інші, щоб створити бажану структуру та зовнішній вигляд.

```dart
Container(
  padding: EdgeInsets.all(16.0),
  color: Colors.grey[200],
  child: Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: <Widget>[
      Text('Заголовок', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
      SizedBox(height: 10),
      Text('Основний текст'),
      ElevatedButton(onPressed: () { /* ... */ }, child: Text('Дія')),
    ],
  ),
)
```

## Висновок

Віджети є фундаментальною концепцією у Flutter. Розуміння різних типів віджетів та способів їх комбінування є ключем до створення складних та красивих інтерфейсів користувача. Експериментуйте з різними віджетами та їх властивостями, щоб навчитися будувати власні UI у Flutter. Офіційна документація Flutter ([https://flutter.dev/docs/reference/widgets](https://flutter.dev/docs/reference/widgets)) містить повний перелік доступних віджетів та їх опис.