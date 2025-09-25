<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { books, bookCategories } from '@/data/data';
import FilterSection from '@/components/FilterSection.vue';
import ModalDialog from '@/components/ModalDialog.vue';
import ProductCard from "@/components/cards/ProductCard.vue";

const currentFilter = ref('all');

const heroTitle = ref('Healing Through Knowledge');
const heroDescription = ref('Discover evidence-based books on mental health, personal growth, and emotional wellness written by our licensed professionals');
const isLoading = ref(true);
const error = ref<string | null>(null);

interface CartItem {
  id: string;
  bookId: string;
  title: string;
  format: string;
  price: number;
}

const cart = ref<CartItem[]>([]);
const cartOpen = ref(false);

const bookModalOpen = ref(false);
const currentBookId = ref('');
const currentBook = ref(null as any);

const cartCount = ref(0);
const cartTotal = ref(0);

// DOM MANIPULATION APPROACH LIKE WORKSHOPS
const handleFilter = (filter: string) => {
  currentFilter.value = filter;
  filterBooks();
};

function filterBooks() {
  const filter = currentFilter.value;
  const bookCards = document.querySelectorAll('.product-card');

  bookCards.forEach(card => {
    const htmlCard = card as HTMLElement;
    const category = htmlCard.dataset.category || '';

    if (filter === 'all' || category.includes(filter)) {
      htmlCard.style.display = 'block';
    } else {
      htmlCard.style.display = 'none';
    }
  });
}

const fetchHeroData = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    const res = await fetch(`${import.meta.env.VITE_CMS_URL}/api/books-page?populate=all`);

    if (!res.ok) {
      throw new Error(`Failed to fetch books page hero: ${res.status} ${res.statusText}`);
    }

    const json = await res.json();
    heroTitle.value = json?.data?.Hero?.title ?? heroTitle.value;
    heroDescription.value = json?.data?.Hero?.description ?? heroDescription.value;
  } catch (err) {
    console.error('Error fetching books page hero:', err);
    error.value = err instanceof Error ? err.message : 'Failed to load content';
  } finally {
    isLoading.value = false;
  }
};

const addToCart = (bookId: string, button: HTMLElement) => {
  const book = books[bookId];
  if (!book) return;

  const format = 'digital';
  const price = book.formats.digital.price;

  const cartItem: CartItem = {
    id: bookId + '-' + format,
    bookId: bookId,
    title: book.title,
    format: 'Digital Edition',
    price: price
  };

  const existingItemIndex = cart.value.findIndex(item => item.id === cartItem.id);
  if (existingItemIndex === -1) {
    cart.value.push(cartItem);
    updateCartTotals();
    showAddedToCartFeedback(button);
  } else {
    alert('This item is already in your cart!');
  }
};

const updateCartTotals = () => {
  cartCount.value = cart.value.length;
  cartTotal.value = cart.value.reduce((sum, item) => sum + item.price, 0);
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
  updateCartTotals();
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
  currentBook.value = books[bookId];
  bookModalOpen.value = true;
};

const closeBookPreview = () => {
  bookModalOpen.value = false;
};

function observeFadeElements() {
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
}

onMounted(async () => {
  await fetchHeroData();

  setTimeout(() => {
    observeFadeElements();
  }, 100);
});
</script>

<template>
  <section class="therapy-store-hero">
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Loading books content...</p>
    </div>

    <div v-else-if="error" class="error-container">
      <p>{{ error }}</p>
      <button @click="fetchHeroData" class="retry-button">Retry</button>
    </div>

    <div v-else class="therapy-store-hero-content">
      <h1>{{ heroTitle }}</h1>
      <p>{{ heroDescription }}</p>

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

      <!-- RENDER ALL BOOKS - FILTER WITH DOM MANIPULATION -->
      <div class="therapy-books-grid" id="productsGrid">
        <ProductCard
            v-for="book in Object.values(books)"
            :key="book.id"
            :book="book"
            :addToCart="addToCart"
            :showBookPreview="showBookPreview"
            :digitalOnly="true"
        />
      </div>
    </section>

    <section class="therapy-bulk-print fade-in">
      <div class="bulk-print-content">
        <div class="bulk-print-text">
          <div class="bulk-icon">📚</div>
          <h2>Bulk Print Orders for Organizations</h2>
          <p class="bulk-subtitle">
            Need physical copies for your organization, workshop, or group? We offer bulk printing services for educational institutions, healthcare facilities, and community organizations.
          </p>

          <div class="organization-types">
            <div class="org-type">
              <span class="type-icon">🏥</span>
              <span>Healthcare Facilities</span>
            </div>
            <div class="org-type">
              <span class="type-icon">🏫</span>
              <span>Educational Institutions</span>
            </div>
            <div class="org-type">
              <span class="type-icon">🏢</span>
              <span>Corporate Wellness Programs</span>
            </div>
            <div class="org-type">
              <span class="type-icon">🤝</span>
              <span>Support Organizations</span>
            </div>
          </div>
        </div>

        <div class="bulk-print-cta-card">
          <h3>Request Bulk Print Quote</h3>
          <p>Get customized pricing for physical copies of our therapeutic resources.</p>

          <div class="bulk-features">
            <div class="feature-item">
              <span class="feature-icon">📖</span>
              <span>Professional-grade printing and binding</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">📦</span>
              <span>Minimum order: 25 copies</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">🚚</span>
              <span>Direct shipping to your facility</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">💰</span>
              <span>Volume discounts available</span>
            </div>
          </div>

          <div class="bulk-cta-buttons">
            <a href="mailto:bulk@gthere.net?subject=Bulk Print Request&body=Hello,%0D%0A%0D%0APlease provide a quote for bulk printing.%0D%0A%0D%0AOrganization:%0D%0AContact Person:%0D%0APhone:%0D%0ABook Title(s):%0D%0AQuantity Needed:%0D%0ADelivery Address:%0D%0A%0D%0AThank you!" class="bulk-cta-primary">
              Request Quote
            </a>
            <a href="tel:+1234567890" class="bulk-cta-secondary">
              📞 (123) 456-7890
            </a>
          </div>

          <p class="bulk-pricing-note">Pricing starts at $8/book • Volume discounts available</p>
        </div>
      </div>
    </section>

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

  <div class="therapy-cart-overlay" :class="{ active: cartOpen }" @click="closeCart"></div>
  <div class="therapy-cart-sidebar" :class="{ open: cartOpen }">
    <div class="therapy-cart-header">
      <h3 class="therapy-cart-title">Your Digital Library</h3>
      <button class="therapy-close-cart" @click="closeCart">&times;</button>
    </div>

    <div class="therapy-cart-items" id="cartItems">
      <div v-if="cart.length === 0" class="therapy-empty-cart">
        <div class="empty-cart-icon">📱</div>
        <p>Your digital library is empty</p>
        <p>Add some books to begin your journey!</p>
      </div>

      <div v-else>
        <div v-for="(item, index) in cart" :key="item.id" class="therapy-cart-item">
          <div class="therapy-cart-item-image">📱</div>
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
      <button class="therapy-checkout-btn" @click="checkout">Get Instant Access</button>
      <p class="therapy-cart-note">📱 Instant download • 30-day money-back guarantee</p>
    </div>
  </div>

  <ModalDialog
      :title="currentBook?.title || 'Book Preview'"
      :isOpen="bookModalOpen"
      size="medium"
      @close="closeBookPreview"
  >
    <div v-if="currentBook" class="therapy-book-preview">
      <div class="therapy-book-preview-image">
        <div class="book-cover">📱</div>
        <div class="book-badges">
          <span v-if="currentBook.category.includes('bestseller')" class="preview-badge bestseller">Bestseller</span>
          <span v-if="currentBook.category.includes('new')" class="preview-badge new">New Release</span>
          <span class="preview-badge digital">Digital Only</span>
        </div>
      </div>
      <div class="therapy-book-details">
        <h3>{{ currentBook.title }}</h3>
        <p class="book-author"><strong>by {{ currentBook.author }}</strong></p>
        <p class="book-description">{{ currentBook.fullDescription }}</p>

        <div class="therapy-book-specs">
          <h4>📋 Digital Book Information</h4>
          <div v-for="(value, key) in currentBook.specs" :key="key" class="therapy-spec-item">
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

  <button class="therapy-cart-button" @click="openCart">
    <span class="therapy-cart-icon">🛒</span>
    <span v-if="cartCount > 0" class="therapy-cart-count">{{ cartCount }}</span>
  </button>
</template>

<style scoped lang="scss">
@import '@/assets/common.scss';

.therapy-store-hero {
  @extend .hero-base;
  background: var(--gradient);
  color: white;
  position: relative;
  overflow: hidden;
}

.therapy-store-hero-content {
  @extend .hero-content-base;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.therapy-author-intro {
  background: rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1.5rem;
  align-items: center;
  text-align: left;
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-top: 2rem;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
    padding: 1.5rem;
    gap: 1rem;
  }
}

.author-visual {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.author-avatar-large {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  margin-bottom: 0.5rem;
}

.author-details h3 {
  font-size: 1.4rem;
  margin-bottom: 0.75rem;
  font-family: 'Playfair Display', serif;
}

.author-details p {
  font-size: 0.9rem;
  opacity: 0.9;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.author-credentials {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.credential-badge {
  @extend .trust-badge;
  font-size: 0.8rem;
  padding: 0.35rem 0.75rem;
}

.therapy-store-content {
  @extend .container;
  padding: 4rem 2rem;
}

.therapy-books-grid {
  @extend .grid-auto-fit;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  margin-bottom: 4rem;
}

/* Cart and other styles remain the same as original... */
/* I'll include essential ones for completeness */

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

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 35px var(--shadow-medium);
  }
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
</style>