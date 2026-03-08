---
description: "Миграции Laravel: создание таблиц, изменение схемы, seeders — управление структурой базы данных"
---

# Миграции в Laravel

Миграции — это версионный контроль для базы данных.

## Основные команды

```bash
# Создание миграции
php artisan make:migration create_posts_table
php artisan make:migration add_status_to_posts_table

# Запуск миграций
php artisan migrate

# Откат последней миграции
php artisan migrate:rollback

# Откат нескольких шагов
php artisan migrate:rollback --step=3

# Откат всех миграций
php artisan migrate:reset

# Откат и повторный запуск
php artisan migrate:refresh
php artisan migrate:refresh --seed

# Удалить все таблицы и запустить миграции
php artisan migrate:fresh
php artisan migrate:fresh --seed

# Статус миграций
php artisan migrate:status
```

---

## Структура миграции

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Выполнить миграцию
     */
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('content');
            $table->timestamps();
        });
    }

    /**
     * Откатить миграцию
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
```

---

## Типы колонок

### Числовые типы

```php
$table->id();                        // BIGINT UNSIGNED AUTO_INCREMENT
$table->bigIncrements('id');         // То же что id()
$table->increments('id');            // INT UNSIGNED AUTO_INCREMENT

$table->bigInteger('votes');         // BIGINT
$table->integer('votes');            // INT
$table->mediumInteger('votes');      // MEDIUMINT
$table->smallInteger('votes');       // SMALLINT
$table->tinyInteger('votes');        // TINYINT

$table->unsignedBigInteger('user_id');
$table->unsignedInteger('votes');
$table->unsignedSmallInteger('votes');
$table->unsignedTinyInteger('level');

$table->decimal('amount', 8, 2);     // DECIMAL(8,2)
$table->double('amount', 8, 2);      // DOUBLE(8,2)
$table->float('amount', 8, 2);       // FLOAT(8,2)
```

### Строковые типы

```php
$table->string('name');              // VARCHAR(255)
$table->string('name', 100);         // VARCHAR(100)

$table->char('code', 2);             // CHAR(2)

$table->text('description');         // TEXT
$table->mediumText('description');   // MEDIUMTEXT
$table->longText('content');         // LONGTEXT
$table->tinyText('note');            // TINYTEXT
```

### Дата и время

```php
$table->date('birthday');            // DATE
$table->dateTime('published_at');    // DATETIME
$table->dateTimeTz('published_at');  // DATETIME с timezone
$table->time('start_time');          // TIME
$table->timeTz('start_time');        // TIME с timezone
$table->timestamp('added_at');       // TIMESTAMP
$table->timestampTz('added_at');     // TIMESTAMP с timezone
$table->timestamps();                // created_at и updated_at
$table->timestampsTz();              // С timezone
$table->softDeletes();               // deleted_at
$table->softDeletesTz();             // С timezone
$table->year('year');                // YEAR
```

### Бинарные и JSON

```php
$table->binary('data');              // BLOB
$table->json('options');             // JSON
$table->jsonb('options');            // JSONB (PostgreSQL)
```

### Специальные типы

```php
$table->boolean('active');           // BOOLEAN
$table->enum('status', ['pending', 'active', 'closed']);
$table->set('flavors', ['strawberry', 'vanilla']);

$table->ipAddress('visitor_ip');     // IP адрес
$table->macAddress('device_mac');    // MAC адрес

$table->uuid('id');                  // UUID
$table->ulid('id');                  // ULID
$table->foreignId('user_id');        // BIGINT UNSIGNED
$table->foreignUuid('user_id');      // UUID

$table->geometry('position');
$table->point('position');
$table->polygon('area');

$table->rememberToken();             // remember_token VARCHAR(100)
$table->morphs('taggable');          // taggable_id и taggable_type
$table->nullableMorphs('taggable');
$table->uuidMorphs('taggable');
```

---

## Модификаторы колонок

```php
$table->string('email')->nullable();           // NULL разрешен
$table->string('email')->default('guest');     // Значение по умолчанию
$table->integer('votes')->unsigned();          // UNSIGNED
$table->string('name')->unique();              // Уникальный индекс
$table->integer('position')->primary();        // Первичный ключ
$table->string('email')->index();              // Обычный индекс

$table->string('bio')->nullable()->default(null);
$table->timestamp('published_at')->useCurrent();       // CURRENT_TIMESTAMP
$table->timestamp('updated_at')->useCurrentOnUpdate(); // ON UPDATE

$table->string('name')->after('email');        // После колонки
$table->string('name')->first();               // Первой колонкой
$table->string('name')->comment('Имя');        // Комментарий
$table->string('name')->collation('utf8mb4_unicode_ci');
$table->string('name')->charset('utf8mb4');
$table->string('name')->invisible();           // Скрыта из SELECT *
$table->string('name')->change();              // Изменение колонки
```

---

## Индексы

```php
// При создании колонки
$table->string('email')->unique();
$table->string('name')->index();
$table->text('content')->fulltext();

// Отдельно
$table->primary('id');
$table->primary(['first_id', 'second_id']); // Составной

$table->unique('email');
$table->unique('email', 'users_email_unique'); // С именем
$table->unique(['email', 'name']);  // Составной

$table->index('state');
$table->index(['account_id', 'created_at']);

$table->fullText('body');
$table->spatialIndex('location');

// Удаление индексов
$table->dropPrimary('users_id_primary');
$table->dropUnique('users_email_unique');
$table->dropIndex('posts_state_index');
$table->dropFullText('posts_body_fulltext');
$table->dropSpatialIndex('geo_location_spatialindex');
```

---

## Foreign Keys

```php
// Простой способ (convention)
$table->foreignId('user_id')->constrained();
// Создает user_id BIGINT UNSIGNED с FK на users.id

// С дополнительными опциями
$table->foreignId('user_id')
    ->constrained()
    ->onUpdate('cascade')
    ->onDelete('cascade');

// К другой таблице
$table->foreignId('author_id')
    ->constrained('users');

// К другой колонке
$table->foreignId('user_id')
    ->constrained(
        table: 'users',
        column: 'id',
        indexName: 'posts_user_id'
    );

// Nullable foreign key
$table->foreignId('user_id')
    ->nullable()
    ->constrained()
    ->nullOnDelete();

// Традиционный способ
$table->unsignedBigInteger('user_id');
$table->foreign('user_id')
    ->references('id')
    ->on('users')
    ->onDelete('cascade');

// Удаление FK
$table->dropForeign('posts_user_id_foreign');
$table->dropForeign(['user_id']);

// Отключить FK при миграции
Schema::disableForeignKeyConstraints();
// ... операции
Schema::enableForeignKeyConstraints();
```

---

## Операции с таблицами

### Создание таблицы

```php
Schema::create('posts', function (Blueprint $table) {
    $table->id();
    $table->string('title');
    $table->text('content');
    $table->foreignId('user_id')->constrained();
    $table->enum('status', ['draft', 'published'])->default('draft');
    $table->timestamps();
    $table->softDeletes();
});
```

### Изменение таблицы

```php
Schema::table('posts', function (Blueprint $table) {
    // Добавить колонку
    $table->string('slug')->after('title');

    // Изменить колонку
    $table->string('title', 500)->change();

    // Переименовать колонку
    $table->renameColumn('old_name', 'new_name');

    // Удалить колонку
    $table->dropColumn('votes');
    $table->dropColumn(['votes', 'avatar']);

    // Удалить колонки timestamps
    $table->dropTimestamps();
    $table->dropSoftDeletes();
});
```

### Проверка существования

```php
if (Schema::hasTable('users')) {
    // Таблица существует
}

if (Schema::hasColumn('users', 'email')) {
    // Колонка существует
}

if (Schema::hasColumns('users', ['email', 'name'])) {
    // Все колонки существуют
}
```

### Переименование и удаление

```php
// Переименовать таблицу
Schema::rename('old_table', 'new_table');

// Удалить таблицу
Schema::drop('users');
Schema::dropIfExists('users');
```

---

## Полные примеры

### Блог система

```php
// create_categories_table
Schema::create('categories', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('slug')->unique();
    $table->text('description')->nullable();
    $table->timestamps();
});

// create_posts_table
Schema::create('posts', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
    $table->string('title');
    $table->string('slug')->unique();
    $table->text('excerpt')->nullable();
    $table->longText('content');
    $table->string('featured_image')->nullable();
    $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
    $table->timestamp('published_at')->nullable();
    $table->unsignedBigInteger('views')->default(0);
    $table->timestamps();
    $table->softDeletes();

    $table->index(['status', 'published_at']);
    $table->fullText(['title', 'content']);
});

// create_tags_table
Schema::create('tags', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('slug')->unique();
    $table->timestamps();
});

// create_post_tag_table (pivot)
Schema::create('post_tag', function (Blueprint $table) {
    $table->foreignId('post_id')->constrained()->onDelete('cascade');
    $table->foreignId('tag_id')->constrained()->onDelete('cascade');
    $table->primary(['post_id', 'tag_id']);
});

// create_comments_table
Schema::create('comments', function (Blueprint $table) {
    $table->id();
    $table->foreignId('post_id')->constrained()->onDelete('cascade');
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->foreignId('parent_id')->nullable()
        ->constrained('comments')->onDelete('cascade');
    $table->text('body');
    $table->boolean('approved')->default(false);
    $table->timestamps();

    $table->index(['post_id', 'approved']);
});
```

### E-commerce

```php
// create_products_table
Schema::create('products', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('slug')->unique();
    $table->text('description')->nullable();
    $table->decimal('price', 10, 2);
    $table->decimal('sale_price', 10, 2)->nullable();
    $table->unsignedInteger('stock')->default(0);
    $table->string('sku')->unique();
    $table->json('attributes')->nullable();
    $table->boolean('active')->default(true);
    $table->timestamps();
    $table->softDeletes();
});

// create_orders_table
Schema::create('orders', function (Blueprint $table) {
    $table->id();
    $table->string('number')->unique();
    $table->foreignId('user_id')->constrained();
    $table->enum('status', ['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
        ->default('pending');
    $table->decimal('subtotal', 10, 2);
    $table->decimal('tax', 10, 2)->default(0);
    $table->decimal('shipping', 10, 2)->default(0);
    $table->decimal('total', 10, 2);
    $table->text('notes')->nullable();
    $table->timestamps();

    $table->index(['user_id', 'status']);
});

// create_order_items_table
Schema::create('order_items', function (Blueprint $table) {
    $table->id();
    $table->foreignId('order_id')->constrained()->onDelete('cascade');
    $table->foreignId('product_id')->constrained();
    $table->string('name');
    $table->decimal('price', 10, 2);
    $table->unsignedInteger('quantity');
    $table->decimal('total', 10, 2);
    $table->timestamps();
});
```

---

## Сидеры

```bash
# Создание сидера
php artisan make:seeder UserSeeder

# Запуск всех сидеров
php artisan db:seed

# Запуск конкретного сидера
php artisan db:seed --class=UserSeeder

# Миграция с сидами
php artisan migrate:fresh --seed
```

```php
// database/seeders/UserSeeder.php
namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Один пользователь
        User::create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
        ]);

        // Через фабрику
        User::factory()->count(50)->create();

        // С связями
        User::factory()
            ->count(10)
            ->has(Post::factory()->count(5))
            ->create();
    }
}

// database/seeders/DatabaseSeeder.php
class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            CategorySeeder::class,
            PostSeeder::class,
        ]);
    }
}
```

---

## Фабрики

```bash
php artisan make:factory PostFactory
```

```php
// database/factories/PostFactory.php
namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PostFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'title' => fake()->sentence(),
            'slug' => fake()->slug(),
            'content' => fake()->paragraphs(5, true),
            'status' => fake()->randomElement(['draft', 'published']),
            'published_at' => fake()->optional()->dateTimeBetween('-1 year', 'now'),
        ];
    }

    // Состояния
    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'published',
            'published_at' => now(),
        ]);
    }

    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'draft',
            'published_at' => null,
        ]);
    }
}

// Использование
Post::factory()->create();
Post::factory()->published()->create();
Post::factory()->count(10)->create();
Post::factory()->for($user)->create();
```
