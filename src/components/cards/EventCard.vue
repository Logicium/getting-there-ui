<script setup lang="ts">
import { computed } from 'vue';
import type { EventData } from '@/data/data';
import { RouterLink } from 'vue-router';

interface Props {
  event: EventData;
}

const props = defineProps<Props>();

const statusClass = computed(() => {
  switch (props.event.status) {
    case 'available': return 'status-available';
    case 'filling': return 'status-filling';
    case 'waitlist': return 'status-waitlist';
    default: return '';
  }
});

const statusText = computed(() => {
  switch (props.event.status) {
    case 'available': return 'Open';
    case 'filling': return 'Filling Fast';
    case 'waitlist': return 'Waitlist';
    default: return '';
  }
});
</script>

<template>
  <div class="therapy-event-card fade-in" :data-category="event.category" :data-date="event.date">
    <div class="therapy-event-image">
      <div class="therapy-event-status" :class="statusClass">{{ statusText }}</div>
      <div class="event-visual-icon">{{ event.icon }}</div>
    </div>
    <div class="therapy-event-content">
      <div class="therapy-event-date">📅 {{ event.date }}</div>
      <h3 class="therapy-event-title">{{ event.title }}</h3>
      <p class="therapy-event-description">
        {{ event.description }}
      </p>
      <div class="therapy-event-details">
        <div class="therapy-event-detail">
          <span class="therapy-event-detail-icon">📍</span>
          <span>{{ event.location }}</span>
        </div>
        <div class="therapy-event-detail">
          <span class="therapy-event-detail-icon">⏰</span>
          <span>{{ event.time }}</span>
        </div>
        <div class="therapy-event-detail">
          <span class="therapy-event-detail-icon">👥</span>
          <span>{{ event.capacity }}</span>
        </div>
      </div>
      <div class="therapy-event-footer">
        <div class="therapy-event-price">{{ event.price }}</div>
        <RouterLink 
          v-if="event.status !== 'waitlist'" 
          :to="`/events/${event.slug}`" 
          class="therapy-event-btn"
        >
          Learn More
        </RouterLink>
        <button v-else class="therapy-event-btn waitlist-btn">Join Waitlist</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.therapy-event-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.4s ease;
  position: relative;
  border: 1px solid var(--border-light);
}

.therapy-event-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
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

.therapy-event-status {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
}

.status-available {
  background: var(--success-color);
  color: white;
}

.status-filling {
  background: var(--warning-color);
  color: white;
}

.status-waitlist {
  background: var(--text-light);
  color: white;
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
}

.therapy-event-price {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-dark);
}

.therapy-event-btn {
  background: var(--primary-color);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
}

.therapy-event-btn:hover {
  background: var(--secondary-color);
  transform: translateY(-2px);
}

.waitlist-btn {
  background: var(--text-light);
  cursor: default;
}

.waitlist-btn:hover {
  background: var(--text-light);
  transform: none;
}

@media (max-width: 768px) {
  .therapy-event-footer {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>