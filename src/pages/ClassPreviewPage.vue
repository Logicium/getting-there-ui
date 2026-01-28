<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getCourseById } from '@/data/courses'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const courseId = computed(() => route.params.id as string)
const course = ref(getCourseById(courseId.value))

onMounted(() => {
  if (!course.value) {
    router.push('/classes')
  }
})

function startCourse() {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }

  if (!authStore.isSubscribed) {
    // Show subscription prompt
    return
  }

  router.push(`/classes/${courseId.value}/learn`)
}

function handleSubscribe() {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  authStore.subscribe()
}
</script>

<template>
  <main v-if="course" class="preview-page">
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <div class="hero-text">
            <div class="breadcrumb">
              <router-link to="/classes">Classes</router-link>
              <span>/</span>
              <span>{{ course.title }}</span>
            </div>
            <h1>{{ course.title }}</h1>
            <p class="subtitle">{{ course.subtitle }}</p>
            
            <div class="course-highlights">
              <div class="highlight">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span>{{ course.duration }}</span>
              </div>
              <div class="highlight">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="23 7 16 12 23 17 23 7"></polygon>
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                </svg>
                <span>{{ course.totalLessons }} lessons</span>
              </div>
              <div class="highlight">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
                <span>{{ course.level }}</span>
              </div>
            </div>

            <div class="instructor">
              <img 
                v-if="course.instructor.avatar" 
                :src="course.instructor.avatar" 
                :alt="course.instructor.name"
              />
              <div>
                <div class="instructor-name">{{ course.instructor.name }}</div>
                <div class="instructor-title">{{ course.instructor.title }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="video-section">
      <div class="container">
        <div class="video-wrapper">
          <iframe
            :src="course.introVideo.videoUrl"
            :title="course.introVideo.title"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </section>

    <section class="content-section">
      <div class="container">
        <div class="content-grid">
          <div class="main-content">
            <div class="section">
              <h2>About This Course</h2>
              <p>{{ course.longDescription }}</p>
            </div>

            <div class="section">
              <h2>What You'll Learn</h2>
              <ul class="benefits-list">
                <li v-for="(benefit, index) in course.benefits" :key="index">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>{{ benefit }}</span>
                </li>
              </ul>
            </div>

            <div class="section">
              <h2>Course Curriculum</h2>
              <div class="curriculum">
                <div v-for="(chapter, index) in course.chapters" :key="chapter.id" class="chapter">
                  <div class="chapter-header">
                    <h3>Chapter {{ index + 1 }}: {{ chapter.title }}</h3>
                    <span class="lesson-count">{{ chapter.content.length }} lessons</span>
                  </div>
                  <p class="chapter-description">{{ chapter.description }}</p>
                  <ul class="lesson-list">
                    <li v-for="item in chapter.content" :key="item.id">
                      <svg v-if="'videoUrl' in item" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                      </svg>
                      <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M9 11l3 3L22 4"></path>
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                      </svg>
                      <span>{{ item.title }}</span>
                      <span v-if="'duration' in item" class="duration">{{ item.duration }}</span>
                    </li>
                  </ul>
                </div>

                <div class="chapter">
                  <div class="chapter-header">
                    <h3>Final Exam</h3>
                    <span class="lesson-count">{{ course.finalExam.questions.length }} questions</span>
                  </div>
                  <p class="chapter-description">{{ course.finalExam.description }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="sidebar">
            <div class="cta-card">
              <template v-if="!authStore.isAuthenticated">
                <h3>Start Learning Today</h3>
                <p class="price">$10<span>/month</span></p>
                <p class="price-description">Get unlimited access to all courses</p>
                
                <ul class="membership-benefits">
                  <li>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>Access to all courses</span>
                  </li>
                  <li>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>Certificate of completion</span>
                  </li>
                  <li>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>New courses added monthly</span>
                  </li>
                  <li>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>Cancel anytime</span>
                  </li>
                </ul>

                <button class="cta-button" @click="handleSubscribe">Sign Up & Start Learning</button>
                <p class="login-prompt">Already have an account? <router-link to="/login">Log in</router-link></p>
              </template>

              <template v-else-if="!authStore.isSubscribed">
                <h3>Subscribe to Access</h3>
                <p class="price">$10<span>/month</span></p>
                <p class="price-description">Get unlimited access to all courses</p>
                
                <ul class="membership-benefits">
                  <li>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>Access to all courses</span>
                  </li>
                  <li>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>Certificate of completion</span>
                  </li>
                  <li>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>New courses added monthly</span>
                  </li>
                  <li>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>Cancel anytime</span>
                  </li>
                </ul>

                <button class="cta-button" @click="handleSubscribe">Subscribe Now</button>
              </template>

              <template v-else>
                <h3>Ready to Start?</h3>
                <p class="enrolled-message">You're all set! Begin your learning journey now.</p>
                <button class="cta-button" @click="startCourse">Start Course</button>
              </template>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped lang="scss">
.preview-page {
  min-height: 100vh;
  padding-top: 80px;
}

.hero {
  background: var(--gradient);
  color: white;
  padding: 3rem 0;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  opacity: 0.9;

  a {
    color: white;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
}

.hero-text {
  h1 {
    font-size: 2.5rem;
    font-family: 'Playfair Display', serif;
    margin-bottom: 0.5rem;
  }

  .subtitle {
    font-size: 1.25rem;
    margin-bottom: 2rem;
    opacity: 0.95;
  }
}

.course-highlights {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;

  .highlight {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.95rem;
  }
}

.instructor {
  display: flex;
  align-items: center;
  gap: 1rem;

  img {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border: 3px solid rgba(255, 255, 255, 0.3);
  }

  .instructor-name {
    font-weight: 600;
    font-size: 1.1rem;
  }

  .instructor-title {
    font-size: 0.9rem;
    opacity: 0.9;
  }
}

.video-section {
  padding: 3rem 0;
  background: var(--bg-light);
}

.video-wrapper {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  height: 0;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 8px 24px var(--shadow-medium);

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}

.content-section {
  padding: 3rem 0 4rem;
  background: white;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 3rem;
  align-items: start;
}

.main-content {
  .section {
    margin-bottom: 3rem;

    h2 {
      font-size: 1.75rem;
      color: var(--text-dark);
      margin-bottom: 1.5rem;
      font-family: 'Playfair Display', serif;
    }

    p {
      color: var(--text-light);
      line-height: 1.8;
      font-size: 1.05rem;
    }
  }
}

.benefits-list {
  list-style: none;
  padding: 0;

  li {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 1rem;
    color: var(--text-light);
    font-size: 1.05rem;

    svg {
      color: var(--success-color);
      flex-shrink: 0;
      margin-top: 0.25rem;
    }
  }
}

.curriculum {
  .chapter {
    background: var(--bg-light);
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;

    .chapter-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;

      h3 {
        font-size: 1.25rem;
        color: var(--text-dark);
      }

      .lesson-count {
        color: var(--text-light);
        font-size: 0.9rem;
      }
    }

    .chapter-description {
      color: var(--text-light);
      margin-bottom: 1rem;
    }
  }
}

.lesson-list {
  list-style: none;
  padding: 0;

  li {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 0;
    border-top: 1px solid var(--border-light);
    color: var(--text-light);

    svg {
      color: var(--primary-color);
      flex-shrink: 0;
    }

    span:first-of-type {
      flex: 1;
    }

    .duration {
      color: var(--text-lighter);
      font-size: 0.9rem;
    }
  }
}

.sidebar {
  position: sticky;
  top: 100px;
}

.cta-card {
  background: white;
  border: 2px solid var(--primary-color);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px var(--shadow-light);

  h3 {
    font-size: 1.5rem;
    color: var(--text-dark);
    margin-bottom: 1rem;
    font-family: 'Playfair Display', serif;
  }

  .price {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--primary-color);
    margin-bottom: 0.5rem;

    span {
      font-size: 1.25rem;
      font-weight: 400;
      color: var(--text-light);
    }
  }

  .price-description {
    color: var(--text-light);
    margin-bottom: 1.5rem;
  }

  .enrolled-message {
    color: var(--text-light);
    margin-bottom: 1.5rem;
    line-height: 1.6;
  }
}

.membership-benefits {
  list-style: none;
  padding: 0;
  margin-bottom: 2rem;

  li {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
    color: var(--text-dark);

    svg {
      color: var(--success-color);
      flex-shrink: 0;
    }
  }
}

.cta-button {
  width: 100%;
  padding: 1rem;
  background: var(--gradient);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px var(--shadow-medium);
  }
}

.login-prompt {
  margin-top: 1rem;
  text-align: center;
  color: var(--text-light);
  font-size: 0.9rem;

  a {
    color: var(--primary-color);
    text-decoration: none;
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }
}

@media (max-width: 968px) {
  .content-grid {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: static;
  }

  .hero-text h1 {
    font-size: 2rem;
  }

  .course-highlights {
    flex-wrap: wrap;
    gap: 1rem;
  }
}
</style>
