<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { bookCategories } from '@/data/data';
import type { BookData } from '@/data/data';
import type { CartItem } from '@/types/store';
import ProductCard from '@/components/cards/ProductCard.vue';
import CartSidebar from '@/components/CartSidebar.vue';
import BookPreviewModal from '@/components/BookPreviewModal.vue';
import BulkPrintSection from '@/components/sections/BulkPrintSection.vue';
import NewsletterSignup from '@/components/NewsletterSignup.vue';
import { filterElementsByCategory } from '@/utils/filterUtils';
import { BookOpen, ShoppingCart } from 'lucide-vue-next';
import { loadCart, saveCart, calculateCartTotals, showAddedToCartFeedback, isItemInCart } from '@/utils/cartUtils';
import {
  AppBadge,
  AppContainer,
  AppEmptyState,
  AppEyebrow,
  AppGrid,
  AppHero,
  AppSection,
  AppSpinner,
  AppButton,
} from '@/components/ui';

const router = useRouter();
const currentFilter = ref('all');

const heroTitle = ref('Healing Through Knowledge');
const heroDescription = ref('Discover thoughtful books on emotional wellness and personal growth written by our experienced team');
const bioTitle = ref('About Dr. Sarah Mitchell');
const bioDescription = ref('Dr. Sarah Mitchell holds a PhD in Clinical Psychology and has over 20 years of experience in trauma-informed therapy and emotional wellness. Her compassionate, practical approach has helped thousands of individuals on their healing journeys. She specializes in anxiety, depression, and post-traumatic growth.');
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

const bookList = computed(() => Object.values(books.value));
const collageImages = computed(() =>
  bookList.value
    .filter(b => !!b.imageUrl)
    .slice(0, 3)
);

// Waterfall: distribute all cover images into 3 columns, padded to ≥6 each for smooth loop
const waterfallCols = computed(() => {
  const imgs = bookList.value.filter(b => !!b.imageUrl)
  if (!imgs.length) return [[], [], []] as [typeof imgs, typeof imgs, typeof imgs]
  const col1 = imgs.filter((_, i) => i % 3 === 0)
  const col2 = imgs.filter((_, i) => i % 3 === 1)
  const col3 = imgs.filter((_, i) => i % 3 === 2)
  const pad = (col: typeof imgs): typeof imgs => {
    const out = [...col]
    while (out.length < 6) out.push(...imgs)
    return out.slice(0, 10)
  }
  const filled = pad(imgs)
  return [pad(col1.length ? col1 : imgs), pad(col2.length ? col2 : imgs), pad(col3.length ? col3 : filled)] as [typeof imgs, typeof imgs, typeof imgs]
})

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
    pdfUrl: 'https://getting-there-cms.onrender.com' + book.pdfUrl
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

const openCart = () => { cartOpen.value = true; };
const closeCart = () => { cartOpen.value = false; };

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

const closeBookPreview = () => { bookModalOpen.value = false; };

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
          digital: { price: book.price, delivery: 'Instant download' },
          print:   { price: book.price + 10, delivery: '3-5 business days' }
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
});
</script>

<template>
  <main class="store">
    <!-- HERO: editorial split with product imagery collage -->
    <AppHero variant="editorial" tone="cream" class="store-hero">
      <template #eyebrow>
        <AppEyebrow tone="fuchsia">The Shop</AppEyebrow>
      </template>
      <template #title>{{ heroTitle }}</template>
      <template #lede>
        <p>{{ heroDescription }}</p>
      </template>
      <template #actions>
        <AppButton variant="primary" size="lg" @click="openCart">View cart ({{ cartCount }})</AppButton>
      </template>
      <template #meta>
        <div class="store__bio">
          <h3 class="store__bio-title">{{ bioTitle }}</h3>
          <p class="store__bio-desc">{{ bioDescription }}</p>
          <div class="store__bio-badges">
            <AppBadge v-for="(b, i) in bioBadges" :key="i" tone="mint" size="sm">{{ b }}</AppBadge>
          </div>
        </div>
      </template>
      <template #media>
        <div class="store__waterfall" aria-hidden="true">
          <template v-if="waterfallCols[0].length">
            <div
              v-for="(col, ci) in waterfallCols"
              :key="ci"
              class="store__waterfall-col"
              :class="`store__waterfall-col--${ci + 1}`"
            >
              <!-- track repeated twice for seamless loop -->
              <div class="store__waterfall-track">
                <div
                  v-for="(book, bi) in col"
                  :key="`${book.id}-a-${bi}`"
                  class="store__waterfall-item"
                >
                  <img
                    :src="'https://getting-there-cms.onrender.com' + book.imageUrl"
                    :alt="book.title"
                    loading="lazy"
                  />
                </div>
                <div
                  v-for="(book, bi) in col"
                  :key="`${book.id}-b-${bi}`"
                  class="store__waterfall-item"
                >
                  <img
                    :src="'https://getting-there-cms.onrender.com' + book.imageUrl"
                    :alt="book.title"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </template>
          <div v-else class="store__waterfall-empty">
            <BookOpen :size="52" :stroke-width="1.5" />
          </div>
        </div>
      </template>
    </AppHero>

    <!-- FILTER + GRID -->
    <AppSection tone="cream-2" pad="xl">
      <AppContainer size="lg">
        <header class="store__head">
          <AppEyebrow tone="cobalt">Library</AppEyebrow>
          <h2 class="u-display u-display--md">Browse the collection</h2>
        </header>

        <div class="store__filters" role="tablist" aria-label="Filter books by category">
          <button
            v-for="cat in bookCategories"
            :key="cat.id"
            type="button"
            role="tab"
            :aria-selected="currentFilter === cat.id"
            class="store__filter-btn"
            @click="handleFilter(cat.id)"
          >
            <AppBadge
              :tone="currentFilter === cat.id ? 'marigold' : 'cream'"
              size="md"
            >
              {{ cat.label }}
            </AppBadge>
          </button>
        </div>

        <div v-if="isLoading" class="store__state">
          <AppSpinner size="lg" />
          <p>Loading books...</p>
        </div>

        <AppEmptyState
          v-else-if="error"
          variant="error"
          :title="'Could not load the library'"
          :message="error"
        >
          <template #actions>
            <AppButton variant="primary" @click="fetchHeroData">Try again</AppButton>
          </template>
        </AppEmptyState>

        <AppEmptyState
          v-else-if="bookList.length === 0"
          variant="empty"
          title="No books available"
          message="Check back soon for new titles."
        />

        <AppGrid v-else :min="260" gap="md">
          <ProductCard
            v-for="book in bookList"
            :key="book.id"
            :book="book"
            :add-to-cart="addToCart"
            :show-book-preview="showBookPreview"
            :digital-only="true"
          />
        </AppGrid>
      </AppContainer>
    </AppSection>

    <!-- BULK PRINT -->
    <AppSection tone="cream-2" pad="xl">
      <BulkPrintSection />
    </AppSection>

    <!-- SUBSCRIBER CTA -->
    <AppSection tone="ink" pad="xl">
      <AppContainer size="md">
        <div class="store__cta">
          <AppEyebrow tone="marigold">Stay in the loop</AppEyebrow>
          <h2 class="store__cta-title">New books, fresh resources, free reads.</h2>
          <p class="store__cta-lede">Subscribe to hear about new releases, seasonal sales, and reader-only excerpts.</p>
          <NewsletterSignup
            variant="cta"
            source="store-cta"
            title=""
            description=""
            button-text="Subscribe"
          />
        </div>
      </AppContainer>
    </AppSection>

    <CartSidebar
      :is-open="cartOpen"
      :cart="cart"
      :cart-total="cartTotal"
      @close="closeCart"
      @remove="removeFromCart"
      @checkout="checkout"
    />

    <BookPreviewModal
      :is-open="bookModalOpen"
      :book="currentBook"
      @close="closeBookPreview"
    />

    <button class="store__cart-fab" type="button" @click="openCart" aria-label="Open cart">
      <ShoppingCart :size="24" :stroke-width="2" aria-hidden="true" />
      <span v-if="cartCount > 0" class="store__cart-fab-count">{{ cartCount }}</span>
    </button>
  </main>
</template>

<style scoped lang="scss">
@keyframes store-waterfall {
  from { transform: translateY(0); }
  to   { transform: translateY(-50%); }
}

.store {
  :deep(.app-hero__media) {
    aspect-ratio: auto;
    border: none;
    border-radius: 0;
    overflow: visible;
    box-shadow: none;
    background: transparent;
  }

  :deep(.app-hero__inner) {
    @media (min-width: 1024px) {
      grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
      gap: var(--s-5);
    }
  }

  &__bio {
    margin-top: var(--s-5);
    padding: var(--s-5);
    background: var(--c-paper);
    border: 2px solid var(--c-ink);
    border-radius: var(--r-asym-a);
    box-shadow: var(--shadow-block-sm);
    max-width: 520px;
  }
  &__bio-title {
    font-family: var(--font-display);
    font-size: var(--fs-lg);
    margin: 0 0 var(--s-2);
    color: var(--c-ink);
  }
  &__bio-desc {
    font-family: var(--font-body);
    color: var(--c-text-muted);
    font-size: var(--fs-sm);
    line-height: var(--lh-base);
    margin: 0 0 var(--s-3);
  }
  &__bio-badges {
    display: flex;
    flex-wrap: wrap;
    gap: var(--s-2);
  }

  &__waterfall {
    position: relative;
    display: flex;
    gap: var(--s-3);
    overflow: hidden;
    width: 100%;
    max-width: 520px;
    height: clamp(420px, 50vw, 620px);
    margin-inline: auto;

    @media (min-width: 1024px) {
      max-width: 560px;
      margin-right: 0;
    }
  }

  &__waterfall-col {
    flex: 1;
    overflow: hidden;
    position: relative;
  }

  &__waterfall-track {
    display: flex;
    flex-direction: column;
    gap: var(--s-3);
    animation: store-waterfall 38s linear infinite;

    .store__waterfall-col--2 & {
      animation-duration: 52s;
      animation-delay: -18s;
    }

    .store__waterfall-col--3 & {
      animation-duration: 44s;
      animation-delay: -30s;
    }
  }

  &__waterfall-item {
    flex-shrink: 0;
    width: 100%;
    aspect-ratio: 2 / 3;
    border-radius: var(--r-sm);
    border: 2px solid var(--c-ink);
    overflow: hidden;
    background: var(--c-cream-2);
    box-shadow: var(--shadow-block-sm);

    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__waterfall-empty {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    color: var(--c-ink);
    opacity: 0.3;
  }

  &__head {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--s-3);
    text-align: center;
    margin-bottom: var(--s-6);
  }

  &__filters {
    display: flex;
    flex-wrap: wrap;
    gap: var(--s-2);
    justify-content: center;
    margin-bottom: var(--s-7);
  }
  &__filter-btn {
    background: none;
    border: 0;
    padding: 0;
    cursor: pointer;
    font: inherit;
    color: inherit;

    &:focus-visible {
      outline: 3px solid var(--c-cobalt);
      outline-offset: 3px;
      border-radius: var(--r-pill);
    }
  }

  &__state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--s-3);
    padding: var(--s-8) 0;
    color: var(--c-text-muted);
  }

  &__cta {
    text-align: center;
    color: var(--c-cream);
    display: flex;
    flex-direction: column;
    gap: var(--s-3);
    align-items: center;
  }
  &__cta-title {
    font-family: var(--font-display);
    font-size: clamp(var(--fs-3xl), 5vw, var(--fs-5xl));
    line-height: var(--lh-tight);
    color: var(--c-cream);
    margin: 0;
  }
  &__cta-lede {
    color: var(--c-cream);
    opacity: 0.85;
    max-width: 48ch;
    margin: 0 auto var(--s-4);
  }

  &__cart-fab {
    position: fixed;
    bottom: var(--s-7);
    right: var(--s-7);
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: var(--c-marigold);
    color: var(--c-ink);
    border: 2px solid var(--c-ink);
    display: grid;
    place-items: center;
    font-size: 1.5rem;
    cursor: pointer;
    box-shadow: var(--shadow-block-sm);
    z-index: 50;
    transition: transform var(--dur-base) var(--ease-out);

    &:hover { transform: translateY(-3px); }

    &-count {
      position: absolute;
      top: -6px;
      right: -6px;
      min-width: 24px;
      height: 24px;
      padding: 0 6px;
      border-radius: 12px;
      background: var(--c-fuchsia);
      color: var(--c-cream);
      font-family: var(--font-body);
      font-weight: 700;
      font-size: 0.75rem;
      display: grid;
      place-items: center;
      border: 2px solid var(--c-ink);
    }
  }
}
</style>
