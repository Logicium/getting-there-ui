<script setup lang="ts">
import { onMounted, ref } from 'vue';
import InfoCard from "@/components/cards/InfoCard.vue";
import ServiceCard from "@/components/cards/ServiceCard.vue";
import ResourceCard from "@/components/cards/ResourceCard.vue";
import NewsletterSignup from "@/components/NewsletterSignup.vue";

// Interface for the hero section data
interface HeroSection {
  id: number;
  title: string;
  description: string;
  tag: string;
  imagecarousel: null | any;
}

// Interface for info card in How It Works section
interface InfoCard {
  id: number;
  title: string;
  description: string;
  icon: null | any;
}

// Interface for How It Works section
interface HowItWorks {
  id: number;
  title: string;
  infocards: InfoCard[];
}

// Interface for service card in Services section
interface ServiceCard {
  id: number;
  title: string;
  description: string | null;
  linkLocation: string | null;
  icon: null | any;
}

// Interface for Services section
interface ServicesComponent {
  id: number;
  title: string;
  servicecards: ServiceCard[];
}

// Interface for resource card in Resources section
interface ResourceCard {
  id: number;
  title: string;
  description: string;
  icon: null | any;
}

// Interface for Resources section
interface ResourcesComponent {
  id: number;
  title: string;
  image: null | any;
  resourcecards: ResourceCard[];
}

// Interface for CTA section
interface CTAComponent {
  id: number;
  actiontext: string;
  buttontext: string;
}

// Interface for Action Button
interface ActionButton {
  id: number;
  buttonText: string;
  linkLocation: string;
}

// Interface for the home page data
interface HomePageData {
  data: {
    id: number;
    documentId: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    herosection: HeroSection;
    howitworks: HowItWorks;
    servicescomponent: ServicesComponent;
    resourcescomponent: ResourcesComponent;
    ctacomponent: CTAComponent;
    actionbutton: ActionButton;
    Video: {
      id: number;
      documentId: string;
      name: string;
      alternativeText: string | null;
      caption: string | null;
      width: number | null;
      height: number | null;
      formats: any | null;
      hash: string;
      ext: string;
      mime: string;
      size: number;
      url: string;
      previewUrl: string | null;
      provider: string;
      provider_metadata: any | null;
      createdAt: string;
      updatedAt: string;
      publishedAt: string;
    } | null;
  };
  meta: Record<string, any>;
}

// State for all sections data
const heroData = ref<HeroSection | null>(null);
const howItWorksData = ref<HowItWorks | null>(null);
const servicesData = ref<ServicesComponent | null>(null);
const resourcesData = ref<ResourcesComponent | null>(null);
const ctaData = ref<CTAComponent | null>(null);
const actionButtonData = ref<ActionButton | null>(null);
const videoData = ref<HomePageData['data']['Video']>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);
const videoPlayer = ref<HTMLVideoElement | null>(null);
const isVideoPlaying = ref(false);

// Function to observe fade-in elements
const observeFadeElements = () => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  // Observe all fade-in elements
  document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
  });
};

// Function to fetch all sections data from CMS
const fetchPageData = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    const response = await fetch(`${import.meta.env.VITE_CMS_URL}/api/home-page?populate=all`);

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }

    const data: HomePageData = await response.json();
    heroData.value = data.data.herosection;
    howItWorksData.value = data.data.howitworks;
    console.log(data.data.howitworks);
    servicesData.value = data.data.servicescomponent;
    resourcesData.value = data.data.resourcescomponent;
    ctaData.value = data.data.ctacomponent;
    actionButtonData.value = data.data.actionbutton;
    videoData.value = data.data.Video;

    // Wait for the DOM to update with the new data
    setTimeout(() => {
      observeFadeElements();
    }, 100);

    return data; // Return the data to allow Promise chaining
  } catch (err) {
    console.error('Error fetching page data:', err);
    error.value = err instanceof Error ? err.message : 'An unknown error occurred';
    throw err; // Re-throw to allow Promise chaining with .catch()
  } finally {
    isLoading.value = false;
  }
};

// Function to set up hero image rotation
const setupHeroImageRotation = () => {
  let currentImageIndex = 0;
  const heroImages = document.querySelectorAll('.hero-image');

  // Only set up rotation if we have images
  if (heroImages.length <= 1) return;

  function rotateHeroImages() {
    heroImages[currentImageIndex]?.classList.remove('active');
    currentImageIndex = (currentImageIndex + 1) % heroImages.length;
    heroImages[currentImageIndex]?.classList.add('active');
  }

  // Start image rotation after 3 seconds, then every 6 seconds (slower for calming effect)
  setTimeout(() => {
    setInterval(rotateHeroImages, 6000);
  }, 3000);
};

// Function to play the video
const playVideo = () => {
  if (videoPlayer.value) {
    videoPlayer.value.play();
    isVideoPlaying.value = true;
  }
};

// Function to hide the play button when the video is playing
const hidePlayButton = () => {
  isVideoPlaying.value = true;
};

// Function to show the play button when the video is paused or ended
const showPlayButton = () => {
  isVideoPlaying.value = false;
};

onMounted(() => {
  // Fetch all page data from CMS
  fetchPageData().then(() => {
    // Set up hero image rotation after data is loaded
    setTimeout(() => {
      setupHeroImageRotation();
    }, 500); // Small delay to ensure DOM is updated
  });

  // Initial observation of fade-in elements that might already be in the DOM
  observeFadeElements();

  // Header scroll effect
  window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
      if (header) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px var(--shadow-light)';
      }
    } else {
      if (header) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
      }
    }
  });
});
</script>

<template>
  <main>
    <!-- Hero Section -->
    <section class="hero" id="home">
      <!-- Full-bleed background carousel — always fills the hero box -->
      <div class="hero-bg" aria-hidden="true">
        <template v-if="heroData && heroData.imagecarousel && heroData.imagecarousel.length > 0">
          <div
            v-for="(image, index) in heroData.imagecarousel"
            :key="image.id"
            :class="['hero-image', index === 0 ? 'active' : '']"
            :style="{ backgroundImage: `url('https://getting-there-cms.onrender.com${image.url}')` }"
          ></div>
        </template>
        <template v-else>
          <div class="hero-image active" style="background-image: url('/andrej-lisakov-Stdn0PNUyHM-unsplash.jpg')"></div>
          <div class="hero-image" style="background-image: url('/fortytwo-1xMG-yqR2GM-unsplash.jpg')"></div>
          <div class="hero-image" style="background-image: url('/hrant-khachatryan-V9sHuZ11lmk-unsplash.jpg')"></div>
        </template>
        <div class="hero-scrim"></div>
      </div>

      <div v-if="isLoading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading content...</p>
      </div>

      <div v-else-if="error" class="error-container">
        <p>{{ error }}</p>
        <button @click="fetchPageData" class="retry-button">Retry</button>
      </div>

      <div v-else-if="heroData" class="hero-content">
        <div class="hero-text">
          <div class="hero-badge">{{ heroData.tag }}</div>
          <h1>{{ heroData.title }}</h1>
          <p>{{ heroData.description }}</p>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section v-if="howItWorksData" class="how-it-works">
      <div class="container">
        <h2 class="section-title fade-in">{{ howItWorksData.title }}</h2>
        <div class="steps-grid">
          <InfoCard
            v-for="(card, index) in howItWorksData.infocards"
            :key="card.id"
            :title="card.title"
            :description="card.description"
            :step-number="index + 1"
            :icon-index="index"
            :icon="card.icon"
          />
        </div>
      </div>
    </section>

    <!-- Services Section -->
    <section v-if="servicesData" class="services" id="services">
      <div class="container">
        <h2 class="section-title fade-in">{{ servicesData.title }}</h2>
        <div class="services-grid">
          <ServiceCard
            v-for="(card, index) in servicesData.servicecards"
            :key="card.id"
            :title="card.title"
            :description="card.description"
            :link-location="card.linkLocation"
            :icon-index="index"
            :icon="card.icon"
          />
        </div>
      </div>
    </section>

    <!-- Resources Preview Section -->
    <section v-if="resourcesData" class="resources-preview">
      <div class="container">
        <div class="resources-content">
          <div class="resources-text fade-in">
            <h2>{{ resourcesData.title }}</h2>
            <ResourceCard
              v-for="(card, index) in resourcesData.resourcecards"
              :key="card.id"
              :title="card.title"
              :description="card.description"
              :icon-index="index"
              :icon="card.icon"
            />
          </div>
          <div class="resources-visual fade-in">
            <img
              src="/picture-1.jpg"
              alt="Getting There community"
              class="resources-visual-image"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section v-if="ctaData" class="cta-section">
      <div class="container">
        <div class="cta-content fade-in">
          <h2>{{ ctaData.actiontext }}</h2>
          <div class="cta-buttons">
            <router-link to="/events" class="cta-primary">{{ ctaData.buttontext }}</router-link>
<!--            <a href="mailto:support@gthere.net" class="cta-secondary">Get Started Today</a>-->
          </div>

          <div class="cta-newsletter">
            <NewsletterSignup
              variant="cta"
              source="home-cta"
              title="Stay in the loop"
              description="Subscribe to our weekly newsletter to keep up to date on changes, additions, and special events or offers"
              button-text="Subscribe"
            />
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped lang="scss">
@import '@/assets/common.scss';
@import '@/assets/scss/mixins';
@import '@/assets/scss/variables';

/* Hero Section — full-bleed image with overlaid text */
.hero {
  position: relative;
  min-height: 100vh;
  min-height: 100svh;
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  overflow: hidden;
  padding: 0;
  color: #fff;

  @include mobile-only {
    align-items: flex-end;
  }
}

.hero-content {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 8rem $spacing-xl $spacing-3xl;
  display: block;

  @include mobile-only {
    padding: 6rem $spacing-lg $spacing-2xl;
    text-align: left;
  }
}

.hero-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
}

.hero-image {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0;
  transition: opacity 2s ease-in-out;
  transform: scale(1.05);
  animation: heroKenBurns 18s ease-in-out infinite alternate;

  &.active {
    opacity: 1;
  }
}

@keyframes heroKenBurns {
  from { transform: scale(1.02) translate3d(0, 0, 0); }
  to   { transform: scale(1.12) translate3d(-1%, -1%, 0); }
}

.hero-scrim {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(20, 30, 22, 0.15) 0%, rgba(20, 30, 22, 0.55) 55%, rgba(20, 30, 22, 0.85) 100%),
    linear-gradient(90deg, rgba(20, 30, 22, 0.45) 0%, rgba(20, 30, 22, 0) 60%);
  pointer-events: none;
}

.hero-text {
  max-width: 640px;
  color: #fff;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.35);
}

.hero-badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.16);
  color: #fff;
  padding: $spacing-sm $spacing-md;
  border-radius: $radius-2xl;
  font-size: $font-size-sm;
  font-weight: 600;
  margin-bottom: $spacing-lg;
  border: 1px solid rgba(255, 255, 255, 0.35);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  text-shadow: none;
}

.hero h1 {
  font-size: clamp(2.25rem, 6vw, 4rem);
  font-weight: 700;
  margin-bottom: $spacing-lg;
  line-height: 1.1;
  color: #fff;
  font-family: 'Playfair Display', serif;
}

.hero p {
  font-size: clamp(1rem, 1.6vw, 1.25rem);
  margin-bottom: $spacing-xl;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.92);
  max-width: 56ch;
}

.hero-cta {
  @include flex-row($spacing-md);
  flex-wrap: wrap;

  @include mobile-only {
    justify-content: flex-start;
  }
}

.hero .cta-secondary {
  background: transparent;
  color: #fff;
  border: 1.5px solid rgba(255, 255, 255, 0.7);

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: #fff;
    color: #fff;
  }
}

/* How It Works Section */
.how-it-works {
  padding: $spacing-3xl 0;
  background: var(--bg-light);
}

.steps-grid {
  @include grid-auto(300px, $spacing-xl);
  margin-top: $spacing-2xl;

  @include mobile-only {
    grid-template-columns: 1fr;
  }
}

/* Services Section */
.services {
  padding: $spacing-3xl 0;
  background: white;
}

.services-grid {
  @include grid-auto(280px, $spacing-xl);
  margin-top: $spacing-2xl;
}

/* Resources Preview Section */
.resources-preview {
  padding: $spacing-3xl 0;
  background: white;
}

.resources-content {
  @include grid-two($spacing-3xl);
  align-items: center;
}

.resources-text h2 {
  @include heading-large;
  font-family: 'Playfair Display', serif;
}

.resources-visual {
  position: relative;
  height: 400px;
  background: var(--gradient);
  border-radius: $radius-xl;
  overflow: hidden;
  @include flex-center;
}

.resources-visual-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* CTA Section */
.cta-section {
  padding: $spacing-3xl 0;
  background: var(--text-dark);
  color: white;
}

.cta-content {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.cta-section h2 {
  @include heading-large;
  color: white;
  font-family: 'Playfair Display', serif;
}

.cta-section p {
  font-size: $font-size-lg;
  margin-bottom: $spacing-xl;
  opacity: 0.9;
  line-height: 1.6;
}

.cta-buttons {
  @include flex-row($spacing-md);
  justify-content: center;
  margin-bottom: $spacing-xl;
  flex-wrap: wrap;

  @include mobile-only {
    flex-direction: column;
    align-items: center;
  }
}

.cta-newsletter {
  margin-top: $spacing-lg;
  padding-top: $spacing-lg;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  justify-content: center;
}

.cta-section .cta-primary {
  @include button-base(var(--accent-color), white);

  &:hover {
    background: var(--warning-color);
    transform: translateY(-2px);
  }
}

.cta-section .cta-secondary {
  @include button-base(transparent, rgba(255, 255, 255, 0.9));
  border: 2px solid rgba(255, 255, 255, 0.5);

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: white;
    color: white;
    transform: translateY(-2px);
  }
}

.cta-assurance {
  @include flex-row($spacing-xl);
  justify-content: center;
  flex-wrap: wrap;
  opacity: 0.8;
  font-size: $font-size-sm;

  @include mobile-only {
    flex-direction: column;
    gap: $spacing-md;
  }
}
</style>
