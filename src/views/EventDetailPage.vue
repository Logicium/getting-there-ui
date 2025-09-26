<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

// Interfaces for event data
interface EventStep {
  id: number;
  Name: string;
  starttime: string;
  description: string;
}

interface EventAbout {
  type: string;
  children: {
    text: string;
    type: string;
  }[];
}

interface Event {
  id: number;
  documentId: string;
  Title: string;
  Description: string;
  TimeStart: string;
  TimeEnd: string;
  Location: string;
  Address: string | null;
  Frequency: string | null;
  GroupSize: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  about: EventAbout[];
  isFeatured: boolean | null;
  date: string | null;
  Image: any | null;
  steps: EventStep[];
}

const route = useRoute();
const eventId = ref(route.params.id);
const event = ref<Event | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);

// FAQ Toggle
function toggleFAQ(element: HTMLElement) {
  const faqItem = element.parentElement;
  const isActive = faqItem?.classList.contains('active');

  // Close all FAQ items
  document.querySelectorAll('.therapy-faq-item').forEach(item => {
    item.classList.remove('active');
  });

  // Open clicked item if it wasn't active
  if (!isActive && faqItem) {
    faqItem.classList.add('active');
  }
}

// Registration handler
function handleRegistration() {
  alert('Registration system would integrate with your payment processor here. For demo purposes, this would redirect to a secure checkout page with sliding scale options available.');
}

// Add to Calendar functionality
function addToCalendar() {
  if (!event.value) return;

  // Get calendar event data from the updateCalendarEvent function
  const calendarEvent = {
    title: event.value.Title,
    start: event.value.date ? `${event.value.date}T${event.value.TimeStart}` : `${new Date().toISOString().split('T')[0]}T${event.value.TimeStart}`,
    end: event.value.date ? `${event.value.date}T${event.value.TimeEnd}` : `${new Date().toISOString().split('T')[0]}T${event.value.TimeEnd}`,
    location: event.value.Address ? `${event.value.Location}, ${event.value.Address}` : event.value.Location,
    description: event.value.Description
  };

  // Create Google Calendar URL
  const startDate = calendarEvent.start.replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const endDate = calendarEvent.end.replace(/[-:]/g, '').replace(/\.\d{3}/, '');

  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(calendarEvent.title)}&dates=${startDate}/${endDate}&location=${encodeURIComponent(calendarEvent.location)}&details=${encodeURIComponent(calendarEvent.description)}`;

  // Create Outlook URL
  const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(calendarEvent.title)}&startdt=${calendarEvent.start}&enddt=${calendarEvent.end}&location=${encodeURIComponent(calendarEvent.location)}&body=${encodeURIComponent(calendarEvent.description)}`;

  // Show options
  const choice = confirm('Add to Google Calendar? (OK for Google, Cancel for Outlook)');
  if (choice) {
    window.open(googleUrl, '_blank');
  } else {
    window.open(outlookUrl, '_blank');
  }
}

// Initialize map (placeholder)
function initMap() {
  if (!event.value || !event.value.Location) return;

  const mapContainer = document.getElementById('mapContainer');
  if (mapContainer) {
    mapContainer.innerHTML = `
            <div style="width: 100%; height: 100%; background: var(--gradient); display: flex; align-items: center; justify-content: center; color: white; text-align: center; border-radius: 12px;">
                <div>
                    <div style="font-size: 3rem; margin-bottom: 1rem;">📍</div>
                    <div style="font-weight: 600;">${event.value.Location}</div>
                    <div style="opacity: 0.9; font-size: 0.9rem;">${event.value.Address || ''}</div>
                </div>
            </div>
        `;
  }
}

// Format time from 24-hour format to 12-hour format
function formatTime(timeString: string): string {
  if (!timeString) return '';

  try {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  } catch (error) {
    console.error('Error formatting time:', error);
    return timeString;
  }
}

// Function to fetch event data from CMS
const fetchEventData = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    const cmsUrl = import.meta.env.VITE_CMS_URL || 'https://getting-there-cms.onrender.com';
    const response = await fetch(`${cmsUrl}/api/events/${eventId.value}?populate=*`);

    if (!response.ok) {
      throw new Error(`Failed to fetch event data: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    event.value = data.data;

    // Update the calendar functionality with the event's actual data
    if (event.value) {
      updateCalendarEvent();
    }

    // Wait for the DOM to update with the new data
    setTimeout(() => {
      observeFadeElements();
      initMap();
    }, 100);
  } catch (err) {
    console.error('Error fetching event data:', err);
    error.value = err instanceof Error ? err.message : 'An unknown error occurred';
  } finally {
    isLoading.value = false;
  }
};

// Update calendar event with actual data
function updateCalendarEvent() {
  if (!event.value) return;

  const eventDate = event.value.date || new Date().toISOString().split('T')[0]; // Use current date if not provided
  const calendarEvent = {
    title: event.value.Title,
    start: `${eventDate}T${event.value.TimeStart}`,
    end: `${eventDate}T${event.value.TimeEnd}`,
    location: event.value.Address ? `${event.value.Location}, ${event.value.Address}` : event.value.Location,
    description: event.value.Description
  };

  // Update the addToCalendar function to use this data
  (window as any).calendarEvent = calendarEvent;
}

// Calculate duration between two time strings in minutes
function calculateDuration(startTime: string, endTime: string): number {
  if (!startTime || !endTime) return 90; // Default duration

  try {
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);

    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;

    return endTotalMinutes - startTotalMinutes;
  } catch (error) {
    console.error('Error calculating duration:', error);
    return 90; // Default duration
  }
}

// Helper function to determine event price based on title (placeholder)
function getPriceFromTitle(title: string): string {
  if (!title) return '60'; // Default price

  const lowerTitle = title.toLowerCase();

  if (lowerTitle.includes('couples')) {
    return '120';
  } else if (lowerTitle.includes('virtual') || lowerTitle.includes('online')) {
    return '50';
  } else if (lowerTitle.includes('grief') || lowerTitle.includes('loss')) {
    return '40';
  } else if (lowerTitle.includes('trauma')) {
    return '65';
  } else if (lowerTitle.includes('mindful') || lowerTitle.includes('meditation') || lowerTitle.includes('compassion')) {
    return '45';
  }

  return '60'; // Default price
}

// Format about text from the API
function formatAboutText(paragraph: EventAbout): string {
  if (!paragraph || !paragraph.children) return '';

  // Join all the text from the children
  return paragraph.children.map(child => child.text).join('');
}

// Fade-in animation
const observeFadeElements = () => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
  });
};

// Initialize
onMounted(() => {
  // Fetch event data
  fetchEventData();

  // Initialize fade-in animation
  observeFadeElements();
});
</script>

<template>
  <section class="therapy-breadcrumb">
    <div class="therapy-breadcrumb-content">
      <router-link to="/">Home</router-link> → <router-link to="/events">Healing Programs</router-link> → {{ event ? event.Title : 'Loading...' }}
    </div>
  </section>

  <section v-if="isLoading" class="loading-container">
    <div class="loading-spinner"></div>
    <p>Loading event details...</p>
  </section>

  <section v-else-if="error" class="error-container">
    <p>{{ error }}</p>
    <button @click="fetchEventData" class="retry-button">Retry</button>
  </section>

  <section v-else-if="event" class="therapy-event-hero">
    <div class="therapy-event-hero-content">
      <div class="therapy-event-main-info">
        <div class="therapy-event-status-badge">Open Registration - Safe Space</div>
        <h1>{{ event.Title }}</h1>
        <p class="therapy-event-subtitle">{{ event.Description }}</p>

        <div class="therapy-event-quick-info">
          <div class="therapy-quick-info-item" v-if="event.date || event.Frequency">
            <div class="therapy-quick-info-icon">📅</div>
            <div class="therapy-quick-info-text">
              <h4>Schedule</h4>
              <p>{{ event.date ? new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : event.Frequency }}</p>
            </div>
          </div>
          <div class="therapy-quick-info-item" v-if="event.Location">
            <div class="therapy-quick-info-icon">📍</div>
            <div class="therapy-quick-info-text">
              <h4>Location</h4>
              <p>{{ event.Location }}<br>{{ event.Address || 'Private, comfortable setting' }}</p>
            </div>
          </div>
          <div class="therapy-quick-info-item" v-if="event.TimeStart && event.TimeEnd">
            <div class="therapy-quick-info-icon">⏰</div>
            <div class="therapy-quick-info-text">
              <h4>Time</h4>
              <p>{{ formatTime(event.TimeStart) }} - {{ formatTime(event.TimeEnd) }}<br>{{ calculateDuration(event.TimeStart, event.TimeEnd) }} minutes per session</p>
            </div>
          </div>
          <div class="therapy-quick-info-item" v-if="event.GroupSize">
            <div class="therapy-quick-info-icon">👥</div>
            <div class="therapy-quick-info-text">
              <h4>Group Size</h4>
              <p>{{ event.GroupSize }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="therapy-registration-card">
        <div class="therapy-price-section">
          <div class="therapy-price">${{ getPriceFromTitle(event.Title) }}</div>
          <p class="therapy-price-subtitle">Per session • Sliding scale available</p>
        </div>

        <button class="therapy-register-btn" @click="handleRegistration">Join Our Healing Circle</button>
        <button class="therapy-calendar-btn" @click="addToCalendar">📅 Add to Calendar</button>

        <ul class="therapy-registration-features">
          <li>Weekly therapeutic support sessions</li>
          <li>Evidence-based anxiety management techniques</li>
          <li>Safe, confidential group environment</li>
          <li>Licensed mental health facilitators</li>
          <li>Take-home resources and workbooks</li>
          <li>Crisis support access</li>
          <li>Sliding scale fee assistance</li>
        </ul>

        <div class="therapy-safety-notice">
          <h4>🔒 Your Safety & Privacy</h4>
          <p>All group sessions maintain strict confidentiality. What's shared in group stays in group.</p>
        </div>
      </div>
    </div>
  </section>

  <main v-if="event" class="therapy-event-content">
    <div class="therapy-main-content">
      <div class="therapy-content-section fade-in">
        <h2>About This Healing Circle</h2>
        <div v-if="event.about && event.about.length > 0">
          <p v-for="(paragraph, index) in event.about" :key="index" v-html="formatAboutText(paragraph)"></p>
        </div>
        <p v-else>
          Join us for this transformative healing experience. Our program is designed to provide you with the tools, 
          support, and community you need on your journey to wellness.
        </p>
      </div>

      <div class="therapy-content-section fade-in" v-if="event.steps && event.steps.length > 0">
        <h2>What to Expect in Each Session</h2>
        <ul class="therapy-session-agenda">
          <li v-for="step in event.steps" :key="step.id" class="therapy-agenda-item">
            <div class="therapy-agenda-time">{{ formatTime(step.starttime) }}</div>
            <div class="therapy-agenda-content">
              <h4>{{ step.Name }}</h4>
              <p>{{ step.description }}</p>
            </div>
          </li>
        </ul>
      </div>

      <div class="therapy-content-section fade-in">
        <h2>Therapeutic Approach & Benefits</h2>
        <p><strong>Evidence-Based Methods:</strong> Our support circle integrates cognitive-behavioral therapy (CBT), mindfulness-based stress reduction (MBSR), and acceptance and commitment therapy (ACT) principles in a group setting.</p>

        <p><strong>Trauma-Informed Care:</strong> All facilitators are trained in trauma-informed approaches, ensuring that the group environment feels safe and supportive for all participants, including those with trauma histories.</p>

        <p><strong>Peer Support Benefits:</strong> Research shows that group therapy can be as effective as individual therapy for anxiety, with the added benefits of peer connection, reduced isolation, and normalized experiences.</p>

        <p>Key benefits participants often experience:</p>
        <ul style="margin: 1rem 0; padding-left: 2rem; color: var(--text-light);">
          <li>Reduced feelings of isolation and shame around anxiety</li>
          <li>Practical tools for managing panic attacks and anxiety symptoms</li>
          <li>Increased self-awareness and emotional regulation skills</li>
          <li>A supportive community of peers who understand your experience</li>
          <li>Improved confidence in social situations</li>
          <li>Greater sense of hope and possibility for healing</li>
        </ul>
      </div>

      <div class="therapy-content-section fade-in">
        <h2>Frequently Asked Questions</h2>

        <div class="therapy-faq-item">
          <div class="therapy-faq-question" @click="toggleFAQ($event.currentTarget as HTMLElement)">
            Is this group right for me if I have severe anxiety?
            <span class="therapy-faq-toggle">▼</span>
          </div>
          <div class="therapy-faq-answer">
            This group is designed for individuals with various levels of anxiety, from mild to more severe. Our licensed facilitators are experienced in supporting people with different needs. If you're currently in crisis or experiencing severe symptoms, we recommend starting with individual therapy alongside group participation.
          </div>
        </div>

        <div class="therapy-faq-item">
          <div class="therapy-faq-question" @click="toggleFAQ($event.currentTarget as HTMLElement)">
            What if I'm too anxious to speak in group?
            <span class="therapy-faq-toggle">▼</span>
          </div>
          <div class="therapy-faq-answer">
            This is completely normal and welcomed! There's no pressure to share before you're ready. Many members start by simply listening and observing. Our facilitators create a gentle, non-pressured environment where you can participate at your own pace.
          </div>
        </div>

        <div class="therapy-faq-item">
          <div class="therapy-faq-question" @click="toggleFAQ($event.currentTarget as HTMLElement)">
            How long do people typically attend the group?
            <span class="therapy-faq-toggle">▼</span>
          </div>
          <div class="therapy-faq-answer">
            There's no set timeline - healing happens at different paces for everyone. Some members attend for a few months, others for a year or more. We encourage a minimum commitment of 4-6 sessions to give the group process time to work, but you can discontinue at any time.
          </div>
        </div>

        <div class="therapy-faq-item">
          <div class="therapy-faq-question" @click="toggleFAQ($event.currentTarget as HTMLElement)">
            Is financial assistance available?
            <span class="therapy-faq-toggle">▼</span>
          </div>
          <div class="therapy-faq-answer">
            Yes! We offer sliding scale fees based on income because we believe financial barriers shouldn't prevent access to healing. During registration, you can discuss fee adjustment options with our intake coordinator. Some insurance plans may also provide coverage.
          </div>
        </div>

        <div class="therapy-faq-item">
          <div class="therapy-faq-question" @click="toggleFAQ($event.currentTarget as HTMLElement)">
            What about confidentiality in a group setting?
            <span class="therapy-faq-toggle">▼</span>
          </div>
          <div class="therapy-faq-answer">
            Confidentiality is paramount in our groups. All members agree to keep what's shared in group confidential. Our facilitators are bound by professional ethics, and we review confidentiality agreements at the start of participation. We also discuss healthy boundaries around sharing personal information.
          </div>
        </div>
      </div>
    </div>

    <aside class="therapy-sidebar">
      <div class="therapy-facilitator-card fade-in">
        <div class="therapy-facilitator-avatar">👩‍⚕️</div>
        <h3>Dr. Sarah Mitchell, PhD</h3>
        <p class="therapy-facilitator-title">Lead Group Facilitator</p>
        <p class="therapy-facilitator-bio">
          Dr. Mitchell is a licensed clinical psychologist specializing in anxiety disorders and group therapy. With over 15 years of experience, she brings a warm, trauma-informed approach to creating safe spaces for healing and growth.
        </p>
        <div class="therapy-facilitator-credentials">
          <span class="credential-badge">🎓 PhD Clinical Psychology</span>
          <span class="credential-badge">🏆 Licensed Therapist</span>
          <span class="credential-badge">🧠 Anxiety Specialist</span>
        </div>
      </div>

      <div class="therapy-location-section fade-in" v-if="event && event.Location">
        <h3>🏥 Healing Environment</h3>
        <div class="therapy-venue-info">
          <h4>{{ event.Location }}</h4>
          <p v-if="event.Address">{{ event.Address }}</p>
          <p>Quiet, private group room</p>
        </div>

        <div class="therapy-environment-features">
          <div class="environment-feature">
            <span class="feature-icon">🪑</span>
            <span>Comfortable seating in circle format</span>
          </div>
          <div class="environment-feature">
            <span class="feature-icon">🌱</span>
            <span>Calming, natural lighting</span>
          </div>
          <div class="environment-feature">
            <span class="feature-icon">🔒</span>
            <span>Private, soundproof space</span>
          </div>
          <div class="environment-feature">
            <span class="feature-icon">♿</span>
            <span>Fully accessible</span>
          </div>
        </div>

        <div class="therapy-map-container" id="mapContainer">
          <div class="therapy-map-placeholder">
            <p>🗺️ Interactive Map</p>
            <p style="font-size: 0.9rem;">Loading location...</p>
          </div>
        </div>

        <a :href="`https://www.google.com/maps/dir//${encodeURIComponent(event.Location)}${event.Address ? ',' + encodeURIComponent(event.Address) : ''}`" target="_blank" class="therapy-directions-btn">Get Directions</a>
      </div>

      <div class="therapy-crisis-support fade-in">
        <h3>🚨 Crisis Support</h3>
        <p>If you're experiencing a mental health emergency:</p>
        <div class="crisis-contacts">
          <a href="tel:988" class="crisis-contact">
            <span class="crisis-icon">📞</span>
            <div class="crisis-info">
              <strong>988 - Suicide & Crisis Lifeline</strong>
              <p>24/7 confidential support</p>
            </div>
          </a>
          <a href="tel:911" class="crisis-contact">
            <span class="crisis-icon">🚨</span>
            <div class="crisis-info">
              <strong>911 - Emergency Services</strong>
              <p>Immediate emergency response</p>
            </div>
          </a>
        </div>
        <p class="crisis-note">Remember: Seeking help is a sign of strength, not weakness.</p>
      </div>

      <div class="therapy-support-info fade-in">
        <h3>💚 Need Additional Support?</h3>
        <p>Our team is here to help with any questions about joining the group or mental health resources.</p>
        <div class="support-contacts">
          <p><strong>Email:</strong> <a href="mailto:groups@gthere.net">groups@gthere.net</a></p>
          <p><strong>Phone:</strong> <a href="tel:+1234567890">(123) 456-7890</a></p>
          <p><strong>Hours:</strong> Mon-Fri, 9AM-5PM</p>
        </div>
      </div>
    </aside>
  </main>
</template>

<style scoped>
/* Therapy Breadcrumb */
.therapy-breadcrumb {
  background: var(--bg-light);
  padding: 1rem 0;
  margin-top: 80px;
  border-bottom: 1px solid var(--border-light);
}

.therapy-breadcrumb-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-light);
}

.therapy-breadcrumb a {
  color: var(--primary-color);
  text-decoration: none;
  transition: color 0.3s ease;
}

.therapy-breadcrumb a:hover {
  color: var(--secondary-color);
}

/* Therapy Event Hero */
.therapy-event-hero {
  background: white;
  padding: 3rem 0;
}

.therapy-event-hero-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 4rem;
  align-items: start;
}

.therapy-event-main-info h1 {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text-dark);
  line-height: 1.2;
  font-family: 'Playfair Display', serif;
}

.therapy-event-subtitle {
  font-size: 1.2rem;
  color: var(--text-light);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.therapy-event-status-badge {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-weight: 700;
  font-size: 0.9rem;
  margin-bottom: 2rem;
  background: var(--success-color);
  color: white;
}

.therapy-event-quick-info {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.therapy-quick-info-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--bg-sage);
  border-radius: 15px;
  border: 1px solid var(--border-light);
}

.therapy-quick-info-icon {
  width: 45px;
  height: 45px;
  background: var(--primary-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.3rem;
}

.therapy-quick-info-text h4 {
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: var(--text-dark);
}

.therapy-quick-info-text p {
  color: var(--text-light);
  font-size: 0.9rem;
  line-height: 1.4;
}

/* Registration Card */
.therapy-registration-card {
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 15px 40px var(--shadow-medium);
  position: sticky;
  top: 120px;
  border: 1px solid var(--border-light);
}

.therapy-price-section {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border-light);
}

.therapy-price {
  font-size: 3rem;
  font-weight: 800;
  color: var(--text-dark);
  margin-bottom: 0.5rem;
}

.therapy-price-subtitle {
  color: var(--text-light);
  font-size: 0.9rem;
}

.therapy-register-btn {
  width: 100%;
  background: var(--primary-color);
  color: white;
  padding: 1rem 2rem;
  border-radius: 25px;
  border: none;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1rem;
  box-shadow: 0 8px 25px var(--shadow-light);
}

.therapy-register-btn:hover {
  background: var(--secondary-color);
  transform: translateY(-3px);
  box-shadow: 0 12px 35px var(--shadow-medium);
}

.therapy-calendar-btn {
  width: 100%;
  background: var(--accent-color);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 2rem;
}

.therapy-calendar-btn:hover {
  background: var(--warning-color);
  transform: translateY(-2px);
}

.therapy-registration-features {
  list-style: none;
  padding: 0;
  margin-bottom: 2rem;
}

.therapy-registration-features li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  color: var(--text-dark);
  font-size: 0.95rem;
}

.therapy-registration-features li::before {
  content: '💚';
  font-size: 1rem;
}

.therapy-safety-notice {
  background: var(--bg-sage);
  padding: 1.5rem;
  border-radius: 12px;
  border-left: 4px solid var(--primary-color);
}

.therapy-safety-notice h4 {
  color: var(--primary-color);
  margin-bottom: 0.75rem;
  font-size: 1rem;
}

.therapy-safety-notice p {
  margin: 0;
  color: var(--text-dark);
  font-size: 0.9rem;
  line-height: 1.5;
}

/* Main Content */
.therapy-event-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 4rem;
}

.therapy-content-section {
  margin-bottom: 3rem;
}

.therapy-content-section h2 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--text-dark);
  font-family: 'Playfair Display', serif;
}

.therapy-content-section p {
  margin-bottom: 1rem;
  line-height: 1.7;
  color: var(--text-light);
}

.therapy-session-agenda {
  list-style: none;
  margin-bottom: 2rem;
  padding: 0;
}

.therapy-agenda-item {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding: 2rem;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 20px var(--shadow-light);
  border: 1px solid var(--border-light);
}

.therapy-agenda-time {
  font-weight: 700;
  color: var(--primary-color);
  min-width: 80px;
  font-size: 0.95rem;
}

.therapy-agenda-content h4 {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-dark);
}

.therapy-agenda-content p {
  color: var(--text-light);
  font-size: 0.95rem;
  margin: 0;
}

/* FAQ Section */
.therapy-faq-item {
  background: white;
  border-radius: 12px;
  margin-bottom: 1rem;
  overflow: hidden;
  box-shadow: 0 5px 20px var(--shadow-light);
  border: 1px solid var(--border-light);
}

.therapy-faq-question {
  padding: 1.5rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--text-dark);
  transition: all 0.3s ease;
}

.therapy-faq-question:hover {
  background: var(--bg-sage);
}

.therapy-faq-answer {
  padding: 0 1.5rem 1.5rem;
  color: var(--text-light);
  line-height: 1.6;
  display: none;
}

.therapy-faq-item.active .therapy-faq-answer {
  display: block;
}

.therapy-faq-toggle {
  transition: transform 0.3s ease;
  color: var(--primary-color);
}

.therapy-faq-item.active .therapy-faq-toggle {
  transform: rotate(180deg);
}

/* Sidebar */
.therapy-sidebar {
  position: sticky;
  top: 6rem;
  height: fit-content;
}

.therapy-facilitator-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 30px var(--shadow-light);
  text-align: center;
  margin-bottom: 2rem;
  border: 1px solid var(--border-light);
}

.therapy-facilitator-avatar {
  width: 100px;
  height: 100px;
  background: var(--gradient);
  border-radius: 50%;
  margin: 0 auto 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: white;
}

.therapy-facilitator-card h3 {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--text-dark);
}

.therapy-facilitator-title {
  color: var(--primary-color);
  font-weight: 600;
  margin-bottom: 1rem;
}

.therapy-facilitator-bio {
  color: var(--text-light);
  line-height: 1.6;
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
}

.therapy-facilitator-credentials {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* Location Section */
.therapy-location-section {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 30px var(--shadow-light);
  margin-bottom: 2rem;
  border: 1px solid var(--border-light);
}

.therapy-location-section h3 {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text-dark);
}

.therapy-venue-info {
  margin-bottom: 1.5rem;
}

.therapy-venue-info h4 {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-dark);
}

.therapy-venue-info p {
  color: var(--text-light);
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
}

.therapy-environment-features {
  margin-bottom: 2rem;
}

.environment-feature {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  color: var(--text-light);
  font-size: 0.9rem;
}

.feature-icon {
  font-size: 1.1rem;
}

.therapy-map-container {
  width: 100%;
  height: 200px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 1rem;
  background: var(--bg-light);
  display: flex;
  align-items: center;
  justify-content: center;
}

.therapy-map-placeholder {
  text-align: center;
  color: var(--text-light);
}

.therapy-directions-btn {
  width: 100%;
  background: var(--primary-color);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  text-align: center;
  display: block;
}

.therapy-directions-btn:hover {
  background: var(--secondary-color);
  transform: translateY(-2px);
}

/* Crisis Support */
.therapy-crisis-support {
  background: rgba(231, 111, 81, 0.1);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  border-left: 4px solid var(--warning-color);
}

.therapy-crisis-support h3 {
  color: var(--warning-color);
  margin-bottom: 1rem;
  font-size: 1.3rem;
  font-weight: 700;
}

.crisis-contacts {
  margin: 1.5rem 0;
}

.crisis-contact {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  text-decoration: none;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  border: 1px solid var(--border-light);
}

.crisis-contact:hover {
  background: var(--bg-light);
  transform: translateY(-2px);
}

.crisis-icon {
  font-size: 1.5rem;
}

.crisis-info strong {
  color: var(--text-dark);
  display: block;
  margin-bottom: 0.25rem;
}

.crisis-info p {
  color: var(--text-light);
  font-size: 0.9rem;
  margin: 0;
}

.crisis-note {
  font-size: 0.9rem;
  color: var(--text-dark);
  font-style: italic;
  margin: 0;
}

/* Support Info */
.therapy-support-info {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 30px var(--shadow-light);
  border: 1px solid var(--border-light);
}

.therapy-support-info h3 {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text-dark);
}

.therapy-support-info p {
  color: var(--text-light);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.support-contacts p {
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.support-contacts a {
  color: var(--primary-color);
  text-decoration: none;
}

.support-contacts a:hover {
  color: var(--secondary-color);
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .therapy-event-hero-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .therapy-event-main-info h1 {
    font-size: 2rem;
  }

  .therapy-event-quick-info {
    grid-template-columns: 1fr;
  }

  .therapy-event-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .therapy-registration-card {
    position: static;
    top: auto;
  }

  .therapy-facilitator-credentials {
    flex-direction: column;
  }
}

/* Loading and Error States */
.loading-container, .error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  min-height: 300px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid var(--bg-light);
  border-top: 5px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-container p {
  color: var(--warning-color);
  margin-bottom: 1rem;
  font-weight: 600;
}

.retry-button {
  background: var(--primary-color);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-button:hover {
  background: var(--secondary-color);
  transform: translateY(-2px);
}

/* Animations */
.fade-in {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease;
}

.fade-in.visible {
  opacity: 1;
  transform: translateY(0);
}
</style>
