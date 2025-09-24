<template>
  <div class="resource-item fade-in">
    <div class="resource-icon">
      <img v-if="icon && icon.url" :src="`https://getting-there-cms.onrender.com${icon.url}`" :alt="title" />
      <component v-else :is="fallbackIconComponent" />
    </div>
    <span><strong>{{ title }}</strong> - {{ description }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import VideoIcon from '@/components/icons/VideoIcon.vue';
import BookIcon from '@/components/icons/BookIcon.vue';
import ChalkboardIcon from '@/components/icons/ChalkboardIcon.vue';
import PenIcon from '@/components/icons/PenIcon.vue';

const baseUrl = import.meta.env.VITE_CMS_URL || '';

const props = defineProps<{
  title: string;
  description: string;
  iconIndex: number;
  icon?: {
    url: string;
    width: number;
    height: number;
    formats?: {
      small?: {
        url: string;
      };
      thumbnail?: {
        url: string;
      };
    };
  };
}>();

// Fallback icon if CMS data is not available
const fallbackIconComponent = computed(() => {
  switch (props.iconIndex) {
    case 0:
      return VideoIcon;
    case 1:
      return BookIcon;
    case 2:
      return ChalkboardIcon;
    default:
      return PenIcon;
  }
});
</script>

<style scoped>
.resource-item {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: var(--bg-light);
  border-radius: 15px;
  transition: all 0.3s ease;
  border: 1px solid var(--border-light);
}

.resource-item:hover {
  background: var(--bg-sage);
  transform: translateX(10px);
}

.resource-icon {
  min-width: 40px;
  width: 40px;
  height: 40px;
  background: var(--primary-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  color: white;
  font-size: 1.2rem;
  overflow: hidden;
}

.resource-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: invert(1)
}
</style>
