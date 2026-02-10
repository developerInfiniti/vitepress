# Middleware в Laravel

Middleware — это фильтры HTTP-запросов, которые выполняются до или после запроса.

## Основы

### Создание middleware

```bash
php artisan make:middleware CheckAge
```

### Структура middleware

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckAge
{
    /**
     * Обработка входящего запроса
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->age <= 18) {
            return redirect('home');
        }

        return $next($request);
    }
}
```

---

## Типы Middleware

### Before Middleware

Выполняется ДО передачи запроса контроллеру.

```php
class BeforeMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        // Логика ДО обработки запроса
        Log::info('Request received: ' . $request->path());

        return $next($request);
    }
}
```

### After Middleware

Выполняется ПОСЛЕ обработки запроса контроллером.

```php
class AfterMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Логика ПОСЛЕ обработки запроса
        $response->header('X-Custom-Header', 'value');

        return $response;
    }
}
```

### Terminable Middleware

Выполняется после отправки ответа браузеру.

```php
class TerminableMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        return $next($request);
    }

    public function terminate(Request $request, Response $response): void
    {
        // Логика после отправки ответа
        // Полезно для логирования, аналитики
        Log::info('Request completed', [
            'path' => $request->path(),
            'status' => $response->status(),
        ]);
    }
}
```

---

## Регистрация Middleware

### Global Middleware

Применяется ко всем запросам.

```php
// bootstrap/app.php (Laravel 11+)
->withMiddleware(function (Middleware $middleware) {
    $middleware->append(\App\Http\Middleware\LogRequests::class);
})

// Или в начало стека
$middleware->prepend(\App\Http\Middleware\CheckMaintenance::class);
```

### Route Middleware

Применяется к конкретным маршрутам.

```php
// bootstrap/app.php (Laravel 11+)
->withMiddleware(function (Middleware $middleware) {
    $middleware->alias([
        'auth' => \App\Http\Middleware\Authenticate::class,
        'admin' => \App\Http\Middleware\CheckAdmin::class,
        'verified' => \App\Http\Middleware\EnsureEmailIsVerified::class,
    ]);
})
```

### Middleware Groups

```php
// bootstrap/app.php
->withMiddleware(function (Middleware $middleware) {
    $middleware->group('web', [
        \App\Http\Middleware\EncryptCookies::class,
        \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
        \Illuminate\Session\Middleware\StartSession::class,
        \Illuminate\View\Middleware\ShareErrorsFromSession::class,
        \App\Http\Middleware\VerifyCsrfToken::class,
        \Illuminate\Routing\Middleware\SubstituteBindings::class,
    ]);

    $middleware->group('api', [
        \Illuminate\Routing\Middleware\ThrottleRequests::class.':api',
        \Illuminate\Routing\Middleware\SubstituteBindings::class,
    ]);
})
```

---

## Применение Middleware

### К маршруту

```php
Route::get('/profile', function () {
    // ...
})->middleware('auth');

// Несколько middleware
Route::get('/admin', function () {
    // ...
})->middleware(['auth', 'admin']);

// Исключение middleware
Route::get('/public', function () {
    // ...
})->withoutMiddleware(['auth']);
```

### К группе маршрутов

```php
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', function () { });
    Route::get('/profile', function () { });
});

Route::middleware(['auth', 'verified', 'admin'])->group(function () {
    Route::get('/admin/users', [AdminUserController::class, 'index']);
    Route::get('/admin/settings', [AdminSettingsController::class, 'index']);
});
```

### В контроллере

```php
class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
        $this->middleware('verified')->only(['create', 'store']);
        $this->middleware('admin')->except(['index', 'show']);
    }
}

// Или через интерфейс (Laravel 11+)
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class UserController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            'auth',
            new Middleware('verified', only: ['create', 'store']),
            new Middleware('admin', except: ['index', 'show']),
        ];
    }
}
```

---

## Middleware с параметрами

```php
class CheckRole
{
    public function handle(Request $request, Closure $next, string $role): Response
    {
        if (!$request->user()->hasRole($role)) {
            abort(403, 'Unauthorized');
        }

        return $next($request);
    }
}

// Несколько параметров
class CheckRoleOrPermission
{
    public function handle(Request $request, Closure $next, string $role, string $permission): Response
    {
        if (!$request->user()->hasRole($role) && !$request->user()->can($permission)) {
            abort(403);
        }

        return $next($request);
    }
}
```

### Использование с параметрами

```php
Route::get('/admin', function () {
    // ...
})->middleware('role:admin');

Route::get('/editor', function () {
    // ...
})->middleware('role:editor,can_edit');

// В маршрутах
Route::middleware(['role:admin'])->group(function () {
    // ...
});
```

---

## Встроенные Middleware

### auth

```php
// Требует аутентификации
Route::get('/dashboard', fn() => view('dashboard'))
    ->middleware('auth');

// С конкретным guard
Route::get('/admin', fn() => view('admin'))
    ->middleware('auth:admin');
```

### guest

```php
// Только для гостей
Route::get('/login', fn() => view('login'))
    ->middleware('guest');
```

### verified

```php
// Требует подтвержденный email
Route::get('/settings', fn() => view('settings'))
    ->middleware(['auth', 'verified']);
```

### throttle

```php
// Rate limiting
Route::get('/api/users', fn() => User::all())
    ->middleware('throttle:60,1'); // 60 запросов в минуту

// Именованный limiter
Route::middleware(['throttle:api'])->group(function () {
    Route::get('/users', [UserController::class, 'index']);
});
```

### signed

```php
// Требует подписанный URL
Route::get('/unsubscribe/{user}', fn(User $user) => $user->unsubscribe())
    ->name('unsubscribe')
    ->middleware('signed');

// Генерация подписанного URL
$url = URL::signedRoute('unsubscribe', ['user' => $user->id]);
$url = URL::temporarySignedRoute('unsubscribe', now()->addMinutes(30), ['user' => $user->id]);
```

### can (авторизация)

```php
Route::put('/post/{post}', function (Post $post) {
    // ...
})->middleware('can:update,post');

Route::post('/posts', function () {
    // ...
})->middleware('can:create,App\Models\Post');
```

---

## Примеры Middleware

### Проверка роли

```php
class CheckRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (!$user || !$user->hasAnyRole($roles)) {
            if ($request->expectsJson()) {
                return response()->json(['error' => 'Forbidden'], 403);
            }

            abort(403, 'Access denied');
        }

        return $next($request);
    }
}

// Использование
Route::middleware('role:admin,moderator')->group(function () {
    // ...
});
```

### Логирование запросов

```php
class LogRequests
{
    public function handle(Request $request, Closure $next): Response
    {
        $startTime = microtime(true);

        $response = $next($request);

        $duration = microtime(true) - $startTime;

        Log::info('Request processed', [
            'method' => $request->method(),
            'path' => $request->path(),
            'status' => $response->status(),
            'duration' => round($duration * 1000, 2) . 'ms',
            'user_id' => $request->user()?->id,
            'ip' => $request->ip(),
        ]);

        return $response;
    }
}
```

### Локализация

```php
class SetLocale
{
    public function handle(Request $request, Closure $next): Response
    {
        // Из URL параметра
        if ($request->has('lang')) {
            $locale = $request->get('lang');
        }
        // Из сессии
        elseif (session()->has('locale')) {
            $locale = session()->get('locale');
        }
        // Из заголовка
        elseif ($request->hasHeader('Accept-Language')) {
            $locale = $request->getPreferredLanguage(['en', 'ru', 'uk']);
        }
        // По умолчанию
        else {
            $locale = config('app.locale');
        }

        if (in_array($locale, ['en', 'ru', 'uk'])) {
            app()->setLocale($locale);
            session()->put('locale', $locale);
        }

        return $next($request);
    }
}
```

### Режим обслуживания

```php
class CheckMaintenanceMode
{
    public function handle(Request $request, Closure $next): Response
    {
        if (config('app.maintenance_mode')) {
            // Разрешить доступ по IP
            $allowedIps = config('app.maintenance_allowed_ips', []);

            if (!in_array($request->ip(), $allowedIps)) {
                return response()->view('maintenance', [], 503);
            }
        }

        return $next($request);
    }
}
```

### CORS (ручная реализация)

```php
class HandleCors
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        $response->headers->set('Access-Control-Allow-Origin', '*');
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        return $response;
    }
}
```

### Проверка подписки

```php
class EnsureUserIsSubscribed
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user()?->subscribed('default')) {
            if ($request->expectsJson()) {
                return response()->json([
                    'error' => 'Subscription required'
                ], 402);
            }

            return redirect()->route('billing');
        }

        return $next($request);
    }
}
```

### Добавление заголовков безопасности

```php
class SecurityHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-XSS-Protection', '1; mode=block');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set('Content-Security-Policy', "default-src 'self'");

        return $response;
    }
}
```

---

## Приоритет Middleware

```php
// bootstrap/app.php
->withMiddleware(function (Middleware $middleware) {
    $middleware->priority([
        \App\Http\Middleware\StartSession::class,
        \App\Http\Middleware\Authenticate::class,
        \App\Http\Middleware\AuthorizeResource::class,
    ]);
})
```

---

## Исключения из CSRF

```php
// bootstrap/app.php
->withMiddleware(function (Middleware $middleware) {
    $middleware->validateCsrfTokens(except: [
        'stripe/*',
        'webhook/*',
    ]);
})
```
