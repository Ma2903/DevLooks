<template>
  <div class="min-h-screen bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] text-gray-900">
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

      <div v-if="loading" class="text-center">
        <i class="fas fa-spinner fa-spin text-4xl text-white"></i>
        <p class="mt-2 text-lg">A carregar produtos...</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <div v-for="product in produtosFiltrados" :key="product._id" class="bg-gray-900 rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 flex flex-col relative">
          <button
            v-if="isLoggedIn"
            @click.stop="toggleWishlist(product._id)"
            class="absolute top-3 right-3 z-20 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg backdrop-blur-sm touch-manipulation"
            :class="isInWishlist(product._id) 
              ? 'bg-red-500 text-white hover:bg-red-600 hover:scale-110' 
              : 'bg-gray-800/90 text-red-400 hover:bg-red-500 hover:text-white hover:scale-110'"
            :title="isInWishlist(product._id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'"
            :aria-label="isInWishlist(product._id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'"
          >
            <i :class="isInWishlist(product._id) ? 'fas fa-heart text-xl' : 'far fa-heart text-xl'"></i>
          </button>

          <router-link :to="'/products/' + product._id" class="flex flex-col flex-grow">
            <img class="w-full h-56 object-cover" :src="getImageUrl(product.image)" :alt="product.name" />
            <div class="p-6 flex flex-col flex-grow">
              <h2 class="text-xl font-bold text-white mb-2">{{ product.name }}</h2>
              <p class="text-gray-400 text-sm mb-4 h-16 overflow-hidden">{{ product.description }}</p>
              <div class="flex items-center justify-between mt-auto">
                <span class="text-2xl font-bold text-[#04d1b0]">R${{ product.price.toFixed(2) }}</span>
                <button @click.stop.prevent="addToCart(product)" class="bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] hover:from-[#03b89a] hover:to-[#3e3ab8] text-white font-bold py-2 px-4 rounded z-10">
                  <i class="fas fa-cart-plus"></i>
                </button>
              </div>
            </div>
          </router-link>
        </div>
      </div>
       <div v-if="!loading && produtosFiltrados.length === 0" class="text-center py-10">
        <i class="fas fa-search-minus text-5xl text-gray-500 mb-4"></i>
        <p class="text-xl text-gray-400">Nenhum produto encontrado com os filtros atuais.</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "@/services/main.js";
import { getImageUrl } from "@/services/config.js";
import Swal from 'sweetalert2';
import SearchBar from "@/components/Search-bar.vue"; // Importa o componente SearchBar

export default {
  name: "ProductList",
  components: {
    SearchBar // Regista o componente para uso no template
  },
  data() {
    return {
      products: [],
      loading: true,
      search: "",
      category: "",
      wishlistIds: [], // Array para armazenar IDs dos produtos favoritados
    };
  },
  computed: {
    produtosFiltrados() {
      let filtered = this.products;
      
      // Aplica filtros de busca e categoria
      if (this.search || this.category) {
        filtered = this.products.filter(product => {
          const matchSearch = product.name.toLowerCase().includes(this.search.toLowerCase()) ||
                              product.description.toLowerCase().includes(this.search.toLowerCase());
          const matchCategory = this.category ? product.category === this.category : true;
          return matchSearch && matchCategory;
        });
      }
      
      // Ordena alfabeticamente por nome
      return filtered.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' }));
    },
    isLoggedIn() {
      return !!localStorage.getItem('token');
    }
  },
  async created() {
    await this.fetchProducts();
    await this.fetchWishlist();
  },
  methods: {
    async fetchProducts() {
      this.loading = true;
      try {
        const response = await axios.get("/api/products");
        this.products = response.data;
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        Swal.fire('Erro', 'Não foi possível carregar os produtos.', 'error');
      } finally {
        this.loading = false;
      }
    },
    async fetchWishlist() {
      if (!this.isLoggedIn) {
        this.wishlistIds = [];
        return;
      }
      try {
        const response = await axios.get('/api/wishlist');
        this.wishlistIds = response.data.products.map(p => p._id);
      } catch (error) {
        console.error('Erro ao buscar wishlist:', error);
        this.wishlistIds = [];
      }
    },
    isInWishlist(productId) {
      return this.wishlistIds.includes(productId);
    },
    getImageUrl(imagePath) {
      return getImageUrl(imagePath);
    },
    async addToCart(product) {
      const token = localStorage.getItem('token');
      if (!token) {
        Swal.fire({
          title: 'Login Necessário',
          text: 'Você precisa fazer login para adicionar itens ao carrinho.',
          icon: 'info',
          background: "#1F2937",
          color: "#E5E7EB"
        }).then(() => this.$router.push('/login'));
        return;
      }

      if (product.category === 'camisetas' && product.sizes && product.sizes.length > 0) {
        this.$router.push(`/products/${product._id}`);
        return;
      }

      try {
        const cartItem = {
          productId: product._id,
          quantity: 1,
          name: product.name,
          price: product.price,
          image: product.image
        };

        await axios.post('/api/cart/add', cartItem, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        Swal.fire({
          title: "Produto Adicionado!",
          icon: "success",
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          background: "#1F2937",
          color: "#E5E7EB",
        });

      } catch (error) {
        Swal.fire({
          title: 'Erro',
          text: 'Não foi possível adicionar o item ao carrinho.',
          icon: 'error',
          background: "#1F2937",
          color: "#E5E7EB"
        });
      }
    },
    async toggleWishlist(productId) {
      const token = localStorage.getItem('token');
      if (!token) {
        Swal.fire({
          title: 'Login Necessário',
          text: 'Você precisa fazer login para adicionar aos favoritos.',
          icon: 'info',
          background: "#1F2937",
          color: "#E5E7EB"
        }).then(() => this.$router.push('/login'));
        return;
      }

      const isCurrentlyInWishlist = this.isInWishlist(productId);

      try {
        if (isCurrentlyInWishlist) {
          // Remove dos favoritos
          await axios.delete(`/api/wishlist/remove/${productId}`);
          this.wishlistIds = this.wishlistIds.filter(id => id !== productId);
          
          Swal.fire({
            title: "Removido dos Favoritos!",
            icon: "info",
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
            background: "#1F2937",
            color: "#E5E7EB",
          });
        } else {
          // Adiciona aos favoritos
          await axios.post('/api/wishlist/add', { productId });
          this.wishlistIds.push(productId);

          Swal.fire({
            title: "Adicionado aos Favoritos!",
            icon: "success",
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
            background: "#1F2937",
            color: "#E5E7EB",
          });
        }
      } catch (error) {
        console.error('Erro ao atualizar wishlist:', error);
        const message = error.response?.data?.message || 'Não foi possível atualizar os favoritos.';
        Swal.fire({
          title: 'Erro',
          text: message,
          icon: 'error',
          background: "#1F2937",
          color: "#E5E7EB"
        });
      }
    }
  }
};
</script>

<style scoped>
@import '@fortawesome/fontawesome-free/css/all.css';
</style>