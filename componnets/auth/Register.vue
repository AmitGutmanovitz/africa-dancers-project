<template>
  <div class="register-container">
    <h1 class="title">Register</h1>

    <div class="form-box">
      <input type="text" placeholder="Email" v-model="email" required />
      <input type="text" placeholder="Username" v-model="username" required />
      <input type="password" placeholder="Password" v-model="password" required />
      <button @click="register">Register</button>
    </div>

    <div class="login-link">
      <h3 id="black">Already have an account?</h3>
      <router-link :to="{ name: 'login' }">Login</router-link>
    </div>

    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="loading" class="loading">Loading...</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

axios.defaults.baseURL = 'http://localhost:4000'
axios.defaults.headers.post['Content-Type'] = 'application/json'

const email = ref('')
const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const register = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await axios.post('/register', {
      email: email.value,
      username: username.value,
      password: password.value,
    }, {
      withCredentials: true,
    })

    const token = response.data.accessToken
    // Check if status is 201 and token exists
    if (response.status !== 201 || !token) {
      throw new Error('Something went wrong')
    }

    localStorage.setItem('token', token)
    console.log('Registration successful!')
    router.push({ path: '/' }) // Redirect to home page after successful registration

  } catch (err) {
    error.value = err.response?.data?.message || 'Registration failed!'
    console.error('Registration failed!', err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;700&family=Nunito:wght@400;600;700&display=swap');

.register-container {
  max-width: 450px;
  margin: 3rem auto;
  padding: 2.5rem;
  border-radius: 20px;
  background-color: #FFFFFF;
  box-shadow: 0 10px 30px rgba(255, 158, 0, 0.1);
  animation: slideUp 0.5s ease-out;
}

.title {
  text-align: center;
  color: #FF9E00;
  font-family: 'Baloo 2', cursive;
  font-size: 2.2rem;
  margin-bottom: 1.5rem;
}

.form-box {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin: 2rem 0;
}

.form-box input {
  padding: 0.8rem 1rem;
  border: 2px solid #FF9E00;
  border-radius: 10px;
  font-family: 'Nunito', sans-serif;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #FFF5E6;
}

.form-box input:focus {
  outline: none;
  border-color: #FF427F;
  box-shadow: 0 0 0 3px rgba(255, 66, 127, 0.2);
}

.form-box button {
  padding: 1rem;
  background-color: #00C896;
  color: white;
  border: none;
  border-radius: 50px;
  font-family: 'Baloo 2', cursive;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  box-shadow: 0 4px 10px rgba(0, 200, 150, 0.3);
}

.form-box button:hover {
  background-color: #FF9E00;
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(255, 158, 0, 0.4);
}

.form-box button:active {
  transform: translateY(1px);
}

.login-link {
  margin-top: 2rem;
  text-align: center;
  font-family: 'Nunito', sans-serif;
}

#black {
  color: #333333;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.login-link a {
  color: #FF427F;
  text-decoration: none;
  font-weight: 700;
  transition: color 0.3s ease;
  display: inline-block;
  padding: 0.3rem 0;
  border-bottom: 2px solid transparent;
}

.login-link a:hover {
  color: #FF9E00;
  border-bottom-color: #FF9E00;
}

.error {
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

.loading {
  color: #00C896;
  font-family: 'Nunito', sans-serif;
  font-weight: 600;
  margin: 1.5rem 0;
  text-align: center;
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

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-5px); }
  40%, 80% { transform: translateX(5px); }
}

/* Responsive Design */
@media (max-width: 768px) {
  .register-container {
    margin: 1.5rem auto;
    padding: 1.5rem;
    width: 90%;
  }
  
  .title {
    font-size: 1.8rem;
  }
}

@media (max-width: 480px) {
  .register-container {
    padding: 1.2rem;
  }
  
  .form-box button {
    padding: 0.8rem;
    font-size: 1rem;
  }
}
</style>