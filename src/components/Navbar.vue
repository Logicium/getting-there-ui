<script setup lang="ts">
import { RouterLink } from "vue-router";
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const menuOpen = ref(false)

interface GlobalResponse {
  data?: {
    siteName?: string
    logo?: {
      url?: string
      formats?: {
        small?: { url?: string }
        thumbnail?: { url?: string }
      }
      alternativeText?: string | null
    }
  }
}

const siteName = ref<string>('Getting There')
const logoUrl = ref<string | null>(null)
const logoAlt = ref<string>('')

onMounted(async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_CMS_URL}/api/global?populate=all`)
    if (!res.ok) throw new Error(`Failed to fetch global: ${res.status}`)
    const json = (await res.json()) as GlobalResponse
    const data = json?.data
    if (data?.siteName) siteName.value = data.siteName
    const logo = data?.logo
    // Prefer small variant, fall back to original
    const relativeUrl = logo?.formats?.small?.url || logo?.url || null
    const cmsBase = "https://getting-there-cms.onrender.com"
    if (relativeUrl) {
      logoUrl.value = cmsBase ? `${cmsBase}${relativeUrl}` : relativeUrl
    }
    logoAlt.value = (logo?.alternativeText || `${siteName.value} logo`).toString()
  } catch (e) {
    // Silently fail per requirements (no loading state/animation needed)
    console.error(e)
  }
})

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function closeMenu() {
  menuOpen.value = false
}
</script>

<template>
  <header>
    <nav>
      <button class="menu-toggle" @click="toggleMenu" aria-label="Toggle menu">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
        <span class="menu-toggle-label">Menu</span>
      </button>

      <RouterLink to="/" class="logoWrap" @click="closeMenu">
        <img v-if="logoUrl" class="logo" :src="logoUrl" :alt="logoAlt" />
        <span>{{ siteName }}</span>
      </RouterLink>

      <div class="auth-button">
        <RouterLink v-if="authStore.isAuthenticated" to="/account" class="account-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span class="btn-text">Account</span>
        </RouterLink>
        <RouterLink v-else to="/login" class="login-btn">Login</RouterLink>
      </div>
    </nav>

    <!-- Slide-out Menu Overlay -->
    <div :class="['menu-overlay', { open: menuOpen }]" @click="closeMenu"></div>
    
    <!-- Slide-out Menu -->
    <aside :class="['slide-menu', { open: menuOpen }]">
      <div class="menu-header">
        <h2>Menu</h2>
        <button class="close-button" @click="closeMenu" aria-label="Close menu">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <ul class="menu-links">
        <li><RouterLink to="/" @click="closeMenu">Home</RouterLink></li>
        <li><RouterLink to="/about" @click="closeMenu">About</RouterLink></li>
        <li><RouterLink to="/classes" @click="closeMenu">Courses</RouterLink></li>
        <li><RouterLink to="/videos" @click="closeMenu">Videos</RouterLink></li>
        <li><RouterLink to="/events" @click="closeMenu">Workshops</RouterLink></li>
        <li><RouterLink to="/blog" @click="closeMenu">Blog</RouterLink></li>
        <li><RouterLink to="/store" @click="closeMenu">Store</RouterLink></li>
        <li><RouterLink to="/newsletter" @click="closeMenu">Newsletter</RouterLink></li>
      </ul>
    </aside>
  </header>
</template>

<style scoped>
/* Header */
header {
  position: fixed;
  top: 0;
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  z-index: 1000;
  padding: 1rem 0;
  transition: all 0.3s ease;
  border-bottom: 1px solid var(--border-light);
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.menu-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: var(--text-dark);
  transition: color 0.3s ease;
  margin-right: 1rem;
  font-size: 1rem;
  font-weight: 600;
  font-family: inherit;
}

.menu-toggle-label {
  line-height: 1;
}

.menu-toggle:hover {
  color: var(--primary-color);
}

.logo{
  height: 50px;
  width: auto;
  display: block;
  object-fit: contain;
  margin-right: 12px;
  filter: hue-rotate(-90deg) brightness(90%);
}

.logoWrap {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: clamp(1.1rem, 4.2vw, 1.8rem);
  font-weight: 700;
  background: var(--gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-family: 'Playfair Display', serif;
  letter-spacing: -0.5px;
  text-decoration: none;
  cursor: pointer;
  min-width: 0;
}

.logoWrap span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.1;
}

.auth-button {
  margin-left: auto;
}

.login-btn,
.account-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--primary-color) !important;
  color: white !important;
  padding: 0.65rem 1.5rem !important;
  border-radius: 50px !important;
  font-weight: 600 !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 2px 8px var(--shadow-light) !important;
  text-decoration: none;
}

.login-btn:hover,
.account-btn:hover {
  background: var(--secondary-color) !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 12px var(--shadow-medium) !important;
}

/* Menu Overlay */
.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
  z-index: 1001;
}

.menu-overlay.open {
  opacity: 1;
  visibility: visible;
}

/* Slide-out Menu */
.slide-menu {
  position: fixed;
  top: 0;
  left: -300px;
  width: 280px;
  height: 100vh;
  background: white;
  box-shadow: 2px 0 20px rgba(0, 0, 0, 0.1);
  z-index: 1002;
  transition: left 0.3s ease;
  overflow-y: auto;
}

.slide-menu.open {
  left: 0;
}

.menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1.5rem 1rem;
  border-bottom: 2px solid var(--border-light);
}

.menu-header h2 {
  font-size: 1.5rem;
  font-family: 'Playfair Display', serif;
  background: var(--gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: var(--text-dark);
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-button:hover {
  color: var(--primary-color);
}

.menu-links {
  list-style: none;
  padding: 1rem 0;
  margin: 0;
}

.menu-links li {
  margin: 0;
}

.menu-links a {
  display: block;
  padding: 1rem 1.5rem;
  color: var(--text-dark);
  text-decoration: none;
  font-weight: 500;
  font-size: 1.05rem;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
}

.menu-links a:hover {
  background: var(--bg-light);
  color: var(--primary-color);
  border-left-color: var(--primary-color);
}

.menu-links a.router-link-active {
  background: rgba(74, 124, 89, 0.08);
  color: var(--primary-color);
  border-left-color: var(--primary-color);
  font-weight: 600;
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .logo {
    height: 40px;
    margin-right: 8px;
  }

  .account-btn .btn-text {
    display: none;
  }

  .account-btn,
  .login-btn {
    padding: 0.65rem 1rem !important;
  }

  .slide-menu {
    width: 260px;
    left: -260px;
  }
}

@media (max-width: 480px) {
  nav {
    padding: 0 1rem;
  }

  .menu-toggle {
    margin-right: 0.5rem;
  }

  .menu-toggle-label {
    display: none;
  }
}
</style>
