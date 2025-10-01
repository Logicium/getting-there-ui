<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const isLoading = ref(true);
const orderDetails = ref<any>(null);
const customerInfo = ref<any>(null);
const error = ref<string | null>(null);

const verifyOrder = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    // Get order ID from query params
    const orderId = route.query.order_id || route.query.orderId;

    if (!orderId) {
      throw new Error('No order ID found');
    }

    // Verify order with backend
    const response = await fetch(`http://localhost:3000/checkout/verify-payment?orderId=${orderId}`);

    if (!response.ok) {
      throw new Error('Failed to verify order');
    }

    const data = await response.json();
    orderDetails.value = data;
    // Load customer info from localStorage
    const savedCustomer = localStorage.getItem('gettingThereCustomer');
    if (savedCustomer) {
      customerInfo.value = JSON.parse(savedCustomer);
    }

    // Clear cart
    localStorage.removeItem('gettingThereCart');
    localStorage.removeItem('gettingThereCustomer');

  } catch (err) {
    console.error('Order verification error:', err);
    error.value = err instanceof Error ? err.message : 'Failed to verify order';
  } finally {
    isLoading.value = false;
  }
};

const goToStore = () => {
  router.push('/store');
};

const goHome = () => {
  router.push('/');
};

onMounted(() => {
  verifyOrder();
});
</script>

<template>
  <div class="success-page">
    <!-- Loading State -->
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Verifying your order...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <div class="error-icon">⚠️</div>
      <h1>Order Verification Failed</h1>
      <p>{{ error }}</p>
      <div class="error-actions">
        <button @click="goToStore" class="cta-btn primary">Return to Store</button>
        <a href="mailto:support@gthere.net" class="cta-btn secondary">Contact Support</a>
      </div>
    </div>

    <!-- Success State -->
    <div v-else class="success-content">
      <!-- Success Header -->
      <div class="success-header">
        <div class="success-icon-wrapper">
          <div class="success-icon">✓</div>
        </div>
        <h1>Thank You for Your Purchase!</h1>
        <p class="success-subtitle">Your order has been confirmed and your digital resources are ready</p>
      </div>

      <!-- Order Details Card -->
      <div class="order-details-card">
        <div class="card-header">
          <h2>📧 Order Confirmation</h2>
          <span class="order-number">Order ID: {{ orderDetails?.orderId || 'Processing' }}</span>
        </div>

        <div class="confirmation-message">
          <div class="message-icon">📱</div>
          <div class="message-content">
            <h3>Check Your Email</h3>
            <p>We've sent your digital resources and order confirmation to:</p>
            <p class="email-address">{{ customerInfo?.email || 'your email address' }}</p>
            <p class="email-note">If you don't see it within a few minutes, please check your spam folder.</p>
          </div>
        </div>

        <!-- Order Items -->
        <div class="order-items" v-if="orderDetails?.items">
          <h3>Your Digital Resources</h3>
          <div class="items-list">
            <div v-for="item in orderDetails.items" :key="item.id" class="order-item">
              <div class="item-icon">📚</div>
              <div class="item-info">
                <h4>{{ item.name }}</h4>
                <p>Digital Edition • Instant Download</p>
              </div>
              <div class="item-price">${{ (item.amount / 100).toFixed(2) }}</div>
            </div>
          </div>
        </div>

        <!-- Order Total -->
        <div class="order-total" v-if="orderDetails?.total">
          <div class="total-row">
            <span>Total Paid</span>
            <span class="total-amount">${{ (orderDetails.total / 100).toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <!-- Next Steps -->
      <div class="next-steps-card">
        <h2>🎯 What Happens Next?</h2>
        <div class="steps-grid">
          <div class="step-item">
            <div class="step-number">1</div>
            <div class="step-content">
              <h3>Check Your Email</h3>
              <p>Your download links have been sent to your email address</p>
            </div>
          </div>
          <div class="step-item">
            <div class="step-number">2</div>
            <div class="step-content">
              <h3>Download Your Resources</h3>
              <p>Click the download links in your email to access your digital books</p>
            </div>
          </div>
          <div class="step-item">
            <div class="step-number">3</div>
            <div class="step-content">
              <h3>Start Your Journey</h3>
              <p>Begin reading and exploring your new therapeutic resources</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Support Section -->
      <div class="support-card">
        <div class="support-icon">💚</div>
        <div class="support-content">
          <h3>Need Help?</h3>
          <p>If you have any questions or issues accessing your resources, our support team is here to help.</p>
          <div class="support-actions">
            <a href="mailto:support@gthere.net" class="support-link">📧 support@gthere.net</a>
            <a href="tel:+1234567890" class="support-link">📞 (123) 456-7890</a>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <button @click="goToStore" class="cta-btn primary">Browse More Resources</button>
        <button @click="goHome" class="cta-btn secondary">Return Home</button>
      </div>

      <!-- Guarantee Reminder -->
      <div class="guarantee-reminder">
        <div class="guarantee-icon">🔄</div>
        <p><strong>30-Day Money-Back Guarantee</strong> • Not satisfied? Contact us for a full refund, no questions asked.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.success-page {
  min-height: 100vh;
  background: var(--bg-light);
  padding: 6rem 2rem 4rem;
}

/* Loading State */
.loading-container {
  max-width: 500px;
  margin: 4rem auto;
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 30px var(--shadow-light);
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(74, 124, 89, 0.1);
  border-radius: 50%;
  border-top-color: var(--primary-color);
  margin: 0 auto 1.5rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-container p {
  color: var(--text-light);
  font-size: 1.1rem;
}

/* Error State */
.error-container {
  max-width: 600px;
  margin: 4rem auto;
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 30px var(--shadow-light);
}

.error-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.error-container h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text-dark);
}

.error-container p {
  color: var(--text-light);
  margin-bottom: 2rem;
  font-size: 1.1rem;
  line-height: 1.6;
}

.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* Success Content */
.success-content {
  max-width: 800px;
  margin: 0 auto;
}

/* Success Header */
.success-header {
  text-align: center;
  margin-bottom: 3rem;
}

.success-icon-wrapper {
  margin-bottom: 1.5rem;
}

.success-icon {
  width: 80px;
  height: 80px;
  background: var(--success-color);
  color: white;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: 700;
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

.success-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text-dark);
  font-family: 'Playfair Display', serif;
}

.success-subtitle {
  font-size: 1.2rem;
  color: var(--text-light);
}

/* Order Details Card */
.order-details-card {
  background: white;
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 8px 30px var(--shadow-light);
  margin-bottom: 2rem;
  border: 1px solid var(--border-light);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--border-light);
  flex-wrap: wrap;
  gap: 1rem;
}

.card-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-dark);
  margin: 0;
}

.order-number {
  background: var(--bg-sage);
  color: var(--primary-color);
  padding: 0.5rem 1rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9rem;
}

/* Confirmation Message */
.confirmation-message {
  background: var(--bg-sage);
  padding: 2rem;
  border-radius: 15px;
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid var(--border-light);
}

.message-icon {
  font-size: 2.5rem;
  flex-shrink: 0;
}

.message-content h3 {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--text-dark);
}

.message-content p {
  color: var(--text-light);
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

.email-address {
  font-weight: 700;
  color: var(--primary-color);
  font-size: 1.1rem;
  margin: 0.75rem 0 !important;
}

.email-note {
  font-size: 0.9rem;
  font-style: italic;
}

/* Order Items */
.order-items h3 {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text-dark);
}

.items-list {
  margin-bottom: 1.5rem;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid var(--border-light);
}

.order-item:last-child {
  border-bottom: none;
}

.item-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.item-info {
  flex: 1;
}

.item-info h4 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: var(--text-dark);
}

.item-info p {
  font-size: 0.85rem;
  color: var(--text-light);
  margin: 0;
}

.item-price {
  font-weight: 700;
  color: var(--primary-color);
  font-size: 1.1rem;
}

/* Order Total */
.order-total {
  padding-top: 1.5rem;
  border-top: 2px solid var(--border-light);
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text-dark);
}

.total-amount {
  color: var(--primary-color);
  font-size: 1.5rem;
}

/* Next Steps Card */
.next-steps-card {
  background: white;
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 8px 30px var(--shadow-light);
  margin-bottom: 2rem;
  border: 1px solid var(--border-light);
}

.next-steps-card h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: var(--text-dark);
  text-align: center;
}

.steps-grid {
  display: grid;
  gap: 1.5rem;
}

.step-item {
  display: flex;
  gap: 1.5rem;
  align-items: start;
  padding: 1.5rem;
  background: var(--bg-light);
  border-radius: 15px;
  border: 1px solid var(--border-light);
}

.step-number {
  width: 40px;
  height: 40px;
  background: var(--primary-color);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.step-content h3 {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--text-dark);
}

.step-content p {
  color: var(--text-light);
  margin: 0;
  line-height: 1.5;
}

/* Support Card */
.support-card {
  background: linear-gradient(135deg, rgba(74, 124, 89, 0.1) 0%, rgba(127, 166, 80, 0.1) 100%);
  padding: 2rem;
  border-radius: 20px;
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid rgba(74, 124, 89, 0.2);
}

.support-icon {
  font-size: 2.5rem;
  flex-shrink: 0;
}

.support-content h3 {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--text-dark);
}

.support-content p {
  color: var(--text-light);
  margin-bottom: 1rem;
  line-height: 1.6;
}

.support-actions {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.support-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.3s ease;
}

.support-link:hover {
  color: var(--secondary-color);
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
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
  text-decoration: none;
  display: inline-block;
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

/* Guarantee Reminder */
.guarantee-reminder {
  background: white;
  padding: 1.5rem;
  border-radius: 15px;
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: center;
  text-align: center;
  box-shadow: 0 4px 15px var(--shadow-light);
  border: 1px solid var(--border-light);
}

.guarantee-icon {
  font-size: 2rem;
}

.guarantee-reminder p {
  margin: 0;
  color: var(--text-dark);
  font-size: 0.95rem;
  line-height: 1.5;
}

/* Mobile Responsiveness */
@media (max-width: 640px) {
  .success-page {
    padding: 5rem 1rem 3rem;
  }

  .success-header h1 {
    font-size: 2rem;
  }

  .order-details-card,
  .next-steps-card {
    padding: 1.5rem;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .confirmation-message {
    flex-direction: column;
    text-align: center;
  }

  .support-card {
    flex-direction: column;
    text-align: center;
  }

  .support-actions {
    flex-direction: column;
    align-items: center;
  }

  .action-buttons {
    flex-direction: column;
    width: 100%;
  }

  .cta-btn {
    width: 100%;
  }

  .guarantee-reminder {
    flex-direction: column;
  }
}
</style>