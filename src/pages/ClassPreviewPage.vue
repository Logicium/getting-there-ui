<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getCourseById } from '@/data/courses'
import { useAuthStore } from '@/stores/auth'
import {
  AppBadge,
  AppButton,
  AppCard,
  AppContainer,
  AppEyebrow,
  AppHero,
  AppSection,
} from '@/components/ui'

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
    <AppHero variant="editorial" tone="cream" align="left">
      <template #eyebrow>
        <AppEyebrow tone="cobalt">
          <router-link to="/classes" class="preview-crumb">Classes</router-link>
          / {{ course.title }}
        </AppEyebrow>
      </template>
      <template #title>{{ course.title }}</template>
      <template #lede>
        <p>{{ course.subtitle }}</p>
      </template>
      <template #actions>
        <AppButton
          v-if="authStore.isAuthenticated && authStore.isSubscribed"
          variant="primary"
          size="lg"
          @click="startCourse"
        >
          Start course
        </AppButton>
        <AppButton v-else variant="primary" size="lg" @click="handleSubscribe">
          Get access
        </AppButton>
      </template>
      <template #meta>
        <ul class="preview-meta">
          <li>
            <span class="preview-meta__label">Duration</span>
            <AppBadge tone="cobalt" filled>{{ course.duration }}</AppBadge>
          </li>
          <li>
            <span class="preview-meta__label">Lessons</span>
            <AppBadge tone="marigold" filled>{{ course.totalLessons }}</AppBadge>
          </li>
          <li>
            <span class="preview-meta__label">Level</span>
            <AppBadge tone="fuchsia" filled>{{ course.level }}</AppBadge>
          </li>
          <li v-if="course.instructor.avatar" class="preview-meta__instructor">
            <img :src="course.instructor.avatar" :alt="course.instructor.name" />
            <div>
              <div class="preview-meta__name">{{ course.instructor.name }}</div>
              <div class="preview-meta__title">{{ course.instructor.title }}</div>
            </div>
          </li>
        </ul>
      </template>
    </AppHero>

    <AppSection tone="cream-2" pad="lg">
      <AppContainer size="lg">
        <div class="preview-video">
          <iframe
            :src="course.introVideo.videoUrl"
            :title="course.introVideo.title"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      </AppContainer>
    </AppSection>

    <AppSection tone="cream" pad="xl">
      <AppContainer size="lg">
        <div class="preview-grid">
          <div class="preview-main">
            <section class="preview-section">
              <AppEyebrow tone="cobalt">About this course</AppEyebrow>
              <h2 class="u-display u-display--md">What it's about</h2>
              <div class="u-prose">
                <p>{{ course.longDescription }}</p>
              </div>
            </section>

            <section class="preview-section">
              <AppEyebrow tone="marigold">What you'll learn</AppEyebrow>
              <h2 class="u-display u-display--md">Skills &amp; outcomes</h2>
              <ul class="preview-benefits">
                <li v-for="(benefit, index) in course.benefits" :key="index">
                  <span class="preview-benefits__bullet" aria-hidden="true">✓</span>
                  <span>{{ benefit }}</span>
                </li>
              </ul>
            </section>

            <section class="preview-section">
              <AppEyebrow tone="fuchsia">Curriculum</AppEyebrow>
              <h2 class="u-display u-display--md">Course modules</h2>
              <div class="preview-curriculum">
                <AppCard
                  v-for="(chapter, index) in course.chapters"
                  :key="chapter.id"
                  variant="flat"
                  tone="paper"
                  pad="md"
                >
                  <template #eyebrow>
                    <AppEyebrow tone="cobalt">Chapter {{ index + 1 }}</AppEyebrow>
                  </template>
                  <template #title>{{ chapter.title }}</template>
                  <p class="preview-chapter__desc">{{ chapter.description }}</p>
                  <ul class="preview-lessons">
                    <li v-for="item in chapter.content" :key="item.id">
                      <span class="preview-lessons__type" aria-hidden="true">
                        {{ 'videoUrl' in item ? '▸' : '✎' }}
                      </span>
                      <span class="preview-lessons__title">{{ item.title }}</span>
                      <span v-if="'duration' in item" class="preview-lessons__duration">
                        {{ item.duration }}
                      </span>
                    </li>
                  </ul>
                  <template #footer>
                    <AppBadge tone="ink">{{ chapter.content.length }} lessons</AppBadge>
                  </template>
                </AppCard>

                <AppCard variant="flat" tone="paper" pad="md">
                  <template #eyebrow>
                    <AppEyebrow tone="fuchsia">Assessment</AppEyebrow>
                  </template>
                  <template #title>Final exam</template>
                  <p class="preview-chapter__desc">{{ course.finalExam.description }}</p>
                  <template #footer>
                    <AppBadge tone="ink">{{ course.finalExam.questions.length }} questions</AppBadge>
                  </template>
                </AppCard>
              </div>
            </section>

            <section class="preview-section">
              <AppEyebrow tone="cobalt">Your guide</AppEyebrow>
              <h2 class="u-display u-display--md">About the instructor</h2>
              <AppCard variant="plaque" tone="paper" shadow-tone="cobalt" pad="lg">
                <div class="preview-instructor">
                  <img
                    v-if="course.instructor.avatar"
                    :src="course.instructor.avatar"
                    :alt="course.instructor.name"
                  />
                  <div>
                    <h3 class="preview-instructor__name">{{ course.instructor.name }}</h3>
                    <p class="preview-instructor__title">{{ course.instructor.title }}</p>
                  </div>
                </div>
              </AppCard>
            </section>
          </div>

          <aside class="preview-sidebar">
            <AppCard
              variant="ticket"
              tone="paper"
              shadow-tone="fuchsia"
              pad="lg"
              class="preview-enroll"
            >
              <template #eyebrow>
                <AppEyebrow v-if="!authStore.isAuthenticated" tone="fuchsia">Membership</AppEyebrow>
                <AppEyebrow v-else-if="!authStore.isSubscribed" tone="fuchsia">Subscribe</AppEyebrow>
                <AppEyebrow v-else tone="mint">Ready</AppEyebrow>
              </template>

              <template #title>
                <template v-if="!authStore.isAuthenticated">Start learning today</template>
                <template v-else-if="!authStore.isSubscribed">Subscribe to access</template>
                <template v-else>Ready to start?</template>
              </template>

              <!-- Default slot body, switched by auth state -->
              <template v-if="!authStore.isAuthenticated">
                <p class="preview-enroll__price">
                  $10<span class="preview-enroll__period">/month</span>
                </p>
                <p class="preview-enroll__price-desc">
                  Get unlimited access to all courses
                </p>
                <ul class="preview-enroll__benefits">
                  <li><span aria-hidden="true">✓</span> Access to all courses</li>
                  <li><span aria-hidden="true">✓</span> Certificate of completion</li>
                  <li><span aria-hidden="true">✓</span> New courses added monthly</li>
                  <li><span aria-hidden="true">✓</span> Cancel anytime</li>
                </ul>
              </template>

              <template v-else-if="!authStore.isSubscribed">
                <p class="preview-enroll__price">
                  $10<span class="preview-enroll__period">/month</span>
                </p>
                <p class="preview-enroll__price-desc">
                  Get unlimited access to all courses
                </p>
                <ul class="preview-enroll__benefits">
                  <li><span aria-hidden="true">✓</span> Access to all courses</li>
                  <li><span aria-hidden="true">✓</span> Certificate of completion</li>
                  <li><span aria-hidden="true">✓</span> New courses added monthly</li>
                  <li><span aria-hidden="true">✓</span> Cancel anytime</li>
                </ul>
              </template>

              <template v-else>
                <p class="preview-enroll__price-desc">
                  You're all set! Begin your learning journey now.
                </p>
              </template>

              <template #footer>
                <template v-if="!authStore.isAuthenticated">
                  <AppButton variant="primary" size="lg" block @click="handleSubscribe">
                    Sign up &amp; start learning
                  </AppButton>
                  <p class="preview-enroll__login">
                    Already have an account?
                    <router-link to="/login">Log in</router-link>
                  </p>
                </template>
                <AppButton
                  v-else-if="!authStore.isSubscribed"
                  variant="primary"
                  size="lg"
                  block
                  @click="handleSubscribe"
                >
                  Subscribe now
                </AppButton>
                <AppButton
                  v-else
                  variant="primary"
                  size="lg"
                  block
                  @click="startCourse"
                >
                  Start course
                </AppButton>
              </template>
            </AppCard>
          </aside>
        </div>
      </AppContainer>
    </AppSection>
  </main>
</template>

<style scoped lang="scss">
.preview-crumb {
  color: inherit;
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 3px;

  &:hover {
    color: var(--c-cobalt-deep);
  }
}

.preview-meta {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: var(--s-4) var(--s-5);
  align-items: center;

  li {
    display: flex;
    align-items: center;
    gap: var(--s-2);
  }

  &__label {
    font-family: var(--font-body);
    font-size: var(--fs-xs);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: var(--ls-wide);
    color: var(--c-text-muted);
  }

  &__instructor {
    align-items: center;
    gap: var(--s-3);

    img {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid var(--c-ink);
    }
  }

  &__name {
    font-weight: 700;
    color: var(--c-ink);
  }

  &__title {
    font-size: var(--fs-sm);
    color: var(--c-text-muted);
  }
}

.preview-video {
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
  border: 3px solid var(--c-ink);
  border-radius: var(--r-lg);
  box-shadow: var(--shadow-block);

  iframe {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }
}

.preview-grid {
  display: grid;
  gap: var(--s-7);
  align-items: start;

  @media (min-width: 968px) {
    grid-template-columns: minmax(0, 1fr) 380px;
    gap: var(--s-8);
  }
}

.preview-main {
  display: flex;
  flex-direction: column;
  gap: var(--s-9);
  min-width: 0;
}

.preview-section {
  display: flex;
  flex-direction: column;
  gap: var(--s-4);
}

.preview-benefits {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--s-3);

  li {
    display: flex;
    align-items: flex-start;
    gap: var(--s-3);
    color: var(--c-text);
    line-height: var(--lh-base);
  }

  &__bullet {
    color: var(--c-mint-deep);
    font-weight: 800;
    flex-shrink: 0;
    margin-top: 0.1em;
  }
}

.preview-curriculum {
  display: flex;
  flex-direction: column;
  gap: var(--s-4);
}

.preview-chapter__desc {
  margin: 0;
  color: var(--c-text-muted);
  line-height: var(--lh-base);
}

.preview-lessons {
  list-style: none;
  padding: 0;
  margin: var(--s-3) 0 0;
  display: flex;
  flex-direction: column;

  li {
    display: flex;
    align-items: center;
    gap: var(--s-3);
    padding: var(--s-3) 0;
    border-top: 1px solid var(--c-cream-3);
    color: var(--c-text-muted);
  }

  &__type {
    color: var(--c-cobalt);
    font-weight: 700;
    flex-shrink: 0;
  }

  &__title {
    flex: 1;
    color: var(--c-text);
  }

  &__duration {
    color: var(--c-text-subtle);
    font-size: var(--fs-sm);
  }
}

.preview-instructor {
  display: flex;
  align-items: center;
  gap: var(--s-4);

  img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid var(--c-ink);
  }

  &__name {
    margin: 0;
    font-family: var(--font-display);
    font-weight: 700;
    color: var(--c-ink);
    font-size: var(--fs-xl);
  }

  &__title {
    margin: var(--s-1) 0 0;
    color: var(--c-text-muted);
  }
}

.preview-sidebar {
  @media (min-width: 968px) {
    position: sticky;
    top: calc(80px + var(--s-4));
  }
}

.preview-enroll {
  &__price {
    margin: 0;
    font-family: var(--font-display);
    font-size: var(--fs-4xl);
    font-weight: 700;
    color: var(--c-fuchsia-deep);
    line-height: var(--lh-tight);
  }

  &__period {
    font-family: var(--font-body);
    font-size: var(--fs-lg);
    font-weight: 400;
    color: var(--c-text-muted);
  }

  &__price-desc {
    margin: 0;
    color: var(--c-text-muted);
    line-height: var(--lh-base);
  }

  &__benefits {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: var(--s-2);

    li {
      display: flex;
      align-items: center;
      gap: var(--s-2);
      color: var(--c-text);

      span {
        color: var(--c-mint-deep);
        font-weight: 800;
      }
    }
  }

  &__login {
    margin: var(--s-3) 0 0;
    text-align: center;
    color: var(--c-text-muted);
    font-size: var(--fs-sm);

    a {
      color: var(--c-cobalt);
      text-decoration: underline;
      font-weight: 600;

      &:hover {
        color: var(--c-cobalt-deep);
      }
    }
  }
}
</style>
