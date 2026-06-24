<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  AppButton,
  AppCard,
  AppContainer,
  AppEyebrow,
  AppField,
  AppHero,
  AppInput,
  AppSection,
} from '@/components/ui'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const isLoggingIn = ref(false)
const error = ref('')

// Must match the backend's GOOGLE_CLIENT_ID, otherwise Google rejects the
// ID token with "payload audience != requiredAudience".
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

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
  const result =
    mode.value === 'login'
      ? await authStore.login(email.value, password.value)
      : await authStore.signup(email.value, password.value, name.value)
  isSubmitting.value = false
  if (result.success) {
    const redirect = (route.query.redirect as string) || '/account'
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
  const script = document.createElement('script')
  script.src = 'https://accounts.google.com/gsi/client'
  script.async = true
  script.defer = true
  document.head.appendChild(script)
})

async function handleGoogleLogin() {
  isLoggingIn.value = true
  error.value = ''

  const google = (window as any).google
  if (!google) {
    error.value = 'Google Sign-In not loaded. Please refresh the page.'
    isLoggingIn.value = false
    return
  }

  if (!GOOGLE_CLIENT_ID) {
    error.value = 'Google Sign-In is not configured. Please contact support.'
    isLoggingIn.value = false
    return
  }

  try {
    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: async (response: any) => {
        if (response.credential) {
          const result = await authStore.loginWithGoogle(response.credential)
          if (result.success) {
            const redirect = (route.query.redirect as string) || '/account'
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

    google.accounts.id.prompt()
  } catch {
    error.value = 'Google Sign-In failed. Please try again.'
    isLoggingIn.value = false
  }
}

const benefits = [
  'Track your progress across all courses',
  'Earn certificates of completion',
  'Access courses from any device',
  'Save your quiz scores and achievements',
]
</script>

<template>
  <main class="login-page">
    <AppHero variant="compact" tone="cream" align="center">
      <template #eyebrow>
        <AppEyebrow tone="cobalt">{{ mode === 'login' ? 'Welcome back' : 'Create account' }}</AppEyebrow>
      </template>
      <template #title>
        <template v-if="mode === 'login'">Welcome back</template>
        <template v-else>Create your account</template>
      </template>
      <template #lede>
        <template v-if="mode === 'login'">Sign in to continue your learning journey.</template>
        <template v-else>Sign up to start your learning journey.</template>
      </template>
    </AppHero>

    <AppSection tone="cream-2" pad="xl">
      <AppContainer size="lg">
        <div class="login-page__grid">
          <AppCard variant="plaque" tone="paper" shadow-tone="cobalt" pad="lg" class="login-page__form-card">
            <AppButton
              variant="ink"
              block
              :loading="isLoggingIn"
              :disabled="isLoggingIn"
              @click="handleGoogleLogin"
            >
              <template #leading>
                <svg v-if="!isLoggingIn" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </template>
              {{ isLoggingIn ? 'Signing in…' : 'Continue with Google' }}
            </AppButton>

            <div class="login-page__divider">
              <span>or {{ mode === 'login' ? 'sign in with email' : 'sign up with email' }}</span>
            </div>

            <form class="login-page__form" @submit.prevent="handleEmailSubmit">
              <AppField v-if="mode === 'signup'" label="Name">
                <template #default="{ id }">
                  <AppInput
                    :id="id"
                    v-model="name"
                    type="text"
                    autocomplete="name"
                    placeholder="Your name"
                    :disabled="isSubmitting"
                  />
                </template>
              </AppField>

              <AppField label="Email">
                <template #default="{ id }">
                  <AppInput
                    :id="id"
                    v-model="email"
                    type="email"
                    autocomplete="email"
                    placeholder="you@example.com"
                    :disabled="isSubmitting"
                  />
                </template>
              </AppField>

              <AppField label="Password" hint="At least 8 characters">
                <template #default="{ id }">
                  <AppInput
                    :id="id"
                    v-model="password"
                    type="password"
                    :autocomplete="mode === 'login' ? 'current-password' : 'new-password'"
                    placeholder="••••••••"
                    :disabled="isSubmitting"
                  />
                </template>
              </AppField>

              <AppButton
                type="submit"
                variant="primary"
                block
                :loading="isSubmitting"
                :disabled="isSubmitting"
              >
                {{ mode === 'login' ? 'Sign in' : 'Create account' }}
              </AppButton>
            </form>

            <p v-if="error" class="login-page__error" role="alert">{{ error }}</p>

            <p class="login-page__toggle">
              {{ mode === 'login' ? "Don't have an account?" : 'Already have an account?' }}
              <button type="button" class="login-page__link" @click="toggleMode">
                {{ mode === 'login' ? 'Sign up' : 'Sign in' }}
              </button>
            </p>
          </AppCard>

          <aside class="login-page__aside">
            <AppCard variant="postcard" tone="marigold" shadow-tone="ink" pad="lg">
              <template #eyebrow>
                <AppEyebrow tone="ink">Just getting started</AppEyebrow>
              </template>
              <template #title>Be among our first learners</template>
              <p class="login-page__aside-lede">
                Getting There is a brand-new platform built around positive psychology and practical wellness
                practices. Create an account today and help shape what we build next.
              </p>

              <ul class="login-page__perks">
                <li v-for="b in benefits" :key="b">
                  <span class="login-page__check" aria-hidden="true">✓</span>
                  {{ b }}
                </li>
              </ul>
            </AppCard>
          </aside>
        </div>
      </AppContainer>
    </AppSection>
  </main>
</template>

<style scoped lang="scss">
.login-page {
  &__grid {
    display: grid;
    gap: var(--s-6);
    grid-template-columns: minmax(0, 1fr);
    align-items: start;

    @media (min-width: 900px) {
      grid-template-columns: minmax(0, 1fr) minmax(0, 0.85fr);
      gap: var(--s-7);
    }
  }

  &__divider {
    display: flex;
    align-items: center;
    gap: var(--s-3);
    margin: var(--s-5) 0;
    text-align: center;
    color: var(--c-text-subtle);
    font-family: var(--font-body);
    font-size: var(--fs-xs);
    text-transform: uppercase;
    letter-spacing: var(--ls-wider);

    &::before,
    &::after {
      content: '';
      flex: 1;
      border-top: 2px dashed var(--c-ink-soft);
    }
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: var(--s-4);
  }

  &__error {
    margin: var(--s-4) 0 0;
    padding: var(--s-3) var(--s-4);
    background: var(--c-fuchsia-soft);
    border: 2px solid var(--c-fuchsia);
    border-radius: var(--r-md);
    color: var(--c-fuchsia-deep);
    font-weight: 600;
    font-size: var(--fs-sm);
  }

  &__toggle {
    margin: var(--s-5) 0 0;
    text-align: center;
    color: var(--c-text-muted);
    font-size: var(--fs-sm);
  }

  &__link {
    background: none;
    border: none;
    padding: 0;
    color: var(--c-cobalt);
    font-weight: 700;
    cursor: pointer;
    text-decoration: underline;
    text-underline-offset: 3px;

    &:hover { color: var(--c-cobalt-deep); }
  }

  &__aside-lede {
    margin: 0;
    color: var(--c-ink);
    line-height: var(--lh-base);
  }

  &__perks {
    list-style: none;
    padding: 0;
    margin: var(--s-4) 0 0;
    display: grid;
    gap: var(--s-3);

    li {
      display: flex;
      align-items: flex-start;
      gap: var(--s-3);
      color: var(--c-ink);
      font-weight: 600;
    }
  }

  &__check {
    display: inline-grid;
    place-items: center;
    width: 28px;
    height: 28px;
    border-radius: 999px;
    background: var(--c-ink);
    color: var(--c-marigold);
    font-weight: 800;
    flex-shrink: 0;
  }
}
</style>
