<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import QuizQuestion from './QuizQuestion.vue'
import './shared-demo-styles.css'

interface QuizQuestionData {
  id: number
  text: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface QuizData {
  id: string
  title: string
  description: string
  questions: QuizQuestionData[]
}

interface QuizResult {
  quizId: string
  score: number
  total: number
  answers: Record<number, boolean>
  completedAt: string
}

const props = defineProps<{
  data: QuizData
}>()

const currentQuestion = ref(0)
const answers = ref<Record<number, boolean>>({})
const quizCompleted = ref(false)
const showResults = ref(false)

const totalQuestions = computed(() => props.data.questions.length)
const answeredCount = computed(() => Object.keys(answers.value).length)
const correctCount = computed(() => Object.values(answers.value).filter(Boolean).length)
const progressPercent = computed(() => Math.round((answeredCount.value / totalQuestions.value) * 100))

const scorePercent = computed(() => {
  if (totalQuestions.value === 0) return 0
  return Math.round((correctCount.value / totalQuestions.value) * 100)
})

const scoreGrade = computed(() => {
  const p = scorePercent.value
  if (p >= 90) return { label: 'Отлично!', class: 'quiz-grade--excellent' }
  if (p >= 70) return { label: 'Хорошо!', class: 'quiz-grade--good' }
  if (p >= 50) return { label: 'Удовлетворительно', class: 'quiz-grade--ok' }
  return { label: 'Нужно повторить', class: 'quiz-grade--poor' }
})

const STORAGE_KEY = computed(() => `quiz_result_${props.data.id}`)

const previousResult = ref<QuizResult | null>(null)

onMounted(() => {
  loadPreviousResult()
})

function loadPreviousResult() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY.value)
    if (stored) {
      previousResult.value = JSON.parse(stored)
    }
  } catch {
    // localStorage unavailable
  }
}

function saveResult() {
  const result: QuizResult = {
    quizId: props.data.id,
    score: correctCount.value,
    total: totalQuestions.value,
    answers: { ...answers.value },
    completedAt: new Date().toISOString()
  }
  try {
    localStorage.setItem(STORAGE_KEY.value, JSON.stringify(result))
    previousResult.value = result
  } catch {
    // localStorage unavailable
  }
}

function onAnswered(questionId: number, isCorrect: boolean) {
  answers.value[questionId] = isCorrect

  if (answeredCount.value === totalQuestions.value) {
    quizCompleted.value = true
    saveResult()
  } else {
    setTimeout(() => {
      if (currentQuestion.value < totalQuestions.value - 1) {
        currentQuestion.value++
      }
    }, 1200)
  }
}

function goToQuestion(index: number) {
  currentQuestion.value = index
}

function restartQuiz() {
  currentQuestion.value = 0
  answers.value = {}
  quizCompleted.value = false
  showResults.value = false
}

function viewResults() {
  showResults.value = true
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<template>
  <div class="quiz-wrapper">
    <div class="quiz-header">
      <h3 class="quiz-title">{{ data.title }}</h3>
      <p class="quiz-description">{{ data.description }}</p>
    </div>

    <!-- Previous result banner -->
    <div v-if="previousResult && !quizCompleted && answeredCount === 0" class="quiz-previous">
      <span>
        Последний результат: <strong>{{ previousResult.score }}/{{ previousResult.total }}</strong>
        ({{ formatDate(previousResult.completedAt) }})
      </span>
    </div>

    <!-- Progress bar -->
    <div class="quiz-progress">
      <div class="quiz-progress__bar">
        <div
          class="quiz-progress__fill"
          :style="{ width: progressPercent + '%' }"
        />
      </div>
      <span class="quiz-progress__text">{{ answeredCount }}/{{ totalQuestions }}</span>
    </div>

    <!-- Question navigation dots -->
    <div class="quiz-nav">
      <button
        v-for="(q, i) in data.questions"
        :key="q.id"
        class="quiz-nav__dot"
        :class="{
          'quiz-nav__dot--active': i === currentQuestion,
          'quiz-nav__dot--correct': answers[q.id] === true,
          'quiz-nav__dot--wrong': answers[q.id] === false,
        }"
        @click="goToQuestion(i)"
        :title="`Вопрос ${i + 1}`"
      >
        {{ i + 1 }}
      </button>
    </div>

    <!-- Quiz content -->
    <div v-if="!showResults" class="quiz-content">
      <QuizQuestion
        :key="data.questions[currentQuestion].id"
        :question-number="currentQuestion + 1"
        :total-questions="totalQuestions"
        :text="data.questions[currentQuestion].text"
        :options="data.questions[currentQuestion].options"
        :correct-answer="data.questions[currentQuestion].correctAnswer"
        :explanation="data.questions[currentQuestion].explanation"
        @answered="(isCorrect) => onAnswered(data.questions[currentQuestion].id, isCorrect)"
      />

      <!-- Navigation buttons -->
      <div class="quiz-actions">
        <button
          class="quiz-btn quiz-btn--secondary"
          :disabled="currentQuestion === 0"
          @click="currentQuestion--"
        >
          &#8592; Назад
        </button>
        <button
          v-if="!quizCompleted"
          class="quiz-btn quiz-btn--secondary"
          :disabled="currentQuestion === totalQuestions - 1"
          @click="currentQuestion++"
        >
          Далее &#8594;
        </button>
        <button
          v-if="quizCompleted"
          class="quiz-btn quiz-btn--primary"
          @click="viewResults"
        >
          Показать результаты
        </button>
      </div>
    </div>

    <!-- Results screen -->
    <div v-else class="quiz-results">
      <div class="quiz-results__score" :class="scoreGrade.class">
        <div class="quiz-results__circle">
          <svg viewBox="0 0 100 100" class="quiz-results__svg">
            <circle cx="50" cy="50" r="45" fill="none" stroke="var(--vp-c-divider, #e2e2e3)" stroke-width="8" />
            <circle
              cx="50" cy="50" r="45"
              fill="none"
              stroke="currentColor"
              stroke-width="8"
              stroke-linecap="round"
              :stroke-dasharray="283"
              :stroke-dashoffset="283 - (283 * scorePercent) / 100"
              transform="rotate(-90 50 50)"
              class="quiz-results__progress-circle"
            />
          </svg>
          <div class="quiz-results__percent">{{ scorePercent }}%</div>
        </div>
        <div class="quiz-results__info">
          <div class="quiz-results__grade">{{ scoreGrade.label }}</div>
          <div class="quiz-results__detail">
            {{ correctCount }} из {{ totalQuestions }} правильных ответов
          </div>
        </div>
      </div>

      <div class="quiz-results__actions">
        <button class="quiz-btn quiz-btn--primary" @click="restartQuiz">
          Пройти заново
        </button>
        <button class="quiz-btn quiz-btn--secondary" @click="showResults = false">
          Посмотреть вопросы
        </button>
      </div>
    </div>
  </div>
</template>

