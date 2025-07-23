<script setup lang="ts">
import { onMounted, ref } from 'vue';

// Filter functionality
const currentFilter = ref('all');

function setFilter(filter) {
    currentFilter.value = filter;
    filterEvents();
}

function filterEvents() {
    const filter = currentFilter.value;
    const eventCards = document.querySelectorAll('.event-card');

    eventCards.forEach(card => {
        const category = card.dataset.category;
        if (filter === 'all' || category === filter) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Sort events by date
function sortEventsByDate() {
    const grid = document.getElementById('eventsGrid');
    const events = Array.from(document.querySelectorAll('.event-card'));

    events.sort((a, b) => {
        const dateA = new Date(a.dataset.date);
        const dateB = new Date(b.dataset.date);
        return dateA - dateB;
    });

    events.forEach(event => grid.appendChild(event));
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

    // Initialize
    sortEventsByDate();
});
</script>

<template>
    <section class="events-hero">
        <div class="events-hero-content">
            <h1>Upcoming Events</h1>
            <p>Join our workshops, lectures, and seminars designed to accelerate your goal achievement journey</p>
        </div>
    </section>

    <section class="events-filter">
        <div class="filter-content">
            <div class="filter-buttons">
                <button class="filter-btn" :class="{ active: currentFilter === 'all' }" @click="setFilter('all')">
                    📅 All Events
                </button>
                <button class="filter-btn" :class="{ active: currentFilter === 'workshop' }" @click="setFilter('workshop')">
                    🛠️ Workshops
                </button>
                <button class="filter-btn" :class="{ active: currentFilter === 'lecture' }" @click="setFilter('lecture')">
                    🎤 Lectures
                </button>
                <button class="filter-btn" :class="{ active: currentFilter === 'seminar' }" @click="setFilter('seminar')">
                    📚 Seminars
                </button>
                <button class="filter-btn" :class="{ active: currentFilter === 'online' }" @click="setFilter('online')">
                    💻 Online Events
                </button>
            </div>
        </div>
    </section>

    <main class="events-content">

        <!-- Featured Event -->
        <div class="featured-event fade-in">
            <div class="featured-badge">Featured Event</div>
            <div class="featured-image"></div>
            <div class="featured-content">
                <h2 class="featured-title">Master Goal Setting Workshop</h2>
                <p class="featured-description">
                    Join our comprehensive 2-day intensive workshop where you'll learn advanced goal-setting techniques, create your personal success blueprint, and connect with like-minded achievers.
                </p>
                <div class="featured-details">
                    <div class="event-detail">
                        <span class="event-detail-icon">📅</span>
                        <span>April 15-16, 2024</span>
                    </div>
                    <div class="event-detail">
                        <span class="event-detail-icon">📍</span>
                        <span>Denver, CO</span>
                    </div>
                    <div class="event-detail">
                        <span class="event-detail-icon">⏰</span>
                        <span>9:00 AM - 5:00 PM</span>
                    </div>
                    <div class="event-detail">
                        <span class="event-detail-icon">👥</span>
                        <span>Limited to 50 participants</span>
                    </div>
                </div>
                <router-link :to="'/events/master-workshop'" class="featured-btn">Reserve Your Spot - $299</router-link>
            </div>
        </div>

        <h2 class="section-title fade-in">All Events</h2>

        <div class="events-grid" id="eventsGrid">

            <div class="event-card fade-in" data-category="workshop" data-date="2024-04-20">
                <div class="event-image">
                    <div class="event-status status-upcoming">Available</div>
                </div>
                <div class="event-content">
                    <div class="event-date">📅 April 20, 2024</div>
                    <h3 class="event-title">Productivity Bootcamp</h3>
                    <p class="event-description">
                        Transform your daily habits and supercharge your productivity with proven time management techniques and focus strategies.
                    </p>
                    <div class="event-details">
                        <div class="event-detail">
                            <span class="event-detail-icon">📍</span>
                            <span>Colorado Springs, CO</span>
                        </div>
                        <div class="event-detail">
                            <span class="event-detail-icon">⏰</span>
                            <span>10:00 AM - 4:00 PM</span>
                        </div>
                        <div class="event-detail">
                            <span class="event-detail-icon">👥</span>
                            <span>30 spots available</span>
                        </div>
                    </div>
                    <div class="event-footer">
                        <div class="event-price">$149</div>
                        <router-link :to="'/events/productivity-bootcamp'" class="event-btn">Learn More</router-link>
                    </div>
                </div>
            </div>

            <div class="event-card fade-in" data-category="lecture" data-date="2024-04-25">
                <div class="event-image">
                    <div class="event-status status-upcoming">Available</div>
                </div>
                <div class="event-content">
                    <div class="event-date">📅 April 25, 2024</div>
                    <h3 class="event-title">The Psychology of Success</h3>
                    <p class="event-description">
                        Discover the mental frameworks and psychological principles that separate high achievers from the rest in this enlightening lecture.
                    </p>
                    <div class="event-details">
                        <div class="event-detail">
                            <span class="event-detail-icon">📍</span>
                            <span>Boulder, CO</span>
                        </div>
                        <div class="event-detail">
                            <span class="event-detail-icon">⏰</span>
                            <span>7:00 PM - 9:00 PM</span>
                        </div>
                        <div class="event-detail">
                            <span class="event-detail-icon">👥</span>
                            <span>100 seats available</span>
                        </div>
                    </div>
                    <div class="event-footer">
                        <div class="event-price">$49</div>
                        <router-link :to="'/events/psychology-success'" class="event-btn">Learn More</router-link>
                    </div>
                </div>
            </div>

            <div class="event-card fade-in" data-category="online" data-date="2024-05-02">
                <div class="event-image">
                    <div class="event-status status-filling">Filling Fast</div>
                </div>
                <div class="event-content">
                    <div class="event-date">📅 May 2, 2024</div>
                    <h3 class="event-title">Virtual Goal Setting Masterclass</h3>
                    <p class="event-description">
                        Join from anywhere! An intensive online session covering advanced goal-setting techniques with live Q&A and personalized feedback.
                    </p>
                    <div class="event-details">
                        <div class="event-detail">
                            <span class="event-detail-icon">💻</span>
                            <span>Online via Zoom</span>
                        </div>
                        <div class="event-detail">
                            <span class="event-detail-icon">⏰</span>
                            <span>2:00 PM - 5:00 PM</span>
                        </div>
                        <div class="event-detail">
                            <span class="event-detail-icon">👥</span>
                            <span>5 spots remaining</span>
                        </div>
                    </div>
                    <div class="event-footer">
                        <div class="event-price">$99</div>
                        <router-link :to="'/events/virtual-masterclass'" class="event-btn">Register Now</router-link>
                    </div>
                </div>
            </div>

            <div class="event-card fade-in" data-category="seminar" data-date="2024-05-10">
                <div class="event-image">
                    <div class="event-status status-upcoming">Available</div>
                </div>
                <div class="event-content">
                    <div class="event-date">📅 May 10, 2024</div>
                    <h3 class="event-title">Building Resilient Habits</h3>
                    <p class="event-description">
                        Learn the science behind habit formation and discover how to build lasting positive changes that stick even during challenging times.
                    </p>
                    <div class="event-details">
                        <div class="event-detail">
                            <span class="event-detail-icon">📍</span>
                            <span>Fort Collins, CO</span>
                        </div>
                        <div class="event-detail">
                            <span class="event-detail-icon">⏰</span>
                            <span>1:00 PM - 4:00 PM</span>
                        </div>
                        <div class="event-detail">
                            <span class="event-detail-icon">👥</span>
                            <span>25 spots available</span>
                        </div>
                    </div>
                    <div class="event-footer">
                        <div class="event-price">$89</div>
                        <router-link :to="'/events/resilient-habits'" class="event-btn">Learn More</router-link>
                    </div>
                </div>
            </div>

            <div class="event-card fade-in" data-category="workshop" data-date="2024-05-18">
                <div class="event-image">
                    <div class="event-status status-sold-out">Sold Out</div>
                </div>
                <div class="event-content">
                    <div class="event-date">📅 May 18, 2024</div>
                    <h3 class="event-title">Leadership & Personal Growth</h3>
                    <p class="event-description">
                        Develop your leadership skills while focusing on personal development. Perfect for aspiring leaders and managers.
                    </p>
                    <div class="event-details">
                        <div class="event-detail">
                            <span class="event-detail-icon">📍</span>
                            <span>Denver, CO</span>
                        </div>
                        <div class="event-detail">
                            <span class="event-detail-icon">⏰</span>
                            <span>9:00 AM - 6:00 PM</span>
                        </div>
                        <div class="event-detail">
                            <span class="event-detail-icon">👥</span>
                            <span>Waitlist available</span>
                        </div>
                    </div>
                    <div class="event-footer">
                        <div class="event-price">$199</div>
                        <button class="event-btn" disabled>Join Waitlist</button>
                    </div>
                </div>
            </div>

            <div class="event-card fade-in" data-category="lecture" data-date="2024-05-25">
                <div class="event-image">
                    <div class="event-status status-upcoming">Available</div>
                </div>
                <div class="event-content">
                    <div class="event-date">📅 May 25, 2024</div>
                    <h3 class="event-title">Overcoming Procrastination</h3>
                    <p class="event-description">
                        Understand the root causes of procrastination and learn practical strategies to overcome this common obstacle to success.
                    </p>
                    <div class="event-details">
                        <div class="event-detail">
                            <span class="event-detail-icon">📍</span>
                            <span>Pueblo, CO</span>
                        </div>
                        <div class="event-detail">
                            <span class="event-detail-icon">⏰</span>
                            <span>6:30 PM - 8:30 PM</span>
                        </div>
                        <div class="event-detail">
                            <span class="event-detail-icon">👥</span>
                            <span>75 seats available</span>
                        </div>
                    </div>
                    <div class="event-footer">
                        <div class="event-price">$39</div>
                        <router-link :to="'/events/overcoming-procrastination'" class="event-btn">Learn More</router-link>
                    </div>
                </div>
            </div>

        </div>
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
    --success-color: #10b981;
    --warning-color: #f59e0b;
}

/* Hero Section */
.events-hero {
    padding: 8rem 0 4rem;
    background: var(--gradient);
    color: white;
    text-align: center;
    position: relative;
    overflow: hidden;
}

.events-hero::before {
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

.events-hero-content {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 2rem;
    position: relative;
    z-index: 2;
}

.events-hero h1 {
    font-size: clamp(2.5rem, 6vw, 4rem);
    font-weight: 800;
    margin-bottom: 1rem;
}

.events-hero p {
    font-size: 1.2rem;
    opacity: 0.9;
    margin-bottom: 2rem;
}

/* Filter Section */
.events-filter {
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

/* Main Content */
.events-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 4rem 2rem;
}

.section-title {
    text-align: center;
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 3rem;
    color: var(--text-dark);
}

/* Events Grid */
.events-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
}

.event-card {
    background: white;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    transition: all 0.4s ease;
    position: relative;
}

.event-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
}

.event-image {
    height: 200px;
    background: var(--gradient);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.event-image::after {
    content: '🎯';
    font-size: 4rem;
    opacity: 0.8;
}

.event-status {
    position: absolute;
    top: 1rem;
    right: 1rem;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 700;
    text-transform: uppercase;
}

.status-upcoming {
    background: var(--success-color);
    color: white;
}

.status-filling {
    background: var(--warning-color);
    color: white;
}

.status-sold-out {
    background: #ef4444;
    color: white;
}

.event-content {
    padding: 2rem;
}

.event-date {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--primary-color);
    font-weight: 600;
    margin-bottom: 1rem;
    font-size: 0.95rem;
}

.event-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: var(--text-dark);
    line-height: 1.3;
}

.event-description {
    color: var(--text-light);
    margin-bottom: 1.5rem;
    line-height: 1.6;
}

.event-details {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 2rem;
}

.event-detail {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: var(--text-light);
    font-size: 0.95rem;
}

.event-detail-icon {
    width: 20px;
    text-align: center;
}

.event-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
}

.event-price {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-dark);
}

.event-btn {
    background: var(--primary-color);
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 25px;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
}

.event-btn:hover {
    background: var(--secondary-color);
    transform: translateY(-2px);
}

.event-btn:disabled {
    background: var(--text-light);
    cursor: not-allowed;
    transform: none;
}

/* Featured Event */
.featured-event {
    background: white;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
    margin-bottom: 4rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
    position: relative;
}

.featured-badge {
    position: absolute;
    top: 2rem;
    left: 2rem;
    background: var(--accent-color);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-weight: 700;
    font-size: 0.9rem;
    z-index: 2;
}

.featured-image {
    background: var(--gradient);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.featured-image::after {
    content: '🌟';
    font-size: 6rem;
    opacity: 0.8;
}

.featured-content {
    padding: 3rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.featured-title {
    font-size: 2rem;
    font-weight: 800;
    margin-bottom: 1rem;
    color: var(--text-dark);
}

.featured-description {
    font-size: 1.1rem;
    color: var(--text-light);
    line-height: 1.6;
    margin-bottom: 2rem;
}

.featured-details {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    margin-bottom: 2rem;
}

.featured-btn {
    background: var(--accent-color);
    color: white;
    padding: 1rem 2rem;
    border-radius: 50px;
    text-decoration: none;
    font-weight: 700;
    font-size: 1.1rem;
    transition: all 0.3s ease;
    text-align: center;
    box-shadow: 0 10px 30px rgba(245, 158, 11, 0.3);
}

.featured-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(245, 158, 11, 0.4);
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
    .events-grid {
        grid-template-columns: 1fr;
    }

    .featured-event {
        grid-template-columns: 1fr;
    }

    .featured-content {
        padding: 2rem;
    }

    .featured-details {
        grid-template-columns: 1fr;
    }

    .filter-content {
        justify-content: center;
    }

    .event-footer {
        flex-direction: column;
        align-items: stretch;
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

/* Loading States */
.loading {
    text-align: center;
    padding: 3rem;
    color: var(--text-light);
}
</style>
