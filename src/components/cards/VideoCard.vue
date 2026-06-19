<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import type { VideoData } from '@/types/video'
import { AppCard, AppBadge, AppButton } from '@/components/ui'
import { Star, Lock, Play } from 'lucide-vue-next'

interface Props {
  video: VideoData
  playVideo?: (videoId: string) => void
  locked?: boolean
}
const props = defineProps<Props>()

const duration = ref(props.video.duration)
const thumbnailUrl = ref(props.video.thumbnailUrl || '')
const thumbnailLoading = ref(true)
const thumbnailError = ref(false)

watch(() => props.video.duration, (d) => { duration.value = d }, { immediate: true })
watch(() => props.video.thumbnailUrl, (t) => {
  if (t) { thumbnailUrl.value = t; thumbnailLoading.value = false }
}, { immediate: true })

const categoryLabel = computed(() => {
  const c = props.video.category?.toLowerCase()
  switch (c) {
    case 'goals': return 'Goals'
    case 'growth': return 'Growth'
    case 'loss': return 'Loss'
    case 'fun': return 'Fun'
    case 'happiness': return 'Happiness'
    default: return props.video.category || 'Video'
  }
})

const categoryTone = computed(() => {
  switch (props.video.category?.toLowerCase()) {
    case 'goals':     return 'cobalt' as const
    case 'growth':    return 'mint' as const
    case 'loss':      return 'plum' as const
    case 'fun':       return 'fuchsia' as const
    case 'happiness': return 'marigold' as const
    default:          return 'ink' as const
  }
})

const handleClick = () => {
  if (props.locked) return
  props.playVideo?.(props.video.id)
}

onMounted(() => { if (props.video.thumbnailUrl) thumbnailLoading.value = false })
</script>

<template>
  <AppCard
    variant="plaque"
    tone="paper"
    shadow-tone="ink"
    pad="md"
    class="video-card"
    :class="{ 'video-card--locked': locked }"
    :data-category="video.category"
    :data-title="(video.title + ' ' + video.tags.join(' ')).toLowerCase()"
  >
    <template #media>
      <div class="video-card__thumb" @click="handleClick">
        <AppBadge :tone="categoryTone" size="sm" class="video-card__cat">{{ categoryLabel }}</AppBadge>
        <span class="video-card__duration">{{ duration }}</span>
        <AppBadge v-if="video.isPremium" tone="fuchsia" size="sm" class="video-card__premium">
          <Star :size="12" :stroke-width="2.5" fill="currentColor" /> Premium
        </AppBadge>

        <div v-if="locked" class="video-card__lock">
          <span class="video-card__lock-icon"><Lock :size="28" :stroke-width="2" /></span>
          <span>Subscribers only</span>
        </div>

        <div v-if="thumbnailLoading" class="video-card__loading">
          <span class="video-card__pulse" />
        </div>
        <img
          v-else-if="thumbnailUrl && !thumbnailError"
          :src="thumbnailUrl"
          :alt="video.title"
          class="video-card__img"
          @error="thumbnailError = true; thumbnailLoading = false"
          @load="thumbnailLoading = false"
        />
        <div v-else class="video-card__fallback"><Play :size="40" :stroke-width="2" fill="currentColor" /></div>

        <div v-if="!locked" class="video-card__play" aria-hidden="true"><Play :size="28" :stroke-width="2" fill="currentColor" /></div>
      </div>
    </template>

    <template #title>{{ video.title }}</template>
    <p class="video-card__presenter">{{ video.presenter }}</p>
    <p class="video-card__desc">{{ video.description }}</p>

    <template #footer>
      <RouterLink v-if="locked" to="/subscribe" class="video-card__subscribe">Subscribe to watch</RouterLink>
      <AppButton v-else variant="accent" size="sm" @click="handleClick">Watch now</AppButton>
    </template>
  </AppCard>
</template>

<style scoped lang="scss">
.video-card {
  &__thumb {
    position: relative;
    aspect-ratio: 16 / 9;
    background: var(--c-ink);
    cursor: pointer;
    overflow: hidden;
  }
  &__img,
  &__fallback,
  &__loading {
    position: absolute; inset: 0;
    width: 100%; height: 100%;
    object-fit: cover;
  }
  &__fallback {
    display: grid; place-items: center;
    background: var(--c-cobalt);
    color: var(--c-cream);
    font-family: var(--font-display);
    font-size: 3rem;
  }

  &__loading {
    background: linear-gradient(90deg, var(--c-cream-2) 0%, var(--c-cream-3) 50%, var(--c-cream-2) 100%);
    background-size: 200% 100%;
    animation: shimmer 1.4s ease-in-out infinite;
    display: grid; place-items: center;
  }
  &__pulse {
    width: 48px; height: 48px;
    border-radius: 50%;
    background: var(--c-marigold);
    animation: float 1.6s ease-in-out infinite;
  }

  &__cat      { position: absolute; top: var(--s-3); left: var(--s-3); z-index: 3; }
  &__premium  { position: absolute; top: var(--s-3); right: var(--s-3); z-index: 3; }
  &__duration {
    position: absolute;
    bottom: var(--s-3); right: var(--s-3);
    background: var(--c-ink);
    color: var(--c-cream);
    padding: 0.2rem 0.55rem;
    border-radius: var(--r-sm);
    font-family: var(--font-body);
    font-size: var(--fs-xs);
    font-weight: 700;
    z-index: 3;
  }

  &__lock {
    position: absolute; inset: 0;
    display: grid; place-items: center;
    gap: var(--s-2);
    background: rgba(24, 22, 35, 0.78);
    color: var(--c-cream);
    z-index: 4;
    font-family: var(--font-body);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: var(--ls-wide);
    font-size: var(--fs-xs);
  }
  &__lock-icon { font-size: 2rem; line-height: 1; }

  &__play {
    position: absolute; inset: 0;
    display: grid; place-items: center;
    background: rgba(24, 22, 35, 0.35);
    opacity: 0;
    transition: opacity var(--dur-base) var(--ease-out);
    span {
      width: 64px; height: 64px;
      border-radius: 50%;
      background: var(--c-marigold);
      color: var(--c-ink);
      display: grid; place-items: center;
      border: 3px solid var(--c-ink);
      box-shadow: 4px 4px 0 0 var(--c-ink);
      font-size: 1.4rem;
      padding-left: 4px;
    }
  }
  &__thumb:hover &__play { opacity: 1; }

  &__presenter {
    margin: 0;
    font-family: var(--font-body);
    font-weight: 600;
    color: var(--c-cobalt);
    font-size: var(--fs-sm);
  }
  &__desc {
    margin: 0;
    color: var(--c-text-muted);
    font-size: var(--fs-sm);
    line-height: var(--lh-base);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__subscribe {
    background: var(--c-fuchsia);
    color: var(--c-cream);
    padding: 0.6rem 1.2rem;
    border: 2px solid var(--c-ink);
    border-radius: var(--r-pill);
    text-decoration: none;
    font-family: var(--font-body);
    font-weight: 700;
    font-size: var(--fs-sm);
    box-shadow: 3px 3px 0 0 var(--c-ink);
    transition: transform var(--dur-fast) var(--ease-snap), box-shadow var(--dur-fast);
    &:hover { transform: translate(-1px, -1px); box-shadow: 5px 5px 0 0 var(--c-ink); }
  }
}
</style>
