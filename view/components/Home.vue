<template>
  <div class="bg-gray-900 min-h-screen font-mono text-gray-200 relative">
    <section id="home" class="relative bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] text-white text-center py-40 overflow-hidden">
      <div class="absolute inset-0 bg-black opacity-60 bg-cover bg-center" style="background-image: url('https://cdn.pixabay.com/photo/2016/11/29/09/08/online-shopping-1869235_960_720.jpg');"></div>
      <div class="relative z-10 container mx-auto px-4 md:px-6">
        <h1 class="text-5xl md:text-6xl font-extrabold mb-6 text-[#04d1b0] animate-fade-in">
          <i class="fas fa-shopping-cart mr-2"></i>Bem-vindo à DevLooks
        </h1>
        <p class="text-lg md:text-xl mb-8 text-gray-200 animate-fade-in">
          Descubra produtos exclusivos para personalizar seu estilo e mostrar sua paixão por tecnologia!
        </p>
        <router-link to="/products" class="bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] hover:from-[#03b89a] hover:to-[#3e3ab8] text-white font-bold py-4 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 animate-fade-in text-lg">
          <i class="fas fa-store mr-2"></i> Ver Produtos
        </router-link>
        <div class="mt-6 flex justify-center gap-4">
          <span class="bg-[#04d1b0] text-white px-4 py-2 rounded-full font-bold shadow-lg animate-bounce">
            Frete grátis acima de R$ 150
          </span>
          <span class="bg-[#4e44e1] text-white px-4 py-2 rounded-full font-bold shadow-lg animate-pulse">
            Use PRIMEIRACOMPRA10% e ganhe 10% OFF!
          </span>
        </div>
      </div>
    </section>

    <section id="categories" class="container mx-auto py-16 px-4 md:px-6 text-center">
      <h2 class="text-3xl md:text-4xl font-semibold text-[#04d1b0] mb-6">
        <i class="fas fa-th-large mr-2"></i>Categorias
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div v-for="cat in categorias" :key="cat.nome" class="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-2xl border-2 border-transparent hover:border-[#04d1b0] transition duration-300 flex flex-col items-center cursor-default group">
          <i :class="cat.icone + ' text-5xl text-[#04d1b0] mb-4 group-hover:scale-110 transition'"></i>
          <h3 class="text-lg font-bold text-white">{{ cat.nome }}</h3>
          <p class="text-gray-300 mt-2">{{ cat.desc }}</p>
        </div>
      </div>
    </section>

    <section id="best-sellers" class="container mx-auto py-16 px-4 md:px-6">
      <h2 id="products-section-title" class="text-3xl md:text-4xl font-semibold text-[#04d1b0] text-center mb-8">
        <i class="fas fa-fire mr-2"></i>Mais Vendidos
      </h2>
      <div v-if="loading" class="text-center text-xl">
        <i class="fas fa-spinner fa-spin mr-2"></i> Carregando produtos...
      </div>
      <div v-if="error" class="text-center text-red-400 bg-red-900/30 p-4 rounded-lg">
        {{ error }}
      </div>
      <div v-if="!loading && produtos.length === 0 && !error" class="text-center text-gray-400">
        Nenhum produto para exibir no momento.
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div v-for="produto in produtos" :key="produto._id" class="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 flex flex-col relative">
            <button
              v-if="isLoggedIn && userType !== 'admin'"
              @click.stop="toggleWishlist(produto._id)"
              class="absolute top-3 right-3 z-20 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg backdrop-blur-sm"
              :class="isInWishlist(produto._id) 
                ? 'bg-red-500 text-white hover:bg-red-600 hover:scale-110' 
                : 'bg-gray-900/90 text-red-400 hover:bg-red-500 hover:text-white hover:scale-110'"
              :title="isInWishlist(produto._id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'"
              :aria-label="isInWishlist(produto._id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'"
            >
              <i :class="isInWishlist(produto._id) ? 'fas fa-heart text-xl' : 'far fa-heart text-xl'"></i>
            </button>

            <router-link :to="`/products/${produto._id}`" class="block mb-4">
              <img :src="getImageUrl(produto.image)" :alt="produto.name" class="w-full h-48 object-cover rounded-lg"/>
            </router-link>
            <h3 class="text-lg font-bold text-white mb-2 truncate">{{ produto.name }}</h3>
            <div class="flex justify-between items-center mb-4">
              <span class="text-[#04d1b0] font-bold text-lg">R$ {{ produto.price ? produto.price.toFixed(2) : '0.00' }}</span>
              <span class="bg-[#4e44e1] text-white text-sm font-medium px-4 py-1 rounded-lg">#{{ produto.category }}</span>
            </div>
            <div class="mt-auto">
                <router-link :to="`/products/${produto._id}`" class="block bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] hover:from-[#03b89a] hover:to-[#3e3ab8] text-white font-bold py-2 px-4 rounded-lg text-center transition duration-300 mb-2">
                Ver Detalhes
                </router-link>
                <button v-if="userType !== 'admin'" @click="addToCart(produto)" class="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition">
                <i class="fas fa-cart-plus"></i> Adicionar
                </button>
            </div>
        </div>
      </div>
    </section>

    <section id="benefits" class="bg-gray-800/50 py-16">
      <div class="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div>
          <i class="fas fa-shipping-fast text-5xl text-[#04d1b0] mb-4"></i>
          <h3 class="text-lg font-bold text-white">Frete Grátis</h3>
          <p class="text-gray-300">Para compras acima de R$ 150,00.</p>
        </div>
        <div>
          <i class="fas fa-sync-alt text-5xl text-[#04d1b0] mb-4"></i>
          <h3 class="text-lg font-bold text-white">Devolução Fácil</h3>
          <p class="text-gray-300">30 dias para devolução sem custo.</p>
        </div>
        <div>
          <i class="fas fa-lock text-5xl text-[#04d1b0] mb-4"></i>
          <h3 class="text-lg font-bold text-white">Pagamento Seguro</h3>
          <p class="text-gray-300">Seus dados protegidos com criptografia.</p>
        </div>
      </div>
    </section>
    
    <section class="container mx-auto py-16 px-4 md:px-6">
        <div class="bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] py-8 text-center rounded-lg">
            <h3 class="text-2xl font-bold text-white mb-4">
                <i class="fas fa-envelope mr-2"></i>Inscreva-se na nossa Newsletter
            </h3>
            <p class="text-gray-200 mb-6">Receba novidades, promoções e ofertas exclusivas!</p>
            <router-link to="/register" class="bg-white text-[#04d1b0] font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
                <i class="fas fa-user-plus mr-2"></i> Inscrever-se
            </router-link>
        </div>
    </section>
    
    <section class="container mx-auto py-16 px-4 md:px-6 text-center">
      <h2 class="text-3xl md:text-4xl font-semibold text-[#04d1b0] mb-6">
        <i class="fas fa-comments mr-2"></i>O que dizem nossos clientes
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="bg-gray-800 p-6 rounded-lg shadow-lg">
          <p class="text-gray-300 mb-4">"Produtos de ótima qualidade e entrega super rápida. A camiseta de 'Hello World' é minha favorita!"</p>
          <div class="flex items-center justify-center">
        <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Cliente 1" class="w-12 h-12 rounded-full mr-4">
        <div>
          <p class="font-bold text-white">Lucas Martins</p>
          <p class="text-sm text-gray-400">Desenvolvedor Full-Stack</p>
        </div>
          </div>
        </div>
        <div class="bg-gray-800 p-6 rounded-lg shadow-lg">
          <p class="text-gray-300 mb-4">"Finalmente uma loja que entende a gente! A caneca de JavaScript é perfeita para os longos dias de codificação."</p>
          <div class="flex items-center justify-center">
        <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Cliente 2" class="w-12 h-12 rounded-full mr-4">
        <div>
          <p class="font-bold text-white">Marina Souza</p>
          <p class="text-sm text-gray-400">Engenheira de Software</p>
        </div>
          </div>
        </div>
        <div class="bg-gray-800 p-6 rounded-lg shadow-lg">
          <p class="text-gray-300 mb-4">"O criador de avatares é incrível! Pude fazer um avatar único para usar em todas as minhas redes."</p>
          <div class="flex items-center justify-center">
            <img src="https://i.pravatar.cc/50?u=woman" alt="Cliente 3" class="w-12 h-12 rounded-full mr-4">
            <div>
              <p class="font-bold text-white">Fernanda L.</p>
              <p class="text-sm text-gray-400">UI/UX Designer</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <button v-show="showScrollButton" @click="scrollToTop" class="fixed bottom-4 right-4 bg-[#04d1b0] hover:bg-[#4e44e1] text-white font-bold py-3 px-4 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
      <i class="fas fa-arrow-up"></i>
    </button>
  </div>
</template>

<script>
import ProductService from '../services/ProductService';
import { getImageUrl } from '../services/config.js';
import Swal from 'sweetalert2';
// Importe o serviço de API centralizado
import api from '@/services/main.js';

export default {
  name: "Home",
  data() {
    return {
      produtos: [],
      categorias: [
        { nome: "Roupas", value: "roupas", icone: "fas fa-tshirt", desc: "Mostre seu amor por código com estilo." },
        { nome: "Acessórios", value: "acessorios", icone: "fas fa-keyboard", desc: "Complete seu setup com itens incríveis." },
        { nome: "Canecas", value: "canecas", icone: "fas fa-mug-hot", desc: "Para aquele café que te salva durante o debug." },
        { nome: "Avatares", value: "avatares", icone: "fas fa-user-astronaut", desc: "Crie um avatar único para suas redes." }
      ],
      loading: true,
      error: null,
      showScrollButton: false,
      userType: "user",
      wishlistIds: [], // Array para armazenar IDs dos produtos favoritados
    };
  },
  computed: {
    isLoggedIn() {
      return !!localStorage.getItem('token');
    }
  },
  methods: {
    getImageUrl,
    async fetchProducts() {
      this.loading = true;
      this.error = null;
      try {
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
        this.error = 'Ops! Não foi possível carregar os produtos.';
        console.error("Erro detalhado:", err);
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
        const response = await api.get('/api/wishlist');
        this.wishlistIds = response.data.products.map(p => p._id);
      } catch (error) {
        console.error('Erro ao buscar wishlist:', error);
        this.wishlistIds = [];
      }
    },
    isInWishlist(productId) {
      return this.wishlistIds.includes(productId);
    },
    // --- FUNÇÃO addToCart CORRIGIDA ---
    async addToCart(produto) {
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

      // Se o produto for uma camiseta com tamanhos, redireciona para a página do produto
      if (produto.category === 'camisetas' && produto.sizes && produto.sizes.length > 0) {
        this.$router.push(`/products/${produto._id}`);
        return;
      }

      try {
        const cartItem = {
          productId: produto._id,
          quantity: 1,
          name: produto.name,
          price: produto.price,
          image: produto.image
        };

        // Usa a instância 'api' para enviar o item para o backend
        await api.post('/api/cart/add', cartItem);
        
        // Dispara um evento para o Header atualizar o contador do carrinho
        window.dispatchEvent(new Event('cart-updated'));

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
          await api.delete(`/api/wishlist/remove/${productId}`);
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
          
          window.dispatchEvent(new Event('wishlist-updated'));
        } else {
          // Adiciona aos favoritos
          await api.post('/api/wishlist/add', { productId });
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
          
          window.dispatchEvent(new Event('wishlist-updated'));
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
    },
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    handleScroll() {
      this.showScrollButton = window.scrollY > 200;
    },
  },
  async mounted() {
    window.addEventListener('scroll', this.handleScroll);
    await this.fetchProducts();
    await this.fetchWishlist();

    const userDataRaw = localStorage.getItem("userData");
    if (userDataRaw && userDataRaw !== "undefined") {
      const userData = JSON.parse(userDataRaw);
      this.userType = userData.role || (userData.user && userData.user.role) || "user";
    }
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
};
</script>

<style scoped>
@import '@fortawesome/fontawesome-free/css/all.css';

@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out forwards;
}

.animate-bounce {
    animation: bounce 1.5s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(-15%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}
</style>