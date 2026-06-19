<script setup lang="ts">
import { ref } from 'vue'
import {
  AppBlob,
  AppButton,
  AppCard,
  AppContainer,
  AppEyebrow,
  AppField,
  AppHero,
  AppInput,
  AppSection,
  AppTextarea,
} from '@/components/ui'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const name = ref('')
const email = ref('')
const subject = ref('')
const message = ref('')

const submitting = ref(false)
const error = ref('')
const success = ref(false)

const faqs = [
  {
    q: 'How quickly will I hear back?',
    a: 'We aim to respond to all messages within a few business days. For workshop inquiries, allow up to a week as we often coordinate with multiple facilitators.',
  },
  {
    q: 'Do you offer private or corporate workshops?',
    a: 'Yes — drop us a note describing your group, intent, and timeframe and we will get back to you with options.',
  },
  {
    q: 'Where do messages go?',
    a: 'Every form submission lands in our shared team inbox at gettingthere@gthere.net. We read every one.',
  },
  {
    q: 'Are you accepting press requests?',
    a: 'We welcome thoughtful press inquiries. Please include outlet, deadline, and angle in your message.',
  },
]

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
  <main class="contact">
    <!-- HERO -->
    <AppHero variant="editorial" tone="marigold" align="left">
      <template #eyebrow>
        <AppEyebrow tone="ink">Contact us</AppEyebrow>
      </template>
      <template #title>We'd love to hear from you</template>
      <template #lede>
        <p>
          Questions, feedback, or just want to say hello? Send us a note
          and we'll get back to you as soon as we can.
        </p>
      </template>
      <template #media>
        <div class="contact-info" aria-hidden="false">
          <AppBlob tone="cobalt" class="contact-info__blob" />
          <ul class="contact-info__list">
            <li>
              <span class="contact-info__label">Email</span>
              <a href="mailto:gettingthere@gthere.net">gettingthere@gthere.net</a>
            </li>
            <li>
              <span class="contact-info__label">Response time</span>
              <span>A few business days</span>
            </li>
            <li>
              <span class="contact-info__label">Workshops &amp; press</span>
              <span>Use the form — we read each one</span>
            </li>
          </ul>
        </div>
      </template>
    </AppHero>

    <!-- FORM -->
    <AppSection tone="cream" pad="xl">
      <AppContainer size="md">
        <AppCard
          variant="plaque"
          tone="paper"
          shadow-tone="cobalt"
          pad="lg"
          class="contact-form"
        >
          <template #eyebrow>
            <AppEyebrow tone="cobalt">Send a message</AppEyebrow>
          </template>
          <template #title>Drop us a note</template>

          <form @submit.prevent="submit" class="contact-form__form" novalidate>
            <AppField
              label="Name"
              required
              :for="'contact-name'"
              :error="error && !name.trim() ? 'Please add your name' : ''"
            >
              <AppInput
                id="contact-name"
                v-model="name"
                type="text"
                autocomplete="name"
                placeholder="Your name"
                :disabled="submitting"
                required
              />
            </AppField>

            <AppField
              label="Email"
              required
              :for="'contact-email'"
              :error="error && !email.trim() ? 'Please add your email' : ''"
            >
              <AppInput
                id="contact-email"
                v-model="email"
                type="email"
                autocomplete="email"
                placeholder="you@example.com"
                :disabled="submitting"
                required
              />
            </AppField>

            <AppField label="Subject" hint="Optional" :for="'contact-subject'">
              <AppInput
                id="contact-subject"
                v-model="subject"
                type="text"
                placeholder="What's this about?"
                :disabled="submitting"
              />
            </AppField>

            <AppField
              label="Message"
              required
              :for="'contact-message'"
              :error="error && !message.trim() ? 'Please add a message' : ''"
            >
              <AppTextarea
                id="contact-message"
                v-model="message"
                :rows="6"
                placeholder="How can we help?"
                :disabled="submitting"
                required
              />
            </AppField>

            <p v-if="error" class="contact-form__error">{{ error }}</p>
            <p v-if="success" class="contact-form__success">
              Thanks! Your message is on its way. We'll be in touch soon.
            </p>

            <AppButton
              type="submit"
              variant="primary"
              size="lg"
              block
              :loading="submitting"
              :disabled="submitting"
            >
              {{ submitting ? 'Sending...' : 'Send message' }}
            </AppButton>
          </form>
        </AppCard>
      </AppContainer>
    </AppSection>

    <!-- FAQ -->
    <AppSection tone="cream-2" pad="xl">
      <AppContainer size="md">
        <header class="contact-head">
          <AppEyebrow tone="fuchsia">Questions?</AppEyebrow>
          <h2 class="u-display u-display--md">Frequently asked</h2>
        </header>

        <div class="contact-faqs">
          <AppCard
            v-for="(faq, i) in faqs"
            :key="i"
            variant="flat"
            tone="paper"
            pad="md"
            class="contact-faq"
          >
            <details class="contact-faq__details">
              <summary class="contact-faq__summary">
                <span>{{ faq.q }}</span>
                <span class="contact-faq__icon" aria-hidden="true">+</span>
              </summary>
              <p class="contact-faq__answer">{{ faq.a }}</p>
            </details>
          </AppCard>
        </div>
      </AppContainer>
    </AppSection>
  </main>
</template>

<style scoped lang="scss">
.contact {
  :deep(.app-hero__media) {
    border: none;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
  }
}

.contact-info {
  position: relative;
  isolation: isolate;
  padding: var(--s-6);
  background: var(--c-paper);
  border: 2.5px solid var(--c-ink);
  border-radius: var(--r-asym-b);
  box-shadow: 8px 8px 0 0 var(--c-ink);
  color: var(--c-text);

  &__blob {
    position: absolute;
    inset: -10% -10% auto auto;
    width: 55%;
    height: 55%;
    z-index: -1;
  }

  &__list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: var(--s-4);

    li {
      display: flex;
      flex-direction: column;
      gap: var(--s-1);
    }

    a {
      color: var(--c-cobalt);
      font-weight: 700;
      text-decoration: underline;
      text-decoration-thickness: 2px;
      text-underline-offset: 4px;

      &:hover { color: var(--c-cobalt-deep); }
    }
  }

  &__label {
    font-family: var(--font-body);
    font-size: var(--fs-xs);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: var(--ls-wide);
    color: var(--c-text-muted);
  }
}

.contact-form {
  &__form {
    display: flex;
    flex-direction: column;
    gap: var(--s-5);
    margin-top: var(--s-4);
  }

  &__error {
    margin: 0;
    color: var(--c-fuchsia-deep);
    font-weight: 600;
  }

  &__success {
    margin: 0;
    padding: var(--s-3) var(--s-4);
    background: var(--c-mint);
    color: var(--c-ink);
    border: 2px solid var(--c-ink);
    border-radius: var(--r-md);
    font-weight: 600;
  }
}

.contact-head {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--s-3);
  text-align: center;
  margin-bottom: var(--s-7);
}

.contact-faqs {
  display: flex;
  flex-direction: column;
  gap: var(--s-3);
}

.contact-faq {
  &__details { width: 100%; }

  &__summary {
    list-style: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--s-3);
    font-family: var(--font-display);
    font-weight: 600;
    font-size: var(--fs-lg);
    color: var(--c-ink);
    padding: var(--s-1) 0;

    &::-webkit-details-marker { display: none; }
  }

  &__icon {
    font-family: var(--font-display);
    font-weight: 700;
    color: var(--c-cobalt);
    transition: transform var(--dur-base) var(--ease-snap);
  }

  &__details[open] &__icon { transform: rotate(45deg); }

  &__answer {
    margin: var(--s-3) 0 0;
    color: var(--c-text-muted);
    line-height: var(--lh-base);
  }
}
</style>
