<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { bookCategories } from '@/data/data';
import type { BookData } from '@/data/data';
import FilterSection from '@/components/FilterSection.vue';
import ModalDialog from '@/components/ModalDialog.vue';
import ProductCard from "@/components/cards/ProductCard.vue";

const router = useRouter();
const currentFilter = ref('all');

const heroTitle = ref('Healing Through Knowledge');
const heroDescription = ref('Discover evidence-based books on mental health, personal growth, and emotional wellness written by our PhD educated professionals');
const bioTitle = ref('About Dr. Sarah Mitchell');
const bioDescription = ref('Dr. Sarah Mitchell holds a PhD in Clinical Psychology and has over 20 years of experience in trauma-informed therapy and emotional wellness. Her compassionate, evidence-based approach has helped thousands of individuals on their healing journeys. She specializes in anxiety disorders, depression treatment, and post-traumatic growth.');
const bioBadges = ref<string[]>([
  'PhD Clinical Psychology',
  'Professional Therapist',
  'Bestselling Author'
]);
const isLoading = ref(true);
const error = ref<string | null>(null);
const books = ref<Record<string, BookData>>({});

interface CartItem {
  id: string;
  bookId: string;
  title: string;
  format: string;
  price: number;
  imageUrl?: string;
  documentId?: string;
  pdfUrl?: string;
}

const cart = ref<CartItem[]>([]);
const cartOpen = ref(false);

const bookModalOpen = ref(false);
const currentBookId = ref('');
const currentBook = ref(null as any);

const cartCount = ref(0);
const cartTotal = ref(0);

// Load cart from localStorage
const loadCart = () => {
  try {
    const savedCart = localStorage.getItem('gettingThereCart');
    if (savedCart) {
      cart.value = JSON.parse(savedCart);
      updateCartTotals();
    }
  } catch (err) {
    console.error('Error loading cart:', err);
  }
};

// Save cart to localStorage
const saveCart = () => {
  localStorage.setItem('gettingThereCart', JSON.stringify(cart.value));
};

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

    if (filter === 'all' || category.toLowerCase() === filter.toLowerCase()) {
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

    const bio = json?.data?.bio;
    if (bio) {
      bioTitle.value = bio.title ?? bioTitle.value;
      bioDescription.value = bio.Description ?? bioDescription.value;
      if (Array.isArray(bio.cards)) {
        const titles = bio.cards
            .map((c: any) => (c?.title ?? ''))
            .map((t: string) => t.trim())
            .filter((t: string) => !!t);
        if (titles.length) bioBadges.value = titles;
      }
    }
  } catch (err) {
    console.error('Error fetching books page hero:', err);
    error.value = err instanceof Error ? err.message : 'Failed to load content';
  } finally {
    isLoading.value = false;
  }
};

const addToCart = (bookId: string, button: HTMLElement) => {
  const book = Object.values(books.value).find(book => book.id === bookId);
  if (!book) return;
  console.log(book);
  const format = 'digital';
  const price = book.formats.digital.price;

  const cartItem: CartItem = {
    id: bookId + '-' + format,
    bookId: bookId,
    title: book.title,
    format: 'Digital Edition',
    price: price,
    imageUrl: book.imageUrl,
    documentId: book.documentId,
    pdfUrl: 'https://getting-there-cms.onrender.com'+book.pdfUrl
  };


  const existingItemIndex = cart.value.findIndex(item => item.id === cartItem.id);
  if (existingItemIndex === -1) {
    cart.value.push(cartItem);
    updateCartTotals();
    saveCart();
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
  saveCart();
};

const openCart = () => {
  cartOpen.value = true;
};

const closeCart = () => {
  cartOpen.value = false;
};

const checkout = () => {
  if (cart.value.length === 0) return;

  saveCart();
  router.push('/checkout');
};

const showBookPreview = (bookId: string) => {
  currentBookId.value = bookId;
  const foundBook = Object.values(books.value).find(book => book.id === bookId);
  currentBook.value = foundBook || null;
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

const fetchBooks = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    const res = await fetch(`${import.meta.env.VITE_CMS_URL}/api/books?populate=all`);

    if (!res.ok) {
      throw new Error(`Failed to fetch books: ${res.status} ${res.statusText}`);
    }

    const json = await res.json();
    const booksData = json?.data || [];

    const transformedBooks: Record<string, BookData> = {};

    booksData.forEach((book: any) => {
      const bookId = `book-${book.id}`;
      const category = book.Category || '';

      transformedBooks[bookId] = {
        id: bookId,
        documentId: book.documentId,
        title: book.Title,
        author: book.author,
        description: book.Description.substring(0, 150) + '...',
        fullDescription: book.Description,
        specs: {
          'Pages': '300+',
          'Published': new Date().getFullYear().toString(),
          'ISBN': '978-1-234567-89-0',
          'Language': 'English',
          'Category': 'Psychology, Self-Help'
        },
        category: category,
        formats: {
          digital: {
            price: book.price,
            delivery: 'Instant download'
          },
          print: {
            price: book.price + 10,
            delivery: '3-5 business days'
          }
        },
        imageUrl: book.picture?.formats?.small?.url || book.picture?.url || null,
        pdfUrl: book.file?.url || null
      };
    });

    books.value = transformedBooks;
  } catch (err) {
    console.error('Error fetching books:', err);
    error.value = err instanceof Error ? err.message : 'Failed to load books';
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  loadCart();
  await fetchHeroData();
  await fetchBooks();

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
          <h3>{{ bioTitle }}</h3>
          <p>{{ bioDescription }}</p>
          <div class="author-credentials">
            <span v-for="(badge, idx) in bioBadges" :key="idx" class="credential-badge">{{ badge }}</span>
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
          <div class="therapy-cart-item-image">
            <img v-if="item.imageUrl" :src="`https://getting-there-cms.onrender.com${item.imageUrl}`" alt="Book cover" class="cart-item-cover" />
            <div v-else class="cart-item-fallback">📱</div>
          </div>
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
      <button class="therapy-checkout-btn" @click="checkout">Proceed to Checkout</button>
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
        <img v-if="currentBook.imageUrl" :src="`https://getting-there-cms.onrender.com${currentBook.imageUrl}`" alt="Book cover" class="book-cover-img" />
        <div v-else class="book-cover">📱</div>
        <div class="book-badges">
          <span v-if="currentBook.category === 'Best Seller'" class="preview-badge bestseller">Bestseller</span>
          <span v-if="currentBook.category === 'New Releases'" class="preview-badge new">New Release</span>
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

.therapy-bulk-print {
  background: var(--primary-color);
  padding: 4rem 0;
  margin: 4rem 0;
  color: white;
  position: relative;
  overflow: hidden;
  border-radius: 20px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="%23ffffff" fill-opacity="0.05"><circle cx="30" cy="30" r="2"/></g></svg>');
    animation: gentleFloat 20s ease-in-out infinite;
  }
}

.bulk-print-content {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 3rem;
  align-items: center;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

.bulk-print-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.bulk-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.bulk-print-text h2 {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: white;
  font-family: 'Playfair Display', serif;

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
}

.bulk-subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.organization-types {
  @extend .grid-two;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.org-type {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-weight: 500;
  color: white;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
  }
}

.type-icon {
  font-size: 1.2rem;
}

.bulk-print-cta-card {
  @extend .card-base;
  text-align: center;
  background: white;
  padding: 2.5rem;

  h3 {
    font-size: 1.4rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: var(--text-dark);
  }

  p {
    color: var(--text-light);
    line-height: 1.6;
    margin-bottom: 2rem;
  }
}

.bulk-features {
  margin-bottom: 2rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  text-align: left;
  color: var(--text-dark);
}

.feature-icon {
  font-size: 1.1rem;
  color: var(--primary-color);
}

.bulk-cta-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.bulk-cta-primary {
  @extend .cta-primary;
}

.bulk-cta-secondary {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
  padding: 0.75rem;

  &:hover {
    color: var(--secondary-color);
  }
}

.bulk-pricing-note {
  color: var(--text-light);
  font-size: 0.9rem;
  margin: 0;
}

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
  @extend .grid-auto-fit;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.benefit-item {
  @extend .card-base;
  text-align: center;
  background: white;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px var(--shadow-medium);
  }
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

.loading-container, .error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin: 2rem auto;
  max-width: 500px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(74, 124, 89, 0.1);
  border-radius: 50%;
  border-top-color: var(--primary-color);
  margin: 0 auto 1.5rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-container {
  color: #d32f2f;
}

.retry-button {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  margin-top: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-button:hover {
  background: var(--secondary-color);
  transform: translateY(-2px);
}
</style>
