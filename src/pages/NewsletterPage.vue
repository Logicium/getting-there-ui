<script setup lang="ts">
import NewsletterSignup from '@/components/NewsletterSignup.vue'
</script>

<template>
  <main class="newsletter-page">
    <section class="hero">
      <div class="container">
        <span class="badge">The Getting There Newsletter</span>
        <h1>Weekly Updates on Changes, Additions, and Events.</h1>
        <p class="lede">
          Join a growing community of readers exploring topics such as happiness,
          personal growth, coping with loss, setting goals, and more.
          One short, useful email per week. No spam, ever.
        </p>

        <div class="signup-card">
          <NewsletterSignup
            variant="card"
            source="newsletter-page"
            title="Subscribe for free"
            description="Drop your email below — we'll send you a welcome note."
            button-text="Send me the newsletter"
          />
        </div>
      </div>
    </section>

    <section class="what-you-get">
      <div class="container">
        <h2>What you'll get</h2>
        <div class="grid">
          <div class="benefit">
            <div class="benefit-image">
              <img src="/newsletter/picture-2.jpg" alt="" />
            </div>
            <h3>One practice a week</h3>
            <p>A simple exercise you can try in five minutes or less.</p>
          </div>
          <div class="benefit">
            <div class="benefit-image">
              <img src="/newsletter/picture-3.jpg" alt="" />
            </div>
            <h3>Founder's notes</h3>
            <p>Behind-the-scenes thinking, book recommendations, and what we're learning as we build.</p>
          </div>
          <div class="benefit">
            <div class="benefit-image">
              <img src="/newsletter/picture-4.jpg" alt="" />
            </div>
            <h3>Early access</h3>
            <p>Subscribers see new courses, events, and workshops before anyone else.</p>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped lang="scss">
.newsletter-page {
  min-height: 100vh;
  padding-top: 80px;
  background: var(--bg-light);
}

.container {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 2rem;
}

.hero {
  background: var(--gradient);
  color: white;
  padding: 5rem 0 4rem;
  text-align: center;
}

.badge {
  display: inline-block;
  padding: 0.4rem 1rem;
  background: rgba(255, 255, 255, 0.18);
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-bottom: 1.5rem;
}

h1 {
  font-family: 'Playfair Display', serif;
  font-size: 3rem;
  font-weight: 700;
  margin: 0 0 1.25rem;
  line-height: 1.15;
}

.lede {
  font-size: 1.15rem;
  line-height: 1.6;
  opacity: 0.95;
  max-width: 620px;
  margin: 0 auto 2.5rem;
}

.signup-card {
  max-width: 520px;
  margin: 0 auto;
  color: var(--text-dark);
  text-align: left;
}

.what-you-get {
  padding: 4rem 0;
  text-align: center;

  h2 {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    margin: 0 0 2.5rem;
    color: var(--text-dark);
  }
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 2rem;
}

.benefit {
  background: white;
  padding: 0;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  text-align: left;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .benefit-image {
    width: 100%;
    aspect-ratio: 4 / 3;
    overflow: hidden;
    background: var(--bg-secondary);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
  }

  h3 {
    font-family: 'Playfair Display', serif;
    font-size: 1.25rem;
    margin: 1.5rem 1.5rem 0.5rem;
    color: var(--text-dark);
  }

  p {
    color: var(--text-light);
    line-height: 1.6;
    margin: 0 1.5rem 1.5rem;
  }
}

@media (max-width: 720px) {
  h1 {
    font-size: 2.1rem;
  }
}

@media print {
  .newsletter-page {
    background: white;
    padding-top: 0;
  }

  .hero {
    background: white;
    color: var(--text-dark);
  }

  .hero .badge {
    background: rgba(0, 0, 0, 0.06);
    color: var(--text-dark);
  }

  .signup-card {
    display: none;
  }
}
</style>
