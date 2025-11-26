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
  min-width: 50px;
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  color: white;
  font-size: 1.2rem;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.resource-icon img {
  width: 70%;
  height: 70%;
  object-fit: contain;
  filter: brightness(0) invert(1);
  transition: all 0.3s ease;
}

/* Vibrant gradient backgrounds for each resource icon */
.resource-item:nth-child(1) .resource-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  /* Purple gradient */
}

.resource-item:nth-child(2) .resource-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%) !important;
  /* Pink to coral gradient */
}

.resource-item:nth-child(3) .resource-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%) !important;
  /* Blue to cyan gradient */
}

.resource-item:nth-child(4) .resource-icon {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%) !important;
  /* Pink to yellow gradient */
}

.resource-item:nth-child(n+5) .resource-icon {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%) !important;
  /* Mint to pink gradient - for any additional cards */
}

.resource-item:hover .resource-icon {
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
}
</style>
