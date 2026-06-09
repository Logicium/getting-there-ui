<script setup lang="ts">
import { ref } from 'vue'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const name = ref('')
const email = ref('')
const subject = ref('')
const message = ref('')

const submitting = ref(false)
const error = ref('')
const success = ref(false)

async function submit() {
  error.value = ''
  success.value = false

  if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
    error.value = 'Please fill in your name, email, and message.'
    return
  }

  submitting.value = true
  try {
    const res = await fetch(`${API_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.value.trim(),
        email: email.value.trim(),
        subject: subject.value.trim(),
        message: message.value.trim(),
      }),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => null)
      throw new Error(data?.message || 'Something went wrong. Please try again.')
    }

    success.value = true
    name.value = ''
    email.value = ''
    subject.value = ''
    message.value = ''
  } catch (e: any) {
    error.value = e.message || 'Something went wrong. Please try again.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <main class="contact-page">
    <section class="hero">
      <div class="container">
        <span class="badge">Contact us</span>
        <h1>We'd love to hear from you</h1>
        <p class="lede">
          Questions, feedback, or just want to say hello? Send us a note
          and we'll get back to you as soon as we can.
        </p>
      </div>
    </section>

    <section class="form-section">
      <div class="container form-grid">
        <form class="contact-form" @submit.prevent="submit">
          <h2>Send a message</h2>

          <div class="field">
            <label for="contact-name">Name</label>
            <input
              id="contact-name"
              v-model="name"
              type="text"
              autocomplete="name"
              placeholder="Your name"
              :disabled="submitting"
              required
            />
          </div>

          <div class="field">
            <label for="contact-email">Email</label>
            <input
              id="contact-email"
              v-model="email"
              type="email"
              autocomplete="email"
              placeholder="you@example.com"
              :disabled="submitting"
              required
            />
          </div>

          <div class="field">
            <label for="contact-subject">Subject (optional)</label>
            <input
              id="contact-subject"
              v-model="subject"
              type="text"
              placeholder="What's this about?"
              :disabled="submitting"
            />
          </div>

          <div class="field">
            <label for="contact-message">Message</label>
            <textarea
              id="contact-message"
              v-model="message"
              rows="6"
              placeholder="How can we help?"
              :disabled="submitting"
              required
            ></textarea>
          </div>

          <p v-if="error" class="form-error">{{ error }}</p>
          <p v-if="success" class="form-success">
            Thanks! Your message is on its way. We'll be in touch soon.
          </p>

          <button type="submit" class="submit-button" :disabled="submitting">
            {{ submitting ? 'Sending...' : 'Send message' }}
          </button>
        </form>

        <aside class="contact-aside">
          <h3>Other ways to reach us</h3>
          <p>
            Prefer to write directly? Messages sent through this form arrive at
            <strong>gettingthere@gthere.net</strong>. We read every one and aim
            to respond within a few business days.
          </p>
        </aside>
      </div>
    </section>
  </main>
</template>

<style scoped lang="scss">
.contact-page {
  min-height: 100vh;
  padding-top: 80px;
  background: var(--bg-light);
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 2rem;
}

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
  font-size: 2.75rem;
  font-weight: 700;
  margin: 0 0 1rem;
  line-height: 1.15;
}

.lede {
  font-size: 1.1rem;
  line-height: 1.6;
  opacity: 0.95;
  max-width: 600px;
  margin: 0 auto;
}

.form-section {
  padding: 4rem 0 6rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 2.5rem;
  align-items: start;
}

.contact-form {
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  h2 {
    font-family: 'Playfair Display', serif;
    font-size: 1.75rem;
    margin: 0 0 0.5rem;
    color: var(--text-dark);
  }
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

  input,
  textarea {
    padding: 0.85rem 1rem;
    border: 2px solid var(--border-light);
    border-radius: 10px;
    font-size: 1rem;
    color: var(--text-dark);
    background: white;
    font-family: inherit;
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

  textarea {
    resize: vertical;
    min-height: 140px;
  }
}

.submit-button {
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

.form-success {
  margin: 0;
  padding: 0.85rem 1rem;
  background: rgba(74, 124, 89, 0.12);
  color: var(--primary-color);
  border-radius: 10px;
  font-size: 0.95rem;
}

.contact-aside {
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);

  h3 {
    font-family: 'Playfair Display', serif;
    font-size: 1.35rem;
    margin: 0 0 1rem;
    color: var(--text-dark);
  }

  p {
    color: var(--text-light);
    line-height: 1.6;
    margin: 0;
  }
}

@media (max-width: 880px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  h1 {
    font-size: 2.1rem;
  }
}
</style>
