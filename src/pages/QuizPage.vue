<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getCourseById, getChapterById, getContentById, isQuiz, isVideo, type Quiz } from '@/data/courses'
import { useProgressStore } from '@/stores/progress'

const route = useRoute()
const router = useRouter()
const progressStore = useProgressStore()

const courseId = computed(() => route.params.courseId as string)
const chapterId = computed(() => route.params.chapterId as string)
const contentId = computed(() => route.params.contentId as string)

const course = ref(getCourseById(courseId.value))
const chapter = ref(getChapterById(courseId.value, chapterId.value))
const quiz = ref<Quiz | undefined>()

const selectedAnswers = ref<Record<string, number>>({})
const showResults = ref(false)
const score = ref(0)
const passed = ref(false)

onMounted(() => {
  const content = getContentById(courseId.value, chapterId.value, contentId.value)
  
  if (!content || !isQuiz(content)) {
    router.push(`/classes/${courseId.value}/learn`)
    return
  }

  quiz.value = content
  progressStore.updateCurrentContent(courseId.value, chapterId.value, contentId.value)
})

function selectAnswer(questionId: string, answerIndex: number) {
  if (!showResults.value) {
    selectedAnswers.value[questionId] = answerIndex
  }
}

function submitQuiz() {
  if (!quiz.value) return

  // Calculate score
  let correctAnswers = 0
  quiz.value.questions.forEach(question => {
    if (selectedAnswers.value[question.id] === question.correctAnswer) {
      correctAnswers++
    }
  })

  score.value = correctAnswers
  passed.value = correctAnswers >= quiz.value.passingScore
  showResults.value = true

  // Save score and mark as complete if passed
  progressStore.saveQuizScore(courseId.value, contentId.value, correctAnswers)
  if (passed.value) {
    progressStore.markContentComplete(courseId.value, contentId.value)
  }
}

function retakeQuiz() {
  selectedAnswers.value = {}
  showResults.value = false
  score.value = 0
  passed.value = false
}

function navigateToNext() {
  if (!course.value || !chapter.value) return

  const currentChapterIndex = course.value.chapters.findIndex(c => c.id === chapterId.value)
  const currentContentIndex = chapter.value.content.findIndex(c => c.id === contentId.value)

  // Check if there's next content in current chapter
  if (currentContentIndex < chapter.value.content.length - 1) {
    const nextContent = chapter.value.content[currentContentIndex + 1]
    if (isVideo(nextContent)) {
      router.push(`/classes/${courseId.value}/learn/${chapterId.value}/${nextContent.id}/video`)
    } else {
      router.push(`/classes/${courseId.value}/learn/${chapterId.value}/${nextContent.id}/quiz`)
    }
  }
  // Check if there's next chapter
  else if (currentChapterIndex < course.value.chapters.length - 1) {
    const nextChapter = course.value.chapters[currentChapterIndex + 1]
    const nextContent = nextChapter.content[0]
    if (isVideo(nextContent)) {
      router.push(`/classes/${courseId.value}/learn/${nextChapter.id}/${nextContent.id}/video`)
    } else {
      router.push(`/classes/${courseId.value}/learn/${nextChapter.id}/${nextContent.id}/quiz`)
    }
  }
  // No more content, go to final exam
  else {
    router.push(`/classes/${courseId.value}/final-exam`)
  }
}

const allQuestionsAnswered = computed(() => {
  if (!quiz.value) return false
  return quiz.value.questions.every(q => selectedAnswers.value[q.id] !== undefined)
})

const hasNextContent = computed(() => {
  if (!course.value || !chapter.value) return false

  const currentChapterIndex = course.value.chapters.findIndex(c => c.id === chapterId.value)
  const currentContentIndex = chapter.value.content.findIndex(c => c.id === contentId.value)

  return currentContentIndex < chapter.value.content.length - 1 || 
         currentChapterIndex < course.value.chapters.length - 1
})
</script>

<template>
  <div v-if="quiz" class="quiz-page">
    <div class="quiz-container">
      <div class="quiz-header">
        <h1>{{ quiz.title }}</h1>
        <p class="description">{{ quiz.description }}</p>
        <div class="quiz-meta">
          <span>{{ quiz.questions.length }} Questions</span>
          <span>•</span>
          <span>Pass with {{ quiz.passingScore }}/{{ quiz.questions.length }} correct</span>
        </div>
      </div>

      <div v-if="!showResults" class="questions">
        <div 
          v-for="(question, index) in quiz.questions" 
          :key="question.id"
          class="question-card"
        >
          <div class="question-header">
            <span class="question-number">Question {{ index + 1 }}</span>
            <h3>{{ question.question }}</h3>
          </div>

          <div class="options">
            <div 
              v-for="(option, optionIndex) in question.options"
              :key="optionIndex"
              :class="['option', { selected: selectedAnswers[question.id] === optionIndex }]"
              @click="selectAnswer(question.id, optionIndex)"
            >
              <div class="option-radio">
                <div class="radio-circle">
                  <div v-if="selectedAnswers[question.id] === optionIndex" class="radio-dot"></div>
                </div>
              </div>
              <span class="option-text">{{ option }}</span>
            </div>
          </div>
        </div>

        <div class="quiz-actions">
          <button 
            class="submit-button"
            :disabled="!allQuestionsAnswered"
            @click="submitQuiz"
          >
            Submit Quiz
          </button>
        </div>
      </div>

      <div v-else class="results">
        <div :class="['results-card', passed ? 'passed' : 'failed']">
          <div class="results-icon">
            <svg v-if="passed" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>

          <h2>{{ passed ? 'Congratulations!' : 'Not Quite' }}</h2>
          <p class="results-message">
            {{ passed 
              ? 'You passed the quiz! Great job understanding the material.' 
              : 'You need to score higher to pass. Review the material and try again.' 
            }}
          </p>

          <div class="score-display">
            <span class="score">{{ score }}/{{ quiz.questions.length }}</span>
            <span class="score-label">Correct Answers</span>
          </div>
        </div>

        <div class="question-review">
          <h3>Review Your Answers</h3>
          <div 
            v-for="(question, index) in quiz.questions" 
            :key="question.id"
            class="review-card"
          >
            <div class="review-header">
              <span class="question-number">Question {{ index + 1 }}</span>
              <span :class="['result-badge', selectedAnswers[question.id] === question.correctAnswer ? 'correct' : 'incorrect']">
                {{ selectedAnswers[question.id] === question.correctAnswer ? 'Correct' : 'Incorrect' }}
              </span>
            </div>
            <h4>{{ question.question }}</h4>

            <div class="review-options">
              <div 
                v-for="(option, optionIndex) in question.options"
                :key="optionIndex"
                :class="[
                  'review-option',
                  {
                    'correct': optionIndex === question.correctAnswer,
                    'selected-wrong': selectedAnswers[question.id] === optionIndex && optionIndex !== question.correctAnswer
                  }
                ]"
              >
                <span class="option-text">{{ option }}</span>
                <span v-if="optionIndex === question.correctAnswer" class="badge">Correct Answer</span>
                <span v-else-if="selectedAnswers[question.id] === optionIndex" class="badge">Your Answer</span>
              </div>
            </div>
          </div>
        </div>

        <div class="results-actions">
          <button v-if="!passed" class="retry-button" @click="retakeQuiz">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="23 4 23 10 17 10"></polyline>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
            </svg>
            Retake Quiz
          </button>
          
          <button 
            v-if="passed && hasNextContent" 
            class="next-button"
            @click="navigateToNext"
          >
            Continue to Next Lesson
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>

          <button 
            v-if="passed && !hasNextContent"
            class="next-button"
            @click="router.push(`/classes/${courseId}/final-exam`)"
          >
            Take Final Exam
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.quiz-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}

.quiz-container {
  background: white;
}

.quiz-header {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid var(--border-light);

  h1 {
    font-size: 2rem;
    color: var(--text-dark);
    margin-bottom: 0.75rem;
    font-family: 'Playfair Display', serif;
  }

  .description {
    color: var(--text-light);
    line-height: 1.6;
    margin-bottom: 1rem;
  }

  .quiz-meta {
    display: flex;
    gap: 1rem;
    color: var(--text-lighter);
    font-size: 0.9rem;
  }
}

.questions {
  .question-card {
    background: var(--bg-light);
    border-radius: 12px;
    padding: 2rem;
    margin-bottom: 2rem;

    .question-header {
      margin-bottom: 1.5rem;

      .question-number {
        display: block;
        font-size: 0.75rem;
        color: var(--primary-color);
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 0.5rem;
      }

      h3 {
        font-size: 1.25rem;
        color: var(--text-dark);
        font-weight: 600;
      }
    }

    .options {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .option {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: white;
      border: 2px solid var(--border-light);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        border-color: var(--primary-color);
        background: rgba(74, 124, 89, 0.02);
      }

      &.selected {
        border-color: var(--primary-color);
        background: rgba(74, 124, 89, 0.05);

        .radio-circle {
          border-color: var(--primary-color);
        }
      }

      .option-radio {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;

        .radio-circle {
          width: 20px;
          height: 20px;
          border: 2px solid var(--border-light);
          border-radius: 50%;
          background: white;
          transition: all 0.2s ease;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;

          .radio-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: var(--primary-color);
          }
        }
      }

      .option-text {
        flex: 1;
        color: var(--text-dark);
      }
    }
  }
}

.quiz-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
}

.submit-button {
  padding: 1rem 2.5rem;
  background: var(--gradient);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:not(:disabled):hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px var(--shadow-medium);
  }
}

.results {
  .results-card {
    background: var(--bg-light);
    border-radius: 12px;
    padding: 3rem 2rem;
    text-align: center;
    margin-bottom: 2rem;

    &.passed {
      border: 3px solid var(--success-color);

      .results-icon svg {
        color: var(--success-color);
      }
    }

    &.failed {
      border: 3px solid var(--warning-color);

      .results-icon svg {
        color: var(--warning-color);
      }
    }

    .results-icon {
      margin-bottom: 1.5rem;

      svg {
        width: 64px;
        height: 64px;
      }
    }

    h2 {
      font-size: 2rem;
      color: var(--text-dark);
      margin-bottom: 1rem;
      font-family: 'Playfair Display', serif;
    }

    .results-message {
      color: var(--text-light);
      font-size: 1.05rem;
      margin-bottom: 2rem;
    }

    .score-display {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;

      .score {
        font-size: 3rem;
        font-weight: 700;
        color: var(--primary-color);
      }

      .score-label {
        color: var(--text-light);
        font-size: 0.95rem;
      }
    }
  }
}

.question-review {
  margin-bottom: 2rem;

  h3 {
    font-size: 1.5rem;
    color: var(--text-dark);
    margin-bottom: 1.5rem;
    font-family: 'Playfair Display', serif;
  }

  .review-card {
    background: var(--bg-light);
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;

    .review-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;

      .question-number {
        font-size: 0.75rem;
        color: var(--primary-color);
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .result-badge {
        padding: 0.375rem 0.75rem;
        border-radius: 16px;
        font-size: 0.85rem;
        font-weight: 600;

        &.correct {
          background: var(--success-color);
          color: white;
        }

        &.incorrect {
          background: var(--warning-color);
          color: white;
        }
      }
    }

    h4 {
      font-size: 1.1rem;
      color: var(--text-dark);
      margin-bottom: 1rem;
    }

    .review-options {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;

      .review-option {
        padding: 0.875rem;
        background: white;
        border: 2px solid var(--border-light);
        border-radius: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        &.correct {
          border-color: var(--success-color);
          background: rgba(107, 144, 128, 0.05);
        }

        &.selected-wrong {
          border-color: var(--warning-color);
          background: rgba(231, 111, 81, 0.05);
        }

        .option-text {
          color: var(--text-dark);
        }

        .badge {
          font-size: 0.8rem;
          font-weight: 600;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;

          .correct & {
            background: var(--success-color);
            color: white;
          }

          .selected-wrong & {
            background: var(--warning-color);
            color: white;
          }
        }
      }
    }
  }
}

.results-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.retry-button,
.next-button {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px var(--shadow-medium);
  }
}

.retry-button {
  background: var(--bg-secondary);
  color: var(--text-dark);
  border: 2px solid var(--border-light);

  &:hover {
    border-color: var(--primary-color);
  }
}

.next-button {
  background: var(--gradient);
  color: white;

  svg {
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: translateX(4px);
  }
}

@media (max-width: 768px) {
  .quiz-page {
    padding: 1rem;
  }

  .quiz-header h1 {
    font-size: 1.5rem;
  }

  .results-card h2 {
    font-size: 1.5rem;
  }

  .score-display .score {
    font-size: 2.5rem;
  }

  .results-actions {
    flex-direction: column;

    .retry-button,
    .next-button {
      width: 100%;
      justify-content: center;
    }
  }
}
</style>
