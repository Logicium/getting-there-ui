<script setup lang="ts">
import { computed } from 'vue'
import { AppCard, AppBadge, AppEyebrow } from '@/components/ui'

const props = defineProps<{
  category: string
  categoryLabel: string
  icon: string
  imageUrl: string
  date: string
  readTime: number
  title: string
  excerpt: string
  authorAvatar: string
  authorName: string
  authorCredentials: string
  slug?: string
}>()

const tone = computed(() => {
  switch (props.category?.toLowerCase()) {
    case 'goals':     return 'cobalt'
    case 'growth':    return 'mint'
    case 'loss':      return 'plum'
    case 'fun':       return 'fuchsia'
    case 'happiness': return 'marigold'
    default:          return 'ink'
  }
})
</script>

<template>
  <AppCard
    variant="plaque"
    tone="paper"
    shadow-tone="ink"
    :to="slug ? `/blog/${slug}` : undefined"
    :interactive="!!slug"
    pad="md"
    class="blog-card"
    :data-category="category"
  >
    <template #media>
      <div class="blog-card__media" :style="imageUrl ? { backgroundImage: `url(${imageUrl})` } : {}">
        <AppBadge :tone="tone as 'cobalt' | 'mint' | 'plum' | 'fuchsia' | 'marigold' | 'ink'" size="sm" class="blog-card__tag">{{ categoryLabel }}</AppBadge>
      </div>
    </template>

    <template #eyebrow>
      <AppEyebrow tone="cobalt">{{ date }} · {{ readTime }} min</AppEyebrow>
    </template>

    <template #title>{{ title }}</template>

    <p class="blog-card__excerpt">{{ excerpt }}</p>

    <template #footer>
      <span class="blog-card__author">by <b>{{ authorName }}</b></span>
      <span v-if="slug" class="blog-card__cta">Read on →</span>
    </template>
  </AppCard>
</template>

<style scoped lang="scss">
.blog-card {
  &__media {
    aspect-ratio: 16 / 9;
    background-color: var(--c-cream-2);
    background-size: cover;
    background-position: center;
    position: relative;
  }
  &__tag { position: absolute; top: var(--s-3); left: var(--s-3); }
  &__excerpt {
    margin: 0;
    color: var(--c-text-muted);
    line-height: var(--lh-base);
  }
  &__author {
    font-family: var(--font-body);
    font-size: var(--fs-sm);
    color: var(--c-text-muted);
    b { color: var(--c-ink); font-weight: 700; }
  }
  &__cta {
    font-family: var(--font-body);
    font-weight: 700;
    color: var(--c-cobalt);
  }
}
</style>
