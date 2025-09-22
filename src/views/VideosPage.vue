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

// Hero content from CMS
const heroTitle = ref('Free Healing Resources & Educational Content');
const heroDescription = ref('Access our complete library of therapeutic presentations, guided sessions, and educational content - all available at no cost to support your mental health journey');

// Fade-in animation
onMounted(async () => {
  // Fetch hero data from CMS
  try {
    const res = await fetch(`${import.meta.env.VITE_CMS_URL}/api/videos-page?populate=all`);
    if (res.ok) {
      const json = await res.json();
      const hero = json?.data?.Hero;
      if (hero) {
        if (hero.title) heroTitle.value = hero.title;
        if (hero.description) heroDescription.value = hero.description;
      }
    } else {
      console.error('Failed to fetch videos page hero:', res.status, res.statusText);
    }
  } catch (err) {
    console.error('Error fetching videos page hero:', err);
  }

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
      <h1>{{ heroTitle }}</h1>
      <p>{{ heroDescription }}</p>
      <div class="hero-wellness-stats">
        <div class="hero-wellness-stat">
          <span class="hero-stat-number">50+</span>
          <span class="hero-stat-label">Free Videos</span>
        </div>
        <div class="hero-wellness-stat">
          <span class="hero-stat-number">100%</span>
          <span class="hero-stat-label">Free Access</span>
        </div>
        <div class="hero-wellness-stat">
          <span class="hero-stat-number">24/7</span>
          <span class="hero-stat-label">Available</span>
        </div>
      </div>
    </div>
  </section>

  <FilterSection
      :categories="videoCategories"
      :withSearch="true"
      @filter="handleFilter"
      @search="handleSearch"
  />

  <main class="therapy-videos-content">
    <!-- All Free Resources Section -->
    <section class="therapy-video-section">
      <h2 class="wellness-section-title fade-in">
        Complete Healing Resource Library
        <div class="section-divider"></div>
      </h2>
      <p class="section-description fade-in">
        Our entire collection of therapeutic content is now freely available. These resources are designed to support your mental health journey with evidence-based approaches and trauma-informed care.
      </p>
      <div class="therapy-videos-grid" id="allVideos">
        <VideoCard
            v-for="video in filteredVideos"
            :key="video.id"
            :video="video"
            :playVideo="playVideo"
        />
      </div>
    </section>

    <!-- Community Support Section -->
    <section class="therapy-community-section fade-in">
      <div class="community-content">
        <h3>🤝 Join Our Healing Community</h3>
        <div class="community-grid">
          <div class="community-item">
            <div class="community-icon">💚</div>
            <h4>Support Groups</h4>
            <p>Connect with others on similar healing journeys through our in-person and virtual support groups.</p>
            <router-link to="/events" class="community-link">Explore Groups</router-link>
          </div>
          <div class="community-item">
            <div class="community-icon">📚</div>
            <h4>Educational Resources</h4>
            <p>Deepen your understanding with our collection of therapeutic books and self-help guides.</p>
            <router-link to="/store" class="community-link">Browse Books</router-link>
          </div>
          <div class="community-item">
            <div class="community-icon">✍️</div>
            <h4>Wellness Blog</h4>
            <p>Read insights, tips, and stories from mental health professionals and community members.</p>
            <router-link to="/blog" class="community-link">Read Blog</router-link>
          </div>
        </div>
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
            <p>All our content is designed with trauma-informed principles and includes resources for additional support when needed.</p>
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

.section-description {
  color: var(--text-light);
  font-size: 1.1rem;
  text-align: center;
  margin-bottom: 3rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

.therapy-videos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

/* Community Support Section */
.therapy-community-section {
  background: var(--bg-light);
  padding: 3rem;
  border-radius: 20px;
  margin: 4rem 0;
  border: 1px solid var(--border-light);
}

.community-content h3 {
  text-align: center;
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: var(--text-dark);
}

.community-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.community-item {
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 5px 20px var(--shadow-light);
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid var(--border-light);
}

.community-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px var(--shadow-medium);
}

.community-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.community-item h4 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.community-item p {
  color: var(--text-light);
  line-height: 1.5;
  margin-bottom: 1.5rem;
}

.community-link {
  display: inline-block;
  background: var(--primary-color);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.community-link:hover {
  background: var(--secondary-color);
  transform: translateY(-2px);
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

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .hero-wellness-stats {
    flex-direction: column;
    gap: 1.5rem;
  }

  .therapy-videos-grid {
    grid-template-columns: 1fr;
  }

  .disclaimer-grid, .community-grid {
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