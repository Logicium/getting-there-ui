<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { bookCategories } from '@/data/data';
import type { BookData } from '@/data/data';
import type { CartItem } from '@/types/store';
import FilterSection from '@/components/FilterSection.vue';
import ProductCard from "@/components/cards/ProductCard.vue";
import CartSidebar from '@/components/CartSidebar.vue';
import BookPreviewModal from '@/components/BookPreviewModal.vue';
import BulkPrintSection from '@/components/sections/BulkPrintSection.vue';
import { observeFadeElements } from '@/utils/animationUtils';
import { filterElementsByCategory } from '@/utils/filterUtils';
import { loadCart, saveCart, calculateCartTotals, showAddedToCartFeedback, isItemInCart } from '@/utils/cartUtils';

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

const cart = ref<CartItem[]>([]);
const cartOpen = ref(false);

const bookModalOpen = ref(false);
const currentBookId = ref('');
const currentBook = ref(null as BookData | null);

const cartCount = ref(0);
const cartTotal = ref(0);

// DOM MANIPULATION APPROACH LIKE WORKSHOPS
const handleFilter = (filter: string) => {
  currentFilter.value = filter;
  filterElementsByCategory('.product-card', filter);
};

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

  if (!isItemInCart(cart.value, cartItem.id)) {
    cart.value.push(cartItem);
    updateCartTotals();
    saveCart(cart.value);
    showAddedToCartFeedback(button);
  } else {
    alert('This item is already in your cart!');
  }
};

const updateCartTotals = () => {
  const totals = calculateCartTotals(cart.value);
  cartCount.value = totals.count;
  cartTotal.value = totals.total;
};

const removeFromCart = (index: number) => {
  cart.value.splice(index, 1);
  updateCartTotals();
  saveCart(cart.value);
};

const openCart = () => {
  cartOpen.value = true;
};

const closeCart = () => {
  cartOpen.value = false;
};

const checkout = () => {
  if (cart.value.length === 0) return;

  saveCart(cart.value);
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

const fetchBooks = async () => {
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
      // Normalize category to match filter IDs (e.g., "Loss & Grief" -> "loss")
      let category = (book.Category || '').toLowerCase();
      if (category.includes('loss') || category.includes('grief')) {
        category = 'loss';
      }

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
  }
};

onMounted(async () => {
  cart.value = loadCart();
  updateCartTotals();
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
        Literature
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

    <BulkPrintSection />

  </main>

  <CartSidebar 
    :isOpen="cartOpen"
    :cart="cart"
    :cartTotal="cartTotal"
    @close="closeCart"
    @remove="removeFromCart"
    @checkout="checkout"
  />

  <BookPreviewModal
    :isOpen="bookModalOpen"
    :book="currentBook"
    @close="closeBookPreview"
  />

  <button class="therapy-cart-button" @click="openCart">
    <span class="therapy-cart-icon">🛒</span>
    <span v-if="cartCount > 0" class="therapy-cart-count">{{ cartCount }}</span>
  </button>
</template>

<style scoped lang="scss">
@import '@/assets/common.scss';
@import '@/assets/scss/mixins';
@import '@/assets/scss/variables';

.therapy-store-hero {
  @extend .hero-base;
  background: var(--gradient);
  color: white;
}

.therapy-store-hero-content {
  @extend .hero-content-base;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 $spacing-xl;
}

/* Hero Loading/Error States */
.loading-container,
.error-container {
  @include loading-container(transparent, white);
}

.loading-spinner {
  @include loading-spinner();
}

.retry-button {
  @include button-base(white, var(--primary-color));
  margin-top: $spacing-md;

  &:hover {
    background: rgba(255, 255, 255, 0.9);
    transform: translateY(-2px);
  }
}

.therapy-author-intro {
  background: rgba(255, 255, 255, 0.1);
  padding: $spacing-xl;
  border-radius: $radius-lg;
  backdrop-filter: blur(10px);
  display: grid;
  grid-template-columns: auto 1fr;
  gap: $spacing-lg;
  align-items: center;
  text-align: left;
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-top: $spacing-xl;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;

  @include mobile-only {
    grid-template-columns: 1fr;
    text-align: center;
    padding: $spacing-lg;
    gap: $spacing-md;
  }
}

.author-visual {
  @include flex-column($spacing-sm);
  align-items: center;
}

.author-avatar-large {
  width: 80px;
  height: 80px;
  border-radius: $radius-full;
  background: rgba(255, 255, 255, 0.2);
  @include flex-center;
  font-size: $font-size-2xl;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.author-details h3 {
  font-size: $font-size-xl;
  margin-bottom: $spacing-sm;
  font-family: 'Playfair Display', serif;
}

.author-details p {
  font-size: $font-size-sm;
  opacity: 0.9;
  margin-bottom: $spacing-md;
  line-height: 1.5;
}

.author-credentials {
  @include flex-row($spacing-sm);
  flex-wrap: wrap;
}

.credential-badge {
  @extend .trust-badge;
  font-size: $font-size-xs;
  padding: $spacing-xs $spacing-sm;
}

.therapy-store-content {
  @extend .container;
  padding: $spacing-3xl $spacing-xl;
}

.therapy-books-grid {
  @include grid-auto(350px, $spacing-xl);
  margin-bottom: $spacing-3xl;
}

.therapy-cart-button {
  position: fixed;
  bottom: $spacing-xl;
  right: $spacing-xl;
  width: 65px;
  height: 65px;
  border-radius: $radius-full;
  background: var(--primary-color);
  color: white;
  @include flex-center;
  font-size: $font-size-xl;
  border: none;
  cursor: pointer;
  box-shadow: 0 8px 25px var(--shadow-medium);
  transition: all $transition-normal;
  z-index: $z-fixed;

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
  border-radius: $radius-full;
  font-size: $font-size-xs;
  @include flex-center;
  font-weight: 700;
}

.therapy-reading-benefits {
  @include card-base(var(--bg-sage), $radius-xl, $spacing-2xl);
  margin-top: $spacing-2xl;
}

.benefits-content h3 {
  @include heading-medium;
  text-align: center;
}

.benefits-grid {
  @include grid-auto(250px, $spacing-xl);

  @include mobile-only {
    grid-template-columns: 1fr;
  }
}

.benefit-item {
  @include card-interactive;
  text-align: center;
  background: white;
}

.benefit-icon {
  font-size: $font-size-4xl;
  margin-bottom: $spacing-md;
}

.benefit-item h4 {
  @include heading-small;
  color: var(--primary-color);
}

.benefit-item p {
  @include text-muted;
}
</style>
