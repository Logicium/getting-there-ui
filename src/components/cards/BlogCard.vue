<template>
  <article class="therapy-article-card fade-in" :data-category="category">
    <div class="article-therapy-image" :style="{ backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }">
      <div class="therapy-category-badge" :class="category">{{ categoryLabel }}</div>
    </div>
    <div class="article-therapy-content">
      <div class="article-meta-therapy">
        <span class="article-date-therapy">{{ date }}</span>
        <span class="read-time">{{ readTime }} min read</span>
      </div>
      <h3 class="article-title">{{ title }}</h3>
      <p class="article-excerpt">{{ excerpt }}</p>
      <div class="article-author-therapy">
        <div class="author-avatar-therapy">{{ authorAvatar }}</div>
        <div class="author-info-therapy">
          <span class="author-name">{{ authorName }}</span>
          <span class="author-credentials">{{ authorCredentials }}</span>
        </div>
      </div>
      <router-link v-if="slug" :to="`/blog/${slug}`" class="therapy-read-more">
        Continue Reading →
      </router-link>
      <a v-else href="#" class="therapy-read-more">Continue Reading →</a>
    </div>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  category: string;
  categoryLabel: string;
  icon: string;
  imageUrl: string;
  date: string;
  readTime: number;
  title: string;
  excerpt: string;
  authorAvatar: string;
  authorName: string;
  authorCredentials: string;
  slug?: string;
}>();
</script>

<style scoped>
/* Blog Card Styles */
.therapy-article-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 30px var(--shadow-light);
  transition: all 0.3s ease;
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 0;
  border: 1px solid var(--border-light);
}

.therapy-article-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px var(--shadow-medium);
}

.article-therapy-image {
  background: var(--bg-sage);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.therapy-category-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
  color: white;
}

.therapy-category-badge.anxiety {
  background: var(--soft-blue);
}

.therapy-category-badge.depression {
  background: var(--success-color);
}

.therapy-category-badge.relationships {
  background: var(--accent-color);
}

.therapy-category-badge.mindfulness {
  background: var(--lavender);
  color: var(--text-dark);
}

.therapy-category-badge.stress {
  background: var(--warning-color);
}

.article-visual-icon {
  font-size: 3rem;
  opacity: 0.8;
}

.article-therapy-content {
  padding: 2rem;
  display: flex;
  flex-direction: column;
}

.article-meta-therapy {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  color: var(--text-light);
  font-size: 0.9rem;
}

.article-date-therapy, .read-time {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.article-title {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text-dark);
  line-height: 1.4;
}

.article-excerpt {
  color: var(--text-light);
  margin-bottom: 1.5rem;
  line-height: 1.6;
  flex-grow: 1;
}

.article-author-therapy {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.author-avatar-therapy {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--bg-sage);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  border: 2px solid var(--primary-color);
}

.author-info-therapy {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-weight: 600;
  color: var(--text-dark);
  font-size: 0.9rem;
}

.author-credentials {
  color: var(--text-light);
  font-size: 0.8rem;
}

.therapy-read-more {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
  align-self: flex-start;
}

.therapy-read-more:hover {
  color: var(--secondary-color);
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

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .therapy-article-card {
    grid-template-columns: 1fr;
  }

  .article-therapy-image {
    min-height: 150px;
  }
}

</style>
