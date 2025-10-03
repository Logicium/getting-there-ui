<template>
  <div class="service-card fade-in">
    <div class="service-icon">
      <img v-if="icon && icon.url" :src="`https://getting-there-cms.onrender.com${icon.url}`" :alt="title" />
      <component v-else :is="fallbackIconComponent" />
    </div>
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>
    <router-link :to="linkLocation ? (linkLocation === 'home' ? '/' : '/' + linkLocation) : '/about'" class="service-link">Learn More →</router-link>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import ThoughtIcon from '@/components/icons/ThoughtIcon.vue';
import FallingStarIcon from '@/components/icons/FallingStarIcon.vue';
import HandDrawnPlantIcon from '@/components/icons/HandDrawnPlantIcon.vue';
import PlantIcon from '@/components/icons/PlantIcon.vue';

const baseUrl = import.meta.env.VITE_CMS_URL || '';

const props = defineProps<{
  title: string;
  description: string;
  iconIndex: number;
  linkLocation?: string | null;
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
      return ThoughtIcon;
    case 1:
      return FallingStarIcon;
    case 2:
      return HandDrawnPlantIcon;
    default:
      return PlantIcon;
  }
});
</script>

<style scoped>
.service-card {
  background: white;
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 8px 30px var(--shadow-light);
  transition: all 0.3s ease;
  text-align: center;
  border: 1px solid var(--border-light);
}

.service-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px var(--shadow-medium);
}

.service-icon {
  font-size: 3rem;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: center;
}

.service-icon svg, .service-icon img {
  width: 6rem;
  height: 6rem;
  object-fit: contain;
}

.service-card h3 {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text-dark);
}

.service-card p {
  color: var(--text-light);
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.service-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.service-link:hover {
  color: var(--secondary-color);
}
</style>
