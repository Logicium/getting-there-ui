<script setup lang="ts">
import { RouterLink } from "vue-router";
import { onMounted, ref } from 'vue'

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
</script>

<template>
  <header>
    <nav>
      <div class="logoWrap">
        <img v-if="logoUrl" class="logo" :src="logoUrl" :alt="logoAlt" />
        <span>{{ siteName }}</span>
      </div>
      <ul class="nav-links">
        <li><RouterLink to="/">Home</RouterLink></li>
        <li><RouterLink to="/about">About</RouterLink></li>
        <li><RouterLink to="/videos">Videos</RouterLink></li>
        <li><RouterLink to="/events">Workshops</RouterLink></li>
        <li><RouterLink to="/blog">Blog</RouterLink></li>
        <li><RouterLink to="/store">Store</RouterLink></li>
      </ul>
    </nav>
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
  font-size: 1.8rem;
  font-weight: 700;
  background: var(--gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-family: 'Playfair Display', serif;
  letter-spacing: -0.5px;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 2rem;
  align-items: center;
}

.nav-links a {
  text-decoration: none;
  color: var(--text-dark);
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
  padding: 0.5rem 0;
  font-size: 0.95rem;
}

.nav-links a:hover {
  color: var(--primary-color);
}

.nav-links a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--primary-color);
  transition: width 0.3s ease;
  border-radius: 1px;
}

.nav-links a:hover::after, .nav-links a.router-link-active::after {
  width: 100%;
}

.contact-btn {
  background: var(--primary-color) !important;
  color: white !important;
  padding: 0.75rem 1.5rem !important;
  border-radius: 50px !important;
  font-weight: 600 !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 4px 15px var(--shadow-light) !important;
}

.contact-btn:hover {
  background: var(--secondary-color) !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 6px 20px var(--shadow-medium) !important;
}

.contact-btn::after {
  display: none !important;
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .nav-links {
    display: none;
  }

  .logo {
    font-size: 1.5rem;
  }
}
</style>
