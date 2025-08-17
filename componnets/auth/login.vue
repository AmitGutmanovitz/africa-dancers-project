<template>
  <div class="login-container">
    <h1 class="login-title">Login</h1>

    <form class="login-form" @submit.prevent="login">
      <label>
        <span>Email</span>
        <input type="email" placeholder="Email" v-model="email" required />
      </label>

      <label>
        <span>Password</span>
        <input type="password" placeholder="Password" v-model="password" required />
      </label>

      <div class="remember-me">
        <input type="checkbox" id="remember" v-model="remember" />
        <label for="remember">Remember me</label>
      </div>

      <button type="submit" class="login-button" :disabled="loading">
        {{ loading ? 'Logging in...' : 'Login' }}
      </button>
    </form>

    <div v-if="error" class="error-message">{{ error }}</div>
    
    <div class="register-link">
      <h3>I don't have an account yet:</h3>
      <router-link :to="{ name: 'register' }">Register</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const remember = ref(false)

const login = async () => {
  error.value = ''
  loading.value = true

  try {
    const response = await axios.post('http://localhost:4000/login', {
      email: email.value,
      password: password.value
    }, {
      withCredentials: true
    })
    console.log('Login response:', response.data);
    if (response.data.tokens.accessToken) {
      localStorage.setItem('token', response.data.tokens.accessToken)
      console.log('2');
      if (remember.value) {
        localStorage.setItem('remember', 'true')
      }
      router.push({ path: '/' })
    } else {
      throw new Error('Login failed - no token received')
    }
  } catch (err) {
    error.value = err.response?.data?.message || 
                 err.response?.data?.error || 
                 'Login failed. Please try again.'
    console.error('Login error:', err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;700&family=Nunito:wght@400;600;700&display=swap');

.login-container {
  max-width: 450px;
  margin: 3rem auto;
  padding: 2.5rem;
  border-radius: 20px;
  background-color: #FFFFFF;
  box-shadow: 0 10px 30px rgba(255, 158, 0, 0.1);
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

.login-title {
  text-align: center;
  margin-bottom: 2rem;
  color: #FF9E00;
  font-family: 'Baloo 2', cursive;
  font-size: 2.2rem;
  font-weight: 700;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.login-form label {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-family: 'Nunito', sans-serif;
  font-weight: 600;
  color: #333333;
}

.login-form input[type="email"],
.login-form input[type="password"] {
  padding: 0.8rem 1rem;
  border: 2px solid #FF9E00;
  border-radius: 10px;
  font-family: 'Nunito', sans-serif;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #FFF5E6;
}

.login-form input[type="email"]:focus,
.login-form input[type="password"]:focus {
  outline: none;
  border-color: #FF427F;
  box-shadow: 0 0 0 3px rgba(255, 66, 127, 0.2);
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin: 1rem 0;
  font-family: 'Nunito', sans-serif;
}

.remember-me input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: #FF9E00;
  cursor: pointer;
}

.login-button {
  padding: 1rem;
  background-color: #FF9E00;
  color: white;
  border: none;
  border-radius: 50px;
  font-family: 'Baloo 2', cursive;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  box-shadow: 0 4px 10px rgba(255, 158, 0, 0.3);
}

.login-button:hover:not(:disabled) {
  background-color: #FF427F;
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(255, 66, 127, 0.4);
}

.login-button:active:not(:disabled) {
  transform: translateY(1px);
}

.login-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.error-message {
  color: #FF427F;
  margin: 1.5rem 0;
  text-align: center;
  font-family: 'Nunito', sans-serif;
  font-weight: 600;
  padding: 0.8rem;
  background-color: rgba(255, 66, 127, 0.1);
  border-radius: 8px;
  animation: shake 0.5s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-5px); }
  40%, 80% { transform: translateX(5px); }
}

.register-link {
  margin-top: 2rem;
  text-align: center;
  font-family: 'Nunito', sans-serif;
}

.register-link h3 {
  color: #333333;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.register-link a {
  color: #00C896;
  text-decoration: none;
  font-weight: 700;
  transition: color 0.3s ease;
  display: inline-block;
  padding: 0.3rem 0;
  border-bottom: 2px solid transparent;
}

.register-link a:hover {
  color: #FF9E00;
  border-bottom-color: #FF9E00;
}

/* Responsive Design */
@media (max-width: 768px) {
  .login-container {
    margin: 1.5rem auto;
    padding: 1.5rem;
    width: 90%;
  }
  
  .login-title {
    font-size: 1.8rem;
  }
}

@media (max-width: 480px) {
  .login-container {
    padding: 1.2rem;
  }
  
  .login-button {
    padding: 0.8rem;
    font-size: 1rem;
  }
}
</style>