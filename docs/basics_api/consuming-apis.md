### 🚀 Використання API (Consuming APIs): Мови програмування для взаємодії

Щоб використовувати ваш API, розробники пишуть код різними мовами програмування для надсилання запитів та обробки відповідей. Ось детальніший огляд для JavaScript, Python та Java:

#### 💻 JavaScript

JavaScript є ключовою мовою для веб-розробки, і для взаємодії з API використовуються такі підходи:

* **`fetch` API:** Вбудована функція в сучасних браузерах та Node.js для надсилання HTTP-запитів на основі промісів (Promises).

    ```javascript
    fetch('[https://api.example.com/data](https://api.example.com/data)')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); // Розбір тіла відповіді як JSON
      })
      .then(data => {
        console.log('Отримані дані:', data);
      })
      .catch(error => {
        console.error('Помилка при отриманні даних:', error);
      });
    ```

* **`XMLHttpRequest` (XHR):** Застарілий, але все ще підтримуваний спосіб для асинхронних запитів у браузері. Його синтаксис складніший за `fetch`.

* **Бібліотека `axios`:** Популярна стороння бібліотека для Node.js та браузерів, що надає ширші можливості:
    * Автоматичне перетворення даних JSON.
    * Перехоплювачі запитів та відповідей (interceptors).
    * Захист від CSRF.
    * Більш гнучкі налаштування запитів.

    ```javascript
    import axios from 'axios';

    axios.get('[https://api.example.com/data](https://api.example.com/data)')
      .then(response => {
        console.log('Отримані дані:', response.data); // Дані вже розпарсені як об'єкт
      })
      .catch(error => {
        console.error('Помилка при отриманні даних:', error);
      });
    ```

#### 🐍 Python

Python пропонує зручні бібліотеки для роботи з API:

* **Бібліотека `requests`:** Найпопулярніша та інтуїтивно зрозуміла бібліотека для надсилання HTTP-запитів.

    ```python
    import requests

    try:
        response = requests.get('[https://api.example.com/data](https://api.example.com/data)')
        response.raise_for_status()  # Перевіряє, чи запит був успішним (статус-коди 2xx)
        data = response.json()       # Розбір JSON-відповіді
        print(f'Отримані дані: {data}')
    except requests.exceptions.RequestException as e:
        print(f'Помилка при отриманні даних: {e}')
    ```

* **Бібліотека `urllib.request`:** Вбудований модуль Python для роботи з URL, але `requests` вважається більш зручним для більшості випадків.

* **Асинхронні бібліотеки (`asyncio`, `aiohttp`):** Для виконання неблокуючих запитів, що підвищує продуктивність асинхронних застосунків.

    ```python
    import asyncio
    import aiohttp

    async def fetch_data():
        async with aiohttp.ClientSession() as session:
            try:
                async with session.get('[https://api.example.com/data](https://api.example.com/data)') as response:
                    if response.status == 200:
                        data = await response.json()
                        print(f'Отримані дані (асинхронно): {data}')
                    else:
                        print(f'Помилка при отриманні даних (асинхронно): {response.status}')
            except aiohttp.ClientError as e:
                print(f'Помилка клієнта (асинхронно): {e}')

    asyncio.run(fetch_data())
    ```

#### ☕ Java

Java надає кілька варіантів для роботи з API:

* **`java.net.http.HttpClient`:** Сучасний HTTP-клієнт, представлений у Java 11, підтримує як синхронні, так і асинхронні запити.

    ```java
    import java.net.URI;
    import java.net.http.HttpClient;
    import java.net.http.HttpRequest;
    import java.net.http.HttpResponse;
    import java.io.IOException;

    public class ApiConsumer {
        public static void main(String[] args) throws IOException, InterruptedException {
            HttpClient client = HttpClient.newBuilder().build();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("[https://api.example.com/data](https://api.example.com/data)"))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                System.out.println("Отримані дані: " + response.body());
                // Потрібно додатково обробити тіло як JSON, наприклад, за допомогою Jackson або Gson
            } else {
                System.out.println("Помилка при отриманні даних: " + response.statusCode());
            }
        }
    }
    ```

* **Apache HttpClient:** Популярна та багатофункціональна стороння бібліотека для роботи з HTTP-протоколом.

* **OkHttp:** Ефективна HTTP-клієнтська бібліотека для Java та Android, розроблена Square.

* **`RestTemplate` (Spring Framework):** Якщо ваш застосунок використовує Spring Framework, `RestTemplate` (хоча й оголошений застарілим на користь `WebClient` в Reactive Spring) або `WebClient` надають зручні абстракції для взаємодії з RESTful API.

    ```java
    // Використання RestTemplate (потрібна залежність Spring Web)
    import org.springframework.web.client.RestTemplate;

    public class ApiConsumer {
        public static void main(String[] args) {
            RestTemplate restTemplate = new RestTemplate();
            String apiUrl = "[https://api.example.com/data](https://api.example.com/data)";
            String response = restTemplate.getForObject(apiUrl, String.class);
            System.out.println("Отримані дані: " + response);
            // Потрібно додатково обробити тіло як JSON
        }
    }
    ```

Кожна з цих мов та відповідних бібліотек надає інструменти для виконання HTTP-запитів (GET, POST, PUT, DELETE тощо), передачі даних (заголовки, тіло запиту) та обробки відповідей від API. Вибір залежить від технологічного стеку вашого проєкту та вподобань розробників.