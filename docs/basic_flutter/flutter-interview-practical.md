---
description: "Практические задачи Flutter для собеседований: реализация UI, работа с API, state management"
---

# Співбесіда Flutter: Практичні задачі

Типові практичні завдання та їх рішення для співбесід.

## Задача 1: Counter з BLoC

**Завдання:** Реалізуйте лічильник з BLoC, який підтримує increment, decrement та reset.

**Рішення:**

```dart
// events.dart
sealed class CounterEvent {}
class IncrementEvent extends CounterEvent {}
class DecrementEvent extends CounterEvent {}
class ResetEvent extends CounterEvent {}

// state.dart
class CounterState {
  final int count;
  const CounterState(this.count);
}

// bloc.dart
class CounterBloc extends Bloc<CounterEvent, CounterState> {
  CounterBloc() : super(const CounterState(0)) {
    on<IncrementEvent>((event, emit) {
      emit(CounterState(state.count + 1));
    });

    on<DecrementEvent>((event, emit) {
      if (state.count > 0) {
        emit(CounterState(state.count - 1));
      }
    });

    on<ResetEvent>((event, emit) {
      emit(const CounterState(0));
    });
  }
}

// ui.dart
class CounterPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => CounterBloc(),
      child: Scaffold(
        appBar: AppBar(title: const Text('Counter')),
        body: Center(
          child: BlocBuilder<CounterBloc, CounterState>(
            builder: (context, state) {
              return Text(
                '${state.count}',
                style: const TextStyle(fontSize: 48),
              );
            },
          ),
        ),
        floatingActionButton: Column(
          mainAxisAlignment: MainAxisAlignment.end,
          children: [
            FloatingActionButton(
              onPressed: () => context.read<CounterBloc>().add(IncrementEvent()),
              child: const Icon(Icons.add),
            ),
            const SizedBox(height: 8),
            FloatingActionButton(
              onPressed: () => context.read<CounterBloc>().add(DecrementEvent()),
              child: const Icon(Icons.remove),
            ),
            const SizedBox(height: 8),
            FloatingActionButton(
              onPressed: () => context.read<CounterBloc>().add(ResetEvent()),
              child: const Icon(Icons.refresh),
            ),
          ],
        ),
      ),
    );
  }
}
```

---

## Задача 2: Пошук з Debounce

**Завдання:** Реалізуйте поле пошуку з debounce 500ms та відображенням результатів.

**Рішення:**

```dart
class SearchPage extends StatefulWidget {
  @override
  _SearchPageState createState() => _SearchPageState();
}

class _SearchPageState extends State<SearchPage> {
  final _controller = TextEditingController();
  final _debouncer = Debouncer(milliseconds: 500);
  List<String> _results = [];
  bool _isLoading = false;

  @override
  void dispose() {
    _controller.dispose();
    _debouncer.dispose();
    super.dispose();
  }

  void _onSearchChanged(String query) {
    _debouncer.run(() async {
      if (query.isEmpty) {
        setState(() => _results = []);
        return;
      }

      setState(() => _isLoading = true);

      try {
        final results = await _search(query);
        if (mounted) {
          setState(() => _results = results);
        }
      } finally {
        if (mounted) {
          setState(() => _isLoading = false);
        }
      }
    });
  }

  Future<List<String>> _search(String query) async {
    await Future.delayed(const Duration(milliseconds: 300));
    return List.generate(10, (i) => '$query result $i');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: TextField(
          controller: _controller,
          onChanged: _onSearchChanged,
          decoration: const InputDecoration(
            hintText: 'Search...',
            border: InputBorder.none,
          ),
        ),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : ListView.builder(
              itemCount: _results.length,
              itemBuilder: (context, index) {
                return ListTile(title: Text(_results[index]));
              },
            ),
    );
  }
}

class Debouncer {
  final int milliseconds;
  Timer? _timer;

  Debouncer({required this.milliseconds});

  void run(VoidCallback action) {
    _timer?.cancel();
    _timer = Timer(Duration(milliseconds: milliseconds), action);
  }

  void dispose() {
    _timer?.cancel();
  }
}
```

---

## Задача 3: Infinite Scroll

**Завдання:** Реалізуйте список з пагінацією та завантаженням при скролі.

**Рішення:**

```dart
class InfiniteScrollPage extends StatefulWidget {
  @override
  _InfiniteScrollPageState createState() => _InfiniteScrollPageState();
}

class _InfiniteScrollPageState extends State<InfiniteScrollPage> {
  final _controller = ScrollController();
  final List<Item> _items = [];
  int _page = 1;
  bool _isLoading = false;
  bool _hasMore = true;

  @override
  void initState() {
    super.initState();
    _loadMore();
    _controller.addListener(_onScroll);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_controller.position.pixels >=
        _controller.position.maxScrollExtent - 200) {
      _loadMore();
    }
  }

  Future<void> _loadMore() async {
    if (_isLoading || !_hasMore) return;

    setState(() => _isLoading = true);

    try {
      final newItems = await _fetchItems(_page);

      setState(() {
        _items.addAll(newItems);
        _page++;
        _hasMore = newItems.length == 20; // Розмір сторінки
      });
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error: $e')),
      );
    } finally {
      setState(() => _isLoading = false);
    }
  }

  Future<List<Item>> _fetchItems(int page) async {
    await Future.delayed(const Duration(seconds: 1));
    return List.generate(20, (i) => Item(id: (page - 1) * 20 + i));
  }

  Future<void> _refresh() async {
    setState(() {
      _items.clear();
      _page = 1;
      _hasMore = true;
    });
    await _loadMore();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Infinite Scroll')),
      body: RefreshIndicator(
        onRefresh: _refresh,
        child: ListView.builder(
          controller: _controller,
          itemCount: _items.length + (_hasMore ? 1 : 0),
          itemBuilder: (context, index) {
            if (index == _items.length) {
              return const Padding(
                padding: EdgeInsets.all(16),
                child: Center(child: CircularProgressIndicator()),
              );
            }
            return ListTile(
              title: Text('Item ${_items[index].id}'),
            );
          },
        ),
      ),
    );
  }
}

class Item {
  final int id;
  Item({required this.id});
}
```

---

## Задача 4: Form Validation

**Завдання:** Створіть форму реєстрації з валідацією email, пароля та підтвердження пароля.

**Рішення:**

```dart
class RegistrationForm extends StatefulWidget {
  @override
  _RegistrationFormState createState() => _RegistrationFormState();
}

class _RegistrationFormState extends State<RegistrationForm> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmController = TextEditingController();
  bool _obscurePassword = true;
  bool _isLoading = false;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    _confirmController.dispose();
    super.dispose();
  }

  String? _validateEmail(String? value) {
    if (value == null || value.isEmpty) {
      return 'Email is required';
    }
    final emailRegex = RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');
    if (!emailRegex.hasMatch(value)) {
      return 'Enter a valid email';
    }
    return null;
  }

  String? _validatePassword(String? value) {
    if (value == null || value.isEmpty) {
      return 'Password is required';
    }
    if (value.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (!value.contains(RegExp(r'[A-Z]'))) {
      return 'Password must contain uppercase letter';
    }
    if (!value.contains(RegExp(r'[0-9]'))) {
      return 'Password must contain a number';
    }
    return null;
  }

  String? _validateConfirmPassword(String? value) {
    if (value != _passwordController.text) {
      return 'Passwords do not match';
    }
    return null;
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    try {
      await Future.delayed(const Duration(seconds: 2));

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Registration successful!')),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e')),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Registration')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              TextFormField(
                controller: _emailController,
                decoration: const InputDecoration(
                  labelText: 'Email',
                  prefixIcon: Icon(Icons.email),
                ),
                keyboardType: TextInputType.emailAddress,
                validator: _validateEmail,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _passwordController,
                decoration: InputDecoration(
                  labelText: 'Password',
                  prefixIcon: const Icon(Icons.lock),
                  suffixIcon: IconButton(
                    icon: Icon(
                      _obscurePassword ? Icons.visibility : Icons.visibility_off,
                    ),
                    onPressed: () {
                      setState(() => _obscurePassword = !_obscurePassword);
                    },
                  ),
                ),
                obscureText: _obscurePassword,
                validator: _validatePassword,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _confirmController,
                decoration: const InputDecoration(
                  labelText: 'Confirm Password',
                  prefixIcon: Icon(Icons.lock_outline),
                ),
                obscureText: true,
                validator: _validateConfirmPassword,
              ),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _isLoading ? null : _submit,
                  child: _isLoading
                      ? const SizedBox(
                          height: 20,
                          width: 20,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        )
                      : const Text('Register'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
```

---

## Задача 5: ToDo List з CRUD

**Завдання:** Реалізуйте ToDo список з можливістю додавання, редагування, видалення та позначення виконаних.

**Рішення:**

```dart
class Todo {
  final String id;
  String title;
  bool isCompleted;

  Todo({
    required this.id,
    required this.title,
    this.isCompleted = false,
  });

  Todo copyWith({String? title, bool? isCompleted}) {
    return Todo(
      id: id,
      title: title ?? this.title,
      isCompleted: isCompleted ?? this.isCompleted,
    );
  }
}

class TodoPage extends StatefulWidget {
  @override
  _TodoPageState createState() => _TodoPageState();
}

class _TodoPageState extends State<TodoPage> {
  final List<Todo> _todos = [];
  final _controller = TextEditingController();

  void _addTodo() {
    final text = _controller.text.trim();
    if (text.isEmpty) return;

    setState(() {
      _todos.add(Todo(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        title: text,
      ));
    });
    _controller.clear();
  }

  void _toggleTodo(String id) {
    setState(() {
      final index = _todos.indexWhere((t) => t.id == id);
      if (index != -1) {
        _todos[index] = _todos[index].copyWith(
          isCompleted: !_todos[index].isCompleted,
        );
      }
    });
  }

  void _deleteTodo(String id) {
    setState(() {
      _todos.removeWhere((t) => t.id == id);
    });
  }

  void _editTodo(Todo todo) async {
    final result = await showDialog<String>(
      context: context,
      builder: (context) => _EditDialog(initialValue: todo.title),
    );

    if (result != null && result.isNotEmpty) {
      setState(() {
        final index = _todos.indexWhere((t) => t.id == todo.id);
        if (index != -1) {
          _todos[index] = _todos[index].copyWith(title: result);
        }
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('ToDo List')),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _controller,
                    decoration: const InputDecoration(
                      hintText: 'Add todo...',
                      border: OutlineInputBorder(),
                    ),
                    onSubmitted: (_) => _addTodo(),
                  ),
                ),
                const SizedBox(width: 8),
                IconButton(
                  icon: const Icon(Icons.add),
                  onPressed: _addTodo,
                ),
              ],
            ),
          ),
          Expanded(
            child: _todos.isEmpty
                ? const Center(child: Text('No todos yet'))
                : ListView.builder(
                    itemCount: _todos.length,
                    itemBuilder: (context, index) {
                      final todo = _todos[index];
                      return Dismissible(
                        key: Key(todo.id),
                        direction: DismissDirection.endToStart,
                        onDismissed: (_) => _deleteTodo(todo.id),
                        background: Container(
                          color: Colors.red,
                          alignment: Alignment.centerRight,
                          padding: const EdgeInsets.only(right: 16),
                          child: const Icon(Icons.delete, color: Colors.white),
                        ),
                        child: ListTile(
                          leading: Checkbox(
                            value: todo.isCompleted,
                            onChanged: (_) => _toggleTodo(todo.id),
                          ),
                          title: Text(
                            todo.title,
                            style: TextStyle(
                              decoration: todo.isCompleted
                                  ? TextDecoration.lineThrough
                                  : null,
                            ),
                          ),
                          trailing: IconButton(
                            icon: const Icon(Icons.edit),
                            onPressed: () => _editTodo(todo),
                          ),
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}

class _EditDialog extends StatefulWidget {
  final String initialValue;

  const _EditDialog({required this.initialValue});

  @override
  _EditDialogState createState() => _EditDialogState();
}

class _EditDialogState extends State<_EditDialog> {
  late final TextEditingController _controller;

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController(text: widget.initialValue);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Edit Todo'),
      content: TextField(
        controller: _controller,
        autofocus: true,
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context),
          child: const Text('Cancel'),
        ),
        TextButton(
          onPressed: () => Navigator.pop(context, _controller.text),
          child: const Text('Save'),
        ),
      ],
    );
  }
}
```

---

## Задача 6: Image Gallery

**Завдання:** Створіть галерею зображень з GridView та можливістю перегляду на повний екран.

**Рішення:**

```dart
class ImageGallery extends StatelessWidget {
  final List<String> images = List.generate(
    20,
    (i) => 'https://picsum.photos/seed/$i/400/400',
  );

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Gallery')),
      body: GridView.builder(
        padding: const EdgeInsets.all(8),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 3,
          crossAxisSpacing: 8,
          mainAxisSpacing: 8,
        ),
        itemCount: images.length,
        itemBuilder: (context, index) {
          return GestureDetector(
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => FullScreenImage(
                    images: images,
                    initialIndex: index,
                  ),
                ),
              );
            },
            child: Hero(
              tag: 'image_$index',
              child: ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: Image.network(
                  images[index],
                  fit: BoxFit.cover,
                  loadingBuilder: (context, child, loadingProgress) {
                    if (loadingProgress == null) return child;
                    return const Center(child: CircularProgressIndicator());
                  },
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}

class FullScreenImage extends StatefulWidget {
  final List<String> images;
  final int initialIndex;

  const FullScreenImage({
    required this.images,
    required this.initialIndex,
  });

  @override
  _FullScreenImageState createState() => _FullScreenImageState();
}

class _FullScreenImageState extends State<FullScreenImage> {
  late PageController _controller;
  late int _currentIndex;

  @override
  void initState() {
    super.initState();
    _currentIndex = widget.initialIndex;
    _controller = PageController(initialPage: widget.initialIndex);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        title: Text('${_currentIndex + 1} / ${widget.images.length}'),
      ),
      body: PageView.builder(
        controller: _controller,
        itemCount: widget.images.length,
        onPageChanged: (index) {
          setState(() => _currentIndex = index);
        },
        itemBuilder: (context, index) {
          return InteractiveViewer(
            child: Center(
              child: Hero(
                tag: 'image_$index',
                child: Image.network(widget.images[index]),
              ),
            ),
          );
        },
      ),
    );
  }
}
```

---

## Задача 7: Theme Switcher

**Завдання:** Реалізуйте перемикач теми (світла/темна) зі збереженням вибору.

**Рішення:**

```dart
class ThemeProvider extends ChangeNotifier {
  ThemeMode _themeMode = ThemeMode.system;

  ThemeMode get themeMode => _themeMode;

  ThemeProvider() {
    _loadTheme();
  }

  Future<void> _loadTheme() async {
    final prefs = await SharedPreferences.getInstance();
    final themeName = prefs.getString('theme') ?? 'system';
    _themeMode = ThemeMode.values.firstWhere(
      (e) => e.name == themeName,
      orElse: () => ThemeMode.system,
    );
    notifyListeners();
  }

  Future<void> setThemeMode(ThemeMode mode) async {
    _themeMode = mode;
    notifyListeners();

    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('theme', mode.name);
  }
}

// main.dart
void main() {
  runApp(
    ChangeNotifierProvider(
      create: (_) => ThemeProvider(),
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    final themeProvider = context.watch<ThemeProvider>();

    return MaterialApp(
      themeMode: themeProvider.themeMode,
      theme: ThemeData.light(useMaterial3: true),
      darkTheme: ThemeData.dark(useMaterial3: true),
      home: const SettingsPage(),
    );
  }
}

class SettingsPage extends StatelessWidget {
  const SettingsPage({super.key});

  @override
  Widget build(BuildContext context) {
    final themeProvider = context.watch<ThemeProvider>();

    return Scaffold(
      appBar: AppBar(title: const Text('Settings')),
      body: ListView(
        children: [
          const ListTile(
            title: Text('Theme'),
            subtitle: Text('Select app theme'),
          ),
          RadioListTile<ThemeMode>(
            title: const Text('System'),
            value: ThemeMode.system,
            groupValue: themeProvider.themeMode,
            onChanged: (value) => themeProvider.setThemeMode(value!),
          ),
          RadioListTile<ThemeMode>(
            title: const Text('Light'),
            value: ThemeMode.light,
            groupValue: themeProvider.themeMode,
            onChanged: (value) => themeProvider.setThemeMode(value!),
          ),
          RadioListTile<ThemeMode>(
            title: const Text('Dark'),
            value: ThemeMode.dark,
            groupValue: themeProvider.themeMode,
            onChanged: (value) => themeProvider.setThemeMode(value!),
          ),
        ],
      ),
    );
  }
}
```

---

## Поради для співбесіди

1. **Пишіть чистий код** — форматування, іменування, структура
2. **Обробляйте помилки** — try/catch, mounted перевірки
3. **Звільняйте ресурси** — dispose контролерів
4. **Коментуйте складні місця** — поясніть логіку
5. **Питайте уточнення** — якщо завдання неясне
6. **Тестуйте код** — перевірте edge cases
