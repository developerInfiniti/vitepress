# Форми у Flutter

Форми є важливою частиною багатьох застосунків. Flutter надає потужні інструменти для створення форм, валідації даних та обробки введення користувача.

## Базові елементи форм

### TextField

`TextField` — це основний віджет для введення тексту.

```dart
class BasicTextFieldExample extends StatefulWidget {
  @override
  _BasicTextFieldExampleState createState() => _BasicTextFieldExampleState();
}

class _BasicTextFieldExampleState extends State<BasicTextFieldExample> {
  final TextEditingController _controller = TextEditingController();

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return TextField(
      controller: _controller,
      decoration: InputDecoration(
        labelText: 'Введіть ваше ім\'я',
        hintText: 'Наприклад: Іван',
        prefixIcon: Icon(Icons.person),
        border: OutlineInputBorder(),
      ),
      onChanged: (value) {
        print('Поточне значення: $value');
      },
      onSubmitted: (value) {
        print('Введено: $value');
      },
    );
  }
}
```

### Різні типи TextField

```dart
// Поле для паролю
TextField(
  obscureText: true,
  decoration: InputDecoration(
    labelText: 'Пароль',
    prefixIcon: Icon(Icons.lock),
    suffixIcon: IconButton(
      icon: Icon(Icons.visibility),
      onPressed: () {
        // Перемикання видимості паролю
      },
    ),
  ),
)

// Поле для електронної пошти
TextField(
  keyboardType: TextInputType.emailAddress,
  decoration: InputDecoration(
    labelText: 'Email',
    prefixIcon: Icon(Icons.email),
  ),
)

// Поле для телефону
TextField(
  keyboardType: TextInputType.phone,
  decoration: InputDecoration(
    labelText: 'Телефон',
    prefixIcon: Icon(Icons.phone),
  ),
)

// Багаторядкове поле
TextField(
  maxLines: 5,
  decoration: InputDecoration(
    labelText: 'Опис',
    alignLabelWithHint: true,
    border: OutlineInputBorder(),
  ),
)

// Поле з обмеженням символів
TextField(
  maxLength: 100,
  decoration: InputDecoration(
    labelText: 'Коментар',
    counterText: '', // Приховати лічильник
  ),
)
```

## Віджет Form

`Form` групує декілька полів введення та забезпечує їх валідацію.

### Базова форма

```dart
class BasicFormExample extends StatefulWidget {
  @override
  _BasicFormExampleState createState() => _BasicFormExampleState();
}

class _BasicFormExampleState extends State<BasicFormExample> {
  final _formKey = GlobalKey<FormState>();
  String _name = '';
  String _email = '';

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: Column(
        children: [
          TextFormField(
            decoration: InputDecoration(labelText: 'Ім\'я'),
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Будь ласка, введіть ім\'я';
              }
              return null;
            },
            onSaved: (value) {
              _name = value!;
            },
          ),
          SizedBox(height: 16),
          TextFormField(
            decoration: InputDecoration(labelText: 'Email'),
            keyboardType: TextInputType.emailAddress,
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Будь ласка, введіть email';
              }
              if (!value.contains('@')) {
                return 'Введіть коректний email';
              }
              return null;
            },
            onSaved: (value) {
              _email = value!;
            },
          ),
          SizedBox(height: 24),
          ElevatedButton(
            onPressed: () {
              if (_formKey.currentState!.validate()) {
                _formKey.currentState!.save();
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('Дані збережено: $_name, $_email')),
                );
              }
            },
            child: Text('Надіслати'),
          ),
        ],
      ),
    );
  }
}
```

## Валідація форм

### Різні типи валідації

```dart
class ValidationExamples extends StatelessWidget {
  // Валідація email
  String? validateEmail(String? value) {
    if (value == null || value.isEmpty) {
      return 'Email обов\'язковий';
    }
    final emailRegex = RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');
    if (!emailRegex.hasMatch(value)) {
      return 'Введіть коректний email';
    }
    return null;
  }

  // Валідація паролю
  String? validatePassword(String? value) {
    if (value == null || value.isEmpty) {
      return 'Пароль обов\'язковий';
    }
    if (value.length < 8) {
      return 'Пароль повинен містити мінімум 8 символів';
    }
    if (!value.contains(RegExp(r'[A-Z]'))) {
      return 'Пароль повинен містити велику літеру';
    }
    if (!value.contains(RegExp(r'[0-9]'))) {
      return 'Пароль повинен містити цифру';
    }
    return null;
  }

  // Валідація телефону
  String? validatePhone(String? value) {
    if (value == null || value.isEmpty) {
      return 'Телефон обов\'язковий';
    }
    final phoneRegex = RegExp(r'^\+?[0-9]{10,13}$');
    if (!phoneRegex.hasMatch(value)) {
      return 'Введіть коректний номер телефону';
    }
    return null;
  }

  // Підтвердження паролю
  String? validateConfirmPassword(String? value, String password) {
    if (value != password) {
      return 'Паролі не співпадають';
    }
    return null;
  }

  @override
  Widget build(BuildContext context) {
    return Container();
  }
}
```

### Валідація в реальному часі

```dart
class RealTimeValidationExample extends StatefulWidget {
  @override
  _RealTimeValidationExampleState createState() => _RealTimeValidationExampleState();
}

class _RealTimeValidationExampleState extends State<RealTimeValidationExample> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  bool _autoValidate = false;

  @override
  void dispose() {
    _emailController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      autovalidateMode: _autoValidate
          ? AutovalidateMode.onUserInteraction
          : AutovalidateMode.disabled,
      child: Column(
        children: [
          TextFormField(
            controller: _emailController,
            decoration: InputDecoration(
              labelText: 'Email',
              errorMaxLines: 2,
            ),
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Email обов\'язковий';
              }
              if (!value.contains('@')) {
                return 'Введіть коректний email';
              }
              return null;
            },
          ),
          ElevatedButton(
            onPressed: () {
              setState(() {
                _autoValidate = true;
              });
              if (_formKey.currentState!.validate()) {
                // Форма валідна
              }
            },
            child: Text('Перевірити'),
          ),
        ],
      ),
    );
  }
}
```

## Інші елементи форм

### DropdownButtonFormField

```dart
class DropdownExample extends StatefulWidget {
  @override
  _DropdownExampleState createState() => _DropdownExampleState();
}

class _DropdownExampleState extends State<DropdownExample> {
  String? _selectedCountry;
  final List<String> _countries = ['Україна', 'Польща', 'Німеччина', 'Франція'];

  @override
  Widget build(BuildContext context) {
    return DropdownButtonFormField<String>(
      value: _selectedCountry,
      decoration: InputDecoration(
        labelText: 'Країна',
        border: OutlineInputBorder(),
      ),
      items: _countries.map((country) {
        return DropdownMenuItem(
          value: country,
          child: Text(country),
        );
      }).toList(),
      onChanged: (value) {
        setState(() {
          _selectedCountry = value;
        });
      },
      validator: (value) {
        if (value == null) {
          return 'Виберіть країну';
        }
        return null;
      },
    );
  }
}
```

### Checkbox та CheckboxListTile

```dart
class CheckboxExample extends StatefulWidget {
  @override
  _CheckboxExampleState createState() => _CheckboxExampleState();
}

class _CheckboxExampleState extends State<CheckboxExample> {
  bool _agreeToTerms = false;
  List<String> _selectedHobbies = [];
  final List<String> _hobbies = ['Читання', 'Спорт', 'Музика', 'Подорожі'];

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Простий Checkbox
        CheckboxListTile(
          title: Text('Я погоджуюся з умовами'),
          value: _agreeToTerms,
          onChanged: (value) {
            setState(() {
              _agreeToTerms = value!;
            });
          },
          controlAffinity: ListTileControlAffinity.leading,
        ),

        // Множинний вибір
        ...List.generate(_hobbies.length, (index) {
          return CheckboxListTile(
            title: Text(_hobbies[index]),
            value: _selectedHobbies.contains(_hobbies[index]),
            onChanged: (value) {
              setState(() {
                if (value!) {
                  _selectedHobbies.add(_hobbies[index]);
                } else {
                  _selectedHobbies.remove(_hobbies[index]);
                }
              });
            },
          );
        }),
      ],
    );
  }
}
```

### Radio та RadioListTile

```dart
class RadioExample extends StatefulWidget {
  @override
  _RadioExampleState createState() => _RadioExampleState();
}

class _RadioExampleState extends State<RadioExample> {
  String? _selectedGender;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Стать:', style: TextStyle(fontSize: 16)),
        RadioListTile<String>(
          title: Text('Чоловіча'),
          value: 'male',
          groupValue: _selectedGender,
          onChanged: (value) {
            setState(() {
              _selectedGender = value;
            });
          },
        ),
        RadioListTile<String>(
          title: Text('Жіноча'),
          value: 'female',
          groupValue: _selectedGender,
          onChanged: (value) {
            setState(() {
              _selectedGender = value;
            });
          },
        ),
        RadioListTile<String>(
          title: Text('Інше'),
          value: 'other',
          groupValue: _selectedGender,
          onChanged: (value) {
            setState(() {
              _selectedGender = value;
            });
          },
        ),
      ],
    );
  }
}
```

### Switch

```dart
class SwitchExample extends StatefulWidget {
  @override
  _SwitchExampleState createState() => _SwitchExampleState();
}

class _SwitchExampleState extends State<SwitchExample> {
  bool _notifications = true;
  bool _darkMode = false;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        SwitchListTile(
          title: Text('Сповіщення'),
          subtitle: Text('Отримувати push-сповіщення'),
          value: _notifications,
          onChanged: (value) {
            setState(() {
              _notifications = value;
            });
          },
        ),
        SwitchListTile(
          title: Text('Темна тема'),
          value: _darkMode,
          onChanged: (value) {
            setState(() {
              _darkMode = value;
            });
          },
        ),
      ],
    );
  }
}
```

### Slider

```dart
class SliderExample extends StatefulWidget {
  @override
  _SliderExampleState createState() => _SliderExampleState();
}

class _SliderExampleState extends State<SliderExample> {
  double _age = 25;
  RangeValues _priceRange = RangeValues(100, 500);

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Звичайний Slider
        Text('Вік: ${_age.round()}'),
        Slider(
          value: _age,
          min: 18,
          max: 100,
          divisions: 82,
          label: _age.round().toString(),
          onChanged: (value) {
            setState(() {
              _age = value;
            });
          },
        ),

        // RangeSlider
        Text('Ціна: ${_priceRange.start.round()} - ${_priceRange.end.round()} грн'),
        RangeSlider(
          values: _priceRange,
          min: 0,
          max: 1000,
          divisions: 20,
          labels: RangeLabels(
            _priceRange.start.round().toString(),
            _priceRange.end.round().toString(),
          ),
          onChanged: (values) {
            setState(() {
              _priceRange = values;
            });
          },
        ),
      ],
    );
  }
}
```

### DatePicker та TimePicker

```dart
class DateTimePickerExample extends StatefulWidget {
  @override
  _DateTimePickerExampleState createState() => _DateTimePickerExampleState();
}

class _DateTimePickerExampleState extends State<DateTimePickerExample> {
  DateTime _selectedDate = DateTime.now();
  TimeOfDay _selectedTime = TimeOfDay.now();

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate,
      firstDate: DateTime(2000),
      lastDate: DateTime(2100),
      locale: const Locale('uk', 'UA'),
    );
    if (picked != null && picked != _selectedDate) {
      setState(() {
        _selectedDate = picked;
      });
    }
  }

  Future<void> _selectTime(BuildContext context) async {
    final TimeOfDay? picked = await showTimePicker(
      context: context,
      initialTime: _selectedTime,
    );
    if (picked != null && picked != _selectedTime) {
      setState(() {
        _selectedTime = picked;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        ListTile(
          title: Text('Дата'),
          subtitle: Text('${_selectedDate.day}.${_selectedDate.month}.${_selectedDate.year}'),
          trailing: Icon(Icons.calendar_today),
          onTap: () => _selectDate(context),
        ),
        ListTile(
          title: Text('Час'),
          subtitle: Text('${_selectedTime.hour}:${_selectedTime.minute.toString().padLeft(2, '0')}'),
          trailing: Icon(Icons.access_time),
          onTap: () => _selectTime(context),
        ),
      ],
    );
  }
}
```

## Повна форма реєстрації

```dart
class RegistrationForm extends StatefulWidget {
  @override
  _RegistrationFormState createState() => _RegistrationFormState();
}

class _RegistrationFormState extends State<RegistrationForm> {
  final _formKey = GlobalKey<FormState>();
  final _passwordController = TextEditingController();

  bool _isLoading = false;
  bool _obscurePassword = true;
  bool _obscureConfirmPassword = true;
  bool _agreeToTerms = false;

  String _name = '';
  String _email = '';
  String _password = '';
  String? _selectedCountry;

  final List<String> _countries = ['Україна', 'Польща', 'Німеччина', 'Франція'];

  @override
  void dispose() {
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_agreeToTerms) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Потрібно погодитись з умовами')),
      );
      return;
    }

    if (_formKey.currentState!.validate()) {
      _formKey.currentState!.save();

      setState(() {
        _isLoading = true;
      });

      // Імітація запиту до сервера
      await Future.delayed(Duration(seconds: 2));

      setState(() {
        _isLoading = false;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Реєстрація успішна!'),
          backgroundColor: Colors.green,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Реєстрація')),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Ім'я
              TextFormField(
                decoration: InputDecoration(
                  labelText: 'Ім\'я',
                  prefixIcon: Icon(Icons.person),
                  border: OutlineInputBorder(),
                ),
                textCapitalization: TextCapitalization.words,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Введіть ім\'я';
                  }
                  if (value.length < 2) {
                    return 'Ім\'я занадто коротке';
                  }
                  return null;
                },
                onSaved: (value) => _name = value!,
              ),
              SizedBox(height: 16),

              // Email
              TextFormField(
                decoration: InputDecoration(
                  labelText: 'Email',
                  prefixIcon: Icon(Icons.email),
                  border: OutlineInputBorder(),
                ),
                keyboardType: TextInputType.emailAddress,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Введіть email';
                  }
                  final emailRegex = RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');
                  if (!emailRegex.hasMatch(value)) {
                    return 'Введіть коректний email';
                  }
                  return null;
                },
                onSaved: (value) => _email = value!,
              ),
              SizedBox(height: 16),

              // Пароль
              TextFormField(
                controller: _passwordController,
                decoration: InputDecoration(
                  labelText: 'Пароль',
                  prefixIcon: Icon(Icons.lock),
                  suffixIcon: IconButton(
                    icon: Icon(_obscurePassword ? Icons.visibility : Icons.visibility_off),
                    onPressed: () {
                      setState(() {
                        _obscurePassword = !_obscurePassword;
                      });
                    },
                  ),
                  border: OutlineInputBorder(),
                ),
                obscureText: _obscurePassword,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Введіть пароль';
                  }
                  if (value.length < 8) {
                    return 'Пароль повинен містити мінімум 8 символів';
                  }
                  if (!value.contains(RegExp(r'[A-Z]'))) {
                    return 'Пароль повинен містити велику літеру';
                  }
                  if (!value.contains(RegExp(r'[0-9]'))) {
                    return 'Пароль повинен містити цифру';
                  }
                  return null;
                },
                onSaved: (value) => _password = value!,
              ),
              SizedBox(height: 16),

              // Підтвердження паролю
              TextFormField(
                decoration: InputDecoration(
                  labelText: 'Підтвердіть пароль',
                  prefixIcon: Icon(Icons.lock_outline),
                  suffixIcon: IconButton(
                    icon: Icon(_obscureConfirmPassword ? Icons.visibility : Icons.visibility_off),
                    onPressed: () {
                      setState(() {
                        _obscureConfirmPassword = !_obscureConfirmPassword;
                      });
                    },
                  ),
                  border: OutlineInputBorder(),
                ),
                obscureText: _obscureConfirmPassword,
                validator: (value) {
                  if (value != _passwordController.text) {
                    return 'Паролі не співпадають';
                  }
                  return null;
                },
              ),
              SizedBox(height: 16),

              // Країна
              DropdownButtonFormField<String>(
                value: _selectedCountry,
                decoration: InputDecoration(
                  labelText: 'Країна',
                  prefixIcon: Icon(Icons.flag),
                  border: OutlineInputBorder(),
                ),
                items: _countries.map((country) {
                  return DropdownMenuItem(value: country, child: Text(country));
                }).toList(),
                onChanged: (value) {
                  setState(() {
                    _selectedCountry = value;
                  });
                },
                validator: (value) {
                  if (value == null) {
                    return 'Виберіть країну';
                  }
                  return null;
                },
              ),
              SizedBox(height: 16),

              // Умови використання
              CheckboxListTile(
                title: Text('Я погоджуюсь з умовами використання'),
                value: _agreeToTerms,
                onChanged: (value) {
                  setState(() {
                    _agreeToTerms = value!;
                  });
                },
                controlAffinity: ListTileControlAffinity.leading,
                contentPadding: EdgeInsets.zero,
              ),
              SizedBox(height: 24),

              // Кнопка реєстрації
              ElevatedButton(
                onPressed: _isLoading ? null : _submit,
                style: ElevatedButton.styleFrom(
                  padding: EdgeInsets.symmetric(vertical: 16),
                ),
                child: _isLoading
                    ? SizedBox(
                        height: 20,
                        width: 20,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                        ),
                      )
                    : Text('Зареєструватися', style: TextStyle(fontSize: 16)),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
```

## Кращі практики

1. **Завжди використовуйте `GlobalKey<FormState>`** для контролю над формою.

2. **Звільняйте контролери** у методі `dispose()`.

3. **Використовуйте autovalidateMode** для валідації в реальному часі після першої спроби відправки.

4. **Надавайте чіткі повідомлення про помилки** — користувач повинен розуміти, що пішло не так.

5. **Використовуйте відповідні типи клавіатури** для різних полів введення.

6. **Показуйте індикатор завантаження** під час обробки форми.

## Висновок

Flutter надає потужні інструменти для роботи з формами. Правильне використання віджетів Form, TextFormField та різних елементів введення допоможе створити зручний та надійний інтерфейс для збору даних від користувачів.
