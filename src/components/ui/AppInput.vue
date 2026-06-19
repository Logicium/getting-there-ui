<script setup lang="ts">
defineProps<{
  modelValue?: string | number
  type?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  id?: string
  autocomplete?: string
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<template>
  <input
    class="app-input"
    :type="type || 'text'"
    :value="modelValue"
    :placeholder="placeholder"
    :required="required"
    :disabled="disabled"
    :id="id"
    :autocomplete="autocomplete"
    @input="(e) => $emit('update:modelValue', (e.target as HTMLInputElement).value)"
  />
</template>

<style scoped lang="scss">
.app-input {
  font-family: var(--font-body);
  font-size: var(--fs-md);
  color: var(--c-ink);
  background: var(--c-paper);
  border: 2px solid var(--c-ink);
  border-radius: var(--r-md);
  padding: 0.75rem 1rem;
  width: 100%;
  transition:
    box-shadow var(--dur-fast) var(--ease-out),
    border-color var(--dur-fast) var(--ease-out),
    transform var(--dur-fast) var(--ease-snap);

  &::placeholder { color: var(--c-text-subtle); }

  &:focus-visible {
    outline: none;
    box-shadow: 4px 4px 0 0 var(--c-cobalt);
    transform: translate(-1px, -1px);
  }

  &:disabled { opacity: 0.55; cursor: not-allowed; }

  .app-field.is-invalid & {
    border-color: var(--c-fuchsia);
    box-shadow: 3px 3px 0 0 var(--c-fuchsia);
  }
}
</style>
