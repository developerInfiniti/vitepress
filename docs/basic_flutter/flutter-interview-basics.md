# Співбесіда Flutter: Основи

Базові питання, які часто задають на співбесідах по Flutter.

## Віджети (Widgets)

### Що таке віджет у Flutter?

**Відповідь:** Віджет — це базовий будівельний блок UI у Flutter. Все у Flutter є віджетом: текст, кнопки, відступи, макети. Віджети описують, як має виглядати UI на основі поточного стану.

```dart
// Все є віджетом
Text('Привіт')           // Текст - віджет
Padding(...)             // Відступ - віджет
Container(...)           // Контейнер - віджет
MaterialApp(...)         // Застосунок - віджет
```

**Ключові особливості:**
- Віджети незмінні (immutable)
- Описують конфігурацію, а не малювання
- Формують дерево віджетів

---

### Різниця між StatelessWidget та StatefulWidget?

**Відповідь:**

| StatelessWidget | StatefulWidget |
|-----------------|----------------|
| Не має внутрішнього стану | Має внутрішній стан |
| Метод `build()` викликається один раз | `build()` викликається при зміні стану |
| Для статичного UI | Для динамічного UI |
| Більш ефективний | Потребує більше ресурсів |

```dart
// StatelessWidget - незмінний
class MyStateless extends StatelessWidget {
  final String text;
  const MyStateless({required this.text});

  @override
  Widget build(BuildContext context) {
    return Text(text);
  }
}

// StatefulWidget - зі станом
class MyStateful extends StatefulWidget {
  @override
  _MyStatefulState createState() => _MyStatefulState();
}

class _MyStatefulState extends State<MyStateful> {
  int _counter = 0;

  void _increment() {
    setState(() {
      _counter++;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Text('$_counter');
  }
}
```

---

### Що робить setState()?

**Відповідь:** `setState()` повідомляє Flutter, що внутрішній стан віджета змінився і потрібно перебудувати UI. Він запускає метод `build()`.

```dart
// Правильно
setState(() {
  _counter++;
});

// Неправильно - не викличе перебудову
_counter++;
```

**Важливо:**
- Викликайте тільки всередині State
- Не викликайте в `build()`, `initState()`, `dispose()`
- Асинхронні операції виконуйте поза `setState()`

```dart
// Правильний асинхронний виклик
Future<void> _loadData() async {
  final data = await fetchData(); // Спочатку отримуємо дані
  setState(() {
    _data = data; // Потім оновлюємо стан
  });
}
```

---

### Поясніть життєвий цикл StatefulWidget

**Відповідь:**

```dart
class MyWidget extends StatefulWidget {
  @override
  _MyWidgetState createState() => _MyWidgetState();
}

class _MyWidgetState extends State<MyWidget> {
  // 1. Конструктор
  _MyWidgetState() {
    print('1. Constructor');
  }

  // 2. initState - викликається один раз при створенні
  @override
  void initState() {
    super.initState();
    print('2. initState');
    // Ініціалізація: підписки, контролери
  }

  // 3. didChangeDependencies - при зміні залежностей (InheritedWidget)
  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    print('3. didChangeDependencies');
  }

  // 4. build - будує UI
  @override
  Widget build(BuildContext context) {
    print('4. build');
    return Container();
  }

  // 5. didUpdateWidget - коли батьківський віджет перебудовується
  @override
  void didUpdateWidget(covariant MyWidget oldWidget) {
    super.didUpdateWidget(oldWidget);
    print('5. didUpdateWidget');
  }

  // 6. deactivate - коли віджет видаляється з дерева (тимчасово)
  @override
  void deactivate() {
    print('6. deactivate');
    super.deactivate();
  }

  // 7. dispose - коли віджет видаляється остаточно
  @override
  void dispose() {
    print('7. dispose');
    // Очищення: скасування підписок, dispose контролерів
    super.dispose();
  }
}
```

**Порядок:**
1. `createState()`
2. `initState()`
3. `didChangeDependencies()`
4. `build()`
5. `didUpdateWidget()` (при оновленні)
6. `setState()` → `build()`
7. `deactivate()`
8. `dispose()`

---

### Що таке BuildContext?

**Відповідь:** `BuildContext` — це посилання на розташування віджета в дереві віджетів. Використовується для:

- Доступу до теми: `Theme.of(context)`
- Доступу до MediaQuery: `MediaQuery.of(context)`
- Навігації: `Navigator.of(context)`
- Доступу до InheritedWidget
- Показу діалогів, snackbar

```dart
@override
Widget build(BuildContext context) {
  // Отримання теми
  final theme = Theme.of(context);

  // Отримання розмірів екрану
  final size = MediaQuery.of(context).size;

  // Навігація
  Navigator.of(context).push(...);

  // Показ SnackBar
  ScaffoldMessenger.of(context).showSnackBar(...);

  return Container();
}
```

**Важливо:** Не зберігайте context у змінних класу — він може стати недійсним.

---

## Keys

### Для чого потрібні Keys?

**Відповідь:** Keys допомагають Flutter ідентифікувати віджети при перебудові дерева. Вони потрібні коли:

1. Порядок елементів списку змінюється
2. Елементи додаються/видаляються зі списку
3. Потрібно зберегти стан віджета

```dart
// Без Key - проблеми при reorder
ListView(
  children: items.map((item) => ListTile(title: Text(item))).toList(),
)

// З Key - правильна поведінка
ListView(
  children: items.map((item) => ListTile(
    key: ValueKey(item.id),
    title: Text(item.name),
  )).toList(),
)
```

---

### Типи Keys та коли їх використовувати?

**Відповідь:**

```dart
// 1. ValueKey - для унікальних значень
ListTile(
  key: ValueKey(user.id), // ID користувача
  title: Text(user.name),
)

// 2. ObjectKey - для унікальних об'єктів
ListTile(
  key: ObjectKey(user), // Сам об'єкт
  title: Text(user.name),
)

// 3. UniqueKey - завжди унікальний (нова ідентичність)
Container(
  key: UniqueKey(), // Новий key кожного разу
)

// 4. GlobalKey - доступ до State з будь-якого місця
final _formKey = GlobalKey<FormState>();

Form(
  key: _formKey,
  child: ...,
)

// Доступ до стану форми
_formKey.currentState?.validate();
_formKey.currentState?.save();
```

**Коли використовувати:**
- `ValueKey` — коли є унікальний ідентифікатор
- `ObjectKey` — коли об'єкт сам є унікальним
- `UniqueKey` — коли потрібна нова ідентичність при кожній перебудові
- `GlobalKey` — коли потрібен доступ до State ззовні

---

## Дерева Flutter

### Опишіть три дерева Flutter

**Відповідь:** Flutter використовує три дерева:

**1. Widget Tree (Дерево віджетів)**
- Незмінна конфігурація UI
- Описує, що має бути показано
- Дешеве для створення

**2. Element Tree (Дерево елементів)**
- Керує життєвим циклом віджетів
- Зв'язує Widget і RenderObject
- Зберігає стан StatefulWidget

**3. RenderObject Tree (Дерево рендерингу)**
- Відповідає за layout і малювання
- Обчислює розміри та позиції
- Взаємодіє з графічним рушієм

```
Widget Tree        Element Tree       RenderObject Tree
     |                  |                    |
  MyApp           MyAppElement              ---
     |                  |                    |
 Scaffold      ScaffoldElement     RenderBox (Scaffold)
     |                  |                    |
  Column         ColumnElement      RenderFlex (Column)
     |                  |                    |
   Text           TextElement       RenderParagraph
```

---

### Чому Widget незмінний?

**Відповідь:**

1. **Продуктивність** — легко порівнювати (identity check)
2. **Передбачуваність** — стан не може змінитися непередбачувано
3. **Безпека потоків** — можна передавати між потоками
4. **Hot Reload** — легко замінити на новий віджет

```dart
// Widget створюється заново при кожній перебудові
@override
Widget build(BuildContext context) {
  return Container( // Новий об'єкт Container
    color: Colors.blue,
    child: Text('Hello'), // Новий об'єкт Text
  );
}
// Але Element та RenderObject перевикористовуються!
```

---

## InheritedWidget

### Що таке InheritedWidget?

**Відповідь:** `InheritedWidget` — це спосіб передати дані вниз по дереву віджетів без явної передачі через конструктори.

```dart
// Створення InheritedWidget
class UserProvider extends InheritedWidget {
  final User user;

  const UserProvider({
    required this.user,
    required Widget child,
  }) : super(child: child);

  static UserProvider? of(BuildContext context) {
    return context.dependOnInheritedWidgetOfExactType<UserProvider>();
  }

  @override
  bool updateShouldNotify(UserProvider oldWidget) {
    return user != oldWidget.user;
  }
}

// Використання
class MyWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final user = UserProvider.of(context)?.user;
    return Text(user?.name ?? 'Unknown');
  }
}
```

**Приклади в Flutter:**
- `Theme.of(context)`
- `MediaQuery.of(context)`
- `Navigator.of(context)`

---

## Навігація

### Як працює навігація у Flutter?

**Відповідь:** Navigator керує стеком маршрутів (Route). Основні методи:

```dart
// Push - додати екран на стек
Navigator.push(context, MaterialPageRoute(
  builder: (context) => SecondScreen(),
));

// Або з іменованими маршрутами
Navigator.pushNamed(context, '/second');

// Pop - повернутися назад
Navigator.pop(context);

// Pop з результатом
Navigator.pop(context, result);

// Отримання результату
final result = await Navigator.push(context, MaterialPageRoute(
  builder: (context) => SelectionScreen(),
));

// Замінити поточний екран
Navigator.pushReplacement(context, MaterialPageRoute(
  builder: (context) => NewScreen(),
));

// Очистити стек і перейти
Navigator.pushAndRemoveUntil(
  context,
  MaterialPageRoute(builder: (context) => HomeScreen()),
  (route) => false, // Видалити всі попередні
);
```

---

### Різниця між Navigator 1.0 та 2.0?

**Відповідь:**

**Navigator 1.0 (Імперативний):**
```dart
// Імперативні виклики
Navigator.push(context, route);
Navigator.pop(context);
```

**Navigator 2.0 (Декларативний):**
```dart
// Декларативний опис стеку
MaterialApp.router(
  routerDelegate: MyRouterDelegate(),
  routeInformationParser: MyRouteInformationParser(),
)

class MyRouterDelegate extends RouterDelegate<AppRoutePath> {
  @override
  Widget build(BuildContext context) {
    return Navigator(
      pages: [
        MaterialPage(child: HomeScreen()),
        if (showDetails)
          MaterialPage(child: DetailsScreen()),
      ],
      onPopPage: (route, result) {
        // Обробка pop
        return route.didPop(result);
      },
    );
  }
}
```

**Порівняння:**
| Navigator 1.0 | Navigator 2.0 |
|---------------|---------------|
| Простіший | Складніший |
| Імперативний | Декларативний |
| Важко синхронізувати з URL | Легка інтеграція з URL |
| Достатній для простих застосунків | Для складної навігації, web |

---

## Практичні питання

### Як уникнути перебудови всього UI при setState?

**Відповідь:**

```dart
// Погано - перебудовує все
class BadExample extends StatefulWidget {
  @override
  _BadExampleState createState() => _BadExampleState();
}

class _BadExampleState extends State<BadExample> {
  int _counter = 0;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        ExpensiveWidget(), // Перебудовується при кожному setState
        Text('$_counter'),
        ElevatedButton(
          onPressed: () => setState(() => _counter++),
          child: Text('Increment'),
        ),
      ],
    );
  }
}

// Добре - ізольований стан
class GoodExample extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const ExpensiveWidget(), // Не перебудовується (const)
        CounterWidget(), // Окремий StatefulWidget
      ],
    );
  }
}

class CounterWidget extends StatefulWidget {
  @override
  _CounterWidgetState createState() => _CounterWidgetState();
}

class _CounterWidgetState extends State<CounterWidget> {
  int _counter = 0;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text('$_counter'),
        ElevatedButton(
          onPressed: () => setState(() => _counter++),
          child: Text('Increment'),
        ),
      ],
    );
  }
}
```

---

### Коли використовувати const?

**Відповідь:** `const` створює compile-time константу, що запобігає перестворенню віджета.

```dart
// Без const - новий об'єкт при кожній перебудові
Text('Hello')
Padding(padding: EdgeInsets.all(8))

// З const - той самий об'єкт
const Text('Hello')
const Padding(padding: EdgeInsets.all(8))

// Правило: використовуйте const скрізь, де можливо
class MyWidget extends StatelessWidget {
  const MyWidget({super.key}); // const конструктор

  @override
  Widget build(BuildContext context) {
    return const Column(
      children: [
        Text('Static text'),
        SizedBox(height: 8),
        Icon(Icons.star),
      ],
    );
  }
}
```

---

## Швидкі відповіді

| Питання | Відповідь |
|---------|-----------|
| Що таке pubspec.yaml? | Файл конфігурації проєкту (залежності, assets, версія) |
| Різниця між hot reload і hot restart? | Hot reload зберігає стан, hot restart скидає |
| Що таке MaterialApp? | Кореневий віджет для Material Design застосунків |
| Що таке Scaffold? | Базова структура екрану (AppBar, Body, FAB, Drawer) |
| Як додати зображення? | `Image.asset()` або `Image.network()` |
| Як показати діалог? | `showDialog(context, builder: ...)` |
| Як показати SnackBar? | `ScaffoldMessenger.of(context).showSnackBar(...)` |
