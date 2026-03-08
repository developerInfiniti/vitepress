---
description: "ООП в PHP: классы, наследование, интерфейсы, трейты — объектно-ориентированное программирование"
---

# Основы PHP: Объектно-ориентированное программирование (ООП)

PHP предоставляет мощные возможности для объектно-ориентированного программирования, начиная с версии 5.

## Основные концепции ООП

* **Класс (Class):** Чертеж или шаблон для создания объектов. Он определяет свойства (атрибуты) и поведение (методы), которыми будут обладать объекты этого класса.
* **Объект (Object):** Экземпляр класса. Объект обладает свойствами, определенными классом, и может выполнять методы, определенные в классе.
* **Свойство (Property) или Атрибут:** Переменная, принадлежащая объекту. Представляет состояние объекта.
* **Метод (Method):** Функция, принадлежащая объекту. Определяет поведение объекта.
* **Инкапсуляция (Encapsulation):** Сокрытие внутренней реализации объекта и предоставление контролируемого доступа к его данным и методам через публичный интерфейс. Это помогает предотвратить случайное изменение внутреннего состояния объекта.
* **Наследование (Inheritance):** Механизм, позволяющий одному классу (дочернему или производному) наследовать свойства и методы другого класса (родительского или базового). Это способствует повторному использованию кода и созданию иерархий классов.
* **Полиморфизм (Polymorphism):** Возможность объектов разных классов реагировать на один и тот же метод по-разному. Это позволяет писать более гибкий и обобщенный код.

## Определение классов

Классы в PHP определяются с помощью ключевого слова `class`, за которым следует имя класса и тело класса, заключенное в фигурные скобки `{}`.

```php
<?php
class Car {
    // Свойства (атрибуты) класса
    public $color;
    public $model;

    // Метод класса
    public function startEngine() {
        echo "Двигатель заведен!\n";
    }

    public function setColor($newColor) {
        $this->color = $newColor;
    }

    public function getColor() {
        return $this->color;
    }
}
?>
```

* **`class Car`:** Объявление класса с именем `Car`. Имена классов обычно начинаются с заглавной буквы.
* **`public $color;` и `public $model;`:** Объявление публичных свойств `$color` и `$model`. К публичным свойствам можно обращаться из любого места.
* **`public function startEngine() { ... }`:** Объявление публичного метода `startEngine()`. К публичным методам также можно обращаться из любого места.
* **`$this`:** Специальная переменная, которая используется внутри методов класса для обращения к свойствам и методам текущего объекта.

## Создание объектов (экземпляров класса)

Для использования класса необходимо создать его объект (экземпляр). Это делается с помощью ключевого слова `new`.

```php
<?php
$myCar = new Car();
$anotherCar = new Car();

// Обращение к свойствам объекта
$myCar->color = "красный";
$myCar->model = "Toyota";

$anotherCar->color = "синий";
$anotherCar->model = "BMW";

echo "Моя машина: " . $myCar->color . " " . $myCar->model . "\n";
echo "Другая машина: " . $anotherCar->color . " " . $anotherCar->model . "\n";

// Вызов метода объекта
$myCar->startEngine(); // Выведет: Двигатель заведен!
?>
```

## Конструктор (`__construct`)

Конструктор — это специальный метод класса, который автоматически вызывается при создании нового объекта этого класса. Он используется для инициализации свойств объекта. Конструктор определяется с именем `__construct()`.

```php
<?php
class Person {
    public $name;
    public $age;

    public function __construct($name, $age) {
        $this->name = $name;
        $this->age = $age;
        echo "Создан новый объект Person с именем " . $this->name . ".\n";
    }

    public function greet() {
        echo "Привет, меня зовут " . $this->name . ", и мне " . $this->age . " лет.\n";
    }
}

$person1 = new Person("Иван", 30); // Автоматически вызовется __construct
$person2 = new Person("Анна", 25);

$person1->greet();
$person2->greet();
?>
```

## Инкапсуляция: Модификаторы доступа

PHP предоставляет модификаторы доступа для управления видимостью свойств и методов класса:

* **`public`:** Свойства и методы, объявленные как `public`, доступны из любого места (внутри класса, вне класса, в дочерних классах).
* **`protected`:** Свойства и методы, объявленные как `protected`, доступны внутри класса, а также в дочерних классах. Они недоступны извне класса.
* **`private`:** Свойства и методы, объявленные как `private`, доступны только внутри класса, в котором они определены. Они недоступны ни извне класса, ни в дочерних классах.

Использование модификаторов доступа помогает реализовать инкапсуляцию, скрывая внутренние детали реализации класса и контролируя доступ к его состоянию.

```php
<?php
class BankAccount {
    private $balance;
    public $accountNumber;

    public function __construct($accountNumber, $initialBalance) {
        $this->accountNumber = $accountNumber;
        $this->balance = $initialBalance;
    }

    public function deposit($amount) {
        if ($amount > 0) {
            $this->balance += $amount;
            echo "Внесено " . $amount . ". Текущий баланс: " . $this->getBalance() . "\n";
        } else {
            echo "Сумма для внесения должна быть положительной.\n";
        }
    }

    public function withdraw($amount) {
        if ($amount > 0 && $this->balance >= $amount) {
            $this->balance -= $amount;
            echo "Снято " . $amount . ". Текущий баланс: " . $this->getBalance() . "\n";
        } else {
            echo "Недостаточно средств или некорректная сумма.\n";
        }
    }

    private function getBalance() {
        return $this->balance;
    }

    public function checkBalance() {
        echo "Баланс счета " . $this->accountNumber . ": " . $this->getBalance() . "\n";
    }
}

$account1 = new BankAccount("12345", 1000);
$account1->deposit(500);
$account1->withdraw(200);
$account1->checkBalance();
// $account1->balance = -100; // Ошибка: свойство private
// echo $account1->getBalance(); // Ошибка: метод private
?>
```

## Наследование

Наследование позволяет создавать новые классы (дочерние) на основе существующих классов (родительских). Дочерние классы наследуют свойства и методы родительского класса и могут добавлять свои собственные свойства и методы или переопределять (override) унаследованные методы. Наследование реализуется с помощью ключевого слова `extends`.

```php
<?php
class Animal {
    public $name;

    public function __construct($name) {
        $this->name = $name;
    }

    public function makeSound() {
        echo "Животное издает звук.\n";
    }
}

class Dog extends Animal {
    public function makeSound() {
        echo "Гав!\n"; // Переопределение метода
    }

    public function fetch() {
        echo $this->name . " приносит палку.\n";
    }
}

class Cat extends Animal {
    public function makeSound() {
        echo "Мяу!\n"; // Переопределение метода
    }

    public function purr() {
        echo $this->name . " мурлычет.\n";
    }
}

$animal1 = new Animal("Неизвестное животное");
$dog1 = new Dog("Бобик");
$cat1 = new Cat("Мурка");

$animal1->makeSound(); // Выведет: Животное издает звук.
$dog1->makeSound();    // Выведет: Гав! (переопределенный метод)
$dog1->fetch();       // Выведет: Бобик приносит палку.
$cat1->makeSound();    // Выведет: Мяу! (переопределенный метод)
$cat1->purr();        // Выведет: Мурка мурлычет.
?>
```

## Полиморфизм

Полиморфизм означает "много форм". В контексте ООП это означает, что объекты разных классов могут обрабатываться единообразно через общий интерфейс (например, родительский класс или интерфейс).

В примере с наследованием метод `makeSound()` является полиморфным, так как объекты классов `Dog` и `Cat` (унаследованных от `Animal`) реагируют на этот метод по-разному.

## Абстрактные классы и методы

Абстрактный класс — это класс, который не может быть инстанцирован (нельзя создать его объект). Он служит в качестве базового класса для других классов и может содержать абстрактные методы. Абстрактный метод — это метод, объявленный с ключевым словом `abstract` и не имеющий реализации в абстрактном классе. Дочерние классы, наследующие абстрактный класс, обязаны реализовать все его абстрактные методы.

```php
<?php
abstract class Shape {
    abstract public function area();

    public function printArea() {
        echo "Площадь: " . $this->area() . "\n";
    }
}

class Circle extends Shape {
    private $radius;

    public function __construct($radius) {
        $this->radius = $radius;
    }

    public function area() {
        return pi() * $this->radius * $this->radius;
    }
}

class Rectangle extends Shape {
    private $width;
    private $height;

    public function __construct($width, $height) {
        $this->width = $width;
        $this->height = $height;
    }

    public function area() {
        return $this->width * $this->height;
    }
}

// $shape = new Shape(); // Ошибка: нельзя создать экземпляр абстрактного класса

$circle = new Circle(5);
$rectangle = new Rectangle(4, 6);

$circle->printArea();    // Выведет: Площадь: 78.539816339745
$rectangle->printArea(); // Выведет: Площадь: 24
?>
```

## Интерфейсы

Интерфейс определяет контракт, которому должны следовать классы, реализующие этот интерфейс. Интерфейс объявляет набор методов (без их реализации). Класс может реализовывать несколько интерфейсов. Интерфейсы определяются с помощью ключевого слова `interface`, а классы реализуют интерфейсы с помощью ключевого слова `implements`.

```php
<?php
interface Logger {
    public function log($message);
}

class FileLogger implements Logger {
    private $filename;

    public function __construct($filename) {
        $this->filename = $filename;
    }

    public function log($message) {
        file_put_contents($this->filename, date('Y-m-d H:i:s') . " - " . $message . "\n", FILE_APPEND);
    }
}

class DatabaseLogger implements Logger {
    public function log($message) {
        echo "Запись в базу данных: " . $message . "\n";
        // Здесь будет код для записи в базу данных
    }
}

$fileLog = new FileLogger('app.log');
$dbLog = new DatabaseLogger();

$fileLog->log("Приложение запущено.");
$dbLog->log("Пользователь вошел в систему.");

function processLog(Logger $logger, $message) {
    $logger->log($message);
}

processLog($fileLog, "Важное событие в файле.");
processLog($dbLog, "Важное событие в базе данных.");
?>
```

## Трейты (Traits)

Трейты — это механизм для повторного использования кода в классах, не связанный с наследованием. Трейт похож на класс, но он предназначен для включения в другие классы. Класс может использовать несколько трейтов. Трейты определяются с помощью ключевого слова `trait`, а классы используют трейты с помощью ключевого слова `use`.

```php
<?php
trait Loggable {
    public function logMessage($message) {
        echo date('Y-m-d H:i:s') . " - " . $message . "\n";
    }
}

class User {
    use Loggable;

    public $name;

    public function __construct($name) {
        $this->name = $name;
        $this->logMessage("Создан пользователь: " . $name);
    }

    public function login() {
        $this->logMessage($this->name . " вошел в систему.");
    }
}

class Product {
    use Loggable;

    public $title;

    public function __construct($title) {
        $this->title = $title;
        $this->logMessage("Создан продукт: " . $title);
    }
}

$user1 = new User("Алексей");
$user1->login();

$product1 = new Product("Ноутбук");
?>
```

ООП является мощным инструментом для организации и структурирования PHP-кода, особенно для больших и сложных проектов. Понимание основных концепций ООП и умение их применять значительно повышает качество и поддерживаемость вашего кода.