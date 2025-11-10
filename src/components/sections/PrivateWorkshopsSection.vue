<script setup lang="ts">
import Plant2Icon from '@/components/icons/Plant2Icon.vue';
</script>

<template>
  <section class="therapy-private-workshops fade-in">
    <div class="private-workshops-content">
      <div class="workshops-text">
        <h2><Plant2Icon/>Private Workshops for Your Organization</h2>
        <p class="workshops-subtitle">
          Bring mental health education and support directly to your team with customized workshops designed for your community's unique needs.
        </p>

        <div class="workshop-types">
          <div class="workshop-type">
            <span class="type-icon">🏢</span>
            <span>Corporate Teams</span>
          </div>
          <div class="workshop-type">
            <span class="type-icon">❤️</span>
            <span>Nonprofit Organizations</span>
          </div>
          <div class="workshop-type">
            <span class="type-icon">⛪</span>
            <span>Faith Communities</span>
          </div>
          <div class="workshop-type">
            <span class="type-icon">🏫</span>
            <span>Educational Institutions</span>
          </div>
        </div>
      </div>

      <div class="workshops-cta-card">
        <h3>Ready to Support Your Community?</h3>
        <p>Get a customized quote for mental health workshops tailored to your organization.</p>

        <div class="workshop-features">
          <div class="feature-item">
            <span class="feature-icon">🎯</span>
            <span>Customized content for your community</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">💻</span>
            <span>On-site, virtual, or hybrid delivery</span>
          </div>
        </div>

        <div class="cta-buttons-wrapper">
          <a href="mailto:workshops@gthere.net?subject=Private Workshop Inquiry" class="workshop-cta-primary">
            Request Information
          </a>
          <a href="mailto:gettingthere@gthere.net" class="workshop-cta-secondary">
            📧 Email: gettingthere@gthere.net
          </a>
        </div>

      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@import '@/assets/common.scss';

svg {
  height: 50px;
  width: 50px;
  margin-right: 0.5rem;
}

.therapy-private-workshops {
  background: var(--primary-color);
  padding: 4rem 0;
  margin: 4rem 0;
  color: white;
  position: relative;
  overflow: hidden;
  border-radius: 20px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="%23ffffff" fill-opacity="0.05"><circle cx="30" cy="30" r="2"/></g></svg>');
    animation: gentleFloat 20s ease-in-out infinite;
  }
}

.private-workshops-content {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 3rem;
  align-items: center;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

.workshops-text h2 {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: white;
  font-family: 'Playfair Display', serif;

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
}

.workshops-subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.workshop-types {
  @extend .grid-two;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.workshop-type {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-weight: 500;
  color: white;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
  }
}

.type-icon {
  font-size: 1.2rem;
}

.workshops-cta-card {
  @extend .card-base;
  text-align: center;
  padding: 2.5rem;
  background: white;

  h3 {
    font-size: 1.4rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: var(--text-dark);
  }

  p {
    color: var(--text-light);
    line-height: 1.6;
    margin-bottom: 2rem;
  }
}

.workshop-features {
  margin-bottom: 2rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  text-align: left;
  color: var(--text-dark);
}

.feature-icon {
  font-size: 1.1rem;
  color: var(--primary-color);
}

.cta-buttons-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.workshop-cta-primary {
  @extend .cta-primary;
}

.workshop-cta-secondary {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
  padding: 0.75rem;

  &:hover {
    color: var(--secondary-color);
  }
}

.pricing-note {
  color: var(--text-light);
  font-size: 0.9rem;
  margin: 0;
}
</style>
