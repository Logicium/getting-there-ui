<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const isLoading = ref(true);
const error = ref<string | null>(null);

interface BlogArticle {
  id: number;
  documentId: string;
  title: string;
  Description: string;
  Author: string;
  ArticleBody: any[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  Category: string;
  Image: {
    formats: {
      small: {
        url: string;
      };
    };
    url: string;
  };
  topics: {
    id: number;
    tag: string;
  }[];
}

// Blog post data that will be populated from the API
const blogPost = ref<any>({
  id: '',
  title: '',
  author: '',
  authorCredentials: 'Licensed Professional',
  authorBio: '',
  publishDate: '',
  readTime: '',
  category: '',
  categoryLabel: '',
  featuredImage: '',
  excerpt: '',
  content: [
    {
      type: 'paragraph',
      content: 'Anxiety is one of the most common mental health challenges we face today, affecting millions of people worldwide. While it\'s a natural response to stress and potential threats, chronic anxiety can significantly impact our daily lives, relationships, and overall well-being. The good news is that with the right understanding and tools, anxiety can be managed effectively.'
    },
    {
      type: 'heading',
      level: 2,
      content: 'What Is Anxiety and Why Does It Happen?'
    },
    {
      type: 'paragraph',
      content: 'Anxiety is our body\'s natural alarm system, designed to keep us safe from danger. When we perceive a threat, our sympathetic nervous system activates, releasing stress hormones like cortisol and adrenaline. This "fight or flight" response can be lifesaving in genuinely dangerous situations.'
    },
    {
      type: 'paragraph',
      content: 'However, in our modern world, this system can become overactive, responding to everyday stressors as if they were life-threatening emergencies. Work deadlines, social interactions, financial concerns, or even positive changes like a new job can trigger this response.'
    },
    {
      type: 'callout',
      style: 'info',
      content: 'Remember: Experiencing anxiety doesn\'t mean you\'re weak or flawed. It\'s a normal human response that can be understood and managed with the right approach.'
    },
    {
      type: 'heading',
      level: 2,
      content: 'Common Signs and Symptoms of Anxiety'
    },
    {
      type: 'paragraph',
      content: 'Anxiety manifests differently for everyone, but common symptoms include:'
    },
    {
      type: 'list',
      style: 'unordered',
      items: [
        'Physical symptoms: rapid heartbeat, sweating, trembling, shortness of breath',
        'Emotional symptoms: feelings of dread, irritability, restlessness',
        'Cognitive symptoms: racing thoughts, difficulty concentrating, catastrophic thinking',
        'Behavioral symptoms: avoidance, seeking excessive reassurance, procrastination'
      ]
    },
    {
      type: 'heading',
      level: 2,
      content: 'Evidence-Based Strategies for Managing Anxiety'
    },
    {
      type: 'heading',
      level: 3,
      content: '1. Deep Breathing and Grounding Techniques'
    },
    {
      type: 'paragraph',
      content: 'When anxiety strikes, our breathing often becomes shallow and rapid. Practicing deep, diaphragmatic breathing can help activate your body\'s relaxation response.'
    },
    {
      type: 'callout',
      style: 'technique',
      title: 'Try the 4-7-8 Breathing Technique:',
      content: 'Inhale through your nose for 4 counts, hold your breath for 7 counts, then exhale through your mouth for 8 counts. Repeat 3-4 times.'
    },
    {
      type: 'paragraph',
      content: 'Grounding techniques can also help bring you back to the present moment. Try the 5-4-3-2-1 technique: name 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste.'
    },
    {
      type: 'heading',
      level: 3,
      content: '2. Cognitive Restructuring'
    },
    {
      type: 'paragraph',
      content: 'Our thoughts significantly influence our emotions and behaviors. Anxiety often involves patterns of negative or catastrophic thinking. Cognitive restructuring helps us identify and challenge these unhelpful thought patterns.'
    },
    {
      type: 'paragraph',
      content: 'When you notice anxious thoughts, ask yourself: Is this thought realistic? What evidence do I have for and against this thought? What would I tell a friend in this situation?'
    },
    {
      type: 'heading',
      level: 3,
      content: '3. Progressive Muscle Relaxation'
    },
    {
      type: 'paragraph',
      content: 'This technique involves systematically tensing and then relaxing different muscle groups in your body. It can help reduce physical tension associated with anxiety and promote overall relaxation.'
    },
    {
      type: 'heading',
      level: 2,
      content: 'Building Long-Term Resilience'
    },
    {
      type: 'paragraph',
      content: 'Managing anxiety isn\'t just about crisis intervention – it\'s about building daily practices that support your mental health:'
    },
    {
      type: 'list',
      style: 'unordered',
      items: [
        'Maintain a consistent sleep schedule',
        'Engage in regular physical activity',
        'Practice mindfulness or meditation',
        'Limit caffeine and alcohol consumption',
        'Build and maintain social connections',
        'Engage in activities that bring you joy and meaning'
      ]
    },
    {
      type: 'heading',
      level: 2,
      content: 'When to Seek Professional Help'
    },
    {
      type: 'paragraph',
      content: 'While self-help strategies can be very effective, sometimes professional support is necessary. Consider reaching out to a mental health professional if:'
    },
    {
      type: 'list',
      style: 'unordered',
      items: [
        'Your anxiety interferes with work, relationships, or daily activities',
        'You experience panic attacks',
        'You avoid situations or activities due to anxiety',
        'You use alcohol or substances to cope with anxiety',
        'You have thoughts of self-harm'
      ]
    },
    {
      type: 'callout',
      style: 'support',
      title: 'Crisis Support',
      content: 'If you\'re experiencing a mental health crisis, please reach out immediately: National Suicide Prevention Lifeline: 988 | Crisis Text Line: Text HOME to 741741'
    },
    {
      type: 'heading',
      level: 2,
      content: 'Moving Forward with Hope'
    },
    {
      type: 'paragraph',
      content: 'Remember that managing anxiety is a journey, not a destination. Some days will be easier than others, and that\'s perfectly normal. Be patient and compassionate with yourself as you develop these new skills.'
    },
    {
      type: 'paragraph',
      content: 'With practice, the strategies outlined in this article can become powerful tools in your mental health toolkit. You don\'t have to face anxiety alone – support is available, and recovery is possible.'
    }
  ],
  tags: ['anxiety', 'coping strategies', 'mental health', 'self-care', 'breathing techniques'],
  relatedPosts: [
    {
      id: 'depression-recovery',
      title: 'Small Steps to Brighter Days: Depression Recovery',
      category: 'depression'
    },
    {
      id: 'mindfulness-busy-lives',
      title: '5-Minute Mindfulness for Busy Lives',
      category: 'mindfulness'
    },
    {
      id: 'stress-relief-toolkit',
      title: 'Creating Your Personal Stress Relief Toolkit',
      category: 'stress'
    }
  ]
});

// Comments data and functionality
interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  replies?: Comment[];
  isApproved: boolean;
}

const comments = ref<Comment[]>([
  {
    id: '1',
    author: 'Sarah J.',
    content: 'This article really resonated with me. I\'ve been struggling with anxiety for months, and the breathing techniques you mentioned have already helped me feel more grounded. Thank you for sharing such practical advice.',
    timestamp: 'March 16, 2024 at 2:30 PM',
    isApproved: true,
    replies: [
      {
        id: '1-1',
        author: 'Dr. Sarah Mitchell',
        content: 'Thank you for sharing, Sarah. I\'m so glad you found the breathing techniques helpful! Remember to be patient with yourself as you practice these skills. Small, consistent steps can lead to significant improvements over time.',
        timestamp: 'March 16, 2024 at 4:15 PM',
        isApproved: true
      }
    ]
  },
  {
    id: '2',
    author: 'Michael R.',
    content: 'The 5-4-3-2-1 grounding technique has become my go-to when I feel overwhelmed at work. It\'s amazing how something so simple can be so effective. Could you write more about workplace anxiety specifically?',
    timestamp: 'March 17, 2024 at 10:45 AM',
    isApproved: true
  },
  {
    id: '3',
    author: 'Lisa M.',
    content: 'I appreciate how you emphasize that anxiety is a normal response and not a sign of weakness. That perspective shift alone has been so helpful for my self-compassion journey.',
    timestamp: 'March 18, 2024 at 8:20 AM',
    isApproved: true
  }
]);

// Comment form
const newComment = ref({
  author: '',
  email: '',
  content: ''
});

const isSubmittingComment = ref(false);

// Functions
const submitComment = async () => {
  if (!newComment.value.author.trim() || !newComment.value.content.trim()) {
    alert('Please fill in your name and comment.');
    return;
  }

  isSubmittingComment.value = true;

  // Simulate API call
  setTimeout(() => {
    const comment: Comment = {
      id: Date.now().toString(),
      author: newComment.value.author,
      content: newComment.value.content,
      timestamp: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      }),
      isApproved: false // Comments would need moderation
    };

    // In a real app, this would be sent to an API for moderation
    // comments.value.push(comment);

    // Reset form
    newComment.value = { author: '', email: '', content: '' };
    isSubmittingComment.value = false;

    alert('Thank you for your comment! It has been submitted for review and will appear once approved by our moderation team.');
  }, 1000);
};

const shareArticle = (platform: string) => {
  const url = encodeURIComponent(window.location.href);
  const title = encodeURIComponent(blogPost.value.title);

  let shareUrl = '';

  switch (platform) {
    case 'twitter':
      shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
      break;
    case 'facebook':
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
      break;
    case 'linkedin':
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
      break;
  }

  if (shareUrl) {
    window.open(shareUrl, '_blank', 'width=600,height=400');
  }
};

const copyLink = () => {
  navigator.clipboard.writeText(window.location.href);
  alert('Article link copied to clipboard!');
};

// Fetch blog post data from API
const fetchBlogPost = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    const documentId = route.params.id;
    if (!documentId) {
      throw new Error('Blog post ID is missing');
    }

    // Fetch blog post by documentId
    const res = await fetch(`${import.meta.env.VITE_CMS_URL}/api/blogs?filters[documentId][$eq]=${documentId}`);

    if (!res.ok) {
      throw new Error(`Failed to fetch blog post: ${res.status} ${res.statusText}`);
    }

    const json = await res.json();
    const articles = json?.data || [];

    if (articles.length === 0) {
      throw new Error('Blog post not found');
    }

    const article = articles[0];

    // Calculate read time (rough estimate: 200 words per minute)
    const wordCount = article.ArticleBody.reduce((count: number, item: any) => {
      if (item.type === 'paragraph' && item.children && item.children.length > 0) {
        return count + item.children[0].text.split(' ').length;
      }
      return count;
    }, 0);

    const readTime = Math.max(1, Math.ceil(wordCount / 200));

    // Format the date
    const date = new Date(article.publishedAt);
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Map API response to the format expected by the template
    blogPost.value = {
      id: article.documentId,
      title: article.title,
      author: article.Author,
      authorCredentials: 'Licensed Professional',
      authorBio: 'An experienced professional dedicated to mental health and wellness.',
      publishDate: formattedDate,
      readTime: `${readTime} min read`,
      category: article.Category.toLowerCase().replace(/\s+/g, '-'),
      categoryLabel: article.Category,
      featuredImage: article.Image?.url || '/backgrounds/therapy1.jpg',
      excerpt: article.Description,
      content: mapArticleBodyToContent(article.ArticleBody)
    };
  } catch (e) {
    console.error('Error fetching blog post:', e);
    error.value = e instanceof Error ? e.message : 'Failed to load blog post';
  } finally {
    isLoading.value = false;
  }
};

// Helper function to map ArticleBody to content format
const mapArticleBodyToContent = (articleBody: any[]) => {
  return articleBody.map(item => {
    if (item.type === 'paragraph') {
      return {
        type: 'paragraph',
        content: item.children[0].text
      };
    } else if (item.type === 'heading') {
      return {
        type: 'heading',
        level: item.level,
        content: item.children[0].text
      };
    } else if (item.type === 'list') {
      // Extract text from each list item
      const items = item.children.map((listItem: any) => {
        // Each list item has children, and we need to extract the text from the first child
        if (listItem.children && listItem.children.length > 0) {
          return listItem.children[0].text;
        }
        return 'List item content not available';
      });

      return {
        type: 'list',
        style: item.format || 'unordered',
        items: items
      };
    } else {
      // Default case for unsupported types
      console.log('Unsupported content type:', item.type);
      return {
        type: 'paragraph',
        content: 'Content type not supported'
      };
    }
  });
};

// Fade-in animation
onMounted(async () => {
  // Fetch blog post data
  await fetchBlogPost();
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
  });

  // Add reading progress bar
  const progressBar = document.querySelector('.reading-progress-bar') as HTMLElement;
  const article = document.querySelector('.blog-content') as HTMLElement;

  if (progressBar && article) {
    window.addEventListener('scroll', () => {
      const articleTop = article.offsetTop;
      const articleHeight = article.offsetHeight;
      const windowTop = window.pageYOffset;
      const windowHeight = window.innerHeight;

      const progress = Math.max(0, Math.min(1, (windowTop - articleTop + windowHeight * 0.1) / articleHeight));
      progressBar.style.width = `${progress * 100}%`;
    });
  }
});
</script>

<template>
  <!-- Loading State -->
  <div v-if="isLoading" class="blog-loading-container">
    <div class="blog-loading-spinner"></div>
    <p>Loading article...</p>
  </div>

  <!-- Error State -->
  <div v-else-if="error" class="blog-error-container">
    <h2>Error Loading Article</h2>
    <p>{{ error }}</p>
    <button @click="fetchBlogPost" class="blog-retry-button">Try Again</button>
    <router-link to="/blog" class="blog-back-button">Back to Blog</router-link>
  </div>

  <!-- Content State -->
  <template v-else>
    <!-- Reading Progress Bar -->
    <div class="reading-progress">
      <div class="reading-progress-bar"></div>
    </div>

    <!-- Breadcrumb -->
    <section class="blog-breadcrumb">
      <div class="blog-breadcrumb-content">
        <router-link to="/">Home</router-link> →
        <router-link to="/blog">Wellness Blog</router-link> →
        {{ blogPost.categoryLabel }}
      </div>
    </section>

    <!-- Blog Post Hero -->
    <section class="blog-post-hero">
      <div class="blog-post-hero-content">
        <div class="blog-category-badge" :class="blogPost.category">
          {{ blogPost.categoryLabel }}
        </div>
        <h1>{{ blogPost.title }}</h1>
        <div class="blog-meta">
          <div class="blog-author-info">
            <div class="author-avatar">👩‍⚕️</div>
            <div class="author-details">
              <span class="author-name">{{ blogPost.author }}</span>
              <span class="author-credentials">{{ blogPost.authorCredentials }}</span>
            </div>
          </div>
          <div class="blog-post-meta">
            <span class="publish-date">📅 {{ blogPost.publishDate }}</span>
            <span class="read-time">⏱️ {{ blogPost.readTime }}</span>
          </div>
        </div>
      </div>
    </section>

    <main class="blog-post-main">
      <div class="blog-post-container">
        <!-- Article Content -->
        <article class="blog-content fade-in">
        <div class="article-excerpt">
          <p>{{ blogPost.excerpt }}</p>
        </div>

        <div class="article-body">
          <template v-for="(section, index) in blogPost.content" :key="index">
            <!-- Paragraph -->
            <p v-if="section.type === 'paragraph'" class="content-paragraph">
              {{ section.content }}
            </p>

            <!-- Heading -->
            <component
                v-else-if="section.type === 'heading'"
                :is="`h${section.level}`"
                class="content-heading"
                :class="`level-${section.level}`"
            >
              {{ section.content }}
            </component>

            <!-- List -->
            <ul v-else-if="section.type === 'list' && section.style === 'unordered'" class="content-list">
              <li v-for="(item, itemIndex) in section.items" :key="itemIndex">
                {{ item }}
              </li>
            </ul>

            <!-- Callout Box -->
            <div v-else-if="section.type === 'callout'" class="content-callout" :class="section.style">
              <div v-if="section.title" class="callout-title">{{ section.title }}</div>
              <div class="callout-content">{{ section.content }}</div>
            </div>
          </template>
        </div>

        <!-- Article Footer -->
        <div class="article-footer">
          <div class="article-tags">
            <h4>Related Topics:</h4>
            <div class="tags-list">
              <span v-for="tag in blogPost.tags" :key="tag" class="tag">
                {{ tag }}
              </span>
            </div>
          </div>

          <div class="social-sharing">
            <h4>Share this article:</h4>
            <div class="share-buttons">
              <button @click="shareArticle('twitter')" class="share-btn twitter">
                🐦 Twitter
              </button>
              <button @click="shareArticle('facebook')" class="share-btn facebook">
                📘 Facebook
              </button>
              <button @click="shareArticle('linkedin')" class="share-btn linkedin">
                💼 LinkedIn
              </button>
              <button @click="copyLink" class="share-btn copy">
                🔗 Copy Link
              </button>
            </div>
          </div>
        </div>
      </article>

      <!-- Sidebar -->
      <aside class="blog-sidebar">
        <!-- Author Info -->
        <div class="sidebar-section author-card fade-in">
          <div class="author-card-header">
            <div class="author-avatar-large">👩‍⚕️</div>
            <div class="author-info">
              <h3>{{ blogPost.author }}</h3>
              <p class="author-title">{{ blogPost.authorCredentials }}</p>
            </div>
          </div>
          <p class="author-bio">{{ blogPost.authorBio }}</p>
          <div class="author-contact">
            <a href="mailto:sarah@gthere.net" class="contact-btn">📧 Contact Dr. Mitchell</a>
          </div>
        </div>

        <!-- Crisis Support -->
        <div class="sidebar-section crisis-support fade-in">
          <h3>🚨 Need Immediate Support?</h3>
          <div class="crisis-contacts">
            <a href="tel:988" class="crisis-contact">
              <span class="crisis-icon">📞</span>
              <div>
                <strong>988 - Crisis Lifeline</strong>
                <p>24/7 confidential support</p>
              </div>
            </a>
            <a href="tel:741741" class="crisis-contact">
              <span class="crisis-icon">💬</span>
              <div>
                <strong>Text HOME to 741741</strong>
                <p>Crisis Text Line</p>
              </div>
            </a>
          </div>
          <p class="crisis-note">Remember: Seeking help is a sign of strength.</p>
        </div>

        <!-- Related Articles -->
        <div class="sidebar-section related-articles fade-in">
          <h3>Related Articles</h3>
          <div class="related-posts">
            <article
                v-for="post in blogPost.relatedPosts"
                :key="post.id"
                class="related-post"
            >
              <div class="related-post-category" :class="post.category">
                {{ post.category }}
              </div>
              <h4>{{ post.title }}</h4>
              <router-link :to="`/blog/${post.id}`" class="related-link">
                Read Article →
              </router-link>
            </article>
          </div>
        </div>

        <!-- Newsletter Signup -->
        <div class="sidebar-section newsletter-signup fade-in">
          <h3>💚 Weekly Wellness Tips</h3>
          <p>Get gentle reminders and mental health insights delivered to your inbox.</p>
          <input type="email" placeholder="Your email address" class="newsletter-input">
          <button class="newsletter-btn">Subscribe to Healing</button>
          <p class="privacy-note">We respect your privacy. Unsubscribe anytime.</p>
        </div>
      </aside>
    </div>

    <!-- Comments Section -->
    <section class="comments-section fade-in">
      <div class="comments-container">
        <h2 class="comments-title">Community Reflections</h2>
        <p class="comments-subtitle">Share your thoughts and experiences to support others on their healing journey.</p>

        <!-- Comment Form -->
        <div class="comment-form-container">
          <h3>Share Your Thoughts</h3>
          <form @submit.prevent="submitComment" class="comment-form">
            <div class="form-row">
              <div class="form-group">
                <label for="comment-name">Name *</label>
                <input
                    type="text"
                    id="comment-name"
                    v-model="newComment.author"
                    placeholder="Your name"
                    required
                    class="form-input"
                >
              </div>
              <div class="form-group">
                <label for="comment-email">Email (optional)</label>
                <input
                    type="email"
                    id="comment-email"
                    v-model="newComment.email"
                    placeholder="your@email.com"
                    class="form-input"
                >
                <small>Email won't be published but helps us prevent spam</small>
              </div>
            </div>
            <div class="form-group">
              <label for="comment-content">Your thoughts *</label>
              <textarea
                  id="comment-content"
                  v-model="newComment.content"
                  placeholder="Share your experience, ask a question, or offer support to others..."
                  required
                  rows="4"
                  class="form-textarea"
              ></textarea>
            </div>
            <div class="comment-guidelines">
              <h4>💚 Community Guidelines</h4>
              <ul>
                <li>Be kind, supportive, and respectful</li>
                <li>Share your own experiences, not medical advice</li>
                <li>Comments are moderated for safety</li>
                <li>Crisis situations require immediate professional help</li>
              </ul>
            </div>
            <button
                type="submit"
                class="submit-comment-btn"
                :disabled="isSubmittingComment"
            >
              {{ isSubmittingComment ? 'Submitting...' : 'Share Your Thoughts' }}
            </button>
          </form>
        </div>

        <!-- Comments List -->
        <div class="comments-list">
          <div class="comments-count">
            {{ comments.length }} {{ comments.length === 1 ? 'reflection' : 'reflections' }}
          </div>

          <div v-for="comment in comments" :key="comment.id" class="comment">
            <div class="comment-header">
              <div class="commenter-avatar">
                {{ comment.author.charAt(0).toUpperCase() }}
              </div>
              <div class="comment-meta">
                <span class="commenter-name">{{ comment.author }}</span>
                <span class="comment-time">{{ comment.timestamp }}</span>
              </div>
            </div>
            <div class="comment-content">
              <p>{{ comment.content }}</p>
            </div>

            <!-- Replies -->
            <div v-if="comment.replies && comment.replies.length > 0" class="replies">
              <div
                  v-for="reply in comment.replies"
                  :key="reply.id"
                  class="reply"
                  :class="{ 'author-reply': reply.author.includes('Dr.') }"
              >
                <div class="comment-header">
                  <div class="commenter-avatar" :class="{ professional: reply.author.includes('Dr.') }">
                    {{ reply.author.charAt(0).toUpperCase() }}
                  </div>
                  <div class="comment-meta">
                    <span class="commenter-name">
                      {{ reply.author }}
                      <span v-if="reply.author.includes('Dr.')" class="professional-badge">
                        🩺 Professional
                      </span>
                    </span>
                    <span class="comment-time">{{ reply.timestamp }}</span>
                  </div>
                </div>
                <div class="comment-content">
                  <p>{{ reply.content }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="comments-note">
            <p><strong>Moderation Notice:</strong> All comments are reviewed before publication to ensure a safe, supportive environment for our community.</p>
          </div>
        </div>
      </div>
    </section>
  </main>
  </template>
</template>

<style scoped>
/* Reading Progress Bar */
.reading-progress {
  position: fixed;
  top: 80px;
  left: 0;
  width: 100%;
  height: 4px;
  background: rgba(74, 124, 89, 0.1);
  z-index: 100;
}

.reading-progress-bar {
  height: 100%;
  background: var(--gradient);
  width: 0%;
  transition: width 0.3s ease;
}

/* Breadcrumb */
.blog-breadcrumb {
  background: var(--bg-light);
  padding: 1rem 0;
  margin-top: 84px;
  border-bottom: 1px solid var(--border-light);
}

.blog-breadcrumb-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  color: var(--text-light);
}

.blog-breadcrumb a {
  color: var(--primary-color);
  text-decoration: none;
  transition: color 0.3s ease;
}

.blog-breadcrumb a:hover {
  color: var(--secondary-color);
}

/* Blog Post Hero */
.blog-post-hero {
  background: white;
  padding: 3rem 0;
  border-bottom: 1px solid var(--border-light);
}

.blog-post-hero-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
}

.blog-category-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: white;
}

.blog-category-badge.anxiety {
  background: var(--soft-blue);
}

.blog-post-hero h1 {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  margin-bottom: 2rem;
  color: var(--text-dark);
  line-height: 1.2;
  font-family: 'Playfair Display', serif;
}

.blog-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.blog-author-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.author-avatar {
  width: 50px;
  height: 50px;
  background: var(--gradient);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
}

.author-details {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-weight: 600;
  color: var(--text-dark);
}

.author-credentials {
  color: var(--primary-color);
  font-size: 0.9rem;
}

.blog-post-meta {
  display: flex;
  gap: 1rem;
  color: var(--text-light);
  font-size: 0.9rem;
}

/* Main Content */
.blog-post-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
}

.blog-post-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 4rem;
}

/* Article Content */
.blog-content {
  background: white;
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 8px 30px var(--shadow-light);
  border: 1px solid var(--border-light);
}

.article-excerpt {
  background: var(--bg-sage);
  padding: 2rem;
  border-radius: 15px;
  margin-bottom: 3rem;
  border-left: 4px solid var(--primary-color);
}

.article-excerpt p {
  font-size: 1.2rem;
  font-weight: 500;
  color: var(--text-dark);
  margin: 0;
  line-height: 1.6;
}

.article-body {
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--text-light);
}

.content-paragraph {
  margin-bottom: 1.5rem;
}

.content-heading {
  color: var(--text-dark);
  margin: 2.5rem 0 1.5rem 0;
  font-family: 'Playfair Display', serif;
}

.content-heading.level-2 {
  font-size: 2rem;
  font-weight: 700;
  border-bottom: 2px solid var(--primary-color);
  padding-bottom: 0.5rem;
}

.content-heading.level-3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--primary-color);
}

.content-list {
  margin: 1.5rem 0;
  padding-left: 2rem;
}

.content-list li {
  margin-bottom: 0.75rem;
  line-height: 1.6;
}

.content-callout {
  margin: 2rem 0;
  padding: 2rem;
  border-radius: 15px;
  border-left: 4px solid;
}

.content-callout.info {
  background: rgba(52, 152, 219, 0.1);
  border-left-color: var(--soft-blue);
}

.content-callout.technique {
  background: rgba(74, 124, 89, 0.1);
  border-left-color: var(--primary-color);
}

.content-callout.support {
  background: rgba(231, 111, 81, 0.1);
  border-left-color: var(--warning-color);
}

.callout-title {
  font-weight: 700;
  color: var(--text-dark);
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.callout-content {
  color: var(--text-dark);
  line-height: 1.6;
}

/* Article Footer */
.article-footer {
  border-top: 1px solid var(--border-light);
  padding-top: 2rem;
  margin-top: 3rem;
}

.article-tags {
  margin-bottom: 2rem;
}

.article-tags h4 {
  color: var(--text-dark);
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.tags-list {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  background: var(--bg-sage);
  color: var(--primary-color);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  border: 1px solid var(--border-light);
}

.social-sharing h4 {
  color: var(--text-dark);
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.share-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.share-btn {
  background: white;
  color: var(--text-dark);
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  border: 2px solid var(--border-light);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.share-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px var(--shadow-light);
}

.share-btn.twitter:hover {
  border-color: #1da1f2;
  background: #1da1f2;
  color: white;
}

.share-btn.facebook:hover {
  border-color: #4267b2;
  background: #4267b2;
  color: white;
}

.share-btn.linkedin:hover {
  border-color: #0077b5;
  background: #0077b5;
  color: white;
}

.share-btn.copy:hover {
  border-color: var(--primary-color);
  background: var(--primary-color);
  color: white;
}

/* Sidebar */
.blog-sidebar {
  position: sticky;
  top: 120px;
  height: fit-content;
}

.sidebar-section {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 30px var(--shadow-light);
  border: 1px solid var(--border-light);
}

.sidebar-section h3 {
  color: var(--text-dark);
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
  font-weight: 700;
}

/* Author Card */
.author-card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.author-avatar-large {
  width: 60px;
  height: 60px;
  background: var(--gradient);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.author-info h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1.2rem;
}

.author-title {
  color: var(--primary-color);
  font-size: 0.9rem;
  font-weight: 600;
}

.author-bio {
  color: var(--text-light);
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.contact-btn {
  background: var(--primary-color);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  display: inline-block;
}

.contact-btn:hover {
  background: var(--secondary-color);
  transform: translateY(-2px);
}

/* Crisis Support */
.crisis-support {
  background: rgba(231, 111, 81, 0.1) !important;
  border-left: 4px solid var(--warning-color);
}

.crisis-contacts {
  margin: 1.5rem 0;
}

.crisis-contact {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  text-decoration: none;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  border: 1px solid var(--border-light);
}

.crisis-contact:hover {
  background: var(--bg-light);
  transform: translateY(-2px);
}

.crisis-icon {
  font-size: 1.5rem;
}

.crisis-contact strong {
  color: var(--text-dark);
  display: block;
  margin-bottom: 0.25rem;
}

.crisis-contact p {
  color: var(--text-light);
  font-size: 0.9rem;
  margin: 0;
}

.crisis-note {
  font-size: 0.9rem;
  color: var(--text-dark);
  font-style: italic;
  margin: 0;
}

/* Related Articles */
.related-posts {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.related-post {
  padding: 1.5rem;
  background: var(--bg-light);
  border-radius: 15px;
  border: 1px solid var(--border-light);
  transition: all 0.3s ease;
}

.related-post:hover {
  background: white;
  box-shadow: 0 5px 20px var(--shadow-light);
}

.related-post-category {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  color: white;
}

.related-post-category.depression {
  background: var(--success-color);
}

.related-post-category.mindfulness {
  background: var(--lavender);
  color: var(--text-dark);
}

.related-post-category.stress {
  background: var(--warning-color);
}

.related-post h4 {
  color: var(--text-dark);
  margin-bottom: 1rem;
  font-size: 1rem;
  line-height: 1.4;
}

.related-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.related-link:hover {
  color: var(--secondary-color);
}

/* Newsletter Signup */
.newsletter-signup p {
  color: var(--text-light);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.newsletter-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--border-light);
  border-radius: 12px;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
}

.newsletter-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(74, 124, 89, 0.1);
}

.newsletter-btn {
  width: 100%;
  background: var(--primary-color);
  color: white;
  padding: 0.75rem;
  border-radius: 25px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 0.5rem;
}

.newsletter-btn:hover {
  background: var(--secondary-color);
  transform: translateY(-2px);
}

.privacy-note {
  font-size: 0.8rem;
  color: var(--text-light);
  margin: 0;
}

/* Comments Section */
.comments-section {
  background: var(--bg-light);
  padding: 4rem 0;
  margin-top: 4rem;
}

.comments-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
}

.comments-title {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1rem;
  color: var(--text-dark);
  font-family: 'Playfair Display', serif;
}

.comments-subtitle {
  text-align: center;
  color: var(--text-light);
  margin-bottom: 3rem;
  font-size: 1.1rem;
  line-height: 1.6;
}

/* Comment Form */
.comment-form-container {
  background: white;
  padding: 3rem;
  border-radius: 20px;
  margin-bottom: 3rem;
  box-shadow: 0 8px 30px var(--shadow-light);
  border: 1px solid var(--border-light);
}

.comment-form-container h3 {
  color: var(--text-dark);
  margin-bottom: 2rem;
  font-size: 1.5rem;
  font-weight: 700;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  color: var(--text-dark);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.form-input {
  padding: 0.75rem;
  border: 2px solid var(--border-light);
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(74, 124, 89, 0.1);
}

.form-group small {
  color: var(--text-light);
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

.form-textarea {
  padding: 1rem;
  border: 2px solid var(--border-light);
  border-radius: 12px;
  font-size: 1rem;
  resize: vertical;
  min-height: 120px;
  font-family: inherit;
  transition: all 0.3s ease;
}

.form-textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(74, 124, 89, 0.1);
}

.comment-guidelines {
  background: var(--bg-sage);
  padding: 2rem;
  border-radius: 15px;
  margin: 2rem 0;
  border-left: 4px solid var(--primary-color);
}

.comment-guidelines h4 {
  color: var(--primary-color);
  margin-bottom: 1rem;
  font-size: 1rem;
}

.comment-guidelines ul {
  margin: 0;
  padding-left: 1.5rem;
  color: var(--text-dark);
}

.comment-guidelines li {
  margin-bottom: 0.5rem;
  line-height: 1.5;
}

.submit-comment-btn {
  background: var(--primary-color);
  color: white;
  padding: 1rem 2rem;
  border-radius: 25px;
  border: none;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px var(--shadow-light);
}

.submit-comment-btn:hover:not(:disabled) {
  background: var(--secondary-color);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px var(--shadow-medium);
}

.submit-comment-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Comments List */
.comments-list {
  background: white;
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 8px 30px var(--shadow-light);
  border: 1px solid var(--border-light);
}

.comments-count {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--border-light);
}

.comment {
  padding: 2rem 0;
  border-bottom: 1px solid var(--border-light);
}

.comment:last-of-type {
  border-bottom: none;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.commenter-avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: var(--gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
}

.commenter-avatar.professional {
  background: var(--accent-color);
}

.comment-meta {
  display: flex;
  flex-direction: column;
}

.commenter-name {
  font-weight: 600;
  color: var(--text-dark);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.professional-badge {
  background: var(--accent-color);
  color: white;
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  border-radius: 10px;
  font-weight: 600;
}

.comment-time {
  color: var(--text-light);
  font-size: 0.9rem;
}

.comment-content {
  margin-left: 3.5rem;
  color: var(--text-light);
  line-height: 1.6;
}

.comment-content p {
  margin: 0;
}

/* Replies */
.replies {
  margin-left: 3.5rem;
  margin-top: 1.5rem;
  padding-left: 2rem;
  border-left: 3px solid var(--border-light);
}

.reply {
  padding: 1.5rem 0;
  border-bottom: 1px solid var(--border-light);
}

.reply:last-child {
  border-bottom: none;
}

.reply.author-reply {
  background: var(--bg-sage);
  padding: 1.5rem;
  border-radius: 15px;
  border: 1px solid var(--border-light);
  margin-bottom: 1rem;
}

.comments-note {
  background: var(--bg-sage);
  padding: 1.5rem;
  border-radius: 15px;
  margin-top: 2rem;
  border-left: 4px solid var(--primary-color);
}

.comments-note p {
  margin: 0;
  color: var(--text-dark);
  font-size: 0.9rem;
  line-height: 1.6;
}

/* Loading and Error States */
.blog-loading-container, .blog-error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  padding: 3rem;
  text-align: center;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin: 2rem auto;
  max-width: 800px;
}

.blog-loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(74, 124, 89, 0.1);
  border-radius: 50%;
  border-top-color: var(--primary-color);
  margin: 0 auto 1.5rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.blog-error-container h2 {
  color: #d32f2f;
  margin-bottom: 1rem;
}

.blog-retry-button, .blog-back-button {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  margin: 1rem 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}

.blog-retry-button {
  background: var(--primary-color);
  color: white;
  border: none;
}

.blog-retry-button:hover {
  background: var(--secondary-color);
  transform: translateY(-2px);
}

.blog-back-button {
  background: white;
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
}

.blog-back-button:hover {
  background: var(--bg-sage);
  transform: translateY(-2px);
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .blog-post-container {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .blog-sidebar {
    position: static;
    top: auto;
  }

  .blog-content {
    padding: 2rem;
  }

  .blog-meta {
    flex-direction: column;
    align-items: flex-start;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .share-buttons {
    justify-content: center;
  }

  .comment-content {
    margin-left: 0;
    margin-top: 1rem;
  }

  .replies {
    margin-left: 0;
    padding-left: 1rem;
  }

  .comments-container {
    padding: 0 1rem;
  }

  .comment-form-container,
  .comments-list {
    padding: 2rem;
  }

  .content-heading.level-2 {
    font-size: 1.5rem;
  }

  .content-heading.level-3 {
    font-size: 1.3rem;
  }
}

/* Animations */
.fade-in {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease;
}

.fade-in.visible {
  opacity: 1;
  transform: translateY(0);
}
</style>
