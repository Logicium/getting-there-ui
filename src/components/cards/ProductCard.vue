<script setup lang="ts">
import { computed } from 'vue';
import type { BookData } from '@/data/data';

interface Props {
  book: BookData;
  addToCart: (bookId: string, target: HTMLElement) => void;
  showBookPreview: (bookId: string) => void;
  digitalOnly?: boolean;
}

const props = defineProps<Props>();

const isBestseller = computed(() => props.book.category.includes('bestseller'));
const isNewRelease = computed(() => props.book.category.includes('new'));
const badgeClass = computed(() => isBestseller.value ? 'bestseller-badge' : isNewRelease.value ? 'new-badge' : '');
const badgeText = computed(() => isBestseller.value ? 'Bestseller' : isNewRelease.value ? 'New Release' : '');

const handleAddToCart = (event: Event) => {
  props.addToCart(props.book.id, event.target as HTMLElement);
};

const handlePreview = () => {
  props.showBookPreview(props.book.id);
};
</script>

<template>
  <div class="product-card fade-in" :data-category="book.category.join(' ')">
    <div class="product-image">
      <div v-if="badgeClass" :class="badgeClass">{{ badgeText }}</div>
      {{ book.id.charAt(0).toUpperCase() }}📱
    </div>
    <div class="product-content">
      <h3 class="product-title">{{ book.title }}</h3>
      <p class="product-author">by {{ book.author }}</p>
      <p class="product-description">{{ book.description }}</p>

      <div class="product-format">
        <div class="format-option selected digital-format">
          <div class="format-title">📱 Digital Edition</div>
          <div class="format-price">${{ book.formats.digital.price.toFixed(2) }}</div>
          <div class="format-features">
            <span class="feature">✓ Instant Download</span>
            <span class="feature">✓ PDF & EPUB</span>
            <span class="feature">✓ Read Anywhere</span>
          </div>
        </div>
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
  height: 250px;
  background: var(--gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 4rem;
  position: relative;
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
  padding: 2rem;
}

.product-title {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--text-dark);
  line-height: 1.3;
}

.product-author {
  color: var(--primary-color);
  font-weight: 600;
  margin-bottom: 1rem;
}

.product-description {
  color: var(--text-light);
  line-height: 1.6;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.product-format {
  margin-bottom: 1.5rem;
}

.format-option {
  padding: 1.5rem;
  border: 2px solid var(--primary-color);
  border-radius: 15px;
  text-align: center;
  background: rgba(74, 124, 89, 0.05);
  transition: all 0.3s ease;
}

.digital-format:hover {
  background: rgba(74, 124, 89, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 5px 20px var(--shadow-light);
}

.format-title {
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: var(--text-dark);
  font-size: 1.1rem;
}

.format-price {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.format-delivery {
  font-size: 0.9rem;
  color: var(--text-light);
  margin-bottom: 1rem;
}

.format-features {
  display: flex;
  justify-content: space-around;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.feature {
  font-size: 0.8rem;
  color: var(--primary-color);
  font-weight: 500;
  background: rgba(74, 124, 89, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
}

.product-footer {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.add-to-cart-btn {
  flex: 2;
  background: var(--primary-color);
  color: white;
  padding: 1rem;
  border-radius: 25px;
  border: none;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px var(--shadow-light);
}

.add-to-cart-btn:hover {
  background: var(--secondary-color);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px var(--shadow-medium);
}

.quick-view-btn {
  flex: 1;
  background: transparent;
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
  padding: 1rem;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.quick-view-btn:hover {
  background: var(--primary-color);
  color: white;
}

.digital-benefits {
  text-align: center;
  padding-top: 1rem;
  border-top: 1px solid var(--border-light);
}

.benefit-text {
  margin: 0;
  font-size: 0.85rem;
  color: var(--text-light);
  font-weight: 500;
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