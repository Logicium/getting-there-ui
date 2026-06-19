<script setup lang="ts">
import {
  Building2,
  HeartHandshake,
  Church,
  GraduationCap,
  Target,
  Laptop,
  Mail,
} from 'lucide-vue-next'
import { AppButton, AppCard, AppContainer, AppEyebrow } from '@/components/ui'

const orgTypes = [
  { icon: Building2, label: 'Corporate Teams', tone: 'cobalt' as const },
  { icon: HeartHandshake, label: 'Nonprofit Organizations', tone: 'fuchsia' as const },
  { icon: Church, label: 'Faith Communities', tone: 'marigold' as const },
  { icon: GraduationCap, label: 'Educational Institutions', tone: 'mint' as const },
]

const features = [
  { icon: Target, label: 'Customized content for your community' },
  { icon: Laptop, label: 'On-site, virtual, or hybrid delivery' },
]
</script>

<template>
  <AppContainer size="lg">
    <div class="private-workshops">
      <div class="private-workshops__intro">
        <AppEyebrow tone="marigold">For organizations</AppEyebrow>
        <h2 class="private-workshops__headline">Private workshops for your organization</h2>
        <p class="private-workshops__lede">
          Bring wellness education and support directly to your team with customized workshops
          designed for your community's unique needs.
        </p>

        <ul class="private-workshops__types">
          <li
            v-for="t in orgTypes"
            :key="t.label"
            class="private-workshops__type"
            :data-tone="t.tone"
          >
            <span class="private-workshops__type-icon" aria-hidden="true">
              <component :is="t.icon" :size="22" :stroke-width="2" />
            </span>
            <span>{{ t.label }}</span>
          </li>
        </ul>
      </div>

      <AppCard
        variant="plaque"
        tone="paper"
        shadow-tone="cobalt"
        pad="lg"
        class="private-workshops__cta"
      >
        <template #eyebrow>
          <AppEyebrow tone="cobalt">Get in touch</AppEyebrow>
        </template>
        <template #title>Ready to support your community?</template>
        <p>Get a customized quote for wellness workshops tailored to your organization.</p>

        <ul class="private-workshops__features">
          <li v-for="f in features" :key="f.label">
            <span class="private-workshops__feature-icon" aria-hidden="true">
              <component :is="f.icon" :size="18" :stroke-width="2.25" />
            </span>
            <span>{{ f.label }}</span>
          </li>
        </ul>

        <template #footer>
          <div class="private-workshops__actions">
            <AppButton
              href="mailto:workshops@gthere.net?subject=Private Workshop Inquiry"
              variant="primary"
              size="md"
            >
              Request information
            </AppButton>
            <a class="private-workshops__email" href="mailto:gettingthere@gthere.net">
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
.private-workshops {
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

    &[data-tone='cobalt']   .private-workshops__type-icon { background: var(--c-cobalt);   color: var(--c-cream); }
    &[data-tone='fuchsia']  .private-workshops__type-icon { background: var(--c-fuchsia);  color: var(--c-cream); }
    &[data-tone='marigold'] .private-workshops__type-icon { background: var(--c-marigold); color: var(--c-ink); }
    &[data-tone='mint']     .private-workshops__type-icon { background: var(--c-mint);     color: var(--c-ink); }
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
