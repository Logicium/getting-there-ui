<script setup lang="ts">
import { useId } from 'vue'

const props = withDefaults(defineProps<{
  label?: string
  hint?: string
  error?: string
  required?: boolean
  for?: string
}>(), {
  label: '',
  hint: '',
  error: '',
  required: false,
  for: '',
})

const autoId = useId()
const fieldId = props.for || `field-${autoId}`
</script>

<template>
  <div class="app-field" :class="{ 'is-invalid': !!error }">
    <label v-if="label" :for="fieldId" class="app-field__label">
      {{ label }}
      <span v-if="required" class="app-field__required" aria-hidden="true">*</span>
    </label>
    <slot :id="fieldId" />
    <p v-if="hint && !error" class="app-field__hint">{{ hint }}</p>
    <p v-if="error" class="app-field__error" role="alert">{{ error }}</p>
  </div>
</template>

<style scoped lang="scss">
.app-field {
  display: flex;
  flex-direction: column;
  gap: var(--s-2);

  &__label {
    font-family: var(--font-body);
    font-weight: 700;
    font-size: var(--fs-sm);
    color: var(--c-ink);
    text-transform: uppercase;
    letter-spacing: var(--ls-wide);
    display: inline-flex;
    align-items: center;
    gap: var(--s-1);
  }

  &__required { color: var(--c-fuchsia); }

  &__hint {
    margin: 0;
    font-size: var(--fs-sm);
    color: var(--c-text-muted);
  }

  &__error {
    margin: 0;
    font-size: var(--fs-sm);
    color: var(--c-fuchsia-deep);
    font-weight: 600;
  }
}
</style>
