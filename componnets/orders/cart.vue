<template>
    <div class="cart" v-if="cart.length" v-for="item in cart">
        <div class="cart-item" :key="item.id">
         <h6>{{ item.id }}</h6>
        </div>
    </div>
</template>

<script setup>

import { ref, onMounted } from 'vue';
import axios from 'axios';
const token = localStorage.getItem('token');
const cart = ref([]);
const error = ref('');
const loading = ref(false);

 onMounted( async() =>{
    loading.value = true;
    error.value = '';
    
    try{
        const response = await axios.get('http://localhost:4000/orders/cart',{
         
            headers:{
                Authorization: `Bearer ${token}`,
            }
        })
        if(response.status === 200){
            cart.value = response.data;
            console.log('cart', cart.value)
        }else{
            error.value = 'Error fetching data'
        }}catch(err){
            error.value = err.response?.data?.message || 'Fetching error'
        }finally{
            loading.value = false;
        }
    
})


</script>