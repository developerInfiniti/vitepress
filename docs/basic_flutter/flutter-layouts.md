# Макети у Flutter: Організація віджетів на екрані

Віджети макетування у Flutter є ключем до створення структурованих та адаптивних інтерфейсів користувача. Вони визначають, як дочірні віджети розташовуються, вирівнюються та займають доступний простір на екрані.

## Основні віджети макетування

### 1. Row

Віджет `Row` розташовує своїх дочірніх віджетів **горизонтально**.

```dart
Row(
  mainAxisAlignment: MainAxisAlignment.spaceAround, // Розподіляє вільний простір між віджетами та навколо них
  crossAxisAlignment: CrossAxisAlignment.center, // Вирівнює віджети по вертикальній осі
  children: <Widget>[
    Text('Перший'),
    Text('Другий'),
    Icon(Icons.star),
  ],
)
```

**Основні властивості `Row`:**

* `mainAxisAlignment`: Визначає, як дочірні віджети розташовуються вздовж головної осі (горизонтальної). Можливі значення:
    * `MainAxisAlignment.start`: Розташовує віджети на початку ряду.
    * `MainAxisAlignment.end`: Розташовує віджети в кінці ряду.
    * `MainAxisAlignment.center`: Центрує віджети в ряду.
    * `MainAxisAlignment.spaceBetween`: Розподіляє вільний простір між віджетами.
    * `MainAxisAlignment.spaceAround`: Розподіляє вільний простір між віджетами та навколо них.
    * `MainAxisAlignment.spaceEvenly`: Розподіляє вільний простір рівномірно між віджетами, включаючи початок та кінець ряду.
* `crossAxisAlignment`: Визначає, як дочірні віджети розташовуються вздовж поперечної осі (вертикальної). Можливі значення:
    * `CrossAxisAlignment.start`: Вирівнює віджети по верхньому краю.
    * `CrossAxisAlignment.end`: Вирівнює віджети по нижньому краю.
    * `CrossAxisAlignment.center`: Центрує віджети по вертикалі.
    * `CrossAxisAlignment.stretch`: Розтягує віджети по всій висоті ряду.
    * `CrossAxisAlignment.baseline`: Вирівнює віджети по їх базовій лінії (текст).
* `textDirection`: Визначає напрямок тексту та порядок дочірніх віджетів (LTR - зліва направо, RTL - справа наліво).
* `verticalDirection`: Визначає порядок дочірніх віджетів по вертикальній осі (down - зверху вниз, up - знизу вгору).
* `mainAxisSize`: Визначає, скільки місця `Row` займає вздовж головної осі.
    * `MainAxisSize.max`: `Row` займає максимально доступний простір.
    * `MainAxisSize.min`: `Row` займає мінімально необхідний простір для розміщення дочірніх віджетів.

### 2. Column

Віджет `Column` розташовує своїх дочірніх віджетів **вертикально**.

```dart
Column(
  mainAxisAlignment: MainAxisAlignment.spaceAround, // Розподіляє вільний простір між віджетами та навколо них
  crossAxisAlignment: CrossAxisAlignment.start, // Вирівнює віджети по горизонтальній осі (зліва)
  children: <Widget>[
    Text('Перший'),
    Text('Другий'),
    Icon(Icons.star),
  ],
)
```

Властивості `Column` аналогічні властивостям `Row`, але `mainAxisAlignment` керує розташуванням по вертикалі, а `crossAxisAlignment` - по горизонталі. `mainAxisSize` також відноситься до вертикальної осі.

### 3. Stack

Віджет `Stack` розташовує своїх дочірніх віджетів **один над одним**. Порядок оголошення віджетів у списку `children` визначає порядок їх відображення (останній оголошений віджет відображається зверху). Позиціонування дочірніх віджетів можна контролювати за допомогою віджета `Positioned`.

```dart
Stack(
  children: <Widget>[
    Image.asset('assets/background.png'),
    Positioned(
      bottom: 20,
      right: 20,
      child: Text('Текст на зображенні', style: TextStyle(color: Colors.white)),
    ),
    Text('Ще один віджет зверху'),
  ],
)
```

**Основні властивості `Stack`:**

* `alignment`: Визначає початкове вирівнювання дочірніх віджетів, які не обгорнуті у `Positioned`. За замовчуванням `AlignmentDirectional.topStart`.
* `textDirection`: Визначає напрямок тексту, що може впливати на вирівнювання.
* `fit`: Визначає, як непозиціоновані дочірні віджети повинні адаптуватися до розміру `Stack`.
    * `StackFit.loose`: Дочірні віджети залишаються свого оригінального розміру.
    * `StackFit.expand`: Дочірні віджети розтягуються, щоб заповнити весь простір `Stack`.
    * `StackFit.passthrough`: Розмір `Stack` визначається найбільшим непозиціонованим дочірнім віджетом.

### 4. Expanded

Віджет `Expanded` може використовуватися лише як дочірній віджет `Row`, `Column` або `Flex`. Він змушує дочірній віджет **зайняти доступний простір** вздовж головної осі батьківського віджета. Ви можете використовувати властивість `flex` для визначення пропорцій розподілу простору між кількома `Expanded` віджетами.

```dart
Row(
  children: <Widget>[
    Expanded(
      flex: 2, // Займає 2/3 доступного простору
      child: Container(color: Colors.blue, height: 50),
    ),
    Expanded(
      flex: 1, // Займає 1/3 доступного простору
      child: Container(color: Colors.green, height: 50),
    ),
  ],
)
```

### 5. Flexible

Віджет `Flexible` також може використовуватися як дочірній віджет `Row`, `Column` або `Flex`. Він схожий на `Expanded`, але надає більше контролю над тим, як дочірній віджет використовує доступний простір за допомогою властивості `fit`.

```dart
Row(
  children: <Widget>[
    Flexible(
      flex: 2,
      fit: FlexFit.tight, // Дочірній віджет змушений заповнити доступний простір
      child: Container(color: Colors.red, height: 50),
    ),
    Flexible(
      flex: 1,
      fit: FlexFit.loose, // Дочірній віджет займає свій природний розмір, але може розширюватися
      child: Container(color: Colors.orange, height: 50),
    ),
  ],
)
```

**Властивості `Flexible`:**

* `flex`: Визначає коефіцієнт гнучкості, аналогічно `Expanded`.
* `fit`: Визначає, як дочірній віджет повинен використовувати доступний простір.
    * `FlexFit.tight`: Дочірній віджет змушений заповнити доступний простір вздовж головної осі.
    * `FlexFit.loose`: Дочірній віджет може мати свій природний розмір, але може розширюватися, якщо є більше доступного простору.

### 6. Center

Віджет `Center` просто **центрує** свій дочірній віджет як по горизонтальній, так і по вертикальній осі.

```dart
Center(
  child: Text('Я в центрі екрана!'),
)
```

### 7. Padding

Віджет `Padding` додає **відступи** навколо свого дочірнього віджета. Ви можете вказати різні відступи для кожної сторони.

```dart
Padding(
  padding: EdgeInsets.all(16.0), // Відступ з усіх боків у 16 пікселів
  child: Text('Текст з відступами'),
)

Padding(
  padding: EdgeInsets.only(left: 8.0, right: 24.0), // Відступи лише зліва та справа
  child: Icon(Icons.warning),
)
```

### 8. Align

Віджет `Align` дозволяє **вирівнювати** свій дочірній віджет у межах власного простору. Ви можете вказати точне вирівнювання за допомогою властивості `alignment`.

```dart
Container(
  width: 200,
  height: 100,
  color: Colors.grey[300],
  child: Align(
    alignment: Alignment.bottomRight, // Вирівнює дочірній віджет у нижньому правому куті
    child: Text('Внизу справа'),
  ),
)
```

### 9. SizedBox

Віджет `SizedBox` створює **віджет фіксованого розміру**. Він часто використовується для створення проміжків між іншими віджетами або для обмеження розміру дочірнього віджета.

```dart
Row(
  children: <Widget>[
    Text('Перший'),
    SizedBox(width: 20), // Проміжок у 20 пікселів по горизонталі
    Text('Другий'),
  ],
)

SizedBox(
  width: 100,
  height: 50,
  child: ElevatedButton(onPressed: () {}, child: Text('Кнопка фіксованого розміру')),
)
```

### 10. AspectRatio

Віджет `AspectRatio` намагається **відповідно до заданого співвідношення сторін** розмістити свій дочірній віджет.

```dart
AspectRatio(
  aspectRatio: 16 / 9, // Співвідношення сторін 16:9
  child: Image.network('[https://via.placeholder.com/300x169](https://via.placeholder.com/300x169)'),
)
```

### 11. ConstrainedBox

Віджет `ConstrainedBox` накладає **обмеження** на розмір свого дочірнього віджета.

```dart
ConstrainedBox(
  constraints: BoxConstraints(minWidth: 150, maxWidth: 200, minHeight: 80, maxHeight: 120),
  child: Container(color: Colors.yellow, child: Text('Контейнер з обмеженнями')),
)
```

### 12. OverflowBox

Віджет `OverflowBox` дозволяє своєму дочірньому віджету **виходити за межі** власного розміру.

```dart
OverflowBox(
  maxWidth: 200,
  maxHeight: 100,
  child: Container(width: 300, height: 150, color: Colors.purple, child: Text('Переповнення')),
)
```

### 13. IntrinsicWidth та IntrinsicHeight

Ці віджети намагаються зробити свій розмір рівним **максимальній внутрішній ширині або висоті** своїх дочірніх віджетів.

```dart
IntrinsicWidth(
  child: Column(
    crossAxisAlignment: CrossAxisAlignment.stretch,
    children: <Widget>[
      Container(color: Colors.red, height: 50, child: Text('Довгий текст')),
      Container(color: Colors.blue, height: 30, child: Text('Короткий')),
    ],
  ),
)
```

### 14. SingleChildScrollView

Віджет `SingleChildScrollView` робить свій дочірній віджет **прокручуваним**, якщо він переповнює доступний простір.

```dart
SingleChildScrollView(
  child: Column(
    children: List.generate(50, (index) => Text('Елемент $index')),
  ),
)
```

### 15. ListView

Віджет `ListView` відображає **прокручуваний список** своїх дочірніх віджетів. Він ефективно будує лише ті елементи, які видимі на екрані.

```dart
ListView(
  children: List.generate(20, (index) => ListTile(title: Text('Елемент $index'))),
)

// ListView.builder для динамічних списків
ListView.builder(
  itemCount: 100,
  itemBuilder: (context, index) {
    return ListTile(title: Text('Елемент $index'));
  },
)
```

### 16. GridView

Віджет `GridView` відображає свої дочірні віджети у вигляді **двовимірної сітки**, що прокручується.

```dart
GridView.count(
  crossAxisCount: 2, // Кількість стовпців у сітці
  children: List.generate(12, (index) => Container(color: Colors.green[100 * (index % 9)], child: Center(child: Text('Елемент $index')))),
)

// GridView.builder для більш гнучкого керування сіткою
GridView.builder(
  gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 3),
  itemCount: 20,
  itemBuilder: (context, index) {
    return Container(color: Colors.blue[100 * (index % 9)], child: Center(child: Text('Елемент $index')));
  },
)
```

## Комбінування віджетів макетування

Найчастіше ви будете використовувати комбінацію різних віджетів макетування для досягнення бажаного UI. Наприклад, ви можете використовувати `Column` для вертикального розташування елементів, а всередині нього використовувати `Row` для горизонтального розташування підлеглих елементів.

```dart
Column(
  children: <Widget>[
    AppBar(title: Text('Мій додаток')),
    Expanded(
      child: Row(
        children: <Widget>[
          Expanded(child: Container(color: Colors.grey[200], child: Center(child: Text('Ліва панель')))),
          Expanded(flex: 2, child: Center(child: Text('Основний контент'))),
        ],
      ),
    ),
    BottomNavigationBar(items: [
      BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Головна'),
      BottomNavigationBarItem(icon: Icon(Icons.settings), label: 'Налаштування'),
    ]),
  ],
)
```

## Адаптивні макети

Для створення адаптивних макетів, які добре виглядають на різних розмірах екранів, ви можете використовувати:

* `MediaQuery`: Отримує інформацію про розміри екрана, орієнтацію тощо.
* `LayoutBuilder`: Дозволяє будувати UI на основі розмірів батьківського віджета.
* Спеціалізовані віджети для адаптивного макетування (наприклад, `MediaQuery.of(context).size.width > 600 ? WideLayout() : NarrowLayout()`).

Розуміння та вміле використання віджетів макетування є фундаментальним для розробки UI у Flutter. Експериментуйте з різними віджетами та їх властивостями, щоб створювати гнучкі та привабливі інтерфейси.