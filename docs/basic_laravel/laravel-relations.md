# Связи Eloquent в Laravel

Связи позволяют работать со связанными данными в базе данных.

## Типы связей

| Связь | Описание |
|-------|----------|
| `hasOne` | Один к одному |
| `belongsTo` | Обратная связь |
| `hasMany` | Один ко многим |
| `belongsToMany` | Многие ко многим |
| `hasOneThrough` | Один к одному через |
| `hasManyThrough` | Один ко многим через |
| `morphOne` | Полиморфная один к одному |
| `morphMany` | Полиморфная один ко многим |
| `morphToMany` | Полиморфная многие ко многим |

---

## One to One (Один к одному)

```php
// User имеет один Profile
class User extends Model
{
    public function profile()
    {
        return $this->hasOne(Profile::class);
        // По умолчанию ищет user_id в таблице profiles
    }

    // С кастомным ключом
    public function profile()
    {
        return $this->hasOne(Profile::class, 'foreign_key', 'local_key');
    }
}

// Profile принадлежит User
class Profile extends Model
{
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

// Использование
$user = User::find(1);
$profile = $user->profile;        // Получить профиль
$user->profile()->create([...]);  // Создать профиль

$profile = Profile::find(1);
$user = $profile->user;           // Получить пользователя
```

---

## One to Many (Один ко многим)

```php
// User имеет много Posts
class User extends Model
{
    public function posts()
    {
        return $this->hasMany(Post::class);
    }
}

// Post принадлежит User
class Post extends Model
{
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Alias для author
    public function author()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}

// Использование
$user = User::find(1);
$posts = $user->posts;              // Collection постов
$posts = $user->posts()->get();     // То же самое

// Создание связанных записей
$user->posts()->create(['title' => 'New Post']);
$user->posts()->createMany([
    ['title' => 'Post 1'],
    ['title' => 'Post 2'],
]);

// Привязка существующей модели
$post = Post::find(1);
$user->posts()->save($post);
$user->posts()->saveMany([$post1, $post2]);

// Обратная связь
$post = Post::find(1);
$user = $post->user;
$author = $post->author;

// Привязка к родителю
$post->user()->associate($user);
$post->save();

// Отвязка
$post->user()->dissociate();
$post->save();
```

---

## Many to Many (Многие ко многим)

### Структура таблиц

```
users
    id - integer
    name - string

roles
    id - integer
    name - string

role_user (pivot table)
    user_id - integer
    role_id - integer
```

### Определение связи

```php
class User extends Model
{
    public function roles()
    {
        return $this->belongsToMany(Role::class);
    }

    // С кастомной pivot таблицей
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'user_roles', 'user_id', 'role_id');
    }
}

class Role extends Model
{
    public function users()
    {
        return $this->belongsToMany(User::class);
    }
}
```

### Pivot таблица

```php
// Доступ к pivot данным
$user = User::find(1);
foreach ($user->roles as $role) {
    echo $role->pivot->created_at;
}

// Дополнительные колонки в pivot
public function roles()
{
    return $this->belongsToMany(Role::class)
        ->withPivot('active', 'created_by')
        ->withTimestamps();
}

// Фильтрация по pivot
public function activeRoles()
{
    return $this->belongsToMany(Role::class)
        ->wherePivot('active', true);
}

// Кастомная pivot модель
public function roles()
{
    return $this->belongsToMany(Role::class)
        ->using(RoleUser::class)
        ->withPivot('active');
}

class RoleUser extends Pivot
{
    // Pivot модель
}
```

### Операции со связями

```php
// Attach (добавить связь)
$user->roles()->attach($roleId);
$user->roles()->attach([1, 2, 3]);
$user->roles()->attach($roleId, ['active' => true]);
$user->roles()->attach([
    1 => ['active' => true],
    2 => ['active' => false],
]);

// Detach (удалить связь)
$user->roles()->detach($roleId);
$user->roles()->detach([1, 2, 3]);
$user->roles()->detach(); // Удалить все

// Sync (синхронизировать)
$user->roles()->sync([1, 2, 3]);
$user->roles()->sync([
    1 => ['active' => true],
    2 => ['active' => false],
]);

// Sync без удаления
$user->roles()->syncWithoutDetaching([1, 2]);

// Toggle
$user->roles()->toggle([1, 2, 3]);

// Update pivot
$user->roles()->updateExistingPivot($roleId, ['active' => false]);
```

---

## Has One/Many Through (Через)

```php
// Country -> User -> Post
// Получить все посты страны через пользователей

class Country extends Model
{
    public function posts()
    {
        return $this->hasManyThrough(
            Post::class,     // Финальная модель
            User::class,     // Промежуточная модель
            'country_id',    // FK в users
            'user_id',       // FK в posts
            'id',            // PK в countries
            'id'             // PK в users
        );
    }
}

// Один через
class Mechanic extends Model
{
    public function carOwner()
    {
        return $this->hasOneThrough(
            Owner::class,
            Car::class,
            'mechanic_id',
            'car_id'
        );
    }
}

// Использование
$country = Country::find(1);
$posts = $country->posts;
```

---

## Полиморфные связи

### One to One/Many Polymorphic

```php
// Comments могут быть у Posts и Videos

// Миграция
Schema::create('comments', function (Blueprint $table) {
    $table->id();
    $table->text('body');
    $table->morphs('commentable'); // commentable_id + commentable_type
    $table->timestamps();
});

// Модели
class Comment extends Model
{
    public function commentable()
    {
        return $this->morphTo();
    }
}

class Post extends Model
{
    public function comments()
    {
        return $this->morphMany(Comment::class, 'commentable');
    }
}

class Video extends Model
{
    public function comments()
    {
        return $this->morphMany(Comment::class, 'commentable');
    }
}

// Использование
$post = Post::find(1);
$comments = $post->comments;
$post->comments()->create(['body' => 'Great post!']);

$comment = Comment::find(1);
$commentable = $comment->commentable; // Post или Video
```

### Many to Many Polymorphic

```php
// Tags могут быть у Posts и Videos

// Миграция
Schema::create('taggables', function (Blueprint $table) {
    $table->foreignId('tag_id');
    $table->morphs('taggable');
});

// Модели
class Tag extends Model
{
    public function posts()
    {
        return $this->morphedByMany(Post::class, 'taggable');
    }

    public function videos()
    {
        return $this->morphedByMany(Video::class, 'taggable');
    }
}

class Post extends Model
{
    public function tags()
    {
        return $this->morphToMany(Tag::class, 'taggable');
    }
}

class Video extends Model
{
    public function tags()
    {
        return $this->morphToMany(Tag::class, 'taggable');
    }
}

// Использование
$post->tags()->attach([1, 2, 3]);
$tag->posts;
$tag->videos;
```

---

## Eager Loading

### Проблема N+1

```php
// Плохо - N+1 запросов
$posts = Post::all();
foreach ($posts as $post) {
    echo $post->author->name; // Запрос для каждого поста!
}

// Хорошо - 2 запроса
$posts = Post::with('author')->get();
foreach ($posts as $post) {
    echo $post->author->name; // Данные уже загружены
}
```

### With

```php
// Одна связь
$posts = Post::with('author')->get();

// Несколько связей
$posts = Post::with(['author', 'category'])->get();

// Вложенные связи
$posts = Post::with('author.profile')->get();

// С условиями
$posts = Post::with(['comments' => function ($query) {
    $query->where('approved', true)
          ->orderBy('created_at', 'desc');
}])->get();

// Выбор колонок
$posts = Post::with('author:id,name,email')->get();

// Morph with
$activities = Activity::with(['subject' => function ($morphTo) {
    $morphTo->morphWith([
        Post::class => ['author'],
        Video::class => ['creator'],
    ]);
}])->get();
```

### Lazy Eager Loading

```php
$posts = Post::all();

// Загрузить связь позже
$posts->load('author');
$posts->load(['author', 'category']);

// С условиями
$posts->load(['comments' => function ($query) {
    $query->where('approved', true);
}]);

// Если еще не загружено
$posts->loadMissing('author');
```

### Default Eager Loading

```php
class Post extends Model
{
    // Всегда загружать эти связи
    protected $with = ['author'];
}

// Отключить для запроса
Post::without('author')->get();
```

---

## Querying Relations

### Has

```php
// Посты с комментариями
$posts = Post::has('comments')->get();

// С минимум 3 комментариями
$posts = Post::has('comments', '>=', 3)->get();

// Вложенная проверка
$posts = Post::has('comments.author')->get();

// С условием (whereHas)
$posts = Post::whereHas('comments', function ($query) {
    $query->where('approved', true);
})->get();

// Без связи
$posts = Post::doesntHave('comments')->get();

// Без связи с условием
$posts = Post::whereDoesntHave('comments', function ($query) {
    $query->where('spam', true);
})->get();
```

### With Count

```php
$posts = Post::withCount('comments')->get();
// $post->comments_count

// С условием
$posts = Post::withCount(['comments' => function ($query) {
    $query->where('approved', true);
}])->get();

// Несколько
$posts = Post::withCount(['comments', 'likes'])->get();

// Alias
$posts = Post::withCount([
    'comments',
    'comments as approved_comments_count' => fn($q) => $q->where('approved', true)
])->get();
```

### With Aggregate

```php
// With max/min/avg/sum
$posts = Post::withMax('comments', 'likes')->get();
// $post->comments_max_likes

$posts = Post::withAvg('ratings', 'score')->get();
// $post->ratings_avg_score

$posts = Post::withSum('orders', 'amount')->get();
// $post->orders_sum_amount
```

---

## Примеры связей

### Блог система

```php
class User extends Model
{
    public function posts()
    {
        return $this->hasMany(Post::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function profile()
    {
        return $this->hasOne(Profile::class);
    }
}

class Post extends Model
{
    public function author()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class);
    }
}

class Comment extends Model
{
    public function post()
    {
        return $this->belongsTo(Post::class);
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Вложенные комментарии
    public function replies()
    {
        return $this->hasMany(Comment::class, 'parent_id');
    }

    public function parent()
    {
        return $this->belongsTo(Comment::class, 'parent_id');
    }
}

// Запрос с eager loading
$posts = Post::with([
    'author.profile',
    'category',
    'comments' => fn($q) => $q->with('author')->latest()->limit(5),
    'tags'
])
->withCount('comments')
->published()
->latest()
->paginate(10);
```

### E-commerce

```php
class Order extends Model
{
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function products()
    {
        return $this->belongsToMany(Product::class, 'order_items')
            ->withPivot('quantity', 'price');
    }
}

class Product extends Model
{
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function orders()
    {
        return $this->belongsToMany(Order::class, 'order_items')
            ->withPivot('quantity', 'price');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}
```
