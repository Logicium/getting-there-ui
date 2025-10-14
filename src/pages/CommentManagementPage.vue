<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const isLoading = ref(true);
const error = ref<string | null>(null);
const success = ref<string | null>(null);
const action = ref<'approve' | 'delete' | null>(null);

const processCommentAction = async () => {
  isLoading.value = true;
  error.value = null;
  success.value = null;

  try {
    const token = route.query.token as string;
    const commentId = route.query.id as string;
    const actionType = route.path.includes('approve') ? 'approve' : 'delete';

    action.value = actionType;

    if (!token || !commentId) {
      throw new Error('Missing required parameters');
    }

    // Determine the endpoint
    const endpoint = actionType === 'approve'
        ? `${import.meta.env.VITE_API_URL}/comments/approve?id=${commentId}`
        : `${import.meta.env.VITE_API_URL}/comments/delete?id=${commentId}`;

    const response = await fetch(endpoint, {
      method: actionType === 'approve' ? 'POST' : 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to ${actionType} comment`);
    }

    success.value = actionType === 'approve'
        ? 'Comment approved successfully! The comment is now visible on the blog post.'
        : 'Comment deleted successfully! The comment has been removed.';

  } catch (err) {
    console.error('Comment action error:', err);
    error.value = err instanceof Error ? err.message : 'An error occurred processing your request';
  } finally {
    isLoading.value = false;
  }
};

const goHome = () => {
  router.push('/');
};

const goToBlog = () => {
  router.push('/blog');
};

onMounted(() => {
  processCommentAction();
});
</script>

<template>
  <div class="comment-management-page">
    <!-- Loading State -->
    <div v-if="isLoading" class="status-container">
      <div class="loading-spinner"></div>
      <h2>Processing Request...</h2>
      <p>Please wait while we {{ action === 'approve' ? 'approve' : 'delete' }} the comment.</p>
    </div>

    <!-- Success State -->
    <div v-else-if="success" class="status-container success">
      <div class="status-icon success-icon">✓</div>
      <h1>{{ action === 'approve' ? 'Comment Approved' : 'Comment Deleted' }}</h1>
      <p class="status-message">{{ success }}</p>

      <div class="success-details">
        <div class="detail-card">
          <div class="detail-icon">
            {{ action === 'approve' ? '✅' : '🗑️' }}
          </div>
          <div class="detail-content">
            <h3>Action Completed</h3>
            <p>
              {{ action === 'approve'
                ? 'The comment has been approved and is now visible to all visitors on the blog post.'
                : 'The comment has been permanently removed from the system.'
              }}
            </p>
          </div>
        </div>

        <div class="detail-card" v-if="action === 'approve'">
          <div class="detail-icon">📧</div>
          <div class="detail-content">
            <h3>Commenter Notified</h3>
            <p>The commenter will be notified that their comment has been approved and is now live.</p>
          </div>
        </div>
      </div>

      <div class="action-buttons">
        <button @click="goToBlog" class="cta-btn primary">
          View Blog Posts
        </button>
        <button @click="goHome" class="cta-btn secondary">
          Go Home
        </button>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="status-container error">
      <div class="status-icon error-icon">✕</div>
      <h1>Action Failed</h1>
      <p class="status-message">{{ error }}</p>

      <div class="error-details">
        <h3>Common Issues:</h3>
        <ul>
          <li>The authentication token may have expired</li>
          <li>The comment may have already been processed</li>
          <li>There may be a network connectivity issue</li>
          <li>You may not have permission to perform this action</li>
        </ul>
      </div>

      <div class="action-buttons">
        <button @click="processCommentAction" class="cta-btn primary">
          Try Again
        </button>
        <button @click="goHome" class="cta-btn secondary">
          Go Home
        </button>
      </div>

      <div class="support-info">
        <p>Need help? Contact support at <a href="mailto:support@gthere.net">support@gthere.net</a></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.comment-management-page {
  min-height: 100vh;
  background: var(--bg-light);
  padding: 6rem 2rem 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-container {
  max-width: 700px;
  width: 100%;
  background: white;
  padding: 4rem 3rem;
  border-radius: 20px;
  box-shadow: 0 8px 30px var(--shadow-light);
  text-align: center;
  border: 1px solid var(--border-light);
}

.loading-spinner {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(74, 124, 89, 0.1);
  border-radius: 50%;
  border-top-color: var(--primary-color);
  margin: 0 auto 2rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.status-container h2 {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text-dark);
}

.status-container p {
  color: var(--text-light);
  font-size: 1.1rem;
  line-height: 1.6;
}

.status-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 2rem;
  animation: scaleIn 0.5s ease;
}

@keyframes scaleIn {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.success-icon {
  background: var(--success-color);
  color: white;
}

.error-icon {
  background: var(--warning-color);
  color: white;
}

.status-container h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text-dark);
  font-family: 'Playfair Display', serif;
}

.status-message {
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.success-details {
  margin: 2rem 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.detail-card {
  background: var(--bg-light);
  padding: 1.5rem;
  border-radius: 15px;
  display: flex;
  gap: 1rem;
  text-align: left;
  border: 1px solid var(--border-light);
}

.detail-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.detail-content h3 {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--text-dark);
}

.detail-content p {
  margin: 0;
  font-size: 0.95rem;
  color: var(--text-light);
  line-height: 1.5;
}

.error-details {
  background: rgba(231, 111, 81, 0.1);
  padding: 1.5rem;
  border-radius: 15px;
  margin: 2rem 0;
  text-align: left;
  border: 1px solid rgba(231, 111, 81, 0.2);
}

.error-details h3 {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text-dark);
}

.error-details ul {
  margin: 0;
  padding-left: 1.5rem;
}

.error-details li {
  color: var(--text-light);
  margin-bottom: 0.5rem;
  line-height: 1.5;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  flex-wrap: wrap;
}

.cta-btn {
  padding: 1rem 2rem;
  border-radius: 25px;
  font-weight: 700;
  font-size: 1.05rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.cta-btn.primary {
  background: var(--primary-color);
  color: white;
  box-shadow: 0 4px 15px var(--shadow-light);
}

.cta-btn.primary:hover {
  background: var(--secondary-color);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px var(--shadow-medium);
}

.cta-btn.secondary {
  background: white;
  color: var(--text-dark);
  border: 2px solid var(--border-light);
}

.cta-btn.secondary:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.support-info {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-light);
}

.support-info p {
  font-size: 0.9rem;
  color: var(--text-light);
}

.support-info a {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
}

.support-info a:hover {
  color: var(--secondary-color);
  text-decoration: underline;
}

@media (max-width: 640px) {
  .comment-management-page {
    padding: 5rem 1rem 3rem;
  }

  .status-container {
    padding: 3rem 2rem;
  }

  .status-container h1 {
    font-size: 2rem;
  }

  .detail-card {
    flex-direction: column;
    text-align: center;
  }

  .action-buttons {
    flex-direction: column;
    width: 100%;
  }

  .cta-btn {
    width: 100%;
  }
}
</style>