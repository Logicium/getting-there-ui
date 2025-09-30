import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import BlogPage from '../views/BlogPage.vue'
import EventsPage from '../views/EventsPage.vue'
import EventDetailPage from '../views/EventDetailPage.vue'
import AboutPage from "@/views/AboutPage.vue";
import VideosPage from "@/views/VideosPage.vue";
import StorePage from "@/views/StorePage.vue";
import BlogPost from "@/views/BlogPost.vue";
import TermsPage from "@/views/TermsPage.vue";
import PrivacyPage from "@/views/PrivacyPage.vue";
import AccessibilityPage from "@/views/AccessibilityPage.vue";
import CheckoutPage from "@/views/CheckoutPage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 };
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/about',
      name: 'about',
      component: AboutPage,
    },
    {
      path: '/blog',
      name: 'blog',
      component: BlogPage,
    },
    {
      path: '/events',
      name: 'events',
      component: EventsPage,
    },
    {
      path: '/events/:id',
      name: 'event-detail',
      component: EventDetailPage,
    },
    {
      path: '/blog/:id',
      name: 'BlogPost',
      component: BlogPost
    },
    {
      path: '/videos',
      name:'vidoes',
      component: VideosPage,
    },
    {
      path: '/store',
      name: 'store',
      component: StorePage,
    },
    {
      path: '/terms',
      name:'terms',
      component: TermsPage,
    },
    {
      path: '/privacy',
      name:'privacy',
      component: PrivacyPage,
    },
    {
      path: '/accessibility',
      name:'accessibility',
      component: AccessibilityPage
    },
    {
      path: '/checkout',
      name:'checkout',
      component: CheckoutPage
    },

  ],
})

export default router
