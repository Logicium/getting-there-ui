<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { blogArticles } from '@/data/data';
import BlogCard from '@/components/cards/BlogCard.vue';

// Blog hero data (fetched from CMS)
const heroTitle = ref<string>('Wellness Insights & Resources');
const heroDescription = ref<string>('Expert guidance on mental health, emotional wellness, and personal growth from our licensed professionals');

// Fetch hero data from CMS
const fetchBlogHero = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_CMS_URL}/api/blog-page?populate=all`);
    if (!res.ok) throw new Error(`Failed to fetch blog hero: ${res.status} ${res.statusText}`);
    const json = await res.json();
    const hero = json?.data?.Hero;
    if (hero) {
      if (hero.title) heroTitle.value = hero.title;
      if (hero.description) heroDescription.value = hero.description;
    }
  } catch (e) {
    console.error(e);
    // keep defaults on error
  }
};

// Search functionality
const searchInput = ref('');
const currentFilter = ref('all');

// Filtered blog articles
const filteredArticles = computed(() => {
  const searchTerm = searchInput.value.toLowerCase();
  return blogArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm) || 
                          article.excerpt.toLowerCase().includes(searchTerm);
    const matchesFilter = currentFilter.value === 'all' || article.category === currentFilter.value;
    return matchesSearch && matchesFilter;
  });
});

function setFilter(category: string) {
  currentFilter.value = category;
}

// Fade-in animation
onMounted(() => {
  // fetch CMS hero
  fetchBlogHero();

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
  <section class="therapy-hero">
    <div class="therapy-hero-content">
      <h1>{{ heroTitle }}</h1>
      <p>{{ heroDescription }}</p>
      <div class="hero-trust-indicators">
        <span class="trust-badge">🏆 Expert-Written</span>
        <span class="trust-badge">🧠 Evidence-Based</span>
        <span class="trust-badge">💚 Compassionate Care</span>
      </div>
    </div>
  </section>

  <section class="search-filter-section">
    <div class="search-filter-content">
      <div class="search-container">
        <input type="text" class="therapy-search-input" placeholder="Search wellness topics..." v-model="searchInput">
        <span class="search-icon">🔍</span>
      </div>
      <div class="filter-wellness-tags">
        <span class="wellness-tag" :class="{ active: currentFilter === 'all' }" @click="setFilter('all')">All Topics</span>
        <span class="wellness-tag" :class="{ active: currentFilter === 'anxiety' }" @click="setFilter('anxiety')">Anxiety Support</span>
        <span class="wellness-tag" :class="{ active: currentFilter === 'depression' }" @click="setFilter('depression')">Depression Care</span>
        <span class="wellness-tag" :class="{ active: currentFilter === 'relationships' }" @click="setFilter('relationships')">Relationships</span>
        <span class="wellness-tag" :class="{ active: currentFilter === 'mindfulness' }" @click="setFilter('mindfulness')">Mindfulness</span>
        <span class="wellness-tag" :class="{ active: currentFilter === 'stress' }" @click="setFilter('stress')">Stress Management</span>
      </div>
    </div>
  </section>

  <main class="therapy-blog-content">
    <section class="articles-section">
      <h2 class="wellness-section-title">Latest Wellness Articles</h2>
      <div class="therapy-articles-grid" id="articlesGrid">
        <BlogCard 
          v-for="article in filteredArticles" 
          :key="article.id"
          :category="article.category"
          :category-label="article.categoryLabel"
          :icon="article.icon"
          :image-url="article.imageUrl"
          :date="article.date"
          :read-time="article.readTime"
          :title="article.title"
          :excerpt="article.excerpt"
          :author-avatar="article.authorAvatar"
          :author-name="article.authorName"
          :author-credentials="article.authorCredentials"
          :slug="article.slug"
        />
      </div>
    </section>

    <aside class="therapy-sidebar">
      <div class="sidebar-wellness-section">
        <h3>Quick Wellness Check</h3>
        <p>Take a moment to assess how you're feeling today.</p>
        <div class="wellness-check-buttons">
          <button class="wellness-check-btn good">😊 Good</button>
          <button class="wellness-check-btn okay">😐 Okay</button>
          <button class="wellness-check-btn struggling">😔 Struggling</button>
        </div>
        <p class="wellness-note">Remember: It's okay to not be okay. Support is always available.</p>
      </div>

      <div class="sidebar-wellness-section">
        <h3>Popular Wellness Topics</h3>
        <ul class="wellness-topics-list">
          <li><a href="#">Managing Daily Anxiety <span class="topic-count">12 articles</span></a></li>
          <li><a href="#">Depression Support <span class="topic-count">8 articles</span></a></li>
          <li><a href="#">Relationship Health <span class="topic-count">15 articles</span></a></li>
          <li><a href="#">Stress & Burnout <span class="topic-count">10 articles</span></a></li>
          <li><a href="#">Mindfulness Practice <span class="topic-count">9 articles</span></a></li>
          <li><a href="#">Self-Care Strategies <span class="topic-count">11 articles</span></a></li>
        </ul>
      </div>

      <div class="sidebar-wellness-section">
        <h3>Stay Connected</h3>
        <p>Get weekly wellness tips and gentle reminders delivered to your inbox.</p>
        <input type="email" placeholder="Your email address" class="wellness-email-input">
        <button class="wellness-subscribe-btn">Get Wellness Tips</button>
        <p class="privacy-note">We respect your privacy. Unsubscribe anytime.</p>
      </div>
    </aside>
  </main>
</template>

<style scoped>
/* Therapy Hero Section */
.therapy-hero {
  padding: 8rem 0 4rem;
  background: var(--gradient);
  color: white;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.therapy-hero::before {
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

.therapy-hero-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 2;
}

.therapy-hero h1 {
  font-size: clamp(2.5rem, 6vw, 3.5rem);
  font-weight: 700;
  margin-bottom: 1rem;
  font-family: 'Playfair Display', serif;
}

.therapy-hero p {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.hero-trust-indicators {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* Search and Filter Section */
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
}

.therapy-search-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(74, 124, 89, 0.1);
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
}

.wellness-tag:hover, .wellness-tag.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px var(--shadow-light);
}

/* Main Content */
.therapy-blog-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 4rem;
}

.wellness-section-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: var(--text-dark);
  font-family: 'Playfair Display', serif;
}

/* Articles Grid */
.therapy-articles-grid {
  display: grid;
  gap: 2rem;
}

/* Therapy Sidebar */
.therapy-sidebar {
  position: sticky;
  top: 6rem;
  height: fit-content;
}

.sidebar-wellness-section {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 30px var(--shadow-light);
  border: 1px solid var(--border-light);
}

.sidebar-wellness-section h3 {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text-dark);
}

.sidebar-wellness-section p {
  color: var(--text-light);
  line-height: 1.6;
  margin-bottom: 1rem;
}

/* Wellness Check Buttons */
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
}

.wellness-check-btn:hover {
  border-color: var(--primary-color);
  background: var(--bg-sage);
}

.wellness-note {
  font-size: 0.85rem;
  color: var(--text-light);
  font-style: italic;
  margin-bottom: 0;
}


/* Wellness Topics List */
.wellness-topics-list {
  list-style: none;
  padding: 0;
}

.wellness-topics-list li {
  margin-bottom: 0.75rem;
}

.wellness-topics-list a {
  color: var(--text-dark);
  text-decoration: none;
  padding: 0.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 10px;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.wellness-topics-list a:hover {
  background: var(--bg-sage);
  color: var(--primary-color);
  padding-left: 1rem;
}

.topic-count {
  background: var(--primary-color);
  color: white;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 10px;
  font-weight: 600;
}

/* Newsletter Signup */
.wellness-email-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--border-light);
  border-radius: 12px;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
}

.wellness-email-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(74, 124, 89, 0.1);
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
}

.wellness-subscribe-btn:hover {
  background: var(--secondary-color);
  transform: translateY(-2px);
}

.privacy-note {
  font-size: 0.8rem;
  color: var(--text-light);
  margin: 0;
}

/* Mobile Responsiveness */
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
