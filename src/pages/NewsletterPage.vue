<script setup lang="ts">
import NewsletterSignup from '@/components/NewsletterSignup.vue'
import {
  AppCard,
  AppContainer,
  AppEyebrow,
  AppGrid,
  AppHero,
  AppSection,
} from '@/components/ui'

const benefits = [
  {
    img: '/newsletter/picture-2.jpg',
    title: 'One practice a week',
    body: 'A simple exercise you can try in five minutes or less.',
  },
  {
    img: '/newsletter/picture-3.jpg',
    title: "Founder's notes",
    body: "Behind-the-scenes thinking, book recommendations, and what we're learning as we build.",
  },
  {
    img: '/newsletter/picture-4.jpg',
    title: 'Early access',
    body: 'Subscribers see new courses, events, and workshops before anyone else.',
  },
]
</script>

<template>
  <main class="newsletter-page">
    <AppHero variant="magazine" tone="marigold" align="center">
      <template #eyebrow>
        <AppEyebrow tone="ink">The Getting There Newsletter</AppEyebrow>
      </template>
      <template #title>Weekly updates on changes, additions &amp; events.</template>
      <template #lede>
        Join a growing community of readers exploring happiness, personal growth, coping with loss,
        setting goals, and more. One short, useful email per week. No spam, ever.
      </template>
    </AppHero>

    <AppSection tone="cream" pad="lg">
      <AppContainer size="sm">
        <AppCard variant="plaque" tone="paper" shadow-tone="marigold" pad="lg">
          <template #eyebrow>
            <AppEyebrow tone="marigold">Subscribe for free</AppEyebrow>
          </template>
          <template #title>Drop your email below</template>
          <NewsletterSignup
            variant="card"
            source="newsletter-page"
            title=""
            description="We'll send you a welcome note, then one email a week."
            button-text="Send me the newsletter"
          />
        </AppCard>
      </AppContainer>
    </AppSection>

    <AppSection tone="cream-2" pad="xl">
      <AppContainer size="lg">
        <header class="newsletter-page__lead">
          <AppEyebrow tone="cobalt">What you'll get</AppEyebrow>
          <h2 class="newsletter-page__heading">Three reasons to subscribe</h2>
        </header>

        <AppGrid :min="260" gap="lg">
          <AppCard
            v-for="(b, i) in benefits"
            :key="b.title"
            variant="flat"
            tone="paper"
            pad="none"
            class="newsletter-page__benefit"
          >
            <template #media>
              <div class="newsletter-page__benefit-image">
                <img :src="b.img" :alt="b.title" loading="lazy" />
              </div>
            </template>
            <div class="newsletter-page__benefit-body">
              <span class="newsletter-page__benefit-index">0{{ i + 1 }}</span>
              <h3>{{ b.title }}</h3>
              <p>{{ b.body }}</p>
            </div>
          </AppCard>
        </AppGrid>
      </AppContainer>
    </AppSection>
  </main>
</template>

<style scoped lang="scss">
.newsletter-page {
  &__lead {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--s-3);
    margin-bottom: var(--s-7);
    text-align: center;
  }

  &__heading {
    font-family: var(--font-display);
    font-size: var(--fs-4xl);
    color: var(--c-ink);
    margin: 0;
  }

  &__benefit-image {
    aspect-ratio: 4 / 3;
    overflow: hidden;
    border-radius: var(--r-md) var(--r-md) 0 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
  }

  &__benefit-body {
    padding: var(--s-5);
    display: flex;
    flex-direction: column;
    gap: var(--s-2);

    h3 {
      font-family: var(--font-display);
      font-size: var(--fs-xl);
      color: var(--c-ink);
      margin: 0;
    }

    p {
      color: var(--c-text-muted);
      line-height: var(--lh-base);
      margin: 0;
    }
  }

  &__benefit-index {
    font-family: var(--font-accent);
    font-size: var(--fs-md);
    color: var(--c-fuchsia);
    letter-spacing: var(--ls-wide);
  }
}
</style>
