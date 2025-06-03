<template>
  <div class="min-h-screen bg-gray-900 text-gray-200">
    <div class="container mx-auto py-16 px-4">
      <h1 class="text-4xl font-bold text-[#04d1b0] text-center mb-10 flex items-center justify-center gap-3">
        <i class="fas fa-shopping-cart text-[#04d1b0]"></i>
        Carrinho de Compras
      </h1>

      <div v-if="cartItems.length > 0" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Lista de Itens do Carrinho -->
        <div>
          <div
            v-for="item in cartItems"
            :key="item._id"
            class="bg-gray-800 p-6 rounded-lg shadow-lg mb-6 border-2 border-gray-700 hover:border-[#04d1b0] transition"
          >
            <div class="flex items-center gap-6">
              <div class="relative">
                <img
                  :src="item.image || '@/camisa.jpg'"
                  alt="Produto"
                  class="w-24 h-24 object-cover rounded-lg border-2 border-[#04d1b0] shadow"
                />
                <span class="absolute -top-2 -right-2 bg-[#04d1b0] text-white text-xs px-2 py-1 rounded-full shadow flex items-center gap-1">
                  <i class="fas fa-box"></i> {{ item.quantity }}
                </span>
              </div>
              <div class="flex-1">
                <h2 class="text-lg font-bold text-white flex items-center gap-2">
                  <i class="fas fa-tshirt text-[#04d1b0]"></i>
                  {{ item.name }}
                </h2>
                <p class="text-gray-300 flex items-center gap-1">
                  <i class="fas fa-tag"></i>
                  Preço: <span class="font-bold text-[#04d1b0]">R$ {{ item.price.toFixed(2) }}</span>
                </p>
                <div class="mb-1 flex items-center gap-2">
                  <span v-if="item.price >= 150" class="text-[#04d1b0] font-bold flex items-center gap-1">
                    <i class="fas fa-truck"></i> Frete Grátis
                  </span>
                  <span v-else class="text-gray-300 flex items-center gap-1">
                    <i class="fas fa-truck"></i> Frete: R$ 19,90
                  </span>
                </div>
                <div class="flex items-center mt-2 gap-2">
                  <button
                    @click="decreaseQuantity(item._id)"
                    class="bg-gray-700 hover:bg-gray-800 text-white font-bold py-1 px-3 rounded-lg transition duration-300"
                  >
                    <i class="fas fa-minus"></i>
                  </button>
                  <input
                    type="number"
                    v-model.number="item.quantity"
                    min="1"
                    class="w-12 text-center bg-gray-800 text-gray-200 text-lg font-bold mx-2 py-1 px-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04d1b0]"
                  />
                  <button
                    @click="increaseQuantity(item._id)"
                    class="bg-gray-700 hover:bg-gray-800 text-white font-bold py-1 px-3 rounded-lg transition duration-300"
                  >
                    <i class="fas fa-plus"></i>
                  </button>
                </div>
              </div>
              <button
                @click="removeFromCart(item._id)"
                class="ml-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center gap-1"
                title="Remover do carrinho"
              >
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Resumo do Carrinho -->
        <div class="bg-gray-800 p-6 rounded-lg shadow-lg border-2 border-[#04d1b0]">
          <h2 class="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <i class="fas fa-receipt text-[#04d1b0]"></i>
            Resumo do Pedido
          </h2>
          <div class="mb-4 flex flex-col gap-2">
            <p class="text-lg text-gray-300 flex items-center gap-2">
              <i class="fas fa-list-ol"></i>
              Total de Itens: <span class="font-bold">{{ totalItems }}</span>
            </p>
            <p class="text-lg text-gray-300 flex items-center gap-2">
              <i class="fas fa-money-bill-wave"></i>
              Total: <span class="font-bold text-[#04d1b0]">R$ {{ totalPrice.toFixed(2) }}</span>
            </p>
          </div>
          <hr class="border-[#04d1b0] mb-4" />
          <!-- Cupom de desconto -->
          <div class="mb-4 p-4 rounded-lg border-2 border-dashed border-[#04d1b0] bg-gray-900 shadow flex flex-col gap-2">
            <div class="flex items-center gap-2 mb-2">
              <i class="fas fa-ticket-alt text-[#04d1b0] text-xl"></i>
              <label for="cupom" class="text-gray-200 font-semibold text-lg">Cupom de Desconto</label>
            </div>
            <div class="flex gap-2">
              <input
                type="text"
                id="cupom"
                v-model="cupom"
                class="flex-1 px-4 py-2 rounded-lg bg-gray-800 text-gray-200 border border-[#04d1b0] focus:outline-none focus:ring-2 focus:ring-[#04d1b0] transition"
                placeholder="Digite seu cupom"
              />
              <button
                @click="aplicarCupom"
                class="bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] hover:from-[#03b89a] hover:to-[#3e3ab8] text-white font-bold py-2 px-5 rounded-lg shadow transition duration-300 flex items-center gap-1"
              >
                <i class="fas fa-check"></i> Aplicar
              </button>
            </div>
            <transition name="fade">
              <p v-if="cupomMensagem" class="mt-2 text-[#04d1b0] font-semibold flex items-center gap-1">
                <i class="fas fa-check-circle"></i> {{ cupomMensagem }}
              </p>
            </transition>
            <transition name="fade">
              <p v-if="cupomErro" class="mt-2 text-red-400 font-semibold flex items-center gap-1">
                <i class="fas fa-times-circle"></i> {{ cupomErro }}
              </p>
            </transition>
          </div>
          <p v-if="desconto > 0" class="text-lg text-[#04d1b0] mb-4 flex items-center gap-2">
            <i class="fas fa-percentage"></i>
            Desconto aplicado: -R$ {{ desconto.toFixed(2) }}
          </p>
          <p class="text-lg text-[#04d1b0] mb-4 flex items-center gap-2" v-if="desconto > 0">
            <i class="fas fa-coins"></i>
            Total com desconto: <span class="font-bold">R$ {{ (totalPrice - desconto).toFixed(2) }}</span>
          </p>
          <button
            @click="finalizarCompra"
            class="w-full bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] hover:from-[#03b89a] hover:to-[#3e3ab8] text-white font-bold py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center gap-2 mt-2"
          >
            <i class="fas fa-credit-card"></i>
            Finalizar Compra
          </button>
        </div>
      </div>

      <div v-else class="text-center">
        <p class="text-lg text-gray-300 flex items-center justify-center gap-2">
          <i class="fas fa-shopping-basket text-2xl text-[#04d1b0]"></i>
          Seu carrinho está vazio.
        </p>
        <router-link
          to="/products"
          class="mt-4 inline-block bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] hover:from-[#03b89a] hover:to-[#3e3ab8] text-white font-bold py-3 px-6 rounded-lg transition duration-300 flex items-center gap-2"
        >
          <i class="fas fa-store"></i>
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
      cupom: "",
      desconto: 0,
      cupomMensagem: "",
      cupomErro: "",
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
    aplicarCupom() {
      // Exemplo simples: cupom "DEV10" dá 10% de desconto
      if (this.cupom.trim().toUpperCase() === "DEV10") {
        this.desconto = this.totalPrice * 0.1;
        this.cupomMensagem = "Cupom aplicado! Você ganhou 10% de desconto.";
        this.cupomErro = "";
      } else {
        this.desconto = 0;
        this.cupomMensagem = "";
        this.cupomErro = "Cupom inválido.";
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

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>