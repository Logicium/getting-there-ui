<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import VideoIcon       from '@/components/icons/VideoIcon.vue'
import BookIcon        from '@/components/icons/BookIcon.vue'
import ChalkboardIcon  from '@/components/icons/ChalkboardIcon.vue'
import PenIcon         from '@/components/icons/PenIcon.vue'

const props = defineProps<{
  title: string
  description: string
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
    case 0: return VideoIcon
    case 1: return BookIcon
    case 2: return ChalkboardIcon
    default: return PenIcon
  }
})

const resourceLink = computed(() => {
  switch (props.iconIndex) {
    case 0: return '/videos'
    case 1: return '/store'
    case 2: return '/classes'
    default: return '/blog'
  }
})

const tones = ['cobalt', 'fuchsia', 'mint', 'marigold'] as const
const tone = computed(() => tones[(props.iconIndex ?? 0) % tones.length])
</script>

<template>
  <RouterLink :to="resourceLink" class="resource-card" :data-tone="tone">
    <span class="resource-card__icon" :data-tone="tone">
      <img v-if="icon && icon.url" :src="`https://getting-there-cms.onrender.com${icon.url}`" :alt="title" />
      <component v-else :is="fallbackIcon" />
    </span>
    <span class="resource-card__text">
      <strong>{{ title }}</strong>
      <span>{{ description }}</span>
    </span>
    <span class="resource-card__arrow" aria-hidden="true">→</span>
  </RouterLink>
</template>

<style scoped lang="scss">
.resource-card {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: var(--s-4);
  padding: var(--s-4) var(--s-5);
  background: var(--c-paper);
  border: 2px solid var(--c-ink);
  border-radius: var(--r-asym-a);
  box-shadow: 5px 5px 0 0 var(--c-ink);
  color: var(--c-ink);
  text-decoration: none;
  transition:
    transform var(--dur-fast) var(--ease-snap),
    box-shadow var(--dur-fast) var(--ease-snap);

  &:hover  { transform: translate(-3px, -3px); box-shadow: 8px 8px 0 0 var(--c-ink); }
  &:active { transform: translate(2px, 2px);   box-shadow: 0 0 0 0 var(--c-ink); }
  &:focus-visible { outline: 3px solid var(--c-cobalt); outline-offset: 3px; }

  &__icon {
    width: 56px; height: 56px;
    display: grid; place-items: center;
    border-radius: 50%;
    border: 2px solid var(--c-ink);
    background: var(--c-marigold);
    color: var(--c-ink);
    flex-shrink: 0;

    img, :deep(svg) {
      width: 32px; height: 32px;
      object-fit: contain;
      filter: brightness(0) invert(0);
    }

    &[data-tone='cobalt']   { background: var(--c-cobalt);   color: var(--c-cream); img,:deep(svg) { filter: brightness(0) invert(1); } }
    &[data-tone='fuchsia']  { background: var(--c-fuchsia);  color: var(--c-cream); img,:deep(svg) { filter: brightness(0) invert(1); } }
    &[data-tone='mint']     { background: var(--c-mint);     color: var(--c-ink); }
    &[data-tone='marigold'] { background: var(--c-marigold); color: var(--c-ink); }
  }

  &__text {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;

    strong {
      font-family: var(--font-display);
      font-weight: 700;
      font-size: var(--fs-lg);
      line-height: var(--lh-snug);
      color: var(--c-ink);
    }
    span {
      font-family: var(--font-body);
      font-size: var(--fs-sm);
      color: var(--c-text-muted);
      line-height: var(--lh-base);
    }
  }

  &__arrow {
    font-family: var(--font-display);
    font-size: 1.5rem;
    color: var(--c-cobalt);
    transition: transform var(--dur-base) var(--ease-snap);
  }

  &:hover &__arrow { transform: translateX(4px); }
}
</style>
