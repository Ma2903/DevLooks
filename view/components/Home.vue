<template>
  <div class="bg-gray-900 min-h-screen font-sans text-gray-200">
    <section class="relative text-white text-center py-40 overflow-hidden">
      <div class="absolute inset-0 bg-black opacity-50 bg-cover bg-center" style="background-image: url('https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80');"></div>
      <div class="relative z-10 container mx-auto px-4 md:px-6">
        <h1 class="text-5xl md:text-6xl font-extrabold mb-4 text-emerald-400 drop-shadow-lg animate-fade-in-down">
          DevLooks
        </h1>
        <p class="text-lg md:text-xl mb-8 text-gray-200 max-w-2xl mx-auto animate-fade-in-down" style="animation-delay: 0.2s;">
          O seu estilo, o seu código. Produtos criados para celebrar a cultura da tecnologia.
        </p>
        <router-link to="/products" class="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 animate-fade-in-up text-lg">
          <i class="fas fa-store mr-2"></i> Explorar Coleção
        </router-link>
      </div>
    </section>

    <section class="bg-gray-800/50 py-16">
      <div class="container mx-auto px-4 md:px-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div class="p-6">
            <i class="fas fa-shipping-fast text-4xl text-emerald-400 mb-4"></i>
            <h3 class="text-xl font-bold text-white mb-2">Entrega Rápida</h3>
            <p class="text-gray-400">Receba seus produtos em tempo recorde, em qualquer lugar do Brasil.</p>
          </div>
          <div class="p-6">
            <i class="fas fa-lock text-4xl text-emerald-400 mb-4"></i>
            <h3 class="text-xl font-bold text-white mb-2">Pagamento Seguro</h3>
            <p class="text-gray-400">Compre com tranquilidade usando os métodos de pagamento mais seguros.</p>
          </div>
          <div class="p-6">
            <i class="fas fa-headset text-4xl text-emerald-400 mb-4"></i>
            <h3 class="text-xl font-bold text-white mb-2">Suporte Dedicado</h3>
            <p class="text-gray-400">Nossa equipe está sempre pronta para ajudar com qualquer dúvida.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="container mx-auto py-20 px-4 md:px-6">
      <h2 id="products-section-title" class="text-3xl md:text-4xl font-bold text-emerald-400 text-center mb-12">
        <i class="fas fa-fire mr-2"></i>Mais Vendidos
      </h2>
      <div v-if="loading" class="text-center text-xl">
        <i class="fas fa-spinner fa-spin mr-2"></i> Carregando produtos...
      </div>
      <div v-if="error" class="text-center text-red-400 bg-red-900/30 p-4 rounded-lg">
        {{ error }}
      </div>
      <div v-if="!loading && produtos.length === 0 && !error" class="text-center text-gray-400">
        Ainda não há produtos mais vendidos para exibir.
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div v-for="produto in produtos" :key="produto._id" class="bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 group">
          <router-link :to="`/products/${produto._id}`" class="block">
            <img :src="getImageUrl(produto.image)" :alt="produto.name" class="w-full h-56 object-cover"/>
          </router-link>
          <div class="p-6">
            <h3 class="text-lg font-bold text-white mb-2 truncate">{{ produto.name }}</h3>
            <div class="flex justify-between items-center">
              <span class="text-emerald-400 font-bold text-xl">R$ {{ produto.price ? produto.price.toFixed(2) : '0.00' }}</span>
              <router-link :to="`/products/${produto._id}`" class="bg-emerald-500 text-white px-4 py-2 rounded-md text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                Ver mais
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-gray-800/50 py-24 px-4 md:px-6">
        </section>
    <section class="container mx-auto py-20 px-4 md:px-6">
        </section>
    <transition name="fade">
      <button v-if="showScrollButton" @click="scrollToTop" class="fixed bottom-8 right-8 bg-emerald-500 hover:bg-emerald-600 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-xl transition-all duration-300 z-50">
        <i class="fas fa-arrow-up"></i>
      </button>
    </transition>
  </div>
</template>

<script>
import ProductService from '../services/ProductService';

export default {
  name: "Home",
  data() {
    return {
      produtos: [],
      loading: true, // Inicia como true para mostrar o spinner
      error: null,
      showScrollButton: false,
    };
  },
  methods: {
    // <<--- MÉTODO getImageUrl CORRIGIDO E SIMPLIFICADO --- >>
    getImageUrl(imagePath) {
      if (!imagePath) {
        // Retorna uma URL de placeholder que funciona ou uma imagem local
        return 'https://i.imgur.com/L1e3z0x.png'; // Um placeholder genérico
      }
      // Constrói a URL completa e confiável para a imagem do produto
      return `http://localhost:3000/${imagePath.replace(/\\/g, '/')}`;
    },
    
    // <<--- MÉTODO fetchProducts CORRIGIDO E SIMPLIFICADO --- >>
    async fetchProducts() {
      this.loading = true;
      this.error = null;
      try {
        // Chama diretamente o método para buscar os mais vendidos
        const products = await ProductService.getBestSellingProducts();
        this.produtos = products;
      } catch (err) {
        this.error = 'Ops! Não foi possível carregar os produtos mais vendidos.';
        console.error("Erro detalhado:", err);
      } finally {
        this.loading = false;
      }
    },
    
    // Seus outros métodos continuam iguais
    handleScroll() {
      this.showScrollButton = window.scrollY > 300;
    },
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  },
  async mounted() {
    await this.fetchProducts();
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
};
</script>

<style scoped>
/* SEU CSS PERMANECE IGUAL */
@import '@fortawesome/fontawesome-free/css/all.css';

@keyframes fade-in-down {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in-down {
  animation: fade-in-down 0.6s ease-out forwards;
}
.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out forwards 0.4s;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>