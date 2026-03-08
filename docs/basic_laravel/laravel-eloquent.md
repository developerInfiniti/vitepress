---
description: "Laravel Eloquent ORM: модели, отношения, запросы, scopes — работа с базой данных через ORM"
---

# Eloquent ORM в Laravel

Eloquent — это ORM (Object-Relational Mapping) для работы с базой данных.

## Создание модели

```bash
# Простая модель
php artisan make:model Post

# С миграцией
php artisan make:model Post -m

# С миграцией, фабрикой, сидером, контроллером
php artisan make:model Post -mfsc

# Все опции
php artisan make:model Post --all
```

---

## Базовая модель

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Post extends Model
{
    use HasFactory;

    // Таблица (по умолчанию - множественное число от имени модели)
    protected $table = 'posts';

    // Первичный ключ
    protected $primaryKey = 'id';

    // Автоинкремент
    public $incrementing = true;

    // Тип ключа
    protected $keyType = 'int';

    // Timestamps (created_at, updated_at)
    public $timestamps = true;

    // Формат даты
    protected $dateFormat = 'Y-m-d H:i:s';

    // Подключение к БД
    protected $connection = 'mysql';

    // Значения по умолчанию
    protected $attributes = [
        'status' => 'draft',
    ];
}
```

---

## Mass Assignment

```php
class Post extends Model
{
    // Разрешенные для массового заполнения
    protected $fillable = [
        'title',
        'content',
        'category_id',
        'published_at',
    ];

    // ИЛИ запрещенные (guarded)
    protected $guarded = ['id', 'created_at', 'updated_at'];

    // Разрешить все поля (осторожно!)
    protected $guarded = [];
}
```

---

## Получение данных

### Основные методы

```php
use App\Models\Post;

// Все записи
$posts = Post::all();

// С условиями
$posts = Post::where('status', 'published')->get();

// Первая запись
$post = Post::first();
$post = Post::where('slug', 'hello')->first();
$post = Post::firstWhere('slug', 'hello');

// По ID
$post = Post::find(1);
$post = Post::findOrFail(1);        // 404 если не найдено
$post = Post::findOr(1, fn() => abort(404));

// Несколько по ID
$posts = Post::find([1, 2, 3]);

// First or create
$post = Post::firstOrCreate(
    ['email' => 'john@example.com'],
    ['name' => 'John']
);

// First or new (без сохранения)
$post = Post::firstOrNew(
    ['email' => 'john@example.com'],
    ['name' => 'John']
);

// Update or create
$post = Post::updateOrCreate(
    ['email' => 'john@example.com'],
    ['name' => 'John Doe']
);
```

### Условия

```php
// Where
Post::where('status', 'published')->get();
Post::where('status', '=', 'published')->get();
Post::where('views', '>', 100)->get();
Post::where('title', 'like', '%Laravel%')->get();

// Multiple where
Post::where('status', 'published')
    ->where('category_id', 1)
    ->get();

// Where массив
Post::where([
    ['status', '=', 'published'],
    ['category_id', '=', 1],
])->get();

// Or where
Post::where('status', 'published')
    ->orWhere('featured', true)
    ->get();

// Where in
Post::whereIn('category_id', [1, 2, 3])->get();
Post::whereNotIn('category_id', [1, 2, 3])->get();

// Where null
Post::whereNull('published_at')->get();
Post::whereNotNull('published_at')->get();

// Where between
Post::whereBetween('views', [100, 1000])->get();
Post::whereNotBetween('views', [100, 1000])->get();

// Where date
Post::whereDate('created_at', '2024-01-01')->get();
Post::whereMonth('created_at', 12)->get();
Post::whereYear('created_at', 2024)->get();
Post::whereTime('created_at', '10:00:00')->get();

// Where column
Post::whereColumn('updated_at', '>', 'created_at')->get();
```

### Сортировка и лимиты

```php
// Order by
Post::orderBy('created_at', 'desc')->get();
Post::orderByDesc('created_at')->get();
Post::latest()->get();        // orderByDesc('created_at')
Post::oldest()->get();        // orderBy('created_at')
Post::inRandomOrder()->get();

// Limit / Offset
Post::limit(10)->get();
Post::take(10)->get();
Post::skip(5)->take(10)->get();
Post::offset(5)->limit(10)->get();
```

### Агрегация

```php
$count = Post::count();
$max = Post::max('views');
$min = Post::min('views');
$avg = Post::avg('views');
$sum = Post::sum('views');

// С условиями
$count = Post::where('status', 'published')->count();

// Exists
if (Post::where('email', $email)->exists()) { }
if (Post::where('email', $email)->doesntExist()) { }
```

---

## Создание и обновление

```php
// Create (массовое заполнение)
$post = Post::create([
    'title' => 'Hello World',
    'content' => 'Content here...',
]);

// Создание экземпляра и сохранение
$post = new Post();
$post->title = 'Hello World';
$post->content = 'Content here...';
$post->save();

// Update
$post = Post::find(1);
$post->title = 'Updated Title';
$post->save();

// Update через массив
$post->update(['title' => 'Updated Title']);

// Mass update
Post::where('status', 'draft')
    ->update(['status' => 'published']);

// Increment / Decrement
$post->increment('views');
$post->increment('views', 5);
$post->decrement('views');

// Update or Create
Post::updateOrCreate(
    ['slug' => 'hello-world'],
    ['title' => 'Hello World', 'content' => '...']
);
```

---

## Удаление

```php
// Delete по модели
$post = Post::find(1);
$post->delete();

// Delete по ID
Post::destroy(1);
Post::destroy([1, 2, 3]);

// Delete с условием
Post::where('status', 'draft')->delete();

// Truncate (удалить все)
Post::truncate();
```

---

## Soft Deletes

```php
use Illuminate\Database\Eloquent\SoftDeletes;

class Post extends Model
{
    use SoftDeletes;
}

// Миграция
$table->softDeletes(); // Добавляет deleted_at

// Использование
$post->delete();           // Soft delete
$post->forceDelete();      // Полное удаление

// Запросы
Post::all();                    // Без удаленных
Post::withTrashed()->get();     // Включая удаленные
Post::onlyTrashed()->get();     // Только удаленные

// Восстановление
$post->restore();

// Проверка
if ($post->trashed()) { }
```

---

## Scopes

### Local Scopes

```php
class Post extends Model
{
    // Простой scope
    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    // С параметром
    public function scopeOfCategory($query, $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }

    // Scope с условием
    public function scopePopular($query, $minViews = 100)
    {
        return $query->where('views', '>=', $minViews);
    }
}

// Использование
Post::published()->get();
Post::published()->ofCategory(1)->get();
Post::popular(500)->get();
```

### Global Scopes

```php
// Анонимный global scope
class Post extends Model
{
    protected static function booted()
    {
        static::addGlobalScope('published', function ($query) {
            $query->where('status', 'published');
        });
    }
}

// Класс scope
namespace App\Models\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class PublishedScope implements Scope
{
    public function apply(Builder $builder, Model $model)
    {
        $builder->where('status', 'published');
    }
}

// Применение
class Post extends Model
{
    protected static function booted()
    {
        static::addGlobalScope(new PublishedScope);
    }
}

// Отключение global scope
Post::withoutGlobalScope('published')->get();
Post::withoutGlobalScope(PublishedScope::class)->get();
Post::withoutGlobalScopes()->get();
```

---

## Accessors & Mutators

### Laravel 9+ (рекомендуется)

```php
use Illuminate\Database\Eloquent\Casts\Attribute;

class User extends Model
{
    // Accessor
    protected function firstName(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => ucfirst($value),
        );
    }

    // Mutator
    protected function email(): Attribute
    {
        return Attribute::make(
            set: fn ($value) => strtolower($value),
        );
    }

    // Accessor + Mutator
    protected function name(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => ucwords($value),
            set: fn ($value) => strtolower($value),
        );
    }

    // Вычисляемый атрибут
    protected function fullName(): Attribute
    {
        return Attribute::make(
            get: fn () => "{$this->first_name} {$this->last_name}",
        );
    }
}

// Использование
$user->first_name;  // Автоматически применяется accessor
$user->full_name;   // Вычисляемый атрибут
```

### Appending атрибутов в JSON

```php
class User extends Model
{
    protected $appends = ['full_name'];

    protected function fullName(): Attribute
    {
        return Attribute::make(
            get: fn () => "{$this->first_name} {$this->last_name}",
        );
    }
}

// Или динамически
$user->append('full_name')->toArray();
```

---

## Casts

```php
class Post extends Model
{
    protected $casts = [
        'is_published' => 'boolean',
        'published_at' => 'datetime',
        'metadata' => 'array',
        'options' => 'object',
        'price' => 'decimal:2',
        'settings' => AsArrayObject::class,
        'tags' => AsCollection::class,
        'status' => PostStatus::class,  // Enum
    ];
}

// Использование
$post->is_published;   // bool
$post->published_at;   // Carbon instance
$post->metadata;       // array
$post->metadata['key'] = 'value';
$post->save();
```

### Custom Cast

```php
namespace App\Casts;

use Illuminate\Contracts\Database\Eloquent\CastsAttributes;

class Json implements CastsAttributes
{
    public function get($model, $key, $value, $attributes)
    {
        return json_decode($value, true);
    }

    public function set($model, $key, $value, $attributes)
    {
        return json_encode($value);
    }
}

// Использование
protected $casts = [
    'options' => Json::class,
];
```

---

## События модели

```php
class Post extends Model
{
    protected static function booted()
    {
        // Перед созданием
        static::creating(function ($post) {
            $post->slug = Str::slug($post->title);
        });

        // После создания
        static::created(function ($post) {
            // Отправить уведомление
        });

        // Перед обновлением
        static::updating(function ($post) {
            if ($post->isDirty('title')) {
                $post->slug = Str::slug($post->title);
            }
        });

        // Перед удалением
        static::deleting(function ($post) {
            $post->comments()->delete();
        });
    }
}

// Доступные события:
// retrieved, creating, created, updating, updated,
// saving, saved, deleting, deleted, restoring, restored,
// replicating, forceDeleting, forceDeleted
```

### Observers

```bash
php artisan make:observer PostObserver --model=Post
```

```php
namespace App\Observers;

use App\Models\Post;

class PostObserver
{
    public function creating(Post $post)
    {
        $post->slug = Str::slug($post->title);
        $post->user_id = auth()->id();
    }

    public function created(Post $post)
    {
        // Отправить уведомление
    }

    public function updated(Post $post)
    {
        Cache::forget("post:{$post->id}");
    }

    public function deleted(Post $post)
    {
        // Очистить связанные данные
    }
}

// Регистрация в AppServiceProvider
public function boot()
{
    Post::observe(PostObserver::class);
}
```

---

## Полезные методы

```php
// Проверка изменений
$post->isDirty();              // Есть изменения
$post->isDirty('title');       // Изменен title
$post->isClean();              // Нет изменений
$post->wasChanged('title');    // Был изменен после сохранения

// Оригинальные значения
$post->getOriginal('title');

// Refresh из БД
$post->refresh();

// Replicate (копия)
$newPost = $post->replicate();
$newPost->title = 'Copy of ' . $post->title;
$newPost->save();

// Touch (обновить timestamps)
$post->touch();

// Fresh (новый экземпляр из БД)
$freshPost = $post->fresh();

// toArray / toJson
$array = $post->toArray();
$json = $post->toJson();
```
