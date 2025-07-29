<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<template>
  <footer>
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>Getting There</h3>
          <p>Compassionate guidance for your emotional wellness journey. Licensed professionals dedicated to helping you achieve lasting positive change.</p>
          <div class="credentials">
            <span class="credential-badge">🏆 Accredited</span>
            <span class="credential-badge">🔒 HIPAA Compliant</span>
          </div>
        </div>
        <div class="footer-section">
          <h3>Services</h3>
          <p><RouterLink to="/about">Mindset Coaching</RouterLink></p>
          <p><RouterLink to="/about">Goal Setting Support</RouterLink></p>
          <p><RouterLink to="/about">Emotional Resilience</RouterLink></p>
          <p><RouterLink to="/events">Group Workshops</RouterLink></p>
          <p><RouterLink to="/videos">Resource Library</RouterLink></p>
        </div>
        <div class="footer-section">
          <h3>Resources</h3>
          <p><RouterLink to="/blog">Wellness Blog</RouterLink></p>
          <p><RouterLink to="/store">Self-Help Books</RouterLink></p>
          <p><RouterLink to="/videos">Video Library</RouterLink></p>
          <p><RouterLink to="/events">Upcoming Events</RouterLink></p>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="footer-legal">
          <p>&copy; 2025 Getting There. All rights reserved.</p>
          <div class="legal-links">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
            <a href="/accessibility">Accessibility</a>
          </div>
        </div>
        <div class="footer-disclaimer">
          <p><small>Getting There provides educational resources and support. We are not a substitute for professional medical or mental health treatment. Please consult with qualified healthcare providers for clinical concerns.</small></p>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* Footer */
footer {
  background: var(--text-dark);
  color: white;
  padding: 4rem 0 2rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
  margin-bottom: 3rem;
}

.footer-section h3 {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: white;
  font-family: 'Playfair Display', serif;
}

.footer-section p {
  margin-bottom: 0.75rem;
  line-height: 1.6;
}

.footer-section a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-section a:hover {
  color: var(--accent-color);
}

.credentials {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.credential-badge {
  background: var(--primary-color);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.emergency-note {
  background: rgba(231, 111, 81, 0.2);
  padding: 1rem;
  border-radius: 10px;
  margin-top: 1rem;
  border-left: 4px solid var(--warning-color);
}

.emergency-note p {
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 2rem;
}

.footer-legal {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.legal-links {
  display: flex;
  gap: 2rem;
}

.legal-links a {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.legal-links a:hover {
  color: rgba(255, 255, 255, 0.9);
}

.footer-disclaimer {
  opacity: 0.7;
  font-size: 0.85rem;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.8);
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .footer-legal {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .legal-links {
    flex-direction: column;
    gap: 1rem;
  }

  .credentials {
    justify-content: center;
  }
}
</style>
