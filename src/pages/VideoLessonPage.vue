<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getCourseById, getChapterById, getContentById, isVideo, type Video } from '@/data/courses'
import { useProgressStore } from '@/stores/progress'

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

  // Check if already completed
  if (progressStore.isContentComplete(courseId.value, contentId.value)) {
    videoWatched.value = true
  }

  // Auto-mark as complete after 3 seconds (simulating watching)
  // In production, you'd track actual video playback
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

const hasNextContent = computed(() => {
  if (!course.value || !chapter.value) return false

  const currentChapterIndex = course.value.chapters.findIndex(c => c.id === chapterId.value)
  const currentContentIndex = chapter.value.content.findIndex(c => c.id === contentId.value)

  return currentContentIndex < chapter.value.content.length - 1 || 
         currentChapterIndex < course.value.chapters.length - 1
})
</script>

<template>
  <div v-if="video" class="video-lesson">
    <div class="video-container">
      <div class="video-wrapper">
        <iframe
          :src="video.videoUrl"
          :title="video.title"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          @load="markAsComplete"
        ></iframe>
      </div>

      <div class="video-info">
        <div class="completion-badge" v-if="videoWatched">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <span>Completed</span>
        </div>
      </div>
    </div>

    <div class="lesson-content">
      <div class="content-header">
        <h1>{{ video.title }}</h1>
        <div class="meta">
          <span class="duration">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            {{ video.duration }}
          </span>
        </div>
      </div>

      <div class="description">
        <p>{{ video.description }}</p>
      </div>

      <div class="navigation-buttons">
        <button 
          v-if="hasNextContent" 
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
          v-else
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
</template>

<style scoped lang="scss">
.video-lesson {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.video-container {
  margin-bottom: 2rem;
}

.video-wrapper {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  height: 0;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 4px 12px var(--shadow-medium);
  margin-bottom: 1rem;

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}

.video-info {
  display: flex;
  justify-content: flex-end;
}

.completion-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--success-color);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;

  svg {
    flex-shrink: 0;
  }
}

.lesson-content {
  background: var(--bg-light);
  border-radius: 12px;
  padding: 2rem;
}

.content-header {
  margin-bottom: 1.5rem;

  h1 {
    font-size: 2rem;
    color: var(--text-dark);
    margin-bottom: 0.75rem;
    font-family: 'Playfair Display', serif;
  }

  .meta {
    display: flex;
    gap: 1.5rem;

    .duration {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-light);
      font-size: 0.95rem;

      svg {
        color: var(--primary-color);
      }
    }
  }
}

.description {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid var(--border-light);

  p {
    color: var(--text-light);
    line-height: 1.8;
    font-size: 1.05rem;
  }
}

.navigation-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.next-button {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: var(--gradient);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px var(--shadow-medium);

    svg {
      transform: translateX(4px);
    }
  }

  svg {
    transition: transform 0.3s ease;
  }
}

@media (max-width: 768px) {
  .video-lesson {
    padding: 1rem;
  }

  .lesson-content {
    padding: 1.5rem;
  }

  .content-header h1 {
    font-size: 1.5rem;
  }

  .navigation-buttons {
    flex-direction: column;

    .next-button {
      width: 100%;
      justify-content: center;
    }
  }
}
</style>
