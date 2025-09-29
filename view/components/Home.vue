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
      <div class="container mx-auto flex flex-col md:flex-row items-center gap-12">
        <div class="md:w-1/2 text-center md:text-left">
          <h2 class="text-3xl md:text-4xl font-bold text-emerald-400 mb-4">
            Feito de Dev para Dev
          </h2>
          <p class="text-gray-300 leading-relaxed mb-6">
            A DevLooks nasceu da nossa paixão por código e design. Criamos mais do que produtos; criamos peças que contam a história da nossa comunidade, com a qualidade e o estilo que todo profissional de tecnologia merece.
          </p>
          <router-link to="/about" class="text-emerald-400 font-bold hover:text-emerald-300 transition duration-300 text-lg">
            Conheça nossa história <i class="fas fa-arrow-right ml-2"></i>
          </router-link>
        </div>
        <div class="md:w-1/2 grid grid-cols-2 gap-4">
            <div class="bg-gray-700 p-6 rounded-lg text-center flex flex-col items-center justify-center">
                <i class="fas fa-code text-4xl text-emerald-400 mb-2"></i>
                <span class="font-semibold text-white">Código Limpo</span>
            </div>
            <div class="bg-gray-700 p-6 rounded-lg text-center flex flex-col items-center justify-center">
                <i class="fas fa-tshirt text-4xl text-emerald-400 mb-2"></i>
                <span class="font-semibold text-white">Estilo Único</span>
            </div>
            <div class="bg-gray-700 p-6 rounded-lg text-center flex flex-col items-center justify-center">
                <i class="fas fa-users text-4xl text-emerald-400 mb-2"></i>
                <span class="font-semibold text-white">Comunidade</span>
            </div>
            <div class="bg-gray-700 p-6 rounded-lg text-center flex flex-col items-center justify-center">
                <i class="fas fa-infinity text-4xl text-emerald-400 mb-2"></i>
                <span class="font-semibold text-white">Inovação</span>
            </div>
        </div>
      </div>
    </section>

    <section class="container mx-auto py-20 px-4 md:px-6">
      <h2 class="text-3xl md:text-4xl font-bold text-emerald-400 text-center mb-12">
        <i class="fas fa-comments mr-2"></i>O Que Nossos Clientes Dizem
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="bg-gray-800 p-6 rounded-lg shadow-lg">
          <p class="text-gray-300 mb-4">"Produtos de ótima qualidade e entrega super rápida. A camiseta de 'Hello World' é minha favorita!"</p>
          <div class="flex items-center">
            <img src="https://i.pravatar.cc/50?u=female" alt="Cliente 1" class="w-12 h-12 rounded-full mr-4">
            <div>
              <p class="font-bold text-white">Juliana S.</p>
              <p class="text-sm text-gray-400">Desenvolvedora Frontend</p>
            </div>
          </div>
        </div>
        <div class="bg-gray-800 p-6 rounded-lg shadow-lg">
          <p class="text-gray-300 mb-4">"Finalmente uma loja que entende a gente! A caneca de JavaScript é perfeita para os longos dias de codificação."</p>
          <div class="flex items-center">
            <img src="https://i.pravatar.cc/50?u=male" alt="Cliente 2" class="w-12 h-12 rounded-full mr-4">
            <div>
              <p class="font-bold text-white">Ricardo M.</p>
              <p class="text-sm text-gray-400">Engenheiro de Software</p>
            </div>
          </div>
        </div>
        <div class="bg-gray-800 p-6 rounded-lg shadow-lg">
          <p class="text-gray-300 mb-4">"O criador de avatares é incrível! Pude fazer um avatar único para usar em todas as minhas redes."</p>
          <div class="flex items-center">
            <img src="https://i.pravatar.cc/50?u=woman" alt="Cliente 3" class="w-12 h-12 rounded-full mr-4">
            <div>
              <p class="font-bold text-white">Fernanda L.</p>
              <p class="text-sm text-gray-400">UI/UX Designer</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <transition name="fade">
      <button v-if="showScrollButton" @click="scrollToTop" class="fixed bottom-8 right-8 bg-emerald-500 hover:bg-emerald-600 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-xl transition-all duration-300 z-50">
        <i class="fas fa-arrow-up"></i>
      </button>
    </transition>
    </div>
</template>

<script>
import ProductService from '../services/ProductService'; // <<-- A CORREÇÃO PRINCIPAL ESTÁ AQUI

export default {
  name: "Home",
  data() {
    return {
      produtos: [],
      loading: false,
      error: null,
      showScrollButton: false,
    };
  },
  methods: {
    getImageUrl(imagePath) {
      if (!imagePath) {
        return 'https://via.placeholder.com/400x300?text=DevLooks';
      }
      const cleanPath = imagePath.replace(/^public[\\/]/, '');
      return `http://localhost:3000/${cleanPath.replace(/\\/g, '/')}`;
    },
    async fetchProducts() {
      try {
        this.loading = true;
        this.error = null;
        let products = await ProductService.getBestSellingProducts();
        if (products.length === 0) {
          const titleElement = document.querySelector('#products-section-title');
          if (titleElement) {
            titleElement.innerHTML = '<i class="fas fa-rocket mr-2"></i>Lançamentos';
          }
          products = await ProductService.getLatestProducts();
        }
        this.produtos = products;
      } catch (err) {
        this.error = 'Erro ao carregar os produtos.';
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
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