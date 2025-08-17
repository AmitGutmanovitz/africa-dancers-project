
<template>
  <div class="container">
    <h1>Edit Order</h1>
    <div>
      <h3>Order Name</h3>
      <input type="text" v-model="orderName" placeholder="Enter order name" />

      <h3>Video Number</h3>
      <div v-for="i in 6" :key="i" class="radio-group">
        <input type="radio" :value="i" v-model="videoType" />
        <label>{{ i }}</label>
      </div>

      <div class="current-image" v-if="img">
      <h3 >Current Image</h3>
      <img :src="`http://localhost:4000/${img}` " width="100" height="100"  />
      </div>
      <div v-if="!img" class="current-image"><h3>thare is no image yet</h3></div>
      
      <h3>Select New Image</h3>
      <input type="file" accept="image/*" @change="onFileChange" />

      <button @click="edit">Edit Order</button>

      <div v-if="error" class="error">{{ error }}</div>
      <div v-if="loading" class="loading">Loading...</div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref } from 'vue'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'


const route = useRoute() 
const orderID = route.params.orderID
console.log('Order ID:', orderID) 

const orderName = ref('')
const videoType = ref('')
const img = ref(null)
const error = ref('')
const loading = ref(false)
 
onMounted(async () => {
  loading.value = true;
  error.value = '';
  try {
    const response = await axios.get(`http://localhost:4000/orders/home/${orderID}`, {
        
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      'Content-Type': 'multipart/form-data',
      withCredentials: true,
    });
    console.log('Response:', response.data);

    // Assign the response data to the reactive variables
    orderName.value = response.data.order_name;
    videoType.value = response.data.video_ref;
    img.value = response.data.img_url; // Assuming img_url is the field name in the response
    console.log('Order data:', response.data);
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to fetch order details!';
    console.error('Error fetching order details:', err);
  } finally {
    loading.value = false;
  }
});

const selectedFile = ref(null); // Add a reactive variable for the file

const onFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
    console.log('Selected file:', file);
  }
};

const edit = async () => {
  loading.value = true;
  error.value = '';

  const formData = new FormData();
  formData.append('name', orderName.value);
  formData.append('video', parseInt(videoType.value));

  // Only append the file if it exists
  if (selectedFile.value) {
    formData.append('images', selectedFile.value); // Field name matches Multer
  }

  try {
    const response = await axios.put(`http://localhost:4000/orders/edit/${orderID}`, formData, {
  
      
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (response.status === 200) {
      console.log('Order updated successfully!');
      error.value = 'Order updated successfully!';
      orderName.value = '';
      videoType.value = '';
      selectedFile.value = null; // Reset the file
    } else {
      error.value = 'Failed to update order!';
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to update order!';
    console.error('Error updating order:', err);
  } finally {
    loading.value = false;
  }

};
 
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;700&family=Nunito:wght@400;600;700&display=swap');

.container {
  max-width: 600px;
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

h3 {
  color: #333333;
  font-family: 'Nunito', sans-serif;
  font-weight: 600;
  margin: 1.2rem 0 0.5rem;
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

.radio-group {
  display: inline-flex;
  align-items: center;
  margin-right: 1.5rem;
  margin-bottom: 1rem;
  cursor: pointer;
}

.radio-group input[type="radio"] {
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid #FF9E00;
  border-radius: 50%;
  margin-right: 0.5rem;
  transition: all 0.2s ease;
  position: relative;
}

.radio-group input[type="radio"]:checked {
  border-color: #FF427F;
  background-color: #FF427F;
}

.radio-group input[type="radio"]:checked::after {
  content: '';
  position: absolute;
  width: 10px;
  height: 10px;
  background: white;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.radio-group label {
  font-family: 'Nunito', sans-serif;
  color: #333333;
  user-select: none;
}

.current-image {
  margin: 1.5rem 0;
  text-align: center;
}

.current-image img {
  border-radius: 12px;
  border: 2px solid #FF9E00;
  box-shadow: 0 4px 12px rgba(255, 158, 0, 0.2);
  transition: transform 0.3s ease;
}

.current-image img:hover {
  transform: scale(1.05);
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
  background: linear-gradient(135deg, #FF9E00, #FF6B00);
  color: white;
  border: none;
  border-radius: 50px;
  font-family: 'Baloo 2', cursive;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 1rem 0;
  box-shadow: 0 4px 15px rgba(255, 158, 0, 0.3);
}

button:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(255, 66, 127, 0.4);
  background: linear-gradient(135deg, #FF427F, #FF6B00);
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
  
  h1 {
    font-size: 1.8rem;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 1.2rem;
  }
  
  .radio-group {
    margin-right: 1rem;
  }
}
</style>  