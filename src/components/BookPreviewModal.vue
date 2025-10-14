<script setup lang="ts">
import ModalDialog from './ModalDialog.vue';
import type { BookData } from '@/data/data';

interface Props {
  isOpen: boolean;
  book: BookData | null;
}

interface Emits {
  (e: 'close'): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

const handleClose = () => emit('close');
</script>

<template>
  <ModalDialog
      :title="book?.title || 'Book Preview'"
      :isOpen="isOpen"
      size="medium"
      @close="handleClose"
  >
    <div v-if="book" class="therapy-book-preview">
      <div class="therapy-book-preview-image">
        <img v-if="book.imageUrl" :src="`https://getting-there-cms.onrender.com${book.imageUrl}`" alt="Book cover" class="book-cover-img" />
        <div v-else class="book-cover">📱</div>
        <div class="book-badges">
          <span v-if="book.category === 'Best Seller'" class="preview-badge bestseller">Bestseller</span>
          <span v-if="book.category === 'New Releases'" class="preview-badge new">New Release</span>
          <span class="preview-badge digital">Digital Only</span>
        </div>
      </div>
      <div class="therapy-book-details">
        <h3>{{ book.title }}</h3>
        <p class="book-author"><strong>by {{ book.author }}</strong></p>
        <p class="book-description">{{ book.fullDescription }}</p>

        <div class="therapy-book-specs">
          <h4>📋 Digital Book Information</h4>
          <div v-for="(value, key) in book.specs" :key="key" class="therapy-spec-item">
            <span class="therapy-spec-label">{{ key }}:</span>
            <span class="therapy-spec-value">{{ value }}</span>
          </div>
          <div class="therapy-spec-item">
            <span class="therapy-spec-label">Format:</span>
            <span class="therapy-spec-value">PDF, EPUB compatible</span>
          </div>
          <div class="therapy-spec-item">
            <span class="therapy-spec-label">Access:</span>
            <span class="therapy-spec-value">Instant download</span>
          </div>
        </div>

        <div class="therapy-content-warning">
          <h4>⚠️ Content Notice</h4>
          <p>This book addresses mental health topics and may include discussions of trauma, depression, or anxiety. Please read in a safe environment and consider having support available.</p>
        </div>
      </div>
    </div>
  </ModalDialog>
</template>

<style scoped lang="scss">
@import '@/assets/common.scss';

.therapy-book-preview {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.therapy-book-preview-image {
  position: relative;
  text-align: center;
}

.book-cover {
  width: 150px;
  height: 200px;
  background: var(--gradient);
  border-radius: 10px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  box-shadow: 0 10px 30px var(--shadow-light);
}

.book-cover-img {
  width: 150px;
  height: 200px;
  object-fit: cover;
  border-radius: 10px;
  margin: 0 auto;
  box-shadow: 0 10px 30px var(--shadow-light);
}

.book-badges {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-top: 1rem;
}

.preview-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;

  &.bestseller {
    background: var(--accent-color);
    color: white;
  }

  &.new {
    background: var(--success-color);
    color: white;
  }

  &.digital {
    background: var(--soft-blue);
    color: white;
  }
}

.therapy-book-details h3 {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--text-dark);
}

.book-author {
  color: var(--primary-color);
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.book-description {
  color: var(--text-light);
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.therapy-book-specs {
  background: var(--bg-light);
  padding: 1.5rem;
  border-radius: 12px;
  margin: 1.5rem 0;

  h4 {
    font-weight: 600;
    margin-bottom: 1rem;
    color: var(--text-dark);
  }
}

.therapy-spec-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.therapy-spec-label {
  color: var(--text-light);
}

.therapy-spec-value {
  font-weight: 600;
  color: var(--text-dark);
}

.therapy-content-warning {
  background: rgba(231, 111, 81, 0.1);
  padding: 1.5rem;
  border-radius: 12px;
  border-left: 4px solid var(--warning-color);

  h4 {
    color: var(--warning-color);
    margin-bottom: 0.75rem;
    font-size: 1rem;
  }

  p {
    margin: 0;
    color: var(--text-dark);
    font-size: 0.9rem;
    line-height: 1.5;
  }
}
</style>
