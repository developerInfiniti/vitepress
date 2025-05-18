# Приклади Markdown

Ця сторінка демонструє деякі можливості Markdown, які можна використовувати при створенні документації.

## Синтаксис

```md
# Заголовок 1
## Заголовок 2
### Заголовок 3

**Жирний текст**

*Курсив*

~~Закреслений текст~~

> Цитата

Розділювач:

---

`Інлайн код`

Блок коду:

```js
export default {
  name: 'MyComponent',
  // ...
}
```

Список:

- Елемент 1
- Елемент 2
- Елемент 3

Нумерований список:

1. Перший елемент
2. Другий елемент
3. Третій елемент

Посилання: [Посилання](https://example.com)

Зображення: ![Альтернативний текст](https://example.com/image.png)
```

## Приклади

### Таблиці

| Назва | Опис |
| --- | --- |
| Заголовок 1 | Опис 1 |
| Заголовок 2 | Опис 2 |
| Заголовок 3 | Опис 3 |

### Блоки коду з підсвічуванням синтаксису

```js
export default {
  data() {
    return {
      message: 'Привіт, світ!'
    }
  },
  methods: {
    greet() {
      console.log(this.message)
    }
  }
}
```

```css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}
```

```html
<div class="container">
  <h1>{{ message }}</h1>
  <button @click="greet">Привітатися</button>
</div>
```