<script setup lang="ts">
import { onMounted } from 'vue';

onMounted(() => {
  // Image rotation for hero section
  let currentImageIndex = 0;
  const heroImages = document.querySelectorAll('.hero-image');

  function rotateHeroImages() {
    if (heroImages.length > 1) {
      heroImages[currentImageIndex]?.classList.remove('active');
      currentImageIndex = (currentImageIndex + 1) % heroImages.length;
      heroImages[currentImageIndex]?.classList.add('active');
    }
  }

  // Start image rotation after 3 seconds, then every 6 seconds (slower for calming effect)
  setTimeout(() => {
    setInterval(rotateHeroImages, 6000);
  }, 3000);

  // Testimonial rotation
  let currentTestimonialIndex = 0;
  const testimonials = document.querySelectorAll('.testimonial-item');

  function rotateTestimonials() {
    if (testimonials.length > 1) {
      testimonials[currentTestimonialIndex]?.classList.remove('active');
      currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonials.length;
      testimonials[currentTestimonialIndex]?.classList.add('active');
    }
  }

  // Start testimonial rotation
  setTimeout(() => {
    setInterval(rotateTestimonials, 8000);
  }, 2000);

  // Smooth scroll animation for fade-in elements
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

  // Observe all fade-in elements
  document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
  });

  // Header scroll effect
  window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
      if (header) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px var(--shadow-light)';
      }
    } else {
      if (header) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
      }
    }
  });
});
</script>

<template>
  <main>
    <!-- Hero Section -->
    <section class="hero" id="home">
      <div class="hero-content">
        <div class="hero-text">
          <div class="hero-badge">Trusted by 10,000+ people</div>
          <h1>Your journey to emotional wellness starts here</h1>
          <p>Professional guidance and proven strategies to help you navigate life's challenges, build resilience, and achieve lasting positive change.</p>
          <div class="hero-cta">
            <router-link to="/events" class="cta-primary">Start Your Journey</router-link>
            <router-link to="/about" class="cta-secondary">Learn How It Works</router-link>
          </div>
          <div class="trust-indicators">
            <div class="trust-item">
              <span class="trust-icon">🔒</span>
              <span>Confidential & Secure</span>
            </div>
            <div class="trust-item">
              <span class="trust-icon">👨‍⚕️</span>
              <span>Licensed Professionals</span>
            </div>
            <div class="trust-item">
              <span class="trust-icon">⭐</span>
              <span>4.9/5 Rating</span>
            </div>
          </div>
        </div>
        <div class="hero-visual">
          <div class="hero-images">
            <img src="/andrej-lisakov-Stdn0PNUyHM-unsplash.jpg" alt="Happy client achieving goals" class="hero-image active">
            <img src="/fortytwo-1xMG-yqR2GM-unsplash.jpg" alt="Success and motivation" class="hero-image">
            <img src="/hrant-khachatryan-V9sHuZ11lmk-unsplash.jpg" alt="Goal achievement celebration" class="hero-image">
          </div>
          <div class="floating-elements">
            <div class="float-element float-1">💚</div>
            <div class="float-element float-2">🌱</div>
            <div class="float-element float-3">✨</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Client Faces Section -->
    <section class="client-faces fade-in">
      <div class="container">
        <h3>Join thousands who found their path to wellness</h3>
        <div class="faces-grid">
          <div class="face-item">
            <div class="face-placeholder">
              <span>👩‍💼</span>
            </div>
            <p>"Life-changing experience"</p>
          </div>
          <div class="face-item">
            <div class="face-placeholder">
              <span>👨‍🎓</span>
            </div>
            <p>"Finally found clarity"</p>
          </div>
          <div class="face-item">
            <div class="face-placeholder">
              <span>👩‍🏫</span>
            </div>
            <p>"Overcame my anxiety"</p>
          </div>
          <div class="face-item">
            <div class="face-placeholder">
              <span>👨‍💻</span>
            </div>
            <p>"Built lasting confidence"</p>
          </div>
          <div class="face-item">
            <div class="face-placeholder">
              <span>👩‍⚕️</span>
            </div>
            <p>"Transformed my mindset"</p>
          </div>
          <div class="face-item">
            <div class="face-placeholder">
              <span>👨‍🎨</span>
            </div>
            <p>"Found my purpose"</p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="how-it-works fade-in">
      <div class="container">
        <h2 class="section-title">How Getting There Works</h2>
        <div class="steps-grid">
          <div class="step-card">
            <div class="step-number">1</div>
            <div class="step-icon">📋</div>
            <h3>Assessment</h3>
            <p>Take our brief questionnaire to help us understand your goals and current challenges.</p>
          </div>
          <div class="step-card">
            <div class="step-number">2</div>
            <div class="step-icon">🤝</div>
            <h3>Personalized Plan</h3>
            <p>Receive a customized roadmap with strategies tailored to your specific needs and situation.</p>
          </div>
          <div class="step-card">
            <div class="step-number">3</div>
            <div class="step-icon">📈</div>
            <h3>Progress Together</h3>
            <p>Work through your plan with ongoing support, resources, and regular check-ins to track progress.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Services Section -->
    <section class="services" id="services">
      <div class="container">
        <h2 class="section-title fade-in">Ways We Can Help</h2>
        <div class="services-grid">
          <div class="service-card fade-in">
            <div class="service-icon">💭</div>
            <h3>Mindset Coaching</h3>
            <p>Transform limiting beliefs and develop a growth mindset that empowers you to overcome obstacles and achieve your goals.</p>
            <a href="/about" class="service-link">Learn More →</a>
          </div>
          <div class="service-card fade-in">
            <div class="service-icon">🎯</div>
            <h3>Goal Setting</h3>
            <p>Create clear, actionable goals with proven frameworks that turn your dreams into achievable milestones.</p>
            <a href="/about" class="service-link">Learn More →</a>
          </div>
          <div class="service-card fade-in">
            <div class="service-icon">🧠</div>
            <h3>Emotional Resilience</h3>
            <p>Build the mental strength to navigate challenges, manage stress, and bounce back from setbacks with confidence.</p>
            <a href="/about" class="service-link">Learn More →</a>
          </div>
          <div class="service-card fade-in">
            <div class="service-icon">🌱</div>
            <h3>Personal Growth</h3>
            <p>Discover your authentic self and develop the skills needed for continuous personal and professional development.</p>
            <a href="/about" class="service-link">Learn More →</a>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="testimonials fade-in">
      <div class="container">
        <h2 class="section-title">What Our Clients Say</h2>
        <div class="testimonials-container">
          <div class="testimonial-item active">
            <div class="testimonial-content">
              <div class="quote-mark">"</div>
              <p>"Getting There helped me break through years of self-doubt. The personalized approach and ongoing support made all the difference in my journey to emotional wellness."</p>
              <div class="testimonial-author">
                <div class="author-avatar">👩‍💼</div>
                <div class="author-info">
                  <h4>Sarah M.</h4>
                  <span>Marketing Director</span>
                </div>
              </div>
            </div>
          </div>
          <div class="testimonial-item">
            <div class="testimonial-content">
              <div class="quote-mark">"</div>
              <p>"The strategies I learned transformed how I handle stress and set goals. I finally feel in control of my life and confident about my future."</p>
              <div class="testimonial-author">
                <div class="author-avatar">👨‍🎓</div>
                <div class="author-info">
                  <h4>Michael R.</h4>
                  <span>Graduate Student</span>
                </div>
              </div>
            </div>
          </div>
          <div class="testimonial-item">
            <div class="testimonial-content">
              <div class="quote-mark">"</div>
              <p>"I was struggling with anxiety and lack of direction. The supportive environment and practical tools helped me build lasting confidence and find my purpose."</p>
              <div class="testimonial-author">
                <div class="author-avatar">👩‍🏫</div>
                <div class="author-info">
                  <h4>Lisa K.</h4>
                  <span>Teacher</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Resources Preview Section -->
    <section class="resources-preview">
      <div class="container">
        <div class="resources-content">
          <div class="resources-text fade-in">
            <h2>Explore Our Resources</h2>
            <div class="resource-item">
              <div class="resource-icon">🎥</div>
              <span><strong>Video Library</strong> - Expert-led sessions on mental wellness topics</span>
            </div>
            <div class="resource-item">
              <div class="resource-icon">📚</div>
              <span><strong>Guided Workbooks</strong> - Step-by-step exercises for personal growth</span>
            </div>
            <div class="resource-item">
              <div class="resource-icon">🎪</div>
              <span><strong>Live Workshops</strong> - Interactive group sessions and support</span>
            </div>
            <div class="resource-item">
              <div class="resource-icon">📝</div>
              <span><strong>Daily Insights</strong> - Practical tips for emotional wellness</span>
            </div>
            <router-link to="/videos" class="resources-cta">Explore Resources</router-link>
          </div>
          <div class="resources-visual fade-in">
            <div class="visual-element"></div>
            <div class="visual-element"></div>
            <div class="visual-element"></div>
            <div class="visual-text">
              <h3>92% Success Rate</h3>
              <p>Evidence-based approaches</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content fade-in">
          <h2>Ready to start your wellness journey?</h2>
          <p>Take the first step towards emotional wellness and personal growth. Our compassionate team is here to support you every step of the way.</p>
          <div class="cta-buttons">
            <router-link to="/events" class="cta-primary">Begin Your Journey</router-link>
            <a href="mailto:support@gthere.net" class="cta-secondary">Talk to Someone Today</a>
          </div>
          <div class="cta-assurance">
            <span>🔒 Completely confidential</span>
            <span>💙 Compassionate support</span>
            <span>🎯 Personalized approach</span>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
/* Hero Section */
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: var(--gradient-neutral);
  position: relative;
  overflow: hidden;
  padding-top: 80px;
}

.hero::before {
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

.hero-content {
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

.hero-text {
  color: var(--text-dark);
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

.hero h1 {
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 700;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  color: var(--text-dark);
  font-family: 'Playfair Display', serif;
}

.hero p {
  font-size: 1.1rem;
  margin-bottom: 2rem;
  line-height: 1.6;
  color: var(--text-light);
}

.hero-cta {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.cta-primary {
  background: var(--primary-color);
  color: white;
  padding: 1rem 2rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px var(--shadow-light);
}

.cta-primary:hover {
  background: var(--secondary-color);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px var(--shadow-medium);
}

.cta-secondary {
  background: transparent;
  color: var(--primary-color);
  padding: 1rem 2rem;
  border: 2px solid var(--primary-color);
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.cta-secondary:hover {
  background: var(--primary-color);
  color: white;
}

.trust-indicators {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.trust-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-light);
  font-size: 0.9rem;
}

.trust-icon {
  font-size: 1.1rem;
}

.hero-visual {
  position: relative;
  height: 500px;
}

.hero-images {
  position: relative;
  height: 100%;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px var(--shadow-medium);
}

.hero-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 20px;
  opacity: 0;
  transition: opacity 2s ease-in-out;
}

.hero-image.active {
  opacity: 1;
}

.floating-elements {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.float-element {
  position: absolute;
  font-size: 2rem;
  animation: gentleFloat 6s ease-in-out infinite;
}

.float-1 {
  top: 10%;
  right: 10%;
  animation-delay: 0s;
}

.float-2 {
  bottom: 20%;
  left: 10%;
  animation-delay: 2s;
}

.float-3 {
  top: 60%;
  right: 20%;
  animation-delay: 4s;
}

@keyframes gentleFloat {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

/* Client Faces Section */
.client-faces {
  padding: 4rem 0;
  background: white;
  text-align: center;
}

.client-faces h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 2rem;
  color: var(--text-dark);
}

.faces-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.face-item {
  text-align: center;
}

.face-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--bg-sage);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin: 0 auto 1rem;
  border: 3px solid var(--primary-color);
  transition: all 0.3s ease;
}

.face-placeholder:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 25px var(--shadow-light);
}

.face-item p {
  font-size: 0.9rem;
  color: var(--text-light);
  font-style: italic;
}

/* How It Works Section */
.how-it-works {
  padding: 6rem 0;
  background: var(--bg-light);
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.step-card {
  background: white;
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 8px 30px var(--shadow-light);
  text-align: center;
  position: relative;
  transition: all 0.3s ease;
  border: 1px solid var(--border-light);
}

.step-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px var(--shadow-medium);
}

.step-number {
  position: absolute;
  top: -15px;
  left: 2rem;
  width: 30px;
  height: 30px;
  background: var(--primary-color);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;
}

.step-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.step-card h3 {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text-dark);
}

.step-card p {
  color: var(--text-light);
  line-height: 1.6;
}

/* Services Section */
.services {
  padding: 6rem 0;
  background: white;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 3rem;
  color: var(--text-dark);
  font-family: 'Playfair Display', serif;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.service-card {
  background: white;
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 8px 30px var(--shadow-light);
  transition: all 0.3s ease;
  text-align: center;
  border: 1px solid var(--border-light);
}

.service-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px var(--shadow-medium);
}

.service-icon {
  font-size: 3rem;
  margin-bottom: 1.5rem;
  display: block;
}

.service-card h3 {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text-dark);
}

.service-card p {
  color: var(--text-light);
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.service-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.service-link:hover {
  color: var(--secondary-color);
}

/* Testimonials Section */
.testimonials {
  padding: 6rem 0;
  background: var(--bg-sage);
}

.testimonials-container {
  position: relative;
  max-width: 800px;
  margin: 0 auto;
  height: 300px;
}

.testimonial-item {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease;
}

.testimonial-item.active {
  opacity: 1;
  transform: translateY(0);
}

.testimonial-content {
  background: white;
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 15px 40px var(--shadow-light);
  text-align: center;
  position: relative;
}

.quote-mark {
  font-size: 4rem;
  color: var(--primary-color);
  opacity: 0.3;
  position: absolute;
  top: 1rem;
  left: 2rem;
  font-family: 'Playfair Display', serif;
}

.testimonial-content p {
  font-size: 1.1rem;
  line-height: 1.7;
  color: var(--text-dark);
  margin-bottom: 2rem;
  font-style: italic;
}

.testimonial-author {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.author-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--bg-sage);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  border: 2px solid var(--primary-color);
}

.author-info h4 {
  color: var(--text-dark);
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.author-info span {
  color: var(--text-light);
  font-size: 0.9rem;
}

/* Resources Preview Section */
.resources-preview {
  padding: 6rem 0;
  background: white;
}

.resources-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.resources-text h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: var(--text-dark);
  font-family: 'Playfair Display', serif;
}

.resource-item {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: var(--bg-light);
  border-radius: 15px;
  transition: all 0.3s ease;
  border: 1px solid var(--border-light);
}

.resource-item:hover {
  background: var(--bg-sage);
  transform: translateX(10px);
}

.resource-icon {
  width: 40px;
  height: 40px;
  background: var(--primary-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  color: white;
  font-size: 1.2rem;
}

.resources-cta {
  display: inline-block;
  background: var(--primary-color);
  color: white;
  padding: 1rem 2rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  margin-top: 1rem;
  box-shadow: 0 4px 15px var(--shadow-light);
}

.resources-cta:hover {
  background: var(--secondary-color);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px var(--shadow-medium);
}

.resources-visual {
  position: relative;
  height: 400px;
  background: var(--gradient);
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.visual-element {
  width: 150px;
  height: 150px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  position: absolute;
  animation: gentlePulse 4s ease-in-out infinite;
}

.visual-element:nth-child(2) {
  width: 100px;
  height: 100px;
  animation-delay: 1s;
}

.visual-element:nth-child(3) {
  width: 50px;
  height: 50px;
  animation-delay: 2s;
}

@keyframes gentlePulse {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.1); opacity: 0.3; }
}

.visual-text {
  color: white;
  text-align: center;
  z-index: 2;
  position: relative;
}

.visual-text h3 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.visual-text p {
  opacity: 0.9;
}

/* CTA Section */
.cta-section {
  padding: 6rem 0;
  background: var(--text-dark);
  color: white;
}

.cta-content {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.cta-section h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  font-family: 'Playfair Display', serif;
}

.cta-section p {
  font-size: 1.1rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  line-height: 1.6;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.cta-section .cta-primary {
  background: var(--accent-color);
}

.cta-section .cta-primary:hover {
  background: var(--warning-color);
}

.cta-section .cta-secondary {
  border-color: rgba(255, 255, 255, 0.5);
  color: rgba(255, 255, 255, 0.9);
}

.cta-section .cta-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: white;
  color: white;
}

.cta-assurance {
  display: flex;
  gap: 2rem;
  justify-content: center;
  flex-wrap: wrap;
  opacity: 0.8;
  font-size: 0.9rem;
}

/* Loading animation */
.fade-in {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease;
}

.fade-in.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .hero-content {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
  }

  .hero-visual {
    order: -1;
    height: 300px;
  }

  .hero-cta {
    justify-content: center;
  }

  .trust-indicators {
    justify-content: center;
  }

  .faces-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }

  .steps-grid {
    grid-template-columns: 1fr;
  }

  .resources-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }

  .cta-assurance {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
