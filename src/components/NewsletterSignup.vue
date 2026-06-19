<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  variant?: 'sidebar' | 'inline' | 'cta' | 'card'
  title?: string
  description?: string
  buttonText?: string
  source?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'sidebar',
  title: 'Join Our Newsletter',
  description: 'Weekly tips on positive psychology, mindfulness, and intentional living — straight to your inbox.',
  buttonText: 'Subscribe',
  source: 'unknown',
})

const email = ref('')
const submitting = ref(false)
const success = ref(false)
const error = ref('')

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

async function submit() {
  error.value = ''
  if (!/^\S+@\S+\.\S+$/.test(email.value)) {
    error.value = 'Please enter a valid email address.'
    return
  }
  submitting.value = true
  try {
    const res = await fetch(`${API_URL}/newsletter/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, source: props.source }),
    })
    if (res.status === 409) {
      // Already subscribed — treat as success from the user's perspective.
      success.value = true
      email.value = ''
      return
    }
    if (!res.ok) {
      const body = await res.text().catch(() => '')
      throw new Error(`Subscribe failed (${res.status}): ${body.slice(0, 200)}`)
    }
    success.value = true
    email.value = ''
  } catch (e: any) {
    console.error('Newsletter subscribe failed:', e)
    error.value =
      "We couldn't sign you up right now. Please try again in a moment, or email us if it keeps happening."
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div :class="['newsletter-signup', `newsletter-signup--${variant}`]">
    <h3 v-if="title" class="newsletter-title">{{ title }}</h3>
    <p v-if="description" class="newsletter-description">{{ description }}</p>

    <form v-if="!success" class="newsletter-form" @submit.prevent="submit">
      <input
        v-model="email"
        type="email"
        class="newsletter-input"
        placeholder="Your email address"
        aria-label="Email address"
        :disabled="submitting"
      />
      <button type="submit" class="newsletter-btn" :disabled="submitting">
        {{ submitting ? 'Subscribing...' : buttonText }}
      </button>
      <p v-if="error" class="newsletter-error">{{ error }}</p>
      <p class="privacy-note">No spam. Unsubscribe any time.</p>
    </form>

    <div v-else class="newsletter-success">
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
           fill="none" stroke="currentColor" stroke-width="2"
           stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      <span>You're on the list! Check your inbox for a confirmation.</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.newsletter-signup {
  display: flex;
  flex-direction: column;
}

.newsletter-title {
  font-family: var(--font-display);
  font-size: 1.4rem;
  margin: 0 0 0.5rem;
  color: var(--text-dark);
}

.newsletter-description {
  color: var(--text-light);
  line-height: 1.6;
  margin: 0 0 1rem;
}

.newsletter-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.newsletter-input {
  width: 100%;
  padding: 0.85rem 1rem;
  border: 2px solid var(--border-light);
  border-radius: 12px;
  font-size: 1rem;
  background: white;
  color: var(--text-dark);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(74, 124, 89, 0.15);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
}

.newsletter-btn {
  background: var(--primary-color);
  color: white;
  padding: 0.85rem 1rem;
  border-radius: 25px;
  border: none;
  font-weight: 600;
  font-size: 1rem;
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

.newsletter-error {
  margin: 0;
  color: #b3261e;
  font-size: 0.9rem;
}

.privacy-note {
  margin: 0;
  font-size: 0.8rem;
  color: var(--text-light);
}

.newsletter-success {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.85rem 1rem;
  background: rgba(74, 124, 89, 0.12);
  border-radius: 12px;
  color: var(--primary-color);
  font-weight: 500;
}

/* Variants */
.newsletter-signup--cta {
  text-align: center;
  align-items: center;

  .newsletter-title {
    font-size: 2rem;
    color: white;
  }

  .newsletter-description {
    color: rgba(255, 255, 255, 0.9);
    max-width: 520px;
  }

  .newsletter-form {
    width: 100%;
    max-width: 520px;
  }

  .newsletter-input {
    border-color: rgba(255, 255, 255, 0.4);
  }

  .newsletter-btn {
    background: white;
    color: var(--primary-color);

    &:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.92);
    }
  }

  .privacy-note {
    color: rgba(255, 255, 255, 0.8);
  }

  .newsletter-success {
    background: rgba(255, 255, 255, 0.18);
    color: white;
  }
}

.newsletter-signup--card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}
</style>
