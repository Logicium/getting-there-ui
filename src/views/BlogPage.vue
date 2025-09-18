<script setup lang="ts">
import { onMounted, ref } from 'vue';

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

function filterArticles() {
  const searchTerm = searchInput.value.toLowerCase();
  const articles = document.querySelectorAll('.article-card');

  articles.forEach(article => {
    const titleElement = article.querySelector('.article-title');
    const excerptElement = article.querySelector('.article-excerpt');

    if (!titleElement || !titleElement.textContent || !excerptElement || !excerptElement.textContent) return;

    const title = titleElement.textContent.toLowerCase();
    const excerpt = excerptElement.textContent.toLowerCase();
    const category = (article as HTMLElement).dataset.category;

    const matchesSearch = title.includes(searchTerm) || excerpt.includes(searchTerm);
    const matchesFilter = currentFilter.value === 'all' || category === currentFilter.value;

    if (matchesSearch && matchesFilter) {
      (article as HTMLElement).style.display = 'grid';
    } else {
      (article as HTMLElement).style.display = 'none';
    }
  });
}

function setFilter(category: string) {
  currentFilter.value = category;
  filterArticles();
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
        <input type="text" class="therapy-search-input" placeholder="Search wellness topics..." v-model="searchInput" @input="filterArticles">
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

        <article class="therapy-article-card fade-in" data-category="anxiety">
          <div class="article-therapy-image">
            <div class="therapy-category-badge anxiety">Anxiety Support</div>
            <div class="article-visual-icon">🧘‍♀️</div>
          </div>
          <div class="article-therapy-content">
            <div class="article-meta-therapy">
              <span class="article-date-therapy">March 15, 2024</span>
              <span class="read-time">7 min read</span>
            </div>
            <h3 class="article-title">Understanding and Managing Anxiety in Daily Life</h3>
            <p class="article-excerpt">Learn practical, evidence-based techniques to recognize anxiety triggers and develop healthy coping strategies that fit into your everyday routine.</p>
            <div class="article-author-therapy">
              <div class="author-avatar-therapy">👩‍⚕️</div>
              <div class="author-info-therapy">
                <span class="author-name">Dr. Sarah Mitchell</span>
                <span class="author-credentials">Licensed Clinical Psychologist</span>
              </div>
            </div>
            <router-link :to="`/blog/anxiety-daily-life`" class="therapy-read-more">
              Continue Reading →
            </router-link>
          </div>
        </article>

        <article class="therapy-article-card fade-in" data-category="depression">
          <div class="article-therapy-image">
            <div class="therapy-category-badge depression">Depression Care</div>
            <div class="article-visual-icon">🌱</div>
          </div>
          <div class="article-therapy-content">
            <div class="article-meta-therapy">
              <span class="article-date-therapy">March 12, 2024</span>
              <span class="read-time">6 min read</span>
            </div>
            <h3 class="article-title">Small Steps to Brighter Days: Depression Recovery</h3>
            <p class="article-excerpt">Discover gentle, compassionate approaches to depression recovery that honor your pace and celebrate small victories along the way.</p>
            <div class="article-author-therapy">
              <div class="author-avatar-therapy">👨‍⚕️</div>
              <div class="author-info-therapy">
                <span class="author-name">Dr. Michael Chen</span>
                <span class="author-credentials">Licensed Therapist, LCSW</span>
              </div>
            </div>
            <a href="#" class="therapy-read-more">Continue Reading →</a>
          </div>
        </article>

        <article class="therapy-article-card fade-in" data-category="relationships">
          <div class="article-therapy-image">
            <div class="therapy-category-badge relationships">Relationships</div>
            <div class="article-visual-icon">💕</div>
          </div>
          <div class="article-therapy-content">
            <div class="article-meta-therapy">
              <span class="article-date-therapy">March 10, 2024</span>
              <span class="read-time">8 min read</span>
            </div>
            <h3 class="article-title">Building Healthy Communication in Relationships</h3>
            <p class="article-excerpt">Learn the essential skills for expressing your needs, setting boundaries, and creating deeper connections with the people who matter most.</p>
            <div class="article-author-therapy">
              <div class="author-avatar-therapy">👩‍🏫</div>
              <div class="author-info-therapy">
                <span class="author-name">Lisa Rodriguez</span>
                <span class="author-credentials">Marriage & Family Therapist</span>
              </div>
            </div>
            <a href="#" class="therapy-read-more">Continue Reading →</a>
          </div>
        </article>

        <article class="therapy-article-card fade-in" data-category="mindfulness">
          <div class="article-therapy-image">
            <div class="therapy-category-badge mindfulness">Mindfulness</div>
            <div class="article-visual-icon">🧘</div>
          </div>
          <div class="article-therapy-content">
            <div class="article-meta-therapy">
              <span class="article-date-therapy">March 8, 2024</span>
              <span class="read-time">5 min read</span>
            </div>
            <h3 class="article-title">5-Minute Mindfulness for Busy Lives</h3>
            <p class="article-excerpt">Simple mindfulness practices that can be integrated into your daily routine, perfect for those moments when you need to find calm in the chaos.</p>
            <div class="article-author-therapy">
              <div class="author-avatar-therapy">👨‍🎓</div>
              <div class="author-info-therapy">
                <span class="author-name">Dr. James Wilson</span>
                <span class="author-credentials">Mindfulness-Based Therapist</span>
              </div>
            </div>
            <a href="#" class="therapy-read-more">Continue Reading →</a>
          </div>
        </article>

        <article class="therapy-article-card fade-in" data-category="stress">
          <div class="article-therapy-image">
            <div class="therapy-category-badge stress">Stress Management</div>
            <div class="article-visual-icon">🌸</div>
          </div>
          <div class="article-therapy-content">
            <div class="article-meta-therapy">
              <span class="article-date-therapy">March 5, 2024</span>
              <span class="read-time">6 min read</span>
            </div>
            <h3 class="article-title">Creating Your Personal Stress Relief Toolkit</h3>
            <p class="article-excerpt">Build a personalized collection of stress management techniques that work specifically for your lifestyle, personality, and unique challenges.</p>
            <div class="article-author-therapy">
              <div class="author-avatar-therapy">👩‍⚕️</div>
              <div class="author-info-therapy">
                <span class="author-name">Dr. Sarah Mitchell</span>
                <span class="author-credentials">Licensed Clinical Psychologist</span>
              </div>
            </div>
            <a href="#" class="therapy-read-more">Continue Reading →</a>
          </div>
        </article>

        <article class="therapy-article-card fade-in" data-category="anxiety">
          <div class="article-therapy-image">
            <div class="therapy-category-badge anxiety">Anxiety Support</div>
            <div class="article-visual-icon">🌊</div>
          </div>
          <div class="article-therapy-content">
            <div class="article-meta-therapy">
              <span class="article-date-therapy">March 3, 2024</span>
              <span class="read-time">7 min read</span>
            </div>
            <h3 class="article-title">When Worry Becomes Overwhelming: Seeking Support</h3>
            <p class="article-excerpt">Understanding when anxiety might need professional support and how to take that important first step toward healing and recovery.</p>
            <div class="article-author-therapy">
              <div class="author-avatar-therapy">👨‍⚕️</div>
              <div class="author-info-therapy">
                <span class="author-name">Dr. Michael Chen</span>
                <span class="author-credentials">Licensed Therapist, LCSW</span>
              </div>
            </div>
            <a href="#" class="therapy-read-more">Continue Reading →</a>
          </div>
        </article>

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

.therapy-article-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 30px var(--shadow-light);
  transition: all 0.3s ease;
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 0;
  border: 1px solid var(--border-light);
}

.therapy-article-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px var(--shadow-medium);
}

.article-therapy-image {
  background: var(--bg-sage);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.therapy-category-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
  color: white;
}

.therapy-category-badge.anxiety {
  background: var(--soft-blue);
}

.therapy-category-badge.depression {
  background: var(--success-color);
}

.therapy-category-badge.relationships {
  background: var(--accent-color);
}

.therapy-category-badge.mindfulness {
  background: var(--lavender);
  color: var(--text-dark);
}

.therapy-category-badge.stress {
  background: var(--warning-color);
}

.article-visual-icon {
  font-size: 3rem;
  opacity: 0.8;
}

.article-therapy-content {
  padding: 2rem;
  display: flex;
  flex-direction: column;
}

.article-meta-therapy {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  color: var(--text-light);
  font-size: 0.9rem;
}

.article-date-therapy, .read-time {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.article-title {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text-dark);
  line-height: 1.4;
}

.article-excerpt {
  color: var(--text-light);
  margin-bottom: 1.5rem;
  line-height: 1.6;
  flex-grow: 1;
}

.article-author-therapy {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.author-avatar-therapy {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--bg-sage);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  border: 2px solid var(--primary-color);
}

.author-info-therapy {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-weight: 600;
  color: var(--text-dark);
  font-size: 0.9rem;
}

.author-credentials {
  color: var(--text-light);
  font-size: 0.8rem;
}

.therapy-read-more {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
  align-self: flex-start;
}

.therapy-read-more:hover {
  color: var(--secondary-color);
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

/* Crisis Resources */
.crisis-resource {
  background: rgba(231, 111, 81, 0.1);
  padding: 1.5rem;
  border-radius: 12px;
  border-left: 4px solid var(--warning-color);
}

.crisis-resource h4 {
  color: var(--warning-color);
  margin-bottom: 0.75rem;
  font-size: 1rem;
}

.crisis-resource p {
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.crisis-link {
  display: block;
  color: var(--warning-color);
  text-decoration: none;
  font-weight: 600;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  background: rgba(231, 111, 81, 0.1);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.crisis-link:hover {
  background: var(--warning-color);
  color: white;
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

  .therapy-article-card {
    grid-template-columns: 1fr;
  }

  .article-therapy-image {
    min-height: 150px;
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