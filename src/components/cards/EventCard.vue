<script setup lang="ts">
import type { Event } from '@/types/event'
import { formatTime, formatDate, formatPrice } from '@/utils/formatUtils'
import { getCategoryFromTitle, getEventIcon } from '@/utils/eventUtils'
import { AppCard, AppBadge, AppEyebrow } from '@/components/ui'
import { MapPin, Wifi, Clock, Users } from 'lucide-vue-next'

interface Props { event: Event; linkCard?: boolean }
const props = defineProps<Props>()

const cmsBase = 'https://getting-there-cms.onrender.com'

const status = (() => {
  const s = props.event.availabilityStatus
  if (s === 'filling')  return { label: 'Filling fast', tone: 'fuchsia' as const }
  if (s === 'waitlist') return { label: 'Waitlist',     tone: 'plum' as const }
  return { label: 'Open', tone: 'mint' as const }
})()

const isOnline = !!props.event.Location?.match(/online|virtual/i)
const priceLabel =
  props.event.Price === null ? 'TBD' :
  props.event.Price && props.event.Price > 0 ? `${formatPrice(props.event.Price)} / session` :
  'Free'
</script>

<template>
  <AppCard
    variant="ticket"
    tone="paper"
    shadow-tone="ink"
    :to="linkCard ? `/events/${event.documentId}` : undefined"
    :interactive="linkCard"
    pad="md"
    :data-category="(event.Category && event.Category.trim().toLowerCase()) || getCategoryFromTitle(event.Title)"
    :data-date="event.date || ''"
  >
    <template #media>
      <div class="event-card__media">
        <img
          v-if="event.Image?.formats?.large"
          :src="cmsBase + event.Image.formats.large.url"
          :alt="event.Title"
        />
        <div v-else class="event-card__glyph">
          <component :is="getEventIcon(event.Title)" :size="56" :stroke-width="1.75" />
        </div>
        <AppBadge :tone="status.tone" size="sm" class="event-card__status">{{ status.label }}</AppBadge>
      </div>
    </template>

    <template #eyebrow>
      <AppEyebrow tone="cobalt">{{ event.date ? formatDate(event.date) : (event.Frequency || 'Workshop') }}</AppEyebrow>
    </template>

    <template #title>{{ event.Title }}</template>

    <p class="event-card__desc">{{ event.Description }}</p>

    <ul class="event-card__meta">
      <li v-if="event.Location">
        <component :is="isOnline ? Wifi : MapPin" :size="14" :stroke-width="2" />
        {{ event.Location }}
      </li>
      <li v-if="event.TimeStart && event.TimeEnd">
        <Clock :size="14" :stroke-width="2" />
        {{ formatTime(event.TimeStart) }} – {{ formatTime(event.TimeEnd) }}
      </li>
      <li v-if="event.GroupSize">
        <Users :size="14" :stroke-width="2" />
        {{ event.GroupSize }}
      </li>
    </ul>

    <template #footer>
      <span class="event-card__price">{{ priceLabel }}</span>
      <span v-if="!linkCard" class="event-card__cta">Learn more →</span>
    </template>
  </AppCard>
</template>

<style scoped lang="scss">
.event-card {
  &__media {
    aspect-ratio: 16 / 10;
    position: relative;
    background: var(--c-cream-2);

    img { width: 100%; height: 100%; object-fit: cover; }
  }
  &__glyph {
    position: absolute;
    inset: 0;
    display: grid; place-items: center;
    color: var(--c-cobalt);
    :deep(svg) { stroke: var(--c-cobalt); }
  }
  &__status {
    position: absolute;
    top: var(--s-3);
    right: var(--s-3);
  }
  &__desc {
    font-family: var(--font-body);
    color: var(--c-text-muted);
    line-height: var(--lh-base);
    margin: 0;
  }
  &__meta {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: var(--s-2);

    li {
      display: inline-flex;
      align-items: center;
      gap: var(--s-2);
      font-size: var(--fs-sm);
      color: var(--c-text);
      :deep(svg) {
        flex-shrink: 0;
        color: var(--c-cobalt);
      }
    }
  }
  &__price {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: var(--fs-xl);
    color: var(--c-ink);
  }
  &__cta {
    font-family: var(--font-body);
    font-weight: 700;
    color: var(--c-cobalt);
  }
}
</style>
