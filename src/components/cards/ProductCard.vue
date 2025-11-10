<script setup lang="ts">
import { computed } from 'vue';
import type { BookData } from '@/data/data';

// Add base URL for image paths
const baseUrl = import.meta.env.VITE_CMS_URL || '';

interface Props {
  book: BookData;
  addToCart: (bookId: string, target: HTMLElement) => void;
  showBookPreview: (bookId: string) => void;
  digitalOnly?: boolean;
}

const props = defineProps<Props>();

// Category badge display logic
const categoryBadge = computed(() => {
  const category = props.book.category?.toLowerCase();
  switch(category) {
    case 'goals': return { text: 'Goals', class: 'category-goals' };
    case 'growth': return { text: 'Growth', class: 'category-growth' };
    case 'loss & grief': return { text: 'Loss & Grief', class: 'category-loss' };
    case 'fun': return { text: 'Fun', class: 'category-fun' };
    case 'happiness': return { text: 'Happiness', class: 'category-happiness' };
    default: return null;
  }
});

const handleAddToCart = (event: Event) => {
  props.addToCart(props.book.id, event.target as HTMLElement);
};

const handlePreview = () => {
  props.showBookPreview(props.book.id);
};
</script>

<template>
  <div class="product-card fade-in" :data-category="book.category">
    <div class="product-image">
      <div v-if="categoryBadge" :class="categoryBadge.class">{{ categoryBadge.text }}</div>
      <div v-if="book.imageUrl" class="blurred-background" :style="{ backgroundImage: `url('https://getting-there-cms.onrender.com${book.imageUrl}')` }"></div>
      <img v-if="book.imageUrl" :src="'https://getting-there-cms.onrender.com' + book.imageUrl" alt="Book cover" class="book-cover-image" />
      <div v-else class="fallback-image">{{ book.id.charAt(0).toUpperCase() }}📱</div>
    </div>
    <div class="product-content">
      <h3 class="product-title">{{ book.title }}</h3>
      <p class="product-author">by {{ book.author }}</p>
      <p class="product-description">{{ book.description }}</p>

      <div class="product-pricing">
        <div class="price-display">
          <span class="price">${{ book.formats.digital.price.toFixed(2) }}</span>
          <span class="format-type">Digital Edition</span>
        </div>
        <div class="instant-access">📱 Instant Download</div>
      </div>

      <div class="product-footer">
        <button class="add-to-cart-btn" @click="handleAddToCart">Add to Cart</button>
        <button class="quick-view-btn" @click="handlePreview">Preview</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/scss/mixins';
@import '@/assets/scss/variables';

.product-card {
  background: white;
  border-radius: $radius-xl;
  box-shadow: 0 8px 30px var(--shadow-light);
  border: 1px solid var(--border-light);
  transition: all $transition-slow ease;
  overflow: hidden;
  position: relative;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
  }
}

.product-image {
  height: 180px;
  background: var(--gradient);
  @include flex-center;
  color: white;
  font-size: $font-size-4xl;
  position: relative;
  overflow: hidden;
}

.blurred-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  filter: blur(15px);
  transform: scale(1.1); /* Prevent blur edges from showing */
  z-index: 1;
}

.book-cover-image {
  position: relative;
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
  z-index: 2;
  transition: transform $transition-normal;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);

  .product-card:hover & {
    transform: scale(1.05);
  }
}

.fallback-image {
  @include flex-center;
  width: 100%;
  height: 100%;
}

.bestseller-badge,
.new-badge,
.category-goals,
.category-growth,
.category-loss,
.category-fun,
.category-happiness {
  @include badge-base;
  position: absolute;
  top: $spacing-md;
  left: $spacing-md;
  color: white;
  z-index: 3;
}

.category-goals {
  background: var(--soft-blue);
}

.category-growth {
  background: var(--success-color);
}

.category-loss {
  background: var(--accent-color);
}

.category-fun {
  background: var(--lavender);
  color: var(--text-dark);
}

.category-happiness {
  background: var(--warning-color);
}

.digital-only-badge {
  @include badge-base;
  position: absolute;
  top: $spacing-md;
  right: $spacing-md;
  background: var(--soft-blue);
  color: white;
}

.product-content {
  padding: $spacing-lg;
}

.product-title {
  @include heading-small;
  margin-bottom: $spacing-sm;
  line-height: 1.3;
}

.product-author {
  color: var(--primary-color);
  font-weight: 600;
  margin-bottom: $spacing-sm;
  font-size: $font-size-sm;
}

.product-description {
  @include text-muted;
  margin-bottom: $spacing-md;
  font-size: $font-size-xs;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-pricing {
  @include flex-between;
  margin-bottom: $spacing-md;
  padding: $spacing-sm;
  background: var(--bg-sage);
  border-radius: $radius-md;
  border: 1px solid var(--border-light);
}

.price-display {
  @include flex-column($spacing-xs);
}

.price {
  font-size: $font-size-xl;
  font-weight: 800;
  color: var(--primary-color);
}

.format-type {
  font-size: $font-size-xs;
  color: var(--text-light);
  font-weight: 500;
}

.instant-access {
  font-size: $font-size-xs;
  color: var(--primary-color);
  font-weight: 600;
  background: rgba(74, 124, 89, 0.1);
  padding: $spacing-xs $spacing-sm;
  border-radius: $radius-sm;
}

.product-footer {
  @include flex-row($spacing-sm);
}

.add-to-cart-btn {
  @include button-primary;
  flex: 2;
  padding: $spacing-sm;
  font-size: $font-size-sm;
}

.quick-view-btn {
  flex: 1;
  @include button-base(transparent, var(--primary-color));
  border: 2px solid var(--primary-color);
  padding: $spacing-sm;
  font-size: $font-size-sm;

  &:hover {
    background: var(--primary-color);
    color: white;
  }
}

/* Mobile Responsiveness */
@include mobile-only {
  .format-features {
    flex-direction: column;
    align-items: center;
    gap: $spacing-sm;
  }

  .product-footer {
    flex-direction: column;
  }

  .add-to-cart-btn, .quick-view-btn {
    flex: 1;
  }
}
</style>
