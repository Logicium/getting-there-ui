<script setup lang="ts">
type Tone = 'ink' | 'cobalt' | 'marigold' | 'fuchsia' | 'mint' | 'cream-2'

withDefaults(defineProps<{
  tone?: Tone
  height?: number
}>(), {
  tone: 'cobalt',
  height: 14,
})
</script>

<template>
  <svg
    class="app-squiggle"
    :class="[`app-squiggle--${tone}`]"
    :height="height"
    viewBox="0 0 80 14"
    preserveAspectRatio="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M0 7 Q 10 0 20 7 T 40 7 T 60 7 T 80 7"
      fill="none"
      stroke="currentColor"
      stroke-width="2.6"
      stroke-linecap="round"
    />
  </svg>
</template>

<style scoped lang="scss">
.app-squiggle {
  display: block;
  width: 100%;

  &--ink      { color: var(--c-ink); }
  &--cobalt   { color: var(--c-cobalt); }
  &--marigold { color: var(--c-marigold-deep); }
  &--fuchsia  { color: var(--c-fuchsia); }
  &--mint     { color: var(--c-mint-deep); }
  &--cream-2  { color: var(--c-cream-2); }
}
</style>
