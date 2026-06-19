<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";

const route = useRoute()

// Hide footer on course learning pages (video/quiz pages)
const showFooter = computed(() => !route.path.includes('/learn/'))
</script>

<template>
  <Navbar/>
  <RouterView :key="$route.fullPath" />
  <Footer v-if="showFooter"/>
</template>

<style lang="scss">
// Global design system lives in src/assets/scss/index.scss (loaded via main.ts).
// Only page-level helpers that don't fit the design system stay here.
.hero-text p { text-align: justify; }
</style>
