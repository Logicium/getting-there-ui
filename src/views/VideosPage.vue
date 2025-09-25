<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { videoCategories } from '@/data/data';
import VideoCard from '@/components/cards/VideoCard.vue';
import FilterSection from '@/components/FilterSection.vue';
import ModalDialog from '@/components/ModalDialog.vue';
import { getVideoDuration } from '@/utils/videoUtils';
import type { CMSVideo, VideoData } from '@/types/video';

// Video filtering state
const currentFilter = ref('all');
const searchTerm = ref('');

// Modal state
const videoModalOpen = ref(false);
const currentVideoId = ref('');

// Hero content from CMS
const heroTitle = ref('Free Healing Resources & Educational Content');
const heroDescription = ref('Access our complete library of therapeutic presentations, guided sessions, and educational content - all available at no cost to support your mental health journey');
const isLoading = ref(true);
const error = ref<string | null>(null);

// Videos from CMS

const videos = ref<Record<string, VideoData>>({});
const videosLoading = ref(true);
const videosError = ref<string | null>(null);

// Computed properties
const currentVideo = ref(null as any);

// Event handlers - USING DOM MANIPULATION LIKE WORKSHOPS
const handleFilter = (filter: string) => {
  currentFilter.value = filter;
  filterVideos();
};

const handleSearch = (term: string) => {
  searchTerm.value = term;
  filterVideos();
};

// EXACT SAME APPROACH AS WORKSHOPS PAGE
function filterVideos() {
  const filter = currentFilter.value;
  const search = searchTerm.value.toLowerCase();
  const videoCards = document.querySelectorAll('.video-card');

  videoCards.forEach(card => {
    const htmlCard = card as HTMLElement;
    const category = htmlCard.dataset.category || '';
    const title = htmlCard.dataset.title || '';

    const matchesCategory = filter === 'all' || category.includes(filter);
    const matchesSearch = search === '' || title.includes(search);

    if (matchesCategory && matchesSearch) {
      htmlCard.style.display = 'block';
    } else {
      htmlCard.style.display = 'none';
    }
  });
}

const playVideo = (videoId: string) => {
  currentVideoId.value = videoId;
  currentVideo.value = videos.value[videoId];
  videoModalOpen.value = true;
};

const closeVideoModal = () => {
  videoModalOpen.value = false;
};

// Fetch hero data from CMS
const fetchHeroData = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    const res = await fetch(`${import.meta.env.VITE_CMS_URL}/api/videos-page?populate=all`);

    if (!res.ok) {
      throw new Error(`Failed to fetch videos page hero: ${res.status} ${res.statusText}`);
    }

    const json = await res.json();
    const hero = json?.data?.Hero;
    if (hero) {
      if (hero.title) heroTitle.value = hero.title;
      if (hero.description) heroDescription.value = hero.description;
    }
  } catch (err) {
    console.error('Error fetching videos page hero:', err);
    error.value = err instanceof Error ? err.message : 'Failed to load content';
  } finally {
    isLoading.value = false;
  }
};

// Fetch videos from CMS
const fetchVideos = async () => {
  videosLoading.value = true;
  videosError.value = null;

  try {
    const res = await fetch(`${import.meta.env.VITE_CMS_URL}/api/videos?populate=all`);

    if (!res.ok) {
      throw new Error(`Failed to fetch videos: ${res.status} ${res.statusText}`);
    }

    const json = await res.json();
    const cmsVideos = json?.data as CMSVideo[];

    if (!cmsVideos || !Array.isArray(cmsVideos)) {
      throw new Error('Invalid video data received from CMS');
    }

    // Process videos and get durations
    const processedVideos: Record<string, VideoData> = {};

    for (const cmsVideo of cmsVideos) {
      const videoUrl = `https://getting-there-cms.onrender.com${cmsVideo.video.url}`;

      // Get video duration
      let duration = '00:00';
      try {
        duration = await getVideoDuration(videoUrl);
      } catch (err) {
        console.error(`Error getting duration for video ${cmsVideo.title}:`, err);
      }

      // Extract tags and categories
      const tags = cmsVideo.tags.map(tag => tag.tag);
      const categories = cmsVideo.Categories.map(category => category.tag);

      // Create a unique ID from the title (slug-like)
      const id = cmsVideo.documentId || 
                 cmsVideo.title.toLowerCase()
                   .replace(/[^\w\s-]/g, '')
                   .replace(/\s+/g, '-');

      // Transform to VideoData format
      processedVideos[id] = {
        id,
        title: cmsVideo.title,
        presenter: cmsVideo.Author,
        description: cmsVideo.Description,
        fullDescription: cmsVideo.Description,
        duration,
        category: categories,
        views: Math.floor(Math.random() * 5000 + 1000).toString(), // Random view count for now
        isFree: true,
        tags,
        videoUrl
      };
    }

    videos.value = processedVideos;
  } catch (err) {
    console.error('Error fetching videos:', err);
    videosError.value = err instanceof Error ? err.message : 'Failed to load videos';
  } finally {
    videosLoading.value = false;
  }
};

// Function to observe fade-in elements
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
  // Fetch both hero data and videos in parallel
  await Promise.all([
    fetchHeroData(),
    fetchVideos()
  ]);

  setTimeout(() => {
    observeFadeElements();
  }, 100);
});
</script>

<template>
  <section class="therapy-videos-hero">
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Loading videos content...</p>
    </div>

    <div v-else-if="error" class="error-container">
      <p>{{ error }}</p>
      <button @click="fetchHeroData" class="retry-button">Retry</button>
    </div>

    <div v-else class="therapy-videos-hero-content">
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
    <section class="therapy-video-section">
      <h2 class="wellness-section-title fade-in">
        Complete Healing Resource Library
        <div class="section-divider"></div>
      </h2>
      <p class="section-description fade-in">
        Our entire collection of therapeutic content is now freely available. These resources are designed to support your mental health journey with evidence-based approaches and trauma-informed care.
      </p>
      <!-- RENDER ALL VIDEOS - FILTER WITH DOM MANIPULATION -->
      <div v-if="videosLoading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading videos...</p>
      </div>

      <div v-else-if="videosError" class="error-container">
        <p>{{ videosError }}</p>
        <button @click="fetchVideos" class="retry-button">Retry</button>
      </div>

      <div v-else class="therapy-videos-grid" id="allVideos">
        <VideoCard
            v-for="video in Object.values(videos)"
            :key="video.id"
            :video="video"
            :playVideo="playVideo"
        />
      </div>
    </section>

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

  <ModalDialog
      :title="currentVideo?.title || 'Therapeutic Video'"
      :isOpen="videoModalOpen"
      size="large"
      @close="closeVideoModal"
  >
    <div class="therapy-modal-video">
      <video 
        v-if="currentVideo?.videoUrl" 
        controls 
        class="video-player"
        :src="currentVideo.videoUrl"
        preload="metadata"
      >
        Your browser does not support the video tag.
      </video>
      <div v-else class="video-placeholder">
        <div class="play-button">▶️</div>
        <p>Video loading...</p>
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

<style scoped lang="scss">
@import '../assets/common.scss';

.therapy-videos-hero {
  @extend .hero-base;
  background: var(--gradient);
  color: white;
  text-align: center;
}

.therapy-videos-hero-content {
  @extend .hero-content-base;
}

.hero-wellness-stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
  }
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

.therapy-videos-content {
  @extend .container;
  padding: 4rem 2rem;
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

.therapy-video-section {
  margin-bottom: 4rem;
}

.therapy-videos-grid {
  @extend .grid-auto-fit;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
}

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
  @extend .grid-auto-fit;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.community-item {
  @extend .card-base;
  text-align: center;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px var(--shadow-medium);
  }
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
  @extend .cta-primary;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
}

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
  @extend .grid-auto-fit;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

.disclaimer-item {
  @extend .card-base;
  text-align: center;
  background: white;

  h4 {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: var(--primary-color);
  }

  p {
    color: var(--text-light);
    line-height: 1.5;
  }
}

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

.video-player {
  width: 100%;
  height: 400px;
  border-radius: 12px;
  background: #000;
  object-fit: contain;
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

  &:first-child {
    font-weight: 600;
    color: var(--text-dark);
  }

  &:last-child {
    color: var(--text-light);
    font-size: 0.9rem;
  }
}

.therapy-modal-warning {
  background: rgba(231, 111, 81, 0.1);
  padding: 1rem;
  border-radius: 10px;
  border-left: 4px solid var(--warning-color);

  p {
    margin: 0;
    color: var(--text-dark);
    font-size: 0.9rem;
  }
}

@media (max-width: 768px) {
  .therapy-videos-grid {
    grid-template-columns: 1fr;
  }

  .disclaimer-grid, .community-grid {
    grid-template-columns: 1fr;
  }
}
</style>
