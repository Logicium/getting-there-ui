<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { AppContainer, AppEyebrow, AppMarquee, AppButton } from '@/components/ui'

const footerContent = ref(
  'Compassionate guidance for your emotional wellness journey. Dedicated to helping you achieve lasting positive change.'
)
const footerDisclaimer = ref(
  'Getting There provides educational resources and support. We are not a substitute for professional medical or therapeutic treatment. Please consult with qualified healthcare providers for clinical concerns.'
)

onMounted(async () => {
  try {
    const cmsBase = (import.meta.env.VITE_CMS_URL as string) || 'https://getting-there-cms.onrender.com'
    const res = await fetch(`${cmsBase}/api/footer?populate=all`, { headers: { Accept: 'application/json' } })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = await res.json()
    footerContent.value    = json?.data?.content    ?? footerContent.value
    footerDisclaimer.value = json?.data?.disclaimer ?? footerDisclaimer.value
  } catch (err) {
    console.error('Failed to fetch footer content:', err)
  }
})

const marqueeItems = ['happiness', 'tiny wins', 'gentle practice', 'every day', 'getting there']

const exploreLinks = [
  { to: '/blog',       label: 'Field notes' },
  { to: '/store',      label: 'Booklets' },
  { to: '/videos',     label: 'Videos' },
  { to: '/events',     label: 'Workshops' },
  { to: '/classes',    label: 'Courses' },
]
const aboutLinks = [
  { to: '/about',      label: 'Our story' },
  { to: '/contact',    label: 'Say hello' },
  { to: '/newsletter', label: 'Newsletter' },
]
const legalLinks = [
  { to: '/privacy',       label: 'Privacy' },
  { to: '/terms',         label: 'Terms' },
  { to: '/accessibility', label: 'Accessibility' },
]
</script>

<template>
  <footer class="site-foot">
    <AppMarquee tone="marigold" :items="marqueeItems" :speed="34" />

    <div class="site-foot__body">
      <AppContainer>
        <div class="site-foot__grid">
          <section class="site-foot__pitch">
            <AppEyebrow tone="fuchsia">From the studio</AppEyebrow>
            <h2 class="site-foot__headline">A little kinder, every day.</h2>
            <p class="site-foot__copy">{{ footerContent }}</p>
            <AppButton :to="'/newsletter'" variant="playful" size="md">Get the newsletter</AppButton>
          </section>

          <nav class="site-foot__col" aria-label="Explore">
            <h3>Explore</h3>
            <ul>
              <li v-for="l in exploreLinks" :key="l.to">
                <RouterLink :to="l.to">{{ l.label }}</RouterLink>
              </li>
            </ul>
          </nav>

          <nav class="site-foot__col" aria-label="About">
            <h3>Studio</h3>
            <ul>
              <li v-for="l in aboutLinks" :key="l.to">
                <RouterLink :to="l.to">{{ l.label }}</RouterLink>
              </li>
            </ul>
          </nav>

          <nav class="site-foot__col" aria-label="Legal">
            <h3>Fine print</h3>
            <ul>
              <li v-for="l in legalLinks" :key="l.to">
                <RouterLink :to="l.to">{{ l.label }}</RouterLink>
              </li>
            </ul>
          </nav>
        </div>

        <div class="site-foot__rule" aria-hidden="true"></div>

        <div class="site-foot__bottom">
          <p class="site-foot__copyright">&copy; {{ new Date().getFullYear() }} Getting There. Made with care.</p>
          <p class="site-foot__disclaimer">{{ footerDisclaimer }}</p>
        </div>
      </AppContainer>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.site-foot {
  margin-top: 0;
  background: var(--c-ink);
  color: var(--c-cream);
  position: relative;
  overflow: hidden;

  &__body {
    padding: var(--s-9) 0 var(--s-7);
    position: relative;
    isolation: isolate;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image: radial-gradient(rgba(255, 255, 255, 0.05) 1.4px, transparent 1.4px);
      background-size: 26px 26px;
      pointer-events: none;
      z-index: 0;
    }
  }

  &__grid {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: 1.6fr 1fr 1fr 1fr;
    gap: var(--s-7);

    @media (max-width: 960px) { grid-template-columns: 1fr 1fr; }
    @media (max-width: 560px) { grid-template-columns: 1fr; }
  }

  &__pitch {
    display: flex;
    flex-direction: column;
    gap: var(--s-3);
    align-items: flex-start;
  }

  &__headline {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: var(--fs-4xl);
    line-height: var(--lh-tight);
    letter-spacing: var(--ls-tight);
    margin: 0;
    color: var(--c-cream);
    max-width: 18ch;
  }

  &__copy {
    color: rgba(251, 245, 233, 0.78);
    line-height: var(--lh-base);
    max-width: 42ch;
    margin: 0;
  }

  &__col {
    h3 {
      font-family: var(--font-body);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: var(--ls-shout);
      font-size: var(--fs-xs);
      color: var(--c-marigold);
      margin: 0 0 var(--s-4);
    }
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: var(--s-2);
    }
    a {
      font-family: var(--font-display);
      font-size: var(--fs-lg);
      color: var(--c-cream);
      text-decoration: none;
      position: relative;
      display: inline-block;

      &::after {
        content: '';
        position: absolute;
        left: 0; right: 0; bottom: -2px;
        height: 2px;
        background: var(--c-marigold);
        transform: scaleX(0);
        transform-origin: left center;
        transition: transform var(--dur-base) var(--ease-snap);
      }

      &:hover { color: var(--c-marigold); }
      &:hover::after { transform: scaleX(1); }
    }
  }

  &__rule {
    position: relative;
    z-index: 1;
    margin-top: var(--s-7);
    height: 14px;
    background-repeat: repeat-x;
    background-size: 80px 14px;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 14' fill='none' stroke='%23FFB534' stroke-width='2.6' stroke-linecap='round'><path d='M0 7 Q 10 0 20 7 T 40 7 T 60 7 T 80 7' /></svg>");
  }

  &__bottom {
    position: relative;
    z-index: 1;
    margin-top: var(--s-5);
    display: flex;
    flex-direction: column;
    gap: var(--s-3);
    align-items: flex-start;
  }

  &__copyright {
    font-family: var(--font-body);
    font-weight: 600;
    color: var(--c-cream);
    margin: 0;
  }

  &__disclaimer {
    font-size: var(--fs-sm);
    color: rgba(251, 245, 233, 0.55);
    max-width: 80ch;
    margin: 0;
    line-height: var(--lh-base);
  }
}
</style>
