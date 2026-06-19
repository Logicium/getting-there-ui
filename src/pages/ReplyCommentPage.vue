<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  AppButton,
  AppCard,
  AppContainer,
  AppEyebrow,
  AppField,
  AppHero,
  AppInput,
  AppSection,
  AppSpinner,
  AppTextarea,
} from '@/components/ui'

const route = useRoute()
const router = useRouter()

const isLoading = ref(true)
const isSubmitting = ref(false)
const error = ref<string | null>(null)
const success = ref<string | null>(null)
const formVisible = ref(false)

const commentData = ref({
  id: '',
  name: '',
  email: '',
  content: '',
  documentId: '',
})

const replyData = ref({
  name: '',
  content: '',
})

const loadComment = async () => {
  isLoading.value = true
  error.value = null
  success.value = null
  formVisible.value = false

  try {
    const token = route.query.token as string
    const commentId = route.query.id as string

    if (!token || !commentId) throw new Error('Missing required parameters')

    const response = await fetch(`${import.meta.env.VITE_API_URL}/comments/${commentId}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Failed to load comment')
    }

    const data = await response.json()
    commentData.value = data
    formVisible.value = true
  } catch (err) {
    console.error('Comment loading error:', err)
    error.value = err instanceof Error ? err.message : 'An error occurred loading the comment'
  } finally {
    isLoading.value = false
  }
}

const submitReply = async () => {
  isSubmitting.value = true
  error.value = null

  try {
    const token = route.query.token as string
    const commentId = route.query.id as string

    if (!token || !commentId) throw new Error('Missing required parameters')

    const response = await fetch(`${import.meta.env.VITE_API_URL}/comments/reply`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: replyData.value.name,
        email: 'admin@gettingtherebooks.com',
        content: replyData.value.content,
        documentId: commentData.value.documentId,
        parentId: commentId,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Failed to submit reply')
    }

    formVisible.value = false
    success.value =
      'Your reply has been submitted successfully and the original comment has been approved.'
  } catch (err) {
    console.error('Reply submission error:', err)
    error.value = err instanceof Error ? err.message : 'An error occurred submitting your reply'
  } finally {
    isSubmitting.value = false
  }
}

onMounted(loadComment)
</script>

<template>
  <main class="reply-comment">
    <AppHero variant="compact" tone="cream" align="center">
      <template #eyebrow>
        <AppEyebrow tone="cobalt">Comment moderation</AppEyebrow>
      </template>
      <template #title>
        <template v-if="isLoading && !formVisible">Loading comment…</template>
        <template v-else-if="formVisible">Reply to comment</template>
        <template v-else-if="success">Reply submitted</template>
        <template v-else>Action failed</template>
      </template>
    </AppHero>

    <AppSection tone="cream-2" pad="lg">
      <AppContainer size="md">
        <!-- Loading -->
        <AppCard
          v-if="isLoading && !formVisible"
          variant="plaque"
          tone="paper"
          shadow-tone="cobalt"
          pad="lg"
        >
          <div class="reply-comment__loading">
            <AppSpinner />
            <p>Please wait while we retrieve the comment information.</p>
          </div>
        </AppCard>

        <!-- Form -->
        <template v-else-if="formVisible">
          <AppCard
            variant="flat"
            tone="paper"
            pad="lg"
            class="reply-comment__original"
          >
            <template #eyebrow>
              <AppEyebrow tone="fuchsia">Original comment</AppEyebrow>
            </template>
            <template #title>{{ commentData.name }}</template>
            <p class="reply-comment__meta">{{ commentData.email }}</p>
            <div class="reply-comment__content">{{ commentData.content }}</div>
          </AppCard>

          <AppCard
            variant="plaque"
            tone="paper"
            shadow-tone="cobalt"
            pad="lg"
            class="reply-comment__form-card"
          >
            <template #eyebrow>
              <AppEyebrow tone="cobalt">Your reply</AppEyebrow>
            </template>
            <template #title>Compose response</template>

            <form id="reply-form" class="reply-comment__form" @submit.prevent="submitReply">
              <AppField label="Your name" required>
                <template #default="{ id }">
                  <AppInput
                    :id="id"
                    v-model="replyData.name"
                    type="text"
                    placeholder="Enter your name"
                    required
                  />
                </template>
              </AppField>

              <AppField label="Your reply" required>
                <template #default="{ id }">
                  <AppTextarea
                    :id="id"
                    v-model="replyData.content"
                    placeholder="Enter your reply to this comment"
                    :rows="5"
                    required
                  />
                </template>
              </AppField>
            </form>

            <template #footer>
              <div class="reply-comment__actions">
                <AppButton
                  type="submit"
                  form="reply-form"
                  variant="primary"
                  :loading="isSubmitting"
                  :disabled="isSubmitting"
                >
                  {{ isSubmitting ? 'Submitting…' : 'Submit reply' }}
                </AppButton>
                <AppButton variant="ghost" @click="router.push('/')">Cancel</AppButton>
              </div>
            </template>
          </AppCard>
        </template>

        <!-- Success -->
        <AppCard
          v-else-if="success"
          variant="plaque"
          tone="paper"
          shadow-tone="mint"
          pad="lg"
        >
          <template #eyebrow>
            <AppEyebrow tone="mint">Done</AppEyebrow>
          </template>
          <template #title>Reply submitted</template>
          <p class="reply-comment__lede">{{ success }}</p>

          <ul class="reply-comment__details">
            <li>
              <span class="reply-comment__detail-icon" aria-hidden="true">✓</span>
              <div>
                <h3>Reply added</h3>
                <p>Your reply has been added to the comment and is now visible to all visitors.</p>
              </div>
            </li>
            <li>
              <span class="reply-comment__detail-icon" aria-hidden="true">👍</span>
              <div>
                <h3>Comment approved</h3>
                <p>The original comment has been automatically approved.</p>
              </div>
            </li>
          </ul>

          <template #footer>
            <div class="reply-comment__actions">
              <AppButton variant="primary" @click="router.push('/blog')">View blog posts</AppButton>
              <AppButton variant="ghost" @click="router.push('/')">Go home</AppButton>
            </div>
          </template>
        </AppCard>

        <!-- Error -->
        <AppCard
          v-else-if="error"
          variant="plaque"
          tone="paper"
          shadow-tone="fuchsia"
          pad="lg"
        >
          <template #eyebrow>
            <AppEyebrow tone="fuchsia">Failed</AppEyebrow>
          </template>
          <template #title>Action failed</template>
          <p class="reply-comment__lede reply-comment__lede--error">{{ error }}</p>

          <div class="reply-comment__error-box">
            <h3>Common issues</h3>
            <ul>
              <li>The authentication token may have expired</li>
              <li>The comment may have already been processed</li>
              <li>There may be a network connectivity issue</li>
              <li>You may not have permission to perform this action</li>
            </ul>
          </div>

          <template #footer>
            <div class="reply-comment__actions">
              <AppButton variant="primary" @click="loadComment">Try again</AppButton>
              <AppButton variant="ghost" @click="router.push('/')">Go home</AppButton>
            </div>
            <p class="reply-comment__support">
              Need help? Contact <a href="mailto:support@gthere.net">support@gthere.net</a>
            </p>
          </template>
        </AppCard>
      </AppContainer>
    </AppSection>
  </main>
</template>

<style scoped lang="scss">
.reply-comment {
  &__loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--s-4);
    padding: var(--s-5) 0;
    text-align: center;
    color: var(--c-text-muted);

    p { margin: 0; }
  }

  &__original {
    margin-bottom: var(--s-4);
  }

  &__meta {
    margin: 0 0 var(--s-3);
    font-size: var(--fs-sm);
    color: var(--c-text-subtle);
  }

  &__content {
    padding: var(--s-4);
    background: var(--c-cream-2);
    border: 2px solid var(--c-ink);
    border-radius: var(--r-md);
    line-height: var(--lh-base);
    color: var(--c-ink);
    white-space: pre-wrap;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: var(--s-4);
  }

  &__lede {
    margin: 0 0 var(--s-4);
    color: var(--c-ink);
    line-height: var(--lh-base);

    &--error { color: var(--c-fuchsia-deep); }
  }

  &__details {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: var(--s-3);

    li {
      display: flex;
      align-items: flex-start;
      gap: var(--s-3);
      padding: var(--s-4);
      background: var(--c-cream-2);
      border-radius: var(--r-md);
      border: 2px solid var(--c-ink);

      h3 {
        font-family: var(--font-display);
        font-size: var(--fs-md);
        color: var(--c-ink);
        margin: 0 0 var(--s-1);
      }

      p {
        margin: 0;
        color: var(--c-text-muted);
        font-size: var(--fs-sm);
        line-height: var(--lh-base);
      }
    }
  }

  &__detail-icon {
    display: inline-grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border-radius: 999px;
    background: var(--c-mint);
    color: var(--c-ink);
    font-weight: 800;
    font-size: var(--fs-md);
    flex-shrink: 0;
  }

  &__error-box {
    padding: var(--s-4);
    background: var(--c-cream-2);
    border-radius: var(--r-md);
    border: 2px solid var(--c-ink);

    h3 {
      margin: 0 0 var(--s-2);
      font-family: var(--font-display);
      color: var(--c-ink);
      font-size: var(--fs-md);
    }

    ul {
      margin: 0;
      padding-left: var(--s-5);
      color: var(--c-text-muted);

      li { margin-bottom: var(--s-2); line-height: var(--lh-base); }
    }
  }

  &__actions {
    display: flex;
    gap: var(--s-3);
    flex-wrap: wrap;
  }

  &__support {
    margin: var(--s-4) 0 0;
    font-size: var(--fs-sm);
    color: var(--c-text-muted);
    text-align: center;

    a { color: var(--c-cobalt); font-weight: 600; }
  }
}
</style>
