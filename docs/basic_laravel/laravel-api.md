---
description: "API в Laravel: маршруты, ресурсы, токены, версионирование — создание RESTful API с примерами"
---

# API в Laravel

Создание RESTful API с Laravel.

## API маршруты

### Файл routes/api.php

```php
<?php

use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;

// Публичные маршруты
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/posts', [PostController::class, 'index']);
Route::get('/posts/{post}', [PostController::class, 'show']);

// Защищенные маршруты
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    Route::apiResource('posts', PostController::class)
        ->except(['index', 'show']);
});
```

Все маршруты в `api.php` автоматически получают префикс `/api`.

---

## API Resource Controller

### Создание

```bash
php artisan make:controller Api/PostController --api --model=Post
```

### Структура

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Http\Resources\PostResource;
use App\Http\Resources\PostCollection;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class PostController extends Controller
{
    /**
     * GET /api/posts
     */
    public function index(Request $request)
    {
        $posts = Post::query()
            ->when($request->search, fn($q, $search) =>
                $q->where('title', 'like', "%{$search}%")
            )
            ->when($request->category_id, fn($q, $id) =>
                $q->where('category_id', $id)
            )
            ->with(['author', 'category'])
            ->latest()
            ->paginate($request->per_page ?? 15);

        return new PostCollection($posts);
    }

    /**
     * POST /api/posts
     */
    public function store(StorePostRequest $request)
    {
        $post = $request->user()->posts()->create($request->validated());

        return new PostResource($post);
    }

    /**
     * GET /api/posts/{post}
     */
    public function show(Post $post)
    {
        $post->load(['author', 'category', 'comments.author']);

        return new PostResource($post);
    }

    /**
     * PUT /api/posts/{post}
     */
    public function update(UpdatePostRequest $request, Post $post)
    {
        $post->update($request->validated());

        return new PostResource($post);
    }

    /**
     * DELETE /api/posts/{post}
     */
    public function destroy(Post $post)
    {
        $this->authorize('delete', $post);

        $post->delete();

        return response()->noContent();
    }
}
```

---

## API Resources

Resources позволяют форматировать JSON ответы.

### Создание Resource

```bash
php artisan make:resource PostResource
php artisan make:resource PostCollection --collection
```

### Resource класс

```php
<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
{
    /**
     * Преобразование в массив
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'excerpt' => $this->excerpt,
            'content' => $this->content,
            'featured_image' => $this->featured_image
                ? asset('storage/' . $this->featured_image)
                : null,
            'status' => $this->status,
            'published_at' => $this->published_at?->toISOString(),
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),

            // Связи (загружаются условно)
            'author' => new UserResource($this->whenLoaded('author')),
            'category' => new CategoryResource($this->whenLoaded('category')),
            'tags' => TagResource::collection($this->whenLoaded('tags')),
            'comments' => CommentResource::collection($this->whenLoaded('comments')),

            // Счетчики
            'comments_count' => $this->whenCounted('comments'),

            // Условные поля
            'secret' => $this->when($request->user()?->isAdmin(), 'secret-value'),

            // Слияние данных
            $this->mergeWhen($this->is_published, [
                'views' => $this->views,
                'likes' => $this->likes,
            ]),
        ];
    }

    /**
     * Дополнительные метаданные
     */
    public function with(Request $request): array
    {
        return [
            'meta' => [
                'version' => '1.0',
            ],
        ];
    }
}
```

### Collection класс

```php
<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class PostCollection extends ResourceCollection
{
    /**
     * Класс ресурса для элементов
     */
    public $collects = PostResource::class;

    /**
     * Преобразование в массив
     */
    public function toArray(Request $request): array
    {
        return [
            'data' => $this->collection,
            'links' => [
                'self' => route('posts.index'),
            ],
        ];
    }

    /**
     * Метаданные для пагинации
     */
    public function paginationInformation($request, $paginated, $default): array
    {
        return [
            'meta' => [
                'current_page' => $paginated['current_page'],
                'last_page' => $paginated['last_page'],
                'per_page' => $paginated['per_page'],
                'total' => $paginated['total'],
            ],
        ];
    }
}
```

---

## Ответы API

### Успешные ответы

```php
// Одиночный ресурс
return new PostResource($post);

// Коллекция
return PostResource::collection($posts);

// Пагинация
return new PostCollection(Post::paginate(15));

// JSON напрямую
return response()->json([
    'message' => 'Success',
    'data' => $data,
]);

// С кодом статуса
return response()->json($data, 201);

// Без контента
return response()->noContent(); // 204
```

### Ответы с ошибками

```php
// Abort
abort(404);
abort(403, 'Forbidden');
abort_if(!$user->isAdmin(), 403);

// JSON ошибка
return response()->json([
    'message' => 'Resource not found',
    'errors' => [
        'id' => ['Post with this ID does not exist']
    ]
], 404);

// ValidationException
throw ValidationException::withMessages([
    'email' => ['Email is invalid'],
]);
```

---

## Обработка ошибок API

### Handler для API

```php
// bootstrap/app.php
->withExceptions(function (Exceptions $exceptions) {
    $exceptions->render(function (NotFoundHttpException $e, Request $request) {
        if ($request->is('api/*')) {
            return response()->json([
                'message' => 'Resource not found'
            ], 404);
        }
    });

    $exceptions->render(function (AuthenticationException $e, Request $request) {
        if ($request->is('api/*')) {
            return response()->json([
                'message' => 'Unauthenticated'
            ], 401);
        }
    });

    $exceptions->render(function (ValidationException $e, Request $request) {
        if ($request->is('api/*')) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        }
    });
})
```

---

## Версионирование API

### Через URL

```php
// routes/api.php
Route::prefix('v1')->group(function () {
    Route::apiResource('posts', Api\V1\PostController::class);
});

Route::prefix('v2')->group(function () {
    Route::apiResource('posts', Api\V2\PostController::class);
});
```

### Через заголовки

```php
class ApiVersion
{
    public function handle(Request $request, Closure $next)
    {
        $version = $request->header('Accept-Version', 'v1');

        config(['api.version' => $version]);

        return $next($request);
    }
}
```

---

## Rate Limiting

### Настройка

```php
// bootstrap/app.php
->withMiddleware(function (Middleware $middleware) {
    $middleware->throttleApi(limiter: 'api');
})

// В RouteServiceProvider или AppServiceProvider
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;

public function boot(): void
{
    RateLimiter::for('api', function (Request $request) {
        return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
    });

    // Разные лимиты для разных пользователей
    RateLimiter::for('uploads', function (Request $request) {
        return $request->user()?->isPremium()
            ? Limit::none()
            : Limit::perMinute(10)->by($request->user()->id);
    });
}
```

### Применение

```php
Route::middleware('throttle:api')->group(function () {
    Route::get('/posts', [PostController::class, 'index']);
});

Route::post('/upload', [UploadController::class, 'store'])
    ->middleware('throttle:uploads');
```

---

## CORS

```php
// config/cors.php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:3000', 'https://myapp.com'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
```

---

## Пагинация

### Стандартная пагинация

```php
// В контроллере
$posts = Post::paginate(15);
return new PostCollection($posts);

// JSON ответ автоматически включает:
// - data: массив элементов
// - links: first, last, prev, next
// - meta: current_page, last_page, per_page, total
```

### Cursor пагинация

Эффективнее для больших наборов данных.

```php
$posts = Post::orderBy('id')->cursorPaginate(15);
return PostResource::collection($posts);
```

### Simple пагинация

Только prev/next без общего количества.

```php
$posts = Post::simplePaginate(15);
```

---

## Фильтрация и сортировка

### Query Parameters

```php
// GET /api/posts?search=laravel&category=1&sort=-created_at

public function index(Request $request)
{
    $query = Post::query();

    // Поиск
    if ($request->has('search')) {
        $query->where('title', 'like', '%' . $request->search . '%');
    }

    // Фильтр по категории
    if ($request->has('category')) {
        $query->where('category_id', $request->category);
    }

    // Сортировка
    if ($request->has('sort')) {
        $sortField = ltrim($request->sort, '-');
        $sortDirection = str_starts_with($request->sort, '-') ? 'desc' : 'asc';
        $query->orderBy($sortField, $sortDirection);
    }

    return new PostCollection($query->paginate());
}
```

### Query Builder класс

```php
// app/Filters/PostFilter.php
class PostFilter
{
    public function __construct(
        protected Request $request
    ) {}

    public function apply(Builder $query): Builder
    {
        return $query
            ->when($this->request->search, fn($q, $s) =>
                $q->where('title', 'like', "%{$s}%")
            )
            ->when($this->request->category_id, fn($q, $id) =>
                $q->where('category_id', $id)
            )
            ->when($this->request->status, fn($q, $status) =>
                $q->where('status', $status)
            )
            ->when($this->request->sort, function($q, $sort) {
                $direction = str_starts_with($sort, '-') ? 'desc' : 'asc';
                $field = ltrim($sort, '-');
                return $q->orderBy($field, $direction);
            });
    }
}

// В контроллере
public function index(Request $request, PostFilter $filter)
{
    $posts = $filter->apply(Post::query())->paginate();
    return new PostCollection($posts);
}
```

---

## Полный пример API

### AuthController

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'unique:users'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Invalid credentials'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function user(Request $request)
    {
        return response()->json($request->user());
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }
}
```

### Тестирование API

```bash
# Регистрация
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"password","password_confirmation":"password"}'

# Вход
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password"}'

# Получение постов
curl http://localhost:8000/api/posts \
  -H "Authorization: Bearer YOUR_TOKEN"

# Создание поста
curl -X POST http://localhost:8000/api/posts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"New Post","content":"Content here"}'
```
