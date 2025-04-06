<template>
  <div class="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg flex flex-row">
    <!-- Imagem do Produto -->
    <div
      class="w-1/2 h-96 flex items-center justify-center overflow-hidden bg-gray-200 rounded-lg mr-6"
    >
      <img
        class="object-cover w-full h-full"
        :src="`/view/assets/${product.image}` || '@/camisa.jpg'"
        :alt="product.name"
      />
    </div>

    <!-- Detalhes do Produto -->
    <div class="w-1/2 px-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ product.name }}</h1>
      <p class="text-gray-700 text-lg mb-6">{{ product.description }}</p>

      <!-- Preço e Categoria -->
      <div class="flex justify-between items-center mb-6">
        <span class="text-2xl font-semibold text-green-600"
          >R${{ product.price }}</span
        >
        <span
          class="bg-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg"
          >#{{ product.category }}</span
        >
      </div>

      <!-- Botão de Voltar -->
      <router-link
        to="/"
        class="inline-block bg-blue-500 text-white text-sm font-medium px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300"
      >
        Voltar para a Loja
      </router-link>
    </div>
  </div>
</template>

<script>
import axios from "axios"; // Importa o axios para fazer requisições HTTP

export default {
  name: "SingleProduct",
  data() {
    return {
      product: {}, // Objeto para armazenar os dados do produto
    };
  },
  created() {
    // Recupera o ID do produto da rota
    const productId = this.$route.params.id;

    // Simulação de busca do produto (substitua por uma chamada à API)
    this.fetchProduct(productId);
  },
  methods: {
    async fetchProduct(productId) {
      try {
        // Substitua pela chamada à API real usando axios
        const response = await axios.get(
          `http://localhost:3000/api/products/${productId}`
        );
        this.product = response.data;
      } catch (error) {
        console.error("Erro ao carregar o produto:", error.message);
      }
    },
  },
};
</script>
