<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { mockCourses } from '@/data/courses'
import {
  AppBadge,
  AppButton,
  AppCard,
  AppContainer,
  AppEyebrow,
  AppField,
  AppHero,
  AppInput,
  AppSection,
} from '@/components/ui'

const router = useRouter()
const authStore = useAuthStore()

const editingName = ref(false)
const newName = ref(authStore.user?.name || '')
const showUnsubscribeConfirm = ref(false)
const paymentsLoading = ref(true)

onMounted(async () => {
  await authStore.checkSubscriptionStatus()
  paymentsLoading.value = true
  await authStore.loadPaymentHistory()
  paymentsLoading.value = false
})

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

async function handleUnsubscribe() {
  await authStore.unsubscribe()
  showUnsubscribeConfirm.value = false
}

function handleLogout() {
  authStore.logout()
  router.push('/')
}

const completedCourses = computed(() =>
  mockCourses.filter(course => authStore.user?.completedCourses.includes(course.id)),
)

const daysRemaining = computed(() => {
  const sub = authStore.subscription
  if (!sub) return null
  const target = sub.status === 'cancelled' ? sub.endDate : sub.nextBillingDate
  if (!target) return null
  const diffMs = new Date(target).getTime() - Date.now()
  if (Number.isNaN(diffMs)) return null
  return Math.max(0, Math.ceil(diffMs / (24 * 60 * 60 * 1000)))
})

function formatDate(value?: string | null) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
}

function formatAmount(amount: number, currency = 'USD') {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 2,
    }).format(amount)
  } catch {
    return `$${amount.toFixed(2)}`
  }
}

const periodEndDate = computed(() => {
  const sub = authStore.subscription
  if (!sub) return ''
  return formatDate(sub.status === 'cancelled' ? sub.endDate : sub.nextBillingDate)
})

const nextBillingDate = computed(() =>
  formatDate(authStore.subscription?.nextBillingDate),
)

const startDate = computed(() => formatDate(authStore.subscription?.startDate))

const lastPaymentDate = computed(() =>
  formatDate(authStore.subscription?.lastPaymentDate),
)

const isPending = computed(() => authStore.subscription?.status === 'pending')
const isPastDue = computed(() => authStore.subscription?.status === 'past_due')
const isCancelled = computed(() => authStore.subscription?.status === 'cancelled')

const hasSubscriptionRecord = computed(() => !!authStore.subscription)

const subscriptionPriceLabel = computed(() => {
  const sub = authStore.subscription
  if (!sub) return '$8 / month'
  const cycle = sub.billingCycle === 'yearly' ? 'year' : 'month'
  return `$${Number(sub.amount).toFixed(0)} / ${cycle}`
})

const subStatusTone = computed<'mint' | 'marigold' | 'fuchsia' | 'cobalt'>(() => {
  const status = authStore.subscription?.status
  if (status === 'active') return 'mint'
  if (status === 'cancelled') return 'marigold'
  if (status === 'past_due') return 'fuchsia'
  if (status === 'pending') return 'cobalt'
  return 'fuchsia'
})

const subStatusLabel = computed(() => {
  const status = authStore.subscription?.status
  if (status === 'active') return 'Active'
  if (status === 'cancelled') return 'Cancelled'
  if (status === 'past_due') return 'Payment past due'
  if (status === 'pending') return 'Pending payment'
  return authStore.isSubscribed ? 'Active' : 'Inactive'
})

const paymentMethodLabel = computed(() => {
  const sub = authStore.subscription
  if (!sub?.cardLast4) return null
  const brand = sub.cardBrand ? formatBrand(sub.cardBrand) : 'Card'
  return `${brand} •••• ${sub.cardLast4}`
})

function formatBrand(brand: string) {
  return brand
    .toString()
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function paymentStatusTone(status: string): 'mint' | 'marigold' | 'fuchsia' {
  if (status === 'completed') return 'mint'
  if (status === 'refunded') return 'marigold'
  return 'fuchsia'
}
</script>

<template>
  <main class="account-page">
    <AppHero variant="compact" tone="cream" align="left">
      <template #eyebrow>
        <AppEyebrow tone="cobalt">Your account</AppEyebrow>
      </template>
      <template #title>Account settings</template>
      <template #lede>Manage your profile, subscription, and saved progress.</template>
    </AppHero>

    <AppSection tone="cream-2" pad="xl">
      <AppContainer size="lg">
        <div class="account-page__grid">
          <div class="account-page__main">
            <!-- Profile -->
            <AppCard variant="plaque" tone="paper" shadow-tone="cobalt" pad="lg">
              <template #eyebrow>
                <AppEyebrow tone="cobalt">Profile</AppEyebrow>
              </template>
              <template #title>Profile information</template>

              <div class="account-page__field">
                <span class="account-page__label">Name</span>
                <div v-if="!editingName" class="account-page__row">
                  <span class="account-page__value">{{ authStore.user?.name }}</span>
                  <AppButton variant="ghost" size="sm" @click="startEditName">Edit</AppButton>
                </div>
                <div v-else class="account-page__edit">
                  <AppField>
                    <template #default="{ id }">
                      <AppInput
                        :id="id"
                        v-model="newName"
                        type="text"
                        placeholder="Enter your name"
                        @keyup.enter="saveName"
                        @keyup.escape="cancelEditName"
                      />
                    </template>
                  </AppField>
                  <div class="account-page__edit-actions">
                    <AppButton variant="primary" size="sm" @click="saveName">Save</AppButton>
                    <AppButton variant="ghost" size="sm" @click="cancelEditName">Cancel</AppButton>
                  </div>
                </div>
              </div>

              <div class="account-page__field">
                <span class="account-page__label">Email</span>
                <span class="account-page__value">{{ authStore.user?.email }}</span>
              </div>
            </AppCard>

            <!-- Subscription overview -->
            <AppCard variant="plaque" tone="paper" shadow-tone="marigold" pad="lg">
              <template #eyebrow>
                <AppEyebrow tone="marigold">Membership</AppEyebrow>
              </template>
              <template #title>Subscription</template>

              <div class="account-page__sub-head">
                <AppBadge :tone="subStatusTone">{{ subStatusLabel }}</AppBadge>
                <span v-if="hasSubscriptionRecord" class="account-page__sub-price">
                  {{ subscriptionPriceLabel }}
                </span>
              </div>

              <p v-if="!hasSubscriptionRecord" class="account-page__sub-blurb">
                Subscribe for unlimited access to every course in the Getting There library.
              </p>

              <p v-else-if="isPending" class="account-page__sub-blurb">
                We're waiting on Square to confirm your payment. If you didn't finish checkout,
                you can resume below.
              </p>

              <p v-else-if="isPastDue" class="account-page__sub-blurb">
                Your last renewal didn't go through. Update your payment method to keep access.
              </p>

              <p v-else-if="isCancelled" class="account-page__sub-blurb">
                Your subscription is cancelled. You still have access until the end of the paid period.
              </p>

              <p v-else class="account-page__sub-blurb">
                You have unlimited access to every course in the Getting There library.
              </p>

              <dl v-if="hasSubscriptionRecord" class="account-page__sub-grid">
                <div v-if="!isCancelled && nextBillingDate">
                  <dt>Next billing date</dt>
                  <dd>
                    {{ nextBillingDate }}
                    <span v-if="daysRemaining !== null" class="account-page__meta">
                      &middot; in {{ daysRemaining }} day<span v-if="daysRemaining !== 1">s</span>
                    </span>
                  </dd>
                </div>
                <div v-if="isCancelled && periodEndDate">
                  <dt>Access ends</dt>
                  <dd>
                    {{ periodEndDate }}
                    <span v-if="daysRemaining !== null" class="account-page__meta">
                      &middot; {{ daysRemaining }} day<span v-if="daysRemaining !== 1">s</span> left
                    </span>
                  </dd>
                </div>
                <div v-if="lastPaymentDate">
                  <dt>Last payment</dt>
                  <dd>{{ lastPaymentDate }}</dd>
                </div>
                <div v-if="startDate">
                  <dt>Member since</dt>
                  <dd>{{ startDate }}</dd>
                </div>
                <div v-if="paymentMethodLabel">
                  <dt>Payment method</dt>
                  <dd>{{ paymentMethodLabel }}</dd>
                </div>
              </dl>

              <template #footer>
                <div class="account-page__sub-actions">
                  <AppButton
                    v-if="isPending && authStore.subscription?.pendingCheckoutUrl"
                    variant="primary"
                    :href="authStore.subscription.pendingCheckoutUrl || undefined"
                  >
                    Resume checkout
                  </AppButton>
                  <AppButton
                    v-else-if="!hasSubscriptionRecord || (!authStore.isSubscribed && !isPending)"
                    variant="primary"
                    @click="router.push('/subscribe')"
                  >
                    Subscribe from $8 / month
                  </AppButton>
                  <AppButton
                    v-else-if="isCancelled"
                    variant="primary"
                    @click="router.push('/subscribe')"
                  >
                    Reactivate subscription
                  </AppButton>
                  <AppButton
                    v-else-if="authStore.isSubscribed && !isCancelled"
                    variant="ghost"
                    @click="showUnsubscribeConfirm = true"
                  >
                    Cancel subscription
                  </AppButton>
                </div>
              </template>
            </AppCard>

            <!-- Payment history -->
            <AppCard
              v-if="hasSubscriptionRecord"
              variant="plaque"
              tone="paper"
              shadow-tone="cobalt"
              pad="lg"
            >
              <template #eyebrow>
                <AppEyebrow tone="cobalt">Billing</AppEyebrow>
              </template>
              <template #title>Payment history</template>

              <p v-if="paymentsLoading" class="account-page__sub-blurb">Loading…</p>
              <p
                v-else-if="!paymentsLoading && authStore.payments.length === 0"
                class="account-page__sub-blurb"
              >
                No payments yet. Once Square confirms your first payment, it'll show up here with a receipt.
              </p>

              <ul v-else class="account-page__payments">
                <li v-for="p in authStore.payments" :key="p.id">
                  <div class="account-page__payment-row">
                    <div class="account-page__payment-main">
                      <span class="account-page__payment-amount">
                        {{ formatAmount(Number(p.amount), p.currency) }}
                      </span>
                      <span v-if="p.paidAt" class="account-page__payment-date">
                        {{ formatDate(p.paidAt) }}
                      </span>
                    </div>
                    <div class="account-page__payment-meta">
                      <span v-if="p.cardLast4" class="account-page__payment-card">
                        {{ p.cardBrand ? formatBrand(p.cardBrand) : 'Card' }} ••• {{ p.cardLast4 }}
                      </span>
                      <AppBadge :tone="paymentStatusTone(p.status)">{{ p.status }}</AppBadge>
                      <a
                        v-if="p.receiptUrl"
                        :href="p.receiptUrl"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="account-page__receipt-link"
                      >
                        View receipt ↗
                      </a>
                    </div>
                  </div>
                </li>
              </ul>
            </AppCard>

            <!-- Completed courses -->
            <AppCard
              v-if="completedCourses.length > 0"
              variant="plaque"
              tone="paper"
              shadow-tone="mint"
              pad="lg"
            >
              <template #eyebrow>
                <AppEyebrow tone="mint">Achievements</AppEyebrow>
              </template>
              <template #title>Completed courses</template>

              <ul class="account-page__courses">
                <li v-for="course in completedCourses" :key="course.id">
                  <div class="account-page__course-icon" aria-hidden="true">★</div>
                  <div class="account-page__course-info">
                    <h3>{{ course.title }}</h3>
                    <p>{{ course.subtitle }}</p>
                  </div>
                  <RouterLink
                    :to="`/classes/${course.id}/certificate`"
                    class="account-page__cert-link"
                  >
                    View certificate
                  </RouterLink>
                </li>
              </ul>
            </AppCard>

            <!-- Danger zone -->
            <AppCard variant="flat" tone="paper" pad="lg" class="account-page__danger">
              <template #eyebrow>
                <AppEyebrow tone="fuchsia">Account actions</AppEyebrow>
              </template>
              <template #title>Sign out</template>
              <p>You'll need to sign in again to access your account.</p>
              <template #footer>
                <AppButton variant="ghost" @click="handleLogout">Log out</AppButton>
              </template>
            </AppCard>
          </div>

          <aside class="account-page__aside">
            <AppCard variant="postcard" tone="marigold" shadow-tone="ink" pad="lg">
              <template #eyebrow>
                <AppEyebrow tone="ink">Need help?</AppEyebrow>
              </template>
              <template #title>We've got you</template>
              <p>Any questions about your account or subscription — reach out and we'll sort it.</p>
              <template #footer>
                <AppButton variant="ink" to="/about">Contact support</AppButton>
              </template>
            </AppCard>
          </aside>
        </div>
      </AppContainer>
    </AppSection>

    <!-- Unsubscribe modal -->
    <div
      v-if="showUnsubscribeConfirm"
      class="account-page__overlay"
      @click="showUnsubscribeConfirm = false"
    >
      <div class="account-page__modal" @click.stop>
        <AppCard variant="plaque" tone="paper" shadow-tone="fuchsia" pad="lg">
          <template #eyebrow>
            <AppEyebrow tone="fuchsia">Confirm</AppEyebrow>
          </template>
          <template #title>Confirm unsubscribe</template>
          <p>
            Are you sure you want to unsubscribe? You'll keep access until the end of your paid period<span v-if="periodEndDate"> ({{ periodEndDate }})</span>.
          </p>
          <template #footer>
            <div class="account-page__modal-actions">
              <AppButton variant="ghost" @click="showUnsubscribeConfirm = false">Cancel</AppButton>
              <AppButton variant="primary" @click="handleUnsubscribe">Yes, unsubscribe</AppButton>
            </div>
          </template>
        </AppCard>
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss">
.account-page {
  &__grid {
    display: grid;
    gap: var(--s-6);
    grid-template-columns: minmax(0, 1fr);

    @media (min-width: 960px) {
      grid-template-columns: minmax(0, 1fr) 320px;
    }
  }

  &__main {
    display: flex;
    flex-direction: column;
    gap: var(--s-5);
  }

  &__aside {
    @media (min-width: 960px) {
      position: sticky;
      top: calc(80px + var(--s-5));
    }
  }

  &__field {
    margin-bottom: var(--s-4);

    &:last-child { margin-bottom: 0; }
  }

  &__label {
    display: block;
    font-size: var(--fs-xs);
    color: var(--c-fuchsia);
    font-family: var(--font-body);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: var(--ls-wider);
    margin-bottom: var(--s-2);
  }

  &__value {
    color: var(--c-ink);
    font-size: var(--fs-md);
    font-weight: 500;
  }

  &__row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--s-3);
  }

  &__edit {
    display: flex;
    flex-direction: column;
    gap: var(--s-3);
  }

  &__edit-actions {
    display: flex;
    gap: var(--s-2);
  }

  &__sub {
    margin: var(--s-3) 0;

    p {
      margin: 0 0 var(--s-2);
      color: var(--c-text-muted);
      line-height: var(--lh-base);
    }
  }

  &__sub-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--s-3);
    margin: var(--s-2) 0 var(--s-3);
  }

  &__sub-price {
    font-family: var(--font-display);
    font-size: var(--fs-xl);
    color: var(--c-ink);
  }

  &__sub-blurb {
    margin: 0 0 var(--s-3);
    color: var(--c-text-muted);
    line-height: var(--lh-base);
  }

  &__sub-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: var(--s-3) var(--s-5);
    margin: 0;
    padding: var(--s-3);
    background: var(--c-cream-2);
    border: 2px solid var(--c-ink);
    border-radius: var(--r-md);

    @media (min-width: 600px) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    > div { display: flex; flex-direction: column; gap: var(--s-1); }

    dt {
      font-size: var(--fs-xs);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: var(--ls-wider);
      color: var(--c-text-muted);
    }

    dd {
      margin: 0;
      color: var(--c-ink);
      font-weight: 600;
    }
  }

  &__sub-actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--s-3);
  }

  &__payments {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;

    li + li {
      border-top: 1px dashed rgba(24, 22, 35, 0.2);
    }
  }

  &__payment-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: var(--s-3);
    padding: var(--s-3) 0;
  }

  &__payment-main {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__payment-amount {
    font-family: var(--font-display);
    font-size: var(--fs-lg);
    color: var(--c-ink);
  }

  &__payment-date {
    color: var(--c-text-muted);
    font-size: var(--fs-sm);
  }

  &__payment-meta {
    display: flex;
    align-items: center;
    gap: var(--s-3);
    flex-wrap: wrap;
  }

  &__payment-card {
    color: var(--c-text-muted);
    font-size: var(--fs-sm);
    font-weight: 600;
  }

  &__receipt-link {
    color: var(--c-cobalt);
    font-weight: 700;
    text-decoration: none;
    font-size: var(--fs-sm);

    &:hover { color: var(--c-cobalt-deep); }
  }

  &__meta { color: var(--c-text-muted); }

  &__meta strong { color: var(--c-cobalt); }

  &__courses {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--s-3);

    li {
      display: flex;
      align-items: center;
      gap: var(--s-3);
      padding: var(--s-3);
      background: var(--c-cream-2);
      border: 2px solid var(--c-ink);
      border-radius: var(--r-md);
    }
  }

  &__course-icon {
    display: inline-grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: var(--r-sm);
    background: var(--c-mint);
    color: var(--c-ink);
    font-size: var(--fs-lg);
    flex-shrink: 0;
  }

  &__course-info {
    flex: 1;
    min-width: 0;

    h3 {
      font-family: var(--font-display);
      font-size: var(--fs-md);
      color: var(--c-ink);
      margin: 0 0 var(--s-1);
    }

    p {
      font-size: var(--fs-sm);
      color: var(--c-text-muted);
      margin: 0;
    }
  }

  &__cert-link {
    color: var(--c-cobalt);
    font-weight: 700;
    font-size: var(--fs-sm);
    text-decoration: none;
    text-transform: uppercase;
    letter-spacing: var(--ls-wide);
    white-space: nowrap;

    &:hover { color: var(--c-cobalt-deep); }
  }

  &__danger { border: 2px dashed var(--c-fuchsia); }

  &__overlay {
    position: fixed;
    inset: 0;
    background: rgba(24, 22, 35, 0.55);
    display: grid;
    place-items: center;
    z-index: 1000;
    padding: var(--s-4);
  }

  &__modal {
    max-width: 460px;
    width: 100%;
  }

  &__modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--s-3);
  }
}
</style>
