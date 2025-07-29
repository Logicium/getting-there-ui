<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { books, bookCategories, heroSections } from '@/data/data';
import ProductCard from '@/components/ProductCard.vue';
import FilterSection from '@/components/FilterSection.vue';
import ModalDialog from '@/components/ModalDialog.vue';

// Book filtering state
const currentFilter = ref('all');

// Cart state
interface CartItem {
  id: string;
  bookId: string;
  title: string;
  format: string;
  price: number;
}

const cart = ref<CartItem[]>([]);
const cartOpen = ref(false);

// Modal state
const bookModalOpen = ref(false);
const currentBookId = ref('');

// Computed properties
const currentBook = computed(() => {
  if (!currentBookId.value) return null;
  return books[currentBookId.value];
});

const filteredBooks = computed(() => {
  return Object.values(books).filter(book => {
    return currentFilter.value === 'all' || book.category.includes(currentFilter.value);
  });
});

const cartCount = computed(() => cart.value.length);

const cartTotal = computed(() => {
  return cart.value.reduce((sum, item) => sum + item.price, 0);
});

// Event handlers
const handleFilter = (filter: string) => {
  currentFilter.value = filter;
};

const addToCart = (bookId: string, button: HTMLElement) => {
  const book = books[bookId];
  if (!book) return;
  
  // Get the selected format from the product card
  const productCard = button.closest('.product-card') as HTMLElement;
  if (!productCard) return;
  
  const selectedFormat = productCard.querySelector('.format-option.selected') as HTMLElement;
  if (!selectedFormat) return;
  
  const format = selectedFormat.dataset.format || 'digital';
  const price = format === 'digital' ? book.formats.digital.price : book.formats.print.price;
  
  const cartItem: CartItem = {
    id: bookId + '-' + format,
    bookId: bookId,
    title: book.title,
    format: format === 'digital' ? 'Digital Edition' : 'Print Edition',
    price: price
  };
  
  // Check if item already exists in cart
  const existingItemIndex = cart.value.findIndex(item => item.id === cartItem.id);
  if (existingItemIndex === -1) {
    cart.value.push(cartItem);
    showAddedToCartFeedback(button);
  } else {
    alert('This item is already in your cart!');
  }
};

const showAddedToCartFeedback = (button: HTMLElement) => {
  const originalText = button.textContent;
  button.textContent = 'Added! ✓';
  button.style.background = 'var(--success-color)';
  
  setTimeout(() => {
    button.textContent = originalText;
    button.style.background = 'var(--primary-color)';
  }, 1500);
};

const removeFromCart = (index: number) => {
  cart.value.splice(index, 1);
};

const openCart = () => {
  cartOpen.value = true;
};

const closeCart = () => {
  cartOpen.value = false;
};

const checkout = () => {
  if (cart.value.length === 0) return;
  
  const total = cartTotal.value;
  alert(`Checkout functionality would integrate with payment processor here.\n\nOrder Summary:\n${cart.value.map(item => `• ${item.title} (${item.format}) - $${item.price.toFixed(2)}`).join('\n')}\n\nTotal: $${total.toFixed(2)}\n\nThis would redirect to secure payment with Stripe, PayPal, or similar service.`);
};

const showBookPreview = (bookId: string) => {
  currentBookId.value = bookId;
  bookModalOpen.value = true;
};

const closeBookPreview = () => {
  bookModalOpen.value = false;
};

// Fade-in animation
onMounted(() => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
  });
});
</script>

<template>
  <section class="hero-section store-hero">
    <div class="hero-content store-hero-content">
      <h1>{{ heroSections.store.title }}</h1>
      <p>{{ heroSections.store.description }}</p>
      
      <div class="author-intro">
        <h3>About the Author</h3>
        <p>{{ heroSections.store.authorIntro }}</p>
      </div>
    </div>
  </section>

  <FilterSection 
    :categories="bookCategories" 
    @filter="handleFilter"
  />

  <main class="content-container store-content">
    <section class="products-section">
      <h2 class="section-title fade-in">
        📖 Available Books
        <div class="section-divider"></div>
      </h2>

      <div class="grid-layout cards" id="productsGrid">
        <ProductCard 
          v-for="book in filteredBooks" 
          :key="book.id" 
          :book="book"
          :addToCart="addToCart"
          :showBookPreview="showBookPreview"
        />
      </div>
    </section>
  </main>

  <!-- Shopping Cart Sidebar -->
  <div class="cart-overlay" :class="{ active: cartOpen }" @click="closeCart"></div>
  <div class="cart-sidebar" :class="{ open: cartOpen }">
    <div class="cart-header">
      <h3 class="cart-title">Shopping Cart</h3>
      <button class="close-cart" @click="closeCart">&times;</button>
    </div>

    <div class="cart-items" id="cartItems">
      <div v-if="cart.length === 0" class="empty-cart">
        <div class="empty-cart-icon">🛒</div>
        <p>Your cart is empty</p>
        <p>Add some books to get started!</p>
      </div>
      
      <div v-else>
        <div v-for="(item, index) in cart" :key="item.id" class="cart-item">
          <div class="cart-item-image">📚</div>
          <div class="cart-item-details">
            <div class="cart-item-title">{{ item.title }}</div>
            <div class="cart-item-format">{{ item.format }}</div>
            <div class="cart-item-price">${{ item.price.toFixed(2) }}</div>
          </div>
          <button class="cart-item-remove" @click="removeFromCart(index)">×</button>
        </div>
      </div>
    </div>

    <div v-if="cart.length > 0" class="cart-footer">
      <div class="cart-total">
        <span>Total: </span>
        <span>${{ cartTotal.toFixed(2) }}</span>
      </div>
      <button class="accent-button checkout-btn" @click="checkout">Proceed to Checkout</button>
    </div>
  </div>

  <!-- Book Preview Modal -->
  <ModalDialog 
    :title="currentBook?.title || 'Book Preview'" 
    :isOpen="bookModalOpen"
    size="medium"
    @close="closeBookPreview"
  >
    <div v-if="currentBook" class="book-preview">
      <div class="book-preview-image">📚</div>
      <div class="book-details">
        <h3>{{ currentBook.title }}</h3>
        <p><strong>by {{ currentBook.author }}</strong></p>
        <p>{{ currentBook.fullDescription }}</p>

        <div class="book-specs">
          <h4>Book Details</h4>
          <div v-for="(value, key) in currentBook.specs" :key="key" class="spec-item">
            <span class="spec-label">{{ key }}:</span>
            <span class="spec-value">{{ value }}</span>
          </div>
        </div>
      </div>
    </div>
  </ModalDialog>

  <!-- Cart Button -->
  <button class="cart-button" @click="openCart">
    <span class="cart-icon">🛒</span>
    <span v-if="cartCount > 0" class="cart-count">{{ cartCount }}</span>
  </button>
</template>

<style scoped>
/* Hero Section Specific Styles */
.store-hero {
  padding: 8rem 0 4rem;
}

.author-intro {
  background: rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 20px;
  margin-top: 2rem;
  backdrop-filter: blur(10px);
}

.author-intro h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.author-intro p {
  font-size: 1rem;
  opacity: 0.9;
}

/* Book Preview Styles */
.book-preview {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.book-preview-image {
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
}

.book-details h3 {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--text-dark);
}

.book-details p {
  color: var(--text-light);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.book-specs {
  background: var(--bg-light);
  padding: 1.5rem;
  border-radius: 10px;
  margin: 1.5rem 0;
}

.book-specs h4 {
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-dark);
}

.spec-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.spec-label {
  color: var(--text-light);
}

.spec-value {
  font-weight: 600;
  color: var(--text-dark);
}

/* Shopping Cart Styles */
.cart-button {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  border: none;
  cursor: pointer;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  z-index: 100;
}

.cart-button:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.cart-count {
  position: absolute;
  top: -5px;
  right: -5px;
  background: var(--accent-color);
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.cart-sidebar {
  position: fixed;
  top: 0;
  right: -400px;
  width: 400px;
  height: 100vh;
  background: white;
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.1);
  z-index: 2000;
  transition: right 0.3s ease;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.cart-sidebar.open {
  right: 0;
}

.cart-header {
  padding: 2rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cart-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-dark);
  margin: 0;
}

.close-cart {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-light);
}

.cart-items {
  padding: 2rem;
  flex: 1;
  overflow-y: auto;
}

.cart-item {
  display: flex;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #e5e7eb;
}

.cart-item:last-child {
  border-bottom: none;
}

.cart-item-image {
  width: 60px;
  height: 80px;
  background: var(--gradient);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.cart-item-details {
  flex: 1;
}

.cart-item-title {
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: var(--text-dark);
}

.cart-item-format {
  font-size: 0.9rem;
  color: var(--text-light);
  margin-bottom: 0.5rem;
}

.cart-item-price {
  font-weight: 700;
  color: var(--primary-color);
}

.cart-item-remove {
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  font-size: 1.2rem;
}

.cart-footer {
  padding: 2rem;
  border-top: 1px solid #e5e7eb;
}

.cart-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
  font-weight: 700;
}

.checkout-btn {
  width: 100%;
}

.empty-cart {
  text-align: center;
  padding: 3rem 2rem;
  color: var(--text-light);
}

.empty-cart-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.cart-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1500;
}

.cart-overlay.active {
  display: block;
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .cart-sidebar {
    width: 100%;
    right: -100%;
  }
}
</style>