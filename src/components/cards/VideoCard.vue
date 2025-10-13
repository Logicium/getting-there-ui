<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue';
import type { VideoData } from '@/types/video';

interface Props {
  video: VideoData;
  playVideo?: (videoId: string) => void;
}

const props = defineProps<Props>();

// Use a local ref for duration to ensure reactivity
const duration = ref(props.video.duration);
const thumbnailUrl = ref(props.video.thumbnailUrl || '');
const thumbnailLoading = ref(true);
const thumbnailError = ref(false);

// Watch for changes to the video's duration and update the local ref
watch(() => props.video.duration, (newDuration) => {
  duration.value = newDuration;
}, { immediate: true });

// Watch for changes to the video's thumbnail
watch(() => props.video.thumbnailUrl, (newThumbnail) => {
  if (newThumbnail) {
    thumbnailUrl.value = newThumbnail;
    thumbnailLoading.value = false;
  }
}, { immediate: true });

const categoryDisplay = computed(() => {
  const category = props.video.category[1] || props.video.category[0];
  switch(category) {
    case 'motivation': return 'Mindset & Motivation';
    case 'productivity': return 'Goal Setting';
    case 'wellness': return 'Mental Wellness';
    case 'therapy': return 'Therapeutic Content';
    default: return category;
  }
});

const categoryClass = computed(() => {
  const category = props.video.category[1] || props.video.category[0];
  return `category-${category}`;
});

const handleClick = () => {
  if (props.playVideo) {
    props.playVideo(props.video.id);
  }
};

const handleWatchClick = () => {
  if (props.playVideo) {
    props.playVideo(props.video.id);
  }
};

const handleThumbnailError = () => {
  thumbnailError.value = true;
  thumbnailLoading.value = false;
};

const handleThumbnailLoad = () => {
  thumbnailLoading.value = false;
  thumbnailError.value = false;
};

onMounted(() => {
  // If there's already a thumbnail, mark as loaded
  if (props.video.thumbnailUrl) {
    thumbnailLoading.value = false;
  }
});
</script>

<template>
  <div
      class="video-card fade-in"
      :data-category="video.category.join(' ')"
      :data-title="video.title.toLowerCase() + ' ' + video.tags.join(' ')"
  >
    <div class="video-thumbnail" @click="handleClick">
      <div :class="['category-badge', categoryClass]">{{ categoryDisplay }}</div>
      <div class="video-duration">{{ duration }}</div>

      <!-- Thumbnail loading state -->
      <div v-if="thumbnailLoading" class="thumbnail-loading">
        <div class="loading-pulse"></div>
      </div>

      <!-- Actual thumbnail -->
      <img
          v-else-if="thumbnailUrl && !thumbnailError"
          :src="thumbnailUrl"
          :alt="video.title"
          class="thumbnail-image"
          @error="handleThumbnailError"
          @load="handleThumbnailLoad"
      />

      <!-- Fallback gradient with play button -->
      <div v-else class="thumbnail-fallback">
        <div class="play-icon">▶️</div>
      </div>

      <!-- Play button overlay (always visible on hover) -->
      <div class="play-overlay">
        <div class="play-button">▶</div>
      </div>
    </div>
    <div class="video-content">
      <h3 class="video-title">{{ video.title }}</h3>
      <p class="video-presenter">{{ video.presenter }}</p>
      <p class="video-description">{{ video.description }}</p>
      <div class="video-footer">
        <span class="video-views">{{ video.views }} views</span>
        <button
            class="watch-btn"
            @click="handleWatchClick"
        >
          Watch Now
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.video-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.4s ease;
  position: relative;
  border: 1px solid var(--border-light);
}

.video-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
}

.video-thumbnail {
  position: relative;
  height: 200px;
  background: var(--gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: pointer;
}

/* Thumbnail loading state */
.thumbnail-loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
      90deg,
      rgba(74, 124, 89, 0.1) 0%,
      rgba(127, 166, 80, 0.2) 50%,
      rgba(74, 124, 89, 0.1) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.loading-pulse {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.7;
  }
}

/* Actual thumbnail image */
.thumbnail-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

/* Fallback when thumbnail fails or not available */
.thumbnail-fallback {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--gradient);
  display: flex;
  align-items: center;
  justify-content: center;
}

.play-icon {
  font-size: 3rem;
  opacity: 0.9;
}

/* Play button overlay */
.play-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.video-thumbnail:hover .play-overlay {
  opacity: 1;
}

.play-button {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: var(--primary-color);
  transition: transform 0.3s ease;
}

.video-thumbnail:hover .play-button {
  transform: scale(1.1);
}

.video-duration {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 5px;
  font-size: 0.8rem;
  font-weight: 600;
  z-index: 2;
}

.category-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 700;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 2;
}

.category-wellness {
  background: rgba(74, 124, 89, 0.9);
}

.category-therapy {
  background: rgba(52, 152, 219, 0.9);
}

.category-motivation {
  background: rgba(244, 162, 97, 0.9);
}

.category-productivity {
  background: rgba(155, 89, 182, 0.9);
}

.video-content {
  padding: 1.5rem;
}

.video-title {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--text-dark);
  line-height: 1.3;
}

.video-presenter {
  color: var(--primary-color);
  font-size: 0.9rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.video-description {
  color: var(--text-light);
  line-height: 1.5;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.video-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.video-views {
  color: var(--text-light);
  font-size: 0.9rem;
}

.watch-btn {
  background: var(--primary-color);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.watch-btn:hover {
  background: var(--secondary-color);
  transform: translateY(-2px);
}
</style>