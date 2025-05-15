# Керування станом у Flutter: Огляд основних підходів

Керування станом (State Management) є однією з найважливіших тем у розробці Flutter-застосунків. Стан — це будь-які дані, які можуть змінюватися з часом і впливати на UI. Ефективне керування станом допомагає будувати складні, інтерактивні та підтримувані застосунки.

Flutter пропонує кілька вбудованих способів керування станом, а також велику кількість сторонніх бібліотек для більш складних сценаріїв.

## Основні концепції

* **Стан віджета (Widget State):** Дані, пов'язані з конкретним віджетом.
* **Локальний стан (Local State):** Стан, який керується безпосередньо віджетом (`StatefulWidget`) і доступний лише йому та його дочірнім віджетам.
* **Глобальний стан (Global/App-level State):** Стан, який доступний для багатьох віджетів у дереві застосунку.
* **Реактивний програмування (Reactive Programming):** Парадигма програмування, орієнтована на потоки даних та поширення змін. Багато рішень для керування станом у Flutter використовують реактивні принципи.
* **Однонаправлений потік даних (Unidirectional Data Flow):** Патерн, де стан змінюється лише в одному напрямку, що полегшує відстеження змін та налагодження.

## Вбудовані підходи до керування станом

### 1. `setState()` (Для локального стану)

Найпростіший спосіб керування станом у Flutter — використовувати `StatefulWidget` та його метод `setState()`. `setState()` повідомляє Flutter про те, що внутрішній стан віджета змінився, і UI потрібно перемалювати.

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

**Переваги:**

* Простота для невеликих, локальних змін стану.
* Вбудовано у Flutter.

**Недоліки:**

* Стає складним для керування великою кількістю стану або стану, який потрібно передавати між віддаленими віджетами в дереві.
* Може призводити до надмірного перемалювання UI, якщо великі віджети залежать від часто змінюваного локального стану.

### 2. `InheritedWidget` та `Provider` (Для поширення стану вниз по дереву)

`InheritedWidget` — це базовий клас, який дозволяє ефективно поширювати дані вниз по дереву віджетів. Віджети-нащадки можуть отримати доступ до даних, наданих `InheritedWidget`, знайшовши його вгору по дереву.

Пакет **`provider`** ([https://pub.dev/packages/provider](https://pub.dev/packages/provider)) значно спрощує використання `InheritedWidget` та надає зручний API для керування та доступу до стану. Він є одним з найпопулярніших рішень для керування станом у Flutter.

```dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class CounterModel extends ChangeNotifier {
  int _count = 0;
  int get count => _count;

  void increment() {
    _count++;
    notifyListeners(); // Повідомляє слухачів про зміни
  }
}

class MyCounterApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (context) => CounterModel(),
      child: MaterialApp(
        home: CounterScreen(),
      ),
    );
  }
}

class CounterScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final counter = Provider.of<CounterModel>(context); // Отримує екземпляр CounterModel
    return Scaffold(
      appBar: AppBar(title: Text('Лічильник')),
      body: Center(
        child: Text('Значення: ${counter.count}', style: TextStyle(fontSize: 24)),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => counter.increment(),
        child: Icon(Icons.add),
      ),
    );
  }
}
```

**Основні провайдери з пакету `provider`:**

* `Provider`: Найпростіший провайдер для надання значення.
* `ChangeNotifierProvider`: Для надання об'єкта, який використовує `ChangeNotifier` для сповіщення слухачів про зміни.
* `StreamProvider`: Для надання даних зі `Stream`.
* `FutureProvider`: Для надання даних з `Future`.
* `MultiProvider`: Для об'єднання кількох провайдерів.

**Переваги:**

* Простота використання та розуміння (особливо з `provider`).
* Ефективне оновлення лише залежних віджетів.
* Добре підходить для поширення стану вниз по дереву.
* Популярна та добре підтримувана бібліотека.

**Недоліки:**

* Для дуже складних сценаріїв може знадобитися більше структури.
* Може бути менш явним потік даних порівняно з архітектурними патернами.

## Архітектурні патерни для керування станом

Для великих та складних застосунків часто використовуються архітектурні патерни, які забезпечують кращу організацію коду, розділення відповідальності та передбачуваний потік даних.

### 1. BLoC/Cubit (Business Logic Component / Cubit)

**BLoC (Business Logic Component)** та його спрощена версія **Cubit** (з пакету `flutter_bloc` - [https://pub.dev/packages/flutter_bloc](https://pub.dev/packages/flutter_bloc)) — це потужний архітектурний патерн, заснований на реактивному програмуванні та подіях.

* **Події (Events):** Представляють дії, які можуть відбуватися в UI або в інших частинах застосунку.
* **BLoC/Cubit:** Містить бізнес-логіку та обробляє події, змінюючи стан.
* **Стан (State):** Представляє поточний стан UI.
* **Слухачі (Listeners/Builders):** Віджети, які реагують на зміни стану, що випускаються BLoC/Cubit.

```dart
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

// Події
abstract class CounterEvent {}
class IncrementEvent extends CounterEvent {}

// Стан
class CounterState {
  final int count;
  CounterState({required this.count});
}

// Cubit
class CounterCubit extends Cubit<CounterState> {
  CounterCubit() : super(CounterState(count: 0));

  void increment() => emit(CounterState(count: state.count + 1));
}

class MyCounterApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => CounterCubit(),
      child: MaterialApp(
        home: CounterScreen(),
      ),
    );
  }
}

class CounterScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Лічильник (Bloc/Cubit)')),
      body: Center(
        child: BlocBuilder<CounterCubit, CounterState>(
          builder: (context, state) {
            return Text('Значення: ${state.count}', style: TextStyle(fontSize: 24));
          },
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => BlocProvider.of<CounterCubit>(context).increment(),
````

**Переваги:**

* Чітке розділення бізнес-логіки від UI.
* Передбачуваний однонаправлений потік даних.
* Добре підходить для керування складним станом та асинхронними операціями.
* Сприяє тестуванню.

**Недоліки:**

* Може призвести до більшої кількості шаблонного коду (особливо BLoC).
* Крива навчання може бути крутішою для початківців.

### 2\. Riverpod

**Riverpod** ([https://pub.dev/packages/riverpod](https://pub.dev/packages/riverpod)) — це реактивний фреймворк для керування станом, розроблений автором `provider`, але з акцентом на безпеку типів, тестуваність та уникнення залежності від `BuildContext` для доступу до стану.

Riverpod використовує концепцію **провайдерів (Providers)**, які є декларативними способами опису стану, доступного для віджетів.

```dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

// Створюємо провайдер стану
final counterProvider = StateProvider((ref) => 0);

class MyCounterApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return ProviderScope( // Обов'язковий обгортаючий віджет
      child: MaterialApp(
        home: CounterScreen(),
      ),
    );
  }
}

class CounterScreen extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final counter = ref.watch(counterProvider); // Отримуємо поточне значення стану
    final counterNotifier = ref.read(counterProvider.notifier); // Отримуємо доступ до нотіфаєра для зміни стану

    return Scaffold(
      appBar: AppBar(title: Text('Лічильник (Riverpod)')),
      body: Center(
        child: Text('Значення: $counter', style: TextStyle(fontSize: 24)),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => counterNotifier.state++,
        child: Icon(Icons.add),
      ),
    );
  }
}
```

**Переваги:**

* Безпека типів.
* Проста тестуваність.
* Доступ до стану без `BuildContext`.
* Гнучкість та розширюваність.
* Вирішує деякі обмеження `provider`.

**Недоліки:**

* Може знадобитися деякий час для освоєння концепцій.
* Більше нових концепцій порівняно з `provider`.

### 3\. GetX

**GetX** ([https://pub.dev/packages/get](https://pub.dev/packages/get)) — це потужний та opinionated мікрофреймворк для Flutter, який надає рішення не лише для керування станом, але й для маршрутизації, керування залежностями, локалізації та багато іншого.

Для керування станом GetX пропонує два основних підходи:

* **Прості змінні (`obs`) та контролери (`GetxController`):** Реактивне керування станом, де зміни змінних автоматично оновлюють UI.

<!-- end list -->

```dart
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class CounterController extends GetxController {
  var count = 0.obs;
  void increment() => count++;
}

class MyCounterApp extends StatelessWidget {
  final CounterController controller = Get.put(CounterController());

  @override
  Widget build(BuildContext context) {
    return GetMaterialApp( // Замість MaterialApp
      home: Scaffold(
        appBar: AppBar(title: Text('Лічильник (GetX)')),
        body: Center(
          child: Obx(() => Text('Значення: ${controller.count}', style: TextStyle(fontSize: 24))),
        ),
        floatingActionButton: FloatingActionButton(
          onPressed: controller.increment,
          child: Icon(Icons.add),
        ),
      ),
    );
  }
}
```

* **Прості stateful віджети (`GetBuilder` та `UpdateQueuedBuilder`):** Імперативне керування станом, схоже на `setState()`, але з більшим контролем над оновленнями.

**Переваги:**

* Простота та швидкість розробки.
* Багатофункціональність (керування станом, маршрутизація, залежності тощо).
* Активна спільнота.

**Недоліки:**

* Opinionated фреймворк, що може не підійти для всіх проєктів.
* Може призвести до більшої залежності від фреймворку.

### 4\. Redux/Flux

**Redux** ([https://pub.dev/packages/redux](https://www.google.com/search?q=https://pub.dev/packages/redux)) та **Flux** — це архітектурні патерни для керування станом, засновані на однонаправленому потоці даних. Вони передбачають такі концепції:

* **Store:** Єдине джерело правди для всього стану застосунку.
* **Actions:** Події, які описують намір змінити стан.
* **Reducers:** Чисті функції, які визначають, як стан змінюється у відповідь на дії.
* **Middlewares:** Дозволяють перехоплювати та обробляти дії перед тим, як вони досягнуть редукторів (часто використовуються для асинхронних операцій).

**Переваги:**

* Чіткий та передбачуваний потік даних.
* Легке відстеження змін стану.
* Сприяє тестуванню та налагодженню.
* Добре підходить для дуже складних застосунків з великою кількістю стану.

**Недоліки:**

* Велика кількість шаблонного коду.
* Крута крива навчання.
* Може бути надмірним для простих застосунків.

### 5\. MobX

**MobX** ([https://pub.dev/packages/flutter\_mobx](https://pub.dev/packages/flutter_mobx)) — це бібліотека для реактивного керування станом, яка використовує концепції спостережуваних (observables), дій (actions) та реакцій (reactions).

* **Observables:** Змінні стану, за змінами яких можна спостерігати.
* **Actions:** Функції, які змінюють спостережувані значення.
* **Reactions:** Функції, які автоматично виконуються при зміні спостережуваних значень (наприклад, для оновлення UI).

<!-- end list -->

```dart
import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';
import 'package:mobx/mobx.dart';

part 'counter_store.g.dart';

class CounterStore = _CounterStore with _$CounterStore;

abstract class _CounterStore with Store {
  @observable
  int count = 0;

  @action
  void increment() {
    count++;
  }
}

class MyCounterApp extends StatelessWidget {
  final _counterStore = CounterStore();

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: Text('Лічильник (MobX)')),
        body: Center(
          child: Observer(builder: (_) => Text('Значення: ${_counterStore.count}', style: TextStyle(fontSize: 24))),
        ),
        floatingActionButton: FloatingActionButton(
          onPressed: _counterStore.increment,
          child: Icon(Icons.add),
        ),
      ),
    );
  }
}
```

**Переваги:**

* Проста та інтуїтивно зрозуміла реактивна модель.
* Менше шаблонного коду порівняно з Redux/Flux.
* Ефективне оновлення UI.

**Недоліки:**

* Потрібно використовувати кодогенерацію.

## Вибір підходу

Вибір підходу до керування станом залежить від складності вашого застосунку, розміру команди та ваших особистих уподобань.

* **Для невеликих застосунків або локального стану:** `setState()` може бути достатньо.
* **Для середніх застосунків з потребою поширювати стан:** `provider` є хорошим варіантом завдяки своїй простоті та ефективності.
* **Для великих та складних застосунків:**
    * **BLoC/Cubit:** Забезпечує чітке розділення логіки та передбачуваний потік даних.
    * **Riverpod:** Пропонує безпеку типів та гнучкість з меншою залежністю від `BuildContext`.
    * **GetX:** Простий у використанні фреймворк з багатьма вбудованими можливостями.
    * **Redux/Flux:** Підходить для дуже складного стану, де важлива строга передбачуваність.
    * **MobX:** Пропонує реактивний підхід з меншою кількістю шаблонного коду.

Рекомендується ознайомитися з різними підходами та спробувати їх на практиці, щоб зрозуміти, який з них найкраще підходить для ваших потреб.