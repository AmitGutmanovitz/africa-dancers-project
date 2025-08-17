<template>
    <footer>
      <p>&copy; africa {{ new Date().getFullYear()}} have all rights</p>
      <div class="footer-links">
        <router-link to="/about">About</router-link>
        <router-link to="/faq">FAQ</router-link>
        <router-link to="/refund-policy">Refund Policy</router-link>
        <router-link to="/contact-us">Contact Us</router-link>
      </div>
    </footer>
  </template>
  
 <style scoped>
footer {
  background-color: #FF9E00;
  color: white;
  padding: 2rem 1rem;
  text-align: center;
  font-family: 'Nunito', sans-serif;
  margin-top: 3rem;
  position: relative;
  overflow: hidden;
}

footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #FF427F, #00C896);
}

footer p {
  margin: 0.5rem 0;
  font-size: 0.9rem;
  font-weight: 600;
}

.footer-links {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-top: 1rem;
}

.footer-links a {
  color: white;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  position: relative;
  padding: 0.3rem 0;
}

.footer-links a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: white;
  transition: width 0.3s ease;
}

.footer-links a:hover::after {
  width: 100%;
}

.footer-links a:hover {
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .footer-links {
    gap: 1rem;
  }
  
  footer p {
    font-size: 0.8rem;
  }
  
  .footer-links a {
    font-size: 0.85rem;
  }
}
</style>