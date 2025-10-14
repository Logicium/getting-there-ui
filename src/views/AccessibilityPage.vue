<script setup lang="ts">
import { onMounted } from 'vue';

function observeFadeElements() {
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
}

onMounted(() => {
  observeFadeElements();
});
</script>

<template>
  <section class="accessibility-hero">
    <div class="accessibility-hero-content">
      <div class="hero-badge">Accessible for Everyone</div>
      <h1>Accessibility Statement</h1>
      <p>
        Getting There is committed to ensuring digital accessibility for people of all abilities. We continuously work to improve the user experience for everyone.
      </p>
      <p class="last-updated">Last Updated: January 15, 2025</p>
    </div>
  </section>

  <main class="accessibility-content">
    <section class="content-section fade-in">
      <h2>Our Commitment to Accessibility</h2>
      <p>
        Getting There believes that mental health and wellness resources should be accessible to everyone, regardless of ability. We are committed to providing a website and digital services that are accessible to the widest possible audience, in accordance with the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards.
      </p>
      <p>
        Accessibility is an ongoing effort, and we continuously strive to improve the accessibility of our platform as technology evolves and standards develop.
      </p>
    </section>

    <section class="content-section fade-in">
      <h2>Accessibility Features</h2>
      <p>Our website includes the following accessibility features:</p>

      <h3>Screen Reader Compatibility</h3>
      <ul>
        <li>Semantic HTML structure for proper navigation</li>
        <li>Descriptive alt text for all meaningful images</li>
        <li>ARIA labels and landmarks for complex components</li>
        <li>Skip navigation links to bypass repetitive content</li>
        <li>Logical heading hierarchy throughout the site</li>
      </ul>

      <h3>Keyboard Navigation</h3>
      <ul>
        <li>All interactive elements are keyboard accessible</li>
        <li>Visible focus indicators on interactive elements</li>
        <li>Logical tab order throughout the site</li>
        <li>Keyboard shortcuts clearly documented where available</li>
      </ul>

      <h3>Visual Design</h3>
      <ul>
        <li>High contrast text and background colors (minimum 4.5:1 ratio)</li>
        <li>Text remains readable when zoomed up to 200%</li>
        <li>Responsive design that adapts to different screen sizes</li>
        <li>No information conveyed by color alone</li>
        <li>Clear, readable fonts at appropriate sizes</li>
      </ul>

      <h3>Multimedia Content</h3>
      <ul>
        <li>Media players have accessible controls</li>
        <li>Auto-playing content can be paused or stopped</li>
      </ul>

      <h3>Forms and Interactive Elements</h3>
      <ul>
        <li>All form fields have descriptive labels</li>
        <li>Error messages are clear and provide guidance</li>
        <li>Required fields are clearly marked</li>
        <li>Form validation is accessible to screen readers</li>
      </ul>
    </section>

    <section class="content-section fade-in">
      <h2>Assistive Technology Compatibility</h2>
      <p>Our website is designed to be compatible with the following assistive technologies:</p>
      <ul>
        <li>Screen readers (JAWS, NVDA, VoiceOver, TalkBack)</li>
        <li>Screen magnification software</li>
        <li>Speech recognition software</li>
        <li>Alternative input devices</li>
        <li>Browser accessibility features and extensions</li>
      </ul>
      <p>We test our website with multiple screen readers and browsers to ensure broad compatibility.</p>
    </section>

    <section class="content-section fade-in">
      <h2>Physical Program Accessibility</h2>
      <p>In addition to our digital accessibility efforts, we ensure our in-person programs are accessible:</p>
      <ul>
        <li>All venues are wheelchair accessible with accessible parking</li>
        <li>Service animals are welcome at all events</li>
        <li>ASL interpretation available upon request (72-hour notice)</li>
        <li>Materials available in large print or alternative formats upon request</li>
        <li>Quiet spaces available during workshops for sensory needs</li>
        <li>Fragrance-free environment policies at our facilities</li>
      </ul>
      <p>
        If you require specific accommodations for any of our programs or events, please contact us at least 72 hours in advance at accessibility@gthere.net or (123) 456-7890.
      </p>
    </section>

    <section class="content-section fade-in">
      <h2>Third-Party Content and Services</h2>
      <p>
        Our website may contain links to third-party websites and services. While we strive to link only to accessible content, we cannot guarantee the accessibility of external sites. If you encounter accessibility barriers on linked content that is essential to our services, please contact us so we can provide alternative access.
      </p>
    </section>

    <section class="content-section fade-in">
      <h2>Known Limitations</h2>
      <p>Despite our best efforts, some content on our website may not yet be fully accessible. We are aware of the following limitations and are actively working to address them:</p>
      <ul>
        <li>Some older video content may not yet have complete captions</li>
        <li>Certain PDF documents may not be fully tagged for accessibility</li>
        <li>Some third-party embedded content may have accessibility barriers</li>
      </ul>
      <p>
        We are committed to remediating these issues as quickly as possible. If you need content in an alternative format, please contact us and we will provide it within 3 business days.
      </p>
    </section>

    <section class="content-section fade-in">
      <h2>Ongoing Accessibility Efforts</h2>
      <p>We are committed to continuous improvement of accessibility through:</p>
      <ul>
        <li>Regular accessibility audits by third-party experts</li>
        <li>Staff training on accessibility best practices</li>
        <li>Automated accessibility testing integrated into our development process</li>
        <li>User testing with people who use assistive technologies</li>
        <li>Staying current with WCAG guidelines and emerging standards</li>
        <li>Incorporating user feedback into accessibility improvements</li>
      </ul>
    </section>

    <section class="content-section fade-in">
      <h2>Feedback and Contact Information</h2>
      <p>
        We welcome your feedback on the accessibility of our website and services. If you encounter an accessibility barrier, have suggestions for improvement, or need assistance accessing any content, please contact us:
      </p>
      <div class="contact-card">
        <p><strong>Accessibility Coordinator</strong></p>
        <p>📧 Email: gettingthere@gthere.net</p>
        <p>📍 Address: Trinidad, Colorado, United States</p>
        <p class="response-time">We aim to respond to accessibility feedback within 2 business days.</p>
      </div>
    </section>

    <section class="content-section fade-in">
      <h2>Formal Complaints</h2>
      <p>
        If you wish to file a formal complaint regarding accessibility, please contact our accessibility coordinator using the information above. We will investigate all complaints and provide a written response within 10 business days.
      </p>
      <p>
        If you are not satisfied with our response, you may file a complaint with the U.S. Department of Justice or your local civil rights enforcement agency.
      </p>
    </section>

    <div class="closing-message fade-in">
      <p>
        <strong>💚 Accessibility is a Journey, Not a Destination</strong><br />
        We recognize that accessibility is an ongoing process. Thank you for helping us create a more inclusive experience for everyone.
      </p>
    </div>
  </main>
</template>

<style scoped lang="scss">
@import '../assets/common';

.accessibility-hero {
  @extend .hero-base;
  background: var(--gradient);
  color: white;
  min-height: 40vh;
  text-align: center;
}

.accessibility-hero-content {
  @extend .hero-content-base;
  max-width: 900px;
}

.last-updated {
  font-size: 0.9rem;
  opacity: 0.8;
  margin-top: 1rem;
}

.accessibility-content {
  max-width: 900px;
  margin: 0 auto;
  padding: 4rem 2rem;
}

.content-section {
  margin-bottom: 3rem;

  h2 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    color: var(--text-dark);
  }

  h3 {
    font-size: 1.4rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: var(--primary-color);
    margin-top: 2rem;
  }

  p {
    color: var(--text-light);
    line-height: 1.8;
    margin-bottom: 1rem;
  }

  ul {
    color: var(--text-light);
    line-height: 1.8;
    margin-bottom: 1.5rem;
    padding-left: 2rem;

    li {
      margin-bottom: 0.5rem;
    }
  }
}

.contact-card {
  background: var(--bg-light);
  padding: 2rem;
  border-radius: 15px;
  border: 1px solid var(--border-light);
  margin-top: 1.5rem;

  p {
    margin-bottom: 0.5rem;
    color: var(--text-light);

    &:first-child {
      color: var(--text-dark);
      font-weight: 600;
      margin-bottom: 1rem;
    }

    &.response-time {
      margin-top: 1rem;
      margin-bottom: 0;
      font-size: 0.9rem;
      font-style: italic;
    }
  }
}

.closing-message {
  background: linear-gradient(135deg, rgba(74, 124, 89, 0.1) 0%, rgba(127, 166, 80, 0.1) 100%);
  padding: 2rem;
  border-radius: 15px;
  border: 1px solid rgba(74, 124, 89, 0.2);
  text-align: center;
  margin-top: 3rem;

  p {
    margin: 0;
    color: var(--text-dark);
    font-size: 1rem;
    line-height: 1.6;
  }
}
</style>