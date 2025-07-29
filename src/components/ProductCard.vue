<script setup lang="ts">
import { computed, ref } from 'vue';
import type { BookData } from '@/data/data';

interface Props {
  book: BookData;
  addToCart: (bookId: string, target: HTMLElement) => void;
  showBookPreview: (bookId: string) => void;
}

const props = defineProps<Props>();

const selectedFormat = ref('digital');

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

const selectFormat = (format: string) => {
  selectedFormat.value = format;
};
</script>

<template>
  <div class="product-card fade-in" :data-category="book.category.join(' ')">
    <div class="product-image">
      <div v-if="badgeClass" :class="badgeClass">{{ badgeText }}</div>
      {{ book.id.charAt(0).toUpperCase() }}📚
    </div>
    <div class="product-content">
      <h3 class="product-title">{{ book.title }}</h3>
      <p class="product-author">by {{ book.author }}</p>
      <p class="product-description">{{ book.description }}</p>

      <div class="product-format">
        <div 
          class="format-option" 
          :class="{ selected: selectedFormat === 'digital' }"
          @click="selectFormat('digital')"
          data-format="digital"
          :data-price="book.formats.digital.price"
        >
          <div class="format-title">Digital Edition</div>
          <div class="format-price">${{ book.formats.digital.price.toFixed(2) }}</div>
          <div class="format-delivery">{{ book.formats.digital.delivery }}</div>
        </div>
        <div 
          class="format-option" 
          :class="{ selected: selectedFormat === 'print' }"
          @click="selectFormat('print')"
          data-format="print"
          :data-price="book.formats.print.price"
        >
          <div class="format-title">Print Edition</div>
          <div class="format-price">${{ book.formats.print.price.toFixed(2) }}</div>
          <div class="format-delivery">{{ book.formats.print.delivery }}</div>
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
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.format-option {
  flex: 1;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.format-option:hover, .format-option.selected {
  border-color: var(--primary-color);
  background: rgba(37, 99, 235, 0.05);
}

.format-title {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-dark);
}

.format-price {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--primary-color);
}

.format-delivery {
  font-size: 0.8rem;
  color: var(--text-light);
  margin-top: 0.25rem;
}

.product-footer {
  display: flex;
  gap: 1rem;
}

.add-to-cart-btn {
  flex: 1;
  background: var(--primary-color);
  color: white;
  padding: 1rem;
  border-radius: 25px;
  border: none;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-to-cart-btn:hover {
  background: var(--secondary-color);
  transform: translateY(-2px);
}

.quick-view-btn {
  background: transparent;
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
  padding: 1rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.quick-view-btn:hover {
  background: var(--primary-color);
  color: white;
}
</style>