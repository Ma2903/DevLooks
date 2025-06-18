<template>
  <div class="min-h-screen bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] text-gray-200">
    <div class="container mx-auto py-16 px-4">
      <h1 class="text-4xl font-bold text-[#04d1b0] text-center mb-10 flex items-center justify-center gap-3">
        <i class="fas fa-th-list text-5xl text-[#04d1b0]"></i>
        Produtos Disponíveis
      </h1>
      <Search-bar
        :value="search"
        :category="category"
        @update:search="search = $event"
        @update:category="category = $event"
      />
      <!-- Exemplo de uso -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div
          v-for="produto in produtosFiltrados"
          :key="produto._id"
          class="relative bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-2xl hover:scale-105 border-2 border-transparent hover:border-purple-500 transition duration-300"
        >
          <span
            v-if="produto.novo"
            class="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold z-10"
          >
            <i class="fas fa-star"></i> Novo
          </span>
          <img
            :src="produto.image || '@/camisa.jpg'"
            :alt="produto.name"
            class="w-full h-48 object-cover rounded-lg mb-4"
          />
          <h2 class="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <i :class="categoriaIcone(produto.category)"></i>
            {{ produto.name }}
          </h2>
          <div class="flex items-center gap-1 mb-2">
            <i
              class="fas fa-star text-yellow-400"
              v-for="n in 4"
              :key="n"
            ></i>
            <i class="far fa-star text-yellow-400"></i>
            <span class="text-xs text-gray-400 ml-2">(12)</span>
          </div>
          <div class="flex justify-between items-center mb-4">
            <span class="text-green-500 font-bold text-lg">
              R$ {{ produto.price.toFixed(2) }}
            </span>
            <span
              class="bg-[#04d1b0] text-white text-sm font-medium px-4 py-1 rounded-lg"
            >
              #{{ produto.category }}
            </span>
          </div>
          <div class="mb-2">
            <span v-if="produto.price >= 150" class="text-[#04d1b0] font-bold">
              Frete Grátis
            </span>
            <span v-else class="text-gray-300">
              Frete: R$ 19,90
            </span>
          </div>
          <router-link
            :to="`/product/${produto._id}`"
            class="block bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] hover:from-[#03b89a] hover:to-[#3e3ab8] text-white font-bold py-2 px-4 rounded-lg text-center transition duration-300"
          >
            Ver Detalhes
          </router-link>
            <button
            v-if="userType !== 'admin'"
            @click="addToCart(produto)"
            class="w-full mt-3 bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] hover:from-[#03b89a] hover:to-[#3e3ab8] text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition"
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
import SearchBar from "@/components/Search-bar.vue";

export default {
  components: { SearchBar },
  name: "ProductList",
  data() {
    return {
      produtos: [],
      search: "",
      category: "",
      userType: "user",
    };
  },
  computed: {
    produtosFiltrados() {
      // Filtra produtos cujo nome começa com o texto digitado (case insensitive)
      return this.produtos.filter(produto => {
        const matchNome = this.search
          ? produto.name.toLowerCase().startsWith(this.search.toLowerCase())
          : true;
        const matchCategoria = this.category ? produto.category === this.category : true;
        return matchNome && matchCategoria;
      });
    }
  },
  async created() {
    await this.fetchProducts();
    const userDataRaw = localStorage.getItem("userData");
    if (userDataRaw && userDataRaw !== "undefined") {
      const userData = JSON.parse(userDataRaw);
      this.userType = userData.role || (userData.user && userData.user.role) || "user";
    }
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await axios.get("http://localhost:3000/api/products");
        this.produtos = response.data;
      } catch (error) {
        console.error("Erro ao carregar os produtos:", error.message);
        Swal.fire({
          icon: "error",
          title: "Erro",
          text: "Erro ao carregar os produtos. Tente novamente mais tarde.",
        });
      }
    },
    categoriaIcone(categoria) {
      // Retorna a classe do ícone com base na categoria do produto
      const icones = {
        camisas: "fas fa-tshirt",
        calcas: "fas fa-pants",
        // Adicione mais categorias e ícones conforme necessário
      };
      return icones[categoria] || "fas fa-box"; // Ícone padrão se a categoria não tiver ícone específico
    },
    addToCart(produto) {
      const cart = localStorage.getItem("cart");
      const cartItems = cart ? JSON.parse(cart) : [];

      const existingItem = cartItems.find((item) => item._id === produto._id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cartItems.push({ ...produto, quantity: 1 });
      }

      localStorage.setItem("cart", JSON.stringify(cartItems));

      Swal.fire({
        title: "Produto Adicionado!",
        text: `1 unidade de "${produto.name}" foi adicionada ao carrinho.`,
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
  },
};
</script>

<style scoped>
@import '@fortawesome/fontawesome-free/css/all.css';

body {
  font-family: 'Fira Code', monospace;
}

button, .router-link-active {
  background-image: linear-gradient(to right, #04d1b0, #4e44e1);
  color: #fff;
  font-weight: bold;
  border-radius: 0.75rem;
  transition: transform 0.2s, background 0.2s;
}
button:hover, .router-link-active:hover {
  background-image: linear-gradient(to right, #03b89a, #3e3ab8);
  transform: scale(1.05);
}

.bg-gray-800 {
  background: #23272f;
  border-radius: 0.75rem;
}

input, select {
  background: #1f2937;
  color: #e5e7eb;
  border-radius: 0.5rem;
  border: none;
  outline: none;
  font-family: 'Fira Code', monospace;
}
input:focus, select:focus {
  border: 2px solid #04d1b0;
}
</style>