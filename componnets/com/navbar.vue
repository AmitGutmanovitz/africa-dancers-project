<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="logo">
        <router-link to="/" class="logo-text">My App</router-link>
      </div>
      <div class="menu">
        <router-link to="/about" class="nav-link">About</router-link>
        <router-link to="/faq" class="nav-link">FAQ</router-link>
        <router-link to="/cart" class="nav-link">Cart</router-link>
        <router-link v-if="isAuthenticated" to="/orders/list" class="nav-link">My Orders</router-link>
        <router-link v-if="!isAuthenticated" to="/login" class="nav-link">Login</router-link>
        <router-link v-if="!isAuthenticated" to="/register" class="nav-link">Register</router-link>
      </div>
      <div class="burger" @click="toggleMenu">
        <div class="burger-line"></div>
        <div class="burger-line"></div>
        <div class="burger-line"></div>
      </div>
    </div>
    <div v-if="menuOpen" class="mobile-menu">
      <router-link to="/about" class="mobile-nav-link">About</router-link>

      <router-link v-if="isAuthenticated" to="/orders/list" class="mobile-nav-link">My Orders</router-link>
      <router-link v-if="!isAuthenticated" to="/login" class="mobile-nav-link">Login</router-link>
      <router-link v-if=" !isAuthenticated" to="/register" class="mobile-nav-link">Register</router-link>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

// Check if the user is authenticated (based on your localStorage or a global state)
const isAuthenticated = computed(() => !!localStorage.getItem('token'));

const menuOpen = ref(false);

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};
</script>

<style scoped>
.navbar {
  background-color: #000000; /* Purple background */
  color: white;
  padding: 15px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10;
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: white;
}

.logo-text {
  text-decoration: none;
  color: white;
}

.menu {
  display: flex;
  gap: 20px;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-size: 16px;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #ffcc00; /* Yellow hover effect */
}

.burger {
  display: none;
  flex-direction: column;
  cursor: pointer;
}

.burger-line {
  width: 25px;
  height: 3px;
  background-color: white;
  margin: 4px 0;
}

.mobile-menu {
  position: absolute;
  top: 60px;
  left: 0;
  width: 100%;
  background-color: #6a1b9a;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 15px;
}

.mobile-nav-link {
  color: white;
  text-decoration: none;
  font-size: 18px;
  transition: color 0.3s ease;
}

.mobile-nav-link:hover {
  color: #ffcc00;
}

/* Media query for mobile screens */
@media (max-width: 768px) {
  .menu {
    display: none;
  }

  .burger {
    display: flex;
  }

  .mobile-menu {
    display: flex;
  }
}
</style>
