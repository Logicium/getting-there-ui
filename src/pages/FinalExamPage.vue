<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getCourseById } from '@/data/courses'
import { useProgressStore } from '@/stores/progress'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const progressStore = useProgressStore()
const authStore = useAuthStore()

const courseId = computed(() => route.params.courseId as string)
const course = ref(getCourseById(courseId.value))

const selectedAnswers = ref<Record<string, number>>({})
const showResults = ref(false)
const score = ref(0)
const passed = ref(false)

onMounted(() => {
  if (!course.value) {
    router.push('/classes')
    return
  }

  if (!authStore.isAuthenticated || !authStore.isSubscribed) {
    router.push(`/classes/${courseId.value}`)
    return
  }
})

function selectAnswer(questionId: string, answerIndex: number) {
  if (!showResults.value) {
    selectedAnswers.value[questionId] = answerIndex
  }
}

function submitExam() {
  if (!course.value) return

  // Calculate score
  let correctAnswers = 0
  course.value.finalExam.questions.forEach(question => {
    if (selectedAnswers.value[question.id] === question.correctAnswer) {
      correctAnswers++
    }
  })

  score.value = correctAnswers
  passed.value = correctAnswers >= course.value.finalExam.passingScore
  showResults.value = true

  // Save final exam score
  progressStore.saveFinalExamScore(courseId.value, correctAnswers, passed.value)
  
  // Mark course as completed for user
  if (passed.value) {
    authStore.markCourseCompleted(courseId.value)
  }
}

function retakeExam() {
  selectedAnswers.value = {}
  showResults.value = false
  score.value = 0
  passed.value = false
}

function viewCertificate() {
  router.push(`/classes/${courseId.value}/certificate`)
}

const allQuestionsAnswered = computed(() => {
  if (!course.value) return false
  return course.value.finalExam.questions.every(q => selectedAnswers.value[q.id] !== undefined)
})
</script>

<template>
  <div v-if="course" class="final-exam-page">
    <div class="exam-container">
      <div class="exam-header">
        <h1>{{ course.finalExam.title }}</h1>
        <p class="description">{{ course.finalExam.description }}</p>
        <div class="exam-meta">
          <span>{{ course.finalExam.questions.length }} Questions</span>
          <span>•</span>
          <span>Pass with {{ course.finalExam.passingScore }}/{{ course.finalExam.questions.length }} correct</span>
        </div>
      </div>

      <div v-if="!showResults" class="questions">
        <div 
          v-for="(question, index) in course.finalExam.questions" 
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

        <div class="exam-actions">
          <button 
            class="submit-button"
            :disabled="!allQuestionsAnswered"
            @click="submitExam"
          >
            Submit Final Exam
          </button>
        </div>
      </div>

      <div v-else class="results">
        <div :class="['results-card', passed ? 'passed' : 'failed']">
          <div class="results-icon">
            <svg v-if="passed" xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>

          <h2>{{ passed ? 'Congratulations!' : 'Not Quite' }}</h2>
          <p class="results-message">
            {{ passed 
              ? 'You have successfully completed the course! You can now view and print your certificate of completion.' 
              : 'You need to score higher to pass the final exam. Review the course material and try again.' 
            }}
          </p>

          <div class="score-display">
            <span class="score">{{ score }}/{{ course.finalExam.questions.length }}</span>
            <span class="score-label">Correct Answers</span>
          </div>
        </div>

        <div class="question-review">
          <h3>Review Your Answers</h3>
          <div 
            v-for="(question, index) in course.finalExam.questions" 
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
          <button v-if="!passed" class="retry-button" @click="retakeExam">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="23 4 23 10 17 10"></polyline>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
            </svg>
            Retake Exam
          </button>
          
          <button v-if="!passed" class="review-button" @click="router.push(`/classes/${courseId}/learn`)">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
            Review Course
          </button>

          <button v-if="passed" class="certificate-button" @click="viewCertificate">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            View Certificate
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.final-exam-page {
  min-height: 100vh;
  padding-top: 80px;
  background: var(--bg-light);
}

.exam-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  min-height: calc(100vh - 80px);
}

.exam-header {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid var(--border-light);

  h1 {
    font-size: 2.25rem;
    color: var(--text-dark);
    margin-bottom: 0.75rem;
    font-family: 'Playfair Display', serif;
  }

  .description {
    color: var(--text-light);
    line-height: 1.6;
    margin-bottom: 1rem;
    font-size: 1.05rem;
  }

  .exam-meta {
    display: flex;
    gap: 1rem;
    color: var(--text-lighter);
    font-size: 0.9rem;
    font-weight: 600;
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

.exam-actions {
  display: flex;
  justify-content: center;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 2px solid var(--border-light);
}

.submit-button {
  padding: 1.25rem 3rem;
  background: var(--gradient);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.15rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:not(:disabled):hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px var(--shadow-medium);
  }
}

.results {
  .results-card {
    background: var(--bg-light);
    border-radius: 16px;
    padding: 4rem 2rem;
    text-align: center;
    margin-bottom: 3rem;

    &.passed {
      border: 4px solid var(--success-color);

      .results-icon svg {
        color: var(--success-color);
      }
    }

    &.failed {
      border: 4px solid var(--warning-color);

      .results-icon svg {
        color: var(--warning-color);
      }
    }

    .results-icon {
      margin-bottom: 2rem;

      svg {
        width: 80px;
        height: 80px;
      }
    }

    h2 {
      font-size: 2.5rem;
      color: var(--text-dark);
      margin-bottom: 1rem;
      font-family: 'Playfair Display', serif;
    }

    .results-message {
      color: var(--text-light);
      font-size: 1.15rem;
      line-height: 1.6;
      margin-bottom: 2.5rem;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    .score-display {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;

      .score {
        font-size: 4rem;
        font-weight: 700;
        color: var(--primary-color);
      }

      .score-label {
        color: var(--text-light);
        font-size: 1.05rem;
        font-weight: 600;
      }
    }
  }
}

.question-review {
  margin-bottom: 3rem;

  h3 {
    font-size: 1.75rem;
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
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.retry-button,
.review-button,
.certificate-button {
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

.retry-button,
.review-button {
  background: var(--bg-secondary);
  color: var(--text-dark);
  border: 2px solid var(--border-light);

  &:hover {
    border-color: var(--primary-color);
  }
}

.certificate-button {
  background: var(--gradient);
  color: white;

  svg {
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: scale(1.1);
  }
}

@media (max-width: 768px) {
  .exam-container {
    padding: 1rem;
  }

  .exam-header h1 {
    font-size: 1.75rem;
  }

  .results-card h2 {
    font-size: 2rem;
  }

  .score-display .score {
    font-size: 3rem;
  }

  .results-actions {
    flex-direction: column;

    .retry-button,
    .review-button,
    .certificate-button {
      width: 100%;
      justify-content: center;
    }
  }
}
</style>
