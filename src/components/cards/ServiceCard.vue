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
  transition: all 0.3s ease;
}

/* Vibrant color filters for each service icon */
.service-card:nth-child(1) .service-icon img,
.service-card:nth-child(1) .service-icon svg {
  filter: invert(48%) sepia(79%) saturate(2476%) hue-rotate(240deg) brightness(102%) contrast(107%);
  /* Electric Purple/Violet */
}

.service-card:nth-child(1):hover .service-icon img,
.service-card:nth-child(1):hover .service-icon svg {
  filter: invert(48%) sepia(79%) saturate(2476%) hue-rotate(240deg) brightness(102%) contrast(107%) drop-shadow(0 4px 8px rgba(103, 58, 183, 0.5));
}

.service-card:nth-child(2) .service-icon img,
.service-card:nth-child(2) .service-icon svg {
  filter: invert(58%) sepia(96%) saturate(4498%) hue-rotate(128deg) brightness(100%) contrast(102%);
  /* Vibrant Lime Green */
}

.service-card:nth-child(2):hover .service-icon img,
.service-card:nth-child(2):hover .service-icon svg {
  filter: invert(58%) sepia(96%) saturate(4498%) hue-rotate(128deg) brightness(100%) contrast(102%) drop-shadow(0 4px 8px rgba(139, 195, 74, 0.5));
}

.service-card:nth-child(3) .service-icon img,
.service-card:nth-child(3) .service-icon svg {
  filter: invert(42%) sepia(93%) saturate(1352%) hue-rotate(335deg) brightness(119%) contrast(119%);
  /* Hot Pink/Fuchsia */
}

.service-card:nth-child(3):hover .service-icon img,
.service-card:nth-child(3):hover .service-icon svg {
  filter: invert(42%) sepia(93%) saturate(1352%) hue-rotate(335deg) brightness(119%) contrast(119%) drop-shadow(0 4px 8px rgba(233, 30, 99, 0.5));
}

.service-card:nth-child(4) .service-icon img,
.service-card:nth-child(4) .service-icon svg {
  filter: invert(63%) sepia(71%) saturate(4456%) hue-rotate(359deg) brightness(101%) contrast(101%);
  /* Sunny Yellow */
}

.service-card:nth-child(4):hover .service-icon img,
.service-card:nth-child(4):hover .service-icon svg {
  filter: invert(63%) sepia(71%) saturate(4456%) hue-rotate(359deg) brightness(101%) contrast(101%) drop-shadow(0 4px 8px rgba(255, 193, 7, 0.5));
}

.service-card:nth-child(5) .service-icon img,
.service-card:nth-child(5) .service-icon svg {
  filter: invert(55%) sepia(98%) saturate(1676%) hue-rotate(157deg) brightness(95%) contrast(101%) !important;
  /* Teal/Aqua */
}

.service-card:nth-child(5):hover .service-icon img,
.service-card:nth-child(5):hover .service-icon svg {
  filter: invert(55%) sepia(98%) saturate(1676%) hue-rotate(157deg) brightness(95%) contrast(101%) drop-shadow(0 4px 8px rgba(0, 150, 136, 0.5)) !important;
}

.service-card:nth-child(6) .service-icon img,
.service-card:nth-child(6) .service-icon svg {
  filter: invert(62%) sepia(57%) saturate(3333%) hue-rotate(2deg) brightness(103%) contrast(102%) !important;
  /* Bright Red/Coral */
}

.service-card:nth-child(6):hover .service-icon img,
.service-card:nth-child(6):hover .service-icon svg {
  filter: invert(62%) sepia(57%) saturate(3333%) hue-rotate(2deg) brightness(103%) contrast(102%) drop-shadow(0 4px 8px rgba(244, 67, 54, 0.5)) !important;
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
