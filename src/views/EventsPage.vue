<script setup lang="ts">
import { onMounted, ref } from 'vue';

// Interface for the hero section data
interface HeroSection {
  id: number;
  title: string;
  description: string;
  tag: string | null;
  imagecarousel: null | any;
  image: null | any;
  stats: any[];
}

// Interface for the events page data
interface EventsPageData {
  data: {
    id: number;
    documentId: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    Hero: HeroSection;
  };
  meta: Record<string, any>;
}

// State for hero section data
const heroData = ref<HeroSection | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);

// Filter functionality
const currentFilter = ref('all');

function setFilter(filter: string) {
  currentFilter.value = filter;
  filterEvents();
}

function filterEvents() {
  const filter = currentFilter.value;
  const eventCards = document.querySelectorAll('.therapy-event-card');

  eventCards.forEach(card => {
    const htmlCard = card as HTMLElement;
    const category = htmlCard.dataset.category;
    if (filter === 'all' || category === filter) {
      htmlCard.style.display = 'block';
    } else {
      htmlCard.style.display = 'none';
    }
  });
}

// Sort events by date
function sortEventsByDate() {
  const grid = document.getElementById('eventsGrid');
  if (!grid) return;

  const events = Array.from(document.querySelectorAll('.therapy-event-card'));

  events.sort((a, b) => {
    const htmlA = a as HTMLElement;
    const htmlB = b as HTMLElement;
    const dateA = new Date(htmlA.dataset.date || '');
    const dateB = new Date(htmlB.dataset.date || '');
    return dateA.getTime() - dateB.getTime();
  });

  events.forEach(event => grid.appendChild(event));
}

// Function to observe fade-in elements
const observeFadeElements = () => {
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
};

// Function to fetch events page data from CMS
const fetchPageData = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    const cmsUrl = import.meta.env.VITE_CMS_URL || 'https://getting-there-cms.onrender.com';
    const response = await fetch(`${cmsUrl}/api/events-page?populate=all`);

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }

    const data: EventsPageData = await response.json();
    heroData.value = data.data.Hero;

    // Wait for the DOM to update with the new data
    setTimeout(() => {
      observeFadeElements();
    }, 100);
  } catch (err) {
    console.error('Error fetching page data:', err);
    error.value = err instanceof Error ? err.message : 'An unknown error occurred';
  } finally {
    isLoading.value = false;
  }
};

// Fade-in animation
onMounted(() => {
  // Fetch page data from CMS
  fetchPageData();

  // Initialize
  sortEventsByDate();

  // Initial observation of fade-in elements
  observeFadeElements();
});
</script>

<template>
  <section class="therapy-events-hero">
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Loading content...</p>
    </div>

    <div v-else-if="error" class="error-container">
      <p>{{ error }}</p>
      <button @click="fetchPageData" class="retry-button">Retry</button>
    </div>

    <div v-else-if="heroData" class="therapy-events-hero-content">
      <h1>{{ heroData.title }}</h1>
      <p>{{ heroData.description }}</p>
      <div class="hero-wellness-indicators">
        <span class="trust-badge">🏆 Licensed Facilitators</span>
        <span class="trust-badge">🤝 Safe Spaces</span>
        <span class="trust-badge">💚 Evidence-Based Approaches</span>
      </div>
    </div>
  </section>

  <section class="therapy-events-filter">
    <div class="filter-wellness-content">
      <div class="filter-wellness-buttons">
        <button class="wellness-filter-btn" :class="{ active: currentFilter === 'all' }" @click="setFilter('all')">
          📅 All Programs
        </button>
        <button class="wellness-filter-btn" :class="{ active: currentFilter === 'therapy' }" @click="setFilter('therapy')">
          🧠 Therapy Groups
        </button>
        <button class="wellness-filter-btn" :class="{ active: currentFilter === 'mindfulness' }" @click="setFilter('mindfulness')">
          🧘 Mindfulness
        </button>
        <button class="wellness-filter-btn" :class="{ active: currentFilter === 'support' }" @click="setFilter('support')">
          🤝 Support Groups
        </button>
        <button class="wellness-filter-btn" :class="{ active: currentFilter === 'online' }" @click="setFilter('online')">
          💻 Virtual Sessions
        </button>
      </div>
    </div>
  </section>

  <main class="therapy-events-content">

    <!-- Featured Event -->
    <div class="featured-therapy-event fade-in">
      <div class="featured-wellness-badge">Featured Program</div>
      <div class="featured-therapy-image">
        <div class="featured-visual-icon">🌱</div>
      </div>
      <div class="featured-therapy-content">
        <h2 class="featured-therapy-title">Anxiety Support Circle</h2>
        <p class="featured-therapy-description">
          A gentle, supportive group environment where you can learn practical anxiety management techniques while connecting with others who understand your journey. Led by licensed therapists in a judgment-free space.
        </p>
        <div class="featured-therapy-details">
          <div class="therapy-event-detail">
            <span class="therapy-event-detail-icon">📅</span>
            <span>Every Tuesday, Starting April 15</span>
          </div>
          <div class="therapy-event-detail">
            <span class="therapy-event-detail-icon">📍</span>
            <span>Denver Wellness Center</span>
          </div>
          <div class="therapy-event-detail">
            <span class="therapy-event-detail-icon">⏰</span>
            <span>6:00 PM - 7:30 PM</span>
          </div>
          <div class="therapy-event-detail">
            <span class="therapy-event-detail-icon">👥</span>
            <span>Small group (8-10 participants)</span>
          </div>
        </div>
        <router-link :to="'/events/anxiety-support'" class="featured-therapy-btn">Join Our Circle - $60/session</router-link>
      </div>
    </div>

    <h2 class="wellness-section-title fade-in">All Programs & Support Groups</h2>

    <div class="therapy-events-grid" id="eventsGrid">

      <div class="therapy-event-card fade-in" data-category="mindfulness" data-date="2024-04-20">
        <div class="therapy-event-image">
          <div class="therapy-event-status status-available">Open</div>
          <div class="event-visual-icon">🧘‍♀️</div>
        </div>
        <div class="therapy-event-content">
          <div class="therapy-event-date">📅 Every Saturday, Starting April 20</div>
          <h3 class="therapy-event-title">Mindful Healing Workshop</h3>
          <p class="therapy-event-description">
            Learn mindfulness-based stress reduction techniques in a supportive group setting. Perfect for beginners and those seeking deeper practice.
          </p>
          <div class="therapy-event-details">
            <div class="therapy-event-detail">
              <span class="therapy-event-detail-icon">📍</span>
              <span>Colorado Springs Wellness Center</span>
            </div>
            <div class="therapy-event-detail">
              <span class="therapy-event-detail-icon">⏰</span>
              <span>10:00 AM - 12:00 PM</span>
            </div>
            <div class="therapy-event-detail">
              <span class="therapy-event-detail-icon">👥</span>
              <span>12 spots available</span>
            </div>
          </div>
          <div class="therapy-event-footer">
            <div class="therapy-event-price">$45/session</div>
            <router-link :to="'/events/mindful-healing'" class="therapy-event-btn">Learn More</router-link>
          </div>
        </div>
      </div>

      <div class="therapy-event-card fade-in" data-category="support" data-date="2024-04-25">
        <div class="therapy-event-image">
          <div class="therapy-event-status status-available">Open</div>
          <div class="event-visual-icon">💔</div>
        </div>
        <div class="therapy-event-content">
          <div class="therapy-event-date">📅 Every Thursday, Starting April 25</div>
          <h3 class="therapy-event-title">Grief & Loss Support Group</h3>
          <p class="therapy-event-description">
            A compassionate space for those navigating loss. Share your journey with others who understand, guided by experienced grief counselors.
          </p>
          <div class="therapy-event-details">
            <div class="therapy-event-detail">
              <span class="therapy-event-detail-icon">📍</span>
              <span>Boulder Community Center</span>
            </div>
            <div class="therapy-event-detail">
              <span class="therapy-event-detail-icon">⏰</span>
              <span>7:00 PM - 8:30 PM</span>
            </div>
            <div class="therapy-event-detail">
              <span class="therapy-event-detail-icon">👥</span>
              <span>6-8 participants (intimate setting)</span>
            </div>
          </div>
          <div class="therapy-event-footer">
            <div class="therapy-event-price">$40/session</div>
            <router-link :to="'/events/grief-support'" class="therapy-event-btn">Join Group</router-link>
          </div>
        </div>
      </div>

      <div class="therapy-event-card fade-in" data-category="online" data-date="2024-05-02">
        <div class="therapy-event-image">
          <div class="therapy-event-status status-filling">Filling Fast</div>
          <div class="event-visual-icon">💻</div>
        </div>
        <div class="therapy-event-content">
          <div class="therapy-event-date">📅 May 2, 2024</div>
          <h3 class="therapy-event-title">Virtual Depression Support Circle</h3>
          <p class="therapy-event-description">
            Connect with others from the comfort of your home. A safe, confidential online space for sharing experiences and learning coping strategies.
          </p>
          <div class="therapy-event-details">
            <div class="therapy-event-detail">
              <span class="therapy-event-detail-icon">💻</span>
              <span>Secure Online Platform</span>
            </div>
            <div class="therapy-event-detail">
              <span class="therapy-event-detail-icon">⏰</span>
              <span>6:00 PM - 7:30 PM</span>
            </div>
            <div class="therapy-event-detail">
              <span class="therapy-event-detail-icon">👥</span>
              <span>3 spots remaining</span>
            </div>
          </div>
          <div class="therapy-event-footer">
            <div class="therapy-event-price">$50/session</div>
            <router-link :to="'/events/virtual-depression'" class="therapy-event-btn">Register Now</router-link>
          </div>
        </div>
      </div>

      <div class="therapy-event-card fade-in" data-category="therapy" data-date="2024-05-10">
        <div class="therapy-event-image">
          <div class="therapy-event-status status-available">Open</div>
          <div class="event-visual-icon">💕</div>
        </div>
        <div class="therapy-event-content">
          <div class="therapy-event-date">📅 May 10, 2024</div>
          <h3 class="therapy-event-title">Couples Communication Workshop</h3>
          <p class="therapy-event-description">
            Strengthen your relationship with evidence-based communication techniques. Learn to express needs, resolve conflicts, and deepen intimacy.
          </p>
          <div class="therapy-event-details">
            <div class="therapy-event-detail">
              <span class="therapy-event-detail-icon">📍</span>
              <span>Fort Collins Therapy Center</span>
            </div>
            <div class="therapy-event-detail">
              <span class="therapy-event-detail-icon">⏰</span>
              <span>1:00 PM - 4:00 PM</span>
            </div>
            <div class="therapy-event-detail">
              <span class="therapy-event-detail-icon">👥</span>
              <span>6 couples maximum</span>
            </div>
          </div>
          <div class="therapy-event-footer">
            <div class="therapy-event-price">$120/couple</div>
            <router-link :to="'/events/couples-communication'" class="therapy-event-btn">Register</router-link>
          </div>
        </div>
      </div>

      <div class="therapy-event-card fade-in" data-category="support" data-date="2024-05-18">
        <div class="therapy-event-image">
          <div class="therapy-event-status status-waitlist">Waitlist</div>
          <div class="event-visual-icon">👥</div>
        </div>
        <div class="therapy-event-content">
          <div class="therapy-event-date">📅 May 18, 2024</div>
          <h3 class="therapy-event-title">Trauma Recovery Support Group</h3>
          <p class="therapy-event-description">
            A gentle, trauma-informed support group for survivors. Focus on healing, resilience, and post-traumatic growth in a safe environment.
          </p>
          <div class="therapy-event-details">
            <div class="therapy-event-detail">
              <span class="therapy-event-detail-icon">📍</span>
              <span>Denver Trauma Center</span>
            </div>
            <div class="therapy-event-detail">
              <span class="therapy-event-detail-icon">⏰</span>
              <span>6:00 PM - 7:30 PM</span>
            </div>
            <div class="therapy-event-detail">
              <span class="therapy-event-detail-icon">👥</span>
              <span>Currently full - waitlist available</span>
            </div>
          </div>
          <div class="therapy-event-footer">
            <div class="therapy-event-price">$65/session</div>
            <button class="therapy-event-btn waitlist-btn">Join Waitlist</button>
          </div>
        </div>
      </div>

      <div class="therapy-event-card fade-in" data-category="mindfulness" data-date="2024-05-25">
        <div class="therapy-event-image">
          <div class="therapy-event-status status-available">Open</div>
          <div class="event-visual-icon">🌸</div>
        </div>
        <div class="therapy-event-content">
          <div class="therapy-event-date">📅 May 25, 2024</div>
          <h3 class="therapy-event-title">Self-Compassion & Healing Circle</h3>
          <p class="therapy-event-description">
            Learn to treat yourself with the same kindness you'd offer a good friend. Develop self-compassion practices that promote healing and growth.
          </p>
          <div class="therapy-event-details">
            <div class="therapy-event-detail">
              <span class="therapy-event-detail-icon">📍</span>
              <span>Pueblo Wellness Center</span>
            </div>
            <div class="therapy-event-detail">
              <span class="therapy-event-detail-icon">⏰</span>
              <span>2:00 PM - 4:00 PM</span>
            </div>
            <div class="therapy-event-detail">
              <span class="therapy-event-detail-icon">👥</span>
              <span>10 spots available</span>
            </div>
          </div>
          <div class="therapy-event-footer">
            <div class="therapy-event-price">$55/session</div>
            <router-link :to="'/events/self-compassion'" class="therapy-event-btn">Join Circle</router-link>
          </div>
        </div>
      </div>

    </div>

    <!-- Support Information Section -->
    <section class="therapy-support-info fade-in">
      <div class="support-info-content">
        <h3>🤝 Commitment to Your Safety & Comfort</h3>
        <div class="support-info-grid">
          <div class="support-info-item">
            <h4>Confidential Environment</h4>
            <p>All our groups maintain strict confidentiality. What's shared in group stays in group.</p>
          </div>
          <div class="support-info-item">
            <h4>Licensed Facilitators</h4>
            <p>Every group is led by licensed mental health professionals with specialized training.</p>
          </div>
          <div class="support-info-item">
            <h4>Trauma-Informed Care</h4>
            <p>Our approach prioritizes safety, trustworthiness, and cultural humility in all interactions.</p>
          </div>
          <div class="support-info-item">
            <h4>Sliding Scale Available</h4>
            <p>Financial assistance available. Your healing shouldn't depend on your ability to pay.</p>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
/* Therapy Events Hero Section */
.therapy-events-hero {
  padding: 8rem 0 4rem;
  background: var(--gradient);
  color: white;
  text-align: center;
  position: relative;
  overflow: hidden;
  min-height: 300px;
}

/* Loading and Error Styles */
.loading-container, .error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2rem;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-container p {
  color: white;
  margin-bottom: 1rem;
}

.retry-button {
  background: white;
  color: var(--primary-color);
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.therapy-events-hero::before {
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

.therapy-events-hero-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 2;
}

.therapy-events-hero h1 {
  font-size: clamp(2.5rem, 6vw, 3.5rem);
  font-weight: 700;
  margin-bottom: 1rem;
  font-family: 'Playfair Display', serif;
}

.therapy-events-hero p {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.hero-wellness-indicators {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* Filter Section */
.therapy-events-filter {
  background: var(--bg-light);
  padding: 2rem 0;
  border-bottom: 1px solid var(--border-light);
}

.filter-wellness-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  gap: 2rem;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
}

.filter-wellness-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.wellness-filter-btn {
  padding: 0.75rem 1.5rem;
  background: white;
  border: 2px solid var(--border-light);
  border-radius: 25px;
  color: var(--text-dark);
  font-weight: 600;
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.wellness-filter-btn:hover, .wellness-filter-btn.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px var(--shadow-light);
}

/* Main Content */
.therapy-events-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
}

.wellness-section-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 3rem;
  color: var(--text-dark);
  font-family: 'Playfair Display', serif;
}

/* Events Grid */
.therapy-events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.therapy-event-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 30px var(--shadow-light);
  transition: all 0.4s ease;
  position: relative;
  border: 1px solid var(--border-light);
}

.therapy-event-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 50px var(--shadow-medium);
}

.therapy-event-image {
  height: 180px;
  background: var(--bg-sage);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.event-visual-icon {
  font-size: 3.5rem;
  opacity: 0.8;
}

.therapy-event-status {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
}

.status-available {
  background: var(--success-color);
  color: white;
}

.status-filling {
  background: var(--warning-color);
  color: white;
}

.status-waitlist {
  background: var(--text-light);
  color: white;
}

.therapy-event-content {
  padding: 2rem;
}

.therapy-event-date {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--primary-color);
  font-weight: 600;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.therapy-event-title {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text-dark);
  line-height: 1.3;
}

.therapy-event-description {
  color: var(--text-light);
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.therapy-event-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.therapy-event-detail {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--text-light);
  font-size: 0.9rem;
}

.therapy-event-detail-icon {
  width: 20px;
  text-align: center;
}

.therapy-event-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.therapy-event-price {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-dark);
}

.therapy-event-btn {
  background: var(--primary-color);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.therapy-event-btn:hover {
  background: var(--secondary-color);
  transform: translateY(-2px);
}

.waitlist-btn {
  background: var(--text-light);
  cursor: default;
}

.waitlist-btn:hover {
  background: var(--text-light);
  transform: none;
}

/* Featured Event */
.featured-therapy-event {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 15px 40px var(--shadow-medium);
  margin-bottom: 4rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  position: relative;
  border: 1px solid var(--border-light);
}

.featured-wellness-badge {
  position: absolute;
  top: 2rem;
  left: 2rem;
  background: var(--accent-color);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 15px;
  font-weight: 700;
  font-size: 0.9rem;
  z-index: 2;
}

.featured-therapy-image {
  background: var(--gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  min-height: 350px;
}

.featured-visual-icon {
  font-size: 5rem;
  opacity: 0.8;
  color: white;
}

.featured-therapy-content {
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.featured-therapy-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text-dark);
  font-family: 'Playfair Display', serif;
}

.featured-therapy-description {
  font-size: 1.1rem;
  color: var(--text-light);
  line-height: 1.6;
  margin-bottom: 2rem;
}

.featured-therapy-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.featured-therapy-btn {
  background: var(--accent-color);
  color: white;
  padding: 1rem 2rem;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 700;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  text-align: center;
  box-shadow: 0 8px 25px rgba(244, 162, 97, 0.3);
}

.featured-therapy-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(244, 162, 97, 0.4);
}

/* Support Information Section */
.therapy-support-info {
  background: var(--bg-sage);
  padding: 3rem;
  border-radius: 20px;
  margin-top: 2rem;
  border: 1px solid var(--border-light);
}

.support-info-content h3 {
  text-align: center;
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: var(--text-dark);
}

.support-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.support-info-item {
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 5px 20px var(--shadow-light);
  text-align: center;
}

.support-info-item h4 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.support-info-item p {
  color: var(--text-light);
  line-height: 1.5;
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .therapy-events-grid {
    grid-template-columns: 1fr;
  }

  .featured-therapy-event {
    grid-template-columns: 1fr;
  }

  .featured-therapy-content {
    padding: 2rem;
  }

  .featured-therapy-details {
    grid-template-columns: 1fr;
  }

  .filter-wellness-content {
    justify-content: center;
  }

  .therapy-event-footer {
    flex-direction: column;
    align-items: stretch;
  }

  .support-info-grid {
    grid-template-columns: 1fr;
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
