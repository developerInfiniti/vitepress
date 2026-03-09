<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  questionNumber: number
  totalQuestions: number
  text: string
  options: string[]
  correctAnswer: number
  explanation: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  answered: [isCorrect: boolean]
}>()

const selectedOption = ref<number | null>(null)
const answered = ref(false)

const isCorrect = computed(() => selectedOption.value === props.correctAnswer)

function selectOption(index: number) {
  if (answered.value) return
  selectedOption.value = index
  answered.value = true
  emit('answered', isCorrect.value)
}

function getOptionClass(index: number) {
  if (!answered.value) {
    return index === selectedOption.value ? 'quiz-option--selected' : ''
  }
  if (index === props.correctAnswer) return 'quiz-option--correct'
  if (index === selectedOption.value && !isCorrect.value) return 'quiz-option--wrong'
  return 'quiz-option--disabled'
}
</script>

<template>
  <div class="quiz-question">
    <div class="quiz-question__counter">
      Вопрос {{ questionNumber }} из {{ totalQuestions }}
    </div>

    <h4 class="quiz-question__text">{{ text }}</h4>

    <div class="quiz-question__options">
      <button
        v-for="(option, index) in options"
        :key="index"
        class="quiz-option"
        :class="getOptionClass(index)"
        :disabled="answered"
        @click="selectOption(index)"
      >
        <span class="quiz-option__letter">{{ String.fromCharCode(65 + index) }}</span>
        <span class="quiz-option__text">{{ option }}</span>
        <span v-if="answered && index === correctAnswer" class="quiz-option__icon">&#10003;</span>
        <span v-if="answered && index === selectedOption && !isCorrect && index !== correctAnswer" class="quiz-option__icon quiz-option__icon--wrong">&#10007;</span>
      </button>
    </div>

    <div v-if="answered" class="quiz-question__explanation" :class="isCorrect ? 'quiz-question__explanation--correct' : 'quiz-question__explanation--wrong'">
      <strong>{{ isCorrect ? 'Правильно!' : 'Неправильно!' }}</strong>
      <p>{{ explanation }}</p>
    </div>
  </div>
</template>

<style scoped>
.quiz-question {
  margin-bottom: 8px;
}

.quiz-question__counter {
  font-size: 0.85em;
  color: var(--vp-c-text-3, #999);
  margin-bottom: 8px;
  font-weight: 500;
}

.quiz-question__text {
  margin: 0 0 16px 0;
  font-size: 1.1em;
  line-height: 1.5;
  color: var(--vp-c-text-1);
}

.quiz-question__options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.quiz-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: 2px solid var(--vp-c-divider, #e2e2e3);
  border-radius: 8px;
  background: var(--vp-c-bg, #fff);
  cursor: pointer;
  text-align: left;
  font-size: 0.95em;
  transition: border-color 0.2s, background 0.2s, transform 0.1s;
  width: 100%;
  color: var(--vp-c-text-1);
}

.quiz-option:hover:not(:disabled) {
  border-color: var(--vp-c-brand-1, #3eaf7c);
  background: var(--vp-c-bg-soft, #f9f9f9);
  transform: translateX(4px);
}

.quiz-option:disabled {
  cursor: default;
}

.quiz-option--selected {
  border-color: var(--vp-c-brand-1, #3eaf7c);
}

.quiz-option--correct {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.1);
}

.quiz-option--wrong {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

.quiz-option--disabled {
  opacity: 0.5;
}

.quiz-option__letter {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--vp-c-bg-soft, #f3f4f6);
  font-weight: 600;
  font-size: 0.85em;
  flex-shrink: 0;
  color: var(--vp-c-text-2);
}

.quiz-option--correct .quiz-option__letter {
  background: #10b981;
  color: #fff;
}

.quiz-option--wrong .quiz-option__letter {
  background: #ef4444;
  color: #fff;
}

.quiz-option__text {
  flex: 1;
}

.quiz-option__icon {
  font-size: 1.2em;
  color: #10b981;
  font-weight: bold;
}

.quiz-option__icon--wrong {
  color: #ef4444;
}

.quiz-question__explanation {
  margin-top: 16px;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 0.9em;
  line-height: 1.5;
}

.quiz-question__explanation p {
  margin: 4px 0 0 0;
}

.quiz-question__explanation--correct {
  background: rgba(16, 185, 129, 0.1);
  border-left: 4px solid #10b981;
}

.quiz-question__explanation--wrong {
  background: rgba(239, 68, 68, 0.1);
  border-left: 4px solid #ef4444;
}
</style>
