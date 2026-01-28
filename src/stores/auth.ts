import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface User {
  id: string
  name: string
  email: string
  subscribed: boolean
  completedCourses: string[]
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('authToken'))
  const user = ref<User | null>(null)

  // Load user from localStorage if token exists
  if (token.value) {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      user.value = JSON.parse(savedUser)
    }
  }

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isSubscribed = computed(() => user.value?.subscribed ?? false)

  async function loginWithGoogle() {
    // Mock Google OAuth login
    // In production, this would handle real Google OAuth flow
    const mockUser: User = {
      id: 'user-' + Date.now(),
      name: 'Demo User',
      email: 'demo@example.com',
      subscribed: false,
      completedCourses: []
    }

    const mockToken = 'mock-token-' + Date.now()

    token.value = mockToken
    user.value = mockUser

    localStorage.setItem('authToken', mockToken)
    localStorage.setItem('user', JSON.stringify(mockUser))

    return { success: true }
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
  }

  function subscribe() {
    if (user.value) {
      user.value.subscribed = true
      localStorage.setItem('user', JSON.stringify(user.value))
    }
  }

  function unsubscribe() {
    if (user.value) {
      user.value.subscribed = false
      localStorage.setItem('user', JSON.stringify(user.value))
    }
  }

  function updateUserName(name: string) {
    if (user.value) {
      user.value.name = name
      localStorage.setItem('user', JSON.stringify(user.value))
    }
  }

  function markCourseCompleted(courseId: string) {
    if (user.value && !user.value.completedCourses.includes(courseId)) {
      user.value.completedCourses.push(courseId)
      localStorage.setItem('user', JSON.stringify(user.value))
    }
  }

  function hasCourseCompleted(courseId: string): boolean {
    return user.value?.completedCourses.includes(courseId) ?? false
  }

  return {
    token,
    user,
    isAuthenticated,
    isSubscribed,
    loginWithGoogle,
    logout,
    subscribe,
    unsubscribe,
    updateUserName,
    markCourseCompleted,
    hasCourseCompleted
  }
})
