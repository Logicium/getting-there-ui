<script setup lang="ts">
// Community Support Section for Videos Page
</script>

<template>
  <section class="therapy-community-section fade-in">
    <div class="community-content">
      <h3>🤝 Join Our Healing Community</h3>
      <div class="community-grid">
        <div class="community-item">
          <div class="community-icon">💚</div>
          <h4>Support Groups</h4>
          <p>Connect with others on similar healing journeys through our in-person and virtual support groups.</p>
          <router-link to="/events" class="community-link">Explore Groups</router-link>
        </div>
        <div class="community-item">
          <div class="community-icon">📚</div>
          <h4>Educational Resources</h4>
          <p>Deepen your understanding with our collection of therapeutic books and self-help guides.</p>
          <router-link to="/store" class="community-link">Browse Books</router-link>
        </div>
        <div class="community-item">
          <div class="community-icon">✍️</div>
          <h4>Wellness Blog</h4>
          <p>Read insights, tips, and stories from mental health professionals and community members.</p>
          <router-link to="/blog" class="community-link">Read Blog</router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@import '@/assets/common.scss';

.therapy-community-section {
  background: var(--bg-light);
  padding: 3rem;
  border-radius: 20px;
  margin: 4rem 0;
  border: 1px solid var(--border-light);
}

.community-content h3 {
  text-align: center;
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: var(--text-dark);
}

.community-grid {
  @extend .grid-auto-fit;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.community-item {
  @extend .card-base;
  text-align: center;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px var(--shadow-medium);
  }
}

.community-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.community-item h4 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.community-item p {
  color: var(--text-light);
  line-height: 1.5;
  margin-bottom: 1.5rem;
}

.community-link {
  @extend .cta-primary;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
}
</style>
