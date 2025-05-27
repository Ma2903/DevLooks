<template>
  <header class="bg-gray-900 text-white p-4 md:p-6 shadow-lg sticky top-0 z-50">
    <div class="container mx-auto flex flex-wrap justify-between items-center">
      <!-- Logo e Título -->
      <div class="flex items-center space-x-4">
        <img
          src="../assets/logo_teste.jpg"
          alt="Logo da Loja Geek"
          class="w-16 h-16 md:w-20 md:h-20 rounded-full shadow-lg"
        />
        <div>
          <h1 class="text-3xl md:text-4xl font-extrabold text-purple-400 tracking-wide font-poppins">
            Loja Geek
          </h1>
        </div>
      </div>

      <!-- Navegação -->
      <nav
        :class="{'hidden': !menuOpen, 'block': menuOpen}"
        class="w-full md:w-auto md:flex md:items-center md:space-x-6 text-lg md:text-xl mt-4 md:mt-0"
      >
        <ul class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
          <!-- Botão Home -->
          <li>
            <router-link
              to="/Home"
              class="hover:text-purple-500 flex items-center space-x-1"
            >
              <i class="fas fa-home"></i><span>Home</span>
            </router-link>
          </li>

          <!-- Botão Criar Avatar -->
          <li>
            <router-link
              to="/create-avatar"
              class="hover:text-purple-500 flex items-center space-x-1"
            >
              <i class="fas fa-user-astronaut"></i><span>Criar Avatar</span>
            </router-link>
          </li>

          <!-- Botão Ver Produtos ou Gerenciar Produtos -->
          <li v-if="userType === 'admin'">
            <router-link
              to="/admin/products"
              class="hover:text-purple-500 flex items-center space-x-1"
            >
              <i class="fas fa-cogs"></i><span>Gerenciar Produtos</span>
            </router-link>
          </li>
          <li v-else>
            <router-link
              to="/products"
              class="hover:text-purple-500 flex items-center space-x-1"
            >
              <i class="fas fa-store"></i><span>Produtos</span>
            </router-link>
          </li>

          <!-- Botão Carrinho -->
          <li>
            <router-link
              to="/cart"
              class="hover:text-purple-500 flex items-center space-x-1"
            >
              <i class="fas fa-shopping-cart"></i>
              <span>Carrinho</span>
            </router-link>
          </li>

          <!-- Botão Perfil ou Entrar -->
          <li>
            <router-link
              v-if="isLoggedIn"
              to="/profile"
              class="hover:text-purple-500 flex items-center space-x-1"
            >
              <i class="fas fa-user"></i><span>Perfil</span>
            </router-link>
            <router-link
              v-else
              to="/login"
              class="hover:text-purple-500 flex items-center space-x-1"
            >
              <i class="fas fa-sign-in-alt"></i><span>Entrar</span>
            </router-link>
          </li>
        </ul>
      </nav>

      <!-- Menu Toggle Button -->
      <button @click="toggleMenu" class="md:hidden text-2xl">
        <i :class="menuOpen ? 'fas fa-times' : 'fas fa-bars'"></i>
      </button>
    </div>
  </header>
</template>
<script>
export default {
  name: "Header",
  data() {
    return {
      menuOpen: false,
      isLoggedIn: !!localStorage.getItem("token"),
      userType: "user",
    };
  },
  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
    atualizarUserType() {
      let userDataRaw = localStorage.getItem("userData");
      let userData = {};
      if (userDataRaw && userDataRaw !== "undefined") {
        userData = JSON.parse(userDataRaw);
      }
      this.userType = userData.role || (userData.user && userData.user.role) || "user";
      this.isLoggedIn = !!localStorage.getItem("token");
      console.log("userType Header:", this.userType);
    },
  },
  created() {
    this.atualizarUserType();
    window.addEventListener("storage", this.atualizarUserType);
  },
  beforeDestroy() {
    window.removeEventListener("storage", this.atualizarUserType);
  },
  watch: {
    $route() {
      this.atualizarUserType();
    }
  }
};
</script>

<style scoped>
@import '@fortawesome/fontawesome-free/css/all.css';
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&display=swap');

/* Estilo do Header */
header {
  background-color: #1a202c; /* Fundo escuro */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Sombra leve */
}

/* Logo e Título */
h1 {
  font-family: "Poppins", sans-serif; /* Fonte estilizada para o título */
  letter-spacing: 1px;
  text-transform: uppercase; /* Deixa o título em letras maiúsculas */
}

/* Links de Navegação */
a {
  transition: color 0.3s ease;
}

a:hover {
  color: #9b4dff; /* Roxo vibrante */
}

/* Botão de Menu */
button:hover {
  transform: scale(1.1);
  color: #9b4dff;
}
</style>