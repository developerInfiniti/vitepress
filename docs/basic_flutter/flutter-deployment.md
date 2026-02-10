# Публікація Flutter застосунків

Публікація застосунку — це фінальний етап розробки. Розглянемо процес підготовки та публікації для Android (Google Play) та iOS (App Store).

## Підготовка до публікації

### Конфігурація застосунку

```yaml
# pubspec.yaml
name: my_app
description: Опис мого застосунку
version: 1.0.0+1  # version+buildNumber
publish_to: 'none'

environment:
  sdk: '>=3.0.0 <4.0.0'
```

### Іконки застосунку

```yaml
# pubspec.yaml
dev_dependencies:
  flutter_launcher_icons: ^0.13.0

flutter_launcher_icons:
  android: true
  ios: true
  image_path: "assets/icon/app_icon.png"
  min_sdk_android: 21
  adaptive_icon_background: "#FFFFFF"
  adaptive_icon_foreground: "assets/icon/app_icon_foreground.png"
```

```bash
# Генерація іконок
flutter pub run flutter_launcher_icons
```

### Splash Screen

```yaml
# pubspec.yaml
dev_dependencies:
  flutter_native_splash: ^2.3.0

flutter_native_splash:
  color: "#FFFFFF"
  image: assets/splash/splash.png
  android: true
  ios: true
  android_12:
    color: "#FFFFFF"
    icon_background_color: "#FFFFFF"
    image: assets/splash/splash_android12.png
```

```bash
flutter pub run flutter_native_splash:create
```

## Публікація для Android

### Налаштування build.gradle

```groovy
// android/app/build.gradle
android {
    compileSdkVersion 34

    defaultConfig {
        applicationId "com.example.myapp"
        minSdkVersion 21
        targetSdkVersion 34
        versionCode flutterVersionCode.toInteger()
        versionName flutterVersionName
    }

    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

### Підписання APK/AAB

```properties
# android/key.properties (НЕ додавайте в git!)
storePassword=your_store_password
keyPassword=your_key_password
keyAlias=your_key_alias
storeFile=/path/to/your/keystore.jks
```

```groovy
// android/app/build.gradle
def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file('key.properties')
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
    signingConfigs {
        release {
            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
            storeFile keystoreProperties['storeFile'] ? file(keystoreProperties['storeFile']) : null
            storePassword keystoreProperties['storePassword']
        }
    }

    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

### Створення keystore

```bash
keytool -genkey -v -keystore ~/upload-keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias upload
```

### Збірка для Google Play

```bash
# App Bundle (рекомендовано для Google Play)
flutter build appbundle --release

# APK (для прямого встановлення)
flutter build apk --release

# Split APK (менший розмір)
flutter build apk --split-per-abi
```

### ProGuard правила

```pro
# android/app/proguard-rules.pro
-keep class io.flutter.app.** { *; }
-keep class io.flutter.plugin.**  { *; }
-keep class io.flutter.util.**  { *; }
-keep class io.flutter.view.**  { *; }
-keep class io.flutter.**  { *; }
-keep class io.flutter.plugins.**  { *; }

# Firebase
-keep class com.google.firebase.** { *; }

# Retrofit/OkHttp (якщо використовуєте)
-dontwarn okhttp3.**
-dontwarn okio.**
```

### AndroidManifest.xml

```xml
<!-- android/app/src/main/AndroidManifest.xml -->
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <!-- Дозволи -->
    <uses-permission android:name="android.permission.INTERNET"/>
    <uses-permission android:name="android.permission.CAMERA"/>

    <application
        android:label="My App"
        android:name="${applicationName}"
        android:icon="@mipmap/ic_launcher"
        android:usesCleartextTraffic="false">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:launchMode="singleTop"
            android:theme="@style/LaunchTheme"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|smallestScreenSize|locale|layoutDirection|fontScale|screenLayout|density|uiMode"
            android:hardwareAccelerated="true"
            android:windowSoftInputMode="adjustResize">

            <intent-filter>
                <action android:name="android.intent.action.MAIN"/>
                <category android:name="android.intent.category.LAUNCHER"/>
            </intent-filter>
        </activity>

        <meta-data
            android:name="flutterEmbedding"
            android:value="2" />
    </application>
</manifest>
```

## Публікація для iOS

### Налаштування Xcode

1. Відкрийте `ios/Runner.xcworkspace` в Xcode
2. Виберіть Runner у Project Navigator
3. Налаштуйте:
   - Display Name
   - Bundle Identifier
   - Version та Build
   - Team (Apple Developer Account)
   - Deployment Target

### Info.plist

```xml
<!-- ios/Runner/Info.plist -->
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleDevelopmentRegion</key>
    <string>$(DEVELOPMENT_LANGUAGE)</string>
    <key>CFBundleDisplayName</key>
    <string>My App</string>
    <key>CFBundleExecutable</key>
    <string>$(EXECUTABLE_NAME)</string>
    <key>CFBundleIdentifier</key>
    <string>$(PRODUCT_BUNDLE_IDENTIFIER)</string>
    <key>CFBundleInfoDictionaryVersion</key>
    <string>6.0</string>
    <key>CFBundleName</key>
    <string>my_app</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleShortVersionString</key>
    <string>$(FLUTTER_BUILD_NAME)</string>
    <key>CFBundleVersion</key>
    <string>$(FLUTTER_BUILD_NUMBER)</string>

    <!-- Дозволи -->
    <key>NSCameraUsageDescription</key>
    <string>Ця програма потребує доступу до камери</string>
    <key>NSPhotoLibraryUsageDescription</key>
    <string>Ця програма потребує доступу до фотографій</string>
    <key>NSLocationWhenInUseUsageDescription</key>
    <string>Ця програма потребує доступу до вашого місцезнаходження</string>

    <key>UILaunchStoryboardName</key>
    <string>LaunchScreen</string>
    <key>UIMainStoryboardFile</key>
    <string>Main</string>
    <key>UISupportedInterfaceOrientations</key>
    <array>
        <string>UIInterfaceOrientationPortrait</string>
        <string>UIInterfaceOrientationLandscapeLeft</string>
        <string>UIInterfaceOrientationLandscapeRight</string>
    </array>
</dict>
</plist>
```

### Збірка для App Store

```bash
# Збірка iOS
flutter build ios --release

# Відкрити в Xcode для архівування
open ios/Runner.xcworkspace
```

### Архівування в Xcode

1. Product → Archive
2. Distribute App
3. App Store Connect
4. Upload

## Публікація для Web

```bash
# Збірка для web
flutter build web --release

# З базовим шляхом
flutter build web --base-href /my-app/

# Деплой на Firebase Hosting
firebase deploy --only hosting
```

### Firebase Hosting конфігурація

```json
// firebase.json
{
  "hosting": {
    "public": "build/web",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

## Environment та Build Flavors

### Dart defines

```bash
# Збірка з environment змінними
flutter build apk --dart-define=API_URL=https://api.production.com --dart-define=ENV=production
```

```dart
// Отримання в коді
const apiUrl = String.fromEnvironment('API_URL', defaultValue: 'https://api.dev.com');
const env = String.fromEnvironment('ENV', defaultValue: 'development');
```

### Build Flavors (Android)

```groovy
// android/app/build.gradle
android {
    flavorDimensions "environment"

    productFlavors {
        development {
            dimension "environment"
            applicationIdSuffix ".dev"
            versionNameSuffix "-dev"
            resValue "string", "app_name", "My App Dev"
        }

        staging {
            dimension "environment"
            applicationIdSuffix ".staging"
            versionNameSuffix "-staging"
            resValue "string", "app_name", "My App Staging"
        }

        production {
            dimension "environment"
            resValue "string", "app_name", "My App"
        }
    }
}
```

```bash
# Збірка з flavor
flutter build apk --flavor production --target lib/main_production.dart
```

## CI/CD

### GitHub Actions

```yaml
# .github/workflows/flutter.yml
name: Flutter CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Flutter
        uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.16.0'
          channel: 'stable'

      - name: Install dependencies
        run: flutter pub get

      - name: Analyze
        run: flutter analyze

      - name: Test
        run: flutter test

      - name: Build APK
        run: flutter build apk --release

      - name: Upload APK
        uses: actions/upload-artifact@v3
        with:
          name: release-apk
          path: build/app/outputs/flutter-apk/app-release.apk

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - name: Download APK
        uses: actions/download-artifact@v3
        with:
          name: release-apk

      - name: Deploy to Play Store
        uses: r0adkll/upload-google-play@v1
        with:
          serviceAccountJsonPlainText: ${{ secrets.PLAY_STORE_CONFIG_JSON }}
          packageName: com.example.myapp
          releaseFiles: app-release.apk
          track: internal
```

### Fastlane

```ruby
# ios/fastlane/Fastfile
default_platform(:ios)

platform :ios do
  desc "Deploy to TestFlight"
  lane :beta do
    build_app(
      workspace: "Runner.xcworkspace",
      scheme: "Runner",
      export_method: "app-store"
    )
    upload_to_testflight
  end

  desc "Deploy to App Store"
  lane :release do
    build_app(
      workspace: "Runner.xcworkspace",
      scheme: "Runner",
      export_method: "app-store"
    )
    upload_to_app_store(
      skip_metadata: true,
      skip_screenshots: true
    )
  end
end
```

```ruby
# android/fastlane/Fastfile
default_platform(:android)

platform :android do
  desc "Deploy to Play Store Internal"
  lane :internal do
    upload_to_play_store(
      track: 'internal',
      aab: '../build/app/outputs/bundle/release/app-release.aab'
    )
  end

  desc "Deploy to Play Store Production"
  lane :production do
    upload_to_play_store(
      track: 'production',
      aab: '../build/app/outputs/bundle/release/app-release.aab'
    )
  end
end
```

## Чек-лист перед публікацією

```markdown
## Android
- [ ] Унікальний applicationId
- [ ] Правильна версія та buildNumber
- [ ] Підписаний release build
- [ ] Мінімізація та ProGuard
- [ ] Іконки та splash screen
- [ ] Дозволи в AndroidManifest
- [ ] Тестування на різних пристроях

## iOS
- [ ] Унікальний Bundle Identifier
- [ ] Правильна версія та build
- [ ] Сертифікати та provisioning profiles
- [ ] Описи дозволів в Info.plist
- [ ] Іконки всіх розмірів
- [ ] Launch screen
- [ ] Тестування на різних iPhone/iPad

## Загальне
- [ ] Видалено debug код
- [ ] Протестовано в release режимі
- [ ] Перевірено privacy policy
- [ ] Підготовлено screenshots
- [ ] Написано опис застосунку
- [ ] Налаштовано analytics
```

## Найкращі практики

1. **Тестуйте release builds** — вони поводяться інакше, ніж debug.

2. **Використовуйте App Bundles** — менший розмір завантаження.

3. **Налаштуйте CI/CD** — автоматизуйте збірку та деплой.

4. **Зберігайте ключі безпечно** — не комітьте keystore та паролі.

5. **Версіонуйте правильно** — семантичне версіонування.

## Висновок

Публікація Flutter застосунку вимагає уважної підготовки для кожної платформи. Правильне налаштування підписання, конфігурації та CI/CD забезпечує надійний процес релізу та оновлення застосунку.
