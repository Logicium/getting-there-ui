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
  <section class="hero-section videos-hero">
    <div class="hero-content videos-hero-content">
      <h1>{{ heroSections.videos.title }}</h1>
      <p>{{ heroSections.videos.description }}</p>
      <div class="hero-stats">
        <div v-for="(stat, index) in heroSections.videos.stats" :key="index" class="hero-stat">
          <span class="hero-stat-number">{{ stat.number }}</span>
          <span class="hero-stat-label">{{ stat.label }}</span>
        </div>
      </div>
    </div>
  </section>

  <section class="subscription-banner">
    <div class="banner-content">
      <div class="banner-text">
        <h3>Unlock Premium Content</h3>
        <p>Get unlimited access to our complete video library for just $19/month</p>
      </div>
      <a href="#" class="premium-btn" @click.prevent="showSubscriptionModal">Start Free Trial</a>
    </div>
  </section>

  <FilterSection 
    :categories="videoCategories" 
    :withSearch="true"
    @filter="handleFilter"
    @search="handleSearch"
  />

  <main class="content-container videos-content">
    <!-- Free Videos Section -->
    <section class="video-section" v-if="freeVideos.length > 0">
      <h2 class="section-title fade-in">
        🆓 Free Content
        <div class="section-divider"></div>
      </h2>
      <div class="grid-layout cards" id="freeVideos">
        <VideoCard 
          v-for="video in freeVideos" 
          :key="video.id" 
          :video="video"
          :playVideo="playVideo"
        />
      </div>
    </section>

    <!-- Premium Videos Section -->
    <section class="video-section" v-if="premiumVideos.length > 0">
      <h2 class="section-title fade-in">
        ⭐ Premium Content
        <div class="section-divider"></div>
      </h2>
      <div class="grid-layout cards" id="premiumVideos">
        <VideoCard 
          v-for="video in premiumVideos" 
          :key="video.id" 
          :video="video"
          :showSubscriptionModal="showSubscriptionModal"
        />
      </div>
    </section>
  </main>

  <!-- Video Player Modal -->
  <ModalDialog 
    :title="currentVideo?.title || 'Video Player'" 
    :isOpen="videoModalOpen"
    size="large"
    @close="closeVideoModal"
  >
    <div class="modal-video">
      🎬
    </div>
    <p class="modal-description">{{ currentVideo?.fullDescription }}</p>
    <p class="modal-presenter">Presented by {{ currentVideo?.presenter }}</p>
  </ModalDialog>

  <!-- Subscription Modal -->
  <ModalDialog 
    title="Unlock Premium Content" 
    :isOpen="subscriptionModalOpen"
    size="small"
    @close="closeSubscriptionModal"
  >
    <p>Get unlimited access to our complete library of transformational videos, including exclusive presentations on sensitive topics like grief, advanced goal-setting systems, and expert-level strategies.</p>

    <div class="pricing-card">
      <div class="price">$19<span style="font-size: 1rem;">/month</span></div>
      <div class="price-period">7-day free trial, cancel anytime</div>
      <ul class="features-list">
        <li>Access to 35+ premium videos</li>
        <li>New content added monthly</li>
        <li>Download for offline viewing</li>
        <li>HD quality streaming</li>
        <li>Exclusive expert interviews</li>
        <li>Certificate of completion</li>
      </ul>
    </div>

    <template #footer>
      <button class="accent-button subscribe-now-btn" @click="handleSubscription">Start Free Trial</button>
      <button class="secondary-button close-subscription" @click="closeSubscriptionModal">Maybe Later</button>
    </template>
  </ModalDialog>
</template>

<style scoped>
/* Hero Section Specific Styles */
.videos-hero {
  padding: 8rem 0 4rem;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-top: 2rem;
}

.hero-stat {
  text-align: center;
}

.hero-stat-number {
  font-size: 2rem;
  font-weight: 800;
  display: block;
}

.hero-stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
}

/* Subscription Banner */
.subscription-banner {
  background: linear-gradient(135deg, var(--premium-gold) 0%, #f59e0b 100%);
  color: white;
  padding: 2rem 0;
  text-align: center;
}

.banner-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.banner-text h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.banner-text p {
  opacity: 0.9;
}

.premium-btn {
  background: white;
  color: var(--premium-gold);
  padding: 1rem 2rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 700;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.premium-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
}

/* Modal Styles */
.modal-video {
  width: 100%;
  height: 400px;
  background: var(--gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 4rem;
  margin-bottom: 1.5rem;
}

.modal-description {
  color: var(--text-light);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.modal-presenter {
  color: var(--primary-color);
  font-weight: 600;
}

/* Subscription Modal Styles */
.pricing-card {
  background: var(--gradient);
  color: white;
  padding: 2rem;
  border-radius: 20px;
  margin: 2rem 0;
}

.price {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.price-period {
  opacity: 0.8;
  margin-bottom: 1rem;
}

.features-list {
  list-style: none;
  text-align: left;
  padding: 0;
}

.features-list li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.features-list li::before {
  content: '✓';
  color: var(--premium-gold);
  font-weight: bold;
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .banner-content {
    flex-direction: column;
    text-align: center;
  }

  .hero-stats {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>