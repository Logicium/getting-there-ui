<script setup lang="ts">
import { computed } from 'vue'

type Size = 'sm' | 'md' | 'lg'
type Tone = 'ink' | 'cobalt' | 'marigold' | 'mint' | 'fuchsia' | 'cream'

const props = withDefaults(defineProps<{
  size?: Size
  tone?: Tone
  label?: string
}>(), {
  size: 'md',
  tone: 'cobalt',
  label: 'Loading',
})

const classes = computed(() => ['app-spinner', `app-spinner--${props.size}`, `app-spinner--${props.tone}`])
</script>

<template>
  <span :class="classes" role="status" :aria-label="label">
    <span class="app-spinner__ring" aria-hidden="true" />
    <span class="u-sr-only">{{ label }}</span>
  </span>
</template>

<style scoped lang="scss">
.app-spinner {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  --sp-size: 32px;
  --sp-thick: 3px;
  --sp-color: var(--c-cobalt);

  &--sm { --sp-size: 18px; --sp-thick: 2.5px; }
  &--md { --sp-size: 32px; --sp-thick: 3px; }
  &--lg { --sp-size: 56px; --sp-thick: 4px; }

  &--ink      { --sp-color: var(--c-ink); }
  &--cobalt   { --sp-color: var(--c-cobalt); }
  &--marigold { --sp-color: var(--c-marigold-deep); }
  &--mint     { --sp-color: var(--c-mint-deep); }
  &--fuchsia  { --sp-color: var(--c-fuchsia); }
  &--cream    { --sp-color: var(--c-cream); }

  &__ring {
    width: var(--sp-size);
    height: var(--sp-size);
    border: var(--sp-thick) solid color-mix(in srgb, var(--sp-color) 22%, transparent);
    border-top-color: var(--sp-color);
    border-radius: 50%;
    animation: spin 0.75s linear infinite;
  }
}
</style>
