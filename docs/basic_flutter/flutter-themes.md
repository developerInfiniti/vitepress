# Теми та стилізація у Flutter

Теми у Flutter дозволяють визначити єдиний візуальний стиль для всього застосунку. Це включає кольори, шрифти, форми та інші візуальні параметри.

## ThemeData

`ThemeData` — це основний клас для визначення теми застосунку.

### Базова конфігурація теми

```dart
MaterialApp(
  title: 'Мій застосунок',
  theme: ThemeData(
    // Основний колір
    primarySwatch: Colors.blue,

    // Кольорова схема
    colorScheme: ColorScheme.fromSeed(
      seedColor: Colors.blue,
      brightness: Brightness.light,
    ),

    // Колір фону scaffold
    scaffoldBackgroundColor: Colors.grey[100],

    // Стиль AppBar
    appBarTheme: AppBarTheme(
      backgroundColor: Colors.blue,
      foregroundColor: Colors.white,
      elevation: 4,
    ),

    // Стиль кнопок
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        foregroundColor: Colors.white,
        backgroundColor: Colors.blue,
        padding: EdgeInsets.symmetric(horizontal: 24, vertical: 12),
      ),
    ),

    // Стиль тексту
    textTheme: TextTheme(
      displayLarge: TextStyle(fontSize: 32, fontWeight: FontWeight.bold),
      bodyLarge: TextStyle(fontSize: 16),
      bodyMedium: TextStyle(fontSize: 14),
    ),
  ),
  home: MyHomePage(),
);
```

## Кольорова схема (ColorScheme)

`ColorScheme` визначає набір кольорів для різних елементів UI.

```dart
ThemeData(
  colorScheme: ColorScheme(
    // Основні кольори
    primary: Colors.blue,
    onPrimary: Colors.white,

    // Другорядні кольори
    secondary: Colors.amber,
    onSecondary: Colors.black,

    // Третинні кольори
    tertiary: Colors.teal,
    onTertiary: Colors.white,

    // Кольори помилок
    error: Colors.red,
    onError: Colors.white,

    // Кольори фону
    surface: Colors.white,
    onSurface: Colors.black,

    // Яскравість
    brightness: Brightness.light,
  ),
)

// Або з seed-кольору
ThemeData(
  colorScheme: ColorScheme.fromSeed(
    seedColor: Colors.deepPurple,
    brightness: Brightness.light,
  ),
)
```

## Текстові стилі

### TextTheme

```dart
ThemeData(
  textTheme: TextTheme(
    // Заголовки
    displayLarge: TextStyle(
      fontSize: 57,
      fontWeight: FontWeight.w400,
      letterSpacing: -0.25,
    ),
    displayMedium: TextStyle(
      fontSize: 45,
      fontWeight: FontWeight.w400,
    ),
    displaySmall: TextStyle(
      fontSize: 36,
      fontWeight: FontWeight.w400,
    ),

    // Заголовки розділів
    headlineLarge: TextStyle(
      fontSize: 32,
      fontWeight: FontWeight.w400,
    ),
    headlineMedium: TextStyle(
      fontSize: 28,
      fontWeight: FontWeight.w400,
    ),
    headlineSmall: TextStyle(
      fontSize: 24,
      fontWeight: FontWeight.w400,
    ),

    // Заголовки елементів
    titleLarge: TextStyle(
      fontSize: 22,
      fontWeight: FontWeight.w500,
    ),
    titleMedium: TextStyle(
      fontSize: 16,
      fontWeight: FontWeight.w500,
      letterSpacing: 0.15,
    ),
    titleSmall: TextStyle(
      fontSize: 14,
      fontWeight: FontWeight.w500,
      letterSpacing: 0.1,
    ),

    // Основний текст
    bodyLarge: TextStyle(
      fontSize: 16,
      fontWeight: FontWeight.w400,
      letterSpacing: 0.5,
    ),
    bodyMedium: TextStyle(
      fontSize: 14,
      fontWeight: FontWeight.w400,
      letterSpacing: 0.25,
    ),
    bodySmall: TextStyle(
      fontSize: 12,
      fontWeight: FontWeight.w400,
      letterSpacing: 0.4,
    ),

    // Мітки
    labelLarge: TextStyle(
      fontSize: 14,
      fontWeight: FontWeight.w500,
      letterSpacing: 0.1,
    ),
    labelMedium: TextStyle(
      fontSize: 12,
      fontWeight: FontWeight.w500,
      letterSpacing: 0.5,
    ),
    labelSmall: TextStyle(
      fontSize: 11,
      fontWeight: FontWeight.w500,
      letterSpacing: 0.5,
    ),
  ),
)
```

### Використання текстових стилів

```dart
Text(
  'Заголовок',
  style: Theme.of(context).textTheme.headlineLarge,
)

Text(
  'Звичайний текст',
  style: Theme.of(context).textTheme.bodyMedium,
)

// Модифікація стилю з теми
Text(
  'Кольоровий текст',
  style: Theme.of(context).textTheme.bodyLarge?.copyWith(
    color: Colors.blue,
    fontWeight: FontWeight.bold,
  ),
)
```

## Стилізація компонентів

### Стиль кнопок

```dart
ThemeData(
  // ElevatedButton
  elevatedButtonTheme: ElevatedButtonThemeData(
    style: ElevatedButton.styleFrom(
      foregroundColor: Colors.white,
      backgroundColor: Colors.blue,
      disabledForegroundColor: Colors.grey,
      disabledBackgroundColor: Colors.grey[300],
      padding: EdgeInsets.symmetric(horizontal: 24, vertical: 12),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(8),
      ),
      elevation: 2,
    ),
  ),

  // TextButton
  textButtonTheme: TextButtonThemeData(
    style: TextButton.styleFrom(
      foregroundColor: Colors.blue,
      padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
    ),
  ),

  // OutlinedButton
  outlinedButtonTheme: OutlinedButtonThemeData(
    style: OutlinedButton.styleFrom(
      foregroundColor: Colors.blue,
      side: BorderSide(color: Colors.blue, width: 2),
      padding: EdgeInsets.symmetric(horizontal: 24, vertical: 12),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(8),
      ),
    ),
  ),

  // FloatingActionButton
  floatingActionButtonTheme: FloatingActionButtonThemeData(
    backgroundColor: Colors.blue,
    foregroundColor: Colors.white,
    elevation: 4,
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(16),
    ),
  ),
)
```

### Стиль полів введення

```dart
ThemeData(
  inputDecorationTheme: InputDecorationTheme(
    // Заповнення
    filled: true,
    fillColor: Colors.grey[100],

    // Рамки
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(8),
      borderSide: BorderSide(color: Colors.grey),
    ),
    enabledBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(8),
      borderSide: BorderSide(color: Colors.grey),
    ),
    focusedBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(8),
      borderSide: BorderSide(color: Colors.blue, width: 2),
    ),
    errorBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(8),
      borderSide: BorderSide(color: Colors.red),
    ),

    // Відступи
    contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),

    // Текстові стилі
    labelStyle: TextStyle(color: Colors.grey[700]),
    hintStyle: TextStyle(color: Colors.grey[400]),
    errorStyle: TextStyle(color: Colors.red, fontSize: 12),

    // Іконки
    prefixIconColor: Colors.grey[600],
    suffixIconColor: Colors.grey[600],
  ),
)
```

### Стиль карток

```dart
ThemeData(
  cardTheme: CardTheme(
    color: Colors.white,
    elevation: 2,
    shadowColor: Colors.black26,
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(12),
    ),
    margin: EdgeInsets.all(8),
  ),
)
```

### Стиль AppBar

```dart
ThemeData(
  appBarTheme: AppBarTheme(
    backgroundColor: Colors.blue,
    foregroundColor: Colors.white,
    elevation: 4,
    shadowColor: Colors.black45,
    centerTitle: true,
    titleTextStyle: TextStyle(
      fontSize: 20,
      fontWeight: FontWeight.bold,
    ),
    iconTheme: IconThemeData(color: Colors.white),
    actionsIconTheme: IconThemeData(color: Colors.white),
  ),
)
```

### Стиль BottomNavigationBar

```dart
ThemeData(
  bottomNavigationBarTheme: BottomNavigationBarThemeData(
    backgroundColor: Colors.white,
    selectedItemColor: Colors.blue,
    unselectedItemColor: Colors.grey,
    selectedLabelStyle: TextStyle(fontWeight: FontWeight.bold),
    unselectedLabelStyle: TextStyle(fontWeight: FontWeight.normal),
    showSelectedLabels: true,
    showUnselectedLabels: true,
    type: BottomNavigationBarType.fixed,
    elevation: 8,
  ),
)
```

## Темна тема

### Налаштування темної теми

```dart
MaterialApp(
  theme: ThemeData.light().copyWith(
    colorScheme: ColorScheme.fromSeed(
      seedColor: Colors.blue,
      brightness: Brightness.light,
    ),
  ),
  darkTheme: ThemeData.dark().copyWith(
    colorScheme: ColorScheme.fromSeed(
      seedColor: Colors.blue,
      brightness: Brightness.dark,
    ),
  ),
  themeMode: ThemeMode.system, // system, light, dark
  home: MyHomePage(),
)
```

### Повна конфігурація темної теми

```dart
final ThemeData darkTheme = ThemeData(
  brightness: Brightness.dark,
  colorScheme: ColorScheme.dark(
    primary: Colors.blue[300]!,
    secondary: Colors.amber[300]!,
    surface: Color(0xFF1E1E1E),
    error: Colors.red[300]!,
  ),
  scaffoldBackgroundColor: Color(0xFF121212),

  appBarTheme: AppBarTheme(
    backgroundColor: Color(0xFF1E1E1E),
    foregroundColor: Colors.white,
    elevation: 0,
  ),

  cardTheme: CardTheme(
    color: Color(0xFF2C2C2C),
    elevation: 4,
  ),

  inputDecorationTheme: InputDecorationTheme(
    filled: true,
    fillColor: Color(0xFF2C2C2C),
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(8),
      borderSide: BorderSide.none,
    ),
  ),

  elevatedButtonTheme: ElevatedButtonThemeData(
    style: ElevatedButton.styleFrom(
      backgroundColor: Colors.blue[300],
      foregroundColor: Colors.black,
    ),
  ),
);
```

## Перемикання тем

### За допомогою Provider

```dart
// theme_provider.dart
import 'package:flutter/material.dart';

class ThemeProvider extends ChangeNotifier {
  ThemeMode _themeMode = ThemeMode.system;

  ThemeMode get themeMode => _themeMode;

  bool get isDarkMode {
    return _themeMode == ThemeMode.dark;
  }

  void toggleTheme(bool isDark) {
    _themeMode = isDark ? ThemeMode.dark : ThemeMode.light;
    notifyListeners();
  }

  void setThemeMode(ThemeMode mode) {
    _themeMode = mode;
    notifyListeners();
  }
}

// main.dart
void main() {
  runApp(
    ChangeNotifierProvider(
      create: (_) => ThemeProvider(),
      child: MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<ThemeProvider>(context);

    return MaterialApp(
      theme: lightTheme,
      darkTheme: darkTheme,
      themeMode: themeProvider.themeMode,
      home: MyHomePage(),
    );
  }
}

// settings_screen.dart
class SettingsScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<ThemeProvider>(context);

    return SwitchListTile(
      title: Text('Темна тема'),
      value: themeProvider.isDarkMode,
      onChanged: (value) {
        themeProvider.toggleTheme(value);
      },
    );
  }
}
```

## Власні шрифти

### Додавання шрифтів

```yaml
# pubspec.yaml
flutter:
  fonts:
    - family: Roboto
      fonts:
        - asset: assets/fonts/Roboto-Regular.ttf
        - asset: assets/fonts/Roboto-Bold.ttf
          weight: 700
        - asset: assets/fonts/Roboto-Italic.ttf
          style: italic
    - family: OpenSans
      fonts:
        - asset: assets/fonts/OpenSans-Regular.ttf
```

### Використання шрифтів

```dart
ThemeData(
  fontFamily: 'Roboto',
  textTheme: TextTheme(
    headlineLarge: TextStyle(
      fontFamily: 'OpenSans',
      fontWeight: FontWeight.bold,
    ),
  ),
)

// Або локально
Text(
  'Текст з власним шрифтом',
  style: TextStyle(fontFamily: 'OpenSans'),
)
```

## Розширення теми (Theme Extensions)

```dart
// Власне розширення теми
@immutable
class CustomColors extends ThemeExtension<CustomColors> {
  final Color? success;
  final Color? warning;
  final Color? info;

  const CustomColors({
    required this.success,
    required this.warning,
    required this.info,
  });

  @override
  CustomColors copyWith({
    Color? success,
    Color? warning,
    Color? info,
  }) {
    return CustomColors(
      success: success ?? this.success,
      warning: warning ?? this.warning,
      info: info ?? this.info,
    );
  }

  @override
  CustomColors lerp(ThemeExtension<CustomColors>? other, double t) {
    if (other is! CustomColors) {
      return this;
    }
    return CustomColors(
      success: Color.lerp(success, other.success, t),
      warning: Color.lerp(warning, other.warning, t),
      info: Color.lerp(info, other.info, t),
    );
  }
}

// Використання
ThemeData(
  extensions: <ThemeExtension<dynamic>>[
    CustomColors(
      success: Colors.green,
      warning: Colors.orange,
      info: Colors.blue,
    ),
  ],
)

// Доступ до розширення
final customColors = Theme.of(context).extension<CustomColors>()!;
Container(
  color: customColors.success,
)
```

## Адаптивні теми

```dart
class AdaptiveTheme {
  static ThemeData getTheme(BuildContext context) {
    final brightness = MediaQuery.of(context).platformBrightness;
    final screenWidth = MediaQuery.of(context).size.width;

    // Адаптивні розміри тексту
    double baseFontSize = screenWidth < 600 ? 14 : 16;

    return ThemeData(
      brightness: brightness,
      textTheme: TextTheme(
        bodyMedium: TextStyle(fontSize: baseFontSize),
        bodyLarge: TextStyle(fontSize: baseFontSize * 1.15),
        headlineMedium: TextStyle(fontSize: baseFontSize * 1.75),
      ),
    );
  }
}
```

## Найкращі практики

1. **Використовуйте ColorScheme** замість окремих визначень кольорів.

2. **Визначайте теми окремо** від коду UI для кращої організації.

3. **Використовуйте Theme.of(context)** для доступу до теми.

4. **Тестуйте обидві теми** — світлу та темну.

5. **Використовуйте copyWith()** для локальних модифікацій стилів.

6. **Використовуйте ThemeExtension** для власних параметрів теми.

## Висновок

Правильне використання тем у Flutter дозволяє створити консистентний візуальний стиль застосунку та легко підтримувати його. Використання ColorScheme, TextTheme та інших компонентів ThemeData забезпечує гнучкість та зручність у стилізації.
