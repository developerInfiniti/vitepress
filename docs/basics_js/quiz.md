---
title: Тест - JavaScript основы
description: Интерактивный тест для проверки знаний JavaScript
---

# Тест: JavaScript основы

Проверьте свои знания основ JavaScript. Тест содержит 10 вопросов по ключевым темам: типы данных, замыкания, массивы, Event Loop и другие.

Ваши результаты автоматически сохраняются в браузере.

<script setup>
import Quiz from '../.vitepress/components/Quiz.vue'
import jsQuiz from '../.vitepress/data/quiz/javascript-basics.json'
</script>

<Quiz :data="jsQuiz" />
