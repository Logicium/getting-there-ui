<script setup lang="ts">
// Bulk Print Section for Store Page
</script>

<template>
  <section class="therapy-bulk-print fade-in">
    <div class="bulk-print-content">
      <div class="bulk-print-text">
        <div class="bulk-icon">📚</div>
        <h2>Bulk Print Orders for Organizations</h2>
        <p class="bulk-subtitle">
          Need physical copies for your organization, workshop, or group? We offer bulk printing services for educational institutions, healthcare facilities, and community organizations.
        </p>

        <div class="organization-types">
          <div class="org-type">
            <span class="type-icon">🏥</span>
            <span>Healthcare Facilities</span>
          </div>
          <div class="org-type">
            <span class="type-icon">🏫</span>
            <span>Educational Institutions</span>
          </div>
          <div class="org-type">
            <span class="type-icon">🏢</span>
            <span>Corporate Wellness Programs</span>
          </div>
          <div class="org-type">
            <span class="type-icon">🤝</span>
            <span>Support Organizations</span>
          </div>
        </div>
      </div>

      <div class="bulk-print-cta-card">
        <h3>Request Bulk Print Quote</h3>
        <p>Get customized pricing for physical copies of our therapeutic resources.</p>

        <div class="bulk-features">
          <div class="feature-item">
            <span class="feature-icon">📖</span>
            <span>Professional-grade printing and binding</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">📦</span>
            <span>Minimum order: 25 copies</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">🚚</span>
            <span>Direct shipping to your facility</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">💰</span>
            <span>Volume discounts available</span>
          </div>
        </div>

        <div class="bulk-cta-buttons">
          <a href="mailto:bulk@gthere.net?subject=Bulk Print Request&body=Hello,%0D%0A%0D%0APlease provide a quote for bulk printing.%0D%0A%0D%0AOrganization:%0D%0AContact Person:%0D%0APhone:%0D%0ABook Title(s):%0D%0AQuantity Needed:%0D%0ADelivery Address:%0D%0A%0D%0AThank you!" class="bulk-cta-primary">
            Request Quote
          </a>
          <a href="mailto:gettingthere@gthere.net" class="bulk-cta-secondary">
            📧 Email: gettingthere@gthere.net
          </a>
        </div>

        <p class="bulk-pricing-note">Pricing starts at $8/book • Volume discounts available</p>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@import '@/assets/common.scss';

.therapy-bulk-print {
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

.bulk-print-content {
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

.bulk-print-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.bulk-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.bulk-print-text h2 {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: white;
  font-family: 'Playfair Display', serif;

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
}

.bulk-subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.organization-types {
  @extend .grid-two;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.org-type {
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

.bulk-print-cta-card {
  @extend .card-base;
  text-align: center;
  background: white;
  padding: 2.5rem;

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

.bulk-features {
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

.bulk-cta-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.bulk-cta-primary {
  @extend .cta-primary;
}

.bulk-cta-secondary {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
  padding: 0.75rem;

  &:hover {
    color: var(--secondary-color);
  }
}

.bulk-pricing-note {
  color: var(--text-light);
  font-size: 0.9rem;
  margin: 0;
}
</style>
