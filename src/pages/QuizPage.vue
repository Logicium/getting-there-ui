<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getCourseById, getChapterById, getContentById, isQuiz, isVideo, type Quiz } from '@/data/courses'
import { useProgressStore } from '@/stores/progress'
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

  let correctAnswers = 0
  quiz.value.questions.forEach(question => {
    if (selectedAnswers.value[question.id] === question.correctAnswer) {
      correctAnswers++
    }
  })

  score.value = correctAnswers
  passed.value = correctAnswers >= quiz.value.passingScore
  showResults.value = true

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

  if (currentContentIndex < chapter.value.content.length - 1) {
    const nextContent = chapter.value.content[currentContentIndex + 1]
    if (isVideo(nextContent)) {
      router.push(`/classes/${courseId.value}/learn/${chapterId.value}/${nextContent.id}/video`)
    } else {
      router.push(`/classes/${courseId.value}/learn/${chapterId.value}/${nextContent.id}/quiz`)
    }
  }
  else if (currentChapterIndex < course.value.chapters.length - 1) {
    const nextChapter = course.value.chapters[currentChapterIndex + 1]
    const nextContent = nextChapter.content[0]
    if (isVideo(nextContent)) {
      router.push(`/classes/${courseId.value}/learn/${nextChapter.id}/${nextContent.id}/video`)
    } else {
      router.push(`/classes/${courseId.value}/learn/${nextChapter.id}/${nextContent.id}/quiz`)
    }
  }
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

const answeredCount = computed(() => {
  if (!quiz.value) return 0
  return quiz.value.questions.filter(q => selectedAnswers.value[q.id] !== undefined).length
})
</script>

<template>
  <main v-if="quiz" class="quiz">
    <AppHero variant="compact" tone="cream" align="center">
      <template #eyebrow>
        <AppEyebrow tone="cobalt">{{ chapter?.title || 'Module quiz' }}</AppEyebrow>
      </template>
      <template #title>{{ quiz.title }}</template>
      <template #lede>
        <p>{{ quiz.description }}</p>
      </template>
      <template #meta>
        <div class="quiz__meta">
          <AppBadge tone="cobalt">{{ quiz.questions.length }} questions</AppBadge>
          <AppBadge tone="mint">Pass: {{ quiz.passingScore }}/{{ quiz.questions.length }}</AppBadge>
          <AppBadge v-if="!showResults" tone="marigold">{{ answeredCount }} / {{ quiz.questions.length }} answered</AppBadge>
        </div>
      </template>
    </AppHero>

    <AppSection v-if="!showResults" tone="paper" pad="xl">
      <AppContainer size="md">
        <div class="quiz__questions">
          <AppCard
            v-for="(question, index) in quiz.questions"
            :key="question.id"
            variant="plaque"
            tone="paper"
            shadow-tone="cobalt"
            pad="lg"
          >
            <template #eyebrow>
              <AppEyebrow tone="cobalt">Question {{ index + 1 }}</AppEyebrow>
            </template>
            <template #title>{{ question.question }}</template>

            <div class="quiz__options">
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

        <div class="quiz__submit">
          <AppButton
            variant="primary"
            size="lg"
            :disabled="!allQuestionsAnswered"
            @click="submitQuiz"
          >
            Submit Quiz
          </AppButton>
        </div>
      </AppContainer>
    </AppSection>

    <AppSection v-else tone="mint" pad="xl">
      <AppContainer size="md">
        <AppCard
          variant="plaque"
          :tone="passed ? 'mint' : 'paper'"
          :shadow-tone="passed ? 'mint' : 'fuchsia'"
          pad="lg"
        >
          <template #eyebrow>
            <AppEyebrow :tone="passed ? 'mint' : 'fuchsia'">{{ passed ? 'Passed' : 'Try again' }}</AppEyebrow>
          </template>
          <template #title>{{ passed ? 'Congratulations!' : 'Not Quite' }}</template>

          <p class="quiz__result-text">
            {{ passed
              ? 'You passed the quiz! Great job understanding the material.'
              : 'You need to score higher to pass. Review the material and try again.'
            }}
          </p>

          <div class="quiz__score">
            <span class="quiz__score-number">{{ score }}/{{ quiz.questions.length }}</span>
            <span class="quiz__score-label">Correct answers</span>
          </div>
        </AppCard>

        <div class="quiz__review">
          <header class="quiz__review-head">
            <AppEyebrow tone="cobalt">Review</AppEyebrow>
            <h2 class="u-display u-display--md">Your answers</h2>
          </header>

          <AppCard
            v-for="(question, index) in quiz.questions"
            :key="question.id"
            variant="flat"
            tone="paper"
            pad="md"
          >
            <template #eyebrow>
              <div class="quiz__review-head-row">
                <AppEyebrow tone="cobalt">Question {{ index + 1 }}</AppEyebrow>
                <AppBadge :tone="selectedAnswers[question.id] === question.correctAnswer ? 'mint' : 'fuchsia'" filled>
                  {{ selectedAnswers[question.id] === question.correctAnswer ? 'Correct' : 'Incorrect' }}
                </AppBadge>
              </div>
            </template>
            <template #title>{{ question.question }}</template>

            <div class="quiz__review-options">
              <div
                v-for="(option, optionIndex) in question.options"
                :key="optionIndex"
                class="quiz__review-option"
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

        <div class="quiz__actions">
          <AppButton v-if="!passed" variant="secondary" size="lg" @click="retakeQuiz">
            Retake Quiz
          </AppButton>

          <AppButton
            v-if="passed && hasNextContent"
            variant="primary"
            size="lg"
            @click="navigateToNext"
          >
            Continue to Next Lesson
          </AppButton>

          <AppButton
            v-if="passed && !hasNextContent"
            variant="primary"
            size="lg"
            @click="router.push(`/classes/${courseId}/final-exam`)"
          >
            Take Final Exam
          </AppButton>
        </div>
      </AppContainer>
    </AppSection>
  </main>
</template>

<style scoped lang="scss">
.quiz {
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
      color: var(--c-cobalt);
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
