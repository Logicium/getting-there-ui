<script setup lang="ts">
defineProps<{
  modelValue?: string | number
  required?: boolean
  disabled?: boolean
  id?: string
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<template>
  <div class="app-select">
    <select
      class="app-select__field"
      :value="modelValue"
      :required="required"
      :disabled="disabled"
      :id="id"
      @change="(e) => $emit('update:modelValue', (e.target as HTMLSelectElement).value)"
    >
      <slot />
    </select>
    <span class="app-select__chev" aria-hidden="true">▾</span>
  </div>
</template>

<style scoped lang="scss">
.app-select {
  position: relative;

  &__field {
    appearance: none;
    width: 100%;
    font-family: var(--font-body);
    font-size: var(--fs-md);
    color: var(--c-ink);
    background: var(--c-paper);
    border: 2px solid var(--c-ink);
    border-radius: var(--r-md);
    padding: 0.75rem 2.5rem 0.75rem 1rem;
    cursor: pointer;
    transition:
      box-shadow var(--dur-fast) var(--ease-out),
      transform var(--dur-fast) var(--ease-snap);

    &:focus-visible {
      outline: none;
      box-shadow: 4px 4px 0 0 var(--c-cobalt);
      transform: translate(-1px, -1px);
    }

    &:disabled { opacity: 0.55; cursor: not-allowed; }
  }

  &__chev {
    position: absolute;
    top: 50%;
    right: 1rem;
    transform: translateY(-50%);
    color: var(--c-ink);
    pointer-events: none;
    font-size: var(--fs-lg);
  }

  .app-field.is-invalid & &__field {
    border-color: var(--c-fuchsia);
    box-shadow: 3px 3px 0 0 var(--c-fuchsia);
  }
}
</style>
