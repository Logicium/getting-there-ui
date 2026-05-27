import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import BlogPage from '@/pages/BlogPage.vue'
import EventsPage from '@/pages/EventsPage.vue'
import EventDetailPage from '@/pages/EventDetailPage.vue'
import AboutPage from "@/pages/AboutPage.vue";
import VideosPage from "@/pages/VideosPage.vue";
import StorePage from "@/pages/StorePage.vue";
import BlogPost from "@/pages/BlogPost.vue";
import TermsPage from "@/pages/TermsPage.vue";
import PrivacyPage from "@/pages/PrivacyPage.vue";
import AccessibilityPage from "@/pages/AccessibilityPage.vue";
import CheckoutPage from "@/pages/CheckoutPage.vue";
import SuccessPage from "@/pages/SuccessPage.vue";
import CancelPage from "@/pages/CancelPage.vue";
import CommentManagementPage from "@/pages/CommentManagementPage.vue";
import ReplyCommentPage from "@/pages/ReplyCommentPage.vue";
import ClassesPage from "@/pages/ClassesPage.vue";
import ClassesComingSoonPage from "@/pages/ClassesComingSoonPage.vue";
import ClassPreviewPage from "@/pages/ClassPreviewPage.vue";
import ClassProgressPage from "@/pages/ClassProgressPage.vue";
import VideoLessonPage from "@/pages/VideoLessonPage.vue";
import QuizPage from "@/pages/QuizPage.vue";
import FinalExamPage from "@/pages/FinalExamPage.vue";
import CertificatePage from "@/pages/CertificatePage.vue";
import LoginPage from "@/pages/LoginPage.vue";
import AccountPage from "@/pages/AccountPage.vue";
import SubscriptionPage from "@/pages/SubscriptionPage.vue";
import NewsletterPage from "@/pages/NewsletterPage.vue";

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
    {
      path: '/checkout/success',
      name: 'CheckoutSuccess',
      component: SuccessPage,
    },
    {
      path: '/checkout/cancel',
      name: 'CheckoutCancel',
      component: CancelPage,
    },
    {
      path: '/api/comments/approve',
      name: 'CommentApprove',
      component: CommentManagementPage,
      meta: {
        title: 'Approve Comment - Getting There'
      }
    },
    {
      path: '/api/comments/delete',
      name: 'CommentDelete',
      component: CommentManagementPage,
      meta: {
        title: 'Delete Comment - Getting There'
      }
    },
    {
      path: '/api/comments/reply',
      name: 'CommentReply',
      component: ReplyCommentPage,
      meta: {
        title: 'Reply to Comment - Getting There'
      }
    },
    {
      path: '/classes',
      name: 'classes',
      component: ClassesComingSoonPage,
    },
    {
      path: '/classes/catalog-preview',
      name: 'classes-catalog-preview',
      component: ClassesPage,
    },
    {
      path: '/classes/:id',
      name: 'class-preview',
      component: ClassPreviewPage,
    },
    {
      path: '/classes/:courseId/learn',
      name: 'class-progress',
      component: ClassProgressPage,
      children: [
        {
          path: ':chapterId/:contentId/video',
          name: 'video-lesson',
          component: VideoLessonPage,
        },
        {
          path: ':chapterId/:contentId/quiz',
          name: 'quiz-lesson',
          component: QuizPage,
        }
      ]
    },
    {
      path: '/classes/:courseId/final-exam',
      name: 'final-exam',
      component: FinalExamPage,
    },
    {
      path: '/classes/:courseId/certificate',
      name: 'certificate',
      component: CertificatePage,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
    },
    {
      path: '/account',
      name: 'account',
      component: AccountPage,
    },
    {
      path: '/subscribe',
      name: 'subscribe',
      component: SubscriptionPage,
    },
    {
      path: '/newsletter',
      name: 'newsletter',
      component: NewsletterPage,
    }
  ],
})

export default router
