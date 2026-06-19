<script setup lang="ts">
import { onMounted, ref } from 'vue'
import NewsletterSignup from '@/components/NewsletterSignup.vue'
import {
  AppBlob,
  AppButton,
  AppContainer,
  AppDots,
  AppEyebrow,
  AppHero,
  AppMarquee,
  AppSection,
  AppSpinner,
  AppSquiggle,
} from '@/components/ui'
import { ArrowUpRight } from 'lucide-vue-next'

interface CmsImage {
  id: number
  url: string
  width: number
  height: number
  alternativeText?: string | null
  formats?: { small?: { url: string }; thumbnail?: { url: string } }
}
interface HeroSection { id: number; title: string; description: string; tag: string; imagecarousel: CmsImage[] | null }
interface InfoCardCMS { id: number; title: string; description: string; icon: CmsImage | null }
interface HowItWorks { id: number; title: string; infocards: InfoCardCMS[] }
interface ServiceCardCMS { id: number; title: string; description: string | null; linkLocation: string | null; icon: CmsImage | null }
interface ServicesComponent { id: number; title: string; servicecards: ServiceCardCMS[] }
interface ResourceCardCMS { id: number; title: string; description: string; icon: CmsImage | null }
interface ResourcesComponent { id: number; title: string; resourcecards: ResourceCardCMS[] }
interface CTAComponent { id: number; actiontext: string; buttontext: string }

interface HomePageData {
  data: {
    herosection: HeroSection
    howitworks: HowItWorks
    servicescomponent: ServicesComponent
    resourcescomponent: ResourcesComponent
    ctacomponent: CTAComponent
  }
}

const heroData = ref<HeroSection | null>(null)
const howItWorksData = ref<HowItWorks | null>(null)
const servicesData = ref<ServicesComponent | null>(null)
const resourcesData = ref<ResourcesComponent | null>(null)
const ctaData = ref<CTAComponent | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)

const CMS_BASE = 'https://getting-there-cms.onrender.com'

const cmsIcon = (icon: CmsImage | null | undefined) => {
  if (!icon) return null
  const path = icon.formats?.small?.url ?? icon.url
  return path ? `${CMS_BASE}${path}` : null
}

const fetchPageData = async () => {
  isLoading.value = true
  error.value = null
  try {
    const res = await fetch(`${import.meta.env.VITE_CMS_URL}/api/home-page?populate=all`)
    if (!res.ok) throw new Error(`Failed to fetch data: ${res.status}`)
    const json: HomePageData = await res.json()
    heroData.value = json.data.herosection
    howItWorksData.value = json.data.howitworks
    servicesData.value = json.data.servicescomponent
    resourcesData.value = json.data.resourcescomponent
    ctaData.value = json.data.ctacomponent
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'An unknown error occurred'
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchPageData)
</script>

<template>
  <main class="home">
    <!-- HERO -->
    <AppHero variant="editorial" tone="cream" class="home-hero">
      <template #eyebrow>
        <AppEyebrow v-if="heroData?.tag" tone="fuchsia">{{ heroData.tag }}</AppEyebrow>
      </template>
      <template #title>
        <span v-if="heroData">{{ heroData.title }}</span>
        <span v-else>A grief-aware community for getting <em>through</em>, together.</span>
      </template>
      <template #lede>
        <p v-if="heroData">{{ heroData.description }}</p>
        <p v-else>Workshops, gatherings, and resources for navigating loss with curiosity, courage and creativity.</p>
      </template>
      <template #actions>
        <AppButton to="/events" variant="primary" size="lg">Find a gathering</AppButton>
        <AppButton to="/about" variant="ghost" size="lg">What we do</AppButton>
      </template>
      <template #media>
        <figure class="home-hero-figure" aria-hidden="true">
          <AppBlob tone="marigold" class="home-hero-figure__blob home-hero-figure__blob--a" />
          <AppBlob tone="fuchsia"  class="home-hero-figure__blob home-hero-figure__blob--b" />
          <img
            v-if="heroData?.imagecarousel?.length"
            :src="`${CMS_BASE}${heroData.imagecarousel[0].url}`"
            :alt="heroData.imagecarousel[0].alternativeText ?? ''"
            class="home-hero-figure__img"
          />
          <img v-else src="/picture-1.jpg" alt="" class="home-hero-figure__img" />
          <AppDots tone="cobalt" class="home-hero-figure__dots" />
        </figure>
      </template>
    </AppHero>

    <AppMarquee tone="marigold" :items="['Community', 'Care', 'Conversation', 'Curiosity', 'Creativity']" />

    <!-- LOADING / ERROR -->
    <AppSection v-if="isLoading" tone="cream" pad="lg">
      <AppContainer size="md">
        <div class="home-state">
          <AppSpinner size="lg" />
          <p>Loading content...</p>
        </div>
      </AppContainer>
    </AppSection>

    <AppSection v-else-if="error" tone="cream" pad="lg">
      <AppContainer size="md">
        <div class="home-state">
          <p>{{ error }}</p>
          <AppButton variant="primary" @click="fetchPageData">Try again</AppButton>
        </div>
      </AppContainer>
    </AppSection>

    <!-- HOW IT WORKS — STICKY ASIDE + SCROLLING STEPS ON MARIGOLD -->
    <AppSection v-if="howItWorksData" tone="marigold" pad="xl" class="home-manifesto-section">
      <AppContainer size="lg">
        <div class="home-manifesto">
          <aside class="home-manifesto__aside">
            <AppEyebrow tone="fuchsia">How it works</AppEyebrow>
            <h2 class="home-manifesto__title">{{ howItWorksData.title }}</h2>
            <p class="home-manifesto__count">
              <span>{{ howItWorksData.infocards.length.toString().padStart(2, '0') }}</span> steps
            </p>
          </aside>

          <ol class="home-manifesto__list">
            <li
              v-for="(card, i) in howItWorksData.infocards"
              :key="card.id"
              class="home-manifesto__step-row"
            >
              <span class="home-manifesto__num" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</span>
              <div class="home-manifesto__art" aria-hidden="true">
                <img
                  v-if="cmsIcon(card.icon)"
                  :src="cmsIcon(card.icon) ?? ''"
                  :alt="''"
                  loading="lazy"
                />
              </div>
              <div class="home-manifesto__copy">
                <h3 class="home-manifesto__step">{{ card.title }}</h3>
                <p class="home-manifesto__body">{{ card.description }}</p>
              </div>
            </li>
          </ol>
        </div>
      </AppContainer>
    </AppSection>

    <!-- SERVICES — COMPACT EDITORIAL GRID WITH HAND-DRAWN ICONS -->
    <AppSection v-if="servicesData" tone="ink" pad="xl" id="services" class="home-spread-section">
      <AppContainer size="lg">
        <header class="home-spread__head">
          <AppEyebrow tone="marigold">What we offer</AppEyebrow>
          <h2 class="home-spread__title">{{ servicesData.title }}</h2>
        </header>

        <ul class="home-spread">
          <li
            v-for="(card, i) in servicesData.servicecards"
            :key="card.id"
            class="home-spread__row"
            :data-tone="(['marigold', 'cobalt', 'fuchsia', 'mint'] as const)[i % 4]"
          >
            <div class="home-spread__art" aria-hidden="true">
              <img
                v-if="cmsIcon(card.icon)"
                :src="cmsIcon(card.icon) ?? ''"
                :alt="''"
                loading="lazy"
              />
            </div>
            <div class="home-spread__copy">
              <span class="home-spread__tag">{{ String(i + 1).padStart(2, '0') }} — {{ servicesData.servicecards.length.toString().padStart(2, '0') }}</span>
              <h3 class="home-spread__heading">{{ card.title }}</h3>
              <p v-if="card.description" class="home-spread__body">{{ card.description }}</p>
              <RouterLink
                v-if="card.linkLocation"
                :to="card.linkLocation"
                class="home-spread__cta"
              >
                Read on
                <ArrowUpRight :size="16" :stroke-width="2.25" aria-hidden="true" />
              </RouterLink>
            </div>
          </li>
        </ul>
      </AppContainer>
    </AppSection>

    <!-- PULL-QUOTE: bleed fuchsia divider -->
    <AppSection tone="fuchsia" pad="xl" class="home-pullquote-section">
      <AppContainer size="md">
        <figure class="home-pullquote">
          <span class="home-pullquote__mark" aria-hidden="true">“</span>
          <blockquote class="home-pullquote__quote">
            You don’t have to be okay to be welcome. Show up as you are—
            <em>we will meet you there.</em>
          </blockquote>
          <figcaption class="home-pullquote__by">— The Getting There Studio</figcaption>
        </figure>
      </AppContainer>
    </AppSection>

    <AppSquiggle tone="cobalt" />

    <!-- RESOURCES — FULL-BLEED STRIP SPREAD -->
    <AppSection v-if="resourcesData" tone="cream-2" pad="xl" class="home-resources-section">
      <div class="home-resources-fullbleed">
        <header class="home-resources-intro">
          <AppEyebrow tone="marigold">Free resources</AppEyebrow>
          <h2 class="u-display u-display--md home-resources-intro__title">{{ resourcesData.title }}</h2>
          <p class="home-resources-intro__lede">Guides, prompts, and practical tools to help you keep moving with care.</p>
        </header>

        <div class="home-resources-stage">
          <ol class="home-toc">
            <li
              v-for="(card, i) in resourcesData.resourcecards"
              :key="card.id"
              class="home-toc__row"
              :data-tone="(['marigold', 'cobalt', 'fuchsia', 'mint'] as const)[i % 4]"
            >
              <div class="home-toc__icon" aria-hidden="true">
                <img
                  v-if="cmsIcon(card.icon)"
                  :src="cmsIcon(card.icon) ?? ''"
                  :alt="''"
                  loading="lazy"
                />
                <span v-else>{{ String(i + 1).padStart(2, '0') }}</span>
              </div>
              <div class="home-toc__body">
                <h3 class="home-toc__title">{{ card.title }}</h3>
                <p class="home-toc__dek">{{ card.description }}</p>
              </div>
            </li>
          </ol>

          <figure class="home-resources-float">
            <img src="/picture-1.jpg" alt="Getting There community" />
          </figure>
        </div>
      </div>
    </AppSection>

    <!-- CTA — COVER LINE (centered) -->
    <AppSection v-if="ctaData" tone="ink" pad="xl">
      <AppContainer size="md">
        <div class="home-cta">
          <p class="home-cta__kicker">· Vol. 01 · The invitation</p>
          <h2 class="home-cta__title">{{ ctaData.actiontext }}</h2>
          <div class="home-cta__rule" aria-hidden="true" />
          <div class="home-cta__buttons">
            <AppButton :to="'/events'" variant="primary" size="lg">{{ ctaData.buttontext }}</AppButton>
          </div>
          <div class="home-cta__newsletter">
            <NewsletterSignup
              variant="cta"
              source="home-cta"
              title="Stay in the loop"
              description="Subscribe for updates on gatherings, classes, and seasonal offerings."
              button-text="Subscribe"
            />
          </div>
        </div>
      </AppContainer>
    </AppSection>
  </main>
</template>

<style scoped lang="scss">
/* Home hero: free-standing single image floating behind text, blobs bleed outward */
.home-hero {
  // Strip the default editorial media chrome so the image floats freely
  :deep(.app-hero__media) {
    aspect-ratio: auto;
    border: none;
    border-radius: 0;
    overflow: visible;
    box-shadow: none;
    background: transparent;
  }

  // Lift the visible blobs in AppHero so they read more prominently
  :deep(.app-hero__shapes .shape--marigold) { opacity: 1; }
  :deep(.app-hero__shapes .shape--cobalt)   { opacity: 1; }
  :deep(.app-hero__shapes .shape--fuchsia)  { opacity: 1; }

  @media (min-width: 1024px) {
    :deep(.app-hero__inner) {
      grid-template-columns: minmax(0, 1.05fr) minmax(0, 1.15fr);
      gap: var(--s-5);
    }
  }
}

.home-hero-figure {
  position: relative;
  margin: 0;
  width: 100%;
  aspect-ratio: 4 / 3;
  isolation: isolate;

  @media (min-width: 1024px) {
    aspect-ratio: 5 / 4;
  }

  &__img {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border: 3px solid var(--c-ink);
    border-radius: var(--r-asym-c);
    box-shadow: var(--shadow-block);
  }

  &__blob {
    position: absolute;
    z-index: 0;
    pointer-events: none;

    &--a {
      top: -14%;
      left: -16%;
      width: 60%;
      height: 60%;
    }

    &--b {
      bottom: -16%;
      right: -14%;
      width: 52%;
      height: 52%;
    }
  }

  &__dots {
    position: absolute;
    z-index: 2;
    bottom: -6%;
    right: 6%;
    width: 80px;
    height: 80px;
  }
}

.home-section-head {
  text-align: center;
  margin-bottom: var(--s-8);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--s-3);
}

.home-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--s-4);
  text-align: center;
  color: var(--c-text-muted);
}

/* ------------------------------------------------------------------ */
/* HOW IT WORKS: sticky aside + scrolling steps on marigold           */
/* ------------------------------------------------------------------ */
.home-manifesto-section {
  overflow: hidden;
}

.home-manifesto {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--s-6);

  @media (min-width: 880px) {
    grid-template-columns: minmax(240px, 0.85fr) minmax(0, 1.4fr);
    gap: var(--s-10);
    align-items: start;
  }
}

.home-manifesto__aside {
  display: flex;
  flex-direction: column;
  gap: var(--s-3);

  @media (min-width: 880px) {
    position: sticky;
    top: var(--s-7);
  }
}

.home-manifesto__title {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(var(--fs-3xl), 5vw, var(--fs-5xl));
  line-height: var(--lh-tight);
  letter-spacing: var(--ls-tight);
  color: var(--c-ink);
  margin: 0;
}

.home-manifesto__count {
  font-family: var(--font-body);
  font-size: var(--fs-xs);
  letter-spacing: var(--ls-shout);
  text-transform: uppercase;
  color: var(--c-ink);
  opacity: 0.65;
  margin: var(--s-2) 0 0;

  span {
    font-family: var(--font-accent);
    font-size: var(--fs-2xl);
    line-height: 0.9;
    color: var(--c-fuchsia);
    -webkit-text-stroke: 1.2px var(--c-ink);
    margin-right: var(--s-2);
    letter-spacing: 0;
    text-transform: none;
  }
}

.home-manifesto__list {
  list-style: none;
  padding: 0;
  margin: 0;
  border-top: 1.5px solid var(--c-ink);
}

.home-manifesto__step-row {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  grid-template-areas:
    'num art'
    'copy copy';
  column-gap: var(--s-4);
  row-gap: var(--s-3);
  padding: var(--s-6) 0;
  border-bottom: 1.5px solid var(--c-ink);

  @media (min-width: 560px) {
    grid-template-columns: auto minmax(0, 1fr) 96px;
    grid-template-areas: 'num copy art';
    column-gap: var(--s-5);
    align-items: start;
    padding: var(--s-7) 0;
  }
}

.home-manifesto__num {
  grid-area: num;
  font-family: var(--font-accent);
  font-size: clamp(var(--fs-4xl), 8vw, 5.5rem);
  line-height: 0.85;
  color: var(--c-fuchsia);
  -webkit-text-stroke: 1.5px var(--c-ink);
  letter-spacing: -0.04em;
}

.home-manifesto__art {
  grid-area: art;
  width: 84px;
  height: 84px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (min-width: 560px) {
    width: 96px;
    height: 96px;
  }

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
}

.home-manifesto__copy {
  grid-area: copy;
  display: flex;
  flex-direction: column;
  gap: var(--s-3);
  max-width: 56ch;
}

.home-manifesto__step {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(var(--fs-xl), 2.4vw, var(--fs-2xl));
  line-height: var(--lh-tight);
  color: var(--c-ink);
  margin: 0;
}

.home-manifesto__body {
  font-family: var(--font-body);
  font-size: var(--fs-md);
  line-height: var(--lh-loose);
  color: var(--c-ink);
  margin: 0;
}

/* ------------------------------------------------------------------ */
/* SERVICES: compact rows with hand-drawn icons on ink                */
/* ------------------------------------------------------------------ */
.home-spread-section {
  color: var(--c-cream);
}

.home-spread__head {
  display: flex;
  flex-direction: column;
  gap: var(--s-3);
  margin-bottom: var(--s-7);
  max-width: 36ch;
}

.home-spread__title {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(var(--fs-3xl), 5vw, var(--fs-5xl));
  line-height: var(--lh-tight);
  letter-spacing: var(--ls-tight);
  color: var(--c-cream);
  margin: 0;
}

.home-spread {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
  border-top: 1.5px solid rgba(255, 255, 255, 0.18);

  @media (min-width: 720px) {
    grid-template-columns: 1fr 1fr;
    column-gap: var(--s-8);
  }
}

.home-spread__row {
  display: grid;
  grid-template-columns: 88px minmax(0, 1fr);
  column-gap: var(--s-5);
  align-items: start;
  padding: var(--s-5) 0;
  border-bottom: 1.5px solid rgba(255, 255, 255, 0.18);

  @media (min-width: 720px) {
    padding: var(--s-6) 0;
  }

  &[data-tone='marigold'] {
    --service-tone: var(--c-marigold);
    --service-icon-filter: invert(74%) sepia(43%) saturate(792%) hue-rotate(355deg) brightness(102%) contrast(97%);
  }

  &[data-tone='cobalt'] {
    --service-tone: var(--c-cobalt);
    --service-icon-filter: invert(33%) sepia(70%) saturate(1412%) hue-rotate(193deg) brightness(94%) contrast(92%);
  }

  &[data-tone='fuchsia'] {
    --service-tone: var(--c-fuchsia);
    --service-icon-filter: invert(39%) sepia(56%) saturate(1280%) hue-rotate(293deg) brightness(93%) contrast(98%);
  }

  &[data-tone='mint'] {
    --service-tone: var(--c-mint-deep);
    --service-icon-filter: invert(62%) sepia(31%) saturate(542%) hue-rotate(108deg) brightness(90%) contrast(90%);
  }
}

.home-spread__art {
  width: 88px;
  height: 88px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: color-mix(in srgb, var(--service-tone, var(--c-marigold)) 24%, var(--c-cream));
  border: 2px solid color-mix(in srgb, var(--service-tone, var(--c-marigold)) 58%, var(--c-ink));
  border-radius: var(--r-md);
  padding: var(--s-2);

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    filter: var(--service-icon-filter, none) drop-shadow(0 1px 0 rgba(255, 255, 255, 0.2));
  }
}

.home-spread__copy {
  display: flex;
  flex-direction: column;
  gap: var(--s-2);
  max-width: 44ch;
}

.home-spread__tag {
  font-family: var(--font-body);
  font-size: var(--fs-xs);
  letter-spacing: var(--ls-shout);
  text-transform: uppercase;
  color: var(--c-marigold);
  font-variant-numeric: tabular-nums;
}

.home-spread__heading {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: clamp(var(--fs-xl), 2.6vw, var(--fs-3xl));
  line-height: var(--lh-tight);
  letter-spacing: var(--ls-tight);
  color: var(--c-cream);
  margin: 0;
}

.home-spread__body {
  font-family: var(--font-body);
  font-size: var(--fs-md);
  line-height: var(--lh-base);
  color: rgba(255, 255, 255, 0.78);
  margin: 0;
}

.home-spread__cta {
  display: inline-flex;
  align-items: center;
  gap: var(--s-2);
  margin-top: var(--s-2);
  font-family: var(--font-body);
  font-weight: 600;
  font-size: var(--fs-sm);
  letter-spacing: var(--ls-wide);
  color: var(--c-marigold);
  text-decoration: none;
  padding-bottom: 3px;
  border-bottom: 1.5px solid var(--c-marigold);
  transition: color var(--dur-fast) var(--ease-snap), gap var(--dur-fast) var(--ease-snap);

  &:hover,
  &:focus-visible {
    color: var(--c-cream);
    border-bottom-color: var(--c-cream);
    gap: var(--s-3);
  }
}

/* ------------------------------------------------------------------ */
/* PULL-QUOTE: bleed fuchsia divider                                  */
/* ------------------------------------------------------------------ */
.home-pullquote-section {
  text-align: center;
}

.home-pullquote {
  margin: 0;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--s-4);
}

.home-pullquote__mark {
  font-family: var(--font-accent);
  font-size: clamp(6rem, 16vw, 12rem);
  line-height: 0.6;
  color: var(--c-ink);
  display: block;
  margin-top: var(--s-2);
  margin-bottom: calc(var(--s-3) * -1);
}

.home-pullquote__quote {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 400;
  font-size: clamp(var(--fs-2xl), 4.2vw, var(--fs-5xl));
  line-height: var(--lh-tight);
  letter-spacing: var(--ls-tight);
  color: var(--c-ink);
  margin: 0;
  max-width: 22ch;

  em {
    font-style: italic;
    color: var(--c-cream);
    background: var(--c-ink);
    padding: 0 0.2em;
  }
}

.home-pullquote__by {
  font-family: var(--font-body);
  font-size: var(--fs-xs);
  letter-spacing: var(--ls-shout);
  text-transform: uppercase;
  color: var(--c-ink);
  opacity: 0.7;
}

/* ------------------------------------------------------------------ */
/* RESOURCES: full-bleed single-color strip spread                    */
/* ------------------------------------------------------------------ */
.home-resources-section {
  overflow: hidden;
}

.home-resources-fullbleed {
  width: min(1400px, 100%);
  margin-inline: auto;
  padding-inline: clamp(var(--s-4), 3.2vw, var(--s-8));
}

.home-resources-intro {
  max-width: 42ch;
  display: flex;
  flex-direction: column;
  gap: var(--s-3);
  margin-bottom: var(--s-6);

  &__title {
    margin: 0;
  }

  &__lede {
    margin: 0;
    font-family: var(--font-body);
    color: var(--c-text-muted);
    line-height: var(--lh-base);
  }
}

.home-resources-stage {
  position: relative;
  min-height: clamp(460px, 56vw, 760px);
}

.home-toc {
  list-style: none;
  margin: 0;
  padding: 0;
  border: 2px solid var(--c-ink);
}

.home-toc__row {
  position: relative;
  display: grid;
  grid-template-columns: 86px minmax(0, 1fr);
  gap: var(--s-4);
  align-items: center;
  min-height: clamp(104px, 10vw, 140px);
  padding: var(--s-4) max(50vw, 420px) var(--s-4) var(--s-6);
  background: var(--c-cobalt);
  border-bottom: 2px solid var(--c-ink);

  &[data-tone='marigold'] {
    background: var(--c-marigold);
  }

  &[data-tone='cobalt'] {
    background: var(--c-cobalt);
  }

  &[data-tone='fuchsia'] {
    background: var(--c-fuchsia);
  }

  &[data-tone='mint'] {
    background: var(--c-mint);
  }

  &:last-child {
    border-bottom: 0;
  }

  @media (max-width: 920px) {
    grid-template-columns: 64px minmax(0, 1fr);
    padding: var(--s-4) var(--s-4) var(--s-4) var(--s-4);
  }

  @media (max-width: 560px) {
    grid-template-columns: 56px minmax(0, 1fr);
    padding: var(--s-3) var(--s-3) var(--s-3) var(--s-3);
  }
}

.home-toc__icon {
  width: 64px;
  height: 64px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: color-mix(in srgb, white 28%, transparent);
  border: 2px solid rgba(0, 0, 0, 0.45);
  border-radius: var(--r-sm);

  img {
    max-width: 84%;
    max-height: 84%;
    object-fit: contain;
    filter: brightness(0) invert(1);
    opacity: 0.95;
  }

  span {
    font-family: var(--font-accent);
    font-size: var(--fs-2xl);
    line-height: 1;
    color: color-mix(in srgb, var(--c-paper) 92%, white);
  }

  @media (max-width: 560px) {
    width: 50px;
    height: 50px;
  }
}

.home-toc__body {
  display: flex;
  flex-direction: column;
  gap: var(--s-1);
}

.home-toc__title {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(var(--fs-lg), 2.1vw, var(--fs-2xl));
  line-height: var(--lh-tight);
  color: color-mix(in srgb, var(--c-paper) 95%, white);
}

.home-toc__dek {
  margin: 0;
  font-family: var(--font-body);
  font-size: var(--fs-md);
  line-height: var(--lh-base);
  color: color-mix(in srgb, var(--c-paper) 82%, white);
  max-width: 52ch;
}

.home-resources-float {
  position: absolute;
  z-index: 2;
  top: 50%;
  right: clamp(14px, 2.4vw, 34px);
  transform: translateY(-50%);
  width: min(52%, 760px);
  max-height: 106%;
  margin: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border: 3px solid var(--c-ink);
    border-radius: var(--r-asym-a);
    box-shadow: var(--shadow-block);
  }

  @media (max-width: 920px) {
    position: relative;
    top: auto;
    right: auto;
    transform: none;
    width: 100%;
    max-height: none;
    margin-top: var(--s-4);
    aspect-ratio: 16 / 10;
  }
}

/* ------------------------------------------------------------------ */
/* CTA: centered cover line                                           */
/* ------------------------------------------------------------------ */
.home-cta {
  text-align: center;
  color: var(--c-cream);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--s-5);

  &__kicker {
    font-family: var(--font-body);
    font-size: var(--fs-xs);
    letter-spacing: var(--ls-shout);
    text-transform: uppercase;
    color: var(--c-marigold);
    margin: 0;
  }

  &__title {
    font-family: var(--font-display);
    font-weight: 400;
    font-size: clamp(var(--fs-3xl), 5.5vw, var(--fs-5xl));
    line-height: 1.05;
    letter-spacing: var(--ls-tight);
    color: var(--c-cream);
    margin: 0;
    max-width: 22ch;
  }

  &__rule {
    width: 96px;
    height: 3px;
    background: var(--c-marigold);
    border-radius: 2px;
  }

  &__buttons {
    display: flex; flex-wrap: wrap; gap: var(--s-3); justify-content: center;
    margin-top: var(--s-2);
  }

  &__newsletter {
    max-width: 520px;
    width: 100%;
    margin-top: var(--s-4);
    padding-top: var(--s-5);
    border-top: 1.5px solid rgba(255, 255, 255, 0.18);
  }
}
</style>
