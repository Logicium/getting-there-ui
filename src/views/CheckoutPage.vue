<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

interface CartItem {
  id: string;
  bookId: string;
  title: string;
  format: string;
  price: number;
  imageUrl?: string;
  documentId?: string;
}

// Cart state
const cart = ref<CartItem[]>([]);
const isProcessing = ref(false);
const error = ref<string | null>(null);

// Customer information
const customerInfo = ref({
  email: '',
  firstName: '',
  lastName: '',
  acceptTerms: false
});

// Form validation
const formErrors = ref({
  email: '',
  firstName: '',
  lastName: '',
  acceptTerms: ''
});

// Computed properties
const cartSubtotal = computed(() => {
  return cart.value.reduce((sum, item) => sum + item.price, 0);
});

const cartTotal = computed(() => {
  return cartSubtotal.value;
});

const isFormValid = computed(() => {
  return (
      customerInfo.value.email &&
      customerInfo.value.firstName &&
      customerInfo.value.lastName &&
      customerInfo.value.acceptTerms &&
      !Object.values(formErrors.value).some(error => error !== '')
  );
});

// Load cart from localStorage
const loadCart = () => {
  try {
    const savedCart = localStorage.getItem('gettingThereCart');
    if (savedCart) {
      cart.value = JSON.parse(savedCart);
    }

    // If cart is empty, redirect to store
    if (cart.value.length === 0) {
      router.push('/store');
    }
  } catch (err) {
    console.error('Error loading cart:', err);
    router.push('/store');
  }
};

// Validate email
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate form field
const validateField = (field: keyof typeof customerInfo.value) => {
  formErrors.value[field] = '';

  switch (field) {
    case 'email':
      if (!customerInfo.value.email) {
        formErrors.value.email = 'Email is required';
      } else if (!validateEmail(customerInfo.value.email)) {
        formErrors.value.email = 'Please enter a valid email address';
      }
      break;
    case 'firstName':
      if (!customerInfo.value.firstName) {
        formErrors.value.firstName = 'First name is required';
      }
      break;
    case 'lastName':
      if (!customerInfo.value.lastName) {
        formErrors.value.lastName = 'Last name is required';
      }
      break;
    case 'acceptTerms':
      if (!customerInfo.value.acceptTerms) {
        formErrors.value.acceptTerms = 'You must accept the terms and conditions';
      }
      break;
  }
};

// Process checkout with Square
const processCheckout = async () => {
  // Validate all fields
  validateField('email');
  validateField('firstName');
  validateField('lastName');
  validateField('acceptTerms');

  if (!isFormValid.value) {
    error.value = 'Please fill in all required fields correctly';
    return;
  }

  isProcessing.value = true;
  error.value = null;

  try {
    // Prepare checkout data
    const checkoutData = {
      items: cart.value.map(item => ({
        name: item.title,
        quantity: 1,
        amount: Math.round(item.price * 100), // Convert to cents
        currency: 'USD',
        documentId: item.documentId
      })),
      customer: {
        email: customerInfo.value.email,
        firstName: customerInfo.value.firstName,
        lastName: customerInfo.value.lastName
      },
      redirectUrl: `${window.location.origin}/checkout/success`,
      cancelUrl: `${window.location.origin}/checkout/cancel`
    };

    console.log('Checkout data:', checkoutData);

    // Call your backend API
    const response = await fetch(`http://localhost:3000/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(checkoutData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create checkout session');
    }

    const data = await response.json();

    // Redirect to Square Checkout
    if (data.checkoutUrl) {
      // Save customer info for later
      localStorage.setItem('gettingThereCustomer', JSON.stringify(customerInfo.value));

      // Redirect to Square Checkout page
      window.location.href = data.checkoutUrl;
    } else {
      throw new Error('No checkout URL received from server');
    }
  } catch (err) {
    console.error('Checkout error:', err);
    error.value = err instanceof Error ? err.message : 'An error occurred during checkout. Please try again.';
    isProcessing.value = false;
  }
};

// Remove item from cart
const removeFromCart = (index: number) => {
  cart.value.splice(index, 1);
  localStorage.setItem('gettingThereCart', JSON.stringify(cart.value));

  // If cart is empty, redirect to store
  if (cart.value.length === 0) {
    router.push('/store');
  }
};

// Back to cart/store
const backToStore = () => {
  router.push('/store');
};

onMounted(() => {
  loadCart();
});
</script>

<template>
  <div class="checkout-page">
    <!-- Breadcrumb -->
    <section class="checkout-breadcrumb">
      <div class="breadcrumb-content">
        <router-link to="/">Home</router-link> →
        <router-link to="/store">Store</router-link> →
        Checkout
      </div>
    </section>

    <!-- Main Checkout Content -->
    <main class="checkout-content">
      <div class="checkout-container">
        <!-- Left Column - Customer Information -->
        <div class="checkout-form-section">
          <h1 class="checkout-title">Secure Checkout</h1>
          <p class="checkout-subtitle">Complete your order for instant access to your digital resources</p>

          <!-- Error Message -->
          <div v-if="error" class="error-message">
            <span class="error-icon">⚠️</span>
            <p>{{ error }}</p>
          </div>

          <!-- Customer Information Form -->
          <div class="form-section">
            <h2 class="section-title">👤 Contact Information</h2>
            <p class="section-description">We'll send your digital resources to this email address</p>

            <div class="form-group">
              <label for="email">Email Address *</label>
              <input
                  type="email"
                  id="email"
                  v-model="customerInfo.email"
                  @blur="validateField('email')"
                  placeholder="your@email.com"
                  class="form-input"
                  :class="{ 'error': formErrors.email }"
              >
              <span v-if="formErrors.email" class="field-error">{{ formErrors.email }}</span>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="firstName">First Name *</label>
                <input
                    type="text"
                    id="firstName"
                    v-model="customerInfo.firstName"
                    @blur="validateField('firstName')"
                    placeholder="John"
                    class="form-input"
                    :class="{ 'error': formErrors.firstName }"
                >
                <span v-if="formErrors.firstName" class="field-error">{{ formErrors.firstName }}</span>
              </div>

              <div class="form-group">
                <label for="lastName">Last Name *</label>
                <input
                    type="text"
                    id="lastName"
                    v-model="customerInfo.lastName"
                    @blur="validateField('lastName')"
                    placeholder="Doe"
                    class="form-input"
                    :class="{ 'error': formErrors.lastName }"
                >
                <span v-if="formErrors.lastName" class="field-error">{{ formErrors.lastName }}</span>
              </div>
            </div>
          </div>

          <!-- Payment Information Notice -->
          <div class="form-section">
            <h2 class="section-title">💳 Payment Information</h2>
            <div class="payment-notice">
              <div class="payment-notice-icon">🔒</div>
              <div class="payment-notice-content">
                <h3>Secure Payment Processing</h3>
                <p>You'll be securely redirected to Square to complete your payment. We never store your payment information.</p>
                <div class="payment-badges">
                  <span class="payment-badge">🔐 SSL Encrypted</span>
                  <span class="payment-badge">✓ PCI Compliant</span>
                  <span class="payment-badge">💳 Square Secured</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Terms and Conditions -->
          <div class="form-section">
            <div class="checkbox-group">
              <input
                  type="checkbox"
                  id="acceptTerms"
                  v-model="customerInfo.acceptTerms"
                  @change="validateField('acceptTerms')"
                  class="checkbox-input"
              >
              <label for="acceptTerms" class="checkbox-label">
                I agree to the <router-link to="/terms" target="_blank">Terms of Service</router-link> and <router-link to="/privacy" target="_blank">Privacy Policy</router-link>
              </label>
            </div>
            <span v-if="formErrors.acceptTerms" class="field-error">{{ formErrors.acceptTerms }}</span>
          </div>

          <!-- Action Buttons -->
          <div class="checkout-actions">
            <button
                @click="processCheckout"
                :disabled="!isFormValid || isProcessing"
                class="checkout-btn primary"
            >
              <span v-if="!isProcessing">
                <span class="btn-icon">🔒</span>
                Proceed to Secure Payment
              </span>
              <span v-else class="processing-text">
                <span class="spinner"></span>
                Processing...
              </span>
            </button>
            <button @click="backToStore" class="checkout-btn secondary">
              ← Back to Store
            </button>
          </div>

          <!-- Trust Indicators -->
          <div class="trust-section">
            <div class="trust-item">
              <span class="trust-icon">📱</span>
              <span>Instant Download</span>
            </div>
            <div class="trust-item">
              <span class="trust-icon">🔄</span>
              <span>30-Day Money-Back Guarantee</span>
            </div>
            <div class="trust-item">
              <span class="trust-icon">🔒</span>
              <span>100% Secure Checkout</span>
            </div>
          </div>
        </div>

        <!-- Right Column - Order Summary -->
        <div class="order-summary-section">
          <div class="order-summary-card">
            <h2 class="summary-title">Order Summary</h2>

            <!-- Cart Items -->
            <div class="summary-items">
              <div
                  v-for="(item, index) in cart"
                  :key="item.id"
                  class="summary-item"
              >
                <div class="item-image">
                  <img
                      v-if="item.imageUrl"
                      :src="`https://getting-there-cms.onrender.com${item.imageUrl}`"
                      :alt="item.title"
                  >
                  <div v-else class="item-placeholder">📱</div>
                </div>
                <div class="item-details">
                  <h3>{{ item.title }}</h3>
                  <p>{{ item.format }}</p>
                </div>
                <div class="item-price">
                  <span class="price">${{ item.price.toFixed(2) }}</span>
                  <button @click="removeFromCart(index)" class="remove-btn" title="Remove item">×</button>
                </div>
              </div>
            </div>

            <!-- Order Totals -->
            <div class="summary-totals">
              <div class="total-row subtotal">
                <span>Subtotal</span>
                <span>${{ cartSubtotal.toFixed(2) }}</span>
              </div>
              <div class="total-row">
                <span>Tax</span>
                <span>Calculated at checkout</span>
              </div>
              <div class="total-row grand-total">
                <span>Total</span>
                <span>${{ cartTotal.toFixed(2) }}</span>
              </div>
            </div>

            <!-- Delivery Notice -->
            <div class="delivery-notice">
              <div class="notice-icon">📧</div>
              <p>Your digital resources will be delivered instantly to your email after purchase</p>
            </div>

            <!-- Money-Back Guarantee -->
            <div class="guarantee-badge">
              <div class="guarantee-icon">✓</div>
              <div class="guarantee-text">
                <h4>30-Day Money-Back Guarantee</h4>
                <p>Not satisfied? Get a full refund within 30 days, no questions asked.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* Checkout Page Container */
.checkout-page {
  min-height: 100vh;
  background: var(--bg-light);
  padding-top: 80px;
}

/* Breadcrumb */
.checkout-breadcrumb {
  background: white;
  padding: 1rem 0;
  border-bottom: 1px solid var(--border-light);
}

.breadcrumb-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  color: var(--text-light);
  font-size: 0.9rem;
}

.breadcrumb-content a {
  color: var(--primary-color);
  text-decoration: none;
  transition: color 0.3s ease;
}

.breadcrumb-content a:hover {
  color: var(--secondary-color);
}

/* Main Content */
.checkout-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem;
}

.checkout-container {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 3rem;
  align-items: start;
}

/* Form Section */
.checkout-form-section {
  background: white;
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 8px 30px var(--shadow-light);
  border: 1px solid var(--border-light);
}

.checkout-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--text-dark);
  font-family: 'Playfair Display', serif;
}

.checkout-subtitle {
  color: var(--text-light);
  margin-bottom: 2rem;
  font-size: 1.05rem;
}

/* Error Message */
.error-message {
  background: rgba(231, 111, 81, 0.1);
  border: 1px solid var(--warning-color);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.error-icon {
  font-size: 1.5rem;
}

.error-message p {
  margin: 0;
  color: var(--text-dark);
  font-weight: 500;
}

/* Form Sections */
.form-section {
  margin-bottom: 2.5rem;
}

.section-title {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--text-dark);
}

.section-description {
  color: var(--text-light);
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

/* Form Elements */
.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-dark);
  font-size: 0.95rem;
}

.form-input {
  width: 100%;
  padding: 0.875rem;
  border: 2px solid var(--border-light);
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(74, 124, 89, 0.1);
}

.form-input.error {
  border-color: var(--warning-color);
}

.field-error {
  display: block;
  color: var(--warning-color);
  font-size: 0.85rem;
  margin-top: 0.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

/* Payment Notice */
.payment-notice {
  background: var(--bg-sage);
  padding: 1.5rem;
  border-radius: 15px;
  display: flex;
  gap: 1rem;
  align-items: start;
  border: 1px solid var(--border-light);
}

.payment-notice-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.payment-notice-content h3 {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--text-dark);
}

.payment-notice-content p {
  color: var(--text-light);
  margin-bottom: 1rem;
  font-size: 0.95rem;
  line-height: 1.5;
}

.payment-badges {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.payment-badge {
  background: white;
  padding: 0.4rem 0.75rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--primary-color);
  border: 1px solid var(--border-light);
}

/* Checkbox */
.checkbox-group {
  display: flex;
  align-items: start;
  gap: 0.75rem;
}

.checkbox-input {
  width: 20px;
  height: 20px;
  margin-top: 2px;
  cursor: pointer;
  flex-shrink: 0;
}

.checkbox-label {
  font-size: 0.95rem;
  color: var(--text-dark);
  cursor: pointer;
  line-height: 1.5;
}

.checkbox-label a {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
}

.checkbox-label a:hover {
  color: var(--secondary-color);
  text-decoration: underline;
}

/* Checkout Actions */
.checkout-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.checkout-btn {
  padding: 1rem 2rem;
  border-radius: 25px;
  font-weight: 700;
  font-size: 1.05rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.checkout-btn.primary {
  background: var(--primary-color);
  color: white;
  box-shadow: 0 4px 15px var(--shadow-light);
}

.checkout-btn.primary:hover:not(:disabled) {
  background: var(--secondary-color);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px var(--shadow-medium);
}

.checkout-btn.primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.checkout-btn.secondary {
  background: white;
  color: var(--text-dark);
  border: 2px solid var(--border-light);
}

.checkout-btn.secondary:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.btn-icon {
  font-size: 1.2rem;
}

.processing-text {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Trust Section */
.trust-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-light);
}

.trust-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--text-light);
  font-size: 0.9rem;
}

.trust-icon {
  font-size: 1.2rem;
}

/* Order Summary */
.order-summary-section {
  position: sticky;
  top: 100px;
}

.order-summary-card {
  background: white;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 8px 30px var(--shadow-light);
  border: 1px solid var(--border-light);
}

.summary-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--text-dark);
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--border-light);
}

/* Summary Items */
.summary-items {
  margin-bottom: 1.5rem;
}

.summary-item {
  display: flex;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid var(--border-light);
  align-items: center;
}

.summary-item:last-child {
  border-bottom: none;
}

.item-image {
  width: 60px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  background: var(--gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-placeholder {
  color: white;
  font-size: 1.5rem;
}

.item-details {
  flex: 1;
}

.item-details h3 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: var(--text-dark);
  line-height: 1.3;
}

.item-details p {
  font-size: 0.85rem;
  color: var(--text-light);
  margin: 0;
}

.item-price {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.item-price .price {
  font-weight: 700;
  color: var(--primary-color);
  font-size: 1.1rem;
}

.remove-btn {
  background: none;
  border: none;
  color: var(--warning-color);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.remove-btn:hover {
  background: rgba(231, 111, 81, 0.1);
}

/* Summary Totals */
.summary-totals {
  padding: 1.5rem 0;
  border-top: 2px solid var(--border-light);
  border-bottom: 2px solid var(--border-light);
  margin-bottom: 1.5rem;
}

.total-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  color: var(--text-light);
  font-size: 0.95rem;
}

.total-row:last-child {
  margin-bottom: 0;
}

.total-row.subtotal {
  font-weight: 600;
  color: var(--text-dark);
}

.total-row.grand-total {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text-dark);
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-light);
}

/* Delivery Notice */
.delivery-notice {
  background: var(--bg-sage);
  padding: 1rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.notice-icon {
  font-size: 1.5rem;
}

.delivery-notice p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-dark);
  line-height: 1.4;
}

/* Guarantee Badge */
.guarantee-badge {
  background: linear-gradient(135deg, rgba(74, 124, 89, 0.1) 0%, rgba(127, 166, 80, 0.1) 100%);
  padding: 1.25rem;
  border-radius: 12px;
  display: flex;
  gap: 1rem;
  border: 1px solid rgba(74, 124, 89, 0.2);
}

.guarantee-icon {
  width: 35px;
  height: 35px;
  background: var(--success-color);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  flex-shrink: 0;
}

.guarantee-text h4 {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  color: var(--text-dark);
}

.guarantee-text p {
  margin: 0;
  font-size: 0.85rem;
  color: var(--text-light);
  line-height: 1.4;
}

/* Mobile Responsiveness */
@media (max-width: 968px) {
  .checkout-container {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .order-summary-section {
    position: static;
    top: auto;
  }

  .checkout-form-section {
    padding: 2rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .checkout-content {
    padding: 2rem 1rem;
  }

  .checkout-form-section {
    padding: 1.5rem;
  }

  .order-summary-card {
    padding: 1.5rem;
  }

  .checkout-title {
    font-size: 1.75rem;
  }

  .summary-item {
    flex-wrap: wrap;
  }

  .item-price {
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}
</style>