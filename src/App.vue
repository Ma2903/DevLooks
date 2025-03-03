<script setup>
import { ref, onMounted } from 'vue';
import axios from '../src/axios';
import Header from './components/Header.vue'
import Product from './components/Product.vue';
import SearchBar from './components/Search-bar.vue';
// import HelloWorld from './components/HelloWorld.vue'
// import TheWelcome from './components/TheWelcome.vue'

const produtos = ref([]);

const fetchProdutos = async () => {
  try {
    const response = await axios.get('/data');
    produtos.value = response.data;
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
  }
};

onMounted(fetchProdutos);
</script>

<template>
  <Header />
  <Search-bar/>
  <main class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 mx-auto max-w-screen-lg">
    <Product v-for="produto in produtos" :key="produto.id" :product="produto" />
  </main>
</template>

<style scoped>

</style>