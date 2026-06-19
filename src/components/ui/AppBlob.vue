<script setup lang="ts">
type Tone = 'marigold' | 'cobalt' | 'fuchsia' | 'mint' | 'cream-2'

withDefaults(defineProps<{
  tone?: Tone
  size?: number
  spin?: boolean
}>(), {
  tone: 'marigold',
  size: 240,
  spin: false,
})
</script>

<template>
  <svg
    class="app-blob"
    :class="[`app-blob--${tone}`, { 'app-blob--spin': spin }]"
    :width="size"
    :height="size"
    viewBox="0 0 200 200"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M44.7,-58.3C57.7,-49.8,67.6,-35.5,72.3,-19.5C77,-3.5,76.5,14.2,69.3,28.4C62.1,42.5,48.3,53.2,33.2,59.7C18.1,66.2,1.7,68.6,-13.5,65.7C-28.8,62.7,-43,54.4,-54,42.2C-65,30,-72.8,13.9,-72.5,-2.1C-72.2,-18,-63.9,-33.8,-52.2,-43.5C-40.5,-53.2,-25.4,-56.8,-9.6,-58.6C6.2,-60.4,12.4,-60.4,20.7,-60.4C29,-60.4,31.7,-66.8,44.7,-58.3Z"
      transform="translate(100 100)"
    />
  </svg>
</template>

<style scoped lang="scss">
.app-blob {
  display: block;

  &--marigold { fill: var(--c-marigold); }
  &--cobalt   { fill: var(--c-cobalt); }
  &--fuchsia  { fill: var(--c-fuchsia); }
  &--mint     { fill: var(--c-mint); }
  &--cream-2  { fill: var(--c-cream-2); }

  &--spin {
    animation: float 14s var(--ease-in-out) infinite;
  }
}
</style>
