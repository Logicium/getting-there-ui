<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  AppButton,
  AppCard,
  AppCheckbox,
  AppContainer,
  AppEyebrow,
  AppField,
  AppHero,
  AppInput,
  AppSection,
} from '@/components/ui'
import { BookOpen } from 'lucide-vue-next'

const router = useRouter()

interface CartItem {
  id: string
  bookId: string
  title: string
  format: string
  price: number
  imageUrl?: string
  documentId?: string
  pdfUrl?: string
}

const cart = ref<CartItem[]>([])
const isProcessing = ref(false)
const error = ref<string | null>(null)

const customerInfo = ref({
  email: '',
  firstName: '',
  lastName: '',
  acceptTerms: false,
})

const formErrors = ref({
  email: '',
  firstName: '',
  lastName: '',
  acceptTerms: '',
})

const cartSubtotal = computed(() => cart.value.reduce((sum, item) => sum + item.price, 0))
const cartTotal = computed(() => cartSubtotal.value)

const isFormValid = computed(() => {
  return (
    customerInfo.value.email &&
    customerInfo.value.firstName &&
    customerInfo.value.lastName &&
    customerInfo.value.acceptTerms &&
    !Object.values(formErrors.value).some((e) => e !== '')
  )
})

const loadCart = () => {
  try {
    const savedCart = localStorage.getItem('gettingThereCart')
    if (savedCart) cart.value = JSON.parse(savedCart)
    if (cart.value.length === 0) router.push('/store')
  } catch (err) {
    console.error('Error loading cart:', err)
    router.push('/store')
  }
}

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validateField = (field: keyof typeof customerInfo.value) => {
  formErrors.value[field] = ''
  switch (field) {
    case 'email':
      if (!customerInfo.value.email) formErrors.value.email = 'Email is required'
      else if (!validateEmail(customerInfo.value.email))
        formErrors.value.email = 'Please enter a valid email address'
      break
    case 'firstName':
      if (!customerInfo.value.firstName) formErrors.value.firstName = 'First name is required'
      break
    case 'lastName':
      if (!customerInfo.value.lastName) formErrors.value.lastName = 'Last name is required'
      break
    case 'acceptTerms':
      if (!customerInfo.value.acceptTerms)
        formErrors.value.acceptTerms = 'You must accept the terms and conditions'
      break
  }
}

const processCheckout = async () => {
  validateField('email')
  validateField('firstName')
  validateField('lastName')
  validateField('acceptTerms')

  if (!isFormValid.value) {
    error.value = 'Please fill in all required fields correctly'
    return
  }

  isProcessing.value = true
  error.value = null

  try {
    const checkoutData = {
      items: cart.value.map((item) => ({
        name: item.title,
        quantity: 1,
        amount: Math.round(item.price * 100),
        currency: 'USD',
        documentId: item.documentId,
        pdfUrl: item.pdfUrl,
      })),
      customer: {
        email: customerInfo.value.email,
        firstName: customerInfo.value.firstName,
        lastName: customerInfo.value.lastName,
      },
      redirectUrl: `${window.location.origin}/checkout/success`,
      cancelUrl: `${window.location.origin}/checkout/cancel`,
    }

    const response = await fetch(`https://getting-there-service.onrender.com/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(checkoutData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to create checkout session')
    }

    const data = await response.json()

    if (data.checkoutUrl) {
      localStorage.setItem('gettingThereCustomer', JSON.stringify(customerInfo.value))
      window.location.href = data.checkoutUrl
    } else {
      throw new Error('No checkout URL received from server')
    }
  } catch (err) {
    console.error('Checkout error:', err)
    error.value =
      err instanceof Error ? err.message : 'An error occurred during checkout. Please try again.'
    isProcessing.value = false
  }
}

const removeFromCart = (index: number) => {
  cart.value.splice(index, 1)
  localStorage.setItem('gettingThereCart', JSON.stringify(cart.value))
  if (cart.value.length === 0) router.push('/store')
}

onMounted(loadCart)
</script>

<template>
  <main class="checkout">
    <AppHero variant="compact" tone="cream" align="left">
      <template #eyebrow>
        <AppEyebrow tone="cobalt">Home / Store / Checkout</AppEyebrow>
      </template>
      <template #title>Secure checkout</template>
      <template #lede>
        Complete your order for instant access to your digital resources.
      </template>
    </AppHero>

    <AppSection tone="cream-2" pad="xl">
      <AppContainer size="lg">
        <div class="checkout__grid">
          <!-- Left column: Customer + Payment -->
          <div class="checkout__form">
            <!-- Error -->
            <AppCard
              v-if="error"
              variant="plaque"
              tone="paper"
              shadow-tone="fuchsia"
              pad="md"
              class="checkout__error"
            >
              <p>{{ error }}</p>
            </AppCard>

            <!-- Contact -->
            <AppCard variant="plaque" tone="paper" shadow-tone="cobalt" pad="lg">
              <template #eyebrow>
                <AppEyebrow tone="cobalt">Contact information</AppEyebrow>
              </template>
              <template #title>Where should we send your downloads?</template>

              <form class="checkout__form-grid" @submit.prevent="processCheckout">
                <AppField label="Email address" required :error="formErrors.email">
                  <template #default="{ id }">
                    <AppInput
                      :id="id"
                      v-model="customerInfo.email"
                      type="email"
                      placeholder="your@email.com"
                      @blur="validateField('email')"
                    />
                  </template>
                </AppField>

                <div class="checkout__row">
                  <AppField label="First name" required :error="formErrors.firstName">
                    <template #default="{ id }">
                      <AppInput
                        :id="id"
                        v-model="customerInfo.firstName"
                        type="text"
                        placeholder="John"
                        @blur="validateField('firstName')"
                      />
                    </template>
                  </AppField>
                  <AppField label="Last name" required :error="formErrors.lastName">
                    <template #default="{ id }">
                      <AppInput
                        :id="id"
                        v-model="customerInfo.lastName"
                        type="text"
                        placeholder="Doe"
                        @blur="validateField('lastName')"
                      />
                    </template>
                  </AppField>
                </div>
              </form>
            </AppCard>

            <!-- Payment notice -->
            <AppCard variant="plaque" tone="paper" shadow-tone="marigold" pad="lg">
              <template #eyebrow>
                <AppEyebrow tone="marigold">Payment</AppEyebrow>
              </template>
              <template #title>Secure payment processing</template>
              <p class="checkout__copy">
                You'll be securely redirected to Square to complete your payment. We never store
                your payment information.
              </p>
              <ul class="checkout__badges">
                <li>SSL encrypted</li>
                <li>PCI compliant</li>
                <li>Square secured</li>
              </ul>
            </AppCard>

            <!-- Terms -->
            <AppCard variant="flat" tone="paper" pad="md">
              <AppCheckbox
                v-model="customerInfo.acceptTerms"
                @change="validateField('acceptTerms')"
              >
                I agree to the
                <router-link to="/terms" target="_blank">Terms of Service</router-link>
                and
                <router-link to="/privacy" target="_blank">Privacy Policy</router-link>
              </AppCheckbox>
              <p v-if="formErrors.acceptTerms" class="checkout__field-error" role="alert">
                {{ formErrors.acceptTerms }}
              </p>
            </AppCard>

            <!-- Actions -->
            <div class="checkout__actions">
              <AppButton
                variant="primary"
                size="lg"
                :disabled="!isFormValid || isProcessing"
                :loading="isProcessing"
                @click="processCheckout"
              >
                {{ isProcessing ? 'Processing…' : 'Proceed to secure payment' }}
              </AppButton>
              <AppButton variant="ghost" to="/store">← Back to store</AppButton>
            </div>

            <!-- Trust -->
            <ul class="checkout__trust">
              <li>Instant download</li>
              <li>30-day money-back guarantee</li>
              <li>100% secure checkout</li>
            </ul>
          </div>

          <!-- Right column: Order summary -->
          <aside class="checkout__aside">
            <AppCard
              variant="ticket"
              tone="paper"
              shadow-tone="mint"
              pad="lg"
              class="checkout__summary"
            >
              <template #eyebrow>
                <AppEyebrow tone="mint">Your order</AppEyebrow>
              </template>
              <template #title>Order summary</template>

              <ul class="checkout__items">
                <li v-for="(item, index) in cart" :key="item.id" class="checkout__item">
                  <div class="checkout__item-image">
                    <img
                      v-if="item.imageUrl"
                      :src="`https://getting-there-cms.onrender.com${item.imageUrl}`"
                      :alt="item.title"
                    />
                    <div v-else class="checkout__item-placeholder" aria-hidden="true"><BookOpen :size="24" :stroke-width="1.75" /></div>
                  </div>
                  <div class="checkout__item-meta">
                    <h3>{{ item.title }}</h3>
                    <p>{{ item.format }}</p>
                  </div>
                  <div class="checkout__item-price">
                    <span>${{ item.price.toFixed(2) }}</span>
                    <button
                      type="button"
                      class="checkout__item-remove"
                      title="Remove item"
                      @click="removeFromCart(index)"
                    >
                      ×
                    </button>
                  </div>
                </li>
              </ul>

              <dl class="checkout__totals">
                <div>
                  <dt>Subtotal</dt>
                  <dd>${{ cartSubtotal.toFixed(2) }}</dd>
                </div>
                <div>
                  <dt>Tax</dt>
                  <dd>Calculated at checkout</dd>
                </div>
                <div class="checkout__totals-grand">
                  <dt>Total</dt>
                  <dd>${{ cartTotal.toFixed(2) }}</dd>
                </div>
              </dl>

              <p class="checkout__delivery">
                Delivered instantly to your email after payment.
              </p>
            </AppCard>
          </aside>
        </div>
      </AppContainer>
    </AppSection>
  </main>
</template>

<style scoped lang="scss">
.checkout {
  &__grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: var(--s-6);

    @media (min-width: 960px) {
      grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
    }
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: var(--s-5);
  }

  &__form-grid {
    display: flex;
    flex-direction: column;
    gap: var(--s-4);
  }

  &__row {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--s-4);

    @media (min-width: 560px) {
      grid-template-columns: 1fr 1fr;
    }
  }

  &__error {
    color: var(--c-fuchsia-deep);
    font-weight: 600;

    p { margin: 0; }
  }

  &__copy {
    margin: 0 0 var(--s-3);
    color: var(--c-ink);
    line-height: var(--lh-base);
  }

  &__badges {
    display: flex;
    flex-wrap: wrap;
    gap: var(--s-2);
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      padding: var(--s-1) var(--s-3);
      background: var(--c-cream-2);
      border: 2px solid var(--c-ink);
      border-radius: 999px;
      font-size: var(--fs-xs);
      font-weight: 700;
      letter-spacing: var(--ls-wide);
      text-transform: uppercase;
      color: var(--c-ink);
    }
  }

  &__field-error {
    margin: var(--s-2) 0 0;
    color: var(--c-fuchsia-deep);
    font-size: var(--fs-sm);
    font-weight: 600;
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--s-3);
  }

  &__trust {
    display: flex;
    flex-wrap: wrap;
    gap: var(--s-3);
    list-style: none;
    padding: 0;
    margin: 0;
    color: var(--c-text-muted);
    font-size: var(--fs-sm);

    li {
      display: inline-flex;
      align-items: center;
      gap: var(--s-2);

      &::before {
        content: '✓';
        color: var(--c-mint-deep);
        font-weight: 800;
      }
    }
  }

  &__aside {
    @media (min-width: 960px) {
      position: sticky;
      top: calc(var(--s-6) + 80px);
      align-self: start;
    }
  }

  &__summary {
    width: 100%;
  }

  &__items {
    list-style: none;
    padding: 0;
    margin: 0 0 var(--s-4);
    display: flex;
    flex-direction: column;
    gap: var(--s-3);
  }

  &__item {
    display: grid;
    grid-template-columns: 56px 1fr auto;
    gap: var(--s-3);
    align-items: center;
    padding: var(--s-3);
    background: var(--c-cream-2);
    border: 2px solid var(--c-ink);
    border-radius: var(--r-md);
  }

  &__item-image {
    width: 56px;
    height: 56px;
    border-radius: var(--r-sm);
    overflow: hidden;
    border: 2px solid var(--c-ink);
    background: var(--c-paper);

    img { width: 100%; height: 100%; object-fit: cover; }
  }

  &__item-placeholder {
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
    font-size: var(--fs-xl);
  }

  &__item-meta {
    h3 {
      margin: 0 0 var(--s-1);
      font-family: var(--font-display);
      font-size: var(--fs-md);
      color: var(--c-ink);
    }

    p {
      margin: 0;
      font-size: var(--fs-xs);
      color: var(--c-text-muted);
      text-transform: uppercase;
      letter-spacing: var(--ls-wide);
    }
  }

  &__item-price {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: var(--s-1);

    span {
      font-family: var(--font-display);
      font-weight: 700;
      color: var(--c-ink);
    }
  }

  &__item-remove {
    border: none;
    background: transparent;
    color: var(--c-fuchsia);
    font-size: var(--fs-lg);
    line-height: 1;
    cursor: pointer;
    padding: 0;

    &:hover { color: var(--c-fuchsia-deep); }
  }

  &__totals {
    display: flex;
    flex-direction: column;
    gap: var(--s-2);
    padding: var(--s-4) 0;
    border-top: 2px solid var(--c-ink);
    border-bottom: 2px solid var(--c-ink);
    margin: 0;

    > div {
      display: flex;
      justify-content: space-between;
      gap: var(--s-3);
    }

    dt, dd {
      margin: 0;
      font-family: var(--font-body);
      color: var(--c-text-muted);
      font-size: var(--fs-sm);
    }
  }

  &__totals-grand {
    margin-top: var(--s-2);

    dt, dd {
      font-family: var(--font-display);
      font-size: var(--fs-lg);
      font-weight: 700;
      color: var(--c-ink);
    }
  }

  &__delivery {
    margin: var(--s-4) 0 0;
    text-align: center;
    font-size: var(--fs-sm);
    color: var(--c-text-muted);
  }
}
</style>
