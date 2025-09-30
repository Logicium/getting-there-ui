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
  <section class="terms-hero">
    <div class="terms-hero-content">
      <div class="hero-badge">Legal Agreement</div>
      <h1>Terms of Service</h1>
      <p>
        Please read these terms carefully before using our services. By accessing or using Getting There, you agree to be bound by these terms.
      </p>
      <p class="last-updated">Last Updated: January 15, 2025</p>
    </div>
  </section>

  <main class="terms-content">
    <section class="content-section fade-in">
      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing or using the Getting There website, mobile applications, programs, resources, or any related services (collectively, the "Services"), you agree to comply with and be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Services.
      </p>
      <p>
        These Terms constitute a legally binding agreement between you and Getting There. We reserve the right to modify these Terms at any time, and your continued use of the Services after changes are posted constitutes acceptance of the modified Terms.
      </p>
    </section>

    <section class="content-section fade-in">
      <h2>2. Description of Services</h2>

      <h3>Educational and Supportive Services</h3>
      <p>Getting There provides educational resources, support groups, workshops, and wellness programs designed to promote mental health and personal growth. Our services include:</p>
      <ul>
        <li>Group support programs and workshops</li>
        <li>Digital resources including books, videos, and articles</li>
        <li>Educational content on mental health and wellness topics</li>
        <li>Community forums and peer support opportunities</li>
      </ul>

      <div class="warning-notice">
        <h4>⚠️ Important: Not Clinical Therapy</h4>
        <p>
          Our services are <strong>educational and supportive in nature</strong> and do not constitute clinical therapy, medical treatment, or professional mental health services. While facilitated by licensed professionals, our programs are designed to complement—not replace—individual therapy or psychiatric care. If you are experiencing a mental health crisis or need clinical treatment, please contact a licensed mental health provider or emergency services.
        </p>
      </div>
    </section>

    <section class="content-section fade-in">
      <h2>3. User Eligibility and Account Responsibilities</h2>

      <h3>Age Requirements</h3>
      <p>You must be at least 18 years old to use our Services. By using our Services, you represent that you meet this age requirement.</p>

      <h3>Account Security</h3>
      <p>When you create an account, you agree to:</p>
      <ul>
        <li>Provide accurate and complete information</li>
        <li>Maintain the security of your account credentials</li>
        <li>Notify us immediately of any unauthorized access</li>
        <li>Accept responsibility for all activities under your account</li>
        <li>Not share your account with others</li>
      </ul>
    </section>

    <section class="content-section fade-in">
      <h2>4. User Conduct and Community Guidelines</h2>
      <p>To maintain a safe and supportive environment, you agree not to:</p>
      <ul>
        <li>Harass, threaten, or harm other users</li>
        <li>Share confidential information disclosed in group sessions</li>
        <li>Provide medical or therapeutic advice to other users</li>
        <li>Post offensive, discriminatory, or inappropriate content</li>
        <li>Violate any applicable laws or regulations</li>
        <li>Impersonate others or misrepresent your identity</li>
        <li>Attempt to gain unauthorized access to our systems</li>
        <li>Use our Services for commercial purposes without permission</li>
        <li>Share or distribute our proprietary content without authorization</li>
      </ul>
      <p>Violation of these guidelines may result in suspension or termination of your account and access to our Services.</p>
    </section>

    <section class="content-section fade-in">
      <h2>5. Confidentiality and Privacy in Group Settings</h2>
      <p>Participants in our group programs agree to:</p>
      <ul>
        <li>Maintain confidentiality of information shared by others in group sessions</li>
        <li>Respect the privacy and boundaries of fellow participants</li>
        <li>Not record, photograph, or screenshot group sessions without explicit permission</li>
        <li>Understand that while we require confidentiality, we cannot guarantee that all participants will maintain it</li>
      </ul>
      <div class="info-notice">
        <p>
          <strong>Limits to Confidentiality:</strong> Facilitators are mandated reporters and must disclose information if there is an imminent risk of harm to self or others, suspected abuse or neglect, or as required by law.
        </p>
      </div>
    </section>

    <section class="content-section fade-in">
      <h2>6. Payment Terms and Refund Policy</h2>

      <h3>Fees and Payment</h3>
      <p>Certain Services require payment of fees. All fees are stated in US dollars and must be paid in advance. We accept payment through credit card, debit card, and other methods as indicated on our platform. By providing payment information, you authorize us to charge the applicable fees to your payment method.</p>

      <h3>Sliding Scale and Financial Assistance</h3>
      <p>We offer sliding scale fees and financial assistance for many programs. To inquire about adjusted rates, please contact our intake coordinator before registering.</p>

      <h3>Refund Policy</h3>
      <ul>
        <li><strong>Group Programs:</strong> Refunds are available if requested at least 48 hours before the first session. No refunds after the first session has occurred.</li>
        <li><strong>Digital Products:</strong> Digital books and resources are eligible for refund within 30 days of purchase if you are unsatisfied for any reason.</li>
        <li><strong>Workshops:</strong> Cancellations made 7+ days before the workshop date receive full refunds; 3-6 days receive 50% refund; less than 3 days are non-refundable.</li>
      </ul>
    </section>

    <section class="content-section fade-in">
      <h2>7. Intellectual Property Rights</h2>
      <p>
        All content provided through our Services, including but not limited to text, graphics, videos, audio, software, and materials, is owned by Getting There or our licensors and protected by copyright, trademark, and other intellectual property laws.
      </p>
      <p>
        You may access and use our content for personal, non-commercial purposes only. You may not reproduce, distribute, modify, create derivative works, publicly display, or otherwise exploit our content without our prior written permission.
      </p>
    </section>

    <section class="content-section fade-in">
      <h2>8. Disclaimers and Limitations of Liability</h2>

      <h3>No Medical Advice</h3>
      <p>The information and resources provided through our Services are for educational and informational purposes only. They do not constitute medical, psychiatric, or therapeutic advice. Always seek the advice of qualified health providers with questions regarding medical or mental health conditions.</p>

      <h3>Services "As Is"</h3>
      <p>Our Services are provided "as is" and "as available" without warranties of any kind, either express or implied. We do not guarantee that our Services will be uninterrupted, error-free, or free from viruses or other harmful components.</p>

      <h3>Limitation of Liability</h3>
      <p>To the fullest extent permitted by law, Getting There shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of our Services, even if we have been advised of the possibility of such damages. Our total liability shall not exceed the amount you paid to us in the six months preceding the claim.</p>
    </section>

    <section class="content-section fade-in">
      <h2>9. Termination</h2>
      <p>We reserve the right to suspend or terminate your access to our Services at any time, with or without notice, for violation of these Terms or for any other reason at our sole discretion. You may terminate your account at any time by contacting us at support@gthere.net. Upon termination, your right to use our Services will immediately cease.</p>
    </section>

    <section class="content-section fade-in">
      <h2>10. Indemnification</h2>
      <p>You agree to indemnify, defend, and hold harmless Getting There, its officers, directors, employees, and agents from any claims, liabilities, damages, losses, and expenses arising out of or related to your use of our Services, violation of these Terms, or violation of any rights of third parties.</p>
    </section>

    <section class="content-section fade-in">
      <h2>11. Governing Law and Dispute Resolution</h2>
      <p>These Terms shall be governed by and construed in accordance with the laws of the State of Colorado, United States, without regard to its conflict of law provisions. Any disputes arising from these Terms or your use of our Services shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association, except that either party may seek injunctive relief in court for infringement of intellectual property rights.</p>
    </section>

    <section class="content-section fade-in">
      <h2>12. Contact Information</h2>
      <p>If you have questions about these Terms of Service, please contact us:</p>
      <div class="contact-card">
        <p><strong>Getting There</strong></p>
        <p>📧 Email: legal@gthere.net</p>
        <p>📞 Phone: (123) 456-7890</p>
        <p>📍 Address: Cañon City, Colorado, United States</p>
      </div>
    </section>
  </main>
</template>

<style scoped lang="scss">
@import '../assets/common';

.terms-hero {
  @extend .hero-base;
  background: var(--gradient);
  color: white;
  min-height: 40vh;
  text-align: center;
}

.terms-hero-content {
  @extend .hero-content-base;
  max-width: 900px;
}

.last-updated {
  font-size: 0.9rem;
  opacity: 0.8;
  margin-top: 1rem;
}

.terms-content {
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

.warning-notice {
  background: rgba(231, 111, 81, 0.1);
  padding: 1.5rem;
  border-radius: 12px;
  border-left: 4px solid var(--warning-color);
  margin: 1.5rem 0;

  h4 {
    margin: 0 0 0.75rem 0;
    color: var(--text-dark);
    font-size: 1.1rem;
  }

  p {
    margin: 0;
    color: var(--text-dark);
    font-size: 0.95rem;
    line-height: 1.6;
  }
}

.info-notice {
  background: var(--bg-light);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid var(--border-light);
  margin: 1.5rem 0;

  p {
    margin: 0;
    color: var(--text-dark);
    font-size: 0.95rem;
    line-height: 1.6;
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

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>