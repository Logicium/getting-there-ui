<script setup lang="ts">
// Script for animations and scroll effects
import { onMounted } from 'vue';

onMounted(() => {
  // Image rotation for hero section
  let currentImageIndex = 0;
  const heroImages = document.querySelectorAll('.hero-image');

  function rotateHeroImages() {
    heroImages[currentImageIndex].classList.remove('active');
    currentImageIndex = (currentImageIndex + 1) % heroImages.length;
    heroImages[currentImageIndex].classList.add('active');
  }

  // Start image rotation after 3 seconds, then every 5 seconds
  setTimeout(() => {
    setInterval(rotateHeroImages, 5000);
  }, 3000);

  // Smooth scroll animation for fade-in elements
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
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
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
      }
    } else {
      if (header) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
      }
    }
  });

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});
</script>

<template>
  <main>
    <section class="hero" id="home">
      <div class="hero-content">
        <div class="hero-text">
          <h1>Getting There</h1>
          <p>Strategies & Resources for Setting & Reaching Goals of all Sizes</p>
          <a href="#services" class="cta-button">Start Your Journey</a>
        </div>
        <div class="hero-images">
          <img src="/andrej-lisakov-Stdn0PNUyHM-unsplash.jpg" alt="People achieving goals" class="hero-image active">
          <img src="/fortytwo-1xMG-yqR2GM-unsplash.jpg" alt="Success and motivation" class="hero-image">
          <img src="/hrant-khachatryan-V9sHuZ11lmk-unsplash.jpg" alt="Goal achievement" class="hero-image">
        </div>
      </div>
    </section>

    <section class="services" id="services">
      <div class="container">
        <h2 class="section-title fade-in">What We Offer</h2>
        <div class="services-grid">
          <div class="service-card fade-in">
            <div class="service-icon">💡</div>
            <h3>Ideas</h3>
            <p>Fresh perspectives and innovative approaches to help you think differently about your goals and challenges.</p>
          </div>
          <div class="service-card fade-in">
            <div class="service-icon">📚</div>
            <h3>Information</h3>
            <p>Evidence-based insights and comprehensive resources to guide your decision-making process.</p>
          </div>
          <div class="service-card fade-in">
            <div class="service-icon">🎯</div>
            <h3>Strategies</h3>
            <p>Proven methodologies and tactical frameworks designed to accelerate your progress.</p>
          </div>
          <div class="service-card fade-in">
            <div class="service-icon">⚡</div>
            <h3>Activities</h3>
            <p>Engaging exercises and practical tools to transform knowledge into actionable results.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="offerings" id="about">
      <div class="container">
        <div class="offerings-content">
          <div class="offerings-text fade-in">
            <h2>Available Through</h2>
            <div class="offering-item">
              <div class="offering-icon">🎪</div>
              <span><strong>Workshops</strong> - Interactive sessions for hands-on learning</span>
            </div>
            <div class="offering-item">
              <div class="offering-icon">🎥</div>
              <span><strong>Videos</strong> - Visual guides and step-by-step tutorials</span>
            </div>
            <div class="offering-item">
              <div class="offering-icon">📖</div>
              <span><strong>Books</strong> - Comprehensive guides for deep learning</span>
            </div>
            <div class="offering-item">
              <div class="offering-icon">📝</div>
              <span><strong>Articles</strong> - Insights and tips you can apply today</span>
            </div>
          </div>
          <div class="offerings-visual fade-in">
            <div class="visual-element"></div>
            <div class="visual-element"></div>
            <div class="visual-element"></div>
          </div>
        </div>
      </div>
    </section>

    <section class="cta-section">
      <div class="container">
        <h2 class="fade-in">Do You Have a Dream?</h2>
        <p class="fade-in">Something you would like to be, do, have, or see?</p>
        <a href="mailto:gettingthere@gthere.net" class="cta-button fade-in">Come Join Us in Getting There!</a>
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
  background: var(--gradient);
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  bottom: 0;
  background: url('data:image/svg+xml,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="%23ffffff" fill-opacity="0.1"><circle cx="30" cy="30" r="2"/></g></svg>');
  animation: float 20s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
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
  color: white;
}

.hero-images {
  position: relative;
  height: 500px;
  border-radius: 20px;
  overflow: hidden;
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
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.hero-image.active {
  opacity: 1;
}

.hero-image::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2));
  border-radius: 20px;
}

.hero h1 {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 800;
  margin-bottom: 1rem;
  opacity: 0;
  animation: slideUp 1s ease 0.5s forwards;
  text-align: left;
}

.hero p {
  font-size: clamp(1.1rem, 2.5vw, 1.3rem);
  margin-bottom: 2rem;
  opacity: 0.9;
  opacity: 0;
  animation: slideUp 1s ease 0.7s forwards;
  text-align: left;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.cta-button {
  display: inline-block;
  background: var(--accent-color);
  color: white;
  padding: 1rem 2rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(245, 158, 11, 0.3);
  opacity: 0;
  animation: slideUp 1s ease 0.9s forwards;
}

.cta-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(245, 158, 11, 0.4);
}

/* Services Section */
.services {
  padding: 6rem 0;
  background: var(--bg-light);
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
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.service-card {
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  text-align: center;
}

.service-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

.service-icon {
  width: 60px;
  height: 60px;
  background: var(--gradient);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  font-size: 1.5rem;
  color: white;
}

.service-card h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-dark);
}

.service-card p {
  color: var(--text-light);
  line-height: 1.6;
}

/* What We Offer */
.offerings {
  padding: 6rem 0;
  background: white;
}

.offerings-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.offerings-text h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: var(--text-dark);
}

.offering-item {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: var(--bg-light);
  border-radius: 10px;
  transition: all 0.3s ease;
}

.offering-item:hover {
  background: var(--primary-color);
  color: white;
  transform: translateX(10px);
}

.offering-icon {
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

.offering-item:hover .offering-icon {
  background: white;
  color: var(--primary-color);
}

.offerings-visual {
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
  width: 200px;
  height: 200px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  position: absolute;
  animation: pulse 3s ease-in-out infinite;
}

.visual-element:nth-child(2) {
  width: 150px;
  height: 150px;
  animation-delay: 1s;
}

.visual-element:nth-child(3) {
  width: 100px;
  height: 100px;
  animation-delay: 2s;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.7; }
  50% { transform: scale(1.1); opacity: 0.3; }
}

/* CTA Section */
.cta-section {
  padding: 6rem 0;
  background: var(--text-dark);
  color: white;
  text-align: center;
}

.cta-section h2 {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.cta-section p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

/* Loading animation */
.fade-in {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease;
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

  .hero-text {
    order: 2;
  }

  .hero-images {
    order: 1;
    height: 300px;
  }

  .hero h1 {
    text-align: center;
    font-size: 2.5rem;
  }

  .hero p {
    text-align: center;
  }

  .offerings-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .cta-section h2 {
    font-size: 2rem;
  }
}
</style>
