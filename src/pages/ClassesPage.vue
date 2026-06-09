<script setup lang="ts">
import { mockCourses } from '@/data/courses'
import { useRouter } from 'vue-router'

const router = useRouter()

function viewCourse(courseId: string) {
  router.push(`/classes/${courseId}`)
}
</script>

<template>
  <main class="classes-page">
    <section class="hero">
      <div class="container">
        <h1>Online Classes</h1>
        <p class="subtitle">Transform your life with courses in positive psychology</p>
      </div>
    </section>

    <section class="courses-section">
      <div class="container">
        <div class="courses-grid">
          <div 
            v-for="course in mockCourses" 
            :key="course.id" 
            class="course-card"
            @click="viewCourse(course.id)"
          >
            <div class="course-thumbnail">
              <img :src="course.thumbnailUrl" :alt="course.title" />
              <div class="course-level">{{ course.level }}</div>
            </div>
            <div class="course-content">
              <h3>{{ course.title }}</h3>
              <p class="course-subtitle">{{ course.subtitle }}</p>
              <p class="course-description">{{ course.description }}</p>
              
              <div class="course-meta">
                <div class="meta-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <span>{{ course.duration }}</span>
                </div>
                <div class="meta-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="23 7 16 12 23 17 23 7"></polygon>
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                  </svg>
                  <span>{{ course.totalLessons }} lessons</span>
                </div>
              </div>

              <div class="instructor">
                <img 
                  v-if="course.instructor.avatar" 
                  :src="course.instructor.avatar" 
                  :alt="course.instructor.name"
                  class="instructor-avatar"
                />
                <div class="instructor-info">
                  <div class="instructor-name">{{ course.instructor.name }}</div>
                  <div class="instructor-title">{{ course.instructor.title }}</div>
                </div>
              </div>

              <button class="view-course-btn">
                View Course
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped lang="scss">
.classes-page {
  min-height: 100vh;
  padding-top: 80px;
}

.hero {
  background: var(--gradient);
  color: white;
  padding: 4rem 0;
  text-align: center;

  h1 {
    font-size: 3rem;
    font-family: 'Playfair Display', serif;
    margin-bottom: 1rem;
    font-weight: 700;
  }

  .subtitle {
    font-size: 1.25rem;
    opacity: 0.95;
    max-width: 600px;
    margin: 0 auto;
  }
}

.courses-section {
  padding: 4rem 0;
  background: var(--bg-light);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.course-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px var(--shadow-light);
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px var(--shadow-medium);
  }
}

.course-thumbnail {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .course-level {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: rgba(255, 255, 255, 0.95);
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--primary-color);
  }
}

.course-card:hover .course-thumbnail img {
  transform: scale(1.05);
}

.course-content {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;

  h3 {
    font-size: 1.5rem;
    color: var(--text-dark);
    margin-bottom: 0.5rem;
    font-family: 'Playfair Display', serif;
  }

  .course-subtitle {
    color: var(--primary-color);
    font-weight: 600;
    margin-bottom: 0.75rem;
    font-size: 0.95rem;
  }

  .course-description {
    color: var(--text-light);
    line-height: 1.6;
    margin-bottom: 1.5rem;
    flex: 1;
  }
}

.course-meta {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-light);

  .meta-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--text-light);
    font-size: 0.9rem;

    svg {
      color: var(--primary-color);
    }
  }
}

.instructor {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;

  .instructor-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
  }

  .instructor-info {
    flex: 1;
  }

  .instructor-name {
    font-weight: 600;
    color: var(--text-dark);
    font-size: 0.95rem;
  }

  .instructor-title {
    font-size: 0.85rem;
    color: var(--text-light);
  }
}

.view-course-btn {
  width: 100%;
  padding: 1rem;
  background: var(--gradient);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px var(--shadow-medium);
  }

  svg {
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: translateX(4px);
  }
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 2rem;
  }

  .courses-grid {
    grid-template-columns: 1fr;
  }
}
</style>
