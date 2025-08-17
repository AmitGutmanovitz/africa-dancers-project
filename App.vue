<template>
  <div id="app">
    
    <Navbar />
  
    <main >
      <router-view />
    </main>
    
    <Footer />
  
  </div>
</template>

<script setup>
import Navbar from './assets/componnets/com/navbar.vue';
import Footer from './assets/componnets/com/footer.vue';
</script>

<style>

</style>
