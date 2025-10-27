<script setup lang="ts">
import type { Event } from '@/types/event';
import { formatTime, formatDate, formatPrice } from '@/utils/formatUtils';

interface Props {
  event: Event;
}

defineProps<Props>();
</script>

<template>
  <div class="featured-therapy-event fade-in">
    <div class="featured-wellness-badge">Featured Program</div>
    <div class="therapy-event-status featured-event-status" 
         :class="{
           'status-available': event.availabilityStatus === 'available',
           'status-filling': event.availabilityStatus === 'filling',
           'status-waitlist': event.availabilityStatus === 'waitlist'
         }">
      {{ event.availabilityStatus === 'available' ? 'Open' : 
         event.availabilityStatus === 'filling' ? 'Filling' : 
         event.availabilityStatus === 'waitlist' ? 'Waitlist' : 'Open' }}
    </div>
    <div class="featured-therapy-image">
      <img v-if="event.Image && event.Image.formats && event.Image.formats.large"
           :src="'https://getting-there-cms.onrender.com' + event.Image.formats.large.url"
           :alt="event.Title"
           class="featured-event-img">
      <div v-else class="featured-visual-icon">🌱</div>
    </div>
    <div class="featured-therapy-content">
      <h2 class="featured-therapy-title">{{ event.Title }}</h2>
      <p class="featured-therapy-description">
        {{ event.Description }}
      </p>
      <div class="featured-therapy-details">
        <div v-if="event.date || event.Frequency" class="therapy-event-detail">
          <span class="therapy-event-detail-icon">📅</span>
          <span>{{ event.date ? formatDate(event.date) : event.Frequency }}</span>
        </div>
        <div v-if="event.Location" class="therapy-event-detail">
          <span class="therapy-event-detail-icon">📍</span>
          <span>{{ event.Location }}</span>
        </div>
        <div v-if="event.TimeStart && event.TimeEnd" class="therapy-event-detail">
          <span class="therapy-event-detail-icon">⏰</span>
          <span>{{ formatTime(event.TimeStart) }} - {{ formatTime(event.TimeEnd) }}</span>
        </div>
        <div v-if="event.GroupSize" class="therapy-event-detail">
          <span class="therapy-event-detail-icon">👥</span>
          <span>{{ event.GroupSize }}</span>
        </div>
      </div>
      <div class="featured-therapy-price" v-if="event.Price !== null && event.Price > 0">
        {{ formatPrice(event.Price) }}/session
      </div>
      <div class="featured-therapy-price" v-else>
        Free
      </div>
<!--      <router-link :to="`/events/${event.documentId}`" class="featured-therapy-btn">Learn More</router-link>-->
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/common.scss';

.featured-therapy-event {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 15px 40px var(--shadow-medium);
  margin-bottom: 4rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  position: relative;
  border: 1px solid var(--border-light);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.featured-wellness-badge {
  position: absolute;
  top: 2rem;
  left: 2rem;
  background: var(--accent-color);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 15px;
  font-weight: 700;
  font-size: 0.9rem;
  z-index: 2;
}

.featured-therapy-image {
  background: var(--gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  min-height: 350px;
}

.featured-visual-icon {
  font-size: 5rem;
  opacity: 0.8;
  color: white;
}

.featured-event-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.featured-therapy-content {
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: 768px) {
    padding: 2rem;
  }
}

.featured-therapy-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text-dark);
  font-family: 'Playfair Display', serif;
}

.featured-therapy-description {
  font-size: 1.1rem;
  color: var(--text-light);
  line-height: 1.6;
  margin-bottom: 2rem;
}

.featured-therapy-details {
  @extend .grid-two;
  gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
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

.featured-therapy-price {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text-dark);
  margin-bottom: 1.5rem;
}

.featured-event-status {
  position: absolute;
  top: 2rem;
  right: 2rem;
  z-index: 2;
  padding: 0.5rem 1.5rem;
  border-radius: 15px;
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
}

.therapy-event-status {
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

.featured-therapy-btn {
  background: var(--accent-color);
  color: white;
  padding: 1rem 2rem;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 700;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  text-align: center;
  box-shadow: 0 8px 25px rgba(244, 162, 97, 0.3);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 35px rgba(244, 162, 97, 0.4);
  }
}
</style>
