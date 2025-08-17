<template>
  <button @click="submitOrder" style="margin-top: 20px; background-color: #FF427F; color: white; padding: 10px; border-radius: 5px;">Submit Order</button>

  <div v-if="error" class="error">{{ error }}</div>
  <div v-if="loading" class="loading">Loading...</div>
  <div>

    <h2>Your order includes:</h2>
    <ul>
      <li>Order ID: {{ order_id }}</li>
      <li>Video Type: {{ videoType }}</li>
      <li>Order Name: {{ orderName }}</li>

      </ul>
   </div>

  <div v-if="imagePreview">
    <h4>Your image for the order:</h4>
    <h3>Image Preview:</h3>
    <img :src="`http://localhost:4000/${imagePreview}`" alt="Selected Image Preview"
         style="max-width: 300px; max-height: 300px; border:1px solid;" />
        
  </div>


</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const selectedFile = ref(null);
const orderName = ref('');
const videoType = ref();
const imagePreview = ref(null);
const error = ref('');
const loading = ref(false);
const token = localStorage.getItem('token');

// IMPORTANT FIX: Properly extract and validate order_id
const order_id = ref(null);

onMounted(async () => {
  // Validate route param exists and is a number
  if (!route.params.order_id || isNaN(parseInt(route.params.order_id))) {
    error.value = 'Invalid order ID';
    return;
  }

  order_id.value = parseInt(route.params.order_id);

  try {
    const response = await axios.get(
      `http://localhost:4000/orders/home/${order_id.value}`, 
      {
          headers: { Authorization: `Bearer ${token}` },
          'Content-Type': 'application/json',
          withCredentials: true,
      },
    );

    if(response.status === 200) {
      const orderData = response.data;
      orderName.value = orderData.order_name || "rabbit";
      videoType.value = orderData.video_type || 4;
      imagePreview.value = orderData.img_url || null;
      } else {
        error.value = 'Failed to load order details';
      }


  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to load order details';
    console.error('Error fetching order:', err.response?.data || err.message);
  }
});

const submitOrder = async () => {
  if (!order_id.value || !videoType.value || !orderName.value) {
    error.value = 'Missing required fields';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    // Update order
    const updateResponse = await axios.put(
      `http://localhost:4000/orders/update/${order_id.value}`,
      {},
    
      { headers: { authorization: `Bearer ${token}` } }
    );

    // Create Stripe session
    const stripeResponse = await axios.post(
      'http://localhost:4000/orders/create-checkout-session',
      {
        videoId: videoType.value,
        orderId: order_id.value,
      },
      { headers: { authorization: `Bearer ${token}` } }
    );

    window.location.href = stripeResponse.data.url;
    
  } catch (err) {
    error.value = err.response?.data?.message || 'Order submission failed';
    console.error('Submission error:', err.response?.data || err.message);
  } finally {
    loading.value = false;
  }
};
</script>