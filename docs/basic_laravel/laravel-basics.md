---
description: "Основы Laravel: установка, структура проекта, MVC архитектура — быстрый старт PHP фреймворка"
---

# Основы Laravel

Laravel — это PHP-фреймворк с элегантным синтаксисом для создания веб-приложений.

## Установка

### Требования
- PHP >= 8.1
- Composer
- Node.js и NPM (для frontend)

### Создание проекта

```bash
# Через Composer
composer create-project laravel/laravel my-app

# Через Laravel Installer
composer global require laravel/installer
laravel new my-app

# С дополнительными опциями
laravel new my-app --git --branch="main"
```

### Запуск сервера

```bash
cd my-app
php artisan serve
# Приложение доступно на http://localhost:8000
```

---

## Структура проекта

```
my-app/
├── app/                    # Основной код приложения
│   ├── Console/            # Artisan команды
│   ├── Exceptions/         # Обработчики исключений
│   ├── Http/
│   │   ├── Controllers/    # Контроллеры
│   │   ├── Middleware/     # Middleware
│   │   └── Requests/       # Form Requests
│   ├── Models/             # Eloquent модели
│   └── Providers/          # Service Providers
├── bootstrap/              # Загрузка фреймворка
├── config/                 # Конфигурационные файлы
├── database/
│   ├── factories/          # Фабрики для тестов
│   ├── migrations/         # Миграции БД
│   └── seeders/            # Сидеры БД
├── public/                 # Публичная директория (index.php)
├── resources/
│   ├── css/                # CSS файлы
│   ├── js/                 # JavaScript файлы
│   └── views/              # Blade шаблоны
├── routes/
│   ├── api.php             # API маршруты
│   ├── console.php         # Console команды
│   └── web.php             # Web маршруты
├── storage/                # Логи, кэш, файлы
├── tests/                  # Тесты
├── .env                    # Переменные окружения
├── artisan                 # CLI инструмент
├── composer.json           # PHP зависимости
└── package.json            # JS зависимости
```

---

## Конфигурация

### Файл .env

```env
APP_NAME=Laravel
APP_ENV=local
APP_KEY=base64:...
APP_DEBUG=true
APP_URL=http://localhost

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=root
DB_PASSWORD=

CACHE_DRIVER=file
SESSION_DRIVER=file
QUEUE_CONNECTION=sync

MAIL_MAILER=smtp
MAIL_HOST=mailhog
MAIL_PORT=1025
```

### Получение конфигурации

```php
// Получить значение из .env
$debug = env('APP_DEBUG', false);

// Получить значение из config/
$timezone = config('app.timezone');

// Установить значение на лету
config(['app.timezone' => 'Europe/Kiev']);
```

### Кэширование конфигурации

```bash
# Создать кэш конфигурации (для продакшена)
php artisan config:cache

# Очистить кэш конфигурации
php artisan config:clear
```

---

## Artisan CLI

### Основные команды

```bash
# Справка
php artisan list
php artisan help migrate

# Интерактивная консоль
php artisan tinker

# Информация о приложении
php artisan about

# Запуск сервера
php artisan serve --port=8080
```

### Генерация компонентов

```bash
# Контроллер
php artisan make:controller UserController
php artisan make:controller UserController --resource
php artisan make:controller UserController --api

# Модель
php artisan make:model User
php artisan make:model User -m           # С миграцией
php artisan make:model User -mfc         # С миграцией, фабрикой, контроллером

# Миграция
php artisan make:migration create_users_table

# Middleware
php artisan make:middleware CheckAge

# Request
php artisan make:request StoreUserRequest

# Seeder
php artisan make:seeder UserSeeder

# Factory
php artisan make:factory UserFactory
```

### Очистка кэша

```bash
php artisan cache:clear      # Кэш приложения
php artisan config:clear     # Кэш конфигурации
php artisan route:clear      # Кэш маршрутов
php artisan view:clear       # Кэш шаблонов
php artisan optimize:clear   # Всё сразу
```

---

## Service Providers

Service Providers — это центральное место для настройки приложения.

### Структура провайдера

```php
<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Регистрация сервисов
     */
    public function register(): void
    {
        // Регистрация привязок в контейнере
        $this->app->bind(PaymentInterface::class, StripePayment::class);

        // Singleton
        $this->app->singleton(CartService::class, function ($app) {
            return new CartService();
        });
    }

    /**
     * Bootstrap сервисов
     */
    public function boot(): void
    {
        // Выполняется после регистрации всех провайдеров
        View::share('appName', config('app.name'));
    }
}
```

### Регистрация провайдера

```php
// config/app.php
'providers' => [
    // ...
    App\Providers\AppServiceProvider::class,
    App\Providers\CustomServiceProvider::class,
],
```

---

## Service Container

### Dependency Injection

```php
// Автоматическое внедрение зависимостей
class UserController extends Controller
{
    public function __construct(
        private UserService $userService,
        private LoggerInterface $logger
    ) {}

    public function index()
    {
        return $this->userService->getAll();
    }
}
```

### Ручное разрешение

```php
// Из контейнера
$userService = app(UserService::class);
$userService = resolve(UserService::class);

// С параметрами
$service = app()->make(ReportService::class, [
    'format' => 'pdf'
]);
```

---

## Facades

Facades предоставляют статический интерфейс к сервисам из контейнера.

```php
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

// Кэширование
Cache::put('key', 'value', 600);
$value = Cache::get('key');

// База данных
$users = DB::table('users')->get();

// Логирование
Log::info('User logged in', ['id' => $user->id]);

// Отправка email
Mail::to($user)->send(new WelcomeMail());
```

### Список основных Facades

| Facade | Сервис |
|--------|--------|
| `Auth` | Аутентификация |
| `Cache` | Кэширование |
| `Config` | Конфигурация |
| `DB` | База данных |
| `Event` | События |
| `File` | Файловая система |
| `Hash` | Хэширование |
| `Log` | Логирование |
| `Mail` | Почта |
| `Queue` | Очереди |
| `Request` | HTTP запрос |
| `Response` | HTTP ответ |
| `Route` | Маршрутизация |
| `Session` | Сессии |
| `Storage` | Файловое хранилище |
| `Validator` | Валидация |
| `View` | Шаблоны |

---

## Помощники (Helpers)

```php
// Массивы
$array = array_add(['name' => 'John'], 'age', 25);
$first = head([1, 2, 3]); // 1
$last = last([1, 2, 3]);  // 3

// Пути
$path = app_path('Http/Controllers');
$path = base_path('vendor');
$path = config_path('app.php');
$path = database_path('migrations');
$path = public_path('css/app.css');
$path = resource_path('views');
$path = storage_path('logs');

// Строки
$slug = str('Hello World')->slug(); // hello-world
$upper = str('hello')->upper();     // HELLO

// URL
$url = url('user/profile');
$url = route('user.show', ['id' => 1]);
$url = asset('css/app.css');

// Разное
$value = old('name');           // Старое значение формы
$token = csrf_token();          // CSRF токен
$field = csrf_field();          // Скрытое поле CSRF
abort(404);                     // Прервать с ошибкой
dd($variable);                  // Dump and die
dump($variable);                // Dump
logger('Debug message');        // Логирование
now();                          // Текущее время
today();                        // Сегодняшняя дата
```

---

## Быстрый старт

### 1. Создание проекта

```bash
composer create-project laravel/laravel blog
cd blog
```

### 2. Настройка базы данных

```env
# .env
DB_CONNECTION=mysql
DB_DATABASE=blog
DB_USERNAME=root
DB_PASSWORD=secret
```

### 3. Создание модели и миграции

```bash
php artisan make:model Post -mc
```

### 4. Миграция

```php
// database/migrations/xxx_create_posts_table.php
public function up(): void
{
    Schema::create('posts', function (Blueprint $table) {
        $table->id();
        $table->string('title');
        $table->text('content');
        $table->timestamps();
    });
}
```

```bash
php artisan migrate
```

### 5. Маршрут и контроллер

```php
// routes/web.php
Route::resource('posts', PostController::class);

// app/Http/Controllers/PostController.php
public function index()
{
    $posts = Post::all();
    return view('posts.index', compact('posts'));
}
```

### 6. Шаблон

```blade
{{-- resources/views/posts/index.blade.php --}}
@extends('layouts.app')

@section('content')
    <h1>Все посты</h1>
    @foreach($posts as $post)
        <article>
            <h2>{{ $post->title }}</h2>
            <p>{{ $post->content }}</p>
        </article>
    @endforeach
@endsection
```

### 7. Запуск

```bash
php artisan serve
# Открыть http://localhost:8000/posts
```
