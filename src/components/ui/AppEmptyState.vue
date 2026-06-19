<script setup lang="ts">
type Variant = 'empty' | 'error'

withDefaults(defineProps<{
  variant?: Variant
  title?: string
  message?: string
}>(), {
  variant: 'empty',
  title: '',
  message: '',
})
</script>

<template>
  <div class="app-state" :class="[`app-state--${variant}`]" role="status">
    <div class="app-state__art" aria-hidden="true">
      <span v-if="variant === 'error'">!</span>
      <span v-else>○</span>
    </div>
    <h3 v-if="title || $slots.title" class="app-state__title">
      <slot name="title">{{ title }}</slot>
    </h3>
    <p v-if="message || $slots.default" class="app-state__message">
      <slot>{{ message }}</slot>
    </p>
    <div v-if="$slots.actions" class="app-state__actions"><slot name="actions" /></div>
  </div>
</template>

<style scoped lang="scss">
.app-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--s-8) var(--s-5);
  gap: var(--s-3);
  min-height: 280px;

  &__art {
    width: 84px; height: 84px;
    border-radius: 50%;
    border: 3px solid var(--c-ink);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 2.5rem;
    color: var(--c-ink);
    box-shadow: 5px 5px 0 0 var(--c-marigold);
    background: var(--c-paper);
    margin-bottom: var(--s-3);
  }

  &--error &__art {
    color: var(--c-cream);
    background: var(--c-fuchsia);
    box-shadow: 5px 5px 0 0 var(--c-ink);
  }

  &__title {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: var(--fs-2xl);
    line-height: var(--lh-snug);
    margin: 0;
    color: var(--c-ink);
  }

  &__message {
    font-family: var(--font-body);
    color: var(--c-text-muted);
    max-width: 50ch;
    margin: 0;
  }

  &__actions {
    margin-top: var(--s-4);
    display: flex;
    flex-wrap: wrap;
    gap: var(--s-3);
    justify-content: center;
  }
}
</style>
