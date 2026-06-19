<script setup lang="ts">
import { computed, ref } from 'vue'
import { mockCourses, type Course } from '@/data/courses'
import { useRouter } from 'vue-router'
import {
  AppBadge,
  AppButton,
  AppCard,
  AppContainer,
  AppEmptyState,
  AppEyebrow,
  AppGrid,
  AppHero,
  AppSection,
} from '@/components/ui'

const router = useRouter()

type Level = Course['level']
const levels: Level[] = ['Beginner', 'Intermediate', 'Advanced']
const activeLevel = ref<Level | 'All'>('All')

const filteredCourses = computed(() =>
  activeLevel.value === 'All'
    ? mockCourses
    : mockCourses.filter((c) => c.level === activeLevel.value),
)

const featuredCourse = computed(() => filteredCourses.value[0])
const restCourses = computed(() => filteredCourses.value.slice(1))

type ShadowRotation = 'marigold' | 'fuchsia' | 'cobalt'
const rotatingShadows: ShadowRotation[] = ['marigold', 'fuchsia', 'cobalt']
const shadowFor = (i: number): ShadowRotation =>
  rotatingShadows[i % rotatingShadows.length]

function viewCourse(courseId: string) {
  router.push(`/classes/${courseId}`)
}

function setLevel(level: Level | 'All') {
  activeLevel.value = level
}

function clearFilter() {
  activeLevel.value = 'All'
}
</script>

<template>
  <main class="classes-page">
    <AppHero variant="editorial" tone="cream" align="left">
      <template #eyebrow>
        <AppEyebrow tone="cobalt">Online classes</AppEyebrow>
      </template>
      <template #title>Learn at your own pace</template>
      <template #lede>
        <p>
          Self-paced courses in positive psychology, resilience, and the
          gentle art of moving through change.
        </p>
      </template>
      <template #actions>
        <AppButton href="#catalog" variant="primary" size="lg">Browse the catalog</AppButton>
      </template>
    </AppHero>

    <AppSection tone="mint" pad="lg" id="catalog">
      <AppContainer size="lg">
        <header class="classes-head">
          <AppEyebrow tone="fuchsia">Filter</AppEyebrow>
          <h2 class="u-display u-display--sm">Browse by level</h2>
        </header>
        <div class="classes-filters" role="tablist" aria-label="Filter by level">
          <button
            type="button"
            class="classes-filter-btn"
            :aria-pressed="activeLevel === 'All'"
            @click="setLevel('All')"
          >
            <AppBadge :tone="activeLevel === 'All' ? 'ink' : 'cream'" filled size="md">
              All courses
            </AppBadge>
          </button>
          <button
            v-for="level in levels"
            :key="level"
            type="button"
            class="classes-filter-btn"
            :aria-pressed="activeLevel === level"
            @click="setLevel(level)"
          >
            <AppBadge
              :tone="activeLevel === level ? 'ink' : 'cream'"
              filled
              size="md"
            >
              {{ level }}
            </AppBadge>
          </button>
        </div>
      </AppContainer>
    </AppSection>

    <AppSection v-if="featuredCourse" tone="cream-2" pad="xl">
      <AppContainer size="lg">
        <header class="classes-head">
          <AppEyebrow tone="marigold">Featured course</AppEyebrow>
          <h2 class="u-display u-display--md">Start here</h2>
        </header>
        <AppCard
          variant="postcard"
          tone="paper"
          shadow-tone="cobalt"
          pad="lg"
          interactive
          class="classes-featured"
          @click="viewCourse(featuredCourse.id)"
        >
          <template #media>
            <div class="classes-featured__media">
              <img :src="featuredCourse.thumbnailUrl" :alt="featuredCourse.title" />
              <span class="classes-featured__level">
                <AppBadge tone="cobalt" filled>{{ featuredCourse.level }}</AppBadge>
              </span>
            </div>
          </template>
          <template #eyebrow>
            <AppEyebrow tone="cobalt">
              {{ featuredCourse.duration }} · {{ featuredCourse.totalLessons }} lessons
            </AppEyebrow>
          </template>
          <template #title>{{ featuredCourse.title }}</template>
          <p class="classes-featured__subtitle">{{ featuredCourse.subtitle }}</p>
          <p class="classes-featured__desc">{{ featuredCourse.description }}</p>
          <div class="classes-featured__instructor">
            <img
              v-if="featuredCourse.instructor.avatar"
              :src="featuredCourse.instructor.avatar"
              :alt="featuredCourse.instructor.name"
            />
            <div>
              <div class="classes-featured__name">{{ featuredCourse.instructor.name }}</div>
              <div class="classes-featured__title">{{ featuredCourse.instructor.title }}</div>
            </div>
          </div>
          <template #footer>
            <AppButton :to="`/classes/${featuredCourse.id}`" variant="primary" size="lg">
              View course
            </AppButton>
          </template>
        </AppCard>
      </AppContainer>
    </AppSection>

    <AppSection tone="cream" pad="xl">
      <AppContainer size="lg">
        <header class="classes-head">
          <AppEyebrow tone="cobalt">More classes</AppEyebrow>
          <h2 class="u-display u-display--md">Keep exploring</h2>
        </header>

        <AppEmptyState
          v-if="filteredCourses.length === 0"
          title="No classes match that filter"
          message="Try a different level or clear filters to see everything."
        >
          <template #actions>
            <AppButton variant="primary" @click="clearFilter">Show all classes</AppButton>
          </template>
        </AppEmptyState>

        <AppEmptyState
          v-else-if="restCourses.length === 0"
          title="That's everything for now"
          message="More classes are on the way."
        />

        <AppGrid v-else :min="300" gap="md">
          <AppCard
            v-for="(course, i) in restCourses"
            :key="course.id"
            variant="plaque"
            tone="paper"
            :shadow-tone="shadowFor(i)"
            interactive
            pad="md"
            class="classes-card"
            @click="viewCourse(course.id)"
          >
            <template #media>
              <div class="classes-card__media">
                <img :src="course.thumbnailUrl" :alt="course.title" />
                <span class="classes-card__level">
                  <AppBadge tone="ink" filled size="sm">{{ course.level }}</AppBadge>
                </span>
              </div>
            </template>
            <template #eyebrow>
              <AppEyebrow tone="fuchsia">
                {{ course.duration }} · {{ course.totalLessons }} lessons
              </AppEyebrow>
            </template>
            <template #title>{{ course.title }}</template>
            <p class="classes-card__subtitle">{{ course.subtitle }}</p>
            <p class="classes-card__desc">{{ course.description }}</p>
            <div class="classes-card__instructor">
              <img
                v-if="course.instructor.avatar"
                :src="course.instructor.avatar"
                :alt="course.instructor.name"
              />
              <div>
                <div class="classes-card__name">{{ course.instructor.name }}</div>
                <div class="classes-card__title">{{ course.instructor.title }}</div>
              </div>
            </div>
            <template #footer>
              <AppButton :to="`/classes/${course.id}`" variant="secondary">
                View course
              </AppButton>
            </template>
          </AppCard>
        </AppGrid>
      </AppContainer>
    </AppSection>
  </main>
</template>

<style scoped lang="scss">
.classes-head {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--s-3);
  text-align: center;
  margin-bottom: var(--s-7);
}

.classes-filters {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s-3);
  justify-content: center;
}

.classes-filter-btn {
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  font: inherit;
  color: inherit;
  border-radius: var(--r-pill);

  &:focus-visible {
    outline: 3px solid var(--c-cobalt);
    outline-offset: 3px;
  }
}

.classes-featured {
  &__media {
    position: relative;
    aspect-ratio: 16 / 9;
    overflow: hidden;
    border-bottom: 2px solid var(--c-ink);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__level {
    position: absolute;
    top: var(--s-4);
    right: var(--s-4);
  }

  &__subtitle {
    margin: 0;
    color: var(--c-cobalt);
    font-weight: 600;
    font-size: var(--fs-lg);
  }

  &__desc {
    margin: 0;
    color: var(--c-text-muted);
    line-height: var(--lh-base);
  }

  &__instructor {
    display: flex;
    align-items: center;
    gap: var(--s-3);
    margin-top: var(--s-3);

    img {
      width: 56px;
      height: 56px;
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

.classes-card {
  &__media {
    position: relative;
    aspect-ratio: 4 / 3;
    overflow: hidden;
    border-bottom: 2px solid var(--c-ink);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__level {
    position: absolute;
    top: var(--s-3);
    right: var(--s-3);
  }

  &__subtitle {
    margin: 0;
    color: var(--c-cobalt);
    font-weight: 600;
    font-size: var(--fs-sm);
  }

  &__desc {
    margin: 0;
    color: var(--c-text-muted);
    line-height: var(--lh-base);
    font-size: var(--fs-sm);
  }

  &__instructor {
    display: flex;
    align-items: center;
    gap: var(--s-3);
    margin-top: auto;

    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid var(--c-ink);
    }
  }

  &__name {
    font-weight: 700;
    color: var(--c-ink);
    font-size: var(--fs-sm);
  }

  &__title {
    font-size: var(--fs-xs);
    color: var(--c-text-muted);
  }
}
</style>
