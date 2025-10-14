<script setup lang="ts">
import type { CartItem } from '@/types/store';
import { formatPrice } from '@/utils/formatUtils';

interface Props {
  isOpen: boolean;
  cart: CartItem[];
  cartTotal: number;
}

interface Emits {
  (e: 'close'): void;
  (e: 'remove', index: number): void;
  (e: 'checkout'): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

const handleClose = () => emit('close');
const handleRemove = (index: number) => emit('remove', index);
const handleCheckout = () => emit('checkout');
</script>

<template>
  <div class="therapy-cart-overlay" :class="{ active: isOpen }" @click="handleClose"></div>
  <div class="therapy-cart-sidebar" :class="{ open: isOpen }">
    <div class="therapy-cart-header">
      <h3 class="therapy-cart-title">Your Digital Library</h3>
      <button class="therapy-close-cart" @click="handleClose">&times;</button>
    </div>

    <div class="therapy-cart-items">
      <div v-if="cart.length === 0" class="therapy-empty-cart">
        <div class="empty-cart-icon">📱</div>
        <p>Your digital library is empty</p>
        <p>Add some books to begin your journey!</p>
      </div>

      <div v-else>
        <div v-for="(item, index) in cart" :key="item.id" class="therapy-cart-item">
          <div class="therapy-cart-item-image">
            <img v-if="item.imageUrl" :src="`https://getting-there-cms.onrender.com${item.imageUrl}`" alt="Book cover" class="cart-item-cover" />
            <div v-else class="cart-item-fallback">📱</div>
          </div>
          <div class="therapy-cart-item-details">
            <div class="therapy-cart-item-title">{{ item.title }}</div>
            <div class="therapy-cart-item-format">{{ item.format }}</div>
            <div class="therapy-cart-item-price">{{ formatPrice(item.price) }}</div>
          </div>
          <button class="therapy-cart-item-remove" @click="handleRemove(index)">×</button>
        </div>
      </div>
    </div>

    <div v-if="cart.length > 0" class="therapy-cart-footer">
      <div class="therapy-cart-total">
        <span>Total Investment: </span>
        <span>{{ formatPrice(cartTotal) }}</span>
      </div>
      <button class="therapy-checkout-btn" @click="handleCheckout">Proceed to Checkout</button>
      <p class="therapy-cart-note">📱 Instant download • 30-day money-back guarantee</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/common.scss';

.therapy-cart-sidebar {
  position: fixed;
  top: 0;
  right: -420px;
  width: 420px;
  height: 100vh;
  background: white;
  box-shadow: -10px 0 30px var(--shadow-medium);
  z-index: 2000;
  transition: right 0.3s ease;
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  &.open {
    right: 0;
  }

  @media (max-width: 768px) {
    width: 100%;
    right: -100%;
  }
}

.therapy-cart-header {
  padding: 2rem;
  border-bottom: 1px solid var(--border-light);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--bg-sage);
}

.therapy-cart-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-dark);
  margin: 0;
}

.therapy-close-cart {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-light);
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;

  &:hover {
    background: var(--primary-color);
    color: white;
  }
}

.therapy-cart-items {
  padding: 2rem;
  flex: 1;
  overflow-y: auto;
}

.therapy-cart-item {
  display: flex;
  gap: 1rem;
  padding: 1.5rem 0;
  border-bottom: 1px solid var(--border-light);
  align-items: center;

  &:last-child {
    border-bottom: none;
  }
}

.therapy-cart-item-image {
  width: 60px;
  height: 80px;
  background: var(--gradient);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  overflow: hidden;
}

.cart-item-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cart-item-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.therapy-cart-item-details {
  flex: 1;
}

.therapy-cart-item-title {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-dark);
  line-height: 1.3;
}

.therapy-cart-item-format {
  font-size: 0.9rem;
  color: var(--text-light);
  margin-bottom: 0.5rem;
}

.therapy-cart-item-price {
  font-weight: 700;
  color: var(--primary-color);
  font-size: 1.1rem;
}

.therapy-cart-item-remove {
  background: none;
  border: none;
  color: var(--warning-color);
  cursor: pointer;
  font-size: 1.5rem;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(231, 111, 81, 0.1);
  }
}

.therapy-cart-footer {
  padding: 2rem;
  border-top: 1px solid var(--border-light);
  background: var(--bg-light);
}

.therapy-cart-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text-dark);
}

.therapy-checkout-btn {
  width: 100%;
  background: var(--primary-color);
  color: white;
  padding: 1rem 2rem;
  border-radius: 25px;
  border: none;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.1rem;
  margin-bottom: 1rem;

  &:hover {
    background: var(--secondary-color);
    transform: translateY(-2px);
  }
}

.therapy-cart-note {
  text-align: center;
  color: var(--text-light);
  font-size: 0.9rem;
  margin: 0;
}

.therapy-empty-cart {
  text-align: center;
  padding: 3rem 2rem;
  color: var(--text-light);
}

.empty-cart-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.therapy-cart-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1500;

  &.active {
    display: block;
  }
}
</style>
