# Enum, sealed и ADT-подход (Dart 3)

## Enum

```dart
enum Status {
  idle,
  loading,
  success,
  error,
}
```

```dart
String label(Status s) {
  switch (s) {
    case Status.idle:
      return 'idle';
    case Status.loading:
      return 'loading';
    case Status.success:
      return 'success';
    case Status.error:
      return 'error';
  }
}
```

## Sealed классы (исчерпывающие варианты)

```dart
sealed class Result<T> {}

final class Ok<T> extends Result<T> {
  final T value;
  Ok(this.value);
}

final class Err<T> extends Result<T> {
  final Object error;
  Err(this.error);
}
```

## Pattern matching со sealed

```dart
String describe(Result<int> r) {
  return switch (r) {
    Ok(value: final v) => 'ok=$v',
    Err(error: final e) => 'err=$e',
  };
}
```

## Когда это использовать

- результат операции: success/error
- состояние экрана: loading/data/empty/error
- события в приложении (event types)
