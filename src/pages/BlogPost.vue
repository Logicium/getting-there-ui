<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import NewsletterSignup from '@/components/NewsletterSignup.vue'
import BlogCard from '@/components/cards/BlogCard.vue'
import {
  AppBadge,
  AppButton,
  AppCard,
  AppContainer,
  AppEmptyState,
  AppEyebrow,
  AppField,
  AppGrid,
  AppHero,
  AppInput,
  AppQuote,
  AppSection,
  AppSpinner,
  AppTextarea,
} from '@/components/ui'

const route = useRoute()
const isLoading = ref(true)
const error = ref<string | null>(null)

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

// Category mapping
const categoryMap: Record<string, string> = {
  'Managing Anxiety': 'anxiety',
  'Depression Care': 'depression',
  'Relationship Health': 'relationships',
  'Mindfulness': 'mindfulness',
  'Stress & Burnout': 'stress',
  'Self Care Strategies': 'selfcare'
};

// Blog post data
const blogPost = ref<any>({
  id: '',
  title: '',
  author: '',
  authorCredentials: 'Getting There Contributor',
  authorBio: '',
  publishDate: '',
  readTime: '',
  category: '',
  categoryLabel: '',
  featuredImage: '',
  excerpt: '',
  content: [],
  tags: [],
  relatedPosts: []
});

// All blog articles for related posts
const allBlogArticles = ref<BlogArticle[]>([]);

// Quote tone rotation across pull-quotes in article body
const quoteTones: Array<'marigold' | 'cobalt' | 'mint'> = ['marigold', 'cobalt', 'mint']

// Computed related posts — enriched for BlogCard
const relatedPosts = computed(() => {
  if (!blogPost.value.category || !allBlogArticles.value.length) {
    return []
  }

  const sameCategory = allBlogArticles.value.filter(article => {
    const articleCategory = categoryMap[article.Category] || article.Category.toLowerCase().replace(/\s+/g, '-')
    return articleCategory === blogPost.value.category && article.documentId !== blogPost.value.id
  })

  const pick = (arr: BlogArticle[]) => arr.slice(0, 3).map((article) => {
    const mapped = categoryMap[article.Category] || article.Category.toLowerCase().replace(/\s+/g, '-')
    const date = new Date(article.publishedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    const firstParagraph = article.ArticleBody.find((item: any) => item.type === 'paragraph')
    const excerpt = firstParagraph
      ? firstParagraph.children[0].text.substring(0, 120) + '...'
      : article.Description
    const wordCount = article.ArticleBody.reduce((count: number, item: any) => {
      if (item.type === 'paragraph' && item.children?.length > 0) {
        return count + item.children[0].text.split(' ').length
      }
      return count
    }, 0)
    return {
      id: article.documentId,
      title: article.title,
      category: mapped,
      categoryLabel: article.Category,
      imageUrl: article.Image?.formats?.small?.url || article.Image?.url || '/backgrounds/therapy1.jpg',
      date,
      readTime: Math.max(1, Math.ceil(wordCount / 200)),
      excerpt: article.Description || excerpt,
      authorName: article.Author,
    }
  })

  if (sameCategory.length > 0) return pick(sameCategory)

  const otherArticles = allBlogArticles.value.filter(article => article.documentId !== blogPost.value.id)
  const shuffled = otherArticles.sort(() => 0.5 - Math.random())
  return pick(shuffled)
})

// Comments data
interface Comment {
  id: string;
  name: string;
  content: string;
  createdAt: string;
  replies?: Comment[];
}

const comments = ref<Comment[]>([]);
const isLoadingComments = ref(false);
const commentError = ref<string | null>(null);

const fetchComments = async (documentId: string) => {
  isLoadingComments.value = true;
  commentError.value = null;

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/comments/document/${documentId}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch comments: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    comments.value = data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    commentError.value = 'Failed to load comments. Please try again later.';
  } finally {
    isLoadingComments.value = false;
  }
};

// Comment form
const newComment = ref({
  name: '',
  email: '',
  content: ''
});

const isSubmittingComment = ref(false);
const submitError = ref<string | null>(null);

const submitComment = async () => {
  if (!newComment.value.name.trim() || !newComment.value.email.trim() || !newComment.value.content.trim()) {
    alert('Please fill in your name, email, and comment.');
    return;
  }

  isSubmittingComment.value = true;
  submitError.value = null;

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: newComment.value.name,
        email: newComment.value.email,
        content: newComment.value.content,
        documentId: route.params.id as string,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to submit comment: ${response.status} ${response.statusText}`);
    }

    newComment.value = { name: '', email: '', content: '' };
    alert('Thank you for your comment! It has been submitted for review and will appear once approved by our moderation team.');
  } catch (error) {
    console.error('Error submitting comment:', error);
    submitError.value = 'Failed to submit your comment. Please try again later.';
  } finally {
    isSubmittingComment.value = false;
  }
};

// Share functions
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

const fetchAllBlogArticles = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_CMS_URL}/api/blogs?populate=all`);

    if (!res.ok) {
      throw new Error(`Failed to fetch blog articles: ${res.status} ${res.statusText}`);
    }

    const json = await res.json();
    allBlogArticles.value = json?.data || [];
  } catch (err) {
    console.error('Error fetching all blog articles:', err);
  }
};

const fetchBlogPost = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    const documentId = route.params.id;
    if (!documentId) {
      throw new Error('Blog post ID is missing');
    }

    await fetchAllBlogArticles();

    const res = await fetch(`${import.meta.env.VITE_CMS_URL}/api/blogs?filters[documentId][$eq]=${documentId}&populate=all`);

    if (!res.ok) {
      throw new Error(`Failed to fetch blog post: ${res.status} ${res.statusText}`);
    }

    const json = await res.json();
    const articles = json?.data || [];

    if (articles.length === 0) {
      throw new Error('Blog post not found');
    }

    const article = articles[0];

    const wordCount = article.ArticleBody.reduce((count: number, item: any) => {
      if (item.type === 'paragraph' && item.children && item.children.length > 0) {
        return count + item.children[0].text.split(' ').length;
      }
      return count;
    }, 0);

    const readTime = Math.max(1, Math.ceil(wordCount / 200));

    const date = new Date(article.publishedAt);
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const mappedCategory = categoryMap[article.Category] || article.Category.toLowerCase().replace(/\s+/g, '-');

    blogPost.value = {
      id: article.documentId,
      title: article.title,
      author: article.Author,
      authorCredentials: 'Getting There Contributor',
      authorBio: 'An experienced contributor sharing perspectives on emotional wellness and personal growth.',
      publishDate: formattedDate,
      readTime: `${readTime} min read`,
      category: mappedCategory,
      categoryLabel: article.Category,
      featuredImage: article.Image?.url || '/backgrounds/therapy1.jpg',
      excerpt: article.Description,
      content: mapArticleBodyToContent(article.ArticleBody),
      tags: article.topics.map((topic: any) => topic.tag)
    };
  } catch (e) {
    console.error('Error fetching blog post:', e);
    error.value = e instanceof Error ? e.message : 'Failed to load blog post';
  } finally {
    isLoading.value = false;
  }
};

const mapArticleBodyToContent = (articleBody: any[]) => {
  return articleBody.map(item => {
    if (item.type === 'paragraph') {
      return { type: 'paragraph', content: item.children }
    } else if (item.type === 'heading') {
      return { type: 'heading', level: item.level, content: item.children }
    } else if (item.type === 'list') {
      const items = item.children.map((listItem: any) => {
        if (listItem.children && listItem.children.length > 0) {
          return listItem.children
        }
        return [{ text: 'List item content not available', type: 'text' }]
      })
      return { type: 'list', style: item.format || 'unordered', items }
    } else {
      console.log('Unsupported content type:', item.type)
      return { type: 'paragraph', content: [{ text: 'Content type not supported', type: 'text' }] }
    }
  })
}

onMounted(async () => {
  await fetchBlogPost();

  if (route.params.id) {
    await fetchComments(route.params.id as string);
  }

  // Reading progress bar listener
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
  <main class="blog-post">
    <!-- LOADING -->
    <AppSection v-if="isLoading" tone="cream" pad="xl">
      <AppContainer size="md">
        <div class="blog-post__state">
          <AppSpinner size="lg" />
          <p>Loading article...</p>
        </div>
      </AppContainer>
    </AppSection>

    <!-- ERROR -->
    <AppSection v-else-if="error" tone="cream" pad="xl">
      <AppContainer size="md">
        <AppEmptyState variant="error" title="Couldn't load article" :message="error ?? undefined">
          <template #actions>
            <AppButton variant="primary" @click="fetchBlogPost">Try again</AppButton>
            <AppButton to="/blog" variant="ghost">Back to blog</AppButton>
          </template>
        </AppEmptyState>
      </AppContainer>
    </AppSection>

    <!-- CONTENT -->
    <template v-else>
      <!-- Reading Progress Bar -->
      <div class="reading-progress" aria-hidden="true">
        <div class="reading-progress-bar"></div>
      </div>

      <!-- HERO (magazine, centered title) -->
      <AppHero variant="magazine" tone="cream" align="center">
        <template #eyebrow>
          <AppEyebrow tone="fuchsia">{{ blogPost.categoryLabel }}</AppEyebrow>
        </template>
        <template #title>{{ blogPost.title }}</template>
        <template #lede>
          <p>{{ blogPost.excerpt }}</p>
        </template>
        <template #meta>
          <div class="blog-post__meta">
            <span>{{ blogPost.publishDate }}</span>
            <span aria-hidden="true">·</span>
            <span>{{ blogPost.readTime }}</span>
            <span aria-hidden="true">·</span>
            <span>by <b>{{ blogPost.author }}</b></span>
          </div>
        </template>
      </AppHero>

      <!-- ARTICLE BODY -->
      <AppSection tone="cream" pad="xl">
        <AppContainer size="md">
          <article class="blog-content u-prose">
            <template v-for="(section, index) in blogPost.content" :key="index">
              <!-- Paragraph -->
              <p v-if="section.type === 'paragraph'">
                <template v-for="(child, childIndex) in section.content" :key="childIndex">
                  <strong v-if="child.bold && child.italic"><em>{{ child.text }}</em></strong>
                  <strong v-else-if="child.bold">{{ child.text }}</strong>
                  <em v-else-if="child.italic">{{ child.text }}</em>
                  <span v-else>{{ child.text }}</span>
                </template>
              </p>

              <!-- Heading -->
              <component
                v-else-if="section.type === 'heading'"
                :is="`h${section.level}`"
              >
                <template v-for="(child, childIndex) in section.content" :key="childIndex">
                  <strong v-if="child.bold && child.italic"><em>{{ child.text }}</em></strong>
                  <strong v-else-if="child.bold">{{ child.text }}</strong>
                  <em v-else-if="child.italic">{{ child.text }}</em>
                  <span v-else>{{ child.text }}</span>
                </template>
              </component>

              <!-- List -->
              <ul v-else-if="section.type === 'list' && section.style === 'unordered'">
                <li v-for="(item, itemIndex) in section.items" :key="itemIndex">
                  <template v-for="(child, childIndex) in item" :key="childIndex">
                    <strong v-if="child.bold && child.italic"><em>{{ child.text }}</em></strong>
                    <strong v-else-if="child.bold">{{ child.text }}</strong>
                    <em v-else-if="child.italic">{{ child.text }}</em>
                    <span v-else>{{ child.text }}</span>
                  </template>
                </li>
              </ul>

              <!-- Callout → AppQuote pull-quote -->
              <AppQuote
                v-else-if="section.type === 'callout'"
                :tone="quoteTones[index % quoteTones.length]"
              >
                <span v-if="section.title"><b>{{ section.title }} —</b> </span>{{ section.content }}
              </AppQuote>
            </template>
          </article>

          <!-- Tags -->
          <div v-if="blogPost.tags?.length" class="blog-post__tags">
            <AppEyebrow tone="cobalt">Related topics</AppEyebrow>
            <div class="blog-post__tags-list">
              <AppBadge
                v-for="tag in blogPost.tags"
                :key="tag"
                tone="cobalt"
                size="sm"
              >{{ tag }}</AppBadge>
            </div>
          </div>

          <!-- Share -->
          <div class="blog-post__share">
            <AppEyebrow tone="marigold">Share this article</AppEyebrow>
            <div class="blog-post__share-buttons">
              <AppButton variant="secondary" size="sm" @click="shareArticle('twitter')">Twitter</AppButton>
              <AppButton variant="secondary" size="sm" @click="shareArticle('facebook')">Facebook</AppButton>
              <AppButton variant="secondary" size="sm" @click="shareArticle('linkedin')">LinkedIn</AppButton>
              <AppButton variant="secondary" size="sm" @click="copyLink">Copy link</AppButton>
            </div>
          </div>

          <!-- Author bio -->
          <AppCard variant="plaque" tone="cream-2" shadow-tone="marigold" pad="lg" class="blog-post__author-card">
            <template #eyebrow>
              <AppEyebrow tone="marigold">About the author</AppEyebrow>
            </template>
            <template #title>{{ blogPost.author }}</template>
            <p class="blog-post__author-credentials">{{ blogPost.authorCredentials }}</p>
            <p>{{ blogPost.authorBio }}</p>
          </AppCard>
        </AppContainer>
      </AppSection>

      <!-- NEWSLETTER -->
      <AppSection tone="mint" pad="lg">
        <AppContainer size="md">
          <NewsletterSignup
            variant="cta"
            source="blog-post"
            title="Stay in the loop"
            description="New posts and practices delivered straight to your inbox."
            button-text="Subscribe"
          />
        </AppContainer>
      </AppSection>

      <!-- RELATED POSTS -->
      <AppSection v-if="relatedPosts.length > 0" tone="cream" pad="xl">
        <AppContainer size="lg">
          <header class="blog-post__head">
            <AppEyebrow tone="cobalt">Keep reading</AppEyebrow>
            <h2 class="u-display u-display--md">Related articles</h2>
          </header>
          <AppGrid :min="280" gap="md">
            <BlogCard
              v-for="post in relatedPosts"
              :key="post.id"
              :category="post.category"
              :category-label="post.categoryLabel"
              :icon="''"
              :image-url="'https://getting-there-cms.onrender.com' + post.imageUrl"
              :date="post.date"
              :read-time="post.readTime"
              :title="post.title"
              :excerpt="post.excerpt"
              :author-avatar="''"
              :author-name="post.authorName"
              :author-credentials="'Getting There Contributor'"
              :slug="post.id"
            />
          </AppGrid>
        </AppContainer>
      </AppSection>

      <!-- COMMENTS -->
      <AppSection tone="cream-2" pad="xl">
        <AppContainer size="md">
          <header class="blog-post__head">
            <AppEyebrow tone="fuchsia">Community reflections</AppEyebrow>
            <h2 class="u-display u-display--md">Share your thoughts</h2>
            <p class="blog-post__comments-subtitle">
              Share your experiences to support others on their journey.
            </p>
          </header>

          <!-- Comment Form -->
          <AppCard variant="plaque" tone="paper" shadow-tone="cobalt" pad="lg" class="blog-post__comment-form">
            <template #title>Add your reflection</template>
            <form @submit.prevent="submitComment" class="blog-post__form">
              <div class="blog-post__form-row">
                <AppField label="Name" required :for="'comment-name'">
                  <AppInput
                    id="comment-name"
                    v-model="newComment.name"
                    type="text"
                    placeholder="Your name"
                    autocomplete="name"
                    required
                  />
                </AppField>
                <AppField
                  label="Email"
                  required
                  :for="'comment-email'"
                  hint="Email won't be published but helps us prevent spam"
                >
                  <AppInput
                    id="comment-email"
                    v-model="newComment.email"
                    type="email"
                    placeholder="your@email.com"
                    autocomplete="email"
                    required
                  />
                </AppField>
              </div>
              <AppField label="Your thoughts" required :for="'comment-content'">
                <AppTextarea
                  id="comment-content"
                  v-model="newComment.content"
                  :rows="4"
                  placeholder="Share your experience, ask a question, or offer support to others..."
                  required
                />
              </AppField>

              <AppCard variant="flat" tone="mint" pad="md" class="blog-post__guidelines">
                <template #title>Community guidelines</template>
                <ul>
                  <li>Be kind, supportive, and respectful</li>
                  <li>Share your own experiences, not medical advice</li>
                  <li>Comments are moderated for safety</li>
                  <li>Crisis situations require immediate professional help</li>
                </ul>
              </AppCard>

              <p v-if="submitError" class="blog-post__form-error">{{ submitError }}</p>

              <AppButton
                type="submit"
                variant="primary"
                size="lg"
                :loading="isSubmittingComment"
                :disabled="isSubmittingComment"
              >
                {{ isSubmittingComment ? 'Submitting...' : 'Share your thoughts' }}
              </AppButton>
            </form>
          </AppCard>

          <!-- Comments List -->
          <div class="blog-post__comments-list">
            <div v-if="isLoadingComments" class="blog-post__state">
              <AppSpinner size="md" />
              <p>Loading comments...</p>
            </div>

            <AppEmptyState
              v-else-if="commentError"
              variant="error"
              title="Couldn't load comments"
              :message="commentError ?? undefined"
            >
              <template #actions>
                <AppButton variant="primary" @click="fetchComments(route.params.id as string)">
                  Try again
                </AppButton>
              </template>
            </AppEmptyState>

            <AppEmptyState
              v-else-if="comments.length === 0"
              title="No reflections yet"
              message="Be the first to share your thoughts."
            />

            <template v-else>
              <h3 class="blog-post__comments-count">
                {{ comments.length }} {{ comments.length === 1 ? 'reflection' : 'reflections' }}
              </h3>

              <AppCard
                v-for="comment in comments"
                :key="comment.id"
                variant="flat"
                tone="paper"
                pad="md"
                class="blog-post__comment"
              >
                <div class="blog-post__comment-header">
                  <div class="blog-post__commenter-avatar">
                    {{ comment.name.charAt(0).toUpperCase() }}
                  </div>
                  <div class="blog-post__comment-meta">
                    <span class="blog-post__commenter-name">{{ comment.name }}</span>
                    <span class="blog-post__comment-time">{{ new Date(comment.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) }}</span>
                  </div>
                </div>
                <p>{{ comment.content }}</p>

                <div v-if="comment.replies && comment.replies.length > 0" class="blog-post__replies">
                  <div
                    v-for="reply in comment.replies"
                    :key="reply.id"
                    class="blog-post__reply"
                  >
                    <div class="blog-post__comment-header">
                      <div class="blog-post__commenter-avatar">
                        {{ reply.name.charAt(0).toUpperCase() }}
                      </div>
                      <div class="blog-post__comment-meta">
                        <span class="blog-post__commenter-name">{{ reply.name }}</span>
                        <span class="blog-post__comment-time">{{ new Date(reply.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) }}</span>
                      </div>
                    </div>
                    <p>{{ reply.content }}</p>
                  </div>
                </div>
              </AppCard>

              <p class="blog-post__comments-note">
                <strong>Moderation notice:</strong> All comments are reviewed before publication to ensure a safe, supportive environment.
              </p>
            </template>
          </div>
        </AppContainer>
      </AppSection>
    </template>
  </main>
</template>

<style scoped lang="scss">
.reading-progress {
  position: fixed;
  top: 80px;
  left: 0;
  width: 100%;
  height: 4px;
  background: var(--c-cream-2);
  z-index: 100;
}

.reading-progress-bar {
  height: 100%;
  background: var(--c-cobalt);
  width: 0%;
  transition: width 0.3s ease;
}

.blog-post {
  &__state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--s-4);
    text-align: center;
    color: var(--c-text-muted);
    padding: var(--s-6) 0;
  }

  &__meta {
    display: flex;
    flex-wrap: wrap;
    gap: var(--s-3);
    align-items: center;
    justify-content: center;
    font-family: var(--font-body);
    font-size: var(--fs-sm);
    color: var(--c-text-muted);
  }

  &__head {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--s-3);
    text-align: center;
    margin-bottom: var(--s-7);
  }

  &__tags {
    margin-top: var(--s-8);
    display: flex;
    flex-direction: column;
    gap: var(--s-3);
  }

  &__tags-list {
    display: flex;
    flex-wrap: wrap;
    gap: var(--s-2);
  }

  &__share {
    margin-top: var(--s-7);
    display: flex;
    flex-direction: column;
    gap: var(--s-3);
  }

  &__share-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: var(--s-2);
  }

  &__author-card {
    margin-top: var(--s-9);
  }

  &__author-credentials {
    margin: 0 0 var(--s-3);
    color: var(--c-cobalt);
    font-weight: 700;
    font-size: var(--fs-sm);
  }

  &__comments-subtitle {
    color: var(--c-text-muted);
    max-width: 52ch;
  }

  &__comment-form { margin-bottom: var(--s-7); }

  &__form {
    display: flex;
    flex-direction: column;
    gap: var(--s-4);
  }

  &__form-row {
    display: grid;
    gap: var(--s-4);

    @media (min-width: 640px) {
      grid-template-columns: 1fr 1fr;
    }
  }

  &__guidelines {
    ul { margin: 0; padding-left: var(--s-5); }
    li { margin-bottom: var(--s-2); }
  }

  &__form-error {
    margin: 0;
    color: var(--c-fuchsia-deep);
    font-weight: 600;
  }

  &__comments-list {
    display: flex;
    flex-direction: column;
    gap: var(--s-4);
  }

  &__comments-count {
    font-family: var(--font-display);
    font-size: var(--fs-xl);
    color: var(--c-ink);
    margin: 0 0 var(--s-3);
  }

  &__comment-header {
    display: flex;
    align-items: center;
    gap: var(--s-3);
    margin-bottom: var(--s-3);
  }

  &__commenter-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--c-marigold);
    color: var(--c-ink);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    border: 2px solid var(--c-ink);
  }

  &__comment-meta {
    display: flex;
    flex-direction: column;
  }

  &__commenter-name {
    font-weight: 700;
    color: var(--c-ink);
  }

  &__comment-time {
    font-size: var(--fs-sm);
    color: var(--c-text-muted);
  }

  &__replies {
    margin-top: var(--s-4);
    padding-left: var(--s-5);
    border-left: 3px solid var(--c-cream-2);
    display: flex;
    flex-direction: column;
    gap: var(--s-4);
  }

  &__reply { padding: var(--s-3) 0; }

  &__comments-note {
    color: var(--c-text-muted);
    font-size: var(--fs-sm);
    text-align: center;
    margin-top: var(--s-5);
  }
}
</style>
