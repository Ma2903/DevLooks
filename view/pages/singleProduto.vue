<template>
  <div class="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg flex flex-row">
    <!-- Imagem do Produto -->
    <div
      class="w-1/2 h-96 flex items-center justify-center overflow-hidden bg-gray-200 rounded-lg mr-6"
    >
      <img
        class="object-cover w-full h-full"
        :src="product.image || '@/camisa.jpg'"
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
        to="/products"
        class="inline-block bg-blue-500 text-white text-sm font-medium px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300"
      >
        Voltar para a Loja
      </router-link>

      <!-- Botão de Adicionar ao Carrinho -->
      <button
        @click="addToCart(product)"
        class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
      >
        Adicionar ao Carrinho
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "SingleProduto",
  data() {
    return {
      product: {}, // Objeto para armazenar os dados do produto
    };
  },
  created() {
    // Recupera o ID do produto da rota
    const productId = this.$route.params.id;

    // Busca o produto com base no ID
    this.fetchProduct(productId);
  },
  methods: {
    async fetchProduct(productId) {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/products/${productId}`
        );
        this.product = response.data;
      } catch (error) {
        console.error("Erro ao carregar o produto:", error.message);
      }
    },
    addToCart(product) {
      const cart = localStorage.getItem("cart");
      const cartItems = cart ? JSON.parse(cart) : [];

      const existingItem = cartItems.find((item) => item._id === product._id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cartItems.push({ ...product, quantity: 1 });
      }

      localStorage.setItem("cart", JSON.stringify(cartItems));
      alert("Produto adicionado ao carrinho!");
    },
  },
};
</script>
