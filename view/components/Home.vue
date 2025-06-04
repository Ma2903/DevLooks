<template>
  <div class="bg-gray-900 min-h-screen font-mono text-gray-200 relative">
    <!-- Banner de Boas-Vindas -->
    <section id="home" class="relative bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] text-white text-center py-40 overflow-hidden">
      <div class="absolute inset-0 bg-black opacity-60 bg-opacity-40 bg-cover bg-center" style="background-image: url('https://cdn.pixabay.com/photo/2016/11/29/09/08/online-shopping-1869235_960_720.jpg');"></div>
      <div class="relative z-10 container mx-auto px-4 md:px-6">
        <h1 class="text-5xl md:text-6xl font-extrabold mb-6 text-[#04d1b0] animate-fade-in">
          <i class="fas fa-shopping-cart mr-2"></i>Bem-vindo à Loja Geek
        </h1>
        <p class="text-lg md:text-xl mb-8 text-gray-200 animate-fade-in">
          Descubra produtos exclusivos para personalizar seu estilo e mostrar sua paixão por tecnologia!
        </p>
        <router-link
          to="/products"
          class="bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] hover:from-[#03b89a] hover:to-[#3e3ab8] text-white font-bold py-4 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 animate-fade-in text-lg"
        >
          <i class="fas fa-store mr-2"></i> Ver Produtos
        </router-link>
        <div class="mt-6 flex justify-center gap-4">
          <span class="bg-[#04d1b0] text-white px-4 py-2 rounded-full font-bold shadow-lg animate-bounce">
            Frete grátis acima de R$ 150
          </span>
          <span class="bg-[#4e44e1] text-white px-4 py-2 rounded-full font-bold shadow-lg animate-pulse">
            10% OFF na primeira compra!
          </span>
        </div>
      </div>
    </section>

    <!-- Seção "Categorias" -->
    <section id="categories" class="container mx-auto py-16 px-4 md:px-6 text-center">
      <h2 class="text-3xl md:text-4xl font-semibold text-[#04d1b0] mb-6">
        <i class="fas fa-th-large mr-2"></i>Categorias
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div
          v-for="cat in categorias"
          :key="cat.nome"
          class="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-2xl border-2 border-transparent hover:border-[#04d1b0] transition duration-300 flex flex-col items-center cursor-default group"
        >
          <i :class="cat.icone + ' text-5xl text-[#04d1b0] mb-4 group-hover:scale-110 transition'"></i>
          <h3 class="text-lg font-bold text-white">{{ cat.nome }}</h3>
          <p class="text-gray-300 mt-2">{{ cat.desc }}</p>
        </div>
      </div>
    </section>

    <!-- Seção "Produtos em Destaque" -->
    <section id="best-sellers" class="container mx-auto py-16 px-4 md:px-6">
      <h2 class="text-3xl md:text-4xl font-semibold text-[#04d1b0] text-center mb-8">
        <i class="fas fa-fire mr-2"></i>Mais Vendidos
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div
          v-for="produto in produtos"
          :key="produto._id"
          class="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 relative"
        >
          <span v-if="produto.novo" class="absolute top-2 left-2 bg-[#04d1b0] text-white text-xs px-2 py-1 rounded-full font-bold z-10">
            <i class="fas fa-star"></i> Novo
          </span>
          <span v-if="produto.promo" class="absolute top-2 right-2 bg-[#4e44e1] text-white text-xs px-2 py-1 rounded-full font-bold z-10">
            <i class="fas fa-bolt"></i> Promoção
          </span>
          <img
            :src="produto.image || '/camisa.jpg'"
            :alt="produto.name"
            class="w-full h-48 object-cover rounded-lg mb-4"
          />
          <h2 class="text-lg font-bold text-white mb-2">{{ produto.name }}</h2>
          <p class="text-gray-300 mb-4">{{ produto.description }}</p>
          <div class="flex justify-between items-center mb-4">
            <span class="text-[#04d1b0] font-bold text-lg">
              R$ {{ produto.price.toFixed(2) }}
            </span>
            <span class="bg-[#4e44e1] text-white text-sm font-medium px-4 py-1 rounded-lg">
              #{{ produto.category }}
            </span>
          </div>
          <router-link
            :to="`/product/${produto._id}`"
            class="block bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] hover:from-[#03b89a] hover:to-[#3e3ab8] text-white font-bold py-2 px-4 rounded-lg text-center transition duration-300 mb-2"
          >
            Ver Detalhes
          </router-link>
          <button
            @click="addToCart(produto)"
            class="w-full bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] hover:from-[#03b89a] hover:to-[#3e3ab8] text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition"
          >
            <i class="fas fa-cart-plus"></i> Adicionar ao Carrinho
          </button>
        </div>
      </div>
    </section>

    <!-- Seção "Benefícios" -->
    <section id="benefits" class="bg-gray-900 py-16">
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

    <!-- Seção de Newsletter -->
    <div class="bg-gradient-to-r from-[#04d1b0] to-[#4e44e1] py-8 mt-8 text-center rounded-lg">
      <h3 class="text-2xl font-bold text-white mb-4">
        <i class="fas fa-envelope mr-2"></i>Inscreva-se na nossa Newsletter
      </h3>
      <p class="text-gray-200 mb-6">Receba novidades, promoções e ofertas exclusivas diretamente no seu email!</p>
      <router-link
        to="/register"
        class="bg-[#04d1b0] hover:bg-[#03b89a] text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
      >
        <i class="fas fa-user-plus mr-2"></i> Inscrever-se
      </router-link>
    </div>

    <!-- Seção "Sobre Nós" -->
    <section id="about" class="container mx-auto py-16 px-4 md:px-6 text-center">
      <h2 class="text-3xl md:text-4xl font-semibold text-[#04d1b0] mb-6">
        <i class="fas fa-info-circle mr-2"></i>Sobre Nós
      </h2>
      <p class="text-lg md:text-xl text-gray-300 leading-relaxed mb-6">
        Bem-vindo à <span class="text-[#04d1b0] font-bold">Loja Geek</span>, o lugar perfeito para os apaixonados por tecnologia, cultura pop e personalização. Nossa missão é oferecer produtos exclusivos e de alta qualidade que combinem estilo, funcionalidade e inovação.
      </p>
      <p class="text-lg md:text-xl text-gray-300 leading-relaxed mb-6">
        Desde avatares personalizados até acessórios únicos, trabalhamos para trazer o que há de mais moderno e criativo para o seu dia a dia. Seja para expressar sua paixão por tecnologia ou para presentear alguém especial, aqui você encontra tudo o que precisa.
      </p>
      <p class="text-lg md:text-xl text-gray-300 leading-relaxed mb-6">
        Na <span class="text-[#04d1b0] font-bold">Loja Geek</span>, valorizamos a experiência do cliente. Por isso, oferecemos:
      </p>
      <ul class="text-lg md:text-xl text-gray-300 leading-relaxed list-disc list-inside mb-6">
        <li>Frete grátis para compras acima de R$ 150,00.</li>
        <li>Devolução fácil e sem custo em até 30 dias.</li>
        <li>Pagamento seguro com criptografia avançada.</li>
        <li>Atendimento ao cliente dedicado e personalizado.</li>
      </ul>
      <p class="text-lg md:text-xl text-gray-300 leading-relaxed">
        Estamos sempre em busca de novidades e tendências para garantir que você tenha acesso aos melhores produtos do mercado. Junte-se à nossa comunidade e descubra como é fácil transformar o seu estilo e destacar-se no mundo digital!
      </p>
    </section>

    <!-- Seção "Depoimentos" -->
    <section class="container mx-auto py-16 px-4 md:px-6 text-center">
      <h2 class="text-3xl md:text-4xl font-semibold text-[#04d1b0] mb-6">
        <i class="fas fa-comments mr-2"></i>O que dizem nossos clientes
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="bg-gray-800 p-6 rounded-lg shadow-lg"> 
          <i class="fas fa-user-circle text-4xl text-[#04d1b0] mb-2"></i>
          <p class="text-gray-300 mb-2">"Produtos incríveis, entrega rápida e atendimento excelente!"</p>
        </div>
        <div class="bg-gray-800 p-6 rounded-lg shadow-lg"> 
          <i class="fas fa-user-circle text-4xl text-[#04d1b0] mb-2"></i>
          <p class="text-gray-300 mb-2">"A qualidade dos produtos é excepcional, recomendo a todos!"</p>
        </div>
        <div class="bg-gray-800 p-6 rounded-lg shadow-lg"> 
          <i class="fas fa-user-circle text-4xl text-[#04d1b0] mb-2"></i>
          <p class="text-gray-300 mb-2">"Minha loja favorita para itens geek, sempre inovando!"</p>
        </div>
      </div>
    </section>

    <!-- Botão para voltar ao topo -->
    <button
      v-show="showScrollButton"
      @click="scrollToTop"
      class="fixed bottom-4 right-4 bg-[#04d1b0] hover:bg-[#4e44e1] text-white font-bold py-3 px-4 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 animate-fade-in"
    >
      <i class="fas fa-arrow-up"></i>
    </button>

  </div>
</template>

<script>
import Product from './Product.vue';
import ProductService from '../services/ProductService';

export default {
  name: "Home",
  components: {
    Product
  },
  data() {
    return {
      produtos: [], // Lista de produtos
      categorias: [
  { nome: "Avatares", value: "avatares", icone: "fas fa-user-astronaut", desc: "Personalize seu avatar com acessórios únicos." },
  { nome: "Skins", value: "skins", icone: "fas fa-tshirt", desc: "Dê um toque especial ao seu estilo com nossas skins." },
  { nome: "Acessórios", value: "acessorios", icone: "fas fa-keyboard", desc: "Teclados, mouses e muito mais para completar seu setup." },
  { nome: "Presentes", value: "presentes", icone: "fas fa-gift", desc: "Encontre o presente perfeito para seus amigos geeks." }
], // Lista de categorias
      loading: true, // Estado de carregamento
      error: null, // Estado de erro
      showScrollButton: false
    };
  },
  methods: {
    async fetchProducts() {
      try {
        this.loading = true;
        this.error = null;
        this.produtos = await ProductService.getAllProducts(); // Busca os produtos
      } catch (err) {
        this.error = 'Erro ao carregar os produtos. Tente novamente mais tarde.';
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    handleScroll() {
      this.showScrollButton = window.scrollY > 200;
    },
    scrollToSection(sectionId) {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  },
  async mounted() {
    window.addEventListener('scroll', this.handleScroll);
    await this.fetchProducts(); // Chama o método para buscar os produtos
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  }
};
</script>

<style scoped>
@import '@fortawesome/fontawesome-free/css/all.css';

/* Estilos adicionais */
body {
  font-family: 'Fira Code', monospace;
}

button:hover {
  transform: scale(1.05);
}

section {
  border-top: 2px solid #444444;
}

section.bg-gradient-to-r {
  background-image: linear-gradient(to right, #04d1b0, #4e44e1);
}

section.bg-gradient-to-r .container h1 {
  color: #04d1b0;
}

section.bg-gradient-to-r .container p {
  color: #E5E7EB;
}

footer {
  border-top: 2px solid #444444;
}

footer a:hover {
  color: #04d1b0;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>