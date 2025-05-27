<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-800 to-black text-gray-200">
    <div class="m-10 bg-gray-900 p-10 rounded-3xl shadow-2xl w-full max-w-6xl flex flex-col md:flex-row">
      <!-- Imagem do Produto -->
      <div
        class="w-full md:w-1/2 h-96 flex flex-col items-center justify-center overflow-hidden bg-gray-800 rounded-lg mb-6 md:mb-0 md:mr-6 p-4"
      >
        <!-- Galeria de imagens -->
        <div v-if="product.images && product.images.length" class="flex gap-2 mb-4">
          <img
            v-for="(img, idx) in product.images"
            :key="idx"
            :src="img"
            @click="setMainImage(img)"
            :class="['w-16 h-16 object-cover rounded-lg border-2 cursor-pointer transition', mainImage === img ? 'border-purple-600 scale-110' : 'border-purple-400 opacity-80 hover:opacity-100']"
          />
        </div>
        <!-- Zoom na imagem principal -->
        <div class="relative group w-full h-72 flex items-center justify-center">
          <img
            class="object-contain max-h-72 w-full transition-transform duration-300 group-hover:scale-105 bg-gray-900 rounded-lg shadow"
            :src="mainImage || ('/' + product.image) || require('@/camisa.jpg')"
            :alt="product.name"
          />
          <span
            v-if="product.stock < 5"
            class="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1"
          >
            <i class="fas fa-exclamation-triangle mr-1"></i> Últimas unidades
          </span>
        </div>
      </div>

      <!-- Detalhes do Produto -->
      <div class="w-full md:w-1/2 flex flex-col justify-between">
        <div>
          <h1 class="text-4xl font-extrabold text-purple-400 mb-4 flex items-center gap-2">
            <i class="fas fa-box-open"></i> {{ product.name }}
          </h1>
          <div class="flex items-center gap-3 mb-2">
            <span class="bg-gray-700 text-gray-300 text-xs font-medium px-3 py-1 rounded-lg flex items-center gap-1">
              <i class="fas fa-tag text-purple-400"></i> {{ product.category }}
            </span>
            <span class="flex items-center gap-1 text-yellow-400 text-sm">
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="far fa-star"></i>
              <span class="ml-1 text-gray-400">(12)</span>
            </span>
          </div>
          <p class="text-gray-300 text-lg mb-6">{{ product.description }}</p>
        </div>

        <!-- Preço e Estoque -->
        <div class="flex items-center gap-4 mb-6">
          <span class="text-3xl font-bold text-green-500 flex items-center gap-2">
            <i class="fas fa-money-bill-wave"></i> R${{ product.price }}
          </span>
          <span
            :class="product.stock < 5 ? 'bg-red-600' : 'bg-green-600'"
            class="text-white text-xs font-semibold px-3 py-1 rounded-lg flex items-center gap-1"
          >
            <i class="fas fa-boxes"></i> {{ product.stock }} em estoque
          </span>
        </div>

        <!-- Seleção de Quantidade -->
        <div class="mb-6">
          <label for="quantity" class="block text-gray-300 text-sm font-medium mb-2">Quantidade</label>
          <div class="flex items-center space-x-4">
            <button
              @click="decreaseQuantity"
              class="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center"
            >
              <i class="fas fa-minus"></i>
            </button>
            <input
              type="number"
              id="quantity"
              v-model.number="quantity"
              min="1"
              :max="product.stock"
              class="w-16 text-center bg-gray-800 text-gray-200 text-lg font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              @click="increaseQuantity"
              class="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center"
            >
              <i class="fas fa-plus"></i>
            </button>
          </div>
        </div>

        <!-- Botões -->
        <div class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <router-link
            to="/products"
            class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center gap-2 justify-center"
          >
            <i class="fas fa-arrow-left"></i> Voltar para a Loja
          </router-link>
          <button
            @click="addToCart(product)"
            class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center gap-2 justify-center"
          >
            <i class="fas fa-cart-plus"></i> Adicionar ao Carrinho
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";

export default {
  name: "SingleProduto",
  data() {
    return {
      product: {},
      quantity: 1,
      mainImage: null,
    };
  },
  created() {
    const productId = this.$route.params.id;
    this.fetchProduct(productId);
  },
  methods: {
    async fetchProduct(productId) {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/products/${productId}`
        );
        this.product = response.data;
        this.mainImage = response.data.image ? '/' + response.data.image : null;
      } catch (error) {
        console.error("Erro ao carregar o produto:", error.message);
      }
    },
    setMainImage(img) {
      this.mainImage = img;
    },
    addToCart(product) {
      const cart = localStorage.getItem("cart");
      const cartItems = cart ? JSON.parse(cart) : [];

      const existingItem = cartItems.find((item) => item._id === product._id);
      if (existingItem) {
        existingItem.quantity += this.quantity;
      } else {
        cartItems.push({ ...product, quantity: this.quantity });
      }

      localStorage.setItem("cart", JSON.stringify(cartItems));

      Swal.fire({
        title: "Produto Adicionado!",
        text: `${this.quantity} unidade(s) de "${product.name}" foram adicionadas ao carrinho.`,
        icon: "success",
        background: "#1a202c",
        color: "#e2e8f0",
        showCancelButton: true,
        confirmButtonText: "Ir para o Carrinho",
        cancelButtonText: "Continuar Comprando",
        customClass: {
          popup: "rounded-lg shadow-lg",
          confirmButton: "bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg mx-2",
          cancelButton: "bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-lg mx-2",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.isConfirmed) {
          this.$router.push("/cart");
        }
      });
    },
    increaseQuantity() {
      if (this.quantity < this.product.stock) {
        this.quantity += 1;
      }
    },
    decreaseQuantity() {
      if (this.quantity > 1) {
        this.quantity -= 1;
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

button:hover {
  transform: scale(1.05);
}

img {
  border-radius: 0.5rem;
}

h1 {
  font-size: 2.5rem;
}

p {
  font-size: 1.125rem;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
