<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  AppBadge,
  AppButton,
  AppCard,
  AppContainer,
  AppEyebrow,
  AppHero,
  AppSection,
  AppSpinner,
} from '@/components/ui'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const isLoading = ref(true)
const errorMsg = ref<string | null>(null)
const subscription = ref<any>(null)
const status = ref<'pending' | 'active' | 'cancelled' | 'expired' | 'past_due'>('pending')

const subscriptionId = computed(
  () => (route.query.subscriptionId as string) || '',
)

async function verify(retry = 0) {
  if (!subscriptionId.value) {
    errorMsg.value = 'Missing subscription reference. Please check your account page.'
    isLoading.value = false
    return
  }
  if (!authStore.isAuthenticated) {
    router.push(`/login?redirect=${encodeURIComponent(route.fullPath)}`)
    return
  }

  const result = await authStore.verifySubscriptionCheckout(subscriptionId.value)

  if (!result.success) {
    if (retry < 3) {
      setTimeout(() => verify(retry + 1), 2000)
      return
    }
    errorMsg.value = 'We couldn\u2019t verify your subscription. It may take a moment to appear in your account.'
    isLoading.value = false
    return
  }

  subscription.value = result.subscription
  status.value = result.subscription?.status ?? 'pending'

  if (status.value === 'pending' && retry < 4) {
    setTimeout(() => verify(retry + 1), 2500)
    return
  }

  await authStore.checkSubscriptionStatus()
  await authStore.loadPaymentHistory()
  isLoading.value = false
}

function retryVerify() {
  isLoading.value = true
  errorMsg.value = null
  verify(0)
}

onMounted(() => verify())

const isActive = computed(() => status.value === 'active')

const heroTone = computed<'cream' | 'fuchsia'>(() =>
  !isLoading.value && errorMsg.value ? 'fuchsia' : 'cream',
)

const heroEyebrowTone = computed<'mint' | 'cobalt'>(() =>
  isActive.value ? 'mint' : 'cobalt',
)

const heroEyebrow = computed(() => {
  if (isLoading.value) return 'Confirming…'
  if (errorMsg.value) return 'Almost there'
  if (isActive.value) return 'You\u2019re in!'
  return 'Welcome'
})

const heroTitle = computed(() => {
  if (isLoading.value) return 'Confirming your subscription'
  if (errorMsg.value) return 'We\u2019re finishing up'
  if (isActive.value) return 'Welcome to Getting There.'
  return 'Subscription confirmed'
})

const heroLede = computed(() => {
  if (errorMsg.value) return 'Hold tight while Square confirms the payment with us.'
  if (isActive.value) return 'Your membership is active. Every course is now unlocked.'
  return 'We\u2019re wrapping up your sign-up.'
})

const nextBillingDate = computed(() => {
  const d = subscription.value?.nextBillingDate
  if (!d) return null
  const date = new Date(d)
  return Number.isNaN(date.getTime())
    ? null
    : date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
})

function goToAccount() {
  router.push('/account')
}

function browseCourses() {
  router.push('/classes')
}
</script>

<template>
  <main class="sub-success">
    <AppHero variant="compact" :tone="heroTone" align="center">
      <template #eyebrow>
        <AppEyebrow :tone="heroEyebrowTone">{{ heroEyebrow }}</AppEyebrow>
      </template>
      <template #title>{{ heroTitle }}</template>
      <template #lede>{{ heroLede }}</template>
    </AppHero>

    <AppSection tone="cream-2" pad="xl">
      <AppContainer size="md">
        <AppCard
          v-if="isLoading"
          variant="plaque"
          tone="paper"
          shadow-tone="cobalt"
          pad="lg"
        >
          <div class="sub-success__loading">
            <AppSpinner />
            <p>Verifying your payment with Square…</p>
          </div>
        </AppCard>

        <AppCard
          v-else-if="errorMsg"
          variant="plaque"
          tone="paper"
          shadow-tone="fuchsia"
          pad="lg"
        >
          <template #eyebrow>
            <AppEyebrow tone="fuchsia">Heads up</AppEyebrow>
          </template>
          <template #title>We're still confirming</template>
          <p>{{ errorMsg }}</p>
          <p>If you completed payment on Square, your access should appear within a few minutes. Refresh this page or check your account.</p>
          <template #footer>
            <div class="sub-success__actions">
              <AppButton variant="primary" @click="goToAccount">Go to my account</AppButton>
              <AppButton variant="ghost" @click="retryVerify">Try again</AppButton>
            </div>
          </template>
        </AppCard>

        <AppCard
          v-else
          variant="plaque"
          tone="paper"
          shadow-tone="mint"
          pad="lg"
        >
          <template #eyebrow>
            <AppEyebrow tone="mint">Payment confirmed</AppEyebrow>
          </template>
          <template #title>Your subscription is active</template>

          <dl class="sub-success__summary">
            <div>
              <dt>Status</dt>
              <dd>
                <AppBadge :tone="isActive ? 'mint' : 'marigold'">{{ status }}</AppBadge>
              </dd>
            </div>
            <div>
              <dt>Plan</dt>
              <dd>
                ${{ Number(subscription?.amount ?? 0).toFixed(0) }}
                /
                {{ subscription?.billingCycle === 'yearly' ? 'year' : 'month' }}
              </dd>
            </div>
            <div v-if="nextBillingDate">
              <dt>Next billing</dt>
              <dd>{{ nextBillingDate }}</dd>
            </div>
            <div v-if="subscription?.cardLast4">
              <dt>Card on file</dt>
              <dd>{{ subscription.cardBrand || 'Card' }} •••• {{ subscription.cardLast4 }}</dd>
            </div>
          </dl>

          <template #footer>
            <div class="sub-success__actions">
              <AppButton variant="primary" @click="browseCourses">Browse courses</AppButton>
              <AppButton variant="ghost" @click="goToAccount">View my account</AppButton>
            </div>
          </template>
        </AppCard>
      </AppContainer>
    </AppSection>
  </main>
</template>

<style scoped lang="scss">
.sub-success {
  &__loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--s-3);
    padding: var(--s-5) 0;
    text-align: center;

    p { margin: 0; color: var(--c-text-muted); }
  }

  &__summary {
    margin: var(--s-3) 0 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--s-3);

    > div {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--s-3);
      padding-bottom: var(--s-2);
      border-bottom: 1px dashed rgba(24, 22, 35, 0.25);
    }

    > div:last-child { border-bottom: 0; }

    dt { font-weight: 600; color: var(--c-text-muted); }
    dd { margin: 0; font-weight: 700; color: var(--c-ink); }
  }

  &__actions {
    display: flex;
    gap: var(--s-3);
    flex-wrap: wrap;
  }
}
</style>
