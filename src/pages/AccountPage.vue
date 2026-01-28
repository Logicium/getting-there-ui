<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { mockCourses } from '@/data/courses'

const router = useRouter()
const authStore = useAuthStore()

const editingName = ref(false)
const newName = ref(authStore.user?.name || '')
const showUnsubscribeConfirm = ref(false)

function startEditName() {
  newName.value = authStore.user?.name || ''
  editingName.value = true
}

function saveName() {
  if (newName.value.trim()) {
    authStore.updateUserName(newName.value.trim())
    editingName.value = false
  }
}

function cancelEditName() {
  newName.value = authStore.user?.name || ''
  editingName.value = false
}

function handleUnsubscribe() {
  authStore.unsubscribe()
  showUnsubscribeConfirm.value = false
}

function handleLogout() {
  authStore.logout()
  router.push('/')
}

const completedCourses = computed(() => {
  return mockCourses.filter(course => 
    authStore.user?.completedCourses.includes(course.id)
  )
})
</script>

<template>
  <main class="account-page">
    <div class="account-container">
      <div class="page-header">
        <h1>Account Settings</h1>
        <p>Manage your account and subscription</p>
      </div>

      <div class="account-grid">
        <div class="main-content">
          <section class="account-section">
            <h2>Profile Information</h2>
            
            <div class="info-item">
              <label>Name</label>
              <div v-if="!editingName" class="info-display">
                <span>{{ authStore.user?.name }}</span>
                <button class="edit-button" @click="startEditName">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  Edit
                </button>
              </div>
              <div v-else class="info-edit">
                <input 
                  v-model="newName" 
                  type="text" 
                  placeholder="Enter your name"
                  @keyup.enter="saveName"
                  @keyup.escape="cancelEditName"
                />
                <div class="edit-actions">
                  <button class="save-button" @click="saveName">Save</button>
                  <button class="cancel-button" @click="cancelEditName">Cancel</button>
                </div>
              </div>
            </div>

            <div class="info-item">
              <label>Email</label>
              <div class="info-display">
                <span>{{ authStore.user?.email }}</span>
              </div>
            </div>
          </section>

          <section class="account-section">
            <h2>Subscription</h2>
            
            <div class="subscription-status">
              <div class="status-badge" :class="{ active: authStore.isSubscribed }">
                <svg v-if="authStore.isSubscribed" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
                <span>{{ authStore.isSubscribed ? 'Active' : 'Inactive' }}</span>
              </div>

              <div v-if="authStore.isSubscribed" class="subscription-info">
                <p>You have unlimited access to all courses for $10/month.</p>
                <button class="unsubscribe-button" @click="showUnsubscribeConfirm = true">
                  Unsubscribe
                </button>
              </div>
              <div v-else class="subscription-info">
                <p>Subscribe to get unlimited access to all courses.</p>
                <button class="subscribe-button" @click="authStore.subscribe()">
                  Subscribe for $10/month
                </button>
              </div>
            </div>
          </section>

          <section v-if="completedCourses.length > 0" class="account-section">
            <h2>Completed Courses</h2>
            
            <div class="completed-courses">
              <div 
                v-for="course in completedCourses" 
                :key="course.id"
                class="completed-course"
              >
                <div class="course-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                    <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                  </svg>
                </div>
                <div class="course-info">
                  <h3>{{ course.title }}</h3>
                  <p>{{ course.subtitle }}</p>
                </div>
                <router-link 
                  :to="`/classes/${course.id}/certificate`"
                  class="certificate-link"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                  View Certificate
                </router-link>
              </div>
            </div>
          </section>

          <section class="account-section danger-section">
            <h2>Account Actions</h2>
            <button class="logout-button" @click="handleLogout">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Logout
            </button>
          </section>
        </div>

        <div class="sidebar">
          <div class="help-card">
            <h3>Need Help?</h3>
            <p>If you have any questions about your account or subscription, feel free to reach out.</p>
            <a href="/about" class="contact-link">Contact Support</a>
          </div>
        </div>
      </div>
    </div>

    <!-- Unsubscribe Confirmation Modal -->
    <div v-if="showUnsubscribeConfirm" class="modal-overlay" @click="showUnsubscribeConfirm = false">
      <div class="modal" @click.stop>
        <h3>Confirm Unsubscribe</h3>
        <p>Are you sure you want to unsubscribe? You'll lose access to all courses immediately.</p>
        <div class="modal-actions">
          <button class="cancel-modal-button" @click="showUnsubscribeConfirm = false">
            Cancel
          </button>
          <button class="confirm-button" @click="handleUnsubscribe">
            Yes, Unsubscribe
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss">
.account-page {
  min-height: 100vh;
  padding-top: 80px;
  background: var(--bg-light);
}

.account-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem;
}

.page-header {
  margin-bottom: 3rem;

  h1 {
    font-size: 2.5rem;
    color: var(--text-dark);
    margin-bottom: 0.5rem;
    font-family: 'Playfair Display', serif;
  }

  p {
    color: var(--text-light);
    font-size: 1.05rem;
  }
}

.account-grid {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
  align-items: start;
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.account-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px var(--shadow-light);

  h2 {
    font-size: 1.5rem;
    color: var(--text-dark);
    margin-bottom: 1.5rem;
    font-family: 'Playfair Display', serif;
  }
}

.info-item {
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }

  label {
    display: block;
    font-size: 0.85rem;
    color: var(--text-light);
    font-weight: 600;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .info-display {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 0;

    span {
      color: var(--text-dark);
      font-size: 1.05rem;
    }
  }

  .info-edit {
    input {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid var(--border-light);
      border-radius: 8px;
      font-size: 1rem;
      margin-bottom: 0.75rem;
      transition: border-color 0.2s ease;

      &:focus {
        outline: none;
        border-color: var(--primary-color);
      }
    }

    .edit-actions {
      display: flex;
      gap: 0.75rem;
    }
  }
}

.edit-button,
.save-button,
.cancel-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.edit-button {
  background: var(--bg-secondary);
  color: var(--text-dark);

  &:hover {
    background: var(--bg-sage);
  }
}

.save-button {
  background: var(--gradient);
  color: white;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px var(--shadow-light);
  }
}

.cancel-button {
  background: var(--bg-secondary);
  color: var(--text-dark);

  &:hover {
    background: var(--border-light);
  }
}

.subscription-status {
  .status-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.25rem;
    border-radius: 20px;
    font-weight: 600;
    margin-bottom: 1.5rem;

    &.active {
      background: var(--success-color);
      color: white;
    }

    &:not(.active) {
      background: var(--warning-color);
      color: white;
    }
  }

  .subscription-info {
    p {
      color: var(--text-light);
      line-height: 1.6;
      margin-bottom: 1rem;
    }
  }
}

.subscribe-button,
.unsubscribe-button {
  padding: 0.875rem 1.75rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.subscribe-button {
  background: var(--gradient);
  color: white;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px var(--shadow-medium);
  }
}

.unsubscribe-button {
  background: white;
  color: var(--warning-color);
  border: 2px solid var(--warning-color);

  &:hover {
    background: var(--warning-color);
    color: white;
  }
}

.completed-courses {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  .completed-course {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: var(--bg-light);
    border-radius: 8px;
    transition: all 0.2s ease;

    &:hover {
      background: var(--bg-sage);
    }

    .course-icon {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--gradient);
      border-radius: 8px;
      color: white;
      flex-shrink: 0;
    }

    .course-info {
      flex: 1;

      h3 {
        font-size: 1.05rem;
        color: var(--text-dark);
        margin-bottom: 0.25rem;
      }

      p {
        font-size: 0.9rem;
        color: var(--text-light);
        margin: 0;
      }
    }

    .certificate-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--primary-color);
      text-decoration: none;
      font-weight: 600;
      font-size: 0.9rem;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      transition: all 0.2s ease;

      &:hover {
        background: rgba(74, 124, 89, 0.1);
      }
    }
  }
}

.danger-section {
  border: 2px solid var(--border-light);
}

.logout-button {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.75rem;
  background: white;
  color: var(--warning-color);
  border: 2px solid var(--warning-color);
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: var(--warning-color);
    color: white;
  }
}

.sidebar {
  position: sticky;
  top: 100px;
}

.help-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px var(--shadow-light);
  text-align: center;

  h3 {
    font-size: 1.25rem;
    color: var(--text-dark);
    margin-bottom: 1rem;
    font-family: 'Playfair Display', serif;
  }

  p {
    color: var(--text-light);
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }

  .contact-link {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    background: var(--gradient);
    color: white;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 600;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px var(--shadow-medium);
    }
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);

  h3 {
    font-size: 1.5rem;
    color: var(--text-dark);
    margin-bottom: 1rem;
    font-family: 'Playfair Display', serif;
  }

  p {
    color: var(--text-light);
    line-height: 1.6;
    margin-bottom: 2rem;
  }

  .modal-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
  }
}

.cancel-modal-button,
.confirm-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-modal-button {
  background: var(--bg-secondary);
  color: var(--text-dark);

  &:hover {
    background: var(--border-light);
  }
}

.confirm-button {
  background: var(--warning-color);
  color: white;

  &:hover {
    background: #d65a41;
  }
}

@media (max-width: 968px) {
  .account-grid {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: static;
  }
}

@media (max-width: 640px) {
  .account-container {
    padding: 2rem 1rem;
  }

  .page-header h1 {
    font-size: 2rem;
  }

  .account-section {
    padding: 1.5rem;
  }

  .completed-course {
    flex-direction: column;
    align-items: flex-start;

    .certificate-link {
      align-self: stretch;
      justify-content: center;
    }
  }
}
</style>
