# Основы Docker: Docker Compose

**Docker Compose** — это инструмент для определения и запуска многоконтейнерных Docker-приложений. С помощью Compose вы используете YAML-файл для настройки служб вашего приложения. Затем, с помощью одной команды, вы создаете и запускаете все службы из вашей конфигурации.

## Основные понятия Docker Compose

* **`docker-compose.yml` (или `docker-compose.yaml`):** YAML-файл, в котором определяются службы, сети и тома вашего приложения.
* **Служба (Service):** Контейнер, который выполняет определенную функцию в вашем приложении (например, веб-сервер, база данных, кэш). Службы определяются в файле `docker-compose.yml`.
* **Проект (Project):** Набор взаимосвязанных служб, определенных в файле `docker-compose.yml`.
* **Сеть (Network):** Изолированная среда, в которой могут взаимодействовать контейнеры. Compose автоматически создает сети для вашего проекта, но вы также можете определить собственные сети.
* **Том (Volume):** Механизм для сохранения данных, созданных контейнерами, и обмена данными между контейнерами и хост-машиной.

## Установка Docker Compose

Docker Compose обычно устанавливается вместе с Docker Desktop. Если вы используете Linux, возможно, вам потребуется установить его отдельно. Инструкции по установке можно найти на официальном сайте Docker: [https://docs.docker.com/compose/install/](https://docs.docker.com/compose/install/).

После установки вы сможете использовать команду `docker-compose` (или `docker compose`, в зависимости от версии) в своей командной строке или терминале.

## Использование Docker Compose

### 1. Создание файла `docker-compose.yml`

В корне вашего проекта создайте файл с именем `docker-compose.yml` (или `docker-compose.yaml`). Этот файл описывает службы, сети и тома вашего приложения.

Вот пример простого файла `docker-compose.yml` для веб-приложения с базой данных:

```yaml
version: "3.9"
services:
  web:
    image: nginx:latest
    ports:
      - "80:80"
    volumes:
      - ./html:/usr/share/nginx/html
    depends_on:
      - db
    networks:
      - mynetwork

  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: mysecretpassword
      MYSQL_DATABASE: mydatabase
    volumes:
      - db_data:/var/lib/mysql
    networks:
      - mynetwork

volumes:
  db_data:

networks:
  mynetwork:
```

Разберем этот пример:

* **`version: "3.9"`:** Указывает версию формата файла Docker Compose.
* **`services`:** Секция, определяющая службы вашего приложения.
    * **`web`:** Служба веб-сервера.
        * **`image: nginx:latest`:** Использует образ `nginx:latest` из Docker Hub.
        * **`ports: - "80:80"`:** Публикует порт 80 хост-машины на порт 80 контейнера.
        * **`volumes: - ./html:/usr/share/nginx/html`:** Монтирует локальную директорию `./html` в директорию `/usr/share/nginx/html` внутри контейнера.
        * **`depends_on: - db`:** Указывает, что служба `web` зависит от службы `db` (база данных). Compose запустит `db` перед `web`.
        * **`networks: - mynetwork`:** Подключает службу `web` к сети `mynetwork`.
    * **`db`:** Служба базы данных MySQL.
        * **`image: mysql:8.0`:** Использует образ `mysql:8.0` из Docker Hub.
        * **`environment: ...`:** Устанавливает переменные окружения для контейнера MySQL (пароль root, имя базы данных).
        * **`volumes: - db_data:/var/lib/mysql`:** Монтирует именованный том `db_data` в директорию `/var/lib/mysql` внутри контейнера (где MySQL хранит свои данные).
        * **`networks: - mynetwork`:** Подключает службу `db` к сети `mynetwork`.
* **`volumes`:** Секция, определяющая тома.
    * **`db_data`:** Именованный том для хранения данных MySQL.
* **`networks`:** Секция, определяющая сети.
    * **`mynetwork`:** Пользовательская сеть, к которой подключены службы `web` и `db`.

### 2. Запуск приложения

После создания файла `docker-compose.yml` перейдите в директорию, содержащую этот файл, в командной строке и выполните команду:

```bash
docker-compose up
```

(или `docker compose up`, в зависимости от версии)

Compose создаст и запустит все службы, определенные в вашем файле `docker-compose.yml`. Вы увидите логи контейнеров в терминале.

Чтобы запустить приложение в фоновом режиме (detached mode), добавьте флаг `-d`:

```bash
docker-compose up -d
```

### 3. Остановка приложения

Чтобы остановить приложение, выполните команду:

```bash
docker-compose down
```

(или `docker compose down`)

Эта команда остановит и удалит контейнеры, сети и тома, созданные командой `docker-compose up`.

### 4. Другие полезные команды

* **`docker-compose ps` (или `docker compose ps`):** Отображает статус служб вашего приложения.
* **`docker-compose logs <service_name>` (или `docker compose logs <service_name>`):** Просматривает логи определенной службы.
* **`docker-compose exec <service_name> <command>` (или `docker compose exec <service_name> <command>`):** Выполняет команду внутри контейнера определенной службы. Например, `docker-compose exec web bash` откроет оболочку внутри контейнера `web`.
* **`docker-compose build` (или `docker compose build`):** Собирает образы, определенные в секции `build` файла `docker-compose.yml`.
* **`docker-compose pull` (или `docker compose pull`):** Скачивает образы, используемые в файле `docker-compose.yml`.

### 5. Использование переменных окружения

Вы можете использовать переменные окружения в файле `docker-compose.yml`. Compose автоматически подставит значения переменных, определенных в вашей системе.

```yaml
version: "3.9"
services:
  web:
    image: nginx:${NGINX_VERSION:-latest}
    ports:
      - "${WEB_PORT:-80}:80"
    volumes:
      - ./html:/usr/share/nginx/html
    depends_on:
      - db
    networks:
      - mynetwork

  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD:-mysecretpassword}
      MYSQL_DATABASE: ${DB_NAME:-mydatabase}
    volumes:
      - db_data:/var/lib/mysql
    networks:
      - mynetwork

volumes:
  db_data:

networks:
  mynetwork:
```

В этом примере используются переменные окружения `NGINX_VERSION`, `WEB_PORT`, `DB_ROOT_PASSWORD` и `DB_NAME`. Если эти переменные не определены в системе, будут использованы значения по умолчанию (например, `latest` для `NGINX_VERSION`).

### 6. Расширение файлов Compose

Вы можете использовать несколько файлов Compose для разделения конфигурации вашего приложения на части. Например, вы можете иметь файл `docker-compose.yml` для основной конфигурации и файл `docker-compose.override.yml` для переопределения определенных параметров (например, для разработки).

Compose автоматически прочитает файлы `docker-compose.yml` и `docker-compose.override.yml` (если он существует) и объединит их.

### 7. Сборка образов

Вместо использования готовых образов из Docker Hub, вы можете указать Compose собирать образы из Dockerfile.

```yaml
version: "3.9"
services:
  web:
    build:
      context: ./web
      dockerfile: Dockerfile
    ports:
      - "80:80"
    volumes:
      - ./html:/usr/share/nginx/html
    depends_on:
      - app
    networks:
      - mynetwork

  app:
    build: ./app
    volumes:
      - ./app:/app
    environment:
      DB_HOST: db
    depends_on:
      - db
    networks:
      - mynetwork

  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: mysecretpassword
      MYSQL_DATABASE: mydatabase
    volumes:
      - db_data:/var/lib/mysql
    networks:
      - mynetwork

volumes:
  db_data:

networks:
  mynetwork:
```

В этом примере службы `web` и `app` собираются из Dockerfile. `build.context` указывает путь к директории, содержащей Dockerfile, а `build.dockerfile` (необязательно) указывает имя Dockerfile (по умолчанию `Dockerfile`). Если указан только `build`, то `context` по умолчанию равен текущей директории, а `dockerfile` по умолчанию равен `Dockerfile`.

Docker Compose значительно упрощает управление многоконтейнерными приложениями. С помощью него вы можете легко определять, запускать и масштабировать ваше приложение, используя декларативный подход.