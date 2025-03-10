<script setup>
import { ref, onMounted } from 'vue';
import ProductService from '@/services/ProductService';
import Home from './components/Home.vue';
import Header from './components/Header.vue';
import Product from './components/Product.vue';
import SearchBar from './components/Search-bar.vue';

const produtos = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchProdutos = async () => {
  try {
    produtos.value = await ProductService.getAllProducts();
  } catch (err) {
    error.value = 'Erro ao carregar produtos.';
  } finally {
    loading.value = false;
  }
};

onMounted(fetchProdutos);
</script>

<template>
  <div>
    <Header />
    <main class="mt-0">
      <Home />
    </main>
    <!-- 
    <SearchBar />
    <div class="max-w-screen-lg mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">Produtos</h1>
      <div v-if="loading">Carregando...</div>
      <div v-else-if="error" class="text-red-500">{{ error }}</div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Product v-for="produto in produtos" :key="produto.id" :product="produto" />
      </div>
    </div> -->
  </div>
</template>

<style scoped>
main {
  margin-top: 0; /* Remove qualquer margem superior */
  padding-top: 0; /* Remove qualquer padding superior */
}
</style>