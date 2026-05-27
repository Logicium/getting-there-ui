<script setup lang="ts">
import { computed } from 'vue'
import NewsletterSignup from '@/components/NewsletterSignup.vue'

const siteUrl = computed(() =>
  typeof window !== 'undefined' ? `${window.location.origin}/newsletter` : ''
)

// QR code rendered server-side via a public image API so we don't need
// a JS dependency. Falls back gracefully if the network is offline.
const qrUrl = computed(() =>
  `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=10&data=${encodeURIComponent(siteUrl.value)}`
)
</script>

<template>
  <main class="newsletter-page">
    <section class="hero">
      <div class="container">
        <span class="badge">The Getting There Newsletter</span>
        <h1>Small practices. Real shifts. Delivered weekly.</h1>
        <p class="lede">
          Join a growing community of readers exploring positive psychology,
          mindfulness, and the everyday craft of feeling more alive.
          One short, useful email per week. No spam, ever.
        </p>

        <div class="signup-card">
          <NewsletterSignup
            variant="card"
            source="newsletter-page"
            title="Subscribe for free"
            description="Drop your email below — we'll send you a welcome note and your first practice."
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
            <div class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
                   fill="none" stroke="currentColor" stroke-width="2"
                   stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2 L15 8.5 L22 9.3 L17 14.1 L18.2 21 L12 17.8 L5.8 21 L7 14.1 L2 9.3 L9 8.5 Z"/>
              </svg>
            </div>
            <h3>One practice a week</h3>
            <p>A simple, evidence-informed exercise you can try in five minutes or less.</p>
          </div>
          <div class="benefit">
            <div class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
                   fill="none" stroke="currentColor" stroke-width="2"
                   stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 19.5 A2.5 2.5 0 0 1 6.5 17 H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              </svg>
            </div>
            <h3>Founder's notes</h3>
            <p>Behind-the-scenes thinking, book recommendations, and what we're learning as we build.</p>
          </div>
          <div class="benefit">
            <div class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
                   fill="none" stroke="currentColor" stroke-width="2"
                   stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <h3>Early access</h3>
            <p>Subscribers see new courses, events, and workshops before anyone else.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="qr-section">
      <div class="container qr-container">
        <div class="qr-copy">
          <h2>Share it in person</h2>
          <p>
            Print this page or scan the code below to share the newsletter
            at a workshop, market, or coffee shop. The QR code links straight
            here so anyone can sign up in seconds.
          </p>
          <p class="qr-url">{{ siteUrl }}</p>
        </div>
        <div class="qr-image-wrap">
          <img :src="qrUrl" alt="QR code linking to the Getting There newsletter signup page" />
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
  padding: 2rem 1.5rem;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  text-align: left;

  .icon {
    width: 52px;
    height: 52px;
    border-radius: 14px;
    background: rgba(74, 124, 89, 0.12);
    color: var(--primary-color);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
  }

  h3 {
    font-family: 'Playfair Display', serif;
    font-size: 1.25rem;
    margin: 0 0 0.5rem;
    color: var(--text-dark);
  }

  p {
    color: var(--text-light);
    line-height: 1.6;
    margin: 0;
  }
}

.qr-section {
  padding: 4rem 0 6rem;
}

.qr-container {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 3rem;
  align-items: center;
  background: white;
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.06);
}

.qr-copy {
  h2 {
    font-family: 'Playfair Display', serif;
    font-size: 1.85rem;
    margin: 0 0 1rem;
    color: var(--text-dark);
  }

  p {
    color: var(--text-light);
    line-height: 1.6;
    margin: 0 0 0.75rem;
  }
}

.qr-url {
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  color: var(--primary-color);
  word-break: break-all;
}

.qr-image-wrap {
  display: flex;
  justify-content: center;

  img {
    width: 100%;
    max-width: 260px;
    height: auto;
    border-radius: 12px;
    background: white;
    padding: 0.5rem;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  }
}

@media (max-width: 720px) {
  h1 {
    font-size: 2.1rem;
  }

  .qr-container {
    grid-template-columns: 1fr;
    padding: 2rem;
    text-align: center;
  }

  .qr-copy {
    text-align: center;
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

  .signup-card,
  .what-you-get {
    display: none;
  }

  .qr-container {
    box-shadow: none;
  }
}
</style>
