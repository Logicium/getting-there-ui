<script setup lang="ts">
import {
  BookOpen,
  Hospital,
  GraduationCap,
  Building2,
  HeartHandshake,
  Package,
  Truck,
  Wallet,
  Mail,
} from 'lucide-vue-next'
import { AppButton, AppCard, AppContainer, AppEyebrow } from '@/components/ui'

const orgTypes = [
  { icon: Hospital, label: 'Healthcare Facilities', tone: 'fuchsia' as const },
  { icon: GraduationCap, label: 'Educational Institutions', tone: 'mint' as const },
  { icon: Building2, label: 'Corporate Wellness Programs', tone: 'cobalt' as const },
  { icon: HeartHandshake, label: 'Support Organizations', tone: 'marigold' as const },
]

const features = [
  { icon: Package, label: 'Minimum order: 25 copies' },
  { icon: Truck, label: 'Direct shipping to your facility' },
  { icon: Wallet, label: 'Volume discounts available' },
]

const mailtoBody = [
  'Hello,',
  '',
  'Please provide a quote for bulk printing.',
  '',
  'Organization:',
  'Contact Person:',
  'Phone:',
  'Book Title(s):',
  'Quantity Needed:',
  'Delivery Address:',
  '',
  'Thank you!',
].join('%0D%0A')

const bulkMailto = `mailto:bulk@gthere.net?subject=Bulk Print Request&body=${mailtoBody}`
</script>

<template>
  <AppContainer size="lg">
    <div class="bulk-print">
      <div class="bulk-print__intro">
        <span class="bulk-print__hero-icon" aria-hidden="true">
          <BookOpen :size="40" :stroke-width="2" />
        </span>
        <AppEyebrow tone="fuchsia">For organizations</AppEyebrow>
        <h2 class="bulk-print__headline">Bulk print orders for organizations</h2>
        <p class="bulk-print__lede">
          Need physical copies for your organization, workshop, or group? We offer bulk printing
          services for educational institutions, healthcare facilities, and community organizations.
        </p>

        <ul class="bulk-print__types">
          <li
            v-for="t in orgTypes"
            :key="t.label"
            class="bulk-print__type"
            :data-tone="t.tone"
          >
            <span class="bulk-print__type-icon" aria-hidden="true">
              <component :is="t.icon" :size="22" :stroke-width="2" />
            </span>
            <span>{{ t.label }}</span>
          </li>
        </ul>
      </div>

      <AppCard
        variant="plaque"
        tone="paper"
        shadow-tone="marigold"
        pad="lg"
        class="bulk-print__cta"
      >
        <template #eyebrow>
          <AppEyebrow tone="marigold">Request quote</AppEyebrow>
        </template>
        <template #title>Bulk print quote</template>
        <p>Get customized pricing for physical copies of our therapeutic resources.</p>

        <ul class="bulk-print__features">
          <li v-for="f in features" :key="f.label">
            <span class="bulk-print__feature-icon" aria-hidden="true">
              <component :is="f.icon" :size="18" :stroke-width="2.25" />
            </span>
            <span>{{ f.label }}</span>
          </li>
        </ul>

        <template #footer>
          <div class="bulk-print__actions">
            <AppButton :href="bulkMailto" variant="primary" size="md">Request quote</AppButton>
            <a class="bulk-print__email" href="mailto:gettingthere@gthere.net">
              <Mail :size="16" :stroke-width="2.25" aria-hidden="true" />
              gettingthere@gthere.net
            </a>
          </div>
        </template>
      </AppCard>
    </div>
  </AppContainer>
</template>

<style scoped lang="scss">
.bulk-print {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--s-6);
  align-items: start;

  @media (min-width: 960px) {
    grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.9fr);
    gap: var(--s-8);
  }

  &__intro {
    display: flex;
    flex-direction: column;
    gap: var(--s-4);
  }

  &__hero-icon {
    display: inline-grid;
    place-items: center;
    width: 72px;
    height: 72px;
    border: 3px solid var(--c-ink);
    border-radius: var(--r-md);
    background: var(--c-marigold);
    color: var(--c-ink);
    box-shadow: 6px 6px 0 0 var(--c-ink);
    margin-bottom: var(--s-2);
  }

  &__headline {
    font-family: var(--font-display);
    font-size: clamp(var(--fs-2xl), 4vw, var(--fs-4xl));
    line-height: var(--lh-tight);
    letter-spacing: var(--ls-tight);
    color: var(--c-ink);
    margin: 0;
  }

  &__lede {
    font-family: var(--font-body);
    font-size: var(--fs-lg);
    line-height: var(--lh-loose);
    color: var(--c-text);
    margin: 0 0 var(--s-3);
    max-width: 56ch;
  }

  &__types {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: var(--s-3);

    @media (min-width: 560px) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  &__type {
    display: flex;
    align-items: center;
    gap: var(--s-3);
    padding: var(--s-3) var(--s-4);
    background: var(--c-paper);
    border: 2px solid var(--c-ink);
    border-radius: var(--r-md);
    font-weight: 600;
    color: var(--c-ink);
    box-shadow: 4px 4px 0 0 var(--c-ink);

    &[data-tone='cobalt']   .bulk-print__type-icon { background: var(--c-cobalt);   color: var(--c-cream); }
    &[data-tone='fuchsia']  .bulk-print__type-icon { background: var(--c-fuchsia);  color: var(--c-cream); }
    &[data-tone='marigold'] .bulk-print__type-icon { background: var(--c-marigold); color: var(--c-ink); }
    &[data-tone='mint']     .bulk-print__type-icon { background: var(--c-mint);     color: var(--c-ink); }
  }

  &__type-icon {
    display: inline-grid;
    place-items: center;
    width: 38px;
    height: 38px;
    border: 2px solid var(--c-ink);
    border-radius: var(--r-sm);
    flex-shrink: 0;
  }

  &__cta {
    align-self: start;
  }

  &__features {
    list-style: none;
    padding: 0;
    margin: var(--s-3) 0 0;
    display: flex;
    flex-direction: column;
    gap: var(--s-2);

    li {
      display: flex;
      align-items: center;
      gap: var(--s-3);
      color: var(--c-ink);
      font-weight: 500;
    }
  }

  &__feature-icon {
    display: inline-grid;
    place-items: center;
    width: 28px;
    height: 28px;
    border-radius: 999px;
    background: var(--c-mint);
    color: var(--c-ink);
    flex-shrink: 0;
  }

  &__actions {
    display: flex;
    flex-direction: column;
    gap: var(--s-3);
    align-items: stretch;
  }

  &__email {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--s-2);
    color: var(--c-cobalt);
    font-family: var(--font-body);
    font-weight: 600;
    font-size: var(--fs-sm);
    text-decoration: none;

    &:hover { color: var(--c-fuchsia); text-decoration: underline; }
  }
}
</style>
