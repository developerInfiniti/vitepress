# Валидация в Laravel

Валидация — это проверка входящих данных на соответствие правилам.

## Базовая валидация

### В контроллере

```php
public function store(Request $request)
{
    $validated = $request->validate([
        'title' => 'required|string|max:255',
        'content' => 'required|string|min:100',
        'email' => 'required|email|unique:users',
    ]);

    // $validated содержит только провалидированные данные
    Post::create($validated);
}
```

### Альтернативный синтаксис

```php
// Массив правил
$validated = $request->validate([
    'title' => ['required', 'string', 'max:255'],
    'tags' => ['required', 'array'],
    'tags.*' => ['string', 'max:50'],
]);
```

---

## Form Request

### Создание

```bash
php artisan make:request StorePostRequest
```

### Класс Request

```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePostRequest extends FormRequest
{
    /**
     * Авторизация запроса
     */
    public function authorize(): bool
    {
        return true; // или проверка прав
        // return $this->user()->can('create', Post::class);
    }

    /**
     * Правила валидации
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string', 'min:100'],
            'category_id' => ['required', 'exists:categories,id'],
            'tags' => ['array'],
            'tags.*' => ['exists:tags,id'],
            'published_at' => ['nullable', 'date', 'after:today'],
        ];
    }

    /**
     * Кастомные сообщения об ошибках
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Заголовок обязателен для заполнения',
            'title.max' => 'Заголовок не должен превышать :max символов',
            'content.required' => 'Содержимое поста обязательно',
            'content.min' => 'Содержимое должно быть не менее :min символов',
            'category_id.exists' => 'Выбранная категория не существует',
        ];
    }

    /**
     * Кастомные имена атрибутов
     */
    public function attributes(): array
    {
        return [
            'title' => 'заголовок',
            'content' => 'содержимое',
            'category_id' => 'категория',
        ];
    }

    /**
     * Подготовка данных перед валидацией
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'slug' => Str::slug($this->title),
            'user_id' => $this->user()->id,
        ]);
    }

    /**
     * Действия после успешной валидации
     */
    protected function passedValidation(): void
    {
        // Очистка или преобразование данных
        $this->replace([
            'title' => strip_tags($this->title),
        ]);
    }
}
```

### Использование в контроллере

```php
use App\Http\Requests\StorePostRequest;

class PostController extends Controller
{
    public function store(StorePostRequest $request)
    {
        // Данные уже провалидированы
        $validated = $request->validated();

        // Или только определенные поля
        $validated = $request->safe()->only(['title', 'content']);

        // Все кроме
        $validated = $request->safe()->except(['tags']);

        Post::create($validated);

        return redirect()->route('posts.index');
    }
}
```

---

## Правила валидации

### Общие правила

```php
'field' => 'required',              // Обязательное
'field' => 'nullable',              // Может быть null
'field' => 'present',               // Должно присутствовать (может быть пустым)
'field' => 'filled',                // Если есть, не должно быть пустым
'field' => 'sometimes',             // Валидировать только если присутствует
'field' => 'bail',                  // Остановить валидацию при первой ошибке
```

### Типы данных

```php
'field' => 'string',                // Строка
'field' => 'integer',               // Целое число
'field' => 'numeric',               // Число
'field' => 'boolean',               // Boolean
'field' => 'array',                 // Массив
'field' => 'json',                  // JSON строка
'field' => 'date',                  // Дата
```

### Строки

```php
'name' => 'min:3',                  // Минимум 3 символа
'name' => 'max:255',                // Максимум 255 символов
'name' => 'size:10',                // Ровно 10 символов
'name' => 'between:3,10',           // От 3 до 10 символов

'email' => 'email',                 // Email
'email' => 'email:rfc,dns',         // С проверкой DNS

'url' => 'url',                     // URL
'url' => 'active_url',              // URL с DNS проверкой

'slug' => 'alpha',                  // Только буквы
'slug' => 'alpha_num',              // Буквы и цифры
'slug' => 'alpha_dash',             // Буквы, цифры, тире, подчеркивание

'ip' => 'ip',                       // IP адрес
'ip' => 'ipv4',                     // IPv4
'ip' => 'ipv6',                     // IPv6

'uuid' => 'uuid',                   // UUID
'mac' => 'mac_address',             // MAC адрес

'name' => 'regex:/^[A-Za-z]+$/',    // Регулярное выражение
'name' => 'not_regex:/[0-9]/',      // Не соответствует regex

'name' => 'starts_with:Mr,Mrs',     // Начинается с
'name' => 'ends_with:.com,.org',    // Заканчивается на
'name' => 'doesnt_start_with:admin',
'name' => 'doesnt_end_with:test',
```

### Числа

```php
'age' => 'integer',                 // Целое число
'price' => 'numeric',               // Любое число
'price' => 'decimal:2',             // Decimal с 2 знаками
'price' => 'decimal:2,4',           // Decimal с 2-4 знаками

'age' => 'min:18',                  // Минимум 18
'age' => 'max:100',                 // Максимум 100
'age' => 'between:18,65',           // От 18 до 65

'amount' => 'gt:0',                 // Больше 0
'amount' => 'gte:0',                // Больше или равно 0
'amount' => 'lt:100',               // Меньше 100
'amount' => 'lte:100',              // Меньше или равно 100
```

### Даты

```php
'date' => 'date',                   // Валидная дата
'date' => 'date_format:Y-m-d',      // Формат даты
'date' => 'date_format:d/m/Y H:i',

'start' => 'before:end_date',       // До другого поля
'end' => 'after:start_date',        // После другого поля

'start' => 'before:tomorrow',       // До завтра
'start' => 'before_or_equal:today', // До или сегодня
'end' => 'after:today',             // После сегодня
'end' => 'after_or_equal:tomorrow', // После или завтра

'birthday' => 'date_equals:2024-01-01', // Равно дате
```

### Файлы

```php
'file' => 'file',                   // Загруженный файл
'image' => 'image',                 // Изображение
'image' => 'mimes:jpeg,png,gif',    // Типы файлов
'image' => 'mimetypes:image/jpeg,image/png',

'file' => 'max:2048',               // Макс. размер в KB
'file' => 'min:100',                // Мин. размер в KB
'file' => 'size:1024',              // Ровно 1MB

'image' => 'dimensions:min_width=100,min_height=100',
'image' => 'dimensions:max_width=1000,max_height=1000',
'image' => 'dimensions:width=500,height=500',
'image' => 'dimensions:ratio=3/2',
```

### Массивы

```php
'tags' => 'array',                  // Массив
'tags' => 'array:name,email',       // Только эти ключи

'items' => 'array|min:1',           // Минимум 1 элемент
'items' => 'array|max:10',          // Максимум 10 элементов
'items' => 'array|size:5',          // Ровно 5 элементов

// Валидация элементов массива
'tags.*' => 'string|max:50',
'items.*.name' => 'required|string',
'items.*.price' => 'required|numeric|min:0',
```

### База данных

```php
// Уникальность
'email' => 'unique:users',                    // Уникален в таблице users
'email' => 'unique:users,email_address',      // В колонке email_address
'email' => 'unique:users,email,'.$userId,     // Исключить текущий ID
'email' => [
    'required',
    Rule::unique('users')->ignore($user->id),
],

// Существование
'category_id' => 'exists:categories,id',      // Существует в таблице
'status' => 'exists:statuses,code',
'category_id' => [
    'required',
    Rule::exists('categories', 'id')->where('active', true),
],
```

### Сравнение

```php
'password_confirmation' => 'same:password',   // Равно другому полю
'other' => 'different:field',                 // Отличается от поля

'start' => 'lt:end',                          // Меньше
'end' => 'gt:start',                          // Больше
'min' => 'lte:max',                           // Меньше или равно
'max' => 'gte:min',                           // Больше или равно
```

### Условные правила

```php
'phone' => 'required_if:contact_method,phone',
'email' => 'required_unless:contact_method,phone',
'nickname' => 'required_with:username',
'country' => 'required_with_all:city,street',
'email' => 'required_without:phone',
'bio' => 'required_without_all:twitter,facebook',

// С Rule
'email' => [
    Rule::requiredIf(fn () => $this->isSubscribed),
],
```

### Прочие

```php
'status' => 'in:active,pending,closed',       // Один из списка
'type' => 'not_in:admin,root',                // Не из списка

'password' => 'confirmed',                     // Требует password_confirmation

'terms' => 'accepted',                         // Принят (yes, on, 1, true)
'terms' => 'declined',                         // Отклонен

'timezone' => 'timezone',                      // Валидная timezone
'locale' => 'timezone:Asia',                   // Timezone в регионе

'color' => 'hex_color',                        // HEX цвет
```

---

## Кастомные правила

### Closure правило

```php
$request->validate([
    'title' => [
        'required',
        function ($attribute, $value, $fail) {
            if (str_contains($value, 'spam')) {
                $fail("The {$attribute} contains spam.");
            }
        },
    ],
]);
```

### Rule объект

```bash
php artisan make:rule Uppercase
```

```php
<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class Uppercase implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (strtoupper($value) !== $value) {
            $fail('The :attribute must be uppercase.');
        }
    }
}

// Использование
use App\Rules\Uppercase;

$request->validate([
    'name' => ['required', new Uppercase],
]);
```

### Правило с параметрами

```php
<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class MinWords implements ValidationRule
{
    public function __construct(
        protected int $minWords = 10
    ) {}

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $wordCount = str_word_count($value);

        if ($wordCount < $this->minWords) {
            $fail("The :attribute must contain at least {$this->minWords} words.");
        }
    }
}

// Использование
$request->validate([
    'content' => ['required', new MinWords(50)],
]);
```

---

## Работа с ошибками

### В Blade шаблонах

```blade
{{-- Все ошибки --}}
@if ($errors->any())
    <div class="alert alert-danger">
        <ul>
            @foreach ($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
    </div>
@endif

{{-- Ошибка конкретного поля --}}
@error('email')
    <span class="text-red-500">{{ $message }}</span>
@enderror

{{-- Проверка наличия ошибки --}}
<input
    type="email"
    name="email"
    class="@error('email') border-red-500 @enderror"
>

{{-- Старое значение с ошибкой --}}
<input
    type="email"
    name="email"
    value="{{ old('email') }}"
    @class(['form-control', 'is-invalid' => $errors->has('email')])
>
@error('email')
    <div class="invalid-feedback">{{ $message }}</div>
@enderror
```

### Error Bags

```php
// В контроллере
return back()->withErrors([
    'login' => 'Invalid credentials'
], 'login'); // 'login' - название bag

// В шаблоне
@error('login', 'login')
    <span class="error">{{ $message }}</span>
@enderror

// В Form Request
protected $errorBag = 'login';
```

---

## Ручная валидация

```php
use Illuminate\Support\Facades\Validator;

$validator = Validator::make($request->all(), [
    'title' => 'required|max:255',
    'body' => 'required',
]);

// Проверка
if ($validator->fails()) {
    return redirect('post/create')
        ->withErrors($validator)
        ->withInput();
}

// Или выбросить исключение
$validator->validate();

// Получить провалидированные данные
$validated = $validator->validated();

// Получить ошибки
$errors = $validator->errors();
$errors->first('email');
$errors->get('email');
$errors->all();
$errors->has('email');

// After hook
$validator->after(function ($validator) {
    if ($this->somethingElseIsInvalid()) {
        $validator->errors()->add('field', 'Something is wrong!');
    }
});
```

---

## Примеры

### Регистрация пользователя

```php
class RegisterRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users'],
            'password' => [
                'required',
                'confirmed',
                Password::min(8)
                    ->letters()
                    ->mixedCase()
                    ->numbers()
                    ->symbols()
                    ->uncompromised(),
            ],
            'terms' => ['required', 'accepted'],
        ];
    }
}
```

### Обновление профиля

```php
class UpdateProfileRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                Rule::unique('users')->ignore($this->user()->id),
            ],
            'avatar' => ['nullable', 'image', 'max:2048'],
            'bio' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
```

### Создание заказа

```php
class StoreOrderRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:100'],
            'shipping_address' => ['required', 'string', 'max:500'],
            'payment_method' => ['required', Rule::in(['card', 'paypal', 'cash'])],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
```
