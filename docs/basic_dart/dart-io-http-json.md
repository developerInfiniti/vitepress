---
description: "Ввод-вывод, HTTP запросы и JSON в Dart: работа с файлами, сериализация и десериализация данных"
---

# IO, HTTP и JSON

## `dart:io`: файлы

```dart
import 'dart:io';

Future<void> main() async {
  final file = File('data.txt');
  await file.writeAsString('hello');
  final text = await file.readAsString();
  print(text);
}
```

## `dart:io`: HTTP клиент (низкоуровневый)

```dart
import 'dart:convert';
import 'dart:io';

Future<void> main() async {
  final client = HttpClient();
  final request = await client.getUrl(Uri.parse('https://example.com'));
  final response = await request.close();

  final body = await response.transform(utf8.decoder).join();
  print(body);

  client.close();
}
```

## `dart:convert`: JSON encode/decode

```dart
import 'dart:convert';

void main() {
  final jsonText = '{"id":1,"name":"Ada"}';
  final map = jsonDecode(jsonText) as Map<String, Object?>;
  final id = map['id'] as int;
  final name = map['name'] as String;

  final out = jsonEncode({'id': id, 'name': name});
  print(out);
}
```

## Модель + `fromJson` / `toJson`

```dart
class User {
  final int id;
  final String name;

  const User({required this.id, required this.name});

  factory User.fromJson(Map<String, Object?> json) {
    return User(
      id: json['id'] as int,
      name: json['name'] as String,
    );
  }

  Map<String, Object?> toJson() => {'id': id, 'name': name};
}
```

## Важные нюансы (часто на собеседовании)

- `jsonDecode` возвращает `dynamic`, поэтому обычно делают явный каст `as Map<String, Object?>`
- значения в `Map<String, Object?>` тоже `Object?`, их нужно приводить по типу
- если возможны `null`/отсутствующие поля, используйте `as T?`, `??` и проверки
