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

const isBestseller = computed(() => props.book.category === 'Best Seller');
const isNewRelease = computed(() => props.book.category === 'New Releases');
const badgeClass = computed(() => isBestseller.value ? 'bestseller-badge' : isNewRelease.value ? 'new-badge' : '');
const badgeText = computed(() => isBestseller.value ? 'Bestseller' : isNewRelease.value ? 'New Release' : '');

console.log('ProductCard - Book Category:', props.book.category);
console.log('ProductCard - isBestseller:', isBestseller.value);
console.log('ProductCard - isNewRelease:', isNewRelease.value);
console.log('ProductCard - badgeClass:', badgeClass.value);
console.log('ProductCard - badgeText:', badgeText.value);

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
      <div v-if="badgeClass" :class="badgeClass">{{ badgeText }}</div>
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

<style scoped>
.product-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.4s ease;
  position: relative;
  border: 1px solid var(--border-light);
}

.product-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
}

.product-image {
  height: 180px;
  background: var(--gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  position: relative;
  overflow: hidden;
}

.book-cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.3s ease;
}

.product-card:hover .book-cover-image {
  transform: scale(1.05);
}

.fallback-image {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.bestseller-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: var(--accent-color);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 700;
  z-index: 2;
}

.new-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: var(--success-color);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 700;
  z-index: 2;
}

.digital-only-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: var(--soft-blue);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 700;
}

.product-content {
  padding: 1.5rem;
}

.product-title {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--text-dark);
  line-height: 1.3;
}

.product-author {
  color: var(--primary-color);
  font-weight: 600;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
}

.product-description {
  color: var(--text-light);
  line-height: 1.5;
  margin-bottom: 1rem;
  font-size: 0.85rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-pricing {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: var(--bg-sage);
  border-radius: 10px;
  border: 1px solid var(--border-light);
}

.price-display {
  display: flex;
  flex-direction: column;
}

.price {
  font-size: 1.3rem;
  font-weight: 800;
  color: var(--primary-color);
}

.format-type {
  font-size: 0.75rem;
  color: var(--text-light);
  font-weight: 500;
}

.instant-access {
  font-size: 0.8rem;
  color: var(--primary-color);
  font-weight: 600;
  background: rgba(74, 124, 89, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
}

.product-footer {
  display: flex;
  gap: 0.75rem;
}

.add-to-cart-btn {
  flex: 2;
  background: var(--primary-color);
  color: white;
  padding: 0.75rem;
  border-radius: 20px;
  border: none;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-to-cart-btn:hover {
  background: var(--secondary-color);
  transform: translateY(-2px);
}

.quick-view-btn {
  flex: 1;
  background: transparent;
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
  padding: 0.75rem;
  border-radius: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.quick-view-btn:hover {
  background: var(--primary-color);
  color: white;
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .format-features {
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .product-footer {
    flex-direction: column;
  }

  .add-to-cart-btn, .quick-view-btn {
    flex: 1;
  }
}
</style>
