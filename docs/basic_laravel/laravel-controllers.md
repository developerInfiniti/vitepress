---
description: "Контроллеры Laravel: resource, invokable, middleware — обработка HTTP запросов и бизнес-логика"
---

# Контроллеры в Laravel

Контроллеры группируют логику обработки HTTP-запросов в отдельные классы.

## Создание контроллера

```bash
# Базовый контроллер
php artisan make:controller UserController

# Resource контроллер
php artisan make:controller PostController --resource

# API контроллер
php artisan make:controller Api/PostController --api

# С моделью
php artisan make:controller PostController --resource --model=Post

# Invokable контроллер (один метод)
php artisan make:controller ShowDashboard --invokable
```

---

## Базовый контроллер

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        $users = User::all();
        return view('users.index', compact('users'));
    }

    public function show($id)
    {
        $user = User::findOrFail($id);
        return view('users.show', compact('user'));
    }

    public function store(Request $request)
    {
        $user = User::create($request->validated());
        return redirect()->route('users.show', $user);
    }
}
```

---

## Resource контроллер

```php
<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    /**
     * Список всех постов
     * GET /posts
     */
    public function index()
    {
        $posts = Post::latest()->paginate(10);
        return view('posts.index', compact('posts'));
    }

    /**
     * Форма создания
     * GET /posts/create
     */
    public function create()
    {
        return view('posts.create');
    }

    /**
     * Сохранение нового поста
     * POST /posts
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|max:255',
            'content' => 'required',
        ]);

        $post = Post::create($validated);

        return redirect()
            ->route('posts.show', $post)
            ->with('success', 'Пост создан!');
    }

    /**
     * Отображение поста
     * GET /posts/{post}
     */
    public function show(Post $post)
    {
        return view('posts.show', compact('post'));
    }

    /**
     * Форма редактирования
     * GET /posts/{post}/edit
     */
    public function edit(Post $post)
    {
        return view('posts.edit', compact('post'));
    }

    /**
     * Обновление поста
     * PUT /posts/{post}
     */
    public function update(Request $request, Post $post)
    {
        $validated = $request->validate([
            'title' => 'required|max:255',
            'content' => 'required',
        ]);

        $post->update($validated);

        return redirect()
            ->route('posts.show', $post)
            ->with('success', 'Пост обновлен!');
    }

    /**
     * Удаление поста
     * DELETE /posts/{post}
     */
    public function destroy(Post $post)
    {
        $post->delete();

        return redirect()
            ->route('posts.index')
            ->with('success', 'Пост удален!');
    }
}
```

---

## API контроллер

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PostResource;
use App\Http\Resources\PostCollection;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class PostController extends Controller
{
    public function index()
    {
        $posts = Post::with('author')->paginate(15);
        return new PostCollection($posts);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|max:255',
            'content' => 'required',
        ]);

        $post = $request->user()->posts()->create($validated);

        return new PostResource($post);
    }

    public function show(Post $post)
    {
        return new PostResource($post->load('author', 'comments'));
    }

    public function update(Request $request, Post $post)
    {
        $this->authorize('update', $post);

        $validated = $request->validate([
            'title' => 'sometimes|required|max:255',
            'content' => 'sometimes|required',
        ]);

        $post->update($validated);

        return new PostResource($post);
    }

    public function destroy(Post $post)
    {
        $this->authorize('delete', $post);

        $post->delete();

        return response()->noContent();
    }
}
```

---

## Invokable контроллер

```php
<?php

namespace App\Http\Controllers;

use App\Models\User;

class ShowDashboard extends Controller
{
    public function __invoke()
    {
        $stats = [
            'users' => User::count(),
            'posts' => Post::count(),
            'comments' => Comment::count(),
        ];

        return view('dashboard', compact('stats'));
    }
}

// Маршрут
Route::get('/dashboard', ShowDashboard::class);
```

---

## Dependency Injection

### В конструкторе

```php
<?php

namespace App\Http\Controllers;

use App\Services\UserService;
use App\Repositories\UserRepository;

class UserController extends Controller
{
    public function __construct(
        private UserService $userService,
        private UserRepository $repository
    ) {}

    public function index()
    {
        $users = $this->repository->getAllActive();
        return view('users.index', compact('users'));
    }

    public function store(Request $request)
    {
        $user = $this->userService->create($request->validated());
        return redirect()->route('users.show', $user);
    }
}
```

### В методе

```php
public function store(Request $request, UserService $userService)
{
    $user = $userService->create($request->validated());
    return redirect()->route('users.show', $user);
}
```

---

## Middleware в контроллере

### В конструкторе

```php
class PostController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
        $this->middleware('verified')->only(['create', 'store']);
        $this->middleware('throttle:10,1')->except(['index', 'show']);
    }
}
```

### Через атрибут (PHP 8+)

```php
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class PostController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            'auth',
            new Middleware('verified', only: ['create', 'store']),
            new Middleware('throttle:10,1', except: ['index', 'show']),
        ];
    }
}
```

---

## Ответы контроллера

### View

```php
// Простой view
return view('users.index');

// С данными
return view('users.index', ['users' => $users]);
return view('users.index', compact('users'));
return view('users.index')->with('users', $users);

// Проверка существования view
if (view()->exists('custom.page')) {
    return view('custom.page');
}

// Первый существующий view
return view()->first(['custom.page', 'default.page'], $data);
```

### Redirect

```php
// На URL
return redirect('/home');

// На именованный маршрут
return redirect()->route('home');
return redirect()->route('users.show', ['id' => 1]);
return to_route('users.show', ['id' => 1]);

// Назад
return redirect()->back();
return back();

// На action контроллера
return redirect()->action([UserController::class, 'index']);

// С flash данными
return redirect()->route('home')->with('status', 'Успешно!');
return redirect()->route('login')->withErrors(['email' => 'Неверный email']);
return redirect()->back()->withInput();
```

### JSON

```php
// Простой JSON
return response()->json(['name' => 'John', 'age' => 30]);

// С кодом статуса
return response()->json(['error' => 'Not found'], 404);

// JSONP
return response()->jsonp('callback', $data);
```

### Download / File

```php
// Скачивание файла
return response()->download($pathToFile);
return response()->download($pathToFile, 'filename.pdf');
return response()->download($pathToFile, 'filename.pdf', $headers);

// Отображение в браузере
return response()->file($pathToFile);

// Потоковое скачивание
return response()->streamDownload(function () {
    echo 'CSV content here...';
}, 'export.csv');
```

### Другие ответы

```php
// Пустой ответ
return response()->noContent();

// С заголовками
return response($content)
    ->header('Content-Type', 'text/plain')
    ->header('X-Custom-Header', 'value');

// С cookie
return response($content)->cookie('name', 'value', 60);

// Abort
abort(404);
abort(403, 'Доступ запрещен');
abort_if(!$user->isAdmin(), 403);
abort_unless($user->isAdmin(), 403);
```

---

## Form Requests

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
     * Проверка авторизации
     */
    public function authorize(): bool
    {
        return $this->user()->can('create', Post::class);
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
     * Кастомные сообщения
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Заголовок обязателен',
            'content.min' => 'Контент должен быть минимум :min символов',
        ];
    }

    /**
     * Кастомные названия атрибутов
     */
    public function attributes(): array
    {
        return [
            'title' => 'заголовок',
            'content' => 'содержимое',
        ];
    }

    /**
     * Подготовка данных перед валидацией
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'slug' => Str::slug($this->title),
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
        // Данные уже валидированы
        $post = Post::create($request->validated());

        // Или только определенные поля
        $post = Post::create($request->safe()->only(['title', 'content']));

        return redirect()->route('posts.show', $post);
    }
}
```

---

## Полезные паттерны

### Базовый контроллер с общей логикой

```php
<?php

namespace App\Http\Controllers;

abstract class Controller
{
    protected function respondWithSuccess($message, $data = null, $code = 200)
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $code);
    }

    protected function respondWithError($message, $code = 400)
    {
        return response()->json([
            'success' => false,
            'message' => $message,
        ], $code);
    }
}
```

### Traits для общей функциональности

```php
<?php

namespace App\Http\Controllers\Traits;

trait ApiResponse
{
    protected function success($data, $message = null, $code = 200)
    {
        return response()->json([
            'status' => 'success',
            'message' => $message,
            'data' => $data
        ], $code);
    }

    protected function error($message, $code = 400)
    {
        return response()->json([
            'status' => 'error',
            'message' => $message,
        ], $code);
    }
}

// Использование
class UserController extends Controller
{
    use ApiResponse;

    public function index()
    {
        $users = User::all();
        return $this->success($users, 'Users retrieved');
    }
}
```

### Single Action Controller с сервисом

```php
<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProcessPaymentRequest;
use App\Services\PaymentService;

class ProcessPaymentController extends Controller
{
    public function __invoke(
        ProcessPaymentRequest $request,
        PaymentService $paymentService
    ) {
        $result = $paymentService->process(
            $request->user(),
            $request->validated()
        );

        if ($result->failed()) {
            return back()->withErrors(['payment' => $result->message]);
        }

        return redirect()
            ->route('orders.show', $result->order)
            ->with('success', 'Оплата прошла успешно!');
    }
}
```
