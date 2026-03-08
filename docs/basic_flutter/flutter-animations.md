---
description: "Анимации во Flutter: implicit, explicit, Tween, AnimationController — создание плавных UI переходов"
---

# Анімації у Flutter

Flutter надає потужний та гнучкий інструментарій для створення плавних та красивих анімацій. Анімації можуть значно покращити досвід користувача, роблячи інтерфейс більш інтуїтивним та приємним.

## Основні концепції анімацій

### Animation Controller

`AnimationController` — це основний клас для керування анімаціями. Він контролює тривалість, напрямок та швидкість анімації.

```dart
class _MyAnimatedWidgetState extends State<MyAnimatedWidget>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container();
  }
}
```

### Tween

`Tween` визначає діапазон значень для анімації. Він інтерполює значення між початковою та кінцевою точками.

```dart
// Анімація числових значень
final Tween<double> _sizeTween = Tween<double>(begin: 50.0, end: 200.0);

// Анімація кольорів
final ColorTween _colorTween = ColorTween(begin: Colors.red, end: Colors.blue);

// Анімація зміщення
final Tween<Offset> _offsetTween = Tween<Offset>(
  begin: Offset.zero,
  end: const Offset(1.5, 0.0),
);
```

### Curves

`Curves` визначають, як змінюється швидкість анімації протягом часу.

```dart
// Лінійна анімація
CurvedAnimation(parent: _controller, curve: Curves.linear);

// Повільний старт, швидкий кінець
CurvedAnimation(parent: _controller, curve: Curves.easeIn);

// Швидкий старт, повільний кінець
CurvedAnimation(parent: _controller, curve: Curves.easeOut);

// Повільний старт і кінець
CurvedAnimation(parent: _controller, curve: Curves.easeInOut);

// Пружинний ефект
CurvedAnimation(parent: _controller, curve: Curves.elasticIn);

// Стрибок
CurvedAnimation(parent: _controller, curve: Curves.bounceOut);
```

## Неявні анімації (Implicit Animations)

Неявні анімації — це найпростіший спосіб додати анімацію. Flutter автоматично анімує зміни властивостей.

### AnimatedContainer

```dart
class AnimatedContainerExample extends StatefulWidget {
  @override
  _AnimatedContainerExampleState createState() => _AnimatedContainerExampleState();
}

class _AnimatedContainerExampleState extends State<AnimatedContainerExample> {
  bool _isExpanded = false;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        setState(() {
          _isExpanded = !_isExpanded;
        });
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 500),
        curve: Curves.easeInOut,
        width: _isExpanded ? 200.0 : 100.0,
        height: _isExpanded ? 200.0 : 100.0,
        color: _isExpanded ? Colors.blue : Colors.red,
        child: Center(child: Text('Натисни мене')),
      ),
    );
  }
}
```

### AnimatedOpacity

```dart
AnimatedOpacity(
  opacity: _isVisible ? 1.0 : 0.0,
  duration: const Duration(milliseconds: 500),
  child: Container(
    width: 100,
    height: 100,
    color: Colors.green,
  ),
)
```

### AnimatedPositioned

```dart
Stack(
  children: [
    AnimatedPositioned(
      duration: const Duration(milliseconds: 500),
      left: _isMoved ? 100.0 : 0.0,
      top: _isMoved ? 100.0 : 0.0,
      child: Container(
        width: 50,
        height: 50,
        color: Colors.purple,
      ),
    ),
  ],
)
```

### AnimatedPadding

```dart
AnimatedPadding(
  padding: EdgeInsets.all(_isPadded ? 50.0 : 10.0),
  duration: const Duration(milliseconds: 500),
  child: Container(color: Colors.orange),
)
```

### AnimatedAlign

```dart
AnimatedAlign(
  alignment: _isAligned ? Alignment.topRight : Alignment.bottomLeft,
  duration: const Duration(milliseconds: 500),
  child: Container(
    width: 50,
    height: 50,
    color: Colors.teal,
  ),
)
```

### AnimatedDefaultTextStyle

```dart
AnimatedDefaultTextStyle(
  style: _isBold
      ? TextStyle(fontSize: 30, fontWeight: FontWeight.bold, color: Colors.black)
      : TextStyle(fontSize: 16, fontWeight: FontWeight.normal, color: Colors.grey),
  duration: const Duration(milliseconds: 500),
  child: Text('Анімований текст'),
)
```

### AnimatedCrossFade

```dart
AnimatedCrossFade(
  duration: const Duration(milliseconds: 500),
  firstChild: Container(
    width: 100,
    height: 100,
    color: Colors.red,
    child: Center(child: Text('Перший')),
  ),
  secondChild: Container(
    width: 100,
    height: 100,
    color: Colors.blue,
    child: Center(child: Text('Другий')),
  ),
  crossFadeState: _showFirst
      ? CrossFadeState.showFirst
      : CrossFadeState.showSecond,
)
```

## Явні анімації (Explicit Animations)

Явні анімації надають більше контролю над процесом анімації.

### Базова явна анімація

```dart
class ExplicitAnimationExample extends StatefulWidget {
  @override
  _ExplicitAnimationExampleState createState() => _ExplicitAnimationExampleState();
}

class _ExplicitAnimationExampleState extends State<ExplicitAnimationExample>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    );

    _animation = Tween<double>(begin: 0, end: 300).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    )..addListener(() {
      setState(() {});
    });

    _controller.forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      width: _animation.value,
      height: _animation.value,
      color: Colors.blue,
    );
  }
}
```

### AnimatedBuilder

`AnimatedBuilder` оптимізує перемальовування, оновлюючи тільки анімовану частину UI.

```dart
class AnimatedBuilderExample extends StatefulWidget {
  @override
  _AnimatedBuilderExampleState createState() => _AnimatedBuilderExampleState();
}

class _AnimatedBuilderExampleState extends State<AnimatedBuilderExample>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    )..repeat(reverse: true);

    _animation = Tween<double>(begin: 0, end: 2 * 3.14159).animate(_controller);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _animation,
      builder: (context, child) {
        return Transform.rotate(
          angle: _animation.value,
          child: child,
        );
      },
      child: Container(
        width: 100,
        height: 100,
        color: Colors.red,
        child: Center(child: Text('Обертання')),
      ),
    );
  }
}
```

### Кілька анімацій одночасно

```dart
class MultipleAnimationsExample extends StatefulWidget {
  @override
  _MultipleAnimationsExampleState createState() => _MultipleAnimationsExampleState();
}

class _MultipleAnimationsExampleState extends State<MultipleAnimationsExample>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _sizeAnimation;
  late Animation<Color?> _colorAnimation;
  late Animation<double> _rotationAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    )..repeat(reverse: true);

    _sizeAnimation = Tween<double>(begin: 50, end: 150).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );

    _colorAnimation = ColorTween(begin: Colors.red, end: Colors.blue).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );

    _rotationAnimation = Tween<double>(begin: 0, end: 2 * 3.14159).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Transform.rotate(
          angle: _rotationAnimation.value,
          child: Container(
            width: _sizeAnimation.value,
            height: _sizeAnimation.value,
            color: _colorAnimation.value,
          ),
        );
      },
    );
  }
}
```

## Переходи між сторінками

### Hero Animation

Hero-анімація створює плавний перехід елемента між двома екранами.

```dart
// Перший екран
class FirstScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Перший екран')),
      body: GestureDetector(
        onTap: () {
          Navigator.push(context, MaterialPageRoute(
            builder: (context) => SecondScreen(),
          ));
        },
        child: Hero(
          tag: 'hero-image',
          child: Image.network(
            'https://via.placeholder.com/100',
            width: 100,
            height: 100,
          ),
        ),
      ),
    );
  }
}

// Другий екран
class SecondScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Другий екран')),
      body: Center(
        child: Hero(
          tag: 'hero-image',
          child: Image.network(
            'https://via.placeholder.com/300',
            width: 300,
            height: 300,
          ),
        ),
      ),
    );
  }
}
```

### Власні переходи сторінок

```dart
Navigator.push(
  context,
  PageRouteBuilder(
    pageBuilder: (context, animation, secondaryAnimation) => SecondScreen(),
    transitionsBuilder: (context, animation, secondaryAnimation, child) {
      const begin = Offset(1.0, 0.0);
      const end = Offset.zero;
      const curve = Curves.easeInOut;

      var tween = Tween(begin: begin, end: end).chain(CurveTween(curve: curve));
      var offsetAnimation = animation.drive(tween);

      return SlideTransition(
        position: offsetAnimation,
        child: child,
      );
    },
    transitionDuration: const Duration(milliseconds: 500),
  ),
);
```

## Анімовані списки

### AnimatedList

```dart
class AnimatedListExample extends StatefulWidget {
  @override
  _AnimatedListExampleState createState() => _AnimatedListExampleState();
}

class _AnimatedListExampleState extends State<AnimatedListExample> {
  final GlobalKey<AnimatedListState> _listKey = GlobalKey<AnimatedListState>();
  final List<String> _items = ['Елемент 1', 'Елемент 2', 'Елемент 3'];

  void _addItem() {
    final int index = _items.length;
    _items.add('Елемент ${index + 1}');
    _listKey.currentState?.insertItem(index);
  }

  void _removeItem(int index) {
    final String removedItem = _items.removeAt(index);
    _listKey.currentState?.removeItem(
      index,
      (context, animation) => _buildItem(removedItem, animation),
    );
  }

  Widget _buildItem(String item, Animation<double> animation) {
    return SizeTransition(
      sizeFactor: animation,
      child: ListTile(
        title: Text(item),
        trailing: IconButton(
          icon: Icon(Icons.delete),
          onPressed: () => _removeItem(_items.indexOf(item)),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Анімований список')),
      body: AnimatedList(
        key: _listKey,
        initialItemCount: _items.length,
        itemBuilder: (context, index, animation) {
          return _buildItem(_items[index], animation);
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _addItem,
        child: Icon(Icons.add),
      ),
    );
  }
}
```

## Staggered анімації

Staggered анімації — це послідовні анімації, де кожна частина починається з затримкою.

```dart
class StaggeredAnimationExample extends StatefulWidget {
  @override
  _StaggeredAnimationExampleState createState() => _StaggeredAnimationExampleState();
}

class _StaggeredAnimationExampleState extends State<StaggeredAnimationExample>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _opacity;
  late Animation<double> _width;
  late Animation<double> _height;
  late Animation<EdgeInsets> _padding;
  late Animation<BorderRadius?> _borderRadius;
  late Animation<Color?> _color;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 2000),
      vsync: this,
    );

    _opacity = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Interval(0.0, 0.100, curve: Curves.ease),
      ),
    );

    _width = Tween<double>(begin: 50.0, end: 150.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Interval(0.125, 0.250, curve: Curves.ease),
      ),
    );

    _height = Tween<double>(begin: 50.0, end: 150.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Interval(0.250, 0.375, curve: Curves.ease),
      ),
    );

    _padding = EdgeInsetsTween(
      begin: const EdgeInsets.only(bottom: 16.0),
      end: const EdgeInsets.only(bottom: 75.0),
    ).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Interval(0.250, 0.375, curve: Curves.ease),
      ),
    );

    _borderRadius = BorderRadiusTween(
      begin: BorderRadius.circular(4.0),
      end: BorderRadius.circular(75.0),
    ).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Interval(0.375, 0.500, curve: Curves.ease),
      ),
    );

    _color = ColorTween(begin: Colors.indigo[100], end: Colors.orange[400]).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Interval(0.500, 0.750, curve: Curves.ease),
      ),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Future<void> _playAnimation() async {
    try {
      await _controller.forward().orCancel;
      await _controller.reverse().orCancel;
    } on TickerCanceled {
      // Анімацію було скасовано
    }
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: _playAnimation,
      child: Center(
        child: AnimatedBuilder(
          animation: _controller,
          builder: (context, child) {
            return Container(
              padding: _padding.value,
              alignment: Alignment.bottomCenter,
              child: Opacity(
                opacity: _opacity.value,
                child: Container(
                  width: _width.value,
                  height: _height.value,
                  decoration: BoxDecoration(
                    color: _color.value,
                    borderRadius: _borderRadius.value,
                  ),
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}
```

## Rive та Lottie анімації

### Lottie

Lottie дозволяє використовувати анімації, створені в Adobe After Effects.

```dart
// pubspec.yaml
// dependencies:
//   lottie: ^2.0.0

import 'package:lottie/lottie.dart';

class LottieExample extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Lottie.asset(
          'assets/animations/loading.json',
          width: 200,
          height: 200,
          fit: BoxFit.fill,
        ),
      ),
    );
  }
}
```

### Керування Lottie анімацією

```dart
class ControlledLottieExample extends StatefulWidget {
  @override
  _ControlledLottieExampleState createState() => _ControlledLottieExampleState();
}

class _ControlledLottieExampleState extends State<ControlledLottieExample>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        if (_controller.isAnimating) {
          _controller.stop();
        } else {
          _controller.repeat();
        }
      },
      child: Lottie.asset(
        'assets/animations/animation.json',
        controller: _controller,
        onLoaded: (composition) {
          _controller.duration = composition.duration;
        },
      ),
    );
  }
}
```

## Фізичні анімації

### Spring анімація

```dart
class SpringAnimationExample extends StatefulWidget {
  @override
  _SpringAnimationExampleState createState() => _SpringAnimationExampleState();
}

class _SpringAnimationExampleState extends State<SpringAnimationExample>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 1),
    );

    final spring = SpringDescription(
      mass: 1,
      stiffness: 100,
      damping: 10,
    );

    final simulation = SpringSimulation(spring, 0, 1, 0);

    _controller.animateWith(simulation);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Transform.scale(
          scale: _controller.value,
          child: child,
        );
      },
      child: Container(
        width: 100,
        height: 100,
        color: Colors.blue,
      ),
    );
  }
}
```

## Найкращі практики

1. **Використовуйте неявні анімації** для простих випадків — вони простіші та менш схильні до помилок.

2. **Завжди звільняйте контролери** у методі `dispose()` для запобігання витоків пам'яті.

3. **Використовуйте AnimatedBuilder** замість `addListener` + `setState` для кращої продуктивності.

4. **Обмежуйте кількість одночасних анімацій** — занадто багато анімацій можуть сповільнити застосунок.

5. **Тестуйте анімації на реальних пристроях** — емулятори можуть показувати іншу продуктивність.

6. **Використовуйте `vsync`** для синхронізації з частотою оновлення екрану.

## Висновок

Анімації у Flutter є потужним інструментом для покращення користувацького досвіду. Від простих неявних анімацій до складних staggered та фізичних анімацій — Flutter надає все необхідне для створення привабливих та плавних інтерфейсів. Експериментуйте з різними типами анімацій та знаходьте найкращі рішення для вашого застосунку.
