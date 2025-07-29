<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const eventId = ref(route.params.id);

// FAQ Toggle
function toggleFAQ(element: HTMLElement) {
    const faqItem = element.parentElement;
    const isActive = faqItem?.classList.contains('active');

    // Close all FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });

    // Open clicked item if it wasn't active
    if (!isActive && faqItem) {
        faqItem.classList.add('active');
    }
}

// Registration handler
function handleRegistration() {
    alert('Registration system would integrate with your payment processor here. For demo purposes, this would redirect to a secure checkout page.');
}

// Add to Calendar functionality
function addToCalendar() {
    const event = {
        title: 'Master Goal Setting Workshop',
        start: '2024-04-15T09:00:00',
        end: '2024-04-16T17:00:00',
        location: 'Denver Convention Center, 700 14th Street, Denver, CO 80202',
        description: 'A comprehensive 2-day intensive workshop designed to transform how you approach and achieve your most important goals.'
    };

    // Create Google Calendar URL
    const startDate = event.start.replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const endDate = event.end.replace(/[-:]/g, '').replace(/\.\d{3}/, '');

    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDate}/${endDate}&location=${encodeURIComponent(event.location)}&details=${encodeURIComponent(event.description)}`;

    // Create Outlook URL
    const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(event.title)}&startdt=${event.start}&enddt=${event.end}&location=${encodeURIComponent(event.location)}&body=${encodeURIComponent(event.description)}`;

    // Show options
    const choice = confirm('Add to Google Calendar? (OK for Google, Cancel for Outlook)');
    if (choice) {
        window.open(googleUrl, '_blank');
    } else {
        window.open(outlookUrl, '_blank');
    }
}

// Initialize map (placeholder)
function initMap() {
    // In a real implementation, you would use Google Maps API or similar
    const mapContainer = document.getElementById('mapContainer');
    if (mapContainer) {
        mapContainer.innerHTML = `
            <div style="width: 100%; height: 100%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; text-align: center; border-radius: 12px;">
                <div>
                    <div style="font-size: 3rem; margin-bottom: 1rem;">📍</div>
                    <div style="font-weight: 600;">Denver Convention Center</div>
                    <div style="opacity: 0.9; font-size: 0.9rem;">700 14th Street, Denver, CO</div>
                </div>
            </div>
        `;
    }
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
    initMap();
});
</script>

<template>
    <section class="breadcrumb">
        <div class="breadcrumb-content">
            <router-link to="/">Home</router-link> → <router-link to="/events">Events</router-link> → Master Goal Setting Workshop
        </div>
    </section>

    <section class="event-hero">
        <div class="event-hero-content">
            <div class="event-main-info">
                <div class="event-status-badge">Available - Limited Spots</div>
                <h1>Master Goal Setting Workshop</h1>
                <p class="event-subtitle">A comprehensive 2-day intensive workshop designed to transform how you approach and achieve your most important goals</p>

                <div class="event-quick-info">
                    <div class="quick-info-item">
                        <div class="quick-info-icon">📅</div>
                        <div class="quick-info-text">
                            <h4>Date & Time</h4>
                            <p>April 15-16, 2024<br>9:00 AM - 5:00 PM</p>
                        </div>
                    </div>
                    <div class="quick-info-item">
                        <div class="quick-info-icon">📍</div>
                        <div class="quick-info-text">
                            <h4>Location</h4>
                            <p>Denver Convention Center<br>Denver, CO</p>
                        </div>
                    </div>
                    <div class="quick-info-item">
                        <div class="quick-info-icon">👥</div>
                        <div class="quick-info-text">
                            <h4>Capacity</h4>
                            <p>Limited to 50 participants<br>12 spots remaining</p>
                        </div>
                    </div>
                    <div class="quick-info-item">
                        <div class="quick-info-icon">⭐</div>
                        <div class="quick-info-text">
                            <h4>Level</h4>
                            <p>All levels welcome<br>Materials included</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="registration-card">
                <div class="price-section">
                    <div class="price">$299</div>
                    <p class="price-subtitle">Early bird pricing ends April 1st</p>
                </div>

                <button class="register-btn" @click="handleRegistration">Register Now</button>
                <button class="calendar-btn" @click="addToCalendar">📅 Add to Calendar</button>

                <ul class="registration-features">
                    <li>2-day comprehensive workshop</li>
                    <li>Personal goal-setting workbook</li>
                    <li>Networking lunch included</li>
                    <li>Follow-up resources</li>
                    <li>Certificate of completion</li>
                    <li>30-day email support</li>
                </ul>
            </div>
        </div>
    </section>

    <main class="event-content">
        <div class="main-content">
            <div class="content-section fade-in">
                <h2>About This Workshop</h2>
                <p>Join us for an transformative 2-day journey that will revolutionize how you approach goal setting and achievement. This intensive workshop combines cutting-edge research in psychology and neuroscience with practical, actionable strategies you can implement immediately.</p>

                <p>Whether you're looking to advance your career, improve your health, strengthen relationships, or pursue personal passions, this workshop will give you the tools and mindset to turn your dreams into reality. You'll leave with a clear, actionable plan and the confidence to achieve what matters most to you.</p>

                <p>Our proven methodology has helped thousands of participants achieve breakthrough results. Don't just set goals—master the art and science of achieving them.</p>
            </div>

            <div class="content-section fade-in">
                <h2>Workshop Agenda</h2>
                <ul class="agenda-list">
                    <li class="agenda-item">
                        <div class="agenda-time">9:00 AM</div>
                        <div class="agenda-content">
                            <h4>Welcome & Vision Setting</h4>
                            <p>Introduction, networking, and defining your workshop goals</p>
                        </div>
                    </li>
                    <li class="agenda-item">
                        <div class="agenda-time">10:00 AM</div>
                        <div class="agenda-content">
                            <h4>The Science of Goal Achievement</h4>
                            <p>Understanding the psychology and neuroscience behind successful goal setting</p>
                        </div>
                    </li>
                    <li class="agenda-item">
                        <div class="agenda-time">11:30 AM</div>
                        <div class="agenda-content">
                            <h4>SMART Goals 2.0</h4>
                            <p>Advanced framework beyond traditional SMART goals</p>
                        </div>
                    </li>
                    <li class="agenda-item">
                        <div class="agenda-time">12:30 PM</div>
                        <div class="agenda-content">
                            <h4>Networking Lunch</h4>
                            <p>Connect with like-minded achievers while enjoying lunch</p>
                        </div>
                    </li>
                    <li class="agenda-item">
                        <div class="agenda-time">1:30 PM</div>
                        <div class="agenda-content">
                            <h4>Overcoming Obstacles</h4>
                            <p>Identifying and planning for common roadblocks</p>
                        </div>
                    </li>
                    <li class="agenda-item">
                        <div class="agenda-time">3:00 PM</div>
                        <div class="agenda-content">
                            <h4>Personal Action Planning</h4>
                            <p>Create your personalized 90-day success blueprint</p>
                        </div>
                    </li>
                    <li class="agenda-item">
                        <div class="agenda-time">4:30 PM</div>
                        <div class="agenda-content">
                            <h4>Accountability Systems</h4>
                            <p>Building support systems and tracking mechanisms</p>
                        </div>
                    </li>
                </ul>
            </div>

            <div class="content-section fade-in">
                <h2>What You'll Learn</h2>
                <p><strong>Day 1 focuses on foundation building:</strong> You'll discover the psychological principles that separate successful goal achievers from dreamers, learn advanced goal-setting frameworks, and begin crafting your personal success blueprint.</p>

                <p><strong>Day 2 is all about implementation:</strong> We'll dive deep into obstacle management, accountability systems, and creating sustainable habits that support your goals. You'll leave with a concrete 90-day action plan.</p>

                <p>Key learning outcomes include:</p>
                <ul style="margin: 1rem 0; padding-left: 2rem; color: var(--text-light);">
                    <li>Advanced goal-setting methodologies beyond SMART goals</li>
                    <li>Neuroscience-based techniques for motivation and persistence</li>
                    <li>Systems for tracking progress and maintaining momentum</li>
                    <li>Strategies for overcoming procrastination and self-doubt</li>
                    <li>Building powerful accountability partnerships</li>
                    <li>Creating environments that support your success</li>
                </ul>
            </div>

            <div class="content-section fade-in">
                <h2>Frequently Asked Questions</h2>

                <div class="faq-item">
                    <div class="faq-question" @click="toggleFAQ($event.currentTarget as HTMLElement)">
                        What should I bring to the workshop?
                        <span class="faq-toggle">▼</span>
                    </div>
                    <div class="faq-answer">
                        Just bring yourself and an open mind! We provide all materials including a comprehensive workbook, writing materials, and reference guides. You'll also receive digital resources to take home.
                    </div>
                </div>

                <div class="faq-item">
                    <div class="faq-question" @click="toggleFAQ($event.currentTarget as HTMLElement)">
                        Is this workshop suitable for beginners?
                        <span class="faq-toggle">▼</span>
                    </div>
                    <div class="faq-answer">
                        Absolutely! This workshop is designed for people at all levels of goal-setting experience. Whether you're just starting your journey or looking to refine your approach, you'll find valuable insights and strategies.
                    </div>
                </div>

                <div class="faq-item">
                    <div class="faq-question" @click="toggleFAQ($event.currentTarget as HTMLElement)">
                        What's included in the price?
                        <span class="faq-toggle">▼</span>
                    </div>
                    <div class="faq-answer">
                        Your registration includes the full 2-day workshop, comprehensive workbook, all materials, networking lunch on both days, certificate of completion, and 30 days of follow-up email support.
                    </div>
                </div>

                <div class="faq-item">
                    <div class="faq-question" @click="toggleFAQ($event.currentTarget as HTMLElement)">
                        What's your cancellation policy?
                        <span class="faq-toggle">▼</span>
                    </div>
                    <div class="faq-answer">
                        Full refund available up to 14 days before the event. Within 14 days, we offer a 50% refund or credit toward a future workshop. No refunds within 48 hours of the event start time.
                    </div>
                </div>
            </div>
        </div>

        <aside class="sidebar">
            <div class="instructor-card fade-in">
                <div class="instructor-avatar">👨‍🏫</div>
                <h3>Dr. Sarah Mitchell</h3>
                <p class="instructor-title">Lead Facilitator</p>
                <p class="instructor-bio">
                    Dr. Mitchell is a renowned psychology professor and goal achievement expert with over 15 years of experience helping individuals and organizations reach their potential. She's the author of three bestselling books on personal development.
                </p>
            </div>

            <div class="map-section fade-in">
                <h3>Venue & Location</h3>
                <div class="venue-info">
                    <h4>Denver Convention Center</h4>
                    <p>700 14th Street<br>Denver, CO 80202</p>
                    <p>Conference Room A-1</p>
                </div>

                <div class="map-container" id="mapContainer">
                    <div class="map-placeholder">
                        <p>🗺️ Interactive Map</p>
                        <p style="font-size: 0.9rem;">Loading map...</p>
                    </div>
                </div>

                <a href="https://www.google.com/maps/dir//Denver+Convention+Center,+700+14th+St,+Denver,+CO+80202" target="_blank" class="directions-btn">Get Directions</a>
            </div>

            <div class="sidebar-section" style="background: white; border-radius: 15px; padding: 2rem; box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);">
                <h3 style="margin-bottom: 1rem; color: var(--text-dark);">Need Help?</h3>
                <p style="color: var(--text-light); margin-bottom: 1rem; font-size: 0.95rem;">Have questions about this workshop? We're here to help!</p>
                <p style="margin-bottom: 0.5rem;"><strong>Email:</strong> <a href="mailto:events@gthere.net" style="color: var(--primary-color);">events@gthere.net</a></p>
                <p><strong>Phone:</strong> <a href="tel:+1234567890" style="color: var(--primary-color);">(123) 456-7890</a></p>
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
    --success-color: #10b981;
    --warning-color: #f59e0b;
}

/* Breadcrumb */
.breadcrumb {
    background: white;
    padding: 1rem 0;
    margin-top: 80px;
    border-bottom: 1px solid #e5e7eb;
}

.breadcrumb-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--text-light);
}

.breadcrumb a {
    color: var(--primary-color);
    text-decoration: none;
}

.breadcrumb a:hover {
    text-decoration: underline;
}

/* Event Hero */
.event-hero {
    background: white;
    padding: 3rem 0;
}

.event-hero-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 4rem;
    align-items: start;
}

.event-main-info h1 {
    font-size: 3rem;
    font-weight: 800;
    margin-bottom: 1rem;
    color: var(--text-dark);
    line-height: 1.2;
}

.event-subtitle {
    font-size: 1.2rem;
    color: var(--text-light);
    margin-bottom: 2rem;
}

.event-status-badge {
    display: inline-block;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-weight: 700;
    font-size: 0.9rem;
    margin-bottom: 2rem;
    background: var(--success-color);
    color: white;
}

.event-quick-info {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.quick-info-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: var(--bg-light);
    border-radius: 12px;
}

.quick-info-icon {
    width: 40px;
    height: 40px;
    background: var(--primary-color);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.2rem;
}

.quick-info-text h4 {
    font-weight: 600;
    margin-bottom: 0.25rem;
    color: var(--text-dark);
}

.quick-info-text p {
    color: var(--text-light);
    font-size: 0.9rem;
}

/* Registration Card */
.registration-card {
    background: white;
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 120px;
}

.price-section {
    text-align: center;
    margin-bottom: 2rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid #e5e7eb;
}

.price {
    font-size: 3rem;
    font-weight: 800;
    color: var(--text-dark);
    margin-bottom: 0.5rem;
}

.price-subtitle {
    color: var(--text-light);
    font-size: 0.9rem;
}

.register-btn {
    width: 100%;
    background: var(--accent-color);
    color: white;
    padding: 1rem 2rem;
    border-radius: 50px;
    text-decoration: none;
    font-weight: 700;
    font-size: 1.1rem;
    transition: all 0.3s ease;
    text-align: center;
    display: block;
    margin-bottom: 1rem;
    border: none;
    cursor: pointer;
    box-shadow: 0 10px 30px rgba(245, 158, 11, 0.3);
}

.register-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(245, 158, 11, 0.4);
}

.calendar-btn {
    width: 100%;
    background: var(--primary-color);
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 25px;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;
    text-align: center;
    display: block;
    margin-bottom: 2rem;
    border: none;
    cursor: pointer;
}

.calendar-btn:hover {
    background: var(--secondary-color);
    transform: translateY(-2px);
}

.registration-features {
    list-style: none;
}

.registration-features li {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
    color: var(--text-dark);
}

.registration-features li::before {
    content: '✓';
    background: var(--success-color);
    color: white;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    font-weight: bold;
}

/* Main Content */
.event-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 4rem 2rem;
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 4rem;
}

.content-section {
    margin-bottom: 3rem;
}

.content-section h2 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    color: var(--text-dark);
}

.content-section p {
    margin-bottom: 1rem;
    line-height: 1.7;
    color: var(--text-light);
}

.agenda-list {
    list-style: none;
    margin-bottom: 2rem;
}

.agenda-item {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
    padding: 1.5rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.agenda-time {
    font-weight: 700;
    color: var(--primary-color);
    min-width: 80px;
}

.agenda-content h4 {
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: var(--text-dark);
}

.agenda-content p {
    color: var(--text-light);
    font-size: 0.95rem;
}

.instructor-card {
    background: white;
    border-radius: 15px;
    padding: 2rem;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
    text-align: center;
    margin-bottom: 2rem;
}

.instructor-avatar {
    width: 100px;
    height: 100px;
    background: var(--gradient);
    border-radius: 50%;
    margin: 0 auto 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    color: white;
}

.instructor-card h3 {
    font-size: 1.3rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: var(--text-dark);
}

.instructor-title {
    color: var(--primary-color);
    font-weight: 600;
    margin-bottom: 1rem;
}

.instructor-bio {
    color: var(--text-light);
    line-height: 1.6;
    font-size: 0.95rem;
}

/* Map Section */
.map-section {
    background: white;
    border-radius: 15px;
    padding: 2rem;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
    margin-bottom: 2rem;
}

.map-section h3 {
    font-size: 1.3rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: var(--text-dark);
}

.venue-info {
    margin-bottom: 1.5rem;
}

.venue-info h4 {
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: var(--text-dark);
}

.venue-info p {
    color: var(--text-light);
    font-size: 0.95rem;
    margin-bottom: 0.5rem;
}

.map-container {
    width: 100%;
    height: 300px;
    border-radius: 12px;
    overflow: hidden;
    position: relative;
    background: var(--bg-light);
    display: flex;
    align-items: center;
    justify-content: center;
}

.map-placeholder {
    text-align: center;
    color: var(--text-light);
}

.directions-btn {
    width: 100%;
    background: var(--primary-color);
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 25px;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;
    text-align: center;
    display: block;
    margin-top: 1rem;
}

.directions-btn:hover {
    background: var(--secondary-color);
    transform: translateY(-2px);
}

/* FAQ Section */
.faq-item {
    background: white;
    border-radius: 12px;
    margin-bottom: 1rem;
    overflow: hidden;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.faq-question {
    padding: 1.5rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--text-dark);
}

.faq-question:hover {
    background: var(--bg-light);
}

.faq-answer {
    padding: 0 1.5rem 1.5rem;
    color: var(--text-light);
    line-height: 1.6;
    display: none;
}

.faq-item.active .faq-answer {
    display: block;
}

.faq-toggle {
    transition: transform 0.3s ease;
}

.faq-item.active .faq-toggle {
    transform: rotate(180deg);
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
    .event-hero-content {
        grid-template-columns: 1fr;
        gap: 2rem;
    }

    .event-main-info h1 {
        font-size: 2rem;
    }

    .event-quick-info {
        grid-template-columns: 1fr;
    }

    .event-content {
        grid-template-columns: 1fr;
        gap: 2rem;
    }

    .registration-card {
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
