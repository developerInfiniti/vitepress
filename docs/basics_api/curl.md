---
description: "cURL: команды для тестирования API, HTTP методы, заголовки, аутентификация — практическое руководство"
---

### ⚙️ CURL: Універсальний інструмент командного рядка для роботи з URL

**Що це?**

CURL (Client URL) - це **потужна утиліта командного рядка**, яка використовується для передачі даних з або на сервер, використовуючи різноманітні протоколи, включаючи HTTP, HTTPS, FTP, SFTP, SMTP, POP3 та багато інших. Для розробників та тестувальників API CURL є незамінним інструментом завдяки своїй гнучкості та можливості безпосередньої взаємодії з веб-сервісами.

**Основні можливості та їх детальний огляд:**

* **📤 Надсилання HTTP-запитів:**
    * **Вибір методу (`-X`):** CURL дозволяє вказувати будь-який HTTP-метод: `GET`, `POST`, `PUT`, `DELETE`, `PATCH`, `HEAD`, `OPTIONS`. За замовчуванням використовується метод `GET`.
        ```bash
        curl -X POST [https://api.example.com/resource](https://api.example.com/resource)
        ```
    * **Вказівка URL:** Обов'язковий параметр, що визначає адресу API-ендпоінта.
        ```bash
        curl [https://api.example.com/data](https://api.example.com/data)
        ```
    * **Додавання заголовків (`-H`):** CURL дозволяє додавати будь-які HTTP-заголовки до запиту. Можна вказати кілька заголовків.
        ```bash
        curl -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_TOKEN" [https://api.example.com/resource](https://api.example.com/resource)
        ```
    * **Передача даних у тілі запиту (`-d`):** Використовується для методів, що передають дані (наприклад, `POST`, `PUT`, `PATCH`). Підтримує різні формати даних.
        * **URL-encoded дані:**
          ```bash
          curl -d "param1=value1&param2=value2" [https://api.example.com/resource](https://api.example.com/resource)
          ```
        * **JSON дані:**
          ```bash
          curl -H "Content-Type: application/json" -d '{"key": "value"}' [https://api.example.com/resource](https://api.example.com/resource)
          ```
        * **Передача файлів (`-F`):** Для надсилання даних форми з файлами.
          ```bash
          curl -F "file=@/path/to/your/file.txt" [https://api.example.com/upload](https://api.example.com/upload)
          ```

* **📥 Отримання відповідей API:**
    * **Виведення в стандартний вивід (stdout):** За замовчуванням CURL виводить тіло відповіді API в термінал.
    * **Збереження у файл (`-o` або `-O`):**
        * `-o`: Збереження відповіді у вказаний файл.
          ```bash
          curl -o output.json [https://api.example.com/data](https://api.example.com/data)
          ```
        * `-O`: Збереження відповіді у файл з ім'ям, вказаним у URL.
          ```bash
          curl -O [https://api.example.com/files/document.pdf](https://api.example.com/files/document.pdf)
          ```
    * **Відображення заголовків (`-i`):** Включає заголовки HTTP-відповіді у вивід.
        ```bash
        curl -i [https://api.example.com/data](https://api.example.com/data)
        ```
    * **Відображення тільки заголовків (`-I`):** Надсилає HEAD-запит та виводить лише заголовки відповіді.
        ```bash
        curl -I [https://api.example.com/data](https://api.example.com/data)
        ```
    * **Отримання інформації про запит/відповідь (`-v`):** Режим verbose, що виводить детальну інформацію про процес передачі даних, включаючи запити, заголовки та відповіді.
        ```bash
        curl -v [https://api.example.com/data](https://api.example.com/data)
        ```

* **🔑 Аутентифікація:**
    * **Basic Auth (`-u`):** Передача імені користувача та пароля.
        ```bash
        curl -u username:password [https://api.example.com/protected](https://api.example.com/protected)
        ```
    * **Bearer Token (`-H "Authorization: Bearer YOUR_TOKEN"`):** Передача токена в заголовку.
    * **Інші методи:** CURL підтримує й інші методи аутентифікації.

* **⚙️ Інші корисні опції:**
    * **Слідування за перенаправленнями (`-L`):** Якщо сервер повертає перенаправлення (наприклад, 301, 302), CURL автоматично перейде за новою адресою.
        ```bash
        curl -L [https://example.com/old-url](https://example.com/old-url)
        ```
    * **Встановлення тайм-ауту (`-m`):** Встановлення максимального часу очікування для запиту в секундах.
        ```bash
        curl -m 10 [https://api.example.com/slow-api](https://api.example.com/slow-api)
        ```
    * **Ігнорування помилок SSL (`-k` або `--insecure`):** Не рекомендується для продакшн-середовищ, але може бути корисним для тестування з самопідписаними сертифікатами.
        ```bash
        curl -k [https://insecure.example.com](https://insecure.example.com)
        ```

**Візуалізація:** Уявіть CURL як ваш **термінальний інструмент суперсили** 🦸‍♂️ для безпосередньої взаємодії з будь-яким URL. Ви можете відправляти складні запити, точно контролювати заголовки та дані, а також отримувати детальну інформацію про відповіді API прямо в командному рядку. Його гнучкість робить його незамінним для швидкого тестування та налагодження API.

CURL є потужним інструментом, який часто використовується в скриптах автоматизації, для швидкої перевірки API-ендпоінтів та для розуміння того, як API насправді працює на рівні HTTP-запитів та відповідей.