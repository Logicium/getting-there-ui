<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import BlogCard from '@/components/cards/BlogCard.vue'
import Pagination from '@/components/Pagination.vue'
import {
  AppButton,
  AppCard,
  AppContainer,
  AppEmptyState,
  AppEyebrow,
  AppField,
  AppGrid,
  AppHero,
  AppInput,
  AppSection,
  AppSelect,
  AppSpinner,
} from '@/components/ui'

interface BlogArticle {
  id: number;
  documentId: string;
  title: string;
  Description: string;
  Author: string;
  ArticleBody: any[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  Category: string;
  Image: {
    formats: {
      small: {
        url: string;
      };
    };
    url: string;
  };
  topics: {
    id: number;
    tag: string;
  }[];
}

const blogArticles = ref<any[]>([]);

const heroTitle = ref<string>('Wellness Insights & Resources');
const heroDescription = ref<string>('Practical guidance on emotional wellness and personal growth from our team');
const isLoading = ref(true);
const error = ref<string | null>(null);

const searchInput = ref('');
const currentFilter = ref('all');

// Pagination state
const currentPage = ref(1);
const itemsPerPage = 9;

// Category mapping for consistent naming
const categoryMap: Record<string, { display: string; filter: string }> = {
  'Goals': { display: 'Goals', filter: 'goals' },
  'Growth': { display: 'Growth', filter: 'growth' },
  'Loss': { display: 'Loss', filter: 'loss' },
  'Fun': { display: 'Fun', filter: 'fun' },
  'Happiness': { display: 'Happiness', filter: 'happiness' }
};

// Compute filtered articles based on category and search
const filteredArticles = computed(() => {
  return blogArticles.value.filter(article => {
    // Category filter
    const matchesCategory = currentFilter.value === 'all' || article.category === currentFilter.value;

    // Search filter
    const search = searchInput.value.toLowerCase();
    const matchesSearch = search === '' ||
      article.title.toLowerCase().includes(search) ||
      article.excerpt.toLowerCase().includes(search) ||
      article.categoryLabel.toLowerCase().includes(search);

    return matchesCategory && matchesSearch;
  });
});

// Featured lead post (first article)
const featuredArticle = computed(() => filteredArticles.value[0] ?? null);

// Remaining articles to paginate (excluding featured on page 1)
const remainingArticles = computed(() => {
  if (currentPage.value === 1 && featuredArticle.value) {
    return filteredArticles.value.slice(1);
  }
  return filteredArticles.value;
});

// Compute paginated articles
const paginatedArticles = computed(() => {
  const start = currentPage.value === 1 ? 0 : (currentPage.value - 1) * itemsPerPage - 1;
  const end = start + itemsPerPage;
  return remainingArticles.value.slice(start, end);
});

const fetchBlogHero = async () => {
  error.value = null;

  try {
    const res = await fetch(`${import.meta.env.VITE_CMS_URL}/api/blog-page?populate=all`);

    if (!res.ok) {
      throw new Error(`Failed to fetch blog hero: ${res.status} ${res.statusText}`);
    }

    const json = await res.json();
    const hero = json?.data?.Hero;
    if (hero) {
      if (hero.title) heroTitle.value = hero.title;
      if (hero.description) heroDescription.value = hero.description;
    }
  } catch (e) {
    console.error('Error fetching blog hero:', e);
    error.value = e instanceof Error ? e.message : 'Failed to load content';
  }
};

const fetchBlogArticles = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_CMS_URL}/api/blogs?populate=all`);

    if (!res.ok) {
      throw new Error(`Failed to fetch blog articles: ${res.status} ${res.statusText}`);
    }

    const json = await res.json();
    const articles = json?.data || [];

    // Map API response to the format expected by BlogCard component
    blogArticles.value = articles.map((article: BlogArticle) => {
      // Get the first paragraph of the article body for the excerpt
      const firstParagraph = article.ArticleBody.find(
          (item: any) => item.type === 'paragraph'
      );

      const excerpt = firstParagraph
          ? firstParagraph.children[0].text.substring(0, 150) + '...'
          : article.Description;

      // Format the date
      const date = new Date(article.publishedAt);
      const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      // Calculate read time (rough estimate: 200 words per minute)
      const wordCount = article.ArticleBody.reduce((count: number, item: any) => {
        if (item.type === 'paragraph' && item.children && item.children.length > 0) {
          return count + item.children[0].text.split(' ').length;
        }
        return count;
      }, 0);

      const readTime = Math.max(1, Math.ceil(wordCount / 200));

      // Map topics to tags
      const tags = article.topics.map((topic: any) => topic.tag);

      // Get mapped category
      const mapping = categoryMap[article.Category] || {
        display: article.Category,
        filter: article.Category.toLowerCase().replace(/\s+/g, '-')
      };

      return {
        id: article.documentId,
        title: article.title,
        excerpt: article.Description || excerpt,
        category: mapping.filter,
        categoryLabel: article.Category,
        icon: getCategoryIcon(article.Category),
        imageUrl: article.Image?.formats?.small?.url || article.Image?.url || '/backgrounds/therapy1.jpg',
        date: formattedDate,
        readTime: readTime,
        authorName: article.Author,
        authorCredentials: 'Ph.D. Educated',
        authorAvatar: '',
        slug: article.documentId,
        tags: tags
      };
    });
  } catch (e) {
    console.error('Error fetching blog articles:', e);
    error.value = e instanceof Error ? e.message : 'Failed to load blog articles';
  }
};

// Helper function to get category icon
const getCategoryIcon = (_category: string): string => {
  return '';
};

// Updated filter and search handlers
function setFilter(category: string) {
  currentFilter.value = category;
  currentPage.value = 1; // Reset to first page when filtering
}

function handleSearch() {
  currentPage.value = 1; // Reset to first page when searching
}

function handlePageChange(page: number) {
  currentPage.value = page;
  // Scroll to top of articles section
  const articlesSection = document.querySelector('.blog-articles');
  if (articlesSection) {
    articlesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

onMounted(async () => {
  isLoading.value = true;

  try {
    await Promise.all([fetchBlogHero(), fetchBlogArticles()]);
  } catch (e) {
    console.error('Error during data fetching:', e);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <main class="blog">
    <!-- HERO -->
    <AppHero variant="magazine" tone="cream" align="center">
      <template #eyebrow>
        <AppEyebrow tone="fuchsia">Wellness Journal</AppEyebrow>
      </template>
      <template #title>{{ heroTitle }}</template>
      <template #lede>
        <p>{{ heroDescription }}</p>
      </template>
    </AppHero>

    <!-- SEARCH & FILTER -->
    <AppSection tone="cream-2" pad="md">
      <AppContainer size="lg">
        <div class="blog-controls">
          <AppField label="Search" :for="'blog-search'" class="blog-controls__search">
            <AppInput
              id="blog-search"
              v-model="searchInput"
              type="search"
              placeholder="Search wellness topics..."
              @update:model-value="handleSearch"
            />
          </AppField>

          <AppField label="Topic" :for="'blog-topic'" class="blog-controls__topic">
            <AppSelect
              id="blog-topic"
              :model-value="currentFilter"
              @update:model-value="(v) => setFilter(String(v))"
            >
              <option value="all">All Topics</option>
              <option value="goals">Goals</option>
              <option value="growth">Growth</option>
              <option value="loss">Loss</option>
              <option value="fun">Fun</option>
              <option value="happiness">Happiness</option>
            </AppSelect>
          </AppField>
        </div>
      </AppContainer>
    </AppSection>

    <!-- LOADING / ERROR -->
    <AppSection v-if="isLoading" tone="cream" pad="lg">
      <AppContainer size="md">
        <div class="blog-state">
          <AppSpinner size="lg" />
          <p>Loading blog content...</p>
        </div>
      </AppContainer>
    </AppSection>

    <AppSection v-else-if="error" tone="cream" pad="lg">
      <AppContainer size="md">
        <AppEmptyState
          variant="error"
          title="Couldn't load articles"
          :message="error"
        >
          <template #actions>
            <AppButton variant="primary" @click="fetchBlogArticles">Try again</AppButton>
          </template>
        </AppEmptyState>
      </AppContainer>
    </AppSection>

    <!-- FEATURED LEAD POST -->
    <AppSection
      v-else-if="featuredArticle && currentPage === 1"
      tone="cream"
      pad="xl"
    >
      <AppContainer size="lg">
        <header class="blog-head">
          <AppEyebrow tone="marigold">Featured</AppEyebrow>
          <h2 class="u-display u-display--md">This week's lead read</h2>
        </header>

        <AppCard
          variant="postcard"
          tone="paper"
          shadow-tone="cobalt"
          :to="`/blog/${featuredArticle.slug}`"
          interactive
          pad="lg"
          class="blog-featured"
        >
          <template #media>
            <div
              class="blog-featured__media"
              :style="{ backgroundImage: `url(https://getting-there-cms.onrender.com${featuredArticle.imageUrl})` }"
            />
          </template>

          <template #eyebrow>
            <AppEyebrow tone="cobalt">{{ featuredArticle.categoryLabel }} · {{ featuredArticle.date }}</AppEyebrow>
          </template>

          <template #title>{{ featuredArticle.title }}</template>

          <p class="blog-featured__excerpt">{{ featuredArticle.excerpt }}</p>

          <template #footer>
            <span class="blog-featured__author">by <b>{{ featuredArticle.authorName }}</b></span>
            <span class="blog-featured__cta">Read the feature →</span>
          </template>
        </AppCard>
      </AppContainer>
    </AppSection>

    <!-- ARTICLES GRID -->
    <AppSection tone="cream" pad="xl" class="blog-articles">
      <AppContainer size="lg">
        <header class="blog-head">
          <AppEyebrow tone="cobalt">Latest insights</AppEyebrow>
          <h2 class="u-display u-display--md">More from the journal</h2>
        </header>

        <AppEmptyState
          v-if="!isLoading && !error && filteredArticles.length === 0"
          title="No articles found"
          message="Try a different search term or topic filter."
        >
          <template #actions>
            <AppButton variant="primary" @click="() => { searchInput = ''; setFilter('all') }">Clear filters</AppButton>
          </template>
        </AppEmptyState>

        <AppGrid v-else :min="300" gap="md">
          <BlogCard
            v-for="article in paginatedArticles"
            :key="article.id"
            :category="article.category"
            :category-label="article.categoryLabel"
            :icon="article.icon"
            :image-url="'https://getting-there-cms.onrender.com' + article.imageUrl"
            :date="article.date"
            :read-time="article.readTime"
            :title="article.title"
            :excerpt="article.excerpt"
            :author-avatar="article.authorAvatar"
            :author-name="article.authorName"
            :author-credentials="article.authorCredentials"
            :slug="article.slug"
          />
        </AppGrid>

        <Pagination
          v-if="filteredArticles.length > itemsPerPage"
          :currentPage="currentPage"
          :totalItems="filteredArticles.length"
          :itemsPerPage="itemsPerPage"
          @page-change="handlePageChange"
        />
      </AppContainer>
    </AppSection>

    <!-- POPULAR TOPICS -->
    <AppSection tone="mint" pad="xl">
      <AppContainer size="lg">
        <header class="blog-head">
          <AppEyebrow tone="fuchsia">Browse by topic</AppEyebrow>
          <h2 class="u-display u-display--md">Popular themes</h2>
        </header>

        <AppGrid :min="200" gap="sm">
          <AppButton
            v-for="topic in [
              { key: 'goals', label: 'Goals' },
              { key: 'growth', label: 'Growth' },
              { key: 'loss', label: 'Loss' },
              { key: 'fun', label: 'Fun' },
              { key: 'happiness', label: 'Happiness' },
            ]"
            :key="topic.key"
            :variant="currentFilter === topic.key ? 'primary' : 'secondary'"
            block
            @click="setFilter(topic.key)"
          >
            {{ topic.label }}
          </AppButton>
        </AppGrid>
      </AppContainer>
    </AppSection>
  </main>
</template>

<style scoped lang="scss">
.blog-head {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--s-3);
  text-align: center;
  margin-bottom: var(--s-7);
}

.blog-controls {
  display: grid;
  gap: var(--s-4);

  @media (min-width: 720px) {
    grid-template-columns: 2fr 1fr;
    align-items: end;
  }
}

.blog-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--s-4);
  text-align: center;
  color: var(--c-text-muted);
}

.blog-featured {
  &__media {
    aspect-ratio: 16 / 9;
    background-color: var(--c-cream-2);
    background-size: cover;
    background-position: center;
    width: 100%;
    height: 100%;
    min-height: 220px;
  }

  &__excerpt {
    margin: 0;
    font-size: var(--fs-md);
    color: var(--c-text-muted);
    line-height: var(--lh-base);
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__author,
  &__cta {
    font-family: var(--font-body);
    font-size: var(--fs-sm);
  }

  &__cta {
    color: var(--c-cobalt);
    font-weight: 700;
  }

  // Horizontal split at desktop so the whole card fits in the fold.
  @media (min-width: 760px) {
    flex-direction: row;
    align-items: stretch;

    :deep(.app-card__media) {
      flex: 0 0 46%;
      border-bottom: none;
      border-right: 2px solid var(--c-ink);
    }
    :deep(.app-card__body) {
      flex: 1 1 auto;
      justify-content: center;
    }
    :deep(.app-card__title) {
      font-size: clamp(var(--fs-xl), 2.4vw, var(--fs-2xl));
      line-height: var(--lh-tight);
    }
    & { max-height: 380px; }
    &__media { aspect-ratio: auto; }
  }
}
</style>
