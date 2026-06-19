<script setup lang="ts">
import { ref } from 'vue'
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

const email = ref('')
const submitting = ref(false)
const success = ref(false)
const error = ref('')

const includes = [
  '3 hours of video time for each course',
  'Ability to pace your learning',
  '20 multiple choice questions at the end',
  'Certificate of completion for those achieving 70% or higher score on the exam',
]

const lineup = [
  {
    title: 'About Happiness',
    body: 'A grounded look at what happiness actually is, the different forms it can take, and small shifts that help more of it show up in everyday life.',
  },
  {
    title: 'Setting and Reaching Goals',
    body: 'A practical walk-through for choosing goals that matter to you, breaking them into doable steps, and building the momentum to follow through.',
  },
  {
    title: 'Communication: Connecting with Others',
    body: 'Tools for being heard, listening well, and navigating the everyday conversations that shape your closest relationships.',
  },
  {
    title: 'Coping with Loss',
    body: 'A gentle, paced exploration of grief and the many forms loss can take, with ideas for caring for yourself as you move through it.',
  },
]

async function submit() {
  error.value = ''
  success.value = false
  if (!email.value.trim()) {
    error.value = 'Please add your email.'
    return
  }
  submitting.value = true
  try {
    await new Promise((r) => setTimeout(r, 400))
    success.value = true
    email.value = ''
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Something went wrong.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <main class="coming-soon-page">
    <AppHero variant="magazine" tone="marigold" align="center">
      <template #eyebrow>
        <AppEyebrow tone="ink">Coming soon</AppEyebrow>
      </template>
      <template #title>Online courses are being developed</template>
      <template #lede>
        <p>
          We're putting the finishing touches on our first round of courses
          so stay tuned. You may find the courses meet Continuing Education
          requirements based on your profession.
        </p>
      </template>
      <template #media>
        <AppCard
          variant="ticket"
          tone="paper"
          shadow-tone="marigold"
          pad="lg"
          class="coming-soon-notify"
        >
          <template #eyebrow>
            <AppEyebrow tone="marigold">Get notified</AppEyebrow>
          </template>
          <template #title>Be first in line</template>
          <p class="coming-soon-notify__lede">
            Drop your email and we'll let you know the moment classes launch.
          </p>
          <form class="coming-soon-notify__form" novalidate @submit.prevent="submit">
            <AppField
              label="Email"
              required
              :for="'coming-soon-email'"
              :error="error"
            >
              <AppInput
                id="coming-soon-email"
                v-model="email"
                type="email"
                autocomplete="email"
                placeholder="you@example.com"
                :disabled="submitting"
                required
              />
            </AppField>
            <p v-if="success" class="coming-soon-notify__success">
              You're on the list. We'll be in touch.
            </p>
            <AppButton
              type="submit"
              variant="primary"
              size="lg"
              block
              :loading="submitting"
              :disabled="submitting"
            >
              {{ submitting ? 'Subscribing...' : 'Notify me' }}
            </AppButton>
          </form>
        </AppCard>
      </template>
    </AppHero>

    <AppSection tone="cream" pad="xl">
      <AppContainer size="md">
        <header class="coming-soon-head">
          <AppEyebrow tone="cobalt">What's inside</AppEyebrow>
          <h2 class="u-display u-display--md">What online courses include</h2>
        </header>
        <AppCard variant="plaque" tone="paper" shadow-tone="cobalt" pad="lg">
          <ul class="coming-soon-list">
            <li v-for="item in includes" :key="item">{{ item }}</li>
          </ul>
        </AppCard>
      </AppContainer>
    </AppSection>

    <AppSection tone="cream" pad="xl">
      <AppContainer size="md">
        <header class="coming-soon-head">
          <AppEyebrow tone="fuchsia">On the way</AppEyebrow>
          <h2 class="u-display u-display--md">Course lineup</h2>
          <p class="coming-soon-intro">
            Each course is being designed as a self-paced experience you can fit
            around the rest of your life. Here's what's on the way:
          </p>
        </header>
        <AppCard variant="plaque" tone="paper" shadow-tone="fuchsia" pad="lg">
          <ul class="coming-soon-list coming-soon-list--lineup">
            <li v-for="course in lineup" :key="course.title">
              <strong>{{ course.title }}</strong> &mdash; {{ course.body }}
            </li>
          </ul>
        </AppCard>
      </AppContainer>
    </AppSection>
  </main>
</template>

<style scoped lang="scss">
.coming-soon-notify {
  max-width: 460px;
  margin-inline: auto;

  &__lede {
    margin: 0;
    color: var(--c-text-muted);
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: var(--s-4);
    margin-top: var(--s-3);
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

.coming-soon-page {
  :deep(.app-hero__media) {
    border: none;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
  }
}

.coming-soon-head {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--s-3);
  text-align: center;
  margin-bottom: var(--s-7);
}

.coming-soon-intro {
  max-width: 640px;
  margin: 0;
  color: var(--c-text-muted);
  line-height: var(--lh-base);
}

.coming-soon-list {
  margin: 0;
  padding-left: var(--s-5);
  color: var(--c-text);
  line-height: var(--lh-base);

  li + li {
    margin-top: var(--s-3);
  }

  &--lineup {
    list-style: disc;

    strong {
      color: var(--c-ink);
      font-weight: 700;
    }
  }
}
</style>
