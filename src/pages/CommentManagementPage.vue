<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { AppButton, AppCard, AppContainer, AppEyebrow, AppHero, AppSection, AppSpinner } from '@/components/ui'

const route = useRoute()
const router = useRouter()

const isLoading = ref(true)
const error = ref<string | null>(null)
const success = ref<string | null>(null)
const action = ref<'approve' | 'delete' | null>(null)

const processCommentAction = async () => {
  isLoading.value = true
  error.value = null
  success.value = null

  try {
    const token = route.query.token as string
    const commentId = route.query.id as string
    const actionType = route.path.includes('approve') ? 'approve' : 'delete'
    action.value = actionType

    if (!token || !commentId) {
      throw new Error('Missing required parameters')
    }

    const endpoint =
      actionType === 'approve'
        ? `${import.meta.env.VITE_API_URL}/comments/approve?id=${commentId}`
        : `${import.meta.env.VITE_API_URL}/comments/delete?id=${commentId}`

    const response = await fetch(endpoint, {
      method: actionType === 'approve' ? 'POST' : 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Failed to ${actionType} comment`)
    }

    success.value =
      actionType === 'approve'
        ? 'Comment approved successfully. It is now visible on the blog post.'
        : 'Comment deleted successfully. It has been removed.'
  } catch (err) {
    console.error('Comment action error:', err)
    error.value = err instanceof Error ? err.message : 'An error occurred processing your request'
  } finally {
    isLoading.value = false
  }
}

onMounted(processCommentAction)
</script>

<template>
  <main class="comment-management">
    <AppHero variant="compact" tone="cream" align="center">
      <template #eyebrow>
        <AppEyebrow tone="cobalt">Comment moderation</AppEyebrow>
      </template>
      <template #title>
        <template v-if="isLoading">Processing…</template>
        <template v-else-if="success">{{ action === 'approve' ? 'Comment approved' : 'Comment deleted' }}</template>
        <template v-else>Action failed</template>
      </template>
    </AppHero>

    <AppSection tone="cream-2" pad="lg">
      <AppContainer size="sm">
        <!-- Loading -->
        <AppCard
          v-if="isLoading"
          variant="plaque"
          tone="paper"
          shadow-tone="cobalt"
          pad="lg"
          class="comment-management__card"
        >
          <div class="comment-management__loading">
            <AppSpinner />
            <p>Please wait while we {{ action === 'approve' ? 'approve' : 'delete' }} the comment.</p>
          </div>
        </AppCard>

        <!-- Success -->
        <AppCard
          v-else-if="success"
          variant="plaque"
          tone="paper"
          shadow-tone="mint"
          pad="lg"
          class="comment-management__card"
        >
          <p class="comment-management__lede">{{ success }}</p>

          <ul class="comment-management__details">
            <li>
              <span class="comment-management__detail-icon" aria-hidden="true">
                {{ action === 'approve' ? '✓' : '✕' }}
              </span>
              <div>
                <h3>Action completed</h3>
                <p>
                  {{
                    action === 'approve'
                      ? 'The comment has been approved and is now visible to all visitors on the blog post.'
                      : 'The comment has been permanently removed from the system.'
                  }}
                </p>
              </div>
            </li>
            <li v-if="action === 'approve'">
              <span class="comment-management__detail-icon" aria-hidden="true">✉</span>
              <div>
                <h3>Commenter notified</h3>
                <p>The commenter will be notified that their comment has been approved and is now live.</p>
              </div>
            </li>
          </ul>

          <template #footer>
            <div class="comment-management__actions">
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
          class="comment-management__card"
        >
          <p class="comment-management__lede comment-management__lede--error">{{ error }}</p>

          <div class="comment-management__error-box">
            <h3>Common issues</h3>
            <ul>
              <li>The authentication token may have expired</li>
              <li>The comment may have already been processed</li>
              <li>There may be a network connectivity issue</li>
              <li>You may not have permission to perform this action</li>
            </ul>
          </div>

          <template #footer>
            <div class="comment-management__actions">
              <AppButton variant="primary" @click="processCommentAction">Try again</AppButton>
              <AppButton variant="ghost" @click="router.push('/')">Go home</AppButton>
            </div>
            <p class="comment-management__support">
              Need help? Contact <a href="mailto:support@gthere.net">support@gthere.net</a>
            </p>
          </template>
        </AppCard>
      </AppContainer>
    </AppSection>
  </main>
</template>

<style scoped lang="scss">
.comment-management {
  &__card { margin-block: var(--s-3); }

  &__loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--s-4);
    padding: var(--s-6) 0;
    color: var(--c-text-muted);
    text-align: center;

    p { margin: 0; }
  }

  &__lede {
    font-family: var(--font-display);
    font-size: var(--fs-lg);
    color: var(--c-ink);
    margin: 0 0 var(--s-5);
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
    font-size: var(--fs-lg);
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

      li {
        margin-bottom: var(--s-2);
        line-height: var(--lh-base);
      }
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

    a {
      color: var(--c-cobalt);
      font-weight: 600;
    }
  }
}
</style>
