<script setup lang="ts">
import { computed } from 'vue'
import type { BookData } from '@/data/data'
import { AppCard, AppBadge, AppButton } from '@/components/ui'

interface Props {
  book: BookData
  addToCart: (bookId: string, target: HTMLElement) => void
  showBookPreview: (bookId: string) => void
  digitalOnly?: boolean
}
const props = defineProps<Props>()

const categoryBadge = computed(() => {
  switch (props.book.category?.toLowerCase()) {
    case 'goals':     return { text: 'Goals',       tone: 'cobalt' as const }
    case 'growth':    return { text: 'Growth',      tone: 'mint' as const }
    case 'loss':      return { text: 'Loss & Grief',tone: 'plum' as const }
    case 'fun':       return { text: 'Fun',         tone: 'fuchsia' as const }
    case 'happiness': return { text: 'Happiness',   tone: 'marigold' as const }
    default:          return null
  }
})

const cardTone = computed(() => {
  switch (props.book.category?.toLowerCase()) {
    case 'goals':
      return 'cobalt' as const
    case 'growth':
      return 'mint' as const
    case 'loss':
      return 'fuchsia' as const
    case 'fun':
      return 'marigold' as const
    case 'happiness':
      return 'marigold' as const
    default:
      return 'cream-2' as const
  }
})

const cardShadowTone = computed(() => {
  switch (props.book.category?.toLowerCase()) {
    case 'goals':
      return 'cobalt' as const
    case 'growth':
      return 'mint' as const
    case 'loss':
      return 'fuchsia' as const
    case 'fun':
      return 'marigold' as const
    case 'happiness':
      return 'marigold' as const
    default:
      return 'ink' as const
  }
})

const handleAdd     = (e: Event) => props.addToCart(props.book.id, e.target as HTMLElement)
const handlePreview = ()         => props.showBookPreview(props.book.id)
</script>

<template>
  <AppCard variant="postcard" :tone="cardTone" :shadow-tone="cardShadowTone" pad="md" class="product-card"
           :data-category="book.category?.toLowerCase()">
    <template #media>
      <div class="product-card__media">
        <div
          v-if="book.imageUrl"
          class="product-card__bg"
          :style="{ backgroundImage: `url('https://getting-there-cms.onrender.com${book.imageUrl}')` }"
        />
        <img
          v-if="book.imageUrl"
          :src="'https://getting-there-cms.onrender.com' + book.imageUrl"
          alt="Book cover"
          class="product-card__cover"
        />
        <div v-else class="product-card__fallback">{{ book.id.charAt(0).toUpperCase() }}</div>
        <AppBadge v-if="categoryBadge" :tone="categoryBadge.tone" size="sm" class="product-card__cat">
          {{ categoryBadge.text }}
        </AppBadge>
      </div>
    </template>

    <template #title>{{ book.title }}</template>
    <p class="product-card__author">by {{ book.author }}</p>
    <p class="product-card__desc">{{ book.description }}</p>

    <div class="product-card__price">
      <span class="product-card__amount">${{ book.formats.digital.price.toFixed(2) }}</span>
      <span class="product-card__fmt">Digital edition · Instant download</span>
    </div>

    <template #footer>
      <AppButton variant="primary" size="sm" @click="handleAdd">Add to cart</AppButton>
      <AppButton variant="ghost"  size="sm" @click="handlePreview">Preview</AppButton>
    </template>
  </AppCard>
</template>

<style scoped lang="scss">
.product-card {
  :deep(.app-card__title),
  :deep(.app-card__eyebrow) {
    color: var(--c-ink);
  }

  &__media {
    aspect-ratio: 4 / 3;
    position: relative;
    background: color-mix(in srgb, var(--c-paper) 70%, var(--c-ink));
    display: grid; place-items: center;
    overflow: hidden;
    border: 2px solid var(--c-ink);
    border-radius: var(--r-md);
  }
  &__bg {
    position: absolute; inset: 0;
    background-size: cover;
    background-position: center;
    filter: blur(22px) saturate(1.2);
    transform: scale(1.15);
    opacity: 0.65;
  }
  &__cover {
    position: relative; z-index: 1;
    max-width: 60%; max-height: 86%;
    object-fit: contain;
    box-shadow: 6px 6px 0 0 var(--c-ink);
  }
  &__fallback {
    position: relative; z-index: 1;
    width: 96px; height: 96px;
    display: grid; place-items: center;
    background: var(--c-marigold);
    color: var(--c-ink);
    border: 2px solid var(--c-ink);
    border-radius: var(--r-md);
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 2.4rem;
  }
  &__cat { position: absolute; top: var(--s-3); left: var(--s-3); z-index: 2; }

  &__author {
    margin: 0;
    font-family: var(--font-body);
    font-weight: 600;
    color: var(--c-cobalt);
    font-size: var(--fs-sm);
  }
  &__desc {
    margin: 0;
    color: color-mix(in srgb, var(--c-ink) 72%, black);
    line-height: var(--lh-base);
    font-size: var(--fs-sm);
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  &__price {
    display: flex; flex-direction: column; gap: 2px;
    margin-top: auto;
  }
  &__amount {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: var(--fs-2xl);
    color: var(--c-ink);
  }
  &__fmt {
    font-size: var(--fs-xs);
    color: color-mix(in srgb, var(--c-ink) 64%, black);
    text-transform: uppercase;
    letter-spacing: var(--ls-wide);
    font-weight: 600;
  }
}
</style>
