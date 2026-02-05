<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const loading = ref(false)
const error = ref('')
const success = ref(false)

// Square Payment Form
let card: any = null

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }

  // Load Square SDK
  const script = document.createElement('script')
  script.src = 'https://sandbox.web.squarecdn.com/v1/square.js'
  script.async = true
  script.onload = initializeSquare
  document.head.appendChild(script)
})

async function initializeSquare() {
  try {
    const payments = (window as any).Square.payments(
      'sandbox-sq0idb-OQkQ2bLLx7aTQV0v5yClFA', // Square Application ID (sandbox)
      'L05JNNRMBJYH1' // Location ID
    )

    card = await payments.card()
    await card.attach('#card-container')
  } catch (e) {
    console.error('Square initialization error:', e)
    error.value = 'Failed to load payment form. Please refresh the page.'
  }
}

async function handleSubmit() {
  if (!card) {
    error.value = 'Payment form not ready. Please wait and try again.'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const result = await card.tokenize()
    
    if (result.status === 'OK') {
      // Send token to backend
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authStore.token}`,
        },
        body: JSON.stringify({
          sourceId: result.token,
        }),
      })

      if (!response.ok) {
        throw new Error('Payment processing failed')
      }

      const data = await response.json()
      
      if (data.success) {
        // Update auth store subscription status
        await authStore.subscribe()
        success.value = true
        
        // Redirect to account page after 2 seconds
        setTimeout(() => {
          router.push('/account')
        }, 2000)
      }
    } else {
      error.value = 'Card validation failed. Please check your card details.'
    }
  } catch (e: any) {
    console.error('Payment error:', e)
    error.value = e.message || 'Payment processing failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="payment-page">
    <div class="payment-container">
      <div class="payment-header">
        <router-link to="/account" class="back-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Account
        </router-link>

        <h1>Subscribe to Getting There</h1>
        <p class="subtitle">Get unlimited access to all courses and content</p>
      </div>

      <div v-if="!success" class="payment-card">
        <div class="subscription-details">
          <div class="price-display">
            <span class="currency">$</span>
            <span class="amount">10</span>
            <span class="period">/month</span>
          </div>
          
          <ul class="benefits">
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Access to all courses
            </li>
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Track your progress
            </li>
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Earn certificates
            </li>
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Cancel anytime
            </li>
          </ul>
        </div>

        <div class="payment-form">
          <h2>Payment Information</h2>
          
          <div id="card-container" class="card-container"></div>

          <p v-if="error" class="error-message">{{ error }}</p>

          <button 
            class="submit-button" 
            @click="handleSubmit"
            :disabled="loading"
          >
            <span v-if="!loading">Subscribe Now</span>
            <span v-else>Processing...</span>
          </button>

          <p class="secure-note">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            Your payment information is secure and encrypted
          </p>
        </div>
      </div>

      <div v-else class="success-card">
        <div class="success-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <h2>Subscription Successful!</h2>
        <p>You now have access to all courses. Redirecting to your account...</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.payment-page {
  min-height: 100vh;
  background: var(--bg-light);
  padding: 6rem 2rem 2rem;
}

.payment-container {
  max-width: 900px;
  margin: 0 auto;
}

.payment-header {
  margin-bottom: 3rem;
  text-align: center;

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--primary-color);
    text-decoration: none;
    font-weight: 500;
    margin-bottom: 2rem;
    transition: all 0.3s ease;

    &:hover {
      gap: 0.75rem;
    }
  }

  h1 {
    font-size: 2.5rem;
    color: var(--text-dark);
    margin-bottom: 0.5rem;
    font-family: 'Playfair Display', serif;
  }

  .subtitle {
    color: var(--text-light);
    font-size: 1.1rem;
  }
}

.payment-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px var(--shadow-light);
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 0;
}

.subscription-details {
  background: var(--gradient);
  padding: 3rem 2rem;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .price-display {
    display: flex;
    align-items: flex-start;
    margin-bottom: 2rem;
    font-weight: 700;

    .currency {
      font-size: 2rem;
      margin-top: 0.5rem;
    }

    .amount {
      font-size: 4rem;
      line-height: 1;
    }

    .period {
      font-size: 1.2rem;
      align-self: flex-end;
      margin-bottom: 0.5rem;
      opacity: 0.9;
    }
  }

  .benefits {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem 0;
      font-size: 1.05rem;

      svg {
        flex-shrink: 0;
      }
    }
  }
}

.payment-form {
  padding: 3rem 2rem;

  h2 {
    font-size: 1.5rem;
    color: var(--text-dark);
    margin-bottom: 1.5rem;
    font-family: 'Playfair Display', serif;
  }
}

.card-container {
  margin-bottom: 2rem;
  min-height: 120px;
}

.error-message {
  color: var(--warning-color);
  background: rgba(231, 111, 81, 0.1);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.95rem;
}

.submit-button {
  width: 100%;
  padding: 1.25rem;
  background: var(--gradient);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:not(:disabled):hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px var(--shadow-medium);
  }
}

.secure-note {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
  color: var(--text-lighter);
  font-size: 0.9rem;
  margin-top: 1.5rem;

  svg {
    color: var(--success-color);
  }
}

.success-card {
  background: white;
  border-radius: 16px;
  padding: 4rem 2rem;
  text-align: center;
  box-shadow: 0 4px 20px var(--shadow-light);

  .success-icon {
    margin-bottom: 2rem;

    svg {
      color: var(--success-color);
    }
  }

  h2 {
    font-size: 2rem;
    color: var(--text-dark);
    margin-bottom: 1rem;
    font-family: 'Playfair Display', serif;
  }

  p {
    color: var(--text-light);
    font-size: 1.1rem;
  }
}

@media (max-width: 768px) {
  .payment-card {
    grid-template-columns: 1fr;
  }

  .subscription-details {
    padding: 2rem 1.5rem;

    .price-display {
      .amount {
        font-size: 3rem;
      }
    }
  }

  .payment-form {
    padding: 2rem 1.5rem;

    h2 {
      font-size: 1.25rem;
    }
  }

  .payment-header h1 {
    font-size: 2rem;
  }
}
</style>
