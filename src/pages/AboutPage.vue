<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import {
  AppBlob,
  AppButton,
  AppCard,
  AppContainer,
  AppDots,
  AppEmptyState,
  AppEyebrow,
  AppGrid,
  AppHero,
  AppMarquee,
  AppSection,
  AppSpinner,
  AppSquiggle,
} from '@/components/ui';

// CMS base URL
const CMS_BASE = (import.meta.env.VITE_CMS_URL || '').toString().trim().replace(/\/$/, '');

// State and data fetching
const hero = ref<any>(null);
const history = ref<any>(null);
const mission = ref<any>(null);
const cards = ref<any>(null);
const action = ref<any>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);

const defaultStats = [
  { id: 1, name: 'Lives Transformed', statistic: 10001 },
  { id: 2, name: 'Years of Service', statistic: 16 },
  { id: 3, name: 'Client Satisfaction', statistic: 95 },
];

const defaultApproach = [
  {
    id: 1,
    title: 'Accredited',
    description: 'All our clinical staff hold accreditation and experience. We maintain active memberships in professional associations and adhere to strict ethical guidelines.',
    icon: null,
  },
  {
    id: 2,
    title: 'Privacy & Confidentiality',
    description: 'We are HIPAA compliant and take your privacy seriously. All interactions are confidential, and your personal information is protected with industry-standard security measures.',
    icon: null,
  },
  {
    id: 3,
    title: 'Continuing Education',
    description: 'Our team regularly participates in ongoing training and education to stay current with the latest research and best practices in emotional wellness.',
    icon: null,
  },
  {
    id: 4,
    title: 'Collaborative Care',
    description: 'We work closely with other healthcare providers when appropriate and can provide referrals to specialized services when needed.',
    icon: null,
  },
];

const approachItems = computed(() => {
  if (cards.value && Array.isArray(cards.value) && cards.value.length) return cards.value;
  return defaultApproach;
});

function getStatSuffix(s: { name: string }) {
  const name = (s?.name || '').toLowerCase();
  if (name.includes('satisfaction')) return '%';
  if (name.includes('years')) return '+';
  return '';
}

function mediaUrl(file: any): string {
  const fmts = file.formats || {};
  const url = (fmts.medium?.url) || (fmts.large?.url) || file.url;
  // If already absolute
  if (/^https?:\/\//i.test(url)) return url;
  return 'https://getting-there-cms.onrender.com' + url;
}

async function fetchHero() {
  isLoading.value = true;
  error.value = null;

  try {
    const res = await fetch(`${import.meta.env.VITE_CMS_URL}/api/about?populate=all`);

    if (!res.ok) {
      throw new Error(`Failed to fetch about data: ${res.status} ${res.statusText}`);
    }

    const json = await res.json();
    hero.value = json?.data?.hero || null;
    history.value = json?.data?.history || null;
    mission.value = json?.data?.mission || null;
    cards.value = json?.data?.cards || null;
    action.value = json?.data?.action || null;
  } catch (e) {
    console.error('Failed to load about hero', e);
    error.value = e instanceof Error ? e.message : 'Failed to load content';
  } finally {
    isLoading.value = false;
  }
}

// Animation observers
function observeFadeElements() {
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

  // Observe all animated elements
  document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
    observer.observe(el as Element);
  });

  // Counter animation for stats
  function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');

    counters.forEach(counter => {
      const el = counter as HTMLElement;
      const targetAttr = el.getAttribute('data-target') || '0';
      const target = parseInt(targetAttr.replace(/\D/g, ''));
      const suffix = el.getAttribute('data-suffix') || '';
      let current = 0;
      const increment = target / 50;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          (counter as HTMLElement).textContent = target + suffix;
          clearInterval(timer);
        } else {
          (counter as HTMLElement).textContent = Math.ceil(current) + suffix;
        }
      }, 50);
    });
  }

  // Start counter animation when hero section is visible
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(animateCounters, 1000);
        heroObserver.disconnect();
      }
    });
  });

  const heroSection = document.querySelector('.about-hero');
  if (heroSection) {
    heroObserver.observe(heroSection);
  }
}

onMounted(async () => {
  await fetchHero();

  // Wait for DOM to update, then observe elements
  setTimeout(() => {
    observeFadeElements();
  }, 100);
});
</script>

<template>
  <main class="about-page">
    <!-- HERO -->
    <AppHero variant="editorial" tone="cream" class="about-hero">
      <template #eyebrow>
        <AppEyebrow tone="fuchsia">{{ (hero && hero.tag) || 'Trusted Mental Wellness Support' }}</AppEyebrow>
      </template>
      <template #title>
        {{ (hero && hero.title) || 'Compassionate guidance for lasting change' }}
      </template>
      <template #lede>
        <p>{{ (hero && hero.description) || 'For over a decade, Getting There has been a beacon of hope for individuals seeking emotional wellness and personal growth. Our practical approach, combined with genuine care, has helped thousands find their path to healing and happiness.' }}</p>
      </template>
      <template #meta>
        <div class="about-stats">
          <div
            v-for="s in (hero && hero.stats ? hero.stats : defaultStats)"
            :key="s.id"
            class="about-stat"
          >
            <span class="stat-number" :data-target="s.statistic" :data-suffix="getStatSuffix(s)">0</span>
            <span class="about-stat__label">{{ s.name }}</span>
          </div>
        </div>
      </template>
      <template #media>
        <figure class="about-hero-figure" :aria-hidden="!(hero && hero.image)">
          <AppBlob tone="marigold" class="about-hero-figure__blob about-hero-figure__blob--a" />
          <AppBlob tone="cobalt" class="about-hero-figure__blob about-hero-figure__blob--b" />
          <template v-if="hero && hero.image">
            <img
              :src="mediaUrl(hero.image) || ''"
              :alt="hero.image.alternativeText || hero.title || 'About hero image'"
              class="about-hero-figure__img"
            />
          </template>
          <template v-else>
            <div class="about-hero-figure__placeholder">ðŸŒ±</div>
          </template>
          <AppDots tone="fuchsia" class="about-hero-figure__dots" />
        </figure>
      </template>
    </AppHero>

    <!-- LOADING / ERROR -->
    <AppSection v-if="isLoading" tone="cream" pad="lg">
      <AppContainer size="md">
        <div class="about-state">
          <AppSpinner size="lg" />
          <p>Loading about content...</p>
        </div>
      </AppContainer>
    </AppSection>

    <AppSection v-else-if="error" tone="cream" pad="lg">
      <AppContainer size="md">
        <AppEmptyState variant="error" :title="error || 'Something went wrong'">
          <template #actions>
            <AppButton variant="primary" @click="fetchHero">Retry</AppButton>
          </template>
        </AppEmptyState>
      </AppContainer>
    </AppSection>

    <template v-else>
      <AppMarquee tone="marigold" :items="['Compassion', 'Curiosity', 'Community', 'Change', 'Care']" />

      <!-- STORY -->
      <AppSection tone="mint" pad="xl">
        <AppContainer size="lg">
          <div class="about-story">
            <div class="about-story__copy slide-in-left">
              <AppEyebrow tone="cobalt">Our story</AppEyebrow>
              <h2 class="u-display u-display--md">{{ (history && history.title) || 'Our Story' }}</h2>
              <div class="about-story__prose">
                <template v-if="history && history.content && history.content.length">
                  <p v-for="(block, idx) in history.content" :key="idx">
                    {{ (block.children || []).map((c:any) => c.text).join('') }}
                  </p>
                </template>
                <template v-else>
                  <p>Getting There was founded on a simple yet profound belief: everyone deserves access to compassionate, effective emotional wellness support. We began as a small practice in Colorado, born from Dr. Sue Nesbitt's vision to bridge the gap between traditional therapy and accessible wellness coaching.</p>
                  <p>Our founder, Dr. Nesbitt, recognized that many people were struggling not with clinical illness, but with life transitions, goal achievement, and emotional resilience. Traditional therapy wasn't always the right fit, yet these individuals needed more than generic self-help resources.</p>
                  <p>What started as weekend workshops in community centers has grown into a comprehensive wellness platform. Today, we serve thousands through our digital resources, in-person workshops, and personalized coaching programs.</p>
                  <p>We remain committed to our founding principles: practical methods, genuine compassion, and the belief that everyone has the capacity for positive change when given the right support and tools.</p>
                </template>
              </div>
            </div>
            <figure class="about-story__figure slide-in-right">
              <AppBlob tone="fuchsia" class="about-story__blob" />
              <template v-if="history && history.picture">
                <img
                  class="about-story__img"
                  :src="mediaUrl(history.picture) || ''"
                  :alt="history.picture.alternativeText || history.title || 'History image'"
                />
              </template>
              <template v-else>
                <div class="about-story__placeholder">ðŸ§ </div>
              </template>
            </figure>
          </div>
        </AppContainer>
      </AppSection>

      <!-- MISSION -->
      <AppSection tone="cream-2" pad="xl">
        <AppContainer size="lg">
          <header class="about-section-head fade-in">
            <AppEyebrow tone="marigold">Our mission</AppEyebrow>
            <h2 class="u-display u-display--md">{{ (mission && mission.title) || 'Getting There Mission: Increase Happiness' }}</h2>
            <p class="about-section-head__lede">
              {{ (mission && mission.Description) || 'There are many kinds of happiness. Contentment with self and the life one is living is longer lasting than moments of peace or excitement but all three make us happy. Activities and accomplishments give each of us pleasure, another kind of happiness. Getting There offers information, ideas, and strategies designed to provide you with resources as you set and plan your happiness goals of whatever kind.' }}
            </p>
          </header>

          <AppGrid :min="280" gap="md">
            <template v-if="mission && mission.cards && mission.cards.length">
              <AppCard
                v-for="card in mission.cards"
                :key="card.id"
                variant="plaque"
                tone="paper"
                shadow-tone="cobalt"
                pad="lg"
              >
                <div class="value-icon">
                  <img
                    v-if="card.icon && card.icon.url"
                    :src="'https://getting-there-cms.onrender.com'+card.icon.url"
                    :alt="card.title"
                    class="value-icon__img"
                  />
                  <span v-else aria-hidden="true">
                    {{ card.title.includes('Compassionate') ? 'ðŸ¤' : card.title.includes('Evidence') ? 'ðŸ”¬' : 'ðŸŒ' }}
                  </span>
                </div>
                <template #title>{{ card.title }}</template>
                <p>{{ card.description }}</p>
              </AppCard>
            </template>
            <template v-else>
              <AppCard variant="plaque" tone="paper" shadow-tone="cobalt" pad="lg">
                <div class="value-icon"><span aria-hidden="true">ðŸ¤</span></div>
                <template #title>Compassionate Care</template>
                <p>We approach every interaction with empathy, understanding, and genuine care for your wellbeing and unique journey.</p>
              </AppCard>
              <AppCard variant="plaque" tone="paper" shadow-tone="marigold" pad="lg">
                <div class="value-icon"><span aria-hidden="true">ðŸ”¬</span></div>
                <template #title>Practical Methods</template>
                <p>Our approaches are grounded in research from psychology, neuroscience, and positive psychology to ensure they're useful in everyday life.</p>
              </AppCard>
              <AppCard variant="plaque" tone="paper" shadow-tone="fuchsia" pad="lg">
                <div class="value-icon"><span aria-hidden="true">ðŸŒ</span></div>
                <template #title>Accessible Support</template>
                <p>We believe wellness support should be available to everyone, regardless of background, location, or circumstances.</p>
              </AppCard>
            </template>
          </AppGrid>
        </AppContainer>
      </AppSection>

      <AppSquiggle tone="cobalt" />

      <!-- APPROACH / CREDENTIALS -->
      <AppSection tone="marigold" pad="xl">
        <AppContainer size="lg">
          <div class="about-approach fade-in">
            <aside class="about-approach__aside">
              <AppEyebrow tone="ink">Our approach</AppEyebrow>
              <h2 class="u-display u-display--md">Our Approach to Happiness</h2>
              <p class="about-approach__lede">
                We build support around practical tools, trusted care, and progress you can feel in everyday life.
              </p>
            </aside>

            <ol class="about-approach__list">
              <li
                v-for="(card, i) in approachItems"
                :key="card.id"
                class="about-approach__row"
                :data-tone="(['cobalt', 'fuchsia', 'mint', 'ink'] as const)[i % 4]"
              >
                <span class="about-approach__num">{{ String(i + 1).padStart(2, '0') }}</span>
                <div class="about-approach__copy">
                  <h3 class="about-approach__title">{{ card.title }}</h3>
                  <p class="about-approach__desc">{{ card.description }}</p>
                </div>
                <div class="about-approach__icon" v-if="card.icon && card.icon.url" aria-hidden="true">
                  <img
                    :src="'https://getting-there-cms.onrender.com' + card.icon.url"
                    :alt="''"
                    class="value-icon__img"
                  />
                </div>
              </li>
            </ol>
          </div>
        </AppContainer>
      </AppSection>

      <!-- CTA -->
      <AppSection tone="ink" pad="xl">
        <AppContainer size="md">
          <div class="about-cta fade-in">
            <h2 class="about-cta__title">{{ (action && action.actiontext) || 'Ready to begin your wellness journey?' }}</h2>
            <p v-if="action && action.Description" class="about-cta__lede">{{ action.Description }}</p>
            <div class="about-cta__actions">
              <AppButton to="/events" variant="primary" size="lg">
                {{ (action && action.buttontext) || 'Explore Our Programs' }}
              </AppButton>
            </div>
          </div>
        </AppContainer>
      </AppSection>
    </template>
  </main>
</template>

<style scoped lang="scss">
.about-page { color: var(--c-text); }

/* ----- HERO ----- */
.about-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--s-3);
  margin-top: var(--s-5);

  @media (max-width: 600px) { grid-template-columns: 1fr; }
}
.about-stat {
  border: 2px solid var(--c-ink);
  background: var(--c-paper);
  border-radius: var(--r-md);
  padding: var(--s-4) var(--s-3);
  text-align: center;
  box-shadow: 4px 4px 0 0 var(--c-cobalt);
  display: flex;
  flex-direction: column;
  gap: var(--s-1);

  .stat-number {
    font-family: var(--font-display);
    font-weight: 800;
    font-size: var(--fs-3xl);
    color: var(--c-ink);
    line-height: var(--lh-tight);
  }
  &__label {
    font-family: var(--font-body);
    font-size: var(--fs-xs);
    text-transform: uppercase;
    letter-spacing: var(--ls-wide);
    color: var(--c-text-muted);
    font-weight: 600;
  }
}

.about-hero-figure {
  position: relative;
  margin: 0;
  aspect-ratio: 4 / 5;
  width: 100%;
  max-width: 460px;
  margin-inline: auto;

  &__blob {
    position: absolute;
    width: 65%; height: 65%;
    &--a { top: -8%; left: -8%; }
    &--b { bottom: -6%; right: -4%; width: 50%; height: 50%; }
  }
  &__img,
  &__placeholder {
    position: relative;
    z-index: 1;
    width: 100%; height: 100%;
    object-fit: cover;
    border: 3px solid var(--c-ink);
    border-radius: var(--r-asym-a);
    box-shadow: var(--shadow-block);
  }
  &__placeholder {
    display: grid; place-items: center;
    font-size: 6rem;
    background: var(--c-mint);
  }
  &__dots {
    position: absolute;
    bottom: -4%; right: 6%;
    width: 64px; height: 64px;
    z-index: 2;
  }
}

/* ----- SECTION HEAD ----- */
.about-section-head {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--s-3);
  margin-bottom: var(--s-8);

  &__lede {
    font-family: var(--font-body);
    color: var(--c-text-muted);
    max-width: 70ch;
    line-height: var(--lh-base);
    margin: 0;
  }
}

/* ----- STATE ----- */
.about-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--s-4);
  text-align: center;
  color: var(--c-text-muted);
}

/* ----- STORY ----- */
.about-story {
  display: grid;
  gap: var(--s-8);
  align-items: center;

  @media (min-width: 880px) {
    grid-template-columns: 1.1fr 0.9fr;
    gap: var(--s-10);
  }

  &__copy {
    display: flex;
    flex-direction: column;
    gap: var(--s-3);
  }
  &__prose p {
    margin: 0 0 var(--s-3);
    font-family: var(--font-body);
    font-size: var(--fs-md);
    line-height: var(--lh-base);
    color: var(--c-text);
  }
  &__figure {
    position: relative;
    margin: 0;
    aspect-ratio: 4 / 5;
  }
  &__blob {
    position: absolute;
    inset: -6% auto auto -6%;
    width: 60%; height: 60%;
  }
  &__img,
  &__placeholder {
    position: relative;
    z-index: 1;
    width: 100%; height: 100%;
    object-fit: cover;
    border: 3px solid var(--c-ink);
    border-radius: var(--r-asym-b);
    box-shadow: var(--shadow-block);
  }
  &__placeholder {
    display: grid; place-items: center;
    font-size: 6rem;
    background: var(--c-cream-2);
  }
}

/* ----- VALUE ICON (used in mission & approach cards) ----- */
.value-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px; height: 64px;
  border-radius: var(--r-md);
  background: var(--c-cream-2);
  border: 2px solid var(--c-ink);
  font-size: 1.75rem;
  margin-bottom: var(--s-2);

  &__img {
    width: 40px; height: 40px;
    object-fit: contain;
  }
}

/* ----- APPROACH: editorial strip list (no card grid) ----- */
.about-approach {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--s-6);

  @media (min-width: 960px) {
    grid-template-columns: minmax(240px, 0.8fr) minmax(0, 1.4fr);
    gap: var(--s-10);
    align-items: start;
  }
}

.about-approach__aside {
  display: flex;
  flex-direction: column;
  gap: var(--s-3);

  h2 {
    margin: 0;
  }

  @media (min-width: 960px) {
    position: sticky;
    top: var(--s-7);
  }
}

.about-approach__lede {
  margin: 0;
  font-family: var(--font-body);
  color: color-mix(in srgb, var(--c-ink) 76%, black);
  line-height: var(--lh-base);
}

.about-approach__list {
  list-style: none;
  margin: 0;
  padding: 0;
  border-top: 2px solid var(--c-ink);
}

.about-approach__row {
  display: grid;
  grid-template-columns: 64px minmax(0, 1fr);
  gap: var(--s-4);
  align-items: start;
  padding: var(--s-5) var(--s-4) var(--s-5) calc(var(--s-4) + 12px);
  border-bottom: 2px solid var(--c-ink);
  position: relative;

  @media (min-width: 680px) {
    grid-template-columns: 64px minmax(0, 1fr) 72px;
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0 auto 0 0;
    width: 12px;
    background: var(--approach-tone, var(--c-cobalt));
  }

  &[data-tone='cobalt'] {
    --approach-tone: var(--c-cobalt);
    background: color-mix(in srgb, var(--c-cobalt) 18%, var(--c-marigold));
  }

  &[data-tone='fuchsia'] {
    --approach-tone: var(--c-fuchsia);
    background: color-mix(in srgb, var(--c-fuchsia) 18%, var(--c-marigold));
  }

  &[data-tone='mint'] {
    --approach-tone: var(--c-mint-deep);
    background: color-mix(in srgb, var(--c-mint) 24%, var(--c-marigold));
  }

  &[data-tone='ink'] {
    --approach-tone: var(--c-ink);
    background: color-mix(in srgb, var(--c-ink) 10%, var(--c-marigold));
  }
}

.about-approach__num {
  display: inline-block;
  font-family: var(--font-accent);
  font-size: clamp(var(--fs-2xl), 3.2vw, var(--fs-4xl));
  line-height: 1;
  color: var(--c-ink);
  text-align: center;
}

.about-approach__copy {
  display: flex;
  flex-direction: column;
  gap: var(--s-2);
}

.about-approach__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(var(--fs-xl), 2.6vw, var(--fs-3xl));
  line-height: var(--lh-tight);
  color: var(--c-ink);
}

.about-approach__desc {
  margin: 0;
  font-family: var(--font-body);
  font-size: var(--fs-md);
  line-height: var(--lh-loose);
  color: color-mix(in srgb, var(--c-ink) 80%, black);
}

.about-approach__icon {
  display: none;

  @media (min-width: 680px) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 72px;
    height: 72px;
    background: color-mix(in srgb, white 70%, var(--approach-tone, var(--c-cobalt)));
    border: 2px solid var(--c-ink);
    border-radius: var(--r-sm);
  }
}

.about-approach-card {
  display: flex;
  flex-direction: column;

  &__num {
    display: inline-block;
    font-family: var(--font-accent);
    font-size: var(--fs-2xl);
    line-height: 1;
    color: var(--c-fuchsia);
    letter-spacing: var(--ls-tight);
  }

  :deep(.app-card__title) {
    font-family: var(--font-display);
    font-size: clamp(var(--fs-xl), 2.6vw, var(--fs-3xl));
    line-height: var(--lh-tight);
    letter-spacing: var(--ls-tight);
    color: var(--c-ink);
    margin: var(--s-2) 0 var(--s-3);
  }

  :deep(.app-card__body) p,
  p {
    font-family: var(--font-body);
    font-size: var(--fs-md);
    line-height: var(--lh-loose);
    color: var(--c-text);
    margin: 0;
  }

  .value-icon {
    margin-bottom: var(--s-4);
  }
}

/* ----- CTA ----- */
.about-cta {
  text-align: center;
  color: var(--c-cream);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--s-4);

  &__title {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: clamp(var(--fs-3xl), 5vw, var(--fs-5xl));
    line-height: var(--lh-tight);
    color: var(--c-cream);
    margin: 0;
  }
  &__lede {
    font-family: var(--font-body);
    color: var(--c-cream);
    opacity: 0.85;
    max-width: 60ch;
    margin: 0;
    line-height: var(--lh-base);
  }
  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--s-3);
    justify-content: center;
    margin-top: var(--s-2);
  }
}

/* ----- Fade-in classes (observer-driven from script) ----- */
.fade-in,
.slide-in-left,
.slide-in-right {
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
.slide-in-left  { transform: translateX(-30px); &.visible { transform: none; } }
.slide-in-right { transform: translateX(30px);  &.visible { transform: none; } }
</style>
