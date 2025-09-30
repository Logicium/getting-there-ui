<script setup lang="ts">
import { onMounted, ref } from 'vue';
import InfoCard from "@/components/cards/InfoCard.vue";
import ServiceCard from "@/components/cards/ServiceCard.vue";
import ResourceCard from "@/components/cards/ResourceCard.vue";

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
  description: string;
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
const isLoading = ref(true);
const error = ref<string | null>(null);

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
          <div class="hero-cta">
            <router-link :to="actionButtonData ? '/' + actionButtonData.linkLocation : '/events'" class="cta-primary">{{ actionButtonData ? actionButtonData.buttonText : 'Start Your Journey' }}</router-link>
            <router-link to="/about" class="cta-secondary">Learn How It Works</router-link>
          </div>
        </div>
        <div class="hero-visual">
          <div class="hero-images">
            <!-- Use CMS imagecarousel data if available -->
            <template v-if="heroData.imagecarousel && heroData.imagecarousel.length > 0">
              <img
                v-for="(image, index) in heroData.imagecarousel"
                :key="image.id"
                :src="`https://getting-there-cms.onrender.com${image.url}`"
                :alt="image.alternativeText || 'Hero image'"
                :class="['hero-image', index === 0 ? 'active' : '']"
              >
            </template>
            <!-- Fallback to static images if no CMS data -->
            <template v-else>
              <img src="/andrej-lisakov-Stdn0PNUyHM-unsplash.jpg" alt="Happy client achieving goals" class="hero-image active">
              <img src="/fortytwo-1xMG-yqR2GM-unsplash.jpg" alt="Success and motivation" class="hero-image">
              <img src="/hrant-khachatryan-V9sHuZ11lmk-unsplash.jpg" alt="Goal achievement celebration" class="hero-image">
            </template>
          </div>
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
            <router-link to="/videos" class="resources-cta">Explore Resources</router-link>
          </div>
          <div class="resources-visual fade-in">
            <div class="visual-element"></div>
            <div class="visual-element"></div>
            <div class="visual-element"></div>
            <div class="visual-text">
              <h3>Evidence-Based</h3>
              <p>Research-backed approaches</p>
            </div>
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
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped lang="scss">
@import '@/assets/common.scss';

/* Hero Section */
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: var(--gradient-neutral);
  position: relative;
  overflow: hidden;
  padding-top: 80px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="%234a7c59" fill-opacity="0.05"><circle cx="30" cy="30" r="2"/></g></svg>');
    animation: float 30s ease-in-out infinite;
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(180deg); }
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
  }
}

.hero-text {
  color: var(--text-dark);
}

.hero-badge {
  display: inline-block;
  background: var(--bg-sage);
  color: var(--primary-color);
  padding: 0.5rem 1rem;
  border-radius: 25px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  border: 1px solid var(--border-light);
}

.hero h1 {
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 700;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  color: var(--text-dark);
  font-family: 'Playfair Display', serif;
}

.hero p {
  font-size: 1.1rem;
  margin-bottom: 2rem;
  line-height: 1.6;
  color: var(--text-light);
}

.hero-cta {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    justify-content: center;
  }
}

.trust-indicators {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    justify-content: center;
  }
}

.trust-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-light);
  font-size: 0.9rem;
}

.trust-icon {
  font-size: 1.1rem;
}

.hero-visual {
  position: relative;
  height: 500px;

  @media (max-width: 768px) {
    order: -1;
    height: 300px;
  }
}

.hero-images {
  position: relative;
  height: 100%;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px var(--shadow-medium);
}

.hero-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 20px;
  opacity: 0;
  transition: opacity 2s ease-in-out;

  &.active {
    opacity: 1;
  }
}

@keyframes gentleFloat {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

/* How It Works Section */
.how-it-works {
  padding: 6rem 0;
  background: var(--bg-light);
}

.steps-grid {
  @extend .grid-auto-fit;
  margin-top: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

/* Services Section */
.services {
  padding: 6rem 0;
  background: white;
}

.services-grid {
  @extend .grid-auto-fit;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  margin-top: 3rem;
}

/* Resources Preview Section */
.resources-preview {
  padding: 6rem 0;
  background: white;
}

.resources-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

.resources-text h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: var(--text-dark);
  font-family: 'Playfair Display', serif;
}

.resources-cta {
  @extend .cta-primary;
  margin-top: 1rem;
  display: inline-block;
}

.resources-visual {
  position: relative;
  height: 400px;
  background: var(--gradient);
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.visual-element {
  width: 150px;
  height: 150px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  position: absolute;
  animation: gentlePulse 4s ease-in-out infinite;

  &:nth-child(2) {
    width: 100px;
    height: 100px;
    animation-delay: 1s;
  }

  &:nth-child(3) {
    width: 50px;
    height: 50px;
    animation-delay: 2s;
  }
}

@keyframes gentlePulse {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.1); opacity: 0.3; }
}

.visual-text {
  color: white;
  text-align: center;
  z-index: 2;
  position: relative;

  h3 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }

  p {
    opacity: 0.9;
  }
}

/* CTA Section */
.cta-section {
  padding: 6rem 0;
  background: var(--text-dark);
  color: white;
}

.cta-content {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.cta-section h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  font-family: 'Playfair Display', serif;
}

.cta-section p {
  font-size: 1.1rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  line-height: 1.6;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
}

.cta-section .cta-primary {
  background: var(--accent-color);

  &:hover {
    background: var(--warning-color);
  }
}

.cta-section .cta-secondary {
  border-color: rgba(255, 255, 255, 0.5);
  color: rgba(255, 255, 255, 0.9);

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: white;
    color: white;
  }
}

.cta-assurance {
  display: flex;
  gap: 2rem;
  justify-content: center;
  flex-wrap: wrap;
  opacity: 0.8;
  font-size: 0.9rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
