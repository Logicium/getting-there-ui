<script setup lang="ts">
// Disclaimer Section for Videos Page
</script>

<template>
  <section class="therapy-disclaimer fade-in">
    <div class="disclaimer-content">
      <h3>🏥 Important Therapeutic Information</h3>
      <div class="disclaimer-grid">
        <div class="disclaimer-item">
          <h4>Professional Support</h4>
          <p>These resources complement but do not replace professional therapy. Please consult with a PhD educated mental health professional for personalized care.</p>
        </div>
        <div class="disclaimer-item">
          <h4>Crisis Support</h4>
          <p>If you're in crisis, please contact emergency services (911) or the National Suicide Prevention Lifeline (988) immediately.</p>
        </div>
        <div class="disclaimer-item">
          <h4>Confidential Care</h4>
          <p>All our content is designed with trauma-informed principles and includes resources for additional support when needed.</p>
        </div>
        <div class="disclaimer-item">
          <h4>Progress at Your Pace</h4>
          <p>Healing is not linear. Take breaks when needed and remember that seeking help is a sign of strength, not weakness.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@import '@/assets/common.scss';

.therapy-disclaimer {
  background: var(--bg-sage);
  padding: 3rem;
  border-radius: 20px;
  margin-top: 3rem;
  border: 1px solid var(--border-light);
}

.disclaimer-content h3 {
  text-align: center;
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: var(--text-dark);
}

.disclaimer-grid {
  @extend .grid-auto-fit;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

.disclaimer-item {
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
