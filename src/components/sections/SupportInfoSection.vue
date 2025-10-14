<script setup lang="ts">
// Support Information Section for Events Page
</script>

<template>
  <section class="therapy-support-info fade-in">
    <div class="support-info-content">
      <h3>🤝 Commitment to Your Safety & Comfort</h3>
      <div class="support-info-grid">
        <div class="support-info-item">
          <h4>Confidential Environment</h4>
          <p>All our groups maintain strict confidentiality. What's shared in group stays in group.</p>
        </div>
        <div class="support-info-item">
          <h4>PhD Educated Professionals</h4>
          <p>Every group is led by PhD educated mental health professionals with specialized training.</p>
        </div>
        <div class="support-info-item">
          <h4>Trauma-Informed Care</h4>
          <p>Our approach prioritizes safety, trustworthiness, and cultural humility in all interactions.</p>
        </div>
        <div class="support-info-item">
          <h4>Sliding Scale Available</h4>
          <p>Financial assistance available. Your healing shouldn't depend on your ability to pay.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@import '@/assets/common.scss';

.therapy-support-info {
  background: var(--bg-sage);
  padding: 3rem;
  border-radius: 20px;
  margin-top: 2rem;
  border: 1px solid var(--border-light);
}

.support-info-content h3 {
  text-align: center;
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: var(--text-dark);
}

.support-info-grid {
  @extend .grid-auto-fit;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.support-info-item {
  @extend .card-base;
  text-align: center;
  background: white;

  h4 {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: var(--primary-color);
  }

  p {
    color: var(--text-light);
    line-height: 1.5;
  }
}
</style>
