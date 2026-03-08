---
description: "Вопросы по производительности Flutter: оптимизация, профилирование, рендеринг — подготовка к интервью"
---

# Співбесіда Flutter: Продуктивність

Питання про оптимізацію та продуктивність Flutter застосунків.

## Рендеринг

### Як Flutter рендерить UI?

**Відповідь:** Flutter рендерить UI через 3 фази:

```
1. Build Phase
   Widget Tree → Element Tree → RenderObject Tree

2. Layout Phase
   Обчислення розмірів та позицій

3. Paint Phase
   Малювання на Canvas → Skia → GPU
```

```dart
// Flutter рендерить при 60/120 FPS
// 16.67ms (60 FPS) або 8.33ms (120 FPS) на кадр

// Важливі метрики:
// - Build time: час побудови віджетів
// - Layout time: час обчислення розмірів
// - Paint time: час малювання
// - Raster time: час растеризації на GPU
```

---

### Що таке jank і як його уникнути?

**Відповідь:** Jank — це пропущені кадри, що призводять до "смиканого" UI.

**Причини:**
1. Важкі обчислення в UI thread
2. Занадто багато перебудов
3. Великі зображення
4. Складні анімації

```dart
// Погано - блокує UI
void _processData() {
  final result = heavyComputation(); // Блокує UI thread
  setState(() => _data = result);
}

// Добре - окремий isolate
Future<void> _processData() async {
  final result = await compute(heavyComputation, input);
  setState(() => _data = result);
}
```

---

### Як оптимізувати build()?

**Відповідь:**

```dart
// 1. Використовуйте const
// Погано
Container(
  padding: EdgeInsets.all(8), // Новий об'єкт кожен раз
  child: Text('Hello'),
)

// Добре
const Padding(
  padding: EdgeInsets.all(8), // Той самий об'єкт
  child: Text('Hello'),
)

// 2. Розбивайте великі віджети
// Погано - все перебудовується
class BigWidget extends StatefulWidget {
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        ExpensiveWidgetA(),
        Text('$_counter'), // Тільки це змінюється
        ExpensiveWidgetB(),
      ],
    );
  }
}

// Добре - окремий віджет для стану
class SmallCounterWidget extends StatefulWidget {
  @override
  Widget build(BuildContext context) {
    return Text('$_counter');
  }
}

// 3. Не створюйте функції в build()
// Погано
Widget build(BuildContext context) {
  Widget buildItem(String text) => Text(text); // Кожен build
  return buildItem('Hello');
}

// Добре
Widget _buildItem(String text) => Text(text); // Один раз

Widget build(BuildContext context) {
  return _buildItem('Hello');
}

// 4. Уникайте операцій в build()
// Погано
Widget build(BuildContext context) {
  final sorted = items.sort(); // Сортування кожен build
  return ListView(children: sorted.map(...));
}

// Добре
List<Item>? _sortedItems;

void _sortItems() {
  _sortedItems = items.sort();
}
```

---

## Списки

### Як оптимізувати ListView?

**Відповідь:**

```dart
// 1. Використовуйте builder замість children
// Погано - всі елементи створюються одразу
ListView(
  children: items.map((item) => ItemWidget(item)).toList(),
)

// Добре - lazy creation
ListView.builder(
  itemCount: items.length,
  itemBuilder: (context, index) => ItemWidget(items[index]),
)

// 2. Вкажіть itemExtent для фіксованої висоти
ListView.builder(
  itemExtent: 80, // Фіксована висота
  itemCount: items.length,
  itemBuilder: (context, index) => ItemWidget(items[index]),
)

// 3. Використовуйте cacheExtent
ListView.builder(
  cacheExtent: 500, // Кешувати 500px за межами екрану
  itemCount: items.length,
  itemBuilder: (context, index) => ItemWidget(items[index]),
)

// 4. Додайте Key для стабільної ідентифікації
ListView.builder(
  itemCount: items.length,
  itemBuilder: (context, index) => ItemWidget(
    key: ValueKey(items[index].id),
    item: items[index],
  ),
)

// 5. RepaintBoundary для складних елементів
ListView.builder(
  itemCount: items.length,
  itemBuilder: (context, index) => RepaintBoundary(
    child: ComplexItemWidget(items[index]),
  ),
)
```

---

### Різниця між ListView, GridView та CustomScrollView?

**Відповідь:**

```dart
// ListView - вертикальний/горизонтальний список
ListView.builder(
  itemCount: 100,
  itemBuilder: (context, index) => ListTile(title: Text('Item $index')),
)

// GridView - сітка
GridView.builder(
  gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
    crossAxisCount: 2,
  ),
  itemCount: 100,
  itemBuilder: (context, index) => Card(child: Text('$index')),
)

// CustomScrollView - комбінація різних sliver
CustomScrollView(
  slivers: [
    SliverAppBar(title: Text('Title'), floating: true),
    SliverList(
      delegate: SliverChildBuilderDelegate(
        (context, index) => ListTile(title: Text('Item $index')),
        childCount: 50,
      ),
    ),
    SliverGrid(
      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
      ),
      delegate: SliverChildBuilderDelegate(
        (context, index) => Card(child: Text('Grid $index')),
        childCount: 20,
      ),
    ),
  ],
)
```

---

## Зображення

### Як оптимізувати роботу з зображеннями?

**Відповідь:**

```dart
// 1. Кешуйте мережеві зображення
CachedNetworkImage(
  imageUrl: url,
  placeholder: (context, url) => CircularProgressIndicator(),
  errorWidget: (context, url, error) => Icon(Icons.error),
)

// 2. Вказуйте розміри для декодування
Image.network(
  url,
  cacheWidth: 200, // Декодувати в меншому розмірі
  cacheHeight: 200,
)

// 3. Використовуйте правильний формат
// - WebP для мережі (менший розмір)
// - PNG для прозорості
// - JPEG для фото

// 4. Попереднє завантаження
@override
void didChangeDependencies() {
  super.didChangeDependencies();
  precacheImage(NetworkImage(url), context);
}

// 5. Очищення кешу при потребі
PaintingBinding.instance.imageCache.clear();
PaintingBinding.instance.imageCache.clearLiveImages();

// 6. FadeInImage для плавного завантаження
FadeInImage.memoryNetwork(
  placeholder: kTransparentImage,
  image: url,
  fit: BoxFit.cover,
)
```

---

## Анімації

### Як оптимізувати анімації?

**Відповідь:**

```dart
// 1. Використовуйте AnimatedBuilder замість setState
// Погано
class _MyState extends State<MyWidget> with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: Duration(seconds: 1))
      ..addListener(() => setState(() {})); // Перебудовує все
  }
}

// Добре
AnimatedBuilder(
  animation: _controller,
  builder: (context, child) {
    return Transform.rotate(
      angle: _controller.value * 2 * pi,
      child: child, // child не перебудовується
    );
  },
  child: const ExpensiveWidget(),
)

// 2. Transform замість зміни розмірів
// Погано - викликає relayout
AnimatedContainer(
  width: _expanded ? 200 : 100,
  height: _expanded ? 200 : 100,
)

// Добре - тільки transform
AnimatedBuilder(
  animation: _animation,
  builder: (context, child) {
    return Transform.scale(
      scale: _animation.value,
      child: child,
    );
  },
  child: Container(width: 100, height: 100),
)

// 3. Використовуйте Opacity обережно
// Opacity перемальовує весь піддерево
// Використовуйте FadeTransition або AnimatedOpacity

// 4. RepaintBoundary для ізоляції
RepaintBoundary(
  child: AnimatedWidget(),
)
```

---

## Пам'ять

### Як уникнути витоків пам'яті?

**Відповідь:**

```dart
class _MyWidgetState extends State<MyWidget> {
  late StreamSubscription _subscription;
  late AnimationController _controller;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _subscription = stream.listen((data) { });
    _controller = AnimationController(vsync: this);
    _timer = Timer.periodic(Duration(seconds: 1), (_) { });
  }

  @override
  void dispose() {
    // Завжди скасовуйте підписки!
    _subscription.cancel();
    _controller.dispose();
    _timer?.cancel();
    super.dispose();
  }
}

// Перевірка mounted перед setState
Future<void> _loadData() async {
  final data = await fetchData();
  if (mounted) { // Перевірка чи віджет ще існує
    setState(() => _data = data);
  }
}

// Слабкі посилання для callbacks
class MyService {
  WeakReference<MyWidget>? _widgetRef;

  void setWidget(MyWidget widget) {
    _widgetRef = WeakReference(widget);
  }

  void notifyWidget() {
    _widgetRef?.target?.update();
  }
}
```

---

## Isolates

### Коли і як використовувати Isolates?

**Відповідь:**

```dart
// compute() для простих обчислень
Future<List<int>> processData(List<int> data) async {
  // Виконується в окремому isolate
  return await compute(_heavyProcessing, data);
}

List<int> _heavyProcessing(List<int> data) {
  // Важке обчислення
  return data.map((e) => e * e).toList();
}

// Isolate для тривалих операцій
class BackgroundService {
  Isolate? _isolate;
  ReceivePort? _receivePort;

  Future<void> start() async {
    _receivePort = ReceivePort();
    _isolate = await Isolate.spawn(
      _backgroundTask,
      _receivePort!.sendPort,
    );

    _receivePort!.listen((message) {
      print('Received: $message');
    });
  }

  static void _backgroundTask(SendPort sendPort) {
    // Тривала фонова робота
    Timer.periodic(Duration(seconds: 1), (timer) {
      sendPort.send('Tick ${timer.tick}');
    });
  }

  void stop() {
    _isolate?.kill();
    _receivePort?.close();
  }
}
```

**Коли використовувати:**
- Парсинг великих JSON (>1MB)
- Обробка зображень
- Криптографічні операції
- Складні обчислення

---

## DevTools

### Як профілювати застосунок?

**Відповідь:**

```dart
// 1. Запуск в profile режимі
// flutter run --profile

// 2. Performance overlay
MaterialApp(
  showPerformanceOverlay: true,
)

// 3. Логування перебудов
import 'package:flutter/rendering.dart';
debugPrintRebuildDirtyWidgets = true;

// 4. Timeline для власного коду
import 'dart:developer';

Timeline.startSync('MyOperation');
// Код операції
Timeline.finishSync();

// 5. Перевірка пам'яті
debugDumpApp(); // Дерево віджетів
debugDumpRenderTree(); // Дерево рендерингу
debugDumpLayerTree(); // Дерево шарів
```

**Ключові метрики в DevTools:**
- UI thread: має бути <16ms
- Raster thread: має бути <16ms
- Memory: слідкувати за ростом
- CPU: виявлення важких операцій

---

## Практичні питання

### Як оптимізувати час запуску?

**Відповідь:**

```dart
// 1. Відкладене завантаження
void main() async {
  runApp(SplashScreen()); // Легкий splash

  // Ініціалізація у фоні
  await Future.wait([
    Firebase.initializeApp(),
    setupDI(),
    preloadImages(),
  ]);

  runApp(MyApp());
}

// 2. Lazy initialization
class Services {
  static Database? _database;

  static Future<Database> get database async {
    _database ??= await Database.open();
    return _database!;
  }
}

// 3. Зменшення розміру APK/IPA
// flutter build apk --split-per-abi
// Використовуйте App Bundle для Play Store

// 4. Tree shaking для іконок
// pubspec.yaml
flutter:
  fonts:
    - family: MaterialIcons
      fonts:
        - asset: fonts/MaterialIcons.ttf
```

---

### Що таке Repaint Boundary?

**Відповідь:**

```dart
// RepaintBoundary ізолює частину дерева від перемальовування
// Все всередині RepaintBoundary кешується як окремий шар

// Без RepaintBoundary - все перемальовується
Column(
  children: [
    AnimatedWidget(), // Анімація
    StaticWidget(), // Також перемальовується!
  ],
)

// З RepaintBoundary - тільки анімований віджет
Column(
  children: [
    RepaintBoundary(
      child: AnimatedWidget(), // Окремий шар
    ),
    StaticWidget(), // Не перемальовується
  ],
)

// Автоматичний RepaintBoundary
// Flutter додає його для:
// - ListView елементів
// - Navigator сторінок
// - AnimatedBuilder

// Перевірка в DevTools: checkerboardRasterCacheImages
MaterialApp(
  checkerboardRasterCacheImages: true,
)
```

---

## Швидкі відповіді

| Питання | Відповідь |
|---------|-----------|
| Скільки FPS у Flutter? | 60 або 120 залежно від пристрою |
| Що таке Skia? | Графічний рушій Flutter |
| Коли використовувати compute()? | Для важких обчислень (>1ms) |
| Що таке shader compilation jank? | Затримка при першій компіляції шейдерів |
| Як вимірювати продуктивність? | DevTools, performance overlay |
| Що таке deferred loading? | Завантаження коду на вимогу (для web) |
| Debug vs Profile vs Release? | Debug для розробки, Profile для профілювання, Release для публікації |
