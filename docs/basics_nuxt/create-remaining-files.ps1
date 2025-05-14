# Скрипт для создания оставшихся файлов в директории basics_nuxt
$basePath = "c:\Users\User\PhpstormProjects\vitepress\docs\basics_nuxt"

$files = @(
    "authentication.md",
    "error-handling.md",
    "static-site-generation.md",
    "server-side-rendering.md",
    "api-routes.md",
    "content-module.md",
    "image-module.md",
    "pwa-module.md",
    "sitemap-module.md",
    "auth-module.md",
    "i18n-module.md",
    "axios-module.md",
    "firebase-module.md",
    "google-analytics-module.md"
)

foreach ($file in $files) {
    $filePath = Join-Path -Path $basePath -ChildPath $file
    
    if (-not (Test-Path $filePath)) {
        $title = $file -replace '\.md$', '' -replace '-', ' '
        $title = (Get-Culture).TextInfo.ToTitleCase($title)
        
        $content = @"
# $title

## Введение

Этот раздел содержит информацию о $title в Nuxt.js.

## Основное содержание

Скоро здесь появится подробная информация о $title в Nuxt.js.
"@
        
        Set-Content -Path $filePath -Value $content -Encoding UTF8
        Write-Host "Создан файл: $filePath"
    }
}

Write-Host "Все файлы успешно созданы!"