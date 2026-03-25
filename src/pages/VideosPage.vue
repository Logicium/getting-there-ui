<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { videoCategories } from '@/data/data';
import VideoCard from '@/components/cards/VideoCard.vue';
import FilterSection from '@/components/FilterSection.vue';
import VideoModal from '@/components/VideoModal.vue';
import Pagination from '@/components/Pagination.vue';
import CommunitySupportSection from '@/components/sections/CommunitySupportSection.vue';
import DisclaimerSection from '@/components/sections/DisclaimerSection.vue';
import { getVideoDuration, generateVideoThumbnailWithRetry, getCachedThumbnail } from '@/utils/videoUtils';
import { observeFadeElements } from '@/utils/animationUtils';
import { useAuthStore } from '@/stores/auth';
import type { CMSVideo, VideoData } from '@/types/video';

const authStore = useAuthStore();

// Video filtering state
const currentFilter = ref('all');
const searchTerm = ref('');

// Pagination state
const currentPage = ref(1);
const itemsPerPage = 12;

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

// Base filtered videos based on category and search
const baseFilteredVideos = computed(() => {
  const videosArray = Object.values(videos.value);
  
  return videosArray.filter(video => {
    // Category filter
    const matchesCategory = currentFilter.value === 'all' || 
      video.category?.toLowerCase() === currentFilter.value.toLowerCase();
    
    // Search filter
    const search = searchTerm.value.toLowerCase();
    const matchesSearch = search === '' || 
      video.title.toLowerCase().includes(search) ||
      video.description.toLowerCase().includes(search) ||
      video.category?.toLowerCase().includes(search);
    
    return matchesCategory && matchesSearch;
  });
});

// Split into free and premium videos
const freeVideos = computed(() => baseFilteredVideos.value.filter(v => !v.isPremium));
const premiumVideos = computed(() => baseFilteredVideos.value.filter(v => v.isPremium));

// filteredVideos remains for pagination/category counts (all videos)
const filteredVideos = baseFilteredVideos;

// Compute paginated videos
const paginatedVideos = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredVideos.value.slice(start, end);
});

// Compute categories with counts
const categoriesWithCounts = computed(() => {
  const videosArray = Object.values(videos.value);
  
  return videoCategories.map(category => {
    if (category.id === 'all') {
      return {
        ...category,
        count: videosArray.length
      };
    }
    
    const count = videosArray.filter(video => 
      video.category?.toLowerCase() === category.id.toLowerCase()
    ).length;
    
    return {
      ...category,
      count
    };
  });
});

// Event handlers
const handleFilter = (filter: string) => {
  currentFilter.value = filter;
  currentPage.value = 1; // Reset to first page when filtering
};

const handleSearch = (term: string) => {
  searchTerm.value = term;
  currentPage.value = 1; // Reset to first page when searching
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  // Scroll to top of videos section
  const videosSection = document.querySelector('.therapy-video-section');
  if (videosSection) {
    videosSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  // Re-trigger fade animations for new page items
  setTimeout(() => {
    observeFadeElements();
  }, 50);
}

const playVideo = (videoId: string) => {
  const video = videos.value[videoId];
  if (video?.isPremium && !authStore.isSubscribed) {
    // Non-subscribers cannot play premium videos
    return;
  }
  currentVideoId.value = videoId;
  currentVideo.value = video;
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

      // Extract tags and category
      const tags = cmsVideo.tags.map(tag => tag.tag);
      const category = cmsVideo.Category || 'general';

      // Create a unique ID from the title (slug-like)
      const id = cmsVideo.documentId ||
          cmsVideo.title.toLowerCase()
              .replace(/[^\w\s-]/g, '')
              .replace(/\s+/g, '-');

      // Check for CMS thumbnail first, then cached thumbnail
      let thumbnailUrl: string | undefined = undefined;
      
      if (cmsVideo.thumbnail && cmsVideo.thumbnail.url) {
        // Use the CMS-provided thumbnail
        thumbnailUrl = `https://getting-there-cms.onrender.com${cmsVideo.thumbnail.url}`;
      } else {
        // Fall back to cached thumbnail if no CMS thumbnail
        const cachedThumbnail = getCachedThumbnail(videoUrl);
        thumbnailUrl = cachedThumbnail || undefined;
      }

      // Get video duration - check cache first, then fetch if needed
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
        category: category,
        views: Math.floor(Math.random() * 5000 + 1000).toString(),
        isFree: !cmsVideo.isPremium,
        isPremium: !!cmsVideo.isPremium,
        tags,
        videoUrl,
        thumbnailUrl // Use CMS thumbnail, cached thumbnail, or undefined
      };

      // Only generate thumbnail if no CMS thumbnail is provided
      if (!cmsVideo.thumbnail) {
        generateVideoThumbnailWithRetry(videoUrl).then(generatedThumbnail => {
          if (generatedThumbnail && videos.value[id]) {
            const updatedVideo = { ...videos.value[id], thumbnailUrl: generatedThumbnail };
            videos.value[id] = updatedVideo;
          }
        }).catch(err => {
          console.error(`Failed to generate thumbnail for video ${cmsVideo.title}:`, err);
        });
      }
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

  // Initial fade animation
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
    </div>
  </section>

  <FilterSection
      :categories="categoriesWithCounts"
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
      <div v-else>
        <div v-if="filteredVideos.length === 0" class="no-results-message">
          <p>No videos found matching your search criteria.</p>
        </div>

        <template v-else>
          <!-- Free Videos Section -->
          <div v-if="freeVideos.length > 0" class="video-section-block">
            <h3 class="video-section-heading free-heading fade-in">
              <span class="heading-icon">▶</span> Free Videos
              <span class="video-count">{{ freeVideos.length }} video{{ freeVideos.length !== 1 ? 's' : '' }}</span>
            </h3>
            <div class="therapy-videos-grid" id="freeVideos">
              <VideoCard
                  v-for="video in freeVideos"
                  :key="video.id"
                  :video="video"
                  :playVideo="playVideo"
              />
            </div>
          </div>

          <!-- Premium Videos Section -->
          <div v-if="premiumVideos.length > 0" class="video-section-block premium-section">
            <h3 class="video-section-heading premium-heading fade-in">
              <span class="heading-icon">⭐</span> Premium Content
              <span class="video-count">{{ premiumVideos.length }} video{{ premiumVideos.length !== 1 ? 's' : '' }}</span>
            </h3>

            <!-- CTA banner for non-subscribers -->
            <div v-if="!authStore.isSubscribed" class="premium-cta-banner fade-in">
              <div class="premium-cta-content">
                <h4>Unlock Premium Content</h4>
                <p>Subscribe to access exclusive therapeutic presentations, guided sessions, and in-depth educational content.</p>
              </div>
              <router-link to="/subscribe" class="premium-cta-button">Subscribe Now</router-link>
            </div>

            <div class="therapy-videos-grid" id="premiumVideos">
              <VideoCard
                  v-for="video in premiumVideos"
                  :key="video.id"
                  :video="video"
                  :playVideo="playVideo"
                  :locked="!authStore.isSubscribed"
              />
            </div>
          </div>

          <!-- Pagination -->
          <Pagination
            v-if="filteredVideos.length > itemsPerPage"
            :currentPage="currentPage"
            :totalItems="filteredVideos.length"
            :itemsPerPage="itemsPerPage"
            @page-change="handlePageChange"
          />
        </template>
      </div>
    </section>

<!--    <CommunitySupportSection />-->

<!--    <DisclaimerSection />-->
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

.no-results-message {
  text-align: center;
  padding: $spacing-3xl;
  color: var(--text-muted);
  font-size: $font-size-lg;
}

/* ---------- Free / Premium section blocks ---------- */
.video-section-block {
  margin-bottom: $spacing-3xl;
}

.video-section-heading {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  font-size: $font-size-xl;
  font-weight: 700;
  margin-bottom: $spacing-xl;
  color: var(--text-dark);

  .heading-icon {
    font-size: $font-size-lg;
  }

  .video-count {
    margin-left: auto;
    font-size: $font-size-sm;
    font-weight: 500;
    color: var(--text-muted);
  }
}

.free-heading {
  color: var(--primary-color, #4a7c59);
}

.premium-heading {
  color: var(--premium-color, #b8860b);
}

/* ---------- Premium CTA Banner ---------- */
.premium-cta-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, rgba(184, 134, 11, 0.08) 0%, rgba(218, 165, 32, 0.12) 100%);
  border: 1px solid rgba(184, 134, 11, 0.25);
  border-radius: $radius-xl;
  padding: $spacing-xl $spacing-2xl;
  margin-bottom: $spacing-2xl;
  gap: $spacing-xl;

  @include mobile-only {
    flex-direction: column;
    text-align: center;
  }
}

.premium-cta-content {
  h4 {
    font-size: $font-size-lg;
    font-weight: 700;
    color: var(--premium-color, #b8860b);
    margin-bottom: $spacing-xs;
  }

  p {
    color: var(--text-muted);
    font-size: $font-size-sm;
    margin: 0;
    max-width: 500px;
  }
}

.premium-cta-button {
  @include button-primary;
  background: linear-gradient(135deg, #b8860b, #daa520);
  color: white;
  white-space: nowrap;
  padding: $spacing-md $spacing-xl;
  font-weight: 600;
  text-decoration: none;
  border-radius: $radius-lg;
  transition: all $transition-normal ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(184, 134, 11, 0.3);
  }
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
