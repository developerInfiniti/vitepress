---
description: "Локализация Flutter приложений: intl, ARB файлы, многоязычность — поддержка нескольких языков"
---

# Локалізація у Flutter

Локалізація (i18n) дозволяє адаптувати застосунок для користувачів з різних країн, підтримуючи різні мови, формати дат, валют та інші регіональні налаштування.

## Налаштування локалізації

### Залежності

```yaml
# pubspec.yaml
dependencies:
  flutter:
    sdk: flutter
  flutter_localizations:
    sdk: flutter
  intl: ^0.18.0

flutter:
  generate: true
```

### Конфігурація l10n.yaml

```yaml
# l10n.yaml
arb-dir: lib/l10n
template-arb-file: app_en.arb
output-localization-file: app_localizations.dart
output-class: AppLocalizations
```

## ARB файли

### Англійська (app_en.arb)

```json
{
  "@@locale": "en",
  "appTitle": "My Application",
  "@appTitle": {
    "description": "The title of the application"
  },
  "hello": "Hello",
  "greeting": "Hello, {name}!",
  "@greeting": {
    "description": "A greeting message",
    "placeholders": {
      "name": {
        "type": "String",
        "example": "John"
      }
    }
  },
  "itemCount": "{count, plural, =0{No items} =1{1 item} other{{count} items}}",
  "@itemCount": {
    "description": "Number of items",
    "placeholders": {
      "count": {
        "type": "int"
      }
    }
  },
  "dateFormat": "Date: {date}",
  "@dateFormat": {
    "placeholders": {
      "date": {
        "type": "DateTime",
        "format": "yMMMd"
      }
    }
  },
  "price": "Price: {amount}",
  "@price": {
    "placeholders": {
      "amount": {
        "type": "double",
        "format": "currency",
        "optionalParameters": {
          "symbol": "$"
        }
      }
    }
  },
  "gender": "{gender, select, male{He} female{She} other{They}} liked this",
  "@gender": {
    "placeholders": {
      "gender": {
        "type": "String"
      }
    }
  }
}
```

### Українська (app_uk.arb)

```json
{
  "@@locale": "uk",
  "appTitle": "Мій застосунок",
  "hello": "Привіт",
  "greeting": "Привіт, {name}!",
  "itemCount": "{count, plural, =0{Немає елементів} =1{1 елемент} few{{count} елементи} many{{count} елементів} other{{count} елементів}}",
  "dateFormat": "Дата: {date}",
  "price": "Ціна: {amount}",
  "gender": "{gender, select, male{Він} female{Вона} other{Вони}} вподобали це"
}
```

## Налаштування MaterialApp

```dart
import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'My App',

      // Делегати локалізації
      localizationsDelegates: [
        AppLocalizations.delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],

      // Підтримувані мови
      supportedLocales: [
        Locale('en'),
        Locale('uk'),
        Locale('pl'),
      ],

      // Визначення локалі
      localeResolutionCallback: (locale, supportedLocales) {
        for (var supportedLocale in supportedLocales) {
          if (supportedLocale.languageCode == locale?.languageCode) {
            return supportedLocale;
          }
        }
        return supportedLocales.first;
      },

      home: HomeScreen(),
    );
  }
}
```

## Використання локалізації

### Базове використання

```dart
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class HomeScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;

    return Scaffold(
      appBar: AppBar(
        title: Text(l10n.appTitle),
      ),
      body: Column(
        children: [
          Text(l10n.hello),
          Text(l10n.greeting('Іван')),
          Text(l10n.itemCount(5)),
          Text(l10n.dateFormat(DateTime.now())),
          Text(l10n.price(99.99)),
          Text(l10n.gender('female')),
        ],
      ),
    );
  }
}
```

### Extension для зручності

```dart
extension LocalizationExtension on BuildContext {
  AppLocalizations get l10n => AppLocalizations.of(this)!;
}

// Використання
Text(context.l10n.hello)
```

## Динамічна зміна мови

### LocaleProvider

```dart
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class LocaleProvider extends ChangeNotifier {
  Locale _locale = Locale('uk');

  Locale get locale => _locale;

  LocaleProvider() {
    _loadSavedLocale();
  }

  Future<void> _loadSavedLocale() async {
    final prefs = await SharedPreferences.getInstance();
    final languageCode = prefs.getString('languageCode') ?? 'uk';
    _locale = Locale(languageCode);
    notifyListeners();
  }

  Future<void> setLocale(Locale locale) async {
    if (_locale == locale) return;

    _locale = locale;
    notifyListeners();

    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('languageCode', locale.languageCode);
  }
}
```

### Інтеграція з Provider

```dart
void main() {
  runApp(
    ChangeNotifierProvider(
      create: (_) => LocaleProvider(),
      child: MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final localeProvider = Provider.of<LocaleProvider>(context);

    return MaterialApp(
      locale: localeProvider.locale,
      localizationsDelegates: [
        AppLocalizations.delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      supportedLocales: [
        Locale('en'),
        Locale('uk'),
        Locale('pl'),
      ],
      home: HomeScreen(),
    );
  }
}
```

### Екран вибору мови

```dart
class LanguageSettingsScreen extends StatelessWidget {
  final List<LanguageOption> languages = [
    LanguageOption('uk', 'Українська', '🇺🇦'),
    LanguageOption('en', 'English', '🇬🇧'),
    LanguageOption('pl', 'Polski', '🇵🇱'),
  ];

  @override
  Widget build(BuildContext context) {
    final localeProvider = Provider.of<LocaleProvider>(context);

    return Scaffold(
      appBar: AppBar(title: Text(context.l10n.languageSettings)),
      body: ListView.builder(
        itemCount: languages.length,
        itemBuilder: (context, index) {
          final language = languages[index];
          final isSelected =
              localeProvider.locale.languageCode == language.code;

          return ListTile(
            leading: Text(language.flag, style: TextStyle(fontSize: 24)),
            title: Text(language.name),
            trailing: isSelected ? Icon(Icons.check, color: Colors.green) : null,
            onTap: () {
              localeProvider.setLocale(Locale(language.code));
            },
          );
        },
      ),
    );
  }
}

class LanguageOption {
  final String code;
  final String name;
  final String flag;

  LanguageOption(this.code, this.name, this.flag);
}
```

## Форматування даних

### Дати та час

```dart
import 'package:intl/intl.dart';

class DateFormatService {
  // Форматування дати
  String formatDate(DateTime date, String locale) {
    return DateFormat.yMMMd(locale).format(date);
  }

  // Форматування часу
  String formatTime(DateTime time, String locale) {
    return DateFormat.Hm(locale).format(time);
  }

  // Повний формат
  String formatDateTime(DateTime dateTime, String locale) {
    return DateFormat.yMMMd(locale).add_Hm().format(dateTime);
  }

  // Відносний час
  String formatRelative(DateTime dateTime) {
    final now = DateTime.now();
    final difference = now.difference(dateTime);

    if (difference.inDays > 7) {
      return DateFormat.yMMMd().format(dateTime);
    } else if (difference.inDays > 0) {
      return '${difference.inDays} днів тому';
    } else if (difference.inHours > 0) {
      return '${difference.inHours} годин тому';
    } else if (difference.inMinutes > 0) {
      return '${difference.inMinutes} хвилин тому';
    } else {
      return 'Щойно';
    }
  }
}

// Використання
final locale = Localizations.localeOf(context).languageCode;
final formattedDate = DateFormatService().formatDate(DateTime.now(), locale);
```

### Числа та валюта

```dart
class NumberFormatService {
  // Форматування числа
  String formatNumber(double number, String locale) {
    return NumberFormat.decimalPattern(locale).format(number);
  }

  // Форматування валюти
  String formatCurrency(double amount, String locale, {String? symbol}) {
    return NumberFormat.currency(
      locale: locale,
      symbol: symbol ?? 'UAH',
      decimalDigits: 2,
    ).format(amount);
  }

  // Форматування відсотків
  String formatPercent(double value, String locale) {
    return NumberFormat.percentPattern(locale).format(value);
  }

  // Компактне форматування
  String formatCompact(double number, String locale) {
    return NumberFormat.compact(locale: locale).format(number);
  }
}

// Використання
final locale = Localizations.localeOf(context).languageCode;
final formattedPrice = NumberFormatService().formatCurrency(1999.99, locale, symbol: '₴');
// Виведе: 1 999,99 ₴
```

## Множина (Plurals)

### ARB файл

```json
{
  "cartItems": "{count, plural, =0{Кошик порожній} =1{1 товар у кошику} few{{count} товари у кошику} many{{count} товарів у кошику} other{{count} товарів у кошику}}",
  "@cartItems": {
    "placeholders": {
      "count": {
        "type": "int"
      }
    }
  },
  "daysRemaining": "{days, plural, =0{Останній день} =1{Залишився 1 день} few{Залишилось {days} дні} many{Залишилось {days} днів} other{Залишилось {days} днів}}",
  "@daysRemaining": {
    "placeholders": {
      "days": {
        "type": "int"
      }
    }
  }
}
```

### Використання

```dart
Text(context.l10n.cartItems(0))  // Кошик порожній
Text(context.l10n.cartItems(1))  // 1 товар у кошику
Text(context.l10n.cartItems(3))  // 3 товари у кошику
Text(context.l10n.cartItems(5))  // 5 товарів у кошику
Text(context.l10n.cartItems(21)) // 21 товар у кошику
```

## Вибір за родом (Gender Select)

```json
{
  "userAction": "{gender, select, male{{name} оновив свій профіль} female{{name} оновила свій профіль} other{{name} оновив(ла) свій профіль}}",
  "@userAction": {
    "placeholders": {
      "gender": {
        "type": "String"
      },
      "name": {
        "type": "String"
      }
    }
  }
}
```

## RTL підтримка

```dart
class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      localizationsDelegates: [...],
      supportedLocales: [
        Locale('en'),
        Locale('uk'),
        Locale('ar'), // Арабська (RTL)
        Locale('he'), // Іврит (RTL)
      ],
      builder: (context, child) {
        return Directionality(
          textDirection: _getTextDirection(context),
          child: child!,
        );
      },
      home: HomeScreen(),
    );
  }

  TextDirection _getTextDirection(BuildContext context) {
    final locale = Localizations.localeOf(context);
    final rtlLanguages = ['ar', 'he', 'fa', 'ur'];

    if (rtlLanguages.contains(locale.languageCode)) {
      return TextDirection.rtl;
    }
    return TextDirection.ltr;
  }
}

// Адаптивний віджет
class AdaptivePadding extends StatelessWidget {
  final Widget child;
  final double start;
  final double end;

  const AdaptivePadding({
    required this.child,
    this.start = 0,
    this.end = 0,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsetsDirectional.only(start: start, end: end),
      child: child,
    );
  }
}
```

## Локалізація зображень та активів

```dart
class LocalizedAssets {
  static String getImage(BuildContext context, String imageName) {
    final locale = Localizations.localeOf(context).languageCode;
    return 'assets/images/$locale/$imageName';
  }

  static String getFlag(String languageCode) {
    final flags = {
      'uk': '🇺🇦',
      'en': '🇬🇧',
      'pl': '🇵🇱',
      'de': '🇩🇪',
    };
    return flags[languageCode] ?? '🏳️';
  }
}

// Використання
Image.asset(LocalizedAssets.getImage(context, 'welcome.png'))
```

## Тестування локалізації

```dart
testWidgets('displays localized text', (tester) async {
  await tester.pumpWidget(
    MaterialApp(
      locale: Locale('uk'),
      localizationsDelegates: [
        AppLocalizations.delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
      ],
      supportedLocales: [Locale('uk'), Locale('en')],
      home: HomeScreen(),
    ),
  );

  expect(find.text('Привіт'), findsOneWidget);
});

testWidgets('displays plural correctly', (tester) async {
  await tester.pumpWidget(
    // ...
  );

  final l10n = AppLocalizations.of(tester.element(find.byType(HomeScreen)))!;
  expect(l10n.itemCount(1), '1 елемент');
  expect(l10n.itemCount(5), '5 елементів');
});
```

## Найкращі практики

1. **Використовуйте описові ключі** — `welcomeMessage` замість `msg1`.

2. **Додавайте контекст** — використовуйте `@description` в ARB файлах.

3. **Уникайте конкатенації** — використовуйте плейсхолдери.

4. **Тестуйте з різними мовами** — особливо RTL та мови з довгими словами.

5. **Враховуйте множину** — різні мови мають різні правила множини.

6. **Форматуйте дати та числа** — використовуйте `intl` пакет.

## Висновок

Локалізація у Flutter є потужною та гнучкою. Правильне налаштування локалізації дозволяє створювати застосунки, доступні для користувачів з різних країн, з підтримкою різних мов, форматів дат, валют та інших регіональних особливостей.
