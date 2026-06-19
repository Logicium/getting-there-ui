<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  min?: number
  gap?: 'sm' | 'md' | 'lg'
  as?: string
}>(), {
  min: 280,
  gap: 'md',
  as: 'div',
})

const style = computed(() => ({ '--grid-min': `${props.min}px` }))
const classes = computed(() => ['app-grid', `app-grid--gap-${props.gap}`])
</script>

<template>
  <component :is="as" :class="classes" :style="style"><slot /></component>
</template>

<style scoped lang="scss">
.app-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--grid-min, 280px), 1fr));

  &--gap-sm { gap: var(--s-4); }
  &--gap-md { gap: var(--s-6); }
  &--gap-lg { gap: var(--s-7); }
}
</style>
