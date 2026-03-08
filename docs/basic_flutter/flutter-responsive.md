---
description: "Адаптивный дизайн во Flutter: MediaQuery, LayoutBuilder, responsive breakpoints — поддержка экранов"
---

# Адаптивний дизайн у Flutter

Створення застосунків, які коректно відображаються на різних пристроях — від телефонів до планшетів та десктопів — є важливим аспектом розробки. Flutter надає інструменти для створення адаптивного та responsive UI.

## MediaQuery

`MediaQuery` надає інформацію про розміри екрану та налаштування пристрою.

```dart
class MediaQueryExample extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // Отримання MediaQueryData
    final mediaQuery = MediaQuery.of(context);

    // Розміри екрану
    final screenWidth = mediaQuery.size.width;
    final screenHeight = mediaQuery.size.height;

    // Відступи (safe area)
    final padding = mediaQuery.padding;
    final topPadding = padding.top; // Статус бар
    final bottomPadding = padding.bottom; // Навігаційна панель

    // Орієнтація
    final orientation = mediaQuery.orientation;
    final isLandscape = orientation == Orientation.landscape;

    // Масштаб тексту
    final textScaleFactor = mediaQuery.textScaleFactor;

    // Темний режим
    final platformBrightness = mediaQuery.platformBrightness;
    final isDarkMode = platformBrightness == Brightness.dark;

    // Доступність
    final accessibleNavigation = mediaQuery.accessibleNavigation;
    final boldText = mediaQuery.boldText;

    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            Text('Ширина: $screenWidth'),
            Text('Висота: $screenHeight'),
            Text('Орієнтація: ${isLandscape ? "Горизонтальна" : "Вертикальна"}'),
            Text('Темний режим: $isDarkMode'),
          ],
        ),
      ),
    );
  }
}
```

## LayoutBuilder

`LayoutBuilder` надає розміри батьківського віджета для побудови адаптивного UI.

```dart
class LayoutBuilderExample extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        // Доступні розміри
        final maxWidth = constraints.maxWidth;
        final maxHeight = constraints.maxHeight;

        // Адаптивний вибір макету
        if (maxWidth < 600) {
          return _buildMobileLayout();
        } else if (maxWidth < 900) {
          return _buildTabletLayout();
        } else {
          return _buildDesktopLayout();
        }
      },
    );
  }

  Widget _buildMobileLayout() {
    return ListView(
      children: [
        _buildCard('Картка 1'),
        _buildCard('Картка 2'),
        _buildCard('Картка 3'),
      ],
    );
  }

  Widget _buildTabletLayout() {
    return GridView.count(
      crossAxisCount: 2,
      children: [
        _buildCard('Картка 1'),
        _buildCard('Картка 2'),
        _buildCard('Картка 3'),
        _buildCard('Картка 4'),
      ],
    );
  }

  Widget _buildDesktopLayout() {
    return Row(
      children: [
        Expanded(flex: 1, child: _buildSidebar()),
        Expanded(flex: 3, child: _buildContent()),
      ],
    );
  }

  Widget _buildCard(String title) {
    return Card(
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Text(title),
      ),
    );
  }

  Widget _buildSidebar() => Container(color: Colors.grey[200]);
  Widget _buildContent() => Container(color: Colors.white);
}
```

## Breakpoints

### Система breakpoints

```dart
class Breakpoints {
  static const double mobile = 600;
  static const double tablet = 900;
  static const double desktop = 1200;
  static const double largeDesktop = 1800;
}

enum DeviceType { mobile, tablet, desktop, largeDesktop }

class ResponsiveHelper {
  static DeviceType getDeviceType(BuildContext context) {
    final width = MediaQuery.of(context).size.width;

    if (width < Breakpoints.mobile) {
      return DeviceType.mobile;
    } else if (width < Breakpoints.tablet) {
      return DeviceType.tablet;
    } else if (width < Breakpoints.desktop) {
      return DeviceType.desktop;
    } else {
      return DeviceType.largeDesktop;
    }
  }

  static bool isMobile(BuildContext context) =>
      getDeviceType(context) == DeviceType.mobile;

  static bool isTablet(BuildContext context) =>
      getDeviceType(context) == DeviceType.tablet;

  static bool isDesktop(BuildContext context) =>
      getDeviceType(context) == DeviceType.desktop ||
      getDeviceType(context) == DeviceType.largeDesktop;

  static T value<T>(
    BuildContext context, {
    required T mobile,
    T? tablet,
    T? desktop,
  }) {
    final deviceType = getDeviceType(context);

    switch (deviceType) {
      case DeviceType.mobile:
        return mobile;
      case DeviceType.tablet:
        return tablet ?? mobile;
      case DeviceType.desktop:
      case DeviceType.largeDesktop:
        return desktop ?? tablet ?? mobile;
    }
  }
}

// Використання
Padding(
  padding: EdgeInsets.all(
    ResponsiveHelper.value(
      context,
      mobile: 8.0,
      tablet: 16.0,
      desktop: 24.0,
    ),
  ),
  child: Text('Адаптивний відступ'),
)
```

### Responsive віджет

```dart
class ResponsiveWidget extends StatelessWidget {
  final Widget mobile;
  final Widget? tablet;
  final Widget? desktop;

  const ResponsiveWidget({
    required this.mobile,
    this.tablet,
    this.desktop,
  });

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        if (constraints.maxWidth >= Breakpoints.desktop) {
          return desktop ?? tablet ?? mobile;
        } else if (constraints.maxWidth >= Breakpoints.tablet) {
          return tablet ?? mobile;
        } else {
          return mobile;
        }
      },
    );
  }
}

// Використання
ResponsiveWidget(
  mobile: MobileHomeScreen(),
  tablet: TabletHomeScreen(),
  desktop: DesktopHomeScreen(),
)
```

## Flex та Expanded

```dart
class FlexibleLayoutExample extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final isLandscape =
        MediaQuery.of(context).orientation == Orientation.landscape;

    return Flex(
      direction: isLandscape ? Axis.horizontal : Axis.vertical,
      children: [
        Flexible(
          flex: 1,
          child: Container(color: Colors.red, height: 100),
        ),
        Flexible(
          flex: 2,
          child: Container(color: Colors.green, height: 100),
        ),
        Flexible(
          flex: 1,
          child: Container(color: Colors.blue, height: 100),
        ),
      ],
    );
  }
}
```

## Adaptive Widgets

### Адаптивна навігація

```dart
class AdaptiveScaffold extends StatelessWidget {
  final Widget body;
  final int currentIndex;
  final Function(int) onNavigationChanged;

  const AdaptiveScaffold({
    required this.body,
    required this.currentIndex,
    required this.onNavigationChanged,
  });

  @override
  Widget build(BuildContext context) {
    final isDesktop = MediaQuery.of(context).size.width >= Breakpoints.desktop;

    if (isDesktop) {
      return Scaffold(
        body: Row(
          children: [
            NavigationRail(
              selectedIndex: currentIndex,
              onDestinationSelected: onNavigationChanged,
              labelType: NavigationRailLabelType.all,
              destinations: [
                NavigationRailDestination(
                  icon: Icon(Icons.home),
                  label: Text('Головна'),
                ),
                NavigationRailDestination(
                  icon: Icon(Icons.search),
                  label: Text('Пошук'),
                ),
                NavigationRailDestination(
                  icon: Icon(Icons.settings),
                  label: Text('Налаштування'),
                ),
              ],
            ),
            VerticalDivider(thickness: 1, width: 1),
            Expanded(child: body),
          ],
        ),
      );
    }

    return Scaffold(
      body: body,
      bottomNavigationBar: NavigationBar(
        selectedIndex: currentIndex,
        onDestinationSelected: onNavigationChanged,
        destinations: [
          NavigationDestination(
            icon: Icon(Icons.home),
            label: 'Головна',
          ),
          NavigationDestination(
            icon: Icon(Icons.search),
            label: 'Пошук',
          ),
          NavigationDestination(
            icon: Icon(Icons.settings),
            label: 'Налаштування',
          ),
        ],
      ),
    );
  }
}
```

### Адаптивний діалог

```dart
Future<void> showAdaptiveDialog(BuildContext context) async {
  final isDesktop = MediaQuery.of(context).size.width >= Breakpoints.tablet;

  if (isDesktop) {
    await showDialog(
      context: context,
      builder: (context) => Dialog(
        child: ConstrainedBox(
          constraints: BoxConstraints(maxWidth: 500, maxHeight: 400),
          child: _DialogContent(),
        ),
      ),
    );
  } else {
    await showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (context) => DraggableScrollableSheet(
        initialChildSize: 0.9,
        minChildSize: 0.5,
        maxChildSize: 0.95,
        expand: false,
        builder: (context, scrollController) => _DialogContent(),
      ),
    );
  }
}

class _DialogContent extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.all(16),
      child: Column(
        children: [
          Text('Адаптивний діалог'),
          Spacer(),
          ElevatedButton(
            onPressed: () => Navigator.pop(context),
            child: Text('Закрити'),
          ),
        ],
      ),
    );
  }
}
```

## Responsive Grid

```dart
class ResponsiveGrid extends StatelessWidget {
  final List<Widget> children;

  const ResponsiveGrid({required this.children});

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final crossAxisCount = _getCrossAxisCount(constraints.maxWidth);

        return GridView.builder(
          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: crossAxisCount,
            crossAxisSpacing: 16,
            mainAxisSpacing: 16,
            childAspectRatio: 1.5,
          ),
          itemCount: children.length,
          itemBuilder: (context, index) => children[index],
        );
      },
    );
  }

  int _getCrossAxisCount(double width) {
    if (width < 600) return 1;
    if (width < 900) return 2;
    if (width < 1200) return 3;
    return 4;
  }
}

// Або з Wrap для автоматичного розміщення
class ResponsiveWrap extends StatelessWidget {
  final List<Widget> children;
  final double itemWidth;

  const ResponsiveWrap({
    required this.children,
    this.itemWidth = 300,
  });

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: 16,
      runSpacing: 16,
      children: children.map((child) {
        return SizedBox(
          width: itemWidth,
          child: child,
        );
      }).toList(),
    );
  }
}
```

## FractionallySizedBox

```dart
// Розмір як відсоток від батька
FractionallySizedBox(
  widthFactor: 0.8, // 80% ширини
  heightFactor: 0.5, // 50% висоти
  child: Container(color: Colors.blue),
)

// Адаптивна ширина контенту
class MaxWidthContainer extends StatelessWidget {
  final Widget child;
  final double maxWidth;

  const MaxWidthContainer({
    required this.child,
    this.maxWidth = 1200,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: ConstrainedBox(
        constraints: BoxConstraints(maxWidth: maxWidth),
        child: child,
      ),
    );
  }
}
```

## AspectRatio

```dart
// Зберігає пропорції
AspectRatio(
  aspectRatio: 16 / 9,
  child: Container(
    color: Colors.blue,
    child: Center(child: Text('16:9')),
  ),
)

// Адаптивне відео
class ResponsiveVideo extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        // Менше співвідношення для мобільних
        final aspectRatio = constraints.maxWidth < 600 ? 4 / 3 : 16 / 9;

        return AspectRatio(
          aspectRatio: aspectRatio,
          child: Container(
            color: Colors.black,
            child: Center(
              child: Icon(Icons.play_arrow, color: Colors.white, size: 64),
            ),
          ),
        );
      },
    );
  }
}
```

## Орієнтація екрану

```dart
class OrientationExample extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return OrientationBuilder(
      builder: (context, orientation) {
        return GridView.count(
          crossAxisCount: orientation == Orientation.portrait ? 2 : 4,
          children: List.generate(8, (index) {
            return Card(
              child: Center(child: Text('Елемент $index')),
            );
          }),
        );
      },
    );
  }
}

// Блокування орієнтації
class PortraitOnlyScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // Встановити тільки портретну орієнтацію
    SystemChrome.setPreferredOrientations([
      DeviceOrientation.portraitUp,
      DeviceOrientation.portraitDown,
    ]);

    return Scaffold(
      body: Center(child: Text('Тільки портретна орієнтація')),
    );
  }
}
```

## Responsive Typography

```dart
class ResponsiveText extends StatelessWidget {
  final String text;
  final TextStyle? style;

  const ResponsiveText(this.text, {this.style});

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;

    // Базовий розмір шрифту залежно від ширини екрану
    double fontSize;
    if (screenWidth < 600) {
      fontSize = 14;
    } else if (screenWidth < 900) {
      fontSize = 16;
    } else {
      fontSize = 18;
    }

    return Text(
      text,
      style: (style ?? TextStyle()).copyWith(
        fontSize: fontSize,
      ),
    );
  }
}

// Клас для responsive text styles
class ResponsiveTextStyles {
  static TextStyle headline(BuildContext context) {
    final width = MediaQuery.of(context).size.width;
    return TextStyle(
      fontSize: width < 600 ? 24 : (width < 900 ? 32 : 40),
      fontWeight: FontWeight.bold,
    );
  }

  static TextStyle body(BuildContext context) {
    final width = MediaQuery.of(context).size.width;
    return TextStyle(
      fontSize: width < 600 ? 14 : (width < 900 ? 16 : 18),
    );
  }
}
```

## Platform-Specific UI

```dart
import 'dart:io' show Platform;
import 'package:flutter/foundation.dart' show kIsWeb;

class PlatformWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    if (kIsWeb) {
      return _buildWebUI();
    }

    if (Platform.isIOS) {
      return _buildIOSUI();
    }

    if (Platform.isAndroid) {
      return _buildAndroidUI();
    }

    if (Platform.isWindows || Platform.isMacOS || Platform.isLinux) {
      return _buildDesktopUI();
    }

    return _buildDefaultUI();
  }

  Widget _buildWebUI() => Text('Web UI');
  Widget _buildIOSUI() => Text('iOS UI');
  Widget _buildAndroidUI() => Text('Android UI');
  Widget _buildDesktopUI() => Text('Desktop UI');
  Widget _buildDefaultUI() => Text('Default UI');
}
```

## Найкращі практики

1. **Використовуйте LayoutBuilder** замість MediaQuery для локальних рішень.

2. **Створюйте систему breakpoints** — уніфікуйте точки переходу.

3. **Тестуйте на різних розмірах** — використовуйте Device Preview.

4. **Уникайте фіксованих розмірів** — використовуйте відносні значення.

5. **Враховуйте safe areas** — використовуйте SafeArea.

6. **Адаптуйте навігацію** — використовуйте NavigationRail для десктопу.

## Висновок

Адаптивний дизайн у Flutter вимагає комбінації різних інструментів: MediaQuery, LayoutBuilder, Flex віджетів та кастомних helper класів. Правильний підхід до responsive дизайну забезпечує оптимальний досвід користувача на всіх платформах та розмірах екранів.
