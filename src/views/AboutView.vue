<script setup lang="ts">
import { onMounted, ref } from 'vue';

// State and data fetching
const hero = ref<any>(null);
const defaultStats = [
  { id: 1, name: 'Lives Transformed', statistic: 10000 },
  { id: 2, name: 'Years of Service', statistic: 15 },
  { id: 3, name: 'Client Satisfaction', statistic: 95 },
];

function getStatSuffix(s: { name: string }) {
  const name = (s?.name || '').toLowerCase();
  if (name.includes('satisfaction')) return '%';
  if (name.includes('years')) return '+';
  return '';
}

async function fetchHero() {
  try {
    const res = await fetch('https://getting-there-cms.onrender.com/api/about?populate=all');
    const json = await res.json();
    hero.value = json?.data?.hero || null;
  } catch (e) {
    console.error('Failed to load about hero', e);
  }
}

// Animation observers
onMounted(async () => {
  await fetchHero();
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

  // Observe all animated elements
  document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
    observer.observe(el);
  });

  // Counter animation for stats
  function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');

    counters.forEach(counter => {
      const el = counter as HTMLElement;
      const targetAttr = el.getAttribute('data-target') || '0';
      const target = parseInt(targetAttr.replace(/\D/g, ''));
      const suffix = el.getAttribute('data-suffix') || '';
      let current = 0;
      const increment = target / 50;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.textContent = target + suffix;
          clearInterval(timer);
        } else {
          counter.textContent = Math.ceil(current) + suffix;
        }
      }, 50);
    });
  }

  // Start counter animation when hero section is visible
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(animateCounters, 1000);
        heroObserver.disconnect();
      }
    });
  });

  const heroSection = document.querySelector('.about-hero');
  if (heroSection) {
    heroObserver.observe(heroSection);
  }
});
</script>

<template>
  <section class="about-hero">
    <div class="about-hero-content">
      <div class="hero-text">
        <div class="hero-badge">{{ (hero && hero.tag) || 'Trusted Mental Wellness Support' }}</div>
        <h1>{{ (hero && hero.title) || 'Compassionate guidance for lasting change' }}</h1>
        <p>{{ (hero && hero.description) || 'For over a decade, Getting There has been a beacon of hope for individuals seeking emotional wellness and personal growth. Our evidence-based approach, combined with genuine care, has helped thousands find their path to healing and happiness.' }}</p>

        <div class="hero-stats">
          <div class="stat-item" v-for="s in (hero && hero.stats ? hero.stats : defaultStats)" :key="s.id">
            <span class="stat-number" :data-target="s.statistic" :data-suffix="getStatSuffix(s)">0</span>
            <span class="stat-label">{{ s.name }}</span>
          </div>
        </div>
      </div>

      <div class="hero-visual">
        <div class="visual-circle"></div>
        <div class="visual-circle"></div>
        <div class="visual-circle"></div>
        <div class="visual-center">🌱</div>
      </div>
    </div>
  </section>

  <main class="about-content">

    <!-- Our Story Section -->
    <section class="section">
      <h2 class="section-title fade-in">How We Got Here</h2>
      <div class="story-content">
        <div class="story-text slide-in-left">
          <p>Getting There was founded on a simple yet profound belief: everyone deserves access to compassionate, effective mental health support. We began as a small practice in Colorado, born from Dr. Sue Nesbitt's vision to bridge the gap between traditional therapy and accessible wellness coaching.</p>

          <p>Our founder, Dr. Nesbitt, recognized that many people were struggling not with clinical mental illness, but with life transitions, goal achievement, and emotional resilience. Traditional therapy wasn't always the right fit, yet these individuals needed more than generic self-help resources.</p>

          <p>What started as weekend workshops in community centers has grown into a comprehensive wellness platform. Today, we serve thousands through our digital resources, in-person workshops, and personalized coaching programs. Our approach combines the rigor of clinical psychology with the accessibility of modern wellness practices.</p>

          <p>We remain committed to our founding principles: evidence-based methods, genuine compassion, and the belief that everyone has the capacity for positive change when given the right support and tools.</p>
        </div>
        <div class="story-visual slide-in-right">
          🧠
        </div>
      </div>
    </section>

    <!-- Mission Section -->
    <section class="section">
      <div class="mission-section fade-in">
        <h2 class="section-title">Our Mission & Values</h2>
        <p class="mission-text">
          To provide accessible, compassionate, and evidence-based support that empowers individuals to overcome challenges, build resilience, and create meaningful, fulfilling lives aligned with their deepest values.
        </p>

        <div class="mission-values">
          <div class="value-item">
            <div class="value-icon">🤝</div>
            <h3 class="value-title">Compassionate Care</h3>
            <p class="value-description">We approach every interaction with empathy, understanding, and genuine care for your wellbeing and unique journey.</p>
          </div>
          <div class="value-item">
            <div class="value-icon">🔬</div>
            <h3 class="value-title">Evidence-Based Methods</h3>
            <p class="value-description">Our approaches are grounded in scientific research from psychology, neuroscience, and positive psychology to ensure effectiveness.</p>
          </div>
          <div class="value-item">
            <div class="value-icon">🌍</div>
            <h3 class="value-title">Accessible Support</h3>
            <p class="value-description">We believe mental wellness support should be available to everyone, regardless of background, location, or circumstances.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Team Section -->
    <section class="section">
      <h2 class="section-title fade-in">Meet Our Team</h2>
      <div class="team-grid">
        <div class="team-member fade-in">
          <div class="member-avatar">👩‍⚕️</div>
          <h3 class="member-name">Dr. Sarah Mitchell</h3>
          <p class="member-role">Founder & Clinical Director</p>
          <div class="member-credentials">
            <span>PhD Psychology</span>
            <span>Licensed Clinical Psychologist</span>
          </div>
          <p class="member-bio">With over 20 years in clinical psychology and wellness coaching, Dr. Mitchell specializes in helping individuals navigate life transitions, build emotional resilience, and achieve meaningful goals. She's the author of several acclaimed books on mental wellness.</p>
          <div class="member-social">
            <a href="#" class="social-link">📧</a>
            <a href="#" class="social-link">💼</a>
            <a href="#" class="social-link">📚</a>
          </div>
        </div>

        <div class="team-member fade-in">
          <div class="member-avatar">👨‍💼</div>
          <h3 class="member-name">Michael Chen</h3>
          <p class="member-role">Senior Wellness Coach</p>
          <div class="member-credentials">
            <span>MA Counseling Psychology</span>
            <span>Certified Life Coach</span>
          </div>
          <p class="member-bio">Michael brings 15 years of experience in corporate wellness and executive coaching. He specializes in stress management, work-life balance, and helping professionals navigate career transitions while maintaining mental wellness.</p>
          <div class="member-social">
            <a href="#" class="social-link">📧</a>
            <a href="#" class="social-link">💼</a>
            <a href="#" class="social-link">🌐</a>
          </div>
        </div>

        <div class="team-member fade-in">
          <div class="member-avatar">👩‍🏫</div>
          <h3 class="member-name">Lisa Rodriguez</h3>
          <p class="member-role">Program Director & Therapist</p>
          <div class="member-credentials">
            <span>LCSW</span>
            <span>Trauma-Informed Care Specialist</span>
          </div>
          <p class="member-bio">Lisa oversees our program development and specializes in trauma-informed care and resilience building. Her background in social work and community mental health brings a unique perspective to our holistic approach.</p>
          <div class="member-social">
            <a href="#" class="social-link">📧</a>
            <a href="#" class="social-link">💼</a>
            <a href="#" class="social-link">🎓</a>
          </div>
        </div>
      </div>
    </section>

    <!-- Our Approach Section -->
    <section class="section">
      <h2 class="section-title fade-in">Our Therapeutic Approach</h2>
      <div class="approach-grid">
        <div class="approach-item fade-in">
          <div class="approach-number">01</div>
          <h3 class="approach-title">Holistic Assessment</h3>
          <p class="approach-description">We begin by understanding your complete picture - mental, emotional, social, and physical wellbeing. Our comprehensive assessment helps us create a personalized approach that addresses your unique needs and circumstances.</p>
        </div>

        <div class="approach-item fade-in">
          <div class="approach-number">02</div>
          <h3 class="approach-title">Collaborative Planning</h3>
          <p class="approach-description">Together, we develop a tailored wellness plan that aligns with your goals, values, and lifestyle. You're always in control of your journey, with our team providing guidance, support, and evidence-based strategies.</p>
        </div>

        <div class="approach-item fade-in">
          <div class="approach-number">03</div>
          <h3 class="approach-title">Skill Building</h3>
          <p class="approach-description">We focus on teaching practical, research-backed techniques for emotional regulation, stress management, communication, and resilience. These skills become lifelong tools for navigating challenges.</p>
        </div>

        <div class="approach-item fade-in">
          <div class="approach-number">04</div>
          <h3 class="approach-title">Ongoing Support</h3>
          <p class="approach-description">Healing and growth don't happen overnight. We provide continuous support through check-ins, resource access, and community connection to ensure lasting positive change.</p>
        </div>
      </div>
    </section>

    <!-- Credentials Section -->
    <section class="section">
      <div class="credentials-section fade-in">
        <h2 class="section-title">Professional Standards & Ethics</h2>
        <div class="credentials-grid">
          <div class="credential-item">
            <div class="credential-icon">🛡️</div>
            <h3>Licensed & Accredited</h3>
            <p>All our clinical staff hold proper licenses and certifications. We maintain active memberships in professional associations and adhere to strict ethical guidelines.</p>
          </div>
          <div class="credential-item">
            <div class="credential-icon">🔒</div>
            <h3>Privacy & Confidentiality</h3>
            <p>We are HIPAA compliant and take your privacy seriously. All interactions are confidential, and your personal information is protected with industry-standard security measures.</p>
          </div>
          <div class="credential-item">
            <div class="credential-icon">📚</div>
            <h3>Continuing Education</h3>
            <p>Our team regularly participates in ongoing training and education to stay current with the latest research and best practices in mental health and wellness.</p>
          </div>
          <div class="credential-item">
            <div class="credential-icon">🤝</div>
            <h3>Collaborative Care</h3>
            <p>We work closely with other healthcare providers when appropriate and can provide referrals to specialized services when needed.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <div class="cta-section fade-in">
      <h2>Ready to begin your wellness journey?</h2>
      <p>Take the first step towards emotional wellness and personal growth. Our compassionate team is here to support you with evidence-based approaches and genuine care.</p>
      <div class="cta-buttons">
        <router-link to="/events" class="cta-btn">Explore Our Programs</router-link>
        <a href="mailto:support@gthere.net" class="cta-btn secondary">Get Support Today</a>
      </div>
    </div>
  </main>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Hero Section */
.about-hero {
  padding: 8rem 0 4rem;
  background: var(--gradient-neutral);
  color: var(--text-dark);
  position: relative;
  overflow: hidden;
}

.about-hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="%234a7c59" fill-opacity="0.05"><circle cx="30" cy="30" r="2"/></g></svg>');
  animation: float 30s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(180deg); }
}

.about-hero-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  position: relative;
  z-index: 2;
}

.hero-badge {
  display: inline-block;
  background: var(--bg-sage);
  color: var(--primary-color);
  padding: 0.5rem 1rem;
  border-radius: 25px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  border: 1px solid var(--border-light);
}

.hero-text h1 {
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 700;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  color: var(--text-dark);
  font-family: 'Playfair Display', serif;
}

.hero-text p {
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 2rem;
  line-height: 1.6;
  color: var(--text-light);
}

.hero-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.stat-item {
  text-align: center;
  padding: 1.5rem;
  background: white;
  border-radius: 15px;
  box-shadow: 0 8px 25px var(--shadow-light);
  border: 1px solid var(--border-light);
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 800;
  display: block;
  margin-bottom: 0.5rem;
  color: var(--primary-color);
}

.stat-label {
  font-size: 0.9rem;
  color: var(--text-light);
  font-weight: 500;
}

.hero-visual {
  position: relative;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.visual-circle {
  position: absolute;
  border: 2px solid var(--primary-color);
  opacity: 0.3;
  border-radius: 50%;
  animation: gentlePulse 6s ease-in-out infinite;
}

.visual-circle:nth-child(1) {
  width: 300px;
  height: 300px;
  animation-delay: 0s;
}

.visual-circle:nth-child(2) {
  width: 200px;
  height: 200px;
  animation-delay: 2s;
}

.visual-circle:nth-child(3) {
  width: 100px;
  height: 100px;
  animation-delay: 4s;
}

.visual-center {
  font-size: 4rem;
  position: relative;
  z-index: 3;
}

@keyframes gentlePulse {
  0%, 100% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.05); opacity: 0.1; }
}

/* Main Content */
.about-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
}

.section {
  margin-bottom: 6rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 3rem;
  color: var(--text-dark);
  font-family: 'Playfair Display', serif;
}

/* Our Story Section */
.story-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.story-text {
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--text-light);
}

.story-text p {
  margin-bottom: 1.5rem;
}

.story-visual {
  background: var(--gradient);
  height: 400px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 5rem;
  position: relative;
  overflow: hidden;
  box-shadow: 0 15px 40px var(--shadow-medium);
}

.story-visual::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(1px);
}

/* Mission Section */
.mission-section {
  background: white;
  padding: 4rem;
  border-radius: 30px;
  box-shadow: 0 20px 60px var(--shadow-light);
  text-align: center;
  border: 1px solid var(--border-light);
}

.mission-text {
  font-size: 1.3rem;
  line-height: 1.7;
  color: var(--text-light);
  max-width: 800px;
  margin: 0 auto 2rem;
}

.mission-values {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 3rem;
}

.value-item {
  padding: 2rem;
  background: var(--bg-light);
  border-radius: 15px;
  transition: all 0.3s ease;
  border: 1px solid var(--border-light);
}

.value-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px var(--shadow-light);
  background: var(--bg-sage);
}

.value-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.value-title {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text-dark);
}

.value-description {
  color: var(--text-light);
  line-height: 1.5;
}

/* Team Section */
.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.team-member {
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  text-align: center;
  box-shadow: 0 10px 30px var(--shadow-light);
  transition: all 0.3s ease;
  border: 1px solid var(--border-light);
}

.team-member:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 50px var(--shadow-medium);
}

.member-avatar {
  width: 120px;
  height: 120px;
  background: var(--bg-sage);
  border-radius: 50%;
  margin: 0 auto 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  border: 3px solid var(--primary-color);
}

.member-name {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--text-dark);
}

.member-role {
  color: var(--primary-color);
  font-weight: 600;
  margin-bottom: 1rem;
}

.member-credentials {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.member-credentials span {
  background: var(--bg-light);
  color: var(--text-light);
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
  border: 1px solid var(--border-light);
}

.member-bio {
  color: var(--text-light);
  line-height: 1.6;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.member-social {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.social-link {
  width: 40px;
  height: 40px;
  background: var(--bg-light);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 1px solid var(--border-light);
}

.social-link:hover {
  background: var(--primary-color);
  color: white;
  transform: translateY(-2px);
}

/* Approach Section */
.approach-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 3rem;
}

.approach-item {
  background: white;
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px var(--shadow-light);
  position: relative;
  overflow: hidden;
  border: 1px solid var(--border-light);
}

.approach-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: var(--gradient);
}

.approach-number {
  font-size: 3rem;
  font-weight: 800;
  color: var(--primary-color);
  opacity: 0.2;
  position: absolute;
  top: 1rem;
  right: 2rem;
}

.approach-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text-dark);
}

.approach-description {
  color: var(--text-light);
  line-height: 1.6;
}

/* Credentials Section */
.credentials-section {
  background: var(--bg-light);
  padding: 4rem;
  border-radius: 30px;
  border: 1px solid var(--border-light);
}

.credentials-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-top: 2rem;
}

.credential-item {
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 8px 25px var(--shadow-light);
  border: 1px solid var(--border-light);
}

.credential-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  display: block;
}

.credential-item h3 {
  color: var(--text-dark);
  font-weight: 700;
  margin-bottom: 1rem;
}

.credential-item p {
  color: var(--text-light);
  line-height: 1.6;
}

/* CTA Section */
.cta-section {
  background: var(--primary-color);
  color: white;
  padding: 4rem;
  border-radius: 30px;
  text-align: center;
  margin-top: 4rem;
  box-shadow: 0 15px 40px var(--shadow-medium);
}

.cta-section h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  font-family: 'Playfair Display', serif;
}

.cta-section p {
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.cta-btn {
  background: var(--accent-color);
  color: white;
  padding: 1rem 2rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 700;
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px rgba(244, 162, 97, 0.3);
}

.cta-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(244, 162, 97, 0.4);
}

.cta-btn.secondary {
  background: transparent;
  border: 2px solid white;
  box-shadow: none;
}

.cta-btn.secondary:hover {
  background: white;
  color: var(--primary-color);
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .about-hero-content {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
  }

  .hero-stats {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .story-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .mission-values {
    grid-template-columns: 1fr;
  }

  .approach-grid {
    grid-template-columns: 1fr;
  }

  .credentials-grid {
    grid-template-columns: 1fr;
  }

  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }

  .section-title {
    font-size: 2rem;
  }

  .hero-text h1 {
    font-size: 2.5rem;
  }
}

/* Animations */
.fade-in {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease;
}

.fade-in.visible {
  opacity: 1;
  transform: translateY(0);
}

.slide-in-left {
  opacity: 0;
  transform: translateX(-50px);
  transition: all 0.8s ease;
}

.slide-in-left.visible {
  opacity: 1;
  transform: translateX(0);
}

.slide-in-right {
  opacity: 0;
  transform: translateX(50px);
  transition: all 0.8s ease;
}

.slide-in-right.visible {
  opacity: 1;
  transform: translateX(0);
}
</style>
