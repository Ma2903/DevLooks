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

      <div v-if="loading" class="text-center">
        <i class="fas fa-spinner fa-spin text-4xl text-white"></i>
        <p class="mt-2 text-lg">A carregar produtos...</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <div v-for="product in produtosFiltrados" :key="product._id" class="bg-gray-900 rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 flex flex-col">
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
      search: "", // Adiciona a propriedade para a busca
      category: "", // Adiciona a propriedade para a categoria
    };
  },
  computed: {
    // Lógica de filtro reintroduzida
    produtosFiltrados() {
      if (!this.search && !this.category) {
        return this.products;
      }
      return this.products.filter(product => {
        const matchSearch = product.name.toLowerCase().includes(this.search.toLowerCase()) || 
                            product.description.toLowerCase().includes(this.search.toLowerCase());
        const matchCategory = this.category ? product.category === this.category : true;
        return matchSearch && matchCategory;
      });
    }
  },
  async created() {
    await this.fetchProducts();
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
    getImageUrl(imagePath) {
      if (!imagePath) return '';
      const cleanPath = imagePath.replace(/^public[\\/]/, '');
      return `http://localhost:3000/${cleanPath.replace(/\\/g, '/')}`;
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
    }
  }
};
</script>

<style scoped>
@import '@fortawesome/fontawesome-free/css/all.css';
</style>