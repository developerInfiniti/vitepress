# Blade шаблонизатор в Laravel

Blade — это мощный шаблонизатор Laravel с простым синтаксисом.

## Основы

### Вывод данных

```blade
{{-- Экранированный вывод (защита от XSS) --}}
{{ $name }}
{{ $user->name }}
{{ config('app.name') }}

{{-- Неэкранированный вывод (осторожно!) --}}
{!! $htmlContent !!}

{{-- Значение по умолчанию --}}
{{ $name ?? 'Guest' }}
{{ $user->name ?? 'Anonymous' }}

{{-- Тернарный оператор --}}
{{ $isActive ? 'Active' : 'Inactive' }}

{{-- JSON --}}
<script>
    var user = {{ Js::from($user) }};
</script>
```

### Комментарии

```blade
{{-- Это комментарий Blade (не попадет в HTML) --}}

<!-- Это HTML комментарий (будет в HTML) -->
```

---

## Директивы

### Условия

```blade
@if($user)
    <p>Привет, {{ $user->name }}</p>
@endif

@if($count > 10)
    <p>Много записей</p>
@elseif($count > 0)
    <p>Есть записи</p>
@else
    <p>Нет записей</p>
@endif

{{-- Unless (если НЕ) --}}
@unless($user->isAdmin())
    <p>Вы не админ</p>
@endunless

{{-- Isset --}}
@isset($records)
    <p>Records существует</p>
@endisset

{{-- Empty --}}
@empty($records)
    <p>Records пуст</p>
@endempty

{{-- Проверка аутентификации --}}
@auth
    <p>Вы авторизованы</p>
@endauth

@guest
    <p>Вы гость</p>
@endguest

{{-- С guard --}}
@auth('admin')
    <p>Вы админ</p>
@endauth

{{-- Environment --}}
@env('local')
    <p>Локальное окружение</p>
@endenv

@env(['local', 'staging'])
    <p>Dev окружение</p>
@endenv

@production
    <p>Production</p>
@endproduction
```

### Циклы

```blade
{{-- foreach --}}
@foreach($users as $user)
    <p>{{ $user->name }}</p>
@endforeach

{{-- foreach с else --}}
@forelse($posts as $post)
    <article>{{ $post->title }}</article>
@empty
    <p>Нет постов</p>
@endforelse

{{-- for --}}
@for($i = 0; $i < 10; $i++)
    <p>Итерация {{ $i }}</p>
@endfor

{{-- while --}}
@while(true)
    <p>Бесконечный цикл</p>
    @break
@endwhile

{{-- continue и break --}}
@foreach($users as $user)
    @if($user->type === 'admin')
        @continue
    @endif

    @if($user->id === 5)
        @break
    @endif

    <p>{{ $user->name }}</p>
@endforeach

{{-- continue/break с условием --}}
@foreach($users as $user)
    @continue($user->type === 'admin')
    @break($user->id === 5)
    <p>{{ $user->name }}</p>
@endforeach
```

### Переменная $loop

```blade
@foreach($users as $user)
    @if($loop->first)
        <p>Первый элемент</p>
    @endif

    @if($loop->last)
        <p>Последний элемент</p>
    @endif

    <p>Индекс: {{ $loop->index }}</p>       {{-- 0-based --}}
    <p>Итерация: {{ $loop->iteration }}</p>  {{-- 1-based --}}
    <p>Осталось: {{ $loop->remaining }}</p>
    <p>Всего: {{ $loop->count }}</p>
    <p>Четный: {{ $loop->even }}</p>
    <p>Нечетный: {{ $loop->odd }}</p>
    <p>Глубина: {{ $loop->depth }}</p>

    {{-- В вложенных циклах --}}
    @foreach($user->posts as $post)
        <p>Родительский индекс: {{ $loop->parent->index }}</p>
    @endforeach
@endforeach
```

---

## Switch

```blade
@switch($type)
    @case('admin')
        <p>Администратор</p>
        @break

    @case('user')
        <p>Пользователь</p>
        @break

    @default
        <p>Гость</p>
@endswitch
```

---

## Классы и стили

```blade
{{-- Условные классы --}}
<div @class([
    'p-4',
    'font-bold' => $isActive,
    'text-red-500' => $hasError,
    'bg-gray-100' => !$isActive,
])>
    Контент
</div>

{{-- Условные стили --}}
<div @style([
    'background-color: red',
    'font-weight: bold' => $isActive,
])>
    Контент
</div>

{{-- Checked/Selected/Disabled --}}
<input type="checkbox" @checked($isChecked) />
<input type="checkbox" @checked(old('active', $user->active)) />

<option value="admin" @selected($user->role === 'admin')>Admin</option>
<option value="admin" @selected(old('role') === 'admin')>Admin</option>

<input type="text" @disabled($isDisabled) />
<input type="text" @readonly($isReadonly) />
<input type="text" @required($isRequired) />
```

---

## Layouts (Наследование)

### Layout файл

```blade
{{-- resources/views/layouts/app.blade.php --}}
<!DOCTYPE html>
<html>
<head>
    <title>@yield('title', config('app.name'))</title>
    @stack('styles')
</head>
<body>
    <nav>
        @include('partials.navigation')
    </nav>

    <main>
        @yield('content')
    </main>

    <footer>
        @include('partials.footer')
    </footer>

    @stack('scripts')
</body>
</html>
```

### Дочерний шаблон

```blade
{{-- resources/views/posts/index.blade.php --}}
@extends('layouts.app')

@section('title', 'Все посты')

@push('styles')
    <link rel="stylesheet" href="/css/posts.css">
@endpush

@section('content')
    <h1>Посты</h1>

    @foreach($posts as $post)
        <article>
            <h2>{{ $post->title }}</h2>
            <p>{{ $post->excerpt }}</p>
        </article>
    @endforeach

    {{ $posts->links() }}
@endsection

@push('scripts')
    <script src="/js/posts.js"></script>
@endpush
```

### Parent content

```blade
{{-- Layout --}}
@section('sidebar')
    Основной сайдбар
@show

{{-- Дочерний шаблон --}}
@section('sidebar')
    @parent
    <p>Дополнительный контент</p>
@endsection
```

---

## Компоненты

### Класс-компоненты

```bash
php artisan make:component Alert
```

```php
// app/View/Components/Alert.php
namespace App\View\Components;

use Illuminate\View\Component;

class Alert extends Component
{
    public function __construct(
        public string $type = 'info',
        public ?string $message = null,
    ) {}

    public function render()
    {
        return view('components.alert');
    }

    // Вычисляемые свойства
    public function alertClass(): string
    {
        return match($this->type) {
            'error' => 'bg-red-100 text-red-800',
            'success' => 'bg-green-100 text-green-800',
            default => 'bg-blue-100 text-blue-800',
        };
    }
}
```

```blade
{{-- resources/views/components/alert.blade.php --}}
<div {{ $attributes->merge(['class' => 'p-4 rounded ' . $alertClass()]) }}>
    @if($message)
        {{ $message }}
    @else
        {{ $slot }}
    @endif
</div>

{{-- Использование --}}
<x-alert type="success" message="Сохранено!" />

<x-alert type="error" class="mb-4">
    Произошла ошибка!
</x-alert>
```

### Анонимные компоненты

```blade
{{-- resources/views/components/button.blade.php --}}
@props([
    'type' => 'button',
    'variant' => 'primary',
])

@php
$classes = match($variant) {
    'primary' => 'bg-blue-500 text-white',
    'danger' => 'bg-red-500 text-white',
    'secondary' => 'bg-gray-200 text-gray-800',
    default => 'bg-blue-500 text-white',
};
@endphp

<button
    type="{{ $type }}"
    {{ $attributes->merge(['class' => 'px-4 py-2 rounded ' . $classes]) }}
>
    {{ $slot }}
</button>

{{-- Использование --}}
<x-button>Отправить</x-button>
<x-button type="submit" variant="danger">Удалить</x-button>
<x-button variant="secondary" class="ml-2">Отмена</x-button>
```

### Слоты

```blade
{{-- components/card.blade.php --}}
<div class="card">
    @isset($header)
        <div class="card-header">
            {{ $header }}
        </div>
    @endisset

    <div class="card-body">
        {{ $slot }}
    </div>

    @isset($footer)
        <div class="card-footer">
            {{ $footer }}
        </div>
    @endisset
</div>

{{-- Использование --}}
<x-card>
    <x-slot:header>
        <h3>Заголовок карточки</h3>
    </x-slot:header>

    <p>Контент карточки</p>

    <x-slot:footer>
        <button>Действие</button>
    </x-slot:footer>
</x-card>
```

### Атрибуты

```blade
@props(['disabled' => false])

<input
    {{ $disabled ? 'disabled' : '' }}
    {{ $attributes->merge(['class' => 'form-input']) }}
>

{{-- Условное слияние --}}
{{ $attributes->class(['p-4', 'bg-red' => $hasError]) }}

{{-- Фильтрация атрибутов --}}
{{ $attributes->whereStartsWith('wire:') }}
{{ $attributes->whereDoesntStartWith('wire:') }}

{{-- Получение значения --}}
{{ $attributes->get('class', 'default') }}

{{-- Проверка наличия --}}
@if($attributes->has('required'))
    <span>*</span>
@endif

{{-- Только определенные атрибуты --}}
{{ $attributes->only(['id', 'class']) }}
{{ $attributes->except(['class']) }}
```

---

## Include и подшаблоны

```blade
{{-- Простой include --}}
@include('partials.header')

{{-- С данными --}}
@include('partials.alert', ['message' => 'Привет!'])

{{-- Include если существует --}}
@includeIf('partials.optional')

{{-- Include с условием --}}
@includeWhen($user->isAdmin(), 'partials.admin-menu')
@includeUnless($user->isGuest(), 'partials.user-menu')

{{-- Include первого существующего --}}
@includeFirst(['custom.header', 'default.header'])

{{-- Each (include в цикле) --}}
@each('partials.post', $posts, 'post')
@each('partials.post', $posts, 'post', 'partials.no-posts')
```

---

## Формы

### CSRF и Method

```blade
<form method="POST" action="/posts">
    @csrf

    {{-- PUT/PATCH/DELETE --}}
    @method('PUT')
    {{-- или --}}
    <input type="hidden" name="_method" value="PUT">

    <button type="submit">Отправить</button>
</form>
```

### Ошибки валидации

```blade
{{-- Проверка наличия ошибок --}}
@if($errors->any())
    <div class="alert alert-danger">
        <ul>
            @foreach($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
    </div>
@endif

{{-- Ошибка конкретного поля --}}
@error('email')
    <span class="text-red-500">{{ $message }}</span>
@enderror

{{-- С bag --}}
@error('email', 'login')
    <span class="text-red-500">{{ $message }}</span>
@enderror

{{-- Условный класс при ошибке --}}
<input
    type="email"
    name="email"
    value="{{ old('email') }}"
    @class(['form-input', 'border-red-500' => $errors->has('email')])
>
```

### Старые значения

```blade
<input type="text" name="name" value="{{ old('name') }}">
<input type="text" name="name" value="{{ old('name', $user->name) }}">

<select name="country">
    @foreach($countries as $country)
        <option
            value="{{ $country->id }}"
            @selected(old('country', $user->country_id) == $country->id)
        >
            {{ $country->name }}
        </option>
    @endforeach
</select>

<textarea name="bio">{{ old('bio', $user->bio) }}</textarea>
```

---

## Авторизация

```blade
@can('update', $post)
    <a href="{{ route('posts.edit', $post) }}">Редактировать</a>
@endcan

@cannot('delete', $post)
    <p>Вы не можете удалить этот пост</p>
@endcannot

@canany(['update', 'delete'], $post)
    <div class="actions">
        {{-- Действия --}}
    </div>
@endcanany

{{-- Else варианты --}}
@can('update', $post)
    <button>Редактировать</button>
@else
    <p>Нет прав</p>
@endcan
```

---

## Полезные директивы

```blade
{{-- Raw PHP --}}
@php
    $currentTime = now();
    $greeting = $currentTime->hour < 12 ? 'Доброе утро' : 'Добрый день';
@endphp

{{-- Once (выполнить один раз) --}}
@once
    <style>
        .special { color: red; }
    </style>
@endonce

{{-- Verbatim (не обрабатывать Blade) --}}
@verbatim
    <div>
        {{ Это не будет обработано Blade }}
    </div>
@endverbatim

{{-- Session --}}
@session('status')
    <div class="alert">
        {{ $value }}
    </div>
@endsession

{{-- Fragment (для AJAX) --}}
@fragment('posts-list')
    @foreach($posts as $post)
        <div>{{ $post->title }}</div>
    @endforeach
@endfragment
```

---

## Кэширование

```bash
# Компиляция всех шаблонов
php artisan view:cache

# Очистка кэша
php artisan view:clear
```
