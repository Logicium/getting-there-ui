<script setup lang="ts">
import { onMounted, ref } from 'vue';
import ThoughtIcon from '@/components/icons/ThoughtIcon.vue';
import FallingStarIcon from '@/components/icons/FallingStarIcon.vue';
import HandDrawnPlantIcon from '@/components/icons/HandDrawnPlantIcon.vue';
import PlantIcon from '@/components/icons/PlantIcon.vue';
import PostItsIcon from '@/components/icons/PostItsIcon.vue';
import PuzzleIcon from '@/components/icons/PuzzleIcon.vue';
import IdeaIcon from '@/components/icons/IdeaIcon.vue';
import GrowthIcon from "@/components/icons/GrowthIcon.vue";
import ArrowIcon from "@/components/icons/ArrowIcon.vue";
import VideoIcon from "@/components/icons/VideoIcon.vue";
import BookIcon from "@/components/icons/BookIcon.vue";
import ChalkboardIcon from "@/components/icons/ChalkboardIcon.vue";
import PenIcon from "@/components/icons/PenIcon.vue";
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
  };
  meta: Record<string, any>;
}

// State for all sections data
const heroData = ref<HeroSection | null>(null);
const howItWorksData = ref<HowItWorks | null>(null);
const servicesData = ref<ServicesComponent | null>(null);
const resourcesData = ref<ResourcesComponent | null>(null);
const ctaData = ref<CTAComponent | null>(null);
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

    // Wait for the DOM to update with the new data
    setTimeout(() => {
      observeFadeElements();
    }, 100);
  } catch (err) {
    console.error('Error fetching page data:', err);
    error.value = err instanceof Error ? err.message : 'An unknown error occurred';
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  // Fetch all page data from CMS
  fetchPageData();

  // Image rotation for hero section
  let currentImageIndex = 0;
  const heroImages = document.querySelectorAll('.hero-image');

  function rotateHeroImages() {
    if (heroImages.length > 1) {
      heroImages[currentImageIndex]?.classList.remove('active');
      currentImageIndex = (currentImageIndex + 1) % heroImages.length;
      heroImages[currentImageIndex]?.classList.add('active');
    }
  }

  // Start image rotation after 3 seconds, then every 6 seconds (slower for calming effect)
  setTimeout(() => {
    setInterval(rotateHeroImages, 6000);
  }, 3000);

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
            <router-link to="/events" class="cta-primary">Start Your Journey</router-link>
            <router-link to="/about" class="cta-secondary">Learn How It Works</router-link>
          </div>
        </div>
        <div class="hero-visual">
          <div class="hero-images">
            <img src="/andrej-lisakov-Stdn0PNUyHM-unsplash.jpg" alt="Happy client achieving goals" class="hero-image active">
            <img src="/fortytwo-1xMG-yqR2GM-unsplash.jpg" alt="Success and motivation" class="hero-image">
            <img src="/hrant-khachatryan-V9sHuZ11lmk-unsplash.jpg" alt="Goal achievement celebration" class="hero-image">
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

<style scoped>
/* Hero Section */
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: var(--gradient-neutral);
  position: relative;
  overflow: hidden;
  padding-top: 80px;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="%234a7c59" fill-opacity="0.05"><circle cx="30" cy="30" r="2"/></g></svg>');
  animation: float 30s ease-in-out infinite;
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
}

.cta-primary {
  background: var(--primary-color);
  color: white;
  padding: 1rem 2rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px var(--shadow-light);
}

.cta-primary:hover {
  background: var(--secondary-color);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px var(--shadow-medium);
}

.cta-secondary {
  background: transparent;
  color: var(--primary-color);
  padding: 1rem 2rem;
  border: 2px solid var(--primary-color);
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.cta-secondary:hover {
  background: var(--primary-color);
  color: white;
}

.trust-indicators {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
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
}

.hero-image.active {
  opacity: 1;
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
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

/* Step card styles moved to InfoCard component */

/* Services Section */
.services {
  padding: 6rem 0;
  background: white;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 3rem;
  color: var(--text-dark);
  font-family: 'Playfair Display', serif;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

/* Service card styles moved to ServiceCard component */

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
}

.resources-text h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: var(--text-dark);
  font-family: 'Playfair Display', serif;
}

/* Resource item styles moved to ResourceCard component */

.resources-cta {
  display: inline-block;
  background: var(--primary-color);
  color: white;
  padding: 1rem 2rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  margin-top: 1rem;
  box-shadow: 0 4px 15px var(--shadow-light);
}

.resources-cta:hover {
  background: var(--secondary-color);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px var(--shadow-medium);
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
}

.visual-element:nth-child(2) {
  width: 100px;
  height: 100px;
  animation-delay: 1s;
}

.visual-element:nth-child(3) {
  width: 50px;
  height: 50px;
  animation-delay: 2s;
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
}

.visual-text h3 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.visual-text p {
  opacity: 0.9;
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
}

.cta-section .cta-primary {
  background: var(--accent-color);
}

.cta-section .cta-primary:hover {
  background: var(--warning-color);
}

.cta-section .cta-secondary {
  border-color: rgba(255, 255, 255, 0.5);
  color: rgba(255, 255, 255, 0.9);
}

.cta-section .cta-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: white;
  color: white;
}

.cta-assurance {
  display: flex;
  gap: 2rem;
  justify-content: center;
  flex-wrap: wrap;
  opacity: 0.8;
  font-size: 0.9rem;
}

/* Loading animation */
.fade-in {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease;
}

.fade-in.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Loading and Error States */
.loading-container, .error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  padding: 2rem;
  text-align: center;
  max-width: 1200px;
  margin: 0 auto;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid var(--bg-light);
  border-top: 5px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-container p {
  color: var(--warning-color);
  margin-bottom: 1rem;
  font-weight: 500;
}

.retry-button {
  background: var(--primary-color);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-button:hover {
  background: var(--secondary-color);
  transform: translateY(-2px);
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .hero-content {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
  }

  .hero-visual {
    order: -1;
    height: 300px;
  }

  .hero-cta {
    justify-content: center;
  }

  .trust-indicators {
    justify-content: center;
  }

  .steps-grid {
    grid-template-columns: 1fr;
  }

  .resources-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }

  .cta-assurance {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
