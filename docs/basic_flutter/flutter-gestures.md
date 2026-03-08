---
description: "Жесты во Flutter: GestureDetector, drag, swipe, pinch — обработка пользовательских взаимодействий"
---

# Жести та обробка торкань у Flutter

Flutter надає потужну систему для обробки жестів та взаємодії користувача з екраном. Від простих натискань до складних мультитач-жестів — все можна реалізувати за допомогою вбудованих віджетів.

## GestureDetector

`GestureDetector` — основний віджет для обробки жестів.

### Базові жести

```dart
GestureDetector(
  // Натискання
  onTap: () {
    print('Натиснуто!');
  },
  onTapDown: (TapDownDetails details) {
    print('Палець опущено на: ${details.globalPosition}');
  },
  onTapUp: (TapUpDetails details) {
    print('Палець піднято');
  },
  onTapCancel: () {
    print('Натискання скасовано');
  },

  // Подвійне натискання
  onDoubleTap: () {
    print('Подвійне натискання!');
  },

  // Довге натискання
  onLongPress: () {
    print('Довге натискання!');
  },
  onLongPressStart: (LongPressStartDetails details) {
    print('Довге натискання почалось');
  },
  onLongPressEnd: (LongPressEndDetails details) {
    print('Довге натискання завершилось');
  },

  child: Container(
    width: 200,
    height: 200,
    color: Colors.blue,
    child: Center(child: Text('Торкніться мене')),
  ),
)
```

### Перетягування (Drag)

```dart
class DraggableBox extends StatefulWidget {
  @override
  _DraggableBoxState createState() => _DraggableBoxState();
}

class _DraggableBoxState extends State<DraggableBox> {
  Offset _position = Offset(100, 100);

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Positioned(
          left: _position.dx,
          top: _position.dy,
          child: GestureDetector(
            onPanStart: (DragStartDetails details) {
              print('Перетягування почалось');
            },
            onPanUpdate: (DragUpdateDetails details) {
              setState(() {
                _position += details.delta;
              });
            },
            onPanEnd: (DragEndDetails details) {
              print('Перетягування завершилось');
              print('Швидкість: ${details.velocity}');
            },
            child: Container(
              width: 100,
              height: 100,
              decoration: BoxDecoration(
                color: Colors.red,
                borderRadius: BorderRadius.circular(10),
              ),
              child: Center(child: Text('Перетягни')),
            ),
          ),
        ),
      ],
    );
  }
}
```

### Горизонтальне та вертикальне перетягування

```dart
GestureDetector(
  // Тільки горизонтальне
  onHorizontalDragStart: (details) {
    print('Горизонтальне перетягування почалось');
  },
  onHorizontalDragUpdate: (details) {
    print('Зміщення по X: ${details.delta.dx}');
  },
  onHorizontalDragEnd: (details) {
    print('Швидкість по X: ${details.velocity.pixelsPerSecond.dx}');
  },

  // Тільки вертикальне
  onVerticalDragStart: (details) {
    print('Вертикальне перетягування почалось');
  },
  onVerticalDragUpdate: (details) {
    print('Зміщення по Y: ${details.delta.dy}');
  },
  onVerticalDragEnd: (details) {
    print('Швидкість по Y: ${details.velocity.pixelsPerSecond.dy}');
  },

  child: Container(
    width: 200,
    height: 200,
    color: Colors.green,
  ),
)
```

### Масштабування (Scale/Pinch)

```dart
class ScalableWidget extends StatefulWidget {
  @override
  _ScalableWidgetState createState() => _ScalableWidgetState();
}

class _ScalableWidgetState extends State<ScalableWidget> {
  double _scale = 1.0;
  double _previousScale = 1.0;
  double _rotation = 0.0;
  double _previousRotation = 0.0;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onScaleStart: (ScaleStartDetails details) {
        _previousScale = _scale;
        _previousRotation = _rotation;
      },
      onScaleUpdate: (ScaleUpdateDetails details) {
        setState(() {
          _scale = _previousScale * details.scale;
          _rotation = _previousRotation + details.rotation;
        });
      },
      onScaleEnd: (ScaleEndDetails details) {
        print('Масштабування завершено');
      },
      child: Transform.scale(
        scale: _scale,
        child: Transform.rotate(
          angle: _rotation,
          child: Container(
            width: 200,
            height: 200,
            decoration: BoxDecoration(
              color: Colors.purple,
              borderRadius: BorderRadius.circular(20),
            ),
            child: Center(
              child: Text(
                'Масштаб: ${_scale.toStringAsFixed(2)}',
                style: TextStyle(color: Colors.white),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
```

## InkWell та InkResponse

Віджети з візуальним ефектом "чорнила" (Material Design).

```dart
// InkWell - прямокутний ефект
InkWell(
  onTap: () {
    print('InkWell натиснуто');
  },
  onDoubleTap: () {
    print('Подвійне натискання');
  },
  onLongPress: () {
    print('Довге натискання');
  },
  splashColor: Colors.blue.withOpacity(0.5),
  highlightColor: Colors.blue.withOpacity(0.3),
  borderRadius: BorderRadius.circular(10),
  child: Container(
    padding: EdgeInsets.all(16),
    child: Text('Натисни мене'),
  ),
)

// InkResponse - круглий ефект
InkResponse(
  onTap: () {},
  radius: 50,
  splashColor: Colors.red,
  child: Icon(Icons.favorite, size: 48),
)

// Кастомний splash
Material(
  color: Colors.transparent,
  child: InkWell(
    customBorder: CircleBorder(),
    splashFactory: InkRipple.splashFactory,
    onTap: () {},
    child: Container(
      width: 60,
      height: 60,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: Colors.blue,
      ),
      child: Icon(Icons.add, color: Colors.white),
    ),
  ),
)
```

## Draggable та DragTarget

Система drag-and-drop у Flutter.

### Базовий Draggable

```dart
class DragDropExample extends StatefulWidget {
  @override
  _DragDropExampleState createState() => _DragDropExampleState();
}

class _DragDropExampleState extends State<DragDropExample> {
  String _droppedItem = '';

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: [
        // Draggable елемент
        Draggable<String>(
          data: 'Синій квадрат',
          // Віджет під час перетягування
          feedback: Container(
            width: 100,
            height: 100,
            color: Colors.blue.withOpacity(0.7),
            child: Center(
              child: Text('Перетягую!', style: TextStyle(color: Colors.white)),
            ),
          ),
          // Віджет на місці після початку перетягування
          childWhenDragging: Container(
            width: 100,
            height: 100,
            color: Colors.grey,
            child: Center(child: Text('Було тут')),
          ),
          // Звичайний вигляд
          child: Container(
            width: 100,
            height: 100,
            color: Colors.blue,
            child: Center(
              child: Text('Перетягни', style: TextStyle(color: Colors.white)),
            ),
          ),
          onDragStarted: () {
            print('Перетягування почалось');
          },
          onDragEnd: (details) {
            print('Перетягування завершено: ${details.wasAccepted}');
          },
        ),

        // Ціль для drop
        DragTarget<String>(
          builder: (context, candidateData, rejectedData) {
            final isHovering = candidateData.isNotEmpty;
            return Container(
              width: 200,
              height: 200,
              decoration: BoxDecoration(
                color: isHovering ? Colors.green.shade200 : Colors.green,
                border: Border.all(
                  color: isHovering ? Colors.green.shade800 : Colors.green.shade600,
                  width: 3,
                ),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Center(
                child: Text(
                  _droppedItem.isEmpty ? 'Кинь сюди' : _droppedItem,
                  style: TextStyle(color: Colors.white, fontSize: 18),
                ),
              ),
            );
          },
          onWillAccept: (data) {
            // Чи приймати цей елемент?
            return data != null;
          },
          onAccept: (data) {
            setState(() {
              _droppedItem = data;
            });
          },
          onLeave: (data) {
            print('Елемент покинув зону');
          },
        ),
      ],
    );
  }
}
```

### LongPressDraggable

```dart
LongPressDraggable<String>(
  data: 'Довге натискання',
  delay: Duration(milliseconds: 500),
  feedback: Material(
    elevation: 4,
    child: Container(
      width: 100,
      height: 100,
      color: Colors.orange,
    ),
  ),
  child: Container(
    width: 100,
    height: 100,
    color: Colors.orange,
    child: Center(child: Text('Довго натисни')),
  ),
)
```

## Dismissible

Віджет для свайпу елементів (видалення, архівування тощо).

```dart
class DismissibleListExample extends StatefulWidget {
  @override
  _DismissibleListExampleState createState() => _DismissibleListExampleState();
}

class _DismissibleListExampleState extends State<DismissibleListExample> {
  List<String> items = List.generate(10, (i) => 'Елемент ${i + 1}');

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: items.length,
      itemBuilder: (context, index) {
        final item = items[index];
        return Dismissible(
          key: Key(item),
          // Напрямок свайпу
          direction: DismissDirection.horizontal,

          // Фон при свайпі вправо (видалення)
          background: Container(
            color: Colors.red,
            alignment: Alignment.centerLeft,
            padding: EdgeInsets.only(left: 20),
            child: Icon(Icons.delete, color: Colors.white),
          ),

          // Фон при свайпі вліво (архів)
          secondaryBackground: Container(
            color: Colors.green,
            alignment: Alignment.centerRight,
            padding: EdgeInsets.only(right: 20),
            child: Icon(Icons.archive, color: Colors.white),
          ),

          // Підтвердження видалення
          confirmDismiss: (direction) async {
            if (direction == DismissDirection.startToEnd) {
              // Свайп вправо - видалення
              return await showDialog(
                context: context,
                builder: (context) => AlertDialog(
                  title: Text('Видалити?'),
                  content: Text('Ви впевнені, що хочете видалити "$item"?'),
                  actions: [
                    TextButton(
                      onPressed: () => Navigator.pop(context, false),
                      child: Text('Скасувати'),
                    ),
                    TextButton(
                      onPressed: () => Navigator.pop(context, true),
                      child: Text('Видалити'),
                    ),
                  ],
                ),
              );
            } else {
              // Свайп вліво - архів (без підтвердження)
              return true;
            }
          },

          onDismissed: (direction) {
            setState(() {
              items.removeAt(index);
            });

            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(
                  direction == DismissDirection.startToEnd
                      ? '$item видалено'
                      : '$item заархівовано',
                ),
                action: SnackBarAction(
                  label: 'Відмінити',
                  onPressed: () {
                    setState(() {
                      items.insert(index, item);
                    });
                  },
                ),
              ),
            );
          },

          child: ListTile(
            title: Text(item),
            leading: Icon(Icons.drag_handle),
          ),
        );
      },
    );
  }
}
```

## ReorderableListView

Список з можливістю зміни порядку елементів.

```dart
class ReorderableExample extends StatefulWidget {
  @override
  _ReorderableExampleState createState() => _ReorderableExampleState();
}

class _ReorderableExampleState extends State<ReorderableExample> {
  List<String> items = List.generate(10, (i) => 'Елемент ${i + 1}');

  @override
  Widget build(BuildContext context) {
    return ReorderableListView.builder(
      itemCount: items.length,
      onReorder: (oldIndex, newIndex) {
        setState(() {
          if (newIndex > oldIndex) {
            newIndex -= 1;
          }
          final item = items.removeAt(oldIndex);
          items.insert(newIndex, item);
        });
      },
      itemBuilder: (context, index) {
        return ListTile(
          key: Key(items[index]),
          title: Text(items[index]),
          leading: Icon(Icons.drag_handle),
          trailing: ReorderableDragStartListener(
            index: index,
            child: Icon(Icons.drag_indicator),
          ),
        );
      },
      proxyDecorator: (child, index, animation) {
        return AnimatedBuilder(
          animation: animation,
          builder: (context, child) {
            final elevation = lerpDouble(0, 6, animation.value)!;
            return Material(
              elevation: elevation,
              shadowColor: Colors.black45,
              child: child,
            );
          },
          child: child,
        );
      },
    );
  }
}
```

## Listener

Низькорівневий віджет для обробки pointer events.

```dart
Listener(
  onPointerDown: (PointerDownEvent event) {
    print('Pointer down: ${event.position}');
    print('Buttons: ${event.buttons}');
    print('Pressure: ${event.pressure}');
  },
  onPointerMove: (PointerMoveEvent event) {
    print('Pointer move: ${event.delta}');
  },
  onPointerUp: (PointerUpEvent event) {
    print('Pointer up');
  },
  onPointerCancel: (PointerCancelEvent event) {
    print('Pointer cancel');
  },
  onPointerHover: (PointerHoverEvent event) {
    // Для миші
    print('Hover: ${event.position}');
  },
  onPointerSignal: (PointerSignalEvent event) {
    if (event is PointerScrollEvent) {
      print('Scroll: ${event.scrollDelta}');
    }
  },
  child: Container(
    width: 300,
    height: 300,
    color: Colors.amber,
  ),
)
```

## RawGestureDetector

Для створення власних розпізнавачів жестів.

```dart
class CustomGestureExample extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return RawGestureDetector(
      gestures: {
        // Власний розпізнавач для потрійного натискання
        SerialTapGestureRecognizer:
            GestureRecognizerFactoryWithHandlers<SerialTapGestureRecognizer>(
          () => SerialTapGestureRecognizer(),
          (SerialTapGestureRecognizer instance) {
            instance.onSerialTapDown = (SerialTapDownDetails details) {
              if (details.count == 3) {
                print('Потрійне натискання!');
              }
            };
          },
        ),
      },
      child: Container(
        width: 200,
        height: 200,
        color: Colors.teal,
        child: Center(child: Text('Потрійний тап')),
      ),
    );
  }
}
```

## InteractiveViewer

Віджет для масштабування та панорамування контенту.

```dart
InteractiveViewer(
  boundaryMargin: EdgeInsets.all(100),
  minScale: 0.5,
  maxScale: 4.0,
  scaleEnabled: true,
  panEnabled: true,
  constrained: false,
  onInteractionStart: (details) {
    print('Interaction started');
  },
  onInteractionUpdate: (details) {
    print('Scale: ${details.scale}');
  },
  onInteractionEnd: (details) {
    print('Interaction ended');
  },
  child: Image.network(
    'https://via.placeholder.com/1000',
    fit: BoxFit.contain,
  ),
)

// З трансформаційним контролером
class ControlledViewer extends StatefulWidget {
  @override
  _ControlledViewerState createState() => _ControlledViewerState();
}

class _ControlledViewerState extends State<ControlledViewer> {
  final TransformationController _controller = TransformationController();

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _resetZoom() {
    _controller.value = Matrix4.identity();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        ElevatedButton(
          onPressed: _resetZoom,
          child: Text('Скинути масштаб'),
        ),
        Expanded(
          child: InteractiveViewer(
            transformationController: _controller,
            child: Image.network('https://via.placeholder.com/1000'),
          ),
        ),
      ],
    );
  }
}
```

## Обробка жестів на рівні застосунку

```dart
// Виявлення свайпу назад (Android)
WillPopScope(
  onWillPop: () async {
    // Показати діалог підтвердження
    final shouldPop = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Вийти?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: Text('Ні'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            child: Text('Так'),
          ),
        ],
      ),
    );
    return shouldPop ?? false;
  },
  child: Scaffold(
    body: Center(child: Text('Натисніть назад')),
  ),
)

// Глобальна обробка жестів
class GestureWrapperApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        // Закрити клавіатуру при натисканні поза полем
        FocusScope.of(context).unfocus();
      },
      child: MaterialApp(
        home: HomeScreen(),
      ),
    );
  }
}
```

## Найкращі практики

1. **Використовуйте InkWell** для Material Design ефектів замість GestureDetector.

2. **Уникайте конфліктів жестів** — не розміщуйте кілька GestureDetector з однаковими жестами.

3. **Надавайте візуальний зворотний зв'язок** — користувач повинен бачити реакцію на свої дії.

4. **Використовуйте HitTestBehavior** для контролю області торкання.

5. **Тестуйте на реальних пристроях** — емулятори не передають усіх нюансів жестів.

## Висновок

Flutter надає комплексну систему для обробки жестів — від простих натискань до складних мультитач-взаємодій. Правильне використання цих інструментів дозволяє створювати інтуїтивні та приємні у використанні інтерфейси.
