<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import QuizQuestion from './QuizQuestion.vue'

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

<style scoped>
.quiz-wrapper {
  border: 2px solid var(--vp-c-brand-1, #3eaf7c);
  border-radius: 12px;
  padding: 24px;
  margin: 20px 0;
  background: var(--vp-c-bg-soft, #f9f9f9);
}

.quiz-header {
  margin-bottom: 16px;
}

.quiz-title {
  margin: 0 0 4px 0;
  font-size: 1.3em;
}

.quiz-description {
  margin: 0;
  color: var(--vp-c-text-2, #666);
  font-size: 0.9em;
}

/* Previous result */
.quiz-previous {
  background: var(--vp-c-bg, #fff);
  border: 1px solid var(--vp-c-divider, #e2e2e3);
  border-radius: 8px;
  padding: 8px 14px;
  margin-bottom: 16px;
  font-size: 0.85em;
  color: var(--vp-c-text-2);
}

/* Progress bar */
.quiz-progress {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.quiz-progress__bar {
  flex: 1;
  height: 8px;
  background: var(--vp-c-divider, #e2e2e3);
  border-radius: 4px;
  overflow: hidden;
}

.quiz-progress__fill {
  height: 100%;
  background: var(--vp-c-brand-1, #3eaf7c);
  border-radius: 4px;
  transition: width 0.4s ease;
}

.quiz-progress__text {
  font-size: 0.85em;
  font-weight: 600;
  color: var(--vp-c-text-2);
  white-space: nowrap;
}

/* Navigation dots */
.quiz-nav {
  display: flex;
  gap: 6px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.quiz-nav__dot {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid var(--vp-c-divider, #e2e2e3);
  background: var(--vp-c-bg, #fff);
  cursor: pointer;
  font-size: 0.8em;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  color: var(--vp-c-text-2);
}

.quiz-nav__dot:hover {
  border-color: var(--vp-c-brand-1, #3eaf7c);
}

.quiz-nav__dot--active {
  border-color: var(--vp-c-brand-1, #3eaf7c);
  background: var(--vp-c-brand-1, #3eaf7c);
  color: #fff;
}

.quiz-nav__dot--correct {
  border-color: #10b981;
  background: #10b981;
  color: #fff;
}

.quiz-nav__dot--wrong {
  border-color: #ef4444;
  background: #ef4444;
  color: #fff;
}

/* Quiz content */
.quiz-content {
  background: var(--vp-c-bg, #fff);
  border-radius: 8px;
  padding: 20px;
}

/* Actions */
.quiz-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--vp-c-divider, #e2e2e3);
}

.quiz-btn {
  padding: 8px 20px;
  border-radius: 8px;
  border: 2px solid transparent;
  cursor: pointer;
  font-size: 0.9em;
  font-weight: 500;
  transition: all 0.2s;
}

.quiz-btn:disabled {
  opacity: 0.4;
  cursor: default;
}

.quiz-btn--primary {
  background: var(--vp-c-brand-1, #3eaf7c);
  color: #fff;
  border-color: var(--vp-c-brand-1, #3eaf7c);
}

.quiz-btn--primary:hover:not(:disabled) {
  opacity: 0.9;
}

.quiz-btn--secondary {
  background: var(--vp-c-bg, #fff);
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-divider, #e2e2e3);
}

.quiz-btn--secondary:hover:not(:disabled) {
  border-color: var(--vp-c-brand-1, #3eaf7c);
}

/* Results */
.quiz-results {
  text-align: center;
  padding: 20px;
}

.quiz-results__score {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  margin-bottom: 24px;
}

.quiz-results__circle {
  position: relative;
  width: 120px;
  height: 120px;
  flex-shrink: 0;
}

.quiz-results__svg {
  width: 100%;
  height: 100%;
}

.quiz-results__progress-circle {
  transition: stroke-dashoffset 1s ease;
}

.quiz-grade--excellent { color: #10b981; }
.quiz-grade--good { color: #3b82f6; }
.quiz-grade--ok { color: #f59e0b; }
.quiz-grade--poor { color: #ef4444; }

.quiz-results__percent {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.6em;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.quiz-results__info {
  text-align: left;
}

.quiz-results__grade {
  font-size: 1.4em;
  font-weight: 700;
  margin-bottom: 4px;
}

.quiz-results__detail {
  font-size: 0.95em;
  color: var(--vp-c-text-2);
}

.quiz-results__actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

@media (max-width: 480px) {
  .quiz-results__score {
    flex-direction: column;
  }

  .quiz-results__info {
    text-align: center;
  }

  .quiz-results__actions {
    flex-direction: column;
  }
}
</style>
