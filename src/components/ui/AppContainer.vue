<script setup lang="ts">
import { computed } from 'vue'

type Size = 'sm' | 'md' | 'lg' | 'wide'

const props = withDefaults(defineProps<{
  as?: string
  size?: Size
  padded?: boolean
}>(), {
  as: 'div',
  size: 'md',
  padded: true,
})

const classes = computed(() => [
  'app-container',
  `app-container--${props.size}`,
  { 'app-container--padded': props.padded },
])
</script>

<template>
  <component :is="as" :class="classes"><slot /></component>
</template>

<style scoped lang="scss">
.app-container {
  margin-inline: auto;
  width: 100%;

  &--padded { padding-inline: var(--s-6); }

  &--sm   { max-width: 640px; }
  &--md   { max-width: var(--container-max); }
  &--lg   { max-width: var(--container-wide); }
  &--wide { max-width: 100%; }

  @media (max-width: 640px) {
    &--padded { padding-inline: var(--s-4); }
  }
}
</style>
