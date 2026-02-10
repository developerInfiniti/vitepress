# Маршрутизация в Laravel

Маршруты определяют URL-адреса приложения и связывают их с контроллерами или замыканиями.

## Основы маршрутизации

### Файлы маршрутов

```
routes/
├── web.php      # Веб-маршруты (сессии, CSRF, cookies)
├── api.php      # API маршруты (stateless, prefix /api)
├── console.php  # Artisan команды
└── channels.php # Broadcast каналы
```

### Базовые маршруты

```php
use Illuminate\Support\Facades\Route;

// GET запрос
Route::get('/hello', function () {
    return 'Hello World!';
});

// POST запрос
Route::post('/users', function () {
    return 'User created';
});

// Другие методы
Route::put('/users/{id}', function ($id) { });
Route::patch('/users/{id}', function ($id) { });
Route::delete('/users/{id}', function ($id) { });
Route::options('/users', function () { });

// Несколько методов
Route::match(['get', 'post'], '/form', function () { });

// Любой метод
Route::any('/webhook', function () { });
```

---

## Параметры маршрутов

### Обязательные параметры

```php
// Один параметр
Route::get('/users/{id}', function ($id) {
    return "User: $id";
});

// Несколько параметров
Route::get('/posts/{post}/comments/{comment}', function ($postId, $commentId) {
    return "Post: $postId, Comment: $commentId";
});
```

### Необязательные параметры

```php
Route::get('/users/{name?}', function ($name = 'Guest') {
    return "Hello, $name";
});

Route::get('/page/{page?}', function ($page = 1) {
    return "Page: $page";
});
```

### Ограничения параметров

```php
// Регулярное выражение
Route::get('/users/{id}', function ($id) {
    // ...
})->where('id', '[0-9]+');

// Несколько ограничений
Route::get('/users/{id}/{name}', function ($id, $name) {
    // ...
})->where([
    'id' => '[0-9]+',
    'name' => '[a-zA-Z]+'
]);

// Вспомогательные методы
Route::get('/users/{id}', fn($id) => "User $id")
    ->whereNumber('id');

Route::get('/users/{name}', fn($name) => "User $name")
    ->whereAlpha('name');

Route::get('/users/{slug}', fn($slug) => "User $slug")
    ->whereAlphaNumeric('slug');

Route::get('/category/{category}', fn($category) => $category)
    ->whereIn('category', ['movie', 'song', 'book']);

// Глобальные ограничения (в RouteServiceProvider)
public function boot(): void
{
    Route::pattern('id', '[0-9]+');
}
```

---

## Именованные маршруты

```php
// Присвоение имени
Route::get('/dashboard', function () {
    return view('dashboard');
})->name('dashboard');

Route::get('/users/{id}/profile', function ($id) {
    // ...
})->name('users.profile');

// Генерация URL по имени
$url = route('dashboard');
$url = route('users.profile', ['id' => 1]);

// Редирект по имени
return redirect()->route('dashboard');
return to_route('users.profile', ['id' => 1]);

// Проверка текущего маршрута
if ($request->routeIs('dashboard')) {
    // ...
}

// В Blade
@if(Route::is('dashboard'))
    <span>На главной</span>
@endif
```

---

## Контроллеры

### Привязка к контроллеру

```php
use App\Http\Controllers\UserController;

// Один метод
Route::get('/users', [UserController::class, 'index']);
Route::get('/users/{id}', [UserController::class, 'show']);
Route::post('/users', [UserController::class, 'store']);

// Invokable контроллер (один метод __invoke)
Route::get('/dashboard', DashboardController::class);
```

### Resource контроллер

```php
// Все CRUD маршруты
Route::resource('posts', PostController::class);

// Генерируемые маршруты:
// GET    /posts              → index    → posts.index
// GET    /posts/create       → create   → posts.create
// POST   /posts              → store    → posts.store
// GET    /posts/{post}       → show     → posts.show
// GET    /posts/{post}/edit  → edit     → posts.edit
// PUT    /posts/{post}       → update   → posts.update
// DELETE /posts/{post}       → destroy  → posts.destroy

// Частичный ресурс
Route::resource('posts', PostController::class)
    ->only(['index', 'show']);

Route::resource('posts', PostController::class)
    ->except(['create', 'edit']);

// API ресурс (без create и edit)
Route::apiResource('posts', PostController::class);

// Несколько ресурсов
Route::resources([
    'posts' => PostController::class,
    'comments' => CommentController::class,
]);
```

### Вложенные ресурсы

```php
// Полная вложенность
Route::resource('posts.comments', CommentController::class);
// /posts/{post}/comments
// /posts/{post}/comments/{comment}

// Поверхностная вложенность
Route::resource('posts.comments', CommentController::class)->shallow();
// /posts/{post}/comments       (index, create, store)
// /comments/{comment}          (show, edit, update, destroy)
```

---

## Группировка маршрутов

### Middleware

```php
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', function () {
        return view('dashboard');
    });

    Route::get('/profile', function () {
        return view('profile');
    });
});

// Несколько middleware
Route::middleware(['auth', 'verified'])->group(function () {
    // ...
});
```

### Префикс

```php
Route::prefix('admin')->group(function () {
    Route::get('/users', function () {
        // /admin/users
    });

    Route::get('/posts', function () {
        // /admin/posts
    });
});
```

### Префикс имени

```php
Route::name('admin.')->group(function () {
    Route::get('/users', function () {
        // ...
    })->name('users'); // admin.users
});
```

### Controller

```php
Route::controller(UserController::class)->group(function () {
    Route::get('/users', 'index');
    Route::get('/users/{id}', 'show');
    Route::post('/users', 'store');
});
```

### Комбинирование

```php
Route::prefix('admin')
    ->name('admin.')
    ->middleware(['auth', 'admin'])
    ->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard'])
            ->name('dashboard');

        Route::resource('users', AdminUserController::class);
    });
```

---

## Специальные маршруты

### Редирект

```php
// Простой редирект
Route::redirect('/old', '/new');

// Постоянный редирект (301)
Route::redirect('/old', '/new', 301);
Route::permanentRedirect('/old', '/new');
```

### View маршрут

```php
// Возврат view напрямую
Route::view('/welcome', 'welcome');

// С данными
Route::view('/about', 'about', ['name' => 'Laravel']);
```

### Fallback маршрут

```php
// 404 для несуществующих маршрутов
Route::fallback(function () {
    return response()->view('errors.404', [], 404);
});
```

---

## Route Model Binding

### Неявная привязка

```php
// Модель автоматически загружается по ID
Route::get('/users/{user}', function (User $user) {
    return $user->name;
});

// По другому полю
Route::get('/users/{user:slug}', function (User $user) {
    return $user;
});

// В контроллере
class UserController extends Controller
{
    public function show(User $user)
    {
        return view('users.show', compact('user'));
    }
}
```

### Кастомизация в модели

```php
class User extends Model
{
    // Использовать slug вместо id
    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
```

### Явная привязка

```php
// В RouteServiceProvider
public function boot(): void
{
    Route::model('user', User::class);

    // С кастомной логикой
    Route::bind('user', function ($value) {
        return User::where('slug', $value)
            ->orWhere('id', $value)
            ->firstOrFail();
    });
}
```

### Soft Deleted модели

```php
// Включить soft deleted записи
Route::get('/users/{user}', function (User $user) {
    return $user;
})->withTrashed();
```

---

## Кэширование маршрутов

```bash
# Создать кэш (для продакшена)
php artisan route:cache

# Очистить кэш
php artisan route:clear

# Показать все маршруты
php artisan route:list
php artisan route:list --path=api
php artisan route:list --name=admin
php artisan route:list --method=GET
```

---

## CORS

```php
// config/cors.php
return [
    'paths' => ['api/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['*'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];
```

---

## Rate Limiting

```php
// В RouteServiceProvider
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;

protected function configureRateLimiting(): void
{
    // 60 запросов в минуту
    RateLimiter::for('api', function (Request $request) {
        return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
    });

    // Кастомный лимитер
    RateLimiter::for('uploads', function (Request $request) {
        return $request->user()->isPremium()
            ? Limit::none()
            : Limit::perMinute(10);
    });
}

// Применение
Route::middleware(['throttle:api'])->group(function () {
    Route::get('/users', [UserController::class, 'index']);
});

Route::post('/upload', [UploadController::class, 'store'])
    ->middleware('throttle:uploads');
```

---

## Примеры

### Полный пример web.php

```php
<?php

use App\Http\Controllers\{
    HomeController,
    PostController,
    CommentController,
    ProfileController,
    Admin\DashboardController,
    Admin\UserController as AdminUserController,
};
use Illuminate\Support\Facades\Route;

// Публичные маршруты
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/posts', [PostController::class, 'index'])->name('posts.index');
Route::get('/posts/{post:slug}', [PostController::class, 'show'])->name('posts.show');

// Авторизованные маршруты
Route::middleware(['auth'])->group(function () {
    // Профиль
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');

    // Посты
    Route::get('/posts/create', [PostController::class, 'create'])->name('posts.create');
    Route::post('/posts', [PostController::class, 'store'])->name('posts.store');
    Route::get('/posts/{post}/edit', [PostController::class, 'edit'])->name('posts.edit');
    Route::put('/posts/{post}', [PostController::class, 'update'])->name('posts.update');
    Route::delete('/posts/{post}', [PostController::class, 'destroy'])->name('posts.destroy');

    // Комментарии
    Route::post('/posts/{post}/comments', [CommentController::class, 'store'])
        ->name('posts.comments.store');
});

// Админка
Route::prefix('admin')
    ->name('admin.')
    ->middleware(['auth', 'admin'])
    ->group(function () {
        Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
        Route::resource('users', AdminUserController::class);
    });

// Fallback
Route::fallback(fn() => view('errors.404'));
```

### Полный пример api.php

```php
<?php

use App\Http\Controllers\Api\{
    AuthController,
    PostController,
    CommentController,
};
use Illuminate\Support\Facades\Route;

// Публичные API
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/posts', [PostController::class, 'index']);
Route::get('/posts/{post}', [PostController::class, 'show']);

// Защищенные API
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    Route::apiResource('posts', PostController::class)
        ->except(['index', 'show']);

    Route::apiResource('posts.comments', CommentController::class)
        ->shallow();
});
```
