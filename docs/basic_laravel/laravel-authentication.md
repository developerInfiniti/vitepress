---
description: "Аутентификация в Laravel: Sanctum, Passport, Guards — настройка авторизации и защиты маршрутов"
---

# Аутентификация в Laravel

Laravel предоставляет простые средства для аутентификации пользователей.

## Starter Kits

### Laravel Breeze

Простой стартовый набор с Blade, Livewire или Inertia.

```bash
# Установка
composer require laravel/breeze --dev

# Публикация с Blade
php artisan breeze:install blade

# С Livewire
php artisan breeze:install livewire

# С React/Inertia
php artisan breeze:install react

# С Vue/Inertia
php artisan breeze:install vue

# Установка зависимостей
npm install && npm run dev
php artisan migrate
```

### Laravel Jetstream

Продвинутый стартовый набор с командами, профилями, API.

```bash
composer require laravel/jetstream

# С Livewire
php artisan jetstream:install livewire

# С Inertia
php artisan jetstream:install inertia

npm install && npm run dev
php artisan migrate
```

---

## Ручная аутентификация

### Attempt (попытка входа)

```php
use Illuminate\Support\Facades\Auth;

public function login(Request $request)
{
    $credentials = $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    // Попытка аутентификации
    if (Auth::attempt($credentials)) {
        $request->session()->regenerate();

        return redirect()->intended('dashboard');
    }

    return back()->withErrors([
        'email' => 'Неверные учетные данные.',
    ])->onlyInput('email');
}
```

### С Remember Me

```php
if (Auth::attempt($credentials, $request->boolean('remember'))) {
    // Успешная аутентификация с "запомнить меня"
}
```

### Дополнительные условия

```php
// Проверка дополнительных полей
if (Auth::attempt(['email' => $email, 'password' => $password, 'active' => 1])) {
    // Пользователь активен и аутентифицирован
}

// С callback
if (Auth::attemptWhen([
    'email' => $email,
    'password' => $password,
], function ($user) {
    return $user->isActive() && !$user->isBanned();
})) {
    // Успешно
}
```

---

## Работа с пользователем

### Получение текущего пользователя

```php
use Illuminate\Support\Facades\Auth;

// Через фасад
$user = Auth::user();
$id = Auth::id();

// Через Request
$user = $request->user();

// Проверка аутентификации
if (Auth::check()) {
    // Пользователь аутентифицирован
}

// В Blade
@auth
    <p>Привет, {{ auth()->user()->name }}</p>
@endauth

@guest
    <a href="/login">Войти</a>
@endguest
```

### Вход пользователя

```php
// По модели
Auth::login($user);

// С "запомнить меня"
Auth::login($user, remember: true);

// По ID
Auth::loginUsingId(1);
Auth::loginUsingId(1, remember: true);

// Один раз (без сессии)
Auth::once($credentials);
```

### Выход пользователя

```php
public function logout(Request $request)
{
    Auth::logout();

    $request->session()->invalidate();
    $request->session()->regenerateToken();

    return redirect('/');
}
```

---

## Защита маршрутов

### Middleware auth

```php
// Один маршрут
Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware('auth');

// Группа маршрутов
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/profile', [ProfileController::class, 'edit']);
});

// В контроллере
public function __construct()
{
    $this->middleware('auth');
}
```

### Редирект неавторизованных

```php
// app/Http/Middleware/Authenticate.php
protected function redirectTo(Request $request): ?string
{
    return $request->expectsJson() ? null : route('login');
}
```

---

## Регистрация

```php
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\Events\Registered;

public function register(Request $request)
{
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:users',
        'password' => 'required|string|confirmed|min:8',
    ]);

    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($request->password),
    ]);

    event(new Registered($user));

    Auth::login($user);

    return redirect()->route('dashboard');
}
```

---

## Подтверждение Email

### Настройка модели

```php
use Illuminate\Contracts\Auth\MustVerifyEmail;

class User extends Authenticatable implements MustVerifyEmail
{
    // ...
}
```

### Маршруты

```php
Route::get('/email/verify', function () {
    return view('auth.verify-email');
})->middleware('auth')->name('verification.notice');

Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
    $request->fulfill();
    return redirect('/dashboard');
})->middleware(['auth', 'signed'])->name('verification.verify');

Route::post('/email/verification-notification', function (Request $request) {
    $request->user()->sendEmailVerificationNotification();
    return back()->with('status', 'Ссылка отправлена!');
})->middleware(['auth', 'throttle:6,1'])->name('verification.send');
```

### Защита маршрутов

```php
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        // Только для пользователей с подтвержденным email
    });
});
```

---

## Сброс пароля

### Запрос ссылки

```php
use Illuminate\Support\Facades\Password;

public function sendResetLink(Request $request)
{
    $request->validate(['email' => 'required|email']);

    $status = Password::sendResetLink($request->only('email'));

    return $status === Password::RESET_LINK_SENT
        ? back()->with(['status' => __($status)])
        : back()->withErrors(['email' => __($status)]);
}
```

### Сброс пароля

```php
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Str;

public function resetPassword(Request $request)
{
    $request->validate([
        'token' => 'required',
        'email' => 'required|email',
        'password' => 'required|min:8|confirmed',
    ]);

    $status = Password::reset(
        $request->only('email', 'password', 'password_confirmation', 'token'),
        function ($user, $password) {
            $user->forceFill([
                'password' => Hash::make($password),
                'remember_token' => Str::random(60),
            ])->save();

            event(new PasswordReset($user));
        }
    );

    return $status === Password::PASSWORD_RESET
        ? redirect()->route('login')->with('status', __($status))
        : back()->withErrors(['email' => [__($status)]]);
}
```

---

## Подтверждение пароля

Для критичных операций можно требовать повторный ввод пароля.

```php
Route::get('/settings', function () {
    // ...
})->middleware(['auth', 'password.confirm']);

Route::post('/settings', function () {
    // ...
})->middleware(['auth', 'password.confirm']);
```

---

## Hashing паролей

```php
use Illuminate\Support\Facades\Hash;

// Хэширование
$hashed = Hash::make('password');

// Проверка
if (Hash::check('plain-text', $hashedPassword)) {
    // Пароль совпадает
}

// Проверка необходимости перехэширования
if (Hash::needsRehash($hashed)) {
    $hashed = Hash::make('plain-text');
}
```

---

## Guards

Guards определяют как пользователи аутентифицируются.

### Конфигурация

```php
// config/auth.php
'guards' => [
    'web' => [
        'driver' => 'session',
        'provider' => 'users',
    ],

    'api' => [
        'driver' => 'sanctum',
        'provider' => 'users',
    ],

    'admin' => [
        'driver' => 'session',
        'provider' => 'admins',
    ],
],

'providers' => [
    'users' => [
        'driver' => 'eloquent',
        'model' => App\Models\User::class,
    ],

    'admins' => [
        'driver' => 'eloquent',
        'model' => App\Models\Admin::class,
    ],
],
```

### Использование

```php
// Аутентификация через конкретный guard
Auth::guard('admin')->attempt($credentials);
Auth::guard('admin')->user();

// В маршрутах
Route::middleware('auth:admin')->group(function () {
    // Только для админов
});

// Проверка
if (Auth::guard('admin')->check()) {
    // Админ аутентифицирован
}
```

---

## Laravel Sanctum (API)

### Установка

```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
```

### Настройка модели

```php
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
}
```

### Выдача токена

```php
public function login(Request $request)
{
    $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    $user = User::where('email', $request->email)->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
        throw ValidationException::withMessages([
            'email' => ['Неверные учетные данные.'],
        ]);
    }

    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'access_token' => $token,
        'token_type' => 'Bearer',
    ]);
}
```

### Защита API маршрутов

```php
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/logout', function (Request $request) {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out']);
    });
});
```

### Abilities (разрешения токена)

```php
// Создание с abilities
$token = $user->createToken('token-name', ['server:update'])->plainTextToken;

// Проверка
if ($user->tokenCan('server:update')) {
    // Токен имеет ability
}

// В middleware
Route::post('/servers/{server}', function () {
    // ...
})->middleware(['auth:sanctum', 'ability:server:update']);
```

### Отзыв токенов

```php
// Текущий токен
$request->user()->currentAccessToken()->delete();

// Все токены
$user->tokens()->delete();

// Конкретный токен
$user->tokens()->where('id', $tokenId)->delete();
```

---

## События аутентификации

```php
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Events\Attempting;
use Illuminate\Auth\Events\Authenticated;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Failed;
use Illuminate\Auth\Events\Logout;
use Illuminate\Auth\Events\Lockout;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Auth\Events\Verified;

// Слушатель
class SendWelcomeEmail
{
    public function handle(Registered $event)
    {
        Mail::to($event->user)->send(new WelcomeMail($event->user));
    }
}

// Регистрация в EventServiceProvider
protected $listen = [
    Registered::class => [
        SendWelcomeEmail::class,
    ],
];
```

---

## Полный пример AuthController

```php
<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    public function showLoginForm()
    {
        return view('auth.login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();
            return redirect()->intended('dashboard');
        }

        return back()->withErrors([
            'email' => 'Неверные учетные данные.',
        ])->onlyInput('email');
    }

    public function showRegisterForm()
    {
        return view('auth.register');
    }

    public function register(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        event(new Registered($user));
        Auth::login($user);

        return redirect()->route('dashboard');
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
```
