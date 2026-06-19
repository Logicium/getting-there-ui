<script setup lang="ts">
import {
  AppContainer,
  AppEyebrow,
  AppHero,
  AppSection,
} from '@/components/ui'
</script>

<template>
  <main class="privacy">
    <AppHero variant="compact" tone="cream" align="center">
      <template #eyebrow>
        <AppEyebrow tone="fuchsia">Your Privacy Matters</AppEyebrow>
      </template>
      <template #title>Privacy Policy</template>
      <template #lede>
        <p>We are committed to protecting your personal information and your right to privacy. This policy explains how we collect, use, and safeguard your data.</p>
        <p class="privacy__updated">Last Updated: January 15, 2025</p>
      </template>
    </AppHero>

    <AppSection tone="cream-2" pad="xl">
      <AppContainer size="md">
        <article class="u-prose">
          <h2>1. Information We Collect</h2>
          <h3>Personal Information</h3>
          <p>When you use our services, we may collect the following types of personal information:</p>
          <ul>
            <li>Name, email address, and contact information</li>
            <li>Account credentials and authentication information</li>
            <li>Payment and billing information (processed securely through third-party payment processors)</li>
            <li>Program registration and participation details</li>
            <li>Communication preferences and subscription choices</li>
          </ul>

          <h3>Health and Wellness Information</h3>
          <p>As an emotional wellness platform, we may collect:</p>
          <ul>
            <li>Self-reported wellness check-ins and assessments</li>
            <li>Program participation records and progress notes</li>
            <li>Feedback and testimonials (with your explicit consent)</li>
            <li>Communications with facilitators and support staff</li>
          </ul>
          <blockquote>
            <strong>Important:</strong> We do not collect Protected Health Information (PHI) as defined by HIPAA through our website or digital resources. Our support groups and programs are educational and supportive in nature, not clinical therapy services.
          </blockquote>

          <h3>Automatically Collected Information</h3>
          <ul>
            <li>Device information (browser type, operating system, device identifiers)</li>
            <li>Usage data (pages viewed, time spent, click patterns)</li>
            <li>IP address and general location information</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect for the following purposes:</p>
          <ul>
            <li><strong>Service Delivery:</strong> To provide access to programs, resources, and support groups</li>
            <li><strong>Account Management:</strong> To create and maintain your account, process registrations, and manage subscriptions</li>
            <li><strong>Communication:</strong> To send program updates, wellness tips, and respond to inquiries</li>
            <li><strong>Payment Processing:</strong> To process transactions securely through our payment partners</li>
            <li><strong>Improvement:</strong> To analyze usage patterns and improve our services</li>
            <li><strong>Safety and Security:</strong> To protect against fraud, abuse, and security threats</li>
            <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
          </ul>

          <h2>3. Information Sharing and Disclosure</h2>
          <h3>We Do NOT Sell Your Personal Information</h3>
          <p>Getting There does not sell, rent, or trade your personal information to third parties for marketing purposes.</p>
          <h3>Limited Sharing with Service Providers</h3>
          <p>We may share your information with trusted third-party service providers who assist us in operating our platform:</p>
          <ul>
            <li>Payment processors (Stripe, PayPal) for secure transaction handling</li>
            <li>Email service providers for communications and newsletters</li>
            <li>Cloud hosting providers for data storage and platform operations</li>
            <li>Analytics services to understand usage patterns</li>
          </ul>
          <p>All service providers are contractually obligated to maintain confidentiality and use your information only for specified purposes.</p>
          <h3>Legal Requirements</h3>
          <p>We may disclose your information if required by law, legal process, or to protect the rights, safety, and security of Getting There, our users, or others.</p>

          <h2>4. Data Security</h2>
          <p>We implement industry-standard security measures to protect your personal information:</p>
          <ul>
            <li>Encryption of data in transit using SSL/TLS protocols</li>
            <li>Secure storage of sensitive information with encryption at rest</li>
            <li>Regular security audits and vulnerability assessments</li>
            <li>Access controls limiting employee access to personal information</li>
            <li>Secure backup and disaster recovery procedures</li>
          </ul>
          <p>While we strive to protect your information, no method of transmission over the internet is 100% secure. We encourage you to use strong passwords and protect your account credentials.</p>

          <h2>5. Your Rights and Choices</h2>
          <h3>Access and Correction</h3>
          <p>You have the right to access and update your personal information through your account settings or by contacting us at <a href="mailto:privacy@gthere.net">privacy@gthere.net</a>.</p>
          <h3>Data Deletion</h3>
          <p>You may request deletion of your personal information. We will comply with such requests subject to legal retention requirements and legitimate business needs.</p>
          <h3>Marketing Communications</h3>
          <p>You can opt out of marketing emails at any time by clicking the unsubscribe link in any email or updating your communication preferences in your account.</p>
          <h3>Cookies</h3>
          <p>Most browsers allow you to control cookies through settings. Note that disabling cookies may affect your ability to use certain features of our platform.</p>

          <h2>6. Children&rsquo;s Privacy</h2>
          <p>Our services are not directed to individuals under 18 years of age. We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a child, please contact us immediately at <a href="mailto:privacy@gthere.net">privacy@gthere.net</a>.</p>

          <h2>7. Changes to This Policy</h2>
          <p>We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. We will notify you of significant changes by email or through a prominent notice on our website. Your continued use of our services after changes become effective constitutes acceptance of the revised policy.</p>

          <h2>8. Contact Us</h2>
          <p>If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:</p>
          <blockquote>
            <strong>Getting There</strong><br />
            Email: <a href="mailto:gettingthere@gthere.net">gettingthere@gthere.net</a><br />
            Address: Trinidad, Colorado, United States
          </blockquote>
        </article>
      </AppContainer>
    </AppSection>
  </main>
</template>

<style scoped lang="scss">
.privacy__updated {
  margin-top: var(--s-3);
  font-family: var(--font-body);
  font-size: var(--fs-sm);
  color: var(--c-text-muted);
}
</style>