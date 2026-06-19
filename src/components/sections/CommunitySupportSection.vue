<script setup lang="ts">
import { HeartHandshake, Users, BookOpen, PenTool } from 'lucide-vue-next'
import { AppCard, AppContainer, AppEyebrow, AppGrid } from '@/components/ui'

const items = [
  {
    icon: Users,
    title: 'Support groups',
    body: "Connect with others on similar healing journeys through our in-person and virtual support groups.",
    to: '/events',
    link: 'Explore groups',
    tone: 'mint' as const,
  },
  {
    icon: BookOpen,
    title: 'Educational resources',
    body: 'Deepen your understanding with our collection of therapeutic books and self-help guides.',
    to: '/store',
    link: 'Browse books',
    tone: 'cobalt' as const,
  },
  {
    icon: PenTool,
    title: 'Wellness blog',
    body: 'Read insights, tips, and stories from our community.',
    to: '/blog',
    link: 'Read blog',
    tone: 'fuchsia' as const,
  },
]
</script>

<template>
  <AppContainer size="lg">
    <header class="community-section__head">
      <AppEyebrow tone="mint">
        <span class="community-section__eyebrow-icon" aria-hidden="true">
          <HeartHandshake :size="14" :stroke-width="2.5" />
        </span>
        Community
      </AppEyebrow>
      <h2 class="community-section__title">Join our healing community</h2>
    </header>

    <AppGrid :min="260" gap="md">
      <AppCard
        v-for="item in items"
        :key="item.title"
        variant="plaque"
        tone="paper"
        :shadow-tone="item.tone"
        pad="lg"
        class="community-section__card"
      >
        <span
          class="community-section__icon"
          :data-tone="item.tone"
          aria-hidden="true"
        >
          <component :is="item.icon" :size="28" :stroke-width="2" />
        </span>
        <template #title>{{ item.title }}</template>
        <p>{{ item.body }}</p>
        <template #footer>
          <router-link :to="item.to" class="community-section__link">
            {{ item.link }} →
          </router-link>
        </template>
      </AppCard>
    </AppGrid>
  </AppContainer>
</template>

<style scoped lang="scss">
.community-section {
  &__head {
    text-align: center;
    margin-bottom: var(--s-7);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--s-3);
  }

  &__eyebrow-icon {
    display: inline-flex;
    vertical-align: middle;
    margin-right: var(--s-1);
  }

  &__title {
    font-family: var(--font-display);
    font-size: clamp(var(--fs-2xl), 4vw, var(--fs-4xl));
    line-height: var(--lh-tight);
    letter-spacing: var(--ls-tight);
    color: var(--c-ink);
    margin: 0;
  }

  &__card {
    text-align: left;

    p {
      color: var(--c-text-muted);
      line-height: var(--lh-loose);
      margin: 0 0 var(--s-3);
    }
  }

  &__icon {
    display: inline-grid;
    place-items: center;
    width: 56px;
    height: 56px;
    border: 2px solid var(--c-ink);
    border-radius: var(--r-md);
    box-shadow: 4px 4px 0 0 var(--c-ink);
    margin-bottom: var(--s-3);

    &[data-tone='cobalt']  { background: var(--c-cobalt);  color: var(--c-cream); }
    &[data-tone='mint']    { background: var(--c-mint);    color: var(--c-ink); }
    &[data-tone='fuchsia'] { background: var(--c-fuchsia); color: var(--c-cream); }
  }

  &__link {
    display: inline-flex;
    align-items: center;
    color: var(--c-cobalt);
    font-family: var(--font-body);
    font-weight: 600;
    text-decoration: none;

    &:hover { color: var(--c-fuchsia); }
  }
}
</style>
