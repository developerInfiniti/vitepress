---
title: Веб-фреймворки Python
description: Обзор Flask и FastAPI для веб-разработки на Python
---

# Веб-фреймворки Python

## Flask

Flask — легковесный WSGI-фреймворк для создания веб-приложений.

### Установка и минимальное приложение

```bash
pip install flask
```

```python
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/")
def index():
    return "Привет, мир!"

@app.route("/user/<name>")
def user(name):
    return f"Привет, {name}!"

if __name__ == "__main__":
    app.run(debug=True)
```

### Маршруты и методы

```python
@app.route("/api/users", methods=["GET"])
def get_users():
    users = [{"name": "Иван"}, {"name": "Анна"}]
    return jsonify(users)

@app.route("/api/users", methods=["POST"])
def create_user():
    data = request.get_json()
    return jsonify({"created": data}), 201

@app.route("/api/users/<int:user_id>", methods=["PUT"])
def update_user(user_id):
    data = request.get_json()
    return jsonify({"updated": user_id, **data})

@app.route("/api/users/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    return jsonify({"deleted": user_id})
```

### Шаблоны Jinja2

```python
from flask import render_template

@app.route("/hello/<name>")
def hello(name):
    return render_template("hello.html", name=name)
```

```html
<!-- templates/hello.html -->
<!DOCTYPE html>
<html>
<body>
  <h1>Привет, {{ name }}!</h1>
  {% if name == "admin" %}
    <p>Добро пожаловать, администратор</p>
  {% endif %}
</body>
</html>
```

## FastAPI

FastAPI — современный асинхронный фреймворк с автоматической документацией.

### Установка и минимальное приложение

```bash
pip install fastapi uvicorn
```

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Привет, мир!"}

# Запуск: uvicorn main:app --reload
```

### Параметры пути и запроса

```python
from fastapi import FastAPI, Query, Path

app = FastAPI()

@app.get("/users/{user_id}")
async def get_user(
    user_id: int = Path(..., title="ID пользователя", ge=1),
    include_email: bool = Query(False, description="Включить email")
):
    user = {"id": user_id, "name": "Иван"}
    if include_email:
        user["email"] = "ivan@mail.ru"
    return user
```

### Модели Pydantic

```python
from pydantic import BaseModel, Field
from typing import Optional

class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=50)
    email: str
    age: Optional[int] = Field(None, ge=0, le=150)

class UserResponse(BaseModel):
    id: int
    name: str
    email: str

@app.post("/users", response_model=UserResponse, status_code=201)
async def create_user(user: UserCreate):
    return UserResponse(id=1, name=user.name, email=user.email)
```

### Зависимости (Dependency Injection)

```python
from fastapi import Depends, HTTPException

async def get_current_user(token: str = Query(...)):
    if token != "secret":
        raise HTTPException(status_code=401, detail="Не авторизован")
    return {"username": "admin"}

@app.get("/profile")
async def profile(user: dict = Depends(get_current_user)):
    return {"user": user}
```

### Автодокументация

FastAPI автоматически генерирует интерактивную документацию:

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## Сравнение Flask и FastAPI

| Характеристика | Flask | FastAPI |
|---------------|-------|---------|
| Тип | WSGI (синхронный) | ASGI (асинхронный) |
| Скорость | Средняя | Высокая |
| Типизация | Нет | Встроенная (Pydantic) |
| Документация API | Ручная | Автоматическая |
| Валидация | Ручная | Автоматическая |
| Экосистема | Зрелая, много расширений | Растущая |
| Подходит для | Простые приложения, прототипы | API, микросервисы |
