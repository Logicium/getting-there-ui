<script setup lang="ts">
import { computed } from 'vue';
import type { VideoData } from '@/data/data';

interface Props {
  video: VideoData;
  showSubscriptionModal?: () => void;
  playVideo?: (videoId: string) => void;
}

const props = defineProps<Props>();

const isFree = computed(() => props.video.isFree);
const badgeClass = computed(() => isFree.value ? 'free-badge' : 'premium-badge');
const badgeText = computed(() => isFree.value ? 'FREE' : '⭐ PREMIUM');

const handleClick = () => {
  if (isFree.value && props.playVideo) {
    props.playVideo(props.video.id);
  } else if (!isFree.value && props.showSubscriptionModal) {
    props.showSubscriptionModal();
  }
};

const handleWatchClick = () => {
  if (isFree.value && props.playVideo) {
    props.playVideo(props.video.id);
  } else if (!isFree.value && props.showSubscriptionModal) {
    props.showSubscriptionModal();
  }
};
</script>

<template>
  <div 
    class="video-card fade-in" 
    :data-category="video.category.join(' ')" 
    :data-title="video.title.toLowerCase() + ' ' + video.tags.join(' ')"
  >
    <div class="video-thumbnail" @click="handleClick">
      <div :class="badgeClass">{{ badgeText }}</div>
      <div class="video-duration">{{ video.duration }}</div>
    </div>
    <div class="video-content">
      <div class="video-category">{{ video.category[1] === 'motivation' ? 'Mindset & Motivation' : 
                                    video.category[1] === 'productivity' ? 'Goal Setting' : 
                                    video.category[1] === 'wellness' ? 'Wellness' : 
                                    video.category[1] }}</div>
      <h3 class="video-title">{{ video.title }}</h3>
      <p class="video-presenter">{{ video.presenter }}</p>
      <p class="video-description">{{ video.description }}</p>
      <div class="video-footer">
        <span class="video-views">{{ video.views }} views</span>
        <button 
          class="watch-btn" 
          :class="{ premium: !isFree }" 
          @click="handleWatchClick"
        >
          {{ isFree ? 'Watch Now' : 'Premium Only' }}
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

.video-thumbnail::after {
  content: '▶️';
  font-size: 3rem;
  opacity: 0.9;
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
}

.premium-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: var(--premium-gold);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.free-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: var(--success-color);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 700;
}

.video-content {
  padding: 1.5rem;
}

.video-category {
  color: var(--primary-color);
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.video-title {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--text-dark);
  line-height: 1.3;
}

.video-presenter {
  color: var(--text-light);
  font-size: 0.9rem;
  margin-bottom: 1rem;
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

.watch-btn.premium {
  background: var(--premium-gold);
}

.watch-btn.premium:hover {
  background: var(--premium-gold);
  transform: translateY(-2px);
}
</style>