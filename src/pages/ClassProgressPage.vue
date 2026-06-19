<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink, RouterView } from 'vue-router'
import { getCourseById, type Course } from '@/data/courses'
import { useProgressStore } from '@/stores/progress'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const progressStore = useProgressStore()
const authStore = useAuthStore()

const courseId = computed(() => route.params.courseId as string)
const course = ref<Course | undefined>()
const sidebarOpen = ref(true)

onMounted(() => {
  course.value = getCourseById(courseId.value)

  if (!course.value) {
    router.push('/classes')
    return
  }

  if (!authStore.isAuthenticated || !authStore.isSubscribed) {
    router.push(`/classes/${courseId.value}`)
    return
  }

  const firstChapter = course.value.chapters[0]
  const firstContent = firstChapter.content[0]
  progressStore.initializeCourseProgress(courseId.value, firstChapter.id, firstContent.id)

  const currentChapterId = route.params.chapterId
  const currentContentId = route.params.contentId

  if (!currentChapterId || !currentContentId) {
    const currentProgress = progressStore.getCourseProgress(courseId.value)
    if (currentProgress) {
      navigateToContent(currentProgress.currentChapterId, currentProgress.currentContentId)
    }
  }
})

function navigateToContent(chapterId: string, contentId: string) {
  const chapter = course.value?.chapters.find(c => c.id === chapterId)
  const content = chapter?.content.find(c => c.id === contentId)

  if (content && 'videoUrl' in content) {
    router.push(`/classes/${courseId.value}/learn/${chapterId}/${contentId}/video`)
  } else if (content && 'questions' in content) {
    router.push(`/classes/${courseId.value}/learn/${chapterId}/${contentId}/quiz`)
  }
}

function navigateToFinalExam() {
  router.push(`/classes/${courseId.value}/final-exam`)
}

function isContentComplete(contentId: string): boolean {
  return progressStore.isContentComplete(courseId.value, contentId)
}

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}

const totalItems = computed(() => {
  if (!course.value) return 0
  return course.value.chapters.reduce((sum, chapter) => sum + chapter.content.length, 0) + 1
})

const progressPercentage = computed(() =>
  progressStore.getProgressPercentage(courseId.value, totalItems.value),
)
</script>

<template>
  <div v-if="course" class="progress-page">
    <div class="progress-page__mobile-bar">
      <button class="progress-page__toggle" @click="toggleSidebar" aria-label="Toggle course menu">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="6"  x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
        Course content
      </button>
      <span class="progress-page__mobile-pct">{{ progressPercentage }}%</span>
    </div>

    <aside :class="['progress-page__sidebar', { 'is-open': sidebarOpen }]">
      <header class="progress-page__sidebar-head">
        <RouterLink :to="`/classes/${courseId}`" class="progress-page__back">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to course
        </RouterLink>

        <span class="progress-page__eyebrow">Now Learning</span>
        <h2 class="progress-page__course-title">{{ course.title }}</h2>

        <div class="progress-page__bar">
          <div class="progress-page__bar-fill" :style="{ width: `${progressPercentage}%` }" />
        </div>
        <p class="progress-page__pct">{{ progressPercentage }}% complete</p>
      </header>

      <div class="progress-page__sidebar-body">
        <section
          v-for="(chapter, chapterIndex) in course.chapters"
          :key="chapter.id"
          class="progress-page__chapter"
        >
          <header class="progress-page__chapter-head">
            <span class="progress-page__chapter-num">0{{ chapterIndex + 1 }}</span>
            <h3>{{ chapter.title }}</h3>
          </header>

          <ul class="progress-page__list">
            <li
              v-for="item in chapter.content"
              :key="item.id"
              :class="['progress-page__item', { 'is-complete': isContentComplete(item.id) }]"
              @click="navigateToContent(chapter.id, item.id)"
            >
              <span class="progress-page__icon">
                <svg v-if="isContentComplete(item.id)" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <svg v-else-if="'videoUrl' in item" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 11l3 3L22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
              </span>
              <span class="progress-page__item-text">
                <span class="progress-page__item-title">{{ item.title }}</span>
                <span v-if="'duration' in item" class="progress-page__item-meta">{{ item.duration }}</span>
              </span>
            </li>
          </ul>
        </section>

        <section class="progress-page__chapter">
          <header class="progress-page__chapter-head">
            <span class="progress-page__chapter-num">★</span>
            <h3>Final exam</h3>
          </header>
          <ul class="progress-page__list">
            <li
              :class="['progress-page__item', { 'is-complete': progressStore.hasCompletedCourse(courseId) }]"
              @click="navigateToFinalExam"
            >
              <span class="progress-page__icon">
                <svg v-if="progressStore.hasCompletedCourse(courseId)" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </span>
              <span class="progress-page__item-text">
                <span class="progress-page__item-title">{{ course.finalExam.title }}</span>
                <span class="progress-page__item-meta">{{ course.finalExam.questions.length }} questions</span>
              </span>
            </li>
          </ul>
        </section>
      </div>
    </aside>

    <main class="progress-page__content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped lang="scss">
$sidebar-w: 360px;

.progress-page {
  display: flex;
  min-height: 100vh;
  padding-top: 80px;
  background: var(--c-cream);

  &__mobile-bar {
    display: none;
    position: fixed;
    top: 80px;
    left: 0;
    right: 0;
    z-index: 100;
    padding: var(--s-3) var(--s-4);
    background: var(--c-paper);
    border-bottom: 2px solid var(--c-ink);
    justify-content: space-between;
    align-items: center;
  }

  &__toggle {
    display: inline-flex;
    align-items: center;
    gap: var(--s-2);
    background: none;
    border: none;
    color: var(--c-ink);
    font-family: var(--font-body);
    font-weight: 700;
    cursor: pointer;
  }

  &__mobile-pct {
    font-family: var(--font-accent);
    color: var(--c-cobalt);
    font-size: var(--fs-md);
  }

  &__sidebar {
    width: $sidebar-w;
    flex-shrink: 0;
    position: sticky;
    top: 80px;
    align-self: flex-start;
    max-height: calc(100vh - 80px);
    overflow-y: auto;
    background: var(--c-cream-2);
    border-right: 3px solid var(--c-ink);
  }

  &__sidebar-head {
    padding: var(--s-6) var(--s-5);
    background: var(--c-paper);
    border-bottom: 3px solid var(--c-ink);
  }

  &__back {
    display: inline-flex;
    align-items: center;
    gap: var(--s-2);
    color: var(--c-cobalt);
    text-decoration: none;
    font-weight: 700;
    font-size: var(--fs-sm);
    text-transform: uppercase;
    letter-spacing: var(--ls-wide);
    margin-bottom: var(--s-4);
    transition: gap var(--dur-fast) var(--ease-out);

    &:hover { gap: var(--s-3); }
  }

  &__eyebrow {
    display: block;
    font-family: var(--font-body);
    font-size: var(--fs-xs);
    color: var(--c-fuchsia);
    text-transform: uppercase;
    letter-spacing: var(--ls-wider);
    font-weight: 700;
    margin-bottom: var(--s-1);
  }

  &__course-title {
    font-family: var(--font-display);
    font-size: var(--fs-xl);
    color: var(--c-ink);
    margin: 0 0 var(--s-4);
    line-height: var(--lh-tight);
  }

  &__bar {
    height: 10px;
    background: var(--c-cream-3);
    border: 2px solid var(--c-ink);
    border-radius: 999px;
    overflow: hidden;
  }

  &__bar-fill {
    height: 100%;
    background: var(--c-marigold);
    transition: width var(--dur-md) var(--ease-out);
  }

  &__pct {
    margin: var(--s-2) 0 0;
    font-family: var(--font-accent);
    color: var(--c-cobalt);
    font-size: var(--fs-md);
  }

  &__sidebar-body { padding: var(--s-4) 0; }

  &__chapter { margin-bottom: var(--s-5); }

  &__chapter-head {
    display: flex;
    align-items: baseline;
    gap: var(--s-3);
    padding: var(--s-2) var(--s-5) var(--s-3);

    h3 {
      font-family: var(--font-display);
      font-size: var(--fs-md);
      color: var(--c-ink);
      margin: 0;
    }
  }

  &__chapter-num {
    font-family: var(--font-accent);
    color: var(--c-marigold-deep);
    font-size: var(--fs-lg);
  }

  &__list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  &__item {
    display: flex;
    align-items: flex-start;
    gap: var(--s-3);
    padding: var(--s-3) var(--s-5);
    cursor: pointer;
    border-left: 4px solid transparent;
    transition: background var(--dur-fast), border-color var(--dur-fast);

    &:hover {
      background: var(--c-marigold-soft);
      border-left-color: var(--c-cobalt);
    }

    &.is-complete {
      .progress-page__icon { color: var(--c-mint-deep); }
      .progress-page__item-title { color: var(--c-text-muted); }
    }
  }

  &__icon {
    color: var(--c-text-subtle);
    flex-shrink: 0;
    margin-top: 2px;
  }

  &__item-text {
    display: flex;
    flex-direction: column;
    gap: var(--s-1);
  }

  &__item-title {
    font-family: var(--font-body);
    font-weight: 600;
    color: var(--c-ink);
    font-size: var(--fs-sm);
  }

  &__item-meta {
    font-size: var(--fs-xs);
    color: var(--c-text-subtle);
  }

  &__content {
    flex: 1;
    min-width: 0;
  }

  @media (max-width: 880px) {
    &__mobile-bar { display: flex; }
    padding-top: calc(80px + 56px);

    &__sidebar {
      position: fixed;
      top: calc(80px + 56px);
      left: 0;
      bottom: 0;
      width: min(100%, 340px);
      z-index: 90;
      transform: translateX(-100%);
      transition: transform var(--dur-md) var(--ease-out);

      &.is-open { transform: translateX(0); }
    }
  }
}
</style>
