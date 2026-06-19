<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { videoCategories } from '@/data/data';
import VideoCard from '@/components/cards/VideoCard.vue';
import VideoModal from '@/components/VideoModal.vue';
import Pagination from '@/components/Pagination.vue';
import { getVideoDuration, generateVideoThumbnailWithRetry, getCachedThumbnail } from '@/utils/videoUtils';
import { useAuthStore } from '@/stores/auth';
import type { CMSVideo, VideoData } from '@/types/video';
import {
  AppBadge,
  AppButton,
  AppCard,
  AppContainer,
  AppEmptyState,
  AppEyebrow,
  AppGrid,
  AppHero,
  AppSection,
  AppSpinner,
} from '@/components/ui';
import { Play, Star } from 'lucide-vue-next';

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
const heroDescription = ref('Access our complete library of therapeutic presentations, guided sessions, and educational content - all available at no cost to support your wellbeing journey');
const isLoading = ref(true);
const error = ref<string | null>(null);

// Videos from CMS
const videos = ref<Record<string, VideoData>>({});
const videosLoading = ref(true);
const videosError = ref<string | null>(null);

const currentVideo = ref(null as VideoData | null);

const baseFilteredVideos = computed(() => {
  const videosArray = Object.values(videos.value);
  return videosArray.filter(video => {
    const matchesCategory = currentFilter.value === 'all' ||
      video.category?.toLowerCase() === currentFilter.value.toLowerCase();
    const search = searchTerm.value.toLowerCase();
    const matchesSearch = search === '' ||
      video.title.toLowerCase().includes(search) ||
      video.description.toLowerCase().includes(search) ||
      video.category?.toLowerCase().includes(search);
    return matchesCategory && matchesSearch;
  });
});

const featuredVideo = computed<VideoData | null>(() => {
  const firstFree = baseFilteredVideos.value.find(v => !v.isPremium);
  return firstFree ?? baseFilteredVideos.value[0] ?? null;
});

const remainingVideos = computed(() => {
  const featuredId = featuredVideo.value?.id;
  return baseFilteredVideos.value.filter(v => v.id !== featuredId);
});

const filteredVideos = remainingVideos;

const paginatedVideos = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredVideos.value.slice(start, end);
});

const categoriesWithCounts = computed(() => {
  const videosArray = Object.values(videos.value);
  return videoCategories.map(category => {
    if (category.id === 'all') {
      return { ...category, count: videosArray.length };
    }
    const count = videosArray.filter(video =>
      video.category?.toLowerCase() === category.id.toLowerCase()
    ).length;
    return { ...category, count };
  });
});

const featuredCategoryTone = computed<'cobalt' | 'mint' | 'plum' | 'fuchsia' | 'marigold' | 'ink'>(() => {
  switch (featuredVideo.value?.category?.toLowerCase()) {
    case 'goals':     return 'cobalt';
    case 'growth':    return 'mint';
    case 'loss':      return 'plum';
    case 'fun':       return 'fuchsia';
    case 'happiness': return 'marigold';
    default:          return 'ink';
  }
});

const handleFilter = (filter: string) => {
  currentFilter.value = filter;
  currentPage.value = 1;
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  const videosSection = document.querySelector('.videos__grid-section');
  if (videosSection) {
    videosSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

const playVideo = (videoId: string) => {
  const video = videos.value[videoId];
  if (video?.isPremium && !authStore.isSubscribed) return;
  currentVideoId.value = videoId;
  currentVideo.value = video;
  videoModalOpen.value = true;
};

const closeVideoModal = () => { videoModalOpen.value = false; };

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

    const processedVideos: Record<string, VideoData> = {};

    for (const cmsVideo of cmsVideos) {
      const videoUrl = `https://getting-there-cms.onrender.com${cmsVideo.video.url}`;
      const tags = cmsVideo.tags.map(tag => tag.tag);
      const category = cmsVideo.Category || 'general';
      const id = cmsVideo.documentId ||
          cmsVideo.title.toLowerCase()
              .replace(/[^\w\s-]/g, '')
              .replace(/\s+/g, '-');

      let thumbnailUrl: string | undefined = undefined;
      if (cmsVideo.thumbnail && cmsVideo.thumbnail.url) {
        thumbnailUrl = `https://getting-there-cms.onrender.com${cmsVideo.thumbnail.url}`;
      } else {
        const cachedThumbnail = getCachedThumbnail(videoUrl);
        thumbnailUrl = cachedThumbnail || undefined;
      }

      let duration = '00:00';
      try {
        getVideoDuration(videoUrl, (actualDuration) => {
          if (videos.value[id]) {
            videos.value[id] = { ...videos.value[id], duration: actualDuration };
          }
        }).then(initialDuration => {
          if (initialDuration !== '00:00' && videos.value[id]) {
            videos.value[id] = { ...videos.value[id], duration: initialDuration };
          }
        });
      } catch (err) {
        console.error(`Error getting duration for video ${cmsVideo.title}:`, err);
      }

      processedVideos[id] = {
        id,
        title: cmsVideo.title,
        presenter: cmsVideo.Author,
        description: cmsVideo.Description,
        fullDescription: cmsVideo.Description,
        duration,
        category,
        views: Math.floor(Math.random() * 5000 + 1000).toString(),
        isFree: !cmsVideo.isPremium,
        isPremium: !!cmsVideo.isPremium,
        tags,
        videoUrl,
        thumbnailUrl
      };

      if (!cmsVideo.thumbnail) {
        generateVideoThumbnailWithRetry(videoUrl).then(generatedThumbnail => {
          if (generatedThumbnail && videos.value[id]) {
            videos.value[id] = { ...videos.value[id], thumbnailUrl: generatedThumbnail };
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
  await Promise.all([fetchHeroData(), fetchVideos()]);
});
</script>

<template>
  <main class="videos">
    <!-- HERO -->
    <AppHero variant="editorial" tone="cream" align="center">
      <template #eyebrow>
        <AppEyebrow tone="fuchsia">Watch &amp; Learn</AppEyebrow>
      </template>
      <template #title>{{ heroTitle }}</template>
      <template #lede>
        <p>{{ heroDescription }}</p>
      </template>
      <template #actions>
        <AppButton variant="primary" size="lg" href="#library">Browse the library</AppButton>
        <AppButton v-if="!authStore.isSubscribed" variant="ghost" size="lg" to="/subscribe">Go premium</AppButton>
      </template>
    </AppHero>

    <!-- FEATURED VIDEO -->
    <AppSection tone="mint" pad="xl">
      <AppContainer size="lg">
        <header class="videos__head">
          <AppEyebrow tone="cobalt">Featured</AppEyebrow>
          <h2 class="u-display u-display--md">This week's pick</h2>
        </header>

        <div v-if="videosLoading" class="videos__state">
          <AppSpinner size="lg" />
          <p>Loading videos...</p>
        </div>

        <AppEmptyState
          v-else-if="videosError"
          variant="error"
          title="Could not load videos"
          :message="videosError"
        >
          <template #actions>
            <AppButton variant="primary" @click="fetchVideos">Try again</AppButton>
          </template>
        </AppEmptyState>

        <AppCard
          v-else-if="featuredVideo"
          variant="postcard"
          tone="paper"
          shadow-tone="fuchsia"
          pad="lg"
          class="videos__featured"
          :interactive="!(featuredVideo.isPremium && !authStore.isSubscribed)"
          @click="playVideo(featuredVideo.id)"
        >
          <template #media>
            <div class="videos__featured-media">
              <img
                v-if="featuredVideo.thumbnailUrl"
                :src="featuredVideo.thumbnailUrl"
                :alt="featuredVideo.title"
                class="videos__featured-img"
              />
              <div v-else class="videos__featured-fallback"><Play :size="56" :stroke-width="2" fill="currentColor" /></div>
              <span class="videos__featured-duration">{{ featuredVideo.duration }}</span>
              <div class="videos__featured-play" aria-hidden="true"><Play :size="28" :stroke-width="2" fill="currentColor" /></div>
            </div>
          </template>
          <template #eyebrow>
            <div class="videos__featured-tags">
              <AppBadge :tone="featuredCategoryTone" size="sm">{{ featuredVideo.category }}</AppBadge>
              <AppBadge v-if="featuredVideo.isPremium" tone="fuchsia" size="sm"><Star :size="12" :stroke-width="2.5" fill="currentColor" /> Premium</AppBadge>
            </div>
          </template>
          <template #title>{{ featuredVideo.title }}</template>
          <p class="videos__featured-presenter">with {{ featuredVideo.presenter }}</p>
          <p class="videos__featured-desc">{{ featuredVideo.description }}</p>
          <template #footer>
            <AppButton
              v-if="featuredVideo.isPremium && !authStore.isSubscribed"
              variant="primary"
              to="/subscribe"
            >
              Subscribe to watch
            </AppButton>
            <AppButton v-else variant="accent" @click="playVideo(featuredVideo.id)">
              Watch now
            </AppButton>
          </template>
        </AppCard>

        <AppEmptyState
          v-else
          variant="empty"
          title="No videos to feature"
          message="Try a different filter or check back soon."
        />
      </AppContainer>
    </AppSection>

    <!-- LIBRARY -->
    <AppSection id="library" tone="cream" pad="xl">
      <AppContainer size="lg">
        <header class="videos__head">
          <AppEyebrow tone="marigold">Library</AppEyebrow>
          <h2 class="u-display u-display--md">Complete video library</h2>
        </header>

        <div class="videos__filters" role="tablist" aria-label="Filter videos by category">
          <button
            v-for="cat in categoriesWithCounts"
            :key="cat.id"
            type="button"
            role="tab"
            :aria-selected="currentFilter === cat.id"
            class="videos__filter-btn"
            @click="handleFilter(cat.id)"
          >
            <AppBadge
              :tone="currentFilter === cat.id ? 'marigold' : 'cream'"
              size="md"
            >
              {{ cat.label }} <span class="videos__filter-count">({{ cat.count }})</span>
            </AppBadge>
          </button>
        </div>

        <div v-if="videosLoading" class="videos__state">
          <AppSpinner size="lg" />
          <p>Loading videos...</p>
        </div>

        <AppEmptyState
          v-else-if="filteredVideos.length === 0 && !featuredVideo"
          variant="empty"
          title="No videos found"
          message="Try a different filter or check back soon."
        />

        <div v-else class="videos__grid-section">
          <AppGrid :min="260" gap="md">
            <VideoCard
              v-for="video in paginatedVideos"
              :key="video.id"
              :video="video"
              :play-video="playVideo"
              :locked="video.isPremium && !authStore.isSubscribed"
            />
          </AppGrid>

          <Pagination
            v-if="filteredVideos.length > itemsPerPage"
            :current-page="currentPage"
            :total-items="filteredVideos.length"
            :items-per-page="itemsPerPage"
            @page-change="handlePageChange"
          />
        </div>
      </AppContainer>
    </AppSection>

    <!-- SUBSCRIBE CTA -->
    <AppSection tone="ink" pad="xl">
      <AppContainer size="md">
        <div class="videos__cta">
          <AppEyebrow tone="marigold">Premium</AppEyebrow>
          <h2 class="videos__cta-title">Unlock the full library.</h2>
          <p class="videos__cta-lede">
            Subscribe for exclusive therapeutic presentations, guided sessions, and in-depth educational content. Starting at <strong>$8/month</strong> — or save with $80/year.
          </p>
          <div class="videos__cta-actions">
            <AppButton v-if="!authStore.isSubscribed" to="/subscribe" variant="primary" size="lg">Subscribe now</AppButton>
            <AppButton v-else to="/account" variant="primary" size="lg">Manage subscription</AppButton>
          </div>
        </div>
      </AppContainer>
    </AppSection>

    <VideoModal
      :is-open="videoModalOpen"
      :video="currentVideo"
      @close="closeVideoModal"
    />
  </main>
</template>

<style scoped lang="scss">
.videos {
  &__head {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--s-3);
    text-align: center;
    margin-bottom: var(--s-7);
  }

  &__state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--s-3);
    padding: var(--s-8) 0;
    color: var(--c-text-muted);
  }

  &__featured {
    max-width: 920px;
    margin-inline: auto;

    &-media {
      position: relative;
      aspect-ratio: 16 / 9;
      background: var(--c-ink);
      overflow: hidden;
      cursor: pointer;
      width: 100%;
      height: 100%;
      min-height: 220px;
    }
    &-img {
      position: absolute; inset: 0;
      width: 100%; height: 100%;
      object-fit: cover;
    }
    &-fallback {
      position: absolute; inset: 0;
      display: grid; place-items: center;
      color: var(--c-cream);
      :deep(svg) { color: var(--c-cream); }
    }
    &-duration {
      position: absolute;
      bottom: var(--s-3);
      right: var(--s-3);
      padding: 0.2rem 0.6rem;
      background: rgba(0, 0, 0, 0.7);
      color: var(--c-cream);
      font-family: var(--font-body);
      font-size: var(--fs-xs);
      font-weight: 700;
      border-radius: var(--r-sm);
    }
    &-play {
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      width: 72px; height: 72px;
      border-radius: 50%;
      background: var(--c-marigold);
      color: var(--c-ink);
      border: 3px solid var(--c-ink);
      display: grid; place-items: center;
      box-shadow: var(--shadow-block-sm);
      pointer-events: none;
    }
    &-tags {
      display: flex;
      gap: var(--s-2);
      flex-wrap: wrap;
    }
    &-presenter {
      margin: 0;
      font-family: var(--font-body);
      font-weight: 600;
      color: var(--c-cobalt);
      font-size: var(--fs-sm);
    }
    &-desc {
      margin: 0;
      color: var(--c-text-muted);
      line-height: var(--lh-base);
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    // Horizontal split at desktop so the whole card fits in the fold.
    @media (min-width: 760px) {
      flex-direction: row;
      align-items: stretch;
      max-height: 380px;

      :deep(.app-card__media) {
        flex: 0 0 50%;
        border-bottom: none;
        border-right: 2px solid var(--c-ink);
      }
      :deep(.app-card__body) {
        flex: 1 1 auto;
        justify-content: center;
      }
      :deep(.app-card__title) {
        font-size: clamp(var(--fs-xl), 2.4vw, var(--fs-2xl));
        line-height: var(--lh-tight);
      }
      &-media { aspect-ratio: auto; height: 100%; }
    }
  }


  &__filters {
    display: flex;
    flex-wrap: wrap;
    gap: var(--s-2);
    justify-content: center;
    margin-bottom: var(--s-7);
  }
  &__filter-btn {
    background: none;
    border: 0;
    padding: 0;
    cursor: pointer;
    font: inherit;
    color: inherit;

    &:focus-visible {
      outline: 3px solid var(--c-cobalt);
      outline-offset: 3px;
      border-radius: var(--r-pill);
    }
  }
  &__filter-count {
    opacity: 0.75;
    font-weight: 600;
    margin-left: 0.25rem;
  }

  &__cta {
    text-align: center;
    color: var(--c-cream);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--s-3);
  }
  &__cta-title {
    font-family: var(--font-display);
    font-size: clamp(var(--fs-3xl), 5vw, var(--fs-5xl));
    line-height: var(--lh-tight);
    color: var(--c-cream);
    margin: 0;
  }
  &__cta-lede {
    color: var(--c-cream);
    opacity: 0.85;
    max-width: 56ch;
    margin: 0 auto var(--s-4);

    strong { color: var(--c-marigold); }
  }
  &__cta-actions {
    display: flex;
    gap: var(--s-3);
    justify-content: center;
    flex-wrap: wrap;
  }
}
</style>
