<script setup lang="ts">
import { ShieldCheck } from 'lucide-vue-next'
import { AppCard, AppContainer, AppEyebrow, AppGrid } from '@/components/ui'

const items = [
  {
    title: 'Confidential environment',
    body: "All our groups maintain strict confidentiality. What's shared in group stays in group.",
  },
  {
    title: 'Experienced facilitators',
    body: 'Every group is led by experienced facilitators with specialized training.',
  },
  {
    title: 'Trauma-informed care',
    body: 'Our approach prioritizes safety, trustworthiness, and cultural humility in all interactions.',
  },
  {
    title: 'Sliding scale available',
    body: "Financial assistance available. Your healing shouldn't depend on your ability to pay.",
  },
]
</script>

<template>
  <AppContainer size="lg">
    <header class="support-info__head">
      <span class="support-info__icon" aria-hidden="true">
        <ShieldCheck :size="28" :stroke-width="2" />
      </span>
      <AppEyebrow tone="mint">Our commitment</AppEyebrow>
      <h2 class="support-info__title">Your safety &amp; comfort, first</h2>
    </header>

    <AppGrid :min="240" gap="md">
      <AppCard
        v-for="item in items"
        :key="item.title"
        variant="flat"
        tone="paper"
        pad="lg"
        class="support-info__card"
      >
        <template #title>{{ item.title }}</template>
        <p>{{ item.body }}</p>
      </AppCard>
    </AppGrid>
  </AppContainer>
</template>

<style scoped lang="scss">
.support-info {
  &__head {
    text-align: center;
    margin-bottom: var(--s-6);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--s-3);
  }

  &__icon {
    display: inline-grid;
    place-items: center;
    width: 56px;
    height: 56px;
    border: 2px solid var(--c-ink);
    border-radius: 999px;
    background: var(--c-mint);
    color: var(--c-ink);
    box-shadow: 4px 4px 0 0 var(--c-ink);
  }

  &__title {
    font-family: var(--font-display);
    font-size: clamp(var(--fs-2xl), 4vw, var(--fs-3xl));
    line-height: var(--lh-tight);
    color: var(--c-ink);
    margin: 0;
  }

  &__card {
    p {
      color: var(--c-text-muted);
      line-height: var(--lh-loose);
      margin: 0;
    }
  }
}
</style>
