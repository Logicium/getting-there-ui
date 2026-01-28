import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface CourseProgress {
  courseId: string
  completedItems: string[] // IDs of completed videos and quizzes
  currentChapterId: string
  currentContentId: string
  quizScores: Record<string, number> // quizId -> score
  finalExamScore?: number
  finalExamPassed?: boolean
  completedAt?: string
}

export const useProgressStore = defineStore('progress', () => {
  const progress = ref<Record<string, CourseProgress>>({})

  // Load progress from localStorage
  const savedProgress = localStorage.getItem('courseProgress')
  if (savedProgress) {
    progress.value = JSON.parse(savedProgress)
  }

  function saveProgress() {
    localStorage.setItem('courseProgress', JSON.stringify(progress.value))
  }

  function initializeCourseProgress(courseId: string, firstChapterId: string, firstContentId: string) {
    if (!progress.value[courseId]) {
      progress.value[courseId] = {
        courseId,
        completedItems: [],
        currentChapterId: firstChapterId,
        currentContentId: firstContentId,
        quizScores: {}
      }
      saveProgress()
    }
  }

  function getCourseProgress(courseId: string): CourseProgress | undefined {
    return progress.value[courseId]
  }

  function markContentComplete(courseId: string, contentId: string) {
    const courseProgress = progress.value[courseId]
    if (courseProgress && !courseProgress.completedItems.includes(contentId)) {
      courseProgress.completedItems.push(contentId)
      saveProgress()
    }
  }

  function isContentComplete(courseId: string, contentId: string): boolean {
    const courseProgress = progress.value[courseId]
    return courseProgress?.completedItems.includes(contentId) ?? false
  }

  function updateCurrentContent(courseId: string, chapterId: string, contentId: string) {
    const courseProgress = progress.value[courseId]
    if (courseProgress) {
      courseProgress.currentChapterId = chapterId
      courseProgress.currentContentId = contentId
      saveProgress()
    }
  }

  function saveQuizScore(courseId: string, quizId: string, score: number) {
    const courseProgress = progress.value[courseId]
    if (courseProgress) {
      courseProgress.quizScores[quizId] = score
      saveProgress()
    }
  }

  function saveFinalExamScore(courseId: string, score: number, passed: boolean) {
    const courseProgress = progress.value[courseId]
    if (courseProgress) {
      courseProgress.finalExamScore = score
      courseProgress.finalExamPassed = passed
      if (passed) {
        courseProgress.completedAt = new Date().toISOString()
      }
      saveProgress()
    }
  }

  function hasCompletedCourse(courseId: string): boolean {
    return progress.value[courseId]?.finalExamPassed ?? false
  }

  function getProgressPercentage(courseId: string, totalItems: number): number {
    const courseProgress = progress.value[courseId]
    if (!courseProgress) return 0
    return Math.round((courseProgress.completedItems.length / totalItems) * 100)
  }

  return {
    progress,
    initializeCourseProgress,
    getCourseProgress,
    markContentComplete,
    isContentComplete,
    updateCurrentContent,
    saveQuizScore,
    saveFinalExamScore,
    hasCompletedCourse,
    getProgressPercentage
  }
})
