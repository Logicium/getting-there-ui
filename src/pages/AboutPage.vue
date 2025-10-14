<script setup lang="ts">
import { onMounted, ref } from 'vue';

// CMS base URL
const CMS_BASE = (import.meta.env.VITE_CMS_URL || '').toString().trim().replace(/\/$/, '');

// State and data fetching
const hero = ref<any>(null);
const history = ref<any>(null);
const mission = ref<any>(null);
const cards = ref<any>(null);
const action = ref<any>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);

const defaultStats = [
  { id: 1, name: 'Lives Transformed', statistic: 10001 },
  { id: 2, name: 'Years of Service', statistic: 16 },
  { id: 3, name: 'Client Satisfaction', statistic: 95 },
];

function getStatSuffix(s: { name: string }) {
  const name = (s?.name || '').toLowerCase();
  if (name.includes('satisfaction')) return '%';
  if (name.includes('years')) return '+';
  return '';
}

function mediaUrl(file: any): string {
  const fmts = file.formats || {};
  const url = (fmts.medium?.url) || (fmts.large?.url) || file.url;
  // If already absolute
  if (/^https?:\/\//i.test(url)) return url;
  return 'https://getting-there-cms.onrender.com' + url;
}

async function fetchHero() {
  isLoading.value = true;
  error.value = null;

  try {
    const res = await fetch(`${import.meta.env.VITE_CMS_URL}/api/about?populate=all`);

    if (!res.ok) {
      throw new Error(`Failed to fetch about data: ${res.status} ${res.statusText}`);
    }

    const json = await res.json();
    hero.value = json?.data?.hero || null;
    history.value = json?.data?.history || null;
    mission.value = json?.data?.mission || null;
    cards.value = json?.data?.cards || null;
    action.value = json?.data?.action || null;
  } catch (e) {
    console.error('Failed to load about hero', e);
    error.value = e instanceof Error ? e.message : 'Failed to load content';
  } finally {
    isLoading.value = false;
  }
}

// Animation observers
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

  // Observe all animated elements
  document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
    observer.observe(el as Element);
  });

  // Counter animation for stats
  function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');

    counters.forEach(counter => {
      const el = counter as HTMLElement;
      const targetAttr = el.getAttribute('data-target') || '0';
      const target = parseInt(targetAttr.replace(/\D/g, ''));
      const suffix = el.getAttribute('data-suffix') || '';
      let current = 0;
      const increment = target / 50;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          (counter as HTMLElement).textContent = target + suffix;
          clearInterval(timer);
        } else {
          (counter as HTMLElement).textContent = Math.ceil(current) + suffix;
        }
      }, 50);
    });
  }

  // Start counter animation when hero section is visible
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(animateCounters, 1000);
        heroObserver.disconnect();
      }
    });
  });

  const heroSection = document.querySelector('.about-hero');
  if (heroSection) {
    heroObserver.observe(heroSection);
  }
}

onMounted(async () => {
  await fetchHero();

  // Wait for DOM to update, then observe elements
  setTimeout(() => {
    observeFadeElements();
  }, 100);
});
</script>

<template>
  <section class="about-hero">
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Loading about content...</p>
    </div>

    <div v-else-if="error" class="error-container">
      <p>{{ error }}</p>
      <button @click="fetchHero" class="retry-button">Retry</button>
    </div>

    <div v-else class="about-hero-content">
      <div class="hero-text">
        <div class="hero-badge">{{ (hero && hero.tag) || 'Trusted Mental Wellness Support' }}</div>
        <h1>{{ (hero && hero.title) || 'Compassionate guidance for lasting change' }}</h1>
        <p>{{ (hero && hero.description) || 'For over a decade, Getting There has been a beacon of hope for individuals seeking emotional wellness and personal growth. Our evidence-based approach, combined with genuine care, has helped thousands find their path to healing and happiness.' }}</p>

        <div class="hero-stats">
          <div class="stat-item" v-for="s in (hero && hero.stats ? hero.stats : defaultStats)" :key="s.id">
            <span class="stat-number" :data-target="s.statistic" :data-suffix="getStatSuffix(s)">0</span>
            <span class="stat-label">{{ s.name }}</span>
          </div>
        </div>
      </div>

      <div class="hero-visual">
        <div class="visual-circle"></div>
        <div class="visual-circle"></div>
        <div class="visual-circle"></div>
        <div class="visual-center">
          <template v-if="hero && hero.image">
            <img :src="mediaUrl(hero.image) || ''" :alt="hero.image.alternativeText || hero.title || 'Hero image'" />
          </template>
          <template v-else>🌱</template>
        </div>
      </div>
    </div>
  </section>

  <main class="about-content">

    <!-- Our Story Section -->
    <section class="section">
      <h2 class="section-title fade-in">{{ (history && history.title) || 'Our Story' }}</h2>
      <div class="story-content">
        <div class="story-text slide-in-left">
          <template v-if="history && history.content && history.content.length">
            <p v-for="(block, idx) in history.content" :key="idx">
              {{ (block.children || []).map((c:any) => c.text).join('') }}
            </p>
          </template>
          <template v-else>
            <p>Getting There was founded on a simple yet profound belief: everyone deserves access to compassionate, effective mental health support. We began as a small practice in Colorado, born from Dr. Sue Nesbitt's vision to bridge the gap between traditional therapy and accessible wellness coaching.</p>

            <p>Our founder, Dr. Nesbitt, recognized that many people were struggling not with clinical mental illness, but with life transitions, goal achievement, and emotional resilience. Traditional therapy wasn't always the right fit, yet these individuals needed more than generic self-help resources.</p>

            <p>What started as weekend workshops in community centers has grown into a comprehensive wellness platform. Today, we serve thousands through our digital resources, in-person workshops, and personalized coaching programs. Our approach combines the rigor of clinical psychology with the accessibility of modern wellness practices.</p>

            <p>We remain committed to our founding principles: evidence-based methods, genuine compassion, and the belief that everyone has the capacity for positive change when given the right support and tools.</p>
          </template>
        </div>
        <div class="story-visual slide-in-right">
          <template v-if="history && history.picture">
            <img class="story-image" :src="mediaUrl(history.picture) || ''" :alt="history.picture.alternativeText || history.title || 'History image'" />
          </template>
          <template v-else>🧠</template>
        </div>
      </div>
    </section>

    <!-- Mission Section -->
    <section class="section">
      <div class="mission-section fade-in">
        <h2 class="section-title">{{ (mission && mission.title) || 'Getting There Mission: Increase Happiness' }}</h2>
        <p class="mission-text">
          {{ (mission && mission.Description) || 'There are many kinds of happiness. Contentment with self and the life one is living is longer lasting than moments of peace or excitement but all three make us happy. Activities and accomplishments give each of us pleasure, another kind of happiness. Getting There offers information, ideas, and strategies designed to provide you with resources as you set and plan your happiness goals of whatever kind.' }}
        </p>

        <div class="mission-values">
          <div class="value-item" v-for="card in (mission && mission.cards ? mission.cards : [])" :key="card.id">
            <div class="value-icon" v-if="card.icon && card.icon.url">
              <img :src="'https://getting-there-cms.onrender.com'+card.icon.url" :alt="card.title" class="icon-image" />
            </div>
            <div class="value-icon" v-else>
              {{ card.title.includes('Compassionate') ? '🤝' : card.title.includes('Evidence') ? '🔬' : '🌍' }}
            </div>
            <h3 class="value-title">{{ card.title }}</h3>
            <p class="value-description">{{ card.description }}</p>
          </div>

          <!-- Fallback if no cards are available -->
          <template v-if="!mission || !mission.cards || mission.cards.length === 0">
            <div class="value-item">
              <div class="value-icon">🤝</div>
              <h3 class="value-title">Compassionate Care</h3>
              <p class="value-description">We approach every interaction with empathy, understanding, and genuine care for your wellbeing and unique journey.</p>
            </div>
            <div class="value-item">
              <div class="value-icon">🔬</div>
              <h3 class="value-title">Evidence-Based Methods</h3>
              <p class="value-description">Our approaches are grounded in scientific research from psychology, neuroscience, and positive psychology to ensure effectiveness.</p>
            </div>
            <div class="value-item">
              <div class="value-icon">🌍</div>
              <h3 class="value-title">Accessible Support</h3>
              <p class="value-description">We believe mental wellness support should be available to everyone, regardless of background, location, or circumstances.</p>
            </div>
          </template>
        </div>
      </div>
    </section>


    <!-- Credentials Section -->
    <section class="section">
      <div class="credentials-section fade-in">
        <h2 class="section-title">Professional Standards & Ethics</h2>
        <div class="credentials-grid">
          <div class="credential-item" v-for="card in cards" :key="card.id" v-if="cards && cards.length">
            <div class="credential-icon" v-if="card.icon && card.icon.url">
              <img :src="'https://getting-there-cms.onrender.com'+card.icon.url" :alt="card.title" class="icon-image" />
            </div>
            <h3>{{ card.title }}</h3>
            <p>{{ card.description }}</p>
          </div>

          <!-- Fallback if no cards are available -->
          <template v-if="!cards || !cards.length">
            <div class="credential-item">
              <div class="credential-icon">🛡️</div>
              <h3>Licensed & Accredited</h3>
              <p>All our clinical staff hold proper licenses and certifications. We maintain active memberships in professional associations and adhere to strict ethical guidelines.</p>
            </div>
            <div class="credential-item">
              <div class="credential-icon">🔒</div>
              <h3>Privacy & Confidentiality</h3>
              <p>We are HIPAA compliant and take your privacy seriously. All interactions are confidential, and your personal information is protected with industry-standard security measures.</p>
            </div>
            <div class="credential-item">
              <div class="credential-icon">📚</div>
              <h3>Continuing Education</h3>
              <p>Our team regularly participates in ongoing training and education to stay current with the latest research and best practices in mental health and wellness.</p>
            </div>
            <div class="credential-item">
              <div class="credential-icon">🤝</div>
              <h3>Collaborative Care</h3>
              <p>We work closely with other healthcare providers when appropriate and can provide referrals to specialized services when needed.</p>
            </div>
          </template>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <div class="cta-section fade-in">
      <h2>{{ (action && action.actiontext) || 'Ready to begin your wellness journey?' }}</h2>
      <p>{{ (action && action.Description) }}</p>
      <div class="cta-buttons">
        <router-link to="/events" class="cta-btn">{{ (action && action.buttontext) || 'Explore Our Programs' }}</router-link>
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss">
@import '../assets/common';
@import '@/assets/scss/mixins';
@import '@/assets/scss/variables';

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Hero Section */
.about-hero {
  @extend .hero-base;
  background: var(--gradient-neutral);
  color: var(--text-dark);

  &::before {
    background: url('data:image/svg+xml,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="%234a7c59" fill-opacity="0.05"><circle cx="30" cy="30" r="2"/></g></svg>');
    animation: float 30s ease-in-out infinite;
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(180deg); }
}

.icon-image {
  width: 70px;
  height: 70px;
  margin-right: $spacing-sm;
}

.about-hero-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 $spacing-xl;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $spacing-3xl;
  align-items: center;
  position: relative;
  z-index: 2;

  @include mobile-only {
    grid-template-columns: 1fr;
    gap: $spacing-xl;
    text-align: center;
  }
}

.hero-badge {
  display: inline-block;
  background: var(--bg-sage);
  color: var(--primary-color);
  padding: $spacing-sm $spacing-md;
  border-radius: $radius-2xl;
  font-size: $font-size-sm;
  font-weight: 600;
  margin-bottom: $spacing-lg;
  border: 1px solid var(--border-light);
}

.hero-text h1 {
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 700;
  margin-bottom: $spacing-lg;
  line-height: 1.2;
  color: var(--text-dark);
  font-family: 'Playfair Display', serif;

  @include mobile-only {
    font-size: $font-size-4xl;
  }
}

.hero-text p {
  font-size: $font-size-lg;
  opacity: 0.9;
  margin-bottom: $spacing-xl;
  line-height: 1.6;
  color: var(--text-light);
}

.hero-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: $spacing-xl;

  @include mobile-only {
    grid-template-columns: 1fr;
    gap: $spacing-md;
  }
}

.stat-item {
  text-align: center;
  padding: $spacing-lg;
  background: white;
  border-radius: $radius-lg;
  box-shadow: 0 8px 25px var(--shadow-light);
  border: 1px solid var(--border-light);
}

.stat-number {
  font-size: $font-size-4xl;
  font-weight: 800;
  display: block;
  margin-bottom: $spacing-sm;
  color: var(--primary-color);
}

.stat-label {
  font-size: $font-size-sm;
  color: var(--text-light);
  font-weight: 500;
}

.hero-visual {
  position: relative;
  height: 400px;
  @include flex-center;
}

.visual-circle {
  position: absolute;
  border: 2px solid var(--primary-color);
  opacity: 0.3;
  border-radius: $radius-full;
  animation: gentlePulse 6s ease-in-out infinite;

  &:nth-child(1) {
    width: 300px;
    height: 300px;
    animation-delay: 0s;
  }

  &:nth-child(2) {
    width: 200px;
    height: 200px;
    animation-delay: 2s;
  }

  &:nth-child(3) {
    width: 100px;
    height: 100px;
    animation-delay: 4s;
  }
}

.visual-center {
  font-size: $font-size-4xl;
  position: relative;
  z-index: 3;

  img {
    width: 180px;
    height: 180px;
    border-radius: $radius-full;
    object-fit: cover;
    box-shadow: 0 10px 30px var(--shadow-medium);
  }
}

@keyframes gentlePulse {
  0%, 100% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.05); opacity: 0.1; }
}

/* Main Content */
.about-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: $spacing-3xl $spacing-xl;
}

.section {
  margin-bottom: $spacing-3xl;
}

/* Our Story Section */
.story-content {
  @include grid-two($spacing-3xl);
  align-items: center;
}

.story-text {
  font-size: $font-size-lg;
  line-height: 1.8;
  color: var(--text-light);
  text-align: justify;

  p {
    margin-bottom: $spacing-lg;
  }
}

.story-visual {
  background: var(--gradient);
  height: 400px;
  border-radius: $radius-xl;
  @include flex-center;
  color: white;
  font-size: $font-size-4xl;
  position: relative;
  overflow: hidden;
  box-shadow: 0 15px 40px var(--shadow-medium);

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(1px);
  }

  img.story-image {
    position: absolute;
    inset: 0;
    @include image-cover;
  }
}

/* Mission Section */
.mission-section {
  @include card-base(white, $radius-xl, $spacing-3xl);
  text-align: center;
}

.mission-text {
  font-size: $font-size-xl;
  line-height: 1.7;
  color: var(--text-light);
  max-width: 800px;
  margin: 0 auto $spacing-xl;
}

.mission-values {
  @include grid-auto(300px, $spacing-xl);
  margin-top: $spacing-2xl;

  @include mobile-only {
    grid-template-columns: 1fr;
  }
}

.value-item {
  @include card-base(var(--bg-light), $radius-xl, $spacing-xl);
  text-align: center;

  &:hover {
    background: var(--bg-sage);
  }
}

.value-icon {
  font-size: $font-size-4xl;
  margin-bottom: $spacing-md;
}

.value-title {
  @include heading-small;
}

.value-description {
  @include text-muted;
}

/* Credentials Section */
.credentials-section {
  background: var(--bg-light);
  padding: $spacing-3xl;
  border-radius: $radius-2xl;
  border: 1px solid var(--border-light);
}

.credentials-grid {
  @include grid-two($spacing-xl);
  margin-top: $spacing-xl;
}

.credential-item {
  @include card-base(white, $radius-xl, $spacing-xl);
}

.credential-icon {
  font-size: $font-size-4xl;
  margin-bottom: $spacing-md;
  display: block;
}

.credential-item h3 {
  @include heading-small;
}

.credential-item p {
  @include text-muted;
}

/* CTA Section */
.cta-section {
  background: var(--primary-color);
  color: white;
  padding: $spacing-3xl;
  border-radius: $radius-2xl;
  text-align: center;
  margin-top: $spacing-3xl;
  box-shadow: 0 15px 40px var(--shadow-medium);

  h2 {
    @include heading-large;
    color: white;
    font-family: 'Playfair Display', serif;
  }

  p {
    font-size: $font-size-lg;
    opacity: 0.9;
    margin-bottom: $spacing-xl;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
    line-height: 1.6;
  }
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.cta-btn {
  background: var(--accent-color);
  color: white;
  padding: 1rem 2rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 700;
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px rgba(244, 162, 97, 0.3);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(244, 162, 97, 0.4);
  }

  &.secondary {
    background: transparent;
    border: 2px solid white;
    box-shadow: none;

    &:hover {
      background: white;
      color: var(--primary-color);
    }
  }
}
</style>
