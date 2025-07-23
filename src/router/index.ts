import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import BlogPage from '../views/BlogPage.vue'
import EventsPage from '../views/EventsPage.vue'
import EventDetailPage from '../views/EventDetailPage.vue'
import AboutView from "@/views/AboutView.vue";
import VideosPage from "@/views/VideosPage.vue";
import StorePage from "@/views/StorePage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
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
      path: '/videos',
      name:'vidoes',
      component: VideosPage,
    },
    {
      path: '/store',
      name: 'store',
      component: StorePage,
    }
  ],
})

export default router
