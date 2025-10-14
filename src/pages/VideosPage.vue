<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { videoCategories } from '@/data/data';
import VideoCard from '@/components/cards/VideoCard.vue';
import FilterSection from '@/components/FilterSection.vue';
import VideoModal from '@/components/VideoModal.vue';
import CommunitySupportSection from '@/components/sections/CommunitySupportSection.vue';
import DisclaimerSection from '@/components/sections/DisclaimerSection.vue';
import { getVideoDuration, generateVideoThumbnailWithRetry } from '@/utils/videoUtils';
import { observeFadeElements } from '@/utils/animationUtils';
import { filterElementsByCategoryAndSearch } from '@/utils/filterUtils';
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
const currentVideo = ref(null as VideoData | null);

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
  filterElementsByCategoryAndSearch('.video-card', currentFilter.value, searchTerm.value);
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

    // Process videos and get durations + thumbnails
    const processedVideos: Record<string, VideoData> = {};

    for (const cmsVideo of cmsVideos) {
      const videoUrl = `https://getting-there-cms.onrender.com${cmsVideo.video.url}`;

      // Extract tags and categories
      const tags = cmsVideo.tags.map(tag => tag.tag);
      const categories = cmsVideo.Categories.map(category => category.tag);

      // Create a unique ID from the title (slug-like)
      const id = cmsVideo.documentId ||
          cmsVideo.title.toLowerCase()
              .replace(/[^\w\s-]/g, '')
              .replace(/\s+/g, '-');

      // Get video duration - initially set to '00:00' and update when available
      let duration = '00:00';
      try {
        getVideoDuration(videoUrl, (actualDuration) => {
          if (videos.value[id]) {
            const updatedVideo = { ...videos.value[id], duration: actualDuration };
            videos.value[id] = updatedVideo;
          }
        }).then(initialDuration => {
          if (initialDuration !== '00:00') {
            if (videos.value[id]) {
              const updatedVideo = { ...videos.value[id], duration: initialDuration };
              videos.value[id] = updatedVideo;
            }
          }
        });
      } catch (err) {
        console.error(`Error getting duration for video ${cmsVideo.title}:`, err);
      }

      // Transform to VideoData format
      processedVideos[id] = {
        id,
        title: cmsVideo.title,
        presenter: cmsVideo.Author,
        description: cmsVideo.Description,
        fullDescription: cmsVideo.Description,
        duration,
        category: categories,
        views: Math.floor(Math.random() * 5000 + 1000).toString(),
        isFree: true,
        tags,
        videoUrl,
        thumbnailUrl: undefined // Will be generated asynchronously
      };

      // Generate thumbnail asynchronously (don't block rendering)
      generateVideoThumbnailWithRetry(videoUrl).then(thumbnailUrl => {
        if (thumbnailUrl && videos.value[id]) {
          const updatedVideo = { ...videos.value[id], thumbnailUrl };
          videos.value[id] = updatedVideo;
        }
      }).catch(err => {
        console.error(`Failed to generate thumbnail for video ${cmsVideo.title}:`, err);
      });
    }

    videos.value = processedVideos;
  } catch (err) {
    console.error('Error fetching videos:', err);
    videosError.value = err instanceof Error ? err.message : 'Failed to load videos';
  } finally {
    videosLoading.value = false;
  }
};

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
        Complete Video Library
        <div class="section-divider"></div>
      </h2>

      <!-- Loading State -->
      <div v-if="videosLoading" class="content-loading-container">
        <div class="loading-spinner"></div>
        <p>Loading videos...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="videosError" class="content-error-container">
        <p>{{ videosError }}</p>
        <button @click="fetchVideos" class="retry-button">Retry</button>
      </div>

      <!-- Videos Grid -->
      <div v-else class="therapy-videos-grid" id="allVideos">
        <VideoCard
            v-for="video in Object.values(videos)"
            :key="video.id"
            :video="video"
            :playVideo="playVideo"
        />
      </div>
    </section>

    <CommunitySupportSection />

    <DisclaimerSection />
  </main>

  <VideoModal
    :isOpen="videoModalOpen"
    :video="currentVideo"
    @close="closeVideoModal"
  />
</template>

<style scoped lang="scss">
@import '../assets/common.scss';
@import '@/assets/scss/mixins';
@import '@/assets/scss/variables';

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
  @include flex-row($spacing-2xl);
  justify-content: center;
  margin-top: $spacing-xl;

  @include mobile-only {
    flex-direction: column;
    gap: $spacing-lg;
  }
}

.hero-wellness-stat {
  text-align: center;
}

.hero-stat-number {
  font-size: $font-size-3xl;
  font-weight: 800;
  display: block;
  margin-bottom: $spacing-sm;
}

.hero-stat-label {
  font-size: $font-size-sm;
  opacity: 0.8;
}

.therapy-videos-content {
  @extend .container;
  padding: $spacing-3xl $spacing-xl;
}

.section-description {
  @include text-muted;
  font-size: $font-size-lg;
  text-align: center;
  margin-bottom: $spacing-2xl;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.therapy-video-section {
  margin-bottom: $spacing-3xl;
}

.therapy-videos-grid {
  @include grid-auto(350px, $spacing-xl);
}

/* Content Loading/Error States (not in white boxes) */
.content-loading-container,
.content-error-container {
  @include loading-container(transparent, var(--text-light), 300px);
  padding: $spacing-3xl $spacing-xl;
}

/* Hero Loading/Error States */
.loading-container,
.error-container {
  @include loading-container(transparent, white);
}

.loading-spinner {
  @include loading-spinner();
}

.content-loading-container .loading-spinner {
  border: 4px solid rgba(74, 124, 89, 0.2);
  border-top-color: var(--primary-color);
}

.retry-button {
  @include button-primary;
  margin-top: $spacing-md;
}

.error-container .retry-button {
  @include button-base(white, var(--primary-color));

  &:hover {
    background: rgba(255, 255, 255, 0.9);
    transform: translateY(-2px);
  }
}

@include mobile-only {
  .therapy-videos-grid {
    grid-template-columns: 1fr;
  }
}
</style>
