<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import BlogCard from '@/components/cards/BlogCard.vue';

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
const heroDescription = ref<string>('Expert guidance on mental health, emotional wellness, and personal growth from our licensed professionals');
const isLoading = ref(true);
const error = ref<string | null>(null);

const searchInput = ref('');
const currentFilter = ref('all');

// Category mapping for consistent naming
const categoryMap: Record<string, { display: string; filter: string }> = {
  'Goals': { display: 'Goals', filter: 'goals' },
  'Growth': { display: 'Growth', filter: 'growth' },
  'Loss': { display: 'Loss', filter: 'loss' },
  'Fun': { display: 'Fun', filter: 'fun' },
  'Happiness': { display: 'Happiness', filter: 'happiness' }
};

// Compute category counts
const categoryCounts = computed(() => {
  const counts: Record<string, number> = {
    goals: 0,
    growth: 0,
    loss: 0,
    fun: 0,
    happiness: 0
  };

  blogArticles.value.forEach(article => {
    const mapping = categoryMap[article.categoryLabel];
    if (mapping) {
      counts[mapping.filter]++;
    }
  });

  return counts;
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
        authorAvatar: '👩‍⚕️',
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
const getCategoryIcon = (category: string): string => {
  return '';
};

// DOM MANIPULATION APPROACH LIKE WORKSHOPS
function setFilter(category: string) {
  currentFilter.value = category;
  filterArticles();
}

function filterArticles() {
  const filter = currentFilter.value;
  const search = searchInput.value.toLowerCase();
  const articleCards = document.querySelectorAll('.therapy-article-card');

  articleCards.forEach(card => {
    const htmlCard = card as HTMLElement;
    const category = htmlCard.dataset.category || '';
    const title = (htmlCard.querySelector('.article-title')?.textContent || '').toLowerCase();
    const excerpt = (htmlCard.querySelector('.article-excerpt')?.textContent || '').toLowerCase();

    const matchesCategory = filter === 'all' || category === filter;
    const matchesSearch = search === '' || title.includes(search) || excerpt.includes(search);

    if (matchesCategory && matchesSearch) {
      htmlCard.style.display = 'grid';
    } else {
      htmlCard.style.display = 'none';
    }
  });
}

// Watch search input
function handleSearch() {
  filterArticles();
}

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
  isLoading.value = true;

  try {
    // Fetch both blog hero and articles in parallel
    await Promise.all([fetchBlogHero(), fetchBlogArticles()]);
  } catch (e) {
    console.error('Error during data fetching:', e);
  } finally {
    isLoading.value = false;

    setTimeout(() => {
      observeFadeElements();
    }, 100);
  }
});
</script>

<template>
  <section class="therapy-hero">
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Loading blog content...</p>
    </div>

    <div v-else-if="error" class="error-container">
      <p>{{ error }}</p>
      <button @click="fetchBlogHero" class="retry-button">Retry</button>
    </div>

    <div v-else class="therapy-hero-content">
      <h1>{{ heroTitle }}</h1>
      <p>{{ heroDescription }}</p>
    </div>
  </section>

  <section class="search-filter-section">
    <div class="search-filter-content">
      <div class="search-container">
        <input
            type="text"
            class="therapy-search-input"
            placeholder="Search wellness topics..."
            v-model="searchInput"
            @input="handleSearch"
        >
        <span class="search-icon">🔍</span>
      </div>
      <div class="filter-wellness-tags">
        <span class="wellness-tag" :class="{ active: currentFilter === 'all' }" @click="setFilter('all')">All Topics</span>
        <span class="wellness-tag" :class="{ active: currentFilter === 'goals' }" @click="setFilter('goals')">🎯 Goals</span>
        <span class="wellness-tag" :class="{ active: currentFilter === 'growth' }" @click="setFilter('growth')">🌱 Growth</span>
        <span class="wellness-tag" :class="{ active: currentFilter === 'loss' }" @click="setFilter('loss')">💔 Loss</span>
        <span class="wellness-tag" :class="{ active: currentFilter === 'fun' }" @click="setFilter('fun')">🎉 Fun</span>
        <span class="wellness-tag" :class="{ active: currentFilter === 'happiness' }" @click="setFilter('happiness')">😊 Happiness</span>
      </div>
    </div>
  </section>

  <main class="therapy-blog-content">
    <section class="articles-section">
      <h2 class="wellness-section-title">Latest Insights and Musings</h2>

      <!-- Loading State -->
      <div v-if="isLoading" class="content-loading-container">
        <div class="loading-spinner"></div>
        <p>Loading blog articles...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="content-error-container">
        <p>{{ error }}</p>
        <button @click="fetchBlogArticles" class="retry-button">Retry</button>
      </div>

      <!-- Articles Grid -->
      <div v-else class="therapy-articles-grid" id="articlesGrid">
        <BlogCard
            v-for="article in blogArticles"
            :key="article.id"
            :category="article.category"
            :category-label="article.categoryLabel"
            :icon="article.icon"
            :image-url="'https://getting-there-cms.onrender.com'+article.imageUrl"
            :date="article.date"
            :read-time="article.readTime"
            :title="article.title"
            :excerpt="article.excerpt"
            :author-avatar="article.authorAvatar"
            :author-name="article.authorName"
            :author-credentials="article.authorCredentials"
            :slug="article.slug"
        />

        <div v-if="blogArticles.length === 0" class="no-articles-message">
          No articles found. Please try a different search or filter.
        </div>
      </div>
    </section>

    <aside class="therapy-sidebar">

      <div class="sidebar-wellness-section">
        <h3>Popular Topics</h3>
        <ul class="wellness-topics-list">
          <li>
            <a href="#" @click.prevent="setFilter('goals')">
              Goals
              <span class="topic-count">{{ categoryCounts.goals }} articles</span>
            </a>
          </li>
          <li>
            <a href="#" @click.prevent="setFilter('growth')">
              Growth
              <span class="topic-count">{{ categoryCounts.growth }} articles</span>
            </a>
          </li>
          <li>
            <a href="#" @click.prevent="setFilter('loss')">
              Loss
              <span class="topic-count">{{ categoryCounts.loss }} articles</span>
            </a>
          </li>
          <li>
            <a href="#" @click.prevent="setFilter('fun')">
              Fun
              <span class="topic-count">{{ categoryCounts.fun }} articles</span>
            </a>
          </li>
          <li>
            <a href="#" @click.prevent="setFilter('happiness')">
              Happiness
              <span class="topic-count">{{ categoryCounts.happiness }} articles</span>
            </a>
          </li>
        </ul>
      </div>

      <div class="sidebar-wellness-section">
        <h3>Stay Connected</h3>
        <p>Get weekly happiness tips, thoughts and notices delivered to your inbox.</p>
        <input type="email" placeholder="Your email address" class="wellness-email-input">
        <button class="wellness-subscribe-btn">Get Happiness Tips</button>
        <p class="privacy-note">We respect your privacy. Unsubscribe anytime.</p>
      </div>
    </aside>
  </main>
</template>

<style scoped lang="scss">
@import '../assets/common.scss';

.therapy-hero {
  @extend .hero-base;
  background: var(--gradient);
  color: white;
  text-align: center;
}

.therapy-hero-content {
  @extend .hero-content-base;
}

/* Hero Loading/Error States */
.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
  min-height: 200px;
}

.loading-container p,
.error-container p {
  color: white;
  font-size: 1.1rem;
  margin-top: 1rem;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-container {
  color: white;
}

.retry-button {
  background: white;
  color: var(--primary-color);
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  margin-top: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-button:hover {
  background: rgba(255, 255, 255, 0.9);
  transform: translateY(-2px);
}

/* Content Loading/Error States (not in white boxes) */
.content-loading-container,
.content-error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  min-height: 300px;
}

.content-loading-container p,
.content-error-container p {
  color: var(--text-light);
  font-size: 1.1rem;
  margin-top: 1rem;
}

.content-loading-container .loading-spinner {
  border: 4px solid rgba(74, 124, 89, 0.2);
  border-top-color: var(--primary-color);
}

.content-error-container {
  color: var(--text-dark);
}

.content-error-container .retry-button {
  background: var(--primary-color);
  color: white;
}

.content-error-container .retry-button:hover {
  background: var(--secondary-color);
}

.search-filter-section {
  background: var(--bg-light);
  padding: 2rem 0;
  border-bottom: 1px solid var(--border-light);
}

.search-filter-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  gap: 2rem;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
}

.search-container {
  flex: 1;
  min-width: 300px;
  position: relative;
  max-width: 400px;
}

.therapy-search-input {
  width: 100%;
  padding: 1rem 3rem 1rem 1rem;
  border: 2px solid var(--border-light);
  border-radius: 25px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
  color: var(--text-dark);

  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(74, 124, 89, 0.1);
  }
}

.search-icon {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-light);
  font-size: 1.1rem;
}

.filter-wellness-tags {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.wellness-tag {
  padding: 0.75rem 1.25rem;
  background: white;
  border: 2px solid var(--border-light);
  border-radius: 25px;
  color: var(--text-dark);
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover, &.active {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px var(--shadow-light);
  }
}

.therapy-blog-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 4rem;
}

.therapy-articles-grid {
  display: grid;
  gap: 2rem;
}

.no-articles-message {
  grid-column: 1 / -1;
  padding: 2rem;
  color: var(--text-light);
  font-style: italic;
}

.therapy-sidebar {
  position: sticky;
  top: 6rem;
  height: fit-content;
}

.sidebar-wellness-section {
  @extend .card-base;
  margin-bottom: 2rem;

  h3 {
    font-size: 1.3rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: var(--text-dark);
  }

  p {
    color: var(--text-light);
    line-height: 1.6;
    margin-bottom: 1rem;
  }
}

.wellness-check-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.wellness-check-btn {
  padding: 0.75rem 1rem;
  border: 2px solid var(--border-light);
  border-radius: 12px;
  background: white;
  color: var(--text-dark);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;

  &:hover {
    border-color: var(--primary-color);
    background: var(--bg-sage);
  }
}

.wellness-note {
  font-size: 0.85rem;
  color: var(--text-light);
  font-style: italic;
  margin-bottom: 0;
}

.wellness-topics-list {
  list-style: none;
  padding: 0;

  li {
    margin-bottom: 0.75rem;
  }

  a {
    color: var(--text-dark);
    text-decoration: none;
    padding: 0.75rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 10px;
    transition: all 0.3s ease;
    font-size: 0.95rem;

    &:hover {
      background: var(--bg-sage);
      color: var(--primary-color);
      padding-left: 1rem;
    }
  }
}

.topic-count {
  background: var(--primary-color);
  color: white;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 10px;
  font-weight: 600;
}

.wellness-email-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--border-light);
  border-radius: 12px;
  margin-bottom: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(74, 124, 89, 0.1);
  }
}

.wellness-subscribe-btn {
  width: 100%;
  padding: 0.75rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 0.5rem;

  &:hover {
    background: var(--secondary-color);
    transform: translateY(-2px);
  }
}

.privacy-note {
  font-size: 0.8rem;
  color: var(--text-light);
  margin: 0;
}

@media (max-width: 768px) {
  .search-filter-content {
    flex-direction: column;
    align-items: stretch;
  }

  .search-container {
    min-width: auto;
    max-width: none;
  }

  .filter-wellness-tags {
    justify-content: center;
  }

  .therapy-blog-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .therapy-sidebar {
    position: static;
    top: auto;
  }

  .wellness-check-buttons {
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>