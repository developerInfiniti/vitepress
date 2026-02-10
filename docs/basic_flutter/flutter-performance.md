# Продуктивність у Flutter

Оптимізація продуктивності є критично важливою для створення плавних та чуйних застосунків. Flutter надає інструменти та практики для досягнення 60 FPS (або 120 FPS на сучасних пристроях).

## Розуміння рендерингу

### Дерево віджетів

```dart
// Flutter має три дерева:
// 1. Widget Tree - описує UI (незмінні)
// 2. Element Tree - керує життєвим циклом
// 3. RenderObject Tree - відповідає за малювання

// Оптимізація: мінімізуйте глибину дерева віджетів
// Погано
Container(
  child: Padding(
    padding: EdgeInsets.all(16),
    child: Center(
      child: Text('Hello'),
    ),
  ),
)

// Краще
Padding(
  padding: EdgeInsets.all(16),
  child: Center(
    child: Text('Hello'),
  ),
)
```

### const конструктори

```dart
// Використовуйте const для незмінних віджетів
class MyWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Буде перебудовуватися кожного разу
        Text('Hello'),

        // Не буде перебудовуватися
        const Text('Hello'),

        // Власний const віджет
        const MyConstWidget(),
      ],
    );
  }
}

class MyConstWidget extends StatelessWidget {
  const MyConstWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return const Padding(
      padding: EdgeInsets.all(16),
      child: Text('Const widget'),
    );
  }
}
```

## Оптимізація setState

### Локалізація setState

```dart
// Погано - перебудовує весь екран
class BadExample extends StatefulWidget {
  @override
  _BadExampleState createState() => _BadExampleState();
}

class _BadExampleState extends State<BadExample> {
  int _counter = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          const ExpensiveWidget(), // Перебудовується без потреби
          Text('Counter: $_counter'),
          const AnotherExpensiveWidget(), // Перебудовується без потреби
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => setState(() => _counter++),
        child: Icon(Icons.add),
      ),
    );
  }
}

// Добре - тільки лічильник перебудовується
class GoodExample extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          const ExpensiveWidget(),
          CounterWidget(), // Окремий stateful віджет
          const AnotherExpensiveWidget(),
        ],
      ),
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
        Text('Counter: $_counter'),
        ElevatedButton(
          onPressed: () => setState(() => _counter++),
          child: Text('Increment'),
        ),
      ],
    );
  }
}
```

### ValueNotifier та ValueListenableBuilder

```dart
class EfficientCounter extends StatefulWidget {
  @override
  _EfficientCounterState createState() => _EfficientCounterState();
}

class _EfficientCounterState extends State<EfficientCounter> {
  final ValueNotifier<int> _counter = ValueNotifier(0);

  @override
  void dispose() {
    _counter.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const ExpensiveWidget(), // Не перебудовується

        ValueListenableBuilder<int>(
          valueListenable: _counter,
          builder: (context, value, child) {
            return Text('Counter: $value');
          },
        ),

        ElevatedButton(
          onPressed: () => _counter.value++,
          child: const Text('Increment'),
        ),
      ],
    );
  }
}
```

## Оптимізація списків

### ListView.builder

```dart
// Погано - створює всі елементи одразу
ListView(
  children: items.map((item) => ItemWidget(item: item)).toList(),
)

// Добре - створює тільки видимі елементи
ListView.builder(
  itemCount: items.length,
  itemBuilder: (context, index) {
    return ItemWidget(item: items[index]);
  },
)

// Ще краще - з кешуванням
ListView.builder(
  itemCount: items.length,
  cacheExtent: 500, // Кешувати 500 пікселів поза екраном
  itemBuilder: (context, index) {
    return ItemWidget(item: items[index]);
  },
)
```

### itemExtent для списків фіксованої висоти

```dart
// Оптимізація для елементів однакової висоти
ListView.builder(
  itemCount: 1000,
  itemExtent: 80, // Фіксована висота елемента
  itemBuilder: (context, index) {
    return ListTile(title: Text('Item $index'));
  },
)

// Або використовуйте SliverFixedExtentList
CustomScrollView(
  slivers: [
    SliverFixedExtentList(
      itemExtent: 80,
      delegate: SliverChildBuilderDelegate(
        (context, index) => ListTile(title: Text('Item $index')),
        childCount: 1000,
      ),
    ),
  ],
)
```

### RepaintBoundary

```dart
// Ізолює перемальовування елемента
ListView.builder(
  itemCount: items.length,
  itemBuilder: (context, index) {
    return RepaintBoundary(
      child: ComplexItemWidget(item: items[index]),
    );
  },
)
```

## Оптимізація зображень

### Кешування зображень

```dart
// Використовуйте cached_network_image
CachedNetworkImage(
  imageUrl: imageUrl,
  placeholder: (context, url) => CircularProgressIndicator(),
  errorWidget: (context, url, error) => Icon(Icons.error),
  memCacheWidth: 200, // Обмеження розміру в пам'яті
)

// Попереднє завантаження
precacheImage(NetworkImage(imageUrl), context);

// Очищення кешу зображень
PaintingBinding.instance.imageCache.clear();
PaintingBinding.instance.imageCache.clearLiveImages();
```

### Правильний розмір зображень

```dart
// Вказуйте розміри для оптимізації пам'яті
Image.network(
  imageUrl,
  width: 200,
  height: 200,
  fit: BoxFit.cover,
  cacheWidth: 400, // Декодувати в менший розмір
  cacheHeight: 400,
)
```

## Оптимізація анімацій

### AnimatedBuilder замість setState

```dart
// Погано
class _BadAnimationState extends State<BadAnimation>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: Duration(seconds: 1),
      vsync: this,
    )..addListener(() {
      setState(() {}); // Перебудовує весь віджет
    });
    _animation = Tween(begin: 0.0, end: 1.0).animate(_controller);
  }

  @override
  Widget build(BuildContext context) {
    return Opacity(
      opacity: _animation.value,
      child: ExpensiveWidget(), // Перебудовується кожен кадр
    );
  }
}

// Добре
class _GoodAnimationState extends State<GoodAnimation>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: Duration(seconds: 1),
      vsync: this,
    );
  }

  @override
  Widget build(BuildContext context) {
    return FadeTransition(
      opacity: _controller,
      child: const ExpensiveWidget(), // Не перебудовується
    );
  }
}
```

### Transform замість Container

```dart
// Погано - викликає relayout
AnimatedBuilder(
  animation: _animation,
  builder: (context, child) {
    return Container(
      margin: EdgeInsets.only(left: _animation.value * 100),
      child: child,
    );
  },
  child: MyWidget(),
)

// Добре - використовує compositing
AnimatedBuilder(
  animation: _animation,
  builder: (context, child) {
    return Transform.translate(
      offset: Offset(_animation.value * 100, 0),
      child: child,
    );
  },
  child: MyWidget(),
)
```

## Lazy loading

### Відкладене завантаження віджетів

```dart
class LazyWidget extends StatefulWidget {
  @override
  _LazyWidgetState createState() => _LazyWidgetState();
}

class _LazyWidgetState extends State<LazyWidget> {
  bool _isLoaded = false;

  @override
  void initState() {
    super.initState();
    // Завантажити після побудови кадру
    WidgetsBinding.instance.addPostFrameCallback((_) {
      setState(() => _isLoaded = true);
    });
  }

  @override
  Widget build(BuildContext context) {
    if (!_isLoaded) {
      return const SizedBox.shrink();
    }
    return ExpensiveWidget();
  }
}
```

### Visibility для невидимих віджетів

```dart
// Повністю видаляє віджет з дерева
Visibility(
  visible: _isVisible,
  maintainState: false,
  maintainAnimation: false,
  maintainSize: false,
  child: ExpensiveWidget(),
)

// Зберігає стан, але не рендерить
Offstage(
  offstage: !_isVisible,
  child: ExpensiveWidget(),
)
```

## Важкі обчислення

### compute для CPU-інтенсивних задач

```dart
import 'dart:isolate';
import 'package:flutter/foundation.dart';

// Функція для виконання в окремому isolate
List<int> heavyComputation(int count) {
  final result = <int>[];
  for (var i = 0; i < count; i++) {
    // Важкі обчислення
    result.add(i * i);
  }
  return result;
}

// Використання
class ComputeExample extends StatefulWidget {
  @override
  _ComputeExampleState createState() => _ComputeExampleState();
}

class _ComputeExampleState extends State<ComputeExample> {
  List<int>? _result;
  bool _isLoading = false;

  Future<void> _runComputation() async {
    setState(() => _isLoading = true);

    // Виконується в окремому isolate
    final result = await compute(heavyComputation, 1000000);

    setState(() {
      _result = result;
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        if (_isLoading)
          CircularProgressIndicator()
        else
          ElevatedButton(
            onPressed: _runComputation,
            child: Text('Обчислити'),
          ),
        if (_result != null)
          Text('Результат: ${_result!.length} елементів'),
      ],
    );
  }
}
```

## Інструменти профілювання

### Flutter DevTools

```dart
// Запуск з профілюванням
// flutter run --profile

// Відкриття DevTools
// flutter pub global activate devtools
// flutter pub global run devtools

// Використання Timeline
import 'dart:developer' as developer;

void expensiveOperation() {
  developer.Timeline.startSync('expensiveOperation');
  // Код операції
  developer.Timeline.finishSync();
}
```

### Performance Overlay

```dart
MaterialApp(
  showPerformanceOverlay: true, // Показати оверлей продуктивності
  checkerboardRasterCacheImages: true, // Перевірка кешування
  checkerboardOffscreenLayers: true, // Перевірка офскрін шарів
  home: MyHomePage(),
)
```

### Логування перебудов

```dart
// У debug режимі
import 'package:flutter/rendering.dart';

void main() {
  debugPrintRebuildDirtyWidgets = true; // Логувати перебудови
  debugPrintLayouts = true; // Логувати layout
  debugPrintPaintingMessages = true; // Логувати малювання

  runApp(MyApp());
}
```

## Оптимізація пам'яті

### Звільнення ресурсів

```dart
class ResourceWidget extends StatefulWidget {
  @override
  _ResourceWidgetState createState() => _ResourceWidgetState();
}

class _ResourceWidgetState extends State<ResourceWidget> {
  late AnimationController _controller;
  late ScrollController _scrollController;
  late TextEditingController _textController;
  StreamSubscription? _subscription;

  @override
  void initState() {
    super.initState();
    _scrollController = ScrollController();
    _textController = TextEditingController();
    _subscription = someStream.listen((_) {});
  }

  @override
  void dispose() {
    // Завжди звільняйте ресурси!
    _controller.dispose();
    _scrollController.dispose();
    _textController.dispose();
    _subscription?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container();
  }
}
```

### AutomaticKeepAliveClientMixin

```dart
// Зберігає стан при прокрутці в TabBarView
class KeepAliveWidget extends StatefulWidget {
  @override
  _KeepAliveWidgetState createState() => _KeepAliveWidgetState();
}

class _KeepAliveWidgetState extends State<KeepAliveWidget>
    with AutomaticKeepAliveClientMixin {
  @override
  bool get wantKeepAlive => true;

  @override
  Widget build(BuildContext context) {
    super.build(context); // Обов'язково викликати
    return ExpensiveWidget();
  }
}
```

## Чек-лист оптимізації

```dart
/*
1. Віджети:
   ✓ Використовуйте const конструктори
   ✓ Розбивайте великі віджети на менші
   ✓ Локалізуйте setState
   ✓ Використовуйте keys правильно

2. Списки:
   ✓ Використовуйте ListView.builder
   ✓ Вказуйте itemExtent для однакових елементів
   ✓ Використовуйте RepaintBoundary

3. Зображення:
   ✓ Кешуйте мережеві зображення
   ✓ Вказуйте cacheWidth/cacheHeight
   ✓ Використовуйте правильний формат

4. Анімації:
   ✓ Використовуйте AnimatedBuilder
   ✓ Перевагу Transform над Container
   ✓ Уникайте setState в animation listeners

5. Обчислення:
   ✓ Використовуйте compute для важких задач
   ✓ Уникайте блокування UI thread

6. Пам'ять:
   ✓ Звільняйте контролери в dispose
   ✓ Скасовуйте підписки
   ✓ Очищайте кеш при потребі
*/
```

## Висновок

Оптимізація продуктивності у Flutter вимагає розуміння того, як Flutter рендерить UI та керує станом. Використовуйте інструменти профілювання для виявлення проблем та застосовуйте найкращі практики для створення швидких та ефективних застосунків.
