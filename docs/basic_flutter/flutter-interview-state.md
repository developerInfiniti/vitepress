# Співбесіда Flutter: Управління станом

Питання про state management — одні з найважливіших на співбесідах.

## Загальні питання

### Що таке стан (State) у Flutter?

**Відповідь:** Стан — це дані, які можуть змінюватися протягом життя застосунку та впливають на UI.

**Типи стану:**
1. **Ephemeral (локальний)** — стан одного віджета (позиція скролу, вибраний таб)
2. **App state (глобальний)** — стан, який потрібен у багатьох місцях (користувач, налаштування)

```dart
// Ephemeral state - достатньо setState
class Counter extends StatefulWidget {
  @override
  _CounterState createState() => _CounterState();
}

class _CounterState extends State<Counter> {
  int _count = 0; // Локальний стан

  @override
  Widget build(BuildContext context) {
    return Text('$_count');
  }
}

// App state - потрібен state management
class UserProvider extends ChangeNotifier {
  User? _user; // Глобальний стан

  User? get user => _user;

  void setUser(User user) {
    _user = user;
    notifyListeners();
  }
}
```

---

### Які підходи до state management ви знаєте?

**Відповідь:**

| Підхід | Складність | Коли використовувати |
|--------|------------|---------------------|
| setState | Низька | Локальний стан |
| InheritedWidget | Середня | Передача даних вниз |
| Provider | Низька | Малі/середні проєкти |
| Riverpod | Середня | Середні/великі проєкти |
| BLoC | Висока | Великі проєкти, команди |
| GetX | Низька | Швидка розробка |
| Redux | Висока | Дуже великі проєкти |
| MobX | Середня | Реактивне програмування |

---

## Provider

### Поясніть, як працює Provider

**Відповідь:** Provider — це обгортка над InheritedWidget, що спрощує передачу та оновлення стану.

```dart
// 1. Створення моделі
class CartModel extends ChangeNotifier {
  final List<Item> _items = [];

  List<Item> get items => List.unmodifiable(_items);
  int get totalPrice => _items.fold(0, (sum, item) => sum + item.price);

  void add(Item item) {
    _items.add(item);
    notifyListeners(); // Сповіщає слухачів
  }

  void remove(Item item) {
    _items.remove(item);
    notifyListeners();
  }
}

// 2. Надання провайдера
void main() {
  runApp(
    ChangeNotifierProvider(
      create: (context) => CartModel(),
      child: MyApp(),
    ),
  );
}

// 3. Читання даних
class CartScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // watch - перебудовує при зміні
    final cart = context.watch<CartModel>();

    // read - не перебудовує (для методів)
    // final cart = context.read<CartModel>();

    return Column(
      children: [
        Text('Всього: ${cart.totalPrice}'),
        ElevatedButton(
          onPressed: () => context.read<CartModel>().add(newItem),
          child: Text('Додати'),
        ),
      ],
    );
  }
}
```

---

### Різниця між watch, read та select?

**Відповідь:**

```dart
// watch - підписується на ВСІ зміни, перебудовує віджет
final cart = context.watch<CartModel>();
// Використовувати: в build() для відображення даних

// read - отримує значення БЕЗ підписки
final cart = context.read<CartModel>();
// Використовувати: в обробниках подій (onPressed)

// select - підписується на КОНКРЕТНЕ значення
final totalPrice = context.select<CartModel, int>((cart) => cart.totalPrice);
// Використовувати: коли потрібна тільки частина даних

// Приклад оптимізації з select
class ItemCount extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // Перебудовується тільки коли змінюється кількість
    final count = context.select<CartModel, int>((cart) => cart.items.length);
    return Text('Товарів: $count');
  }
}
```

**Правило:** `watch` в `build()`, `read` в callbacks.

---

### Типи провайдерів

**Відповідь:**

```dart
// 1. Provider - для незмінних значень
Provider<ApiService>(
  create: (_) => ApiService(),
)

// 2. ChangeNotifierProvider - для ChangeNotifier
ChangeNotifierProvider<CartModel>(
  create: (_) => CartModel(),
)

// 3. FutureProvider - для Future
FutureProvider<User>(
  create: (_) => fetchUser(),
  initialData: null,
)

// 4. StreamProvider - для Stream
StreamProvider<List<Message>>(
  create: (_) => messagesStream(),
  initialData: [],
)

// 5. ProxyProvider - залежить від іншого провайдера
ProxyProvider<ApiService, UserRepository>(
  update: (_, api, __) => UserRepository(api),
)

// 6. MultiProvider - кілька провайдерів
MultiProvider(
  providers: [
    ChangeNotifierProvider(create: (_) => CartModel()),
    ChangeNotifierProvider(create: (_) => UserModel()),
    Provider(create: (_) => ApiService()),
  ],
  child: MyApp(),
)
```

---

## BLoC

### Що таке BLoC і як він працює?

**Відповідь:** BLoC (Business Logic Component) — патерн, що розділяє бізнес-логіку від UI за допомогою потоків (Streams).

```
UI → Events → BLoC → States → UI
```

```dart
// 1. Events (події)
abstract class CounterEvent {}

class IncrementEvent extends CounterEvent {}
class DecrementEvent extends CounterEvent {}

// 2. States (стани)
class CounterState {
  final int count;
  const CounterState(this.count);
}

// 3. BLoC
class CounterBloc extends Bloc<CounterEvent, CounterState> {
  CounterBloc() : super(CounterState(0)) {
    on<IncrementEvent>((event, emit) {
      emit(CounterState(state.count + 1));
    });

    on<DecrementEvent>((event, emit) {
      emit(CounterState(state.count - 1));
    });
  }
}

// 4. UI
class CounterPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => CounterBloc(),
      child: BlocBuilder<CounterBloc, CounterState>(
        builder: (context, state) {
          return Column(
            children: [
              Text('${state.count}'),
              ElevatedButton(
                onPressed: () => context.read<CounterBloc>().add(IncrementEvent()),
                child: Text('+'),
              ),
            ],
          );
        },
      ),
    );
  }
}
```

---

### Різниця між BLoC та Cubit?

**Відповідь:**

**Cubit** — спрощена версія BLoC без подій:

```dart
// Cubit - простіший
class CounterCubit extends Cubit<int> {
  CounterCubit() : super(0);

  void increment() => emit(state + 1);
  void decrement() => emit(state - 1);
}

// Використання
context.read<CounterCubit>().increment();
```

```dart
// BLoC - з подіями
class CounterBloc extends Bloc<CounterEvent, int> {
  CounterBloc() : super(0) {
    on<IncrementEvent>((event, emit) => emit(state + 1));
  }
}

// Використання
context.read<CounterBloc>().add(IncrementEvent());
```

| Cubit | BLoC |
|-------|------|
| Викликає методи | Додає події |
| Простіший | Складніший |
| Менше коду | Більше коду |
| Важче відстежити | Легко відстежити (events) |
| Для простих випадків | Для складної логіки |

---

### BlocBuilder vs BlocListener vs BlocConsumer?

**Відповідь:**

```dart
// BlocBuilder - перебудовує UI при зміні стану
BlocBuilder<CounterBloc, int>(
  buildWhen: (previous, current) => current != previous, // Опціонально
  builder: (context, count) {
    return Text('$count');
  },
)

// BlocListener - реагує на зміни БЕЗ перебудови
// Використовувати: навігація, показ діалогів, snackbar
BlocListener<AuthBloc, AuthState>(
  listenWhen: (previous, current) => current is AuthError,
  listener: (context, state) {
    if (state is AuthError) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(state.message)),
      );
    }
  },
  child: Container(),
)

// BlocConsumer - комбінація Builder + Listener
BlocConsumer<AuthBloc, AuthState>(
  listener: (context, state) {
    if (state is AuthSuccess) {
      Navigator.pushReplacementNamed(context, '/home');
    }
  },
  builder: (context, state) {
    if (state is AuthLoading) {
      return CircularProgressIndicator();
    }
    return LoginForm();
  },
)
```

---

## Riverpod

### Чим Riverpod кращий за Provider?

**Відповідь:**

```dart
// Provider - залежить від BuildContext
final cart = context.watch<CartModel>(); // Потрібен context

// Riverpod - не залежить від context
final cartProvider = StateNotifierProvider<CartNotifier, CartState>((ref) {
  return CartNotifier();
});

// Використання без context
class CartNotifier extends StateNotifier<CartState> {
  CartNotifier() : super(CartState.initial());

  void addItem(Item item) {
    state = state.copyWith(items: [...state.items, item]);
  }
}
```

**Переваги Riverpod:**

| Provider | Riverpod |
|----------|----------|
| Залежить від context | Не залежить від context |
| Runtime помилки | Compile-time помилки |
| Важко тестувати | Легко тестувати |
| Один провайдер на тип | Кілька провайдерів одного типу |

```dart
// Riverpod: типи провайдерів
final userProvider = Provider<User>((ref) => User());

final asyncUserProvider = FutureProvider<User>((ref) async {
  return await fetchUser();
});

final streamProvider = StreamProvider<List<Message>>((ref) {
  return messageStream();
});

final counterProvider = StateProvider<int>((ref) => 0);

final cartProvider = StateNotifierProvider<CartNotifier, List<Item>>((ref) {
  return CartNotifier();
});
```

---

## Практичні питання

### Як вибрати підхід до state management?

**Відповідь:**

```
Локальний стан одного віджета?
└── Так → setState

Стан потрібен кільком віджетам?
└── Малий проєкт → Provider
└── Середній проєкт → Riverpod або BLoC
└── Великий проєкт з командою → BLoC

Потрібна відстежуваність подій?
└── Так → BLoC
└── Ні → Cubit або Provider

Потрібен доступ без context?
└── Так → Riverpod або GetX
```

---

### Як уникнути зайвих перебудов з Provider?

**Відповідь:**

```dart
// 1. Використовуйте select замість watch
// Погано - перебудовується при будь-якій зміні
final cart = context.watch<CartModel>();
Text('${cart.items.length}');

// Добре - тільки при зміні length
final itemCount = context.select<CartModel, int>((c) => c.items.length);
Text('$itemCount');

// 2. Розбийте на дрібні провайдери
// Погано
class AppState extends ChangeNotifier {
  User? user;
  List<Item> cart;
  ThemeMode theme;
  // Все в одному - будь-яка зміна перебудовує все
}

// Добре
class UserNotifier extends ChangeNotifier { ... }
class CartNotifier extends ChangeNotifier { ... }
class ThemeNotifier extends ChangeNotifier { ... }

// 3. Використовуйте Consumer для локальної перебудови
Column(
  children: [
    ExpensiveWidget(), // Не перебудовується
    Consumer<CartModel>(
      builder: (context, cart, child) {
        return Text('${cart.totalPrice}'); // Тільки це перебудовується
      },
    ),
  ],
)
```

---

### Як тестувати код з BLoC?

**Відповідь:**

```dart
// bloc_test package
import 'package:bloc_test/bloc_test.dart';

void main() {
  group('CounterBloc', () {
    blocTest<CounterBloc, int>(
      'emits [1] when IncrementEvent is added',
      build: () => CounterBloc(),
      act: (bloc) => bloc.add(IncrementEvent()),
      expect: () => [1],
    );

    blocTest<CounterBloc, int>(
      'emits [1, 2, 3] when IncrementEvent is added 3 times',
      build: () => CounterBloc(),
      act: (bloc) {
        bloc.add(IncrementEvent());
        bloc.add(IncrementEvent());
        bloc.add(IncrementEvent());
      },
      expect: () => [1, 2, 3],
    );

    blocTest<CounterBloc, int>(
      'emits [-1] when DecrementEvent is added',
      build: () => CounterBloc(),
      act: (bloc) => bloc.add(DecrementEvent()),
      expect: () => [-1],
    );
  });
}
```

---

## Швидкі відповіді

| Питання | Відповідь |
|---------|-----------|
| Що таке ChangeNotifier? | Клас, що сповіщає слухачів про зміни через `notifyListeners()` |
| Що таке ValueNotifier? | ChangeNotifier для одного значення |
| Коли використовувати GetX? | Для швидкої розробки, прототипів |
| Що таке Selector в Provider? | Підписка на конкретну частину стану |
| Різниця між emit і yield в BLoC? | emit — звичайний, yield* — для streams |
| Що таке Repository pattern? | Абстракція над джерелами даних |
