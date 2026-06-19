<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { AppCard } from '@/components/ui'
import ThoughtIcon         from '@/components/icons/ThoughtIcon.vue'
import FallingStarIcon     from '@/components/icons/FallingStarIcon.vue'
import HandDrawnPlantIcon  from '@/components/icons/HandDrawnPlantIcon.vue'
import PlantIcon           from '@/components/icons/PlantIcon.vue'

const props = defineProps<{
  title: string
  description: string | null
  iconIndex: number
  linkLocation?: string | null
  icon?: {
    url: string
    width: number
    height: number
    formats?: { small?: { url: string }, thumbnail?: { url: string } }
  }
}>()

const fallbackIcon = computed(() => {
  switch (props.iconIndex) {
    case 0: return ThoughtIcon
    case 1: return FallingStarIcon
    case 2: return HandDrawnPlantIcon
    default: return PlantIcon
  }
})

const tones = ['cobalt', 'fuchsia', 'mint', 'marigold'] as const
const tone = computed(() => tones[(props.iconIndex ?? 0) % tones.length])

const linkTo = computed(() => {
  if (!props.linkLocation) return null
  return props.linkLocation === 'home' ? '/' : `/${props.linkLocation}`
})
</script>

<template>
  <AppCard variant="plaque" tone="paper" :shadow-tone="tone" pad="lg" class="service-card">
    <div class="service-card__icon" :data-tone="tone">
      <img v-if="icon && icon.url" :src="`https://getting-there-cms.onrender.com${icon.url}`" :alt="title" />
      <component v-else :is="fallbackIcon" />
    </div>
    <h3 class="service-card__title">{{ title }}</h3>
    <p v-if="description" class="service-card__desc">{{ description }}</p>
    <RouterLink v-if="linkTo" :to="linkTo" class="service-card__link" :data-tone="tone">
      Learn more <span aria-hidden="true">→</span>
    </RouterLink>
  </AppCard>
</template>

<style scoped lang="scss">
.service-card {
  text-align: center;
  :deep(.app-card__body) { align-items: center; gap: var(--s-3); }

  &__icon {
    width: 84px; height: 84px;
    display: grid; place-items: center;
    border-radius: var(--r-asym-c);
    border: 2.5px solid var(--c-ink);
    background: var(--c-marigold);

    img, :deep(svg) { width: 52px; height: 52px; object-fit: contain; }

    &[data-tone='cobalt']   { background: var(--c-cobalt);   img,:deep(svg) { filter: brightness(0) invert(1); } }
    &[data-tone='fuchsia']  { background: var(--c-fuchsia);  img,:deep(svg) { filter: brightness(0) invert(1); } }
    &[data-tone='mint']     { background: var(--c-mint); }
    &[data-tone='marigold'] { background: var(--c-marigold); }
  }

  &__title {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: var(--fs-2xl);
    line-height: var(--lh-snug);
    margin: 0;
    color: var(--c-ink);
  }

  &__desc {
    font-family: var(--font-body);
    color: var(--c-text-muted);
    line-height: var(--lh-base);
    margin: 0;
  }

  &__link {
    margin-top: auto;
    font-family: var(--font-body);
    font-weight: 700;
    color: var(--c-cobalt);
    text-decoration: none;
    transition: color var(--dur-fast) var(--ease-out);
    display: inline-flex; gap: var(--s-2);
    align-items: center;

    span { transition: transform var(--dur-fast) var(--ease-snap); }
    &:hover {
      color: var(--c-cobalt-deep);
      span { transform: translateX(4px); }
    }
    &[data-tone='fuchsia']:hover { color: var(--c-fuchsia-deep); }
    &[data-tone='mint']:hover    { color: var(--c-mint-deep); }
    &[data-tone='marigold']:hover{ color: var(--c-marigold-deep); }
    &[data-tone='plum']:hover    { color: var(--c-plum); }
  }
}
</style>
