<script setup lang="ts">
type Tone = 'ink' | 'cobalt' | 'marigold' | 'fuchsia' | 'mint' | 'cream-2'

withDefaults(defineProps<{
  tone?: Tone
  size?: number
}>(), {
  tone: 'ink',
  size: 16,
})
</script>

<template>
  <div class="app-dots" :class="[`app-dots--${tone}`]" :style="{ '--dot-size': `${size}px` }" aria-hidden="true" />
</template>

<style scoped lang="scss">
.app-dots {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: radial-gradient(currentColor 1.4px, transparent 1.4px);
  background-size: var(--dot-size) var(--dot-size);
  opacity: 0.18;

  &--ink      { color: var(--c-ink); }
  &--cobalt   { color: var(--c-cobalt); }
  &--marigold { color: var(--c-marigold-deep); }
  &--fuchsia  { color: var(--c-fuchsia); }
  &--mint     { color: var(--c-mint-deep); }
  &--cream-2  { color: var(--c-cream-2); }
}
</style>
