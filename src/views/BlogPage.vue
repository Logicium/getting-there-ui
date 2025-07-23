<script setup lang="ts">
import { onMounted, ref } from 'vue';

// Search functionality
const searchInput = ref('');
const currentFilter = ref('all');

function filterArticles() {
    const searchTerm = searchInput.value.toLowerCase();
    const articles = document.querySelectorAll('.article-card');

    articles.forEach(article => {
        const title = article.querySelector('.article-title').textContent.toLowerCase();
        const excerpt = article.querySelector('.article-excerpt').textContent.toLowerCase();
        const category = article.dataset.category;

        const matchesSearch = title.includes(searchTerm) || excerpt.includes(searchTerm);
        const matchesFilter = currentFilter.value === 'all' || category === currentFilter.value;

        if (matchesSearch && matchesFilter) {
            article.style.display = 'grid';
        } else {
            article.style.display = 'none';
        }
    });
}

function setFilter(category) {
    currentFilter.value = category;
    filterArticles();
}

// Fade-in animation
onMounted(() => {
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

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
</script>

<template>
    <section class="blog-hero">
        <div class="blog-hero-content">
            <h1>Our Blog</h1>
            <p>Insights, strategies, and inspiration for your goal-achievement journey</p>
        </div>
    </section>

    <section class="search-filter">
        <div class="search-filter-content">
            <div class="search-box">
                <input type="text" class="search-input" placeholder="Search articles..." v-model="searchInput" @input="filterArticles">
                <span class="search-icon">🔍</span>
            </div>
            <div class="filter-tags">
                <span class="filter-tag" :class="{ active: currentFilter === 'all' }" @click="setFilter('all')">All Posts</span>
                <span class="filter-tag" :class="{ active: currentFilter === 'goal-setting' }" @click="setFilter('goal-setting')">Goal Setting</span>
                <span class="filter-tag" :class="{ active: currentFilter === 'productivity' }" @click="setFilter('productivity')">Productivity</span>
                <span class="filter-tag" :class="{ active: currentFilter === 'motivation' }" @click="setFilter('motivation')">Motivation</span>
                <span class="filter-tag" :class="{ active: currentFilter === 'success' }" @click="setFilter('success')">Success Stories</span>
            </div>
        </div>
    </section>

    <main class="blog-content">
        <section class="articles-section">
            <h2>Latest Articles</h2>
            <div class="articles-grid" id="articlesGrid">

                <article class="article-card fade-in" data-category="goal-setting">
                    <div class="article-image"></div>
                    <div class="article-content">
                        <div class="article-meta">
                            <span class="article-category">Goal Setting</span>
                            <span class="article-date">March 15, 2024</span>
                        </div>
                        <h3 class="article-title">The SMART Goals Framework: Your Path to Achievement</h3>
                        <p class="article-excerpt">Discover how to transform vague dreams into actionable, achievable goals using the proven SMART criteria. Learn the step-by-step process that has helped thousands reach their objectives.</p>
                        <a href="#" class="read-more">Read More →</a>
                    </div>
                </article>

                <article class="article-card fade-in" data-category="productivity">
                    <div class="article-image"></div>
                    <div class="article-content">
                        <div class="article-meta">
                            <span class="article-category">Productivity</span>
                            <span class="article-date">March 10, 2024</span>
                        </div>
                        <h3 class="article-title">5 Morning Habits That Will Transform Your Day</h3>
                        <p class="article-excerpt">Start your day with intention and energy. These five research-backed morning habits will set you up for success and help you maintain momentum throughout the day.</p>
                        <a href="#" class="read-more">Read More →</a>
                    </div>
                </article>

                <article class="article-card fade-in" data-category="motivation">
                    <div class="article-image"></div>
                    <div class="article-content">
                        <div class="article-meta">
                            <span class="article-category">Motivation</span>
                            <span class="article-date">March 5, 2024</span>
                        </div>
                        <h3 class="article-title">Overcoming the Plateau: When Progress Stalls</h3>
                        <p class="article-excerpt">Every journey has plateaus. Learn how to identify when you're stuck, understand why it happens, and discover proven strategies to break through and continue your progress.</p>
                        <a href="#" class="read-more">Read More →</a>
                    </div>
                </article>

                <article class="article-card fade-in" data-category="success">
                    <div class="article-image"></div>
                    <div class="article-content">
                        <div class="article-meta">
                            <span class="article-category">Success Stories</span>
                            <span class="article-date">February 28, 2024</span>
                        </div>
                        <h3 class="article-title">From Couch to Marathon: Sarah's Incredible Journey</h3>
                        <p class="article-excerpt">Meet Sarah, who went from never running to completing her first marathon in just 12 months. Her story shows how small, consistent steps can lead to extraordinary achievements.</p>
                        <a href="#" class="read-more">Read More →</a>
                    </div>
                </article>

                <article class="article-card fade-in" data-category="goal-setting">
                    <div class="article-image"></div>
                    <div class="article-content">
                        <div class="article-meta">
                            <span class="article-category">Goal Setting</span>
                            <span class="article-date">February 25, 2024</span>
                        </div>
                        <h3 class="article-title">Why Most People Fail at Their Goals (And How to Succeed)</h3>
                        <p class="article-excerpt">Studies show that 92% of people don't achieve their goals. Learn the common pitfalls that derail progress and the strategies that separate successful achievers from the rest.</p>
                        <a href="#" class="read-more">Read More →</a>
                    </div>
                </article>

                <article class="article-card fade-in" data-category="productivity">
                    <div class="article-image"></div>
                    <div class="article-content">
                        <div class="article-meta">
                            <span class="article-category">Productivity</span>
                            <span class="article-date">February 20, 2024</span>
                        </div>
                        <h3 class="article-title">The Power of Systems Over Goals</h3>
                        <p class="article-excerpt">Goals are important, but systems are what actually drive results. Discover how to build sustainable systems that automatically move you toward your objectives.</p>
                        <a href="#" class="read-more">Read More →</a>
                    </div>
                </article>

            </div>

            <div class="pagination">
                <a href="#">← Previous</a>
                <span class="current">1</span>
                <a href="#">2</a>
                <a href="#">3</a>
                <a href="#">4</a>
                <a href="#">Next →</a>
            </div>
        </section>

        <aside class="sidebar">
            <div class="sidebar-section">
                <h3>Recent Posts</h3>
                <ul class="recent-posts">
                    <li>
                        <a href="#" class="recent-post-title">The SMART Goals Framework: Your Path to Achievement</a>
                        <div class="recent-post-date">March 15, 2024</div>
                    </li>
                    <li>
                        <a href="#" class="recent-post-title">5 Morning Habits That Will Transform Your Day</a>
                        <div class="recent-post-date">March 10, 2024</div>
                    </li>
                    <li>
                        <a href="#" class="recent-post-title">Overcoming the Plateau: When Progress Stalls</a>
                        <div class="recent-post-date">March 5, 2024</div>
                    </li>
                    <li>
                        <a href="#" class="recent-post-title">From Couch to Marathon: Sarah's Journey</a>
                        <div class="recent-post-date">February 28, 2024</div>
                    </li>
                </ul>
            </div>

            <div class="sidebar-section">
                <h3>Categories</h3>
                <ul class="categories-list">
                    <li><a href="#">Goal Setting <span class="category-count">12</span></a></li>
                    <li><a href="#">Productivity <span class="category-count">8</span></a></li>
                    <li><a href="#">Motivation <span class="category-count">15</span></a></li>
                    <li><a href="#">Success Stories <span class="category-count">6</span></a></li>
                    <li><a href="#">Mindset <span class="category-count">9</span></a></li>
                    <li><a href="#">Health & Wellness <span class="category-count">7</span></a></li>
                </ul>
            </div>

            <div class="sidebar-section">
                <h3>Newsletter</h3>
                <p style="margin-bottom: 1rem; color: var(--text-light);">Get weekly insights and tips delivered to your inbox.</p>
                <input type="email" placeholder="Your email address" style="width: 100%; padding: 0.75rem; border: 2px solid #e5e7eb; border-radius: 8px; margin-bottom: 1rem;">
                <button style="width: 100%; padding: 0.75rem; background: var(--primary-color); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Subscribe</button>
            </div>
        </aside>
    </main>
</template>

<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    --primary-color: #2563eb;
    --secondary-color: #1e40af;
    --accent-color: #f59e0b;
    --text-dark: #1f2937;
    --text-light: #6b7280;
    --bg-light: #f9fafb;
    --white: #ffffff;
    --gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Hero Section */
.blog-hero {
    padding: 8rem 0 4rem;
    background: var(--gradient);
    color: white;
    text-align: center;
    position: relative;
    overflow: hidden;
}

.blog-hero::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="%23ffffff" fill-opacity="0.1"><circle cx="30" cy="30" r="2"/></g></svg>');
    animation: float 20s ease-in-out infinite;
}

@keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(180deg); }
}

.blog-hero-content {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 2rem;
    position: relative;
    z-index: 2;
}

.blog-hero h1 {
    font-size: clamp(2.5rem, 6vw, 4rem);
    font-weight: 800;
    margin-bottom: 1rem;
}

.blog-hero p {
    font-size: 1.2rem;
    opacity: 0.9;
    margin-bottom: 2rem;
}

/* Search and Filter Section */
.search-filter {
    background: white;
    padding: 2rem 0;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.search-filter-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    gap: 2rem;
    align-items: center;
    flex-wrap: wrap;
}

.search-box {
    flex: 1;
    min-width: 300px;
    position: relative;
}

.search-input {
    width: 100%;
    padding: 1rem 3rem 1rem 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 50px;
    font-size: 1rem;
    transition: all 0.3s ease;
    background: var(--bg-light);
}

.search-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.search-icon {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-light);
    font-size: 1.2rem;
}

.filter-tags {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

.filter-tag {
    padding: 0.5rem 1rem;
    background: var(--bg-light);
    border: 2px solid transparent;
    border-radius: 25px;
    color: var(--text-dark);
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s ease;
    cursor: pointer;
}

.filter-tag:hover, .filter-tag.active {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}

/* Main Content */
.blog-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 4rem 2rem;
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 4rem;
}

/* Articles Grid */
.articles-section h2 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 2rem;
    color: var(--text-dark);
}

.articles-grid {
    display: grid;
    gap: 2rem;
}

.article-card {
    background: white;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 0;
}

.article-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
}

.article-image {
    background: var(--gradient);
    position: relative;
    overflow: hidden;
}

.article-image::after {
    content: '📚';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 3rem;
    opacity: 0.7;
}

.article-content {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
}

.article-meta {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    font-size: 0.9rem;
    color: var(--text-light);
}

.article-category {
    background: var(--accent-color);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 15px;
    font-size: 0.8rem;
    font-weight: 600;
}

.article-date {
    display: flex;
    align-items: center;
}

.article-title {
    font-size: 1.3rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: var(--text-dark);
    line-height: 1.4;
}

.article-excerpt {
    color: var(--text-light);
    margin-bottom: 1rem;
    flex-grow: 1;
    line-height: 1.5;
}

.read-more {
    color: var(--primary-color);
    text-decoration: none;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    transition: color 0.3s ease;
}

.read-more:hover {
    color: var(--secondary-color);
}

/* Sidebar */
.sidebar {
    position: sticky;
    top: 6rem;
    height: fit-content;
}

.sidebar-section {
    background: white;
    border-radius: 15px;
    padding: 2rem;
    margin-bottom: 2rem;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
}

.sidebar-section h3 {
    font-size: 1.3rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    color: var(--text-dark);
}

.recent-posts {
    list-style: none;
}

.recent-posts li {
    padding: 1rem 0;
    border-bottom: 1px solid #e5e7eb;
}

.recent-posts li:last-child {
    border-bottom: none;
}

.recent-post-title {
    font-weight: 600;
    color: var(--text-dark);
    text-decoration: none;
    line-height: 1.4;
    display: block;
    margin-bottom: 0.5rem;
    transition: color 0.3s ease;
}

.recent-post-title:hover {
    color: var(--primary-color);
}

.recent-post-date {
    font-size: 0.9rem;
    color: var(--text-light);
}

.categories-list {
    list-style: none;
}

.categories-list li {
    margin-bottom: 0.5rem;
}

.categories-list a {
    color: var(--text-dark);
    text-decoration: none;
    padding: 0.5rem 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 8px;
    transition: all 0.3s ease;
}

.categories-list a:hover {
    color: var(--primary-color);
    background: var(--bg-light);
    padding-left: 1rem;
}

.category-count {
    background: var(--primary-color);
    color: white;
    font-size: 0.8rem;
    padding: 0.25rem 0.5rem;
    border-radius: 10px;
    font-weight: 600;
}

/* Pagination */
.pagination {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 3rem;
    flex-wrap: wrap;
}

.pagination a, .pagination span {
    padding: 0.75rem 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 10px;
    text-decoration: none;
    color: var(--text-dark);
    font-weight: 600;
    transition: all 0.3s ease;
}

.pagination a:hover {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}

.pagination .current {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
    .search-filter-content {
        flex-direction: column;
        align-items: stretch;
    }

    .search-box {
        min-width: auto;
    }

    .filter-tags {
        justify-content: center;
    }

    .blog-content {
        grid-template-columns: 1fr;
        gap: 2rem;
    }

    .article-card {
        grid-template-columns: 1fr;
    }

    .article-image {
        height: 150px;
    }

    .sidebar {
        position: static;
        top: auto;
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
