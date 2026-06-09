<script setup lang="ts">
import { RouterLink } from 'vue-router'
import NewsletterSignup from '@/components/NewsletterSignup.vue'
</script>

<template>
  <main class="coming-soon-page">
    <!-- Hero -->
    <section class="hero">
      <div class="container">
        <span class="badge">Coming soon</span>
        <h1>Online Courses Are Being Developed</h1>
        <p class="lede">
          We're putting the finishing touches on our first round of
          courses so stay tuned.
          You may find the courses meet Continuing Education
          requirements based on your profession.
        </p>
      </div>
    </section>

    <!-- What's included -->
    <section class="includes-section">
      <div class="container">
        <h2 class="section-title">What Online Courses Include</h2>
        <ul class="includes-list">
          <li>3 hours of video time for each course</li>
          <li>Ability to pace your learning</li>
          <li>20 multiple choice questions at the end</li>
          <li>Certificate of completion for those achieving 70% or higher score on the exam</li>
        </ul>
      </div>
    </section>

    <!-- Course lineup -->
    <section class="lineup-section">
      <div class="container">
        <h2 class="section-title">Course lineup</h2>
        <p class="lineup-intro">
          Each course is being designed as a self-paced experience you can fit
          around the rest of your life. Here's what's on the way:
        </p>
        <ul class="course-list">
          <li>
            <strong>About Happiness</strong> &mdash; A grounded look at what
            happiness actually is, the different forms it can take, and small
            shifts that help more of it show up in everyday life.
          </li>
          <li>
            <strong>Setting and Reaching Goals</strong> &mdash; A practical
            walk-through for choosing goals that matter to you, breaking them
            into doable steps, and building the momentum to follow through.
          </li>
          <li>
            <strong>Communication: Connecting with Others</strong> &mdash;
            Tools for being heard, listening well, and navigating the everyday
            conversations that shape your closest relationships.
          </li>
          <li>
            <strong>Coping with Loss</strong> &mdash; A gentle, paced
            exploration of grief and the many forms loss can take, with ideas
            for caring for yourself as you move through it.
          </li>
        </ul>
      </div>
    </section>

    <!-- Newsletter / meantime -->
    <section class="meantime-section">
      <div class="container meantime-container">
        <div class="meantime-newsletter">
          <NewsletterSignup
            variant="card"
            source="classes-coming-soon"
            title="Get the newsletter"
            description="One thoughtful email per week. We'll let you know the moment classes launch."
            button-text="Subscribe"
          />
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped lang="scss">
.coming-soon-page {
  min-height: 100vh;
  padding-top: 80px;
  background: var(--bg-light);
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Hero */
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
  margin: 0 auto;
  max-width: 640px;
}

/* What's included */
.includes-section {
  padding: 4rem 0 2rem;
}

.section-title {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  text-align: center;
  margin: 0 0 2rem;
  color: var(--text-dark);
}

.includes-list {
  max-width: 720px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  padding: 2rem 2.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  list-style: disc;
  color: var(--text-dark);
  font-size: 1.05rem;
  line-height: 1.75;

  li {
    margin-left: 0.25rem;
  }

  li + li {
    margin-top: 0.5rem;
  }
}

/* Lineup */
.lineup-section {
  padding: 3rem 0 4rem;
}

.lineup-intro {
  max-width: 720px;
  margin: 0 auto 2rem;
  text-align: center;
  color: var(--text-light);
  line-height: 1.6;
  font-size: 1.05rem;
}

.course-list {
  max-width: 760px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  padding: 2rem 2.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  list-style: disc;
  color: var(--text-dark);
  font-size: 1.05rem;
  line-height: 1.7;

  li + li {
    margin-top: 1rem;
  }

  strong {
    color: var(--text-dark);
  }
}

/* Meantime */
.meantime-section {
  padding: 4rem 0 6rem;
}

.meantime-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
  align-items: center;
}

.meantime-copy {
  h2 {
    font-family: 'Playfair Display', serif;
    font-size: 1.85rem;
    margin: 0 0 1rem;
    color: var(--text-dark);
  }

  p {
    color: var(--text-light);
    line-height: 1.6;
    margin: 0 0 1.5rem;
  }
}

.meantime-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.meantime-link {
  display: inline-block;
  padding: 0.7rem 1.25rem;
  border: 2px solid var(--primary-color);
  border-radius: 50px;
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
  transition: background 0.2s ease, color 0.2s ease;

  &:hover {
    background: var(--primary-color);
    color: white;
  }
}

@media (max-width: 880px) {
  .meantime-container {
    grid-template-columns: 1fr;
  }

  h1 {
    font-size: 2.1rem;
  }

  .includes-list,
  .course-list {
    padding: 1.5rem 1.75rem;
  }
}
</style>
