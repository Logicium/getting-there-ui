<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getCourseById } from '@/data/courses'
import { useProgressStore } from '@/stores/progress'
import { useAuthStore } from '@/stores/auth'
import {
  AppBadge,
  AppBlob,
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
const courseProgress = computed(() => progressStore.getCourseProgress(courseId.value))

onMounted(() => {
  if (!course.value) {
    router.push('/classes')
    return
  }

  if (!progressStore.hasCompletedCourse(courseId.value)) {
    router.push(`/classes/${courseId.value}`)
    return
  }
})

function printCertificate() {
  window.print()
}

const completionDate = computed(() => {
  const dateStr = courseProgress.value?.completedAt
  if (!dateStr) return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
})

const recipientName = computed(() => authStore.user?.name || 'Student')
</script>

<template>
  <main v-if="course" class="cert">
    <AppHero variant="magazine" tone="cream" align="center" class="cert__hero no-print">
      <template #eyebrow>
        <AppEyebrow tone="marigold">Certificate of completion</AppEyebrow>
      </template>
      <template #title>
        <span class="cert__title-line">Congratulations,</span>
        <span class="u-accent-type cert__name">{{ recipientName }}</span>
      </template>
      <template #lede>
        <p>You completed <strong>{{ course.title }}</strong>. Below is your printable certificate.</p>
      </template>
      <template #actions>
        <AppButton variant="primary" size="lg" @click="printCertificate">Print Certificate</AppButton>
        <AppButton :to="`/classes/${courseId}`" variant="ghost" size="lg">Back to Course</AppButton>
      </template>
      <template #media>
        <div class="cert__hero-art" aria-hidden="true">
          <AppBlob tone="marigold" :size="320" />
        </div>
      </template>
    </AppHero>

    <AppSection tone="marigold" pad="xl">
      <AppContainer size="lg">
        <div class="cert__stage">
          <AppCard
            variant="ticket"
            tone="paper"
            shadow-tone="marigold"
            pad="lg"
            class="cert__doc"
          >
            <div class="cert__seal" aria-hidden="true">
              <AppBlob tone="marigold" :size="180" />
            </div>

            <div class="cert__inner">
              <header class="cert__head">
                <AppEyebrow tone="marigold">Getting There</AppEyebrow>
                <h2 class="cert__heading">Certificate of Completion</h2>
                <div class="cert__rule" aria-hidden="true" />
              </header>

              <section class="cert__body">
                <p class="cert__presented">This certificate is presented to</p>
                <p class="cert__recipient u-accent-type">{{ recipientName }}</p>
                <p class="cert__for">for successfully completing</p>
                <h3 class="cert__course">{{ course.title }}</h3>
                <p class="cert__subtitle">{{ course.subtitle }}</p>

                <dl class="cert__details">
                  <div class="cert__detail">
                    <dt>Completed</dt>
                    <dd>{{ completionDate }}</dd>
                  </div>
                  <div class="cert__detail">
                    <dt>Duration</dt>
                    <dd>{{ course.duration }}</dd>
                  </div>
                  <div class="cert__detail">
                    <dt>Final score</dt>
                    <dd>{{ courseProgress?.finalExamScore }}/{{ course.finalExam.questions.length }}</dd>
                  </div>
                </dl>
              </section>

              <footer class="cert__foot">
                <div class="cert__sign">
                  <div class="cert__sign-line" aria-hidden="true" />
                  <p class="cert__sign-name">{{ course.instructor.name }}</p>
                  <p class="cert__sign-title">{{ course.instructor.title }}</p>
                </div>
                <AppBadge tone="marigold" filled size="lg" class="cert__stamp">Verified</AppBadge>
              </footer>
            </div>
          </AppCard>
        </div>
      </AppContainer>
    </AppSection>

    <AppSection tone="cream" pad="lg" class="no-print">
      <AppContainer size="md">
        <div class="cert__cta">
          <AppButton variant="primary" size="lg" @click="printCertificate">Print Certificate</AppButton>
          <AppButton :to="`/classes/${courseId}`" variant="secondary" size="lg">Back to Course</AppButton>
          <AppButton to="/classes" variant="ghost" size="lg">Browse More Classes</AppButton>
        </div>
      </AppContainer>
    </AppSection>
  </main>
</template>

<style scoped lang="scss">
.cert {
  &__hero-art {
    position: relative;
    width: 100%;
    max-width: 360px;
    aspect-ratio: 1 / 1;
    margin-inline: auto;
  }

  &__title-line {
    display: block;
    font-family: var(--font-display);
  }

  &__name {
    display: block;
    font-size: clamp(var(--fs-4xl), 6vw, var(--fs-6xl));
    color: var(--c-marigold-deep);
    line-height: 1;
    margin-top: var(--s-2);
  }

  &__stage {
    display: flex;
    justify-content: center;
  }

  &__doc {
    position: relative;
    width: 100%;
    max-width: 880px;
    aspect-ratio: 8.5 / 11;
    overflow: visible;
  }

  &__seal {
    position: absolute;
    inset: auto -40px -40px auto;
    width: 200px;
    height: 200px;
    pointer-events: none;
    z-index: 0;
  }

  &__inner {
    position: relative;
    z-index: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: var(--s-6);
    padding: var(--s-5);
  }

  &__head {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--s-3);
  }

  &__heading {
    font-family: var(--font-display);
    font-size: clamp(var(--fs-2xl), 4vw, var(--fs-4xl));
    color: var(--c-ink);
    margin: 0;
  }

  &__rule {
    width: 200px;
    height: 3px;
    background: var(--c-marigold);
  }

  &__body {
    text-align: center;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: var(--s-3);
  }

  &__presented,
  &__for {
    margin: 0;
    font-style: italic;
    color: var(--c-text-muted);
    font-size: var(--fs-md);
  }

  &__recipient {
    margin: var(--s-2) 0;
    font-size: clamp(var(--fs-3xl), 5vw, var(--fs-5xl));
    color: var(--c-marigold-deep);
    line-height: 1.1;
  }

  &__course {
    margin: 0;
    font-family: var(--font-display);
    font-size: clamp(var(--fs-xl), 3vw, var(--fs-3xl));
    color: var(--c-ink);
  }

  &__subtitle {
    margin: 0;
    color: var(--c-text-muted);
    font-style: italic;
  }

  &__details {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--s-6);
    margin: var(--s-5) 0 0;
  }

  &__detail {
    display: flex;
    flex-direction: column;
    gap: var(--s-1);

    dt {
      font-family: var(--font-body);
      font-size: var(--fs-xs);
      text-transform: uppercase;
      letter-spacing: var(--ls-wide);
      color: var(--c-text-muted);
    }

    dd {
      margin: 0;
      font-weight: 700;
      color: var(--c-ink);
    }
  }

  &__foot {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: var(--s-4);
  }

  &__sign {
    flex: 1;
    text-align: center;
  }

  &__sign-line {
    width: 240px;
    height: 2px;
    background: var(--c-ink);
    margin: 0 auto var(--s-2);
  }

  &__sign-name {
    margin: 0;
    font-weight: 700;
    color: var(--c-ink);
  }

  &__sign-title {
    margin: 0;
    font-size: var(--fs-sm);
    color: var(--c-text-muted);
  }

  &__stamp {
    flex-shrink: 0;
  }

  &__cta {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--s-3);
  }
}

@media print {
  .no-print { display: none !important; }

  .cert {
    background: white;

    &__doc {
      max-width: 100%;
      aspect-ratio: auto;
      box-shadow: none;
      border-width: 1.5px;
    }
  }
}
</style>
