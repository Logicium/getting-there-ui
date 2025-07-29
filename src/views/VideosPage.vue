<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { videos, videoCategories, heroSections } from '@/data/data';
import VideoCard from '@/components/VideoCard.vue';
import FilterSection from '@/components/FilterSection.vue';
import ModalDialog from '@/components/ModalDialog.vue';

// Video filtering state
const currentFilter = ref('all');
const searchTerm = ref('');

// Modal state
const videoModalOpen = ref(false);
const subscriptionModalOpen = ref(false);
const currentVideoId = ref('');

// Computed properties
const currentVideo = computed(() => {
  if (!currentVideoId.value) return null;
  return videos[currentVideoId.value];
});

const filteredVideos = computed(() => {
  return Object.values(videos).filter(video => {
    const matchesCategory = currentFilter.value === 'all' || video.category.includes(currentFilter.value);
    const matchesSearch = searchTerm.value === '' ||
        video.title.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        video.tags.some(tag => tag.toLowerCase().includes(searchTerm.value.toLowerCase()));
    return matchesCategory && matchesSearch;
  });
});

const freeVideos = computed(() => {
  return filteredVideos.value.filter(video => video.isFree);
});

const premiumVideos = computed(() => {
  return filteredVideos.value.filter(video => !video.isFree);
});

// Event handlers
const handleFilter = (filter: string) => {
  currentFilter.value = filter;
};

const handleSearch = (term: string) => {
  searchTerm.value = term;
};

const playVideo = (videoId: string) => {
  currentVideoId.value = videoId;
  videoModalOpen.value = true;
};

const closeVideoModal = () => {
  videoModalOpen.value = false;
};

const showSubscriptionModal = () => {
  subscriptionModalOpen.value = true;
};

const closeSubscriptionModal = () => {
  subscriptionModalOpen.value = false;
};

const handleSubscription = () => {
  alert('Subscription system would integrate with your payment processor here. For demo purposes, this would redirect to a secure checkout page with Stripe, PayPal, or similar payment service.');
  closeSubscriptionModal();
};

// Fade-in animation
onMounted(() => {
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
  <section class="therapy-videos-hero">
    <div class="therapy-videos-hero-content">
      <h1>Healing Resources & Educational Content</h1>
      <p>Access our library of therapeutic presentations, guided sessions, and educational content designed to support your mental health journey</p>
      <div class="hero-wellness-stats">
        <div class="hero-wellness-stat">
          <span class="hero-stat-number">50+</span>
          <span class="hero-stat-label">Therapeutic Videos</span>
        </div>
        <div class="hero-wellness-stat">
          <span class="hero-stat-number">15</span>
          <span class="hero-stat-label">Free Resources</span>
        </div>
        <div class="hero-wellness-stat">
          <span class="hero-stat-number">10K+</span>
          <span class="hero-stat-label">Lives Supported</span>
        </div>
      </div>
    </div>
  </section>

  <section class="therapy-subscription-banner">
    <div class="therapy-banner-content">
      <div class="therapy-banner-text">
        <h3>💚 Access Premium Therapeutic Content</h3>
        <p>Unlock specialized sessions on trauma, anxiety, depression, and relationship healing for just $19/month</p>
      </div>
      <a href="#" class="therapy-premium-btn" @click.prevent="showSubscriptionModal">Start Healing Journey</a>
    </div>
  </section>

  <FilterSection
      :categories="videoCategories"
      :withSearch="true"
      @filter="handleFilter"
      @search="handleSearch"
  />

  <main class="therapy-videos-content">
    <!-- Free Resources Section -->
    <section class="therapy-video-section" v-if="freeVideos.length > 0">
      <h2 class="wellness-section-title fade-in">
        Free Healing Resources
        <div class="section-divider"></div>
      </h2>
      <div class="therapy-videos-grid" id="freeVideos">
        <VideoCard
            v-for="video in freeVideos"
            :key="video.id"
            :video="video"
            :playVideo="playVideo"
        />
      </div>
    </section>

    <!-- Premium Content Section -->
    <section class="therapy-video-section" v-if="premiumVideos.length > 0">
      <h2 class="wellness-section-title fade-in">
        Premium Therapeutic Content
        <div class="section-divider"></div>
      </h2>
      <p class="premium-section-description fade-in">
        These specialized therapeutic sessions address sensitive topics and require a subscription to ensure proper support and follow-up care.
      </p>
      <div class="therapy-videos-grid" id="premiumVideos">
        <VideoCard
            v-for="video in premiumVideos"
            :key="video.id"
            :video="video"
            :showSubscriptionModal="showSubscriptionModal"
        />
      </div>
    </section>

    <!-- Therapeutic Disclaimer Section -->
    <section class="therapy-disclaimer fade-in">
      <div class="disclaimer-content">
        <h3>🏥 Important Therapeutic Information</h3>
        <div class="disclaimer-grid">
          <div class="disclaimer-item">
            <h4>Professional Support</h4>
            <p>These resources complement but do not replace professional therapy. Please consult with a licensed mental health provider for personalized care.</p>
          </div>
          <div class="disclaimer-item">
            <h4>Crisis Support</h4>
            <p>If you're in crisis, please contact emergency services (911) or the National Suicide Prevention Lifeline (988) immediately.</p>
          </div>
          <div class="disclaimer-item">
            <h4>Confidential Care</h4>
            <p>All our premium content is designed with trauma-informed principles and includes follow-up resources for additional support.</p>
          </div>
          <div class="disclaimer-item">
            <h4>Progress at Your Pace</h4>
            <p>Healing is not linear. Take breaks when needed and remember that seeking help is a sign of strength, not weakness.</p>
          </div>
        </div>
      </div>
    </section>
  </main>

  <!-- Video Player Modal -->
  <ModalDialog
      :title="currentVideo?.title || 'Therapeutic Video'"
      :isOpen="videoModalOpen"
      size="large"
      @close="closeVideoModal"
  >
    <div class="therapy-modal-video">
      <div class="video-placeholder">
        <div class="play-button">▶️</div>
        <p>Therapeutic Video Player</p>
      </div>
    </div>
    <div class="therapy-modal-content">
      <p class="therapy-modal-description">{{ currentVideo?.fullDescription }}</p>
      <div class="therapy-modal-presenter">
        <div class="presenter-avatar">👩‍⚕️</div>
        <div class="presenter-info">
          <p><strong>{{ currentVideo?.presenter }}</strong></p>
          <p>Licensed Mental Health Professional</p>
        </div>
      </div>
      <div class="therapy-modal-warning">
        <p><strong>⚠️ Therapeutic Content Notice:</strong> This content addresses mental health topics. Please watch in a safe, private space and consider having support available.</p>
      </div>
    </div>
  </ModalDialog>

  <!-- Subscription Modal -->
  <ModalDialog
      title="Access Premium Therapeutic Content"
      :isOpen="subscriptionModalOpen"
      size="small"
      @close="closeSubscriptionModal"
  >
    <div class="therapy-subscription-content">
      <p>Gain access to our comprehensive library of therapeutic content, including specialized sessions on trauma recovery, depression support, anxiety management, and relationship healing.</p>

      <div class="therapy-pricing-card">
        <div class="therapy-price">$19<span style="font-size: 1rem;">/month</span></div>
        <div class="therapy-price-period">7-day free trial • Cancel anytime • No commitment</div>
        <ul class="therapy-features-list">
          <li>35+ therapeutic video sessions</li>
          <li>Trauma-informed content library</li>
          <li>Guided meditation & mindfulness</li>
          <li>Crisis support resources</li>
          <li>Monthly expert interviews</li>
          <li>Downloadable self-care guides</li>
          <li>24/7 crisis helpline access</li>
        </ul>
        <div class="therapy-guarantee">
          <p>💚 <strong>Healing Guarantee:</strong> If our content doesn't support your wellness journey, get a full refund within 30 days.</p>
        </div>
      </div>
    </div>

    <template #footer>
      <button class="therapy-subscribe-btn" @click="handleSubscription">Begin Healing Journey</button>
      <button class="therapy-secondary-btn" @click="closeSubscriptionModal">Continue with Free Content</button>
    </template>
  </ModalDialog>
</template>

<style scoped>
/* Therapy Videos Hero Section */
.therapy-videos-hero {
  padding: 8rem 0 4rem;
  background: var(--gradient);
  color: white;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.therapy-videos-hero::before {
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

.therapy-videos-hero-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 2;
}

.therapy-videos-hero h1 {
  font-size: clamp(2.5rem, 6vw, 3.5rem);
  font-weight: 700;
  margin-bottom: 1rem;
  font-family: 'Playfair Display', serif;
}

.therapy-videos-hero p {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.hero-wellness-stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-top: 2rem;
}

.hero-wellness-stat {
  text-align: center;
}

.hero-stat-number {
  font-size: 2.2rem;
  font-weight: 800;
  display: block;
  margin-bottom: 0.5rem;
}

.hero-stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
}

/* Subscription Banner */
.therapy-subscription-banner {
  background: linear-gradient(135deg, var(--success-color) 0%, var(--primary-color) 100%);
  color: white;
  padding: 2rem 0;
  text-align: center;
}

.therapy-banner-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.therapy-banner-text h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.therapy-banner-text p {
  opacity: 0.9;
  font-size: 1rem;
}

.therapy-premium-btn {
  background: white;
  color: var(--primary-color);
  padding: 1rem 2rem;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 700;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  white-space: nowrap;
}

.therapy-premium-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.3);
}

/* Main Content */
.therapy-videos-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
}

.wellness-section-title {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: var(--text-dark);
  font-family: 'Playfair Display', serif;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.section-divider {
  height: 3px;
  background: var(--gradient);
  border-radius: 2px;
  flex: 1;
}

.therapy-video-section {
  margin-bottom: 4rem;
}

.premium-section-description {
  color: var(--text-light);
  font-size: 1.1rem;
  text-align: center;
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

.therapy-videos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

/* Therapeutic Disclaimer */
.therapy-disclaimer {
  background: var(--bg-sage);
  padding: 3rem;
  border-radius: 20px;
  margin-top: 3rem;
  border: 1px solid var(--border-light);
}

.disclaimer-content h3 {
  text-align: center;
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: var(--text-dark);
}

.disclaimer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.disclaimer-item {
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 5px 20px var(--shadow-light);
  text-align: center;
}

.disclaimer-item h4 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.disclaimer-item p {
  color: var(--text-light);
  line-height: 1.5;
}

/* Modal Styles */
.therapy-modal-video {
  width: 100%;
  margin-bottom: 2rem;
}

.video-placeholder {
  width: 100%;
  height: 400px;
  background: var(--gradient);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  border-radius: 12px;
  position: relative;
}

.play-button {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.9;
}

.therapy-modal-content {
  text-align: left;
}

.therapy-modal-description {
  color: var(--text-light);
  line-height: 1.6;
  margin-bottom: 1.5rem;
  font-size: 1rem;
}

.therapy-modal-presenter {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: var(--bg-light);
  border-radius: 12px;
}

.presenter-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.presenter-info p {
  margin: 0;
  line-height: 1.4;
}

.presenter-info p:first-child {
  font-weight: 600;
  color: var(--text-dark);
}

.presenter-info p:last-child {
  color: var(--text-light);
  font-size: 0.9rem;
}

.therapy-modal-warning {
  background: rgba(231, 111, 81, 0.1);
  padding: 1rem;
  border-radius: 10px;
  border-left: 4px solid var(--warning-color);
}

.therapy-modal-warning p {
  margin: 0;
  color: var(--text-dark);
  font-size: 0.9rem;
}

/* Subscription Modal Styles */
.therapy-subscription-content p {
  color: var(--text-light);
  line-height: 1.6;
  margin-bottom: 2rem;
}

.therapy-pricing-card {
  background: var(--gradient);
  color: white;
  padding: 2.5rem;
  border-radius: 20px;
  margin: 2rem 0;
  text-align: center;
}

.therapy-price {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.therapy-price-period {
  opacity: 0.8;
  margin-bottom: 2rem;
  font-size: 0.95rem;
}

.therapy-features-list {
  list-style: none;
  text-align: left;
  padding: 0;
  margin-bottom: 2rem;
}

.therapy-features-list li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
}

.therapy-features-list li::before {
  content: '💚';
  font-size: 1rem;
}

.therapy-guarantee {
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
}

.therapy-guarantee p {
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.9;
}

.therapy-subscribe-btn {
  background: var(--accent-color);
  color: white;
  padding: 1rem 2rem;
  border-radius: 25px;
  border: none;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.therapy-subscribe-btn:hover {
  background: var(--warning-color);
  transform: translateY(-2px);
}

.therapy-secondary-btn {
  background: transparent;
  color: var(--text-light);
  padding: 1rem 2rem;
  border: 2px solid var(--border-light);
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.therapy-secondary-btn:hover {
  background: var(--bg-light);
  color: var(--text-dark);
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .therapy-banner-content {
    flex-direction: column;
    text-align: center;
  }

  .hero-wellness-stats {
    flex-direction: column;
    gap: 1.5rem;
  }

  .therapy-videos-grid {
    grid-template-columns: 1fr;
  }

  .disclaimer-grid {
    grid-template-columns: 1fr;
  }

  .wellness-section-title {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .section-divider {
    width: 100px;
    margin: 0 auto;
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