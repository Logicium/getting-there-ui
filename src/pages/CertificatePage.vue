<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getCourseById } from '@/data/courses'
import { useProgressStore } from '@/stores/progress'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const progressStore = useProgressStore()
const authStore = useAuthStore()

const courseId = computed(() => route.params.courseId as string)
const course = ref(getCourseById(courseId.value))
const courseProgress = computed(() => progressStore.getCourseProgress(courseId.value))

onMounted(() => {
  if (!course.value) {
    router.push('/classes')
    return
  }

  // Check if user has completed the course
  if (!progressStore.hasCompletedCourse(courseId.value)) {
    router.push(`/classes/${courseId.value}`)
    return
  }
})

function printCertificate() {
  window.print()
}

const completionDate = computed(() => {
  const dateStr = courseProgress.value?.completedAt
  if (!dateStr) return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
})
</script>

<template>
  <div v-if="course" class="certificate-page">
    <div class="certificate-actions no-print">
      <router-link :to="`/classes/${courseId}`" class="back-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Back to Course
      </router-link>
      <button class="print-button" @click="printCertificate">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 6 2 18 2 18 9"></polyline>
          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
          <rect x="6" y="14" width="12" height="8"></rect>
        </svg>
        Print Certificate
      </button>
    </div>

    <div class="certificate-container">
      <div class="certificate">
        <div class="certificate-border">
          <div class="certificate-content">
            <div class="certificate-header">
              <div class="logo-section">
                <div class="logo-placeholder">
                  <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                    <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                  </svg>
                </div>
                <h3>Getting There</h3>
              </div>
              
              <h1>Certificate of Completion</h1>
              <div class="decorative-line"></div>
            </div>

            <div class="certificate-body">
              <p class="presented-to">This certificate is presented to</p>
              <h2 class="recipient-name">{{ authStore.user?.name || 'Student' }}</h2>
              
              <p class="completion-text">
                For successfully completing the course
              </p>
              
              <h3 class="course-title">{{ course.title }}</h3>
              
              <p class="course-description">
                {{ course.subtitle }}
              </p>

              <div class="certificate-details">
                <div class="detail-item">
                  <span class="detail-label">Completed</span>
                  <span class="detail-value">{{ completionDate }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Duration</span>
                  <span class="detail-value">{{ course.duration }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Final Score</span>
                  <span class="detail-value">
                    {{ courseProgress?.finalExamScore }}/{{ course.finalExam.questions.length }}
                  </span>
                </div>
              </div>
            </div>

            <div class="certificate-footer">
              <div class="signature-section">
                <div class="signature">
                  <div class="signature-line"></div>
                  <p class="signature-name">{{ course.instructor.name }}</p>
                  <p class="signature-title">{{ course.instructor.title }}</p>
                </div>
                <div class="seal">
                  <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 6v6l4 2"></path>
                  </svg>
                  <span class="seal-text">Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.certificate-page {
  min-height: 100vh;
  padding-top: 80px;
  background: var(--bg-light);
}

.certificate-actions {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 2rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .back-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--primary-color);
    text-decoration: none;
    font-weight: 600;
    transition: all 0.2s ease;

    &:hover {
      gap: 0.75rem;
    }
  }

  .print-button {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1.5rem;
    background: var(--gradient);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px var(--shadow-medium);
    }
  }
}

.certificate-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

.certificate {
  background: white;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  aspect-ratio: 8.5 / 11;
  display: flex;
  align-items: center;
  justify-content: center;
  page-break-inside: avoid;
}

.certificate-border {
  width: calc(100% - 60px);
  height: calc(100% - 60px);
  border: 3px solid var(--primary-color);
  position: relative;
  padding: 3rem;

  &::before {
    content: '';
    position: absolute;
    top: 15px;
    left: 15px;
    right: 15px;
    bottom: 15px;
    border: 1px solid var(--primary-color);
    opacity: 0.3;
  }
}

.certificate-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.certificate-header {
  text-align: center;

  .logo-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 1.5rem;

    .logo-placeholder {
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0.5rem;

      svg {
        color: var(--primary-color);
      }
    }

    h3 {
      font-family: 'Playfair Display', serif;
      font-size: 1.25rem;
      color: var(--primary-color);
      margin: 0;
    }
  }

  h1 {
    font-family: 'Playfair Display', serif;
    font-size: 2.5rem;
    color: var(--text-dark);
    margin: 0 0 1rem;
    font-weight: 700;
  }

  .decorative-line {
    width: 200px;
    height: 3px;
    background: var(--gradient);
    margin: 0 auto;
  }
}

.certificate-body {
  text-align: center;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem 0;

  .presented-to {
    font-size: 1rem;
    color: var(--text-light);
    margin: 0 0 1rem;
    font-style: italic;
  }

  .recipient-name {
    font-family: 'Playfair Display', serif;
    font-size: 2.75rem;
    color: var(--primary-color);
    margin: 0 0 2rem;
    font-weight: 700;
    position: relative;
    display: inline-block;

    &::after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 10%;
      right: 10%;
      height: 2px;
      background: var(--text-lighter);
    }
  }

  .completion-text {
    font-size: 1rem;
    color: var(--text-light);
    margin: 0 0 0.5rem;
  }

  .course-title {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    color: var(--text-dark);
    margin: 0 0 0.75rem;
    font-weight: 700;
  }

  .course-description {
    font-size: 1.05rem;
    color: var(--text-light);
    margin: 0 0 2rem;
    font-style: italic;
  }

  .certificate-details {
    display: flex;
    justify-content: center;
    gap: 3rem;
    margin-top: 1.5rem;

    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;

      .detail-label {
        font-size: 0.8rem;
        color: var(--text-lighter);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-weight: 600;
      }

      .detail-value {
        font-size: 1rem;
        color: var(--text-dark);
        font-weight: 600;
      }
    }
  }
}

.certificate-footer {
  .signature-section {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 2rem;

    .signature {
      flex: 1;
      text-align: center;

      .signature-line {
        width: 250px;
        height: 2px;
        background: var(--text-dark);
        margin: 0 auto 0.5rem;
      }

      .signature-name {
        font-size: 1rem;
        color: var(--text-dark);
        font-weight: 600;
        margin: 0 0 0.25rem;
      }

      .signature-title {
        font-size: 0.85rem;
        color: var(--text-light);
        margin: 0;
      }
    }

    .seal {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      
      svg {
        color: var(--primary-color);
        opacity: 0.2;
      }

      .seal-text {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 0.9rem;
        font-weight: 700;
        color: var(--primary-color);
        text-transform: uppercase;
        letter-spacing: 1px;
      }
    }
  }
}

@media print {
  .certificate-page {
    padding-top: 0;
    background: white;
  }

  .no-print {
    display: none !important;
  }

  .certificate-container {
    padding: 0;
    max-width: none;
  }

  .certificate {
    box-shadow: none;
    width: 100%;
    height: 100vh;
    aspect-ratio: auto;
  }

  .certificate-border {
    width: calc(100% - 80px);
    height: calc(100% - 80px);
  }
}

@media (max-width: 768px) {
  .certificate-actions {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;

    .back-button,
    .print-button {
      justify-content: center;
    }
  }

  .certificate {
    aspect-ratio: auto;
    min-height: 100vh;
  }

  .certificate-border {
    padding: 2rem;
  }

  .certificate-header h1 {
    font-size: 2rem;
  }

  .certificate-body {
    .recipient-name {
      font-size: 2rem;
    }

    .course-title {
      font-size: 1.5rem;
    }

    .certificate-details {
      flex-direction: column;
      gap: 1rem;
    }
  }

  .signature-section {
    flex-direction: column !important;
    align-items: center !important;
  }
}
</style>
