<script setup lang="ts">
import { computed } from 'vue'

type Tone = 'ink' | 'cobalt' | 'marigold' | 'fuchsia' | 'mint' | 'plum' | 'cream'

const props = withDefaults(defineProps<{
  tone?: Tone
  filled?: boolean
  size?: 'sm' | 'md' | 'lg'
}>(), {
  tone: 'marigold',
  filled: true,
  size: 'md',
})

const classes = computed(() => [
  'app-badge',
  `app-badge--${props.tone}`,
  `app-badge--${props.size}`,
  { 'app-badge--outline': !props.filled },
])
</script>

<template>
  <span :class="classes"><slot /></span>
</template>

<style scoped lang="scss">
.app-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--s-1);
  font-family: var(--font-body);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: var(--ls-wide);
  border: 1.5px solid var(--c-ink);
  border-radius: var(--r-pill);
  line-height: 1;

  &--sm { padding: 0.25rem 0.65rem; font-size: 0.7rem; }
  &--md { padding: 0.35rem 0.85rem; font-size: var(--fs-xs); }
  &--lg { padding: 0.5rem 1.1rem;  font-size: var(--fs-sm); }

  &--ink      { background: var(--c-ink);      color: var(--c-cream); }
  &--cobalt   { background: var(--c-cobalt);   color: var(--c-cream); }
  &--marigold { background: var(--c-marigold); color: var(--c-ink); }
  &--fuchsia  { background: var(--c-fuchsia);  color: var(--c-cream); }
  &--mint     { background: var(--c-mint);     color: var(--c-ink); }
  &--plum     { background: var(--c-plum);     color: var(--c-cream); }
  &--cream    { background: var(--c-cream);    color: var(--c-ink); }

  &--outline {
    background: transparent !important;
    color: var(--c-ink) !important;
  }
}
</style>
