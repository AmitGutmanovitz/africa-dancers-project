<template>
  <div class="container">
    <h1>Create New Order</h1>

    <h2>Select Video Type</h2>
    <div class="video-options" v-if="orders.length > 0">
      <div v-for="video in orders" :key="video.id" class="video-item" @click="videoType = String(video.video_id)"  >
        <img
  :id="String(video.video_id)"
  :src="video.video_image_url"
  alt="Video preview"
  
  :class="{ selected: videoType === String(video.video_id) }"
/>

        <h6 id="price">{{ video.video_price / 100 - 0.01 }} $</h6>
        <small id="type">Type {{ video.video_id }}</small>
      </div>
    </div>

    <p v-if="videoType" id="col">Selected video type: {{ videoType }} </p>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="loading" class="loading">{{ loading }}</div>
    <label id="lab">what you want to be send at the email</label>
    
    <input type="text" placeholder="order name" v-model="orderName">
    <br>
    <input type="file" accept="image/*" @change="onFileChange" />

    <div v-if="imagePreview">
      <h3>Image Preview:</h3>
  <img :src="imagePreview" alt="Selected Image Preview" style="max-width: 300px; max-height: 300px; border:1px solid ;" />
</div>
    <button @click="submitOrder">Submit order</button>

 
  </div>

</template>

<script setup>

import { onMounted, ref } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';


const router = useRouter();
const orders = ref([]);
const videoType = ref('');
const route = useRoute()
const selectedFile = ref(null);
const orderName = ref('');
const error = ref('');
const loading = ref(false);
const token = localStorage.getItem('token');
const fileInput = ref(null); // for resetting input later
const imagePreview = ref(null);
onMounted(async () => {
 videoType.value = route.params.id
 
 if(videoType.value){
  const video = document.getElementById(String(videoType.value))
  if(video){
    video.classList.add('choosen')
  }
 }
  loading.value = true;



  try {
    const response = await axios.get('http://localhost:4000/orders/info', {
     
    });

    if (response.status === 200) {
      orders.value = response.data;
      
    } else {
      error.value = 'Error fetching data';
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Fetching error';
  } finally {
    loading.value = false;
    
  }
});

const onFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
    imagePreview.value = URL.createObjectURL(file);
  }
};

const submitOrder = async () => {
  console.log(videoType)
  if (!selectedFile.value) {
    error.value = 'Please select an image!';
    return;
  }
  if (!videoType.value || !orderName.value) {
    error.value = 'Please fill all fields';
    return;
  }

  loading.value = true;
  error.value = '';

  const formData = new FormData();
  formData.append("status", "uploading");
  formData.append('images', selectedFile.value); // match Multer field name
  formData.append('name', orderName.value);
  formData.append('video', parseInt(videoType.value));
router
  try {
  const response = await axios.post(`http://localhost:4000/orders/add`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });

  if (response.status === 200) {
    router.push({name: "confirm", params: { order_id: response.data.order_id } });
/*
    console.log('Order submitted successfully!');
    error.value = 'order just been uploaded but not confirmed yet!';
    const orderId = response.data.order_id;  // Assuming the response has the order_id

    // Call to create checkout session
    const stripeSession = await axios.post(
      'http://localhost:4000/orders/create-checkout-session', 
      {
        videoId: videoType.value, // Send video ID
        orderId: orderId,   // Send the order ID
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,  // Pass the token in headers
        },
      }
    );
    if(stripeSession.status !== 200) {
      throw new Error('Failed to create checkout session');
    }else{
      console.log('Checkout session created successfully:', stripeSession.data);
      window.location.href = stripeSession.data.url; // Redirect to Stripe checkout
    }

    // Handle success of checkout session creation
   
    console.log(stripeSession.data.url);  // Handle redirect URL or other data

    orderName.value = '';
    videoType.value = '';
    selectedFile.value = null;

    if (fileInput.value) {
      fileInput.value.value = ''; // reset file input for same file re-upload

    }*/
  }
} catch (err) {
  error.value = err.response?.data?.message || 'Order submission failed!';
  console.error('Order submission failed!', err);
} finally {
  loading.value = false;
}
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;700&family=Nunito:wght@400;600;700&display=swap');

.container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #FFFFFF;
  border-radius: 20px;
  box-shadow: 0 5px 25px rgba(255, 158, 0, 0.15);
  font-family: 'Nunito', sans-serif;
  animation: fadeIn 0.4s ease-out;
}

h1 {
  color: #FF9E00;
  font-family: 'Baloo 2', cursive;
  font-size: 2rem;
  text-align: center;
  margin-bottom: 1.5rem;
}

h2 {
  color: #333333;
  font-family: 'Baloo 2', cursive;
  font-size: 1.5rem;
  text-align: center;
  margin-bottom: 1.5rem;
}

.video-options {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.video-item {
  background-color: #FFF5E6;
  border: 2px solid #FF9E00;
  border-radius: 15px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.video-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(255, 158, 0, 0.2);
}

.video-item.selected {
  border-color: #FF427F;
  background-color: rgba(255, 66, 127, 0.1);
  transform: scale(1.02);
}

.video-item img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 0.8rem;
  border: 2px solid white;
  transition: transform 0.3s ease;
}

.video-item:hover img {
  transform: scale(1.05);
}

#price {
  color: #00C896;
  font-weight: 700;
  font-size: 1.1rem;
  margin: 0.5rem 0;
}

#type {
  color: #333333;
  font-size: 0.9rem;
}

#col {
  text-align: center;
  color: #FF9E00;
  font-weight: 600;
  margin: 1.5rem 0;
  font-family: 'Baloo 2', cursive;
}

#lab {
  display: block;
  text-align: center;
  color: #333333;
  font-weight: 600;
  margin: 1.5rem 0 0.5rem;
  font-family: 'Nunito', sans-serif;
}

input[type="text"] {
  width: 100%;
  padding: 0.8rem 1rem;
  border: 2px solid #FF9E00;
  border-radius: 12px;
  font-size: 1rem;
  background-color: #FFF5E6;
  transition: all 0.3s ease;
  margin-bottom: 1rem;
}

input[type="text"]:focus {
  outline: none;
  border-color: #FF427F;
  box-shadow: 0 0 0 4px rgba(255, 66, 127, 0.2);
}

input[type="file"] {
  width: 100%;
  margin: 1rem 0 1.5rem;
  padding: 0.5rem;
  border: 2px dashed #FF9E00;
  border-radius: 12px;
  background-color: #FFF5E6;
  cursor: pointer;
  transition: all 0.3s ease;
}

input[type="file"]:hover {
  border-color: #FF427F;
  background-color: rgba(255, 66, 127, 0.05);
}

button {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #00C896, #00A884);
  color: white;
  border: none;
  border-radius: 50px;
  font-family: 'Baloo 2', cursive;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 1rem 0;
  box-shadow: 0 4px 15px rgba(0, 200, 150, 0.3);
}

button:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 200, 150, 0.4);
  background: linear-gradient(135deg, #00C896, #FF9E00);
}

button:active {
  transform: translateY(1px);
}

.error {
  color: #FF427F;
  background-color: rgba(255, 66, 127, 0.1);
  padding: 1rem;
  border-radius: 10px;
  text-align: center;
  font-weight: 600;
  margin: 1.5rem 0;
  animation: shake 0.5s ease;
}

.loading {
  color: #00C896;
  text-align: center;
  font-weight: 600;
  margin: 1.5rem 0;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-5px); }
  40%, 80% { transform: translateX(5px); }
}

@media (max-width: 768px) {
  .container {
    padding: 1.5rem;
    margin: 1rem auto;
    width: 90%;
  }
  
  .video-options {
    grid-template-columns: repeat(2, 1fr);
  }
  
  h1 {
    font-size: 1.8rem;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 1.2rem;
  }
  
  .video-options {
    grid-template-columns: 1fr;
  }
  
  button {
    padding: 0.9rem;
    font-size: 1rem;
  }
}
</style>