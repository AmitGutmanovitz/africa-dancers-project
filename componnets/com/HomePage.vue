<template>
    <div class="container">
      
  
      <div class="hero">
        <img
          src="https://images.pexels.com/photos/7125686/pexels-photo-7125686.jpeg"
          alt="Reference Image"
          class="hero-image"
        />
        <button id="ordering" @click="goToOrder">Order a Video for Someone You Love</button>
      </div>
  
      <div class="po">
        <p>Celebrate your favorite people with personalized, fun videos from talented performers!</p>
        <p>Upload a picture, pick a theme, and get a joyful video in one Day.</p>
        <p>Easy, fast, and unforgettable!</p>
      </div>
  
      <!-- Display loading message or error if any -->
      <div v-if="loading" class="loading">Loading images...</div>
      <div v-if="error" class="error">{{ error }}</div>
  
      <!-- Images Grid -->
      <div class="orderExample">
        <img
          v-for="img in images"
          :key="img.video_id"
          :src="img.video_image_url"
          :alt="'Product ' + img.video_id"
          class="product-img"
          @click="goToImageOrder(img.video_id)"
          
        />
        
      </div>
  
      <!-- Footer Section -->
        <!-- Add this line to render the Footer -->
    </div>
  </template>
  
  <style scoped>
  /* Global Styles */
/* Global Styles */
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;700&family=Nunito:wght@400;600;700&display=swap');

body {
  margin: 0;
  padding: 0;
  background-color: #FFF5E6;
  font-family: 'Nunito', sans-serif;
  color: #333333;
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Main Container */
.container {
  padding: 20px;
  max-width: 1600px;
  margin: 0 auto;
  background-color: #FFFFFF;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

/* Hero Section */
.hero {
  text-align: center;
  margin: 30px 0;
  position: relative;
  overflow: hidden;
  border-radius: 15px;
}

.hero-image {
  width: 100%;
  max-height: 500px;
  object-fit: cover;
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.5s ease;
}

.hero-image:hover {
  transform: scale(1.02);
}

#ordering {
  display: block;
  margin: 20px auto;
  padding: 20px 40px;
  background-color: #FF9E00;
  color: #FFFFFF;
  border: none;
  border-radius: 50px;
  font-size: 24px;
  font-family: 'Baloo 2', cursive;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(255, 158, 0, 0.3);
  transition: all 0.3s ease-in-out;
  position: relative;
  overflow: hidden;
}

#ordering:hover {
  background-color: #FF427F;
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(255, 66, 127, 0.4);
  animation: bounce 0.5s;
}

@keyframes bounce {
  0%, 100% { transform: translateY(-5px); }
  50% { transform: translateY(-10px); }
}

#ordering:active {
  transform: scale(0.98);
}

#ordering::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 5px;
  height: 5px;
  background: rgba(255, 255, 255, 0.5);
  opacity: 0;
  border-radius: 100%;
  transform: scale(1, 1) translate(-50%);
  transform-origin: 50% 50%;
}

#ordering:focus:not(:active)::after {
  animation: ripple 1s ease-out;
}

@keyframes ripple {
  0% {
    transform: scale(0, 0);
    opacity: 1;
  }
  100% {
    transform: scale(20, 20);
    opacity: 0;
  }
}

/* Text Paragraphs */
.po {
  text-align: center;
  font-size: 18px;
  margin: 40px auto;
  max-width: 800px;
  line-height: 1.6;
  padding: 20px;
  background-color: #FFF5E6;
  border-radius: 15px;
}

.po > p {
  margin: 15px 0;
  color: #333333;
  background-color: transparent;
}

/* Loading & Error Messages */
.loading, .error {
  text-align: center;
  font-size: 18px;
  margin: 30px 0;
  padding: 15px;
  border-radius: 8px;
}

.loading {
  background-color: rgba(0, 200, 150, 0.1);
  color: #00C896;
}

.error {
  background-color: rgba(255, 66, 127, 0.1);
  color: #FF427F;
}

/* Image Grid */
.orderExample {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
  margin: 50px 0;
}

.product-img {
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border: 2px solid #FFFFFF;
}

.product-img:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 20px rgba(255, 66, 127, 0.2);
  border-color: #FF9E00;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .orderExample {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .hero-image {
    max-height: 400px;
  }
  
  #ordering {
    font-size: 22px;
    padding: 18px 35px;
  }
}

@media (max-width: 768px) {
  .orderExample {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
  
  .product-img {
    height: 200px;
  }
  
  #ordering {
    font-size: 20px;
    padding: 15px 30px;
    width: 90%;
  }
  
  .po {
    font-size: 16px;
    padding: 15px;
  }
}

@media (max-width: 480px) {
  .orderExample {
    grid-template-columns: 1fr;
  }
  
  .container {
    padding: 10px;
  }
  
  #ordering {
    font-size: 18px;
    padding: 12px 25px;
  }
  
  .hero-image {
    max-height: 300px;
  }
}
  </style>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';
 
  ; // Imported Footer Component
  
  const router = useRouter();
  const images = ref([]);
  const error = ref('');
  const loading = ref(false);
  
  // Function to fetch images
  const fetchImages = async () => {
    loading.value = true;
    try {
      const response = await axios.get('http://localhost:4000/orders/info');
      if (response.status === 200) {
        images.value = response.data;
      } else {
        error.value = 'Failed to fetch images';
      }
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };
  
  // Navigate to order page with image ID
  const goToImageOrder = (id) => {
    console.log(id)
    router.push({ name: 'newOrderWithId', params: { id: id } });
  };
  
  // Navigate to general order page
  const goToOrder = () => {
    router.push({ name: 'newOrder' });
  };
  
  // Fetch images when the component is mounted
  onMounted(fetchImages);
  </script>
  