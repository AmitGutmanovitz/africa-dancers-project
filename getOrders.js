// src/services/getOrders.js
import axios from 'axios';

export default async function getOrders() {
  let loading = true;
  const token = localStorage.getItem('token');
  if (!token) {
    return { orders: [], error: 'No token found in localStorage' };
  }
  //console.log('access token:', token); // Log the response data
  try {
    const response = await axios.get('http://localhost:4000/orders/list', {
      headers: {
        Authorization: `Bearer ${token}`,
        
      }
    });
    //console.log('Response:', response.data); // Log the response data
    const orders = response.data.rows || response.data;
    
    return { orders, error: null };
  } catch (err) {
    //console.error('Error fetching orders:', err); // Log the error
    const message = err.response?.data?.error || err.message;
    return { orders: [], error: message };
  } finally{
    loading = false;
  }
}

