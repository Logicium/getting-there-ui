<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

type Variant = 'primary' | 'accent' | 'secondary' | 'ghost' | 'ink' | 'playful'
type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(defineProps<{
  variant?: Variant
  size?: Size
  to?: string | object
  href?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  block?: boolean
  square?: boolean
}>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
  loading: false,
  block: false,
  square: false,
})

const emit = defineEmits<{ (e: 'click', ev: MouseEvent): void }>()

const tag = computed(() => (props.to ? 'router-link' : props.href ? 'a' : 'button'))

const classes = computed(() => [
  'app-btn',
  `app-btn--${props.variant}`,
  `app-btn--${props.size}`,
  {
    'app-btn--block': props.block,
    'app-btn--square': props.square,
    'is-loading': props.loading,
    'is-disabled': props.disabled,
  },
])
</script>

<template>
  <component
    :is="tag"
    :class="classes"
    :to="to"
    :href="href"
    :type="tag === 'button' ? type : undefined"
    :disabled="tag === 'button' ? disabled || loading : undefined"
    :aria-busy="loading || undefined"
    :aria-disabled="disabled || undefined"
    @click="(e: MouseEvent) => emit('click', e)"
  >
    <span v-if="$slots.leading" class="app-btn__icon"><slot name="leading" /></span>
    <span class="app-btn__label"><slot /></span>
    <span v-if="$slots.trailing" class="app-btn__icon"><slot name="trailing" /></span>
    <span v-if="loading" class="app-btn__spinner" aria-hidden="true"></span>
  </component>
</template>

<style scoped lang="scss">
.app-btn {
  --btn-bg: var(--c-marigold);
  --btn-fg: var(--c-ink);
  --btn-bg-hover: var(--c-marigold-deep);
  --btn-shadow: var(--c-ink);

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--s-2);
  font-family: var(--font-body);
  font-weight: 700;
  letter-spacing: 0.01em;
  line-height: 1.1;
  text-decoration: none;
  cursor: pointer;
  background: var(--btn-bg);
  color: var(--btn-fg);
  border: 2px solid var(--c-ink);
  border-radius: var(--r-pill);
  box-shadow: 4px 4px 0 0 var(--btn-shadow);
  transition:
    transform var(--dur-fast) var(--ease-snap),
    box-shadow var(--dur-fast) var(--ease-snap),
    background var(--dur-fast) var(--ease-out),
    color var(--dur-fast) var(--ease-out);

  &:hover:not(.is-disabled):not(.is-loading) {
    transform: translate(-2px, -2px);
    box-shadow: 7px 7px 0 0 var(--btn-shadow);
    background: var(--btn-bg-hover);
  }

  &:active:not(.is-disabled):not(.is-loading) {
    transform: translate(2px, 2px);
    box-shadow: 0 0 0 0 var(--btn-shadow);
  }

  &:focus-visible {
    outline: 3px solid var(--c-cobalt);
    outline-offset: 3px;
  }

  &.is-disabled, &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  &.is-loading {
    cursor: progress;
    .app-btn__label { opacity: 0.55; }
  }

  &--block { width: 100%; }

  &--square { border-radius: var(--r-md); }

  // ---- Sizes ----
  &--sm { padding: 0.5rem 1rem;   font-size: var(--fs-sm); box-shadow: 3px 3px 0 0 var(--btn-shadow); }
  &--md { padding: 0.85rem 1.6rem; font-size: var(--fs-md); }
  &--lg { padding: 1.1rem 2rem;   font-size: var(--fs-lg); box-shadow: 6px 6px 0 0 var(--btn-shadow); }

  // ---- Variants ----
  &--primary {
    --btn-bg: var(--c-marigold);
    --btn-fg: var(--c-ink);
    --btn-bg-hover: var(--c-marigold-deep);
  }
  &--accent {
    --btn-bg: var(--c-cobalt);
    --btn-fg: var(--c-cream);
    --btn-bg-hover: var(--c-cobalt-deep);
  }
  &--secondary {
    --btn-bg: var(--c-cream);
    --btn-fg: var(--c-ink);
    --btn-bg-hover: var(--c-cream-2);
  }
  &--ghost {
    --btn-bg: transparent;
    --btn-fg: var(--c-ink);
    --btn-bg-hover: var(--c-cream);
    border-color: var(--c-ink);
    box-shadow: none;
    &:hover:not(.is-disabled):not(.is-loading) { transform: none; box-shadow: 4px 4px 0 0 var(--c-ink); }
  }
  &--ink {
    --btn-bg: var(--c-ink);
    --btn-fg: var(--c-cream);
    --btn-bg-hover: var(--c-cobalt);
    --btn-shadow: var(--c-marigold);
  }
  &--playful {
    --btn-bg: var(--c-fuchsia);
    --btn-fg: var(--c-cream);
    --btn-bg-hover: var(--c-fuchsia-deep);
    font-family: var(--font-accent);
    letter-spacing: 0.02em;
  }

  &__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 0;
  }

  &__label { line-height: 1.1; }

  &__spinner {
    width: 14px; height: 14px;
    border: 2px solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
}
</style>
