<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const isLoggingIn = ref(false)
const error = ref('')

const mode = ref<'login' | 'signup'>('login')
const email = ref('')
const password = ref('')
const name = ref('')
const isSubmitting = ref(false)

async function handleEmailSubmit() {
  error.value = ''
  if (!email.value || !password.value || (mode.value === 'signup' && !name.value)) {
    error.value = 'Please fill in all fields.'
    return
  }
  if (password.value.length < 8) {
    error.value = 'Password must be at least 8 characters.'
    return
  }
  isSubmitting.value = true
  const result = mode.value === 'login'
    ? await authStore.login(email.value, password.value)
    : await authStore.signup(email.value, password.value, name.value)
  isSubmitting.value = false
  if (result.success) {
    const redirect = route.query.redirect as string || '/account'
    router.push(redirect)
  } else {
    error.value = result.error || 'Authentication failed.'
  }
}

function toggleMode() {
  mode.value = mode.value === 'login' ? 'signup' : 'login'
  error.value = ''
}

onMounted(() => {
  // Load Google Sign-In SDK
  const script = document.createElement('script')
  script.src = 'https://accounts.google.com/gsi/client'
  script.async = true
  script.defer = true
  document.head.appendChild(script)
})

async function handleGoogleLogin() {
  isLoggingIn.value = true
  error.value = ''

  // Initialize Google Sign-In
  const google = (window as any).google
  if (!google) {
    error.value = 'Google Sign-In not loaded. Please refresh the page.'
    isLoggingIn.value = false
    return
  }

  try {
    // Use the credential flow to get an ID token
    google.accounts.id.initialize({
      client_id: '644476907638-dn549s61bk17abp32bdtbf8gh3094uqj.apps.googleusercontent.com',
      callback: async (response: any) => {
        if (response.credential) {
          // response.credential is the ID token
          const result = await authStore.loginWithGoogle(response.credential)
          
          if (result.success) {
            // Redirect to the page they were trying to access or account page
            const redirect = route.query.redirect as string || '/account'
            router.push(redirect)
          } else {
            error.value = result.error || 'Google authentication failed'
          }
        } else {
          error.value = 'Google authentication was cancelled or failed'
        }
        isLoggingIn.value = false
      },
    })

    // Prompt the user to sign in
    google.accounts.id.prompt()
  } catch (e: any) {
    error.value = 'Google Sign-In failed. Please try again.'
    isLoggingIn.value = false
  }
}
</script>

<template>
  <main class="login-page">
    <div class="login-container">
      <div class="login-content">
        <div class="login-header">
          <h1>{{ mode === 'login' ? 'Welcome Back' : 'Create Your Account' }}</h1>
          <p>{{ mode === 'login' ? 'Sign in to continue your learning journey' : 'Sign up to start your learning journey' }}</p>
        </div>

        <div class="login-form">
          <button 
            class="google-login-button"
            @click="handleGoogleLogin"
            :disabled="isLoggingIn"
          >
            <svg v-if="!isLoggingIn" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <div v-else class="spinner"></div>
            <span>{{ isLoggingIn ? 'Signing in...' : 'Continue with Google' }}</span>
          </button>

          <div class="divider">
            <span>or {{ mode === 'login' ? 'sign in with email' : 'sign up with email' }}</span>
          </div>

          <form class="email-form" @submit.prevent="handleEmailSubmit">
            <div v-if="mode === 'signup'" class="form-field">
              <label for="name">Name</label>
              <input
                id="name"
                v-model="name"
                type="text"
                autocomplete="name"
                placeholder="Your name"
                :disabled="isSubmitting"
              />
            </div>
            <div class="form-field">
              <label for="email">Email</label>
              <input
                id="email"
                v-model="email"
                type="email"
                autocomplete="email"
                placeholder="you@example.com"
                :disabled="isSubmitting"
              />
            </div>
            <div class="form-field">
              <label for="password">Password</label>
              <input
                id="password"
                v-model="password"
                type="password"
                :autocomplete="mode === 'login' ? 'current-password' : 'new-password'"
                placeholder="At least 8 characters"
                :disabled="isSubmitting"
              />
            </div>
            <button type="submit" class="submit-button" :disabled="isSubmitting">
              <div v-if="isSubmitting" class="spinner spinner-light"></div>
              <span>{{ isSubmitting ? 'Please wait...' : (mode === 'login' ? 'Sign In' : 'Create Account') }}</span>
            </button>
          </form>

          <p class="mode-toggle">
            {{ mode === 'login' ? "Don't have an account?" : 'Already have an account?' }}
            <button type="button" class="link-button" @click="toggleMode">
              {{ mode === 'login' ? 'Sign up' : 'Sign in' }}
            </button>
          </p>

          <div class="info-box" v-if="error">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            <p>{{ error }}</p>
          </div>
          
          <div class="info-box" v-else>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <p>Sign in with Google or your email to access all courses and track your progress.</p>
          </div>
        </div>

        <div class="login-benefits">
          <h3>What you get with an account:</h3>
          <ul>
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Track your progress across all courses</span>
            </li>
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Earn certificates of completion</span>
            </li>
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Access courses from any device</span>
            </li>
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Save your quiz scores and achievements</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="login-visual">
        <div class="visual-content">
          <span class="visual-badge">Just getting started</span>
          <h2>Be among our first learners</h2>
          <p>Getting There is a brand-new platform built around positive psychology and practical wellness practices. Create an account today and help shape what we build next.</p>

          <ul class="visual-points">
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Founder-led courses rooted in current research</span>
            </li>
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>New lessons added as we grow &mdash; your feedback guides us</span>
            </li>
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>A small, personal community &mdash; not a faceless platform</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss">
.login-page {
  min-height: 100vh;
  padding-top: 80px;
  background: var(--bg-light);
}

.login-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: calc(100vh - 80px);
}

.login-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 3rem;
  background: white;
  max-width: 500px;
  margin: 0 auto;
  width: 100%;
}

.login-header {
  text-align: center;
  margin-bottom: 3rem;

  h1 {
    font-size: 2.5rem;
    color: var(--text-dark);
    margin-bottom: 0.75rem;
    font-family: 'Playfair Display', serif;
  }

  p {
    color: var(--text-light);
    font-size: 1.05rem;
  }
}

.login-form {
  margin-bottom: 3rem;
}

.google-login-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border: 2px solid var(--border-light);
  border-radius: 8px;
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--text-dark);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    border-color: var(--primary-color);
    box-shadow: 0 4px 12px var(--shadow-light);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  svg {
    flex-shrink: 0;
  }
}

.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid var(--border-light);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.divider {
  display: flex;
  align-items: center;
  margin: 2rem 0;
  color: var(--text-lighter);
  font-size: 0.9rem;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border-light);
  }

  span {
    padding: 0 1rem;
  }
}

.info-box {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-sage);
  border-radius: 8px;
  border-left: 4px solid var(--primary-color);

  svg {
    flex-shrink: 0;
    color: var(--primary-color);
    margin-top: 0.1rem;
  }

  p {
    color: var(--text-light);
    font-size: 0.9rem;
    line-height: 1.6;
    margin: 0;
  }
}

.login-benefits {
  h3 {
    font-size: 1.25rem;
    color: var(--text-dark);
    margin-bottom: 1.5rem;
    font-family: 'Playfair Display', serif;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      margin-bottom: 1rem;
      color: var(--text-light);

      svg {
        flex-shrink: 0;
        color: var(--success-color);
        margin-top: 0.1rem;
      }

      span {
        line-height: 1.6;
      }
    }
  }
}

.login-visual {
  background: var(--gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: white;
}

.visual-content {
  max-width: 500px;

  h2 {
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
    font-family: 'Playfair Display', serif;
    line-height: 1.2;
  }

  p {
    font-size: 1.15rem;
    line-height: 1.6;
    opacity: 0.95;
    margin-bottom: 3rem;
  }
}

.visual-badge {
  display: inline-block;
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  margin-bottom: 1.25rem;
}

.visual-points {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  li {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    font-size: 1.02rem;
    line-height: 1.5;
    opacity: 0.95;

    svg {
      flex-shrink: 0;
      margin-top: 0.2rem;
    }
  }
}

.email-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 0.5rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  label {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--text-dark);
  }

  input {
    padding: 0.85rem 1rem;
    border: 2px solid var(--border-light);
    border-radius: 8px;
    font-size: 1rem;
    color: var(--text-dark);
    background: white;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;

    &:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px var(--shadow-light);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
}

.submit-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  background: var(--primary-color);
  color: white;
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;

  &:hover:not(:disabled) {
    background: var(--secondary-color);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
}

.spinner-light {
  border-color: rgba(255, 255, 255, 0.4);
  border-top-color: white;
  width: 18px;
  height: 18px;
  border-width: 2px;
}

.mode-toggle {
  margin: 1.25rem 0 0;
  text-align: center;
  color: var(--text-light);
  font-size: 0.95rem;
}

.link-button {
  background: none;
  border: none;
  padding: 0;
  margin-left: 0.25rem;
  color: var(--primary-color);
  font-weight: 600;
  cursor: pointer;
  font-size: inherit;

  &:hover {
    text-decoration: underline;
  }
}

@media (max-width: 968px) {
  .login-container {
    grid-template-columns: 1fr;
  }

  .login-visual {
    display: none;
  }

  .login-content {
    padding: 2rem;
    max-width: none;
  }
}

@media (max-width: 640px) {
  .login-header h1 {
    font-size: 2rem;
  }
}
</style>
