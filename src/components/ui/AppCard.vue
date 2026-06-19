<script setup lang="ts">
import { computed } from 'vue'

type Variant = 'plaque' | 'ticket' | 'postcard' | 'flat'
type Tone = 'paper' | 'cream' | 'cream-2' | 'ink' | 'cobalt' | 'marigold' | 'mint' | 'fuchsia'
type ShadowTone = 'ink' | 'cobalt' | 'marigold' | 'fuchsia' | 'mint' | 'none'

const props = withDefaults(defineProps<{
  variant?: Variant
  tone?: Tone
  shadowTone?: ShadowTone
  to?: string | object
  href?: string
  interactive?: boolean
  pad?: 'sm' | 'md' | 'lg' | 'none'
}>(), {
  variant: 'plaque',
  tone: 'paper',
  shadowTone: 'ink',
  interactive: false,
  pad: 'md',
})

const tag = computed(() => (props.to ? 'router-link' : props.href ? 'a' : 'div'))

const classes = computed(() => [
  'app-card',
  `app-card--${props.variant}`,
  `app-card--tone-${props.tone}`,
  `app-card--shadow-${props.shadowTone}`,
  `app-card--pad-${props.pad}`,
  { 'app-card--interactive': props.interactive || !!props.to || !!props.href },
])
</script>

<template>
  <component :is="tag" :class="classes" :to="to" :href="href">
    <div v-if="$slots.media" class="app-card__media"><slot name="media" /></div>
    <div class="app-card__body">
      <div v-if="$slots.eyebrow" class="app-card__eyebrow"><slot name="eyebrow" /></div>
      <h3 v-if="$slots.title" class="app-card__title"><slot name="title" /></h3>
      <div class="app-card__content"><slot /></div>
      <div v-if="$slots.footer" class="app-card__footer"><slot name="footer" /></div>
    </div>
  </component>
</template>

<style scoped lang="scss">
.app-card {
  --card-bg: var(--c-paper);
  --card-fg: var(--c-text);
  --card-shadow: var(--c-ink);

  display: flex;
  flex-direction: column;
  position: relative;
  background: var(--card-bg);
  color: var(--card-fg);
  border: 2px solid var(--c-ink);
  text-decoration: none;
  overflow: hidden;
  transition:
    transform var(--dur-base) var(--ease-snap),
    box-shadow var(--dur-base) var(--ease-snap);

  // Variants (shape)
  &--plaque    { border-radius: var(--r-lg);   box-shadow: 6px 6px 0 0 var(--card-shadow); }
  &--ticket    { border-radius: var(--r-asym-a); box-shadow: 6px 6px 0 0 var(--card-shadow); }
  &--postcard  { border-radius: var(--r-asym-b); box-shadow: 8px 8px 0 0 var(--card-shadow); }
  &--flat      { border-radius: var(--r-md);   box-shadow: none; border-width: 1.5px; }

  // Tones
  &--tone-paper    { --card-bg: var(--c-paper);    --card-fg: var(--c-text); }
  &--tone-cream    { --card-bg: var(--c-cream);    --card-fg: var(--c-text); }
  &--tone-cream-2  { --card-bg: var(--c-cream-2);  --card-fg: var(--c-text); }
  &--tone-ink      { --card-bg: var(--c-ink);      --card-fg: var(--c-text-on-dark); }
  &--tone-cobalt   { --card-bg: var(--c-cobalt);   --card-fg: var(--c-text-on-dark); }
  &--tone-marigold { --card-bg: var(--c-marigold); --card-fg: var(--c-ink); }
  &--tone-mint     { --card-bg: var(--c-mint);     --card-fg: var(--c-ink); }
  &--tone-fuchsia  { --card-bg: var(--c-fuchsia);  --card-fg: var(--c-cream); }

  // Shadow color
  &--shadow-ink      { --card-shadow: var(--c-ink); }
  &--shadow-cobalt   { --card-shadow: var(--c-cobalt); }
  &--shadow-marigold { --card-shadow: var(--c-marigold-deep); }
  &--shadow-fuchsia  { --card-shadow: var(--c-fuchsia); }
  &--shadow-mint     { --card-shadow: var(--c-mint-deep); }
  &--shadow-none     { box-shadow: none !important; }

  // Padding (applied to body, not media)
  &__body { padding: var(--s-5); display: flex; flex-direction: column; gap: var(--s-3); flex: 1; }
  &--pad-none .app-card__body { padding: 0; }
  &--pad-sm   .app-card__body { padding: var(--s-4); }
  &--pad-md   .app-card__body { padding: var(--s-5); }
  &--pad-lg   .app-card__body { padding: var(--s-6) var(--s-6) var(--s-7); }

  &--interactive {
    cursor: pointer;
    &:hover  { transform: translate(-3px, -3px); box-shadow: 10px 10px 0 0 var(--card-shadow); }
    &:active { transform: translate(2px, 2px);  box-shadow: 0 0 0 0 var(--card-shadow); }
    &:focus-visible { outline: 3px solid var(--c-cobalt); outline-offset: 3px; }
  }

  &__media {
    position: relative;
    overflow: hidden;
    border-bottom: 2px solid var(--c-ink);
    background: var(--c-cream-2);

    :deep(img), :deep(video) {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform var(--dur-slow) var(--ease-out);
    }
  }

  &--interactive:hover .app-card__media :deep(img) { transform: scale(1.04); }

  &__eyebrow {
    display: inline-flex;
    align-items: center;
    gap: var(--s-2);
    font-family: var(--font-body);
    font-size: var(--fs-xs);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: var(--ls-shout);
    color: inherit;
  }

  &__title {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: var(--fs-2xl);
    line-height: var(--lh-snug);
    letter-spacing: var(--ls-tight);
    color: inherit;
    margin: 0;
  }

  &__content { color: inherit; line-height: var(--lh-base); }

  &__footer {
    margin-top: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--s-3);
    padding-top: var(--s-3);
    flex-wrap: wrap;
  }
}
</style>
