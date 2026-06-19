<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  AppBadge,
  AppButton,
  AppCard,
  AppContainer,
  AppEyebrow,
  AppGrid,
  AppHero,
  AppSection,
  AppSpinner,
} from '@/components/ui'

const route = useRoute()
const router = useRouter()

const isLoading = ref(true)
const orderDetails = ref<any>(null)
const customerInfo = ref<any>(null)
const error = ref<string | null>(null)
const isPending = ref(false)

const verifyOrder = async () => {
  isLoading.value = true
  error.value = null
  isPending.value = false

  try {
    const orderId = route.query.internal_order_id || route.query.internalOrderId
    const apiUrl = import.meta.env.VITE_API_URL

    if (!orderId) throw new Error('No order ID found')

    const response = await fetch(`${apiUrl}/checkout/verify-payment?internalOrderId=${orderId}`)
    if (!response.ok) throw new Error('Failed to verify order')

    const data = await response.json()

    if (data.pending) {
      isPending.value = true
      orderDetails.value = data
      if (data.customer) {
        customerInfo.value = data.customer
      } else {
        const savedCustomer = localStorage.getItem('gettingThereCustomer')
        if (savedCustomer) customerInfo.value = JSON.parse(savedCustomer)
      }
    } else {
      orderDetails.value = data
      if (data.customer) {
        customerInfo.value = data.customer
      } else {
        const savedCustomer = localStorage.getItem('gettingThereCustomer')
        if (savedCustomer) customerInfo.value = JSON.parse(savedCustomer)
      }
      localStorage.removeItem('gettingThereCart')
      localStorage.removeItem('gettingThereCustomer')
    }
  } catch (err) {
    console.error('Order verification error:', err)
    error.value = err instanceof Error ? err.message : 'Failed to verify order'
  } finally {
    isLoading.value = false
  }
}

onMounted(verifyOrder)

const nextSteps = [
  { title: 'Check your email', body: 'Your download links have been sent to your email address.' },
  { title: 'Download your resources', body: 'Click the download links in your email to access your digital books.' },
  { title: 'Start your journey', body: 'Begin reading and exploring your new therapeutic resources.' },
]
</script>

<template>
  <main class="success-page">
    <!-- Loading -->
    <template v-if="isLoading">
      <AppSection tone="cream" pad="xl">
        <AppContainer size="sm">
          <AppCard variant="plaque" tone="paper" shadow-tone="cobalt" pad="lg" class="success-page__center">
            <div class="success-page__loading">
              <AppSpinner />
              <p>Verifying your order…</p>
            </div>
          </AppCard>
        </AppContainer>
      </AppSection>
    </template>

    <!-- Error -->
    <template v-else-if="error">
      <AppHero variant="compact" tone="fuchsia" align="center">
        <template #eyebrow>
          <AppEyebrow tone="ink">Verification failed</AppEyebrow>
        </template>
        <template #title>We hit a snag verifying your order</template>
        <template #lede>{{ error }}</template>
        <template #actions>
          <AppButton variant="ink" @click="router.push('/store')">Return to store</AppButton>
          <AppButton variant="ghost" href="mailto:support@gthere.net">Contact support</AppButton>
        </template>
      </AppHero>
    </template>

    <!-- Pending -->
    <template v-else-if="isPending">
      <AppHero variant="compact" tone="marigold" align="center">
        <template #eyebrow>
          <AppEyebrow tone="ink">Payment processing</AppEyebrow>
        </template>
        <template #title>Your order is being verified</template>
        <template #lede>
          We've received your payment. It's currently being processed by our payment processor.
        </template>
      </AppHero>

      <AppSection tone="cream" pad="lg">
        <AppContainer size="md">
          <AppCard variant="plaque" tone="paper" shadow-tone="marigold" pad="lg">
            <template #eyebrow>
              <AppEyebrow tone="marigold">Order Info</AppEyebrow>
            </template>
            <template #title>Verification in progress</template>
            <p v-if="customerInfo?.email" class="success-page__muted">
              Order confirmation will be sent to: <strong>{{ customerInfo.email }}</strong>
            </p>
            <ul class="success-page__instructions">
              <li><strong>Wait a few minutes</strong> — payment verification usually takes 1-3 minutes</li>
              <li><strong>Refresh this page</strong> to check on your payment</li>
              <li><strong>Check your email</strong> — you'll receive confirmation once processing completes</li>
              <li><strong>Contact support</strong> if this status persists more than 10 minutes</li>
            </ul>
            <template #footer>
              <AppBadge tone="marigold">Order ID: {{ orderDetails?.orderId || 'Processing' }}</AppBadge>
              <div class="success-page__actions">
                <AppButton variant="primary" @click="verifyOrder">Refresh status</AppButton>
                <AppButton variant="ghost" @click="router.push('/store')">Continue shopping</AppButton>
              </div>
            </template>
          </AppCard>

          <p class="success-page__support">
            Having issues? Contact <a href="mailto:support@gthere.net">support@gthere.net</a>
          </p>
        </AppContainer>
      </AppSection>
    </template>

    <!-- Success -->
    <template v-else>
      <AppHero variant="magazine" tone="mint" align="center">
        <template #eyebrow>
          <AppEyebrow tone="ink">Order confirmed</AppEyebrow>
        </template>
        <template #title>Thank you for your purchase!</template>
        <template #lede>
          Your order has been confirmed and your digital resources are ready.
        </template>
      </AppHero>

      <AppSection tone="cream" pad="lg">
        <AppContainer size="md">
          <AppCard variant="plaque" tone="paper" shadow-tone="cobalt" pad="lg">
            <template #eyebrow>
              <AppEyebrow tone="cobalt">Order confirmation</AppEyebrow>
            </template>
            <template #title>Check your email</template>
            <p class="success-page__muted">We've sent your digital resources and order confirmation to:</p>
            <p class="success-page__email">{{ customerInfo?.email || 'your email address' }}</p>
            <p class="success-page__note">
              If you don't see it within a few minutes, please check your spam folder.
            </p>

            <div v-if="orderDetails?.items" class="success-page__items">
              <h3>Your digital resources</h3>
              <ul>
                <li v-for="item in orderDetails.items" :key="item.id">
                  <div>
                    <strong>{{ item.name }}</strong>
                    <span>Digital Edition • Instant Download</span>
                  </div>
                  <span class="success-page__price">${{ (item.amount / 100).toFixed(2) }}</span>
                </li>
              </ul>
            </div>

            <div v-if="orderDetails?.total" class="success-page__total">
              <span>Total paid</span>
              <span class="success-page__total-amount">${{ (orderDetails.total / 100).toFixed(2) }}</span>
            </div>

            <template #footer>
              <AppBadge tone="cobalt">Order ID: {{ orderDetails?.orderId || 'Processing' }}</AppBadge>
            </template>
          </AppCard>
        </AppContainer>
      </AppSection>

      <AppSection tone="cream-2" pad="xl">
        <AppContainer size="lg">
          <header class="success-page__lead">
            <AppEyebrow tone="fuchsia">What's next</AppEyebrow>
            <h2 class="success-page__heading">Three quick steps</h2>
          </header>
          <AppGrid :min="240" gap="lg">
            <AppCard
              v-for="(step, i) in nextSteps"
              :key="step.title"
              variant="flat"
              tone="paper"
              pad="lg"
            >
              <span class="success-page__step-num">0{{ i + 1 }}</span>
              <h3 class="success-page__step-title">{{ step.title }}</h3>
              <p class="success-page__muted">{{ step.body }}</p>
            </AppCard>
          </AppGrid>
        </AppContainer>
      </AppSection>

      <AppSection tone="ink" pad="lg">
        <AppContainer size="md">
          <div class="success-page__cta">
            <AppEyebrow tone="marigold">30-day guarantee</AppEyebrow>
            <h2 class="success-page__cta-title">Not satisfied? Get a refund.</h2>
            <p>No questions asked. Just reach out and we'll make it right.</p>
            <div class="success-page__actions">
              <AppButton variant="primary" @click="router.push('/store')">Browse more</AppButton>
              <AppButton variant="ghost" @click="router.push('/')">Return home</AppButton>
            </div>
          </div>
        </AppContainer>
      </AppSection>
    </template>
  </main>
</template>

<style scoped lang="scss">
.success-page {
  &__center { margin-block: var(--s-6); }

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

  &__muted {
    margin: 0;
    color: var(--c-text-muted);
    line-height: var(--lh-base);
  }

  &__instructions {
    margin: var(--s-4) 0 0;
    padding-left: var(--s-5);
    color: var(--c-text-muted);
    line-height: var(--lh-base);

    li { margin-bottom: var(--s-2); }
    strong { color: var(--c-ink); }
  }

  &__email {
    margin: var(--s-2) 0;
    font-family: var(--font-display);
    font-size: var(--fs-xl);
    color: var(--c-cobalt);
  }

  &__note {
    margin: 0 0 var(--s-4);
    color: var(--c-text-subtle);
    font-size: var(--fs-sm);
  }

  &__items {
    margin-top: var(--s-5);
    padding-top: var(--s-4);
    border-top: 2px dashed var(--c-ink);

    h3 {
      font-family: var(--font-display);
      font-size: var(--fs-md);
      color: var(--c-ink);
      margin: 0 0 var(--s-3);
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--s-3);
      padding: var(--s-3) 0;
      border-bottom: 1px dashed var(--c-ink-soft);

      strong {
        display: block;
        font-family: var(--font-display);
        color: var(--c-ink);
        font-size: var(--fs-md);
      }

      span:not(.success-page__price) {
        display: block;
        font-size: var(--fs-xs);
        color: var(--c-text-subtle);
        text-transform: uppercase;
        letter-spacing: var(--ls-wide);
      }
    }
  }

  &__price {
    font-family: var(--font-accent);
    color: var(--c-cobalt);
    font-size: var(--fs-md);
  }

  &__total {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-top: var(--s-4);
    padding-top: var(--s-3);
    border-top: 3px solid var(--c-ink);

    span:first-child {
      font-family: var(--font-display);
      font-size: var(--fs-lg);
      color: var(--c-ink);
    }
  }

  &__total-amount {
    font-family: var(--font-display);
    font-size: var(--fs-2xl);
    color: var(--c-fuchsia);
  }

  &__lead {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--s-3);
    margin-bottom: var(--s-7);
    text-align: center;
  }

  &__heading {
    font-family: var(--font-display);
    font-size: var(--fs-4xl);
    color: var(--c-ink);
    margin: 0;
  }

  &__step-num {
    font-family: var(--font-accent);
    color: var(--c-fuchsia);
    font-size: var(--fs-lg);
  }

  &__step-title {
    font-family: var(--font-display);
    font-size: var(--fs-xl);
    color: var(--c-ink);
    margin: var(--s-1) 0 var(--s-2);
  }

  &__actions {
    display: flex;
    gap: var(--s-3);
    flex-wrap: wrap;
    margin-top: var(--s-3);
  }

  &__support {
    margin: var(--s-5) 0 0;
    text-align: center;
    color: var(--c-text-muted);
    font-size: var(--fs-sm);

    a { color: var(--c-cobalt); font-weight: 600; }
  }

  &__cta {
    text-align: center;
    color: var(--c-cream);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--s-3);

    p { margin: 0; color: var(--c-cream); opacity: 0.85; }
  }

  &__cta-title {
    font-family: var(--font-display);
    font-size: var(--fs-3xl);
    color: var(--c-cream);
    margin: 0;
  }
}
</style>
