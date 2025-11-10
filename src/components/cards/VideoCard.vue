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
  const category = props.video.category;
  switch(category?.toLowerCase()) {
    case 'goals': return 'Goals';
    case 'growth': return 'Growth';
    case 'loss': return 'Loss';
    case 'fun': return 'Fun';
    case 'happiness': return 'Happiness';
    default: return category || 'Video';
  }
});

const categoryClass = computed(() => {
  const category = props.video.category;
  return `category-${category?.toLowerCase() || 'default'}`;
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
      :data-category="video.category"
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

<style scoped lang="scss">
@import '@/assets/scss/mixins';
@import '@/assets/scss/variables';

.video-card {
  background: white;
  border-radius: $radius-xl;
  box-shadow: 0 8px 30px var(--shadow-light);
  border: 1px solid var(--border-light);
  transition: all $transition-slow ease;
  overflow: hidden;
  position: relative;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
  }
}

.video-thumbnail {
  @include image-container(200px, var(--gradient));
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
  border-radius: $radius-full;
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
  @include image-cover;
  position: absolute;
  top: 0;
  left: 0;
}

/* Fallback when thumbnail fails or not available */
.thumbnail-fallback {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--gradient);
  @include flex-center;
}

.play-icon {
  font-size: $font-size-4xl;
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
  @include flex-center;
  opacity: 0;
  transition: opacity $transition-normal;

  .video-thumbnail:hover & {
    opacity: 1;
  }
}

.play-button {
  width: 60px;
  height: 60px;
  border-radius: $radius-full;
  background: rgba(255, 255, 255, 0.9);
  @include flex-center;
  font-size: $font-size-xl;
  color: var(--primary-color);
  transition: transform $transition-normal;

  .video-thumbnail:hover & {
    transform: scale(1.1);
  }
}

.video-duration {
  position: absolute;
  bottom: $spacing-md;
  right: $spacing-md;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: $spacing-xs $spacing-sm;
  border-radius: $radius-sm;
  font-size: $font-size-xs;
  font-weight: 600;
  z-index: 2;
}

.category-badge {
  @include badge-base;
  position: absolute;
  top: $spacing-md;
  left: $spacing-md;
  color: white;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 2;
}

.category-goals {
  background: rgba(74, 124, 89, 0.9);
}

.category-growth {
  background: rgba(52, 152, 219, 0.9);
}

.category-loss {
  background: rgba(244, 162, 97, 0.9);
}

.category-fun {
  background: rgba(155, 89, 182, 0.9);
}

.category-happiness {
  background: rgba(241, 196, 15, 0.9);
}

.category-default {
  background: rgba(100, 100, 100, 0.9);
}

.video-content {
  padding: $spacing-lg;
}

.video-title {
  @include heading-small;
  margin-bottom: $spacing-sm;
  line-height: 1.3;
}

.video-presenter {
  color: var(--primary-color);
  font-size: $font-size-sm;
  margin-bottom: $spacing-md;
  font-weight: 600;
}

.video-description {
  @include text-muted;
  margin-bottom: $spacing-lg;
  font-size: $font-size-sm;
}

.video-footer {
  @include flex-between;
}

.video-views {
  color: var(--text-light);
  font-size: $font-size-sm;
}

.watch-btn {
  @include button-primary;
  padding: $spacing-sm $spacing-md;
  font-size: $font-size-sm;
}
</style>
