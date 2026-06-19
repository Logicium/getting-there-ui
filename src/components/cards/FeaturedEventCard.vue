<script setup lang="ts">
import type { Event } from '@/types/event'
import { formatTime, formatDate, formatPrice } from '@/utils/formatUtils'
import { AppCard, AppBadge, AppEyebrow, AppButton } from '@/components/ui'

interface Props { event: Event }
const props = defineProps<Props>()

const status = (() => {
  const s = props.event.availabilityStatus
  if (s === 'filling')  return { label: 'Filling fast', tone: 'fuchsia' as const }
  if (s === 'waitlist') return { label: 'Waitlist',     tone: 'plum' as const }
  return { label: 'Open', tone: 'mint' as const }
})()

const priceLabel =
  props.event.Price === null ? 'TBD' :
  props.event.Price && props.event.Price > 0 ? `${formatPrice(props.event.Price)} / session` :
  'Free'
</script>

<template>
  <AppCard
    variant="postcard"
    tone="cream"
    shadow-tone="cobalt"
    pad="lg"
    class="featured-event"
  >
    <template #media>
      <div class="featured-event__media">
        <img
          v-if="event.Image?.formats?.large"
          :src="'https://getting-there-cms.onrender.com' + event.Image.formats.large.url"
          :alt="event.Title"
        />
        <div v-else class="featured-event__art">✦</div>
        <AppBadge tone="marigold" size="lg" class="featured-event__featured">Featured</AppBadge>
        <AppBadge :tone="status.tone" size="md" class="featured-event__status">{{ status.label }}</AppBadge>
      </div>
    </template>

    <template #eyebrow>
      <AppEyebrow tone="fuchsia">Signature program</AppEyebrow>
    </template>

    <template #title>{{ event.Title }}</template>

    <p class="featured-event__desc">{{ event.Description }}</p>

    <ul class="featured-event__meta">
      <li v-if="event.date || event.Frequency"><b>When</b>{{ event.date ? formatDate(event.date) : event.Frequency }}</li>
      <li v-if="event.Location"><b>Where</b>{{ event.Location }}</li>
      <li v-if="event.TimeStart && event.TimeEnd"><b>Time</b>{{ formatTime(event.TimeStart) }} – {{ formatTime(event.TimeEnd) }}</li>
      <li v-if="event.GroupSize"><b>Size</b>{{ event.GroupSize }}</li>
    </ul>

    <template #footer>
      <div class="featured-event__price">{{ priceLabel }}</div>
      <AppButton :to="`/events/${event.documentId}`" variant="accent" size="md">Hold a seat →</AppButton>
    </template>
  </AppCard>
</template>

<style scoped lang="scss">
.featured-event {
  margin-bottom: var(--s-8);
  // Use grid for media + body side-by-side on wide screens
  :deep(.app-card__body) {
    padding: var(--s-7);
  }

  @media (min-width: 880px) {
    display: grid;
    grid-template-columns: 1.05fr 1fr;
    align-items: stretch;

    :deep(.app-card__media) {
      border-right: 2px solid var(--c-ink);
      border-bottom: none;
    }
  }

  &__media {
    position: relative;
    aspect-ratio: 4 / 3;
    background: var(--c-marigold-soft);

    img { width: 100%; height: 100%; object-fit: cover; }
  }

  &__art {
    position: absolute;
    inset: 0;
    display: grid; place-items: center;
    font-family: var(--font-display);
    font-size: 7rem;
    color: var(--c-ink);
  }

  &__featured { position: absolute; top: var(--s-4); left: var(--s-4); }
  &__status   { position: absolute; top: var(--s-4); right: var(--s-4); }

  &__desc {
    font-family: var(--font-body);
    font-size: var(--fs-lg);
    line-height: var(--lh-base);
    color: var(--c-text-muted);
    margin: 0;
  }

  &__meta {
    list-style: none;
    padding: 0;
    margin: var(--s-3) 0 0;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--s-3);

    li {
      display: flex;
      flex-direction: column;
      gap: 2px;
      font-size: var(--fs-sm);
      color: var(--c-text);
      b {
        font-family: var(--font-body);
        font-size: var(--fs-xs);
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: var(--ls-shout);
        color: var(--c-text-muted);
      }
    }
  }

  &__price {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: var(--fs-2xl);
    color: var(--c-ink);
  }
}
</style>
