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
