# Операторы

## Арифметика

```dart
final a = 10;
final b = 3;

final sum = a + b;
final diff = a - b;
final mul = a * b;
final div = a / b;
final intDiv = a ~/ b;
final mod = a % b;
```

## Сравнение и логика

```dart
final x = 5;

final eq = x == 5;
final ne = x != 5;
final lt = x < 10;
final le = x <= 10;
final gt = x > 1;
final ge = x >= 1;

final ok = (x > 0) && (x < 10);
final bad = (x < 0) || (x > 100);
final neg = !ok;
```

## Присваивание

```dart
var n = 1;
n += 2;
n -= 1;
n *= 10;
n ~/= 3;
n %= 4;
```

## Инкремент/декремент

```dart
var i = 0;
i++;
++i;
i--;
--i;
```

## Побитовые операции

```dart
final a = 0b1100;
final b = 0b1010;

final and = a & b;
final or = a | b;
final xor = a ^ b;
final not = ~a;
final shl = a << 2;
final shr = a >> 1;
```

## Условный оператор `?:`

```dart
String label(int n) => n.isEven ? 'even' : 'odd';
```

## Каскад `..`

```dart
final buffer = StringBuffer()
  ..write('a')
  ..write('b')
  ..write('c');
```

## Null-aware операторы

```dart
String? input;
final len = input?.length;
final value = input ?? 'default';
input ??= 'assigned';
final sure = input!;
```

## `is`, `is!`, `as`

```dart
Object value = 'hello';

final ok = value is String;
final no = value is! int;

final s = value as String;
```
