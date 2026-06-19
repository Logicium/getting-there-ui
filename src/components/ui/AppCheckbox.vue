<script setup lang="ts">
defineProps<{
  modelValue?: boolean
  disabled?: boolean
  id?: string
}>()

defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()
</script>

<template>
  <label class="app-checkbox" :class="{ 'is-disabled': disabled }">
    <input
      type="checkbox"
      class="app-checkbox__input"
      :checked="modelValue"
      :disabled="disabled"
      :id="id"
      @change="(e) => $emit('update:modelValue', (e.target as HTMLInputElement).checked)"
    />
    <span class="app-checkbox__box" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="5 13 10 18 19 7" />
      </svg>
    </span>
    <span class="app-checkbox__label"><slot /></span>
  </label>
</template>

<style scoped lang="scss">
.app-checkbox {
  display: inline-flex;
  align-items: center;
  gap: var(--s-3);
  cursor: pointer;
  font-family: var(--font-body);
  color: var(--c-ink);

  &__input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  &__box {
    width: 26px; height: 26px;
    display: inline-grid; place-items: center;
    background: var(--c-paper);
    border: 2px solid var(--c-ink);
    border-radius: var(--r-sm);
    color: var(--c-ink);
    transition: background var(--dur-fast), transform var(--dur-fast) var(--ease-snap);

    svg { opacity: 0; transform: scale(0.6); transition: opacity var(--dur-fast), transform var(--dur-fast) var(--ease-snap); }
  }

  &__input:checked + &__box {
    background: var(--c-marigold);
    svg { opacity: 1; transform: scale(1); }
  }

  &__input:focus-visible + &__box {
    box-shadow: 3px 3px 0 0 var(--c-cobalt);
    transform: translate(-1px, -1px);
  }

  &.is-disabled { opacity: 0.55; cursor: not-allowed; }
}
</style>
