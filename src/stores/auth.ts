import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export interface User {
  id: string
  name: string
  email: string
  subscribed: boolean
  completedCourses: string[]
  profilePicture?: string
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
    // Check subscription status on load
    checkSubscriptionStatus()
  }

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isSubscribed = computed(() => user.value?.subscribed ?? false)

  async function loginWithGoogle(googleToken: string) {
    try {
      const response = await fetch(`${API_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: googleToken })
      })

      if (!response.ok) {
        throw new Error('Google authentication failed')
      }

      const data = await response.json()
      
      token.value = data.access_token
      localStorage.setItem('authToken', data.access_token)

      // Fetch subscription status
      await checkSubscriptionStatus()
      
      // Update user data
      user.value = {
        ...data.user,
        subscribed: user.value?.subscribed ?? false
      }
      localStorage.setItem('user', JSON.stringify(user.value))

      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Authentication failed' }
    }
  }

  async function login(email: string, password: string) {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const data = await response.json()
      
      token.value = data.access_token
      localStorage.setItem('authToken', data.access_token)

      await checkSubscriptionStatus()

      user.value = {
        ...data.user,
        subscribed: user.value?.subscribed ?? false
      }
      localStorage.setItem('user', JSON.stringify(user.value))

      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Invalid credentials' }
    }
  }

  async function signup(email: string, password: string, name: string) {
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      })

      if (!response.ok) {
        throw new Error('Signup failed')
      }

      const data = await response.json()
      
      token.value = data.access_token
      user.value = {
        ...data.user,
        subscribed: false
      }

      localStorage.setItem('authToken', data.access_token)
      localStorage.setItem('user', JSON.stringify(user.value))

      return { success: true }
    } catch (error) {
      console.error('Signup error:', error)
      return { success: false, error: 'Signup failed' }
    }
  }

  async function checkSubscriptionStatus() {
    if (!token.value) return

    try {
      const response = await fetch(`${API_URL}/subscription`, {
        headers: {
          'Authorization': `Bearer ${token.value}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (user.value) {
          user.value.subscribed = data.subscribed
          localStorage.setItem('user', JSON.stringify(user.value))
        }
      }
    } catch (error) {
      console.error('Failed to check subscription status:', error)
    }
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
  }

  async function subscribe() {
    if (user.value) {
      user.value.subscribed = true
      localStorage.setItem('user', JSON.stringify(user.value))
    }
    await checkSubscriptionStatus()
  }

  async function unsubscribe() {
    if (!token.value) return

    try {
      const response = await fetch(`${API_URL}/subscription`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token.value}`
        }
      })

      if (response.ok && user.value) {
        user.value.subscribed = false
        localStorage.setItem('user', JSON.stringify(user.value))
      }
    } catch (error) {
      console.error('Unsubscribe error:', error)
    }
  }

  async function updateUserName(name: string) {
    if (!token.value) return

    try {
      const response = await fetch(`${API_URL}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token.value}`
        },
        body: JSON.stringify({ name })
      })

      if (response.ok && user.value) {
        user.value.name = name
        localStorage.setItem('user', JSON.stringify(user.value))
      }
    } catch (error) {
      console.error('Update name error:', error)
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
    login,
    signup,
    logout,
    subscribe,
    unsubscribe,
    updateUserName,
    markCourseCompleted,
    hasCourseCompleted,
    checkSubscriptionStatus
  }
})

