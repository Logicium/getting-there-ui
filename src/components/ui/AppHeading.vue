<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  level?: 1 | 2 | 3 | 4 | 5 | 6
  display?: boolean
  accent?: boolean
  align?: 'left' | 'center' | 'right'
  highlight?: 'marigold' | 'mint' | 'cobalt' | 'fuchsia' | 'none'
}>(), {
  level: 2,
  display: false,
  accent: false,
  align: 'left',
  highlight: 'none',
})

const tag = computed(() => `h${props.level}`)
const classes = computed(() => [
  'app-heading',
  `app-heading--lvl-${props.level}`,
  `app-heading--align-${props.align}`,
  {
    'app-heading--display': props.display,
    'app-heading--accent': props.accent,
  },
  props.highlight !== 'none' && `app-heading--hl-${props.highlight}`,
])
</script>

<template>
  <component :is="tag" :class="classes"><slot /></component>
</template>

<style scoped lang="scss">
.app-heading {
  font-family: var(--font-display);
  font-weight: 700;
  letter-spacing: var(--ls-tight);
  line-height: var(--lh-snug);
  color: var(--c-text);
  margin: 0;
}

.app-heading--accent  { font-family: var(--font-accent); font-weight: 400; letter-spacing: 0; }
.app-heading--display { line-height: var(--lh-tight); }

.app-heading--lvl-1 { font-size: var(--fs-5xl); }
.app-heading--lvl-2 { font-size: var(--fs-4xl); }
.app-heading--lvl-3 { font-size: var(--fs-3xl); }
.app-heading--lvl-4 { font-size: var(--fs-2xl); }
.app-heading--lvl-5 { font-size: var(--fs-xl); }
.app-heading--lvl-6 { font-size: var(--fs-lg); text-transform: uppercase; letter-spacing: var(--ls-wide); }

.app-heading--display.app-heading--lvl-1 { font-size: var(--fs-6xl); }

.app-heading--align-left   { text-align: left; }
.app-heading--align-center { text-align: center; }
.app-heading--align-right  { text-align: right; }

// Highlight (background swipe behind specific words via <em>)
.app-heading :deep(em) {
  font-style: normal;
  background: linear-gradient(180deg, transparent 60%, var(--c-marigold) 60%, var(--c-marigold) 90%, transparent 90%);
  padding: 0 0.15em;
  margin-inline: 0.1em;
}

.app-heading--hl-mint    :deep(em) { background: linear-gradient(180deg, transparent 60%, var(--c-mint) 60%, var(--c-mint) 90%, transparent 90%); }
.app-heading--hl-cobalt  :deep(em) { background: linear-gradient(180deg, transparent 60%, var(--c-cobalt-soft) 60%, var(--c-cobalt-soft) 90%, transparent 90%); }
.app-heading--hl-fuchsia :deep(em) { background: linear-gradient(180deg, transparent 60%, var(--c-fuchsia-soft) 60%, var(--c-fuchsia-soft) 90%, transparent 90%); }
</style>
