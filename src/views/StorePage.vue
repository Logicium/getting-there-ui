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
  <section class="therapy-store-hero">
    <div class="therapy-store-hero-content">
      <h1>Healing Through Knowledge</h1>
      <p>Discover evidence-based books on mental health, personal growth, and emotional wellness written by our licensed professionals</p>

      <div class="therapy-author-intro">
        <div class="author-visual">
          <div class="author-avatar-large">👩‍⚕️</div>
        </div>
        <div class="author-details">
          <h3>About Dr. Sarah Mitchell</h3>
          <p>Dr. Sarah Mitchell holds a PhD in Clinical Psychology and has over 20 years of experience in trauma-informed therapy and emotional wellness. Her compassionate, evidence-based approach has helped thousands of individuals on their healing journeys. She specializes in anxiety disorders, depression treatment, and post-traumatic growth.</p>
          <div class="author-credentials">
            <span class="credential-badge">🎓 PhD Clinical Psychology</span>
            <span class="credential-badge">🏆 Licensed Therapist</span>
            <span class="credential-badge">📚 Bestselling Author</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <FilterSection
      :categories="bookCategories"
      @filter="handleFilter"
  />

  <main class="therapy-store-content">
    <section class="therapy-books-section">
      <h2 class="wellness-section-title fade-in">
        Therapeutic Literature & Self-Help Guides
        <div class="section-divider"></div>
      </h2>

      <div class="therapy-books-grid" id="productsGrid">
        <ProductCard
            v-for="book in filteredBooks"
            :key="book.id"
            :book="book"
            :addToCart="addToCart"
            :showBookPreview="showBookPreview"
        />
      </div>
    </section>

    <!-- Therapeutic Reading Benefits -->
    <section class="therapy-reading-benefits fade-in">
      <div class="benefits-content">
        <h3>📚 The Healing Power of Therapeutic Reading</h3>
        <div class="benefits-grid">
          <div class="benefit-item">
            <div class="benefit-icon">🧠</div>
            <h4>Evidence-Based Approaches</h4>
            <p>All our books incorporate the latest research in psychology and neuroscience, offering proven strategies for mental wellness.</p>
          </div>
          <div class="benefit-item">
            <div class="benefit-icon">💚</div>
            <h4>Trauma-Informed Content</h4>
            <p>Written with sensitivity and awareness of trauma's impact, ensuring safe and supportive reading experiences.</p>
          </div>
          <div class="benefit-item">
            <div class="benefit-icon">🌱</div>
            <h4>Personal Growth Focus</h4>
            <p>Designed to support your journey of self-discovery, healing, and positive life transformation.</p>
          </div>
          <div class="benefit-item">
            <div class="benefit-icon">🤝</div>
            <h4>Professional Support</h4>
            <p>Each book includes resources for finding professional help and crisis support when needed.</p>
          </div>
        </div>
      </div>
    </section>
  </main>

  <!-- Shopping Cart Sidebar -->
  <div class="therapy-cart-overlay" :class="{ active: cartOpen }" @click="closeCart"></div>
  <div class="therapy-cart-sidebar" :class="{ open: cartOpen }">
    <div class="therapy-cart-header">
      <h3 class="therapy-cart-title">Your Healing Library</h3>
      <button class="therapy-close-cart" @click="closeCart">&times;</button>
    </div>

    <div class="therapy-cart-items" id="cartItems">
      <div v-if="cart.length === 0" class="therapy-empty-cart">
        <div class="empty-cart-icon">📚</div>
        <p>Your healing library is empty</p>
        <p>Add some books to begin your journey!</p>
      </div>

      <div v-else>
        <div v-for="(item, index) in cart" :key="item.id" class="therapy-cart-item">
          <div class="therapy-cart-item-image">📖</div>
          <div class="therapy-cart-item-details">
            <div class="therapy-cart-item-title">{{ item.title }}</div>
            <div class="therapy-cart-item-format">{{ item.format }}</div>
            <div class="therapy-cart-item-price">${{ item.price.toFixed(2) }}</div>
          </div>
          <button class="therapy-cart-item-remove" @click="removeFromCart(index)">×</button>
        </div>
      </div>
    </div>

    <div v-if="cart.length > 0" class="therapy-cart-footer">
      <div class="therapy-cart-total">
        <span>Total Investment: </span>
        <span>${{ cartTotal.toFixed(2) }}</span>
      </div>
      <button class="therapy-checkout-btn" @click="checkout">Begin Your Healing Journey</button>
      <p class="therapy-cart-note">💚 30-day money-back guarantee on all purchases</p>
    </div>
  </div>

  <!-- Book Preview Modal -->
  <ModalDialog
      :title="currentBook?.title || 'Book Preview'"
      :isOpen="bookModalOpen"
      size="medium"
      @close="closeBookPreview"
  >
    <div v-if="currentBook" class="therapy-book-preview">
      <div class="therapy-book-preview-image">
        <div class="book-cover">📚</div>
        <div class="book-badges">
          <span v-if="currentBook.category.includes('bestseller')" class="preview-badge bestseller">Bestseller</span>
          <span v-if="currentBook.category.includes('new')" class="preview-badge new">New Release</span>
        </div>
      </div>
      <div class="therapy-book-details">
        <h3>{{ currentBook.title }}</h3>
        <p class="book-author"><strong>by {{ currentBook.author }}</strong></p>
        <p class="book-description">{{ currentBook.fullDescription }}</p>

        <div class="therapy-book-specs">
          <h4>📋 Book Information</h4>
          <div v-for="(value, key) in currentBook.specs" :key="key" class="therapy-spec-item">
            <span class="therapy-spec-label">{{ key }}:</span>
            <span class="therapy-spec-value">{{ value }}</span>
          </div>
        </div>

        <div class="therapy-content-warning">
          <h4>⚠️ Content Notice</h4>
          <p>This book addresses mental health topics and may include discussions of trauma, depression, or anxiety. Please read in a safe environment and consider having support available.</p>
        </div>
      </div>
    </div>
  </ModalDialog>

  <!-- Cart Button -->
  <button class="therapy-cart-button" @click="openCart">
    <span class="therapy-cart-icon">🛒</span>
    <span v-if="cartCount > 0" class="therapy-cart-count">{{ cartCount }}</span>
  </button>
</template>

<style scoped>
/* Therapy Store Hero Section */
.therapy-store-hero {
  padding: 8rem 0 4rem;
  background: var(--gradient);
  color: white;
  position: relative;
  overflow: hidden;
}

.therapy-store-hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="%23ffffff" fill-opacity="0.1"><circle cx="30" cy="30" r="2"/></g></svg>');
  animation: gentleFloat 20s ease-in-out infinite;
}

@keyframes gentleFloat {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(180deg); }
}

.therapy-store-hero-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 2;
  text-align: center;
}

.therapy-store-hero h1 {
  font-size: clamp(2.5rem, 6vw, 3.5rem);
  font-weight: 700;
  margin-bottom: 1rem;
  font-family: 'Playfair Display', serif;
}

.therapy-store-hero p {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 3rem;
  line-height: 1.6;
}

/* Author Introduction */
.therapy-author-intro {
  background: rgba(255, 255, 255, 0.1);
  padding: 3rem;
  border-radius: 20px;
  backdrop-filter: blur(10px);
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 2rem;
  align-items: center;
  text-align: left;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.author-visual {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.author-avatar-large {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  border: 3px solid rgba(255, 255, 255, 0.3);
  margin-bottom: 1rem;
}

.author-details h3 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
  font-family: 'Playfair Display', serif;
}

.author-details p {
  font-size: 1rem;
  opacity: 0.9;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.author-credentials {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

/* Main Content */
.therapy-store-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
}

.wellness-section-title {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 3rem;
  color: var(--text-dark);
  font-family: 'Playfair Display', serif;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.section-divider {
  height: 3px;
  background: var(--gradient);
  border-radius: 2px;
  flex: 1;
}

.therapy-books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

/* Reading Benefits Section */
.therapy-reading-benefits {
  background: var(--bg-sage);
  padding: 3rem;
  border-radius: 20px;
  margin-top: 3rem;
  border: 1px solid var(--border-light);
}

.benefits-content h3 {
  text-align: center;
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: var(--text-dark);
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.benefit-item {
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 5px 20px var(--shadow-light);
  text-align: center;
  transition: all 0.3s ease;
}

.benefit-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px var(--shadow-medium);
}

.benefit-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.benefit-item h4 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.benefit-item p {
  color: var(--text-light);
  line-height: 1.5;
}

/* Cart Styles */
.therapy-cart-button {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 65px;
  height: 65px;
  border-radius: 50%;
  background: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  border: none;
  cursor: pointer;
  box-shadow: 0 8px 25px var(--shadow-medium);
  transition: all 0.3s ease;
  z-index: 100;
}

.therapy-cart-button:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 35px var(--shadow-medium);
}

.therapy-cart-count {
  position: absolute;
  top: -5px;
  right: -5px;
  background: var(--accent-color);
  color: white;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

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
}

.therapy-cart-sidebar.open {
  right: 0;
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
}

.therapy-close-cart:hover {
  background: var(--primary-color);
  color: white;
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
}

.therapy-cart-item:last-child {
  border-bottom: none;
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
}

.therapy-cart-item-remove:hover {
  background: rgba(231, 111, 81, 0.1);
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
}

.therapy-checkout-btn:hover {
  background: var(--secondary-color);
  transform: translateY(-2px);
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
}

.therapy-cart-overlay.active {
  display: block;
}

/* Book Preview Modal */
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
}

.preview-badge.bestseller {
  background: var(--accent-color);
  color: white;
}

.preview-badge.new {
  background: var(--success-color);
  color: white;
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
}

.therapy-book-specs h4 {
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-dark);
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
}

.therapy-content-warning h4 {
  color: var(--warning-color);
  margin-bottom: 0.75rem;
  font-size: 1rem;
}

.therapy-content-warning p {
  margin: 0;
  color: var(--text-dark);
  font-size: 0.9rem;
  line-height: 1.5;
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .therapy-author-intro {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .therapy-cart-sidebar {
    width: 100%;
    right: -100%;
  }

  .therapy-books-grid {
    grid-template-columns: 1fr;
  }

  .benefits-grid {
    grid-template-columns: 1fr;
  }

  .wellness-section-title {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .section-divider {
    width: 100px;
    margin: 0 auto;
  }
}

/* Animations */
.fade-in {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease;
}

.fade-in.visible {
  opacity: 1;
  transform: translateY(0);
}
</style>