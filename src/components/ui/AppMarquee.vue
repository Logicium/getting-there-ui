<script setup lang="ts">
import { computed } from 'vue'

type Tone = 'ink' | 'cobalt' | 'marigold' | 'fuchsia' | 'mint' | 'cream'

const props = withDefaults(defineProps<{
  items?: string[]
  tone?: Tone
  speed?: number  // seconds per loop
  reverse?: boolean
}>(), {
  items: () => [],
  tone: 'marigold',
  speed: 28,
  reverse: false,
})

const style = computed(() => ({
  '--marquee-duration': `${props.speed}s`,
  '--marquee-direction': props.reverse ? 'reverse' : 'normal',
}))

const classes = computed(() => ['app-marquee', `app-marquee--${props.tone}`])

// Duplicate the list once to enable seamless loop scroll
const doubled = computed(() => [...props.items, ...props.items])
</script>

<template>
  <div :class="classes" :style="style" role="presentation">
    <div class="app-marquee__track">
      <span v-for="(item, i) in doubled" :key="i" class="app-marquee__item">
        <slot :item="item">{{ item }}</slot>
        <span class="app-marquee__star" aria-hidden="true">✷</span>
      </span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.app-marquee {
  --mq-bg: var(--c-marigold);
  --mq-fg: var(--c-ink);

  overflow: hidden;
  border-block: 3px solid var(--c-ink);
  background: var(--mq-bg);
  color: var(--mq-fg);
  padding-block: var(--s-3);

  &--ink      { --mq-bg: var(--c-ink);      --mq-fg: var(--c-cream); }
  &--cobalt   { --mq-bg: var(--c-cobalt);   --mq-fg: var(--c-cream); }
  &--marigold { --mq-bg: var(--c-marigold); --mq-fg: var(--c-ink); }
  &--fuchsia  { --mq-bg: var(--c-fuchsia);  --mq-fg: var(--c-cream); }
  &--mint     { --mq-bg: var(--c-mint);     --mq-fg: var(--c-ink); }
  &--cream    { --mq-bg: var(--c-cream);    --mq-fg: var(--c-ink); }

  &__track {
    display: flex;
    align-items: center;
    gap: var(--s-6);
    width: max-content;
    animation: marquee-slide var(--marquee-duration, 28s) linear infinite;
    animation-direction: var(--marquee-direction, normal);
    will-change: transform;
  }

  &__item {
    display: inline-flex;
    align-items: center;
    gap: var(--s-6);
    font-family: var(--font-display);
    font-weight: 700;
    font-style: italic;
    font-size: var(--fs-3xl);
    letter-spacing: var(--ls-tight);
    white-space: nowrap;
    text-transform: lowercase;
  }

  &__star {
    color: inherit;
    opacity: 0.65;
    font-size: 0.85em;
    font-style: normal;
  }

  @media (prefers-reduced-motion: reduce) {
    &__track { animation: none; }
  }
}
</style>
