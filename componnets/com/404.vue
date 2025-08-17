<template>
  <div class="not-found-container">
    <navbar />
    <div class="not-found-content">
      <div class="error-graphic">
        <div class="error-circle">4</div>
        <div class="error-circle turquoise">0</div>
        <div class="error-circle">4</div>
      </div>
      <h1 class="error-title">Oops! Page Not Found</h1>
      <p class="error-message">Looks like you've wandered off the dance floor! The page you're looking for doesn't exist.</p>
      <router-link to="/" class="home-button">Take Me Home</router-link>
    </div>
  </div>
  <router-view />
</template>

<script>
import navbar from './navbar.vue';

export default {
  components: {
    navbar
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;700&family=Nunito:wght@400;600;700&display=swap');

.not-found-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #FFF5E6;
  font-family: 'Nunito', sans-serif;
}

.not-found-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
}

.error-graphic {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  animation: bounce 2s infinite;
}

.error-circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #FF9E00;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Baloo 2', cursive;
  font-size: 3.5rem;
  font-weight: 700;
  box-shadow: 0 8px 20px rgba(255, 158, 0, 0.3);
}

.error-circle.turquoise {
  background-color: #00C896;
  box-shadow: 0 8px 20px rgba(0, 200, 150, 0.3);
  animation-delay: 0.2s;
}

.error-title {
  color: #FF427F;
  font-family: 'Baloo 2', cursive;
  font-size: 2.2rem;
  margin-bottom: 1rem;
}

.error-message {
  color: #333333;
  font-size: 1.1rem;
  max-width: 500px;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.home-button {
  padding: 0.8rem 2rem;
  background: linear-gradient(135deg, #FF9E00, #FF427F);
  color: white;
  border: none;
  border-radius: 50px;
  font-family: 'Baloo 2', cursive;
  font-size: 1.1rem;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 66, 127, 0.3);
}

.home-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(255, 66, 127, 0.4);
  background: linear-gradient(135deg, #FF427F, #FF9E00);
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .error-graphic {
    gap: 1rem;
  }
  
  .error-circle {
    width: 80px;
    height: 80px;
    font-size: 2.8rem;
  }
  
  .error-title {
    font-size: 1.8rem;
  }
  
  .error-message {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .error-graphic {
    flex-direction: column;
    align-items: center;
    gap: 0.8rem;
  }
  
  .error-title {
    font-size: 1.6rem;
  }
  
  .home-button {
    padding: 0.7rem 1.5rem;
    font-size: 1rem;
  }
}
</style>