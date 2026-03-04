# Facade (Фасад)

## Описание

Паттерн **Facade** предоставляет объединённый упрощённый интерфейс к набору интерфейсов в подсистеме. Фасад определяет интерфейс более высокого уровня, который делает подсистему проще в использовании.

## Проблема

Вы используете сложную подсистему с множеством классов и методов. Клиентам нужно знать о деталях этой системы, что делает код сложным и хрупким.

## Решение

Создайте класс-фасад, который предоставляет простой интерфейс к сложной подсистеме.

## Реализация

### Базовый пример

```javascript
// Сложная подсистема с множеством компонентов
class CPU {
  freeze() {
    console.log('CPU: freezing');
  }

  jump(position) {
    console.log(`CPU: jumping to ${position}`);
  }

  execute() {
    console.log('CPU: executing');
  }
}

class RAM {
  load(address, data) {
    console.log(`RAM: loading ${data} to address ${address}`);
  }
}

class HD {
  read(lba, size) {
    console.log(`HD: reading sector ${lba} with size ${size}`);
    return 'data';
  }
}

class Memory {
  constructor() {
    this.realMemory = new RAM();
  }

  load(address, data) {
    this.realMemory.load(address, data);
  }
}

// Фасад - простой интерфейс для сложной системы
class ComputerFacade {
  constructor() {
    this.processor = new CPU();
    this.ram = new Memory();
    this.hd = new HD();
  }

  startComputer() {
    console.log('Computer starting...');
    this.processor.freeze();

    const bootSector = this.hd.read(0, 512);
    this.ram.load(0, bootSector);

    this.processor.jump(0);
    this.processor.execute();
    console.log('Computer started!');
  }
}

// Использование
const computer = new ComputerFacade();
computer.startComputer();
// Computer starting...
// CPU: freezing
// HD: reading sector 0 with size 512
// RAM: loading data to address 0
// CPU: jumping to 0
// CPU: executing
// Computer started!
```

### Пример: Система заказа в ресторане

```javascript
// Сложная подсистема ресторана
class Kitchen {
  prepareDish(dish) {
    console.log(`Kitchen: preparing ${dish}`);
  }
}

class Waiter {
  takeOrder(order) {
    console.log(`Waiter: taking order - ${order}`);
  }

  serveOrder(order) {
    console.log(`Waiter: serving ${order}`);
  }
}

class Cashier {
  processPayment(amount) {
    console.log(`Cashier: processing payment of $${amount}`);
    return true;
  }
}

class Delivery {
  arrange(address) {
    console.log(`Delivery: arranging delivery to ${address}`);
  }
}

// Фасад
class RestaurantFacade {
  constructor() {
    this.kitchen = new Kitchen();
    this.waiter = new Waiter();
    this.cashier = new Cashier();
    this.delivery = new Delivery();
  }

  orderMeal(meal, address, amount, dineIn = true) {
    this.waiter.takeOrder(meal);
    this.kitchen.prepareDish(meal);

    if (this.cashier.processPayment(amount)) {
      this.waiter.serveOrder(meal);

      if (!dineIn) {
        this.delivery.arrange(address);
      }

      console.log('Order completed!\n');
    }
  }
}

// Использование
const restaurant = new RestaurantFacade();

// Просто заказываем еду
restaurant.orderMeal('Pasta', '', 15.99, true);
// Waiter: taking order - Pasta
// Kitchen: preparing Pasta
// Cashier: processing payment of $15.99
// Waiter: serving Pasta
// Order completed!

restaurant.orderMeal('Pizza', '123 Main St', 20.50, false);
// Waiter: taking order - Pizza
// Kitchen: preparing Pizza
// Cashier: processing payment of $20.5
// Waiter: serving Pizza
// Delivery: arranging delivery to 123 Main St
// Order completed!
```

### Пример: API для работы с медиа

```javascript
// Сложная библиотека для работы с медиа
class AudioMixer {
  playAudio(file) {
    console.log(`Audio: playing ${file}`);
  }
}

class VideoPlayer {
  playVideo(file) {
    console.log(`Video: playing ${file}`);
  }
}

class SubtitleManager {
  loadSubtitles(file) {
    console.log(`Subtitles: loaded for ${file}`);
  }
}

class Equalizer {
  setPreset(preset) {
    console.log(`Equalizer: set to ${preset}`);
  }
}

// Фасад для упрощения
class MediaPlayerFacade {
  constructor() {
    this.audioMixer = new AudioMixer();
    this.videoPlayer = new VideoPlayer();
    this.subtitleManager = new SubtitleManager();
    this.equalizer = new Equalizer();
  }

  playMovie(videoFile, audioFile, subtitleFile, eqPreset = 'normal') {
    console.log(`Playing movie: ${videoFile}\n`);

    this.videoPlayer.playVideo(videoFile);
    this.audioMixer.playAudio(audioFile);
    this.subtitleManager.loadSubtitles(subtitleFile);
    this.equalizer.setPreset(eqPreset);

    console.log('Movie is now playing!\n');
  }

  playMusic(audioFile, eqPreset = 'music') {
    console.log(`Playing music: ${audioFile}\n`);

    this.audioMixer.playAudio(audioFile);
    this.equalizer.setPreset(eqPreset);

    console.log('Music is now playing!\n');
  }
}

// Использование
const player = new MediaPlayerFacade();

player.playMovie('movie.mp4', 'audio.mp3', 'subs.srt', 'cinema');
// Playing movie: movie.mp4
// Video: playing movie.mp4
// Audio: playing audio.mp3
// Subtitles: loaded for subs.srt
// Equalizer: set to cinema
// Movie is now playing!

player.playMusic('song.mp3', 'jazz');
// Playing music: song.mp3
// Audio: playing song.mp3
// Equalizer: set to jazz
// Music is now playing!
```

## Примеры в реальной жизни

### 1. jQuery - фасад для браузерных API

```javascript
// Без фасада
document.querySelectorAll('.button').forEach(el => {
  el.addEventListener('click', function() {
    this.style.backgroundColor = 'red';
  });
});

// С фасадом jQuery
jQuery('.button').on('click', function() {
  jQuery(this).css('backgroundColor', 'red');
});
```

### 2. Stripe Payment Facade

```javascript
// Сложная подсистема платежей
class StripeCard {
  tokenize() {
    console.log('Tokenizing card...');
    return 'tok_visa';
  }
}

class StripeCharge {
  create(token, amount) {
    console.log(`Creating charge of $${amount} with token ${token}`);
  }
}

class StripeCustomer {
  create(email) {
    console.log(`Creating customer ${email}`);
  }
}

// Фасад
class StripePaymentFacade {
  constructor() {
    this.card = new StripeCard();
    this.charge = new StripeCharge();
    this.customer = new StripeCustomer();
  }

  processPayment(email, amount, cardDetails) {
    this.customer.create(email);
    const token = this.card.tokenize();
    this.charge.create(token, amount);
  }
}

// Использование
const stripe = new StripePaymentFacade();
stripe.processPayment('user@example.com', 99.99, { /* card details */ });
```

### 3. Express.js middleware (фасад для HTTP)

```javascript
const app = express();

// Фасад для логирования, парсинга и валидации
app.use(express.json());
app.use(morgan('combined'));
app.use(cors());

// Клиент использует простой интерфейс
app.post('/api/users', (req, res) => {
  // Все сложности скрыты в фасадных middleware
  res.json({ success: true });
});
```

## Преимущества

- ✅ Изолирует клиентов от компонентов подсистемы
- ✅ Предоставляет простой интерфейс к сложной системе
- ✅ Слабо связывает клиентов с подсистемой
- ✅ Упрощает использование и понимание системы

## Недостатки

- ❌ Фасад может стать "богом объектом" со слишком большой ответственностью
- ❌ Не всегда возможно упростить все сценарии использования

## Когда использовать

- Нужно предоставить простой интерфейс к сложной подсистеме
- Нужно развязать клиентов от компонентов подсистемы
- Хотите структурировать подсистему в слои
- Нужна точка входа в многоуровневую систему

## Сравнение с другими паттернами

| Паттерн | Цель | Различие |
|---------|------|----------|
| **Facade** | Упрощает интерфейс к сложной системе | Новый простой интерфейс |
| **Adapter** | Делает несовместимые интерфейсы совместимыми | Преобразует существующие интерфейсы |
| **Decorator** | Добавляет функциональность | Оборачивает отдельный объект |
| **Proxy** | Контролирует доступ к объекту | Замещает доступ к объекту |
