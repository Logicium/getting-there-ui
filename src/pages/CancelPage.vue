<script setup lang="ts">
import { useRouter } from 'vue-router'
import {
  AppBadge,
  AppButton,
  AppCard,
  AppContainer,
  AppEyebrow,
  AppGrid,
  AppHero,
  AppSection,
} from '@/components/ui'

const router = useRouter()

const reasons = [
  {
    eyebrow: 'Take your time',
    title: 'Need more time to decide?',
    body: "Browse our store and add resources to your cart when you're ready.",
    action: 'Browse store',
    onClick: () => router.push('/store'),
    tone: 'marigold' as const,
  },
  {
    eyebrow: 'Payment hiccup?',
    title: 'Payment issues?',
    body: 'If something went sideways at checkout, try again or reach our team.',
    action: 'Try again',
    onClick: () => router.push('/checkout'),
    tone: 'cobalt' as const,
  },
  {
    eyebrow: 'Got questions?',
    title: 'Have questions?',
    body: 'Our support team is here for anything about our resources or checkout.',
    action: 'Contact support',
    href: 'mailto:support@gthere.net',
    tone: 'fuchsia' as const,
  },
]

const trust = [
  { label: '100% Secure Checkout' },
  { label: '30-Day Money-Back Guarantee' },
  { label: 'Instant Access After Purchase' },
]
</script>

<template>
  <main class="cancel-page">
    <AppHero variant="compact" tone="marigold" align="center">
      <template #eyebrow>
        <AppEyebrow tone="ink">Checkout paused</AppEyebrow>
      </template>
      <template #title>Order not completed</template>
      <template #lede>
        Your cart is saved. Pick up exactly where you left off whenever you're ready.
      </template>
      <template #actions>
        <AppButton variant="ink" size="lg" @click="router.push('/checkout')">Return to checkout</AppButton>
        <AppButton variant="ghost" size="lg" @click="router.push('/store')">Continue shopping</AppButton>
      </template>
    </AppHero>

    <AppSection tone="cream" pad="lg">
      <AppContainer size="md">
        <AppCard variant="plaque" tone="paper" shadow-tone="mint" pad="lg">
          <template #eyebrow>
            <AppEyebrow tone="mint">No worries</AppEyebrow>
          </template>
          <template #title>Your cart is right where you left it</template>
          <p class="cancel-page__lede">
            We saved your cart so you can complete your purchase whenever you're ready.
            Your selected resources are still waiting for you.
          </p>
        </AppCard>
      </AppContainer>
    </AppSection>

    <AppSection tone="cream-2" pad="xl">
      <AppContainer size="lg">
        <header class="cancel-page__lead">
          <AppEyebrow tone="cobalt">Need help?</AppEyebrow>
          <h2 class="cancel-page__heading">Common reasons people pause</h2>
        </header>

        <AppGrid :min="260" gap="lg">
          <AppCard
            v-for="r in reasons"
            :key="r.title"
            variant="plaque"
            tone="paper"
            :shadow-tone="r.tone"
            pad="lg"
          >
            <template #eyebrow>
              <AppEyebrow :tone="r.tone">{{ r.eyebrow }}</AppEyebrow>
            </template>
            <template #title>{{ r.title }}</template>
            <p class="cancel-page__reason-body">{{ r.body }}</p>
            <template #footer>
              <AppButton
                v-if="r.href"
                variant="ghost"
                size="sm"
                :href="r.href"
              >{{ r.action }}</AppButton>
              <AppButton
                v-else
                variant="ghost"
                size="sm"
                @click="r.onClick"
              >{{ r.action }}</AppButton>
            </template>
          </AppCard>
        </AppGrid>
      </AppContainer>
    </AppSection>

    <AppSection tone="cream" pad="lg">
      <AppContainer size="lg">
        <div class="cancel-page__trust">
          <AppBadge v-for="t in trust" :key="t.label" tone="ink">{{ t.label }}</AppBadge>
        </div>
      </AppContainer>
    </AppSection>

    <AppSection tone="ink" pad="lg">
      <AppContainer size="md">
        <div class="cancel-page__support">
          <AppEyebrow tone="marigold">Still need a hand?</AppEyebrow>
          <h2 class="cancel-page__support-title">We're here to help</h2>
          <div class="cancel-page__support-links">
            <AppButton variant="primary" href="mailto:support@gthere.net">support@gthere.net</AppButton>
            <AppButton variant="ghost" href="tel:+1234567890">(123) 456-7890</AppButton>
          </div>
        </div>
      </AppContainer>
    </AppSection>
  </main>
</template>

<style scoped lang="scss">
.cancel-page {
  &__lede {
    margin: 0;
    color: var(--c-text-muted);
    line-height: var(--lh-loose);
  }

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

  &__reason-body {
    margin: 0;
    color: var(--c-text-muted);
    line-height: var(--lh-base);
  }

  &__trust {
    display: flex;
    flex-wrap: wrap;
    gap: var(--s-3);
    justify-content: center;
  }

  &__support {
    text-align: center;
    color: var(--c-cream);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--s-4);
  }

  &__support-title {
    font-family: var(--font-display);
    font-size: var(--fs-4xl);
    color: var(--c-cream);
    margin: 0;
  }

  &__support-links {
    display: flex;
    gap: var(--s-3);
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
