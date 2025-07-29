<script setup lang="ts">
import { onMounted, ref } from 'vue';

// Filter functionality
const filterButtons = ref<HTMLElement[]>([]);
const videoCards = ref<HTMLElement[]>([]);
const searchInput = ref('');
const currentFilter = ref('all');

function filterVideos(category = currentFilter.value, searchTerm = searchInput.value) {
    videoCards.value.forEach(card => {
        const cardCategory = card.dataset.category || '';
        const cardTitle = card.dataset.title || '';

        const matchesCategory = category === 'all' || cardCategory.includes(category);
        const matchesSearch = searchTerm === '' || cardTitle.toLowerCase().includes(searchTerm.toLowerCase());

        if (matchesCategory && matchesSearch) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function setFilter(filter: string) {
    currentFilter.value = filter;
    filterVideos(filter, searchInput.value);
}

function handleSearch() {
    filterVideos(currentFilter.value, searchInput.value);
}

// Video player functionality
function playVideo(videoId: string) {
    interface VideoData {
        [key: string]: {
            title: string;
            presenter: string;
            description: string;
            duration: string;
        };
    }

    const videoData: VideoData = {
        'choosing-happiness': {
            title: 'Choosing Happiness: A Daily Practice',
            presenter: 'Dr. Sarah Mitchell',
            description: 'Learn practical strategies for cultivating happiness and maintaining a positive mindset even during challenging times. This presentation covers the neuroscience of happiness and actionable daily practices you can implement today to improve your overall well-being and life satisfaction.',
            duration: '18:32'
        },
        'goal-setting-basics': {
            title: 'Goal Setting Fundamentals',
            presenter: 'Michael Chen',
            description: 'Master the basics of effective goal setting with this comprehensive introduction. Learn the SMART framework and discover how to create goals that actually drive results. Perfect for beginners or anyone looking to refine their approach to goal achievement.',
            duration: '25:18'
        },
        'overcoming-procrastination': {
            title: 'Overcoming Procrastination',
            presenter: 'Lisa Rodriguez',
            description: 'Break free from the procrastination cycle with evidence-based strategies. Understand the psychology behind procrastination and learn practical techniques to take action, maintain momentum, and build productive habits that stick.',
            duration: '22:45'
        }
    };

    const video = videoData[videoId];
    if (!video) return;

    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalPresenter = document.getElementById('modalPresenter');
    const videoModal = document.getElementById('videoModal');

    if (!modalTitle || !modalDescription || !modalPresenter || !videoModal) return;

    modalTitle.textContent = video.title;
    modalDescription.textContent = video.description;
    modalPresenter.textContent = `Presented by ${video.presenter}`;

    videoModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeVideoModal() {
    const videoModal = document.getElementById('videoModal');
    if (!videoModal) return;

    videoModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Subscription modal functionality
function openSubscriptionModal() {
    showSubscriptionModal();
}

function showSubscriptionModal() {
    const subscriptionModal = document.getElementById('subscriptionModal');
    if (!subscriptionModal) return;

    subscriptionModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSubscriptionModal() {
    const subscriptionModal = document.getElementById('subscriptionModal');
    if (!subscriptionModal) return;

    subscriptionModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function handleSubscription() {
    alert('Subscription system would integrate with your payment processor here. For demo purposes, this would redirect to a secure checkout page with Stripe, PayPal, or similar payment service.');
    closeSubscriptionModal();
}

// Simulate premium access
function simulatePremiumAccess() {
    // This would check actual subscription status in a real implementation
    const isPremiumUser = false; // Set to true to test premium access

    if (isPremiumUser) {
        // Allow access to premium content
        document.querySelectorAll('.watch-btn.premium').forEach(btn => {
            const htmlBtn = btn as HTMLElement;
            htmlBtn.classList.remove('premium');
            htmlBtn.textContent = 'Watch Now';
            htmlBtn.style.cursor = 'pointer';
        });

        document.querySelectorAll('.premium-badge').forEach(badge => {
            const htmlBadge = badge as HTMLElement;
            htmlBadge.style.display = 'none';
        });
    }
}

// Initialize
onMounted(() => {
    // Get references to DOM elements
    filterButtons.value = Array.from(document.querySelectorAll('.filter-btn')).map(el => el as HTMLElement);
    videoCards.value = Array.from(document.querySelectorAll('.video-card')).map(el => el as HTMLElement);

    // Set up event listeners for filter buttons
    filterButtons.value.forEach(button => {
        button.addEventListener('click', function(this: HTMLElement) {
            filterButtons.value.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const filter = this.dataset.filter || 'all';
            setFilter(filter);
        });
    });

    // Set up search input event listener
    const videoSearch = document.getElementById('videoSearch') as HTMLInputElement;
    if (videoSearch) {
        videoSearch.addEventListener('input', function(this: HTMLInputElement) {
            searchInput.value = this.value;
            handleSearch();
        });
    }

    // Close modals when clicking outside
    const videoModal = document.getElementById('videoModal');
    if (videoModal) {
        videoModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeVideoModal();
            }
        });
    }

    const subscriptionModal = document.getElementById('subscriptionModal');
    if (subscriptionModal) {
        subscriptionModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeSubscriptionModal();
            }
        });
    }

    // Escape key to close modals
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeVideoModal();
            closeSubscriptionModal();
        }
    });

    // Fade-in animation
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

    simulatePremiumAccess();
});
</script>

<template>
    <section class="videos-hero">
        <div class="videos-hero-content">
            <h1>Videos & Presentations</h1>
            <p>Access our library of transformational presentations, workshops, and guided sessions designed to support your journey toward achieving your goals.</p>
            <div class="hero-stats">
                <div class="hero-stat">
                    <span class="hero-stat-number">50+</span>
                    <span class="hero-stat-label">Video Presentations</span>
                </div>
                <div class="hero-stat">
                    <span class="hero-stat-number">15</span>
                    <span class="hero-stat-label">Free Videos</span>
                </div>
                <div class="hero-stat">
                    <span class="hero-stat-number">10K+</span>
                    <span class="hero-stat-label">Hours Watched</span>
                </div>
            </div>
        </div>
    </section>

    <section class="subscription-banner">
        <div class="banner-content">
            <div class="banner-text">
                <h3>Unlock Premium Content</h3>
                <p>Get unlimited access to our complete video library for just $19/month</p>
            </div>
            <a href="#" class="premium-btn" @click.prevent="openSubscriptionModal">Start Free Trial</a>
        </div>
    </section>

    <section class="videos-filter">
        <div class="filter-content">
            <div class="filter-buttons">
                <button class="filter-btn active" data-filter="all">
                    📺 All Videos
                </button>
                <button class="filter-btn" data-filter="free">
                    🆓 Free Content
                </button>
                <button class="filter-btn" data-filter="premium">
                    ⭐ Premium Only
                </button>
                <button class="filter-btn" data-filter="motivation">
                    💪 Motivation
                </button>
                <button class="filter-btn" data-filter="wellness">
                    🧘 Wellness
                </button>
                <button class="filter-btn" data-filter="productivity">
                    🎯 Productivity
                </button>
            </div>
            <div class="search-box">
                <input type="text" class="search-input" placeholder="Search videos..." id="videoSearch">
                <span class="search-icon">🔍</span>
            </div>
        </div>
    </section>

    <main class="videos-content">

        <!-- Free Videos Section -->
        <section class="video-section">
            <h2 class="section-title fade-in">
                🆓 Free Content
                <div class="section-divider"></div>
            </h2>
            <div class="videos-grid" id="freeVideos">

                <div class="video-card fade-in" data-category="free motivation" data-title="choosing happiness mindset positive thinking">
                    <div class="video-thumbnail" @click="playVideo('choosing-happiness')">
                        <div class="free-badge">FREE</div>
                        <div class="video-duration">18:32</div>
                    </div>
                    <div class="video-content">
                        <div class="video-category">Mindset & Motivation</div>
                        <h3 class="video-title">Choosing Happiness: A Daily Practice</h3>
                        <p class="video-presenter">Dr. Sarah Mitchell</p>
                        <p class="video-description">Learn practical strategies for cultivating happiness and maintaining a positive mindset even during challenging times. This presentation covers the neuroscience of happiness and actionable daily practices.</p>
                        <div class="video-footer">
                            <span class="video-views">3.2K views</span>
                            <button class="watch-btn" @click="playVideo('choosing-happiness')">Watch Now</button>
                        </div>
                    </div>
                </div>

                <div class="video-card fade-in" data-category="free productivity" data-title="goal setting smart goals framework planning">
                    <div class="video-thumbnail" @click="playVideo('goal-setting-basics')">
                        <div class="free-badge">FREE</div>
                        <div class="video-duration">25:18</div>
                    </div>
                    <div class="video-content">
                        <div class="video-category">Goal Setting</div>
                        <h3 class="video-title">Goal Setting Fundamentals</h3>
                        <p class="video-presenter">Michael Chen</p>
                        <p class="video-description">Master the basics of effective goal setting with this comprehensive introduction. Learn the SMART framework and discover how to create goals that actually drive results.</p>
                        <div class="video-footer">
                            <span class="video-views">5.1K views</span>
                            <button class="watch-btn" @click="playVideo('goal-setting-basics')">Watch Now</button>
                        </div>
                    </div>
                </div>

                <div class="video-card fade-in" data-category="free motivation" data-title="overcoming procrastination productivity habits">
                    <div class="video-thumbnail" @click="playVideo('overcoming-procrastination')">
                        <div class="free-badge">FREE</div>
                        <div class="video-duration">22:45</div>
                    </div>
                    <div class="video-content">
                        <div class="video-category">Productivity</div>
                        <h3 class="video-title">Overcoming Procrastination</h3>
                        <p class="video-presenter">Lisa Rodriguez</p>
                        <p class="video-description">Break free from the procrastination cycle with evidence-based strategies. Understand the psychology behind procrastination and learn practical techniques to take action.</p>
                        <div class="video-footer">
                            <span class="video-views">4.7K views</span>
                            <button class="watch-btn" @click="playVideo('overcoming-procrastination')">Watch Now</button>
                        </div>
                    </div>
                </div>

            </div>
        </section>

        <!-- Premium Videos Section -->
        <section class="video-section">
            <h2 class="section-title fade-in">
                ⭐ Premium Content
                <div class="section-divider"></div>
            </h2>
            <div class="videos-grid" id="premiumVideos">

                <div class="video-card fade-in" data-category="premium wellness" data-title="coping with loss grief healing emotional wellness">
                    <div class="video-thumbnail" @click="showSubscriptionModal">
                        <div class="premium-badge">⭐ PREMIUM</div>
                        <div class="video-duration">45:20</div>
                    </div>
                    <div class="video-content">
                        <div class="video-category">Emotional Wellness</div>
                        <h3 class="video-title">Coping with Loss: A Path to Healing</h3>
                        <p class="video-presenter">Dr. Sarah Mitchell</p>
                        <p class="video-description">A compassionate and comprehensive guide to navigating grief and loss. This sensitive presentation offers practical tools for healing and finding meaning during difficult times.</p>
                        <div class="video-footer">
                            <span class="video-views">1.8K premium views</span>
                            <button class="watch-btn premium" @click="showSubscriptionModal">Premium Only</button>
                        </div>
                    </div>
                </div>

                <div class="video-card fade-in" data-category="premium productivity" data-title="advanced goal setting strategy planning systems">
                    <div class="video-thumbnail" @click="showSubscriptionModal">
                        <div class="premium-badge">⭐ PREMIUM</div>
                        <div class="video-duration">38:15</div>
                    </div>
                    <div class="video-content">
                        <div class="video-category">Advanced Strategy</div>
                        <h3 class="video-title">Advanced Goal Setting Systems</h3>
                        <p class="video-presenter">Michael Chen</p>
                        <p class="video-description">Go beyond basic goal setting with advanced frameworks used by high achievers. Learn systems thinking, goal stacking, and strategic planning methodologies.</p>
                        <div class="video-footer">
                            <span class="video-views">2.3K premium views</span>
                            <button class="watch-btn premium" @click="showSubscriptionModal">Premium Only</button>
                        </div>
                    </div>
                </div>

                <div class="video-card fade-in" data-category="premium wellness" data-title="building resilience stress management emotional intelligence">
                    <div class="video-thumbnail" @click="showSubscriptionModal">
                        <div class="premium-badge">⭐ PREMIUM</div>
                        <div class="video-duration">42:08</div>
                    </div>
                    <div class="video-content">
                        <div class="video-category">Resilience Training</div>
                        <h3 class="video-title">Building Unshakeable Resilience</h3>
                        <p class="video-presenter">Dr. Sarah Mitchell</p>
                        <p class="video-description">Develop mental toughness and emotional resilience to thrive through any challenge. Learn evidence-based techniques for stress management and emotional regulation.</p>
                        <div class="video-footer">
                            <span class="video-views">1.9K premium views</span>
                            <button class="watch-btn premium" @click="showSubscriptionModal">Premium Only</button>
                        </div>
                    </div>
                </div>

                <div class="video-card fade-in" data-category="premium wellness" data-title="relationships communication interpersonal skills">
                    <div class="video-thumbnail" @click="showSubscriptionModal">
                        <div class="premium-badge">⭐ PREMIUM</div>
                        <div class="video-duration">47:15</div>
                    </div>
                    <div class="video-content">
                        <div class="video-category">Relationships</div>
                        <h3 class="video-title">Building Meaningful Relationships</h3>
                        <p class="video-presenter">Dr. Sarah Mitchell</p>
                        <p class="video-description">Strengthen your personal and professional relationships with advanced communication skills, conflict resolution, and emotional intelligence techniques.</p>
                        <div class="video-footer">
                            <span class="video-views">1.7K premium views</span>
                            <button class="watch-btn premium" @click="showSubscriptionModal">Premium Only</button>
                        </div>
                    </div>
                </div>

                <div class="video-card fade-in" data-category="premium motivation" data-title="mindfulness meditation focus concentration">
                    <div class="video-thumbnail" @click="showSubscriptionModal">
                        <div class="premium-badge">⭐ PREMIUM</div>
                        <div class="video-duration">55:30</div>
                    </div>
                    <div class="video-content">
                        <div class="video-category">Mindfulness & Focus</div>
                        <h3 class="video-title">Mastering Mindfulness for Success</h3>
                        <p class="video-presenter">Lisa Rodriguez</p>
                        <p class="video-description">A comprehensive guide to using mindfulness and meditation to enhance focus, reduce stress, and improve decision-making for better goal achievement.</p>
                        <div class="video-footer">
                            <span class="video-views">1.5K premium views</span>
                            <button class="watch-btn premium" @click="showSubscriptionModal">Premium Only</button>
                        </div>
                    </div>
                </div>

                <div class="video-card fade-in" data-category="premium productivity" data-title="time management productivity systems efficiency">
                    <div class="video-thumbnail" @click="showSubscriptionModal">
                        <div class="premium-badge">⭐ PREMIUM</div>
                        <div class="video-duration">33:42</div>
                    </div>
                    <div class="video-content">
                        <div class="video-category">Time Management</div>
                        <h3 class="video-title">Elite Time Management Systems</h3>
                        <p class="video-presenter">Michael Chen</p>
                        <p class="video-description">Discover the time management systems used by top performers. Learn advanced scheduling, priority matrix techniques, and energy management strategies.</p>
                        <div class="video-footer">
                            <span class="video-views">2.1K premium views</span>
                            <button class="watch-btn premium" @click="showSubscriptionModal">Premium Only</button>
                        </div>
                    </div>
                </div>

            </div>
        </section>

    </main>

    <!-- Video Player Modal -->
    <div class="video-modal" id="videoModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title" id="modalTitle">Video Title</h3>
                <button class="close-modal" @click="closeVideoModal">&times;</button>
            </div>
            <div class="modal-video" id="modalVideo">
                🎬
            </div>
            <div class="modal-footer">
                <p class="modal-description" id="modalDescription">Video description will appear here.</p>
                <p class="modal-presenter" id="modalPresenter">Presenter name</p>
            </div>
        </div>
    </div>

    <!-- Subscription Modal -->
    <div class="subscription-modal" id="subscriptionModal">
        <div class="subscription-content">
            <button class="close-modal" @click="closeSubscriptionModal" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; cursor: pointer;">&times;</button>

            <h2>Unlock Premium Content</h2>
            <p>Get unlimited access to our complete library of transformational videos, including exclusive presentations on sensitive topics like grief, advanced goal-setting systems, and expert-level strategies.</p>

            <div class="pricing-card">
                <div class="price">$19<span style="font-size: 1rem;">/month</span></div>
                <div class="price-period">7-day free trial, cancel anytime</div>
                <ul class="features-list">
                    <li>Access to 35+ premium videos</li>
                    <li>New content added monthly</li>
                    <li>Download for offline viewing</li>
                    <li>HD quality streaming</li>
                    <li>Exclusive expert interviews</li>
                    <li>Certificate of completion</li>
                </ul>
            </div>

            <div class="subscription-buttons">
                <button class="subscribe-now-btn" @click="handleSubscription">Start Free Trial</button>
                <button class="close-subscription" @click="closeSubscriptionModal">Maybe Later</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}



/* Hero Section */
.videos-hero {
    padding: 8rem 0 4rem;
    background: var(--gradient);
    color: white;
    text-align: center;
    position: relative;
    overflow: hidden;
}

.videos-hero::before {
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

.videos-hero-content {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 2rem;
    position: relative;
    z-index: 2;
}

.videos-hero h1 {
    font-size: clamp(2.5rem, 6vw, 4rem);
    font-weight: 800;
    margin-bottom: 1rem;
}

.videos-hero p {
    font-size: 1.2rem;
    opacity: 0.9;
    margin-bottom: 2rem;
}

.hero-stats {
    display: flex;
    justify-content: center;
    gap: 3rem;
    margin-top: 2rem;
}

.hero-stat {
    text-align: center;
}

.hero-stat-number {
    font-size: 2rem;
    font-weight: 800;
    display: block;
}

.hero-stat-label {
    font-size: 0.9rem;
    opacity: 0.8;
}

/* Subscription Banner */
.subscription-banner {
    background: linear-gradient(135deg, var(--premium-gold) 0%, #f59e0b 100%);
    color: white;
    padding: 2rem 0;
    text-align: center;
}

.banner-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
}

.banner-text h3 {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
}

.banner-text p {
    opacity: 0.9;
}

.premium-btn {
    background: white;
    color: var(--premium-gold);
    padding: 1rem 2rem;
    border-radius: 50px;
    text-decoration: none;
    font-weight: 700;
    transition: all 0.3s ease;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.premium-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
}

/* Filter Section */
.videos-filter {
    background: white;
    padding: 2rem 0;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.filter-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    gap: 2rem;
    align-items: center;
    flex-wrap: wrap;
    justify-content: center;
}

.filter-buttons {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

.filter-btn {
    padding: 0.75rem 1.5rem;
    background: var(--bg-light);
    border: 2px solid transparent;
    border-radius: 25px;
    color: var(--text-dark);
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.filter-btn:hover, .filter-btn.active {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
    transform: translateY(-2px);
}

.search-box {
    position: relative;
    min-width: 300px;
}

.search-input {
    width: 100%;
    padding: 0.75rem 2.5rem 0.75rem 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 25px;
    background: var(--bg-light);
    transition: all 0.3s ease;
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
}

/* Main Content */
.videos-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 4rem 2rem;
}

.section-title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 2rem;
    color: var(--text-dark);
    display: flex;
    align-items: center;
    gap: 1rem;
}

.section-divider {
    height: 3px;
    background: var(--gradient);
    border-radius: 2px;
    flex: 1;
}

/* Video Grid */
.videos-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 2rem;
    margin-bottom: 4rem;
}

.video-card {
    background: white;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    transition: all 0.4s ease;
    position: relative;
}

.video-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
}

.video-thumbnail {
    position: relative;
    height: 200px;
    background: var(--gradient);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    cursor: pointer;
}

.video-thumbnail::after {
    content: '▶️';
    font-size: 3rem;
    opacity: 0.9;
}

.video-duration {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 5px;
    font-size: 0.8rem;
    font-weight: 600;
}

.premium-badge {
    position: absolute;
    top: 1rem;
    left: 1rem;
    background: var(--premium-gold);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 15px;
    font-size: 0.8rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.free-badge {
    position: absolute;
    top: 1rem;
    left: 1rem;
    background: var(--success-color);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 15px;
    font-size: 0.8rem;
    font-weight: 700;
}

.video-content {
    padding: 1.5rem;
}

.video-category {
    color: var(--primary-color);
    font-size: 0.9rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
}

.video-title {
    font-size: 1.3rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: var(--text-dark);
    line-height: 1.3;
}

.video-presenter {
    color: var(--text-light);
    font-size: 0.9rem;
    margin-bottom: 1rem;
}

.video-description {
    color: var(--text-light);
    line-height: 1.5;
    margin-bottom: 1.5rem;
    font-size: 0.95rem;
}

.video-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.video-views {
    color: var(--text-light);
    font-size: 0.9rem;
}

.watch-btn {
    background: var(--primary-color);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    text-decoration: none;
    font-weight: 600;
    font-size: 0.9rem;
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
}

.watch-btn:hover {
    background: var(--secondary-color);
    transform: translateY(-2px);
}

.watch-btn.premium {
    background: var(--premium-gold);
}

.watch-btn.premium:hover {
    background: var(--premium-gold);
    transform: translateY(-2px);
}

/* Video Player Modal */
.video-modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    z-index: 2000;
    align-items: center;
    justify-content: center;
}

.video-modal.active {
    display: flex;
}

.modal-content {
    background: white;
    border-radius: 20px;
    overflow: hidden;
    max-width: 800px;
    width: 90%;
    max-height: 90%;
    position: relative;
}

.modal-header {
    padding: 1.5rem;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-title {
    font-size: 1.3rem;
    font-weight: 700;
    color: var(--text-dark);
}

.close-modal {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--text-light);
}

.modal-video {
    width: 100%;
    height: 400px;
    background: var(--gradient);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 4rem;
}

.modal-footer {
    padding: 1.5rem;
}

.modal-description {
    color: var(--text-light);
    line-height: 1.6;
    margin-bottom: 1rem;
}

.modal-presenter {
    color: var(--primary-color);
    font-weight: 600;
}

/* Premium Subscription Modal */
.subscription-modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    z-index: 2000;
    align-items: center;
    justify-content: center;
}

.subscription-modal.active {
    display: flex;
}

.subscription-content {
    background: white;
    border-radius: 30px;
    padding: 3rem;
    max-width: 500px;
    width: 90%;
    text-align: center;
    position: relative;
}

.subscription-content h2 {
    font-size: 2rem;
    font-weight: 800;
    margin-bottom: 1rem;
    color: var(--text-dark);
}

.subscription-content p {
    color: var(--text-light);
    margin-bottom: 2rem;
    line-height: 1.6;
}

.pricing-card {
    background: var(--gradient);
    color: white;
    padding: 2rem;
    border-radius: 20px;
    margin-bottom: 2rem;
}

.price {
    font-size: 3rem;
    font-weight: 800;
    margin-bottom: 0.5rem;
}

.price-period {
    opacity: 0.8;
    margin-bottom: 1rem;
}

.features-list {
    list-style: none;
    text-align: left;
}

.features-list li {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
}

.features-list li::before {
    content: '✓';
    color: var(--premium-gold);
    font-weight: bold;
}

.subscription-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
}

.subscribe-now-btn {
    background: var(--premium-gold);
    color: white;
    padding: 1rem 2rem;
    border-radius: 50px;
    text-decoration: none;
    font-weight: 700;
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
}

.subscribe-now-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(251, 191, 36, 0.4);
}

.close-subscription {
    background: transparent;
    color: var(--text-light);
    padding: 1rem 2rem;
    border: 2px solid #e5e7eb;
    border-radius: 50px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.close-subscription:hover {
    border-color: var(--text-light);
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
    .videos-grid {
        grid-template-columns: 1fr;
    }

    .banner-content {
        flex-direction: column;
        text-align: center;
    }

    .filter-content {
        flex-direction: column;
    }

    .search-box {
        min-width: auto;
        width: 100%;
    }

    .hero-stats {
        flex-direction: column;
        gap: 1rem;
    }

    .subscription-content {
        padding: 2rem;
    }

    .subscription-buttons {
        flex-direction: column;
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
