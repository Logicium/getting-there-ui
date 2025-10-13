<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
</script>

<template>
  <Navbar/>
  <RouterView :key="$route.fullPath" />
  <Footer/>
</template>

<style lang="scss">
@import "assets/common";

:root {
  /* Therapy-inspired color palette */
  --primary-color: #4a7c59;        /* Sage green - calming, trustworthy */
  --secondary-color: #3d6b4a;      /* Deeper sage */
  --accent-color: #f4a261;         /* Warm terracotta accent */
  --success-color: #6b9080;        /* Soft green success */
  --warning-color: #e76f51;        /* Warm coral for attention */

  /* Neutral therapy tones */
  --text-dark: #2c2c2c;            /* Warm dark gray instead of harsh black */
  --text-light: #6b7280;           /* Muted gray for secondary text */
  --text-lighter: #9ca3af;         /* Even lighter gray */

  /* Calm background colors */
  --bg-light: #faf9f7;             /* Warm cream background */
  --bg-secondary: #f5f3f0;         /* Slightly darker cream */
  --bg-sage: #f0f4f1;              /* Very light sage */
  --white: #ffffff;

  /* Therapeutic gradients */
  --gradient: linear-gradient(135deg, #4a7c59 0%, #6b9080 50%, #8db896 100%);
  --gradient-warm: linear-gradient(135deg, #f4a261 0%, #e76f51 100%);
  --gradient-neutral: linear-gradient(135deg, #faf9f7 0%, #f5f3f0 100%);

  /* Additional therapy colors */
  --lavender: #e6e6fa;             /* Calming lavender */
  --soft-blue: #b8d4e3;            /* Gentle blue */
  --warm-beige: #f7f3e9;           /* Warm beige */

  /* Premium/subscription colors */
  --premium-gold: #d4a574;         /* Muted gold instead of bright */

  /* Shadow and border colors */
  --shadow-light: rgba(74, 124, 89, 0.1);
  --shadow-medium: rgba(74, 124, 89, 0.15);
  --border-light: rgba(74, 124, 89, 0.2);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  line-height: 1.6;
  color: var(--text-dark);
  overflow-x: hidden;
  background: var(--bg-light);
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Common therapy-themed components */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 3rem;
  color: var(--text-dark);
  font-family: 'Playfair Display', serif;
}

.fade-in {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease;
}

.fade-in.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Common button styles */
.btn-primary {
  background: var(--primary-color);
  color: white;
  padding: 1rem 2rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px var(--shadow-light);
  border: none;
  cursor: pointer;
  display: inline-block;
}

.btn-primary:hover {
  background: var(--secondary-color);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px var(--shadow-medium);
}

.btn-secondary {
  background: transparent;
  color: var(--primary-color);
  padding: 1rem 2rem;
  border: 2px solid var(--primary-color);
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  cursor: pointer;
  display: inline-block;
}

.btn-secondary:hover {
  background: var(--primary-color);
  color: white;
}

.btn-accent {
  background: var(--accent-color);
  color: white;
  padding: 1rem 2rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(244, 162, 97, 0.3);
  border: none;
  cursor: pointer;
  display: inline-block;
}

.btn-accent:hover {
  background: var(--warning-color);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(244, 162, 97, 0.4);
}

/* Common card styles */
.card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 30px var(--shadow-light);
  border: 1px solid var(--border-light);
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px var(--shadow-medium);
}

/* Trust indicators */
.trust-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--bg-sage);
  color: var(--primary-color);
  padding: 0.5rem 1rem;
  border-radius: 25px;
  font-size: 0.9rem;
  font-weight: 600;
  border: 1px solid var(--border-light);
}

/* Professional credentials styling */
.credential-badge {
  background: var(--primary-color);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  display: inline-block;
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Focus styles for accessibility */
button:focus,
a:focus,
input:focus,
textarea:focus {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}
.hero-text p{
  text-align: justify;
}
</style>
