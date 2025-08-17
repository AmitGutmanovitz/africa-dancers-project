<template>
  <div class="container">
    <h1 class="main-title">Orders Page</h1>
    <div class="title">
      <h2>Here are all your orders:</h2>
    </div>

    <div v-if="orders.length" class="orders-list">
<ul>
  <li v-for="order in orders" :key="order.id" class="order-item" style="width: 500px; height: 100%;">
    <strong>Video:</strong> {{ order.video_name }} <br />
    <strong>Video Image:</strong> <img :src="`${order.video_image_url}`"  width="250" height="100%" /> <br />
    <strong>Order Date:</strong> {{ order.order_date }} <br />
    <strong>Order Name:</strong> {{ order.order_name }} <br />
    <strong>image:</strong><br>
    <img :src="`http://localhost:4000/${order.img_url}`"  width="120" height="100%" /> <br />
    <button @click="reditectEditing(order.order_id)">edit order</button>
  </li>
</ul>
    </div>

    <div v-else-if="!orders.length && !error && !loading ">
      <p>you not have orders yet</p>
    </div>
    
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    <div v-if="loading">loading...</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import getOrders from '@/functions/getOrders';
import { useRouter } from 'vue-router'

const router = useRouter()
const orders = ref([]);
const error = ref('');
const loading = ref(true);
const nothing=  ref(false);
onMounted(async () => {



  loading.value = true;
  const { orders: fetchOrders, error: fetchError   } = await getOrders();
  orders.value = fetchOrders;

 orders.value = orders.value.map(order => {
    const date = new Date(order.order_date);
    return {
      ...order,
      order_date: date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      }),
    };
  });
  error.value = fetchError || '';
  loading.value = false;
});

const reditectEditing = (orderID) => {
  console.log('Order ID received:', orderID) // לוודא מה מתקבל
  if (!orderID) {
    error.value = 'Order not found!'
    return
  }
  
    router.push({ name: 'editOrder', params: { orderID } })
}


</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 50px auto;
  background-color: #e6e6fa; /* Light purple */
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  padding: 20px;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  animation: fadeIn 1s ease-in-out;
}

.main-title {
  text-align: center;
  color: #6a1b9a; /* Purple */
  margin-bottom: 20px;
}

.title h2 {
  color: #503737; /* Purple */
  text-align: center;
  margin-bottom: 20px;
}

.orders-list ul {
  list-style: none;
  padding: 0;
  color: #17bd99;
}

.order-item {
  background-color: #6a27c2; /* Light yellow */
  border: 1px solid #6a1b9a; /* Purple border */
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  color: #000000;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.order-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
}

.order-item strong {
  color: #128882; /* Purple */
}

.order-item img {
  display: block;
  margin: 10px 0;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

button {
  background-color: #dde016; /* Purple */
  color: #ffffff;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 10px;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

button:hover {
  background-color: #4a0072; /* Darker purple */
  transform: scale(1.05);
  opacity: 0.9;
}

.error {
  color: #388e3c; /* Green */
  font-weight: bold;
  text-align: center;
  margin-top: 20px;
  animation: fadeIn 1s ease-in-out;
}

.loading {
  color: #fbc02d; /* Yellow */
  font-weight: bold;
  text-align: center;
  margin-top: 20px;
  animation: fadeIn 1s ease-in-out;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>