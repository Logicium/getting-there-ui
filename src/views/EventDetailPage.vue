<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const eventId = ref(route.params.id);

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
  const event = {
    title: 'Anxiety Support Circle',
    start: '2024-04-15T18:00:00',
    end: '2024-04-15T19:30:00',
    location: 'Denver Wellness Center, 1234 Healing Way, Denver, CO 80202',
    description: 'A gentle, supportive group environment for anxiety management and connection with others on similar journeys.'
  };

  // Create Google Calendar URL
  const startDate = event.start.replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const endDate = event.end.replace(/[-:]/g, '').replace(/\.\d{3}/, '');

  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDate}/${endDate}&location=${encodeURIComponent(event.location)}&details=${encodeURIComponent(event.description)}`;

  // Create Outlook URL
  const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(event.title)}&startdt=${event.start}&enddt=${event.end}&location=${encodeURIComponent(event.location)}&body=${encodeURIComponent(event.description)}`;

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
  const mapContainer = document.getElementById('mapContainer');
  if (mapContainer) {
    mapContainer.innerHTML = `
            <div style="width: 100%; height: 100%; background: var(--gradient); display: flex; align-items: center; justify-content: center; color: white; text-align: center; border-radius: 12px;">
                <div>
                    <div style="font-size: 3rem; margin-bottom: 1rem;">📍</div>
                    <div style="font-weight: 600;">Denver Wellness Center</div>
                    <div style="opacity: 0.9; font-size: 0.9rem;">1234 Healing Way, Denver, CO</div>
                </div>
            </div>
        `;
  }
}

// Fade-in animation
onMounted(() => {
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

  // Initialize
  initMap();
});
</script>

<template>
  <section class="therapy-breadcrumb">
    <div class="therapy-breadcrumb-content">
      <router-link to="/">Home</router-link> → <router-link to="/events">Healing Programs</router-link> → Anxiety Support Circle
    </div>
  </section>

  <section class="therapy-event-hero">
    <div class="therapy-event-hero-content">
      <div class="therapy-event-main-info">
        <div class="therapy-event-status-badge">Open Registration - Safe Space</div>
        <h1>Anxiety Support Circle</h1>
        <p class="therapy-event-subtitle">A gentle, supportive group environment where you can learn practical anxiety management techniques while connecting with others who understand your journey. Led by licensed therapists in a judgment-free space.</p>

        <div class="therapy-event-quick-info">
          <div class="therapy-quick-info-item">
            <div class="therapy-quick-info-icon">📅</div>
            <div class="therapy-quick-info-text">
              <h4>Schedule</h4>
              <p>Every Tuesday, Starting April 15<br>Ongoing weekly sessions</p>
            </div>
          </div>
          <div class="therapy-quick-info-item">
            <div class="therapy-quick-info-icon">📍</div>
            <div class="therapy-quick-info-text">
              <h4>Location</h4>
              <p>Denver Wellness Center<br>Private, comfortable setting</p>
            </div>
          </div>
          <div class="therapy-quick-info-item">
            <div class="therapy-quick-info-icon">⏰</div>
            <div class="therapy-quick-info-text">
              <h4>Time</h4>
              <p>6:00 PM - 7:30 PM<br>90 minutes per session</p>
            </div>
          </div>
          <div class="therapy-quick-info-item">
            <div class="therapy-quick-info-icon">👥</div>
            <div class="therapy-quick-info-text">
              <h4>Group Size</h4>
              <p>8-10 participants maximum<br>Intimate, supportive environment</p>
            </div>
          </div>
        </div>
      </div>

      <div class="therapy-registration-card">
        <div class="therapy-price-section">
          <div class="therapy-price">$60</div>
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

  <main class="therapy-event-content">
    <div class="therapy-main-content">
      <div class="therapy-content-section fade-in">
        <h2>About This Healing Circle</h2>
        <p>Our Anxiety Support Circle provides a compassionate, trauma-informed space where individuals can come together to learn, share, and heal. This ongoing group combines evidence-based therapeutic approaches with peer support to help participants develop practical tools for managing anxiety while building meaningful connections.</p>

        <p>Led by licensed mental health professionals, each session focuses on different aspects of anxiety management, from understanding triggers and physical symptoms to developing coping strategies and building resilience. The group provides a non-judgmental environment where participants can share their experiences and learn from others on similar journeys.</p>

        <p>Whether you're dealing with generalized anxiety, social anxiety, panic symptoms, or stress-related concerns, this group offers support, education, and hope for your healing journey.</p>
      </div>

      <div class="therapy-content-section fade-in">
        <h2>What to Expect in Each Session</h2>
        <ul class="therapy-session-agenda">
          <li class="therapy-agenda-item">
            <div class="therapy-agenda-time">6:00 PM</div>
            <div class="therapy-agenda-content">
              <h4>Welcome & Check-In Circle</h4>
              <p>Gentle opening where each member can share how they're feeling and what they'd like from the session</p>
            </div>
          </li>
          <li class="therapy-agenda-item">
            <div class="therapy-agenda-time">6:15 PM</div>
            <div class="therapy-agenda-content">
              <h4>Mindfulness & Grounding</h4>
              <p>Brief guided meditation or grounding exercise to center the group and create a safe space</p>
            </div>
          </li>
          <li class="therapy-agenda-item">
            <div class="therapy-agenda-time">6:30 PM</div>
            <div class="therapy-agenda-content">
              <h4>Educational Component</h4>
              <p>Learn about anxiety, coping strategies, or therapeutic techniques in an accessible, supportive way</p>
            </div>
          </li>
          <li class="therapy-agenda-item">
            <div class="therapy-agenda-time">7:00 PM</div>
            <div class="therapy-agenda-content">
              <h4>Group Sharing & Support</h4>
              <p>Facilitated discussion where members can share experiences, challenges, and successes</p>
            </div>
          </li>
          <li class="therapy-agenda-item">
            <div class="therapy-agenda-time">7:20 PM</div>
            <div class="therapy-agenda-content">
              <h4>Closing & Intention Setting</h4>
              <p>Gentle close with takeaways and intention setting for the week ahead</p>
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

      <div class="therapy-location-section fade-in">
        <h3>🏥 Healing Environment</h3>
        <div class="therapy-venue-info">
          <h4>Denver Wellness Center</h4>
          <p>1234 Healing Way<br>Denver, CO 80202</p>
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

        <a href="https://www.google.com/maps/dir//Denver+Wellness+Center,+1234+Healing+Way,+Denver,+CO+80202" target="_blank" class="therapy-directions-btn">Get Directions</a>
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