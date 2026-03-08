---
description: "Custom painting во Flutter: CustomPainter, Canvas API, рисование фигур и графиков — кастомная графика"
---

# Кастомне малювання у Flutter

Flutter дозволяє створювати власну графіку за допомогою `CustomPainter`. Це потужний інструмент для малювання фігур, ліній, градієнтів та складних візуальних ефектів.

## CustomPaint та CustomPainter

### Базова структура

```dart
class MyCustomPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    // Тут відбувається малювання
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) {
    // Повертає true, якщо потрібно перемалювати
    return false;
  }
}

// Використання
CustomPaint(
  painter: MyCustomPainter(),
  size: Size(300, 300),
  child: Container(), // Опціонально
)
```

### Малювання базових фігур

```dart
class ShapesPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.blue
      ..strokeWidth = 3
      ..style = PaintingStyle.stroke; // або PaintingStyle.fill

    // Прямокутник
    canvas.drawRect(
      Rect.fromLTWH(10, 10, 100, 60),
      paint,
    );

    // Заокруглений прямокутник
    canvas.drawRRect(
      RRect.fromRectAndRadius(
        Rect.fromLTWH(120, 10, 100, 60),
        Radius.circular(15),
      ),
      paint..color = Colors.green,
    );

    // Коло
    canvas.drawCircle(
      Offset(60, 120),
      40,
      paint..color = Colors.red,
    );

    // Овал
    canvas.drawOval(
      Rect.fromLTWH(120, 80, 100, 60),
      paint..color = Colors.orange,
    );

    // Лінія
    canvas.drawLine(
      Offset(10, 180),
      Offset(220, 180),
      paint..color = Colors.purple,
    );

    // Точка
    canvas.drawPoints(
      PointMode.points,
      [Offset(50, 200), Offset(100, 200), Offset(150, 200)],
      paint
        ..color = Colors.black
        ..strokeWidth = 10
        ..strokeCap = StrokeCap.round,
    );
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
```

### Paint налаштування

```dart
class PaintConfigPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    // Заливка
    final fillPaint = Paint()
      ..color = Colors.blue
      ..style = PaintingStyle.fill;

    // Обводка
    final strokePaint = Paint()
      ..color = Colors.red
      ..style = PaintingStyle.stroke
      ..strokeWidth = 5
      ..strokeCap = StrokeCap.round // round, butt, square
      ..strokeJoin = StrokeJoin.round; // round, bevel, miter

    // З антиаліасингом
    final antiAliasPaint = Paint()
      ..color = Colors.green
      ..isAntiAlias = true;

    // Прозорість
    final transparentPaint = Paint()
      ..color = Colors.purple.withOpacity(0.5);

    // Режим змішування
    final blendPaint = Paint()
      ..color = Colors.orange
      ..blendMode = BlendMode.multiply;

    // Фільтр кольору
    final filterPaint = Paint()
      ..colorFilter = ColorFilter.mode(
        Colors.red,
        BlendMode.colorBurn,
      );

    // Маска
    final maskPaint = Paint()
      ..maskFilter = MaskFilter.blur(BlurStyle.normal, 5);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
```

## Path — складні фігури

```dart
class PathPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.blue
      ..style = PaintingStyle.stroke
      ..strokeWidth = 3;

    // Трикутник
    final trianglePath = Path()
      ..moveTo(size.width / 2, 20)
      ..lineTo(size.width - 20, 100)
      ..lineTo(20, 100)
      ..close();

    canvas.drawPath(trianglePath, paint);

    // Зірка
    final starPath = _createStarPath(
      center: Offset(size.width / 2, 180),
      points: 5,
      innerRadius: 20,
      outerRadius: 50,
    );

    canvas.drawPath(starPath, paint..style = PaintingStyle.fill..color = Colors.amber);

    // Крива Безьє
    final curvePath = Path()
      ..moveTo(20, 250)
      ..quadraticBezierTo(size.width / 2, 200, size.width - 20, 250);

    canvas.drawPath(curvePath, paint..style = PaintingStyle.stroke..color = Colors.green);

    // Кубічна крива Безьє
    final cubicPath = Path()
      ..moveTo(20, 300)
      ..cubicTo(80, 250, size.width - 80, 350, size.width - 20, 300);

    canvas.drawPath(cubicPath, paint..color = Colors.purple);

    // Дуга
    final arcPath = Path()
      ..arcTo(
        Rect.fromLTWH(50, 320, 100, 100),
        0, // startAngle в радіанах
        3.14, // sweepAngle в радіанах
        false,
      );

    canvas.drawPath(arcPath, paint..color = Colors.red);
  }

  Path _createStarPath({
    required Offset center,
    required int points,
    required double innerRadius,
    required double outerRadius,
  }) {
    final path = Path();
    final angle = (2 * 3.14159) / points;
    final halfAngle = angle / 2;

    path.moveTo(
      center.dx + outerRadius * cos(-3.14159 / 2),
      center.dy + outerRadius * sin(-3.14159 / 2),
    );

    for (int i = 0; i < points; i++) {
      // Зовнішня точка
      path.lineTo(
        center.dx + outerRadius * cos(-3.14159 / 2 + angle * i),
        center.dy + outerRadius * sin(-3.14159 / 2 + angle * i),
      );
      // Внутрішня точка
      path.lineTo(
        center.dx + innerRadius * cos(-3.14159 / 2 + angle * i + halfAngle),
        center.dy + innerRadius * sin(-3.14159 / 2 + angle * i + halfAngle),
      );
    }

    path.close();
    return path;
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
```

## Градієнти

```dart
class GradientPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    // Лінійний градієнт
    final linearGradient = LinearGradient(
      colors: [Colors.red, Colors.yellow, Colors.green],
      stops: [0.0, 0.5, 1.0],
    ).createShader(Rect.fromLTWH(0, 0, size.width, 80));

    canvas.drawRect(
      Rect.fromLTWH(10, 10, size.width - 20, 60),
      Paint()..shader = linearGradient,
    );

    // Радіальний градієнт
    final radialGradient = RadialGradient(
      colors: [Colors.blue, Colors.purple],
      center: Alignment.center,
      radius: 0.8,
    ).createShader(Rect.fromLTWH(10, 90, 150, 150));

    canvas.drawOval(
      Rect.fromLTWH(10, 90, 150, 150),
      Paint()..shader = radialGradient,
    );

    // Sweep градієнт
    final sweepGradient = SweepGradient(
      colors: [
        Colors.red,
        Colors.orange,
        Colors.yellow,
        Colors.green,
        Colors.blue,
        Colors.purple,
        Colors.red,
      ],
    ).createShader(Rect.fromLTWH(170, 90, 150, 150));

    canvas.drawOval(
      Rect.fromLTWH(170, 90, 150, 150),
      Paint()..shader = sweepGradient,
    );
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
```

## Текст

```dart
class TextPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final textSpan = TextSpan(
      text: 'Привіт, Flutter!',
      style: TextStyle(
        color: Colors.black,
        fontSize: 24,
        fontWeight: FontWeight.bold,
      ),
    );

    final textPainter = TextPainter(
      text: textSpan,
      textDirection: TextDirection.ltr,
      textAlign: TextAlign.center,
    );

    textPainter.layout(
      minWidth: 0,
      maxWidth: size.width,
    );

    final offset = Offset(
      (size.width - textPainter.width) / 2,
      (size.height - textPainter.height) / 2,
    );

    textPainter.paint(canvas, offset);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
```

## Зображення

```dart
class ImagePainter extends CustomPainter {
  final ui.Image image;

  ImagePainter(this.image);

  @override
  void paint(Canvas canvas, Size size) {
    // Просте малювання
    canvas.drawImage(image, Offset.zero, Paint());

    // З масштабуванням
    final srcRect = Rect.fromLTWH(
      0, 0,
      image.width.toDouble(),
      image.height.toDouble(),
    );
    final dstRect = Rect.fromLTWH(0, 0, size.width, size.height);

    canvas.drawImageRect(image, srcRect, dstRect, Paint());

    // З фільтром
    canvas.drawImageRect(
      image,
      srcRect,
      dstRect,
      Paint()..colorFilter = ColorFilter.mode(
        Colors.blue.withOpacity(0.3),
        BlendMode.colorBurn,
      ),
    );
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

// Завантаження зображення
Future<ui.Image> loadImage(String assetPath) async {
  final data = await rootBundle.load(assetPath);
  final codec = await ui.instantiateImageCodec(data.buffer.asUint8List());
  final frame = await codec.getNextFrame();
  return frame.image;
}
```

## Трансформації

```dart
class TransformPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.blue
      ..style = PaintingStyle.fill;

    // Збереження стану
    canvas.save();

    // Переміщення
    canvas.translate(size.width / 2, size.height / 2);

    // Обертання (в радіанах)
    canvas.rotate(0.5);

    // Масштабування
    canvas.scale(1.5, 1.0);

    // Малювання після трансформацій
    canvas.drawRect(
      Rect.fromCenter(center: Offset.zero, width: 50, height: 50),
      paint,
    );

    // Відновлення стану
    canvas.restore();

    // Матрична трансформація
    canvas.save();
    final matrix = Matrix4.identity()
      ..translate(100.0, 100.0)
      ..rotateZ(0.3)
      ..scale(2.0);

    canvas.transform(matrix.storage);
    canvas.drawCircle(Offset.zero, 20, paint..color = Colors.red);
    canvas.restore();
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
```

## Відсікання (Clipping)

```dart
class ClipPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    // Відсікання прямокутником
    canvas.save();
    canvas.clipRect(Rect.fromLTWH(20, 20, 100, 100));
    canvas.drawColor(Colors.blue, BlendMode.src);
    canvas.restore();

    // Відсікання колом (через path)
    canvas.save();
    final circlePath = Path()
      ..addOval(Rect.fromCircle(center: Offset(200, 70), radius: 50));
    canvas.clipPath(circlePath);
    canvas.drawColor(Colors.green, BlendMode.src);
    canvas.restore();

    // Відсікання заокругленим прямокутником
    canvas.save();
    canvas.clipRRect(
      RRect.fromRectAndRadius(
        Rect.fromLTWH(20, 140, 100, 100),
        Radius.circular(20),
      ),
    );
    canvas.drawColor(Colors.orange, BlendMode.src);
    canvas.restore();

    // Складний clip path
    canvas.save();
    final starPath = _createStarPath(
      center: Offset(200, 190),
      points: 5,
      innerRadius: 25,
      outerRadius: 50,
    );
    canvas.clipPath(starPath);
    canvas.drawColor(Colors.purple, BlendMode.src);
    canvas.restore();
  }

  Path _createStarPath({
    required Offset center,
    required int points,
    required double innerRadius,
    required double outerRadius,
  }) {
    // Реалізація з попереднього прикладу
    return Path();
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
```

## Анімація з CustomPainter

```dart
class AnimatedCirclePainter extends CustomPainter {
  final double progress; // 0.0 до 1.0

  AnimatedCirclePainter({required this.progress});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 3;

    // Фонове коло
    canvas.drawCircle(
      center,
      radius,
      Paint()
        ..color = Colors.grey.shade300
        ..style = PaintingStyle.stroke
        ..strokeWidth = 10,
    );

    // Анімоване коло (прогрес)
    final sweepAngle = 2 * 3.14159 * progress;

    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius),
      -3.14159 / 2, // Починаємо зверху
      sweepAngle,
      false,
      Paint()
        ..color = Colors.blue
        ..style = PaintingStyle.stroke
        ..strokeWidth = 10
        ..strokeCap = StrokeCap.round,
    );

    // Текст прогресу
    final textSpan = TextSpan(
      text: '${(progress * 100).toInt()}%',
      style: TextStyle(
        color: Colors.black,
        fontSize: 32,
        fontWeight: FontWeight.bold,
      ),
    );

    final textPainter = TextPainter(
      text: textSpan,
      textDirection: TextDirection.ltr,
    );

    textPainter.layout();
    textPainter.paint(
      canvas,
      Offset(
        center.dx - textPainter.width / 2,
        center.dy - textPainter.height / 2,
      ),
    );
  }

  @override
  bool shouldRepaint(covariant AnimatedCirclePainter oldDelegate) {
    return oldDelegate.progress != progress;
  }
}

// Використання з анімацією
class AnimatedProgressCircle extends StatefulWidget {
  @override
  _AnimatedProgressCircleState createState() => _AnimatedProgressCircleState();
}

class _AnimatedProgressCircleState extends State<AnimatedProgressCircle>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: Duration(seconds: 2),
      vsync: this,
    )..forward();
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
        return CustomPaint(
          painter: AnimatedCirclePainter(progress: _controller.value),
          size: Size(200, 200),
        );
      },
    );
  }
}
```

## Практичний приклад: Графік

```dart
class ChartPainter extends CustomPainter {
  final List<double> data;
  final Color lineColor;
  final Color fillColor;

  ChartPainter({
    required this.data,
    this.lineColor = Colors.blue,
    this.fillColor = Colors.blue,
  });

  @override
  void paint(Canvas canvas, Size size) {
    if (data.isEmpty) return;

    final maxValue = data.reduce((a, b) => a > b ? a : b);
    final minValue = data.reduce((a, b) => a < b ? a : b);
    final range = maxValue - minValue;

    final stepX = size.width / (data.length - 1);

    // Створення шляху для лінії
    final linePath = Path();
    final fillPath = Path();

    for (int i = 0; i < data.length; i++) {
      final x = i * stepX;
      final y = size.height - ((data[i] - minValue) / range * size.height);

      if (i == 0) {
        linePath.moveTo(x, y);
        fillPath.moveTo(x, size.height);
        fillPath.lineTo(x, y);
      } else {
        linePath.lineTo(x, y);
        fillPath.lineTo(x, y);
      }
    }

    // Заповнення під графіком
    fillPath.lineTo(size.width, size.height);
    fillPath.close();

    canvas.drawPath(
      fillPath,
      Paint()
        ..shader = LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [fillColor.withOpacity(0.4), fillColor.withOpacity(0.0)],
        ).createShader(Rect.fromLTWH(0, 0, size.width, size.height)),
    );

    // Лінія графіка
    canvas.drawPath(
      linePath,
      Paint()
        ..color = lineColor
        ..style = PaintingStyle.stroke
        ..strokeWidth = 3
        ..strokeCap = StrokeCap.round
        ..strokeJoin = StrokeJoin.round,
    );

    // Точки на графіку
    for (int i = 0; i < data.length; i++) {
      final x = i * stepX;
      final y = size.height - ((data[i] - minValue) / range * size.height);

      canvas.drawCircle(
        Offset(x, y),
        5,
        Paint()..color = lineColor,
      );
      canvas.drawCircle(
        Offset(x, y),
        3,
        Paint()..color = Colors.white,
      );
    }
  }

  @override
  bool shouldRepaint(covariant ChartPainter oldDelegate) {
    return oldDelegate.data != data;
  }
}

// Використання
CustomPaint(
  painter: ChartPainter(
    data: [10, 25, 15, 40, 30, 45, 35, 50],
    lineColor: Colors.blue,
    fillColor: Colors.blue,
  ),
  size: Size(300, 200),
)
```

## Найкращі практики

1. **Використовуйте shouldRepaint правильно** — повертайте true тільки коли дійсно потрібно перемалювати.

2. **Кешуйте Paint об'єкти** — створюйте їх один раз, якщо вони не змінюються.

3. **Використовуйте canvas.save() та restore()** — для ізоляції трансформацій.

4. **Уникайте важких обчислень у paint()** — виконуйте їх заздалегідь.

5. **Використовуйте RepaintBoundary** — для ізоляції перемальовування.

## Висновок

CustomPainter надає повний контроль над малюванням у Flutter. Від простих фігур до складних графіків та анімацій — все можна реалізувати за допомогою Canvas API. Головне — правильно оптимізувати перемальовування для забезпечення плавної роботи застосунку.
