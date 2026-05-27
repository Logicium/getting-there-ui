<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import NewsletterSignup from '@/components/NewsletterSignup.vue'

const authStore = useAuthStore()
const router = useRouter()

const mode = ref<'signup' | 'login'>('signup')
const name = ref('')
const email = ref('')
const password = ref('')
const submitting = ref(false)
const error = ref('')
const claimed = ref(false)

const PROMO_CODE = 'LAUNCH-FREE-MONTH'

async function claimFreeMonth() {
  error.value = ''
  if (!email.value || !password.value || (mode.value === 'signup' && !name.value)) {
    error.value = 'Please fill in all fields.'
    return
  }
  if (password.value.length < 8) {
    error.value = 'Password must be at least 8 characters.'
    return
  }
  submitting.value = true
  const result = mode.value === 'signup'
    ? await authStore.signup(email.value, password.value, name.value)
    : await authStore.login(email.value, password.value)
  submitting.value = false

  if (!result.success) {
    error.value = result.error || 'Something went wrong. Please try again.'
    return
  }

  // Record the promo locally so the account page can surface it; the actual
  // entitlement will be granted server-side once the courses launch.
  localStorage.setItem('pendingPromo', PROMO_CODE)
  claimed.value = true
}

function toggleMode() {
  mode.value = mode.value === 'signup' ? 'login' : 'signup'
  error.value = ''
}

const goToAccount = () => router.push('/account')

const heading = computed(() =>
  mode.value === 'signup' ? 'Claim your free month' : 'Sign in to claim'
)
</script>

<template>
  <main class="coming-soon-page">
    <!-- Hero -->
    <section class="hero">
      <div class="container">
        <span class="badge">Coming soon</span>
        <h1>Online Classes Are Almost Here</h1>
        <p class="lede">
          We're putting the finishing touches on our first round of expert-led
          courses in positive psychology and evidence-based practices. Sign up
          now and your first month of premium access is on us.
        </p>

        <div class="offer-banner">
          <div class="offer-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" stroke-width="2"
                 stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 15 8.5 22 9.3 17 14.1 18.2 21 12 17.8 5.8 21 7 14.1 2 9.3 9 8.5 12 2"/>
            </svg>
          </div>
          <div class="offer-copy">
            <strong>One free month of Premium</strong>
            <span>for everyone who signs up before launch.</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Claim / Signup -->
    <section class="claim-section">
      <div class="container claim-container">
        <div class="claim-card">
          <div v-if="!claimed">
            <h2>{{ heading }}</h2>
            <p class="claim-sub">
              Create your free account today and we'll automatically apply your
              free month of Premium access the moment courses go live.
            </p>

            <form class="claim-form" @submit.prevent="claimFreeMonth">
              <div v-if="mode === 'signup'" class="field">
                <label for="claim-name">Name</label>
                <input
                  id="claim-name"
                  v-model="name"
                  type="text"
                  autocomplete="name"
                  placeholder="Your name"
                  :disabled="submitting"
                />
              </div>

              <div class="field">
                <label for="claim-email">Email</label>
                <input
                  id="claim-email"
                  v-model="email"
                  type="email"
                  autocomplete="email"
                  placeholder="you@example.com"
                  :disabled="submitting"
                />
              </div>

              <div class="field">
                <label for="claim-password">Password</label>
                <input
                  id="claim-password"
                  v-model="password"
                  type="password"
                  :autocomplete="mode === 'signup' ? 'new-password' : 'current-password'"
                  placeholder="At least 8 characters"
                  :disabled="submitting"
                />
              </div>

              <p v-if="error" class="form-error">{{ error }}</p>

              <button type="submit" class="claim-button" :disabled="submitting">
                {{ submitting ? 'Working on it...' : (mode === 'signup' ? 'Claim my free month' : 'Sign in & claim') }}
              </button>
            </form>

            <p class="mode-toggle">
              {{ mode === 'signup' ? 'Already have an account?' : "Don't have an account?" }}
              <button type="button" class="link-button" @click="toggleMode">
                {{ mode === 'signup' ? 'Sign in' : 'Sign up' }}
              </button>
            </p>
          </div>

          <div v-else class="claim-success">
            <div class="success-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
                   fill="none" stroke="currentColor" stroke-width="2"
                   stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h2>You're in!</h2>
            <p>
              Your free month of Premium is reserved. We'll email you as soon
              as classes are ready &mdash; your benefit will be waiting in your
              account.
            </p>
            <button class="claim-button" @click="goToAccount">Go to my account</button>
          </div>
        </div>

        <aside class="benefits">
          <h2>What Premium includes</h2>
          <ul class="benefit-list">
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                   fill="none" stroke="currentColor" stroke-width="2"
                   stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span>Full access to every course as we release them</span>
            </li>
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                   fill="none" stroke="currentColor" stroke-width="2"
                   stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span>Progress tracking across courses, devices, and sessions</span>
            </li>
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                   fill="none" stroke="currentColor" stroke-width="2"
                   stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span>Certificates of completion for finished courses</span>
            </li>
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                   fill="none" stroke="currentColor" stroke-width="2"
                   stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span>Premium-only videos and downloadable worksheets</span>
            </li>
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                   fill="none" stroke="currentColor" stroke-width="2"
                   stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span>Cancel any time &mdash; no card required to claim your free month</span>
            </li>
          </ul>
        </aside>
      </div>
    </section>

    <!-- Roadmap -->
    <section class="roadmap-section">
      <div class="container">
        <h2 class="section-title">What's coming</h2>
        <div class="roadmap-grid">
          <div class="roadmap-card">
            <span class="roadmap-tag">Course 01</span>
            <h3>Foundations of Positive Psychology</h3>
            <p>An accessible introduction to the science of wellbeing and the habits that move the needle.</p>
          </div>
          <div class="roadmap-card">
            <span class="roadmap-tag">Course 02</span>
            <h3>Mindfulness in Daily Life</h3>
            <p>Short, practical exercises to bring more presence and steadiness into the everyday.</p>
          </div>
          <div class="roadmap-card">
            <span class="roadmap-tag">Course 03</span>
            <h3>Designing Meaningful Routines</h3>
            <p>Build a personal rhythm that supports your energy, relationships, and goals.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Newsletter / meantime -->
    <section class="meantime-section">
      <div class="container meantime-container">
        <div class="meantime-copy">
          <h2>While you wait</h2>
          <p>
            Get a weekly note from us with a small practice, a short read, and
            a glimpse of what's coming next. It's the easiest way to stay close.
          </p>
          <div class="meantime-links">
            <RouterLink to="/videos" class="meantime-link">Watch our videos</RouterLink>
            <RouterLink to="/blog" class="meantime-link">Read the blog</RouterLink>
            <RouterLink to="/events" class="meantime-link">Browse workshops</RouterLink>
          </div>
        </div>
        <div class="meantime-newsletter">
          <NewsletterSignup
            variant="card"
            source="classes-coming-soon"
            title="Get the newsletter"
            description="One thoughtful email per week. We'll let you know the moment classes launch."
            button-text="Subscribe"
          />
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped lang="scss">
.coming-soon-page {
  min-height: 100vh;
  padding-top: 80px;
  background: var(--bg-light);
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Hero */
.hero {
  background: var(--gradient);
  color: white;
  padding: 5rem 0 4rem;
  text-align: center;
}

.badge {
  display: inline-block;
  padding: 0.4rem 1rem;
  background: rgba(255, 255, 255, 0.18);
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-bottom: 1.5rem;
}

h1 {
  font-family: 'Playfair Display', serif;
  font-size: 3rem;
  font-weight: 700;
  margin: 0 0 1.25rem;
  line-height: 1.15;
}

.lede {
  font-size: 1.15rem;
  line-height: 1.6;
  opacity: 0.95;
  margin: 0 auto 2rem;
  max-width: 640px;
}

.offer-banner {
  display: inline-flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.85rem 1.25rem;
  background: rgba(255, 255, 255, 0.18);
  border-radius: 14px;
  text-align: left;
}

.offer-icon {
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.18);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.offer-copy {
  display: flex;
  flex-direction: column;
  line-height: 1.3;

  strong {
    font-size: 1.05rem;
  }

  span {
    font-size: 0.95rem;
    opacity: 0.9;
  }
}

/* Claim */
.claim-section {
  padding: 4rem 0;
}

.claim-container {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 2.5rem;
  align-items: start;
}

.claim-card {
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);

  h2 {
    font-family: 'Playfair Display', serif;
    font-size: 1.85rem;
    margin: 0 0 0.5rem;
    color: var(--text-dark);
  }
}

.claim-sub {
  color: var(--text-light);
  line-height: 1.6;
  margin: 0 0 1.5rem;
}

.claim-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field {
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
    border-radius: 10px;
    font-size: 1rem;
    color: var(--text-dark);
    background: white;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;

    &:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(74, 124, 89, 0.15);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
}

.claim-button {
  padding: 1rem;
  border: none;
  border-radius: 10px;
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

.form-error {
  margin: 0;
  color: #b3261e;
  font-size: 0.95rem;
}

.mode-toggle {
  margin: 1.25rem 0 0;
  color: var(--text-light);
  font-size: 0.95rem;
  text-align: center;
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

.claim-success {
  text-align: center;

  .success-icon {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: rgba(74, 124, 89, 0.15);
    color: var(--primary-color);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.25rem;
  }

  p {
    color: var(--text-light);
    line-height: 1.6;
    margin: 0 0 1.5rem;
  }
}

/* Benefits */
.benefits {
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);

  h2 {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem;
    margin: 0 0 1.5rem;
    color: var(--text-dark);
  }
}

.benefit-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  li {
    display: flex;
    gap: 0.75rem;
    align-items: flex-start;
    color: var(--text-light);
    line-height: 1.5;

    svg {
      flex-shrink: 0;
      margin-top: 0.2rem;
      color: var(--primary-color);
    }
  }
}

/* Roadmap */
.roadmap-section {
  padding: 4rem 0;
  background: white;
}

.section-title {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  text-align: center;
  margin: 0 0 2.5rem;
  color: var(--text-dark);
}

.roadmap-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 2rem;
}

.roadmap-card {
  background: var(--bg-light);
  border-radius: 16px;
  padding: 2rem;

  h3 {
    font-family: 'Playfair Display', serif;
    font-size: 1.3rem;
    margin: 0.75rem 0 0.75rem;
    color: var(--text-dark);
  }

  p {
    color: var(--text-light);
    line-height: 1.6;
    margin: 0;
  }
}

.roadmap-tag {
  display: inline-block;
  padding: 0.3rem 0.8rem;
  background: rgba(74, 124, 89, 0.12);
  color: var(--primary-color);
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

/* Meantime */
.meantime-section {
  padding: 4rem 0 6rem;
}

.meantime-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.5rem;
  align-items: center;
}

.meantime-copy {
  h2 {
    font-family: 'Playfair Display', serif;
    font-size: 1.85rem;
    margin: 0 0 1rem;
    color: var(--text-dark);
  }

  p {
    color: var(--text-light);
    line-height: 1.6;
    margin: 0 0 1.5rem;
  }
}

.meantime-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.meantime-link {
  display: inline-block;
  padding: 0.7rem 1.25rem;
  border: 2px solid var(--primary-color);
  border-radius: 50px;
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
  transition: background 0.2s ease, color 0.2s ease;

  &:hover {
    background: var(--primary-color);
    color: white;
  }
}

@media (max-width: 880px) {
  .claim-container,
  .meantime-container {
    grid-template-columns: 1fr;
  }

  h1 {
    font-size: 2.1rem;
  }

  .claim-card,
  .benefits {
    padding: 2rem;
  }
}
</style>
