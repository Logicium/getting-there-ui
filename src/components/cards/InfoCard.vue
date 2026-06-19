<script setup lang="ts">
import { computed } from 'vue'
import { AppCard } from '@/components/ui'
import PostItsIcon from '@/components/icons/PostItsIcon.vue'
import PuzzleIcon  from '@/components/icons/PuzzleIcon.vue'
import ArrowIcon   from '@/components/icons/ArrowIcon.vue'

const props = defineProps<{
  title: string
  description: string
  stepNumber: number
  iconIndex: number
  icon?: {
    url: string
    width: number
    height: number
    formats?: { small?: { url: string }, thumbnail?: { url: string } }
  }
}>()

const fallbackIcon = computed(() => {
  switch (props.iconIndex) {
    case 0: return PostItsIcon
    case 1: return PuzzleIcon
    case 2: return ArrowIcon
    default: return PostItsIcon
  }
})

// Rotate accent tones for visual variety across the step grid
const tone = computed(() => {
  const palette = ['marigold', 'mint', 'fuchsia', 'cobalt'] as const
  return palette[(props.iconIndex ?? 0) % palette.length]
})
</script>

<template>
  <AppCard variant="plaque" tone="paper" :shadow-tone="tone" pad="lg" class="info-card">
    <span class="info-card__num" :data-tone="tone">{{ stepNumber }}</span>
    <div class="info-card__icon">
      <img v-if="icon && icon.url" :src="`https://getting-there-cms.onrender.com${icon.url}`" :alt="title" />
      <component v-else :is="fallbackIcon" />
    </div>
    <h3 class="info-card__title">{{ title }}</h3>
    <p class="info-card__desc">{{ description }}</p>
  </AppCard>
</template>

<style scoped lang="scss">
.info-card {
  text-align: center;
  position: relative;

  :deep(.app-card__body) {
    align-items: center;
    padding-top: var(--s-7);
  }

  &__num {
    position: absolute;
    top: -22px;
    left: 50%;
    transform: translateX(-50%);
    width: 44px; height: 44px;
    border-radius: 50%;
    border: 2.5px solid var(--c-ink);
    background: var(--c-marigold);
    color: var(--c-ink);
    display: grid; place-items: center;
    font-family: var(--font-display);
    font-weight: 700;
    font-size: var(--fs-lg);
    box-shadow: 3px 3px 0 0 var(--c-ink);
    z-index: 2;

    &[data-tone='cobalt']   { background: var(--c-cobalt);   color: var(--c-cream); }
    &[data-tone='mint']     { background: var(--c-mint);     color: var(--c-ink); }
    &[data-tone='fuchsia']  { background: var(--c-fuchsia);  color: var(--c-cream); }
  }

  &__icon {
    width: 84px; height: 84px;
    display: grid; place-items: center;
    background: var(--c-cream-2);
    border-radius: var(--r-asym-c);
    border: 2px solid var(--c-ink);
    margin-bottom: var(--s-2);

    img, :deep(svg) { width: 56px; height: 56px; object-fit: contain; }
  }

  &__title {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: var(--fs-2xl);
    margin: 0;
    color: var(--c-ink);
    line-height: var(--lh-snug);
  }

  &__desc {
    font-family: var(--font-body);
    color: var(--c-text-muted);
    line-height: var(--lh-base);
    margin: 0;
  }
}
</style>
