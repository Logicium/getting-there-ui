<script setup lang="ts">
defineProps<{
  modelValue?: string
  placeholder?: string
  rows?: number
  required?: boolean
  disabled?: boolean
  id?: string
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<template>
  <textarea
    class="app-textarea"
    :value="modelValue"
    :placeholder="placeholder"
    :rows="rows || 4"
    :required="required"
    :disabled="disabled"
    :id="id"
    @input="(e) => $emit('update:modelValue', (e.target as HTMLTextAreaElement).value)"
  />
</template>

<style scoped lang="scss">
.app-textarea {
  font-family: var(--font-body);
  font-size: var(--fs-md);
  color: var(--c-ink);
  background: var(--c-paper);
  border: 2px solid var(--c-ink);
  border-radius: var(--r-md);
  padding: 0.75rem 1rem;
  width: 100%;
  resize: vertical;
  min-height: 120px;
  line-height: var(--lh-base);
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
