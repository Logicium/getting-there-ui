<script setup lang="ts">
import ModalDialog from './ModalDialog.vue';
import type { VideoData } from '@/types/video';

interface Props {
  isOpen: boolean;
  video: VideoData | null;
}

interface Emits {
  (e: 'close'): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

const handleClose = () => emit('close');
</script>

<template>
  <ModalDialog
      :title="video?.title || 'Therapeutic Video'"
      :isOpen="isOpen"
      size="large"
      @close="handleClose"
  >
    <div class="therapy-modal-video">
      <video
          v-if="video?.videoUrl"
          controls
          class="video-player"
          :src="video.videoUrl"
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
      <p class="therapy-modal-description">{{ video?.fullDescription }}</p>
    </div>
  </ModalDialog>
</template>

<style scoped lang="scss">
@import '@/assets/common.scss';

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
</style>
