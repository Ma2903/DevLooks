<script setup>
import { ref, onMounted } from 'vue';
import ProductService from '@/services/ProductService';
import Home from './components/Home.vue';
import Header from './components/Header.vue';
import CreateAvatar from './components/CreateAvatar.vue';

const produtos = ref([]);
const loading = ref(true);
const error = ref(null);
const currentPage = ref('home');

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

const navigateTo = (page) => {
  currentPage.value = page;
};
</script>

<template>
  <div>
    <Header @navigate="navigateTo" />
    <main class="mt-0">
      <component :is="currentPage === 'home' ? Home : CreateAvatar" :produtos="produtos" :loading="loading" :error="error" />
    </main>
  </div>
</template>

<style scoped>
main {
  margin-top: 0; /* Remove qualquer margem superior */
  padding-top: 0; /* Remove qualquer padding superior */
}
</style>