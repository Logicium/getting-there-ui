<script setup lang="ts">
import { computed } from 'vue'

type Tone = 'marigold' | 'cobalt' | 'mint' | 'fuchsia' | 'cream'

const props = withDefaults(defineProps<{
  tone?: Tone
  cite?: string
}>(), {
  tone: 'marigold',
  cite: '',
})

const klass = computed(() => ['app-quote', `app-quote--${props.tone}`])
</script>

<template>
  <figure :class="klass">
    <span class="app-quote__mark" aria-hidden="true">&ldquo;</span>
    <blockquote class="app-quote__body"><slot /></blockquote>
    <figcaption v-if="cite || $slots.cite" class="app-quote__cite">
      <slot name="cite">{{ cite }}</slot>
    </figcaption>
  </figure>
</template>

<style scoped lang="scss">
.app-quote {
  --q-bg: var(--c-marigold);
  --q-fg: var(--c-ink);

  position: relative;
  margin: var(--s-7) 0;
  padding: var(--s-7) var(--s-6) var(--s-6);
  background: var(--q-bg);
  color: var(--q-fg);
  border: 2.5px solid var(--c-ink);
  border-radius: var(--r-asym-c);
  box-shadow: 8px 8px 0 0 var(--c-ink);
  max-width: 64ch;

  &--marigold { --q-bg: var(--c-marigold); --q-fg: var(--c-ink); }
  &--cobalt   { --q-bg: var(--c-cobalt);   --q-fg: var(--c-cream); }
  &--mint     { --q-bg: var(--c-mint);     --q-fg: var(--c-ink); }
  &--fuchsia  { --q-bg: var(--c-fuchsia);  --q-fg: var(--c-cream); }
  &--cream    { --q-bg: var(--c-cream);    --q-fg: var(--c-ink); }

  &__mark {
    position: absolute;
    top: -28px;
    left: var(--s-6);
    font-family: var(--font-accent);
    font-size: 6rem;
    line-height: 1;
    color: var(--c-ink);
    text-shadow: 3px 3px 0 var(--c-cream);
  }

  &__body {
    font-family: var(--font-display);
    font-style: italic;
    font-size: var(--fs-2xl);
    line-height: var(--lh-snug);
    margin: 0;
    color: inherit;
  }

  &__cite {
    margin-top: var(--s-4);
    font-family: var(--font-body);
    font-size: var(--fs-sm);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: var(--ls-wide);
    color: inherit;
    opacity: 0.85;
  }
}
</style>
