<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] text-gray-200">
    <div class="m-10 bg-gray-900 p-10 rounded-3xl shadow-2xl w-full max-w-6xl flex flex-col md:flex-row">
      <div class="w-full md:w-1/2 h-96 flex flex-col items-center justify-center overflow-hidden bg-gray-800 rounded-lg mb-6 md:mb-0 md:mr-6 p-4">
        <div class="relative group w-full h-72 flex items-center justify-center">
          <img
            class="object-contain max-h-72 w-full transition-transform duration-300 group-hover:scale-105 bg-gray-900 rounded-lg shadow"
            :src="getImageUrl(product.image)"
            :alt="product.name"
          />
          <span v-if="product.stock < 5" class="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <i class="fas fa-exclamation-triangle mr-1"></i> Últimas unidades
          </span>
        </div>
      </div>
      <div class="w-full md:w-1/2 flex flex-col justify-between">
        <div>
          <h1 class="text-4xl font-extrabold text-[#04d1b0] mb-4 flex items-center gap-2">
            <i class="fas fa-box-open text-[#04d1b0]"></i> {{ product.name }}
          </h1>
          <div class="flex items-center gap-3 mb-2">
            <span class="bg-[#23272f] text-[#04d1b0] text-xs font-medium px-3 py-1 rounded-lg flex items-center gap-1">
              <i class="fas fa-tag"></i> {{ product.category }}
            </span>
          </div>
          <p class="text-gray-300 text-lg mb-6">{{ product.description }}</p>
        </div>

        <div class="flex items-center gap-4 mb-6">
          <span class="text-3xl font-bold text-[#04d1b0] flex items-center gap-2">
            <i class="fas fa-money-bill-wave"></i> R${{ product.price ? product.price.toFixed(2) : '0.00' }}
          </span>
          <span :class="product.stock < 5 ? 'bg-red-600' : 'bg-[#04d1b0]'" class="text-white text-xs font-semibold px-3 py-1 rounded-lg flex items-center gap-1">
            <i class="fas fa-boxes"></i> {{ product.stock }} em estoque
          </span>
        </div>

        <div v-if="product.category === 'camisetas' && product.sizes && product.sizes.length > 0" class="mb-6">
            <label class="block text-gray-300 text-sm font-medium mb-2">Selecione o Tamanho:</label>
            <div class="flex flex-wrap gap-2">
                <button
                  v-for="size in product.sizes"
                  :key="size"
                  @click="selectSize(size)"
                  :class="[
                    'text-white text-sm font-semibold px-4 py-2 rounded-lg transition-transform transform hover:scale-105',
                    selectedSize === size ? 'bg-[#04d1b0] ring-2 ring-offset-2 ring-offset-gray-900 ring-white' : 'bg-gray-700 hover:bg-gray-600'
                  ]"
                >
                    {{ size }}
                </button>
            </div>
        </div>

        <div class="mb-6">
          <label for="quantity" class="block text-gray-300 text-sm font-medium mb-2">Quantidade</label>
          <div class="flex items-center space-x-4">
            <button @click="decreaseQuantity" class="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-lg"><i class="fas fa-minus"></i></button>
            <input type="number" id="quantity" v-model.number="quantity" min="1" :max="product.stock" class="w-16 text-center bg-gray-800 text-gray-200 text-lg font-bold py-2 px-4 rounded-lg"/>
            <button @click="increaseQuantity" class="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-lg"><i class="fas fa-plus"></i></button>
          </div>
        </div>

        <div class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <router-link to="/products" class="bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg flex items-center justify-center gap-2">
            <i class="fas fa-arrow-left"></i> Voltar
          </router-link>
          <button v-if="userType !== 'admin'" @click="addToCart(product)" class="bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] text-white font-bold py-3 px-6 rounded-lg shadow-lg flex items-center justify-center gap-2">
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
      product: { sizes: [] },
      quantity: 1,
      userType: "user",
      selectedSize: null,
    };
  },
  created() {
    const productId = this.$route.params.id;
    this.fetchProduct(productId);
    const userDataRaw = localStorage.getItem("userData");
    if (userDataRaw && userDataRaw !== "undefined") {
      const userData = JSON.parse(userDataRaw);
      this.userType = userData.role || (userData.user && userData.user.role) || "user";
    }
  },
  methods: {
    getImageUrl(imagePath) {
      if (!imagePath) return '';
      const cleanPath = imagePath.replace(/^public[\\/]/, '');
      return `http://localhost:3000/${cleanPath.replace(/\\/g, '/')}`;
    },
    async fetchProduct(productId) {
      try {
        const response = await axios.get(`http://localhost:3000/api/products/${productId}`);
        this.product = response.data;
      } catch (error) {
        console.error("Erro ao carregar o produto:", error.message);
      }
    },
    selectSize(size) {
      this.selectedSize = size;
    },
    addToCart(product) {
      if (product.category === 'camisetas' && !this.selectedSize) {
        Swal.fire({ icon: 'warning', title: 'Tamanho não selecionado', text: 'Por favor, selecione um tamanho.', background: "#1F2937", color: "#E5E7EB" });
        return;
      }
      const cart = localStorage.getItem("cart");
      const cartItems = cart ? JSON.parse(cart) : [];
      const itemIdentifier = product._id + (this.selectedSize || '');
      const existingItem = cartItems.find((item) => (item._id + (item.selectedSize || '')) === itemIdentifier);
      if (existingItem) {
        existingItem.quantity += this.quantity;
      } else {
        cartItems.push({ ...product, quantity: this.quantity, selectedSize: this.selectedSize });
      }
      localStorage.setItem("cart", JSON.stringify(cartItems));
      Swal.fire({
        title: "Produto Adicionado!",
        text: `${this.quantity}x "${product.name}" (Tamanho: ${this.selectedSize || 'Único'}) adicionado.`,
        icon: "success",
        background: "#1F2937",
        color: "#E5E7EB",
        showCancelButton: true,
        confirmButtonText: "Ir para o Carrinho",
        cancelButtonText: "Continuar Comprando",
      }).then((result) => {
        if (result.isConfirmed) {
          this.$router.push("/cart");
        }
      });
    },
    increaseQuantity() {
      if (this.quantity < this.product.stock) this.quantity++;
    },
    decreaseQuantity() {
      if (this.quantity > 1) this.quantity--;
    },
  },
};
</script>

<style scoped>
@import '@fortawesome/fontawesome-free/css/all.css';
</style>