---
title: Тест - TypeScript основы
description: Интерактивный тест для проверки знаний TypeScript
---

# Тест: TypeScript основы

Проверьте свои знания TypeScript. Тест содержит 10 вопросов по типам, интерфейсам, generics, утилитным типам и другим ключевым темам.

Ваши результаты автоматически сохраняются в браузере.

<script setup>
import Quiz from '../.vitepress/components/Quiz.vue'
import tsQuiz from '../.vitepress/data/quiz/typescript-basics.json'
</script>

<Quiz :data="tsQuiz" />
