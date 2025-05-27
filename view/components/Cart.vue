<template>
    <div class="min-h-screen bg-gray-900 text-gray-200">
      <div class="container mx-auto py-16 px-4">
        <h1 class="text-4xl font-bold text-purple-400 text-center mb-10">
          Carrinho de Compras
        </h1>
  
        <div v-if="cartItems.length > 0" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div
              v-for="item in cartItems"
              :key="item._id"
              class="bg-gray-800 p-6 rounded-lg shadow-lg mb-6"
            >
              <div class="flex items-center">
                <img
                  :src="item.image || '@/camisa.jpg'"
                  alt="Produto"
                  class="w-24 h-24 object-cover rounded-lg mr-6"
                />
                <div>
                  <h2 class="text-lg font-bold text-white">{{ item.name }}</h2>
                  <p class="text-gray-300">Preço: R$ {{ item.price.toFixed(2) }}</p>
                  <div class="mb-1">
                    <span v-if="item.price >= 150" class="text-green-400 font-bold">
                      Frete Grátis
                    </span>
                    <span v-else class="text-gray-300">
                      Frete: R$ 19,90
                    </span>
                  </div>
                  <div class="flex items-center mt-2">
                    <button
                      @click="decreaseQuantity(item._id)"
                      class="bg-gray-700 hover:bg-gray-800 text-white font-bold py-1 px-3 rounded-lg transition duration-300"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      v-model.number="item.quantity"
                      min="1"
                      class="w-12 text-center bg-gray-800 text-gray-200 text-lg font-bold mx-2 py-1 px-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                      @click="increaseQuantity(item._id)"
                      class="bg-gray-700 hover:bg-gray-800 text-white font-bold py-1 px-3 rounded-lg transition duration-300"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <button
                @click="removeFromCart(item._id)"
                class="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
              >
                Remover
              </button>
            </div>
          </div>
  
          <!-- Resumo do Carrinho -->
          <div class="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 class="text-2xl font-bold text-white mb-6">Resumo do Pedido</h2>
            <p class="text-lg text-gray-300 mb-4">
              Total de Itens: {{ totalItems }}
            </p>
            <p class="text-lg text-gray-300 mb-4">
              Total: R$ {{ totalPrice.toFixed(2) }}
            </p>
            <button
              @click="finalizarCompra"
              class="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
            >
              Finalizar Compra
            </button>
          </div>
        </div>
  
        <div v-else class="text-center">
          <p class="text-lg text-gray-300">Seu carrinho está vazio.</p>
          <router-link
            to="/products"
            class="mt-4 inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
          >
            Ver Produtos
          </router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "Cart",
    data() {
      return {
        cartItems: [],
      };
    },
    computed: {
      totalItems() {
        return this.cartItems.reduce((total, item) => total + item.quantity, 0);
      },
      totalPrice() {
        return this.cartItems.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    },
    methods: {
      loadCart() {
        const cart = localStorage.getItem("cart");
        this.cartItems = cart ? JSON.parse(cart) : [];
      },
      removeFromCart(productId) {
        this.cartItems = this.cartItems.filter((item) => item._id !== productId);
        localStorage.setItem("cart", JSON.stringify(this.cartItems));
      },
      increaseQuantity(productId) {
        const item = this.cartItems.find((item) => item._id === productId);
        if (item) {
          item.quantity += 1;
          localStorage.setItem("cart", JSON.stringify(this.cartItems));
        }
      },
      decreaseQuantity(productId) {
        const item = this.cartItems.find((item) => item._id === productId);
        if (item && item.quantity > 1) {
          item.quantity -= 1;
          localStorage.setItem("cart", JSON.stringify(this.cartItems));
        }
      },
      finalizarCompra() {
        this.$router.push("/checkout");
      },
    },
    mounted() {
      this.loadCart();
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
  
  input[type="number"] {
    -moz-appearance: textfield;
  }
  
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  </style>