<script setup lang="ts">
import type { Event } from '@/types/event';
import { formatTime, formatDate, formatPrice } from '@/utils/formatUtils';
import { getCategoryFromTitle, getEventIcon } from '@/utils/eventUtils';

interface Props {
  event: Event;
  linkCard?: boolean;
}

const props = defineProps<Props>();
const cmsUrl = 'https://getting-there-cms.onrender.com';
</script>

<template>
  <component 
    :is="linkCard ? 'RouterLink' : 'div'" 
    :to="linkCard ? `/events/${event.documentId}` : undefined" 
    class="therapy-event-card"
    :data-category="getCategoryFromTitle(event.Title)" 
    :data-date="event.date || ''"
  >
    <div class="therapy-event-image">
      <div class="therapy-event-status" 
           :class="{
             'status-available': event.availabilityStatus === 'available',
             'status-filling': event.availabilityStatus === 'filling',
             'status-waitlist': event.availabilityStatus === 'waitlist'
           }">
        {{ event.availabilityStatus === 'available' ? 'Open' : 
           event.availabilityStatus === 'filling' ? 'Filling' : 
           event.availabilityStatus === 'waitlist' ? 'Waitlist' : 'Open' }}
      </div>
      <img v-if="event.Image && event.Image.formats && event.Image.formats.large"
           :src="cmsUrl + event.Image.formats.large.url"
           :alt="event.Title"
           class="event-img">
      <div v-else class="event-visual-icon">{{ getEventIcon(event.Title) }}</div>
    </div>
    <div class="therapy-event-content">
      <div class="therapy-event-date" v-if="event.date || event.Frequency">
        📅 {{ event.date ? formatDate(event.date) : event.Frequency }}
      </div>
      <h3 class="therapy-event-title">{{ event.Title }}</h3>
      <p class="therapy-event-description">
        {{ event.Description }}
      </p>
      <div class="therapy-event-details">
        <div class="therapy-event-detail" v-if="event.Location">
          <span class="therapy-event-detail-icon">{{ event.Location.includes('Online') || event.Location.includes('Virtual') ? '💻' : '📍' }}</span>
          <span>{{ event.Location }}</span>
        </div>
        <div class="therapy-event-detail" v-if="event.TimeStart && event.TimeEnd">
          <span class="therapy-event-detail-icon">⏰</span>
          <span>{{ formatTime(event.TimeStart) }} - {{ formatTime(event.TimeEnd) }}</span>
        </div>
        <div class="therapy-event-detail" v-if="event.GroupSize">
          <span class="therapy-event-detail-icon">👥</span>
          <span>{{ event.GroupSize }}</span>
        </div>
      </div>
      <div class="therapy-event-footer">
        <div class="therapy-event-price" v-if="event.Price !== null && event.Price > 0">{{ formatPrice(event.Price) }}/session</div>
        <div class="therapy-event-price" v-else>Free</div>
        <router-link v-if="!linkCard" :to="`/events/${event.documentId}`" class="therapy-event-btn">Learn More</router-link>
        <button v-else class="therapy-event-btn">Learn More</button>
      </div>
    </div>
  </component>
</template>

<style scoped lang="scss">
@import '@/assets/common.scss';

.therapy-event-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 30px var(--shadow-light);
  transition: all 0.4s ease;
  position: relative;
  border: 1px solid var(--border-light);
  display: block;
  text-decoration: none;
  color: inherit;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 50px var(--shadow-medium);
  }
}

.therapy-event-image {
  height: 180px;
  background: var(--bg-sage);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.event-visual-icon {
  font-size: 3.5rem;
  opacity: 0.8;
}

.event-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.therapy-event-status {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;

  &.status-available {
    background: var(--success-color);
    color: white;
  }

  &.status-filling {
    background: var(--warning-color);
    color: white;
  }

  &.status-waitlist {
    background: var(--text-light);
    color: white;
  }
}

.therapy-event-content {
  padding: 2rem;
}

.therapy-event-date {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--primary-color);
  font-weight: 600;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.therapy-event-title {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text-dark);
  line-height: 1.3;
}

.therapy-event-description {
  color: var(--text-light);
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.therapy-event-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.therapy-event-detail {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--text-light);
  font-size: 0.9rem;
}

.therapy-event-detail-icon {
  width: 20px;
  text-align: center;
}

.therapy-event-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
}

.therapy-event-price {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-dark);
}

.therapy-event-btn {
  @extend .cta-primary;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;

  &.waitlist-btn {
    background: var(--text-light);
    cursor: default;

    &:hover {
      background: var(--text-light);
      transform: none;
    }
  }
}
</style>
