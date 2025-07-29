<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';

interface Props {
  title: string;
  isOpen: boolean;
  size?: 'small' | 'medium' | 'large';
}

const props = defineProps<Props>();
const emit = defineEmits(['close']);

const modalRef = ref<HTMLElement | null>(null);

const closeModal = () => {
  emit('close');
};

const handleEscapeKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.isOpen) {
    closeModal();
  }
};

const handleClickOutside = (e: MouseEvent) => {
  if (modalRef.value && e.target === modalRef.value) {
    closeModal();
  }
};

watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'auto';
  }
});

onMounted(() => {
  document.addEventListener('keydown', handleEscapeKey);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscapeKey);
  document.body.style.overflow = 'auto';
});
</script>

<template>
  <div 
    v-if="isOpen" 
    class="modal-overlay" 
    :class="[size ? `modal-${size}` : 'modal-medium']"
    ref="modalRef"
    @click="handleClickOutside"
  >
    <div class="modal-content">
      <div class="modal-header">
        <h3 class="modal-title">{{ title }}</h3>
        <button class="close-modal" @click="closeModal">&times;</button>
      </div>
      <div class="modal-body">
        <slot></slot>
      </div>
      <div class="modal-footer" v-if="$slots.footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  z-index: 2000;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  width: 90%;
  max-height: 90vh;
  position: relative;
  display: flex;
  flex-direction: column;
}

.modal-small .modal-content {
  max-width: 500px;
}

.modal-medium .modal-content {
  max-width: 700px;
}

.modal-large .modal-content {
  max-width: 900px;
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text-dark);
  margin: 0;
}

.close-modal {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-light);
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    max-height: 95vh;
  }
}
</style>