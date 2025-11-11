<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4">
    <div class="max-w-7xl mx-auto">
      <div class="bg-gray-800/50 backdrop-blur-lg rounded-3xl shadow-2xl border-2 border-[#04d1b0] p-8">
        <div class="flex items-center justify-between mb-8">
          <div class="flex items-center gap-3">
            <i class="fas fa-heart text-[#04d1b0] text-3xl"></i>
            <h1 class="text-3xl font-bold text-white">Lista de Desejos</h1>
          </div>
          <div class="flex items-center gap-4">
            <span class="text-gray-400">
              <i class="fas fa-list mr-2"></i>
              {{ totalItems }} {{ totalItems === 1 ? 'item' : 'itens' }}
            </span>
            <button
              v-if="totalItems > 0"
              @click="clearWishlist"
              class="text-red-400 hover:text-red-300 transition"
            >
              <i class="fas fa-trash mr-2"></i>
              Limpar Lista
            </button>
          </div>
        </div>

        <div v-if="loading" class="text-center py-16">
          <i class="fas fa-spinner fa-spin text-[#04d1b0] text-4xl mb-4"></i>
          <p class="text-gray-400">Carregando sua lista de desejos...</p>
        </div>

        <div v-else-if="totalItems === 0" class="text-center py-16">
          <i class="fas fa-heart-broken text-gray-600 text-6xl mb-4"></i>
          <h2 class="text-xl font-semibold text-gray-400 mb-2">Sua lista está vazia</h2>
          <p class="text-gray-500 mb-6">Adicione produtos que você deseja comprar mais tarde!</p>
          <router-link
            to="/"
            class="inline-block bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] text-white font-bold py-3 px-8 rounded-lg transition transform hover:scale-105"
          >
            <i class="fas fa-shopping-bag mr-2"></i>
            Explorar Produtos
          </router-link>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="product in products"
            :key="product._id"
            class="bg-gray-900/50 rounded-xl border border-gray-700 hover:border-[#04d1b0] transition overflow-hidden group"
          >
            <div class="relative aspect-square overflow-hidden">
              <img
                :src="product.image_url || '/images/placeholder.png'"
                :alt="product.name"
                class="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />
              <button
                @click="removeFromWishlist(product._id)"
                class="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white w-10 h-10 rounded-full flex items-center justify-center transition shadow-lg"
              >
                <i class="fas fa-times"></i>
              </button>
              <div
                v-if="product.stock === 0"
                class="absolute inset-0 bg-black/70 flex items-center justify-center"
              >
                <span class="text-red-400 font-bold text-lg">Sem Estoque</span>
              </div>
            </div>

            <div class="p-5">
              <h3 class="text-white font-bold text-lg mb-2 line-clamp-2">
                {{ product.name }}
              </h3>

              <div class="flex items-center gap-2 mb-3">
                <span class="text-2xl font-bold text-[#04d1b0]">
                  R$ {{ (product.promotion_price || product.price).toFixed(2) }}
                </span>
                <span
                  v-if="product.promotion_price"
                  class="text-gray-500 line-through text-sm"
                >
                  R$ {{ product.price.toFixed(2) }}
                </span>
              </div>

              <div class="flex gap-2">
                <button
                  @click="moveToCart(product._id)"
                  :disabled="product.stock === 0"
                  class="flex-1 bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] text-white font-bold py-2 px-4 rounded-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i class="fas fa-cart-plus mr-2"></i>
                  Mover para Carrinho
                </button>
                <router-link
                  :to="`/products/${product._id}`"
                  class="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition"
                >
                  <i class="fas fa-eye"></i>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/services/main';
import Swal from 'sweetalert2';

export default {
  name: 'Wishlist',
  data() {
    return {
      products: [],
      totalItems: 0,
      loading: true
    };
  },
  mounted() {
    this.loadWishlist();
  },
  methods: {
    async loadWishlist() {
      this.loading = true;
      try {
        const response = await api.get('/api/wishlist');
        this.products = response.data.products || [];
        this.totalItems = response.data.totalItems || 0;
      } catch (error) {
        console.error('Erro ao carregar wishlist:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Não foi possível carregar sua lista de desejos',
          background: '#1F2937',
          color: '#E5E7EB'
        });
      } finally {
        this.loading = false;
      }
    },

    async removeFromWishlist(productId) {
      try {
        await api.delete(`/api/wishlist/remove/${productId}`);

        await Swal.fire({
          icon: 'success',
          title: 'Removido!',
          text: 'Produto removido da lista de desejos',
          timer: 2000,
          showConfirmButton: false,
          background: '#1F2937',
          color: '#E5E7EB'
        });

        this.loadWishlist();
      } catch (error) {
        console.error('Erro ao remover produto:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Não foi possível remover o produto',
          background: '#1F2937',
          color: '#E5E7EB'
        });
      }
    },

    async moveToCart(productId) {
      try {
        await api.post('/api/wishlist/move-to-cart', { productId });

        const product = this.products.find(p => p._id === productId);
        await api.post('/api/cart/add', {
          productId: productId,
          quantity: 1
        });

        await Swal.fire({
          icon: 'success',
          title: 'Adicionado ao Carrinho!',
          text: `${product.name} foi movido para o carrinho`,
          timer: 2000,
          showConfirmButton: false,
          background: '#1F2937',
          color: '#E5E7EB'
        });

        this.loadWishlist();
      } catch (error) {
        console.error('Erro ao mover para carrinho:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: error.response?.data?.message || 'Não foi possível mover o produto',
          background: '#1F2937',
          color: '#E5E7EB'
        });
      }
    },

    async clearWishlist() {
      const result = await Swal.fire({
        title: 'Tem certeza?',
        text: 'Isso removerá todos os produtos da sua lista de desejos',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, limpar!',
        cancelButtonText: 'Cancelar',
        background: '#1F2937',
        color: '#E5E7EB',
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280'
      });

      if (result.isConfirmed) {
        try {
          await api.delete('/api/wishlist/clear');

          await Swal.fire({
            icon: 'success',
            title: 'Lista Limpa!',
            text: 'Todos os produtos foram removidos',
            timer: 2000,
            showConfirmButton: false,
            background: '#1F2937',
            color: '#E5E7EB'
          });

          this.loadWishlist();
        } catch (error) {
          console.error('Erro ao limpar wishlist:', error);
          Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: 'Não foi possível limpar a lista',
            background: '#1F2937',
            color: '#E5E7EB'
          });
        }
      }
    }
  }
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.aspect-square {
  aspect-ratio: 1 / 1;
}
</style>
