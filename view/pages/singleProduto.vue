<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-800 to-black text-gray-200">
    <div class="m-10 bg-gray-900 p-10 rounded-3xl shadow-2xl w-full max-w-6xl flex flex-col md:flex-row">
      <!-- Imagem do Produto -->
      <div
        class="w-full md:w-1/2 h-96 flex items-center justify-center overflow-hidden bg-gray-800 rounded-lg mb-6 md:mb-0 md:mr-6"
      >
        <img
          class="object-cover w-full h-full"
          :src="product.image || '@/camisa.jpg'"
          :alt="product.name"
        />
      </div>

      <!-- Detalhes do Produto -->
      <div class="w-full md:w-1/2">
        <h1 class="text-4xl font-extrabold text-purple-400 mb-6">{{ product.name }}</h1>
        <p class="text-gray-300 text-lg mb-6">{{ product.description }}</p>

        <!-- Preço e Categoria -->
        <div class="flex justify-between items-center mb-6">
          <span class="text-3xl font-bold text-green-500">R${{ product.price }}</span>
          <span
            class="bg-gray-700 text-gray-300 text-sm font-medium px-4 py-2 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 hover:bg-purple-600 hover:text-white"
          >
            <span class="text-purple-400 font-bold">#</span>{{ product.category }}
          </span>
        </div>

        <!-- Seleção de Quantidade -->
        <div class="mb-6">
          <label for="quantity" class="block text-gray-300 text-sm font-medium mb-2">Quantidade</label>
          <div class="flex items-center space-x-4">
            <button
              @click="decreaseQuantity"
              class="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
            >
              -
            </button>
            <input
              type="number"
              id="quantity"
              v-model.number="quantity"
              min="1"
              class="w-16 text-center bg-gray-800 text-gray-200 text-lg font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              @click="increaseQuantity"
              class="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
            >
              +
            </button>
          </div>
        </div>

        <!-- Botões -->
        <div class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <router-link
            to="/products"
            class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            Voltar para a Loja
          </router-link>
          <button
            @click="addToCart(product)"
            class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            Adicionar ao Carrinho
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
      product: {}, // Objeto para armazenar os dados do produto
      quantity: 1, // Quantidade inicial do produto
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
        existingItem.quantity += this.quantity;
      } else {
        cartItems.push({ ...product, quantity: this.quantity });
      }

      localStorage.setItem("cart", JSON.stringify(cartItems));

      // SweetAlert para confirmar a adição ao carrinho
      Swal.fire({
        title: "Produto Adicionado!",
        text: `${this.quantity} unidade(s) de "${product.name}" foram adicionadas ao carrinho.`,
        icon: "success",
        background: "#1a202c", // Fundo escuro
        color: "#e2e8f0", // Texto claro
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
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          this.$router.push("/products");
        }
      });
    },
    increaseQuantity() {
      this.quantity += 1;
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

input[type="number"] {
  -moz-appearance: textfield;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
