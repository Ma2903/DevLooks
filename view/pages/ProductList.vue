<template>
  <div class="min-h-screen bg-gray-900 text-gray-200">
    <div class="container mx-auto py-16 px-4">
      <h1 class="text-4xl font-bold text-purple-400 text-center mb-10">
        Produtos Disponíveis
      </h1>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div
          v-for="produto in produtos"
          :key="produto._id"
          class="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300"
        >
          <img
            :src="produto.image || '@/camisa.jpg'"
            :alt="produto.name"
            class="w-full h-48 object-cover rounded-lg mb-4"
          />
          <h2 class="text-lg font-bold text-white mb-2">{{ produto.name }}</h2>
          <p class="text-gray-300 mb-4">{{ produto.description }}</p>
          <div class="flex justify-between items-center mb-4">
            <span class="text-green-500 font-bold text-lg">
              R$ {{ produto.price.toFixed(2) }}
            </span>
            <span
              class="bg-purple-600 text-white text-sm font-medium px-4 py-1 rounded-lg"
            >
              #{{ produto.category }}
            </span>
          </div>
          <router-link
            :to="`/product/${produto._id}`"
            class="block bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg text-center transition duration-300"
          >
            Ver Detalhes
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ProductList",
  data() {
    return {
      produtos: [], // Lista de produtos
    };
  },
  async created() {
    await this.fetchProducts();
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await axios.get("http://localhost:3000/api/products");
        this.produtos = response.data;
      } catch (error) {
        console.error("Erro ao carregar os produtos:", error.message);
        alert("Erro ao carregar os produtos. Tente novamente mais tarde.");
      }
    },
  },
};
</script>

<style scoped>
@import '@fortawesome/fontawesome-free/css/all.css';

body {
  font-family: 'Fira Code', monospace;
}

img {
  transition: transform 0.3s ease;
}

img:hover {
  transform: scale(1.05);
}

button:hover {
  transform: scale(1.05);
}
</style>