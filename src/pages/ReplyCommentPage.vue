<template>
  <div class="reply-comment-page">
    <!-- Loading State -->
    <div v-if="isLoading && !formVisible" class="status-container">
      <div class="loading-spinner"></div>
      <h2>Loading Comment...</h2>
      <p>Please wait while we retrieve the comment information.</p>
    </div>

    <!-- Reply Form -->
    <div v-else-if="formVisible" class="status-container">
      <h1>Reply to Comment</h1>
      <div class="original-comment">
        <h3>Original Comment</h3>
        <div class="comment-details">
          <p><strong>From:</strong> {{ commentData.name }}</p>
          <p><strong>Email:</strong> {{ commentData.email }}</p>
          <p><strong>Content:</strong></p>
          <div class="comment-content">{{ commentData.content }}</div>
        </div>
      </div>

      <form @submit.prevent="submitReply" class="reply-form">
        <div class="form-group">
          <label for="adminName">Your Name</label>
          <input 
            type="text" 
            id="adminName" 
            v-model="replyData.name" 
            required 
            placeholder="Enter your name"
          >
        </div>
        
        <div class="form-group">
          <label for="replyContent">Your Reply</label>
          <textarea 
            id="replyContent" 
            v-model="replyData.content" 
            required 
            placeholder="Enter your reply to this comment"
            rows="5"
          ></textarea>
        </div>

        <div class="action-buttons">
          <button type="submit" class="cta-btn primary" :disabled="isSubmitting">
            <span v-if="isSubmitting">Submitting...</span>
            <span v-else>Submit Reply</span>
          </button>
          <button type="button" @click="goHome" class="cta-btn secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>

    <!-- Success State -->
    <div v-else-if="success" class="status-container success">
      <div class="status-icon success-icon">✓</div>
      <h1>Reply Submitted</h1>
      <p class="status-message">{{ success }}</p>

      <div class="success-details">
        <div class="detail-card">
          <div class="detail-icon">✅</div>
          <div class="detail-content">
            <h3>Reply Added</h3>
            <p>Your reply has been added to the comment and is now visible to all visitors.</p>
          </div>
        </div>

        <div class="detail-card">
          <div class="detail-icon">👍</div>
          <div class="detail-content">
            <h3>Comment Approved</h3>
            <p>The original comment has been automatically approved.</p>
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
        <button @click="loadComment" class="cta-btn primary">
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

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const isLoading = ref(true);
const isSubmitting = ref(false);
const error = ref<string | null>(null);
const success = ref<string | null>(null);
const formVisible = ref(false);

const commentData = ref({
  id: '',
  name: '',
  email: '',
  content: '',
  documentId: ''
});

const replyData = ref({
  name: '',
  content: '',
});

const loadComment = async () => {
  isLoading.value = true;
  error.value = null;
  success.value = null;
  formVisible.value = false;

  try {
    const token = route.query.token as string;
    const commentId = route.query.id as string;

    if (!token || !commentId) {
      throw new Error('Missing required parameters');
    }

    // Fetch the comment data
    const response = await fetch(`${import.meta.env.VITE_API_URL}/comments/${commentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to load comment');
    }

    const data = await response.json();
    commentData.value = data;
    formVisible.value = true;
  } catch (err) {
    console.error('Comment loading error:', err);
    error.value = err instanceof Error ? err.message : 'An error occurred loading the comment';
  } finally {
    isLoading.value = false;
  }
};

const submitReply = async () => {
  isSubmitting.value = true;
  error.value = null;

  try {
    const token = route.query.token as string;
    const commentId = route.query.id as string;

    if (!token || !commentId) {
      throw new Error('Missing required parameters');
    }

    // Submit the reply
    const response = await fetch(`${import.meta.env.VITE_API_URL}/comments/reply`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: replyData.value.name,
        email: 'admin@gettingtherebooks.com', // Admin email
        content: replyData.value.content,
        documentId: commentData.value.documentId,
        parentId: commentId
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to submit reply');
    }

    formVisible.value = false;
    success.value = 'Your reply has been submitted successfully and the original comment has been approved.';
  } catch (err) {
    console.error('Reply submission error:', err);
    error.value = err instanceof Error ? err.message : 'An error occurred submitting your reply';
  } finally {
    isSubmitting.value = false;
  }
};

const goHome = () => {
  router.push('/');
};

const goToBlog = () => {
  router.push('/blog');
};

onMounted(() => {
  loadComment();
});
</script>

<style scoped>
.reply-comment-page {
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

.status-container h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--text-dark);
  font-family: 'Playfair Display', serif;
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

.original-comment {
  background: var(--bg-light);
  padding: 1.5rem;
  border-radius: 15px;
  margin: 1.5rem 0;
  text-align: left;
  border: 1px solid var(--border-light);
}

.original-comment h3 {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text-dark);
}

.comment-details p {
  margin-bottom: 0.5rem;
  font-size: 1rem;
  text-align: left;
}

.comment-content {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 0.5rem;
  border: 1px solid var(--border-light);
  text-align: left;
  white-space: pre-wrap;
}

.reply-form {
  margin-top: 2rem;
  text-align: left;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-dark);
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid var(--border-light);
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: var(--primary-color);
  outline: none;
  box-shadow: 0 0 0 2px rgba(74, 124, 89, 0.2);
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

.cta-btn.primary:hover:not(:disabled) {
  background: var(--secondary-color);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px var(--shadow-medium);
}

.cta-btn.primary:disabled {
  background: #cccccc;
  cursor: not-allowed;
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
  .reply-comment-page {
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