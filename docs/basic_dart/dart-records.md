---
description: "Records в Dart 3: именованные и позиционные поля, деструктуризация — новый тип данных с примерами"
---

# Records

## Что такое record

Record — это “пачка” значений без создания класса. Может быть позиционным и/или именованным.

## Позиционный record

```dart
(int, String) user() => (1, 'Ada');

void main() {
  final u = user();
  final id = u.$1;
  final name = u.$2;
  print('$id $name');
}
```

## Именованный record

```dart
({int id, String name}) user() => (id: 1, name: 'Ada');

void main() {
  final u = user();
  print(u.id);
  print(u.name);
}
```

## Деструктуризация

```dart
({int id, String name}) user() => (id: 1, name: 'Ada');

void main() {
  final (:id, :name) = user();
  print('$id $name');
}
```

## Сравнение records

Records сравниваются по значениям.

```dart
void main() {
  final a = (1, 'x');
  final b = (1, 'x');
  print(a == b);
}
```

## Когда удобно

- вернуть из функции сразу несколько значений
- промежуточные результаты в пайплайнах
- локальные “DTO” без отдельного класса
