<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import {
  GraduationCap,
  Award,
  Brain,
  Armchair,
  Sprout,
  Lock,
  Accessibility,
  Map as MapIcon,
  Calendar,
  Clock,
  MapPin,
  Users,
  CalendarPlus,
  ShieldCheck,
  Heart,
} from 'lucide-vue-next';
import {
  AppButton,
  AppCard,
  AppContainer,
  AppEmptyState,
  AppEyebrow,
  AppHero,
  AppSection,
  AppSpinner,
} from '@/components/ui';

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

  const calendarEvent = {
    title: event.value.Title,
    start: event.value.date ? `${event.value.date}T${event.value.TimeStart}` : `${new Date().toISOString().split('T')[0]}T${event.value.TimeStart}`,
    end: event.value.date ? `${event.value.date}T${event.value.TimeEnd}` : `${new Date().toISOString().split('T')[0]}T${event.value.TimeEnd}`,
    location: event.value.Address ? `${event.value.Location}, ${event.value.Address}` : event.value.Location,
    description: event.value.Description
  };

  const startDate = calendarEvent.start.replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const endDate = calendarEvent.end.replace(/[-:]/g, '').replace(/\.\d{3}/, '');

  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(calendarEvent.title)}&dates=${startDate}/${endDate}&location=${encodeURIComponent(calendarEvent.location)}&details=${encodeURIComponent(calendarEvent.description)}`;

  const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(calendarEvent.title)}&startdt=${calendarEvent.start}&enddt=${calendarEvent.end}&location=${encodeURIComponent(calendarEvent.location)}&body=${encodeURIComponent(calendarEvent.description)}`;

  const choice = confirm('Add to Google Calendar? (OK for Google, Cancel for Outlook)');
  if (choice) {
    window.open(googleUrl, '_blank');
  } else {
    window.open(outlookUrl, '_blank');
  }
}

// Initialize Google Maps using iframe with API key
function initMap() {
  if (!event.value || !event.value.Location) return;

  const mapContainer = document.getElementById('mapContainer');
  if (!mapContainer) return;

  mapContainer.innerHTML = '';

  let locationQuery;
  if (event.value.Address) {
    locationQuery = encodeURIComponent(`${event.value.Location}, ${event.value.Address}`);
  } else {
    locationQuery = encodeURIComponent(event.value.Location);
  }

  locationQuery = locationQuery.replace(/%20/g, '+');

  const iframe = document.createElement('iframe');
  iframe.style.border = '0';
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.setAttribute('loading', 'lazy');
  iframe.setAttribute('allowfullscreen', '');
  iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
  iframe.src = `https://www.google.com/maps/embed/v1/place?key=AIzaSyDN_20CLj-TUTeQHE0yTvWPNMVtxiXktfY&q=${locationQuery}`;

  mapContainer.appendChild(iframe);
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

    if (event.value) {
      updateCalendarEvent();
    }

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

  const eventDate = event.value.date || new Date().toISOString().split('T')[0];
  const calendarEvent = {
    title: event.value.Title,
    start: `${eventDate}T${event.value.TimeStart}`,
    end: `${eventDate}T${event.value.TimeEnd}`,
    location: event.value.Address ? `${event.value.Location}, ${event.value.Address}` : event.value.Location,
    description: event.value.Description
  };

  (window as any).calendarEvent = calendarEvent;
}

// Calculate duration between two time strings in minutes
function calculateDuration(startTime: string, endTime: string): number {
  if (!startTime || !endTime) return 90;

  try {
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);

    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;

    return endTotalMinutes - startTotalMinutes;
  } catch (error) {
    console.error('Error calculating duration:', error);
    return 90;
  }
}

// Helper function to determine event price based on title
function getPriceFromTitle(title: string): string {
  if (!title) return '60';

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

  return '60';
}

// Format about text from the API
function formatAboutText(paragraph: EventAbout): string {
  if (!paragraph || !paragraph.children) return '';
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

onMounted(async () => {
  await fetchEventData();
  setTimeout(() => {
    observeFadeElements();
  }, 100);
});
</script>

<template>
  <main class="event-detail">
    <!-- COMPACT HERO with breadcrumbs -->
    <AppHero variant="compact" tone="cream" align="center">
      <template #eyebrow>
        <nav class="event-crumbs" aria-label="Breadcrumb">
          <RouterLink to="/">Home</RouterLink>
          <span aria-hidden="true">→</span>
          <RouterLink to="/events">Gatherings</RouterLink>
          <span aria-hidden="true">→</span>
          <span class="event-crumbs__current">{{ event ? event.Title : 'Loading…' }}</span>
        </nav>
      </template>
      <template #title>
        {{ event ? event.Title : 'Loading event…' }}
      </template>
      <template #lede>
        <p v-if="event">{{ event.Description }}</p>
      </template>
    </AppHero>

    <!-- LOADING / ERROR -->
    <AppSection v-if="isLoading" tone="cream-2" pad="lg">
      <AppContainer size="md">
        <div class="event-state">
          <AppSpinner size="lg" />
          <p>Loading event details…</p>
        </div>
      </AppContainer>
    </AppSection>

    <AppSection v-else-if="error" tone="cream-2" pad="lg">
      <AppContainer size="md">
        <AppEmptyState variant="error" :title="error">
          <template #actions>
            <AppButton variant="primary" @click="fetchEventData">Retry</AppButton>
            <AppButton variant="ghost" to="/events">Back to events</AppButton>
          </template>
        </AppEmptyState>
      </AppContainer>
    </AppSection>

    <!-- BODY: split magazine + ticket card -->
    <AppSection v-else-if="event" tone="cream-2" pad="xl">
      <AppContainer size="lg">
        <div class="event-body">
          <!-- LEFT: magazine flowing content -->
          <div class="event-magazine">
            <article class="magazine u-prose">
              <header class="event-magazine__head">
                <AppEyebrow tone="cobalt">About this gathering</AppEyebrow>
                <h2>About This Healing Circle</h2>
              </header>
              <div v-if="event.about && event.about.length > 0">
                <p v-for="(paragraph, idx) in event.about" :key="idx" v-html="formatAboutText(paragraph)"></p>
              </div>
              <p v-else>
                Join us for this transformative healing experience. Our program is designed to provide you with the tools,
                support, and community you need on your journey to wellness.
              </p>
            </article>

            <article v-if="event.steps && event.steps.length > 0" class="magazine">
              <header class="event-magazine__head">
                <AppEyebrow tone="marigold">Session flow</AppEyebrow>
                <h2>What to Expect in Each Session</h2>
              </header>
              <ul class="event-agenda">
                <li v-for="step in event.steps" :key="step.id" class="event-agenda__item">
                  <div class="event-agenda__time">{{ formatTime(step.starttime) }}</div>
                  <div class="event-agenda__copy">
                    <h4>{{ step.Name }}</h4>
                    <p>{{ step.description }}</p>
                  </div>
                </li>
              </ul>
            </article>

            <article class="magazine u-prose">
              <header class="event-magazine__head">
                <AppEyebrow tone="fuchsia">Therapeutic approach</AppEyebrow>
                <h2>Therapeutic Approach &amp; Benefits</h2>
              </header>
              <p><strong>Practical Methods:</strong> Our programs draw on widely used therapeutic approaches including cognitive-behavioral techniques (CBT), mindfulness-based stress reduction (MBSR), and acceptance and commitment therapy (ACT) principles adapted for group settings.</p>
              <p><strong>Trauma-Informed Care:</strong> All facilitators are trained in trauma-informed approaches, ensuring that the environment feels safe and supportive for all participants, including those with trauma histories or sensitive experiences.</p>
              <p><strong>Group Support Benefits:</strong> Research consistently shows that group-based therapeutic interventions can be as effective as individual therapy, with the added benefits of peer connection, reduced isolation, normalized experiences, and mutual learning.</p>
              <p>Key benefits participants often experience:</p>
              <ul>
                <li>Reduced feelings of isolation through shared experiences</li>
                <li>Practical tools and coping strategies</li>
                <li>Increased self-awareness and emotional regulation skills</li>
                <li>A supportive community of peers on similar journeys</li>
                <li>Improved confidence and interpersonal skills</li>
                <li>Greater sense of hope and possibility for positive change</li>
              </ul>
            </article>

            <!-- FAQ: accordion as AppCard variant=flat stack -->
            <section class="event-faq">
              <header class="event-magazine__head">
                <AppEyebrow tone="mint">Questions</AppEyebrow>
                <h2>Frequently Asked Questions</h2>
              </header>

              <div class="event-faq__stack">
                <AppCard
                  v-for="(faq, idx) in faqs"
                  :key="idx"
                  variant="flat"
                  tone="paper"
                  shadow-tone="none"
                  pad="none"
                  class="therapy-faq-item"
                >
                  <div class="therapy-faq-question" @click="toggleFAQ($event.currentTarget as HTMLElement)">
                    <span>{{ faq.q }}</span>
                    <span class="therapy-faq-toggle" aria-hidden="true">▼</span>
                  </div>
                  <div class="therapy-faq-answer">{{ faq.a }}</div>
                </AppCard>
              </div>
            </section>

            <!-- Facilitator + Location + Crisis as supporting flat cards -->
            <div class="event-supporting">
              <AppCard variant="flat" tone="paper" shadow-tone="cobalt" pad="lg" class="fade-in">
                <template #eyebrow><AppEyebrow tone="cobalt">Facilitator</AppEyebrow></template>
                <template #title>Dr. Sarah Mitchell, PhD</template>
                <p class="event-supporting__role">Lead Group Facilitator</p>
                <p>
                  Dr. Mitchell is a PhD clinical psychologist with over 15 years of experience in group therapy and
                  trauma-informed care. She brings a warm, compassionate approach to creating safe spaces for healing and growth.
                </p>
                <div class="event-supporting__chips">
                  <span class="chip"><GraduationCap :size="14" :stroke-width="2.5" /> PhD Clinical Psychology</span>
                  <span class="chip"><Award :size="14" :stroke-width="2.5" /> Professional Therapist</span>
                  <span class="chip"><Brain :size="14" :stroke-width="2.5" /> Group Therapy Specialist</span>
                </div>
              </AppCard>

              <AppCard
                v-if="event && event.Location"
                variant="flat"
                tone="paper"
                shadow-tone="marigold"
                pad="lg"
                class="fade-in"
              >
                <template #eyebrow><AppEyebrow tone="marigold">Healing environment</AppEyebrow></template>
                <template #title>{{ event.Location }}</template>
                <p v-if="event.Address">{{ event.Address }}</p>
                <p>Quiet, private group room.</p>

                <ul class="event-supporting__features">
                  <li><Armchair :size="16" :stroke-width="2" /> Comfortable seating in circle format</li>
                  <li><Sprout :size="16" :stroke-width="2" /> Calming, natural lighting</li>
                  <li><Lock :size="16" :stroke-width="2" /> Private, soundproof space</li>
                  <li><Accessibility :size="16" :stroke-width="2" /> Fully accessible</li>
                </ul>

                <div id="mapContainer" class="event-map">
                  <div class="event-map__placeholder">
                    <p><MapIcon :size="18" :stroke-width="2" /> Interactive Map</p>
                    <p>Loading location…</p>
                  </div>
                </div>

                <template #footer>
                  <AppButton
                    variant="ink"
                    :href="`https://www.google.com/maps/dir//${encodeURIComponent(event.Location)}${event.Address ? ',' + encodeURIComponent(event.Address) : ''}`"
                    block
                  >
                    Get directions
                  </AppButton>
                </template>
              </AppCard>

              <AppCard variant="flat" tone="paper" shadow-tone="fuchsia" pad="lg" class="fade-in">
                <template #eyebrow><AppEyebrow tone="fuchsia">Crisis support</AppEyebrow></template>
                <template #title>If you need help right now</template>
                <ul class="event-supporting__crisis">
                  <li>
                    <a href="tel:988">
                      <strong>988 — Suicide &amp; Crisis Lifeline</strong>
                      <span>24/7 confidential support</span>
                    </a>
                  </li>
                  <li>
                    <a href="tel:911">
                      <strong>911 — Emergency Services</strong>
                      <span>Immediate emergency response</span>
                    </a>
                  </li>
                </ul>
                <p class="event-supporting__note">Reaching out is a sign of strength, not weakness.</p>
              </AppCard>
            </div>
          </div>

          <!-- RIGHT: ticket-stub registration card -->
          <aside class="event-aside">
            <AppCard variant="ticket" tone="paper" shadow-tone="cobalt" pad="lg" class="event-ticket">
              <template #eyebrow>
                <AppEyebrow tone="mint">Open registration</AppEyebrow>
              </template>
              <template #title>${{ getPriceFromTitle(event.Title) }}</template>

              <p class="event-ticket__sub">Per session • Sliding scale available</p>

              <ul class="event-ticket__meta">
                <li v-if="event.date || event.Frequency">
                  <Calendar :size="22" :stroke-width="2" class="event-ticket__icon" />
                  <div>
                    <b>Schedule</b>
                    <em>{{ event.date ? new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : event.Frequency }}</em>
                  </div>
                </li>
                <li v-if="event.TimeStart && event.TimeEnd">
                  <Clock :size="22" :stroke-width="2" class="event-ticket__icon" />
                  <div>
                    <b>Time</b>
                    <em>{{ formatTime(event.TimeStart) }} – {{ formatTime(event.TimeEnd) }}</em>
                    <em class="event-ticket__sub">{{ calculateDuration(event.TimeStart, event.TimeEnd) }} minutes per session</em>
                  </div>
                </li>
                <li v-if="event.Location">
                  <MapPin :size="22" :stroke-width="2" class="event-ticket__icon" />
                  <div>
                    <b>Location</b>
                    <em>{{ event.Location }}</em>
                    <em v-if="event.Address" class="event-ticket__sub">{{ event.Address }}</em>
                  </div>
                </li>
                <li v-if="event.GroupSize">
                  <Users :size="22" :stroke-width="2" class="event-ticket__icon" />
                  <div>
                    <b>Group size</b>
                    <em>{{ event.GroupSize }}</em>
                  </div>
                </li>
              </ul>

              <template #footer>
                <AppButton variant="primary" size="lg" block @click="handleRegistration">
                  Reserve seat
                </AppButton>
                <AppButton variant="ghost" block @click="addToCalendar">
                  <CalendarPlus :size="16" :stroke-width="2" /> Add to calendar
                </AppButton>

                <ul class="event-ticket__features">
                  <li>Weekly therapeutic support sessions</li>
                  <li>Safe, confidential group environment</li>
                  <li>Experienced facilitators</li>
                  <li>Take-home resources and workbooks</li>
                  <li>Crisis support access</li>
                  <li>Sliding scale fee assistance</li>
                </ul>

                <div class="event-ticket__safety">
                  <strong><ShieldCheck :size="16" :stroke-width="2.25" /> Your safety &amp; privacy</strong>
                  <p>All group sessions maintain strict confidentiality. What's shared in group stays in group.</p>
                </div>
              </template>
            </AppCard>
          </aside>
        </div>
      </AppContainer>
    </AppSection>

    <!-- CTA / related events -->
    <AppSection v-if="event" tone="ink" pad="xl">
      <AppContainer size="md">
        <div class="event-cta">
          <h2 class="event-cta__title">Not quite the right fit?</h2>
          <p class="event-cta__lede">Explore our other gatherings, workshops, and ongoing circles.</p>
          <div class="event-cta__actions">
            <AppButton to="/events" variant="primary" size="lg">See all gatherings</AppButton>
            <AppButton href="mailto:groups@gthere.net" variant="ghost" size="lg">Email the team</AppButton>
          </div>
        </div>
      </AppContainer>
    </AppSection>
  </main>
</template>

<script lang="ts">
// Static FAQ list — kept out of <script setup> to preserve original script untouched.
export const faqs = [
  { q: 'Is this program right for me?', a: "Our programs are designed to support individuals at various stages of their wellbeing journey. Whether you're dealing with specific challenges, seeking personal growth, or looking for supportive community, our practical approaches can be beneficial. If you're currently in crisis or experiencing severe symptoms, we recommend combining group participation with individual therapy support." },
  { q: "What if I'm nervous about participating in a group?", a: "Feeling nervous about group participation is completely normal and valid. There's no pressure to share before you're ready — many participants start by simply listening and observing. Our facilitators create a gentle, non-judgmental environment where you can participate at your own pace and comfort level." },
  { q: 'How long do people typically attend?', a: "There's no set timeline — healing and growth happen at different paces for everyone. Some participants attend for a few months, others for a year or more. We encourage a minimum commitment of 4–6 sessions to give the therapeutic process time to work, but you can discontinue participation at any time based on your needs." },
  { q: 'Is financial assistance available?', a: "Yes! We offer sliding scale fees based on income because we believe financial barriers shouldn't prevent access to emotional wellness support. During registration, you can discuss fee adjustment options with our intake coordinator. Some insurance plans may also provide coverage — please check with your provider." },
  { q: 'What about confidentiality in a group setting?', a: "Confidentiality is paramount in all our programs. All participants agree to keep what's shared in the group confidential. Our facilitators are bound by professional ethics and legal requirements. We review confidentiality agreements at the start of participation and discuss healthy boundaries around sharing personal information." },
  { q: "Can I attend if I'm already in individual therapy?", a: "Absolutely! Many participants find that group programs complement their individual therapy work. Group settings offer unique benefits like peer support and normalized experiences that enhance individual therapeutic progress. We encourage open communication between your individual therapist and our facilitators (with your permission) for coordinated care." },
];
</script>

<style scoped lang="scss">
.event-detail { color: var(--c-text); }

/* Breadcrumbs as hero eyebrow */
.event-crumbs {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--s-2);
  font-family: var(--font-body);
  font-size: var(--fs-xs);
  text-transform: uppercase;
  letter-spacing: var(--ls-wide);
  font-weight: 700;
  color: var(--c-text-muted);

  a {
    color: var(--c-cobalt);
    text-decoration: none;
    &:hover { color: var(--c-ink); }
  }
  &__current { color: var(--c-ink); }
}

/* State */
.event-state {
  display: flex; flex-direction: column; align-items: center; gap: var(--s-4);
  text-align: center; color: var(--c-text-muted);
}

/* Split body */
.event-body {
  display: grid;
  gap: var(--s-8);

  @media (min-width: 980px) {
    grid-template-columns: minmax(0, 1.6fr) minmax(280px, 0.9fr);
    gap: var(--s-9);
    align-items: start;
  }
}

.event-magazine {
  display: flex;
  flex-direction: column;
  gap: var(--s-8);

  .magazine {
    h2 {
      font-family: var(--font-display);
      font-weight: 700;
      font-size: var(--fs-3xl);
      line-height: var(--lh-tight);
      color: var(--c-ink);
      margin: 0 0 var(--s-4);
    }
    p { margin: 0 0 var(--s-3); line-height: var(--lh-base); }
    ul { padding-left: 1.25rem; margin: var(--s-3) 0; }
    li { margin-bottom: var(--s-2); line-height: var(--lh-base); }
  }
  &__head {
    margin-bottom: var(--s-3);
    display: flex; flex-direction: column; gap: var(--s-2);
  }
}

/* Session agenda */
.event-agenda {
  list-style: none;
  margin: 0; padding: 0;
  display: flex; flex-direction: column; gap: var(--s-3);
}
.event-agenda__item {
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: var(--s-4);
  padding: var(--s-4);
  background: var(--c-paper);
  border: 2px solid var(--c-ink);
  border-radius: var(--r-md);
  box-shadow: var(--shadow-block-sm);

  @media (max-width: 600px) { grid-template-columns: 1fr; }
}
.event-agenda__time {
  font-family: var(--font-display);
  font-weight: 800;
  color: var(--c-cobalt);
  font-size: var(--fs-sm);
}
.event-agenda__copy h4 {
  font-family: var(--font-body);
  font-weight: 700;
  margin: 0 0 var(--s-1);
  color: var(--c-ink);
}
.event-agenda__copy p { margin: 0; color: var(--c-text-muted); }

/* FAQ accordion */
.event-faq__stack {
  display: flex; flex-direction: column; gap: var(--s-2);
}
.therapy-faq-item {
  /* Use AppCard variant=flat as container; toggle .active via script */
}
.therapy-faq-question {
  padding: var(--s-4) var(--s-5);
  font-family: var(--font-body);
  font-weight: 700;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--s-3);
  color: var(--c-ink);

  &:hover { background: var(--c-cream-2); }
}
.therapy-faq-toggle {
  transition: transform var(--dur-base) var(--ease-snap);
  color: var(--c-cobalt);
}
.therapy-faq-answer {
  padding: 0 var(--s-5) var(--s-5);
  color: var(--c-text-muted);
  line-height: var(--lh-base);
  display: none;
}
.therapy-faq-item.active .therapy-faq-answer { display: block; }
.therapy-faq-item.active .therapy-faq-toggle { transform: rotate(180deg); }

/* Supporting cards */
.event-supporting {
  display: flex;
  flex-direction: column;
  gap: var(--s-5);

  &__role {
    font-family: var(--font-body);
    color: var(--c-cobalt);
    font-weight: 600;
    margin: 0 0 var(--s-2);
  }
  &__features {
    list-style: none;
    padding: 0;
    margin: var(--s-3) 0;
    display: grid;
    gap: var(--s-2);
  }
  &__chips {
    display: flex; flex-wrap: wrap; gap: var(--s-2);
    margin-top: var(--s-3);
  }
  &__crisis {
    list-style: none;
    padding: 0;
    margin: var(--s-3) 0;
    display: flex; flex-direction: column; gap: var(--s-3);

    a {
      display: flex; flex-direction: column;
      padding: var(--s-3);
      border: 2px solid var(--c-ink);
      border-radius: var(--r-md);
      text-decoration: none;
      color: var(--c-ink);
      background: var(--c-cream);
      transition: transform var(--dur-base) var(--ease-snap);

      &:hover { transform: translate(-2px, -2px); box-shadow: 4px 4px 0 0 var(--c-fuchsia); }
      span { color: var(--c-text-muted); font-size: var(--fs-sm); }
    }
  }
  &__note {
    font-style: italic;
    color: var(--c-text-muted);
    margin: var(--s-2) 0 0;
  }
}
.chip {
  display: inline-flex;
  align-items: center;
  gap: var(--s-1);
  font-family: var(--font-body);
  font-size: var(--fs-xs);
  text-transform: uppercase;
  letter-spacing: var(--ls-wide);
  font-weight: 700;
  padding: var(--s-1) var(--s-3);
  border: 2px solid var(--c-ink);
  border-radius: var(--r-pill);
  background: var(--c-cream-2);
  color: var(--c-ink);

  :deep(svg) { color: var(--c-cobalt); }
}

/* Map */
.event-map {
  width: 100%;
  height: 220px;
  border: 2px solid var(--c-ink);
  border-radius: var(--r-md);
  overflow: hidden;
  margin: var(--s-4) 0;
  background: var(--c-cream-2);
  display: flex; align-items: center; justify-content: center;

  :deep(iframe) { border: 0; width: 100%; height: 100%; }

  &__placeholder {
    text-align: center; color: var(--c-text-muted);
    p { margin: 0; font-size: var(--fs-sm); }
  }
}

/* Right: ticket-stub */
.event-aside {
  @media (min-width: 980px) { position: sticky; top: calc(80px + var(--s-4)); align-self: start; }
}
.event-ticket {
  &__sub {
    font-family: var(--font-body);
    font-size: var(--fs-sm);
    color: var(--c-text-muted);
    margin: 0 0 var(--s-3);
  }
  &__meta {
    list-style: none;
    padding: 0;
    margin: var(--s-3) 0;
    display: flex; flex-direction: column; gap: var(--s-3);

    li {
      display: grid;
      grid-template-columns: 28px 1fr;
      gap: var(--s-3);
      align-items: start;
    }
    span { font-size: 1.25rem; line-height: 1.2; }
    .event-ticket__icon { color: var(--c-cobalt); margin-top: 2px; }
    div { display: flex; flex-direction: column; gap: 2px; }
    b {
      font-family: var(--font-body);
      font-size: var(--fs-xs);
      text-transform: uppercase;
      letter-spacing: var(--ls-wide);
      color: var(--c-text-muted);
      font-weight: 700;
    }
    em {
      font-style: normal;
      color: var(--c-ink);
      font-weight: 600;
    }
  }
  &__features {
    list-style: none;
    padding: 0;
    margin: var(--s-4) 0 0;
    display: flex; flex-direction: column; gap: var(--s-2);

    li {
      display: flex;
      align-items: center;
      gap: var(--s-2);
      color: var(--c-text);
      font-size: var(--fs-sm);
      :deep(svg) { color: var(--c-fuchsia); flex-shrink: 0; }
    }
  }
  &__safety {
    margin-top: var(--s-4);
    padding: var(--s-3) var(--s-4);
    background: var(--c-mint);
    border: 2px solid var(--c-ink);
    border-radius: var(--r-md);

    strong {
      display: inline-flex;
      align-items: center;
      gap: var(--s-1);
      color: var(--c-ink);
      margin-bottom: var(--s-1);
      font-family: var(--font-body);
    }
    p {
      margin: 0;
      color: var(--c-ink);
      font-size: var(--fs-sm);
      line-height: var(--lh-base);
    }
  }
}

/* CTA */
.event-cta {
  text-align: center;
  color: var(--c-cream);
  display: flex;
  flex-direction: column;
  gap: var(--s-3);
  align-items: center;

  &__title {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: clamp(var(--fs-3xl), 5vw, var(--fs-5xl));
    line-height: var(--lh-tight);
    color: var(--c-cream);
    margin: 0;
  }
  &__lede {
    color: var(--c-cream);
    opacity: 0.85;
    max-width: 60ch;
    margin: 0;
  }
  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--s-3);
    justify-content: center;
    margin-top: var(--s-2);
  }
}

/* Observer-driven fade */
.fade-in {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 600ms var(--ease-out), transform 600ms var(--ease-out);
  &.visible { opacity: 1; transform: none; }

  @media (prefers-reduced-motion: reduce) {
    opacity: 1; transform: none; transition: none;
  }
}
</style>
