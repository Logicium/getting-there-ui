<script setup lang="ts">

</script>

<template>
  <footer>
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>Getting There</h3>
          <p>Empowering you to achieve your goals with proven strategies and resources.</p>
        </div>
        <div class="footer-section">
          <h3>Quick Links</h3>
          <p><a href="#home">Home</a></p>
          <p><a href="#about">About Us</a></p>
          <p><a href="#services">Services</a></p>
          <p><a href="#blog">Blog</a></p>
        </div>
        <div class="footer-section">
          <h3>Contact</h3>
          <p><a href="mailto:gettingthere@gthere.net">gettingthere@gthere.net</a></p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2025 Getting There. All rights reserved.</p>
        <p>We are continuously upgrading our site. Expect exciting changes soon.</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* Footer */
footer {
  background: var(--text-dark);
  color: white;
  padding: 3rem 0 2rem;
  text-align: center;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-section h3 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.footer-section a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-section a:hover {
  color: var(--accent-color);
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 2rem;
  opacity: 0.7;
}
</style>
