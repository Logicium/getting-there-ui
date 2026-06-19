<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getCourseById } from '@/data/courses'
import { useProgressStore } from '@/stores/progress'
import { useAuthStore } from '@/stores/auth'
import {
  AppBadge,
  AppButton,
  AppCard,
  AppContainer,
  AppEyebrow,
  AppHero,
  AppSection,
} from '@/components/ui'

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

  let correctAnswers = 0
  course.value.finalExam.questions.forEach(question => {
    if (selectedAnswers.value[question.id] === question.correctAnswer) {
      correctAnswers++
    }
  })

  score.value = correctAnswers
  passed.value = correctAnswers >= course.value.finalExam.passingScore
  showResults.value = true

  progressStore.saveFinalExamScore(courseId.value, correctAnswers, passed.value)

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

const answeredCount = computed(() => {
  if (!course.value) return 0
  return course.value.finalExam.questions.filter(q => selectedAnswers.value[q.id] !== undefined).length
})
</script>

<template>
  <main v-if="course" class="exam">
    <AppHero variant="editorial" tone="cream" align="center">
      <template #eyebrow>
        <AppEyebrow tone="fuchsia">Final exam · {{ course.title }}</AppEyebrow>
      </template>
      <template #title>{{ course.finalExam.title }}</template>
      <template #lede>
        <p>{{ course.finalExam.description }}</p>
      </template>
      <template #meta>
        <div class="exam__meta">
          <AppBadge tone="fuchsia" filled>{{ course.finalExam.questions.length }} questions</AppBadge>
          <AppBadge tone="cobalt">Pass: {{ course.finalExam.passingScore }}/{{ course.finalExam.questions.length }}</AppBadge>
          <AppBadge v-if="!showResults" tone="marigold">Timed · keep moving</AppBadge>
          <AppBadge v-if="!showResults" tone="ink">{{ answeredCount }} / {{ course.finalExam.questions.length }} answered</AppBadge>
        </div>
      </template>
    </AppHero>

    <AppSection v-if="!showResults" tone="cream-2" pad="xl">
      <AppContainer size="md">
        <div class="exam__questions">
          <AppCard
            v-for="(question, index) in course.finalExam.questions"
            :key="question.id"
            variant="plaque"
            tone="paper"
            shadow-tone="fuchsia"
            pad="lg"
          >
            <template #eyebrow>
              <AppEyebrow tone="fuchsia">Question {{ index + 1 }}</AppEyebrow>
            </template>
            <template #title>{{ question.question }}</template>

            <div class="exam__options">
              <AppButton
                v-for="(option, optionIndex) in question.options"
                :key="optionIndex"
                :variant="selectedAnswers[question.id] === optionIndex ? 'primary' : 'ghost'"
                size="md"
                block
                @click="selectAnswer(question.id, optionIndex)"
              >
                {{ option }}
              </AppButton>
            </div>
          </AppCard>
        </div>

        <div class="exam__submit">
          <AppButton
            variant="primary"
            size="lg"
            :disabled="!allQuestionsAnswered"
            @click="submitExam"
          >
            Submit Final Exam
          </AppButton>
        </div>
      </AppContainer>
    </AppSection>

    <AppSection v-else tone="cream-2" pad="xl">
      <AppContainer size="md">
        <AppCard
          variant="plaque"
          :tone="passed ? 'mint' : 'paper'"
          :shadow-tone="passed ? 'mint' : 'fuchsia'"
          pad="lg"
        >
          <template #eyebrow>
            <AppEyebrow :tone="passed ? 'mint' : 'fuchsia'">{{ passed ? 'Course complete' : 'Try again' }}</AppEyebrow>
          </template>
          <template #title>{{ passed ? 'Congratulations!' : 'Not Quite' }}</template>

          <p class="exam__result-text">
            {{ passed
              ? 'You have successfully completed the course! You can now view and print your certificate of completion.'
              : 'You need to score higher to pass the final exam. Review the course material and try again.'
            }}
          </p>

          <div class="exam__score">
            <span class="exam__score-number">{{ score }}/{{ course.finalExam.questions.length }}</span>
            <span class="exam__score-label">Correct answers</span>
          </div>
        </AppCard>

        <div class="exam__review">
          <header class="exam__review-head">
            <AppEyebrow tone="fuchsia">Review</AppEyebrow>
            <h2 class="u-display u-display--md">Your answers</h2>
          </header>

          <AppCard
            v-for="(question, index) in course.finalExam.questions"
            :key="question.id"
            variant="flat"
            tone="paper"
            pad="md"
          >
            <template #eyebrow>
              <div class="exam__review-head-row">
                <AppEyebrow tone="fuchsia">Question {{ index + 1 }}</AppEyebrow>
                <AppBadge :tone="selectedAnswers[question.id] === question.correctAnswer ? 'mint' : 'fuchsia'" filled>
                  {{ selectedAnswers[question.id] === question.correctAnswer ? 'Correct' : 'Incorrect' }}
                </AppBadge>
              </div>
            </template>
            <template #title>{{ question.question }}</template>

            <div class="exam__review-options">
              <div
                v-for="(option, optionIndex) in question.options"
                :key="optionIndex"
                class="exam__review-option"
                :class="{
                  'is-correct': optionIndex === question.correctAnswer,
                  'is-wrong': selectedAnswers[question.id] === optionIndex && optionIndex !== question.correctAnswer
                }"
              >
                <span>{{ option }}</span>
                <AppBadge v-if="optionIndex === question.correctAnswer" tone="mint" size="sm">Correct answer</AppBadge>
                <AppBadge v-else-if="selectedAnswers[question.id] === optionIndex" tone="fuchsia" size="sm">Your answer</AppBadge>
              </div>
            </div>
          </AppCard>
        </div>

        <div class="exam__actions">
          <AppButton v-if="!passed" variant="secondary" size="lg" @click="retakeExam">
            Retake Exam
          </AppButton>
          <AppButton
            v-if="!passed"
            variant="ghost"
            size="lg"
            @click="router.push(`/classes/${courseId}/learn`)"
          >
            Review Course
          </AppButton>
          <AppButton v-if="passed" variant="primary" size="lg" @click="viewCertificate">
            View Certificate
          </AppButton>
        </div>
      </AppContainer>
    </AppSection>
  </main>
</template>

<style scoped lang="scss">
.exam {
  &__meta {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--s-2);
  }

  &__questions {
    display: flex;
    flex-direction: column;
    gap: var(--s-6);
  }

  &__options {
    display: flex;
    flex-direction: column;
    gap: var(--s-3);
  }

  &__submit {
    display: flex;
    justify-content: center;
    margin-top: var(--s-7);
  }

  &__result-text {
    margin: 0 0 var(--s-5);
    line-height: var(--lh-base);
  }

  &__score {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--s-1);

    &-number {
      font-family: var(--font-display);
      font-size: var(--fs-5xl);
      font-weight: 700;
      color: var(--c-fuchsia-deep);
      line-height: 1;
    }

    &-label {
      font-family: var(--font-body);
      font-size: var(--fs-sm);
      text-transform: uppercase;
      letter-spacing: var(--ls-wide);
      color: var(--c-text-muted);
    }
  }

  &__review {
    margin-top: var(--s-8);
    display: flex;
    flex-direction: column;
    gap: var(--s-4);

    &-head {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--s-2);
      margin-bottom: var(--s-4);
    }

    &-head-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--s-3);
    }

    &-options {
      display: flex;
      flex-direction: column;
      gap: var(--s-2);
    }

    &-option {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--s-3);
      padding: var(--s-3) var(--s-4);
      background: var(--c-cream-2);
      border: 1.5px solid var(--c-ink);
      border-radius: var(--r-sm);
      font-family: var(--font-body);

      &.is-correct {
        background: var(--c-mint-soft);
        border-color: var(--c-mint-deep);
      }

      &.is-wrong {
        background: var(--c-fuchsia-soft);
        border-color: var(--c-fuchsia);
      }
    }
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--s-3);
    margin-top: var(--s-7);
  }
}
</style>
