<script setup lang="ts">
import { Stethoscope } from 'lucide-vue-next'
import { AppCard, AppContainer, AppEyebrow, AppGrid } from '@/components/ui'

const items = [
  {
    title: 'Professional support',
    body: 'These resources complement but do not replace professional therapy. Please consult with a licensed healthcare provider for personalized care.',
  },
  {
    title: 'Crisis support',
    body: "If you're in crisis, please contact emergency services (911) or the National Suicide Prevention Lifeline (988) immediately.",
  },
  {
    title: 'Confidential care',
    body: 'All our content is designed with trauma-informed principles and includes resources for additional support when needed.',
  },
  {
    title: 'Progress at your pace',
    body: 'Healing is not linear. Take breaks when needed and remember that seeking help is a sign of strength, not weakness.',
  },
]
</script>

<template>
  <AppContainer size="lg">
    <header class="disclaimer-section__head">
      <span class="disclaimer-section__icon" aria-hidden="true">
        <Stethoscope :size="28" :stroke-width="2" />
      </span>
      <AppEyebrow tone="fuchsia">Important</AppEyebrow>
      <h2 class="disclaimer-section__title">Important therapeutic information</h2>
    </header>

    <AppGrid :min="240" gap="md">
      <AppCard
        v-for="item in items"
        :key="item.title"
        variant="flat"
        tone="paper"
        pad="lg"
        class="disclaimer-section__card"
      >
        <template #title>{{ item.title }}</template>
        <p>{{ item.body }}</p>
      </AppCard>
    </AppGrid>
  </AppContainer>
</template>

<style scoped lang="scss">
.disclaimer-section {
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
    background: var(--c-fuchsia);
    color: var(--c-cream);
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
