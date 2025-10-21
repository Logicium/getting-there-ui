<script setup lang="ts">
import { ref, onMounted } from "vue";
import { RouterLink } from "vue-router";
import HeartIcon from "@/components/icons/HeartIcon.vue";
import Plant2Icon from "@/components/icons/Plant2Icon.vue";

// Default values shown until CMS data loads (or if it fails)
const footerContent = ref(
    "Compassionate guidance for your emotional wellness journey. Licensed professionals dedicated to helping you achieve lasting positive change."
);
const footerDisclaimer = ref(
    "Getting There provides educational resources and support. We are not a substitute for professional medical or mental health treatment. Please consult with qualified healthcare providers for clinical concerns."
);

onMounted(async () => {
  try {
    const res = await fetch(
        "https://getting-there-cms.onrender.com/api/footer?populate=all",
        { headers: { "Accept": "application/json" } }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    // Safely assign values from the CMS response
    footerContent.value = json?.data?.content ?? footerContent.value;
    footerDisclaimer.value = json?.data?.disclaimer ?? footerDisclaimer.value;
  } catch (err) {
    console.error("Failed to fetch footer content:", err);
  }
});
</script>

<template>
  <footer>
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>Getting There</h3>
          <p>{{ footerContent }}</p>
          <div class="credentials">
            <span class="credential-badge"><Plant2Icon/> Wellness Focus</span>
            <span class="credential-badge"><HeartIcon/> Compassionate Care</span>
          </div>
        </div>
        <div class="footer-section">
          <h3>Resources</h3>
          <p><RouterLink to="/blog">Blog</RouterLink></p>
          <p><RouterLink to="/store">Booklets</RouterLink></p>
          <p><RouterLink to="/videos">Videos</RouterLink></p>
          <p><RouterLink to="/events">Workshops</RouterLink></p>
        </div>
        <div class="footer-section">
          <h3>Contact Us</h3>
          <p>We'd love to hear from you.</p>
          <div class="contact-info">
            <a href="mailto:gettingthere@gthere.net" class="contact-link">
              gettingthere@gthere.net
            </a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="footer-legal">
          <p>&copy; 2025 Getting There. All rights reserved.</p>
          <div class="legal-links">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
            <a href="/accessibility">Accessibility</a>
          </div>
        </div>
        <div class="footer-disclaimer">
          <p><small>{{ footerDisclaimer }}</small></p>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* Footer */
footer {
  background: var(--text-dark);
  color: white;
  padding: 4rem 0 2rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 3rem;
  margin-bottom: 3rem;
}

.footer-section h3 {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: white;
  font-family: 'Playfair Display', serif;
}

.footer-section p {
  margin-bottom: 0.75rem;
  line-height: 1.6;
}

.footer-section a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-section a:hover {
  color: var(--accent-color);
}

.credentials {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.credential-badge {
  display: flex;
  gap: 5px;
  background: var(--primary-color);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

/* Contact Section */
.contact-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin: 1rem 0;
}

.contact-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  border-radius: 8px;
}

.contact-link:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

.contact-icon {
  font-size: 1.2rem;
}

.contact-note {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 0.5rem;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 2rem;
}

.footer-legal {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.legal-links {
  display: flex;
  gap: 2rem;
}

.legal-links a {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.legal-links a:hover {
  color: rgba(255, 255, 255, 0.9);
}

.footer-disclaimer {
  opacity: 0.7;
  font-size: 0.85rem;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.8);
}

/* Mobile Responsiveness */
@media (max-width: 1024px) {
  .footer-content {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .footer-legal {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .legal-links {
    flex-direction: column;
    gap: 1rem;
  }

  .credentials {
    justify-content: center;
  }

  .contact-link:hover {
    transform: none;
  }
}
</style>