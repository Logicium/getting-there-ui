<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { AppButton } from '@/components/ui'

const authStore = useAuthStore()
const menuOpen = ref(false)

interface GlobalResponse {
  data?: {
    siteName?: string
    logo?: {
      url?: string
      formats?: { small?: { url?: string }, thumbnail?: { url?: string } }
      alternativeText?: string | null
    }
  }
}

const siteName = ref<string>('Getting There')
const logoUrl = ref<string | null>('/GT-Square.png')
const logoAlt = ref<string>('Getting There logo')

onMounted(async () => {
  try {
    const cmsBase = (import.meta.env.VITE_CMS_URL as string) || 'https://getting-there-cms.onrender.com'
    const res = await fetch(`${cmsBase}/api/global?populate=all`)
    if (!res.ok) throw new Error(`Failed to fetch global: ${res.status}`)
    const json = (await res.json()) as GlobalResponse
    const data = json?.data
    if (data?.siteName) siteName.value = data.siteName
    const logo = data?.logo
    const relativeUrl = logo?.formats?.small?.url || logo?.url || null
    if (relativeUrl) logoUrl.value = relativeUrl.startsWith('http') ? relativeUrl : `${cmsBase}${relativeUrl}`
    if (logo?.alternativeText) logoAlt.value = logo.alternativeText.toString()
  } catch (e) {
    console.error(e)
  }
})

function toggleMenu() { menuOpen.value = !menuOpen.value }
function closeMenu()  { menuOpen.value = false }

const navLinks = [
  { to: '/',           label: 'Home' },
  { to: '/about',      label: 'About' },
  { to: '/classes',    label: 'Courses' },
  { to: '/videos',     label: 'Videos' },
  { to: '/events',     label: 'Workshops' },
  { to: '/blog',       label: 'Field Notes' },
  { to: '/store',      label: 'Store' },
  { to: '/newsletter', label: 'Newsletter' },
  { to: '/contact',    label: 'Contact' },
]
</script>

<template>
  <header class="nav-shell" :class="{ 'is-open': menuOpen }">
    <div class="nav-shell__bar">
      <button
        class="nav-shell__toggle"
        :aria-expanded="menuOpen"
        aria-label="Toggle menu"
        @click="toggleMenu"
      >
        <span class="nav-shell__toggle-bars" aria-hidden="true">
          <span /><span /><span />
        </span>
        <span class="nav-shell__toggle-label">Menu</span>
      </button>

      <RouterLink to="/" class="nav-shell__brand" @click="closeMenu">
        <span
          v-if="logoUrl"
          class="nav-shell__logo"
          :style="{ '--logo-src': `url('${logoUrl}')` }"
          role="img"
          :aria-label="logoAlt"
        />
        <span class="nav-shell__wordmark">{{ siteName }}</span>
        <span class="nav-shell__dot" aria-hidden="true" />
      </RouterLink>

      <div class="nav-shell__auth">
        <AppButton v-if="authStore.isAuthenticated" :to="'/account'" variant="ghost" size="sm">
          <template #leading>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </template>
          <span class="nav-shell__auth-label">Account</span>
        </AppButton>
        <AppButton v-else :to="'/login'" variant="primary" size="sm">Login</AppButton>
      </div>
    </div>

    <div class="nav-shell__overlay" :class="{ open: menuOpen }" @click="closeMenu" />

    <aside class="nav-shell__menu" :class="{ open: menuOpen }" aria-label="Site menu">
      <div class="nav-shell__menu-head">
        <span class="nav-shell__menu-eyebrow"><span class="dot" />Wander&nbsp;in</span>
        <button class="nav-shell__menu-close" aria-label="Close menu" @click="closeMenu">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="18" y1="6"  x2="6"  y2="18"/>
            <line x1="6"  y1="6"  x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <nav>
        <ul class="nav-shell__links">
          <li v-for="(link, i) in navLinks" :key="link.to" :style="{ '--i': i }">
            <RouterLink :to="link.to" @click="closeMenu">
              <span class="num">{{ String(i + 1).padStart(2, '0') }}</span>
              <span class="label">{{ link.label }}</span>
              <span class="arrow" aria-hidden="true">→</span>
            </RouterLink>
          </li>
        </ul>
      </nav>

      <div class="nav-shell__menu-foot">
        <p>A studio for everyday happiness.</p>
      </div>
    </aside>
  </header>
</template>

<style scoped lang="scss">
.nav-shell {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 1000;
  background: rgba(251, 245, 233, 0.92);
  backdrop-filter: blur(14px);
  border-bottom: 3px solid var(--c-ink);

  &__bar {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: var(--s-3);
    max-width: var(--container-wide);
    margin: 0 auto;
    padding: var(--s-3) var(--s-6);
  }

  // Brand wordmark
  &__brand {
    display: inline-flex;
    align-items: center;
    gap: var(--s-2);
    text-decoration: none;
    justify-self: center;
    min-width: 0;
  }

  &__logo {
    display: inline-block;
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    background-color: var(--c-ink);
    -webkit-mask: var(--logo-src) center / contain no-repeat;
    mask: var(--logo-src) center / contain no-repeat;
    transition: background-color var(--dur-fast) var(--ease-snap);
  }

  &__wordmark {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: clamp(1.2rem, 3.5vw, 1.7rem);
    color: var(--c-ink);
    letter-spacing: var(--ls-tight);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__dot {
    width: 10px; height: 10px;
    border-radius: 999px;
    background: var(--c-marigold);
    box-shadow: 0 0 0 3px var(--c-marigold-soft);
    flex-shrink: 0;
  }

  // Hamburger toggle
  &__toggle {
    display: inline-flex;
    align-items: center;
    gap: var(--s-2);
    background: var(--c-ink);
    color: var(--c-cream);
    border-radius: var(--r-pill);
    padding: 0.55rem 0.9rem;
    font-family: var(--font-body);
    font-weight: 700;
    font-size: var(--fs-sm);
    text-transform: uppercase;
    letter-spacing: var(--ls-wide);
    cursor: pointer;
    transition: transform var(--dur-fast) var(--ease-snap);

    &:hover { transform: translateY(-1px); }
    &:focus-visible { outline: 3px solid var(--c-cobalt); outline-offset: 3px; }
  }

  &__toggle-bars {
    display: inline-flex;
    flex-direction: column;
    gap: 3px;
    width: 16px;
    span {
      display: block;
      width: 16px; height: 2px;
      background: currentColor;
      border-radius: 2px;
      transition: transform var(--dur-base) var(--ease-snap);
    }
  }

  &.is-open &__toggle-bars {
    span:nth-child(1) { transform: translateY(5px) rotate(45deg); }
    span:nth-child(2) { opacity: 0; }
    span:nth-child(3) { transform: translateY(-5px) rotate(-45deg); }
  }

  &__toggle-label { line-height: 1; }

  &__auth { display: flex; align-items: center; gap: var(--s-2); justify-self: end; }

  // Overlay
  &__overlay {
    position: fixed;
    inset: 0;
    background: rgba(24, 22, 35, 0.55);
    opacity: 0;
    visibility: hidden;
    transition: opacity var(--dur-base) var(--ease-out), visibility var(--dur-base) var(--ease-out);
    z-index: 1001;

    &.open { opacity: 1; visibility: visible; }
  }

  // Slide-out menu
  &__menu {
    position: fixed;
    top: 0; left: -360px;
    width: 340px;
    max-width: 88vw;
    height: 100vh;
    background: var(--c-cream);
    border-right: 3px solid var(--c-ink);
    box-shadow: 8px 0 0 0 var(--c-marigold);
    transition: left var(--dur-base) var(--ease-snap);
    z-index: 1002;
    overflow-y: auto;
    display: flex;
    flex-direction: column;

    &.open { left: 0; }
  }

  &__menu-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--s-5) var(--s-5) var(--s-3);
  }

  &__menu-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: var(--s-2);
    font-family: var(--font-body);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: var(--ls-shout);
    font-size: var(--fs-xs);
    color: var(--c-text);

    .dot {
      width: 10px; height: 10px;
      border-radius: 50%;
      background: var(--c-fuchsia);
      box-shadow: 0 0 0 3px var(--c-fuchsia-soft);
    }
  }

  &__menu-close {
    background: var(--c-cream-2);
    color: var(--c-ink);
    border: 2px solid var(--c-ink);
    width: 38px; height: 38px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform var(--dur-fast) var(--ease-snap), background var(--dur-fast);

    &:hover  { background: var(--c-marigold); transform: rotate(90deg); }
    &:focus-visible { outline: 3px solid var(--c-cobalt); outline-offset: 3px; }
  }

  &__links {
    list-style: none;
    padding: var(--s-3) 0;
    margin: 0;
    display: flex;
    flex-direction: column;

    li {
      border-top: 1px solid var(--c-border);
      &:last-child { border-bottom: 1px solid var(--c-border); }
    }

    a {
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
      gap: var(--s-3);
      padding: var(--s-4) var(--s-5);
      color: var(--c-ink);
      text-decoration: none;
      font-family: var(--font-display);
      font-weight: 600;
      font-size: var(--fs-xl);
      letter-spacing: var(--ls-tight);
      transition: background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out);

      .num {
        font-family: var(--font-body);
        font-size: var(--fs-xs);
        font-weight: 700;
        color: var(--c-text-muted);
        letter-spacing: var(--ls-wide);
      }

      .arrow {
        font-family: var(--font-display);
        color: var(--c-cobalt);
        opacity: 0;
        transform: translateX(-6px);
        transition: opacity var(--dur-fast), transform var(--dur-fast);
      }

      &:hover, &.router-link-exact-active {
        background: var(--c-marigold-soft);
        color: var(--c-cobalt-deep);
        .arrow { opacity: 1; transform: translateX(0); }
      }
    }
  }

  &__menu-foot {
    margin-top: auto;
    padding: var(--s-5);
    border-top: 2px dashed var(--c-ink);
    font-family: var(--font-accent);
    font-size: var(--fs-lg);
    color: var(--c-ink);
    text-align: center;
  }

  // Auth label hides on very small screens
  &__auth-label {
    display: inline-block;
    @media (max-width: 540px) { display: none; }
  }

  @media (max-width: 540px) {
    &__bar { grid-template-columns: auto 1fr auto; padding: var(--s-3) var(--s-4); }
    &__toggle-label { display: none; }
    &__toggle { padding: 0.55rem; }
  }
}
</style>
