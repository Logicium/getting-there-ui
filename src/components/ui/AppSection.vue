<script setup lang="ts">
import { computed } from 'vue'

type Tone = 'cream' | 'cream-2' | 'paper' | 'ink' | 'cobalt' | 'marigold' | 'mint' | 'fuchsia'
type Pattern = 'none' | 'dots' | 'squiggle'

const props = withDefaults(defineProps<{
  tone?: Tone
  pattern?: Pattern
  bleed?: boolean
  pad?: 'sm' | 'md' | 'lg' | 'xl' | 'none'
  divider?: 'top' | 'bottom' | 'both' | 'none'
}>(), {
  tone: 'cream',
  pattern: 'none',
  bleed: false,
  pad: 'lg',
  divider: 'none',
})

const classes = computed(() => [
  'app-section',
  `app-section--tone-${props.tone}`,
  `app-section--pad-${props.pad}`,
  `app-section--pattern-${props.pattern}`,
  `app-section--div-${props.divider}`,
  { 'app-section--bleed': props.bleed },
])
</script>

<template>
  <section :class="classes">
    <div v-if="$slots.eyebrow || $slots.title || $slots.lede" class="app-section__heading">
      <div v-if="$slots.eyebrow" class="app-section__eyebrow"><slot name="eyebrow" /></div>
      <h2 v-if="$slots.title" class="app-section__title"><slot name="title" /></h2>
      <p v-if="$slots.lede" class="app-section__lede"><slot name="lede" /></p>
    </div>
    <slot />
  </section>
</template>

<style scoped lang="scss">
.app-section {
  position: relative;
  width: 100%;

  // Tones
  &--tone-cream    { background: var(--c-cream);   color: var(--c-text); }
  &--tone-cream-2  { background: var(--c-cream-2); color: var(--c-text); }
  &--tone-paper    { background: var(--c-paper);   color: var(--c-text); }
  &--tone-ink      { background: var(--c-ink);     color: var(--c-text-on-dark); }
  &--tone-cobalt   { background: var(--c-cobalt);  color: var(--c-text-on-dark); }
  &--tone-marigold { background: var(--c-marigold);color: var(--c-ink); }
  &--tone-mint     { background: var(--c-mint);    color: var(--c-ink); }
  &--tone-fuchsia  { background: var(--c-fuchsia); color: var(--c-cream); }

  // Padding
  &--pad-none { padding-block: 0; }
  &--pad-sm   { padding-block: var(--s-6); }
  &--pad-md   { padding-block: var(--s-8); }
  &--pad-lg   { padding-block: var(--s-9); }
  &--pad-xl   { padding-block: var(--s-10); }

  // Patterns (decorative overlay)
  &--pattern-dots::before,
  &--pattern-squiggle::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: 0.45;
  }

  &--pattern-dots::before {
    background-image: radial-gradient(currentColor 1.2px, transparent 1.2px);
    background-size: 22px 22px;
    opacity: 0.10;
  }

  &--pattern-squiggle::before {
    bottom: auto;
    height: 22px;
    background-repeat: repeat-x;
    background-size: 80px 14px;
    background-position: top left;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 14' fill='none' stroke='currentColor' stroke-width='2.6' stroke-linecap='round'><path d='M0 7 Q 10 0 20 7 T 40 7 T 60 7 T 80 7' /></svg>");
    opacity: 0.5;
  }

  // Dividers (top/bottom hard ink rules — editorial signature)
  &--div-top,    &--div-both { border-top:    3px solid var(--c-ink); }
  &--div-bottom, &--div-both { border-bottom: 3px solid var(--c-ink); }

  &__heading {
    max-width: var(--container-narrow);
    margin: 0 auto var(--s-7);
    padding: 0 var(--s-6);
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--s-3);
  }

  &__eyebrow {
    display: inline-flex;
    align-items: center;
    gap: var(--s-2);
    font-family: var(--font-body);
    font-size: var(--fs-xs);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: var(--ls-shout);
  }

  &__title {
    font-family: var(--font-display);
    font-weight: 700;
    line-height: var(--lh-tight);
    letter-spacing: var(--ls-tight);
    font-size: var(--fs-5xl);
    margin: 0;
  }

  &__lede {
    font-family: var(--font-body);
    font-size: var(--fs-lg);
    line-height: var(--lh-base);
    opacity: 0.85;
    margin: 0;
    max-width: 60ch;
  }
}
</style>
