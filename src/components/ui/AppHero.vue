<script setup lang="ts">
import { computed } from 'vue'

type Variant = 'editorial' | 'magazine' | 'compact'
type Tone = 'cream' | 'cream-2' | 'ink' | 'cobalt' | 'marigold' | 'mint' | 'fuchsia'

const props = withDefaults(defineProps<{
  variant?: Variant
  tone?: Tone
  align?: 'left' | 'center'
  imageSrc?: string
  imageAlt?: string
}>(), {
  variant: 'editorial',
  tone: 'cream',
  align: 'left',
  imageSrc: '',
  imageAlt: '',
})

const classes = computed(() => [
  'app-hero',
  `app-hero--${props.variant}`,
  `app-hero--tone-${props.tone}`,
  `app-hero--align-${props.align}`,
])
</script>

<template>
  <header :class="classes">
    <div class="app-hero__shapes" aria-hidden="true">
      <span class="shape shape--marigold" />
      <span class="shape shape--cobalt" />
      <span class="shape shape--fuchsia" />
    </div>
    <div class="app-hero__inner">
      <div class="app-hero__text">
        <div v-if="$slots.eyebrow" class="app-hero__eyebrow"><slot name="eyebrow" /></div>
        <h1 v-if="$slots.title" class="app-hero__title"><slot name="title" /></h1>
        <p v-if="$slots.lede" class="app-hero__lede"><slot name="lede" /></p>
        <div v-if="$slots.actions" class="app-hero__actions"><slot name="actions" /></div>
        <div v-if="$slots.meta" class="app-hero__meta"><slot name="meta" /></div>
      </div>
      <div v-if="$slots.media || imageSrc" class="app-hero__media">
        <slot name="media">
          <img v-if="imageSrc" :src="imageSrc" :alt="imageAlt" />
        </slot>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.app-hero {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding-top: calc(var(--s-9) + 80px); // account for fixed Navbar
  padding-bottom: var(--s-9);
  padding-inline: var(--s-6);

  &--tone-cream    { background: var(--c-cream);   color: var(--c-text); }
  &--tone-cream-2  { background: var(--c-cream-2); color: var(--c-text); }
  &--tone-ink      { background: var(--c-ink);     color: var(--c-text-on-dark); }
  &--tone-cobalt   { background: var(--c-cobalt);  color: var(--c-text-on-dark); }
  &--tone-marigold { background: var(--c-marigold);color: var(--c-ink); }
  &--tone-mint     { background: var(--c-mint);    color: var(--c-ink); }
  &--tone-fuchsia  { background: var(--c-fuchsia); color: var(--c-cream); }

  &__inner {
    position: relative;
    z-index: 2;
    max-width: var(--container-max);
    margin: 0 auto;
    display: grid;
    gap: var(--s-7);
    align-items: center;
  }

  // Editorial = split layout w/ media on the right (asymmetric)
  &--editorial &__inner {
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
  }
  &--editorial.app-hero--align-center &__inner {
    grid-template-columns: minmax(0, 1fr);
    text-align: center;
    justify-items: center;
  }

  // Magazine = full-bleed, large display title
  &--magazine &__inner {
    grid-template-columns: minmax(0, 1fr);
    text-align: center;
    justify-items: center;
  }

  // Compact = page header style
  &--compact { padding-top: calc(var(--s-7) + 80px); padding-bottom: var(--s-7); }
  &--compact &__inner { grid-template-columns: minmax(0, 1fr); text-align: center; justify-items: center; }

  @media (max-width: 880px) {
    &--editorial &__inner { grid-template-columns: minmax(0, 1fr); text-align: center; justify-items: center; }
  }

  &__eyebrow {
    display: inline-flex;
    align-items: center;
    gap: var(--s-2);
    font-family: var(--font-body);
    font-size: var(--fs-xs);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: var(--ls-shout);
    margin-bottom: var(--s-4);
  }

  &__title {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: var(--fs-6xl);
    line-height: var(--lh-tight);
    letter-spacing: var(--ls-tight);
    margin: 0 0 var(--s-4);
    color: inherit;

    :deep(em) {
      font-style: italic;
      color: var(--c-fuchsia);
      font-family: var(--font-display);
    }
    :deep(strong) {
      font-style: normal;
      font-weight: 700;
      background: linear-gradient(180deg, transparent 62%, var(--c-marigold) 62%, var(--c-marigold) 92%, transparent 92%);
      padding: 0 0.1em;
    }
  }

  &--compact &__title { font-size: var(--fs-5xl); }

  &__lede {
    font-family: var(--font-body);
    font-size: var(--fs-lg);
    line-height: var(--lh-base);
    margin: 0 0 var(--s-6);
    max-width: 56ch;
    opacity: 0.85;
  }

  &--align-center &__lede { margin-inline: auto; }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--s-3);
    margin-bottom: var(--s-5);
  }
  &--align-center &__actions { justify-content: center; }

  &__meta {
    display: flex;
    flex-wrap: wrap;
    gap: var(--s-4);
    font-size: var(--fs-sm);
    color: inherit;
    opacity: 0.85;
  }

  &__media {
    position: relative;
    aspect-ratio: 4 / 5;
    border: 3px solid var(--c-ink);
    border-radius: var(--r-asym-c);
    overflow: hidden;
    box-shadow: 10px 10px 0 0 var(--c-ink);
    background: var(--c-cream-2);

    :deep(img), :deep(video) {
      width: 100%; height: 100%; object-fit: cover; display: block;
    }
  }

  // Playful background shapes (decorative)
  &__shapes {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 1;
    overflow: hidden;

    .shape {
      position: absolute;
      border-radius: 50%;
      filter: blur(0);
      opacity: 0.85;
    }

    .shape--marigold {
      width: 220px; height: 220px;
      background: var(--c-marigold);
      top: 12%; left: -90px;
      animation: float 14s var(--ease-in-out) infinite;
      mix-blend-mode: multiply;
      opacity: 0.55;
    }
    .shape--cobalt {
      width: 140px; height: 140px;
      background: var(--c-cobalt);
      bottom: 14%; right: 10%;
      border-radius: 38% 62% 56% 44% / 52% 36% 64% 48%;
      animation: drift 18s var(--ease-in-out) infinite;
      mix-blend-mode: multiply;
      opacity: 0.35;
    }
    .shape--fuchsia {
      width: 90px; height: 90px;
      background: var(--c-fuchsia);
      top: 32%; right: 32%;
      border-radius: 40% 60% 50% 50% / 50% 40% 60% 50%;
      animation: float 11s var(--ease-in-out) infinite reverse;
      mix-blend-mode: multiply;
      opacity: 0.5;
    }
  }

  &--tone-ink .__shapes .shape,
  &--tone-cobalt .__shapes .shape { mix-blend-mode: screen; }
}
</style>
