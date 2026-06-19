<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getCourseById, getChapterById, getContentById, isVideo, type Video } from '@/data/courses'
import { useProgressStore } from '@/stores/progress'
import { AppBadge, AppButton, AppCard, AppContainer } from '@/components/ui'

const route = useRoute()
const router = useRouter()
const progressStore = useProgressStore()

const courseId = computed(() => route.params.courseId as string)
const chapterId = computed(() => route.params.chapterId as string)
const contentId = computed(() => route.params.contentId as string)

const course = ref(getCourseById(courseId.value))
const chapter = ref(getChapterById(courseId.value, chapterId.value))
const video = ref<Video | undefined>()
const videoWatched = ref(false)

onMounted(() => {
  const content = getContentById(courseId.value, chapterId.value, contentId.value)

  if (!content || !isVideo(content)) {
    router.push(`/classes/${courseId.value}/learn`)
    return
  }

  video.value = content
  progressStore.updateCurrentContent(courseId.value, chapterId.value, contentId.value)

  if (progressStore.isContentComplete(courseId.value, contentId.value)) {
    videoWatched.value = true
  }

  setTimeout(() => {
    markAsComplete()
  }, 3000)
})

function markAsComplete() {
  if (!videoWatched.value) {
    progressStore.markContentComplete(courseId.value, contentId.value)
    videoWatched.value = true
  }
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
  } else if (currentChapterIndex < course.value.chapters.length - 1) {
    const nextChapter = course.value.chapters[currentChapterIndex + 1]
    const nextContent = nextChapter.content[0]
    if (isVideo(nextContent)) {
      router.push(`/classes/${courseId.value}/learn/${nextChapter.id}/${nextContent.id}/video`)
    } else {
      router.push(`/classes/${courseId.value}/learn/${nextChapter.id}/${nextContent.id}/quiz`)
    }
  } else {
    router.push(`/classes/${courseId.value}/final-exam`)
  }
}

const hasNextContent = computed(() => {
  if (!course.value || !chapter.value) return false

  const currentChapterIndex = course.value.chapters.findIndex(c => c.id === chapterId.value)
  const currentContentIndex = chapter.value.content.findIndex(c => c.id === contentId.value)

  return (
    currentContentIndex < chapter.value.content.length - 1 ||
    currentChapterIndex < course.value.chapters.length - 1
  )
})
</script>

<template>
  <main v-if="video" class="video-lesson">
    <AppContainer size="lg" padded>
      <div class="video-lesson__stage">
        <div class="video-lesson__player">
          <iframe
            :src="video.videoUrl"
            :title="video.title"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            @load="markAsComplete"
          />
        </div>
        <div v-if="videoWatched" class="video-lesson__status">
          <AppBadge tone="mint">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            Completed
          </AppBadge>
        </div>
      </div>

      <AppCard variant="plaque" tone="cream" shadow-tone="cobalt" pad="lg" class="video-lesson__card">
        <template #eyebrow>
          <span class="video-lesson__meta">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {{ video.duration }}
          </span>
        </template>
        <template #title>{{ video.title }}</template>
        <p class="video-lesson__description">{{ video.description }}</p>
        <template #footer>
          <div class="video-lesson__actions">
            <AppButton
              v-if="hasNextContent"
              variant="primary"
              @click="navigateToNext"
            >
              Continue to next lesson
              <template #trailing>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </template>
            </AppButton>
            <AppButton
              v-else
              variant="accent"
              @click="router.push(`/classes/${courseId}/final-exam`)"
            >
              Take final exam
            </AppButton>
          </div>
        </template>
      </AppCard>
    </AppContainer>
  </main>
</template>

<style scoped lang="scss">
.video-lesson {
  background: var(--c-cream);
  min-height: 100vh;
  padding-top: calc(80px + var(--s-6));
  padding-bottom: var(--s-9);

  &__stage {
    position: relative;
    margin-bottom: var(--s-6);
  }

  &__player {
    position: relative;
    padding-bottom: 56.25%;
    height: 0;
    overflow: hidden;
    border: 3px solid var(--c-ink);
    border-radius: var(--r-md);
    box-shadow: var(--shadow-block);
    background: var(--c-ink);

    iframe {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
    }
  }

  &__status {
    position: absolute;
    top: var(--s-3);
    right: var(--s-3);
  }

  &__meta {
    display: inline-flex;
    align-items: center;
    gap: var(--s-2);
    color: var(--c-text-muted);
    font-family: var(--font-body);
    font-size: var(--fs-sm);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: var(--ls-wide);

    svg { color: var(--c-cobalt); }
  }

  &__description {
    color: var(--c-text-muted);
    line-height: var(--lh-loose);
    font-size: var(--fs-md);
    margin: 0;
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--s-3);
  }
}
</style>
