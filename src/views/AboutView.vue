<script setup lang="ts">
import { onMounted } from 'vue';

// Animation observers
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

    // Observe all animated elements
    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
        observer.observe(el);
    });

    // Counter animation for stats
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');

        counters.forEach(counter => {
            if (!counter.textContent) return;
            const target = parseInt(counter.textContent.replace(/\D/g, ''));
            const suffix = counter.textContent.replace(/\d/g, '');
            let current = 0;
            const increment = target / 50;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.textContent = target + suffix;
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.ceil(current) + suffix;
                }
            }, 50);
        });
    }

    // Start counter animation when hero section is visible
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(animateCounters, 1000);
                heroObserver.disconnect();
            }
        });
    });

    const heroElement = document.querySelector('.about-hero');
    if (heroElement) {
        heroObserver.observe(heroElement);
    }
});
</script>

<template>
    <section class="about-hero">
        <div class="about-hero-content">
            <div class="hero-text">
                <h1>We Help Dreams Become Reality</h1>
                <p>For over a decade, Getting There has been empowering individuals to bridge the gap between where they are and where they want to be. Our proven methodologies and compassionate guidance have helped thousands achieve their most important goals.</p>

                <div class="hero-stats">
                    <div class="stat-item">
                        <span class="stat-number">10K+</span>
                        <span class="stat-label">Lives Transformed</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">15+</span>
                        <span class="stat-label">Years Experience</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">92%</span>
                        <span class="stat-label">Success Rate</span>
                    </div>
                </div>
            </div>

            <div class="hero-visual">
                <div class="visual-circle"></div>
                <div class="visual-circle"></div>
                <div class="visual-circle"></div>
                <div class="visual-center">🎯</div>
            </div>
        </div>
    </section>

    <main class="about-content">

        <!-- Our Story Section -->
        <section class="section">
            <h2 class="section-title fade-in">Our Story</h2>
            <div class="story-content">
                <div class="story-text slide-in-left">
                    <p>Getting There was born from a simple yet powerful realization: most people don't fail because they lack ambition or dreams—they fail because they lack the right strategies, support systems, and mindset to turn those dreams into reality.</p>

                    <p>Founded in 2010 by a team of psychologists, coaches, and successful entrepreneurs, we set out to create a comprehensive approach to goal achievement that addresses not just the "what" and "when" of goals, but the crucial "how" and "why."</p>

                    <p>What started as a small workshop series in Colorado has grown into a recognized leader in personal development, but our core mission remains unchanged: to provide practical, research-based strategies that help people achieve meaningful progress in their lives.</p>

                    <p>Today, we're proud to have helped over 10,000 individuals and hundreds of organizations reach their potential through our workshops, coaching programs, and resources.</p>
                </div>
                <div class="story-visual slide-in-right">
                    📈
                </div>
            </div>
        </section>

        <!-- Mission Section -->
        <section class="section">
            <div class="mission-section fade-in">
                <h2 class="section-title">Our Mission</h2>
                <p class="mission-text">
                    To empower individuals with the knowledge, tools, and support they need to transform their aspirations into achievements. We believe everyone deserves to live a life aligned with their values and filled with meaningful accomplishments.
                </p>

                <div class="mission-values">
                    <div class="value-item">
                        <div class="value-icon">🎯</div>
                        <h3 class="value-title">Purpose-Driven</h3>
                        <p class="value-description">We help you identify and pursue goals that truly matter, ensuring your efforts align with your deepest values and aspirations.</p>
                    </div>
                    <div class="value-item">
                        <div class="value-icon">🔬</div>
                        <h3 class="value-title">Evidence-Based</h3>
                        <p class="value-description">Our methods are grounded in scientific research from psychology, neuroscience, and behavioral economics to ensure maximum effectiveness.</p>
                    </div>
                    <div class="value-item">
                        <div class="value-icon">🤝</div>
                        <h3 class="value-title">Supportive Community</h3>
                        <p class="value-description">We foster a community of achievers who support, challenge, and celebrate each other's progress on the journey to success.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Team Section -->
        <section class="section">
            <h2 class="section-title fade-in">Meet Our Team</h2>
            <div class="team-grid">
                <div class="team-member fade-in">
                    <div class="member-avatar">👩‍🎓</div>
                    <h3 class="member-name">Dr. Sarah Mitchell</h3>
                    <p class="member-role">Founder & Lead Coach</p>
                    <p class="member-bio">With a PhD in Psychology and 20 years of coaching experience, Sarah developed the Getting There methodology that has transformed thousands of lives. She's the author of three bestselling books on goal achievement.</p>
                    <div class="member-social">
                        <a href="#" class="social-link">📧</a>
                        <a href="#" class="social-link">💼</a>
                        <a href="#" class="social-link">🐦</a>
                    </div>
                </div>

                <div class="team-member fade-in">
                    <div class="member-avatar">👨‍💼</div>
                    <h3 class="member-name">Michael Chen</h3>
                    <p class="member-role">Workshop Director</p>
                    <p class="member-bio">Former Fortune 500 executive turned transformation specialist, Michael brings 15 years of corporate leadership experience to help professionals achieve career and business goals.</p>
                    <div class="member-social">
                        <a href="#" class="social-link">📧</a>
                        <a href="#" class="social-link">💼</a>
                        <a href="#" class="social-link">🐦</a>
                    </div>
                </div>

                <div class="team-member fade-in">
                    <div class="member-avatar">👩‍🏫</div>
                    <h3 class="member-name">Lisa Rodriguez</h3>
                    <p class="member-role">Program Manager</p>
                    <p class="member-bio">With a background in education and program development, Lisa ensures our workshops and resources deliver maximum value. She's passionate about creating inclusive learning environments.</p>
                    <div class="member-social">
                        <a href="#" class="social-link">📧</a>
                        <a href="#" class="social-link">💼</a>
                        <a href="#" class="social-link">🐦</a>
                    </div>
                </div>
            </div>
        </section>

        <!-- Our Approach Section -->
        <section class="section">
            <h2 class="section-title fade-in">Our Approach</h2>
            <div class="approach-grid">
                <div class="approach-item fade-in">
                    <div class="approach-number">01</div>
                    <h3 class="approach-title">Clarity First</h3>
                    <p class="approach-description">We help you get crystal clear on what you really want and why it matters. Without clarity, even the best strategies fall short. We dig deep to uncover your authentic aspirations and align them with your values.</p>
                </div>

                <div class="approach-item fade-in">
                    <div class="approach-number">02</div>
                    <h3 class="approach-title">Strategic Planning</h3>
                    <p class="approach-description">Dreams without plans remain wishes. We teach you how to break down ambitious goals into manageable milestones, create realistic timelines, and anticipate obstacles before they derail your progress.</p>
                </div>

                <div class="approach-item fade-in">
                    <div class="approach-number">03</div>
                    <h3 class="approach-title">Mindset Mastery</h3>
                    <p class="approach-description">Success is as much about psychology as strategy. We address limiting beliefs, build resilience, and cultivate the mental frameworks that separate achievers from dreamers.</p>
                </div>

                <div class="approach-item fade-in">
                    <div class="approach-number">04</div>
                    <h3 class="approach-title">Accountability & Support</h3>
                    <p class="approach-description">Sustainable change happens in community. Our programs include ongoing support, accountability partnerships, and access to a network of like-minded individuals on similar journeys.</p>
                </div>
            </div>
        </section>

        <!-- CTA Section -->
        <div class="cta-section fade-in">
            <h2>Ready to Start Getting There?</h2>
            <p>Join thousands of others who have transformed their lives with our proven approach. Your journey to achievement starts with a single step.</p>
            <div class="cta-buttons">
                <router-link to="/events" class="cta-btn">View Upcoming Events</router-link>
                <a href="mailto:gettingthere@gthere.net" class="cta-btn secondary">Get In Touch</a>
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
}

/* Hero Section */
.about-hero {
    padding: 8rem 0 4rem;
    background: var(--gradient);
    color: white;
    position: relative;
    overflow: hidden;
}

.about-hero::before {
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

.about-hero-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
    position: relative;
    z-index: 2;
}

.hero-text h1 {
    font-size: clamp(2.5rem, 6vw, 4rem);
    font-weight: 800;
    margin-bottom: 1.5rem;
    line-height: 1.2;
}

.hero-text p {
    font-size: 1.2rem;
    opacity: 0.9;
    margin-bottom: 2rem;
    line-height: 1.6;
}

.hero-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
}

.stat-item {
    text-align: center;
}

.stat-number {
    font-size: 2.5rem;
    font-weight: 800;
    display: block;
    margin-bottom: 0.5rem;
}

.stat-label {
    font-size: 0.9rem;
    opacity: 0.8;
}

.hero-visual {
    position: relative;
    height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.visual-circle {
    position: absolute;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    animation: pulse 4s ease-in-out infinite;
}

.visual-circle:nth-child(1) {
    width: 300px;
    height: 300px;
    animation-delay: 0s;
}

.visual-circle:nth-child(2) {
    width: 200px;
    height: 200px;
    animation-delay: 1s;
}

.visual-circle:nth-child(3) {
    width: 100px;
    height: 100px;
    animation-delay: 2s;
}

.visual-center {
    font-size: 4rem;
    position: relative;
    z-index: 3;
}

@keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 0.7; }
    50% { transform: scale(1.1); opacity: 0.3; }
}

/* Main Content */
.about-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 4rem 2rem;
}

.section {
    margin-bottom: 6rem;
}

.section-title {
    font-size: 2.5rem;
    font-weight: 700;
    text-align: center;
    margin-bottom: 3rem;
    color: var(--text-dark);
}

/* Our Story Section */
.story-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
}

.story-text {
    font-size: 1.1rem;
    line-height: 1.8;
    color: var(--text-light);
}

.story-text p {
    margin-bottom: 1.5rem;
}

.story-visual {
    background: var(--gradient);
    height: 400px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 5rem;
    position: relative;
    overflow: hidden;
}

.story-visual::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(1px);
}

/* Mission Section */
.mission-section {
    background: white;
    padding: 4rem;
    border-radius: 30px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
    text-align: center;
}

.mission-text {
    font-size: 1.3rem;
    line-height: 1.7;
    color: var(--text-light);
    max-width: 800px;
    margin: 0 auto 2rem;
}

.mission-values {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    margin-top: 3rem;
}

.value-item {
    padding: 2rem;
    background: var(--bg-light);
    border-radius: 15px;
    transition: all 0.3s ease;
}

.value-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.value-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.value-title {
    font-size: 1.2rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: var(--text-dark);
}

.value-description {
    color: var(--text-light);
    line-height: 1.5;
}

/* Team Section */
.team-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.team-member {
    background: white;
    border-radius: 20px;
    padding: 2rem;
    text-align: center;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
}

.team-member:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
}

.member-avatar {
    width: 120px;
    height: 120px;
    background: var(--gradient);
    border-radius: 50%;
    margin: 0 auto 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
    color: white;
}

.member-name {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: var(--text-dark);
}

.member-role {
    color: var(--primary-color);
    font-weight: 600;
    margin-bottom: 1rem;
}

.member-bio {
    color: var(--text-light);
    line-height: 1.6;
    margin-bottom: 1.5rem;
}

.member-social {
    display: flex;
    justify-content: center;
    gap: 1rem;
}

.social-link {
    width: 40px;
    height: 40px;
    background: var(--bg-light);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    transition: all 0.3s ease;
}

.social-link:hover {
    background: var(--primary-color);
    color: white;
    transform: translateY(-2px);
}

/* Approach Section */
.approach-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 3rem;
}

.approach-item {
    background: white;
    padding: 3rem;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
    position: relative;
    overflow: hidden;
}

.approach-item::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: var(--gradient);
}

.approach-number {
    font-size: 3rem;
    font-weight: 800;
    color: var(--primary-color);
    opacity: 0.2;
    position: absolute;
    top: 1rem;
    right: 2rem;
}

.approach-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: var(--text-dark);
}

.approach-description {
    color: var(--text-light);
    line-height: 1.6;
}

/* CTA Section */
.cta-section {
    background: var(--gradient);
    color: white;
    padding: 4rem;
    border-radius: 30px;
    text-align: center;
    margin-top: 4rem;
}

.cta-section h2 {
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 1rem;
}

.cta-section p {
    font-size: 1.2rem;
    opacity: 0.9;
    margin-bottom: 2rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
}

.cta-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
}

.cta-btn {
    background: var(--accent-color);
    color: white;
    padding: 1rem 2rem;
    border-radius: 50px;
    text-decoration: none;
    font-weight: 700;
    transition: all 0.3s ease;
    box-shadow: 0 10px 30px rgba(245, 158, 11, 0.3);
}

.cta-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(245, 158, 11, 0.4);
}

.cta-btn.secondary {
    background: transparent;
    border: 2px solid white;
    box-shadow: none;
}

.cta-btn.secondary:hover {
    background: white;
    color: var(--text-dark);
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
    .about-hero-content {
        grid-template-columns: 1fr;
        gap: 2rem;
        text-align: center;
    }

    .hero-stats {
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
    }

    .story-content {
        grid-template-columns: 1fr;
        gap: 2rem;
    }

    .mission-values {
        grid-template-columns: 1fr;
    }

    .approach-grid {
        grid-template-columns: 1fr;
    }

    .cta-buttons {
        flex-direction: column;
        align-items: center;
    }

    .section-title {
        font-size: 2rem;
    }

    .hero-text h1 {
        font-size: 2.5rem;
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

.slide-in-left {
    opacity: 0;
    transform: translateX(-50px);
    transition: all 0.6s ease;
}

.slide-in-left.visible {
    opacity: 1;
    transform: translateX(0);
}

.slide-in-right {
    opacity: 0;
    transform: translateX(50px);
    transition: all 0.6s ease;
}

.slide-in-right.visible {
    opacity: 1;
    transform: translateX(0);
}
</style>
