<script setup lang="ts">
import { computed } from 'vue'

type Tone = 'marigold' | 'cobalt' | 'fuchsia' | 'mint' | 'ink'

const props = withDefaults(defineProps<{ tone?: Tone }>(), { tone: 'marigold' })
const klass = computed(() => ['app-eyebrow', `app-eyebrow--${props.tone}`])
</script>

<template>
  <span :class="klass"><span class="app-eyebrow__dot" /><span class="app-eyebrow__label"><slot /></span></span>
</template>

<style scoped lang="scss">
.app-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: var(--s-2);
  font-family: var(--font-body);
  font-size: var(--fs-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: var(--ls-shout);
  color: var(--c-text);

  &__dot {
    width: 10px; height: 10px;
    border-radius: 999px;
    background: var(--c-marigold);
    box-shadow: 0 0 0 3px var(--c-marigold-soft);
  }
  &__label { line-height: 1; }

  &--marigold .app-eyebrow__dot { background: var(--c-marigold); box-shadow: 0 0 0 3px var(--c-marigold-soft); }
  &--cobalt   .app-eyebrow__dot { background: var(--c-cobalt);   box-shadow: 0 0 0 3px var(--c-cobalt-soft); }
  &--fuchsia  .app-eyebrow__dot { background: var(--c-fuchsia);  box-shadow: 0 0 0 3px var(--c-fuchsia-soft); }
  &--mint     .app-eyebrow__dot { background: var(--c-mint-deep);box-shadow: 0 0 0 3px var(--c-mint-soft); }
  &--ink      .app-eyebrow__dot { background: var(--c-ink);      box-shadow: 0 0 0 3px var(--c-cream-2); }
}
</style>
