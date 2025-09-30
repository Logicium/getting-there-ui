<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const returnToCheckout = () => {
  router.push('/checkout');
};

const goToStore = () => {
  router.push('/store');
};

const goHome = () => {
  router.push('/');
};
</script>

<template>
  <div class="cancel-page">
    <div class="cancel-content">
      <!-- Cancel Icon -->
      <div class="cancel-icon-wrapper">
        <div class="cancel-icon">✕</div>
      </div>

      <!-- Main Message -->
      <h1>Checkout Cancelled</h1>
      <p class="cancel-subtitle">Your order was not completed. Your cart items have been saved.</p>

      <!-- Reassurance Card -->
      <div class="reassurance-card">
        <div class="reassurance-icon">💚</div>
        <div class="reassurance-content">
          <h3>No Worries!</h3>
          <p>We've saved your cart so you can complete your purchase whenever you're ready. Your selected resources are still waiting for you.</p>
        </div>
      </div>

      <!-- Common Reasons -->
      <div class="reasons-card">
        <h2>Need Help?</h2>
        <p>Here are some common reasons customers cancel checkout:</p>

        <div class="reasons-list">
          <div class="reason-item">
            <div class="reason-icon">🤔</div>
            <div class="reason-content">
              <h4>Need More Time to Decide?</h4>
              <p>Take your time! Browse our store and add more resources to your cart when ready.</p>
              <button @click="goToStore" class="reason-action">Browse Store</button>
            </div>
          </div>

          <div class="reason-item">
            <div class="reason-icon">💳</div>
            <div class="reason-content">
              <h4>Payment Issues?</h4>
              <p>If you experienced a payment problem, you can try again or contact our support team.</p>
              <button @click="returnToCheckout" class="reason-action">Try Again</button>
            </div>
          </div>

          <div class="reason-item">
            <div class="reason-icon">❓</div>
            <div class="reason-content">
              <h4>Have Questions?</h4>
              <p>Our support team is here to help with any questions about our resources or checkout process.</p>
              <a href="mailto:support@gthere.net" class="reason-action">Contact Support</a>
            </div>
          </div>
        </div>
      </div>

      <!-- Trust Indicators -->
      <div class="trust-indicators">
        <div class="trust-item">
          <span class="trust-icon">🔒</span>
          <span>100% Secure Checkout</span>
        </div>
        <div class="trust-item">
          <span class="trust-icon">🔄</span>
          <span>30-Day Money-Back Guarantee</span>
        </div>
        <div class="trust-item">
          <span class="trust-icon">📱</span>
          <span>Instant Access After Purchase</span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <button @click="returnToCheckout" class="cta-btn primary">Return to Checkout</button>
        <button @click="goToStore" class="cta-btn secondary">Continue Shopping</button>
        <button @click="goHome" class="cta-btn tertiary">Go Home</button>
      </div>

      <!-- Support Section -->
      <div class="support-section">
        <p>Need assistance? We're here to help!</p>
        <div class="support-links">
          <a href="mailto:support@gthere.net" class="support-link">📧 support@gthere.net</a>
          <a href="tel:+1234567890" class="support-link">📞 (123) 456-7890</a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cancel-page {
  min-height: 100vh;
  background: var(--bg-light);
  padding: 6rem 2rem 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cancel-content {
  max-width: 800px;
  width: 100%;
  text-align: center;
}

/* Cancel Icon */
.cancel-icon-wrapper {
  margin-bottom: 2rem;
}

.cancel-icon {
  width: 80px;
  height: 80px;
  background: var(--warning-color);
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

/* Main Message */
.cancel-content h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text-dark);
  font-family: 'Playfair Display', serif;
}

.cancel-subtitle {
  font-size: 1.2rem;
  color: var(--text-light);
  margin-bottom: 3rem;
}

/* Reassurance Card */
.reassurance-card {
  background: linear-gradient(135deg, rgba(74, 124, 89, 0.1) 0%, rgba(127, 166, 80, 0.1) 100%);
  padding: 2rem;
  border-radius: 20px;
  display: flex;
  gap: 1.5rem;
  align-items: start;
  text-align: left;
  margin-bottom: 3rem;
  border: 1px solid rgba(74, 124, 89, 0.2);
}

.reassurance-icon {
  font-size: 2.5rem;
  flex-shrink: 0;
}

.reassurance-content h3 {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--text-dark);
}

.reassurance-content p {
  color: var(--text-light);
  margin: 0;
  line-height: 1.6;
}

/* Reasons Card */
.reasons-card {
  background: white;
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 8px 30px var(--shadow-light);
  margin-bottom: 3rem;
  border: 1px solid var(--border-light);
  text-align: left;
}

.reasons-card h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--text-dark);
  text-align: center;
}

.reasons-card > p {
  text-align: center;
  color: var(--text-light);
  margin-bottom: 2rem;
}

.reasons-list {
  display: grid;
  gap: 1.5rem;
}

.reason-item {
  display: flex;
  gap: 1.5rem;
  align-items: start;
  padding: 1.5rem;
  background: var(--bg-light);
  border-radius: 15px;
  border: 1px solid var(--border-light);
  transition: all 0.3s ease;
}

.reason-item:hover {
  background: var(--bg-sage);
  transform: translateX(5px);
}

.reason-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.reason-content {
  flex: 1;
}

.reason-content h4 {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--text-dark);
}

.reason-content p {
  color: var(--text-light);
  margin-bottom: 1rem;
  line-height: 1.5;
}

.reason-action {
  background: var(--primary-color);
  color: white;
  padding: 0.5rem 1.25rem;
  border-radius: 20px;
  border: none;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
}

.reason-action:hover {
  background: var(--secondary-color);
  transform: translateY(-2px);
}

/* Trust Indicators */
.trust-indicators {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
  padding: 1.5rem;
  background: white;
  border-radius: 15px;
  border: 1px solid var(--border-light);
}

.trust-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-light);
  font-size: 0.9rem;
}

.trust-icon {
  font-size: 1.2rem;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 3rem;
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

.cta-btn.tertiary {
  background: transparent;
  color: var(--text-light);
  border: none;
  padding: 1rem;
}

.cta-btn.tertiary:hover {
  color: var(--primary-color);
}

/* Support Section */
.support-section {
  background: var(--bg-sage);
  padding: 2rem;
  border-radius: 15px;
  border: 1px solid var(--border-light);
}

.support-section p {
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 1rem;
}

.support-links {
  display: flex;
  gap: 2rem;
  justify-content: center;
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

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .cancel-page {
    padding: 5rem 1rem 3rem;
  }

  .cancel-content h1 {
    font-size: 2rem;
  }

  .reassurance-card {
    flex-direction: column;
    text-align: center;
  }

  .reasons-card {
    padding: 1.5rem;
  }

  .reason-item {
    flex-direction: column;
    text-align: center;
  }

  .trust-indicators {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .action-buttons {
    flex-direction: column;
    width: 100%;
  }

  .cta-btn {
    width: 100%;
  }

  .support-links {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
}
</style>