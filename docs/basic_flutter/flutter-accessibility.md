---
description: "Доступность во Flutter: Semantics, screen readers, контрастность — создание инклюзивных приложений"
---

# Доступність (Accessibility) у Flutter

Доступність забезпечує використання застосунку людьми з різними можливостями. Flutter має вбудовану підтримку screen readers, великих шрифтів та інших технологій допомоги.

## Семантика (Semantics)

### Базова семантика

```dart
// Flutter автоматично додає семантику для багатьох віджетів
Text('Привіт') // Автоматично доступний для screen reader

// Явне додавання семантики
Semantics(
  label: 'Кнопка закриття',
  hint: 'Натисніть, щоб закрити вікно',
  button: true,
  child: IconButton(
    icon: Icon(Icons.close),
    onPressed: () {},
  ),
)
```

### Semantics Widget

```dart
Semantics(
  // Мітка для screen reader
  label: 'Зображення профілю',

  // Підказка про дію
  hint: 'Натисніть двічі, щоб змінити',

  // Значення (для слайдерів, прогрес-барів)
  value: '50 відсотків',

  // Тип елемента
  button: true,
  link: false,
  header: false,
  image: true,
  textField: false,
  slider: false,
  checked: null, // true/false для чекбоксів

  // Стан
  enabled: true,
  selected: false,
  focused: false,
  hidden: false,

  // Сортування
  sortKey: OrdinalSortKey(1.0),

  // Дії
  onTap: () {},
  onLongPress: () {},
  onScrollUp: () {},
  onScrollDown: () {},

  child: Container(),
)
```

### ExcludeSemantics та MergeSemantics

```dart
// Виключити з семантичного дерева
ExcludeSemantics(
  child: DecorativeImage(), // Декоративне зображення
)

// Об'єднати семантику дочірніх елементів
MergeSemantics(
  child: Row(
    children: [
      Icon(Icons.star),
      Text('Рейтинг: 4.5'),
    ],
  ),
)

// Блокування семантики
BlockSemantics(
  blocking: true,
  child: ModalBarrier(), // Фон модального вікна
)
```

## Semantic Labels

### Зображення

```dart
// Інформативне зображення
Image.network(
  'https://example.com/photo.jpg',
  semanticLabel: 'Фото користувача Іван Петренко',
)

// Декоративне зображення
Image.asset(
  'assets/background.png',
  semanticLabel: null, // Або ExcludeSemantics
  excludeFromSemantics: true,
)

// Іконка з описом
Icon(
  Icons.favorite,
  semanticLabel: 'Додати в обране',
)
```

### Кнопки та інтерактивні елементи

```dart
// Кнопка з tooltip (автоматично доступна)
IconButton(
  icon: Icon(Icons.delete),
  tooltip: 'Видалити елемент',
  onPressed: () {},
)

// Кастомна кнопка
Semantics(
  label: 'Надіслати повідомлення',
  button: true,
  enabled: _canSend,
  child: GestureDetector(
    onTap: _canSend ? _send : null,
    child: Container(
      // Кастомний дизайн кнопки
    ),
  ),
)

// FloatingActionButton
FloatingActionButton(
  onPressed: _addItem,
  tooltip: 'Додати новий елемент', // Важливо для a11y
  child: Icon(Icons.add),
)
```

## Масштабування тексту

### Підтримка системного масштабу

```dart
class AccessibleText extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // Отримання масштабу тексту
    final textScaleFactor = MediaQuery.of(context).textScaleFactor;

    return Text(
      'Масштабований текст',
      style: TextStyle(fontSize: 16),
      // Дозволити масштабування (за замовчуванням)
      textScaleFactor: textScaleFactor,
    );
  }
}

// Обмеження масштабу (якщо необхідно)
Text(
  'Текст з обмеженим масштабом',
  textScaler: TextScaler.linear(
    MediaQuery.of(context).textScaleFactor.clamp(1.0, 1.5),
  ),
)
```

### Адаптивний layout для великого тексту

```dart
class AdaptiveLayout extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final textScaleFactor = MediaQuery.of(context).textScaleFactor;

    // Змінюємо layout для великого тексту
    if (textScaleFactor > 1.3) {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Заголовок'),
          SizedBox(height: 8),
          Text('Підзаголовок'),
        ],
      );
    }

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text('Заголовок'),
        Text('Підзаголовок'),
      ],
    );
  }
}
```

## Контраст та кольори

```dart
// Перевірка контрасту
class AccessibleColors {
  // Мінімальний контраст за WCAG 2.1:
  // - Звичайний текст: 4.5:1
  // - Великий текст (18pt+): 3:1

  static const Color textOnLight = Color(0xFF1A1A1A); // Високий контраст
  static const Color textOnDark = Color(0xFFF5F5F5);

  // Не покладайтеся тільки на колір
  static Widget buildStatusIndicator(bool isActive) {
    return Row(
      children: [
        Container(
          width: 12,
          height: 12,
          decoration: BoxDecoration(
            color: isActive ? Colors.green : Colors.red,
            shape: BoxShape.circle,
          ),
        ),
        SizedBox(width: 8),
        // Текстова підказка для дальтоніків
        Text(isActive ? 'Активний' : 'Неактивний'),
      ],
    );
  }
}

// Підтримка темного режиму
class AccessibleTheme {
  static ThemeData lightTheme = ThemeData(
    brightness: Brightness.light,
    colorScheme: ColorScheme.light(
      primary: Colors.blue.shade700, // Достатній контраст
      onPrimary: Colors.white,
      surface: Colors.white,
      onSurface: Colors.black87,
    ),
  );

  static ThemeData darkTheme = ThemeData(
    brightness: Brightness.dark,
    colorScheme: ColorScheme.dark(
      primary: Colors.blue.shade300,
      onPrimary: Colors.black,
      surface: Color(0xFF121212),
      onSurface: Colors.white,
    ),
  );
}
```

## Focus та навігація

### Focus Management

```dart
class FocusExample extends StatefulWidget {
  @override
  _FocusExampleState createState() => _FocusExampleState();
}

class _FocusExampleState extends State<FocusExample> {
  final FocusNode _focusNode1 = FocusNode();
  final FocusNode _focusNode2 = FocusNode();

  @override
  void dispose() {
    _focusNode1.dispose();
    _focusNode2.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        TextField(
          focusNode: _focusNode1,
          decoration: InputDecoration(labelText: 'Перше поле'),
          onSubmitted: (_) {
            // Переміщення фокусу на наступне поле
            FocusScope.of(context).requestFocus(_focusNode2);
          },
        ),
        TextField(
          focusNode: _focusNode2,
          decoration: InputDecoration(labelText: 'Друге поле'),
        ),
      ],
    );
  }
}
```

### FocusTraversalGroup

```dart
// Групування елементів для навігації
FocusTraversalGroup(
  policy: OrderedTraversalPolicy(),
  child: Column(
    children: [
      FocusTraversalOrder(
        order: NumericFocusOrder(1),
        child: TextField(decoration: InputDecoration(labelText: 'Ім\'я')),
      ),
      FocusTraversalOrder(
        order: NumericFocusOrder(2),
        child: TextField(decoration: InputDecoration(labelText: 'Email')),
      ),
      FocusTraversalOrder(
        order: NumericFocusOrder(3),
        child: ElevatedButton(
          onPressed: () {},
          child: Text('Відправити'),
        ),
      ),
    ],
  ),
)
```

## Анімації та рух

```dart
class AccessibleAnimations extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // Перевірка налаштувань зменшення руху
    final reduceMotion = MediaQuery.of(context).disableAnimations;

    return AnimatedContainer(
      duration: reduceMotion
          ? Duration.zero // Без анімації
          : Duration(milliseconds: 300),
      color: _isSelected ? Colors.blue : Colors.grey,
      child: Text('Елемент'),
    );
  }
}

// Анімація з урахуванням доступності
class AccessibleAnimation extends StatefulWidget {
  @override
  _AccessibleAnimationState createState() => _AccessibleAnimationState();
}

class _AccessibleAnimationState extends State<AccessibleAnimation>
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
  void didChangeDependencies() {
    super.didChangeDependencies();
    // Вимкнути анімацію, якщо користувач попросив
    if (MediaQuery.of(context).disableAnimations) {
      _controller.value = 1.0; // Показати кінцевий стан
    }
  }

  @override
  Widget build(BuildContext context) {
    return FadeTransition(
      opacity: _controller,
      child: Text('Анімований текст'),
    );
  }
}
```

## Форми та введення

```dart
class AccessibleForm extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Form(
      child: Column(
        children: [
          // Поле з міткою
          TextFormField(
            decoration: InputDecoration(
              labelText: 'Email', // Обов'язково для a11y
              hintText: 'example@email.com',
              helperText: 'Введіть вашу електронну пошту',
              errorText: _hasError ? 'Невірний формат email' : null,
            ),
            keyboardType: TextInputType.emailAddress,
            textInputAction: TextInputAction.next,
            autofillHints: [AutofillHints.email], // Автозаповнення
          ),

          // Поле пароля
          TextFormField(
            decoration: InputDecoration(
              labelText: 'Пароль',
              suffixIcon: IconButton(
                icon: Icon(_showPassword ? Icons.visibility_off : Icons.visibility),
                tooltip: _showPassword ? 'Приховати пароль' : 'Показати пароль',
                onPressed: () {},
              ),
            ),
            obscureText: !_showPassword,
            autofillHints: [AutofillHints.password],
          ),

          // Чекбокс з текстом
          CheckboxListTile(
            title: Text('Я погоджуюсь з умовами'),
            value: _agreed,
            onChanged: (value) {},
            // Семантика автоматично додається
          ),
        ],
      ),
    );
  }
}
```

## Тестування доступності

### Semantic Debugger

```dart
// Увімкнення semantic debugger
MaterialApp(
  showSemanticsDebugger: true, // Показує семантичне дерево
  home: MyHomePage(),
)

// Програмний друк семантичного дерева
import 'package:flutter/rendering.dart';

void main() {
  debugDumpSemanticsTree();
}
```

### Тести доступності

```dart
testWidgets('accessibility test', (tester) async {
  await tester.pumpWidget(MyApp());

  // Перевірка семантичної мітки
  final semantics = tester.getSemantics(find.byType(MyButton));
  expect(semantics.label, 'Надіслати');

  // Перевірка tap target розміру (мінімум 48x48)
  final size = tester.getSize(find.byType(MyButton));
  expect(size.width, greaterThanOrEqualTo(48));
  expect(size.height, greaterThanOrEqualTo(48));
});

// Accessibility guidelines checker
testWidgets('meets accessibility guidelines', (tester) async {
  final handle = tester.ensureSemantics();

  await tester.pumpWidget(MyApp());

  // Перевірка всіх semantics guidelines
  await expectLater(tester, meetsGuideline(textContrastGuideline));
  await expectLater(tester, meetsGuideline(androidTapTargetGuideline));
  await expectLater(tester, meetsGuideline(iOSTapTargetGuideline));
  await expectLater(tester, meetsGuideline(labeledTapTargetGuideline));

  handle.dispose();
});
```

## Чек-лист доступності

```markdown
## Візуальне
- [ ] Достатній контраст тексту (4.5:1 для звичайного, 3:1 для великого)
- [ ] Не покладатися тільки на колір для передачі інформації
- [ ] Підтримка збільшення шрифту (до 200%)
- [ ] Підтримка темного режиму

## Інтерактивне
- [ ] Мінімальний розмір tap target 48x48 dp
- [ ] Всі елементи доступні з клавіатури
- [ ] Логічний порядок фокусу
- [ ] Видимий індикатор фокусу

## Screen Reader
- [ ] Всі зображення мають semantic label або excludeFromSemantics
- [ ] Кнопки мають описові мітки
- [ ] Форми мають мітки полів
- [ ] Правильна структура заголовків

## Анімації
- [ ] Підтримка disableAnimations
- [ ] Немає мерехтіння (< 3 разів на секунду)
- [ ] Можливість призупинити автоматичні анімації
```

## Найкращі практики

1. **Завжди додавайте semantic labels** — для зображень, іконок та кастомних віджетів.

2. **Тестуйте з screen reader** — TalkBack на Android, VoiceOver на iOS.

3. **Підтримуйте масштабування тексту** — не фіксуйте розміри.

4. **Забезпечте достатній контраст** — використовуйте інструменти перевірки.

5. **Дотримуйтесь мінімальних розмірів** — 48x48 для touch targets.

## Висновок

Доступність — це не додаткова функція, а необхідність. Flutter надає всі інструменти для створення доступних застосунків. Правильне використання Semantics, підтримка масштабування та тестування з технологіями допомоги забезпечують використання застосунку всіма користувачами.
