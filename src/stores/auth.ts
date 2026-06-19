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

export interface SubscriptionDetails {
  id: string
  status: 'pending' | 'active' | 'cancelled' | 'expired' | 'past_due'
  amount: number
  currency: string
  billingCycle: 'monthly' | 'yearly' | string
  startDate?: string
  nextBillingDate?: string | null
  lastPaymentDate?: string | null
  endDate?: string | null
  cardBrand?: string | null
  cardLast4?: string | null
  pendingCheckoutUrl?: string | null
}

export interface PaymentRecord {
  id: string
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  paidAt?: string | null
  receiptUrl?: string | null
  cardBrand?: string | null
  cardLast4?: string | null
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('authToken'))
  const user = ref<User | null>(null)
  const subscription = ref<SubscriptionDetails | null>(null)
  const payments = ref<PaymentRecord[]>([])

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
        subscription.value = data.subscription || null
        if (user.value) {
          user.value.subscribed = data.subscribed
          localStorage.setItem('user', JSON.stringify(user.value))
        }
      } else if (response.status === 401) {
        // Token is expired or invalid — clear the stale session
        logout()
      }
    } catch (error) {
      console.error('Failed to check subscription status:', error)
    }
  }

  function logout() {
    token.value = null
    user.value = null
    subscription.value = null
    payments.value = []
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

  async function startSubscriptionCheckout(plan: 'monthly' | 'yearly' = 'monthly') {
    if (!token.value) {
      return { success: false, error: 'You must be logged in to subscribe.' }
    }

    try {
      const response = await fetch(`${API_URL}/subscription/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.value}`,
        },
        body: JSON.stringify({ plan }),
      })

      if (response.status === 401) {
        logout()
        return { success: false, error: 'Your session expired. Please log in again.' }
      }

      const data = await response.json().catch(() => null)

      if (!response.ok || !data?.checkoutUrl) {
        return {
          success: false,
          error: data?.message || 'Could not start checkout. Please try again.',
        }
      }

      return {
        success: true,
        checkoutUrl: data.checkoutUrl as string,
        subscriptionId: data.subscriptionId as string,
      }
    } catch (error) {
      console.error('startSubscriptionCheckout error:', error)
      return { success: false, error: 'Could not start checkout. Please try again.' }
    }
  }

  async function verifySubscriptionCheckout(subscriptionId: string) {
    if (!token.value) return { success: false }
    try {
      const response = await fetch(
        `${API_URL}/subscription/verify?subscriptionId=${encodeURIComponent(subscriptionId)}`,
        {
          headers: { Authorization: `Bearer ${token.value}` },
        },
      )
      if (!response.ok) return { success: false }
      const data = await response.json()
      subscription.value = data.subscription || null
      if (user.value) {
        user.value.subscribed = !!data.subscribed
        localStorage.setItem('user', JSON.stringify(user.value))
      }
      return { success: true, subscribed: !!data.subscribed, subscription: data.subscription }
    } catch (error) {
      console.error('verifySubscriptionCheckout error:', error)
      return { success: false }
    }
  }

  async function loadPaymentHistory() {
    if (!token.value) return
    try {
      const response = await fetch(`${API_URL}/subscription/payments`, {
        headers: { Authorization: `Bearer ${token.value}` },
      })
      if (!response.ok) return
      const data = await response.json()
      payments.value = Array.isArray(data?.payments) ? data.payments : []
    } catch (error) {
      console.error('loadPaymentHistory error:', error)
    }
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

      if (response.ok) {
        // Refresh details — backend keeps access until period end, so the
        // user may still be `subscribed` after cancelling.
        await checkSubscriptionStatus()
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
    subscription,
    payments,
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
    checkSubscriptionStatus,
    startSubscriptionCheckout,
    verifySubscriptionCheckout,
    loadPaymentHistory,
  }
})

