<template>
  <div class="step-card fade-in">
    <div class="step-number">{{ stepNumber }}</div>
    <div class="step-icon">
      <img v-if="icon && icon.url" :src="`https://getting-there-cms.onrender.com${icon.url}`" :alt="title" />
      <component v-else :is="fallbackIconComponent" />
    </div>
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import PostItsIcon from '@/components/icons/PostItsIcon.vue';
import PuzzleIcon from '@/components/icons/PuzzleIcon.vue';
import ArrowIcon from '@/components/icons/ArrowIcon.vue';

const baseUrl = import.meta.env.VITE_CMS_URL || '';

const props = defineProps<{
  title: string;
  description: string;
  stepNumber: number;
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
      return PostItsIcon;
    case 1:
      return PuzzleIcon;
    case 2:
      return ArrowIcon;
    default:
      return PostItsIcon;
  }
});
</script>

<style scoped>
.step-card {
  background: white;
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 8px 30px var(--shadow-light);
  text-align: center;
  position: relative;
  transition: all 0.3s ease;
  border: 1px solid var(--border-light);
}

.step-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px var(--shadow-medium);
}

.step-number {
  position: absolute;
  top: -15px;
  left: 2rem;
  width: 30px;
  height: 30px;
  background: var(--primary-color);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;
}

.step-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
}

.step-icon svg, .step-icon img {
  width: 6rem;
  height: 6rem;
  object-fit: contain;
  transition: all 0.3s ease;
}

/* Colorful filters for each step icon */
.step-card:nth-child(1) .step-icon img {
  filter: invert(37%) sepia(93%) saturate(1990%) hue-rotate(316deg) brightness(102%) contrast(101%);
  /* Vibrant Pink/Magenta */
}

.step-card:nth-child(1):hover .step-icon img {
  filter: invert(37%) sepia(93%) saturate(1990%) hue-rotate(316deg) brightness(102%) contrast(101%) drop-shadow(0 4px 8px rgba(236, 64, 122, 0.4));
}

.step-card:nth-child(2) .step-icon img {
  filter: invert(47%) sepia(89%) saturate(1853%) hue-rotate(185deg) brightness(98%) contrast(101%);
  /* Bright Cyan/Turquoise */
}

.step-card:nth-child(2):hover .step-icon img {
  filter: invert(47%) sepia(89%) saturate(1853%) hue-rotate(185deg) brightness(98%) contrast(101%) drop-shadow(0 4px 8px rgba(0, 188, 212, 0.4));
}

.step-card:nth-child(3) .step-icon img {
  filter: invert(65%) sepia(97%) saturate(1186%) hue-rotate(358deg) brightness(102%) contrast(104%);
  /* Bright Orange/Coral */
}

.step-card:nth-child(3):hover .step-icon img {
  filter: invert(65%) sepia(97%) saturate(1186%) hue-rotate(358deg) brightness(102%) contrast(104%) drop-shadow(0 4px 8px rgba(255, 152, 0, 0.4));
}

.step-card h3 {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text-dark);
}

.step-card p {
  color: var(--text-light);
  line-height: 1.6;
}
</style>
