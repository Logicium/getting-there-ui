<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getCourseById, type Course, type Chapter, type Video, type Quiz } from '@/data/courses'
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

  // Initialize progress if first time
  const firstChapter = course.value.chapters[0]
  const firstContent = firstChapter.content[0]
  progressStore.initializeCourseProgress(courseId.value, firstChapter.id, firstContent.id)

  // Only navigate if we're not already on a content page (chapterId and contentId not in route)
  const currentChapterId = route.params.chapterId
  const currentContentId = route.params.contentId
  
  if (!currentChapterId || !currentContentId) {
    // Navigate to current or first content only if not already on a content page
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
  return course.value.chapters.reduce((sum, chapter) => sum + chapter.content.length, 0) + 1 // +1 for final exam
})

const progressPercentage = computed(() => {
  return progressStore.getProgressPercentage(courseId.value, totalItems.value)
})
</script>

<template>
  <div v-if="course" class="progress-page">
    <div class="mobile-header">
      <button class="sidebar-toggle" @click="toggleSidebar">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
        <span>Course Content</span>
      </button>
      <div class="mobile-progress">
        <span>{{ progressPercentage }}% Complete</span>
      </div>
    </div>

    <aside :class="['course-sidebar', { open: sidebarOpen }]">
      <div class="sidebar-header">
        <router-link :to="`/classes/${courseId}`" class="back-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>Back to Course</span>
        </router-link>
        
        <h2>{{ course.title }}</h2>
        
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: `${progressPercentage}%` }"></div>
        </div>
        <p class="progress-text">{{ progressPercentage }}% Complete</p>
      </div>

      <div class="sidebar-content">
        <div v-for="(chapter, chapterIndex) in course.chapters" :key="chapter.id" class="chapter-section">
          <div class="chapter-title">
            <span class="chapter-number">Chapter {{ chapterIndex + 1 }}</span>
            <h3>{{ chapter.title }}</h3>
          </div>

          <ul class="content-list">
            <li 
              v-for="(item, itemIndex) in chapter.content" 
              :key="item.id"
              :class="['content-item', { completed: isContentComplete(item.id) }]"
              @click="navigateToContent(chapter.id, item.id)"
            >
              <div class="content-icon">
                <svg v-if="isContentComplete(item.id)" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <svg v-else-if="'videoUrl' in item" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 11l3 3L22 4"></path>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                </svg>
              </div>
              <div class="content-info">
                <span class="content-title">{{ item.title }}</span>
                <span v-if="'duration' in item" class="content-duration">{{ item.duration }}</span>
              </div>
            </li>
          </ul>
        </div>

        <div class="chapter-section">
          <div class="chapter-title">
            <h3>Final Exam</h3>
          </div>
          <ul class="content-list">
            <li 
              :class="['content-item', { completed: progressStore.hasCompletedCourse(courseId) }]"
              @click="navigateToFinalExam"
            >
              <div class="content-icon">
                <svg v-if="progressStore.hasCompletedCourse(courseId)" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <div class="content-info">
                <span class="content-title">{{ course.finalExam.title }}</span>
                <span class="content-duration">{{ course.finalExam.questions.length }} questions</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </aside>

    <main class="content-area">
      <RouterView />
    </main>
  </div>
</template>

<style scoped lang="scss">
.progress-page {
  display: flex;
  min-height: 100vh;
  padding-top: 80px;
}

.mobile-header {
  display: none;
  position: fixed;
  top: 80px;
  left: 0;
  right: 0;
  background: white;
  border-bottom: 1px solid var(--border-light);
  padding: 1rem;
  z-index: 100;
  justify-content: space-between;
  align-items: center;

  .sidebar-toggle {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: none;
    border: none;
    color: var(--primary-color);
    font-weight: 600;
    cursor: pointer;
    font-size: 1rem;
  }

  .mobile-progress {
    font-size: 0.9rem;
    color: var(--text-light);
    font-weight: 600;
  }
}

.course-sidebar {
  width: 360px;
  background: var(--bg-light);
  border-right: 1px solid var(--border-light);
  height: calc(100vh - 80px);
  overflow-y: auto;
  position: sticky;
  top: 80px;
  flex-shrink: 0;
}

.sidebar-header {
  padding: 2rem;
  background: white;
  border-bottom: 2px solid var(--border-light);

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--primary-color);
    text-decoration: none;
    font-weight: 600;
    margin-bottom: 1.5rem;
    transition: all 0.2s ease;

    &:hover {
      gap: 0.75rem;
    }
  }

  h2 {
    font-size: 1.5rem;
    color: var(--text-dark);
    margin-bottom: 1.5rem;
    font-family: 'Playfair Display', serif;
  }

  .progress-bar {
    width: 100%;
    height: 8px;
    background: var(--bg-secondary);
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 0.5rem;

    .progress-fill {
      height: 100%;
      background: var(--gradient);
      transition: width 0.3s ease;
    }
  }

  .progress-text {
    font-size: 0.9rem;
    color: var(--text-light);
    font-weight: 600;
  }
}

.sidebar-content {
  padding: 1rem 0;
}

.chapter-section {
  margin-bottom: 1.5rem;

  .chapter-title {
    padding: 1rem 2rem 0.75rem;

    .chapter-number {
      display: block;
      font-size: 0.75rem;
      color: var(--text-lighter);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 0.25rem;
    }

    h3 {
      font-size: 1.1rem;
      color: var(--text-dark);
      font-weight: 700;
    }
  }
}

.content-list {
  list-style: none;
  padding: 0;
  margin: 0;

  .content-item {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 0.875rem 2rem;
    cursor: pointer;
    transition: all 0.2s ease;
    border-left: 3px solid transparent;

    &:hover {
      background: rgba(74, 124, 89, 0.05);
      border-left-color: var(--primary-color);
    }

    &.completed {
      .content-icon svg {
        color: var(--success-color);
      }

      .content-title {
        color: var(--text-light);
      }
    }

    .content-icon {
      flex-shrink: 0;
      margin-top: 0.1rem;

      svg {
        color: var(--text-lighter);
      }
    }

    .content-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;

      .content-title {
        color: var(--text-dark);
        font-weight: 500;
        font-size: 0.95rem;
      }

      .content-duration {
        color: var(--text-lighter);
        font-size: 0.85rem;
      }
    }
  }
}

.content-area {
  flex: 1;
  background: white;
  overflow-y: auto;
}

@media (max-width: 968px) {
  .mobile-header {
    display: flex;
  }

  .progress-page {
    padding-top: 140px;
  }

  .course-sidebar {
    position: fixed;
    top: 140px;
    left: -100%;
    width: 100%;
    max-width: 360px;
    z-index: 99;
    transition: left 0.3s ease;
    height: calc(100vh - 140px);

    &.open {
      left: 0;
      box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
    }
  }

  .content-area {
    width: 100%;
  }
}
</style>
