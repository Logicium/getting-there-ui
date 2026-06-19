<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import FeaturedEventCard from '@/components/cards/FeaturedEventCard.vue';
import EventCard from '@/components/cards/EventCard.vue';
import PrivateWorkshopsSection from '@/components/sections/PrivateWorkshopsSection.vue';
import { observeFadeElements } from '@/utils/animationUtils';
import { filterElementsByCategory } from '@/utils/filterUtils';
import { getCategoryFromTitle, sortEventsByDate } from '@/utils/eventUtils';
import type { HeroSection, EventsPageData, Event, EventsResponse } from '@/types/event';
import {
  AppButton,
  AppContainer,
  AppEmptyState,
  AppEyebrow,
  AppGrid,
  AppHero,
  AppMarquee,
  AppSection,
  AppSpinner,
} from '@/components/ui';

// State for hero section data
const heroData = ref<HeroSection | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);

// State for events data
const events = ref<Event[]>([]);
const featuredEvent = ref<Event | null>(null);

// Derived categories from events (lowercased)
const categories = computed(() => {
  const set = new Set<string>();
  for (const e of events.value) {
    const cat = (e.Category?.trim().toLowerCase()) || getCategoryFromTitle(e.Title);
    if (cat && cat !== 'all') set.add(cat);
  }
  return Array.from(set).sort();
});

// Filter functionality
const currentFilter = ref('all');

function setFilter(filter: string) {
  currentFilter.value = filter;
  filterElementsByCategory('.therapy-event-card', filter);
}

function formatCategoryLabel(cat: string): string {
  return cat
    .split(' ')
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
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
  <main class="events-page">
    <!-- HERO -->
    <AppHero variant="editorial" tone="cream" align="center">
      <template #eyebrow>
        <AppEyebrow tone="fuchsia">Gatherings &amp; Programs</AppEyebrow>
      </template>
      <template #title>
        <span v-if="heroData">{{ heroData.title }}</span>
        <span v-else>Find a healing circle</span>
      </template>
      <template #lede>
        <p v-if="heroData">{{ heroData.description }}</p>
        <p v-else>Workshops, support groups, and seasonal gatherings to walk with you through whatever you are getting through.</p>
      </template>
    </AppHero>

    <AppMarquee tone="cobalt" :items="['Workshops', 'Circles', 'Retreats', 'Conversations', 'Care']" />

    <!-- LOADING / ERROR -->
    <AppSection v-if="isLoading" tone="cream" pad="lg">
      <AppContainer size="md">
        <div class="events-state">
          <AppSpinner size="lg" />
          <p>Loading events content...</p>
        </div>
      </AppContainer>
    </AppSection>

    <AppSection v-else-if="error" tone="cream" pad="lg">
      <AppContainer size="md">
        <AppEmptyState variant="error" :title="error">
          <template #actions>
            <AppButton variant="primary" @click="fetchPageData">Retry</AppButton>
          </template>
        </AppEmptyState>
      </AppContainer>
    </AppSection>

    <!-- FILTER + EVENTS -->
    <template v-else>
      <AppSection tone="mint" pad="xl">
        <AppContainer size="lg">
          <header class="events-head">
            <AppEyebrow tone="ink">Browse by focus</AppEyebrow>
            <h2 class="u-display u-display--md">What feels right for now?</h2>
          </header>

          <div class="events-filter" role="tablist" aria-label="Filter events by category">
            <AppButton
              :variant="currentFilter === 'all' ? 'primary' : 'ghost'"
              size="sm"
              @click="setFilter('all')"
            >
              All Programs
            </AppButton>
            <AppButton
              v-for="cat in categories"
              :key="cat"
              :variant="currentFilter === cat ? 'primary' : 'ghost'"
              size="sm"
              @click="setFilter(cat)"
            >
              {{ formatCategoryLabel(cat) }}
            </AppButton>
          </div>

          <!-- FEATURED -->
          <div v-if="featuredEvent" class="events-featured">
            <FeaturedEventCard :event="featuredEvent" />
          </div>

          <!-- GRID -->
          <div v-if="events.filter(e => !e.isFeatured).length" class="events-grid-wrap">
            <AppGrid :min="320" gap="md">
              <div
                v-for="(event, i) in events.filter(e => !e.isFeatured)"
                :key="event.id"
                class="therapy-event-card fade-in"
                :data-category="(event.Category && event.Category.trim().toLowerCase()) || getCategoryFromTitle(event.Title)"
                :data-tone="(['marigold', 'cobalt', 'fuchsia', 'mint'] as const)[i % 4]"
              >
                <EventCard :event="event" :link-card="false" />
              </div>
            </AppGrid>
          </div>
          <AppEmptyState
            v-else-if="!featuredEvent"
            variant="empty"
            title="No events scheduled right now"
            message="We're between gatherings. Check back soon or sign up for our newsletter to hear first."
          >
            <template #actions>
              <AppButton to="/about" variant="ghost">Learn about us</AppButton>
            </template>
          </AppEmptyState>
        </AppContainer>
      </AppSection>

      <!-- PRIVATE WORKSHOPS -->
      <AppSection tone="cream-2" pad="xl">
        <PrivateWorkshopsSection />
      </AppSection>
    </template>
  </main>
</template>

<style scoped lang="scss">
.events-page { color: var(--c-text); }

.events-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--s-4);
  text-align: center;
  color: var(--c-text-muted);
}

.events-head {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--s-2);
  margin-bottom: var(--s-6);

  h2 {
    font-size: clamp(var(--fs-3xl), 5vw, var(--fs-5xl));
    line-height: var(--lh-tight);
  }
}

.events-filter {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s-2);
  justify-content: center;
  margin-bottom: var(--s-8);
}

.events-featured { margin-bottom: var(--s-8); }

.events-grid-wrap { margin-top: var(--s-4); }

.therapy-event-card {
  // Wrapper used by filterElementsByCategory in script (sets display: block | none).
  display: block;
  height: 100%;

  > * { height: 100%; width: 100%; }

  &[data-tone='marigold'] :deep(.app-card) {
    background: color-mix(in srgb, var(--c-marigold) 78%, var(--c-cream));
  }

  &[data-tone='cobalt'] :deep(.app-card) {
    background: color-mix(in srgb, var(--c-cobalt) 24%, var(--c-cream));
  }

  &[data-tone='fuchsia'] :deep(.app-card) {
    background: color-mix(in srgb, var(--c-fuchsia) 24%, var(--c-cream));
  }

  &[data-tone='mint'] :deep(.app-card) {
    background: color-mix(in srgb, var(--c-mint) 38%, var(--c-cream));
  }

  :deep(.app-card) {
    border-color: var(--c-ink);
  }
}

.fade-in {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 600ms var(--ease-out), transform 600ms var(--ease-out);
  &.visible { opacity: 1; transform: none; }

  @media (prefers-reduced-motion: reduce) {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>
