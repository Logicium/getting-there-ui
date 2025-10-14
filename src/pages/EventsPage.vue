<script setup lang="ts">
import { onMounted, ref } from 'vue';
import GrowthIcon from "@/components/icons/GrowthIcon.vue";
import PlantIcon from "@/components/icons/PlantIcon.vue";
import Plant2Icon from "@/components/icons/Plant2Icon.vue";
import FeaturedEventCard from '@/components/cards/FeaturedEventCard.vue';
import EventCard from '@/components/cards/EventCard.vue';
import PrivateWorkshopsSection from '@/components/sections/PrivateWorkshopsSection.vue';
import SupportInfoSection from '@/components/sections/SupportInfoSection.vue';
import { observeFadeElements } from '@/utils/animationUtils';
import { filterElementsByCategory } from '@/utils/filterUtils';
import { getCategoryFromTitle, getEventIcon, sortEventsByDate } from '@/utils/eventUtils';
import { formatTime, formatDate, formatPrice } from '@/utils/formatUtils';
import type { HeroSection, EventsPageData, Event, EventsResponse } from '@/types/event';

// State for hero section data
const heroData = ref<HeroSection | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);

// State for events data
const events = ref<Event[]>([]);
const featuredEvent = ref<Event | null>(null);

// Filter functionality
const currentFilter = ref('all');

function setFilter(filter: string) {
  currentFilter.value = filter;
  filterElementsByCategory('.therapy-event-card', filter);
}

// Function to fetch events page data from CMS
const fetchPageData = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    const cmsUrl = import.meta.env.VITE_CMS_URL || 'https://getting-there-cms.onrender.com';

    // Fetch page data (hero section)
    const pageResponse = await fetch(`${cmsUrl}/api/events-page?populate=all`);
    if (!pageResponse.ok) {
      throw new Error(`Failed to fetch page data: ${pageResponse.status} ${pageResponse.statusText}`);
    }
    const pageData: EventsPageData = await pageResponse.json();
    heroData.value = pageData.data.Hero;

    // Fetch events data
    const eventsResponse = await fetch(`${cmsUrl}/api/events?populate=*`);
    if (!eventsResponse.ok) {
      throw new Error(`Failed to fetch events data: ${eventsResponse.status} ${eventsResponse.statusText}`);
    }
    const eventsData: EventsResponse = await eventsResponse.json();
    events.value = eventsData.data;

    // Find featured event
    featuredEvent.value = events.value.find(event => event.isFeatured === true) || null;

    // Wait for the DOM to update with the new data
    setTimeout(() => {
      observeFadeElements();
    }, 100);
  } catch (err) {
    console.error('Error fetching data:', err);
    error.value = err instanceof Error ? err.message : 'An unknown error occurred';
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  // Fetch page data from CMS
  fetchPageData().then(() => {
    // Sort events by date
    events.value = sortEventsByDate(events.value);
  });

  // Initial observation of fade-in elements
  observeFadeElements();
});
</script>

<template>
  <section class="therapy-events-hero">
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Loading events content...</p>
    </div>

    <div v-else-if="error" class="error-container">
      <p>{{ error }}</p>
      <button @click="fetchPageData" class="retry-button">Retry</button>
    </div>

    <div v-else-if="heroData" class="therapy-events-hero-content">
      <h1>{{ heroData.title }}</h1>
      <p>{{ heroData.description }}</p>
      <div class="hero-wellness-indicators">
        <span class="trust-badge">🏆 PhD Educated Professionals</span>
        <span class="trust-badge">🤝 Safe Spaces</span>
        <span class="trust-badge">💚 Evidence-Based Approaches</span>
      </div>
    </div>
  </section>

  <section class="therapy-events-filter">
    <div class="filter-wellness-content">
      <div class="filter-wellness-buttons">
        <button class="wellness-filter-btn" :class="{ active: currentFilter === 'all' }" @click="setFilter('all')">
          📅 All Programs
        </button>
        <button class="wellness-filter-btn" :class="{ active: currentFilter === 'therapy' }" @click="setFilter('therapy')">
          🧠 Therapy Groups
        </button>
        <button class="wellness-filter-btn" :class="{ active: currentFilter === 'mindfulness' }" @click="setFilter('mindfulness')">
          🧘 Mindfulness
        </button>
        <button class="wellness-filter-btn" :class="{ active: currentFilter === 'support' }" @click="setFilter('support')">
          🤝 Support Groups
        </button>
        <button class="wellness-filter-btn" :class="{ active: currentFilter === 'online' }" @click="setFilter('online')">
          💻 Virtual Sessions
        </button>
      </div>
    </div>
  </section>

  <main class="therapy-events-content">

    <!-- Featured Event -->
    <FeaturedEventCard v-if="featuredEvent" :event="featuredEvent" />

    <h2 class="wellness-section-title fade-in">All Programs & Support Groups</h2>

    <div class="therapy-events-grid" id="eventsGrid">
      <EventCard
        v-for="event in events.filter(e => !e.isFeatured)"
        :key="event.id"
        :event="event"
        :linkCard="false"
        class="fade-in"
      />
    </div>

    <PrivateWorkshopsSection />

    <SupportInfoSection />
  </main>
</template>

<style scoped lang="scss">
@import '@/assets/common.scss';
@import '@/assets/scss/mixins';
@import '@/assets/scss/variables';

svg {
  height: 50px;
  width: 50px;
  margin-right: $spacing-sm;
}

/* Therapy Events Hero Section */
.therapy-events-hero {
  @extend .hero-base;
  background: var(--gradient);
  color: white;
  text-align: center;
}

.therapy-events-hero-content {
  @extend .hero-content-base;
}

/* Filter Section */
.therapy-events-filter {
  background: var(--bg-light);
  padding: $spacing-xl 0;
  border-bottom: 1px solid var(--border-light);
}

.filter-wellness-content {
  @extend .container;
  @include flex-row($spacing-xl);
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
}

.filter-wellness-buttons {
  @include flex-row($spacing-md);
  flex-wrap: wrap;
}

.wellness-filter-btn {
  padding: $spacing-sm $spacing-lg;
  background: white;
  border: 2px solid var(--border-light);
  border-radius: $radius-2xl;
  color: var(--text-dark);
  font-weight: 600;
  transition: all $transition-normal;
  cursor: pointer;
  @include flex-center;
  gap: $spacing-sm;

  &:hover, &.active {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px var(--shadow-light);
  }
}

/* Main Content */
.therapy-events-content {
  @extend .container;
  padding: $spacing-3xl $spacing-xl;
}

/* Events Grid */
.therapy-events-grid {
  @include grid-auto(380px, $spacing-xl);
  margin-bottom: $spacing-3xl;
}

/* Styles for therapy-event-card have been moved to EventCard.vue component */
</style>
