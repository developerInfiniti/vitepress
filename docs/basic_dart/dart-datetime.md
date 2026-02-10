# DateTime и Duration

## DateTime: создание

```dart
final now = DateTime.now();
final utcNow = DateTime.now().toUtc();
final dt = DateTime(2026, 2, 10, 12, 30);
```

## Duration

```dart
const d1 = Duration(seconds: 30);
const d2 = Duration(minutes: 5);
```

## Сложение/вычитание

```dart
final now = DateTime.now();
final inOneHour = now.add(const Duration(hours: 1));
final oneHourAgo = now.subtract(const Duration(hours: 1));
final diff = inOneHour.difference(now);
```

## Сравнение

```dart
final a = DateTime(2026, 1, 1);
final b = DateTime(2026, 2, 1);

final before = a.isBefore(b);
final after = a.isAfter(b);
final same = a.isAtSameMomentAs(b);
```

## Парсинг и ISO-строки

```dart
final dt = DateTime.parse('2026-02-10T12:30:00Z');
final iso = dt.toUtc().toIso8601String();
```

## Важные нюансы

- `DateTime` бывает local и UTC
- `DateTime.parse` зависит от формата строки, для API обычно используют ISO 8601
