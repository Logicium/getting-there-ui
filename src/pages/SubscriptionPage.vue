<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  AppBadge,
  AppButton,
  AppCard,
  AppContainer,
  AppEyebrow,
  AppHero,
  AppSection,
} from '@/components/ui'

type Plan = 'monthly' | 'yearly'

const authStore = useAuthStore()
const router = useRouter()

const loading = ref(false)
const error = ref('')
const selectedPlan = ref<Plan>('monthly')
const checkingStatus = ref(true)

const plans: Record<Plan, {
  amount: number
  period: string
  label: string
  badge: string
  savings: string
  recommended: boolean
}> = {
  monthly: {
    amount: 8,
    period: '/month',
    label: 'Monthly',
    badge: 'Flexible',
    savings: 'Cancel anytime — no long-term commitment.',
    recommended: false,
  },
  yearly: {
    amount: 80,
    period: '/year',
    label: 'Yearly',
    badge: 'Best value',
    savings: 'Save $16 vs. paying month-to-month.',
    recommended: true,
  },
}

const currentPlan = computed(() => plans[selectedPlan.value])

const benefits = [
  {
    icon: '✓',
    title: 'Unlimited course access',
    body: 'Every Getting There course, present and future — start, stop, and revisit any lesson.',
  },
  {
    icon: '✦',
    title: 'Track your progress',
    body: 'Resume where you left off, mark lessons complete, and earn certificates as you finish.',
  },
  {
    icon: '★',
    title: 'New content first',
    body: 'Members get early access to new courses, workshops, and downloadable resources.',
  },
  {
    icon: '♡',
    title: 'Cancel anytime',
    body: 'Manage your billing from your account. Cancel in one click — keep access until period end.',
  },
]

const faqs = [
  {
    q: 'How will I be billed?',
    a: 'Your card is charged today and then automatically on the same day each billing period. You can cancel anytime from your account.',
  },
  {
    q: 'Is my card information secure?',
    a: 'All payments are processed by Square on their secure, PCI-compliant checkout page. We never see or store your card details.',
  },
  {
    q: 'Can I switch plans later?',
    a: 'Yes — cancel your current plan and re-subscribe to the new one from your account. Existing access carries over until your current period ends.',
  },
  {
    q: 'What happens when I cancel?',
    a: 'You keep full access to every course until the end of the period you’ve already paid for. After that, your subscription simply stops.',
  },
]

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push('/login?redirect=/subscribe')
    return
  }
  await authStore.checkSubscriptionStatus()
  checkingStatus.value = false

  // If they already have an active subscription, send them to account.
  if (authStore.isSubscribed && authStore.subscription?.status === 'active') {
    router.replace('/account')
  }
})

async function handleSubscribe() {
  if (loading.value) return
  loading.value = true
  error.value = ''

  const result = await authStore.startSubscriptionCheckout(selectedPlan.value)

  if (result.success && result.checkoutUrl) {
    // Send the user to Square's hosted checkout page.
    window.location.href = result.checkoutUrl
    return
  }

  error.value = result.error || 'Could not start checkout. Please try again.'
  loading.value = false
}
</script>

<template>
  <main class="subscribe-page">
    <AppHero variant="compact" tone="cream" align="center">
      <template #eyebrow>
        <AppEyebrow tone="cobalt">Membership</AppEyebrow>
      </template>
      <template #title>One subscription. Every course.</template>
      <template #lede>
        Unlimited access to the full Getting There library, with secure billing
        through Square. Cancel anytime.
      </template>
    </AppHero>

    <AppSection tone="cream-2" pad="xl">
      <AppContainer size="lg">
        <div v-if="checkingStatus" class="subscribe-page__loading">
          <p>Checking your subscription…</p>
        </div>

        <div v-else class="subscribe-page__layout">
          <!-- Plan picker -->
          <AppCard
            variant="ticket"
            tone="paper"
            shadow-tone="marigold"
            pad="lg"
            class="subscribe-page__plans"
          >
            <template #eyebrow>
              <AppEyebrow tone="marigold">Choose your plan</AppEyebrow>
            </template>
            <template #title>Pick a billing cycle</template>

            <div class="subscribe-page__plan-grid" role="radiogroup" aria-label="Billing cycle">
              <button
                v-for="(plan, key) in plans"
                :key="key"
                type="button"
                role="radio"
                :aria-checked="selectedPlan === key"
                :class="['subscribe-page__plan', { 'is-active': selectedPlan === key, 'is-recommended': plan.recommended }]"
                @click="selectedPlan = key as Plan"
              >
                <div class="subscribe-page__plan-head">
                  <span class="subscribe-page__plan-label">{{ plan.label }}</span>
                  <AppBadge :tone="plan.recommended ? 'mint' : 'cobalt'">
                    {{ plan.badge }}
                  </AppBadge>
                </div>
                <div class="subscribe-page__plan-price">
                  <span class="subscribe-page__currency">$</span>
                  <span class="subscribe-page__amount">{{ plan.amount }}</span>
                  <span class="subscribe-page__period">{{ plan.period }}</span>
                </div>
                <p class="subscribe-page__plan-savings">{{ plan.savings }}</p>
                <span class="subscribe-page__plan-radio" aria-hidden="true">
                  <span class="subscribe-page__plan-radio-dot" />
                </span>
              </button>
            </div>

            <p v-if="error" class="subscribe-page__error" role="alert">{{ error }}</p>

            <template #footer>
              <div class="subscribe-page__cta">
                <AppButton
                  variant="primary"
                  block
                  :loading="loading"
                  :disabled="loading"
                  @click="handleSubscribe"
                >
                  {{ loading
                    ? 'Redirecting to Square…'
                    : `Continue to checkout — $${currentPlan.amount}${currentPlan.period}` }}
                </AppButton>
                <p class="subscribe-page__secure">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  You'll be redirected to Square's secure checkout to enter your payment details.
                </p>
              </div>
            </template>
          </AppCard>

          <!-- Benefits + summary -->
          <div class="subscribe-page__side">
            <AppCard variant="plaque" tone="paper" shadow-tone="cobalt" pad="lg">
              <template #eyebrow>
                <AppEyebrow tone="cobalt">What's included</AppEyebrow>
              </template>
              <template #title>Everything in your membership</template>

              <ul class="subscribe-page__benefits">
                <li v-for="b in benefits" :key="b.title">
                  <span class="subscribe-page__benefit-icon" aria-hidden="true">{{ b.icon }}</span>
                  <div>
                    <h3>{{ b.title }}</h3>
                    <p>{{ b.body }}</p>
                  </div>
                </li>
              </ul>
            </AppCard>

            <AppCard variant="postcard" tone="marigold" shadow-tone="ink" pad="lg">
              <template #eyebrow>
                <AppEyebrow tone="ink">Order summary</AppEyebrow>
              </template>
              <template #title>{{ currentPlan.label }} membership</template>

              <dl class="subscribe-page__summary">
                <div>
                  <dt>Plan</dt>
                  <dd>{{ currentPlan.label }} ({{ selectedPlan }})</dd>
                </div>
                <div>
                  <dt>Amount due today</dt>
                  <dd>${{ currentPlan.amount.toFixed(2) }}</dd>
                </div>
                <div>
                  <dt>Then</dt>
                  <dd>${{ currentPlan.amount }}{{ currentPlan.period }}, auto-renews</dd>
                </div>
                <div>
                  <dt>Billed by</dt>
                  <dd>Square (PCI-compliant)</dd>
                </div>
              </dl>
            </AppCard>
          </div>
        </div>
      </AppContainer>
    </AppSection>

    <AppSection tone="paper" pad="xl">
      <AppContainer size="md">
        <div class="subscribe-page__faq-head">
          <AppEyebrow tone="fuchsia">Common questions</AppEyebrow>
          <h2>Before you subscribe</h2>
        </div>

        <div class="subscribe-page__faqs">
          <details v-for="item in faqs" :key="item.q" class="subscribe-page__faq">
            <summary>{{ item.q }}</summary>
            <p>{{ item.a }}</p>
          </details>
        </div>

        <div class="subscribe-page__faq-foot">
          <AppButton variant="ghost" size="sm" to="/account">← Back to account</AppButton>
        </div>
      </AppContainer>
    </AppSection>
  </main>
</template>

<style scoped lang="scss">
.subscribe-page {
  &__loading {
    text-align: center;
    color: var(--c-text-muted);
    padding: var(--s-8) 0;
  }

  &__layout {
    display: grid;
    gap: var(--s-6);
    grid-template-columns: minmax(0, 1fr);

    @media (min-width: 960px) {
      grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
      align-items: start;
    }
  }

  &__side {
    display: flex;
    flex-direction: column;
    gap: var(--s-5);
  }

  &__plan-grid {
    display: grid;
    gap: var(--s-3);
    grid-template-columns: minmax(0, 1fr);
    margin-top: var(--s-3);

    @media (min-width: 600px) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  &__plan {
    position: relative;
    text-align: left;
    background: var(--c-paper);
    border: 2px solid var(--c-ink);
    border-radius: var(--r-md);
    padding: var(--s-4) var(--s-4) var(--s-5);
    cursor: pointer;
    transition: transform var(--dur-fast), box-shadow var(--dur-fast), background var(--dur-fast);
    color: var(--c-ink);

    &:hover {
      transform: translateY(-2px);
    }

    &.is-active {
      background: var(--c-cream);
      box-shadow: 6px 6px 0 var(--c-ink);
    }

    &.is-recommended::before {
      content: 'Recommended';
      position: absolute;
      top: -10px;
      right: 12px;
      padding: 2px 10px;
      border-radius: 999px;
      background: var(--c-mint);
      color: var(--c-ink);
      font-size: var(--fs-xs);
      font-weight: 800;
      letter-spacing: var(--ls-wide);
      border: 2px solid var(--c-ink);
    }
  }

  &__plan-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--s-2);
    margin-bottom: var(--s-2);
  }

  &__plan-label {
    font-family: var(--font-display);
    font-size: var(--fs-xl);
  }

  &__plan-price {
    display: flex;
    align-items: baseline;
    gap: var(--s-1);
    margin: var(--s-2) 0 var(--s-1);
  }

  &__currency {
    font-family: var(--font-display);
    font-size: var(--fs-lg);
  }

  &__amount {
    font-family: var(--font-display);
    font-size: var(--fs-5xl);
    line-height: 1;
    color: var(--c-fuchsia);
  }

  &__period {
    font-size: var(--fs-md);
    color: var(--c-text-muted);
  }

  &__plan-savings {
    margin: 0;
    font-size: var(--fs-sm);
    color: var(--c-text-muted);
  }

  &__plan-radio {
    position: absolute;
    bottom: 12px;
    right: 12px;
    width: 22px;
    height: 22px;
    border-radius: 999px;
    border: 2px solid var(--c-ink);
    background: var(--c-paper);
    display: grid;
    place-items: center;
  }

  &__plan-radio-dot {
    width: 0;
    height: 0;
    border-radius: 999px;
    background: var(--c-fuchsia);
    transition: width var(--dur-fast), height var(--dur-fast);
  }

  &__plan.is-active &__plan-radio-dot {
    width: 12px;
    height: 12px;
  }

  &__error {
    margin: var(--s-3) 0 0;
    padding: var(--s-3);
    background: var(--c-fuchsia-soft);
    border: 2px solid var(--c-fuchsia);
    border-radius: var(--r-md);
    color: var(--c-fuchsia-deep);
    font-weight: 600;
    font-size: var(--fs-sm);
  }

  &__cta {
    width: 100%;
  }

  &__secure {
    margin: var(--s-3) 0 0;
    display: flex;
    align-items: center;
    gap: var(--s-2);
    color: var(--c-text-subtle);
    font-size: var(--fs-xs);

    svg { color: var(--c-mint-deep); }
  }

  &__benefits {
    list-style: none;
    padding: 0;
    margin: var(--s-3) 0 0;
    display: flex;
    flex-direction: column;
    gap: var(--s-3);

    li {
      display: flex;
      gap: var(--s-3);
      align-items: flex-start;
    }

    h3 {
      margin: 0 0 var(--s-1);
      font-family: var(--font-display);
      font-size: var(--fs-md);
    }

    p {
      margin: 0;
      font-size: var(--fs-sm);
      color: var(--c-text-muted);
      line-height: var(--lh-base);
    }
  }

  &__benefit-icon {
    display: inline-grid;
    place-items: center;
    width: 32px;
    height: 32px;
    border-radius: 999px;
    background: var(--c-mint);
    color: var(--c-ink);
    font-weight: 800;
    border: 2px solid var(--c-ink);
    flex-shrink: 0;
  }

  &__summary {
    margin: var(--s-3) 0 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--s-2);

    > div {
      display: flex;
      justify-content: space-between;
      gap: var(--s-3);
      padding-bottom: var(--s-2);
      border-bottom: 1px dashed rgba(24, 22, 35, 0.25);
    }

    > div:last-child { border-bottom: 0; }

    dt {
      color: var(--c-ink);
      font-weight: 600;
    }

    dd {
      margin: 0;
      color: var(--c-ink);
      font-weight: 700;
      text-align: right;
    }
  }

  &__faq-head {
    text-align: center;
    margin-bottom: var(--s-5);

    h2 {
      font-family: var(--font-display);
      font-size: var(--fs-3xl);
      margin: var(--s-2) 0 0;
    }
  }

  &__faqs {
    display: flex;
    flex-direction: column;
    gap: var(--s-3);
  }

  &__faq {
    background: var(--c-cream);
    border: 2px solid var(--c-ink);
    border-radius: var(--r-md);
    padding: var(--s-3) var(--s-4);

    summary {
      cursor: pointer;
      font-family: var(--font-display);
      font-size: var(--fs-md);
      list-style: none;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--s-3);

      &::-webkit-details-marker { display: none; }

      &::after {
        content: '+';
        font-weight: 800;
        color: var(--c-cobalt);
      }
    }

    &[open] summary::after { content: '−'; }

    p {
      margin: var(--s-3) 0 0;
      color: var(--c-text-muted);
      line-height: var(--lh-base);
    }
  }

  &__faq-foot {
    margin-top: var(--s-5);
    text-align: center;
  }
}
</style>
