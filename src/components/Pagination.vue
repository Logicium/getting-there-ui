<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  maxVisiblePages?: number;
}

const props = withDefaults(defineProps<Props>(), {
  maxVisiblePages: 5
});

const emit = defineEmits<{
  (e: 'page-change', page: number): void;
}>();

// Computed properties
const totalPages = computed(() => Math.ceil(props.totalItems / props.itemsPerPage));

const visiblePages = computed(() => {
  const pages: (number | string)[] = [];
  const total = totalPages.value;
  const current = props.currentPage;
  const max = props.maxVisiblePages;

  if (total <= max) {
    // Show all pages if total is less than max
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    // Always show first page
    pages.push(1);

    // Calculate start and end of visible page range
    const halfMax = Math.floor((max - 2) / 2);
    let start = Math.max(2, current - halfMax);
    let end = Math.min(total - 1, current + halfMax);

    // Adjust if we're near the start or end
    if (current <= halfMax + 1) {
      end = max - 1;
    }
    if (current >= total - halfMax) {
      start = total - max + 2;
    }

    // Add ellipsis after first page if needed
    if (start > 2) {
      pages.push('...');
    }

    // Add visible page numbers
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Add ellipsis before last page if needed
    if (end < total - 1) {
      pages.push('...');
    }

    // Always show last page
    pages.push(total);
  }

  return pages;
});

const canGoPrevious = computed(() => props.currentPage > 1);
const canGoNext = computed(() => props.currentPage < totalPages.value);

// Methods
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value && page !== props.currentPage) {
    emit('page-change', page);
  }
};

const previousPage = () => {
  if (canGoPrevious.value) {
    goToPage(props.currentPage - 1);
  }
};

const nextPage = () => {
  if (canGoNext.value) {
    goToPage(props.currentPage + 1);
  }
};
</script>

<template>
  <nav class="pagination" v-if="totalPages > 1">
    <button
      class="pagination-button pagination-arrow"
      :class="{ disabled: !canGoPrevious }"
      :disabled="!canGoPrevious"
      @click="previousPage"
      aria-label="Previous page"
    >
      ‹
    </button>

    <button
      v-for="(page, index) in visiblePages"
      :key="index"
      class="pagination-button"
      :class="{ active: page === currentPage, ellipsis: page === '...' }"
      :disabled="page === '...'"
      @click="typeof page === 'number' ? goToPage(page) : null"
    >
      {{ page }}
    </button>

    <button
      class="pagination-button pagination-arrow"
      :class="{ disabled: !canGoNext }"
      :disabled="!canGoNext"
      @click="nextPage"
      aria-label="Next page"
    >
      ›
    </button>
  </nav>
</template>

<style scoped lang="scss">
@import '@/assets/scss/variables';
@import '@/assets/scss/mixins';

.pagination {
  @include flex-row($spacing-sm);
  justify-content: center;
  align-items: center;
  margin: $spacing-2xl 0;
  flex-wrap: wrap;
}

.pagination-button {
  min-width: 40px;
  height: 40px;
  padding: $spacing-xs $spacing-sm;
  border: 1px solid var(--border-color, #e0e0e0);
  background: white;
  color: var(--text-primary, #333);
  font-size: $font-size-md;
  font-weight: 500;
  border-radius: $radius-sm;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover:not(.disabled):not(.ellipsis) {
    background: var(--primary-color, #4a7c59);
    color: white;
    border-color: var(--primary-color, #4a7c59);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(74, 124, 89, 0.2);
  }

  &.active {
    background: var(--primary-color, #4a7c59);
    color: white;
    border-color: var(--primary-color, #4a7c59);
    font-weight: 600;
  }

  &.disabled {
    opacity: 0.4;
    cursor: not-allowed;
    pointer-events: none;
  }

  &.ellipsis {
    border: none;
    background: transparent;
    cursor: default;
    pointer-events: none;
    
    &:hover {
      background: transparent;
      transform: none;
      box-shadow: none;
    }
  }

  &.pagination-arrow {
    font-size: $font-size-xl;
    font-weight: 700;
    padding: $spacing-xs $spacing-md;
  }
}

@include mobile-only {
  .pagination {
    gap: $spacing-xs;
  }

  .pagination-button {
    min-width: 36px;
    height: 36px;
    padding: $spacing-xs;
    font-size: $font-size-sm;
  }
}
</style>
