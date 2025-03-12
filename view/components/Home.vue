<template>
  <div class="bg-gray-900 min-h-screen font-mono text-gray-200 relative">
    <!-- Seção de Boas-Vindas -->
    <section class="bg-gradient-to-r from-purple-800 to-black text-white text-center py-16 relative">
      <div class="absolute inset-0 bg-black opacity-60 bg-opacity-40 bg-repeat" style="background-image: url('https://cdn.pixabay.com/photo/2020/05/20/08/16/code-5199736_960_720.jpg');"></div>
      <div class="relative z-10 container mx-auto px-6">
        <h1 class="text-5xl font-semibold mb-4 text-purple-400 animate-fade-in"><i class="fas fa-code mr-2"></i>Bem-vindo à Loja de Avatares</h1>
        <p class="text-lg mb-8 animate-fade-in">Personalize seu avatar exclusivo para GitHub e Discord. Dê um toque geek ao seu perfil!</p>
        <router-link to="/create-avatar">
          <button class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 animate-fade-in">
            <i class="fas fa-user-astronaut mr-2"></i>Criar e Editar Avatar
          </button>
        </router-link>
      </div>
    </section>

    <!-- Seção "Sobre" -->
    <section id="about" class="container mx-auto py-16 px-6 text-center">
      <h2 class="text-3xl font-semibold text-purple-400 mb-4"><i class="fas fa-info-circle mr-2"></i>Sobre o Projeto</h2>
      <p class="text-lg text-gray-300">
        Este projeto foi feito para programadores que querem criar avatares personalizados para suas contas no GitHub e Discord. Uma maneira divertida de mostrar seu estilo no mundo digital!
      </p>
      <h3 class="text-2xl font-semibold text-purple-400 mt-12 mb-4"><i class="fas fa-users mr-2"></i>Programadores do Projeto</h3>
      <div class="flex justify-center">
        <figure class="text-center">
          <img src="../assets/logo_teste.jpg" alt="João - Back-End" class="rounded-full shadow-lg w-36 h-36 mx-auto">
          <figcaption class="mt-2 text-lg text-purple-400">João Pedro - Back-End</figcaption>
        </figure>
        <figure class="text-center">
          <img src="../assets/Eu.jpeg" alt="Manoela - Front-End" class="rounded-full shadow-lg w-36 h-36 mx-auto">
          <figcaption class="mt-2 text-lg text-purple-400">Manoela - Front-End</figcaption>
        </figure>
      </div>
    </section>

    <!-- Seção de Funcionalidades -->
    <section id="features" class="bg-gray-900 py-16">
      <h2 class="text-3xl font-semibold text-purple-400 text-center mb-8">Funcionalidades</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div class="text-center">
          <i class="fas fa-palette text-5xl text-purple-400"></i>
          <h3 class="text-xl font-semibold text-white mt-4">Personalização Completa</h3>
          <p class="text-gray-300 mt-2">Escolha cores, acessórios e mais para seu avatar.</p>
        </div>
        <div class="text-center">
          <i class="fas fa-cloud-upload-alt text-5xl text-purple-400"></i>
          <h3 class="text-xl font-semibold text-white mt-4">Upload de Imagens</h3>
          <p class="text-gray-300 mt-2">Faça upload de suas próprias imagens para personalizar ainda mais.</p>
        </div>
        <div class="text-center">
          <i class="fas fa-sync-alt text-5xl text-purple-400"></i>
          <h3 class="text-xl font-semibold text-white mt-4">Atualizações Instantâneas</h3>
          <p class="text-gray-300 mt-2">Altere seu avatar sempre que quiser e veja a atualização em tempo real.</p>
        </div>
      </div>
    </section>

    <!-- Seção de Produtos -->
    <section id="products" class="container mx-auto py-16 px-6 text-center">
      <h2 class="text-3xl font-semibold text-purple-400 mb-4"><i class="fas fa-box-open mr-2"></i>Produtos</h2>
      <div v-if="loading" class="text-lg text-gray-300">Carregando...</div>
      <div v-else-if="error" class="text-lg text-red-500">{{ error }}</div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Product v-for="produto in produtos" :key="produto.id" :product="produto" />
      </div>
    </section>

    <!-- Rodapé -->
    <footer class="bg-gray-800 text-white text-center py-6">
      <p>&copy; 2025 Loja de Avatares. Todos os direitos reservados.</p>
    </footer>

    <!-- Botão para voltar ao topo -->
    <button v-show="showScrollButton" @click="scrollToTop" class="fixed bottom-4 right-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 animate-fade-in">
      <i class="fas fa-arrow-up"></i>
    </button>
  </div>
</template>

<script>
import Product from './Product.vue';

export default {
  name: "Home",
  components: {
    Product
  },
  props: {
    produtos: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      required: true
    },
    error: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      showScrollButton: false
    };
  },
  methods: {
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    handleScroll() {
      this.showScrollButton = window.scrollY > 200;
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
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
  font-family: 'Fira Code', monospace; /* Fonte monoespaçada para simular terminal */
}

header {
  background-color: #232323;
}

a:hover {
  color: #9B4DFF; /* Roxo vibrante nos links quando passa o mouse */
}

button:hover {
  transform: scale(1.05);
  background-color: #6B21A8; /* Roxo mais escuro nos botões ao passar o mouse */
}

/* Ajustes no botão para aparência futurista */
button {
  border-radius: 50px;
  padding: 12px 24px;
  font-size: 18px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

footer {
  background-color: #1A1A1A;
}

section {
  border-top: 2px solid #444444;
}

section.bg-gradient-to-r {
  background-image: linear-gradient(to right, #5B21B6, #111111); /* Roxo escuro para combinar com o tema geek */
}

section.bg-gradient-to-r:before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: -1;
}

section.bg-gradient-to-r .container h1 {
  color: #9B4DFF; /* Título em roxo vibrante */
}

section.bg-gradient-to-r .container p {
  color: #E5E7EB; /* Texto claro no fundo escuro */
}

figure {
  display: inline-block;
  margin: 0;
}

figcaption {
  margin-top: 0.5rem;
  font-size: 1rem;
  color: #9B4DFF;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fade-in 1s ease-in-out;
}
</style>