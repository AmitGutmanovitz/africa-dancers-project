<template>
    <div class="container">
      <h1 id="title">Logout page</h1>
      <div class="logout-form">   
        <h3>Are you sure you want to logout?</h3>
        <button @click="logout">Logout</button>
      </div>
      <div v-if="error" class="error">{{ error }}</div>
      <div v-if="loading" class="loading">Loading...</div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import axios from 'axios'
  
  const error = ref('')
  const loading = ref(false)
  const token = localStorage.getItem('token') 
  const logout = async () => {
    console.log('logout clicked')  // לוודא שהכפתור עובד
    loading.value = true
    error.value = ''
    

    try {
      const response = await axios.post(
        'http://localhost:4000/logout',
        { token },
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        }
      )
      console.log(token)
  
      if (response.status === 200) {
        localStorage.removeItem('token')
        localStorage.setItem('remember', 'false')
        console.log('Logout successful!')
        window.location.href = '/'
      } else {
        console.log('Logout failed!')
        error.value = 'Logout failed!'
      }
  
    } catch (err) {
      error.value = err.response?.data?.message || 'Logout failed!'
      console.error('Logout failed!', err)
    } finally {
      loading.value = false
    }
  }
  </script>
  
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;700&family=Nunito:wght@400;600;700&display=swap');

.container {
  max-width: 500px;
  margin: 3rem auto;
  padding: 2.5rem;
  border-radius: 20px;
  background-color: #FFFFFF;
  box-shadow: 0 10px 30px rgba(255, 158, 0, 0.1);
  text-align: center;
  animation: fadeIn 0.5s ease-out;
}

#title {
  color: #FF9E00;
  font-family: 'Baloo 2', cursive;
  font-size: 2.2rem;
  margin-bottom: 1.5rem;
}

.logout-form {
  margin: 2rem 0;
  padding: 1.5rem;
  background-color: #FFF5E6;
  border-radius: 15px;
}

.logout-form h3 {
  color: #333333;
  font-family: 'Nunito', sans-serif;
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
}

.logout-form button {
  padding: 0.8rem 2rem;
  background-color: #FF427F;
  color: white;
  border: none;
  border-radius: 50px;
  font-family: 'Baloo 2', cursive;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(255, 66, 127, 0.3);
}

.logout-form button:hover {
  background-color: #FF9E00;
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(255, 158, 0, 0.4);
}

.logout-form button:active {
  transform: translateY(1px);
}

.error {
  color: #FF427F;
  margin: 1.5rem 0;
  padding: 0.8rem;
  background-color: rgba(255, 66, 127, 0.1);
  border-radius: 8px;
  font-family: 'Nunito', sans-serif;
  font-weight: 600;
  animation: shake 0.5s ease;
}

.loading {
  color: #00C896;
  font-family: 'Nunito', sans-serif;
  font-weight: 600;
  margin: 1.5rem 0;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-5px); }
  40%, 80% { transform: translateX(5px); }
}

/* Responsive Design */
@media (max-width: 768px) {
  .container {
    margin: 2rem auto;
    padding: 1.5rem;
    width: 90%;
  }
  
  #title {
    font-size: 1.8rem;
  }
}
</style>
  